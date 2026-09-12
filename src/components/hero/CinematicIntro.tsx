import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, FastForward, Sparkles, Sun, Flame } from 'lucide-react';
import { devotionalAudio } from '../../utils/audioEngine';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0); 
  // 0: Deep darkness, 1: Golden dawn light, 2: Sun rising & Diyas kindle, 3: "जय छठी मईया", 4: "आस्था से अनुभव तक", 5: Complete
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefersReducedMotion(true);
    }

    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2600);
    const t3 = setTimeout(() => setStage(3), 4400);
    const t4 = setTimeout(() => setStage(4), 6500);
    const t5 = setTimeout(() => {
      handleFinish();
    }, 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      devotionalAudio.stopRiverWaves();
    };
  }, []);

  const toggleRiverSound = () => {
    if (!soundEnabled) {
      devotionalAudio.startRiverWaves(0.35);
      setSoundEnabled(true);
    } else {
      devotionalAudio.stopRiverWaves();
      setSoundEnabled(false);
    }
  };

  const handleFinish = () => {
    devotionalAudio.stopRiverWaves();
    setStage(5);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
        stage === 5 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ overflow: 'hidden' }}
    >
      {/* Background Ambience: Night sky transforming to holy dawn */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background:
            stage >= 2
              ? 'radial-gradient(circle at 50% 70%, #b45309 0%, #451a03 35%, #0c0a09 75%, #000000 100%)'
              : stage >= 1
              ? 'radial-gradient(circle at 50% 80%, #78350f 0%, #1c1917 50%, #000000 100%)'
              : '#000000'
        }}
      />

      {/* Sacred River Water Horizon & Waves */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/3 transition-all duration-1000 ${
          stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-stone-950/80 to-transparent" />
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-cover opacity-60 text-amber-500/30"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Rising Sun Animation */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-1000 flex flex-col items-center ${
          stage >= 2 ? 'bottom-[25%] opacity-100 scale-100' : 'bottom-[10%] opacity-0 scale-75'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* Solar Aura */}
          <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-300 blur-2xl opacity-75 animate-pulse" />
          
          {/* Sacred Sun Core */}
          <div className="absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-200 shadow-[0_0_80px_rgba(251,191,36,0.9)] flex items-center justify-center border-2 border-yellow-200">
            <Sun className="w-14 h-14 sm:w-20 sm:h-20 text-amber-950/80 animate-spin" style={{ animationDuration: '40s' }} />
          </div>
        </div>
      </div>

      {/* Floating Glowing Diyas on Water */}
      <div
        className={`absolute bottom-6 left-0 right-0 flex justify-around items-end px-4 sm:px-20 transition-opacity duration-1000 ${
          stage >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center animate-bounce"
            style={{
              animationDuration: `${2.5 + i * 0.4}s`,
              animationDelay: `${i * 0.2}s`
            }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-t from-amber-600 to-yellow-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,1)]">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 fill-yellow-200 animate-pulse" />
            </div>
            <div className="w-8 h-2 bg-amber-900/60 rounded-full mt-0.5 border-t border-amber-600/40" />
          </div>
        ))}
      </div>

      {/* Central Sacred Cinematic Typography */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto space-y-4">
        {/* Stage 3: Title */}
        <div
          className={`transition-all duration-1000 transform ${
            stage >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mukta font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>छठ महापर्व २०२६</span>
          </div>
          <h1 className="font-rozha text-5xl sm:text-7xl md:text-8xl font-black tracking-wide gold-foil-text drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
            जय छठी मईया
          </h1>
        </div>

        {/* Stage 4: Subtitle */}
        <div
          className={`transition-all duration-1000 transform ${
            stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-mukta text-xl sm:text-3xl text-amber-200/90 font-medium tracking-wide">
            आस्था से अनुभव तक।
          </p>
          <p className="text-xs sm:text-sm font-mukta text-stone-400 mt-2">
            The National Digital Cultural Platform of Surya Arghya & Chhathi Maiya
          </p>
        </div>
      </div>

      {/* Control Buttons (Skip Intro & Sound Toggle) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {/* River Water Sound Toggle (Explicit user permission, no autoplay) */}
        <button
          onClick={toggleRiverSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/40 backdrop-blur-md transition-all shadow-lg"
          title="पवित्र गंगा जल ध्वनि (Toggle River Ambience)"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          <span className="hidden sm:inline">
            {soundEnabled ? 'गंगा जल ध्वनि चालू' : 'गंगा जल ध्वनि'}
          </span>
        </button>

        {/* Skip Intro Button */}
        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-600/90 hover:bg-amber-500 text-white border border-amber-400/50 backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 text-[10px] text-stone-500 font-mono tracking-wider">
        {prefersReducedMotion ? 'Reduced motion active' : 'Click Skip Intro anytime to enter'}
      </div>
    </div>
  );
};
