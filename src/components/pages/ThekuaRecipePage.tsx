import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Utensils, CheckCircle2, ArrowRight, HelpCircle, Flame, Sparkles } from 'lucide-react';
import { chhathPrasadItems } from '../../data/prasad';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ThekuaRecipePage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/thekua-recipe/';
  const title = 'Thekua Recipe for Chhath Puja | ठेकुआ प्रसाद बनाने की विधि';
  const description = 'छठ पूजा का पावन महाप्रसाद ठेकुआ बनाने की प्रामाणिक विधि: सामग्री की मात्रा, आटा गूंधने के नियम, सांचे पर गढ़ने व देशी घी में तलने की चरणबद्ध गाइड।';

  const breadcrumbs = [
    { label: 'ठेकुआ रेसिपी', url: '/CHHATH/thekua-recipe/' }
  ];

  const recipeData = chhathPrasadItems.find(p => p.id === 'thekua') || chhathPrasadItems[0];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      'name': 'छठ पूजा का ठेकुआ प्रसाद (Thekua Recipe)',
      'image': 'https://rajkishorock-arch.github.io/CHHATH/images/thekua_prasad.jpg',
      'description': description,
      'recipeCategory': 'Dessert',
      'recipeCuisine': 'Bihari / Traditional Indian',
      'keywords': 'Thekua, Thekua Recipe, Chhath Puja Prasad, Khajuria',
      'recipeIngredient': recipeData.ingredients,
      'recipeInstructions': [
        { '@type': 'HowToStep', 'name': '1. आटा तैयार करना', 'text': 'गेहूं के आटे में कुटी इलायची, सौंफ और सूखा नारियल अच्छी तरह मिलाएं।' },
        { '@type': 'HowToStep', 'name': '2. मिश्रण और आटा गूंधना', 'text': 'आटे में गाय का देशी घी (मोयन) डालकर मलें। पिघले गुड़ के पानी से सख्त आटा गूंथें।' },
        { '@type': 'HowToStep', 'name': '3. ठेकुआ का आकार देना', 'text': 'छोटी लोइयां बनाकर लकड़ी के पारंपरिक सांचे पर दबाकर सूर्य या पत्ते का आकार दें।' },
        { '@type': 'HowToStep', 'name': '4. तलने/पकाने की प्रक्रिया', 'text': 'कड़ाही में देशी घी गरम कर धीमी आंच पर सुनहरा-भूरा व कुरकुरा होने तक तलें।' },
        { '@type': 'HowToStep', 'name': '5. ठंडा करके सुरक्षित रखना', 'text': 'तलने के बाद ठंडा होने दें और बांस के सूप या दउरा में महाप्रसाद रूप में रखें।' }
      ]
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
          'name': 'ठेकुआ रेसिपी',
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
          'name': 'ठेकुआ कैसे बनाएं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ठेकुआ बनाने के लिए मोटे गेहूं के आटे में देशी घी का मोयन, सौंफ, इलायची और पिघला गुड़ मिलाकर कड़ा आटा गूंधा जाता है, फिर सांचे पर आकार देकर देशी घी में धीमी आंच पर तला जाता है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'ठेकुआ के लिए कौन-कौन सी सामग्री चाहिए?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'गेहूं का आटा, देशी गुड़ (अथवा चीनी), गाय का देशी घी, सौंफ, इलायची पाउडर और कद्दूकस नारियल चाहिए।'
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
            <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>छठ महापर्व का सर्वोच्च महाप्रसाद</span>
          </div>
          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            छठ पूजा के लिए ठेकुआ बनाने की विधि
          </h1>
          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            पारंपरिक सांचे पर गढ़ा हुआ, देशी घी और गुड़ का खस्ता ठेकुआ प्रसाद बनाने की सम्पूर्ण प्रामाणिक विधि।
          </p>
        </header>

        {/* Hero Image Section */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-amber-500/30 relative bg-stone-900 min-h-[220px] sm:min-h-[360px]">
          <img
            src={getImageUrl('/images/thekua_prasad.jpg')}
            alt="छठ पूजा का पारंपरिक ठेकुआ प्रसाद"
            className="w-full h-56 sm:h-96 object-cover block"
            onError={(e) => handleImageError(e, '/images/thekua_prasad.jpg')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex items-end p-4 sm:p-6">
            <div className="text-white font-mukta">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">पवित्र महाप्रसाद</span>
              <span className="text-xl sm:text-2xl font-rozha font-bold">पारंपरिक खस्ता ठेकुआ (खजूरिया)</span>
            </div>
          </div>
        </div>

        {/* Recipe Content Body */}
        <article className="space-y-10 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section 1: What is Thekua */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              ठेकुआ क्या है?
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              ठेकुआ (जिसे खजूरिया भी कहा जाता है) छठ महापर्व का सबसे मुख्य और पवित्र महाप्रसाद है। इसे भगवान सूर्य और छठी मैया को अर्पित करने के लिए विशेष रूप से संध्या अर्घ्य के दिन पवित्रता और मौन के साथ बनाया जाता है। ठेकुआ केवल एक मिष्ठान नहीं, बल्कि भक्ति, स्वच्छता और सात्विक साधना का प्रतीक है।
            </p>
          </section>

          {/* Section 2: Ingredients */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              ठेकुआ बनाने की सामग्री
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {recipeData.ingredients.map((ing, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Step-by-Step Instructions */}
          <section className="space-y-6">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              ठेकुआ बनाने की पूरी विधि
            </h2>

            <div className="space-y-4 text-sm sm:text-base">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                  1. आटा तैयार करना
                </h3>
                <p className="leading-relaxed">
                  सबसे पहले मोटे गेहूं के आटे को अच्छे से छान लें। इसमें दरदरी कुटी सौंफ, हरी इलायची का पाउडर और कद्दूकस किया हुआ सूखा नारियल मिला लें।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                  2. मिश्रण और आटा गूंधना
                </h3>
                <p className="leading-relaxed">
                  गुड़ को आधा कप पानी में भिगोकर पिघला लें। आटे में शुद्ध गाय का देशी घी (मोयन) डालकर दोनों हाथों से अच्छी तरह मलें। अब गुड़ का पानी थोड़ा-थोड़ा डालकर सख्त (कड़ा) आटा गूंथ लें।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                  3. ठेकुआ का आकार देना
                </h3>
                <p className="leading-relaxed">
                  गूंथे हुए आटे की छोटी-छोटी लोइयां बनाएं। लकड़ी के पारंपरिक ठेकुआ सांचे पर थोड़ा सा घी लगाकर लोई को दबाएं ताकि उस पर सूर्य या पत्ते का सुंदर आकार उभर आए।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                  4. तलने/पकाने की प्रक्रिया
                </h3>
                <p className="leading-relaxed">
                  कड़ाही में शुद्ध देशी घी गरम करें। आंच को मध्यम से धीमी रखें। गढ़े हुए ठेकुआ को कड़ाही में डालकर धीमी आंच पर दोनों तरफ से सुनहला-भूरा और खस्ता होने तक तलें।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 shadow-sm space-y-2">
                <h3 className="font-rozha text-xl font-bold text-amber-700 dark:text-amber-300">
                  5. ठंडा करके सुरक्षित रखना
                </h3>
                <p className="leading-relaxed">
                  तलने के बाद ठेकुआ को प्लेट पर निकालकर ठंडा होने दें। ठंडा होने पर यह और भी खस्ता हो जाता है। अब इसे बांस के सूप अथवा दउरा में महाप्रसाद के रूप में रखें।
                </p>
              </div>

            </div>
          </section>

          {/* Section 4: Tips */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>ठेकुआ अच्छा बनाने के उपयोगी टिप्स</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>आटा हमेशा कड़ा (सख्त) गूंथें; नरम आटा होने पर ठेकुआ खस्ता नहीं बनेगा।</li>
              <li>तलते समय आंच हमेशा धीमी रखें ताकि ठेकुआ अंदर तक अच्छी तरह पक जाए।</li>
              <li>गुड़ का पानी छानकर प्रयोग करें ताकि कोई अशुद्धि न रहे।</li>
            </ul>
          </section>

          {/* Section 5: Festival Preparation */}
          <section className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा में ठेकुआ की तैयारी
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              संध्या अर्घ्य के दिन दोपहर में घर के अलग और पवित्र स्थान पर मिट्टी के चूल्हे या शुद्ध पीतल के चूल्हे पर ही ठेकुआ बनाया जाता है। इसे बनाते समय परिवार के सभी सदस्य भक्ति भाव से केवल छठी मैया के भजन गाते हैं।
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
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: ठेकुआ कैसे बनाएं?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: मोटे गेहूं के आटे में घी का मोयन, सौंफ, इलायची और पिघला गुड़ मिलाकर सख्त आटा गूंधें, सांचे पर गढ़ें और धीमी आंच पर देशी घी में तलें।</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: ठेकुआ के लिए कौन-कौन सी सामग्री चाहिए?</h3>
                <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: गेहूं का आटा, देशी गुड़ या चीनी, शुद्ध देशी घी, सौंफ, इलायची और सूखा नारियल चाहिए।</p>
              </div>
            </div>
          </section>

          {/* Crawlable Internal Links */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              संबंधित छठ गाइड
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/CHHATH/chhath-samagri/"
                onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-samagri/'); }}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span>छठ पूजा सामग्री सूची देखें</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
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
                <span>संध्या व उषा अर्घ्य समय</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
