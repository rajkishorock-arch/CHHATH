import React from 'react';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Film, 
  Music, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Heart,
  ShieldCheck,
  Compass,
  Utensils
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { chhathDays } from '../../data/days';

export const PublicWelcomeLanding: React.FC = () => {
  const { openAuthModal, login } = useAuth();

  const handleDemoLogin = async (username: string) => {
    await login(username, 'demo1234');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Sacred Sunflare & Floating Particles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-amber-500/20 backdrop-blur-xl bg-stone-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-xl">🌅</span>
          </div>
          <div>
            <h1 className="font-rozha text-xl sm:text-2xl font-black gold-foil-text leading-tight">
              छठ महापर्व
            </h1>
            <span className="hidden sm:block text-[10px] font-mukta font-bold uppercase tracking-[0.2em] text-amber-400">
              वैयक्तिकृत डिजिटल आध्यात्मिक मंच
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 rounded-full text-xs font-bold text-stone-200 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-700 transition-all"
          >
            लॉग इन (Log In)
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-stone-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <span>खाता बनाएं</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 container-custom max-w-5xl mx-auto px-4 py-12 sm:py-16 flex flex-col items-center text-center space-y-8">
        
        {/* Sacred Sun Icon & Diya */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-2xl shadow-amber-500/50 flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center border border-yellow-300/40">
              <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]">
                🌅
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full p-1.5 shadow-lg border border-yellow-200">
            <Flame className="w-4 h-4 text-amber-950 fill-amber-300 animate-diya-flicker" />
          </div>
        </div>

        {/* Hero Titles */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>छठ महापर्व 2026 • कार्तिक शुक्ल चतुर्थी से सप्तमी</span>
          </div>

          <h2 className="font-rozha text-4xl sm:text-6xl lg:text-7xl font-black gold-foil-text tracking-wide leading-tight drop-shadow">
            जय छठी मईया
          </h2>

          <p className="font-rozha text-xl sm:text-2xl text-amber-300/90 font-medium">
            “आस्था से अनुभव तक — आपका व्यक्तिगत छठ डिजिटल संसार”
          </p>

          <p className="font-mukta text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed pt-2">
            यह केवल एक सामान्य सूचना वेबसाइट नहीं है, बल्कि आपका अपना पवित्र डिजिटल छठ इकोसिस्टम है। 
            अपने शहर का अर्घ्य समय, आपकी पसंद की रील्स, पावन गीत और परिवार के साथ व्रत की तैयारी के लिए अपना निःशुल्क खाता बनाएं।
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md pt-2">
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base shadow-2xl shadow-orange-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>खाता बनाएं व अनुभव शुरू करें</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-amber-500/40 text-amber-300 font-bold text-base hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>लॉग इन करें (Log In)</span>
          </button>
        </div>

        {/* 1-Click Quick Demo Test Logins */}
        <div className="w-full max-w-lg p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-400 font-bold uppercase tracking-wider">
            <span>त्वरित 1-क्लिक टेस्ट खाते (One-Click Demo Test Accounts):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleDemoLogin('@pramodchhath')}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/20 text-left transition-all hover:border-amber-400"
            >
              <div className="text-xs font-bold text-white truncate">प्रमोद कुमार</div>
              <div className="text-[10px] text-amber-400 font-mono">@pramodchhath</div>
            </button>
            <button
              onClick={() => handleDemoLogin('@sharda_trust')}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/20 text-left transition-all hover:border-amber-400"
            >
              <div className="text-xs font-bold text-white truncate">शारदा सिन्हा न्यास</div>
              <div className="text-[10px] text-amber-400 font-mono">@sharda_trust</div>
            </button>
            <button
              onClick={() => handleDemoLogin('@bihari_vibes')}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/20 text-left transition-all hover:border-amber-400"
            >
              <div className="text-xs font-bold text-white truncate">Bihari Vibes</div>
              <div className="text-[10px] text-amber-400 font-mono">@bihari_vibes</div>
            </button>
            <button
              onClick={() => handleDemoLogin('@admin_chhath')}
              className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-left transition-all"
            >
              <div className="text-xs font-bold text-amber-300 truncate">🛡️ एडमिन पटल</div>
              <div className="text-[10px] text-amber-400 font-mono">@admin_chhath</div>
            </button>
          </div>
        </div>

        {/* "Why Create Account?" Feature Bento Grid */}
        <div className="w-full pt-8 space-y-4">
          <h3 className="font-rozha text-2xl sm:text-3xl font-bold text-white text-center">
            आपके व्यक्तिगत छठ खाते में क्या विशेष है?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            <div className="p-5 rounded-3xl bg-stone-900/70 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-rozha text-lg font-bold text-white">मेरा छठ (My Chhath)</h4>
              <p className="font-mukta text-xs text-stone-300 leading-relaxed">
                आपके शहर के अनुसार सटीक संध्या व उषा अर्घ्य का लाइव काउंटडाउन, आज का व्रत चरण व व्यक्तिगत संकल्प।
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900/70 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <h4 className="font-rozha text-lg font-bold text-white">For You रील्स</h4>
              <p className="font-mukta text-xs text-stone-300 leading-relaxed">
                आपकी 14 चुनी हुई रुचियों व भाषा के अनुसार विशेष छठ रील्स, जिन्हें आप लाइक, कमेंट व सेव कर सकते हैं।
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900/70 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <h4 className="font-rozha text-lg font-bold text-white">व्यक्तिगत संगीत</h4>
              <p className="font-mukta text-xs text-stone-300 leading-relaxed">
                पद्मभूषण शारदा सिन्हा व अनुराधा पौडवाल के अमर छठ गीत, जो आपकी पसंदीदा भाषा में सजेंगे।
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900/70 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-rozha text-lg font-bold text-white">परिवार छठ हब</h4>
              <p className="font-mukta text-xs text-stone-300 leading-relaxed">
                परिवार के सदस्यों को दउरा, सूप, ईख और दीप की जिम्मेदारियां बांटें और सामूहिक संस्मरण सुरक्षित रखें।
              </p>
            </div>

          </div>
        </div>

        {/* 4-Day Festival Overview Cards */}
        <div className="w-full pt-8 space-y-4">
          <h3 className="font-rozha text-2xl font-bold text-white">
            छठ महापर्व के चार पावन दिन (Four Sacred Days)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            {chhathDays.map((day, idx) => (
              <div 
                key={day.id}
                className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1.5"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  दिन {idx + 1} • {day.date2026}
                </div>
                <h4 className="font-rozha text-base font-bold text-white">{day.title}</h4>
                <p className="font-mukta text-xs text-stone-400 line-clamp-2">{day.meaning}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 border-t border-stone-800 text-center text-xs text-stone-500 font-mukta">
        छठ महापर्व 2026 • समस्त व्रतियों व श्रद्धालुओं को समर्पित पावन डिजिटल सेवा मंच • जय छठी मईया 🙏
      </footer>

    </div>
  );
};
