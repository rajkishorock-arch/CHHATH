import { DynamicReel, ReelCategory, ReelUser } from '../../types';

export type ContentSourceType = 'FIRST_PARTY' | 'YOUTUBE' | 'EXTERNAL_PARTNER';

export type VideoValidationStatus = 'VALID' | 'PENDING' | 'INVALID' | 'EXPIRED' | 'BLOCKED';

export interface CachedYouTubeVideo {
  youtubeVideoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt?: string;
  query?: string;
  language?: string;
  category?: ReelCategory;
  embeddable: boolean;
  lastValidatedAt: number;
  status: VideoValidationStatus;
  errorCode?: number;
}

export interface FeedCursorData {
  batchNumber: number;
  fpIndex: number;
  extIndex: number;
  seed: number;
  timestamp: number;
}

export interface FeedPageResponse {
  items: DynamicReel[];
  nextCursor: string | null;
  hasMore: boolean;
  totalAvailable?: number;
}

export interface FeedFetchOptions {
  cursor?: string | null;
  limit?: number;
  feedType: 'foryou' | 'following' | 'trending' | 'latest' | 'explore' | 'hashtag' | 'category' | 'user';
  currentUser: ReelUser | null;
  selectedCategory?: ReelCategory | null;
  selectedHashtag?: string | null;
  selectedUsername?: string | null;
}
