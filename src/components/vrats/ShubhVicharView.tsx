import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Share2, Volume2, VolumeX, Copy, Check, Quote, Heart } from 'lucide-react';
import { SHUBH_VICHAR_DATA, ShubhVicharItem } from '../../data/shubhVicharData';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface ShubhVicharViewProps {
  onBack?: () => void;
}

export const ShubhVicharView: React.FC<ShubhVicharViewProps> = ({ onBack }) => {
  const [selectedVichar, setSelectedVichar] = useState<ShubhVicharItem>(SHUBH_VICHAR_DATA[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleSpeak = (vichar: ShubhVicharItem) => {
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${vichar.quoteHindi}। भावार्थ: ${vichar.meaning}। जीवन सूत्र: ${vichar.practicalWisdom}`;
      spiritualAudio.speakText(textToRead, () => setIsPlayingAudio(false));
    }
  };

  const handleCopy = (vichar: ShubhVicharItem) => {
    const text = `🌸 *दैनिक शुभ विचार* 🌸\n\n"${vichar.quoteHindi}"\n\n— *${vichar.author}* (${vichar.source})\n\n💡 *भावार्थ:* ${vichar.meaning}\n\n✨ *जीवन सूत्र:* ${vichar.practicalWisdom}\n\nसनातन व्रत एवं महापर्व: https://chhathpuja.org/#shubh-vichar`;
    navigator.clipboard.writeText(text);
    setCopiedId(vichar.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (vichar: ShubhVicharItem) => {
    const text = `🌸 *दैनिक शुभ विचार* 🌸\n\n"${vichar.quoteHindi}"\n\n— *${vichar.author}* (${vichar.source})\n\n💡 *भावार्थ:* ${vichar.meaning}\n\nसनातन व्रत एवं महापर्व: https://chhathpuja.org/#shubh-vichar`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'दैनिक शुभ विचार',
          text: text
        });
      } catch {
        // fallback
      }
    } else {
      handleCopy(vichar);
      alert('सुविचार कॉपी कर लिया गया है!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-amber-500" />
                दैनिक शुभ विचार व अमृत वचन
              </h1>
              <p className="text-xs text-gray-500">भगवद्गीता, वेद, उपनिषद एवं संतों के अनमोल विचार</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Featured Daily Card */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <Quote className="absolute -bottom-6 -right-6 w-36 h-36 text-white/10 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                {selectedVichar.date} • {selectedVichar.dayHindi}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleSpeak(selectedVichar)}
                  className={`p-2 rounded-full transition-all backdrop-blur-md ${
                    isPlayingAudio ? 'bg-white text-orange-600 animate-pulse' : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title="सुविचार सुनें"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(selectedVichar)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md"
                  title="कॉपी करें"
                >
                  {copiedId === selectedVichar.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleShare(selectedVichar)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md"
                  title="शेयर करें"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xl sm:text-2xl font-bold font-serif leading-relaxed text-amber-50 text-center py-2 drop-shadow-sm whitespace-pre-line">
              "{selectedVichar.quoteHindi}"
            </p>

            <div className="text-center">
              <p className="text-sm font-bold text-white font-serif">
                — {selectedVichar.author}
              </p>
              <p className="text-xs text-amber-100 font-medium mt-0.5">
                स्रोत: {selectedVichar.source}
              </p>
            </div>

            <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 space-y-2 text-xs sm:text-sm">
              <p className="leading-relaxed">
                <strong className="text-amber-200">💡 भावार्थ:</strong> {selectedVichar.meaning}
              </p>
              <p className="leading-relaxed text-amber-100 border-t border-white/15 pt-2">
                <strong className="text-white">✨ जीवन में अपनाएं:</strong> {selectedVichar.practicalWisdom}
              </p>
            </div>
          </div>
        </div>

        {/* All Quotes Cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-gray-800 flex items-center">
            <Heart className="w-4 h-4 mr-2 text-amber-600" />
            अन्य पावन प्रेरणा सूत्र
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHUBH_VICHAR_DATA.map(vichar => (
              <div
                key={vichar.id}
                onClick={() => setSelectedVichar(vichar)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedVichar.id === vichar.id
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-white border-gray-200/90 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                      {vichar.dayHindi}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {vichar.source.split('(')[0]}
                    </span>
                  </div>

                  <p className="text-sm font-bold font-serif text-gray-900 line-clamp-2 leading-relaxed">
                    "{vichar.quoteHindi}"
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    — {vichar.author}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {vichar.meaning}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-amber-700 font-semibold">
                    विस्तार से देखें →
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleShare(vichar);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                    title="शेयर करें"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
