import { Song } from '../types';
import { chhathSongs } from '../data/songs';

export interface YouTubeSearchSong {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  description?: string;
}

export interface YouTubeSearchResponse {
  results: YouTubeSearchSong[];
  nextPageToken: string | null;
  totalResults?: number;
  isLiveApi: boolean;
  error?: string;
}

// Decode HTML entities from raw YouTube API titles (e.g., &amp; -> &, &quot; -> ")
export const decodeHtmlEntities = (text: string): string => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Convert normalized YouTubeSearchSong into internal application Song object
export const convertToSongModel = (ytSong: YouTubeSearchSong): Song => {
  const cleanTitle = decodeHtmlEntities(ytSong.title);
  const cleanChannel = decodeHtmlEntities(ytSong.channelTitle);

  return {
    id: `yt-live-${ytSong.youtubeId}`,
    title: cleanTitle,
    singer: cleanChannel,
    language: 'Bhojpuri',
    category: 'छठ भक्ति संगीत',
    duration: '4:30',
    audioUrl: `https://www.youtube.com/watch?v=${ytSong.youtubeId}`,
    youtubeId: ytSong.youtubeId,
    thumbnail: ytSong.thumbnailUrl,
    description: ytSong.description || `प्रस्तुति: ${cleanChannel}`
  };
};

export const getWorkerUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chhath_yt_worker_url');
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta.env.VITE_YOUTUBE_WORKER_URL as string) || 'https://chhath-yt-search.rajkishorock.workers.dev';
};

const PHONETIC_MAP: Record<string, string[]> = {
  pawan: ['पवन', 'pawan', 'singh'],
  pawansingh: ['पवन', 'pawan'],
  sharda: ['शारदा', 'sharda', 'sinha'],
  shardasinha: ['शारदा', 'sharda'],
  khesari: ['खेसारी', 'khesari'],
  khesarilal: ['खेसारी', 'khesari'],
  anuradha: ['अनुराधा', 'anuradha', 'paudwal'],
  maithili: ['मैथिली', 'maithili', 'thakur'],
  kalpana: ['कल्पना', 'kalpana', 'patowary'],
  manoj: ['मनोज', 'manoj', 'tiwari'],
  nirahua: ['निरहुआ', 'dinesh', 'nirahua'],
  arghya: ['अर्घ्य', 'अरघ', 'arghya', 'aragh'],
  aragh: ['अर्घ्य', 'अरघ'],
  bahangi: ['बहंगी', 'बहंगिया', 'bahangi'],
  bahangiya: ['बहंगी', 'बहंगिया'],
  kelwa: ['केलवा', 'केला', 'kelwa'],
  thekua: ['ठेकुआ', 'thekua'],
  suruj: ['सुरुज', 'सूरज', 'सूर्य', 'suruj', 'surya', 'dinanath'],
  surya: ['सुरुज', 'सूरज', 'सूर्य', 'suruj', 'surya'],
  dinanath: ['दीनानाथ', 'दीना नाथ', 'dinanath']
};

const GENERIC_CHHATH_TERMS = new Set([
  'chhath', 'chhat', 'chat', 'chhathi', 'puja', 'pooja', 'song', 'songs',
  'geet', 'gane', 'gana', 'bhajan', 'bhakti', 'parv', 'mahaparv', 'bihar', 'bhojpuri'
]);

// Helper to normalize any incoming search item
const normalizeItem = (item: any): YouTubeSearchSong | null => {
  const yid = item.youtubeId || item.id || item.videoId;
  if (!yid) return null;
  return {
    youtubeId: yid,
    title: decodeHtmlEntities(item.title || ''),
    channelTitle: decodeHtmlEntities(item.channelTitle || item.singer || item.author || 'Chhath Devotional'),
    thumbnailUrl:
      item.thumbnailUrl ||
      item.thumbnail ||
      `https://img.youtube.com/vi/${yid}/hqdefault.jpg`,
    description: item.description || ''
  };
};

/**
 * Intelligent Fallback Catalog Search:
 * Evaluates user query against verified Chhath catalog and seed songs
 */
const getFallbackCatalogResults = (query: string): YouTubeSearchSong[] => {
  const cleanQ = query.toLowerCase().trim();
  const tokens = cleanQ.split(/\s+/).filter(Boolean);
  const specificTokens = tokens.filter(t => !GENERIC_CHHATH_TERMS.has(t));

  const allSongs: Song[] = [...chhathSongs];

  // If query is generic like "chhath song" or "chhath geet", return top catalog songs
  if (specificTokens.length === 0) {
    return allSongs.slice(0, 16).map(s => ({
      youtubeId: s.youtubeId || (s.audioUrl.split('v=')[1] || ''),
      title: s.title,
      channelTitle: s.singer,
      thumbnailUrl: s.thumbnail || `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`,
      description: s.lyricsSnippet || `${s.title} - ${s.singer}`
    })).filter(s => Boolean(s.youtubeId));
  }

  // Otherwise, match against specific tokens and phonetic mappings
  const matched = allSongs.filter(song => {
    const textToSearch = `${song.title} ${song.singer} ${song.category} ${song.language} ${song.lyricsSnippet || ''}`.toLowerCase();
    return specificTokens.some(tok => {
      if (textToSearch.includes(tok)) return true;
      const aliases = PHONETIC_MAP[tok] || [];
      return aliases.some(alias => textToSearch.includes(alias.toLowerCase()));
    });
  });

  const finalPool = matched.length > 0 ? matched : allSongs.slice(0, 12);
  return finalPool.map(s => ({
    youtubeId: s.youtubeId || (s.audioUrl.split('v=')[1] || ''),
    title: s.title,
    channelTitle: s.singer,
    thumbnailUrl: s.thumbnail || `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`,
    description: s.lyricsSnippet || `${s.title} - ${s.singer}`
  })).filter(s => Boolean(s.youtubeId));
};

export const searchYouTubeVideos = async (
  query: string,
  pageToken: string = ''
): Promise<YouTubeSearchResponse> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], nextPageToken: null, isLiveApi: false };
  }

  const cacheKey = `chhath_search_cache_${trimmed.toLowerCase()}_${pageToken}`;

  // 1. Check client 1-hour localStorage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 3600000 && parsed.data?.results?.length > 0) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore cache errors
  }

  // 2. TIER 1: Native Serverless / API Endpoint (/api/yt-search)
  // Highly reliable on Vercel deployment and local Vite dev server
  try {
    const internalUrl = `/api/yt-search?q=${encodeURIComponent(trimmed)}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(internalUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawList = data.results || data.items || [];
      const normalized = rawList.map(normalizeItem).filter((x: YouTubeSearchSong | null): x is YouTubeSearchSong => x !== null);

      if (normalized.length > 0) {
        const responseData: YouTubeSearchResponse = {
          results: normalized,
          nextPageToken: data.nextPageToken || null,
          totalResults: data.totalResults || normalized.length,
          isLiveApi: true
        };

        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: responseData }));
        } catch {
          // Ignore quota error
        }

        return responseData;
      }
    }
  } catch (err) {
    console.warn('Native /api/yt-search endpoint unreached, attempting worker fallback:', err);
  }

  // 3. TIER 2: Cloudflare Worker Gateway
  const workerUrl = getWorkerUrl();
  if (workerUrl) {
    try {
      const endpoint = `${workerUrl.replace(/\/$/, '')}?q=${encodeURIComponent(trimmed)}&pageToken=${encodeURIComponent(pageToken)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const rawList = data.results || data.items || [];
        const normalized = rawList.map(normalizeItem).filter((x: YouTubeSearchSong | null): x is YouTubeSearchSong => x !== null);

        if (normalized.length > 0) {
          const responseData: YouTubeSearchResponse = {
            results: normalized,
            nextPageToken: data.nextPageToken || null,
            totalResults: data.totalResults || normalized.length,
            isLiveApi: true
          };

          try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: responseData }));
          } catch {
            // Ignore quota error
          }

          return responseData;
        }
      }
    } catch (err) {
      console.warn('Cloudflare Worker request unreached, checking public proxy & fallback:', err);
    }
  }

  // 4. TIER 3: Public Invidious / Piped Mirror Search
  try {
    const invidiousEndpoint = `https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(trimmed + ' chhath geet')}&type=video`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const invRes = await fetch(invidiousEndpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (invRes.ok) {
      const invData = await invRes.json();
      if (Array.isArray(invData) && invData.length > 0) {
        const normalized = invData.map((item: any) => ({
          youtubeId: item.videoId || '',
          title: decodeHtmlEntities(item.title || ''),
          channelTitle: decodeHtmlEntities(item.author || 'Chhath Devotional'),
          thumbnailUrl: item.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
          description: item.description || ''
        })).filter(s => Boolean(s.youtubeId));

        if (normalized.length > 0) {
          const responseData: YouTubeSearchResponse = {
            results: normalized.slice(0, 15),
            nextPageToken: null,
            totalResults: normalized.length,
            isLiveApi: true
          };

          try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: responseData }));
          } catch {
            // Ignore quota error
          }

          return responseData;
        }
      }
    }
  } catch {
    // Invidious mirror failed, move to Tier 4
  }

  // 5. TIER 4: Guaranteed Intelligent Catalog Match (Never empty for Chhath music!)
  const fallbackResults = getFallbackCatalogResults(trimmed);

  return {
    results: fallbackResults,
    nextPageToken: null,
    totalResults: fallbackResults.length,
    isLiveApi: false,
    error: fallbackResults.length > 0 ? undefined : 'कोई गाना नहीं मिला। कृपया अन्य शब्द खोजें।'
  };
};
