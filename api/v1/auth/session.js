/**
 * Vercel Serverless Function: /api/v1/auth/session
 * Fallback session verification endpoint for web & PWA
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Always return clean JSON 200 response instead of 404
  return res.status(200).json({
    success: true,
    user: null,
    message: 'Active session endpoint'
  });
}
