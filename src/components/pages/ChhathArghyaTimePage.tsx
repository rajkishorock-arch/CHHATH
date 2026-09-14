import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Sun, Clock, MapPin, ArrowRight, HelpCircle, ShieldCheck, Compass } from 'lucide-react';
import { ArghyaTimeCalc } from '../astronomy/ArghyaTimeCalc';
import { ArghyaWeatherIntel } from '../astronomy/ArghyaWeatherIntel';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathArghyaTimePage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-arghya-time/';
  const title = 'Chhath Arghya Time 2026 | संध्या और उषा अर्घ्य समय';
  const description = 'Chhath Puja 2026 में 15 नवंबर संध्या अर्घ्य और 16 नवंबर उषा अर्घ्य का समय: सूर्यास्त व सूर्योदय की सटीक खगोलीय गणना व स्थान-आधारित कैलकुलेटर।';

  const breadcrumbs = [
    { label: 'छठ अर्घ्य समय', url: '/CHHATH/chhath-arghya-time/' }
  ];

  const jsonLd = [
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
          'name': 'छठ अर्घ्य समय 2026',
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
          'name': 'संध्या अर्घ्य कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'संध्या अर्घ्य कार्तिक शुक्ल षष्ठी, 15 नवंबर 2026 (रविवार) को सूर्यास्त के समय अस्ताचलगामी सूर्य को अर्पित किया जाएगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'उषा अर्घ्य कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'उषा अर्घ्य कार्तिक शुक्ल सप्तमी, 16 नवंबर 2026 (सोमवार) को प्रातः सूर्योदय के समय उदित होते बाल-सूर्य को समर्पित किया जाएगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या अर्घ्य का समय शहर के अनुसार बदलता है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'हाँ, सूर्यास्त एवं सूर्योदय का सटीक समय आपके शहर के अक्षांश (Latitude) एवं देशांतर (Longitude) के अनुसार भिन्न होता है। इसलिए अपने शहर की सटीक खगोलीय गणना देखना आवश्यक है।'
          }
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
        jsonLd={jsonLd}
      />

      <div className="container-custom max-w-4xl mx-auto px-4 pt-4 space-y-8">
        
        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Hero Header */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>सटीक खगोलीय सूर्यास्त व सूर्योदय गणना</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            छठ अर्घ्य समय 2026
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            15 नवंबर संध्या अर्घ्य और 16 नवंबर उषा अर्घ्य का प्रामाणिक समय, शहर-अनुसार कैलकुलेटर एवं घाट निर्देश।
          </p>
        </header>

        {/* Main Location Calculator Component */}
        <section className="space-y-6">
          <ArghyaTimeCalc />
          <ArghyaWeatherIntel />
        </section>

        {/* Informational Content Body */}
        <article className="space-y-10 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section 1: Overview */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              छठ महापर्व 2026 में अर्घ्य कब है?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span>संध्या अर्घ्य — 15 नवंबर 2026</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल षष्ठी (रविवार) को संध्या समय अस्ताचलगामी सूर्य देव को पहला अर्घ्य अर्पित किया जाएगा।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span>उषा अर्घ्य — 16 नवंबर 2026</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल सप्तमी (सोमवार) को प्रातः सूर्योदय के समय उदित होते सूर्य नारायण को अंतिम अर्घ्य दिया जाएगा।
                </p>
              </div>

            </div>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              ध्यान दें कि सूर्यास्त और सूर्योदय का सटीक मिनट आपके शहर और भौगोलिक स्थान (Latitude/Longitude) पर निर्भर करता है। ऊपर दिए गए स्थान-आधारित कैलकुलेटर से अपने शहर का सटीक समय देखें।
            </p>
          </section>

          {/* Section 2: Sandhya Arghya Meaning */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              संध्या अर्घ्य क्या है?
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              संध्या अर्घ्य (पहला अर्घ्य) छठ महापर्व का तृतीय दिवस है। इस दिन व्रती दोपहर से ही पवित्रता पूर्वक ठेकुआ और कसार का महाप्रसाद बनाते हैं। सायंकाल संपूर्ण परिवार के साथ सूप और दउरा लेकर घाट पर एकत्र होते हैं और अस्ताचलगामी (ढलते हुए) सूर्य को नमन कर अर्घ्य अर्पित करते हैं।
            </p>
          </section>

          {/* Section 3: Usha Arghya Meaning */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              उषा अर्घ्य क्या है?
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              उषा अर्घ्य (दुसरा अर्घ्य) छठ महापर्व का चौथा और अंतिम दिवस है। ब्रह्ममुहूर्त में भोर के समय श्रद्धालु पुनः घाट पर पहुँचते हैं और नदी के शीतल जल में खड़े होकर प्रातःकालीन बाल-सूर्य के उदय की प्रतीक्षा करते हैं। पूर्व दिशा में लालिमा दिखते ही गाय के कच्चे दूध और गंगाजल से अर्घ्य समर्पित कर 36 घंटे के तप का पारण किया जाता है।
            </p>
          </section>

          {/* Section 4: Preparation */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              अर्घ्य देने की सामान्य तैयारी
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>बांस के सूप में ठेकुआ, भुसवा, ईख, डाभा नींबू, केला व मौसमी फल सजाएं।</li>
              <li>सूप के आगे मिट्टी का चौमुखी दिया जलाकर रखें।</li>
              <li>तांबे या पीतल के लोटे में गंगाजल और गाय का कच्चा दूध तैयार रखें।</li>
              <li>अर्घ्य देते समय सूर्य मंत्र का उच्चारण करें अथवा मन में सूर्य देव का ध्यान करें।</li>
            </ul>
          </section>

          {/* Section 5: Ghat Tips */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              घाट पर जाने से पहले जरूरी बातें
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              घाट पर भीड़भाड़ को देखते हुए समय से पहले प्रस्थान करें। बच्चों की सुरक्षा का विशेष ध्यान रखें और उनकी जेब में नाम-पता की पर्ची रखें। प्रशासन द्वारा बनाई गई जल सुरक्षा रेखा पार न करें।
            </p>
          </section>

          {/* FAQ Section */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>अक्सर पूछे जाने वाले प्रश्न (FAQ)</span>
            </h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: संध्या अर्घ्य कब है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: संध्या अर्घ्य कार्तिक शुक्ल षष्ठी, 15 नवंबर 2026 (रविवार) को सूर्यास्त के समय दिया जाएगा।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: उषा अर्घ्य कब है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: उषा अर्घ्य कार्तिक शुक्ल सप्तमी, 16 नवंबर 2026 (सोमवार) को सूर्योदय के समय दिया जाएगा।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: क्या अर्घ्य का समय शहर के अनुसार बदलता है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: हाँ, सूर्यास्त व सूर्योदय का समय प्रत्येक शहर के अक्षांश एवं देशांतर के अनुसार भिन्न होता है। ऊपर दिए कैलकुलेटर से अपने शहर का सटीक समय देखें।</p>
              </div>
            </div>
          </section>

          {/* Crawlable Internal Links */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा की अन्य उपयोगी जानकारी
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-puja-vidhi/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-vidhi/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा विधि 2026 पढ़ें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/chhath-samagri/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा सामग्री सूची देखें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/thekua-recipe/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/thekua-recipe/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>ठेकुआ महाप्रसाद रेसिपी</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
