import React, { useState } from 'react';
import { ArrowLeft, Home, Landmark, MapPin, Clock, Calendar, Sparkles } from 'lucide-react';
import { FAMOUS_TEMPLES_DATA, TempleItem } from '../../data/famousTemplesData';

interface FamousTemplesListViewProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const FamousTemplesListView: React.FC<FamousTemplesListViewProps> = ({ 
  onBack,
  onGoHome = onBack 
}) => {
  const [selectedTemple, setSelectedTemple] = useState<TempleItem | null>(null);

  // If a temple is selected, render a clean dedicated full page view with iOS slide-in animation!
  if (selectedTemple) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] text-[#451a03] animate-ios-slide-in flex flex-col pb-24">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#fffaf5]/95 backdrop-blur-md border-b border-[#fed7aa]/60 shadow-xs px-3 sm:px-4 py-2.5">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <button
              onClick={() => setSelectedTemple(null)}
              className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
              aria-label="वापस जाएं"
              title="वापस"
            >
              <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
            </button>

            <div className="flex-1 text-center min-w-0 px-2">
              <h1 className="font-serif font-black text-lg sm:text-xl text-[#7c2d12] truncate">
                {selectedTemple.hindiName}
              </h1>
              <p className="text-[11px] text-[#9a3412]/80 truncate font-mukta font-bold">
                {selectedTemple.location}
              </p>
            </div>

            <button
              onClick={onGoHome}
              className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
              aria-label="होम स्क्रीन"
              title="होम स्क्रीन"
            >
              <Home className="w-5 h-5 text-[#9a3412]" />
            </button>
          </div>
        </header>

        {/* Temple Image Hero */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
          <img
            src={selectedTemple.image}
            alt={selectedTemple.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white max-w-xl mx-auto">
            <span className="px-2.5 py-1 rounded-full bg-[#ea580c] text-white text-xs font-bold shadow-xs">
              {selectedTemple.state}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif mt-1.5 drop-shadow-md">
              {selectedTemple.hindiName}
            </h2>
            <p className="text-xs sm:text-sm text-amber-200 mt-1 flex items-center drop-shadow-xs">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#fbbf24]" />
              ईष्ट देव: {selectedTemple.deity} • {selectedTemple.location}
            </p>
          </div>
        </div>

        {/* Full Details Content */}
        <main className="max-w-xl mx-auto w-full px-4 py-5 space-y-4 flex-1">
          <div className="p-4 bg-[#fff7ed] rounded-3xl border border-[#fed7aa] shadow-xs">
            <h4 className="text-xs font-bold text-[#9a3412] uppercase tracking-wider mb-1 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-[#ea580c]" />
              तीर्थ का महत्व व महात्म्य
            </h4>
            <p className="leading-relaxed font-serif text-[#451a03] text-sm sm:text-base pt-1">
              {selectedTemple.significance}
            </p>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-[#fed7aa]/70 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-[#78350f] uppercase tracking-wider flex items-center">
              <Landmark className="w-4 h-4 mr-1.5 text-[#ea580c]" />
              ऐतिहासिक व पौराणिक पृष्ठभूमि
            </h4>
            <p className="leading-relaxed text-[#292524] text-sm font-serif">
              {selectedTemple.history}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#fff7ed] to-[#ffedd5] rounded-3xl border border-[#fed7aa] shadow-xs">
            <h4 className="text-xs font-bold text-[#9a3412] uppercase tracking-wider mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-[#ea580c]" />
              नित्य आरती व दर्शन समय
            </h4>
            <p className="text-sm font-bold text-[#7c2d12]">
              {selectedTemple.aartiTimings}
            </p>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-[#fed7aa]/70 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-[#78350f] uppercase tracking-wider flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-[#ea580c]" />
              प्रमुख उत्सव व महापर्व
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedTemple.majorFestivals.map((fest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#fff7ed] border border-[#fed7aa] rounded-full text-xs font-bold text-[#9a3412]"
                >
                  {fest}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ed] text-[#451a03] animate-ios-slide-in flex flex-col pb-24">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-[#fdf6ed]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
          </button>

          <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide">
            प्रसिद्ध मंदिर
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

      {/* Grid of Famous Temples */}
      <main className="max-w-md mx-auto w-full px-4 py-4 space-y-3.5 flex-1">
        {FAMOUS_TEMPLES_DATA.map(temple => (
          <div
            key={temple.id}
            onClick={() => setSelectedTemple(temple)}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#fed7aa] shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={temple.image}
                alt={temple.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ea580c] font-bold">
                  {temple.state}
                </span>
                <h3 className="text-base font-bold font-serif mt-1 truncate">
                  {temple.hindiName}
                </h3>
                <p className="text-[11px] text-[#fef3c7] truncate">
                  {temple.location}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#fefaf6] flex items-center justify-between border-t border-[#fed7aa]/40">
              <span className="text-xs font-semibold text-[#78350f] truncate">
                {temple.deity}
              </span>
              <span className="text-xs font-bold text-[#ea580c] shrink-0">
                दर्शन व विवरण →
              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
