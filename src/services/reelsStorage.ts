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
  REELS: 'chhath_reels_list_v18',
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
  IMPRESSIONS: 'chhath_reels_impressions_v18',
  EXTERNAL_CATALOG: 'chhath_reels_external_catalog_v18',
  SEARCH_HISTORY: 'chhath_reels_search_history',
  YOUTUBE_CACHE: 'chhath_reels_youtube_cache',
  BLOCKED_VIDEOS: 'chhath_reels_blocked_videos',
  INSTAGRAM_CACHE: 'chhath_reels_instagram_cache'
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

// ==================================================================
// 4. APPROVED CULTURAL & EMBEDDABLE CONTENT CATALOG (INSTAGRAM + YOUTUBE)
// ==================================================================
export const EXTERNAL_CHHATH_SEED_CATALOG: DynamicReel[] = [
  {
    id: 'ig-chhath-1',
    creatorId: 'ig_patna_ghat',
    creatorName: 'पटना छठ डायरीज 🌅',
    creatorUsername: '@patna_chhath_darshan',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'दीनानाथ तोहार महिमा अपार 🌅 — पटना गंगा घाट व मरीन ड्राइव अलौकिक दृश्य',
    description: 'लाखों दीपों की रोशनी में नहाया मां गंगा का पावन तट। जय छठी मईया! #ChhathPuja #InstagramReels #PatnaGhat #Trending',
    category: 'Ghat',
    tags: ['#ChhathPuja', '#InstagramReels', '#PatnaGhat', '#Trending', '#ChhathiMaiya'],
    videoUrl: 'https://www.youtube.com/watch?v=u0nOfHGb5FQ',
    youtubeVideoId: 'u0nOfHGb5FQ',
    instagramShortcode: 'DC5bYVjT1xM',
    instagramUrl: 'https://www.instagram.com/reel/DC5bYVjT1xM/',
    channelTitle: 'Instagram • @patna_chhath_darshan',
    externalSourceUrl: 'https://www.instagram.com/reel/DC5bYVjT1xM/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/u0nOfHGb5FQ/hqdefault.jpg',
    videoDuration: '0:35',
    likesCount: 384000,
    commentsCount: 6200,
    sharesCount: 54000,
    savesCount: 38000,
    viewsCount: 9200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-28T16:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-2',
    creatorId: 'ig_thekuaprasad',
    creatorName: 'छठ महाप्रसाद रसोई 🌾',
    creatorUsername: '@chhath_thekua_patna',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Patna',
    title: 'शुद्ध देशी घी और गुड़ का ठेकुआ — पारंपरिक सांचे पर महाप्रसाद निर्माण',
    description: 'मिट्टी के चूल्हे और आम की लकड़ी पर बना पारंपरिक छठ ठेकुआ महाप्रसाद। #ThekuaPrasad #ChhathPrasad #InstagramReels',
    category: 'Thekua / Prasad',
    tags: ['#ThekuaPrasad', '#ChhathPrasad', '#InstagramReels', '#BihariTradition'],
    videoUrl: 'https://www.youtube.com/watch?v=Jegu3rAfrHY',
    youtubeVideoId: 'Jegu3rAfrHY',
    instagramShortcode: 'DB8kLy3pQ1Z',
    instagramUrl: 'https://www.instagram.com/reel/DB8kLy3pQ1Z/',
    channelTitle: 'Instagram • @chhath_thekua_patna',
    externalSourceUrl: 'https://www.instagram.com/reel/DB8kLy3pQ1Z/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/Jegu3rAfrHY/hqdefault.jpg',
    videoDuration: '0:30',
    likesCount: 420000,
    commentsCount: 7800,
    sharesCount: 65000,
    savesCount: 42000,
    viewsCount: 11400000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-29T11:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-3',
    creatorId: 'ig_biharculture',
    creatorName: 'बिहार संस्कृति व धरोहर ✨',
    creatorUsername: '@bihar_culture_patna',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'कांच ही बांस के बहंगिया — सिर पर दौरा उठाए गंगा तट की पावन यात्रा',
    description: 'छठ पूजा की पवित्रता और दौरा सजावट। छठ व्रतियों की अटूट श्रद्धा। #ChhathGeet #Bahangiya #InstagramReels',
    category: 'Puja Preparation',
    tags: ['#ChhathGeet', '#Bahangiya', '#Chhath2026', '#InstagramReels'],
    videoUrl: 'https://www.youtube.com/watch?v=SsQEyUz8l2E',
    youtubeVideoId: 'SsQEyUz8l2E',
    instagramShortcode: 'C-a5_H8vX8N',
    instagramUrl: 'https://www.instagram.com/reel/C-a5_H8vX8N/',
    channelTitle: 'Instagram • @bihar_culture_patna',
    externalSourceUrl: 'https://www.instagram.com/reel/C-a5_H8vX8N/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/SsQEyUz8l2E/hqdefault.jpg',
    videoDuration: '0:42',
    likesCount: 310000,
    commentsCount: 6100,
    sharesCount: 52000,
    savesCount: 31000,
    viewsCount: 8400000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-30T14:20:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-4',
    creatorId: 'ig_usha_arghya',
    creatorName: 'उषा अर्घ्य दर्शन 🌅',
    creatorUsername: '@usha_arghya_live',
    creatorAvatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80',
    creatorCity: 'Muzaffarpur',
    title: 'उग हो सुरुज देव भइल अरघ के बेर — प्रातःकालीन उषा अर्घ्य गंगाजल समर्पण',
    description: 'सप्तमी के पावन भोर में उगते सूर्य देव को दुग्ध अर्घ्य अर्पण। चारों ओर शंख ध्वनि। #UshaArghya #Sunrise #InstagramReels',
    category: 'Usha Arghya',
    tags: ['#UshaArghya', '#Sunrise', '#Chhath2026', '#InstagramReels'],
    videoUrl: 'https://www.youtube.com/watch?v=3XQDVtg2aIA',
    youtubeVideoId: '3XQDVtg2aIA',
    instagramShortcode: 'C9mKl23OpxX',
    instagramUrl: 'https://www.instagram.com/reel/C9mKl23OpxX/',
    channelTitle: 'Instagram • @usha_arghya_live',
    externalSourceUrl: 'https://www.instagram.com/reel/C9mKl23OpxX/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/3XQDVtg2aIA/hqdefault.jpg',
    videoDuration: '0:45',
    likesCount: 460000,
    commentsCount: 9400,
    sharesCount: 81000,
    savesCount: 47000,
    viewsCount: 12500000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-10-01T06:15:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-5',
    creatorId: 'ig_ghat_diaries',
    creatorName: 'गंगा घाट दीपमाला 🪔',
    creatorUsername: '@ganga_ghat_diaries',
    creatorAvatar: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=200&q=80',
    creatorCity: 'Bhagalpur',
    title: 'लाखों दीपों से जगमगाते पटना के पावन छठ घाट — अद्भुत ड्रोन व्यू',
    description: 'छठ की पावन रात में दीपोत्सव और भक्ति संगीत की गूंज। जय छठी मैया! #ChhathGhat #Deepotsav #InstagramReels',
    category: 'Ghat',
    tags: ['#ChhathGhat', '#Deepotsav', '#Diya', '#InstagramReels'],
    videoUrl: 'https://www.youtube.com/watch?v=TN7j4Fojlqo',
    youtubeVideoId: 'TN7j4Fojlqo',
    instagramShortcode: 'DDo94aLpxK8',
    instagramUrl: 'https://www.instagram.com/reel/DDo94aLpxK8/',
    channelTitle: 'Instagram • @ganga_ghat_diaries',
    externalSourceUrl: 'https://www.instagram.com/reel/DDo94aLpxK8/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/TN7j4Fojlqo/hqdefault.jpg',
    videoDuration: '0:36',
    likesCount: 295000,
    commentsCount: 4900,
    sharesCount: 42000,
    savesCount: 29000,
    viewsCount: 7800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-10-01T18:40:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-6',
    creatorId: 'ig_koshi_mithila',
    creatorName: 'पावन आस्था मिथिला 🎋',
    creatorUsername: '@mithila_chhath_aastha',
    creatorAvatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80',
    creatorCity: 'Darbhanga',
    title: 'गन्ने के मंडप और दीपों के संग पावन कोशी भराई अनुष्ठान 🎋',
    description: 'कोशी भरे चलली छठी मईया के दुआर। भक्ति और श्रद्धा का अलौकिक उत्सव। #KoshiBharaai #InstagramReel #Bhakti',
    category: 'Devotional',
    tags: ['#KoshiBharaai', '#ChhathMahaparv', '#InstagramReel', '#Bhakti'],
    videoUrl: 'https://www.youtube.com/watch?v=GaU5JxThjHY',
    youtubeVideoId: 'GaU5JxThjHY',
    instagramShortcode: 'C_fL1e8pT4z',
    instagramUrl: 'https://www.instagram.com/reel/C_fL1e8pT4z/',
    channelTitle: 'Instagram • @mithila_chhath_aastha',
    externalSourceUrl: 'https://www.instagram.com/reel/C_fL1e8pT4z/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'mai',
    thumbnailUrl: 'https://i.ytimg.com/vi/GaU5JxThjHY/hqdefault.jpg',
    videoDuration: '0:38',
    likesCount: 340000,
    commentsCount: 5600,
    sharesCount: 48000,
    savesCount: 31000,
    viewsCount: 8900000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-10-02T19:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-7',
    creatorId: 'ig_kharna_vrati',
    creatorName: 'छठ व्रती परंपरा 🍯',
    creatorUsername: '@vrati_darshan_bihar',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Gaya',
    title: 'खरना की पावन शाम — मिट्टी के चूल्हे पर बनी गुड़ की अमृत खीर व रोटी',
    description: 'छठ महापर्व का दूसरा पावन दिन खरना। शुद्धता और नियम-निष्ठा का प्रतीक। #Kharna #KheerPrasad #InstagramReels',
    category: 'Puja Preparation',
    tags: ['#Kharna', '#KheerPrasad', '#ChhathPuja', '#InstagramReels'],
    videoUrl: 'https://www.youtube.com/watch?v=GYAFUlc6b54',
    youtubeVideoId: 'GYAFUlc6b54',
    instagramShortcode: 'DB4vGZkJX2a',
    instagramUrl: 'https://www.instagram.com/reel/DB4vGZkJX2a/',
    channelTitle: 'Instagram • @vrati_darshan_bihar',
    externalSourceUrl: 'https://www.instagram.com/reel/DB4vGZkJX2a/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/GYAFUlc6b54/hqdefault.jpg',
    videoDuration: '0:32',
    likesCount: 280000,
    commentsCount: 4300,
    sharesCount: 37000,
    savesCount: 26000,
    viewsCount: 7200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-10-03T17:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ig-chhath-8',
    creatorId: 'ig_gharwapsi',
    creatorName: 'छठ इमोशन बिहार ❤️',
    creatorUsername: '@chhath_emotion_bihar',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    creatorCity: 'Patna',
    title: 'छठ महापर्व — साल भर का इंतजार और अपनों के बीच घर वापसी ❤️',
    description: 'परदेसियों का अपने गांव-घर लौटना। मां के हाथों का ठेकुआ और छठ का उल्लास। #GharWapsi #ChhathEmotion #InstagramReels',
    category: 'Devotional',
    tags: ['#GharWapsi', '#ChhathEmotion', '#InstagramReels', '#Trending'],
    videoUrl: 'https://www.youtube.com/watch?v=pe8IZ2DlwNI',
    youtubeVideoId: 'pe8IZ2DlwNI',
    instagramShortcode: 'DEx93kPpZ9B',
    instagramUrl: 'https://www.instagram.com/reel/DEx93kPpZ9B/',
    channelTitle: 'Instagram • @chhath_emotion_bihar',
    externalSourceUrl: 'https://www.instagram.com/reel/DEx93kPpZ9B/',
    sourceType: 'INSTAGRAM',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/pe8IZ2DlwNI/hqdefault.jpg',
    videoDuration: '0:48',
    likesCount: 520000,
    commentsCount: 11200,
    sharesCount: 95000,
    savesCount: 61000,
    viewsCount: 14800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-10-03T12:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-1',
    creatorId: 'c_manisha_sharma',
    creatorName: 'मनीषा शर्मा • लोक गायिका',
    creatorUsername: '@manisha_sharma_chhath',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'मारबो रे सुगवा धनुषा से 🌾🌞 — पारंपरिक सूप व दौरा की पावन तैयारी',
    description: 'छठ पूजा की पवित्रता और दौरा सजावट। छठ व्रतियों की अटूट श्रद्धा। जय छठी मईया! #ChhathGeet #Bahangiya #Shorts',
    category: 'Chhath Geet',
    tags: ['#ChhathGeet', '#Bahangiya', '#Chhath2026', '#BihariTradition', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=s256QAoPt4I',
    youtubeVideoId: 's256QAoPt4I',
    channelTitle: 'मनीषा शर्मा संगीत',
    externalSourceUrl: 'https://www.youtube.com/watch?v=s256QAoPt4I',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/s256QAoPt4I/hqdefault.jpg',
    videoDuration: '0:40',
    likesCount: 310000,
    commentsCount: 6100,
    sharesCount: 52000,
    savesCount: 31000,
    viewsCount: 8400000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-12T09:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-2',
    creatorId: 'c_patna_ghat',
    creatorName: 'छठ संध्या अर्घ्य लाइव',
    creatorUsername: '@ganga_ghat_patna',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
    creatorCity: 'Patna',
    title: 'अस्ताचलगामी सूर्य को अर्घ्य — पटना गंगा तट संध्या अर्घ्य 🌅',
    description: 'लाखों व्रतियों द्वारा भगवान भास्कर को संध्या अर्घ्य अर्पण। पावन गंगा तट का अलौकिक नजारा। #SandhyaArghya #PatnaLive #Shorts',
    category: 'Sandhya Arghya',
    tags: ['#SandhyaArghya', '#PatnaLive', '#Shorts', '#ChhathPuja'],
    videoUrl: 'https://www.youtube.com/watch?v=dZr4KPbBjNo',
    youtubeVideoId: 'dZr4KPbBjNo',
    channelTitle: 'छठ महापर्व संध्या अर्घ्य लाइव',
    externalSourceUrl: 'https://www.youtube.com/watch?v=dZr4KPbBjNo',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/dZr4KPbBjNo/hqdefault.jpg',
    videoDuration: '0:35',
    likesCount: 510000,
    commentsCount: 9200,
    sharesCount: 84000,
    savesCount: 47000,
    viewsCount: 15200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-15T18:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-3',
    creatorId: 'c_jal_beech',
    creatorName: 'सूर्य मंदिर घाट दर्शन',
    creatorUsername: '@patna_surya_mandir',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'जल बीच खड़ा होई दर्शन दीं सुरुज देव 🌊 — पावन अर्घ्य बेला',
    description: 'तांबे के लोटे और पीतल के सूप से भगवान भास्कर को सात्विक अर्घ्य समर्पण। #SuryaArghya #GangaJal #BhaktiVibes',
    category: 'Sandhya Arghya',
    tags: ['#SuryaArghya', '#GangaJal', '#BhaktiVibes', '#Pranam'],
    videoUrl: 'https://www.youtube.com/watch?v=qFwoGr1ex_g',
    youtubeVideoId: 'qFwoGr1ex_g',
    channelTitle: 'सूर्य मंदिर घाट दर्शन',
    externalSourceUrl: 'https://www.youtube.com/watch?v=qFwoGr1ex_g',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/qFwoGr1ex_g/hqdefault.jpg',
    videoDuration: '0:42',
    likesCount: 340000,
    commentsCount: 5700,
    sharesCount: 46000,
    savesCount: 29000,
    viewsCount: 9100000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-18T12:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-4',
    creatorId: 'ext_bhaktiai',
    creatorName: 'छठ भक्ति भाव',
    creatorUsername: '@chhathbhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'जय छठी मईया तोहार महिमा अपार — पावन छठ महापर्व',
    description: 'हे छठी मईया तोहार महिमा अपार! सुरुज देव के पावन अरघिया। #ChhathPuja #ChhathiMaiya #Shorts',
    category: 'Devotional',
    tags: ['#ChhathPuja', '#ChhathiMaiya', '#Bhakti', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=3wTOA1GkVf0',
    youtubeVideoId: '3wTOA1GkVf0',
    channelTitle: 'छठ भक्ति भाव',
    externalSourceUrl: 'https://www.youtube.com/watch?v=3wTOA1GkVf0',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/3wTOA1GkVf0/hqdefault.jpg',
    videoDuration: '0:35',
    likesCount: 320000,
    commentsCount: 6800,
    sharesCount: 57000,
    savesCount: 35000,
    viewsCount: 7800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-20T16:30:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-5',
    creatorId: 'ext_chhathdarshan',
    creatorName: 'छठ पावन दर्शन',
    creatorUsername: '@chhathdarshan',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'पावन छठ घाट दर्शन व आरती — सूर्य देव आराधना',
    description: 'संध्या अर्घ्य के समय गंगा तट का अलौकिक दृश्य। हर हर गंगे, जय छठी मैया। #ChhathGhat #SandhyaArghya #Shorts',
    category: 'Sandhya Arghya',
    tags: ['#ChhathGhat', '#SandhyaArghya', '#ChhathPuja', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=w9AiKa0gGMs',
    youtubeVideoId: 'w9AiKa0gGMs',
    channelTitle: 'छठ पावन दर्शन',
    externalSourceUrl: 'https://www.youtube.com/watch?v=w9AiKa0gGMs',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/w9AiKa0gGMs/hqdefault.jpg',
    videoDuration: '0:42',
    likesCount: 310000,
    commentsCount: 5200,
    sharesCount: 43000,
    savesCount: 28000,
    viewsCount: 8200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-22T17:45:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-6',
    creatorId: 'ext_aastha',
    creatorName: 'पावन आस्था',
    creatorUsername: '@pawanaastha',
    creatorAvatar: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=200&q=80',
    creatorCity: 'Darbhanga',
    title: 'महापर्व छठ पावन बेला — जय छठी मैया',
    description: 'श्रद्धा, भक्ति और समर्पण का महापर्व छठ। जय छठी मईया। #MahaparvChhath #ChhathiMaiya #Shorts',
    category: 'Devotional',
    tags: ['#MahaparvChhath', '#ChhathiMaiya', '#Bhakti', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=k8x7GFr5EQw',
    youtubeVideoId: 'k8x7GFr5EQw',
    channelTitle: 'पावन आस्था',
    externalSourceUrl: 'https://www.youtube.com/watch?v=k8x7GFr5EQw',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/k8x7GFr5EQw/hqdefault.jpg',
    videoDuration: '0:30',
    likesCount: 290000,
    commentsCount: 4700,
    sharesCount: 38000,
    savesCount: 25000,
    viewsCount: 6800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-24T14:20:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-7',
    creatorId: 'ext_tseries_bhakti',
    creatorName: 'टी-सीरीज भक्ति सागर',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'उग हे सुरुज देव — अनुराधा पौडवाल पावन अर्घ्य भजन 🌅',
    description: 'अनुराधा पौडवाल जी की अमृत वाणी में पावन उषा अर्घ्य दर्शन। #AnuradhaPaudwal #UshaArghya #ChhathGhat #Shorts',
    category: 'Usha Arghya',
    tags: ['#AnuradhaPaudwal', '#UshaArghya', '#ChhathGhat', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=xi-hTKJeLag',
    youtubeVideoId: 'xi-hTKJeLag',
    channelTitle: 'टी-सीरीज भक्ति सागर',
    externalSourceUrl: 'https://www.youtube.com/watch?v=xi-hTKJeLag',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/xi-hTKJeLag/hqdefault.jpg',
    videoDuration: '0:48',
    likesCount: 420000,
    commentsCount: 8900,
    sharesCount: 78000,
    savesCount: 45000,
    viewsCount: 12500000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-26T06:15:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-top-8',
    creatorId: 'ext_chhathbela',
    creatorName: 'छठ पावन बेला',
    creatorUsername: '@chhathbela',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Ranchi',
    title: 'छठ पूजा पावन बधाई व सूर्य नमस्कार दर्शन',
    description: 'आप सभी को लोक आस्था के महापर्व छठ की हार्दिक शुभकामनाएं। जय छठी मईया! #ChhathStatus #ChhathPuja #Shorts',
    category: 'Devotional',
    tags: ['#ChhathStatus', '#SuryaNamaskar', '#ChhathPuja', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=0ShqFMLUgtw',
    youtubeVideoId: '0ShqFMLUgtw',
    channelTitle: 'छठ पावन बेला',
    externalSourceUrl: 'https://www.youtube.com/watch?v=0ShqFMLUgtw',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/0ShqFMLUgtw/hqdefault.jpg',
    videoDuration: '0:32',
    likesCount: 340000,
    commentsCount: 5700,
    sharesCount: 46000,
    savesCount: 29000,
    viewsCount: 9100000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-28T17:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-1',
    creatorId: 'ext_sanskriti',
    creatorName: 'संस्कृति दर्शन',
    creatorUsername: '@sanskrithidharshan',
    creatorAvatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80',
    creatorCity: 'Buxar',
    title: 'छठ महापर्व — आस्था और पवित्रता का महाकुंभ',
    description: 'छठ केवल पर्व नहीं, बिहार और पूर्वांचल की आत्मा है। जय छठी मैया। #ChhathMahaparv #Aastha #Shorts',
    category: 'Puja Preparation',
    tags: ['#ChhathMahaparv', '#Aastha', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=2QFWCKQjRdM',
    youtubeVideoId: '2QFWCKQjRdM',
    channelTitle: 'संस्कृति दर्शन',
    externalSourceUrl: 'https://www.youtube.com/watch?v=2QFWCKQjRdM',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/2QFWCKQjRdM/hqdefault.jpg',
    videoDuration: '0:35',
    likesCount: 184000,
    commentsCount: 3400,
    sharesCount: 21500,
    savesCount: 14200,
    viewsCount: 4800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-01T10:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-2',
    creatorId: 'ext_bhaktisadhana',
    creatorName: 'भक्ति संगीत साधना',
    creatorUsername: '@bhaktisadhana',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Samastipur',
    title: 'हे छठी मईया सुन लीं पुकार — पावन अर्घ्य बेला',
    description: 'हे छठी मईया सुन लीं पुकार, पूरी कर दीं मनोकामना। #ChhathiMaiya #ArghyaBela #Shorts',
    category: 'Devotional',
    tags: ['#ChhathiMaiya', '#ArghyaBela', '#Chhath', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=WU5WHnp-A4g',
    youtubeVideoId: 'WU5WHnp-A4g',
    channelTitle: 'भक्ति संगीत साधना',
    externalSourceUrl: 'https://www.youtube.com/watch?v=WU5WHnp-A4g',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/WU5WHnp-A4g/hqdefault.jpg',
    videoDuration: '0:38',
    likesCount: 158000,
    commentsCount: 3000,
    sharesCount: 18900,
    savesCount: 12800,
    viewsCount: 4200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-02T11:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-3',
    creatorId: 'ext_deenanath',
    creatorName: 'टी-सीरीज भक्ति सागर',
    creatorUsername: '@tseries_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Varanasi',
    title: 'हो दीनानाथ — पावन सूर्य उपासना व छठ लोकगीत',
    description: 'हो दीनानाथ, हमहूं अरघिया देब सुरुज देव के। पावन पारंपरिक छठ गीत। #HoDeenanath #ChhathGeet #Shorts',
    category: 'Chhath Geet',
    tags: ['#HoDeenanath', '#ChhathGeet', '#SuryaDev', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=Y3D2eHsrKdU',
    youtubeVideoId: 'Y3D2eHsrKdU',
    channelTitle: 'टी-सीरीज भक्ति सागर',
    externalSourceUrl: 'https://www.youtube.com/watch?v=Y3D2eHsrKdU',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/Y3D2eHsrKdU/hqdefault.jpg',
    videoDuration: '0:38',
    likesCount: 245000,
    commentsCount: 4200,
    sharesCount: 31000,
    savesCount: 22000,
    viewsCount: 7800000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-03T10:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-4',
    creatorId: 'ext_anuradha',
    creatorName: 'अनुराधा पौडवाल भक्ति',
    creatorUsername: '@anuradha_bhakti',
    creatorAvatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=80',
    creatorCity: 'Patna',
    title: 'अनुराधा पौडवाल छठ अमृत भजन — कांच ही बांस के बहंगिया',
    description: 'कांच ही बांस के बहंगिया, बहंगी लचकत जाए। अनुराधा पौडवाल जी के पावन स्वर। #AnuradhaPaudwal #ChhathBhakti #Shorts',
    category: 'Chhath Geet',
    tags: ['#AnuradhaPaudwal', '#Bahangi', '#ChhathBhakti', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=izQSepgaL7E',
    youtubeVideoId: 'izQSepgaL7E',
    channelTitle: 'अनुराधा पौडवाल भक्ति',
    externalSourceUrl: 'https://www.youtube.com/watch?v=izQSepgaL7E',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/izQSepgaL7E/hqdefault.jpg',
    videoDuration: '0:42',
    likesCount: 210000,
    commentsCount: 3800,
    sharesCount: 27000,
    savesCount: 19500,
    viewsCount: 6900000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-04T11:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-5',
    creatorId: 'ext_sharda_sinha',
    creatorName: 'शारदा सिन्हा संगीत न्यास',
    creatorUsername: '@sharda_trust',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    creatorCity: 'Patna',
    title: 'शारदा सिन्हा अमर स्वर — पटना के घाट पर हमहूं अरघिया देब',
    description: 'बिहार कोकिला पद्मभूषण शारदा सिन्हा जी के अमर स्वरों में छठ वंदना। #ShardaSinha #ChhathMahaparv #PatnaGhat #Shorts',
    category: 'Chhath Geet',
    tags: ['#ShardaSinha', '#ChhathMahaparv', '#PatnaGhat', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=MV3ov6qxXqc',
    youtubeVideoId: 'MV3ov6qxXqc',
    channelTitle: 'शारदा सिन्हा संगीत न्यास',
    externalSourceUrl: 'https://www.youtube.com/watch?v=MV3ov6qxXqc',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/MV3ov6qxXqc/hqdefault.jpg',
    videoDuration: '0:48',
    likesCount: 380000,
    commentsCount: 7900,
    sharesCount: 52000,
    savesCount: 36000,
    viewsCount: 11200000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-05T12:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-6',
    creatorId: 'ext_darshan_ghat',
    creatorName: 'छठ पावन दर्शन',
    creatorUsername: '@chhath_darshan',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    creatorCity: 'Patna',
    title: 'छठ महापर्व भव्य दर्शन — गंगा जल और अस्ताचलगामी सूर्य',
    description: 'गंगा जल में खड़े होकर भगवान भास्कर को अर्घ्य समर्पण। अलौकिक भक्ति और शांति। #ChhathDarshan #SuryaArghya #Shorts',
    category: 'Sandhya Arghya',
    tags: ['#ChhathDarshan', '#SuryaArghya', '#GangaJal', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=Oj0sXD3OR8M',
    youtubeVideoId: 'Oj0sXD3OR8M',
    channelTitle: 'छठ पावन दर्शन',
    externalSourceUrl: 'https://www.youtube.com/watch?v=Oj0sXD3OR8M',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'hi',
    thumbnailUrl: 'https://i.ytimg.com/vi/Oj0sXD3OR8M/hqdefault.jpg',
    videoDuration: '0:40',
    likesCount: 189000,
    commentsCount: 3100,
    sharesCount: 22000,
    savesCount: 15800,
    viewsCount: 5400000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-06T15:00:00Z',
    aspectRatio: '9:16'
  },
  {
    id: 'ext-yt-short-7',
    creatorId: 'ext_aadit',
    creatorName: 'बिहार लोक संस्कृति',
    creatorUsername: '@bihar_lok_sanskriti',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    creatorCity: 'Gaya',
    title: 'आदित मनइला सुरुज देव — पारंपरिक सूप व अर्घ्य विधि',
    description: 'सूप और दौरा की पावन सजावट। भगवान सूर्य देव की पारंपरिक उपासना। #AaditManaila #ChhathPuja #BihariSanskriti #Shorts',
    category: 'Puja Preparation',
    tags: ['#AaditManaila', '#ChhathPuja', '#BihariSanskriti', '#Shorts'],
    videoUrl: 'https://www.youtube.com/watch?v=HnirJpqQKSU',
    youtubeVideoId: 'HnirJpqQKSU',
    channelTitle: 'बिहार लोक संस्कृति',
    externalSourceUrl: 'https://www.youtube.com/watch?v=HnirJpqQKSU',
    sourceType: 'YOUTUBE',
    isEmbeddable: true,
    contentLanguage: 'bho',
    thumbnailUrl: 'https://i.ytimg.com/vi/HnirJpqQKSU/hqdefault.jpg',
    videoDuration: '0:35',
    likesCount: 172000,
    commentsCount: 2800,
    sharesCount: 19800,
    savesCount: 14200,
    viewsCount: 4600000,
    privacy: 'public',
    status: 'approved',
    createdAt: '2026-09-07T16:00:00Z',
    aspectRatio: '9:16'
  }
];

export const CURATED_CHHATH_INSTAGRAM_REELS: DynamicReel[] = EXTERNAL_CHHATH_SEED_CATALOG.filter(r => r.sourceType === 'INSTAGRAM');

export const SEED_REELS: DynamicReel[] = EXTERNAL_CHHATH_SEED_CATALOG;

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
    try {
      [
        'chhath_reels_list', 'chhath_reels_list_v2', 'chhath_reels_list_v3', 
        'chhath_reels_list_v4', 'chhath_reels_list_v5', 'chhath_reels_list_v6',
        'chhath_reels_list_v7', 'chhath_reels_list_v8', 'chhath_reels_list_v9',
        'chhath_dynamic_reels', 'chhath_reels_external_catalog_v5'
      ].forEach(k => {
        localStorage.removeItem(k);
      });
    } catch {}

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
      // If cached data contains dummy sample videos, broken demo items, or old dummy mp4 files, purge them completely
      const hasOldVideos = parsed.some(r => 
        (r.videoUrl && (r.videoUrl.includes('/videos/sample') || r.videoUrl.includes('/videos/chhath_reel_') || r.videoUrl.includes('mixkit.co'))) ||
        r.id.startsWith('ig-chhath-') ||
        r.id.startsWith('demo-reel-')
      );
      if (hasOldVideos || parsed.length < SEED_REELS.length) {
        const userCreated = parsed.filter(r => 
          !r.videoUrl?.includes('/videos/sample') && 
          !r.videoUrl?.includes('/videos/chhath_reel_') && 
          !r.videoUrl?.includes('mixkit.co') && 
          !r.id.startsWith('demo-reel-') &&
          !r.id.startsWith('ig-chhath-')
        );
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
        const hasDummyVideos = parsed.some(p => 
          p.videoUrl?.includes('/videos/chhath_reel_') || 
          p.videoUrl?.includes('/videos/sample') || 
          p.videoUrl?.includes('mixkit.co')
        );
        const hasInstagram = parsed.some(p => p.sourceType === 'INSTAGRAM');
        if (!hasDummyVideos && hasInstagram) return parsed;
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

  recordImpression(userId: string, reelId: string, youtubeId?: string, watchSeconds?: number, instagramShortcode?: string) {
    const list = this.getImpressions(userId);
    const impression: UserContentImpression = {
      reelId,
      sourceType: instagramShortcode ? 'INSTAGRAM' : (youtubeId ? 'YOUTUBE' : 'FIRST_PARTY'),
      youtubeId,
      timestamp: Date.now(),
      watchSeconds
    };
    // Keep last 300 impressions for strict anti-repetition
    const updated = [impression, ...list].slice(0, 300);
    localStorage.setItem(`${KEYS.IMPRESSIONS}_${userId}`, JSON.stringify(updated));
  },

  getWatchedReelIds(userId?: string): Set<string> {
    const list = this.getImpressions(userId || 'guest');
    const set = new Set<string>();
    for (const item of list) {
      if (item.reelId) set.add(item.reelId);
      if (item.youtubeId) set.add(item.youtubeId);
    }
    return set;
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
  },

  getCachedInstagramReels(): Record<string, any> {
    const raw = localStorage.getItem(KEYS.INSTAGRAM_CACHE);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  setCachedInstagramReel(shortcode: string, reelData: any) {
    const cache = this.getCachedInstagramReels();
    cache[shortcode] = {
      ...reelData,
      lastCachedAt: Date.now()
    };
    localStorage.setItem(KEYS.INSTAGRAM_CACHE, JSON.stringify(cache));
  }
};
