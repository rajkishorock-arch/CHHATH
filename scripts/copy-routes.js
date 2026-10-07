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
  'login',
  'signup',
  '3d-ghat',
  'ghat-3d'
];

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  routes.forEach((route) => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf-8');
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
    fs.writeFileSync(path.join(chhathRouteDir, 'index.html'), indexHtml, 'utf-8');
  });
  console.log(`[post-build] Successfully mirrored routes to CHHATH/ prefix`);
} else {
  console.warn('[post-build] dist/index.html not found!');
}
