import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { SongsSection } from '../audio/SongsSection';
import { Music, Sun, Calendar, CheckSquare, Utensils, ArrowRight, HelpCircle, Sparkles, BookOpen } from 'lucide-react';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathGeetPage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-puja-geet/';
  const title = 'Chhath Puja Geet 2026 | छठ गीत, Chhath Maiya Bhajan & Songs';
  const description = 'छठ पूजा 2026 के लोकप्रिय छठ गीत, छठ मैया के भजन और Chhath Puja Songs सुनें। पारंपरिक छठ गीत खोजें और YouTube पर भक्तिमय गीतों का आनंद लें।';

  const breadcrumbs = [
    { label: 'छठ पूजा के गीत 2026', url: '/CHHATH/chhath-puja-geet/' }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Chhath Puja Geet 2026 | छठ गीत और Chhath Maiya Bhajan',
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
          'name': 'छठ पूजा के गीत 2026',
          'item': canonicalUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Chhath Puja के लोकप्रिय गीत कौन से हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा के सबसे लोकप्रिय गीतों में शारदा सिन्हा जी के "उगिहे सूरज देव", "काँच ही बाँस के बहँगिया", "केलवा के पात पर", अनुराधा पौडवाल, पवन सिंह व खेसारी लाल यादव के छठ गीत शामिल हैं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'Chhath Maiya के गीत कहाँ सुन सकते हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'आप इस प्लेटफॉर्म पर एकीकृत YouTube खोज और संगीत प्लेयर के माध्यम से छठ मैया के सभी पारंपरिक गीत, भजन और भक्ति गीत निःशुल्क एक ही स्थान पर सुन सकते हैं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'Chhath Puja के लिए भोजपुरी और मैथिली गीत कैसे खोजें?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'वेबसाइट के संगीत खोज बॉक्स में गायक का नाम या "Pawan Singh Chhath", "Sharda Sinha Chhath", "भोजपुरी छठ गीत" अथवा "मैथिली छठ गीत" लिखकर सर्च बटन या Enter दबाएं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या इस वेबसाइट पर Chhath songs search कर सकते हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'हाँ, वेबसाइट पर सुरक्षित क्लाउडफ्लेयर वर्कर और YouTube Data API इंटीग्रेशन के जरिए आप किसी भी छठ गीत या गायक को खोजकर लाइव ऑडियो-वीडियो का आनंद ले सकते हैं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या YouTube से Chhath songs सुन सकते हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'हाँ, आधिकारिक YouTube IFrame Player की सहायता से आप बिना किसी बाहरी ऐप के सीधे इसी प्लेटफॉर्म पर भक्तिमय छठ गीतों का आनंद ले सकते हैं।'
          }
        }
      ]
    }
  ];

  const scrollToMusic = () => {
    const musicElement = document.getElementById('songs');
    if (musicElement) {
      musicElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-16">
      <SeoHead
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className="container-custom max-w-5xl mx-auto px-4 pt-4 space-y-8">
        
        {/* 1. Breadcrumb */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* 2. Hero Section */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-5 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs uppercase tracking-wider">
            <Music className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>पावन लोक संगीत एवं भक्ति संग्रह • 2026</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight leading-tight">
            छठ पूजा के गीत 2026 — Chhath Puja Geet & Chhath Maiya Bhajan
          </h1>

          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
            छठ महापर्व के पारंपरिक छठ गीत, छठ मैया के भजन और पूजा के भक्तिमय गीत एक ही जगह सुनें।
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToMusic}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold font-mukta text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Music className="w-5 h-5 fill-stone-950" />
              <span>छठ गीत सुनें</span>
            </button>

            <a
              href="/CHHATH/chhath-puja-vidhi/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-puja-vidhi');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white dark:bg-stone-900 hover:bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold font-mukta text-sm sm:text-base border border-amber-500/30 transition-all flex items-center justify-center gap-2 text-decoration-none"
            >
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>छठ पूजा विधि देखें</span>
            </a>
          </div>
        </header>

        {/* 3. Reusable Global Music Search & Player Component */}
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <SongsSection />
        </div>

        {/* 4. SEO Informational Content */}
        <article className="space-y-8 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section: Why Chhath Songs Are Important */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/15 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                🌅
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                छठ पूजा के गीत क्यों महत्वपूर्ण हैं?
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              छठ महापर्व केवल एक धार्मिक अनुष्ठान नहीं, बल्कि प्रकृति, सूर्य देव और षष्ठी मैया के प्रति अगाध निष्ठा का पावन लोकपर्व है। छठ पूजा की आत्मा इसके पारंपरिक लोकगीतों (Chhath Puja Geet) में बसती है। नहाय-खाय से लेकर उषा अर्घ्य तक, घर-आँगन और नदी घाटों पर गूंजते <strong>Chhath Maiya Bhajan</strong> सम्पूर्ण वातावरण को अलौकिक और भक्तिमय बना देते हैं।
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              स्वर कोकिला पद्म भूषण स्वर्गीय शारदा सिन्हा जी के अमर छठ गीत जैसे <em>&ldquo;काँच ही बाँस के बहँगिया&rdquo;</em>, <em>&ldquo;उगिहे सूरज देव&rdquo;</em> और <em>&ldquo;केलवा के पात पर&rdquo;</em> हर व्रती के हृदय में भक्ति का अलौकिक भाव जागृत करते हैं। संध्या अर्घ्य (Sandhya Arghya) और उषा अर्घ्य (Usha Arghya) के समय परिवार व समुदाय के लोग एक साथ मिलकर घाट की ओर बढ़ते हैं, जहां <strong>Chhath Puja Songs 2026</strong> की मिठास संपूर्ण समाज को एक सूत्र में पिरोती है।
            </p>
          </section>

          {/* Section: How to Search Popular Chhath Songs */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/15 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                🎶
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                लोकप्रिय छठ गीत कैसे खोजें?
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              हमारी वेबसाइट पर आप आसानी से अपने पसंदीदा कलाकारों और भजनों के <strong>Chhath Bhajan</strong> खोज सकते हैं। ऊपर दिए गए सर्च बॉक्स में आप निम्नलिखित तरीकों से खोज सकते हैं:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-stone-800 dark:text-stone-200">
              <li className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>गायक के नाम से:</strong> Sharda Sinha, Pawan Singh, Khesari Lal Yadav, Anuradha Paudwal आदि।
                </div>
              </li>
              <li className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>पर्व के अवसर अनुसार:</strong> संध्या अर्घ्य गीत, उषा अर्घ्य भजन, नहाय-खाय व खरना स्पेशल गीत।
                </div>
              </li>
              <li className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>क्षेत्रीय भाषा अनुसार:</strong> भोजपुरी छठ गीत, मैथिली छठ गीत, मगही लोकगीत।
                </div>
              </li>
              <li className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>भजन शीर्षक द्वारा:</strong> "उगिहे सूरज देव", "काँच ही बाँस के बहँगिया", "मारबो रे सुगवा धनुष से"।
                </div>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-amber-100">
              <HelpCircle className="w-6 h-6 text-amber-500" />
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold">
                अक्सर पूछे जाने वाले प्रश्न (FAQ)
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  1. Chhath Puja के लोकप्रिय गीत कौन से हैं?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  छठ पूजा के सबसे लोकप्रिय गीतों में शारदा सिन्हा जी के "उगिहे सूरज देव", "काँच ही बाँस के बहँगिया", "केलवा के पात पर", अनुराधा पौडवाल, पवन सिंह व खेसारी लाल यादव के छठ गीत शामिल हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  2. Chhath Maiya के गीत कहाँ सुन सकते हैं?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  आप इस प्लेटफॉर्म पर एकीकृत YouTube खोज और संगीत प्लेयर के माध्यम से छठ मैया के सभी पारंपरिक गीत, भजन और भक्ति गीत निःशुल्क एक ही स्थान पर सुन सकते हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  3. Chhath Puja के लिए भोजपुरी और मैथिली गीत कैसे खोजें?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  वेबसाइट के संगीत खोज बॉक्स में गायक का नाम या "Pawan Singh Chhath", "Sharda Sinha Chhath", "भोजपुरी छठ गीत" अथवा "मैथिली छठ गीत" लिखकर सर्च बटन या Enter दबाएं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  4. क्या इस वेबसाइट पर Chhath songs search कर सकते हैं?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  हाँ, वेबसाइट पर सुरक्षित क्लाउडफ्लेयर वर्कर और YouTube Data API इंटीग्रेशन के जरिए आप किसी भी छठ गीत या गायक को खोजकर लाइव ऑडियो-वीडियो का आनंद ले सकते हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  5. क्या YouTube से Chhath songs सुन सकते हैं?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  हाँ, आधिकारिक YouTube IFrame Player की सहायता से आप बिना किसी बाहरी ऐप के सीधे इसी प्लेटफॉर्म पर भक्तिमय छठ गीतों का आनंद ले सकते हैं।
                </p>
              </div>
            </div>
          </section>

          {/* Related Guides / Internal Links */}
          <section className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा से जुड़े अन्य महत्वपूर्ण मार्गदर्शक (Chhath Guides)
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <a
                href="/CHHATH/chhath-puja-vidhi/"
                onClick={(e) => { e.preventDefault(); onNavigate('chhath-puja-vidhi'); }}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span className="text-xs sm:text-sm">छठ पूजा विधि 2026</span>
                <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
              </a>

              <a
                href="/CHHATH/chhath-samagri/"
                onClick={(e) => { e.preventDefault(); onNavigate('chhath-samagri'); }}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span className="text-xs sm:text-sm">छठ पूजा सामग्री सूची</span>
                <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
              </a>

              <a
                href="/CHHATH/chhath-arghya-time-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('chhath-arghya-time-2026'); }}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span className="text-xs sm:text-sm">आज का अर्घ्य समय</span>
                <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
              </a>

              <a
                href="/CHHATH/thekua-recipe/"
                onClick={(e) => { e.preventDefault(); onNavigate('thekua-recipe'); }}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span className="text-xs sm:text-sm">ठेकुआ प्रसाद रेसिपी</span>
                <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
