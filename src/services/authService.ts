import { ReelUser, Language, UserSettings, ActiveSession, SocialFollowStatus } from '../types';
import { ReelsStorage } from './reelsStorage';

const API_BASE = '/api/v1';
const TOKEN_KEY = 'chhath_auth_session_token';

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

  async signup(data: {
    name: string;
    username: string;
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
    // 1. Try backend API first
    const apiData = await safeFetchJson(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (apiData && apiData.success && apiData.user) {
      this.setToken(apiData.sessionToken);
      const mapped = mapBackendProfileToReelUser(apiData.user);
      ReelsStorage.addUser(mapped);
      ReelsStorage.setSession(mapped);
      return {
        success: true,
        user: mapped,
        settings: apiData.settings,
        token: apiData.sessionToken
      };
    }

    // 2. Client-side / Static Fallback (GitHub Pages)
    const cleanUsername = data.username.startsWith('@') ? data.username : `@${data.username}`;
    const validLangs: Language[] = ['hi', 'en', 'bho', 'mai', 'mag'];
    const userLang: Language = validLangs.includes(data.language as any) ? (data.language as Language) : 'hi';

    const newUser: ReelUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: `usr_${Date.now()}`,
      name: data.name || 'छठ भक्त',
      username: cleanUsername,
      email: data.email || `${cleanUsername.replace('@', '')}@chhath.in`,
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      bio: data.bio || 'छठी मईया की जय! 🙏',
      city: data.city || 'Patna',
      state: data.state || 'Bihar',
      country: data.country || 'India',
      language: userLang,
      role: data.role || 'user',
      followersCount: 0,
      followingCount: 3,
      totalLikesCount: 0,
      reelsCount: 0,
      verified: false,
      interests: ['songs', 'vidhi', 'ghats', 'prasad'],
      onboardingCompleted: true,
      createdAt: new Date().toISOString()
    };

    ReelsStorage.addUser(newUser);
    const sessionToken = `demo_token_${newUser.id}_${Date.now()}`;
    this.setToken(sessionToken);
    ReelsStorage.setSession(newUser);

    return {
      success: true,
      user: newUser,
      settings: getDefaultSettings(newUser),
      token: sessionToken
    };
  },

  async login(
    emailOrUsername: string,
    pass: string
  ): Promise<{ success: boolean; user?: ReelUser; settings?: UserSettings; token?: string; error?: string }> {
    // 1. Try backend API first
    const apiData = await safeFetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password: pass })
    });

    if (apiData && apiData.success && apiData.user) {
      this.setToken(apiData.sessionToken);
      const mapped = mapBackendProfileToReelUser(apiData.user);
      ReelsStorage.setSession(mapped);
      return {
        success: true,
        user: mapped,
        settings: apiData.settings,
        token: apiData.sessionToken
      };
    }

    // 2. Client-side / Static Fallback (GitHub Pages)
    const normalizedInput = emailOrUsername.trim();
    let user = ReelsStorage.findUserByUsername(normalizedInput) || 
               ReelsStorage.findUserByEmail(normalizedInput);

    if (!user) {
      if (normalizedInput.startsWith('@')) {
        user = ReelsStorage.findUserByUsername(normalizedInput.slice(1));
      } else {
        user = ReelsStorage.findUserByUsername(`@${normalizedInput}`);
      }
    }

    // If still not found, auto-create profile so any custom email/username works immediately!
    if (!user) {
      const rawUserPart = normalizedInput.includes('@') ? normalizedInput.split('@')[0] : normalizedInput;
      const cleanUserPart = rawUserPart.replace(/[^a-zA-Z0-9_]/g, '') || 'devotee';
      const cleanUsername = `@${cleanUserPart.toLowerCase()}`;
      const displayName = cleanUserPart.charAt(0).toUpperCase() + cleanUserPart.slice(1);

      user = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: `usr_${Date.now()}`,
        name: displayName,
        username: cleanUsername,
        email: normalizedInput.includes('@') ? normalizedInput : `${cleanUserPart}@chhath.in`,
        avatarUrl: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80`,
        bio: 'छठी मईया की जय! 🙏 सूर्य उपासना के पावन पर्व पर हार्दिक शुभकामनाएं।',
        city: 'Patna',
        state: 'Bihar',
        country: 'India',
        language: 'hi',
        role: 'user',
        followersCount: 1,
        followingCount: 4,
        totalLikesCount: 12,
        reelsCount: 0,
        verified: false,
        interests: ['songs', 'vidhi', 'ghats', 'prasad'],
        onboardingCompleted: true,
        createdAt: new Date().toISOString()
      };
      ReelsStorage.addUser(user);
    }

    const sessionToken = `demo_token_${user.id}_${Date.now()}`;
    this.setToken(sessionToken);
    ReelsStorage.setSession(user);

    return {
      success: true,
      user,
      settings: getDefaultSettings(user),
      token: sessionToken
    };
  },

  async getSession(): Promise<{ user: ReelUser; settings: UserSettings } | null> {
    const token = this.getToken();
    if (!token) {
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
