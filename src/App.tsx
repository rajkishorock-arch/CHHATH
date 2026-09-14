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

const MainContent: React.FC = () => {
  const { openReelsPlatform, openCreateModal, openProfileModal } = useReels();
  const { playSong } = useAudio();
  const { 
    currentUser, 
    isAuthenticated, 
    onboardingModalOpen, 
    closeOnboarding, 
    openAuthModal 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');

  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('chhath_intro_seen');
  });
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('chhath_onboarding_done');
  });
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [mixerModalOpen, setMixerModalOpen] = useState(false);

  // Deep-linking URL hash listener
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#reel/')) {
        const id = hash.replace('#reel/', '');
        openReelsPlatform('foryou', id);
      } else if (hash === '#reels/following') {
        openReelsPlatform('following');
      } else if (hash === '#reels/trending') {
        openReelsPlatform('trending');
      } else if (hash === '#reels/latest') {
        openReelsPlatform('latest');
      } else if (hash === '#reels' || hash === '#reels/foryou' || hash === '#reels/explore') {
        openReelsPlatform('foryou');
      } else if (hash === '#create-reel') {
        openCreateModal();
      } else if (hash.startsWith('#user/')) {
        const username = hash.replace('#user/', '');
        openProfileModal(username);
      } else if (hash === '#guide' || hash === '#timeline' || hash === '#vidhi') {
        setActiveTab('guide');
      } else if (hash === '#arghya' || hash === '#arghya-times') {
        setActiveTab('arghya');
      } else if (hash === '#ghats') {
        setActiveTab('ghats');
      } else if (hash === '#prasad') {
        setActiveTab('prasad');
      } else if (hash === '#aarti' || hash === '#songs') {
        setActiveTab('aarti');
      } else if (hash === '#explore') {
        setActiveTab('explore');
      } else if (hash === '#my-chhath') {
        setActiveTab('my-chhath');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openReelsPlatform, openCreateModal, openProfileModal]);

  const handleCompleteCinematicIntro = () => {
    sessionStorage.setItem('chhath_intro_seen', 'true');
    setShowCinematicIntro(false);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      
      {/* 1. Cinematic Intro Modal */}
      {showCinematicIntro && (
        <CinematicIntro onComplete={handleCompleteCinematicIntro} />
      )}

      {/* Real-time Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Content Area based on destination tab */}
      <main className="flex-1 pb-20 lg:pb-12">
        {activeTab === 'home' && (
          <PublicHomeView onNavigate={handleNavigate} />
        )}

        {activeTab === 'guide' && (
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
            <FourDaysTimeline />
            <PujaVidhi />
            <SamagriChecklist />
          </div>
        )}

        {activeTab === 'arghya' && (
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
            <ArghyaTimeCalc />
            <ArghyaWeatherIntel />
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
            <SongsSection />
          </div>
        )}

        {activeTab === 'explore' && (
          <Suspense fallback={<ComponentLoader />}>
            <ExploreView />
          </Suspense>
        )}

        {activeTab === 'my-chhath' && (
          <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-8">
            {isAuthenticated && currentUser ? (
              <>
                <MyChhathDashboard />
                <FamilyChhathHub />
              </>
            ) : (
              <div className="p-8 sm:p-12 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4 max-w-xl mx-auto my-12">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                  मेरी छठ — व्यक्तिगत सेवा
                </h2>
                <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                  अपनी पूजा सामग्री सूची सहेजने, पसंदीदा गीत संजोने, परिवार के साथ दउरा/प्रसाद कार्य साझा करने और व्यक्तिगत सूचनाएं पाने के लिए निःशुल्क खाता बनाएं या लॉग इन करें।
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => openAuthModal('login', 'अपनी व्यक्तिगत पूजा सूची और परिवार के कार्य सहेजने के लिए लॉग इन करें।')}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mukta text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-stone-950" />
                    <span>लॉग इन करें</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('signup', 'अपना निःशुल्क छठ महापर्व खाता बनाएं।')}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold font-mukta text-sm border border-amber-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>निःशुल्क खाता बनाएं</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mini Audio Player */}
      <StickyPlayer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Personalization Wizard Modal */}
      <PersonalizationWizard
        isOpen={Boolean(currentUser && (!currentUser.onboardingCompleted || onboardingModalOpen))}
        onClose={closeOnboarding}
      />

      {/* Auth Modal */}
      <AuthModal />

      {/* Global Smart Search Engine Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectSong={(song) => playSong(song)}
        onSelectReel={(reelId) => openReelsPlatform('foryou', reelId)}
        onSelectUser={(username) => openProfileModal(username)}
      />

      {/* Location Onboarding Modal */}
      <LocationOnboardingModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />

      {/* AI Chhati Sahayak Assistant Modal */}
      <ChhathiAssistantModal
        isOpen={assistantModalOpen}
        onClose={() => setAssistantModalOpen(false)}
      />

      {/* Atmosphere Audio Mixer Modal */}
      <AtmosphereAudioMixer
        isOpen={mixerModalOpen}
        onClose={() => setMixerModalOpen(false)}
      />

      {/* Lazy Loaded Heavy Modals */}
      <Suspense fallback={null}>
        <ReelsPlatformModal />
        <ChhathConnectModal />
        <CallScreenModal />
        <ShareToChatModal />
        <AdminDashboard
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
        />
      </Suspense>

    </div>
  );
};

export default function App() {
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


