import React, { useState } from 'react';
import { chhathKathaStories } from '../../data/katha';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Sparkles, Heart, ChevronRight } from 'lucide-react';

export const ChhathKatha: React.FC = () => {
  const { t } = useLanguage();
  const [activeKathaIdx, setActiveKathaIdx] = useState(0);
  const currentKatha = chhathKathaStories[activeKathaIdx];

  return (
    <section id="katha" className="section-padding bg-gradient-to-b from-transparent via-amber-500/5 to-transparent relative overflow-hidden">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.kathaBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
            {t.kathaTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-300">
            {t.kathaSubtitle}
          </p>
        </div>

        {/* Story Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {chhathKathaStories.map((katha, idx) => (
            <button
              key={katha.id}
              onClick={() => setActiveKathaIdx(idx)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeKathaIdx === idx
                  ? 'bg-orange-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
              }`}
            >
              <span>{katha.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Selected Story Reader Card */}
        <div className="chhath-card p-6 sm:p-10 w-full max-w-5xl mx-auto border-amber-500/30 shadow-2xl relative">
          
          <div className="space-y-6">
            
            {/* Story Header */}
            <div className="border-b border-amber-500/20 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-amber-400">
                {currentKatha.category}
              </span>
              <h3 className="font-rozha text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-bold mt-1">
                {currentKatha.title}
              </h3>
            </div>

            {/* Story Body Paragraphs */}
            <div className="space-y-4 font-mukta text-stone-700 dark:text-stone-200 text-base sm:text-lg leading-relaxed">
              {currentKatha.story.map((para, pIdx) => (
                <p key={pIdx} className="text-justify">
                  {para}
                </p>
              ))}
            </div>

            {/* Moral & Rituals Link Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-500/20">
              
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-bold text-orange-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>आध्यात्मिक संदेश व सीख:</span>
                </span>
                <p className="text-xs font-mukta text-stone-700 dark:text-stone-300 leading-normal">
                  {currentKatha.moral}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-1">
                <span className="text-xs font-bold text-orange-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>वर्तमान अनुष्ठान से संबंध:</span>
                </span>
                <p className="text-xs font-mukta text-stone-700 dark:text-stone-300 leading-normal">
                  {currentKatha.ritualsLink}
                </p>
              </div>

            </div>

            {/* Next Story Switcher */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveKathaIdx((activeKathaIdx + 1) % chhathKathaStories.length)}
                className="text-xs font-bold text-orange-600 dark:text-amber-400 hover:text-orange-700 flex items-center gap-1"
              >
                <span>अगली पावन कथा पढ़ें</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
