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
import { useLanguage } from '../../context/LanguageContext';
import { Language, ReelUser } from '../../types';

export const AuthModal: React.FC = () => {
  const { language } = useLanguage();
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

  const authStrings = {
    hi: {
      ariaTitle: 'छठ महापर्व श्रद्धालु प्रवेश',
      title: 'जय छठी मईया',
      subtitle: 'पावन आस्था, सूर्य उपासना एवं भक्त समुदाय',
      closeBtn: 'बंद करें',
      tab1Tap: '1-टैप प्रवेश',
      tab1TapSub: 'तुरंत दर्शन',
      tabLogin: 'लॉग इन',
      tabLoginSub: 'खाता प्रवेश',
      tabSignup: 'नया खाता',
      tabSignupSub: 'साइन अप',
      quickPrompt: 'बिना किसी पासवर्ड के तुरंत व्रती के रूप में प्रवेश करें:',
      nameLabel: 'आपका शुभ नाम (Your Name - Optional)',
      namePlaceholder: 'उदा. राहुल कुमार / सीमा देवी',
      roleLabel: 'आपकी भूमिका चुनें:',
      roles: ['छठ व्रती', 'सूर्य उपासक', 'भजन प्रेमी'] as const,
      cityLabel: 'आपका शहर / घाट:',
      quickSubmit: '🙏 पावन व्रती रूप में तुरंत प्रवेश करें',
      loadingSubmit: 'प्रवेश हो रहा है...',
      curatedHeading: 'या किसी समर्पित पावन मंडल से जुड़ें (1-Tap Direct Login)',
      loginIdLabel: 'ईमेल, मोबाइल नंबर या यूजरनेम',
      loginIdPlaceholder: 'उदा. 9876543210 या devotee@chhath.in',
      loginPassLabel: 'पासवर्ड / पिन (Password)',
      forgotLink: 'पासवर्ड भूल गए?',
      passPlaceholder: '•••••••• (वैकल्पिक / सरल पासवर्ड)',
      loginBtn: 'लॉग इन करें',
      loginLoading: 'लॉगिन हो रहा है...',
      noPassLink: 'पासवर्ड याद नहीं? 1-टैप व्रती प्रवेश का उपयोग करें',
      signupNameLabel: 'आपका पूरा नाम (Full Name) *',
      signupNamePlaceholder: 'उदा. अमित कुमार',
      signupContactLabel: 'मोबाइल नंबर या ईमेल (Mobile or Email) *',
      signupContactPlaceholder: 'उदा. 9876543210 या amit@example.com',
      signupPassLabel: 'सरल पासवर्ड / पिन (Password)',
      signupPassPlaceholder: 'कम से कम 4 अक्षर (उदा. 1234)',
      signupCityLabel: 'आपका शहर (City)',
      signupBtn: 'खाता बनाएं व आशीर्वाद पाएं',
      signupLoading: 'पंजीकरण हो रहा है...',
      guestLink: 'अतिथि (Guest) के रूप में जारी रखें →',
      securePlatform: 'सुरक्षित व पावन मंच'
    },
    en: {
      ariaTitle: 'Chhath Mahaparv Devotee Entry',
      title: 'Jai Chhathi Maiya',
      subtitle: 'Divine Devotion, Solar Worship & Community',
      closeBtn: 'Close',
      tab1Tap: '1-Tap Entry',
      tab1TapSub: 'Instant Darshan',
      tabLogin: 'Log In',
      tabLoginSub: 'Devotee Access',
      tabSignup: 'New Account',
      tabSignupSub: 'Sign Up',
      quickPrompt: 'Enter instantly as a devotee without any password:',
      nameLabel: 'Your Good Name (Optional)',
      namePlaceholder: 'e.g. Rahul Kumar / Seema Devi',
      roleLabel: 'Select Your Devotional Role:',
      roles: ['Fasting Devotee', 'Solar Devotee', 'Music Lover'] as const,
      cityLabel: 'Your City / Ghat:',
      quickSubmit: '🙏 Enter as Devotee & Seek Blessings',
      loadingSubmit: 'Entering...',
      curatedHeading: 'Or Join via Devotional Portals (1-Tap Direct Login)',
      loginIdLabel: 'Email, Mobile Number or Username',
      loginIdPlaceholder: 'e.g. 9876543210 or devotee@chhath.in',
      loginPassLabel: 'Password / PIN',
      forgotLink: 'Forgot Password?',
      passPlaceholder: '•••••••• (Optional / Simple Password)',
      loginBtn: 'Log In',
      loginLoading: 'Logging in...',
      noPassLink: "Don't remember password? Use 1-Tap Devotee Entry",
      signupNameLabel: 'Full Name *',
      signupNamePlaceholder: 'e.g. Amit Kumar',
      signupContactLabel: 'Mobile Number or Email *',
      signupContactPlaceholder: 'e.g. 9876543210 or amit@example.com',
      signupPassLabel: 'Simple Password / PIN',
      signupPassPlaceholder: 'At least 4 characters (e.g. 1234)',
      signupCityLabel: 'Your City',
      signupBtn: 'Create Account & Receive Blessings',
      signupLoading: 'Creating account...',
      guestLink: 'Continue as Guest →',
      securePlatform: 'Secure & Sacred Portal'
    },
    bho: {
      ariaTitle: 'छठ महापर्व श्रद्धालु प्रवेश',
      title: 'जय छठी मईया',
      subtitle: 'पावन आस्था, सुरुज उपासना आ भक्त समाज',
      closeBtn: 'बंद करीं',
      tab1Tap: '1-टैप प्रवेश',
      tab1TapSub: 'तुरंत दर्शन',
      tabLogin: 'लॉग इन',
      tabLoginSub: 'खाता प्रवेश',
      tabSignup: 'नया खाता',
      tabSignupSub: 'साइन अप',
      quickPrompt: 'बिना कवनो पासवर्ड के तुरंत व्रती रूप में प्रवेश करीं:',
      nameLabel: 'रउआ शुभ नाम (वैकल्पिक)',
      namePlaceholder: 'उदा. राहुल कुमार / सीमा देवी',
      roleLabel: 'अपन भूमिका चुनीं:',
      roles: ['छठ व्रती', 'सूर्य उपासक', 'भजन प्रेमी'] as const,
      cityLabel: 'रउआ शहर / घाट:',
      quickSubmit: '🙏 पावन व्रती रूप में तुरंत प्रवेश करीं',
      loadingSubmit: 'प्रवेश होत बा...',
      curatedHeading: 'भा समर्पित पावन मंडल से जुड़ीं (1-Tap Direct Login)',
      loginIdLabel: 'ईमेल, मोबाइल नंबर भा यूजरनेम',
      loginIdPlaceholder: 'उदा. 9876543210 भा devotee@chhath.in',
      loginPassLabel: 'पासवर्ड / पिन (Password)',
      forgotLink: 'पासवर्ड भुला गइल?',
      passPlaceholder: '•••••••• (सरल पासवर्ड)',
      loginBtn: 'लॉग इन करीं',
      loginLoading: 'लॉगिन होत बा...',
      noPassLink: 'पासवर्ड नइखे याद? 1-टैप व्रती प्रवेश करीं',
      signupNameLabel: 'रउआ पूरा नाम *',
      signupNamePlaceholder: 'उदा. अमित कुमार',
      signupContactLabel: 'मोबाइल नंबर भा ईमेल *',
      signupContactPlaceholder: 'उदा. 9876543210 भा amit@example.com',
      signupPassLabel: 'सरल पासवर्ड / पिन (Password)',
      signupPassPlaceholder: 'कम से कम 4 अक्षर (उदा. 1234)',
      signupCityLabel: 'रउआ शहर (City)',
      signupBtn: 'खाता बनाईं आ असीस पाईं',
      signupLoading: 'खाता बनत बा...',
      guestLink: 'अतिथि (Guest) के रूप में आगे बढ़ीं →',
      securePlatform: 'सुरक्षित आ पावन मंच'
    },
    mai: {
      ariaTitle: 'छठि महापर्व श्रद्धालु प्रवेश',
      title: 'जय छठी मईया',
      subtitle: 'पावन आस्था, सूर्य उपासना ओ भक्त समुदाय',
      closeBtn: 'बंद करू',
      tab1Tap: '1-टैप प्रवेश',
      tab1TapSub: 'तुरंत दर्शन',
      tabLogin: 'लॉग इन',
      tabLoginSub: 'खाता प्रवेश',
      tabSignup: 'नव खाता',
      tabSignupSub: 'साइन अप',
      quickPrompt: 'बिना कोनो पासवर्ड के तुरंत व्रती रूप में प्रवेश करू:',
      nameLabel: 'अहांक शुभ नाम (वैकल्पिक)',
      namePlaceholder: 'उदा. राहुल कुमार / सीमा देवी',
      roleLabel: 'अपन भूमिका चुनू:',
      roles: ['छठि व्रती', 'सूर्य उपासक', 'भजन प्रेमी'] as const,
      cityLabel: 'अहांक नगर / घाट:',
      quickSubmit: '🙏 पावन व्रती रूप में तुरंत प्रवेश करू',
      loadingSubmit: 'प्रवेश भ रहल अछि...',
      curatedHeading: 'वा समर्पित पावन मंडल सं जुड़ू (1-Tap Direct Login)',
      loginIdLabel: 'ईमेल, मोबाइल नंबर वा यूजरनेम',
      loginIdPlaceholder: 'उदा. 9876543210 वा devotee@chhath.in',
      loginPassLabel: 'पासवर्ड / पिन (Password)',
      forgotLink: 'पासवर्ड बिसरि गेलाह?',
      passPlaceholder: '•••••••• (सरल पासवर्ड)',
      loginBtn: 'लॉग इन करू',
      loginLoading: 'लॉगिन भ रहल अछि...',
      noPassLink: 'पासवर्ड मोन नहि अछि? 1-टैप व्रती प्रवेश करू',
      signupNameLabel: 'अहांक पूरा नाम *',
      signupNamePlaceholder: 'उदा. अमित कुमार',
      signupContactLabel: 'मोबाइल नंबर वा ईमेल *',
      signupContactPlaceholder: 'उदा. 9876543210 वा amit@example.com',
      signupPassLabel: 'सरल पासवर्ड / पिन (Password)',
      signupPassPlaceholder: 'कम से कम 4 अक्षर (उदा. 1234)',
      signupCityLabel: 'अहांक नगर (City)',
      signupBtn: 'खाता बनाउ ओ आशीर्वाद पाऊ',
      signupLoading: 'खाता बनि रहल अछि...',
      guestLink: 'अतिथि (Guest) रूप में आगू बढ़ू →',
      securePlatform: 'सुरक्षित ओ पावन मंच'
    },
    mag: {
      ariaTitle: 'छठ महापर्व श्रद्धालु प्रवेश',
      title: 'जय छठी मईया',
      subtitle: 'पावन आस्था, सूर्य उपासना आ भक्त समुदाय',
      closeBtn: 'बंद करी',
      tab1Tap: '1-टैप प्रवेश',
      tab1TapSub: 'तुरंत दर्शन',
      tabLogin: 'लॉग इन',
      tabLoginSub: 'खाता प्रवेश',
      tabSignup: 'नया खाता',
      tabSignupSub: 'साइन अप',
      quickPrompt: 'बिना कवनो पासवर्ड के तुरंत व्रती रूप में प्रवेश करी:',
      nameLabel: 'अपन शुभ नाम (वैकल्पिक)',
      namePlaceholder: 'उदा. राहुल कुमार / सीमा देवी',
      roleLabel: 'अपन भूमिका चुनी:',
      roles: ['छठ व्रती', 'सूर्य उपासक', 'भजन प्रेमी'] as const,
      cityLabel: 'अपन शहर / घाट:',
      quickSubmit: '🙏 पावन व्रती रूप में तुरंत प्रवेश करी',
      loadingSubmit: 'प्रवेश हो रहल हे...',
      curatedHeading: 'या समर्पित पावन मंडल से जुड़ी (1-Tap Direct Login)',
      loginIdLabel: 'ईमेल, मोबाइल नंबर या यूजरनेम',
      loginIdPlaceholder: 'उदा. 9876543210 या devotee@chhath.in',
      loginPassLabel: 'पासवर्ड / पिन (Password)',
      forgotLink: 'पासवर्ड भुला गेली?',
      passPlaceholder: '•••••••• (सरल पासवर्ड)',
      loginBtn: 'लॉग इन करी',
      loginLoading: 'लॉगिन हो रहल हे...',
      noPassLink: 'पासवर्ड नइखे याद? 1-टैप व्रती प्रवेश करी',
      signupNameLabel: 'अपन पूरा नाम *',
      signupNamePlaceholder: 'उदा. अमित कुमार',
      signupContactLabel: 'मोबाइल नंबर या ईमेल *',
      signupContactPlaceholder: 'उदा. 9876543210 या amit@example.com',
      signupPassLabel: 'सरल पासवर्ड / पिन (Password)',
      signupPassPlaceholder: 'कम से कम 4 अक्षर (उदा. 1234)',
      signupCityLabel: 'अपन शहर (City)',
      signupBtn: 'खाता बनाई आ आशीर्वाद पाई',
      signupLoading: 'खाता बन रहल हे...',
      guestLink: 'अतिथि (Guest) के रूप में आगे बढ़ी →',
      securePlatform: 'सुरक्षित आ पावन मंच'
    }
  };

  const ui = authStrings[language] || authStrings.hi;

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
      aria-label={ui.ariaTitle}
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
                  {ui.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                  2026
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-mukta truncate mt-0.5">
                {ui.subtitle}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-full bg-stone-900/90 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800 transition-all shrink-0 active:scale-95"
            title={ui.closeBtn}
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
                    <span>{ui.tab1Tap}</span>
                    <span className="text-[9px] opacity-80 font-normal">{ui.tab1TapSub}</span>
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
                    <span>{ui.tabLogin}</span>
                    <span className="text-[9px] opacity-80 font-normal">{ui.tabLoginSub}</span>
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
                    <span>{ui.tabSignup}</span>
                    <span className="text-[9px] opacity-80 font-normal">{ui.tabSignupSub}</span>
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
                      <span>{ui.quickPrompt}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        {ui.nameLabel}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={quickName}
                          onChange={(e) => setQuickName(e.target.value)}
                          placeholder={ui.namePlaceholder}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    {/* Quick Sacred Role Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1.5">
                        {ui.roleLabel}
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {ui.roles.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setQuickRole(r as any)}
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
                        <span>{ui.cityLabel}</span>
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
                    <span>{loading ? ui.loadingSubmit : ui.quickSubmit}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Representative Sacred Devotee Profiles */}
                  <div className="pt-2 border-t border-stone-800/80 space-y-2">
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider text-center font-bold">
                      {ui.curatedHeading}
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
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">4 दिवसीय संपूर्ण अनुष्ठान</span>
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
                      {ui.loginIdLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginEmailOrUser}
                        onChange={(e) => setLoginEmailOrUser(e.target.value)}
                        placeholder={ui.loginIdPlaceholder}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1 flex justify-between items-center">
                      <span>{ui.loginPassLabel}</span>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-amber-400 hover:underline text-[11px]"
                      >
                        {ui.forgotLink}
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={ui.passPlaceholder}
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
                    <span>{loading ? ui.loginLoading : ui.loginBtn}</span>
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
                      <span>{ui.noPassLink}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 3. SIGNUP FORM */}
              {mode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      {ui.signupNameLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder={ui.signupNamePlaceholder}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      {ui.signupContactLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={signupIdentifier}
                        onChange={(e) => setSignupIdentifier(e.target.value)}
                        placeholder={ui.signupContactPlaceholder}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <Smartphone className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-200/90 mb-1">
                      {ui.signupPassLabel}
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder={ui.signupPassPlaceholder}
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
                      {ui.signupCityLabel}
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
                    <span>{loading ? ui.signupLoading : ui.signupBtn}</span>
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
              {ui.guestLink}
            </button>

            <span className="text-[10px] text-stone-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{ui.securePlatform}</span>
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
