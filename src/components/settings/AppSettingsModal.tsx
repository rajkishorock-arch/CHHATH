import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Moon, 
  Sun, 
  Languages, 
  Eye, 
  BellRing, 
  User, 
  LogIn, 
  LogOut, 
  Trash2, 
  Check, 
  Sparkles,
  Info,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme, easyMode, toggleEasyMode } = useTheme();
  const { ringBell } = useAudio();
  const { currentUser, isAuthenticated, logout, openAuthModal } = useAuth();

  const [clearSuccess, setClearSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const langOptions: { code: Language; label: string; sub: string }[] = [
    { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
    { code: 'bho', label: 'भोजपुरी', sub: 'Bhojpuri' },
    { code: 'mai', label: 'मैथिली', sub: 'Maithili' },
    { code: 'mag', label: 'मगही', sub: 'Magahi' },
    { code: 'en', label: 'English', sub: 'English' }
  ];

  const handleClearCache = () => {
    try {
      localStorage.removeItem('chhath_recent_searches');
      localStorage.removeItem('chhath_search_history');
      setClearSuccess('सर्च व डेटा कैशे सफलतापूर्वक साफ़ कर दिया गया!');
      setTimeout(() => setClearSuccess(null), 3000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200 font-mukta">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-100 leading-none">
                सेटिंग्स व प्राथमिकताएं
              </h3>
              <p className="text-[11px] text-stone-400 mt-1">
                ऐप का अनुभव अपनी पसंद अनुसार कस्टमाइज़ करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm">
          
          {/* Section 1: Appearance / Theme */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>थीम व दृश्य (Appearance)</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  theme === 'dark'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Moon className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs font-bold">डार्क मोड (Dark)</div>
                  <div className="text-[10px] text-stone-400">रात व आंखों के लिए उत्तम</div>
                </div>
              </button>

              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  theme === 'light'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs font-bold">लाइट मोड (Light)</div>
                  <div className="text-[10px] text-stone-400">उजला व स्पष्ट दृश्य</div>
                </div>
              </button>
            </div>

            {/* Senior / Easy Mode Toggle */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-200">सरल दृश्य (Elder / Easy Mode)</div>
                  <div className="text-[10px] text-stone-400">बड़े अक्षर, उच्च कंट्रास्ट व सुगम नेविगेशन</div>
                </div>
              </div>
              <button
                onClick={toggleEasyMode}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  easyMode ? 'bg-amber-500' : 'bg-stone-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  easyMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Section 2: Language Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              <span>भाषा प्राथमिकता (Language)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {langOptions.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-stone-400">{opt.sub}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Audio & Spiritual FX */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>ध्वनि व धार्मिक अनुभव (Audio & FX)</span>
            </label>
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-200">मंदिर की पावन घंटी (Temple Bell)</div>
                  <div className="text-[10px] text-stone-400">घंटी बजाकर मन को शांति व भक्ति दें</div>
                </div>
              </div>
              <button
                onClick={ringBell}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow active:scale-95 transition-transform"
              >
                बजाएं 🔔
              </button>
            </div>
          </div>

          {/* Section 4: Account & Authentication */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>खाता व प्रोफाइल (Account)</span>
            </label>
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3">
              {isAuthenticated && currentUser ? (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 font-bold flex items-center justify-center shrink-0">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-200 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-stone-400 truncate">{currentUser.email || 'प्रमाणित व्रती'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>लॉगआउट</span>
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-xs font-bold text-stone-200">अतिथि सदस्य (Guest User)</div>
                    <div className="text-[10px] text-stone-400">पसंदीदा गीत व रील्स सहेजने के लिए लॉगिन करें</div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      openAuthModal();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow"
                  >
                    लॉगिन करें
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Section 5: Data & Privacy */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              <span>डेटा व गोपनीयता (Storage & Privacy)</span>
            </label>
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-stone-200">खोज इतिहास व कैशे साफ़ करें</div>
                <div className="text-[10px] text-stone-400">स्थानीय सर्च व कैशे डेटा हटाएं</div>
              </div>
              <button
                onClick={handleClearCache}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold"
              >
                साफ़ करें
              </button>
            </div>
            {clearSuccess && (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center border border-emerald-500/40">
                {clearSuccess}
              </div>
            )}
          </div>

          {/* Section 6: About */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
            <div className="text-xs font-bold text-amber-300">
              छठ महापर्व 2026 डिजिटल सेवा (v2.4.0)
            </div>
            <p className="text-[11px] text-stone-400">
              संपूर्ण देश व विदेश में निवासरत पूर्वांचल व मिथिला समाज को समर्पित। जय छठी मईया! 🌅
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
