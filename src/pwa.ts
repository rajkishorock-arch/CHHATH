import { registerSW } from 'virtual:pwa-register';

/**
 * PWA Service Worker Registration & Lifecycle Management.
 * Registers the background service worker for offline caching,
 * static asset precaching, and silent background updates.
 */
export function initPWA() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          console.log('[PWA] New update available, refreshing caches in background...');
          updateSW(true);
        },
        onOfflineReady() {
          console.log('[PWA] Chhath Vibes application is now fully cached for offline use.');
          window.dispatchEvent(new CustomEvent('chhath_pwa_ready'));
        },
        onRegisterError(error) {
          console.warn('[PWA] Service worker registration error:', error);
        }
      });
    } catch (err) {
      console.warn('[PWA] Service worker setup failed:', err);
    }
  }
}
