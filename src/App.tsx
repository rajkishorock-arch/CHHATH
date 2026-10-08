import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChhathDataProvider } from './context/ChhathDataContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReelsProvider, useReels } from './context/ReelsContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { App as CapApp } from '@capacitor/app';

// Layout & Core Navigation Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/layout/SearchModal';
import { StickyPlayer } from './components/audio/StickyPlayer';
import { ExpandedPlayerModal } from './components/audio/ExpandedPlayerModal';
import { PlaybackQueueModal } from './components/audio/PlaybackQueueModal';
import { Breadcrumbs } from './components/common/Breadcrumbs';
import { PullToRefresh } from './components/common/PullToRefresh';

// Modals
import { CinematicIntro } from './components/hero/CinematicIntro';
import { LocationOnboardingModal } from './components/onboarding/LocationOnboardingModal';
import { ChhathiAssistantModal } from './components/ai/ChhathiAssistantModal';
import { AtmosphereAudioMixer } from './components/audio/AtmosphereAudioMixer';
import { AuthModal } from './components/reels/AuthModal';
import { PersonalizationWizard } from './components/onboarding/PersonalizationWizard';

// Core Views & Sections
import { PublicHomeView } from './components/home/PublicHomeView';
import { QuickServicesHub } from './components/home/QuickServicesHub';
import { FeatureExperienceModal, type FeatureModalType } from './components/home/FeatureExperienceModal';
import { FourDaysTimeline } from './components/timeline/FourDaysTimeline';
import { PujaVidhi } from './components/vidhi/PujaVidhi';
import { SamagriChecklist } from './components/vidhi/SamagriChecklist';
import { ArghyaTimeCalc } from './components/astronomy/ArghyaTimeCalc';
import { ArghyaWeatherIntel } from './components/astronomy/ArghyaWeatherIntel';
import { GhatFinder } from './components/ghats/GhatFinder';
import { GhatSafetySection } from './components/ghats/GhatSafetySection';
import { PrasadSection } from './components/prasad/PrasadSection';
import { CookingStudio } from './components/prasad/CookingStudio';
import { MantraAarti } from './components/spiritual/MantraAarti';
import { SongsSection } from './components/audio/SongsSection';
import { MyChhathDashboard } from './components/dashboard/MyChhathDashboard';
import { Ghat3DExperiencePage } from './components/ghats/Ghat3DExperiencePage';
import { FamilyChhathHub } from './components/family/FamilyChhathHub';
import { Lock, LogIn, Sparkles } from 'lucide-react';

// Dedicated SEO Pages
import { ChhathVidhiPage } from './components/pages/ChhathVidhiPage';
import { ChhathSamagriPage } from './components/pages/ChhathSamagriPage';
import { ChhathArghyaTimePage } from './components/pages/ChhathArghyaTimePage';
import { ThekuaRecipePage } from './components/pages/ThekuaRecipePage';
import { ChhathGeetPage } from './components/pages/ChhathGeetPage';
import { ChhathKathaPage } from './components/pages/ChhathKathaPage';
import { ChhathCalendarPage } from './components/pages/ChhathCalendarPage';
import { ChhathDatePage } from './components/pages/ChhathDatePage';
import { PatnaChhathPage } from './components/pages/PatnaChhathPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { BlessingCertificatePage } from './components/pages/BlessingCertificatePage';
import { MemoryAlbumPage } from './components/pages/MemoryAlbumPage';
import { ChhathQuizPage } from './components/pages/ChhathQuizPage';
import { ChhathiAIPage } from './components/pages/ChhathiAIPage';
import { ChhathChatPage } from './components/pages/ChhathChatPage';

// Lazy Loaded Heavy Secondary Modules
const ExploreView = lazy(() => import('./components/explore/ExploreView').then(m => ({ default: m.ExploreView })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ReelsPlatformModal = lazy(() => import('./components/reels/ReelsPlatformModal').then(m => ({ default: m.ReelsPlatformModal })));
const CallScreenModal = lazy(() => import('./components/chat/CallScreenModal').then(m => ({ default: m.CallScreenModal })));
const ShareToChatModal = lazy(() => import('./components/chat/ShareToChatModal').then(m => ({ default: m.ShareToChatModal })));
const UserProfileModal = lazy(() => import('./components/reels/UserProfileModal').then(m => ({ default: m.UserProfileModal })));
import { ReelUser } from './types';
import { ReelsStorage } from './services/reelsStorage';

const ComponentLoader: React.FC = () => (
  <div className="p-12 text-center font-mukta text-stone-500 flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Section render error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-custom max-w-xl mx-auto my-16 p-8 rounded-3xl bg-stone-900/90 border border-amber-500/30 text-center space-y-4 backdrop-blur-md shadow-2xl font-mukta">
          <div className="text-4xl">🪔</div>
          <h2 className="text-2xl font-bold font-rozha text-amber-300">
            सामग्री लोड करने में तकनीकी समस्या आई
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            क्षमा करें, इस अनुभाग को प्रदर्शित करने में कुछ रुकावट आई। कृपया मुख्य पृष्ठ पर वापस जाएँ।
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            मुख्य पृष्ठ (Home) पर जाएँ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const normalizeTabKey = (rawTab: string): string => {
  if (!rawTab) return 'home';
  let t = rawTab.trim().toLowerCase();

  try {
    if (t.startsWith('http://') || t.startsWith('https://')) {
      const parsed = new URL(t);
      t = parsed.pathname + parsed.hash;
    }
  } catch (e) {}

  if (t.includes('?')) {
    t = t.split('?')[0];
  }
  if (t.startsWith('#')) {
    t = t.slice(1);
  }

  // Remove /chhath/ prefix if present and leading/trailing slashes
  t = t.replace(/^\/?(chhath\/)?/, '').replace(/\/$/, '');

  // Exact mappings and aliases
  if (t === 'chhath-puja-vidhi' || t === 'vidhi' || t === 'guide' || t === 'timeline') return 'chhath-puja-vidhi';
  if (t === 'chhath-samagri' || t === 'samagri') return 'chhath-samagri';
  if (t === 'chhath-arghya-time-2026' || t === 'chhath-arghya-time' || t === 'arghya') return 'chhath-arghya-time-2026';
  if (t === 'thekua-recipe' || t === 'thekua' || t === 'prasad') return 'thekua-recipe';
  if (t === 'chhath-puja-geet' || t === 'geet') return 'chhath-puja-geet';
  if (t === 'chhath-puja-katha' || t === 'katha') return 'chhath-puja-katha';
  if (t === 'chhath-calendar-2026' || t === 'chhath-calendar' || t === 'calendar') return 'chhath-calendar-2026';
  if (t === 'chhath-puja-date-2026' || t === 'chhath-puja-date' || t === 'date') return 'chhath-puja-date-2026';
  if (t === 'patna-chhath-puja-2026' || t === 'patna-chhath' || t === 'patna') return 'patna-chhath-puja-2026';
  if (t === 'settings' || t === 'setting') return 'settings';
  if (t === 'blessing-certificate' || t === 'certificate' || t === 'ashirwad-patra') return 'blessing-certificate';
  if (t === 'chhath-memories' || t === 'memories' || t === 'sansmaran' || t === 'album') return 'chhath-memories';
  if (t === 'chhath-quiz' || t === 'quiz') return 'chhath-quiz';
  if (t === 'ai-pandit' || t === 'ai-assistant' || t === 'assistant' || t === 'pandit' || t === 'chhathi-ai') return 'ai-pandit';
  if (t === 'chat' || t === 'chhath-chat' || t === 'connect' || t === 'dm') return 'chat';
  if (t === '3d-ghat' || t === 'ghat-3d' || t === '3d_ghat' || t === 'ghat3d' || t === '3d-darshan') return '3d-ghat';
  if (t === 'ghats' || t === 'ghat') return 'ghats';
  if (t === 'aarti' || t === 'mantra' || t === 'mantras') return 'aarti';
  if (t === 'music' || t === 'songs' || t === 'song') return 'music';
  if (t === 'explore') return 'explore';
  if (t === 'my-chhath') return 'my-chhath';
  if (t === 'home' || t === '') return 'home';

  return t;
};

const getInitialTabFromLocation = (): string => {
  if (typeof window === 'undefined') return 'home';

  const hash = window.location.hash.toLowerCase();
  if (hash) {
    const rawHash = hash.replace(/^#/, '');
    const cleanHash = rawHash.split('?')[0];
    if (cleanHash) {
      return normalizeTabKey(cleanHash);
    }
  }

  const rawPath = window.location.pathname.toLowerCase();
  const cleanPath = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
  const normPath = normalizeTabKey(cleanPath);
  return normPath;
};

const MainContent: React.FC = () => {
  const { 
    openReelsPlatform, 
    reelsPlatformOpen, 
    closeReelsPlatform, 
    createModalOpen, 
    closeCreateModal, 
    creatorStudioOpen, 
    setCreatorStudioOpen 
  } = useReels();

  const { 
    openAuthModal, 
    authModalOpen, 
    closeAuthModal, 
    onboardingModalOpen, 
    closeOnboarding, 
    accountCenterModalOpen, 
    closeAccountCenter 
  } = useAuth();

  const { 
    isExpandedOpen, 
    setIsExpandedOpen, 
    isQueueOpen, 
    setIsQueueOpen, 
    showVideo, 
    setShowVideo, 
    videoExpanded,
    setVideoExpanded,
    isFullscreenMode,
    toggleNativeFullscreen,
    lyricsSong, 
    setLyricsSong,
    setActiveInlineVideoId
  } = useAudio();

  const [activeTab, setActiveTab] = useState<string>(getInitialTabFromLocation);

  // When switching away from music/home, stop any inline video so no audio leaks into other pages
  useEffect(() => {
    if (activeTab !== 'music' && activeTab !== 'home') {
      setActiveInlineVideoId(null);
    }
  }, [activeTab, setActiveInlineVideoId]);

  const [musicInitialQuery, setMusicInitialQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&]q=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    return '';
  });

  // Only show intro once per device (stored in localStorage)
  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(() => {
    return !localStorage.getItem('chhath_intro_seen');
  });

  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  useEffect(() => {
    const handleScreenResize = () => setIsMobileScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleScreenResize);
    return () => window.removeEventListener('resize', handleScreenResize);
  }, []);

  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [mixerModalOpen, setMixerModalOpen] = useState(false);
  const [featureModal, setFeatureModal] = useState<FeatureModalType>(null);
  const [selectedDevoteeUser, setSelectedDevoteeUser] = useState<ReelUser | null>(null);
  const { openConnect } = useChat();

  const handleSelectUserFromSearch = (handleOrUsername: string) => {
    if (!handleOrUsername) return;
    const clean = handleOrUsername.trim().toLowerCase();
    const allUsers = ReelsStorage.getUsers();
    const found = allUsers.find(u => 
      u.username.toLowerCase() === clean ||
      u.username.toLowerCase() === `@${clean.replace(/^@/, '')}` ||
      u.id === handleOrUsername ||
      u.name.toLowerCase() === clean
    );
    if (found) {
      setSelectedDevoteeUser(found);
    }
  };

  // Helper to restore home scroll position smoothly
  const restoreHomeScroll = () => {
    try {
      const savedY = sessionStorage.getItem('home_scroll_y');
      if (savedY) {
        const y = parseInt(savedY, 10);
        if (!isNaN(y) && y > 0) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' });
            setTimeout(() => {
              window.scrollTo({ top: y, left: 0, behavior: 'instant' });
            }, 60);
          });
          return true;
        }
      }
    } catch (e) {}
    return false;
  };

  // Keep track of scroll position when user is on home view
  React.useEffect(() => {
    const handleScroll = () => {
      if (activeTab === 'home') {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        try {
          sessionStorage.setItem('home_scroll_y', y.toString());
        } catch (e) {}
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Deep-linking & URL route listener (handles browser back/forward and hash changes)
  React.useEffect(() => {
    const handleUrlChange = (e?: any) => {
      const tab = (e?.state && e.state.tab) ? normalizeTabKey(e.state.tab) : getInitialTabFromLocation();
      setActiveTab(tab);

      if (tab === 'home') {
        if (!restoreHomeScroll()) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }

      const hash = window.location.hash;
      const qMatch = hash.match(/[?&]q=([^&]+)/);
      if (qMatch) {
        setMusicInitialQuery(decodeURIComponent(qMatch[1]));
      }
      if (hash.startsWith('#reel/')) {
        const id = hash.replace('#reel/', '');
        openReelsPlatform('foryou', id);
      } else if (hash === '#reels/following') {
        openReelsPlatform('following');
      } else if (hash === '#reels' || hash === '#reel') {
        openReelsPlatform('foryou');
      } else if (hash === '#login') {
        openAuthModal('login');
      } else if (hash === '#signup') {
        openAuthModal('signup');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [openReelsPlatform, openAuthModal]);

  // Global custom event listener for opening auth modal from any button
  React.useEffect(() => {
    const handleAuthEvent = (e: any) => {
      openAuthModal(e?.detail?.tab || 'login', e?.detail?.message);
    };
    window.addEventListener('open_auth_modal', handleAuthEvent);
    return () => window.removeEventListener('open_auth_modal', handleAuthEvent);
  }, [openAuthModal]);

  const handleNavigate = (tab: string, query?: string) => {
    const targetTab = normalizeTabKey(tab);

    if (targetTab === 'reels') {
      openReelsPlatform('foryou');
      return;
    }
    if (targetTab === 'login') {
      openAuthModal('login');
      return;
    }
    if (targetTab === 'signup') {
      openAuthModal('signup');
      return;
    }
    if (query !== undefined) {
      setMusicInitialQuery(query);
    }

    // Save scroll position before leaving home/explore
    if (activeTab === 'home' || activeTab === 'explore') {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      try {
        sessionStorage.setItem('home_scroll_y', currentY.toString());
      } catch (e) {}
    }

    setActiveTab(targetTab);

    // When navigating to home/explore, restore saved scroll position; otherwise go to top
    if (targetTab === 'home' || targetTab === 'explore') {
      if (!restoreHomeScroll()) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    const rawBase = import.meta.env.BASE_URL || '/';
    const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

    const urlPath = targetTab === 'home' 
      ? base 
      : targetTab === 'music' && query 
        ? `${base}#music?q=${encodeURIComponent(query)}` 
        : `${base}#${targetTab}`;

    try {
      window.history.pushState({ tab: targetTab }, '', urlPath);
    } catch (e) {}
  };

  // Hardware & Gesture Back Button Integration
  const lastBackPressRef = React.useRef<number>(0);
  const [exitToastVisible, setExitToastVisible] = useState<boolean>(false);

  const handleBackLogic = React.useCallback((): string => {
    // 0. If inline video is playing inside song card thumbnail, close inline video
    if ((window as any).__hasInlineVideoOpen) {
      window.dispatchEvent(new CustomEvent('close_inline_video'));
      return 'handled';
    }

    // 1. If video is in fullscreen landscape mode, exit fullscreen first
    if (isFullscreenMode) {
      toggleNativeFullscreen();
      return 'handled';
    }

    // 2. If video theater/pip is open, close video
    if (showVideo) {
      setShowVideo(false);
      setVideoExpanded(false);
      return 'handled';
    }

    // 4. Close any active overlay/modal
    if (isExpandedOpen) { setIsExpandedOpen(false); return 'handled'; }
    if (isQueueOpen) { setIsQueueOpen(false); return 'handled'; }
    if (lyricsSong) { setLyricsSong(null); return 'handled'; }
    if (searchModalOpen) { setSearchModalOpen(false); return 'handled'; }
    if (reelsPlatformOpen) { closeReelsPlatform(); return 'handled'; }
    if (createModalOpen) { closeCreateModal(); return 'handled'; }
    if (creatorStudioOpen) { setCreatorStudioOpen(false); return 'handled'; }
    if (authModalOpen) { closeAuthModal(); return 'handled'; }
    if (onboardingModalOpen) { closeOnboarding(); return 'handled'; }
    if (accountCenterModalOpen) { closeAccountCenter(); return 'handled'; }
    if (assistantModalOpen) { setAssistantModalOpen(false); return 'handled'; }
    if (mixerModalOpen) { setMixerModalOpen(false); return 'handled'; }
    if (adminModalOpen) { setAdminModalOpen(false); return 'handled'; }
    if (locationModalOpen) { setLocationModalOpen(false); return 'handled'; }
    if (featureModal) { setFeatureModal(null); return 'handled'; }

    // 5. Navigation: If user is on any other tab/page (explore, vidhi, etc.), return to home!
    if (activeTab !== 'home') {
      handleNavigate('home');
      return 'handled';
    }

    // 6. User is on Home page and no modals are open -> allow Android to show double-tap exit toast
    return 'unhandled';
  }, [
    activeTab,
    isFullscreenMode,
    toggleNativeFullscreen,
    showVideo,
    setShowVideo,
    setVideoExpanded,
    isExpandedOpen,
    setIsExpandedOpen,
    isQueueOpen,
    setIsQueueOpen,
    lyricsSong,
    setLyricsSong,
    searchModalOpen,
    reelsPlatformOpen,
    closeReelsPlatform,
    createModalOpen,
    closeCreateModal,
    creatorStudioOpen,
    setCreatorStudioOpen,
    authModalOpen,
    closeAuthModal,
    onboardingModalOpen,
    closeOnboarding,
    accountCenterModalOpen,
    closeAccountCenter,
    assistantModalOpen,
    mixerModalOpen,
    adminModalOpen,
    locationModalOpen,
    featureModal
  ]);

  const handleBackLogicRef = React.useRef(handleBackLogic);

  React.useEffect(() => {
    handleBackLogicRef.current = handleBackLogic;
  }, [handleBackLogic]);

  // Expose directly to window for Native Android Java evaluateJavascript
  React.useEffect(() => {
    (window as any).handleAndroidBack = () => {
      if (handleBackLogicRef.current) {
        return handleBackLogicRef.current();
      }
      return 'unhandled';
    };
    return () => {
      delete (window as any).handleAndroidBack;
    };
  }, []);

  React.useEffect(() => {
    let removeListener: (() => void) | undefined;

    const setupBackButton = async () => {
      try {
        const listener = await CapApp.addListener('backButton', () => {
          const res = handleBackLogicRef.current ? handleBackLogicRef.current() : 'unhandled';
          if (res === 'handled') return;

          // Double tap back to exit on home page
          const now = Date.now();
          if (now - lastBackPressRef.current < 2000) {
            CapApp.minimizeApp().catch(() => {
              CapApp.exitApp();
            });
          } else {
            lastBackPressRef.current = now;
            setExitToastVisible(true);
            setTimeout(() => setExitToastVisible(false), 2000);
          }
        });

        removeListener = () => {
          listener.remove();
        };
      } catch (err) {
        console.warn('Capacitor backButton setup warning:', err);
      }
    };

    setupBackButton();

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return (
    <PullToRefresh>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col relative transition-colors duration-300">
      {/* Cinematic Intro Splash (shown once per session) */}
      {showCinematicIntro && (
        <CinematicIntro onComplete={() => setShowCinematicIntro(false)} />
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenMixer={() => setMixerModalOpen(true)}
        onOpenAssistant={() => handleNavigate('ai-pandit')}
      />

      {/* Main Content Area based on destination tab */}
      <main className={`flex-1 ${activeTab === 'chat' || activeTab === 'chhath-chat' ? 'pb-16 sm:pb-0' : 'pb-36 lg:pb-16'}`}>
        <SectionErrorBoundary onReset={() => handleNavigate('home')}>
          <div key={activeTab} className="page-transition-enter w-full">
            {/* Home Screen View */}
            {activeTab === 'home' && (
            <div>
              {isMobileScreen ? (
                <div className="w-full max-w-6xl mx-auto px-0 sm:px-4 py-0 sm:py-6 space-y-2 sm:space-y-4">
                  <div className="px-2 sm:px-0 pt-1 sm:pt-0">
                    <QuickServicesHub
                      onNavigate={handleNavigate}
                      onOpenFeatureModal={setFeatureModal}
                      onOpenAssistant={() => handleNavigate('ai-pandit')}
                      onOpenChat={() => handleNavigate('chat')}
                    />
                  </div>
                  <SongsSection initialQuery={musicInitialQuery} />
                </div>
              ) : (
                <PublicHomeView
                  onNavigate={handleNavigate}
                  onOpenFeatureModal={setFeatureModal}
                  onOpenAssistant={() => handleNavigate('ai-pandit')}
                  onOpenChat={() => handleNavigate('chat')}
                />
              )}
            </div>
          )}

          {activeTab === 'chhath-puja-vidhi' && (
            <ChhathVidhiPage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'chhath-samagri' || activeTab === 'samagri') && (
            <ChhathSamagriPage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'chhath-arghya-time-2026' || activeTab === 'chhath-arghya-time' || activeTab === 'arghya') && (
            <ChhathArghyaTimePage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'thekua-recipe' || activeTab === 'prasad') && (
            <ThekuaRecipePage onNavigate={handleNavigate} />
          )}

          {activeTab === 'chhath-puja-geet' && (
            <ChhathGeetPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'chhath-puja-katha' && (
            <ChhathKathaPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'chhath-calendar-2026' && (
            <ChhathCalendarPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'chhath-puja-date-2026' && (
            <ChhathDatePage onNavigate={handleNavigate} />
          )}

          {activeTab === 'patna-chhath-puja-2026' && (
            <PatnaChhathPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'guide' && (
            <div className="container-custom max-w-5xl mx-auto px-1.5 sm:px-4 py-3 sm:py-8 space-y-4 sm:space-y-8">
              <Breadcrumbs 
                items={[{ label: 'छठ पूजा विधि व संपूर्ण मार्गदर्शिका', url: '#guide' }]} 
                onNavigate={handleNavigate} 
              />
              <FourDaysTimeline />
              <PujaVidhi />
              <SamagriChecklist />
            </div>
          )}

          {activeTab === 'ghats' && (
            <div className="container-custom max-w-5xl mx-auto px-1.5 sm:px-4 py-3 sm:py-8 space-y-4 sm:space-y-8">
              <Breadcrumbs 
                items={[{ label: 'घाट एवं सुरक्षा निर्देश', url: '#ghats' }]} 
                onNavigate={handleNavigate} 
              />
              <GhatFinder />
              <GhatSafetySection />
            </div>
          )}

          {activeTab === 'aarti' && (
            <div className="container-custom max-w-5xl mx-auto px-1.5 sm:px-4 py-3 sm:py-8 space-y-4 sm:space-y-8">
              <Breadcrumbs 
                items={[{ label: 'सूर्य देव आरती व वैदिक मंत्र', url: '#aarti' }]} 
                onNavigate={handleNavigate} 
              />
              <MantraAarti onNavigate={handleNavigate} />
            </div>
          )}

          {activeTab === 'music' && (
            <div className="w-full max-w-6xl mx-auto px-0 sm:px-4 py-0 sm:py-6 space-y-2 sm:space-y-3">
              <SongsSection initialQuery={musicInitialQuery} />
            </div>
          )}

          {activeTab === 'my-chhath' && (
            <MyChhathDashboard onNavigate={handleNavigate} />
          )}

          {(activeTab === '3d-ghat' || activeTab === 'ghat-3d') && (
            <Ghat3DExperiencePage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'blessing-certificate' || activeTab === 'certificate') && (
            <BlessingCertificatePage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'chhath-memories' || activeTab === 'memories') && (
            <MemoryAlbumPage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'chhath-quiz' || activeTab === 'quiz') && (
            <ChhathQuizPage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'ai-pandit' || activeTab === 'ai-assistant' || activeTab === 'chhathi-ai') && (
            <ChhathiAIPage onNavigate={handleNavigate} />
          )}

          {(activeTab === 'chat' || activeTab === 'chhath-chat') && (
            <ChhathChatPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'explore' && (
            <PublicHomeView
              onNavigate={handleNavigate}
              onOpenFeatureModal={setFeatureModal}
              onOpenAssistant={() => setAssistantModalOpen(true)}
              onOpenChat={() => handleNavigate('chat')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage 
              onNavigate={handleNavigate}
              onOpenMixer={() => setMixerModalOpen(true)}
              onOpenAssistant={() => setAssistantModalOpen(true)}
            />
          )}
          </div>
        </SectionErrorBoundary>
      </main>

      {/* Global Interactive Dock & Persistent Audio Player */}
      <StickyPlayer onOpenMixer={() => setMixerModalOpen(true)} />
      <ExpandedPlayerModal />
      <PlaybackQueueModal />

      {/* Footer Component - Visible on Desktop Home and on Explore */}
      {(activeTab === 'home' || activeTab === 'explore') && (
        <div className={activeTab === 'home' ? 'hidden lg:block' : ''}>
          <Footer onNavigate={handleNavigate} />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Global Modals */}
      {locationModalOpen && (
        <LocationOnboardingModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
      )}

      {searchModalOpen && (
        <SearchModal 
          isOpen={searchModalOpen} 
          onClose={() => setSearchModalOpen(false)} 
          onNavigate={handleNavigate} 
          onSelectUser={handleSelectUserFromSearch}
        />
      )}

      {assistantModalOpen && (
        <ChhathiAssistantModal isOpen={assistantModalOpen} onClose={() => setAssistantModalOpen(false)} onNavigate={handleNavigate} />
      )}

      {mixerModalOpen && (
        <AtmosphereAudioMixer isOpen={mixerModalOpen} onClose={() => setMixerModalOpen(false)} />
      )}

      <AuthModal />

      <Suspense fallback={null}>
        {adminModalOpen && (
          <AdminDashboard isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
        )}
        <ReelsPlatformModal />
        <CallScreenModal />
        <ShareToChatModal />
        <FeatureExperienceModal
          activeModal={featureModal}
          onClose={() => setFeatureModal(null)}
        />
        {selectedDevoteeUser && (
          <UserProfileModal
            user={selectedDevoteeUser}
            isOpen={Boolean(selectedDevoteeUser)}
            onClose={() => setSelectedDevoteeUser(null)}
            onSelectReel={() => {
              setSelectedDevoteeUser(null);
              handleNavigate('reels');
            }}
          />
        )}
      </Suspense>

      {/* Double Tap Back to Exit Toast Banner */}
      {exitToastVisible && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-stone-900/95 border border-amber-500/50 text-amber-200 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 pointer-events-none">
          <span>🪔</span>
          <span>बाहर निकलने के लिए एक बार फिर बैक दबाएं</span>
        </div>
      )}
    </div>
    </PullToRefresh>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ChhathDataProvider>
          <SectionErrorBoundary onReset={() => { window.location.hash = ''; window.location.reload(); }}>
            <AudioProvider>
              <AuthProvider>
                <ReelsProvider>
                  <ChatProvider>
                    <MainContent />
                  </ChatProvider>
                </ReelsProvider>
              </AuthProvider>
            </AudioProvider>
          </SectionErrorBoundary>
        </ChhathDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
