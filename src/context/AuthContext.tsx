import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ReelUser, Language, UserSettings, ActiveSession, SocialFollowStatus } from '../types';
import { ReelsStorage } from '../services/reelsStorage';
import { AuthService } from '../services/authService';

interface SignUpData {
  name: string;
  username?: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  language?: Language;
}

interface AuthContextType {
  currentUser: ReelUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  userSettings: UserSettings | null;
  activeSessions: ActiveSession[];
  pendingFollowRequests: ReelUser[];
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  quickDevoteeLogin: (name?: string) => Promise<{ success: boolean }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<ReelUser>) => boolean;
  updateInterests: (interests: string[]) => void;
  completeOnboarding: (data: { 
    language: Language; 
    interests: string[]; 
    country: string; 
    state: string; 
    city: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
  }) => Promise<void>;
  resetPassword: (email: string, newPass?: string) => Promise<{ success: boolean; error?: string }>;
  toggleFollow: (targetUserId: string) => Promise<{ status: SocialFollowStatus | 'unfollowed'; success: boolean }>;
  isFollowing: (targetUserId: string) => boolean;
  blockUser: (targetUserId: string) => Promise<boolean>;
  unblockUser: (targetUserId: string) => Promise<boolean>;
  isUserBlocked: (targetUserId: string) => boolean;
  updateUserSettings: (updates: Partial<UserSettings>) => Promise<boolean>;
  refreshActiveSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  logoutAllOtherSessions: () => Promise<number>;
  refreshPendingFollowRequests: () => Promise<void>;
  acceptFollowRequest: (requesterId: string) => Promise<boolean>;
  rejectFollowRequest: (requesterId: string) => Promise<boolean>;
  downloadMyDataPackage: () => Promise<any>;
  authModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'quick_devotee';
  openAuthModal: (tab?: 'login' | 'signup' | 'quick_devotee', promptMessage?: string) => void;
  closeAuthModal: () => void;
  authPromptMessage: string | null;
  onboardingModalOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  accountCenterModalOpen: boolean;
  accountCenterTab: string;
  openAccountCenter: (tab?: string) => void;
  closeAccountCenter: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ReelUser | null>(() => {
    return ReelsStorage.getSession();
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [pendingFollowRequests, setPendingFollowRequests] = useState<ReelUser[]>([]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'quick_devotee'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  const [accountCenterModalOpen, setAccountCenterModalOpen] = useState(false);
  const [accountCenterTab, setAccountCenterTab] = useState('profile');

  // Verify session & listen to Firebase auth on mount
  useEffect(() => {
    const unsubscribe = AuthService.subscribeToAuthChanges((fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
      }
      setAuthLoading(false);
    });

    async function initSession() {
      // Purge legacy un-scoped mala keys so they never contaminate guest or user sessions
      try {
        localStorage.removeItem('digital_mala_completed');
        localStorage.removeItem('digital_mala_total_chants');
        localStorage.removeItem('digital_mala_today_chants');
        localStorage.removeItem('digital_mala_count');
      } catch {}

      try {
        // 1. Check for real Google OAuth redirect result on first-party domain
        const redirectUser = await AuthService.handleRedirectResult();
        if (redirectUser) {
          setCurrentUser(redirectUser);
          closeAuthModal();
          setAuthLoading(false);
          return;
        }

        // 2. Stored session check
        const sessionData = await AuthService.getSession();
        if (sessionData && sessionData.user) {
          setCurrentUser(sessionData.user);
          setUserSettings(sessionData.settings);
          ReelsStorage.setSession(sessionData.user);
          if (!sessionData.user.onboardingCompleted) {
            setOnboardingModalOpen(true);
          }
        } else {
          // Fallback: check local storage session
          const local = ReelsStorage.getSession();
          if (local) {
            setCurrentUser(local);
          }
        }
      } finally {
        setAuthLoading(false);
      }
    }
    initSession();

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await AuthService.signInWithGoogle();
      if (!res.success || !res.user) {
        return { success: false, error: res.error || 'Google साइन-इन विफल रहा।' };
      }
      setCurrentUser(res.user);
      if (res.settings) setUserSettings(res.settings);
      ReelsStorage.setSession(res.user);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Google साइन-इन में त्रुटि हुई।' };
    }
  };

  const quickDevoteeLogin = async (devoteeName?: string): Promise<{ success: boolean }> => {
    try {
      const res = AuthService.createDevoteeSession(devoteeName);
      if (res.user) {
        setCurrentUser(res.user);
        if (res.settings) setUserSettings(res.settings);
        closeAuthModal();
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  };

  const openOnboarding = () => setOnboardingModalOpen(true);
  const closeOnboarding = () => setOnboardingModalOpen(false);

  const openAuthModal = useCallback((tab: 'login' | 'signup' | 'quick_devotee' = 'login', promptMessage?: string) => {
    setAuthModalTab(tab);
    setAuthPromptMessage(promptMessage || null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthPromptMessage(null);
  }, []);

  const openAccountCenter = (tab: string = 'profile') => {
    setAccountCenterTab(tab);
    setAccountCenterModalOpen(true);
    refreshActiveSessions();
    refreshPendingFollowRequests();
  };

  const closeAccountCenter = () => {
    setAccountCenterModalOpen(false);
  };

  const refreshActiveSessions = async () => {
    if (!currentUser) return;
    const sessions = await AuthService.getActiveSessions();
    setActiveSessions(sessions);
  };

  const refreshPendingFollowRequests = async () => {
    if (!currentUser) return;
    const requests = await AuthService.getPendingFollowRequests();
    setPendingFollowRequests(requests);
  };

  const signup = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await AuthService.signup({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        city: data.city,
        language: data.language || 'hi',
        role: 'user'
      });

      if (!res.success || !res.user) {
        return { success: false, error: res.error || 'खाता बनाने में त्रुटि हुई।' };
      }

      setCurrentUser(res.user);
      if (res.settings) setUserSettings(res.settings);
      ReelsStorage.addUser(res.user);
      ReelsStorage.setSession(res.user);

      closeAuthModal();
      setOnboardingModalOpen(true);
      return { success: true };
    } catch {
      return { success: false, error: 'खाता बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।' };
    }
  };

  const login = async (emailOrUsername: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await AuthService.login(emailOrUsername, pass);
      if (!res.success || !res.user) {
        return { success: false, error: res.error || 'लॉगिन विफल।' };
      }

      setCurrentUser(res.user);
      if (res.settings) setUserSettings(res.settings);
      ReelsStorage.setSession(res.user);

      closeAuthModal();
      if (!res.user.onboardingCompleted) {
        setOnboardingModalOpen(true);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'लॉगिन करने में त्रुटि हुई।' };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    ReelsStorage.setSession(null);
    try {
      localStorage.removeItem('digital_mala_completed');
      localStorage.removeItem('digital_mala_total_chants');
      localStorage.removeItem('digital_mala_today_chants');
      localStorage.removeItem('digital_mala_count');
    } catch {}
    setCurrentUser(null);
    setUserSettings(null);
    setActiveSessions([]);
    setPendingFollowRequests([]);
    setAccountCenterModalOpen(false);
  };

  const updateProfile = (updates: Partial<ReelUser>): boolean => {
    if (!currentUser) return false;
    const optimistic = { ...currentUser, ...updates };
    setCurrentUser(optimistic);
    ReelsStorage.updateUser(currentUser.id, updates);

    AuthService.updateProfile(updates).then(updated => {
      if (updated) {
        setCurrentUser(updated);
        ReelsStorage.setSession(updated);
      }
    });

    return true;
  };

  const updateInterests = (interests: string[]) => {
    if (!currentUser) return;
    updateProfile({ interests });
  };

  const completeOnboarding = async (data: {
    language: Language;
    interests: string[];
    country: string;
    state: string;
    city: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
  }) => {
    if (!currentUser) return;
    const updates: Partial<ReelUser> = {
      language: data.language,
      interests: data.interests,
      country: data.country,
      state: data.state,
      city: data.city,
      onboardingCompleted: true
    };
    if (data.name) updates.name = data.name;
    if (data.username) updates.username = data.username;
    if (data.avatarUrl) updates.avatarUrl = data.avatarUrl;

    updateProfile(updates);
    setOnboardingModalOpen(false);
  };

  const resetPassword = async (email: string, _newPass?: string): Promise<{ success: boolean; error?: string }> => {
    return await AuthService.resetPassword(email);
  };

  const updateUserSettings = async (updates: Partial<UserSettings>): Promise<boolean> => {
    if (!currentUser) return false;
    const res = await AuthService.updateSettings(updates);
    if (res) {
      setUserSettings(res);
      if (updates.is_private_account !== undefined) {
        setCurrentUser(prev => prev ? { ...prev, isPrivate: res.is_private_account, is_private: res.is_private_account } : null);
      }
      return true;
    }
    return false;
  };

  const toggleFollow = async (targetUserId: string): Promise<{ status: SocialFollowStatus | 'unfollowed'; success: boolean }> => {
    if (!currentUser) {
      openAuthModal('signup', 'फॉलो करने के लिए अपना निःशुल्क छठ महापर्व खाता बनाएं।');
      return { status: 'none', success: false };
    }

    const res = await AuthService.toggleFollow(targetUserId);
    // Also update local storage for instant offline feedback
    ReelsStorage.toggleFollow(currentUser.id, targetUserId);

    // Refresh current user
    const fresh = await AuthService.getProfileById(currentUser.id);
    if (fresh) {
      setCurrentUser(fresh.profile);
      ReelsStorage.setSession(fresh.profile);
    }

    return res;
  };

  const isFollowing = (targetUserId: string): boolean => {
    if (!currentUser) return false;
    return ReelsStorage.isFollowing(currentUser.id, targetUserId);
  };

  const blockUser = async (targetUserId: string): Promise<boolean> => {
    if (!currentUser) return false;
    ReelsStorage.blockUser(currentUser.id, targetUserId);
    const ok = await AuthService.blockUser(targetUserId);
    // Refresh current user
    const fresh = await AuthService.getProfileById(currentUser.id);
    if (fresh) {
      setCurrentUser(fresh.profile);
      ReelsStorage.setSession(fresh.profile);
    }
    return ok;
  };

  const unblockUser = async (targetUserId: string): Promise<boolean> => {
    if (!currentUser) return false;
    ReelsStorage.unblockUser(currentUser.id, targetUserId);
    return await AuthService.unblockUser(targetUserId);
  };

  const isUserBlocked = (targetUserId: string): boolean => {
    if (!currentUser) return false;
    const blocked = ReelsStorage.getBlockedUsers(currentUser.id);
    return blocked.includes(targetUserId);
  };

  const revokeSession = async (sessionId: string): Promise<boolean> => {
    const success = await AuthService.revokeSession(sessionId);
    if (success) {
      await refreshActiveSessions();
    }
    return success;
  };

  const logoutAllOtherSessions = async (): Promise<number> => {
    const count = await AuthService.logoutAll(true);
    await refreshActiveSessions();
    return count;
  };

  const acceptFollowRequest = async (requesterId: string): Promise<boolean> => {
    const ok = await AuthService.acceptFollowRequest(requesterId);
    if (ok) {
      await refreshPendingFollowRequests();
      if (currentUser) {
        const fresh = await AuthService.getProfileById(currentUser.id);
        if (fresh) setCurrentUser(fresh.profile);
      }
    }
    return ok;
  };

  const rejectFollowRequest = async (requesterId: string): Promise<boolean> => {
    const ok = await AuthService.rejectFollowRequest(requesterId);
    if (ok) {
      await refreshPendingFollowRequests();
    }
    return ok;
  };

  const downloadMyDataPackage = async (): Promise<any> => {
    return await AuthService.downloadMyData();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin',
        authLoading,
        userSettings,
        activeSessions,
        pendingFollowRequests,
        signInWithGoogle,
        quickDevoteeLogin,
        signup,
        login,
        logout,
        updateProfile,
        resetPassword,
        toggleFollow,
        isFollowing,
        blockUser,
        unblockUser,
        isUserBlocked,
        updateUserSettings,
        refreshActiveSessions,
        revokeSession,
        logoutAllOtherSessions,
        refreshPendingFollowRequests,
        acceptFollowRequest,
        rejectFollowRequest,
        downloadMyDataPackage,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        authPromptMessage,
        onboardingModalOpen,
        openOnboarding,
        closeOnboarding,
        completeOnboarding,
        updateInterests,
        accountCenterModalOpen,
        accountCenterTab,
        openAccountCenter,
        closeAccountCenter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
