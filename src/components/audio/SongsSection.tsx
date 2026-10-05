import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Music,
  Video
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

// YouTube-Style Video Card Component (Landscape 16:9 for songs & videos)
const YouTubeVideoCardComponent: React.FC<{
  song: Song;
  isCurrent: boolean;
  isPlayingThis: boolean;
  isInlinePlaying?: boolean;
  inQueue?: boolean;
  isFav?: boolean;
  onPlay: () => void;
  onPlayVideo?: () => void;
  onThumbnailClick?: () => void;
  onToggleQueue?: () => void;
  onToggleFav?: () => void;
  onOpenLyrics?: () => void;
  isLiveApi?: boolean;
}> = ({
  song,
  isCurrent,
  isPlayingThis,
  isInlinePlaying,
  inQueue,
  isFav,
  onPlay,
  onPlayVideo,
  onThumbnailClick,
  onToggleQueue,
  onToggleFav,
  onOpenLyrics,
}) => {
  const [thumbSrc, setThumbSrc] = useState<string>(() => {
    return song.thumbnail || (song.youtubeId ? `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg` : '');
  });
  const [isThumbHovered, setIsThumbHovered] = useState<boolean>(false);

  useEffect(() => {
    const nextThumb = song.thumbnail || (song.youtubeId ? `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg` : '');
    setThumbSrc(nextThumb);
  }, [song.thumbnail, song.youtubeId]);

  const singerInitial = song.singer ? song.singer.trim().charAt(0) : 'छ';

  return (
    <div
      className={`group rounded-2xl bg-white dark:bg-stone-900 border overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md select-none flex flex-col justify-between ${
        isCurrent
          ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md'
          : 'border-stone-200 dark:border-stone-800 hover:border-amber-500/40 hover:bg-stone-50 dark:hover:bg-stone-850'
      }`}
    >
      <div>
        {/* 16:9 YouTube Thumbnail Container with Inline Video Support & Hover-Responsive Controls */}
        <div 
          onClick={() => {
            if (!isInlinePlaying && onThumbnailClick) {
              onThumbnailClick();
            }
          }}
          onMouseEnter={() => setIsThumbHovered(true)}
          onMouseLeave={() => setIsThumbHovered(false)}
          className="relative aspect-video w-full bg-stone-950 overflow-hidden select-none cursor-pointer group/thumb"
        >
          {isInlinePlaying && song.youtubeId ? (
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&controls=1&autohide=1&modestbranding=1&iv_load_policy=3`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 transition-opacity duration-200 pointer-events-auto"
              />
              {/* On desktop mouse hover, transparent overlay catches when cursor leaves to hide controls */}
              {!isThumbHovered && (
                <div 
                  className="hidden sm:block absolute inset-0 bg-transparent cursor-pointer pointer-events-auto"
                  onMouseEnter={() => setIsThumbHovered(true)}
                />
              )}
            </div>
          ) : (
            <>
              <img
                src={thumbSrc}
                alt={song.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => {
                  if (thumbSrc.includes('i.ytimg.com') && song.youtubeId) {
                    setThumbSrc(`https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`);
                  } else if (thumbSrc.includes('hqdefault.jpg') && song.youtubeId) {
                    setThumbSrc(`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`);
                  } else {
                    setThumbSrc('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80');
                  }
                }}
              />

              {/* Hover / Play Overlay on Thumbnail */}
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

              {/* Video Duration Badge */}
              {song.duration && (
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider">
                  {formatDuration(song.duration)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Video Details Row (YouTube App Layout) */}
        <div className="p-3 flex items-start gap-2.5">
          {/* Channel / Artist Avatar Circle */}
          <div 
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-400/40 text-stone-950 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5"
          >
            {singerInitial}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1">
            <h4 
              className={`font-semibold text-xs sm:text-sm line-clamp-2 leading-snug transition-colors ${
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
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              <span className="truncate">{song.category || 'भक्ति'}</span>
              <span>•</span>
              <span className="truncate">{song.language || 'भोजपुरी'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer: Dedicated Video vs Audio buttons + Quick controls */}
      <div className="px-3 pb-3 pt-0 flex items-center justify-between gap-1.5 border-t border-stone-100 dark:border-stone-800/80 mt-1">
        <div className="flex items-center gap-1.5 pt-2">
          {onPlayVideo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayVideo();
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600/15 hover:bg-red-600/25 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="थिएटर मोड में वीडियो देखें"
            >
              <Video className="w-3.5 h-3.5" />
              <span>वीडियो</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="ऑडियो सुनें"
          >
            {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            <span>{isPlayingThis ? 'रोकें' : 'ऑडियो'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 pt-2">
          {onOpenLyrics && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLyrics();
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="बोल (Lyrics)"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          )}
          {onToggleFav && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFav ? 'text-red-500' : 'text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isFav ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          )}
          {onToggleQueue && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleQueue();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                inQueue ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={inQueue ? "कतार में जोड़ा गया" : "कतार में जोड़ें"}
            >
              {inQueue ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
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
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    playVideo,
    pauseSong,
    setShowVideo,
    togglePlay, 
    favorites, 
    toggleFavorite,
    lyricsSong, 
    setLyricsSong,
    queue, 
    addToQueue 
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inlineVideoSongId, setInlineVideoSongId] = useState<string | null>(null);

  // YouTube API Real Search States: 'idle' | 'loading' | 'success' | 'no_results' | 'error'
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'success' | 'no_results' | 'error'>('idle');
  const [ytSearchResults, setYtSearchResults] = useState<YouTubeSearchSong[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Endless search pagination refs
  const searchFacetIndexRef = useRef<number>(0);
  const currentSearchTermRef = useRef<string>('');

  // Voice Search States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Real-time Live YouTube Songs Stream State
  const [liveSongs, setLiveSongs] = useState<Song[]>([]);
  const [isLiveInitialLoading, setIsLiveInitialLoading] = useState<boolean>(true);
  const [liveNextPageToken, setLiveNextPageToken] = useState<string | null>(null);
  const [isLoadingMoreLive, setIsLoadingMoreLive] = useState<boolean>(false);
  const liveTopicIndexRef = useRef<number>(0);
  const seenYoutubeIdsRef = useRef<Set<string>>(new Set());
  const seenSignaturesRef = useRef<Set<string>>(new Set());
  const searchSeenIdsRef = useRef<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Helper to randomly shuffle an array (Fisher-Yates)
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const CHHATH_LIVE_TOPICS = useMemo(() => [
    'शारदा सिन्हा लोकप्रिय छठ गीत संग्रह',
    'पवन सिंह नए छठ गीत 2026 स्पेशल',
    'अनुराधा पौडवाल संपूर्ण छठ भजन',
    'खेसारी लाल यादव छठ पूजा नए 2026',
    'मैथिली ठाकुर छठ महापर्व भक्ति लाइव',
    'मनोज तिवारी छठ महापर्व पारम्परिक गीत',
    'कांच ही बांस के बहंगिया छठ स्पेशल',
    'केलवा के पात पर उगेलन सुरुज देव',
    'कल्पना पटवारी छठ पूजा पारम्परिक',
    'छठ संध्या अर्घ्य लाइव आरती भजन',
    'उषा अर्घ्य दर्शन भक्ति गीत भोरवा',
    'अक्षरा सिंह छठ पूजा स्पेशल नए',
    'सोनू निगम छठ मईया भजन सुपरहिट',
    'रितेश पांडे नए छठ गीत 2026',
    'प्रिया मल्लिक छठ गीत पारम्परिक',
    'शिल्पी राज नए छठ गीत 2026',
    'नीलकमल सिंह छठ पूजा स्पेशल',
    'पटना गंगा घाट छठ पूजा लाइव दर्शन',
    'दउरा उठावे के पारम्परिक छठ गीत',
    'कोसी भराई छठ पूजा स्पेशल गीत',
    'नहाय खाय स्पेशल पारंपरिक छठ गीत',
    'खरना स्पेशल छठ पूजा प्रसाद गीत',
    'प्रमोद प्रेमी यादव छठ महापर्व',
    'अरविंद अकेला कल्लू छठ महापर्व',
    'अंकुश राजा छठ गीत सुपरहिट',
    'देवी छठ महापर्व पारंपरिक गीत',
    'सुनील छैला बिहारी छठ स्पेशल',
    'छठ पूजा नॉनस्टॉप जूकबॉक्स 2026',
    'छठ मईया के पारंपरिक पचरा वंदना',
    'उग हे सुरुज देव अस्ताचल अर्घ्य',
    'जोड़िले जोड़िया फलवा सुरुज देव',
    'केरवा जे फरेला घवद से छठ सुपरहिट'
  ], []);

  // Canonical signature normalizer: Strips channel/promotional noise and hashtags to deduplicate re-uploaded songs
  const getCanonicalSongSignature = (title: string): string => {
    if (!title) return '';
    const clean = title.toLowerCase()
      .replace(/#\S+/g, ' ')
      .replace(/\(.*?\)|\[.*?\]/g, ' ')
      .replace(/official\s+video|audio\s+song|video\s+song|full\s+song|full\s+video|lyrical\s+video|special|superhit|hit\s+geet|bhojpuri|chhath\s+puja|chhath\s+geet|छठ\s+गीत|छठ\s+पूजा/gi, ' ')
      .replace(/[^a-z0-9\u0900-\u097F]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const devanagari = clean.replace(/[^\u0900-\u097F]/g, '');
    if (devanagari.length >= 5) {
      return `dev_${devanagari.slice(0, 12)}`;
    }

    const roman = clean.replace(/[^a-z0-9]/g, '');
    if (roman.length >= 5) {
      return `rom_${roman.slice(0, 14)}`;
    }

    return clean.slice(0, 15);
  };

  // Identify singer bucket to prevent single-artist domination
  const detectSingerBucket = (song: Song): string => {
    const text = `${song.title} ${song.singer || ''}`.toLowerCase();
    if (text.includes('sharda') || text.includes('शारदा')) return 'sharda';
    if (text.includes('pawan') || text.includes('पवन')) return 'pawan';
    if (text.includes('khesari') || text.includes('खेसारी')) return 'khesari';
    if (text.includes('anuradha') || text.includes('अनुराधा') || text.includes('paudwal')) return 'anuradha';
    if (text.includes('maithili') || text.includes('मैथिली')) return 'maithili';
    if (text.includes('manoj') || text.includes('मनोज') || text.includes('tiwari')) return 'manoj';
    if (text.includes('ritesh') || text.includes('रितेश')) return 'ritesh';
    if (text.includes('kalpana') || text.includes('कल्पना')) return 'kalpana';
    if (text.includes('akshara') || text.includes('अक्षरा')) return 'akshara';
    if (text.includes('shilpi') || text.includes('शिल्पी')) return 'shilpi';
    if (text.includes('pramod') || text.includes('प्रमोद')) return 'pramod';
    if (text.includes('sonu') || text.includes('सोनू')) return 'sonu';
    if (text.includes('priya') || text.includes('प्रिया')) return 'priya';
    return 'devotional_folk';
  };

  // Dynamic Diversity Interleaving Engine: guarantees variety and fresh combination every single time!
  const interleaveSingers = useCallback((songs: Song[]): Song[] => {
    const buckets: Record<string, Song[]> = {};

    for (const s of songs) {
      const bucketKey = detectSingerBucket(s);
      if (!buckets[bucketKey]) buckets[bucketKey] = [];
      buckets[bucketKey].push(s);
    }

    // Shuffle songs inside each bucket so positions are completely dynamic
    for (const k in buckets) {
      buckets[k] = shuffleArray(buckets[k]);
    }

    // Dynamically randomize the artist rotation order so no single artist is fixed in position #1
    const allArtists = ['sharda', 'pawan', 'maithili', 'khesari', 'anuradha', 'manoj', 'ritesh', 'kalpana', 'akshara', 'shilpi', 'pramod', 'priya', 'devotional_folk'];
    const activeArtists = shuffleArray(allArtists.filter(k => buckets[k]?.length > 0));

    const result: Song[] = [];
    let addedAny = true;

    while (addedAny) {
      addedAny = false;
      for (const key of activeArtists) {
        if (buckets[key] && buckets[key].length > 0) {
          result.push(buckets[key].shift()!);
          addedAny = true;
        }
      }
    }

    for (const key in buckets) {
      while (buckets[key] && buckets[key].length > 0) {
        result.push(buckets[key].shift()!);
      }
    }

    return result;
  }, []);

  // Filter helper: STRICTLY exclude shorts / reels from the songs section
  const filterValidLandscapeSongs = (rawSongs: YouTubeSearchSong[]): Song[] => {
    return rawSongs
      .filter(r => {
        if (!r.youtubeId || r.youtubeId.length < 5) return false;
        if (!r.thumbnailUrl || r.thumbnailUrl.includes('undefined')) return false;
        const t = r.title.toLowerCase();
        // Strict exclusion of shorts and reels
        if (t.includes('#short') || t.includes('#reel')) return false;
        if (r.duration && (r.duration === '0:30' || r.duration === '0:45' || r.duration.startsWith('0:'))) return false;
        return true;
      })
      .map(convertToSongModel);
  };

  // Deduplicate against both YouTube video ID and canonical song title signature
  const deduplicateSongs = useCallback((songs: Song[]): Song[] => {
    const unique: Song[] = [];
    for (const s of songs) {
      if (!s.youtubeId) continue;
      if (seenYoutubeIdsRef.current.has(s.youtubeId)) continue;

      const sig = getCanonicalSongSignature(s.title);
      if (sig && seenSignaturesRef.current.has(sig)) continue;

      seenYoutubeIdsRef.current.add(s.youtubeId);
      if (sig) seenSignaturesRef.current.add(sig);
      unique.push(s);
    }
    return unique;
  }, []);

  // Load real-time live songs on mount with multiple singers, trending, and all-time hits
  const fetchInitialLiveSongs = useCallback(async () => {
    setIsLiveInitialLoading(true);
    seenYoutubeIdsRef.current.clear();
    seenSignaturesRef.current.clear();
    try {
      // 3 High-diversity query pools to ensure new, fresh song combination on every page refresh!
      const LEGEND_QUERIES = [
        'छठ पूजा के अमर सुपरहिट गीत शारदा सिन्हा अनुराधा पौडवाल',
        'केलवा के पात पर उगेलन सुरुज देव शारदा सिन्हा',
        'कांच ही बांस के बहंगिया पारम्परिक छठ गीत शारदा सिन्हा',
        'हे छठी मईया सुन लीं पुकार अनुराधा पौडवाल',
        'उ जे केरवा जे फरेला घवद से छठ गीत सुपरहिट',
        'शारदा सिन्हा छठ महापर्व आरधना गीत',
        'मनोज तिवारी पारम्परिक छठ पूजा गीत',
        'सोनू निगम सूर्य देव छठ भजन',
        'देवी छठ महापर्व पारंपरिक गीत'
      ];

      const TRENDING_QUERIES = [
        'नए छठ गीत 2026 पवन सिंह खेसारी लाल मैथिली ठाकुर',
        'पवन सिंह छठ पूजा स्पेशल नए 2026 गीत सुपरहिट',
        'खेसारी लाल यादव छठ गीत 2026 भक्ति',
        'मैथिली ठाकुर छठ महापर्व भक्ति गीत लाइव',
        'अक्षरा सिंह छठ पूजा स्पेशल नए गीत 2026',
        'रितेश पांडे नए छठ गीत 2026',
        'शिल्पी राज नए छठ गीत सुपरहिट',
        'नीलकमल सिंह छठ पूजा स्पेशल 2026',
        'प्रमोद प्रेमी यादव छठ महापर्व'
      ];

      const DEVOTIONAL_QUERIES = [
        'कांच ही बांस के बहंगिया केलवा के पात छठ पूजा सुपरहिट',
        'पटना गंगा घाट छठ पूजा लाइव आरती दर्शन',
        'छठ पूजा संध्या अर्घ्य लाइव आरती भजन',
        'उषा अर्घ्य भोरवा के अर्घ्य छठ गीत',
        'दउरा उठावे के पारम्परिक छठ गीत',
        'कोसी भराई छठ पूजा स्पेशल गीत',
        'नहाय खाय स्पेशल पारंपरिक छठ गीत',
        'खरना स्पेशल छठ पूजा प्रसाद गीत',
        'छठ पूजा नॉनस्टॉप जूकबॉक्स 2026',
        'छठ संध्या अर्घ्य उषा अर्घ्य स्पेशल भक्ति गीत'
      ];

      const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const query1 = pickRandom(LEGEND_QUERIES);
      const query2 = pickRandom(TRENDING_QUERIES);
      const query3 = pickRandom(DEVOTIONAL_QUERIES);

      // Randomize the initial topic index for smooth diverse continuation scrolling
      liveTopicIndexRef.current = Math.floor(Math.random() * CHHATH_LIVE_TOPICS.length);

      // Fetch with bypassCache = true to guarantee 100% fresh, live real-world YouTube songs
      const [res1, res2, res3] = await Promise.allSettled([
        searchYouTubeVideos(query1, '', 'video', true),
        searchYouTubeVideos(query2, '', 'video', true),
        searchYouTubeVideos(query3, '', 'video', true)
      ]);

      const rawPool: YouTubeSearchSong[] = [];
      let tokenToKeep: string | null = null;

      if (res1.status === 'fulfilled' && res1.value.results) {
        rawPool.push(...res1.value.results);
      }
      if (res2.status === 'fulfilled' && res2.value.results) {
        rawPool.push(...res2.value.results);
        tokenToKeep = res2.value.nextPageToken || null;
      }
      if (res3.status === 'fulfilled' && res3.value.results) {
        rawPool.push(...res3.value.results);
        if (!tokenToKeep) tokenToKeep = res3.value.nextPageToken || null;
      }

      setLiveNextPageToken(tokenToKeep);

      // Filter valid landscape songs and deduplicate re-uploaded copies
      const filtered = filterValidLandscapeSongs(rawPool);
      const unique = deduplicateSongs(filtered);

      // Multi-singer round-robin dynamic interleaving
      const diversified = interleaveSingers(unique);

      if (diversified.length > 0) {
        setLiveSongs(diversified);
      }
    } catch (err) {
      console.warn('Initial multi-singer live songs fetch failed:', err);
    } finally {
      setIsLiveInitialLoading(false);
    }
  }, [deduplicateSongs, interleaveSingers, CHHATH_LIVE_TOPICS]);

  useEffect(() => {
    fetchInitialLiveSongs();
  }, [fetchInitialLiveSongs]);

  // Load more real-time live songs when user scrolls down
  const loadMoreLiveSongs = useCallback(async () => {
    if (isLoadingMoreLive || isLiveInitialLoading) return;
    setIsLoadingMoreLive(true);

    try {
      let results: Song[] = [];
      let newNextToken: string | null = null;

      // 1. Try continuation token on current topic
      if (liveNextPageToken) {
        const topic = CHHATH_LIVE_TOPICS[liveTopicIndexRef.current % CHHATH_LIVE_TOPICS.length];
        const res = await searchYouTubeVideos(topic, liveNextPageToken, 'video');
        if (res.results && res.results.length > 0) {
          newNextToken = res.nextPageToken || null;
          results = filterValidLandscapeSongs(res.results);
        }
      }

      // 2. If token yielded no new items or token exhausted, rotate to the next diverse live topic
      if (results.length === 0) {
        const nextTopicIndex = (liveTopicIndexRef.current + 1) % CHHATH_LIVE_TOPICS.length;
        liveTopicIndexRef.current = nextTopicIndex;
        const topic = CHHATH_LIVE_TOPICS[nextTopicIndex];
        const res = await searchYouTubeVideos(topic, '', 'video');
        if (res.results && res.results.length > 0) {
          newNextToken = res.nextPageToken || null;
          results = filterValidLandscapeSongs(res.results);
        }
      }

      setLiveNextPageToken(newNextToken);

      // Append strictly unique songs interleaved by singer so newly loaded songs also stay diverse
      const uniqueNew = deduplicateSongs(results);
      if (uniqueNew.length > 0) {
        const diversifiedNew = interleaveSingers(uniqueNew);
        setLiveSongs(prev => [...prev, ...diversifiedNew]);
      }
    } catch (err) {
      console.warn('Load more live songs failed:', err);
    } finally {
      setIsLoadingMoreLive(false);
    }
  }, [isLoadingMoreLive, isLiveInitialLoading, liveNextPageToken, CHHATH_LIVE_TOPICS, deduplicateSongs, interleaveSingers]);

  // Execute YouTube API Search
  const handleExecuteSearch = async (query: string, token: string = '', isContinuation: boolean = false) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (!token && !isContinuation) {
      currentSearchTermRef.current = trimmed;
      searchFacetIndexRef.current = 0;
      searchSeenIdsRef.current.clear();
      setSearchStatus('loading');
      setYtSearchResults([]);
      setNextPageToken(null);
      setErrorMessage(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await searchYouTubeVideos(trimmed, token, 'video');
      setIsLiveApi(response.isLiveApi);

      if (response.results && response.results.length > 0) {
        // Filter out shorts/reels and deduplicate across entire search session
        const cleanResults: YouTubeSearchSong[] = [];

        for (const r of response.results) {
          if (!r.youtubeId || r.youtubeId.length < 5) continue;
          const t = r.title.toLowerCase();
          if (t.includes('#short') || t.includes('#reel')) continue;
          if (searchSeenIdsRef.current.has(r.youtubeId)) continue;

          searchSeenIdsRef.current.add(r.youtubeId);
          cleanResults.push(r);
        }

        setYtSearchResults(prev => (token || isContinuation) ? [...prev, ...cleanResults] : cleanResults);
        setNextPageToken(response.nextPageToken);
        setSearchStatus('success');
      } else {
        if (!token && !isContinuation) {
          setYtSearchResults([]);
          setSearchStatus('no_results');
          setErrorMessage(response.error || 'कोई गाना या वीडियो नहीं मिला।');
        }
      }
    } catch (err: any) {
      console.error('Search error:', err);
      if (!token && !isContinuation) {
        setSearchStatus('error');
        setErrorMessage(err.message || 'नेटवर्क या API त्रुटि हुई।');
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Continuous infinite scroll: never stops even if single-query page tokens run out!
  const loadMoreSearchResults = useCallback(async () => {
    if (isLoadingMore || searchStatus !== 'success') return;
    const baseQuery = currentSearchTermRef.current || searchQuery.trim();
    if (!baseQuery) return;

    // 1. If we have a nextPageToken from the current query, fetch next page
    if (nextPageToken) {
      await handleExecuteSearch(baseQuery, nextPageToken);
      return;
    }

    // 2. If token exhausted or null, branch to related search facets so scrolling NEVER stops!
    searchFacetIndexRef.current += 1;
    const isSongIntent = /song|geet|gana|गाना|गीत|भजन|bhajan|music|audio/i.test(baseQuery);
    const facets = isSongIntent
      ? [
          `${baseQuery} songs`,
          `${baseQuery} full video`,
          `${baseQuery} superhit`,
          `${baseQuery} live`,
          `${baseQuery} hits`,
          `${baseQuery} jukebox`,
          `${baseQuery} remix`
        ]
      : [
          `${baseQuery} video`,
          `${baseQuery} latest`,
          `${baseQuery} full video`,
          `${baseQuery} trending`,
          `${baseQuery} official`,
          `${baseQuery} 2026`
        ];
    const nextFacetQuery = facets[searchFacetIndexRef.current % facets.length];
    await handleExecuteSearch(nextFacetQuery, '', true);
  }, [isLoadingMore, searchStatus, nextPageToken, searchQuery]);

  const handleClearSearch = () => {
    searchSeenIdsRef.current.clear();
    currentSearchTermRef.current = '';
    searchFacetIndexRef.current = 0;
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
          if (searchStatus === 'success' && !isLoadingMore) {
            loadMoreSearchResults();
          } else if (searchStatus === 'idle' && !isLoadingMoreLive && !isLiveInitialLoading) {
            loadMoreLiveSongs();
          }
        }
      },
      { rootMargin: '600px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchStatus, isLoadingMore, loadMoreSearchResults, isLoadingMoreLive, isLiveInitialLoading, loadMoreLiveSongs]);

  // Handle in-app pull to refresh without destructive full page reload
  useEffect(() => {
    const handlePullRefresh = () => {
      if (searchStatus === 'idle') {
        fetchInitialLiveSongs();
      } else if (searchQuery.trim()) {
        handleExecuteSearch(searchQuery.trim());
      }
    };
    window.addEventListener('chhath-app-pull-refresh', handlePullRefresh);
    return () => window.removeEventListener('chhath-app-pull-refresh', handlePullRefresh);
  }, [searchStatus, searchQuery, fetchInitialLiveSongs, handleExecuteSearch]);

  return (
    <section id="songs" className="py-2 sm:py-6 px-1 sm:px-4 bg-transparent text-stone-900 dark:text-stone-100 font-mukta">
      <div className="max-w-6xl mx-auto space-y-3.5">
        
        {/* ========================================================
            YOUTUBE-STYLE CLEAN TOP SEARCH BAR (RIGHT AT VERY TOP!)
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
              placeholder="YouTube पर कोई भी गाना, गायक या वीडियो खोजें..."
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
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center py-2">
              <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ytSearchResults.map((ytSong) => {
                const songObj = convertToSongModel(ytSong);
                const isCurrent = currentSong?.youtubeId === ytSong.youtubeId;
                const isPlayingThis = isCurrent && isPlaying;
                const inQueue = queue.some(q => q.youtubeId === ytSong.youtubeId);
                const isFav = favorites.includes(songObj.id);
                const isInlinePlaying = inlineVideoSongId === ytSong.youtubeId;

                return (
                  <YouTubeVideoCard
                    key={ytSong.youtubeId}
                    song={songObj}
                    isCurrent={isCurrent}
                    isPlayingThis={isPlayingThis}
                    isInlinePlaying={isInlinePlaying}
                    inQueue={inQueue}
                    isFav={isFav}
                    onThumbnailClick={() => {
                      setInlineVideoSongId(ytSong.youtubeId);
                      setShowVideo(false);
                      pauseSong();
                    }}
                    onPlay={() => {
                      setInlineVideoSongId(null);
                      setShowVideo(false);
                      if (isCurrent && !isInlinePlaying) togglePlay();
                      else playSong(songObj, ytSearchResults.map(convertToSongModel));
                    }}
                    onPlayVideo={() => {
                      setInlineVideoSongId(null);
                      playVideo(songObj, ytSearchResults.map(convertToSongModel));
                    }}
                    onToggleQueue={() => {
                      if (!inQueue) addToQueue(songObj);
                    }}
                    onToggleFav={() => toggleFavorite(songObj.id)}
                    onOpenLyrics={() => setLyricsSong(songObj)}
                    isLiveApi={isLiveApi}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            REAL-TIME LIVE YOUTUBE CHHATH SONGS FEED (IDLE STATE)
           ======================================================== */}
        {searchStatus === 'idle' && (
          <div className="space-y-4 pt-1">
            {/* Initial Loading Skeletons */}
            {isLiveInitialLoading && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-center py-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
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

            {/* Live Real-Time YouTube Songs Grid */}
            {!isLiveInitialLoading && liveSongs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {liveSongs.map((song) => {
                  const cardKey = song.youtubeId || song.id;
                  const isCurrent = currentSong?.youtubeId === song.youtubeId || currentSong?.id === song.id;
                  const isPlayingThis = isCurrent && isPlaying;
                  const inQueue = queue.some(q => (q.youtubeId && q.youtubeId === song.youtubeId) || q.id === song.id);
                  const isFav = favorites.includes(song.id);
                  const isInlinePlaying = inlineVideoSongId === song.youtubeId;

                  return (
                    <YouTubeVideoCard
                      key={cardKey}
                      song={song}
                      isCurrent={isCurrent}
                      isPlayingThis={isPlayingThis}
                      isInlinePlaying={isInlinePlaying}
                      inQueue={inQueue}
                      isFav={isFav}
                      onThumbnailClick={() => {
                        if (song.youtubeId) {
                          setInlineVideoSongId(song.youtubeId);
                          setShowVideo(false);
                          pauseSong();
                        }
                      }}
                      onPlay={() => {
                        setInlineVideoSongId(null);
                        setShowVideo(false);
                        if (isCurrent && !isInlinePlaying) togglePlay();
                        else playSong(song, liveSongs);
                      }}
                      onPlayVideo={() => {
                        setInlineVideoSongId(null);
                        playVideo(song, liveSongs);
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

            {/* Offline fallback if initial load failed */}
            {!isLiveInitialLoading && liveSongs.length === 0 && (
              <div className="text-center py-12 px-4 rounded-3xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-3">
                <Music className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">लाइव छठ गीत लोड करने का प्रयास करें</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।</p>
                <button
                  onClick={fetchInitialLiveSongs}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  पुनः लोड करें (Reload Live Songs)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Unified Automatic Infinite Scroll Bottom Sentinel & Loader */}
        <div ref={sentinelRef} className="py-6 pb-28 sm:pb-36 flex items-center justify-center">
          {(isLoadingMore || (searchStatus === 'idle' && isLoadingMoreLive)) && (
            <div className="p-3 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
            </div>
          )}
        </div>

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
