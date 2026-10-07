import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sun, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Heart,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../services/firebase';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    signInWithGoogle, 
    quickDevoteeLogin,
    authPromptMessage 
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [devoteeName, setDevoteeName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google साइन-इन में समस्या आई। आप नीचे "त्वरित श्रद्धालु प्रवेश" से भी जुड़ सकते हैं।');
      }
    } catch (err: any) {
      setError(err?.message || 'Google साइन-इन विफल रहा। आप नीचे "त्वरित श्रद्धालु प्रवेश" से भी जुड़ सकते हैं।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDevoteeSignIn = async () => {
    setError(null);
    setQuickLoading(true);
    try {
      await quickDevoteeLogin(devoteeName);
    } catch (err: any) {
      setError('त्वरित प्रवेश में समस्या आई।');
    } finally {
      setQuickLoading(false);
    }
  };

  const isConfigured = isFirebaseConfigured();

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Golden / Saffron Glow */}
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

        {/* Header with Sacred Sun Icon */}
        <div className="flex flex-col items-center text-center mt-1 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shadow-amber-500/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-amber-50 rounded-[14px] flex items-center justify-center">
              <Sun className="w-8 h-8 text-amber-600 animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            जय छठी मईया
          </h2>
          <p className="text-xs font-semibold text-amber-700 font-mukta mt-0.5">
            छठ महापर्व • पावन डिजिटल मंच
          </p>
        </div>

        {/* Custom Context Prompt or Default Subtitle */}
        {authPromptMessage ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-stone-800 font-mukta leading-relaxed font-medium">
              {authPromptMessage}
            </p>
          </div>
        ) : (
          <p className="text-center text-xs sm:text-sm text-stone-600 font-mukta mb-5">
            अपनी पूजा, संकल्प और भक्ति अनुभव को सुरक्षित रखने के लिए जुड़ें।
          </p>
        )}

        {/* Benefits List (Clean White / Saffron Cards) */}
        <div className="space-y-2 mb-6 text-xs sm:text-sm font-mukta text-stone-700">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0">
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <span className="font-medium text-stone-800">छठ मन्नत एवं संकल्प को हमेशा सुरक्षित रखें</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <span className="font-medium text-stone-800">अपने नाम का डिजिटल आशीर्वाद सर्टिफिकेट पाएं</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0">
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <span className="font-medium text-stone-800">छठ व्रती व भक्त समुदाय से जुड़ें</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* 1-Click Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 text-stone-900 rounded-2xl font-medium shadow-md hover:shadow-lg border border-stone-200/90 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
              <span className="text-sm font-bold text-stone-800">प्रवेश हो रहा है...</span>
            </>
          ) : (
            <>
              {/* Google Official G Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-extrabold text-stone-900 leading-tight">
                  Google से 1-क्लिक में जारी रखें
                </div>
                <div className="text-[10px] text-stone-500 font-mukta leading-none mt-0.5 font-medium">
                  कोई पासवर्ड या फॉर्म नहीं • 100% सुरक्षित
                </div>
              </div>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-mukta font-bold text-stone-400 uppercase tracking-wider shrink-0">
            या बिना पासवर्ड तुरंत जुड़ें
          </span>
          <div className="border-t border-stone-200 w-full" />
        </div>

        {/* 1-Click Quick Devotee Sign-In */}
        <div className="p-3.5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 border border-amber-300/70 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 font-mukta flex items-center gap-1.5">
              <span>🌸</span>
              <span>श्रद्धालु त्वरित प्रवेश (1-क्लिक)</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
              तत्काल सक्रिय
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={devoteeName}
              onChange={(e) => setDevoteeName(e.target.value)}
              placeholder="अपना नाम लिखें (उदा. राज किशोर)"
              className="flex-1 px-3 py-2 text-xs bg-white border border-amber-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder:text-stone-400 font-mukta"
            />
            <button
              onClick={handleQuickDevoteeSignIn}
              disabled={quickLoading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-extrabold text-xs rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1 shrink-0 font-mukta cursor-pointer"
            >
              {quickLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
              ) : (
                <>
                  <span>प्रवेश करें</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-stone-500 font-mukta text-center leading-tight">
            बिना किसी फॉर्म या पासवर्ड के तुरंत प्रोफाइल व 'मेरी छठ' डैशबोर्ड पाएं।
          </p>
        </div>

        {/* Footer info & Guest continue */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mukta">
          <div className="flex items-center gap-1.5 text-stone-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>सुरक्षित व पावन मंच</span>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-amber-700 hover:text-amber-800 font-bold hover:underline transition-colors"
          >
            अतिथि के रूप में जारी रखें →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
