import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useChhathData } from '../../context/ChhathDataContext';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Music, 
  Play, 
  Pause, 
  Search, 
  Radio, 
  Video, 
  X, 
  ExternalLink, 
  Sparkles, 
  ListMusic, 
  Disc, 
  Link as LinkIcon,
  Check,
  RefreshCw,
  Mic2
} from 'lucide-react';
import { Song } from '../../types';
import { extractYoutubeId, extractPlaylistId, parseYoutubeMeta } from '../admin/AdminDashboard';
import { SongLyricsModal } from './SongLyricsModal';
import { useAuth } from '../../context/AuthContext';
import { ReelsStorage } from '../../services/reelsStorage';

export const SongsSection: React.FC = () => {
  const { t } = useLanguage();
  const { songs, addSong } = useChhathData();
  const { currentSong, isPlaying, playSong, togglePlay } = useAudio();
  const { currentUser } = useAuth();

  // Active View Tab: 'all' (all songs) | 'playlists' (mega playlists) | 'customLink' (play any user link)
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'playlists' | 'customLink'>('all');
  const [lyricsModalSong, setLyricsModalSong] = useState<Song | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // REAL LIVE YOUTUBE SEARCH RESULTS STATE
  const [ytLiveResults, setYtLiveResults] = useState<Song[]>([]);
  const [isYtSearching, setIsYtSearching] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // User Custom Link Input (तरीका 1: Play any user link instantly)
  const [userCustomLink, setUserCustomLink] = useState<string>('');
  const [userLinkLoading, setUserLinkLoading] = useState<boolean>(false);
  const [userLinkSuccess, setUserLinkSuccess] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // REAL-TIME LIVE YOUTUBE SEARCH EFFECT (Debounced)
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setYtLiveResults([]);
      setIsYtSearching(false);
      return;
    }

    setIsYtSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/yt-search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.results && Array.isArray(data.results)) {
            const mappedSongs: Song[] = data.results.map((r: any) => ({
              id: `yt-${r.id}`,
              title: r.title,
              singer: r.singer || 'यूट्यूब कलाकार',
              language: 'Bhojpuri',
              category: 'Traditional',
              duration: r.duration || '5:00',
              audioUrl: `https://www.youtube.com/watch?v=${r.id}`,
              youtubeId: r.id,
              thumbnail: r.thumbnail
            }));
            setYtLiveResults(mappedSongs);
          }
        }
      } catch (err) {
        console.error('Live YouTube Search Error:', err);
      } finally {
        setIsYtSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const userLangName = useMemo(() => {
    if (!currentUser?.language) return null;
    if (currentUser.language === 'mai') return 'Maithili';
    if (currentUser.language === 'bho') return 'Bhojpuri';
    if (currentUser.language === 'hi') return 'Traditional';
    return null;
  }, [currentUser]);

  const categories = useMemo(() => {
    return [
      'All',
      'For You',
      'Bhojpuri',
      'Maithili',
      'Traditional',
      'Chhathi Maiya Bhajan',
      'Surya Dev',
      'Arghya Geet',
      'Kharna',
      'Ghat Geet'
    ];
  }, []);

  // Quick Artist / Search Tags
  const quickSearchTags = [
    { label: '🌟 शारदा सिन्हा', query: 'शारदा सिन्हा' },
    { label: '🎤 पवन सिंह', query: 'पवन सिंह' },
    { label: '🎶 खेसारी लाल', query: 'खेसारी लाल' },
    { label: '🌸 मैथिली ठाकुर', query: 'मैथिली ठाकुर' },
    { label: '🙏 अनुराधा पौडवाल', query: 'अनुराधा पौडवाल' },
    { label: '🌅 उग हो सुरुज देव', query: 'सुरुज देव' },
    { label: '🌾 कांच ही बांस', query: 'कांच ही बांस' },
    { label: '🥣 खरना स्पेशल', query: 'खरना' }
  ];

  // Filter regular songs vs playlists
  const regularSongs = useMemo(() => songs.filter(s => !s.isPlaylist), [songs]);
  const megaPlaylists = useMemo(() => songs.filter(s => s.isPlaylist), [songs]);

  // Smart Query Matcher for local items
  const isLocalMatch = (item: Song, query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    const tokens = q.split(/\s+/).filter(Boolean);
    const generalWords = new Set(['chhath', 'chhat', 'chath', 'song', 'songs', 'geet', 'gana', 'bhajan', 'mp3', 'video', 'bhojpuri']);
    
    const isAllGeneral = tokens.every(t => generalWords.has(t));
    if (isAllGeneral) return true;

    const searchableText = `${item.title} ${item.singer} ${item.category} ${item.language} ${item.lyricsSnippet || ''}`.toLowerCase();
    const specificTokens = tokens.filter(t => !generalWords.has(t));
    if (specificTokens.length === 0) return true;

    return specificTokens.some(token => searchableText.includes(token));
  };

  // Dropdown Results: Prioritizes REAL LIVE YOUTUBE results when user searches!
  const dropdownResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return songs.slice(0, 6);
    }
    // If live YouTube search results exist, show them directly!
    if (ytLiveResults.length > 0) {
      return ytLiveResults;
    }
    // Otherwise fallback to local matches
    const matched = songs.filter(s => isLocalMatch(s, searchQuery));
    return matched.length > 0 ? matched : songs.slice(0, 5);
  }, [songs, searchQuery, ytLiveResults]);

  // Handle playing any song from search results
  const handleSelectSong = (song: Song) => {
    // If it's a new YouTube song not yet in data, add it so it persists!
    const existing = songs.find(s => s.youtubeId === song.youtubeId);
    if (!existing) {
      addSong(song);
    }
    if (currentUser) {
      ReelsStorage.recordSongPlay(currentUser.id, song.id);
    }
    playSong(song);
    setIsDropdownOpen(false);
  };

  // Main grid items: if live YouTube results exist for a user search, display them!
  const displayedItems = useMemo(() => {
    const q = searchQuery.trim();
    if (q && ytLiveResults.length > 0 && activeViewTab === 'all') {
      return ytLiveResults;
    }

    const listToFilter = activeViewTab === 'playlists' ? megaPlaylists : regularSongs;

    let filtered = listToFilter.filter(item => {
      if (selectedCategory === 'For You') {
        if (userLangName && (item.language === userLangName || item.category === userLangName)) return true;
        if (currentUser?.listeningHistory?.includes(item.id)) return true;
        return true;
      }
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory || item.language === selectedCategory;
      const matchQuery = isLocalMatch(item, searchQuery);
      return matchCategory && matchQuery;
    });

    // If "All" or "For You" is selected and no search query, sort by user language and listening affinity
    if (!q && (selectedCategory === 'All' || selectedCategory === 'For You') && currentUser) {
      filtered = [...filtered].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        if (userLangName && (a.language === userLangName || a.category === userLangName)) scoreA += 10;
        if (userLangName && (b.language === userLangName || b.category === userLangName)) scoreB += 10;
        if (currentUser.listeningHistory?.includes(a.id)) scoreA += 5;
        if (currentUser.listeningHistory?.includes(b.id)) scoreB += 5;
        return scoreB - scoreA;
      });
    }

    return filtered;
  }, [activeViewTab, regularSongs, megaPlaylists, selectedCategory, searchQuery, ytLiveResults, userLangName, currentUser]);

  // Handle User's custom link instant playback
  const handlePlayUserLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = userCustomLink.trim();
    if (!url) return;

    setUserLinkLoading(true);

    const pId = extractPlaylistId(url);
    const yId = extractYoutubeId(url);

    if (!yId && !pId) {
      alert('कृपया सही यूट्यूब वीडियो या प्लेलिस्ट लिंक दर्ज करें (उदा: https://www.youtube.com/watch?v=... या https://youtu.be/...)');
      setUserLinkLoading(false);
      return;
    }

    try {
      let title = pId ? 'उपयोगकर्ता द्वारा चुनी गई यूट्यूब प्लेलिस्ट' : 'उपयोगकर्ता द्वारा चुना गया छठ गीत';
      let singer = 'यूट्यूब ऑडियो';
      let thumb = yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : '/images/hero_sunrise.jpg';

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
        thumbnail: thumb,
        lyricsSnippet: 'उपयोगकर्ता द्वारा लाइव जोड़ा गया छठ भक्ति संगीत।'
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
    <section id="songs" className="section-padding relative overflow-hidden bg-gradient-to-b from-transparent via-amber-500/5 to-orange-500/5">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="badge-saffron">
            <Music className="w-3.5 h-3.5" />
            <span>{t.songsBadge}</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
            {t.songsSectionTitle}
          </h2>
          <p className="font-mukta text-base sm:text-lg text-stone-600 dark:text-stone-200">
            {t.songsSubtitle}
          </p>
        </div>

        {/* View Selection Tabs */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setActiveViewTab('all');
              setSelectedCategory('All');
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              activeViewTab === 'all'
                ? 'bg-orange-600 text-white shadow-orange-600/30 scale-102'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>{t.tabAllSongs} ({regularSongs.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveViewTab('playlists');
              setSelectedCategory('All');
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              activeViewTab === 'playlists'
                ? 'bg-orange-600 text-white shadow-orange-600/30 scale-102'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            <span>{t.tabPlaylists} ({megaPlaylists.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('customLink')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              activeViewTab === 'customLink'
                ? 'bg-orange-600 text-white shadow-orange-600/30 scale-102'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>{t.tabCustomLink}</span>
          </button>
        </div>

        {/* TAB 3: USER CUSTOM LINK INSTANT PLAY */}
        {activeViewTab === 'customLink' && (
          <div className="max-w-3xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/15 to-yellow-500/10 border-2 border-orange-500/40 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow">
                🎵
              </div>
              <div>
                <h3 className="font-mukta font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  अपना पसंदीदा कोई भी गीत या यूट्यूब लिंक तुरंत बजाएं
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  यूट्यूब से किसी भी गीत या प्लेलिस्ट का लिंक यहां पेस्ट करें और तुरंत सुनना शुरू करें!
                </p>
              </div>
            </div>

            <form onSubmit={handlePlayUserLink} className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-orange-600 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userCustomLink}
                  onChange={(e) => setUserCustomLink(e.target.value)}
                  placeholder="यूट्यूब लिंक पेस्ट करें (उदा: https://www.youtube.com/watch?v=... या प्लेलिस्ट लिंक)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm bg-white dark:bg-stone-800 border border-orange-500/40 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner font-mono"
                  disabled={userLinkLoading}
                />
              </div>

              <button
                type="submit"
                disabled={userLinkLoading || !userCustomLink.trim()}
                className="btn-primary py-3.5 px-7 text-xs sm:text-sm font-bold whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 disabled:opacity-50"
              >
                {userLinkLoading ? (
                  <span>फेच हो रहा है...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>▶️ तुरंत बजाएं (Play Now)</span>
                  </>
                )}
              </button>
            </form>

            {userLinkSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>{userLinkSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Search & REAL YOUTUBE DROPDOWN */}
        {activeViewTab !== 'customLink' && (
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            
            {/* Search Input Container with Dropdown */}
            <div ref={searchContainerRef} className="relative">
              <div className="relative">
                {isYtSearching ? (
                  <RefreshCw className="w-5 h-5 text-orange-600 absolute left-4 top-1/2 -translate-y-1/2 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-orange-600 absolute left-4 top-1/2 -translate-y-1/2" />
                )}

                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    setIsDropdownOpen(true);

                    // Auto-detect direct YouTube URL pasted into search bar!
                    const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                    if (match && match[1]) {
                      const ytId = match[1];
                      const newSong: Song = {
                        id: `yt-link-${Date.now()}`,
                        title: 'यूट्यूब छठ गीत / भजन',
                        singer: 'यूट्यूब कलाकार',
                        language: 'Bhojpuri',
                        category: 'Traditional',
                        duration: 'लाइव',
                        audioUrl: `https://www.youtube.com/watch?v=${ytId}`,
                        youtubeId: ytId,
                        thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                      };
                      addSong(newSong);
                      playSong(newSong);
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }
                  }}
                  placeholder={t.searchSongPlaceholder}
                  className="w-full pl-12 pr-10 py-3.5 rounded-full bg-white dark:bg-stone-900 border-2 border-amber-500/40 text-stone-800 dark:text-stone-100 font-mukta placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md text-sm"
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setYtLiveResults([]);
                      setIsDropdownOpen(false);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* REAL LIVE YOUTUBE AUTO-SUGGEST DROPDOWN */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-2 border-orange-500/50 overflow-hidden z-40 max-h-[480px] overflow-y-auto animate-in fade-in slide-in-from-top-2 font-mukta">
                  
                  {/* Dropdown Header */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-red-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      <span>
                        {isYtSearching ? (
                          <span>यूट्यूब पर &ldquo;{searchQuery}&rdquo; खोजा जा रहा है...</span>
                        ) : ytLiveResults.length > 0 ? (
                          <span>🔴 यूट्यूब लाइव खोज परिणाम &ldquo;{searchQuery}&rdquo; ({ytLiveResults.length})</span>
                        ) : searchQuery.trim() ? (
                          <span>&ldquo;{searchQuery}&rdquo; के लिए परिणाम ({dropdownResults.length})</span>
                        ) : (
                          <span>सुझाए गए लोकप्रिय गीत व प्लेलिस्ट</span>
                        )}
                      </span>
                    </span>

                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Results List */}
                  <div className="divide-y divide-amber-500/10">
                    {isYtSearching && ytLiveResults.length === 0 ? (
                      <div className="p-8 text-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-orange-600 mx-auto animate-spin" />
                        <p className="text-xs text-stone-600 dark:text-stone-300">
                          यूट्यूब से सीधे परिणाम लोड किए जा रहे हैं...
                        </p>
                      </div>
                    ) : dropdownResults.length > 0 ? (
                      dropdownResults.map((song) => {
                        const isCurrent = currentSong?.youtubeId === song.youtubeId;
                        const isPlayingThis = isCurrent && isPlaying;

                        return (
                          <div
                            key={song.id}
                            onClick={() => handleSelectSong(song)}
                            className="p-3 sm:px-4 hover:bg-orange-500/10 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-stone-900 shadow">
                                <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center opacity-90 group-hover:opacity-100">
                                  {isPlayingThis ? (
                                    <Pause className="w-5 h-5 text-orange-400 fill-orange-400" />
                                  ) : (
                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                  )}
                                </div>
                              </div>

                              <div className="min-w-0">
                                <strong className="text-stone-900 dark:text-white text-xs sm:text-sm font-mukta truncate block group-hover:text-orange-600 transition-colors">
                                  {song.title}
                                </strong>
                                <span className="text-stone-500 dark:text-stone-300 text-[11px] sm:text-xs font-mukta truncate block">
                                  {song.singer} • <span className="text-red-600 dark:text-red-400 font-semibold">{song.duration}</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow transition-colors ${
                                  isPlayingThis
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-orange-600 text-white hover:bg-orange-700'
                                }`}
                              >
                                {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                                <span>{isPlayingThis ? 'चल रहा है' : 'बजाएं'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center space-y-3">
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          स्थानीय सूची में कोई सीधा परिणाम नहीं मिला।
                        </p>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' chhath geet')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>YouTube पर &ldquo;{searchQuery}&rdquo; खोजें</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border-t border-amber-500/20 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">
                      ⚡ किसी भी गाने पर क्लिक करें, वह तुरंत बजने लगेगा!
                    </span>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-orange-600 font-bold hover:underline"
                    >
                      सूची में देखें &darr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Artist & Theme Tag Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-stone-400 shrink-0">त्वरित खोज:</span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => {
                    setSearchQuery(tag.query);
                    setIsDropdownOpen(true);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                    searchQuery === tag.query
                      ? 'bg-orange-600 text-white border-orange-600 shadow'
                      : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-amber-500/20 hover:bg-orange-500/15'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Category Tabs (only when in all songs mode without active text query) */}
            {activeViewTab === 'all' && !searchQuery.trim() && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-105'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 border border-amber-500/20'
                    }`}
                  >
                    {cat === 'All' ? 'सभी गीत (All)' : cat}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Live Search Indicator on Main Grid */}
        {searchQuery.trim() && ytLiveResults.length > 0 && activeViewTab === 'all' && (
          <div className="max-w-4xl mx-auto mb-6 p-3 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <span>यूट्यूब लाइव खोज: &ldquo;{searchQuery}&rdquo; के लिए {ytLiveResults.length} वीडियो मिले</span>
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setYtLiveResults([]);
              }}
              className="text-orange-600 font-bold hover:underline"
            >
              वापस डिफ़ॉल्ट गानों पर जाएं &times;
            </button>
          </div>
        )}

        {/* PLAYLISTS VIEW */}
        {activeViewTab === 'playlists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {displayedItems.map((playlist: Song) => {
              const isCurrent = currentSong?.id === playlist.id;
              const isPlayingThis = isCurrent && isPlaying;

              return (
                <div
                  key={playlist.id}
                  className={`chhath-card p-5 flex flex-col justify-between transition-all relative overflow-hidden group border-2 ${
                    isCurrent 
                      ? 'ring-2 ring-orange-500 border-orange-500 shadow-xl' 
                      : 'border-amber-500/30 hover:border-orange-500/60'
                  }`}
                >
                  <div>
                    {/* Thumbnail with Mega Playlist Badge */}
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-stone-900 shadow">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent"></div>

                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow">
                        <ListMusic className="w-3.5 h-3.5" />
                        <span>सम्पूर्ण प्लेलिस्ट</span>
                      </div>

                      {playlist.duration && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-sm text-amber-300 text-[11px] font-bold border border-amber-500/30">
                          {playlist.duration}
                        </div>
                      )}

                      {/* Big Play Overlay Button */}
                      <button
                        onClick={() => {
                          if (isCurrent) {
                            togglePlay();
                          } else {
                            playSong(playlist);
                          }
                        }}
                        className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                        title="सम्पूर्ण प्लेलिस्ट बजाएं"
                      >
                        {isPlayingThis ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1 fill-white" />}
                      </button>
                    </div>

                    <h3 className="font-mukta font-bold text-lg text-stone-900 dark:text-white line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                      {playlist.title}
                    </h3>

                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-300 mb-2">
                      {playlist.singer}
                    </p>

                    {playlist.lyricsSnippet && (
                      <p className="text-xs text-stone-600 dark:text-stone-200 line-clamp-2 leading-relaxed bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                        {playlist.lyricsSnippet}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-4 border-t border-amber-500/15 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          playSong(playlist);
                        }
                      }}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors flex items-center justify-center gap-2 shadow"
                    >
                      {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isPlayingThis ? 'प्लेलिस्ट रोकें' : 'सम्पूर्ण प्लेलिस्ट बजाएं'}</span>
                    </button>

                    {playlist.playlistId && (
                      <a
                        href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-red-600/15 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="यूट्यूब पर प्लेलिस्ट खोलें"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REGULAR SONGS & LIVE YOUTUBE GRID VIEW */}
        {activeViewTab === 'all' && (
          <div>
            {displayedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedItems.map((song: Song) => {
                  const isCurrent = currentSong?.youtubeId === song.youtubeId;
                  const isPlayingThis = isCurrent && isPlaying;

                  return (
                    <div
                      key={song.id}
                      className={`chhath-card p-4 flex flex-col justify-between transition-all relative overflow-hidden group ${
                        isCurrent ? 'ring-2 ring-orange-500 border-orange-500 shadow-lg' : ''
                      }`}
                    >
                      <div>
                        {/* Thumbnail & Overlay */}
                        <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-stone-900">
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>
                          
                          {/* Badge Category / Source */}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-sm border border-amber-500/30 text-[10px] font-bold text-amber-300">
                            {song.id.startsWith('yt-') ? '🔴 YouTube' : song.category}
                          </div>

                          {/* Duration */}
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-stone-900/90 text-white text-[10px] font-bold border border-white/20">
                            {song.duration}
                          </div>

                          {/* Personalized Match Badge */}
                          {currentUser && userLangName && (song.language === userLangName || currentUser.listeningHistory?.includes(song.id)) && (
                            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-[10px] font-bold shadow-md flex items-center gap-1 z-10">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>आपके लिए</span>
                            </div>
                          )}

                          {/* Big Play Button Overlay */}
                          <button
                            onClick={() => handleSelectSong(song)}
                            title="गीत बजाएं"
                            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group-hover:opacity-100 opacity-90"
                          >
                            {isPlayingThis ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-white" />}
                          </button>
                        </div>

                        {/* Song Details */}
                        <h3 className="font-mukta font-bold text-base text-stone-900 dark:text-white line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                          {song.title}
                        </h3>

                        <div className="text-xs text-stone-500 dark:text-stone-300 font-mukta flex items-center justify-between mb-2">
                          <span className="font-semibold text-amber-700 dark:text-amber-400 truncate max-w-[200px]">{song.singer}</span>
                          <span>{song.duration}</span>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 mt-3 border-t border-amber-500/15 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleSelectSong(song)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold bg-orange-500/15 hover:bg-orange-500/25 text-orange-700 dark:text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Radio className="w-3.5 h-3.5 text-orange-600" />
                          <span>{isPlayingThis ? 'रोकें' : 'बजाएं'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLyricsModalSong(song);
                          }}
                          className="px-2.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 transition-colors flex items-center gap-1 border border-amber-500/30"
                          title="गीत के बोल (Lyrics / Sing-Along)"
                        >
                          <Mic2 className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline">बोल</span>
                        </button>

                        {song.youtubeId && (
                          <a
                            href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5 shadow"
                            title="यूट्यूब पर देखें"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>YouTube</span>
                          </a>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 max-w-xl mx-auto space-y-4 font-mukta">
                <Music className="w-12 h-12 text-orange-600 mx-auto opacity-70" />
                <div>
                  <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                    &ldquo;{searchQuery}&rdquo; के लिए कोई स्थानीय गीत नहीं मिला
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    आप सीधे यूट्यूब पर इस गीत को खोजकर लिंक पेस्ट कर सकते हैं या नीचे दिए गए लोकप्रिय गायकों के गीत सुन सकते हैं:
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' chhath geet')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow hover:bg-red-700 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>YouTube पर खोजें</span>
                  </a>
                  <button
                    onClick={() => setSearchQuery('शारदा सिन्हा')}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-600 text-white shadow"
                  >
                    🌟 शारदा सिन्हा
                  </button>
                  <button
                    onClick={() => setSearchQuery('पवन सिंह')}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-600 text-white shadow"
                  >
                    🎤 पवन सिंह
                  </button>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                  >
                    सभी 16+ गीत देखें
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Karaoke & Sing-Along Lyrics Modal */}
      <SongLyricsModal
        song={lyricsModalSong}
        isOpen={!!lyricsModalSong}
        onClose={() => setLyricsModalSong(null)}
      />
    </section>
  );
};
