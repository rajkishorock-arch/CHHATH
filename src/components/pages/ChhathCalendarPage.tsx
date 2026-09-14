import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { 
  Calendar, 
  Clock, 
  Sun, 
  Sunset, 
  Sunrise, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  MapPin, 
  Check, 
  ListChecks, 
  Flame,
  ChevronRight
} from 'lucide-react';
import { getChhathDays } from '../../data/days';
import { calculateChhathStatus } from '../hero/LiveFestivalExperience';
import { useLanguage } from '../../context/LanguageContext';

interface PageProps {
  onNavigate: (url: string) => void;
}

export const ChhathCalendarPage: React.FC<PageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const canonicalUrl = 'https://rajkishorock-arch.github.io/CHHATH/chhath-calendar-2026/';
  const title = 'Chhath Puja Calendar 2026 | छठ पूजा तारीख, नहाय खाय, खरना और अर्घ्य';
  const description = 'Chhath Puja 2026 का पूरा कैलेंडर देखें: नहाय खाय 13 नवंबर, खरना 14 नवंबर, संध्या अर्घ्य 15 नवंबर और उषा अर्घ्य व पारण 16 नवंबर।';

  const breadcrumbs = [
    { label: 'छठ पूजा कैलेंडर 2026', url: '/CHHATH/chhath-calendar-2026/' }
  ];

  // Get current live festival status strictly in IST (Asia/Kolkata)
  const { stateData } = calculateChhathStatus(new Date(), language);

  const daysInfo = getChhathDays(language);

  // Status mapping for cards
  const getCardStatus = (dayNum: number) => {
    if (stateData.activeStep === 0) return { label: 'आगामी (Upcoming)', type: 'upcoming' };
    if (stateData.activeStep === dayNum) return { label: 'आज (Today)', type: 'today' };
    if (stateData.activeStep > dayNum) return { label: 'संपन्न (Completed)', type: 'completed' };
    return { label: 'आगामी (Upcoming)', type: 'upcoming' };
  };

  // Structured Data (JSON-LD)
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
          'name': 'छठ पूजा कैलेंडर 2026',
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
            'text': 'छठ पूजा 2026 का चार दिवसीय महापर्व 13 नवंबर 2026 (शुक्रवार) को नहाय-खाय से प्रारंभ होकर 16 नवंबर 2026 (सोमवार) को उषा अर्घ्य व पारण के साथ संपन्न होगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'नहाय खाय कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'नहाय खाय कार्तिक शुक्ल चतुर्थी, 13 नवंबर 2026 (शुक्रवार) को है। इस दिन पवित्र स्नान के पश्चात सात्त्विक कद्दू-भात का प्रसाद ग्रहण किया जाता है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'खरना कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'खरना कार्तिक शुक्ल पंचमी, 14 नवंबर 2026 (शनिवार) को है। इस दिन संध्या समय गुड़ की रसियाव खीर व रोटी का भोग लगाकर 36 घंटे का निर्जला व्रत शुरू होता है।'
          }
        },
        {
          '@type': 'Question',
          'name': 'संध्या अर्घ्य कब दिया जाएगा?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'संध्या अर्घ्य (पहला अर्घ्य) कार्तिक शुक्ल षष्ठी, 15 नवंबर 2026 (रविवार) को सूर्यास्त के समय अस्ताचलगामी सूर्य को अर्पित किया जाएगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'उषा अर्घ्य और पारण कब है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'उषा अर्घ्य (दूसरा अर्घ्य) व पारण कार्तिक शुक्ल सप्तमी, 16 नवंबर 2026 (सोमवार) को प्रातः सूर्योदय के समय उदित सूर्य को अर्घ्य देने के बाद संपन्न होगा।'
          }
        },
        {
          '@type': 'Question',
          'name': 'अलग-अलग शहरों में अर्घ्य का समय अलग क्यों होता है?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'प्रत्येक शहर का भौगोलिक अक्षांश एवं देशांतर (Latitude & Longitude) भिन्न होने के कारण सूर्यास्त और सूर्योदय के समय में कुछ मिनटों का अंतर होता है।'
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

        {/* 1. Hero Header */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mukta font-bold text-xs border border-amber-500/30">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>कार्तिक शुक्ल षष्ठी • लोक आस्था का महापर्व 2026</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
            छठ पूजा कैलेंडर 2026
          </h1>

          <p className="font-mukta text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            नहाय खाय से पारण तक छठ महापर्व के सभी प्रमुख दिनों और अनुष्ठानों की पूरी जानकारी।
          </p>

          {/* Compact 4-Date Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-900/90 border border-amber-500/30 text-center shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">13 Nov 2026</span>
              <span className="font-rozha font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">नहाय खाय</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-stone-900/90 border border-amber-500/30 text-center shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">14 Nov 2026</span>
              <span className="font-rozha font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">खरना</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-stone-900/90 border border-red-500/30 text-center shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">15 Nov 2026</span>
              <span className="font-rozha font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">संध्या अर्घ्य</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-stone-900/90 border border-amber-500/30 text-center shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">16 Nov 2026</span>
              <span className="font-rozha font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 block">उषा अर्घ्य + पारण</span>
            </div>
          </div>
        </header>

        {/* 2. Live Current-Day Status Banner (Dynamic IST) */}
        <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-red-500/20 border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-800 dark:text-orange-300 text-xs font-bold border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>लाइव स्थिति (Asia/Kolkata IST)</span>
            </div>
            <h2 className="font-rozha text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-amber-200">
              {stateData.title}
            </h2>
            <p className="font-mukta text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              {stateData.desc}
            </p>
          </div>

          <a
            href={stateData.primaryCtaUrl}
            onClick={(e) => { e.preventDefault(); onNavigate(stateData.primaryCtaTab); }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-xs sm:text-sm hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2 shrink-0 text-decoration-none"
          >
            <span>{stateData.primaryCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* 3. Four-Step Progress Indicator */}
        <section className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/30 shadow-lg space-y-4">
          <h2 className="font-rozha text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-100 text-center">
            छठ महापर्व 4-चरण प्रगति (Festival Journey)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2">
            {[
              { num: 1, name: 'नहाय खाय', date: '13 Nov' },
              { num: 2, name: 'खरना', date: '14 Nov' },
              { num: 3, name: 'संध्या अर्घ्य', date: '15 Nov' },
              { num: 4, name: 'उषा अर्घ्य व पारण', date: '16 Nov' }
            ].map((step) => {
              const status = getCardStatus(step.num);
              const isToday = status.type === 'today';
              const isCompleted = status.type === 'completed';

              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-between space-y-1.5 ${
                    isToday
                      ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/50 shadow-md scale-105'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isToday ? (
                      <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-stone-300 dark:bg-stone-700 text-[10px] font-bold flex items-center justify-center text-stone-700 dark:text-stone-300">
                        {step.num}
                      </span>
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{step.date}</span>
                  </div>

                  <span className="font-rozha font-bold text-xs sm:text-sm block">
                    {step.name}
                  </span>

                  <span className="text-[10px] font-mukta font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-stone-800/80">
                    {isToday ? '🔴 आज' : isCompleted ? '✓ संपन्न' : 'आगामी'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Four Detailed Timeline Cards */}
        <section className="space-y-6">
          
          {daysInfo.map((day) => {
            const status = getCardStatus(day.dayNumber);
            const isToday = status.type === 'today';
            const isCompleted = status.type === 'completed';

            return (
              <div
                key={day.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-xl space-y-6 relative overflow-hidden ${
                  isToday
                    ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-amber-500 shadow-amber-500/20 ring-2 ring-amber-500/30'
                    : 'bg-white dark:bg-stone-900 border-amber-500/20'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-md shrink-0">
                      0{day.dayNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                          {day.tithi}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isToday
                            ? 'bg-orange-500 text-white animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}>
                          {status.label}
                        </span>
                      </div>

                      <h3 className="font-rozha text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-amber-100">
                        {day.title}
                      </h3>
                      <span className="text-xs font-mukta font-bold text-stone-500 dark:text-stone-400">
                        🗓 {day.date2026}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Day Significance & Meaning */}
                <div className="space-y-3 font-mukta text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    <strong>अर्थ एवं महत्व:</strong> {day.meaning}
                  </p>
                  <p>
                    <strong>आहार व महाप्रसाद:</strong> {day.food}
                  </p>
                </div>

                {/* Today What To Do Checklist */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                  <h4 className="font-rozha text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-amber-600" />
                    <span>आज क्या करें? (Checklist)</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-mukta text-stone-800 dark:text-stone-200 list-none p-0">
                    {day.rituals.map((ritual, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ritual}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arghya Calculator Integration CTAs */}
                {day.dayNumber === 3 && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-stone-500 font-mukta">
                      🌇 संध्या अर्घ्य (15 नवंबर 2026) का सूर्यास्त समय शहर अनुसार देखें।
                    </span>
                    <a
                      href="/CHHATH/chhath-arghya-time-2026/"
                      onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all flex items-center gap-1.5 text-decoration-none shadow-sm"
                    >
                      <span>अपने शहर का संध्या अर्घ्य समय देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {day.dayNumber === 4 && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-stone-500 font-mukta">
                      🌅 उषा अर्घ्य (16 नवंबर 2026) का सूर्योदय समय व पारण निर्देश देखें।
                    </span>
                    <a
                      href="/CHHATH/chhath-arghya-time-2026/"
                      onClick={(e) => { e.preventDefault(); onNavigate('/CHHATH/chhath-arghya-time-2026/'); }}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all flex items-center gap-1.5 text-decoration-none shadow-sm"
                    >
                      <span>उषा अर्घ्य का समय देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

              </div>
            );
          })}

        </section>

        {/* 5. FAQ Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-amber-500/30 shadow-xl space-y-4">
          <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>अक्सर पूछे जाने वाले प्रश्न (FAQ)</span>
          </h2>

          <div className="space-y-4 font-mukta text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
              <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: छठ पूजा 2026 कब है?</h3>
              <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: छठ पूजा 2026 का महापर्व 13 नवंबर (शुक्रवार) से 16 नवंबर 2026 (सोमवार) तक मनाया जाएगा।</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
              <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: नहाय खाय कब है?</h3>
              <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: नहाय खाय कार्तिक शुक्ल चतुर्थी, 13 नवंबर 2026 (शुक्रवार) को है।</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
              <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: खरना कब है?</h3>
              <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: खरना कार्तिक शुक्ल पंचमी, 14 नवंबर 2026 (शनिवार) को है।</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
              <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: संध्या अर्घ्य कब दिया जाएगा?</h3>
              <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: संध्या अर्घ्य कार्तिक शुक्ल षष्ठी, 15 नवंबर 2026 (रविवार) को सूर्यास्त के समय दिया जाएगा।</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
              <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: उषा अर्घ्य और पारण कब है?</h3>
              <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: उषा अर्घ्य व पारण कार्तिक शुक्ल सप्तमी, 16 नवंबर 2026 (सोमवार) को सूर्योदय के समय संपन्न होगा।</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
              <h3 className="font-bold text-stone-900 dark:text-amber-300">प्रश्न: अलग-अलग शहरों में अर्घ्य का समय अलग क्यों होता है?</h3>
              <p className="mt-1 text-stone-700 dark:text-stone-300">उत्तर: प्रत्येक शहर के अक्षांश एवं देशांतर (Latitude/Longitude) भिन्न होने के कारण सूर्यास्त व सूर्योदय समय में कुछ मिनटों का अंतर होता है। सटीक समय हेतु हमारे अर्घ्य कैलकुलेटर का प्रयोग करें।</p>
            </div>
          </div>
        </section>

        {/* 6. Crawlable Internal Links */}
        <section className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <h2 className="font-rozha text-2xl font-bold text-stone-900 dark:text-amber-100">
            छठ महापर्व के अन्य उपयोगी पृष्ठ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <a
              href="/CHHATH/chhath-puja-vidhi/"
              onClick={(e) => { e.preventDefault(); onNavigate('chhath-puja-vidhi'); }}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
            >
              <span>छठ पूजा विधि 2026</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </a>

            <a
              href="/CHHATH/chhath-samagri/"
              onClick={(e) => { e.preventDefault(); onNavigate('chhath-samagri'); }}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
            >
              <span>छठ पूजा सामग्री सूची</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </a>

            <a
              href="/CHHATH/chhath-arghya-time-2026/"
              onClick={(e) => { e.preventDefault(); onNavigate('chhath-arghya-time-2026'); }}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
            >
              <span>छठ अर्घ्य समय 2026</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </a>

            <a
              href="/CHHATH/thekua-recipe/"
              onClick={(e) => { e.preventDefault(); onNavigate('thekua-recipe'); }}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
            >
              <span>ठेकुआ महाप्रसाद रेसिपी</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </a>

            <a
              href="/CHHATH/chhath-puja-geet/"
              onClick={(e) => { e.preventDefault(); onNavigate('chhath-puja-geet'); }}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
            >
              <span>छठ पूजा लोकगीत 🎵</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </a>

            <a
              href="/CHHATH/chhath-puja-katha/"
              onClick={(e) => { e.preventDefault(); onNavigate('chhath-puja-katha'); }}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-500/20 hover:border-amber-400 text-decoration-none font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition-all"
            >
              <span>छठ पूजा पौराणिक कथा 📜</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
