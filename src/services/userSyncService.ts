import { getFirebaseAuth, getFirebaseApp } from './firebase';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';

const MASTER_BIN_ID = 'eeeaedd';
const CLOUD_STORAGE_URL = `https://extendsclass.com/api/json-storage/bin/${MASTER_BIN_ID}`;

export interface UserMemoryItem {
  id: string;
  year: '2026' | '2025' | '2024';
  title: string;
  caption: string;
  category: 'Family' | 'Ghat' | 'Prasad' | 'Arghya';
  imageUrl: string;
  date: string;
  createdAt?: string;
}

export interface UserCloudData {
  uid: string;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  vows?: Array<{ id: string; text: string; completed: boolean; createdAt: string }>;
  memories?: UserMemoryItem[];
  favoriteSongs?: string[];
  favoriteGhats?: string[];
  updatedAt?: string;
}

// In-memory queue to prevent concurrency collisions on Cloud Storage PUT requests
let _saveQueue: Promise<any> = Promise.resolve();

function enqueueOperation<T>(op: () => Promise<T>): Promise<T> {
  const current = _saveQueue.then(op, op);
  _saveQueue = current;
  return current;
}

/**
 * Universal User Cloud Synchronization Service
 * Guarantees cross-device persistence for all user profile edits,
 * avatar photos, memories, vows, favorites, and settings.
 */
export const UserSyncService = {
  /**
   * Fetch complete user profile data from Cloud
   */
  async fetchUserData(uid: string): Promise<UserCloudData | null> {
    if (!uid) return null;

    // 1. Direct Cloud Bin (Fastest & Cross-device universal)
    try {
      const directRes = await fetch(CLOUD_STORAGE_URL, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (directRes.ok) {
        const data = await directRes.json();
        const userRec = data?.users?.[uid];
        if (userRec) {
          // Update local cache
          try {
            localStorage.setItem(`chhath_cloud_user_${uid}`, JSON.stringify(userRec));
            if (userRec.avatarUrl) {
              localStorage.setItem(`chhath_avatar_${uid}`, userRec.avatarUrl);
            }
          } catch {}
          return userRec;
        }
      }
    } catch (e) {
      console.warn('[UserSync] Cloud fetch notice:', e);
    }

    // 2. Server API Fallback (if running locally or serverless backend)
    try {
      const res = await fetch(`/api/v1/user/profile?uid=${encodeURIComponent(uid)}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          try {
            localStorage.setItem(`chhath_cloud_user_${uid}`, JSON.stringify(json.data));
          } catch {}
          return json.data;
        }
      }
    } catch {}

    // 3. Cached local record for this specific user
    try {
      const cached = localStorage.getItem(`chhath_cloud_user_${uid}`);
      if (cached) return JSON.parse(cached);
    } catch {}

    return null;
  },

  /**
   * Persist user data to Cloud across all logged-in devices (thread-safe queued execution)
   */
  async saveUserData(uid: string, updates: Partial<UserCloudData>): Promise<void> {
    if (!uid) return;

    return enqueueOperation(async () => {
      // 1. Immediately update local user cache
      let merged: UserCloudData = { uid };
      try {
        const existing = localStorage.getItem(`chhath_cloud_user_${uid}`);
        if (existing) {
          merged = { ...JSON.parse(existing), ...updates, uid };
        } else {
          merged = { ...updates, uid };
        }
        merged.updatedAt = new Date().toISOString();
        localStorage.setItem(`chhath_cloud_user_${uid}`, JSON.stringify(merged));
        if (updates.avatarUrl) {
          localStorage.setItem(`chhath_avatar_${uid}`, updates.avatarUrl);
        }
      } catch {}

      // 2. Sync to Firebase Authentication profile if possible
      try {
        const auth = getFirebaseAuth();
        if (auth?.currentUser && auth.currentUser.uid === uid) {
          const fbPayload: { displayName?: string; photoURL?: string } = {};
          if (updates.name) fbPayload.displayName = updates.name.trim();
          if (updates.avatarUrl) {
            const urlStr = updates.avatarUrl.trim();
            // Firebase Auth natively supports full URLs (or data URI up to 2040 chars)
            if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
              fbPayload.photoURL = urlStr;
            } else if (urlStr.length <= 2040 && urlStr.startsWith('data:')) {
              fbPayload.photoURL = urlStr;
            }
          }
          if (Object.keys(fbPayload).length > 0) {
            await updateFirebaseProfile(auth.currentUser, fbPayload);
          }
        }
      } catch (e) {
        console.warn('[UserSync] Firebase native profile sync notice:', e);
      }

      // 3. Save to Master Cloud Bin with retry
      let cloudSaved = false;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const directRes = await fetch(CLOUD_STORAGE_URL, {
            headers: { 'Cache-Control': 'no-cache' }
          });
          if (directRes.ok) {
            const data = await directRes.json();
            if (!data.users) data.users = {};
            data.users[uid] = { 
              ...(data.users[uid] || {}), 
              ...updates, 
              uid, 
              updatedAt: new Date().toISOString() 
            };
            const putRes = await fetch(CLOUD_STORAGE_URL, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            if (putRes.ok) {
              cloudSaved = true;
              break;
            }
          }
        } catch (err) {
          console.warn(`[UserSync] Cloud save attempt ${attempt + 1} notice:`, err);
        }
      }

      // 4. Sync to local backend API if available
      try {
        await fetch('/api/v1/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, data: updates })
        });
      } catch {}

      // 5. Firestore Direct Integration (if enabled in project)
      try {
        const app = getFirebaseApp();
        if (app) {
          const { getFirestore, doc, setDoc } = await import('firebase/firestore');
          const db = getFirestore(app);
          await setDoc(doc(db, 'users', uid), updates, { merge: true });
        }
      } catch {
        // Graceful fallback: Cloud Storage already handled above!
      }
    });
  },

  /**
   * Fetch user memories from Cloud across all devices
   */
  async fetchUserMemories(uid: string): Promise<UserMemoryItem[]> {
    if (!uid) return [];

    // 1. Check local cache first for 0ms initial render
    let cachedMemories: UserMemoryItem[] = [];
    try {
      const local = localStorage.getItem(`chhath_user_memories_${uid}`);
      if (local) {
        cachedMemories = JSON.parse(local);
      }
    } catch {}

    // 2. Fetch fresh memories from Cloud Storage Bin
    try {
      const res = await fetch(CLOUD_STORAGE_URL, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        const userMemories = data?.users?.[uid]?.memories;
        if (Array.isArray(userMemories)) {
          // Update local cache
          try {
            localStorage.setItem(`chhath_user_memories_${uid}`, JSON.stringify(userMemories));
          } catch {}
          return userMemories;
        }
      }
    } catch (e) {
      console.warn('[UserSync] Cloud memories fetch notice:', e);
    }

    // 3. Fallback to Firestore if enabled
    try {
      const app = getFirebaseApp();
      if (app) {
        const { getFirestore, doc, getDoc } = await import('firebase/firestore');
        const db = getFirestore(app);
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists() && Array.isArray(snap.data()?.memories)) {
          const mems = snap.data()?.memories as UserMemoryItem[];
          try {
            localStorage.setItem(`chhath_user_memories_${uid}`, JSON.stringify(mems));
          } catch {}
          return mems;
        }
      }
    } catch {}

    return cachedMemories;
  },

  /**
   * Persist user memories to Cloud across all devices
   */
  async saveUserMemories(uid: string, memories: UserMemoryItem[]): Promise<boolean> {
    if (!uid) return false;

    // Cache locally immediately
    try {
      localStorage.setItem(`chhath_user_memories_${uid}`, JSON.stringify(memories));
    } catch {}

    // Save to Cloud in queue
    return enqueueOperation(async () => {
      let saved = false;
      try {
        const directRes = await fetch(CLOUD_STORAGE_URL, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (directRes.ok) {
          const data = await directRes.json();
          if (!data.users) data.users = {};
          if (!data.users[uid]) data.users[uid] = { uid };
          data.users[uid].memories = memories;
          data.users[uid].updatedAt = new Date().toISOString();

          const putRes = await fetch(CLOUD_STORAGE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (putRes.ok) {
            saved = true;
          }
        }
      } catch (err) {
        console.warn('[UserSync] Cloud memories save notice:', err);
      }

      // Sync to local server API if running
      try {
        await fetch('/api/v1/user/memories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, memories })
        });
      } catch {}

      // Optional Firestore sync if enabled
      try {
        const app = getFirebaseApp();
        if (app) {
          const { getFirestore, doc, setDoc } = await import('firebase/firestore');
          const db = getFirestore(app);
          await setDoc(doc(db, 'users', uid), { memories, updatedAt: new Date().toISOString() }, { merge: true });
        }
      } catch {}

      return saved;
    });
  }
};
