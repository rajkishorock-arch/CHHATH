import React from 'react';
import { Music, Flame, Heart, Radio, Sparkles } from 'lucide-react';

interface MusicCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  favoritesCount: number;
}

export const MusicCategoryFilter: React.FC<MusicCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  favoritesCount
}) => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'सभी':
        return <Music className="w-4 h-4" />;
      case 'पसंदीदा':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'पारंपरिक':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'अर्घ्य':
        return <Radio className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`snap-start shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 border ${
              isSelected
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-amber-500/20 hover:border-amber-500/40'
            }`}
          >
            {getIcon(cat)}
            <span>{cat}</span>
            {cat === 'पसंदीदा' && favoritesCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                isSelected ? 'bg-stone-950 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
