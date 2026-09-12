import React, { createContext, useContext, useState } from 'react';
import { Song } from '../types';
import { useChhathData } from './ChhathDataContext';
import { devotionalAudio } from '../utils/audioEngine';

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (vol: number) => void;
  ringBell: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { songs } = useChhathData();
  const [currentSong, setCurrentSong] = useState<Song | null>(() => songs[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.75);

  React.useEffect(() => {
    if (currentSong && !songs.some(s => s.id === currentSong.id)) {
      setCurrentSong(songs.length > 0 ? songs[0] : null);
      if (songs.length === 0) {
        setIsPlaying(false);
      }
    } else if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!isPlaying && !currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
    setIsPlaying(prev => !prev);
  };

  const playNext = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    devotionalAudio.setVolume(vol);
  };

  const ringBell = () => {
    devotionalAudio.ringTempleBell(587.33);
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        setVolume,
        ringBell
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
