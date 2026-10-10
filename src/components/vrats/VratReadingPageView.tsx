import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Home, Volume2, VolumeX, Bell, ZoomIn, ZoomOut, 
  Share2, CheckCircle2, BookOpen, Sparkles, Flame, Check, Copy
} from 'lucide-react';
import { VratDirectoryEntry } from '../../data/vratDirectoryList';
import { spiritualAudio } from '../../utils/spiritualAudio';

export type VratReadingTab = 'vidhi' | 'katha' | 'samagri' | 'mantra' | 'aarti';

interface VratReadingPageViewProps {
  entry: VratDirectoryEntry;
  initialTab?: VratReadingTab;
  onBack: () => void;
  onGoHome: () => void;
}

export const VratReadingPageView: React.FC<VratReadingPageViewProps> = ({
  entry,
  initialTab = 'vidhi',
  onBack,
  onGoHome
}) => {
  const [activeTab, setActiveTab] = useState<VratReadingTab>(initialTab);
  const [fontSize, setFontSize] = useState<number>(18);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Scroll to top on mount and tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    spiritualAudio.stopSpeaking();
    setIsPlayingAudio(false);
  }, [entry.id, activeTab]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      spiritualAudio.stopSpeaking();
    };
  }, []);

  const handlePlayBell = () => {
    spiritualAudio.playTempleBell();
  };

  const getActiveTextToRead = (): string => {
    switch (activeTab) {
      case 'vidhi':
        return `${entry.title} पूजा विधि। ${entry.vidhiSteps.join('। ')}`;
      case 'katha':
        return `${entry.kathaTitle}। ${entry.kathaStory}`;
      case 'samagri':
        return `${entry.title} पूजन सामग्री सूची। ${entry.samagriList.join(', ')}`;
      case 'mantra':
        return `${entry.title} महामंत्र। ${entry.mantra}। अर्थ: ${entry.mantraMeaning}`;
      case 'aarti':
        return `${entry.aartiTitle}। ${entry.aartiLyrics}`;
      default:
        return entry.title;
    }
  };

  const handleToggleSpeak = () => {
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = getActiveTextToRead();
      spiritualAudio.speakText(text, () => setIsPlayingAudio(false));
    }
  };

  const handleShareOrCopy = async () => {
    const textToShare = `🙏 *${entry.title}* 🙏\n` +
      `ईष्ट देव: ${entry.deity}\n` +
      `तिथि: ${entry.tithi} (${entry.month})\n\n` +
      getActiveTextToRead() +
      `\n\nसनातन पूजा विधि व संपूर्ण व्रत ऐप: https://chhathvibes.vercel.app`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: entry.title,
          text: textToShare
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="bg-[#fdf6ee] text-[#451a03] animate-ios-slide-in flex flex-col pb-3">
      {/* 1. TOP HEADER (Exact matching Screenshot Style: Back Arrow, Title, Home Button) */}
      <header className="sticky top-0 z-40 bg-[#fffaf5]/95 backdrop-blur-md border-b border-[#fed7aa]/60 shadow-xs px-3 sm:px-4 py-2.5">
        <div className="max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={() => {
              spiritualAudio.stopSpeaking();
              onBack();
            }}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
          </button>

          {/* Centered Title */}
          <div className="flex-1 text-center min-w-0 px-2">
            <h1 className="font-serif font-black text-lg sm:text-xl text-[#7c2d12] truncate">
              {entry.title}
            </h1>
            <p className="text-[11px] text-[#9a3412]/80 truncate font-mukta font-bold">
              {entry.deity}
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              spiritualAudio.stopSpeaking();
              onGoHome();
            }}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a]"
            aria-label="होम स्क्रीन पर जाएं"
            title="होम स्क्रीन"
          >
            <Home className="w-5 h-5 text-[#9a3412]" />
          </button>
        </div>
      </header>

      {/* 2. AUDIO RECITATION & FONT TOOLBAR */}
      <div className="bg-[#fff7ed] border-b border-[#fed7aa]/50 px-3 sm:px-4 py-2 shadow-xs">
        <div className="max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Audio TTS Listen / Pause */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleSpeak}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white hover:brightness-105'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>रोकें ⏹</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>पाठ सुनें 🔊</span>
                </>
              )}
            </button>

            {/* Temple Bell */}
            <button
              onClick={handlePlayBell}
              className="px-2.5 py-1.5 rounded-full bg-white text-[#9a3412] border border-[#fed7aa] text-xs font-bold hover:bg-[#ffedd5] active:scale-95 transition-all shadow-xs flex items-center space-x-1"
              title="मंदिर की घंटी बजाएं"
            >
              <Bell className="w-3.5 h-3.5 text-[#ea580c] animate-swing" />
              <span className="hidden sm:inline">घंटी</span>
            </button>
          </div>

          {/* Font Controls & Share */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white border border-[#fed7aa] rounded-full px-1.5 py-0.5 shadow-xs">
              <button
                onClick={() => setFontSize(s => Math.max(14, s - 1))}
                className="p-1 hover:bg-[#fff7ed] rounded-full text-[#78350f] transition-colors"
                title="अक्षर छोटा करें"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-[#78350f] px-1.5 min-w-[32px] text-center">
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(s => Math.min(26, s + 1))}
                className="p-1 hover:bg-[#fff7ed] rounded-full text-[#78350f] transition-colors"
                title="अक्षर बड़ा करें"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleShareOrCopy}
              className="p-2 rounded-full bg-white border border-[#fed7aa] text-[#9a3412] hover:bg-[#fff7ed] active:scale-95 transition-all shadow-xs"
              title="शेयर या कॉपी करें"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SACRED TABS NAVIGATION (पूजा विधि • व्रत कथा • पूजन सामग्री • मंत्र • आरती) */}
      <div className="sticky top-[57px] z-30 bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#fed7aa]/40 px-2 py-2">
        <div className="max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'vidhi', label: 'पूजा विधि', icon: '📜' },
            { id: 'katha', label: 'व्रत कथा', icon: '📖' },
            { id: 'samagri', label: 'सामग्री', icon: '🧺' },
            { id: 'mantra', label: 'मंत्र', icon: 'ॐ' },
            { id: 'aarti', label: 'आरती', icon: '🪔' },
          ].map(tab => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as VratReadingTab)}
                className={`flex-1 py-1.5 px-2 rounded-full text-xs font-bold transition-all whitespace-nowrap text-center flex items-center justify-center space-x-1 ${
                  isTabActive
                    ? 'bg-gradient-to-r from-[#ff6b52] to-[#ff4767] text-white shadow-sm ring-1 ring-[#ff5858]/60 scale-[1.02]'
                    : 'bg-[#fef3c7]/60 text-[#78350f] hover:bg-[#fde68a] hover:text-[#9a3412]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN READING CONTENT AREA */}
      <main className="max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full px-4 py-4 space-y-4">
        {/* Deity Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] p-4 border border-[#fed7aa] shadow-xs flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shrink-0 shadow-md overflow-hidden ring-2 ring-[#ea580c]/30">
            <img
              src={entry.avatarUrl}
              alt={entry.title}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-[#ea580c] text-white text-[10px] font-bold">
                {entry.month}
              </span>
              <span className="text-[11px] font-bold text-[#9a3412]">
                {entry.tithi}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-[#7c2d12] mt-0.5 truncate">
              {entry.title}
            </h2>
            <p className="text-xs text-[#78350f] font-semibold mt-0.5 truncate">
              शुभ वर्ष 2026: {entry.date2026}
            </p>
          </div>
        </div>

        {/* TAB 1: पूजा विधि */}
        {activeTab === 'vidhi' && (
          <div className="space-y-3">
            <div className="bg-[#fff7ed] rounded-2xl p-3 border border-[#fed7aa] flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#ea580c] shrink-0" />
              <p className="text-xs font-bold text-[#78350f]">
                {entry.title} की शास्त्रसम्मत संपूर्ण पूजा विधि एवं नियम:
              </p>
            </div>

            <div className="space-y-3">
              {entry.vidhiSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-[#fed7aa]/70 shadow-xs hover:border-[#ea580c]/40 transition-all flex items-start space-x-3.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f59e0b] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <p
                    className="leading-relaxed text-[#292524] font-serif flex-1"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: व्रत कथा */}
        {activeTab === 'katha' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#fed7aa] shadow-xs space-y-4">
            <div className="border-b border-[#fed7aa] pb-3 text-center">
              <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#9a3412] text-xs font-bold inline-block mb-1">
                📖 पावन पौराणिक प्रसंग
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-serif text-[#7c2d12]">
                {entry.kathaTitle}
              </h3>
            </div>

            <div
              className="text-[#292524] font-serif leading-loose whitespace-pre-line space-y-4"
              style={{ fontSize: `${fontSize}px` }}
            >
              {entry.kathaStory}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] text-xs text-[#78350f] font-semibold text-center mt-4">
              🙏 जो भी भक्त इस पावन कथा का पठन व श्रवण करता है, उसे मनोवांछित फल की प्राप्ति होती है।
            </div>
          </div>
        )}

        {/* TAB 3: पूजन सामग्री */}
        {activeTab === 'samagri' && (
          <div className="space-y-3">
            <div className="bg-[#fff7ed] rounded-2xl p-3 border border-[#fed7aa] flex items-center justify-between">
              <p className="text-xs font-bold text-[#78350f]">
                {entry.title} हेतु अनिवार्य पूजन सामग्री ({entry.samagriList.length} वस्तुएं)
              </p>
              <span className="text-[11px] text-[#ea580c] font-bold">चेकलिस्ट</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {entry.samagriList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3 border border-[#fed7aa]/70 shadow-xs flex items-center space-x-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span
                    className="font-serif font-bold text-[#292524]"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: मंत्र */}
        {activeTab === 'mantra' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#fff7ed] to-[#fed7aa]/50 rounded-3xl p-6 border border-[#fed7aa] shadow-xs text-center space-y-3">
              <span className="w-12 h-12 rounded-full bg-[#ea580c] text-white text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
                ॐ
              </span>

              <h3 className="text-sm font-bold text-[#9a3412] uppercase tracking-wider">
                {entry.title} सिद्धि व फल प्रदाता महामंत्र
              </h3>

              <div
                className="font-serif font-black text-[#7c2d12] leading-relaxed p-4 bg-white rounded-2xl border border-[#fed7aa] shadow-inner"
                style={{ fontSize: `${fontSize + 3}px` }}
              >
                {entry.mantra}
              </div>

              <div className="text-left bg-white/80 rounded-2xl p-4 border border-[#fed7aa]/60 mt-3 space-y-1">
                <span className="text-xs font-bold text-[#9a3412] block">
                  मंत्र का पावन अर्थ:
                </span>
                <p
                  className="text-[#451a03] font-serif leading-relaxed"
                  style={{ fontSize: `${fontSize - 1}px` }}
                >
                  {entry.mantraMeaning}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-[#fed7aa] text-center text-xs text-[#78350f]">
              ✨ नित्य कम से कम 11, 21 या 108 बार इस महामंत्र का श्रद्धापूर्वक जप करें।
            </div>
          </div>
        )}

        {/* TAB 5: आरती */}
        {activeTab === 'aarti' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#fed7aa] shadow-xs space-y-4">
            <div className="text-center space-y-1 border-b border-[#fed7aa] pb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f59e0b] text-white flex items-center justify-center mx-auto shadow-sm">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-serif text-[#7c2d12] pt-1">
                {entry.aartiTitle}
              </h3>
              <p className="text-xs text-[#9a3412]">भक्ति व प्रेम भाव से आरती का गायन करें</p>
            </div>

            <div
              className="font-serif text-[#292524] leading-loose text-center whitespace-pre-line space-y-4 py-2"
              style={{ fontSize: `${fontSize}px` }}
            >
              {entry.aartiLyrics}
            </div>

            <div className="p-3 bg-[#fff7ed] rounded-2xl border border-[#fed7aa] text-center text-xs font-bold text-[#78350f]">
              🪔 कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम्। सदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
