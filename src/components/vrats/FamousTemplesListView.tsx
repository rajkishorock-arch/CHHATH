import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Home,
  Landmark,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight,
  Search,
  Plane,
  Train,
  Car,
  Compass,
  Eye,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Check
} from 'lucide-react';
import { FAMOUS_TEMPLES_DATA, TempleItem } from '../../data/famousTemplesData';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { SeoHead } from '../seo/SeoHead';

interface FamousTemplesListViewProps {
  onBack: () => void;
  onGoHome?: () => void;
}

type TempleCategory = 'all' | 'surya' | 'jyotirlinga' | 'dham' | 'devi';

export const FamousTemplesListView: React.FC<FamousTemplesListViewProps> = ({ 
  onBack,
  onGoHome = onBack 
}) => {
  const [selectedTemple, setSelectedTemple] = useState<TempleItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TempleCategory>('all');
  const [copied, setCopied] = useState(false);

  // Scroll to top immediately when a temple is selected or deselected
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [selectedTemple]);

  // Filter temples based on category & search query
  const filteredTemples = useMemo(() => {
    return FAMOUS_TEMPLES_DATA.filter(temple => {
      // Category filter
      if (activeCategory === 'surya') {
        if (!['deo-surya-mandir', 'ular-surya-mandir', 'konark-sun-temple'].includes(temple.id)) {
          return false;
        }
      } else if (activeCategory === 'jyotirlinga') {
        if (!['kashi-vishwanath', 'kedarnath-dham', 'mahakaleshwar-ujjain', 'somnath-mandir'].includes(temple.id)) {
          return false;
        }
      } else if (activeCategory === 'dham') {
        if (!['badrinath-dham', 'puri-jagannath', 'dwarkadhish-mandir', 'ram-mandir-ayodhya', 'tirupati-balaji'].includes(temple.id)) {
          return false;
        }
      } else if (activeCategory === 'devi') {
        if (!['vaishno-devi', 'kamakhya-devi', 'meenakshi-amman'].includes(temple.id)) {
          return false;
        }
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        temple.hindiName.toLowerCase().includes(q) ||
        temple.name.toLowerCase().includes(q) ||
        temple.deity.toLowerCase().includes(q) ||
        temple.location.toLowerCase().includes(q) ||
        temple.state.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  const handleShare = async (temple: TempleItem) => {
    const shareData = {
      title: `${temple.hindiName} - ChhathVibes`,
      text: `${temple.hindiName} (${temple.location}): ${temple.tagline}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard write error fallback
      }
    }
  };

  // If a temple is selected, render a comprehensive, authoritative spiritual encyclopedia view!
  if (selectedTemple) {
    return (
      <div className="bg-[#fdf6ee] dark:bg-stone-950 text-[#451a03] dark:text-stone-100 animate-ios-slide-in flex flex-col">
        <SeoHead
          title={`${selectedTemple.hindiName} — इतिहास, दर्शन समय व यात्रा निर्देशिका | ChhathVibes`}
          description={`${selectedTemple.hindiName} (${selectedTemple.location}): ${selectedTemple.tagline}। संपूर्ण इतिहास, आरती समय, वास्तुकला व कैसे पहुंचे।`}
          canonicalUrl={`https://chhathvibes.vercel.app/famous-temples#${selectedTemple.id}`}
        />

        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#fffaf5]/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-[#fed7aa]/60 dark:border-stone-800 shadow-xs px-3 sm:px-4 py-2.5">
          <div className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto flex items-center justify-between gap-2">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                setSelectedTemple(null);
              }}
              className="w-10 h-10 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700"
              aria-label="वापस जाएं"
              title="वापस सूची पर जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center min-w-0 px-2">
              <h1 className="font-serif font-black text-base sm:text-lg text-[#7c2d12] dark:text-amber-400 truncate">
                {selectedTemple.hindiName}
              </h1>
              <p className="text-[11px] text-[#9a3412]/80 dark:text-stone-400 truncate font-mukta font-bold">
                {selectedTemple.location} • {selectedTemple.state}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleShare(selectedTemple)}
                className="w-10 h-10 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700"
                aria-label="साझा करें"
                title="शेयर करें"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onGoHome}
                className="w-10 h-10 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700"
                aria-label="होम स्क्रीन"
                title="होम स्क्रीन"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Temple Real Image Hero Section */}
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-stone-900">
          <img
            src={getImageUrl(selectedTemple.image)}
            alt={selectedTemple.hindiName}
            onError={(e) => handleImageError(e, '/images/hero_sunrise.jpg')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
          <div className="absolute bottom-5 left-4 right-4 max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#ea580c] text-white text-xs font-bold shadow-xs">
                {selectedTemple.state}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-xs text-stone-900 text-xs font-black shadow-xs">
                {selectedTemple.deity}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif drop-shadow-md text-amber-50">
              {selectedTemple.hindiName}
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-1.5 flex items-center drop-shadow-xs font-serif">
              <MapPin className="w-4 h-4 mr-1 text-[#fbbf24] shrink-0" />
              {selectedTemple.location}
            </p>
          </div>
        </div>

        {/* Tagline Banner */}
        <div className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto w-full px-4 -mt-3 relative z-10">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-200 shrink-0" />
            <p className="font-serif font-bold text-sm sm:text-base leading-snug">
              {selectedTemple.tagline}
            </p>
          </div>
        </div>

        {/* Comprehensive Information Sections */}
        <main className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto w-full px-4 pt-4 pb-2 space-y-4 flex-1">
          {/* 1. तीर्थ का महात्म्य व फल */}
          <section className="p-4 sm:p-5 bg-[#fff7ed] dark:bg-stone-900 rounded-3xl border border-[#fed7aa] dark:border-stone-800 shadow-xs space-y-2">
            <h3 className="text-xs sm:text-sm font-black text-[#9a3412] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-[#ea580c]" />
              तीर्थ का महात्म्य एवं आध्यात्मिक फल
            </h3>
            <p className="leading-relaxed font-serif text-[#451a03] dark:text-stone-200 text-sm sm:text-base">
              {selectedTemple.significance}
            </p>
          </section>

          {/* 2. प्राचीन इतिहास एवं पौराणिक कथा */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Landmark className="w-4 h-4 mr-2 text-[#ea580c]" />
              प्राचीन इतिहास एवं पौराणिक कथा
            </h3>
            <p className="leading-relaxed text-[#292524] dark:text-stone-200 text-sm sm:text-base font-serif">
              {selectedTemple.history}
            </p>
          </section>

          {/* 3. वास्तुकला व स्थापत्य शैली */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Compass className="w-4 h-4 mr-2 text-[#ea580c]" />
              वास्तुकला एवं स्थापत्य शैली
            </h3>
            <p className="leading-relaxed text-[#292524] dark:text-stone-200 text-sm sm:text-base font-serif">
              {selectedTemple.architecture}
            </p>
          </section>

          {/* 4. गर्भगृह एवं पावन विग्रह स्वरूप */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Eye className="w-4 h-4 mr-2 text-[#ea580c]" />
              गर्भगृह एवं पावन विग्रह स्वरूप
            </h3>
            <p className="leading-relaxed text-[#292524] dark:text-stone-200 text-sm sm:text-base font-serif">
              {selectedTemple.sanctumAndDeity}
            </p>
          </section>

          {/* 5. अलौकिक चमत्कार, रहस्य व मान्यताएं */}
          <section className="p-4 sm:p-5 bg-[#fffaf5] dark:bg-stone-900 rounded-3xl border-2 border-amber-300 dark:border-amber-800/60 shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#9a3412] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Flame className="w-4 h-4 mr-2 text-[#ea580c]" />
              अलौकिक चमत्कार, रहस्य व जनविश्वास
            </h3>
            <p className="leading-relaxed text-[#292524] dark:text-stone-200 text-sm sm:text-base font-serif">
              {selectedTemple.miraclesAndBeliefs}
            </p>
          </section>

          {/* 6. नित्य दर्शन व आरती समय-सारणी */}
          <section className="p-4 sm:p-5 bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] dark:from-stone-900 dark:to-stone-800 rounded-3xl border border-[#fed7aa] dark:border-stone-700 shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#9a3412] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#ea580c]" />
              नित्य दर्शन एवं आरती समय-सारणी
            </h3>
            <div className="bg-white/90 dark:bg-stone-950/80 rounded-2xl p-3 sm:p-4 border border-[#fed7aa]/60 dark:border-stone-800">
              <p className="text-sm sm:text-base font-bold text-[#7c2d12] dark:text-amber-300 leading-relaxed font-mukta">
                {selectedTemple.aartiTimings}
              </p>
            </div>
          </section>

          {/* 7. पूजा, अभिषेक व महाप्रसाद परंपरा */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-[#ea580c]" />
              पूजा, अभिषेक एवं महाप्रसाद परंपरा
            </h3>
            <p className="leading-relaxed text-[#292524] dark:text-stone-200 text-sm sm:text-base font-serif">
              {selectedTemple.pujaAndBhog}
            </p>
          </section>

          {/* 8. प्रमुख उत्सव व वार्षिक मेले */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[#ea580c]" />
              प्रमुख उत्सव, मेले एवं पावन तिथियां
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {selectedTemple.majorFestivals.map((fest, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 bg-[#fff7ed] dark:bg-stone-800/80 border border-[#fed7aa] dark:border-stone-700 rounded-2xl text-xs sm:text-sm font-bold text-[#9a3412] dark:text-amber-300 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>{fest}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 9. यात्रा निर्देशिका — कैसे पहुंचें */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#ea580c]" />
              यात्रा निर्देशिका — कैसे पहुंचें (Travel Guide)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#fff7ed] dark:bg-stone-800/60 rounded-2xl border border-[#fed7aa]/70 dark:border-stone-700 flex items-start gap-3">
                <Plane className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-[#78350f] dark:text-amber-300">निकटतम हवाई अड्डा</h4>
                  <p className="text-xs sm:text-sm text-[#292524] dark:text-stone-300 mt-0.5">{selectedTemple.travelGuide.nearestAirport}</p>
                </div>
              </div>

              <div className="p-3 bg-[#fff7ed] dark:bg-stone-800/60 rounded-2xl border border-[#fed7aa]/70 dark:border-stone-700 flex items-start gap-3">
                <Train className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-[#78350f] dark:text-amber-300">निकटतम रेलवे स्टेशन</h4>
                  <p className="text-xs sm:text-sm text-[#292524] dark:text-stone-300 mt-0.5">{selectedTemple.travelGuide.nearestRailway}</p>
                </div>
              </div>

              <div className="p-3 bg-[#fff7ed] dark:bg-stone-800/60 rounded-2xl border border-[#fed7aa]/70 dark:border-stone-700 flex items-start gap-3">
                <Car className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-[#78350f] dark:text-amber-300">सड़क मार्ग व हाईवे</h4>
                  <p className="text-xs sm:text-sm text-[#292524] dark:text-stone-300 mt-0.5">{selectedTemple.travelGuide.roadAccess}</p>
                </div>
              </div>

              <div className="p-3 bg-[#fff7ed] dark:bg-stone-800/60 rounded-2xl border border-[#fed7aa]/70 dark:border-stone-700 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-[#78350f] dark:text-amber-300">सर्वोत्तम दर्शन समय</h4>
                  <p className="text-xs sm:text-sm text-[#292524] dark:text-stone-300 mt-0.5">{selectedTemple.travelGuide.bestTimeToVisit}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. दर्शनार्थियों हेतु महत्वपूर्ण सुझाव व नियम */}
          <section className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border border-[#fed7aa]/70 dark:border-stone-800 shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-[#78350f] dark:text-amber-400 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-[#ea580c]" />
              दर्शनार्थियों हेतु महत्वपूर्ण सुझाव व नियम
            </h3>
            <ul className="space-y-2 pt-1">
              {selectedTemple.devoteeTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#292524] dark:text-stone-300 font-serif">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf6ed] dark:bg-stone-950 text-[#451a03] dark:text-stone-100 animate-ios-slide-in flex flex-col">
      <SeoHead
        title="भारत के प्रसिद्ध सूर्य मंदिर एवं पावन तीर्थ स्थल | Famous Hindu Temples - ChhathVibes"
        description="देव सूर्य मंदिर, उलार, कोणार्क, काशी विश्वनाथ, अयोध्या राम मंदिर, वैष्णो देवी, तिरुपति बालाजी, केदारनाथ सहित भारत के 18 प्रमुख तीर्थों का संपूर्ण इतिहास, आरती समय व दर्शन गाइड।"
        canonicalUrl="https://chhathvibes.vercel.app/famous-temples"
      />

      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-[#fdf6ed]/95 dark:bg-stone-900/95 backdrop-blur-md px-4 py-3 border-b border-[#fed7aa]/50 dark:border-stone-800 shadow-xs">
        <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700"
            aria-label="वापस जाएं"
            title="वापस"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="font-serif font-black text-xl sm:text-2xl text-[#78350f] dark:text-amber-400 tracking-wide">
              प्रसिद्ध मंदिर एवं तीर्थ
            </h1>
            <p className="text-[11px] text-[#9a3412] dark:text-stone-400 font-bold">
              18 प्रमुख पावन देवालयों का सम्पूर्ण इतिहास व दर्शन गाइड
            </p>
          </div>

          <button
            onClick={onGoHome}
            className="w-10 h-10 rounded-full bg-[#fef3c7] dark:bg-stone-800 hover:bg-[#fed7aa] active:scale-95 text-[#9a3412] dark:text-amber-400 flex items-center justify-center transition-all shadow-xs border border-[#fde68a] dark:border-stone-700"
            aria-label="होम स्क्रीन"
            title="होम"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Search & Category Filters Bar */}
      <div className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-4 pt-4 pb-2 space-y-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-700/60 dark:text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="मंदिर का नाम, शहर या राज्य खोजें (जैसे: देव, काशी, अयोध्या, बिहार)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-[#fed7aa] dark:border-stone-800 text-[#451a03] dark:text-stone-100 placeholder:text-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 hover:text-stone-800 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800"
            >
              साफ़ करें
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-[#fed7aa] dark:border-stone-800 hover:bg-[#fff7ed]'
            }`}
          >
            सभी मंदिर ({FAMOUS_TEMPLES_DATA.length})
          </button>

          <button
            onClick={() => setActiveCategory('surya')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              activeCategory === 'surya'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-[#fed7aa] dark:border-stone-800 hover:bg-[#fff7ed]'
            }`}
          >
            ☀️ सूर्य मंदिर (3)
          </button>

          <button
            onClick={() => setActiveCategory('jyotirlinga')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              activeCategory === 'jyotirlinga'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-[#fed7aa] dark:border-stone-800 hover:bg-[#fff7ed]'
            }`}
          >
            🔱 द्वादश ज्योतिर्लिंग (4)
          </button>

          <button
            onClick={() => setActiveCategory('dham')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              activeCategory === 'dham'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-[#fed7aa] dark:border-stone-800 hover:bg-[#fff7ed]'
            }`}
          >
            🚩 चार धाम व प्रमुख धाम (5)
          </button>

          <button
            onClick={() => setActiveCategory('devi')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              activeCategory === 'devi'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-[#78350f] dark:text-stone-300 border border-[#fed7aa] dark:border-stone-800 hover:bg-[#fff7ed]'
            }`}
          >
            🌺 महाशक्तिपीठ व देवी धाम (3)
          </button>
        </div>
      </div>

      {/* 3. Grid of Famous Temples */}
      <main className="max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full px-4 pt-3 pb-2 md:pt-4 md:pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 flex-1">
        {filteredTemples.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-500 font-serif">
            <p className="text-base font-bold">कोई मंदिर नहीं मिला।</p>
            <p className="text-xs mt-1">कृपया भिन्न शब्द या श्रेणी चुनकर पुनः प्रयास करें।</p>
          </div>
        ) : (
          filteredTemples.map((temple) => (
            <div
              key={temple.id}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                setSelectedTemple(temple);
              }}
              className="group w-full bg-white dark:bg-stone-900 border border-[#fed7aa]/80 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col active:scale-[0.99] select-none"
            >
              {/* Card Image Thumbnail */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-900">
                <img
                  src={getImageUrl(temple.image)}
                  alt={temple.hindiName}
                  onError={(e) => handleImageError(e, '/images/hero_sunrise.jpg')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-900 text-[11px] font-black shadow-xs">
                    {temple.state}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-serif font-black text-lg text-amber-100 truncate drop-shadow-xs">
                    {temple.hindiName}
                  </h3>
                  <p className="text-[11px] text-amber-200/90 font-bold truncate flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1 text-amber-400 shrink-0" />
                    {temple.deity} • {temple.location}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#78350f] dark:text-stone-300 font-serif line-clamp-2 leading-relaxed">
                  {temple.tagline}
                </p>

                <div className="pt-2 border-t border-[#fed7aa]/40 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-[#c2410c] dark:text-amber-400">
                  <span className="group-hover:underline flex items-center">
                    सम्पूर्ण इतिहास व दर्शन मार्गदर्शिका
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
