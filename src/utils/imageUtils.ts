import React from 'react';

/**
 * Resolves an image path to work consistently on GitHub Pages (/CHHATH/) and local environments.
 */
export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/CHHATH/images/hero_sunrise.jpg';
  // Remote URLs or data URIs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Already formatted with /CHHATH/ prefix
  if (path.startsWith('/CHHATH/')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/CHHATH/';
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
