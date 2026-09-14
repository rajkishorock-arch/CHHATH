import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { X, Play, Pause, Trash2, ChevronUp, ChevronDown, ListMusic, Music } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

export const PlaybackQueueModal: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    currentIndex,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    removeFromQueue,
    moveQueueItem
  } = useAudio();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex justify-end transition-opacity duration-300">
      
      {/* Backdrop Click to Close */}
      <div 
        className="flex-1 cursor-pointer" 
        onClick={() => setIsQueueOpen(false)} 
      />

      {/* Queue Drawer Container */}
      <div className="w-full max-w-md bg-stone-950 border-l border-amber-500/30 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-500/20 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-base">
            <ListMusic className="w-5 h-5 text-amber-400" />
            <span>प्लेबैक कतार (Queue)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              {queue.length} गीत
            </span>
          </div>
          <button
            onClick={() => setIsQueueOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-amber-500/20">
          {queue.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <Music className="w-12 h-12 mx-auto mb-2 opacity-40 text-amber-400" />
              <p className="font-bold">कतार खाली है</p>
            </div>
          ) : (
            queue.map((song, idx) => {
              const isCurrent = idx === currentIndex || currentSong?.id === song.id;

              return (
                <div
                  key={`${song.id}-${idx}`}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-950/70 border-amber-400/60 text-amber-200'
                      : 'bg-stone-900/60 border-amber-500/15 hover:border-amber-500/30 text-stone-200'
                  }`}
                >
                  {/* Left: Reorder Buttons */}
                  <div className="flex flex-col gap-0.5 mr-2 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveQueueItem(idx, idx - 1)}
                      className="p-1 text-stone-400 hover:text-amber-300 disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
                      title="ऊपर करें"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === queue.length - 1}
                      onClick={() => moveQueueItem(idx, idx + 1)}
                      className="p-1 text-stone-400 hover:text-amber-300 disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
                      title="नीचे करें"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail & Title */}
                  <div
                    onClick={() => {
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        playSong(song);
                      }
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                      <img
                        src={getImageUrl(song.thumbnail)}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
                        }}
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-amber-300 fill-amber-300" />
                          ) : (
                            <Play className="w-4 h-4 text-amber-300 fill-amber-300 ml-0.5" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`font-mukta font-bold text-xs sm:text-sm truncate ${
                        isCurrent ? 'text-amber-300' : 'text-stone-200'
                      }`}>
                        {song.title}
                      </div>
                      <div className="text-[11px] text-stone-400 truncate">
                        {song.singer}
                      </div>
                    </div>
                  </div>

                  {/* Right Remove Button */}
                  <button
                    onClick={() => removeFromQueue(idx)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 ml-2"
                    title="कतार से हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-500/20 bg-stone-900/90 text-center">
          <p className="text-xs text-stone-400">
            गाने ऊपर-नीचे करने के लिए तीर (↑ ↓) का उपयोग करें
          </p>
        </div>

      </div>

    </div>
  );
};
