import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { handleSearchApiRequest } from './server/searchMiddleware.ts';
import { handleAiAgentApiRequest } from './server/aiMiddleware.ts';
import { handleChatApiRequest } from './server/chatMiddleware.ts';
import { handleSocialApiRequest } from './server/socialMiddleware.ts';

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

      server.middlewares.use('/api/yt-search', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost:5173');
          const q = urlObj.searchParams.get('q');
          if (!q) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ results: [] }));
            return;
          }

          const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'hi,en-US;q=0.9,en;q=0.8'
            }
          });

          const html = await response.text();
          const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
          if (!match) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ results: [] }));
            return;
          }

          const data = JSON.parse(match[1]);
          const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
          const itemSection = contents?.find((c: any) => c.itemSectionRenderer)?.itemSectionRenderer?.contents;
          const videos = [];

          for (const item of itemSection || []) {
            if (item.videoRenderer) {
              const v = item.videoRenderer;
              if (v.videoId) {
                videos.push({
                  id: v.videoId,
                  title: v.title?.runs?.[0]?.text || '',
                  singer: v.ownerText?.runs?.[0]?.text || '',
                  duration: v.lengthText?.simpleText || '5:00',
                  thumbnail: v.thumbnail?.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
                  youtubeId: v.videoId
                });
              }
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ results: videos.slice(0, 15) }));
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
  base: './',
  plugins: [
    tailwindcss(),
    react(),
    youtubeSearchPlugin()
  ],
})
