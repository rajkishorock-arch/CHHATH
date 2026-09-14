import React, { useState, useMemo } from 'react';
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
  Info
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

export const SongsSection: React.FC = () => {
  const { t } = useLanguage();
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

  // Filtered regular songs for local catalog
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
        const text = `${song.title} ${song.singer} ${song.category} ${song.language}`.toLowerCase();
        return text.includes(q);
      }

      return true;
    });
  }, [regularSongs, selectedCategory, selectedSinger, searchQuery, favorites, searchStatus]);

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
          setSearchStatus(response.isLiveApi ? 'no_results' : 'idle');
          if (!response.isLiveApi) {
            setErrorMessage(response.error || 'यूट्यूब लाइव खोज सेवा कनेक्ट हो रही है।');
          }
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
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Music className="w-4 h-4 text-amber-400" />
            <span>पावन संगीत अनुभव</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400">
            छठ महापर्व के सुप्रसिद्ध भक्ति गीत
          </h2>
          <p className="text-stone-300 text-sm sm:text-base">
            यूट्यूब पर किसी भी कलाकार या भजन का नाम खोजें और तुरंत एक ही प्लेयर में सुनें
          </p>
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
            <span>प्लेलिस्ट्स ({megaPlaylists.length})</span>
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

            {/* REAL YOUTUBE SEARCH RESULTS CONTAINER */}
            {searchStatus === 'loading' && (
              <div className="text-center py-16 px-4 rounded-3xl bg-stone-900/60 border border-amber-500/20 space-y-4">
                <RefreshCw className="w-10 h-10 text-amber-400 mx-auto animate-spin" />
                <div>
                  <h3 className="font-bold text-amber-300 text-base">यूट्यूब पर &ldquo;{searchQuery}&rdquo; खोजा जा रहा है...</h3>
                  <p className="text-xs text-stone-400 mt-1">कृपया प्रतीक्षा करें, वीडियो परिणाम लोड हो रहे हैं</p>
                </div>
              </div>
            )}

            {searchStatus === 'error' && (
              <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-base text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>खोज परिणाम प्राप्त करने में त्रुटि हुई</span>
                </div>
                <p className="text-xs text-stone-300">{errorMessage || 'नेटवर्क समस्या या वर्कर कनेक्शन विफलता।'}</p>
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

            {/* SUCCESS REAL YOUTUBE API RESULTS GRID */}
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
                            : 'border-amber-500/20 hover:border-amber-500/50'
                        }`}
                      >
                        <div>
                          {/* Thumbnail with YouTube Red Badge */}
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
                              <span>🔴 YouTube Live</span>
                            </div>

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
                            className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:text-white"
                            title="YouTube पर देखें"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

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
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>क्यूरेटेड छठ भक्ति गीत ({filteredCatalogSongs.length})</span>
                  </h3>
                </div>
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
                    <p className="text-xs text-stone-400 mb-3">
                      {playlist.singer} • {playlist.duration || 'सम्पूर्ण प्लेलिस्ट'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          playSong(playlist);
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2"
                    >
                      {isCurrent && isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 ml-0.5" />}
                      <span>{isCurrent && isPlaying ? 'रोकें' : 'सम्पूर्ण प्लेलिस्ट बजाएं'}</span>
                    </button>

                    {playlist.playlistId && (
                      <a
                        href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:text-white"
                        title="YouTube पर खोलें"
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

      </div>

      {/* Song Lyrics Modal */}
      <SongLyricsModal
        song={lyricsSong}
        isOpen={Boolean(lyricsSong)}
        onClose={() => setLyricsSong(null)}
      />
    </section>
  );
};
