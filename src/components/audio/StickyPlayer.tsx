import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Video, 
  VideoOff, 
  ExternalLink,
  X
} from 'lucide-react';

export const StickyPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = useAudio();
  
  // Video popup toggle: default false so audio plays smoothly without screen obstruction
  const [showVideo, setShowVideo] = useState(false);

  // Auto-collapse video to audio mode on page scroll, WITHOUT resetting or interrupting audio
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 35) {
        setShowVideo(false);
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!currentSong) return null;

  return (
    <>
      {/* 
        CRITICAL ARCHITECTURE: Single Persistent Iframe!
        We NEVER unmount this iframe when scrolling or clicking cut/close (✕).
        When showVideo is true -> floating PiP video box is visible.
        When showVideo is false -> shrinks to 1px offscreen without unmounting,
        so the audio continues playing seamlessly from the exact same second without restarting!
      */}
      {isPlaying && (currentSong.youtubeId || currentSong.playlistId) && (
        <div 
          key={currentSong.id}
          className={`fixed z-50 transition-all duration-300 font-mukta ${
            showVideo
              ? 'bottom-20 right-4 sm:right-8 w-72 sm:w-84 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] border border-amber-500/50 bg-stone-950 opacity-100 scale-100 pointer-events-auto'
              : 'bottom-0 right-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none scale-0'
          }`}
        >
          {/* Header bar with title and close / cut button */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-stone-900/95 border-b border-amber-500/20 text-xs">
            <span className="truncate max-w-[200px] text-amber-300 font-bold flex items-center gap-1.5">
              <span>{currentSong.isPlaylist ? '🎶' : '🎬'}</span>
              <span>{currentSong.title}</span>
            </span>
            <button 
              onClick={() => setShowVideo(false)}
              className="w-6 h-6 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              title="वीडियो बंद करें (गाना ऑडियो में चलता रहेगा)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Single Continuous Video/Playlist Iframe */}
          <div className={showVideo ? "h-44 sm:h-48 bg-black" : "w-1 h-1"}>
            <iframe
              src={
                currentSong.playlistId 
                  ? `https://www.youtube.com/embed/videoseries?list=${currentSong.playlistId}&autoplay=1&enablejsapi=1`
                  : `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&enablejsapi=1`
              }
              title={currentSong.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {showVideo && (
            <div className="px-3 py-1.5 text-[10px] text-stone-400 bg-stone-900/95 text-center border-t border-amber-500/10">
              <span>💡 {currentSong.isPlaylist ? 'प्लेलिस्ट के सभी गाने लगातार बजेंगे' : 'वीडियो काटने पर भी गीत ऑडियो में लगातार बजता रहेगा'}</span>
            </div>
          )}
        </div>
      )}

      {/* Sleek, Compact Bottom Music Player Bar */}
      <div 
        id="sticky-player" 
        className="fixed bottom-0 lg:bottom-4 left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:max-w-4xl z-40 bg-stone-900/98 text-stone-100 backdrop-blur-xl border-t lg:border border-amber-500/40 lg:rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-2.5 sm:px-5 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-3">
          
          {/* Song Info & Thumbnail */}
          <div className="flex items-center gap-3 min-w-0 max-w-[45%] sm:max-w-[40%]">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 shadow">
              <img 
                src={currentSong.thumbnail} 
                alt={currentSong.title}
                className="w-full h-full object-cover" 
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center gap-0.5">
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="font-mukta font-bold text-xs sm:text-sm text-amber-300 truncate">
                {currentSong.title}
              </div>
              <div className="text-[11px] text-stone-400 font-mukta truncate flex items-center gap-1.5">
                <span>{currentSong.singer}</span>
                <span>•</span>
                <span className="text-amber-500 font-semibold">{currentSong.language}</span>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={playPrevious}
              title="पिछला गीत (Previous)"
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? "रोकें (Pause)" : "बजाएं (Play)"}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 ml-0.5 fill-white" />}
            </button>

            <button
              onClick={playNext}
              title="अगला गीत (Next)"
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Video Toggle & YouTube Link */}
          <div className="flex items-center gap-2 shrink-0">
            {isPlaying && (currentSong.youtubeId || currentSong.playlistId) && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  showVideo 
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md scale-102' 
                    : 'bg-stone-800 text-amber-300 hover:bg-stone-700 border border-amber-500/30'
                }`}
                title={showVideo ? "वीडियो बंद करें (ऑडियो चलता रहेगा)" : "वीडियो देखें (वर्तमान समय से जारी रहेगा)"}
              >
                {showVideo ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{showVideo ? 'वीडियो बंद करें' : 'वीडियो देखें'}</span>
              </button>
            )}

            {(currentSong.youtubeId || currentSong.playlistId) && (
              <a
                href={
                  currentSong.playlistId 
                    ? `https://www.youtube.com/playlist?list=${currentSong.playlistId}`
                    : `https://www.youtube.com/watch?v=${currentSong.youtubeId}`
                }
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 transition-colors"
                title="YouTube पर खोलें"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
