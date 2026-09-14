import React from 'react';
import { UserCheck, Users } from 'lucide-react';

interface PopularArtistsFilterProps {
  singers: string[];
  selectedSinger: string;
  onSelectSinger: (singer: string) => void;
}

export const PopularArtistsFilter: React.FC<PopularArtistsFilterProps> = ({
  singers,
  selectedSinger,
  onSelectSinger
}) => {
  if (singers.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
        <span className="flex items-center gap-1.5 text-amber-300">
          <Users className="w-3.5 h-3.5" />
          <span>लोकप्रिय गायक (Popular Artists)</span>
        </span>
        {selectedSinger && (
          <button
            onClick={() => onSelectSinger('')}
            className="text-amber-400 hover:underline text-[11px]"
          >
            सभी गायक देखें
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
        <button
          onClick={() => onSelectSinger('')}
          className={`snap-start shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            !selectedSinger
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          सभी (All)
        </button>

        {singers.map((singer) => {
          const isSelected = selectedSinger === singer;
          return (
            <button
              key={singer}
              onClick={() => onSelectSinger(isSelected ? '' : singer)}
              className={`snap-start shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold border-amber-300 shadow-md'
                  : 'bg-stone-900/80 border-amber-500/20 text-stone-300 hover:border-amber-500/40 hover:text-white'
              }`}
            >
              {isSelected && <UserCheck className="w-3.5 h-3.5" />}
              <span>{singer}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
