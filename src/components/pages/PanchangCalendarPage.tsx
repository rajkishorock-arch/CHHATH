import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Flame, 
  Sun, 
  Award, 
  Heart, 
  ArrowLeft, 
  Home, 
  Share2, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  X
} from 'lucide-react';
import { PANCHANG_CALENDAR_2026, CalendarEventItem } from '../../data/panchangCalendarEvents';
import { getCompleteFestivalHubData, CompleteFestivalHubData } from '../../data/festivalHubDetailsData';
import { DedicatedFestivalHubView } from '../vrats/DedicatedFestivalHubView';

interface PanchangCalendarPageProps {
  onNavigate: (tab: string) => void;
  onOpenJapMala?: () => void;
}

const MONTH_NAMES_HINDI = [
  { id: 0, hi: 'जनवरी', en: 'January', masa: 'पौष - माघ', icon: '❄️' },
  { id: 1, hi: 'फ़रवरी', en: 'February', masa: 'माघ - फाल्गुन', icon: '🔱' },
  { id: 2, hi: 'मार्च', en: 'March', masa: 'फाल्गुन - चैत्र', icon: '🎨' },
  { id: 3, hi: 'अप्रैल', en: 'April', masa: 'चैत्र - वैशाख', icon: '🌸' },
  { id: 4, hi: 'मई', en: 'May', masa: 'वैशाख - ज्येष्ठ', icon: '☀️' },
  { id: 5, hi: 'जून', en: 'June', masa: 'ज्येष्ठ - आषाढ़', icon: '🌊' },
  { id: 6, hi: 'जुलाई', en: 'July', masa: 'आषाढ़ - श्रावण', icon: '🌧️' },
  { id: 7, hi: 'अगस्त', en: 'August', masa: 'श्रावण - भाद्रपद', icon: '🌿' },
  { id: 8, hi: 'सितंबर', en: 'September', masa: 'भाद्रपद - आश्विन', icon: '🦚' },
  { id: 9, hi: 'अक्टूबर', en: 'October', masa: 'आश्विन - कार्तिक', icon: '🌺' },
  { id: 10, hi: 'नवंबर', en: 'November', masa: 'कार्तिक - मार्गशीर्ष', icon: '🪔' },
  { id: 11, hi: 'दिसंबर', en: 'December', masa: 'मार्गशीर्ष - पौष', icon: '🚩' }
];

const WEEK_DAYS = [
  { short: 'रवि', full: 'रविवार', en: 'Sun' },
  { short: 'सोम', full: 'सोमवार', en: 'Mon' },
  { short: 'मंगल', full: 'मंगलवार', en: 'Tue' },
  { short: 'बुध', full: 'बुधवार', en: 'Wed' },
  { short: 'गुरु', full: 'गुरुवार', en: 'Thu' },
  { short: 'शुक्र', full: 'शुक्रवार', en: 'Fri' },
  { short: 'शनि', full: 'शनिवार', en: 'Sat' }
];

export const PanchangCalendarPage: React.FC<PanchangCalendarPageProps> = ({ 
  onNavigate,
  onOpenJapMala 
}) => {
  // Calendar View State: Year 2026
  const [selectedYear] = useState<number>(2026);
  // Default to October (index 9) or November (index 10) where major festivals like Chhath & Diwali occur, or current month
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => {
    const now = new Date();
    return now.getFullYear() === 2026 ? now.getMonth() : 10; // Default to Nov 2026 (Chhath Month)
  });

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'mahaparv' | 'vrat' | 'puja' | 'jayanti'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dedicated Page State: when user clicks any festival/parv
  const [selectedFestival, setSelectedFestival] = useState<CompleteFestivalHubData | null>(null);

  // Compute days in the active month of 2026
  const monthCalendarGrid = useMemo(() => {
    const firstDayIndex = new Date(selectedYear, currentMonthIndex, 1).getDay(); // 0 = Sun
    const totalDays = new Date(selectedYear, currentMonthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(selectedYear, currentMonthIndex, 0).getDate();

    const days: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      dateStr: string;
      events: CalendarEventItem[];
    }> = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
      const prevYear = currentMonthIndex === 0 ? selectedYear - 1 : selectedYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        isCurrentMonth: false,
        dateStr,
        events: []
      });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${selectedYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = PANCHANG_CALENDAR_2026.filter(e => e.date === dateStr);
      days.push({
        dayNumber: day,
        isCurrentMonth: true,
        dateStr,
        events: dayEvents
      });
    }

    // Next month padding to fill remaining cells (grid of 35 or 42)
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
      const nextYear = currentMonthIndex === 11 ? selectedYear + 1 : selectedYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        isCurrentMonth: false,
        dateStr,
        events: []
      });
    }

    return days;
  }, [selectedYear, currentMonthIndex]);

  // Festivals in the currently selected month
  const currentMonthEvents = useMemo(() => {
    const monthPrefix = `${selectedYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
    return PANCHANG_CALENDAR_2026.filter(e => e.date.startsWith(monthPrefix));
  }, [selectedYear, currentMonthIndex]);

  // Filtered festivals based on category and search query
  const displayedEvents = useMemo(() => {
    return PANCHANG_CALENDAR_2026.filter(e => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          e.title.toLowerCase().includes(q) ||
          e.hindiName.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.tithi.toLowerCase().includes(q) ||
          e.formattedDate.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      } else {
        // If no search, filter by month or selected date
        if (selectedDateStr) {
          if (e.date !== selectedDateStr) return false;
        } else {
          const monthPrefix = `${selectedYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
          if (!e.date.startsWith(monthPrefix)) return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if (e.category !== categoryFilter) return false;
      }

      return true;
    });
  }, [searchQuery, selectedDateStr, selectedYear, currentMonthIndex, categoryFilter]);

  // Next Upcoming Festival Banner (Prominently featured)
  const upcomingFestival = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const sorted = [...PANCHANG_CALENDAR_2026].sort((a, b) => a.date.localeCompare(b.date));
    const next = sorted.find(e => e.date >= todayStr);
    return next || sorted[0];
  }, []);

  // Open dedicated full festival hub view for ANY clicked festival
  const handleOpenFestivalDetail = (event: CalendarEventItem) => {
    try {
      const fullData = getCompleteFestivalHubData(event);
      setSelectedFestival(fullData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Failed to load festival detail:', e);
    }
  };

  const handleShareCalendar = async () => {
    const currentM = MONTH_NAMES_HINDI[currentMonthIndex];
    const text = `🗓️ *सनातन पंचांग व महापर्व कैलेंडर 2026*\n\nमाह: ${currentM.hi} (${currentM.masa})\nप्रमुख पर्व:\n${currentMonthEvents.map(e => `• ${e.hindiName} - ${e.formattedDate} (${e.tithi})`).join('\n')}\n\n📲 संपूर्ण पूजा विधि, कथा व मुहूर्त देखें: https://chhathvibes.vercel.app/#panchang-calendar`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'सनातन पंचांग कैलेंडर 2026', text });
      } catch {}
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // If a dedicated festival is selected, show DedicatedFestivalHubView directly!
  if (selectedFestival) {
    return (
      <DedicatedFestivalHubView 
        festival={selectedFestival}
        onBack={() => setSelectedFestival(null)}
        onGoHome={() => onNavigate('home')}
        onOpenJapMala={onOpenJapMala}
      />
    );
  }

  const activeMonthInfo = MONTH_NAMES_HINDI[currentMonthIndex];

  return (
    <div className="min-h-screen bg-[#fdf6ee] dark:bg-stone-950 text-[#451a03] dark:text-stone-100 pb-16 animate-fadeIn select-none">
      
      {/* 1. TOP HEADER & APP BAR */}
      <header className="sticky top-0 z-40 bg-[#fdf6ee]/95 dark:bg-stone-900/95 backdrop-blur-md px-3.5 sm:px-6 py-3 border-b border-[#fed7aa]/60 dark:border-stone-800 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700 cursor-pointer shrink-0"
            title="मुख्य पृष्ठ पर जाएं"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Title Banner */}
          <div className="text-center min-w-0 flex-1 px-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <span>{activeMonthInfo.icon}</span>
              <span>विक्रम संवत् 2083</span>
            </div>
            <h1 className="font-rozha text-lg sm:text-2xl font-bold text-[#78350f] dark:text-amber-200 truncate leading-tight">
              सनातन पंचांग व पर्व कैलेंडर 2026
            </h1>
          </div>

          {/* Share & Home Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleShareCalendar}
              className="w-9 h-9 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700 cursor-pointer"
              title="कैलेंडर शेयर करें"
              aria-label="कैलेंडर शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 flex items-center justify-center transition-all shadow-xs font-bold cursor-pointer"
              title="होम पर जाएं"
              aria-label="होम"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">

        {/* 2. NEXT UPCOMING FESTIVAL HERO SHOWCASE */}
        {upcomingFestival && !searchQuery && (
          <div 
            onClick={() => handleOpenFestivalDetail(upcomingFestival)}
            className="group relative rounded-2xl overflow-hidden shadow-lg border border-amber-500/30 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all"
          >
            {/* Background Image with Ambient Glow */}
            <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-35 transition-opacity">
              <img 
                src={upcomingFestival.image} 
                alt={upcomingFestival.hindiName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-1" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/90 text-stone-950 text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>आगामी पावन महापर्व</span>
                </div>
                <h2 className="font-rozha text-2xl sm:text-3xl font-black text-amber-200 leading-tight">
                  {upcomingFestival.title}
                </h2>
                <p className="font-mukta text-xs sm:text-sm text-stone-200 line-clamp-2">
                  {upcomingFestival.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-amber-100">
                  <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{upcomingFestival.formattedDate}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{upcomingFestival.tithi}</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 active:scale-95 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>संपूर्ण विधि, कथा व मुहूर्त देखें</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. SEARCH BAR */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedDateStr) setSelectedDateStr(null);
            }}
            placeholder="पर्व, व्रत या तिथि खोजें (उदा. छठ, दीपावली, एकादशी, शिवरात्रि)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
              title="हटाएं"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4. REAL INTERACTIVE MONTH CALENDAR */}
        {!searchQuery && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-[#fed7aa]/80 dark:border-stone-800 shadow-md space-y-4">
            
            {/* Month Header Controller */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
                    setSelectedDateStr(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="पिछला महीना"
                  aria-label="पिछला महीना"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-left">
                  <h3 className="font-rozha text-lg sm:text-xl font-bold text-amber-900 dark:text-amber-300 leading-tight">
                    {activeMonthInfo.hi} {selectedYear}
                  </h3>
                  <span className="text-[11px] font-mukta text-stone-500 dark:text-stone-400">
                    {activeMonthInfo.en} • {activeMonthInfo.masa}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
                    setSelectedDateStr(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="अगला महीना"
                  aria-label="अगला महीना"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setCurrentMonthIndex(now.getMonth());
                    setSelectedDateStr(now.toISOString().slice(0, 10));
                  }}
                  className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  आज (Today)
                </button>

                {/* Chhath Month Quick Jump */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMonthIndex(10); // November 2026
                    setSelectedDateStr('2026-11-15'); // Sandhya Arghya
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    currentMonthIndex === 10
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
                  }`}
                >
                  ✨ छठ महापर्व (नवंबर)
                </button>
              </div>
            </div>

            {/* 12 Months Horizontal Scrollable Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {MONTH_NAMES_HINDI.map((m) => {
                const isSelected = m.id === currentMonthIndex;
                const monthHasEvents = PANCHANG_CALENDAR_2026.some(e => e.date.startsWith(`2026-${String(m.id + 1).padStart(2, '0')}`));
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setCurrentMonthIndex(m.id);
                      setSelectedDateStr(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mukta font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md scale-105'
                        : 'bg-stone-100 dark:bg-stone-800/80 hover:bg-amber-100 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.hi}</span>
                    {monthHasEvents && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-stone-950' : 'bg-amber-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 7-Day Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-stone-500 dark:text-stone-400 py-1">
              {WEEK_DAYS.map((w, idx) => (
                <div 
                  key={w.en} 
                  className={`py-1 rounded-md ${idx === 0 ? 'text-red-500 font-black' : ''}`}
                  title={w.full}
                >
                  <span>{w.short}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid of Dates */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
              {monthCalendarGrid.map((cell, idx) => {
                const hasEvents = cell.events.length > 0;
                const isSelected = selectedDateStr === cell.dateStr;
                const primaryEvent = cell.events[0];
                const isChhath = cell.events.some(e => e.isChhath || e.id.includes('chhath'));

                return (
                  <button
                    key={`${cell.dateStr}-${idx}`}
                    type="button"
                    disabled={!cell.isCurrentMonth}
                    onClick={() => {
                      if (hasEvents) {
                        // If single event, user can open it or highlight
                        setSelectedDateStr(cell.dateStr);
                      } else {
                        setSelectedDateStr(cell.dateStr);
                      }
                    }}
                    className={`min-h-[58px] sm:min-h-[72px] p-1 rounded-xl transition-all flex flex-col justify-between items-center relative text-left cursor-pointer ${
                      !cell.isCurrentMonth
                        ? 'opacity-25 pointer-events-none bg-stone-50/50 dark:bg-stone-900/30'
                        : isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400 scale-[1.02]'
                        : hasEvents
                        ? isChhath
                          ? 'bg-gradient-to-b from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/60 border border-amber-500/60 hover:shadow-md'
                          : 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-400/40 hover:bg-amber-100/80'
                        : 'bg-stone-50/60 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {/* Date Number */}
                    <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-bold leading-none">
                      <span className={isSelected ? 'text-stone-950' : 'text-stone-800 dark:text-stone-200'}>
                        {cell.dayNumber}
                      </span>
                      {hasEvents && (
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-stone-950' : isChhath ? 'bg-orange-500 animate-pulse' : 'bg-amber-500'}`} />
                      )}
                    </div>

                    {/* Festival label if present on this date */}
                    {hasEvents && primaryEvent && (
                      <div className="w-full mt-1">
                        <span className={`block text-[9px] sm:text-[10px] font-bold truncate leading-tight ${
                          isSelected 
                            ? 'text-stone-950' 
                            : isChhath 
                            ? 'text-orange-700 dark:text-orange-300 font-extrabold' 
                            : 'text-amber-800 dark:text-amber-300'
                        }`}>
                          {primaryEvent.hindiName}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick reset if a specific date was clicked */}
            {selectedDateStr && (
              <div className="flex items-center justify-between pt-2 text-xs font-mukta text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800">
                <span>चयनित तिथि: <strong>{selectedDateStr}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedDateStr(null)}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
                >
                  पूरे माह के पर्व देखें (Clear Filter)
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: '🌟 समस्त पावन पर्व', count: PANCHANG_CALENDAR_2026.length },
            { id: 'mahaparv', label: '🔱 महापर्व', count: PANCHANG_CALENDAR_2026.filter(e => e.category === 'mahaparv').length },
            { id: 'vrat', label: '🌸 व्रत व एकादशी', count: PANCHANG_CALENDAR_2026.filter(e => e.category === 'vrat').length },
            { id: 'puja', label: '🪔 विशेष पूजा', count: PANCHANG_CALENDAR_2026.filter(e => e.category === 'puja').length },
            { id: 'jayanti', label: '🚩 पावन जयंती', count: PANCHANG_CALENDAR_2026.filter(e => e.category === 'jayanti').length }
          ].map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-sm scale-105'
                    : 'bg-white dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1 opacity-70 text-[10px]">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* 6. FESTIVALS LIST / CARDS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-rozha text-base sm:text-lg font-bold text-[#78350f] dark:text-amber-200 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-500" />
              <span>
                {searchQuery 
                  ? `खोज परिणाम (${displayedEvents.length})` 
                  : selectedDateStr 
                  ? `इस तिथि के पर्व (${displayedEvents.length})` 
                  : `${activeMonthInfo.hi} 2026 के प्रमुख पावन पर्व (${displayedEvents.length})`}
              </span>
            </h3>

            <span className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
              क्लिक कर संपूर्ण विधि व कथा देखें
            </span>
          </div>

          {displayedEvents.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <p className="font-mukta text-sm text-stone-500">इस चयन में कोई पर्व उपलब्ध नहीं है।</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDateStr(null);
                  setCategoryFilter('all');
                }}
                className="px-4 py-1.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-xs"
              >
                सभी पर्व देखें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {displayedEvents.map((event) => {
                const isChhath = event.isChhath || event.id.includes('chhath');
                return (
                  <div
                    key={event.id}
                    onClick={() => handleOpenFestivalDetail(event)}
                    className="group bg-white dark:bg-stone-900 rounded-2xl p-3.5 sm:p-4 border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-amber-500/60 transition-all cursor-pointer flex gap-3.5 items-center select-none"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-stone-950 border border-white/20">
                      <img
                        src={event.image}
                        alt={event.hindiName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80';
                        }}
                      />
                      {isChhath && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-orange-500 text-stone-950 font-black text-[9px] shadow-sm">
                          छठ
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-700 dark:text-amber-400">
                        <span className="flex items-center gap-1 font-bold">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{event.formattedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="truncate">{event.tithi}</span>
                      </div>

                      <h4 className="font-rozha text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-tight truncate">
                        {event.title}
                      </h4>

                      <p className="font-mukta text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                        {event.subtitle}
                      </p>

                      {/* Interactive Tags Row */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[10px] font-bold">
                          📖 विधि
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[10px] font-bold">
                          📜 कथा
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[10px] font-bold">
                          ⏳ मुहूर्त
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[10px] font-bold">
                          🪔 आरती
                        </span>
                        <span className="ml-auto text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center group-hover:translate-x-1 transition-transform">
                          विस्तार →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

    </div>
  );
};
