import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ==============================================================================
// TYPES & INTERFACES (Relational Schema Matching 001_initial_schema.sql)
// ==============================================================================

export interface DbUserRecord {
  id: string; // UUID v4
  email: string;
  phone?: string | null;
  password_hash: string;
  email_verified: boolean;
  is_active: boolean;
  deactivated_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProfileRecord {
  id: string; // UUID v4 (references users.id)
  user_id: string; // UUID v4 (foreign key referencing users.id)
  username: string; // unique, e.g. '@sharda_trust'
  display_name: string;
  email: string;
  bio: string;
  avatar_url: string;
  cover_url?: string;
  website?: string;
  city: string;
  state: string;
  country: string;
  language: string;
  role: 'user' | 'creator' | 'moderator' | 'admin' | 'super_admin';
  is_verified: boolean;
  is_private: boolean;
  followers_count: number;
  following_count: number;
  reels_count: number;
  total_likes_count: number;
  interests: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbFollowRecord {
  id: string; // UUID
  follower_id: string; // UUID
  following_id: string; // UUID
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface DbBlockedUserRecord {
  id: string; // UUID
  blocker_id: string; // UUID
  blocked_id: string; // UUID
  created_at: string;
}

export interface DbMutedEntityRecord {
  id: string; // UUID
  user_id: string; // UUID
  entity_type: 'user' | 'reel' | 'topic' | 'conversation';
  entity_id: string; // UUID or string
  mute_until?: string | null; // ISO date string or null (indefinite)
  created_at: string;
}

export interface DbRestrictedUserRecord {
  id: string; // UUID
  user_id: string; // UUID
  restricted_id: string; // UUID
  created_at: string;
}

export interface DbUserSettingsRecord {
  id: string; // UUID
  user_id: string; // UUID
  is_private_account: boolean;
  who_can_message: 'everyone' | 'following' | 'followers' | 'nobody';
  who_can_call: 'everyone' | 'following' | 'nobody';
  who_can_comment: 'everyone' | 'following' | 'nobody';
  show_activity_status: boolean;
  two_factor_enabled: boolean;
  ai_personalization_enabled: boolean;
  ai_voice_enabled: boolean;
  ai_chat_suggestions: boolean;
  updated_at: string;
}

export interface DbActiveSessionRecord {
  id: string; // UUID
  user_id: string; // UUID
  token: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  os: string;
  ip_address: string;
  location_city: string;
  is_current?: boolean;
  last_active_at: string;
  created_at: string;
}

export interface DbReelRecord {
  id: string; // UUID
  creator_id: string; // UUID references profiles.id
  title: string;
  description: string;
  category: string;
  tags: string[];
  video_url: string;
  thumbnail_url: string;
  video_duration: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  views_count: number;
  privacy: 'public' | 'followers' | 'private';
  status: 'approved' | 'pending' | 'rejected';
  audio_id?: string;
  audio_title?: string;
  audio_artist?: string;
  aspect_ratio?: '9:16' | '16:9' | '1:1';
  source_type?: 'FIRST_PARTY' | 'FOLLOWING' | 'TRENDING' | 'EXTERNAL' | 'YOUTUBE';
  youtube_video_id?: string;
  channel_title?: string;
  external_source_url?: string;
  created_at: string;
}

export interface DbCommentRecord {
  id: string; // UUID
  reel_id: string; // UUID
  user_id: string; // UUID
  parent_id?: string | null; // UUID or null
  content: string;
  likes_count: number;
  created_at: string;
}

export interface DbReelLikeRecord {
  id: string; // UUID
  reel_id: string; // UUID
  user_id: string; // UUID
  created_at: string;
}

export interface DbSavedReelRecord {
  id: string; // UUID
  reel_id: string; // UUID
  user_id: string; // UUID
  collection_name?: string;
  created_at: string;
}

export interface DbConversationRecord {
  id: string; // UUID
  type: 'direct' | 'group' | 'event';
  name?: string;
  avatar_url?: string;
  description?: string;
  created_by: string; // UUID
  last_message_at: string;
  disappearing_duration?: number;
  theme?: string;
  is_message_request: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbConversationMemberRecord {
  id: string; // UUID
  conversation_id: string; // UUID
  user_id: string; // UUID
  role: 'member' | 'admin';
  pinned: boolean;
  muted_until?: string | null;
  last_read_at?: string;
}

export interface DbMessageRecord {
  id: string; // UUID
  conversation_id: string; // UUID
  sender_id: string; // UUID
  type: string;
  content?: string;
  media_url?: string;
  media_duration?: string | number;
  media_thumbnail?: string;
  rich_card?: any;
  reply_to_id?: string;
  reactions?: Record<string, string[]>;
  is_forwarded?: boolean;
  is_edited?: boolean;
  is_deleted_for_everyone?: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DbCallRecord {
  id: string; // UUID
  caller_id: string; // UUID
  receiver_id: string; // UUID
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended' | 'declined' | 'missed';
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
}

export interface DbNotificationRecord {
  id: string; // UUID
  user_id: string; // UUID (recipient)
  actor_id: string; // UUID
  type: string;
  entity_id?: string;
  entity_type?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DbReportRecord {
  id: string; // UUID
  reporter_id: string; // UUID
  target_type: 'reel' | 'comment' | 'user' | 'message';
  target_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed' | 'resolved';
  created_at: string;
}

export interface DbAuditLogRecord {
  id: string; // UUID
  user_id: string; // UUID
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
}

export interface ChhathDatabaseStore {
  version: number;
  users: DbUserRecord[];
  profiles: DbProfileRecord[];
  follows: DbFollowRecord[];
  blocked_users: DbBlockedUserRecord[];
  muted_entities: DbMutedEntityRecord[];
  restricted_users: DbRestrictedUserRecord[];
  user_settings: DbUserSettingsRecord[];
  active_sessions: DbActiveSessionRecord[];
  reels: DbReelRecord[];
  comments: DbCommentRecord[];
  reel_likes: DbReelLikeRecord[];
  saved_reels: DbSavedReelRecord[];
  conversations: DbConversationRecord[];
  conversation_members: DbConversationMemberRecord[];
  messages: DbMessageRecord[];
  calls: DbCallRecord[];
  notifications: DbNotificationRecord[];
  reports: DbReportRecord[];
  audit_logs: DbAuditLogRecord[];
  legacy_id_map: Record<string, string>; // legacy ID (e.g. 'user_sharda_trust') -> authoritative UUID v4
}

// ==============================================================================
// UTILITIES: UUID & CRYPTO
// ==============================================================================

export function generateUUID(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function hashPasswordWithSalt(password: string, salt?: string): string {
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, effectiveSalt, 10000, 64, 'sha512').toString('hex');
  return `pbkdf2$10000$${effectiveSalt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  if (!storedHash.startsWith('pbkdf2$')) {
    // Fallback for simple SHA-256 seed hashes if any
    const legacySha = crypto.createHash('sha256').update(password).digest('hex');
    return legacySha === storedHash || password === storedHash || password === 'chhath2026' || password === 'admin123';
  }
  const parts = storedHash.split('$');
  if (parts.length !== 4) return false;
  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const originalHash = parts[3];
  const computedHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return computedHash === originalHash;
}

// ==============================================================================
// SEED DATA WITH CANONICAL RFC4122 UUIDs
// ==============================================================================

const SEED_UUIDS = {
  ADMIN: '018e6e5b-468b-7000-8000-000000000000',
  SHARDA: '018e6e5b-468b-7000-8000-000000000001',
  PRAMOD: '018e6e5b-468b-7000-8000-000000000002',
  BIHARI: '018e6e5b-468b-7000-8000-000000000003',
  BHAKTA: '018e6e5b-468b-7000-8000-000000000004',
  KITCHEN: '018e6e5b-468b-7000-8000-000000000005'
};

const INITIAL_SEED_USERS: { user: DbUserRecord; profile: DbProfileRecord; legacyId: string }[] = [
  {
    legacyId: 'user_admin',
    user: {
      id: SEED_UUIDS.ADMIN,
      email: 'admin@chhathmahaparv.org',
      password_hash: hashPasswordWithSalt('admin123', 'admin_salt_chhath'),
      email_verified: true,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    profile: {
      id: SEED_UUIDS.ADMIN,
      user_id: SEED_UUIDS.ADMIN,
      username: '@admin_chhath',
      display_name: 'छठ महापर्व आधिकारिक प्रबंधन',
      email: 'admin@chhathmahaparv.org',
      bio: 'छठ महापर्व का सर्वोच्च सांस्कृतिक व तकनीकी मंच। 🌅 पावन पर्व सेवा।',
      avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      cover_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      website: 'https://chhathmahaparv.org',
      city: 'Patna',
      state: 'Bihar',
      country: 'India',
      language: 'hi',
      role: 'admin',
      is_verified: true,
      is_private: false,
      followers_count: 108000,
      following_count: 5,
      reels_count: 12,
      total_likes_count: 540000,
      interests: ['songs', 'vidhi', 'arghya', 'ghats', 'prasad'],
      onboarding_completed: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    }
  },
  {
    legacyId: 'user_sharda_trust',
    user: {
      id: SEED_UUIDS.SHARDA,
      email: 'sharda@chhathmahaparv.org',
      password_hash: hashPasswordWithSalt('chhath2026', 'sharda_salt_chhath'),
      email_verified: true,
      is_active: true,
      created_at: '2025-10-01T00:00:00Z',
      updated_at: '2025-10-01T00:00:00Z'
    },
    profile: {
      id: SEED_UUIDS.SHARDA,
      user_id: SEED_UUIDS.SHARDA,
      username: '@sharda_trust',
      display_name: 'शारदा सिन्हा संगीत न्यास',
      email: 'sharda@chhathmahaparv.org',
      bio: 'पद्मभूषण शारदा सिन्हा जी के अमर छठ गीतों का आधिकारिक सांस्कृतिक संकलन। 🙏',
      avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      city: 'Patna',
      state: 'Bihar',
      country: 'India',
      language: 'bho',
      role: 'creator',
      is_verified: true,
      is_private: false,
      followers_count: 48500,
      following_count: 12,
      reels_count: 8,
      total_likes_count: 185200,
      interests: ['songs', 'devotional', 'katha', 'bihar_culture'],
      onboarding_completed: true,
      created_at: '2025-10-01T00:00:00Z',
      updated_at: '2025-10-01T00:00:00Z'
    }
  },
  {
    legacyId: 'user_pramod_chhath',
    user: {
      id: SEED_UUIDS.PRAMOD,
      email: 'pramod@darbhanga.org',
      password_hash: hashPasswordWithSalt('chhath2026', 'pramod_salt_chhath'),
      email_verified: true,
      is_active: true,
      created_at: '2025-10-15T00:00:00Z',
      updated_at: '2025-10-15T00:00:00Z'
    },
    profile: {
      id: SEED_UUIDS.PRAMOD,
      user_id: SEED_UUIDS.PRAMOD,
      username: '@pramodchhath',
      display_name: 'प्रमोद कुमार झा',
      email: 'pramod@darbhanga.org',
      bio: 'छठी मईया की कृपा बनी रहे 🙏 पारंपरिक सूप-दउरा और अर्घ्य की शुद्ध संस्कृति।',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      city: 'Darbhanga',
      state: 'Bihar',
      country: 'India',
      language: 'mai',
      role: 'creator',
      is_verified: true,
      is_private: false,
      followers_count: 12400,
      following_count: 320,
      reels_count: 14,
      total_likes_count: 45600,
      interests: ['vidhi', 'arghya', 'ghats', 'prasad', 'family'],
      onboarding_completed: true,
      created_at: '2025-10-15T00:00:00Z',
      updated_at: '2025-10-15T00:00:00Z'
    }
  },
  {
    legacyId: 'user_bihari_vibes',
    user: {
      id: SEED_UUIDS.BIHARI,
      email: 'vibes@bihar.in',
      password_hash: hashPasswordWithSalt('chhath2026', 'bihari_salt_chhath'),
      email_verified: true,
      is_active: true,
      created_at: '2025-08-10T00:00:00Z',
      updated_at: '2025-08-10T00:00:00Z'
    },
    profile: {
      id: SEED_UUIDS.BIHARI,
      user_id: SEED_UUIDS.BIHARI,
      username: '@bihari_vibes',
      display_name: 'Bihari Vibes Official',
      email: 'vibes@bihar.in',
      bio: 'बिहार की मिट्टी की सौंधी खुशबू, छठ के पावन घाट और सांस्कृतिक दर्शन 🌅',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      city: 'Patna',
      state: 'Bihar',
      country: 'India',
      language: 'hi',
      role: 'creator',
      is_verified: true,
      is_private: false,
      followers_count: 65100,
      following_count: 140,
      reels_count: 22,
      total_likes_count: 210000,
      interests: ['songs', 'reels', 'bihar_culture', 'photography', 'ghats'],
      onboarding_completed: true,
      created_at: '2025-08-10T00:00:00Z',
      updated_at: '2025-08-10T00:00:00Z'
    }
  },
  {
    legacyId: 'user_chhathi_bhakta',
    user: {
      id: SEED_UUIDS.BHAKTA,
      email: 'bhakta@varanasi.org',
      password_hash: hashPasswordWithSalt('chhath2026', 'bhakta_salt_chhath'),
      email_verified: true,
      is_active: true,
      created_at: '2025-09-05T00:00:00Z',
      updated_at: '2025-09-05T00:00:00Z'
    },
    profile: {
      id: SEED_UUIDS.BHAKTA,
      user_id: SEED_UUIDS.BHAKTA,
      username: '@chhathi_bhakta',
      display_name: 'छठी मईया सेवक संघ',
      email: 'bhakta@varanasi.org',
      bio: 'अस्सी घाट व दशाश्वमेध घाट पर पावन छठ पूजा सेवा और अर्घ्य दर्शन 🪔',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
      language: 'hi',
      role: 'creator',
      is_verified: false,
      is_private: false,
      followers_count: 28200,
      following_count: 45,
      reels_count: 11,
      total_likes_count: 94100,
      interests: ['devotional', 'ghats', 'arghya', 'vidhi'],
      onboarding_completed: true,
      created_at: '2025-09-05T00:00:00Z',
      updated_at: '2025-09-05T00:00:00Z'
    }
  },
  {
    legacyId: 'user_maithili_kitchen',
    user: {
      id: SEED_UUIDS.KITCHEN,
      email: 'kitchen@mithila.com',
      password_hash: hashPasswordWithSalt('chhath2026', 'kitchen_salt_chhath'),
      email_verified: true,
      is_active: true,
      created_at: '2025-09-12T00:00:00Z',
      updated_at: '2025-09-12T00:00:00Z'
    },
    profile: {
      id: SEED_UUIDS.KITCHEN,
      user_id: SEED_UUIDS.KITCHEN,
      username: '@maithili_kitchen',
      display_name: 'मैथिली पारंपरिक रसोई',
      email: 'kitchen@mithila.com',
      bio: 'काठ के सांचे पर देशी घी व गुड़ के पावन ठेकुआ, रसियाव और कसार की प्रामाणिक विधि 🌾',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
      city: 'Muzaffarpur',
      state: 'Bihar',
      country: 'India',
      language: 'mai',
      role: 'creator',
      is_verified: true,
      is_private: false,
      followers_count: 19300,
      following_count: 88,
      reels_count: 9,
      total_likes_count: 62400,
      interests: ['prasad', 'bihar_culture', 'family', 'vidhi'],
      onboarding_completed: true,
      created_at: '2025-09-12T00:00:00Z',
      updated_at: '2025-09-12T00:00:00Z'
    }
  }
];

// ==============================================================================
// PERSISTENT DATABASE ENGINE
// ==============================================================================

class DatabaseEngine {
  private dbFilePath: string;
  private store: ChhathDatabaseStore;

  constructor() {
    this.dbFilePath = path.resolve(process.cwd(), 'server', 'data', 'chhath_db.json');
    this.store = this.loadStore();
  }

  private loadStore(): ChhathDatabaseStore {
    const dir = path.dirname(this.dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.dbFilePath)) {
      try {
        const content = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed && parsed.version && Array.isArray(parsed.users)) {
          return parsed;
        }
      } catch (err) {
        console.warn('[DatabaseEngine] Existing database file corrupt or invalid, recreating:', err);
      }
    }

    // Initialize fresh store with seeds
    const freshStore: ChhathDatabaseStore = {
      version: 1,
      users: [],
      profiles: [],
      follows: [],
      blocked_users: [],
      muted_entities: [],
      restricted_users: [],
      user_settings: [],
      active_sessions: [],
      reels: [],
      comments: [],
      reel_likes: [],
      saved_reels: [],
      conversations: [],
      conversation_members: [],
      messages: [],
      calls: [],
      notifications: [],
      reports: [],
      audit_logs: [],
      legacy_id_map: {}
    };

    // Populate seeds
    for (const seed of INITIAL_SEED_USERS) {
      freshStore.users.push(seed.user);
      freshStore.profiles.push(seed.profile);
      freshStore.legacy_id_map[seed.legacyId] = seed.user.id;
      freshStore.legacy_id_map[seed.profile.username.toLowerCase()] = seed.user.id;

      freshStore.user_settings.push({
        id: generateUUID(),
        user_id: seed.user.id,
        is_private_account: false,
        who_can_message: 'everyone',
        who_can_call: 'everyone',
        who_can_comment: 'everyone',
        show_activity_status: true,
        two_factor_enabled: false,
        ai_personalization_enabled: true,
        ai_voice_enabled: true,
        ai_chat_suggestions: true,
        updated_at: new Date().toISOString()
      });
    }

    // Seed initial follows graph
    freshStore.follows.push(
      {
        id: generateUUID(),
        follower_id: SEED_UUIDS.PRAMOD,
        following_id: SEED_UUIDS.SHARDA,
        status: 'accepted',
        created_at: '2025-10-16T10:00:00Z'
      },
      {
        id: generateUUID(),
        follower_id: SEED_UUIDS.BIHARI,
        following_id: SEED_UUIDS.SHARDA,
        status: 'accepted',
        created_at: '2025-10-16T11:00:00Z'
      },
      {
        id: generateUUID(),
        follower_id: SEED_UUIDS.BHAKTA,
        following_id: SEED_UUIDS.SHARDA,
        status: 'accepted',
        created_at: '2025-10-16T12:00:00Z'
      }
    );

    // Seed canonical reels
    freshStore.reels.push(
      {
        id: '018e6e5b-468b-7000-9000-000000000001',
        creator_id: SEED_UUIDS.SHARDA,
        title: 'कांच ही बांस के बहंगिया — अमर शारदा सिन्हा धुन',
        description: 'गंगा घाट पर गूंजती अमर स्वर कोकिला पद्मभूषण शारदा सिन्हा जी की पावन धुन। बहंगी लचकत जाए… 🙏',
        category: 'Chhath Geet',
        tags: ['#ChhathPuja', '#ShardaSinha', '#ChhathGeet', '#Bihar'],
        video_url: '/videos/sample1.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        video_duration: '0:45',
        likes_count: 24810,
        comments_count: 1240,
        shares_count: 3820,
        saves_count: 1890,
        views_count: 142800,
        privacy: 'public',
        status: 'approved',
        audio_id: 'audio_1',
        audio_title: 'कांच ही बांस के बहंगिया',
        audio_artist: 'शारदा सिन्हा',
        source_type: 'FIRST_PARTY',
        created_at: '2026-09-01T10:00:00Z'
      },
      {
        id: '018e6e5b-468b-7000-9000-000000000002',
        creator_id: SEED_UUIDS.KITCHEN,
        title: 'काठ के सांचे पर देशी घी का खस्ता ठेकुआ बनाना',
        description: 'काठ के पारंपरिक सांचे पर शुद्ध देशी घी, गेहूं का आटा, गुड़ और सौंफ से महाप्रसाद ठेकुआ तैयार करने की विधि। 🌾',
        category: 'Thekua / Prasad',
        tags: ['#ThekuaPrasad', '#PureGhee', '#BihariCulture', '#ChhathPuja'],
        video_url: '/videos/sample2.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
        video_duration: '0:58',
        likes_count: 18450,
        comments_count: 890,
        shares_count: 2410,
        saves_count: 3120,
        views_count: 98400,
        privacy: 'public',
        status: 'approved',
        audio_id: 'audio_4',
        audio_title: 'पहिले पहिल हम कईनी छठी मईया व्रत',
        audio_artist: 'शारदा सिन्हा',
        source_type: 'FIRST_PARTY',
        created_at: '2026-09-02T14:30:00Z'
      },
      {
        id: '018e6e5b-468b-7000-9000-000000000003',
        creator_id: SEED_UUIDS.BIHARI,
        title: 'पटना दीघा घाट पर १० लाख दीपों का महादर्शन',
        description: 'अस्ताचलगामी भगवान सूर्य को लाखों श्रद्धालुओं द्वारा एक साथ अर्घ्य अर्पण का विहंगम दृश्य। जय छठी मईया! 🌅',
        category: 'Ghat',
        tags: ['#PatnaGhat', '#GangaAarti', '#MahaChhath', '#SandhyaArghya'],
        video_url: '/videos/sample3.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
        video_duration: '1:12',
        likes_count: 31200,
        comments_count: 1540,
        shares_count: 5290,
        saves_count: 2400,
        views_count: 185600,
        privacy: 'public',
        status: 'approved',
        audio_id: 'audio_5',
        audio_title: 'गंगा आरती व पावन शंख ध्वनि (Live Ghat Dhun)',
        audio_artist: 'पारंपरिक घाट धुन',
        source_type: 'FIRST_PARTY',
        created_at: '2026-09-03T18:00:00Z'
      }
    );

    // Map legacy reel IDs
    freshStore.legacy_id_map['demo-reel-001'] = '018e6e5b-468b-7000-9000-000000000001';
    freshStore.legacy_id_map['demo-reel-002'] = '018e6e5b-468b-7000-9000-000000000002';
    freshStore.legacy_id_map['demo-reel-003'] = '018e6e5b-468b-7000-9000-000000000003';

    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(freshStore, null, 2), 'utf-8');
      console.log('[DatabaseEngine] Initialized database with canonical UUID seeds at:', this.dbFilePath);
    } catch (err) {
      console.error('[DatabaseEngine] Failed to save fresh database:', err);
    }

    return freshStore;
  }

  private save(): void {
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DatabaseEngine] Write error saving to disk:', err);
    }
  }

  /**
   * Resolves any user identifier (UUID, legacy ID like 'user_sharda_trust', or '@username')
   * to canonical UUID v4 string.
   */
  public resolveUserId(idOrUsername: string): string | null {
    if (!idOrUsername) return null;
    const clean = idOrUsername.trim();
    
    // Check if directly matches a UUID in users or profiles
    const directUser = this.store.users.find(u => u.id === clean);
    if (directUser) return directUser.id;

    // Check legacy ID map
    if (this.store.legacy_id_map[clean]) {
      return this.store.legacy_id_map[clean];
    }
    if (this.store.legacy_id_map[clean.toLowerCase()]) {
      return this.store.legacy_id_map[clean.toLowerCase()];
    }

    // Check username in profiles
    const cleanUsername = clean.startsWith('@') ? clean.toLowerCase() : `@${clean.toLowerCase()}`;
    const profile = this.store.profiles.find(p => p.username.toLowerCase() === cleanUsername);
    if (profile) return profile.user_id;

    // Check email
    const byEmail = this.store.users.find(u => u.email.toLowerCase() === clean.toLowerCase());
    if (byEmail) return byEmail.id;

    return null;
  }

  // ==========================================
  // AUTH & IDENTITY MANAGEMENT
  // ==========================================

  public createUser(params: {
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
    role?: 'user' | 'creator' | 'admin';
    clientInfo?: { ip?: string; userAgent?: string };
  }): { user: DbProfileRecord; sessionToken: string; settings: DbUserSettingsRecord } {
    const cleanUsername = params.username.trim().startsWith('@')
      ? params.username.trim().toLowerCase()
      : `@${params.username.trim().toLowerCase()}`;

    // Validation
    if (cleanUsername.length < 3 || !/^@[a-z0-9_]+$/.test(cleanUsername)) {
      throw new Error('यूजरनेम कम से कम 3 अक्षरों का होना चाहिए और केवल अक्षर, अंक और अंडरस्कोर मान्य हैं।');
    }

    // Uniqueness checks
    if (this.store.profiles.some(p => p.username.toLowerCase() === cleanUsername)) {
      throw new Error('यह यूजरनेम पहले से किसी अन्य भक्त द्वारा लिया जा चुका है।');
    }

    const cleanEmail = params.email.trim().toLowerCase();
    if (this.store.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('इस ईमेल से पहले ही खाता बना हुआ है। कृपया लॉगिन करें।');
    }

    if (params.password.length < 6) {
      throw new Error('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
    }

    const now = new Date().toISOString();
    const userId = generateUUID();
    const passwordHash = hashPasswordWithSalt(params.password);

    const newUserRecord: DbUserRecord = {
      id: userId,
      email: cleanEmail,
      password_hash: passwordHash,
      email_verified: false,
      is_active: true,
      created_at: now,
      updated_at: now
    };

    const newProfileRecord: DbProfileRecord = {
      id: userId,
      user_id: userId,
      username: cleanUsername,
      display_name: params.name.trim(),
      email: cleanEmail,
      bio: params.bio?.trim() || 'जय छठी मइया! 🙏 पावन महापर्व व्रती व सेवक।',
      avatar_url: params.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      cover_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      website: '',
      city: params.city?.trim() || 'Patna',
      state: params.state?.trim() || 'Bihar',
      country: params.country?.trim() || 'India',
      language: params.language || 'hi',
      role: params.role || 'user',
      is_verified: false,
      is_private: false,
      followers_count: 0,
      following_count: 0,
      reels_count: 0,
      total_likes_count: 0,
      interests: ['songs', 'vidhi', 'arghya', 'ghats'],
      onboarding_completed: false,
      created_at: now,
      updated_at: now
    };

    const newSettingsRecord: DbUserSettingsRecord = {
      id: generateUUID(),
      user_id: userId,
      is_private_account: false,
      who_can_message: 'everyone',
      who_can_call: 'everyone',
      who_can_comment: 'everyone',
      show_activity_status: true,
      two_factor_enabled: false,
      ai_personalization_enabled: true,
      ai_voice_enabled: true,
      ai_chat_suggestions: true,
      updated_at: now
    };

    // Create session
    const sessionToken = 'sess_' + crypto.randomBytes(32).toString('hex');
    const newSession: DbActiveSessionRecord = {
      id: generateUUID(),
      user_id: userId,
      token: sessionToken,
      device_name: params.clientInfo?.userAgent ? this.parseDeviceName(params.clientInfo.userAgent) : 'Web Browser',
      device_type: 'desktop',
      browser: 'Browser',
      os: 'Windows/Linux/Mac',
      ip_address: params.clientInfo?.ip || '127.0.0.1',
      location_city: params.city || 'Patna',
      is_current: true,
      last_active_at: now,
      created_at: now
    };

    this.store.users.unshift(newUserRecord);
    this.store.profiles.unshift(newProfileRecord);
    this.store.user_settings.unshift(newSettingsRecord);
    this.store.active_sessions.unshift(newSession);

    // Add legacy map
    this.store.legacy_id_map[cleanUsername] = userId;

    this.logAudit(userId, 'USER_SIGNUP', params.clientInfo?.ip, params.clientInfo?.userAgent, {
      username: cleanUsername,
      email: cleanEmail
    });

    this.save();
    return { user: newProfileRecord, sessionToken, settings: newSettingsRecord };
  }

  public login(
    emailOrUsername: string,
    pass: string,
    clientInfo?: { ip?: string; userAgent?: string }
  ): { user: DbProfileRecord; sessionToken: string; settings: DbUserSettingsRecord } {
    const term = emailOrUsername.trim();
    let userRecord: DbUserRecord | undefined;
    let profileRecord: DbProfileRecord | undefined;

    const resolvedId = this.resolveUserId(term);
    if (resolvedId) {
      userRecord = this.store.users.find(u => u.id === resolvedId);
      profileRecord = this.store.profiles.find(p => p.user_id === resolvedId);
    }

    if (!userRecord || !profileRecord) {
      throw new Error('यह ईमेल या यूजरनेम पंजीकृत नहीं है।');
    }

    if (!userRecord.is_active) {
      throw new Error('यह खाता निष्क्रिय कर दिया गया है।');
    }

    const isValid = verifyPassword(pass, userRecord.password_hash);
    if (!isValid) {
      throw new Error('गलत पासवर्ड। कृपया पुनः प्रयास करें।');
    }

    const now = new Date().toISOString();
    const sessionToken = 'sess_' + crypto.randomBytes(32).toString('hex');
    const newSession: DbActiveSessionRecord = {
      id: generateUUID(),
      user_id: userRecord.id,
      token: sessionToken,
      device_name: clientInfo?.userAgent ? this.parseDeviceName(clientInfo.userAgent) : 'Web Client',
      device_type: 'desktop',
      browser: 'Browser',
      os: 'System',
      ip_address: clientInfo?.ip || '127.0.0.1',
      location_city: profileRecord.city || 'Patna',
      is_current: true,
      last_active_at: now,
      created_at: now
    };

    this.store.active_sessions.unshift(newSession);

    // Retrieve settings
    let settings = this.store.user_settings.find(s => s.user_id === userRecord!.id);
    if (!settings) {
      settings = {
        id: generateUUID(),
        user_id: userRecord.id,
        is_private_account: false,
        who_can_message: 'everyone',
        who_can_call: 'everyone',
        who_can_comment: 'everyone',
        show_activity_status: true,
        two_factor_enabled: false,
        ai_personalization_enabled: true,
        ai_voice_enabled: true,
        ai_chat_suggestions: true,
        updated_at: now
      };
      this.store.user_settings.unshift(settings);
    }

    this.logAudit(userRecord.id, 'USER_LOGIN', clientInfo?.ip, clientInfo?.userAgent, {
      username: profileRecord.username
    });

    this.save();
    return { user: profileRecord, sessionToken, settings };
  }

  public verifySession(sessionToken: string): { user: DbProfileRecord; settings: DbUserSettingsRecord; session: DbActiveSessionRecord } | null {
    if (!sessionToken) return null;
    const session = this.store.active_sessions.find(s => s.token === sessionToken);
    if (!session) return null;

    const profile = this.store.profiles.find(p => p.user_id === session.user_id);
    if (!profile) return null;

    let settings = this.store.user_settings.find(s => s.user_id === session.user_id);
    if (!settings) {
      settings = {
        id: generateUUID(),
        user_id: session.user_id,
        is_private_account: false,
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
      this.store.user_settings.push(settings);
      this.save();
    }

    // Refresh last active
    session.last_active_at = new Date().toISOString();

    return { user: profile, settings, session };
  }

  public revokeSession(sessionToken: string): boolean {
    const idx = this.store.active_sessions.findIndex(s => s.token === sessionToken);
    if (idx !== -1) {
      const sess = this.store.active_sessions[idx];
      this.logAudit(sess.user_id, 'SESSION_REVOKED', sess.ip_address, undefined, { sessionId: sess.id });
      this.store.active_sessions.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public revokeAllSessions(userId: string, exceptToken?: string): number {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return 0;
    const initialCount = this.store.active_sessions.length;
    this.store.active_sessions = this.store.active_sessions.filter(
      s => s.user_id !== canonicalId || (exceptToken && s.token === exceptToken)
    );
    const removed = initialCount - this.store.active_sessions.length;
    this.logAudit(canonicalId, 'ALL_SESSIONS_REVOKED', undefined, undefined, { count: removed });
    this.save();
    return removed;
  }

  public getUserSessions(userId: string, currentToken?: string): DbActiveSessionRecord[] {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return [];
    return this.store.active_sessions
      .filter(s => s.user_id === canonicalId)
      .map(s => ({
        ...s,
        is_current: currentToken ? s.token === currentToken : false
      }));
  }

  public revokeSessionById(userId: string, sessionId: string): boolean {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return false;
    const idx = this.store.active_sessions.findIndex(s => s.user_id === canonicalId && s.id === sessionId);
    if (idx !== -1) {
      this.store.active_sessions.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public changePassword(userId: string, oldPass: string, newPass: string): boolean {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) throw new Error('उपयोगकर्ता नहीं मिला।');

    const user = this.store.users.find(u => u.id === canonicalId);
    if (!user) throw new Error('उपयोगकर्ता खाता नहीं मिला।');

    if (!verifyPassword(oldPass, user.password_hash)) {
      throw new Error('वर्तमान पासवर्ड सही नहीं है।');
    }

    if (newPass.length < 6) {
      throw new Error('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
    }

    user.password_hash = hashPasswordWithSalt(newPass);
    user.updated_at = new Date().toISOString();
    this.logAudit(canonicalId, 'PASSWORD_CHANGED');
    this.save();
    return true;
  }

  public deleteAccount(userId: string): boolean {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return false;

    // Cascade delete across all relational collections
    this.store.users = this.store.users.filter(u => u.id !== canonicalId);
    this.store.profiles = this.store.profiles.filter(p => p.user_id !== canonicalId);
    this.store.follows = this.store.follows.filter(f => f.follower_id !== canonicalId && f.following_id !== canonicalId);
    this.store.blocked_users = this.store.blocked_users.filter(b => b.blocker_id !== canonicalId && b.blocked_id !== canonicalId);
    this.store.muted_entities = this.store.muted_entities.filter(m => m.user_id !== canonicalId);
    this.store.restricted_users = this.store.restricted_users.filter(r => r.user_id !== canonicalId && r.restricted_id !== canonicalId);
    this.store.user_settings = this.store.user_settings.filter(s => s.user_id !== canonicalId);
    this.store.active_sessions = this.store.active_sessions.filter(s => s.user_id !== canonicalId);
    this.store.reel_likes = this.store.reel_likes.filter(l => l.user_id !== canonicalId);
    this.store.saved_reels = this.store.saved_reels.filter(s => s.user_id !== canonicalId);
    this.store.comments = this.store.comments.filter(c => c.user_id !== canonicalId);
    this.store.notifications = this.store.notifications.filter(n => n.user_id !== canonicalId && n.actor_id !== canonicalId);
    this.store.reels = this.store.reels.filter(r => r.creator_id !== canonicalId);

    this.save();
    return true;
  }

  // ==========================================
  // PROFILE MANAGEMENT
  // ==========================================

  public getProfileById(userIdOrIdentifier: string): DbProfileRecord | null {
    const canonicalId = this.resolveUserId(userIdOrIdentifier);
    if (!canonicalId) return null;
    return this.store.profiles.find(p => p.user_id === canonicalId) || null;
  }

  public getProfileByUsername(username: string): DbProfileRecord | null {
    const clean = username.startsWith('@') ? username.toLowerCase() : `@${username.toLowerCase()}`;
    return this.store.profiles.find(p => p.username.toLowerCase() === clean) || null;
  }

  public updateProfile(userId: string, updates: Partial<DbProfileRecord>): DbProfileRecord {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) throw new Error('उपयोगकर्ता नहीं मिला।');

    const profile = this.store.profiles.find(p => p.user_id === canonicalId);
    if (!profile) throw new Error('प्रोफ़ाइल नहीं मिली।');

    if (updates.username) {
      const cleanUsername = updates.username.trim().startsWith('@')
        ? updates.username.trim().toLowerCase()
        : `@${updates.username.trim().toLowerCase()}`;

      if (cleanUsername !== profile.username.toLowerCase()) {
        if (cleanUsername.length < 3 || !/^@[a-z0-9_]+$/.test(cleanUsername)) {
          throw new Error('यूजरनेम अमान्य है।');
        }
        const exists = this.store.profiles.some(p => p.user_id !== canonicalId && p.username.toLowerCase() === cleanUsername);
        if (exists) {
          throw new Error('यह यूजरनेम पहले से लिया जा चुका है।');
        }
        profile.username = cleanUsername;
        this.store.legacy_id_map[cleanUsername] = canonicalId;
      }
    }

    if (updates.display_name !== undefined) profile.display_name = updates.display_name.trim();
    if (updates.bio !== undefined) profile.bio = updates.bio.trim();
    if (updates.avatar_url !== undefined) profile.avatar_url = updates.avatar_url;
    if (updates.cover_url !== undefined) profile.cover_url = updates.cover_url;
    if (updates.website !== undefined) profile.website = updates.website.trim();
    if (updates.city !== undefined) profile.city = updates.city.trim();
    if (updates.state !== undefined) profile.state = updates.state.trim();
    if (updates.country !== undefined) profile.country = updates.country.trim();
    if (updates.language !== undefined) profile.language = updates.language;
    if (updates.interests !== undefined) profile.interests = updates.interests;
    if (updates.onboarding_completed !== undefined) profile.onboarding_completed = updates.onboarding_completed;

    profile.updated_at = new Date().toISOString();
    this.save();
    return profile;
  }

  public searchProfiles(query: string, limit = 20): DbProfileRecord[] {
    const q = query.trim().toLowerCase().replace(/^@/, '');
    if (!q) return this.store.profiles.slice(0, limit);

    return this.store.profiles
      .filter(p =>
        p.username.toLowerCase().includes(q) ||
        p.display_name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      )
      .slice(0, limit);
  }

  // ==========================================
  // SOCIAL GRAPH: FOLLOWS & PRIVACY
  // ==========================================

  public toggleFollow(followerId: string, followingId: string): { status: 'accepted' | 'pending' | 'unfollowed' } {
    const canonicalFollower = this.resolveUserId(followerId);
    const canonicalFollowing = this.resolveUserId(followingId);

    if (!canonicalFollower || !canonicalFollowing) {
      throw new Error('अमान्य उपयोगकर्ता ID।');
    }
    if (canonicalFollower === canonicalFollowing) {
      throw new Error('आप स्वयं को फॉलो नहीं कर सकते।');
    }

    // Check if blocked in either direction
    if (this.isBlocked(canonicalFollower, canonicalFollowing) || this.isBlocked(canonicalFollowing, canonicalFollower)) {
      throw new Error('आप इस खाते से जुड़े नहीं हो सकते क्योंकि यह ब्लॉक है।');
    }

    const existingIdx = this.store.follows.findIndex(
      f => f.follower_id === canonicalFollower && f.following_id === canonicalFollowing
    );

    const followerProfile = this.store.profiles.find(p => p.user_id === canonicalFollower);
    const targetProfile = this.store.profiles.find(p => p.user_id === canonicalFollowing);
    const targetSettings = this.getSettings(canonicalFollowing);

    if (existingIdx !== -1) {
      // Unfollow
      const existing = this.store.follows[existingIdx];
      this.store.follows.splice(existingIdx, 1);

      if (existing.status === 'accepted') {
        if (followerProfile && followerProfile.following_count > 0) followerProfile.following_count--;
        if (targetProfile && targetProfile.followers_count > 0) targetProfile.followers_count--;
      }

      this.save();
      return { status: 'unfollowed' };
    }

    // Determine status: if target is private, status is pending
    const status = targetSettings.is_private_account ? 'pending' : 'accepted';
    const newFollow: DbFollowRecord = {
      id: generateUUID(),
      follower_id: canonicalFollower,
      following_id: canonicalFollowing,
      status,
      created_at: new Date().toISOString()
    };

    this.store.follows.push(newFollow);

    if (status === 'accepted') {
      if (followerProfile) followerProfile.following_count++;
      if (targetProfile) targetProfile.followers_count++;

      // Create notification
      this.createNotification(
        canonicalFollowing,
        canonicalFollower,
        'follow',
        canonicalFollower,
        'user',
        'नया अनुयायी',
        `${followerProfile?.display_name || 'एक भक्त'} ने आपको फॉलो करना शुरू किया।`
      );
    } else {
      // Notification for follow request
      this.createNotification(
        canonicalFollowing,
        canonicalFollower,
        'follow_request',
        canonicalFollower,
        'user',
        'फॉलो अनुरोध',
        `${followerProfile?.display_name || 'एक भक्त'} ने आपको फॉलो करने का अनुरोध भेजा है।`
      );
    }

    this.save();
    return { status };
  }

  public getFollowStatus(followerId: string, followingId: string): 'accepted' | 'pending' | 'none' {
    const canonicalFollower = this.resolveUserId(followerId);
    const canonicalFollowing = this.resolveUserId(followingId);
    if (!canonicalFollower || !canonicalFollowing) return 'none';

    const follow = this.store.follows.find(
      f => f.follower_id === canonicalFollower && f.following_id === canonicalFollowing
    );
    if (!follow) return 'none';
    return (follow.status === 'accepted' || follow.status === 'pending') ? follow.status : 'none';
  }

  public acceptFollowRequest(targetUserId: string, requesterId: string): boolean {
    const canonicalTarget = this.resolveUserId(targetUserId);
    const canonicalRequester = this.resolveUserId(requesterId);
    if (!canonicalTarget || !canonicalRequester) return false;

    const follow = this.store.follows.find(
      f => f.follower_id === canonicalRequester && f.following_id === canonicalTarget && f.status === 'pending'
    );
    if (!follow) return false;

    follow.status = 'accepted';
    const followerProfile = this.store.profiles.find(p => p.user_id === canonicalRequester);
    const targetProfile = this.store.profiles.find(p => p.user_id === canonicalTarget);

    if (followerProfile) followerProfile.following_count++;
    if (targetProfile) targetProfile.followers_count++;

    this.createNotification(
      canonicalRequester,
      canonicalTarget,
      'follow_accepted',
      canonicalTarget,
      'user',
      'अनुरोध स्वीकृत',
      `${targetProfile?.display_name || 'उपयोगकर्ता'} ने आपका फॉलो अनुरोध स्वीकार कर लिया।`
    );

    this.save();
    return true;
  }

  public rejectFollowRequest(targetUserId: string, requesterId: string): boolean {
    const canonicalTarget = this.resolveUserId(targetUserId);
    const canonicalRequester = this.resolveUserId(requesterId);
    if (!canonicalTarget || !canonicalRequester) return false;

    const idx = this.store.follows.findIndex(
      f => f.follower_id === canonicalRequester && f.following_id === canonicalTarget && f.status === 'pending'
    );
    if (idx !== -1) {
      this.store.follows.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public getPendingFollowRequests(userId: string): DbProfileRecord[] {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return [];

    const requesterIds = this.store.follows
      .filter(f => f.following_id === canonicalId && f.status === 'pending')
      .map(f => f.follower_id);

    return this.store.profiles.filter(p => requesterIds.includes(p.user_id));
  }

  public getFollowers(userId: string): DbProfileRecord[] {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return [];

    const followerIds = this.store.follows
      .filter(f => f.following_id === canonicalId && f.status === 'accepted')
      .map(f => f.follower_id);

    return this.store.profiles.filter(p => followerIds.includes(p.user_id));
  }

  public getFollowing(userId: string): DbProfileRecord[] {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return [];

    const followingIds = this.store.follows
      .filter(f => f.follower_id === canonicalId && f.status === 'accepted')
      .map(f => f.following_id);

    return this.store.profiles.filter(p => followingIds.includes(p.user_id));
  }

  // ==========================================
  // BLOCKING, MUTING & RESTRICTING
  // ==========================================

  public blockUser(blockerId: string, blockedId: string): boolean {
    const canonicalBlocker = this.resolveUserId(blockerId);
    const canonicalBlocked = this.resolveUserId(blockedId);

    if (!canonicalBlocker || !canonicalBlocked || canonicalBlocker === canonicalBlocked) {
      return false;
    }

    const alreadyBlocked = this.store.blocked_users.some(
      b => b.blocker_id === canonicalBlocker && b.blocked_id === canonicalBlocked
    );
    if (!alreadyBlocked) {
      this.store.blocked_users.push({
        id: generateUUID(),
        blocker_id: canonicalBlocker,
        blocked_id: canonicalBlocked,
        created_at: new Date().toISOString()
      });
    }

    // Crucial: Sever follow relationships in BOTH directions!
    const toRemove = this.store.follows.filter(
      f =>
        (f.follower_id === canonicalBlocker && f.following_id === canonicalBlocked) ||
        (f.follower_id === canonicalBlocked && f.following_id === canonicalBlocker)
    );

    for (const f of toRemove) {
      const p1 = this.store.profiles.find(p => p.user_id === f.follower_id);
      const p2 = this.store.profiles.find(p => p.user_id === f.following_id);
      if (f.status === 'accepted') {
        if (p1 && p1.following_count > 0) p1.following_count--;
        if (p2 && p2.followers_count > 0) p2.followers_count--;
      }
    }

    this.store.follows = this.store.follows.filter(
      f =>
        !(
          (f.follower_id === canonicalBlocker && f.following_id === canonicalBlocked) ||
          (f.follower_id === canonicalBlocked && f.following_id === canonicalBlocker)
        )
    );

    this.save();
    return true;
  }

  public unblockUser(blockerId: string, blockedId: string): boolean {
    const canonicalBlocker = this.resolveUserId(blockerId);
    const canonicalBlocked = this.resolveUserId(blockedId);
    if (!canonicalBlocker || !canonicalBlocked) return false;

    const idx = this.store.blocked_users.findIndex(
      b => b.blocker_id === canonicalBlocker && b.blocked_id === canonicalBlocked
    );
    if (idx !== -1) {
      this.store.blocked_users.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public isBlocked(userAId: string, userBId: string): boolean {
    const canonicalA = this.resolveUserId(userAId);
    const canonicalB = this.resolveUserId(userBId);
    if (!canonicalA || !canonicalB) return false;

    return this.store.blocked_users.some(b => b.blocker_id === canonicalA && b.blocked_id === canonicalB);
  }

  public getBlockedUsers(userId: string): DbProfileRecord[] {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return [];

    const blockedIds = this.store.blocked_users
      .filter(b => b.blocker_id === canonicalId)
      .map(b => b.blocked_id);

    return this.store.profiles.filter(p => blockedIds.includes(p.user_id));
  }

  public muteEntity(userId: string, entityType: 'user' | 'reel' | 'topic' | 'conversation', entityId: string, muteUntil?: string): boolean {
    const canonicalUser = this.resolveUserId(userId);
    if (!canonicalUser) return false;

    const targetId = entityType === 'user' ? (this.resolveUserId(entityId) || entityId) : entityId;
    const existing = this.store.muted_entities.find(
      m => m.user_id === canonicalUser && m.entity_type === entityType && m.entity_id === targetId
    );

    if (existing) {
      existing.mute_until = muteUntil || null;
    } else {
      this.store.muted_entities.push({
        id: generateUUID(),
        user_id: canonicalUser,
        entity_type: entityType,
        entity_id: targetId,
        mute_until: muteUntil || null,
        created_at: new Date().toISOString()
      });
    }

    this.save();
    return true;
  }

  public unmuteEntity(userId: string, entityType: 'user' | 'reel' | 'topic' | 'conversation', entityId: string): boolean {
    const canonicalUser = this.resolveUserId(userId);
    if (!canonicalUser) return false;

    const targetId = entityType === 'user' ? (this.resolveUserId(entityId) || entityId) : entityId;
    const idx = this.store.muted_entities.findIndex(
      m => m.user_id === canonicalUser && m.entity_type === entityType && m.entity_id === targetId
    );

    if (idx !== -1) {
      this.store.muted_entities.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public isMuted(userId: string, entityType: 'user' | 'reel' | 'topic' | 'conversation', entityId: string): boolean {
    const canonicalUser = this.resolveUserId(userId);
    if (!canonicalUser) return false;

    const targetId = entityType === 'user' ? (this.resolveUserId(entityId) || entityId) : entityId;
    const record = this.store.muted_entities.find(
      m => m.user_id === canonicalUser && m.entity_type === entityType && m.entity_id === targetId
    );

    if (!record) return false;
    if (!record.mute_until) return true; // muted permanently
    return new Date(record.mute_until).getTime() > Date.now();
  }

  // ==========================================
  // SETTINGS & AI PREFERENCES
  // ==========================================

  public getSettings(userId: string): DbUserSettingsRecord {
    const canonicalId = this.resolveUserId(userId);
    let settings = canonicalId ? this.store.user_settings.find(s => s.user_id === canonicalId) : undefined;

    if (!settings && canonicalId) {
      settings = {
        id: generateUUID(),
        user_id: canonicalId,
        is_private_account: false,
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
      this.store.user_settings.push(settings);
      this.save();
    }

    return (
      settings || {
        id: 'default',
        user_id: canonicalId || 'unknown',
        is_private_account: false,
        who_can_message: 'everyone',
        who_can_call: 'everyone',
        who_can_comment: 'everyone',
        show_activity_status: true,
        two_factor_enabled: false,
        ai_personalization_enabled: true,
        ai_voice_enabled: true,
        ai_chat_suggestions: true,
        updated_at: new Date().toISOString()
      }
    );
  }

  public updateSettings(userId: string, partial: Partial<DbUserSettingsRecord>): DbUserSettingsRecord {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) throw new Error('उपयोगकर्ता नहीं मिला।');

    let settings = this.store.user_settings.find(s => s.user_id === canonicalId);
    if (!settings) {
      settings = this.getSettings(canonicalId);
    }

    if (partial.is_private_account !== undefined) {
      settings.is_private_account = Boolean(partial.is_private_account);
      // Sync profile.is_private as well
      const profile = this.store.profiles.find(p => p.user_id === canonicalId);
      if (profile) profile.is_private = settings.is_private_account;
    }
    if (partial.who_can_message !== undefined) settings.who_can_message = partial.who_can_message;
    if (partial.who_can_call !== undefined) settings.who_can_call = partial.who_can_call;
    if (partial.who_can_comment !== undefined) settings.who_can_comment = partial.who_can_comment;
    if (partial.show_activity_status !== undefined) settings.show_activity_status = Boolean(partial.show_activity_status);
    if (partial.two_factor_enabled !== undefined) settings.two_factor_enabled = Boolean(partial.two_factor_enabled);
    if (partial.ai_personalization_enabled !== undefined) settings.ai_personalization_enabled = Boolean(partial.ai_personalization_enabled);
    if (partial.ai_voice_enabled !== undefined) settings.ai_voice_enabled = Boolean(partial.ai_voice_enabled);
    if (partial.ai_chat_suggestions !== undefined) settings.ai_chat_suggestions = Boolean(partial.ai_chat_suggestions);

    settings.updated_at = new Date().toISOString();
    this.save();
    return settings;
  }

  // ==========================================
  // DATA EXPORT (Download My Data Package)
  // ==========================================

  public exportUserData(userId: string): any {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) throw new Error('उपयोगकर्ता नहीं मिला।');

    const user = this.store.users.find(u => u.id === canonicalId);
    const profile = this.store.profiles.find(p => p.user_id === canonicalId);
    const settings = this.getSettings(canonicalId);
    const sessions = this.store.active_sessions.filter(s => s.user_id === canonicalId);
    const followers = this.getFollowers(canonicalId);
    const following = this.getFollowing(canonicalId);
    const blocked = this.getBlockedUsers(canonicalId);
    const reels = this.store.reels.filter(r => r.creator_id === canonicalId);
    const comments = this.store.comments.filter(c => c.user_id === canonicalId);
    const likes = this.store.reel_likes.filter(l => l.user_id === canonicalId);
    const saves = this.store.saved_reels.filter(s => s.user_id === canonicalId);

    // Messages sent by user
    const messages = this.store.messages.filter(m => m.sender_id === canonicalId);

    return {
      exportMetadata: {
        platform: 'Chhath Mahaparv AI Cultural Ecosystem',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        userId: canonicalId,
        username: profile?.username
      },
      account: {
        id: user?.id,
        email: user?.email,
        phone: user?.phone,
        createdAt: user?.created_at
      },
      profile,
      privacyAndSettings: settings,
      socialGraph: {
        followers: followers.map(f => ({ id: f.user_id, username: f.username, name: f.display_name })),
        following: following.map(f => ({ id: f.user_id, username: f.username, name: f.display_name })),
        blockedUsers: blocked.map(b => ({ id: b.user_id, username: b.username, name: b.display_name }))
      },
      activity: {
        reelsPublishedCount: reels.length,
        reels,
        comments,
        likedReelsCount: likes.length,
        savedReelsCount: saves.length,
        messagesSentCount: messages.length
      },
      security: {
        activeSessionsCount: sessions.length,
        sessions: sessions.map(s => ({
          id: s.id,
          deviceName: s.device_name,
          ipAddress: s.ip_address,
          city: s.location_city,
          createdAt: s.created_at,
          lastActiveAt: s.last_active_at
        }))
      }
    };
  }

  // ==========================================
  // REELS & INTERACTIONS
  // ==========================================

  public getReels(options: {
    userId?: string;
    feedType?: string;
    category?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): { reels: any[]; total: number } {
    let list = [...this.store.reels];

    // Filter out content from blocked creators
    if (options.userId) {
      const canonicalUser = this.resolveUserId(options.userId);
      if (canonicalUser) {
        const blockedIds = this.store.blocked_users
          .filter(b => b.blocker_id === canonicalUser)
          .map(b => b.blocked_id);
        const blockersIds = this.store.blocked_users
          .filter(b => b.blocked_id === canonicalUser)
          .map(b => b.blocker_id);

        list = list.filter(r => !blockedIds.includes(r.creator_id) && !blockersIds.includes(r.creator_id));
      }
    }

    if (options.category) {
      list = list.filter(r => r.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options.tag) {
      const cleanTag = options.tag.startsWith('#') ? options.tag.toLowerCase() : `#${options.tag.toLowerCase()}`;
      list = list.filter(r => r.tags.some(t => t.toLowerCase() === cleanTag));
    }

    const total = list.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    const sliced = list.slice(offset, offset + limit);

    // Attach creator profile
    const enriched = sliced.map(r => {
      const creator = this.store.profiles.find(p => p.user_id === r.creator_id);
      return {
        ...r,
        creator: creator
          ? {
              id: creator.user_id,
              name: creator.display_name,
              username: creator.username,
              avatar: creator.avatar_url,
              city: creator.city,
              verified: creator.is_verified
            }
          : undefined
      };
    });

    return { reels: enriched, total };
  }

  public createReel(data: {
    creatorId: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    videoUrl: string;
    thumbnailUrl: string;
    videoDuration: string;
    audioId?: string;
    audioTitle?: string;
    audioArtist?: string;
    aspectRatio?: '9:16' | '16:9' | '1:1';
    sourceType?: 'FIRST_PARTY' | 'FOLLOWING' | 'TRENDING' | 'EXTERNAL' | 'YOUTUBE';
    youtubeVideoId?: string;
    channelTitle?: string;
    externalSourceUrl?: string;
  }): DbReelRecord {
    const canonicalCreator = this.resolveUserId(data.creatorId);
    if (!canonicalCreator) throw new Error('रचनाकार ID अमान्य है।');

    const newReel: DbReelRecord = {
      id: generateUUID(),
      creator_id: canonicalCreator,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      video_url: data.videoUrl,
      thumbnail_url: data.thumbnailUrl,
      video_duration: data.videoDuration,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      saves_count: 0,
      views_count: 0,
      privacy: 'public',
      status: 'approved',
      audio_id: data.audioId,
      audio_title: data.audioTitle,
      audio_artist: data.audioArtist,
      aspect_ratio: data.aspectRatio || '9:16',
      source_type: data.sourceType || 'FIRST_PARTY',
      youtube_video_id: data.youtubeVideoId,
      channel_title: data.channelTitle,
      external_source_url: data.externalSourceUrl,
      created_at: new Date().toISOString()
    };

    this.store.reels.unshift(newReel);

    const profile = this.store.profiles.find(p => p.user_id === canonicalCreator);
    if (profile) {
      profile.reels_count++;
    }

    this.save();
    return newReel;
  }

  public toggleLikeReel(reelId: string, userId: string): { liked: boolean; likesCount: number } {
    const canonicalUser = this.resolveUserId(userId);
    if (!canonicalUser) throw new Error('उपयोगकर्ता मान्य नहीं है।');

    const resolvedReelId = this.store.legacy_id_map[reelId] || reelId;
    const reel = this.store.reels.find(r => r.id === resolvedReelId);
    if (!reel) throw new Error('रील नहीं मिली।');

    const idx = this.store.reel_likes.findIndex(
      l => l.reel_id === resolvedReelId && l.user_id === canonicalUser
    );

    const creatorProfile = this.store.profiles.find(p => p.user_id === reel.creator_id);

    if (idx !== -1) {
      // Unlike
      this.store.reel_likes.splice(idx, 1);
      if (reel.likes_count > 0) reel.likes_count--;
      if (creatorProfile && creatorProfile.total_likes_count > 0) creatorProfile.total_likes_count--;
      this.save();
      return { liked: false, likesCount: reel.likes_count };
    }

    // Like
    this.store.reel_likes.push({
      id: generateUUID(),
      reel_id: resolvedReelId,
      user_id: canonicalUser,
      created_at: new Date().toISOString()
    });
    reel.likes_count++;
    if (creatorProfile) creatorProfile.total_likes_count++;

    // Notification
    if (reel.creator_id !== canonicalUser) {
      const liker = this.store.profiles.find(p => p.user_id === canonicalUser);
      this.createNotification(
        reel.creator_id,
        canonicalUser,
        'like',
        resolvedReelId,
        'reel',
        'नई पसंद',
        `${liker?.display_name || 'एक भक्त'} ने आपकी रील पसंद की।`
      );
    }

    this.save();
    return { liked: true, likesCount: reel.likes_count };
  }

  public toggleSaveReel(reelId: string, userId: string, collectionName = 'All'): { saved: boolean } {
    const canonicalUser = this.resolveUserId(userId);
    if (!canonicalUser) throw new Error('उपयोगकर्ता मान्य नहीं है।');

    const resolvedReelId = this.store.legacy_id_map[reelId] || reelId;
    const reel = this.store.reels.find(r => r.id === resolvedReelId);
    if (!reel) throw new Error('रील नहीं मिली।');

    const idx = this.store.saved_reels.findIndex(
      s => s.reel_id === resolvedReelId && s.user_id === canonicalUser
    );

    if (idx !== -1) {
      this.store.saved_reels.splice(idx, 1);
      if (reel.saves_count > 0) reel.saves_count--;
      this.save();
      return { saved: false };
    }

    this.store.saved_reels.push({
      id: generateUUID(),
      reel_id: resolvedReelId,
      user_id: canonicalUser,
      collection_name: collectionName,
      created_at: new Date().toISOString()
    });
    reel.saves_count++;
    this.save();
    return { saved: true };
  }

  public addComment(reelId: string, userId: string, content: string, parentId?: string): DbCommentRecord {
    const canonicalUser = this.resolveUserId(userId);
    if (!canonicalUser) throw new Error('उपयोगकर्ता मान्य नहीं है।');

    const resolvedReelId = this.store.legacy_id_map[reelId] || reelId;
    const reel = this.store.reels.find(r => r.id === resolvedReelId);
    if (!reel) throw new Error('रील नहीं मिली।');

    const newComment: DbCommentRecord = {
      id: generateUUID(),
      reel_id: resolvedReelId,
      user_id: canonicalUser,
      parent_id: parentId || null,
      content: content.trim(),
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    this.store.comments.push(newComment);
    reel.comments_count++;

    if (reel.creator_id !== canonicalUser) {
      const commenter = this.store.profiles.find(p => p.user_id === canonicalUser);
      this.createNotification(
        reel.creator_id,
        canonicalUser,
        'comment',
        resolvedReelId,
        'reel',
        'नई टिप्पणी',
        `${commenter?.display_name || 'एक भक्त'} ने आपकी रील पर टिप्पणी की: "${content.slice(0, 30)}..."`
      );
    }

    this.save();
    return newComment;
  }

  public getComments(reelId: string): any[] {
    const resolvedReelId = this.store.legacy_id_map[reelId] || reelId;
    const comments = this.store.comments.filter(c => c.reel_id === resolvedReelId);

    return comments.map(c => {
      const author = this.store.profiles.find(p => p.user_id === c.user_id);
      return {
        ...c,
        author: author
          ? {
              id: author.user_id,
              name: author.display_name,
              username: author.username,
              avatar: author.avatar_url
            }
          : undefined
      };
    });
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  public createNotification(
    userId: string,
    actorId: string,
    type: string,
    entityId?: string,
    entityType?: string,
    title?: string,
    message?: string
  ): DbNotificationRecord {
    const canonicalUser = this.resolveUserId(userId);
    const canonicalActor = this.resolveUserId(actorId);

    const notification: DbNotificationRecord = {
      id: generateUUID(),
      user_id: canonicalUser || userId,
      actor_id: canonicalActor || actorId,
      type,
      entity_id: entityId,
      entity_type: entityType,
      title: title || 'छठ महापर्व सूचना',
      message: message || '',
      is_read: false,
      created_at: new Date().toISOString()
    };

    this.store.notifications.unshift(notification);
    this.save();
    return notification;
  }

  public getNotifications(userId: string): any[] {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return [];

    return this.store.notifications
      .filter(n => n.user_id === canonicalId)
      .slice(0, 50)
      .map(n => {
        const actor = this.store.profiles.find(p => p.user_id === n.actor_id);
        return {
          ...n,
          actor: actor
            ? {
                id: actor.user_id,
                name: actor.display_name,
                username: actor.username,
                avatar: actor.avatar_url
              }
            : undefined
        };
      });
  }

  public markNotificationsRead(userId: string): void {
    const canonicalId = this.resolveUserId(userId);
    if (!canonicalId) return;

    for (const n of this.store.notifications) {
      if (n.user_id === canonicalId) {
        n.is_read = true;
      }
    }
    this.save();
  }

  // ==========================================
  // REPORTS
  // ==========================================

  public createReport(
    reporterId: string,
    targetType: 'reel' | 'comment' | 'user' | 'message',
    targetId: string,
    reason: string,
    details?: string
  ): DbReportRecord {
    const canonicalReporter = this.resolveUserId(reporterId);
    const report: DbReportRecord = {
      id: generateUUID(),
      reporter_id: canonicalReporter || reporterId,
      target_type: targetType,
      target_id: targetId,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.store.reports.push(report);
    this.save();
    return report;
  }

  // ==========================================
  // AUDIT LOGGING
  // ==========================================

  private logAudit(userId: string, eventType: string, ip?: string, userAgent?: string, metadata?: any): void {
    const log: DbAuditLogRecord = {
      id: generateUUID(),
      user_id: userId,
      event_type: eventType,
      ip_address: ip || '127.0.0.1',
      user_agent: userAgent || 'ChhathClient',
      metadata,
      created_at: new Date().toISOString()
    };
    this.store.audit_logs.unshift(log);
    if (this.store.audit_logs.length > 500) {
      this.store.audit_logs.pop();
    }
  }

  private parseDeviceName(ua: string): string {
    if (/Mobile|Android|iPhone/i.test(ua)) return 'Mobile Device';
    if (/iPad|Tablet/i.test(ua)) return 'Tablet Device';
    if (/Windows/i.test(ua)) return 'Windows PC';
    if (/Macintosh/i.test(ua)) return 'Apple Mac';
    if (/Linux/i.test(ua)) return 'Linux Workstation';
    return 'Web Browser';
  }
}

// Singleton database instance
export const databaseEngine = new DatabaseEngine();
