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

  // Send direct command to YouTube HTML5 Player via postMessage (dual-format for universal WebView compatibility)
  const sendYtCommand = useCallback((func: string, args: any[] = []) => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (win) {
        win.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
        win.postMessage(JSON.stringify({ event: 'command', func, args, id: 1 }), '*');
      }
    } catch {}
  }, []);

  // Cleanup on unmount: immediately stop playback to release GPU / audio pipeline
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
        // Instant start: rewind to 0 of the pre-buffered stream and unmute
        sendYtCommand('seekTo', [0, true]);
        sendYtCommand('playVideo');
        if (!isMuted) {
          sendYtCommand('unMute');
          sendYtCommand('setVolume', [100]);
        } else {
          sendYtCommand('mute');
        }
      } else {
        sendYtCommand('pauseVideo');
      }
    } else {
      // Offscreen: immediately pause and mute so zero audio/bandwidth leaks
      sendYtCommand('pauseVideo');
      sendYtCommand('mute');
    }
  }, [isActive, isPlaying, isMuted, sendYtCommand]);

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

    if (isActive) {
      if (isPlaying) {
        sendYtCommand('seekTo', [0, true]);
        sendYtCommand('playVideo');
        if (!isMuted) {
          setTimeout(() => {
            sendYtCommand('unMute');
            sendYtCommand('setVolume', [100]);
          }, 100);
        }
      }
    } else {
      // Background pre-warming: let video buffer initial DASH chunks for 1.2s, then hold at 0:00
      setTimeout(() => {
        if (!isActive) {
          sendYtCommand('pauseVideo');
          sendYtCommand('seekTo', [0, true]);
          sendYtCommand('mute');
        }
      }, 1200);
    }
    onReady?.();
  };

  // High-speed embed URL: ALWAYS starts with autoplay=1&mute=1 so YouTube eagerly buffers
  // video stream chunks immediately without waiting for user action. No origin restriction to
  // ensure postMessage works unconditionally in Android Capacitor WebViews.
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
