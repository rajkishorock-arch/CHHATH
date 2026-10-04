import { DynamicReel, ReelUser } from '../../types';
import { FirstPartyProvider } from './FirstPartyProvider';
import { YouTubeProvider } from './YouTubeProvider';
import { InstagramProvider } from './InstagramProvider';
import { ReelsStorage } from '../reelsStorage';
import { FeedFetchOptions, FeedPageResponse } from './types';

interface CursorState {
  batch: number;
  fpOffset: number;
  igOffset: number;
  extOffset: number;
  timestamp: number;
}

function encodeCursor(state: CursorState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch {
    return `${state.batch}_${state.fpOffset}_${state.igOffset}_${state.extOffset}`;
  }
}

function decodeCursor(cursorStr: string | null | undefined): CursorState {
  if (!cursorStr) {
    return { batch: 0, fpOffset: 0, igOffset: 0, extOffset: 0, timestamp: Date.now() };
  }
  try {
    const json = atob(cursorStr);
    const parsed = JSON.parse(json);
    return {
      batch: typeof parsed.batch === 'number' ? parsed.batch : 0,
      fpOffset: typeof parsed.fpOffset === 'number' ? parsed.fpOffset : 0,
      igOffset: typeof parsed.igOffset === 'number' ? parsed.igOffset : 0,
      extOffset: typeof parsed.extOffset === 'number' ? parsed.extOffset : 0,
      timestamp: parsed.timestamp || Date.now()
    };
  } catch {
    return { batch: 0, fpOffset: 0, igOffset: 0, extOffset: 0, timestamp: Date.now() };
  }
}

export const FeedService = {
  /**
   * Fetch a single page batch of personalized, validated reels via cursor pagination
   */
  async getFeedPage(options: FeedFetchOptions): Promise<FeedPageResponse> {
    const {
      cursor,
      limit = 10,
      feedType,
      currentUser,
      selectedCategory,
      selectedHashtag,
      selectedUsername
    } = options;

    const state = decodeCursor(cursor);

    // 1. Fetch First-Party batch
    const fpResult = FirstPartyProvider.getItems(
      {
        feedType,
        currentUser,
        selectedCategory,
        selectedHashtag,
        selectedUsername
      },
      state.fpOffset,
      Math.min(limit, 4)
    );

    let batchItems: DynamicReel[] = [...fpResult.items];
    let nextFpOffset = fpResult.nextIndex;
    let nextIgOffset = state.igOffset;
    let nextExtOffset = state.extOffset;

    // 2. Fetch Instagram batch (Curated authentic Chhath Instagram Reels)
    const isDedicatedUserFeed = feedType === 'user' && selectedUsername;
    if (!isDedicatedUserFeed) {
      const igResult = InstagramProvider.getItems(
        {
          feedType,
          currentUser,
          selectedCategory,
          selectedHashtag
        },
        state.igOffset,
        3
      );
      nextIgOffset = igResult.nextIndex;
      if (igResult.items.length > 0) {
        batchItems.push(...igResult.items);
      }
    }

    // 3. Check Deficit for YouTube Fallback
    const deficit = limit - batchItems.length;

    if (deficit > 0 && !isDedicatedUserFeed) {
      // Need external validated YouTube items to complete the batch
      const ytResult = await YouTubeProvider.getValidatedItems(
        {
          feedType,
          currentUser,
          selectedCategory,
          selectedHashtag
        },
        state.extOffset,
        deficit
      );

      nextExtOffset = ytResult.nextIndex;

      // Interweave: smoothly mix community, Instagram and YouTube reels
      if (batchItems.length > 0 && ytResult.items.length > 0) {
        const combined: DynamicReel[] = [];
        const baseQueue = [...batchItems];
        const ytQueue = [...ytResult.items];

        while (baseQueue.length > 0 || ytQueue.length > 0) {
          if (baseQueue.length > 0) combined.push(baseQueue.shift()!);
          if (ytQueue.length > 0) combined.push(ytQueue.shift()!);
        }
        batchItems = combined;
      } else if (ytResult.items.length > 0) {
        batchItems = ytResult.items;
      }
    }

    // 4. Deduplication: Ensure each reel in this batch has a unique ID and unique video
    const seenIds = new Set<string>();
    const seenVideos = new Set<string>();
    const deduplicated: DynamicReel[] = [];

    for (const item of batchItems) {
      const vidKey = item.youtubeVideoId || item.instagramShortcode || item.videoUrl;
      if (!seenIds.has(item.id) && (!vidKey || !seenVideos.has(vidKey))) {
        seenIds.add(item.id);
        if (vidKey) seenVideos.add(vidKey);
        deduplicated.push(item);
      }
    }
    batchItems = deduplicated;

    // 5. Construct Next Cursor
    const nextCursor = encodeCursor({
      batch: state.batch + 1,
      fpOffset: nextFpOffset,
      igOffset: nextIgOffset,
      extOffset: nextExtOffset,
      timestamp: Date.now()
    });

    const hasMore = true; // Always allow endless infinite scrolling for live Chhath reels

    return {
      items: batchItems,
      nextCursor,
      hasMore
    };
  },

  /**
   * Handle video playback error by blacklisting the failed video and
   * replacing it in the active feed in-place with zero interruption to the user.
   */
  async replaceFailedVideo(
    failedReelId: string,
    failedYouTubeVideoId: string | undefined,
    currentItems: DynamicReel[],
    currentUser: ReelUser | null
  ): Promise<{ updatedItems: DynamicReel[]; replacementItem: DynamicReel | null }> {
    const userId = currentUser?.id || 'guest';

    // 1. Block the failed video ID permanently
    if (failedYouTubeVideoId) {
      ReelsStorage.addBlockedVideoId(failedYouTubeVideoId);
    }
    ReelsStorage.addNotInterested(userId, {
      reelId: failedReelId,
      youtubeId: failedYouTubeVideoId,
      timestamp: Date.now()
    });

    // 2. Locate failed item index
    const targetIdx = currentItems.findIndex(r => r.id === failedReelId);
    if (targetIdx === -1) {
      return { updatedItems: currentItems, replacementItem: null };
    }

    // 3. Find candidate replacement not already in currentItems
    const existingIds = new Set(currentItems.map(r => r.id));
    const existingYtIds = new Set(
      currentItems.map(r => r.youtubeVideoId).filter(Boolean) as string[]
    );

    // Try finding a first-party replacement first
    const allFirstParty = ReelsStorage.getReels().filter(
      r => r.status === 'approved' && !existingIds.has(r.id)
    );

    let replacement: DynamicReel | null = null;
    if (allFirstParty.length > 0) {
      replacement = allFirstParty[0];
    } else {
      // Check eligible Instagram reels first
      const igCandidates = InstagramProvider.getCandidatePool({ feedType: 'foryou', currentUser });
      const eligibleIg = igCandidates.find(r => !existingIds.has(r.id));
      if (eligibleIg) {
        replacement = eligibleIg;
      } else {
        // Fetch a validated YouTube replacement
        const ytCandidates = await YouTubeProvider.getValidatedItems(
          { feedType: 'foryou', currentUser },
          targetIdx + 5,
          5
        );
        const eligibleYt = ytCandidates.items.find(
          r => r.youtubeVideoId && !existingYtIds.has(r.youtubeVideoId)
        );
        if (eligibleYt) {
          replacement = eligibleYt;
        }
      }
    }

    // 4. Update the array
    const updated = [...currentItems];
    if (replacement) {
      updated[targetIdx] = replacement;
    } else {
      // If no candidate found, remove the broken item so the feed simply flows to the next reel
      updated.splice(targetIdx, 1);
    }

    return {
      updatedItems: updated,
      replacementItem: replacement
    };
  }
};
