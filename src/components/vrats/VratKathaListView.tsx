import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronRight, Sparkles, Filter, ArrowLeft } from 'lucide-react';
import { ALL_VRATS_DATA, VratItem } from '../../data/allVratsData';
import { VratDetailModal } from './VratDetailModal';

interface VratKathaListViewProps {
  onBack?: () => void;
  onOpenAarti?: (title: string) => void;
}

export const VratKathaListView: React.FC<VratKathaListViewProps> = ({ onBack, onOpenAarti }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVrat, setSelectedVrat] = useState<VratItem | null>(null);

  const filteredKathas = useMemo(() => {
    return ALL_VRATS_DATA.filter(item => {
      const matchSearch =
        item.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vratKatha.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-amber-600" />
                संपूर्ण व्रत कथा संग्रह
              </h1>
              <p className="text-xs text-gray-500">समस्त सनातन व्रत एवं पावन पौराणिक कथाएं</p>
            </div>
          </div>
          <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            {filteredKathas.length} कथाएं
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="व्रत कथा, देवता या पर्व का नाम खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 p-1"
              >
                हटाएं
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-5xl mx-auto px-4 pb-3 overflow-x-auto no-scrollbar flex items-center space-x-2">
          {[
            { id: 'all', label: 'सभी कथाएं' },
            { id: 'major', label: 'महापर्व कथा' },
            { id: 'goddess', label: 'देवी व्रत कथा' },
            { id: 'shiva', label: 'शिव व्रत कथा' },
            { id: 'vishnu', label: 'श्री हरि व्रत कथा' },
            { id: 'monthly', label: 'मासिक व्रत कथा' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Katha Cards List */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filteredKathas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">कोई व्रत कथा नहीं मिली</h3>
            <p className="text-xs text-gray-500 mt-1">कृपया अन्य नाम या शब्द लिखकर खोजें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKathas.map(vrat => (
              <div
                key={vrat.id}
                onClick={() => setSelectedVrat(vrat)}
                className="group p-5 bg-white rounded-3xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {vrat.month} • {vrat.tithi}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-amber-600 transition-colors flex items-center font-medium">
                      पढ़ें <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-gray-900 group-hover:text-amber-600 transition-colors">
                    {vrat.vratKatha.title}
                  </h3>
                  <p className="text-xs font-medium text-amber-700 mt-0.5">
                    देवता: {vrat.deity}
                  </p>

                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed font-serif">
                    {vrat.vratKatha.story}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center text-amber-800/80 font-medium line-clamp-1 text-[11px]">
                    <Sparkles className="w-3 h-3 mr-1 text-amber-500 shrink-0" />
                    {vrat.vratKatha.moral.substring(0, 48)}...
                  </span>
                  <span className="font-semibold text-amber-600 text-[11px] shrink-0 ml-2">
                    पूरा पढ़ें →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Vrat Modal */}
      {selectedVrat && (
        <VratDetailModal
          vrat={selectedVrat}
          isOpen={!!selectedVrat}
          onClose={() => setSelectedVrat(null)}
          onOpenAarti={onOpenAarti}
        />
      )}
    </div>
  );
};
