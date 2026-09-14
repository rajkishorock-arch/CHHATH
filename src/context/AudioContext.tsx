import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { useChhathData } from './ChhathDataContext';
import { getImageUrl } from '../utils/imageUtils';

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

  playSong: (song: Song) => void;
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

  // Modals & Overlay States
  const [isExpandedOpen, setIsExpandedOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [lyricsSong, setLyricsSong] = useState<Song | null>(null);

  // YouTube Player Ref & Ready State
  const ytPlayerRef = useRef<any>(null);
  const [ytPlayerReady, setYtPlayerReady] = useState<boolean>(false);
  const timeIntervalRef = useRef<any>(null);

  // Sync queue when master songs change
  useEffect(() => {
    if (songs.length > 0 && queue.length === 0) {
      setQueueState(songs);
      setCurrentSong(songs[0]);
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

      // Check if script tag already exists
      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Bind global callback
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        createGlobalYtPlayer();
      };
    };

    const createGlobalYtPlayer = () => {
      if (ytPlayerRef.current || !document.getElementById('global-yt-player-container')) return;

      try {
        ytPlayerRef.current = new (window as any).YT.Player('global-yt-player-container', {
          height: '100%',
          width: '100%',
          videoId: currentSong?.youtubeId || 'BsAFCc901MM',
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
              setYtPlayerReady(true);
              event.target.setVolume(Math.round(volume * 100));
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              const state = event.data;
              if (state === 1) {
                setIsPlaying(true);
                if (ytPlayerRef.current?.getDuration) {
                  setDuration(ytPlayerRef.current.getDuration() || 0);
                }
              } else if (state === 2) {
                setIsPlaying(false);
              } else if (state === 0) {
                setIsPlaying(false);
                playNextAuto();
              }
            },
            onError: (event: any) => {
              console.warn('YouTube Player Error Code:', event.data);
              // Error codes: 100/101/150 = unavailable or restricted. Auto skip to next!
              playNextAuto();
            }
          }
        });
      } catch (err) {
        console.warn('YouTube Player Initialization error:', err);
      }
    };

    initYtApi();
  }, []);

  // Poll current time when playing
  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          const time = ytPlayerRef.current.getCurrentTime();
          setCurrentTime(time || 0);
          if (ytPlayerRef.current.getDuration) {
            setDuration(ytPlayerRef.current.getDuration() || 0);
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

  // Load and play song via YouTube API
  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);

    // Track recently played
    setRecentlyPlayed(prev => [song.id, ...prev.filter(id => id !== song.id)].slice(0, 20));

    // Update queue current index
    const idx = queue.findIndex(s => s.id === song.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    } else {
      // Add to queue if not present
      setQueueState(prev => [...prev, song]);
      setCurrentIndex(queue.length);
    }

    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById && song.youtubeId) {
      try {
        ytPlayerRef.current.loadVideoById(song.youtubeId);
      } catch (e) {
        console.warn('YouTube loadVideoById error:', e);
      }
    }
  };

  const togglePlay = () => {
    if (!currentSong && queue.length > 0) {
      playSong(queue[0]);
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

  const playNextAuto = () => {
    if (queue.length === 0) return;
    if (isRepeat) {
      if (currentSong) playSong(currentSong);
      return;
    }
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playSong(queue[randomIndex]);
      return;
    }
    const nextIdx = (currentIndex + 1) % queue.length;
    playSong(queue[nextIdx]);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playSong(queue[randomIndex]);
      return;
    }
    const nextIdx = (currentIndex + 1) % queue.length;
    playSong(queue[nextIdx]);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    playSong(queue[prevIdx]);
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
        ringBell
      }}
    >
      {children}
      {/* Persistent Single Global YouTube Player Container */}
      <div
        className={
          showVideo
            ? "fixed z-[60] bottom-24 right-4 w-72 sm:w-84 h-44 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/50 bg-black transition-all"
            : "fixed z-[-100] opacity-0 pointer-events-none w-1 h-1 left-0 bottom-0 overflow-hidden"
        }
      >
        {showVideo && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-stone-900 border-b border-amber-500/20 text-xs text-amber-300 font-bold">
            <span className="truncate">{currentSong?.title || 'YouTube Video'}</span>
            <button
              onClick={() => setShowVideo(false)}
              className="text-stone-400 hover:text-white ml-2 text-sm font-bold"
              title="Close Video"
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
