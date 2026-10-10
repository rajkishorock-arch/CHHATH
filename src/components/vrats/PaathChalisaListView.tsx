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
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Compass,
  Flame,
  Info,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { CHALISA_PAATH_DATA, ChalisaPaathItem } from '../../data/chalisaPaathData';
import { 
  GITA_ALL_CHAPTERS, 
  GITA_LIFE_TOPICS, 
  GITA_DHYANAM, 
  GITA_MAHATMYA, 
  GITA_AARTI,
  GitaChapterItem,
  GitaShlokaItem,
  GitaTopicCategory
} from '../../data/bhagavadGitaData';
import { spiritualAudio } from '../../utils/spiritualAudio';

interface PaathChalisaListViewProps {
  onBack?: () => void;
  onGoHome?: () => void;
  onOpenJapMala?: () => void;
}

type ReadingTheme = 'sepia' | 'dark' | 'light';
type GitaTab = 'chapters' | 'topics' | 'mahatmya' | 'aarti';

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
  const [playingShlokaId, setPlayingShlokaId] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bhagavad Gita Dedicated State
  const [selectedGitaChapterNum, setSelectedGitaChapterNum] = useState<number>(1);
  const [gitaTab, setGitaTab] = useState<GitaTab>('chapters');
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState<boolean>(false);
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>('');
  const [topicSearchQuery, setTopicSearchQuery] = useState<string>('');
  const [highlightedShlokaNum, setHighlightedShlokaNum] = useState<string | null>(null);

  const readerContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter Categories for Main Grid
  const categories = [
    { id: 'all', label: '🌟 सभी पाठ' },
    { id: 'gita', label: '📖 श्रीमद्भगवद्गीता' },
    { id: 'chalisa', label: '📿 चालीसा संग्रह' },
    { id: 'stotram', label: '⚡ महा स्तोत्रम्' },
    { id: 'paath', label: '🚩 सुंदरकांड व पाठ' }
  ];

  // Filtered Items for Main Grid
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

  // Current Active Gita Chapter
  const currentGitaChapter: GitaChapterItem = GITA_ALL_CHAPTERS.find(
    ch => ch.chapterNumber === selectedGitaChapterNum
  ) || GITA_ALL_CHAPTERS[0];

  // Filtered Chapters for Drawer
  const filteredChapters = GITA_ALL_CHAPTERS.filter(ch => {
    if (!chapterSearchQuery.trim()) return true;
    const q = chapterSearchQuery.toLowerCase();
    return (
      ch.chapterNumber.toString().includes(q) ||
      ch.hindiTitle.toLowerCase().includes(q) ||
      ch.sanskritTitle.toLowerCase().includes(q) ||
      ch.theme.toLowerCase().includes(q) ||
      ch.keyTopics.some(k => k.toLowerCase().includes(q))
    );
  });

  // Filtered Topics for Navigator
  const filteredTopics = GITA_LIFE_TOPICS.filter(t => {
    if (!topicSearchQuery.trim()) return true;
    const q = topicSearchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.practicalAdvice.toLowerCase().includes(q)
    );
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

  // Audio Speech Recitation for Entire Current Chapter or Text
  const handleToggleSpeak = () => {
    if (!selectedItem) return;
    if (isPlayingAudio) {
      spiritualAudio.stopSpeaking();
      setIsPlayingAudio(false);
      setPlayingShlokaId(null);
    } else {
      setIsPlayingAudio(true);
      let textToRead = '';
      if (selectedItem.id === 'gita-mahatmya-saar') {
        textToRead = `श्रीमद्भगवद्गीता, अध्याय ${currentGitaChapter.chapterNumber}, ${currentGitaChapter.hindiTitle}। ${currentGitaChapter.theme}। ${currentGitaChapter.shlokas.map(s => `${s.sanskrit}। सरल हिन्दी अनुवाद: ${s.hindiTranslation}`).join('। ')}`;
      } else {
        textToRead = `${selectedItem.hindiTitle}। ${selectedItem.content.map(c => `${c.sectionTitle || ''}। ${c.text} ${showMeaning && c.meaning ? '। भावार्थ: ' + c.meaning : ''}`).join('। ')}`;
      }
      spiritualAudio.speakText(textToRead, () => {
        setIsPlayingAudio(false);
        setPlayingShlokaId(null);
      });
    }
  };

  // Play Specific Shloka
  const handlePlayIndividualShloka = (shloka: GitaShlokaItem) => {
    if (playingShlokaId === shloka.shlokaNumber) {
      spiritualAudio.stopSpeaking();
      setPlayingShlokaId(null);
      setIsPlayingAudio(false);
    } else {
      spiritualAudio.stopSpeaking();
      setPlayingShlokaId(shloka.shlokaNumber);
      setIsPlayingAudio(true);
      const text = `अध्याय ${selectedGitaChapterNum}, श्लोक ${shloka.shlokaNumber}। ${shloka.sanskrit}। सरल अनुवाद: ${shloka.hindiTranslation}। जीवन दर्शन: ${shloka.lifeWisdom}`;
      spiritualAudio.speakText(text, () => {
        setPlayingShlokaId(null);
        setIsPlayingAudio(false);
      });
    }
  };

  // Copy Shloka
  const handleCopyShloka = (shloka: GitaShlokaItem) => {
    const text = `॥ श्रीमद्भगवद्गीता - अध्याय ${selectedGitaChapterNum}, श्लोक ${shloka.shlokaNumber} ॥\n\n${shloka.sanskrit}\n\n॥ सरल हिन्दी अनुवाद ॥\n${shloka.hindiTranslation}\n\n॥ व्यावहारिक जीवन सूत्र ॥\n${shloka.lifeWisdom}\n\n📲 सनातन व्रत एवं महापर्व ऐप`;
    navigator.clipboard.writeText(text);
    showToast(`श्लोक ${shloka.shlokaNumber} कॉपी हो गया!`);
  };

  // Share Shloka
  const handleShareShloka = async (shloka: GitaShlokaItem) => {
    const text = `🌸 *श्रीमद्भगवद्गीता (अध्याय ${selectedGitaChapterNum}, श्लोक ${shloka.shlokaNumber})* 🌸\n\n${shloka.sanskrit}\n\n*सरल अर्थ:*\n${shloka.hindiTranslation}\n\n*जीवन सूत्र:*\n${shloka.lifeWisdom}\n\n📲 सनातन व्रत एवं महापर्व ऐप — नित्य गीता पाठ`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `श्रीमद्भगवद्गीता ${shloka.shlokaNumber}`,
          text: text
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      showToast('श्लोक कॉपी कर लिया गया है!');
    }
  };

  // Handle Topic Navigation Click: Jump to Chapter & Highlight Shloka
  const handleSelectTopic = (topic: GitaTopicCategory) => {
    setSelectedGitaChapterNum(topic.targetChapter);
    setHighlightedShlokaNum(topic.featuredShlokaNumber);
    setGitaTab('chapters');
    showToast(`अध्याय ${topic.targetChapter} पर पहुंचे - ${topic.title}`);
    if (readerContainerRef.current) {
      readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Share Full Text / Chapter
  const handleShare = async (item: ChalisaPaathItem) => {
    let fullText = '';
    if (item.id === 'gita-mahatmya-saar') {
      fullText = `🌸 *श्रीमद्भगवद्गीता - अध्याय ${currentGitaChapter.chapterNumber}: ${currentGitaChapter.hindiTitle}* 🌸\n\nविषय: ${currentGitaChapter.theme}\n\n${currentGitaChapter.shlokas.map(s => `${s.shlokaNumber}\n${s.sanskrit}\nअर्थ: ${s.hindiTranslation}`).join('\n\n')}\n\n📲 सनातन व्रत एवं महापर्व ऐप`;
    } else {
      fullText = `🌸 *${item.hindiTitle}* 🌸\nईष्ट देव: ${item.deity}\n\n${item.content.map(c => `${c.sectionTitle || ''}\n${c.text}`).join('\n\n')}\n\n📲 सनातन व्रत एवं महापर्व ऐप — नित्य पाठ`;
    }

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
    let fullText = '';
    if (item.id === 'gita-mahatmya-saar') {
      fullText = `🌸 श्रीमद्भगवद्गीता - अध्याय ${currentGitaChapter.chapterNumber}: ${currentGitaChapter.hindiTitle} 🌸\n\n${currentGitaChapter.shlokas.map(s => `${s.sanskrit}\n${s.hindiTranslation}`).join('\n\n')}`;
    } else {
      fullText = `🌸 *${item.hindiTitle}* 🌸\n\n${item.content.map(c => `${c.sectionTitle || ''}\n${c.text}`).join('\n\n')}`;
    }
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
    <div className="bg-[#fdf6ee] text-[#451a03] pb-6 flex flex-col font-mukta min-h-screen">
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
                पाठ, स्तोत्र व पवित्र ग्रंथ
              </h1>
              <p className="text-[11px] text-[#9a3412]/80 font-bold hidden sm:block">
                सम्पूर्ण श्रीमद्भगवद्गीता (18 अध्याय), सुंदरकांड, महा स्तोत्र एवं सिद्ध चालीसा संग्रह
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
                if (item.id === 'gita-mahatmya-saar') {
                  setSelectedGitaChapterNum(1);
                  setGitaTab('chapters');
                }
              }}
              className={`group p-4 sm:p-5 rounded-3xl border shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                item.id === 'gita-mahatmya-saar'
                  ? 'bg-gradient-to-b from-[#fff7ed] via-[#ffedd5] to-[#fef3c7] border-amber-500/80 ring-2 ring-amber-400/30'
                  : 'bg-gradient-to-b from-[#fffaf3] to-[#fdeddc] border-[#fed7aa]/90 hover:border-orange-500/70'
              }`}
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    item.id === 'gita-mahatmya-saar'
                      ? 'bg-amber-600 text-white border-amber-700 font-extrabold shadow-xs'
                      : 'bg-amber-500/15 text-[#9a3412] border-amber-500/25'
                  }`}>
                    {item.id === 'gita-mahatmya-saar' ? '⭐ 18 अध्याय सम्पूर्ण' : item.categoryLabel}
                  </span>
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
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

      {/* =========================================================================
          4. DEDICATED FULL-SCREEN READER MODE
          (Includes Complete 18 Chapter Gita Navigator & Life Topics Guide)
         ========================================================================= */}
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
                  setPlayingShlokaId(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all cursor-pointer active:scale-95 border border-amber-500/30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>वापस</span>
              </button>

              {/* Book Chapter Selector Button (Opens Drawer for Gita) */}
              {selectedItem.id === 'gita-mahatmya-saar' ? (
                <button
                  onClick={() => setIsChapterDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600/15 hover:bg-amber-600/25 text-amber-900 dark:text-amber-100 text-xs font-bold border border-amber-600/30 transition-all cursor-pointer active:scale-95"
                  title="अध्याय बदलें"
                >
                  <Menu className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-serif">
                    अध्याय {currentGitaChapter.chapterNumber}: {currentGitaChapter.hindiTitle}
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-sans">▾ (18 अध्याय)</span>
                </button>
              ) : (
                <div className="hidden sm:block">
                  <span className="text-xs font-serif font-black block truncate max-w-[200px]">
                    {selectedItem.hindiTitle}
                  </span>
                </div>
              )}
            </div>

            {/* Smart Controls (Theme, Font Size, Audio, Auto-scroll, Share) */}
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
                <span>{showMeaning ? 'अर्थ सहित' : 'केवल श्लोक'}</span>
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
                {readingTheme === 'dark' ? (
                  <Moon className="w-4 h-4" />
                ) : readingTheme === 'light' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
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

          {/* Special Bhagavad Gita Sub-Header Bar (Tabs: 18 Chapters | Topics | Dhyanam | Aarti) */}
          {selectedItem.id === 'gita-mahatmya-saar' && (
            <div className={`px-3 sm:px-6 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto no-scrollbar ${
              readingTheme === 'dark' 
                ? 'bg-stone-900/80 border-amber-900/30' 
                : readingTheme === 'light' 
                  ? 'bg-stone-100/90 border-stone-200' 
                  : 'bg-[#f7eedc] border-[#fed7aa]/80'
            }`}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setGitaTab('chapters')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    gitaTab === 'chapters'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-transparent text-amber-900 dark:text-amber-200 hover:bg-amber-500/15'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>18 अध्याय ({currentGitaChapter.chapterNumber}/18)</span>
                </button>

                <button
                  onClick={() => setGitaTab('topics')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    gitaTab === 'topics'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-transparent text-amber-900 dark:text-amber-200 hover:bg-amber-500/15'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>🧭 कहाँ क्या मिलेगा (विषय खोज)</span>
                </button>

                <button
                  onClick={() => setGitaTab('mahatmya')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    gitaTab === 'mahatmya'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-transparent text-amber-900 dark:text-amber-200 hover:bg-amber-500/15'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ध्यानम् व महात्म्य</span>
                </button>

                <button
                  onClick={() => setGitaTab('aarti')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    gitaTab === 'aarti'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-transparent text-amber-900 dark:text-amber-200 hover:bg-amber-500/15'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>गीता आरती</span>
                </button>
              </div>

              {/* Fast Chapter Jump Selector */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (selectedGitaChapterNum > 1) {
                      setSelectedGitaChapterNum(prev => prev - 1);
                      if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={selectedGitaChapterNum <= 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-amber-900 dark:text-amber-200"
                  title="पिछला अध्याय"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsChapterDrawerOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[11px] font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-500/30 cursor-pointer"
                >
                  सूची
                </button>

                <button
                  onClick={() => {
                    if (selectedGitaChapterNum < 18) {
                      setSelectedGitaChapterNum(prev => prev + 1);
                      if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={selectedGitaChapterNum >= 18}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-amber-900 dark:text-amber-200"
                  title="अगला अध्याय"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              GITA CHAPTER INDEX DRAWER / MODAL (अध्याय सूची)
             ========================================================================= */}
          {isChapterDrawerOpen && (
            <div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
              <div 
                className="w-full max-w-md h-full bg-[#fcf5e8] dark:bg-stone-900 text-[#3d1a04] dark:text-stone-100 shadow-2xl flex flex-col p-4 sm:p-6 overflow-hidden border-l border-amber-500/30 animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
                  <div>
                    <h3 className="font-serif font-black text-lg text-amber-900 dark:text-amber-200">
                      श्रीमद्भगवद्गीता — सम्पूर्ण 18 अध्याय
                    </h3>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                      किसी भी अध्याय पर टैप करके तुरंत पाठ शुरू करें
                    </p>
                  </div>
                  <button
                    onClick={() => setIsChapterDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-amber-500/15 hover:bg-amber-500/25 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Chapters Inside Drawer */}
                <div className="mt-3 relative">
                  <Search className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chapterSearchQuery}
                    onChange={(e) => setChapterSearchQuery(e.target.value)}
                    placeholder="अध्याय का नाम, संख्या या विषय खोजें..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {chapterSearchQuery && (
                    <button
                      onClick={() => setChapterSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-700"
                    >
                      हटाएं
                    </button>
                  )}
                </div>

                {/* Chapter List Scroll Area */}
                <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {filteredChapters.map((ch) => {
                    const isCurrent = ch.chapterNumber === selectedGitaChapterNum;
                    return (
                      <div
                        key={ch.chapterNumber}
                        onClick={() => {
                          setSelectedGitaChapterNum(ch.chapterNumber);
                          setGitaTab('chapters');
                          setIsChapterDrawerOpen(false);
                          if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          showToast(`अध्याय ${ch.chapterNumber}: ${ch.hindiTitle} खुला!`);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isCurrent 
                            ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/25 border-amber-600 shadow-xs ring-1 ring-amber-500' 
                            : 'bg-white/70 dark:bg-stone-800/60 border-amber-500/20 hover:bg-amber-500/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCurrent 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-amber-500/20 text-amber-900 dark:text-amber-200'
                        }`}>
                          {ch.chapterNumber}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif font-black text-sm truncate text-amber-950 dark:text-amber-100">
                              {ch.hindiTitle}
                            </h4>
                            <span className="text-[10px] font-sans font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                              {ch.shlokaCount} श्लोक
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-serif italic truncate mt-0.5">
                            {ch.sanskritTitle}
                          </p>

                          <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 line-clamp-1 mt-1">
                            {ch.theme}
                          </p>

                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold truncate">
                            <span>💡 जीवन समाधान:</span>
                            <span className="truncate">{ch.lifeProblemSolved}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MAIN CONTENT CONTAINER (Gita Multi-View or Regular Paath)
             ========================================================================= */}
          <article className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
            
            {/* -----------------------------------------------------------------------
                CASE A: SHRIMAD BHAGAVAD GITA FULL READER
               ----------------------------------------------------------------------- */}
            {selectedItem.id === 'gita-mahatmya-saar' ? (
              <>
                {/* 1. TAB: 18 CHAPTERS (सम्पूर्ण 18 अध्याय) */}
                {gitaTab === 'chapters' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Chapter Sacred Header Banner */}
                    <div className="text-center space-y-2 border-b border-amber-500/25 pb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30 text-xs font-bold">
                        <span>🕉️ श्रीमद्भगवद्गीता</span>
                        <span>•</span>
                        <span>अध्याय {currentGitaChapter.chapterNumber} of 18</span>
                        <span>•</span>
                        <span>{currentGitaChapter.shlokaCount} श्लोक</span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide mt-2">
                        अध्याय {currentGitaChapter.chapterNumber}: {currentGitaChapter.hindiTitle}
                      </h1>
                      
                      <h2 className="text-sm sm:text-base font-serif italic text-amber-900/80 dark:text-amber-300/80">
                        ॥ {currentGitaChapter.sanskritTitle} ({currentGitaChapter.englishTitle}) ॥
                      </h2>

                      {/* Life Problem Solved Highlight Card */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left max-w-xl mx-auto space-y-1">
                        <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>इस अध्याय से क्या समाधान मिलता है? (Practical Wisdom)</span>
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 leading-relaxed">
                          {currentGitaChapter.lifeProblemSolved}
                        </p>
                      </div>

                      {/* Chapter Summary Card */}
                      <div className="mt-3 p-4 rounded-2xl bg-stone-500/5 border border-stone-500/20 text-left max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 block">
                          📖 अध्याय परिचय एवं सार:
                        </span>
                        <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-line">
                          {currentGitaChapter.chapterSummary}
                        </p>

                        {/* Key Topics Badges */}
                        <div className="pt-2 border-t border-amber-500/20 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300">प्रमुख विषय:</span>
                          {currentGitaChapter.keyTopics.map((top, idx) => (
                            <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200">
                              • {top}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chapter Shlokas List */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                          अध्याय के मुख्य अमृत श्लोक ({currentGitaChapter.shlokas.length}):
                        </span>
                        <span className="text-[11px] text-stone-500">
                          संस्कृत श्लोक, हिन्दी अर्थ व जीवन सूत्र
                        </span>
                      </div>

                      {currentGitaChapter.shlokas.map((shloka) => {
                        const isHighlighted = highlightedShlokaNum === shloka.shlokaNumber;
                        const isPlayingThis = playingShlokaId === shloka.shlokaNumber;

                        return (
                          <div 
                            key={shloka.shlokaNumber}
                            id={`shloka-${shloka.shlokaNumber}`}
                            className={`p-4 sm:p-6 rounded-3xl border transition-all ${
                              isHighlighted
                                ? 'bg-amber-500/20 border-orange-500 ring-2 ring-orange-500 shadow-md'
                                : readingTheme === 'dark' 
                                  ? 'bg-stone-900/60 border-amber-900/40' 
                                  : readingTheme === 'light' 
                                    ? 'bg-stone-50 border-stone-200' 
                                    : 'bg-amber-500/5 border-[#fed7aa]/80'
                            }`}
                          >
                            {/* Shloka Header with Number and Per-Shloka Controls */}
                            <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                              <span className="font-serif font-black text-sm text-orange-600 dark:text-orange-400 bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20">
                                ॥ श्लोक {shloka.shlokaNumber} ॥
                              </span>

                              <div className="flex items-center gap-1.5">
                                {/* Listen to Shloka */}
                                <button
                                  onClick={() => handlePlayIndividualShloka(shloka)}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    isPlayingThis 
                                      ? 'bg-orange-600 text-white animate-pulse' 
                                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200'
                                  }`}
                                  title="श्लोक उच्चारण सुनें"
                                >
                                  {isPlayingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </button>

                                {/* Copy Shloka */}
                                <button
                                  onClick={() => handleCopyShloka(shloka)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 cursor-pointer"
                                  title="श्लोक कॉपी करें"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Share Shloka */}
                                <button
                                  onClick={() => handleShareShloka(shloka)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 cursor-pointer"
                                  title="श्लोक शेयर करें"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Sanskrit Shloka */}
                            <div 
                              style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                              className="font-serif font-bold text-center whitespace-pre-line tracking-wide drop-shadow-xs text-amber-950 dark:text-amber-100"
                            >
                              {shloka.sanskrit}
                            </div>

                            {/* Meaning & Life Wisdom */}
                            {showMeaning && (
                              <div className="mt-4 pt-3.5 border-t border-amber-500/20 space-y-3">
                                {/* Hindi Translation */}
                                <div className="text-xs sm:text-sm leading-relaxed text-left bg-black/5 dark:bg-white/5 p-3 rounded-2xl">
                                  <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                                    ॥ सरल हिन्दी अनुवाद ॥
                                  </span>
                                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                                    {shloka.hindiTranslation}
                                  </p>
                                </div>

                                {/* Deep Meaning */}
                                {shloka.deepMeaning && (
                                  <div className="text-xs sm:text-sm leading-relaxed text-left bg-amber-500/5 p-3 rounded-2xl border border-amber-500/15">
                                    <span className="font-bold text-orange-700 dark:text-orange-400 block mb-1">
                                      ॥ आध्यात्मिक रहस्य व भावार्थ ॥
                                    </span>
                                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                                      {shloka.deepMeaning}
                                    </p>
                                  </div>
                                )}

                                {/* Practical Life Wisdom */}
                                {shloka.lifeWisdom && (
                                  <div className="text-xs sm:text-sm leading-relaxed text-left bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1 flex items-center gap-1">
                                      <span>🌱 व्यावहारिक जीवन सूत्र (Life Application):</span>
                                    </span>
                                    <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-sans font-medium">
                                      {shloka.lifeWisdom}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Chapter Navigation Pagination at Bottom */}
                    <div className="pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          if (selectedGitaChapterNum > 1) {
                            setSelectedGitaChapterNum(prev => prev - 1);
                            if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        disabled={selectedGitaChapterNum <= 1}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>पिछला: अध्याय {selectedGitaChapterNum - 1}</span>
                      </button>

                      <button
                        onClick={() => setIsChapterDrawerOpen(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:bg-amber-700 active:scale-95 transition-all"
                      >
                        <Menu className="w-4 h-4" />
                        <span>सम्पूर्ण 18 अध्याय सूची</span>
                      </button>

                      <button
                        onClick={() => {
                          if (selectedGitaChapterNum < 18) {
                            setSelectedGitaChapterNum(prev => prev + 1);
                            if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        disabled={selectedGitaChapterNum >= 18}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-amber-500/30"
                      >
                        <span>अगला: अध्याय {selectedGitaChapterNum + 1}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. TAB: TOPIC GUIDE (कहाँ क्या मिलेगा - विषय मार्गदर्शिका) */}
                {gitaTab === 'topics' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="text-center space-y-2 border-b border-amber-500/25 pb-5">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30">
                        🧭 जीवन समाधान विषय मार्गदर्शिका
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide">
                        कहाँ क्या मिलेगा? (गीता विषय अनुक्रमणिका)
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
                        अपनी दैनिक समस्या या प्रश्न के अनुसार सीधे उस अध्याय और श्लोक पर पहुँचें:
                      </p>

                      {/* Topic Search Box */}
                      <div className="pt-3 max-w-md mx-auto relative">
                        <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={topicSearchQuery}
                          onChange={(e) => setTopicSearchQuery(e.target.value)}
                          placeholder="खोजें: क्रोध, शांति, कर्म, मृत्यु, भोजन, ध्यान..."
                          className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {topicSearchQuery && (
                          <button
                            onClick={() => setTopicSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-700"
                          >
                            हटाएं
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Topics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {filteredTopics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-4 sm:p-5 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-amber-500/30 hover:border-amber-600 shadow-xs flex flex-col justify-between transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{topic.icon}</span>
                              <h3 className="font-serif font-black text-base text-amber-950 dark:text-amber-100">
                                {topic.title}
                              </h3>
                            </div>

                            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans mb-3">
                              {topic.description}
                            </p>

                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                              <span className="font-bold block mb-0.5">🌱 गीता का समाधान:</span>
                              {topic.practicalAdvice}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                              अध्याय {topic.targetChapter} • श्लोक {topic.featuredShlokaNumber}
                            </span>

                            <button
                              onClick={() => handleSelectTopic(topic)}
                              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              <span>पढ़ें →</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. TAB: DHYANAM & MAHATMYA (ध्यानम् व महात्म्य) */}
                {gitaTab === 'mahatmya' && (
                  <div className="space-y-8 animate-in fade-in duration-200">
                    {/* Dhyanam Section */}
                    <div className="space-y-4">
                      <div className="text-center space-y-1 border-b border-amber-500/25 pb-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200">
                          मंगलाचरण
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black">
                          {GITA_DHYANAM.title}
                        </h2>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {GITA_DHYANAM.subtitle}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {GITA_DHYANAM.verses.map((v, i) => (
                          <div key={i} className="p-4 sm:p-5 rounded-3xl bg-amber-500/5 border border-amber-500/25 space-y-3">
                            <div 
                              style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                              className="font-serif font-bold text-center whitespace-pre-line text-amber-950 dark:text-amber-100"
                            >
                              {v.sanskrit}
                            </div>
                            <div className="text-xs sm:text-sm bg-black/5 dark:bg-white/5 p-3 rounded-2xl text-stone-700 dark:text-stone-300 leading-relaxed">
                              <span className="font-bold text-amber-700 block mb-0.5">॥ भावार्थ ॥</span>
                              {v.hindi}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mahatmya Section */}
                    <div className="space-y-4 pt-4 border-t border-amber-500/30">
                      <div className="text-center space-y-1 border-b border-amber-500/25 pb-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200">
                          पुराणोक्त फलश्रुति
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black">
                          {GITA_MAHATMYA.title}
                        </h2>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {GITA_MAHATMYA.subtitle}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {GITA_MAHATMYA.verses.map((v, i) => (
                          <div key={i} className="p-4 sm:p-5 rounded-3xl bg-amber-500/5 border border-amber-500/25 space-y-3">
                            <div 
                              style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                              className="font-serif font-bold text-center whitespace-pre-line text-amber-950 dark:text-amber-100"
                            >
                              {v.sanskrit}
                            </div>
                            <div className="text-xs sm:text-sm bg-black/5 dark:bg-white/5 p-3 rounded-2xl text-stone-700 dark:text-stone-300 leading-relaxed">
                              <span className="font-bold text-amber-700 block mb-0.5">॥ भावार्थ ॥</span>
                              {v.hindi}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TAB: GITA AARTI (आरती) */}
                {gitaTab === 'aarti' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="text-center space-y-2 border-b border-amber-500/25 pb-5">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200">
                        🪔 दिव्य स्तुति
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-black">
                        {GITA_AARTI.title}
                      </h2>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        {GITA_AARTI.subtitle}
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 rounded-3xl bg-amber-500/5 border border-amber-500/25 space-y-4">
                      <div 
                        style={{ fontSize: `${fontSize}px`, lineHeight: 2 }}
                        className="font-serif font-bold text-center whitespace-pre-line text-amber-950 dark:text-amber-100 drop-shadow-xs"
                      >
                        {GITA_AARTI.verses}
                      </div>
                    </div>

                    {/* Aarti Vidhi & Phala */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                      <div className="font-bold text-amber-900 dark:text-amber-200">
                        🕯️ आरती विधि: {GITA_AARTI.vidhi}
                      </div>
                      <div className="font-medium text-emerald-800 dark:text-emerald-300">
                        ✨ फलश्रुति: {GITA_AARTI.benefits}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* -----------------------------------------------------------------------
                  CASE B: STANDARD SACRED PAATH / CHALISA / STOTRA READER
                 ----------------------------------------------------------------------- */
              <>
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
              </>
            )}

            {/* Chant Completion Card (+1 पाठ पूर्ण & घंटी) */}
            <div className="text-center p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 my-8 space-y-3">
              <span className="text-3xl">📿</span>
              <h3 className="font-serif font-black text-lg">
                पाठ संपूर्णम् • महा संकल्प
              </h3>
              <p className="text-xs max-w-md mx-auto opacity-80">
                श्रद्धापूर्वक किए गए पाठ से समस्त मनोकामनाएं पूर्ण होती हैं एवं पुण्य फल की प्राप्ति होती है।
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
