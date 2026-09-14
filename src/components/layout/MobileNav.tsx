import React from 'react';
import { Home, BookOpen, Sun, MapPin, User } from 'lucide-react';

interface MobileNavProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab = 'home',
  onNavigate
}) => {
  const items = [
    { id: 'home', label: 'होम', icon: Home, href: '#home' },
    { id: 'guide', label: 'गाइड', icon: BookOpen, href: '#guide' },
    { id: 'arghya', label: 'अर्घ्य', icon: Sun, href: '#arghya' },
    { id: 'ghats', label: 'घाट', icon: MapPin, href: '#ghats' },
    { id: 'my-chhath', label: 'मेरी छठ', icon: User, href: '#my-chhath' }
  ];

  const handleClick = (e: React.MouseEvent, id: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    }
  };

  return (
    <nav 
      aria-label="मोबाइल मुख्य नेविगेशन"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl border-t border-amber-500/20 py-2 px-2 shadow-2xl"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleClick(e, item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] min-h-[44px] text-decoration-none transition-all ${
                isActive 
                  ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/15' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] font-mukta font-bold mt-0.5 leading-none">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

