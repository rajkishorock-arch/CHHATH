import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Volume2, VolumeX, Share2, ZoomIn, ZoomOut, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { CHALISA_PAATH_DATA, ChalisaPaathItem } from '../../data/chalisaPaathData';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface PaathChalisaListViewProps {
  onBack?: () => void;
  onOpenJapMala?: () => void;
}

export const PaathChalisaListView: React.FC<PaathChalisaListViewProps> = ({ onBack, onOpenJapMala }) => {
  const [selectedItem, setSelectedItem] = useState<ChalisaPaathItem | null>(null);
  const [fontSize, setFontSize] = useState<number>(17);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleSpeak = () => {
    if (!selectedItem) return;
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${selectedItem.hindiTitle}। ${selectedItem.content.map(c => `${c.sectionTitle || ''} ${c.text}`).join('। ')}`;
      spiritualAudio.speakText(textToRead, () => setIsPlayingAudio(false));
    }
  };

  const handleShare = async (item: ChalisaPaathItem) => {
    const fullText = `${item.hindiTitle}\n\n${item.content.map(c => `${c.sectionTitle || ''}\n${c.text}`).join('\n\n')}\n\nसम्पूर्ण चालीसा एवं नित्य पाठ: https://chhathpuja.org/#paath-chalisa`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.hindiTitle,
          text: fullText
        });
      } catch {
        // fallback
      }
    } else {
      navigator.clipboard.writeText(fullText);
      alert('चालीसा पाठ कॉपी कर लिया गया है!');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ee] text-[#451a03] animate-ios-slide-in pb-24 flex flex-col">
      {/* 1. TOP HEADER (Exact Screenshot 1: Circular Back, Centered "पाठ व चालीसा", Circular Home) */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
              aria-label="वापस जाएं"
              title="वापस"
            >
              <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
            </button>
          )}

          <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide text-center flex-1">
            पाठ व चालीसा
          </h1>

          {onOpenJapMala ? (
            <button
              onClick={onOpenJapMala}
              className="px-3 py-1.5 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] text-[#9a3412] text-xs font-bold transition-all shadow-xs border border-[#fde68a] flex items-center space-x-1 cursor-pointer"
              title="जप माला खोलें"
            >
              <span>📿 जप माला</span>
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-md mx-auto w-full px-3 sm:px-4 py-3 space-y-3">
        <div className="space-y-2.5">
          {CHALISA_PAATH_DATA.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group p-3.5 sm:p-4 bg-gradient-to-b from-[#fffaf3] to-[#fdeddc] rounded-2xl border border-[#fbd8b3]/90 hover:border-[#ea580c]/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#9a3412] border border-[#fed7aa]">
                    {item.versesCount} • {item.estimatedTime}
                  </span>
                  <span className="text-xs font-bold text-[#ea580c] group-hover:translate-x-0.5 transition-transform">
                    पाठ करें →
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black font-serif text-[#78350f] group-hover:text-[#ea580c] transition-colors">
                  {item.hindiTitle}
                </h3>
                <p className="text-[11px] text-[#9a3412] mt-0.5 font-bold font-mukta">
                  ईष्ट देव: {item.deity}
                </p>

                <p className="text-xs text-[#78350f]/80 mt-1.5 line-clamp-2 leading-relaxed font-mukta">
                  {item.significance}
                </p>

                <div className="mt-3 space-y-1">
                  {item.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-center text-[11px] text-gray-500">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-green-500 shrink-0" />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center text-amber-600 font-medium text-[11px]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  दैनिक साधना पाठ
                </span>
                <span className="font-bold text-amber-600">
                  पाठ प्रारंभ →
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reader Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-100">{itemTypeLabel(selectedItem.type)}</span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {selectedItem.hindiTitle}
                </h2>
                <p className="text-xs text-amber-100 mt-0.5">ईष्ट देव: {selectedItem.deity}</p>
              </div>
              <button
                onClick={() => {
                  spiritualAudio.stopSpeaking();
                  setIsPlayingAudio(false);
                  setSelectedItem(null);
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleSpeak}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isPlayingAudio
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>रोकें</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>पाठ सुनें 🔊</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-xl px-1.5 py-1">
                  <button
                    onClick={() => setFontSize(s => Math.max(14, s - 1))}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-gray-500">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(s => Math.min(26, s + 1))}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleShare(selectedItem)}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                  title="शेयर करें"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {selectedItem.content.map((sec, i) => (
                <div key={i} className="space-y-2">
                  {sec.sectionTitle && (
                    <div className="text-center font-bold text-amber-800 text-sm py-1 border-b border-amber-200/60 mb-2">
                      {sec.sectionTitle}
                    </div>
                  )}
                  <div 
                    className="text-gray-900 leading-loose font-serif text-center whitespace-pre-line"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {sec.text}
                  </div>
                  {sec.meaning && (
                    <div className="p-3 bg-amber-50/80 rounded-xl text-xs text-amber-900 leading-relaxed font-sans border border-amber-200">
                      <strong>भावार्थ:</strong> {sec.meaning}
                    </div>
                  )}
                </div>
              ))}

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950 space-y-2">
                <p className="font-bold">✨ नित्य पाठ के दिव्य लाभ:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedItem.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-xs text-gray-700">
                      <span className="text-orange-500">❖</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function itemTypeLabel(type: string): string {
  switch (type) {
    case 'chalisa': return 'श्री पावन चालीसा';
    case 'kavach': return 'परम दिव्य रक्षा कवच';
    case 'stotram': return 'मंगल स्तोत्र';
    default: return 'नित्य पाठ';
  }
}
