import React, { useState } from 'react';
import { 
  ArrowLeft, Home, Share2, Calendar, Clock, BookOpen, 
  Flame, CheckCircle2, Circle, Sparkles, Heart, BellRing, 
  UtensilsCrossed, ChevronRight, Copy, Check 
} from 'lucide-react';
import { CompleteFestivalHubData } from '../../data/festivalHubDetailsData';

interface DedicatedFestivalHubViewProps {
  festival: CompleteFestivalHubData;
  onBack: () => void;
  onGoHome?: () => void;
  onOpenJapMala?: () => void;
}

export const DedicatedFestivalHubView: React.FC<DedicatedFestivalHubViewProps> = ({
  festival,
  onBack,
  onGoHome = onBack,
  onOpenJapMala
}) => {
  const [activeTab, setActiveTab] = useState<'vidhi' | 'katha' | 'aarti' | 'samagri' | 'muhurat' | 'prasad' | 'mantra'>('vidhi');
  const [checkedSamagri, setCheckedSamagri] = useState<Set<number>>(() => new Set());
  const [isCopied, setIsCopied] = useState(false);

  const toggleSamagri = (index: number) => {
    setCheckedSamagri(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleShare = async () => {
    const text = `🌸 *${festival.hindiTitle}* 🌸\n🗓️ तिथि: ${festival.dateStr} (${festival.tithi})\n🪔 इष्ट देव: ${festival.deity}\n\n✨ पूजा मुहूर्त: ${festival.muhurat.pujaTime}\n\n📲 सनातन महापर्व ऐप पर संपूर्ण विधि, कथा व आरती देखें।`;
    if (navigator.share) {
      try {
        await navigator.share({ title: festival.hindiTitle, text });
      } catch {}
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleJapClick = () => {
    if (onOpenJapMala) {
      onOpenJapMala();
    } else {
      window.dispatchEvent(new CustomEvent('open_jap_mala'));
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ee] text-[#451a03] animate-ios-slide-in flex flex-col pb-28">
      
      {/* 1. TOP DEDICATED HEADER */}
      <header className="sticky top-0 z-40 bg-[#fdf6ee]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/60 shadow-xs">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
            aria-label="वापस"
            title="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
          </button>

          {/* Title */}
          <div className="text-center min-w-0 px-2 flex-1">
            <h1 className="font-serif font-black text-lg sm:text-xl md:text-2xl text-[#78350f] truncate leading-tight">
              {festival.hindiTitle}
            </h1>
            <p className="text-[10px] sm:text-xs text-[#9a3412] font-mukta font-bold truncate">
              {festival.dateStr}
            </p>
          </div>

          {/* Action: Share & Home */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
              aria-label="शेयर करें"
              title="व्हाट्सएप शेयर"
            >
              <Share2 className="w-4 h-4 text-[#9a3412]" />
            </button>
            <button
              onClick={onGoHome}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
              aria-label="होम"
              title="होम स्क्रीन"
            >
              <Home className="w-4 h-4 text-[#9a3412]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. FESTIVAL HERO BANNER */}
      <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-3 sm:px-4 pt-3 md:pt-5">
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#fed7aa] bg-stone-900 min-h-[170px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[320px] flex flex-col justify-end p-4 sm:p-6 md:p-8">
          <img
            src={festival.image}
            alt={festival.hindiTitle}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 space-y-1.5 sm:space-y-2 max-w-3xl">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-500 text-stone-950 font-mukta shadow-xs">
                {festival.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/20 backdrop-blur-md text-amber-100 font-mukta border border-white/20">
                {festival.tithi}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-serif text-white leading-tight drop-shadow-md">
              {festival.hindiTitle}
            </h2>

            <p className="text-xs sm:text-sm text-amber-200 font-mukta font-bold flex items-center gap-1">
              <span>🪔 इष्ट देव:</span>
              <span className="text-white">{festival.deity}</span>
            </p>

            <p className="text-[11px] sm:text-xs md:text-sm text-amber-100/90 font-mukta leading-relaxed line-clamp-2 pt-0.5">
              {festival.significance || festival.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE FEATURE TABS (Chhath-style Quick Navigation) */}
      <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-3 sm:px-4 pt-3.5">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'vidhi', label: 'पूजा विधि', icon: '🪔' },
            { id: 'katha', label: 'व्रत कथा', icon: '📜' },
            { id: 'aarti', label: 'आरती व स्तुति', icon: '🔔' },
            { id: 'samagri', label: 'पूजन सामग्री', icon: '🧺' },
            { id: 'muhurat', label: 'शुभ मुहूर्त', icon: '⏰' },
            { id: 'prasad', label: 'भोग व प्रसाद', icon: '🥥' },
            { id: 'mantra', label: 'मंत्र साधना', icon: '📿' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold font-mukta whitespace-nowrap transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#d97706] text-white shadow-xs scale-[1.02]'
                  : 'bg-[#fffaf3] text-[#78350f] border border-[#fed7aa] hover:bg-[#fed7aa]/40'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. TAB CONTENT CONTAINER */}
      <main className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-3 sm:px-4 pt-3 flex-1">
        
        {/* TAB 1: PUJA VIDHI & FASTING RULES */}
        {activeTab === 'vidhi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
            {/* Fasting Rules Card */}
            <div className="p-4 bg-gradient-to-br from-[#fffaf3] to-[#fdeddc] rounded-2xl md:rounded-3xl border border-[#fed7aa] shadow-xs space-y-2.5">
              <div className="flex items-center space-x-2 border-b border-[#fed7aa] pb-1.5">
                <span className="text-base">📋</span>
                <h3 className="font-serif font-black text-sm md:text-base text-[#78350f]">
                  उपवास व नियम विधान
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#9a3412]">
                व्रत का प्रकार: <span className="text-[#451a03] font-normal">{festival.fastingRules.type}</span>
              </p>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="font-bold text-emerald-700">✓ फलाहार / अनुमत: </span>
                  {festival.fastingRules.foodsAllowed.join(', ')}
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900">
                  <span className="font-bold text-red-700">✕ वर्जित वस्तुएं: </span>
                  {festival.fastingRules.foodsProhibited.join(', ')}
                </div>
              </div>
              {festival.fastingRules.specialInstructions && (
                <p className="text-xs text-[#78350f] bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  💡 <strong>विशेष निर्देश:</strong> {festival.fastingRules.specialInstructions}
                </p>
              )}
            </div>

            {/* Step-by-Step Puja Steps */}
            <div className="p-4 bg-white rounded-2xl md:rounded-3xl border border-[#fed7aa] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 border-b border-[#fed7aa] pb-1.5">
                <span className="text-base">✨</span>
                <h3 className="font-serif font-black text-sm md:text-base text-[#78350f]">
                  क्रमबद्ध पावन पूजा विधि
                </h3>
              </div>
              <div className="space-y-2.5">
                {festival.pujaVidhiSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#451a03]">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#fef3c7] text-[#9a3412] font-black font-mukta flex items-center justify-center shrink-0 border border-[#fed7aa] text-[11px] sm:text-xs">
                      {idx + 1}
                    </span>
                    <p className="flex-1 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VRAT KATHA */}
        {activeTab === 'katha' && (
          <div className="p-4 sm:p-6 bg-white rounded-2xl md:rounded-3xl border border-[#fed7aa] shadow-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#fed7aa] pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📜</span>
                <h3 className="font-serif font-black text-base sm:text-lg text-[#78350f]">
                  {festival.vratKatha.title}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(festival.vratKatha.story)}
                className="text-xs text-[#ea580c] hover:text-[#c2410c] font-bold flex items-center space-x-1"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'कॉपी हुआ' : 'कॉपी'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-[#451a03] font-mukta leading-relaxed whitespace-pre-line text-justify">
              {festival.vratKatha.story}
            </p>

            <div className="p-3 sm:p-4 bg-gradient-to-r from-[#fef3c7] to-[#fed7aa]/50 rounded-xl md:rounded-2xl border border-amber-300 text-xs sm:text-sm text-[#78350f]">
              <span className="font-bold">🌟 कथा का पावन फल: </span>
              {festival.vratKatha.moral}
            </div>
          </div>
        )}

        {/* TAB 3: AARTI & STUTI */}
        {activeTab === 'aarti' && (
          <div className="p-4 sm:p-6 bg-white rounded-2xl md:rounded-3xl border border-[#fed7aa] shadow-xs space-y-3 animate-fade-in text-center">
            <div className="flex items-center justify-between border-b border-[#fed7aa] pb-2">
              <h3 className="font-serif font-black text-base sm:text-lg text-[#78350f]">
                🔔 {festival.aarti.title}
              </h3>
              <button
                onClick={() => handleCopy(festival.aarti.lyrics.join('\n'))}
                className="text-xs text-[#ea580c] font-bold flex items-center space-x-1"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'कॉपी' : 'कॉपी'}</span>
              </button>
            </div>

            <div className="space-y-2 py-2 max-w-2xl mx-auto">
              {festival.aarti.lyrics.map((line, idx) => (
                <p key={idx} className="font-mukta font-bold text-xs sm:text-sm md:text-base text-[#78350f] leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SAMAGRI CHECKLIST */}
        {activeTab === 'samagri' && (
          <div className="p-4 sm:p-6 bg-white rounded-2xl md:rounded-3xl border border-[#fed7aa] shadow-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#fed7aa] pb-2">
              <div>
                <h3 className="font-serif font-black text-sm sm:text-base text-[#78350f]">
                  पूजन सामग्री चेकलिस्ट ({festival.samagriList.length})
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-mukta">सामग्री जुटाते समय टिक करें</p>
              </div>
              <button
                onClick={() => {
                  const list = festival.samagriList.map((item, i) => `${i + 1}. ${item}`).join('\n');
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🧺 *${festival.hindiTitle} - पूजन सामग्री सूची*\n\n${list}`)}`, '_blank');
                }}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold font-mukta flex items-center space-x-1"
              >
                <span>व्हाट्सएप भेजें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1">
              {festival.samagriList.map((item, idx) => {
                const isChecked = checkedSamagri.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSamagri(idx)}
                    className={`p-2.5 sm:p-3 rounded-xl border flex items-center space-x-2.5 transition-all cursor-pointer ${
                      isChecked 
                        ? 'bg-emerald-50/60 border-emerald-300 text-gray-400 line-through' 
                        : 'bg-[#fffaf3] border-[#fed7aa] text-[#451a03] hover:border-[#ea580c]'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-mukta font-medium flex-1">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: MUHURAT TIMINGS */}
        {activeTab === 'muhurat' && (
          <div className="p-4 bg-white rounded-2xl border border-[#fed7aa] shadow-xs space-y-3 animate-fade-in">
            <div className="border-b border-[#fed7aa] pb-2">
              <h3 className="font-serif font-black text-sm text-[#78350f] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ea580c]" />
                पावन शुभ मुहूर्त एवं तिथियां (2026)
              </h3>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-300">
                <p className="text-[11px] font-bold text-[#9a3412]">पूजा का श्रेष्ठ मुहूर्त</p>
                <p className="text-sm font-black font-serif text-[#78350f] mt-0.5">
                  {festival.muhurat.pujaTime}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#fffaf3] border border-[#fed7aa]">
                  <p className="text-[10px] text-gray-500 font-bold">तिथि प्रारंभ</p>
                  <p className="font-bold text-[#451a03] mt-0.5">{festival.muhurat.tithiBegins}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fffaf3] border border-[#fed7aa]">
                  <p className="text-[10px] text-gray-500 font-bold">तिथि समाप्ति</p>
                  <p className="font-bold text-[#451a03] mt-0.5">{festival.muhurat.tithiEnds}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <p className="text-[10px] text-emerald-700 font-bold">पारण (व्रत खोलने का समय)</p>
                <p className="font-bold text-emerald-950 mt-0.5">{festival.muhurat.paranTime}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BHOG & PRASAD RECIPE */}
        {activeTab === 'prasad' && (
          <div className="p-4 bg-white rounded-2xl border border-[#fed7aa] shadow-xs space-y-3 animate-fade-in">
            <div className="border-b border-[#fed7aa] pb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#ea580c]" />
              <h3 className="font-serif font-black text-sm text-[#78350f]">
                {festival.prasadRecipe.name}
              </h3>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-[#78350f]">
              <span className="font-bold">✨ धार्मिक महत्व: </span>
              {festival.prasadRecipe.significance}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#9a3412]">आवश्यक सामग्री:</p>
              <div className="flex flex-wrap gap-1.5">
                {festival.prasadRecipe.ingredients.map((ing, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-[#fffaf3] border border-[#fed7aa] text-[11px] text-[#451a03]">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-bold text-[#9a3412]">बनाने की विधि:</p>
              <div className="space-y-1.5">
                {festival.prasadRecipe.steps.map((st, i) => (
                  <p key={i} className="text-xs text-[#451a03] leading-relaxed flex items-start gap-1.5">
                    <span className="font-bold text-amber-600 shrink-0">{i + 1}.</span>
                    <span>{st}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MANTRA & JAP SADHANA */}
        {activeTab === 'mantra' && (
          <div className="p-4 bg-white rounded-2xl border border-[#fed7aa] shadow-xs space-y-3.5 animate-fade-in text-center">
            <div className="border-b border-[#fed7aa] pb-2">
              <h3 className="font-serif font-black text-sm text-[#78350f]">
                📿 सिद्ध पावन मंत्र साधना
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 space-y-2">
              <p className="font-serif font-black text-sm sm:text-base text-[#78350f] leading-relaxed">
                {festival.mantra.sanskrit}
              </p>
              <p className="text-xs text-[#9a3412] font-mukta">
                <strong>अर्थ:</strong> {festival.mantra.meaning}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[#78350f] px-2">
              <span>जप संख्या: <strong>{festival.mantra.jaapCount}</strong></span>
              <button
                onClick={handleJapClick}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 transition-all"
              >
                <span>📿 108 जप माला प्रारंभ करें</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
