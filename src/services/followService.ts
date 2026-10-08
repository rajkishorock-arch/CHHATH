import { getFirebaseFirestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment 
} from 'firebase/firestore';
import { ReelUser } from '../types';
import { ReelsStorage } from './reelsStorage';

const CLOUD_STORAGE_URL = 'https://extendsclass.com/api/json-storage/bin/eeeaedd';

export interface FollowDetails {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export const FollowService = {
  /**
   * Sync all real devotees from Firestore to local cache so they are searchable by @username
   */
  async syncAllRealUsers(): Promise<ReelUser[]> {
    const db = getFirebaseFirestore();
    const realUsers: ReelUser[] = [];
    const seenIds = new Set<string>();

    if (db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const uid = docSnap.id;
          if (!seenIds.has(uid)) {
            seenIds.add(uid);
            const user: ReelUser = {
              id: uid,
              user_id: uid,
              name: data.name || 'छठ श्रद्धालु',
              username: data.username || `@devotee_${uid.slice(0, 5)}`,
              email: data.email || '',
              avatarUrl: data.avatarUrl || '',
              bio: data.bio || 'जय छठी मइया 🙏',
              city: data.city || 'बिहार',
              state: data.state || 'बिहार',
              country: 'India',
              language: 'hi',
              role: 'user',
              followersCount: Array.isArray(data.followers) ? data.followers.length : (data.followersCount || 0),
              followingCount: Array.isArray(data.following) ? data.following.length : (data.followingCount || 0),
              totalLikesCount: 0,
              reelsCount: 0,
              verified: Boolean(data.verified),
              isPrivate: Boolean(data.isPrivate || data.is_private),
              is_private: Boolean(data.isPrivate || data.is_private),
              interests: [],
              onboardingCompleted: true,
              createdAt: data.createdAt || new Date().toISOString()
            };
            realUsers.push(user);
            // Merge into local ReelsStorage
            const existing = ReelsStorage.findUserById(uid);
            if (!existing) {
              ReelsStorage.addUser(user);
            } else {
              ReelsStorage.updateUser(uid, user);
            }
          }
        });
      } catch (err) {
        console.warn('[FollowService] Firestore sync notice:', err);
      }
    }

    // Also check Cloud Bin
    try {
      const res = await fetch(CLOUD_STORAGE_URL, { headers: { 'Cache-Control': 'no-cache' } });
      if (res.ok) {
        const json = await res.json();
        const usersMap = json?.users || {};
        for (const uid of Object.keys(usersMap)) {
          if (!seenIds.has(uid)) {
            seenIds.add(uid);
            const u = usersMap[uid];
            const user: ReelUser = {
              id: uid,
              user_id: uid,
              name: u.name || 'छठ श्रद्धालु',
              username: u.username || `@devotee_${uid.slice(0, 5)}`,
              email: u.email || '',
              avatarUrl: u.avatarUrl || '',
              bio: u.bio || 'जय छठी मइया 🙏',
              city: u.city || 'बिहार',
              state: u.state || 'बिहार',
              country: 'India',
              language: 'hi',
              role: 'user',
              followersCount: Array.isArray(u.followers) ? u.followers.length : (u.followersCount || 0),
              followingCount: Array.isArray(u.following) ? u.following.length : (u.followingCount || 0),
              totalLikesCount: 0,
              reelsCount: 0,
              verified: false,
              interests: [],
              onboardingCompleted: true,
              createdAt: u.updatedAt || new Date().toISOString()
            };
            realUsers.push(user);
            const existing = ReelsStorage.findUserById(uid);
            if (!existing) {
              ReelsStorage.addUser(user);
            } else {
              ReelsStorage.updateUser(uid, user);
            }
          }
        }
      }
    } catch {}

    return realUsers;
  },

  /**
   * Real end-to-end follow/unfollow toggle with Firestore synchronization
   */
  async toggleFollow(currentUserId: string, targetUserId: string): Promise<FollowDetails> {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      return { isFollowing: false, followersCount: 0, followingCount: 0 };
    }

    // 1. Instant local optimistic update
    const isNowFollowing = ReelsStorage.toggleFollow(currentUserId, targetUserId);
    const targetLocal = ReelsStorage.findUserById(targetUserId);
    const currentLocal = ReelsStorage.findUserById(currentUserId);

    const followersCount = targetLocal?.followersCount ?? 0;
    const followingCount = currentLocal?.followingCount ?? 0;

    // 2. Persist to Google Cloud Firestore
    const db = getFirebaseFirestore();
    if (db) {
      try {
        const currentUserRef = doc(db, 'users', currentUserId);
        const targetUserRef = doc(db, 'users', targetUserId);

        if (isNowFollowing) {
          // Current user starts following target user
          await setDoc(currentUserRef, {
            following: arrayUnion(targetUserId),
            followingCount: increment(1),
            updatedAt: new Date().toISOString()
          }, { merge: true });

          await setDoc(targetUserRef, {
            followers: arrayUnion(currentUserId),
            followersCount: increment(1),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } else {
          // Current user unfollows target user
          await setDoc(currentUserRef, {
            following: arrayRemove(targetUserId),
            followingCount: increment(-1),
            updatedAt: new Date().toISOString()
          }, { merge: true });

          await setDoc(targetUserRef, {
            followers: arrayRemove(currentUserId),
            followersCount: increment(-1),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (err) {
        console.warn('[FollowService] Firestore follow update error:', err);
      }
    }

    return {
      isFollowing: isNowFollowing,
      followersCount,
      followingCount
    };
  },

  /**
   * Get list of real devotees following a user
   */
  async getFollowers(userId: string): Promise<ReelUser[]> {
    if (!userId) return [];
    const db = getFirebaseFirestore();
    const followerIds: string[] = [];

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.followers)) {
            followerIds.push(...data.followers);
          }
        }
      } catch (err) {
        console.warn('[FollowService] Fetch followers notice:', err);
      }
    }

    // Local storage fallback for follows map
    const followsMap = ReelsStorage.getFollowsMap();
    Object.keys(followsMap).forEach((key) => {
      if (followsMap[key]) {
        const [follower, target] = key.split('_');
        if (target === userId && !followerIds.includes(follower)) {
          followerIds.push(follower);
        }
      }
    });

    // Resolve user objects
    const followers: ReelUser[] = [];
    for (const fId of followerIds) {
      let u = ReelsStorage.findUserById(fId);
      if (!u && db) {
        try {
          const uSnap = await getDoc(doc(db, 'users', fId));
          if (uSnap.exists()) {
            const d = uSnap.data();
            u = {
              id: fId,
              user_id: fId,
              name: d.name || 'छठ श्रद्धालु',
              username: d.username || `@devotee_${fId.slice(0, 5)}`,
              email: d.email || '',
              avatarUrl: d.avatarUrl || '',
              bio: d.bio || '',
              city: d.city || 'बिहार',
              state: d.state || 'बिहार',
              country: 'India',
              language: 'hi',
              role: 'user',
              followersCount: d.followersCount || 0,
              followingCount: d.followingCount || 0,
              totalLikesCount: 0,
              reelsCount: 0,
              verified: Boolean(d.verified),
              interests: [],
              onboardingCompleted: true,
              createdAt: d.createdAt || new Date().toISOString()
            };
          }
        } catch {}
      }
      if (u) followers.push(u);
    }

    return followers;
  },

  /**
   * Get list of real devotees a user is following
   */
  async getFollowing(userId: string): Promise<ReelUser[]> {
    if (!userId) return [];
    const db = getFirebaseFirestore();
    const followingIds: string[] = [];

    if (db) {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.following)) {
            followingIds.push(...data.following);
          }
        }
      } catch (err) {
        console.warn('[FollowService] Fetch following notice:', err);
      }
    }

    // Local storage fallback
    const followsMap = ReelsStorage.getFollowsMap();
    Object.keys(followsMap).forEach((key) => {
      if (followsMap[key]) {
        const [follower, target] = key.split('_');
        if (follower === userId && !followingIds.includes(target)) {
          followingIds.push(target);
        }
      }
    });

    const following: ReelUser[] = [];
    for (const tId of followingIds) {
      let u = ReelsStorage.findUserById(tId);
      if (!u && db) {
        try {
          const uSnap = await getDoc(doc(db, 'users', tId));
          if (uSnap.exists()) {
            const d = uSnap.data();
            u = {
              id: tId,
              user_id: tId,
              name: d.name || 'छठ श्रद्धालु',
              username: d.username || `@devotee_${tId.slice(0, 5)}`,
              email: d.email || '',
              avatarUrl: d.avatarUrl || '',
              bio: d.bio || '',
              city: d.city || 'बिहार',
              state: d.state || 'बिहार',
              country: 'India',
              language: 'hi',
              role: 'user',
              followersCount: d.followersCount || 0,
              followingCount: d.followingCount || 0,
              totalLikesCount: 0,
              reelsCount: 0,
              verified: Boolean(d.verified),
              interests: [],
              onboardingCompleted: true,
              createdAt: d.createdAt || new Date().toISOString()
            };
          }
        } catch {}
      }
      if (u) following.push(u);
    }

    return following;
  }
};
