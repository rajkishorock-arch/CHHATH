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

// Short cache TTL (60s) to guarantee fresh and dynamic results without stale feeling
const playlistCache: Record<string, { timestamp: number; playlists: DynamicChhathPlaylist[] }> = {};
const CACHE_TTL_MS = 60 * 1000;

// Diverse live YouTube query bank for Chhath playlists, mixes & jukeboxes
const CHHATH_PLAYLIST_QUERIES: Record<string, string[]> = {
  all: [
    'शारदा सिन्हा अमर छठ महापर्व जूकबॉक्स संग्रह',
    'पवन सिंह नए छठ गीत 2026 जूकबॉक्स नॉनस्टॉप',
    'अनुराधा पौडवाल सम्पूर्ण छठ पूजा भजन जूकबॉक्स',
    'खेसारी लाल यादव छठ पूजा नॉनस्टॉप भक्ति जूकबॉक्स',
    'मैथिली ठाकुर पारम्परिक छठ महापर्व वंदना जूकबॉक्स',
    'छठ पूजा संध्या अर्घ्य उषा अर्घ्य सम्पूर्ण आरती जूकबॉक्स',
    'छठ पूजा नॉनस्टॉप जूकबॉक्स 2026 ऑल सुपरहिट',
    'मनोज तिवारी पारम्परिक छठ पूजा गीत जूकबॉक्स',
    'भोजपुरी पारंपरिक छठ गीत ऑल टाइम हिट्स जूकबॉक्स',
    'पटना गंगा घाट छठ पूजा लाइव आरती दर्शन जूकबॉक्स',
    'कांच ही बांस के बहंगिया छठ स्पेशल जूकबॉक्स',
    'सोनू निगम सूर्य देव छठ भजन संग्रह जूकबॉक्स'
  ],
  playlists: [
    'छठ पूजा जूकबॉक्स सम्पूर्ण भक्ति संग्रह 2026',
    'शारदा सिन्हा छठ महापर्व नॉनस्टॉप जूकबॉक्स',
    'पवन सिंह छठ पूजा सुपरहिट ऑल सोंग्स जूकबॉक्स',
    'खेसारी लाल यादव छठ गीत नॉनस्टॉप प्लेलिस्ट',
    'अनुराधा पौडवाल सम्पूर्ण छठ पूजा संग्रह',
    'मैथिली ठाकुर छठ गीत पारम्परिक संग्रह',
    'छठ पूजा संध्या अर्घ्य उषा अर्घ्य स्पेशल जूकबॉक्स',
    'भोजपुरी पारंपरिक छठ गीत ऑल टाइम हिट्स जूकबॉक्स',
    'दउरा उठावे के पारम्परिक छठ गीत संग्रह',
    'कोसी भराई छठ पूजा स्पेशल गीत जूकबॉक्स',
    'नहाय खाय खरना स्पेशल पारंपरिक छठ गीत जूकबॉक्स',
    'अक्षरा सिंह रितेश पांडे छठ गीत 2026 जूकबॉक्स'
  ],
  sharda: [
    'शारदा सिन्हा अमर छठ महापर्व जूकबॉक्स संग्रह',
    'शारदा सिन्हा सम्पूर्ण छठ पूजा नॉनस्टॉप भजन',
    'शारदा सिन्हा के अमर पारंपरिक छठ गीत जूकबॉक्स'
  ],
  pawan: [
    'पवन सिंह नए छठ गीत 2026 जूकबॉक्स नॉनस्टॉप',
    'पवन सिंह छठ पूजा सुपरहिट ऑल सोंग्स जूकबॉक्स',
    'पवन सिंह भक्ति छठ पूजा ऑल टाइम हिट्स'
  ],
  khesari: [
    'खेसारी लाल यादव छठ पूजा नॉनस्टॉप भक्ति जूकबॉक्स',
    'खेसारी लाल यादव छठ गीत नॉनस्टॉप प्लेलिस्ट',
    'खेसारी लाल यादव छठ महापर्व सुपरहिट सोंग्स'
  ],
  anuradha: [
    'अनुराधा पौडवाल सम्पूर्ण छठ पूजा भजन जूकबॉक्स',
    'अनुराधा पौडवाल पावन छठ महापर्व आरती वंदना',
    'अनुराधा पौडवाल सुपरहिट छठ गीत नॉनस्टॉप'
  ],
  maithili: [
    'मैथिली ठाकुर पारम्परिक छठ महापर्व वंदना जूकबॉक्स',
    'मैथिली ठाकुर सम्पूर्ण छठ गीत संग्रह',
    'मैथिली ठाकुर मैथिली छठ पूजा भजन लाइव'
  ],
  arghya: [
    'छठ पूजा संध्या अर्घ्य उषा अर्घ्य सम्पूर्ण आरती जूकबॉक्स',
    'उग हे सुरुज देव अस्ताचल व उषा अर्घ्य छठ स्पेशल',
    'पटना गंगा घाट छठ पूजा संध्या उषा अर्घ्य भजन'
  ]
};

// Clean titles to look crisp like YouTube Mixes
function cleanYouTubeTitle(rawTitle: string): string {
  let clean = rawTitle
    .replace(/#\S+/g, '')
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .replace(/official\s+video|audio\s+song|video\s+song|full\s+song|full\s+video|lyrical\s+video|hd\s+video/gi, '')
    .trim();

  // If title doesn't specify mix/jukebox, prepend "Mix - " like YouTube does for mixes
  if (!clean.toLowerCase().includes('mix') && !clean.toLowerCase().includes('playlist') && !clean.toLowerCase().includes('जूकबॉक्स')) {
    clean = `Mix - ${clean}`;
  }
  return clean;
}

/**
 * Fetch dynamic, live YouTube Chhath playlists over the internet.
 * Completely randomized & dynamic — zero static datasets.
 */
export async function fetchLivePlaylists(category: string = 'all', forceFresh: boolean = false): Promise<DynamicChhathPlaylist[]> {
  const cacheKey = category.toLowerCase();
  const cached = playlistCache[cacheKey];

  if (!forceFresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.playlists.length > 0) {
    return cached.playlists;
  }

  const queryPool = CHHATH_PLAYLIST_QUERIES[cacheKey] || CHHATH_PLAYLIST_QUERIES.playlists;
  
  // Randomize query order so results are fresh on every call
  const shuffledQueries = [...queryPool].sort(() => Math.random() - 0.5);
  // Pick 4-6 queries to execute in parallel
  const selectedQueries = shuffledQueries.slice(0, Math.min(6, shuffledQueries.length));

  const dynamicPlaylists: DynamicChhathPlaylist[] = [];
  const seenYtIds = new Set<string>();

  const results = await Promise.allSettled(
    selectedQueries.map(async (query) => {
      const res = await searchYouTubeVideos(query, '', 'video', forceFresh);
      if (res.results && res.results.length > 0) {
        const master = res.results[0];
        const subTracks: Song[] = res.results.map((r, idx) => {
          const s = convertToSongModel(r);
          return {
            ...s,
            id: `pl-${master.youtubeId}-tr-${idx + 1}`
          };
        });

        return {
          master,
          category,
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

      const title = cleanYouTubeTitle(master.title);
      const channel = master.channelTitle || 'छठ भक्ति संगीत';

      dynamicPlaylists.push({
        id: `pl-live-${master.youtubeId}`,
        title,
        subtitle: `${channel} • Mix`,
        category: cat,
        thumbnail: master.thumbnailUrl || `https://i.ytimg.com/vi/${master.youtubeId}/hqdefault.jpg`,
        youtubeId: master.youtubeId,
        trackCount: Math.max(subTracks.length, 10),
        durationText: master.duration || 'नॉनस्टॉप संग्रह',
        description: master.description || `${title} - ${channel}`,
        tracks: subTracks
      });
    }
  }

  // Shuffle dynamic playlists so no artist stays permanently in slot #1
  const shuffledResult = dynamicPlaylists.sort(() => Math.random() - 0.5);

  if (shuffledResult.length > 0) {
    playlistCache[cacheKey] = {
      timestamp: Date.now(),
      playlists: shuffledResult
    };
  }

  return shuffledResult;
}
