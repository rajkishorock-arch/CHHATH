import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Bell, BookOpen, Flame, Sparkles, Clock, 
  ChevronRight, Calendar, ArrowRight, X, ChevronLeft, Landmark, Heart
} from 'lucide-react';
import { ALL_VRATS_DATA, VratItem } from '../../data/allVratsData';
import { ALL_AARTIS_DATA } from '../../data/allAartisData';
import { CHALISA_PAATH_DATA } from '../../data/chalisaPaathData';
import { VratDetailModal } from './VratDetailModal';
import { DailyPujaAlarmModal } from './DailyPujaAlarmModal';
import { DigitalJapMalaModal } from './DigitalJapMalaModal';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface AllVratsHubProps {
  onNavigateToKatha?: () => void;
  onNavigateToAarti?: (title?: string) => void;
  onNavigateToChalisa?: () => void;
  onNavigateToTemples?: () => void;
  onNavigateToVichar?: () => void;
  onBackToHome?: () => void;
}

export const AllVratsHub: React.FC<AllVratsHubProps> = ({
  onNavigateToKatha,
  onNavigateToAarti,
  onNavigateToChalisa,
  onNavigateToTemples,
  onNavigateToVichar,
  onBackToHome
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedVrat, setSelectedVrat] = useState<VratItem | null>(null);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isJapMalaOpen, setIsJapMalaOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Featured upcoming festivals for banner carousel
  const carouselVrats = useMemo(() => {
    return ALL_VRATS_DATA.slice(0, 5);
  }, []);

  // Auto rotate carousel every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % carouselVrats.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [carouselVrats.length]);

  // Global search matching vrats, aartis, and chalisas
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const query = searchTerm.toLowerCase().trim();

    const matchedVrats = ALL_VRATS_DATA.filter(v =>
      v.hindiName.toLowerCase().includes(query) ||
      v.name.toLowerCase().includes(query) ||
      v.deity.toLowerCase().includes(query) ||
      v.vratKatha.title.toLowerCase().includes(query)
    );

    const matchedAartis = ALL_AARTIS_DATA.filter(a =>
      a.hindiTitle.toLowerCase().includes(query) ||
      a.deity.toLowerCase().includes(query) ||
      a.title.toLowerCase().includes(query)
    );

    const matchedChalisas = CHALISA_PAATH_DATA.filter(c =>
      c.hindiTitle.toLowerCase().includes(query) ||
      c.deity.toLowerCase().includes(query)
    );

    return {
      vrats: matchedVrats,
      aartis: matchedAartis,
      chalisas: matchedChalisas,
      totalCount: matchedVrats.length + matchedAartis.length + matchedChalisas.length
    };
  }, [searchTerm]);

  // Filtered Vrats for the directory
  const filteredVrats = useMemo(() => {
    return ALL_VRATS_DATA.filter(item => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'major') return item.category === 'major';
      if (activeCategory === 'monthly') return item.category === 'monthly';
      if (activeCategory === 'goddess') return item.category === 'goddess';
      if (activeCategory === 'shiva_vishnu') return item.category === 'shiva' || item.category === 'vishnu';
      return true;
    });
  }, [activeCategory]);

  return (
    <div className="bg-[#fdf6ee] text-[#451a03] pb-3">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                title="मुख्य पृष्ठ पर जाएं"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl">🪔</span>
                <h1 className="text-lg sm:text-xl font-black font-serif text-gray-900 tracking-tight">
                  सनातन व्रत एवं महापर्व
                </h1>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                समस्त भारतीय पर्व, व्रत कथा, पूजा विधि, शुभ मुहूर्त एवं आरती
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAlarmModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all text-xs font-bold flex items-center space-x-1.5"
              title="दैनिक पूजा अलार्म"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">पूजा अलार्म</span>
            </button>

            <button
              onClick={() => setIsJapMalaOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-all text-xs font-bold flex items-center space-x-1.5"
              title="108 डिजिटल जप माला"
            >
              <span>📿</span>
              <span className="hidden sm:inline">जप माला</span>
            </button>

            <button
              onClick={() => spiritualAudio.playTempleBell()}
              className="p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-amber-50 hover:border-amber-300 text-gray-700 transition-all"
              title="मंदिर की पावन घंटी बजाएं"
            >
              🔔
            </button>
          </div>
        </div>

        {/* Global Search Bar (Matching Screenshot 2: "पूजा, आरती, मंत्र खोजें") */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="पूजा, आरती, मंत्र, व्रत कथा या सामग्री खोजें..."
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-5 space-y-7">
        {/* Real-time Search Results View (If query is active) */}
        {searchResults && (
          <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-lg space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center">
                <Search className="w-4 h-4 mr-2 text-amber-600" />
                "{searchTerm}" के लिए परिणाम ({searchResults.totalCount})
              </h2>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                खोज बंद करें ✕
              </button>
            </div>

            {searchResults.totalCount === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                कोई परिणाम नहीं मिला। कृपया किसी अन्य नाम या शब्द से खोजें।
              </p>
            ) : (
              <div className="space-y-4">
                {/* Vrats Results */}
                {searchResults.vrats.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                      पर्व एवं व्रत ({searchResults.vrats.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {searchResults.vrats.map(v => (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVrat(v)}
                          className="p-3 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-900 font-serif">{v.hindiName}</p>
                            <p className="text-xs text-gray-500">{v.deity} • {v.date2026}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aartis Results */}
                {searchResults.aartis.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">
                      आरतियां ({searchResults.aartis.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {searchResults.aartis.map(a => (
                        <div
                          key={a.id}
                          onClick={() => onNavigateToAarti && onNavigateToAarti(a.hindiTitle)}
                          className="p-3 rounded-2xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-900 font-serif">{a.hindiTitle}</p>
                            <p className="text-xs text-gray-500">{a.deity}</p>
                          </div>
                          <span className="text-xs font-bold text-orange-600">आरती पढ़ें →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chalisas Results */}
                {searchResults.chalisas.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                      चालीसा व नित्य पाठ ({searchResults.chalisas.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {searchResults.chalisas.map(c => (
                        <div
                          key={c.id}
                          onClick={() => onNavigateToChalisa && onNavigateToChalisa()}
                          className="p-3 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-900 font-serif">{c.hindiTitle}</p>
                            <p className="text-xs text-gray-500">{c.deity} • {c.versesCount}</p>
                          </div>
                          <span className="text-xs font-bold text-amber-600">पाठ पढ़ें →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 1. Upcoming Mahaparv Banner Carousel */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-amber-200 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white min-h-[175px] sm:min-h-[200px] flex items-center">
          {carouselVrats.map((item, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-between p-5 sm:p-7 ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

                <div className="relative z-10 max-w-lg space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>आगामी महापर्व 2026</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-wide">
                    {item.hindiName}
                  </h2>

                  <p className="text-xs sm:text-sm text-amber-100 font-medium line-clamp-2">
                    {item.shortDesc}
                  </p>

                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedVrat(item)}
                      className="px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
                    >
                      <span>पूजा विधि एवं कथा</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-amber-200 font-semibold">
                      📅 {item.date2026}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carousel dots */}
          <div className="absolute bottom-3 right-5 z-20 flex items-center space-x-1.5">
            {carouselVrats.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlideIndex ? 'w-6 bg-white' : 'bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 2. Daily Puja Alarm Banner (Matching Screenshot 2: "दैनिक पूजा अलार्म") */}
        <div 
          onClick={() => setIsAlarmModalOpen(true)}
          className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all border border-amber-300"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Bell className="w-6 h-6 text-white animate-swing" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg font-serif">दैनिक पूजा अलार्म</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">नित्य स्मरण</span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                प्रातः ब्रह्म मुहूर्त एवं सायं संध्या महाआरती का नित्य समय स्मरण सेट करें
              </p>
            </div>
          </div>

          <button 
            type="button"
            className="px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors shadow-sm shrink-0 whitespace-nowrap ml-2"
          >
            अलार्म सेट करें
          </button>
        </div>

        {/* 3. Six Core Category Cards (Matching Screenshot 2 Grid) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-bold font-serif text-gray-900 flex items-center">
              <span className="text-xl mr-2">🌸</span>
              प्रमुख सनातन स्तंभ
            </h2>
            <span className="text-xs text-gray-500">सभी श्रेणी व विधान</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {/* 1. पूजा विधि */}
            <div
              onClick={() => {
                const first = ALL_VRATS_DATA[0];
                setSelectedVrat(first);
              }}
              className="group p-4 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  📜
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900 group-hover:text-amber-600 transition-colors">
                    पूजा विधि
                  </h3>
                  <p className="text-[11px] text-gray-500">शास्त्रोक्त नियम</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-amber-600 flex items-center justify-end">
                देखें <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>

            {/* 2. व्रत कथा */}
            <div
              onClick={onNavigateToKatha}
              className="group p-4 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900 group-hover:text-amber-600 transition-colors">
                    व्रत कथा
                  </h3>
                  <p className="text-[11px] text-gray-500">पौराणिक कथाएं</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-orange-600 flex items-center justify-end">
                पढ़ें <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>

            {/* 3. आरती */}
            <div
              onClick={() => onNavigateToAarti && onNavigateToAarti()}
              className="group p-4 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🪔
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900 group-hover:text-amber-600 transition-colors">
                    आरती संग्रह
                  </h3>
                  <p className="text-[11px] text-gray-500">नित्य व संध्या आरती</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-amber-600 flex items-center justify-end">
                गाएं <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>

            {/* 4. पूजन सामग्री */}
            <div
              onClick={() => {
                const first = ALL_VRATS_DATA[0];
                setSelectedVrat(first);
              }}
              className="group p-4 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🧺
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900 group-hover:text-emerald-600 transition-colors">
                    पूजन सामग्री
                  </h3>
                  <p className="text-[11px] text-gray-500">चेकलिस्ट व सूची</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end">
                सूची <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>

            {/* 5. मंत्र व चालीसा */}
            <div
              onClick={onNavigateToChalisa}
              className="group p-4 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🕉️
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900 group-hover:text-indigo-600 transition-colors">
                    चालीसा व मंत्र
                  </h3>
                  <p className="text-[11px] text-gray-500">हनुमान, शिव, देवी</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 flex items-center justify-end">
                पाठ <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>

            {/* 6. प्रसिद्ध मंदिर */}
            <div
              onClick={onNavigateToTemples}
              className="group p-4 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900 group-hover:text-rose-600 transition-colors">
                    प्रसिद्ध मंदिर
                  </h3>
                  <p className="text-[11px] text-gray-500">तीर्थ व दर्शन</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-rose-600 flex items-center justify-end">
                दर्शन <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* 4. Quick Spiritual Widget Bar (108 Jap Mala & Shubh Vichar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Digital Mala Pill */}
          <div
            onClick={() => setIsJapMalaOpen(true)}
            className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all shadow-sm group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl group-hover:scale-110 transition-transform">📿</span>
              <div>
                <h3 className="font-bold text-sm text-gray-900 font-serif">डिजिटल 108 जप माला</h3>
                <p className="text-xs text-amber-800">मंत्र जाप काउंटर, घंटी ध्वनि व हॅप्टिक स्पर्श</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm">
              जाप करें
            </button>
          </div>

          {/* Shubh Vichar Pill */}
          <div
            onClick={onNavigateToVichar}
            className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl border border-orange-200 flex items-center justify-between cursor-pointer hover:border-orange-400 transition-all shadow-sm group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl group-hover:scale-110 transition-transform">🌅</span>
              <div>
                <h3 className="font-bold text-sm text-gray-900 font-serif">आज का शुभ विचार</h3>
                <p className="text-xs text-orange-800">दैनिक प्रेरणा सूत्र, गीता श्लोक व नीति वचन</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-sm">
              पढ़ें
            </button>
          </div>
        </div>

        {/* 5. Comprehensive All Vrats Directory Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-xl font-black font-serif text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                समस्त सनातन व्रत एवं महापर्व डायरेक्टरी
              </h2>
              <p className="text-xs text-gray-500">
                वर्ष भर के समस्त पावन व्रत, कथा, शुभ मुहूर्त 2026 एवं नियम
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: 'सभी व्रत' },
                { id: 'major', label: 'प्रमुख महापर्व' },
                { id: 'goddess', label: 'देवी व्रत' },
                { id: 'shiva_vishnu', label: 'शिव व विष्णु' },
                { id: 'monthly', label: 'मासिक व्रत' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveCategory(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === f.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vrats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {filteredVrats.map(vrat => (
              <div
                key={vrat.id}
                onClick={() => setSelectedVrat(vrat)}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99] select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img
                      src={vrat.image}
                      alt={vrat.hindiName}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                      {vrat.hindiName}
                    </h3>
                    <p className="text-[11px] text-[#9a3412] dark:text-amber-400 font-bold truncate">
                      {vrat.date2026} • {vrat.deity}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedVrat && (
        <VratDetailModal
          vrat={selectedVrat}
          isOpen={!!selectedVrat}
          onClose={() => setSelectedVrat(null)}
          onOpenAarti={onNavigateToAarti}
        />
      )}

      {isAlarmModalOpen && (
        <DailyPujaAlarmModal
          isOpen={isAlarmModalOpen}
          onClose={() => setIsAlarmModalOpen(false)}
        />
      )}

      {isJapMalaOpen && (
        <DigitalJapMalaModal
          isOpen={isJapMalaOpen}
          onClose={() => setIsJapMalaOpen(false)}
        />
      )}
    </div>
  );
};
