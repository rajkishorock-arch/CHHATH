import type { IncomingMessage, ServerResponse } from 'http';

interface QueuedSignal {
  id: string;
  targetUserId: string;
  fromUserId: string;
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-ended' | 'call-declined';
  data: any;
  timestamp: number;
}

// In-memory message and signal storage for multi-tab / multi-client fallback sync
const pendingSignals: QueuedSignal[] = [];
const messageRelayCache: any[] = [];
const MAX_SIGNALS_RETAINED = 200;
const SIGNAL_EXPIRY_MS = 60 * 1000; // 1 minute

export async function handleChatApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '', 'http://localhost:5173');
  let pathname = urlObj.pathname;
  if (!pathname.startsWith('/api/chat')) {
    pathname = '/api/chat' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }

  // Cleanup expired signals periodically
  const now = Date.now();
  for (let i = pendingSignals.length - 1; i >= 0; i--) {
    if (now - pendingSignals[i].timestamp > SIGNAL_EXPIRY_MS) {
      pendingSignals.splice(i, 1);
    }
  }

  // 1. Health check
  if (pathname === '/api/chat/health' || pathname === '/api/chat') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok', service: 'Chhath Connect Chat & WebRTC Relay', timestamp: now }));
    return;
  }

  // 2. WebRTC Signaling Relay
  // POST /api/chat/signal -> post signal for target user
  if (pathname === '/api/chat/signal' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (!payload.targetUserId || !payload.type) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing targetUserId or type' }));
          return;
        }

        const signal: QueuedSignal = {
          id: 'sig_' + Math.random().toString(36).substring(2, 9),
          targetUserId: payload.targetUserId,
          fromUserId: payload.fromUserId || 'anonymous',
          type: payload.type,
          data: payload.data || {},
          timestamp: Date.now()
        };

        pendingSignals.push(signal);
        if (pendingSignals.length > MAX_SIGNALS_RETAINED) {
          pendingSignals.shift();
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, signalId: signal.id }));
      } catch (err: any) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // GET /api/chat/signal?userId=... -> fetch pending signals for this user
  if (pathname === '/api/chat/signal' && req.method === 'GET') {
    const userId = urlObj.searchParams.get('userId');
    if (!userId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing userId query parameter' }));
      return;
    }

    // Extract signals for this targetUserId
    const userSignals = pendingSignals.filter(s => s.targetUserId === userId);
    // Remove retrieved signals
    for (let i = pendingSignals.length - 1; i >= 0; i--) {
      if (pendingSignals[i].targetUserId === userId) {
        pendingSignals.splice(i, 1);
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ signals: userSignals }));
    return;
  }

  // 3. Message Relay Cache
  // POST /api/chat/messages -> broadcast/relay message
  if (pathname === '/api/chat/messages' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const msg = JSON.parse(body || '{}');
        if (!msg.id || !msg.conversationId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid message payload' }));
          return;
        }

        messageRelayCache.push(msg);
        if (messageRelayCache.length > 500) {
          messageRelayCache.shift();
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, messageId: msg.id }));
      } catch (err: any) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // GET /api/chat/messages?conversationId=...
  if (pathname === '/api/chat/messages' && req.method === 'GET') {
    const convId = urlObj.searchParams.get('conversationId');
    const since = parseInt(urlObj.searchParams.get('since') || '0', 10);

    const filtered = messageRelayCache.filter(m => {
      if (convId && m.conversationId !== convId) return false;
      if (since && m.timestamp <= since) return false;
      return true;
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ messages: filtered }));
    return;
  }

  // Fallback 404
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not Found' }));
}
