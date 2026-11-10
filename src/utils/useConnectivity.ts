import { useState, useEffect, useCallback } from 'react';
import { syncLocalStorageToIndexedDB } from './offlineStorage';

/**
 * Custom React hook and utility for production-grade connectivity tracking.
 * Accurately monitors network state, triggers offline storage persistence,
 * and recovers gracefully upon reconnection.
 */
export function useConnectivity() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });

  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('[Connectivity] Internet restored. Back online.');
      setIsOnline(true);
      setWasOffline(true);

      // Sync any offline modifications to persistent storage
      syncLocalStorageToIndexedDB();

      // Clear the temporary wasOffline flag after 4 seconds
      const timer = setTimeout(() => {
        setWasOffline(false);
      }, 4000);

      window.dispatchEvent(new CustomEvent('chhath_network_status', { detail: { isOnline: true } }));
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      console.log('[Connectivity] Network disconnected. Switched to offline mode.');
      setIsOnline(false);

      // Persist all user states to IndexedDB immediately before connection drop
      syncLocalStorageToIndexedDB();

      window.dispatchEvent(new CustomEvent('chhath_network_status', { detail: { isOnline: false } }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

/**
 * Lightweight helper to test true network reachability if needed
 */
export async function testOnlineReachability(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    // Fast cache-busted favicon or lightweight ping
    const res = await fetch('/favicon.png?_ping=' + Date.now(), {
      method: 'HEAD',
      cache: 'no-store'
    });
    return res.ok;
  } catch {
    return false;
  }
}
