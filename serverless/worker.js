/**
 * Cloudflare Worker Proxy for YouTube Data API v3
 * 
 * Target Endpoint: GET /?q=Pawan%20Singh%20Chhath&pageToken=...
 * Worker Secret Required: YOUTUBE_API_KEY
 */

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = ['https://rajkishorock-arch.github.io', 'http://localhost:5173', 'http://localhost:3000'];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://rajkishorock-arch.github.io';

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=UTF-8'
    };

    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Only GET requests are supported.' }),
        { status: 405, headers: corsHeaders }
      );
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const pageToken = url.searchParams.get('pageToken') || '';

    // Validate search query parameter
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query parameter "q" is missing or empty' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate Worker secret API key
    const apiKey = env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'YOUTUBE_API_KEY secret is not configured on the Cloudflare Worker environment' 
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Check Cloudflare Edge Cache
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    try {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch {
      // Ignore cache match errors
    }

    try {
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&q=${encodeURIComponent(
        query.trim()
      )}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}&key=${encodeURIComponent(apiKey)}`;

      const ytResponse = await fetch(ytUrl);

      if (!ytResponse.ok) {
        let errorMessage = 'YouTube API returned error status';
        if (ytResponse.status === 403) {
          errorMessage = 'YouTube API quota limit exceeded or unauthorized API key';
        } else if (ytResponse.status === 400) {
          errorMessage = 'Invalid search query or token parameters';
        }

        return new Response(
          JSON.stringify({
            error: errorMessage,
            status: ytResponse.status
          }),
          { status: ytResponse.status, headers: corsHeaders }
        );
      }

      const data = await ytResponse.json();

      // Normalize YouTube search items into application structure
      const items = (data.items || []).map(item => ({
        youtubeId: item.id?.videoId || '',
        title: item.snippet?.title || '',
        channelTitle: item.snippet?.channelTitle || '',
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          `https://i.ytimg.com/vi/${item.id?.videoId}/mqdefault.jpg`,
        description: item.snippet?.description || ''
      }));

      const payload = {
        items,
        results: items, // Alias for backward compatibility
        nextPageToken: data.nextPageToken || null,
        prevPageToken: data.prevPageToken || null,
        totalResults: data.pageInfo?.totalResults || items.length
      };

      const response = new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
      });

      // Put response into Cloudflare Edge Cache
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;

    } catch (err) {
      return new Response(
        JSON.stringify({ 
          error: 'Cloudflare Worker encountered a network fetch error', 
          details: err.message || 'Unknown network error'
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
