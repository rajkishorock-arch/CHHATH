import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sun, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
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
    authPromptMessage 
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google साइन-इन में समस्या आई। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setError(err?.message || 'Google साइन-इन विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = isFirebaseConfigured();

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Golden Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Sacred Sun Icon */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/30 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
              <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300">
            जय छठी मईया
          </h2>
          <p className="text-xs text-amber-300/80 font-mukta mt-1">
            छठ महापर्व • पावन डिजिटल मंच
          </p>
        </div>

        {/* Custom Context Prompt or Default Subtitle */}
        {authPromptMessage ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-100 font-mukta leading-relaxed">
              {authPromptMessage}
            </p>
          </div>
        ) : (
          <p className="text-center text-xs sm:text-sm text-stone-300 font-mukta mb-5">
            अपनी पूजा, संकल्प और भक्ति अनुभव को सुरक्षित रखने के लिए जुड़ें।
          </p>
        )}

        {/* Benefits List */}
        <div className="space-y-2.5 mb-6 text-xs sm:text-sm font-mukta text-stone-300">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>छठ मन्नत एवं संकल्प को सुरक्षित रखें</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>अपने नाम का डिजिटल आशीर्वाद सर्टिफिकेट पाएं</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Users className="w-4 h-4 text-orange-400 shrink-0" />
            <span>छठ व्रती व भक्त समुदाय से जुड़ें</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* 1-Click Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-white hover:bg-stone-100 text-stone-900 rounded-2xl font-medium shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 text-stone-600 animate-spin" />
              <span className="text-sm font-semibold">प्रवेश हो रहा है...</span>
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
                <div className="text-sm font-bold text-stone-900 leading-tight">
                  Google से 1-क्लिक में जारी रखें
                </div>
                <div className="text-[10px] text-stone-500 font-mukta leading-none mt-0.5">
                  कोई पासवर्ड या फॉर्म नहीं • 100% सुरक्षित
                </div>
              </div>
            </>
          )}
        </button>

        {/* Developer Notice if Firebase keys are missing */}
        {!isConfigured && (
          <div className="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mukta text-center">
            ⚙️ <strong>Firebase Keys Pending:</strong> कृपया <code>.env</code> फ़ाइल में Firebase keys जोड़ें।
          </div>
        )}

        {/* Footer info & Guest continue */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400 font-mukta">
          <div className="flex items-center gap-1.5 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>सुरक्षित व पावन मंच</span>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-amber-400 hover:text-amber-300 hover:underline transition-colors"
          >
            अतिथि के रूप में जारी रखें →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
