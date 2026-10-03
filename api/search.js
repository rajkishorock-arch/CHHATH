/**
 * Vercel Serverless Function: /api/search
 * Handles global search queries for Chhath media, videos, rituals, and recipes.
 */

const FALLBACK_MEDIA_CATALOG = [
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    let q = '';
    let pageToken = '';

    if (req.query && typeof req.query.q === 'string') {
      q = req.query.q.trim();
      pageToken = req.query.pageToken || '';
    } else {
      const urlObj = new URL(req.url || '', 'http://localhost');
      q = (urlObj.searchParams.get('q') || '').trim();
      pageToken = urlObj.searchParams.get('pageToken') || '';
    }

    if (!q) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ source: 'youtube', available: true, results: [] }));
      return;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&videoEmbeddable=true&q=${encodeURIComponent(
          q
        )}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&key=${encodeURIComponent(apiKey)}`;

        const ytRes = await fetch(ytUrl);
        if (ytRes.ok) {
          const data = await ytRes.json();
          const items = (data.items || [])
            .filter((item) => item.id && item.id.videoId)
            .map((item) => ({
              videoId: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail:
                item.snippet.thumbnails?.high?.url ||
                item.snippet.thumbnails?.medium?.url ||
                `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              source: 'youtube',
              available: true,
              results: items,
              nextPageToken: data.nextPageToken
            })
          );
          return;
        }
      } catch (e) {
        console.warn('Official search failed, falling back:', e);
      }
    }

    // Fallback: match catalog
    const lowerQ = q.toLowerCase();
    const matched = FALLBACK_MEDIA_CATALOG.filter((item) => {
      const matchTag = item.tags.some((t) => lowerQ.includes(t) || t.includes(lowerQ));
      const matchTitle = item.title.toLowerCase().includes(lowerQ);
      const matchDesc = item.description.toLowerCase().includes(lowerQ);
      return matchTag || matchTitle || matchDesc;
    });

    const fallbackResults = (matched.length > 0 ? matched : FALLBACK_MEDIA_CATALOG).map((item) => ({
      videoId: item.videoId,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
      channelTitle: item.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.videoId}`
    }));

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        source: 'youtube',
        available: true,
        fallbackMode: true,
        results: fallbackResults,
        nextPageToken: undefined
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        source: 'youtube',
        available: false,
        error: err.message,
        results: []
      })
    );
  }
}
