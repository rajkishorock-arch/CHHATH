import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Bell, Heart, X, 
  ChevronRight, ArrowRight 
} from 'lucide-react';
import { ALL_VRATS_DATA, VratItem } from '../../data/allVratsData';
import { ALL_AARTIS_DATA } from '../../data/allAartisData';
import { CHALISA_PAATH_DATA } from '../../data/chalisaPaathData';
import { DailyPujaAlarmModal } from '../vrats/DailyPujaAlarmModal';

interface VratHomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenSidebarMenu: () => void;
}

// 1. Puja Vidhi Illustration - Sacred Kalash with Coconut and Mango Leaves
const KalashIllustration: React.FC<{ className?: string }> = ({ className = "w-11 h-11 sm:w-13 sm:h-13 mx-auto drop-shadow-xs" }) => (
  <svg viewBox="0 0 160 160" className={className}>
    <defs>
      <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="coconutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    <ellipse cx="80" cy="142" rx="38" ry="8" fill="#d97706" opacity="0.35" />
    <path d="M56 138 C 56 142, 104 142, 104 138 L 98 132 L 62 132 Z" fill="#b45309" />
    <path d="M50 78 C 30 92, 32 124, 60 134 L 100 134 C 128 124, 130 92, 110 78 Z" fill="url(#potGrad)" stroke="#78350f" strokeWidth="2" />
    <path d="M54 78 Q 80 82 106 78 L 102 70 Q 80 73 58 70 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
    <ellipse cx="80" cy="70" rx="24" ry="7" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
    <text x="80" y="112" textAnchor="middle" fill="#78350f" fontSize="22" fontWeight="bold" fontFamily="serif">ॐ</text>
    <path d="M80 68 C 65 52, 45 48, 38 52 C 45 62, 60 68, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 95 52, 115 48, 122 52 C 115 62, 100 68, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 72 45, 60 35, 52 38 C 60 52, 72 62, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 88 45, 100 35, 108 38 C 100 52, 88 62, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 76 40, 80 24, 80 24 C 80 24, 84 40, 80 68 Z" fill="#16a34a" stroke="#166534" strokeWidth="1" />
    <ellipse cx="80" cy="50" rx="18" ry="24" fill="url(#coconutGrad)" stroke="#451a03" strokeWidth="1.5" />
    <circle cx="80" cy="46" r="3" fill="#dc2626" />
  </svg>
);

// 2. Vrat Katha Illustration - Devotee Woman with Diya & Puja Thali
const VratKathaIllustration: React.FC<{ className?: string }> = ({ className = "w-11 h-11 sm:w-13 sm:h-13 mx-auto drop-shadow-xs" }) => (
  <svg viewBox="0 0 160 160" className={className}>
    <ellipse cx="80" cy="144" rx="42" ry="7" fill="#f59e0b" opacity="0.3" />
    <path d="M52 140 C 48 108, 56 90, 80 90 C 104 90, 112 108, 108 140 Z" fill="#ef4444" />
    <path d="M60 140 C 60 115, 70 100, 80 100 C 90 100, 100 115, 100 140 Z" fill="#f59e0b" opacity="0.9" />
    <path d="M56 74 C 54 48, 66 38, 80 38 C 94 38, 106 48, 104 74 C 104 94, 98 105, 96 112 L 64 112 C 62 105, 56 94, 56 74 Z" fill="#dc2626" />
    <path d="M62 48 Q 80 42 98 48" stroke="#fbbf24" strokeWidth="3" fill="none" />
    <ellipse cx="80" cy="62" rx="14" ry="17" fill="#fed7aa" />
    <circle cx="80" cy="54" r="2.5" fill="#dc2626" />
    <path d="M72 61 Q 75 64 78 61" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M82 61 Q 85 64 88 61" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M74 88 C 76 80, 84 80, 86 88 L 84 98 L 76 98 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
  </svg>
);

// 3. Aarti Illustration - Devotee Woman with Sincere Namaste Prayer
const AartiIllustration: React.FC<{ className?: string }> = ({ className = "w-11 h-11 sm:w-13 sm:h-13 mx-auto drop-shadow-xs" }) => (
  <svg viewBox="0 0 160 160" className={className}>
    <ellipse cx="80" cy="144" rx="40" ry="7" fill="#f59e0b" opacity="0.3" />
    <path d="M52 82 C 48 54, 60 40, 80 40 C 100 40, 112 54, 108 82 C 108 106, 102 126, 98 138 L 62 138 C 58 126, 52 106, 52 82 Z" fill="#b91c1c" />
    <path d="M58 52 Q 80 45 102 52" stroke="#f59e0b" strokeWidth="3" fill="none" />
    <ellipse cx="80" cy="68" rx="16" ry="19" fill="#fde68a" />
    <circle cx="80" cy="59" r="2.8" fill="#b91c1c" />
    <path d="M70 66 Q 74 69 78 66" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M82 66 Q 86 69 90 66" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M72 104 C 74 92, 86 92, 88 104 L 85 118 L 75 118 Z" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
    <rect x="73" y="112" width="14" height="4" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
  </svg>
);

// 4. Pujan Samagri Illustration - Traditional Brass Puja Thali
const SamagriIllustration: React.FC<{ className?: string }> = ({ className = "w-11 h-11 sm:w-13 sm:h-13 mx-auto drop-shadow-xs" }) => (
  <svg viewBox="0 0 160 160" className={className}>
    <ellipse cx="80" cy="138" rx="48" ry="9" fill="#b45309" opacity="0.3" />
    <ellipse cx="80" cy="118" rx="52" ry="22" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
    <ellipse cx="80" cy="116" rx="46" ry="18" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
    <path d="M50 110 Q 56 110 58 114 Q 50 116 46 114 Z" fill="#9a3412" stroke="#78350f" strokeWidth="1" />
    <path d="M58 108 Q 61 98 58 92 Q 55 98 57 108 Z" fill="#ea580c" />
    <circle cx="58" cy="100" r="2" fill="#fef08a" />
    <ellipse cx="78" cy="112" rx="10" ry="6" fill="#b45309" />
    <ellipse cx="78" cy="111" rx="8" ry="4" fill="#dc2626" />
    <ellipse cx="98" cy="114" rx="10" ry="6" fill="#b45309" />
    <ellipse cx="98" cy="113" rx="8" ry="4" fill="#eab308" />
    <circle cx="68" cy="120" r="5" fill="#f97316" />
  </svg>
);

// 5. Mantra Illustration - Meditating Yogi / Sadhak in Padmasana
const MantraIllustration: React.FC<{ className?: string }> = ({ className = "w-11 h-11 sm:w-13 sm:h-13 mx-auto drop-shadow-xs" }) => (
  <svg viewBox="0 0 160 160" className={className}>
    <circle cx="80" cy="78" r="42" fill="#fed7aa" opacity="0.4" />
    <circle cx="80" cy="78" r="32" fill="#fed7aa" opacity="0.6" />
    <circle cx="80" cy="50" r="13" fill="#292524" />
    <path d="M70 65 L 90 65 L 86 98 L 74 98 Z" fill="#292524" />
    <path d="M70 66 C 54 74, 52 94, 60 102 C 64 104, 70 100, 72 96" stroke="#292524" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M90 66 C 106 74, 108 94, 100 102 C 96 104, 90 100, 88 96" stroke="#292524" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M46 114 C 54 102, 106 102, 114 114 C 114 120, 46 120, 46 114 Z" fill="#292524" />
    <text x="80" y="32" textAnchor="middle" fill="#ea580c" fontSize="16" fontWeight="bold">ॐ</text>
  </svg>
);

// 6. Prasiddh Mandir Illustration - Traditional Hindu Mandir Shikhara
const TempleIllustration: React.FC<{ className?: string }> = ({ className = "w-11 h-11 sm:w-13 sm:h-13 mx-auto drop-shadow-xs" }) => (
  <svg viewBox="0 0 160 160" className={className}>
    <ellipse cx="80" cy="144" rx="46" ry="8" fill="#d97706" opacity="0.3" />
    <rect x="42" y="128" width="76" height="12" rx="2" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
    <rect x="48" y="116" width="64" height="12" rx="2" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
    <rect x="52" y="96" width="56" height="20" fill="#f97316" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M72 116 L 72 102 Q 80 97 88 102 L 88 116 Z" fill="#7c2d12" />
    <path d="M54 96 L 60 76 L 100 76 L 106 96 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M62 76 L 68 56 L 92 56 L 98 76 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M70 56 L 74 38 L 86 38 L 90 56 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
    <circle cx="80" cy="34" r="4.5" fill="#fbbf24" stroke="#7c2d12" strokeWidth="1" />
    <line x1="80" y1="30" x2="80" y2="16" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M80 16 L 96 22 L 80 28 Z" fill="#ea580c" />
  </svg>
);

export const VratHomeView: React.FC<VratHomeViewProps> = ({
  onNavigate,
  onOpenSidebarMenu
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  // Read saved alarm status from localStorage
  const [alarmText, setAlarmText] = useState('अभी कोई अलार्म नहीं • सेट करें');

  const refreshAlarmStatus = () => {
    try {
      const saved = localStorage.getItem('daily_puja_alarm_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.morningEnabled || parsed.eveningEnabled) {
          const morning = parsed.morningEnabled ? `प्रातः ${parsed.morningTime}` : '';
          const evening = parsed.eveningEnabled ? `सायं ${parsed.eveningTime}` : '';
          const joined = [morning, evening].filter(Boolean).join(' • ');
          setAlarmText(`${joined} सक्रिय`);
          return;
        }
      }
    } catch {}
    setAlarmText('अभी कोई अलार्म नहीं • सेट करें');
  };

  useEffect(() => {
    refreshAlarmStatus();
  }, [isAlarmModalOpen]);

  // SMART FESTIVAL BANNERS: High-resolution authentic photographs of festivals
  const smartFestivalBanners = useMemo(() => {
    return [
      {
        id: 'janmashtami',
        title: 'श्री कृष्ण जन्माष्टमी',
        hindiName: 'श्री कृष्ण जन्माष्टमी',
        subtitle: 'भगवान श्री कृष्ण का पावन प्राकट्योत्सव एवं रोहिणी नक्षत्र पूजन',
        badge: 'आगामी महापर्व 2026',
        date: '04 सितंबर 2026',
        image: 'https://images.unsplash.com/photo-1567591414240-e29035e4663a?w=1000&auto=format&fit=crop&q=80',
        isChhath: false,
        vratId: 'janmashtami'
      },
      {
        id: 'chhath-puja',
        title: 'छठ महापर्व 2026',
        hindiName: 'छठ महापर्व',
        subtitle: 'लोक आस्था, सूर्य उपासना व छठी मईया का 4-दिवसीय चारु महापर्व',
        badge: 'परम पावन महापर्व',
        date: '13 - 16 नवंबर 2026',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
        isChhath: true,
        vratId: 'chhath-puja'
      },
      {
        id: 'mahashivratri',
        title: 'महाशिवरात्रि',
        hindiName: 'महाशिवरात्रि',
        subtitle: 'देवाधिदेव महादेव व माता पार्वती का महाकल्याणकारी रात्रि जागरण',
        badge: 'महाशिवरात्रि 2026',
        date: '15 फरवरी 2026',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80',
        isChhath: false,
        vratId: 'mahashivratri'
      },
      {
        id: 'shardiya-navratri',
        title: 'शारदीय नवरात्रि',
        hindiName: 'शारदीय नवरात्रि',
        subtitle: 'माँ दुर्गा के नव रूपों की पावन आराधना, घटस्थापना एवं डांडिया',
        badge: 'शक्ति साधना',
        date: '11 - 19 अक्टूबर 2026',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1000&auto=format&fit=crop&q=80',
        isChhath: false,
        vratId: 'shardiya-navratri'
      },
      {
        id: 'karwa-chauth',
        title: 'करवा चौथ',
        hindiName: 'करवा चौथ',
        subtitle: 'अखंड सौभाग्य, चंद्र अर्घ्य एवं पति की दीर्घायु का निर्जला व्रत',
        badge: 'अखंड सौभाग्य व्रत',
        date: '28 अक्टूबर 2026',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1000&auto=format&fit=crop&q=80',
        isChhath: false,
        vratId: 'karwa-chauth'
      },
      {
        id: 'deepawali',
        title: 'दीपावली व धनतेरस',
        hindiName: 'दीपावली',
        subtitle: 'माँ महालक्ष्मी पूजन, दीपदान एवं सुख-समृद्धि का महापर्व',
        badge: 'प्रकाश महापर्व',
        date: '08 नवंबर 2026',
        image: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=1000&auto=format&fit=crop&q=80',
        isChhath: false,
        vratId: 'akshaya-tritiya'
      }
    ];
  }, []);

  // Moving banner timer - rotates every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % smartFestivalBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [smartFestivalBanners.length]);

  // Handle clicking on any festival banner -> open dedicated clean page, never a modal!
  const handleBannerClick = (banner: typeof smartFestivalBanners[0]) => {
    if (banner.isChhath) {
      onNavigate('chhath');
    } else {
      onNavigate('puja-vidhi');
    }
  };

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();

    const vrats = ALL_VRATS_DATA.filter(v =>
      v.hindiName.toLowerCase().includes(term) ||
      v.name.toLowerCase().includes(term) ||
      v.deity.toLowerCase().includes(term)
    ).slice(0, 5);

    const aartis = ALL_AARTIS_DATA.filter(a =>
      a.hindiTitle.toLowerCase().includes(term) ||
      a.title.toLowerCase().includes(term)
    ).slice(0, 4);

    return { vrats, aartis, total: vrats.length + aartis.length };
  }, [searchTerm]);

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#fdf6ee] via-[#faebd7]/30 to-[#fdf6ee] text-[#451a03] flex flex-col justify-start">
      {/* 1. TOP SUB-HEADER (Matching Screenshot: 9-Dot Menu, Search Pill, Heart Button) */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-3 sm:px-4 py-2 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Left: 9-Dot Grid Menu Button */}
          <button
            onClick={onOpenSidebarMenu}
            className="w-9 h-9 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#78350f] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0"
            aria-label="Menu"
            title="सभी फीचर्स मेनू"
          >
            <div className="grid grid-cols-3 gap-0.5 p-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9a3412]" />
            </div>
          </button>

          {/* Center: Search Pill Bar ("पूजा, आरती, मंत्र खोजें") */}
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-[#9a3412] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="पूजा, आरती, मंत्र खोजें..."
              className="w-full pl-8 pr-7 py-2 bg-white border border-[#fed7aa] rounded-full text-xs text-[#451a03] placeholder-[#9a3412]/60 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] shadow-xs font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a3412] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: Heart / Favorites Button */}
          <button
            onClick={() => onNavigate('my-chhath')}
            className="w-9 h-9 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#9a3412] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0"
            aria-label="Favorites"
            title="पसंदीदा व संकल्प"
          >
            <Heart className="w-4 h-4 text-[#9a3412]" />
          </button>
        </div>
      </header>

      {/* Global Search Dropdown */}
      {searchResults && (
        <div className="max-w-md mx-auto w-full px-3 py-2">
          <div className="bg-white rounded-2xl p-3 border border-[#f59e0b] shadow-lg space-y-2">
            <div className="flex items-center justify-between border-b border-[#fed7aa] pb-1.5">
              <span className="text-xs font-bold text-[#78350f]">
                "{searchTerm}" के परिणाम ({searchResults.total})
              </span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#9a3412] font-semibold"
              >
                बंद करें ✕
              </button>
            </div>

            {searchResults.total === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">कोई परिणाम नहीं मिला।</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.vrats.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSearchTerm('');
                      onNavigate('puja-vidhi');
                    }}
                    className="p-2 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#78350f]">{v.hindiName}</p>
                      <p className="text-[10px] text-gray-500">{v.deity}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9a3412]" />
                  </div>
                ))}

                {searchResults.aartis.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSearchTerm('');
                      onNavigate('aarti-sangrah');
                    }}
                    className="p-2 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <p className="text-xs font-bold text-[#78350f]">{a.hindiTitle}</p>
                    <span className="text-[10px] font-bold text-[#ea580c]">आरती पढ़ें →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TOP MOVABLE FESTIVAL BANNER (Edge-to-edge full phone screen width, NO curves on mobile, Real Photos) */}
      <div className="w-full relative overflow-hidden bg-stone-950">
        <div className="relative w-full h-36 sm:h-44 md:h-48 overflow-hidden">
          {smartFestivalBanners.map((banner, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className={`absolute inset-0 transition-opacity duration-700 cursor-pointer flex items-center justify-between p-3.5 sm:p-5 ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Real Authentic Festival Photo full cover */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent sm:via-black/45" />

                {/* Banner Content on left */}
                <div className="relative z-10 space-y-1 max-w-[72%] text-white">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold shadow-xs">
                    {banner.badge}
                  </span>

                  <h2 className="text-lg sm:text-2xl font-black font-serif text-white tracking-wide pt-0.5 drop-shadow-md truncate">
                    {banner.title}
                  </h2>

                  <p className="text-[11px] text-amber-100/90 line-clamp-2 leading-relaxed font-mukta">
                    {banner.subtitle}
                  </p>

                  <div className="flex items-center space-x-2 pt-0.5">
                    <span className="text-[11px] font-bold text-amber-300">
                      📅 {banner.date}
                    </span>
                    <span className="text-[10px] font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-2 py-0.5 rounded-full shadow-xs inline-flex items-center">
                      <span>{banner.isChhath ? 'छठ ऐप' : 'कथा व विधि'}</span>
                      <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center space-x-1 z-20 pointer-events-none">
          {smartFestivalBanners.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === currentSlideIndex ? 'w-4 bg-amber-400' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. ALARM STRIP + 6 SECTION CARDS (Fitted seamlessly to fill screen without vertical scroll) */}
      <main className="max-w-md mx-auto w-full px-3 sm:px-4 py-2 sm:py-2.5 space-y-2 sm:space-y-2.5 flex-1 flex flex-col justify-between">
        {/* Daily Puja Alarm Strip */}
        <div 
          onClick={() => setIsAlarmModalOpen(true)}
          className="p-2 sm:p-2.5 bg-gradient-to-r from-[#78350f] via-[#9a3412] to-[#b45309] rounded-2xl text-white shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all border border-[#f59e0b]/40 shrink-0"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#fef3c7] text-[#9a3412] flex items-center justify-center shrink-0 shadow-inner">
              <Bell className="w-4 h-4 animate-swing" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#fde68a] font-bold uppercase tracking-wider leading-none">
                दैनिक पूजा अलार्म
              </p>
              <h3 className="font-bold text-xs text-white truncate leading-tight mt-0.5">
                पूजा या आरती का समय याद दिलाएं...
              </h3>
              <p className="text-[10px] text-[#fed7aa] truncate leading-none mt-0.5">
                {alarmText}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-2.5 py-1 bg-white text-[#78350f] rounded-full text-[11px] font-bold hover:bg-[#fff7ed] shadow-xs shrink-0 ml-1.5"
          >
            सेट करें
          </button>
        </div>

        {/* 6 Category Cards Grid (Opens Dedicated Clean Full Pages, NO modals) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1">
          {/* Card 1: पूजा विधि -> Dedicated Full Page PujaVidhiListView */}
          <div
            onClick={() => onNavigate('puja-vidhi')}
            className="group bg-white rounded-2xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer flex flex-col justify-between h-[88px] sm:h-[98px]"
          >
            <div className="flex-1 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
              <KalashIllustration className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-xs" />
            </div>
            <div className="bg-[#fef9f3] py-1 px-2 border-t border-[#fed7aa]/50 text-center shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                पूजा विधि
              </span>
            </div>
          </div>

          {/* Card 2: व्रत कथा -> Dedicated Full Page VratKathaListView */}
          <div
            onClick={() => onNavigate('vrat-katha')}
            className="group bg-white rounded-2xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer flex flex-col justify-between h-[88px] sm:h-[98px]"
          >
            <div className="flex-1 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
              <VratKathaIllustration className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-xs" />
            </div>
            <div className="bg-[#fef9f3] py-1 px-2 border-t border-[#fed7aa]/50 text-center shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                व्रत कथा
              </span>
            </div>
          </div>

          {/* Card 3: आरती -> Dedicated Full Page AartiSangrahListView */}
          <div
            onClick={() => onNavigate('aarti-sangrah')}
            className="group bg-white rounded-2xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer flex flex-col justify-between h-[88px] sm:h-[98px]"
          >
            <div className="flex-1 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
              <AartiIllustration className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-xs" />
            </div>
            <div className="bg-[#fef9f3] py-1 px-2 border-t border-[#fed7aa]/50 text-center shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                आरती
              </span>
            </div>
          </div>

          {/* Card 4: पूजन सामग्री -> Dedicated Full Page SamagriListView */}
          <div
            onClick={() => onNavigate('samagri-list')}
            className="group bg-white rounded-2xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer flex flex-col justify-between h-[88px] sm:h-[98px]"
          >
            <div className="flex-1 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
              <SamagriIllustration className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-xs" />
            </div>
            <div className="bg-[#fef9f3] py-1 px-2 border-t border-[#fed7aa]/50 text-center shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                पूजन सामग्री
              </span>
            </div>
          </div>

          {/* Card 5: मंत्र -> Dedicated Full Page MantraListView */}
          <div
            onClick={() => onNavigate('mantra-list')}
            className="group bg-white rounded-2xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer flex flex-col justify-between h-[88px] sm:h-[98px]"
          >
            <div className="flex-1 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
              <MantraIllustration className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-xs" />
            </div>
            <div className="bg-[#fef9f3] py-1 px-2 border-t border-[#fed7aa]/50 text-center shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                मंत्र
              </span>
            </div>
          </div>

          {/* Card 6: प्रसिद्ध मंदिर -> Dedicated Full Page FamousTemplesListView */}
          <div
            onClick={() => onNavigate('famous-temples')}
            className="group bg-white rounded-2xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer flex flex-col justify-between h-[88px] sm:h-[98px]"
          >
            <div className="flex-1 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
              <TempleIllustration className="w-10 h-10 sm:w-12 sm:h-12 mx-auto drop-shadow-xs" />
            </div>
            <div className="bg-[#fef9f3] py-1 px-2 border-t border-[#fed7aa]/50 text-center shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                प्रसिद्ध मंदिर
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Alarm Settings Modal */}
      {isAlarmModalOpen && (
        <DailyPujaAlarmModal
          isOpen={isAlarmModalOpen}
          onClose={() => {
            setIsAlarmModalOpen(false);
            refreshAlarmStatus();
          }}
        />
      )}
    </div>
  );
};
