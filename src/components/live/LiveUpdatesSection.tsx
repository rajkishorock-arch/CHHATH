import React, { useState } from 'react';
import { liveUpdatesData } from '../../data/liveUpdates';
import { Radio, AlertCircle, Train, Car, CloudSun, ShieldCheck, Clock } from 'lucide-react';
import { LiveUpdate } from '../../types';

export const LiveUpdatesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Ghat Preparation', 'Train Special', 'Traffic', 'Weather'];

  const filteredUpdates = liveUpdatesData.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  const getCategoryIcon = (category: LiveUpdate['category']) => {
    switch (category) {
      case 'Ghat Preparation':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'Train Special':
        return <Train className="w-4 h-4 text-blue-500" />;
      case 'Traffic':
        return <Car className="w-4 h-4 text-amber-500" />;
      case 'Weather':
        return <CloudSun className="w-4 h-4 text-sky-500" />;
      default:
        return <Radio className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <section id="live-updates" className="section-padding bg-gradient-to-b from-transparent via-amber-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
            <span>लाइव बुलेटिन एवं प्रशासनिक सूचनाएं</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            छठ महापर्व 2026 लाइव अपडेट्स 📰
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            घाटों की तैयारी, विशेष पूजा स्पेशल ट्रेनें, मौसम एवं यातायात नियंत्रण की आधिकारिक व प्रामाणिक जानकारी।
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
              }`}
            >
              {cat === 'All' ? 'सभी अपडेट्स' : cat}
            </button>
          ))}
        </div>

        {/* Updates Feed */}
        <div className="w-full max-w-5xl mx-auto space-y-4">
          {filteredUpdates.map((item) => (
            <div
              key={item.id}
              className={`chhath-card p-5 sm:p-6 border transition-all ${
                item.urgent 
                  ? 'border-red-500/40 bg-red-500/5 shadow-md' 
                  : 'border-amber-500/20 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800">
                    {getCategoryIcon(item.category)}
                  </span>
                  <span className="text-xs font-bold text-orange-600 dark:text-amber-400">
                    {item.category}
                  </span>
                  {item.urgent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                      अति-महत्वपूर्ण
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mukta">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              <h3 className="font-mukta font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 mb-2">
                {item.title}
              </h3>

              <p className="font-mukta text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                {item.details}
              </p>

              <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-xs text-stone-500 font-mukta">
                <span>पुष्टीकृत स्रोत: <strong className="text-stone-700 dark:text-stone-300">{item.verifiedSource}</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>प्रमाणित सूचना</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
