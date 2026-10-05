import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface YouTubeReelPlayerProps {
  videoId: string;
  title: string;
  isActive: boolean;
  isPlaying?: boolean;
  isMuted: boolean;
  onPlaybackError?: (videoId: string, errorCode: number) => void;
  onReady?: () => void;
}

export const YouTubeReelPlayer: React.FC<YouTubeReelPlayerProps> = ({
  videoId,
  title,
  isActive,
  isPlaying = true,
  isMuted,
  onPlaybackError,
  onReady
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  // Listen for YouTube postMessage events (e.g. onError, playerState change)
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

        // When YouTube player is initialized and ready
        if (data.event === 'onReady' || data.event === 'initialDelivery') {
          setIsLoaded(true);
          if (isActive && isPlaying) {
            sendYtCommand('playVideo', []);
            if (!isMuted) {
              sendYtCommand('unMute', []);
              sendYtCommand('setVolume', [100]);
            }
          }
        }

        // When YouTube video state changes (1 = PLAYING)
        if (data.event === 'infoDelivery' && data.info) {
          if (data.info.playerState === 1) {
            setIsLoaded(true);
            onReady?.();
            if (!isMuted) {
              sendYtCommand('unMute', []);
              sendYtCommand('setVolume', [100]);
            }
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId, isActive, isPlaying, isMuted, onPlaybackError, onReady, sendYtCommand]);

  // When iframe loads, notify parent and initialize command connection
  const handleIframeLoad = () => {
    setIsLoaded(true);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1 }),
        '*'
      );
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
    }
  };

  // High-speed embed URL with controls=0, modestbranding=1, enablejsapi=1
  // Initialized with mute=0 so audio plays instantly from second 0 without 10s delay
  const initialMutedRef = useRef(isMuted);
  const embedUrl = useMemo(() => {
    const initialMute = initialMutedRef.current ? 1 : 0;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${initialMute}&playsinline=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`;
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
