import React from 'react';

/**
 * Resolves an image path to work consistently on GitHub Pages (/CHHATH/) and local environments.
 */
export const getImageUrl = (path: string | undefined | null): string => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  if (!path) return `${normalizedBase}images/hero_sunrise.jpg`;
  // Remote URLs or data URIs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  // Already formatted with /CHHATH/ prefix
  if (path.startsWith('/CHHATH/')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${cleanPath}`;
};

/**
 * Resolves a video path to work consistently on GitHub Pages (/CHHATH/) and local/custom root domains.
 */
export const getVideoUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/CHHATH/')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
};

/**
 * Safe Image Error Handler to prevent infinite error loops and 404 requests.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackPath: string = '/images/hero_sunrise.jpg'
) => {
  const target = e.currentTarget;
  target.onerror = null; // Prevent infinite error loops
  target.src = getImageUrl(fallbackPath);
};
