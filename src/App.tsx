import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChhathDataProvider } from './context/ChhathDataContext';
import { AudioProvider } from './context/AudioContext';

// Layout & Navigation Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/layout/SearchModal';
import { ScrollProgressBar } from './components/layout/ScrollProgressBar';
import { AdvancedSubNav } from './components/layout/AdvancedSubNav';
import { FloatingQuickDock } from './components/layout/FloatingQuickDock';
import { SectionDivider } from './components/layout/SectionDivider';

// Cinematic & Onboarding Modals
import { CinematicIntro } from './components/hero/CinematicIntro';
import { LocationOnboardingModal } from './components/onboarding/LocationOnboardingModal';
import { ChhathiAssistantModal } from './components/ai/ChhathiAssistantModal';
import { AtmosphereAudioMixer } from './components/audio/AtmosphereAudioMixer';
import { ReelsPlatformModal } from './components/reels/ReelsPlatformModal';
import { AuthModal } from './components/reels/AuthModal';
import { PublicWelcomeLanding } from './components/auth/PublicWelcomeLanding';
import { PersonalizationWizard } from './components/onboarding/PersonalizationWizard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReelsProvider, useReels } from './context/ReelsContext';
import { ChatProvider } from './context/ChatContext';
import { useAudio } from './context/AudioContext';

// Chhath Connect Social Communication Suite
import { ChhathConnectModal } from './components/chat/ChhathConnectModal';
import { CallScreenModal } from './components/chat/CallScreenModal';
import { ShareToChatModal } from './components/chat/ShareToChatModal';

// Home Page Sections (Ultra-Premium Cultural Architecture)
import { HeroSection } from './components/hero/HeroSection';
import { QuickHubBento } from './components/hero/QuickHubBento';
import { MyChhathDashboard } from './components/dashboard/MyChhathDashboard';
import { Interactive3DGhat } from './components/ghats/Interactive3DGhat';
import { FourDaysTimeline } from './components/timeline/FourDaysTimeline';
import { MyFirstChhath } from './components/beginner/MyFirstChhath';
import { ArghyaTimeCalc } from './components/astronomy/ArghyaTimeCalc';
import { ArghyaWeatherIntel } from './components/astronomy/ArghyaWeatherIntel';
import { VirtualArghyaSimulator } from './components/spiritual/VirtualArghyaSimulator';
import { VirtualDiyaExperience } from './components/spiritual/VirtualDiyaExperience';
import { SongsSection } from './components/audio/SongsSection';
import { StickyPlayer } from './components/audio/StickyPlayer';
import { PujaVidhi } from './components/vidhi/PujaVidhi';
import { SamagriChecklist } from './components/vidhi/SamagriChecklist';
import { ShoppingGuide } from './components/marketplace/ShoppingGuide';
import { PrasadSection } from './components/prasad/PrasadSection';
import { CookingStudio } from './components/prasad/CookingStudio';
import { ChhathKatha } from './components/spiritual/ChhathKatha';
import { MantraAarti } from './components/spiritual/MantraAarti';
import { GhatFinder } from './components/ghats/GhatFinder';
import { TravelPlanner } from './components/travel/TravelPlanner';
import { LiveUpdatesSection } from './components/live/LiveUpdatesSection';
import { SankalpWall } from './components/engagement/SankalpWall';
import { FamilyChhathHub } from './components/family/FamilyChhathHub';
import { WishesSection } from './components/engagement/WishesSection';
import { AIGreetingStudio } from './components/engagement/AIGreetingStudio';
import { BlessingCertificate } from './components/engagement/BlessingCertificate';
import { MemoryAlbum } from './components/memory/MemoryAlbum';
import { PhotoGallery } from './components/engagement/PhotoGallery';
import { VideoSection } from './components/engagement/VideoSection';
import { ChhathQuiz } from './components/engagement/ChhathQuiz';
import { ChhathKids } from './components/engagement/ChhathKids';
import { CulturalTimeline } from './components/culture/CulturalTimeline';
import { NRICreativeGuide } from './components/nri/NRICreativeGuide';
import { EventDirectory } from './components/events/EventDirectory';
import { ChhathCalendar } from './components/calendar/ChhathCalendar';
import { BlogSection } from './components/blog/BlogSection';
import { ChhathArchiveReport } from './components/archive/ChhathArchiveReport';
import { NewsletterSection } from './components/engagement/NewsletterSection';
import { AdminDashboard } from './components/admin/AdminDashboard';

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

  // 1. PUBLIC GATEKEEPER VIEW FOR UNREGISTERED VISITORS
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
        {showCinematicIntro && (
          <CinematicIntro onComplete={handleCompleteCinematicIntro} />
        )}
        <PublicWelcomeLanding />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      
      {/* 1. Cinematic Landing Experience (Darkness to Golden Sunrise) */}
      {showCinematicIntro && (
        <CinematicIntro onComplete={handleCompleteCinematicIntro} />
      )}

      {/* Real-time Top Window Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Header / Navbar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenLocation={() => setLocationModalOpen(true)}
        onOpenAssistant={() => setAssistantModalOpen(true)}
        onOpenReels={() => openReelsPlatform('foryou')}
      />

      {/* Main Home Page Sequence */}
      <main className="flex-1 pb-16 lg:pb-8">
        
        {/* Hero / जय छठी मईया & Horologium Countdown */}
        <HeroSection />

        {/* Advanced Sticky Sub-Navigation Category Rail */}
        <AdvancedSubNav />

        {/* Bento Grid Command Center Hub */}
        <QuickHubBento />

        {/* “मेरा छठ” (My Chhath Dashboard - Personalized Command Center) */}
        <MyChhathDashboard />

        <SectionDivider symbol="🌞" />

        {/* 3D Interactive Chhath Ghat (Explore River, Diyas, Sun, Arghya in 3D) */}
        <Interactive3DGhat />

        <SectionDivider symbol="🌊" />

        {/* Four Days of Chhath Timeline */}
        <FourDaysTimeline />

        {/* “My First Chhath” Mode (Beginner Step-by-Step Guide) */}
        <MyFirstChhath />

        <SectionDivider symbol="🌅" />

        {/* Today's Arghya Time & Astronomical Sun/Weather Calculator */}
        <ArghyaTimeCalc />

        {/* Arghya Weather Intelligence */}
        <div className="container-custom max-w-5xl mx-auto px-4">
          <ArghyaWeatherIntel />
        </div>

        <SectionDivider symbol="🏺" />

        {/* Virtual Arghya Simulator */}
        <VirtualArghyaSimulator />

        {/* Virtual Diya Experience & Global Diya Wall */}
        <VirtualDiyaExperience />

        <SectionDivider symbol="🎵" />

        {/* Chhath Songs Suite */}
        <SongsSection />

        <SectionDivider symbol="🪔" />

        {/* Puja Vidhi */}
        <PujaVidhi />

        {/* Puja Samagri Checklist */}
        <SamagriChecklist />

        {/* Cultural Shopping Guide */}
        <ShoppingGuide />

        <SectionDivider symbol="🌾" />

        {/* Chhath Prasad & Thekua Calculator */}
        <PrasadSection />

        {/* Chhath Recipe Studio & Cooking Mode */}
        <CookingStudio />

        <SectionDivider symbol="📖" />

        {/* Chhath Katha & Sacred Puranic Legends */}
        <ChhathKatha />

        {/* Mantra & Aarti */}
        <MantraAarti />

        <SectionDivider symbol="🌊" />

        {/* Nearby Ghats & Ghat Directory with Live River Safety Gauge */}
        <GhatFinder />

        {/* Smart Travel Planner */}
        <TravelPlanner />

        {/* Chhath Puja Live Updates & Weather Alert */}
        <LiveUpdatesSection />

        <SectionDivider symbol="📜" />

        {/* Sacred Sankalp & Prayer Wall */}
        <SankalpWall />

        {/* Family Chhath Mode (Shared Circle & Tasks) */}
        <FamilyChhathHub />

        <SectionDivider symbol="💌" />

        {/* AI Chhath Greeting Generator */}
        <AIGreetingStudio />

        {/* Wishes & Digital Greeting Cards */}
        <WishesSection />

        {/* VIP Blessing Certificate Studio */}
        <BlessingCertificate />

        {/* Chhath Memory Album (Multi-Year Archive 2026, 2025, 2024) */}
        <MemoryAlbum />

        <SectionDivider symbol="📸" />

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Videos Showcase */}
        <VideoSection />

        {/* Interactive Chhath Quiz */}
        <ChhathQuiz />

        {/* Chhath for Children (बाल वाटिका) */}
        <ChhathKids />

        <SectionDivider symbol="🏛️" />

        {/* Cultural Timeline (Rigveda to Global 21st Century) */}
        <CulturalTimeline />

        {/* Chhath for NRIs (Global Diaspora Guide) */}
        <NRICreativeGuide />

        {/* Chhath Event Directory */}
        <EventDirectory />

        {/* Digital Chhath Calendar */}
        <ChhathCalendar />

        {/* Latest Cultural Articles / Blog */}
        <BlogSection />

        {/* Multi-Year Archive & Annual Chhath Report */}
        <ChhathArchiveReport />

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Speed-Dial Quick Dock */}
      <FloatingQuickDock
        onOpenAssistant={() => setAssistantModalOpen(true)}
        onOpenMixer={() => setMixerModalOpen(true)}
        onOpenReels={() => openReelsPlatform('foryou')}
      />

      {/* Sticky Mini Audio Player */}
      <StickyPlayer />

      {/* Mobile Bottom Navigation Bar (#40) */}
      <MobileNav
        onOpenReels={() => openReelsPlatform('foryou')}
        onOpenCreate={() => openCreateModal()}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenProfile={() => {
          if (currentUser) openProfileModal(currentUser);
          else openAuthModal('login');
        }}
      />

      {/* Personalization Wizard Modal (Auto opens if !onboardingCompleted or triggered via user menu) */}
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

      {/* Dynamic Chhath Reels Platform Master Modal */}
      <ReelsPlatformModal />

      {/* Admin Dashboard CMS Modal */}
      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Chhath Connect Social Communication Suite */}
      <ChhathConnectModal />
      <CallScreenModal />
      <ShareToChatModal />

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

