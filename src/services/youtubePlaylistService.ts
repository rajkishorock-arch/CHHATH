import { Song } from '../types';
import { searchYouTubeVideos, YouTubeSearchSong, convertToSongModel } from './youtubeSearchService';

export interface DynamicChhathPlaylist {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  thumbnail: string;
  youtubeId: string;
  trackCount: number;
  durationText: string;
  description: string;
  tracks: Song[];
}

// In-memory cache to prevent repetitive network requests
const playlistCache: Record<string, { timestamp: number; playlists: DynamicChhathPlaylist[] }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Playlist search queries mapped to categories for live internet fetching
const CATEGORY_QUERY_MAP: Record<string, { query: string; category: string }[]> = {
  all: [
    { query: 'शारदा सिन्हा अमर छठ महापर्व जूकबॉक्स संग्रह', category: 'sharda' },
    { query: 'पवन सिंह नए छठ गीत 2026 जूकबॉक्स नॉनस्टॉप', category: 'pawan' },
    { query: 'अनुराधा पौडवाल सम्पूर्ण छठ पूजा भजन जूकबॉक्स', category: 'anuradha' },
    { query: 'खेसारी लाल यादव छठ पूजा नॉनस्टॉप भक्ति जूकबॉक्स', category: 'khesari' },
    { query: 'मैथिली ठाकुर पारम्परिक छठ महापर्व वंदना जूकबॉक्स', category: 'maithili' },
    { query: 'छठ पूजा संध्या अर्घ्य उषा अर्घ्य सम्पूर्ण आरती जूकबॉक्स', category: 'arghya' }
  ],
  playlists: [
    { query: 'छठ पूजा जूकबॉक्स सम्पूर्ण भक्ति संग्रह 2026', category: 'all' },
    { query: 'शारदा सिन्हा छठ महापर्व नॉनस्टॉप जूकबॉक्स', category: 'sharda' },
    { query: 'पवन सिंह छठ पूजा सुपरहिट ऑल सोंग्स जूकबॉक्स', category: 'pawan' },
    { query: 'खेसारी लाल यादव छठ गीत नॉनस्टॉप प्लेलिस्ट', category: 'khesari' },
    { query: 'अनुराधा पौडवाल सम्पूर्ण छठ पूजा संग्रह', category: 'anuradha' },
    { query: 'मैथिली ठाकुर छठ गीत पारम्परिक संग्रह', category: 'maithili' },
    { query: 'छठ पूजा संध्या अर्घ्य उषा अर्घ्य स्पेशल जूकबॉक्स', category: 'arghya' },
    { query: 'भोजपुरी पारंपरिक छठ गीत ऑल टाइम हिट्स जूकबॉक्स', category: 'traditional' }
  ],
  sharda: [
    { query: 'शारदा सिन्हा अमर छठ महापर्व जूकबॉक्स संग्रह', category: 'sharda' },
    { query: 'शारदा सिन्हा सम्पूर्ण छठ पूजा नॉनस्टॉप भजन', category: 'sharda' }
  ],
  pawan: [
    { query: 'पवन सिंह नए छठ गीत 2026 जूकबॉक्स नॉनस्टॉप', category: 'pawan' },
    { query: 'पवन सिंह छठ पूजा सुपरहिट ऑल सोंग्स जूकबॉक्स', category: 'pawan' }
  ],
  khesari: [
    { query: 'खेसारी लाल यादव छठ पूजा नॉनस्टॉप भक्ति जूकबॉक्स', category: 'khesari' },
    { query: 'खेसारी लाल यादव छठ गीत नॉनस्टॉप प्लेलिस्ट', category: 'khesari' }
  ],
  anuradha: [
    { query: 'अनुराधा पौडवाल सम्पूर्ण छठ पूजा भजन जूकबॉक्स', category: 'anuradha' },
    { query: 'अनुराधा पौडवाल पावन छठ महापर्व आरती वंदना', category: 'anuradha' }
  ],
  maithili: [
    { query: 'मैथिली ठाकुर पारम्परिक छठ महापर्व वंदना जूकबॉक्स', category: 'maithili' },
    { query: 'मैथिली ठाकुर सम्पूर्ण छठ गीत संग्रह', category: 'maithili' }
  ],
  arghya: [
    { query: 'छठ पूजा संध्या अर्घ्य उषा अर्घ्य सम्पूर्ण आरती जूकबॉक्स', category: 'arghya' },
    { query: 'उग हे सुरुज देव अस्ताचल व उषा अर्घ्य छठ स्पेशल', category: 'arghya' }
  ]
};

/**
 * Fetch real-world dynamic Chhath playlists over the internet via live YouTube API.
 * No hardcoded static datasets.
 */
export async function fetchLivePlaylists(category: string = 'all'): Promise<DynamicChhathPlaylist[]> {
  const cacheKey = category.toLowerCase();
  const cached = playlistCache[cacheKey];

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.playlists.length > 0) {
    return cached.playlists;
  }

  const queries = CATEGORY_QUERY_MAP[cacheKey] || CATEGORY_QUERY_MAP.all;
  const dynamicPlaylists: DynamicChhathPlaylist[] = [];
  const seenYtIds = new Set<string>();

  // Fetch in parallel with fault tolerance
  const results = await Promise.allSettled(
    queries.map(async (item) => {
      const res = await searchYouTubeVideos(item.query, '', 'video');
      if (res.results && res.results.length > 0) {
        // First result is the master jukebox/playlist video
        const master = res.results[0];
        // Remaining results serve as individual tracks for this playlist!
        const subTracks: Song[] = res.results.map((r, idx) => {
          const s = convertToSongModel(r);
          return {
            ...s,
            id: `pl-${master.youtubeId}-tr-${idx + 1}`
          };
        });

        return {
          master,
          category: item.category,
          subTracks
        };
      }
      return null;
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      const { master, category: cat, subTracks } = r.value;
      if (!master.youtubeId || seenYtIds.has(master.youtubeId)) continue;
      seenYtIds.add(master.youtubeId);

      // Clean title and ensure YouTube "Mix" styling
      let cleanTitle = master.title
        .replace(/#\S+/g, '')
        .replace(/\[.*?\]|\(.*?\)/g, '')
        .trim();
      if (!cleanTitle.toLowerCase().includes('mix') && !cleanTitle.toLowerCase().includes('playlist')) {
        cleanTitle = `Mix - ${cleanTitle}`;
      }

      dynamicPlaylists.push({
        id: `pl-live-${master.youtubeId}`,
        title: cleanTitle,
        subtitle: `${master.channelTitle || 'छठ भक्ति संगीत'} • Playlist`,
        category: cat,
        thumbnail: master.thumbnailUrl || `https://i.ytimg.com/vi/${master.youtubeId}/hqdefault.jpg`,
        youtubeId: master.youtubeId,
        trackCount: Math.max(subTracks.length, 6),
        durationText: master.duration || 'नॉनस्टॉप संग्रह',
        description: master.description || `${cleanTitle} - ${master.channelTitle}`,
        tracks: subTracks
      });
    }
  }

  if (dynamicPlaylists.length > 0) {
    playlistCache[cacheKey] = {
      timestamp: Date.now(),
      playlists: dynamicPlaylists
    };
  }

  return dynamicPlaylists;
}
