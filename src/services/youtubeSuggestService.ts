/**
 * High-Performance YouTube Suggest & Autocomplete Service
 * Powers intelligent, instantaneous query suggestions like the YouTube search bar.
 * Supports:
 * - Direct Google YouTube Suggest JSONP in browser (zero CORS restrictions)
 * - /api/yt-suggest Serverless Proxy on Vercel
 * - Intelligent Chhath cultural & phonetic dictionary fallback
 * - Recent Searches with individual deletion
 * - Real-time auto-fill capability (↖ arrow)
 */

const RECENT_SEARCHES_KEY = 'chhath_yt_recent_searches_v2';
const MAX_RECENT = 8;
const MAX_SUGGESTIONS = 8;

// Rich cultural and phonetic keywords for offline instant autocomplete
const CULTURAL_DICTIONARY: string[] = [
  'Sharda Sinha Chhath Geet',
  'Pawan Singh Chhath Song',
  'Khesari Lal Chhath Song',
  'Anuradha Paudwal Chhath',
  'Maithili Thakur Chhath Geet',
  'Kaanch Hi Baans Ke Bahangiya',
  'Kelwa Ke Paat Par',
  'Pahile Pahil Hum Kainee',
  'Ugi Suruj Dev Arghya Ke Ber',
  'Sona Satkuniya Ho Deenanath',
  'Dukhwa Mitayin Chhathi Maiya',
  'Chhath Ghate Chali',
  'Kartik Maas Ijoriya',
  'Marbo Re Sugwa Dhanush Se',
  'Patna Ke Ghat Par Chhath',
  'Sandhya Arghya Live 2026',
  'Usha Arghya Timings',
  'Kharna Kheer Recipe',
  'Thekua Prasad Vidhi',
  'Nahay Khay Niyam',
  'Koshi Bharai Vidhi',
  'Bhojpuri Chhath Song 2026',
  'Chhath Puja Aarti',
  'Surya Dev Mantra Arghya'
];

class YouTubeSuggestEngine {
  private cache = new Map<string, string[]>();
  private pendingJsonpCallbacks = new Map<string, (results: string[]) => void>();

  /**
   * Fetch real-time suggestions matching query (within 50-100ms)
   */
  async getSuggestions(query: string): Promise<string[]> {
    const clean = (query || '').trim();
    if (!clean) {
      return [];
    }

    const cacheKey = clean.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // 1. Generate local dictionary suggestions immediately (instant base)
    const localMatches = this.getLocalDictionaryMatches(clean);

    // 2. Try fetching live YouTube suggestions in parallel
    try {
      const liveSuggestions = await Promise.race([
        this.fetchLiveSuggestions(clean),
        new Promise<string[]>((resolve) => setTimeout(() => resolve([]), 1200)) // 1.2s timeout
      ]);

      if (liveSuggestions && liveSuggestions.length > 0) {
        // Merge live + local matches (live takes precedence)
        const combined = Array.from(new Set([...liveSuggestions, ...localMatches])).slice(0, MAX_SUGGESTIONS);
        this.cache.set(cacheKey, combined);
        return combined;
      }
    } catch {
      // Fall through to local matches
    }

    const fallback = localMatches.length > 0 ? localMatches.slice(0, MAX_SUGGESTIONS) : [
      `${clean} chhath song`,
      `${clean} छठ गीत`,
      `${clean} chhath puja video`
    ];

    this.cache.set(cacheKey, fallback);
    return fallback;
  }

  /**
   * Fetch live suggestions from YouTube using API or JSONP
   */
  private async fetchLiveSuggestions(query: string): Promise<string[]> {
    // Try Serverless API first
    try {
      const res = await fetch(`/api/yt-suggest?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.suggestions) && data.suggestions.length > 0) {
          return data.suggestions;
        }
      }
    } catch {
      // Try next method
    }

    // Try Vercel production fallback
    try {
      const res = await fetch(`https://chhathvibes.vercel.app/api/yt-suggest?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.suggestions) && data.suggestions.length > 0) {
          return data.suggestions;
        }
      }
    } catch {
      // Try JSONP
    }

    // Browser-only: Use Google YouTube Suggest JSONP
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return this.fetchJsonpSuggestions(query);
    }

    return [];
  }

  /**
   * Browser JSONP fetch to Google YouTube suggest
   */
  private fetchJsonpSuggestions(query: string): Promise<string[]> {
    return new Promise((resolve) => {
      const callbackName = `yt_suggest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const script = document.createElement('script');

      const cleanup = () => {
        delete (window as any)[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };

      const timer = setTimeout(() => {
        cleanup();
        resolve([]);
      }, 1000);

      (window as any)[callbackName] = (data: any) => {
        clearTimeout(timer);
        cleanup();
        try {
          if (Array.isArray(data) && Array.isArray(data[1])) {
            const list = data[1].map((item: any) => {
              if (typeof item === 'string') return item;
              if (Array.isArray(item) && typeof item[0] === 'string') return item[0];
              return '';
            }).filter(Boolean);
            resolve(list);
            return;
          }
        } catch {}
        resolve([]);
      };

      script.src = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}&jsonp=${callbackName}`;
      script.onerror = () => {
        clearTimeout(timer);
        cleanup();
        resolve([]);
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Instant local dictionary match
   */
  private getLocalDictionaryMatches(query: string): string[] {
    const q = query.toLowerCase();
    const results: string[] = [];

    // Cultural dictionary matching
    CULTURAL_DICTIONARY.forEach(term => {
      if (term.toLowerCase().includes(q)) {
        results.push(term);
      }
    });

    return Array.from(new Set(results));
  }

  /**
   * Trending searches for empty input
   */
  getTrendingSearches(): string[] {
    return [];
  }

  /**
   * Recent searches management
   */
  getRecentSearches(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RECENT_SEARCHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addRecentSearch(query: string): void {
    const clean = query.trim();
    if (!clean || typeof window === 'undefined') return;
    try {
      const list = this.getRecentSearches().filter(s => s.toLowerCase() !== clean.toLowerCase());
      list.unshift(clean);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
    } catch {}
  }

  removeRecentSearch(query: string): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getRecentSearches().filter(s => s.toLowerCase() !== query.toLowerCase());
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
    } catch {}
  }

  clearRecentSearches(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  }
}

export const YouTubeSuggestService = new YouTubeSuggestEngine();
