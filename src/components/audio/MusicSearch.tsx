import React, { useState } from 'react';
import { Search, X, Sparkles, History, Mic, MicOff } from 'lucide-react';

interface MusicSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExecuteSearch: (query: string) => void;
  isLoading: boolean;
  resultCount: number;
}

export const MusicSearch: React.FC<MusicSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onExecuteSearch,
  isLoading,
  resultCount
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const defaultSuggestions = [
    'Pawan Singh Chhath',
    'Sharda Sinha Chhath',
    'Khesari Lal Chhath',
    'Kaanch Hi Baans Ke Bahangiya',
    'Kelwa Ke Paat Par',
    'Ugi Suruj Dev',
    'Anuradha Paudwal Chhath',
    'Maithili Thakur Chhath'
  ];

  const handleSearchSubmit = (queryToSearch?: string) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!q) return;

    setSearchQuery(q);
    setShowSuggestions(false);

    // Save to recent searches
    setRecentSearches(prev => {
      const updated = [q, ...prev.filter(item => item !== q)].slice(0, 6);
      try {
        localStorage.setItem('chhath_recent_searches', JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });

    onExecuteSearch(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
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
          setSearchQuery(transcript);
          handleSearchSubmit(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('आवाज समझ नहीं आई। कृपया पुनः प्रयास करें।');
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
    <div className="relative flex-1 font-mukta">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit();
        }}
        className="relative flex items-center"
      >
        <Search className="absolute left-4 w-4 h-4 text-amber-400 pointer-events-none" />

        <input
          type="text"
          value={searchQuery}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="छठ गीत खोजें (उदा: Sharda Sinha, Pawan Singh)..."
          className="w-full pl-11 pr-36 py-3 rounded-2xl bg-stone-950 border border-amber-500/35 text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          aria-label="Search Chhath Songs"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(true);
              }}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="साफ़ करें"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-1.5 rounded-xl transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-amber-400 hover:text-amber-300 hover:bg-stone-800'
            }`}
            title="बोलकर खोजें"
            aria-label="Voice search"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            aria-label="Execute search"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">खोजें</span>
          </button>
        </div>
      </form>

      {/* Voice Notice Feedback */}
      {voiceNotice && (
        <div className="absolute left-0 right-0 top-full mt-1.5 p-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xl text-center z-50 animate-in fade-in">
          {voiceNotice}
        </div>
      )}

      {/* Quick Search Suggestions & Recent History */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-2 p-3.5 rounded-2xl bg-stone-900 border border-amber-500/30 shadow-2xl z-40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-stone-400 font-semibold border-b border-amber-500/15 pb-2">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>लोकप्रिय खोजें (Suggestions)</span>
            </span>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-stone-400 hover:text-white text-xs font-bold"
            >
              बंद करें &times;
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {defaultSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSearchSubmit(suggestion)}
                className="px-3 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 border border-amber-500/20 text-stone-300 hover:text-amber-300 text-xs font-semibold transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {recentSearches.length > 0 && (
            <div className="pt-2 border-t border-amber-500/15">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>हाल की खोजें (Recent Searches)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRecentSearches([]);
                    try {
                      localStorage.removeItem('chhath_recent_searches');
                    } catch {}
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-300"
                >
                  मिटाएं
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSearchSubmit(term)}
                    className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
