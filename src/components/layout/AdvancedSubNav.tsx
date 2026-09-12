import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Calendar, 
  Sun, 
  Music, 
  CheckSquare, 
  UtensilsCrossed, 
  MapPin, 
  Send 
} from 'lucide-react';

export const AdvancedSubNav: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isSticky, setIsSticky] = useState(false);

  const navTabs = [
    { id: 'bento-hub', label: 'त्वरित हब', icon: Sparkles, href: '#bento-hub' },
    { id: 'timeline', label: t.navTimeline, icon: Calendar, href: '#timeline' },
    { id: 'arghya-times', label: t.navArghya, icon: Sun, href: '#arghya-times' },
    { id: 'virtual-arghya', label: 'आभासी अर्घ्य', icon: Sparkles, href: '#virtual-arghya' },
    { id: 'songs', label: t.navSongs, icon: Music, href: '#songs' },
    { id: 'samagri', label: t.navSamagri, icon: CheckSquare, href: '#samagri' },
    { id: 'prasad', label: t.navPrasad, icon: UtensilsCrossed, href: '#prasad' },
    { id: 'ghats', label: t.navGhats, icon: MapPin, href: '#ghats' },
    { id: 'sankalp-wall', label: 'मन्नत पट्टिका', icon: Send, href: '#sankalp-wall' },
    { id: 'blessing-certificate', label: 'आशीष पत्र', icon: Sparkles, href: '#blessing-certificate' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Determine if sticky past hero
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 450);

      // Section spy
      const sectionIds = ['bento-hub', 'timeline', 'arghya-times', 'virtual-arghya', 'songs', 'samagri', 'prasad', 'ghats', 'sankalp-wall', 'blessing-certificate'];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 130;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`transition-all duration-300 z-40 ${
        isSticky
          ? 'sticky top-20 chhath-glass backdrop-blur-xl border-b border-amber-500/20 py-2.5 shadow-lg shadow-black/10'
          : 'relative bg-gradient-to-b from-stone-950 to-transparent py-3'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto scrollbar-none py-1 px-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;

            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleScrollTo(e, tab.href)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mukta font-bold whitespace-nowrap transition-all duration-200 text-decoration-none ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                    : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:bg-orange-500/15 hover:text-orange-600 dark:hover:text-amber-400 border border-amber-500/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-yellow-200' : 'text-amber-500'}`} />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
