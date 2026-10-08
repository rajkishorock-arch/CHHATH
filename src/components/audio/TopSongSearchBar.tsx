import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Mic, MicOff, ArrowUpLeft, Clock, Flame, Trash2 } from 'lucide-react';
import { YouTubeSuggestService } from '../../services/youtubeSuggestService';

interface TopSongSearchBarProps {
  onNavigateToMusic?: (query?: string) => void;
  onOpenFullSearch?: () => void;
  className?: string;
}

export const TopSongSearchBar: React.FC<TopSongSearchBarProps> = ({
  onNavigateToMusic,
  onOpenFullSearch,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Load recent searches
  useEffect(() => {
    setRecentSearches(YouTubeSuggestService.getRecentSearches());
  }, [isFocused]);

  // Fetch real-time suggestions
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      if (query.trim()) {
        const results = await YouTubeSuggestService.getSuggestions(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 150);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Submit search
  const handleSubmit = (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!q) return;

    YouTubeSuggestService.addRecentSearch(q);
    setRecentSearches(YouTubeSuggestService.getRecentSearches());
    setIsFocused(false);

    if (onNavigateToMusic) {
      onNavigateToMusic(q);
    } else {
      window.location.hash = `#music?q=${encodeURIComponent(q)}`;
    }

    // Global event for immediate instant handling
    window.dispatchEvent(new CustomEvent('chhath_music_search', { detail: { query: q } }));
  };

  // Auto-fill query into search box (YouTube-style ↖ arrow)
  const handleAutoFill = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery(text);
    inputRef.current?.focus();
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
          setIsListening(false);
          setVoiceNotice(null);
          handleSubmit(transcript);
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
      {/* Top Search Input Box - YouTube Style with Real-time Auto-fill */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative flex items-center"
      >
        <button
          type="submit"
          className="absolute left-3.5 flex items-center text-amber-500/80 hover:text-amber-500 transition-colors cursor-pointer"
          title="खोजें"
        >
          <Search className="w-4 h-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          placeholder="YouTube पर छठ गीत, भजन या वीडियो खोजें..."
          className="w-full pl-10 pr-20 py-2 sm:py-2.5 rounded-full bg-stone-100/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-900 border border-stone-200 dark:border-amber-500/30 hover:border-amber-400 focus:border-amber-500 focus:bg-white dark:focus:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 transition-all shadow-inner"
          aria-label="गाना या वीडियो खोजें"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="साफ़ करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
            title="बोलकर खोजें (Voice Search)"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
      </form>

      {/* Real-time YouTube Autocomplete Suggestions Dropdown with ↖ Auto-fill */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Recent Searches (when query is empty) */}
          {!query && recentSearches.length > 0 && (
            <div className="border-b border-stone-100 dark:border-stone-850 p-2">
              <div className="flex items-center justify-between px-3 py-1 text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  हालिया खोज (Recent)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    YouTubeSuggestService.clearRecentSearches();
                    setRecentSearches([]);
                  }}
                  className="text-stone-400 hover:text-red-500 flex items-center gap-0.5 text-[10px] cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  हटाएं
                </button>
              </div>
              <div className="space-y-0.5">
                {recentSearches.slice(0, 4).map((term, i) => (
                  <div
                    key={`recent-${i}`}
                    onClick={() => handleSubmit(term)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 cursor-pointer text-xs sm:text-sm text-stone-800 dark:text-stone-200 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{term}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleAutoFill(term, e)}
                        className="p-1 rounded-lg hover:bg-amber-500/20 text-stone-400 group-hover:text-amber-500 transition-colors"
                        title="सर्च बॉक्स में भरें (Auto-fill)"
                      >
                        <ArrowUpLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          YouTubeSuggestService.removeRecentSearch(term);
                          setRecentSearches(YouTubeSuggestService.getRecentSearches());
                        }}
                        className="p-1 rounded-lg text-stone-400 hover:text-red-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                        title="हटाएं"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time YouTube Suggestions List */}
          {suggestions.length > 0 && (
            <div className="p-2 space-y-0.5 max-h-72 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Search className="w-3 h-3 text-amber-500" />
                <span>YouTube त्वरित सुझाव</span>
              </div>

            {suggestions.map((item, idx) => (
              <div
                key={`sugg-${idx}`}
                onClick={() => handleSubmit(item)}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-stone-900 cursor-pointer text-xs sm:text-sm text-stone-800 dark:text-stone-100 group transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-500 shrink-0" />
                  <span className="truncate font-medium">{item}</span>
                </div>
                {/* YouTube iconic ↖ Auto-fill insert button */}
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
          )}
        </div>
      )}

      {/* Voice Notice Popup */}
      {voiceNotice && (
        <div className="absolute left-0 right-0 top-full mt-2 p-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xl text-center z-50 animate-in fade-in">
          {voiceNotice}
        </div>
      )}
    </div>
  );
};
