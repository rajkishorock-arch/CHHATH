import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sun, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  LogIn,
  UserPlus,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    signInWithGoogle, 
    login,
    signup,
    resetPassword,
    authPromptMessage,
    authModalTab
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(authModalTab === 'signup' ? 'signup' : 'login');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!authModalOpen) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetLoading) return;
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('कृपया एक वैध ईमेल पता दर्ज करें।');
      return;
    }
    setResetLoading(true);
    try {
      const res = await resetPassword(trimmedEmail);
      if (res.success) {
        setResetSent(true);
      } else {
        setError(res.error || 'पासवर्ड रीसेट लिंक भेजने में समस्या आई।');
      }
    } catch (err: any) {
      setError(err?.message || 'समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading || emailLoading) return;
    setError(null);
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google साइन-इन विफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setError(err?.message || 'Google साइन-इन में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (googleLoading || emailLoading) return;
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('कृपया एक वैध ईमेल पता दर्ज करें।');
      return;
    }
    if (!password || password.length < 6) {
      setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    setEmailLoading(true);

    try {
      if (activeTab === 'signup') {
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length < 2) {
          setError('कृपया अपना पूरा नाम दर्ज करें।');
          setEmailLoading(false);
          return;
        }

        const res = await signup({
          name: trimmedName,
          email: trimmedEmail,
          password
        });

        if (!res.success) {
          setError(res.error || 'खाता बनाने में समस्या आई। कृपया पुनः प्रयास करें।');
        }
      } else {
        const res = await login(trimmedEmail, password);
        if (!res.success) {
          setError(res.error || 'लॉगिन विफल रहा। कृपया ईमेल और पासवर्ड पुनः जांचें।');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'प्रमाणीकरण में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setEmailLoading(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md bg-white text-stone-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-amber-200/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Saffron Glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Sun Icon */}
        <div className="flex flex-col items-center text-center mt-1 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shadow-amber-500/20 mb-2.5 flex items-center justify-center">
            <div className="w-full h-full bg-amber-50 rounded-[14px] flex items-center justify-center">
              <Sun className="w-7 h-7 text-amber-600 animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
            जय छठी मईया
          </h2>
          <p className="text-xs font-semibold text-amber-700 font-mukta mt-0.5">
            छठ महापर्व • पावन डिजिटल मंच
          </p>
        </div>

        {/* Prompt message if provided */}
        {authPromptMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-800 font-mukta leading-relaxed font-medium">
              {authPromptMessage}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {isForgotPassword ? (
          <div className="font-mukta">
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setError(null);
                setResetSent(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold mb-3 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>वापस लॉगिन पर जाएं</span>
            </button>

            <h3 className="text-base font-bold text-stone-900 mb-1">
              पासवर्ड रीसेट करें
            </h3>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              अपना पंजीकृत ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने का लिंक भेजेंगे।
            </p>

            {resetSent ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
                  पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है! कृपया अपना इनबॉक्स या स्पैम फ़ोल्डर चेक करें।
                </span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    पंजीकृत ईमेल (Email Address) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="उदा. name@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-stone-950 animate-spin" />
                      <span>रीसेट लिंक भेज रहे हैं...</span>
                    </>
                  ) : (
                    <span>रीसेट लिंक भेजें</span>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* 1-Click Real Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading || emailLoading}
              className="w-full py-3 px-4 bg-white hover:bg-stone-50 text-stone-900 rounded-2xl font-medium shadow-sm hover:shadow border border-stone-300 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                  <span className="text-xs sm:text-sm font-bold text-stone-800">Google से जुड़ रहे हैं...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                      Google से जारी रखें
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mukta leading-none mt-0.5">
                      1-क्लिक में सुरक्षित प्रवेश
                    </span>
                  </div>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-mukta font-bold text-stone-400 uppercase tracking-wider shrink-0">
                या ईमेल और पासवर्ड से
              </span>
              <div className="border-t border-stone-200 w-full" />
            </div>

            {/* Tab Switcher: Log In vs Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-4 font-mukta text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉग इन करें</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError(null);
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'signup'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>नया खाता बनाएं</span>
              </button>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3 font-mukta">
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    पूरा नाम (Full Name) *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="अपना नाम दर्ज करें"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ईमेल (Email Address) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="उदा. name@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    पासवर्ड (Password) *
                  </label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError(null);
                        setResetSent(false);
                      }}
                      className="text-[11px] text-amber-700 hover:text-amber-800 hover:underline font-bold cursor-pointer"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={activeTab === 'signup' ? 'कम से कम 6 अक्षर' : 'अपना पासवर्ड लिखें'}
                    required
                    className="w-full pl-9 pr-10 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                    aria-label={showPassword ? 'पासवर्ड छुपाएं' : 'पासवर्ड दिखाएं'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={emailLoading || googleLoading}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-stone-950 animate-spin" />
                    <span>सत्यापन हो रहा है...</span>
                  </>
                ) : activeTab === 'signup' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>खाता बनाएं (Sign Up)</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>लॉग इन करें (Log In)</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Footer info & Guest continue */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mukta">
          <div className="flex items-center gap-1.5 text-stone-600 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% सुरक्षित Firebase</span>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-amber-700 hover:text-amber-800 font-bold hover:underline transition-colors text-[11px]"
          >
            अतिथि के रूप में जारी रखें →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
