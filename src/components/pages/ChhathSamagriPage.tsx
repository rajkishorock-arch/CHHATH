import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { CheckSquare, ArrowRight, HelpCircle, ShoppingBag, CheckCircle, Info } from 'lucide-react';
import { SamagriChecklist } from '../vidhi/SamagriChecklist';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathSamagriPage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-samagri/';
  const title = 'Chhath Puja Samagri 2026 | छठ पूजा सामग्री Checklist';
  const description = 'Chhath Puja 2026 की पूरी सामग्री सूची देखें और इंटरैक्टिव checklist से अपनी तैयारी पूरी करें। पूजा सामग्री, प्रसाद, फल, सूप-डाला और घाट की जरूरी सामग्री।';

  const breadcrumbs = [
    { label: 'छठ पूजा सामग्री', url: '/CHHATH/chhath-samagri/' }
  ];

  const mainPoojaItems = [
    'बाँस का नया दउरा (बड़ी टोकरी)',
    'बाँस का सूप (2 से 4 पीस)',
    'पीतल का सूप (वैकल्पिक/पारंपरिक)',
    'तांबे या पीतल का कलश व लोटा',
    'चौमुखी बड़ा मिट्टी का दिया',
    '51 या 108 छोटे मिट्टी के दीपक',
    'कोसी हाथी व मिट्टी के ढकना'
  ];

  const arghyaItems = [
    'पत्ता सहित 4-5 साबुत ईख (गन्ना)',
    'केला का पूरा घवद (काँधी)',
    'डाभा नींबू / बड़ा चकोतरा',
    'कच्ची हल्दी और अदरक का पौधा',
    'सुथनी, शकरकंद (गेँठी) व कंदमूल',
    'नारियल (पानी वाला और सूखा)',
    'सिंघाड़ा (जलकुंभी फल) व शरीफा'
  ];

  const dauraSoupItems = [
    'सिंदूर (लाल व पीला बड़ा रोली)',
    'अक्षत (अटूट अरवा चावल)',
    'चंदन (सफेद व लाल)',
    'धूप, अगरबत्ती व कपूर',
    'गंगाजल व शुद्ध गाय का दूध',
    'रुई की बत्तियां व माचिस',
    'पीला व लाल पवित्र वस्त्र (अल्पना)'
  ];

  const prasadItems = [
    'गेहूं का मोटा आटा (ठेकुआ हेतु)',
    'शुद्ध देशी गाय का घी',
    'देशी गुड़ (अथवा चीनी)',
    'सौंफ व हरी इलायची',
    'सूखा नारियल (गड़ी)',
    'कसार हेतु अरवा चावल का आटा'
  ];

  const ghatItems = [
    'दउरा ढकने के लिए शुद्ध पीला कपड़ा',
    'माचिस व कपूर (हवा से बचाने हेतु)',
    'जल अर्घ्य पात्र (लोटा/कलश)',
    'साफ तौलिया व चेंजिंग वस्त्र',
    'बच्चों हेतु नाम-पता पर्ची'
  ];

  const thekuaIngredients = [
    'मोटा गेहूं आटा (1 किग्रा)',
    'देशी गुड़ (500 ग्राम)',
    'गाय का देशी घी (200 ग्राम मोयन)',
    'हरी इलायची पाउडर (1 चम्मच)',
    'सौंफ (2 बड़े चम्मच कुटी हुई)',
    'सूखा नारियल (1/2 कप कटे हुए)'
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
          'name': 'छठ पूजा सामग्री',
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
          'name': 'छठ पूजा में कौन-कौन सी सामग्री चाहिए?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा में मुख्य रूप से बांस का दउरा, सूप, ईख (गन्ना), डाभा नींबू, केला, नारियल, ठेकुआ, कसार, मिट्टी के दीपक, गंगाजल, गाय का दूध और सिंदूर आवश्यक होता है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'ठेकुआ के लिए क्या सामग्री चाहिए?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ठेकुआ बनाने के लिए गेहूं का मोटा आटा, देशी गुड़ या चीनी, शुद्ध देशी घी (मोयन व तलने हेतु), सौंफ, इलायची और सूखा नारियल चाहिए।'
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
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs border border-amber-500/30">
            <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>छठ महापर्व 2026 • प्रामाणिक इंटरैक्टिव चेकलिस्ट</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            छठ पूजा सामग्री Checklist 2026
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            दउरा, सूप, अर्घ्य फल, ठेकुआ सामग्री व घाट की संपूर्ण पूजा सामग्री की सुव्यवस्थित एवं प्रामाणिक चेकलिस्ट।
          </p>
        </header>

        {/* Interactive Checklist Component */}
        <section className="space-y-4">
          <SamagriChecklist />
        </section>

        {/* Categorized Samagri Text Section (Crawlable for Googlebot) */}
        <article className="space-y-10 font-mukta text-stone-800 dark:text-stone-200">
          
          <section className="space-y-6">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              छठ पूजा सामग्री की संपूर्ण वर्गीकृत सूची
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Group 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span>पूजा की मुख्य सामग्री</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {mainPoojaItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span>अर्घ्य के लिए आवश्यक सामग्री</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {arghyaItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span>दउरा और सूप की सामग्री</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {dauraSoupItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 4 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span>प्रसाद की सामग्री</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {prasadItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 5 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span>घाट पर ले जाने वाली सामग्री</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {ghatItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 6 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-3">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                  <span>ठेकुआ बनाने की सामग्री</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {thekuaIngredients.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* Section 2: Prep Checklist */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा सामग्री तैयार करने की checklist
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              छठ पूजा से 2 दिन पहले सभी बर्तन, बांस के सूप-दउरा और सूती कपड़े धोकर सुखा लें। गेहूं को अच्छे से साफ कर धूप में सुखाएं और आटा पिसवाएं। सभी सूखे फल और मसाले पहले ही लाकर शुद्ध स्थान पर रख लें।
            </p>
          </section>

          {/* Section 3: Final Ghat Prep */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              अंतिम समय की तैयारी
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              घाट प्रस्थान से पूर्व दउरा में नीचे ईख और केले का घवद रखें, फिर सूप में ठेकुआ, नारियल और फल सजाएं। दउरा को साफ पीले वस्त्र से ढंकें। माचिस, धूप, कपूर और अर्घ्य पात्र अलग बैग में रखें।
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
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: छठ पूजा में कौन-कौन सी सामग्री चाहिए?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: मुख्य सामग्री में बांस का दउरा, सूप, ईख (गन्ना), डाभा नींबू, केला, नारियल, ठेकुआ, कसार, मिट्टी के दीपक, गंगाजल, गाय का दूध और सिंदूर चाहिए।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: ठेकुआ के लिए क्या सामग्री चाहिए?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: गेहूं का मोटा आटा, देशी गुड़ या चीनी, शुद्ध देशी घी (मोयन व तलने हेतु), सौंफ, इलायची और सूखा नारियल चाहिए।</p>
              </div>
            </div>
          </section>

          {/* Crawlable Internal Links */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              संबंधित छठ गाइड
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-puja-vidhi/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-puja-vidhi/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा विधि 2026 पढ़ें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/chhath-arghya-time-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>संध्या व उषा अर्घ्य समय जानें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
              <a
                href="/CHHATH/thekua-recipe/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/thekua-recipe/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>ठेकुआ बनाने की सरल विधि</span>
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
              <a
                href="/CHHATH/chhath-calendar-2026/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-calendar-2026/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा कैलेंडर 2026 देखें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};

