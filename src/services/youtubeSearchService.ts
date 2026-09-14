import { Song } from '../types';

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
    category: 'YouTube Search',
    duration: '4:30',
    audioUrl: `https://www.youtube.com/watch?v=${ytSong.youtubeId}`,
    youtubeId: ytSong.youtubeId,
    thumbnail: ytSong.thumbnailUrl,
    description: ytSong.description || `YouTube channel: ${cleanChannel}`
  };
};

export const getWorkerUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chhath_yt_worker_url');
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta.env.VITE_YOUTUBE_WORKER_URL as string) || 'https://chhath-yt-search.rajkishorock.workers.dev';
};

export const searchYouTubeVideos = async (
  query: string,
  pageToken: string = ''
): Promise<YouTubeSearchResponse> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], nextPageToken: null, isLiveApi: false };
  }

  const workerUrl = getWorkerUrl();
  const cacheKey = `chhath_search_cache_${trimmed.toLowerCase()}_${pageToken}`;

  // 1. Check client 1-hour localStorage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore cache errors
  }

  // 2. Fetch from Cloudflare Worker if URL is configured
  if (workerUrl) {
    try {
      const endpoint = `${workerUrl.replace(/\/$/, '')}?q=${encodeURIComponent(trimmed)}&pageToken=${encodeURIComponent(pageToken)}`;
      const res = await fetch(endpoint);
      
      if (res.ok) {
        const data = await res.json();
        const responseData: YouTubeSearchResponse = {
          results: (data.results || []).map((item: any) => ({
            youtubeId: item.youtubeId,
            title: decodeHtmlEntities(item.title),
            channelTitle: decodeHtmlEntities(item.channelTitle),
            thumbnailUrl: item.thumbnailUrl,
            description: item.description
          })),
          nextPageToken: data.nextPageToken || null,
          totalResults: data.totalResults || 0,
          isLiveApi: true
        };

        // Cache response in localStorage for 1 hour
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: Date.now(), data: responseData })
          );
        } catch {
          // Ignore quota storage errors
        }

        return responseData;
      } else {
        const errorJson = await res.json().catch(() => ({}));
        console.warn('Worker search error status:', res.status, errorJson);
      }
    } catch (err) {
      console.warn('Failed to reach Cloudflare Worker URL:', err);
    }
  }

  // 3. Fallback when worker URL is missing or offline: return catalog matches with isLiveApi = false
  return {
    results: [],
    nextPageToken: null,
    isLiveApi: false,
    error: workerUrl
      ? 'क्लाउडफ्लेयर वर्कर रिस्पॉन्स नहीं दे रहा है।'
      : 'यूट्यूब लाइव सर्च सेवा सेट की जा रही है।'
  };
};
