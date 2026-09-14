import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, History } from 'lucide-react';

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

  const defaultSuggestions = [
    'Pawan Singh Chhath',
    'Khesari Lal Chhath',
    'Chhath Maiya Geet',
    'Chhath Puja Bhajan',
    'Traditional Chhath Geet'
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
          placeholder="यूट्यूब पर छठ गीत खोजें (उदा: Pawan Singh Chhath)..."
          className="w-full pl-11 pr-28 py-3 rounded-2xl bg-stone-950 border border-amber-500/35 text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
          aria-label="Search YouTube Chhath Songs"
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

          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
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

      {/* Quick Search Suggestions & Recent History */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-2 p-3 rounded-2xl bg-stone-900 border border-amber-500/30 shadow-2xl z-40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-stone-400 font-semibold border-b border-amber-500/15 pb-2">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सुझाए गए विषय (Suggestions)</span>
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
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mb-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>हाल की खोजें (Recent Searches)</span>
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
