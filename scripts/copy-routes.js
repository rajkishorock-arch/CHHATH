import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  'chhath-puja-vidhi',
  'chhath-samagri',
  'chhath-arghya-time-2026',
  'chhath-arghya-time',
  'thekua-recipe',
  'prasad',
  'aarti',
  'chhath-puja-geet',
  'chhath-puja-katha',
  'chhath-calendar-2026',
  'chhath-puja-date-2026',
  'patna-chhath-puja-2026',
  'settings',
  'all-features',
  'features',
  'jap-mala',
  'mala',
  'login',
  'signup',
  '3d-ghat',
  'ghat-3d',
  'blessing-certificate',
  'certificate',
  'chhath-memories',
  'memories',
  'chhath-quiz',
  'quiz',
  'ai-pandit',
  'explore',
  'explore-detailed',
  'all-vrats',
  'vrats',
  'vrat-katha',
  'aarti-sangrah',
  'paath-chalisa',
  'shubh-vichar',
  'famous-temples',
  'puja-vidhi',
  'samagri-list',
  'mantra-list',
  'panchang-calendar',
  'calendar',
  'chhath'
];

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  const baseUrl = 'https://chhathvibes.vercel.app';

  routes.forEach((route) => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    const routeCanonical = `${baseUrl}/${route}`;
    const routeHtml = indexHtml
      .replace(
        '<link rel="canonical" href="https://chhathvibes.vercel.app/" />',
        `<link rel="canonical" href="${routeCanonical}" />`
      )
      .replace(
        '<meta property="og:url" content="https://chhathvibes.vercel.app/" />',
        `<meta property="og:url" content="${routeCanonical}" />`
      );
    fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf-8');
    console.log(`[post-build] Successfully created ${route}/index.html for clean route serving`);
  });

  // Also mirror routes to dist/CHHATH/ for legacy paths and GitHub Pages
  const chhathDir = path.join(distDir, 'CHHATH');
  if (!fs.existsSync(chhathDir)) {
    fs.mkdirSync(chhathDir, { recursive: true });
  }
  fs.writeFileSync(path.join(chhathDir, 'index.html'), indexHtml, 'utf-8');

  routes.forEach((route) => {
    const chhathRouteDir = path.join(chhathDir, route);
    if (!fs.existsSync(chhathRouteDir)) {
      fs.mkdirSync(chhathRouteDir, { recursive: true });
    }
    const routeCanonical = `${baseUrl}/${route}`;
    const routeHtml = indexHtml
      .replace(
        '<link rel="canonical" href="https://chhathvibes.vercel.app/" />',
        `<link rel="canonical" href="${routeCanonical}" />`
      )
      .replace(
        '<meta property="og:url" content="https://chhathvibes.vercel.app/" />',
        `<meta property="og:url" content="${routeCanonical}" />`
      );
    fs.writeFileSync(path.join(chhathRouteDir, 'index.html'), routeHtml, 'utf-8');
  });
  console.log(`[post-build] Successfully mirrored routes to CHHATH/ prefix`);

  // Mirror APK to CHHATH/ prefix for GitHub Pages direct download
  const apkSrc = path.join(distDir, 'chhath-app-debug.apk');
  const apkDest = path.join(chhathDir, 'chhath-app-debug.apk');
  if (fs.existsSync(apkSrc)) {
    fs.copyFileSync(apkSrc, apkDest);
    console.log(`[post-build] Copied chhath-app-debug.apk to CHHATH/ prefix`);
  }

  // Ensure gh-pages branch has a safe vercel.json so Vercel doesn't fail with vite not found
  const distVercelConfig = {
    cleanUrls: true,
    ignoreCommand: "exit 0",
    buildCommand: "echo 'Static branch - no build required'",
    outputDirectory: "."
  };
  fs.writeFileSync(path.join(distDir, 'vercel.json'), JSON.stringify(distVercelConfig, null, 2), 'utf-8');

  // Provide dummy package.json for gh-pages branch
  const distPkg = {
    name: "chhath-static",
    version: "1.0.0",
    private: true,
    scripts: {
      build: "echo 'Already built'"
    }
  };
  fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(distPkg, null, 2), 'utf-8');
} else {
  console.warn('[post-build] dist/index.html not found!');
}
