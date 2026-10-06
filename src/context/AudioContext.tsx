import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2, Minimize2, ExternalLink, Play, Pause, X, RotateCcw, RotateCw, ChevronDown, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Song } from '../types';
import { useChhathData } from './ChhathDataContext';

const formatTime = (secs: number): string => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

interface PlaybackError {
  songId: string;
  youtubeId?: string;
  message: string;
  code?: number;
}

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  queue: Song[];
  currentIndex: number;
  isShuffle: boolean;
  isRepeat: boolean;
  favorites: string[];
  recentlyPlayed: string[];
  isExpandedOpen: boolean;
  isQueueOpen: boolean;
  showVideo: boolean;
  videoExpanded: boolean;
  setVideoExpanded: (expanded: boolean) => void;
  isFullscreenMode: boolean;
  setIsFullscreenMode: (fs: boolean) => void;
  toggleNativeFullscreen: () => void;
  lyricsSong: Song | null;
  ytPlayerReady: boolean;
  playbackError: PlaybackError | null;

  playSong: (song: Song, contextQueue?: Song[], startSeconds?: number) => void;
  playVideo: (song: Song, contextQueue?: Song[], startSeconds?: number) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleFavorite: (songId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  moveQueueItem: (fromIndex: number, toIndex: number) => void;
  setIsExpandedOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setShowVideo: (show: boolean) => void;
  setLyricsSong: (song: Song | null) => void;
  clearPlaybackError: () => void;
  ringBell: () => void;
  syncInlineVideoSong: (song: Song | null, startSeconds?: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { songs, favoriteSongs, toggleFavoriteSong } = useChhathData();
  const favorites = favoriteSongs;

  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_music_recently');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chhath_music_volume');
      return saved !== null ? parseFloat(saved) : 0.8;
    } catch {
      return 0.8;
    }
  });

  // Global Player States
  const [queue, setQueueState] = useState<Song[]>(() => songs);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<PlaybackError | null>(null);

  // Modals & Overlay States
  const [isExpandedOpen, setIsExpandedOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [videoExpanded, setVideoExpanded] = useState<boolean>(true);
  const [videoOverlayVisible, setVideoOverlayVisible] = useState<boolean>(true);
  const overlayTimerRef = useRef<any>(null);
  const theaterVideoBoxRef = useRef<HTMLDivElement | null>(null);
  const [lyricsSong, setLyricsSong] = useState<Song | null>(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [seekFeedback, setSeekFeedback] = useState<'forward' | 'backward' | null>(null);
  const seekFeedbackTimerRef = useRef<any>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  // Sync with browser native fullscreen change events (ESC key, Android Back, gestures)
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreenMode(isFs);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerHeight >= window.innerWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const showVideoControlsTemporarily = useCallback(() => {
    setVideoOverlayVisible(true);
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => {
      setVideoOverlayVisible(false);
    }, 4000);
  }, []);

  const toggleNativeFullscreen = useCallback(() => {
    try {
      const el = theaterVideoBoxRef.current;
      const isCurrentlyFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement || isFullscreenMode);

      if (!isCurrentlyFs) {
        setIsFullscreenMode(true);
        if (el?.requestFullscreen) {
          el.requestFullscreen().catch(() => {});
        } else if ((el as any)?.webkitRequestFullscreen) {
          (el as any).webkitRequestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        try {
          if ((screen.orientation as any)?.lock) {
            (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch {}
      } else {
        setIsFullscreenMode(false);
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
        try {
          if (screen.orientation?.unlock) {
            screen.orientation.unlock();
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Native fullscreen toggle error:', e);
      setIsFullscreenMode(prev => !prev);
    }
  }, [isFullscreenMode]);

  const handleSeekRelative = useCallback((seconds: number) => {
    const target = Math.max(0, Math.min(duration || 300, currentTime + seconds));
    seekTo(target);
    showVideoControlsTemporarily();

    setSeekFeedback(seconds > 0 ? 'forward' : 'backward');
    if (seekFeedbackTimerRef.current) clearTimeout(seekFeedbackTimerRef.current);
    seekFeedbackTimerRef.current = setTimeout(() => {
      setSeekFeedback(null);
    }, 700);
  }, [currentTime, duration, showVideoControlsTemporarily]);

  // Touch and tap handler for the video backdrop (captures all taps on mobile and desktop)
  const handleVideoBackdropTap = useCallback((clientX: number, targetRect: DOMRect) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current.time;
    const xRatio = (clientX - targetRect.left) / targetRect.width;

    if (timeDiff < 320) {
      // Double tap detected!
      if (xRatio < 0.38) {
        handleSeekRelative(-10);
      } else if (xRatio > 0.62) {
        handleSeekRelative(10);
      } else {
        togglePlay();
        showVideoControlsTemporarily();
      }
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      // Single tap -> toggle overlay visibility
      lastTapRef.current = { time: now, x: clientX };
      setVideoOverlayVisible(prev => {
        const next = !prev;
        if (next) {
          showVideoControlsTemporarily();
        }
        return next;
      });
    }
  }, [handleSeekRelative, showVideoControlsTemporarily]);

  // YouTube Player Ref & Pending Song Ref
  const ytPlayerRef = useRef<any>(null);
  const pendingSongRef = useRef<Song | null>(null);
  const [ytPlayerReady, setYtPlayerReady] = useState<boolean>(false);
  const timeIntervalRef = useRef<any>(null);
  const userRequestedPauseRef = useRef<boolean>(false);
  const hasStartedPlaybackRef = useRef<boolean>(false);
  const autoResumeTimerRef = useRef<any>(null);

  // Background audio & system media notification keepalive ref
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const getSilentAudioUrl = useCallback(() => {
    try {
      const rawBase = import.meta.env.BASE_URL || '/';
      const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
      return `${base}silent.wav`;
    } catch {
      return '/silent.wav';
    }
  }, []);

  const startAudioKeepalive = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!bgAudioRef.current) {
        const audio = new Audio();
        audio.src = getSilentAudioUrl();
        audio.loop = true;
        audio.volume = 0.05;
        audio.preload = 'auto';
        bgAudioRef.current = audio;
      }
      bgAudioRef.current.play().catch(e => {
        console.log('[MediaSession] silent keepalive play:', e);
      });
    } catch (e) {
      console.warn('[MediaSession] keepalive error:', e);
    }
  }, [getSilentAudioUrl]);

  // Authoritative synchronous playback state refs to prevent stale closure bugs
  const currentSongRef = useRef<Song | null>(currentSong);
  const queueRef = useRef<Song[]>(queue);
  const currentIndexRef = useRef<number>(currentIndex);

  // Sync refs whenever React states update
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Sync queue when master songs load initially
  useEffect(() => {
    if (songs.length > 0 && queue.length === 0) {
      setQueueState(songs);
      queueRef.current = songs;
      setCurrentSong(songs[0]);
      currentSongRef.current = songs[0];
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }
  }, [songs]);

  // Persist volume & favorites
  useEffect(() => {
    try {
      localStorage.setItem('chhath_music_volume', volume.toString());
    } catch (e) {
      console.warn('localStorage save volume error:', e);
    }
  }, [volume]);

  const createGlobalYtPlayer = useCallback(() => {
    const container = document.getElementById('global-yt-player-container');
    if (ytPlayerRef.current || !container) return;
    if (!(window as any).YT || !(window as any).YT.Player) return;

    console.log('[YouTubePlayer] Initializing global YT.Player on container');

    try {
      const initialVideoId = pendingSongRef.current?.youtubeId || currentSongRef.current?.youtubeId || 'BsAFCc901MM';
      const shouldAutoPlay = !!pendingSongRef.current;

      ytPlayerRef.current = new (window as any).YT.Player('global-yt-player-container', {
        height: '100%',
        width: '100%',
        videoId: initialVideoId,
        playerVars: {
          autoplay: shouldAutoPlay ? 1 : 0,
          playsinline: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : undefined
        },
        events: {
          onReady: (event: any) => {
            console.log('[YouTubePlayer] Global Player Ready');
            setYtPlayerReady(true);
            try {
              if (event.target.unMute) event.target.unMute();
              event.target.setVolume(Math.round(volume * 100) || 100);
            } catch (e) {
              console.warn('unMute/setVolume onReady warning:', e);
            }
            if (pendingSongRef.current && pendingSongRef.current.youtubeId) {
              const toPlay = pendingSongRef.current.youtubeId;
              const startSec = (pendingSongRef.current as any)?._startSeconds || 0;
              pendingSongRef.current = null;
              try {
                if (startSec > 0) {
                  event.target.loadVideoById({ videoId: toPlay, startSeconds: startSec });
                  setCurrentTime(startSec);
                } else {
                  event.target.loadVideoById(toPlay);
                }
                event.target.playVideo();
                setIsPlaying(true);
              } catch (e) {
                console.warn('Pending loadVideoById error:', e);
              }
            }
          },
          onStateChange: (event: any) => {
            const state = event.data;
            console.log('[YouTubePlayer] State Change:', state);

            if (state === 1) {
              setIsPlaying(true);
              setPlaybackError(null);
              try {
                if (ytPlayerRef.current?.unMute) {
                  ytPlayerRef.current.unMute();
                }
                if (ytPlayerRef.current?.setVolume) {
                  ytPlayerRef.current.setVolume(Math.round(volume * 100) || 100);
                }
                if (ytPlayerRef.current?.getDuration) {
                  setDuration(ytPlayerRef.current.getDuration() || 0);
                }
              } catch {
                // Catch cross-origin duration/data check
              }
            } else if (state === 2) {
              if (userRequestedPauseRef.current) {
                setIsPlaying(false);
                bgAudioRef.current?.pause();
              } else {
                // If user didn't request pause (e.g. background switch), gently auto-resume once if still paused
                if (!autoResumeTimerRef.current) {
                  autoResumeTimerRef.current = setTimeout(() => {
                    autoResumeTimerRef.current = null;
                    if (!userRequestedPauseRef.current && ytPlayerRef.current) {
                      try {
                        const currState = ytPlayerRef.current.getPlayerState ? ytPlayerRef.current.getPlayerState() : -1;
                        if (currState === 2) {
                          ytPlayerRef.current.playVideo();
                        }
                      } catch (e) {}
                    }
                  }, 400);
                }
              }
            } else if (state === 0) {
              setIsPlaying(false);
              handleSongEnded();
            }
          },
          onError: (event: any) => {
            const errorCode = event.data;
            const activeSong = currentSongRef.current;
            console.warn('[YouTubePlayer] Error Code:', errorCode, 'for song:', activeSong?.title, '| youtubeId:', activeSong?.youtubeId);

            let errorMsg = 'यह YouTube वीडियो इस वेबसाइट पर चलाया नहीं जा सकता। YouTube पर खोलें।';
            if (errorCode === 2) {
              errorMsg = 'अमान्य YouTube वीडियो ID।';
            } else if (errorCode === 100) {
              errorMsg = 'यह वीडियो YouTube पर हटा दिया गया है या प्राइवेट है।';
            } else if (errorCode === 101 || errorCode === 150) {
              errorMsg = 'वीडियो मालिक ने इस वेबसाइट पर एम्बेडिंग प्रतिबंधित की है।';
            }

            setIsPlaying(false);
            setPlaybackError({
              songId: activeSong?.id || '',
              youtubeId: activeSong?.youtubeId,
              message: errorMsg,
              code: errorCode
            });
          }
        }
      });
    } catch (err) {
      console.warn('YouTube Player Initialization exception:', err);
    }
  }, [volume]);

  // Dynamic YouTube IFrame Player API Injection
  useEffect(() => {
    const existingScript = document.getElementById('yt-iframe-api-script');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const previousCallback = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      createGlobalYtPlayer();
    };

    if ((window as any).YT && (window as any).YT.Player) {
      createGlobalYtPlayer();
    }

    // Safety polling interval (guarantees player loads even if script is cached)
    const pollInterval = setInterval(() => {
      if ((window as any).YT && (window as any).YT.Player) {
        createGlobalYtPlayer();
        if (ytPlayerRef.current) {
          clearInterval(pollInterval);
        }
      }
    }, 250);

    return () => clearInterval(pollInterval);
  }, [createGlobalYtPlayer]);

  // Poll current time when playing with whole-second updates
  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          try {
            const time = Math.floor(ytPlayerRef.current.getCurrentTime() || 0);
            setCurrentTime(prev => (prev !== time ? time : prev));
            if (ytPlayerRef.current.getDuration) {
              const dur = Math.floor(ytPlayerRef.current.getDuration() || 0);
              setDuration(prev => (prev !== dur ? dur : prev));
            }
          } catch {
            // Ignore polling errors
          }
        }
      }, 1000);
    } else {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    }
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [isPlaying]);

  // Handle Song Ended
  const handleSongEnded = () => {
    if (isRepeat) {
      if (currentSongRef.current) playSong(currentSongRef.current);
      return;
    }
    playNext();
  };

  // Authoritative Play Song Implementation
  const playSong = (song: Song, contextQueue?: Song[], startSeconds?: number) => {
    if (!song || !song.youtubeId) {
      console.warn('[MusicPlayer] Cannot play song without valid youtubeId:', song);
      return;
    }

    const prevSong = currentSongRef.current;

    // Fast-path: If the SAME song is already active in player, switch mode seamlessly with ZERO reloading!
    const isSameSong = Boolean(
      prevSong &&
      ((prevSong.youtubeId && song.youtubeId && prevSong.youtubeId === song.youtubeId) ||
       (prevSong.id && song.id && prevSong.id === song.id))
    );

    if (isSameSong && ytPlayerRef.current) {
      console.log('[MusicPlayer] Same song mode switch/resume - continuous stream with ZERO delay!');
      userRequestedPauseRef.current = false;
      hasStartedPlaybackRef.current = true;
      setPlaybackError(null);
      setIsPlaying(true);
      startAudioKeepalive();

      try {
        if (ytPlayerRef.current.unMute) ytPlayerRef.current.unMute();
        if (ytPlayerRef.current.setVolume) ytPlayerRef.current.setVolume(Math.round(volume * 100) || 100);

        if (typeof startSeconds === 'number' && startSeconds > 0 && Math.abs(currentTime - startSeconds) > 3) {
          if (ytPlayerRef.current.seekTo) {
            ytPlayerRef.current.seekTo(startSeconds, true);
          }
        }

        if (ytPlayerRef.current.playVideo) {
          ytPlayerRef.current.playVideo();
        }
      } catch (e) {
        console.warn('Same song play error:', e);
      }
      return;
    }

    // 1. Determine active queue
    const targetQueue = (contextQueue && contextQueue.length > 0) ? contextQueue : queueRef.current;

    // 2. Find exact index using youtubeId matching first, then song id
    let targetIndex = targetQueue.findIndex(s => 
      (s.youtubeId && song.youtubeId && s.youtubeId === song.youtubeId) || s.id === song.id
    );

    let finalQueue = targetQueue;
    if (targetIndex === -1) {
      // Append song to target queue if not present
      finalQueue = [...targetQueue, song];
      targetIndex = finalQueue.length - 1;
    }

    // 3. SYNCHRONOUS REF UPDATES (Prevents stale closure races)
    queueRef.current = finalQueue;
    currentIndexRef.current = targetIndex;
    currentSongRef.current = song;

    // 4. REACT STATE UPDATES
    hasStartedPlaybackRef.current = true;
    userRequestedPauseRef.current = false;
    setPlaybackError(null);
    setQueueState(finalQueue);
    setCurrentIndex(targetIndex);
    setCurrentSong(song);
    setIsPlaying(true);
    startAudioKeepalive();

    // Track recently played
    setRecentlyPlayed(prev => [song.id, ...prev.filter(id => id !== song.id)].slice(0, 20));

    // 5. AUTHORITATIVE DIAGNOSTIC LOGGING
    console.log('[MusicPlayer] Transition:', {
      previous: prevSong ? { youtubeId: prevSong.youtubeId, title: prevSong.title } : null,
      next: { youtubeId: song.youtubeId, title: song.title },
      currentIndex: targetIndex,
      queueLength: finalQueue.length,
      loadingYoutubeId: song.youtubeId,
      startSeconds
    });

    // 6. YOUTUBE PLAYER LOAD
    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
      try {
        console.log('[YouTubePlayer] Executing loadVideoById:', song.youtubeId, 'startSeconds:', startSeconds);
        // Explicitly unMute and set volume before and with load
        if (ytPlayerRef.current.unMute) {
          ytPlayerRef.current.unMute();
        }
        if (ytPlayerRef.current.setVolume) {
          ytPlayerRef.current.setVolume(Math.round(volume * 100) || 100);
        }

        const seekSec = typeof startSeconds === 'number' && startSeconds > 0 ? Math.floor(startSeconds) : 0;
        if (seekSec > 0) {
          ytPlayerRef.current.loadVideoById({
            videoId: song.youtubeId,
            startSeconds: seekSec
          });
          setCurrentTime(seekSec);
        } else {
          ytPlayerRef.current.loadVideoById(song.youtubeId);
        }

        if (ytPlayerRef.current.playVideo) {
          ytPlayerRef.current.playVideo();
        }

        // Verification after player load
        setTimeout(() => {
          try {
            if (ytPlayerRef.current?.unMute) {
              ytPlayerRef.current.unMute();
            }
            if (ytPlayerRef.current?.setVolume) {
              ytPlayerRef.current.setVolume(Math.round(volume * 100) || 100);
            }
            if (ytPlayerRef.current && ytPlayerRef.current.getVideoData) {
              const actualVideoId = ytPlayerRef.current.getVideoData()?.video_id;
              console.log('[YouTubePlayer] actualPlayerVideoId:', actualVideoId);
              if (actualVideoId && actualVideoId !== song.youtubeId) {
                console.warn(`[YouTubePlayer] WARNING: currentSong.youtubeId (${song.youtubeId}) !== actualPlayerVideoId (${actualVideoId})`);
              }
            }
          } catch {
            // Ignore cross-origin error in check
          }
        }, 800);
      } catch (e) {
        console.warn('[YouTubePlayer] loadVideoById error:', e);
      }
    } else {
      console.log('[YouTubePlayer] Player not ready yet. Queuing pending song and creating player:', song.youtubeId);
      (song as any)._startSeconds = startSeconds;
      pendingSongRef.current = song;
      createGlobalYtPlayer();
    }
  };

  const playVideo = useCallback((song: Song, contextQueue?: Song[], startSeconds?: number) => {
    setShowVideo(true);
    setVideoExpanded(true);
    playSong(song, contextQueue, startSeconds);
  }, [playSong]);

  const togglePlay = () => {
    if (!currentSong && queueRef.current.length > 0) {
      playSong(queueRef.current[0]);
      return;
    }

    if (isPlaying) {
      pauseSong();
    } else {
      userRequestedPauseRef.current = false;
      setIsPlaying(true);
      startAudioKeepalive();
      if (ytPlayerRef.current && ytPlayerRef.current.playVideo) {
        try {
          if (ytPlayerRef.current.unMute) ytPlayerRef.current.unMute();
          if (ytPlayerRef.current.setVolume) ytPlayerRef.current.setVolume(Math.round(volume * 100) || 100);
          ytPlayerRef.current.playVideo();
        } catch (e) {
          console.warn('YouTube playVideo error:', e);
        }
      } else if (currentSong) {
        playSong(currentSong);
      }
    }
  };

  const syncInlineVideoSong = useCallback((song: Song | null, startSeconds?: number) => {
    if (!song) {
      setIsPlaying(false);
      return;
    }

    // 1. Pause background global YouTube player to prevent duplicate audio echo
    try {
      if (ytPlayerRef.current?.pauseVideo) {
        ytPlayerRef.current.pauseVideo();
      }
      bgAudioRef.current?.pause();
    } catch {}

    // 2. Set active song & playing state in AudioContext
    currentSongRef.current = song;
    setCurrentSong(song);
    hasStartedPlaybackRef.current = true;
    userRequestedPauseRef.current = false;
    setIsPlaying(true);
    setShowVideo(false);
    if (typeof startSeconds === 'number' && startSeconds > 0) {
      setCurrentTime(startSeconds);
    }

    // 3. Ensure song is in queue
    setQueueState(prev => {
      const exists = prev.some(s => (s.youtubeId && song.youtubeId && s.youtubeId === song.youtubeId) || s.id === song.id);
      if (!exists) return [...prev, song];
      return prev;
    });

    // 4. Track recently played
    setRecentlyPlayed(prev => [song.id, ...prev.filter(id => id !== song.id)].slice(0, 20));
  }, []);

  const pauseSong = () => {
    userRequestedPauseRef.current = true;
    setIsPlaying(false);
    bgAudioRef.current?.pause();
    window.dispatchEvent(new CustomEvent('pause_inline_video'));
    if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch (e) {
        console.warn('YouTube pauseVideo error:', e);
      }
    }
  };

  // Next Queue Item
  const playNext = () => {
    const currentQ = queueRef.current;
    if (currentQ.length === 0) return;
    setPlaybackError(null);

    let nextIdx: number;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * currentQ.length);
    } else {
      nextIdx = (currentIndexRef.current + 1) % currentQ.length;
    }

    const targetSong = currentQ[nextIdx];
    if (!targetSong) return;

    console.log('[MusicPlayer] Next Clicked -> Target index:', nextIdx, '| Song:', targetSong.title, '| youtubeId:', targetSong.youtubeId);
    playSong(targetSong, currentQ);
  };

  // Previous Queue Item
  const playPrevious = () => {
    const currentQ = queueRef.current;
    if (currentQ.length === 0) return;
    setPlaybackError(null);

    // If played more than 3 seconds, restart current song
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    let prevIdx: number;
    if (isShuffle) {
      prevIdx = Math.floor(Math.random() * currentQ.length);
    } else {
      prevIdx = (currentIndexRef.current - 1 + currentQ.length) % currentQ.length;
    }

    const targetSong = currentQ[prevIdx];
    if (!targetSong) return;

    console.log('[MusicPlayer] Previous Clicked -> Target index:', prevIdx, '| Song:', targetSong.title, '| youtubeId:', targetSong.youtubeId);
    playSong(targetSong, currentQ);
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch (e) {
        console.warn('YouTube seekTo error:', e);
      }
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      try {
        ytPlayerRef.current.setVolume(Math.round(clamped * 100));
      } catch (e) {
        console.warn('YouTube setVolume error:', e);
      }
    }
  };

  const toggleFavorite = (songId: string) => {
    toggleFavoriteSong(songId);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeat(prev => !prev);
  };

  const setQueue = (newQueue: Song[]) => {
    setQueueState(newQueue);
  };

  const addToQueue = (song: Song) => {
    setQueueState(prev => [...prev, song]);
  };

  const removeFromQueue = (index: number) => {
    setQueueState(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (index === currentIndex && updated.length > 0) {
        const nextIndex = index % updated.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(updated[nextIndex]);
      }
      return updated;
    });
  };

  const moveQueueItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= queue.length || toIndex < 0 || toIndex >= queue.length) return;
    setQueueState(prev => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  const clearPlaybackError = () => {
    setPlaybackError(null);
  };

  const ringBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // Ignore audio context errors if user hasn't interacted yet
    }
  };

  // ==========================================
  // BACKGROUND AUDIO & SYSTEM MEDIA SESSION API
  // (Lock Screen & Notification Panel Controls)
  // ==========================================
  // ==========================================
  // BACKGROUND AUDIO & SYSTEM MEDIA SESSION API
  // (Lock Screen & Notification Panel Controls)
  // ==========================================

  // Prime audio on first touch/interaction on mobile devices
  useEffect(() => {
    const primeAudio = () => {
      startAudioKeepalive();
      window.removeEventListener('touchstart', primeAudio);
      window.removeEventListener('click', primeAudio);
    };
    window.addEventListener('touchstart', primeAudio, { once: true, passive: true });
    window.addEventListener('click', primeAudio, { once: true, passive: true });
    return () => {
      window.removeEventListener('touchstart', primeAudio);
      window.removeEventListener('click', primeAudio);
    };
  }, [startAudioKeepalive]);

  // Synchronize with Native Android MediaNotification
  const syncWithAndroidNotification = useCallback((song: Song | null, playing: boolean) => {
    if (typeof window === 'undefined') return;
    try {
      if ((window as any).AndroidMedia) {
        if (song) {
          (window as any).AndroidMedia.updateMedia(
            song.title || 'छठ महापर्व',
            song.singer || 'शारदा सिन्हा व पारंपरिक भजन',
            song.thumbnail || '',
            playing
          );
        } else {
          (window as any).AndroidMedia.stopMedia();
        }
      }
    } catch (e) {
      console.warn('AndroidMedia bridge warning:', e);
    }
  }, []);

  // Native notification actions (Previous, Play/Pause, Next, Dismiss)
  useEffect(() => {
    const handleNotificationAction = (e: any) => {
      const action = e?.detail;
      if (action === 'prev') {
        playPrevious();
      } else if (action === 'toggle') {
        togglePlay();
      } else if (action === 'next') {
        playNext();
      } else if (action === 'dismiss') {
        pauseSong();
        hasStartedPlaybackRef.current = false;
        syncWithAndroidNotification(null, false);
      }
    };
    window.addEventListener('notification-action', handleNotificationAction);
    return () => window.removeEventListener('notification-action', handleNotificationAction);
  }, [playPrevious, togglePlay, playNext, pauseSong, syncWithAndroidNotification]);

  // Sync MediaSession Metadata & Notification Shade (ONLY when song was actually played by user)
  useEffect(() => {
    if (hasStartedPlaybackRef.current && currentSong) {
      syncWithAndroidNotification(currentSong, isPlaying);
    } else {
      syncWithAndroidNotification(null, false);
    }

    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (currentSong && hasStartedPlaybackRef.current) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSong.title,
          artist: currentSong.singer || 'छठ महापर्व',
          album: 'छठ महापर्व 2026 • लोक आस्था',
          artwork: [
            { src: currentSong.thumbnail, sizes: '96x96', type: 'image/jpeg' },
            { src: currentSong.thumbnail, sizes: '128x128', type: 'image/jpeg' },
            { src: currentSong.thumbnail, sizes: '192x192', type: 'image/jpeg' },
            { src: currentSong.thumbnail, sizes: '256x256', type: 'image/jpeg' },
            { src: currentSong.thumbnail, sizes: '384x384', type: 'image/jpeg' },
            { src: currentSong.thumbnail, sizes: '512x512', type: 'image/jpeg' }
          ]
        });
      } catch (err) {
        console.warn('[MediaSession] metadata setup warning:', err);
      }
    }
  }, [currentSong, isPlaying, syncWithAndroidNotification]);

  // Sync MediaSession Playback State & Action Handlers
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      if (isPlaying) {
        startAudioKeepalive();
      } else {
        bgAudioRef.current?.pause();
      }
    } catch {}

    const actionHandlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => { togglePlay(); }],
      ['pause', () => { pauseSong(); }],
      ['stop', () => { pauseSong(); }],
      ['previoustrack', () => { playPrevious(); }],
      ['nexttrack', () => { playNext(); }],
      ['seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          seekTo(details.seekTime);
        }
      }],
      ['seekbackward', (details) => {
        const skip = details.seekOffset || 10;
        seekTo(Math.max(currentTime - skip, 0));
      }],
      ['seekforward', (details) => {
        const skip = details.seekOffset || 10;
        seekTo(Math.min(currentTime + skip, duration || 100));
      }]
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some actions may not be supported on all browsers
      }
    }

    return () => {
      for (const [action] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {}
      }
    };
  }, [isPlaying, currentSong, startAudioKeepalive]);

  // Prevent webview/browser from reporting hidden visibility
  useEffect(() => {
    try {
      Object.defineProperty(document, 'hidden', {
        get: () => false,
        configurable: true
      });
      Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible',
        configurable: true
      });
    } catch (e) {}
  }, []);

  // Resilience: Keep audio playing if Android or browser backgrounds or minimizes the app
  useEffect(() => {
    const handleKeepAlive = () => {
      if (!userRequestedPauseRef.current && currentSongRef.current) {
        startAudioKeepalive();
        setIsPlaying(true);
        setTimeout(() => {
          if (!userRequestedPauseRef.current && ytPlayerRef.current) {
            try {
              ytPlayerRef.current.playVideo();
            } catch (err) {}
          }
        }, 150);
      }
    };

    document.addEventListener('visibilitychange', handleKeepAlive);
    window.addEventListener('blur', handleKeepAlive);
    window.addEventListener('pagehide', handleKeepAlive);
    return () => {
      document.removeEventListener('visibilitychange', handleKeepAlive);
      window.removeEventListener('blur', handleKeepAlive);
      window.removeEventListener('pagehide', handleKeepAlive);
    };
  }, [startAudioKeepalive]);



  // Sync Position State in MediaSession (for progress bar in Notification Panel & Lock Screen)
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;
    if (duration > 0 && typeof navigator.mediaSession.setPositionState === 'function') {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, currentTime), duration)
        });
      } catch {
        // Ignore position state errors
      }
    }
  }, [currentTime, duration]);

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        isShuffle,
        isRepeat,
        favorites,
        recentlyPlayed,
        isExpandedOpen,
        isQueueOpen,
        showVideo,
        videoExpanded,
        setVideoExpanded,
        lyricsSong,
        ytPlayerReady,
        playbackError,
        playSong,
        playVideo,
        pauseSong,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        toggleFavorite,
        toggleShuffle,
        toggleRepeat,
        setQueue,
        addToQueue,
        removeFromQueue,
        moveQueueItem,
        setIsExpandedOpen,
        setIsQueueOpen,
        setShowVideo,
        setLyricsSong,
        clearPlaybackError,
        ringBell,
        isFullscreenMode,
        setIsFullscreenMode,
        toggleNativeFullscreen,
        syncInlineVideoSong
      }}
    >
      {children}
      {/* 
        Persistent Single Global YouTube Player Container
        - When showVideo is true:
          - If videoExpanded: Full Theater Cinema View (fixed inset-0 z-[100] bg-black/90 backdrop-blur-md)
          - If !videoExpanded: Floating PIP Corner Window (fixed z-[90] bottom-20 sm:bottom-24 right-2 sm:right-4)
        - When showVideo is false: Placed with 16:9 micro dimensions (w-16 h-9) inside viewport at bottom-0 right-0.
        This guarantees continuous playback with zero reloading!
      */}
      <div
        className={
          showVideo
            ? videoExpanded
              ? isFullscreenMode
                ? "fixed inset-0 z-[1000] w-screen h-screen bg-black flex items-center justify-center p-0 transition-all"
                : "fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 transition-all animate-in fade-in"
              : "fixed z-[90] bottom-20 sm:bottom-24 right-2 sm:right-4 w-72 sm:w-88 aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/60 bg-black transition-all flex flex-col animate-in slide-in-from-bottom"
            : "fixed bottom-0 right-0 w-16 h-9 pointer-events-none opacity-[0.01] z-[-1] overflow-hidden"
        }
        aria-hidden={!showVideo}
      >
        <div
          ref={theaterVideoBoxRef}
          style={
            showVideo && videoExpanded && isFullscreenMode && isPortrait
              ? {
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  width: '100vh',
                  height: '100vw',
                  transform: 'translate(-50%, -50%) rotate(90deg)',
                  transformOrigin: 'center center',
                  zIndex: 999999,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  borderRadius: 0
                }
              : undefined
          }
          className={
            !showVideo
              ? "w-full h-full pointer-events-none"
              : videoExpanded
              ? isFullscreenMode
                ? "relative w-full h-full max-w-none bg-black rounded-none overflow-hidden flex items-center justify-center pointer-events-auto"
                : "relative w-full max-w-5xl aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center pointer-events-auto"
              : "relative w-full h-full bg-black pointer-events-auto"
          }
        >
          {/* THE SINGLE PERSISTENT YOUTUBE PLAYER CONTAINER - NEVER UNMOUNTS */}
          <div id="global-yt-player-container" className="w-full h-full pointer-events-auto" />

          {/* TAP CAPTURE BACKDROP (Ensures mobile taps never get trapped in iframe) */}
          {showVideo && videoExpanded && (
            <div
              className="absolute inset-0 z-10 cursor-pointer pointer-events-auto select-none"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleVideoBackdropTap(e.clientX, rect);
              }}
            />
          )}

          {/* DOUBLE-TAP RIPPLE ANIMATION (YouTube 10s feedback) */}
          {seekFeedback && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 z-15 pointer-events-none flex flex-col items-center justify-center p-4 rounded-full bg-black/75 text-white animate-in zoom-in-75 duration-200 border border-white/10 ${
                seekFeedback === 'backward' ? 'left-8 sm:left-16' : 'right-8 sm:right-16'
              }`}
            >
              {seekFeedback === 'backward' ? (
                <>
                  <RotateCcw className="w-8 h-8 animate-pulse text-amber-400" />
                  <span className="text-xs font-bold mt-1 text-amber-300">-10s</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-8 h-8 animate-pulse text-amber-400" />
                  <span className="text-xs font-bold mt-1 text-amber-300">+10s</span>
                </>
              )}
            </div>
          )}

          {/* THEATER OVERLAY CONTROLS (Professional YouTube Mobile & Desktop Controls) */}
          {showVideo && videoExpanded && (
            <div
              className={`absolute inset-0 z-20 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-5 pointer-events-none select-none ${
                videoOverlayVisible || !isPlaying
                  ? 'opacity-100 bg-gradient-to-t from-black/90 via-black/25 to-black/80'
                  : 'opacity-0'
              }`}
            >
              {/* Top Row: Pop-up minimize, Song Title & Close */}
              <div className="flex items-center justify-between w-full pointer-events-auto">
                <div className="flex items-center gap-2 min-w-0 max-w-[80%]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoExpanded(false);
                    }}
                    className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0"
                    title="पॉप-अप विंडो (छोटा करें)"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <div className="min-w-0 drop-shadow">
                    <h3 className="text-white text-xs sm:text-sm font-semibold truncate leading-tight">
                      {currentSong?.title}
                    </h3>
                    {currentSong?.singer && (
                      <p className="text-stone-300 text-[11px] truncate">
                        {currentSong.singer}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVideo(false);
                  }}
                  className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-colors cursor-pointer shadow-md border border-white/10 shrink-0"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Center Controls: Prev Song, Backward 10s, Big Play/Pause, Forward 10s, Next Song */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 pointer-events-auto my-auto">
                {/* Previous Song */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPrevious();
                    showVideoControlsTemporarily();
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-transform active:scale-90 shadow-lg border border-white/10 cursor-pointer"
                  title="पिछला गीत (Previous Song)"
                >
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 fill-white/80" />
                </button>

                {/* 10s Backward */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeekRelative(-10);
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex flex-col items-center justify-center transition-transform active:scale-90 shadow-xl border border-white/15 cursor-pointer"
                  title="10 सेकंड पीछे (Rewind 10s)"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-[9px] font-bold mt-0.5 leading-none font-mono">10</span>
                </button>

                {/* Big Play / Pause */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                    showVideoControlsTemporarily();
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md text-white flex items-center justify-center transition-transform active:scale-90 shadow-2xl border-2 border-white/25 cursor-pointer"
                  title={isPlaying ? "रोकें (Pause)" : "चलाएं (Play)"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 sm:w-9 sm:h-9 fill-white" />
                  ) : (
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white ml-1" />
                  )}
                </button>

                {/* 10s Forward */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeekRelative(10);
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex flex-col items-center justify-center transition-transform active:scale-90 shadow-xl border border-white/15 cursor-pointer"
                  title="10 सेकंड आगे (Forward 10s)"
                >
                  <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-[9px] font-bold mt-0.5 leading-none font-mono">10</span>
                </button>

                {/* Next Song */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playNext();
                    showVideoControlsTemporarily();
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-transform active:scale-90 shadow-lg border border-white/10 cursor-pointer"
                  title="अगला गीत (Next Song)"
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 fill-white/80" />
                </button>
              </div>

              {/* Bottom Bar: Timeline Scrubber + Time Display + PIP & Fullscreen Toggles */}
              <div className="w-full space-y-2 pointer-events-auto">
                {/* Progress Bar (Scrubber) */}
                <div className="relative flex items-center group/scrubber cursor-pointer">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                      e.stopPropagation();
                      seekTo(Number(e.target.value));
                      showVideoControlsTemporarily();
                    }}
                    className="w-full h-1.5 sm:h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-red-600 transition-all focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${
                        duration ? (currentTime / duration) * 100 : 0
                      }%, rgba(255,255,255,0.3) ${
                        duration ? (currentTime / duration) * 100 : 0
                      }%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                </div>

                {/* Time & Action Toggles */}
                <div className="flex items-center justify-between text-xs text-white/90">
                  <span className="font-mono text-[11px] sm:text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Volume Mute Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVolume(volume > 0 ? 0 : 1);
                        showVideoControlsTemporarily();
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-transform active:scale-95 cursor-pointer border border-white/15 shadow-md"
                      title={volume === 0 ? "आवाज चालू करें" : "आवाज बंद करें"}
                    >
                      {volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>

                    {/* Pop-up PIP Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoExpanded(false);
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-transform active:scale-95 cursor-pointer border border-white/15 shadow-md"
                      title="पॉप-अप विंडो (PIP मोड)"
                    >
                      <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNativeFullscreen();
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-transform active:scale-95 cursor-pointer border border-white/15 shadow-md"
                      title={isFullscreenMode ? "फुलस्क्रीन से बाहर निकलें" : "फुलस्क्रीन"}
                    >
                      <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PIP FLOATING MINI-PLAYER MODE QUICK CONTROLS */}
          {showVideo && !videoExpanded && (
            <div 
              onClick={() => setVideoExpanded(true)}
              className="absolute inset-0 cursor-pointer group/pip pointer-events-auto"
            >
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoExpanded(true);
                  }}
                  className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-white backdrop-blur-xs transition-colors cursor-pointer border border-white/15 shadow"
                  title="बड़ा करें (थिएटर मोड)"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVideo(false);
                  }}
                  className="p-1.5 rounded-lg bg-black/75 hover:bg-rose-900/90 text-white backdrop-blur-xs transition-colors cursor-pointer border border-white/15 shadow"
                  title="बंद करें"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Center Quick Play/Pause on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/pip:opacity-100 transition-opacity bg-black/40">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center border border-white/20 shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
