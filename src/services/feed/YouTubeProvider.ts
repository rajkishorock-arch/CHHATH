import { DynamicReel, ReelUser, ReelCategory } from '../../types';
import { ReelsStorage, EXTERNAL_CHHATH_SEED_CATALOG } from '../reelsStorage';
import { CachedYouTubeVideo, VideoValidationStatus } from './types';

export interface YouTubeFilterOptions {
  feedType: string;
  currentUser: ReelUser | null;
  selectedCategory?: ReelCategory | null;
  selectedHashtag?: string | null;
}

export const YouTubeProvider = {
  /**
   * Pre-flight validate a single YouTube video ID.
   * Returns true if public and embeddable, false otherwise.
   */
  async validateVideo(youtubeVideoId: string): Promise<{ isValid: boolean; metadata?: Partial<CachedYouTubeVideo> }> {
    if (!youtubeVideoId || youtubeVideoId.length < 5) {
      return { isValid: false };
    }

    // 1. Check if permanently blocked
    if (ReelsStorage.isBlockedVideo(youtubeVideoId)) {
      return { isValid: false };
    }

    // 2. Check local validation cache
    const cache = ReelsStorage.getCachedYouTubeVideos();
    const cached = cache[youtubeVideoId];
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    if (cached && (Date.now() - cached.lastValidatedAt) < SEVEN_DAYS_MS) {
      return {
        isValid: cached.status === 'VALID',
        metadata: cached
      };
    }

    // 3. Pre-flight check via official YouTube oEmbed API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(youtubeVideoId)}&format=json`;
      const response = await fetch(oEmbedUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const cachedItem: CachedYouTubeVideo = {
          youtubeVideoId,
          title: data.title || '',
          thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`,
          channelTitle: data.author_name || 'YouTube Devotional',
          embeddable: true,
          lastValidatedAt: Date.now(),
          status: 'VALID'
        };
        ReelsStorage.setCachedYouTubeVideo(cachedItem);
        return { isValid: true, metadata: cachedItem };
      } else {
        // HTTP 401, 403, 404 indicates non-embeddable, private, or deleted video
        const blockedItem: CachedYouTubeVideo = {
          youtubeVideoId,
          title: '',
          thumbnail: '',
          channelTitle: '',
          embeddable: false,
          lastValidatedAt: Date.now(),
          status: 'BLOCKED',
          errorCode: response.status
        };
        ReelsStorage.setCachedYouTubeVideo(blockedItem);
        ReelsStorage.addBlockedVideoId(youtubeVideoId);
        return { isValid: false };
      }
    } catch {
      // If network offline or fetch failed, fall back to cached status if available
      if (cached && cached.status === 'VALID') {
        return { isValid: true, metadata: cached };
      }
      // For seed catalog items known to be valid, allow with warning
      const isKnownSeed = EXTERNAL_CHHATH_SEED_CATALOG.some(r => r.youtubeVideoId === youtubeVideoId);
      return { isValid: isKnownSeed };
    }
  },

  /**
   * Get candidate pool of YouTube reels
   */
  getCandidatePool(options: YouTubeFilterOptions): DynamicReel[] {
    const { currentUser, selectedCategory, selectedHashtag } = options;
    const userId = currentUser?.id || 'guest';
    const catalog = ReelsStorage.getExternalCatalog();

    return catalog.filter(reel => {
      if (!reel.youtubeVideoId) return false;

      // Check blocklist
      if (ReelsStorage.isBlockedVideo(reel.youtubeVideoId)) return false;

      // Check user suppression ("Not Interested")
      if (ReelsStorage.isItemSuppressed(userId, reel.id, reel.youtubeVideoId)) return false;

      // Filter by category if requested
      if (selectedCategory && reel.category !== selectedCategory) return false;

      // Filter by hashtag if requested
      if (selectedHashtag) {
        const cleanTag = selectedHashtag.startsWith('#') ? selectedHashtag : `#${selectedHashtag}`;
        const hasTag = (reel.tags || []).some(t => t.toLowerCase() === cleanTag.toLowerCase());
        if (!hasTag) return false;
      }

      return true;
    });
  },

  /**
   * Get a slice of validated external YouTube reels
   */
  async getValidatedItems(
    options: YouTubeFilterOptions, 
    startIndex: number, 
    count: number
  ): Promise<{ items: DynamicReel[]; nextIndex: number; hasMore: boolean }> {
    const pool = this.getCandidatePool(options);
    if (pool.length === 0) {
      return { items: [], nextIndex: 0, hasMore: false };
    }

    const items: DynamicReel[] = [];
    let idx = startIndex;
    let attempts = 0;
    const maxAttempts = pool.length * 3;

    while (items.length < count && idx < pool.length && attempts < maxAttempts) {
      const candidate = pool[idx];

      if (candidate && candidate.youtubeVideoId) {
        const validation = await this.validateVideo(candidate.youtubeVideoId);
        if (validation.isValid) {
          items.push({
            ...candidate,
            id: candidate.id,
            title: validation.metadata?.title || candidate.title,
            thumbnailUrl: validation.metadata?.thumbnail || candidate.thumbnailUrl,
            channelTitle: validation.metadata?.channelTitle || candidate.channelTitle,
            sourceType: 'YOUTUBE',
            isEmbeddable: true
          });
        }
      }

      idx++;
      attempts++;
    }

    return {
      items,
      nextIndex: idx,
      hasMore: idx < pool.length
    };
  }
};
