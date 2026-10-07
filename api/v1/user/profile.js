/**
 * Vercel Serverless Function: /api/v1/user/profile
 * Cross-device persistent profile & activity synchronization
 */

const MASTER_BIN_ID = 'eeeaedd';
const CLOUD_STORAGE_URL = `https://extendsclass.com/api/json-storage/bin/${MASTER_BIN_ID}`;

// In-memory cache for ultra-fast serverless invocations within warm containers
let inMemoryCache = null;
let lastCacheFetchTime = 0;

async function fetchCloudData() {
  const now = Date.now();
  if (inMemoryCache && now - lastCacheFetchTime < 10000) {
    return inMemoryCache;
  }
  try {
    const res = await fetch(CLOUD_STORAGE_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.ok) {
      const data = await res.json();
      inMemoryCache = data || { users: {} };
      lastCacheFetchTime = now;
      return inMemoryCache;
    }
  } catch (err) {
    console.error('[Profile API] Cloud fetch error:', err);
  }
  return inMemoryCache || { users: {} };
}

async function saveCloudData(data) {
  inMemoryCache = data;
  lastCacheFetchTime = Date.now();
  try {
    await fetch(CLOUD_STORAGE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('[Profile API] Cloud save error:', err);
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const uid = req.query?.uid;
      if (!uid) {
        return res.status(400).json({ success: false, error: 'Missing uid parameter' });
      }

      const cloudData = await fetchCloudData();
      const userRecord = (cloudData.users && cloudData.users[uid]) || null;

      return res.status(200).json({
        success: true,
        uid,
        data: userRecord
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const uid = body?.uid;
      const updates = body?.data || body?.profile;

      if (!uid || !updates) {
        return res.status(400).json({ success: false, error: 'Missing uid or data in payload' });
      }

      const cloudData = await fetchCloudData();
      if (!cloudData.users) {
        cloudData.users = {};
      }

      const existing = cloudData.users[uid] || {};
      cloudData.users[uid] = {
        ...existing,
        ...updates,
        uid,
        updatedAt: new Date().toISOString()
      };

      await saveCloudData(cloudData);

      return res.status(200).json({
        success: true,
        uid,
        data: cloudData.users[uid]
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[Profile API] Server error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
