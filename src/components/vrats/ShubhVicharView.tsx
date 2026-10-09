import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Home, 
  Share2, 
  Copy, 
  Check, 
  Heart, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  getNextUniqueVicharBatch, 
  getFreshRefreshedVicharBatch,
  fetchLiveInternetVichar, 
  ShubhVicharCardItem 
} from '../../data/shubhVicharData';

interface ShubhVicharViewProps {
  onBack?: () => void;
  onGoHome?: () => void;
}

export const ShubhVicharView: React.FC<ShubhVicharViewProps> = ({ 
  onBack, 
  onGoHome = onBack 
}) => {
  const [cards, setCards] = useState<ShubhVicharCardItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const [selectedCard, setSelectedCard] = useState<ShubhVicharCardItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  // Remembers the EXACT pixel scroll position in the feed grid before opening a card
  const scrollPosRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);

  // Intersection Observer for Seamless Infinite Scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Initial Feed Load
  useEffect(() => {
    let isMounted = true;

    const initFeed = async () => {
      fetchLiveInternetVichar().then((liveQuotes) => {
        if (isMounted && liveQuotes.length > 0) {
          setIsInternetConnected(true);
        }
      }).catch(() => {});

      const initialCards = await getNextUniqueVicharBatch(8);
      if (isMounted) {
        setCards(initialCards);
      }
    };

    initFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Infinite Scroll Batch Loader
  const loadNextBatch = useCallback(async () => {
    if (isLoadingMore || isRefreshing) return;
    setIsLoadingMore(true);

    try {
      const nextBatch = await getNextUniqueVicharBatch(6);
      setCards(prev => [...prev, ...nextBatch]);
    } catch (err) {
      console.warn('Error loading next batch:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, isRefreshing]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cards.length > 0) {
        loadNextBatch();
      }
    }, { rootMargin: '350px' });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadNextBatch, cards.length]);

  // 3. Pull-To-Refresh: Fetch fresh quotes from top
  const handleRefreshFeed = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setPullDistance(0);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([25, 20]); } catch {}
    }

    try {
      const freshBatch = await getFreshRefreshedVicharBatch(8);
      setCards(freshBatch);
      showToast('✨ नवीन पावन विचार लोड हो गए!');
    } catch {
      showToast('विचार अपडेट किए गए');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [isRefreshing]);

  // Listen to Global Pull-to-refresh event
  useEffect(() => {
    const handleGlobalPull = () => {
      if (!selectedCard) {
        handleRefreshFeed();
      }
    };
    window.addEventListener('chhath-app-pull-refresh', handleGlobalPull);
    return () => window.removeEventListener('chhath-app-pull-refresh', handleGlobalPull);
  }, [selectedCard, handleRefreshFeed]);

  // Touch Pull-To-Refresh physics for top of page
  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedCard || isRefreshing) return;
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    if (currentY <= 2 && e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    } else {
      isPullingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || selectedCard || isRefreshing || e.touches.length !== 1) return;
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    if (currentY > 3) {
      isPullingRef.current = false;
      setPullDistance(0);
      return;
    }

    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      const damped = Math.min(deltaY * 0.45, 80);
      setPullDistance(damped);
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  };

  const handleTouchEnd = () => {
    if (isPullingRef.current && pullDistance > 45) {
      handleRefreshFeed();
    }
    isPullingRef.current = false;
    setPullDistance(0);
  };

  // 4. Open Dedicated Full Page for Selected Vichar
  const handleOpenDetail = (card: ShubhVicharCardItem) => {
    // Save EXACT scroll position
    scrollPosRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    setSelectedCard(card);

    // Push browser history state so Android / Browser Back button closes the detail page
    try {
      window.history.pushState(
        { vicharDetailOpen: true, cardId: card.id }, 
        '', 
        `${window.location.pathname}#shubh-vichar?id=${encodeURIComponent(card.id)}`
      );
    } catch {}
  };

  // 5. Close Dedicated Page & Return to EXACT Scroll Position
  const handleCloseDetail = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
    }

    setSelectedCard(null);

    // If URL contains detail hash, step back in browser history
    if (window.location.hash.includes('?id=')) {
      try {
        window.history.back();
      } catch {}
    }

    // Instantly restore exact scroll position where devotee was reading
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosRef.current,
        left: 0,
        behavior: 'instant'
      });
    });
  }, []);

  // Listen to popstate (Hardware / Gesture Back button on phone)
  useEffect(() => {
    const handlePopState = () => {
      if (selectedCard) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setIsSpeechPlaying(false);
        }
        setSelectedCard(null);
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollPosRef.current,
            left: 0,
            behavior: 'instant'
          });
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedCard]);

  // Navigate Previous / Next Vichar in Full Page View
  const handlePrevVichar = () => {
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    if (currentIndex > 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeechPlaying(false);
      }
      setSelectedCard(cards[currentIndex - 1]);
    }
  };

  const handleNextVichar = () => {
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    if (currentIndex < cards.length - 1) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeechPlaying(false);
      }
      setSelectedCard(cards[currentIndex + 1]);
    } else {
      // Load next batch if at the end
      loadNextBatch().then(() => {
        if (currentIndex < cards.length - 1) {
          setSelectedCard(cards[currentIndex + 1]);
        }
      });
    }
  };

  // Audio Speech Recitation (Hindi Voice)
  const toggleSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('ऑडियो समर्थित नहीं है');
      return;
    }

    if (isSpeechPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      utterance.onend = () => setIsSpeechPlaying(false);
      utterance.onerror = () => setIsSpeechPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeechPlaying(true);
    }
  };

  // Copy Quote Handler
  const handleCopyQuote = (card: ShubhVicharCardItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `🌸 *शुभ विचार* 🌸\n\n${card.sanskritVerse ? `🚩 ${card.sanskritVerse}\n\n` : ''}"${card.quoteText}"\n\n— ${card.authorOrSource || 'सनातन अमृत वचन'}\n\n📲 सनातन व्रत एवं महापर्व ऐप`;
    navigator.clipboard.writeText(text);
    setCopiedId(card.id);
    showToast('विचार कॉपी हो गया!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // WhatsApp / System Share Handler
  const handleShareQuote = async (card: ShubhVicharCardItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `🌸 *शुभ विचार* 🌸\n\n${card.sanskritVerse ? `🚩 ${card.sanskritVerse}\n\n` : ''}"${card.quoteText}"\n\n— ${card.authorOrSource || 'सनातन अमृत वचन'}\n\n📲 सनातन व्रत एवं महापर्व ऐप`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'दैनिक शुभ विचार',
          text: text
        });
      } catch {}
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Like Toggle Handler
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedIndex = selectedCard ? cards.findIndex(c => c.id === selectedCard.id) : -1;

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#fdf6ee] text-[#451a03] flex flex-col pb-24"
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-amber-200 border border-amber-500/40 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pull-To-Refresh Top Visual Feedback Bar */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          style={{ height: `${Math.max(pullDistance, isRefreshing ? 48 : 0)}px` }}
          className="w-full overflow-hidden transition-all duration-150 flex items-center justify-center bg-gradient-to-b from-amber-200/50 to-transparent"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-4 py-1.5 rounded-full shadow-xs">
            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isRefreshing || pullDistance > 30 ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'नवीन पावन विचार आ रहे हैं...' : 'नीचे खींचें और छोड़ें...'}</span>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-[#fdf6ee]/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 shadow-xs">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex items-center justify-between">
          {/* Back Circular Button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5 text-[#9a3412]" />
          </button>

          {/* Centered Title with live indicator */}
          <div className="flex flex-col items-center">
            <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide leading-tight">
              शुभ विचार
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-700 font-bold font-mukta flex items-center gap-1">
              <Globe className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              {isInternetConnected ? 'लाइव इंटरनेट अमृत प्रवाह' : 'दैनिक पावन विचार प्रवाह'}
            </span>
          </div>

          {/* Action Group: Manual Refresh & Home */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
              aria-label="ताज़ा विचार लोड करें"
              title="नए विचार लोड करें"
            >
              <RefreshCw className={`w-4 h-4 text-[#9a3412] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
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

      {/* 2. INFINITE DYNAMIC GRID (Kept in DOM so returning back retains EXACT scroll position!) */}
      <main className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-3 sm:px-4 py-3 md:py-6 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {cards.map((card) => {
            const isLiked = likedIds.has(card.id);
            const isCopied = copiedId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => handleOpenDetail(card)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-amber-300/40 bg-stone-900 cursor-pointer active:scale-[0.98] transition-all duration-300 h-[250px] sm:h-[280px] flex flex-col justify-between p-2.5 sm:p-3"
              >
                {/* Background Devotional Image */}
                <img
                  src={card.image}
                  alt="शुभ विचार"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.88]"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay for Crisp Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 group-hover:via-black/50 transition-colors" />

                {/* Top: Sacred Om Badge + Quick Actions */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="w-6 h-6 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs font-serif font-black flex items-center justify-center shadow-xs">
                    ॐ
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleToggleLike(card.id, e)}
                      className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
                      title="पसंद करें"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={(e) => handleShareQuote(card, e)}
                      className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
                      title="व्हाट्सएप शेयर करें"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Bottom Quote Content */}
                <div className="relative z-10 space-y-1.5 pt-4">
                  <p className="font-mukta font-medium text-[11px] sm:text-xs text-amber-50 leading-relaxed drop-shadow-md whitespace-pre-line line-clamp-5 text-center">
                    "{card.quoteText}"
                  </p>

                  {card.authorOrSource && (
                    <div className="flex items-center justify-between pt-1 border-t border-amber-500/25">
                      <span className="text-[9px] sm:text-[10px] text-amber-300/95 font-bold font-mukta truncate">
                        — {card.authorOrSource}
                      </span>
                      <button
                        onClick={(e) => handleCopyQuote(card, e)}
                        className="text-[9px] text-amber-200 hover:text-white flex items-center space-x-0.5 shrink-0 active:scale-95 transition-all"
                        title="कॉपी करें"
                      >
                        {isCopied ? (
                          <span className="text-emerald-400 font-bold flex items-center">
                            <Check className="w-2.5 h-2.5 mr-0.5" /> कॉपी
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-300">
                            <Copy className="w-2.5 h-2.5 mr-0.5" /> कॉपी
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sentinel Anchor for Infinite Scrolling */}
        <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center space-y-1.5 text-center">
          {isLoadingMore ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-[#9a3412] animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>इंटरनेट से नए विचार लोड हो रहे हैं...</span>
            </div>
          ) : (
            <div className="text-[11px] text-[#9a3412]/60 font-mukta flex items-center space-x-1">
              <span>🌸</span>
              <span>अविरल पावन विचार प्रवाह • स्क्रॉल करते रहें</span>
              <span>🌸</span>
            </div>
          )}
        </div>
      </main>

      {/* 3. DEDICATED FULL-SCREEN NEW PAGE VIEW FOR SELECTED VICHAR (Matches 100% User Request) */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-[80] bg-black flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200 select-none"
        >
          {/* THE HERO DEVOTIONAL IMAGE: Fills Entire Background Screen ("jisme bas wahi picture ho") */}
          <img
            src={selectedCard.image}
            alt={selectedCard.authorOrSource || 'शुभ विचार'}
            className="fixed inset-0 w-full h-full object-cover object-center filter brightness-[0.78]"
          />

          {/* Full-Screen Devotional Gradient Aura & Vignette */}
          <div className="fixed inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/80 pointer-events-none" />
          <div className="fixed inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none" />

          {/* Top Bar of the Dedicated Page */}
          <header className="sticky top-0 z-20 px-4 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent backdrop-blur-xs">
            {/* Back Button: Returns EXACTLY to previous scroll position */}
            <button
              onClick={handleCloseDetail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-200 active:scale-95 transition-all cursor-pointer shadow-lg backdrop-blur-md"
              title="वापस जाएं (उसी स्थान पर)"
            >
              <ArrowLeft className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold font-mukta">वापस</span>
            </button>

            {/* Sacred Category Pill */}
            <span className="px-3.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-xs font-bold font-sans flex items-center gap-1.5 shadow-md backdrop-blur-md">
              <span className="font-serif">ॐ</span>
              <span>{selectedCard.categoryLabel}</span>
            </span>

            {/* Audio Recitation & Share Quick Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSpeech(`${selectedCard.sanskritVerse ? selectedCard.sanskritVerse + '। ' : ''}${selectedCard.quoteText}`)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md backdrop-blur-md"
                title={isSpeechPlaying ? 'ऑडियो रोकें' : 'विचार सुनें'}
              >
                {isSpeechPlaying ? <VolumeX className="w-4 h-4 text-orange-400 animate-pulse" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
              </button>
              <button
                onClick={() => handleShareQuote(selectedCard)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md backdrop-blur-md"
                title="शेयर करें"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </header>

          {/* Central Sacred Poster Content */}
          <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-5 sm:px-8 py-6 max-w-2xl mx-auto w-full text-center my-auto">
            {/* Sanskrit Shloka (If Available) */}
            {selectedCard.sanskritVerse && (
              <div className="mb-4 px-4 py-3 rounded-2xl bg-black/55 backdrop-blur-md border border-amber-500/40 text-amber-300 font-serif text-sm sm:text-base leading-relaxed tracking-wide italic whitespace-pre-line shadow-2xl animate-in zoom-in-95 duration-200">
                🚩 {selectedCard.sanskritVerse}
              </div>
            )}

            {/* Main Sacred Quote Text */}
            <blockquote className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-amber-50 leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] tracking-wide">
              “{selectedCard.quoteText}”
            </blockquote>

            {/* Author or Holy Scripture Citation */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-amber-300 font-bold font-mukta text-sm sm:text-base drop-shadow-lg">
                — {selectedCard.authorOrSource || 'सनातन अमृत वचन'}
              </span>
              <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
          </main>

          {/* Bottom Floating Action Bar of Dedicated Page */}
          <footer className="sticky bottom-0 z-20 px-4 py-3 sm:py-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent backdrop-blur-md max-w-2xl mx-auto w-full">
            {/* Top Row: Previous / Next Navigation */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                onClick={handlePrevVichar}
                disabled={selectedIndex <= 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                  selectedIndex > 0 
                    ? 'bg-black/60 border-amber-400/40 text-amber-200 active:scale-95 cursor-pointer' 
                    : 'bg-black/30 border-stone-800 text-stone-600 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>

              <span className="text-[11px] font-sans text-amber-400/80 font-bold">
                {selectedIndex + 1} / {cards.length}
              </span>

              <button
                onClick={handleNextVichar}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 border border-amber-400/40 text-amber-200 text-xs font-bold active:scale-95 transition-all cursor-pointer hover:bg-black/80"
              >
                <span>अगला</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Row: Core Devotional Actions */}
            <div className="grid grid-cols-3 gap-2">
              {/* WhatsApp Share Button */}
              <button
                onClick={() => handleShareQuote(selectedCard)}
                className="py-3 px-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>व्हाट्सएप</span>
              </button>

              {/* Copy Quote Button */}
              <button
                onClick={() => handleCopyQuote(selectedCard)}
                className="py-3 px-2 rounded-2xl bg-stone-900/90 border border-amber-400/40 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                {copiedId === selectedCard.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">कॉपी हुआ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>कॉपी करें</span>
                  </>
                )}
              </button>

              {/* Like Button */}
              <button
                onClick={() => handleToggleLike(selectedCard.id)}
                className="py-3 px-2 rounded-2xl bg-stone-900/90 border border-amber-400/40 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <Heart className={`w-4 h-4 ${likedIds.has(selectedCard.id) ? 'fill-red-500 text-red-500' : 'text-stone-300'}`} />
                <span>{selectedCard.likesCount + (likedIds.has(selectedCard.id) ? 1 : 0)}</span>
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};
