import React from 'react';
import { Home, Music, MessageSquareQuote, BookOpenCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Sacred Golden Lotus ॐ Icon for the floating center button (Screenshot 2)
const LotusOmIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Lotus Petals Base Glow */}
    <ellipse cx="50" cy="50" rx="46" ry="46" fill="#fffaf0" />
    {/* Outer Sacred Orange Petals */}
    <path d="M50 14 C 38 28, 38 50, 50 64 C 62 50, 62 28, 50 14 Z" fill="#ea580c" />
    <path d="M24 30 C 18 46, 32 64, 48 68 C 42 54, 34 38, 24 30 Z" fill="#f97316" />
    <path d="M76 30 C 82 46, 68 64, 52 68 C 58 54, 66 38, 76 30 Z" fill="#f97316" />
    <path d="M12 55 C 18 68, 36 75, 48 72 C 36 67, 24 59, 12 55 Z" fill="#f59e0b" />
    <path d="M88 55 C 82 68, 64 75, 52 72 C 64 67, 76 59, 88 55 Z" fill="#f59e0b" />
    {/* Inner Golden Petals */}
    <path d="M50 24 C 41 36, 41 52, 50 62 C 59 52, 59 36, 50 24 Z" fill="#fbbf24" />
    {/* Center Sacred Om Symbol */}
    <text x="50" y="58" textAnchor="middle" fill="#78350f" fontSize="26" fontWeight="bold" fontFamily="serif">ॐ</text>
  </svg>
);

interface MobileNavProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenJapMala?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab = 'home',
  onNavigate,
  onOpenJapMala
}) => {
  const { language } = useLanguage();

  const labels = {
    hi: { home: 'होम', music: 'संगीत', vichar: 'विचार', paath: 'पाठ' },
    en: { home: 'Home', music: 'Music', vichar: 'Wisdom', paath: 'Paath' },
    bho: { home: 'होम', music: 'संगीत', vichar: 'विचार', paath: 'पाठ' },
    mai: { home: 'होम', music: 'संगीत', vichar: 'विचार', paath: 'पाठ' },
    mag: { home: 'होम', music: 'संगीत', vichar: 'विचार', paath: 'पाठ' },
  }[language] || { home: 'होम', music: 'संगीत', vichar: 'विचार', paath: 'पाठ' };

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const handleLotusClick = () => {
    if (onOpenJapMala) {
      onOpenJapMala();
    } else {
      window.dispatchEvent(new CustomEvent('open_jap_mala'));
    }
  };

  return (
    <nav 
      aria-label="सनातन मोबाइल मुख्य नेविगेशन"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#fdf6ee] via-[#fffaf5] to-[#fdf6ee]/95 backdrop-blur-xl border-t border-[#fed7aa]/80 py-1.5 px-3 shadow-2xl"
    >
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* Tab 1: होम */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[58px] transition-all active:scale-95 ${
            activeTab === 'home' ? 'text-[#9a3412] font-bold' : 'text-[#78350f]/60 hover:text-[#9a3412]'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5] scale-105 text-[#9a3412]' : 'stroke-2'}`} />
          <span className="text-[11px] font-mukta font-bold mt-0.5 leading-none">
            {labels.home}
          </span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-0.5" />
          )}
        </button>

        {/* Tab 2: संगीत (Devotional Songs & Music with Music Icon, NOT Chhath) */}
        <button
          onClick={() => handleNav('music')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[58px] transition-all active:scale-95 ${
            activeTab === 'music' || activeTab === 'chhath' ? 'text-[#9a3412] font-bold' : 'text-[#78350f]/60 hover:text-[#9a3412]'
          }`}
        >
          <Music className={`w-5 h-5 ${activeTab === 'music' || activeTab === 'chhath' ? 'stroke-[2.5] scale-105 text-[#ea580c]' : 'stroke-2'}`} />
          <span className="text-[11px] font-mukta font-bold mt-0.5 leading-none">
            {labels.music}
          </span>
          {(activeTab === 'music' || activeTab === 'chhath') && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-0.5" />
          )}
        </button>

        {/* Center Floating Lotus ॐ Button (Screenshot 2) */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            type="button"
            onClick={handleLotusClick}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-200 p-0.5 shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-amber-100/70 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="108 डिजिटल जप माला"
          >
            <LotusOmIcon className="w-10 h-10 drop-shadow-sm" />
          </button>
        </div>

        {/* Tab 3: विचार (Screenshot 2) */}
        <button
          onClick={() => handleNav('shubh-vichar')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[58px] transition-all active:scale-95 ${
            activeTab === 'shubh-vichar' ? 'text-[#9a3412] font-bold' : 'text-[#78350f]/60 hover:text-[#9a3412]'
          }`}
        >
          <MessageSquareQuote className={`w-5 h-5 ${activeTab === 'shubh-vichar' ? 'stroke-[2.5] scale-105 text-[#9a3412]' : 'stroke-2'}`} />
          <span className="text-[11px] font-mukta font-bold mt-0.5 leading-none">
            {labels.vichar}
          </span>
          {activeTab === 'shubh-vichar' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-0.5" />
          )}
        </button>

        {/* Tab 4: पाठ (Screenshot 2) */}
        <button
          onClick={() => handleNav('paath-chalisa')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[58px] transition-all active:scale-95 ${
            activeTab === 'paath-chalisa' ? 'text-[#9a3412] font-bold' : 'text-[#78350f]/60 hover:text-[#9a3412]'
          }`}
        >
          <BookOpenCheck className={`w-5 h-5 ${activeTab === 'paath-chalisa' ? 'stroke-[2.5] scale-105 text-[#9a3412]' : 'stroke-2'}`} />
          <span className="text-[11px] font-mukta font-bold mt-0.5 leading-none">
            {labels.paath}
          </span>
          {activeTab === 'paath-chalisa' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
