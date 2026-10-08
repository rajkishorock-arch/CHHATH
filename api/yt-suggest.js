/**
 * Vercel Serverless Function: /api/yt-suggest
 * Provides real-time YouTube search suggestions / autocomplete for Chhath songs & videos.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    let q = '';
    if (req.query && typeof req.query.q === 'string') {
      q = req.query.q.trim();
    } else {
      const urlObj = new URL(req.url || '', 'http://localhost');
      q = (urlObj.searchParams.get('q') || '').trim();
    }

    if (!q) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ suggestions: [] }));
      return;
    }

    const googleSuggestUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(googleSuggestUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const rawSuggestions = Array.isArray(data?.[1]) ? data[1] : [];
      const suggestions = rawSuggestions.filter(s => typeof s === 'string' && s.trim());

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ suggestions }));
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ suggestions: [] }));
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ suggestions: [] }));
  }
}
