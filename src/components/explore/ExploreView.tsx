import React, { Suspense, lazy } from 'react';
import { Sparkles, Film, Heart, Award, MessageCircle, HelpCircle, BookOpen, Layers, Compass, Image } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useChat } from '../../context/ChatContext';

// Lazy loaded heavy secondary components
const Interactive3DGhat = lazy(() => import('../ghats/Interactive3DGhat').then(m => ({ default: m.Interactive3DGhat })));
const VirtualArghyaSimulator = lazy(() => import('../spiritual/VirtualArghyaSimulator').then(m => ({ default: m.VirtualArghyaSimulator })));
const VirtualDiyaExperience = lazy(() => import('../spiritual/VirtualDiyaExperience').then(m => ({ default: m.VirtualDiyaExperience })));
const ChhathQuiz = lazy(() => import('../engagement/ChhathQuiz').then(m => ({ default: m.ChhathQuiz })));
const ChhathKids = lazy(() => import('../engagement/ChhathKids').then(m => ({ default: m.ChhathKids })));
const AIGreetingStudio = lazy(() => import('../engagement/AIGreetingStudio').then(m => ({ default: m.AIGreetingStudio })));
const WishesSection = lazy(() => import('../engagement/WishesSection').then(m => ({ default: m.WishesSection })));
const BlessingCertificate = lazy(() => import('../engagement/BlessingCertificate').then(m => ({ default: m.BlessingCertificate })));
const MemoryAlbum = lazy(() => import('../memory/MemoryAlbum').then(m => ({ default: m.MemoryAlbum })));
const PhotoGallery = lazy(() => import('../engagement/PhotoGallery').then(m => ({ default: m.PhotoGallery })));
const VideoSection = lazy(() => import('../engagement/VideoSection').then(m => ({ default: m.VideoSection })));
const CulturalTimeline = lazy(() => import('../culture/CulturalTimeline').then(m => ({ default: m.CulturalTimeline })));
const NRICreativeGuide = lazy(() => import('../nri/NRICreativeGuide').then(m => ({ default: m.NRICreativeGuide })));
const EventDirectory = lazy(() => import('../events/EventDirectory').then(m => ({ default: m.EventDirectory })));
const ChhathArchiveReport = lazy(() => import('../archive/ChhathArchiveReport').then(m => ({ default: m.ChhathArchiveReport })));
const SankalpWall = lazy(() => import('../engagement/SankalpWall').then(m => ({ default: m.SankalpWall })));

const ComponentLoader: React.FC = () => (
  <div className="p-8 text-center font-mukta text-stone-500 flex flex-col items-center gap-2">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
    <span className="text-xs">सामग्री लोड हो रही है...</span>
  </div>
);

export const ExploreView: React.FC = () => {
  const { openReelsPlatform } = useReels();
  const { openConnect } = useChat();

  return (
    <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
          <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>सांस्कृतिक एक्सप्लोर हब (Explore Cultural Hub)</span>
        </div>
        <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-amber-100">
          छठ सांस्कृतिक एवं सामुदायिक अनुभव
        </h1>
        <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
          रील्स, 3D घाट अनुभव, शुभकामना कार्ड, संस्मरण एल्बम एवं प्रश्नोत्तरी—एक ही जगह।
        </p>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => openReelsPlatform('foryou')}
          className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 text-left font-bold shadow-md hover:scale-[1.02] transition-all"
        >
          <Film className="w-6 h-6 mb-2" />
          <div className="font-rozha text-base">🔥 छठ रील्स</div>
          <div className="font-mukta text-[11px] font-medium opacity-90">शॉर्ट वीडियो एवं भक्ति झलकियाँ</div>
        </button>

        <button
          onClick={() => openConnect()}
          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left font-bold hover:scale-[1.02] transition-all"
        >
          <MessageCircle className="w-6 h-6 mb-2 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-base">💬 छठ कनेक्ट</div>
          <div className="font-mukta text-[11px] font-medium opacity-80">सामुदायिक संवाद व प्रश्नोत्तर</div>
        </button>

        <a
          href="#interactive-3d"
          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left font-bold text-decoration-none hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-6 h-6 mb-2 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-base">🌅 3D घाट अनुभव</div>
          <div className="font-mukta text-[11px] font-medium opacity-80">आभासी अर्घ्य व नदी तट दृश्य</div>
        </a>

        <a
          href="#quiz"
          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left font-bold text-decoration-none hover:scale-[1.02] transition-all"
        >
          <HelpCircle className="w-6 h-6 mb-2 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-base">❓ छठ प्रश्नोत्तरी</div>
          <div className="font-mukta text-[11px] font-medium opacity-80">ज्ञान परीक्षण व बाल वाटिका</div>
        </a>
      </div>

      <Suspense fallback={<ComponentLoader />}>
        
        {/* Interactive 3D Ghat */}
        <section id="interactive-3d" className="scroll-mt-24">
          <Interactive3DGhat />
        </section>

        {/* Virtual Simulators */}
        <section className="space-y-8">
          <VirtualArghyaSimulator />
          <VirtualDiyaExperience />
        </section>

        {/* Sankalp & Prayer Wall */}
        <section>
          <SankalpWall />
        </section>

        {/* Greetings & Blessing Certificate */}
        <section className="space-y-8">
          <AIGreetingStudio />
          <WishesSection />
          <BlessingCertificate />
        </section>

        {/* Memories & Photo/Video Gallery */}
        <section className="space-y-8">
          <MemoryAlbum />
          <PhotoGallery />
          <VideoSection />
        </section>

        {/* Quiz & Kids Zone */}
        <section id="quiz" className="space-y-8 scroll-mt-24">
          <ChhathQuiz />
          <ChhathKids />
        </section>

        {/* Cultural Timeline & NRI Guide */}
        <section className="space-y-8">
          <CulturalTimeline />
          <NRICreativeGuide />
          <EventDirectory />
          <ChhathArchiveReport />
        </section>

      </Suspense>

    </div>
  );
};
