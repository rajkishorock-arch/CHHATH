/**
 * Cloudflare Worker Proxy for YouTube Data API v3
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Create a free Cloudflare account at https://dash.cloudflare.com
 * 2. Go to Workers & Pages -> Create Worker -> Name it: "chhath-yt-search"
 * 3. Copy & paste this code into the Cloudflare Worker editor.
 * 4. Go to Worker Settings -> Variables -> Environment Variables:
 *    Add Variable: YOUTUBE_API_KEY = <Your-Google-Cloud-YouTube-Data-API-Key>
 * 5. Click Save and Deploy.
 * 6. Set the deployed Worker URL in your React app or localStorage:
 *    localStorage.setItem('chhath_yt_worker_url', 'https://chhath-yt-search.<your-subdomain>.workers.dev');
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight OPTIONS request
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=UTF-8'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const pageToken = url.searchParams.get('pageToken') || '';

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Search query string "q" is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'YOUTUBE_API_KEY secret is not configured on Cloudflare Worker' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Check Cloudflare Edge Cache first
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&q=${encodeURIComponent(
        query.trim()
      )}&pageToken=${encodeURIComponent(pageToken)}&key=${apiKey}`;

      const ytResponse = await fetch(ytUrl);
      if (!ytResponse.ok) {
        const errorData = await ytResponse.json().catch(() => ({}));
        return new Response(
          JSON.stringify({
            error: 'YouTube API error',
            status: ytResponse.status,
            details: errorData.error?.message || 'Failed to fetch results from YouTube'
          }),
          { status: ytResponse.status, headers: corsHeaders }
        );
      }

      const data = await ytResponse.json();

      // Normalize YouTube items into safe YouTubeSearchSong structure
      const items = (data.items || []).map(item => ({
        youtubeId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
        description: item.snippet.description || ''
      }));

      const payload = {
        results: items,
        nextPageToken: data.nextPageToken || null,
        prevPageToken: data.prevPageToken || null,
        totalResults: data.pageInfo?.totalResults || items.length
      };

      const response = new Response(JSON.stringify(payload), {
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400' // Cache for 24 hours
        }
      });

      // Put into Cloudflare Edge Cache asynchronously
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Worker fetch error', message: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
