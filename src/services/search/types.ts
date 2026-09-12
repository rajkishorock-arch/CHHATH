export type SearchCategoryType = 
  | 'user' 
  | 'reel' 
  | 'song' 
  | 'video' 
  | 'hashtag' 
  | 'article' 
  | 'recipe' 
  | 'ghat' 
  | 'mantra' 
  | 'event' 
  | 'samagri';

export type SearchSource = 'internal' | 'youtube';

export interface NormalizedSearchResult {
  id: string;
  source: SearchSource;
  type: SearchCategoryType;
  title: string;
  description: string;
  thumbnail: string;
  creator?: string;
  creatorHandle?: string;
  url?: string;
  videoId?: string;
  relevanceScore: number;
  badge?: string;
  metadata?: {
    followersCount?: number;
    verified?: boolean;
    duration?: string;
    language?: string;
    category?: string;
    city?: string;
    views?: number;
    channelTitle?: string;
    ingredients?: string[];
    [key: string]: any;
  };
}

export type SearchIntent = 
  | 'USER' 
  | 'REEL' 
  | 'SONG' 
  | 'VIDEO' 
  | 'HASHTAG' 
  | 'RECIPE' 
  | 'PUJA' 
  | 'GHAT' 
  | 'ARTICLE' 
  | 'GENERAL' 
  | 'CHHATH';

export interface QueryAnalysis {
  rawQuery: string;
  cleanQuery: string;
  intent: SearchIntent;
  isUsernameQuery: boolean;
  targetUsername?: string;
  isChhathRelevant: boolean;
  expandedQueries: string[];
  detectedLanguage?: 'bho' | 'mai' | 'hi' | 'en';
}

export type SearchTab = 'top' | 'people' | 'reels' | 'songs' | 'videos' | 'hashtags' | 'articles';

export interface UnifiedSearchResponse {
  query: string;
  analysis: QueryAnalysis;
  isChhathRelevant: boolean;
  message?: string;
  results: NormalizedSearchResult[];
  categorized: {
    top: NormalizedSearchResult[];
    people: NormalizedSearchResult[];
    reels: NormalizedSearchResult[];
    songs: NormalizedSearchResult[];
    videos: NormalizedSearchResult[];
    hashtags: NormalizedSearchResult[];
    articles: NormalizedSearchResult[];
  };
  availableTabs: SearchTab[];
  nextPageToken?: string;
  exactUser?: NormalizedSearchResult | null;
  exactUserReels?: NormalizedSearchResult[];
}

export interface SearchSuggestionItem {
  type: 'user' | 'reel' | 'song' | 'ghat' | 'hashtag' | 'video' | 'recipe';
  icon: string;
  label: string;
  sub?: string;
}
