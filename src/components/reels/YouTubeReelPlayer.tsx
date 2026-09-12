import React, { useEffect, useRef, useState } from 'react';
import { Play, VolumeX, Volume2, AlertCircle } from 'lucide-react';

interface YouTubeReelPlayerProps {
  videoId: string;
  title: string;
  isActive: boolean;
  isMuted: boolean;
  onPlaybackError?: (videoId: string, errorCode: number) => void;
  onReady?: () => void;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Global script loader promise to avoid injecting the YouTube script multiple times
let ytScriptPromise: Promise<void> | null = null;
function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }
  if (!ytScriptPromise) {
    ytScriptPromise = new Promise<void>((resolve) => {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        resolve();
      };

      // Fallback check in case script was already loaded
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
  return ytScriptPromise;
}

export const YouTubeReelPlayer: React.FC<YouTubeReelPlayerProps> = ({
  videoId,
  title,
  isActive,
  isMuted,
  onPlaybackError,
  onReady
}) => {
  const containerId = useRef(`yt_player_${videoId}_${Math.random().toString(36).substring(2, 7)}`);
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 1. Ensure YouTube API is loaded
  useEffect(() => {
    let isMounted = true;
    loadYouTubeIframeApi().then(() => {
      if (isMounted) setIsApiReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize YT.Player once API is loaded
  useEffect(() => {
    if (!isApiReady || !videoId || hasError) return;

    let player: any = null;
    let isCancelled = false;

    try {
      const hostOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.chhathmahaparv.org';

      player = new window.YT.Player(containerId.current, {
        videoId,
        playerVars: {
          autoplay: isActive ? 1 : 0,
          mute: isMuted ? 1 : 0,
          enablejsapi: 1,
          rel: 0,
          playsinline: 1,
          controls: 1,
          modestbranding: 1,
          loop: 1,
          playlist: videoId,
          origin: hostOrigin
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled) return;
            playerRef.current = event.target;
            setIsPlayerReady(true);
            if (isMuted) event.target.mute();
            if (isActive) {
              try {
                event.target.playVideo();
              } catch {
                // Autoplay may be blocked by browser policy
              }
            }
            onReady?.();
          },
          onError: (event: any) => {
            const errorCode = event.data;
            // 2: Invalid parameter
            // 5: HTML5 player error
            // 100: Video removed/not found/private
            // 101: Embedding not allowed by video owner
            // 150: Same as 101
            // 153: Missing referer/client identification
            setHasError(true);
            onPlaybackError?.(videoId, errorCode);
          },
          onAutoplayBlocked: () => {
            setIsAutoplayBlocked(true);
          }
        }
      });
    } catch {
      setHasError(true);
      onPlaybackError?.(videoId, -1);
    }

    return () => {
      isCancelled = true;
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch {
          // ignore cleanup errors
        }
      }
      playerRef.current = null;
      setIsPlayerReady(false);
    };
  }, [isApiReady, videoId]);

  // 3. Play / Pause based on isActive
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isActive) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {
      // ignore state change errors
    }
  }, [isActive, isPlayerReady]);

  // 4. Handle Mute / Unmute
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch {
      // ignore mute errors
    }
  }, [isMuted, isPlayerReady]);

  // User manual play when autoplay is blocked by browser policy
  const handleManualPlay = () => {
    if (playerRef.current) {
      try {
        playerRef.current.playVideo();
        setIsAutoplayBlocked(false);
      } catch {
        // ignore
      }
    }
  };

  if (hasError) {
    // If an error occurred, do NOT show a broken YouTube screen;
    // render an unobtrusive devotional loading placeholder while the parent replaces this item.
    return (
      <div className="relative w-full h-full bg-stone-950 flex flex-col items-center justify-center text-amber-300">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mukta opacity-75">पावन दर्शन लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Target div for YouTube Iframe API */}
      <div id={containerId.current} className="w-full h-full pointer-events-auto" />

      {/* Autoplay Blocked Overlay */}
      {isAutoplayBlocked && (
        <div 
          onClick={handleManualPlay}
          className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer p-4 text-center group"
        >
          <div className="p-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-xl group-hover:scale-110 transition-transform mb-3">
            <Play className="w-8 h-8 fill-stone-950" />
          </div>
          <span className="font-mukta font-bold text-sm text-amber-200">
            ▶ दर्शन प्रारंभ करने के लिए टैप करें
          </span>
        </div>
      )}
    </div>
  );
};
