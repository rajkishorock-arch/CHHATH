import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  BookOpen,
  Home
} from 'lucide-react';
import { CHALISA_PAATH_DATA, ChalisaPaathItem } from '../../data/chalisaPaathData';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface PaathChalisaListViewProps {
  onBack?: () => void;
  onGoHome?: () => void;
  onOpenJapMala?: () => void;
}

type ReadingTheme = 'sepia' | 'dark' | 'light';

export const PaathChalisaListView: React.FC<PaathChalisaListViewProps> = ({ 
  onBack, 
  onGoHome = onBack,
  onOpenJapMala 
}) => {
  const [selectedItem, setSelectedItem] = useState<ChalisaPaathItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Futuristic Reader Settings
  const [fontSize, setFontSize] = useState<number>(18);
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('sepia');
  const [showMeaning, setShowMeaning] = useState<boolean>(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);
  const [completedChantsCount, setCompletedChantsCount] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const readerContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter Categories
  const categories = [
    { id: 'all', label: '🌟 सभी पाठ' },
    { id: 'gita', label: '📖 श्रीमद्भगवद्गीता' },
    { id: 'chalisa', label: '📿 चालीसा संग्रह' },
    { id: 'stotram', label: '⚡ महा स्तोत्रम्' },
    { id: 'paath', label: '🚩 सुंदरकांड व पाठ' }
  ];

  // Filtered Items
  const filteredData = CHALISA_PAATH_DATA.filter(item => {
    const matchesCategory = activeCategory === 'all' 
      ? true 
      : activeCategory === 'paath' 
        ? item.type === 'paath' || item.type === 'kavach'
        : item.type === activeCategory;

    const matchesSearch = searchQuery.trim() === ''
      ? true
      : (
          item.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.significance.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return matchesCategory && matchesSearch;
  });

  // Hands-free Auto-Scroll Physics for Devotees Chanting
  useEffect(() => {
    if (isAutoScrolling && selectedItem) {
      const step = scrollSpeed * 1.5;
      autoScrollIntervalRef.current = window.setInterval(() => {
        if (readerContainerRef.current) {
          readerContainerRef.current.scrollTop += step;
        } else {
          window.scrollBy({ top: step, behavior: 'auto' });
        }
      }, 40);
    } else {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    }
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed, selectedItem]);

  // Audio Speech Recitation Handler
  const handleToggleSpeak = () => {
    if (!selectedItem) return;
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${selectedItem.hindiTitle}। ${selectedItem.content.map(c => `${c.sectionTitle || ''}। ${c.text} ${showMeaning && c.meaning ? '। भावार्थ: ' + c.meaning : ''}`).join('। ')}`;
      spiritualAudio.speakText(textToRead, () => setIsPlayingAudio(false));
    }
  };

  // Complete One Chant Counter (+1 पाठ पूर्ण)
  const handleIncrementChant = () => {
    spiritualAudio.playTempleBell();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([40, 30, 60]); } catch {}
    }
    setCompletedChantsCount(prev => prev + 1);
    showToast(`🚩 1 पाठ पूर्ण! आज कुल: ${completedChantsCount + 1} बार`);
  };

  // Share Handler
  const handleShare = async (item: ChalisaPaathItem) => {
    const fullText = `🌸 *${item.hindiTitle}* 🌸\nईष्ट देव: ${item.deity}\n\n${item.content.map(c => `${c.sectionTitle || ''}\n${c.text}`).join('\n\n')}\n\n📲 सनातन व्रत एवं महापर्व ऐप — नित्य पाठ`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.hindiTitle,
          text: fullText
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(fullText);
      showToast('पाठ कॉपी कर लिया गया है!');
    }
  };

  // Copy Full Text
  const handleCopyText = (item: ChalisaPaathItem) => {
    const fullText = `🌸 *${item.hindiTitle}* 🌸\n\n${item.content.map(c => `${c.sectionTitle || ''}\n${c.text}`).join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSuccess(true);
    showToast('सम्पूर्ण पाठ कॉपी हो गया!');
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Reading Theme Style Classes
  const getThemeClasses = () => {
    switch (readingTheme) {
      case 'dark':
        return 'bg-stone-950 text-stone-100 border-amber-900/40';
      case 'light':
        return 'bg-white text-stone-900 border-stone-200';
      case 'sepia':
      default:
        return 'bg-[#fcf5e8] text-[#3d1a04] border-[#fed7aa]';
    }
  };

  return (
    <div className="bg-[#fdf6ee] text-[#451a03] pb-3 flex flex-col font-mukta">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-stone-900/95 text-amber-200 border border-amber-500/40 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-3 sm:px-6 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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

            <div>
              <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide leading-tight">
                पाठ, स्तोत्र व चालीसा
              </h1>
              <p className="text-[11px] text-[#9a3412]/80 font-bold hidden sm:block">
                श्रीमद्भगवद्गीता, सुंदरकांड, शिव तांडव, महा स्तोत्र एवं सिद्ध चालीसा संग्रह
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenJapMala && (
              <button
                onClick={onOpenJapMala}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/20 hover:from-amber-500/25 hover:to-orange-500/30 text-[#9a3412] text-xs font-extrabold transition-all border border-amber-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                title="108 जप माला"
              >
                <span>📿</span>
                <span className="hidden xs:inline">108 जप माला</span>
              </button>
            )}

            <button
              onClick={onGoHome}
              className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
              aria-label="होम स्क्रीन"
              title="होम"
            >
              <Home className="w-5 h-5 text-[#9a3412]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SEARCH & CATEGORY FILTER SECTION */}
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-6 pt-4 pb-2 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खोजें: श्रीमद्भगवद्गीता, सुंदरकांड, हनुमान चालीसा, शिव तांडव स्तोत्र..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fffaf3] border border-[#fed7aa] text-sm text-[#451a03] placeholder-amber-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-800/60 hover:text-amber-900"
            >
              हटाएं
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                  : 'bg-[#fffaf3] text-[#78350f] border border-[#fed7aa] hover:bg-[#fdeddc]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. RESPONSIVE GRID LIST (1-col Mobile, 2-col Tablet, 3-col Desktop) */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-3 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setCompletedChantsCount(0);
              }}
              className="group p-4 sm:p-5 bg-gradient-to-b from-[#fffaf3] to-[#fdeddc] rounded-3xl border border-[#fed7aa]/90 hover:border-orange-500/70 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#9a3412] border border-amber-500/25">
                    {item.categoryLabel}
                  </span>
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                    ⏱️ {item.estimatedTime}
                  </span>
                </div>

                {/* Title & Deity */}
                <h3 className="text-lg sm:text-xl font-black font-serif text-[#78350f] group-hover:text-orange-600 transition-colors leading-tight">
                  {item.hindiTitle}
                </h3>
                <p className="text-xs text-[#9a3412] mt-1 font-bold">
                  ईष्ट देव: {item.deity}
                </p>

                {/* Significance */}
                <p className="text-xs text-[#78350f]/80 mt-2 line-clamp-3 leading-relaxed">
                  {item.significance}
                </p>

                {/* Benefits */}
                <div className="mt-3.5 space-y-1 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/15">
                  <span className="text-[10px] font-bold text-amber-900 block mb-1">
                    पावन पाठ फल एवं लाभ:
                  </span>
                  {item.benefits.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex items-center text-[11px] text-stone-700 leading-tight">
                      <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3.5 mt-3.5 border-t border-[#fed7aa]/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800">
                  {item.versesCount}
                </span>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  पाठ प्रारंभ करें →
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <span className="text-3xl">📿</span>
            <p className="font-bold text-amber-900 mt-2">कोई पाठ या स्तोत्र नहीं मिला</p>
            <p className="text-xs text-stone-500 mt-1">कृपया अन्य नाम या शब्द लिखकर खोजें</p>
          </div>
        )}
      </main>

      {/* 4. DEDICATED FULL-SCREEN FUTURISTIC READER MODE (z-[80] Sits Cleanly Above Bottom Nav) */}
      {selectedItem && (
        <div 
          ref={readerContainerRef}
          className={`fixed inset-0 z-[80] overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-between ${getThemeClasses()}`}
        >
          {/* Reader Top Sticky Toolbar */}
          <header className={`sticky top-0 z-30 px-3 sm:px-6 py-2.5 backdrop-blur-md border-b flex items-center justify-between ${
            readingTheme === 'dark' 
              ? 'bg-stone-950/95 border-amber-900/50' 
              : readingTheme === 'light' 
                ? 'bg-white/95 border-stone-200' 
                : 'bg-[#fcf5e8]/95 border-[#fed7aa]'
          }`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isPlayingAudio) spiritualAudio.stopSpeaking();
                  setSelectedItem(null);
                  setIsAutoScrolling(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all cursor-pointer active:scale-95 border border-amber-500/30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>वापस</span>
              </button>

              <div className="hidden sm:block">
                <span className="text-xs font-serif font-black block truncate max-w-[200px]">
                  {selectedItem.hindiTitle}
                </span>
              </div>
            </div>

            {/* Smart Controls (Theme, Font Size, Audio, Auto-scroll) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Meaning Toggle Button */}
              <button
                onClick={() => setShowMeaning(prev => !prev)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  showMeaning 
                    ? 'bg-amber-600 text-white border-amber-600' 
                    : 'bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/30'
                }`}
                title="भावार्थ दिखाएं या छिपाएं"
              >
                <span>{showMeaning ? 'अर्थ सहित' : 'केवल मूल पाठ'}</span>
              </button>

              {/* Font Size Buttons */}
              <div className="flex items-center bg-amber-500/15 rounded-full p-0.5 border border-amber-500/30">
                <button
                  onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-amber-500/20"
                  title="अक्षर छोटे करें"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-amber-500/20"
                  title="अक्षर बड़े करें"
                >
                  A+
                </button>
              </div>

              {/* Theme Switcher */}
              <button
                onClick={() => {
                  setReadingTheme(prev => prev === 'sepia' ? 'dark' : prev === 'dark' ? 'light' : 'sepia');
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 cursor-pointer"
                title="रीडिंग थीम बदलें"
              >
                {readingTheme === 'dark' ? <Moon className="w-4 h-4" /> : readingTheme === 'light' ? <Sun className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              </button>

              {/* Audio Recitation Button */}
              <button
                onClick={handleToggleSpeak}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isPlayingAudio 
                    ? 'bg-orange-600 text-white animate-pulse' 
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200'
                }`}
                title={isPlayingAudio ? 'वाचन रोकें' : 'पाठ सुनें'}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Share Button */}
              <button
                onClick={() => handleShare(selectedItem)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 cursor-pointer"
                title="शेयर करें"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Reader Content Body */}
          <article className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
            {/* Header Banner */}
            <div className="text-center space-y-2 border-b border-amber-500/25 pb-5">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                ॐ {selectedItem.categoryLabel} • ईष्ट देव: {selectedItem.deity}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide mt-2">
                {selectedItem.hindiTitle}
              </h1>
              <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-200/80 max-w-xl mx-auto leading-relaxed">
                {selectedItem.significance}
              </p>
            </div>

            {/* Verses Content */}
            <div className="space-y-6">
              {selectedItem.content.map((sec, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 sm:p-6 rounded-3xl border transition-all ${
                    readingTheme === 'dark' 
                      ? 'bg-stone-900/60 border-amber-900/40' 
                      : readingTheme === 'light' 
                        ? 'bg-stone-50 border-stone-200' 
                        : 'bg-amber-500/5 border-[#fed7aa]/80'
                  }`}
                >
                  {sec.sectionTitle && (
                    <div className="text-center mb-3">
                      <span className="font-serif font-bold text-sm sm:text-base text-orange-600 dark:text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                        {sec.sectionTitle}
                      </span>
                    </div>
                  )}

                  {/* Sacred Text with Dynamic Font Size */}
                  <div 
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                    className="font-serif font-bold text-center whitespace-pre-line tracking-wide drop-shadow-xs"
                  >
                    {sec.text}
                  </div>

                  {/* Hindi Meaning Section */}
                  {showMeaning && sec.meaning && (
                    <div className="mt-4 pt-3.5 border-t border-amber-500/25 text-xs sm:text-sm leading-relaxed opacity-90 text-left bg-black/5 dark:bg-white/5 p-3 rounded-2xl">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                        ॥ सरल भावार्थ ॥
                      </span>
                      {sec.meaning}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chant Completion Card */}
            <div className="text-center p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 my-8 space-y-3">
              <span className="text-3xl">📿</span>
              <h3 className="font-serif font-black text-lg">
                पाठ संपूर्णम् • महा संकल्प
              </h3>
              <p className="text-xs max-w-md mx-auto opacity-80">
                श्रद्धापूर्वक किए गए पाठ से समस्त मनोकामनाएं पूर्ण होती हैं।
              </p>
              
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleIncrementChant}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🚩 +1 पाठ पूर्ण (घंटी बजाएं)</span>
                </button>

                <button
                  onClick={() => handleCopyText(selectedItem)}
                  className="px-4 py-2.5 rounded-full bg-stone-900/10 dark:bg-white/10 text-xs font-bold hover:bg-stone-900/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSuccess ? 'कॉपी हुआ' : 'कॉपी करें'}</span>
                </button>
              </div>
            </div>
          </article>

          {/* Reader Bottom Floating Bar: Hands-Free Auto-Scroll & Progress */}
          <footer className={`sticky bottom-0 z-30 px-4 py-2.5 backdrop-blur-md border-t flex items-center justify-between ${
            readingTheme === 'dark' 
              ? 'bg-stone-950/95 border-amber-900/50' 
              : readingTheme === 'light' 
                ? 'bg-white/95 border-stone-200' 
                : 'bg-[#fcf5e8]/95 border-[#fed7aa]'
          }`}>
            {/* Auto-Scroll Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoScrolling(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  isAutoScrolling 
                    ? 'bg-orange-600 text-white shadow-xs' 
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200'
                }`}
                title="पूजा के समय बिना हाथ लगाए स्वतः स्क्रॉल करें"
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoScrolling ? 'रोकें' : 'ऑटो-स्क्रॉल'}</span>
              </button>

              {isAutoScrolling && (
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  {[1, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setScrollSpeed(speed)}
                      className={`px-2 py-0.5 rounded-md ${
                        scrollSpeed === speed 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-black/10 dark:bg-white/10'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chanted Today Badge */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
              <span className="text-[11px] opacity-70">आज का पाठ:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-orange-600 dark:text-orange-400 font-sans">
                {completedChantsCount} बार
              </span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};
