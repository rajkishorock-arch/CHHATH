import React from 'react';
import { Search, X } from 'lucide-react';

interface MusicSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
}

export const MusicSearch: React.FC<MusicSearchProps> = ({
  searchQuery,
  setSearchQuery,
  resultCount
}) => {
  return (
    <div className="relative flex-1">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-amber-400/80 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="गीत, गायक या श्रेणी खोजें..."
          className="w-full pl-11 pr-24 py-3 rounded-2xl bg-stone-900/90 border border-amber-500/30 text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all font-mukta"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="खोज साफ़ करें"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-semibold text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            {resultCount} गीत
          </span>
        </div>
      </div>
    </div>
  );
};
