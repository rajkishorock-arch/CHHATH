import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CountdownCard } from './CountdownCard';
import { Sun, BookOpen } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

interface HeroSectionProps {
  onNavigate?: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      const el = document.getElementById(tab);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-center items-center text-center px-4 py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent">
      
      {/* Authentic Sunrise Ghat Visual */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('${getImageUrl('/images/hero_sunrise.jpg')}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6">
        
        {/* Sacred Sun Emblem */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-amber-50 dark:bg-stone-950 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl filter drop-shadow">🌅</span>
            </div>
          </div>
          <span className="text-xs font-mukta font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            कार्तिक शुक्ल चतुर्थी से सप्तमी • महापर्व 2026
          </span>
        </div>

        {/* Clean Devotional Heading & Subheading */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="font-rozha text-4xl sm:text-6xl md:text-7xl font-black text-stone-...">
              छठ महापर्व 2026 — श्रद्धा, आस्था और सूर्य उपासना
          </h1>

          <p className="font-mukta text-lg sm:text-2xl text-stone-700 dark:text-stone-300 font-medium max-w-2xl mx-auto leading-relaxed">
            पूजा विधि, अर्घ्य समय, सामग्री और घाट की जानकारी—एक ही जगह।
          </p>
        </div>

        {/* Primary & Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/CHHATH/chhath-puja-vidhi/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('chhath-puja-vidhi');
            }}
            className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base shadow-md transition-all flex items-center gap-2 text-decoration-none min-h-[44px]"
          >
            <BookOpen className="w-5 h-5 text-stone-950" />
            <span>छठ पूजा विधि देखें</span>
          </a>

          <a
            href="/CHHATH/chhath-arghya-time-2026/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('chhath-arghya-time-2026');
            }}
            className="px-6 py-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-900 dark:text-amber-300 font-bold text-sm sm:text-base transition-all flex items-center gap-2 text-decoration-none min-h-[44px]"
          >
            <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>अर्घ्य समय देखें</span>
          </a>

          <a
            href="/CHHATH/chhath-samagri/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('chhath-samagri');
            }}
            className="px-5 py-3 rounded-full bg-stone-900/10 hover:bg-amber-500/15 dark:bg-stone-900 dark:hover:bg-stone-800 border border-amber-500/30 text-stone-800 dark:text-amber-200 font-bold text-xs sm:text-sm transition-all text-decoration-none min-h-[44px] flex items-center gap-1.5"
          >
            <span>पूजा सामग्री</span>
          </a>

          <a
            href="/CHHATH/thekua-recipe/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('thekua-recipe');
            }}
            className="px-5 py-3 rounded-full bg-stone-900/10 hover:bg-amber-500/15 dark:bg-stone-900 dark:hover:bg-stone-800 border border-amber-500/30 text-stone-800 dark:text-amber-200 font-bold text-xs sm:text-sm transition-all text-decoration-none min-h-[44px] flex items-center gap-1.5"
          >
            <span>ठेकुआ रेसिपी</span>
          </a>
        </div>

        {/* Compact Location-Aware Arghya Countdown Card */}
        <div className="pt-6 max-w-3xl mx-auto">
          <CountdownCard />
        </div>

      </div>
    </section>
  );
};

