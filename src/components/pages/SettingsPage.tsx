import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Languages, 
  BellRing, 
  Trash2, 
  Check, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  User, 
  LogIn, 
  LogOut, 
  Share2, 
  Music, 
  Lock, 
  ChevronRight, 
  Search,
  Sunrise,
  Sunset,
  Volume2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

interface SettingsPageProps {
  onNavigate: (tab: string) => void;
  onOpenMixer?: () => void;
  onOpenAssistant?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  onOpenMixer,
  onOpenAssistant
}) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { ringBell } = useAudio();
  const { currentUser, isAuthenticated, logout, openAuthModal, resetPassword } = useAuth();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  // Local settings with real persistence
  const [sandhyaAlarm, setSandhyaAlarm] = useState<boolean>(() => {
    return localStorage.getItem('chhath_alert_sandhya') === 'true';
  });
  const [pratahAlarm, setPratahAlarm] = useState<boolean>(() => {
    return localStorage.getItem('chhath_alert_pratah') !== 'false';
  });
  const [autoplaySongs, setAutoplaySongs] = useState<boolean>(() => {
    return localStorage.getItem('chhath_autoplay_next') !== 'false';
  });
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(() => {
    return Boolean(currentUser?.isPrivate);
  });

  // Action status toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSandhya = () => {
    const nextVal = !sandhyaAlarm;
    setSandhyaAlarm(nextVal);
    localStorage.setItem('chhath_alert_sandhya', String(nextVal));
    showToast(nextVal ? 'संध्या अर्घ्य अलार्म सक्रिय!' : 'संध्या अर्घ्य अलार्म बंद');
  };

  const togglePratah = () => {
    const nextVal = !pratahAlarm;
    setPratahAlarm(nextVal);
    localStorage.setItem('chhath_alert_pratah', String(nextVal));
    showToast(nextVal ? 'उषा अर्घ्य ब्रह्म मुहूर्त अलार्म सक्रिय!' : 'उषा अर्घ्य अलार्म बंद');
  };

  const toggleAutoplay = () => {
    const nextVal = !autoplaySongs;
    setAutoplaySongs(nextVal);
    localStorage.setItem('chhath_autoplay_next', String(nextVal));
    showToast(nextVal ? 'छठ गीतों का स्वतः प्लेबैक चालू!' : 'स्वतः प्लेबैक बंद');
  };

  const handleTestBell = () => {
    ringBell();
    showToast('मंदिर घंटी ध्वनि बज रही है... 🔔');
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('chhath_recent_searches');
      localStorage.removeItem('chhath_search_history');
      showToast('सर्च कैशे सफलतापूर्वक साफ़ कर दिया गया!');
    } catch {
      showToast('कैशे साफ़ करने में त्रुटि आई');
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) {
      showToast('कृपया पहले लॉगिन करें');
      return;
    }
    const res = await resetPassword(currentUser.email);
    if (res.success) {
      showToast('पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया!');
    } else {
      showToast(res.error || 'रीसेट लिंक भेजने में त्रुटि हुई');
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'छठ महापर्व 2026 — ChhathVibes',
      text: 'छठ महापर्व 2026 की संपूर्ण पूजा विधि, सूर्य अर्घ्य मुहूर्त और पारंपरिक छठ गीत:',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      showToast('ऐप लिंक क्लिपबोर्ड में कॉपी हो गया!');
    }
  };

  const langNames: Record<Language, string> = {
    hi: 'हिंदी (Hindi)',
    bho: 'भोजपुरी (Bhojpuri)',
    mai: 'मैथिली (Maithili)',
    mag: 'मगही (Magahi)',
    en: 'English'
  };

  const userInitial = currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : '👤';

  // Search filter
  const matches = (term: string) => {
    if (!searchQuery.trim()) return true;
    return term.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-24 pt-2 sm:pt-6 font-mukta transition-colors">
      <div className="max-w-2xl mx-auto px-1.5 sm:px-4">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-stone-950 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header Bar (Instagram Style) */}
        <div className="flex items-center gap-3 py-2 mb-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 -ml-1 text-stone-700 dark:text-stone-300 hover:text-amber-600 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="वापस जाएं"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold font-sans tracking-tight">
            सेटिंग्स व गोपनीयता
          </h1>
        </div>

        {/* 2. Compact Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="सेटिंग्स खोजें (थीम, भाषा, अलार्म, संगीत)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-100 dark:bg-stone-900 border border-transparent focus:border-amber-400 focus:bg-white dark:focus:bg-stone-950 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. Instagram "Accounts Center" Tile */}
        {matches('खाता प्रोफाइल ईमेल') && (
          <div 
            onClick={() => currentUser ? onNavigate('my-chhath') : openAuthModal('login')}
            className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs mb-5 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400/60 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-orange-500 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-amber-50 dark:bg-stone-800 flex items-center justify-center border-2 border-white dark:border-stone-900">
                  {currentUser?.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-lg font-bold text-amber-950 dark:text-amber-200 font-sans">
                      {userInitial}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold truncate">
                    {currentUser?.name || 'छठ श्रद्धालु (अतिथि)'}
                  </h3>
                  {currentUser && (
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 truncate">
                  {currentUser?.email || (currentUser ? currentUser.username : 'लॉग इन करने के लिए यहां टैप करें')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-bold shrink-0">
              <span>{currentUser ? 'मेरी प्रोफ़ाइल' : 'लॉग इन'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* 4. Settings Group: प्राथमिकताएं (Preferences) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 mb-2">
              ऐप प्राथमिकताएं व अनुभव
            </h2>

            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/80 shadow-xs">
              
              {/* Theme (Dark / Light) */}
              {matches('थीम डार्क मोड लाइट मोड theme') && (
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        डार्क मोड (Dark Mode)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {theme === 'dark' ? 'डार्क थीम सक्रिय' : 'लाइट थीम सक्रिय'}
                      </div>
                    </div>
                  </div>

                  {/* iOS Style Toggle Switch */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      theme === 'dark' ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                    aria-label="थीम टॉगल करें"
                  >
                    <div 
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                        theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              )}

              {/* Language Selector */}
              {matches('भाषा language हिंदी भोजपुरी मैथिली') && (
                <div 
                  onClick={() => setLangModalOpen(true)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        भाषा (App Language)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {langNames[language]}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
                    <span>{langNames[language].split(' ')[0]}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              )}

              {/* Autoplay Chhath Songs */}
              {matches('संगीत गीत प्लेबैक autoplay music') && (
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        छठ गीत स्वतः प्लेबैक (Autoplay)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        गीत समाप्त होने पर अगला पावन गीत स्वतः शुरू करें
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAutoplay}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      autoplaySongs ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <div 
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                        autoplaySongs ? 'translate-x-5.5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              )}

              {/* Temple Bell Sound */}
              {matches('घंटी मंदिर ध्वनि bell sound') && (
                <div 
                  onClick={handleTestBell}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 flex items-center justify-center shrink-0">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        मंदिर घंटी ध्वनि (Temple Bell)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        पवित्र ध्वनि बजाने के लिए टैप करें
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold">
                    बजाएं 🔔
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5. Settings Group: अर्घ्य अलार्म व सूचनाएं (Arghya Notifications) */}
          <div>
            <h2 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 mb-2">
              सूर्य अर्घ्य व मुहूर्त सूचनाएं
            </h2>

            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/80 shadow-xs">
              {/* Sandhya Arghya Alert */}
              {matches('संध्या अर्घ्य अलार्म sunset alert') && (
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Sunset className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        संध्या अर्घ्य मुहूर्त अलार्म
                      </div>
                      <div className="text-[11px] text-stone-500">
                        अस्ताचलगामी सूर्य अर्घ्य से 30 मिनट पूर्व सूचना
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleSandhya}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      sandhyaAlarm ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <div 
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                        sandhyaAlarm ? 'translate-x-5.5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              )}

              {/* Usha Arghya Alert */}
              {matches('उषा अर्घ्य ब्रह्म मुहूर्त sunrise alert') && (
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Sunrise className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        उषा अर्घ्य ब्रह्म मुहूर्त अलार्म
                      </div>
                      <div className="text-[11px] text-stone-500">
                        उदयगामी सूर्य अर्घ्य हेतु प्रातः 4:30 बजे पावन स्मरण
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={togglePratah}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      pratahAlarm ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <div 
                      className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                        pratahAlarm ? 'translate-x-5.5' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 6. Settings Group: गोपनीयता व सुरक्षा (Privacy & Security) */}
          <div>
            <h2 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 mb-2">
              गोपनीयता व सुरक्षा
            </h2>

            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/80 shadow-xs">
              {/* Reset Password */}
              {currentUser?.email && matches('पासवर्ड पासवर्ड रीसेट security password') && (
                <div 
                  onClick={handleResetPassword}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        पासवर्ड रीसेट लिंक भेजें
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {currentUser.email} पर सुरक्षित रीसेट लिंक जाएगा
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              )}

              {/* Clear Cache */}
              {matches('कैशे साफ़ डेटा clear cache') && (
                <div 
                  onClick={handleClearCache}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        सर्च व रील्स कैशे साफ़ करें
                      </div>
                      <div className="text-[11px] text-stone-500">
                        स्थानीय अस्थायी डेटा साफ़ करें
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    साफ़ करें
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 7. Settings Group: अधिक जानकारी व सहायता (Help & About) */}
          <div>
            <h2 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 mb-2">
              सहायता व जानकारी
            </h2>

            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/80 shadow-xs">
              {/* Share App */}
              {matches('शेयर share app') && (
                <div 
                  onClick={handleShareApp}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        छठ महापर्व ऐप शेयर करें
                      </div>
                      <div className="text-[11px] text-stone-500">
                        परिजनों व मित्रों के साथ लिंक साझा करें
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              )}

              {/* About App */}
              {matches('के बारे में about info version') && (
                <div 
                  onClick={() => setAboutModalOpen(true)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">
                        छठ महापर्व 2026 के बारे में
                      </div>
                      <div className="text-[11px] text-stone-500">
                        संस्करण 3.4.0 (2026)
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              )}
            </div>
          </div>

          {/* 8. Log Out / Login Section */}
          <div className="pt-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(true)}
                className="w-full p-4 rounded-3xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉग आउट ({currentUser.name})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="w-full p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>लॉग इन या नया खाता बनाएं</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Language Selector Modal */}
      {langModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLangModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold">भाषा चुनें (Select Language)</h3>
              <button onClick={() => setLangModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {(Object.keys(langNames) as Language[]).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code);
                    setLangModalOpen(false);
                    showToast(`भाषा बदलकर ${langNames[code]} कर दी गई!`);
                  }}
                  className={`w-full p-3 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                    language === code 
                      ? 'bg-amber-500 text-stone-950' 
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <span>{langNames[code]}</span>
                  {language === code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setAboutModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Sun className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
              छठ महापर्व 2026 • ChhathVibes
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-2">
              संस्करण 3.4.0 (2026 Production)
            </p>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              सूर्य उपासना एवं छठी मईया के पावन महापर्व का संपूर्ण डिजिटल अनुभव। पूजा विधि, मुहूर्त, पारंपरिक गीत, रील्स एवं 3D घाट दर्शन।
            </p>
            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
            >
              ठीक है (Close)
            </button>
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {confirmLogoutOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setConfirmLogoutOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
              लॉग आउट करना चाहते हैं?
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              आप कभी भी पुनः अपने ईमेल और पासवर्ड से लॉगिन कर सकते हैं।
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirmLogoutOpen(false)}
                className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  setConfirmLogoutOpen(false);
                  logout();
                  showToast('सफलतापूर्वक लॉग आउट हो गए');
                }}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                लॉग आउट
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
