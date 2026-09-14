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
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-arghya-time-2026/';
  const title = 'Chhath Arghya Time 2026 | शहरवार संध्या और उषा अर्घ्य समय';
  const description = 'छठ पूजा 2026 में 15 नवंबर संध्या अर्घ्य और 16 नवंबर उषा अर्घ्य का शहरवार समय देखें। पटना, वाराणसी, रांची, दिल्ली, मुंबई सहित प्रमुख शहरों के सूर्यास्त और सूर्योदय समय।';

  const breadcrumbs = [
    { label: 'छठ अर्घ्य समय 2026', url: '/CHHATH/chhath-arghya-time-2026/' }
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
          'name': 'पटना में छठ अर्घ्य का समय क्या है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'पटना में 15 नवंबर 2026 को संध्या अर्घ्य (सूर्यास्त) का समय शाम 05:02 बजे है और 16 नवंबर 2026 को उषा अर्घ्य (सूर्योदय) का समय प्रातः 06:08 बजे है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'वाराणसी में संध्या अर्घ्य कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'वाराणसी में संध्या अर्घ्य 15 नवंबर 2026 को सूर्यास्त समय शाम 05:11 बजे अर्पित किया जाएगा और उषा अर्घ्य 16 नवंबर को सुबह 06:17 बजे रहेगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या अलग-अलग शहरों में अर्घ्य का समय अलग होता है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'हाँ, सूर्यास्त एवं सूर्योदय का समय प्रत्येक शहर के अक्षांश (Latitude) एवं देशांतर (Longitude) के अनुसार भिन्न होता है। इसलिए अपने शहर का स्थानीय खगोलीय समय देखना आवश्यक है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'उषा अर्घ्य किस दिन दिया जाता है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'उषा अर्घ्य छठ महापर्व के चौथे व अंतिम दिन कार्तिक शुक्ल सप्तमी (16 नवंबर 2026) को प्रातःकाल सूर्योदय के समय उदित होते सूर्यदेव को अर्पित किया जाता है, जिसके बाद व्रत का पारण होता है।'
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
          
          {/* Section 1: Explication H2: शहर के अनुसार अर्घ्य समय क्यों बदलता है? */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              शहर के अनुसार अर्घ्य समय क्यों बदलता है?
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              सूर्य उपासना के महापर्व छठ में संध्या अर्घ्य सूर्यास्त (अस्ताचलगामी सूर्य) तथा उषा अर्घ्य सूर्योदय (उदीयमान सूर्य) के समय समर्पित किया जाता है। चूंकि भारत के विभिन्न शहरों की भौगोलिक स्थिति (Latitude एवं Longitude) अलग-अलग होती है, इसलिए सूर्योदय और सूर्यास्त का समय प्रत्येक शहर में भिन्न होता है। पूर्व के शहरों (जैसे कोलकाता, भागलपुर) में सूर्योदय व सूर्यास्त पश्चिम के शहरों (जैसे अहमदाबाद, मुंबई) की तुलना में पहले होता है।
            </p>
          </section>

          {/* Section 2: H2: छठ 2026 में संध्या और उषा अर्घ्य */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              छठ 2026 में संध्या और उषा अर्घ्य
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span>15 नवंबर 2026 — संध्या अर्घ्य</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल षष्ठी (रविवार) को सायंकाल अस्ताचलगामी सूर्य देव को प्रथम अर्घ्य समर्पित किया जाता है। व्रती पवित्र जलाशयों में खड़े होकर दूध व जल से अर्घ्य देते हैं।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span>16 नवंबर 2026 — उषा अर्घ्य</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल सप्तमी (सोमवार) को प्रातःकाल सूर्योदय के समय उदित होते सूर्य नारायण को अंतिम अर्घ्य अर्पित कर 36 घंटे के निर्जला महाव्रत का पारण किया जाता है।
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Sandhya Arghya Meaning */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              संध्या अर्घ्य की सांस्कृतिक व धार्मिक मान्यता
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              संध्या अर्घ्य की मुख्य विशेषता यह है कि यह ढलते हुए सूर्य की आराधना का संदेश देता है। भारतीय संस्कृति में कृतज्ञता का यह सर्वोच्च प्रतीक है, जहाँ जो अस्त हो रहा है उसे भी सर्वप्रथम नमन किया जाता है। व्रती दोपहर से ठेकुआ व कसार महाप्रसाद बनाकर सूप व दउरा में सजाकर घाट पर पहुँचते हैं।
            </p>
          </section>

          {/* Section 4: Usha Arghya Meaning */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              उषा अर्घ्य व पारण का महत्व
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              उषा अर्घ्य नए दिन के आगमन और जीवन में आशा व ऊर्जा के संचरण का प्रतीक है। प्रातःकाल शीतल नदी जल में खड़े होकर सूर्य किरण की प्रथम लालिमा दिखते ही अर्घ्य दिया जाता है। तत्पश्चात घाट पर व्रती अदरक व जल ग्रहण कर पारण करते हैं और महाप्रसाद का वितरण होता है।
            </p>
          </section>

          {/* Section 5: Preparation & Rules */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              अर्घ्य देने हेतु आवश्यक नियम व तैयारी
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>बांस के सूप में ठेकुआ, कसार, ईख, डाभा नींबू, केला व मौसमी फल सजाएं।</li>
              <li>सूप के अग्रभाग में शुद्ध घी का दीपक जलाकर रखें।</li>
              <li>तांबे या पीतल के पात्र में गंगाजल व गाय का कच्चा दूध तैयार रखें।</li>
              <li>अर्घ्य देते समय "ॐ सूर्याय नमः" अथवा "ॐ घृणिः सूर्याय नमः" मंत्र का उच्चारण करें।</li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>अक्सर पूछे जाने वाले प्रश्न (FAQ)</span>
            </h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: पटना में छठ अर्घ्य का समय क्या है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: पटना में 15 नवंबर 2026 को संध्या अर्घ्य (सूर्यास्त) शाम 05:02 बजे और 16 नवंबर 2026 को उषा अर्घ्य (सूर्योदय) सुबह 06:08 बजे है।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: वाराणसी में संध्या अर्घ्य कब है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: वाराणसी में 15 नवंबर 2026 को संध्या अर्घ्य का सूर्यास्त समय शाम 05:11 बजे है तथा 16 नवंबर को उषा अर्घ्य प्रातः 06:17 बजे है।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: क्या अलग-अलग शहरों में अर्घ्य का समय अलग होता है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: हाँ, सूर्यास्त व सूर्योदय का समय प्रत्येक शहर के अक्षांश एवं देशांतर के अनुसार भिन्न होता है। ऊपर दिए कैलकुलेटर से अपने शहर का सटीक समय देखें।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: उषा अर्घ्य किस दिन दिया जाता है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: उषा अर्घ्य छठ महापर्व के चौथे व अंतिम दिन कार्तिक शुक्ल सप्तमी (16 नवंबर 2026) को प्रातःकाल सूर्योदय के समय दिया जाता है, जिसके बाद व्रत का पारण होता है।</p>
              </div>
            </div>
          </section>

          {/* Complete Crawlable Internal Links (Requirement 9) */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ महापर्व के अन्य मुख्य पृष्ठ देखें
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-puja-vidhi/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-vidhi/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा विधि 2026</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/chhath-samagri/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा सामग्री सूची</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/chhath-arghya-time-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ अर्घ्य समय 2026</span>
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
              <a
                href="/CHHATH/chhath-puja-geet/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-geet/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा लोकगीत 🎵</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/chhath-puja-katha/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-katha/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा पौराणिक कथा 📜</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};

