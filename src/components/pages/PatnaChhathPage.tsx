import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { MapPin, Sun, Sunset, Sunrise, Calendar, CheckCircle2, ArrowRight, HelpCircle, ShieldCheck, Waves } from 'lucide-react';
import { cityArghyaData } from '../../data/astronomy';
import { useLanguage } from '../../context/LanguageContext';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const PatnaChhathPage: React.FC<PageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/patna-chhath-puja-2026/';
  const title = 'Patna Chhath Puja 2026 | पटना छठ पूजा 2026 - अर्घ्य समय व गंगा घाट गाइड';
  const description = 'Patna Chhath Puja 2026 की संपूर्ण गाइड: पटना के पवित्र गंगा घाट (कलेक्टरिएट, दीघा, बांस घाट), 15 व 16 नवंबर संध्या व उषा अर्घ्य सूर्यास्त-सूर्योदय समय और स्थानीय तैयारी।';

  const breadcrumbs = [
    { label: 'पटना छठ पूजा 2026', url: '/CHHATH/patna-chhath-puja-2026/' }
  ];

  const patnaData = cityArghyaData.find(c => c.cityName.includes('पटना')) || cityArghyaData[0];

  const patnaGhats = [
    { name: 'कलेक्टरिएट घाट (Collectorate Ghat)', desc: 'पटना का अत्यंत विशाल एवं प्रसिद्ध गंगा घाट, जहाँ हजारों श्रद्धालु संध्या व उषा अर्घ्य देते हैं।', features: 'चौड़ा पहुंच पथ, विद्युत प्रकाश व्यवस्था व सुरक्षा बल' },
    { name: 'दीघा घाट / पाटीपुल घाट (Digha Ghat)', desc: 'उत्तरी पटना का प्रमुख गंगा तट, विस्तृत क्षेत्र एवं सुगम आवागमन हेतु लोकप्रिय।', features: 'व्यापक पार्किंग, एम्बुलेंस सुविधा एवं चेंजिंग रूम' },
    { name: 'बांस घाट (Bans Ghat)', desc: 'मध्य पटना का ऐतिहासिक पवित्र तट जहाँ पारंपरिक आस्था के साथ अर्घ्य दिया जाता है।', features: 'गहरे पानी की बैरिकेडिंग व लगातार लाउडस्पीकर निर्देश' },
    { name: 'गांधी घाट / एनआईटी घाट (Gandhi Ghat)', desc: 'एनआईटी पटना के समीप स्थित रमणीय गंगा तट, शाम की महाआरती हेतु प्रसिद्ध।', features: 'पक्की सीढ़ियां, सुरक्षा मोटरबोट एवं सहायता शिविर' },
    { name: 'दानापुर एवं दीघा के निकटवर्ती घाट', desc: 'पश्चिमी पटना के श्रद्धालुओं हेतु पवित्र एवं सुव्यवस्थित गंगा तट।', features: 'स्थानीय पूजा समिति द्वारा प्रकाश व पेयजल व्यवस्था' }
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
          'name': 'पटना छठ पूजा 2026',
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
          'name': 'पटना में छठ पूजा 2026 की मुख्य तारीखें क्या हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'पटना में छठ पूजा 2026 का महापर्व 13 नवंबर (नहाय-खाय), 14 नवंबर (खरना), 15 नवंबर (संध्या अर्घ्य) और 16 नवंबर (उषा अर्घ्य व पारण) को मनाया जाएगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'पटना में संध्या अर्घ्य का सूर्यास्त समय क्या है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `पटना में 15 नवंबर 2026 को संध्या अर्घ्य (सूर्यास्त) का सटीक खगोलीय समय शाम ${patnaData.sandhyaSunset} बजे है।`
          }
        },
        {
          '@type': 'Question',
          'name': 'पटना में उषा अर्घ्य का सूर्योदय समय क्या है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `पटना में 16 नवंबर 2026 को उषा अर्घ्य (सूर्योदय) का समय प्रातः ${patnaData.ushaSunrise} बजे है।`
          }
        },
        {
          '@type': 'Question',
          'name': 'पटना के सबसे प्रमुख गंगा घाट कौन से हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'पटना के प्रमुख गंगा घाटों में कलेक्टरिएट घाट, दीघा घाट, बांस घाट, गांधी घाट, गाय घाट और दानापुर घाट शामिल हैं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या पटना में घर की छत या बालकनी में अर्घ्य दिया जा सकता है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'हाँ, यदि गंगा घाट दूर हो या भीड़ अधिक हो, तो पटना में घर की छत या आँगन में स्वच्छ जल से कुंड/टब बनाकर भी श्रद्धापूर्वक अर्घ्य दिया जा सकता है।'
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

        {/* Hero Header */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs">
            <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>पटना, बिहार (Patna, Bihar) • गंगा तट महापर्व 2026</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            Patna Chhath Puja 2026 (पटना छठ पूजा)
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            राजधानी पटना में छठ महापर्व की पावन परंपरा, गंगा घाट निर्देशिका, 15 व 16 नवंबर अर्घ्य का सटीक समय एवं श्रद्धालुओं हेतु आवश्यक दिशानिर्देश।
          </p>
        </header>

        {/* Article Body */}
        <article className="space-y-8 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section 1: Patna Arghya Timing Highlight Box */}
          <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/10 border border-amber-500/30 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
              <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <span>पटना में आज का अर्घ्य समय (Patna Arghya Timing 2026)</span>
              </h2>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300">
                गंगा नदी (Ganga River)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sunset className="w-4 h-4 text-orange-500" />
                  <span>15 नवंबर 2026 • संध्या अर्घ्य</span>
                </div>
                <span className="font-rozha text-3xl font-black text-stone-900 dark:text-amber-100 block">
                  {patnaData.sandhyaSunset}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 block font-semibold">
                  पटना सूर्यास्त समय (IST)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sunrise className="w-4 h-4 text-amber-400" />
                  <span>16 नवंबर 2026 • उषा अर्घ्य</span>
                </div>
                <span className="font-rozha text-3xl font-black text-stone-900 dark:text-amber-100 block">
                  {patnaData.ushaSunrise}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 block font-semibold">
                  पटना सूर्योदय समय (IST)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 text-center font-semibold pt-1">
              मौसम अनुमान: {patnaData.weatherTemp} ({patnaData.weatherCondition})
            </p>
          </section>

          {/* Section 2: Patna Major Ganga Ghats Guide */}
          <section className="space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              पटना के प्रमुख गंगा घाट एवं व्यवस्थाएं
            </h2>

            <div className="space-y-3">
              {patnaGhats.map((g, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-2 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-rozha text-lg font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Waves className="w-4 h-4 text-amber-600" />
                      <span>{g.name}</span>
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300">
                      पटना गंगा तट
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {g.desc}
                  </p>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>विशेषताएं: {g.features}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Visible FAQs */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>पटना छठ पूजा FAQ</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: पटना में छठ पूजा 2026 की मुख्य तारीखें क्या हैं?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: पटना में छठ पूजा 2026 का महापर्व 13 नवंबर (नहाय-خाय), 14 नवंबर (खरना), 15 नवंबर (संध्या अर्घ्य) और 16 नवंबर (उषा अर्घ्य व पारण) को मनाया जाएगा।</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: पटना में संध्या अर्घ्य का सूर्यास्त समय क्या है?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: पटना में 15 नवंबर 2026 को संध्या अर्घ्य (सूर्यास्त) का समय शाम {patnaData.sandhyaSunset} बजे है।</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: पटना में उषा अर्घ्य का सूर्योदय समय क्या है?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: पटना में 16 नवंबर 2026 को उषा अर्घ्य (सूर्योदय) का समय प्रातः {patnaData.ushaSunrise} बजे है।</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: पटना के सबसे प्रमुख गंगा घाट कौन से हैं?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: पटना के प्रमुख गंगा घाटों में कलेक्टरिएट घाट, दीघा घाट, बांस घाट, गांधी घाट, गाय घाट और दानापुर घाट शामिल हैं।</p>
              </div>
            </div>
          </section>

          {/* Section 4: Internal Links Cluster */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ महापर्व 2026: अन्य प्रमुख गाइड
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-arghya-time-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>अन्य शहरों का अर्घ्य समय</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/chhath-puja-date-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-date-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>छठ पूजा 2026 तारीख व समय</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/chhath-calendar-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-calendar-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>छठ पूजा कैलेंडर 2026</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/chhath-puja-vidhi/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-vidhi/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>छठ पूजा विधि एवं नियम</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/chhath-samagri/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>छठ सामग्री Checklist</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/thekua-recipe/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/thekua-recipe/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>ठेकुआ प्रसाद रेसिपी</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
