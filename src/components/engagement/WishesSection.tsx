import React, { useState } from 'react';
import { useChhathData } from '../../context/ChhathDataContext';
import { GreetingGenerator } from './GreetingGenerator';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Copy, Check, Share2, Sparkles, MessageCircle } from 'lucide-react';
import { WishItem } from '../../types';

export const WishesSection: React.FC = () => {
  const { t } = useLanguage();
  const { wishes } = useChhathData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'सभी संदेश (All)' },
    { id: 'bhojpuri', label: 'भोजपुरी बधाई' },
    { id: 'maithili', label: 'मैथिली शुभकामना' },
    { id: 'hindi', label: 'हिंदी संदेश' },
    { id: 'whatsapp', label: 'WhatsApp स्टेटस' },
    { id: 'instagram', label: 'Instagram कैप्शंस' },
    { id: 'short', label: 'लघु संदेश' }
  ];

  const filteredWishes = wishes.filter(
    w => activeCategory === 'all' || w.category === activeCategory
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text + '\n\n— via chhathmahaparv.org')}`;
    window.open(url, '_blank');
  };

  return (
    <section id="wishes" className="py-8 bg-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold font-mukta">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>{t.wishesBadge}</span>
          </div>
          <h2 className="font-rozha text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {t.wishesTitle}
          </h2>
          <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {t.wishesSubtitle}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-xs font-extrabold ring-1 ring-amber-400'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Wishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-8">
          {filteredWishes.map((item: WishItem) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all relative group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-orange-600 dark:text-amber-400 mb-3">
                    <span className="capitalize px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                      {item.authorNote || item.category}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 opacity-60" />
                  </div>

                  <p className="font-mukta text-sm sm:text-base text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed mb-4">
                    {item.text}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(item.text, item.id)}
                    className="flex-1 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-orange-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>कॉपी करें</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleWhatsApp(item.text)}
                    className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="WhatsApp पर भेजें"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Digital Greeting Card Maker */}
        <GreetingGenerator />

      </div>
    </section>
  );
};
