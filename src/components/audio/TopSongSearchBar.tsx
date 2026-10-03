import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  X, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Sparkles, 
  History, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Music,
  ExternalLink
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { searchYouTubeVideos, convertToSongModel, YouTubeSearchSong } from '../../services/youtubeSearchService';

interface TopSongSearchBarProps {
  onNavigateToMusic?: (query?: string) => void;
  className?: string;
}

export const TopSongSearchBar: React.FC<TopSongSearchBarProps> = ({
  onNavigateToMusic,
  className = ''
}) => {
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue, queue } = useAudio();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<YouTubeSearchSong[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<any>(null);

  const trendingTags = [
    'Sharda Sinha Chhath',
    'Pawan Singh Chhath',
    'Kaanch Hi Baans',
    'Kelwa Ke Paat',
    'Khesari Lal Geet',
    'Anuradha Paudwal'
  ];

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K / Slash to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Save to recent searches
  const saveRecentSearch = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setRecentSearches(prev => {
      const updated = [cleaned, ...prev.filter(t => t.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('chhath_recent_searches', JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term);
      try {
        localStorage.setItem('chhath_recent_searches', JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });
  };

  // Execute quick live search
  const performSearch = useCallback(async (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchYouTubeVideos(clean);
      setResults(response.results.slice(0, 5));
    } catch (err) {
      console.warn('Top search bar query error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce typing in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(val);
    }, 280);
  };

  // Submit search (Enter key or click)
  const handleSubmit = (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!q) return;

    saveRecentSearch(q);
    setIsOpen(false);

    if (onNavigateToMusic) {
      onNavigateToMusic(q);
    } else {
      window.location.hash = `#music?q=${encodeURIComponent(q)}`;
    }
  };

  // Web Speech API Voice Search
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
          setIsOpen(true);
          performSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('आवाज पहचानी नहीं जा सकी। पुनः प्रयास करें।');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('माइक्रोफोन कनेक्ट नहीं हो सका।');
      setTimeout(() => setVoiceNotice(null), 3000);
    }
  };

  return (
    <div ref={containerRef} className={`relative font-mukta ${className}`}>
      {/* Top Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative flex items-center"
      >
        <div className="absolute left-3.5 flex items-center pointer-events-none text-amber-500/80">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          placeholder="यूट्यूब छठ गीत खोजें (उदा: Sharda Sinha, Pawan Singh)..."
          className="w-full pl-10 pr-24 py-2 sm:py-2.5 rounded-full bg-stone-900/90 hover:bg-stone-900 border border-amber-500/30 hover:border-amber-500/50 focus:border-amber-400 focus:bg-stone-950 text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 transition-all shadow-inner"
          aria-label="यूट्यूब पर छठ गीत खोजें"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="साफ़ करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-1.5 rounded-full transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-amber-400 hover:text-amber-300 hover:bg-stone-800'
            }`}
            title="बोलकर खोजें (Voice Search)"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          {/* Keyboard shortcut hint */}
          <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-800 text-stone-400 border border-stone-700 select-none">
            ⌘K
          </span>
        </div>
      </form>

      {/* Voice Notice Popup */}
      {voiceNotice && (
        <div className="absolute left-0 right-0 top-full mt-2 p-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xl text-center z-50 animate-in fade-in">
          {voiceNotice}
        </div>
      )}

      {/* FLOATING INDUSTRY-GRADE INSTANT SEARCH POPOVER */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:min-w-[420px] max-w-lg top-full mt-2.5 p-3 sm:p-4 rounded-3xl bg-stone-950/95 backdrop-blur-2xl border border-amber-500/35 shadow-2xl shadow-black/80 z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header Title */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 border-b border-amber-500/15 pb-2">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>यूट्यूब लाइव संगीत खोज</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white text-xs font-bold"
            >
              बंद करें &times;
            </button>
          </div>

          {/* Real-time Results List */}
          {query.trim().length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-400 px-1">
                <span>परिणाम ({results.length})</span>
                {isSearching && (
                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    खोजा जा रहा है...
                  </span>
                )}
              </div>

              {results.length > 0 ? (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {results.map((ytSong) => {
                    const songObj = convertToSongModel(ytSong);
                    const isCurrent = currentSong?.youtubeId === ytSong.youtubeId;
                    const isPlayingThis = isCurrent && isPlaying;
                    const inQueue = queue.some(q => q.youtubeId === ytSong.youtubeId);

                    return (
                      <div
                        key={ytSong.youtubeId}
                        className={`group p-2 rounded-2xl flex items-center gap-3 transition-all ${
                          isCurrent
                            ? 'bg-amber-500/20 border border-amber-500/40 shadow'
                            : 'bg-stone-900/60 hover:bg-stone-900 border border-amber-500/10 hover:border-amber-500/30'
                        }`}
                      >
                        {/* Thumbnail with overlay play */}
                        <div className="relative w-14 h-10 rounded-xl overflow-hidden shrink-0 bg-black">
                          <img
                            src={ytSong.thumbnailUrl}
                            alt={ytSong.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              saveRecentSearch(query);
                              if (isCurrent) {
                                togglePlay();
                              } else {
                                playSong(songObj, results.map(convertToSongModel));
                              }
                            }}
                            className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors"
                            title={isPlayingThis ? 'रोकें' : 'बजाएं'}
                          >
                            {isPlayingThis ? (
                              <Pause className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ) : (
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Title & Singer */}
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            saveRecentSearch(query);
                            playSong(songObj, results.map(convertToSongModel));
                          }}
                        >
                          <h4 className="text-xs font-bold text-stone-100 truncate group-hover:text-amber-300 transition-colors">
                            {ytSong.title}
                          </h4>
                          <p className="text-[11px] text-amber-400/80 truncate">
                            {ytSong.channelTitle}
                          </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (!inQueue) addToQueue(songObj);
                            }}
                            className={`p-1.5 rounded-lg border transition-all ${
                              inQueue
                                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                                : 'bg-stone-950 border-amber-500/20 text-stone-400 hover:text-white'
                            }`}
                            title={inQueue ? 'कतार में मौजूद' : 'कतार में जोड़ें'}
                          >
                            {inQueue ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>

                          <a
                            href={`https://www.youtube.com/watch?v=${ytSong.youtubeId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-red-600/15 border border-red-500/30 text-red-400 hover:text-white transition-colors"
                            title="YouTube पर खोलें"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isSearching ? (
                <div className="py-6 text-center text-xs text-stone-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>यूट्यूब परिणाम लोड हो रहे हैं...</p>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-stone-400">
                  <p>&ldquo;{query}&rdquo; के लिए कोई गाना नहीं मिला।</p>
                </div>
              )}

              {/* View all in dedicated Music Section */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-98 transition-all"
              >
                <Music className="w-3.5 h-3.5" />
                <span>सभी परिणाम छठ संगीत स्टूडियो में देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Trending Searches Tags */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
              <span>🔥 ट्रेंडिंग छठ खोजें:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setQuery(tag);
                    performSearch(tag);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-amber-500/15 border border-amber-500/20 hover:border-amber-400 text-stone-300 hover:text-amber-300 text-xs font-medium transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="pt-2 border-t border-amber-500/15 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <History className="w-3 h-3 text-amber-400" />
                  <span>हाल की खोजें</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRecentSearches([]);
                    try {
                      localStorage.removeItem('chhath_recent_searches');
                    } catch {}
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
                >
                  इतिहास मिटाएं
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs font-medium hover:border-amber-400 transition-all cursor-pointer"
                    onClick={() => {
                      setQuery(term);
                      performSearch(term);
                    }}
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(e, term)}
                      className="p-0.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
                      title="हटाएं"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
