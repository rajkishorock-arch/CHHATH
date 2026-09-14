import React, { useState } from 'react';
import { chhathPrasadItems } from '../../data/prasad';
import { ThekuaModal } from './ThekuaModal';
import { ThekuaCalculator } from './ThekuaCalculator';
import { useLanguage } from '../../context/LanguageContext';
import { Utensils, ChefHat, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { PrasadItem } from '../../types';

export const PrasadSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPrasad, setSelectedPrasad] = useState<PrasadItem | null>(null);
  const [thekuaModalOpen, setThekuaModalOpen] = useState(false);

  return (
    <section id="prasad" className="section-padding bg-gradient-to-b from-transparent via-orange-500/5 to-amber-500/5 relative overflow-hidden">
      <div className="container-custom">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="badge-saffron">
            <Utensils className="w-3.5 h-3.5" />
            <span>{t.prasadBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.prasadTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            {t.prasadSubtitle}
          </p>
        </div>

        {/* Featured Hero Banner for Thekua Recipe */}
        <div className="chhath-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl mb-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-64 sm:h-80 rounded-2xl overflow-hidden relative shadow-lg">
            <img
              src="/CHHATH/images/thekua_prasad.jpg"
              alt="छठ पूजा का पारंपरिक ठेकुआ प्रसाद"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('/CHHATH/images/')) {
                  target.src = '/images/thekua_prasad.jpg';
                }
              }}
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-600 text-white font-bold text-xs shadow">
              सर्वोच्च महाप्रसाद
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 font-mukta">
            <div className="badge-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>पारंपरिक रेसिपी गाइड</span>
            </div>
            <h3 className="font-rozha text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-bold">
              {t.thekuaRecipeBtn}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              काठ के पारंपरिक सांचे पर गढ़ा जाने वाला खस्ता और कुरकुरा ठेकुआ केवल छठ का प्रसाद नहीं, बल्कि पूर्वांचल की सबसे अमूल्य मिठाई है। शुद्ध घी का मोयन और देशी गुड़ की प्राकृतिक मिठास इसे अद्वितीय बनाती है।
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-xs font-semibold text-amber-800 dark:text-amber-300">
                100% शुद्ध देशी घी
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-xs font-semibold text-amber-800 dark:text-amber-300">
                मोटा गेहूं का आटा
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-xs font-semibold text-amber-800 dark:text-amber-300">
                सौंफ व इलायची
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setThekuaModalOpen(true)}
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                <span>{t.thekuaRecipeBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Thekua & Mahaprasad Quantity Calculator */}
        <ThekuaCalculator />

        {/* Prasad Items Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chhathPrasadItems.map((item) => (
            <div
              key={item.id}
              className="chhath-card overflow-hidden flex flex-col justify-between group border-amber-500/20 hover:border-amber-500/40"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-amber-300 bg-stone-900/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {item.localName}
                  </span>
                </div>

                <div className="p-5 font-mukta space-y-3">
                  <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.shortDesc}
                  </p>

                  {/* Cultural note */}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15 text-xs text-stone-700 dark:text-stone-300">
                    <strong className="text-orange-600 dark:text-amber-400 block mb-0.5">महत्व:</strong>
                    <span>{item.culturalSignificance}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    if (item.id === 'thekua') {
                      setThekuaModalOpen(true);
                    } else {
                      setSelectedPrasad(item);
                    }
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-orange-700 dark:text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>सामग्री व विधि देखें</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Prasad Quick Detail Modal (for non-thekua items) */}
        {selectedPrasad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-amber-500/30 font-mukta space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <h3 className="font-rozha text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {selectedPrasad.name}
                </h3>
                <button
                  onClick={() => setSelectedPrasad(null)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-300">
                {selectedPrasad.shortDesc}
              </p>

              <div>
                <h4 className="font-bold text-sm text-orange-600 dark:text-amber-400 mb-2">
                  मुख्य घटक / सामग्री:
                </h4>
                <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                  {selectedPrasad.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-orange-600 dark:text-amber-400 mb-2">
                  विधि व नियम:
                </h4>
                <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                  {selectedPrasad.method.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPrasad(null)}
                  className="btn-primary text-xs py-2 px-5"
                >
                  समझ आ गया (Close)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Thekua Recipe Modal */}
        <ThekuaModal
          isOpen={thekuaModalOpen}
          onClose={() => setThekuaModalOpen(false)}
        />

      </div>
    </section>
  );
};
