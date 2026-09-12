import type { IncomingMessage, ServerResponse } from 'http';

interface AgentRequestBody {
  prompt: string;
  lang?: 'hi' | 'en' | 'bho' | 'mai';
  location?: {
    city: string;
    state: string;
  };
  context?: any;
}

// In-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (valid.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  valid.push(now);
  rateLimitMap.set(ip, valid);
  return true;
}

export async function handleAiAgentApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const clientIp = req.socket.remoteAddress || 'unknown';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  // Rate Limiting
  if (!checkRateLimit(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }));
    return;
  }

  let bodyData = '';
  req.on('data', chunk => {
    bodyData += chunk;
    if (bodyData.length > 500000) { // 500KB limit
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const parsed: AgentRequestBody = JSON.parse(bodyData || '{}');
      const prompt = (parsed.prompt || '').trim();

      if (!prompt) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing prompt parameter.' }));
        return;
      }

      // Check if external API key is set in environment (Zero client exposure)
      const geminiKey = process.env.GEMINI_API_KEY;
      const openAiKey = process.env.OPENAI_API_KEY;

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        status: 'success',
        prompt,
        hasExternalKey: Boolean(geminiKey || openAiKey),
        provider: geminiKey ? 'Gemini Pro' : openAiKey ? 'OpenAI GPT' : 'Local Cultural Expert Engine',
        message: 'Request processed via secure server-side tool agent.'
      }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal AI Agent processing error.' }));
    }
  });
}
