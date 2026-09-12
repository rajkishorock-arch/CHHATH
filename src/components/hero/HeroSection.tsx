import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { CountdownCard } from './CountdownCard';
import { Music, Compass, Flame, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const { togglePlay, isPlaying } = useAudio();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 py-16 overflow-hidden">
      
      {/* Cinematic Background with Sunset/Sunrise Mist & River Ghat */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/images/hero_sunrise.jpg')`,
        }}
      >
        {/* Warm devotional gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-orange-950/40"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/30 to-stone-950/80"></div>
      </div>

      {/* Rotating Sacred Surya Mandala in Background (पारंपरिक तेजोमय सूर्य चक्र) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20 dark:opacity-25 animate-mandala-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full text-amber-400">
          <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* 12 Solar Rays / Petals */}
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M 100 20 L 95 45 L 105 45 Z"
              fill="currentColor"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Floating Sacred Diyas with Traditional Flicker Animation */}
      <div className="absolute bottom-12 left-10 hidden sm:block animate-float-diya pointer-events-none opacity-90">
        <div className="relative animate-diya-flicker">
          <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">🪔</span>
          <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-lg animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-20 right-14 hidden sm:block animate-float-diya pointer-events-none opacity-90" style={{ animationDelay: '2.5s' }}>
        <div className="relative animate-diya-flicker">
          <span className="text-5xl filter drop-shadow-[0_0_18px_rgba(234,88,12,0.8)]">🪔</span>
          <div className="absolute -inset-2 bg-orange-400/30 rounded-full blur-lg animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6 pt-4">
        
        {/* Royal Imperial Seal & Vedic Badge */}
        <div className="flex flex-col items-center gap-3">
          
          {/* Imperial Solar Seal Crest */}
          <div className="relative w-20 h-20 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 animate-mandala-slow"></div>
            <div className="absolute inset-1.5 rounded-full border border-yellow-200/40 animate-mandala-reverse"></div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-0.5 shadow-2xl shadow-yellow-500/50 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-stone-950/90 flex items-center justify-center">
                <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-diya-flicker">🌅</span>
              </div>
            </div>
          </div>

          {/* Luxury 24K Gold Edition Badge */}
          <div className="badge-royal swarna-gold-sheen">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-400 animate-diya-flicker" />
            <span>शाही महाअनुष्ठान • VEDIC HERITAGE EDITION 2026</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          </div>
        </div>

        {/* Main Sacred Heading with 24K Pure Gold Foil Metallic Sheen */}
        <div className="space-y-1">
          <h1 className="font-rozha text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight gold-foil-text drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] animate-in fade-in duration-700">
            {t.heroHeading}
          </h1>
          <div className="text-xs sm:text-sm font-mukta tracking-[0.28em] uppercase font-bold text-amber-300/90 drop-shadow">
            ॥ श्री सूर्य षष्ठी महाव्रत • आस्था, साधना व श्रद्धा का अनंत प्रवाह ॥
          </div>
        </div>

        {/* Subtitle with High-Class Typographic Balance */}
        <p className="font-mukta text-base sm:text-xl text-stone-200/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
          {t.heroSubheading}
        </p>

        {/* Primary Call to Action Buttons in Royal Metallic Finishes */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          
          <a
            href="#timeline"
            className="btn-royal-gold"
          >
            <Compass className="w-5 h-5 text-stone-950" />
            <span>{t.exploreChhath}</span>
          </a>

          <button
            onClick={togglePlay}
            className="btn-royal-noir"
          >
            <Music className="w-5 h-5 text-amber-400" />
            <span>{isPlaying ? t.pauseSong : t.listenSongs}</span>
          </button>

        </div>

        {/* VIP Heritage Metric Ribbon (राजसी महापर्व मानक) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
          <div className="p-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-amber-500/30 shadow-lg flex flex-col items-center">
            <span className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">३६ घंटे</span>
            <span className="text-[11px] font-mukta text-stone-300 font-semibold">अखंड निर्जला तप</span>
          </div>
          <div className="p-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-amber-500/30 shadow-lg flex flex-col items-center">
            <span className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">४ पावन दिवस</span>
            <span className="text-[11px] font-mukta text-stone-300 font-semibold">नहाय-खाय से पारण</span>
          </div>
          <div className="p-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-amber-500/30 shadow-lg flex flex-col items-center">
            <span className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">११+ प्रमुख घाट</span>
            <span className="text-[11px] font-mukta text-stone-300 font-semibold">सटीक खगोलीय अर्घ्य</span>
          </div>
          <div className="p-3 rounded-2xl bg-stone-950/70 backdrop-blur-md border border-amber-500/30 shadow-lg flex flex-col items-center">
            <span className="font-rozha text-2xl sm:text-3xl font-bold text-amber-300">१००% सात्विक</span>
            <span className="text-[11px] font-mukta text-stone-300 font-semibold">शुद्ध सनातन परंपरा</span>
          </div>
        </div>

        {/* Dynamic Countdown Section */}
        <div className="pt-6">
          <CountdownCard />
        </div>

      </div>

      {/* Gentle River Water Ripple Shimmer at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none"></div>
    </section>
  );
};
