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
  Music2, 
  MapPin, 
  CheckSquare, 
  ShieldCheck,
  Bot,
  Compass,
  Rotate3d,
  Sparkles,
  User,
  LogOut,
  Sliders,
  LogIn,
  UserPlus,
  MessageCircle
} from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { AccountCenterModal } from '../settings/AccountCenterModal';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenLocation?: () => void;
  onOpenAssistant?: () => void;
  onOpenReels?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSearch, 
  onOpenAdmin, 
  onOpenLocation, 
  onOpenAssistant,
  onOpenReels 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { ringBell } = useAudio();
  const { userLocation } = useChhathData();
  const { 
    currentUser, 
    isAuthenticated, 
    logout, 
    openAuthModal, 
    openOnboarding,
    openAccountCenter,
    accountCenterModalOpen,
    closeAccountCenter,
    accountCenterTab 
  } = useAuth();
  const { openConnect, unreadCount } = useChat();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const langNames: Record<Language, string> = {
    hi: 'हिंदी',
    bho: 'भोजपुरी',
    mai: 'मैथिली',
    mag: 'मगही',
    en: 'English'
  };

  const navLinks = [
    { label: "मेरा छठ", href: "#my-chhath", highlight: true },
    { label: "3D घाट", href: "#interactive-3d-ghat" },
    { label: t.navTimeline, href: "#timeline" },
    { label: t.navArghya, href: "#arghya-times" },
    { label: t.navSongs, href: "#songs", icon: Music2 },
    { label: t.navVidhi, href: "#vidhi" },
    { label: t.navSamagri, href: "#samagri", icon: CheckSquare },
    { label: t.navPrasad, href: "#prasad" },
    { label: t.navGhats, href: "#ghats", icon: MapPin },
    { label: t.navWishes, href: "#wishes" }
  ];

  return (
    <header className="sticky top-0 z-50 chhath-glass border-b border-amber-400/30 transition-all duration-300 shadow-xl backdrop-blur-2xl">
      <div className="container-custom flex items-center justify-between h-16 sm:h-20 max-w-full">
        
        {/* Brand Logo with Royal Imperial Ring */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 text-decoration-none group shrink-0 min-w-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-xl shadow-amber-500/40 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center overflow-hidden border border-yellow-300/40">
              <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-pulse">🌅</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 rounded-full p-0.5 sm:p-1 shadow-md border border-yellow-200/80">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-950 fill-amber-300 animate-diya-flicker" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-rozha text-xl sm:text-2xl md:text-3xl font-black tracking-wide gold-foil-text leading-tight drop-shadow-sm truncate">
              {t.siteTitle}
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] font-mukta font-bold uppercase tracking-[0.2em] text-amber-400/90 truncate">
              THE ROYAL VEDIC HERITAGE ARCHIVE
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.slice(0, 7).map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-mukta font-bold transition-all duration-200 text-decoration-none flex items-center gap-1.5 ${
                item.highlight
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20 hover:scale-105'
                  : 'text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Temple Bell Sound Trigger */}
          <button
            onClick={ringBell}
            title="पवित्र मंदिर घंटी बजाएं (Ring Sacred Temple Bell)"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-300 hover:bg-amber-500/35 transition-all border border-amber-400/50 hover:scale-105 active:scale-95 group shadow-md"
          >
            <BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 group-hover:animate-bell-sway" />
          </button>

          {/* Location Switcher Pill - Desktop only */}
          {onOpenLocation && (
            <button
              onClick={onOpenLocation}
              title="छठ क्षेत्र बदलें (Change Location)"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{userLocation.city}</span>
            </button>
          )}

          {/* Chhath Reels Platform Master Trigger - Desktop only (mobile has it in bottom nav) */}
          {onOpenReels && (
            <button
              onClick={onOpenReels}
              title="छठ रील्स — लघु वीडियो मंच (Chhath Reels)"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all border border-yellow-300/60"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="font-extrabold tracking-wide">
                🔥 रील्स
              </span>
            </button>
          )}

          {/* Chhath Connect - Desktop only (mobile has it in bottom nav) */}
          <button
            onClick={() => openConnect()}
            title="छठ कनेक्ट — सामाजिक संवाद (Chhath Connect)"
            className="hidden md:flex relative items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 shadow-md hover:scale-105 active:scale-95 transition-all border border-amber-300/80"
          >
            <MessageCircle className="w-4 h-4 text-stone-950 fill-stone-950/20" />
            <span className="font-extrabold tracking-wide">
              छठ कनेक्ट
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-black text-[10px] animate-pulse shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* AI Assistant Quick Trigger - Large screens */}
          {onOpenAssistant && (
            <button
              onClick={onOpenAssistant}
              title="छठी सहायक AI (Ask Cultural Assistant)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>छठी सहायक</span>
            </button>
          )}

          {/* Global Search Button - Hidden on mobile (mobile has it in bottom nav) */}
          <button
            onClick={onOpenSearch}
            title="खोजें (Search Chhath content)"
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center bg-stone-900/80 text-stone-200 hover:bg-amber-500/20 hover:text-amber-300 border border-amber-500/30 transition-colors shadow-sm"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">{langNames[language]}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-amber-500/30 py-2 z-50">
                {(Object.keys(langNames) as Language[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-mukta font-medium flex items-center justify-between hover:bg-amber-500/10 transition-colors ${
                      language === code ? 'text-orange-600 dark:text-amber-400 font-bold bg-amber-500/10' : 'text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    <span>{langNames[code]}</span>
                    {language === code && <span className="text-xs text-orange-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'रात्रि आरती मोड (Dark Mode)' : 'सूर्योदय मोड (Light Mode)'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-amber-500 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-700" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
          </button>

          {/* Admin CMS Access Button */}
          <button
            onClick={onOpenAdmin}
            title="व्यवस्थापक पटल (Admin CMS)"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800 text-stone-100 dark:bg-stone-700 hover:bg-orange-600 transition-colors border border-stone-600"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          {/* User Account / Auth Trigger - Desktop (Mobile has profile in bottom nav) */}
          {isAuthenticated && currentUser ? (
            <div className="hidden sm:block relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-stone-900/90 border border-amber-500/40 hover:border-amber-400 transition-all shadow-md group"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-stone-100 group-hover:text-amber-300 font-mukta leading-none truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-mono leading-none mt-0.5">
                    {currentUser.username}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/60 bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-xs text-stone-950">
                  {currentUser.avatarUrl.length <= 4 ? (
                    <span>{currentUser.avatarUrl}</span>
                  ) : (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-500/40 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-white/10 text-xs">
                    <div className="font-bold text-stone-100 font-mukta">{currentUser.name}</div>
                    <div className="text-[10px] text-amber-400/80 font-mono">{currentUser.username}</div>
                    {currentUser.city && (
                      <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1 font-mukta">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{currentUser.city}, {currentUser.state}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openAccountCenter('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-amber-300 hover:text-amber-200 hover:bg-amber-500/15 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>अकाउंट सेंटर (सुरक्षा व डेटा)</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openOnboarding();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-stone-200 hover:text-white hover:bg-amber-500/15 flex items-center gap-2 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>रुचियां व प्राथमिकताएं बदलें</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-red-400 hover:text-red-300 hover:bg-red-950/40 flex items-center gap-2 border-t border-white/10 mt-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>लॉग आउट करें</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-full text-xs font-bold font-mukta text-stone-200 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉग इन</span>
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold font-mukta bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-stone-950 shadow-md transition-all flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>खाता बनाएं</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-800 dark:text-stone-100 hover:bg-amber-500/20 transition-colors shrink-0"
            title="मेनू खोलें (Open Menu)"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-b border-amber-500/20 px-6 py-5 shadow-2xl animate-in slide-in-from-top duration-300">
          
          {/* Mobile User Auth Card */}
          <div className="mb-4 pb-3 border-b border-amber-500/20">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-sm text-stone-950">
                    {currentUser.avatarUrl.length <= 4 ? (
                      <span>{currentUser.avatarUrl}</span>
                    ) : (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900 dark:text-stone-100 font-mukta leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                      {currentUser.username}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openOnboarding();
                    }}
                    className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    title="रुचियां बदलें"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="p-2 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400"
                    title="लॉग आउट"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold font-mukta text-stone-800 dark:text-stone-200 bg-amber-500/15 border border-amber-500/30 text-center"
                >
                  लॉग इन
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold font-mukta bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-center shadow-md"
                >
                  खाता बनाएं
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {onOpenReels && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReels();
                }}
                className="col-span-2 p-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>🔥 छठ रील्स — शॉर्ट वीडियो मंच</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openConnect();
              }}
              className="col-span-2 p-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 relative"
            >
              <MessageCircle className="w-4 h-4" />
              <span>💬 छठ कनेक्ट — सामाजिक संवाद</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                  {unreadCount}
                </span>
              )}
            </button>
            {navLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/15 text-stone-800 dark:text-stone-100 font-mukta font-medium text-sm flex items-center gap-2 text-decoration-none"
              >
                {item.icon && <item.icon className="w-4 h-4 text-orange-600" />}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-amber-400"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>प्रबंधक पटल (Admin Portal)</span>
            </button>
            <span className="text-xs text-stone-500">छठ महापर्व 2026</span>
          </div>
        </div>
      )}

      {/* Account Center Centralized Modal */}
      <AccountCenterModal
        isOpen={accountCenterModalOpen}
        onClose={closeAccountCenter}
        initialTab={accountCenterTab}
      />
    </header>
  );
};
