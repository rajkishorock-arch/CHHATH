import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAudio } from '../../context/AudioContext';
import { Song } from '../../types';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  Search, 
  Plus, 
  AlertCircle, 
  FileText,
  Heart,
  Mic,
  MicOff,
  X,
  CheckCircle2,
  Music
} from 'lucide-react';

import { SongLyricsModal } from './SongLyricsModal';
import { 
  searchYouTubeVideos, 
  convertToSongModel, 
  YouTubeSearchSong 
} from '../../services/youtubeSearchService';

// Format seconds or strings into MM:SS
const formatDuration = (val?: string | number) => {
  if (!val) return '4:15';
  if (typeof val === 'string') return val;
  const m = Math.floor(val / 60);
  const s = Math.floor(val % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// YouTube-Style Video Card Component
const YouTubeVideoCardComponent: React.FC<{
  song: Song;
  isCurrent: boolean;
  isPlayingThis: boolean;
  inQueue: boolean;
  isFav: boolean;
  onPlay: () => void;
  onToggleQueue: () => void;
  onToggleFav: () => void;
  onOpenLyrics?: () => void;
  isLiveApi?: boolean;
}> = ({
  song,
  isCurrent,
  isPlayingThis,
  inQueue,
  isFav,
  onPlay,
  onToggleQueue,
  onToggleFav,
  onOpenLyrics,
}) => {
  const thumbUrl = song.thumbnail;
  const ytUrl = song.youtubeId ? `https://www.youtube.com/watch?v=${song.youtubeId}` : song.audioUrl;
  const singerInitial = song.singer ? song.singer.trim().charAt(0) : 'छ';

  return (
    <div
      className={`group rounded-2xl bg-white dark:bg-stone-900 border overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md ${
        isCurrent
          ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md'
          : 'border-stone-200 dark:border-stone-800 hover:border-amber-500/40 hover:bg-stone-50 dark:hover:bg-stone-850'
      }`}
    >
      {/* 16:9 YouTube Thumbnail Container */}
      <div 
        onClick={onPlay} 
        className="relative aspect-video w-full bg-stone-950 overflow-hidden cursor-pointer select-none"
      >
        <img
          src={thumbUrl}
          alt={song.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const el = e.currentTarget;
            if (song.youtubeId) {
              el.src = `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
            }
          }}
        />

        {/* Hover / Play Overlay */}
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
                ? 'bg-amber-500 text-stone-950 scale-100 ring-4 ring-amber-500/30'
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

        {/* Playing Animated Equalizer Bar */}
        {isPlayingThis && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs border border-amber-400/30 flex items-center gap-1.5 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-bold text-amber-300">बज रहा है</span>
          </div>
        )}

        {/* Video Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider">
          {formatDuration(song.duration)}
        </div>
      </div>

      {/* Video Details Row (YouTube App Layout) */}
      <div className="p-3 flex items-start gap-2.5">
        {/* Channel / Artist Avatar Circle */}
        <div 
          onClick={onPlay}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-400/40 text-stone-950 font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-sm mt-0.5"
        >
          {singerInitial}
        </div>

        {/* Title & Metadata */}
        <div className="min-w-0 flex-1">
          <h4 
            onClick={onPlay}
            className={`font-semibold text-xs sm:text-sm line-clamp-2 leading-snug cursor-pointer transition-colors ${
              isCurrent ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-200'
            }`}
            title={song.title}
          >
            {song.title}
          </h4>

          {/* Singer Name & Verified Badge */}
          <div className="flex items-center gap-1 mt-1 text-xs text-stone-600 dark:text-stone-400 truncate">
            <span className="truncate">{song.singer}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 shrink-0" />
          </div>

          {/* Category & Tags */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            <span>{song.category || 'भक्ति'}</span>
            <span>•</span>
            <span>{song.language || 'भोजपुरी'}</span>
          </div>
        </div>
      </div>

      {/* Action Bar (Play, Queue, Favorite, Lyrics, YouTube) */}
      <div className="px-3 pb-3 pt-1 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between gap-1 text-xs">
        <button
          onClick={onPlay}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
            isPlayingThis
              ? 'bg-red-600 text-white shadow'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow'
          }`}
        >
          {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-stone-950 ml-0.5" />}
          <span>{isPlayingThis ? 'रोकें' : 'बजाएं'}</span>
        </button>

        <div className="flex items-center gap-1">
          {onOpenLyrics && song.lyrics && (
            <button
              onClick={onOpenLyrics}
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="गीत के बोल (Lyrics)"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleQueue}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              inQueue ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={inQueue ? 'कतार में मौजूद' : 'कतार में जोड़ें'}
          >
            {inQueue ? <Check className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleFav}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFav ? 'text-rose-500' : 'text-stone-500 dark:text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={isFav ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>

          {ytUrl && (
            <a
              href={ytUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="YouTube पर खोलें"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const YouTubeVideoCard = React.memo(YouTubeVideoCardComponent);

export interface SongsSectionProps {
  initialQuery?: string;
}

export const SongsSection: React.FC<SongsSectionProps> = ({ initialQuery }) => {
  const { songs } = useChhathData();
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    favorites, 
    toggleFavorite,
    lyricsSong, 
    setLyricsSong,
    queue, 
    addToQueue 
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // YouTube API Real Search States: 'idle' | 'loading' | 'success' | 'no_results' | 'error'
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'success' | 'no_results' | 'error'>('idle');
  const [ytSearchResults, setYtSearchResults] = useState<YouTubeSearchSong[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Voice Search States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Extract all valid playable songs from data context
  const baseSongs = useMemo(() => {
    return songs.filter(s => 
      !s.isPlaylist &&
      Boolean(s.thumbnail) && 
      !s.thumbnail.includes('undefined') && 
      !s.thumbnail.includes('null') && 
      Boolean(s.youtubeId && s.youtubeId.length >= 5)
    );
  }, [songs]);

  // Infinite stream state
  const [streamSongs, setStreamSongs] = useState<Song[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const streamCycleRef = useRef(1);
  const recQueryIndexRef = useRef(0);
  const recNextTokenRef = useRef<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Initialize streamSongs with baseSongs
  useEffect(() => {
    if (baseSongs.length > 0 && streamSongs.length === 0) {
      setStreamSongs(baseSongs);
    }
  }, [baseSongs, streamSongs.length]);

  const CHHATH_REC_TOPICS = [
    'शारदा सिन्हा के लोकप्रिय छठ गीत',
    'पवन सिंह छठ गीत 2026',
    'खेसारी लाल यादव छठ पूजा',
    'अनुराधा पौडवाल छठ भजन',
    'मैथिली ठाकुर छठ महापर्व गीत',
    'कांच ही बांस के बहंगिया छठ गीत',
    'केलवा के पात पर छठ पूजा',
    'उगी हे सुरुज देव दीनानाथ',
    'छठ संध्या अर्घ्य भक्ति गीत',
    'छठ उषा अर्घ्य गीत',
    'दौरा घाटे पहुंचे छठ गीत',
    'छठ महापर्व स्पेशल जूकबॉक्स'
  ];

  // Function to load the next batch of infinite songs
  const loadMoreStreamSongs = useCallback(async () => {
    if (isLoadingRecommendations) return;

    // If streamSongs has more buffered items than currently visible, reveal the next batch
    if (visibleCount + 12 <= streamSongs.length) {
      setVisibleCount(prev => prev + 12);
      return;
    }

    setIsLoadingRecommendations(true);
    try {
      // 1. First try live YouTube recommendations
      const qIndex = recQueryIndexRef.current % CHHATH_REC_TOPICS.length;
      const query = CHHATH_REC_TOPICS[qIndex];
      const token = recNextTokenRef.current || '';
      
      let fetchedLiveSongs: Song[] = [];
      try {
        const res = await searchYouTubeVideos(query, token);
        if (res.results && res.results.length > 0) {
          recNextTokenRef.current = res.nextPageToken || null;
          if (!res.nextPageToken) recQueryIndexRef.current++;

          const existingYt = new Set(streamSongs.map(s => s.youtubeId).filter(Boolean));
          fetchedLiveSongs = res.results
            .filter(r => r.thumbnailUrl && !r.thumbnailUrl.includes('undefined') && Boolean(r.youtubeId) && r.youtubeId.length >= 5 && !existingYt.has(r.youtubeId))
            .map(convertToSongModel);
        } else {
          recQueryIndexRef.current++;
        }
      } catch {
        recQueryIndexRef.current++;
      }

      // 2. If live YouTube yielded new unique songs, append them!
      if (fetchedLiveSongs.length > 0) {
        setStreamSongs(prev => [...prev, ...fetchedLiveSongs]);
        setVisibleCount(prev => prev + 12);
      } else {
        // 3. Fallback: Seamless continuous devotional cycling from rich catalog
        const cycle = streamCycleRef.current++;
        const pool = baseSongs.length > 0 ? baseSongs : songs;
        const nextBatch: Song[] = pool.map((s, idx) => ({
          ...s,
          id: `endless-${cycle}-${idx}-${s.youtubeId || s.id}`
        }));

        setStreamSongs(prev => [...prev, ...nextBatch]);
        setVisibleCount(prev => prev + 12);
      }
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [isLoadingRecommendations, visibleCount, streamSongs, baseSongs, songs]);

  // Execute YouTube API Search
  const handleExecuteSearch = async (query: string, token: string = '') => {
    if (!query.trim()) return;

    if (!token) {
      setSearchStatus('loading');
      setYtSearchResults([]);
      setNextPageToken(null);
      setErrorMessage(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await searchYouTubeVideos(query, token);
      setIsLiveApi(response.isLiveApi);

      if (response.results && response.results.length > 0) {
        setYtSearchResults(prev => token ? [...prev, ...response.results] : response.results);
        setNextPageToken(response.nextPageToken);
        setSearchStatus('success');
      } else {
        if (!token) {
          setYtSearchResults([]);
          setSearchStatus('no_results');
          setErrorMessage(response.error || 'कोई गाना नहीं मिला।');
        }
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchStatus('error');
      setErrorMessage(err.message || 'नेटवर्क या API त्रुटि हुई।');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchStatus('idle');
    setYtSearchResults([]);
    setNextPageToken(null);
    setErrorMessage(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleExecuteSearch(searchQuery.trim());
  };

  // Voice Search handler
  const toggleVoiceSearch = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है।');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('बोलिए... (उदा: शारदा सिन्हा छठ गीत)');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript) {
          setSearchQuery(transcript);
          setIsListening(false);
          setVoiceNotice(null);
          handleExecuteSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('आवाज पहचानी नहीं गई, कृपया पुनः प्रयास करें।');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Sync initialQuery prop
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setSearchQuery(initialQuery.trim());
      handleExecuteSearch(initialQuery.trim());
    }
  }, [initialQuery]);

  // Listen for global custom search event dispatched from TopSongSearchBar
  useEffect(() => {
    const handleMusicSearchEvent = (e: any) => {
      const q = e.detail?.query;
      if (q && q.trim()) {
        setSearchQuery(q.trim());
        handleExecuteSearch(q.trim());
      }
    };
    window.addEventListener('chhath_music_search', handleMusicSearchEvent);
    return () => window.removeEventListener('chhath_music_search', handleMusicSearchEvent);
  }, []);

  // Inspect hash parameters on mount (e.g. #music?q=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&]q=([^&]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        if (decoded.trim() && !searchQuery) {
          setSearchQuery(decoded.trim());
          handleExecuteSearch(decoded.trim());
        }
      }
    }
  }, []);

  // IntersectionObserver for seamless auto-infinite scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (searchStatus === 'success' && nextPageToken && !isLoadingMore) {
            handleExecuteSearch(searchQuery, nextPageToken);
          } else if (searchStatus === 'idle' && !isLoadingRecommendations) {
            loadMoreStreamSongs();
          }
        }
      },
      { rootMargin: '600px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchStatus, nextPageToken, isLoadingMore, searchQuery, isLoadingRecommendations, loadMoreStreamSongs]);

  // The displayed songs for idle browsing state
  const displaySongs = useMemo(() => {
    const list = streamSongs.length > 0 ? streamSongs : baseSongs;
    return list.slice(0, visibleCount);
  }, [streamSongs, baseSongs, visibleCount]);

  return (
    <section id="songs" className="py-2 sm:py-6 px-1 sm:px-4 bg-transparent text-stone-900 dark:text-stone-100 font-mukta">
      <div className="max-w-6xl mx-auto space-y-3.5">
        
        {/* ========================================================
            YOUTUBE-STYLE CLEAN TOP SEARCH BAR (RIGHT AT TOP!)
           ======================================================== */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative flex-1 flex items-center bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/40 rounded-full transition-all shadow-xs">
            <div className="pl-3.5 pr-2 text-stone-500 dark:text-stone-400 flex items-center pointer-events-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="छठ गीत या गायक खोजें... (उदा: शारदा सिन्हा, पवन सिंह)"
              className="w-full py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none pr-2"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white mr-1 cursor-pointer"
                title="साफ़ करें"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-1.5 sm:p-2 rounded-full mr-1 transition-colors cursor-pointer ${
                isListening ? 'bg-red-600 text-white animate-pulse' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="आवाज से खोजें (Voice Search)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={searchStatus === 'loading' || !searchQuery.trim()}
            className="ml-2 px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            {searchStatus === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin text-stone-950" /> : <Search className="w-4 h-4 text-stone-950" />}
            <span className="hidden sm:inline">खोजें</span>
          </button>
        </form>

        {voiceNotice && (
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs text-center font-bold animate-in fade-in">
            {voiceNotice}
          </div>
        )}

        {/* SKELETON LOADERS WHILE SEARCHING */}
        {searchStatus === 'loading' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 px-1 text-xs text-stone-600 dark:text-stone-400">
              <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>लाइव &ldquo;{searchQuery}&rdquo; खोजा जा रहा है...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 animate-pulse overflow-hidden">
                  <div className="aspect-video bg-stone-200 dark:bg-stone-800" />
                  <div className="p-3 flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded-full w-3/4" />
                      <div className="h-2.5 bg-stone-200/70 dark:bg-stone-800/70 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR NOTICE */}
        {searchStatus === 'error' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>खोज परिणाम प्राप्त करने में समस्या हुई</span>
            </div>
            <p>{errorMessage || 'कृपया नेटवर्क जांचें या पुनः प्रयास करें।'}</p>
            <button
              onClick={() => handleExecuteSearch(searchQuery)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow hover:bg-rose-500 transition-colors cursor-pointer"
            >
              पुनः प्रयास करें (Retry)
            </button>
          </div>
        )}

        {/* NO RESULTS NOTICE */}
        {searchStatus === 'no_results' && (
          <div className="text-center py-10 px-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-2">
            <Search className="w-8 h-8 text-stone-400 dark:text-stone-500 mx-auto" />
            <h3 className="font-bold text-stone-900 dark:text-stone-200 text-sm">&ldquo;{searchQuery}&rdquo; के लिए कोई वीडियो नहीं मिला</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">कृपया अलग शब्द खोजें या नीचे दिए गए गानों में से चुनें</p>
            <button
              onClick={handleClearSearch}
              className="mt-2 px-4 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer"
            >
              सभी गीत देखें
            </button>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {searchStatus === 'success' && ytSearchResults.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-200">
                  खोज परिणाम: <span className="text-amber-600 dark:text-amber-400">&ldquo;{searchQuery}&rdquo;</span> ({ytSearchResults.length})
                </h3>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-bold cursor-pointer"
              >
                साफ़ करें &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ytSearchResults.map((ytSong) => {
                const songObj = convertToSongModel(ytSong);
                const isCurrent = currentSong?.youtubeId === ytSong.youtubeId;
                const isPlayingThis = isCurrent && isPlaying;
                const inQueue = queue.some(q => q.youtubeId === ytSong.youtubeId);
                const isFav = favorites.includes(songObj.id);

                return (
                  <YouTubeVideoCard
                    key={ytSong.youtubeId}
                    song={songObj}
                    isCurrent={isCurrent}
                    isPlayingThis={isPlayingThis}
                    inQueue={inQueue}
                    isFav={isFav}
                    onPlay={() => {
                      if (isCurrent) togglePlay();
                      else playSong(songObj, ytSearchResults.map(convertToSongModel));
                    }}
                    onToggleQueue={() => {
                      if (!inQueue) addToQueue(songObj);
                    }}
                    onToggleFav={() => toggleFavorite(songObj.id)}
                    isLiveApi={isLiveApi}
                  />
                );
              })}
            </div>

            {nextPageToken && (
              <div className="text-center pt-2">
                <button
                  onClick={() => handleExecuteSearch(searchQuery, nextPageToken)}
                  disabled={isLoadingMore}
                  className="px-5 py-2.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-red-500 text-stone-800 dark:text-stone-200 font-bold text-xs shadow-xs inline-flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
                      <span>लोड हो रहा है...</span>
                    </>
                  ) : (
                    <span>और वीडियो देखें (Load More)</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            INFINITE CONTINUOUS CHHATH SONGS FEED (IDLE STATE)
           ======================================================== */}
        {searchStatus === 'idle' && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displaySongs.map((song) => {
                const isCurrent = currentSong?.youtubeId === song.youtubeId || currentSong?.id === song.id;
                const isPlayingThis = isCurrent && isPlaying;
                const inQueue = queue.some(q => (q.youtubeId && q.youtubeId === song.youtubeId) || q.id === song.id);
                const isFav = favorites.includes(song.id);

                return (
                  <YouTubeVideoCard
                    key={song.id}
                    song={song}
                    isCurrent={isCurrent}
                    isPlayingThis={isPlayingThis}
                    inQueue={inQueue}
                    isFav={isFav}
                    onPlay={() => {
                      if (isCurrent) togglePlay();
                      else playSong(song, displaySongs);
                    }}
                    onToggleQueue={() => {
                      if (!inQueue) addToQueue(song);
                    }}
                    onToggleFav={() => toggleFavorite(song.id)}
                    onOpenLyrics={() => setLyricsSong(song)}
                  />
                );
              })}
            </div>

            {/* Infinite Scroll Bottom Sentinel & Live Loader Indicator */}
            <div ref={sentinelRef} className="py-6 text-center">
              {isLoadingRecommendations && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-md animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>अधिक पावन छठ गीत लोड हो रहे हैं...</span>
                </div>
              )}
            </div>
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
    </section>
  );
};
