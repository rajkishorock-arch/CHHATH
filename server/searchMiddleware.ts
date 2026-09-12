import type { IncomingMessage, ServerResponse } from 'http';

interface CachedEntry {
  results: any[];
  nextPageToken?: string;
  timestamp: number;
}

// In-memory cache for popular external searches (TTL: 1 hour) (#27)
const cache = new Map<string, CachedEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;

// Curated verified embeddable Chhath video dataset for fallback (#18, #29)
const VERIFIED_FALLBACK_CATALOG = [
  {
    videoId: "fOVGz9WFymU",
    title: "काँच ही बाँस के बहँगिया - Sharda Sinha | Bhojpuri Chhath Geet",
    description: "पारंपरिक छठ महापर्व का सबसे पावन और अमर गीत। शारदा सिन्हा के स्वर में बहँगी की महिमा।",
    thumbnail: "https://img.youtube.com/vi/fOVGz9WFymU/hqdefault.jpg",
    channelTitle: "T-Series Hamaar Bhojpuri",
    category: "Traditional",
    tags: ["chhath geet", "sharda sinha", "sad song", "bahangi", "traditional"]
  },
  {
    videoId: "UwqtDSb0pLI",
    title: "केलवा के पात पर उगेलन सुरुज देव - Sharda Sinha | Chhath Geet",
    description: "भगवान भुवन भास्कर सूर्य देव की उपासना का पावन पारंपरिक छठ गीत।",
    thumbnail: "https://img.youtube.com/vi/UwqtDSb0pLI/hqdefault.jpg",
    channelTitle: "T-Series Bhakti Sagar",
    category: "Surya Dev",
    tags: ["surya dev", "kelwa ke paat", "arghya", "sharda sinha", "geet"]
  },
  {
    videoId: "BsAFCc901MM",
    title: "पहिले पहिल हम कईनी छठी मईया - Sharda Sinha Emotional Chhath Song",
    description: "छठी मईया की महिमा और पहली बार व्रत करने वाली व्रती के भावुक हृदय का अमर गीत।",
    thumbnail: "https://img.youtube.com/vi/BsAFCc901MM/hqdefault.jpg",
    channelTitle: "Sharda Sinha Official",
    category: "Bhojpuri",
    tags: ["pahile pahil", "sad song", "emotional", "chhath geet", "maiya"]
  },
  {
    videoId: "fwX2g9jjo1o",
    title: "कांचहि बांस के सुपलिया - Maithili Thakur | Maithili Chhath Geet",
    description: "मैथिली ठाकुर के सुमधुर कंठ में मिथिला की पावन परंपरा और सूप-दउरा की महिमा।",
    thumbnail: "https://img.youtube.com/vi/fwX2g9jjo1o/hqdefault.jpg",
    channelTitle: "Maithili Thakur Official",
    category: "Maithili",
    tags: ["maithili", "maithili thakur", "supaliya", "geet", "arghya"]
  },
  {
    videoId: "fqlh99htTJA",
    title: "उ जे केरवा जे फरेला घवद से - Anuradha Paudwal | Chhath Bhajan",
    description: "सुगा और केले के घवद की प्रसिद्ध पौराणिक कथा पर आधारित पावन छठ गीत।",
    thumbnail: "https://img.youtube.com/vi/fqlh99htTJA/hqdefault.jpg",
    channelTitle: "T-Series Bhakti",
    category: "Bhajan",
    tags: ["anuradha paudwal", "kerwa", "ghavad", "bhajan", "chhath"]
  },
  {
    videoId: "yqK8qF8_Mco",
    title: "छठ पूजा विशेष खस्ता ठेकुआ रेसिपी (Traditional Bihari Thekua Recipe)",
    description: "गेहूं के आटे, शुद्ध देशी घी और गुड़ से बनने वाले छठ महाप्रसाद ठेकुआ की पारंपरिक विधि।",
    thumbnail: "https://img.youtube.com/vi/yqK8qF8_Mco/hqdefault.jpg",
    channelTitle: "Bihari Swad Rasoi",
    category: "Recipe",
    tags: ["thekua", "recipe", "thekua recipe", "bihari thekua", "prasad", "khasta"]
  },
  {
    videoId: "9H2q61hB0gA",
    title: "छठ पूजा संध्या अर्घ्य एवं उषा अर्घ्य सम्पूर्ण विधि व नियम (Arghya Vidhi)",
    description: "अस्ताचलगामी और उदीयमान सूर्य को सूप और दूध-जल से अर्घ्य देने की वैदिक व शास्त्रीय विधि।",
    thumbnail: "https://img.youtube.com/vi/9H2q61hB0gA/hqdefault.jpg",
    channelTitle: "Dharma Chhath Live",
    category: "Puja",
    tags: ["arghya", "sandhya arghya", "usha arghya", "vidhi", "timing", "niyam"]
  },
  {
    videoId: "M7lc1UVf-VE",
    title: "पटना गंगा घाट पर छठ महापर्व का अलौकिक दृश्य (Patna Ghat Arghya Darshan)",
    description: "गांधी घाट और कलेक्ट्रेट घाट पर लाखों श्रद्धालुओं का भक्तिमय अर्घ्य दर्शन।",
    thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg",
    channelTitle: "Bihar Tourism",
    category: "Ghat",
    tags: ["ghat", "patna", "ganga", "darshan", "video"]
  }
];

export async function handleSearchApiRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const urlObj = new URL(req.url || '', 'http://localhost:5173');
    const q = (urlObj.searchParams.get('q') || '').trim();
    const pageToken = urlObj.searchParams.get('pageToken') || '';
    const maxResults = parseInt(urlObj.searchParams.get('maxResults') || '10', 10);

    if (!q) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        source: 'youtube',
        available: true,
        results: [],
        message: 'Empty query'
      }));
      return;
    }

    const cacheKey = `${q.toLowerCase()}__${pageToken}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        source: 'youtube',
        available: true,
        cached: true,
        results: cached.results,
        nextPageToken: cached.nextPageToken
      }));
      return;
    }

    // Read secret API key strictly on server-side (#21)
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      // Official YouTube Data API search.list endpoint (#6 & #7)
      const ytUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      ytUrl.searchParams.set('part', 'snippet');
      ytUrl.searchParams.set('type', 'video');
      ytUrl.searchParams.set('videoEmbeddable', 'true');
      ytUrl.searchParams.set('videoSyndicated', 'true');
      ytUrl.searchParams.set('maxResults', String(Math.min(maxResults, 15)));
      ytUrl.searchParams.set('q', q);
      ytUrl.searchParams.set('key', apiKey);
      if (pageToken) {
        ytUrl.searchParams.set('pageToken', pageToken);
      }

      const response = await fetch(ytUrl.toString(), {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data: any = await response.json();
        const items = data.items || [];
        const results = items
          .filter((item: any) => item.id && item.id.videoId)
          .map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.high?.url || 
                       item.snippet.thumbnails?.medium?.url || 
                       item.snippet.thumbnails?.default?.url || 
                       `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`
          }));

        cache.set(cacheKey, {
          results,
          nextPageToken: data.nextPageToken,
          timestamp: Date.now()
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          source: 'youtube',
          available: true,
          results,
          nextPageToken: data.nextPageToken
        }));
        return;
      }
    }

    // Fallback: When API key is not set or network quota exceeded (#29)
    // Use verified embeddable catalog matched against expanded query terms
    const lowerQ = q.toLowerCase();
    const matched = VERIFIED_FALLBACK_CATALOG.filter(item => {
      const matchTag = item.tags.some(t => lowerQ.includes(t) || t.includes(lowerQ));
      const matchTitle = item.title.toLowerCase().includes(lowerQ);
      const matchDesc = item.description.toLowerCase().includes(lowerQ);
      return matchTag || matchTitle || matchDesc;
    });

    const fallbackResults = matched.length > 0 ? matched : VERIFIED_FALLBACK_CATALOG.slice(0, 4);

    cache.set(cacheKey, {
      results: fallbackResults,
      nextPageToken: undefined,
      timestamp: Date.now()
    });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      source: 'youtube',
      available: true,
      fallbackMode: true,
      results: fallbackResults,
      nextPageToken: undefined
    }));

  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      source: 'youtube',
      available: false,
      error: err.message || 'External search unavailable',
      results: []
    }));
  }
}
