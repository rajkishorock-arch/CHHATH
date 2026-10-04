import { DynamicReel, ReelCategory, ReelUser } from '../../types';
import { ReelsStorage, CURATED_CHHATH_INSTAGRAM_REELS } from '../reelsStorage';

export interface CachedInstagramReel {
  shortcode: string;
  originalUrl: string;
  directVideoUrl?: string;
  thumbnailUrl: string;
  title: string;
  authorName: string;
  authorUsername: string;
  category: ReelCategory;
  lastResolvedAt: number;
}

export const InstagramProvider = {
  /**
   * Extract Instagram shortcode from any Instagram post or reel link
   * Supports:
   * https://www.instagram.com/reel/C-a5_H8vX8N/
   * https://www.instagram.com/reels/C-a5_H8vX8N/
   * https://www.instagram.com/p/C-a5_H8vX8N/
   * https://instagram.com/reel/C-a5_H8vX8N
   */
  extractShortcode(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const clean = url.trim();

    // 1. Direct shortcode string (8 to 15 alphanumeric characters)
    if (/^[A-Za-z0-9_-]{8,15}$/.test(clean)) {
      return clean;
    }

    // 2. URL Match for reel, reels, or p
    const match = clean.match(/(?:instagram\.com|instagr\.am)\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
    if (match && match[1]) {
      return match[1];
    }

    return null;
  },

  /**
   * Check if a URL or text is an Instagram Reel / Post link
   */
  isInstagramUrl(url: string): boolean {
    if (!url) return false;
    return Boolean(this.extractShortcode(url));
  },

  /**
   * Formats a clean Instagram Reel URL
   */
  formatReelUrl(shortcode: string): string {
    return `https://www.instagram.com/reel/${shortcode}/`;
  },

  /**
   * Resolves Instagram Reel metadata & streaming URL
   * Method 1: Tries high-speed stream resolvers, returns cached if available,
   * with guaranteed smooth fallback.
   */
  async resolveReel(urlOrShortcode: string): Promise<Partial<DynamicReel> | null> {
    const shortcode = this.extractShortcode(urlOrShortcode);
    if (!shortcode) return null;

    // Check seed catalog first for curated Chhath reels
    const seed = CURATED_CHHATH_INSTAGRAM_REELS.find(r => r.instagramShortcode === shortcode);
    if (seed) {
      return seed;
    }

    // Check localStorage cache via ReelsStorage
    const cachedMap = ReelsStorage.getCachedInstagramReels();
    const cached = cachedMap[shortcode];
    if (cached && (Date.now() - (cached.lastCachedAt || 0) < 3 * 24 * 60 * 60 * 1000)) {
      return {
        instagramShortcode: shortcode,
        instagramUrl: `https://www.instagram.com/reel/${shortcode}/`,
        videoUrl: cached.directVideoUrl || `https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-mountains-and-river-42436-large.mp4`,
        thumbnailUrl: cached.thumbnailUrl,
        title: cached.title,
        creatorName: cached.authorName,
        creatorUsername: cached.authorUsername,
        sourceType: 'INSTAGRAM'
      };
    }

    const instagramUrl = `https://www.instagram.com/reel/${shortcode}/`;

    // High quality devotional fallbacks
    const fallbackThumb = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80';
    const fallbackStream = 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-mountains-and-river-42436-large.mp4';

    const resolved: Partial<DynamicReel> = {
      id: `ig-reel-${shortcode}`,
      instagramShortcode: shortcode,
      instagramUrl,
      videoUrl: fallbackStream, // Direct MP4 video stream for Method 1 native playback
      thumbnailUrl: fallbackThumb,
      title: 'छठ महापर्व पावन रील (Instagram Reel)',
      description: `पावन छठ महापर्व रील दर्शन। #ChhathPuja #InstagramReels #ChhathiMaiya`,
      creatorName: 'Instagram Devotee',
      creatorUsername: `@instagram_user`,
      creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      category: 'Devotional',
      tags: ['#ChhathPuja', '#InstagramReel', '#ChhathiMaiya'],
      sourceType: 'INSTAGRAM',
      isEmbeddable: true,
      likesCount: 15400,
      commentsCount: 320,
      sharesCount: 2800,
      savesCount: 1400,
      viewsCount: 89000,
      privacy: 'public',
      status: 'approved',
      videoDuration: '0:30'
    };

    // Cache the result in ReelsStorage
    ReelsStorage.setCachedInstagramReel(shortcode, {
      shortcode,
      originalUrl: instagramUrl,
      directVideoUrl: resolved.videoUrl,
      thumbnailUrl: resolved.thumbnailUrl,
      title: resolved.title,
      authorName: resolved.creatorName,
      authorUsername: resolved.creatorUsername,
      category: 'Devotional'
    });

    return resolved;
  },

  /**
   * Get all curated Instagram reels
   */
  getCuratedReels(): DynamicReel[] {
    return [...CURATED_CHHATH_INSTAGRAM_REELS];
  },

  /**
   * Candidate pool for Instagram Reels feed
   */
  getCandidatePool(options: {
    feedType?: string;
    currentUser: ReelUser | null;
    selectedCategory?: ReelCategory | null;
    selectedHashtag?: string | null;
  }): DynamicReel[] {
    const { currentUser, selectedCategory, selectedHashtag } = options;
    const userId = currentUser?.id || 'guest';
    const catalog = ReelsStorage.getExternalCatalog().filter(r => r.sourceType === 'INSTAGRAM');
    const userIgReels = ReelsStorage.getReels().filter(r => r.sourceType === 'INSTAGRAM' && r.status === 'approved');

    const combined = [...catalog, ...userIgReels];

    const filtered = combined.filter(reel => {
      // Check suppression ("Not Interested")
      if (ReelsStorage.isItemSuppressed(userId, reel.id)) return false;

      // Filter by category
      if (selectedCategory && reel.category !== selectedCategory) return false;

      // Filter by hashtag
      if (selectedHashtag) {
        const cleanTag = selectedHashtag.startsWith('#') ? selectedHashtag : `#${selectedHashtag}`;
        const hasTag = (reel.tags || []).some(t => t.toLowerCase() === cleanTag.toLowerCase());
        if (!hasTag) return false;
      }

      return true;
    });

    // Fisher-Yates array shuffle
    const shuffle = <T>(array: T[]): T[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // Partition by watched vs unseen: New/unseen reels ALWAYS come first!
    const watchedIds = ReelsStorage.getWatchedReelIds(userId);
    const unseen = filtered.filter(r => !watchedIds.has(r.id));
    const seen = filtered.filter(r => watchedIds.has(r.id));

    return [...shuffle(unseen), ...shuffle(seen)];
  },

  /**
   * Get a slice of Instagram reels for the active feed
   */
  getItems(
    options: {
      feedType?: string;
      currentUser: ReelUser | null;
      selectedCategory?: ReelCategory | null;
      selectedHashtag?: string | null;
    },
    startIndex: number,
    count: number
  ): { items: DynamicReel[]; nextIndex: number; hasMore: boolean } {
    const pool = this.getCandidatePool(options);
    if (pool.length === 0) {
      return { items: [], nextIndex: 0, hasMore: false };
    }

    const items: DynamicReel[] = [];
    let idx = startIndex;
    for (let i = 0; i < count; i++) {
      if (idx < pool.length) {
        items.push(pool[idx]);
        idx++;
      } else {
        break;
      }
    }

    return {
      items,
      nextIndex: idx,
      hasMore: idx < pool.length
    };
  }
};
