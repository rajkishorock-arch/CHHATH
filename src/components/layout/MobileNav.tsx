import React from 'react';
import { Home, Film, Sun, Music, User } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';

interface MobileNavProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab = 'home',
  onNavigate
}) => {
  const { reelsPlatformOpen, openReelsPlatform } = useReels();

  const items = [
    { id: 'home', label: 'होम', icon: Home, href: '#home' },
    { id: 'reels', label: 'रील्स', icon: Film, href: '#reels' },
    { id: 'music', label: 'संगीत', icon: Music, href: '#music' },
    { id: 'arghya', label: 'अर्घ्य', icon: Sun, href: '#arghya' },
    { id: 'my-chhath', label: 'मेरी छठ', icon: User, href: '#my-chhath' }
  ];

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === 'reels') {
      openReelsPlatform('foryou');
      return;
    }
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <nav 
      aria-label="मोबाइल मुख्य नेविगेशन"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 dark:bg-stone-950/95 backdrop-blur-xl border-t border-amber-500/20 py-1.5 px-2 shadow-2xl transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'reels' ? reelsPlatformOpen : (activeTab === item.id && !reelsPlatformOpen);
          const isReels = item.id === 'reels';

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleClick(e, item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] min-h-[46px] text-decoration-none transition-all active:scale-95 ${
                isActive 
                  ? 'text-amber-400 font-bold bg-amber-500/15 shadow-sm' 
                  : isReels
                    ? 'text-stone-300 hover:text-amber-400'
                    : 'text-stone-400 hover:text-amber-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-105' : 'stroke-2'}`} />
                {isReels && (
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-orange-500 to-rose-500" />
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-mukta font-bold mt-0.5 leading-none ${isActive ? 'text-amber-300' : ''}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

