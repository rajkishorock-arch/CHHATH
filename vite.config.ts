import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
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
    youtubeSearchPlugin()
  ],
})
