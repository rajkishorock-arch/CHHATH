import React, { useState, useMemo, useEffect } from 'react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Song } from '../../types';
import { 
  Music, 
  Disc, 
  ListMusic, 
  Link as LinkIcon, 
  Play, 
  Pause, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  Search, 
  Plus, 
  AlertCircle, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Radio, 
  FileText
} from 'lucide-react';

import { FeaturedSongCard } from './FeaturedSongCard';
import { MusicCategoryFilter } from './MusicCategoryFilter';
import { MusicSearch } from './MusicSearch';
import { PopularArtistsFilter } from './PopularArtistsFilter';
import { SongList } from './SongList';
import { SongLyricsModal } from './SongLyricsModal';
import { extractYoutubeId, extractPlaylistId, parseYoutubeMeta } from '../../utils/youtubeUtils';
import { getImageUrl } from '../../utils/imageUtils';
import { 
  searchYouTubeVideos, 
  convertToSongModel, 
  YouTubeSearchSong 
} from '../../services/youtubeSearchService';

export interface SongsSectionProps {
  initialQuery?: string;
}

export const SongsSection: React.FC<SongsSectionProps> = ({ initialQuery }) => {
  const { t: _t } = useLanguage();
  const { songs, addSong } = useChhathData();
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay, 
    favorites, 
    lyricsSong, 
    setLyricsSong,
    queue,
    addToQueue 
  } = useAudio();

  // Active View Tab: 'all' (curated) | 'playlists' (mega playlists) | 'customLink' (user link)
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'playlists' | 'customLink'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [selectedSinger, setSelectedSinger] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // YouTube API Real Search States: 'idle' | 'loading' | 'success' | 'no_results' | 'error'
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'success' | 'no_results' | 'error'>('idle');
  const [ytSearchResults, setYtSearchResults] = useState<YouTubeSearchSong[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // User Custom Link State
  const [userCustomLink, setUserCustomLink] = useState<string>('');
  const [userLinkLoading, setUserLinkLoading] = useState<boolean>(false);
  const [userLinkSuccess, setUserLinkSuccess] = useState<string | null>(null);

  // Execute YouTube API Search
  const handleExecuteSearch = async (query: string, token: string = '') => {
    if (!query.trim()) return;

    if (!token) {
      setSearchStatus('loading');
      setYtSearchResults([]);
      setNextPageToken(null);
      setErrorMessage(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await searchYouTubeVideos(query, token);
      setIsLiveApi(response.isLiveApi);

      if (response.results && response.results.length > 0) {
        setYtSearchResults(prev => token ? [...prev, ...response.results] : response.results);
        setNextPageToken(response.nextPageToken);
        setSearchStatus('success');
      } else {
        if (!token) {
          setYtSearchResults([]);
          setSearchStatus('no_results');
          setErrorMessage(response.error || 'कोई गाना नहीं मिला।');
        }
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchStatus('error');
      setErrorMessage(err.message || 'नेटवर्क या API त्रुटि हुई।');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchStatus('idle');
    setYtSearchResults([]);
    setNextPageToken(null);
    setErrorMessage(null);
  };

  // Sync initialQuery prop
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setSearchQuery(initialQuery.trim());
      handleExecuteSearch(initialQuery.trim());
    }
  }, [initialQuery]);

  // Listen for global custom search event dispatched from TopSongSearchBar
  useEffect(() => {
    const handleMusicSearchEvent = (e: any) => {
      const q = e.detail?.query;
      if (q && q.trim()) {
        setSearchQuery(q.trim());
        handleExecuteSearch(q.trim());
      }
    };
    window.addEventListener('chhath_music_search', handleMusicSearchEvent);
    return () => window.removeEventListener('chhath_music_search', handleMusicSearchEvent);
  }, []);

  // Inspect hash parameters on mount (e.g. #music?q=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&]q=([^&]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        if (decoded.trim() && !searchQuery) {
          setSearchQuery(decoded.trim());
          handleExecuteSearch(decoded.trim());
        }
      }
    }
  }, []);

  // Featured Song: Top Sharda Sinha or first song
  const featuredSong = useMemo(() => {
    return songs.find(s => s.singer.includes('शारदा')) || songs[0] || null;
  }, [songs]);

  // Categories list
  const categories = useMemo(() => {
    return ['सभी', 'पसंदीदा', 'पारंपरिक', 'भोजपुरी', 'मैथिली', 'अर्घ्य'];
  }, []);

  // Popular Singers list
  const popularSingers = useMemo(() => {
    const set = new Set<string>();
    songs.forEach(s => {
      if (s.singer && !s.isPlaylist) set.add(s.singer.split('/')[0].trim());
    });
    return Array.from(set).slice(0, 10);
  }, [songs]);

  // Separate regular songs vs playlists
  const regularSongs = useMemo(() => songs.filter(s => !s.isPlaylist), [songs]);
  const megaPlaylists = useMemo(() => songs.filter(s => s.isPlaylist), [songs]);

  // Filtered regular songs for local catalog with smart keyword & phonetic matching
  const filteredCatalogSongs = useMemo(() => {
    return regularSongs.filter(song => {
      if (selectedCategory === 'पसंदीदा') {
        if (!favorites.includes(song.id)) return false;
      } else if (selectedCategory !== 'सभी') {
        const catMatch = song.category === selectedCategory || song.language === selectedCategory;
        if (!catMatch) return false;
      }

      if (selectedSinger && !song.singer.includes(selectedSinger)) {
        return false;
      }

      if (searchQuery.trim() && searchStatus === 'idle') {
        const q = searchQuery.toLowerCase().trim();
        const tokens = q.split(/\s+/).filter(Boolean);
        const genericTerms = new Set(['chhath', 'chhat', 'chat', 'chhathi', 'puja', 'pooja', 'song', 'songs', 'geet', 'gane', 'gana', 'bhajan', 'bhakti', 'parv', 'mahaparv']);
        const specificTokens = tokens.filter(t => !genericTerms.has(t));

        if (specificTokens.length === 0) {
          return true;
        }

        const text = `${song.title} ${song.singer} ${song.category} ${song.language} ${song.lyricsSnippet || ''}`.toLowerCase();
        
        const aliasMap: Record<string, string[]> = {
          pawan: ['पवन', 'pawan', 'singh'],
          sharda: ['शारदा', 'sharda', 'sinha'],
          khesari: ['खेसारी', 'khesari'],
          anuradha: ['अनुराधा', 'anuradha', 'paudwal'],
          maithili: ['मैथिली', 'maithili', 'thakur'],
          kalpana: ['कल्पना', 'kalpana'],
          nirahua: ['निरहुआ', 'dinesh'],
          arghya: ['अर्घ्य', 'अरघ', 'arghya', 'aragh'],
          aragh: ['अर्घ्य', 'अरघ'],
          bahangi: ['बहंगी', 'बहंगिया'],
          kelwa: ['केलवा', 'केला'],
          thekua: ['ठेकुआ'],
          suruj: ['सुरुज', 'सूरज', 'सूर्य', 'dinanath'],
          dinanath: ['दीनानाथ', 'दिनकर']
        };

        return specificTokens.some(tok => {
          if (text.includes(tok)) return true;
          const aliases = aliasMap[tok];
          if (aliases && aliases.some(a => text.includes(a.toLowerCase()))) return true;
          return false;
        });
      }

      return true;
    });
  }, [regularSongs, selectedCategory, selectedSinger, searchQuery, favorites, searchStatus]);

  // User custom link submit
  const handlePlayUserLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = userCustomLink.trim();
    if (!url) return;

    setUserLinkLoading(true);
    const pId = extractPlaylistId(url);
    const yId = extractYoutubeId(url);

    if (!yId && !pId) {
      alert('कृपया सही यूट्यूब वीडियो या प्लेलिस्ट लिंक दर्ज करें');
      setUserLinkLoading(false);
      return;
    }

    try {
      let title = pId ? 'यूट्यूब प्लेलिस्ट' : 'छठ भक्ति गीत';
      let singer = 'यूट्यूब कलाकार';
      let thumb = yId ? `https://i.ytimg.com/vi/${yId}/hqdefault.jpg` : getImageUrl('images/daura_arghya.jpg');

      if (yId) {
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yId}&format=json`);
          if (res.ok) {
            const data = await res.json();
            const meta = parseYoutubeMeta(data.title || '', data.author_name || '', yId);
            title = meta.title;
            singer = meta.singer;
            if (data.thumbnail_url) thumb = data.thumbnail_url;
          }
        } catch {
          // Proceed with defaults
        }
      }

      const newSong: Song = {
        id: `user-track-${Date.now()}`,
        title,
        singer,
        language: 'Bhojpuri',
        category: 'Traditional',
        duration: pId ? 'प्लेलिस्ट' : '5:00',
        audioUrl: url,
        youtubeId: yId || undefined,
        playlistId: pId || undefined,
        isPlaylist: Boolean(pId),
        thumbnail: thumb
      };

      addSong(newSong);
      playSong(newSong);
      setUserCustomLink('');
      setUserLinkSuccess(`✅ "${title}" तुरंत बजना शुरू हो गया है!`);
      setTimeout(() => setUserLinkSuccess(null), 4000);
    } finally {
      setUserLinkLoading(false);
    }
  };

  return (
    <section id="songs" className="section-padding relative overflow-hidden bg-stone-950 text-stone-100 font-mukta">
      <div className="container-custom max-w-6xl mx-auto space-y-8">
        
        {/* Industry-Grade Studio Ambient Header */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/70 via-stone-900/90 to-amber-950/40 border border-amber-500/35 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>छठ पावन संगीत स्टूडियो (Live Streaming)</span>
            </div>
            <h2 className="font-rozha text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400">
              छठ महापर्व के सुप्रसिद्ध भक्ति गीत
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              शारदा सिन्हा, पवन सिंह, खेसारी लाल, अनुराधा पौडवाल एवं पारंपरिक कलाकारों के सभी गीत एक ही प्लेयर में खोजें और लाइव सुनें।
            </p>
            
            {/* Quick Studio Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs font-bold text-stone-300">
              <span className="px-3 py-1 rounded-full bg-stone-950/80 border border-amber-500/20 flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 text-amber-400" />
                <span>{regularSongs.length} क्यूरेटेड गीत</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-950/80 border border-amber-500/20 flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-orange-400" />
                <span>{megaPlaylists.length} नॉनस्टॉप प्लेलिस्ट्स</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>यूट्यूब लाइव खोज सक्रिय</span>
              </span>
            </div>
          </div>

          {/* Interactive Spinning Vinyl Disk & Live Visualizer Art */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-2 bg-gradient-to-tr from-amber-600 via-stone-800 to-amber-400 shadow-2xl shadow-amber-500/30 border-2 border-amber-500/40 flex items-center justify-center transition-transform ${
              isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
            }`}>
              <div className="w-full h-full rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shadow-inner">
                  {isPlaying ? '🎵' : '🌅'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Song Hero Banner */}
        {featuredSong && activeViewTab === 'all' && searchStatus === 'idle' && !searchQuery && (
          <FeaturedSongCard song={featuredSong} />
        )}

        {/* Navigation View Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setActiveViewTab('all');
              handleClearSearch();
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
              activeViewTab === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-300 border-amber-500/20 hover:border-amber-500/40'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>सभी गीत ({regularSongs.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveViewTab('playlists');
              handleClearSearch();
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
              activeViewTab === 'playlists'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-300 border-amber-500/20 hover:border-amber-500/40'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            <span>नॉनस्टॉप प्लेलिस्ट्स ({megaPlaylists.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('customLink')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
              activeViewTab === 'customLink'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-300 border-amber-500/20 hover:border-amber-500/40'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>कस्टम यूट्यूब लिंक</span>
          </button>
        </div>

        {/* TAB 3: USER CUSTOM LINK */}
        {activeViewTab === 'customLink' && (
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">
                🎵
              </div>
              <div>
                <h3 className="font-bold text-stone-100 text-base">
                  अपना पसंदीदा कोई भी यूट्यूब गाना या प्लेलिस्ट तुरंत बजाएं
                </h3>
                <p className="text-xs text-stone-400">
                  यूट्यूब लिंक पेस्ट करें और तुरंत ऑडियो/वीडियो सुनना शुरू करें
                </p>
              </div>
            </div>

            <form onSubmit={handlePlayUserLink} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={userCustomLink}
                onChange={(e) => setUserCustomLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 rounded-2xl bg-stone-950 border border-amber-500/30 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                disabled={userLinkLoading}
              />
              <button
                type="submit"
                disabled={userLinkLoading || !userCustomLink.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {userLinkLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-stone-950" />}
                <span>बजाएं (Play)</span>
              </button>
            </form>

            {userLinkSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{userLinkSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: ALL SONGS & REAL YOUTUBE SEARCH VIEW */}
        {activeViewTab === 'all' && (
          <div className="space-y-6">
            
            {/* Search Bar & Category Chips */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-stone-900/60 p-4 rounded-3xl border border-amber-500/20">
              <MusicSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onExecuteSearch={(q) => handleExecuteSearch(q)}
                isLoading={searchStatus === 'loading'}
                resultCount={searchStatus === 'success' ? ytSearchResults.length : filteredCatalogSongs.length}
              />
              <MusicCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  handleClearSearch();
                }}
                favoritesCount={favorites.length}
              />
            </div>

            {/* Popular Artists Filter */}
            <PopularArtistsFilter
              singers={popularSingers}
              selectedSinger={selectedSinger}
              onSelectSinger={(singer) => {
                setSelectedSinger(singer);
                if (singer) {
                  setSearchQuery(`${singer} Chhath`);
                  handleExecuteSearch(`${singer} Chhath`);
                } else {
                  handleClearSearch();
                }
              }}
            />

            {/* View Mode Toggle Bar (Grid vs List) */}
            <div className="flex items-center justify-between px-2 text-xs font-semibold text-stone-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {searchStatus === 'success'
                    ? `यूट्यूब सर्च परिणाम (${ytSearchResults.length})`
                    : `क्यूरेटेड गीत सूची (${filteredCatalogSongs.length})`}
                </span>
              </span>

              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="ग्रिड व्यू"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="सूची व्यू"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LOADING SKELETONS */}
            {searchStatus === 'loading' && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <RefreshCw className="w-8 h-8 text-amber-400 mx-auto animate-spin mb-2" />
                  <h3 className="font-bold text-amber-300 text-sm">यूट्यूब पर &ldquo;{searchQuery}&rdquo; खोजा जा रहा है...</h3>
                  <p className="text-xs text-stone-400">कृपया प्रतीक्षा करें, वीडियो परिणाम लोड हो रहे हैं</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 rounded-3xl bg-stone-900/60 border border-amber-500/20 animate-pulse space-y-3">
                      <div className="h-44 rounded-2xl bg-stone-800/80" />
                      <div className="h-4 bg-stone-800 rounded-full w-3/4" />
                      <div className="h-3 bg-stone-800/60 rounded-full w-1/2" />
                      <div className="pt-2 flex justify-between gap-2">
                        <div className="h-9 bg-stone-800 rounded-xl flex-1" />
                        <div className="h-9 w-9 bg-stone-800 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchStatus === 'error' && (
              <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-base text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>खोज परिणाम प्राप्त करने में त्रुटि हुई</span>
                </div>
                <p className="text-xs text-stone-300">{errorMessage || 'नेटवर्क समस्या या कनेक्शन विफलता।'}</p>
                <button
                  onClick={() => handleExecuteSearch(searchQuery)}
                  className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow hover:bg-rose-600 transition-colors"
                >
                  पुनः प्रयास करें (Retry)
                </button>
              </div>
            )}

            {searchStatus === 'no_results' && (
              <div className="text-center py-12 px-4 rounded-3xl bg-stone-900/40 border border-amber-500/20 space-y-3">
                <Search className="w-10 h-10 text-amber-400/60 mx-auto" />
                <h3 className="font-bold text-amber-300 text-base">&ldquo;{searchQuery}&rdquo; के लिए कोई वीडियो नहीं मिला</h3>
                <p className="text-xs text-stone-400">कृपया अलग शब्द खोजें या नीचे दिए गए गानों में से चुनें</p>
              </div>
            )}

            {/* SUCCESS REAL YOUTUBE API RESULTS */}
            {searchStatus === 'success' && ytSearchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                    <h3 className="font-bold text-base text-stone-100">
                      यूट्यूब सर्च परिणाम: <span className="text-amber-400">&ldquo;{searchQuery}&rdquo;</span> ({ytSearchResults.length})
                    </h3>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    खोज साफ़ करें &times;
                  </button>
                </div>

                {/* GRID VIEW */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ytSearchResults.map((ytSong) => {
                      const songObj = convertToSongModel(ytSong);
                      const isCurrent = currentSong?.youtubeId === ytSong.youtubeId;
                      const isPlayingThis = isCurrent && isPlaying;
                      const inQueue = queue.some(q => q.youtubeId === ytSong.youtubeId);

                      return (
                        <div
                          key={ytSong.youtubeId}
                          className={`p-4 rounded-3xl bg-stone-900/90 border transition-all flex flex-col justify-between group ${
                            isCurrent
                              ? 'border-amber-400 ring-2 ring-amber-500/50 shadow-xl bg-amber-950/40'
                              : 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-xl'
                          }`}
                        >
                          <div>
                            {/* Thumbnail with YouTube Badge & EQ */}
                            <div className="relative h-44 rounded-2xl overflow-hidden mb-3 border border-amber-500/30 bg-black">
                              <img
                                src={ytSong.thumbnailUrl}
                                alt={ytSong.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow flex items-center gap-1">
                                <span>{isLiveApi ? '🔴 YouTube Live' : '✨ Chhath Geet'}</span>
                              </div>

                              {/* Animated Equalizer when Playing */}
                              {isPlayingThis && (
                                <div className="absolute bottom-2.5 left-2.5 flex items-end gap-1 px-2 py-1 rounded-full bg-stone-950/80 backdrop-blur border border-amber-400/40">
                                  <div className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                                  <div className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                  <div className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                  <span className="text-[10px] font-bold text-amber-300 ml-1">बज रहा है</span>
                                </div>
                              )}

                              {/* Play Overlay Button */}
                              <button
                                onClick={() => {
                                  if (isCurrent) {
                                    togglePlay();
                                  } else {
                                    const searchQueue = ytSearchResults.map(convertToSongModel);
                                    playSong(songObj, searchQueue);
                                  }
                                }}
                                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
                                title="बजाएं"
                              >
                                {isPlayingThis ? (
                                  <Pause className="w-6 h-6 fill-stone-950" />
                                ) : (
                                  <Play className="w-6 h-6 ml-0.5 fill-stone-950" />
                                )}
                              </button>
                            </div>

                            <h4 className="font-bold text-sm text-stone-100 line-clamp-2 mb-1 group-hover:text-amber-300 transition-colors">
                              {songObj.title}
                            </h4>

                            <p className="text-xs text-amber-400/90 font-semibold truncate mb-2">
                              {songObj.singer}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                if (isCurrent) {
                                  togglePlay();
                                } else {
                                  const searchQueue = ytSearchResults.map(convertToSongModel);
                                  playSong(songObj, searchQueue);
                                }
                              }}
                              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:scale-[1.02] active:scale-98 transition-all"
                            >
                              {isPlayingThis ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 ml-0.5" />}
                              <span>{isPlayingThis ? 'रोकें' : 'बजाएं (Play)'}</span>
                            </button>

                            <button
                              onClick={() => {
                                if (!inQueue) addToQueue(songObj);
                              }}
                              className={`p-2 rounded-xl border transition-colors ${
                                inQueue 
                                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300' 
                                  : 'bg-stone-950 border-amber-500/20 text-stone-300 hover:text-white'
                              }`}
                              title={inQueue ? "कतार में मौजूद" : "कतार में जोड़ें"}
                            >
                              {inQueue ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>

                            <a
                              href={`https://www.youtube.com/watch?v=${ytSong.youtubeId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:text-white transition-colors"
                              title="YouTube पर देखें"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* LIST VIEW */}
                {viewMode === 'list' && (
                  <div className="space-y-2">
                    {ytSearchResults.map((ytSong, idx) => {
                      const songObj = convertToSongModel(ytSong);
                      const isCurrent = currentSong?.youtubeId === ytSong.youtubeId;
                      const isPlayingThis = isCurrent && isPlaying;
                      const inQueue = queue.some(q => q.youtubeId === ytSong.youtubeId);

                      return (
                        <div
                          key={ytSong.youtubeId}
                          className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                            isCurrent
                              ? 'bg-amber-500/20 border border-amber-400/40 shadow-lg'
                              : 'bg-stone-900/80 hover:bg-stone-900 border border-amber-500/15 hover:border-amber-500/35'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono font-bold text-stone-500 w-5 text-center">
                              {idx + 1}
                            </span>
                            <div className="relative w-14 h-10 rounded-xl overflow-hidden shrink-0 bg-black">
                              <img
                                src={ytSong.thumbnailUrl}
                                alt={ytSong.title}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => {
                                  if (isCurrent) togglePlay();
                                  else playSong(songObj, ytSearchResults.map(convertToSongModel));
                                }}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                              >
                                {isPlayingThis ? (
                                  <Pause className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ) : (
                                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                )}
                              </button>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-stone-100 truncate">
                                {ytSong.title}
                              </h4>
                              <p className="text-[11px] text-amber-400/80 truncate">
                                {ytSong.channelTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                if (isCurrent) togglePlay();
                                else playSong(songObj, ytSearchResults.map(convertToSongModel));
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1 shadow"
                            >
                              {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-stone-950" /> : <Play className="w-3.5 h-3.5 fill-stone-950 ml-0.5" />}
                              <span className="hidden sm:inline">{isPlayingThis ? 'रोकें' : 'बजाएं'}</span>
                            </button>

                            <button
                              onClick={() => {
                                if (!inQueue) addToQueue(songObj);
                              }}
                              className={`p-1.5 rounded-xl border transition-colors ${
                                inQueue ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' : 'bg-stone-950 text-stone-300 border-amber-500/20'
                              }`}
                              title={inQueue ? 'कतार में' : 'कतार में जोड़ें'}
                            >
                              {inQueue ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>

                            <a
                              href={`https://www.youtube.com/watch?v=${ytSong.youtubeId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 hover:text-white"
                              title="YouTube पर देखें"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Load More Button */}
                {nextPageToken && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => handleExecuteSearch(searchQuery, nextPageToken)}
                      disabled={isLoadingMore}
                      className="px-6 py-3 rounded-2xl bg-stone-900 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 font-bold text-xs sm:text-sm shadow inline-flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      {isLoadingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>लोड हो रहा है...</span>
                        </>
                      ) : (
                        <span>और परिणाम देखें (Load More)</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CURATED LOCAL CATALOG SONG LIST */}
            {searchStatus === 'idle' && (
              <div className="space-y-4">
                <SongList songs={filteredCatalogSongs} />
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PLAYLISTS VIEW */}
        {activeViewTab === 'playlists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {megaPlaylists.map((playlist) => {
              const isCurrent = currentSong?.id === playlist.id;

              return (
                <div
                  key={playlist.id}
                  className="p-5 rounded-3xl bg-stone-900/80 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-amber-500/20">
                    <img
                      src={getImageUrl(playlist.thumbnail)}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', getImageUrl('images/daura_arghya.jpg'));
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                    <button
                      onClick={() => {
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          playSong(playlist);
                        }
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-7 h-7 fill-stone-950" />
                      ) : (
                        <Play className="w-7 h-7 ml-0.5 fill-stone-950" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-amber-200 line-clamp-1 mb-1">
                      {playlist.title}
                    </h3>
                    <p className="text-xs text-stone-300 font-semibold mb-2">
                      {playlist.singer}
                    </p>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-4">
                      {playlist.lyricsSnippet}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {playlist.duration}
                    </span>
                    <button
                      onClick={() => {
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          playSong(playlist);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{isCurrent && isPlaying ? 'रोकें' : 'प्लेलिस्ट चलाएं'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lyrics Modal */}
        {lyricsSong && (
          <SongLyricsModal
            song={lyricsSong}
            isOpen={Boolean(lyricsSong)}
            onClose={() => setLyricsSong(null)}
          />
        )}

      </div>
    </section>
  );
};
