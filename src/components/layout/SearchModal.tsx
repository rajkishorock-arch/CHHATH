import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Mic, 
  MicOff, 
  Clock, 
  Trash2, 
  ArrowLeft,
  ArrowUpLeft,
  Sparkles
} from 'lucide-react';
import { YouTubeSuggestService } from '../../services/youtubeSuggestService';
import { Song, DynamicReel } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit?: (query: string) => void;
  onSelectSong?: (song: Song) => void;
  onSelectReel?: (reelId: string, matchingReels?: DynamicReel[]) => void;
  onSelectUser?: (username: string) => void;
  onNavigate?: (url: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearchSubmit,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Load Search History on mount / open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(YouTubeSuggestService.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Real-time YouTube suggestions fetching as user types
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      const results = await YouTubeSuggestService.getSuggestions(query.trim());
      setSuggestions(results);
    }, 120);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Execute and commit search directly to HOME PAGE (YouTube-style seamless redirection)
  const handleCommitSearch = (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) return;

    // 1. Save to recent searches
    YouTubeSuggestService.addRecentSearch(clean);
    setRecentSearches(YouTubeSuggestService.getRecentSearches());

    // 2. Close search modal overlay immediately
    onClose();

    // 3. Dispatch to home page and listener
    window.dispatchEvent(new CustomEvent('chhath_music_search', { detail: { query: clean } }));

    if (onSearchSubmit) {
      onSearchSubmit(clean);
    } else if (onNavigate) {
      onNavigate('music');
    }
  };

  // Auto-fill query into search box (YouTube-style ↖ arrow)
  const handleAutoFill = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery(text);
    inputRef.current?.focus();
  };

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
        setVoiceNotice('बोलिए... (उदा: छठ गीत या कोई भी गाना)');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript) {
          setQuery(transcript);
          setIsListening(false);
          setVoiceNotice(null);
          handleCommitSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('ध्वनि पहचानी नहीं जा सकी। कृपया पुनः प्रयास करें।');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200 font-mukta">
      <div className="w-full max-w-3xl h-full sm:h-[85vh] sm:mt-6 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        
        {/* =========================================================
            YOUTUBE TOP SEARCH HEADER
           ========================================================= */}
        <div className="p-2.5 sm:p-3.5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2 sm:gap-3 sticky top-0 z-20">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title="वापस जाएं (Back)"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* YouTube Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommitSearch(query);
            }}
            className="flex-1 relative flex items-center"
          >
            <div className="relative flex-1 flex items-center bg-stone-100 dark:bg-stone-950 rounded-full border border-stone-300 dark:border-stone-700/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/25 transition-all shadow-inner">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="YouTube पर कोई भी गाना, वीडियो या भजन खोजें..."
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
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
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-amber-600 dark:text-amber-400'
              }`}
              title="बोलकर खोजें (Voice Search)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Submit Search Button */}
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
            BODY CONTENT: SUGGESTIONS & RECENT SEARCHES
           ========================================================= */}
        <div className="flex-1 overflow-y-auto">
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
                      onClick={() => handleCommitSearch(item)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-amber-50 dark:hover:bg-stone-800 cursor-pointer transition-colors group"
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
                      onClick={() => handleCommitSearch(term)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors group"
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

            {/* YouTube-Style Empty Search Prompt */}
            {!query.trim() && recentSearches.length === 0 && (
              <div className="py-16 px-4 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  YouTube रियल-टाइम ग्लोबल सर्च
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  कोई भी गाना, वीडियो, गायक या भजन खोजें। परिणाम सीधे होम पेज पर YouTube वीडियो कार्ड और इन्फिनिट स्क्रॉल के साथ खुलेंगे।
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
