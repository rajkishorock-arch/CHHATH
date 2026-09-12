import type { IncomingMessage, ServerResponse } from 'http';
import { databaseEngine } from './db/databaseEngine.ts';

// Helper to read JSON request body
function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('अमान्य JSON डेटा'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Extract Bearer token or cookie/query token
function extractSessionToken(req: IncomingMessage, urlObj: URL): string | null {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const queryToken = urlObj.searchParams.get('token') || urlObj.searchParams.get('sessionToken');
  if (queryToken) return queryToken.trim();
  return null;
}

export async function handleSocialApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '', 'http://localhost:5173');
  let pathname = urlObj.pathname;
  if (!pathname.startsWith('/api/v1')) {
    pathname = '/api/v1' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }
  const method = req.method || 'GET';
  const token = extractSessionToken(req, urlObj);

  // Authenticate session if token provided
  let authContext: ReturnType<typeof databaseEngine.verifySession> = null;
  if (token) {
    authContext = databaseEngine.verifySession(token);
  }

  const clientInfo = {
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    userAgent: (req.headers['user-agent'] as string) || 'ChhathClient'
  };

  try {
    // ==========================================
    // 1. AUTHENTICATION & SESSIONS
    // ==========================================

    // POST /api/v1/auth/signup
    if (pathname === '/api/v1/auth/signup' && method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.email || !body.username || !body.password || !body.name) {
        sendJson(res, 400, { success: false, error: 'कृपया सभी आवश्यक फ़ील्ड भरें (नाम, यूजरनेम, ईमेल, पासवर्ड)।' });
        return;
      }
      const result = databaseEngine.createUser({
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
        avatarUrl: body.avatarUrl,
        bio: body.bio,
        city: body.city,
        state: body.state,
        country: body.country,
        language: body.language,
        role: body.role,
        clientInfo
      });
      sendJson(res, 201, { success: true, ...result });
      return;
    }

    // POST /api/v1/auth/login
    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      const body = await readJsonBody(req);
      const identifier = body.emailOrUsername || body.email || body.username;
      if (!identifier || !body.password) {
        sendJson(res, 400, { success: false, error: 'कृपया ईमेल/यूजरनेम और पासवर्ड दर्ज करें।' });
        return;
      }
      const result = databaseEngine.login(identifier, body.password, clientInfo);
      sendJson(res, 200, { success: true, ...result });
      return;
    }

    // GET /api/v1/auth/session
    if (pathname === '/api/v1/auth/session' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'सत्र अमान्य या समाप्त हो चुका है।' });
        return;
      }
      sendJson(res, 200, {
        success: true,
        user: authContext.user,
        settings: authContext.settings,
        session: authContext.session
      });
      return;
    }

    // POST /api/v1/auth/logout
    if (pathname === '/api/v1/auth/logout' && method === 'POST') {
      if (token) {
        databaseEngine.revokeSession(token);
      }
      sendJson(res, 200, { success: true, message: 'सफलतापूर्वक लॉगआउट किया गया।' });
      return;
    }

    // POST /api/v1/auth/logout-all
    if (pathname === '/api/v1/auth/logout-all' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      const keepCurrent = Boolean(body.keepCurrent);
      const revoked = databaseEngine.revokeAllSessions(authContext.user.user_id, keepCurrent ? token || undefined : undefined);
      sendJson(res, 200, { success: true, count: revoked, message: `${revoked} सक्रिय डिवाइस सत्र समाप्त किए गए।` });
      return;
    }

    // POST /api/v1/auth/change-password
    if (pathname === '/api/v1/auth/change-password' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.oldPassword || !body.newPassword) {
        sendJson(res, 400, { success: false, error: 'वर्तमान और नया पासवर्ड आवश्यक है।' });
        return;
      }
      databaseEngine.changePassword(authContext.user.user_id, body.oldPassword, body.newPassword);
      sendJson(res, 200, { success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है।' });
      return;
    }

    // POST /api/v1/auth/delete-account
    if (pathname === '/api/v1/auth/delete-account' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (body.confirmation !== 'DELETE') {
        sendJson(res, 400, { success: false, error: 'खाता हटाने के लिए पुष्टि शब्द "DELETE" दर्ज करें।' });
        return;
      }
      databaseEngine.deleteAccount(authContext.user.user_id);
      sendJson(res, 200, { success: true, message: 'खाता और संपूर्ण डेटा सफलतापूर्वक हटा दिया गया है।' });
      return;
    }

    // ==========================================
    // 2. PROFILES & USER SEARCH
    // ==========================================

    // GET /api/v1/profiles/search?q=...
    if (pathname === '/api/v1/profiles/search' && method === 'GET') {
      const q = urlObj.searchParams.get('q') || '';
      const limit = parseInt(urlObj.searchParams.get('limit') || '20', 10);
      const results = databaseEngine.searchProfiles(q, limit);
      sendJson(res, 200, { success: true, results });
      return;
    }

    // GET /api/v1/profiles/by-username/:username
    if (pathname.startsWith('/api/v1/profiles/by-username/') && method === 'GET') {
      const username = decodeURIComponent(pathname.replace('/api/v1/profiles/by-username/', ''));
      const profile = databaseEngine.getProfileByUsername(username);
      if (!profile) {
        sendJson(res, 404, { success: false, error: 'प्रोफ़ाइल नहीं मिली।' });
        return;
      }
      let followStatus = 'none';
      if (authContext) {
        followStatus = databaseEngine.getFollowStatus(authContext.user.user_id, profile.user_id);
      }
      sendJson(res, 200, { success: true, profile, followStatus });
      return;
    }

    // GET /api/v1/profiles/:userId
    if (pathname.startsWith('/api/v1/profiles/') && method === 'GET' && !pathname.includes('search') && !pathname.includes('by-username')) {
      const targetId = pathname.replace('/api/v1/profiles/', '');
      const profile = databaseEngine.getProfileById(targetId);
      if (!profile) {
        sendJson(res, 404, { success: false, error: 'प्रोफ़ाइल नहीं मिली।' });
        return;
      }
      let followStatus = 'none';
      let isBlocked = false;
      if (authContext) {
        followStatus = databaseEngine.getFollowStatus(authContext.user.user_id, profile.user_id);
        isBlocked = databaseEngine.isBlocked(authContext.user.user_id, profile.user_id);
      }
      sendJson(res, 200, { success: true, profile, followStatus, isBlocked });
      return;
    }

    // POST /api/v1/profiles/update
    if (pathname === '/api/v1/profiles/update' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      const updated = databaseEngine.updateProfile(authContext.user.user_id, body);
      sendJson(res, 200, { success: true, profile: updated });
      return;
    }

    // ==========================================
    // 3. SOCIAL GRAPH: FOLLOWS & REQUESTS
    // ==========================================

    // POST /api/v1/follows/toggle
    if (pathname === '/api/v1/follows/toggle' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.targetUserId) {
        sendJson(res, 400, { success: false, error: 'targetUserId आवश्यक है।' });
        return;
      }
      const result = databaseEngine.toggleFollow(authContext.user.user_id, body.targetUserId);
      sendJson(res, 200, { success: true, ...result });
      return;
    }

    // GET /api/v1/follows/status
    if (pathname === '/api/v1/follows/status' && method === 'GET') {
      const followerId = urlObj.searchParams.get('followerId') || (authContext ? authContext.user.user_id : null);
      const followingId = urlObj.searchParams.get('followingId');
      if (!followerId || !followingId) {
        sendJson(res, 400, { success: false, error: 'followerId और followingId आवश्यक हैं।' });
        return;
      }
      const status = databaseEngine.getFollowStatus(followerId, followingId);
      sendJson(res, 200, { success: true, status });
      return;
    }

    // GET /api/v1/follows/requests
    if (pathname === '/api/v1/follows/requests' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const requests = databaseEngine.getPendingFollowRequests(authContext.user.user_id);
      sendJson(res, 200, { success: true, requests });
      return;
    }

    // POST /api/v1/follows/requests/accept
    if (pathname === '/api/v1/follows/requests/accept' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.requesterId) {
        sendJson(res, 400, { success: false, error: 'requesterId आवश्यक है।' });
        return;
      }
      const success = databaseEngine.acceptFollowRequest(authContext.user.user_id, body.requesterId);
      sendJson(res, 200, { success });
      return;
    }

    // POST /api/v1/follows/requests/reject
    if (pathname === '/api/v1/follows/requests/reject' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.requesterId) {
        sendJson(res, 400, { success: false, error: 'requesterId आवश्यक है।' });
        return;
      }
      const success = databaseEngine.rejectFollowRequest(authContext.user.user_id, body.requesterId);
      sendJson(res, 200, { success });
      return;
    }

    // GET /api/v1/follows/followers/:userId
    if (pathname.startsWith('/api/v1/follows/followers/') && method === 'GET') {
      const targetId = pathname.replace('/api/v1/follows/followers/', '');
      const followers = databaseEngine.getFollowers(targetId);
      sendJson(res, 200, { success: true, followers });
      return;
    }

    // GET /api/v1/follows/following/:userId
    if (pathname.startsWith('/api/v1/follows/following/') && method === 'GET') {
      const targetId = pathname.replace('/api/v1/follows/following/', '');
      const following = databaseEngine.getFollowing(targetId);
      sendJson(res, 200, { success: true, following });
      return;
    }

    // ==========================================
    // 4. BLOCKING & MUTING
    // ==========================================

    // POST /api/v1/social/block
    if (pathname === '/api/v1/social/block' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.targetUserId) {
        sendJson(res, 400, { success: false, error: 'targetUserId आवश्यक है।' });
        return;
      }
      const success = databaseEngine.blockUser(authContext.user.user_id, body.targetUserId);
      sendJson(res, 200, { success, message: 'खाता सफलतापूर्वक ब्लॉक किया गया।' });
      return;
    }

    // POST /api/v1/social/unblock
    if (pathname === '/api/v1/social/unblock' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.targetUserId) {
        sendJson(res, 400, { success: false, error: 'targetUserId आवश्यक है।' });
        return;
      }
      const success = databaseEngine.unblockUser(authContext.user.user_id, body.targetUserId);
      sendJson(res, 200, { success, message: 'खाता अनब्लॉक किया गया।' });
      return;
    }

    // GET /api/v1/social/blocked
    if (pathname === '/api/v1/social/blocked' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const blocked = databaseEngine.getBlockedUsers(authContext.user.user_id);
      sendJson(res, 200, { success: true, blocked });
      return;
    }

    // POST /api/v1/social/mute
    if (pathname === '/api/v1/social/mute' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.entityId || !body.entityType) {
        sendJson(res, 400, { success: false, error: 'entityId और entityType आवश्यक हैं।' });
        return;
      }
      databaseEngine.muteEntity(authContext.user.user_id, body.entityType, body.entityId, body.muteUntil);
      sendJson(res, 200, { success: true });
      return;
    }

    // POST /api/v1/social/unmute
    if (pathname === '/api/v1/social/unmute' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.entityId || !body.entityType) {
        sendJson(res, 400, { success: false, error: 'entityId और entityType आवश्यक हैं।' });
        return;
      }
      databaseEngine.unmuteEntity(authContext.user.user_id, body.entityType, body.entityId);
      sendJson(res, 200, { success: true });
      return;
    }

    // ==========================================
    // 5. SETTINGS & SESSIONS
    // ==========================================

    // GET /api/v1/settings
    if (pathname === '/api/v1/settings' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const settings = databaseEngine.getSettings(authContext.user.user_id);
      sendJson(res, 200, { success: true, settings });
      return;
    }

    // POST /api/v1/settings/update
    if (pathname === '/api/v1/settings/update' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      const settings = databaseEngine.updateSettings(authContext.user.user_id, body);
      sendJson(res, 200, { success: true, settings });
      return;
    }

    // GET /api/v1/security/sessions
    if (pathname === '/api/v1/security/sessions' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const sessions = databaseEngine.getUserSessions(authContext.user.user_id, token || undefined);
      sendJson(res, 200, { success: true, sessions });
      return;
    }

    // POST /api/v1/security/sessions/revoke
    if (pathname === '/api/v1/security/sessions/revoke' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const body = await readJsonBody(req);
      if (!body.sessionId) {
        sendJson(res, 400, { success: false, error: 'sessionId आवश्यक है।' });
        return;
      }
      const success = databaseEngine.revokeSessionById(authContext.user.user_id, body.sessionId);
      sendJson(res, 200, { success });
      return;
    }

    // ==========================================
    // 6. DATA EXPORT (DOWNLOAD MY DATA PACKAGE)
    // ==========================================

    // GET /api/v1/data-export
    if (pathname === '/api/v1/data-export' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const exportData = databaseEngine.exportUserData(authContext.user.user_id);
      sendJson(res, 200, { success: true, data: exportData });
      return;
    }

    // ==========================================
    // 7. CONTENT & INTERACTIONS (REELS & COMMENTS)
    // ==========================================

    // GET /api/v1/reels
    if (pathname === '/api/v1/reels' && method === 'GET') {
      const feedType = urlObj.searchParams.get('feedType') || undefined;
      const category = urlObj.searchParams.get('category') || undefined;
      const tag = urlObj.searchParams.get('tag') || undefined;
      const limit = parseInt(urlObj.searchParams.get('limit') || '20', 10);
      const offset = parseInt(urlObj.searchParams.get('offset') || '0', 10);

      const result = databaseEngine.getReels({
        userId: authContext?.user.user_id,
        feedType,
        category,
        tag,
        limit,
        offset
      });

      sendJson(res, 200, { success: true, ...result });
      return;
    }

    // POST /api/v1/reels
    if (pathname === '/api/v1/reels' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'रील बनाने के लिए लॉगिन करें।' });
        return;
      }
      const body = await readJsonBody(req);
      const newReel = databaseEngine.createReel({
        creatorId: authContext.user.user_id,
        title: body.title || 'छठ महापर्व पावन रील',
        description: body.description || '',
        category: body.category || 'Chhath Geet',
        tags: body.tags || ['#ChhathPuja'],
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        videoDuration: body.videoDuration || '0:30',
        audioId: body.audioId,
        audioTitle: body.audioTitle,
        audioArtist: body.audioArtist,
        aspectRatio: body.aspectRatio || '9:16',
        sourceType: body.sourceType || 'FIRST_PARTY',
        youtubeVideoId: body.youtubeVideoId,
        channelTitle: body.channelTitle,
        externalSourceUrl: body.externalSourceUrl
      });
      sendJson(res, 201, { success: true, reel: newReel });
      return;
    }

    // POST /api/v1/reels/:id/like
    if (pathname.includes('/like') && pathname.startsWith('/api/v1/reels/') && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const reelId = pathname.replace('/api/v1/reels/', '').replace('/like', '');
      const result = databaseEngine.toggleLikeReel(reelId, authContext.user.user_id);
      sendJson(res, 200, { success: true, ...result });
      return;
    }

    // POST /api/v1/reels/:id/save
    if (pathname.includes('/save') && pathname.startsWith('/api/v1/reels/') && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const reelId = pathname.replace('/api/v1/reels/', '').replace('/save', '');
      const body = await readJsonBody(req);
      const result = databaseEngine.toggleSaveReel(reelId, authContext.user.user_id, body.collectionName);
      sendJson(res, 200, { success: true, ...result });
      return;
    }

    // GET /api/v1/reels/:id/comments
    if (pathname.includes('/comments') && pathname.startsWith('/api/v1/reels/') && method === 'GET') {
      const reelId = pathname.replace('/api/v1/reels/', '').replace('/comments', '');
      const comments = databaseEngine.getComments(reelId);
      sendJson(res, 200, { success: true, comments });
      return;
    }

    // POST /api/v1/reels/:id/comments
    if (pathname.includes('/comments') && pathname.startsWith('/api/v1/reels/') && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const reelId = pathname.replace('/api/v1/reels/', '').replace('/comments', '');
      const body = await readJsonBody(req);
      if (!body.content || !body.content.trim()) {
        sendJson(res, 400, { success: false, error: 'टिप्पणी खाली नहीं हो सकती।' });
        return;
      }
      const comment = databaseEngine.addComment(reelId, authContext.user.user_id, body.content, body.parentId);
      sendJson(res, 201, { success: true, comment });
      return;
    }

    // ==========================================
    // 8. NOTIFICATIONS & REPORTS
    // ==========================================

    // GET /api/v1/notifications
    if (pathname === '/api/v1/notifications' && method === 'GET') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      const notifications = databaseEngine.getNotifications(authContext.user.user_id);
      sendJson(res, 200, { success: true, notifications });
      return;
    }

    // POST /api/v1/notifications/read
    if (pathname === '/api/v1/notifications/read' && method === 'POST') {
      if (!authContext) {
        sendJson(res, 401, { success: false, error: 'अनधिकृत।' });
        return;
      }
      databaseEngine.markNotificationsRead(authContext.user.user_id);
      sendJson(res, 200, { success: true });
      return;
    }

    // POST /api/v1/reports
    if (pathname === '/api/v1/reports' && method === 'POST') {
      const body = await readJsonBody(req);
      const reporterId = authContext ? authContext.user.user_id : 'anonymous';
      if (!body.targetType || !body.targetId || !body.reason) {
        sendJson(res, 400, { success: false, error: 'targetType, targetId और reason आवश्यक हैं।' });
        return;
      }
      const report = databaseEngine.createReport(reporterId, body.targetType, body.targetId, body.reason, body.details);
      sendJson(res, 201, { success: true, report, message: 'शिकायत सफलतापूर्वक दर्ज की गई। हमारी टीम समीक्षा करेगी।' });
      return;
    }

    // Fallthrough 404
    sendJson(res, 404, { success: false, error: `अमान्य API रूट: ${method} ${pathname}` });
  } catch (err: any) {
    console.error('[SocialMiddleware Error]:', err);
    sendJson(res, 500, { success: false, error: err.message || 'आंतरिक सर्वर त्रुटि' });
  }
}
