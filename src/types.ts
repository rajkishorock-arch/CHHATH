export type Language = 'hi' | 'en' | 'bho' | 'mai' | 'mag';

export interface UserLocationPreference {
  state: string;
  city: string;
  isCustom?: boolean;
}

export interface DedicatedVirtualDiya {
  id: string;
  dedicationFor: string;
  senderName: string;
  city: string;
  timestamp: string;
  blessingMessage: string;
}

export interface FamilyTask {
  id: string;
  assignedTo: string;
  taskTitle: string;
  category: 'Puja' | 'Prasad' | 'Clothes' | 'Ghat' | 'Travel' | 'Shopping';
  completed: boolean;
}

export type ReelCategory =
  | 'Chhath Geet'
  | 'Puja Preparation'
  | 'Sandhya Arghya'
  | 'Usha Arghya'
  | 'Ghat'
  | 'Thekua / Prasad'
  | 'Chhath Decoration'
  | 'Family'
  | 'Culture'
  | 'Travel'
  | 'Devotional'
  | 'Chhath Katha'
  | 'Other';

export type FeedType = 'foryou' | 'following' | 'trending' | 'latest' | 'explore' | 'hashtag' | 'category' | 'user';

export type ReelPrivacy = 'public' | 'followers' | 'private';
export type ReelStatus = 'approved' | 'pending' | 'rejected';

export interface ChhathInterestItem {
  id: string;
  name: string;
  hindiName: string;
  emoji: string;
  categoryTag: ReelCategory;
}

export const CHHATH_INTERESTS: ChhathInterestItem[] = [
  { id: 'songs', name: 'Chhath Songs', hindiName: 'छठ पावन गीत', emoji: '🎵', categoryTag: 'Chhath Geet' },
  { id: 'vidhi', name: 'Puja Vidhi', hindiName: 'पूजा विधि व नियम', emoji: '🙏', categoryTag: 'Puja Preparation' },
  { id: 'arghya', name: 'Arghya', hindiName: 'अर्घ्य व सूर्य उपासना', emoji: '🌅', categoryTag: 'Sandhya Arghya' },
  { id: 'devotional', name: 'Devotional Content', hindiName: 'भक्ति व मंत्र पाठ', emoji: '🪔', categoryTag: 'Devotional' },
  { id: 'ghats', name: 'Chhath Ghats', hindiName: 'छठ घाट दर्शन', emoji: '📍', categoryTag: 'Ghat' },
  { id: 'prasad', name: 'Thekua & Prasad', hindiName: 'ठेकुआ व महाप्रसाद', emoji: '🍪', categoryTag: 'Thekua / Prasad' },
  { id: 'family', name: 'Family Chhath', hindiName: 'परिवार व सामूहिक छठ', emoji: '👨‍👩‍👧', categoryTag: 'Family' },
  { id: 'photography', name: 'Chhath Photography', hindiName: 'छठ छायाचित्र व दृश्य', emoji: '📸', categoryTag: 'Culture' },
  { id: 'reels', name: 'Chhath Reels', hindiName: 'छठ लघु वीडियो रील्स', emoji: '🎥', categoryTag: 'Chhath Geet' },
  { id: 'katha', name: 'Chhath Katha', hindiName: 'छठ पौराणिक कथा', emoji: '📜', categoryTag: 'Culture' },
  { id: 'bihar_culture', name: 'Bihar Culture', hindiName: 'बिहार व मिथिला संस्कृति', emoji: '🌾', categoryTag: 'Culture' },
  { id: 'religious_stories', name: 'Religious Stories', hindiName: 'धार्मिक व सूर्य गाथा', emoji: '🛕', categoryTag: 'Culture' },
  { id: 'travel', name: 'Chhath Travel', hindiName: 'छठ यात्रा व घर वापसी', emoji: '🧳', categoryTag: 'Travel' },
  { id: 'wishes', name: 'Wishes & Greetings', hindiName: 'बधाई संदेश व कार्ड', emoji: '❤️', categoryTag: 'Other' }
];

export interface ReelUser {
  id: string; // Authoritative UUID v4
  user_id?: string; // Authoritative UUID v4 alias matching relational schema
  name: string;
  username: string; // e.g., '@pramodchhath'
  email: string;
  passwordHash?: string;
  avatarUrl: string;
  coverUrl?: string;
  website?: string;
  bio: string;
  city: string;
  state?: string;
  country?: string;
  language: Language;
  role: 'user' | 'creator' | 'admin';
  followersCount: number;
  followingCount: number;
  totalLikesCount: number;
  reelsCount: number;
  verified?: boolean;
  isPrivate?: boolean;
  is_private?: boolean;
  interests: string[]; // interest IDs e.g. ['songs', 'vidhi', 'ghats']
  onboardingCompleted: boolean;
  listeningHistory?: string[];
  viewedTopics?: string[];
  savedGhats?: string[];
  createdAt: string;
}

export type SocialFollowStatus = 'accepted' | 'pending' | 'none';

export interface UserSettings {
  id?: string;
  user_id?: string;
  is_private_account: boolean;
  who_can_message: 'everyone' | 'following' | 'followers' | 'nobody';
  who_can_call: 'everyone' | 'following' | 'nobody';
  who_can_comment: 'everyone' | 'following' | 'nobody';
  show_activity_status: boolean;
  two_factor_enabled: boolean;
  ai_personalization_enabled: boolean;
  ai_voice_enabled: boolean;
  ai_chat_suggestions: boolean;
  updated_at?: string;
}

export interface ActiveSession {
  id: string;
  user_id: string;
  token?: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  os: string;
  ipAddress: string;
  locationCity: string;
  isCurrent?: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export type ContentSourceType = 'FIRST_PARTY' | 'FOLLOWING' | 'TRENDING' | 'EXTERNAL' | 'YOUTUBE';

export interface DynamicReel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string; // '@...'
  creatorAvatar: string;
  creatorCity?: string;
  title: string;
  description: string;
  category: ReelCategory;
  tags: string[]; // e.g. ['#ChhathPuja', '#ChhathiMaiya']
  videoUrl: string; // http URL, blob URL or IndexedDB key
  videoBlobKey?: string; // key in IndexedDB if locally uploaded
  thumbnailUrl: string;
  videoDuration: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  privacy: ReelPrivacy;
  status: ReelStatus;
  audioId?: string;
  audioTitle?: string;
  audioArtist?: string;
  createdAt: string;
  aspectRatio?: '9:16' | '16:9' | '1:1';

  // Smart Content Fallback Engine Properties
  sourceType?: ContentSourceType;
  youtubeVideoId?: string;
  channelTitle?: string;
  externalSourceUrl?: string;
  isEmbeddable?: boolean;
  contentLanguage?: Language | string;
}

export interface UserContentImpression {
  reelId: string;
  sourceType: ContentSourceType;
  youtubeId?: string;
  timestamp: number;
  watchSeconds?: number;
}

export interface NotInterestedSignal {
  reelId: string;
  youtubeId?: string;
  category?: ReelCategory;
  tags?: string[];
  channelTitle?: string;
  timestamp: number;
}

// Backward compatibility alias for any existing reference
export type ChhathReel = DynamicReel;

export interface ReelComment {
  id: string;
  reelId: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  text: string;
  likesCount: number;
  parentId?: string; // For threaded nested replies
  createdAt: string;
}

export interface ReelDraft {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: ReelCategory;
  tags: string[];
  privacy: ReelPrivacy;
  videoBlobKey?: string;
  thumbnailUrl?: string;
  videoDuration?: string;
  updatedAt: string;
}

export interface ReelReport {
  id: string;
  reelId: string;
  reelTitle: string;
  reportedByUserId: string;
  reason: 'Spam' | 'Harassment' | 'Copyright' | 'Nudity' | 'Violence' | 'Hate' | 'Misleading' | 'Other';
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed' | 'resolved';
  timestamp: string;
}

export interface ReelNotification {
  id: string;
  userId: string; // recipient
  actorId: string;
  actorName: string;
  actorUsername: string;
  actorAvatar: string;
  type: 'like' | 'comment' | 'follow' | 'reply';
  reelId?: string;
  text: string;
  read: boolean;
  timestamp: string;
}

export interface ReelAudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  reelsCount: number;
}

export interface AmbientTrack {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export interface ChhathCommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  city: string;
  location: string;
  organizer: string;
  description: string;
  mapLink: string;
  verified: boolean;
}

export interface ShoppingSamagriItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'Bamboo' | 'Earthen' | 'Clothing' | 'Prasad Raw' | 'Sacred Puja';
  recommendedPriceRange: string;
  significance: string;
  procurementTip: string;
}

export interface Song {
  id: string;
  title: string;
  singer: string;
  language: string;
  category: string;
  duration: string;
  audioUrl: string;
  thumbnail: string;
  lyricsSnippet?: string;
  lyrics?: string;
  description?: string;
  youtubeId?: string;
  playlistId?: string;
  isPlaylist?: boolean;
  trackCount?: number;
  previewAudioUrl?: string;
}

export interface Ghat {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  river: string;
  crowdStatus: 'Normal' | 'Moderate' | 'Heavy' | 'Very High';
  facilities: string[];
  parkingInfo: string;
  waterQuality: string;
  lightingStatus: string;
  emergencyHelpline: string;
  googleMapsQuery: string;
  coordinates: { lat: number; lng: number };
}

export interface SamagriItem {
  id: string;
  name: string;
  category: 'puja_vessels' | 'fruits_crops' | 'prasad_ingredients' | 'rituals_sacred';
  description: string;
  defaultChecked?: boolean;
}

export interface ChhathDayInfo {
  dayNumber: 1 | 2 | 3 | 4;
  id: string;
  title: string;
  nameKey: string;
  date2026: string;
  tithi: string;
  meaning: string;
  rituals: string[];
  food: string;
  importance: string;
  bgGradient: string;
}

export interface PrasadItem {
  id: string;
  name: string;
  localName: string;
  shortDesc: string;
  ingredients: string[];
  method: string[];
  culturalSignificance: string;
  image: string;
}

export interface KathaStory {
  id: string;
  title: string;
  category: string;
  story: string[];
  moral: string;
  ritualsLink: string;
}

export interface MantraItem {
  id: string;
  title: string;
  deity: string;
  sanskrit: string;
  transliteration: string;
  hindiMeaning: string;
}

export interface WishItem {
  id: string;
  category: 'hindi' | 'bhojpuri' | 'maithili' | 'whatsapp' | 'instagram' | 'short';
  text: string;
  authorNote?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: 'Culture' | 'History' | 'Rituals' | 'Food' | 'Music';
  image: string;
}

export interface LiveUpdate {
  id: string;
  title: string;
  category: 'Traffic' | 'Ghat Preparation' | 'Weather' | 'Train Special' | 'Health & Safety';
  timestamp: string;
  verifiedSource: string;
  details: string;
  urgent?: boolean;
}

export interface CityArghyaTime {
  cityName: string;
  state: string;
  sandhyaSunset: string; // 2026 Karthik Shashthi Evening
  ushaSunrise: string;   // 2026 Karthik Saptami Morning
  weatherTemp: string;
  weatherCondition: string;
  river: string;
}

// ==========================================
// CHHATH CONNECT: COMMUNICATION ECOSYSTEM TYPES
// ==========================================

export type ChatMessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'voice' 
  | 'reel' 
  | 'song' 
  | 'profile' 
  | 'ghat' 
  | 'plan' 
  | 'poll' 
  | 'system'
  | 'rich_card';

export type MessageType = ChatMessageType;

export interface RichCardPayload {
  type: 'reel' | 'song' | 'ghat' | 'plan' | 'poll';
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  url?: string;
  metadata?: any;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  receiverId?: string;
  type: ChatMessageType;
  text?: string;
  mediaUrl?: string;
  mediaDuration?: string | number;
  mediaThumbnail?: string;
  voiceDuration?: number;
  voiceWaveform?: number[];
  richCard?: RichCardPayload;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
    type?: ChatMessageType;
  };
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  metadata?: {
    reelId?: string;
    reelTitle?: string;
    reelThumbnail?: string;
    reelCreator?: string;
    songId?: string;
    songTitle?: string;
    songSinger?: string;
    songThumbnail?: string;
    ghatId?: string;
    ghatName?: string;
    ghatCity?: string;
    ghatRiver?: string;
    planDaysCount?: number;
    planCity?: string;
    pollId?: string;
    pollQuestion?: string;
    pollOptions?: { id: string; text: string; voterIds: string[] }[];
    [key: string]: any;
  };
  status: MessageStatus;
  readBy: Record<string, string | number>; // userId -> timestamp
  deliveredTo: Record<string, string | number>; // userId -> timestamp
  isEdited?: boolean;
  deletedFor?: string[]; // userIds who deleted for me
  isDeletedForEveryone?: boolean;
  isForwarded?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ConversationType = 'direct' | 'group' | 'event';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  avatar?: string;
  description?: string;
  participantIds: string[];
  admins?: string[];
  createdBy: string;
  lastMessage?: ChatMessage;
  lastMessageAt: string;
  pinnedBy: string[];
  mutedBy: Record<string, number>; // userId -> muteUntil epoch ms
  disappearingDuration?: number; // seconds, 0 = off
  theme?: 'sunrise' | 'ghat' | 'diya' | 'golden' | 'dark';
  isMessageRequest?: boolean;
  requestStatus?: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ChatPollOption {
  id: string;
  text: string;
  voterIds: string[];
  votes?: string[];
}

export interface ChatPoll {
  id: string;
  question: string;
  options: ChatPollOption[];
  createdBy: string;
  createdAt: string;
}

export type CallType = 'voice' | 'video';
export type CallStatus = 'ringing' | 'connected' | 'ended' | 'declined' | 'missed';

export interface CallSession {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  receiverId: string;
  type: CallType;
  status: CallStatus;
  startedAt: number;
  endedAt?: number;
  durationSeconds?: number;
}

export interface ChatPrivacySettings {
  whoCanMessageMe: 'everyone' | 'following' | 'followers' | 'nobody';
  whoCanAddToGroups: 'everyone' | 'following' | 'nobody';
  whoCanCallMe: 'everyone' | 'following' | 'nobody';
  activityStatus: boolean; // whether to broadcast online presence
}

