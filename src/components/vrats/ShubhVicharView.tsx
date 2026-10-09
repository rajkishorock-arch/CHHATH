import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Home, Share2, Copy, Check, Heart, Sparkles, X, Globe, RefreshCw } from 'lucide-react';
import { 
  getNextUniqueVicharBatch, 
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
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const [selectedCard, setSelectedCard] = useState<ShubhVicharCardItem | null>(null);

  // Intersection Observer for Seamless Infinite Scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Initial Load from Live Internet + Curated Sanatan Pool
  useEffect(() => {
    let isMounted = true;

    const initFeed = async () => {
      // 1. Trigger live internet fetch in background
      fetchLiveInternetVichar().then((liveQuotes) => {
        if (isMounted && liveQuotes.length > 0) {
          setIsInternetConnected(true);
        }
      }).catch(() => {});

      // 2. Load first batch of guaranteed unique quotes
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

  // Infinite Scroll Batch Loader
  const loadNextBatch = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const nextBatch = await getNextUniqueVicharBatch(6);
      setCards(prev => [...prev, ...nextBatch]);
    } catch (err) {
      console.warn('Error loading next batch:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

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

  // Copy Quote Handler
  const handleCopyQuote = (card: ShubhVicharCardItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `🌸 *शुभ विचार* 🌸\n\n"${card.quoteText}"\n\n— ${card.authorOrSource || 'सनातन अमृत वचन'}\n\n📲 सनातन व्रत एवं महापर्व ऐप`;
    navigator.clipboard.writeText(text);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // WhatsApp / System Share Handler
  const handleShareQuote = async (card: ShubhVicharCardItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `🌸 *शुभ विचार* 🌸\n\n"${card.quoteText}"\n\n— ${card.authorOrSource || 'सनातन अमृत वचन'}\n\n📲 सनातन व्रत एवं महापर्व ऐप`;
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

  return (
    <div className="min-h-screen bg-[#fdf6ee] text-[#451a03] animate-ios-slide-in flex flex-col pb-24">
      
      {/* 1. TOP HEADER (Exact Screenshot 1: Circular Back, Centered "शुभ विचार", Circular Home) */}
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

          {/* Centered Title with live internet indicator */}
          <div className="flex flex-col items-center">
            <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] tracking-wide leading-tight">
              शुभ विचार
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-700 font-bold font-mukta flex items-center gap-1">
              <Globe className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              {isInternetConnected ? 'लाइव इंटरनेट अमृत प्रवाह' : 'दैनिक पावन विचार प्रवाह'}
            </span>
          </div>

          {/* Home Circular Button */}
          <button
            onClick={onGoHome}
            className="w-10 h-10 rounded-full bg-[#fef3c7] hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] flex items-center justify-center transition-all shadow-xs border border-[#fde68a] cursor-pointer"
            aria-label="होम स्क्रीन"
            title="होम"
          >
            <Home className="w-5 h-5 text-[#9a3412]" />
          </button>
        </div>
      </header>

      {/* 2. INFINITE DYNAMIC GRID (2-Column on Mobile, 3 on Tablet, 4 on Desktop) */}
      <main className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-3 sm:px-4 py-3 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {cards.map((card) => {
            const isLiked = likedIds.has(card.id);
            const isCopied = copiedId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-amber-300/40 bg-stone-900 cursor-pointer active:scale-[0.98] transition-all duration-300 h-[250px] sm:h-[280px] flex flex-col justify-between p-2.5 sm:p-3"
              >
                {/* Background Sacred Devotional Image (No corporate suits, only holy shrines, sunrise & nature) */}
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

                {/* Bottom Quote Content (Exact Typography & Formatting as Screenshot 1) */}
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

      {/* 3. FULL-SCREEN QUOTE DETAIL MODAL */}
      {selectedCard && (
        <div 
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-amber-500/50 bg-stone-950 text-white flex flex-col max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Hero */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={selectedCard.image}
                alt="शुभ विचार"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />
            </div>

            {/* Modal Quote Content */}
            <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded-full inline-block">
                  {selectedCard.categoryLabel}
                </span>

                {selectedCard.sanskritVerse && (
                  <p className="font-serif text-xs text-amber-200/90 italic leading-relaxed whitespace-pre-line border-l-2 border-amber-500/40 pl-2">
                    {selectedCard.sanskritVerse}
                  </p>
                )}

                <p className="font-serif font-black text-sm sm:text-base text-amber-100 leading-relaxed">
                  "{selectedCard.quoteText}"
                </p>
                {selectedCard.authorOrSource && (
                  <p className="text-xs text-amber-400 font-bold font-mukta text-right">
                    — {selectedCard.authorOrSource}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                <button
                  onClick={() => handleCopyQuote(selectedCard)}
                  className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-amber-500/30"
                >
                  {copiedId === selectedCard.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === selectedCard.id ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
                </button>
                <button
                  onClick={() => handleShareQuote(selectedCard)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>व्हाट्सएप शेयर</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
