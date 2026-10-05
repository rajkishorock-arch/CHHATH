import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface YouTubeReelPlayerProps {
  videoId: string;
  title: string;
  isActive: boolean;
  isPlaying?: boolean;
  isMuted: boolean;
  onPlaybackError?: (videoId: string, errorCode: number) => void;
  onReady?: () => void;
  onProgress?: (percent: number, currentTime: number, duration: number) => void;
}

export const YouTubeReelPlayer: React.FC<YouTubeReelPlayerProps> = ({
  videoId,
  title,
  isActive,
  isPlaying = true,
  isMuted,
  onPlaybackError,
  onReady,
  onProgress
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const initialActiveRef = useRef(isActive);
  const initialMutedRef = useRef(isMuted);
  const durationRef = useRef<number>(0);

  // Send direct command to YouTube HTML5 Player via postMessage
  const sendYtCommand = useCallback((func: string, args: any[] = []) => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (win) {
        win.postMessage(JSON.stringify({ event: 'command', func, args: args || [] }), '*');
        win.postMessage(JSON.stringify({ event: 'command', func, args: args || [], id: 1 }), '*');
      }
    } catch {}
  }, []);

  // Cleanup on unmount: immediately stop playback
  useEffect(() => {
    return () => {
      try {
        const win = iframeRef.current?.contentWindow;
        if (win) {
          win.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }), '*');
        }
      } catch {}
    };
  }, []);

  // Sync Play / Pause and Mute state immediately when active status changes
  useEffect(() => {
    if (isActive) {
      if (isPlaying) {
        sendYtCommand('playVideo', []);
        if (!isMuted) {
          sendYtCommand('unMute', []);
          sendYtCommand('setVolume', [100]);
          setTimeout(() => {
            sendYtCommand('unMute', []);
            sendYtCommand('setVolume', [100]);
          }, 200);
        } else {
          sendYtCommand('mute', []);
        }
      } else {
        sendYtCommand('pauseVideo', []);
      }
    } else {
      sendYtCommand('pauseVideo', []);
      sendYtCommand('mute', []);
    }
  }, [isActive, isPlaying, isMuted, sendYtCommand]);

  // Listen for YouTube postMessage events (e.g. onError, playerState change, loop trigger)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        let data = e.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }
        if (!data || typeof data !== 'object') return;

        if (data.event === 'onError') {
          setHasError(true);
          onPlaybackError?.(videoId, Number(data.info) || 100);
          return;
        }

        // Instant Zero-Delay Loop when YouTube signals state 0 (ENDED)
        if (
          (data.event === 'onStateChange' && (data.info === 0 || data.info === '0')) ||
          (data.event === 'infoDelivery' && data.info && data.info.playerState === 0)
        ) {
          sendYtCommand('seekTo', [0, true]);
          sendYtCommand('playVideo', []);
          onProgress?.(0, 0, durationRef.current);
          return;
        }

        // When YouTube player is initialized and ready
        if (data.event === 'onReady' || data.event === 'initialDelivery') {
          setIsLoaded(true);
          onReady?.();
          if (isActive && isPlaying) {
            sendYtCommand('playVideo', []);
            if (!isMuted) {
              sendYtCommand('unMute', []);
              sendYtCommand('setVolume', [100]);
            }
          } else {
            sendYtCommand('pauseVideo', []);
            sendYtCommand('mute', []);
          }
        }

        // Live Playback Time, Duration, and Seamless Gapless Loop Guard
        if (data.event === 'infoDelivery' && data.info) {
          const { currentTime, duration, playerState } = data.info;

          if (typeof duration === 'number' && duration > 0) {
            durationRef.current = duration;
          }

          if (typeof currentTime === 'number' && durationRef.current > 0) {
            const pct = Math.min(100, Math.max(0, (currentTime / durationRef.current) * 100));
            onProgress?.(pct, currentTime, durationRef.current);

            // Pre-emptively trigger instant loop before browser video frame freezes
            if (currentTime >= durationRef.current - 0.2) {
              sendYtCommand('seekTo', [0, true]);
              sendYtCommand('playVideo', []);
              onProgress?.(0, 0, durationRef.current);
              return;
            }
          }

          if (playerState === 1) {
            setIsLoaded(true);
            onReady?.();
            if (!isActive || !isPlaying) {
              sendYtCommand('pauseVideo', []);
              sendYtCommand('mute', []);
            } else if (!isMuted) {
              sendYtCommand('unMute', []);
              sendYtCommand('setVolume', [100]);
            }
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId, isActive, isPlaying, isMuted, onPlaybackError, onReady, onProgress, sendYtCommand]);

  // Periodic polling for 60fps smooth progress bar updates
  useEffect(() => {
    if (!isActive || !isPlaying) return;
    const interval = setInterval(() => {
      sendYtCommand('getCurrentTime', []);
      sendYtCommand('getDuration', []);
    }, 250);
    return () => clearInterval(interval);
  }, [isActive, isPlaying, sendYtCommand]);

  // When iframe loads, notify parent and initialize command connection
  const handleIframeLoad = () => {
    setIsLoaded(true);
    try {
      const win = iframeRef.current?.contentWindow;
      win?.postMessage(JSON.stringify({ event: 'listening' }), '*');
      win?.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
      win?.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*');
    } catch {}

    if (isActive && isPlaying) {
      sendYtCommand('playVideo', []);
      if (!isMuted) {
        sendYtCommand('unMute', []);
        sendYtCommand('setVolume', [100]);
        // Multi-stage unMute to guarantee audio turns on without 10s wait
        setTimeout(() => {
          sendYtCommand('unMute', []);
          sendYtCommand('setVolume', [100]);
        }, 250);
        setTimeout(() => {
          sendYtCommand('unMute', []);
          sendYtCommand('setVolume', [100]);
        }, 600);
      }
    } else {
      sendYtCommand('pauseVideo', []);
      sendYtCommand('mute', []);
    }
  };

  // High-speed embed URL with controls=0, modestbranding=1, enablejsapi=1
  // Notice: loop=1&playlist=${videoId} is intentionally NOT used because it triggers YouTube's
  // playlist engine which cuts the video 2-3s short and forces a full network reload (2-3s spinner).
  // Instant loop is now handled via postMessage seekTo(0, true) + playVideo() with 0ms delay!
  const embedUrl = useMemo(() => {
    const initialAutoplay = initialActiveRef.current ? 1 : 0;
    const initialMute = initialActiveRef.current ? (initialMutedRef.current ? 1 : 0) : 1;
    return `https://www.youtube.com/embed/${videoId}?autoplay=${initialAutoplay}&mute=${initialMute}&playsinline=1&controls=0&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`;
  }, [videoId]);

  if (hasError) {
    return (
      <div className="relative w-full h-full bg-stone-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={handleIframeLoad}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        className="w-full h-full border-0 pointer-events-none select-none"
      />
    </div>
  );
};
