import React, { useState, useMemo } from 'react';
import { Search, Flame, ArrowLeft, Volume2, VolumeX, Share2, ZoomIn, ZoomOut, Bell, Sparkles, X } from 'lucide-react';
import { ALL_AARTIS_DATA, AartiItem } from '../../data/allAartisData';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface AartiSangrahListViewProps {
  onBack?: () => void;
  initialAartiTitle?: string;
}

export const AartiSangrahListView: React.FC<AartiSangrahListViewProps> = ({ onBack, initialAartiTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAarti, setSelectedAarti] = useState<AartiItem | null>(() => {
    if (initialAartiTitle) {
      const match = ALL_AARTIS_DATA.find(a => 
        a.hindiTitle.includes(initialAartiTitle) || a.title.toLowerCase().includes(initialAartiTitle.toLowerCase())
      );
      return match || null;
    }
    return null;
  });

  const [fontSize, setFontSize] = useState<number>(17);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredAartis = useMemo(() => {
    return ALL_AARTIS_DATA.filter(item => {
      const matchSearch =
        item.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lyrics.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handlePlayBell = () => {
    spiritualAudio.playTempleBell();
  };

  const handleToggleSpeak = () => {
    if (!selectedAarti) return;
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      spiritualAudio.speakText(
        `${selectedAarti.hindiTitle}। ${selectedAarti.lyrics}`,
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleShare = async (aarti: AartiItem) => {
    const shareText = `🪔 *${aarti.hindiTitle}* 🪔\n\n${aarti.lyrics}\n\nसकल आरती संग्रह व संपूर्ण व्रत पंचांग: https://chhathpuja.org/#aarti-sangrah`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: aarti.hindiTitle,
          text: shareText
        });
      } catch {
        // fallback
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('आरती कॉपी कर ली गई है!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
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
                <Flame className="w-6 h-6 mr-2 text-orange-500" />
                संपूर्ण आरती संग्रह
              </h1>
              <p className="text-xs text-gray-500">नित्य पूजन, संध्या वंदन एवं महापर्व आरतियां</p>
            </div>
          </div>

          <button
            onClick={handlePlayBell}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            title="मंदिर की पावन घंटी बजाएं"
          >
            <Bell className="w-4 h-4 animate-swing" />
            <span className="hidden sm:inline">घंटी बजाएं</span>
          </button>
        </div>

        {/* Search */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="आरती या देवता का नाम खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-5xl mx-auto px-4 pb-3 overflow-x-auto no-scrollbar flex items-center space-x-2">
          {[
            { id: 'all', label: 'सभी आरतियां' },
            { id: 'ganesh', label: 'गणेश जी' },
            { id: 'shiva', label: 'शिव जी' },
            { id: 'devi', label: 'माता रानी / षष्ठी' },
            { id: 'vishnu', label: 'श्री हरि / कृष्ण / राम' },
            { id: 'surya', label: 'सूर्य देव' },
            { id: 'hanuman', label: 'हनुमान जी' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aartis Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAartis.map(aarti => (
            <div
              key={aarti.id}
              onClick={() => setSelectedAarti(aarti)}
              className="group p-5 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    {aarti.deity}
                  </span>
                  <span className="text-xs text-amber-600 group-hover:translate-x-1 transition-transform">
                    पढ़ें →
                  </span>
                </div>

                <h3 className="text-base font-bold font-serif text-gray-900 group-hover:text-amber-600 transition-colors">
                  {aarti.hindiTitle}
                </h3>

                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {aarti.significance}
                </p>

                <div className="mt-3 p-3 bg-amber-50/40 rounded-xl text-xs font-serif text-gray-700 leading-relaxed border border-amber-100/60 line-clamp-3 whitespace-pre-line">
                  {aarti.lyrics}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center text-amber-700 font-medium text-[11px]">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                  संध्या एवं प्रातः वंदन
                </span>
                <span className="text-xs font-semibold text-amber-600">
                  संपूर्ण बोल देखें
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Aarti Lyrics Modal */}
      {selectedAarti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-100 font-medium">परम पावन आरती</span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {selectedAarti.hindiTitle}
                </h2>
                <p className="text-xs text-amber-100 mt-0.5">ईष्ट देव: {selectedAarti.deity}</p>
              </div>
              <button
                onClick={() => {
                  spiritualAudio.stopSpeaking();
                  setIsPlayingAudio(false);
                  setSelectedAarti(null);
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Toolbar (Sound / Font / Share) */}
            <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
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
                      <span>आरती रोकें</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>आरती सुनें 🔊</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePlayBell}
                  className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors flex items-center space-x-1"
                >
                  <span>🔔 घंटी</span>
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
                  onClick={() => handleShare(selectedAarti)}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                  title="आरती शेयर करें"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lyrics Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div 
                className="text-gray-900 leading-relaxed font-serif text-center whitespace-pre-line space-y-3 p-4 bg-orange-50/20 rounded-2xl border border-orange-100"
                style={{ fontSize: `${fontSize}px` }}
              >
                {selectedAarti.lyrics}
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">महिमा एवं फलश्रुति:</span> {selectedAarti.significance}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
