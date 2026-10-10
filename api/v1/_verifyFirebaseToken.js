/**
 * Cryptographic Firebase ID Token Verification Helper
 * Zero-new-dependency implementation using Node.js built-in crypto
 * Specification: https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
 */

import crypto from 'node:crypto';

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const DEFAULT_PROJECT_ID = 'chhath-1948a';

// In-memory cache for Google public x509 certificates
let cachedCerts = null;
let cacheExpiresAt = 0;

/**
 * Fetch and cache Google's public x509 certificates with max-age support
 */
export async function getGooglePublicCerts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedCerts && now < cacheExpiresAt) {
    return cachedCerts;
  }

  try {
    const res = await fetch(GOOGLE_CERTS_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!res.ok) {
      if (cachedCerts) return cachedCerts; // Fallback to existing cache if available
      return null;
    }

    const certs = await res.json();
    if (!certs || typeof certs !== 'object') {
      return cachedCerts;
    }

    // Determine cache lifetime from Cache-Control max-age header (default 6 hours)
    const cacheControl = res.headers.get('cache-control') || '';
    const match = cacheControl.match(/max-age=(\d+)/);
    const maxAgeSeconds = match ? Math.max(300, Math.min(parseInt(match[1], 10), 86400)) : 21600;

    cachedCerts = certs;
    cacheExpiresAt = now + maxAgeSeconds * 1000;
    return cachedCerts;
  } catch {
    if (cachedCerts) return cachedCerts;
    return null;
  }
}

/**
 * Extract Bearer token from HTTP Authorization header
 */
export function extractBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

/**
 * Cryptographically verify Firebase ID token using RS256 and Google public certificates
 */
export async function verifyFirebaseIdToken(token, options = {}) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token is missing or empty' };
  }

  const projectId = options.projectId || process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed JWT structure' };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Decode Header
  let header;
  try {
    const headerJson = Buffer.from(headerB64, 'base64url').toString('utf8');
    header = JSON.parse(headerJson);
  } catch {
    return { valid: false, error: 'Invalid JWT header' };
  }

  if (!header || typeof header !== 'object') {
    return { valid: false, error: 'Invalid JWT header structure' };
  }

  if (header.alg !== 'RS256') {
    return { valid: false, error: `Unsupported algorithm: expected RS256, got ${header.alg}` };
  }

  if (!header.kid || typeof header.kid !== 'string') {
    return { valid: false, error: 'Missing key identifier (kid) in header' };
  }

  // 2. Decode Payload
  let payload;
  try {
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    payload = JSON.parse(payloadJson);
  } catch {
    return { valid: false, error: 'Invalid JWT payload' };
  }

  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid JWT payload structure' };
  }

  // 3. Obtain Google public certificate matching header.kid
  let certs = options.certs || await getGooglePublicCerts();
  if (!certs || !certs[header.kid]) {
    // Attempt one forced refresh to support key rotation
    certs = options.certs || await getGooglePublicCerts(true);
  }

  if (!certs) {
    return { valid: false, error: 'Failed to retrieve Google public certificates' };
  }

  const cert = certs[header.kid];
  if (!cert) {
    return { valid: false, error: 'Certificate key identifier (kid) not recognized' };
  }

  // 4. Verify RS256 Signature
  try {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${headerB64}.${payloadB64}`);
    const signatureBuffer = Buffer.from(signatureB64, 'base64url');
    const isSignatureValid = verifier.verify(cert, signatureBuffer);

    if (!isSignatureValid) {
      return { valid: false, error: 'Invalid token signature' };
    }
  } catch {
    return { valid: false, error: 'Cryptographic signature verification failed' };
  }

  // 5. Validate Standard Claims
  const now = Math.floor(Date.now() / 1000);

  // Audience must match Firebase Project ID
  if (payload.aud !== projectId) {
    return { valid: false, error: `Invalid token audience: expected ${projectId}, got ${payload.aud}` };
  }

  // Issuer must match expected project issuer
  const expectedIssuer = `https://securetoken.google.com/${projectId}`;
  if (payload.iss !== expectedIssuer) {
    return { valid: false, error: `Invalid token issuer: expected ${expectedIssuer}, got ${payload.iss}` };
  }

  // Subject must be valid non-empty UID string
  if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.length > 128) {
    return { valid: false, error: 'Invalid token subject (UID)' };
  }

  // Expiration check (with 60s leeway for clock skew)
  if (typeof payload.exp !== 'number' || payload.exp <= now - 60) {
    return { valid: false, error: 'Token has expired' };
  }

  // Issued at check (allow up to 5 min forward clock skew)
  if (typeof payload.iat !== 'number' || payload.iat > now + 300) {
    return { valid: false, error: 'Token issued at time is invalid' };
  }

  // auth_time check if present
  if (payload.auth_time !== undefined && (typeof payload.auth_time !== 'number' || payload.auth_time > now + 300)) {
    return { valid: false, error: 'Token auth_time is invalid' };
  }

  return {
    valid: true,
    uid: payload.sub,
    email: payload.email || '',
    claims: payload
  };
}
