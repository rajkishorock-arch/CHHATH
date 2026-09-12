import React, { useState } from 'react';
import { Camera, Calendar, Image as ImageIcon, Plus, Trash2, Heart, Sparkles } from 'lucide-react';

interface MemoryItem {
  id: string;
  year: '2026' | '2025' | '2024';
  title: string;
  caption: string;
  category: 'Family' | 'Ghat' | 'Prasad' | 'Arghya' | 'Preparation';
  imageUrl: string;
  date: string;
}

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    year: '2026',
    title: 'गंगा तट पर संध्या अर्घ्य समर्पण',
    caption: 'पूरे परिवार के साथ पटना दीघा घाट पर अस्ताचलगामी सूर्य को अर्घ्य दिया। चारों तरफ तैरते दीयों का विहंगम दृश्य।',
    category: 'Arghya',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    date: '15 Nov 2026'
  },
  {
    id: 'mem-2',
    year: '2025',
    title: 'मिट्टी के चूल्हे पर बना खस्ता ठेकुआ',
    caption: 'दादीजी और माँ के हाथों से बने शुद्ध घी और गुड़ के ठेकुआ का वो दिव्य सुगंध हमेशा याद रहता है।',
    category: 'Prasad',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
    date: '27 Oct 2025'
  },
  {
    id: 'mem-3',
    year: '2024',
    title: 'सिर पर दउरा उठाए घाट की ओर प्रस्थान',
    caption: 'भैया और पिताजी के साथ सिर पर बांस का दउरा लेकर "कांच ही बांस के बहंगिया" गाते हुए घाट पहुंचे थे।',
    category: 'Family',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    date: '07 Nov 2024'
  }
];

export const MemoryAlbum: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_user_memories');
      return saved ? JSON.parse(saved) : DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('Family');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      year: selectedYear,
      title: newTitle.trim(),
      caption: newCaption.trim() || 'छठी मईया की असीम अनुकम्पा का एक पावन संस्मरण।',
      category: newCategory,
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
      date: new Date().toLocaleDateString('hi-IN')
    };

    const updated = [newMem, ...memories];
    setMemories(updated);
    localStorage.setItem('chhath_user_memories', JSON.stringify(updated));

    setNewTitle('');
    setNewCaption('');
    setNewImageUrl('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    localStorage.setItem('chhath_user_memories', JSON.stringify(updated));
  };

  const filtered = memories.filter(m => m.year === selectedYear);

  return (
    <section id="memory-album" className="section-padding relative overflow-hidden bg-stone-100 dark:bg-stone-900/50 border-t border-amber-500/20">
      <div className="container-custom max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="badge-saffron inline-flex items-center gap-1.5 mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>छठ संस्मरण मंजूषा (Digital Memory Album)</span>
            </div>
            <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 gold-foil-text">
              छठ स्मृति मंजूषा
            </h2>
            <p className="font-mukta text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              वर्ष दर वर्ष (2024, 2025, 2026...) अपने परिवार के पावन अर्घ्य, प्रसाद और घाट के संस्मरण सहेजें।
            </p>
          </div>

          {/* Year Switcher */}
          <div className="flex items-center gap-2">
            {(['2026', '2025', '2024'] as const).map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedYear === yr
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md scale-105'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-500/20'
                }`}
              >
                छठ {yr}
              </button>
            ))}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-md transition-all flex items-center gap-1 ml-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>याद जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Add Memory Modal / Form */}
        {showAddForm && (
          <form onSubmit={handleAddMemory} className="p-6 rounded-3xl bg-white dark:bg-stone-800 border border-amber-500/40 shadow-xl mb-8 space-y-3">
            <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
              छठ {selectedYear} का नया संस्मरण जोड़ें
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="शीर्षक (उदा. घाट पर संध्या अर्घ्य)..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30"
                required
              />
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as MemoryItem['category'])}
                className="px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30"
              >
                <option value="Family">परिवार (Family)</option>
                <option value="Ghat">घाट (Ghat)</option>
                <option value="Prasad">प्रसाद (Prasad)</option>
                <option value="Arghya">अर्घ्य (Arghya)</option>
                <option value="Preparation">तैयारी (Prep)</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="फोटो लिंक या यूआरएल (Image URL)..."
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30"
            />
            <textarea
              placeholder="इस स्मृति के बारे में कुछ शब्द लिखें..."
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs rounded-xl bg-stone-100 dark:bg-stone-900 border border-amber-500/30"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-1.5 text-xs text-stone-500 hover:text-stone-800"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-1.5 text-xs font-bold bg-amber-500 text-stone-950 rounded-xl"
              >
                सुरक्षित सहेजें
              </button>
            </div>
          </form>
        )}

        {/* Memories Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(mem => (
            <div
              key={mem.id}
              className="group rounded-3xl bg-white dark:bg-stone-800/80 border border-amber-500/25 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-stone-900">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                  {mem.category}
                </div>
                <button
                  onClick={() => handleDelete(mem.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-stone-300 hover:text-red-400 transition-colors"
                  title="हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>{mem.date}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">छठ {mem.year}</span>
                </div>
                <h4 className="font-rozha text-lg font-bold text-stone-900 dark:text-stone-100">
                  {mem.title}
                </h4>
                <p className="font-mukta text-xs text-stone-600 dark:text-stone-300 line-clamp-3">
                  {mem.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-stone-800/50 border border-dashed border-amber-500/30">
            <ImageIcon className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
            <h3 className="font-rozha text-xl font-bold text-stone-800 dark:text-stone-200">
              छठ {selectedYear} का कोई संस्मरण अभी नहीं जुड़ा है
            </h3>
            <p className="font-mukta text-xs text-stone-500 mt-1">
              "याद जोड़ें" बटन पर क्लिक करके अपने परिवार के पावन क्षण सहेजें।
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
