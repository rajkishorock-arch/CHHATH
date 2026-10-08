import { 
  NormalizedSearchResult, 
  UnifiedSearchResponse, 
  SearchTab, 
  SearchSuggestionItem 
} from './types';
import { QueryEngine } from './queryEngine';
import { InternalSearchProvider } from './internalSearchProvider';
import { ReelsStorage } from '../reelsStorage';
import { chhathGhatsData } from '../../data/ghats';

const HISTORY_KEY = 'chhath_search_history';
const MAX_HISTORY_ITEMS = 10;

export class GlobalSearchService {
  /**
   * Main Search Pipeline:
   * User Query -> Query Understanding -> Internal Search -> External Search -> Validation -> Ranking -> Unified Response
   */
  static async search(
    rawQuery: string,
    options: {
      userCity?: string;
      userLanguage?: string;
      pageToken?: string;
    } = {}
  ): Promise<UnifiedSearchResponse> {
    const analysis = QueryEngine.analyze(rawQuery, options.userLanguage);
    const { cleanQuery, intent, isUsernameQuery, targetUsername, isChhathRelevant, expandedQueries } = analysis;

    // 1. Perform Internal Search first across all database collections
    let internalOutcome = InternalSearchProvider.search(analysis, options.userCity, options.userLanguage);

    // 3. Exact Username Handling (#3 & #4)
    let exactUser = internalOutcome.exactUser;
    let exactUserReels = internalOutcome.exactUserReels;

    // If query looks like a username (e.g. "@sonu") and user is NOT found,
    // do NOT stop the search! Expand to "sonu chhath", "sonu chhath geet", etc. (#4)
    if (isUsernameQuery && !exactUser && targetUsername) {
      const fallbackQueries = QueryEngine.getUsernameFallbackQueries(targetUsername);
      for (const fq of fallbackQueries) {
        const fallbackAnalysis = QueryEngine.analyze(fq, options.userLanguage);
        const fallbackOutcome = InternalSearchProvider.search(fallbackAnalysis, options.userCity, options.userLanguage);
        if (fallbackOutcome.results.length > 0) {
          internalOutcome.results.push(...fallbackOutcome.results);
        }
      }
    }

    // 4. External YouTube Real-Time Global Search (#6, #7, #8, #17, #20)
    let externalResults: NormalizedSearchResult[] = [];
    let nextPageToken: string | undefined = undefined;

    const shouldSearchExternal = 
      (!exactUser || intent === 'SONG' || intent === 'VIDEO' || intent === 'GENERAL' || internalOutcome.results.length < 4);

    if (shouldSearchExternal) {
      // Execute true global real-time search on YouTube for exactly what the user searched
      const externalSearchQuery = cleanQuery;

      try {
        const baseUrl = (typeof window !== 'undefined' && window.location.hostname.includes('github.io'))
          ? 'https://chhathvibes.vercel.app'
          : '';
        const fetchUrl = `${baseUrl}/api/search?q=${encodeURIComponent(externalSearchQuery)}${
          options.pageToken ? `&pageToken=${encodeURIComponent(options.pageToken)}` : ''
        }`;

        const res = await fetch(fetchUrl);
        if (res.ok) {
          const data = await res.json();
          nextPageToken = data.nextPageToken;

          const rawList = data.results || data.items || [];
          if (Array.isArray(rawList)) {
            const mapped: NormalizedSearchResult[] = [];
            for (const v of rawList) {
              const vid = v.videoId || v.youtubeId || v.id;
              if (!vid || typeof vid !== 'string' || vid.length < 5 || ReelsStorage.isBlockedVideo(vid)) {
                continue;
              }

              // Score external videos based on title match and relevance
              const vTitle = (v.title || '').toLowerCase();
              let score = 75;
              if (vTitle.includes(cleanQuery.toLowerCase())) score += 20;

              const thumb = v.thumbnail || v.thumbnailUrl || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
              const channel = v.channelTitle || v.singer || 'YouTube Creator';

              mapped.push({
                id: `yt-${vid}`,
                source: 'youtube' as const,
                type: 'video' as const,
                title: v.title || 'पावन भक्ति गीत',
                description: v.description || `${channel} • YouTube`,
                thumbnail: thumb,
                creator: channel,
                url: v.url || `https://www.youtube.com/watch?v=${vid}`,
                videoId: vid,
                relevanceScore: score,
                badge: 'YouTube',
                metadata: {
                  channelTitle: channel,
                  publishedAt: v.publishedAt,
                  videoId: vid,
                  duration: v.duration
                }
              });
            }
            externalResults = mapped;
          }
        }
      } catch (err) {
        console.warn('External search fallback:', err);
      }
    }

    // 5. Combine and Rank Results (#16 & #23)
    const dedupeMap = new Map<string, NormalizedSearchResult>();

    // Add external video results first so user gets real YouTube media instantly
    externalResults.forEach(item => {
      dedupeMap.set(`video-${item.videoId}`, item);
    });

    // Add internal results
    internalOutcome.results.forEach(item => {
      const key = `${item.type}-${item.id}`;
      if (!dedupeMap.has(key)) {
        dedupeMap.set(key, item);
      }
    });

    const allRanked = Array.from(dedupeMap.values()).sort((a, b) => {
      // Priority 1: Exact query match in title
      const aExact = a.title.toLowerCase().includes(cleanQuery.toLowerCase()) ? 1 : 0;
      const bExact = b.title.toLowerCase().includes(cleanQuery.toLowerCase()) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;

      // Priority 2: Relevance score
      return b.relevanceScore - a.relevanceScore;
    });

    // 6. Build Categorized Buckets (#5)
    const categorized = {
      top: allRanked.slice(0, 25),
      people: allRanked.filter(r => r.type === 'user'),
      reels: allRanked.filter(r => r.type === 'reel'),
      songs: allRanked.filter(r => r.type === 'song' || r.type === 'video'),
      videos: allRanked.filter(r => r.type === 'video'),
      hashtags: allRanked.filter(r => r.type === 'hashtag'),
      articles: allRanked.filter(r => ['article', 'recipe', 'mantra', 'ghat', 'samagri', 'event'].includes(r.type))
    };

    // 7. Dynamic Tabs: Do NOT show categories that have zero results (#5)
    const availableTabs: SearchTab[] = [];
    if (allRanked.length > 0) availableTabs.push('top');
    if (categorized.people.length > 0) availableTabs.push('people');
    if (categorized.reels.length > 0) availableTabs.push('reels');
    if (categorized.songs.length > 0) availableTabs.push('songs');
    if (categorized.videos.length > 0) availableTabs.push('videos');
    if (categorized.hashtags.length > 0) availableTabs.push('hashtags');
    if (categorized.articles.length > 0) availableTabs.push('articles');

    return {
      query: cleanQuery,
      analysis,
      isChhathRelevant: true,
      results: allRanked,
      categorized,
      availableTabs,
      nextPageToken,
      exactUser,
      exactUserReels
    };
  }

  /**
   * Fast Autocomplete Suggestions (Debounced, Internal only - #14 & #26)
   */
  static getSuggestions(rawQuery: string): SearchSuggestionItem[] {
    const q = (rawQuery || '').toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const suggestions: SearchSuggestionItem[] = [];
    const allUsers = ReelsStorage.getUsers();
    const allReels = ReelsStorage.getReels();

    // 1. Users
    allUsers.forEach(u => {
      if (suggestions.length < 6 && (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))) {
        suggestions.push({
          type: 'user',
          icon: '👤',
          label: u.name,
          sub: u.username
        });
      }
    });

    // 2. Reels
    allReels.forEach(r => {
      if (suggestions.length < 6 && r.title.toLowerCase().includes(q)) {
        suggestions.push({
          type: 'reel',
          icon: '🔥',
          label: r.title,
          sub: r.category
        });
      }
    });

    // 4. Ghats
    chhathGhatsData.forEach(g => {
      if (suggestions.length < 6 && (g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q))) {
        suggestions.push({
          type: 'ghat',
          icon: '📍',
          label: g.name,
          sub: g.city
        });
      }
    });

    // 5. Hashtags
    if (q.startsWith('#') || suggestions.length < 6) {
      const tagLabel = q.startsWith('#') ? q : `#${q}`;
      suggestions.push({
        type: 'hashtag',
        icon: '#️⃣',
        label: tagLabel
      });
    }

    // 6. Videos suggestion
    if (suggestions.length < 6) {
      suggestions.push({
        type: 'video',
        icon: '▶️',
        label: `${q} छठ वीडियो`
      });
    }

    return suggestions.slice(0, 6);
  }

  /**
   * Search History (#25)
   */
  static getHistory(): string[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addHistory(query: string): void {
    const clean = query.trim();
    if (!clean) return;
    try {
      const history = this.getHistory().filter(h => h.toLowerCase() !== clean.toLowerCase());
      history.unshift(clean);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear search history', e);
    }
  }
}
