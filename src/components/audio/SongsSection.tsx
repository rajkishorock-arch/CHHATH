import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Sparkles, 
  LayoutGrid, 
  List, 
  FileText,
  Heart,
  Mic,
  MicOff,
  X,
  CheckCircle2,
  ListMusic
} from 'lucide-react';

import { SongLyricsModal } from './SongLyricsModal';
import { SongList } from './SongList';
import { extractYoutubeId, extractPlaylistId, parseYoutubeMeta } from '../../utils/youtubeUtils';
import { getImageUrl } from '../../utils/imageUtils';
import { 
  searchYouTubeVideos, 
  convertToSongModel, 
  YouTubeSearchSong 
} from '../../services/youtubeSearchService';

// Pixel-perfect official YouTube icon
const YouTubeLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      fill="#FF0000"
    />
  </svg>
);

// Format seconds or strings into MM:SS
const formatDuration = (val?: string | number) => {
  if (!val) return '4:15';
  if (typeof val === 'string') return val;
  const m = Math.floor(val / 60);
  const s = Math.floor(val % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// YouTube-Style Video Card Component
const YouTubeVideoCard: React.FC<{
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
  isLiveApi
}) => {
  const singerInitial = (song.singer || 'छ').charAt(0);
  const ytUrl = song.youtubeId 
    ? `https://www.youtube.com/watch?v=${song.youtubeId}` 
    : (song.audioUrl && song.audioUrl.startsWith('http') ? song.audioUrl : null);

  return (
    <div 
      className={`group flex flex-col rounded-2xl bg-white dark:bg-stone-900/80 hover:bg-stone-50/80 dark:hover:bg-stone-900 transition-all duration-200 border overflow-hidden shadow-xs hover:shadow-md ${
        isCurrent 
          ? 'border-red-500 ring-2 ring-red-500/60 shadow-xl shadow-red-500/10' 
          : 'border-stone-200 dark:border-stone-800/80 hover:border-amber-500/40'
      }`}
    >
      {/* 16:9 YouTube Video Thumbnail */}
      <div 
        onClick={onPlay}
        className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
      >
        <img
          src={getImageUrl(song.thumbnail)}
          alt={song.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Duration Badge (Bottom-Right Corner like YouTube) */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[11px] font-mono font-bold text-white shadow">
          {formatDuration(song.duration)}
        </div>

        {/* YouTube Tag (Top-Left Corner) */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold shadow flex items-center gap-1 border border-stone-800/80">
          <YouTubeLogo className="w-3.5 h-3.5" />
          <span>{isLiveApi ? 'YouTube' : (song.category || 'छठ')}</span>
        </div>

        {/* Playing Animated Equalizer Bar (Bottom-Left) */}
        {isPlayingThis && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white shadow-lg">
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-white h-2 animate-bounce [animation-delay:-0.2s]" />
              <div className="w-0.5 bg-white h-3 animate-bounce" />
              <div className="w-0.5 bg-white h-1.5 animate-bounce [animation-delay:-0.4s]" />
            </div>
            <span className="text-[10px] font-bold ml-1">बज रहा है</span>
          </div>
        )}

        {/* Instant Play/Pause Button Overlay on Hover */}
        <div className={`absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isPlayingThis 
            ? 'bg-red-600 text-white scale-100 shadow-xl' 
            : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 shadow-lg'
        }`}>
          {isPlayingThis ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 ml-0.5 fill-white" />
          )}
        </div>
      </div>

      {/* Video Details Row (YouTube App Layout) */}
      <div className="p-3 flex items-start gap-2.5">
        {/* Channel / Artist Avatar Circle */}
        <div 
          onClick={onPlay}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 border border-amber-400/40 text-stone-950 font-bold text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-sm mt-0.5"
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
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs ${
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
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="गीत के बोल (Lyrics)"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleQueue}
            className={`p-1.5 rounded-lg transition-colors ${
              inQueue ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={inQueue ? 'कतार में मौजूद' : 'कतार में जोड़ें'}
          >
            {inQueue ? <Check className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleFav}
            className={`p-1.5 rounded-lg transition-colors ${
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

export interface SongsSectionProps {
  initialQuery?: string;
}

export const SongsSection: React.FC<SongsSectionProps> = ({ initialQuery }) => {
  const { songs, addSong } = useChhathData();
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

  // Active View Tab: 'all' (curated / search) | 'playlists' (mega playlists) | 'customLink' (user link)
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'playlists' | 'customLink'>('all');
  const [activeChip, setActiveChip] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [selectedSinger, setSelectedSinger] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // User Custom Link State
  const [userCustomLink, setUserCustomLink] = useState<string>('');
  const [userLinkLoading, setUserLinkLoading] = useState<boolean>(false);
  const [userLinkSuccess, setUserLinkSuccess] = useState<string | null>(null);

  // Separate regular songs vs playlists
  const regularSongs = useMemo(() => songs.filter(s => !s.isPlaylist), [songs]);
  const megaPlaylists = useMemo(() => songs.filter(s => s.isPlaylist), [songs]);

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
    setActiveChip('all');
    setSelectedCategory('सभी');
    setSelectedSinger('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveViewTab('all');
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
          setActiveViewTab('all');
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
        setActiveViewTab('all');
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

  // Filtered regular songs for local catalog with smart keyword & phonetic matching
  const filteredCatalogSongs = useMemo(() => {
    return regularSongs.filter(song => {
      if (selectedCategory === 'पसंदीदा') {
        if (!favorites.includes(song.id)) return false;
      } else if (selectedCategory !== 'सभी') {
        const catMatch = song.category === selectedCategory || song.language === selectedCategory;
        if (!catMatch) return false;
      }

      if (selectedSinger && !song.singer.includes(selectedSinger)) {
        return false;
      }

      if (searchQuery.trim() && searchStatus === 'idle') {
        const q = searchQuery.toLowerCase().trim();
        const tokens = q.split(/\s+/).filter(Boolean);
        const genericTerms = new Set(['chhath', 'chhat', 'chat', 'chhathi', 'puja', 'pooja', 'song', 'songs', 'geet', 'gane', 'gana', 'bhajan', 'bhakti', 'parv', 'mahaparv']);
        const specificTokens = tokens.filter(t => !genericTerms.has(t));

        if (specificTokens.length === 0) {
          return true;
        }

        const text = `${song.title} ${song.singer} ${song.category} ${song.language} ${song.lyricsSnippet || ''}`.toLowerCase();
        
        const aliasMap: Record<string, string[]> = {
          pawan: ['पवन', 'pawan', 'singh'],
          sharda: ['शारदा', 'sharda', 'sinha'],
          khesari: ['खेसारी', 'khesari'],
          anuradha: ['अनुराधा', 'anuradha', 'paudwal'],
          maithili: ['मैथिली', 'maithili', 'thakur'],
          kalpana: ['कल्पना', 'kalpana'],
          nirahua: ['निरहुआ', 'dinesh'],
          arghya: ['अर्घ्य', 'अरघ', 'arghya', 'aragh'],
          aragh: ['अर्घ्य', 'अरघ'],
          bahangi: ['बहंगी', 'बहंगिया'],
          kelwa: ['केलवा', 'केला'],
          thekua: ['ठेकुआ'],
          suruj: ['सुरुज', 'सूरज', 'सूर्य', 'dinanath'],
          dinanath: ['दीनानाथ', 'दिनकर']
        };

        return specificTokens.some(tok => {
          if (text.includes(tok)) return true;
          const aliases = aliasMap[tok];
          if (aliases && aliases.some(a => text.includes(a.toLowerCase()))) return true;
          return false;
        });
      }

      return true;
    });
  }, [regularSongs, selectedCategory, selectedSinger, searchQuery, favorites, searchStatus]);

  // Endless Recommendation State & Infinite Scrolling
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const recQueryIndexRef = useRef(0);
  const recNextTokenRef = useRef<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  const loadMoreRecommendations = async () => {
    if (isLoadingRecommendations) return;
    setIsLoadingRecommendations(true);
    try {
      const qIndex = recQueryIndexRef.current % CHHATH_REC_TOPICS.length;
      const query = CHHATH_REC_TOPICS[qIndex];
      const token = recNextTokenRef.current || '';
      const res = await searchYouTubeVideos(query, token);
      if (res.results && res.results.length > 0) {
        recNextTokenRef.current = res.nextPageToken || null;
        if (!res.nextPageToken) {
          recQueryIndexRef.current++;
        }
        const newSongs = res.results.map(convertToSongModel);
        setRecommendedSongs(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const existingYt = new Set(prev.map(s => s.youtubeId).filter(Boolean));
          const uniqueSongs = newSongs.filter(s => !existingIds.has(s.id) && (!s.youtubeId || !existingYt.has(s.youtubeId)));
          return [...prev, ...uniqueSongs];
        });
      } else {
        recQueryIndexRef.current++;
      }
    } catch (err) {
      console.warn('Error loading recommendations:', err);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // IntersectionObserver for auto-infinite scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (searchStatus === 'success' && nextPageToken && !isLoadingMore) {
            handleExecuteSearch(searchQuery, nextPageToken);
          } else if (searchStatus === 'idle' && activeViewTab === 'all' && !isLoadingRecommendations) {
            loadMoreRecommendations();
          }
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchStatus, nextPageToken, isLoadingMore, searchQuery, activeViewTab, isLoadingRecommendations]);

  // Combined Curated + Endless Recommended Songs (for searchStatus === 'idle')
  const allEndlessSongs = useMemo(() => {
    if (selectedSinger || (selectedCategory !== 'सभी' && selectedCategory !== 'पसंदीदा')) {
      return filteredCatalogSongs;
    }
    const seenYt = new Set(filteredCatalogSongs.map(s => s.youtubeId).filter(Boolean));
    const uniqueRecs = recommendedSongs.filter(s => !s.youtubeId || !seenYt.has(s.youtubeId));
    return [...filteredCatalogSongs, ...uniqueRecs];
  }, [filteredCatalogSongs, recommendedSongs, selectedSinger, selectedCategory]);

  // YouTube Category / Artist Pills Definition
  const chips = [
    { id: 'all', label: 'सभी', type: 'category', cat: 'सभी' },
    { id: 'sharda', label: 'शारदा सिन्हा', type: 'singer', singer: 'शारदा' },
    { id: 'pawan', label: 'पवन सिंह', type: 'singer', singer: 'पवन' },
    { id: 'khesari', label: 'खेसारी लाल', type: 'singer', singer: 'खेसारी' },
    { id: 'anuradha', label: 'अनुराधा पौडवाल', type: 'singer', singer: 'अनुराधा' },
    { id: 'maithili', label: 'मैथिली ठाकुर', type: 'singer', singer: 'मैथिली' },
    { id: 'traditional', label: 'पारंपरिक', type: 'category', cat: 'पारंपरिक' },
    { id: 'arghya', label: 'अर्घ्य गीत', type: 'category', cat: 'अर्घ्य' },
    { id: 'bhojpuri', label: 'भोजपुरी', type: 'category', cat: 'भोजपुरी' },
    { id: 'playlists', label: `प्लेलिस्ट्स (${megaPlaylists.length})`, type: 'tab', tab: 'playlists' },
    { id: 'favs', label: `पसंदीदा ❤️ (${favorites.length})`, type: 'category', cat: 'पसंदीदा' },
    { id: 'custom', label: '+ यूट्यूब लिंक', type: 'tab', tab: 'customLink' },
  ];

  const handleChipClick = (chip: typeof chips[0]) => {
    setActiveChip(chip.id);

    if (chip.type === 'tab') {
      setActiveViewTab(chip.tab as any);
      setSearchStatus('idle');
      return;
    }

    setActiveViewTab('all');

    if (chip.type === 'category') {
      setSelectedCategory(chip.cat || 'सभी');
      setSelectedSinger('');
      setSearchQuery('');
      setSearchStatus('idle');
      return;
    }

    if (chip.type === 'singer') {
      setSelectedCategory('सभी');
      setSelectedSinger(chip.singer || '');
      setSearchQuery('');
      setSearchStatus('idle');
    }
  };

  // User custom link submit
  const handlePlayUserLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = userCustomLink.trim();
    if (!url) return;

    setUserLinkLoading(true);
    const pId = extractPlaylistId(url);
    const yId = extractYoutubeId(url);

    if (!yId && !pId) {
      alert('कृपया सही यूट्यूब वीडियो या प्लेलिस्ट लिंक दर्ज करें');
      setUserLinkLoading(false);
      return;
    }

    try {
      let title = pId ? 'यूट्यूब प्लेलिस्ट' : 'छठ भक्ति गीत';
      let singer = 'यूट्यूब कलाकार';
      let thumb = yId ? `https://i.ytimg.com/vi/${yId}/hqdefault.jpg` : getImageUrl('images/daura_arghya.jpg');

      if (yId) {
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yId}&format=json`);
          if (res.ok) {
            const data = await res.json();
            const meta = parseYoutubeMeta(data.title || '', data.author_name || '', yId);
            title = meta.title;
            singer = meta.singer;
            if (data.thumbnail_url) thumb = data.thumbnail_url;
          }
        } catch {
          // Proceed with defaults
        }
      }

      const newSong: Song = {
        id: `user-track-${Date.now()}`,
        title,
        singer,
        language: 'Bhojpuri',
        category: 'Traditional',
        duration: pId ? 'प्लेलिस्ट' : '5:00',
        audioUrl: url,
        youtubeId: yId || undefined,
        playlistId: pId || undefined,
        isPlaylist: Boolean(pId),
        thumbnail: thumb
      };

      addSong(newSong);
      playSong(newSong);
      setUserCustomLink('');
      setUserLinkSuccess(`✅ "${title}" तुरंत बजना शुरू हो गया है!`);
      setTimeout(() => setUserLinkSuccess(null), 4000);
    } finally {
      setUserLinkLoading(false);
    }
  };

  return (
    <section id="songs" className="py-2 sm:py-6 px-1 sm:px-4 bg-transparent text-stone-900 dark:text-stone-100 font-mukta">
      <div className="max-w-6xl mx-auto space-y-3.5">
        
        {/* ========================================================
            YOUTUBE-STYLE CLEAN TOP BAR & SEARCH
           ======================================================== */}
        <div className="space-y-2.5">
          {/* Header Row: YouTube Red Logo + Title + Grid/List Switcher */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <YouTubeLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
              <div>
                <h2 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-1.5 leading-none">
                  <span>छठ संगीत</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-red-500 dark:text-red-300 font-extrabold uppercase tracking-wider">
                    LIVE
                  </span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 hidden sm:block">
                  यूट्यूब एवं क्यूरेटेड छठ महापर्व भक्ति गीत संग्रह
                </p>
              </div>
            </div>

            {/* View Mode Switcher: Video Grid vs Track List */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900/90 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="यूट्यूब वीडियो ग्रिड"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">वीडियो</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="म्यूजिक ट्रैक सूची"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ट्रैक सूची</span>
              </button>
            </div>
          </div>

          {/* Clean YouTube Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative flex-1 flex items-center bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/40 rounded-full transition-all shadow-xs">
              <div className="pl-3.5 pr-2 text-stone-500 dark:text-stone-400 flex items-center pointer-events-none">
                <Search className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="यूट्यूब छठ गीत या गायक खोजें... (उदा: शारदा सिन्हा, पवन सिंह)"
                className="w-full py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none pr-2"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white mr-1"
                  title="साफ़ करें"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 sm:p-2 rounded-full mr-1 transition-colors ${
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
              className="ml-2 px-4 py-2 sm:py-2.5 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95"
            >
              {searchStatus === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">खोजें</span>
            </button>
          </form>

          {voiceNotice && (
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs text-center font-bold animate-in fade-in">
              {voiceNotice}
            </div>
          )}

          {/* ========================================================
              SINGLE HORIZONTAL ROW OF YOUTUBE PILL CHIPS
             ======================================================== */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none snap-x touch-pan-x">
            {chips.map((chip) => {
              const isSelected = activeChip === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => handleChipClick(chip)}
                  className={`snap-start shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-bold border-stone-900 dark:border-stone-100 shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-stone-900 dark:hover:text-white shadow-2xs'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            TAB: CUSTOM YOUTUBE LINK FORM
           ======================================================== */}
        {activeViewTab === 'customLink' && (
          <div className="max-w-xl mx-auto p-4 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <YouTubeLogo className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  अपना यूट्यूब लिंक तुरंत बजाएं
                </h3>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  यूट्यूब वीडियो या प्लेलिस्ट लिंक पेस्ट करें और सीधे सुनें
                </p>
              </div>
            </div>

            <form onSubmit={handlePlayUserLink} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                value={userCustomLink}
                onChange={(e) => setUserCustomLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-red-500"
                disabled={userLinkLoading}
              />
              <button
                type="submit"
                disabled={userLinkLoading || !userCustomLink.trim()}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all shadow"
              >
                {userLinkLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>बजाएं</span>
              </button>
            </form>

            {userLinkSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{userLinkSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB: MEGA PLAYLISTS VIEW
           ======================================================== */}
        {activeViewTab === 'playlists' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1 text-xs font-semibold text-stone-700 dark:text-stone-400">
              <ListMusic className="w-4 h-4 text-red-500" />
              <span>नॉनस्टॉप महापर्व प्लेलिस्ट्स ({megaPlaylists.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {megaPlaylists.map((playlist) => {
                const isCurrent = currentSong?.id === playlist.id;
                const isPlayingThis = isCurrent && isPlaying;

                return (
                  <div
                    key={playlist.id}
                    onClick={() => {
                      if (isCurrent) togglePlay();
                      else playSong(playlist);
                    }}
                    className={`group rounded-2xl bg-white dark:bg-stone-900/70 border overflow-hidden cursor-pointer transition-all shadow-xs hover:shadow-md ${
                      isCurrent
                        ? 'border-red-500 ring-2 ring-red-500/60 shadow-lg'
                        : 'border-stone-200 dark:border-stone-800 hover:border-amber-500/40 hover:bg-stone-50 dark:hover:bg-stone-900'
                    }`}
                  >
                    {/* Thumbnail with YouTube Playlist Overlay */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img
                        src={getImageUrl(playlist.thumbnail)}
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
                        }}
                      />

                      {/* Playlist Banner on Right side */}
                      <div className="absolute inset-y-0 right-0 w-24 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white border-l border-white/10">
                        <ListMusic className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="text-[11px] font-mono font-bold">प्लेलिस्ट</span>
                        <span className="text-[10px] text-stone-400">{playlist.duration}</span>
                      </div>

                      {/* Play Overlay */}
                      <div className={`absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isPlayingThis
                          ? 'bg-red-600 text-white scale-100 shadow-xl'
                          : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 shadow-lg'
                      }`}>
                        {isPlayingThis ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 ml-0.5 fill-white" />}
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate mt-0.5">
                        {playlist.singer}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800/60">
                        <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400/90 font-bold">
                          {playlist.duration}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) togglePlay();
                            else playSong(playlist);
                          }}
                          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                        >
                          {isPlayingThis ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                          <span>{isPlayingThis ? 'रोकें' : 'चलाएं'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: ALL SONGS & REAL YOUTUBE SEARCH VIEW
           ======================================================== */}
        {activeViewTab === 'all' && (
          <div className="space-y-3">

            {/* SKELETON LOADERS WHILE SEARCHING */}
            {searchStatus === 'loading' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1 text-xs text-stone-600 dark:text-stone-400">
                  <RefreshCw className="w-3.5 h-3.5 text-red-500 animate-spin" />
                  <span>यूट्यूब पर &ldquo;{searchQuery}&rdquo; खोजा जा रहा है...</span>
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
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow hover:bg-rose-500 transition-colors"
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
                  className="mt-2 px-4 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold"
                >
                  सभी गीत देखें
                </button>
              </div>
            )}

            {/* ========================================================
                YOUTUBE SEARCH RESULTS VIEW
               ======================================================== */}
            {searchStatus === 'success' && ytSearchResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <YouTubeLogo className="w-4 h-4" />
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-200">
                      यूट्यूब परिणाम: <span className="text-amber-600 dark:text-amber-400">&ldquo;{searchQuery}&rdquo;</span> ({ytSearchResults.length})
                    </h3>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-bold"
                  >
                    साफ़ करें &times;
                  </button>
                </div>

                {/* Grid Mode */}
                {viewMode === 'grid' && (
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
                )}

                {/* List Mode */}
                {viewMode === 'list' && (
                  <div className="space-y-1.5">
                    {ytSearchResults.map((ytSong, idx) => {
                      const songObj = convertToSongModel(ytSong);
                      const isCurrent = currentSong?.youtubeId === ytSong.youtubeId;
                      const isPlayingThis = isCurrent && isPlaying;
                      const inQueue = queue.some(q => q.youtubeId === ytSong.youtubeId);
                      const isFav = favorites.includes(songObj.id);

                      return (
                        <div
                          key={ytSong.youtubeId}
                          onClick={() => {
                            if (isCurrent) togglePlay();
                            else playSong(songObj, ytSearchResults.map(convertToSongModel));
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-red-50 dark:bg-red-950/40 border border-red-500/50 shadow-xs'
                              : 'bg-white dark:bg-stone-900/60 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-850 hover:border-stone-300 dark:hover:border-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 w-5 text-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black">
                              <img
                                src={ytSong.thumbnailUrl}
                                alt={ytSong.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                {isPlayingThis ? (
                                  <Pause className="w-4 h-4 text-white fill-white" />
                                ) : (
                                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-stone-900 dark:text-stone-100'}`}>
                                {ytSong.title}
                              </h4>
                              <p className="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">
                                {ytSong.channelTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                if (!inQueue) addToQueue(songObj);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                inQueue ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                              }`}
                              title={inQueue ? 'कतार में' : 'कतार में जोड़ें'}
                            >
                              {inQueue ? <Check className="w-3.5 h-3.5 text-amber-500" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => toggleFavorite(songObj.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isFav ? 'text-rose-500' : 'text-stone-500 dark:text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                              }`}
                              title={isFav ? 'पसंदीदा' : 'पसंदीदा में जोड़ें'}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                            </button>

                            <a
                              href={`https://www.youtube.com/watch?v=${ytSong.youtubeId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                              title="YouTube पर देखें"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Load More Button */}
                {nextPageToken && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => handleExecuteSearch(searchQuery, nextPageToken)}
                      disabled={isLoadingMore}
                      className="px-5 py-2.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-red-500 text-stone-800 dark:text-stone-200 font-bold text-xs shadow-xs inline-flex items-center gap-2 disabled:opacity-50 transition-all"
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
                CURATED LOCAL CATALOG FEED (IDLE SEARCH STATE)
               ======================================================== */}
            {searchStatus === 'idle' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 text-xs text-stone-600 dark:text-stone-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>
                      {selectedSinger ? `${selectedSinger} के गीत (${filteredCatalogSongs.length})` :
                       selectedCategory !== 'सभी' ? `${selectedCategory} गीत (${filteredCatalogSongs.length})` :
                       `छठ भक्ति गीत संग्रह (${filteredCatalogSongs.length})`}
                    </span>
                  </div>

                  {/* Quick YouTube Search Prompt if artist selected */}
                  {selectedSinger && (
                    <button
                      onClick={() => {
                        setSearchQuery(`${selectedSinger} Chhath Geet`);
                        handleExecuteSearch(`${selectedSinger} Chhath Geet`);
                      }}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <YouTubeLogo className="w-3.5 h-3.5" />
                      <span>यूट्यूब पर खोजें</span>
                    </button>
                  )}
                </div>

                {/* Grid Mode: 16:9 YouTube Video Cards */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {allEndlessSongs.map((song) => {
                      const isCurrent = currentSong?.id === song.id;
                      const isPlayingThis = isCurrent && isPlaying;
                      const inQueue = queue.some(q => q.id === song.id);
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
                            else playSong(song, allEndlessSongs);
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
                )}

                {/* List Mode: Clean YouTube Music Tracklist */}
                {viewMode === 'list' && (
                  <SongList songs={allEndlessSongs} />
                )}

                {/* Infinite Scroll Bottom Sentinel & Live Loader Indicator */}
                <div ref={sentinelRef} className="py-6 text-center">
                  {(isLoadingRecommendations || isLoadingMore) && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-md animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
                      <span>अधिक पावन छठ गीत लोड हो रहे हैं...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
