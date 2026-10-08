import React, { Suspense, lazy } from 'react';
import { Film, Award, HelpCircle, Compass, Sun, Layers } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useLanguage } from '../../context/LanguageContext';

// Lazy loaded heavy secondary components (NO Interactive3DGhat - 3D Ghat excluded as requested)
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

const ComponentLoader: React.FC = () => (
  <div className="p-8 text-center font-mukta text-stone-500 flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    <span className="text-xs text-stone-400 mt-3">पवित्र अनुभव लोड हो रहा है...</span>
  </div>
);

interface DetailedExploreViewProps {
  onNavigate?: (tab: string) => void;
}

export const DetailedExploreView: React.FC<DetailedExploreViewProps> = ({ onNavigate }) => {
  const { openReelsPlatform } = useReels();
  const { language } = useLanguage();

  const exploreText = {
    hi: {
      badge: 'सांस्कृतिक एक्सप्लोर हब (विस्तृत रूप)',
      title: 'छठ सांस्कृतिक एवं सामुदायिक अनुभव',
      subtitle: 'आभासी अर्घ्य, दीप दान, शुभकामना कार्ड, संस्मरण एल्बम एवं प्रश्नोत्तरी—एक ही जगह।',
      tabbedBtn: '📂 श्रेणीबद्ध दृश्य (Tabs)',
      reelsTitle: '🔥 छठ रील्स',
      reelsSub: 'शॉर्ट वीडियो एवं भक्ति झलकियाँ',
      certTitle: '📜 आशीर्वाद पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      arghyaTitle: '🌅 आभासी अर्घ्य व दीप',
      arghyaSub: 'डिजिटल अर्घ्य व दीप दान सिमुलेटर',
      quizTitle: '❓ छठ प्रश्नोत्तरी',
      quizSub: 'ज्ञान परीक्षण व बाल वाटिका'
    },
    en: {
      badge: 'Cultural Explore Hub (Detailed)',
      title: 'Chhath Cultural & Devotional Experience',
      subtitle: 'Virtual Arghya, holy diya, greeting cards, memory album, and trivia—all in one place.',
      tabbedBtn: '📂 Categorized View (Tabs)',
      reelsTitle: '🔥 Chhath Reels',
      reelsSub: 'Short videos and devotional glimpses',
      certTitle: '📜 Blessing Certificate',
      certSub: 'Personalized HD digital certificate',
      arghyaTitle: '🌅 Virtual Arghya & Diya',
      arghyaSub: 'Sacred Arghya & holy diya simulator',
      quizTitle: '❓ Chhath Quiz',
      quizSub: 'Sacred trivia & kids zone'
    },
    bho: {
      badge: 'सांस्कृतिक एक्सप्लोर हब (विस्तृत रूप)',
      title: 'छठ सांस्कृतिक आ सामुदायिक अनुभव',
      subtitle: 'आभासी अरघ, दीप दान, असीस पत्र, संस्मरण आ सवाल-जवाब—एके जगह।',
      tabbedBtn: '📂 श्रेणीबद्ध दृश्य (Tabs)',
      reelsTitle: '🔥 छठ रील्स',
      reelsSub: 'छोट वीडियो आ भक्ति झलक',
      certTitle: '📜 असीस पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      arghyaTitle: '🌅 आभासी अरघ आ दीप',
      arghyaSub: 'डिजिटल अरघ आ दीप दान',
      quizTitle: '❓ छठ क्विज',
      quizSub: 'ज्ञान परीक्षण आ बाल वाटिका'
    },
    mai: {
      badge: 'सांस्कृतिक एक्सप्लोर हब (विस्तृत रूप)',
      title: 'छठि सांस्कृतिक ओ सामुदायिक अनुभव',
      subtitle: 'आभासी अर्घ्य, दीप दान, आशीष पत्र, संस्मरण ओ प्रश्नोत्तरी—एके स्थान पर।',
      tabbedBtn: '📂 श्रेणीबद्ध दृश्य (Tabs)',
      reelsTitle: '🔥 छठि रील्स',
      reelsSub: 'लघु वीडियो ओ भक्ति झलक',
      certTitle: '📜 आशीष पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      arghyaTitle: '🌅 आभासी अर्घ्य ओ दीप',
      arghyaSub: 'डिजिटल अर्घ्य ओ दीप दान',
      quizTitle: '❓ छठि प्रश्नोत्तरी',
      quizSub: 'ज्ञान परीक्षा ओ बाल वाटिका'
    },
    mag: {
      badge: 'सांस्कृतिक एक्सप्लोर हब (विस्तृत रूप)',
      title: 'छठ सांस्कृतिक आ सामुदायिक अनुभव',
      subtitle: 'आभासी अरघ, दीप दान, असीस पत्र, संस्मरण आ सवाल-जवाब—एके जगह।',
      tabbedBtn: '📂 श्रेणीबद्ध दृश्य (Tabs)',
      reelsTitle: '🔥 छठ रील्स',
      reelsSub: 'छोट वीडियो आ भक्ति झलक',
      certTitle: '📜 असीस पत्र',
      certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
      arghyaTitle: '🌅 आभासी अरघ आ दीप',
      arghyaSub: 'डिजिटल अरघ आ दीप दान',
      quizTitle: '❓ छठ क्विज',
      quizSub: 'ज्ञान परीक्षण आ बाल वाटिका'
    }
  }[language] || {
    badge: 'सांस्कृतिक एक्सप्लोर हब (विस्तृत रूप)',
    title: 'छठ सांस्कृतिक एवं सामुदायिक अनुभव',
    subtitle: 'आभासी अर्घ्य, दीप दान, शुभकामना कार्ड, संस्मरण एल्बम एवं प्रश्नोत्तरी—एक ही जगह।',
    tabbedBtn: '📂 श्रेणीबद्ध दृश्य (Tabs)',
    reelsTitle: '🔥 छठ रील्स',
    reelsSub: 'शॉर्ट वीडियो एवं भक्ति झलकियाँ',
    certTitle: '📜 आशीर्वाद पत्र',
    certSub: 'व्यक्तिगत HD डिजिटल प्रमाण पत्र',
    arghyaTitle: '🌅 आभासी अर्घ्य व दीप',
    arghyaSub: 'डिजिटल अर्घ्य व दीप दान सिमुलेटर',
    quizTitle: '❓ छठ प्रश्नोत्तरी',
    quizSub: 'ज्ञान परीक्षण व बाल वाटिका'
  };

  return (
    <div className="container-custom max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-8 sm:space-y-12">
      
      {/* Header with Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{exploreText.badge}</span>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('explore')}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold font-mukta shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{exploreText.tabbedBtn}</span>
              <span className="text-amber-500">→</span>
            </button>
          )}
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto pt-2">
          <h1 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {exploreText.title}
          </h1>
          <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {exploreText.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Launch Cards (Without 3D Ghat) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => openReelsPlatform('foryou')}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 text-left font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Film className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5" />
          <div className="font-rozha text-sm sm:text-base leading-tight">{exploreText.reelsTitle}</div>
          <div className="font-mukta text-[11px] font-medium opacity-90 truncate">{exploreText.reelsSub}</div>
        </button>

        <a
          href="#blessing-certificate"
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/25 text-stone-800 dark:text-stone-200 text-left font-bold text-decoration-none shadow-xs hover:border-amber-500/60 hover:scale-[1.02] transition-all"
        >
          <Award className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-sm sm:text-base leading-tight">{exploreText.certTitle}</div>
          <div className="font-mukta text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">{exploreText.certSub}</div>
        </a>

        <a
          href="#virtual-arghya"
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/25 text-stone-800 dark:text-stone-200 text-left font-bold text-decoration-none shadow-xs hover:border-amber-500/60 hover:scale-[1.02] transition-all"
        >
          <Sun className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-sm sm:text-base leading-tight">{exploreText.arghyaTitle}</div>
          <div className="font-mukta text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">{exploreText.arghyaSub}</div>
        </a>

        <a
          href="#quiz"
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/25 text-stone-800 dark:text-stone-200 text-left font-bold text-decoration-none shadow-xs hover:border-amber-500/60 hover:scale-[1.02] transition-all"
        >
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 text-amber-600 dark:text-amber-400" />
          <div className="font-rozha text-sm sm:text-base leading-tight">{exploreText.quizTitle}</div>
          <div className="font-mukta text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">{exploreText.quizSub}</div>
        </a>
      </div>

      <Suspense fallback={<ComponentLoader />}>
        
        {/* Virtual Simulators (Arghya & Diya - NO 3D Darshan) */}
        <section id="virtual-arghya" className="space-y-6 sm:space-y-8 scroll-mt-24">
          <VirtualArghyaSimulator />
          <VirtualDiyaExperience />
        </section>

        {/* Greetings, Wishes & Blessing Certificate */}
        <section className="space-y-6 sm:space-y-8">
          <div id="ai-greeting-generator" className="scroll-mt-24">
            <AIGreetingStudio />
          </div>
          <div id="wishes" className="scroll-mt-24">
            <WishesSection />
          </div>
          <div id="blessing-certificate" className="scroll-mt-24">
            <BlessingCertificate />
          </div>
        </section>

        {/* Memories & Photo/Video Gallery */}
        <section className="space-y-6 sm:space-y-8">
          <MemoryAlbum />
          <PhotoGallery />
          <VideoSection />
        </section>

        {/* Quiz & Kids Zone */}
        <section id="quiz" className="space-y-6 sm:space-y-8 scroll-mt-24">
          <ChhathQuiz />
          <ChhathKids />
        </section>

        {/* Cultural Timeline, NRI Guide, Events & Archive */}
        <section className="space-y-6 sm:space-y-8">
          <CulturalTimeline />
          <NRICreativeGuide />
          <EventDirectory />
          <ChhathArchiveReport />
        </section>

      </Suspense>

    </div>
  );
};
