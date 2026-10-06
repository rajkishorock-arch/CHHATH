import { Song } from '../types';
import { chhathSongs } from '../data/songs';

export interface YouTubeSearchSong {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  description?: string;
  duration?: string;
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
  if (typeof document === 'undefined') return text;
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
    duration: ytSong.duration || '5:00',
    audioUrl: `https://www.youtube.com/watch?v=${ytSong.youtubeId}`,
    youtubeId: ytSong.youtubeId,
    thumbnail: ytSong.thumbnailUrl,
    description: ytSong.description || `प्रस्तुति: ${cleanChannel}`
  };
};

export const getWorkerUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chhath_yt_worker_url');
    if (saved && saved.trim() && !saved.includes('rajkishorock.workers.dev')) return saved.trim();
  }
  return (import.meta.env.VITE_YOUTUBE_WORKER_URL as string) || 'https://chhathvibes.vercel.app';
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
  if (!yid || typeof yid !== 'string' || yid.length < 5) return null;
  const thumb =
    item.thumbnailUrl ||
    item.thumbnail ||
    `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
  if (!thumb || thumb.includes('undefined')) return null;
  return {
    youtubeId: yid,
    title: decodeHtmlEntities(item.title || ''),
    channelTitle: decodeHtmlEntities(item.channelTitle || item.singer || item.author || 'छठ भक्ति'),
    thumbnailUrl: thumb,
    duration: item.duration || '5:00',
    description: item.description || ''
  };
};

/**
 * Intelligent Fallback Catalog Search (Safety net if completely offline)
 */
const getFallbackCatalogResults = (query: string): YouTubeSearchSong[] => {
  const cleanQ = query.toLowerCase().trim();
  const tokens = cleanQ.split(/\s+/).filter(Boolean);
  const specificTokens = tokens.filter(t => !GENERIC_CHHATH_TERMS.has(t));

  const allSongs: Song[] = chhathSongs.filter(s => Boolean(s.youtubeId) && Boolean(s.thumbnail) && !s.thumbnail.includes('undefined'));

  if (specificTokens.length === 0) {
    // Return dynamically randomized catalog so even offline fallback never feels static
    const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
    return shuffled.map(s => ({
      youtubeId: s.youtubeId || '',
      title: s.title,
      channelTitle: s.singer,
      thumbnailUrl: s.thumbnail,
      duration: s.duration,
      description: s.lyricsSnippet || `${s.title} - ${s.singer}`
    })).filter(s => Boolean(s.youtubeId) && Boolean(s.thumbnailUrl));
  }

  const matched = allSongs.filter(song => {
    const textToSearch = `${song.title} ${song.singer} ${song.category} ${song.language} ${song.lyricsSnippet || ''}`.toLowerCase();
    return specificTokens.some(tok => {
      if (textToSearch.includes(tok)) return true;
      const aliases = PHONETIC_MAP[tok] || [];
      return aliases.some(alias => textToSearch.includes(alias.toLowerCase()));
    });
  });

  // If user searched for specific non-Chhath tokens (e.g. "pw", "news"), never inject unrelated songs!
  if (matched.length === 0) {
    return [];
  }

  const randomizedFinal = [...matched].sort(() => Math.random() - 0.5);
  return randomizedFinal.map(s => ({
    youtubeId: s.youtubeId || '',
    title: s.title,
    channelTitle: s.singer,
    thumbnailUrl: s.thumbnail,
    duration: s.duration,
    description: s.lyricsSnippet || `${s.title} - ${s.singer}`
  })).filter(s => Boolean(s.youtubeId) && Boolean(s.thumbnailUrl));
};

export const searchYouTubeVideos = async (
  query: string,
  pageToken: string = '',
  type: 'video' | 'shorts' | 'playlist' = 'video',
  bypassCache: boolean = false
): Promise<YouTubeSearchResponse> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], nextPageToken: null, isLiveApi: false };
  }

  const cacheKey = `chhath_live_search_${type}_${trimmed.toLowerCase()}_${pageToken}`;

  // 1. Check client 5-min cache (bypassed on fresh loads for maximum real-time novelty)
  if (!bypassCache) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 300000 && parsed.data?.results?.length > 0) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore cache errors
    }
  }

  // 2. TIER 1: Dedicated High-Speed Live API (Local Vercel Serverless First -> Vercel Production -> Worker)
  const workerBase = getWorkerUrl().replace(/\/+$/, '');
  const searchEndpoints = [
    `/api/yt-search?q=${encodeURIComponent(trimmed)}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&type=${type}`,
    `${workerBase}/api/yt-search?q=${encodeURIComponent(trimmed)}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&type=${type}`,
    `https://chhathvibes.vercel.app/api/yt-search?q=${encodeURIComponent(trimmed)}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&type=${type}`
  ];

  for (const endpointUrl of searchEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(endpointUrl, { signal: controller.signal });
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
    } catch {
      // Try next endpoint
    }
  }

  // 3. TIER 2: Direct Client-Side YouTube InnerTube Request (if running static / GitHub Pages)
  try {
    const bodyPayload: any = {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20240101.00.00',
          hl: 'hi',
          gl: 'IN'
        }
      }
    };
    if (pageToken) {
      bodyPayload.continuation = pageToken;
    } else {
      bodyPayload.query = type === 'shorts'
        ? (trimmed.toLowerCase().includes('short') ? trimmed : `${trimmed} #shorts`)
        : trimmed;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const itRes = await fetch('https://www.youtube.com/youtubei/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (itRes.ok) {
      const itData = await itRes.json();
      const rawList: any[] = [];
      let nextToken: string | null = null;

      const sectionList = itData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
      for (const section of sectionList) {
        if (section.continuationItemRenderer) {
          nextToken = section.continuationItemRenderer.continuationEndpoint?.continuationCommand?.token || null;
        }
        if (section.itemSectionRenderer?.contents) {
          for (const item of section.itemSectionRenderer.contents) {
            if (item.videoRenderer?.videoId) {
              const v = item.videoRenderer;
              const title = v.title?.runs?.map((r: any) => r.text).join('') || v.title?.simpleText || '';
              const isShort = title.toLowerCase().includes('#short') || title.toLowerCase().includes('#reel');
              if (type === 'video' && isShort) continue;
              if (type === 'shorts' && !isShort) continue;

              rawList.push({
                youtubeId: v.videoId,
                title,
                channelTitle: v.ownerText?.runs?.[0]?.text || 'YouTube Creator',
                thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
                duration: v.lengthText?.simpleText || (type === 'shorts' ? '0:45' : '5:00'),
                description: `${title}`
              });
            }

            if (type === 'shorts' && item.reelShelfRenderer?.items) {
              for (const sub of item.reelShelfRenderer.items) {
                const r = sub.reelItemRenderer;
                if (r?.videoId) {
                  const title = r.headline?.simpleText || r.headline?.runs?.map((x: any) => x.text).join('') || 'Trending Reel';
                  const channel = r.ownerText?.runs?.[0]?.text || 'YouTube Creator';
                  rawList.push({
                    youtubeId: r.videoId,
                    title,
                    channelTitle: channel,
                    thumbnailUrl: `https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`,
                    duration: '0:45',
                    description: title
                  });
                }
              }
            }

            if (type === 'shorts' && item.gridShelfViewModel?.contents) {
              for (const sub of item.gridShelfViewModel.contents) {
                const sl = sub.shortsLockupViewModel;
                if (sl) {
                  let vId = sl.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
                  if (!vId && sl.entityId) {
                    vId = sl.entityId.replace('shorts-shelf-item-', '');
                  }
                  if (!vId && sl.inlinePopStateEntityKey) {
                    const match = sl.inlinePopStateEntityKey.match(/shorts-shelf-item-([A-Za-z0-9_-]+)/);
                    if (match) vId = match[1];
                  }
                  const title = sl.overlayMetadata?.primaryText?.content || sl.accessibilityText?.split(',')?.[0] || 'Trending Reel';
                  let channel = 'YouTube Creator';
                  if (sl.accessibilityText) {
                    const atMatch = sl.accessibilityText.match(/@([a-zA-Z0-9_.-]+)/);
                    if (atMatch) {
                      channel = `@${atMatch[1]}`;
                    }
                  }
                  if (vId) {
                    rawList.push({
                      youtubeId: vId,
                      title,
                      channelTitle: channel,
                      thumbnailUrl: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                      duration: '0:45',
                      description: title
                    });
                  }
                }
              }
            }
          }
        }
      }

      const normalized = rawList.map(normalizeItem).filter((x: YouTubeSearchSong | null): x is YouTubeSearchSong => x !== null);
      if (normalized.length > 0) {
        const responseData: YouTubeSearchResponse = {
          results: normalized,
          nextPageToken: nextToken,
          totalResults: normalized.length,
          isLiveApi: true
        };
        return responseData;
      }
    }
  } catch {
    // Move to next tier
  }

  // 4. TIER 3: Public Invidious Mirror Search
  try {
    const invidiousQuery = type === 'shorts' ? (trimmed.toLowerCase().includes('short') ? trimmed : `${trimmed} shorts`) : trimmed;
    const invidiousEndpoint = `https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(invidiousQuery)}&type=video`;
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
          channelTitle: decodeHtmlEntities(item.author || 'छठ भक्ति'),
          thumbnailUrl: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
          duration: item.lengthSeconds ? `${Math.floor(item.lengthSeconds / 60)}:${(item.lengthSeconds % 60).toString().padStart(2, '0')}` : '5:00',
          description: item.description || ''
        })).filter((s: YouTubeSearchSong) => Boolean(s.youtubeId) && Boolean(s.thumbnailUrl));

        if (normalized.length > 0) {
          const responseData: YouTubeSearchResponse = {
            results: normalized.slice(0, 15),
            nextPageToken: null,
            totalResults: normalized.length,
            isLiveApi: true
          };
          return responseData;
        }
      }
    }
  } catch {
    // Invidious failed
  }

  // 5. TIER 4: Guaranteed Intelligent Catalog Match
  const fallbackResults = getFallbackCatalogResults(trimmed);

  return {
    results: fallbackResults,
    nextPageToken: null,
    totalResults: fallbackResults.length,
    isLiveApi: false,
    error: fallbackResults.length > 0 ? undefined : 'कोई गाना नहीं मिला। कृपया अन्य शब्द खोजें।'
  };
};

export const searchYouTubeShorts = async (
  query: string = 'छठ पूजा रील्स',
  pageToken: string = '',
  bypassCache: boolean = false
): Promise<YouTubeSearchResponse> => {
  return searchYouTubeVideos(query, pageToken, 'shorts', bypassCache);
};
