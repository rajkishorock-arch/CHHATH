import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { 
  Utensils, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Play, 
  Video, 
  Clock, 
  ChefHat, 
  Flame,
  AlertTriangle,
  Info
} from 'lucide-react';
import { chhathPrasadItems, thekuaRecipeDetails } from '../../data/prasad';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { ThekuaCalculator } from '../prasad/ThekuaCalculator';

interface PageProps {
  onNavigate: (url: string) => void;
}

interface VideoPlaylistItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  tag: string;
  dishId: string;
}

export const ThekuaRecipePage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/thekua-recipe/';
  const title = 'छठ पूजा के पावन पकवान व ठेकुआ रेसिपी | विधि, सामग्री व वीडियो प्लेलिस्ट';
  const description = 'छठ पूजा के मुख्य महाप्रसाद: पारंपरिक खस्ता ठेकुआ, खरना रसियाव (खीर) और कसार लड्डू बनाने की प्रामाणिक विधि, सामग्री की मात्रा एवं स्टेप-बाय-स्टेप वीडियो ट्यूटोरियल प्लेलिस्ट।';

  const breadcrumbs = [
    { label: 'पावन पकवान व ठेकुआ रेसिपी', url: '#thekua-recipe' }
  ];

  // Active pakwan tab
  const [activeTab, setActiveTab] = useState<string>('thekua');

  // Video Playlist definition with working YouTube videos
  const recipeVideos: VideoPlaylistItem[] = [
    {
      id: 'kYJdJ-Q9eI4',
      title: 'पारंपरिक खस्ता ठेकुआ (गुड़ वाला) - सबसे आसान व प्रामाणिक विधि',
      channel: "Kabita's Kitchen",
      duration: '8:45',
      tag: 'गुड़ ठेकुआ',
      dishId: 'thekua'
    },
    {
      id: 'S0T0R5G9_C0',
      title: 'चीनी वाला खस्ता ठेकुआ व बिना सांचे के पारंपरिक डिजाइन',
      channel: "Kabita's Kitchen",
      duration: '7:15',
      tag: 'चीनी ठेकुआ',
      dishId: 'thekua'
    },
    {
      id: 'BtsnKmWVl7I',
      title: 'खरना विशेष: पारंपरिक रसियाव (गुड़ की खीर) बनाने के सात्विक नियम व विधि',
      channel: 'छठ महाप्रसाद रसोई',
      duration: '9:30',
      tag: 'खरना रसियाव',
      dishId: 'rasiyaw'
    },
    {
      id: '87Y-OH_mJxM',
      title: 'छठ पूजा के चावल के कसार (भुसवा) लड्डू बनाने की पारंपरिक विधि',
      channel: 'पारंपरिक बिहारी रसोई',
      duration: '6:20',
      tag: 'कसार लड्डू',
      dishId: 'kasar'
    }
  ];

  const [activeVideo, setActiveVideo] = useState<VideoPlaylistItem>(recipeVideos[0]);

  // Current selected pakwan details
  const currentPrasad = chhathPrasadItems.find(p => p.id === activeTab) || chhathPrasadItems[0];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      'name': 'छठ पूजा का ठेकुआ व महाप्रसाद रेसिपी (Thekua & Prasad Recipe)',
      'image': 'https://rajkishorock-arch.github.io/CHHATH/images/thekua_prasad.jpg',
      'description': description,
      'recipeCategory': 'Dessert / Prasad',
      'recipeCuisine': 'Bihari / Traditional Indian',
      'keywords': 'Thekua, Thekua Recipe, Chhath Puja Prasad, Rasiyaw, Kasar Laddoo, Khajuria',
      'recipeIngredient': currentPrasad.ingredients,
      'recipeInstructions': currentPrasad.method.map((step, idx) => ({
        '@type': 'HowToStep',
        'name': `चरण ${idx + 1}`,
        'text': step
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': title,
      'description': description,
      'url': canonicalUrl
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://rajkishorock-arch.github.io/CHHATH/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'ठेकुआ व पकवान रेसिपी',
          'item': canonicalUrl
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-16">
      <SeoHead
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        ogImage="https://rajkishorock-arch.github.io/CHHATH/images/thekua_prasad.jpg"
        jsonLd={jsonLd}
      />

      <div className="container-custom max-w-5xl mx-auto px-4 pt-4 space-y-8">
        
        {/* Breadcrumb with Scroll-Preserving Back Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Hero Header */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs border border-amber-500/30 shadow-xs">
            <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>छठ महापर्व के पवित्र महाप्रसाद • संपूर्ण विधि व वीडियो गाइड</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            छठ पूजा के पावन पकवान व ठेकुआ रेसिपी
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
            काठ के पारंपरिक सांचे पर गढ़ा खस्ता ठेकुआ, खरना का अमृततुल्य रसियाव (गुड़ की खीर), चावल के कसार लड्डू और फल। प्रामाणिक सामग्री, चरणबद्ध विधि और वीडियो ट्यूटोरियल प्लेलिस्ट।
          </p>
        </header>

        {/* Video Tutorial Playlist Player Section */}
        <section className="rounded-3xl bg-stone-900 text-white border border-amber-500/30 overflow-hidden shadow-2xl space-y-0">
          <div className="p-4 sm:p-6 bg-stone-950/80 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600 text-white shadow-md">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  स्टेप-बाय-स्टेप वीडियो ट्यूटोरियल प्लेलिस्ट
                </span>
                <h2 className="font-rozha text-lg sm:text-xl font-bold text-white">
                  {activeVideo.title}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-mukta">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {activeVideo.tag}
              </span>
              <span>• चैनल: {activeVideo.channel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Embedded Responsive Player */}
            <div className="lg:col-span-2 relative bg-black aspect-video flex items-center justify-center">
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=0&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Playlist Selector */}
            <div className="p-4 bg-stone-950/90 border-t lg:border-t-0 lg:border-l border-amber-500/20 flex flex-col justify-between max-h-[360px] overflow-y-auto">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-3 font-mukta">
                  प्लेलिस्ट के अन्य वीडियो (चुनें):
                </span>
                <div className="space-y-2">
                  {recipeVideos.map((vid) => {
                    const isSelected = vid.id === activeVideo.id;
                    return (
                      <button
                        key={vid.id}
                        onClick={() => {
                          setActiveVideo(vid);
                          if (vid.dishId) setActiveTab(vid.dishId);
                        }}
                        className={`w-full text-left p-3 rounded-2xl transition-all font-mukta flex items-start gap-3 border ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                            : 'bg-stone-900/80 hover:bg-stone-800/80 border-stone-800 text-stone-300 hover:text-white'
                        }`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'
                        }`}>
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                            {vid.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                            <span>{vid.channel}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {vid.duration}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 font-mukta flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>वीडियो पर क्लिक करके तुरंत विधि देखें।</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pakwan Selector Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-amber-500" />
              <span>छठ महापर्व के पवित्र पकवान विवरण</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-amber-500/20">
            {chhathPrasadItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Also switch video if matching
                    const matchingVid = recipeVideos.find(v => v.dishId === item.id);
                    if (matchingVid) setActiveVideo(matchingVid);
                  }}
                  className={`flex-1 min-w-[130px] sm:min-w-0 px-4 py-2.5 rounded-xl font-mukta text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md font-black scale-[1.02]'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-amber-500/10'
                  }`}
                >
                  <span>{item.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pakwan Details Card */}
        <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-lg space-y-8 font-mukta">
          
          {/* Header of Active Dish */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-orange-600 dark:text-amber-400 uppercase tracking-wider block">
                {currentPrasad.localName}
              </span>
              <h3 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-amber-100">
                {currentPrasad.name}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                {currentPrasad.shortDesc}
              </p>
            </div>
            {currentPrasad.culturalSignificance && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-xs text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  सांस्कृतिक व धार्मिक महत्व:
                </span>
                <p className="text-stone-700 dark:text-stone-300">
                  {currentPrasad.culturalSignificance}
                </p>
              </div>
            )}
          </div>

          {/* Section: Ingredients (सामग्री) */}
          <section className="space-y-4">
            <h4 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <span>आवश्यक सामग्री (Ingredients)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {currentPrasad.ingredients.map((ing, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Step-by-Step Method (विधि) */}
          <section className="space-y-4">
            <h4 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
              <span>बनाने की चरणबद्ध प्रामाणिक विधि (Step-by-Step Instructions)</span>
            </h4>
            <div className="space-y-3">
              {currentPrasad.method.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-amber-500/15 flex items-start gap-3.5 shadow-2xs">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center shrink-0 shadow">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Thekua Pro Tips & Mistakes if Thekua is selected */}
          {activeTab === 'thekua' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                <h5 className="font-rozha text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>खस्ता ठेकुआ के विशेष नियम (Pro Tips)</span>
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  {thekuaRecipeDetails.proTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-3">
                <h5 className="font-rozha text-lg font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>सामान्य गलतियाँ जिनसे बचें</span>
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  {thekuaRecipeDetails.commonMistakes.map((err, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </article>

        {/* Interactive Thekua Ingredients Calculator */}
        <div className="space-y-3">
          <ThekuaCalculator />
        </div>

        {/* FAQ Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4 font-mukta">
          <h3 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>अक्सर पूछे जाने वाले प्रश्न (FAQ)</span>
          </h3>
          <div className="space-y-3 text-sm sm:text-base">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <h4 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: छठ पूजा में ठेकुआ किस दिन और कैसे बनाया जाता है?</h4>
              <p className="mt-1 text-stone-700 dark:text-stone-300 text-sm">
                उत्तर: ठेकुआ मुख्य रूप से तीसरे दिन (संध्या अर्घ्य / पहला अर्घ्य) दोपहर के समय पूरी पवित्रता, स्नान और मौन के साथ नए मिट्टी के चूल्हे पर आम की लकड़ी से अथवा शुद्ध पीतल के बर्तनों में देशी घी में बनाया जाता है।
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <h4 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: ठेकुआ खस्ता बनाने का सबसे बड़ा रहस्य क्या है?</h4>
              <p className="mt-1 text-stone-700 dark:text-stone-300 text-sm">
                उत्तर: सही मोयन (1 किलो आटे में 200 ग्राम घी), कड़ा (सख्त) आटा गूंथना और सबसे महत्वपूर्ण—धीमी आंच पर धैर्यपूर्वक दोनों तरफ से सुनहरा-भूरा होने तक तलना।
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <h4 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: खरना के रसियाव में दूध फटने से कैसे रोकें?</h4>
              <p className="mt-1 text-stone-700 dark:text-stone-300 text-sm">
                उत्तर: खीर पक जाने के बाद गैस या आंच से उतार लें। थोड़ा ठंडा होने पर अलग से पिघलाया हुआ गुनगुना गुड़ का रस मिलाएं। खौलते दूध में सीधे कच्चा गुड़ डालने से दूध फट सकता है।
              </p>
            </div>
          </div>
        </section>

        {/* Crawlable Internal Links */}
        <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <h3 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
            संबंधित छठ पर्व गाइड
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('chhath-samagri')}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <span>छठ पूजा सामग्री सूची देखें</span>
              <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            </button>
            <button
              onClick={() => onNavigate('chhath-puja-vidhi')}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <span>छठ पूजा विधि 2026 पढ़ें</span>
              <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            </button>
            <button
              onClick={() => onNavigate('aarti')}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all cursor-pointer text-left"
            >
              <span>सूर्य देव आरती व मंत्र सुनें</span>
              <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
