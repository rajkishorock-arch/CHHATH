import React, { useState } from 'react';
import { Flame, Sparkles, Heart, Globe, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useChhathData } from '../../context/ChhathDataContext';
import confetti from 'canvas-confetti';

interface CountryStat {
  country: string;
  flag: string;
  count: number;
}

const GLOBAL_STATS: CountryStat[] = [
  { country: 'भारत (India)', flag: '🇮🇳', count: 12482 },
  { country: 'संयुक्त राज्य अमेरिका (USA)', flag: '🇺🇸', count: 3410 },
  { country: 'संयुक्त अरब अमीरात (UAE)', flag: '🇦🇪', count: 1890 },
  { country: 'यूनाइटेड किंगडम (UK)', flag: '🇬🇧', count: 1240 },
  { country: 'कनाडा (Canada)', flag: '🇨🇦', count: 1510 },
  { country: 'ऑस्ट्रेलिया (Australia)', flag: '🇦🇺', count: 980 },
  { country: 'नेपाल (Nepal)', flag: '🇳🇵', count: 4200 },
  { country: 'मॉरीशस (Mauritius)', flag: '🇲🇺', count: 760 }
];

export const VirtualDiyaExperience: React.FC = () => {
  const { virtualDiyas, totalGlobalDiyas, lightVirtualDiya, userLocation } = useChhathData();
  
  const [dedicationFor, setDedicationFor] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isLit, setIsLit] = useState(false);
  const [blessingPopup, setBlessingPopup] = useState<string | null>(null);

  const handleLightDiya = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDedication = dedicationFor.trim() || 'मेरे समस्त परिवार के कल्याण व सुख-शांति हेतु';
    const finalName = senderName.trim() || 'श्रद्धालु';

    lightVirtualDiya({
      dedicationFor: finalDedication,
      senderName: finalName,
      city: userLocation.city
    });

    setIsLit(true);
    setBlessingPopup(`यह दीप ${finalDedication} की सुख-शांति व आरोग्य के लिए प्रज्वलित हो चुका है। जय छठी मईया 🙏`);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#ea580c', '#fef08a']
    });

    setDedicationFor('');
  };

  return (
    <section id="virtual-diya-wall" className="section-padding relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-black text-white">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>अखंड पावन दीप दान (Virtual Diya & Global Wall)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold gold-foil-text">
            अपना डिजिटल दिया जलाएं 🪔
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-300">
            छठी मईया व सूर्य देव के चरणों में अपने परिवार, इष्ट मित्रों या लोक-कल्याण हेतु पावन दीप प्रज्वलित करें।
          </p>
        </div>

        {/* Interactive Diya Kindling Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Interactive Diya Altar */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl bg-stone-900/80 border border-amber-500/30 shadow-2xl relative overflow-hidden text-center">
            
            {/* Ambient Radial Golden Aura */}
            <div className={`absolute inset-0 bg-gradient-to-t from-amber-600/20 via-orange-600/10 to-transparent transition-opacity duration-1000 ${isLit ? 'opacity-100' : 'opacity-40'}`} />

            {/* Glowing Clay Diya Graphic */}
            <div className="relative my-6 cursor-pointer group" onClick={() => setIsLit(!isLit)}>
              {/* Flame Glow */}
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-amber-500/30 blur-2xl absolute -top-8 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${isLit ? 'opacity-100 scale-125' : 'opacity-40'}`} />
              
              {/* Diya Flame */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-12 sm:w-10 sm:h-16 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 shadow-[0_0_35px_rgba(251,191,36,1)] transition-transform duration-300 animate-diya-flicker ${isLit ? 'scale-110' : 'scale-90 opacity-75'}`} />
                {/* Clay Diya Base */}
                <div className="w-32 sm:w-40 h-8 sm:h-10 bg-gradient-to-r from-amber-900 via-stone-800 to-amber-950 rounded-b-full border-t-2 border-amber-500 shadow-xl mt-[-4px]" />
                <div className="w-40 sm:w-48 h-3 bg-amber-950/80 rounded-full mt-1 border-t border-amber-600/40" />
              </div>

              <span className="text-[11px] font-mukta text-amber-300 mt-3 inline-block">
                {isLit ? '✨ दीप प्रज्वलित है' : '👆 दीये पर टैप करके प्रज्वलित करें'}
              </span>
            </div>

            {/* Dedication Form */}
            <form onSubmit={handleLightDiya} className="w-full space-y-3 relative z-10">
              <div className="text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  यह दीप किसके लिए? (Dedicate this Diya for):
                </label>
                <input
                  type="text"
                  placeholder="उदा. मेरे परिवार के आरोग्य व सुख-शांति के लिए..."
                  value={dedicationFor}
                  onChange={e => setDedicationFor(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-950/90 border border-amber-500/30 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  आपका शुभ नाम (Your Name):
                </label>
                <input
                  type="text"
                  placeholder="उदा. अमित कुमार सिंह (वैकल्पिक)..."
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-stone-950/90 border border-amber-500/30 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-rozha text-base sm:text-lg font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 text-stone-950 shadow-xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Flame className="w-5 h-5 fill-stone-950" />
                <span>पावन दीप अर्पित करें (Light Diya)</span>
              </button>
            </form>

            {/* Blessing Message Confirmation */}
            {blessingPopup && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-xs font-mukta text-amber-200 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{blessingPopup}</span>
              </div>
            )}

          </div>

          {/* Right Column: Global Diya Wall & Real-time Live Counters */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Real Counter Ribbon */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400 block">
                      वैश्विक डिजिटल दीप गणना
                    </span>
                    <div className="font-rozha text-3xl sm:text-4xl font-black text-amber-400">
                      {totalGlobalDiyas.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <span>लाइव सक्रिय</span>
                </span>
              </div>
              <p className="text-xs font-mukta text-stone-400 mt-3">
                “आज <strong>{totalGlobalDiyas.toLocaleString('en-IN')}</strong> श्रद्धालुओं ने डिजिटल दीप जलाकर छठी मईया को नमन किया।”
              </p>
            </div>

            {/* Country Participation Distribution */}
            <div className="p-6 rounded-3xl bg-stone-900/60 border border-amber-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-3">
                वैश्विक भागीदारी (Global Participation):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GLOBAL_STATS.map(stat => (
                  <div key={stat.country} className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-center">
                    <span className="text-xl block mb-1">{stat.flag}</span>
                    <span className="text-xs font-bold text-stone-200 block truncate">{stat.country.split('(')[0]}</span>
                    <span className="text-xs font-mono text-amber-400 font-bold">{stat.count.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Devotee Dedications Stream */}
            <div className="p-6 rounded-3xl bg-stone-900/60 border border-amber-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  गंगा तट पर तैरते हालिया दीप:
                </span>
                <span className="text-[10px] text-stone-500">लाइव अपडेट</span>
              </div>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {virtualDiyas.slice(0, 4).map(d => (
                  <div key={d.id} className="p-3 rounded-xl bg-stone-950/80 border border-amber-500/20 flex items-start gap-3">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-200">{d.senderName} ({d.city})</span>
                        <span className="text-[10px] text-stone-500">{d.timestamp}</span>
                      </div>
                      <p className="text-amber-300 font-mukta mt-0.5">"{d.dedicationFor}"</p>
                      <p className="text-[10px] text-stone-400 font-mukta mt-0.5">{d.blessingMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
