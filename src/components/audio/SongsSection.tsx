import React, { useState, useMemo, useEffect, useRef, useCallback, useId } from 'react';
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
  Video,
  Headphones,
  Share2,
  ListMusic,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowUpLeft
} from 'lucide-react';
import { 
  searchYouTubeVideos, 
  convertToSongModel, 
  YouTubeSearchSong 
} from '../../services/youtubeSearchService';
import { YouTubeSuggestService } from '../../services/youtubeSuggestService';

// Format seconds or strings into MM:SS
const formatDuration = (val?: string | number) => {
  if (!val) return '4:15';
  if (typeof val === 'string') return val;
  const m = Math.floor(val / 60);
  const s = Math.floor(val % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// YouTube-Style Video Card Component (Landscape 16:9 for songs & videos - Single Unified Media Flow)
const YouTubeVideoCardComponent: React.FC<{
  song: Song;
  isCurrent: boolean;
  isPlayingThis: boolean;
  inQueue?: boolean;
  isFav?: boolean;
  onPlay: () => void;
  onPlayVideo: () => void;
  onToggleQueue?: () => void;
  onToggleFav?: () => void;
  onShareSong?: () => void;
  isLiveApi?: boolean;
}> = ({
  song,
  isCurrent,
  isPlayingThis,
  inQueue,
  isFav,
  onPlay,
  onPlayVideo,
  onToggleQueue,
  onToggleFav,
  onShareSong,
}) => {
  const { activeInlineVideoId, setActiveInlineVideoId, syncInlineVideoSong, pauseSong } = useAudio();
  const [thumbSrc, setThumbSrc] = useState<string>(() => {
    return song.thumbnail || (song.youtubeId ? `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg` : '');
  });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isInlinePaused, setIsInlinePaused] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoTotalDuration, setVideoTotalDuration] = useState<number>(0);
  const videoCurrentTimeRef = useRef<number>(0);

  useEffect(() => {
    const nextThumb = song.thumbnail || (song.youtubeId ? `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg` : '');
    setThumbSrc(nextThumb);
  }, [song.thumbnail, song.youtubeId]);

  const cardInstanceId = useId();
  const activeKey = `${song.youtubeId}__${cardInstanceId}`;
  const isInlineActive = Boolean(song.youtubeId && activeInlineVideoId === activeKey);

  // Send control commands to YouTube iframe
  const sendIframeCommand = useCallback((func: string, args: any = '') => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const win = iframeRef.current.contentWindow;
        const postArgs = Array.isArray(args) ? args : (args !== '' ? [args] : []);
        win.postMessage(JSON.stringify({ event: 'command', func, args: postArgs }), '*');
        win.postMessage(JSON.stringify({ event: 'command', func, args: typeof args === 'string' ? args : '' }), '*');
      }
    } catch (err) {
      console.warn('[InlineVideo] sendIframeCommand error:', err);
    }
  }, []);

  // Sync state and time from YouTube iframe messages
  useEffect(() => {
    if (!isInlineActive) {
      setIsInlinePaused(false);
      setVideoCurrentTime(0);
      setVideoTotalDuration(0);
      videoCurrentTimeRef.current = 0;
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            videoCurrentTimeRef.current = data.info.currentTime;
            setVideoCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setVideoTotalDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            const state = data.info.playerState;
            if (state === 1) setIsInlinePaused(false);
            else if (state === 2 || state === 0) setIsInlinePaused(true);
          }
        } else if (data.event === 'onStateChange') {
          const state = typeof data.info === 'number' ? data.info : data.info?.playerState;
          if (state === 1) setIsInlinePaused(false);
          else if (state === 2 || state === 0) setIsInlinePaused(true);
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isInlineActive]);

  const handleToggleInlinePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInlinePaused) {
      sendIframeCommand('unMute');
      sendIframeCommand('playVideo');
      setIsInlinePaused(false);
    } else {
      sendIframeCommand('pauseVideo');
      sendIframeCommand('mute');
      pauseSong();
      setIsInlinePaused(true);
    }
  };

  const handleSeekInline = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextTime = Math.max(0, videoCurrentTimeRef.current + delta);
    sendIframeCommand('seekTo', [nextTime, true]);
    videoCurrentTimeRef.current = nextTime;
    setVideoCurrentTime(nextTime);
  };

  const handleRestartInline = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendIframeCommand('seekTo', [0, true]);
    sendIframeCommand('unMute');
    sendIframeCommand('playVideo');
    setIsInlinePaused(false);
    videoCurrentTimeRef.current = 0;
    setVideoCurrentTime(0);
  };

  const handleStopVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleStopInline();
    pauseSong();
  };

  const handleStartInline = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!song.youtubeId) return;
    // 1. Terminate any other card's running inline video iframe
    window.dispatchEvent(new CustomEvent('pause_inline_video'));
    // 2. Stop and mute global background audio/video player completely
    pauseSong();
    // 3. Sync song state
    syncInlineVideoSong(song);
    // 4. Activate inline video for this specific card instance ONLY
    setActiveInlineVideoId(activeKey);
  };

  const handleStopInline = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      sendIframeCommand('pauseVideo');
      sendIframeCommand('mute');
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
    } catch (err) {}
    setActiveInlineVideoId(null);
  };

  useEffect(() => {
    const handleGlobalPause = () => {
      if (isInlineActive) {
        try {
          sendIframeCommand('pauseVideo');
          sendIframeCommand('mute');
          if (iframeRef.current) {
            iframeRef.current.src = 'about:blank';
          }
        } catch (err) {}
        setActiveInlineVideoId(null);
      }
    };
    window.addEventListener('pause_inline_video', handleGlobalPause);
    return () => {
      window.removeEventListener('pause_inline_video', handleGlobalPause);
    };
  }, [isInlineActive, sendIframeCommand, setActiveInlineVideoId]);

  const singerInitial = song.singer ? song.singer.trim().charAt(0) : 'छ';

  return (
    <div
      className={`group rounded-none sm:rounded-2xl bg-white dark:bg-stone-900 border-y sm:border overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md select-none flex flex-col justify-between ${
        isCurrent || isInlineActive
          ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md'
          : 'border-stone-200 dark:border-stone-800/80 hover:border-amber-500/40 hover:bg-stone-50 dark:hover:bg-stone-850'
      }`}
    >
      <div>
        {/* 16:9 YouTube Thumbnail Container - Inline Video Plays Right Here! */}
        <div 
          onClick={!isInlineActive ? handleStartInline : undefined}
          className="relative aspect-video w-full bg-stone-950 overflow-hidden select-none cursor-pointer group/thumb"
        >
          {/* Base Thumbnail Image Layer */}
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

          {/* ACTIVE INLINE VIDEO (Plays directly in thumbnail) */}
          {isInlineActive ? (
            <div className="absolute inset-0 z-20 bg-black flex flex-col justify-between">
              {/* Reliable YouTube IFrame (Never black, always loaded) */}
              <iframe
                ref={iframeRef}
                id={`yt-inline-frame-${song.youtubeId}`}
                src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?autoplay=1&playsinline=1&controls=1&enablejsapi=1&rel=0`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => {
                  try {
                    iframeRef.current?.contentWindow?.postMessage(
                      JSON.stringify({ event: 'listening', id: song.youtubeId }),
                      '*'
                    );
                  } catch (e) {}
                }}
                className="w-full h-full border-0 absolute inset-0 z-10"
              />

              {/* ALWAYS-VISIBLE TOP BAR: Title & Close Button */}
              <div className="relative z-30 flex items-center justify-between p-2 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isInlinePaused ? 'bg-amber-400' : 'bg-red-500 animate-pulse'}`} />
                  <p className="text-white text-xs font-semibold truncate drop-shadow-md">
                    {song.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStopVideo}
                  className="w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-700 active:scale-90 text-white flex items-center justify-center shadow-lg transition-transform cursor-pointer border border-white/20 shrink-0"
                  title="बंद करें"
                  aria-label="बंद करें"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* ALWAYS-VISIBLE BOTTOM CONTROL PANEL: Play/Pause, Rewind, Forward, Scrubber */}
              <div 
                className="relative z-30 p-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-1.5 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Interactive Progress Bar */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                    const total = videoTotalDuration || (typeof song.duration === 'number' ? song.duration : 240);
                    const targetTime = ratio * total;
                    sendIframeCommand('seekTo', [targetTime, true]);
                    videoCurrentTimeRef.current = targetTime;
                    setVideoCurrentTime(targetTime);
                  }}
                  className="w-full bg-white/25 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${videoTotalDuration > 0 ? Math.min(100, (videoCurrentTime / videoTotalDuration) * 100) : 0}%`
                    }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    {/* Main Play / Pause Button */}
                    <button
                      type="button"
                      onClick={handleToggleInlinePlay}
                      className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-90 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform cursor-pointer"
                      title={isInlinePaused ? "चलाएं (Play)" : "रोकें (Pause)"}
                      aria-label={isInlinePaused ? "चलाएं" : "रोकें"}
                    >
                      {isInlinePaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>चलाएं</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>रोकें</span>
                        </>
                      )}
                    </button>

                    {/* Rewind -10s */}
                    <button
                      type="button"
                      onClick={(e) => handleSeekInline(-10, e)}
                      className="px-2 py-0.5 rounded-md bg-black/60 hover:bg-black/90 text-white/90 text-[10px] font-mono font-bold active:scale-95 border border-white/20 transition-transform cursor-pointer"
                      title="10 सेकंड पीछे"
                      aria-label="10 सेकंड पीछे"
                    >
                      -10s
                    </button>

                    {/* Forward +10s */}
                    <button
                      type="button"
                      onClick={(e) => handleSeekInline(10, e)}
                      className="px-2 py-0.5 rounded-md bg-black/60 hover:bg-black/90 text-white/90 text-[10px] font-mono font-bold active:scale-95 border border-white/20 transition-transform cursor-pointer"
                      title="10 सेकंड आगे"
                      aria-label="10 सेकंड आगे"
                    >
                      +10s
                    </button>

                    {/* Restart */}
                    <button
                      type="button"
                      onClick={handleRestartInline}
                      className="p-1 rounded-md bg-black/60 hover:bg-black/90 text-white/90 active:scale-95 border border-white/20 transition-transform cursor-pointer"
                      title="शुरू से चलाएं"
                      aria-label="शुरू से चलाएं"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Time Display */}
                  <div className="text-[11px] font-mono font-medium text-white/80">
                    <span>{formatDuration(videoCurrentTime)}</span>
                    <span className="mx-1 text-white/40">/</span>
                    <span className="text-white/60">{formatDuration(videoTotalDuration || song.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Idle Play Overlay on Thumbnail */}
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
            onClick={!isInlineActive ? handleStartInline : undefined}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-400/40 text-stone-950 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5 cursor-pointer"
          >
            {singerInitial}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1">
            <h4 
              onClick={!isInlineActive ? handleStartInline : undefined}
              className={`font-semibold text-xs sm:text-sm line-clamp-2 leading-snug transition-colors cursor-pointer ${
                isCurrent || isInlineActive ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-200'
              }`}
              title={song.title}
            >
              {song.title}
            </h4>

            {/* Singer Name on Left & Action Signs on Right */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              {/* Singer / Channel Name */}
              <div className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 truncate min-w-0 flex-1">
                <span className="truncate">{song.singer}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 shrink-0" />
              </div>

              {/* Action Signs (Icons ONLY): Video (New View), Audio, Share, Fav */}
              <div className="flex items-center gap-0.5 shrink-0">
                {/* Video Sign -> Plays in New View (Theater) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStopInline();
                    window.dispatchEvent(new CustomEvent('pause_inline_video'));
                    onPlayVideo();
                  }}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/15 dark:text-red-400 transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title="वीडियो नई विंडो में देखें (New View)"
                  aria-label="वीडियो नई विंडो में देखें"
                >
                  <Video className="w-4 h-4" />
                </button>

                {/* Audio Sign -> Plays in Audio Player */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStopInline();
                    window.dispatchEvent(new CustomEvent('pause_inline_video'));
                    onPlay();
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                    isPlayingThis && !isInlineActive
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                  title={isPlayingThis && !isInlineActive ? "ऑडियो रोकें" : "ऑडियो सुनें"}
                  aria-label="ऑडियो सुनें"
                >
                  {isPlayingThis && !isInlineActive ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Headphones className="w-4 h-4" />
                  )}
                </button>

                {/* Share Sign */}
                {onShareSong && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareSong();
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer hover:scale-110 active:scale-95"
                    title="गीत शेयर करें"
                    aria-label="शेयर करें"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}

                {/* Favorite Sign */}
                {onToggleFav && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFav();
                    }}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                      isFav ? 'text-red-500' : 'text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    title={isFav ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
                    aria-label="पसंदीदा"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
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
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'success' | 'no_results' | 'error'>('idle');
  const [ytSearchResults, setYtSearchResults] = useState<YouTubeSearchSong[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Endless search pagination refs
  const searchFacetIndexRef = useRef<number>(0);
  const currentSearchTermRef = useRef<string>('');

  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShareSong = useCallback(async (song: Song) => {
    const songUrl = song.youtubeId 
      ? `https://www.youtube.com/watch?v=${song.youtubeId}` 
      : (song.audioUrl || window.location.href);
    const shareText = `🎶 *${song.title}*\nगायक: ${song.singer}\nछठ महापर्व एवं भक्ति संगीत सुनें:\n${songUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: `🎶 ${song.title} - ${song.singer}`,
          url: songUrl
        });
        return;
      } catch {
        // Fallback to clipboard if cancelled or unavailable
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareFeedback(`"${song.title}" का लिंक कॉपी हो गया! WhatsApp पर शेयर करें 🎶`);
      setTimeout(() => setShareFeedback(null), 3500);
    } catch {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  }, []);

  // Real-time Live YouTube Songs Stream State (Dynamic: static dataset removed)
  const [liveSongs, setLiveSongs] = useState<Song[]>([]);
  const [isLiveInitialLoading, setIsLiveInitialLoading] = useState<boolean>(true);
  const [liveNextPageToken, setLiveNextPageToken] = useState<string | null>(null);
  const [isLoadingMoreLive, setIsLoadingMoreLive] = useState<boolean>(false);
  const liveTopicIndexRef = useRef<number>(0);
  const seenYoutubeIdsRef = useRef<Set<string>>(new Set());
  const seenSignaturesRef = useRef<Set<string>>(new Set());
  const searchSeenIdsRef = useRef<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const searchRequestIdRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);
  const isLoadingMoreLiveRef = useRef<boolean>(false);

  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  useEffect(() => {
    isLoadingMoreLiveRef.current = isLoadingMoreLive;
  }, [isLoadingMoreLive]);

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
    'chhath puja trending songs 2026',
    'छठ महापर्व 2026 नए ट्रेंडिंग गीत',
    'chhath puja top hits latest',
    'छठ महापर्व लाइव दर्शन भजन',
    'chhath geet new video 2026',
    'छठ संध्या अर्घ्य उषा अर्घ्य स्पेशल वीडियो',
    'chhath puja viral devotional songs',
    'छठ महापर्व पावन भक्ति संगीत 2026'
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

  // Load real-time live songs on mount directly from live YouTube trending queries
  const fetchInitialLiveSongs = useCallback(async () => {
    setIsLiveInitialLoading(true);
    seenYoutubeIdsRef.current.clear();
    seenSignaturesRef.current.clear();
    try {
      const TRENDING_QUERIES = [
        'chhath puja trending songs 2026',
        'छठ महापर्व 2026 नए ट्रेंडिंग गीत',
        'chhath geet trending latest superhit'
      ];

      const query1 = TRENDING_QUERIES[Math.floor(Math.random() * TRENDING_QUERIES.length)];
      const query2 = 'छठ पूजा पावन भक्ति वीडियो 2026';
      const query3 = 'chhath geet new superhit';

      // Randomize the initial topic index for smooth continuation scrolling
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

      // Filter valid landscape songs and deduplicate
      const filtered = filterValidLandscapeSongs(rawPool);
      const unique = deduplicateSongs(filtered);
      const shuffled = shuffleArray(unique);

      if (shuffled.length > 0) {
        setLiveSongs(shuffled);
      }
    } catch (err) {
      console.warn('Initial live YouTube songs fetch failed:', err);
    } finally {
      setIsLiveInitialLoading(false);
    }
  }, [deduplicateSongs, CHHATH_LIVE_TOPICS]);

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

      // Append strictly unique songs
      const uniqueNew = deduplicateSongs(results);
      if (uniqueNew.length > 0) {
        const freshNew = shuffleArray(uniqueNew);
        setLiveSongs(prev => [...prev, ...freshNew]);
      }
    } catch (err) {
      console.warn('Load more live songs failed:', err);
    } finally {
      setIsLoadingMoreLive(false);
    }
  }, [isLoadingMoreLive, isLiveInitialLoading, liveNextPageToken, CHHATH_LIVE_TOPICS, deduplicateSongs]);

  // Execute YouTube API Search
  const handleExecuteSearch = async (query: string, token: string = '', isContinuation: boolean = false) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (!token && !isContinuation) {
      searchRequestIdRef.current += 1;
      currentSearchTermRef.current = trimmed;
      searchFacetIndexRef.current = 0;
      searchSeenIdsRef.current.clear();
      setSearchStatus('loading');
      setYtSearchResults([]);
      setNextPageToken(null);
      setErrorMessage(null);
    } else {
      setIsLoadingMore(true);
      isLoadingMoreRef.current = true;
    }

    const thisRequestId = searchRequestIdRef.current;

    try {
      const response = await searchYouTubeVideos(trimmed, token, 'video');

      // If a newer search query was triggered while this was in flight, discard this result to prevent race conditions
      if (!isContinuation && !token && thisRequestId !== searchRequestIdRef.current) {
        return;
      }

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

        if (cleanResults.length === 0 && isContinuation) {
          searchFacetIndexRef.current += 1;
          const isSongIntent = /song|geet|gana|गाना|गीत|भजन|bhajan|music|audio/i.test(currentSearchTermRef.current || trimmed);
          const facets = isSongIntent
            ? [`${currentSearchTermRef.current || trimmed} new songs`, `${currentSearchTermRef.current || trimmed} superhit`, `${currentSearchTermRef.current || trimmed} audio`, `${currentSearchTermRef.current || trimmed} jukebox`]
            : [`${currentSearchTermRef.current || trimmed} video`, `${currentSearchTermRef.current || trimmed} full episode`, `${currentSearchTermRef.current || trimmed} trending`, `${currentSearchTermRef.current || trimmed} latest`];
          const nextFacet = facets[searchFacetIndexRef.current % facets.length];
          setTimeout(() => handleExecuteSearch(nextFacet, '', true), 200);
          return;
        }

        setYtSearchResults(prev => (token || isContinuation) ? [...prev, ...cleanResults] : cleanResults);
        setNextPageToken(response.nextPageToken || null);
        setSearchStatus('success');

        // Auto-continuation: If initial search loaded < 6 videos, auto-chain continuation so viewport fills
        if (!token && !isContinuation && cleanResults.length < 6) {
          setTimeout(() => {
            loadMoreSearchResults();
          }, 350);
        }
      } else {
        if (!token && !isContinuation) {
          setYtSearchResults([]);
          setSearchStatus('no_results');
          setErrorMessage(response.error || 'कोई गाना या वीडियो नहीं मिला।');
        } else if (isContinuation) {
          searchFacetIndexRef.current += 1;
          const isSongIntent = /song|geet|gana|गाना|गीत|भजन|bhajan|music|audio/i.test(currentSearchTermRef.current || trimmed);
          const facets = isSongIntent
            ? [`${currentSearchTermRef.current || trimmed} new songs`, `${currentSearchTermRef.current || trimmed} superhit`]
            : [`${currentSearchTermRef.current || trimmed} video`, `${currentSearchTermRef.current || trimmed} trending`];
          const nextFacet = facets[searchFacetIndexRef.current % facets.length];
          setTimeout(() => handleExecuteSearch(nextFacet, '', true), 250);
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
      isLoadingMoreRef.current = false;
    }
  };

  // Continuous infinite scroll: never stops even if single-query page tokens run out!
  const loadMoreSearchResults = useCallback(async () => {
    if (isLoadingMoreRef.current) return;
    const baseQuery = currentSearchTermRef.current || searchQuery.trim();
    if (!baseQuery) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      // 1. If we have a nextPageToken from the current query, fetch next page
      if (nextPageToken) {
        await handleExecuteSearch(baseQuery, nextPageToken, true);
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
            `${baseQuery} episode`,
            `${baseQuery} latest`,
            `${baseQuery} full video`,
            `${baseQuery} trending`,
            `${baseQuery} official`,
            `${baseQuery} 2026`
          ];
      const nextFacetQuery = facets[searchFacetIndexRef.current % facets.length];
      await handleExecuteSearch(nextFacetQuery, '', true);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [nextPageToken, searchQuery]);

  const handleClearSearch = (eOrBroadcast?: React.MouseEvent | boolean) => {
    const broadcast = typeof eOrBroadcast === 'boolean' ? eOrBroadcast : true;
    searchRequestIdRef.current += 1;
    searchSeenIdsRef.current.clear();
    currentSearchTermRef.current = '';
    searchFacetIndexRef.current = 0;
    setSearchQuery('');
    setSearchStatus('idle');
    setYtSearchResults([]);
    setNextPageToken(null);
    setErrorMessage(null);
    setActiveFilter('all');
    if (broadcast) {
      window.dispatchEvent(new CustomEvent('chhath_music_search', { detail: { query: '' } }));
    }
  };

  // Sync initialQuery prop
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      const q = initialQuery.trim();
      if (q !== currentSearchTermRef.current || searchStatus === 'idle') {
        setSearchQuery(q);
        handleExecuteSearch(q);
      }
    }
  }, [initialQuery]);

  // Listen for global custom search event dispatched from TopSongSearchBar
  useEffect(() => {
    const handleMusicSearchEvent = (e: any) => {
      const q = e.detail?.query;
      if (q && q.trim()) {
        const clean = q.trim();
        if (clean === currentSearchTermRef.current && (searchStatus === 'loading' || ytSearchResults.length > 0)) {
          setTimeout(() => {
            document.getElementById('songs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          return;
        }
        setSearchQuery(clean);
        handleExecuteSearch(clean);
        setTimeout(() => {
          document.getElementById('songs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else if (q === '') {
        handleClearSearch(false);
      }
    };
    window.addEventListener('chhath_music_search', handleMusicSearchEvent);
    return () => window.removeEventListener('chhath_music_search', handleMusicSearchEvent);
  }, [searchStatus, ytSearchResults.length]);

  // Inspect hash parameters on mount (e.g. #music?q=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&]q=([^&]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]).trim();
        if (decoded && decoded !== currentSearchTermRef.current) {
          setSearchQuery(decoded);
          handleExecuteSearch(decoded);
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
          if (searchStatus === 'success' && !isLoadingMoreRef.current) {
            loadMoreSearchResults();
          } else if (searchStatus === 'idle' && !isLoadingMoreLiveRef.current && !isLiveInitialLoading) {
            loadMoreLiveSongs();
          }
        }
      },
      { rootMargin: '600px', threshold: 0.01 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchStatus, isLiveInitialLoading, loadMoreSearchResults, loadMoreLiveSongs]);

  // Window scroll and touch listener fallback to guarantee infinite scroll ALWAYS triggers on user scroll
  useEffect(() => {
    let ticking = false;

    const handleScrollOrTouch = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollBottom = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 700;

        if (scrollBottom >= threshold) {
          if (searchStatus === 'success' && !isLoadingMoreRef.current) {
            loadMoreSearchResults();
          } else if (searchStatus === 'idle' && !isLoadingMoreLiveRef.current && !isLiveInitialLoading) {
            loadMoreLiveSongs();
          }
        }
      });
    };

    window.addEventListener('scroll', handleScrollOrTouch, { passive: true });
    window.addEventListener('touchmove', handleScrollOrTouch, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrTouch);
      window.removeEventListener('touchmove', handleScrollOrTouch);
    };
  }, [searchStatus, isLiveInitialLoading, loadMoreSearchResults, loadMoreLiveSongs]);

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
  }, [searchStatus, searchQuery, fetchInitialLiveSongs]);

  return (
    <section id="songs" className="py-0 sm:py-6 px-0 sm:px-4 bg-transparent text-stone-900 dark:text-stone-100 font-mukta w-full">
      <div className="w-full max-w-6xl mx-auto space-y-2 sm:space-y-4">

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
              {ytSearchResults.map((ytSong) => {
                const songObj = convertToSongModel(ytSong);
                const isCurrent = (currentSong?.youtubeId && currentSong.youtubeId === ytSong.youtubeId) || currentSong?.id === songObj.id;
                const isPlayingThis = isCurrent && isPlaying;
                const inQueue = queue.some(q => (q.youtubeId && q.youtubeId === ytSong.youtubeId) || q.id === songObj.id);
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
                      if (isCurrent && isPlaying) {
                        togglePlay();
                      } else {
                        playSong(songObj, ytSearchResults.map(convertToSongModel));
                      }
                    }}
                    onPlayVideo={() => {
                      playVideo(songObj, ytSearchResults.map(convertToSongModel));
                    }}
                    onToggleQueue={() => {
                      if (!inQueue) addToQueue(songObj);
                    }}
                    onToggleFav={() => toggleFavorite(songObj.id, songObj)}
                    onShareSong={() => handleShareSong(songObj)}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-none sm:rounded-2xl bg-white dark:bg-stone-900/60 border-y sm:border border-stone-200 dark:border-stone-800/80 animate-pulse overflow-hidden">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
                {liveSongs.map((song) => {
                  const cardKey = song.youtubeId || song.id;
                  const isCurrent = (currentSong?.youtubeId && song.youtubeId && currentSong.youtubeId === song.youtubeId) || currentSong?.id === song.id;
                  const isPlayingThis = isCurrent && isPlaying;
                  const inQueue = queue.some(q => (q.youtubeId && song.youtubeId && q.youtubeId === song.youtubeId) || q.id === song.id);
                  const isFav = favorites.includes(song.id);

                  return (
                    <YouTubeVideoCard
                      key={cardKey}
                      song={song}
                      isCurrent={isCurrent}
                      isPlayingThis={isPlayingThis}
                      inQueue={inQueue}
                      isFav={isFav}
                      onPlay={() => {
                        if (isCurrent && isPlaying) {
                          togglePlay();
                        } else {
                          playSong(song, liveSongs);
                        }
                      }}
                      onPlayVideo={() => {
                        playVideo(song, liveSongs);
                      }}
                      onToggleQueue={() => {
                        if (!inQueue) addToQueue(song);
                      }}
                      onToggleFav={() => toggleFavorite(song.id, song)}
                      onShareSong={() => handleShareSong(song)}
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
        <div ref={sentinelRef} className="py-3 pb-3 sm:pb-4 flex flex-col items-center justify-center gap-3">
          {(isLoadingMore || (searchStatus === 'idle' && isLoadingMoreLive)) ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">और वीडियो लोड हो रहे हैं...</span>
            </div>
          ) : searchStatus === 'success' && ytSearchResults.length > 0 ? (
            <button
              type="button"
              onClick={() => loadMoreSearchResults()}
              className="px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>+ और वीडियो लोड करें (Load More)</span>
            </button>
          ) : null}
        </div>

        {/* Floating Share Feedback Toast */}
        {shareFeedback && (
          <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stone-900/95 text-amber-300 border border-amber-500/50 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-mukta flex items-center gap-2 animate-bounce">
            <span>✨</span>
            <span>{shareFeedback}</span>
          </div>
        )}

      </div>
    </section>
  );
};
