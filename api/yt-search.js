/**
 * Vercel Serverless Function: /api/yt-search
 * Provides robust YouTube search for Chhath songs with:
 * 1. YouTube Data API v3 (if YOUTUBE_API_KEY environment variable is present)
 * 2. YouTube HTML scraper (zero API key required, live results)
 * 3. Verified Chhath catalog fallback (if offline or restricted)
 */

const FALLBACK_CHHATH_SONGS = [
  {
    youtubeId: "BsAFCc901MM",
    title: "पहिले पहिल हम कईनी छठी मईया - Sharda Sinha | Official Chhath Song",
    channelTitle: "Sharda Sinha Official",
    thumbnailUrl: "https://i.ytimg.com/vi/BsAFCc901MM/hqdefault.jpg",
    description: "शारदा सिन्हा का सबसे लोकप्रिय और पावन छठ गीत। पहिले पहिल हम कईनी।"
  },
  {
    youtubeId: "knZ8b5YnQiY",
    title: "केलवा के पात पर उगेलन सुरुज देव - Sharda Sinha | Chhath Geet",
    channelTitle: "T-Series Bhakti Sagar",
    thumbnailUrl: "https://i.ytimg.com/vi/knZ8b5YnQiY/hqdefault.jpg",
    description: "भगवान भुवन भास्कर सूर्य देव की उपासना का पावन पारंपरिक छठ गीत।"
  },
  {
    youtubeId: "Eyq7vfxu4iA",
    title: "काँच ही बाँस के बहंगिया - Anuradha Paudwal | Bhojpuri Chhath Geet",
    channelTitle: "T-Series Hamaar Bhojpuri",
    thumbnailUrl: "https://i.ytimg.com/vi/Eyq7vfxu4iA/hqdefault.jpg",
    description: "काँच ही बाँस के बहंगिया, बहंगी लचकत जाए। अनुराधा पौडवाल।"
  },
  {
    youtubeId: "BKoD7bTLc2k",
    title: "जोड़े जोड़े फलवा सुरूज देव - Pawan Singh | Chhath Puja Song",
    channelTitle: "T-Series Hamaar Bhojpuri",
    thumbnailUrl: "https://i.ytimg.com/vi/BKoD7bTLc2k/hqdefault.jpg",
    description: "पवन सिंह का सुपरहिट छठ गीत जोड़े जोड़े फलवा सुरूज देव।"
  },
  {
    youtubeId: "z3TKq9LVbzM",
    title: "उगी सुरुज देव अरघ के बेर - Pawan Singh | Chhath Geet",
    channelTitle: "Wave Music",
    thumbnailUrl: "https://i.ytimg.com/vi/z3TKq9LVbzM/hqdefault.jpg",
    description: "उगी सुरुज देव भईल अरघ के बेर - पवन सिंह।"
  },
  {
    youtubeId: "vSJO-AElAog",
    title: "उग हो सुरुज देव अरघ के बेरा - Maithili Thakur | Maithili Chhath Geet",
    channelTitle: "Maithili Thakur Official",
    thumbnailUrl: "https://i.ytimg.com/vi/vSJO-AElAog/hqdefault.jpg",
    description: "मैथिली ठाकुर द्वारा गाया गया पारंपरिक छठ गीत।"
  },
  {
    youtubeId: "fwX2g9jjo1o",
    title: "सोना सातकुनिया हो दीनानाथ - Maithili Thakur | Chhath Geet",
    channelTitle: "Maithili Thakur Official",
    thumbnailUrl: "https://i.ytimg.com/vi/fwX2g9jjo1o/hqdefault.jpg",
    description: "सोना सातकुनिया हो दीनानाथ, अरघ देबई हम साँझ-भोरहरिया।"
  },
  {
    youtubeId: "fCuHD3YBQKY",
    title: "छठ घाटे चली - Khesari Lal Yadav, Antra Singh | Bhojpuri Chhath Song",
    channelTitle: "Aadishakti Films",
    thumbnailUrl: "https://i.ytimg.com/vi/fCuHD3YBQKY/hqdefault.jpg",
    description: "खेसारी लाल यादव और अंतरा सिंह प्रियंका का प्रसिद्ध छठ गीत।"
  },
  {
    youtubeId: "4HDtMYW2OEA",
    title: "उगी हे दीनानाथ - Kalpana Patowary | Superhit Chhath Geet",
    channelTitle: "URGENT MUSIC",
    thumbnailUrl: "https://i.ytimg.com/vi/4HDtMYW2OEA/hqdefault.jpg",
    description: "कल्पना पटवारी का प्रसिद्ध छठ गीत - उगी हे दीनानाथ।"
  },
  {
    youtubeId: "UwqtDSb0pLI",
    title: "कार्तिक मास इजोरिया छठी माई - Sharda Sinha | Chhath Mahaparv",
    channelTitle: "T-Series Bhakti Sagar",
    thumbnailUrl: "https://i.ytimg.com/vi/UwqtDSb0pLI/hqdefault.jpg",
    description: "कार्तिक मास इजोरिया छठी माई - शारदा सिन्हा।"
  }
];

export default async function handler(req, res) {
  // Set open CORS headers
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
      res.end(JSON.stringify({ results: [], nextPageToken: null, isLiveApi: true }));
      return;
    }

    // Tier 1: If YouTube API Key is available in environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&type=video&q=${encodeURIComponent(
          q
        )}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&key=${encodeURIComponent(apiKey)}`;

        const ytRes = await fetch(ytUrl);
        if (ytRes.ok) {
          const data = await ytRes.json();
          const items = (data.items || []).map((item) => ({
            youtubeId: item.id?.videoId || '',
            id: item.id?.videoId || '',
            title: item.snippet?.title || '',
            channelTitle: item.snippet?.channelTitle || '',
            singer: item.snippet?.channelTitle || '',
            thumbnailUrl:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              `https://img.youtube.com/vi/${item.id?.videoId}/hqdefault.jpg`,
            thumbnail:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              `https://img.youtube.com/vi/${item.id?.videoId}/hqdefault.jpg`,
            description: item.snippet?.description || ''
          })).filter((v) => Boolean(v.youtubeId));

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              results: items,
              items,
              nextPageToken: data.nextPageToken || null,
              totalResults: data.pageInfo?.totalResults || items.length,
              isLiveApi: true
            })
          );
          return;
        }
      } catch (apiErr) {
        console.warn('YouTube API call failed, falling back to scraper:', apiErr);
      }
    }

    // Tier 2: YouTube HTML Search Scraper (Fast, free, zero API key)
    try {
      const response = await fetch(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'hi,en-US;q=0.9,en;q=0.8'
          }
        }
      );

      if (response.ok) {
        const html = await response.text();
        const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
        if (match) {
          const data = JSON.parse(match[1]);
          const contents =
            data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
          const itemSection = contents?.find((c) => c.itemSectionRenderer)?.itemSectionRenderer?.contents;
          const videos = [];

          for (const item of itemSection || []) {
            if (item.videoRenderer) {
              const v = item.videoRenderer;
              if (v.videoId) {
                const vidTitle = v.title?.runs?.[0]?.text || '';
                const channel = v.ownerText?.runs?.[0]?.text || 'YouTube Channel';
                const thumb =
                  v.thumbnail?.thumbnails?.[0]?.url ||
                  `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`;
                videos.push({
                  youtubeId: v.videoId,
                  id: v.videoId,
                  title: vidTitle,
                  channelTitle: channel,
                  singer: channel,
                  thumbnailUrl: thumb,
                  thumbnail: thumb,
                  description: v.detailedMetadataSnippets?.[0]?.snippetText?.runs?.[0]?.text || ''
                });
              }
            }
          }

          if (videos.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                results: videos.slice(0, 18),
                items: videos.slice(0, 18),
                nextPageToken: null,
                totalResults: videos.length,
                isLiveApi: true
              })
            );
            return;
          }
        }
      }
    } catch (scraperErr) {
      console.warn('Scraper failed, using verified fallback:', scraperErr);
    }

    // Tier 3: Verified Chhath Songs Fallback
    const lowerQ = q.toLowerCase();
    const matched = FALLBACK_CHHATH_SONGS.filter((s) => {
      return (
        s.title.toLowerCase().includes(lowerQ) ||
        s.channelTitle.toLowerCase().includes(lowerQ) ||
        (s.description && s.description.toLowerCase().includes(lowerQ))
      );
    });

    const fallbackResults = matched.length > 0 ? matched : FALLBACK_CHHATH_SONGS;
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        results: fallbackResults,
        items: fallbackResults,
        nextPageToken: null,
        totalResults: fallbackResults.length,
        isLiveApi: false
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        results: FALLBACK_CHHATH_SONGS.slice(0, 8),
        items: FALLBACK_CHHATH_SONGS.slice(0, 8),
        nextPageToken: null,
        isLiveApi: false,
        error: err.message
      })
    );
  }
}
