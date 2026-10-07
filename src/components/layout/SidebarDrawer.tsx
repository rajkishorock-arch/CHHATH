import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Home, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Sun, 
  Utensils, 
  Flame, 
  FileText, 
  Music, 
  Film, 
  Compass, 
  Sliders, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  Award, 
  Brain,
  Camera,
  User, 
  Users, 
  Settings, 
  ShieldCheck, 
  Share2, 
  Moon, 
  Languages, 
  BellRing, 
  LogIn, 
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenMixer?: () => void;
  onOpenAssistant?: () => void;
  onOpenAdmin?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  onOpenMixer,
  onOpenAssistant,
  onOpenAdmin
}) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { ringBell } = useAudio();
  const { currentUser, isAuthenticated, isAdmin, openAuthModal, openAccountCenter } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  // Close with Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const langNames: Record<Language, string> = {
    hi: 'हिंदी',
    bho: 'भोजपुरी',
    mai: 'मैथिली',
    mag: 'मगही',
    en: 'English'
  };

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const drawerUi = {
    hi: {
      ariaTitle: 'छठ महापर्व संपूर्ण फीचर्स मेनू',
      devoteeDefault: 'छठ व्रती / श्रद्धालु',
      enterPrompt: 'प्रवेश करें व आशीर्वाद पाएं →',
      closeTitle: 'मेनू बंद करें',
      darkMode: 'डार्क',
      lightMode: 'लाइट',
      bellTitle: 'मंदिर घंटी बजाएं',
      searchPlaceholder: 'फीचर या विधि खोजें...',
      footerTitle: 'छठ महापर्व 2026',
      footerSub: 'आस्था, पवित्रता व सूर्य उपासना',
      shareBtn: 'शेयर',
      copiedAlert: 'ऐप लिंक कॉपी हो गया!',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      accountLogged: 'खाता व प्रोफ़ाइल केंद्र',
      accountGuest: 'श्रद्धालु लॉगिन व नया खाता',
      accountLoggedSub: 'लॉग इन व व्यक्तिगत विवरण',
      accountGuestSub: '1-टैप व्रती प्रवेश / साइन अप',
      badgeEntry: 'प्रवेश',
      badgePage: 'पेज',
      badgeNew: 'नया',
      badgePanchang: 'पंचांग',
      badgeDetailed: 'विस्तृत',
      shareTitle: 'छठ महापर्व 2026 — संपूर्ण डिजिटल गाइड व संगीत',
      shareDesc: 'छठ महापर्व 2026 की संपूर्ण पूजा विधि, सूर्य अर्घ्य मुहूर्त, छठ गीत, रील्स व 3D घाट दर्शन:'
    },
    en: {
      ariaTitle: 'Chhath Mahaparv Complete Features Menu',
      devoteeDefault: 'Chhath Devotee / Pilgrim',
      enterPrompt: 'Enter & Receive Blessings →',
      closeTitle: 'Close Menu',
      darkMode: 'Dark',
      lightMode: 'Light',
      bellTitle: 'Ring Temple Bell',
      searchPlaceholder: 'Search feature or ritual...',
      footerTitle: 'Chhath Mahaparv 2026',
      footerSub: 'Devotion, Purity & Solar Worship',
      shareBtn: 'Share',
      copiedAlert: 'App link copied to clipboard!',
      adminPanel: 'Admin Control Panel',
      accountLogged: 'Account & Profile Center',
      accountGuest: 'Devotee Login & Register',
      accountLoggedSub: 'Logged in & Profile details',
      accountGuestSub: '1-Tap Devotee Entry / Sign Up',
      badgeEntry: 'Entry',
      badgePage: 'Page',
      badgeNew: 'New',
      badgePanchang: 'Calendar',
      badgeDetailed: 'Guide',
      shareTitle: 'Chhath Mahaparv 2026 — Complete Digital Guide & Music',
      shareDesc: 'Complete Chhath Puja Vidhi, Surya Arghya Timings 2026, Devotional Songs, Reels & 3D Ghats:'
    },
    bho: {
      ariaTitle: 'छठ महापर्व सगरी फीचर्स मेनू',
      devoteeDefault: 'छठ व्रती / श्रद्धालु',
      enterPrompt: 'प्रवेश करीं आ असीस पाईं →',
      closeTitle: 'मेनू बंद करीं',
      darkMode: 'डार्क',
      lightMode: 'लाइट',
      bellTitle: 'मंदिर के घंटी बजाईं',
      searchPlaceholder: 'फीचर भा बिधि खोजीं...',
      footerTitle: 'छठ महापर्व 2026',
      footerSub: 'आस्था, पवित्रता आ सुरुज उपासना',
      shareBtn: 'शेयर',
      copiedAlert: 'ऐप लिंक कॉपी हो गइल!',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      accountLogged: 'खाता आ प्रोफ़ाइल केंद्र',
      accountGuest: 'श्रद्धालु लॉगिन आ नया खाता',
      accountLoggedSub: 'लॉग इन आ व्यक्तिगत विवरण',
      accountGuestSub: '1-टैप व्रती प्रवेश / साइन अप',
      badgeEntry: 'प्रवेश',
      badgePage: 'पेज',
      badgeNew: 'नया',
      badgePanchang: 'पंचांग',
      badgeDetailed: 'बिस्तार',
      shareTitle: 'छठ महापर्व 2026 — संपूर्ण डिजिटल गाइड व संगीत',
      shareDesc: 'छठ महापर्व 2026 के संपूर्ण पूजा बिधि, सुरुज अरघ समय, छठ गीत, रील्स आ 3D घाट दर्शन:'
    },
    mai: {
      ariaTitle: 'छठि महापर्व समस्त फीचर्स मेनू',
      devoteeDefault: 'छठि व्रती / श्रद्धालु',
      enterPrompt: 'प्रवेश करू ओ आशीर्वाद पाऊ →',
      closeTitle: 'मेनू बंद करू',
      darkMode: 'डार्क',
      lightMode: 'लाइट',
      bellTitle: 'मंदिरक घंटी बजाउ',
      searchPlaceholder: 'फीचर वा विधि खोजू...',
      footerTitle: 'छठि महापर्व 2026',
      footerSub: 'आस्था, पवित्रता ओ सूर्य उपासना',
      shareBtn: 'शेयर',
      copiedAlert: 'ऐप लिंक कॉपी भ गेल!',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      accountLogged: 'खाता ओ प्रोफ़ाइल केंद्र',
      accountGuest: 'श्रद्धालु लॉगिन ओ नव खाता',
      accountLoggedSub: 'लॉग इन ओ व्यक्तिगत विवरण',
      accountGuestSub: '1-टैप व्रती प्रवेश / साइन अप',
      badgeEntry: 'प्रवेश',
      badgePage: 'पेज',
      badgeNew: 'नव',
      badgePanchang: 'पंचांग',
      badgeDetailed: 'विस्तृत',
      shareTitle: 'छठि महापर्व 2026 — संपूर्ण डिजिटल गाइड व संगीत',
      shareDesc: 'छठि महापर्व 2026क संपूर्ण पूजा विधि, सूर्य अर्घ्य मुहूर्त, छठि गीत, रील्स ओ 3D घाट दर्शन:'
    },
    mag: {
      ariaTitle: 'छठ महापर्व सभे फीचर्स मेनू',
      devoteeDefault: 'छठ व्रती / श्रद्धालु',
      enterPrompt: 'प्रवेश करी आ आशीर्वाद पाई →',
      closeTitle: 'मेनू बंद करी',
      darkMode: 'डार्क',
      lightMode: 'लाइट',
      bellTitle: 'मंदिर के घंटी बजाई',
      searchPlaceholder: 'फीचर या विधि खोजी...',
      footerTitle: 'छठ महापर्व 2026',
      footerSub: 'आस्था, पवित्रता आ सूर्य उपासना',
      shareBtn: 'शेयर',
      copiedAlert: 'ऐप लिंक कॉपी हो गेल!',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      accountLogged: 'खाता आ प्रोफ़ाइल केंद्र',
      accountGuest: 'श्रद्धालु लॉगिन आ नया खाता',
      accountLoggedSub: 'लॉग इन आ व्यक्तिगत विवरण',
      accountGuestSub: '1-टैप व्रती प्रवेश / साइन अप',
      badgeEntry: 'प्रवेश',
      badgePage: 'पेज',
      badgeNew: 'नया',
      badgePanchang: 'पंचांग',
      badgeDetailed: 'विस्तृत',
      shareTitle: 'छठ महापर्व 2026 — संपूर्ण डिजिटल गाइड व संगीत',
      shareDesc: 'छठ महापर्व 2026 के संपूर्ण पूजा विधि, सूर्य अर्घ्य समय, छठ गीत, रील्स आ 3D घाट दर्शन:'
    }
  }[language] || {
    ariaTitle: 'छठ महापर्व संपूर्ण फीचर्स मेनू',
    devoteeDefault: 'छठ व्रती / श्रद्धालु',
    enterPrompt: 'प्रवेश करें व आशीर्वाद पाएं →',
    closeTitle: 'मेनू बंद करें',
    darkMode: 'डार्क',
    lightMode: 'लाइट',
    bellTitle: 'मंदिर घंटी बजाएं',
    searchPlaceholder: 'फीचर या विधि खोजें...',
    footerTitle: 'छठ महापर्व 2026',
    footerSub: 'आस्था, पवित्रता व सूर्य उपासना',
    shareBtn: 'शेयर',
    copiedAlert: 'ऐप लिंक कॉपी हो गया!',
    adminPanel: 'एडमिन कंट्रोल पैनल',
    accountLogged: 'खाता व प्रोफ़ाइल केंद्र',
    accountGuest: 'श्रद्धालु लॉगिन व नया खाता',
    accountLoggedSub: 'लॉग इन व व्यक्तिगत विवरण',
    accountGuestSub: '1-टैप व्रती प्रवेश / साइन अप',
    badgeEntry: 'प्रवेश',
    badgePage: 'पेज',
    badgeNew: 'नया',
    badgePanchang: 'पंचांग',
    badgeDetailed: 'विस्तृत',
    shareTitle: 'छठ महापर्व 2026 — संपूर्ण डिजिटल गाइड व संगीत',
    shareDesc: 'छठ महापर्व 2026 की संपूर्ण पूजा विधि, सूर्य अर्घ्य मुहूर्त, छठ गीत, रील्स व 3D घाट दर्शन:'
  };

  const handleShareApp = async () => {
    const shareData = {
      title: drawerUi.shareTitle,
      text: drawerUi.shareDesc,
      url: window.location.origin + window.location.pathname
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert(drawerUi.copiedAlert);
    }
  };

  // Structured Categorized Feature Navigation with full multi-language localization
  const categoriesData = {
    hi: [
      {
        title: 'मुख्य दर्शन व आज',
        subtitle: 'Home & Daily Darshan',
        items: [
          { id: 'home', label: 'होम (मुख्य दर्शन)', sub: 'आज का पंचांग, अर्घ्य व अपडेट्स', icon: Home, highlight: true }
        ]
      },
      {
        title: 'पवित्र अनुष्ठान व नियम',
        subtitle: 'Core Rituals & Vidhi',
        items: [
          { id: 'guide', label: '4 दिवसीय टाइमलाइन', sub: 'नहाय-खाय से पारण', icon: Calendar, badge: 'पंचांग' },
          { id: 'chhath-puja-vidhi', label: 'प्रामाणिक पूजा विधि', sub: 'क्रमवार नियम व संकल्प', icon: BookOpen, badge: 'विस्तृत' },
          { id: 'chhath-samagri', label: 'सूप व दौरा सामग्री चेकलिस्ट', sub: 'पारंपरिक वस्तुओं की सूची', icon: CheckSquare },
          { id: 'chhath-arghya-time-2026', label: 'सूर्य अर्घ्य मुहूर्त व समय', sub: 'सूर्यास्त व सूर्योदय समय', icon: Sun, highlight: true },
          { id: 'thekua-recipe', label: 'ठेकुआ व महाप्रसाद विधि', sub: 'काठ के सांचे की रेसिपी', icon: Utensils },
          { id: 'aarti', label: 'पावन मंत्र, स्तोत्र व आरती', sub: 'दैनिक स्तुति व सूर्य वंदना', icon: Flame },
          { id: 'chhath-puja-katha', label: 'छठ व्रत पावन कथा', sub: 'राजा प्रियव्रत व छठी मईया', icon: FileText }
        ]
      },
      {
        title: 'भक्ति संगीत, रील्स व घाट',
        subtitle: 'Media, Reels & Ghats',
        items: [
          { id: 'music', label: 'छठ भक्ति गीत स्टूडियो', sub: 'अमृतमयी भक्ति स्वर व भजन', icon: Music, badge: 'संगीत', highlight: true },
          { id: 'reels', label: 'छठ रील्स व शॉर्ट वीडियो', sub: '9:16 पूर्ण स्क्रीन फीड', icon: Film, badge: 'नया', highlight: true },
          { id: 'ghats', label: 'पावन घाट व सुरक्षा निर्देशिका', sub: 'पटना, वाराणसी, हरिद्वार', icon: Compass },
          { 
            id: 'mixer_action', 
            label: 'वातावरण ऑडियो मिक्सर', 
            sub: 'गंगा लहर, बांसुरी, दीया', 
            icon: Sliders,
            action: () => {
              onClose();
              onOpenMixer?.();
            }
          }
        ]
      },
      {
        title: 'डिजिटल अनुभव व एआई',
        subtitle: 'Interactive & AI Tools',
        items: [
          { id: '3d-ghat', label: '3D घाट 360° दर्शन', sub: 'पावन गंगा घाट व आभासी अर्घ्य', icon: Compass, badge: '3D', highlight: true },
          { id: 'blessing-certificate', label: 'डिजिटल आशीर्वाद पत्र', sub: 'व्यक्तिगत HD प्रमाण पत्र', icon: Award, badge: 'नया' },
          { id: 'chhath-memories', label: 'छठ संस्मरण व फोटो', sub: 'पारिवारिक पावन स्मृतियां', icon: Camera, badge: 'क्लाउड' },
          { id: 'chhath-quiz', label: 'छठ महापर्व ज्ञान क्विज', sub: 'संस्कृति व परंपरा प्रश्नोत्तरी', icon: Brain, badge: 'क्विज' },
          { 
            id: 'assistant_action', 
            label: 'छठी मईया एआई सहायक', 
            sub: 'पूछें कोई भी सवाल', 
            icon: MessageSquare,
            badge: 'AI',
            action: () => {
              onClose();
              onOpenAssistant?.();
            }
          }
        ]
      },
      {
        title: 'मेरी छठ व परिवार',
        subtitle: 'Personal & Family',
        items: [
          { id: 'my-chhath', label: 'मेरी छठ डायरी व संकल्प', sub: 'व्यक्तिगत व्रत चेकलिस्ट', icon: Heart, highlight: true }
        ]
      },
      {
        title: 'ऐप प्रबंधन व सेटिंग्स',
        subtitle: 'Preferences & System',
        items: [
          { id: 'settings', label: 'ऐप सेटिंग्स व कस्टमाइजेशन', sub: 'थीम, अलार्म, ऑडियो, कैशे', icon: Settings, badge: 'पेज', highlight: true },
          { 
            id: 'account_action', 
            label: isAuthenticated ? drawerUi.accountLogged : drawerUi.accountGuest, 
            sub: isAuthenticated ? drawerUi.accountLoggedSub : drawerUi.accountGuestSub, 
            icon: User,
            highlight: !isAuthenticated,
            badge: !isAuthenticated ? drawerUi.badgeEntry : undefined,
            action: () => {
              onClose();
              if (isAuthenticated) {
                openAccountCenter('profile');
              } else {
                openAuthModal('quick_devotee');
              }
            }
          }
        ]
      }
    ],
    en: [
      {
        title: 'Home & Daily Darshan',
        subtitle: 'Daily Updates & Timing',
        items: [
          { id: 'home', label: 'Home (Daily Darshan)', sub: "Today's Panchang, Arghya & Updates", icon: Home, highlight: true }
        ]
      },
      {
        title: 'Sacred Rituals & Vidhi',
        subtitle: 'Core Procedures & Rules',
        items: [
          { id: 'guide', label: '4-Day Sacred Timeline', sub: 'Nahay-Khay to Paran', icon: Calendar, badge: 'Calendar' },
          { id: 'chhath-puja-vidhi', label: 'Authentic Puja Vidhi', sub: 'Step-by-step rules & resolution', icon: BookOpen, badge: 'Guide' },
          { id: 'chhath-samagri', label: 'Puja Samagri Checklist', sub: 'Traditional essentials checklist', icon: CheckSquare },
          { id: 'chhath-arghya-time-2026', label: 'Surya Arghya Timings 2026', sub: 'Sunset & sunrise timings', icon: Sun, highlight: true },
          { id: 'thekua-recipe', label: 'Thekua & Mahaprasad Recipe', sub: 'Authentic traditional recipe', icon: Utensils },
          { id: 'aarti', label: 'Sacred Mantras & Aarti', sub: 'Daily solar hymns & prayers', icon: Flame },
          { id: 'chhath-puja-katha', label: 'Chhath Mahaparv Katha', sub: 'Legend of King Priyavrata', icon: FileText }
        ]
      },
      {
        title: 'Devotional Music & Reels',
        subtitle: 'Media, Reels & Ghats',
        items: [
          { id: 'music', label: 'Chhath Music Studio', sub: 'Soulful devotional songs & bhajans', icon: Music, badge: 'Music', highlight: true },
          { id: 'reels', label: 'Chhath Reels & Short Videos', sub: '9:16 full-screen feed', icon: Film, badge: 'New', highlight: true },
          { id: 'ghats', label: 'Sacred Ghats & Safety Guide', sub: 'Patna, Varanasi, Haridwar', icon: Compass },
          { 
            id: 'mixer_action', 
            label: 'Ambient Sound Mixer', 
            sub: 'Ganga waves, flute, temple bell', 
            icon: Sliders,
            action: () => {
              onClose();
              onOpenMixer?.();
            }
          }
        ]
      },
      {
        title: 'Interactive Tools & AI',
        subtitle: 'Digital Features',
        items: [
          { id: '3d-ghat', label: '3D Ghat 360° View', sub: 'Virtual Arghya & Holy Ghats', icon: Compass, badge: '3D', highlight: true },
          { id: 'blessing-certificate', label: 'Blessing Certificate', sub: 'Personalized HD digital certificate', icon: Award, badge: 'New' },
          { id: 'chhath-memories', label: 'Chhath Photo Memories', sub: 'Upload & preserve family moments', icon: Camera, badge: 'Cloud' },
          { id: 'chhath-quiz', label: 'Chhath Mahaparv Quiz', sub: 'Interactive knowledge quiz', icon: Brain, badge: 'Quiz' },
          { 
            id: 'assistant_action', 
            label: 'Chhathi Maiya AI Assistant', 
            sub: 'Ask any puja query anytime', 
            icon: MessageSquare,
            badge: 'AI',
            action: () => {
              onClose();
              onOpenAssistant?.();
            }
          }
        ]
      },
      {
        title: 'My Chhath & Family',
        subtitle: 'Personal Devotion',
        items: [
          { id: 'my-chhath', label: 'My Chhath Diary & Vow', sub: 'Personal fasting checklist', icon: Heart, highlight: true }
        ]
      },
      {
        title: 'Preferences & Settings',
        subtitle: 'Customization & Account',
        items: [
          { id: 'settings', label: 'App Settings & Customization', sub: 'Theme, Alarms, Audio, Cache', icon: Settings, badge: 'Page', highlight: true },
          { 
            id: 'account_action', 
            label: isAuthenticated ? drawerUi.accountLogged : drawerUi.accountGuest, 
            sub: isAuthenticated ? drawerUi.accountLoggedSub : drawerUi.accountGuestSub, 
            icon: User,
            highlight: !isAuthenticated,
            badge: !isAuthenticated ? drawerUi.badgeEntry : undefined,
            action: () => {
              onClose();
              if (isAuthenticated) {
                openAccountCenter('profile');
              } else {
                openAuthModal('quick_devotee');
              }
            }
          }
        ]
      }
    ],
    bho: [
      {
        title: 'मुख्य दर्शन आ आज',
        subtitle: 'Home & Daily Darshan',
        items: [
          { id: 'home', label: 'होम (मुख्य दर्शन)', sub: 'आज के पंचांग, अरघ आ अपडेट्स', icon: Home, highlight: true }
        ]
      },
      {
        title: 'पवित्र अनुष्ठान आ नियम',
        subtitle: 'Core Rituals & Vidhi',
        items: [
          { id: 'guide', label: '4 दिनी टाइमलाइन', sub: 'नहाय-खाय से पारण तक', icon: Calendar, badge: 'पंचांग' },
          { id: 'chhath-puja-vidhi', label: 'प्रामाणिक पूजा बिधि', sub: 'क्रमवार नियम आ संकल्प', icon: BookOpen, badge: 'बिस्तार' },
          { id: 'chhath-samagri', label: 'सूप आ दउरा सामग्री चेकलिस्ट', sub: 'पारंपरिक समान के सूची', icon: CheckSquare },
          { id: 'chhath-arghya-time-2026', label: 'सुरुज अरघ समय', sub: 'सूर्यास्त आ सूर्योदय बेरा', icon: Sun, highlight: true },
          { id: 'thekua-recipe', label: 'ठेकुआ आ महाप्रसाद बिधि', sub: 'काठ के सांचा के रेसिपी', icon: Utensils },
          { id: 'aarti', label: 'पावन मंत्र, स्तोत्र आ आरती', sub: 'दैनिक स्तुति आ सुरुज बंदना', icon: Flame },
          { id: 'chhath-puja-katha', label: 'छठ बरत पावन कथा', sub: 'राजा प्रियव्रत आ छठी मईया', icon: FileText }
        ]
      },
      {
        title: 'भक्ति संगीत, रील्स आ घाट',
        subtitle: 'Media, Reels & Ghats',
        items: [
          { id: 'music', label: 'छठ भक्ति गीत स्टूडियो', sub: 'अमृतमयी स्वर आ भजन', icon: Music, badge: 'गीत', highlight: true },
          { id: 'reels', label: 'छठ रील्स आ छोट वीडियो', sub: '9:16 पूरा स्क्रीन', icon: Film, badge: 'नया', highlight: true },
          { id: 'ghats', label: 'पावन घाट निर्देशिका', sub: 'पटना, बनारस, हरिद्वार', icon: Compass },
          { 
            id: 'mixer_action', 
            label: 'ऑडियो मिक्सर', 
            sub: 'गंगा लहर, बांसुरी, दीया', 
            icon: Sliders,
            action: () => {
              onClose();
              onOpenMixer?.();
            }
          }
        ]
      },
      {
        title: 'डिजिटल अनुभव आ एआई',
        subtitle: 'Interactive & AI Tools',
        items: [
          { id: '3d-ghat', label: '3D घाट 360° दर्शन', sub: 'पावन गंगा घाट आ आभासी अरघ', icon: Compass, badge: '3D', highlight: true },
          { id: 'blessing-certificate', label: 'डिजिटल असीस पत्र', sub: 'व्यक्तिगत HD प्रमाण पत्र', icon: Award, badge: 'नया' },
          { id: 'chhath-memories', label: 'छठ संस्मरण आ फोटो', sub: 'परिवार के पावन सुरति', icon: Camera, badge: 'क्लाउड' },
          { id: 'chhath-quiz', label: 'छठ महापर्व ज्ञान क्विज', sub: 'परंपरा आ संस्कृति सवाल-जवाब', icon: Brain, badge: 'क्विज' },
          { 
            id: 'assistant_action', 
            label: 'छठी मईया एआई सहायक', 
            sub: 'पूछीं कवनो सवाल', 
            icon: MessageSquare,
            badge: 'AI',
            action: () => {
              onClose();
              onOpenAssistant?.();
            }
          }
        ]
      },
      {
        title: 'हमार छठ आ परिवार',
        subtitle: 'Personal & Family',
        items: [
          { id: 'my-chhath', label: 'हमार छठ डायरी व संकल्प', sub: 'अपन बरत चेकलिस्ट', icon: Heart, highlight: true }
        ]
      },
      {
        title: 'ऐप प्रबंधन आ सेटिंग्स',
        subtitle: 'Preferences & System',
        items: [
          { id: 'settings', label: 'ऐप सेटिंग्स आ कस्टमाइजेशन', sub: 'थीम, अलार्म, ऑडियो, कैशे', icon: Settings, badge: 'पेज', highlight: true },
          { 
            id: 'account_action', 
            label: isAuthenticated ? drawerUi.accountLogged : drawerUi.accountGuest, 
            sub: isAuthenticated ? drawerUi.accountLoggedSub : drawerUi.accountGuestSub, 
            icon: User,
            highlight: !isAuthenticated,
            badge: !isAuthenticated ? drawerUi.badgeEntry : undefined,
            action: () => {
              onClose();
              if (isAuthenticated) {
                openAccountCenter('profile');
              } else {
                openAuthModal('quick_devotee');
              }
            }
          }
        ]
      }
    ],
    mai: [
      {
        title: 'मुख्य दर्शन ओ आइ',
        subtitle: 'Home & Daily Darshan',
        items: [
          { id: 'home', label: 'होम (मुख्य दर्शन)', sub: 'आइ के पंचांग, अर्घ्य ओ अपडेट्स', icon: Home, highlight: true }
        ]
      },
      {
        title: 'पवित्र अनुष्ठान ओ नियम',
        subtitle: 'Core Rituals & Vidhi',
        items: [
          { id: 'guide', label: '4 दिवसीय टाइमलाइन', sub: 'नहाय-खाय सं पारण धरि', icon: Calendar, badge: 'पंचांग' },
          { id: 'chhath-puja-vidhi', label: 'प्रामाणिक पूजा विधि', sub: 'क्रमवार नियम ओ संकल्प', icon: BookOpen, badge: 'विस्तृत' },
          { id: 'chhath-samagri', label: 'सूप ओ दौरा सामग्री चेकलिस्ट', sub: 'पारंपरिक सामग्री सूची', icon: CheckSquare },
          { id: 'chhath-arghya-time-2026', label: 'सूर्य अर्घ्य मुहूर्त', sub: 'सूर्यास्त ओ सूर्योदय काल', icon: Sun, highlight: true },
          { id: 'thekua-recipe', label: 'ठेकुआ ओ महाप्रसाद विधि', sub: 'काठक सांचाक रेसिपी', icon: Utensils },
          { id: 'aarti', label: 'पावन मंत्र, स्तोत्र ओ आरती', sub: 'दैनिक स्तुति ओ सूर्य वंदना', icon: Flame },
          { id: 'chhath-puja-katha', label: 'छठि व्रत पावन कथा', sub: 'राजा प्रियव्रत ओ छठी मईया', icon: FileText }
        ]
      },
      {
        title: 'भक्ति संगीत, रील्स ओ घाट',
        subtitle: 'Media, Reels & Ghats',
        items: [
          { id: 'music', label: 'छठि भक्ति गीत स्टूडियो', sub: 'अमृतमयी स्वर ओ भजन', icon: Music, badge: 'गीत', highlight: true },
          { id: 'reels', label: 'छठि रील्स ओ वीडियो', sub: '9:16 पूर्ण स्क्रीन', icon: Film, badge: 'नव', highlight: true },
          { id: 'ghats', label: 'पावन घाट निर्देशिका', sub: 'पटना, दरभंगा, हरिद्वार', icon: Compass },
          { 
            id: 'mixer_action', 
            label: 'ऑडियो मिक्सर', 
            sub: 'गंगा तरंग, बांसुरी, दीप', 
            icon: Sliders,
            action: () => {
              onClose();
              onOpenMixer?.();
            }
          }
        ]
      },
      {
        title: 'डिजिटल अनुभव ओ एआई',
        subtitle: 'Interactive & AI Tools',
        items: [
          { id: '3d-ghat', label: '3D घाट 360° दर्शन', sub: 'पावन गंगा घाट ओ आभासी अर्घ्य', icon: Compass, badge: '3D', highlight: true },
          { id: 'blessing-certificate', label: 'डिजिटल आशीष पत्र', sub: 'व्यक्तिगत HD प्रमाण पत्र', icon: Award, badge: 'नव' },
          { id: 'chhath-memories', label: 'छठि संस्मरण ओ फोटो', sub: 'परिवारक पावन संस्मरण', icon: Camera, badge: 'क्लाउड' },
          { id: 'chhath-quiz', label: 'छठि महापर्व ज्ञान क्विज', sub: 'संस्कृति ओ परंपरा प्रश्नोत्तरी', icon: Brain, badge: 'क्विज' },
          { 
            id: 'assistant_action', 
            label: 'छठी मईया एआई सहायक', 
            sub: 'पुछू कोनो प्रश्न', 
            icon: MessageSquare,
            badge: 'AI',
            action: () => {
              onClose();
              onOpenAssistant?.();
            }
          }
        ]
      },
      {
        title: 'हमर छठि ओ परिवार',
        subtitle: 'Personal & Family',
        items: [
          { id: 'my-chhath', label: 'हमर छठि डायरी ओ संकल्प', sub: 'व्यक्तिगत व्रत चेकलिस्ट', icon: Heart, highlight: true }
        ]
      },
      {
        title: 'ऐप प्रबंधन ओ सेटिंग्स',
        subtitle: 'Preferences & System',
        items: [
          { id: 'settings', label: 'ऐप सेटिंग्स ओ कस्टमाइजेशन', sub: 'थीम, अलार्म, ऑडियो, कैशे', icon: Settings, badge: 'पेज', highlight: true },
          { 
            id: 'account_action', 
            label: isAuthenticated ? drawerUi.accountLogged : drawerUi.accountGuest, 
            sub: isAuthenticated ? drawerUi.accountLoggedSub : drawerUi.accountGuestSub, 
            icon: User,
            highlight: !isAuthenticated,
            badge: !isAuthenticated ? drawerUi.badgeEntry : undefined,
            action: () => {
              onClose();
              if (isAuthenticated) {
                openAccountCenter('profile');
              } else {
                openAuthModal('quick_devotee');
              }
            }
          }
        ]
      }
    ],
    mag: [
      {
        title: 'मुख्य दर्शन आ आज',
        subtitle: 'Home & Daily Darshan',
        items: [
          { id: 'home', label: 'होम (मुख्य दर्शन)', sub: 'आज के पंचांग, अर्घ्य आ अपडेट्स', icon: Home, highlight: true }
        ]
      },
      {
        title: 'पवित्र अनुष्ठान व नियम',
        subtitle: 'Core Rituals & Vidhi',
        items: [
          { id: 'guide', label: '4 दिनी टाइमलाइन', sub: 'नहाय-खाय से पारण', icon: Calendar, badge: 'पंचांग' },
          { id: 'chhath-puja-vidhi', label: 'प्रामाणिक पूजा विधि', sub: 'क्रमवार नियम व संकल्प', icon: BookOpen, badge: 'विस्तृत' },
          { id: 'chhath-samagri', label: 'सूप व दौरा सामग्री चेकलिस्ट', sub: 'पारंपरिक सामग्री सूची', icon: CheckSquare },
          { id: 'chhath-arghya-time-2026', label: 'सूर्य अर्घ्य मुहूर्त व समय', sub: 'सूर्यास्त व सूर्योदय समय', icon: Sun, highlight: true },
          { id: 'thekua-recipe', label: 'ठेकुआ व महाप्रसाद विधि', sub: 'काठ के सांचे की रेसिपी', icon: Utensils },
          { id: 'aarti', label: 'पावन मंत्र, स्तोत्र व आरती', sub: 'दैनिक स्तुति व सूर्य वंदना', icon: Flame },
          { id: 'chhath-puja-katha', label: 'छठ व्रत पावन कथा', sub: 'राजा प्रियव्रत व छठी मईया', icon: FileText }
        ]
      },
      {
        title: 'भक्ति संगीत, रील्स आ घाट',
        subtitle: 'Media, Reels & Ghats',
        items: [
          { id: 'music', label: 'छठ भक्ति गीत स्टूडियो', sub: 'अमृतमयी स्वर आ भजन', icon: Music, badge: 'गीत', highlight: true },
          { id: 'reels', label: 'छठ रील्स व शॉर्ट वीडियो', sub: '9:16 पूर्ण स्क्रीन फीड', icon: Film, badge: 'नया', highlight: true },
          { id: 'ghats', label: 'पावन घाट व निर्देशिका', sub: 'पटना, गया, हरिद्वार', icon: Compass },
          { 
            id: 'mixer_action', 
            label: 'वातावरण ऑडियो मिक्सर', 
            sub: 'गंगा लहर, बांसुरी, दीया', 
            icon: Sliders,
            action: () => {
              onClose();
              onOpenMixer?.();
            }
          }
        ]
      },
      {
        title: 'डिजिटल अनुभव व एआई',
        subtitle: 'Interactive & AI Tools',
        items: [
          { id: '3d-ghat', label: '3D घाट 360° दर्शन', sub: 'पावन गंगा घाट व आभासी अरघ', icon: Compass, badge: '3D', highlight: true },
          { id: 'blessing-certificate', label: 'डिजिटल असीस पत्र', sub: 'व्यक्तिगत HD प्रमाण पत्र', icon: Award, badge: 'नया' },
          { id: 'chhath-memories', label: 'छठ संस्मरण व फोटो', sub: 'परिवार के पावन सुरति', icon: Camera, badge: 'क्लाउड' },
          { id: 'chhath-quiz', label: 'छठ महापर्व ज्ञान क्विज', sub: 'परंपरा व संस्कृति सवाल-जवाब', icon: Brain, badge: 'क्विज' },
          { 
            id: 'assistant_action', 
            label: 'छठी मईया एआई सहायक', 
            sub: 'पूछीं कवनो सवाल', 
            icon: MessageSquare,
            badge: 'AI',
            action: () => {
              onClose();
              onOpenAssistant?.();
            }
          }
        ]
      },
      {
        title: 'हमर छठ आ परिवार',
        subtitle: 'Personal & Family',
        items: [
          { id: 'my-chhath', label: 'हमर छठ डायरी व संकल्प', sub: 'व्यक्तिगत व्रत चेकलिस्ट', icon: Heart, highlight: true }
        ]
      },
      {
        title: 'ऐप प्रबंधन व सेटिंग्स',
        subtitle: 'Preferences & System',
        items: [
          { id: 'settings', label: 'ऐप सेटिंग्स व कस्टमाइजेशन', sub: 'थीम, अलार्म, ऑडियो, कैशे', icon: Settings, badge: 'पेज', highlight: true },
          { 
            id: 'account_action', 
            label: isAuthenticated ? drawerUi.accountLogged : drawerUi.accountGuest, 
            sub: isAuthenticated ? drawerUi.accountLoggedSub : drawerUi.accountGuestSub, 
            icon: User,
            highlight: !isAuthenticated,
            badge: !isAuthenticated ? drawerUi.badgeEntry : undefined,
            action: () => {
              onClose();
              if (isAuthenticated) {
                openAccountCenter('profile');
              } else {
                openAuthModal('quick_devotee');
              }
            }
          }
        ]
      }
    ]
  };

  const featureCategories = categoriesData[language] || categoriesData.hi;

  if (!isOpen) return null;

  const drawerElement = (
    <div 
      className="fixed inset-0 z-[9999] flex pointer-events-auto font-mukta"
      role="dialog"
      aria-modal="true"
      aria-label={drawerUi.ariaTitle}
    >
      {/* Backdrop Blur Overlay */}
      <div 
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity pointer-events-auto cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Sliding Drawer Container */}
      <div className="relative w-[85vw] max-w-[340px] sm:max-w-sm bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-amber-500/25 h-full max-h-[100dvh] flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300 pointer-events-auto">
        
        {/* Drawer Top Header: Profile Snapshot & Close */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-stone-800 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent flex items-start justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              if (isAuthenticated) {
                openAccountCenter('profile');
              } else {
                openAuthModal('quick_devotee');
              }
            }}
            className="flex items-center gap-3 min-w-0 text-left group cursor-pointer"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-200 p-0.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center font-bold text-lg text-amber-300 border border-amber-300/40">
                {isAuthenticated && currentUser?.name ? currentUser.name.charAt(0) : '🌅'}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-stone-950 flex items-center justify-center ${
                isAuthenticated ? 'bg-emerald-500' : 'bg-amber-400'
              }`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-rozha text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {isAuthenticated ? currentUser?.name : drawerUi.devoteeDefault}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {isAuthenticated ? (currentUser?.email || `@${currentUser?.username}`) : drawerUi.enterPrompt}
              </p>
            </div>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800 transition-colors shrink-0"
            title={drawerUi.closeTitle}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toolbar: Theme, Language, Bell */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:border-amber-400/50 transition-all"
            title={theme === 'light' ? drawerUi.darkMode : drawerUi.lightMode}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{drawerUi.darkMode}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{drawerUi.lightMode}</span>
              </>
            )}
          </button>

          {/* Language Selector Dropdown Chip */}
          <div className="relative flex-1">
            <button
              onClick={() => setLangPickerOpen(!langPickerOpen)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:border-amber-400/50 transition-all"
            >
              <Languages className="w-3.5 h-3.5 text-amber-500" />
              <span>{langNames[language] || 'भाषा'}</span>
            </button>

            {langPickerOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                {(['hi', 'bho', 'mai', 'mag', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l);
                      setLangPickerOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      language === l
                        ? 'bg-amber-500 text-stone-950 font-extrabold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {langNames[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Temple Bell Chime */}
          <button
            onClick={ringBell}
            className="p-1.5 px-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 hover:bg-amber-500/25 transition-all flex items-center justify-center"
            title={drawerUi.bellTitle}
          >
            <BellRing className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature Search Box */}
        <div className="p-3 border-b border-stone-200/80 dark:border-stone-800 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={drawerUi.searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs hover:text-stone-700"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Feature Catalog */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {featureCategories.map((cat, idx) => {
            const filteredItems = cat.items.filter(item => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase().trim();
              return item.label.toLowerCase().includes(q) || (item.sub && item.sub.toLowerCase().includes(q));
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="px-2 py-0.5 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {cat.title}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {cat.subtitle}
                  </span>
                </div>

                <div className="space-y-1">
                  {filteredItems.map((item: any) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else {
                            handleItemClick(item.id);
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                            : item.highlight
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-stone-900 dark:text-stone-100 border border-amber-500/25'
                              : 'bg-white hover:bg-stone-100 dark:bg-stone-900/60 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-stone-950 text-amber-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs sm:text-sm block truncate">
                              {item.label}
                            </span>
                            {item.sub && (
                              <span className={`text-[10px] block truncate ${
                                isSelected ? 'text-stone-900 opacity-90' : 'text-stone-500 dark:text-stone-400'
                              }`}>
                                {item.sub}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                              isSelected
                                ? 'bg-stone-950 text-amber-300'
                                : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-stone-950' : 'text-stone-400'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Admin Link if Admin */}
          {isAdmin && onOpenAdmin && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full text-left p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20 flex items-center justify-between font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{drawerUi.adminPanel}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Drawer Bottom Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between shrink-0">
          <div>
            <span className="font-rozha text-xs font-bold text-amber-700 dark:text-amber-400 block">
              {drawerUi.footerTitle}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              {drawerUi.footerSub}
            </span>
          </div>

          <button
            onClick={handleShareApp}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{drawerUi.shareBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(drawerElement, document.body);
  }

  return drawerElement;
};
