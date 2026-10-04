import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Flame, 
  Users, 
  TrendingUp, 
  Search, 
  PlusCircle, 
  User, 
  BarChart3, 
  ShieldCheck, 
  Home, 
  Film,
  Sparkles
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { VerticalReelPlayer } from './VerticalReelPlayer';
import { CreateReelModal } from './CreateReelModal';
import { UserProfileModal } from './UserProfileModal';
import { ReelsSearchDiscover } from './ReelsSearchDiscover';
import { CreatorStudioModal } from './CreatorStudioModal';
import { ReelsModerationModal } from './ReelsModerationModal';
import { AudioPageModal } from './AudioPageModal';
import { AuthModal } from './AuthModal';

export const ReelsPlatformModal: React.FC = () => {
  const {
    reelsPlatformOpen,
    openReelsPlatform,
    closeReelsPlatform,
    feedType,
    setFeedType,
    selectedHashtag,
    selectedCategory,
    reels,
    activeReelIndex,
    setActiveReelIndex,
    activeReelId,
    setActiveReelId,
    currentReel,
    nextReel,
    prevReel,
    jumpToReelId,
    openCreateModal,
    profileModalUser,
    openProfileModal,
    closeProfileModal,
    creatorStudioOpen,
    setCreatorStudioOpen,
    moderationOpen,
    setModerationOpen,
    feedbackToast,
    clearFeedbackToast,
    loadMoreReels,
    handleVideoError
  } = useReels();

  const { currentUser, isAdmin, isAuthenticated, openAuthModal } = useAuth();
  const { pauseSong } = useAudio();

  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);

  // Pause background Chhath devotional music when Reels opens to prevent audio collision and network contention
  useEffect(() => {
    if (reelsPlatformOpen) {
      pauseSong();
    }
  }, [reelsPlatformOpen, pauseSong]);

  // Dedicated snap-scroll feed container & item refs
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToIndex = useCallback((idx: number) => {
    if (idx < 0 || idx >= reels.length) return;
    reelRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveReelIndex(idx);
    if (reels[idx]) {
      setActiveReelId(reels[idx].id);
    }
  }, [reels, setActiveReelIndex, setActiveReelId]);

  // Keyboard navigation (ArrowUp, ArrowDown, PageUp, PageDown, Escape)
  useEffect(() => {
    if (!reelsPlatformOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToIndex(activeReelIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToIndex(activeReelIndex - 1);
      } else if (e.key === 'Escape') {
        closeReelsPlatform();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reelsPlatformOpen, activeReelIndex, scrollToIndex, closeReelsPlatform]);

  // Handle pull to refresh while reels is active
  useEffect(() => {
    const handlePullRefresh = () => {
      if (reelsPlatformOpen) {
        scrollToIndex(0);
      }
    };
    window.addEventListener('chhath-app-pull-refresh', handlePullRefresh);
    return () => window.removeEventListener('chhath-app-pull-refresh', handlePullRefresh);
  }, [reelsPlatformOpen, scrollToIndex]);

  // Active Reel Detection via IntersectionObserver + Scroll sync
  useEffect(() => {
    if (!reelsPlatformOpen) return;
    const container = feedContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Number(entry.target.getAttribute('data-index'));
            const reelId = entry.target.getAttribute('data-reel-id');
            if (reelId) {
              setActiveReelId(reelId);
            }
            if (!isNaN(idx)) {
              setActiveReelIndex(idx);
              if (idx >= reels.length - 3) {
                loadMoreReels();
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6
      }
    );

    reelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Smooth settle sync without mid-swipe thrashing
    let scrollTimeout: any = null;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const itemHeight = container.clientHeight;
        if (itemHeight <= 0) return;
        const calculatedIndex = Math.round(scrollTop / itemHeight);
        if (calculatedIndex >= 0 && calculatedIndex < reels.length) {
          if (reels[calculatedIndex] && reels[calculatedIndex].id !== activeReelId) {
            setActiveReelId(reels[calculatedIndex].id);
            setActiveReelIndex(calculatedIndex);
            if (calculatedIndex >= reels.length - 3) {
              loadMoreReels();
            }
          }
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [reelsPlatformOpen, reels, activeReelId, loadMoreReels, setActiveReelIndex, setActiveReelId]);

  // When jumping to a specific reel or initially opening:
  useEffect(() => {
    if (reelsPlatformOpen) {
      if (reelRefs.current[activeReelIndex]) {
        reelRefs.current[activeReelIndex]?.scrollIntoView({ block: 'start' });
      }
    }
  }, [reelsPlatformOpen]);

  if (!reelsPlatformOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black text-stone-100 overflow-hidden select-none animate-fadeIn">
      {/* 1. TOP FLOATING MINIMAL HEADER (Desktop only - completely hidden on mobile per user request) */}
      <header className="hidden sm:flex absolute top-0 inset-x-0 z-30 px-3 sm:px-6 py-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent items-center justify-between pointer-events-none">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-base">🌅</span>
          </div>
          <span className="font-rozha text-lg sm:text-xl font-black gold-foil-text tracking-wide drop-shadow-md">
            छठ रील्स
          </span>
        </div>

        {/* Right: Actions (Search, Create, Studio, Admin, User, Close) */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-stone-200 hover:text-amber-400 border border-white/10 backdrop-blur-md transition-all shadow-md"
            title="सर्च करें (Search people, hashtags, reels)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Create Reel Button */}
          <button
            onClick={openCreateModal}
            className="p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-1.5 transition-all"
            title="रील बनाएं (Create)"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">रील बनाएं</span>
          </button>

          {/* Creator Studio Trigger */}
          {isAuthenticated && (
            <button
              onClick={() => setCreatorStudioOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-stone-200 hover:text-amber-400 border border-white/10 backdrop-blur-md transition-all hidden sm:flex"
              title="क्रिएटर स्टूडियो (Creator Studio)"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          )}

          {/* Admin Moderation Button (if admin) */}
          {isAdmin && (
            <button
              onClick={() => setModerationOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white transition-all shadow-md"
              title="मॉडरेशन डैशबोर्ड (Admin Moderation)"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* User Account / Profile */}
          {currentUser ? (
            <button
              onClick={() => openProfileModal(currentUser)}
              className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 to-orange-500 overflow-hidden shrink-0 hover:scale-105 transition-transform shadow-md"
              title={currentUser.name}
            >
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all backdrop-blur-md"
            >
              लॉग इन
            </button>
          )}

          {/* Close Modal Button */}
          <button
            onClick={closeReelsPlatform}
            className="p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-all ml-1 shadow-md"
            title="वापस मुख्य पोर्टल पर जाएं"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      </header>

      {/* Dynamic Feedback Toast (e.g. Not Interested confirmation) */}
      {feedbackToast && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stone-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs sm:text-sm text-stone-100 animate-slideDown max-w-[90vw]">
          <span className="text-amber-400 text-base shrink-0">✨</span>
          <span className="font-mukta leading-relaxed">{feedbackToast}</span>
          <button 
            onClick={clearFeedbackToast}
            className="p-1 rounded-lg text-stone-400 hover:text-white shrink-0 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN PLAYER VIEWPORT - Full Screen Vertical Snap Scroll Feed */}
      <main className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        {reels.length === 0 ? (
          /* Empty State (#47) */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm mx-auto animate-fadeIn">
            <span className="text-6xl block animate-bounce">🪔</span>
            <h3 className="font-rozha text-2xl font-bold text-amber-300">
              अभी इस घाट पर कोई Reel नहीं पहुँची है 🪔
            </h3>
            <p className="font-mukta text-xs sm:text-sm text-stone-300 leading-relaxed">
              {feedType === 'following'
                ? 'जिन भक्तों को आप फॉलो करते हैं, उन्होंने अभी तक कोई रील साझा नहीं की है।'
                : 'इस पावन श्रेणी में पहली रील बनाएं और लाखों श्रद्धालुओं तक अपना अनुभव पहुंचाएं।'}
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>पहली Reel बनाएं</span>
            </button>
          </div>
        ) : (
          /* Dedicated Vertical Snap Scroll Feed Container (Mobile Touch & Desktop Wheel/Trackpad) */
          <div 
            ref={feedContainerRef}
            className="w-full h-full overflow-y-scroll overscroll-contain snap-y snap-mandatory scrollbar-none touch-pan-y"
            style={{ 
              scrollSnapType: 'y mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {reels.map((reel, index) => {
              const isCurrentActive = reel.id === (activeReelId || reels[activeReelIndex]?.id);
              return (
                <div
                  key={reel.id}
                  ref={el => { reelRefs.current[index] = el; }}
                  data-index={index}
                  data-reel-id={reel.id}
                  className="w-full h-full min-h-full snap-start snap-always shrink-0 flex items-center justify-center relative select-none"
                  style={{ 
                    scrollSnapAlign: 'start', 
                    scrollSnapStop: 'always',
                    height: '100%' 
                  }}
                >
                  <VerticalReelPlayer
                    reel={reel}
                    isActive={isCurrentActive}
                    isNearby={Math.abs(index - activeReelIndex) <= 1}
                    onOpenProfile={(u) => openProfileModal(u)}
                    onOpenAudio={(id) => setSelectedAudioId(id)}
                    onNext={() => scrollToIndex(index + 1)}
                    onPrev={() => scrollToIndex(index - 1)}
                    onPlaybackError={(reelId, videoId, errorCode) => {
                      handleVideoError(reelId, videoId, errorCode);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. MOBILE FLOATING BOTTOM NAVIGATION BAR */}
      <footer className="lg:hidden absolute bottom-0 inset-x-0 z-30 px-4 py-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-around pointer-events-auto border-t border-white/5">
        <button
          onClick={closeReelsPlatform}
          className="flex flex-col items-center gap-0.5 text-stone-300 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mukta font-bold">होम</span>
        </button>

        <button
          onClick={() => setFeedType('foryou')}
          className="flex flex-col items-center gap-0.5 text-amber-400 font-bold"
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-mukta">रील्स</span>
        </button>

        <button
          onClick={openCreateModal}
          className="flex flex-col items-center gap-0.5 text-amber-400"
        >
          <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 shadow-md">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mukta font-bold">बनाएं</span>
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 text-stone-300 hover:text-white transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-mukta">सर्च</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) {
              openProfileModal(currentUser);
            } else {
              openAuthModal('login');
            }
          }}
          className="flex flex-col items-center gap-0.5 text-stone-300 hover:text-white transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-mukta">प्रोफाइल</span>
        </button>
      </footer>

      {/* MODAL OVERLAYS */}
      <CreateReelModal />

      <UserProfileModal
        user={profileModalUser}
        isOpen={Boolean(profileModalUser)}
        onClose={closeProfileModal}
        onSelectReel={(id, userReels) => {
          if (userReels && userReels.length > 0) {
            openReelsPlatform('explore', id, userReels);
          } else {
            jumpToReelId(id);
          }
          closeProfileModal();
        }}
      />

      <ReelsSearchDiscover
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectReel={(id, matchingReels) => {
          if (matchingReels && matchingReels.length > 0) {
            openReelsPlatform('explore', id, matchingReels);
          } else {
            jumpToReelId(id);
          }
          setSearchOpen(false);
        }}
        onSelectUser={(u) => {
          openProfileModal(u);
          setSearchOpen(false);
        }}
        onSelectAudio={(id) => {
          setSelectedAudioId(id);
          setSearchOpen(false);
        }}
      />

      <CreatorStudioModal
        isOpen={creatorStudioOpen}
        onClose={() => setCreatorStudioOpen(false)}
        onSelectReel={(id) => jumpToReelId(id)}
      />

      <ReelsModerationModal
        isOpen={moderationOpen}
        onClose={() => setModerationOpen(false)}
        onSelectReel={(id) => jumpToReelId(id)}
      />

      <AudioPageModal
        audioId={selectedAudioId}
        isOpen={Boolean(selectedAudioId)}
        onClose={() => setSelectedAudioId(null)}
        onSelectReel={(id, audioReels) => {
          if (audioReels && audioReels.length > 0) {
            openReelsPlatform('explore', id, audioReels);
          } else {
            jumpToReelId(id);
          }
          setSelectedAudioId(null);
        }}
        onUseAudio={(audioId) => {
          openCreateModal();
        }}
      />

      <AuthModal />

    </div>
  );
};
