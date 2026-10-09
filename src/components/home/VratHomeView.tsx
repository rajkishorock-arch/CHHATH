import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Bell, Heart, X, 
  ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ALL_VRATS_DATA } from '../../data/allVratsData';
import { ALL_AARTIS_DATA } from '../../data/allAartisData';
import { DailyPujaAlarmModal } from '../vrats/DailyPujaAlarmModal';
import { getDynamicCalendarBanners, DynamicBannerItem } from '../../data/panchangCalendarEvents';

interface VratHomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenSidebarMenu: () => void;
  onSelectFestival?: (banner: DynamicBannerItem) => void;
}

/**
 * ==============================================================================================
 * 🌟 [USER PHOTO CONFIGURATION / 6 मुख्य कार्ड्स की फोटो यहाँ बदलें]:
 * ==============================================================================================
 * प्रिय यूजर / डेवलपर, आप इन 6 कार्ड्स में अपनी मनपसंद फोटो बहुत आसानी से लगा सकते हैं:
 *
 * विकल्प 1 (इंटरनेट/वेबसाइट की फोटो):
 * - किसी भी ऑनलाइन फोटो का सीधा URL नीचे दिए गए 'image' में पेस्ट करें।
 *   उदा: image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f'
 *
 * विकल्प 2 (अपनी खुद की कंप्यूटर/फोन की फोटो):
 * - अपनी फोटो को प्रोजेक्ट के 'public' फोल्डर में रखें (जैसे public/my-puja.png)
 * - और नीचे 'image' में लिखें: image: '/my-puja.png'
 *
 * विकल्प 3 (डिफ़ॉल्ट ओरिजिनल चित्र - जैसा स्क्रीनशॉट 1 में है):
 * - अगर आप 'image' को खाली छोड़ देंगे (image: ''), तो स्क्रीनशॉट 1 वाले सुंदर ओरिजिनल चित्र दिखेंगे!
 * ==============================================================================================
 */
export const HOME_6_FEATURE_CARDS = [
  {
    id: 'puja-vidhi',
    title: 'पूजा विधि',
    tab: 'puja-vidhi',
    // 👇 [कार्ड 1]: पूजा विधि की फोटो का लिंक यहाँ डालें (खाली छोड़ने पर स्क्रीनशॉट 1 वाला कलश दिखेगा)
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbN8vKV94SgxCRf-UJDV9mFzGGqwJE6DasZsGfqXMSYQ&s=10', 
  },
  {
    id: 'vrat-katha',
    title: 'व्रत कथा',
    tab: 'vrat-katha',
    // 👇 [कार्ड 2]: व्रत कथा की फोटो का लिंक यहाँ डालें (खाली छोड़ने पर स्क्रीनशॉट 1 वाला कथा चित्र दिखेगा)
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRinI9n5KbE0LBuK_-35dwo9a8j08bePg1_14urLROfBw&s=10', 
  },
  {
    id: 'aarti-sangrah',
    title: 'आरती',
    tab: 'aarti-sangrah',
    // 👇 [कार्ड 3]: आरती की फोटो का लिंक यहाँ डालें (खाली छोड़ने पर स्क्रीनशॉट 1 वाला आरती चित्र दिखेगा)
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVVG3-WlvcEwYYcdGzTG3VE5dKw6nufH_yfzV6UTEvtQ&s=10', 
  },
  {
    id: 'samagri-list',
    title: 'पूजन सामग्री',
    tab: 'samagri-list',
    // 👇 [कार्ड 4]: पूजन सामग्री की फोटो का लिंक यहाँ डालें (खाली छोड़ने पर स्क्रीनशॉट 1 वाली थाली दिखेगी)
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqJjzijQHj7cVzHKKnYV7eDgJIzIlHZFbVzDAhzMqu3w&s=10', 
  },
  {
    id: 'mantra-list',
    title: 'मंत्र',
    tab: 'mantra-list',
    // 👇 [कार्ड 5]: मंत्र की फोटो का लिंक यहाँ डालें (खाली छोड़ने पर स्क्रीनशॉट 1 वाला ध्यान चित्र दिखेगा)
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_T6gRn1GSej94rqKCSAjaiW3r_UjWlxC_6LXWqgG-WQ&s=10', 
  },
  {
    id: 'famous-temples',
    title: 'प्रसिद्ध मंदिर',
    tab: 'famous-temples',
    // 👇 [कार्ड 6]: प्रसिद्ध मंदिर की फोटो का लिंक यहाँ डालें (खाली छोड़ने पर स्क्रीनशॉट 1 वाला मंदिर दिखेगा)
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ6mnUo3ISJQ2dguQ7krCuv5cwl_D1950QHfS2PvTlPg&s=10', 
  }
];

// ==============================================================================================
// 🎨 SCREENSHOT 1 ORIGINAL SACRED VECTOR ILLUSTRATIONS (Clean, Radiant & High Quality)
// ==============================================================================================

// Card 1: Vedic Kalash with Coconut, Mango Leaves and Om (पूजा विधि)
const KalashIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Coconut */}
    <ellipse cx="50" cy="30" rx="13" ry="16" fill="#8B4513" />
    <path d="M42 20 Q50 28 58 20" stroke="#713f12" strokeWidth="1.5" fill="none" />
    {/* Mango leaves */}
    <path d="M50 32 C30 25 18 16 18 8 C28 16 42 26 50 32 Z" fill="#22c55e" />
    <path d="M50 32 C70 25 82 16 82 8 C72 16 58 26 50 32 Z" fill="#22c55e" />
    <path d="M50 30 C35 18 35 4 50 -2 C65 4 65 18 50 30 Z" fill="#16a34a" />
    <path d="M50 32 C38 28 28 24 26 18 C36 22 46 28 50 32 Z" fill="#15803d" />
    <path d="M50 32 C62 28 72 24 74 18 C64 22 54 28 50 32 Z" fill="#15803d" />
    {/* Kalash Pot (Brass/Gold) */}
    <path d="M34 40 L66 40 L76 66 C78 75 72 84 59 85 L41 85 C28 84 22 75 24 66 Z" fill="url(#goldGradient)" stroke="#b45309" strokeWidth="2" />
    {/* Neck of Kalash with Red sacred thread */}
    <rect x="32" y="38" width="36" height="6" rx="2" fill="#dc2626" />
    <line x1="32" y1="41" x2="68" y2="41" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
    {/* Sacred Swastik / Om on pot */}
    <text x="50" y="67" textAnchor="middle" fill="#78350f" fontSize="18" fontWeight="bold" fontFamily="serif">ॐ</text>
    {/* Base */}
    <ellipse cx="50" cy="86" rx="17" ry="4" fill="#d97706" />
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
);

// Card 2: Worshiping Devotee Woman in Yellow Saree with Folded Hands (व्रत कथा)
const VratKathaIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Radiant Halo */}
    <circle cx="50" cy="46" r="38" fill="#fef3c7" opacity="0.7" />
    {/* Hair Bun */}
    <circle cx="50" cy="27" r="14" fill="#292524" />
    {/* Saree Pallu (Yellow/Gold) */}
    <path d="M35 28 C35 15 65 15 65 28 C65 44 72 62 76 85 L24 85 C28 62 35 44 35 28 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
    {/* Face */}
    <circle cx="50" cy="29" r="10" fill="#fed7aa" />
    {/* Red Bindi */}
    <circle cx="50" cy="27" r="1.5" fill="#dc2626" />
    {/* Saree Red Border */}
    <path d="M35 26 C42 22 58 22 65 26" stroke="#dc2626" strokeWidth="2.5" />
    {/* Folded Hands in Namaste */}
    <path d="M46 54 L50 40 L54 54 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
    {/* Bangles */}
    <rect x="44" y="52" width="4" height="2" fill="#dc2626" />
    <rect x="52" y="52" width="4" height="2" fill="#dc2626" />
    {/* Diya in front */}
    <ellipse cx="50" cy="85" rx="12" ry="4" fill="#b45309" />
    <path d="M48 81 Q50 73 52 81 Z" fill="#f59e0b" />
    <path d="M49 81 Q50 75 51 81 Z" fill="#fef08a" />
  </svg>
);

// Card 3: Pious Devotee Woman in Red Saree Praying / Aarti (आरती)
const AartiIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Radiant Aura */}
    <circle cx="50" cy="46" r="38" fill="#fee2e2" opacity="0.7" />
    {/* Hair Bun */}
    <circle cx="50" cy="27" r="14" fill="#1c1917" />
    {/* Saree Pallu (Auspicious Red) */}
    <path d="M35 28 C35 15 65 15 65 28 C65 44 72 62 76 85 L24 85 C28 62 35 44 35 28 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
    {/* Face */}
    <circle cx="50" cy="29" r="10" fill="#fed7aa" />
    {/* Red Bindi & Sindoor */}
    <circle cx="50" cy="26" r="1.5" fill="#7f1d1d" />
    <line x1="50" y1="19" x2="50" y2="23" stroke="#b91c1c" strokeWidth="2" />
    {/* Golden Saree Border */}
    <path d="M35 26 C42 22 58 22 65 26" stroke="#fbbf24" strokeWidth="2.5" />
    {/* Folded Hands in Prayer */}
    <path d="M46 54 L50 40 L54 54 Z" fill="#fed7aa" stroke="#b45309" strokeWidth="1" />
    {/* Gold Bangles */}
    <rect x="44" y="52" width="4" height="2" fill="#fbbf24" />
    <rect x="52" y="52" width="4" height="2" fill="#fbbf24" />
  </svg>
);

// Card 4: Traditional Brass Puja Thali with Diya, Incense and Flowers (पूजन सामग्री)
const SamagriIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Brass Puja Thali Plate */}
    <ellipse cx="50" cy="62" rx="43" ry="19" fill="url(#thaliGold)" stroke="#b45309" strokeWidth="2" />
    <ellipse cx="50" cy="61" rx="37" ry="15" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
    {/* Incense Sticks & Whimsical Smoke */}
    <path d="M68 55 L75 35" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    <path d="M72 56 L79 37" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    <path d="M75 33 Q71 22 78 14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.65" />
    {/* Diya Lamp with Golden Flame */}
    <ellipse cx="32" cy="60" rx="9" ry="4.5" fill="#b45309" />
    <path d="M29 58 Q32 44 35 58 Z" fill="#f59e0b" />
    <path d="M30.5 58 Q32 49 33.5 58 Z" fill="#fef08a" />
    {/* Kumkum & Haldi Bowls */}
    <circle cx="48" cy="57" r="5" fill="#dc2626" />
    <circle cx="57" cy="61" r="4.5" fill="#eab308" />
    {/* Marigold Flowers & Akshat */}
    <circle cx="41" cy="65" r="4" fill="#f97316" />
    <circle cx="63" cy="55" r="4" fill="#f43f5e" />
    <circle cx="50" cy="67" r="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
    <defs>
      <linearGradient id="thaliGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
  </svg>
);

// Card 5: Meditating Yogi Silhouette in Lotus Pose with Om Halo (मंत्र)
const MantraIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Radiant Spiritual Halo */}
    <circle cx="50" cy="50" r="36" fill="#fef3c7" opacity="0.8" />
    <circle cx="50" cy="50" r="28" fill="#fde68a" opacity="0.6" />
    {/* Head */}
    <circle cx="50" cy="30" r="9.5" fill="#1c1917" />
    {/* Neck */}
    <rect x="47" y="38" width="6" height="5" fill="#1c1917" />
    {/* Torso */}
    <path d="M36 44 C42 42 58 42 64 44 L60 67 L40 67 Z" fill="#1c1917" />
    {/* Arms in Dhyana Mudra */}
    <path d="M36 44 L25 63 L42 67 Z" fill="#1c1917" />
    <path d="M64 44 L75 63 L58 67 Z" fill="#1c1917" />
    {/* Padmasana Folded Legs */}
    <path d="M20 75 C20 67 36 67 50 69 C64 67 80 67 80 75 C80 81 20 81 20 75 Z" fill="#0c0a09" />
    {/* Gyan Mudra Hands on Knees */}
    <circle cx="26" cy="69" r="4" fill="#1c1917" />
    <circle cx="74" cy="69" r="4" fill="#1c1917" />
  </svg>
);

// Card 6: Sacred Grand Temple Mandir Shikhara with Flag (प्रसिद्ध मंदिर)
const TempleIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    {/* Temple Base */}
    <rect x="24" y="66" width="52" height="21" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
    {/* Temple Gate / Garbhagriha */}
    <path d="M42 87 L42 72 Q50 66 58 72 L58 87 Z" fill="#451a03" />
    <circle cx="50" cy="74" r="2.5" fill="#fef08a" />
    {/* Shikhara Tier 1 */}
    <path d="M28 66 L34 50 L66 50 L72 66 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
    {/* Shikhara Tier 2 */}
    <path d="M34 50 L40 36 L60 36 L66 50 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
    {/* Shikhara Top Pyramid */}
    <path d="M40 36 L46 22 L54 22 L60 36 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
    {/* Golden Kalash on Top */}
    <ellipse cx="50" cy="20" rx="4.5" ry="3.5" fill="#f59e0b" />
    {/* Saffron Flag (भगवा ध्वज) */}
    <line x1="50" y1="20" x2="50" y2="7" stroke="#78350f" strokeWidth="2" />
    <path d="M50 7 L65 11 L50 15 Z" fill="#ea580c" />
  </svg>
);

// Renders either the user's custom photo OR the exact Screenshot 1 vector illustration
const renderCardVisual = (card: typeof HOME_6_FEATURE_CARDS[0]) => {
  if (card.image && card.image.trim()) {
    return (
      <img
        src={card.image.trim()}
        alt={card.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        onError={(e) => {
          // If custom image link fails, fallback to vector illustration
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // Exact Screenshot 1 Vector Illustrations (Prominent and beautifully scaled)
  switch (card.id) {
    case 'puja-vidhi':
      return <KalashIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
    case 'vrat-katha':
      return <VratKathaIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
    case 'aarti-sangrah':
      return <AartiIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
    case 'samagri-list':
      return <SamagriIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
    case 'mantra-list':
      return <MantraIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
    case 'famous-temples':
      return <TempleIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
    default:
      return <KalashIllustration className="w-16 h-16 sm:w-18 sm:h-18 mx-auto drop-shadow-xs" />;
  }
};

export const VratHomeView: React.FC<VratHomeViewProps> = ({
  onNavigate,
  onOpenSidebarMenu,
  onSelectFestival
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  // DYNAMIC CALENDAR-BASED FESTIVAL BANNERS:
  // Automatically computes 5 recent past festivals + 5 upcoming festivals based on today's calendar date!
  const calendarBanners: DynamicBannerItem[] = useMemo(() => {
    return getDynamicCalendarBanners(new Date());
  }, []);

  // Moving banner timer - rotates every 4.5 seconds (pauses when user touches or hovers)
  useEffect(() => {
    if (calendarBanners.length === 0 || isBannerPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % calendarBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [calendarBanners.length, isBannerPaused]);

  // Manual Previous Slide
  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex(prev => (prev - 1 + calendarBanners.length) % calendarBanners.length);
  };

  // Manual Next Slide
  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex(prev => (prev + 1) % calendarBanners.length);
  };

  // Touch Swipe Handlers for Mobile Phone Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsBannerPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      // Swipe sensitivity threshold (40px)
      if (diff > 40) {
        // Swiped Left -> Advance to next banner
        handleNextSlide();
      } else if (diff < -40) {
        // Swiped Right -> Go to previous banner
        handlePrevSlide();
      }
    }
    setTouchStartX(null);
    setIsBannerPaused(false);
  };

  // Handle clicking on ANY festival banner -> Opens dedicated full-featured app section!
  const handleBannerClick = (banner: DynamicBannerItem) => {
    if (banner.isChhath || banner.id.startsWith('chhath')) {
      onNavigate('home');
    } else {
      if (onSelectFestival) {
        onSelectFestival(banner);
      }
      onNavigate('festival-detail');
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
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#fdf6ee] via-[#faebd7]/30 to-[#fdf6ee] text-[#451a03] flex flex-col justify-start">
      {/* 1. TOP SUB-HEADER (Matching Screenshot 1: 9-Dot Menu, Search Pill, Heart Button) */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-3 sm:px-4 py-2 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Left: 9-Dot Grid Menu Button */}
          <button
            onClick={onOpenSidebarMenu}
            className="w-9 h-9 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#78350f] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0 cursor-pointer"
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

          {/* Center: Search Pill Bar ("पूजा, आरती, मंत्र खोजें...") */}
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a3412] p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: Heart / Favorites Button */}
          <button
            onClick={() => onNavigate('my-chhath')}
            className="w-9 h-9 rounded-2xl bg-white border border-[#fed7aa] shadow-xs flex items-center justify-center text-[#9a3412] hover:bg-[#fff7ed] active:scale-95 transition-all shrink-0 cursor-pointer"
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
                className="text-xs text-[#9a3412] font-semibold cursor-pointer"
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

      {/* 2. DYNAMIC MOVABLE FESTIVAL BANNER (Ultra-Clean + Touch Swipe + Manual Left/Right Controls + Clickable Dots) */}
      <div className="max-w-md mx-auto w-full px-3 sm:px-4 pt-2">
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsBannerPaused(true)}
          onMouseLeave={() => setIsBannerPaused(false)}
          className="relative rounded-2xl overflow-hidden border border-[#fed7aa] shadow-xs bg-gradient-to-r from-[#fffbeb] via-[#fff7ed] to-[#fef3c7] h-32 sm:h-36 group select-none"
        >
          {/* Left Arrow: Manual Previous Festival */}
          <button
            type="button"
            onClick={handlePrevSlide}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/80 hover:bg-white text-[#78350f] flex items-center justify-center shadow-xs border border-amber-200 cursor-pointer backdrop-blur-xs transition-all active:scale-90 opacity-70 group-hover:opacity-100"
            aria-label="पिछला पर्व"
            title="पिछला पर्व"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow: Manual Next Festival */}
          <button
            type="button"
            onClick={handleNextSlide}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/80 hover:bg-white text-[#78350f] flex items-center justify-center shadow-xs border border-amber-200 cursor-pointer backdrop-blur-xs transition-all active:scale-90 opacity-70 group-hover:opacity-100"
            aria-label="अगला पर्व"
            title="अगला पर्व"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {calendarBanners.map((banner, idx) => {
            const isActive = idx === currentSlideIndex;
            const isPast = banner.status === 'past';
            const isToday = banner.status === 'today';

            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className={`absolute inset-0 transition-all duration-700 cursor-pointer flex items-center justify-between px-7 py-3 sm:px-8 sm:py-3.5 ${
                  isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-98 z-0 pointer-events-none'
                }`}
              >
                {/* Traditional Festive Background Glow */}
                <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
                <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-orange-400/20 blur-xl pointer-events-none" />

                {/* Left Side: ONLY Status Indicator, Festival Name, and When It Occurs */}
                <div className="relative z-10 space-y-1.5 max-w-[62%] sm:max-w-[65%]">
                  {/* Status Indicator Badge (आज है / आगामी पर्व / सम्पन्न) */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${
                      isToday
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : isPast
                        ? 'bg-stone-600 text-amber-200'
                        : 'bg-[#ea580c] text-white'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-300" /> : <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-200" />}
                      <span>{isToday ? '🌟 आज है' : isPast ? 'हाल ही में सम्पन्न' : '✨ आगामी पर्व'}</span>
                    </span>
                  </div>

                  {/* Big, Clean Festival Name */}
                  <h2 className="text-lg sm:text-2xl font-black font-serif text-[#78350f] tracking-wide leading-tight drop-shadow-2xs">
                    {banner.title}
                  </h2>

                  {/* When it occurs (Date) */}
                  <p className="text-xs sm:text-sm font-bold text-[#9a3412] font-mukta flex items-center space-x-1">
                    <span>🗓️ {banner.formattedDate}</span>
                  </p>
                </div>

                {/* Right Side: Festival Visual Artwork */}
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center p-1">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-xl shadow-md border-2 border-amber-300/80 drop-shadow-sm filter brightness-95"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}

          {/* Clickable Indicator Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center space-x-1.5 z-20">
            {calendarBanners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentSlideIndex ? 'w-4 bg-[#ea580c]' : 'w-1.5 bg-[#fed7aa] hover:bg-amber-400'
                }`}
                aria-label={`पर्व ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. ALARM STRIP + 6 CORE CARDS (EXACT MATCH TO SCREENSHOT 1 & 2) */}
      <main className="max-w-md mx-auto w-full px-3 sm:px-4 pt-2.5 pb-4 flex-1 flex flex-col gap-2.5 sm:gap-3">
        
        {/* Daily Puja Alarm Strip (Screenshot 1 & 2: Deep Brown Gradient + Bell + Text + White "सेट करें" Button) */}
        <div 
          onClick={() => setIsAlarmModalOpen(true)}
          className="p-2 sm:p-2.5 bg-gradient-to-r from-[#6b2508] via-[#8c320d] to-[#aa4716] rounded-2xl text-white shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all border border-[#f59e0b]/40 shrink-0"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Bell Circle Icon */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#fef3c7] text-[#9a3412] flex items-center justify-center shrink-0 shadow-inner">
              <Bell className="w-4 h-4 animate-swing" />
            </div>
            
            {/* Center Alarm Texts */}
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

          {/* Right: White "सेट करें" Pill Button (Exact Screenshot 1 & 2) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAlarmModalOpen(true);
            }}
            className="bg-white text-[#78350f] font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-[#fff7ed] active:scale-95 shrink-0 transition-all cursor-pointer font-mukta ml-2"
          >
            सेट करें
          </button>
        </div>

        {/* 6 Core Feature Cards: 2 Columns x 3 Rows - Screen-filling elegant cards */}
        <div className="grid grid-cols-2 grid-rows-3 gap-2.5 sm:gap-3 flex-1 min-h-[400px]">
          {HOME_6_FEATURE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.tab)}
              className="group bg-gradient-to-b from-[#fffaf3] to-[#fdeddc] border border-[#fbd8b3]/90 rounded-2xl shadow-xs hover:shadow-md hover:border-[#ea580c]/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden h-full min-h-[125px] sm:min-h-[140px] active:scale-[0.98]"
            >
              {/* Photo / Illustration Container: Pure visual elegance, NO text or badges over image */}
              <div className={`flex-1 flex items-center justify-center overflow-hidden w-full h-full min-h-0 ${card.image && card.image.trim() ? 'p-0' : 'p-2'}`}>
                {card.image && card.image.trim() ? (
                  renderCardVisual(card)
                ) : (
                  <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    {renderCardVisual(card)}
                  </div>
                )}
              </div>

              {/* Bottom Clean White/Cream Title Strip (Exact Screenshot 1 & 2) */}
              <div className="bg-white/95 py-2 px-2 border-t border-[#fed7aa]/60 text-center shrink-0">
                <span className="font-serif font-black text-xs sm:text-sm text-[#5c2409] tracking-wide group-hover:text-[#ea580c] transition-colors block truncate">
                  {card.title}
                </span>
              </div>
            </div>
          ))}
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
