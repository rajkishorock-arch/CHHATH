import React, { useState, Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChhathDataProvider } from './context/ChhathDataContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReelsProvider, useReels } from './context/ReelsContext';
import { ChatProvider } from './context/ChatContext';

// Layout & Core Navigation Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/layout/SearchModal';
import { ScrollProgressBar } from './components/layout/ScrollProgressBar';
import { StickyPlayer } from './components/audio/StickyPlayer';
import { ExpandedPlayerModal } from './components/audio/ExpandedPlayerModal';
import { PlaybackQueueModal } from './components/audio/PlaybackQueueModal';

// Modals
import { CinematicIntro } from './components/hero/CinematicIntro';
import { LocationOnboardingModal } from './components/onboarding/LocationOnboardingModal';
import { ChhathiAssistantModal } from './components/ai/ChhathiAssistantModal';
import { AtmosphereAudioMixer } from './components/audio/AtmosphereAudioMixer';
import { AuthModal } from './components/reels/AuthModal';
import { PersonalizationWizard } from './components/onboarding/PersonalizationWizard';

// Core Views & Sections
import { PublicHomeView } from './components/home/PublicHomeView';
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

// Lazy Loaded Heavy Secondary Modules
const ExploreView = lazy(() => import('./components/explore/ExploreView').then(m => ({ default: m.ExploreView })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ReelsPlatformModal = lazy(() => import('./components/reels/ReelsPlatformModal').then(m => ({ default: m.ReelsPlatformModal })));
const ChhathConnectModal = lazy(() => import('./components/chat/ChhathConnectModal').then(m => ({ default: m.ChhathConnectModal })));
const CallScreenModal = lazy(() => import('./components/chat/CallScreenModal').then(m => ({ default: m.CallScreenModal })));
const ShareToChatModal = lazy(() => import('./components/chat/ShareToChatModal').then(m => ({ default: m.ShareToChatModal })));

const ComponentLoader: React.FC = () => (
  <div className="p-12 text-center font-mukta text-stone-500 flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    <span className="text-sm font-semibold">सामग्री लोड हो रही है...</span>
  </div>
);

const getInitialTabFromLocation = (): string => {
  if (typeof window === 'undefined') return 'home';
  const rawPath = window.location.pathname.toLowerCase();
  const path = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
  const hash = window.location.hash.toLowerCase();

  if (path.endsWith('chhath-puja-vidhi') || hash === '#chhath-puja-vidhi') {
    return 'chhath-puja-vidhi';
  }
  if (path.endsWith('chhath-samagri') || hash === '#chhath-samagri') {
    return 'chhath-samagri';
  }
  if (path.endsWith('chhath-arghya-time-2026') || path.endsWith('chhath-arghya-time') || hash === '#chhath-arghya-time' || hash === '#arghya') {
    return 'chhath-arghya-time-2026';
  }
  if (path.endsWith('thekua-recipe') || hash === '#thekua-recipe') {
    return 'thekua-recipe';
  }
  if (path.endsWith('chhath-puja-geet') || hash === '#chhath-puja-geet' || hash === '#geet') {
    return 'chhath-puja-geet';
  }
  if (path.endsWith('chhath-puja-katha') || hash === '#chhath-puja-katha' || hash === '#katha') {
    return 'chhath-puja-katha';
  }
  if (path.endsWith('chhath-calendar-2026') || path.endsWith('chhath-calendar') || hash === '#chhath-calendar-2026' || hash === '#calendar') {
    return 'chhath-calendar-2026';
  }
  if (path.endsWith('chhath-puja-date-2026') || hash === '#chhath-puja-date-2026' || hash === '#date') {
    return 'chhath-puja-date-2026';
  }
  if (path.endsWith('patna-chhath-puja-2026') || hash === '#patna-chhath-puja-2026' || hash === '#patna') {
    return 'patna-chhath-puja-2026';
  }

  if (path.endsWith('settings') || hash === '#settings' || hash === '#setting') {
    return 'settings';
  }

  if (hash === '#guide' || hash === '#timeline' || hash === '#vidhi') return 'guide';
  if (hash === '#ghats') return 'ghats';
  if (hash === '#prasad') return 'prasad';
  if (hash === '#aarti') return 'aarti';
  if (hash.startsWith('#music') || hash.startsWith('#songs')) return 'music';
  if (hash === '#explore') return 'explore';
  if (hash === '#my-chhath') return 'my-chhath';

  return 'home';
};

const MainContent: React.FC = () => {
  const { openReelsPlatform } = useReels();
  const { openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(getInitialTabFromLocation);

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

  // Do NOT interrupt user with an immediate location popup on first arrival
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [mixerModalOpen, setMixerModalOpen] = useState(false);

  // Deep-linking & URL route listener
  React.useEffect(() => {
    const handleUrlChange = () => {
      const tab = getInitialTabFromLocation();
      setActiveTab(tab);
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
    if (tab === 'reels') {
      openReelsPlatform('foryou');
      return;
    }
    if (tab === 'login') {
      openAuthModal('login');
      return;
    }
    if (tab === 'signup') {
      openAuthModal('signup');
      return;
    }
    if (query !== undefined) {
      setMusicInitialQuery(query);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const rawBase = import.meta.env.BASE_URL || '/';
    const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

    let urlPath = base;
    if (tab === 'chhath-puja-vidhi') urlPath = `${base}chhath-puja-vidhi/`;
    else if (tab === 'chhath-samagri' || tab === 'samagri') urlPath = `${base}chhath-samagri/`;
    else if (tab === 'chhath-arghya-time-2026') urlPath = `${base}chhath-arghya-time-2026/`;
    else if (tab === 'thekua-recipe') urlPath = `${base}thekua-recipe/`;
    else if (tab === 'chhath-puja-geet') urlPath = `${base}chhath-puja-geet/`;
    else if (tab === 'chhath-puja-katha') urlPath = `${base}chhath-puja-katha/`;
    else if (tab === 'chhath-calendar-2026') urlPath = `${base}chhath-calendar-2026/`;
    else if (tab === 'chhath-puja-date-2026') urlPath = `${base}chhath-puja-date-2026/`;
    else if (tab === 'patna-chhath-puja-2026') urlPath = `${base}patna-chhath-puja-2026/`;
    else if (tab === 'settings') urlPath = `${base}#settings`;
    else if (tab === 'music') urlPath = query ? `${base}#music?q=${encodeURIComponent(query)}` : `${base}#music`;
    else if (tab !== 'home') urlPath = `${base}#${tab}`;

    window.history.pushState(null, '', urlPath);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col relative transition-colors duration-300">
      {/* Cinematic Intro Splash (shown once per session) */}
      {showCinematicIntro && (
        <CinematicIntro onComplete={() => setShowCinematicIntro(false)} />
      )}

      {/* Real-time Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenMixer={() => setMixerModalOpen(true)}
        onOpenAssistant={() => setAssistantModalOpen(true)}
      />

      {/* Main Content Area based on destination tab */}
      <main className="flex-1 pb-36 lg:pb-16">
        {activeTab === 'home' && (
          <PublicHomeView onNavigate={handleNavigate} />
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

        {activeTab === 'thekua-recipe' && (
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
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
            <FourDaysTimeline />
            <PujaVidhi />
            <SamagriChecklist />
          </div>
        )}

        {activeTab === 'ghats' && (
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
            <GhatFinder />
            <GhatSafetySection />
          </div>
        )}

        {activeTab === 'prasad' && (
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
            <PrasadSection />
            <CookingStudio />
          </div>
        )}

        {activeTab === 'aarti' && (
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
            <MantraAarti />
          </div>
        )}

        {activeTab === 'music' && (
          <div className="container-custom max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-6 space-y-4 animate-in fade-in duration-300">
            <SongsSection initialQuery={musicInitialQuery} />
          </div>
        )}

        {activeTab === 'my-chhath' && (
          <MyChhathDashboard />
        )}

        {activeTab === 'explore' && (
          <Suspense fallback={<ComponentLoader />}>
            <ExploreView />
          </Suspense>
        )}

        {activeTab === 'settings' && (
          <SettingsPage 
            onNavigate={handleNavigate}
            onOpenMixer={() => setMixerModalOpen(true)}
            onOpenAssistant={() => setAssistantModalOpen(true)}
          />
        )}
      </main>

      {/* Global Interactive Dock & Persistent Audio Player */}
      <StickyPlayer onOpenMixer={() => setMixerModalOpen(true)} />
      <ExpandedPlayerModal />
      <PlaybackQueueModal />

      {/* Footer Component */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Global Modals */}
      {locationModalOpen && (
        <LocationOnboardingModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
      )}

      {searchModalOpen && (
        <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onNavigate={handleNavigate} />
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
        <ChhathConnectModal />
        <CallScreenModal />
        <ShareToChatModal />
      </Suspense>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ChhathDataProvider>
          <AudioProvider>
            <AuthProvider>
              <ReelsProvider>
                <ChatProvider>
                  <MainContent />
                </ChatProvider>
              </ReelsProvider>
            </AuthProvider>
          </AudioProvider>
        </ChhathDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
