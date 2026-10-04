import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 65
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
      } catch {}
    }

    // Dispatch global custom event for any listening sub-components
    window.dispatchEvent(new CustomEvent('chhath-app-pull-refresh'));

    try {
      if (onRefresh) {
        await Promise.resolve(onRefresh());
      }
    } catch (e) {
      console.warn('Pull-to-refresh handler error:', e);
    }

    // Smoothly conclude refresh animation without destroying the page or stopping the background song
    setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
    }, 700);
  }, [onRefresh]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshingRef.current) return;
      // Only engage if scroll position is at the very top of page
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentScroll <= 2 && e.touches.length === 1) {
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
      if (currentScroll > 3) {
        isPullingRef.current = false;
        setPullDistance(0);
        return;
      }

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = touchY - startYRef.current;
      const deltaX = touchX - startXRef.current;

      // Ignore horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 12) {
        isPullingRef.current = false;
        setPullDistance(0);
        return;
      }

      if (deltaY > 0) {
        // Natural resistance physics
        const damped = Math.min(Math.pow(deltaY, 0.82) * 1.5, 85);
        setPullDistance(damped);
        if (damped > 12 && e.cancelable) {
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

  return (
    <div className="relative w-full">
      {/* 
        Dead-Center Floating Refresh Indicator:
        Uses full width container with flex justify-center so it is 100% centered horizontally on every mobile screen
      */}
      <div
        className="fixed top-0 left-0 right-0 w-full flex justify-center items-start pointer-events-none z-[9999]"
        style={{
          transform: `translateY(${pullDistance > 0 || isRefreshing ? Math.min(pullDistance * 0.72 + 6, 52) : -50}px)`,
          opacity: pullDistance > 5 || isRefreshing ? 1 : 0,
          transition: isPullingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease'
        }}
      >
        <div className="w-10 h-10 rounded-full bg-stone-900/95 border-2 border-amber-500 shadow-2xl shadow-black/80 flex items-center justify-center backdrop-blur-md">
          <div
            className={`w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
              transition: isRefreshing ? undefined : 'transform 0.05s linear'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
};
