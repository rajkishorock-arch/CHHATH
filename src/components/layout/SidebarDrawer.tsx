import React, { useState } from 'react';
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

  const handleShareApp = async () => {
    const shareData = {
      title: 'छठ महापर्व २०२६ — संपूर्ण डिजिटल गाइड व संगीत',
      text: 'छठ महापर्व २०२६ की संपूर्ण पूजा विधि, सूर्य अर्घ्य मुहूर्त, छठ गीत, रील्स व 3D घाट दर्शन:',
      url: window.location.origin + window.location.pathname
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('ऐप लिंक कॉपी हो गया!');
    }
  };

  // Structured Categorized Feature Navigation
  const featureCategories = [
    {
      title: 'पवित्र अनुष्ठान व नियम',
      subtitle: 'Core Rituals & Vidhi',
      items: [
        { id: 'guide', label: '४ दिवसीय टाइमलाइन', sub: 'नहाय-खाय से पारण', icon: Calendar, badge: 'पंचांग' },
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
        { id: 'music', label: 'छठ भक्ति गीत स्टूडियो', sub: 'यूट्यूब रियल-टाइम सिंक', icon: Music, badge: 'यूट्यूब', highlight: true },
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
        { id: 'explore', label: 'एक्सप्लोर हब (सभी फीचर्स)', sub: '3D घाट, क्विज, डायरी', icon: Sparkles },
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
          label: 'खाता व प्रोफ़ाइल केंद्र', 
          sub: 'लॉग इन व व्यक्तिगत विवरण', 
          icon: User,
          action: () => {
            onClose();
            openAccountCenter('profile');
          }
        }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-300 font-mukta">
      
      {/* Backdrop Blur Overlay */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Drawer Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-sm bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-amber-500/25 h-full flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-300">
        
        {/* Drawer Top Header: Profile Snapshot & Close */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-stone-800 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-200 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center font-bold text-lg text-amber-300 border border-amber-300/40">
                {isAuthenticated && currentUser?.name ? currentUser.name.charAt(0) : '🌅'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-950 flex items-center justify-center" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-rozha text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 truncate">
                  {isAuthenticated ? currentUser?.name : 'छठ व्रती / श्रद्धालु'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {isAuthenticated ? (currentUser?.email || `@${currentUser?.username}`) : 'छठ महापर्व २०२६ में आपका स्वागत है'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800 transition-colors shrink-0"
            title="मेनू बंद करें"
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
            title={theme === 'light' ? 'डार्क मोड' : 'लाइट मोड'}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>डार्क</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>लाइट</span>
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
            title="मंदिर घंटी बजाएं"
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
              placeholder="फीचर या विधि खोजें..."
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
                  <span>एडमिन कंट्रोल पैनल</span>
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
              छठ महापर्व २०२६
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              आस्था, पवित्रता व सूर्य उपासना
            </span>
          </div>

          <button
            onClick={handleShareApp}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>शेयर</span>
          </button>
        </div>

      </div>
    </div>
  );
};
