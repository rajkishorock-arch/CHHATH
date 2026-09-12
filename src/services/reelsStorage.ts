import { 
  DynamicReel, 
  ReelUser, 
  ReelComment, 
  ReelDraft, 
  ReelReport, 
  ReelNotification, 
  ReelAudioTrack, 
  ReelCategory,
  ContentSourceType,
  UserContentImpression,
  NotInterestedSignal
} from '../types';
import { CachedYouTubeVideo } from './feed/types';

// ==========================================
// 1. INDEXED-DB SERVICE (Large Video Blobs)
// ==========================================
const DB_NAME = 'chhath_reels_idb';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeMediaBlob(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to store media blob:', err);
  }
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to get media blob:', err);
    return null;
  }
}

export async function deleteMediaBlob(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to delete media blob:', err);
  }
}

// Active Object URL registry for clean memory management
const activeObjectUrls: Map<string, string> = new Map();

export async function getMediaBlobUrl(key: string): Promise<string | null> {
  if (activeObjectUrls.has(key)) {
    return activeObjectUrls.get(key)!;
  }
  const blob = await getMediaBlob(key);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  activeObjectUrls.set(key, url);
  return url;
}

// ==========================================
// 2. CRYPTOGRAPHIC PASSWORD HASHING (Web Crypto)
// ==========================================
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = 'chhath_mahaparv_sacred_salt_2026';
  const data = encoder.encode(password + salt);
  if (window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for non-subtle environments
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// ==========================================
// 3. STORAGE KEYS & SEED DATA
// ==========================================
const KEYS = {
  USERS: 'chhath_reels_users',
  REELS: 'chhath_reels_list',
  COMMENTS: 'chhath_reels_comments',
  LIKES: 'chhath_reels_likes',
  SAVES: 'chhath_reels_saves',
  FOLLOWS: 'chhath_reels_follows',
  VIEWS: 'chhath_reels_views',
  DRAFTS: 'chhath_reels_drafts',
  REPORTS: 'chhath_reels_reports',
  NOTIFICATIONS: 'chhath_reels_notifications',
  BLOCKED: 'chhath_reels_blocked',
  AUDIO: 'chhath_reels_audio',
  SESSION: 'chhath_reels_current_user_session',
  AUTO_PUBLISH: 'chhath_reels_auto_publish_enabled',
  NOT_INTERESTED: 'chhath_reels_not_interested',
  IMPRESSIONS: 'chhath_reels_impressions',
  EXTERNAL_CATALOG: 'chhath_reels_external_catalog',
  SEARCH_HISTORY: 'chhath_reels_search_history',
  YOUTUBE_CACHE: 'chhath_reels_youtube_cache',
  BLOCKED_VIDEOS: 'chhath_reels_blocked_videos'
};

export const SEED_USERS: ReelUser[] = [
  {
    id: '018e6e5b-468b-7000-8000-000000000001',
    user_id: '018e6e5b-468b-7000-8000-000000000001',
    name: 'शारदा सिन्हा संगीत न्यास',
    username: '@sharda_trust',
    email: 'sharda@chhathmahaparv.org',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    bio: 'पद्मभूषण शारदा सिन्हा जी के अमर छठ गीतों का आधिकारिक सांस्कृतिक संकलन। 🙏',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    language: 'bho',
    role: 'creator',
    followersCount: 48500,
    followingCount: 12,
    totalLikesCount: 185200,
    reelsCount: 8,
    verified: true,
    interests: ['songs', 'devotional', 'katha', 'bihar_culture'],
    onboardingCompleted: true,
    createdAt: '2025-10-01'
  },
  {
    id: '018e6e5b-468b-7000-8000-000000000002',
    user_id: '018e6e5b-468b-7000-8000-000000000002',
    name: 'प्रमोद कुमार झा',
    username: '@pramodchhath',
    email: 'pramod@darbhanga.org',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    bio: 'छठी मईया की कृपा बनी रहे 🙏 पारंपरिक सूप-दउरा और अर्घ्य की शुद्ध संस्कृति।',
    city: 'Darbhanga',
    state: 'Bihar',
    country: 'India',
    language: 'mai',
    role: 'creator',
    followersCount: 12400,
    followingCount: 320,
    totalLikesCount: 45600,
    reelsCount: 14,
    verified: true,
    interests: ['vidhi', 'arghya', 'ghats', 'prasad', 'family'],
    onboardingCompleted: true,
    createdAt: '2025-10-15'
  },
  {
    id: '018e6e5b-468b-7000-8000-000000000003',
    user_id: '018e6e5b-468b-7000-8000-000000000003',
    name: 'Bihari Vibes Official',
    username: '@bihari_vibes',
    email: 'vibes@bihar.in',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    bio: 'बिहार की मिट्टी की सौंधी खुशबू, छठ के पावन घाट और सांस्कृतिक दर्शन 🌅',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    language: 'hi',
    role: 'creator',
    followersCount: 65100,
    followingCount: 140,
    totalLikesCount: 210000,
    reelsCount: 22,
    verified: true,
    interests: ['songs', 'reels', 'bihar_culture', 'photography', 'ghats'],
    onboardingCompleted: true,
    createdAt: '2025-08-10'
  },
  {
    id: '018e6e5b-468b-7000-8000-000000000004',
    user_id: '018e6e5b-468b-7000-8000-000000000004',
    name: 'छठी मईया सेवक संघ',
    username: '@chhathi_bhakta',
    email: 'bhakta@varanasi.org',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    bio: 'अस्सी घाट व दशाश्वमेध घाट पर पावन छठ पूजा सेवा और अर्घ्य दर्शन 🪔',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    language: 'hi',
    role: 'creator',
    followersCount: 28200,
    followingCount: 45,
    totalLikesCount: 94100,
    reelsCount: 11,
    verified: false,
    interests: ['devotional', 'ghats', 'arghya', 'vidhi'],
    onboardingCompleted: true,
    createdAt: '2025-09-05'
  },
  {
    id: '018e6e5b-468b-7000-8000-000000000005',
    user_id: '018e6e5b-468b-7000-8000-000000000005',
    name: 'मैथिली पारंपरिक रसोई',
    username: '@maithili_kitchen',
    email: 'kitchen@mithila.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    bio: 'काठ के सांचे पर देशी घी व गुड़ के पावन ठेकुआ, रसियाव और कसार की प्रामाणिक विधि 🌾',
    city: 'Muzaffarpur',
    state: 'Bihar',
    country: 'India',
    language: 'mai',
    role: 'creator',
    followersCount: 19300,
    followingCount: 88,
    totalLikesCount: 62400,
    reelsCount: 9,
    verified: true,
    interests: ['prasad', 'bihar_culture', 'family', 'vidhi'],
    onboardingCompleted: true,
    createdAt: '2025-09-12'
  },
  {
    id: '018e6e5b-468b-7000-8000-000000000000',
    user_id: '018e6e5b-468b-7000-8000-000000000000',
    name: 'छठ महापर्व एडमिनिस्ट्रेटर',
    username: '@admin_chhath',
    email: 'admin@chhathmahaparv.org',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    bio: 'छठ महापर्व आधिकारिक मॉडरेशन व सांस्कृतिक सुरक्षा मंच। 🛡️',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    language: 'hi',
    role: 'admin',
    followersCount: 99000,
    followingCount: 5,
    totalLikesCount: 500000,
    reelsCount: 5,
    verified: true,
    interests: ['songs', 'vidhi', 'arghya', 'ghats', 'prasad', 'family'],
    onboardingCompleted: true,
    createdAt: '2025-01-01'
  }
];

export const SEED_AUDIO_TRACKS: ReelAudioTrack[] = [
  {
    id: 'audio_1',
    title: 'कांच ही बांस के बहंगिया',
    artist: 'शारदा सिन्हा',
    duration: '0:58',
    coverUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-spirit-meditation-146.mp3',
    reelsCount: 1420
  },
  {
    id: 'audio_2',
    title: 'उग हे सुरुज देव अरघ के बेरा',
    artist: 'अनुराधा पौडवाल',
    duration: '0:45',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-sacred-temple-bell-and-chimes-123.mp3',
    reelsCount: 980
  },
  {
    id: 'audio_3',
    title: 'केलवा के पात पर उगेलन सुरुज देव',
    artist: 'शारदा सिन्हा',
    duration: '0:52',
    coverUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=200&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-meditation-flute-and-bells-571.mp3',
    reelsCount: 2310
  },
  {
    id: 'audio_4',
    title: 'पहिले पहिल हम कईनी छठी मईया व्रत',
    artist: 'शारदा सिन्हा',
    duration: '1:05',
    coverUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
    reelsCount: 3100
  },
  {
    id: 'audio_5',
    title: 'गंगा आरती व पावन शंख ध्वनि (Live Ghat Dhun)',
    artist: 'पारंपरिक घाट धुन',
    duration: '0:40',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-temple-sanctuary-ambient-564.mp3',
    reelsCount: 840
  }
];

export const SEED_REELS: DynamicReel[] = [
  {
    id: 'demo-reel-001',
    creatorId: 'user_sharda_trust',
    creatorName: 'शारदा सिन्हा संगीत न्यास',
    creatorUsername: '@sharda_trust',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'कांच ही बांस के बहंगिया — अमर शारदा सिन्हा धुन',
    description: 'गंगा घाट पर गूंजती अमर स्वर कोकिला पद्मभूषण शारदा सिन्हा जी की पावन धुन। बहंगी लचकत जाए… 🙏',
    category: 'Chhath Geet',
    tags: ['#ChhathPuja', '#ShardaSinha', '#ChhathGeet', '#Bihar'],
    videoUrl: '/videos/sample1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    videoDuration: '0:45',
    likesCount: 24810,
    commentsCount: 1240,
    sharesCount: 3820,
    savesCount: 1890,
    viewsCount: 142800,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_1',
    audioTitle: 'कांच ही बांस के बहंगिया',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-01T10:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-002',
    creatorId: 'user_maithili_kitchen',
    creatorName: 'मैथिली पारंपरिक रसोई',
    creatorUsername: '@maithili_kitchen',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    creatorCity: 'Muzaffarpur',
    title: 'काठ के सांचे पर देशी घी का खस्ता ठेकुआ बनाना',
    description: 'काठ के पारंपरिक सांचे पर शुद्ध देशी घी, गेहूं का आटा, गुड़ और सौंफ से महाप्रसाद ठेकुआ तैयार करने की विधि। 🌾',
    category: 'Thekua / Prasad',
    tags: ['#ThekuaPrasad', '#PureGhee', '#BihariCulture', '#ChhathPuja'],
    videoUrl: '/videos/sample2.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
    videoDuration: '0:58',
    likesCount: 18450,
    commentsCount: 890,
    sharesCount: 2410,
    savesCount: 3120,
    viewsCount: 98400,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_4',
    audioTitle: 'पहिले पहिल हम कईनी छठी मईया व्रत',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-02T14:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-003',
    creatorId: 'user_bihari_vibes',
    creatorName: 'Bihari Vibes Official',
    creatorUsername: '@bihari_vibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Patna',
    title: 'पटना दीघा घाट पर १० लाख दीपों का महादर्शन',
    description: 'अस्ताचलगामी भगवान सूर्य को लाखों श्रद्धालुओं द्वारा एक साथ अर्घ्य अर्पण का विहंगम दृश्य। जय छठी मईया! 🌅',
    category: 'Ghat',
    tags: ['#PatnaGhat', '#GangaAarti', '#MahaChhath', '#SandhyaArghya'],
    videoUrl: '/videos/sample3.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    videoDuration: '1:12',
    likesCount: 31200,
    commentsCount: 1540,
    sharesCount: 5290,
    savesCount: 2400,
    viewsCount: 185600,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_5',
    audioTitle: 'गंगा आरती व पावन शंख ध्वनि (Live Ghat Dhun)',
    audioArtist: 'पारंपरिक घाट धुन',
    createdAt: '2026-09-03T18:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-004',
    creatorId: 'user_pramod_chhath',
    creatorName: 'प्रमोद कुमार झा',
    creatorUsername: '@pramodchhath',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Darbhanga',
    title: 'बांस का दउरा व पीतल सूप सजाने का सही वैदिक विधान',
    description: 'फल, ईख, नारियल, सिन्दूर, सुथनी और बोड़ा से सूप सजाने की विधि। सात्विक शुद्धता का विशेष ध्यान रखें। 🙏',
    category: 'Puja Preparation',
    tags: ['#PujaSamagri', '#DauraSoop', '#ChhathVidhi', '#Darbhanga'],
    videoUrl: '/videos/sample4.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
    videoDuration: '0:52',
    likesCount: 14230,
    commentsCount: 620,
    sharesCount: 1840,
    savesCount: 1450,
    viewsCount: 78900,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_3',
    audioTitle: 'केलवा के पात पर उगेलन सुरुज देव',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-04T08:15:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-005',
    creatorId: 'user_chhathi_bhakta',
    creatorName: 'छठी मईया सेवक संघ',
    creatorUsername: '@chhathi_bhakta',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'अस्ताचलगामी सूर्य को संध्या अर्घ्य समर्पण दृश्य',
    description: 'गंगा की पावन लहरों में खड़े होकर सूर्य देव और छठी मैया को पहला अर्घ्य समर्पित करते व्रतीजन। 🪔',
    category: 'Sandhya Arghya',
    tags: ['#SandhyaArghya', '#VaranasiGhat', '#ChhathiMaiya', '#ChhathPuja'],
    videoUrl: '/videos/sample5.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
    videoDuration: '0:48',
    likesCount: 22100,
    commentsCount: 970,
    sharesCount: 3100,
    savesCount: 1680,
    viewsCount: 112000,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_2',
    audioTitle: 'उग हे सुरुज देव अरघ के बेरा',
    audioArtist: 'अनुराधा पौडवाल',
    createdAt: '2026-09-05T17:45:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-006',
    creatorId: 'user_pramod_chhath',
    creatorName: 'प्रमोद कुमार झा',
    creatorUsername: '@pramodchhath',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Darbhanga',
    title: 'उषा अर्घ्य पर पावन सूर्य नमस्कार व पारण दर्शन',
    description: 'चौथे दिन उगते सूर्य को दूध और गंगाजल का अर्घ्य देकर 36 घंटे के निर्जला व्रत का पावन पारण। जय भास्कर देव! 🌅',
    category: 'Usha Arghya',
    tags: ['#UshaArghya', '#SunriseDevotion', '#Chhath2026', '#ChhathiMaiya'],
    videoUrl: '/videos/sample6.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
    videoDuration: '0:50',
    likesCount: 29800,
    commentsCount: 1380,
    sharesCount: 4120,
    savesCount: 2190,
    viewsCount: 164000,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_3',
    audioTitle: 'केलवा के पात पर उगेलन सुरुज देव',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-06T06:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-007',
    creatorId: 'user_maithili_kitchen',
    creatorName: 'मैथिली पारंपरिक रसोई',
    creatorUsername: '@maithili_kitchen',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    creatorCity: 'Muzaffarpur',
    title: 'खरना के दिन गुड़ की खीर व सात्विक रोटी का पावन प्रसाद',
    description: 'दूसरे दिन खरना की पावन शाम को मिट्टी के चूल्हे और आम की लकड़ी पर गुड़ की खीर व घी लगी रोटी तैयार करते हुए। 🪔',
    category: 'Puja Preparation',
    tags: ['#KharnaPrasad', '#GurKiKheer', '#PavitraRoti', '#ChhathPuja'],
    videoUrl: '/videos/sample7.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
    videoDuration: '0:55',
    likesCount: 21300,
    commentsCount: 940,
    sharesCount: 2800,
    savesCount: 2510,
    viewsCount: 104500,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_4',
    audioTitle: 'पहिले पहिल हम कईनी छठी मईया व्रत',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-07T18:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-008',
    creatorId: 'user_bihari_vibes',
    creatorName: 'Bihari Vibes Official',
    creatorUsername: '@bihari_vibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Patna',
    title: 'नहाय-खाय: कद्दू-भात और अरवा चावल से पावन पर्व की शुरुआत',
    description: 'चार दिवसीय आस्था के महापर्व का पहला दिन नहाय-खाय। गंगा स्नान के बाद शुद्ध घी में बना सेंधा नमक का कद्दू-भात। 🌾',
    category: 'Puja Preparation',
    tags: ['#NahayKhay', '#KadduBhat', '#ChhathPurity', '#BiharFestival'],
    videoUrl: '/videos/sample8.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
    videoDuration: '1:05',
    likesCount: 19800,
    commentsCount: 820,
    sharesCount: 2310,
    savesCount: 1980,
    viewsCount: 92400,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_1',
    audioTitle: 'कांच ही बांस के बहंगिया',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-08T11:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-009',
    creatorId: 'user_chhathi_bhakta',
    creatorName: 'छठी मईया सेवक संघ',
    creatorUsername: '@chhathi_bhakta',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'गंगा घाट पर शंख ध्वनि व दीप प्रज्वलन का विहंगम दृश्य',
    description: 'दशाश्वमेध व अस्सी घाट पर शंखों की दिव्य गूंज और हर घाट पर जलते लाखों दीप। छठी मईया सबका कल्याण करें। 🙏',
    category: 'Ghat',
    tags: ['#GhatDarshan', '#ShankhDhun', '#GangaGhat', '#Divinity'],
    videoUrl: '/videos/sample1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
    videoDuration: '0:42',
    likesCount: 35600,
    commentsCount: 1820,
    sharesCount: 6100,
    savesCount: 3200,
    viewsCount: 210000,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_5',
    audioTitle: 'गंगा आरती व पावन शंख ध्वनि (Live Ghat Dhun)',
    audioArtist: 'पारंपरिक घाट धुन',
    createdAt: '2026-09-08T19:15:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-010',
    creatorId: 'user_sharda_trust',
    creatorName: 'शारदा सिन्हा संगीत न्यास',
    creatorUsername: '@sharda_trust',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'सुरुज देव के अरघिया — पारंपरिक मैथिली सोहर व वंदना',
    description: 'हे दीनानाथ! अपनी कृपा की शीतल छाया हर श्रद्धालु पर बनाए रखें। पारंपरिक लोक गीतों का पावन संकलन। 🌅',
    category: 'Chhath Geet',
    tags: ['#SuroojDev', '#MaithiliSohar', '#ParamparikBhakti', '#Chhath2026'],
    videoUrl: '/videos/sample2.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
    videoDuration: '0:50',
    likesCount: 27400,
    commentsCount: 1190,
    sharesCount: 3950,
    savesCount: 2310,
    viewsCount: 153000,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_2',
    audioTitle: 'उग हे सुरुज देव अरघ के बेरा',
    audioArtist: 'अनुराधा पौडवाल',
    createdAt: '2026-09-09T07:20:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-011',
    creatorId: 'user_pramod_chhath',
    creatorName: 'प्रमोद कुमार झा',
    creatorUsername: '@pramodchhath',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Darbhanga',
    title: 'कोसी नदी तट पर सूप लेकर खड़े व्रतियों का पावन दर्शन',
    description: 'कमर तक शीतल जल में खड़े होकर सूर्य देव की प्रतीक्षा करते तपस्वी व्रती। ऐसी निष्ठा और तपस्या अद्वितीय है। 🪔',
    category: 'Sandhya Arghya',
    tags: ['#KosiRiver', '#NirjalaVrat', '#ArghyaDarshan', '#Mithilanchal'],
    videoUrl: '/videos/sample3.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    videoDuration: '0:49',
    likesCount: 23900,
    commentsCount: 1050,
    sharesCount: 3420,
    savesCount: 1780,
    viewsCount: 128900,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_3',
    audioTitle: 'केलवा के पात पर उगेलन सुरुज देव',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-09T17:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'demo-reel-012',
    creatorId: 'user_bihari_vibes',
    creatorName: 'Bihari Vibes Official',
    creatorUsername: '@bihari_vibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Patna',
    title: 'परदेस से घर वापसी — छठ पर परिवार का अलौकिक मिलन',
    description: 'दुनिया के किसी भी कोने में हों, छठ पर हर बिहारी का मन अपने गांव और मां के हाथों के ठेकुआ के पास लौट आता है। ❤️',
    category: 'Family',
    tags: ['#GharAajaChhath', '#FamilyReunion', '#BihariPride', '#ChhathEmotion'],
    videoUrl: '/videos/sample4.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80',
    videoDuration: '1:10',
    likesCount: 42100,
    commentsCount: 2450,
    sharesCount: 8900,
    savesCount: 5120,
    viewsCount: 265000,
    privacy: 'public',
    status: 'approved',
    sourceType: 'FIRST_PARTY',
    audioId: 'audio_1',
    audioTitle: 'कांच ही बांस के बहंगिया',
    audioArtist: 'शारदा सिन्हा',
    createdAt: '2026-09-10T12:00:00Z',
    aspectRatio: '9:16'
  }
];

// ==================================================================
// 4. APPROVED CULTURAL & EMBEDDABLE YOUTUBE CONTENT CATALOG (FALLBACK)
// ==================================================================
export const EXTERNAL_CHHATH_SEED_CATALOG: DynamicReel[] = [
  {
    id: 'ext-yt-1',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'T-Series Bhakti Sagar',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'हो दीनानाथ — शारदा सिन्हा (Ho Deenanath)',
    description: 'पद्मभूषण शारदा सिन्हा जी का कालजयी छठ गीत। सुरुज देव के अरघिया। Source: YouTube.',
    category: 'Chhath Geet',
    tags: ['#ChhathGeet', '#ShardaSinha', '#Bhojpuri', '#ChhathiMaiya'],
    videoUrl: 'https://www.youtube.com/watch?v=fOVGz9WFymU',
    youtubeVideoId: 'fOVGz9WFymU',
    channelTitle: 'T-Series Bhakti Sagar',
    externalSourceUrl: 'https://www.youtube.com/watch?v=fOVGz9WFymU',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/fOVGz9WFymU/hqdefault.jpg',
    videoDuration: '6:12',
    likesCount: 154000,
    commentsCount: 3200,
    sharesCount: 18400,
    savesCount: 12500,
    viewsCount: 4520000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-15T12:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-2',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'T-Series Bhakti Sagar',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'कार्तिक मास इजोरिया — शारदा सिन्हा (Kartik Maas Ijoriya)',
    description: 'छठ पूजा पावन पारंपरिक गीत। शारदा सिन्हा की अमृत वाणी। Source: YouTube.',
    category: 'Chhath Geet',
    tags: ['#KartikMaas', '#ShardaSinha', '#ChhathPuja', '#ParamparikGeet'],
    videoUrl: 'https://www.youtube.com/watch?v=UwqtDSb0pLI',
    youtubeVideoId: 'UwqtDSb0pLI',
    channelTitle: 'T-Series Bhakti Sagar',
    externalSourceUrl: 'https://www.youtube.com/watch?v=UwqtDSb0pLI',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/UwqtDSb0pLI/hqdefault.jpg',
    videoDuration: '5:40',
    likesCount: 98000,
    commentsCount: 2100,
    sharesCount: 12400,
    savesCount: 9100,
    viewsCount: 3100000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-18T14:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-3',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'T-Series Bhakti Sagar',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'छठी मईया पावन स्पेशल — शारदा सिन्हा (Chhathi Maiya)',
    description: 'छठ व्रतियों का सबसे प्रिय भजन। हे छठी मईया तोहार महिमा अपार। Source: YouTube.',
    category: 'Devotional',
    tags: ['#ChhathiMaiya', '#ShardaSinha', '#Bhakti', '#ChhathGeet'],
    videoUrl: 'https://www.youtube.com/watch?v=BsAFCc901MM',
    youtubeVideoId: 'BsAFCc901MM',
    channelTitle: 'T-Series Bhakti Sagar',
    externalSourceUrl: 'https://www.youtube.com/watch?v=BsAFCc901MM',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/BsAFCc901MM/hqdefault.jpg',
    videoDuration: '8:25',
    likesCount: 187000,
    commentsCount: 4100,
    sharesCount: 22000,
    savesCount: 16000,
    viewsCount: 5800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-20T09:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-4',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'T-Series Bhakti Sagar',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'अरघ के बेर — अनुराधा पौडवाल (Aragh Ke Ber)',
    description: 'अनुराधा पौडवाल जी का पावन संध्या अर्घ्य भजन। अस्ताचलगामी सूर्य देव को नमन। Source: YouTube.',
    category: 'Sandhya Arghya',
    tags: ['#AraghKeBer', '#AnuradhaPaudwal', '#SandhyaArghya', '#SuryaPooja'],
    videoUrl: 'https://www.youtube.com/watch?v=fqlh99htTJA',
    youtubeVideoId: 'fqlh99htTJA',
    channelTitle: 'T-Series Bhakti Sagar',
    externalSourceUrl: 'https://www.youtube.com/watch?v=fqlh99htTJA',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/fqlh99htTJA/hqdefault.jpg',
    videoDuration: '6:18',
    likesCount: 84000,
    commentsCount: 1700,
    sharesCount: 8900,
    savesCount: 7200,
    viewsCount: 2450000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-22T16:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-5',
    creatorId: 'ext_tseries_bhojpuri',
    creatorName: 'T-Series Hamaar Bhojpuri',
    creatorUsername: '@hamaar_bhojpuri',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Arrah',
    title: 'जोड़े जोड़े फलवा सुरुज देव — पवन सिंह छठ स्पेशल',
    description: 'पवन सिंह का लोकप्रिय छठ गीत। जोड़े जोड़े फलवा सुरुज देव घटवा पs पहुँचे। Source: YouTube.',
    category: 'Sandhya Arghya',
    tags: ['#PawanSingh', '#JodeJodeFalwa', '#BhojpuriChhath', '#Arghya'],
    videoUrl: 'https://www.youtube.com/watch?v=BKoD7bTLc2k',
    youtubeVideoId: 'BKoD7bTLc2k',
    channelTitle: 'T-Series Hamaar Bhojpuri',
    externalSourceUrl: 'https://www.youtube.com/watch?v=BKoD7bTLc2k',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/BKoD7bTLc2k/hqdefault.jpg',
    videoDuration: '4:45',
    likesCount: 142000,
    commentsCount: 2900,
    sharesCount: 16500,
    savesCount: 11000,
    viewsCount: 4200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-25T11:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-6',
    creatorId: 'ext_maithili_thakur',
    creatorName: 'Maithili Thakur Official',
    creatorUsername: '@maithili_thakur',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Madhubani',
    title: 'सोना सातकुनिया हो दीनानाथ — मैथिली ठाकुर',
    description: 'मैथिली ठाकुर द्वारा प्रस्तुत पारंपरिक छठ गीत। मिथिला के पावन सुर। Source: YouTube.',
    category: 'Chhath Geet',
    tags: ['#MaithiliThakur', '#Dinanath', '#MaithiliChhath', '#Mithila'],
    videoUrl: 'https://www.youtube.com/watch?v=fwX2g9jjo1o',
    youtubeVideoId: 'fwX2g9jjo1o',
    channelTitle: 'Maithili Thakur',
    externalSourceUrl: 'https://www.youtube.com/watch?v=fwX2g9jjo1o',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'mai',
    thumbnailUrl: 'https://i.ytimg.com/vi/fwX2g9jjo1o/hqdefault.jpg',
    videoDuration: '5:10',
    likesCount: 118000,
    commentsCount: 2600,
    sharesCount: 15100,
    savesCount: 10400,
    viewsCount: 3600000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-28T15:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-7',
    creatorId: 'ext_kabita_kitchen',
    creatorName: 'Kabita\'s Kitchen',
    creatorUsername: '@kabitaskitchen',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    creatorCity: 'Patna',
    title: 'छठ पूजा के लिए शुद्ध खस्ता ठेकुआ बनाने की प्रामाणिक विधि',
    description: 'गेंहू के आटे, शुद्ध घी और गुड़ से पारंपरिक काठ के सांचे पर खस्ता ठेकुआ रेसिपी। Source: YouTube.',
    category: 'Thekua / Prasad',
    tags: ['#ThekuaRecipe', '#ChhathPrasad', '#KabitasKitchen', '#KhastaThekua'],
    videoUrl: 'https://www.youtube.com/watch?v=UWLG52DwUPE',
    youtubeVideoId: 'UWLG52DwUPE',
    channelTitle: 'Kabita\'s Kitchen',
    externalSourceUrl: 'https://www.youtube.com/watch?v=UWLG52DwUPE',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/UWLG52DwUPE/hqdefault.jpg',
    videoDuration: '6:50',
    likesCount: 95000,
    commentsCount: 1850,
    sharesCount: 12000,
    savesCount: 14500,
    viewsCount: 2900000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-08-30T10:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-8',
    creatorId: 'ext_dramebaaz_bihari',
    creatorName: 'The Dramebaaz Bihari',
    creatorUsername: '@dramebaaz_bihari',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Patna',
    title: 'अर्घ्य — छठ पूजा और परिवार (भावुक लघु फिल्म)',
    description: 'परदेस से घर लौटने और घाट पर पूरे परिवार के एक साथ अर्घ्य देने का मार्मिक चित्रण। Source: YouTube.',
    category: 'Family',
    tags: ['#Arghya', '#ChhathShortFilm', '#BihariCulture', '#GharAajaChhath'],
    videoUrl: 'https://www.youtube.com/watch?v=-cDHbRGlxbY',
    youtubeVideoId: '-cDHbRGlxbY',
    channelTitle: 'The Dramebaaz Bihari',
    externalSourceUrl: 'https://www.youtube.com/watch?v=-cDHbRGlxbY',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/-cDHbRGlxbY/hqdefault.jpg',
    videoDuration: '8:40',
    likesCount: 76000,
    commentsCount: 2200,
    sharesCount: 14000,
    savesCount: 8700,
    viewsCount: 2100000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-01T12:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-9',
    creatorId: 'ext_infocus_media',
    creatorName: 'Infocus Media Solutions',
    creatorUsername: '@infocus_media',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    creatorCity: 'Darbhanga',
    title: 'उगी हे दीनानाथ — मैथिली ठाकुर प्रातः अर्घ्य',
    description: 'प्रातः कालीन उषा अर्घ्य के समय गूंजने वाला पारंपरिक सूर्य वंदना गीत। Source: YouTube.',
    category: 'Usha Arghya',
    tags: ['#UgiHeyDinanath', '#MaithiliThakur', '#UshaArghya', '#BhorArghya'],
    videoUrl: 'https://www.youtube.com/watch?v=vSJO-AElAog',
    youtubeVideoId: 'vSJO-AElAog',
    channelTitle: 'Infocus Media Solutions',
    externalSourceUrl: 'https://www.youtube.com/watch?v=vSJO-AElAog',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'mai',
    thumbnailUrl: 'https://i.ytimg.com/vi/vSJO-AElAog/hqdefault.jpg',
    videoDuration: '5:35',
    likesCount: 83000,
    commentsCount: 1720,
    sharesCount: 11000,
    savesCount: 7900,
    viewsCount: 2500000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-02T06:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-10',
    creatorId: 'ext_cookwithparul',
    creatorName: 'Cook with Parul',
    creatorUsername: '@cookwithparul',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    creatorCity: 'Gaya',
    title: 'छठ पूजा का खस्ता ठेकुआ खजूरिया — नियम व रेसिपी',
    description: 'बिना फटे, एकदम सात्विक और कुरकुरा महाप्रसाद ठेकुआ बनाने के सभी राज। Source: YouTube.',
    category: 'Thekua / Prasad',
    tags: ['#Thekua', '#Khajuri', '#ChhathRecipe', '#CookWithParul'],
    videoUrl: 'https://www.youtube.com/watch?v=kwm2RzOnoNs',
    youtubeVideoId: 'kwm2RzOnoNs',
    channelTitle: 'CookwithParul',
    externalSourceUrl: 'https://www.youtube.com/watch?v=kwm2RzOnoNs',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/kwm2RzOnoNs/hqdefault.jpg',
    videoDuration: '7:15',
    likesCount: 68000,
    commentsCount: 1450,
    sharesCount: 9200,
    savesCount: 11300,
    viewsCount: 1950000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-03T14:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-11',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'T-Series Bhakti Sagar',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'केलवा के पात पर — शारदा सिन्हा (Kelwa Ke Paat Par)',
    description: 'सूर्य देव की पावन वंदना। केलवा के पात पर उगेलन सुरुज देव। अमर स्वर शारदा सिन्हा। Source: YouTube.',
    category: 'Chhath Geet',
    tags: ['#KelwaKePaat', '#ShardaSinha', '#SuryaPooja', '#ChhathPuja'],
    videoUrl: 'https://www.youtube.com/watch?v=y7hrM7PouQM',
    youtubeVideoId: 'y7hrM7PouQM',
    channelTitle: 'T-Series Bhakti Sagar',
    externalSourceUrl: 'https://www.youtube.com/watch?v=y7hrM7PouQM',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/y7hrM7PouQM/hqdefault.jpg',
    videoDuration: '5:48',
    likesCount: 215000,
    commentsCount: 4800,
    sharesCount: 28000,
    savesCount: 19500,
    viewsCount: 7800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-04T09:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-12',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'T-Series Bhakti Sagar',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'केलवा के पात पर (New Version) — शारदा सिन्हा',
    description: 'छठ महापर्व का सबसे पावन व लोकप्रिय भजन आधुनिक सुमधुर संगीत के साथ। Source: YouTube.',
    category: 'Chhath Geet',
    tags: ['#KelvaKePaat', '#ShardaSinha', '#BhojpuriBhakti', '#ChhathMahaParv'],
    videoUrl: 'https://www.youtube.com/watch?v=knZ8b5YnQiY',
    youtubeVideoId: 'knZ8b5YnQiY',
    channelTitle: 'T-Series Bhakti Sagar',
    externalSourceUrl: 'https://www.youtube.com/watch?v=knZ8b5YnQiY',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/knZ8b5YnQiY/hqdefault.jpg',
    videoDuration: '6:02',
    likesCount: 175000,
    commentsCount: 3900,
    sharesCount: 21000,
    savesCount: 14200,
    viewsCount: 5400000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-05T10:00:00Z',
    aspectRatio: '9:16'
  }
];

export const SEED_COMMENTS: ReelComment[] = [
  {
    id: 'comm_1',
    reelId: 'reel-1',
    userId: 'user_pramod_chhath',
    userName: 'प्रमोद कुमार झा',
    userUsername: '@pramodchhath',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    text: 'शारदा दीदी की आवाज सुनते ही आंखें नम हो जाती हैं। जय छठी मईया! 🙏❤️',
    likesCount: 142,
    createdAt: '2026-09-01T11:20:00Z'
  },
  {
    id: 'comm_2',
    reelId: 'reel-1',
    userId: 'user_bihari_vibes',
    userName: 'Bihari Vibes Official',
    userUsername: '@bihari_vibes',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    text: 'अमर स्वर! बिहार की हर गली, हर घाट पर यही गूंज है। 🌅',
    likesCount: 89,
    parentId: 'comm_1',
    createdAt: '2026-09-01T12:05:00Z'
  },
  {
    id: 'comm_3',
    reelId: 'reel-2',
    userId: 'user_sharda_trust',
    userName: 'शारदा सिन्हा संगीत न्यास',
    userUsername: '@sharda_trust',
    userAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    text: 'शुद्धता और नियम का ऐसा पालन केवल हमारे महापर्व में ही देखने को मिलता है। बहुत सुंदर प्रस्तुति!',
    likesCount: 64,
    createdAt: '2026-09-02T15:10:00Z'
  },
  {
    id: 'comm_4',
    reelId: 'reel-3',
    userId: 'user_chhathi_bhakta',
    userName: 'छठी मईया सेवक संघ',
    userUsername: '@chhathi_bhakta',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    text: 'पटना दीघा घाट का यह अलौकिक दृश्य देखकर रोम-रोम पुलकित हो उठा। हर हर गंगे! 🙏🪔',
    likesCount: 108,
    createdAt: '2026-09-03T19:00:00Z'
  }
];

// ==========================================
// 4. STORAGE ACCESSOR METHODS
// ==========================================

export const ReelsStorage = {
  // --- USERS ---
  getUsers(): ReelUser[] {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  },

  saveUsers(users: ReelUser[]) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  findUserByUsername(username: string): ReelUser | undefined {
    const clean = username.startsWith('@') ? username.toLowerCase() : `@${username.toLowerCase()}`;
    return this.getUsers().find(u => u.username.toLowerCase() === clean);
  },

  findUserById(id: string): ReelUser | undefined {
    if (!id) return undefined;
    const legacyMap: Record<string, string> = {
      'user_sharda_trust': '018e6e5b-468b-7000-8000-000000000001',
      'user_pramod_chhath': '018e6e5b-468b-7000-8000-000000000002',
      'user_bihari_vibes': '018e6e5b-468b-7000-8000-000000000003',
      'user_chhathi_bhakta': '018e6e5b-468b-7000-8000-000000000004',
      'user_maithili_kitchen': '018e6e5b-468b-7000-8000-000000000005',
      'user_admin': '018e6e5b-468b-7000-8000-000000000000'
    };
    const target = legacyMap[id] || id;
    return this.getUsers().find(u => u.id === target || u.id === id || u.user_id === target);
  },

  findUserByEmail(email: string): ReelUser | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser(user: ReelUser) {
    const users = this.getUsers();
    const cleanUsername = user.username.startsWith('@') ? user.username : `@${user.username}`;
    const newUser = { ...user, username: cleanUsername };
    users.unshift(newUser);
    this.saveUsers(users);
    return newUser;
  },

  updateUser(id: string, updates: Partial<ReelUser>): ReelUser | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    
    // Also update active session if current user
    const session = this.getSession();
    if (session && session.id === id) {
      this.setSession(users[idx]);
    }
    return users[idx];
  },

  // --- SESSION ---
  getSession(): ReelUser | null {
    const raw = localStorage.getItem(KEYS.SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setSession(user: ReelUser | null) {
    if (!user) {
      localStorage.removeItem(KEYS.SESSION);
    } else {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    }
  },

  // --- REELS ---
  getReels(): DynamicReel[] {
    const raw = localStorage.getItem(KEYS.REELS);
    if (!raw) {
      localStorage.setItem(KEYS.REELS, JSON.stringify(SEED_REELS));
      return SEED_REELS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(KEYS.REELS, JSON.stringify(SEED_REELS));
        return SEED_REELS;
      }
      // Migration: If existing reels contain dead 403 mixkit.co URLs or old 6-item seed set,
      // preserve user-created reels while updating seed reels to working media
      const hasBrokenLinks = parsed.some(r => r.videoUrl && r.videoUrl.includes('mixkit.co'));
      const isOutdatedSeedCount = parsed.length < 10 && !parsed.some(r => r.id && r.id.startsWith('user_'));
      if (hasBrokenLinks || isOutdatedSeedCount) {
        const userCreated = parsed.filter(r => !r.id.startsWith('reel-') && !r.id.startsWith('demo-reel-'));
        const updated = [...userCreated, ...SEED_REELS];
        localStorage.setItem(KEYS.REELS, JSON.stringify(updated));
        return updated;
      }
      return parsed;
    } catch {
      localStorage.setItem(KEYS.REELS, JSON.stringify(SEED_REELS));
      return SEED_REELS;
    }
  },

  saveReels(reels: DynamicReel[]) {
    localStorage.setItem(KEYS.REELS, JSON.stringify(reels));
  },

  addReel(reel: DynamicReel) {
    const reels = this.getReels();
    reels.unshift(reel);
    this.saveReels(reels);

    // Increment user's reel count
    const creator = this.findUserById(reel.creatorId);
    if (creator) {
      this.updateUser(creator.id, { reelsCount: (creator.reelsCount || 0) + 1 });
    }
    return reel;
  },

  updateReel(id: string, updates: Partial<DynamicReel>): DynamicReel | null {
    const reels = this.getReels();
    const idx = reels.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reels[idx] = { ...reels[idx], ...updates };
    this.saveReels(reels);
    return reels[idx];
  },

  deleteReel(id: string) {
    const reels = this.getReels().filter(r => r.id !== id);
    this.saveReels(reels);
  },

  // --- COMMENTS ---
  getComments(reelId?: string): ReelComment[] {
    const raw = localStorage.getItem(KEYS.COMMENTS);
    let all: ReelComment[] = [];
    if (!raw) {
      localStorage.setItem(KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
      all = SEED_COMMENTS;
    } else {
      try {
        all = JSON.parse(raw);
      } catch {
        all = SEED_COMMENTS;
      }
    }
    return reelId ? all.filter(c => c.reelId === reelId) : all;
  },

  saveComments(comments: ReelComment[]) {
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
  },

  addComment(comment: ReelComment) {
    const all = this.getComments();
    all.push(comment);
    this.saveComments(all);

    // Update reel comments count
    const reel = this.getReels().find(r => r.id === comment.reelId);
    if (reel) {
      this.updateReel(reel.id, { commentsCount: reel.commentsCount + 1 });
    }
    return comment;
  },

  deleteComment(commentId: string) {
    const all = this.getComments();
    const target = all.find(c => c.id === commentId);
    const filtered = all.filter(c => c.id !== commentId && c.parentId !== commentId);
    this.saveComments(filtered);

    if (target) {
      const reel = this.getReels().find(r => r.id === target.reelId);
      if (reel) {
        this.updateReel(reel.id, { commentsCount: Math.max(0, reel.commentsCount - 1) });
      }
    }
  },

  // --- LIKES ---
  getLikesMap(): Record<string, boolean> {
    const raw = localStorage.getItem(KEYS.LIKES);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  },

  isReelLiked(userId: string, reelId: string): boolean {
    const map = this.getLikesMap();
    return Boolean(map[`${userId}_${reelId}`]);
  },

  toggleReelLike(userId: string, reelId: string): boolean {
    const map = this.getLikesMap();
    const key = `${userId}_${reelId}`;
    const currentlyLiked = Boolean(map[key]);
    const nextState = !currentlyLiked;

    if (nextState) {
      map[key] = true;
    } else {
      delete map[key];
    }
    localStorage.setItem(KEYS.LIKES, JSON.stringify(map));

    // Update reel likes count
    const reel = this.getReels().find(r => r.id === reelId);
    if (reel) {
      const delta = nextState ? 1 : -1;
      const newLikes = Math.max(0, reel.likesCount + delta);
      this.updateReel(reelId, { likesCount: newLikes });

      // Update creator's total likes count
      const creator = this.findUserById(reel.creatorId);
      if (creator) {
        this.updateUser(creator.id, { totalLikesCount: Math.max(0, creator.totalLikesCount + delta) });
      }
    }
    return nextState;
  },

  // --- SAVES ---
  getSavesMap(): Record<string, boolean> {
    const raw = localStorage.getItem(KEYS.SAVES);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  },

  isReelSaved(userId: string, reelId: string): boolean {
    const map = this.getSavesMap();
    return Boolean(map[`${userId}_${reelId}`]);
  },

  toggleReelSave(userId: string, reelId: string): boolean {
    const map = this.getSavesMap();
    const key = `${userId}_${reelId}`;
    const nextState = !map[key];
    if (nextState) {
      map[key] = true;
    } else {
      delete map[key];
    }
    localStorage.setItem(KEYS.SAVES, JSON.stringify(map));

    const reel = this.getReels().find(r => r.id === reelId);
    if (reel) {
      const delta = nextState ? 1 : -1;
      this.updateReel(reelId, { savesCount: Math.max(0, reel.savesCount + delta) });
    }
    return nextState;
  },

  // --- FOLLOWS ---
  getFollowsMap(): Record<string, boolean> {
    const raw = localStorage.getItem(KEYS.FOLLOWS);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  },

  isFollowing(followerId: string, targetUserId: string): boolean {
    const map = this.getFollowsMap();
    return Boolean(map[`${followerId}_${targetUserId}`]);
  },

  toggleFollow(followerId: string, targetUserId: string): boolean {
    if (followerId === targetUserId) return false;
    const map = this.getFollowsMap();
    const key = `${followerId}_${targetUserId}`;
    const nextState = !map[key];

    if (nextState) {
      map[key] = true;
    } else {
      delete map[key];
    }
    localStorage.setItem(KEYS.FOLLOWS, JSON.stringify(map));

    // Update target follower count
    const target = this.findUserById(targetUserId);
    if (target) {
      const delta = nextState ? 1 : -1;
      this.updateUser(targetUserId, { followersCount: Math.max(0, target.followersCount + delta) });
    }

    // Update follower's following count
    const follower = this.findUserById(followerId);
    if (follower) {
      const delta = nextState ? 1 : -1;
      this.updateUser(followerId, { followingCount: Math.max(0, follower.followingCount + delta) });
    }

    return nextState;
  },

  // --- GENUINE VIEW COUNTER (Rate-limited, continuous watch verification) ---
  recordReelView(userId: string, reelId: string): boolean {
    const mapRaw = localStorage.getItem(KEYS.VIEWS);
    const map: Record<string, number> = mapRaw ? JSON.parse(mapRaw) : {};
    const key = `${userId}_${reelId}`;
    const now = Date.now();
    const lastViewTime = map[key] || 0;

    // Rate-limit: Only count 1 view per reel per user every 30 minutes
    if (now - lastViewTime < 30 * 60 * 1000) {
      return false;
    }

    map[key] = now;
    localStorage.setItem(KEYS.VIEWS, JSON.stringify(map));

    const reel = this.getReels().find(r => r.id === reelId);
    if (reel) {
      this.updateReel(reelId, { viewsCount: reel.viewsCount + 1 });
    }
    return true;
  },

  // --- DRAFTS ---
  getDrafts(userId: string): ReelDraft[] {
    const raw = localStorage.getItem(KEYS.DRAFTS);
    if (!raw) return [];
    try {
      const all: ReelDraft[] = JSON.parse(raw);
      return all.filter(d => d.userId === userId);
    } catch {
      return [];
    }
  },

  saveDraft(draft: ReelDraft) {
    const raw = localStorage.getItem(KEYS.DRAFTS);
    const all: ReelDraft[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex(d => d.id === draft.id);
    if (idx >= 0) {
      all[idx] = draft;
    } else {
      all.unshift(draft);
    }
    localStorage.setItem(KEYS.DRAFTS, JSON.stringify(all));
    return draft;
  },

  deleteDraft(draftId: string) {
    const raw = localStorage.getItem(KEYS.DRAFTS);
    if (!raw) return;
    try {
      const all: ReelDraft[] = JSON.parse(raw);
      localStorage.setItem(KEYS.DRAFTS, JSON.stringify(all.filter(d => d.id !== draftId)));
    } catch {
      // ignore
    }
  },

  // --- REPORTS ---
  getReports(): ReelReport[] {
    const raw = localStorage.getItem(KEYS.REPORTS);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  },

  addReport(report: ReelReport) {
    const all = this.getReports();
    all.unshift(report);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(all));
  },

  updateReportStatus(reportId: string, status: ReelReport['status']) {
    const all = this.getReports();
    const idx = all.findIndex(r => r.id === reportId);
    if (idx >= 0) {
      all[idx].status = status;
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(all));
    }
  },

  // --- BLOCKED USERS ---
  getBlockedUsers(userId: string): string[] {
    const raw = localStorage.getItem(KEYS.BLOCKED);
    if (!raw) return [];
    try {
      const map: Record<string, boolean> = JSON.parse(raw);
      return Object.keys(map)
        .filter(k => k.startsWith(`${userId}_`))
        .map(k => k.replace(`${userId}_`, ''));
    } catch {
      return [];
    }
  },

  blockUser(userId: string, targetUserId: string) {
    const raw = localStorage.getItem(KEYS.BLOCKED);
    const map: Record<string, boolean> = raw ? JSON.parse(raw) : {};
    map[`${userId}_${targetUserId}`] = true;
    localStorage.setItem(KEYS.BLOCKED, JSON.stringify(map));
  },

  unblockUser(userId: string, targetUserId: string) {
    const raw = localStorage.getItem(KEYS.BLOCKED);
    if (!raw) return;
    const map: Record<string, boolean> = JSON.parse(raw);
    delete map[`${userId}_${targetUserId}`];
    localStorage.setItem(KEYS.BLOCKED, JSON.stringify(map));
  },

  // --- NOTIFICATIONS ---
  getNotifications(userId: string): ReelNotification[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return [];
    try {
      const all: ReelNotification[] = JSON.parse(raw);
      return all.filter(n => n.userId === userId);
    } catch {
      return [];
    }
  },

  addNotification(notif: ReelNotification) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: ReelNotification[] = raw ? JSON.parse(raw) : [];
    all.unshift(notif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all.slice(0, 100)));
  },

  markNotificationsRead(userId: string) {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return;
    try {
      const all: ReelNotification[] = JSON.parse(raw);
      all.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
    } catch {
      // ignore
    }
  },

  // --- AUDIO TRACKS ---
  getAudioTracks(): ReelAudioTrack[] {
    const raw = localStorage.getItem(KEYS.AUDIO);
    if (!raw) {
      localStorage.setItem(KEYS.AUDIO, JSON.stringify(SEED_AUDIO_TRACKS));
      return SEED_AUDIO_TRACKS;
    }
    try { return JSON.parse(raw); } catch { return SEED_AUDIO_TRACKS; }
  },

  // --- AUTO PUBLISH CONFIG ---
  isAutoPublishEnabled(): boolean {
    const val = localStorage.getItem(KEYS.AUTO_PUBLISH);
    return val === null ? true : val === 'true';
  },

  setAutoPublishEnabled(enabled: boolean) {
    localStorage.setItem(KEYS.AUTO_PUBLISH, String(enabled));
  },

  // --- PERSONALIZATION SIGNALS & ONBOARDING ---
  recordSongPlay(userId: string, songId: string) {
    const user = this.findUserById(userId);
    if (!user) return;
    const history = user.listeningHistory || [];
    const updatedHistory = [songId, ...history.filter(id => id !== songId)].slice(0, 30);
    this.updateUser(userId, { listeningHistory: updatedHistory });
  },

  recordTopicView(userId: string, topic: string) {
    const user = this.findUserById(userId);
    if (!user) return;
    const topics = user.viewedTopics || [];
    const updatedTopics = [topic, ...topics.filter(t => t !== topic)].slice(0, 20);
    this.updateUser(userId, { viewedTopics: updatedTopics });
  },

  toggleGhatBookmark(userId: string, ghatId: string): boolean {
    const user = this.findUserById(userId);
    if (!user) return false;
    const saved = user.savedGhats || [];
    const isSaved = saved.includes(ghatId);
    const updatedSaved = isSaved ? saved.filter(id => id !== ghatId) : [ghatId, ...saved];
    this.updateUser(userId, { savedGhats: updatedSaved });
    return !isSaved;
  },

  updateUserInterests(userId: string, interests: string[]) {
    return this.updateUser(userId, { interests });
  },

  completeUserOnboarding(
    userId: string,
    data: { language: any; interests: string[]; country: string; state: string; city: string }
  ): ReelUser | null {
    return this.updateUser(userId, {
      language: data.language,
      interests: data.interests,
      country: data.country,
      state: data.state,
      city: data.city,
      onboardingCompleted: true
    });
  },

  // --- SMART FALLBACK & EXTERNAL CATALOG STORAGE ---
  getExternalCatalog(): DynamicReel[] {
    const raw = localStorage.getItem(KEYS.EXTERNAL_CATALOG);
    if (!raw) {
      localStorage.setItem(KEYS.EXTERNAL_CATALOG, JSON.stringify(EXTERNAL_CHHATH_SEED_CATALOG));
      return EXTERNAL_CHHATH_SEED_CATALOG;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= EXTERNAL_CHHATH_SEED_CATALOG.length) {
        const hasBrokenIds = parsed.some(p => p.youtubeVideoId === 'yqK8qF8_Mco' || p.youtubeVideoId === '9H2q61hB0gA');
        if (!hasBrokenIds) return parsed;
      }
      localStorage.setItem(KEYS.EXTERNAL_CATALOG, JSON.stringify(EXTERNAL_CHHATH_SEED_CATALOG));
      return EXTERNAL_CHHATH_SEED_CATALOG;
    } catch {
      return EXTERNAL_CHHATH_SEED_CATALOG;
    }
  },

  addExternalReels(newReels: DynamicReel[]) {
    const catalog = this.getExternalCatalog();
    const existingIds = new Set(catalog.map(r => r.id));
    const toAdd = newReels.filter(r => !existingIds.has(r.id));
    if (toAdd.length > 0) {
      const updated = [...catalog, ...toAdd];
      localStorage.setItem(KEYS.EXTERNAL_CATALOG, JSON.stringify(updated));
    }
  },

  getNotInterested(userId: string): NotInterestedSignal[] {
    const raw = localStorage.getItem(`${KEYS.NOT_INTERESTED}_${userId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addNotInterested(userId: string, signal: NotInterestedSignal) {
    const list = this.getNotInterested(userId);
    const updated = [signal, ...list.filter(item => item.reelId !== signal.reelId)].slice(0, 100);
    localStorage.setItem(`${KEYS.NOT_INTERESTED}_${userId}`, JSON.stringify(updated));
  },

  isItemSuppressed(userId: string, reelId: string, youtubeId?: string): boolean {
    const list = this.getNotInterested(userId);
    return list.some(item => 
      item.reelId === reelId || 
      (youtubeId && item.youtubeId && item.youtubeId === youtubeId)
    );
  },

  getImpressions(userId: string): UserContentImpression[] {
    const raw = localStorage.getItem(`${KEYS.IMPRESSIONS}_${userId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  recordImpression(userId: string, reelId: string, youtubeId?: string, watchSeconds?: number) {
    const list = this.getImpressions(userId);
    const impression: UserContentImpression = {
      reelId,
      sourceType: youtubeId ? 'YOUTUBE' : 'FIRST_PARTY',
      youtubeId,
      timestamp: Date.now(),
      watchSeconds
    };
    // Keep last 150 impressions
    const updated = [impression, ...list].slice(0, 150);
    localStorage.setItem(`${KEYS.IMPRESSIONS}_${userId}`, JSON.stringify(updated));
  },

  // --- SEARCH HISTORY ---
  getSearchHistory(userId?: string): string[] {
    const key = userId ? `${KEYS.SEARCH_HISTORY}_${userId}` : KEYS.SEARCH_HISTORY;
    const raw = localStorage.getItem(key);
    if (!raw) return ['छठ गीत', 'खरना', 'ठेकुआ', 'शारदा सिन्हा', 'दीघा घाट'];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['छठ गीत', 'खरना', 'ठेकुआ', 'शारदा सिन्हा', 'दीघा घाट'];
    } catch {
      return ['छठ गीत', 'खरना', 'ठेकुआ', 'शारदा सिन्हा', 'दीघा घाट'];
    }
  },

  addSearchHistory(userId: string | undefined, query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    const current = this.getSearchHistory(userId);
    const updated = [trimmed, ...current.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 15);
    const key = userId ? `${KEYS.SEARCH_HISTORY}_${userId}` : KEYS.SEARCH_HISTORY;
    localStorage.setItem(key, JSON.stringify(updated));
  },

  clearSearchHistory(userId?: string) {
    const key = userId ? `${KEYS.SEARCH_HISTORY}_${userId}` : KEYS.SEARCH_HISTORY;
    localStorage.removeItem(key);
  },

  // --- YOUTUBE VALIDATION CACHE & BLOCKLIST ---
  getCachedYouTubeVideos(): Record<string, CachedYouTubeVideo> {
    const raw = localStorage.getItem(KEYS.YOUTUBE_CACHE);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  setCachedYouTubeVideo(video: CachedYouTubeVideo) {
    const cache = this.getCachedYouTubeVideos();
    cache[video.youtubeVideoId] = video;
    localStorage.setItem(KEYS.YOUTUBE_CACHE, JSON.stringify(cache));
  },

  getBlockedVideoIds(): string[] {
    const raw = localStorage.getItem(KEYS.BLOCKED_VIDEOS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addBlockedVideoId(videoId: string) {
    const list = this.getBlockedVideoIds();
    if (!list.includes(videoId)) {
      list.push(videoId);
      localStorage.setItem(KEYS.BLOCKED_VIDEOS, JSON.stringify(list));
    }
    // Also mark in cache if present
    const cache = this.getCachedYouTubeVideos();
    if (cache[videoId]) {
      cache[videoId].status = 'BLOCKED';
      localStorage.setItem(KEYS.YOUTUBE_CACHE, JSON.stringify(cache));
    }
  },

  isBlockedVideo(videoId: string): boolean {
    const list = this.getBlockedVideoIds();
    return list.includes(videoId);
  }
};
