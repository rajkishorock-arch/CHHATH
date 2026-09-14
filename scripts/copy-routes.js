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
  'chhath-puja-geet',
  'chhath-puja-katha',
  'chhath-calendar-2026'
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
    console.log(`[post-build] Successfully created ${route}/index.html for GitHub Pages clean route serving`);
  });
} else {
  console.warn('[post-build] dist/index.html not found!');
}
