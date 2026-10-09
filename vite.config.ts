import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { handleSearchApiRequest } from './server/searchMiddleware.ts';
import { handleAiAgentApiRequest } from './server/aiMiddleware.ts';
import { handleChatApiRequest } from './server/chatMiddleware.ts';
import { handleSocialApiRequest } from './server/socialMiddleware.ts';

// @ts-ignore
import ytSearchHandler from './api/yt-search.js';

function youtubeSearchPlugin(): Plugin {
  return {
    name: 'youtube-search-middleware',
    configureServer(server) {
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
