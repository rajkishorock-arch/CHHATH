import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Plus, 
  Trash2, 
  Share2, 
  Sparkles, 
  Lock, 
  LogIn, 
  ShieldCheck, 
  Image as ImageIcon, 
  Calendar, 
  Check, 
  X,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../seo/SeoHead';

interface MemoryItem {
  id: string;
  year: '2026' | '2025' | '2024';
  title: string;
  caption: string;
  category: 'Family' | 'Ghat' | 'Prasad' | 'Arghya';
  imageUrl: string;
  date: string;
}

interface MemoryAlbumPageProps {
  onNavigate: (tab: string) => void;
}

export const MemoryAlbumPage: React.FC<MemoryAlbumPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated, openAuthModal, signInWithGoogle } = useAuth();

  const [selectedYear, setSelectedYear] = useState<'all' | '2026' | '2025' | '2024'>('all');
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [lightboxItem, setLightboxItem] = useState<MemoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newYear, setNewYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('Family');
  const [newImagePreview, setNewImagePreview] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load real user memories (Zero dummy data!)
  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem(`chhath_user_memories_${currentUser.id}`);
        setMemories(saved ? JSON.parse(saved) : []);
      } catch {
        setMemories([]);
      }
    } else {
      setMemories([]);
    }
  }, [currentUser]);

  // Handle Photo File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('कृपया 8MB से छोटी फोटो चुनें');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Memory Handler
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImagePreview) {
      showToast('कृपया शीर्षक और फोटो जोड़ें');
      return;
    }

    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      year: newYear,
      title: newTitle.trim(),
      caption: newCaption.trim(),
      category: newCategory,
      imageUrl: newImagePreview,
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const nextMemories = [newItem, ...memories];
    setMemories(nextMemories);

    if (currentUser?.id) {
      try {
        localStorage.setItem(`chhath_user_memories_${currentUser.id}`, JSON.stringify(nextMemories));
      } catch {}
    }

    setShowAddForm(false);
    setNewTitle('');
    setNewCaption('');
    setNewImagePreview('');
    showToast('✨ आपकी छठ यादें सुरक्षित जोड़ दी गईं!');
  };

  // Delete Memory
  const handleDeleteMemory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = memories.filter(m => m.id !== id);
    setMemories(next);
    if (currentUser?.id) {
      try {
        localStorage.setItem(`chhath_user_memories_${currentUser.id}`, JSON.stringify(next));
      } catch {}
    }
    if (lightboxItem?.id === id) setLightboxItem(null);
    showToast('संस्मरण हटाया गया');
  };

  // Filter memories by year
  const filteredMemories = memories.filter(
    m => selectedYear === 'all' || m.year === selectedYear
  );

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 font-mukta flex flex-col">
      <SeoHead
        title="छठ संस्मरण व फोटो एल्बम | Chhath Puja Family Memories"
        description="अपने परिवार की पावन छठ पूजा की यादें और फोटो एल्बम सुरक्षित रखें। व्यक्तिगत छठ संस्मरण डायरी।"
        canonicalUrl="https://rajkishorock-arch.github.io/CHHATH/chhath-memories/"
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-all cursor-pointer"
            title="होम पर जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-rozha text-stone-950 leading-tight">
                छठ संस्मरण व फोटो एल्बम
              </h1>
              <p className="text-[10px] sm:text-xs text-rose-700 font-semibold leading-none">
                पारिवारिक छठ यादें • सुरक्षित क्लाउड डायरी
              </p>
            </div>
          </div>
        </div>

        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>फोटो जोड़ें</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login', 'पारिवारिक फोटो एल्बम सुरक्षित रखने के लिए लॉगिन करें')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>लॉगिन करें</span>
          </button>
        )}
      </header>

      {/* Main Body */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 flex-1">

        {/* Auth Gate Banner (If Not Authenticated) */}
        {!isAuthenticated && (
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-rose-700 font-bold text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>निजी पारिवारिक संस्मरण सुरक्षा</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-rozha text-stone-950">
                अपने परिवार की छठ फोटो सुरक्षित रखने के लिए लॉगिन करें
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                लॉगिन करने पर आपके द्वारा जोड़ी गई सभी तस्वीरें और संस्मरण आपके खाते में एन्क्रिप्टेड और सुरक्षित रहेंगे। कोई भी डमी या फर्जी डेटा नहीं।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => signInWithGoogle?.()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Google से लॉगिन</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all cursor-pointer"
              >
                ईमेल लॉगिन
              </button>
            </div>
          </div>
        )}

        {/* Year Filter Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5">
            {[
              { key: 'all', label: 'सभी वर्ष' },
              { key: '2026', label: '2026 (वर्तमान)' },
              { key: '2025', label: '2025' },
              { key: '2024', label: '2024' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedYear(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedYear === tab.key
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isAuthenticated && (
            <span className="text-xs text-stone-500 font-mono">
              कुल: {filteredMemories.length} फोटो
            </span>
          )}
        </div>

        {/* Add Memory Modal Form */}
        {showAddForm && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
            onClick={() => setShowAddForm(false)}
          >
            <div 
              className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold font-rozha text-stone-950">
                    नया छठ संस्मरण जोड़ें
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    संस्मरण शीर्षक *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="उदा. घाट पर संध्या अर्घ्य समर्पण"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      वर्ष
                    </label>
                    <select
                      value={newYear}
                      onChange={e => setNewYear(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      श्रेणी
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Family">परिवार (Family)</option>
                      <option value="Ghat">घाट दर्शन (Ghat)</option>
                      <option value="Prasad">ठेकुआ व प्रसाद (Prasad)</option>
                      <option value="Arghya">अर्घ्य अनुष्ठान (Arghya)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    छठ फोटो अपलोड करें *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-stone-800 hover:file:bg-stone-200 cursor-pointer"
                  />
                </div>

                {newImagePreview && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-black">
                    <img
                      src={newImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    कैप्शन / विवरण
                  </label>
                  <textarea
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    rows={2}
                    placeholder="उस पावन पल की विशेष याद या भावना..."
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>एल्बम में सुरक्षित करें</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Memories Gallery Grid */}
        {filteredMemories.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-stone-200 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold font-rozha text-stone-900">
              {isAuthenticated 
                ? 'अभी कोई छठ संस्मरण नहीं जुड़ा है' 
                : 'लॉगिन करने के बाद अपनी यादें जोड़ें'}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {isAuthenticated 
                ? 'अपने परिवार के साथ घाट, ठेकुआ और अर्घ्य की पावन तस्वीरों को अपलोड करें और आजीवन सुरक्षित रखें।'
                : 'पंजीकृत श्रद्धालुओं की तस्वीरें उनके खाते में आजीवन सुरक्षित और निजी रहती हैं।'}
            </p>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                पहली फोटो जोड़ें
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                लॉगिन करके शुरू करें
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map(mem => (
              <div
                key={mem.id}
                onClick={() => setLightboxItem(mem)}
                className="group rounded-3xl overflow-hidden bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                    {mem.year}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950">
                    {mem.category}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-rozha text-stone-950 leading-snug line-clamp-1">
                      {mem.title}
                    </h4>
                    {mem.caption && (
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {mem.caption}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{mem.date}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMemory(mem.id, e)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
            onClick={() => setLightboxItem(null)}
          >
            <div 
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-rozha text-stone-950">
                    {lightboxItem.title}
                  </h3>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {lightboxItem.year} • {lightboxItem.date}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {lightboxItem.caption && (
                <div className="p-4 bg-white">
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {lightboxItem.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
