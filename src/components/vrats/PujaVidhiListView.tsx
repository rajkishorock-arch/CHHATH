import React, { useState } from 'react';
import { ArrowLeft, Home, ChevronRight, Search, X } from 'lucide-react';
import { VRAT_DIRECTORY_LIST, VratDirectoryEntry } from '../../data/vratDirectoryList';
import { VratReadingPageView } from './VratReadingPageView';

interface PujaVidhiListViewProps {
  onBack: () => void;
  onGoHome: () => void;
  initialSelectedId?: string;
}

export const PujaVidhiListView: React.FC<PujaVidhiListViewProps> = ({
  onBack,
  onGoHome,
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
    item.englishTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If a vrat is selected, render the dedicated clean full-page reader with iOS slide-in animation!
  if (selectedEntry) {
    return (
      <VratReadingPageView
        entry={selectedEntry}
        initialTab="vidhi"
        onBack={() => setSelectedEntry(null)}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ed] text-[#451a03] animate-ios-slide-in flex flex-col pb-24">
      {/* 1. TOP HEADER (Exact Screenshot 1: Left Back Arrow, Center "पूजा विधि", Right Home Icon) */}
      <header className="sticky top-0 z-30 bg-[#fdf6ed]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Back Circular Button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
          </button>

          {/* Centered Page Title */}
          <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide">
            पूजा विधि
          </h1>

          {/* Home Circular Button */}
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

      {/* Optional Search */}
      <div className="max-w-md mx-auto w-full px-4 pt-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9a3412] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="पूजा या व्रत का नाम खोजें..."
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

      {/* 2. CORAL PILL LIST (Exact matching Screenshot 1 Design) */}
      <main className="max-w-md mx-auto w-full px-4 py-4 space-y-3.5 flex-1">
        {filteredList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedEntry(item)}
            className="group cursor-pointer flex items-center justify-between p-3 sm:p-3.5 rounded-3xl bg-gradient-to-r from-[#ff6b52] via-[#ff5858] to-[#ff4767] shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            {/* Left: Round Avatar + Title */}
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white p-1 shrink-0 shadow-inner flex items-center justify-center overflow-hidden">
                <img
                  src={item.avatarUrl}
                  alt={item.title}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-white font-bold text-base sm:text-lg font-serif truncate drop-shadow-xs">
                {item.title}
              </span>
            </div>

            {/* Right: Chevron White Icon */}
            <div className="p-1 shrink-0">
              <ChevronRight className="w-6 h-6 text-white stroke-[2.5] drop-shadow-xs group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="text-center py-12 text-[#9a3412] font-semibold text-sm">
            कोई पूजा विधि नहीं मिली।
          </div>
        )}
      </main>
    </div>
  );
};
