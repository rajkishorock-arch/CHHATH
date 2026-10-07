import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDJCDLzfRLIuq5b_szHyeDIbvsPu91oz4Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'chhath-1948a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'chhath-1948a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'chhath-1948a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '861449125504',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:861449125504:web:e8482047f56cce56203065'
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim().length > 5 &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _googleProvider: GoogleAuthProvider | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) return null;
  if (!_app) {
    try {
      _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    } catch (e) {
      console.warn('[Firebase] App initialization warning:', e);
      return null;
    }
  }
  return _app;
};

export const getFirebaseAuth = (): Auth | null => {
  if (!isFirebaseConfigured()) return null;
  if (!_auth) {
    const app = getFirebaseApp();
    if (!app) return null;
    try {
      _auth = getAuth(app);
    } catch (e) {
      console.warn('[Firebase] Auth initialization warning:', e);
      return null;
    }
  }
  return _auth;
};

export const getGoogleProvider = (): GoogleAuthProvider | null => {
  if (!isFirebaseConfigured()) return null;
  if (!_googleProvider) {
    try {
      _googleProvider = new GoogleAuthProvider();
      _googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
    } catch (e) {
      console.warn('[Firebase] Google provider setup warning:', e);
      return null;
    }
  }
  return _googleProvider;
};
