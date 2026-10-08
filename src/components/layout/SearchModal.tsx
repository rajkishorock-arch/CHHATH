import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  X, 
  Mic, 
  MicOff, 
  Clock, 
  Trash2, 
  Users, 
  Film, 
  Music, 
  Play, 
  Sparkles, 
  Flame, 
  ArrowLeft,
  ArrowUpLeft,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Video
} from 'lucide-react';
import { GlobalSearchService } from '../../services/search/globalSearchService';
import { YouTubeSuggestService } from '../../services/youtubeSuggestService';
import { 
  NormalizedSearchResult, 
  UnifiedSearchResponse, 
  SearchTab 
} from '../../services/search/types';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { Song, DynamicReel } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSong?: (song: Song) => void;
  onSelectReel?: (reelId: string, matchingReels?: DynamicReel[]) => void;
  onSelectUser?: (username: string) => void;
  onNavigate?: (url: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSong,
  onSelectUser
}) => {
  const { currentUser } = useAuth();
  const { playSong } = useAudio();
  const { userLocation } = useChhathData();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('top');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResponse, setSearchResponse] = useState<UnifiedSearchResponse | null>(null);
  
  // Real-time YouTube Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // YouTube Video Modal Player state
  const [activeVideo, setActiveVideo] = useState<NormalizedSearchResult | null>(null);

  // Web Speech API Voice Search state
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Load Search History on mount
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(YouTubeSuggestService.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Real-time suggestions fetching as user types (50-100ms response)
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      const results = await YouTubeSuggestService.getSuggestions(query.trim());
      setSuggestions(results);
    }, 150);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Auto-fill query into search box (YouTube-style ↖ arrow)
  const handleAutoFill = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery(text);
    inputRef.current?.focus();
  };

  // Perform full search pipeline
  const executeSearch = useCallback(async (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) return;

    setIsLoading(true);
    setHasSearched(true);
    setQuery(clean);

    // Save to recent searches
    YouTubeSuggestService.addRecentSearch(clean);
    setRecentSearches(YouTubeSuggestService.getRecentSearches());

    try {
      const response = await GlobalSearchService.search(clean, {
        userCity: userLocation.city,
        userLanguage: currentUser?.language
      });
      setSearchResponse(response);

      if (response.availableTabs.length > 0) {
        if (!response.availableTabs.includes(activeTab)) {
          setActiveTab(response.availableTabs[0]);
        }
      }
    } catch (err) {
      console.error('Global search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation.city, currentUser?.language, activeTab]);

  // Clear single recent search
  const handleRemoveRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    YouTubeSuggestService.removeRecentSearch(term);
    setRecentSearches(YouTubeSuggestService.getRecentSearches());
  };

  // Clear all recent searches
  const handleClearHistory = () => {
    YouTubeSuggestService.clearRecentSearches();
    setRecentSearches([]);
  };

  // Voice Search Web Speech API
  const toggleVoiceSearch = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है।');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('बोलिए... (उदा: शारदा सिन्हा छठ गीत)');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript) {
          setQuery(transcript);
          setIsListening(false);
          setVoiceNotice(null);
          executeSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('ध्वनि पहचानी नहीं जा सकी। पुनः प्रयास करें।');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // 1-Tap Play Audio in Global Player
  const handlePlaySongItem = (song: NormalizedSearchResult) => {
    const songObj: Song = {
      id: song.id,
      title: song.title,
      singer: song.creator || 'छठ भक्ति संगीत',
      language: (song.metadata?.language as any) || 'Bhojpuri',
      category: (song.metadata?.category as any) || 'छठ भक्ति संगीत',
      duration: song.metadata?.duration || '5:00',
      audioUrl: song.url || (song.videoId ? `https://www.youtube.com/watch?v=${song.videoId}` : ''),
      thumbnail: song.thumbnail,
      description: song.description,
      youtubeId: song.videoId
    };

    if (onSelectSong) {
      onSelectSong(songObj);
    } else {
      playSong(songObj);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/90 backdrop-blur-xl animate-in fade-in duration-200 font-mukta">
      <div className="w-full max-w-4xl h-full sm:h-[92vh] sm:mt-6 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        
        {/* =========================================================
            YOUTUBE TOP SEARCH HEADER
           ========================================================= */}
        <div className="p-2 sm:p-3.5 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/90 flex items-center gap-2 sm:gap-3 sticky top-0 z-20">
          {/* Back Button (YouTube-style) */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title="वापस जाएं (Back)"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* YouTube Search Bar Input Pill */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch(query);
            }}
            className="flex-1 relative flex items-center"
          >
            <div className="relative flex-1 flex items-center bg-stone-100 dark:bg-stone-950 rounded-full border border-stone-300 dark:border-stone-700/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/25 transition-all shadow-inner">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasSearched(false);
                }}
                placeholder="YouTube पर कोई भी गाना, गायक या वीडियो खोजें..."
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setHasSearched(false);
                    setSearchResponse(null);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer"
                  title="साफ़ करें"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`ml-2 p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-amber-600 dark:text-amber-400'
              }`}
              title="बोलकर खोजें (Voice Search)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Dedicated Search Action Button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className="ml-2 px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">खोजें</span>
            </button>
          </form>
        </div>

        {/* Voice Notice Popup */}
        {voiceNotice && (
          <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs text-center font-bold animate-in fade-in">
            {voiceNotice}
          </div>
        )}

        {/* =========================================================
            BODY CONTENT AREA
           ========================================================= */}
        <div className="flex-1 overflow-y-auto">
          
          {/* STATE 1: TYPING OR EMPTY INPUT (SHOW YOUTUBE SUGGESTIONS / RECENT / TRENDING) */}
          {(!hasSearched || !query.trim()) && (
            <div className="p-3 sm:p-5 space-y-4 max-w-3xl mx-auto">
              
              {/* If query has characters -> Real-time YouTube Autocomplete Suggestions */}
              {query.trim() && suggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>YouTube सुझाव (Suggestions)</span>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/60">
                    {suggestions.map((item, idx) => (
                      <div
                        key={`sugg-${idx}`}
                        onClick={() => executeSearch(item)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-amber-50 dark:hover:bg-stone-850 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Search className="w-4 h-4 text-stone-400 group-hover:text-amber-500 shrink-0" />
                          <span className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate font-medium">
                            {item}
                          </span>
                        </div>

                        {/* YouTube iconic ↖ Auto-fill Insert Arrow Button */}
                        <button
                          type="button"
                          onClick={(e) => handleAutoFill(item, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-500/20 transition-all shrink-0 cursor-pointer"
                          title="सर्च बॉक्स में भरें (Auto-fill)"
                        >
                          <ArrowUpLeft className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* If query is empty -> Recent Searches */}
              {!query.trim() && recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>हालिया खोज (Recent Searches)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="text-stone-400 hover:text-red-500 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>सभी हटाएं</span>
                    </button>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/60">
                    {recentSearches.map((term, i) => (
                      <div
                        key={`recent-${i}`}
                        onClick={() => executeSearch(term)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                          <span className="text-xs sm:text-sm text-stone-900 dark:text-stone-200 truncate">
                            {term}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* ↖ Auto-fill button */}
                          <button
                            type="button"
                            onClick={(e) => handleAutoFill(term, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-500/20 transition-all cursor-pointer"
                            title="सर्च बॉक्स में भरें (Auto-fill)"
                          >
                            <ArrowUpLeft className="w-4 h-4" />
                          </button>
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveRecent(term, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                            title="हटाएं"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube-Style Empty Search Prompt (Zero Static Data) */}
              {!query.trim() && recentSearches.length === 0 && (
                <div className="py-16 px-4 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    YouTube रियल-टाइम ग्लोबल सर्च
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                    कोई भी गीत, संगीत, गायक, भजन या वीडियो खोजें। यूट्यूब से सीधे लाइव परिणाम तुरंत प्राप्त करें।
                  </p>
                </div>
              )}

            </div>
          )}

          {/* STATE 2: LOADING SKELETON */}
          {isLoading && (
            <div className="p-8 text-center space-y-3 animate-in fade-in">
              <div className="w-10 h-10 mx-auto border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                YouTube और पावन संग्रह से खोज रहे हैं...
              </p>
            </div>
          )}

          {/* STATE 3: SEARCH RESULTS DISPLAY */}
          {!isLoading && hasSearched && searchResponse && (
            <div className="p-3 sm:p-5 space-y-4 max-w-4xl mx-auto">
              
              {/* Category Filter Pills (YouTube Tabs) */}
              {searchResponse.availableTabs.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {searchResponse.availableTabs.map((tab) => {
                    const tabLabels: Record<SearchTab, string> = {
                      top: '🌟 मुख्य (Top)',
                      songs: '🎵 पावन गीत (Songs)',
                      videos: '▶️ वीडियो दर्शन',
                      people: '👤 साधक व क्रिएटर',
                      reels: '🎬 रील्स (Reels)',
                      hashtags: '#️⃣ हैशटैग्स',
                      articles: '📖 कथा व विधि'
                    };

                    const count = tab === 'top' ? searchResponse.results.length : searchResponse.categorized[tab]?.length || 0;
                    if (count === 0 && tab !== 'top') return null;

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          activeTab === tab
                            ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                            : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                        }`}
                      >
                        {tabLabels[tab] || tab} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Exact User Profile Card (if @username search) */}
              {(activeTab === 'top' || activeTab === 'people') && searchResponse.exactUser && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={searchResponse.exactUser.thumbnail} 
                      alt={searchResponse.exactUser.title}
                      className="w-12 h-12 rounded-full object-cover border border-amber-400" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                          {searchResponse.exactUser.title}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-mono">
                        {searchResponse.exactUser.creatorHandle}
                      </p>
                    </div>
                  </div>

                  {onSelectUser && searchResponse.exactUser.creatorHandle && (
                    <button
                      onClick={() => onSelectUser(searchResponse.exactUser!.creatorHandle!)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>चैट करें</span>
                    </button>
                  )}
                </div>
              )}

              {/* TOP MATCH HERO VIDEO / SONG CARD */}
              {(activeTab === 'top' || activeTab === 'songs' || activeTab === 'videos') && searchResponse.results.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>सर्वश्रेष्ठ परिणाम (Top Match)</span>
                  </div>

                  {(() => {
                    const hero = searchResponse.results[0];
                    return (
                      <div className="p-3 sm:p-4 rounded-3xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row gap-4 items-start">
                        <div className="relative w-full sm:w-60 aspect-video rounded-2xl overflow-hidden bg-black shrink-0 shadow-md">
                          <img src={hero.thumbnail} alt={hero.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handlePlaySongItem(hero)}
                            className="absolute inset-0 bg-black/35 hover:bg-black/20 flex items-center justify-center transition-colors group cursor-pointer"
                            title="चलाएं"
                          >
                            <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
                            </div>
                          </button>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-snug">
                            {hero.title}
                          </h3>
                          <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                            <span className="font-bold text-amber-700 dark:text-amber-400">{hero.creator}</span>
                            <span>•</span>
                            <span>छठ महापर्व 2026</span>
                          </p>
                          {hero.description && (
                            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                              {hero.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handlePlaySongItem(hero)}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-stone-950" />
                              <span>तुरंत सुनें (Audio)</span>
                            </button>
                            {hero.videoId && (
                              <button
                                onClick={() => setActiveVideo(hero)}
                                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>वीडियो देखें</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* LIST OF VIDEOS AND SONGS */}
              {(activeTab === 'top' || activeTab === 'songs' || activeTab === 'videos') && (
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-500" />
                    <span>सभी गीत व वीडियो ({searchResponse.results.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResponse.results.slice(1, activeTab === 'top' ? 12 : 50).map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 hover:border-amber-400/50 flex items-center justify-between gap-3 group transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-16 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            <button
                              onClick={() => handlePlaySongItem(item)}
                              className="absolute inset-0 bg-black/30 hover:bg-black/10 flex items-center justify-center text-white cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-white" />
                            </button>
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                              {item.creator}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handlePlaySongItem(item)}
                            className="p-2 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer"
                            title="गीत बजाएं"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NO RESULTS FOUND */}
              {searchResponse.results.length === 0 && (
                <div className="p-8 text-center space-y-2 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <Search className="w-8 h-8 text-stone-400 mx-auto" />
                  <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                    &ldquo;{query}&rdquo; के लिए कोई सामग्री नहीं मिली
                  </h4>
                  <p className="text-xs text-stone-500">
                    कृपया किसी अन्य गायक का नाम या छठ गीत लिखकर खोजें।
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Inline YouTube Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-3xl bg-stone-950 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl flex flex-col">
            <div className="p-3 bg-stone-900 flex items-center justify-between border-b border-stone-800">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[80%]">
                {activeVideo.title}
              </h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
