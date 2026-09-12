import React from 'react';

interface SectionDividerProps {
  symbol?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ symbol = '🪔' }) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 sm:my-10 flex items-center justify-center pointer-events-none select-none">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-amber-500/60" />
      <div className="mx-4 px-3 py-1 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-400 text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5">
        <span className="text-[10px] text-amber-500/60 font-serif">卐</span>
        <span>{symbol}</span>
        <span className="text-[10px] text-amber-500/60 font-serif">卐</span>
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/60 via-amber-500/30 to-transparent" />
    </div>
  );
};
