import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Image as ImageIcon, Plus, Trash2, Heart, Sparkles, MapPin, ArrowRight, BookOpen, Download } from 'lucide-react';
import { SAMPLE_SHOWCASE_MEMORIES, type MemoryItem } from '../pages/MemoryAlbumPage';

export const MemoryAlbum: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'all' | '2026' | '2025' | '2024'>('all');
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_user_memories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_SHOWCASE_MEMORIES;
    } catch {
      return SAMPLE_SHOWCASE_MEMORIES;
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('Family');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newGhat, setNewGhat] = useState('');

  const handleOpenStudioPage = () => {
    window.location.hash = '#chhath-memories';
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      year: selectedYear === 'all' ? '2026' : selectedYear,
      title: newTitle.trim(),
      caption: newCaption.trim() || 'छठी मईया की असीम अनुकम्पा का एक पावन संस्मरण।',
      category: newCategory,
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      date: new Date().toLocaleDateString('hi-IN'),
      ghatLocation: newGhat.trim() || 'गंगा घाट, पटना',
      riverName: 'माँ गंगा',
      shlokaTag: 'ॐ सूर्याय नमः',
      createdAt: new Date().toISOString()
    };

    const updated = [newMem, ...memories];
    setMemories(updated);
    try {
      localStorage.setItem('chhath_user_memories', JSON.stringify(updated));
    } catch {}

    setNewTitle('');
    setNewCaption('');
    setNewImageUrl('');
    setNewGhat('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    try {
      localStorage.setItem('chhath_user_memories', JSON.stringify(updated));
    } catch {}
  };

  const filtered = memories.filter(m => selectedYear === 'all' || m.year === selectedYear);

  return (
    <section id="memory-album" className="relative overflow-hidden bg-stone-50 dark:bg-stone-900/60 border border-amber-500/20 rounded-3xl p-4 sm:p-7 shadow-lg">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Open Dedicated Studio Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1.5 border border-amber-500/30">
              <Camera className="w-3.5 h-3.5" />
              <span>छठ संस्मरण मंजूषा (Digital Memory Studio)</span>
            </div>
            <h2 className="font-rozha text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
              छठ स्मृति ग्रन्थ व फोटो एल्बम
            </h2>
            <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
              वर्ष दर वर्ष (2024, 2025, 2026...) अपने परिवार के पावन अर्घ्य, प्रसाद और घाट के संस्मरण सहेजें।
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenStudioPage}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>पूरा समर्पित पेज खोलें</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>याद जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Year Filter Switcher */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            {[
              { key: 'all', label: 'सभी वर्ष' },
              { key: '2026', label: '2026' },
              { key: '2025', label: '2025' },
              { key: '2024', label: '2024' }
            ].map(yr => (
              <button
                key={yr.key}
                onClick={() => setSelectedYear(yr.key as any)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedYear === yr.key
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                }`}
              >
                {yr.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-stone-500 font-mono">
            कुल: {filtered.length} संस्मरण
          </span>
        </div>

        {/* Add Memory Form */}
        {showAddForm && (
          <form onSubmit={handleAddMemory} className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/40 shadow-xl space-y-3.5 text-left">
            <div className="flex items-center justify-between">
              <h4 className="font-rozha text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                नया पारिवारिक संस्मरण जोड़ें
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                बंद करें ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="शीर्षक (उदा. घाट पर संध्या अर्घ्य)..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Family">परिवार (Family)</option>
                <option value="Ghat">घाट (Ghat)</option>
                <option value="Prasad">प्रसाद (Prasad)</option>
                <option value="Arghya">अर्घ्य (Arghya)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="फोटो लिंक या यूआरएल (Image URL)..."
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="पवित्र घाट (उदा. दीघा घाट, पटना)..."
                value={newGhat}
                onChange={e => setNewGhat(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <textarea
              placeholder="इस स्मृति के बारे में कुछ शब्द लिखें..."
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              rows={2}
              className="w-full p-3 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                सुरक्षित सहेजें
              </button>
            </div>
          </form>
        )}

        {/* Memories Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(mem => (
            <div
              key={mem.id}
              onClick={handleOpenStudioPage}
              className="group rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:shadow-xl transition-all duration-300 overflow-hidden shadow-xs cursor-pointer flex flex-col text-left"
            >
              <div className="relative aspect-video overflow-hidden bg-stone-950">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                  {mem.category}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-extrabold">
                  छठ {mem.year}
                </div>
                {mem.ghatLocation && (
                  <div className="absolute bottom-2 left-2 text-[10px] text-amber-200 font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span className="truncate max-w-[180px]">{mem.ghatLocation}</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-rozha text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {mem.title}
                  </h4>
                  <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                    {mem.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{mem.date}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 group-hover:underline">
                    विस्तार से देखें →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link to Full Studio */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-mukta">
              <strong>अधिक प्रीमियम सुविधाएं:</strong> 3D स्मृति ग्रन्थ फ्लिपबुक, वैदिक फोटो फ्रेम लैब, दादी-माँ का ऑडियो रिकॉर्डर और A4 स्मृति पत्रिका प्रिंट।
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenStudioPage}
            className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-extrabold text-xs shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            स्टूडियो खोलें →
          </button>
        </div>

      </div>
    </section>
  );
};
