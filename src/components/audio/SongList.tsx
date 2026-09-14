import React from 'react';
import { Song } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Heart, FileText, Plus, Check } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

interface SongListProps {
  songs: Song[];
}

export const SongList: React.FC<SongListProps> = ({ songs }) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    favorites, 
    toggleFavorite, 
    setLyricsSong,
    queue,
    addToQueue 
  } = useAudio();

  const formatDuration = (val?: string | number) => {
    if (!val) return '3:45';
    if (typeof val === 'string') return val;
    const m = Math.floor(val / 60);
    const s = Math.floor(val % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (songs.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-stone-900/40 border border-amber-500/10">
        <p className="text-amber-300 font-bold text-base mb-1">कोई गाना नहीं मिला</p>
        <p className="text-xs text-stone-400">कृपया अपनी खोज या श्रेणी बदलें</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {songs.map((song, index) => {
        const isCurrent = currentSong?.id === song.id;
        const isFav = favorites.includes(song.id);
        const inQueue = queue.some(q => q.id === song.id);

        return (
          <div
            key={song.id}
            onClick={() => {
              if (isCurrent) {
                togglePlay();
              } else {
                playSong(song);
              }
            }}
            className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
              isCurrent
                ? 'bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-900/40 border-amber-400/60 shadow-lg shadow-amber-500/10 scale-[1.01]'
                : 'bg-stone-900/70 hover:bg-stone-850 border-amber-500/15 hover:border-amber-500/35'
            }`}
          >
            {/* Track Left Info: Index + Image + Title + Singer */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 mr-2">
              
              {/* Track Index or Playing Bar */}
              <div className="w-6 text-center text-xs font-bold text-stone-400 group-hover:text-amber-300 shrink-0">
                {isCurrent && isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-4">
                    <div className="w-1 bg-amber-400 h-3 animate-bounce [animation-delay:-0.2s]" />
                    <div className="w-1 bg-orange-400 h-4 animate-bounce" />
                    <div className="w-1 bg-yellow-300 h-2 animate-bounce [animation-delay:-0.4s]" />
                  </div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Artwork Thumbnail */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 shadow-md">
                <img
                  src={getImageUrl(song.thumbnail)}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
                  }}
                />
                
                {/* Play/Pause Hover Overlay */}
                <div className={`absolute inset-0 bg-stone-950/60 flex items-center justify-center transition-opacity ${
                  isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {isCurrent && isPlaying ? (
                    <Pause className="w-5 h-5 text-amber-300 fill-amber-300" />
                  ) : (
                    <Play className="w-5 h-5 text-amber-300 fill-amber-300 ml-0.5" />
                  )}
                </div>
              </div>

              {/* Song Title & Artist Details */}
              <div className="min-w-0 flex-1">
                <div className={`font-mukta font-bold text-sm sm:text-base truncate transition-colors ${
                  isCurrent ? 'text-amber-300' : 'text-stone-100 group-hover:text-amber-200'
                }`}>
                  {song.title}
                </div>
                <div className="text-xs text-stone-400 truncate flex items-center gap-2 mt-0.5 font-mukta">
                  <span className="truncate">{song.singer}</span>
                  {song.category && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400/90 font-semibold text-[11px] truncate">
                        {song.category}
                      </span>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Right Action Icons & Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Lyrics Button */}
              {song.lyrics && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLyricsSong(song);
                  }}
                  className="p-2 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                  title="गीत के बोल (Lyrics)"
                >
                  <FileText className="w-4 h-4" />
                </button>
              )}

              {/* Queue Add Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!inQueue) addToQueue(song);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  inQueue 
                    ? 'text-amber-400 opacity-60' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
                title={inQueue ? "कतार में मौजूद" : "कतार में जोड़ें"}
              >
                {inQueue ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              {/* Favorite Heart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song.id);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  isFav 
                    ? 'text-rose-500' 
                    : 'text-stone-400 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
                title={isFav ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Duration Tag */}
              <span className="hidden sm:inline-block text-xs font-semibold text-stone-400 ml-1 min-w-[36px] text-right font-mono">
                {formatDuration(song.duration)}
              </span>

            </div>

          </div>
        );
      })}
    </div>
  );
};
