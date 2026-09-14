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
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AccountCenterModal } from '../settings/AccountCenterModal';

interface NavbarProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab = 'home',
  onNavigate,
  onOpenSearch, 
  onOpenAdmin
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, easyMode, toggleEasyMode } = useTheme();
  const { ringBell } = useAudio();
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
    { id: 'home', label: 'आज', href: '#home' },
    { id: 'guide', label: 'पूजा गाइड', href: '#guide' },
    { id: 'arghya', label: 'अर्घ्य समय', href: '#arghya' },
    { id: 'ghats', label: 'घाट', href: '#ghats' },
    { id: 'prasad', label: 'प्रसाद', href: '#prasad' },
    { id: 'aarti', label: 'आरती व गीत', href: '#aarti' },
    { id: 'explore', label: 'एक्सप्लोर', href: '#explore' },
    { id: 'my-chhath', label: 'मेरी छठ', href: '#my-chhath', highlight: true }
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 chhath-glass border-b border-amber-500/20 transition-all duration-300 shadow-md backdrop-blur-xl bg-amber-50/80 dark:bg-stone-950/80">
      <div className="container-custom flex items-center justify-between h-16 sm:h-20 max-w-full">
        
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2.5 text-decoration-none group shrink-0 min-w-0"
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
            <span className="font-rozha text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100 leading-tight drop-shadow-sm truncate">
              {t.siteTitle}
            </span>
            <span className="hidden sm:block text-[10px] font-mukta font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 truncate">
              पावन आस्था एवं भक्ति डिजिटल सेवा
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="मुख्य नेविगेशन">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-mukta font-bold transition-all duration-200 text-decoration-none flex items-center gap-1 ${
                  item.highlight
                    ? 'bg-amber-500 text-stone-950 shadow-sm hover:bg-amber-400 font-extrabold'
                    : isActive
                    ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40'
                    : 'text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Easy Mode / Elder Accessibility Toggle */}
          <button
            onClick={toggleEasyMode}
            title={easyMode ? 'सामान्य दृश्य पर लौटें' : 'सरल दृश्य (बड़ा अक्षर व उच्च कंट्रास्ट)'}
            className={`px-2.5 py-1.5 rounded-full text-xs font-bold font-mukta transition-all flex items-center gap-1 border ${
              easyMode 
                ? 'bg-amber-500 text-stone-950 border-amber-600 font-black shadow-md' 
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">सरल दृश्य</span>
          </button>

          {/* Temple Bell Sound */}
          <button
            onClick={ringBell}
            title="मंदिर घंटी बजाएं"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 transition-all border border-amber-500/30 shadow-sm"
          >
            <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            title="खोजें"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 transition-all border border-amber-500/30 shadow-sm"
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
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-amber-500/30 py-2 z-50">
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
            title={theme === 'light' ? 'डार्क मोड' : 'लाइट मोड'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-stone-700 dark:text-stone-200 hover:text-amber-500 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-700" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
          </button>

          {/* User Account / Auth Trigger - Desktop */}
          {isAuthenticated && currentUser ? (
            <div className="hidden sm:block relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 transition-all group"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mukta leading-none truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-xs text-stone-950">
                  {currentUser.avatarUrl && currentUser.avatarUrl.length <= 4 ? (
                    <span>{currentUser.avatarUrl}</span>
                  ) : (
                    <img src={currentUser.avatarUrl || '👤'} alt={currentUser.name} className="w-full h-full object-cover" />
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
                    <span>मेरी छठ (व्यक्तिगत डैशबोर्ड)</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openAccountCenter('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-mukta text-stone-800 dark:text-stone-200 hover:bg-amber-500/15 flex items-center gap-2 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-500" />
                    <span>अकाउंट सेटिंग्स</span>
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
                      <span>एडमिन कंट्रोल पैनल</span>
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
                    <span>लॉग आउट करें</span>
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
                <span>लॉग इन</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-800 dark:text-stone-100 hover:bg-amber-500/20 transition-colors shrink-0"
            title="मेनू खोलें"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-b border-amber-500/20 px-6 py-5 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`p-2.5 rounded-xl text-stone-800 dark:text-stone-100 font-mukta font-bold text-sm flex items-center gap-2 text-decoration-none ${
                  activeTab === item.id ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-amber-500/5'
                }`}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center text-xs">
            <button
              onClick={toggleEasyMode}
              className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400"
            >
              <Eye className="w-4 h-4" />
              <span>{easyMode ? 'सामान्य दृश्य' : 'सरल दृश्य (Elder mode)'}</span>
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="font-bold text-orange-600 dark:text-amber-300"
              >
                लॉग इन करें
              </button>
            )}
          </div>
        </div>
      )}

      <AccountCenterModal
        isOpen={accountCenterModalOpen}
        onClose={closeAccountCenter}
        initialTab={accountCenterTab}
      />
    </header>
  );
};

