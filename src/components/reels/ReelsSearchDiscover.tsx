import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  Film, 
  X, 
  Play, 
  ArrowRight, 
  Loader2,
  Check
} from 'lucide-react';
import { useReels } from '../../context/ReelsContext';
import { ReelUser, DynamicReel } from '../../types';
import { ReelsStorage } from '../../services/reelsStorage';
import { searchYouTubeShorts, YouTubeSearchSong } from '../../services/youtubeSearchService';

interface ReelsSearchDiscoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string, matchingReels?: DynamicReel[]) => void;
  onSelectUser: (user: ReelUser) => void;
  onSelectAudio?: (audioId: string) => void;
}

export const ReelsSearchDiscover: React.FC<ReelsSearchDiscoverProps> = ({
  isOpen,
  onClose,
  onSelectReel,
  onSelectUser
}) => {
  const { searchQuery, setSearchQuery } = useReels();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [liveShorts, setLiveShorts] = useState<DynamicReel[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState<ReelUser[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const allUsers = React.useMemo(() => ReelsStorage.getUsers(), []);

  // Sync with context if updated from outside
  useEffect(() => {
    if (isOpen) {
      setLocalQuery(searchQuery || '');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, searchQuery]);

  // Helper to map YouTubeSearchSong to DynamicReel model
  const mapItemToReel = useCallback((item: YouTubeSearchSong): DynamicReel => {
    const cleanTitle = item.title || 'Trending Reel';
    const channel = item.channelTitle || 'YouTube Creator';
    return {
      id: `yt-short-${item.youtubeId}`,
      creatorId: `creator-${item.youtubeId}`,
      creatorName: channel,
      creatorUsername: `@${channel.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 15) || 'creator'}`,
      creatorAvatar: item.thumbnailUrl,
      title: cleanTitle,
      description: item.description || cleanTitle,
      category: 'Chhath Geet',
      tags: ['#Shorts', '#Reel', '#Trending'],
      videoUrl: `https://www.youtube.com/shorts/${item.youtubeId}`,
      thumbnailUrl: item.thumbnailUrl,
      videoDuration: item.duration || '0:45',
      likesCount: Math.floor(1000 + Math.random() * 49000),
      commentsCount: Math.floor(50 + Math.random() * 950),
      sharesCount: Math.floor(20 + Math.random() * 400),
      savesCount: Math.floor(10 + Math.random() * 200),
      viewsCount: Math.floor(10000 + Math.random() * 90000),
      privacy: 'public',
      status: 'approved',
      createdAt: new Date().toISOString(),
      sourceType: 'YOUTUBE',
      youtubeVideoId: item.youtubeId,
      channelTitle: channel,
      isEmbeddable: true
    };
  }, []);

  // Execute Search for YouTube Shorts in Real Time
  const handlePerformSearch = useCallback(async (queryToSearch: string) => {
    const trimmed = queryToSearch.trim();
    if (!trimmed) {
      setLiveShorts([]);
      setNextPageToken(null);
      setIsLoading(false);
      setHasSearched(false);
      setMatchedUsers([]);
      return;
    }

    // Abort prior in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setHasSearched(true);

    // Search local creators if applicable
    const cleanLower = trimmed.toLowerCase();
    const matchingUsers = allUsers.filter(u => {
      const uName = u.name.toLowerCase();
      const uHandle = u.username.toLowerCase();
      return uName.includes(cleanLower) || uHandle.includes(cleanLower.replace('@', ''));
    });
    setMatchedUsers(matchingUsers.slice(0, 2));

    try {
      const response = await searchYouTubeShorts(trimmed, '', true);
      const converted = (response.results || []).map(mapItemToReel);
      setLiveShorts(converted);
      setNextPageToken(response.nextPageToken || null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Live shorts search failed:', err);
        setLiveShorts([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [allUsers, mapItemToReel]);

  // Debounced search on typing
  useEffect(() => {
    const trimmed = localQuery.trim();
    if (!trimmed) {
      setLiveShorts([]);
      setNextPageToken(null);
      setIsLoading(false);
      setHasSearched(false);
      setMatchedUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(trimmed);
      handlePerformSearch(trimmed);
    }, 450);

    return () => clearTimeout(timer);
  }, [localQuery, handlePerformSearch, setSearchQuery]);

  // Load more shorts (infinite scroll pagination)
  const handleLoadMore = useCallback(async () => {
    const trimmed = localQuery.trim();
    if (!trimmed || !nextPageToken || isLoadingMore || isLoading) return;

    setIsLoadingMore(true);
    try {
      const response = await searchYouTubeShorts(trimmed, nextPageToken, true);
      const newShorts = (response.results || []).map(mapItemToReel);

      setLiveShorts(prev => {
        const seen = new Set(prev.map(p => p.youtubeVideoId || p.id));
        const nonDuplicate = newShorts.filter(n => !seen.has(n.youtubeVideoId || n.id));
        return [...prev, ...nonDuplicate];
      });
      setNextPageToken(response.nextPageToken || null);
    } catch (err) {
      console.warn('Pagination load more failed:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [localQuery, nextPageToken, isLoadingMore, isLoading, mapItemToReel]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && nextPageToken && !isLoadingMore && !isLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextPageToken, isLoadingMore, isLoading, handleLoadMore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Search Header */}
        <div className="relative p-3.5 sm:p-4 border-b border-stone-800 bg-stone-900/80 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handlePerformSearch(localQuery);
                }
              }}
              placeholder="Search reels, creators, music... (@, love story, comedy)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 font-mukta transition-all"
            />
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                  setLiveShorts([]);
                  setNextPageToken(null);
                  setHasSearched(false);
                }}
                className="absolute right-3 top-3 text-stone-400 hover:text-white transition-colors"
                title="हटाएं"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white transition-colors border border-stone-800"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* EMPTY STATE: Ultra-clean, modern, no cluttered sections */}
          {!localQuery.trim() && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn select-none">
              <div className="w-16 h-16 rounded-3xl bg-stone-900/90 border border-stone-800 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
                <Film className="w-8 h-8 stroke-[1.75]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-mukta">
                रील्स और ट्रेंडिंग शॉर्ट्स खोजें
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-sm mt-1.5 font-mukta leading-relaxed">
                कोई भी ट्रेंडिंग रील्स, डांस, कॉमेडी या क्रिएटर खोजें — यूट्यूब और इंस्टाग्राम की तरह रियल-टाइम
              </p>
            </div>
          )}

          {/* LOADING SKELETON */}
          {localQuery.trim() && isLoading && liveShorts.length === 0 && (
            <div className="space-y-4 py-8 text-center animate-fadeIn">
              <Loader2 className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
              <p className="text-xs font-bold text-stone-300 font-mukta">
                &ldquo;{localQuery}&rdquo; से जुड़ी रील्स खोजी जा रही हैं...
              </p>
            </div>
          )}

          {/* ACTIVE SEARCH CONTENT */}
          {localQuery.trim() && !isLoading && (
            <div className="space-y-4 animate-fadeIn">

              {/* Matched Verified Creators (If query matches any creator) */}
              {matchedUsers.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                    क्रिएटर प्रोफाइल
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-400/50 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                              {user.name}
                              {user.verified && <Check className="w-3 h-3 text-sky-400" />}
                            </h4>
                            <p className="text-[10px] text-stone-400 font-mono truncate">{user.username}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time YouTube Shorts Grid */}
              {liveShorts.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-300 font-mukta flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>रील्स परिणाम ({liveShorts.length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {liveShorts.map(reel => (
                      <div
                        key={reel.id}
                        onClick={() => {
                          onSelectReel(reel.id, liveShorts);
                          onClose();
                        }}
                        className="relative aspect-[9/16] bg-stone-900 rounded-2xl overflow-hidden cursor-pointer group border border-stone-800/80 hover:border-amber-400/60 shadow-lg hover:shadow-amber-500/10 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        <img
                          src={reel.thumbnailUrl}
                          alt={reel.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badge */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-red-600/90 text-white font-bold text-[9px] flex items-center gap-1 shadow">
                          <span>⚡ Shorts</span>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                          </div>
                        </div>

                        {/* Bottom Gradient with Title and Channel */}
                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end">
                          <p className="text-[11px] font-bold text-white font-mukta line-clamp-2 leading-tight drop-shadow-sm">
                            {reel.title}
                          </p>
                          <span className="text-[9px] text-amber-300 font-mono truncate mt-1">
                            {reel.channelTitle || 'YouTube Creator'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Infinite Scroll Sentinel */}
                  <div ref={observerRef} className="py-4 text-center">
                    {isLoadingMore && (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 font-mukta">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>अधिक रील्स लोड हो रही हैं...</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* No Results State: Clean and friendly without hardcoded Chhath block */
                hasSearched && (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 animate-fadeIn">
                    <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400">
                      <Search className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-stone-200 font-mukta">
                        &ldquo;{localQuery}&rdquo; के लिए कोई रील्स नहीं मिली
                      </p>
                      <p className="text-xs text-stone-400 font-mukta">
                        कृपया कोई अन्य शब्द, गाना या ट्रेंडिंग विषय खोजें
                      </p>
                    </div>
                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
