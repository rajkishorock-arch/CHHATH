import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Calendar, Sun, CheckCircle2, ShieldAlert, ArrowRight, HelpCircle, BookOpen, Layers } from 'lucide-react';
import { chhathDaysByLang } from '../../data/days';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathVidhiPage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-puja-vidhi/';
  const title = 'Chhath Puja Vidhi 2026 | छठ पूजा विधि, नियम और संपूर्ण जानकारी';
  const description = 'Chhath Puja 2026 और छठ महापर्व की संपूर्ण पूजा विधि: नहाय-खाय, खरना, संध्या अर्घ्य और उषा अर्घ्य के चार दिन, जरूरी नियम व सावधानी की पूरी जानकारी।';

  const breadcrumbs = [
    { label: 'छठ पूजा विधि 2026', url: '/CHHATH/chhath-puja-vidhi/' }
  ];

  const daysData = chhathDaysByLang.hi;

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
          'name': 'छठ पूजा विधि 2026',
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
          'name': 'छठ पूजा 2026 कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा 2026 का महापर्व 13 नवंबर 2026 (शुक्रवार) को नहाय-खाय के साथ शुरू होकर 16 नवंबर 2026 (सोमवार) उषा अर्घ्य एवं पारण के साथ संपन्न होगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'छठ पूजा के चार दिन कौन-कौन से हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा के चार दिन हैं: 1. नहाय-खाय (13 नवंबर 2026), 2. खरना (14 नवंबर 2026), 3. संध्या अर्घ्य (15 नवंबर 2026), 4. उषा अर्घ्य व पारण (16 नवंबर 2026)।'
          }
        },
        {
          '@type': 'Question',
          'name': 'संध्या अर्घ्य कब दिया जाता है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'संध्या अर्घ्य कार्तिक शुक्ल षष्ठी (15 नवंबर 2026) की शाम को सूर्यास्त के समय पवित्र नदी या घाट पर खड़े होकर अस्ताचलगामी सूर्य को दिया जाता है।'
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
            <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>कार्तिक शुक्ल चतुर्थी से सप्तमी • महापर्व 2026</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            छठ पूजा विधि 2026
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            चार दिवसीय सूर्य षष्ठी महापर्व की संपूर्ण प्रामाणिक पूजा विधि, नियम, संध्या व उषा अर्घ्य विधान तथा सात्विक परंपराएं।
          </p>
        </header>

        {/* Main Content Body */}
        <article className="space-y-10 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section 1: Overview */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा 2026 की संपूर्ण जानकारी
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              छठ महापर्व भगवान सूर्य नारायण और षष्ठी मैया (छठी मैया) की उपासना का अत्यंत पवित्र लोक पर्व है। यह चार दिनों का कठिन व्रत है जिसमें कठोर कायिक शुद्धि, इंद्रिय निग्रह और 36 घंटे के अखंड निर्जला उपवास का पालन किया जाता है। छठ पूजा में प्राकृतिक संसाधनों, नदी घाटों, बांस के सूप-दउरा और देशी कद्दू-भात का विशेष महत्व है।
            </p>
          </section>

          {/* Section 2: Four Days of Chhath */}
          <section className="space-y-6">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              छठ महापर्व के चार दिन
            </h2>

            <div className="space-y-6">
              
              {/* Day 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
                  <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                    1. नहाय-खाय — 13 नवंबर 2026
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300">
                    कार्तिक शुक्ल चतुर्थी (शुक्रवार)
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  {daysData[0]?.meaning}
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold">
                  <strong>विशेष आहार:</strong> {daysData[0]?.food}
                </div>
              </div>

              {/* Day 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
                  <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                    2. खरना / लोहंडा — 14 नवंबर 2026
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300">
                    कार्तिक शुक्ल पंचमी (शनिवार)
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  {daysData[1]?.meaning}
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold">
                  <strong>विशेष प्रसाद:</strong> {daysData[1]?.food}
                </div>
              </div>

              {/* Day 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
                  <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                    3. संध्या अर्घ्य — 15 नवंबर 2026
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300">
                    कार्तिक शुक्ल षष्ठी (रविवार)
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  {daysData[2]?.meaning}
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold">
                  <strong>मुख्य अनुष्ठान:</strong> अस्ताचलगामी सूर्य देव को नदी/घाट पर जल में खड़े होकर अर्घ्य समर्पित करना।
                </div>
              </div>

              {/* Day 4 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
                  <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                    4. उषा अर्घ्य एवं पारण — 16 नवंबर 2026
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300">
                    कार्तिक शुक्ल सप्तमी (सोमवार)
                  </span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  {daysData[3]?.meaning}
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold">
                  <strong>व्रत पारण:</strong> उदित होते सूर्य को अर्घ्य देने के बाद अदरक, कच्चे दूध व जल से 36 घंटे के तप का पारण किया जाता है।
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: Preparation */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा की तैयारी
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              छठ पूजा की तैयारी पर्व से कई दिन पूर्व घर की लिपाई-पुताई और पवित्रता से शुरू होती है। गेहूं को धोकर छत पर सुखाया जाता है, जिसकी रखवाली पक्षियों से भी की जाती है। नया मिट्टी का चूल्हा, आम की सूखी लकड़ियां, नए वस्त्र और बांस के सूप-दउरा पहले ही साफ करके सुरक्षित रखे जाते हैं। पूजा की संपूर्ण तैयारी हेतु <a href="/CHHATH/chhath-samagri/" onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">छठ पूजा सामग्री सूची 2026</a> देखें।
            </p>
          </section>

          {/* Section 4: Sandhya Arghya Vidhi */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              संध्या अर्घ्य की पूजा विधि
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>दोपहर के समय पूर्ण पवित्रता से महाप्रसाद तैयार करें। (विस्तार से जानने हेतु <a href="/CHHATH/thekua-recipe/" onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/thekua-recipe/'); }} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">ठेकुआ प्रसाद रेसिपी</a> देखें)।</li>
              <li>बांस के सूप में ठेकुआ, भुसवा, ईख, डाभा नींबू, केला, सुथनी और नया कंद सजाएं।</li>
              <li>सूप में दीपक जलाकर पीला वस्त्र या अल्पना ढंकें।</li>
              <li>परिवार के साथ पारंपरिक छठ गीत गाते हुए नंगे पांव घाट की ओर प्रस्थान करें। (अपने स्थान का सही समय जानने हेतु <a href="/CHHATH/chhath-arghya-time-2026/" onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">छठ अर्घ्य समय 2026</a> देखें)।</li>
              <li>सूर्यास्त के समय कमर तक शीतल जल में खड़े होकर अस्ताचलगामी सूर्य देव को दूध व जल से अर्घ्य दें।</li>
            </ul>
          </section>

          {/* Section 5: Usha Arghya Vidhi */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              उषा अर्घ्य की पूजा विधि
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>सप्तमी की भोर में (ब्रह्ममुहूर्त) पुनः घाट पर सूप और पूजन सामग्री लेकर पहुंचे।</li>
              <li>सूर्य निकलने से पूर्व शीतल जल में खड़े होकर पूर्व दिशा की ओर मुख करें।</li>
              <li>लालिमा बिखरते ही गाय के कच्चे दूध और गंगाजल की धारा से उदित सूर्य भुवन भास्कर को अंतिम अर्घ्य अर्पित करें।</li>
              <li>अर्घ्य के पश्चात षष्ठी मैया और सूर्य देव की आरती कर सभी परिजनों को ठेकुआ महाप्रसाद बांटें।</li>
            </ul>
          </section>

          {/* Section 6: Rules & Precautions */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
                छठ पूजा के महत्वपूर्ण नियम और सावधानियां
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-stone-800 dark:text-stone-200">
              <li>पूजा की किसी भी सामग्री को बिना हाथ धोए अथवा अशुद्ध अवस्था में न छूएं।</li>
              <li>भोजन केवल नए मिट्टी या कांसे/पीतल के बर्तनों में सेंधा नमक से ही बनाएं।</li>
              <li>खरना के दिन जब व्रती प्रसाद ग्रहण कर रहे हों, तब घर में पूर्ण शांति रखें।</li>
              <li>घाट पर सुरक्षा निर्देशों का पालन करें और गहरे पानी की लाल सीमा पार न करें।</li>
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
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: छठ पूजा 2026 कब है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: छठ पूजा 2026 का महापर्व 13 नवंबर 2026 (शुक्रवार) को नहाय-खाय के साथ शुरू होकर 16 नवंबर 2026 (सोमवार) उषा अर्घ्य एवं पारण के साथ संपन्न होगा।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: छठ पूजा के चार दिन कौन-कौन से हैं?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: छठ पूजा के चार दिन हैं: 1. नहाय-खाय (13 नवंबर), 2. खरना (14 नवंबर), 3. संध्या अर्घ्य (15 नवंबर), 4. उषा अर्घ्य (16 नवंबर)।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: संध्या अर्घ्य कब दिया जाता है?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: संध्या अर्घ्य कार्तिक शुक्ल षष्ठी (15 नवंबर 2026) की शाम को सूर्यास्त के समय अस्ताचलगामी सूर्य को दिया जाता है।</p>
              </div>
            </div>
          </section>

          {/* Section 7: Crawlable Internal Links */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा से जुड़े महत्वपूर्ण गाइड
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-samagri/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा सामग्री की पूरी सूची देखें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/chhath-arghya-time-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>आज का अर्घ्य समय एवं कैलकुलेटर</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/thekua-recipe/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/thekua-recipe/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>ठेकुआ महाप्रसाद बनाने की विधि</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
