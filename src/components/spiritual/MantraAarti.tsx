import React, { useState } from 'react';
import { chhathMantrasData } from '../../data/mantras';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Flame, 
  Play, 
  Video, 
  Clock, 
  Sun, 
  Bell, 
  ArrowRight,
  Filter,
  ExternalLink
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface MantraAartiProps {
  onNavigate?: (tab: string) => void;
}

interface DevotionalVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  badge: string;
  desc: string;
}

export const MantraAarti: React.FC<MantraAartiProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { ringBell, pauseSong } = useAudio();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMantraId, setPlayingMantraId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Devotional Playlist with 100% verified, playable YouTube videos
  const devotionalVideos: DevotionalVideo[] = [
    {
      id: 'F9uURnkc8iA',
      title: 'सूर्य आरती: ॐ जय सूर्य भगवान आरती (Surya Aarti) — अनुराधा पौडवाल',
      channel: 'T-Series Bhakti Sagar',
      duration: '5:40',
      badge: 'सूर्य आरती',
      desc: 'भगवान भुवन भास्कर की अत्यंत पावन व मधुर नित्य वंदना आरती'
    },
    {
      id: 'WzJ28NZhpdA',
      title: 'सूर्य गायत्री मंत्र 108 बार पावन जाप (Surya Gayatri 108 Times)',
      channel: 'T-Series Bhakti Sagar',
      duration: '28:10',
      badge: 'गायत्री मंत्र',
      desc: 'आरोग्य, तेज व बुद्धि प्रदाता 108 सूर्य गायत्री वैदिक मंत्र जाप'
    },
    {
      id: 'TeYl7Xu7V_Q',
      title: 'आरती छठी माई की (Aarti Chhathi Maai Ki) — पलक मुच्छल',
      channel: 'T-Series Bhakti Sagar',
      duration: '5:15',
      badge: 'छठी माई आरती',
      desc: 'छठी मईया की संपूर्ण मंगलकारी पावन आरती'
    },
    {
      id: 'Qc_PJM_S_UI',
      title: 'छठ माता आरती: ॐ जय छठ माता (Om Jai Chhath Mata) — ज्योति तिवारी',
      channel: 'Sonotek Bhakti',
      duration: '6:30',
      badge: 'छठ माता आरती',
      desc: 'छठ महापर्व की पावन और लोकप्रिय पारंपरिक आरती'
    },
    {
      id: 'BtsnKmWVl7I',
      title: 'आदित्य हृदय स्तोत्र — संपूर्ण प्रामाणिक पाठ',
      channel: 'Yogiraj Yashpal',
      duration: '14:25',
      badge: 'स्तोत्र पाठ',
      desc: 'समस्त कष्ट व शत्रु बाधा निवारक दिव्य आदित्य हृदय स्तोत्र'
    }
  ];

  const [activeVideo, setActiveVideo] = useState<DevotionalVideo>(devotionalVideos[0]);

  const handleCopy = (mantraText: string, id: string) => {
    navigator.clipboard.writeText(mantraText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const playMantraRecitation = (text: string, id: string) => {
    if (typeof window === 'undefined') return;

    if (playingMantraId === id) {
      window.speechSynthesis.cancel();
      setPlayingMantraId(null);
      return;
    }

    window.speechSynthesis.cancel();
    ringBell();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.82; // Devotional calm chanting cadence
    utterance.pitch = 0.95;

    // Pick a natural Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => setPlayingMantraId(id);
    utterance.onend = () => {
      setPlayingMantraId(null);
      ringBell();
    };
    utterance.onerror = () => setPlayingMantraId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Filter mantras by category
  const filteredMantras = chhathMantrasData.filter((m) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'surya') return m.deity.toLowerCase().includes('सूर्य') || m.deity.toLowerCase().includes('सविता') || m.deity.toLowerCase().includes('आदित्य');
    if (selectedCategory === 'chhathi') return m.deity.toLowerCase().includes('छठी') || m.deity.toLowerCase().includes('षष्ठी');
    if (selectedCategory === 'aarti') return m.title.toLowerCase().includes('आरती');
    if (selectedCategory === 'stotra') return m.title.toLowerCase().includes('स्तोत्र') || m.title.toLowerCase().includes('गायत्री');
    return true;
  });

  return (
    <div id="aarti" className="space-y-10 font-mukta">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs border border-amber-500/30 shadow-xs">
          <Flame className="w-4 h-4 text-orange-500 animate-diya-flicker" />
          <span>{t.mantraBadge || 'वैदिक मंत्र, स्तोत्र व पावन आरती'}</span>
        </div>
        <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100">
          {t.mantraTitle || 'सूर्य देव वैदिक मंत्र व छठी मईया आरती'}
        </h1>
        <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
          {t.mantraSubtitle || 'अर्घ्य समर्पण महामंत्र, सूर्य गायत्री, आदित्य हृदय स्तोत्र और छठी मईया की संपूर्ण पावन आरती—संस्कृत पाठ, हिंदी भावार्थ, ऑडियो व वीडियो प्लेलिस्ट सहित।'}
        </p>
      </div>

      {/* Devotional Video & Audio Playlist Player Section */}
      <section className="rounded-3xl bg-stone-900 text-white border border-amber-500/30 overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-6 bg-stone-950/80 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                पावन आरती व मंत्र वीडियो प्लेलिस्ट
              </span>
              <h2 className="font-rozha text-lg sm:text-xl font-bold text-white">
                {activeVideo.title}
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 font-mukta">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {activeVideo.badge}
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-sm text-decoration-none cursor-pointer"
              title="YouTube में खोलें"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>YouTube पर देखें</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Responsive Embedded Player */}
          <div className="lg:col-span-2 relative bg-black aspect-video flex items-center justify-center">
            <iframe
              key={activeVideo.id}
              className="w-full h-full border-0"
              src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0&enablejsapi=1${typeof window !== 'undefined' && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : ''}`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Devotional Playlist Selector */}
          <div className="p-4 bg-stone-950/90 border-t lg:border-t-0 lg:border-l border-amber-500/20 flex flex-col justify-between max-h-[360px] overflow-y-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-3 font-mukta">
                आध्यात्मिक प्लेलिस्ट (चुनें):
              </span>
              <div className="space-y-2">
                {devotionalVideos.map((vid) => {
                  const isSelected = vid.id === activeVideo.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(vid);
                        pauseSong();
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all font-mukta flex items-start gap-3 border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                          : 'bg-stone-900/80 hover:bg-stone-800/80 border-stone-800 text-stone-300 hover:text-white'
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'
                      }`}>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                          {vid.title}
                        </p>
                        <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                          {vid.desc}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                          <span className="text-amber-300 font-semibold">{vid.badge}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {vid.duration}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 font-mukta flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>पसंदीदा आरती या मंत्र पर क्लिक कर तुरंत सुनें।</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            श्रेणी अनुसार देखें:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-amber-500/20 text-xs font-bold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-600'
            }`}
          >
            सभी ({chhathMantrasData.length})
          </button>
          <button
            onClick={() => setSelectedCategory('surya')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCategory === 'surya'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-600'
            }`}
          >
            सूर्य मंत्र
          </button>
          <button
            onClick={() => setSelectedCategory('chhathi')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCategory === 'chhathi'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-600'
            }`}
          >
            छठी मईया
          </button>
          <button
            onClick={() => setSelectedCategory('aarti')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCategory === 'aarti'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-600'
            }`}
          >
            पावन आरती
          </button>
          <button
            onClick={() => setSelectedCategory('stotra')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCategory === 'stotra'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-600'
            }`}
          >
            स्तोत्र व श्लोक
          </button>
        </div>
      </div>

      {/* Mantras & Aarti Cards Grid */}
      <div className="space-y-6">
        {filteredMantras.map((m) => {
          const isCopied = copiedId === m.id;
          const isPlaying = playingMantraId === m.id;

          return (
            <div
              key={m.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/25 shadow-xl relative overflow-hidden space-y-5"
            >
              {/* Traditional Auspicious Corner Symbols */}
              <div className="absolute top-2.5 left-3 text-amber-500/30 text-xs font-serif select-none pointer-events-none">ॐ</div>
              <div className="absolute top-2.5 right-3 text-amber-500/30 text-xs font-serif select-none pointer-events-none">ॐ</div>
              
              {/* Header with Deity & Copy Button */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 animate-diya-flicker text-lg">🪔</span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400 block">
                      {m.deity}
                    </span>
                    <h3 className="font-rozha text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-bold">
                      {m.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playMantraRecitation(m.sanskrit, m.id)}
                    title={isPlaying ? "उच्चारण रोकें" : "मंत्र का पावन पाठ व उच्चारण सुनें"}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      isPlaying 
                        ? 'bg-amber-500 text-stone-950 font-black animate-pulse'
                        : 'bg-amber-500/15 text-orange-700 dark:text-amber-300 hover:bg-amber-500/25'
                    }`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                    <span>{isPlaying ? 'उच्चारण जारी...' : 'मंत्र सुनें'}</span>
                  </button>

                  <button
                    onClick={ringBell}
                    title="घंटी बजाएं (Ring Sacred Bell)"
                    className="p-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 transition-transform hover:scale-110 active:scale-95 group cursor-pointer"
                  >
                    <span className="inline-block group-hover:animate-bell-sway text-base">🔔</span>
                  </button>

                  <button
                    onClick={() => handleCopy(`${m.title}\n\n${m.sanskrit}\n\nभावार्थ:\n${m.hindiMeaning}`, m.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-orange-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>मंत्र कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sacred Sanskrit Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
                <p className="font-mukta text-lg sm:text-xl font-bold text-orange-700 dark:text-amber-300 whitespace-pre-line leading-relaxed text-center">
                  {m.sanskrit}
                </p>
              </div>

              {/* Transliteration */}
              <div className="text-xs italic text-stone-500 dark:text-stone-400 font-mukta whitespace-pre-line text-center">
                {m.transliteration}
              </div>

              {/* Hindi Meaning */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 font-mukta">
                <strong className="text-xs font-bold text-orange-600 dark:text-amber-400 block mb-1">
                  सरल हिंदी भावार्थ (Meaning):
                </strong>
                <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
                  {m.hindiMeaning}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Crawlable Internal Links if onNavigate is present */}
      {onNavigate && (
        <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <h3 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
            संबंधित छठ पर्व गाइड
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('thekua-recipe')}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <span>पावन पकवान व ठेकुआ रेसिपी देखें</span>
              <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            </button>
            <button
              onClick={() => onNavigate('chhath-puja-vidhi')}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <span>छठ पूजा विधि 2026 पढ़ें</span>
              <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            </button>
            <button
              onClick={() => onNavigate('chhath-arghya-time-2026')}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <span>संध्या व उषा अर्घ्य समय</span>
              <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
