import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface InstagramReelPlayerProps {
  shortcode: string;
  instagramUrl?: string;
  title?: string;
  isActive: boolean;
  isMuted: boolean;
  onPlaybackError?: (shortcode: string, errorCode: number) => void;
  onReady?: () => void;
}

export const InstagramReelPlayer: React.FC<InstagramReelPlayerProps> = ({
  shortcode,
  instagramUrl,
  title,
  isActive,
  isMuted,
  onPlaybackError,
  onReady
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Clean embed URL with minimal UI
  const embedSrc = `https://www.instagram.com/reel/${shortcode}/embed/`;

  const handleIframeLoad = () => {
    setIsLoaded(true);
    onReady?.();
  };

  const handleIframeError = () => {
    setHasError(true);
    onPlaybackError?.(shortcode, 100);
  };

  if (hasError) {
    return (
      <div className="relative w-full h-full bg-stone-950 flex flex-col items-center justify-center text-amber-300">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mukta opacity-75">पावन रील लोड हो रही है...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Background devotional skeleton spinner while iframe loads */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 z-10">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-3" />
          <span className="text-xs font-mukta text-amber-300/80">छठ पावन रील लोड हो रही है...</span>
        </div>
      )}

      {/* Frame for Instagram Reel */}
      <iframe
        key={shortcode}
        src={embedSrc}
        title={title || 'Instagram Chhath Reel'}
        className="w-full h-full border-0 object-cover scale-[1.02] pointer-events-auto"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          minHeight: '100%',
          width: '100%'
        }}
      />
    </div>
  );
};
