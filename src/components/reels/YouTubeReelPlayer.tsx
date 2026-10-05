import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Play } from 'lucide-react';

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

  // Record whether player was mounted for active reel or preloading
  const wasActiveOnMount = useRef(isActive);

  // Send direct command to YouTube HTML5 Player via postMessage
  const sendYtCommand = useCallback((func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch {}
  }, []);

  // Cleanup on unmount: immediately stop playback to release GPU / audio pipeline
  useEffect(() => {
    return () => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }),
            '*'
          );
        }
      } catch {}
    };
  }, []);

  // Sync Play / Pause and Mute state immediately when active status changes
  useEffect(() => {
    if (!isLoaded) return;
    if (isActive && isPlaying) {
      sendYtCommand('playVideo');
      if (!isMuted) {
        sendYtCommand('unMute');
        sendYtCommand('setVolume', [100]);
      } else {
        sendYtCommand('mute');
      }
    } else {
      sendYtCommand('pauseVideo');
      sendYtCommand('mute');
    }
  }, [isActive, isPlaying, isMuted, isLoaded, sendYtCommand]);

  // Listen for YouTube postMessage events (e.g. onError)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);
          if (data.event === 'onError') {
            setHasError(true);
            onPlaybackError?.(videoId, Number(data.info) || 100);
          }
        }
      } catch {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId, onPlaybackError]);

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
      sendYtCommand('playVideo');
      if (!isMuted) {
        setTimeout(() => {
          sendYtCommand('unMute');
          sendYtCommand('setVolume', [100]);
        }, 150);
      }
    } else {
      sendYtCommand('pauseVideo');
      sendYtCommand('mute');
    }
    onReady?.();
  };

  // High-speed embed URL with stable query parameters:
  // - If active at mount time, starts with autoplay=1 for immediate start
  // - If preloaded in background, starts with autoplay=0&mute=1 so it prepares quietly
  // - embedUrl remains strictly stable across active state changes so the iframe never reloads
  const embedUrl = useMemo(() => {
    const ap = wasActiveOnMount.current ? 1 : 0;
    const originParam = typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http')
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=${ap}&mute=1&playsinline=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0${originParam}`;
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
