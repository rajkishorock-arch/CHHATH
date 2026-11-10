import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { handleSearchApiRequest } from './server/searchMiddleware.ts';
import { handleAiAgentApiRequest } from './server/aiMiddleware.ts';
import { handleChatApiRequest } from './server/chatMiddleware.ts';
import { handleSocialApiRequest } from './server/socialMiddleware.ts';

// @ts-ignore
import ytSearchHandler from './api/yt-search.js';
// @ts-ignore
import ytSuggestHandler from './api/yt-suggest.js';

function youtubeSearchPlugin(): Plugin {
  return {
    name: 'youtube-search-middleware',
    configureServer(server) {
      // Direct static fallback: Serve /images and /icons directly from public if requested at origin root
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url && (url.startsWith('/images/') || url.startsWith('/icons/') || url.startsWith('/my-puja.png') || url.startsWith('/favicon.ico'))) {
          const filePath = path.join(__dirname, 'public', url);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.ico': 'image/x-icon'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            return fs.createReadStream(filePath).pipe(res);
          }
        }
        next();
      });

      // Backend Social Architecture REST API Endpoint: /api/v1/*
      server.middlewares.use('/api/v1', async (req, res) => {
        await handleSocialApiRequest(req, res);
      });

      // Backend Chhath Connect Chat & Signaling Endpoint: /api/chat/*
      server.middlewares.use('/api/chat', async (req, res) => {
        await handleChatApiRequest(req, res);
      });

      // Backend AI Agent Endpoint: POST /api/ai/agent
      server.middlewares.use('/api/ai/agent', async (req, res) => {
        await handleAiAgentApiRequest(req, res);
      });

      // Backend Global Search Endpoint: GET /api/search?q=...
      server.middlewares.use('/api/search', async (req, res) => {
        await handleSearchApiRequest(req, res);
      });

      // Dedicated High-Speed Live YouTube Search & Endless Pagination: GET /api/yt-search?q=...&pageToken=...
      server.middlewares.use('/api/yt-search', async (req, res) => {
        try {
          await ytSearchHandler(req, res);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message, results: [] }));
        }
      });

      // Real-time YouTube Autocomplete Suggestions: GET /api/yt-suggest?q=...
      server.middlewares.use('/api/yt-suggest', async (req, res) => {
        try {
          await ytSuggestHandler(req, res);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message, suggestions: [] }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.VERCEL || process.env.RENDER ? '/' : '/CHHATH/'),
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.png',
        'favicon.svg',
        'apple-touch-icon.png',
        'icons.svg',
        'images/*',
        'silent.wav',
        'robots.txt',
        'sitemap.xml'
      ],
      manifest: {
        id: '/',
        name: 'छठ महापर्व | Chhath Vibes',
        short_name: 'छठ महापर्व',
        description: 'सूर्य उपासना एवं आस्था के महापर्व छठ की संपूर्ण जानकारी, पूजा विधि, अर्घ्य समय, लोकगीत एवं पंचांग',
        theme_color: '#E65100',
        background_color: '#0c0a09',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'hi',
        categories: ['lifestyle', 'social', 'music'],
        icons: [
          {
            src: '/favicon.png',
            sizes: '64x64 96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180 192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/chhath_app_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,wav,json}'],
        globIgnores: ['**/*.apk', '**/*.mp4'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/__\/auth\//, /\.[a-z0-9]+$/i],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Google Fonts Stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            // Google Fonts Webfonts
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Local and static image assets
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 60 // 60 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // YouTube Thumbnails (for offline display of saved playlists/favorites)
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'yt-thumbnails-cache',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 14 // 14 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // CRITICAL NETWORK ONLY: YouTube streaming audio and video
            urlPattern: /^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/.*|^https:\/\/.*\.googlevideo\.com\/.*/i,
            handler: 'NetworkOnly'
          },
          {
            // CRITICAL NETWORK ONLY: Auth, AI, Chat, Search endpoints
            urlPattern: /\/api\/(?:v1\/auth|v1\/sessions|ai|chat|yt-search|yt-suggest).*/i,
            handler: 'NetworkOnly'
          },
          {
            // Non-sensitive APIs: NetworkFirst with cache fallback
            urlPattern: /\/api\/(?:search|v1\/profiles).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-content-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    youtubeSearchPlugin()
  ],
})
