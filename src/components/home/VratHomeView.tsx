import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Bell, Heart, X, 
  ChevronRight, ArrowRight, Calendar, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ALL_VRATS_DATA } from '../../data/allVratsData';
import { ALL_AARTIS_DATA } from '../../data/allAartisData';
import { DailyPujaAlarmModal } from '../vrats/DailyPujaAlarmModal';
import { getDynamicCalendarBanners, DynamicBannerItem } from '../../data/panchangCalendarEvents';

interface VratHomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenSidebarMenu: () => void;
}

// 6 Core Features with REAL High-Resolution Devotional Photography
const CORE_FEATURE_CARDS = [
  {
    id: 'puja-vidhi',
    title: 'पूजा विधि',
    tagline: 'शास्त्रसम्मत संपूर्ण विधान',
    badge: '12+ महापर्व',
    icon: '📜',
    tab: 'puja-vidhi',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'vrat-katha',
    title: 'व्रत कथा',
    tagline: 'अमर पावन पौराणिक कथाएं',
    badge: 'कथा संग्रह',
    icon: '📖',
    tab: 'vrat-katha',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'aarti-sangrah',
    title: 'आरती',
    tagline: 'नित्य वंदना व भक्ति स्तुति',
    badge: 'सकल आरती',
    icon: '🪔',
    tab: 'aarti-sangrah',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'samagri-list',
    title: 'पूजन सामग्री',
    tagline: 'आवश्यक पूजा चेकलिस्ट',
    badge: 'सामग्री सूची',
    icon: '🧺',
    tab: 'samagri-list',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mantra-list',
    title: 'मंत्र',
    tagline: 'वैदिक महामंत्र व जप',
    badge: 'वैदिक जप',
    icon: 'ॐ',
    tab: 'mantra-list',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'famous-temples',
    title: 'प्रसिद्ध मंदिर',
    tagline: 'तीर्थ दर्शन, समय व इतिहास',
    badge: 'पवित्र धाम',
    icon: '🏛️',
    tab: 'famous-temples',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80'
  }
];

export const VratHomeView: React.FC<VratHomeViewProps> = ({
  onNavigate,
  onOpenSidebarMenu
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  // Read saved alarm status from localStorage
  const [alarmText, setAlarmText] = useState('अभी कोई अलार्म नहीं • सेट करें');

  const refreshAlarmStatus = () => {
    try {
      const saved = localStorage.getItem('daily_puja_alarm_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.morningEnabled || parsed.eveningEnabled) {
          const morning = parsed.morningEnabled ? `प्रातः ${parsed.morningTime}` : '';
          const evening = parsed.eveningEnabled ? `सायं ${parsed.eveningTime}` : '';
          const joined = [morning, evening].filter(Boolean).join(' • ');
          setAlarmText(`${joined} सक्रिय`);
          return;
        }
      }
    } catch {}
    setAlarmText('अभी कोई अलार्म नहीं • सेट करें');
  };

  useEffect(() => {
    refreshAlarmStatus();
  }, [isAlarmModalOpen]);

  // DYNAMIC CALENDAR-BASED FESTIVAL BANNERS:
  // Automatically computes 5 recent past festivals + 5 upcoming festivals based on today's calendar date!
  const calendarBanners: DynamicBannerItem[] = useMemo(() => {
    return getDynamicCalendarBanners(new Date());
  }, []);

  // Moving banner timer - rotates every 4.5 seconds
  useEffect(() => {
    if (calendarBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % calendarBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [calendarBanners.length]);

  // Handle clicking on any festival banner -> open dedicated clean page
  const handleBannerClick = (banner: DynamicBannerItem) => {
    if (banner.isChhath) {
      onNavigate('chhath');
    } else {
      onNavigate('puja-vidhi');
    }
  };

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();

    const vrats = ALL_VRATS_DATA.filter(v =>
      v.hindiName.toLowerCase().includes(term) ||
      v.name.toLowerCase().includes(term) ||
      v.deity.toLowerCase().includes(term)
    ).slice(0, 5);

    const aartis = ALL_AARTIS_DATA.filter(a =>
      a.hindiTitle.toLowerCase().includes(term) ||
      a.title.toLowerCase().includes(term)
    ).slice(0, 4);

    return { vrats, aartis, total: vrats.length + aartis.length };
  }, [searchTerm]);

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#fdf6ee] via-[#faebd7]/30 to-[#fdf6ee] text-[#451a03] flex flex-col justify-start">
      {/* 1. TOP SUB-HEADER (Matching Screenshot: 9-Dot Menu, Search Pill, Heart Button) */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-3 sm:px-4 py-2 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Left: 9-Dot Grid Menu Button */}
          <button
            onClick={onOpenSidebarMenu}
            className="w-9 h-9 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#78350f] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0"
            aria-label="Menu"
            title="सभी फीचर्स मेनू"
          >
            <div className="grid grid-cols-3 gap-0.5 p-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
            </div>
          </button>

          {/* Center: Search Pill Bar ("पूजा, आरती, मंत्र खोजें") */}
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-[#9a3412] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="पूजा, आरती, मंत्र खोजें..."
              className="w-full pl-8 pr-7 py-2 bg-white border border-[#fed7aa] rounded-full text-xs text-[#451a03] placeholder-[#9a3412]/60 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] shadow-xs font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a3412] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: Heart / Favorites Button */}
          <button
            onClick={() => onNavigate('my-chhath')}
            className="w-9 h-9 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#9a3412] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0"
            aria-label="Favorites"
            title="पसंदीदा व संकल्प"
          >
            <Heart className="w-4 h-4 text-[#9a3412]" />
          </button>
        </div>
      </header>

      {/* Global Search Dropdown */}
      {searchResults && (
        <div className="max-w-md mx-auto w-full px-3 py-2">
          <div className="bg-white rounded-2xl p-3 border border-[#f59e0b] shadow-lg space-y-2">
            <div className="flex items-center justify-between border-b border-[#fed7aa] pb-1.5">
              <span className="text-xs font-bold text-[#78350f]">
                "{searchTerm}" के परिणाम ({searchResults.total})
              </span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#9a3412] font-semibold"
              >
                बंद करें ✕
              </button>
            </div>

            {searchResults.total === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">कोई परिणाम नहीं मिला।</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.vrats.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSearchTerm('');
                      onNavigate('puja-vidhi');
                    }}
                    className="p-2 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#78350f]">{v.hindiName}</p>
                      <p className="text-[10px] text-gray-500">{v.deity}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9a3412]" />
                  </div>
                ))}

                {searchResults.aartis.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSearchTerm('');
                      onNavigate('aarti-sangrah');
                    }}
                    className="p-2 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <p className="text-xs font-bold text-[#78350f]">{a.hindiTitle}</p>
                    <span className="text-[10px] font-bold text-[#ea580c]">आरती पढ़ें →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DYNAMIC MOVABLE FESTIVAL BANNER CAROUSEL (Full Screen Width, Real HD Photos, 5 Past + 5 Upcoming Events) */}
      <div className="w-full relative overflow-hidden bg-stone-950">
        <div className="relative w-full h-36 sm:h-44 md:h-48 overflow-hidden">
          {calendarBanners.map((banner, idx) => {
            const isActive = idx === currentSlideIndex;
            const isPast = banner.status === 'past';
            const isToday = banner.status === 'today';

            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className={`absolute inset-0 transition-opacity duration-700 cursor-pointer flex items-center justify-between p-3.5 sm:p-5 ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Real Authentic Festival Photo full cover */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.82]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent sm:via-black/50" />

                {/* Banner Content on left */}
                <div className="relative z-10 space-y-1 max-w-[74%] text-white">
                  {/* Status & Date Badge */}
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs ${
                      isToday
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : isPast
                        ? 'bg-stone-700 text-amber-200 border border-amber-300/30'
                        : 'bg-amber-500 text-stone-950'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-400" /> : <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-300" />}
                      <span>{banner.badge}</span>
                    </span>

                    <span className="text-[10px] font-bold text-amber-300/90 font-mukta">
                      {banner.formattedDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-2xl font-black font-serif text-white tracking-wide pt-0.5 drop-shadow-md truncate">
                    {banner.title}
                  </h2>

                  {/* Subtitle / Significance */}
                  <p className="text-[11px] text-amber-100/90 line-clamp-2 leading-relaxed font-mukta">
                    {banner.subtitle}
                  </p>

                  {/* CTA Pill */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <span className="text-[10px] text-amber-200 font-semibold truncate">
                      {banner.tithi}
                    </span>
                    <span className="text-[10px] font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-2 py-0.5 rounded-full shadow-xs inline-flex items-center shrink-0">
                      <span>{banner.isChhath ? 'छठ ऐप' : 'कथा व विधि'}</span>
                      <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicator Dots & Slide Counter */}
        <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-between px-3 z-20 pointer-events-none">
          <div className="flex items-center space-x-1">
            {calendarBanners.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === currentSlideIndex ? 'w-3.5 bg-amber-400' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] font-bold text-amber-200/80 bg-black/50 px-1.5 py-0.5 rounded-full">
            {currentSlideIndex + 1} / {calendarBanners.length}
          </span>
        </div>
      </div>

      {/* 3. ALARM STRIP + 6 ULTRA-PREMIUM FEATURE CARDS WITH REAL PHOTOGRAPHY */}
      <main className="max-w-md mx-auto w-full px-3 sm:px-4 py-2 sm:py-2.5 space-y-2 sm:space-y-2.5 flex-1 flex flex-col justify-between">
        {/* Daily Puja Alarm Strip */}
        <div 
          onClick={() => setIsAlarmModalOpen(true)}
          className="p-2 sm:p-2.5 bg-gradient-to-r from-[#78350f] via-[#9a3412] to-[#b45309] rounded-2xl text-white shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all border border-[#f59e0b]/40 shrink-0"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#fef3c7] text-[#9a3412] flex items-center justify-center shrink-0 shadow-inner">
              <Bell className="w-4 h-4 animate-swing" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#fde68a] font-bold uppercase tracking-wider leading-none">
                दैनिक पूजा अलार्म
              </p>
              <h3 className="font-bold text-xs text-white truncate leading-tight mt-0.5">
                पूजा या आरती का समय याद दिलाएं...
              </h3>
              <p className="text-[10px] text-[#fed7aa] truncate leading-none mt-0.5">
                {alarmText}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-2.5 py-1 bg-white text-[#78350f] rounded-full text-[11px] font-bold hover:bg-[#fff7ed] shadow-xs shrink-0 ml-1.5"
          >
            सेट करें
          </button>
        </div>

        {/* 6 Core Feature Cards: 2 Columns x 3 Rows, REAL DEVOTIONAL PHOTOGRAPHY */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1">
          {CORE_FEATURE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.tab)}
              className="group relative overflow-hidden rounded-2xl border border-amber-500/35 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 active:scale-[0.98] h-[92px] sm:h-[102px] flex flex-col justify-end p-2.5 sm:p-3"
            >
              {/* Real Devotional Photo Background */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.88]"
                loading="lazy"
              />

              {/* Radiant Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 group-hover:via-black/35 transition-colors" />

              {/* Card Foreground Content */}
              <div className="relative z-10 space-y-0.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 shadow-xs inline-flex items-center space-x-0.5">
                    <span>{card.icon}</span>
                    <span>{card.badge}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform drop-shadow" />
                </div>

                <h3 className="font-serif font-black text-sm sm:text-base text-white tracking-wide drop-shadow-md leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-medium truncate leading-tight drop-shadow-xs">
                  {card.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Alarm Settings Modal */}
      {isAlarmModalOpen && (
        <DailyPujaAlarmModal
          isOpen={isAlarmModalOpen}
          onClose={() => {
            setIsAlarmModalOpen(false);
            refreshAlarmStatus();
          }}
        />
      )}
    </div>
  );
};
