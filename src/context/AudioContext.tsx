import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { useChhathData } from './ChhathDataContext';

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
  lyricsSong: Song | null;
  ytPlayerReady: boolean;
  playbackError: PlaybackError | null;

  playSong: (song: Song, contextQueue?: Song[]) => void;
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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { songs } = useChhathData();

  // Load persisted lightweight preferences from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_music_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
  const [currentSong, setCurrentSong] = useState<Song | null>(() => songs[0] || null);
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
  const [lyricsSong, setLyricsSong] = useState<Song | null>(null);

  // YouTube Player Ref & Pending Song Ref
  const ytPlayerRef = useRef<any>(null);
  const pendingSongRef = useRef<Song | null>(null);
  const [ytPlayerReady, setYtPlayerReady] = useState<boolean>(false);
  const timeIntervalRef = useRef<any>(null);
  
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

  useEffect(() => {
    try {
      localStorage.setItem('chhath_music_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('localStorage save favorites error:', e);
    }
  }, [favorites]);

  // Dynamic YouTube IFrame Player API Injection
  useEffect(() => {
    const initYtApi = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        createGlobalYtPlayer();
        return;
      }

      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        createGlobalYtPlayer();
      };
    };

    const createGlobalYtPlayer = () => {
      const container = document.getElementById('global-yt-player-container');
      if (ytPlayerRef.current || !container) return;

      console.log('[YouTubePlayer] Initializing global YT.Player on container');

      try {
        ytPlayerRef.current = new (window as any).YT.Player('global-yt-player-container', {
          height: '100%',
          width: '100%',
          videoId: currentSongRef.current?.youtubeId || 'BsAFCc901MM',
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              console.log('[YouTubePlayer] Global Player Ready');
              setYtPlayerReady(true);
              try {
                event.target.setVolume(Math.round(volume * 100));
              } catch (e) {
                console.warn('setVolume onReady warning:', e);
              }
              if (pendingSongRef.current && pendingSongRef.current.youtubeId) {
                console.log('[YouTubePlayer] Loading pending song onReady:', pendingSongRef.current.youtubeId);
                try {
                  event.target.loadVideoById(pendingSongRef.current.youtubeId);
                  pendingSongRef.current = null;
                } catch (e) {
                  console.warn('Pending loadVideoById error:', e);
                }
              }
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              const state = event.data;
              console.log('[YouTubePlayer] State Change:', state);

              if (state === 1) {
                setIsPlaying(true);
                setPlaybackError(null);
                try {
                  if (ytPlayerRef.current?.getDuration) {
                    setDuration(ytPlayerRef.current.getDuration() || 0);
                  }
                  if (ytPlayerRef.current?.getVideoData) {
                    const actualVideoId = ytPlayerRef.current.getVideoData()?.video_id;
                    console.log('[YouTubePlayer] actualPlayerVideoId:', actualVideoId);
                    if (actualVideoId && currentSongRef.current && currentSongRef.current.youtubeId !== actualVideoId) {
                      console.warn(`[YouTubePlayer] WARNING: currentSong.youtubeId (${currentSongRef.current.youtubeId}) !== actualPlayerVideoId (${actualVideoId})`);
                    }
                  }
                } catch {
                  // Catch cross-origin duration/data check
                }
              } else if (state === 2) {
                setIsPlaying(false);
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
    };

    initYtApi();
  }, []);

  // Poll current time when playing
  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          try {
            const time = ytPlayerRef.current.getCurrentTime();
            setCurrentTime(time || 0);
            if (ytPlayerRef.current.getDuration) {
              setDuration(ytPlayerRef.current.getDuration() || 0);
            }
          } catch {
            // Ignore polling errors
          }
        }
      }, 500);
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
  const playSong = (song: Song, contextQueue?: Song[]) => {
    if (!song || !song.youtubeId) {
      console.warn('[MusicPlayer] Cannot play song without valid youtubeId:', song);
      return;
    }

    const prevSong = currentSongRef.current;

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
    setPlaybackError(null);
    setQueueState(finalQueue);
    setCurrentIndex(targetIndex);
    setCurrentSong(song);
    setIsPlaying(true);

    // Track recently played
    setRecentlyPlayed(prev => [song.id, ...prev.filter(id => id !== song.id)].slice(0, 20));

    // 5. AUTHORITATIVE DIAGNOSTIC LOGGING
    console.log('[MusicPlayer] Transition:', {
      previous: prevSong ? { youtubeId: prevSong.youtubeId, title: prevSong.title } : null,
      next: { youtubeId: song.youtubeId, title: song.title },
      currentIndex: targetIndex,
      queueLength: finalQueue.length,
      loadingYoutubeId: song.youtubeId
    });

    // 6. YOUTUBE PLAYER LOAD
    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
      try {
        console.log('[YouTubePlayer] Executing loadVideoById:', song.youtubeId);
        ytPlayerRef.current.loadVideoById(song.youtubeId);

        // Verification after player load
        setTimeout(() => {
          try {
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
      console.log('[YouTubePlayer] Player not ready yet. Queuing pending song:', song.youtubeId);
      pendingSongRef.current = song;
    }
  };

  const togglePlay = () => {
    if (!currentSong && queueRef.current.length > 0) {
      playSong(queueRef.current[0]);
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch (e) {
          console.warn('YouTube pauseVideo error:', e);
        }
      }
    } else {
      setIsPlaying(true);
      if (ytPlayerRef.current && ytPlayerRef.current.playVideo) {
        try {
          ytPlayerRef.current.playVideo();
        } catch (e) {
          console.warn('YouTube playVideo error:', e);
        }
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
    setFavorites(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
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
        lyricsSong,
        ytPlayerReady,
        playbackError,
        playSong,
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
        ringBell
      }}
    >
      {children}
      {/* 
        Persistent Single Global YouTube Player Container
        - When showVideo is true: Floats at z-[90] (ABOVE ExpandedPlayerModal z-[80]) with a visible rounded frame.
        - When showVideo is false: Positioned off-screen at -bottom-[9999px] -right-[9999px] with valid 320x180px dimensions.
        This prevents browser media throttling without obscuring the page with a black overlay!
      */}
      <div
        className={
          showVideo
            ? "fixed z-[90] bottom-24 right-4 w-72 sm:w-84 h-44 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/50 bg-black transition-all"
            : "fixed z-[-100] w-[320px] h-[180px] -bottom-[9999px] -right-[9999px] pointer-events-none overflow-hidden"
        }
      >
        {showVideo && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-stone-900 border-b border-amber-500/20 text-xs text-amber-300 font-bold">
            <span className="truncate">{currentSong?.title || 'YouTube Video'}</span>
            <button
              onClick={() => setShowVideo(false)}
              className="text-stone-400 hover:text-white ml-2 text-sm font-bold"
              title="वीडियो छुपाएं"
            >
              ✕
            </button>
          </div>
        )}
        <div id="global-yt-player-container" className="w-full h-full"></div>
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
