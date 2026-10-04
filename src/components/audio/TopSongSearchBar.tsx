import React, { useState, useRef } from 'react';
import { Search, X, Mic, MicOff } from 'lucide-react';

interface TopSongSearchBarProps {
  onNavigateToMusic?: (query?: string) => void;
  className?: string;
}

export const TopSongSearchBar: React.FC<TopSongSearchBarProps> = ({
  onNavigateToMusic,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Submit search: navigates to music section with query and dispatches search event
  const handleSubmit = (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!q) return;

    if (onNavigateToMusic) {
      onNavigateToMusic(q);
    } else {
      window.location.hash = `#music?q=${encodeURIComponent(q)}`;
    }

    // Dispatch global event so SongsSection handles it immediately
    window.dispatchEvent(new CustomEvent('chhath_music_search', { detail: { query: q } }));
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
    <div className={`relative font-mukta ${className}`}>
      {/* Top Search Input Box - Clean YouTube-style without popups or cmd-k badge */}
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="छठ गीत खोजें (उदा: Sharda Sinha, Pawan Singh)..."
          className="w-full pl-10 pr-16 py-2 sm:py-2.5 rounded-full bg-stone-100/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-900 border border-stone-200 dark:border-amber-500/30 hover:border-amber-400 focus:border-amber-500 focus:bg-white dark:focus:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 transition-all shadow-inner"
          aria-label="छठ गीत खोजें"
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

      {/* Voice Notice Popup */}
      {voiceNotice && (
        <div className="absolute left-0 right-0 top-full mt-2 p-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xl text-center z-50 animate-in fade-in">
          {voiceNotice}
        </div>
      )}
    </div>
  );
};
