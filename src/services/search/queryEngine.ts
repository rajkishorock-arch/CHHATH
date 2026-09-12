import { SearchIntent, QueryAnalysis } from './types';

// Clearly unrelated terms that should not pollute the Chhath Mahaparv experience
const UNRELATED_KEYWORDS = [
  'football', 'soccer', 'cricket', 'ipl', 'fifa', 'nba', 'tennis', 'hockey',
  'messi', 'ronaldo', 'virat kohli', 'dhoni', 'rohit sharma',
  'iphone', 'android phone', 'samsung galaxy', 'macbook', 'laptop review',
  'crypto', 'bitcoin', 'ethereum', 'stock market', 'forex', 'trading',
  'pubg', 'fortnite', 'call of duty', 'gta', 'free fire', 'playstation', 'xbox',
  'hollywood movie', 'marvel', 'dc comics', 'avengers', 'anime', 'naruto'
];

// Cultural keywords that strongly indicate Chhath relevance
const CHHATH_CULTURAL_KEYWORDS = [
  'chhath', 'chhat', 'chhathi', 'chhathipuja', 'maiya', 'surya', 'suryadev', 'dinanath',
  'aditya', 'bhaskar', 'ravidev', 'arghya', 'argh', 'argha', 'sandhya', 'usha', 'bhor',
  'thekua', 'kharna', 'nahay', 'khay', 'rasiyaw', 'kheer', 'kasar', 'pirukiya', 'prasad',
  'daura', 'soop', 'supaliya', 'bahangi', 'kanch', 'bans', 'kerwa', 'kelwa', 'ghavad',
  'ghat', 'ganga', 'patna', 'bihar', 'mithila', 'bhojpur', 'magadh', 'purvanchal',
  'sharda', 'sinha', 'anuradha', 'paudwal', 'maithili', 'thakur', 'khesari', 'pawan',
  'kalpana', 'geet', 'bhajan', 'aarti', 'mantra', 'vrat', 'katha', 'vrati', 'parv',
  'mahaparv', 'puja', 'vidhi', 'samagri', 'sindoor', 'diya', 'chulha', 'song', 'reel',
  'devotional', 'bhakti', 'fasting', 'chhati', 'mayi'
];

export class QueryEngine {
  /**
   * Analyze raw search query to determine intent, relevance, language, and expansions
   */
  static analyze(rawQuery: string, userLanguage?: string): QueryAnalysis {
    const cleanQuery = (rawQuery || '').trim();
    const lower = cleanQuery.toLowerCase();

    // 1. Detect Username Query (@rahul, @sonu, etc.)
    const isUsernameQuery = lower.startsWith('@') || (lower.startsWith('u/') || lower.startsWith('user/'));
    let targetUsername: string | undefined = undefined;
    if (isUsernameQuery) {
      targetUsername = lower.replace(/^(@|u\/|user\/)/, '').trim();
    }

    // 2. Detect Intent
    const intent = this.detectIntent(lower, isUsernameQuery);

    // 3. Check Chhath Relevance
    const isChhathRelevant = this.checkChhathRelevance(lower);

    // 4. Detect Language
    let detectedLanguage: 'bho' | 'mai' | 'hi' | 'en' | undefined = undefined;
    if (lower.includes('bhojpuri') || lower.includes('भोजपुरी')) detectedLanguage = 'bho';
    else if (lower.includes('maithili') || lower.includes('मैथिली')) detectedLanguage = 'mai';
    else if (/[\u0900-\u097F]/.test(lower)) detectedLanguage = 'hi';
    else detectedLanguage = 'en';

    // 5. Generate Chhath-Aware Expanded Queries
    const expandedQueries = this.generateExpansions(cleanQuery, lower, intent, isChhathRelevant, userLanguage);

    return {
      rawQuery,
      cleanQuery,
      intent,
      isUsernameQuery,
      targetUsername,
      isChhathRelevant,
      expandedQueries,
      detectedLanguage
    };
  }

  /**
   * Determine query intent
   */
  private static detectIntent(lower: string, isUsernameQuery: boolean): SearchIntent {
    if (isUsernameQuery) return 'USER';
    if (lower.startsWith('#')) return 'HASHTAG';

    // Recipe / Prasad Intent
    if (
      lower.includes('thekua') || lower.includes('ठेकुआ') ||
      lower.includes('recipe') || lower.includes('रेसिपी') ||
      lower.includes('prasad') || lower.includes('प्रसाद') ||
      lower.includes('kharna') || lower.includes('खरना') ||
      lower.includes('rasiyaw') || lower.includes('रसियाव') ||
      lower.includes('kasar') || lower.includes('कसार') ||
      lower.includes('banane') || lower.includes('बनाने')
    ) {
      return 'RECIPE';
    }

    // Ghat Intent
    if (
      lower.includes('ghat') || lower.includes('घाट') ||
      lower.includes('ganga') || lower.includes('गंगा') ||
      lower.includes('patna') || lower.includes('वाराणसी') ||
      lower.includes('varanasi') || lower.includes('river')
    ) {
      return 'GHAT';
    }

    // Puja / Mantra / Timing Intent
    if (
      lower.includes('arghya') || lower.includes('अर्घ्य') ||
      lower.includes('mantra') || lower.includes('मंत्र') ||
      lower.includes('aarti') || lower.includes('आरती') ||
      lower.includes('timing') || lower.includes('समय') ||
      lower.includes('samagri') || lower.includes('सामग्री') ||
      lower.includes('vidhi') || lower.includes('विधि') ||
      lower.includes('muhurat') || lower.includes('मुहूर्त')
    ) {
      return 'PUJA';
    }

    // Article / Story Intent
    if (
      lower.includes('katha') || lower.includes('कथा') ||
      lower.includes('story') || lower.includes('कहानी') ||
      lower.includes('itihas') || lower.includes('history') ||
      lower.includes('blog') || lower.includes('लेख') ||
      lower.includes('significance') || lower.includes('महत्व')
    ) {
      return 'ARTICLE';
    }

    // Reel Intent
    if (
      lower.includes('reel') || lower.includes('रील्स') ||
      lower.includes('short') || lower.includes('shorts')
    ) {
      return 'REEL';
    }

    // Video Intent
    if (
      lower.includes('video') || lower.includes('वीडियो') ||
      lower.includes('youtube') || lower.includes('watch')
    ) {
      return 'VIDEO';
    }

    // Song Intent
    if (
      lower.includes('song') || lower.includes('geet') || lower.includes('गीत') ||
      lower.includes('bhajan') || lower.includes('भजन') || lower.includes('gaana') ||
      lower.includes('gana') || lower.includes('music') || lower.includes('audio') ||
      lower.includes('sharda') || lower.includes('anuradha') || lower.includes('singer') ||
      lower.includes('sad') || lower.includes('emotional') || lower.includes('traditional')
    ) {
      return 'SONG';
    }

    // Specific Chhath Intent
    if (
      lower.includes('chhath') || lower.includes('छठ') ||
      lower.includes('chhathi') || lower.includes('छठी') ||
      lower.includes('surya') || lower.includes('सूर्य')
    ) {
      return 'CHHATH';
    }

    return 'GENERAL';
  }

  /**
   * Check if query is relevant to Chhath Mahaparv & cultural domain
   */
  static checkChhathRelevance(lower: string): boolean {
    // 1. Explicitly unrelated query check (e.g., "football", "iphone")
    const isUnrelated = UNRELATED_KEYWORDS.some(u => {
      const regex = new RegExp(`\\b${u}\\b`, 'i');
      return regex.test(lower);
    });

    if (isUnrelated) {
      // Unless they also explicitly specified "chhath", flag as irrelevant
      if (!lower.includes('chhath') && !lower.includes('छठ') && !lower.includes('maiya')) {
        return false;
      }
    }

    // 2. Single or two-letter queries that aren't devotional
    if (lower.length <= 2 && !['ॐ', 'छठ'].includes(lower)) {
      return false;
    }

    // 3. Always relevant if username query or has hashtag
    if (lower.startsWith('@') || lower.startsWith('#')) {
      return true;
    }

    // 4. Cultural terms match
    const hasCulturalTerm = CHHATH_CULTURAL_KEYWORDS.some(k => lower.includes(k));
    if (hasCulturalTerm) return true;

    // 5. Generic terms when searched inside Chhath app (like "sad song", "recipe", "morning prayer", "sunrise")
    const genericAllowed = [
      'sad song', 'song', 'geet', 'bhajan', 'recipe', 'prasad', 'sunrise', 'sunset',
      'morning', 'evening', 'river', 'water', 'sun', 'prayer', 'devotion', 'dance', 'festive'
    ];
    if (genericAllowed.some(g => lower.includes(g))) {
      return true;
    }

    // If query has at least 3 characters and is a Hindi/Devanagari script query, treat as potential match
    if (/[\u0900-\u097F]/.test(lower)) {
      return true;
    }

    // Otherwise, if unknown English term not related to Chhath (like "messi", "car engine"), reject
    return false;
  }

  /**
   * Chhath-aware Query Expansion Engine
   */
  private static generateExpansions(
    cleanQuery: string,
    lower: string,
    intent: SearchIntent,
    isChhathRelevant: boolean,
    userLanguage?: string
  ): string[] {
    if (!isChhathRelevant) return [];

    const expansions: string[] = [];
    const langModifier = userLanguage === 'mai' ? 'Maithili' : userLanguage === 'bho' ? 'Bhojpuri' : '';

    // Handle "sad song" / emotional query expansion (#8)
    if (lower.includes('sad song') || lower.includes('emotional song') || lower.includes('sad geet')) {
      expansions.push('sad Chhath song');
      expansions.push('Bhojpuri Chhath sad song');
      expansions.push('Chhathi Maiya emotional song Sharda Sinha');
      expansions.push('Chhath devotional emotional song');
      return expansions;
    }

    // Handle "thekua" recipe expansion (#10)
    if (lower.includes('thekua') || lower.includes('ठेकुआ')) {
      expansions.push('Thekua Recipe');
      expansions.push('Chhath Thekua Recipe');
      expansions.push('Bihari Thekua Recipe');
      expansions.push('Khasta Thekua vidhi');
      return expansions;
    }

    // Handle "arghya" expansion (#11)
    if (lower.includes('arghya') || lower.includes('अर्घ्य')) {
      expansions.push('Chhath Sandhya Arghya');
      expansions.push('Chhath Usha Arghya');
      expansions.push('Chhath Arghya Vidhi');
      expansions.push('Surya Dev Arghya Mantra');
      return expansions;
    }

    // Handle "chhath geet" / song query (#9)
    if (lower.includes('chhath geet') || lower.includes('छठ गीत') || intent === 'SONG') {
      expansions.push('Chhath Geet');
      if (langModifier) expansions.push(`${langModifier} Chhath Geet`);
      expansions.push('Bhojpuri Chhath Geet Sharda Sinha');
      expansions.push('Traditional Chhath Geet');
      expansions.push('Chhathi Maiya Geet');
      return expansions;
    }

    // Handle "kharna"
    if (lower.includes('kharna') || lower.includes('खरना')) {
      expansions.push('Chhath Kharna Vidhi');
      expansions.push('Kharna Rasiyaw Kheer Recipe');
      expansions.push('Kharna Puja Niyam');
      return expansions;
    }

    // Handle "ghat"
    if (lower.includes('ghat') || lower.includes('घाट')) {
      expansions.push('Chhath Ghat Patna Ganga');
      expansions.push('Chhath Ghat Arghya Darshan');
      expansions.push('Chhath Puja Ghat decoration');
      return expansions;
    }

    // Username not found expansion helper
    if (lower.startsWith('@')) {
      const name = lower.replace('@', '').trim();
      expansions.push(`${name} chhath`);
      expansions.push(`${name} chhath geet`);
      expansions.push(`${name} chhath reel`);
      return expansions;
    }

    // Default contextual expansion
    if (!lower.includes('chhath') && !lower.includes('छठ')) {
      expansions.push(`${cleanQuery} Chhath Puja`);
      expansions.push(`${cleanQuery} Chhath Geet`);
    } else {
      expansions.push(cleanQuery);
    }

    return expansions;
  }

  /**
   * Generate fallback queries when a username is not found (#4)
   */
  static getUsernameFallbackQueries(username: string): string[] {
    const cleanName = username.replace(/^@/, '').trim();
    return [
      `${cleanName} chhath`,
      `${cleanName} chhath geet`,
      `${cleanName} chhath reel`,
      `${cleanName} Chhath Puja video`
    ];
  }
}
