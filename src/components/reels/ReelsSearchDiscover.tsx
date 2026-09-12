import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Flame, 
  Users, 
  Hash, 
  Film, 
  X, 
  ChevronRight, 
  Sparkles, 
  Music, 
  Play, 
  ExternalLink, 
  Clock, 
  Trash2, 
  ArrowRight,
  Compass,
  Check,
  Info
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { chhathSongs } from '../../data/songs';
import { ReelUser, DynamicReel, ReelCategory, Song } from '../../types';
import { ReelsStorage } from '../../services/reelsStorage';
import { QueryEngine } from '../../services/search/queryEngine';

interface ReelsSearchDiscoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string, matchingReels?: DynamicReel[]) => void;
  onSelectUser: (user: ReelUser) => void;
  onSelectAudio?: (audioId: string) => void;
}

type SearchTab = 'top' | 'people' | 'reels' | 'songs' | 'videos' | 'hashtags';

export const ReelsSearchDiscover: React.FC<ReelsSearchDiscoverProps> = ({
  isOpen,
  onClose,
  onSelectReel,
  onSelectUser,
  onSelectAudio
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setSelectedHashtag, 
    setSelectedCategory, 
    setFeedType,
    allReels,
    searchHistory,
    addSearchQuery,
    clearSearchHistory
  } = useReels();

  const { currentUser } = useAuth();
  const { playSong } = useAudio();

  const allUsers = useMemo(() => ReelsStorage.getUsers(), []);
  const externalCatalog = useMemo(() => ReelsStorage.getExternalCatalog(), []);

  const [activeTab, setActiveTab] = useState<SearchTab>('top');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const trendingTags = ['#ChhathPuja', '#ChhathiMaiya', '#Chhath2026', '#Bihar', '#ChhathGeet', '#SandhyaArghya', '#ThekuaPrasad'];

  // Handle outside click to hide suggestions
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  if (!isOpen) return null;

  const cleanQ = searchQuery.toLowerCase().trim();

  // Commit query to history when performed
  const commitSearch = (query: string) => {
    if (!query.trim()) return;
    addSearchQuery(query.trim());
    setShowSuggestions(false);
  };

  const handleTagClick = (tag: string) => {
    commitSearch(tag);
    setSelectedHashtag(tag);
    setFeedType('hashtag');
    onClose();
  };

  const handleCategoryClick = (cat: ReelCategory) => {
    setSelectedCategory(cat);
    setFeedType('category');
    onClose();
  };

  // -------------------------------------------------------------
  // SMART SEARCH & PRIORITY RANKING LOGIC
  // -------------------------------------------------------------

  // 1. Exact Username Match
  const targetUsername = cleanQ.startsWith('@') ? cleanQ : `@${cleanQ}`;
  const exactUser = useMemo(() => {
    if (!cleanQ) return null;
    return allUsers.find(u => 
      u.username.toLowerCase() === targetUsername || 
      u.username.toLowerCase().replace('@', '') === cleanQ
    ) || null;
  }, [cleanQ, allUsers, targetUsername]);

  const exactUserReels = useMemo(() => {
    if (!exactUser) return [];
    return allReels.filter(r => r.creatorId === exactUser.id && r.status === 'approved');
  }, [exactUser, allReels]);

  // 2. People / Users search (ranked: exact match > startsWith > includes)
  const matchedUsers = useMemo(() => {
    if (!cleanQ) return [];
    return allUsers.filter(u => {
      if (exactUser && u.id === exactUser.id) return false;
      const uName = u.name.toLowerCase();
      const uHandle = u.username.toLowerCase();
      return uName.includes(cleanQ) || uHandle.includes(cleanQ);
    }).sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(cleanQ) || a.username.toLowerCase().startsWith(cleanQ) ? 1 : 0;
      const bStarts = b.name.toLowerCase().startsWith(cleanQ) || b.username.toLowerCase().startsWith(cleanQ) ? 1 : 0;
      return bStarts - aStarts;
    });
  }, [cleanQ, allUsers, exactUser]);

  // 3. Internal Songs search (Chhath Mahaparv music database first)
  const matchedSongs = useMemo(() => {
    if (!cleanQ) return [];
    return chhathSongs.filter(s => 
      s.title.toLowerCase().includes(cleanQ) ||
      s.singer.toLowerCase().includes(cleanQ) ||
      (s.lyricsSnippet && s.lyricsSnippet.toLowerCase().includes(cleanQ)) ||
      s.category.toLowerCase().includes(cleanQ) ||
      ((cleanQ.includes('geet') || cleanQ.includes('song')) && s.category === 'Traditional')
    );
  }, [cleanQ]);

  // 4. Reels search (Platform First-Party with Intent Recognition)
  const matchedReels = useMemo(() => {
    if (!cleanQ) return [];
    return allReels.filter(r => {
      const t = r.title.toLowerCase();
      const d = r.description.toLowerCase();
      const c = r.category.toLowerCase();
      const tags = r.tags.map(tag => tag.toLowerCase());
      
      // Direct matches
      if (t.includes(cleanQ) || d.includes(cleanQ) || c.includes(cleanQ) || tags.some(tag => tag.includes(cleanQ))) {
        return true;
      }
      // Intent understanding
      if (cleanQ.includes('thekua') && (tags.includes('#thekuaprasad') || c.includes('prasad') || t.includes('ठेकुआ'))) return true;
      if (cleanQ.includes('kharna') && (tags.includes('#kharna') || t.includes('खरना') || d.includes('रसियाव'))) return true;
      if (cleanQ.includes('bhojpuri') && (r.contentLanguage === 'bho' || c.includes('geet'))) return true;
      if (cleanQ.includes('maithili') && (r.contentLanguage === 'mai' || t.includes('मैथिली'))) return true;
      if (cleanQ.includes('ghat') && (c.includes('ghat') || tags.includes('#chhathghat'))) return true;
      return false;
    });
  }, [cleanQ, allReels]);

  // 5. Approved External YouTube Videos
  const matchedVideos = useMemo(() => {
    if (!cleanQ) return [];
    return externalCatalog.filter(r => {
      if (r.youtubeVideoId && ReelsStorage.isBlockedVideo(r.youtubeVideoId)) return false;
      const t = r.title.toLowerCase();
      const d = r.description.toLowerCase();
      const ch = r.channelTitle ? r.channelTitle.toLowerCase() : '';
      const tags = r.tags.map(tag => tag.toLowerCase());
      return t.includes(cleanQ) || d.includes(cleanQ) || ch.includes(cleanQ) || tags.some(tag => tag.includes(cleanQ));
    });
  }, [cleanQ, externalCatalog]);

  // 6. Hashtags
  const allTags = useMemo(() => {
    const combined = [...allReels, ...externalCatalog];
    return Array.from(new Set(combined.flatMap(r => r.tags)));
  }, [allReels, externalCatalog]);

  const matchedHashtags = useMemo(() => {
    if (!cleanQ) return [];
    const searchTag = cleanQ.startsWith('#') ? cleanQ : `#${cleanQ}`;
    return allTags.filter(tag => tag.toLowerCase().includes(searchTag) || tag.toLowerCase().includes(cleanQ));
  }, [cleanQ, allTags]);

  const hasResults = Boolean(
    exactUser ||
    matchedUsers.length > 0 ||
    matchedReels.length > 0 ||
    matchedSongs.length > 0 ||
    matchedVideos.length > 0 ||
    matchedHashtags.length > 0
  );

  const isChhathRelevant = useMemo(() => {
    if (!cleanQ) return true;
    return QueryEngine.checkChhathRelevance(cleanQ);
  }, [cleanQ]);

  // Dynamic Tabs: Do not show categories that have zero results (#5)
  const availableTabs = useMemo(() => {
    if (!cleanQ || !isChhathRelevant) return [];
    return [
      { id: 'top' as SearchTab, label: 'Top (मुख्य)', icon: '🌟', count: (hasResults ? 1 : 0) },
      { id: 'people' as SearchTab, label: `People (${matchedUsers.length + (exactUser ? 1 : 0)})`, icon: '👤', count: matchedUsers.length + (exactUser ? 1 : 0) },
      { id: 'reels' as SearchTab, label: `Reels (${matchedReels.length})`, icon: '🎬', count: matchedReels.length },
      { id: 'songs' as SearchTab, label: `Songs (${matchedSongs.length})`, icon: '🎵', count: matchedSongs.length },
      { id: 'videos' as SearchTab, label: `Videos (${matchedVideos.length})`, icon: '▶️', count: matchedVideos.length },
      { id: 'hashtags' as SearchTab, label: `Hashtags (${matchedHashtags.length})`, icon: '#️⃣', count: matchedHashtags.length }
    ].filter(tab => tab.count > 0);
  }, [cleanQ, isChhathRelevant, hasResults, matchedUsers.length, exactUser, matchedReels.length, matchedSongs.length, matchedVideos.length, matchedHashtags.length]);

  // Suggestions for "search while typing"
  const suggestions = useMemo(() => {
    if (!cleanQ || cleanQ.length < 2) return [];
    const list: { type: 'user' | 'song' | 'reel' | 'tag'; label: string; sub?: string }[] = [];

    allUsers.slice(0, 2).forEach(u => {
      if (u.name.toLowerCase().includes(cleanQ) || u.username.toLowerCase().includes(cleanQ)) {
        list.push({ type: 'user', label: u.name, sub: u.username });
      }
    });

    chhathSongs.slice(0, 2).forEach(s => {
      if (s.title.toLowerCase().includes(cleanQ) || s.singer.toLowerCase().includes(cleanQ)) {
        list.push({ type: 'song', label: s.title, sub: s.singer });
      }
    });

    allReels.slice(0, 2).forEach(r => {
      if (r.title.toLowerCase().includes(cleanQ)) {
        list.push({ type: 'reel', label: r.title, sub: r.category });
      }
    });

    allTags.slice(0, 2).forEach(t => {
      if (t.toLowerCase().includes(cleanQ)) {
        list.push({ type: 'tag', label: t });
      }
    });

    return list.slice(0, 5);
  }, [cleanQ, allUsers, allReels, allTags]);

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Search Header */}
        <div ref={searchBoxRef} className="relative p-3.5 sm:p-4 border-b border-stone-800 bg-stone-900/70 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  commitSearch(searchQuery);
                }
              }}
              placeholder="Search users, reels, songs, hashtags… (@, #)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 font-mukta transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Instant Suggestions Dropdown (#SearchWhileTyping) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 z-40 bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-fadeIn">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.label);
                      commitSearch(item.label);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-900 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.type === 'user' ? '👤' : item.type === 'song' ? '🎵' : item.type === 'reel' ? '🔥' : '#️⃣'}</span>
                      <span className="font-bold text-stone-200">{item.label}</span>
                    </div>
                    {item.sub && <span className="text-[10px] text-amber-400 font-mono truncate max-w-[120px]">{item.sub}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categorized Filter Tabs (Only show categories with results > 0 - Requirement #5) */}
        {cleanQ && availableTabs.length > 0 && (
          <div className="px-4 py-2 border-b border-stone-800/80 bg-stone-950/90 flex gap-2 overflow-x-auto scrollbar-none">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as SearchTab);
                  commitSearch(searchQuery);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mukta font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* RECENT SEARCHES (When query is empty) */}
          {!cleanQ && searchHistory.length > 0 && (
            <div className="space-y-3 p-3 rounded-2xl bg-stone-900/40 border border-stone-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>हालिया खोज (Recent Searches)</span>
                </div>
                <button
                  onClick={clearSearchHistory}
                  className="text-[11px] text-stone-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>इतिहास हटाएं</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item);
                      commitSearch(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-500/20 text-xs font-mukta text-stone-200 border border-stone-700/80 hover:border-amber-400 transition-all flex items-center gap-1.5"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE SEARCH RESULTS */}
          {cleanQ ? (
            hasResults ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* USERNAME NOT FOUND NOTICE (#4) */}
                {cleanQ.startsWith('@') && !exactUser && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300 font-mukta">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">सत्यापित हैंडल &lsquo;{searchQuery}&rsquo; नहीं मिला।</span> खोज रुकी नहीं है — इस नाम से संबंधित पावन रील्स, गीत व सामग्री नीचे प्रदर्शित हैं:
                    </div>
                  </div>
                )}

                {/* 1. EXACT USERNAME MATCH (#UsernameSearch) */}
                {(activeTab === 'top' || activeTab === 'people') && exactUser && (
                  <div className="p-4 rounded-3xl bg-gradient-to-tr from-stone-900 to-stone-900/90 border-2 border-amber-500/50 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                        ✓ सत्यापित क्रिएटर (Verified Creator)
                      </span>
                      <button
                        onClick={() => {
                          onSelectUser(exactUser);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1 shadow-md shadow-amber-500/30"
                      >
                        <span>प्रोफाइल देखें</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <img 
                        src={exactUser.avatarUrl} 
                        alt={exactUser.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                      />
                      <div>
                        <h4 className="font-rozha text-lg font-bold text-white flex items-center gap-1.5">
                          {exactUser.name}
                          {exactUser.verified && <span className="text-xs text-sky-400">✓</span>}
                        </h4>
                        <div className="text-xs text-amber-400 font-mono">{exactUser.username}</div>
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                          {exactUser.followersCount.toLocaleString('en-IN')} फॉलोअर्स • {exactUser.city || 'बिहार'}
                        </div>
                      </div>
                    </div>

                    {exactUser.bio && (
                      <p className="font-mukta text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-2">
                        {exactUser.bio}
                      </p>
                    )}

                    {/* Reels by @username */}
                    {exactUserReels.length > 0 && (
                      <div className="pt-2 border-t border-stone-800 space-y-2">
                        <div className="text-xs font-bold text-amber-300 font-mukta">
                          {exactUser.username} की पावन रील्स ({exactUserReels.length}):
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {exactUserReels.slice(0, 3).map(r => (
                            <div
                              key={r.id}
                              onClick={() => {
                                onSelectReel(r.id, exactUserReels);
                                onClose();
                              }}
                              className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group bg-stone-950 border border-stone-800"
                            >
                              <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-white font-mukta line-clamp-1 font-bold">
                                {r.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. MATCHED PEOPLE LIST */}
                {(activeTab === 'top' || activeTab === 'people') && matchedUsers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5" />
                      <span>श्रद्धालु व क्रिएटर ({matchedUsers.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedUsers.map(u => (
                        <div
                          key={u.id}
                          onClick={() => { onSelectUser(u); onClose(); }}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/30 group-hover:scale-105 transition-transform" />
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1">
                                {u.name}
                                {u.verified && <span className="text-[10px] text-sky-400 font-bold">✓</span>}
                              </div>
                              <div className="text-[11px] text-amber-400 font-mono">{u.username}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {u.followersCount.toLocaleString('en-IN')} फॉलोअर्स
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. INTERNAL SONGS FIRST (#InternalSongFirst) */}
                {(activeTab === 'top' || activeTab === 'songs') && matchedSongs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <Music className="w-3.5 h-3.5" />
                      <span>छठ महापर्व पर उपलब्ध पावन गीत ({matchedSongs.length})</span>
                    </div>
                    <div className="space-y-2">
                      {matchedSongs.map(song => (
                        <div
                          key={song.id}
                          className="p-3 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-400/40 flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black shrink-0 border border-amber-500/30">
                              <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => playSong(song)}
                                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white"
                                title="गीत बजाएं"
                              >
                                <Play className="w-4 h-4 fill-white" />
                              </button>
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs text-white truncate">{song.title}</h5>
                              <p className="text-[11px] text-stone-400 truncate">{song.singer} • {song.language}</p>
                              <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold font-mukta">
                                ✨ Available on Chhath Mahaparv
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => playSong(song)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <Play className="w-3 h-3 fill-stone-950" />
                              <span>बजाएं</span>
                            </button>
                            {onSelectAudio && (
                              <button
                                onClick={() => onSelectAudio(song.id)}
                                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-all"
                                title="ऑडियो पेज देखें"
                              >
                                <Music className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PLATFORM REELS */}
                {(activeTab === 'top' || activeTab === 'reels') && matchedReels.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <Film className="w-3.5 h-3.5" />
                      <span>छठ रील्स ({matchedReels.length})</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {matchedReels.map(r => (
                        <div
                          key={r.id}
                          onClick={() => {
                            onSelectReel(r.id, matchedReels);
                            onClose();
                          }}
                          className="relative aspect-[9/16] bg-stone-900 rounded-2xl overflow-hidden cursor-pointer group border border-stone-800/80 hover:border-amber-400/50 transition-all"
                        >
                          <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-500/90 text-stone-950 font-bold text-[9px] shadow">
                            🔥 Reel
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-mukta line-clamp-2 font-bold leading-tight">
                            {r.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. APPROVED YOUTUBE VIDEOS (#ExternalVideoLabel) */}
                {(activeTab === 'top' || activeTab === 'videos') && matchedVideos.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                      <Film className="w-3.5 h-3.5" />
                      <span>यूट्यूब छठ वीडियो ({matchedVideos.length})</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {matchedVideos.map(r => (
                        <div
                          key={r.id}
                          onClick={() => {
                            onSelectReel(r.id, matchedVideos);
                            onClose();
                          }}
                          className="relative aspect-[9/16] bg-stone-900 rounded-2xl overflow-hidden cursor-pointer group border border-red-500/20 hover:border-red-400/60 transition-all"
                        >
                          <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-red-600/95 text-white font-bold text-[9px] shadow">
                            Source: YouTube
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-mukta line-clamp-2 font-bold leading-tight">
                            {r.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. HASHTAGS */}
                {(activeTab === 'top' || activeTab === 'hashtags') && matchedHashtags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <Hash className="w-3.5 h-3.5" />
                      <span>हैशटैग्स ({matchedHashtags.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchedHashtags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-xs font-mono font-bold text-amber-400 border border-stone-800 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* NO RESULTS FOUND EXPERIENCE (#12 & #31) */
              <div className="space-y-6 animate-fadeIn text-center">
                <div className="p-6 rounded-3xl bg-stone-900/50 border border-stone-800 space-y-2">
                  <span className="text-4xl block animate-bounce">🪔</span>
                  <h3 className="font-rozha text-xl font-bold text-amber-300">
                    {!isChhathRelevant ? 'No relevant Chhath content found.' : 'हमें exact result नहीं मिला 🙏'}
                  </h3>
                  <p className="font-mukta text-xs text-stone-300">
                    {!isChhathRelevant 
                      ? `"${searchQuery}" के लिए कोई प्रासंगिक छठ सामग्री नहीं मिली। यह डिजिटल मंच केवल छठ महापर्व व सूर्योपासना को समर्पित है।`
                      : `"${searchQuery}" के लिए कोई सीधा परिणाम नहीं मिला। लेकिन आप छठ महापर्व के ये लोकप्रिय पावन रंग देख सकते हैं:`}
                  </p>
                </div>

                {/* You May Like Recommendations */}
                <div className="space-y-5 text-left">
                  {/* Trending Reels */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>ट्रेंडिंग छठ रील्स (Trending Reels)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {allReels.slice(0, 3).map(r => (
                        <div
                          key={r.id}
                          onClick={() => { onSelectReel(r.id); onClose(); }}
                          className="relative aspect-[9/16] bg-stone-900 rounded-xl overflow-hidden cursor-pointer group"
                        >
                          <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-white font-mukta line-clamp-1 font-bold">
                            {r.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Songs */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      <span>लोकप्रिय छठ गीत (Popular Songs)</span>
                    </div>
                    <div className="space-y-1.5">
                      {chhathSongs.slice(0, 2).map(s => (
                        <div
                          key={s.id}
                          onClick={() => playSong(s)}
                          className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/40 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">🎵</span>
                            <div>
                              <div className="text-xs font-bold text-white">{s.title}</div>
                              <div className="text-[10px] text-stone-400">{s.singer}</div>
                            </div>
                          </div>
                          <Play className="w-4 h-4 text-amber-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Tags */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-amber-400" />
                      <span>लोकप्रिय हैशटैग्स</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingTags.slice(0, 4).map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-3 py-1.5 rounded-xl bg-stone-900 text-xs font-mono font-bold text-amber-400 border border-stone-800 hover:bg-amber-500 hover:text-stone-950 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )
          ) : (
            /* DEFAULT DISCOVER SCREEN */
            <div className="space-y-6">
              
              {/* Popular Creators Rail */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>लोकप्रिय छठ क्रिएटर (Popular Creators)</span>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allUsers.slice(0, 5).map(u => (
                    <div
                      key={u.id}
                      onClick={() => { onSelectUser(u); onClose(); }}
                      className="flex flex-col items-center text-center p-3 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/40 cursor-pointer min-w-[110px] shrink-0 transition-all group"
                    >
                      <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-full object-cover mb-1.5 border border-amber-500/40 group-hover:scale-105 transition-transform" />
                      <span className="text-xs font-bold text-white truncate max-w-[100px]">{u.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono truncate max-w-[100px]">{u.username}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Hashtags */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span>ट्रेंडिंग हैशटैग्स (Trending Hashtags)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-stone-950 text-xs font-mono font-bold text-amber-300 border border-amber-500/20 shadow-sm transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sacred Category Rails */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>पवित्र श्रेणियां (Chhath Categories)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { cat: 'Chhath Geet', label: 'छठ गीत', icon: '🎵' },
                    { cat: 'Ghat', label: 'घाट दर्शन', icon: '🌊' },
                    { cat: 'Puja Preparation', label: 'पूजा तैयारी', icon: '🪔' },
                    { cat: 'Thekua / Prasad', label: 'ठेकुआ प्रसाद', icon: '🌾' },
                    { cat: 'Sandhya Arghya', label: 'संध्या अर्घ्य', icon: '🌅' },
                    { cat: 'Usha Arghya', label: 'उषा अर्घ्य', icon: '🌞' }
                  ].map(item => (
                    <button
                      key={item.cat}
                      onClick={() => handleCategoryClick(item.cat as ReelCategory)}
                      className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-400/50 text-left flex items-center justify-between group transition-all"
                    >
                      <div>
                        <span className="text-xl block mb-1">{item.icon}</span>
                        <span className="text-xs font-bold text-white group-hover:text-amber-300">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
