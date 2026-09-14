import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Calendar, Clock, Sun, Sunset, Sunrise, CheckCircle2, ArrowRight, HelpCircle, Sparkles, MapPin } from 'lucide-react';
import { getChhathDays } from '../../data/days';
import { calculateChhathStatus } from '../hero/LiveFestivalExperience';
import { useLanguage } from '../../context/LanguageContext';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathDatePage: React.FC<PageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-puja-date-2026/';
  const title = 'Chhath Puja 2026 Date & Time | छठ पूजा 2026 तिथि, मुहूर्त व समय';
  const description = 'Chhath Puja 2026 की सटीक तारीख व समय देखें: नहाय-खाय 13 नवंबर, खरना 14 नवंबर, संध्या अर्घ्य 15 नवंबर और उषा अर्घ्य 16 नवंबर। तिथियों का संपूर्ण विवरण व मुहूर्त।';

  const breadcrumbs = [
    { label: 'छठ पूजा 2026 तारीख व समय', url: '/CHHATH/chhath-puja-date-2026/' }
  ];

  const daysInfo = getChhathDays(language);
  const { stateData } = calculateChhathStatus(new Date(), language);

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
          'name': 'छठ पूजा 2026 तारीख व समय',
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
          'name': 'छठ पूजा 2026 में नहाय-खाय किस तारीख को है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा 2026 का पहला दिन नहाय-खाय 13 नवंबर 2026 (शुक्रवार) को कार्तिक शुक्ल चतुर्थी तिथि में मनाया जाएगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'खरना किस तिथि व तारीख को है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'खरना अनुष्ठान कार्तिक शुक्ल पंचमी, 14 नवंबर 2026 (शनिवार) को है। इस दिन शाम को गुड़ की खीर (रसियाव) का प्रसाद ग्रहण करने के बाद 36 घंटे का अखंड निर्जला व्रत शुरू होता है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'संध्या अर्घ्य किस तारीख को दिया जाएगा?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'संध्या अर्घ्य (पहला अर्घ्य) कार्तिक शुक्ल षष्ठी, 15 नवंबर 2026 (रविवार) को सूर्यास्त के समय अस्ताचलगामी सूर्य देव को अर्पित किया जाएगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'उषा अर्घ्य और पारण कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'उषा अर्घ्य व व्रत पारण कार्तिक शुक्ल सप्तमी, 16 नवंबर 2026 (सोमवार) को प्रातःकाल सूर्योदय के समय उदित सूर्य को अर्घ्य देकर संपन्न होगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या छठ पूजा 2026 की तारीखों में कोई संशय है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'जी नहीं, पंचांगीय गणनानुसार छठ पूजा 2026 की तिथियां पूर्णतः स्पष्ट हैं: 13 नवंबर (नहाय-खाय), 14 नवंबर (खरना), 15 नवंबर (संध्या अर्घ्य) और 16 नवंबर (उषा अर्घ्य व पारण)।'
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
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Hero Header */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs">
            <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>13 नवंबर से 16 नवंबर 2026 • कार्तिक शुक्ल चतुर्थी से सप्तमी</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            Chhath Puja 2026 Date & Time (छठ पूजा 2026 तारीख व समय)
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            छठ महापर्व 2026 की सभी प्रामाणिक तिथियां, नहाय-खाय, खरना, संध्या अर्घ्य, उषा अर्घ्य एवं पारण का समय व पंचांगीय मुहूर्त।
          </p>
        </header>

        {/* Main Content Article */}
        <article className="space-y-8 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section 1: Quick Summary Table */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4 shadow-sm">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>छठ पूजा 2026 की मुख्य तिथियां (Summary Table)</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold">
                    <th className="p-3">अनुष्ठान</th>
                    <th className="p-3">तारीख 2026</th>
                    <th className="p-3">वार</th>
                    <th className="p-3">विक्रमी तिथि</th>
                    <th className="p-3">मुख्य विधान</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/15">
                  <tr className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-3 font-bold text-amber-700 dark:text-amber-400">1. नहाय-खाय</td>
                    <td className="p-3 font-bold">13 नवंबर 2026</td>
                    <td className="p-3">शुक्रवार</td>
                    <td className="p-3">कार्तिक शुक्ल चतुर्थी</td>
                    <td className="p-3">स्नान, घर शुद्धि एवं सात्विक कद्दू-भात का प्रसाद</td>
                  </tr>
                  <tr className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-3 font-bold text-amber-700 dark:text-amber-400">2. खरना / लोहंडा</td>
                    <td className="p-3 font-bold">14 नवंबर 2026</td>
                    <td className="p-3">शनिवार</td>
                    <td className="p-3">कार्तिक शुक्ल पंचमी</td>
                    <td className="p-3">दिनभर निर्जला उपवास, सायंकाल गुड़ की खीर-रोटी का प्रसाद</td>
                  </tr>
                  <tr className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-3 font-bold text-amber-700 dark:text-amber-400">3. संध्या अर्घ्य</td>
                    <td className="p-3 font-bold">15 नवंबर 2026</td>
                    <td className="p-3">रविवार</td>
                    <td className="p-3">कार्तिक शुक्ल षष्ठी</td>
                    <td className="p-3">सूर्यास्त के समय अस्ताचलगामी सूर्य को पहला अर्घ्य</td>
                  </tr>
                  <tr className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-3 font-bold text-amber-700 dark:text-amber-400">4. उषा अर्घ्य व पारण</td>
                    <td className="p-3 font-bold">16 नवंबर 2026</td>
                    <td className="p-3">सोमवार</td>
                    <td className="p-3">कार्तिक शुक्ल सप्तमी</td>
                    <td className="p-3">सूर्योदय के समय उदित सूर्य को अर्घ्य एवं व्रत पारण</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Detailed Day-by-Day Dates */}
          <section className="space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              चारों दिनों की तिथियों का संपूर्ण विवरण
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">दिन 1 • 13 नवंबर 2026 (शुक्रवार)</span>
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">नहाय-खाय (Nahay Khay)</h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल चतुर्थी को नहाय-खाय से चार दिवसीय सूर्य षष्ठी महापर्व की शुरुआत होती है। इस दिन व्रती प्रातःकाल पवित्र नदी या गंगाजल मिश्रित जल से स्नान करके नए वस्त्र धारण करते हैं। भोजन में सेंधा नमक व देशी घी से बनी कद्दू (लौकी) की सब्जी, अरवा चावल और चने की दाल का प्रसाद सर्वप्रथम व्रती पाते हैं।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">दिन 2 • 14 नवंबर 2026 (शनिवार)</span>
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">खरना / लोहंडा (Kharna)</h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल पंचमी को खरना होता है। इस दिन व्रती पूरे दिन जल की एक बूंद पिए बिना निर्जला उपवास रखते हैं। सायंकाल नए मिट्टी के चूल्हे पर आम की सूखी लकड़ियों से गुड़ और गाय के दूध की खीर (रसियाव) तथा रोटी बनाई जाती है। एकांत कक्ष में मां षष्ठी को भोग लगाकर व्रती इसे ग्रहण करते हैं और 36 घंटे का कठिन निर्जला व्रत आरंभ होता है।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">दिन 3 • 15 नवंबर 2026 (रविवार)</span>
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">संध्या अर्घ्य (Sandhya Arghya)</h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल षष्ठी को अस्ताचलगामी सूर्य को अर्घ्य दिया जाता है। दोपहर में पवित्रता से ठेकुआ, भुसवा व कसार का महाप्रसाद तैयार किया जाता है। बांस के सूप में ठेकुआ, नारियल, गन्ना व फल सजाकर परिवार सहित नंगे पांव घाट पहुंचकर कमर तक जल में खड़े होकर डूबते सूर्य नारायण को दूध व जल की धारा अर्पित की जाती है।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">दिन 4 • 16 नवंबर 2026 (सोमवार)</span>
                <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-100">उषा अर्घ्य व पारण (Usha Arghya)</h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  कार्तिक शुक्ल सप्तमी को भोर में (ब्रह्ममुहूर्त) पुनः घाट पहुंचकर शीतल जल में खड़े होकर उदित होते सूर्यदेव की प्रतीक्षा की जाती है। पूर्व दिशा में सूर्य की पहली लालिमा दिखते ही दूध व जल से अंतिम अर्घ्य दिया जाता है। इसके पश्चात घाट पर ही अदरक, कच्चे दूध व अंकुरित चना खाकर 36 घंटे के अखंड निर्जला व्रत का पारण होता है।
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Visible FAQs */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>अक्सर पूछे जाने वाले प्रश्न (FAQ)</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: छठ पूजा 2026 में नहाय-खाय किस तारीख को है?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: छठ पूजा 2026 का पहला दिन नहाय-खाय 13 नवंबर 2026 (शुक्रवार) को कार्तिक शुक्ल चतुर्थी तिथि में मनाया जाएगा।</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: खरना किस तिथि व तारीख को है?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: खरना अनुष्ठान कार्तिक शुक्ल पंचमी, 14 नवंबर 2026 (शनिवार) को है। इस दिन शाम को गुड़ की खीर का प्रसाद ग्रहण करने के बाद 36 घंटे का व्रत शुरू होता है।</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: संध्या अर्घ्य किस तारीख को दिया जाएगा?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: संध्या अर्घ्य (पहला अर्घ्य) कार्तिक शुक्ल षष्ठी, 15 नवंबर 2026 (रविवार) को सूर्यास्त के समय अस्ताचलगामी सूर्य देव को अर्पित किया जाएगा।</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: उषा अर्घ्य और पारण कब है?</h3>
                <p className="text-stone-700 dark:text-stone-300">उत्तर: उषा अर्घ्य व व्रत पारण कार्तिक शुक्ल सप्तमी, 16 नवंबर 2026 (सोमवार) को प्रातःकाल सूर्योदय के समय उदित सूर्य को अर्घ्य देकर संपन्न होगा।</p>
              </div>
            </div>
          </section>

          {/* Section 4: Topical Cluster Navigation Grid */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ महापर्व 2026: संपूर्ण गाइड एवं पेज
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-calendar-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-calendar-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>छठ कैलेंडर 2026</span>
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
                href="/CHHATH/chhath-arghya-time-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>शहरवार अर्घ्य समय</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/patna-chhath-puja-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/patna-chhath-puja-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>पटना छठ पूजा गाइड</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>

              <a
                href="/CHHATH/thekua-recipe/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/thekua-recipe/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-decoration-none transition-all"
              >
                <span>ठेकुआ महाप्रसाद विधि</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
