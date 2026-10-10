import React, { useState } from 'react';
import { ArrowLeft, Home, ChevronRight, Search, X } from 'lucide-react';
import { VRAT_DIRECTORY_LIST, VratDirectoryEntry } from '../../data/vratDirectoryList';
import { VratReadingPageView } from './VratReadingPageView';
import { SeoHead } from '../seo/SeoHead';

interface MantraListViewProps {
  onBack: () => void;
  onGoHome?: () => void;
  initialSelectedId?: string;
}

export const MantraListView: React.FC<MantraListViewProps> = ({
  onBack,
  onGoHome = onBack,
  initialSelectedId
}) => {
  const [selectedEntry, setSelectedEntry] = useState<VratDirectoryEntry | null>(() => {
    if (initialSelectedId) {
      return VRAT_DIRECTORY_LIST.find(e => e.id === initialSelectedId) || null;
    }
    return null;
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = VRAT_DIRECTORY_LIST.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mantra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If a mantra is selected, render dedicated full-page reader with iOS slide-in animation
  if (selectedEntry) {
    return (
      <VratReadingPageView
        entry={selectedEntry}
        initialTab="mantra"
        onBack={() => setSelectedEntry(null)}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <div className="bg-[#fdf6ed] text-[#451a03] animate-ios-slide-in flex flex-col pb-3">
      <SeoHead
        title="वैदिक एवं पौराणिक मंत्र संग्रह | Vedic Mantras with Meaning - ChhathVibes"
        description="सूर्य गायत्री मंत्र, महामृत्युंजय मंत्र, गायत्री मंत्र, विष्णु व शिव स्तुति मंत्र सहित समस्त देवी-देवताओं के बीज मंत्र व अर्थ।"
        canonicalUrl="https://chhathvibes.vercel.app/mantra-list"
      />
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#fdf6ed]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
          </button>

          <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide">
            मंत्र
          </h1>

          <button
            onClick={onGoHome}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
            aria-label="होम स्क्रीन"
            title="होम"
          >
            <Home className="w-5 h-5 text-[#9a3412]" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-4 pt-3 md:pt-5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9a3412] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="मंत्र या देवता का नाम खोजें..."
            className="w-full pl-9 pr-8 py-2 bg-white/90 border border-[#fed7aa] rounded-full text-xs sm:text-sm text-[#451a03] placeholder-[#9a3412]/60 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9a3412]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CORAL PILL LIST (Multi-column on Desktop) */}
      <main className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-4 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
        {filteredList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedEntry(item)}
            className="group w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99] select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                <img
                  src={item.avatarUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                {item.title}
              </span>
            </div>

            <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
          </div>
        ))}
      </main>
    </div>
  );
};
