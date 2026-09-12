import React, { useState, useEffect } from 'react';
import { chhathSamagriList } from '../../data/samagri';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckSquare, 
  Printer, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Filter, 
  CheckCircle, 
  Circle 
} from 'lucide-react';

export const SamagriChecklist: React.FC = () => {
  const { t } = useLanguage();
  
  // Local storage state for checked items
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_samagri_checked');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCat, setSelectedCat] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('chhath_samagri_checked', JSON.stringify(checkedIds));
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(i => i !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const resetAll = () => {
    if (window.confirm('क्या आप चेकलिस्ट को रीसेट करना चाहते हैं?')) {
      setCheckedIds([]);
    }
  };

  const categories = [
    { id: 'all', label: t.catAll },
    { id: 'puja_vessels', label: t.catVessels },
    { id: 'fruits_crops', label: t.catFruits },
    { id: 'prasad_ingredients', label: t.catPrasad },
    { id: 'rituals_sacred', label: t.catRituals }
  ];

  const filteredItems = chhathSamagriList.filter(
    item => selectedCat === 'all' || item.category === selectedCat
  );

  const completedCount = chhathSamagriList.filter(item => checkedIds.includes(item.id)).length;
  const progressPercent = Math.round((completedCount / chhathSamagriList.length) * 100);

  // Download checklist as formatted text file
  const handleDownloadText = () => {
    let content = `छठ महापर्व — संपूर्ण पूजा सामग्री चेकलिस्ट (Chhath Mahaparv)\n`;
    content += `प्रगति: ${completedCount}/${chhathSamagriList.length} सामग्री तैयार (${progressPercent}%)\n`;
    content += `--------------------------------------------------------\n\n`;

    categories.filter(c => c.id !== 'all').forEach(cat => {
      content += `[ ${cat.label} ]\n`;
      chhathSamagriList.filter(i => i.category === cat.id).forEach(item => {
        const isDone = checkedIds.includes(item.id) ? '[✓]' : '[ ]';
        content += `${isDone} ${item.name} - ${item.description}\n`;
      });
      content += `\n`;
    });

    content += `जय छठी मईया 🙏\nछठ महापर्व डिजिटल सेवा ट्रस्ट\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chhath_Puja_Samagri_Checklist.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="samagri" className="section-padding relative overflow-hidden bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="badge-saffron">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{t.samagriBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white flex items-center justify-center gap-3">
            <span>{t.samagriTitle}</span>
            <span className="inline-block text-3xl animate-diya-flicker">🪔</span>
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-200">
            {t.samagriSubtitle}
          </p>
        </div>

        {/* Progress & Action Toolbar */}
        <div className="w-full max-w-6xl mx-auto mb-8 chhath-glass p-5 rounded-2xl border border-amber-500/30 shadow-lg space-y-4 paramprik-border relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mukta font-bold text-base text-stone-900 dark:text-white">
                  {t.prepProgress} {completedCount} / {chhathSamagriList.length}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-600 dark:text-amber-300">
                  {progressPercent}%
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-300 font-mukta">
                सामग्री प्राप्त होने पर बॉक्स पर क्लिक करें। आपका चयन स्वतः सहेजा जाता है।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePrint}
                className="btn-outline-gold text-xs flex items-center gap-1.5"
                title="Print"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printBtn}</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadBtn}</span>
              </button>

              <button
                onClick={resetAll}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                title="रीसेट करें"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCat === cat.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Checklist Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print-area">
          {filteredItems.map((item) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/40 opacity-80'
                    : 'bg-white dark:bg-stone-900 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className={`font-mukta font-bold text-sm leading-snug ${
                    isChecked ? 'line-through text-stone-500 dark:text-stone-400' : 'text-stone-900 dark:text-white'
                  }`}>
                    {item.name}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-300 font-mukta mt-0.5 leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
