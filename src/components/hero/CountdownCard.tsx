import React from 'react';
import { LiveFestivalExperience } from './LiveFestivalExperience';

interface CountdownCardProps {
  onNavigate?: (tab: string) => void;
  overrideDate?: Date | string;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ onNavigate, overrideDate }) => {
  return (
    <div id="live-experience" className="w-full">
      <LiveFestivalExperience onNavigate={onNavigate} overrideDate={overrideDate} />
    </div>
  );
};
