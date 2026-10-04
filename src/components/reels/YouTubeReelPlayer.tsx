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

  // Sync Play / Pause state
  useEffect(() => {
    if (!isLoaded) return;
    if (isActive && isPlaying) {
      sendYtCommand('playVideo');
    } else {
      sendYtCommand('pauseVideo');
    }
  }, [isActive, isPlaying, isLoaded, sendYtCommand]);

  // Sync Mute / Unmute state
  useEffect(() => {
    if (!isLoaded) return;
    if (isMuted) {
      sendYtCommand('mute');
    } else {
      sendYtCommand('unMute');
      sendYtCommand('setVolume', [100]);
    }
  }, [isMuted, isLoaded, sendYtCommand]);

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

  // When iframe loads, notify parent and unmute if sound is enabled
  const handleIframeLoad = () => {
    setIsLoaded(true);
    if (!isMuted) {
      setTimeout(() => {
        sendYtCommand('unMute');
        sendYtCommand('setVolume', [100]);
      }, 250);
    }
    onReady?.();
  };

  // High-speed embed URL: starts with mute=1 for guaranteed zero-block instant autoplay
  const embedUrl = useMemo(() => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`;
  }, [videoId]);

  if (hasError) {
    return (
      <div className="relative w-full h-full bg-stone-950 flex flex-col items-center justify-center text-amber-300">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mukta opacity-75">पावन दर्शन लोड हो रहा है...</p>
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
