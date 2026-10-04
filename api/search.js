/**
 * Vercel Serverless Function: /api/search
 * Handles global search queries for Chhath media, videos, and songs using real-time YouTube InnerTube API.
 */

import ytHandler from './yt-search.js';

export default async function handler(req, res) {
  return ytHandler(req, res);
}
