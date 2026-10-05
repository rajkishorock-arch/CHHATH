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
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);
          if (data.event === 'onError') {
            setHasError(true);
            onPlaybackError?.(videoId, Number(data.info) || 100);
          }
          if (data.event === 'infoDelivery' && data.info) {
            if (data.info.playerState === 1) { // 1 = PLAYING
              onReady?.();
            }
          }
        }
      } catch {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId, onPlaybackError, onReady]);

  // When iframe loads, notify parent and initialize command connection
  const handleIframeLoad = () => {
    setIsLoaded(true);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    } catch {}

    if (isActive && isPlaying) {
      sendYtCommand('playVideo', []);
      if (!isMuted) {
        setTimeout(() => {
          sendYtCommand('unMute', []);
          sendYtCommand('setVolume', [100]);
        }, 150);
      }
    }
    onReady?.();
  };

  // High-speed embed URL with controls=0, modestbranding=1, enablejsapi=1
  // Autoplay=1 guarantees instant playback without stalling on black screen
  const embedUrl = useMemo(() => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`;
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
        style={{
          transform: 'scale(1.35)',
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
};
