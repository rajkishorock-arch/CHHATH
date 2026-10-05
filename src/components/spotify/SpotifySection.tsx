import React, { useState, useRef } from 'react';
import { 
  Play, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Music2, 
  Disc3, 
  Radio, 
  Flame, 
  ArrowRight, 
  Share2, 
  SlidersHorizontal
} from 'lucide-react';

const YouTubeIcon = ({ className = "w-4 h-4 text-red-500" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export interface SpotifyItem {
  id: string;
  spotifyId: string;
  type: 'track' | 'playlist' | 'album' | 'artist';
  title: string;
  artist: string;
  category: 'sharda' | 'traditional' | 'hits2026' | 'jukebox';
  categoryLabel: string;
  coverImage: string;
  duration?: string;
  description: string;
}

export const CHHATH_SPOTIFY_ITEMS: SpotifyItem[] = [
  // 1. Sharda Sinha Classics
  {
    id: 'sp_pahile_pahil',
    spotifyId: '7HzEWIEFd2xPNJFUM7DPkM',
    type: 'track',
    title: 'पहिले पहिल छठी मईया (Pahile Pahil Chhathi Maiya)',
    artist: 'शारदा सिन्हा (Sharda Sinha)',
    category: 'sharda',
    categoryLabel: 'शारदा सिन्हा स्पेशल',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    duration: '6:12',
    description: 'छठ महापर्व का अमर महागीत, जो हर व्रती के हृदय में भक्ति का रस घोलता है।'
  },
  {
    id: 'sp_kelwa_ke_paat',
    spotifyId: '4SMf3Ip4Nhzrf1EutQEnel',
    type: 'track',
    title: 'केलवा के पात पर उगेलन सुरुज देव (Kelwa Ke Paat Par)',
    artist: 'शारदा सिन्हा (Sharda Sinha)',
    category: 'sharda',
    categoryLabel: 'शारदा सिन्हा स्पेशल',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    duration: '5:45',
    description: 'भगवान भुवन भास्कर की वंदना एवं अर्घ्य समर्पण का पावन पारंपरिक गीत।'
  },
  {
    id: 'sp_sharda_artist_hub',
    spotifyId: '068pP6E5hP91X64yYp3J2p',
    type: 'artist',
    title: 'शारदा सिन्हा संपूर्ण छठ भक्ति जूकबॉक्स',
    artist: 'शारदा सिन्हा (Sharda Sinha)',
    category: 'sharda',
    categoryLabel: 'शारदा सिन्हा स्पेशल',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&q=80',
    duration: 'ऑल-टाइम हिट्स',
    description: 'बिहार कोकिला शारदा सिन्हा जी के समस्त छठ भजनों का आधिकारिक ऑडियो संग्रह।'
  },

  // 2. Traditional & Devotional
  {
    id: 'sp_traditional_album',
    spotifyId: '5WMHOpzLRKlrEHonaR6pT5',
    type: 'album',
    title: 'छठ पूजा के पारंपरिक पावन गीत (Chhath Pooja Ke Geet)',
    artist: 'अनुराधा पौडवाल व पारंपरिक गायक',
    category: 'traditional',
    categoryLabel: 'पारंपरिक व अमर भजन',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
    duration: 'एल्बम (पूर्ण)',
    description: 'कांच ही बांस के बहंगिया, कांच के करुआ सहित समस्त पारंपरिक छठ अनुष्ठान भजन।'
  },

  // 3. Pawan Singh & 2026 Hits
  {
    id: 'sp_ghatiye_swarg',
    spotifyId: '1smQjF4EVqZLKNpXYlufih',
    type: 'track',
    title: 'घटिये स्वर्ग लागेला (Ghatiye Swarg Lagela)',
    artist: 'पवन सिंह (Pawan Singh)',
    category: 'hits2026',
    categoryLabel: '2026 सुपरहिट',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    duration: '4:30',
    description: 'गंगा घाट की दिव्य आभा व भक्ति भावना को समर्पित आधुनिक सुपरहिट छठ गीत।'
  },
  {
    id: 'sp_daura_le_chali',
    spotifyId: '1nIMq0qKDeYqpOcU9lU77k',
    type: 'track',
    title: 'दौरा ले चलीं घाटे (Daura Le Chali Ghate)',
    artist: 'जितेंद्र प्रेमी (Jitendra Premi)',
    category: 'hits2026',
    categoryLabel: '2026 सुपरहिट',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    duration: '4:52',
    description: 'सिर पर दउरा लेकर घाट प्रस्थान के समय की पावन श्रद्धा का मधुर चित्रण।'
  }
];

interface SpotifySectionProps {
  onNavigate?: (tab: string) => void;
}

export const SpotifySection: React.FC<SpotifySectionProps> = ({ onNavigate }) => {
  const [selectedItem, setSelectedItem] = useState<SpotifyItem>(CHHATH_SPOTIFY_ITEMS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [customError, setCustomError] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  // Category filters
  const categories = [
    { id: 'all', label: 'सभी संग्रह' },
    { id: 'sharda', label: 'शारदा सिन्हा स्पेशल' },
    { id: 'traditional', label: 'पारंपरिक व अमर भजन' },
    { id: 'hits2026', label: '2026 सुपरहिट' }
  ];

  // Filter items based on category and search query
  const filteredItems = CHHATH_SPOTIFY_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectItem = (item: SpotifyItem) => {
    setSelectedItem(item);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Helper to parse custom Spotify URLs
  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);
    if (!customUrlInput.trim()) return;

    try {
      const match = customUrlInput.match(/spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
      if (match) {
        const type = match[1] as 'track' | 'playlist' | 'album' | 'artist';
        const id = match[2];
        const customItem: SpotifyItem = {
          id: `custom_${id}`,
          spotifyId: id,
          type,
          title: `Spotify कस्टम ${type === 'track' ? 'गीत' : type === 'playlist' ? 'प्लेलिस्ट' : type === 'album' ? 'एल्बम' : 'कलाकार'}`,
          artist: 'कस्टम चयनित Spotify ऑडियो',
          category: 'traditional',
          categoryLabel: 'कस्टम',
          coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
          description: 'आपके द्वारा इनपुट किया गया Spotify ऑडियो, जो इन-ऐप बज रहा है।'
        };
        setSelectedItem(customItem);
        setCustomUrlInput('');
      } else {
        setCustomError('अमान्य लिंक। कृपया वैध Spotify URL दर्ज करें (जैसे: open.spotify.com/track/...)');
      }
    } catch {
      setCustomError('Spotify लिंक लोड करने में समस्या आई।');
    }
  };

  const isExpandedPlayer = selectedItem.type === 'playlist' || selectedItem.type === 'album' || selectedItem.type === 'artist';

  return (
    <div className="container-custom max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-6 animate-in fade-in duration-300 font-mukta">
      
      {/* ========================================================
          TOP MODE SWITCHER: YouTube Music vs Spotify Music
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-stone-900/60 dark:bg-stone-950/80 border border-stone-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1DB954] flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/20 shrink-0">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.467-1.027.25-2.815-1.72-6.358-2.108-10.533-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.568-1.043 8.49-.607 11.645 1.339.353.217.467.674.25 1.027zm1.467-3.26c-.272.443-.847.585-1.29.313-3.224-1.982-8.14-2.556-11.954-1.398-.498.151-1.028-.135-1.18-.633-.151-.498.135-1.028.633-1.18 4.364-1.324 9.778-.684 13.478 1.598.443.272.585.847.313 1.3zm.126-3.41C15.226 8.35 8.847 8.14 5.15 9.262c-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.218.75-1.398 4.24-1.288 11.285-1.045 15.748 1.604.53.315.703 1.002.388 1.533-.315.53-1.002.703-1.533.388z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>छठ महापर्व Spotify हब</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold tracking-wide">
                100% इन-ऐप प्लेयर
              </span>
            </h1>
            <p className="text-xs text-stone-400">
              यहीं ऐप में ही सुनें बिना किसी बाहरी टैब या रिडायरेक्ट के
            </p>
          </div>
        </div>

        {/* Clean Mode Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 w-full sm:w-auto justify-center">
          <button
            onClick={() => onNavigate?.('music')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-400 hover:text-white text-xs font-semibold transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
          >
            <YouTubeIcon className="w-4 h-4 text-red-500" />
            <span>यूट्यूब संगीत</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1DB954] text-black text-xs font-bold shadow-md shadow-[#1DB954]/30"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.216.353-.674.467-1.027.25-2.815-1.72-6.358-2.108-10.533-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.568-1.043 8.49-.607 11.645 1.339.353.217.467.674.25 1.027zm1.467-3.26c-.272.443-.847.585-1.29.313-3.224-1.982-8.14-2.556-11.954-1.398-.498.151-1.028-.135-1.18-.633-.151-.498.135-1.028.633-1.18 4.364-1.324 9.778-.684 13.478 1.598.443.272.585.847.313 1.3zm.126-3.41C15.226 8.35 8.847 8.14 5.15 9.262c-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.218.75-1.398 4.24-1.288 11.285-1.045 15.748 1.604.53.315.703 1.002.388 1.533-.315.53-1.002.703-1.533.388z"/>
            </svg>
            <span>Spotify (सक्रिय)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          ACTIVE IN-APP SPOTIFY PLAYER WIDGET
         ======================================================== */}
      <div 
        ref={playerRef}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-black border border-[#1DB954]/30 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1DB954]" />
            </span>
            <h2 className="text-white text-sm sm:text-base font-bold">
              अब बज रहा है: <span className="text-[#1DB954]">{selectedItem.title}</span>
            </h2>
          </div>
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline-block">
            {selectedItem.artist}
          </span>
        </div>

        {/* The Official Spotify Interactive Embed iFrame */}
        <div className="relative rounded-2xl overflow-hidden bg-black/60 shadow-inner border border-stone-800">
          <iframe
            key={`${selectedItem.type}-${selectedItem.spotifyId}`}
            src={`https://open.spotify.com/embed/${selectedItem.type}/${selectedItem.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height={isExpandedPlayer ? 352 : 152}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full transition-all duration-300"
            title={`Spotify Player - ${selectedItem.title}`}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400 pt-1">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
            <span>{selectedItem.description}</span>
          </p>
          <span className="text-[11px] text-stone-500 shrink-0">
            प्ले बटन दबाएं व इन-ऐप ऑडियो का आनंद लें
          </span>
        </div>
      </div>

      {/* ========================================================
          SEARCH & CATEGORIES FILTER BAR
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Spotify छठ गीत या गायक खोजें..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-900/60 dark:bg-stone-950/80 border border-stone-800 focus:border-[#1DB954] text-white text-xs placeholder:text-stone-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Custom Link Ingest Form */}
          <form onSubmit={handleLoadCustomUrl} className="flex gap-2">
            <input
              type="text"
              value={customUrlInput}
              onChange={(e) => {
                setCustomUrlInput(e.target.value);
                setCustomError(null);
              }}
              placeholder="कोई भी Spotify लिंक पेस्ट करें..."
              className="w-48 sm:w-60 px-3 py-2.5 rounded-2xl bg-stone-900/60 dark:bg-stone-950/80 border border-stone-800 focus:border-[#1DB954] text-white text-xs placeholder:text-stone-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] text-xs font-bold transition-all border border-[#1DB954]/40 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              चलाएं
            </button>
          </form>
        </div>

        {customError && (
          <p className="text-red-400 text-xs px-2 animate-in fade-in">
            {customError}
          </p>
        )}

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1DB954] text-black font-bold shadow-md shadow-[#1DB954]/25'
                  : 'bg-stone-900/60 dark:bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          CURATED CHHATH SPOTIFY ITEMS BENTO GRID
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const isCurrent = selectedItem.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isCurrent
                  ? 'bg-stone-900/90 border-[#1DB954] ring-2 ring-[#1DB954]/30 shadow-xl'
                  : 'bg-stone-900/50 hover:bg-stone-900/80 border-stone-800/80 hover:border-[#1DB954]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Artwork Thumbnail */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md bg-stone-800">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      isCurrent
                        ? 'bg-black/50 opacity-100'
                        : 'bg-black/30 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#1DB954] font-semibold mb-1">
                    {item.categoryLabel}
                  </span>
                  <h3
                    className={`font-semibold text-xs sm:text-sm line-clamp-1 leading-snug transition-colors ${
                      isCurrent ? 'text-[#1DB954] font-bold' : 'text-stone-100 group-hover:text-[#1DB954]'
                    }`}
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 truncate mt-0.5">
                    {item.artist}
                  </p>
                  {item.duration && (
                    <span className="text-[10px] text-stone-500 font-mono mt-1 inline-block">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Quick Play Bar */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 group-hover:text-stone-300">
                  {isCurrent ? 'वर्तमान में लोड किया हुआ' : 'प्लेयर में चलाएं'}
                </span>
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#1DB954] text-black'
                      : 'bg-white/5 hover:bg-[#1DB954] text-stone-300 hover:text-black'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isCurrent ? 'सक्रिय' : 'चलाएं'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 px-4 rounded-3xl bg-stone-900/50 border border-stone-800 space-y-3">
          <Music2 className="w-10 h-10 text-stone-500 mx-auto" />
          <h3 className="font-bold text-stone-200 text-sm">कोई परिणाम नहीं मिला</h3>
          <p className="text-xs text-stone-400">कृपया दूसरा नाम खोजें या कोई Spotify लिंक ऊपर पेस्ट करें।</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="px-4 py-2 rounded-full bg-[#1DB954] text-black font-bold text-xs shadow-md"
          >
            सभी गीत दिखाएं
          </button>
        </div>
      )}

      {/* ========================================================
          BENEFITS & INFO CARD
         ======================================================== */}
      <div className="p-4 rounded-3xl bg-stone-900/40 border border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
          <span>
            Spotify प्लेयर बिना ऐप से बाहर जाए यहीं ऐप में चलता है। यह यूट्यूब सेटिंग्स व प्लेयर को प्रभावित नहीं करता।
          </span>
        </div>
        <button
          onClick={() => onNavigate?.('music')}
          className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 shrink-0"
        >
          <span>यूट्यूब संगीत पर लौटें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
