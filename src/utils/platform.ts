import { Capacitor } from '@capacitor/core';

export const isNativeApp = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export const getApkDownloadUrl = (): string => {
  try {
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      return 'https://chhathvibes.vercel.app/chhath-app-debug.apk';
    }
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}chhath-app-debug.apk`;
  } catch {
    return 'https://chhathvibes.vercel.app/chhath-app-debug.apk';
  }
};
