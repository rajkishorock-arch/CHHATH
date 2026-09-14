import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { chhathKathaStories } from '../../data/katha';
import { BookOpen, Sun, Calendar, CheckSquare, Utensils, Music, ArrowRight, HelpCircle, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathKathaPage: React.FC<PageProps> = ({ onNavigate }) => {
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-puja-katha/';
  const title = 'Chhath Puja Katha 2026 | छठी मैया की कथा और छठ व्रत की कहानी';
  const description = 'छठ पूजा 2026 से जुड़ी प्रचलित लोककथाएं, छठी मैया की कथा, छठ व्रत की कहानी और सूर्य उपासना की परंपरा सरल हिंदी में जानें।';

  const breadcrumbs = [
    { label: 'छठ पूजा कथा 2026', url: '/CHHATH/chhath-puja-katha/' }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Chhath Puja Katha 2026 | छठी मैया की कथा',
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
          'name': 'छठ पूजा कथा 2026',
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
          'name': 'छठ पूजा की कथा क्या है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा की कथा छठ महापर्व, छठी मैया की कृपा और सूर्य देव की उपासना से जुड़ी भक्तिमय लोककथाओं का संग्रह है, जिसे व्रती खरना और अर्घ्य के पावन अवसर पर सुनते व सुनाते हैं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'छठी मैया की कथा क्या है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'लोकपरंपरा के अनुसार छठी मैया (षष्ठी देवी) ब्रह्मा जी की मानस पुत्री और बच्चों की संरक्षिका हैं। राजा प्रियव्रत द्वारा संतान रक्षा हेतु छठी मैया की पूजा की कथा सर्वाधिक प्रचलित है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'छठ पूजा में कथा का क्या महत्व है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा में कथा सुनने से व्रतियों में अटूट श्रद्धा, नियम-संयम और भक्ति भाव सुदृढ़ होता है। यह पीढ़ियों से चली आ रही लोक-संस्कृति और संस्कारों का संचरण करती है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'क्या छठ पूजा की कथा के अलग-अलग रूप प्रचलित हैं?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'हाँ, छठ पूजा की लोकपरंपरा में कई कथाएं प्रचलित हैं। राजा प्रियव्रत की कथा के अलावा महाभारत में द्रौपदी व दानवीर कर्ण और रामायण में माता सीता द्वारा सूर्य पूजन की कथाएं भी क्षेत्रीय लोकपरंपराओं में श्रद्धापूर्वक सुनी जाती हैं।'
          }
        },
        {
          '@type': 'Question',
          'name': 'छठ पूजा 2026 कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'छठ पूजा 2026 का महापर्व 13 नवंबर 2026 (शुक्रवार) को नहाय-खाय से प्रारंभ होकर 16 नवंबर 2026 (सोमवार) उषा अर्घ्य व पारण के साथ संपन्न होगा।'
          }
        }
      ]
    }
  ];

  const priyavratStory = chhathKathaStories.find(s => s.id === 'katha-priyavrata') || chhathKathaStories[0];
  const otherStories = chhathKathaStories.filter(s => s.id !== 'katha-priyavrata');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-16">
      <SeoHead
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className="container-custom max-w-4xl mx-auto px-4 pt-4 space-y-8">
        
        {/* 1. Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* 2. Hero Section */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-5 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>पावन लोककथा एवं पौराणिक परंपराएं • 2026</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight leading-tight">
            छठ पूजा कथा 2026 — छठी मैया की कथा और छठ व्रत की कहानी
          </h1>

          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            छठ महापर्व से जुड़ी प्रचलित लोककथाएं, छठी मैया की कथा और सूर्य उपासना की परंपरा को सरल हिंदी में जानें।
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/CHHATH/chhath-puja-vidhi/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-puja-vidhi');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold font-mukta text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-decoration-none"
            >
              <Calendar className="w-5 h-5 text-stone-950" />
              <span>पूजा विधि देखें</span>
            </a>

            <a
              href="/CHHATH/chhath-puja-geet/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('chhath-puja-geet');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white dark:bg-stone-900 hover:bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold font-mukta text-sm sm:text-base border border-amber-500/30 transition-all flex items-center justify-center gap-2 text-decoration-none"
            >
              <Music className="w-5 h-5 text-amber-500" />
              <span>छठ गीत सुनें</span>
            </a>
          </div>
        </header>

        {/* 3. Main SEO Content Body */}
        <article className="space-y-8 font-mukta text-stone-800 dark:text-stone-200">
          
          {/* Section: Overview */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/15 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                📜
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                छठ पूजा की कथा क्या है?
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              छठ महापर्व में व्रती 36 घंटे के निर्जला उपवास के दौरान नियम, निष्ठा और भक्ति भाव से ओतप्रोत रहते हैं। इस पावन अवसर पर <strong>छठ पूजा कथा (Chhath Puja Katha)</strong> सुनना और सुनाना अत्यंत फलदायी माना गया है। लोकपरंपरा में छठ व्रत से जुड़ी कई प्राचीन कथाएं एवं पौराणिक मान्यताएं प्रचलित हैं, जो इस महापर्व के महत्व, संतान रक्षा और सूर्य देव की असीम कृपा को दर्शाती हैं।
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              विशेष रूप से लोकपरंपरा में <strong>छठी मैया की कथा (Chhathi Maiya Katha)</strong>, राजा प्रियव्रत और देवी षष्ठी का आख्यान, पांडवों द्वारा द्रौपदी संग सूर्य आराधना, दानवीर कर्ण की अर्घ्य परंपरा और प्रभु राम-माता सीता का सूर्य षष्ठी व्रत अत्यंत प्रसिद्ध है। इन कथाओं का मूल संदेश निष्काम भक्ति, प्रकृति प्रेम और परिवार के कल्याण की कामना है।
            </p>
          </section>

          {/* Section: Chhathi Maiya ki Prachalit Lokkatha */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/15 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                🌺
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                छठी मैया की प्रचलित लोककथा
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              लोकपरंपरा में प्रचलित मान्यताओं के अनुसार, भगवान ब्रह्मा जी की मानस पुत्री &ldquo;देवसेना&rdquo; को ही संसार में <strong>छठी मैया (षष्ठी देवी)</strong> के नाम से पूजा जाता है। वे मूल प्रकृति के छठे अंश से उत्पन्न हुई हैं, इसीलिए उन्हें षष्ठी देवी या छठी मैया कहा जाता है।
            </p>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-sm sm:text-base">
              <span className="font-bold text-amber-900 dark:text-amber-300 block">
                लोकपरंपरा में प्रचलित मान्यता:
              </span>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                छठी मैया शिशुओं की संरक्षिका और संतान सुख प्रदात्री देवी मानी जाती हैं। नवजात शिशु के जन्म के छठे दिन &lsquo;छठी पूजा&rsquo; का विधान भी इन्हीं देवी को समर्पित होता है। छठ महापर्व के अवसर पर व्रती महिलाएं और पुरुष अपने बच्चों की लंबी आयु, निरोगी काया और उज्ज्वल भविष्य के लिए छठी मैया का निर्जला व्रत रखते हैं।
              </p>
            </div>
          </section>

          {/* Section: Raja Priyavrat Story */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/15 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                👑
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {priyavratStory.category}
                </span>
                <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                  राजा प्रियव्रत से जुड़ी प्रचलित कथा
                </h2>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-900 dark:text-amber-300">
              📌 लोकपरंपरा में एक प्रचलित कथा के अनुसार:
            </div>

            <div className="space-y-3 font-mukta text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed">
              {priyavratStory.story.map((para, idx) => (
                <p key={idx} className="text-justify">
                  {para}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-amber-500/15">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500 shrink-0" />
                  <span>आध्यात्मिक संदेश:</span>
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  {priyavratStory.moral}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-1">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>अनुष्ठान से संबंध:</span>
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  {priyavratStory.ritualsLink}
                </p>
              </div>
            </div>
          </section>

          {/* Section: Other Traditional Stories */}
          <section className="space-y-4">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100 border-l-4 border-amber-500 pl-3">
              छठ पूजा की अन्य प्रचलित पौराणिक लोककथाएं
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
              विभिन्न क्षेत्रीय लोकपरंपराओं में छठ महापर्व और सूर्य उपासना से जुड़ी ये कथाएं भी अत्यंत श्रद्धापूर्वक सुनी जाती हैं:
            </p>

            <div className="space-y-4">
              {otherStories.map((story) => (
                <div
                  key={story.id}
                  className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-2">
                    <h3 className="font-rozha text-xl font-bold text-amber-800 dark:text-amber-300">
                      {story.title}
                    </h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300">
                      {story.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {story.story.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-stone-700 dark:text-stone-300 font-semibold">
                    💡 <strong>संबद्धता:</strong> {story.ritualsLink}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Surya Dev Significance */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-500/15 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                ☀️
              </div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
                सूर्य देव और छठ पूजा का महत्व
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              छठ पूजा भारतीय वैदिक संस्कृति का एकमात्र ऐसा लोकपर्व है जिसमें किसी मूर्ति के स्थान पर प्रत्यक्ष दिखने वाले देवता <strong>भगवान सूर्य नारायण (भुवन भास्कर)</strong> की पूजा जल में खड़े होकर की जाती है। सूर्य देव सम्पूर्ण सृष्टि में ऊर्जा, जीवन, स्वास्थ्य और सकारात्मकता के प्रत्यक्ष स्रोत हैं।
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
              छठ पर्व की अनोखी विशेषता यह है कि इसमें पहले अस्ताचलगामी (डूबते हुए) सूर्य को संध्या अर्घ्य अर्पित किया जाता है, और अगले दिन प्रातःकाल उदित होते सूर्य को उषा अर्घ्य दिया जाता है। यह परंपरा सिखाती है कि ढलते और उदित होते दोनों स्वरूप वंदनीय हैं।
            </p>
          </section>

          {/* Section: Four-Day Observance Connection */}
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-100">
              चार दिवसीय छठ अनुष्ठान और कथा का संबंध (Chhath 2026 Dates)
            </h2>

            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300">
              छठ व्रत कथा सुनने की मुख्य परंपरा कार्तिक शुक्ल पंचमी की शाम खरना प्रसाद ग्रहण करने के पश्चात तथा संध्या अर्घ्य के पावन समय पर होती है। वर्ष 2026 के महापर्व की तिथियां इस प्रकार हैं:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-1">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">दिन 1 • कार्तिक शुक्ल चतुर्थी</div>
                <div className="font-bold text-base text-stone-900 dark:text-stone-100">1. नहाय-खाय — 13 नवंबर 2026 (शुक्रवार)</div>
                <p className="text-xs text-stone-600 dark:text-stone-400">कायिक शुद्धि और सात्विक कद्दू-भात का संकल्प।</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-1">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">दिन 2 • कार्तिक शुक्ल पंचमी</div>
                <div className="font-bold text-base text-stone-900 dark:text-stone-100">2. खरना / लोहंडा — 14 नवंबर 2026 (शनिवार)</div>
                <p className="text-xs text-stone-600 dark:text-stone-400">दिनभर उपवास, शाम को गुड़ की खीर प्रसाद और कथा पाठ।</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-1">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">दिन 3 • कार्तिक शुक्ल षष्ठी</div>
                <div className="font-bold text-base text-stone-900 dark:text-stone-100">3. संध्या अर्घ्य — 15 नवंबर 2026 (रविवार)</div>
                <p className="text-xs text-stone-600 dark:text-stone-400">नदी/घाट पर खड़े होकर अस्ताचलगामी सूर्य को पहला अर्घ्य।</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 space-y-1">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">दिन 4 • कार्तिक शुक्ल सप्तमी</div>
                <div className="font-bold text-base text-stone-900 dark:text-stone-100">4. उषा अर्घ्य व पारण — 16 नवंबर 2026 (सोमवार)</div>
                <p className="text-xs text-stone-600 dark:text-stone-400">उदित होते सूर्य को अंतिम अर्घ्य व 36 घंटे का पारण।</p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a
                href="/CHHATH/chhath-puja-vidhi/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('chhath-puja-vidhi');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-stone-950 font-bold font-mukta text-xs sm:text-sm hover:bg-amber-400 transition-all text-decoration-none shadow"
              >
                <span>सम्पूर्ण छठ पूजा विधि एवं नियम विस्तार से पढ़ें</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </a>
            </div>
          </section>

          {/* Section: FAQ */}
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
                  1. छठ पूजा की कथा क्या है?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  छठ पूजा की कथा छठ महापर्व, छठी मैया की कृपा और सूर्य देव की उपासना से जुड़ी भक्तिमय लोककथाओं का संग्रह है, जिसे व्रती खरना और अर्घ्य के पावन अवसर पर सुनते व सुनाते हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  2. छठी मैया की कथा क्या है?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  लोकपरंपरा के अनुसार छठी मैया (षष्ठी देवी) ब्रह्मा जी की मानस पुत्री और बच्चों की संरक्षिका हैं। राजा प्रियव्रत द्वारा संतान रक्षा हेतु छठी मैया की पूजा की कथा सर्वाधिक प्रचलित है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  3. छठ पूजा में कथा का क्या महत्व है?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  छठ पूजा में कथा सुनने से व्रतियों में अटूट श्रद्धा, नियम-संयम और भक्ति भाव सुदृढ़ होता है। यह पीढ़ियों से चली आ रही लोक-संस्कृति और संस्कारों का संचरण करती है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  4. क्या छठ पूजा की कथा के अलग-अलग रूप प्रचलित हैं?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  हाँ, छठ पूजा की लोकपरंपरा में कई कथाएं प्रचलित हैं। राजा प्रियव्रत की कथा के अलावा महाभारत में द्रौपदी व दानवीर कर्ण और रामायण में माता सीता द्वारा सूर्य पूजन की कथाएं भी क्षेत्रीय लोकपरंपराओं में श्रद्धापूर्वक सुनी जाती हैं।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                <h3 className="font-bold text-stone-900 dark:text-amber-300">
                  5. छठ पूजा 2026 कब है?
                </h3>
                <p className="text-stone-700 dark:text-stone-300">
                  छठ पूजा 2026 का महापर्व 13 नवंबर 2026 (शुक्रवार) को नहाय-खाय से प्रारंभ होकर 16 नवंबर 2026 (सोमवार) उषा अर्घ्य व पारण के साथ संपन्न होगा।
                </p>
              </div>
            </div>
          </section>

          {/* Section: Related Guides */}
          <section className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
              छठ पूजा से जुड़े अन्य महत्वपूर्ण मार्गदर्शक (Chhath Guides)
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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

              <a
                href="/CHHATH/chhath-puja-geet/"
                onClick={(e) => { e.preventDefault(); onNavigate('chhath-puja-geet'); }}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
              >
                <span className="text-xs sm:text-sm">छठ पूजा के गीत</span>
                <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};
