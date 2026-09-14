import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const CountdownCard: React.FC = () => {
  const { language, t } = useLanguage();

  const fourDaysSummaryByLang = {
    hi: [
      { title: "नहाय खाय", date: "13 नवंबर 2026", desc: "सात्विक शुरुआत व कद्दू-भात", day: "शुक्रवार" },
      { title: "खरना पूजा", date: "14 नवंबर 2026", desc: "गुड़ रसियाव व 36h निर्जला व्रत", day: "शनिवार" },
      { title: "संध्या अर्घ्य", date: "15 नवंबर 2026", desc: "अस्ताचलगामी सूर्य को अर्घ्य", day: "रविवार", active: true },
      { title: "उषा अर्घ्य", date: "16 नवंबर 2026", desc: "उदीयमान सूर्य व महा पारण", day: "सोमवार" }
    ],
    en: [
      { title: "Nahay Khay", date: "13 Nov 2026", desc: "Purification & holy feast", day: "Friday" },
      { title: "Kharna Puja", date: "14 Nov 2026", desc: "Jaggery kheer & 36h fast", day: "Saturday" },
      { title: "Sandhya Arghya", date: "15 Nov 2026", desc: "Offering to setting sun", day: "Sunday", active: true },
      { title: "Usha Arghya", date: "16 Nov 2026", desc: "Rising sun & conclusion", day: "Monday" }
    ],
    bho: [
      { title: "नहाय खाय", date: "13 नवंबर 2026", desc: "सात्विक सुरुआत आ कद्दू-भात", day: "शुक" },
      { title: "खरना पूजा", date: "14 नवंबर 2026", desc: "गुड़ रसियाव आ 36h बरत", day: "सनीचर" },
      { title: "सँझिया अरघ", date: "15 नवंबर 2026", desc: "डूबत सुरुज के अरघ", day: "इतवार", active: true },
      { title: "भोरहरिया अरघ", date: "16 नवंबर 2026", desc: "उगत सुरुज आ महा पारन", day: "सोमार" }
    ],
    mai: [
      { title: "नहाय खाय", date: "13 नवं 2026", desc: "पवित्र स्नान ओ कद्दू-भात", day: "शुक्र" },
      { title: "खरना पूजा", date: "14 नवं 2026", desc: "गुड़क रसियाव ओ 36h उपवास", day: "शनि" },
      { title: "साँझक अर्घ्य", date: "15 नवं 2026", desc: "अस्ताचलगामी सूर्यकेँ अर्घ्य", day: "रवि", active: true },
      { title: "उषा अर्घ्य", date: "16 नवं 2026", desc: "उदित सूर्य ओ महा पारण", day: "सोम" }
    ],
    mag: [
      { title: "नहाय खाय", date: "13 नवंबर 2026", desc: "सात्विक सुरुआत व कद्दू-भात", day: "शुक" },
      { title: "खरना पूजा", date: "14 नवंबर 2026", desc: "गुड़ रसियाव व 36h बरत", day: "शनि" },
      { title: "संध्या अर्घ्य", date: "15 नवंबर 2026", desc: "डूबत सुरुज के अर्घ्य", day: "इतवार", active: true },
      { title: "उषा अर्घ्य", date: "16 नवंबर 2026", desc: "उगत सुरुज व महा पारण", day: "सोमार" }
    ]
  };

  const fourDaysSummary = fourDaysSummaryByLang[language] || fourDaysSummaryByLang.hi;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-13T06:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="royal-card-luxury rounded-3xl p-4 sm:p-9 shadow-2xl border border-amber-400/50 w-full max-w-5xl mx-auto backdrop-blur-2xl relative overflow-hidden">
      
      {/* Traditional Auspicious Corner Emblems */}
      <div className="absolute top-2.5 left-3 text-amber-400/40 text-xs font-serif select-none pointer-events-none">卐</div>
      <div className="absolute top-2.5 right-3 text-amber-400/40 text-xs font-serif select-none pointer-events-none">卐</div>
      <div className="absolute bottom-2.5 left-3 text-amber-400/40 text-xs font-serif select-none pointer-events-none">卐</div>
      <div className="absolute bottom-2.5 right-3 text-amber-400/40 text-xs font-serif select-none pointer-events-none">卐</div>
      
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-amber-500/25">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md flex items-center justify-center">
            <Clock className="w-4 h-4 text-stone-950 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mukta font-bold tracking-[0.2em] text-amber-600 dark:text-amber-400 block">
              {language === 'en' ? 'VEDIC ASTROLOGICAL HOROLOGIUM' : 'वैदिक पंचांग एवं समय गणना'}
            </span>
            <h3 className="font-rozha text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-bold">
              {t.countdownTitle}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-xs font-bold text-amber-700 dark:text-amber-300 swarna-gold-sheen">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-yellow-300" />
          <span>कार्तिक मास महासंयोग 2026</span>
        </div>
      </div>

      {/* Countdown Digits in 24K Gold Metallic Bevel Pods */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-5 my-5 sm:my-7 text-center">
        
        {/* Days */}
        <div className="p-2 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-stone-900/80 to-stone-950 border border-amber-400/40 shadow-2xl relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent"></div>
          <span className="font-rozha text-2xl sm:text-5xl md:text-6xl font-black gold-foil-text block tracking-wider group-hover:scale-105 transition-transform">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-sm font-mukta font-bold text-amber-200 mt-1 sm:mt-1.5 block uppercase tracking-wider truncate">
            {t.daysRemaining}
          </span>
        </div>

        {/* Hours */}
        <div className="p-2 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-stone-900/80 to-stone-950 border border-amber-400/40 shadow-2xl relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent"></div>
          <span className="font-rozha text-2xl sm:text-5xl md:text-6xl font-black gold-foil-text block tracking-wider group-hover:scale-105 transition-transform">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-sm font-mukta font-bold text-amber-200 mt-1 sm:mt-1.5 block uppercase tracking-wider truncate">
            {t.hours}
          </span>
        </div>

        {/* Minutes */}
        <div className="p-2 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-stone-900/80 to-stone-950 border border-amber-400/40 shadow-2xl relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent"></div>
          <span className="font-rozha text-2xl sm:text-5xl md:text-6xl font-black gold-foil-text block tracking-wider group-hover:scale-105 transition-transform">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-sm font-mukta font-bold text-amber-200 mt-1 sm:mt-1.5 block uppercase tracking-wider truncate">
            {t.minutes}
          </span>
        </div>

        {/* Seconds */}
        <div className="p-2 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-stone-900/80 to-stone-950 border border-amber-400/40 shadow-2xl relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent"></div>
          <span className="font-rozha text-2xl sm:text-5xl md:text-6xl font-black gold-foil-text block tracking-wider group-hover:scale-105 transition-transform">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-sm font-mukta font-bold text-amber-200 mt-1 sm:mt-1.5 block uppercase tracking-wider truncate">
            {t.seconds}
          </span>
        </div>

      </div>

      {/* 4 Days Interactive Highlights with Royal Metallic Trims */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {fourDaysSummary.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all text-left relative overflow-hidden ${
              item.active 
                ? 'bg-gradient-to-br from-amber-500/25 to-amber-100/60 dark:to-stone-900 border-amber-500 dark:border-amber-400 shadow-lg ring-1 ring-amber-400/60' 
                : 'bg-stone-100/90 dark:bg-stone-900/70 border-amber-500/25 hover:border-amber-400/50 hover:bg-amber-50/50 dark:hover:bg-stone-850'
            }`}
          >
            {item.active && (
              <div className="absolute -top-6 -right-6 w-14 h-14 bg-amber-400/20 rounded-full blur-sm"></div>
            )}
            <div className="flex items-center justify-between text-xs mb-1 font-bold text-amber-700 dark:text-amber-300">
              <span className="uppercase tracking-wider">{item.day}</span>
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="font-mukta font-bold text-sm text-stone-900 dark:text-stone-100 leading-tight">
              {item.title}
            </h4>
            <div className="text-[11px] text-amber-800 dark:text-amber-300/80 font-mukta mt-0.5 font-semibold">
              {item.date}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 font-mukta mt-1 line-clamp-1">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
