import { ReelUser, Language, UserSettings, ActiveSession, SocialFollowStatus } from '../types';
import { ReelsStorage } from './reelsStorage';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured } from './firebase';

const API_BASE = '/api/v1';
const TOKEN_KEY = 'chhath_auth_session_token';

export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua) || window.innerWidth <= 768;
}

// Convert Firebase user to frontend ReelUser format
export function mapFirebaseUserToReelUser(fbUser: FirebaseUser): ReelUser {
  const displayName = fbUser.displayName || 'छठ श्रद्धालु';
  const emailPrefix = fbUser.email ? fbUser.email.split('@')[0] : 'devotee';
  const cleanUsername = `@${emailPrefix.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()}`;

  return {
    id: fbUser.uid,
    user_id: fbUser.uid,
    name: displayName,
    username: cleanUsername,
    email: fbUser.email || '',
    avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    coverUrl: '',
    website: '',
    bio: 'छठी मईया की जय! 🙏 सूर्य उपासना के पावन पर्व पर हार्दिक शुभकामनाएं।',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    language: 'hi',
    role: 'user',
    followersCount: 1,
    followingCount: 3,
    totalLikesCount: 12,
    reelsCount: 0,
    verified: true,
    interests: ['songs', 'vidhi', 'ghats', 'prasad'],
    onboardingCompleted: true,
    createdAt: fbUser.metadata.creationTime || new Date().toISOString()
  };
}

// Convert backend profile to frontend ReelUser format
export function mapBackendProfileToReelUser(profile: any): ReelUser {
  if (!profile) throw new Error('Invalid profile');
  const userId = profile.user_id || profile.id;
  const rawLang = profile.language || 'hi';
  const validLangs: Language[] = ['hi', 'en', 'bho', 'mai', 'mag'];
  const language: Language = validLangs.includes(rawLang) ? rawLang : 'hi';

  return {
    id: userId,
    user_id: userId,
    name: profile.display_name || profile.name || '',
    username: profile.username || '',
    email: profile.email || '',
    avatarUrl: profile.avatar_url || profile.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    coverUrl: profile.cover_url || profile.coverUrl || '',
    website: profile.website || '',
    bio: profile.bio || '',
    city: profile.city || 'Patna',
    state: profile.state || 'Bihar',
    country: profile.country || 'India',
    language,
    role: profile.role || 'user',
    followersCount: profile.followers_count ?? profile.followersCount ?? 0,
    followingCount: profile.following_count ?? profile.followingCount ?? 0,
    totalLikesCount: profile.total_likes_count ?? profile.totalLikesCount ?? 0,
    reelsCount: profile.reels_count ?? profile.reelsCount ?? 0,
    verified: Boolean(profile.is_verified ?? profile.verified),
    isPrivate: Boolean(profile.is_private ?? profile.isPrivate),
    is_private: Boolean(profile.is_private ?? profile.isPrivate),
    interests: profile.interests || ['songs', 'vidhi', 'ghats'],
    onboardingCompleted: Boolean(profile.onboarding_completed ?? profile.onboardingCompleted),
    createdAt: profile.created_at || profile.createdAt || new Date().toISOString()
  };
}

function getDefaultSettings(user?: ReelUser | null): UserSettings {
  return {
    id: user ? `set_${user.id}` : 'set_default',
    user_id: user?.id || 'usr_guest',
    is_private_account: Boolean(user?.isPrivate),
    who_can_message: 'everyone',
    who_can_call: 'everyone',
    who_can_comment: 'everyone',
    show_activity_status: true,
    two_factor_enabled: false,
    ai_personalization_enabled: true,
    ai_voice_enabled: true,
    ai_chat_suggestions: true,
    updated_at: new Date().toISOString()
  };
}

async function safeFetchJson(url: string, init?: RequestInit): Promise<any> {
  try {
    const res = await fetch(url, init);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

export const AuthService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string | null): void {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  createDevoteeSession(devoteeName?: string): { success: boolean; user: ReelUser; settings: UserSettings; token: string } {
    const rawName = (devoteeName && devoteeName.trim()) || 'छठ श्रद्धालु';
    const cleanUsername = `@devotee_${Date.now().toString().slice(-4)}`;
    const sessionToken = `devotee_token_${Date.now()}`;
    
    const newUser: ReelUser = {
      id: `usr_${Date.now()}`,
      user_id: `usr_${Date.now()}`,
      name: rawName,
      username: cleanUsername,
      email: `${cleanUsername.replace('@', '')}@chhath.dev`,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      coverUrl: '',
      website: '',
      bio: 'छठी मईया की जय! 🙏 सूर्य उपासना के पावन पर्व पर हार्दिक शुभकामनाएं।',
      city: 'पटना (Patna)',
      state: 'बिहार (Bihar)',
      country: 'भारत (India)',
      language: 'hi',
      role: 'user',
      followersCount: 1,
      followingCount: 3,
      totalLikesCount: 24,
      reelsCount: 0,
      verified: true,
      interests: ['songs', 'vidhi', 'ghats', 'prasad'],
      onboardingCompleted: true,
      createdAt: new Date().toISOString()
    };

    const settings = getDefaultSettings(newUser);
    this.setToken(sessionToken);
    ReelsStorage.addUser(newUser);
    ReelsStorage.setSession(newUser);

    return {
      success: true,
      user: newUser,
      settings,
      token: sessionToken
    };
  },

  async signInWithGoogle(): Promise<{ 
    success: boolean; 
    user?: ReelUser; 
    settings?: UserSettings; 
    token?: string; 
    error?: string;
  }> {
    const auth = getFirebaseAuth();
    const googleProvider = getGoogleProvider();

    if (!auth || !googleProvider) {
      return {
        success: false,
        error: 'Google Authentication सेवा लोड हो रही है। कृपया कुछ क्षण बाद पुनः प्रयास करें।'
      };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const mapped = mapFirebaseUserToReelUser(result.user);
      const settings = getDefaultSettings(mapped);
      const sessionToken = `fb_token_${result.user.uid}`;
      
      this.setToken(sessionToken);
      ReelsStorage.addUser(mapped);
      ReelsStorage.setSession(mapped);

      return {
        success: true,
        user: mapped,
        settings,
        token: sessionToken
      };
    } catch (err: any) {
      console.warn('[AuthService] Google sign-in error:', err);
      const code = err?.code || '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { 
          success: false, 
          error: 'साइन-इन विंडो बंद कर दी गई। कृपया दोबारा कोशिश करें।' 
        };
      }
      if (code === 'auth/popup-blocked') {
        return { 
          success: false, 
          error: 'ब्राउज़र ने Google साइन-इन विंडो को ब्लॉक कर दिया है। कृपया एड्रेस बार में पॉप-अप (Pop-ups) की अनुमति दें और पुनः प्रयास करें।' 
        };
      }
      if (code === 'auth/unauthorized-domain') {
        return { 
          success: false, 
          error: 'यह डोमेन Firebase Authorized Domains में शामिल नहीं है। कृपया Firebase Console में chhathvibes.vercel.app जोड़ें।' 
        };
      }
      if (code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'नेटवर्क कनेक्शन में समस्या आई। कृपया इंटरनेट चेक करके पुनः प्रयास करें।'
        };
      }
      if (code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          error: 'इस ईमेल से पहले ही एक खाता मौजूद है।'
        };
      }
      if (code === 'auth/invalid-credential') {
        return {
          success: false,
          error: 'प्रमाणीकरण क्रेडेंशियल अमान्य है। कृपया पुनः प्रयास करें।'
        };
      }
      if (code === 'auth/internal-error') {
        return {
          success: false,
          error: 'Google प्रमाणीकरण सेवा में अस्थायी रुकावट है। कृपया कुछ क्षण बाद पुनः प्रयास करें।'
        };
      }

      return { 
        success: false, 
        error: err.message || 'Google साइन-इन अस्थायी रूप से अनुपलब्ध है। कृपया पुनः प्रयास करें।' 
      };
    }
  },

  async handleRedirectResult(): Promise<ReelUser | null> {
    const auth = getFirebaseAuth();
    if (!auth) return null;
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const mapped = mapFirebaseUserToReelUser(result.user);
        const sessionToken = `fb_token_${result.user.uid}`;
        this.setToken(sessionToken);
        ReelsStorage.addUser(mapped);
        ReelsStorage.setSession(mapped);

        try {
          const returnUrl = sessionStorage.getItem('chhath_auth_return_url');
          sessionStorage.removeItem('chhath_auth_return_url');
          if (returnUrl) {
            const url = new URL(returnUrl);
            if (url.hash && window.location.hash !== url.hash) {
              window.location.hash = url.hash;
            }
          }
        } catch (e) {}

        return mapped;
      }
    } catch (err: any) {
      console.warn('[AuthService] handleRedirectResult notice:', err);
    }
    return null;
  },

  subscribeToAuthChanges(callback: (user: ReelUser | null) => void): (() => void) {
    const auth = getFirebaseAuth();
    if (!auth) {
      return () => {};
    }
    return onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const mapped = mapFirebaseUserToReelUser(fbUser);
        ReelsStorage.setSession(mapped);
        callback(mapped);
      } else {
        callback(null);
      }
    });
  },

  async signup(data: {
    name: string;
    username?: string;
    email: string;
    password: string;
    avatarUrl?: string;
    bio?: string;
    city?: string;
    state?: string;
    country?: string;
    language?: string;
    role?: 'user' | 'creator';
  }): Promise<{ success: boolean; user?: ReelUser; settings?: UserSettings; token?: string; error?: string }> {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase Auth लोड नहीं हुआ है।' };
    }

    const trimmedEmail = data.email.trim();
    const trimmedName = data.name.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'कृपया अपना पूरा नाम दर्ज करें।' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'कृपया एक वैध ईमेल पता दर्ज करें।' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, data.password);
      
      // Update Firebase Profile with real Display Name
      try {
        await updateFirebaseProfile(userCredential.user, {
          displayName: trimmedName
        });
      } catch (e) {}

      const mapped = mapFirebaseUserToReelUser(userCredential.user);
      mapped.name = trimmedName;
      if (data.city) mapped.city = data.city;
      if (data.state) mapped.state = data.state;
      if (data.bio) mapped.bio = data.bio;

      const settings = getDefaultSettings(mapped);
      const sessionToken = `fb_token_${userCredential.user.uid}`;

      this.setToken(sessionToken);
      ReelsStorage.addUser(mapped);
      ReelsStorage.setSession(mapped);

      return {
        success: true,
        user: mapped,
        settings,
        token: sessionToken
      };
    } catch (err: any) {
      console.warn('[AuthService] Firebase signup error:', err);
      const code = err?.code || '';

      let friendlyError = 'खाता बनाने में समस्या आई। कृपया पुनः प्रयास करें।';
      if (code === 'auth/email-already-in-use') {
        friendlyError = 'इस ईमेल से पहले से खाता बना हुआ है। कृपया "लॉग इन करें" चुनें।';
      } else if (code === 'auth/weak-password') {
        friendlyError = 'पासवर्ड बहुत कमजोर है। कम से कम 6 अक्षर दर्ज करें।';
      } else if (code === 'auth/invalid-email') {
        friendlyError = 'कृपया एक वैध ईमेल पता दर्ज करें।';
      } else if (code === 'auth/network-request-failed') {
        friendlyError = 'इंटरनेट कनेक्शन में समस्या आई। नेटवर्क चेक करें।';
      }

      return {
        success: false,
        error: friendlyError
      };
    }
  },

  async login(
    emailOrUsername: string,
    pass: string
  ): Promise<{ success: boolean; user?: ReelUser; settings?: UserSettings; token?: string; error?: string }> {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase Auth लोड नहीं हुआ है।' };
    }

    const trimmedInput = emailOrUsername.trim();
    if (!trimmedInput) {
      return { success: false, error: 'कृपया ईमेल पता दर्ज करें।' };
    }
    if (!pass) {
      return { success: false, error: 'कृपया पासवर्ड दर्ज करें।' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedInput, pass);
      const mapped = mapFirebaseUserToReelUser(userCredential.user);
      const settings = getDefaultSettings(mapped);
      const sessionToken = `fb_token_${userCredential.user.uid}`;

      this.setToken(sessionToken);
      ReelsStorage.addUser(mapped);
      ReelsStorage.setSession(mapped);

      return {
        success: true,
        user: mapped,
        settings,
        token: sessionToken
      };
    } catch (err: any) {
      console.warn('[AuthService] Firebase login error:', err);
      const code = err?.code || '';

      let friendlyError = 'लॉगिन विफल रहा। कृपया अपनी जानकारी पुनः जांचें।';
      if (code === 'auth/user-not-found') {
        friendlyError = 'इस ईमेल से कोई खाता नहीं मिला। कृपया पहले "नया खाता बनाएं" चुनें।';
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        friendlyError = 'गलत ईमेल या पासवर्ड। कृपया पुनः जांचें।';
      } else if (code === 'auth/invalid-email') {
        friendlyError = 'कृपया एक वैध ईमेल पता दर्ज करें।';
      } else if (code === 'auth/user-disabled') {
        friendlyError = 'यह खाता अक्षम कर दिया गया है।';
      } else if (code === 'auth/too-many-requests') {
        friendlyError = 'अत्यधिक गलत प्रयासों के कारण खाता अस्थायी रूप से लॉक है। थोड़ी देर बाद प्रयास करें।';
      } else if (code === 'auth/network-request-failed') {
        friendlyError = 'इंटरनेट कनेक्शन में समस्या आई। नेटवर्क चेक करें।';
      }

      return {
        success: false,
        error: friendlyError
      };
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase Auth लोड नहीं हुआ है।' };
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'कृपया एक वैध ईमेल पता दर्ज करें।' };
    }
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      return { success: true };
    } catch (err: any) {
      console.warn('[AuthService] Firebase reset password error:', err);
      const code = err?.code || '';
      let friendlyError = 'पासवर्ड रीसेट लिंक भेजने में समस्या आई।';
      if (code === 'auth/user-not-found') {
        friendlyError = 'इस ईमेल से कोई खाता पंजीकृत नहीं है।';
      } else if (code === 'auth/invalid-email') {
        friendlyError = 'कृपया एक वैध ईमेल पता दर्ज करें।';
      } else if (code === 'auth/too-many-requests') {
        friendlyError = 'कृपया थोड़ी देर बाद पुनः प्रयास करें।';
      }
      return { success: false, error: friendlyError };
    }
  },

  async getSession(): Promise<{ user: ReelUser; settings: UserSettings } | null> {
    const token = this.getToken();
    if (!token || token.startsWith('demo_token_') || token.startsWith('local_')) {
      const local = ReelsStorage.getSession();
      return local ? { user: local, settings: getDefaultSettings(local) } : null;
    }

    // 1. Try backend
    const apiData = await safeFetchJson(`${API_BASE}/auth/session`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (apiData && apiData.success && apiData.user) {
      const mapped = mapBackendProfileToReelUser(apiData.user);
      ReelsStorage.setSession(mapped);
      return {
        user: mapped,
        settings: apiData.settings || getDefaultSettings(mapped)
      };
    }

    // 2. Client fallback
    const local = ReelsStorage.getSession();
    if (local) {
      return {
        user: local,
        settings: getDefaultSettings(local)
      };
    }
    return null;
  },

  async logout(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('[AuthService] Firebase signout error:', e);
    }
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {}
    }
    this.setToken(null);
    ReelsStorage.setSession(null);
  },

  async logoutAll(keepCurrent = false): Promise<number> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ keepCurrent })
        });
      } catch {}
    }
    if (!keepCurrent) {
      this.setToken(null);
      ReelsStorage.setSession(null);
    }
    return 1;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'कृपया पुनः लॉगिन करें।' };
    
    const apiData = await safeFetchJson(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    if (apiData) {
      return { success: Boolean(apiData.success), error: apiData.error };
    }

    return { success: true };
  },

  async deleteAccount(confirmation: string): Promise<{ success: boolean; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'कृपया पुनः लॉगिन करें।' };

    const apiData = await safeFetchJson(`${API_BASE}/auth/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ confirmation })
    });

    this.setToken(null);
    ReelsStorage.setSession(null);
    return { success: true };
  },

  async updateProfile(updates: Partial<ReelUser>): Promise<ReelUser | null> {
    const token = this.getToken();
    const current = ReelsStorage.getSession();
    const userId = current?.id || 'usr_current';

    // 1. Update in local storage
    const updated = ReelsStorage.updateUser(userId, updates) || { ...(current || ({} as ReelUser)), ...updates };
    ReelsStorage.setSession(updated);

    // 2. Sync to backend if token exists
    if (token) {
      const payload: any = {};
      if (updates.name !== undefined) payload.display_name = updates.name;
      if (updates.username !== undefined) payload.username = updates.username;
      if (updates.bio !== undefined) payload.bio = updates.bio;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.coverUrl !== undefined) payload.cover_url = updates.coverUrl;
      if (updates.website !== undefined) payload.website = updates.website;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.state !== undefined) payload.state = updates.state;
      if (updates.country !== undefined) payload.country = updates.country;
      if (updates.language !== undefined) payload.language = updates.language;
      if (updates.interests !== undefined) payload.interests = updates.interests;
      if (updates.onboardingCompleted !== undefined) payload.onboarding_completed = updates.onboardingCompleted;

      safeFetchJson(`${API_BASE}/profiles/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }

    return updated;
  },

  async getProfileById(userId: string): Promise<{ profile: ReelUser; followStatus: SocialFollowStatus; isBlocked: boolean } | null> {
    const token = this.getToken();
    if (token) {
      const apiData = await safeFetchJson(`${API_BASE}/profiles/${encodeURIComponent(userId)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (apiData && apiData.success && apiData.profile) {
        return {
          profile: mapBackendProfileToReelUser(apiData.profile),
          followStatus: apiData.followStatus || 'none',
          isBlocked: Boolean(apiData.isBlocked)
        };
      }
    }

    const localUser = ReelsStorage.findUserById(userId);
    if (!localUser) return null;

    const session = ReelsStorage.getSession();
    const isFollowing = session ? ReelsStorage.isFollowing(session.id, localUser.id) : false;
    const isBlocked = session ? ReelsStorage.getBlockedUsers(session.id).includes(localUser.id) : false;

    return {
      profile: localUser,
      followStatus: isFollowing ? 'accepted' : 'none',
      isBlocked
    };
  },

  async getProfileByUsername(username: string): Promise<{ profile: ReelUser; followStatus: SocialFollowStatus } | null> {
    const token = this.getToken();
    if (token) {
      const apiData = await safeFetchJson(`${API_BASE}/profiles/by-username/${encodeURIComponent(username)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (apiData && apiData.success && apiData.profile) {
        return {
          profile: mapBackendProfileToReelUser(apiData.profile),
          followStatus: apiData.followStatus || 'none'
        };
      }
    }

    const localUser = ReelsStorage.findUserByUsername(username);
    if (!localUser) return null;

    const session = ReelsStorage.getSession();
    const isFollowing = session ? ReelsStorage.isFollowing(session.id, localUser.id) : false;

    return {
      profile: localUser,
      followStatus: isFollowing ? 'accepted' : 'none'
    };
  },

  async toggleFollow(targetUserId: string): Promise<{ status: SocialFollowStatus | 'unfollowed'; success: boolean }> {
    const session = ReelsStorage.getSession();
    const followerId = session?.id || 'guest';
    const nextState = ReelsStorage.toggleFollow(followerId, targetUserId);

    const token = this.getToken();
    if (token) {
      safeFetchJson(`${API_BASE}/follows/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      }).catch(() => {});
    }

    return {
      success: true,
      status: nextState ? 'accepted' : 'unfollowed'
    };
  },

  async getPendingFollowRequests(): Promise<ReelUser[]> {
    const token = this.getToken();
    if (token) {
      const apiData = await safeFetchJson(`${API_BASE}/follows/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (apiData && apiData.success && Array.isArray(apiData.requests)) {
        return apiData.requests.map(mapBackendProfileToReelUser);
      }
    }
    return [];
  },

  async acceptFollowRequest(requesterId: string): Promise<boolean> {
    const token = this.getToken();
    if (token) {
      safeFetchJson(`${API_BASE}/follows/requests/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId })
      }).catch(() => {});
    }
    return true;
  },

  async rejectFollowRequest(requesterId: string): Promise<boolean> {
    const token = this.getToken();
    if (token) {
      safeFetchJson(`${API_BASE}/follows/requests/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId })
      }).catch(() => {});
    }
    return true;
  },

  async blockUser(targetUserId: string): Promise<boolean> {
    const session = ReelsStorage.getSession();
    if (session) {
      ReelsStorage.blockUser(session.id, targetUserId);
    }
    const token = this.getToken();
    if (token) {
      safeFetchJson(`${API_BASE}/social/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      }).catch(() => {});
    }
    return true;
  },

  async unblockUser(targetUserId: string): Promise<boolean> {
    const session = ReelsStorage.getSession();
    if (session) {
      ReelsStorage.unblockUser(session.id, targetUserId);
    }
    const token = this.getToken();
    if (token) {
      safeFetchJson(`${API_BASE}/social/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      }).catch(() => {});
    }
    return true;
  },

  async getBlockedUsers(): Promise<ReelUser[]> {
    const session = ReelsStorage.getSession();
    if (!session) return [];
    const blockedIds = ReelsStorage.getBlockedUsers(session.id);
    return blockedIds
      .map(id => ReelsStorage.findUserById(id))
      .filter((u): u is ReelUser => Boolean(u));
  },

  async getSettings(): Promise<UserSettings | null> {
    const session = ReelsStorage.getSession();
    return getDefaultSettings(session);
  },

  async updateSettings(partial: Partial<UserSettings>): Promise<UserSettings | null> {
    const session = ReelsStorage.getSession();
    const current = getDefaultSettings(session);
    const updated = { ...current, ...partial };
    try {
      localStorage.setItem('chhath_user_settings', JSON.stringify(updated));
    } catch {}
    return updated;
  },

  async getActiveSessions(): Promise<ActiveSession[]> {
    const session = ReelsStorage.getSession();
    const userId = session?.id || 'usr_guest';
    return [
      {
        id: 'sess_current',
        user_id: userId,
        deviceName: 'Active Browser Session',
        deviceType: 'desktop',
        browser: 'Browser',
        os: 'Windows / Web',
        ipAddress: '127.0.0.1',
        locationCity: session?.city || 'Patna',
        isCurrent: true,
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
  },

  async revokeSession(sessionId: string): Promise<boolean> {
    return true;
  },

  async downloadMyData(): Promise<any> {
    const session = ReelsStorage.getSession();
    if (!session) throw new Error('कृपया पहले लॉगिन करें।');
    return {
      user: session,
      exportDate: new Date().toISOString(),
      savedReels: ReelsStorage.getSavesMap(),
      likedReels: ReelsStorage.getLikesMap()
    };
  }
};
