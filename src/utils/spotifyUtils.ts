import { Song } from '../types';

export const getSpotifySongUrl = (song: Pick<Song, 'title'> & Partial<Pick<Song, 'singer' | 'spotifyUrl'>>): string => {
  if (song.spotifyUrl) return song.spotifyUrl;
  const cleanTitle = (song.title || '').replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/[#।|]/g, ' ').trim();
  const cleanSinger = (song.singer || '').replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/पद्मभूषण|स्वर कोकिला|भोजपुरी/g, ' ').trim();
  const query = encodeURIComponent(`${cleanTitle} ${cleanSinger}`.trim());
  return `https://open.spotify.com/search/${query}`;
};

export interface SpotifyChhathPlaylist {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  coverImage: string;
  trackCountText: string;
}

export const CHHATH_SPOTIFY_PLAYLISTS: SpotifyChhathPlaylist[] = [
  {
    id: 'sharda-sinha-chhath',
    title: 'शारदा सिन्हा सम्पूर्ण छठ भजन',
    subtitle: 'पद्मभूषण शारदा सिन्हा के अमर पारंपरिक भक्ति गीत',
    url: 'https://open.spotify.com/search/Sharda%20Sinha%20Chhath%20Geet',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    trackCountText: '30+ अमर गीत'
  },
  {
    id: 'chhath-mahaparv-hits',
    title: 'छठ महापर्व 2026 स्पेशल हिट्स',
    subtitle: 'पवन सिंह, खेसारी, मैथिली ठाकुर व पारंपरिक धुन',
    url: 'https://open.spotify.com/search/Chhath%20Puja%20Special%20Songs',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
    trackCountText: '50+ सुपरहिट भजन'
  },
  {
    id: 'anuradha-paudwal-chhath',
    title: 'अनुराधा पौडवाल छठ पूजा आरती व कथा',
    subtitle: 'छठी मईया की आरती, पावन कथा व वंदना संग्रह',
    url: 'https://open.spotify.com/search/Anuradha%20Paudwal%20Chhath%20Puja',
    coverImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=80',
    trackCountText: '25+ भक्तिमय भजन'
  }
];
