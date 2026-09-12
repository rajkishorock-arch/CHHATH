import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calculator, 
  Users, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  ChefHat, 
  Flame 
} from 'lucide-react';

export const ThekuaCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [personCount, setPersonCount] = useState<number>(10);
  const [sweetener, setSweetener] = useState<'jaggery' | 'sugar'>('jaggery');
  const [copied, setCopied] = useState(false);

  // Traditional ratio calculation per devotee (yielding approx 3.5 thekuas per person)
  const flourKg = Number(((personCount * 0.1)).toFixed(2)); // 100g flour per person
  const jaggeryKg = Number(((personCount * 0.05)).toFixed(2)); // 50g jaggery
  const gheeKg = Number(((personCount * 0.04)).toFixed(2)); // 40g ghee for moyan & frying
  const saunfGrams = Math.round(personCount * 3); // 3g saunf
  const elaichiGrams = Math.max(5, Math.round(personCount * 1)); // 1g elaichi
  const nariyalGrams = Math.round(personCount * 8); // 8g dry coconut
  const estimatedThekuas = Math.round(personCount * 3.5);

  const presets = [5, 10, 25, 50, 100];

  const handleCopyList = () => {
    const listText = `छठ महाप्रसाद — ठेकुआ सामग्री परिमाण सूची (${personCount} लोगों हेतु):
--------------------------------------------------
• मोटा गेहूं का आटा: ${flourKg >= 1 ? `${flourKg} कि.ग्रा.` : `${flourKg * 1000} ग्राम`}
• ${sweetener === 'jaggery' ? 'देशी गुड़ (Jaggery)' : 'शुद्ध चीनी (Sugar)'}: ${jaggeryKg >= 1 ? `${jaggeryKg} कि.ग्रा.` : `${jaggeryKg * 1000} ग्राम`}
• शुद्ध देशी घी (मोयन व तलने हेतु): ${gheeKg >= 1 ? `${gheeKg} कि.ग्रा.` : `${gheeKg * 1000} ग्राम`}
• सौंफ (Fennel): ${saunfGrams} ग्राम
• छोटी इलायची (Cardamom): ${elaichiGrams} ग्राम
• सूखा नारियल (गरी कतरन): ${nariyalGrams} ग्राम
--------------------------------------------------
अनुमानित कुल ठेकुआ संख्या: लगभग ${estimatedThekuas} पीस
काठ के सांचे पर देशी घी से तैयार करें। जय छठी मईया!`;

    navigator.clipboard.writeText(listText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="royal-card-luxury p-6 sm:p-9 rounded-3xl border-amber-400/40 shadow-2xl max-w-5xl mx-auto my-10 overflow-hidden relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-bl-full pointer-events-none blur-2xl"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amber-500/25">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="badge-royal text-[10px] py-0.5 px-2 mb-1">
              स्मार्ट पाक विधा मीटर
            </div>
            <h3 className="font-rozha text-2xl sm:text-3xl text-stone-100 font-bold gold-foil-text">
              महाप्रसाद व ठेकुआ परिमाण कैलकुलेटर
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
            title="प्रिंट करें"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyList}
            className="btn-royal-gold text-xs py-2 px-4 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'सामग्री कॉपी हो गई!' : 'सामग्री लिस्ट कॉपी करें'}</span>
          </button>
        </div>
      </div>

      {/* Devotees Count Controls */}
      <div className="my-6 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>प्रसाद ग्रहण करने वाले श्रद्धालुओं / व्रतियों की संख्या:</span>
            </span>
            <span className="font-rozha text-xl text-amber-300 font-bold">
              {personCount} लोग (Devotees)
            </span>
          </label>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {presets.map((num) => (
              <button
                key={num}
                onClick={() => setPersonCount(num)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  personCount === num
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md font-black ring-1 ring-yellow-200'
                    : 'bg-stone-900/80 text-stone-300 border border-amber-500/25 hover:border-amber-400'
                }`}
              >
                {num} लोग {num === 5 ? '(छोटा परिवार)' : num === 25 ? '(संयुक्त परिवार)' : num === 100 ? '(सामुदायिक)' : ''}
              </button>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={2}
            max={150}
            value={personCount}
            onChange={(e) => setPersonCount(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Sweetener Toggle: Jaggery vs Sugar */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-bold text-stone-300">मिठास चयन:</span>
          <button
            onClick={() => setSweetener('jaggery')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              sweetener === 'jaggery'
                ? 'bg-amber-600 text-white border border-amber-400'
                : 'bg-stone-900 text-stone-400 border border-stone-700'
            }`}
          >
            देशी गुड़ (पारंपरिक सर्वश्रेष्ठ)
          </button>
          <button
            onClick={() => setSweetener('sugar')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              sweetener === 'sugar'
                ? 'bg-amber-600 text-white border border-amber-400'
                : 'bg-stone-900 text-stone-400 border border-stone-700'
            }`}
          >
            शुद्ध चीनी
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-6">
        
        {/* Wheat Flour */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 text-center">
          <span className="text-2xl block mb-1">🌾</span>
          <span className="text-[11px] text-stone-400 font-bold block">गेहूं का आटा</span>
          <strong className="font-rozha text-lg text-amber-300 block mt-0.5">
            {flourKg >= 1 ? `${flourKg} कि.ग्रा.` : `${flourKg * 1000} ग्राम`}
          </strong>
        </div>

        {/* Jaggery / Sugar */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 text-center">
          <span className="text-2xl block mb-1">{sweetener === 'jaggery' ? '🍯' : '🧂'}</span>
          <span className="text-[11px] text-stone-400 font-bold block">
            {sweetener === 'jaggery' ? 'देशी गुड़' : 'शुद्ध चीनी'}
          </span>
          <strong className="font-rozha text-lg text-amber-300 block mt-0.5">
            {jaggeryKg >= 1 ? `${jaggeryKg} कि.ग्रा.` : `${jaggeryKg * 1000} ग्राम`}
          </strong>
        </div>

        {/* Pure Desi Ghee */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 text-center">
          <span className="text-2xl block mb-1">🧈</span>
          <span className="text-[11px] text-stone-400 font-bold block">शुद्ध देशी घी</span>
          <strong className="font-rozha text-lg text-amber-300 block mt-0.5">
            {gheeKg >= 1 ? `${gheeKg} कि.ग्रा.` : `${gheeKg * 1000} ग्राम`}
          </strong>
        </div>

        {/* Saunf */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 text-center">
          <span className="text-2xl block mb-1">🌿</span>
          <span className="text-[11px] text-stone-400 font-bold block">सौंफ</span>
          <strong className="font-rozha text-lg text-amber-300 block mt-0.5">
            {saunfGrams} ग्राम
          </strong>
        </div>

        {/* Elaichi */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 text-center">
          <span className="text-2xl block mb-1">🌱</span>
          <span className="text-[11px] text-stone-400 font-bold block">छोटी इलायची</span>
          <strong className="font-rozha text-lg text-amber-300 block mt-0.5">
            {elaichiGrams} ग्राम
          </strong>
        </div>

        {/* Dry Coconut (Gari) */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 text-center">
          <span className="text-2xl block mb-1">🥥</span>
          <span className="text-[11px] text-stone-400 font-bold block">सूखा नारियल (गरी)</span>
          <strong className="font-rozha text-lg text-amber-300 block mt-0.5">
            {nariyalGrams} ग्राम
          </strong>
        </div>

      </div>

      {/* Yield & Chef Tip Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-stone-900 to-stone-900 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-stone-100 block">
              अनुमानित कुल ठेकुआ: लगभग {estimatedThekuas} पीस
            </span>
            <span className="text-[11px] text-stone-400 font-mukta">
              काठ के पारंपरिक सांचे पर देशी घी लगाकर हल्की मध्यम आंच पर तलें।
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold font-mukta shrink-0">
          <Flame className="w-4 h-4 text-orange-400 animate-diya-flicker" />
          <span>१००% शुद्ध सात्विक प्रसाद</span>
        </div>
      </div>

    </div>
  );
};
