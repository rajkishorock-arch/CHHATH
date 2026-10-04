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

    let nextFpOffset = state.fpOffset;
    let nextIgOffset = state.igOffset;
    let nextExtOffset = state.extOffset;

    // 1. Fetch Verified Trending Chhath Shorts from YouTube Provider (Primary authentic source, 60fps, zero lag)
    const isDedicatedUserFeed = feedType === 'user' && selectedUsername;
    let ytItems: DynamicReel[] = [];
    if (!isDedicatedUserFeed) {
      const ytResult = await YouTubeProvider.getValidatedItems(
        {
          feedType,
          currentUser,
          selectedCategory,
          selectedHashtag
        },
        state.extOffset,
        limit
      );
      nextExtOffset = ytResult.nextIndex;
      ytItems = ytResult.items;
    }

    // 2. Fetch First-Party Community Reels
    const fpResult = FirstPartyProvider.getItems(
      {
        feedType,
        currentUser,
        selectedCategory,
        selectedHashtag,
        selectedUsername
      },
      state.fpOffset,
      Math.min(limit, 3)
    );
    nextFpOffset = fpResult.nextIndex;

    // 3. Fetch Curated Instagram Reels (only genuine without dummy fallback)
    let igItems: DynamicReel[] = [];
    if (!isDedicatedUserFeed) {
      const igResult = InstagramProvider.getItems(
        {
          feedType,
          currentUser,
          selectedCategory,
          selectedHashtag
        },
        state.igOffset,
        2
      );
      nextIgOffset = igResult.nextIndex;
      igItems = igResult.items.filter(r => !r.videoUrl?.includes('/videos/chhath_reel_') && !r.videoUrl?.includes('/videos/sample'));
    }

    // Blend: Place verified trending Chhath Shorts at the forefront, interweaving community & Instagram
    let batchItems: DynamicReel[] = [...ytItems];
    if (fpResult.items.length > 0 || igItems.length > 0) {
      const extraQueue = [...fpResult.items, ...igItems];
      const combined: DynamicReel[] = [];
      const ytQueue = [...ytItems];

      while (ytQueue.length > 0 || extraQueue.length > 0) {
        if (ytQueue.length > 0) combined.push(ytQueue.shift()!);
        if (extraQueue.length > 0) combined.push(extraQueue.shift()!);
      }
      batchItems = combined;
    }

    // Strict filter: Discard any dummy stock videos completely
    batchItems = batchItems.filter(r => 
      !r.videoUrl?.includes('/videos/sample') &&
      !r.videoUrl?.includes('/videos/chhath_reel_') &&
      !r.videoUrl?.includes('mixkit.co') &&
      !r.id.startsWith('demo-reel-')
    );

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
