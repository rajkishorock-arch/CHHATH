import { 
  DynamicReel, 
  ReelUser, 
  FeedType, 
  ReelCategory, 
  ContentSourceType 
} from '../types';
import { ReelsStorage } from './reelsStorage';

export interface FallbackFeedOptions {
  allFirstPartyReels: DynamicReel[];
  feedType: FeedType;
  currentUser: ReelUser | null;
  selectedCategory?: ReelCategory | null;
  selectedHashtag?: string | null;
  selectedUsername?: string | null;
  targetSize?: number;
}

export const SmartFallbackEngine = {
  /**
   * Main entry point: builds a personalized, never-empty feed
   */
  buildFeed(options: FallbackFeedOptions): DynamicReel[] {
    const {
      allFirstPartyReels,
      feedType,
      currentUser,
      selectedCategory,
      selectedHashtag,
      selectedUsername,
      targetSize = 20
    } = options;

    const userId = currentUser?.id || 'guest';
    const blockedUsers = currentUser ? ReelsStorage.getBlockedUsers(currentUser.id) : [];

    // 1. Filter First-Party Reels
    let firstParty = allFirstPartyReels.filter(r => {
      if (blockedUsers.includes(r.creatorId)) return false;
      if (r.status !== 'approved') {
        if (!currentUser || (currentUser.id !== r.creatorId && currentUser.role !== 'admin')) {
          return false;
        }
      }
      if (ReelsStorage.isItemSuppressed(userId, r.id)) {
        return false;
      }
      return true;
    });

    // Mark all first-party reels with proper sourceType
    firstParty = firstParty.map(r => ({
      ...r,
      sourceType: r.sourceType || 'FIRST_PARTY'
    }));

    // Handle user-specific feed directly
    if (feedType === 'user' && selectedUsername) {
      const clean = selectedUsername.startsWith('@') 
        ? selectedUsername.toLowerCase() 
        : `@${selectedUsername.toLowerCase()}`;
      return firstParty.filter(r => r.creatorUsername.toLowerCase() === clean);
    }

    // 2. Fetch and filter External / YouTube Catalog
    const externalCatalog = ReelsStorage.getExternalCatalog();
    const cleanExternal = externalCatalog.filter(r => {
      if (ReelsStorage.isItemSuppressed(userId, r.id, r.youtubeVideoId)) {
        return false;
      }
      return true;
    });

    // 3. Feed-Specific Logic & Mixing
    if (feedType === 'following') {
      return this.buildFollowingFeed({
        firstParty,
        externalCatalog: cleanExternal,
        currentUser,
        userId,
        targetSize
      });
    }

    if (feedType === 'trending') {
      return this.buildTrendingFeed({
        firstParty,
        externalCatalog: cleanExternal,
        targetSize
      });
    }

    if (feedType === 'latest') {
      return this.buildLatestFeed({
        firstParty,
        externalCatalog: cleanExternal,
        targetSize
      });
    }

    if (feedType === 'category' && selectedCategory) {
      return this.buildCategoryFeed({
        firstParty,
        externalCatalog: cleanExternal,
        category: selectedCategory,
        currentUser,
        targetSize
      });
    }

    if (feedType === 'hashtag' && selectedHashtag) {
      return this.buildHashtagFeed({
        firstParty,
        externalCatalog: cleanExternal,
        hashtag: selectedHashtag,
        currentUser,
        targetSize
      });
    }

    // Default: 'foryou' & 'explore'
    return this.buildForYouFeed({
      firstParty,
      externalCatalog: cleanExternal,
      currentUser,
      userId,
      targetSize
    });
  },

  /**
   * FOR YOU FEED: Algorithmic blend of First-Party, Followed, Trending, and Personalized External/YouTube
   */
  buildForYouFeed(params: {
    firstParty: DynamicReel[];
    externalCatalog: DynamicReel[];
    currentUser: ReelUser | null;
    userId: string;
    targetSize: number;
  }): DynamicReel[] {
    const { firstParty, externalCatalog, currentUser, targetSize } = params;

    // Rank First-Party Reels by personalization
    const rankedFirstParty = [...firstParty].sort((a, b) => {
      const scoreA = this.calculatePersonalizationScore(a, currentUser);
      const scoreB = this.calculatePersonalizationScore(b, currentUser);
      return scoreB - scoreA;
    });

    // Rank External/YouTube Catalog by personalization
    const rankedExternal = [...externalCatalog].sort((a, b) => {
      const scoreA = this.calculatePersonalizationScore(a, currentUser);
      const scoreB = this.calculatePersonalizationScore(b, currentUser);
      return scoreB - scoreA;
    });

    // Natural Mixing:
    return this.interweaveReels(rankedFirstParty, rankedExternal, targetSize);
  },

  /**
   * FOLLOWING FEED: First-party from followed creators, graceful fallback if insufficient
   */
  buildFollowingFeed(params: {
    firstParty: DynamicReel[];
    externalCatalog: DynamicReel[];
    currentUser: ReelUser | null;
    userId: string;
    targetSize: number;
  }): DynamicReel[] {
    const { firstParty, externalCatalog, currentUser, targetSize } = params;

    if (!currentUser) return [];

    // Filter followed creators
    const followedFirstParty = firstParty.filter(r => 
      ReelsStorage.isFollowing(currentUser.id, r.creatorId)
    );

    // If followed creator reels are enough (>= targetSize), return strictly followed
    if (followedFirstParty.length >= targetSize) {
      return followedFirstParty.slice(0, targetSize);
    }

    // Graceful fallback: supplement with top cultural external reels matching devotee's interests
    const needed = targetSize - followedFirstParty.length;
    const rankedExternal = [...externalCatalog].sort((a, b) => {
      return this.calculatePersonalizationScore(b, currentUser) - this.calculatePersonalizationScore(a, currentUser);
    });

    return [...followedFirstParty, ...rankedExternal.slice(0, needed)];
  },

  /**
   * TRENDING FEED: High engagement first-party reels + popular external cultural videos
   */
  buildTrendingFeed(params: {
    firstParty: DynamicReel[];
    externalCatalog: DynamicReel[];
    targetSize: number;
  }): DynamicReel[] {
    const { firstParty, externalCatalog, targetSize } = params;

    const rankEngagement = (r: DynamicReel) => {
      return (r.viewsCount * 1) + (r.likesCount * 3) + (r.commentsCount * 4) + (r.sharesCount * 5) + (r.savesCount * 4);
    };

    const rankedFP = [...firstParty].sort((a, b) => rankEngagement(b) - rankEngagement(a));
    const rankedExt = [...externalCatalog].sort((a, b) => rankEngagement(b) - rankEngagement(a));

    return this.interweaveReels(rankedFP, rankedExt, targetSize);
  },

  /**
   * LATEST FEED: Chronological order
   */
  buildLatestFeed(params: {
    firstParty: DynamicReel[];
    externalCatalog: DynamicReel[];
    targetSize: number;
  }): DynamicReel[] {
    const { firstParty, externalCatalog, targetSize } = params;

    const combined = [...firstParty, ...externalCatalog].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return combined.slice(0, targetSize);
  },

  /**
   * CATEGORY FEED: Matches category across both first-party and external catalog
   */
  buildCategoryFeed(params: {
    firstParty: DynamicReel[];
    externalCatalog: DynamicReel[];
    category: ReelCategory;
    currentUser: ReelUser | null;
    targetSize: number;
  }): DynamicReel[] {
    const { firstParty, externalCatalog, category, currentUser, targetSize } = params;

    const matchedFP = firstParty.filter(r => r.category === category);
    const matchedExt = externalCatalog.filter(r => r.category === category);

    const sortedFP = [...matchedFP].sort((a, b) => 
      this.calculatePersonalizationScore(b, currentUser) - this.calculatePersonalizationScore(a, currentUser)
    );
    const sortedExt = [...matchedExt].sort((a, b) => 
      this.calculatePersonalizationScore(b, currentUser) - this.calculatePersonalizationScore(a, currentUser)
    );

    return this.interweaveReels(sortedFP, sortedExt, targetSize);
  },

  /**
   * HASHTAG FEED: Matches hashtag across both first-party and external catalog
   */
  buildHashtagFeed(params: {
    firstParty: DynamicReel[];
    externalCatalog: DynamicReel[];
    hashtag: string;
    currentUser: ReelUser | null;
    targetSize: number;
  }): DynamicReel[] {
    const { firstParty, externalCatalog, hashtag, currentUser, targetSize } = params;
    const clean = hashtag.startsWith('#') ? hashtag.toLowerCase() : `#${hashtag.toLowerCase()}`;

    const matchedFP = firstParty.filter(r => r.tags.some(t => t.toLowerCase() === clean));
    const matchedExt = externalCatalog.filter(r => r.tags.some(t => t.toLowerCase() === clean));

    return this.interweaveReels(matchedFP, matchedExt, targetSize);
  },

  /**
   * Personalization Scoring Engine (Language, Interests, City, Following, Engagement)
   */
  calculatePersonalizationScore(reel: DynamicReel, user: ReelUser | null): number {
    let score = 0;

    if (!user) {
      // Base score for guests based on engagement
      return (reel.viewsCount * 0.001) + (reel.likesCount * 0.02) + (reel.sharesCount * 0.03);
    }

    // 1. Language Affinity (+45 points)
    const userLang = user.language; // 'hi', 'bho', 'mai', 'en'
    if (userLang && reel.contentLanguage) {
      if (userLang === reel.contentLanguage) {
        score += 45;
      } else if (userLang === 'hi' && reel.contentLanguage === 'bho') {
        score += 25;
      } else if (userLang === 'bho' && reel.contentLanguage === 'hi') {
        score += 25;
      }
    }

    // 2. Selected 14 Interests Affinity (+40 points)
    const userInterests = user.interests || [];
    const cat = reel.category;

    if (userInterests.includes('songs') && cat === 'Chhath Geet') score += 40;
    if (userInterests.includes('vidhi') && cat === 'Puja Preparation') score += 40;
    if (userInterests.includes('arghya') && (cat === 'Sandhya Arghya' || cat === 'Usha Arghya')) score += 40;
    if (userInterests.includes('prasad') && cat === 'Thekua / Prasad') score += 40;
    if (userInterests.includes('ghats') && cat === 'Ghat') score += 40;
    if (userInterests.includes('family') && cat === 'Family') score += 40;
    if (userInterests.includes('bihar_culture') && cat === 'Culture') score += 40;
    if (userInterests.includes('katha') && cat === 'Chhath Katha') score += 40;
    if (userInterests.includes('devotional') && cat === 'Devotional') score += 40;
    if (userInterests.includes('travel') && cat === 'Travel') score += 40;

    // 3. Location / City Affinity (+25 points)
    if (user.city && reel.creatorCity) {
      if (reel.creatorCity.toLowerCase().includes(user.city.toLowerCase())) {
        score += 25;
      }
    }

    // 4. Followed Creator (+50 points)
    if (reel.creatorId && ReelsStorage.isFollowing(user.id, reel.creatorId)) {
      score += 50;
    }

    // 5. Verified / Official Creator (+15 points)
    if (reel.channelTitle || reel.creatorName.includes('न्यास') || reel.creatorName.includes('Official')) {
      score += 15;
    }

    // 6. Natural Engagement Weight
    score += (reel.viewsCount * 0.0005) + (reel.likesCount * 0.015) + (reel.sharesCount * 0.02) + (reel.savesCount * 0.02);

    return score;
  },

  /**
   * Natural Interweaving Feed Mixer (Prevents dumping all external videos at the end)
   */
  interweaveReels(firstParty: DynamicReel[], external: DynamicReel[], targetSize: number): DynamicReel[] {
    const result: DynamicReel[] = [];
    const fpCopy = [...firstParty];
    const extCopy = [...external];

    if (fpCopy.length === 0) {
      return extCopy.slice(0, targetSize);
    }

    if (extCopy.length === 0) {
      return fpCopy.slice(0, targetSize);
    }

    if (fpCopy.length >= 8) {
      // Community-heavy mode (70% First-party / 30% External)
      while ((fpCopy.length > 0 || extCopy.length > 0) && result.length < targetSize) {
        if (fpCopy.length > 0) result.push(fpCopy.shift()!);
        if (fpCopy.length > 0) result.push(fpCopy.shift()!);
        if (extCopy.length > 0) result.push(extCopy.shift()!);
      }
    } else {
      // Early community mode: First-party distributed evenly so community posts are highlighted first!
      const step = Math.max(2, Math.floor(targetSize / (fpCopy.length + 1)));
      for (let i = 0; i < targetSize; i++) {
        if (i % step === 0 && fpCopy.length > 0) {
          result.push(fpCopy.shift()!);
        } else if (extCopy.length > 0) {
          result.push(extCopy.shift()!);
        } else if (fpCopy.length > 0) {
          result.push(fpCopy.shift()!);
        }
      }
    }

    // Truly infinite guarantee: if targetSize exceeds available unique items, extend dynamically
    const allAvailable = [...firstParty, ...external];
    if (result.length < targetSize && allAvailable.length > 0) {
      let cycle = 1;
      while (result.length < targetSize) {
        for (const item of allAvailable) {
          if (result.length >= targetSize) break;
          result.push({
            ...item,
            id: `${item.id}_dyn${cycle}_${Math.random().toString(36).substring(2, 5)}`
          });
        }
        cycle++;
      }
    }

    return result.slice(0, targetSize);
  }
};
