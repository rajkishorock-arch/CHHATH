import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Flame, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sun, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Music, 
  Compass, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { Language, ReelUser } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authModalTab, 
    closeAuthModal, 
    openAuthModal, 
    signup, 
    login, 
    resetPassword,
    authPromptMessage 
  } = useAuth();

  const { ringBell } = useAudio();

  const [mode, setMode] = useState<'login' | 'signup' | 'quick_devotee' | 'forgot'>(authModalTab);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Divine welcome celebration state
  const [blessingCelebration, setBlessingCelebration] = useState<{
    active: boolean;
    name: string;
    city: string;
    role?: string;
  } | null>(null);

  // Form states
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Quick 1-Tap Devotee Form
  const [quickName, setQuickName] = useState('');
  const [quickCity, setQuickCity] = useState('पटना (Patna)');
  const [quickRole, setQuickRole] = useState<'छठ व्रती' | 'सूर्य उपासक' | 'भजन प्रेमी'>('छठ व्रती');

  // Sign up Form
  const [signupName, setSignupName] = useState('');
  const [signupIdentifier, setSignupIdentifier] = useState(''); // Email or mobile
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCity, setSignupCity] = useState('पटना');

  // Forgot Password Form
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Popular sacred cities in Bihar / Purvanchal / Diaspora
  const popularCities = ['पटना', 'वाराणसी', 'दिल्ली-NCR', 'रांची', 'मुजफ्फरपुर', 'गया', 'कोलकाता', 'मुंबई'];

  useEffect(() => {
    setMode(authModalTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setBlessingCelebration(null);
  }, [authModalTab, authModalOpen]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  // Trigger divine blessing animation and close
  const triggerBlessingAndClose = (name: string, city: string, role: string = 'छठ व्रती') => {
    try {
      ringBell();
    } catch {}
    setBlessingCelebration({
      active: true,
      name,
      city,
      role
    });

    setTimeout(() => {
      setBlessingCelebration(null);
      closeAuthModal();
    }, 2200);
  };

  // 1-Tap Quick Devotee Entry (Zero Friction)
  const handleQuickDevoteeEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const displayName = quickName.trim() || 'पावन छठ व्रती';
    const cleanCity = quickCity.replace(/\s*\(.*\)/, '').trim() || 'पटना';
    const cleanUserSlug = displayName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) || 'devotee';
    const autoUsername = `@${cleanUserSlug}_${Math.floor(100 + Math.random() * 900)}`;

    const res = await signup({
      name: displayName,
      username: autoUsername,
      email: `${autoUsername.replace('@', '')}@chhath.in`,
      password: 'devotee_sacred_pass',
      city: cleanCity,
      bio: `जय छठी मईया! 🙏 ${quickRole} | सूर्य देव की असीम कृपा सदा बनी रहे।`
    });

    setLoading(false);
    if (res.success) {
      triggerBlessingAndClose(displayName, cleanCity, quickRole);
    } else {
      // In static fallback mode, auto login anyway
      await login(displayName, 'devotee_sacred_pass');
      triggerBlessingAndClose(displayName, cleanCity, quickRole);
    }
  };

  // Standard Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const identifier = loginEmailOrUser.trim();
    if (!identifier) {
      setErrorMsg('कृपया अपना ईमेल, मोबाइल या यूजरनेम दर्ज करें।');
      setLoading(false);
      return;
    }

    const res = await login(identifier, loginPassword || 'demo1234');
    setLoading(false);

    if (res.success) {
      const display = identifier.replace(/[@0-9]/g, '').trim() || 'श्रद्धालु';
      triggerBlessingAndClose(display, 'पटना', 'छठ भक्त');
    } else {
      setErrorMsg(res.error || 'लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
  };

  // Standard Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const name = signupName.trim();
    const ident = signupIdentifier.trim();
    if (!name) {
      setErrorMsg('कृपया अपना नाम दर्ज करें।');
      setLoading(false);
      return;
    }

    const cleanUser = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) || 'vrati';
    const isEmail = ident.includes('@');
    const email = isEmail ? ident : `${cleanUser}_${Date.now()}@chhath.in`;
    const username = `@${cleanUser}_${Math.floor(100 + Math.random() * 900)}`;

    const res = await signup({
      name,
      username,
      email,
      password: signupPassword || 'chhath2026',
      city: signupCity || 'पटना',
      bio: 'छठी मईया की जय! 🙏 सूर्य उपासना के पावन पर्व पर हार्दिक शुभकामनाएं।'
    });

    setLoading(false);
    if (res.success) {
      triggerBlessingAndClose(name, signupCity || 'पटना', 'छठ साधक');
    } else {
      setErrorMsg(res.error || 'पंजीकरण विफल। कृपया दोबारा प्रयास करें।');
    }
  };

  // Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await resetPassword(forgotEmail, newPassword || 'chhath2026');
    setLoading(false);
    if (res.success) {
      setSuccessMsg('पासवर्ड सुरक्षित कर दिया गया है! अब नए पासवर्ड से प्रवेश करें।');
      setTimeout(() => setMode('login'), 1800);
    } else {
      setErrorMsg(res.error || 'पासवर्ड रीसेट करने में समस्या आई।');
    }
  };

  // Curated Devotee Profile Quick Login
  const handleCuratedProfileSelect = async (username: string, displayName: string, city: string, role: string) => {
    setLoading(true);
    setErrorMsg(null);
    const res = await login(username, 'demo1234');
    setLoading(false);
    if (res.success) {
      triggerBlessingAndClose(displayName, city, role);
    } else {
      // Fallback
      await login(username, 'demo1234');
      triggerBlessingAndClose(displayName, city, role);
    }
  };

  const modalElement = (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-xl animate-in fade-in duration-300 font-mukta pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="छठ महापर्व श्रद्धालु प्रवेश"
    >
      {/* Clickable Backdrop Dismiss */}
      <div 
        className="fixed inset-0 cursor-pointer pointer-events-auto"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Main Devotional Modal Box */}
      <div className="relative w-full max-w-lg bg-stone-950/95 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/60 overflow-hidden text-stone-100 z-10 max-h-[92dvh] flex flex-col pointer-events-auto">
        
        {/* Divine Golden Rays & Glow Ambient Background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-yellow-500/20 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar: Diya, Sacred Title & Close Button */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-stone-950 flex items-start justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Radiant Sun Diya Emblem */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-lg shadow-amber-500/30 shrink-0">
              <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center border border-amber-300/40">
                <span className="text-2xl filter drop-shadow">🌅</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 rounded-full p-1 shadow">
                <Flame className="w-3.5 h-3.5 text-stone-950 fill-amber-200 animate-diya-flicker" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-rozha text-xl sm:text-2xl font-black text-amber-300 leading-tight truncate">
                  जय छठी मईया
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                  २०२६
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-mukta truncate mt-0.5">
                पावन आस्था, सूर्य उपासना एवं भक्त समुदाय
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-full bg-stone-900/90 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800 transition-all shrink-0 active:scale-95"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">

          {/* Sacred Blessing Celebration Overlay (When logged in) */}
          {blessingCelebration?.active ? (
            <div className="py-8 px-4 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-1 shadow-2xl shadow-amber-500/50 flex items-center justify-center animate-bounce">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center border border-amber-300">
                  <span className="text-4xl filter drop-shadow">☀️</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  पावन आशीर्वाद व मंगलकामनाएं
                </span>
                <h3 className="font-rozha text-2xl sm:text-3xl font-black gold-foil-text">
                  प्रणाम, {blessingCelebration.name}!
                </h3>
                <p className="text-sm text-stone-300 max-w-sm mx-auto leading-relaxed pt-1">
                  छठी मईया और भगवान सूर्य नारायण की असीम कृपा आप और आपके परिवार पर सदा बनी रहे। आयु, आरोग्य और सुख-समृद्धि का आशीर्वाद प्राप्त हो! 🙏
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{blessingCelebration.city}</span>
                <span>•</span>
                <span>{blessingCelebration.role}</span>
              </div>

              <p className="text-[11px] text-stone-500 animate-pulse">
                ऐप में आपका स्वागत हो रहा है...
              </p>
            </div>
          ) : (
            <>
              {/* Context Prompt Message if triggered from actions (e.g. reels, diary) */}
              {authPromptMessage && (
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5 shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold leading-relaxed">{authPromptMessage}</span>
                </div>
              )}

              {/* Mode Navigation Tabs (3 Dedicated Modes) */}
              {mode !== 'forgot' && (
                <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-900 border border-stone-800 gap-1 text-center">
                  <button
                    type="button"
                    onClick={() => { setMode('quick_devotee'); setErrorMsg(null); }}
                    className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
                      mode === 'quick_devotee'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>१-टैप प्रवेश</span>
                    <span className="text-[9px] opacity-80 font-normal">तुरंत दर्शन</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(null); }}
                    className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
                      mode === 'login'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>लॉग इन</span>
                    <span className="text-[9px] opacity-80 font-normal">खाता प्रवेश</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(null); }}
                    className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 ${
                      mode === 'signup'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>नया खाता</span>
                    <span className="text-[9px] opacity-80 font-normal">साइन अप</span>
                  </button>
                </div>
              )}

              {/* Error & Success Feedback Alerts */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. QUICK 1-TAP DEVOTEE ENTRY (ZERO IRRITATION & INSTANT DELIGHT) */}
              {mode === 'quick_devotee' && (
                <form onSubmit={handleQuickDevoteeEntry} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>बिना किसी पासवर्ड के तुरंत व्रती के रूप में प्रवेश करें:</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        आपका शुभ नाम (Your Name - Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={quickName}
                          onChange={(e) => setQuickName(e.target.value)}
                          placeholder="उदा. राहुल कुमार / सीमा देवी"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    {/* Quick Sacred Role Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1.5">
                        आपकी भूमिका चुनें:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['छठ व्रती', 'सूर्य उपासक', 'भजन प्रेमी'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setQuickRole(r)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                              quickRole === r
                                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs font-extrabold'
                                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick City Chips */}
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                        <span>आपका शहर / घाट:</span>
                        <span className="text-[10px] text-amber-400">{quickCity}</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {popularCities.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setQuickCity(c)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                              quickCity.includes(c)
                                ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                                : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-white'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <span>{loading ? 'प्रवेश हो रहा है...' : '🙏 पावन व्रती रूप में तुरंत प्रवेश करें'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Representative Sacred Devotee Profiles */}
                  <div className="pt-2 border-t border-stone-800/80 space-y-2">
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider text-center font-bold">
                      या किसी समर्पित पावन मंडल से जुड़ें (1-Tap Direct Login)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCuratedProfileSelect('@sharda_trust', 'शारदा सिन्हा संगीत मंडल', 'पटना', 'गीत मंडल')}
                        className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-amber-500/20 hover:border-amber-400/50 text-left transition-all group"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🌅</span>
                          <span className="text-xs font-bold text-amber-300 truncate">शारदा स्मृति मंडल</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">पारंपरिक गीत संग्रह</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCuratedProfileSelect('@pramodchhath', 'प्रमोद कुमार व्रती परिवार', 'मुजफ्फरपुर', 'छठ व्रती')}
                        className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-amber-500/20 hover:border-amber-400/50 text-left transition-all group"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🙏</span>
                          <span className="text-xs font-bold text-amber-300 truncate">व्रती परिवार</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">४ दिवसीय संपूर्ण अनुष्ठान</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCuratedProfileSelect('@bihari_vibes', 'बिहार संस्कृति व घाट दर्शन', 'वाराणसी', 'घाट दर्शन')}
                        className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-amber-500/20 hover:border-amber-400/50 text-left transition-all group"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🌊</span>
                          <span className="text-xs font-bold text-amber-300 truncate">गंगा घाट दर्शन</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">3D घाट व लाइव रील्स</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCuratedProfileSelect('@admin_chhath', 'व्यवस्थापक एडमिन', 'पटना', 'एडमिन')}
                        className="p-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/35 hover:border-amber-400/60 text-left transition-all group"
                      >
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold text-amber-300 truncate">एडमिन पैनल</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">पूर्ण नियंत्रण व सेटिंग्स</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* 2. REGULAR LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      ईमेल, मोबाइल नंबर या यूजरनेम
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginEmailOrUser}
                        onChange={(e) => setLoginEmailOrUser(e.target.value)}
                        placeholder="उदा. 9876543210 या devotee@chhath.in"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1 flex justify-between items-center">
                      <span>पासवर्ड / पिन (Password)</span>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-amber-400 hover:underline text-[11px]"
                      >
                        पासवर्ड भूल गए?
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="•••••••• (वैकल्पिक / सरल पासवर्ड)"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-3 text-stone-500 hover:text-stone-300"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-1 active:scale-95 disabled:opacity-50"
                  >
                    <span>{loading ? 'लॉगिन हो रहा है...' : 'लॉग इन करें'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Switch to Quick Devotee Entry */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setMode('quick_devotee')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>पासवर्ड याद नहीं? १-टैप व्रती प्रवेश का उपयोग करें</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 3. SIGNUP FORM */}
              {mode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      आपका पूरा नाम (Full Name) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="उदा. अमित कुमार"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      मोबाइल नंबर या ईमेल (Mobile or Email) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={signupIdentifier}
                        onChange={(e) => setSignupIdentifier(e.target.value)}
                        placeholder="उदा. 9876543210 या amit@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <Smartphone className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      सरल पासवर्ड / पिन (Password)
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="कम से कम 4 अक्षर (उदा. 1234)"
                        className="w-full pl-9 pr-10 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      आपका शहर (City)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signupCity}
                        onChange={(e) => setSignupCity(e.target.value)}
                        placeholder="Patna, Varanasi, Delhi..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <MapPin className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 active:scale-95 disabled:opacity-50"
                  >
                    <span>{loading ? 'पंजीकरण हो रहा है...' : 'खाता बनाएं व आशीर्वाद पाएं'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 4. FORGOT PASSWORD FORM */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      पंजीकृत ईमेल या मोबाइल नंबर
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com या 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      नया पासवर्ड / पिन (New Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="नया पासवर्ड दर्ज करें"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg transition-all"
                  >
                    {loading ? 'अपडेट हो रहा है...' : 'नया पासवर्ड सुरक्षित करें'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-xs text-stone-400 hover:text-white pt-1 block"
                  >
                    ← वापस लॉगिन पर जाएं
                  </button>
                </form>
              )}
            </>
          )}

        </div>

        {/* Modal Bottom Footer: Continue as Guest (Never Trapped) */}
        {!blessingCelebration?.active && (
          <div className="p-3.5 sm:p-4 border-t border-stone-800/80 bg-stone-950 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={closeAuthModal}
              className="text-xs text-stone-400 hover:text-amber-300 transition-colors font-medium"
            >
              अतिथि (Guest) के रूप में जारी रखें →
            </button>

            <span className="text-[10px] text-stone-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>सुरक्षित व पावन मंच</span>
            </span>
          </div>
        )}

      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalElement, document.body);
  }
  return modalElement;
};
