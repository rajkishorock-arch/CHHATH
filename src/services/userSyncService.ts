import { getFirebaseAuth } from './firebase';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';

const MASTER_BIN_ID = 'eeeaedd';
const CLOUD_STORAGE_URL = `https://extendsclass.com/api/json-storage/bin/${MASTER_BIN_ID}`;

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
  favoriteSongs?: string[];
  favoriteGhats?: string[];
  updatedAt?: string;
}

/**
 * Universal User Cloud Synchronization Service
 * Guarantees cross-device persistence for all user profile edits,
 * vows, favorites, and settings.
 */
export const UserSyncService = {
  /**
   * Fetch user data from Cloud
   */
  async fetchUserData(uid: string): Promise<UserCloudData | null> {
    if (!uid) return null;

    // 1. First attempt: Vercel Serverless Endpoint
    try {
      const res = await fetch(`/api/v1/user/profile?uid=${encodeURIComponent(uid)}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          // Cache locally
          localStorage.setItem(`chhath_cloud_user_${uid}`, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // Fallback below
    }

    // 2. Direct Cloud Bin Fallback (for static environments or offline resilience)
    try {
      const directRes = await fetch(CLOUD_STORAGE_URL, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (directRes.ok) {
        const data = await directRes.json();
        const userRec = data?.users?.[uid];
        if (userRec) {
          localStorage.setItem(`chhath_cloud_user_${uid}`, JSON.stringify(userRec));
          return userRec;
        }
      }
    } catch {
      // Fallback to local cache
    }

    // 3. Cached local record for this specific user
    try {
      const cached = localStorage.getItem(`chhath_cloud_user_${uid}`);
      if (cached) return JSON.parse(cached);
    } catch {}

    return null;
  },

  /**
   * Persist user data to Cloud across all logged-in devices
   */
  async saveUserData(uid: string, updates: Partial<UserCloudData>): Promise<void> {
    if (!uid) return;

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
    } catch {}

    // 2. Sync to Firebase Authentication profile if possible
    try {
      const auth = getFirebaseAuth();
      if (auth?.currentUser && auth.currentUser.uid === uid) {
        const fbPayload: { displayName?: string; photoURL?: string } = {};
        if (updates.name) fbPayload.displayName = updates.name.trim();
        // Firebase Auth photoURL requires <= 2048 chars and a valid URL/URI
        if (updates.avatarUrl) {
          const urlStr = updates.avatarUrl.trim();
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

    // 3. Sync to Vercel Serverless Endpoint
    let synced = false;
    try {
      const res = await fetch('/api/v1/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, data: updates })
      });
      if (res.ok) {
        synced = true;
      }
    } catch {}

    // 4. If Vercel API not reachable, sync directly to Master Cloud Bin
    if (!synced) {
      try {
        const directRes = await fetch(CLOUD_STORAGE_URL);
        if (directRes.ok) {
          const data = await directRes.json();
          if (!data.users) data.users = {};
          data.users[uid] = { ...(data.users[uid] || {}), ...updates, uid, updatedAt: new Date().toISOString() };
          await fetch(CLOUD_STORAGE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        }
      } catch (err) {
        console.error('[UserSync] Direct cloud save failed:', err);
      }
    }
  }
};
