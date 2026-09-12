import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getVidhiSteps, getBeginnerGuide } from '../../data/vidhiData';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Droplet, 
  Flame, 
  Sunset, 
  Sunrise 
} from 'lucide-react';

export const PujaVidhi: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [beginnerGuideOpen, setBeginnerGuideOpen] = useState<boolean>(true);

  const rawSteps = getVidhiSteps(language);
  const beginnerGuide = getBeginnerGuide(language);

  const stepIcons = [
    { icon: Sparkles, color: 'text-amber-500' },
    { icon: Droplet, color: 'text-sky-500' },
    { icon: Flame, color: 'text-orange-500' },
    { icon: Sunset, color: 'text-red-500' },
    { icon: Sunrise, color: 'text-amber-400' },
    { icon: CheckCircle2, color: 'text-emerald-500' }
  ];

  const steps = rawSteps.map((st, i) => ({
    ...st,
    icon: stepIcons[i]?.icon || Sparkles,
    color: stepIcons[i]?.color || 'text-amber-500'
  }));

  const stepPrefix = language === 'en' ? 'Step' : language === 'bho' ? 'चरण' : language === 'mai' ? 'चरण' : 'चरण';
  const rulesLabel = language === 'en' ? 'Key Rituals & Rules:' : language === 'bho' ? 'मुख्य नियम आ बिधि:' : language === 'mai' ? 'मुख्य नियम ओ विधि:' : 'महत्वपूर्ण नियम एवं प्रक्रिया:';

  return (
    <section id="vidhi" className="section-padding bg-gradient-to-b from-orange-500/5 via-amber-500/5 to-transparent">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.vidhiBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
            {t.vidhiSectionTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-200">
            {t.vidhiSubtitle}
          </p>
        </div>

        {/* Beginner-friendly "पूजा कैसे करें?" Accordion Box */}
        <div className="w-full max-w-6xl mx-auto mb-10 chhath-glass rounded-2xl border border-amber-500/30 overflow-hidden shadow-lg">
          <button
            onClick={() => setBeginnerGuideOpen(!beginnerGuideOpen)}
            className="w-full p-5 flex items-center justify-between text-left bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-mukta font-bold text-lg text-stone-900 dark:text-white">
                  {t.beginnerGuideTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-300 font-mukta">
                  {t.beginnerGuideSubtitle}
                </p>
              </div>
            </div>
            {beginnerGuideOpen ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
          </button>

          {beginnerGuideOpen && (
            <div className="p-6 pt-2 font-mukta text-sm text-stone-700 dark:text-stone-200 space-y-3 border-t border-amber-500/15">
              <p>
                {beginnerGuide.intro}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {beginnerGuide.points.map((pt, pIdx) => (
                  <div key={pIdx} className="p-3 rounded-xl bg-white dark:bg-stone-900/90 text-stone-800 dark:text-stone-200 border border-amber-500/20">
                    <strong className="text-orange-600 dark:text-amber-400 block mb-1">{pt.title}</strong>
                    <span>{pt.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step-by-Step Vidhi Timeline */}
        <div className="w-full max-w-6xl mx-auto space-y-4">
          {steps.map((st, idx) => {
            const isOpen = activeStep === idx;
            const Icon = st.icon;

            return (
              <div
                key={st.stepNumber}
                className={`chhath-card overflow-hidden transition-all border ${
                  isOpen ? 'border-orange-500 shadow-xl ring-1 ring-orange-400/50' : 'border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <button
                  onClick={() => setActiveStep(isOpen ? -1 : idx)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center ${st.color} shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-600 dark:text-amber-400 uppercase tracking-wider">
                          {stepPrefix} 0{st.stepNumber} • {st.time}
                        </span>
                      </div>
                      <h3 className="font-mukta font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                        {st.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-stone-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-6 pt-0 border-t border-amber-500/10 font-mukta space-y-4">
                    <p className="text-sm text-stone-600 dark:text-stone-200 italic">
                      {st.description}
                    </p>

                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-300">
                        {rulesLabel}
                      </span>
                      <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-100">
                        {st.instructions.map((inst, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

