import React from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ListMusic,
  Video,
  VideoOff,
  ChevronUp,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { getSpotifySongUrl } from '../../utils/spotifyUtils';

interface StickyPlayerProps {
  onOpenMixer?: () => void;
}

export const StickyPlayer: React.FC<StickyPlayerProps> = ({ onOpenMixer }) => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    showVideo,
    setShowVideo,
    setIsExpandedOpen,
    setIsQueueOpen,
    playbackError,
    clearPlaybackError
  } = useAudio();

  if (!currentSong) return null;

  const isErrorForCurrent = playbackError && (playbackError.songId === currentSong.id || playbackError.youtubeId === currentSong.youtubeId);

  return (
    <>
      {/* 
        Sleek Floating Mini-Player Bar
        - Mobile: bottom-16 (clears mobile bottom navigation bar)
        - Desktop: bottom-4 (floats centered)
      */}
      <div
        id="sticky-player"
        className="fixed bottom-16 lg:bottom-4 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:max-w-4xl z-30 px-2 sm:px-4 pointer-events-auto font-mukta space-y-1.5"
      >
        {/* Playback Embedding Error Banner */}
        {isErrorForCurrent && (
          <div className="bg-rose-950/95 border border-rose-500/50 text-rose-200 backdrop-blur-xl rounded-xl p-2 sm:px-4 flex items-center justify-between gap-2 text-xs shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span className="truncate">{playbackError.message}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {currentSong.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shadow"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>YouTube पर खोलें</span>
                </a>
              )}
              <button
                onClick={() => {
                  clearPlaybackError();
                  playNext();
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-[11px]"
              >
                अगला (Next) &rarr;
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/95 dark:bg-stone-950/95 text-stone-900 dark:text-stone-100 backdrop-blur-2xl border border-stone-200/90 dark:border-amber-500/35 rounded-2xl shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-2 sm:p-3 flex items-center justify-between gap-2 sm:gap-3 transition-all duration-300">
          
          {/* Song Info & Artwork -> Tapping opens Expanded Player */}
          <div
            onClick={() => setIsExpandedOpen(true)}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 cursor-pointer group"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 shadow">
              <img
                src={getImageUrl(currentSong.thumbnail)}
                alt={currentSong.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
                }}
              />
              {isPlaying && !isErrorForCurrent && (
                <div className="absolute inset-0 bg-stone-950/50 flex items-center justify-center gap-0.5">
                  <div className="w-1 bg-amber-400 h-3 animate-bounce [animation-delay:-0.2s]" />
                  <div className="w-1 bg-orange-400 h-4 animate-bounce" />
                  <div className="w-1 bg-yellow-300 h-2 animate-bounce [animation-delay:-0.4s]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-amber-300 truncate group-hover:text-amber-600 dark:group-hover:text-amber-200 flex items-center gap-1.5">
                <span className="truncate">{currentSong.title}</span>
                <ChevronUp className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 opacity-70 group-hover:opacity-100 shrink-0" />
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate flex items-center gap-1.5">
                <span className="truncate">{currentSong.singer}</span>
                {currentSong.language && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{currentSong.language}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={playPrevious}
              className="p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              title="पिछला गीत"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "रोकें" : "बजाएं"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-stone-950" />
              ) : (
                <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              title="अगला गीत"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Queue & Video Toggles */}
          <div className="flex items-center gap-1 shrink-0 border-l border-stone-200 dark:border-amber-500/20 pl-2">
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={`p-2 rounded-xl transition-all ${
                showVideo
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40'
                  : 'text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
              title={showVideo ? "वीडियो छुपाएं" : "वीडियो देखें"}
            >
              {showVideo ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsQueueOpen(true)}
              className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              title="कतार देखें (Queue)"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* Spotify Direct Button */}
            <a
              href={getSpotifySongUrl(currentSong)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-[#1DB954] hover:bg-[#1DB954]/15 transition-colors flex items-center justify-center shrink-0"
              title="Spotify पर सुनें (बैकग्राउंड व स्क्रीन ऑफ सपोर्ट)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.467-1.027.25-2.815-1.72-6.358-2.108-10.533-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.568-1.043 8.49-.607 11.645 1.339.353.217.467.674.25 1.027zm1.467-3.26c-.272.443-.847.585-1.29.313-3.224-1.982-8.14-2.556-11.954-1.398-.498.151-1.028-.135-1.18-.633-.151-.498.135-1.028.633-1.18 4.364-1.324 9.778-.684 13.478 1.598.443.272.585.847.313 1.3zm.126-3.41C15.226 8.35 8.847 8.14 5.15 9.262c-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.218.75-1.398 4.24-1.288 11.285-1.045 15.748 1.604.53.315.703 1.002.388 1.533-.315.53-1.002.703-1.533.388z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>
    </>
  );
};
