import React, { useState } from 'react';
import { Compass, ChevronRight, CheckCircle2, Heart, HelpCircle, Sun, Sparkles, BookOpen } from 'lucide-react';

interface StepGuide {
  step: number;
  title: string;
  hindiTitle: string;
  desc: string;
  keyRule: string;
  materials: string[];
}

const BEGINNER_STEPS: StepGuide[] = [
  {
    step: 1,
    title: 'What is Chhath Mahaparv?',
    hindiTitle: '१. छठ महापर्व क्या है?',
    desc: 'छठ प्रत्यक्ष देवता भगवान सूर्य और उनकी बहन षष्ठी मैया (छठी मईया) को समर्पित लोक आस्था का महापर्व है। इसमें किसी मूर्ति की पूजा नहीं होती, बल्कि साक्षात प्रकृति, सूर्य, जल और वायु का आभार व्यक्त किया जाता है।',
    keyRule: 'यह पर्व पूर्ण शुद्धता, अहिंसा, मानसिक पवित्रता और सादगी पर आधारित है।',
    materials: ['शुद्ध मन', 'पारिवारिक सहयोग', 'प्रकृति के प्रति कृतज्ञता']
  },
  {
    step: 2,
    title: 'What is Nahay Khay? (Day 1)',
    hindiTitle: '२. नहाय-खाय क्या है? (प्रथम दिवस)',
    desc: 'नहाय-खाय से पर्व की शुद्धि शुरू होती है। व्रती पवित्र नदी या घर पर गंगाजल युक्त जल से स्नान करते हैं। घर की संपूर्ण सफाई होती है।',
    keyRule: 'सेंधा नमक, शुद्ध घी में बना कद्दू-भात (लौकी की सब्जी व अरवा चावल) और चने की दाल ही ग्रहण की जाती है।',
    materials: ['कद्दू (लौकी)', 'अरवा चावल', 'चने की दाल', 'सेंधा नमक', 'शुद्ध घी']
  },
  {
    step: 3,
    title: 'What is Kharna? (Day 2)',
    hindiTitle: '३. खरना क्या है? (द्वितीय दिवस)',
    desc: 'दिन भर व्रती निर्जला उपवास रखते हैं। सायं काल मिट्टी के नए चूल्हे और आम की लकड़ी पर शुद्ध गुड़ और गाय के दूध की खीर (रसियाव) और रोटी बनाई जाती है।',
    keyRule: 'भोग लगाने के बाद व्रती बिल्कुल एकांत व शांत माहौल में प्रसाद पाते हैं। इसके बाद ३६ घंटे का निर्जला व्रत शुरू हो जाता है।',
    materials: ['नया मिट्टी का चूल्हा', 'आम की लकड़ी', 'गुड़', 'गाय का दूध', 'नया गेहूं का आटा']
  },
  {
    step: 4,
    title: 'What happens at Sandhya Arghya? (Day 3)',
    hindiTitle: '४. संध्या अर्घ्य में क्या होता है? (तृतीय दिवस)',
    desc: 'सायंकाल संपूर्ण परिवार के साथ नदी या सरोवर के तट पर जाते हैं। बांस के सूप में ठेकुआ, मौसमी फल रखकर कमर तक पानी में खड़े होकर डूबते (अस्ताचलगामी) सूर्य को अर्घ्य दिया जाता है।',
    keyRule: 'संसार में केवल छठ ही ऐसा पर्व है जहाँ अस्त होते सूर्य को भी प्रथम नमन किया जाता है।',
    materials: ['बांस का दउरा', 'सूप', 'ठेकुआ', 'ईख (गन्ना)', 'मौसमी फल', 'दीपक']
  },
  {
    step: 5,
    title: 'What happens at Usha Arghya? (Day 4)',
    hindiTitle: '५. उषा अर्घ्य व पारण (चतुर्थ दिवस)',
    desc: 'चौथे दिन सूर्योदय से पूर्व ही सभी श्रद्धालु पुनः घाट पर उपस्थित होते हैं। उगते हुए भगवान भुवन भास्कर को दूसरा अर्घ्य समर्पित किया जाता है।',
    keyRule: 'अर्घ्य संपन्न होने के बाद व्रती अदरक, कच्चा दूध व शरबत पीकर ३६ घंटे के तप का पारण करते हैं और सभी को ठेकुआ प्रसाद बांटते हैं।',
    materials: ['कच्चा गाय का दूध', 'गंगाजल कलश', 'अदरक', 'प्रसाद थाल']
  }
];

export const MyFirstChhath: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cur = BEGINNER_STEPS[activeStep];

  return (
    <section id="first-time-chhath" className="section-padding relative overflow-hidden bg-stone-50 dark:bg-stone-950 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>प्रथम छठ व्रत संदर्शिका (My First Chhath Mode)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            पहली बार छठ कर रहे हैं?
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            सरल, आश्वस्तकारी और चरणबद्ध मार्गदर्शन — ताकि कोई भी नया व्रती या परिवार बिना किसी भय या भ्रम के निष्ठापूर्वक छठ मना सके।
          </p>
        </div>

        {/* Step Progression Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {BEGINNER_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeStep === idx
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500/15 border border-amber-500/20'
              }`}
            >
              <span>चरण {s.step}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content Card */}
        <div className="chhath-card p-6 sm:p-10 rounded-3xl border-amber-500/30 shadow-2xl relative overflow-hidden paramprik-border">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-amber-500/20">
            <div>
              <span className="text-xs uppercase font-bold text-orange-600 dark:text-amber-400">
                Step {cur.step} of 5 • शुरुआती मार्गदर्शन
              </span>
              <h3 className="font-rozha text-2xl sm:text-4xl text-stone-900 dark:text-stone-100 font-bold mt-1">
                {cur.hindiTitle}
              </h3>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mukta">
                {cur.title}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-300 shrink-0">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>सरल व सात्विक नियम</span>
            </div>
          </div>

          <div className="my-6 space-y-4">
            <p className="font-mukta text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed">
              {cur.desc}
            </p>

            {/* Golden Box of Key Rule */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-1">
                ✨ सबसे महत्वपूर्ण नियम (Core Principle):
              </span>
              <p className="font-mukta text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100">
                {cur.keyRule}
              </p>
            </div>

            {/* Required Materials at this step */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                आवश्यक सामग्री (Required for this step):
              </span>
              <div className="flex flex-wrap gap-2">
                {cur.materials.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 font-mukta font-medium"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-amber-500/20 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 0))}
              disabled={activeStep === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 disabled:opacity-40"
            >
              ← पिछला चरण
            </button>

            {activeStep < BEGINNER_STEPS.length - 1 ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <span>अगला चरण देखें</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <a
                href="#vidhi"
                className="px-6 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all flex items-center gap-1.5"
              >
                <span>संपूर्ण पूजा विधि पढ़ें</span>
                <BookOpen className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
