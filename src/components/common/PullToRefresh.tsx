import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 68
}) => {
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);
  const isRefreshingRef = useRef<boolean>(false);

  // Sync ref
  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([25, 20]);
      } catch {
        // ignore
      }
    }

    // Dispatch global refresh event so data across the app syncs
    window.dispatchEvent(new CustomEvent('chhath-app-pull-refresh'));

    try {
      if (onRefresh) {
        await Promise.resolve(onRefresh());
      } else {
        // Default soft refresh animation duration
        await new Promise(resolve => setTimeout(resolve, 850));
      }
    } catch (e) {
      console.warn('Pull-to-refresh handler error:', e);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 300);
    }
  }, [onRefresh]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshingRef.current) return;
      // Only engage if scroll position is at the very top
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentScroll <= 3 && e.touches.length === 1) {
        startYRef.current = e.touches[0].clientY;
        startXRef.current = e.touches[0].clientX;
        isPullingRef.current = true;
      } else {
        isPullingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshingRef.current || e.touches.length !== 1) return;

      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentScroll > 5) {
        isPullingRef.current = false;
        setPullDistance(0);
        return;
      }

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = touchY - startYRef.current;
      const deltaX = touchX - startXRef.current;

      // Ignore horizontal gestures (swiping left/right)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
        isPullingRef.current = false;
        setPullDistance(0);
        return;
      }

      if (deltaY > 0) {
        // Natural dampening physics curve
        const damped = Math.min(Math.pow(deltaY, 0.82) * 1.6, 92);
        setPullDistance(damped);
        if (damped > 15 && e.cancelable) {
          e.preventDefault();
        }
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      if (pullDistance >= threshold && !isRefreshingRef.current) {
        setPullDistance(threshold);
        handleRefresh();
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchCancel = () => {
      isPullingRef.current = false;
      if (!isRefreshingRef.current) {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [pullDistance, threshold, handleRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const isTriggered = pullDistance >= threshold;

  return (
    <div className="relative w-full">
      {/* Floating Divine Pull-to-Refresh Indicator */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-transform duration-200 pointer-events-none ${
          pullDistance > 5 || isRefreshing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: `${Math.max(pullDistance * 0.75 - 12, 10)}px`,
          transform: `translate(-50%, ${pullDistance > 0 || isRefreshing ? 0 : -60}px)`,
          transition: isPullingRef.current ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease'
        }}
      >
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 font-mukta ${
            isTriggered || isRefreshing
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-amber-100 border-amber-300/60 shadow-amber-500/30 scale-105'
              : 'bg-stone-900/90 text-stone-200 border-amber-500/30 shadow-black/40'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 text-amber-200 animate-spin" />
            ) : (
              <RefreshCw
                className="w-4 h-4 text-amber-300 transition-transform duration-100"
                style={{ transform: `rotate(${progress * 360}deg)` }}
              />
            )}
            {isTriggered && !isRefreshing && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
              </span>
            )}
          </div>

          <span className="text-xs font-semibold tracking-wide flex items-center gap-1">
            {isRefreshing ? (
              <>
                <span>सामग्री ताज़ा की जा रही है...</span>
              </>
            ) : isTriggered ? (
              <>
                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>छोड़ें और रिफ्रेश करें</span>
              </>
            ) : (
              <span>नीचे खींचकर रिफ्रेश करें</span>
            )}
          </span>
        </div>
      </div>

      {/* Main Page Content */}
      {children}
    </div>
  );
};
