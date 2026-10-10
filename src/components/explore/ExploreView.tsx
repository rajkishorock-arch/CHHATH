import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sparkles, Film, Heart, Award, HelpCircle, BookOpen, Layers, Compass, Image, Sun, Flame, MessageSquare } from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useLanguage } from '../../context/LanguageContext';

import { VirtualArghyaSimulator } from '../spiritual/VirtualArghyaSimulator';
import { VirtualDiyaExperience } from '../spiritual/VirtualDiyaExperience';

// Lazy loaded secondary components
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
  <div className="p-12 text-center font-mukta text-stone-500 flex flex-col items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
    <span className="text-xs text-stone-400 mt-3">पवित्र अनुभव लोड हो रहा है...</span>
  </div>
);

type ExploreTab = 'darshan' | 'mannat' | 'gallery' | 'gyan';

interface ExploreViewProps {
  onNavigate?: (tab: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onNavigate }) => {
  const { openReelsPlatform } = useReels();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ExploreTab>('darshan');

  // Sync tab with URL hash if opened via shortcut link
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('interactive-3d') || hash.includes('virtual-arghya') || hash.includes('diya')) {
        setActiveTab('darshan');
      } else if (hash.includes('blessing') || hash.includes('sankalp') || hash.includes('wishes') || hash.includes('greeting')) {
        setActiveTab('mannat');
      } else if (hash.includes('photo') || hash.includes('memory') || hash.includes('video')) {
        setActiveTab('gallery');
      } else if (hash.includes('quiz') || hash.includes('kids') || hash.includes('timeline') || hash.includes('nri') || hash.includes('event')) {
        setActiveTab('gyan');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const exploreText = {
    hi: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठ पावन सांस्कृतिक अनुभव',
      subtitle: 'डिजिटल अर्घ्य, दीप दान, आशीर्वाद पत्र, शुभकामना कार्ड एवं बाल वाटिका—सुव्यवस्थित रूप में।',
      detailedBtn: '📜 विस्तृत दृश्य (Full View)',
      tabDarshan: '🌅 आभासी अर्घ्य व दीप',
      tabDarshanSub: 'डिजिटल अर्घ्य व दीप दान',
      tabMannat: '📜 पावन आशीष व बधाई',
      tabMannatSub: 'पत्र, बधाई व शुभकामनाएं',
      tabGallery: '📸 संस्मरण व गैलरी',
      tabGallerySub: 'फोटो, वीडियो व एल्बम',
      tabGyan: '🧠 ज्ञान व संस्कृति',
      tabGyanSub: 'क्विज, बाल वाटिका व इतिहास'
    },
    en: {
      badge: 'Cultural Explore Hub',
      title: 'Chhath Devotional & Cultural Hub',
      subtitle: 'Virtual Arghya, sacred diya, blessing certificates, greeting cards & trivia—elegantly categorized.',
      detailedBtn: '📜 Detailed View (Full)',
      tabDarshan: '🌅 Virtual Arghya & Diya',
      tabDarshanSub: 'Sacred Arghya & Diya',
      tabMannat: '📜 Blessings & Wishes',
      tabMannatSub: 'Certificates & Greetings',
      tabGallery: '📸 Memory Gallery',
      tabGallerySub: 'Photos & Videos',
      tabGyan: '🧠 Sacred Trivia',
      tabGyanSub: 'Quiz, Kids & Heritage'
    },
    bho: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठ पावन सांस्कृतिक अनुभव',
      subtitle: 'डिजिटल अरघ, दीप दान, असीस पत्र, शुभकामना कार्ड आ बाल वाटिका—सजावल रूप में।',
      detailedBtn: '📜 विस्तृत दृश्य (Full View)',
      tabDarshan: '🌅 आभासी अरघ आ दीप',
      tabDarshanSub: 'डिजिटल अरघ आ दीप दान',
      tabMannat: '📜 पावन असीस आ बधाई',
      tabMannatSub: 'पत्र, बधाई आ शुभकामना',
      tabGallery: '📸 संस्मरण व गैलरी',
      tabGallerySub: 'फोटो, वीडियो आ एल्बम',
      tabGyan: '🧠 ज्ञान व संस्कृति',
      tabGyanSub: 'क्विज, बाल वाटिका आ इतिहास'
    },
    mai: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठि पावन सांस्कृतिक अनुभव',
      subtitle: 'डिजिटल अर्घ्य, दीप दान, आशीष पत्र, शुभकामना कार्ड ओ बाल वाटिका—सुव्यवस्थित रूप में।',
      detailedBtn: '📜 विस्तृत दृश्य (Full View)',
      tabDarshan: '🌅 आभासी अर्घ्य ओ दीप',
      tabDarshanSub: 'डिजिटल अर्घ्य ओ दीप दान',
      tabMannat: '📜 पावन आशीष ओ बधाई',
      tabMannatSub: 'पत्र, बधाई ओ शुभकामना',
      tabGallery: '📸 संस्मरण ओ गैलरी',
      tabGallerySub: 'फोटो, वीडियो ओ एल्बम',
      tabGyan: '🧠 ज्ञान ओ संस्कृति',
      tabGyanSub: 'क्विज, बाल वाटिका ओ इतिहास'
    },
    mag: {
      badge: 'सांस्कृतिक एक्सप्लोर हब',
      title: 'छठ पावन सांस्कृतिक अनुभव',
      subtitle: 'डिजिटल अरघ, दीप दान, असीस पत्र, शुभकामना कार्ड आ बाल वाटिका—सजावल रूप में।',
      detailedBtn: '📜 विस्तृत दृश्य (Full View)',
      tabDarshan: '🌅 आभासी अरघ आ दीप',
      tabDarshanSub: 'डिजिटल अरघ आ दीप दान',
      tabMannat: '📜 पावन असीस आ बधाई',
      tabMannatSub: 'पत्र, बधाई आ शुभकामना',
      tabGallery: '📸 संस्मरण व गैलरी',
      tabGallerySub: 'फोटो, वीडियो आ एल्बम',
      tabGyan: '🧠 ज्ञान व संस्कृति',
      tabGyanSub: 'क्विज, बाल वाटिका आ इतिहास'
    }
  }[language] || {
    badge: 'सांस्कृतिक एक्सप्लोर हब',
    title: 'छठ पावन सांस्कृतिक अनुभव',
    subtitle: 'डिजिटल अर्घ्य, दीप दान, आशीर्वाद पत्र, शुभकामना कार्ड एवं बाल वाटिका—सुव्यवस्थित रूप में।',
    detailedBtn: '📜 विस्तृत दृश्य (Full View)',
    tabDarshan: '🌅 आभासी अर्घ्य व दीप',
    tabDarshanSub: 'डिजिटल अर्घ्य व दीप दान',
    tabMannat: '📜 पावन आशीष व बधाई',
    tabMannatSub: 'पत्र, बधाई व शुभकामनाएं',
    tabGallery: '📸 संस्मरण व गैलरी',
    tabGallerySub: 'फोटो, वीडियो व एल्बम',
    tabGyan: '🧠 ज्ञान व संस्कृति',
    tabGyanSub: 'क्विज, बाल वाटिका व इतिहास'
  };

  const tabs = [
    {
      id: 'darshan' as ExploreTab,
      label: exploreText.tabDarshan,
      sub: exploreText.tabDarshanSub,
      icon: Sparkles
    },
    {
      id: 'mannat' as ExploreTab,
      label: exploreText.tabMannat,
      sub: exploreText.tabMannatSub,
      icon: Award
    },
    {
      id: 'gallery' as ExploreTab,
      label: exploreText.tabGallery,
      sub: exploreText.tabGallerySub,
      icon: Film
    },
    {
      id: 'gyan' as ExploreTab,
      label: exploreText.tabGyan,
      sub: exploreText.tabGyanSub,
      icon: BookOpen
    }
  ];

  return (
    <div className="container-custom max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{exploreText.badge}</span>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('explore-detailed')}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold font-mukta shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{exploreText.detailedBtn}</span>
              <span className="text-amber-500">→</span>
            </button>
          )}
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto pt-1">
          <h1 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {exploreText.title}
          </h1>
          <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {exploreText.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Reels Shortcut Ribbon */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
            🔥
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              छठ भक्ति रील्स व वीडियो
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mukta">
              श्रद्धालुओं द्वारा साझा की गई पवित्र झलकियां
            </div>
          </div>
        </div>
        <button
          onClick={() => openReelsPlatform('foryou')}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          रील्स देखें →
        </button>
      </div>

      {/* Curated 4-Category Segmented Tab Switcher */}
      <div className="bg-white dark:bg-stone-900/90 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none sticky top-16 z-30 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left sm:text-center flex sm:flex-col items-center sm:justify-center gap-1 sm:gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold shadow-xs ring-1 ring-amber-400 font-extrabold'
                  : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-600 dark:text-amber-400'}`} />
                <span className="text-xs sm:text-sm font-bold truncate">{tab.label}</span>
              </div>
              <span className={`text-[10px] hidden sm:block ${isActive ? 'text-stone-900/80 font-semibold' : 'text-stone-500 dark:text-stone-400 font-mukta'}`}>
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Views with Suspense */}
      <Suspense fallback={<ComponentLoader />}>
        
        {/* Tab 1: आभासी अर्घ्य व दीप (Virtual Arghya & Diya - NO 3D Ghat) */}
        {activeTab === 'darshan' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Virtual Simulators */}
            <section className="space-y-6">
              <VirtualArghyaSimulator />
              <VirtualDiyaExperience />
            </section>
          </div>
        )}

        {/* Tab 2: पावन आशीष व बधाई (Blessings & Wishes) */}
        {activeTab === 'mannat' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <section id="blessing-certificate" className="scroll-mt-24">
              <BlessingCertificate />
            </section>

            <section id="ai-greeting-generator" className="scroll-mt-24">
              <AIGreetingStudio />
            </section>

            <section id="wishes" className="scroll-mt-24">
              <WishesSection />
            </section>
          </div>
        )}

        {/* Tab 3: संस्मरण व गैलरी (Memories & Gallery) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <section className="scroll-mt-24">
              <MemoryAlbum />
            </section>

            <section className="scroll-mt-24">
              <PhotoGallery />
            </section>

            <section className="scroll-mt-24">
              <VideoSection />
            </section>
          </div>
        )}

        {/* Tab 4: ज्ञान व संस्कृति (Trivia, Kids & Heritage) */}
        {activeTab === 'gyan' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <section id="quiz" className="scroll-mt-24">
              <ChhathQuiz />
            </section>

            <section className="scroll-mt-24">
              <ChhathKids />
            </section>

            <section className="scroll-mt-24">
              <CulturalTimeline />
            </section>

            <section className="scroll-mt-24">
              <NRICreativeGuide />
            </section>

            <section className="scroll-mt-24">
              <EventDirectory />
            </section>

            <section className="scroll-mt-24">
              <ChhathArchiveReport />
            </section>
          </div>
        )}

      </Suspense>

    </div>
  );
};
