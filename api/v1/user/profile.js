/**
 * Vercel Serverless Function: /api/v1/user/profile
 * Cross-device persistent profile & activity synchronization
 */

import { verifyFirebaseIdToken, extractBearerToken } from '../_verifyFirebaseToken.js';

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
    console.error('[Profile API] Cloud fetch notice');
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
    console.error('[Profile API] Cloud save notice');
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

  // 1. Enforce Authorization: Bearer <idToken>
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  const token = extractBearerToken(authHeader);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Authorization Bearer header'
    });
  }

  // 2. Cryptographically verify Firebase ID token
  const verification = await verifyFirebaseIdToken(token);
  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: `Unauthorized: ${verification.error || 'Invalid or expired authentication token'}`
    });
  }

  const authenticatedUid = verification.uid;

  try {
    if (req.method === 'GET') {
      const requestedUid = req.query?.uid;
      // Reject mismatched client-supplied UIDs
      if (requestedUid && requestedUid !== authenticatedUid) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Cannot access another user profile'
        });
      }

      const cloudData = await fetchCloudData();
      const userRecord = (cloudData.users && cloudData.users[authenticatedUid]) || null;

      return res.status(200).json({
        success: true,
        uid: authenticatedUid,
        data: userRecord
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const requestedUid = body?.uid;

      // Reject attempts to modify another user's profile
      if (requestedUid && requestedUid !== authenticatedUid) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Cannot modify another user profile'
        });
      }

      const rawUpdates = body?.data || body?.profile;
      if (!rawUpdates || typeof rawUpdates !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Bad Request: Missing or invalid profile data in payload'
        });
      }

      // Whitelist legitimate profile fields to prevent privilege escalation or identity tampering
      const allowedFields = [
        'name', 'username', 'avatarUrl', 'coverUrl', 'website', 'bio',
        'city', 'state', 'country', 'language', 'interests', 'vows',
        'memories', 'favoriteSongs', 'favoriteGhats', 'japMala', 'onboardingCompleted'
      ];
      const sanitizedUpdates = {};
      for (const field of allowedFields) {
        if (rawUpdates[field] !== undefined) {
          sanitizedUpdates[field] = rawUpdates[field];
        }
      }

      const cloudData = await fetchCloudData();
      if (!cloudData.users) {
        cloudData.users = {};
      }

      const existing = cloudData.users[authenticatedUid] || {};
      cloudData.users[authenticatedUid] = {
        ...existing,
        ...sanitizedUpdates,
        uid: authenticatedUid,
        email: verification.email || existing.email || '',
        role: existing.role || 'user',
        updatedAt: new Date().toISOString()
      };

      await saveCloudData(cloudData);

      return res.status(200).json({
        success: true,
        uid: authenticatedUid,
        data: cloudData.users[authenticatedUid]
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch {
    console.error('[Profile API] Server processing notice');
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
