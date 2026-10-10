import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Flame, 
  Sun, 
  Moon,
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
  X,
  Compass,
  Bell,
  Star,
  Check,
  ChevronDown
} from 'lucide-react';
import { PANCHANG_CALENDAR_2026, CalendarEventItem } from '../../data/panchangCalendarEvents';
import { getCompleteFestivalHubData, CompleteFestivalHubData } from '../../data/festivalHubDetailsData';
import { DedicatedFestivalHubView } from '../vrats/DedicatedFestivalHubView';
import { 
  getDailyPanchang, 
  SHUBH_MUHURATS_2026, 
  DailyPanchangDetail, 
  ShubhMuhuratCategory 
} from '../../utils/panchangCalendarEngine';

interface PanchangCalendarPageProps {
  onNavigate: (tab: string) => void;
  onOpenJapMala?: () => void;
}

const MONTH_NAMES_HINDI = [
  { id: 0, hi: 'जनवरी', en: 'January', masa: 'पौष - माघ', icon: '❄️', ritu: 'शिशिर' },
  { id: 1, hi: 'फ़रवरी', en: 'February', masa: 'माघ - फाल्गुन', icon: '🔱', ritu: 'शिशिर' },
  { id: 2, hi: 'मार्च', en: 'March', masa: 'फाल्गुन - चैत्र', icon: '🎨', ritu: 'वसंत' },
  { id: 3, hi: 'अप्रैल', en: 'April', masa: 'चैत्र - वैशाख', icon: '🌸', ritu: 'वसंत' },
  { id: 4, hi: 'मई', en: 'May', masa: 'वैशाख - ज्येष्ठ', icon: '☀️', ritu: 'ग्रीष्म' },
  { id: 5, hi: 'जून', en: 'June', masa: 'ज्येष्ठ - आषाढ़', icon: '🌊', ritu: 'ग्रीष्म' },
  { id: 6, hi: 'जुलाई', en: 'July', masa: 'आषाढ़ - श्रावण', icon: '🌧️', ritu: 'वर्षा' },
  { id: 7, hi: 'अगस्त', en: 'August', masa: 'श्रावण - भाद्रपद', icon: '🌿', ritu: 'वर्षा' },
  { id: 8, hi: 'सितंबर', en: 'September', masa: 'भाद्रपद - आश्विन', icon: '🦚', ritu: 'शरद' },
  { id: 9, hi: 'अक्टूबर', en: 'October', masa: 'आश्विन - कार्तिक', icon: '🌺', ritu: 'शरद' },
  { id: 10, hi: 'नवंबर', en: 'November', masa: 'कार्तिक - मार्गशीर्ष', icon: '🪔', ritu: 'हेमंत' },
  { id: 11, hi: 'दिसंबर', en: 'December', masa: 'मार्गशीर्ष - पौष', icon: '🚩', ritu: 'हेमंत' }
];

const WEEK_DAYS = [
  { short: 'रवि', full: 'रविवार', en: 'Sun', isSun: true },
  { short: 'सोम', full: 'सोमवार', en: 'Mon', isSun: false },
  { short: 'मंगल', full: 'मंगलवार', en: 'Tue', isSun: false },
  { short: 'बुध', full: 'बुधवार', en: 'Wed', isSun: false },
  { short: 'गुरु', full: 'गुरुवार', en: 'Thu', isSun: false },
  { short: 'शुक्र', full: 'शुक्रवार', en: 'Fri', isSun: false },
  { short: 'शनि', full: 'शनिवार', en: 'Sat', isSun: false }
];

export const PanchangCalendarPage: React.FC<PanchangCalendarPageProps> = ({ 
  onNavigate,
  onOpenJapMala 
}) => {
  const [selectedYear] = useState<number>(2026);
  // Default to October or November (Chhath Month)
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => {
    const now = new Date();
    return now.getFullYear() === 2026 ? now.getMonth() : 10; // Nov 2026 default
  });

  // Selected date for Daily Panchang Sheet (defaults to today or 1st of month)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return `2026-11-15`; // Chhath Sandhya Arghya as auspicious default
  });

  // 3 Royal View Modes: 'wall-calendar' | 'festival-list' | 'shubh-muhurat'
  const [activeView, setActiveView] = useState<'wall-calendar' | 'festival-list' | 'shubh-muhurat'>('wall-calendar');

  // Filter & Search
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'mahaparv' | 'vrat' | 'puja' | 'jayanti'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Shubh Muhurat Category in Muhurat Tab
  const [selectedMuhuratCat, setSelectedMuhuratCat] = useState<string>('vivah');

  // Dedicated Festival Hub View State
  const [selectedFestival, setSelectedFestival] = useState<CompleteFestivalHubData | null>(null);

  // Active month info
  const activeMonthInfo = MONTH_NAMES_HINDI[currentMonthIndex];

  // Daily Panchang for currently selected date
  const selectedDatePanchang = useMemo(() => {
    return getDailyPanchang(selectedDateStr);
  }, [selectedDateStr]);

  // Compute days in the active month of 2026 with enriched Panchang details
  const monthCalendarGrid = useMemo(() => {
    const firstDayIndex = new Date(selectedYear, currentMonthIndex, 1).getDay(); // 0 = Sun
    const totalDays = new Date(selectedYear, currentMonthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(selectedYear, currentMonthIndex, 0).getDate();

    const days: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      dateStr: string;
      events: CalendarEventItem[];
      panchang: DailyPanchangDetail;
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
        events: [],
        panchang: getDailyPanchang(dateStr)
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
        events: dayEvents,
        panchang: getDailyPanchang(dateStr)
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
        events: [],
        panchang: getDailyPanchang(dateStr)
      });
    }

    return days;
  }, [selectedYear, currentMonthIndex]);

  // Scope for Festival List: 'year' (सम्पूर्ण वर्ष 2026) | 'month' (केवल यह माह)
  const [festivalScope, setFestivalScope] = useState<'year' | 'month'>('year');

  // Festivals in currently selected month
  const currentMonthEvents = useMemo(() => {
    const monthPrefix = `${selectedYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
    return PANCHANG_CALENDAR_2026.filter(e => e.date.startsWith(monthPrefix));
  }, [selectedYear, currentMonthIndex]);

  // Festivals based on active scope (used for category count badges)
  const scopeEvents = useMemo(() => {
    if (festivalScope === 'month') {
      const monthPrefix = `${selectedYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
      return PANCHANG_CALENDAR_2026.filter(e => e.date.startsWith(monthPrefix));
    }
    return PANCHANG_CALENDAR_2026;
  }, [festivalScope, selectedYear, currentMonthIndex]);

  // Filtered festivals based on scope, category, and search query
  const displayedEvents = useMemo(() => {
    return PANCHANG_CALENDAR_2026.filter(e => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          e.title.toLowerCase().includes(q) ||
          e.hindiName.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.tithi.toLowerCase().includes(q) ||
          e.formattedDate.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      } else if (festivalScope === 'month') {
        const monthPrefix = `${selectedYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
        if (!e.date.startsWith(monthPrefix)) return false;
      }

      if (categoryFilter !== 'all' && e.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedYear, currentMonthIndex, categoryFilter, festivalScope]);

  // Upcoming major festival showcase
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
    const text = `🗓️ *सनातन पंचांग व कालनिर्णय 2026*\n\nमाह: ${currentM.hi} (${currentM.masa})\nविक्रम संवत: 2083 • ऋतु: ${currentM.ritu}\n\nप्रमुख पावन पर्व:\n${currentMonthEvents.map(e => `• ${e.hindiName} - ${e.formattedDate} (${e.tithi})`).join('\n')}\n\n📲 संपूर्ण पंचांग, पूजा विधि, कथा व मुहूर्त देखें: https://chhathvibes.vercel.app/#panchang-calendar`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'सनातन पंचांग व कालनिर्णय 2026', text });
      } catch {}
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // If a dedicated festival hub is selected, render it directly
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

  return (
    <div className="min-h-screen bg-[#fdf6ee] dark:bg-stone-950 text-[#451a03] dark:text-stone-100 pb-16 animate-fadeIn select-none">
      
      {/* 1. TOP ROYAL HEADER & APP BAR */}
      <header className="sticky top-0 z-40 bg-[#fdf6ee]/95 dark:bg-stone-900/95 backdrop-blur-md px-3.5 sm:px-6 py-2.5 border-b border-[#fed7aa]/60 dark:border-stone-800 shadow-xs">
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
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 tracking-wider">
              <span>ॐ श्री गणेशाय नमः</span>
              <span>•</span>
              <span>卐 शुभ लाभ</span>
            </div>
            <h1 className="font-serif text-lg sm:text-2xl font-black text-[#78350f] dark:text-amber-200 truncate leading-tight">
              सनातन पंचांग व कालनिर्णय 2026
            </h1>
            <p className="text-[10px] sm:text-xs text-[#9a3412] font-mukta font-bold truncate">
              विक्रम संवत 2083 • शक संवत 1948 • कलि संवत 5127
            </p>
          </div>

          {/* Share & Home Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleShareCalendar}
              className="w-9 h-9 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700 cursor-pointer"
              title="पंचांग शेयर करें"
              aria-label="पंचांग शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-stone-950 flex items-center justify-center transition-all shadow-xs font-bold cursor-pointer"
              title="होम पर जाएं"
              aria-label="होम"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4 sm:space-y-6">

        {/* 2. THREE MASTER VIEW MODES (पारंपरिक दृश्य नियंत्रक) */}
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#fed7aa] dark:border-stone-800 shadow-xs flex items-center justify-between gap-1">
          {[
            { id: 'wall-calendar', label: 'दीवार पंचांग कैलेंडर', icon: '🗓️' },
            { id: 'festival-list', label: 'मासिक पर्व व व्रत सूची', icon: '📋' },
            { id: 'shubh-muhurat', label: 'शुभ मुहूर्त 2026', icon: '💍' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold font-mukta transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-black scale-[1.01]'
                  : 'text-[#78350f] dark:text-stone-300 hover:bg-[#fed7aa]/30'
              }`}
            >
              <span className="text-sm sm:text-base">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. MONTH SELECTOR & ROYAL TRADITIONAL BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#fffcf7] to-[#fef8ed] dark:from-stone-900 dark:to-stone-950 rounded-3xl p-4 sm:p-6 border-2 border-amber-300/80 dark:border-amber-900/60 shadow-lg space-y-3.5">
          {/* Traditional Auspicious Header Frame */}
          <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-stone-800 pb-3 flex-wrap gap-2">
            {/* Month Switcher Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
                  const prevM = currentMonthIndex === 0 ? 12 : currentMonthIndex;
                  setSelectedDateStr(`2026-${String(prevM).padStart(2, '0')}-01`);
                }}
                className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-300 flex items-center justify-center transition-all shadow-xs cursor-pointer border border-amber-300/60 dark:border-stone-700"
                title="पिछला महीना"
                aria-label="पिछला महीना"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-[#78350f] dark:text-amber-200 leading-tight">
                    {activeMonthInfo.hi} 2026
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold font-mono">
                    {activeMonthInfo.en}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#9a3412] dark:text-amber-400 font-mukta">
                  {activeMonthInfo.masa} • {selectedDatePanchang.ritu} • {selectedDatePanchang.ayan}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
                  const nextM = currentMonthIndex === 11 ? 1 : currentMonthIndex + 2;
                  setSelectedDateStr(`2026-${String(nextM).padStart(2, '0')}-01`);
                }}
                className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-300 flex items-center justify-center transition-all shadow-xs cursor-pointer border border-amber-300/60 dark:border-stone-700"
                title="अगला महीना"
                aria-label="अगला महीना"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Jump Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const targetM = now.getMonth();
                  setCurrentMonthIndex(targetM);
                  setSelectedDateStr(`2026-${String(targetM + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-amber-950 dark:text-amber-300 text-xs font-bold shadow-xs hover:bg-amber-50 dark:hover:bg-stone-700 cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>📍 आज (Today)</span>
              </button>
            </div>
          </div>

          {/* 12 Months Horizontal Scrollable Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MONTH_NAMES_HINDI.map((m) => {
              const isSelected = m.id === currentMonthIndex;
              const hasEvents = PANCHANG_CALENDAR_2026.some(e => e.date.startsWith(`2026-${String(m.id + 1).padStart(2, '0')}`));
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setCurrentMonthIndex(m.id);
                    setSelectedDateStr(`2026-${String(m.id + 1).padStart(2, '0')}-01`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mukta font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-500 shadow-md scale-105 font-black'
                      : 'bg-white/90 dark:bg-stone-800/90 hover:bg-amber-100 dark:hover:bg-stone-700 text-[#78350f] dark:text-stone-200 border-amber-200/60 dark:border-stone-700'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.hi}</span>
                  {hasEvents && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-stone-950' : 'bg-amber-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. VIEW 1: TRADITIONAL WALL CALENDAR GRID (दीवार पंचांग कैलेंडर) */}
        {activeView === 'wall-calendar' && (
          <div className="space-y-5 animate-fade-in">
            {/* The Authentic Calendar Board */}
            <div className="bg-gradient-to-b from-[#fffefc] to-[#fcf7ee] dark:from-stone-900 dark:to-stone-950 rounded-3xl p-3 sm:p-5 border-2 border-amber-300/90 dark:border-amber-900/80 shadow-xl space-y-2.5">
              
              {/* 7 Weekday Headers (रविवार prominently in Red) */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center py-1 border-b border-amber-200 dark:border-stone-800">
                {WEEK_DAYS.map((w) => (
                  <div 
                    key={w.en} 
                    className={`py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-mukta font-black shadow-2xs ${
                      w.isSun 
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60' 
                        : 'bg-amber-50/80 dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-amber-200/50 dark:border-stone-800'
                    }`}
                    title={w.full}
                  >
                    <span>{w.short}</span>
                    <span className="hidden sm:inline text-[10px] opacity-70 ml-1">({w.en})</span>
                  </div>
                ))}
              </div>

              {/* Real Authentic Clean Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {monthCalendarGrid.map((cell, idx) => {
                  const isSelected = selectedDateStr === cell.dateStr;
                  const isSun = cell.panchang.isSunday;
                  const hasEvents = cell.events.length > 0;
                  const isChhath = cell.events.some(e => e.isChhath || e.id.includes('chhath'));

                  // Precise Today Detection (Current real system date or selected 2026 month match)
                  const now = new Date();
                  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                  const isToday = cell.isCurrentMonth && (
                    cell.dateStr === todayDateStr || 
                    (selectedYear === 2026 && currentMonthIndex === now.getMonth() && cell.dayNumber === now.getDate())
                  );

                  return (
                    <div
                      key={`${cell.dateStr}-${idx}`}
                      onClick={() => {
                        setSelectedDateStr(cell.dateStr);
                      }}
                      className={`min-h-[58px] sm:min-h-[72px] md:min-h-[84px] rounded-xl sm:rounded-2xl transition-all flex flex-col justify-between items-center p-1 sm:p-1.5 relative cursor-pointer select-none border ${
                        !cell.isCurrentMonth
                          ? 'opacity-20 pointer-events-none bg-stone-100/30 dark:bg-stone-900/10 border-transparent text-stone-400 dark:text-stone-600'
                          : isSelected
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-stone-950 border-amber-600 shadow-md scale-[1.03] ring-2 ring-amber-400 font-black'
                          : isToday
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-400 dark:ring-emerald-400 ring-offset-1 ring-offset-white dark:ring-offset-stone-950 shadow-[0_0_15px_rgba(16,185,129,0.45)]'
                          : isChhath
                          ? 'bg-gradient-to-b from-orange-100/95 via-amber-100/80 to-orange-50 dark:from-orange-950/80 dark:via-amber-950/60 dark:to-stone-900 border-2 border-orange-500 dark:border-orange-400 shadow-sm ring-1 ring-orange-400/50 hover:scale-[1.02]'
                          : hasEvents
                          ? 'bg-gradient-to-b from-amber-50 via-orange-50/90 to-amber-100/60 dark:from-amber-950/70 dark:via-stone-900 dark:to-orange-950/60 border-2 border-amber-400 dark:border-amber-500 shadow-xs dark:shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:scale-[1.02]'
                          : cell.panchang.isPurnima
                          ? 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-600/60 hover:scale-[1.02]'
                          : cell.panchang.isAmavasya
                          ? 'bg-stone-100/80 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 hover:scale-[1.02]'
                          : 'bg-white dark:bg-stone-900/90 hover:bg-amber-50/60 dark:hover:bg-stone-800 border-amber-200/60 dark:border-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs'
                      }`}
                    >
                      {/* Top Row: Date Number + Sunday Dot */}
                      <div className="w-full flex items-center justify-between px-0.5">
                        <span className={`text-sm sm:text-base md:text-lg font-bold font-mono leading-none ${
                          isSelected
                            ? 'text-stone-950 font-black'
                            : isSun
                            ? 'text-rose-600 dark:text-rose-400 font-black'
                            : isToday
                            ? 'text-emerald-700 dark:text-emerald-300 font-black'
                            : 'text-[#451a03] dark:text-stone-100'
                        }`}>
                          {cell.dayNumber}
                        </span>

                        {isSun && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="रविवार" />
                        )}
                      </div>

                      {/* Bottom Section: Festival / Vrat Badge OR Tithi */}
                      {cell.isCurrentMonth && (
                        <div className="w-full flex flex-col items-center mt-auto">
                          {hasEvents ? (
                            <span 
                              className={`w-full truncate px-1 py-0.5 rounded text-[8px] sm:text-[9px] md:text-[10px] font-black text-center leading-tight transition-transform ${
                                isSelected
                                  ? 'bg-stone-950 text-amber-300'
                                  : isChhath
                                  ? 'bg-orange-500 text-stone-950 font-black shadow-2xs ring-1 ring-orange-300'
                                  : 'bg-amber-500/25 dark:bg-amber-400/25 text-amber-950 dark:text-amber-200 border border-amber-500/40'
                              }`} 
                              title={cell.events[0].title}
                            >
                              {cell.events[0].hindiName || cell.events[0].title}
                            </span>
                          ) : cell.panchang.isPurnima ? (
                            <span className={`w-full truncate px-0.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-center leading-tight ${
                              isSelected ? 'text-stone-950' : 'bg-amber-400/20 text-amber-900 dark:text-amber-300'
                            }`}>
                              पूर्णिमा
                            </span>
                          ) : cell.panchang.isAmavasya ? (
                            <span className={`w-full truncate px-0.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-center leading-tight ${
                              isSelected ? 'text-stone-950' : 'bg-stone-300/40 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                            }`}>
                              अमावस्या
                            </span>
                          ) : (
                            <span className={`text-[9px] sm:text-[10px] font-bold font-mukta truncate ${
                              isSelected ? 'text-stone-950 opacity-90' : 'text-stone-400 dark:text-stone-500'
                            }`}>
                              {cell.panchang.tithiName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. ROYAL DAILY PANCHANG SHEET (दैनिक पंचांग व शुभ मुहूर्त पत्रक) */}
            <div className="bg-gradient-to-br from-[#fffcf7] via-[#fff9ee] to-[#fef3dc] dark:from-stone-900 dark:to-stone-950 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 dark:border-amber-900 shadow-xl space-y-4">
              
              {/* Sheet Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-300/80 dark:border-stone-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪔</span>
                    <h3 className="font-serif font-black text-lg sm:text-xl text-[#78350f] dark:text-amber-200">
                      दैनिक पंचांग पत्रक: {selectedDatePanchang.dayName}, {selectedDatePanchang.dayNumber} {activeMonthInfo.hi} 2026
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#9a3412] dark:text-amber-400 font-mukta">
                    {selectedDatePanchang.tithiFull} • {selectedDatePanchang.vikramSamvat}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-xs font-mukta">
                    {selectedDatePanchang.moonPhaseIcon} {selectedDatePanchang.pakshaFull}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white dark:bg-stone-800 border border-amber-300 text-[#78350f] dark:text-stone-200 font-mukta">
                    {selectedDatePanchang.ritu}
                  </span>
                </div>
              </div>

              {/* If there is a festival on this date -> Big Prominent Showcase Card */}
              {selectedDatePanchang.events.length > 0 && (
                <div 
                  onClick={() => handleOpenFestivalDetail(selectedDatePanchang.events[0])}
                  className="group relative rounded-2xl overflow-hidden p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all border border-amber-300"
                >
                  <img
                    src={selectedDatePanchang.events[0].image}
                    alt={selectedDatePanchang.events[0].hindiName}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
                        🌟 आज का पावन महापर्व
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl font-black text-amber-200">
                        {selectedDatePanchang.events[0].title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-200 line-clamp-2">
                        {selectedDatePanchang.events[0].subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 shrink-0"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>संपूर्ण विधि, कथा व आरती देखें →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6 Core Limbs of Panchang (पंचांग के 5 अंग + सूर्य-चंद्र समय) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs sm:text-sm font-mukta">
                {/* 1. Tithi */}
                <div className="p-3 bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">🗓️ पावन तिथि</span>
                  <p className="font-serif font-black text-sm sm:text-base text-[#78350f] dark:text-stone-100">
                    {selectedDatePanchang.tithiName}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{selectedDatePanchang.pakshaFull}</p>
                </div>

                {/* 2. Nakshatra */}
                <div className="p-3 bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">✨ नक्षत्र</span>
                  <p className="font-serif font-black text-sm sm:text-base text-[#78350f] dark:text-stone-100">
                    {selectedDatePanchang.nakshatra}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{selectedDatePanchang.nakshatraTiming}</p>
                </div>

                {/* 3. Yoga & Karana */}
                <div className="p-3 bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">🧘 योग व करण</span>
                  <p className="font-serif font-black text-sm sm:text-base text-[#78350f] dark:text-stone-100">
                    {selectedDatePanchang.yoga}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">करण: {selectedDatePanchang.karana}</p>
                </div>

                {/* 4. Sunrise & Sunset */}
                <div className="p-3 bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">🌅 सूर्योदय व सूर्यास्त</span>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    सूर्योदय: {selectedDatePanchang.sunrise}
                  </p>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    सूर्यास्त: {selectedDatePanchang.sunset}
                  </p>
                </div>

                {/* 5. Moonrise & Moonset */}
                <div className="p-3 bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">🌙 चंद्रोदय व चंद्रास्त</span>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    चंद्रोदय: {selectedDatePanchang.moonrise}
                  </p>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    चंद्रास्त: {selectedDatePanchang.moonset}
                  </p>
                </div>

                {/* 6. Abhijit Muhurat & Rahu Kaal */}
                <div className="p-3 bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs space-y-0.5">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">⏰ शुभ व अशुभ काल</span>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">
                    अभिजित: {selectedDatePanchang.abhijitMuhurat}
                  </p>
                  <p className="text-[11px] text-red-700 dark:text-red-400 font-bold">
                    राहुकाल: {selectedDatePanchang.rahuKaal}
                  </p>
                </div>
              </div>

              {/* Auspicious Choghadiya Strip */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-300/80 dark:border-stone-700 flex items-center justify-between text-xs text-[#78350f] dark:text-amber-200 flex-wrap gap-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>दिन का श्रेष्ठ चौघड़िया:</span>
                  <span className="font-normal">{selectedDatePanchang.choghadiyaDay}</span>
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {selectedDatePanchang.amritKaal}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. VIEW 2: MONTHLY FESTIVALS DIRECTORY (मासिक पर्व व व्रत सूची) */}
        {activeView === 'festival-list' && (
          <div className="space-y-4 animate-fade-in">
            {/* Scope Switcher: All 2026 vs Selected Month */}
            <div className="flex items-center gap-2 p-1.5 bg-white/90 dark:bg-stone-900/90 rounded-2xl border border-amber-300 dark:border-stone-800 shadow-xs">
              <button
                type="button"
                onClick={() => setFestivalScope('year')}
                className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold font-mukta transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  festivalScope === 'year'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black shadow-md scale-[1.01]'
                    : 'text-[#78350f] dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
                }`}
              >
                <span>🌟 सम्पूर्ण वर्ष 2026</span>
                <span className="text-[11px] opacity-80 font-mono">({PANCHANG_CALENDAR_2026.length} पावन पर्व)</span>
              </button>
              <button
                type="button"
                onClick={() => setFestivalScope('month')}
                className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold font-mukta transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  festivalScope === 'month'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black shadow-md scale-[1.01]'
                    : 'text-[#78350f] dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
                }`}
              >
                <span>📅 {activeMonthInfo.hi} 2026</span>
                <span className="text-[11px] opacity-80 font-mono">({currentMonthEvents.length} पर्व)</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पर्व, व्रत या तिथि खोजें (उदा. छठ, दीपावली, एकादशी, शिवरात्रि, राम नवमी)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                  title="हटाएं"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: '🌟 समस्त पावन पर्व', count: scopeEvents.length },
                { id: 'mahaparv', label: '🔱 महापर्व', count: scopeEvents.filter(e => e.category === 'mahaparv').length },
                { id: 'vrat', label: '🌸 व्रत व एकादशी', count: scopeEvents.filter(e => e.category === 'vrat').length },
                { id: 'puja', label: '🪔 विशेष पूजा', count: scopeEvents.filter(e => e.category === 'puja').length },
                { id: 'jayanti', label: '🚩 पावन जयंती', count: scopeEvents.filter(e => e.category === 'jayanti').length }
              ].map((cat) => {
                const isActive = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 shadow-sm scale-105 font-black'
                        : 'bg-white dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="ml-1 opacity-70 text-[10px]">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Festival Cards Grid or Empty State */}
            {displayedEvents.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-amber-200 dark:border-stone-800 space-y-3">
                <span className="text-3xl block">🔍</span>
                <h4 className="font-serif font-black text-base text-amber-950 dark:text-amber-200">
                  कोई पर्व या व्रत नहीं मिला
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {festivalScope === 'month' 
                    ? `${activeMonthInfo.hi} माह में इस श्रेणी का कोई पर्व नहीं है। सम्पूर्ण वर्ष 2026 की सूची देखें।` 
                    : 'कृपया खोज शब्द बदलें अथवा समस्त पावन पर्व देखें।'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setFestivalScope('year');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs cursor-pointer shadow-sm"
                >
                  सम्पूर्ण वर्ष 2026 के सभी पर्व देखें
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
                      className="group bg-white dark:bg-stone-900 rounded-2xl p-3.5 sm:p-4 border border-[#fed7aa] dark:border-stone-800 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer flex gap-3.5 items-center select-none"
                    >
                      {/* Thumbnail Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-stone-950 border border-amber-200 dark:border-stone-700">
                        <img
                          src={event.image}
                          alt={event.hindiName}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&q=80';
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

                        <h4 className="font-serif text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-tight truncate">
                          {event.title}
                        </h4>

                        <p className="font-mukta text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                          {event.subtitle}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold text-[10px]">
                            शास्त्र सम्मत विधि व कथा
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-black text-xs group-hover:translate-x-1 transition-transform">
                            विस्तार देखें →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 7. VIEW 3: SHUBH MUHURAT 2026 DIRECTORY (शुभ मुहूर्त 2026) */}
        {activeView === 'shubh-muhurat' && (
          <div className="space-y-4 animate-fade-in">
            {/* Muhurat Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {SHUBH_MUHURATS_2026.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedMuhuratCat(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold font-mukta whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    selectedMuhuratCat === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black shadow-md scale-105'
                      : 'bg-white dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 text-[#78350f] dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Category Details */}
            {(() => {
              const currentCat = SHUBH_MUHURATS_2026.find(c => c.id === selectedMuhuratCat) || SHUBH_MUHURATS_2026[0];
              return (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 dark:border-stone-800 shadow-lg space-y-5">
                  <div className="border-b border-amber-200 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentCat.icon}</span>
                      <h3 className="font-serif text-lg sm:text-xl font-black text-[#78350f] dark:text-amber-200">
                        {currentCat.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#9a3412] dark:text-stone-400 font-mukta mt-1">
                      {currentCat.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentCat.months.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-2.5">
                        <h4 className="font-serif font-black text-xs sm:text-sm text-amber-900 dark:text-amber-300 border-l-4 border-amber-500 pl-2">
                          {m.monthName}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {m.dates.map((d, dIdx) => (
                            <div 
                              key={dIdx}
                              className="p-3 rounded-2xl bg-[#fffaf3] dark:bg-stone-800/80 border border-[#fed7aa] dark:border-stone-700 space-y-1 shadow-2xs hover:border-amber-400 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-serif font-black text-sm text-[#78350f] dark:text-stone-100">
                                  {d.formatted}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300">
                                  {d.tithi}
                                </span>
                              </div>
                              <p className="text-xs text-[#9a3412] dark:text-stone-300 font-mukta">
                                नक्षत्र: <strong>{d.nakshatra}</strong>
                              </p>
                              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold font-mukta">
                                {d.timing}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </main>

    </div>
  );
};
