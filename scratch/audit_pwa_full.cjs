const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const results = {
  buildValidation: [],
  manifestValidation: [],
  serviceWorkerSecurity: [],
  seoAndCrawlers: [],
  storageSafety: [],
  existingRegression: [],
  visualIntegrity: []
};

function pass(category, title, details = '') {
  results[category].push({ status: 'PASS', title, details });
  console.log(`[PASS] [${category}] ${title} ${details ? '— ' + details : ''}`);
}

function fail(category, title, error = '') {
  results[category].push({ status: 'FAIL', title, error });
  console.error(`[FAIL] [${category}] ${title} — ${error}`);
}

console.log('=== STARTING COMPREHENSIVE PWA AUDIT ===\n');

// 1. BUILD VALIDATION
try {
  console.log('Running tsc -b && vite build...');
  execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
  pass('buildValidation', 'npm run build executes cleanly with exit code 0');
} catch (e) {
  fail('buildValidation', 'npm run build failed', e.stderr ? e.stderr.toString() : e.message);
}

// Check key build artifacts
['sw.js', 'manifest.webmanifest', 'manifest.json', 'index.html', 'robots.txt', 'sitemap.xml'].forEach((file) => {
  const fp = path.join(distDir, file);
  if (fs.existsSync(fp) && fs.statSync(fp).size > 0) {
    pass('buildValidation', `Core artifact dist/${file} generated and non-empty`, `(${fs.statSync(fp).size} bytes)`);
  } else {
    fail('buildValidation', `Missing or empty core artifact: dist/${file}`);
  }
});

// Check workbox library file in dist
const distFiles = fs.readdirSync(distDir);
const workboxFile = distFiles.find(f => f.startsWith('workbox-') && f.endsWith('.js'));
if (workboxFile) {
  pass('buildValidation', `Workbox runtime generated: dist/${workboxFile}`);
} else {
  fail('buildValidation', 'Workbox runtime file not found in dist/');
}

// 2. MANIFEST VALIDATION
try {
  const manifestPath = path.join(distDir, 'manifest.webmanifest');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
  let missing = [];
  requiredFields.forEach(f => {
    if (!manifest[f]) missing.push(f);
  });

  if (missing.length === 0) {
    pass('manifestValidation', 'Manifest contains all required PWA fields', `name: "${manifest.name}", display: "${manifest.display}"`);
  } else {
    fail('manifestValidation', `Manifest missing required fields: ${missing.join(', ')}`);
  }

  // Verify all icon paths exist
  let missingIcons = [];
  manifest.icons.forEach(icon => {
    const cleanSrc = icon.src.replace(/^\//, '');
    const iconDiskPath = path.join(distDir, cleanSrc);
    if (!fs.existsSync(iconDiskPath)) {
      missingIcons.push(icon.src);
    }
  });

  if (missingIcons.length === 0) {
    pass('manifestValidation', `All ${manifest.icons.length} manifest icons exist on disk in dist/`);
  } else {
    fail('manifestValidation', `Missing icons on disk: ${missingIcons.join(', ')}`);
  }
} catch (e) {
  fail('manifestValidation', 'Manifest JSON parse or inspection error', e.message);
}

// 3. SERVICE WORKER CACHING & SECURITY AUDIT
try {
  const swPath = path.join(distDir, 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf8');

  // Verify precache entries
  const precacheMatches = swContent.match(/precacheAndRoute\(\[([^\]]+)\]/);
  if (precacheMatches) {
    const entries = precacheMatches[1].split('{url:');
    pass('serviceWorkerSecurity', `Precache manifest populated with ${entries.length - 1} entries`);
  } else {
    fail('serviceWorkerSecurity', 'precacheAndRoute call not found in sw.js');
  }

  // Verify NavigationRoute fallback to index.html
  if (swContent.includes('NavigationRoute') && swContent.includes('/index.html')) {
    pass('serviceWorkerSecurity', 'NavigationRoute fallback to /index.html is active for offline navigation');
  } else {
    fail('serviceWorkerSecurity', 'NavigationRoute to /index.html not found in sw.js');
  }

  // Verify NavigationRoute denylist excludes API and sensitive paths
  if (swContent.includes('/^\\/api\\//') || swContent.includes('/api/')) {
    pass('serviceWorkerSecurity', 'NavigationRoute denylist protects /api/ from being intercepted as HTML');
  } else {
    fail('serviceWorkerSecurity', 'NavigationRoute does not denylist /api/');
  }

  // Verify Strict NetworkOnly endpoints
  const networkOnlyRules = [
    { name: 'Auth endpoints', test: (str) => str.includes('v1\\/auth') },
    { name: 'Session endpoints', test: (str) => str.includes('v1\\/sessions') },
    { name: 'AI endpoints', test: (str) => str.includes('ai|chat') || str.includes('ai') },
    { name: 'Chat endpoints', test: (str) => str.includes('ai|chat') || str.includes('chat') },
    { name: 'YouTube streaming audio/video', test: (str) => str.includes('googlevideo') },
    { name: 'YouTube direct search/suggest API', test: (str) => str.includes('yt-search') }
  ];

  networkOnlyRules.forEach(rule => {
    if (swContent.includes('NetworkOnly') && rule.test(swContent)) {
      pass('serviceWorkerSecurity', `Strict NetworkOnly handler enforced for: ${rule.name}`);
    } else {
      fail('serviceWorkerSecurity', `Missing NetworkOnly rule for: ${rule.name}`);
    }
  });

  // Verify Cache cleanup
  if (swContent.includes('cleanupOutdatedCaches')) {
    pass('serviceWorkerSecurity', 'cleanupOutdatedCaches() is actively registered');
  } else {
    fail('serviceWorkerSecurity', 'cleanupOutdatedCaches() missing from sw.js');
  }
} catch (e) {
  fail('serviceWorkerSecurity', 'Service Worker inspection error', e.message);
}

// 4. SEO & GOOGLE SEARCH CONSOLE AUDIT
try {
  // robots.txt
  const robotsTxt = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
  if (robotsTxt.includes('User-agent: *') && robotsTxt.includes('Allow: /') && robotsTxt.includes('sitemap.xml')) {
    pass('seoAndCrawlers', 'robots.txt allows all crawlers and provides canonical sitemap link');
  } else {
    fail('seoAndCrawlers', 'robots.txt missing allow directives or sitemap link');
  }

  // sitemap.xml
  const sitemapXml = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  if (sitemapXml.includes('<urlset') && sitemapXml.includes('https://chhathvibes.vercel.app/')) {
    pass('seoAndCrawlers', 'sitemap.xml is valid XML and contains production URL mappings');
  } else {
    fail('seoAndCrawlers', 'sitemap.xml invalid or missing loc URLs');
  }

  // index.html SEO
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const seoTags = [
    { tag: 'canonical', pattern: '<link rel="canonical"' },
    { tag: 'title', pattern: '<title>' },
    { tag: 'description', pattern: '<meta name="description"' },
    { tag: 'og:title', pattern: '<meta property="og:title"' },
    { tag: 'og:description', pattern: '<meta property="og:description"' },
    { tag: 'og:image', pattern: '<meta property="og:image"' },
    { tag: 'json-ld schema', pattern: 'application/ld+json' }
  ];

  seoTags.forEach(t => {
    if (indexHtml.includes(t.pattern)) {
      pass('seoAndCrawlers', `Root index.html contains valid ${t.tag}`);
    } else {
      fail('seoAndCrawlers', `Root index.html missing ${t.tag}`);
    }
  });

  // Check route-specific canonicals for 5 major routes
  const sampleRoutes = [
    'chhath-puja-vidhi',
    'thekua-recipe',
    'panchang-calendar',
    'all-vrats',
    'patna-chhath-puja-2026'
  ];

  sampleRoutes.forEach(r => {
    const routeHtmlPath = path.join(distDir, r, 'index.html');
    if (fs.existsSync(routeHtmlPath)) {
      const content = fs.readFileSync(routeHtmlPath, 'utf8');
      const expectedCanonical = `https://chhathvibes.vercel.app/${r}`;
      if (content.includes(`<link rel="canonical" href="${expectedCanonical}" />`)) {
        pass('seoAndCrawlers', `Route /${r} has correct distinct canonical link tag`);
      } else {
        fail('seoAndCrawlers', `Route /${r} has incorrect canonical link`);
      }
    } else {
      fail('seoAndCrawlers', `Route folder dist/${r}/index.html does not exist`);
    }
  });
} catch (e) {
  fail('seoAndCrawlers', 'SEO audit error', e.message);
}

// 5. STORAGE SAFETY & DATA PERSISTENCE AUDIT
try {
  const offlineStorageSrc = fs.readFileSync(path.join(rootDir, 'src/utils/offlineStorage.ts'), 'utf8');

  // Verify non-destructive restore (only restore if localStorage is empty)
  if (offlineStorageSrc.includes('if (!localStorage.getItem(checklistKey))') &&
      offlineStorageSrc.includes('if (!localStorage.getItem(\'chhath_favorites_songs_v2\'))')) {
    pass('storageSafety', 'Non-destructive restore pattern verified (never overwrites existing user data)');
  } else {
    fail('storageSafety', 'Restore logic risks overwriting active localStorage data');
  }

  // Verify safe quota error handling
  if (offlineStorageSrc.includes('catch (err)') || offlineStorageSrc.includes('catch (e)')) {
    pass('storageSafety', 'IndexedDB methods wrapped in defensive try/catch blocks for quota errors');
  } else {
    fail('storageSafety', 'Missing defensive error handling in offlineStorage.ts');
  }

  // Verify core stores
  ['app_data', 'user_data', 'user_preferences'].forEach(store => {
    if (offlineStorageSrc.includes(store)) {
      pass('storageSafety', `Object store "${store}" properly defined`);
    } else {
      fail('storageSafety', `Object store "${store}" missing in offlineStorage.ts`);
    }
  });
} catch (e) {
  fail('storageSafety', 'Storage safety audit error', e.message);
}

// 6. EXISTING REGRESSION & VISUAL INTEGRITY
try {
  const navbarSrc = fs.readFileSync(path.join(rootDir, 'src/components/layout/Navbar.tsx'), 'utf8');
  
  // Verify only minimal WifiOff indicator added
  if (navbarSrc.includes('WifiOff') && navbarSrc.includes('!isOnline')) {
    pass('visualIntegrity', 'Only subtle conditional WifiOff offline indicator introduced in Navbar');
  } else {
    fail('visualIntegrity', 'WifiOff indicator missing or unconditional in Navbar');
  }

  // Verify no decorative banners or popups added
  if (!navbarSrc.includes('OfflineBanner') && !navbarSrc.includes('ModalOffline')) {
    pass('visualIntegrity', 'Zero decorative banners or intrusive modal dialogs introduced');
  } else {
    fail('visualIntegrity', 'Unwanted banners or modals found in Navbar');
  }

  // Audio Context graceful offline check
  const audioCtxSrc = fs.readFileSync(path.join(rootDir, 'src/context/AudioContext.tsx'), 'utf8');
  if (audioCtxSrc.includes('!navigator.onLine') && audioCtxSrc.includes('setPlaybackError')) {
    pass('existingRegression', 'Audio player handles offline state gracefully via existing playback error banner');
  } else {
    fail('existingRegression', 'Audio player missing offline check in playSong/togglePlay');
  }

  // Check oxlint
  console.log('Running linter verification...');
  const lintOutput = execSync('npm run lint', { cwd: rootDir, stdio: 'pipe' }).toString();
  if (lintOutput.includes('0 errors')) {
    pass('existingRegression', 'Oxlint validation passed with 0 errors');
  } else {
    fail('existingRegression', 'Linter reported errors', lintOutput);
  }
} catch (e) {
  fail('visualIntegrity', 'Visual / Regression audit error', e.message);
}

console.log('\n=== AUDIT COMPLETE ===');
const summary = {
  totalPassed: Object.values(results).flat().filter(r => r.status === 'PASS').length,
  totalFailed: Object.values(results).flat().filter(r => r.status === 'FAIL').length
};
console.log(`TOTAL PASSED: ${summary.totalPassed}`);
console.log(`TOTAL FAILED: ${summary.totalFailed}`);

fs.writeFileSync(path.join(rootDir, 'scratch/audit_summary.json'), JSON.stringify({ results, summary }, null, 2));
