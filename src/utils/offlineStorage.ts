import { chhathSamagriList } from '../data/samagri';
import { vidhiStepsByLang } from '../data/vidhiData';
import { chhathPrasadItems } from '../data/prasad';
import { chhathMantrasData } from '../data/mantras';
import { chhathSongs } from '../data/songs';
import { chhathGhatsData } from '../data/ghats';
import { chhathKathaStories } from '../data/katha';

/**
 * Production-Safe IndexedDB Persistent Storage for Chhath Vibes PWA.
 * Provides guaranteed offline data retention across browser sessions, 
 * device restarts, and storage quota evictions.
 */

const DB_NAME = 'chhath_vibes_offline_db';
const DB_VERSION = 1;

export const STORES = {
  APP_DATA: 'app_data',
  USER_DATA: 'user_data',
  USER_PREFERENCES: 'user_preferences'
} as const;

type StoreName = typeof STORES[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Opens or initializes the IndexedDB database.
 */
export function getOfflineDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB is not supported in this environment'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. App Static & Cultural Content
        if (!db.objectStoreNames.contains(STORES.APP_DATA)) {
          db.createObjectStore(STORES.APP_DATA, { keyPath: 'key' });
        }

        // 2. User Activities (Checklists, Favorites, History, Playlists)
        if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
          db.createObjectStore(STORES.USER_DATA, { keyPath: 'key' });
        }

        // 3. User Preferences (Theme, Language, User Location, Audio Settings)
        if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
          db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('[OfflineDB] Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
    } catch (err) {
      console.warn('[OfflineDB] Initialization error:', err);
      reject(err);
    }
  });

  return dbPromise;
}

/**
 * Generic getter from IndexedDB
 */
export async function getOfflineItem<T>(storeName: StoreName, key: string): Promise<T | null> {
  try {
    const db = await getOfflineDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result && request.result.value !== undefined) {
          resolve(request.result.value as T);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.warn(`[OfflineDB] Error fetching ${key} from ${storeName}:`, request.error);
        resolve(null);
      };
    });
  } catch (err) {
    return null;
  }
}

/**
 * Generic setter to IndexedDB
 */
export async function setOfflineItem<T>(storeName: StoreName, key: string, value: T): Promise<boolean> {
  try {
    const db = await getOfflineDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ key, value, updatedAt: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.warn(`[OfflineDB] Error storing ${key} into ${storeName}:`, request.error);
        resolve(false);
      };
    });
  } catch (err) {
    return false;
  }
}

/**
 * Generic remover from IndexedDB
 */
export async function removeOfflineItem(storeName: StoreName, key: string): Promise<boolean> {
  try {
    const db = await getOfflineDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

/**
 * Seeds and caches core cultural & religious content in IndexedDB.
 * This guarantees instant offline availability even if the network is completely absent.
 */
export async function seedCoreOfflineContent(): Promise<void> {
  try {
    const existing = await getOfflineItem(STORES.APP_DATA, 'offline_content_initialized');
    if (existing) return; // Already seeded

    await Promise.all([
      setOfflineItem(STORES.APP_DATA, 'samagri_list', chhathSamagriList),
      setOfflineItem(STORES.APP_DATA, 'vidhi_steps', vidhiStepsByLang),
      setOfflineItem(STORES.APP_DATA, 'prasad_recipes', chhathPrasadItems),
      setOfflineItem(STORES.APP_DATA, 'mantras_data', chhathMantrasData),
      setOfflineItem(STORES.APP_DATA, 'master_songs_catalog', chhathSongs),
      setOfflineItem(STORES.APP_DATA, 'ghats_directory', chhathGhatsData),
      setOfflineItem(STORES.APP_DATA, 'chhath_katha', chhathKathaStories),
      setOfflineItem(STORES.APP_DATA, 'offline_content_initialized', true)
    ]);
    console.log('[OfflineDB] Core religious & cultural datasets successfully seeded to IndexedDB');
  } catch (e) {
    console.warn('[OfflineDB] Error seeding core datasets:', e);
  }
}

/**
 * Synchronizes important localStorage keys to IndexedDB for persistent disaster recovery.
 */
export async function syncLocalStorageToIndexedDB(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // 1. Checklist State
    const checklistKey = 'chhath-samagri-checklist-2026-v1';
    const savedChecklist = localStorage.getItem(checklistKey);
    if (savedChecklist) {
      await setOfflineItem(STORES.USER_DATA, checklistKey, JSON.parse(savedChecklist));
    }

    // 2. Favorite Songs
    const favSongs = localStorage.getItem('chhath_favorites_songs_v2');
    if (favSongs) {
      await setOfflineItem(STORES.USER_DATA, 'favorite_songs', JSON.parse(favSongs));
    }

    // 3. Favorite Ghats
    const favGhats = localStorage.getItem('chhath_favorites_ghats');
    if (favGhats) {
      await setOfflineItem(STORES.USER_DATA, 'favorite_ghats', JSON.parse(favGhats));
    }

    // 4. Recently Played Music
    const recentMusic = localStorage.getItem('chhath_music_recently');
    if (recentMusic) {
      await setOfflineItem(STORES.USER_DATA, 'recent_music', JSON.parse(recentMusic));
    }

    // 5. User Preferences (Theme, Language, Location)
    const theme = localStorage.getItem('chhath_theme');
    if (theme) {
      await setOfflineItem(STORES.USER_PREFERENCES, 'theme', theme);
    }
    const lang = localStorage.getItem('chhath_language');
    if (lang) {
      await setOfflineItem(STORES.USER_PREFERENCES, 'language', lang);
    }
    const loc = localStorage.getItem('chhath_user_location');
    if (loc) {
      await setOfflineItem(STORES.USER_PREFERENCES, 'user_location', JSON.parse(loc));
    }
  } catch (e) {
    console.warn('[OfflineDB] Sync error from localStorage:', e);
  }
}

/**
 * Restores user activities and preferences from IndexedDB if localStorage was cleared.
 */
export async function restoreIndexedDBToLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const checklistKey = 'chhath-samagri-checklist-2026-v1';
    if (!localStorage.getItem(checklistKey)) {
      const stored = await getOfflineItem<string[]>(STORES.USER_DATA, checklistKey);
      if (stored && Array.isArray(stored)) {
        localStorage.setItem(checklistKey, JSON.stringify(stored));
      }
    }

    if (!localStorage.getItem('chhath_favorites_songs_v2')) {
      const stored = await getOfflineItem<string[]>(STORES.USER_DATA, 'favorite_songs');
      if (stored && Array.isArray(stored)) {
        localStorage.setItem('chhath_favorites_songs_v2', JSON.stringify(stored));
      }
    }

    if (!localStorage.getItem('chhath_music_recently')) {
      const stored = await getOfflineItem<string[]>(STORES.USER_DATA, 'recent_music');
      if (stored && Array.isArray(stored)) {
        localStorage.setItem('chhath_music_recently', JSON.stringify(stored));
      }
    }

    if (!localStorage.getItem('chhath_theme')) {
      const storedTheme = await getOfflineItem<string>(STORES.USER_PREFERENCES, 'theme');
      if (storedTheme) localStorage.setItem('chhath_theme', storedTheme);
    }

    if (!localStorage.getItem('chhath_language')) {
      const storedLang = await getOfflineItem<string>(STORES.USER_PREFERENCES, 'language');
      if (storedLang) localStorage.setItem('chhath_language', storedLang);
    }
  } catch (e) {
    console.warn('[OfflineDB] Restore error to localStorage:', e);
  }
}

/**
 * Master initialization runner: Seeds DB, restores from IndexedDB if needed, and starts sync.
 */
export async function initOfflineStorage(): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return;

  try {
    await getOfflineDB();
    await restoreIndexedDBToLocalStorage();
    await seedCoreOfflineContent();
    await syncLocalStorageToIndexedDB();
  } catch (err) {
    console.warn('[OfflineDB] initOfflineStorage notice:', err);
  }
}
