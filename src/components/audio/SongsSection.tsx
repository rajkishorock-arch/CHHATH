import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  X 
} from 'lucide-react';

import { FeaturedSongCard } from './FeaturedSongCard';
import { MusicCategoryFilter } from './MusicCategoryFilter';
import { MusicSearch } from './MusicSearch';
import { PopularArtistsFilter } from './PopularArtistsFilter';
import { SongList } from './SongList';
import { SongLyricsModal } from './SongLyricsModal';
import { extractYoutubeId, extractPlaylistId, parseYoutubeMeta } from '../../utils/youtubeUtils';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

export const SongsSection: React.FC = () => {
  const { t } = useLanguage();
  const { songs, addSong } = useChhathData();
  const { currentSong, isPlaying, playSong, togglePlay, favorites, lyricsSong, setLyricsSong } = useAudio();

  // Active View Tab: 'all' (all songs) | 'playlists' (mega playlists) | 'customLink' (user link)
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'playlists' | 'customLink'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [selectedSinger, setSelectedSinger] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Custom Link State
  const [userCustomLink, setUserCustomLink] = useState<string>('');
  const [userLinkLoading, setUserLinkLoading] = useState<boolean>(false);
  const [userLinkSuccess, setUserLinkSuccess] = useState<string | null>(null);

  // Featured Song: Pick first song or Sharda Sinha song
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

  // Filtered regular songs
  const filteredSongs = useMemo(() => {
    return regularSongs.filter(song => {
      // Favorites Category
      if (selectedCategory === 'पसंदीदा') {
        if (!favorites.includes(song.id)) return false;
      } else if (selectedCategory !== 'सभी') {
        const catMatch = song.category === selectedCategory || song.language === selectedCategory;
        if (!catMatch) return false;
      }

      // Singer Filter
      if (selectedSinger && !song.singer.includes(selectedSinger)) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${song.title} ${song.singer} ${song.category} ${song.language}`.toLowerCase();
        return text.includes(q);
      }

      return true;
    });
  }, [regularSongs, selectedCategory, selectedSinger, searchQuery, favorites]);

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
      let thumb = yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : getImageUrl('images/daura_arghya.jpg');

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
            शारदा सिन्हा, अनुराधा पौडवाल, पवन सिंह व अन्य महान कलाकारों के मधुर स्वर में छठ माई के भजन सुनें
          </p>
        </div>

        {/* Featured Song Hero Banner */}
        {featuredSong && activeViewTab === 'all' && !searchQuery && (
          <FeaturedSongCard song={featuredSong} />
        )}

        {/* Navigation View Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveViewTab('all')}
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
            onClick={() => setActiveViewTab('playlists')}
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

        {/* TAB 1: ALL SONGS VIEW */}
        {activeViewTab === 'all' && (
          <div className="space-y-6">
            
            {/* Search Bar & Category Chips */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-stone-900/60 p-4 rounded-3xl border border-amber-500/20">
              <MusicSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                resultCount={filteredSongs.length}
              />
              <MusicCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                favoritesCount={favorites.length}
              />
            </div>

            {/* Popular Artists Filter */}
            <PopularArtistsFilter
              singers={popularSingers}
              selectedSinger={selectedSinger}
              onSelectSinger={setSelectedSinger}
            />

            {/* Song List Component */}
            <SongList songs={filteredSongs} />

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
