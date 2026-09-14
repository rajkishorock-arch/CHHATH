import React, { useState } from 'react';
import { getChhathDays } from '../../data/days';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Utensils, Heart, CheckCircle2, ChevronRight, Calendar } from 'lucide-react';

export const FourDaysTimeline: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const days = getChhathDays(language);
  const currentDay = days[activeDayIdx] || days[0];

  return (
    <section id="timeline" className="section-padding bg-gradient-to-b from-amber-500/5 via-transparent to-orange-500/5 relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="badge-saffron">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.timelineBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
            {t.timelineTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-200">
            {t.timelineSubtitle}
          </p>
          <div className="mt-4 mx-auto max-w-3xl text-center">
            <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-200">
             <strong>छठ महापर्व 2026:</strong> नहाय-खाय — 13 नवंबर, खरना — 14 नवंबर,
                संध्या अर्घ्य — 15 नवंबर, उषा अर्घ्य एवं पारण — 16 नवंबर।
            </p>
         </div>
        </div>

        {/* 4 Days Step Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {days.map((day, idx) => {
            const isSelected = activeDayIdx === idx;
            return (
              <button
                key={day.id}
                onClick={() => setActiveDayIdx(idx)}
                className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 text-white shadow-xl shadow-orange-500/30 border-amber-300 scale-[1.02] ring-2 ring-amber-400/40'
                    : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-amber-500/20 hover:border-amber-500/50 hover:bg-orange-500/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 opacity-90 font-bold">
                  <span className="flex items-center gap-1">
                    {isSelected && (
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-200 animate-diya-flicker"></span>
                    )}
                    <span>दिवस 0{day.dayNumber}</span>
                  </span>
                  <span className="text-[11px] font-mukta">{day.tithi}</span>
                </div>
                <div className="font-rozha text-lg sm:text-xl font-bold leading-tight flex items-center justify-between">
                  <span>{day.title.split(':')[1] || day.title}</span>
                  {isSelected && (
                    <span className="text-sm text-yellow-300 animate-diya-flicker">🪔</span>
                  )}
                </div>
                <div className={`text-xs mt-1.5 font-mukta flex items-center gap-1 ${isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{day.date2026.split('(')[0]}</span>
                </div>
                {isSelected && (
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-300/20 rounded-full blur-md"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Day Detail Card */}
        <div className="chhath-card p-6 sm:p-10 border-amber-500/30 shadow-2xl relative paramprik-border overflow-hidden">
          {/* Traditional Auspicious Corner Symbols */}
          <div className="absolute top-2.5 left-3 text-amber-500/30 text-xs select-none pointer-events-none">卐</div>
          <div className="absolute top-2.5 right-3 text-amber-500/30 text-xs select-none pointer-events-none">卐</div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Overview & Tithi */}
            <div className="lg:w-1/3 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-700 dark:text-amber-300 text-xs font-bold">
                <span>{t.daySignificance} 0{currentDay.dayNumber}</span>
              </div>
              <h3 className="font-rozha text-2xl sm:text-3xl text-stone-900 dark:text-white font-bold">
                {currentDay.title}
              </h3>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mukta text-stone-700 dark:text-stone-200">
                <strong className="text-orange-600 dark:text-amber-400 block mb-0.5">{t.dateAndTithi}</strong>
                {currentDay.date2026} • {currentDay.tithi}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-mukta font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{t.meaningAndSignificance}</span>
                </h4>
                <p className="font-mukta text-sm text-stone-600 dark:text-stone-200 leading-relaxed">
                  {currentDay.meaning}
                </p>
              </div>

              {/* Day Visual Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/20">
                <span className="text-xs font-bold text-orange-600 dark:text-amber-400 block mb-1">
                  {t.coreObjective}
                </span>
                <p className="text-xs font-mukta text-stone-700 dark:text-stone-300">
                  {currentDay.importance}
                </p>
              </div>
            </div>

            {/* Right Column: Step by step rituals & Sacred Prasad */}
            <div className="lg:w-2/3 space-y-6">
              
              {/* Rituals list */}
              <div>
                <h4 className="font-mukta font-bold text-base text-stone-900 dark:text-white flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{t.ritualsAndRules}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentDay.rituals.map((ritual, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {rIdx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-mukta text-stone-700 dark:text-stone-200 leading-snug">
                        {ritual}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food & Prasad Breakdown */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <h4 className="font-mukta font-bold text-sm sm:text-base text-stone-900 dark:text-white flex items-center gap-2 mb-2">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  <span>{t.prasadAndDiet}</span>
                </h4>
                <p className="text-xs sm:text-sm font-mukta text-stone-700 dark:text-stone-200 leading-relaxed">
                  {currentDay.food}
                </p>
              </div>

              {/* Quick Next Day CTA */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveDayIdx((activeDayIdx + 1) % days.length)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-amber-400 hover:text-orange-700"
                >
                  <span>{t.nextDayBtn}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
