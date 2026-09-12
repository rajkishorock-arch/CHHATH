import React, { useState, useEffect } from 'react';
import { ChefHat, Timer, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Check, Sparkles, X, Volume2 } from 'lucide-react';
import { devotionalAudio } from '../../utils/audioEngine';

interface RecipeStep {
  stepNum: number;
  instruction: string;
  hindiDetail: string;
  durationMins?: number;
  tip?: string;
}

interface InteractiveRecipe {
  id: string;
  title: string;
  hindiTitle: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'सरल (Easy)' | 'मध्यम (Medium)' | 'सावधानीपूर्वक (Pro)';
  ingredients: { name: string; qty: string }[];
  steps: RecipeStep[];
}

const RECIPES: InteractiveRecipe[] = [
  {
    id: 'thekua',
    title: 'Traditional Bihari Khasta Thekua',
    hindiTitle: 'पारंपरिक खस्ता ठेकुआ महाप्रसाद',
    prepTime: '25 मिनट',
    cookTime: '35 मिनट',
    difficulty: 'सावधानीपूर्वक (Pro)',
    ingredients: [
      { name: 'मोटा गेहूं का आटा (Whole Wheat Flour)', qty: '1 किलो' },
      { name: 'शुद्ध देशी घी (Pure Ghee for Moyan)', qty: '250 ग्राम' },
      { name: 'देसी गुड़ (Organic Jaggery)', qty: '400 ग्राम' },
      { name: 'सौंफ (Fennel Seeds)', qty: '2 बड़े चम्मच' },
      { name: 'छोटी इलायची पाउडर (Cardamom)', qty: '1 छोटा चम्मच' },
      { name: 'कटा सूखा नारियल / गरी (Dry Coconut)', qty: '50 ग्राम' },
      { name: 'तलने हेतु शुद्ध देशी घी', qty: 'तलने अनुसार' }
    ],
    steps: [
      {
        stepNum: 1,
        instruction: 'गुड़ का सीरा (Jaggery Syrup) तैयार करना',
        hindiDetail: 'एक गहरे बर्तन में गुड़ और 1 कप पानी डालकर हल्की आंच पर गर्म करें ताकि गुड़ पिघल जाए। तार की चाशनी नहीं बनानी है, केवल गुड़ को पूरी तरह घोलना है। फिर इसे ठंडा होने के लिए रख दें।',
        durationMins: 5,
        tip: 'ध्यान रहे: गर्म चाशनी से आटा कभी न गूंथें, अन्यथा ठेकुआ सख्त हो जाएगा।'
      },
      {
        stepNum: 2,
        instruction: 'मोयन व सूखे मसालों का मिलान',
        hindiDetail: 'पवित्र परात में गेहूं का आटा छान लें। इसमें सौंफ, इलायची पाउडर और बारीक कटी गरी मिलाएं। अब 250 ग्राम देशी घी डालकर दोनों हाथों की हथेलियों से 5-7 मिनट तक अच्छी तरह मसलें (मोयन दें), जब तक कि मुट्ठी बांधने पर आटा बंधने न लगे।',
        durationMins: 7,
        tip: 'मोयन जितना अच्छा होगा, ठेकुआ उतना ही खस्ता और मुंह में घुलने वाला बनेगा।'
      },
      {
        stepNum: 3,
        instruction: 'कड़ा आटा गूंथना',
        hindiDetail: 'ठंडे गुड़ के सीरे को थोड़ा-थोड़ा करके आटे में छिड़कें। इसे रोटी के आटे की तरह मुलायम नहीं गूंथना है, बल्कि केवल दबा-दबाकर एकसार कड़ा पिंड बनाना है।',
        durationMins: 6,
        tip: 'आटा अधिक गीला न होने दें।'
      },
      {
        stepNum: 4,
        instruction: 'सांचे (ष्ठक) पर ठेकुआ गढ़ना',
        hindiDetail: 'आटे की छोटी-छोटी लोइयां बनाएं। लकड़ी के पारंपरिक सांचे पर थोड़ा सा घी लगाएं और हथेली से दबाकर सुंदर पारंपरिक पत्ता या चक्र की आकृति बनाएं।',
        durationMins: 10,
        tip: 'किनारे अधिक मोटे या अधिक पतले न रखें।'
      },
      {
        stepNum: 5,
        instruction: 'मंद आंच पर देशी घी में तलना',
        hindiDetail: 'कड़ाही में शुद्ध देशी घी गर्म करें। जब घी मध्यम गर्म हो जाए, तब ठेकुआ डालें और बिल्कुल धीमी-मध्यम आंच पर दोनों तरफ से सुनहरा भूरा (Golden Brown) होने तक तलें।',
        durationMins: 15,
        tip: 'धीमी आंच पर तलने से ठेकुआ अंदर तक सिकता है और कई दिनों तक खस्ता रहता है।'
      }
    ]
  },
  {
    id: 'rasiyaw',
    title: 'Kharna Special Rasiyaw Kheer',
    hindiTitle: 'खरना विशेष रसियाव (गुड़ की खीर)',
    prepTime: '15 मिनट',
    cookTime: '30 मिनट',
    difficulty: 'मध्यम (Medium)',
    ingredients: [
      { name: 'अरवा चावल (Govindobhog Rice)', qty: '150 ग्राम' },
      { name: 'गाय का ताजा कच्चा दूध', qty: '1.5 लीटर' },
      { name: 'देसी गुड़ (Jaggery)', qty: '200 ग्राम' },
      { name: 'इलायची व मखाना', qty: 'यथासंभव' }
    ],
    steps: [
      {
        stepNum: 1,
        instruction: 'दूध को मंद आंच पर उबालना',
        hindiDetail: 'मिट्टी के बर्तन अथवा पीतल की देगची में गाय का दूध डालकर धीमी आंच पर उबालें और थोड़ा गाढ़ा होने दें।',
        durationMins: 10
      },
      {
        stepNum: 2,
        instruction: 'धुला अरवा चावल डालना',
        hindiDetail: 'चावल को धोकर दूध में डालें और लगातार कलछी से चलाते रहें ताकि नीचे न लगे।',
        durationMins: 15
      },
      {
        stepNum: 3,
        instruction: 'गुड़ मिलाना व विश्राम',
        hindiDetail: 'जब चावल पूरी तरह गल जाए, आंच बंद कर दें और 2 मिनट बाद पिसा हुआ गुड़ और इलायची मिलाएं ताकि दूध न फटे।',
        durationMins: 5,
        tip: 'उबलते दूध में कभी भी सीधे गुड़ न डालें।'
      }
    ]
  }
];

export const CookingStudio: React.FC = () => {
  const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Kitchen Timer State
  const [timerSecs, setTimerSecs] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const recipe = RECIPES[selectedRecipeIdx];
  const step = recipe.steps[activeStepIdx];

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecs > 0) {
      interval = setInterval(() => {
        setTimerSecs(prev => prev - 1);
      }, 1000);
    } else if (timerSecs === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      devotionalAudio.playCookingTimerAlert();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecs]);

  const startStepTimer = (mins: number = 5) => {
    setTimerSecs(mins * 60);
    setIsTimerRunning(true);
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="recipe-studio" className="section-padding relative overflow-hidden bg-stone-50 dark:bg-stone-900/60 border-t border-amber-500/20">
      <div className="container-custom max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron inline-flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5" />
            <span>पवित्र पाक कला संदर्शिका (Chhath Recipe Studio)</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
            छठ महाप्रसाद पाक कला संदर्शिका 🍪
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            खस्ता ठेकुआ व खरना रसियाव खीर बनाने की शुद्ध प्रामाणिक विधि और इंटरैक्टिव <strong>"कुकिंग मोड"</strong>।
          </p>
        </div>

        {/* Recipe Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {RECIPES.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRecipeIdx(idx);
                setActiveStepIdx(0);
                setIsCookingMode(false);
                setIsTimerRunning(false);
              }}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedRecipeIdx === idx
                  ? 'bg-amber-500 text-stone-950 shadow-lg scale-105'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-500/20'
              }`}
            >
              {r.hindiTitle}
            </button>
          ))}
        </div>

        {/* Recipe Details / Cooking Mode Container */}
        {!isCookingMode ? (
          /* Normal Recipe Card */
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/30 shadow-2xl space-y-8 paramprik-border">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-amber-500/20 gap-4">
              <div>
                <h3 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
                  {recipe.hindiTitle}
                </h3>
                <span className="text-xs text-stone-500 font-mukta">{recipe.title}</span>
              </div>

              <button
                onClick={() => {
                  setIsCookingMode(true);
                  setActiveStepIdx(0);
                  if (recipe.steps[0].durationMins) {
                    startStepTimer(recipe.steps[0].durationMins);
                  }
                }}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 text-stone-950 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>Start Cooking Mode (बनाना शुरू करें)</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-amber-500/20">
                <span className="text-[11px] text-stone-500 block">तैयारी समय</span>
                <span className="font-bold text-sm sm:text-base text-stone-800 dark:text-stone-100">{recipe.prepTime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-amber-500/20">
                <span className="text-[11px] text-stone-500 block">पकाने का समय</span>
                <span className="font-bold text-sm sm:text-base text-stone-800 dark:text-stone-100">{recipe.cookTime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-amber-500/20">
                <span className="text-[11px] text-stone-500 block">कठिनाई स्तर</span>
                <span className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400">{recipe.difficulty}</span>
              </div>
            </div>

            {/* Ingredients Table */}
            <div>
              <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
                आवश्यक पावन सामग्री (Ingredients):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-mukta"
                  >
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{ing.name}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{ing.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Preview */}
            <div className="space-y-4">
              <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
                चरणबद्ध विधि (Step-by-step Process):
              </h4>
              <div className="space-y-3">
                {recipe.steps.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-amber-500/20 flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center shrink-0">
                      {st.stepNum}
                    </span>
                    <div className="space-y-1">
                      <strong className="text-sm text-stone-900 dark:text-stone-100 block">{st.instruction}</strong>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-mukta leading-relaxed">{st.hindiDetail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Fullscreen/Focused Cooking Mode with Big Font and Kitchen Timer */
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-stone-800 border-2 border-amber-500 shadow-2xl space-y-8 paramprik-border relative animate-fadeIn">
            
            {/* Top Bar with Step Progress and Exit */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold uppercase">
                  कुकिंग मोड सक्रिय
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  चरण {step.stepNum} / {recipe.steps.length}
                </span>
              </div>

              <button
                onClick={() => setIsCookingMode(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-400"
                title="Exit Cooking Mode"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Instruction Text */}
            <div className="text-center max-w-3xl mx-auto space-y-4 my-6">
              <span className="text-xs uppercase font-bold text-orange-600 dark:text-amber-400 tracking-widest block">
                {step.instruction}
              </span>
              <h3 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {step.hindiDetail}
              </h3>

              {step.tip && (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs sm:text-sm font-mukta text-amber-800 dark:text-amber-200 inline-block">
                  💡 <strong>मास्टर टिप:</strong> {step.tip}
                </div>
              )}
            </div>

            {/* Kitchen Timer Widget */}
            <div className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30 max-w-md mx-auto flex flex-col items-center space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Timer className="w-4 h-4" />
                <span>रसोई टाइमर (Kitchen Timer)</span>
              </div>

              <div className="font-mono text-4xl sm:text-5xl font-black text-stone-900 dark:text-stone-100">
                {formatTimer(timerSecs)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-stone-950" />}
                  <span>{isTimerRunning ? 'रोकें (Pause)' : 'टाइमर चलाएं'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSecs((step.durationMins || 5) * 60);
                  }}
                  className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-amber-500/30">
              <button
                onClick={() => {
                  const prevIdx = Math.max(activeStepIdx - 1, 0);
                  setActiveStepIdx(prevIdx);
                  setTimerSecs((recipe.steps[prevIdx].durationMins || 5) * 60);
                }}
                disabled={activeStepIdx === 0}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला चरण</span>
              </button>

              {activeStepIdx < recipe.steps.length - 1 ? (
                <button
                  onClick={() => {
                    const nextIdx = activeStepIdx + 1;
                    setActiveStepIdx(nextIdx);
                    setTimerSecs((recipe.steps[nextIdx].durationMins || 5) * 60);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-md flex items-center gap-1.5"
                >
                  <span>अगला चरण</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsCookingMode(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-green-600 hover:bg-green-500 text-white shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>प्रसाद तैयार है! पूर्ण करें</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
