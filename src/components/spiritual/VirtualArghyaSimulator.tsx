import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { 
  Sun, 
  Flame, 
  Droplet, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Heart, 
  Volume2 
} from 'lucide-react';

interface FloatingLamp {
  id: number;
  x: number; // percentage
  y: number; // percentage
  speed: number;
}

export const VirtualArghyaSimulator: React.FC = () => {
  const { t } = useLanguage();
  const { ringBell } = useAudio();

  const [offeringType, setOfferingType] = useState<'water' | 'milk' | 'diya'>('water');
  const [devoteeName, setDevoteeName] = useState('');
  const [isOffering, setIsOffering] = useState(false);
  const [hasOffered, setHasOffered] = useState(false);
  const [floatingLamps, setFloatingLamps] = useState<FloatingLamp[]>([
    { id: 1, x: 25, y: 72, speed: 12 },
    { id: 2, x: 65, y: 80, speed: 15 },
    { id: 3, x: 45, y: 85, speed: 10 }
  ]);

  // Total count of virtual offerings
  const [totalOfferings, setTotalOfferings] = useState(() => {
    try {
      const saved = localStorage.getItem('chhath_virtual_arghya_count');
      return saved ? parseInt(saved, 10) : 12846;
    } catch {
      return 12846;
    }
  });

  const handlePerformOffering = () => {
    if (isOffering) return;
    setIsOffering(true);
    ringBell();

    if (offeringType === 'diya') {
      const newLamp: FloatingLamp = {
        id: Date.now(),
        x: Math.random() * 60 + 20,
        y: 88,
        speed: Math.random() * 6 + 10
      };
      setFloatingLamps(prev => [newLamp, ...prev.slice(0, 7)]);
    }

    setTimeout(() => {
      setIsOffering(false);
      setHasOffered(true);
      const newCount = totalOfferings + 1;
      setTotalOfferings(newCount);
      try {
        localStorage.setItem('chhath_virtual_arghya_count', newCount.toString());
      } catch {}
    }, 2800);
  };

  const resetOffering = () => {
    setHasOffered(false);
    setIsOffering(false);
  };

  return (
    <section id="virtual-arghya" className="section-padding relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      
      {/* Devotional Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="container-custom relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-royal swarna-gold-sheen">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>डिजिटल पावन अनुष्ठान • VIRTUAL ARGHya & DEEP DAAN</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-100 gold-foil-text">
            आभासी अर्घ्य व दीप दान सिमुलेटर
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-300">
            जहाँ भी हों, पवित्र भाव से भगवान सूर्य को जल व दूध की धारा अर्पित करें और गंगा की लहरों पर अपना पावन दीप प्रवाहित करें।
          </p>
        </div>

        {/* Main Simulator Card */}
        <div className="royal-card-luxury p-6 sm:p-10 rounded-3xl border-amber-400/40 shadow-2xl max-w-5xl mx-auto overflow-hidden">
          
          {/* Top Bar: Devotee & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center p-0.5 shadow-lg">
                <span className="text-xl">🪔</span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  भक्त संकल्प
                </span>
                <span className="font-rozha text-lg text-stone-100">
                  {devoteeName ? `${devoteeName} जी द्वारा अर्घ्य` : 'समस्त श्रद्धालु व व्रती जन'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-stone-900/80 px-4 py-2 rounded-2xl border border-amber-500/30">
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">कुल अर्पित अर्घ्य</span>
                <span className="font-rozha text-xl text-amber-300 font-black tracking-wider">
                  {totalOfferings.toLocaleString('en-IN')}
                </span>
              </div>
              <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            </div>
          </div>

          {/* Interactive Ganga Ghat & Celestial Stage */}
          <div className="relative my-8 h-80 sm:h-96 rounded-2xl overflow-hidden border border-amber-400/30 bg-gradient-to-b from-stone-950 via-amber-950/40 to-stone-900 shadow-2xl">
            
            {/* Golden Rising Surya Dev */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div className={`relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center transition-transform duration-1000 ${isOffering ? 'scale-115' : 'scale-100'}`}>
                {/* 16 Aditya Rays Rotating */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full text-amber-400/60 animate-mandala-slow pointer-events-none"
                  fill="currentColor"
                >
                  {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                    <path
                      key={deg}
                      d="M 50 10 L 53 28 L 47 28 Z"
                      transform={`rotate(${deg} 50 50)`}
                    />
                  ))}
                </svg>

                {/* Sun Core Disc */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-600 via-amber-400 to-yellow-200 shadow-[0_0_60px_rgba(245,158,11,0.9)] flex items-center justify-center animate-sun-pulse border-2 border-yellow-200">
                  <Sun className="w-12 h-12 text-stone-950" />
                </div>
              </div>

              <div className="px-3 py-0.5 rounded-full bg-stone-900/80 border border-amber-400/40 mt-1 shadow">
                <span className="text-xs font-rozha text-amber-300 font-bold tracking-wider">
                  ॥ ॐ सूर्याय नमः ॥
                </span>
              </div>
            </div>

            {/* Pouring Kalash / Stream Animation */}
            {isOffering && (
              <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                {/* Copper Kalash */}
                <div className="text-4xl transform rotate-45 -translate-x-8 animate-bounce">
                  🏺
                </div>

                {/* Flowing Water / Milk Stream */}
                <div
                  className={`w-3 h-36 rounded-full blur-[1px] -mt-2 animate-pulse shadow-lg ${
                    offeringType === 'milk'
                      ? 'bg-gradient-to-b from-stone-100 via-white to-stone-200 shadow-white/60'
                      : 'bg-gradient-to-b from-amber-300 via-sky-300 to-sky-400 shadow-sky-400/60'
                  }`}
                />

                {/* Splash & Aura */}
                <div className="w-16 h-4 rounded-full bg-amber-400/60 blur-sm -mt-2 animate-ping" />
              </div>
            )}

            {/* Sacred Ganga River Water Waves */}
            <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36 bg-gradient-to-t from-sky-950 via-sky-900/80 to-transparent flex flex-col justify-end">
              <div className="w-full h-12 border-t border-sky-400/30 relative overflow-hidden bg-sky-950/40">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
              </div>

              {/* Floating Clay Diyas on Ganga Surface */}
              {floatingLamps.map((lamp) => (
                <div
                  key={lamp.id}
                  className="absolute pointer-events-none animate-float-diya"
                  style={{
                    left: `${lamp.x}%`,
                    top: `${lamp.y}%`,
                    animationDuration: `${lamp.speed}s`
                  }}
                >
                  <div className="relative">
                    <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-diya-flicker block">
                      🪔
                    </span>
                    <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur-md"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Offering Success Banner Overlay */}
            {hasOffered && !isOffering && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="font-rozha text-2xl sm:text-3xl text-stone-100 font-bold gold-foil-text mb-1">
                  अर्घ्य समर्पण सफल हुआ!
                </h4>
                <p className="font-mukta text-sm sm:text-base text-amber-200 max-w-md leading-relaxed mb-4">
                  भगवान सूर्य व छठी मईया का पावन आशीर्वाद आपके और आपके परिवार के जीवन में सुख, आरोग्य और समृद्धि लेकर आए।
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs font-serif text-amber-300 mb-5">
                  ॐ ह्रीं ह्रीं सूर्याय सहस्रकिरणाय मनोवांछित फलम् देहि देहि स्वाहा॥
                </div>
                <button
                  onClick={resetOffering}
                  className="btn-royal-gold text-xs py-2 px-6 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुनः अर्घ्य या दीप दान करें</span>
                </button>
              </div>
            )}

          </div>

          {/* Controls: Type Selection & Actions */}
          <div className="space-y-6 pt-2">
            
            {/* Offering Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOfferingType('water')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  offeringType === 'water'
                    ? 'bg-amber-500/25 border-amber-400 shadow-lg ring-1 ring-amber-300'
                    : 'bg-stone-900/60 border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-sm text-stone-100 block">पवित्र गंगाजल अर्घ्य</strong>
                  <span className="text-[11px] text-stone-400 font-mukta">ताम्र पात्र से सूर्य अर्घ्य</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOfferingType('milk')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  offeringType === 'milk'
                    ? 'bg-amber-500/25 border-amber-400 shadow-lg ring-1 ring-amber-300'
                    : 'bg-stone-900/60 border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100/20 text-stone-200 flex items-center justify-center shrink-0">
                  <span className="text-lg">🥛</span>
                </div>
                <div>
                  <strong className="text-sm text-stone-100 block">कच्चा गो-दुग्ध अर्घ्य</strong>
                  <span className="text-[11px] text-stone-400 font-mukta">गौ-माता के दुग्ध की धारा</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOfferingType('diya')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  offeringType === 'diya'
                    ? 'bg-amber-500/25 border-amber-400 shadow-lg ring-1 ring-amber-300'
                    : 'bg-stone-900/60 border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 animate-diya-flicker" />
                </div>
                <div>
                  <strong className="text-sm text-stone-100 block">अखंड दीप दान (दीप प्रवाह)</strong>
                  <span className="text-[11px] text-stone-400 font-mukta">गंगाजी में मिट्टी का दीप</span>
                </div>
              </button>
            </div>

            {/* Devotee Name & Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="अपना शुभ नाम दर्ज करें (वैकल्पिक)..."
                className="w-full sm:flex-1 px-4 py-3 rounded-full bg-stone-900 border border-amber-500/30 text-stone-100 font-mukta placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <button
                onClick={handlePerformOffering}
                disabled={isOffering}
                className="w-full sm:w-auto btn-royal-gold py-3 px-8 text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shrink-0 disabled:opacity-50"
              >
                {isOffering ? (
                  <>
                    <span className="animate-spin text-lg">⚙️</span>
                    <span>अर्घ्य धारा अर्पित हो रही है...</span>
                  </>
                ) : (
                  <>
                    <span>🪔</span>
                    <span>
                      {offeringType === 'diya' ? 'गंगाजी में दीप प्रवाहित करें' : 'भगवान सूर्य को अर्घ्य दें'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
