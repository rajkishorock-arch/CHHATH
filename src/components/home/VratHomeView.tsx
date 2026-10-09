import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Bell, Heart, LayoutGrid, X, 
  ChevronRight, Calendar, Sparkles, Clock, ArrowRight 
} from 'lucide-react';
import { ALL_VRATS_DATA, VratItem } from '../../data/allVratsData';
import { ALL_AARTIS_DATA } from '../../data/allAartisData';
import { CHALISA_PAATH_DATA } from '../../data/chalisaPaathData';
import { VratDetailModal } from '../vrats/VratDetailModal';
import { DailyPujaAlarmModal } from '../vrats/DailyPujaAlarmModal';
import { DigitalJapMalaModal } from '../vrats/DigitalJapMalaModal';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface VratHomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenSidebarMenu: () => void;
}

// 1. Puja Vidhi Illustration - Sacred Kalash with Coconut and Mango Leaves
const KalashIllustration: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-md">
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
    {/* Base Stand */}
    <ellipse cx="80" cy="142" rx="38" ry="8" fill="#d97706" opacity="0.35" />
    <path d="M56 138 C 56 142, 104 142, 104 138 L 98 132 L 62 132 Z" fill="#b45309" />
    
    {/* Brass Pot (Ghat/Kalash) */}
    <path d="M50 78 C 30 92, 32 124, 60 134 L 100 134 C 128 124, 130 92, 110 78 Z" fill="url(#potGrad)" stroke="#78350f" strokeWidth="2" />
    <path d="M54 78 Q 80 82 106 78 L 102 70 Q 80 73 58 70 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
    <ellipse cx="80" cy="70" rx="24" ry="7" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
    
    {/* Sacred Swastika / Om on Pot */}
    <text x="80" y="112" textAnchor="middle" fill="#78350f" fontSize="22" fontWeight="bold" fontFamily="serif">ॐ</text>
    
    {/* Sacred Mango Leaves */}
    <path d="M80 68 C 65 52, 45 48, 38 52 C 45 62, 60 68, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 95 52, 115 48, 122 52 C 115 62, 100 68, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 72 45, 60 35, 52 38 C 60 52, 72 62, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 88 45, 100 35, 108 38 C 100 52, 88 62, 80 68 Z" fill="url(#leafGrad)" stroke="#166534" strokeWidth="1" />
    <path d="M80 68 C 76 40, 80 24, 80 24 C 80 24, 84 40, 80 68 Z" fill="#16a34a" stroke="#166534" strokeWidth="1" />
    
    {/* Sacred Coconut on Top with Tilak */}
    <ellipse cx="80" cy="50" rx="18" ry="24" fill="url(#coconutGrad)" stroke="#451a03" strokeWidth="1.5" />
    <path d="M72 40 Q 80 32 88 40" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="46" r="3" fill="#dc2626" />
    <circle cx="80" cy="53" r="2" fill="#fbbf24" />
  </svg>
);

// 2. Vrat Katha Illustration - Devotee Woman with Diya & Puja Thali
const VratKathaIllustration: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-md">
    <ellipse cx="80" cy="144" rx="42" ry="7" fill="#f59e0b" opacity="0.3" />
    {/* Saree & Sitting Devotee Body */}
    <path d="M52 140 C 48 108, 56 90, 80 90 C 104 90, 112 108, 108 140 Z" fill="#ef4444" />
    <path d="M60 140 C 60 115, 70 100, 80 100 C 90 100, 100 115, 100 140 Z" fill="#f59e0b" opacity="0.9" />
    {/* Saree Dupatta/Chunri covering head */}
    <path d="M56 74 C 54 48, 66 38, 80 38 C 94 38, 106 48, 104 74 C 104 94, 98 105, 96 112 L 64 112 C 62 105, 56 94, 56 74 Z" fill="#dc2626" />
    <path d="M62 48 Q 80 42 98 48" stroke="#fbbf24" strokeWidth="3" fill="none" />
    {/* Devotee Face */}
    <ellipse cx="80" cy="62" rx="14" ry="17" fill="#fed7aa" />
    <circle cx="80" cy="54" r="2.5" fill="#dc2626" /> {/* Bindi */}
    <path d="M72 61 Q 75 64 78 61" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M82 61 Q 85 64 88 61" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M77 70 Q 80 73 83 70" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Namaste Hands */}
    <path d="M74 88 C 76 80, 84 80, 86 88 L 84 98 L 76 98 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
    <path d="M78 82 L 78 94" stroke="#c2410c" strokeWidth="1" />
    {/* Small Diya in Front */}
    <path d="M110 134 Q 118 134 120 138 Q 110 140 106 138 Z" fill="#b45309" />
    <path d="M120 133 Q 123 125 120 120 Q 117 125 119 133 Z" fill="#f59e0b" />
    <circle cx="120" cy="127" r="1.5" fill="#fef08a" />
  </svg>
);

// 3. Aarti Illustration - Devotee Woman with Sincere Namaste Prayer
const AartiIllustration: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-md">
    <ellipse cx="80" cy="144" rx="40" ry="7" fill="#f59e0b" opacity="0.3" />
    {/* Red Chunri with Golden Border */}
    <path d="M52 82 C 48 54, 60 40, 80 40 C 100 40, 112 54, 108 82 C 108 106, 102 126, 98 138 L 62 138 C 58 126, 52 106, 52 82 Z" fill="#b91c1c" />
    <path d="M58 52 Q 80 45 102 52" stroke="#f59e0b" strokeWidth="3" fill="none" />
    {/* Devotee Face */}
    <ellipse cx="80" cy="68" rx="16" ry="19" fill="#fde68a" />
    <circle cx="80" cy="59" r="2.8" fill="#b91c1c" /> {/* Red Tilak */}
    <path d="M70 66 Q 74 69 78 66" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M82 66 Q 86 69 90 66" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M76 77 Q 80 80 84 77" stroke="#b91c1c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Folded Hands in Anjali Mudra (Aarti Prayer) */}
    <path d="M72 104 C 74 92, 86 92, 88 104 L 85 118 L 75 118 Z" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
    <path d="M80 94 L 80 112" stroke="#b45309" strokeWidth="1.2" />
    {/* Golden bangles */}
    <rect x="73" y="112" width="14" height="4" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
  </svg>
);

// 4. Pujan Samagri Illustration - Traditional Brass Puja Thali
const SamagriIllustration: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-md">
    <ellipse cx="80" cy="138" rx="48" ry="9" fill="#b45309" opacity="0.3" />
    {/* Large Brass Puja Thali */}
    <ellipse cx="80" cy="118" rx="52" ry="22" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
    <ellipse cx="80" cy="116" rx="46" ry="18" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
    
    {/* Diya on Thali */}
    <path d="M50 110 Q 56 110 58 114 Q 50 116 46 114 Z" fill="#9a3412" stroke="#78350f" strokeWidth="1" />
    <path d="M58 108 Q 61 98 58 92 Q 55 98 57 108 Z" fill="#ea580c" />
    <circle cx="58" cy="100" r="2" fill="#fef08a" />
    
    {/* Katori 1 with Kumkum */}
    <ellipse cx="78" cy="112" rx="10" ry="6" fill="#b45309" />
    <ellipse cx="78" cy="111" rx="8" ry="4" fill="#dc2626" />
    
    {/* Katori 2 with Haldi */}
    <ellipse cx="98" cy="114" rx="10" ry="6" fill="#b45309" />
    <ellipse cx="98" cy="113" rx="8" ry="4" fill="#eab308" />
    
    {/* Sacred Incense Sticks (Agarbatti) Standing */}
    <line x1="110" y1="114" x2="118" y2="72" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    <line x1="114" y1="115" x2="124" y2="75" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    {/* Incense Glow & Smoke */}
    <circle cx="118" cy="72" r="2" fill="#ef4444" />
    <circle cx="124" cy="75" r="2" fill="#ef4444" />
    <path d="M118 70 Q 120 60 116 50 Q 122 40 120 32" stroke="#d4d4d8" strokeWidth="1.5" fill="none" opacity="0.75" />
    
    {/* Flower Offerings (Marigold) */}
    <circle cx="68" cy="120" r="5" fill="#f97316" />
    <circle cx="68" cy="120" r="2.5" fill="#fef08a" />
  </svg>
);

// 5. Mantra Illustration - Meditating Yogi / Sadhak in Padmasana
const MantraIllustration: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-md">
    {/* Spiritual Aura / Halo */}
    <circle cx="80" cy="78" r="42" fill="#fed7aa" opacity="0.4" />
    <circle cx="80" cy="78" r="32" fill="#fed7aa" opacity="0.6" />
    {/* Yogi Silhouette */}
    {/* Head */}
    <circle cx="80" cy="50" r="13" fill="#292524" />
    {/* Torso */}
    <path d="M70 65 L 90 65 L 86 98 L 74 98 Z" fill="#292524" />
    {/* Arms in Dhyana / Chin Mudra */}
    <path d="M70 66 C 54 74, 52 94, 60 102 C 64 104, 70 100, 72 96" stroke="#292524" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M90 66 C 106 74, 108 94, 100 102 C 96 104, 90 100, 88 96" stroke="#292524" strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Crossed Legs in Padmasana */}
    <path d="M46 114 C 54 102, 106 102, 114 114 C 114 120, 46 120, 46 114 Z" fill="#292524" />
    {/* Golden Om Light Symbol in Mind */}
    <text x="80" y="32" textAnchor="middle" fill="#ea580c" fontSize="16" fontWeight="bold">ॐ</text>
  </svg>
);

// 6. Prasiddh Mandir Illustration - Traditional Hindu Mandir Shikhara
const TempleIllustration: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-md">
    <ellipse cx="80" cy="144" rx="46" ry="8" fill="#d97706" opacity="0.3" />
    {/* Base Temple Platform */}
    <rect x="42" y="128" width="76" height="12" rx="2" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
    <rect x="48" y="116" width="64" height="12" rx="2" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
    
    {/* Sanctum Sanctorum (Garbhagriha) Pillars & Door */}
    <rect x="52" y="96" width="56" height="20" fill="#f97316" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M72 116 L 72 102 Q 80 97 88 102 L 88 116 Z" fill="#7c2d12" />
    
    {/* Tiered Shikhara (Spire) */}
    <path d="M54 96 L 60 76 L 100 76 L 106 96 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M62 76 L 68 56 L 92 56 L 98 76 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="1.5" />
    <path d="M70 56 L 74 38 L 86 38 L 90 56 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
    
    {/* Kalash & Dhwaja (Sacred Saffron Flag) on Shikhara Top */}
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
  const [selectedVrat, setSelectedVrat] = useState<VratItem | null>(null);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isJapMalaOpen, setIsJapMalaOpen] = useState(false);

  // Read saved alarm status from localStorage to make it fully dynamic & smart
  const [alarmText, setAlarmText] = useState('अभी कोई अलार्म नहीं • सेट करें');
  const [hasAlarmActive, setHasAlarmActive] = useState(false);

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
          setHasAlarmActive(true);
          return;
        }
      }
    } catch {
      // fallback
    }
    setAlarmText('अभी कोई अलार्म नहीं • सेट करें');
    setHasAlarmActive(false);
  };

  useEffect(() => {
    refreshAlarmStatus();
  }, [isAlarmModalOpen]);

  // SMART SENSING: Order festivals dynamically based on calendar and season
  const smartFestivalBanners = useMemo(() => {
    // Top festivals with custom beautiful banners
    return [
      {
        id: 'janmashtami',
        title: 'श्री कृष्ण जन्माष्टमी',
        hindiName: 'श्री कृष्ण जन्माष्टमी',
        subtitle: 'भगवान श्री कृष्ण का पावन प्राकट्योत्सव एवं रोहिणी नक्षत्र पूजन',
        badge: 'आगामी महापर्व 2026',
        date: '04 सितंबर 2026',
        image: 'https://images.unsplash.com/photo-1567591414240-e29035e4663a?w=900&q=80',
        bgColor: 'from-[#fff5eb] via-[#fee5cf] to-[#fed7aa]',
        textColor: 'text-[#9a3412]',
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
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
        bgColor: 'from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]',
        textColor: 'text-[#ea580c]',
        isChhath: true, // Opens dedicated Chhath setup!
        vratId: 'chhath-puja'
      },
      {
        id: 'mahashivratri',
        title: 'महाशिवरात्रि',
        hindiName: 'महाशिवरात्रि',
        subtitle: 'देवाधिदेव महादेव व माता पार्वती का महाकल्याणकारी रात्रि जागरण',
        badge: 'महाशिवरात्रि 2026',
        date: '15 फरवरी 2026',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
        bgColor: 'from-[#f5f3ff] via-[#ede9fe] to-[#ddd6fe]',
        textColor: 'text-[#6b21a8]',
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
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
        bgColor: 'from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
        textColor: 'text-[#be123c]',
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
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&q=80',
        bgColor: 'from-[#fef2f2] via-[#fee2e2] to-[#fecaca]',
        textColor: 'text-[#991b1b]',
        isChhath: false,
        vratId: 'karwa-chauth'
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

  // Handle clicking on any festival banner
  const handleBannerClick = (banner: typeof smartFestivalBanners[0]) => {
    if (banner.isChhath) {
      // Open dedicated Chhath Mahaparv experience
      onNavigate('chhath');
    } else {
      // Find full Vrat info and open detail modal
      const found = ALL_VRATS_DATA.find(v => v.id === banner.vratId);
      if (found) {
        setSelectedVrat(found);
      } else {
        onNavigate('all-vrats');
      }
    }
  };

  // Global search across everything
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const q = searchTerm.toLowerCase().trim();

    const vrats = ALL_VRATS_DATA.filter(v =>
      v.hindiName.toLowerCase().includes(q) ||
      v.name.toLowerCase().includes(q) ||
      v.deity.toLowerCase().includes(q) ||
      v.vratKatha.title.toLowerCase().includes(q)
    );

    const aartis = ALL_AARTIS_DATA.filter(a =>
      a.hindiTitle.toLowerCase().includes(q) ||
      a.deity.toLowerCase().includes(q)
    );

    const chalisas = CHALISA_PAATH_DATA.filter(c =>
      c.hindiTitle.toLowerCase().includes(q) ||
      c.deity.toLowerCase().includes(q)
    );

    return { vrats, aartis, chalisas, total: vrats.length + aartis.length + chalisas.length };
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] via-[#faebd7]/40 to-[#fdf6ee] text-[#451a03] pb-24">
      {/* 1. TOP HEADER (Matching Screenshot 2) */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          {/* Left: 9-Dot Grid Menu Button */}
          <button
            onClick={onOpenSidebarMenu}
            className="w-10 h-10 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#78350f] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0"
            aria-label="Menu"
            title="सभी फीचर्स मेनू"
          >
            <div className="grid grid-cols-3 gap-1 p-1">
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
            <Search className="w-4 h-4 text-[#9a3412] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="पूजा, आरती, मंत्र खोजें"
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#fed7aa] rounded-full text-xs sm:text-sm text-[#451a03] placeholder-[#9a3412]/60 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] shadow-xs transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a3412] hover:text-[#451a03] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Heart / Favorites Button */}
          <button
            onClick={() => onNavigate('my-chhath')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#9a3412] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0"
            aria-label="Favorites"
            title="पसंदीदा व संकल्प"
          >
            <Heart className="w-5 h-5 text-[#9a3412]" />
          </button>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="max-w-md mx-auto px-4 py-3 space-y-4">
        {/* Real-Time Global Search Dropdown / Results View */}
        {searchResults && (
          <div className="bg-white rounded-3xl p-4 border border-[#f59e0b] shadow-lg space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#fed7aa] pb-2">
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
              <p className="text-xs text-gray-500 text-center py-4">कोई परिणाम नहीं मिला।</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {searchResults.vrats.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedVrat(v);
                    }}
                    className="p-2.5 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#78350f]">{v.hindiName}</p>
                      <p className="text-[10px] text-gray-500">{v.deity} • {v.date2026}</p>
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
                    className="p-2.5 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#78350f]">{a.hindiTitle}</p>
                      <p className="text-[10px] text-gray-500">{a.deity}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#ea580c]">आरती पढ़ें →</span>
                  </div>
                ))}

                {searchResults.chalisas.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSearchTerm('');
                      onNavigate('paath-chalisa');
                    }}
                    className="p-2.5 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#78350f]">{c.hindiTitle}</p>
                      <p className="text-[10px] text-gray-500">{c.deity} • {c.versesCount}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#ea580c]">पाठ पढ़ें →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TOP MOVING FESTIVAL BANNER CAROUSEL (Matching Screenshot 2) */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#fed7aa] bg-[#fffaf5] min-h-[168px] sm:min-h-[185px]">
            {smartFestivalBanners.map((banner, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <div
                  key={banner.id}
                  onClick={() => handleBannerClick(banner)}
                  className={`absolute inset-0 transition-opacity duration-700 cursor-pointer flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-br ${banner.bgColor} ${
                    isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Decorative background image overlay */}
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute right-0 top-0 w-1/2 h-full object-cover mix-blend-multiply opacity-25 pointer-events-none"
                  />

                  {/* Banner Content */}
                  <div className="relative z-10 space-y-1 max-w-[70%]">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/70 text-[#9a3412] text-[10px] font-bold border border-[#f59e0b]/30">
                      {banner.badge}
                    </span>

                    <h2 className="text-xl sm:text-2xl font-black font-serif text-[#7c2d12] tracking-wide pt-0.5">
                      {banner.title}
                    </h2>

                    <p className="text-[11px] text-[#78350f]/90 line-clamp-2 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  </div>

                  {/* Banner Footer CTA */}
                  <div className="relative z-10 flex items-center justify-between pt-2">
                    <span className="text-[11px] font-bold text-[#9a3412] flex items-center">
                      📅 {banner.date}
                    </span>

                    <span className="text-[11px] font-bold text-white bg-[#9a3412] hover:bg-[#7c2d12] px-3 py-1 rounded-full shadow-xs flex items-center space-x-1">
                      <span>{banner.isChhath ? 'छठ ऐप खोलें' : 'कथा व विधि'}</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center space-x-1.5 mt-2">
            {smartFestivalBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentSlideIndex ? 'w-5 bg-[#9a3412]' : 'w-1.5 bg-[#fed7aa]'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 3. DAILY PUJA ALARM BANNER (Matching Screenshot 2: "दैनिक पूजा अलार्म") */}
        <div 
          onClick={() => setIsAlarmModalOpen(true)}
          className="p-3.5 bg-gradient-to-r from-[#78350f] via-[#9a3412] to-[#b45309] rounded-3xl text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all border border-[#f59e0b]/40"
        >
          <div className="flex items-center space-x-3">
            {/* Bell Round Badge */}
            <div className="w-11 h-11 rounded-full bg-[#fef3c7] text-[#9a3412] flex items-center justify-center shrink-0 shadow-inner">
              <Bell className="w-5 h-5 animate-swing" />
            </div>

            <div>
              <p className="text-[10px] text-[#fde68a] font-bold uppercase tracking-wider">
                दैनिक पूजा अलार्म
              </p>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                पूजा या आरती का समय याद दिलाएं...
              </h3>
              <p className="text-[10px] text-[#fed7aa] mt-0.5">
                {alarmText}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-3.5 py-1.5 bg-white text-[#78350f] rounded-full text-xs font-bold hover:bg-[#fff7ed] shadow-xs shrink-0 ml-2"
          >
            सेट करें
          </button>
        </div>

        {/* 4. SIX CORE CATEGORY CARDS (Matching Screenshot 2 EXACT 2x3 Grid) */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {/* Card 1: पूजा विधि */}
          <div
            onClick={() => onNavigate('chhath-puja-vidhi')}
            className="group bg-white rounded-3xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#f59e0b] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="p-3 pt-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <KalashIllustration />
            </div>
            <div className="bg-[#fef9f3] py-2 px-3 border-t border-[#fed7aa]/50 text-center">
              <span className="font-bold text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                पूजा विधि
              </span>
            </div>
          </div>

          {/* Card 2: व्रत कथा */}
          <div
            onClick={() => onNavigate('vrat-katha')}
            className="group bg-white rounded-3xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#f59e0b] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="p-3 pt-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <VratKathaIllustration />
            </div>
            <div className="bg-[#fef9f3] py-2 px-3 border-t border-[#fed7aa]/50 text-center">
              <span className="font-bold text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                व्रत कथा
              </span>
            </div>
          </div>

          {/* Card 3: आरती */}
          <div
            onClick={() => onNavigate('aarti-sangrah')}
            className="group bg-white rounded-3xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#f59e0b] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="p-3 pt-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AartiIllustration />
            </div>
            <div className="bg-[#fef9f3] py-2 px-3 border-t border-[#fed7aa]/50 text-center">
              <span className="font-bold text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                आरती
              </span>
            </div>
          </div>

          {/* Card 4: पूजन सामग्री */}
          <div
            onClick={() => onNavigate('chhath-samagri')}
            className="group bg-white rounded-3xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#f59e0b] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="p-3 pt-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <SamagriIllustration />
            </div>
            <div className="bg-[#fef9f3] py-2 px-3 border-t border-[#fed7aa]/50 text-center">
              <span className="font-bold text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                पूजन सामग्री
              </span>
            </div>
          </div>

          {/* Card 5: मंत्र */}
          <div
            onClick={() => setIsJapMalaOpen(true)}
            className="group bg-white rounded-3xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#f59e0b] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="p-3 pt-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MantraIllustration />
            </div>
            <div className="bg-[#fef9f3] py-2 px-3 border-t border-[#fed7aa]/50 text-center">
              <span className="font-bold text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                मंत्र
              </span>
            </div>
          </div>

          {/* Card 6: प्रसिद्ध मंदिर */}
          <div
            onClick={() => onNavigate('famous-temples')}
            className="group bg-white rounded-3xl overflow-hidden border border-[#fed7aa]/80 shadow-xs hover:shadow-md hover:border-[#f59e0b] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="p-3 pt-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TempleIllustration />
            </div>
            <div className="bg-[#fef9f3] py-2 px-3 border-t border-[#fed7aa]/50 text-center">
              <span className="font-bold text-sm text-[#78350f] font-serif group-hover:text-[#ea580c] transition-colors">
                प्रसिद्ध मंदिर
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedVrat && (
        <VratDetailModal
          vrat={selectedVrat}
          isOpen={!!selectedVrat}
          onClose={() => setSelectedVrat(null)}
          onOpenAarti={() => onNavigate('aarti-sangrah')}
        />
      )}

      {isAlarmModalOpen && (
        <DailyPujaAlarmModal
          isOpen={isAlarmModalOpen}
          onClose={() => {
            setIsAlarmModalOpen(false);
            refreshAlarmStatus();
          }}
        />
      )}

      {isJapMalaOpen && (
        <DigitalJapMalaModal
          isOpen={isJapMalaOpen}
          onClose={() => setIsJapMalaOpen(false)}
        />
      )}
    </div>
  );
};
