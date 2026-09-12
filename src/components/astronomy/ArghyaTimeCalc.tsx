import React, { useState } from 'react';
import { cityArghyaData } from '../../data/astronomy';
import { Sun, Sunset, Sunrise, CloudSun, MapPin, Wind, Thermometer, AlertCircle, Sparkles, Bell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ArghyaTimeCalc: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const city = cityArghyaData[selectedCityIdx];

  return (
    <section id="arghya-times" className="section-padding relative overflow-hidden bg-gradient-to-b from-orange-500/5 via-amber-500/10 to-transparent">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <Sun className="w-3.5 h-3.5" />
            <span>{t.arghyaBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.arghyaTimeTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            {t.arghyaSubtitle}
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {cityArghyaData.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCityIdx(idx)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCityIdx === idx
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-orange-500/15 border border-amber-500/20'
              }`}
            >
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{c.cityName.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Arghya Card with Solar Arc Animation */}
        <div className="chhath-card p-6 sm:p-10 w-full max-w-6xl mx-auto border-amber-500/30 shadow-2xl relative overflow-hidden paramprik-border">
          
          {/* Traditional Decorative Corner Accents */}
          <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-serif select-none pointer-events-none">卐</div>
          <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-serif select-none pointer-events-none">卐</div>
          <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs font-serif select-none pointer-events-none">卐</div>
          <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs font-serif select-none pointer-events-none">卐</div>
          
          {/* Top selected location header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-amber-500/20">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-orange-600 dark:text-amber-400">
                {t.selectedLocation} • {city.state}
              </span>
              <h3 className="font-rozha text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-bold">
                {city.cityName}
              </h3>
              <span className="text-xs font-mukta text-stone-500 dark:text-stone-400">
                {t.riverBank}: {city.river}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-300 swarna-gold-sheen">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>कार्तिक शुक्ल षष्ठी-सप्तमी 2026</span>
            </div>
          </div>

          {/* Animated Traditional Solar Path Arc */}
          <div className="my-10 relative">
            {/* Sacred Ganga Wave Ambient Line */}
            <div className="w-full h-28 border-b-2 border-dashed border-amber-400/50 relative flex items-center justify-between">
              
              {/* Usha Sunrise Node (Morning Arghya) */}
              <div className="flex flex-col items-center -mb-6 z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-300 flex items-center justify-center shadow-lg shadow-amber-400/60 animate-diya-flicker ring-2 ring-amber-300/60">
                  <Sunrise className="w-7 h-7 text-amber-950" />
                </div>
                <span className="text-xs font-bold mt-2 text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <span>{t.ushaArghya}</span>
                  <span className="text-[10px] text-amber-600 font-normal">(उदीयमान)</span>
                </span>
              </div>

              {/* Majestic Surya Mandala in Zenith */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                {/* Rotating Sacred Surya Mandala Rays */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full text-amber-500/40 animate-mandala-slow pointer-events-none"
                    fill="currentColor"
                  >
                    {/* 12 Aditya Sun Rays */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <path
                        key={deg}
                        d="M 50 12 L 53 28 L 47 28 Z"
                        transform={`rotate(${deg} 50 50)`}
                      />
                    ))}
                    <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                  
                  {/* Glowing Solar Core */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-2xl shadow-orange-500/70 animate-sun-pulse border-2 border-yellow-200/80">
                    <Sun className="w-8 h-8 text-amber-950 animate-mandala-slow" style={{ animationDuration: '30s' }} />
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                  <span className="text-[11px] font-rozha text-amber-800 dark:text-amber-300 font-bold tracking-wide">
                    ॐ सूर्याय नमः
                  </span>
                </div>
              </div>

              {/* Sandhya Sunset Node (Evening Arghya) */}
              <div className="flex flex-col items-center -mb-6 z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-red-500/60 animate-diya-flicker ring-2 ring-red-400/60">
                  <Sunset className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold mt-2 text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <span>{t.sandhyaArghya}</span>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-normal">(अस्ताचल)</span>
                </span>
              </div>

            </div>
          </div>

          {/* Timings Grid */}
          {/* Timings Grid with Live Calendar Alarm & Sync */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            
            {/* Sandhya Arghya */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 border border-red-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <Sunset className="w-4 h-4" />
                    <span>{t.sunsetTime}</span>
                  </span>
                  <span className="text-xs text-stone-400 font-mukta">15 Nov 2026</span>
                </div>
                <div className="font-rozha text-3xl sm:text-5xl font-black text-red-600 dark:text-orange-400 mb-1">
                  {city.sandhyaSunset}
                </div>
                <p className="text-xs font-mukta text-stone-600 dark:text-stone-300">
                  {t.sandhyaArghya} — अस्ताचलगामी सूर्य को प्रथम अर्घ्य (Sunset Arghya).
                </p>
              </div>

              {/* Calendar Sync & Alarm Buttons */}
              <div className="pt-4 mt-4 border-t border-red-500/20 flex flex-wrap items-center gap-2">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`छठ संध्या अर्घ्य - ${city.cityName}`)}&dates=20261115T110000Z/20261115T123000Z&details=${encodeURIComponent(`कार्तिक शुक्ल षष्ठी छठ संध्या अर्घ्य। सूर्यास्त समय: ${city.sandhyaSunset}। कृपया समय से 30 मिनट पूर्व घाट पर पहुंचें।`)}&location=${encodeURIComponent(`${city.cityName}, ${city.river}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-colors shadow-sm text-decoration-none"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Google Calendar रिमाइंडर</span>
                </a>
              </div>
            </div>

            {/* Usha Arghya */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Sunrise className="w-4 h-4" />
                    <span>{t.sunriseTime}</span>
                  </span>
                  <span className="text-xs text-stone-400 font-mukta">16 Nov 2026</span>
                </div>
                <div className="font-rozha text-3xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 mb-1">
                  {city.ushaSunrise}
                </div>
                <p className="text-xs font-mukta text-stone-600 dark:text-stone-300">
                  {t.ushaArghya} — उदीयमान सूर्य को प्रातः अर्घ्य व पारण (Sunrise Arghya).
                </p>
              </div>

              {/* Calendar Sync & Alarm Buttons */}
              <div className="pt-4 mt-4 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`छठ उषा अर्घ्य व पारण - ${city.cityName}`)}&dates=20261116T003000Z/20261116T020000Z&details=${encodeURIComponent(`कार्तिक शुक्ल सप्तमी छठ उषा अर्घ्य। सूर्योदय समय: ${city.ushaSunrise}। कृपया सूर्योदय पूर्व घाट पर पहुंचें।`)}&location=${encodeURIComponent(`${city.cityName}, ${city.river}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition-colors shadow-sm text-decoration-none"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Google Calendar रिमाइंडर</span>
                </a>
              </div>
            </div>

          </div>

          {/* Weather & Arghya Advisory */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                  {t.navArghya} Weather & Advisory
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                  {city.weatherCondition} • {city.weatherTemp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-600 dark:text-stone-300 font-mukta">
              <div className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-stone-400" />
                <span>Wind: 7 km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                <span>Rain: 0%</span>
              </div>
            </div>
          </div>

          {/* Devotional Note */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mukta">
            <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>
              नोट: सूर्योदय व सूर्यास्त समय स्थानीय क्षितिज के अनुसार 1-2 मिनट भिन्न हो सकते हैं। कृपया समय से 30 मिनट पूर्व घाट पर पहुंचें।
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

