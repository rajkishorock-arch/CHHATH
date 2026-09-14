import React, { useState, useEffect, useMemo } from 'react';
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
  Circle,
  Search,
  X,
  Share2,
  Calendar,
  ArrowRight,
  Flame
} from 'lucide-react';

const STORAGE_KEY = 'chhath-samagri-checklist-2026-v1';

export const SamagriChecklist: React.FC = () => {
  const { t } = useLanguage();
  
  // Local storage state for checked items
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      // Migration from old key if exists
      const oldSaved = localStorage.getItem('chhath_samagri_checked');
      if (oldSaved) {
        const oldParsed = JSON.parse(oldSaved);
        if (Array.isArray(oldParsed)) return oldParsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyRemaining, setShowOnlyRemaining] = useState<boolean>(false);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // ignore quota / permission errors
    }
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(i => i !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const resetAll = () => {
    if (window.confirm('क्या आप छठ पूजा सामग्री की चेकलिस्ट को रीसेट करना चाहते हैं? सभी टिक हटा दिए जाएंगे।')) {
      setCheckedIds([]);
    }
  };

  const categories = [
    { id: 'all', label: t.catAll || 'सभी सामग्री' },
    { id: 'puja_vessels', label: 'पूजा एवं अर्घ्य पात्र' },
    { id: 'fruits_crops', label: 'फल एवं फसल' },
    { id: 'prasad_ingredients', label: 'प्रसाद सामग्री' },
    { id: 'rituals_sacred', label: 'पावन पूजा व श्रृंगार' }
  ];

  // Calculate progress stats for each category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; checked: number }> = {};
    categories.forEach(cat => {
      const items = cat.id === 'all' 
        ? chhathSamagriList 
        : chhathSamagriList.filter(i => i.category === cat.id);
      const checked = items.filter(i => checkedIds.includes(i.id)).length;
      stats[cat.id] = { total: items.length, checked };
    });
    return stats;
  }, [checkedIds]);

  // Filter items based on search, category, and show-only-remaining
  const filteredItems = useMemo(() => {
    return chhathSamagriList.filter(item => {
      const matchesCat = selectedCat === 'all' || item.category === selectedCat;
      const matchesSearch = !searchQuery.trim() || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesRemaining = !showOnlyRemaining || !checkedIds.includes(item.id);
      return matchesCat && matchesSearch && matchesRemaining;
    });
  }, [selectedCat, searchQuery, showOnlyRemaining, checkedIds]);

  const totalCount = chhathSamagriList.length;
  const completedCount = checkedIds.filter(id => chhathSamagriList.some(item => item.id === id)).length;
  const remainingCount = totalCount - completedCount;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Download checklist as formatted text file
  const handleDownloadText = () => {
    let content = `छठ महापर्व — संपूर्ण पूजा सामग्री चेकलिस्ट 2026 (Chhath Mahaparv)\n`;
    content += `प्रगति: ${completedCount}/${totalCount} सामग्री तैयार (${progressPercent}% complete)\n`;
    content += `--------------------------------------------------------\n\n`;

    categories.filter(c => c.id !== 'all').forEach(cat => {
      content += `[ ${cat.label} ]\n`;
      chhathSamagriList.filter(i => i.category === cat.id).forEach(item => {
        const isDone = checkedIds.includes(item.id) ? '[✓]' : '[ ]';
        content += `${isDone} ${item.name} - ${item.description}\n`;
      });
      content += `\n`;
    });

    content += `जय छठी मईया 🙏\nhttps://rajkishorock-arch.github.io/CHHATH/chhath-samagri/\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chhath_Puja_Samagri_Checklist_2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Web Share or Clipboard Fallback
  const handleShare = async () => {
    const shareData = {
      title: 'छठ पूजा सामग्री चेकलिस्ट 2026',
      text: `मेरी छठ पूजा की तैयारी: ${completedCount}/${totalCount} सामग्री तैयार (${progressPercent}%)। अपनी चेकलिस्ट देखें:`,
      url: window.location.href
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
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2500);
      } catch {
        alert('लिंक कॉपी किया गया!');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="samagri" className="section-padding relative overflow-hidden bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
      <div className="container-custom max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3 print:hidden">
          <div className="badge-saffron inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
            <CheckSquare className="w-4 h-4 text-amber-500" />
            <span>इंटरैक्टिव सामग्री चेकलिस्ट 2026</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-black text-stone-900 dark:text-white flex items-center justify-center gap-3">
            <span>छठ पूजा की तैयारी</span>
            <span className="inline-block text-3xl animate-diya-flicker">🪔</span>
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-200">
            सामग्री एकत्र होने पर चेकबॉक्स पर टिक करें। आपकी प्रगति स्वतः सहेजी जाती है।
          </p>
        </div>

        {/* Smart Preparation Progress Banner */}
        <div className="w-full max-w-5xl mx-auto mb-8 p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white border border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-1">
                आपकी तैयारी की स्थिति (Preparation Status)
              </span>
              <h3 className="font-rozha text-2xl sm:text-3xl font-extrabold text-amber-200 flex items-center gap-2">
                <span>{completedCount} / {totalCount} सामग्री तैयार</span>
                <span className="text-sm font-mukta font-normal text-stone-300">({remainingCount} बाकी)</span>
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0 print:hidden">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="प्रिंट करें"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="शेयर करें"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedState ? 'लिंक कॉपी हुआ!' : 'शेयर'}</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                title="टेक्स्ट डाउनलोड"
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड</span>
              </button>

              <button
                onClick={resetAll}
                className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="रीसेट करें"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            </div>
          </div>

          {/* Accessible Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold font-mukta text-stone-300">
              <span>तैयारी की प्रगति</span>
              <span className="text-amber-400">{progressPercent}% पूर्ण</span>
            </div>
            <div className="w-full bg-stone-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-amber-500/30">
              <div
                className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="छठ सामग्री तैयारी प्रगति"
              />
            </div>
          </div>

          {/* Celebration Banner when 100% */}
          {completedCount === totalCount && (
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-center font-rozha text-lg text-amber-200 animate-bounce">
              🎉 छठ पूजा की सारी सामग्री तैयार है! जय छठी मईया! 🙏
            </div>
          )}
        </div>

        {/* Search, Filter & Toggle Toolbar */}
        <div className="w-full max-w-5xl mx-auto mb-6 bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4 print:hidden">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="samagri-search-input" className="sr-only">सामग्री खोजें</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="samagri-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="सामग्री का नाम खोजें (जैसे सूप, आटा, घी...)"
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-amber-500/30 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  aria-label="खोज साफ़ करें"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Show Only Remaining Toggle */}
            <div className="flex items-center justify-start sm:justify-end gap-2">
              <label htmlFor="show-remaining-toggle" className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800 dark:text-stone-200 select-none bg-stone-50 dark:bg-stone-800 px-3.5 py-2.5 rounded-2xl border border-amber-500/30 hover:bg-amber-500/10 transition-all">
                <input
                  id="show-remaining-toggle"
                  type="checkbox"
                  checked={showOnlyRemaining}
                  onChange={(e) => setShowOnlyRemaining(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <span>केवल बाकी (Unchecked) सामग्री दिखाएं</span>
              </label>
            </div>

          </div>

          {/* Category Filter Pills with Progress Counters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => {
              const stat = categoryStats[cat.id] || { total: 0, checked: 0 };
              const isSelected = selectedCat === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3.5 py-2 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md scale-105'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500/20 border border-amber-500/20'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/30 text-white' : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                  }`}>
                    {stat.checked}/{stat.total}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Empty State when Search/Filter yields no items */}
        {filteredItems.length === 0 && (
          <div className="w-full max-w-5xl mx-auto p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-amber-500/20 space-y-3 font-mukta">
            <Filter className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              कोई सामग्री नहीं मिली
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              कृपया अपनी खोज अथवा फ़िल्टर बदलें।
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCat('all'); setShowOnlyRemaining(false); }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
            >
              सभी फ़िल्टर साफ़ करें
            </button>
          </div>
        )}

        {/* Interactive Checklist Grid (Crawlable for Googlebot) */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-2 print:gap-2">
          {filteredItems.map((item) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <label
                key={item.id}
                htmlFor={`checkbox-${item.id}`}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none relative group ${
                  isChecked
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/40 opacity-80'
                    : 'bg-white dark:bg-stone-900 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 shadow-sm'
                }`}
              >
                {/* Native Checkbox with Accessible Semantics */}
                <div className="mt-0.5 shrink-0">
                  <input
                    id={`checkbox-${item.id}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded border-stone-300 focus:ring-2 focus:ring-amber-500"
                    aria-label={`${item.name} - ${isChecked ? 'तैयार है' : 'बाकी है'}`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-mukta font-bold text-sm leading-snug ${
                      isChecked ? 'line-through text-stone-500 dark:text-stone-400' : 'text-stone-900 dark:text-white'
                    }`}>
                      {item.name}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-300 font-mukta mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <span className="inline-block text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-1.5 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {item.category === 'puja_vessels' && 'पूजा/अर्घ्य पात्र'}
                    {item.category === 'fruits_crops' && 'फल व फसल'}
                    {item.category === 'prasad_ingredients' && 'प्रसाद सामग्री'}
                    {item.category === 'rituals_sacred' && 'पावन पूजा व श्रृंगार'}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Contextual Card: Chhath Calendar Integration */}
        <div className="w-full max-w-5xl mx-auto mt-10 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xl flex items-center justify-center shrink-0">
              🗓
            </div>
            <div>
              <h3 className="font-rozha text-xl font-bold text-stone-900 dark:text-amber-200">
                छठ 2026 की तैयारी कब-कब करें?
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-mukta">
                13 Nov (नहाय खाय) • 14 Nov (खरना) • 15 Nov (संध्या अर्घ्य) • 16 Nov (उषा अर्घ्य व पारण)
              </p>
            </div>
          </div>

          <a
            href="/CHHATH/chhath-calendar-2026/"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2 text-decoration-none shrink-0"
          >
            <span>छठ पूजा कैलेंडर 2026 देखें</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

