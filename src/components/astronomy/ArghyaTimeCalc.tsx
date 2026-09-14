import React, { useState, useEffect, useMemo } from 'react';
import { cityArghyaData } from '../../data/astronomy';
import { Sun, Sunset, Sunrise, CloudSun, MapPin, Search, Sparkles, Bell, Clock, Compass, Wind, Thermometer, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useChhathData } from '../../context/ChhathDataContext';

export const ArghyaTimeCalc: React.FC = () => {
  const { t } = useLanguage();
  
  // Safely check default city from ChhathDataContext
  let initialCityIdx = 0;
  try {
    const { userLocation } = useChhathData();
    if (userLocation && userLocation.city) {
      const idx = cityArghyaData.findIndex(c => 
        c.cityName.toLowerCase().includes(userLocation.city.toLowerCase())
      );
      if (idx !== -1) initialCityIdx = idx;
    }
  } catch {
    initialCityIdx = 0;
  }

  const [selectedCityIdx, setSelectedCityIdx] = useState(initialCityIdx);
  const [searchQuery, setSearchQuery] = useState('');

  const city = cityArghyaData[selectedCityIdx] || cityArghyaData[0];

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cityArghyaData;
    const q = searchQuery.toLowerCase().trim();
    return cityArghyaData.filter(c => 
      c.cityName.toLowerCase().includes(q) || 
      c.state.toLowerCase().includes(q) ||
      c.river.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // IST Live Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    phase: 'sandhya' | 'usha' | 'completed';
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, phase: 'sandhya' });

  useEffect(() => {
    const updateCountdown = () => {
      // Parse 15 Nov Sandhya Sunset time (e.g., "17:02 PM")
      const [sandhyaH, sandhyaM] = city.sandhyaSunset.replace(/[^0-9:]/g, '').split(':').map(Number);
      const sandhyaDate = new Date(`2026-11-15T${String(sandhyaH).padStart(2, '0')}:${String(sandhyaM).padStart(2, '0')}:00+05:30`);

      // Parse 16 Nov Usha Sunrise time (e.g., "06:08 AM")
      const [ushaH, ushaM] = city.ushaSunrise.replace(/[^0-9:]/g, '').split(':').map(Number);
      const ushaDate = new Date(`2026-11-16T${String(ushaH).padStart(2, '0')}:${String(ushaM).padStart(2, '0')}:00+05:30`);

      const nowMs = Date.now();

      let targetDate: Date;
      let phase: 'sandhya' | 'usha' | 'completed' = 'sandhya';

      if (nowMs < sandhyaDate.getTime()) {
        targetDate = sandhyaDate;
        phase = 'sandhya';
      } else if (nowMs < ushaDate.getTime()) {
        targetDate = ushaDate;
        phase = 'usha';
      } else {
        targetDate = ushaDate;
        phase = 'completed';
      }

      if (phase === 'completed') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, phase: 'completed' });
        return;
      }

      const diffMs = Math.max(0, targetDate.getTime() - nowMs);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, phase });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [city]);

  return (
    <section id="arghya-times" className="section-padding relative overflow-hidden bg-gradient-to-b from-orange-500/5 via-amber-500/10 to-transparent">
      <div className="container-custom max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>शहरवार अर्घ्य समय कैलकुलेटर 2026</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100">
            अपने शहर में छठ अर्घ्य का समय
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            शहर चुनें और जानें संध्या अर्घ्य तथा उषा अर्घ्य का स्थानीय समय।
          </p>
        </div>

        {/* Search & City Dropdown Bar */}
        <div className="max-w-3xl mx-auto mb-8 bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="arghya-city-search" className="sr-only">शहर खोजें</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="arghya-city-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="शहर या राज्य का नाम खोजें..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Select Dropdown */}
            <div>
              <label htmlFor="arghya-city-select" className="sr-only">शहर चुनें</label>
              <select
                id="arghya-city-select"
                value={selectedCityIdx}
                onChange={(e) => setSelectedCityIdx(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-stone-900 dark:text-stone-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
              >
                {cityArghyaData.map((c, idx) => (
                  <option key={idx} value={idx}>
                    📍 {c.cityName} — {c.state}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Pill Chips for Popular Cities */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-stone-400 font-bold shrink-0">प्रमुख शहर:</span>
            {filteredCities.slice(0, 10).map((c) => {
              const originalIndex = cityArghyaData.findIndex(item => item.cityName === c.cityName);
              const isSelected = selectedCityIdx === originalIndex;
              return (
                <button
                  key={c.cityName}
                  onClick={() => setSelectedCityIdx(originalIndex)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500/20 border border-amber-500/20'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{c.cityName.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Live Countdown Section (IST Based) */}
        <div className="max-w-4xl mx-auto mb-10 p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white border border-amber-500/40 shadow-2xl relative overflow-hidden text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>लाइव काउंटर (Asia/Kolkata IST)</span>
          </div>

          <h3 className="font-rozha text-xl sm:text-2xl font-bold text-amber-200 mb-4" aria-live="polite">
            {timeLeft.phase === 'sandhya' && '🌇 संध्या अर्घ्य में अभी इतना समय बाकी है'}
            {timeLeft.phase === 'usha' && '🌅 उषा अर्घ्य में अभी इतना समय बाकी है'}
            {timeLeft.phase === 'completed' && '🙏 छठ महापर्व 2026 के दोनों मुख्य अर्घ्य संपन्न हो चुके हैं'}
          </h3>

          {timeLeft.phase !== 'completed' ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto font-rozha">
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-2xl sm:text-4xl font-black text-amber-400 block">{timeLeft.days}</span>
                <span className="text-[10px] sm:text-xs font-mukta text-stone-300 uppercase tracking-wider">दिन</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-2xl sm:text-4xl font-black text-amber-400 block">{timeLeft.hours}</span>
                <span className="text-[10px] sm:text-xs font-mukta text-stone-300 uppercase tracking-wider">घंटे</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-2xl sm:text-4xl font-black text-amber-400 block">{timeLeft.minutes}</span>
                <span className="text-[10px] sm:text-xs font-mukta text-stone-300 uppercase tracking-wider">मिनट</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-2xl sm:text-4xl font-black text-amber-400 block">{timeLeft.seconds}</span>
                <span className="text-[10px] sm:text-xs font-mukta text-stone-300 uppercase tracking-wider">सेकंड</span>
              </div>
            </div>
          ) : (
            <p className="font-mukta text-sm text-amber-300/80">
              जय छठी मईया! भगवान सूर्यदेव का दिव्य आशीर्वाद आपके परिवार पर सदैव बना रहे।
            </p>
          )}
        </div>

        {/* Selected City Context Banner */}
        <div className="max-w-4xl mx-auto mb-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-bold text-lg">
              📍
            </div>
            <div>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                वर्तमान चयनित नगर
              </span>
              <h3 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-200">
                {city.cityName} ({city.state})
              </h3>
              <span className="text-xs text-stone-600 dark:text-stone-300 font-mukta">
                प्रमुख अर्घ्य तट: <strong>{city.river}</strong>
              </span>
            </div>
          </div>

          <div className="text-xs font-mukta text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 p-3 rounded-xl border border-amber-500/20 w-full sm:w-auto space-y-1">
            <div>🗓 <strong>15 नवंबर 2026:</strong> संध्या अर्घ्य — सूर्यास्त: <span className="text-red-600 dark:text-red-400 font-bold">{city.sandhyaSunset}</span></div>
            <div>🗓 <strong>16 नवंबर 2026:</strong> उषा अर्घ्य — सूर्योदय: <span className="text-amber-600 dark:text-amber-400 font-bold">{city.ushaSunrise}</span></div>
          </div>
        </div>

        {/* Two Prominent Arghya Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          
          {/* Card A: Sandhya Arghya */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 border-2 border-red-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/15 text-red-700 dark:text-red-400 text-xs font-bold border border-red-500/30">
                  <Sunset className="w-4 h-4 text-red-500" />
                  <span>प्रथम अर्घ्य (अस्ताचल)</span>
                </span>
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">15 नवंबर 2026</span>
              </div>

              <div>
                <h3 className="font-rozha text-3xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>🌇 संध्या अर्घ्य</span>
                </h3>
                <p className="text-xs font-mukta text-stone-600 dark:text-stone-300 mt-1">
                  कार्तिक शुक्ल षष्ठी (रविवार) — अस्ताचलगामी सूर्य को प्रथम अर्घ्य।
                </p>
              </div>

              {/* Time Display */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-red-500/20 text-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  स्थानीय सूर्यास्त समय ({city.cityName.split('(')[0].trim()})
                </span>
                <div className="font-rozha text-4xl sm:text-5xl font-black text-red-600 dark:text-orange-400 tracking-tight">
                  {city.sandhyaSunset}
                </div>
                <span className="text-[11px] text-stone-500 font-mukta block mt-1">
                  समय सीमा: IST (भारतीय मानक समय)
                </span>
              </div>

              <div className="text-xs font-mukta text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>स्थान: {city.cityName}, {city.state} ({city.river})</span>
              </div>
            </div>

            {/* Reminder CTA */}
            <div className="pt-4 border-t border-red-500/20">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`छठ संध्या अर्घ्य - ${city.cityName}`)}&dates=20261115T110000Z/20261115T123000Z&details=${encodeURIComponent(`कार्तिक शुक्ल षष्ठी छठ संध्या अर्घ्य। सूर्यास्त समय: ${city.sandhyaSunset}। कृपया समय से 30 मिनट पूर्व घाट पर पहुंचें।`)}&location=${encodeURIComponent(`${city.cityName}, ${city.river}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-md text-decoration-none"
              >
                <Bell className="w-4 h-4" />
                <span>संध्या अर्घ्य गूगल कैलेंडर रिमाइंडर सेट करें</span>
              </a>
            </div>
          </div>

          {/* Card B: Usha Arghya */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/15 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Sunrise className="w-4 h-4 text-amber-500" />
                  <span>द्वितीय अर्घ्य (उदीयमान)</span>
                </span>
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">16 नवंबर 2026</span>
              </div>

              <div>
                <h3 className="font-rozha text-3xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>🌅 उषा अर्घ्य</span>
                </h3>
                <p className="text-xs font-mukta text-stone-600 dark:text-stone-300 mt-1">
                  कार्तिक शुक्ल सप्तमी (सोमवार) — उदीयमान सूर्य को अंतिम अर्घ्य व पारण।
                </p>
              </div>

              {/* Time Display */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-amber-500/20 text-center">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  स्थानीय सूर्योदय समय ({city.cityName.split('(')[0].trim()})
                </span>
                <div className="font-rozha text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                  {city.ushaSunrise}
                </div>
                <span className="text-[11px] text-stone-500 font-mukta block mt-1">
                  समय सीमा: IST (भारतीय मानक समय)
                </span>
              </div>

              <div className="text-xs font-mukta text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>स्थान: {city.cityName}, {city.state} ({city.river})</span>
              </div>
            </div>

            {/* Reminder CTA */}
            <div className="pt-4 border-t border-amber-500/20">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`छठ उषा अर्घ्य व पारण - ${city.cityName}`)}&dates=20261116T003000Z/20261116T020000Z&details=${encodeURIComponent(`कार्तिक शुक्ल सप्तमी छठ उषा अर्घ्य। सूर्योदय समय: ${city.ushaSunrise}। कृपया सूर्योदय पूर्व घाट पर पहुंचें।`)}&location=${encodeURIComponent(`${city.cityName}, ${city.river}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-all shadow-md text-decoration-none"
              >
                <Bell className="w-4 h-4" />
                <span>उषा अर्घ्य गूगल कैलेंडर रिमाइंडर सेट करें</span>
              </a>
            </div>
          </div>

        </div>

        {/* Weather & Arghya Advisory Banner */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                {city.cityName} मौसम एवं क्षितिज पूर्वानुमान
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                {city.weatherCondition} • {city.weatherTemp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-600 dark:text-stone-300 font-mukta">
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-stone-400" />
              <span>पवन: 7 किमी/घंटा</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              <span>वर्षा: 0% (शुष्क)</span>
            </div>
          </div>
        </div>

        {/* Devotional Note */}
        <div className="max-w-4xl mx-auto mt-4 flex items-center gap-2 text-xs text-stone-500 font-mukta">
          <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
          <span>
            विशेष सूचना: सूर्योदय व सूर्यास्त का सटीक समय प्रत्येक नगर के अक्षांश-देशांतर (Latitude/Longitude) पर निर्भर करता है। घाट पर भीड़भाड़ को ध्यान में रखते हुए अर्घ्य समय से कम से कम 30 मिनट पूर्व पहुंचना उत्तम रहता है।
          </span>
        </div>

      </div>
    </section>
  );
};


