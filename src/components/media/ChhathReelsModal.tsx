import React, { useEffect } from 'react';
import { useReels } from '../../context/ReelsContext';

export const ChhathReelsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { reelsPlatformOpen, openReelsPlatform } = useReels();

  useEffect(() => {
    if (isOpen && !reelsPlatformOpen) {
      openReelsPlatform('explore');
      onClose();
    }
  }, [isOpen, reelsPlatformOpen, openReelsPlatform, onClose]);

  return null;
};
