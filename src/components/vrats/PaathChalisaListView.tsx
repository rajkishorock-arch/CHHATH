import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
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
  Heart,
  Play,
  Pause
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
type SubGroup = 'hanuman' | 'durga' | 'shiva' | 'chhath' | 'gita' | null;

// High quality deity visuals for avatars and reader artwork
const DEITY_MEDIA = {
  hanuman: {
    avatar: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=240&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
    title: 'श्री हनुमान',
    subtitle: 'संकटमोचन श्री हनुमान जी के सिद्ध पाठ, चालीसा व स्तोत्र'
  },
  durga: {
    avatar: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=240&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
    title: 'दुर्गा सप्तशती अध्याय',
    subtitle: 'श्री दुर्गा सप्तशती सम्पूर्ण 13 अध्याय व दुर्गा चालीसा'
  },
  shiva: {
    avatar: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=240&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    title: 'श्री शिव चालीसा',
    subtitle: 'देवाधिदेव महादेव शिव जी की दिव्य स्तुति व तांडव स्तोत्रम्'
  },
  chhath: {
    avatar: '/images/surya_chhathi_divine.jpg',
    banner: '/images/surya_chhathi_divine.jpg',
    title: 'छठ पूजा',
    subtitle: 'छठी मईया आरती, व्रत कथा एवं भुवन भास्कर सूर्य चालीसा'
  },
  gita: {
    avatar: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=240&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop&q=80',
    title: 'श्रीमद्भगवद्गीता',
    subtitle: 'सम्पूर्ण 18 अध्याय, 700 प्रामाणिक श्लोक, जीवन सूत्र एवं आरती'
  },
  ram: {
    avatar: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=240&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    title: 'श्री राम',
    subtitle: 'मर्यादा पुरुषोत्तम भगवान श्री राम'
  },
  lakshmi: {
    avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=240&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    title: 'माँ लक्ष्मी',
    subtitle: 'धन-वैभव व सौभाग्य प्रदायिनी माँ महालक्ष्मी'
  },
  surya: {
    avatar: '/images/hero_sunrise.jpg',
    banner: '/images/hero_sunrise.jpg',
    title: 'भगवान सूर्य',
    subtitle: 'प्रत्यक्ष देव भुवन भास्कर सूर्य नारायण'
  }
};

export const PaathChalisaListView: React.FC<PaathChalisaListViewProps> = ({ 
  onBack, 
  onGoHome = onBack,
  onOpenJapMala 
}) => {
  // Navigation Hierarchy States
  const [activeSubGroup, setActiveSubGroup] = useState<SubGroup>(null);
  const [selectedItem, setSelectedItem] = useState<ChalisaPaathItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Reader Customization States
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

  // Bookmarks (Heart ♡ / ❤️)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_paath_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  // Toggle Favorite Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('saved_paath_bookmarks', JSON.stringify(next));
      } catch {}
      if (next.includes(id)) {
        showToast('❤️ पसंदीदा पाठ में सुरक्षित किया गया!');
      } else {
        showToast('पसंदीदा सूची से हटाया गया');
      }
      return next;
    });
  };

  // Resolve artwork and avatar for any ChalisaPaathItem
  const getItemMedia = (item: ChalisaPaathItem) => {
    if (item.id === 'gita-mahatmya-saar' || item.type === 'gita') return DEITY_MEDIA.gita;
    if (item.id.includes('durga')) return DEITY_MEDIA.durga;
    if (item.id.includes('hanuman') || item.id === 'bajrang-baan' || item.id === 'sundarkand-paath') return DEITY_MEDIA.hanuman;
    if (item.id.includes('shiva') || item.id.includes('shiv')) return DEITY_MEDIA.shiva;
    if (item.id.includes('chhath')) return DEITY_MEDIA.chhath;
    if (item.id === 'ram-raksha-stotram') return DEITY_MEDIA.ram;
    if (item.id === 'kanakdhara-stotram') return DEITY_MEDIA.lakshmi;
    if (item.id === 'aditya-hridaya-stotram') return DEITY_MEDIA.surya;
    return DEITY_MEDIA.hanuman;
  };

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

  // Global search across all items
  const searchResults = searchQuery.trim() === '' ? [] : CHALISA_PAATH_DATA.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.hindiTitle.toLowerCase().includes(q) ||
      item.deity.toLowerCase().includes(q) ||
      item.significance.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q)
    );
  });

  // Hands-free Auto-Scroll Physics
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

  // Jump to Chapter & Highlight Shloka from Topic
  const handleSelectTopic = (topic: GitaTopicCategory) => {
    setSelectedGitaChapterNum(topic.targetChapter);
    setHighlightedShlokaNum(topic.featuredShlokaNumber);
    setGitaTab('chapters');
    showToast(`अध्याय ${topic.targetChapter} पर पहुंचे - ${topic.title}`);
    if (readerContainerRef.current) {
      readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Complete One Chant Counter (+1 पाठ पूर्ण & घंटी)
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

  // Reading Theme Classes
  const getThemeClasses = () => {
    switch (readingTheme) {
      case 'dark':
        return 'bg-stone-950 text-stone-100 border-stone-800';
      case 'light':
        return 'bg-white text-stone-900 border-stone-200';
      case 'sepia':
      default:
        return 'bg-[#fffaf4] text-[#451a03] border-[#fed7aa]';
    }
  };

  // Quick lookup helper
  const findItemById = (id: string) => CHALISA_PAATH_DATA.find(x => x.id === id) || null;

  // Handle open reader directly
  const openReader = (item: ChalisaPaathItem, gitaChapter: number = 1) => {
    setSelectedItem(item);
    setCompletedChantsCount(0);
    setIsAutoScrolling(false);
    if (item.id === 'gita-mahatmya-saar') {
      setSelectedGitaChapterNum(gitaChapter);
      setGitaTab('chapters');
    }
  };

  // Clean Header Action Handlers
  const handleBackClick = () => {
    if (isPlayingAudio) spiritualAudio.stopSpeaking();
    setIsPlayingAudio(false);
    setIsAutoScrolling(false);

    if (selectedItem) {
      setSelectedItem(null);
      return;
    }
    if (activeSubGroup) {
      setActiveSubGroup(null);
      return;
    }
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="bg-[#fffbf7] dark:bg-stone-950 text-[#451a03] dark:text-stone-100 min-h-screen flex flex-col font-mukta pb-24 sm:pb-28 select-none transition-colors duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-stone-900/95 text-amber-200 border border-amber-500/40 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP COMMON HEADER BAR (Matches Screenshots 4, 5, 2, 3)
          Circular Back (left), Bold Centered Title, Circular Home (right)
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#fffbf7]/95 dark:bg-stone-950/95 backdrop-blur-md px-3 sm:px-6 py-2.5 border-b border-[#fed7aa]/50 dark:border-stone-800">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Circular Back Button */}
          <button
            onClick={handleBackClick}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fae5d3] dark:bg-stone-850 hover:bg-[#fcd9be] active:scale-95 text-[#78350f] dark:text-amber-200 flex items-center justify-center transition-all shadow-xs border border-[#f5cdb2] dark:border-stone-700 cursor-pointer"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Centered Title */}
          <h1 className="font-serif font-black text-lg sm:text-xl text-[#78350f] dark:text-amber-100 tracking-wide truncate max-w-[220px] sm:max-w-xs text-center">
            {selectedItem 
              ? selectedItem.hindiTitle 
              : activeSubGroup 
                ? (DEITY_MEDIA[activeSubGroup]?.title || 'पाठ सूची')
                : 'पाठ और चालीसा'
            }
          </h1>

          {/* Circular Home Button */}
          <button
            onClick={onGoHome}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fae5d3] dark:bg-stone-850 hover:bg-[#fcd9be] active:scale-95 text-[#78350f] dark:text-amber-200 flex items-center justify-center transition-all shadow-xs border border-[#f5cdb2] dark:border-stone-700 cursor-pointer"
            aria-label="होम स्क्रीन"
            title="होम"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: MASTER LIST SCREEN (Matches Image 4)
          Rendered when activeSubGroup === null && selectedItem === null
         ========================================================================= */}
      {!activeSubGroup && !selectedItem && (
        <main className="max-w-xl mx-auto w-full px-3.5 sm:px-4 pt-3 space-y-3.5 animate-in fade-in duration-200">
          {/* Clean Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-700 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खोजें: हनुमान चालीसा, गीता, शिव चालीसा, सुंदरकांड..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#fedec4]/40 dark:bg-stone-900 border border-[#fed7aa]/70 dark:border-stone-800 text-xs sm:text-sm text-[#451a03] dark:text-stone-100 placeholder-amber-900/50 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-800/70 hover:text-amber-950 dark:text-stone-400 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results if user is searching */}
          {searchQuery.trim() !== '' ? (
            <div className="space-y-3 pt-1">
              <p className="text-xs font-bold text-stone-500 px-1">
                खोज परिणाम ({searchResults.length}):
              </p>
              {searchResults.length === 0 ? (
                <div className="text-center py-10 bg-[#fedec4]/30 rounded-3xl p-6">
                  <p className="font-bold text-stone-600">कोई पाठ नहीं मिला</p>
                  <p className="text-xs text-stone-400 mt-1">कृपया अन्य शब्द लिखकर खोजें</p>
                </div>
              ) : (
                searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openReader(item)}
                    className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                        <img 
                          src={getItemMedia(item).avatar} 
                          alt={item.hindiTitle}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                          {item.hindiTitle}
                        </h2>
                        <p className="text-[11px] text-[#9a3412] dark:text-amber-400 font-bold truncate">
                          {item.deity}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Master List (Matches Image 4) */
            <div className="space-y-3">
              {/* 1. श्री हनुमान */}
              <div
                onClick={() => setActiveSubGroup('hanuman')}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.hanuman.avatar} 
                      alt="श्री हनुमान"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री हनुमान
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 2. दुर्गा सप्तशती अध्याय */}
              <div
                onClick={() => setActiveSubGroup('durga')}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.durga.avatar} 
                      alt="दुर्गा सप्तशती अध्याय"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    दुर्गा सप्तशती अध्याय
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 3. श्री शिव चालीसा */}
              <div
                onClick={() => {
                  const shivaItem = findItemById('shiv-chalisa');
                  if (shivaItem) openReader(shivaItem);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.shiva.avatar} 
                      alt="श्री शिव चालीसा"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री शिव चालीसा
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 4. छठ पूजा */}
              <div
                onClick={() => setActiveSubGroup('chhath')}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.chhath.avatar} 
                      alt="छठ पूजा"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    छठ पूजा
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 5. श्रीमद्भगवद्गीता (सम्पूर्ण 18 अध्याय) */}
              <div
                onClick={() => setActiveSubGroup('gita')}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.gita.avatar} 
                      alt="श्रीमद्भगवद्गीता"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                      श्रीमद्भगवद्गीता
                    </h2>
                    <span className="text-[10px] text-[#9a3412] dark:text-amber-400 font-bold block">
                      सम्पूर्ण 18 अध्याय • जीवन सूत्र
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 6. श्री सुंदरकांड पाठ */}
              <div
                onClick={() => {
                  const item = findItemById('sundarkand-paath');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.hanuman.avatar} 
                      alt="श्री सुंदरकांड पाठ"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री सुंदरकांड पाठ
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 7. श्री बजरंग बाण */}
              <div
                onClick={() => {
                  const item = findItemById('bajrang-baan');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.hanuman.avatar} 
                      alt="श्री बजरंग बाण"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री बजरंग बाण
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 8. श्री राम रक्षा स्तोत्रम् */}
              <div
                onClick={() => {
                  const item = findItemById('ram-raksha-stotram');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.ram.avatar} 
                      alt="श्री राम रक्षा स्तोत्रम्"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री राम रक्षा स्तोत्रम्
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 9. श्री शिव तांडव स्तोत्रम् */}
              <div
                onClick={() => {
                  const item = findItemById('shiv-tandav-stotram');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.shiva.avatar} 
                      alt="श्री शिव तांडव स्तोत्रम्"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री शिव तांडव स्तोत्रम्
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 10. श्री कनकधारा स्तोत्रम् */}
              <div
                onClick={() => {
                  const item = findItemById('kanakdhara-stotram');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.lakshmi.avatar} 
                      alt="श्री कनकधारा स्तोत्रम्"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री कनकधारा स्तोत्रम्
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 11. श्री आदित्य हृदय स्तोत्रम् */}
              <div
                onClick={() => {
                  const item = findItemById('aditya-hridaya-stotram');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.surya.avatar} 
                      alt="श्री आदित्य हृदय स्तोत्रम्"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री आदित्य हृदय स्तोत्रम्
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>
            </div>
          )}
        </main>
      )}

      {/* =========================================================================
          VIEW 2: SUB-LIST MENUS (Matches Images 5 & 2)
          Rendered when activeSubGroup !== null && selectedItem === null
         ========================================================================= */}
      {activeSubGroup && !selectedItem && (
        <main className="max-w-xl mx-auto w-full px-3.5 sm:px-4 pt-3 space-y-3 animate-in fade-in duration-200">
          
          {/* -------------------------------------------------------------------
              SUB-CASE A: श्री हनुमान (Image 5)
             ------------------------------------------------------------------- */}
          {activeSubGroup === 'hanuman' && (
            <div className="space-y-3">
              {/* 1. हनुमान चालीसा */}
              <div
                onClick={() => {
                  const item = findItemById('hanuman-chalisa');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.hanuman.avatar} 
                      alt="हनुमान चालीसा"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    हनुमान चालीसा
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 2. श्री बजरंग बाण */}
              <div
                onClick={() => {
                  const item = findItemById('bajrang-baan');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.hanuman.avatar} 
                      alt="श्री बजरंग बाण"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री बजरंग बाण
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>

              {/* 3. श्री सुंदरकांड पाठ */}
              <div
                onClick={() => {
                  const item = findItemById('sundarkand-paath');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.hanuman.avatar} 
                      alt="श्री सुंदरकांड पाठ"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री सुंदरकांड पाठ
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              SUB-CASE B: दुर्गा सप्तशती अध्याय (Image 2)
             ------------------------------------------------------------------- */}
          {activeSubGroup === 'durga' && (
            <div className="space-y-3">
              {[
                { id: 'durga-saptashati-ch1', title: 'पहला अध्याय' },
                { id: 'durga-saptashati-ch2', title: 'दूसरा अध्याय' },
                { id: 'durga-saptashati-ch3', title: 'तीसरा अध्याय' },
                { id: 'durga-saptashati-ch4', title: 'चौथा अध्याय' },
                { id: 'durga-saptashati-ch5', title: 'पांचवां अध्याय' },
                { id: 'durga-saptashati-ch6', title: 'छठा अध्याय' },
                { id: 'durga-saptashati-ch7', title: 'सातवाँ अध्याय' },
                { id: 'durga-saptashati-ch8', title: 'आठवाँ अध्याय' },
                { id: 'durga-saptashati-ch9', title: 'नौवां अध्याय' },
                { id: 'durga-saptashati-ch10', title: 'दसवां अध्याय' },
                { id: 'durga-saptashati-ch11', title: 'ग्यारहवां अध्याय' },
                { id: 'durga-saptashati-ch12', title: 'बारहवां अध्याय' },
                { id: 'durga-saptashati-ch13', title: 'तेरहवां अध्याय' }
              ].map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    const item = findItemById(ch.id);
                    if (item) openReader(item);
                  }}
                  className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                      <img 
                        src={DEITY_MEDIA.durga.avatar} 
                        alt={ch.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                      {ch.title}
                    </h2>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
                </div>
              ))}

              {/* श्री दुर्गा चालीसा */}
              <div
                onClick={() => {
                  const item = findItemById('durga-chalisa');
                  if (item) openReader(item);
                }}
                className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                    <img 
                      src={DEITY_MEDIA.durga.avatar} 
                      alt="श्री दुर्गा चालीसा"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                    श्री दुर्गा चालीसा
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              SUB-CASE C: श्रीमद्भगवद्गीता (18 अध्याय, विषय खोज, महात्म्य, आरती)
             ------------------------------------------------------------------- */}
          {activeSubGroup === 'gita' && (
            <div className="space-y-4">
              {/* Clean Gita Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'chapters', label: '📖 18 अध्याय' },
                  { id: 'topics', label: '🧭 जीवन सूत्र (खोज)' },
                  { id: 'mahatmya', label: '✨ ध्यानम् व महात्म्य' },
                  { id: 'aarti', label: '🪔 गीता आरती' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setGitaTab(tab.id as GitaTab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                      gitaTab === tab.id
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                        : 'bg-[#fedec4]/50 dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-[#fed7aa] dark:border-stone-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 1. 18 Chapters Pill List */}
              {gitaTab === 'chapters' && (
                <div className="space-y-3">
                  {GITA_ALL_CHAPTERS.map(ch => (
                    <div
                      key={ch.chapterNumber}
                      onClick={() => {
                        const gitaItem = findItemById('gita-mahatmya-saar');
                        if (gitaItem) openReader(gitaItem, ch.chapterNumber);
                      }}
                      className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100 flex items-center justify-center">
                          <img 
                            src={DEITY_MEDIA.gita.avatar} 
                            alt={`अध्याय ${ch.chapterNumber}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                            अध्याय {ch.chapterNumber}: {ch.hindiTitle}
                          </h2>
                          <p className="text-[11px] text-[#9a3412] dark:text-amber-400 font-bold truncate">
                            {ch.shlokaCount} श्लोक • {ch.sanskritTitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Topics Guide (कहाँ क्या मिलेगा) */}
              {gitaTab === 'topics' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-amber-700 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={topicSearchQuery}
                      onChange={(e) => setTopicSearchQuery(e.target.value)}
                      placeholder="जीवन समस्या खोजें: क्रोध, शांति, कर्म, मृत्यु, ध्यान..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fedec4]/40 dark:bg-stone-900 border border-[#fed7aa]/70 dark:border-stone-800 text-xs sm:text-sm text-[#451a03] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredTopics.map(topic => (
                      <div
                        key={topic.id}
                        onClick={() => {
                          const gitaItem = findItemById('gita-mahatmya-saar');
                          if (gitaItem) {
                            openReader(gitaItem, topic.targetChapter);
                            setHighlightedShlokaNum(topic.featuredShlokaNumber);
                          }
                        }}
                        className="bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{topic.icon}</span>
                            <h3 className="font-serif font-black text-base text-[#78350f] dark:text-amber-200">
                              {topic.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#78350f] dark:text-amber-300">
                            अध्याय {topic.targetChapter} • श्लोक {topic.featuredShlokaNumber}
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                          {topic.description}
                        </p>
                        <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-2xl">
                          💡 समाधान: {topic.practicalAdvice}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Dhyanam & Mahatmya */}
              {gitaTab === 'mahatmya' && (
                <div className="space-y-4">
                  <div className="bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 sm:p-5 space-y-3">
                    <h2 className="font-serif font-black text-lg text-center text-[#78350f] dark:text-amber-200">
                      ॥ {GITA_DHYANAM.title} ॥
                    </h2>
                    {GITA_DHYANAM.verses.map((v, i) => (
                      <div key={i} className="space-y-1.5 pt-2 border-t border-amber-500/20 first:border-0 first:pt-0">
                        <p className="font-serif font-bold text-center italic text-[#78350f] dark:text-stone-100 whitespace-pre-line text-sm sm:text-base">
                          {v.sanskrit}
                        </p>
                        <p className="text-xs text-stone-700 dark:text-stone-300 bg-white/50 dark:bg-stone-800/50 p-2.5 rounded-2xl">
                          <span className="font-bold text-amber-700 dark:text-amber-400">भावार्थ:</span> {v.hindi}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 sm:p-5 space-y-3">
                    <h2 className="font-serif font-black text-lg text-center text-[#78350f] dark:text-amber-200">
                      ॥ {GITA_MAHATMYA.title} ॥
                    </h2>
                    {GITA_MAHATMYA.verses.map((v, i) => (
                      <div key={i} className="space-y-1.5 pt-2 border-t border-amber-500/20 first:border-0 first:pt-0">
                        <p className="font-serif font-bold text-center italic text-[#78350f] dark:text-stone-100 whitespace-pre-line text-sm sm:text-base">
                          {v.sanskrit}
                        </p>
                        <p className="text-xs text-stone-700 dark:text-stone-300 bg-white/50 dark:bg-stone-800/50 p-2.5 rounded-2xl">
                          <span className="font-bold text-amber-700 dark:text-amber-400">भावार्थ:</span> {v.hindi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Gita Aarti */}
              {gitaTab === 'aarti' && (
                <div className="bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 sm:p-5 space-y-3">
                  <h2 className="font-serif font-black text-lg text-center text-[#78350f] dark:text-amber-200">
                    ॥ {GITA_AARTI.title} ॥
                  </h2>
                  <p className="font-serif font-bold text-center italic text-[#78350f] dark:text-stone-100 whitespace-pre-line text-sm sm:text-base leading-loose">
                    {GITA_AARTI.verses}
                  </p>
                  <div className="text-xs text-stone-700 dark:text-stone-300 bg-white/50 dark:bg-stone-800/50 p-3 rounded-2xl space-y-1">
                    <p><span className="font-bold text-amber-700 dark:text-amber-400">आरती विधि:</span> {GITA_AARTI.vidhi}</p>
                    <p><span className="font-bold text-emerald-700 dark:text-emerald-400">फलश्रुति:</span> {GITA_AARTI.benefits}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------------
              SUB-CASE D: छठ पूजा (Aarti, Katha, Surya Chalisa)
             ------------------------------------------------------------------- */}
          {activeSubGroup === 'chhath' && (
            <div className="space-y-3">
              {[
                { id: 'chhath-pooja-aarti-katha', title: 'छठ पूजा आरती व कथा' },
                { id: 'chhath-chalisa', title: 'श्री षष्ठी मैया व सूर्य चालीसा' },
                { id: 'aditya-hridaya-stotram', title: 'श्री आदित्य हृदय स्तोत्रम्' }
              ].map(itemDef => (
                <div
                  key={itemDef.id}
                  onClick={() => {
                    const item = findItemById(itemDef.id);
                    if (item) openReader(item);
                  }}
                  className="w-full bg-[#fedec4]/85 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(234,88,12,0.06)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-stone-700 shadow-sm bg-amber-100">
                      <img 
                        src={DEITY_MEDIA.chhath.avatar} 
                        alt={itemDef.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="font-serif font-black text-base sm:text-lg text-[#78350f] dark:text-stone-100 truncate">
                      {itemDef.title}
                    </h2>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#c2410c] dark:text-amber-400 shrink-0 stroke-[2.5]" />
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* =========================================================================
          VIEW 3: READER VIEW (Matches Image 3)
          Rendered when selectedItem !== null
         ========================================================================= */}
      {selectedItem && (
        <div 
          ref={readerContainerRef}
          className={`flex-1 flex flex-col justify-between max-w-xl mx-auto w-full px-3.5 sm:px-4 pt-2 space-y-4 animate-in fade-in duration-200 ${getThemeClasses()}`}
        >
          {/* 1. PILL CONTROLS ROW (Matches Image 3: A- | A+ | 🌙 | ♡ | 🔊 | 📋) */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-1">
            {/* A- (Font Size Decrease) */}
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
              className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-stone-850 font-serif font-bold text-xs sm:text-sm text-[#78350f] dark:text-stone-200 border border-[#fed7aa] dark:border-stone-700 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="अक्षर छोटे करें"
            >
              A-
            </button>

            {/* A+ (Font Size Increase) */}
            <button
              onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
              className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-stone-850 font-serif font-bold text-xs sm:text-sm text-[#78350f] dark:text-stone-200 border border-[#fed7aa] dark:border-stone-700 shadow-xs active:scale-95 transition-all cursor-pointer"
              title="अक्षर बड़े करें"
            >
              A+
            </button>

            {/* 🌙 / ☀️ Theme Switcher */}
            <button
              onClick={() => setReadingTheme(prev => prev === 'sepia' ? 'dark' : prev === 'dark' ? 'light' : 'sepia')}
              className="px-3 py-1.5 rounded-2xl bg-white dark:bg-stone-850 text-xs sm:text-sm text-[#78350f] dark:text-stone-200 border border-[#fed7aa] dark:border-stone-700 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="रीडिंग थीम बदलें"
            >
              {readingTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#78350f]" />}
            </button>

            {/* ♡ Heart Bookmark Toggle */}
            <button
              onClick={() => toggleBookmark(selectedItem.id)}
              className="px-3 py-1.5 rounded-2xl bg-white dark:bg-stone-850 text-xs sm:text-sm text-[#78350f] dark:text-stone-200 border border-[#fed7aa] dark:border-stone-700 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="पसंदीदा में जोड़ें"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  bookmarkedIds.includes(selectedItem.id) 
                    ? 'fill-rose-600 text-rose-600' 
                    : 'text-[#78350f] dark:text-stone-200'
                }`} 
              />
            </button>

            {/* 🔊 Audio Recitation */}
            <button
              onClick={handleToggleSpeak}
              className={`px-3 py-1.5 rounded-2xl text-xs sm:text-sm border shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center ${
                isPlayingAudio 
                  ? 'bg-orange-600 text-white border-orange-600 animate-pulse' 
                  : 'bg-white dark:bg-stone-850 text-[#78350f] dark:text-stone-200 border-[#fed7aa] dark:border-stone-700'
              }`}
              title={isPlayingAudio ? 'वाचन रोकें' : 'पाठ सुनें'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* 📋 Copy Full Text */}
            <button
              onClick={() => handleCopyText(selectedItem)}
              className="px-3 py-1.5 rounded-2xl bg-white dark:bg-stone-850 text-xs sm:text-sm text-[#78350f] dark:text-stone-200 border border-[#fed7aa] dark:border-stone-700 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="पाठ कॉपी करें"
            >
              {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#78350f] dark:text-stone-200" />}
            </button>
          </div>

          {/* 2. TERRACOTTA / CORAL ORANGE TITLE PILL (Matches Image 3) */}
          <div className="w-full bg-[#e05b38] dark:bg-[#c2410c] text-white font-serif font-black text-center py-2.5 px-4 rounded-2xl shadow-sm text-base sm:text-lg tracking-wide">
            {selectedItem.id === 'gita-mahatmya-saar' 
              ? `श्रीमद्भगवद्गीता - अध्याय ${currentGitaChapter.chapterNumber}` 
              : selectedItem.hindiTitle
            }
          </div>

          {/* 3. DEITY ARTWORK ILLUSTRATION CARD (Matches Image 3) */}
          <div className="w-full rounded-3xl overflow-hidden border-2 border-white dark:border-stone-700 shadow-md aspect-[16/10] sm:aspect-[16/9] relative bg-amber-100 dark:bg-stone-900">
            <img 
              src={getItemMedia(selectedItem).banner} 
              alt={selectedItem.hindiTitle}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 text-white drop-shadow-md">
              <span className="text-xs font-serif font-black block">
                {selectedItem.deity}
              </span>
            </div>
          </div>

          {/* For Gita: Chapter Navigation bar */}
          {selectedItem.id === 'gita-mahatmya-saar' && (
            <div className="flex items-center justify-between gap-2 p-2 bg-[#fedec4]/60 dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 rounded-2xl">
              <button
                onClick={() => {
                  if (selectedGitaChapterNum > 1) {
                    setSelectedGitaChapterNum(prev => prev - 1);
                    if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={selectedGitaChapterNum <= 1}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 font-bold text-xs disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>पिछला</span>
              </button>

              <button
                onClick={() => setIsChapterDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>अध्याय {selectedGitaChapterNum}/18 सूची</span>
              </button>

              <button
                onClick={() => {
                  if (selectedGitaChapterNum < 18) {
                    setSelectedGitaChapterNum(prev => prev + 1);
                    if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={selectedGitaChapterNum >= 18}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 font-bold text-xs disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>अगला</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Gita Chapter Index Drawer */}
          {isChapterDrawerOpen && selectedItem.id === 'gita-mahatmya-saar' && (
            <div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
              <div 
                className="w-full max-w-sm h-full bg-[#fffbf7] dark:bg-stone-900 text-[#451a03] dark:text-stone-100 shadow-2xl flex flex-col p-4 overflow-hidden border-l border-amber-500/30 animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                  <h3 className="font-serif font-black text-base text-[#78350f] dark:text-amber-200">
                    श्रीमद्भगवद्गीता (18 अध्याय)
                  </h3>
                  <button
                    onClick={() => setIsChapterDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
                  {GITA_ALL_CHAPTERS.map(ch => (
                    <div
                      key={ch.chapterNumber}
                      onClick={() => {
                        setSelectedGitaChapterNum(ch.chapterNumber);
                        setIsChapterDrawerOpen(false);
                        if (readerContainerRef.current) readerContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        ch.chapterNumber === selectedGitaChapterNum
                          ? 'bg-amber-600 text-white border-amber-600 font-bold'
                          : 'bg-[#fedec4]/50 dark:bg-stone-800 border-[#fed7aa] dark:border-stone-700'
                      }`}
                    >
                      <span className="font-serif font-black text-xs">
                        अध्याय {ch.chapterNumber}: {ch.hindiTitle}
                      </span>
                      <span className="text-[10px] opacity-80 font-sans">
                        {ch.shlokaCount} श्लोक
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. SCRIPTURE VERSE CARDS (Matches Image 3) */}
          <div className="space-y-4 pt-1">
            {selectedItem.id === 'gita-mahatmya-saar' ? (
              /* Bhagavad Gita Shlokas */
              currentGitaChapter.shlokas.map(shloka => {
                const isHighlighted = highlightedShlokaNum === shloka.shlokaNumber;
                return (
                  <div 
                    key={shloka.shlokaNumber}
                    className={`bg-[#fedec4]/90 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 ${
                      isHighlighted ? 'ring-2 ring-orange-500 shadow-md' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-black text-sm text-[#78350f] dark:text-amber-200">
                        ॥ श्लोक {shloka.shlokaNumber} ॥
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePlayIndividualShloka(shloka)}
                          className="w-7 h-7 rounded-full bg-white/70 dark:bg-stone-800 flex items-center justify-center text-[#78350f] dark:text-stone-200 cursor-pointer"
                          title="सुनें"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyShloka(shloka)}
                          className="w-7 h-7 rounded-full bg-white/70 dark:bg-stone-800 flex items-center justify-center text-[#78350f] dark:text-stone-200 cursor-pointer"
                          title="कॉपी करें"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleShareShloka(shloka)}
                          className="w-7 h-7 rounded-full bg-white/70 dark:bg-stone-800 flex items-center justify-center text-[#78350f] dark:text-stone-200 cursor-pointer"
                          title="शेयर करें"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div 
                      style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                      className="font-serif font-bold italic text-center text-[#3d1a04] dark:text-stone-100 whitespace-pre-line tracking-wide drop-shadow-2xs"
                    >
                      {shloka.sanskrit}
                    </div>

                    <div className="pt-2 border-t border-amber-900/15 dark:border-stone-800 space-y-1.5">
                      <span className="text-xs font-serif font-black text-[#78350f] dark:text-amber-300 block">
                        भावार्थ-
                      </span>
                      <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                        {shloka.hindiTranslation}
                      </p>

                      {shloka.lifeWisdom && (
                        <div className="mt-2 text-[11px] font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-2xl">
                          🌱 जीवन सूत्र: {shloka.lifeWisdom}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Regular Paath / Chalisa / Stotram (Image 3 Style) */
              selectedItem.content.map((sec, idx) => (
                <div 
                  key={idx}
                  className="bg-[#fedec4]/90 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  {sec.sectionTitle && (
                    <div className="text-left">
                      <span className="font-serif font-black text-sm sm:text-base text-[#78350f] dark:text-amber-200">
                        {sec.sectionTitle}
                      </span>
                    </div>
                  )}

                  <div 
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
                    className="font-serif font-bold italic text-left text-[#3d1a04] dark:text-stone-100 whitespace-pre-line tracking-wide drop-shadow-2xs"
                  >
                    {sec.text}
                  </div>

                  {sec.meaning && (
                    <div className="pt-2 border-t border-amber-900/15 dark:border-stone-800 space-y-1">
                      <span className="text-xs font-serif font-black text-[#78350f] dark:text-amber-300 block">
                        भावार्थ-
                      </span>
                      <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                        {sec.meaning}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 5. JAP CHANT COUNTER & TEMPLE BELL */}
          <div className="bg-[#fedec4]/90 dark:bg-stone-900 border border-[#fed7aa]/60 dark:border-stone-800 rounded-3xl p-4 sm:p-5 text-center space-y-2.5">
            <span className="text-2xl">📿</span>
            <h3 className="font-serif font-black text-base text-[#78350f] dark:text-stone-100">
              पाठ संपूर्णम् • संकल्प
            </h3>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              श्रद्धापूर्वक पाठ करने से मन शांत होता है एवं समस्त बाधाओं का शमन होता है।
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleIncrementChant}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🚩 +1 पाठ पूर्ण (घंटी बजाएं)</span>
              </button>
              <span className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 text-xs font-bold text-[#78350f] dark:text-amber-300">
                आज: {completedChantsCount} बार
              </span>
            </div>
          </div>

          {/* 6. BOTTOM FLOATING BAR: AUTO-SCROLL */}
          <div className="sticky bottom-0 z-20 py-2 bg-[#fffbf7]/90 dark:bg-stone-950/90 backdrop-blur-md border-t border-[#fed7aa]/50 dark:border-stone-800 flex items-center justify-between">
            <button
              onClick={() => setIsAutoScrolling(prev => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                isAutoScrolling 
                  ? 'bg-orange-600 text-white shadow-xs' 
                  : 'bg-[#fedec4]/90 dark:bg-stone-850 text-[#78350f] dark:text-stone-200 border border-[#fed7aa] dark:border-stone-700'
              }`}
            >
              {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoScrolling ? 'रोकें' : 'ऑटो-स्क्रॉल'}</span>
            </button>

            {isAutoScrolling && (
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {[1, 1.5, 2].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setScrollSpeed(spd)}
                    className={`px-2 py-0.5 rounded-md ${
                      scrollSpeed === spd 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-black/10 dark:bg-white/10'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => handleShare(selectedItem)}
              className="px-3 py-1.5 rounded-full bg-[#fedec4]/90 dark:bg-stone-850 text-[#78350f] dark:text-stone-200 text-xs font-bold border border-[#fed7aa] dark:border-stone-700 flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>शेयर</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
