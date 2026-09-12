import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  DynamicReel, 
  ReelComment, 
  ReelCategory, 
  ReelDraft, 
  ReelReport, 
  ReelNotification,
  ReelPrivacy,
  ReelUser
} from '../types';
import { ReelsStorage, storeMediaBlob, getMediaBlobUrl } from '../services/reelsStorage';
import { FeedService } from '../services/feed/FeedService';
import { useAuth } from './AuthContext';

export type FeedType = 'foryou' | 'following' | 'trending' | 'latest' | 'explore' | 'hashtag' | 'category' | 'user';

interface CreateReelParams {
  title: string;
  description: string;
  category: ReelCategory;
  tags: string[];
  privacy: ReelPrivacy;
  videoBlob?: Blob;
  videoUrl?: string;
  thumbnailUrl?: string;
  audioId?: string;
  audioTitle?: string;
  audioArtist?: string;
  videoDuration?: string;
}

interface ReelsContextType {
  // Feed State
  feedType: FeedType;
  setFeedType: (feed: FeedType) => void;
  selectedHashtag: string | null;
  setSelectedHashtag: (tag: string | null) => void;
  selectedCategory: ReelCategory | null;
  setSelectedCategory: (cat: ReelCategory | null) => void;
  selectedUsername: string | null;
  setSelectedUsername: (username: string | null) => void;
  
  // Reels Data
  reels: DynamicReel[];
  allReels: DynamicReel[];
  activeReelIndex: number;
  setActiveReelIndex: (idx: number) => void;
  activeReelId: string | null;
  setActiveReelId: (id: string | null) => void;
  currentReel: DynamicReel | null;
  
  // Navigation
  nextReel: () => void;
  prevReel: () => void;
  jumpToReelId: (id: string) => void;
  
  // Actions
  toggleLike: (reelId: string) => boolean;
  isLiked: (reelId: string) => boolean;
  toggleSave: (reelId: string) => boolean;
  isSaved: (reelId: string) => boolean;
  recordView: (reelId: string) => void;
  
  // Comments
  comments: ReelComment[];
  activeComments: ReelComment[];
  addComment: (reelId: string, text: string, parentId?: string) => void;
  deleteComment: (commentId: string) => void;
  
  // Upload & Drafts
  createReel: (params: CreateReelParams) => Promise<DynamicReel>;
  saveDraft: (draft: Partial<ReelDraft>) => ReelDraft | null;
  deleteDraft: (draftId: string) => void;
  userDrafts: ReelDraft[];
  
  // Reports & Moderation
  reportReel: (reelId: string, reason: ReelReport['reason'], details: string) => void;
  adminApproveReel: (reelId: string) => void;
  adminRejectReel: (reelId: string) => void;
  adminDeleteReel: (reelId: string) => void;
  reports: ReelReport[];
  resolveReport: (reportId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: {
    users: ReelUser[];
    reels: DynamicReel[];
    hashtags: string[];
  };

  // Modals
  reelsPlatformOpen: boolean;
  openReelsPlatform: (initialFeed?: FeedType, specificReelId?: string, customList?: DynamicReel[]) => void;
  closeReelsPlatform: () => void;
  
  createModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  
  profileModalUser: ReelUser | null;
  openProfileModal: (user: ReelUser | string) => void;
  closeProfileModal: () => void;
  
  creatorStudioOpen: boolean;
  setCreatorStudioOpen: (open: boolean) => void;
  
  moderationOpen: boolean;
  setModerationOpen: (open: boolean) => void;

  // Sound
  isMuted: boolean;
  toggleMute: () => void;

  // Infinite Reel Loading
  loadMoreReels: () => void;
  isLoadingBatch: boolean;
  hasMoreReels: boolean;
  handleVideoError: (failedReelId: string, failedYtId?: string, errorCode?: number) => Promise<void>;

  // Search History
  searchHistory: string[];
  addSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;

  // Custom / Search-Filtered Feed
  customFeedList: DynamicReel[] | null;
  setCustomFeedList: (list: DynamicReel[] | null) => void;

  // Feedback Toast & Smart Fallback
  feedbackToast: string | null;
  clearFeedbackToast: () => void;
  markNotInterested: (
    reelId: string, 
    category?: ReelCategory, 
    tags?: string[], 
    youtubeVideoId?: string, 
    channelTitle?: string
  ) => void;
}

const ReelsContext = createContext<ReelsContextType | undefined>(undefined);

export const ReelsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  
  const [feedType, setFeedType] = useState<FeedType>('foryou');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ReelCategory | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const [allReels, setAllReels] = useState<DynamicReel[]>(() => ReelsStorage.getReels());
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Modals
  const [reelsPlatformOpen, setReelsPlatformOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [profileModalUser, setProfileModalUser] = useState<ReelUser | null>(null);
  const [creatorStudioOpen, setCreatorStudioOpen] = useState(false);
  const [moderationOpen, setModerationOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Drafts & Reports State
  const [userDrafts, setUserDrafts] = useState<ReelDraft[]>([]);
  const [reports, setReports] = useState<ReelReport[]>(() => ReelsStorage.getReports());

  // Reload data
  const refreshData = useCallback(() => {
    setAllReels(ReelsStorage.getReels());
    setReports(ReelsStorage.getReports());
    if (currentUser) {
      setUserDrafts(ReelsStorage.getDrafts(currentUser.id));
    } else {
      setUserDrafts([]);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Feedback Toast & Smart Fallback Suppression State
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [suppressionTick, setSuppressionTick] = useState(0);

  // Dynamic / Infinite Feed State via FeedService
  const [feedItems, setFeedItems] = useState<DynamicReel[]>([]);
  const [feedCursor, setFeedCursor] = useState<string | null>(null);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [hasMoreReels, setHasMoreReels] = useState(true);
  const [customFeedList, setCustomFeedList] = useState<DynamicReel[] | null>(null);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => 
    ReelsStorage.getSearchHistory(currentUser?.id)
  );

  const addSearchQuery = useCallback((query: string) => {
    ReelsStorage.addSearchHistory(currentUser?.id, query);
    setSearchHistory(ReelsStorage.getSearchHistory(currentUser?.id));
  }, [currentUser]);

  const clearSearchHistory = useCallback(() => {
    ReelsStorage.clearSearchHistory(currentUser?.id);
    setSearchHistory([]);
  }, [currentUser]);

  // Initial batch fetch on filter or user change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBatch(true);
    setActiveReelIndex(0);

    FeedService.getFeedPage({
      cursor: null,
      limit: 10,
      feedType,
      currentUser,
      selectedCategory,
      selectedHashtag,
      selectedUsername
    }).then(res => {
      if (isMounted) {
        setFeedItems(res.items);
        setFeedCursor(res.nextCursor);
        setHasMoreReels(res.hasMore);
        if (res.items.length > 0) {
          setActiveReelId(res.items[0].id);
        }
        setIsLoadingBatch(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingBatch(false);
    });

    return () => {
      isMounted = false;
    };
  }, [feedType, selectedCategory, selectedHashtag, selectedUsername, currentUser, suppressionTick]);

  // Load next batch via cursor pagination with strict duplicate protection
  const loadMoreReels = useCallback(() => {
    if (isLoadingBatch || !hasMoreReels) return;
    setIsLoadingBatch(true);

    FeedService.getFeedPage({
      cursor: feedCursor,
      limit: 10,
      feedType,
      currentUser,
      selectedCategory,
      selectedHashtag,
      selectedUsername
    }).then(res => {
      setFeedItems(prev => {
        const existingIds = new Set(prev.map(r => r.id));
        const existingVideos = new Set(prev.map(r => r.youtubeVideoId || r.videoUrl));
        const newItems = res.items.filter(r => {
          const vKey = r.youtubeVideoId || r.videoUrl;
          if (existingIds.has(r.id)) return false;
          if (vKey && existingVideos.has(vKey)) return false;
          return true;
        });
        return [...prev, ...newItems];
      });
      setFeedCursor(res.nextCursor);
      setHasMoreReels(res.hasMore);
      setIsLoadingBatch(false);
    }).catch(() => {
      setIsLoadingBatch(false);
    });
  }, [feedCursor, feedType, currentUser, selectedCategory, selectedHashtag, selectedUsername, isLoadingBatch, hasMoreReels]);

  // Handle Video Error & in-place replacement
  const handleVideoError = useCallback(async (
    failedReelId: string, 
    failedYtId?: string, 
    errorCode?: number
  ) => {
    const res = await FeedService.replaceFailedVideo(failedReelId, failedYtId, feedItems, currentUser);
    setFeedItems(res.updatedItems);
  }, [feedItems, currentUser]);

  const clearFeedbackToast = useCallback(() => {
    setFeedbackToast(null);
  }, []);

  const markNotInterested = useCallback((
    reelId: string, 
    category?: ReelCategory, 
    tags?: string[], 
    youtubeVideoId?: string, 
    channelTitle?: string
  ) => {
    const userId = currentUser ? currentUser.id : 'guest';
    ReelsStorage.addNotInterested(userId, {
      reelId,
      youtubeId: youtubeVideoId,
      category,
      tags,
      channelTitle,
      timestamp: Date.now()
    });
    setSuppressionTick(prev => prev + 1);
    setFeedbackToast('यह वीडियो हटा दिया गया है। आपकी पसंद के अनुसार रील्स दिखाई जाएंगी।');
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  }, [currentUser]);

  // Effective reels: custom list (if active from search/profile) or dynamic feed items
  const effectiveReels = React.useMemo(() => {
    if (customFeedList && customFeedList.length > 0) {
      return customFeedList;
    }
    return feedItems;
  }, [customFeedList, feedItems]);

  const currentReel = React.useMemo(() => {
    if (activeReelId) {
      const match = effectiveReels.find(r => r.id === activeReelId);
      if (match) return match;
    }
    return effectiveReels[activeReelIndex] || null;
  }, [effectiveReels, activeReelId, activeReelIndex]);

  const handleSetActiveReelIndex = useCallback((idx: number) => {
    setActiveReelIndex(idx);
    if (effectiveReels[idx]) {
      setActiveReelId(effectiveReels[idx].id);
    }
  }, [effectiveReels]);

  const handleSetActiveReelId = useCallback((id: string | null) => {
    setActiveReelId(id);
    if (id) {
      const idx = effectiveReels.findIndex(r => r.id === id);
      if (idx !== -1) {
        setActiveReelIndex(idx);
      }
    }
  }, [effectiveReels]);

  // Navigation methods
  const nextReel = () => {
    if (effectiveReels.length === 0) return;
    const nextIdx = (activeReelIndex + 1) % effectiveReels.length;
    handleSetActiveReelIndex(nextIdx);
  };

  const prevReel = () => {
    if (effectiveReels.length === 0) return;
    const prevIdx = (activeReelIndex - 1 + effectiveReels.length) % effectiveReels.length;
    handleSetActiveReelIndex(prevIdx);
  };

  const jumpToReelId = (id: string) => {
    const idx = effectiveReels.findIndex(r => r.id === id);
    if (idx !== -1) {
      handleSetActiveReelIndex(idx);
      setActiveReelId(id);
    } else {
      // Find in allReels and switch to explore
      const allIdx = allReels.findIndex(r => r.id === id);
      if (allIdx !== -1) {
        setFeedType('explore');
        setActiveReelIndex(allIdx);
        setActiveReelId(id);
      }
    }
  };

  // Interactions
  const toggleLike = (reelId: string): boolean => {
    if (!currentUser) {
      openAuthModal('login', 'रील्स को लाइक करने के लिए कृपया अपने छठ खाते में लॉगिन करें।');
      return false;
    }
    const state = ReelsStorage.toggleReelLike(currentUser.id, reelId);
    refreshData();

    // Add notification to creator if liked
    if (state) {
      const reel = allReels.find(r => r.id === reelId);
      if (reel && reel.creatorId !== currentUser.id) {
        ReelsStorage.addNotification({
          id: `notif_${Date.now()}`,
          userId: reel.creatorId,
          actorId: currentUser.id,
          actorName: currentUser.name,
          actorUsername: currentUser.username,
          actorAvatar: currentUser.avatarUrl,
          type: 'like',
          reelId,
          text: `ने आपकी रील "${reel.title.substring(0, 25)}..." को लाइक किया। ❤️`,
          read: false,
          timestamp: new Date().toISOString()
        });
      }
    }
    return state;
  };

  const isLiked = (reelId: string): boolean => {
    if (!currentUser) return false;
    return ReelsStorage.isReelLiked(currentUser.id, reelId);
  };

  const toggleSave = (reelId: string): boolean => {
    if (!currentUser) {
      openAuthModal('login', 'रील सेव करने के लिए कृपया अपने छठ खाते में लॉगिन करें।');
      return false;
    }
    const state = ReelsStorage.toggleReelSave(currentUser.id, reelId);
    refreshData();
    return state;
  };

  const isSaved = (reelId: string): boolean => {
    if (!currentUser) return false;
    return ReelsStorage.isReelSaved(currentUser.id, reelId);
  };

  const recordView = (reelId: string) => {
    const userId = currentUser ? currentUser.id : 'guest_session';
    const recorded = ReelsStorage.recordReelView(userId, reelId);
    if (recorded) {
      refreshData();
    }
    const combined = [...allReels, ...ReelsStorage.getExternalCatalog()];
    const item = combined.find(r => r.id === reelId);
    ReelsStorage.recordImpression(userId, reelId, item?.youtubeVideoId, 3);
  };

  // Comments
  const comments = ReelsStorage.getComments();
  const activeComments = currentReel ? comments.filter(c => c.reelId === currentReel.id) : [];

  const addComment = (reelId: string, text: string, parentId?: string) => {
    if (!currentUser) {
      openAuthModal('login', 'टिप्पणी (Comment) करने के लिए कृपया लॉगिन करें।');
      return;
    }
    if (!text.trim()) return;

    const newComment: ReelComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      reelId,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      text: text.trim(),
      likesCount: 0,
      parentId,
      createdAt: new Date().toISOString()
    };

    ReelsStorage.addComment(newComment);
    refreshData();

    // Send notification
    const reel = allReels.find(r => r.id === reelId);
    if (reel && reel.creatorId !== currentUser.id) {
      ReelsStorage.addNotification({
        id: `notif_${Date.now()}`,
        userId: reel.creatorId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorUsername: currentUser.username,
        actorAvatar: currentUser.avatarUrl,
        type: parentId ? 'reply' : 'comment',
        reelId,
        text: parentId 
          ? `ने आपकी टिप्पणी का उत्तर दिया: "${text.substring(0, 30)}..." 💬`
          : `ने आपकी रील पर टिप्पणी की: "${text.substring(0, 30)}..." 💬`,
        read: false,
        timestamp: new Date().toISOString()
      });
    }
  };

  const deleteComment = (commentId: string) => {
    ReelsStorage.deleteComment(commentId);
    refreshData();
  };

  // Upload Reel
  const createReel = async (params: CreateReelParams): Promise<DynamicReel> => {
    if (!currentUser) {
      throw new Error('कृपया रील अपलोड करने के लिए लॉगिन करें।');
    }

    let videoUrl = params.videoUrl || '';
    let videoBlobKey: string | undefined = undefined;

    if (params.videoBlob) {
      videoBlobKey = `video_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      await storeMediaBlob(videoBlobKey, params.videoBlob);
      const generatedUrl = await getMediaBlobUrl(videoBlobKey);
      videoUrl = generatedUrl || URL.createObjectURL(params.videoBlob);
    }

    const autoPublish = ReelsStorage.isAutoPublishEnabled() || currentUser.role === 'admin' || currentUser.role === 'creator';
    const status = autoPublish ? 'approved' : 'pending';

    const defaultThumbs = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80'
    ];

    const newReel: DynamicReel = {
      id: `reel_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorUsername: currentUser.username,
      creatorAvatar: currentUser.avatarUrl,
      creatorCity: currentUser.city,
      title: params.title.trim(),
      description: params.description.trim(),
      category: params.category,
      tags: params.tags.length > 0 ? params.tags : ['#ChhathPuja', '#ChhathiMaiya'],
      videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-burning-candle-in-the-dark-42407-large.mp4',
      videoBlobKey,
      thumbnailUrl: params.thumbnailUrl || defaultThumbs[Math.floor(Math.random() * defaultThumbs.length)],
      videoDuration: params.videoDuration || '0:30',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      privacy: params.privacy,
      status,
      audioId: params.audioId || 'audio_1',
      audioTitle: params.audioTitle || 'कांच ही बांस के बहंगिया',
      audioArtist: params.audioArtist || 'शारदा सिन्हा',
      createdAt: new Date().toISOString(),
      aspectRatio: '9:16'
    };

    ReelsStorage.addReel(newReel);
    refreshData();
    setFeedType('explore');
    setActiveReelIndex(0);
    return newReel;
  };

  // Drafts
  const saveDraft = (draft: Partial<ReelDraft>): ReelDraft | null => {
    if (!currentUser) return null;
    const item: ReelDraft = {
      id: draft.id || `draft_${Date.now()}`,
      userId: currentUser.id,
      title: draft.title || 'शीर्षक रहित ड्राफ्ट',
      description: draft.description || '',
      category: draft.category || 'Chhath Geet',
      tags: draft.tags || ['#ChhathPuja'],
      privacy: draft.privacy || 'public',
      videoBlobKey: draft.videoBlobKey,
      thumbnailUrl: draft.thumbnailUrl,
      videoDuration: draft.videoDuration || '0:30',
      updatedAt: new Date().toISOString()
    };
    ReelsStorage.saveDraft(item);
    refreshData();
    return item;
  };

  const deleteDraft = (draftId: string) => {
    ReelsStorage.deleteDraft(draftId);
    refreshData();
  };

  // Reports
  const reportReel = (reelId: string, reason: ReelReport['reason'], details: string) => {
    const reel = allReels.find(r => r.id === reelId);
    const rep: ReelReport = {
      id: `rep_${Date.now()}`,
      reelId,
      reelTitle: reel?.title || 'Unknown Reel',
      reportedByUserId: currentUser?.id || 'guest_user',
      reason,
      details,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    ReelsStorage.addReport(rep);
    refreshData();
  };

  const resolveReport = (reportId: string) => {
    ReelsStorage.updateReportStatus(reportId, 'resolved');
    refreshData();
  };

  // Admin Actions
  const adminApproveReel = (reelId: string) => {
    ReelsStorage.updateReel(reelId, { status: 'approved' });
    refreshData();
  };

  const adminRejectReel = (reelId: string) => {
    ReelsStorage.updateReel(reelId, { status: 'rejected' });
    refreshData();
  };

  const adminDeleteReel = (reelId: string) => {
    ReelsStorage.deleteReel(reelId);
    refreshData();
  };

  // Search Results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return { users: [], reels: [], hashtags: [] };
    }
    const q = searchQuery.toLowerCase().trim();
    const users = ReelsStorage.getUsers().filter(u => 
      u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
    const combinedReels = [...allReels, ...ReelsStorage.getExternalCatalog()];
    const reels = combinedReels.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) ||
      (r.channelTitle && r.channelTitle.toLowerCase().includes(q)) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
    const allTags = Array.from(new Set(combinedReels.flatMap(r => r.tags)));
    const hashtags = allTags.filter(t => t.toLowerCase().includes(q));

    return { users, reels, hashtags };
  }, [searchQuery, allReels]);

  // Modal openers
  const openReelsPlatform = (initialFeed: FeedType = 'explore', specificReelId?: string, customList?: DynamicReel[]) => {
    if (customList && customList.length > 0) {
      setCustomFeedList(customList);
    } else {
      setCustomFeedList(null);
    }
    setFeedType(initialFeed);
    if (specificReelId) {
      jumpToReelId(specificReelId);
    } else {
      setActiveReelIndex(0);
    }
    setReelsPlatformOpen(true);
  };

  const closeReelsPlatform = () => {
    setReelsPlatformOpen(false);
    setCustomFeedList(null);
  };

  const openCreateModal = () => {
    if (!currentUser) {
      openAuthModal('signup', 'अपनी छठ रील बनाने व साझा करने के लिए कृपया खाता बनाएं या लॉगिन करें।');
      return;
    }
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openProfileModal = (target: ReelUser | string) => {
    if (typeof target === 'string') {
      const user = ReelsStorage.findUserByUsername(target) || ReelsStorage.findUserById(target);
      if (user) {
        setProfileModalUser(user);
      }
    } else {
      setProfileModalUser(target);
    }
  };

  const closeProfileModal = () => {
    setProfileModalUser(null);
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <ReelsContext.Provider
      value={{
        feedType,
        setFeedType,
        selectedHashtag,
        setSelectedHashtag,
        selectedCategory,
        setSelectedCategory,
        selectedUsername,
        setSelectedUsername,
        reels: effectiveReels,
        allReels,
        activeReelIndex,
        setActiveReelIndex: handleSetActiveReelIndex,
        activeReelId,
        setActiveReelId: handleSetActiveReelId,
        currentReel,
        nextReel,
        prevReel,
        jumpToReelId,
        toggleLike,
        isLiked,
        toggleSave,
        isSaved,
        recordView,
        comments,
        activeComments,
        addComment,
        deleteComment,
        createReel,
        saveDraft,
        deleteDraft,
        userDrafts,
        reportReel,
        adminApproveReel,
        adminRejectReel,
        adminDeleteReel,
        reports,
        resolveReport,
        searchQuery,
        setSearchQuery,
        searchResults,
        reelsPlatformOpen,
        openReelsPlatform,
        closeReelsPlatform,
        createModalOpen,
        openCreateModal,
        closeCreateModal,
        profileModalUser,
        openProfileModal,
        closeProfileModal,
        creatorStudioOpen,
        setCreatorStudioOpen,
        moderationOpen,
        setModerationOpen,
        isMuted,
        toggleMute,
        feedbackToast,
        clearFeedbackToast,
        markNotInterested,
        loadMoreReels,
        isLoadingBatch,
        hasMoreReels,
        handleVideoError,
        searchHistory,
        addSearchQuery,
        clearSearchHistory,
        customFeedList,
        setCustomFeedList
      }}
    >
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  const context = useContext(ReelsContext);
  if (!context) {
    throw new Error('useReels must be used within a ReelsProvider');
  }
  return context;
};
