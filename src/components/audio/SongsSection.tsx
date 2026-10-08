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
  const { activeInlineVideoId, setActiveInlineVideoId, syncInlineVideoSong } = useAudio();
  const [thumbSrc, setThumbSrc] = useState<string>(() => {
    return song.thumbnail || (song.youtubeId ? `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg` : '');
  });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isInlinePaused, setIsInlinePaused] = useState<boolean>(false);
  const [mobileControlsVisible, setMobileControlsVisible] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoTotalDuration, setVideoTotalDuration] = useState<number>(0);
  const videoCurrentTimeRef = useRef<number>(0);
  const mobileTimerRef = useRef<any>(null);

  useEffect(() => {
    const nextThumb = song.thumbnail || (song.youtubeId ? `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg` : '');
    setThumbSrc(nextThumb);
  }, [song.thumbnail, song.youtubeId]);

  const isInlineActive = Boolean(song.youtubeId && activeInlineVideoId === song.youtubeId);

  useEffect(() => {
    if (!isInlineActive) {
      setIframeLoaded(false);
      setIsInlinePaused(false);
      setMobileControlsVisible(false);
      setVideoCurrentTime(0);
      setVideoTotalDuration(0);
      videoCurrentTimeRef.current = 0;
      if (mobileTimerRef.current) {
        clearTimeout(mobileTimerRef.current);
        mobileTimerRef.current = null;
      }
    }
  }, [isInlineActive]);

  // Command sender via postMessage to YouTube Iframe
  const sendIframeCommand = useCallback((func: string, args: any = '') => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: Array.isArray(args) ? args : (args !== '' ? [args] : [])
          }),
          '*'
        );
      }
    } catch (err) {
      console.warn('[InlineVideo] sendIframeCommand error:', err);
    }
  }, []);

  // Sync state and time from YouTube iframe messages
  useEffect(() => {
    if (!isInlineActive) return;

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
            if (state === 1) { // Playing
              setIsInlinePaused(false);
            } else if (state === 2 || state === 0) { // Paused or Ended
              setIsInlinePaused(true);
            }
          }
        } else if (data.event === 'onStateChange') {
          const state = typeof data.info === 'number' ? data.info : data.info?.playerState;
          if (state === 1) setIsInlinePaused(false);
          else if (state === 2 || state === 0) setIsInlinePaused(true);
        }
      } catch {
        // ignore non-json messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isInlineActive]);

  // Mobile controls auto-dismiss timer
  const resetMobileControlsTimer = useCallback(() => {
    if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    mobileTimerRef.current = setTimeout(() => {
      setMobileControlsVisible(false);
    }, 3500);
  }, []);

  const handleMobileOverlayTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mobileControlsVisible) {
      // If already visible, tapping anywhere dismisses immediately to leave screen 100% clean
      setMobileControlsVisible(false);
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    } else {
      // Tap to show controls with 3.5s timer
      setMobileControlsVisible(true);
      resetMobileControlsTimer();
    }
  };

  const handleToggleInlinePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInlinePaused) {
      sendIframeCommand('playVideo');
      setIsInlinePaused(false);
      resetMobileControlsTimer();
    } else {
      sendIframeCommand('pauseVideo');
      setIsInlinePaused(true);
      // Keep controls visible while paused so user can easily unpause
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    }
  };

  const handleSeekInline = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextTime = Math.max(0, videoCurrentTimeRef.current + delta);
    sendIframeCommand('seekTo', [nextTime, true]);
    videoCurrentTimeRef.current = nextTime;
    setVideoCurrentTime(nextTime);
    resetMobileControlsTimer();
  };

  const handleRestartInline = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendIframeCommand('seekTo', [0, true]);
    sendIframeCommand('playVideo');
    setIsInlinePaused(false);
    videoCurrentTimeRef.current = 0;
    setVideoCurrentTime(0);
    resetMobileControlsTimer();
  };

  const handleStopVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleStopInline();
  };

  const handleStartInline = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!song.youtubeId) return;
    syncInlineVideoSong(song);
    setActiveInlineVideoId(song.youtubeId);
  };

  const handleStopInline = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sendIframeCommand('pauseVideo');
    sendIframeCommand('stopVideo');
    setActiveInlineVideoId(null);
  };

  useEffect(() => {
    const handleGlobalPause = () => {
      if (isInlineActive) {
        sendIframeCommand('pauseVideo');
        sendIframeCommand('stopVideo');
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

          {/* ACTIVE INLINE VIDEO IFRAME (Plays directly in thumbnail) */}
          {isInlineActive ? (
            <div className="absolute inset-0 z-20 bg-black">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&playsinline=1&controls=1&enablejsapi=1&rel=0&modestbranding=1`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => {
                  setIframeLoaded(true);
                  try {
                    if (iframeRef.current?.contentWindow) {
                      iframeRef.current.contentWindow.postMessage(
                        JSON.stringify({ event: 'listening', id: song.youtubeId }),
                        '*'
                      );
                    }
                  } catch (e) {}
                }}
                className={`w-full h-full border-0 transition-opacity duration-300 ${
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Spinner while loading over thumbnail poster */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
                  <div className="w-10 h-10 rounded-full border-3 border-amber-500/30 border-t-amber-500 animate-spin" />
                </div>
              )}

              {/* DESKTOP QUICK CLOSE BUTTON */}
              <button
                type="button"
                onClick={handleStopVideo}
                className="hidden md:flex absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-black/75 hover:bg-black text-white/90 hover:text-white items-center justify-center border border-white/20 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title="वीडियो बंद करें"
                aria-label="वीडियो बंद करें"
              >
                <X className="w-4 h-4" />
              </button>

              {/* MOBILE TOUCH CONTROL OVERLAY (Phone screen only - md:hidden) */}
              {/* On Desktop (md:), this overlay is completely hidden, so desktop cursor hover controls remain 100% untouched */}
              <div 
                onClick={handleMobileOverlayTap}
                className={`absolute inset-0 z-30 md:hidden transition-all duration-300 select-none flex flex-col justify-between ${
                  mobileControlsVisible 
                    ? 'bg-black/60 backdrop-blur-[1px] opacity-100 pointer-events-auto' 
                    : 'bg-transparent opacity-0 pointer-events-auto'
                }`}
              >
                {/* When controls are hidden on phone screen, this layer is 100% transparent.
                    Tapping anywhere on it reveals the control panel immediately! */}
                {mobileControlsVisible && (
                  <>
                    {/* Top Header Bar */}
                    <div className="flex items-center justify-between p-2.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isInlinePaused ? 'bg-amber-400' : 'bg-red-500 animate-pulse'}`} />
                        <p className="text-white text-xs font-semibold truncate drop-shadow-md">
                          {song.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleStopVideo}
                        className="w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white/90 hover:text-white flex items-center justify-center shrink-0 border border-white/15 transition-transform"
                        title="वीडियो बंद करें"
                        aria-label="वीडियो बंद करें"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Center Action Controls */}
                    <div 
                      className="flex items-center justify-center gap-5 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Rewind -10s */}
                      <button
                        type="button"
                        onClick={(e) => handleSeekInline(-10, e)}
                        className="w-10 h-10 rounded-full bg-black/65 hover:bg-black/85 active:scale-90 text-white flex flex-col items-center justify-center border border-white/15 shadow-md transition-transform"
                        title="10 सेकंड पीछे"
                        aria-label="10 सेकंड पीछे"
                      >
                        <span className="text-[10px] font-bold font-mono leading-none">-10s</span>
                      </button>

                      {/* Main Play / Pause Button */}
                      <button
                        type="button"
                        onClick={handleToggleInlinePlay}
                        className="w-13 h-13 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-90 text-stone-950 flex items-center justify-center shadow-xl ring-4 ring-amber-500/35 transition-transform cursor-pointer"
                        title={isInlinePaused ? "चलाएं (Play)" : "रोकें (Pause)"}
                        aria-label={isInlinePaused ? "चलाएं" : "रोकें"}
                      >
                        {isInlinePaused ? (
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        ) : (
                          <Pause className="w-6 h-6 fill-current" />
                        )}
                      </button>

                      {/* Forward +10s */}
                      <button
                        type="button"
                        onClick={(e) => handleSeekInline(10, e)}
                        className="w-10 h-10 rounded-full bg-black/65 hover:bg-black/85 active:scale-90 text-white flex flex-col items-center justify-center border border-white/15 shadow-md transition-transform"
                        title="10 सेकंड आगे"
                        aria-label="10 सेकंड आगे"
                      >
                        <span className="text-[10px] font-bold font-mono leading-none">+10s</span>
                      </button>
                    </div>

                    {/* Bottom Control Bar */}
                    <div 
                      className="p-2.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col gap-1.5"
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
                          resetMobileControlsTimer();
                        }}
                        className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                      >
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-150"
                          style={{
                            width: `${videoTotalDuration > 0 ? Math.min(100, (videoCurrentTime / videoTotalDuration) * 100) : 0}%`
                          }}
                        />
                      </div>

                      {/* Time & Quick Actions */}
                      <div className="flex items-center justify-between text-white/90">
                        <div className="text-[11px] font-mono font-medium tracking-tight">
                          <span>{formatDuration(videoCurrentTime)}</span>
                          <span className="mx-1 text-white/50">/</span>
                          <span className="text-white/70">{formatDuration(videoTotalDuration || song.duration)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Restart Button */}
                          <button
                            type="button"
                            onClick={handleRestartInline}
                            className="p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-white active:scale-95 transition-transform"
                            title="शुरू से चलाएं"
                            aria-label="शुरू से चलाएं"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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

  // Voice Search States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // YouTube Autocomplete & Auto-fill States
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Real-time suggestions listener
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions(YouTubeSuggestService.getTrendingSearches().slice(0, 6));
      return;
    }
    const timer = setTimeout(async () => {
      const results = await YouTubeSuggestService.getSuggestions(searchQuery.trim());
      setSearchSuggestions(results);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle clicking outside of suggestions
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleAutoFillQuery = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery(text);
  };

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
    setActiveFilter('all');
  };

  const handleFilterSelect = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === 'all') {
      searchSeenIdsRef.current.clear();
      currentSearchTermRef.current = '';
      searchFacetIndexRef.current = 0;
      setSearchQuery('');
      setSearchStatus('idle');
      setYtSearchResults([]);
      setNextPageToken(null);
      setErrorMessage(null);
    } else {
      const queryMap: Record<string, string> = {
        sharda: 'शारदा सिन्हा छठ गीत',
        pawan: 'पवन सिंह छठ गीत',
        khesari: 'खेसारी लाल यादव छठ गीत',
        anuradha: 'अनुराधा पौडवाल छठ पूजा',
        maithili: 'मैथिली ठाकुर छठ गीत',
        arghya: 'छठ पूजा अर्घ्य पारम्परिक'
      };
      const q = queryMap[filterId] || filterId;
      setSearchQuery(q);
      handleExecuteSearch(q);
    }
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
  }, [searchStatus, activeFilter, isLoadingMore, loadMoreSearchResults, isLoadingMoreLive, isLiveInitialLoading, loadMoreLiveSongs]);

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
    <section id="songs" className="py-0 sm:py-6 px-0 sm:px-4 bg-transparent text-stone-900 dark:text-stone-100 font-mukta w-full">
      <div className="w-full max-w-6xl mx-auto space-y-2 sm:space-y-4">
        
        {/* ========================================================
            YOUTUBE-GRADE SMART SEARCH BAR (MOBILE & DESKTOP)
           ======================================================== */}
        <div ref={searchContainerRef} className="relative w-full px-2 sm:px-0">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative flex-1 flex items-center bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/25 rounded-full transition-all shadow-xs">
              <div className="pl-3.5 pr-2 text-stone-500 dark:text-stone-400 flex items-center pointer-events-none">
                <Search className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="YouTube पर कोई भी छठ गीत, गायक या भजन खोजें..."
                className="w-full py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none pr-2 font-mukta"
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
              <span>खोजें</span>
            </button>
          </form>

          {/* YouTube Real-time Autocomplete Dropdown with ↖ Auto-fill */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-2 right-2 sm:left-0 sm:right-0 mt-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto">
                <div className="px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  {!searchQuery.trim() ? <Sparkles className="w-3 h-3 text-amber-500" /> : <Search className="w-3 h-3 text-amber-500" />}
                  <span>{!searchQuery.trim() ? 'लोकप्रिय छठ सर्च (Trending)' : 'YouTube सुझाव'}</span>
                </div>

                {searchSuggestions.map((item, idx) => (
                  <div
                    key={`yt-sugg-${idx}`}
                    onClick={() => {
                      setSearchQuery(item);
                      setIsSearchFocused(false);
                      handleExecuteSearch(item);
                    }}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-stone-900 cursor-pointer text-xs sm:text-sm text-stone-800 dark:text-stone-100 group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-500 shrink-0" />
                      <span className="truncate font-medium">{item}</span>
                    </div>

                    {/* ↖ Auto-fill Arrow Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAutoFillQuery(item, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-500/20 transition-all shrink-0 cursor-pointer"
                      title="सर्च बॉक्स में भरें (Auto-fill)"
                    >
                      <ArrowUpLeft className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>



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
                    onToggleFav={() => toggleFavorite(songObj.id)}
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
                      onToggleFav={() => toggleFavorite(song.id)}
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
        <div ref={sentinelRef} className="py-6 pb-28 sm:pb-36 flex items-center justify-center">
            {(isLoadingMore || (searchStatus === 'idle' && isLoadingMoreLive)) && (
              <div className="p-3 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              </div>
            )}
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
