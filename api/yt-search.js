/**
 * Vercel Serverless Function: /api/yt-search
 * Provides robust real-time YouTube search for Chhath songs and reels:
 * 1. YouTube Data API v3 (if YOUTUBE_API_KEY environment variable is present)
 * 2. YouTube InnerTube Web API (Official, zero API key required, fast, real-time live data)
 * 3. YouTube HTML Search Scraper
 * 4. Verified fallback catalog
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
    let type = 'video'; // 'video' for full landscape songs, 'shorts' for reels

    if (req.query && typeof req.query.q === 'string') {
      q = req.query.q.trim();
      pageToken = req.query.pageToken || '';
      type = (req.query.type || 'video').toLowerCase();
    } else {
      const urlObj = new URL(req.url || '', 'http://localhost');
      q = (urlObj.searchParams.get('q') || '').trim();
      pageToken = urlObj.searchParams.get('pageToken') || '';
      type = (urlObj.searchParams.get('type') || 'video').toLowerCase();
    }

    if (!q) {
      q = type === 'shorts' ? 'chhath puja viral reel #shorts' : 'chhath geet trending 2026';
    }

    // Tier 1: YouTube InnerTube API (Real-time live Google search directly, zero API key)
    try {
      const bodyPayload = {
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240101.00.00',
            hl: 'hi',
            gl: 'IN'
          }
        }
      };

      if (pageToken) {
        bodyPayload.continuation = pageToken;
      } else {
        bodyPayload.query = (type === 'shorts' && !q.toLowerCase().includes('short') && !q.toLowerCase().includes('reel'))
          ? `${q} #shorts`
          : q;
        if (type === 'video') {
          // Strictly filter for Video type in YouTube to exclude channel cards and get full video results
          bodyPayload.params = 'EgIQAQ%3D%3D';
        }
      }

      const innerRes = await fetch('https://www.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (innerRes.ok) {
        const innerData = await innerRes.json();
        let extractedItems = [];
        let nextContinuationToken = null;

        if (pageToken) {
          // Page 2+ format (actions / appendContinuationItemsAction)
          const actions = innerData.onResponseReceivedCommands || [];
          for (const a of actions) {
            const items = a.appendContinuationItemsAction?.continuationItems || [];
            for (const item of items) {
              if (item.continuationItemRenderer) {
                nextContinuationToken = item.continuationItemRenderer.continuationEndpoint?.continuationCommand?.token || null;
              }
              if (item.itemSectionRenderer?.contents) {
                for (const sub of item.itemSectionRenderer.contents) {
                  processInnerTubeItem(sub, extractedItems, type);
                }
              }
            }
          }
        } else {
          // Initial search results format
          const sectionList = innerData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
          for (const section of sectionList) {
            if (section.continuationItemRenderer) {
              nextContinuationToken = section.continuationItemRenderer.continuationEndpoint?.continuationCommand?.token || null;
            }
            if (section.itemSectionRenderer?.contents) {
              for (const item of section.itemSectionRenderer.contents) {
                processInnerTubeItem(item, extractedItems, type);
              }
            }
          }
        }

        // Deduplicate
        const seenIds = new Set();
        const uniqueVideos = [];
        for (const item of extractedItems) {
          if (item.youtubeId && !seenIds.has(item.youtubeId)) {
            seenIds.add(item.youtubeId);
            uniqueVideos.push(item);
          }
        }

        if (uniqueVideos.length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
          res.statusCode = 200;
          res.end(JSON.stringify({
            results: uniqueVideos,
            items: uniqueVideos,
            nextPageToken: nextContinuationToken,
            totalResults: uniqueVideos.length,
            isLiveApi: true
          }));
          return;
        }
      }
    } catch (innerErr) {
      console.warn('InnerTube search failed, attempting fallback:', innerErr);
    }

    // Tier 2: Official YouTube Data API v3 (if key present)
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${encodeURIComponent(
          q
        )}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&key=${encodeURIComponent(apiKey)}`;

        const ytRes = await fetch(ytUrl);
        if (ytRes.ok) {
          const data = await ytRes.json();
          const items = (data.items || []).map((item) => {
            const vidId = item.id?.videoId || '';
            const title = item.snippet?.title || '';
            const isShort = title.toLowerCase().includes('#short') || title.toLowerCase().includes('#reel');
            if (type === 'video' && isShort) return null;
            if (type === 'shorts' && !isShort) return null;

            return {
              youtubeId: vidId,
              id: vidId,
              title,
              channelTitle: item.snippet?.channelTitle || 'छठ भक्ति',
              singer: item.snippet?.channelTitle || 'छठ भक्ति',
              thumbnailUrl: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
              thumbnail: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
              description: item.snippet?.description || ''
            };
          }).filter(Boolean);

          if (items.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              results: items,
              items,
              nextPageToken: data.nextPageToken || null,
              totalResults: items.length,
              isLiveApi: true
            }));
            return;
          }
        }
      } catch (apiErr) {
        console.warn('YouTube API call failed:', apiErr);
      }
    }

    // Tier 3: Verified Fallback (Safe fallback if network completely offline)
    const lowerQ = q.toLowerCase();
    const isChhathIntent = !q || 
      lowerQ.includes('chhath') || 
      lowerQ.includes('छठ') || 
      lowerQ.includes('शारदा') || 
      lowerQ.includes('पवन') || 
      lowerQ.includes('खेसारी') || 
      lowerQ.includes('मैथिली') || 
      lowerQ.includes('गीत') || 
      lowerQ.includes('भजन') || 
      lowerQ.includes('पूजा') || 
      lowerQ.includes('अर्घ्य') || 
      lowerQ.includes('सूरज');

    let fallbackResults = [];
    if (isChhathIntent) {
      const matched = FALLBACK_CHHATH_SONGS.filter((s) => {
        return (
          s.title.toLowerCase().includes(lowerQ) ||
          s.channelTitle.toLowerCase().includes(lowerQ) ||
          (s.description && s.description.toLowerCase().includes(lowerQ))
        );
      });
      fallbackResults = matched.length > 0 ? matched : (!q ? FALLBACK_CHHATH_SONGS : []);
    }

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
        results: [],
        items: [],
        nextPageToken: null,
        totalResults: 0,
        isLiveApi: false,
        error: err.message
      })
    );
  }
}

// Helper to extract videos from InnerTube item renderers
function processInnerTubeItem(item, extractedItems, type) {
  // 1. Regular video renderer (videoRenderer / compactVideoRenderer)
  const v = item.videoRenderer || item.compactVideoRenderer;
  if (v && v.videoId) {
    const title = v.title?.runs?.map(r => r.text).join('') || v.title?.simpleText || '';
    const channel = v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || 'YouTube Video';
    const duration = v.lengthText?.simpleText || '';
    const isShort = title.toLowerCase().includes('#short') || title.toLowerCase().includes('#reel') || (!duration && !v.lengthText);

    // If looking for songs (type === 'video'), STRICTLY EXCLUDE shorts/reels!
    if (type === 'video') {
      if (isShort) return;
      if (!title.trim()) return;
    }

    // If looking for shorts (type === 'shorts'), only include shorts
    if (type === 'shorts' && !isShort) {
      return;
    }

    const thumb = `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
    extractedItems.push({
      youtubeId: v.videoId,
      id: v.videoId,
      title,
      channelTitle: channel,
      singer: channel,
      duration: duration || '5:00',
      thumbnailUrl: thumb,
      thumbnail: thumb,
      description: v.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map(r => r.text).join('') || `${title} - ${channel}`
    });
    return;
  }

  // 2. Shelf renderer (e.g. grouped video sections, related shelves)
  if (item.shelfRenderer?.content) {
    const shelfItems = item.shelfRenderer.content.verticalListRenderer?.items ||
                       item.shelfRenderer.content.expandedShelfContentsRenderer?.items ||
                       [];
    for (const sub of shelfItems) {
      processInnerTubeItem(sub, extractedItems, type);
    }
  }

  // 2b. Modern YouTube Shorts reelShelfRenderer
  if (type === 'shorts' && item.reelShelfRenderer?.items) {
    for (const sub of item.reelShelfRenderer.items) {
      const r = sub.reelItemRenderer;
      if (r && r.videoId) {
        const title = r.headline?.simpleText || r.headline?.runs?.map(x => x.text).join('') || 'Trending Reel';
        const channel = r.ownerText?.runs?.[0]?.text || 'YouTube Creator';
        const thumb = `https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`;
        extractedItems.push({
          youtubeId: r.videoId,
          id: r.videoId,
          title,
          channelTitle: channel,
          singer: channel,
          duration: '0:45',
          thumbnailUrl: thumb,
          thumbnail: thumb,
          description: title
        });
      }
    }
  }

  // 3. Shorts shelf (gridShelfViewModel) for type === 'shorts'
  if (type === 'shorts' && item.gridShelfViewModel?.contents) {
    for (const sub of item.gridShelfViewModel.contents) {
      const sl = sub.shortsLockupViewModel;
      if (sl) {
        let vId = sl.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
        if (!vId && sl.entityId) {
          vId = sl.entityId.replace('shorts-shelf-item-', '');
        }
        if (!vId && sl.inlinePopStateEntityKey) {
          const match = sl.inlinePopStateEntityKey.match(/shorts-shelf-item-([A-Za-z0-9_-]+)/);
          if (match) vId = match[1];
        }
        const title = sl.overlayMetadata?.primaryText?.content || sl.accessibilityText?.split(',')?.[0] || 'Trending Reel';
        let channel = 'YouTube Creator';
        if (sl.accessibilityText) {
          const atMatch = sl.accessibilityText.match(/@([a-zA-Z0-9_.-]+)/);
          if (atMatch) {
            channel = `@${atMatch[1]}`;
          } else {
            const parts = sl.accessibilityText.split(',');
            if (parts.length > 1 && !parts[1].includes('व्यू')) {
              channel = parts[1].trim();
            }
          }
        }
        if (vId) {
          const thumb = `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
          extractedItems.push({
            youtubeId: vId,
            id: vId,
            title,
            channelTitle: channel,
            singer: channel,
            duration: '0:45',
            thumbnailUrl: thumb,
            thumbnail: thumb,
            description: title
          });
        }
      }
    }
  }
}
