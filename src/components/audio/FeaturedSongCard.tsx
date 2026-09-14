import React from 'react';
import { Song } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Heart, FileText, Share2, Sparkles, Volume2 } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

interface FeaturedSongCardProps {
  song: Song;
}

export const FeaturedSongCard: React.FC<FeaturedSongCardProps> = ({ song }) => {
  const { currentSong, isPlaying, playSong, togglePlay, favorites, toggleFavorite, setLyricsSong } = useAudio();
  const isCurrent = currentSong?.id === song.id;
  const isFav = favorites.includes(song.id);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${song.title} - ${song.singer}`,
        text: `Listen to ${song.title} on Chhath Mahaparv 2026`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('लिंक कॉपी हो गया!');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/80 via-stone-900/90 to-amber-900/40 border border-amber-500/30 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl group transition-all duration-300 hover:border-amber-500/50">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-orange-600/20 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        
        {/* Album Artwork with Hover Effect & EQ animation */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-amber-400/30 group-hover:scale-[1.02] transition-transform duration-300">
          <img
            src={getImageUrl(song.thumbnail)}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

          {/* Playing Equalizer Overlay */}
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-10 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
              <div className="w-1.5 h-14 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
              <div className="w-1.5 h-8 bg-yellow-300 rounded-full animate-bounce [animation-delay:-0.6s]" />
              <div className="w-1.5 h-12 bg-amber-500 rounded-full animate-bounce" />
            </div>
          )}

          {/* Quick Play Button Overlay */}
          <button
            onClick={handlePlayClick}
            aria-label={isCurrent && isPlaying ? "Pause song" : "Play song"}
            className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950" />
            ) : (
              <Play className="w-6 h-6 ml-0.5 fill-stone-950" />
            )}
          </button>

          {/* Featured Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500/90 text-stone-950 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>विशेष गीत</span>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{song.category || 'प्रसिद्ध छठ गीत'} • {song.language || 'भोजपुरी'}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 mb-1 truncate leading-tight">
            {song.title}
          </h3>

          <p className="text-sm sm:text-base text-amber-100/80 font-medium mb-3 truncate">
            गायक: <span className="text-amber-300 font-bold">{song.singer}</span>
          </p>

          {song.description && (
            <p className="text-xs sm:text-sm text-stone-300/80 line-clamp-2 mb-5 max-w-xl font-mukta leading-relaxed">
              {song.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handlePlayClick}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-98 transition-all"
            >
              {isCurrent && isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-stone-950" />
                  <span>रुकें (Pause)</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                  <span>अभी सुनें (Play Now)</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleFavorite(song.id)}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-sm font-semibold ${
                isFav
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-stone-900/60 border-amber-500/20 text-stone-300 hover:border-amber-500/40 hover:text-white'
              }`}
              title={isFav ? "पसंदीदा से हटाएं" : "पसंदीदा में जोड़ें"}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'पसंदीदा' : 'पसंद करें'}</span>
            </button>

            {song.lyrics && (
              <button
                onClick={() => setLyricsSong(song)}
                className="p-3 rounded-2xl bg-stone-900/60 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all flex items-center gap-2 text-sm font-semibold"
                title="बोल (Lyrics) देखें"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:inline">गीत के बोल</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-stone-900/60 border border-amber-500/20 text-stone-300 hover:text-white hover:border-amber-500/40 transition-all"
              title="शेयर करें"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
