import React, { useState } from 'react';
import { X, Flame, Lock, Mail, User, MapPin, Globe, Sparkles, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

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

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(authModalTab);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCity, setSignupCity] = useState('Patna');
  const [signupBio, setSignupBio] = useState('');
  const [signupLang, setSignupLang] = useState<Language>('hi');

  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  React.useEffect(() => {
    setMode(authModalTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalTab, authModalOpen]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await login(loginEmailOrUser, loginPassword);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'लॉगिन विफल');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await signup({
      name: signupName,
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
      city: signupCity,
      bio: signupBio,
      language: signupLang
    });
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'पंजीकरण विफल');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const res = await resetPassword(forgotEmail, newPassword);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('पासवर्ड सफलतापूर्वक बदल दिया गया है! अब नए पासवर्ड से लॉगिन करें।');
      setTimeout(() => setMode('login'), 2000);
    } else {
      setErrorMsg(res.error || 'त्रुटि हुई');
    }
  };

  // Quick Demo Login Helper
  const quickDemoLogin = async (username: string) => {
    setLoading(true);
    setErrorMsg(null);
    await login(username, 'demo1234');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden text-stone-100 p-6 sm:p-7">
        
        {/* Decorative Golden Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-lg shadow-amber-500/30 flex items-center justify-center mb-3">
            <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400 animate-diya-flicker" />
            </div>
          </div>
          <h2 className="font-rozha text-2xl sm:text-3xl font-black text-amber-300">
            {mode === 'login' ? 'छठ महापर्व में स्वागत है' : mode === 'signup' ? 'नया खाता बनाएं' : 'पासवर्ड रीसेट करें'}
          </h2>
          <p className="font-mukta text-xs sm:text-sm text-stone-300 mt-1 max-w-xs">
            {authPromptMessage || 'अपनी छठ रील्स साझा करें, लाइक करें और पवित्र समुदाय से जुड़ें।'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="flex p-1 mb-5 rounded-xl bg-stone-900 border border-stone-800">
            <button
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold font-mukta rounded-lg transition-all ${
                mode === 'login' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              लॉग इन (Log In)
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold font-mukta rounded-lg transition-all ${
                mode === 'signup' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              साइन अप (Sign Up)
            </button>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                ईमेल या यूजरनेम (Email or @username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginEmailOrUser}
                  onChange={(e) => setLoginEmailOrUser(e.target.value)}
                  placeholder="@pramodchhath या email@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-all"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1 flex justify-between">
                <span>पासवर्ड (Password)</span>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-amber-400 hover:underline text-[10px]"
                >
                  पासवर्ड भूल गए?
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-all"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? 'लॉगिन हो रहा है...' : 'लॉग इन करें'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login Picker */}
            <div className="pt-3 border-t border-stone-800/80">
              <span className="block text-[10px] text-stone-400 uppercase tracking-wider text-center mb-2">
                त्वरित डेमो टेस्ट खाते (Quick Demo Login)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickDemoLogin('@sharda_trust')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-[11px] text-amber-300 border border-amber-500/20 text-left truncate"
                >
                  🎵 @sharda_trust
                </button>
                <button
                  type="button"
                  onClick={() => quickDemoLogin('@pramodchhath')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-[11px] text-amber-300 border border-amber-500/20 text-left truncate"
                >
                  🙏 @pramodchhath
                </button>
                <button
                  type="button"
                  onClick={() => quickDemoLogin('@bihari_vibes')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-[11px] text-amber-300 border border-amber-500/20 text-left truncate"
                >
                  🌅 @bihari_vibes
                </button>
                <button
                  type="button"
                  onClick={() => quickDemoLogin('@admin_chhath')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-[11px] text-amber-400 border border-amber-500/40 text-left truncate font-bold"
                >
                  🛡️ @admin_chhath
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                  पूरा नाम (Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="उदा. प्रमोद कुमार"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                  यूजरनेम (@username)
                </label>
                <input
                  type="text"
                  required
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="@pramod_chhath"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                ईमेल (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                  शहर (City)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    placeholder="Patna, Varanasi..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <MapPin className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                  पसंदीदा भाषा (Language)
                </label>
                <select
                  value={signupLang}
                  onChange={(e) => setSignupLang(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="bho">भोजपुरी (Bhojpuri)</option>
                  <option value="mai">मैथिली (Maithili)</option>
                  <option value="mag">मगही (Magahi)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="कम से कम 6 अक्षर"
                  className="w-full pl-8 pr-9 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                छोटा परिचय / बायो (Bio - Optional)
              </label>
              <textarea
                rows={2}
                value={signupBio}
                onChange={(e) => setSignupBio(e.target.value)}
                placeholder="छठी मईया की कृपा बनी रहे 🙏"
                className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'पंजीकरण हो रहा है...' : 'खाता बनाएं (Create Account)'}
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                पंजीकृत ईमेल (Registered Email)
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-200/80 mb-1">
                नया पासवर्ड (New Password)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="कम से कम 6 अक्षर"
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-400"
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
              className="w-full text-center text-xs text-stone-400 hover:text-white pt-2 block"
            >
              ← वापस लॉगिन पर जाएं
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
