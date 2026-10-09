import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface DigitalJapMalaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MANTRAS = [
  { id: 'shiva', name: 'ॐ नमः शिवाय', meaning: 'भगवान शिव का पंचाक्षर महामंत्र' },
  { id: 'vishnu', name: 'ॐ नमो भगवते वासुदेवाय', meaning: 'द्वादशाक्षर विष्णु महामंत्र' },
  { id: 'gayatri', name: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥', meaning: 'सद्बुद्धि प्रदाता गायत्री महामंत्र' },
  { id: 'surya', name: 'ॐ घृणि सूर्याय नमः', meaning: 'आरोग्य व तेज प्रदाता सूर्य मंत्र' },
  { id: 'hare-krishna', name: 'हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे। हरे राम हरे राम, राम राम हरे हरे॥', meaning: 'महामंत्र' },
  { id: 'ganesh', name: 'ॐ गं गणपतये नमः', meaning: 'विघ्नहर्ता गणेश मंत्र' },
  { id: 'mahamrityunjaya', name: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥', meaning: 'अकाल मृत्यु नाशक महामृत्युंजय मंत्र' },
  { id: 'chhathi-maiya', name: 'ॐ षष्ठी देव्यै नमः', meaning: 'संतान रक्षक छठी मईया मंत्र' },
];

export const DigitalJapMalaModal: React.FC<DigitalJapMalaModalProps> = ({ isOpen, onClose }) => {
  const [count, setCount] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // load saved count
    try {
      const savedMala = localStorage.getItem('digital_mala_completed');
      if (savedMala) setCompletedMalas(parseInt(savedMala, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleTap = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);

    if (soundEnabled) {
      spiritualAudio.playBeadTap();
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    const nextCount = count + 1;
    if (nextCount >= 108) {
      setCount(0);
      const nextMala = completedMalas + 1;
      setCompletedMalas(nextMala);
      try {
        localStorage.setItem('digital_mala_completed', nextMala.toString());
      } catch {
        // ignore
      }
      spiritualAudio.playTempleBell();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    if (window.confirm('क्या आप वर्तमान जाप गणना को 0 पर रीसेट करना चाहते हैं?')) {
      setCount(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/80 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📿</span>
            <div>
              <h2 className="text-xl font-bold font-serif">डिजिटल 108 जप माला</h2>
              <p className="text-xs text-amber-100">साधना एवं दिव्य मंत्र जाप काउंटर</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex flex-col items-center">
          {/* Mantra Selector */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              जाप हेतु मंत्र चुनें:
            </label>
            <select
              value={selectedMantra.id}
              onChange={e => {
                const found = MANTRAS.find(m => m.id === e.target.value);
                if (found) setSelectedMantra(found);
              }}
              className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              {MANTRAS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name.length > 35 ? m.name.substring(0, 35) + '...' : m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Mantra Banner */}
          <div className="w-full p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-center">
            <p className="text-base font-bold text-amber-950 font-serif leading-relaxed">
              {selectedMantra.name}
            </p>
            <p className="text-xs text-amber-800/80 mt-1">
              {selectedMantra.meaning}
            </p>
          </div>

          {/* Beads Display Progress Ring & Big Tap Button */}
          <div className="relative flex flex-col items-center my-2">
            {/* Outer Decorative Ring */}
            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 -rotate-90 transform">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-amber-100"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={2 * Math.PI * 110 * (1 - count / 108)}
                  strokeLinecap="round"
                  className="text-orange-500 transition-all duration-150"
                  fill="transparent"
                />
              </svg>

              {/* Big Center Touch / Click Circle */}
              <button
                type="button"
                onClick={handleTap}
                className={`absolute w-48 h-48 rounded-full bg-gradient-to-b from-amber-500 to-orange-600 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform duration-100 border-4 border-white select-none ${
                  animating ? 'scale-95 ring-8 ring-amber-300' : 'hover:scale-[1.02]'
                }`}
              >
                <span className="text-xs uppercase tracking-widest text-amber-100 font-bold mb-1">
                  मनका स्पर्श करें
                </span>
                <span className="text-5xl font-black font-mono tracking-tight drop-shadow-md">
                  {count}
                </span>
                <span className="text-xs text-amber-100 font-medium mt-1">
                  / 108 मनके
                </span>
              </button>
            </div>
          </div>

          {/* Mala Stats */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">पूर्ण माला</p>
                <p className="text-lg font-bold text-gray-900">{completedMalas}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">कुल जप संख्या</p>
                <p className="text-lg font-bold text-gray-900">{completedMalas * 108 + count}</p>
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center space-x-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>ध्वनि चालू</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span>ध्वनि मूक</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>रीसेट करें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
