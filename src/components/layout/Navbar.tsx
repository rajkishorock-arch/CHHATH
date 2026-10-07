import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { Language } from '../../types';
import { 
  Sun, 
  Moon, 
  Search, 
  BellRing, 
  Languages, 
  Menu, 
  X, 
  Flame, 
  ShieldCheck,
  User,
  LogOut,
  Sliders,
  LogIn,
  Settings,
  LayoutGrid,
  Film,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReels } from '../../context/ReelsContext';
import { AccountCenterModal } from '../settings/AccountCenterModal';
import { AppSettingsModal } from '../settings/AppSettingsModal';
import { TopSongSearchBar } from '../audio/TopSongSearchBar';
import { SidebarDrawer } from './SidebarDrawer';
import { isNativeApp, getApkDownloadUrl } from '../../utils/platform';

interface NavbarProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAdmin?: () => void;
  onOpenMixer?: () => void;
  onOpenAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab = 'home',
  onNavigate,
  onOpenSearch, 
  onOpenAdmin,
  onOpenMixer,
  onOpenAssistant
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { ringBell } = useAudio();
  const { openReelsPlatform, reelsPlatformOpen } = useReels();
  const { 
    currentUser, 
    isAuthenticated, 
    isAdmin,
    logout, 
    openAuthModal, 
    openAccountCenter,
    accountCenterModalOpen,
    closeAccountCenter,
    accountCenterTab 
  } = useAuth();

  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const langNames: Record<Language, string> = {
    hi: 'हिंदी',
    bho: 'भोजपुरी',
    mai: 'मैथिली',
    mag: 'मगही',
    en: 'English'
  };

  const navText = {
    hi: {
      home: 'होम',
      reels: 'छठ रील्स',
      guide: 'पूजा विधि',
      arghya: 'अर्घ्य समय',
      music: 'छठ संगीत',
      allFeatures: 'सभी फीचर्स',
      allFeaturesDesc: 'सभी 20+ फीचर्स व मेनू खोलें',
      drawerLabel: 'सभी फीचर्स मेनू खोलें',
      searchTitle: 'छठ संगीत खोजें',
      settingsTitle: 'ऐप सेटिंग्स व कस्टमाइजेशन',
      darkTheme: 'डार्क मोड में बदलें',
      lightTheme: 'लाइट मोड में बदलें',
      bellTitle: 'मंदिर घंटी बजाएं',
      login: 'लॉग इन',
      subtitle: 'पावन आस्था एवं भक्ति डिजिटल सेवा',
      myChhath: 'मेरी छठ (डैशबोर्ड)',
      accountSettings: 'अकाउंट सेटिंग्स',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      logout: 'लॉग आउट करें'
    },
    en: {
      home: 'Home',
      reels: 'Reels',
      guide: 'Puja Vidhi',
      arghya: 'Arghya Timings',
      music: 'Chhath Music',
      allFeatures: 'All Features',
      allFeaturesDesc: 'Open all 20+ features and menu',
      drawerLabel: 'Open all features menu',
      searchTitle: 'Search devotional songs',
      settingsTitle: 'App Settings & Customization',
      darkTheme: 'Switch to Dark Mode',
      lightTheme: 'Switch to Light Mode',
      bellTitle: 'Ring Temple Bell',
      login: 'Log In',
      subtitle: 'Divine Faith & Devotion Digital Portal',
      myChhath: 'My Chhath (Dashboard)',
      accountSettings: 'Account Settings',
      adminPanel: 'Admin Control Panel',
      logout: 'Log Out'
    },
    bho: {
      home: 'होम',
      reels: 'छठ रील्स',
      guide: 'पूजा बिधि',
      arghya: 'अरघ के समय',
      music: 'छठ गीत',
      allFeatures: 'सगरी फीचर्स',
      allFeaturesDesc: 'सगरी 20+ फीचर्स आ मेनू खोलीं',
      drawerLabel: 'सगरी फीचर्स मेनू खोलीं',
      searchTitle: 'छठ गीत खोजीं',
      settingsTitle: 'ऐप सेटिंग्स आ कस्टमाइजेशन',
      darkTheme: 'डार्क मोड करीं',
      lightTheme: 'लाइट मोड करीं',
      bellTitle: 'मंदिर के घंटी बजाईं',
      login: 'लॉग इन',
      subtitle: 'पावन आस्था आ भक्ति डिजिटल सेवा',
      myChhath: 'हमार छठ (डैशबोर्ड)',
      accountSettings: 'अकाउंट सेटिंग्स',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      logout: 'लॉग आउट करीं'
    },
    mai: {
      home: 'होम',
      reels: 'छठि रील्स',
      guide: 'पूजा विधि',
      arghya: 'अर्घ्य समय',
      music: 'छठि गीत',
      allFeatures: 'समस्त फीचर्स',
      allFeaturesDesc: 'समस्त 20+ फीचर्स ओ मेनू खोलू',
      drawerLabel: 'समस्त फीचर्स मेनू खोलू',
      searchTitle: 'छठि गीत खोजू',
      settingsTitle: 'ऐप सेटिंग्स ओ कस्टमाइजेशन',
      darkTheme: 'डार्क मोड करू',
      lightTheme: 'लाइट मोड करू',
      bellTitle: 'मंदिरक घंटी बजाउ',
      login: 'लॉग इन',
      subtitle: 'पावन आस्था ओ भक्ति डिजिटल सेवा',
      myChhath: 'हमर छठि (डैशबोर्ड)',
      accountSettings: 'अकाउंट सेटिंग्स',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      logout: 'लॉग आउट करू'
    },
    mag: {
      home: 'होम',
      reels: 'छठ रील्स',
      guide: 'पूजा विधि',
      arghya: 'अर्घ्य समय',
      music: 'छठ गीत',
      allFeatures: 'सभे फीचर्स',
      allFeaturesDesc: 'सभे 20+ फीचर्स आ मेनू खोली',
      drawerLabel: 'सभे फीचर्स मेनू खोली',
      searchTitle: 'छठ गीत खोजी',
      settingsTitle: 'ऐप सेटिंग्स आ कस्टमाइजेशन',
      darkTheme: 'डार्क मोड करी',
      lightTheme: 'लाइट मोड करी',
      bellTitle: 'मंदिर के घंटी बजाई',
      login: 'लॉग इन',
      subtitle: 'पावन आस्था आ भक्ति डिजिटल सेवा',
      myChhath: 'हमर छठ (डैशबोर्ड)',
      accountSettings: 'अकाउंट सेटिंग्स',
      adminPanel: 'एडमिन कंट्रोल पैनल',
      logout: 'लॉग आउट करी'
    }
  }[language] || {
    home: 'होम',
    reels: 'छठ रील्स',
    guide: 'पूजा विधि',
    arghya: 'अर्घ्य समय',
    music: 'छठ संगीत',
    allFeatures: 'सभी फीचर्स',
    allFeaturesDesc: 'सभी 20+ फीचर्स व मेनू खोलें',
    drawerLabel: 'सभी फीचर्स मेनू खोलें',
    searchTitle: 'छठ संगीत खोजें',
    settingsTitle: 'ऐप सेटिंग्स व कस्टमाइजेशन',
    darkTheme: 'डार्क मोड में बदलें',
    lightTheme: 'लाइट मोड में बदलें',
    bellTitle: 'मंदिर घंटी बजाएं',
    login: 'लॉग इन',
    subtitle: 'पावन आस्था एवं भक्ति डिजिटल सेवा',
    myChhath: 'मेरी छठ (डैशबोर्ड)',
    accountSettings: 'अकाउंट सेटिंग्स',
    adminPanel: 'एडमिन कंट्रोल पैनल',
    logout: 'लॉग आउट करें'
  };

  const primaryNavLinks: { id: string; label: string; href: string; badge?: string; isReels?: boolean }[] = [
    { id: 'home', label: navText.home, href: '#home' },
    { id: 'reels', label: navText.reels, href: '#reels', isReels: true },
    { id: 'guide', label: navText.guide, href: '#guide' },
    { id: 'arghya', label: navText.arghya, href: '#arghya' },
    { id: 'music', label: navText.music, href: '#music' }
  ];

  // Global listener to open sidebar drawer from any feature or button
  React.useEffect(() => {
    const handleOpenDrawer = () => setSidebarDrawerOpen(true);
    const handleOpenMobileSearch = () => setMobileSearchOpen(true);
    window.addEventListener('open_sidebar_drawer', handleOpenDrawer);
    window.addEventListener('open_mobile_search', handleOpenMobileSearch);
    return () => {
      window.removeEventListener('open_sidebar_drawer', handleOpenDrawer);
      window.removeEventListener('open_mobile_search', handleOpenMobileSearch);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarDrawerOpen(false);
        setLangDropdownOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === 'reels') {
      openReelsPlatform('foryou');
      setSidebarDrawerOpen(false);
      return;
    }
    if (onNavigate) {
      onNavigate(id);
      setSidebarDrawerOpen(false);
    }
  };

  const handleSearchNavigate = (query?: string) => {
    if (query) {
      window.dispatchEvent(new CustomEvent('chhath_music_search', { detail: { query } }));
    }
    if (onNavigate) {
      onNavigate('music');
    } else {
      window.location.hash = query ? `#music?q=${encodeURIComponent(query)}` : '#music';
    }
  };

  // Smart YouTube-style auto-hide on scroll down, instant reveal on scroll up
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = React.useRef(0);
  const pivotYRef = React.useRef(0);
  const scrollDirectionRef = React.useRef<'up' | 'down' | null>(null);

  React.useEffect(() => {
    let animationFrameId: number;
    lastScrollYRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    pivotYRef.current = lastScrollYRef.current;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rawY = window.scrollY || document.documentElement.scrollTop || 0;
        const currentY = Math.max(0, rawY);
        const lastY = lastScrollYRef.current;
        const diff = currentY - lastY;

        // Keep header visible when near the top of the page
        if (currentY <= 30) {
          setIsVisible(true);
          scrollDirectionRef.current = null;
          pivotYRef.current = currentY;
          lastScrollYRef.current = currentY;
          return;
        }

        // Keep header visible if any modal/drawer/dropdown is open
        if (
          sidebarDrawerOpen ||
          mobileSearchOpen ||
          langDropdownOpen ||
          userMenuOpen ||
          settingsModalOpen ||
          accountCenterModalOpen
        ) {
          setIsVisible(true);
          pivotYRef.current = currentY;
          lastScrollYRef.current = currentY;
          return;
        }

        if (diff > 0) {
          // Scrolling downwards into content
          if (scrollDirectionRef.current !== 'down') {
            scrollDirectionRef.current = 'down';
            pivotYRef.current = currentY;
          }
          if (currentY - pivotYRef.current > 15 && currentY > 40) {
            setIsVisible(false);
          }
        } else if (diff < 0) {
          // Scrolling upwards towards top
          if (scrollDirectionRef.current !== 'up') {
            scrollDirectionRef.current = 'up';
            pivotYRef.current = currentY;
          }
          if (pivotYRef.current - currentY > 8) {
            setIsVisible(true);
          }
        }

        lastScrollYRef.current = currentY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    sidebarDrawerOpen,
    mobileSearchOpen,
    langDropdownOpen,
    userMenuOpen,
    settingsModalOpen,
    accountCenterModalOpen
  ]);

  // Always show header on tab / view change
  React.useEffect(() => {
    setIsVisible(true);
    pivotYRef.current = 0;
    lastScrollYRef.current = 0;
  }, [activeTab]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 chhath-glass border-b border-stone-200/80 dark:border-amber-500/20 shadow-sm backdrop-blur-xl bg-white/95 dark:bg-stone-950/90 transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-20 px-2 sm:px-4 md:px-6">
        
        {/* Left: Sidebar Drawer Trigger + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {/* Hamburger / All Features Drawer Button (Available on all devices) */}
          <button
            onClick={() => setSidebarDrawerOpen(true)}
            aria-label={navText.drawerLabel}
            title={navText.drawerLabel}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-500/15 hover:text-amber-600 active:scale-95 transition-all shrink-0 border border-stone-200/60 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Brand Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-2 sm:gap-2.5 text-decoration-none group min-w-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-200 shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center overflow-hidden border border-amber-300/40">
                <span className="text-lg sm:text-2xl filter drop-shadow">🌅</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-stone-950 rounded-full p-0.5 shadow">
                <Flame className="w-3 h-3 text-amber-950 fill-amber-200" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-rozha text-lg sm:text-2xl font-black text-amber-900 dark:text-amber-100 leading-tight drop-shadow-sm truncate">
                {t.siteTitle}
              </span>
              <span className="hidden xl:block text-[10px] font-mukta font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 truncate">
                {navText.subtitle}
              </span>
            </div>
          </a>
        </div>

        {/* Center: YouTube Top Song Search Bar (Desktop / Large Tablet) */}
        <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-2 lg:mx-3">
          <TopSongSearchBar onNavigateToMusic={handleSearchNavigate} />
        </div>

        {/* Desktop Primary Nav Items: Essential Links + 1-Tap Reels + "सभी फीचर्स" Drawer Button */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0" aria-label="मुख्य नेविगेशन">
          {primaryNavLinks.map((item) => {
            const isActive = item.isReels ? reelsPlatformOpen : activeTab === item.id;
            if (item.isReels) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleNavClick(e, item.id)}
                  title={item.label}
                  className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-mukta font-extrabold transition-all duration-200 flex items-center gap-1.5 border shadow-sm group active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white border-orange-400 shadow-orange-500/30 ring-2 ring-orange-400/50'
                      : 'bg-gradient-to-r from-red-600/15 via-orange-500/15 to-amber-500/15 hover:from-red-600/25 hover:via-orange-500/25 hover:to-amber-500/25 text-red-700 dark:text-amber-300 border-orange-500/30 hover:border-orange-500/60'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-red-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-mukta font-bold transition-all duration-200 text-decoration-none flex items-center gap-1 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold leading-tight ${
                    isActive ? 'bg-stone-950 text-amber-300' : 'bg-red-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}

          {/* "सभी फीचर्स" Drawer Quick Trigger */}
          <button
            onClick={() => setSidebarDrawerOpen(true)}
            className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-mukta font-extrabold transition-all duration-200 flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40 shadow-xs group"
            title={navText.allFeaturesDesc}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>{navText.allFeatures}</span>
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Mobile Song Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            title={navText.searchTitle}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 transition-all border border-amber-500/30 shadow-sm"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Web-Only Direct APK Download Button (Hidden inside installed Native App) */}
          {!isNativeApp() && (
            <a
              href={getApkDownloadUrl()}
              download="chhath-app-debug.apk"
              title="एंड्रॉइड ऐप डाउनलोड करें"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mukta font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs hover:scale-105 active:scale-95 transition-all text-decoration-none border border-emerald-400/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">ऐप डाउनलोड</span>
              <span className="xs:hidden">ऐप</span>
            </a>
          )}

          {/* Dedicated Settings Button (Opens Full Page #settings) */}
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('settings');
              } else {
                window.location.hash = '#settings';
              }
            }}
            title={navText.settingsTitle}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border shadow-sm ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-bold'
                : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border-amber-500/30'
            }`}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </button>

          {/* Theme Toggle Button (Desktop only, removed on phone layout) */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? navText.darkTheme : navText.lightTheme}
            className="hidden md:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:text-amber-500 transition-colors shadow-sm"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            )}
          </button>

          {/* Mobile Phone Only: Premium Login Sign / Profile Avatar linking to 'my-chhath' */}
          {isAuthenticated && currentUser ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(e, 'my-chhath');
              }}
              className="flex md:hidden items-center justify-center p-[2px] rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md active:scale-95 transition-all cursor-pointer"
              title="मेरी प्रोफाइल (My Chhath)"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-extrabold text-amber-950 font-sans">
                    {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : '👤'}
                  </span>
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              title="लॉग इन"
            >
              <User className="w-3.5 h-3.5 text-stone-950" />
              <span>लॉग इन</span>
            </button>
          )}

          {/* Desktop-Only Temple Bell Sound */}
          <button
            onClick={ringBell}
            title={navText.bellTitle}
            className="hidden xl:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 transition-all border border-amber-500/30 shadow-sm"
          >
            <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Desktop User Account / Auth Trigger */}
          {isAuthenticated && currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 transition-all group"
              >
                <div className="flex flex-col text-right hidden xl:flex">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mukta leading-none truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-950 shadow-xs">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-extrabold font-sans">
                      {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : '👤'}
                    </span>
                  )}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-amber-500/30 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-amber-500/20 text-xs">
                    <div className="font-bold text-stone-900 dark:text-stone-100 font-mukta">{currentUser.name}</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">{currentUser.username}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      setUserMenuOpen(false);
                      handleNavClick(e, 'my-chhath');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-stone-800 dark:text-stone-200 hover:bg-amber-500/15 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>{navText.myChhath}</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openAccountCenter('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-stone-800 dark:text-stone-200 hover:bg-amber-500/15 flex items-center gap-2 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-500" />
                    <span>{navText.accountSettings}</span>
                  </button>

                  {isAdmin && onOpenAdmin && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-mukta text-orange-600 dark:text-amber-400 hover:bg-amber-500/15 flex items-center gap-2 border-t border-amber-500/20 font-bold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{navText.adminPanel}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-amber-500/20 mt-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{navText.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-full text-xs font-bold font-mukta text-stone-800 dark:text-stone-200 hover:text-amber-600 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{navText.login}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Expandable Top Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2.5 bg-stone-950/95 border-b border-amber-500/25 shadow-xl animate-in slide-in-from-top duration-200">
          <TopSongSearchBar
            onNavigateToMusic={(q) => {
              setMobileSearchOpen(false);
              handleSearchNavigate(q);
            }}
          />
        </div>
      )}

      {/* Professional Slide-in Sidebar Navigation Drawer (Mobile & Desktop) */}
      <SidebarDrawer
        isOpen={sidebarDrawerOpen}
        onClose={() => setSidebarDrawerOpen(false)}
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (onNavigate) onNavigate(tab);
          setSidebarDrawerOpen(false);
        }}
        onOpenMixer={onOpenMixer}
        onOpenAssistant={onOpenAssistant}
        onOpenAdmin={onOpenAdmin}
      />

      <AccountCenterModal
        isOpen={accountCenterModalOpen}
        onClose={closeAccountCenter}
        initialTab={accountCenterTab}
      />

      <AppSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </header>

    {/* Persistent Layout Spacer for document flow */}
    <div className="h-16 sm:h-20 shrink-0 pointer-events-none" aria-hidden="true" />
  </>
);
};

