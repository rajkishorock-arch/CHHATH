import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  X, 
  Mic, 
  MicOff, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Users, 
  Film, 
  Music, 
  Play, 
  Hash, 
  BookOpen, 
  Utensils, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ChevronRight,
  UserPlus,
  UserCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import { GlobalSearchService } from '../../services/search/globalSearchService';
import { 
  NormalizedSearchResult, 
  UnifiedSearchResponse, 
  SearchTab, 
  SearchSuggestionItem 
} from '../../services/search/types';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useChhathData } from '../../context/ChhathDataContext';
import { ReelsStorage } from '../../services/reelsStorage';
import { Song, DynamicReel, ReelUser } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSong?: (song: Song) => void;
  onSelectReel?: (reelId: string, matchingReels?: DynamicReel[]) => void;
  onSelectUser?: (username: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSong,
  onSelectReel,
  onSelectUser
}) => {
  const { currentUser, isFollowing, toggleFollow } = useAuth();
  const { playSong } = useAudio();
  const { userLocation } = useChhathData();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('top');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<UnifiedSearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // YouTube Video Modal Player state (#19)
  const [activeVideo, setActiveVideo] = useState<NormalizedSearchResult | null>(null);
  const [videoPlaybackError, setVideoPlaybackError] = useState(false);

  // Web Speech API Voice Search state
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Load Search History on mount
  useEffect(() => {
    setSearchHistory(GlobalSearchService.getHistory());
  }, [isOpen]);

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

  // Perform full search pipeline
  const executeSearch = useCallback(async (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) {
      setSearchResponse(null);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);
    GlobalSearchService.addHistory(clean);
    setSearchHistory(GlobalSearchService.getHistory());

    try {
      const response = await GlobalSearchService.search(clean, {
        userCity: userLocation.city,
        userLanguage: currentUser?.language
      });
      setSearchResponse(response);

      // Default to 'top' tab, or first available tab if top is empty
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

  // Debounced typing suggestions (autocomplete without calling YouTube on every keystroke - #26)
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      const items = GlobalSearchService.getSuggestions(query);
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Voice Search Web Speech API
  const toggleVoiceSearch = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है।');
      setTimeout(() => setVoiceError(null), 3000);
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

      setIsListening(true);
      setVoiceError(null);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        executeSearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceError('ध्वनि नहीं पहचानी जा सकी। कृपया पुनः प्रयास करें।');
        setTimeout(() => setVoiceError(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleClearHistory = () => {
    GlobalSearchService.clearHistory();
    setSearchHistory([]);
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setQuery(item.label);
    executeSearch(item.label);
  };

  // Video playback error handling: Silently replace invalid video (#19)
  const handleVideoPlaybackError = (failedVideoId: string) => {
    ReelsStorage.addBlockedVideoId(failedVideoId);
    setVideoPlaybackError(true);
    
    // Find replacement from videos list
    if (searchResponse) {
      const remainingVideos = searchResponse.categorized.videos.filter(
        v => v.videoId !== failedVideoId && !ReelsStorage.isBlockedVideo(v.videoId || '')
      );
      if (remainingVideos.length > 0) {
        setActiveVideo(remainingVideos[0]);
        setVideoPlaybackError(false);
      } else {
        setActiveVideo(null);
      }
    }
  };

  if (!isOpen) return null;

  const trendingTags = ['#ChhathPuja', '#ChhathiMaiya', '#Chhath2026', '#Bihar', '#ChhathGeet', '#SandhyaArghya', '#ThekuaPrasad'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-2 sm:px-4 bg-stone-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-stone-950 dark:bg-stone-950 text-stone-100 rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Search Header */}
        <div ref={searchBoxRef} className="relative p-3.5 sm:p-4 border-b border-stone-800 bg-stone-900/80 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeSearch(query);
                }
              }}
              placeholder="Search users (@rahul), reels, songs, recipes (thekua), arghya, videos..."
              autoFocus
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-900 border border-stone-700/80 text-sm sm:text-base text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 font-mukta transition-all"
            />

            {/* Clear Input Button */}
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSearchResponse(null);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-200"
                title="हटाएं"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Instant Suggestions Dropdown (#14 & #26) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 z-50 bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                  त्वरित सुझाव (Suggestions)
                </div>
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-900 cursor-pointer text-xs sm:text-sm transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-semibold text-stone-200">{item.label}</span>
                    </div>
                    {item.sub && (
                      <span className="text-[11px] text-amber-400/90 font-mono truncate max-w-[140px]">
                        {item.sub}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Search Button */}
          <button
            onClick={toggleVoiceSearch}
            title={isListening ? 'सुन रहे हैं... (Listening)' : 'बोलकर खोजें (Voice Search)'}
            className={`p-2.5 rounded-2xl transition-all shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-lg'
                : 'bg-stone-900 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-stone-900 text-stone-400 hover:text-white border border-stone-800 transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Error Notification */}
        {voiceError && (
          <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs font-mukta flex items-center gap-1.5 border-b border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}

        {/* Categorized Filter Tabs (Only show tabs with results > 0 - Requirement #5) */}
        {searchResponse && searchResponse.availableTabs.length > 0 && (
          <div className="px-3 sm:px-4 py-2 border-b border-stone-800/80 bg-stone-950 flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
            {searchResponse.availableTabs.map((tabId) => {
              const count = tabId === 'top' 
                ? searchResponse.results.length 
                : searchResponse.categorized[tabId]?.length || 0;

              const labelMap: Record<SearchTab, { name: string; icon: string }> = {
                top: { name: 'Top', icon: '🌟' },
                people: { name: 'People', icon: '👤' },
                reels: { name: 'Reels', icon: '🎬' },
                songs: { name: 'Songs', icon: '🎵' },
                videos: { name: 'Videos', icon: '▶️' },
                hashtags: { name: 'Hashtags', icon: '#️⃣' },
                articles: { name: 'Articles', icon: '📖' }
              };

              const meta = labelMap[tabId];
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mukta font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeTab === tabId
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ------------------------------------------------------------- */}
          {/* EMPTY QUERY: RECENT SEARCHES & SACRED DISCOVERY */}
          {/* ------------------------------------------------------------- */}
          {!query.trim() && (
            <div className="space-y-6">
              
              {/* Recent Searches (#25) */}
              {searchHistory.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>हालिया खोज (Recent Searches)</span>
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="text-[11px] text-stone-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>इतिहास हटाएं (Clear)</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(item);
                          executeSearch(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-500/20 text-xs text-stone-200 border border-stone-700/80 hover:border-amber-400 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Hashtags */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span>लोकप्रिय हैशटैग्स (Trending Hashtags)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        executeSearch(tag);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-stone-950 text-xs font-mono font-bold text-amber-300 border border-amber-500/20 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Cultural Query Suggestions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>पवित्र अन्वेषण (Explore Sacred Topics)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: 'छठ गीत (Songs)', q: 'छठ गीत', icon: '🎵' },
                    { label: 'ठेकुआ महाप्रसाद', q: 'thekua recipe', icon: '🍪' },
                    { label: 'संध्या व उषा अर्घ्य', q: 'arghya', icon: '🌅' },
                    { label: 'खरना विशेष', q: 'kharna', icon: '🌾' },
                    { label: 'पटना गंगा घाट', q: 'patna ghat', icon: '🌊' },
                    { label: 'सूर्य मंत्र व स्तुति', q: 'surya mantra', icon: '🪔' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item.q);
                        executeSearch(item.q);
                      }}
                      className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/50 text-left flex items-center justify-between group transition-all"
                    >
                      <div>
                        <span className="text-xl block mb-1">{item.icon}</span>
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 font-mukta">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* LOADING STATE */}
          {/* ------------------------------------------------------------- */}
          {isLoading && (
            <div className="text-center py-12 space-y-3 animate-fadeIn">
              <div className="w-10 h-10 mx-auto border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-amber-300 font-mukta">
                छठ महापर्व ज्ञानकोष एवं वीडियो खोजे जा रहे हैं...
              </p>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* NON-RELEVANT QUERY EXPERIENCE ("football" - Requirement #12) */}
          {/* ------------------------------------------------------------- */}
          {!isLoading && searchResponse && !searchResponse.isChhathRelevant && (
            <div className="space-y-6 text-center animate-fadeIn py-6">
              <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-3">
                <span className="text-4xl block">🪔</span>
                <h3 className="font-rozha text-lg sm:text-xl font-bold text-amber-300">
                  No relevant Chhath content found.
                </h3>
                <p className="font-mukta text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                  &ldquo;{query}&rdquo; के लिए कोई सीधा छठ महापर्व परिणाम उपलब्ध नहीं है। यह डिजिटल मंच केवल छठ महापर्व, सूर्योपासना एवं लोक आस्था को समर्पित है।
                </p>
              </div>

              {/* Trending Chhath Content Suggestions */}
              <div className="text-left space-y-3">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>ट्रेंडिंग छठ सामग्री देखें (Suggested Chhath Content)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'शारदा सिन्हा छठ गीत', q: 'Sharda Sinha Chhath Geet' },
                    { label: 'ठेकुआ रेसिपी', q: 'thekua' },
                    { label: 'अर्घ्य मुहूर्त व समय', q: 'arghya timing' },
                    { label: 'खरना रसियाव खीर', q: 'kharna' },
                    { label: 'गंगा घाट दर्शन', q: 'ghat' },
                    { label: 'छठ व्रत कथा', q: 'chhath katha' }
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(s.q);
                        executeSearch(s.q);
                      }}
                      className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-mukta font-bold text-stone-200 hover:text-amber-300 transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* USERNAME NOT FOUND NOTICE (#4) */}
          {/* ------------------------------------------------------------- */}
          {!isLoading && searchResponse && searchResponse.analysis.isUsernameQuery && !searchResponse.exactUser && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300 font-mukta">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">सत्यापित हैंडल &lsquo;{query}&rsquo; नहीं मिला।</span> खोज रुकी नहीं है — इस नाम से संबंधित पावन रील्स, गीत और वीडियो नीचे प्रदर्शित हैं:
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* ACTIVE RESULTS DISPLAY */}
          {/* ------------------------------------------------------------- */}
          {!isLoading && searchResponse && searchResponse.isChhathRelevant && searchResponse.results.length > 0 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1. EXACT USER PROFILE CARD (#3) */}
              {(activeTab === 'top' || activeTab === 'people') && searchResponse.exactUser && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-tr from-stone-900 to-stone-900/90 border-2 border-amber-500/50 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{searchResponse.exactUser.badge}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Follow Button */}
                      <button
                        onClick={() => {
                          if (searchResponse.exactUser) {
                            toggleFollow(searchResponse.exactUser.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow ${
                          isFollowing(searchResponse.exactUser.id)
                            ? 'bg-stone-800 text-stone-200 border border-stone-700'
                            : 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-amber-500/30'
                        }`}
                      >
                        {isFollowing(searchResponse.exactUser.id) ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>फॉलो किया गया</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>फॉलो करें</span>
                          </>
                        )}
                      </button>

                      {/* View Full Profile */}
                      {onSelectUser && searchResponse.exactUser.creatorHandle && (
                        <button
                          onClick={() => {
                            if (searchResponse.exactUser?.creatorHandle) {
                              onSelectUser(searchResponse.exactUser.creatorHandle);
                              onClose();
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <span>प्रोफाइल</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* User Identity Details */}
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={searchResponse.exactUser.thumbnail} 
                      alt={searchResponse.exactUser.title} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div>
                      <h4 className="font-rozha text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                        {searchResponse.exactUser.title}
                        {searchResponse.exactUser.metadata?.verified && (
                          <span className="text-xs text-sky-400">✓</span>
                        )}
                      </h4>
                      <div className="text-xs text-amber-400 font-mono">
                        {searchResponse.exactUser.creatorHandle}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                        {(searchResponse.exactUser.metadata?.followersCount || 0).toLocaleString('en-IN')} फॉलोअर्स • {searchResponse.exactUser.metadata?.city || 'बिहार'}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {searchResponse.exactUser.description && (
                    <p className="font-mukta text-xs text-stone-300 leading-relaxed border-t border-stone-800/80 pt-2">
                      {searchResponse.exactUser.description}
                    </p>
                  )}

                  {/* User's Recent Reels */}
                  {searchResponse.exactUserReels && searchResponse.exactUserReels.length > 0 && (
                    <div className="pt-2 border-t border-stone-800 space-y-2">
                      <div className="text-xs font-bold text-amber-300 font-mukta">
                        {searchResponse.exactUser.creatorHandle} की पावन रील्स ({searchResponse.exactUserReels.length}):
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {searchResponse.exactUserReels.slice(0, 3).map((r) => (
                          <div
                            key={r.id}
                            onClick={() => {
                              if (onSelectReel) onSelectReel(r.id);
                              onClose();
                            }}
                            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group bg-stone-950 border border-stone-800"
                          >
                            <img 
                              src={r.thumbnail} 
                              alt={r.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
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
              {(activeTab === 'top' || activeTab === 'people') && 
                searchResponse.categorized.people.filter(u => u.id !== searchResponse.exactUser?.id).length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>छठ साधक व क्रिएटर ({searchResponse.categorized.people.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResponse.categorized.people
                      .filter(u => u.id !== searchResponse.exactUser?.id)
                      .slice(0, activeTab === 'people' ? 50 : 4)
                      .map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800 transition-all"
                        >
                          <div 
                            onClick={() => {
                              if (onSelectUser && u.creatorHandle) {
                                onSelectUser(u.creatorHandle);
                                onClose();
                              }
                            }}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <img 
                              src={u.thumbnail} 
                              alt={u.title} 
                              className="w-10 h-10 rounded-full object-cover border border-amber-500/30" 
                            />
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1">
                                {u.title}
                                {u.metadata?.verified && <span className="text-[10px] text-sky-400">✓</span>}
                              </div>
                              <div className="text-[11px] text-amber-400 font-mono">{u.creatorHandle}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                              {(u.metadata?.followersCount || 0).toLocaleString('en-IN')} फॉलोअर्स
                            </span>
                            <button
                              onClick={() => toggleFollow(u.id)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                                isFollowing(u.id)
                                  ? 'bg-stone-800 text-stone-300'
                                  : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                              }`}
                            >
                              {isFollowing(u.id) ? 'Following' : 'Follow'}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 3. INTERNAL SONGS FIRST (#16 - Internal Content Priority) */}
              {(activeTab === 'top' || activeTab === 'songs') && searchResponse.categorized.songs.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Music className="w-3.5 h-3.5 text-amber-400" />
                    <span>छठ महापर्व पावन संगीत ({searchResponse.categorized.songs.length})</span>
                  </div>
                  <div className="space-y-2">
                    {searchResponse.categorized.songs
                      .slice(0, activeTab === 'songs' ? 50 : 4)
                      .map((song) => (
                        <div
                          key={song.id}
                          className="p-3 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-400/40 flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black shrink-0 border border-amber-500/30">
                              <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  if (onSelectSong) {
                                    onSelectSong({
                                      id: song.id,
                                      title: song.title,
                                      singer: song.creator || '',
                                      language: (song.metadata?.language as any) || 'Bhojpuri',
                                      category: (song.metadata?.category as any) || 'Traditional',
                                      duration: song.metadata?.duration || '5:00',
                                      audioUrl: song.url || '',
                                      thumbnail: song.thumbnail,
                                      lyricsSnippet: song.description,
                                      youtubeId: song.videoId
                                    });
                                  } else {
                                    playSong({
                                      id: song.id,
                                      title: song.title,
                                      singer: song.creator || '',
                                      language: (song.metadata?.language as any) || 'Bhojpuri',
                                      category: (song.metadata?.category as any) || 'Traditional',
                                      duration: song.metadata?.duration || '5:00',
                                      audioUrl: song.url || '',
                                      thumbnail: song.thumbnail,
                                      lyricsSnippet: song.description,
                                      youtubeId: song.videoId
                                    });
                                  }
                                }}
                                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white"
                                title="गीत बजाएं"
                              >
                                <Play className="w-4 h-4 fill-white" />
                              </button>
                            </div>

                            <div className="min-w-0">
                              <h5 className="font-bold text-xs sm:text-sm text-white truncate font-mukta">{song.title}</h5>
                              <p className="text-[11px] text-stone-400 truncate font-mukta">{song.creator} • {song.metadata?.language}</p>
                              <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold font-mukta">
                                ✨ Available on Chhath Mahaparv
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              playSong({
                                id: song.id,
                                title: song.title,
                                singer: song.creator || '',
                                language: (song.metadata?.language as any) || 'Bhojpuri',
                                category: (song.metadata?.category as any) || 'Traditional',
                                duration: song.metadata?.duration || '5:00',
                                audioUrl: song.url || '',
                                thumbnail: song.thumbnail,
                                lyricsSnippet: song.description,
                                youtubeId: song.videoId
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all shrink-0"
                          >
                            <Play className="w-3.5 h-3.5 fill-stone-950" />
                            <span>बजाएं</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 4. PLATFORM REELS */}
              {(activeTab === 'top' || activeTab === 'reels') && searchResponse.categorized.reels.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>छठ रील्स ({searchResponse.categorized.reels.length})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {searchResponse.categorized.reels
                      .slice(0, activeTab === 'reels' ? 30 : 3)
                      .map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            if (onSelectReel) onSelectReel(r.id);
                            onClose();
                          }}
                          className="relative aspect-[9/16] bg-stone-900 rounded-2xl overflow-hidden cursor-pointer group border border-stone-800/80 hover:border-amber-400/50 transition-all"
                        >
                          <img 
                            src={r.thumbnail} 
                            alt={r.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
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

              {/* 5. YOUTUBE VIDEOS (Requirement #6, #7, #15, #19) */}
              {(activeTab === 'top' || activeTab === 'videos') && searchResponse.categorized.videos.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                      <Film className="w-3.5 h-3.5" />
                      <span>यूट्यूब छठ वीडियो (YouTube Videos - {searchResponse.categorized.videos.length})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResponse.categorized.videos
                      .slice(0, activeTab === 'videos' ? 30 : 4)
                      .map((video) => (
                        <div
                          key={video.id}
                          onClick={() => {
                            setActiveVideo(video);
                            setVideoPlaybackError(false);
                          }}
                          className="p-3 rounded-2xl bg-stone-900/70 border border-red-500/20 hover:border-red-500/60 cursor-pointer group transition-all flex gap-3"
                        >
                          <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-black shrink-0">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h5 className="font-bold text-xs text-white line-clamp-2 font-mukta group-hover:text-red-300 transition-colors">
                                {video.title}
                              </h5>
                              <p className="text-[10px] text-stone-400 truncate mt-0.5">
                                {video.creator}
                              </p>
                            </div>
                            <span className="inline-block text-[9px] text-red-400 font-bold font-mono">
                              ✓ Embeddable Video
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 6. ARTICLES, RECIPES & SACRED KNOWLEDGE */}
              {(activeTab === 'top' || activeTab === 'articles') && searchResponse.categorized.articles.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>महाप्रसाद, कथा व पावन ज्ञान ({searchResponse.categorized.articles.length})</span>
                  </div>
                  <div className="space-y-2">
                    {searchResponse.categorized.articles
                      .slice(0, activeTab === 'articles' ? 30 : 4)
                      .map((art) => (
                        <div
                          key={art.id}
                          className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/40 transition-all flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
                              {art.type === 'recipe' ? '🍪' : art.type === 'ghat' ? '🌊' : art.type === 'mantra' ? '🪔' : '📜'}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs sm:text-sm text-white truncate font-mukta">
                                {art.title}
                              </h5>
                              <p className="text-[11px] text-stone-400 line-clamp-1 font-mukta">
                                {art.description}
                              </p>
                            </div>
                          </div>

                          {art.badge && (
                            <span className="text-[10px] px-2 py-1 rounded-lg bg-stone-800 text-amber-400 font-bold whitespace-nowrap shrink-0">
                              {art.badge}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 7. HASHTAGS */}
              {(activeTab === 'top' || activeTab === 'hashtags') && searchResponse.categorized.hashtags.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Hash className="w-3.5 h-3.5 text-amber-400" />
                    <span>हैशटैग्स ({searchResponse.categorized.hashtags.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.categorized.hashtags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setQuery(tag.title);
                          executeSearch(tag.title);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-xs font-mono font-bold text-amber-400 border border-stone-800 transition-all"
                      >
                        {tag.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ------------------------------------------------------------- */}
        {/* EMBEDDED YOUTUBE VIDEO MODAL PLAYER (#18 & #19) */}
        {/* ------------------------------------------------------------- */}
        {activeVideo && activeVideo.videoId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-stone-950 border border-red-500/40 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-mukta">
                    {activeVideo.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {activeVideo.creator} • Official YouTube Embed
                  </p>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&enablejsapi=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => {
                    if (activeVideo?.videoId) {
                      handleVideoPlaybackError(activeVideo.videoId);
                    }
                  }}
                  className="w-full h-full border-0"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 font-mukta pt-1">
                <span>पवित्र छठ दर्शन एवं कीर्तन</span>
                <button
                  onClick={() => {
                    if (activeVideo?.videoId) {
                      handleVideoPlaybackError(activeVideo.videoId);
                    }
                  }}
                  className="text-[10px] text-stone-500 hover:text-amber-400"
                >
                  वीडियो नहीं चल रहा? दूसरा देखें
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
