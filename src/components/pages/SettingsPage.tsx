import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Moon, 
  Sun, 
  Languages, 
  BellRing, 
  Volume2, 
  Sliders, 
  Trash2, 
  Check, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  User, 
  LogIn, 
  LogOut, 
  Share2, 
  MessageSquare, 
  Music, 
  Radio, 
  Clock, 
  Eye, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Flame,
  Search
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';

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
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { ringBell } = useAudio();
  const { currentUser, isAuthenticated, logout, openAuthModal, openAccountCenter } = useAuth();

  // Search filter inside settings
  const [searchFilter, setSearchFilter] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | 'theme' | 'audio' | 'alerts' | 'lang' | 'storage' | 'about'>('all');

  // Custom Local Settings State
  const [sandhyaAlarm, setSandhyaAlarm] = useState<boolean>(() => {
    return localStorage.getItem('chhath_alert_sandhya') === 'true';
  });
  const [pratahAlarm, setPratahAlarm] = useState<boolean>(() => {
    return localStorage.getItem('chhath_alert_pratah') !== 'false'; // default true
  });
  const [dailyPanchangAlert, setDailyPanchangAlert] = useState<boolean>(() => {
    return localStorage.getItem('chhath_alert_panchang') !== 'false';
  });
  const [autoplayNext, setAutoplayNext] = useState<boolean>(() => {
    return localStorage.getItem('chhath_autoplay_next') !== 'false';
  });
  const [audioQuality, setAudioQuality] = useState<'high' | 'saver'>(() => {
    return (localStorage.getItem('chhath_audio_quality') as any) || 'high';
  });
  const [festiveGlow, setFestiveGlow] = useState<boolean>(() => {
    return localStorage.getItem('chhath_festive_glow') !== 'false';
  });

  // Action status toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSandhyaAlarm = () => {
    const newVal = !sandhyaAlarm;
    setSandhyaAlarm(newVal);
    localStorage.setItem('chhath_alert_sandhya', String(newVal));
    showToast(newVal ? 'संध्या अर्घ्य अलार्म सक्रिय कर दिया गया!' : 'संध्या अर्घ्य अलार्म बंद किया गया');
  };

  const togglePratahAlarm = () => {
    const newVal = !pratahAlarm;
    setPratahAlarm(newVal);
    localStorage.setItem('chhath_alert_pratah', String(newVal));
    showToast(newVal ? 'उषा अर्घ्य ब्रह्म मुहूर्त अलार्म सक्रिय!' : 'उषा अर्घ्य अलार्म बंद किया गया');
  };

  const toggleDailyPanchang = () => {
    const newVal = !dailyPanchangAlert;
    setDailyPanchangAlert(newVal);
    localStorage.setItem('chhath_alert_panchang', String(newVal));
    showToast(newVal ? 'दैनिक पंचांग नोटिफिकेशन सक्रिय!' : 'पंचांग नोटिफिकेशन बंद किया गया');
  };

  const toggleAutoplay = () => {
    const newVal = !autoplayNext;
    setAutoplayNext(newVal);
    localStorage.setItem('chhath_autoplay_next', String(newVal));
    showToast(newVal ? 'गीतों का स्वतः प्लेबैक (Autoplay) चालू!' : 'स्वतः प्लेबैक बंद किया गया');
  };

  const changeAudioQuality = (q: 'high' | 'saver') => {
    setAudioQuality(q);
    localStorage.setItem('chhath_audio_quality', q);
    showToast(q === 'high' ? 'उच्च ऑडियो गुणवत्ता चुनी गई' : 'डेटा सेवर ऑडियो मोड चुना गया');
  };

  const toggleGlow = () => {
    const newVal = !festiveGlow;
    setFestiveGlow(newVal);
    localStorage.setItem('chhath_festive_glow', String(newVal));
    showToast(newVal ? 'गोल्डेन फेस्टिव ग्लो प्रभाव सक्रिय!' : 'फेस्टिव ग्लो प्रभाव बंद किया गया');
  };

  // Language options with cultural details
  const langOptions: { code: Language; label: string; script: string; sample: string }[] = [
    { code: 'hi', label: 'हिंदी', script: 'Hindi', sample: 'काँच ही बाँस के बहँगिया, बहँगी लचकत जाए...' },
    { code: 'bho', label: 'भोजपुरी', script: 'Bhojpuri', sample: 'केलवा जे फरेले घवद से, ओह पर सुगा मँडराए...' },
    { code: 'mai', label: 'मैथिली', script: 'Maithili', sample: 'उग हे सुरुज देव भेल अरघ के बेर, दर्शन दिअ...' },
    { code: 'mag', label: 'मगही', script: 'Magahi', sample: 'छठी मईया के बरतिया हम करबै नियम से...' },
    { code: 'en', label: 'English', script: 'English', sample: 'Sacred Chhath Mahaparv solar devotion & rituals' }
  ];

  const handleClearCache = () => {
    try {
      localStorage.removeItem('chhath_recent_searches');
      localStorage.removeItem('chhath_search_history');
      showToast('सर्च कैशे व रील्स इंडेक्स सफलतापूर्वक साफ़ कर दिया गया!');
    } catch {
      showToast('कैशे साफ़ करने में त्रुटि आई');
    }
  };

  const handleResetAll = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      showToast('सभी प्राथमिकताएं रीसेट कर दी गईं! ऐप रीलोड हो रहा है...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      showToast('रीसेट नहीं हो सका');
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'छठ महापर्व २०२६ — संपूर्ण डिजिटल गाइड व संगीत',
      text: 'छठ महापर्व २०२६ की संपूर्ण पूजा विधि, सूर्य अर्घ्य मुहूर्त, पारंपरिक छठ गीत, रील्स व 3D घाट दर्शन ऐप:',
      url: window.location.origin + window.location.pathname
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share dismissed
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      showToast('ऐप लिंक क्लिपबोर्ड में कॉपी हो गया!');
    }
  };

  const matchesSearch = (text: string) => {
    if (!searchFilter.trim()) return true;
    return text.toLowerCase().includes(searchFilter.toLowerCase().trim());
  };

  return (
    <div className="container-custom max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 font-mukta space-y-6">
      
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs 
        items={[{ label: 'सेटिंग्स व प्राथमिकताएं', url: '/CHHATH/#settings' }]} 
        onNavigate={() => onNavigate('home')} 
      />

      {/* Page Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-stone-900/10 dark:from-amber-950/40 dark:via-stone-900/80 dark:to-stone-950 border border-stone-200 dark:border-amber-500/30 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-amber-500/30 text-stone-700 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="मुख्य पृष्ठ पर वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  नियंत्रण केंद्र
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  v3.4.0 (2026)
                </span>
              </div>
              <h1 className="font-rozha text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-bold gold-foil-text mt-1">
                ऐप सेटिंग्स व कस्टमाइजेशन
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-xl">
                थीम, पारंपरिक छठ संगीत, सूर्य अर्घ्य अलार्म, भाषा एवं ऑफलाइन कैशे को अपनी इच्छानुसार व्यवस्थित करें।
              </p>
            </div>
          </div>

          <button
            onClick={handleShareApp}
            className="self-end sm:self-center px-4 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>ऐप शेयर करें</span>
          </button>
        </div>

        {/* Live Search Input inside Settings */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="सेटिंग्स खोजें (थीम, अलार्म, संगीत, भाषा, कैशे)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 focus:border-amber-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              साफ़ करें
            </button>
          )}
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-stone-900 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Category Pills Navigation (Quick Jump) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        {[
          { id: 'all', label: 'सभी सेटिंग्स' },
          { id: 'theme', label: 'थीम व दृश्य' },
          { id: 'audio', label: 'संगीत व ऑडियो' },
          { id: 'alerts', label: 'अर्घ्य अलार्म' },
          { id: 'lang', label: 'भाषा व लिपि' },
          { id: 'storage', label: 'डेटा व स्टोरेज' },
          { id: 'about', label: 'ऐप विवरण' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`snap-start shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              activeSection === tab.id
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md scale-[1.02]'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Comprehensive Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* =========================================================
            SECTION 1: THEME & APPEARANCE (WHITE & DARK THEMES)
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'theme') && matchesSearch('थीम दृश्य डार्क लाइट रूप-रंग appearance theme dark light') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  थीम व दृश्य शैली (Appearance)
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  पवित्र डार्क मोड अथवा स्वच्छ व्हाइट लाइट मोड चुनें
                </p>
              </div>
            </div>

            {/* Dark Mode vs White Light Mode Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                  showToast('पवित्र डार्क मोड सक्रिय!');
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2.5 text-center transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 border-amber-400 shadow-lg ring-2 ring-amber-400/30'
                    : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-amber-400/40'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-stone-950 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-stone-100 flex items-center justify-center gap-1">
                    <span>डार्क मोड (गहरा)</span>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    आंखों के लिए सौम्य व स्वर्ण आभा
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                  showToast('प्रीमियम व्हाइट लाइट मोड सक्रिय!');
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2.5 text-center transition-all ${
                  theme === 'light'
                    ? 'bg-gradient-to-b from-white via-amber-50/40 to-white border-amber-500 shadow-lg ring-2 ring-amber-500/30'
                    : 'bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400/40'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 border border-amber-300 flex items-center justify-center shadow-sm">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center justify-center gap-1">
                    <span>व्हाइट मोड (स्वच्छ)</span>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 block">
                    अल्ट्रा-क्लीन YouTube स्टाइल
                  </span>
                </div>
              </button>
            </div>

            {/* Festive Golden Halo Glow Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                    उत्सव गोल्डेन ग्लो व एनिमेशन
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    कार्ड्स और सूर्य आभामंडल पर सूक्ष्म स्वर्ण चमक
                  </span>
                </div>
              </div>
              <button
                onClick={toggleGlow}
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 border ${
                  festiveGlow ? 'bg-amber-500 border-amber-400' : 'bg-stone-300 dark:bg-stone-800 border-stone-400 dark:border-stone-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  festiveGlow ? 'translate-x-5.5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 2: AUDIO & MUSIC PLAYER CUSTOMIZATION
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'audio') && matchesSearch('संगीत ऑडियो प्लेयर यूट्यूब audio music sound player mixer') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  ऑडियो व संगीत प्राथमिकताएं
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  यूट्यूब सिंक, ऑटो-प्लेबैक व मंदिर ध्वनि प्रभाव
                </p>
              </div>
            </div>

            {/* Autoplay Next Track */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  अगला गीत स्वतः बजाएं (Autoplay)
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  गीत समाप्त होने पर कतार का अगला पावन भजन चालू हो
                </span>
              </div>
              <button
                onClick={toggleAutoplay}
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 border ${
                  autoplayNext ? 'bg-amber-500 border-amber-400' : 'bg-stone-300 dark:bg-stone-800 border-stone-400 dark:border-stone-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  autoplayNext ? 'translate-x-5.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Audio Quality Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                स्ट्रीमिंग ऑडियो गुणवत्ता:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => changeAudioQuality('high')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    audioQuality === 'high'
                      ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>उच्च गुणवत्ता (High-Fi)</span>
                    {audioQuality === 'high' && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    सर्वोत्तम पारंपरिक संगीत अनुभव
                  </span>
                </button>

                <button
                  onClick={() => changeAudioQuality('saver')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    audioQuality === 'saver'
                      ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300'
                      : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>डेटा सेवर (Data Saver)</span>
                    {audioQuality === 'saver' && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    कम नेटवर्क में भी तेज लोड
                  </span>
                </button>
              </div>
            </div>

            {/* Temple Bell Chime Test */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-bounce" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                    मंदिर घंटा व शंख ध्वनि
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    पवित्र घंटानाद की ध्वनि का परीक्षण करें
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  ringBell();
                  showToast('🔔 हर हर गंगे! पावन घंटानाद गूंज उठा');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
              >
                घंटी बजाएं
              </button>
            </div>

            {/* Direct launch to Atmosphere Audio Mixer */}
            {onOpenMixer && (
              <button
                onClick={onOpenMixer}
                className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                <span>वातावरण ऑडियो मिक्सर खोलें (गंगा, बांसुरी, दीया)</span>
              </button>
            )}
          </div>
        )}

        {/* =========================================================
            SECTION 3: ARGHYA TIMINGS & PUJA ALARMS
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'alerts') && matchesSearch('अर्घ्य अलार्म सूर्योदय सूर्यास्त समय अलर्ट alarm arghya timing notifications') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  अर्घ्य व पंचांग अलार्म अलर्ट
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  सूर्यास्त व ब्रह्म मुहूर्त से पूर्व स्वचालित सूचना
                </p>
              </div>
            </div>

            {/* Sandhya Arghya Alarm */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  संध्या अर्घ्य पूर्व-अलर्ट (15 नवंबर 2026)
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  संध्या सूर्यास्त से 30 मिनट पूर्व घाट प्रस्थान का स्मरण
                </span>
              </div>
              <button
                onClick={toggleSandhyaAlarm}
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 border ${
                  sandhyaAlarm ? 'bg-amber-500 border-amber-400' : 'bg-stone-300 dark:bg-stone-800 border-stone-400 dark:border-stone-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  sandhyaAlarm ? 'translate-x-5.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Pratah Arghya Alarm */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  उषा अर्घ्य ब्रह्म मुहूर्त अलार्म (16 नवंबर 2026)
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  प्रातः सूर्योदय से 45 मिनट पूर्व पावन अर्घ्य जगावट
                </span>
              </div>
              <button
                onClick={togglePratahAlarm}
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 border ${
                  pratahAlarm ? 'bg-amber-500 border-amber-400' : 'bg-stone-300 dark:bg-stone-800 border-stone-400 dark:border-stone-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  pratahAlarm ? 'translate-x-5.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Daily Chhath Tithi Alert */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  दैनिक पंचांग व तिथि संदेश
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  नहाय-खाय, खरना एवं पारण की दिनवार सूचना
                </span>
              </div>
              <button
                onClick={toggleDailyPanchang}
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 border ${
                  dailyPanchangAlert ? 'bg-amber-500 border-amber-400' : 'bg-stone-300 dark:bg-stone-800 border-stone-400 dark:border-stone-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  dailyPanchangAlert ? 'translate-x-5.5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 4: LANGUAGE & REGIONAL DIALECTS
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'lang') && matchesSearch('भाषा लिपि भोजपुरी मैथिली मगही हिंदी language hindi bhojpuri maithili magahi english') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  भाषा व सांस्कृतिक बोलियां (Language)
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  बिहार, झारखंड व पूर्वांचल की पारंपरिक बोलियों में संपूर्ण ऐप
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {langOptions.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      showToast(`${opt.label} भाषा चुनी गई!`);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-stone-50 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 hover:border-amber-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ({opt.script})
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 italic">
                      &ldquo;{opt.sample}&rdquo;
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 5: DATA, STORAGE & CACHE CLEANUP
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'storage') && matchesSearch('डेटा कैशे मेमोरी स्टोरेज रीसेट data cache storage reset memory') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  डेटा व स्टोरेज प्रबंधन (Data & Cache)
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  स्थानीय कैशे साफ़ करें व ताज़ा डेटा प्राप्त करें
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                    सर्च व रील्स स्थानीय कैशे
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    हाल की खोजें एवं सहेजे गए स्थानीय सुझाव
                  </span>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>कैशे साफ़ करें</span>
                </button>
              </div>
            </div>

            {/* Factory Reset App */}
            <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 block">
                    ऐप फ़ैक्टरी रीसेट (Reset Preferences)
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    सभी सेटिंग्स, चेकलिस्ट व प्राथमिकताएं प्रारंभिक स्थिति में लाएं
                  </span>
                </div>
                <button
                  onClick={() => setConfirmResetOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>रीसेट</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 6: ACCOUNT & COMMUNITY
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'about') && matchesSearch('खाता प्रोफ़ाइल प्रोफाइल account user profile login') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  खाता व प्रोफाइल (Account Center)
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  व्यक्तिगत पहचान, संकलित रील्स व पसंदीदा गीत
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-stone-950 flex items-center justify-center font-bold text-lg text-amber-600 dark:text-amber-300">
                    {isAuthenticated && currentUser?.name ? currentUser.name.charAt(0) : '🙏'}
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block truncate">
                    {isAuthenticated ? currentUser?.name : 'अतिथि श्रद्धालु (Guest)'}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 truncate block">
                    {isAuthenticated ? (currentUser?.email || `@${currentUser?.username}`) : 'लॉग इन कर अपनी छठ डायरी सहेजें'}
                  </span>
                </div>
              </div>

              <div>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      showToast('सफलतापूर्वक लॉग आउट किया गया');
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors"
                  >
                    लॉग आउट
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-sm"
                  >
                    लॉग इन
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 7: ABOUT CHHATH MAHAPARV 2026 APP
           ========================================================= */}
        {(activeSection === 'all' || activeSection === 'about') && matchesSearch('ऐप विवरण जानकारी संपर्क सहायता about feedback info version') && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  छठ महापर्व २०२६ ऐप के बारे में
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  सांस्कृतिक निष्ठा, तकनीकी समर्पण एवं आभार
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>
                यह ऐप लोक आस्था के महापर्व <strong>छठ पूजा २०२६</strong> के अवसर पर देश-विदेश में बसे समस्त बिहार, झारखंड व पूर्वांचल के व्रतियों और श्रद्धालुओं की सुविधा हेतु पूर्ण निष्ठा से निर्मित किया गया है।
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-400 block">संस्करण (Version):</span>
                  <strong className="text-amber-600 dark:text-amber-400">v3.4.0 (2026 महासंस्करण)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-400 block">समर्पण (Dedication):</span>
                  <strong className="text-stone-800 dark:text-stone-200">छठी मईया व भगवान भास्कर 🙏</strong>
                </div>
              </div>

              {onOpenAssistant && (
                <button
                  onClick={onOpenAssistant}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>छठी मईया एआई सहायक से कोई भी प्रश्न पूछें</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal for Reset All */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                क्या आप सचमुच रीसेट करना चाहते हैं?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                यह आपके स्थानीय सर्च इतिहास, प्राथमिकताओं एवं अलार्म्स को हटाकर ऐप को मूल स्थिति में ला देगा।
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  setConfirmResetOpen(false);
                  handleResetAll();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                हाँ, रीसेट करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
