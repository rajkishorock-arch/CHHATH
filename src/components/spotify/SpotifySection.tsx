import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Song } from '../../types';
import { chhathSongs } from '../../data/songs';
import { 
  searchYouTubeVideos, 
  convertToSongModel, 
  YouTubeSearchSong 
} from '../../services/youtubeSearchService';
import { SongLyricsModal } from '../audio/SongLyricsModal';
import { 
  Play, 
  Pause, 
  Search, 
  X, 
  CheckCircle2, 
  Music, 
  Sparkles, 
  Disc3, 
  RefreshCw, 
  ListMusic, 
  FileText,
  ExternalLink
} from 'lucide-react';

const YouTubeIcon = ({ className = "w-4 h-4 text-red-600" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SpotifyIcon = ({ className = "w-4 h-4 fill-current" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.467-1.027.25-2.815-1.72-6.358-2.108-10.533-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.568-1.043 8.49-.607 11.645 1.339.353.217.467.674.25 1.027zm1.467-3.26c-.272.443-.847.585-1.29.313-3.224-1.982-8.14-2.556-11.954-1.398-.498.151-1.028-.135-1.18-.633-.151-.498.135-1.028.633-1.18 4.364-1.324 9.778-.684 13.478 1.598.443.272.585.847.313 1.3zm.126-3.41C15.226 8.35 8.847 8.14 5.15 9.262c-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.218.75-1.398 4.24-1.288 11.285-1.045 15.748 1.604.53.315.703 1.002.388 1.533-.315.53-1.002.703-1.533.388z"/>
  </svg>
);

// Format seconds or strings into MM:SS
const formatDuration = (val?: string | number) => {
  if (!val) return '5:00';
  if (typeof val === 'string') return val;
  const m = Math.floor(val / 60);
  const s = Math.floor(val % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Official Spotify Curated Playlists for direct Spotify App listening
export interface OfficialSpotifyPlaylist {
  id: string;
  title: string;
  subtitle: string;
  spotifySearchUrl: string;
  coverImage: string;
  trackCountText: string;
  artist: string;
}

export const OFFICIAL_SPOTIFY_PLAYLISTS: OfficialSpotifyPlaylist[] = [
  {
    id: 'sp_sharda',
    title: 'शारदा सिन्हा सम्पूर्ण छठ भजन',
    subtitle: 'पद्मभूषण शारदा सिन्हा के अमर पारंपरिक भक्ति गीत',
    spotifySearchUrl: 'https://open.spotify.com/search/Sharda%20Sinha%20Chhath%20Geet',
    coverImage: 'https://i.ytimg.com/vi/BsAFCc901MM/hqdefault.jpg',
    trackCountText: '30+ अमर गीत',
    artist: 'शारदा सिन्हा'
  },
  {
    id: 'sp_pawan',
    title: 'पवन सिंह व टॉप छठ हिट्स 2026',
    subtitle: 'पवन सिंह, खेसारी व मैथिली ठाकुर के नए भक्ति गीत',
    spotifySearchUrl: 'https://open.spotify.com/search/Pawan%20Singh%20Chhath%20Geet',
    coverImage: 'https://i.ytimg.com/vi/OSQI61ilOsM/hqdefault.jpg',
    trackCountText: '50+ सुपरहिट भजन',
    artist: 'पवन सिंह व अन्य'
  },
  {
    id: 'sp_anuradha',
    title: 'अनुराधा पौडवाल छठ पूजा आरती व कथा',
    subtitle: 'छठी मईया की पावन आरती, स्तुति व अमृतमय भजन',
    spotifySearchUrl: 'https://open.spotify.com/search/Anuradha%20Paudwal%20Chhath%20Puja',
    coverImage: 'https://i.ytimg.com/vi/knZ8b5YnQiY/hqdefault.jpg',
    trackCountText: '25+ भक्तिमय भजन',
    artist: 'अनुराधा पौडवाल'
  }
];

interface SpotifySectionProps {
  onNavigate?: (tab: string) => void;
}

export const SpotifySection: React.FC<SpotifySectionProps> = ({ onNavigate }) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    lyricsSong, 
    setLyricsSong,
    queue, 
    addToQueue 
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [songsList, setSongsList] = useState<Song[]>(() => chhathSongs);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'सभी छठ गीत' },
    { id: 'sharda', label: 'शारदा सिन्हा', query: 'शारदा सिन्हा लोकप्रिय छठ गीत' },
    { id: 'anuradha', label: 'अनुराधा पौडवाल', query: 'अनुराधा पौडवाल छठ भजन' },
    { id: 'pawan', label: 'पवन सिंह', query: 'पवन सिंह नए छठ गीत' },
    { id: 'khesari', label: 'खेसारी लाल', query: 'खेसारी लाल यादव छठ पूजा' },
    { id: 'maithili', label: 'मैथिली ठाकुर', query: 'मैथिली ठाकुर छठ गीत' },
    { id: 'traditional', label: 'पारंपरिक अर्घ्य', query: 'कांच ही बांस के बहंगिया केलवा के पात' }
  ];

  // Execute Real Live Search
  const handleExecuteSearch = useCallback(async (queryText: string, pageToken?: string) => {
    if (!queryText.trim()) {
      setSongsList(chhathSongs);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await searchYouTubeVideos(queryText.trim(), pageToken);
      if (resp && resp.results && resp.results.length > 0) {
        const models = resp.results.map(convertToSongModel);
        if (pageToken) {
          setSongsList(prev => [...prev, ...models]);
        } else {
          setSongsList(models);
        }
        setNextPageToken(resp.nextPageToken || null);
      } else if (!pageToken) {
        // Fallback filter over existing real songs
        const q = queryText.toLowerCase();
        const filtered = chhathSongs.filter(s => 
          s.title.toLowerCase().includes(q) || 
          (s.singer && s.singer.toLowerCase().includes(q))
        );
        setSongsList(filtered.length > 0 ? filtered : chhathSongs);
      }
    } catch (err) {
      console.warn('Search error in Spotify section:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle Search Input Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleExecuteSearch(searchQuery.trim());
    }
  };

  // Handle Category Filter Click
  const handleCategoryClick = (cat: typeof categories[0]) => {
    setActiveCategory(cat.id);
    if (cat.id === 'all') {
      setSearchQuery('');
      setSongsList(chhathSongs);
    } else if (cat.query) {
      setSearchQuery('');
      handleExecuteSearch(cat.query);
    }
  };

  return (
    <div className="container-custom max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6 space-y-5 animate-in fade-in duration-300 font-mukta text-stone-900 dark:text-stone-100">

      {/* ========================================================
          TOP AUDIO PLATFORM SWITCHER: YouTube vs Spotify Hub
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1DB954] flex items-center justify-center text-black shadow-md shadow-[#1DB954]/25 shrink-0">
            <SpotifyIcon className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span>छठ महापर्व Spotify हब</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/15 text-[#1DB954] text-[10px] font-bold">
                अमृत भक्ति ऑडियो
              </span>
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              संपूर्ण छठ महापर्व के वास्तविक भक्ति भजन, बिना किसी रुकावट के इन-ऐप प्लेबैक
            </p>
          </div>
        </div>

        {/* Clean Mode Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 w-full sm:w-auto justify-center">
          <button
            onClick={() => onNavigate?.('music')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white text-xs font-semibold transition-all hover:bg-white dark:hover:bg-stone-700 active:scale-95 cursor-pointer"
          >
            <YouTubeIcon className="w-4 h-4 text-red-600" />
            <span>यूट्यूब संगीत</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1DB954] text-black text-xs font-bold shadow-sm shadow-[#1DB954]/30"
          >
            <SpotifyIcon className="w-3.5 h-3.5 fill-current" />
            <span>Spotify (सक्रिय)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          CURATED SPOTIFY OFFICIAL CHHATH PLAYLISTS BENTO
         ======================================================== */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white border border-[#1DB954]/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center text-black shrink-0 shadow-md">
              <SpotifyIcon className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Spotify ऑफिशियल छठ प्लेलिस्ट्स</span>
                <span className="px-2 py-0.2 rounded-full bg-white/10 text-[#1DB954] text-[10px] font-semibold">
                  आधिकारिक संग्रह
                </span>
              </h2>
              <p className="text-stone-400 text-xs">
                शारदा सिन्हा व महापर्व के विशेष भक्ति भजन संग्रह
              </p>
            </div>
          </div>
        </div>

        {/* 3 Real Curated Playlists Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {OFFICIAL_SPOTIFY_PLAYLISTS.map((pl) => (
            <a
              key={pl.id}
              href={pl.spotifySearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1DB954]/50 transition-all flex items-center gap-3 group text-decoration-none"
            >
              <img
                src={pl.coverImage}
                alt={pl.title}
                className="w-13 h-13 rounded-xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-white text-xs font-bold truncate group-hover:text-[#1DB954] transition-colors">
                  {pl.title}
                </h3>
                <p className="text-stone-400 text-[11px] truncate mt-0.5">{pl.subtitle}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#1DB954] font-semibold">
                  <span>{pl.trackCountText}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 group-hover:underline">
                    Spotify <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ========================================================
          SEARCH BAR & SINGER CATEGORY PILLS (YOUTUBE-STANDARD)
         ======================================================== */}
      <div className="space-y-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative flex-1 flex items-center bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 focus-within:border-[#1DB954] focus-within:ring-1 focus-within:ring-[#1DB954]/40 rounded-full transition-all shadow-xs">
            <div className="pl-3.5 pr-2 text-stone-500 dark:text-stone-400 flex items-center pointer-events-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="छठ गीत या गायक खोजें... (उदा: शारदा सिन्हा, केलवा के पात, पवन सिंह)"
              className="w-full py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none pr-2"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSongsList(chhathSongs);
                }}
                className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white mr-2 cursor-pointer"
                title="साफ़ करें"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-1.5 mr-1.5 rounded-full bg-[#1DB954] text-black font-bold text-xs shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              खोजें
            </button>
          </div>
        </form>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1DB954] text-black font-bold shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="py-8 flex items-center justify-center">
          <div className="p-3 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <RefreshCw className="w-6 h-6 animate-spin text-[#1DB954]" />
          </div>
        </div>
      )}

      {/* ========================================================
          REAL CHHATH SONGS GRID (100% REAL - NO DUMMY ITEMS)
         ======================================================== */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {songsList.map((song) => {
            const isCurrent = currentSong?.id === song.id || (currentSong?.youtubeId && currentSong.youtubeId === song.youtubeId);
            const isPlayingThis = isCurrent && isPlaying;
            const singerInitial = song.singer ? song.singer.trim().charAt(0) : 'छ';

            return (
              <div
                key={song.id || song.youtubeId}
                onClick={() => {
                  if (isCurrent) togglePlay();
                  else playSong(song, songsList);
                }}
                className={`group rounded-2xl bg-white dark:bg-stone-900 border overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer select-none ${
                  isCurrent
                    ? 'border-[#1DB954] ring-2 ring-[#1DB954]/50 shadow-md'
                    : 'border-stone-200 dark:border-stone-800 hover:border-[#1DB954]/40 hover:bg-stone-50 dark:hover:bg-stone-850'
                }`}
              >
                {/* 16:9 Thumbnail Container with Real Video Artwork */}
                <div className="relative aspect-video w-full bg-stone-950 overflow-hidden select-none">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      if (song.youtubeId) {
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`;
                      }
                    }}
                  />

                  {/* Play / Pause Overlay */}
                  <div
                    className={`absolute inset-0 transition-opacity flex items-center justify-center ${
                      isPlayingThis
                        ? 'bg-black/40 opacity-100'
                        : 'bg-black/30 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all ${
                        isPlayingThis
                          ? 'bg-[#1DB954] text-black scale-100 ring-4 ring-[#1DB954]/30'
                          : 'bg-stone-950/80 text-white group-hover:scale-110'
                      }`}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {song.duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider">
                      {formatDuration(song.duration)}
                    </div>
                  )}

                  {/* Spotify Badge in Corner */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[#1DB954] text-[10px] font-bold flex items-center gap-1">
                    <SpotifyIcon className="w-3 h-3 fill-current" />
                    <span>ऑडियो</span>
                  </div>
                </div>

                {/* Details Row */}
                <div className="p-3 flex items-start gap-2.5">
                  {/* Singer Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1DB954] to-emerald-600 border border-[#1DB954]/40 text-black font-bold text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    {singerInitial}
                  </div>

                  {/* Title & Singer Details */}
                  <div className="min-w-0 flex-1">
                    <h4 
                      className={`font-semibold text-xs sm:text-sm line-clamp-2 leading-snug transition-colors ${
                        isCurrent ? 'text-[#1DB954] font-bold' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#1DB954]'
                      }`}
                      title={song.title}
                    >
                      {song.title}
                    </h4>

                    <div className="flex items-center gap-1 mt-1 text-xs text-stone-600 dark:text-stone-400 truncate">
                      <span className="truncate">{song.singer}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      <span>{song.category || 'भक्ति'}</span>
                      <span>•</span>
                      <span>{song.language || 'भोजपुरी'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lyrics Modal */}
      {lyricsSong && (
        <SongLyricsModal
          song={lyricsSong}
          isOpen={Boolean(lyricsSong)}
          onClose={() => setLyricsSong(null)}
        />
      )}

    </div>
  );
};
