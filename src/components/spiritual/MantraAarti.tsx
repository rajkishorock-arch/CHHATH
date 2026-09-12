import React, { useState } from 'react';
import { chhathMantrasData } from '../../data/mantras';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Copy, Check, Volume2, Flame } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const MantraAarti: React.FC = () => {
  const { t } = useLanguage();
  const { ringBell } = useAudio();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (mantraText: string, id: string) => {
    navigator.clipboard.writeText(mantraText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="mantras" className="section-padding relative overflow-hidden bg-gradient-to-b from-orange-500/5 via-transparent to-amber-500/5">
      
      {/* Devotional Background Watermark */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="badge-saffron">
            <Flame className="w-4 h-4 text-orange-500 animate-diya-flicker" />
            <span>{t.mantraBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.mantraTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            {t.mantraSubtitle}
          </p>
        </div>

        {/* Mantras & Aarti Cards Grid */}
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {chhathMantrasData.map((m) => {
            const isCopied = copiedId === m.id;

            return (
              <div
                key={m.id}
                className="chhath-card p-6 sm:p-8 border-amber-500/30 shadow-xl relative overflow-hidden space-y-5 paramprik-border"
              >
                {/* Traditional Auspicious Corner Symbols */}
                <div className="absolute top-2.5 left-3 text-amber-500/30 text-xs font-serif select-none pointer-events-none">ॐ</div>
                <div className="absolute top-2.5 right-3 text-amber-500/30 text-xs font-serif select-none pointer-events-none">ॐ</div>
                
                {/* Header with Deity & Copy Button */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 animate-diya-flicker text-lg">🪔</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400 block">
                        {m.deity}
                      </span>
                      <h3 className="font-rozha text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-bold">
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={ringBell}
                      title="घंटी बजाएं (Ring Sacred Bell)"
                      className="p-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 transition-transform hover:scale-110 active:scale-95 group"
                    >
                      <span className="inline-block group-hover:animate-bell-sway text-base">🔔</span>
                    </button>

                    <button
                      onClick={() => handleCopy(`${m.title}\n\n${m.sanskrit}\n\nभावार्थ:\n${m.hindiMeaning}`, m.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-orange-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">कॉपी हो गया!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>मंत्र कॉपी करें</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sacred Sanskrit Text */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
                  <p className="font-mukta text-lg sm:text-xl font-bold text-orange-700 dark:text-amber-300 whitespace-pre-line leading-relaxed text-center">
                    {m.sanskrit}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="text-xs italic text-stone-500 dark:text-stone-400 font-mukta whitespace-pre-line text-center">
                  {m.transliteration}
                </div>

                {/* Hindi Meaning */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 font-mukta">
                  <strong className="text-xs font-bold text-orange-600 dark:text-amber-400 block mb-1">
                    सरल हिंदी भावार्थ (Meaning):
                  </strong>
                  <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
                    {m.hindiMeaning}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
