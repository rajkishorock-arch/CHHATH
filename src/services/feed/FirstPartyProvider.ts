import { DynamicReel, ReelUser, ReelCategory } from '../../types';
import { ReelsStorage } from '../reelsStorage';

export interface FirstPartyFilterOptions {
  feedType: string;
  currentUser: ReelUser | null;
  selectedCategory?: ReelCategory | null;
  selectedHashtag?: string | null;
  selectedUsername?: string | null;
}

export const FirstPartyProvider = {
  /**
   * Get all eligible, ranked first-party reels for the current user and context
   */
  getRankedPool(options: FirstPartyFilterOptions): DynamicReel[] {
    const {
      feedType,
      currentUser,
      selectedCategory,
      selectedHashtag,
      selectedUsername
    } = options;

    const allReels = ReelsStorage.getReels();
    const userId = currentUser?.id || 'guest';
    const blockedUsers = currentUser ? ReelsStorage.getBlockedUsers(currentUser.id) : [];
    const followsMap = ReelsStorage.getFollowsMap();
    const isFollowing = (targetId: string) => currentUser ? Boolean(followsMap[`${currentUser.id}_${targetId}`]) : false;

    // Base filtering
    let eligible = allReels.filter(reel => {
      // 1. Must be first-party
      if (reel.sourceType === 'YOUTUBE' || reel.youtubeVideoId) return false;

      // 2. Not blocked
      if (blockedUsers.includes(reel.creatorId)) return false;

      // 3. Approval status
      if (reel.status !== 'approved') {
        const isOwn = currentUser && currentUser.id === reel.creatorId;
        const isAdmin = currentUser && currentUser.role === 'admin';
        if (!isOwn && !isAdmin) return false;
      }

      // 4. Not suppressed
      if (ReelsStorage.isItemSuppressed(userId, reel.id)) return false;

      // 5. Category filter
      if (selectedCategory && reel.category !== selectedCategory) return false;

      // 6. Hashtag filter
      if (selectedHashtag) {
        const cleanTag = selectedHashtag.startsWith('#') ? selectedHashtag : `#${selectedHashtag}`;
        const hasTag = (reel.tags || []).some(t => t.toLowerCase() === cleanTag.toLowerCase());
        if (!hasTag) return false;
      }

      // 7. Username filter
      if (selectedUsername) {
        const cleanUser = selectedUsername.startsWith('@') ? selectedUsername.toLowerCase() : `@${selectedUsername.toLowerCase()}`;
        if (reel.creatorUsername.toLowerCase() !== cleanUser) return false;
      }

      return true;
    });

    // Mark source type explicitly
    eligible = eligible.map(r => ({
      ...r,
      sourceType: 'FIRST_PARTY' as const
    }));

    // Feed specific filtering & ranking
    if (feedType === 'following') {
      return eligible.filter(r => isFollowing(r.creatorId));
    }

    if (feedType === 'trending') {
      return [...eligible].sort((a, b) => {
        const scoreA = (a.viewsCount || 0) + (a.likesCount || 0) * 4 + (a.commentsCount || 0) * 5 + (a.savesCount || 0) * 3;
        const scoreB = (b.viewsCount || 0) + (b.likesCount || 0) * 4 + (b.commentsCount || 0) * 5 + (b.savesCount || 0) * 3;
        return scoreB - scoreA;
      });
    }

    if (feedType === 'latest') {
      return [...eligible].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Default: 'foryou' personalized ranking
    return [...eligible].sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, currentUser, isFollowing);
      const scoreB = this.calculateRelevanceScore(b, currentUser, isFollowing);
      return scoreB - scoreA;
    });
  },

  /**
   * Score a reel based on devotee preferences
   */
  calculateRelevanceScore(reel: DynamicReel, user: ReelUser | null, isFollowing: (id: string) => boolean): number {
    let score = 50; // Base score

    if (!user) {
      // Unauthenticated: prioritize popular/engaging
      return score + (reel.likesCount || 0) * 0.1 + (reel.viewsCount || 0) * 0.01;
    }

    // Following creator affinity (+60 points)
    if (isFollowing(reel.creatorId)) {
      score += 60;
    }

    // Devotee interest match (+40 points)
    if (user.interests && user.interests.length > 0) {
      const hasMatchingInterest = user.interests.some(interest => {
        const normInt = interest.toLowerCase();
        const normCat = reel.category.toLowerCase();
        if (normCat.includes(normInt) || normInt.includes(normCat)) return true;
        return (reel.tags || []).some(t => t.toLowerCase().includes(normInt));
      });
      if (hasMatchingInterest) score += 40;
    }

    // Language affinity (+25 points)
    if (user.language && reel.contentLanguage) {
      if (reel.contentLanguage === user.language) {
        score += 25;
      }
    }

    // Devotee city affinity (+20 points)
    if (user.city && reel.creatorCity && user.city.toLowerCase() === reel.creatorCity.toLowerCase()) {
      score += 20;
    }

    // Engagement weight
    score += Math.min(30, (reel.likesCount || 0) * 0.05 + (reel.viewsCount || 0) * 0.005);

    return score;
  },

  /**
   * Fetch a slice of first party reels with pagination cursor
   */
  getItems(options: FirstPartyFilterOptions, startIndex: number, count: number): { items: DynamicReel[]; nextIndex: number; hasMore: boolean } {
    const pool = this.getRankedPool(options);
    if (pool.length === 0) {
      return { items: [], nextIndex: 0, hasMore: false };
    }

    const items: DynamicReel[] = [];
    let idx = startIndex;
    for (let i = 0; i < count; i++) {
      if (idx < pool.length) {
        items.push(pool[idx]);
        idx++;
      } else {
        // Pool exhausted
        break;
      }
    }

    return {
      items,
      nextIndex: idx,
      hasMore: idx < pool.length
    };
  }
};
