import { DynamicReel, ReelUser, ReelCategory } from '../../types';
import { ReelsStorage, EXTERNAL_CHHATH_SEED_CATALOG } from '../reelsStorage';
import { CachedYouTubeVideo } from './types';
import { searchYouTubeVideos, decodeHtmlEntities } from '../youtubeSearchService';

export interface YouTubeFilterOptions {
  feedType: string;
  currentUser: ReelUser | null;
  selectedCategory?: ReelCategory | null;
  selectedHashtag?: string | null;
}

// Rotating list of authentic Chhath Puja YouTube Shorts queries
const LIVE_CHHATH_SHORTS_QUERIES = [
  'chhath puja shorts',
  'छठ पूजा रील्स',
  'chhath geet shorts',
  'sharda sinha chhath shorts',
  'pawan singh chhath shorts',
  'khesari lal chhath shorts',
  'chhath ghat status shorts',
  'sandhya arghya chhath shorts',
  'usha arghya chhath shorts',
  'thekua prasad chhath shorts',
  'chhath mahaparv status viral'
];

let liveQueryIndex = Math.floor(Math.random() * LIVE_CHHATH_SHORTS_QUERIES.length);
let liveNextPageToken: string | null = null;
const seenLiveVideoIds = new Set<string>();

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

    // 2. Pre-verified curated Chhath Shorts seed catalog
    const knownSeed = EXTERNAL_CHHATH_SEED_CATALOG.find(r => r.youtubeVideoId === youtubeVideoId);
    if (knownSeed) {
      return {
        isValid: true,
        metadata: {
          youtubeVideoId,
          title: knownSeed.title,
          thumbnail: knownSeed.thumbnailUrl,
          channelTitle: knownSeed.channelTitle,
          embeddable: true,
          status: 'VALID'
        }
      };
    }
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

    const filtered = catalog.filter(reel => {
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

    // Helper: Fisher-Yates array shuffle for non-static, non-repetitive feed
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
    const unseen = filtered.filter(r => !watchedIds.has(r.id) && !watchedIds.has(r.youtubeVideoId || ''));
    const seen = filtered.filter(r => watchedIds.has(r.id) || watchedIds.has(r.youtubeVideoId || ''));

    return [...shuffle(unseen), ...shuffle(seen)];
  },

  /**
   * Get a slice of validated external YouTube reels with live infinite stream capability
   */
  async getValidatedItems(
    options: YouTubeFilterOptions, 
    startIndex: number, 
    count: number
  ): Promise<{ items: DynamicReel[]; nextIndex: number; hasMore: boolean }> {
    const pool = this.getCandidatePool(options);
    const items: DynamicReel[] = [];
    let idx = startIndex;
    let attempts = 0;
    const maxAttempts = pool.length * 2;

    // 1. First consume available items from local pool
    while (items.length < count && idx < pool.length && attempts < maxAttempts) {
      const candidate = pool[idx];

      if (candidate && candidate.youtubeVideoId && !seenLiveVideoIds.has(candidate.youtubeVideoId)) {
        const validation = await this.validateVideo(candidate.youtubeVideoId);
        if (validation.isValid) {
          seenLiveVideoIds.add(candidate.youtubeVideoId);
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

    // 2. If pool is exhausted or needs more items, fetch live YouTube Chhath Shorts dynamically!
    if (items.length < count) {
      try {
        const query = LIVE_CHHATH_SHORTS_QUERIES[liveQueryIndex % LIVE_CHHATH_SHORTS_QUERIES.length];
        const ytRes = await searchYouTubeVideos(query, liveNextPageToken || '');
        
        if (ytRes.results && ytRes.results.length > 0) {
          liveNextPageToken = ytRes.nextPageToken || null;
          if (!liveNextPageToken) {
            liveQueryIndex++;
          }

          for (const res of ytRes.results) {
            if (items.length >= count) break;
            if (ReelsStorage.isBlockedVideo(res.youtubeId) || seenLiveVideoIds.has(res.youtubeId)) {
              continue;
            }

            const cleanTitle = decodeHtmlEntities(res.title) || 'छठ महापर्व रील्स';
            const desc = res.description || '';
            const textToInspect = `${cleanTitle} ${desc} ${res.channelTitle || ''}`.toLowerCase();
            const chhathKeywords = [
              'chhath', 'chhat', 'छठ', 'छठी', 'arghya', 'aragh', 'अर्घ्य', 'अरघ',
              'thekua', 'ठेकुआ', 'daura', 'दउरा', 'ghat', 'घाट', 'soop', 'सूप',
              'suruj', 'surya', 'सुरुज', 'सूरज', 'सूर्य', 'dinanath', 'दीनानाथ',
              'nahay', 'नहाय', 'kharna', 'खरना', 'sharda', 'शारदा', 'koshi', 'कोशी'
            ];
            const isChhath = chhathKeywords.some(kw => textToInspect.includes(kw));
            if (!isChhath) {
              continue;
            }

            // Exclude video editing tutorials, tech guides, memes, and non-devotional clutter
            const junkKeywords = [
              'video editing', 'reels editing', 'editing video', 'status kaise banaye',
              'video kaise banaye', 'kaise banaye', 'tutorial', 'kinemaster', 'capcut',
              'vn app', 'alight motion', 'premiere pro', 'vfx boy', 'editing tutorial',
              'snake', 'meme', 'comedy'
            ];
            const isJunk = junkKeywords.some(kw => textToInspect.includes(kw));
            if (isJunk) {
              continue;
            }

            seenLiveVideoIds.add(res.youtubeId);
            const channelName = decodeHtmlEntities(res.channelTitle) || 'छठ पावन भक्ति';

            items.push({
              id: `yt-live-reel-${res.youtubeId}`,
              creatorId: `channel-${res.channelTitle.replace(/\s+/g, '-').toLowerCase()}`,
              creatorName: channelName,
              creatorUsername: `@${channelName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'chhath'}`,
              creatorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channelName)}`,
              creatorCity: 'पटना / बिहार',
              title: cleanTitle,
              description: res.description || `${cleanTitle} • पावन छठ महापर्व रील्स #ChhathPuja #Shorts`,
              category: 'Chhath Geet',
              tags: ['#ChhathPuja', '#ChhathiMaiya', '#Shorts', '#Bhakti'],
              videoUrl: `https://www.youtube.com/watch?v=${res.youtubeId}`,
              youtubeVideoId: res.youtubeId,
              thumbnailUrl: res.thumbnailUrl,
              channelTitle: channelName,
              videoDuration: '0:45',
              likesCount: Math.floor(Math.random() * 8000) + 1500,
              commentsCount: Math.floor(Math.random() * 300) + 50,
              sharesCount: Math.floor(Math.random() * 400) + 90,
              savesCount: Math.floor(Math.random() * 200) + 30,
              viewsCount: Math.floor(Math.random() * 60000) + 12000,
              privacy: 'public',
              status: 'approved',
              createdAt: new Date().toISOString(),
              sourceType: 'YOUTUBE',
              isEmbeddable: true
            });
          }
        } else {
          liveQueryIndex++;
        }
      } catch (err) {
        console.warn('Live YouTube reels fetch error:', err);
      }
    }

    // Always maintain hasMore = true so reel scrolling NEVER ends!
    return {
      items,
      nextIndex: idx,
      hasMore: true
    };
  }
};
