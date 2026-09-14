import React from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  FileText,
  ListMusic,
  Video,
  VideoOff,
  ChevronDown
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

export const ExpandedPlayerModal: React.FC = () => {
  const {
    isExpandedOpen,
    setIsExpandedOpen,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    isRepeat,
    favorites,
    showVideo,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleFavorite,
    toggleShuffle,
    toggleRepeat,
    setIsQueueOpen,
    setShowVideo,
    setLyricsSong
  } = useAudio();

  if (!isExpandedOpen || !currentSong) return null;

  const isFav = favorites.includes(currentSong.id);

  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-stone-950/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-300 font-mukta">
      
      {/* Top Bar: Down Chevron, Category, Video Toggle */}
      <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-4">
        <button
          onClick={() => setIsExpandedOpen(false)}
          className="p-2 rounded-full bg-stone-900 border border-amber-500/20 text-stone-300 hover:text-white transition-colors"
          title="प्लेयर बंद करें"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            छठ संगीत प्लेयर
          </span>
          {currentSong.category && (
            <p className="text-[11px] text-stone-400 truncate">{currentSong.category}</p>
          )}
        </div>

        <button
          onClick={() => setShowVideo(!showVideo)}
          className={`p-2 rounded-full border transition-all ${
            showVideo
              ? 'bg-amber-500 border-amber-400 text-stone-950'
              : 'bg-stone-900 border-amber-500/20 text-stone-300 hover:text-white'
          }`}
          title={showVideo ? "वीडियो छुपाएं" : "वीडियो देखें"}
        >
          {showVideo ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content: Large Album Art */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full my-4">
        
        {/* Album Artwork Frame */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-amber-500/40 mb-6 group">
          <img
            src={getImageUrl(currentSong.thumbnail)}
            alt={currentSong.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

          {/* Active EQ Bar overlay */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 flex items-end gap-1">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
              <div className="w-1.5 h-10 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
              <div className="w-1.5 h-4 bg-yellow-300 rounded-full animate-bounce [animation-delay:-0.6s]" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="w-full text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 truncate mb-1">
            {currentSong.title}
          </h2>
          <p className="text-sm sm:text-base text-amber-200/80 font-medium truncate">
            {currentSong.singer}
          </p>
        </div>

        {/* Seeker Bar */}
        <div className="w-full space-y-1 mb-6">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            className="w-full h-2 rounded-lg bg-stone-800 accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-stone-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-between w-full max-w-xs mb-6">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full transition-all ${
              isShuffle ? 'text-amber-400 bg-amber-500/20' : 'text-stone-400 hover:text-white'
            }`}
            title="शफ़ल (Shuffle)"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={playPrevious}
            className="p-3 rounded-full text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
            title="पिछला गीत"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center shadow-xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? "रोकें" : "बजाएं"}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-stone-950" />
            ) : (
              <Play className="w-8 h-8 fill-stone-950 ml-1" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-3 rounded-full text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
            title="अगला गीत"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 rounded-full transition-all ${
              isRepeat ? 'text-amber-400 bg-amber-500/20' : 'text-stone-400 hover:text-white'
            }`}
            title="दोहराएं (Repeat)"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 w-full max-w-xs px-4 py-2 rounded-2xl bg-stone-900/80 border border-amber-500/10 mb-6">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-stone-400 hover:text-amber-300"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 rounded-lg bg-stone-800 accent-amber-400 cursor-pointer"
          />
        </div>

      </div>

      {/* Bottom Secondary Actions Bar */}
      <div className="flex items-center justify-around w-full max-w-md mx-auto pt-4 border-t border-amber-500/20">
        <button
          onClick={() => toggleFavorite(currentSong.id)}
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            isFav ? 'text-rose-400' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
          <span>{isFav ? 'पसंदीदा' : 'पसंद करें'}</span>
        </button>

        {currentSong.lyrics && (
          <button
            onClick={() => setLyricsSong(currentSong)}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-stone-400 hover:text-amber-300"
          >
            <FileText className="w-5 h-5" />
            <span>गीत के बोल</span>
          </button>
        )}

        <button
          onClick={() => setIsQueueOpen(true)}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-stone-400 hover:text-amber-300"
        >
          <ListMusic className="w-5 h-5" />
          <span>कतार (Queue)</span>
        </button>
      </div>

    </div>
  );
};
