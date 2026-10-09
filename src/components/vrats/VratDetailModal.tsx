import React, { useState } from 'react';
import { X, BookOpen, Clock, CheckSquare, Sparkles, Volume2, VolumeX, Share2, ZoomIn, ZoomOut, Heart, Flame } from 'lucide-react';
import { VratItem } from '../../data/allVratsData';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface VratDetailModalProps {
  vrat: VratItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAarti?: (aartiTitle: string) => void;
}

export const VratDetailModal: React.FC<VratDetailModalProps> = ({
  vrat,
  isOpen,
  onClose,
  onOpenAarti
}) => {
  const [activeTab, setActiveTab] = useState<'katha' | 'vidhi' | 'muhurat' | 'samagri' | 'rules' | 'mantra'>('katha');
  const [fontSize, setFontSize] = useState<number>(16);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [checkedSamagri, setCheckedSamagri] = useState<{ [index: number]: boolean }>({});

  if (!isOpen || !vrat) return null;

  const toggleSamagriCheck = (index: number) => {
    setCheckedSamagri(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleToggleSpeak = () => {
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      let textToRead = '';
      if (activeTab === 'katha') {
        textToRead = `${vrat.vratKatha.title}। ${vrat.vratKatha.story}`;
      } else if (activeTab === 'vidhi') {
        textToRead = `पूजा विधि: ${vrat.pujaVidhiSteps.join('। ')}`;
      } else if (activeTab === 'mantra') {
        textToRead = `महामंत्र: ${vrat.mantra.sanskrit}। भावार्थ: ${vrat.mantra.meaning}`;
      } else {
        textToRead = `${vrat.hindiName}। ${vrat.significance}`;
      }

      setIsPlayingAudio(true);
      spiritualAudio.speakText(textToRead, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleShare = async () => {
    const text = `🌸 *${vrat.hindiName}* 🌸\n\nदेवता: ${vrat.deity}\nतिथि: ${vrat.tithi} (${vrat.month})\nशुभ मुहूर्त 2026: ${vrat.muhurat2026.pujaTime}\n\nविस्तृत पूजा विधि एवं संपूर्ण व्रत कथा पढ़ने के लिए देखें: https://chhathpuja.org/#vrats`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: vrat.hindiName,
          text: text
        });
      } catch {
        // fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('व्रत विवरण कॉपी कर लिया गया है!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/90 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Banner with Image */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden shrink-0">
          <img
            src={vrat.image}
            alt={vrat.name}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Close & Share Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all shadow-md"
              title="शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                spiritualAudio.stopSpeaking();
                setIsPlayingAudio(false);
                onClose();
              }}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all shadow-md"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-4 left-5 right-5 z-10">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-semibold mb-2 shadow-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              {vrat.month} • {vrat.tithi}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-wide drop-shadow-md">
              {vrat.hindiName}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200 font-medium mt-0.5 line-clamp-1">
              ईष्ट देव: {vrat.deity}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 p-2 bg-amber-50/70 border-b border-amber-100 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'katha', label: '📖 व्रत कथा', icon: BookOpen },
            { id: 'vidhi', label: '📜 पूजा विधि', icon: Sparkles },
            { id: 'muhurat', label: '⏰ शुभ मुहूर्त', icon: Clock },
            { id: 'samagri', label: '🧺 सामग्री', icon: CheckSquare },
            { id: 'rules', label: '🚫 नियम व आहार', icon: Flame },
            { id: 'mantra', label: '🕉️ महामंत्र', icon: Heart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-amber-100/60'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Controls Toolbar (Audio Read Aloud + Font Sizing) */}
        <div className="px-5 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isPlayingAudio
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>पाठ रोकें</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>ऑडियो में सुनें 🔊</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFontSize(s => Math.max(13, s - 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="अक्षर छोटे करें"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-gray-500 px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(s => Math.min(24, s + 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="अक्षर बड़े करें"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Tab Content Scroll Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: VRAT KATHA */}
          {activeTab === 'katha' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200">
                <h3 className="text-lg font-bold font-serif text-amber-950">
                  {vrat.vratKatha.title}
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  श्रद्धापूर्वक कथा श्रवण से समस्त पापों का क्षय और मनोवांछित फल की प्राप्ति होती है।
                </p>
              </div>

              <div 
                className="text-gray-800 leading-relaxed font-serif whitespace-pre-line space-y-3"
                style={{ fontSize: `${fontSize}px` }}
              >
                {vrat.vratKatha.story}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 mt-6">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" /> कथा का आध्यात्मिक मर्म व शिक्षा:
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                  {vrat.vratKatha.moral}
                </p>
              </div>

              {vrat.aartiTitle && onOpenAarti && (
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => onOpenAarti(vrat.aartiTitle)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                  >
                    <span>🪔 {vrat.aartiTitle} पढ़ें</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUJA VIDHI */}
          {activeTab === 'vidhi' && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80">
                <h3 className="text-base font-bold text-orange-950 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-600" />
                  {vrat.hindiName} की शास्त्रीय पूजा विधि (Step by Step)
                </h3>
                <p className="text-xs text-orange-800/80 mt-1">
                  वैदिक परंपरा अनुसार क्रमबद्ध पूजन विधि से पूजा पूर्ण फलदायी होती है।
                </p>
              </div>

              <div className="space-y-3">
                {vrat.pujaVidhiSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start space-x-3.5 hover:border-amber-300 transition-all"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <p 
                      className="text-gray-800 leading-relaxed font-serif"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MUHURAT */}
          {activeTab === 'muhurat' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-300">
                <h3 className="text-base font-bold text-amber-950 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-amber-600" />
                  वर्ष 2026 पंचांग व शुभ मुहूर्त
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  पंचांग के अनुसार शुद्ध मुहूर्त में पूजन करने से शुभता और संकल्प की सिद्धि होती है।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500">व्रत पर्व तिथि 2026</span>
                  <p className="text-base font-bold text-gray-900 mt-1">{vrat.date2026}</p>
                  <p className="text-xs text-amber-600 mt-0.5">{vrat.tithi} ({vrat.month})</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500">मुख्य पूजा का शुभ मुहूर्त</span>
                  <p className="text-base font-bold text-orange-600 mt-1">{vrat.muhurat2026.pujaTime}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500">तिथि प्रारंभ</span>
                  <p className="text-sm font-bold text-gray-800 mt-1">{vrat.muhurat2026.tithiBegins}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500">तिथि समापन</span>
                  <p className="text-sm font-bold text-gray-800 mt-1">{vrat.muhurat2026.tithiEnds}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm sm:col-span-2">
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wide">पारण का शुभ समय (व्रत खोलने का समय)</span>
                  <p className="text-base font-bold text-green-950 mt-1">{vrat.muhurat2026.paranTime}</p>
                  <p className="text-xs text-green-800 mt-1">शास्त्रानुसार पारण समय पर ही व्रत खोलना चाहिए, तभी व्रत का पूर्ण फल मिलता है।</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAMAGRI */}
          {activeTab === 'samagri' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-950">
                    पूजन सामग्री चेकलिस्ट
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    सामग्री एकत्रित करते समय टिक लगाएं ताकि कोई वस्तु छूटे नहीं
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-200/60 px-2.5 py-1 rounded-lg">
                  {Object.values(checkedSamagri).filter(Boolean).length} / {vrat.samagriList.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vrat.samagriList.map((item, idx) => {
                  const isChecked = !!checkedSamagri[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSamagriCheck(idx)}
                      className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-green-50/70 border-green-300 text-green-900 line-through opacity-70'
                          : 'bg-white border-gray-200 hover:border-amber-300 text-gray-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-400 cursor-pointer pointer-events-none"
                      />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">व्रत का प्रकार</span>
                <p className="text-lg font-bold text-amber-950 mt-0.5">{vrat.fastingRules.type}</p>
                <p className="text-xs text-gray-700 mt-1">{vrat.fastingRules.specialInstructions}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-green-50/60 border border-green-200">
                  <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider flex items-center mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> फलाहार में ग्राह्य (स्वीकार्य)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-green-950">
                    {vrat.fastingRules.foodsAllowed.map((food, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> पूर्णतः वर्जित (त्याज्य)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-red-950">
                    {vrat.fastingRules.foodsProhibited.map((food, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="text-red-600">✗</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MANTRA */}
          {activeTab === 'mantra' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 text-center space-y-3">
                <span className="text-2xl">🕉️</span>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest">
                  सिद्धि प्रदायक महामंत्र
                </h4>
                <p className="text-xl sm:text-2xl font-bold font-serif text-amber-950 leading-relaxed drop-shadow-sm">
                  {vrat.mantra.sanskrit}
                </p>
                <div className="inline-block px-3 py-1 bg-amber-200/60 rounded-full text-xs font-semibold text-amber-900">
                  सुझावित जप: {vrat.mantra.jaapCount}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">मंत्र का भावार्थ</h5>
                <p className="text-sm text-gray-800 leading-relaxed font-serif">
                  {vrat.mantra.meaning}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                💡 <strong>जप विधि:</strong> रुद्राक्ष, तुलसी या लाल चंदन की माला से पूर्व या उत्तर दिशा की ओर मुख करके शांत चित्त से जप करें।
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
