import { ReelUser, UserSettings, ActiveSession, SocialFollowStatus } from '../types';

const API_BASE = '/api/v1';
const TOKEN_KEY = 'chhath_auth_session_token';

// Convert backend profile to frontend ReelUser format
export function mapBackendProfileToReelUser(profile: any): ReelUser {
  if (!profile) throw new Error('Invalid profile');
  const userId = profile.user_id || profile.id;
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
    language: profile.language || 'hi',
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
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'खाता बनाने में विफल।' };
      }
      this.setToken(resData.sessionToken);
      return {
        success: true,
        user: mapBackendProfileToReelUser(resData.user),
        settings: resData.settings,
        token: resData.sessionToken
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'सर्वर से संपर्क नहीं हो सका।' };
    }
  },

  async login(
    emailOrUsername: string,
    pass: string
  ): Promise<{ success: boolean; user?: ReelUser; settings?: UserSettings; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password: pass })
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'लॉगिन विफल।' };
      }
      this.setToken(resData.sessionToken);
      return {
        success: true,
        user: mapBackendProfileToReelUser(resData.user),
        settings: resData.settings,
        token: resData.sessionToken
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'सर्वर से संपर्क नहीं हो सका।' };
    }
  },

  async getSession(): Promise<{ user: ReelUser; settings: UserSettings } | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/session`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        this.setToken(null);
        return null;
      }
      const data = await res.json();
      if (!data.success || !data.user) {
        this.setToken(null);
        return null;
      }
      return {
        user: mapBackendProfileToReelUser(data.user),
        settings: data.settings
      };
    } catch {
      return null;
    }
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
  },

  async logoutAll(keepCurrent = false): Promise<number> {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const res = await fetch(`${API_BASE}/auth/logout-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ keepCurrent })
      });
      const data = await res.json();
      if (!keepCurrent) {
        this.setToken(null);
      }
      return data.count || 0;
    } catch {
      return 0;
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'कृपया पुनः लॉगिन करें।' };
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      return { success: res.ok && data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteAccount(confirmation: string): Promise<{ success: boolean; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'कृपया पुनः लॉगिन करें।' };
    try {
      const res = await fetch(`${API_BASE}/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ confirmation })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.setToken(null);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateProfile(updates: Partial<ReelUser>): Promise<ReelUser | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
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

      const res = await fetch(`${API_BASE}/profiles/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        return mapBackendProfileToReelUser(data.profile);
      }
      return null;
    } catch {
      return null;
    }
  },

  async getProfileById(userId: string): Promise<{ profile: ReelUser; followStatus: SocialFollowStatus; isBlocked: boolean } | null> {
    const token = this.getToken();
    try {
      const res = await fetch(`${API_BASE}/profiles/${encodeURIComponent(userId)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.success || !data.profile) return null;
      return {
        profile: mapBackendProfileToReelUser(data.profile),
        followStatus: data.followStatus || 'none',
        isBlocked: Boolean(data.isBlocked)
      };
    } catch {
      return null;
    }
  },

  async getProfileByUsername(username: string): Promise<{ profile: ReelUser; followStatus: SocialFollowStatus } | null> {
    const token = this.getToken();
    try {
      const res = await fetch(`${API_BASE}/profiles/by-username/${encodeURIComponent(username)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.success || !data.profile) return null;
      return {
        profile: mapBackendProfileToReelUser(data.profile),
        followStatus: data.followStatus || 'none'
      };
    } catch {
      return null;
    }
  },

  async toggleFollow(targetUserId: string): Promise<{ status: SocialFollowStatus | 'unfollowed'; success: boolean }> {
    const token = this.getToken();
    if (!token) return { success: false, status: 'none' };
    try {
      const res = await fetch(`${API_BASE}/follows/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      return { success: res.ok && data.success, status: data.status || 'none' };
    } catch {
      return { success: false, status: 'none' };
    }
  },

  async getPendingFollowRequests(): Promise<ReelUser[]> {
    const token = this.getToken();
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/follows/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.requests)) {
        return data.requests.map(mapBackendProfileToReelUser);
      }
      return [];
    } catch {
      return [];
    }
  },

  async acceptFollowRequest(requesterId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/follows/requests/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId })
      });
      const data = await res.json();
      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  },

  async rejectFollowRequest(requesterId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/follows/requests/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requesterId })
      });
      const data = await res.json();
      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  },

  async blockUser(targetUserId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/social/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  },

  async unblockUser(targetUserId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/social/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  },

  async getBlockedUsers(): Promise<ReelUser[]> {
    const token = this.getToken();
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/social/blocked`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.blocked)) {
        return data.blocked.map(mapBackendProfileToReelUser);
      }
      return [];
    } catch {
      return [];
    }
  },

  async getSettings(): Promise<UserSettings | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return data.settings || null;
    } catch {
      return null;
    }
  },

  async updateSettings(partial: Partial<UserSettings>): Promise<UserSettings | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/settings/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(partial)
      });
      const data = await res.json();
      return data.settings || null;
    } catch {
      return null;
    }
  },

  async getActiveSessions(): Promise<ActiveSession[]> {
    const token = this.getToken();
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/security/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.sessions)) {
        return data.sessions.map((s: any) => ({
          id: s.id,
          user_id: s.user_id,
          deviceName: s.device_name || s.deviceName || 'Device',
          deviceType: s.device_type || s.deviceType || 'desktop',
          browser: s.browser || 'Browser',
          os: s.os || 'System',
          ipAddress: s.ip_address || s.ipAddress || '127.0.0.1',
          locationCity: s.location_city || s.locationCity || 'Patna',
          isCurrent: Boolean(s.is_current ?? s.isCurrent),
          lastActiveAt: s.last_active_at || s.lastActiveAt || new Date().toISOString(),
          createdAt: s.created_at || s.createdAt || new Date().toISOString()
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  async revokeSession(sessionId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/security/sessions/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  },

  async downloadMyData(): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('कृपया पहले लॉगिन करें।');
    const res = await fetch(`${API_BASE}/data-export`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'डेटा निर्यात करने में विफल।');
    }
    return data.data;
  }
};
