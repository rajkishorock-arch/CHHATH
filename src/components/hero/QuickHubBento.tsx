import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { cityArghyaData } from '../../data/astronomy';
import { chhathSamagriList } from '../../data/samagri';
import { 
  Sparkles, 
  Calendar, 
  Sunset, 
  Sunrise, 
  Music, 
  Play, 
  Pause, 
  CheckCircle2, 
  MapPin, 
  ArrowUpRight, 
  Award, 
  Flame, 
  Radio, 
  Compass 
} from 'lucide-react';

export const QuickHubBento: React.FC = () => {
  const { t } = useLanguage();
  const { currentSong, isPlaying, togglePlay } = useAudio();
  const { ghats } = useChhathData();
  const [patnaIdx] = useState(0); // Patna is index 0
  const arghyaCity = cityArghyaData[patnaIdx] || cityArghyaData[0];

  // Samagri checklist progress
  const [checkedCount, setCheckedCount] = useState(0);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chhath_samagri_checked');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCheckedCount(Array.isArray(parsed) ? parsed.length : 0);
      }
    } catch {
      setCheckedCount(0);
    }
  }, []);

  const totalSamagri = chhathSamagriList.length;
  const samagriPercent = Math.round((checkedCount / totalSamagri) * 100);

  return (
    <section id="bento-hub" className="py-8 relative z-20 overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900/60 to-transparent">
      <div className="container-custom">
        
        {/* Royal Hub Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 animate-ping shadow-[0_0_10px_rgba(250,204,21,0.9)]"></div>
            <span className="font-rozha text-2xl sm:text-3xl font-black text-stone-100 flex items-center gap-2.5">
              <span className="gold-foil-text">छठ महापर्व त्वरित सेवा हब</span>
              <span className="text-sm font-mukta font-bold uppercase tracking-widest text-amber-300/80 hidden sm:inline">(ROYAL COMMAND CENTER)</span>
            </span>
          </div>
          <span className="badge-royal swarna-gold-sheen w-fit">
            कार्तिक मास 2026 • वास्तविक समय सूचना पटल
          </span>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          
          {/* Card 1 (Wide): Live Tithi & Festival Phase */}
          <div className="lg:col-span-2 royal-card-luxury p-6 sm:p-7 rounded-3xl border-amber-400/50 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-yellow-300 fill-amber-400 animate-diya-flicker" />
                  <span>पवित्र अनुष्ठान चरण • SACRED VEDIC PHASES</span>
                </div>
                <h3 className="font-rozha text-2xl sm:text-4xl text-stone-100 font-bold gold-foil-text">
                  चार दिवसीय पावन महापर्व चक्र
                </h3>
                <p className="text-xs sm:text-sm font-mukta text-stone-200 mt-2 max-w-xl leading-relaxed">
                  नहाय-खाय (13 नव.), खरना (14 नव.), संध्या अर्घ्य (15 नव.) एवं उषा अर्घ्य व पारण (16 नव.) — 36 घंटे का अखंड निर्जला तप।
                </p>
              </div>

              <div className="shrink-0 p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-stone-900 border border-amber-400/40 text-center hidden sm:block shadow-lg">
                <Calendar className="w-6 h-6 text-amber-300 mx-auto mb-1" />
                <span className="text-xs font-black text-amber-200 block tracking-wider">13-16 NOV</span>
                <span className="text-[10px] text-amber-400/80 font-bold">2026</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-amber-500/25">
              <a href="#timeline" className="p-3 rounded-xl bg-stone-900/80 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-400 text-left transition-colors text-decoration-none shadow-sm">
                <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">दिवस 1</span>
                <span className="text-sm font-bold text-stone-100 block">नहाय-खाय</span>
                <span className="text-[11px] text-stone-300">कद्दू-भात</span>
              </a>
              <a href="#timeline" className="p-3 rounded-xl bg-stone-900/80 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-400 text-left transition-colors text-decoration-none shadow-sm">
                <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">दिवस 2</span>
                <span className="text-sm font-bold text-stone-100 block">खरना</span>
                <span className="text-[11px] text-stone-300">गुड़ रसियाव</span>
              </a>
              <a href="#timeline" className="p-3 rounded-xl bg-gradient-to-br from-amber-600/30 to-stone-900 border border-amber-400 text-left transition-colors text-decoration-none shadow-md ring-1 ring-amber-300/50">
                <span className="text-[10px] text-yellow-300 font-bold block uppercase tracking-wider">दिवस 3</span>
                <span className="text-sm font-bold text-white block">संध्या अर्घ्य</span>
                <span className="text-[11px] text-amber-200">पहला अर्घ्य</span>
              </a>
              <a href="#timeline" className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/25 to-stone-900 border border-amber-400 text-left transition-colors text-decoration-none shadow-md ring-1 ring-amber-300/50">
                <span className="text-[10px] text-yellow-300 font-bold block uppercase tracking-wider">दिवस 4</span>
                <span className="text-sm font-bold text-white block">उषा अर्घ्य</span>
                <span className="text-[11px] text-amber-200">पारण व आशीष</span>
              </a>
            </div>
          </div>

          {/* Card 2: Live Astronomical Arghya Sun Widget */}
          <div className="royal-card-luxury p-6 rounded-3xl border-amber-400/40 shadow-2xl flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-amber-300" />
                  <span>अर्घ्य मुहूर्त (सूर्य घटी)</span>
                </span>
                <span className="badge-royal text-[10px] py-0.5 px-2">
                  {arghyaCity.cityName.split('(')[0]}
                </span>
              </div>

              <div className="space-y-3 my-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-red-500/15 via-orange-500/10 to-stone-900 border border-red-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sunset className="w-5 h-5 text-red-400" />
                    <div>
                      <span className="text-xs font-bold text-stone-100 block">संध्या अर्घ्य (Sunset)</span>
                      <span className="text-[10px] text-stone-400">15 नवंबर 2026</span>
                    </div>
                  </div>
                  <span className="font-rozha text-xl text-red-400 font-bold">{arghyaCity.sandhyaSunset}</span>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-stone-900 border border-amber-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sunrise className="w-5 h-5 text-amber-300" />
                    <div>
                      <span className="text-xs font-bold text-stone-100 block">उषा अर्घ्य (Sunrise)</span>
                      <span className="text-[10px] text-stone-400">16 नवंबर 2026</span>
                    </div>
                  </div>
                  <span className="font-rozha text-xl text-amber-300 font-bold">{arghyaCity.ushaSunrise}</span>
                </div>
              </div>
            </div>

            <a
              href="#arghya-times"
              className="inline-flex items-center justify-between text-xs font-bold text-amber-300 hover:text-white pt-3 border-t border-amber-500/25 text-decoration-none group-hover:translate-x-0.5 transition-all"
            >
              <span className="uppercase tracking-wider">11+ शहरों के सटीक मुहूर्त देखें</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>

          {/* Card 3: Sacred Devotional Audio Player Card */}
          <div className="royal-card-luxury p-6 rounded-3xl border-amber-400/40 shadow-2xl flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-amber-300" />
                  <span>भक्ति संगीत प्लेयर</span>
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse" />
                    लाइव चालू
                  </span>
                )}
              </div>

              {/* Vinyl Graphic & Track Details */}
              <div className="flex items-center gap-3.5 my-3">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-stone-900 to-amber-700 p-1 shrink-0 shadow-xl border border-yellow-300/30">
                  <div className={`w-full h-full rounded-full border-2 border-amber-400/50 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200"></div>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <span className="text-sm font-bold text-stone-100 block truncate">
                    {currentSong?.title || 'पवन सिंह व शारदा सिन्हा - छठ गीत'}
                  </span>
                  <span className="text-xs text-amber-300/80 font-mukta block truncate mt-0.5">
                    {currentSong?.singer || 'पारंपरिक लोक धुन'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-amber-500/25">
              <button
                onClick={togglePlay}
                className="btn-royal-gold text-xs py-2 px-4"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'गीत रोकें' : 'गीत बजाएं'}</span>
              </button>

              <a
                href="#songs"
                className="text-xs font-bold text-amber-300 hover:text-white text-decoration-none flex items-center gap-1 uppercase tracking-wider"
              >
                <span>गीत सूची</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 4: Puja Samagri Checklist Tracker */}
          <div className="royal-card-luxury p-6 rounded-3xl border-amber-400/40 shadow-2xl flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>सामग्री तैयारी ट्रैकर</span>
                </span>
                <span className="badge-royal text-[10px] py-0.5 px-2">
                  {checkedCount}/{totalSamagri} पूर्ण
                </span>
              </div>

              {/* Progress bar and metrics */}
              <div className="space-y-2.5 my-3">
                <div className="flex items-center justify-between text-xs font-mukta">
                  <span className="text-stone-300">दौरा, सूप, ठेकुआ सामग्री</span>
                  <span className="text-amber-300 font-bold">{samagriPercent}% पूर्ण</span>
                </div>
                <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-amber-500/30">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.7)]"
                    style={{ width: `${samagriPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-stone-300 font-mukta">
                  {samagriPercent === 100 ? 'उत्कृष्ट! समस्त पूजन सामग्री पूर्ण रूप से तैयार है।' : `${totalSamagri - checkedCount} सामग्री अभी भी जाँचना शेष है।`}
                </p>
              </div>
            </div>

            <a
              href="#samagri"
              className="inline-flex items-center justify-between text-xs font-bold text-amber-300 hover:text-white pt-3 border-t border-amber-500/25 text-decoration-none group-hover:translate-x-0.5 transition-all uppercase tracking-wider"
            >
              <span>पूरी चेकलिस्ट खोलें व प्रिंट करें</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>

          {/* Card 5: Ghat Finder & Live Crowd Indicator */}
          <div className="royal-card-luxury p-6 rounded-3xl border-amber-400/40 shadow-2xl flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>पवित्र घाट व सुरक्षा रडार</span>
                </span>
                <span className="badge-royal text-[10px] py-0.5 px-2">
                  {ghats.length}+ घाट सूचीबद्ध
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-950 border border-emerald-500/30 my-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-stone-100 font-bold">{ghats[0]?.name || 'दीघा घाट (पटना)'}</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40">सुरक्षित तट</span>
                </div>
                <span className="text-xs text-stone-300 block font-mukta">
                  {ghats[0]?.city} • {ghats[0]?.river} • पार्किंग व प्रकाश व्यवस्था
                </span>
              </div>
            </div>

            <a
              href="#ghats"
              className="inline-flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-amber-500/25 text-decoration-none group-hover:translate-x-0.5 transition-all uppercase tracking-wider"
            >
              <span>निकटतम घाट खोजें</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
