import React, { Suspense, lazy } from 'react';
import { Sparkles, Film, Heart, Award, HelpCircle, BookOpen, Layers, Compass, Image } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useLanguage } from '../../context/LanguageContext';

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
  <div className="p-8 text-center font-mukta text-stone-500 flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
  </div>
);

export const ExploreView: React.FC = () => {
  const { openReelsPlatform } = useReels();
  const { language } = useLanguage();

  const exploreText = {
    hi: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठ सांस्कृतिक एवं सामुदायिक अनुभव',
      subtitle: 'रील्स, 3D घाट अनुभव, शुभकामना कार्ड, संस्मरण एल्बम एवं प्रश्नोत्तरी—एक ही जगह।',
      reelsTitle: '🔥 छठ रील्स',
      reelsSub: 'शॉर्ट वीडियो एवं भक्ति झलकियाँ',
      certTitle: '📜 आशीर्वाद पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      ghatTitle: '🌅 3D घाट अनुभव',
      ghatSub: 'आभासी अर्घ्य व नदी तट दृश्य',
      quizTitle: '❓ छठ प्रश्नोत्तरी',
      quizSub: 'ज्ञान परीक्षण व बाल वाटिका'
    },
    en: {
      badge: 'Cultural Explore Hub',
      title: 'Chhath Cultural & Devotional Experience',
      subtitle: 'Reels, 3D Ghat darshan, blessing certificates, memory album, and quiz—all in one hub.',
      reelsTitle: '🔥 Chhath Reels',
      reelsSub: 'Short videos and devotional glimpses',
      certTitle: '📜 Blessing Certificate',
      certSub: 'Personalized HD digital certificate',
      ghatTitle: '🌅 3D Ghat Experience',
      ghatSub: 'Virtual Arghya & riverfront visual',
      quizTitle: '❓ Chhath Quiz',
      quizSub: 'Sacred trivia & kids zone'
    },
    bho: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठ सांस्कृतिक आ सामुदायिक अनुभव',
      subtitle: 'रील्स, 3D घाट अनुभव, असीस पत्र, संस्मरण आ सवाल-जवाब—एके जगह।',
      reelsTitle: '🔥 छठ रील्स',
      reelsSub: 'छोट वीडियो आ भक्ति झलक',
      certTitle: '📜 असीस पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      ghatTitle: '🌅 3D घाट अनुभव',
      ghatSub: 'आभासी अरघ आ नदी तट दर्शन',
      quizTitle: '❓ छठ क्विज',
      quizSub: 'ज्ञान परीक्षण आ बाल वाटिका'
    },
    mai: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठि सांस्कृतिक ओ सामुदायिक अनुभव',
      subtitle: 'रील्स, 3D घाट अनुभव, आशीष पत्र, संस्मरण ओ प्रश्नोत्तरी—एके स्थान पर।',
      reelsTitle: '🔥 छठि रील्स',
      reelsSub: 'लघु वीडियो ओ भक्ति झलक',
      certTitle: '📜 आशीष पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      ghatTitle: '🌅 3D घाट अनुभव',
      ghatSub: 'आभासी अर्घ्य ओ नदी तट दर्शन',
      quizTitle: '❓ छठि प्रश्नोत्तरी',
      quizSub: 'ज्ञान परीक्षा ओ बाल वाटिका'
    },
    mag: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठ सांस्कृतिक आ सामुदायिक अनुभव',
      subtitle: 'रील्स, 3D घाट अनुभव, असीस पत्र, संस्मरण आ सवाल-जवाब—एके जगह।',
      reelsTitle: '🔥 छठ रील्स',
      reelsSub: 'छोट वीडियो आ भक्ति झलक',
      certTitle: '📜 असीस पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      ghatTitle: '🌅 3D घाट अनुभव',
      ghatSub: 'आभासी अरघ व नदी तट दृश्य',
      quizTitle: '❓ छठ क्विज',
      quizSub: 'ज्ञान परीक्षण आ बाल वाटिका'
    }
  }[language] || {
    badge: 'सांस्कृतिक एक्सप्लोर हब',
    title: 'छठ सांस्कृतिक एवं सामुदायिक अनुभव',
    subtitle: 'रील्स, 3D घाट अनुभव, शुभकामना कार्ड, संस्मरण एल्बम एवं प्रश्नोत्तरी—एक ही जगह।',
    reelsTitle: '🔥 छठ रील्स',
    reelsSub: 'शॉर्ट वीडियो एवं भक्ति झलकियाँ',
    certTitle: '📜 आशीर्वाद पत्र',
    certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
    ghatTitle: '🌅 3D घाट अनुभव',
    ghatSub: 'आभासी अर्घ्य व नदी तट दृश्य',
    quizTitle: '❓ छठ प्रश्नोत्तरी',
    quizSub: 'ज्ञान परीक्षण व बाल वाटिका'
  };

  return (
    <div className="container-custom max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
          <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{exploreText.badge}</span>
        </div>
        <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-amber-100">
          {exploreText.title}
        </h1>
        <p className="font-mukta text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
          {exploreText.subtitle}
        </p>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => openReelsPlatform('foryou')}
          className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 text-left font-bold shadow-md hover:scale-[1.02] transition-all"
        >
          <Film className="w-6 h-6 mb-2" />
          <div className="font-rozha text-base">{exploreText.reelsTitle}</div>
          <div className="font-mukta text-[11px] font-medium opacity-90">{exploreText.reelsSub}</div>
        </button>

        <a
          href="#blessing-certificate"
          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left font-bold text-decoration-none hover:scale-[1.02] transition-all"
        >
          <Award className="w-6 h-6 mb-2 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-base">{exploreText.certTitle}</div>
          <div className="font-mukta text-[11px] font-medium opacity-80">{exploreText.certSub}</div>
        </a>

        <a
          href="#interactive-3d"
          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left font-bold text-decoration-none hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-6 h-6 mb-2 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-base">{exploreText.ghatTitle}</div>
          <div className="font-mukta text-[11px] font-medium opacity-80">{exploreText.ghatSub}</div>
        </a>

        <a
          href="#quiz"
          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left font-bold text-decoration-none hover:scale-[1.02] transition-all"
        >
          <HelpCircle className="w-6 h-6 mb-2 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-base">{exploreText.quizTitle}</div>
          <div className="font-mukta text-[11px] font-medium opacity-80">{exploreText.quizSub}</div>
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
