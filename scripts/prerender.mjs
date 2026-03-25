#!/usr/bin/env node
/**
 * Pre-render static HTML for each route using Playwright.
 *
 * Run after `vite build`. Starts a local server from dist/, visits each
 * route in a real Chromium browser, and writes the serialized HTML back
 * to dist/ so search engines and social scrapers get real content.
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Routes to pre-render. Skip /3d (requires WebGL).
const ROUTES = [
  '/',
  '/resume',
  '/projects',
  '/projects/portfolio',
  '/projects/fudge',
  '/projects/level-up',
  '/projects/uc-calnat',
  '/projects/zoo-report',
  '/projects/dcade',
  '/projects/smart-lockers',
];

/**
 * Simple static file server for the dist directory.
 * Serves index.html for any path without a file extension (SPA fallback).
 */
function startServer(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);

      // SPA fallback: if no extension, serve index.html
      if (!filePath.includes('.')) {
        filePath = join(DIST, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const mimeTypes = {
          html: 'text/html',
          js: 'application/javascript',
          css: 'text/css',
          json: 'application/json',
          webp: 'image/webp',
          png: 'image/png',
          ico: 'image/x-icon',
          svg: 'image/svg+xml',
          woff2: 'font/woff2',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
      } catch {
        // File not found, serve index.html (SPA fallback)
        try {
          const fallback = readFileSync(join(DIST, 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fallback);
        } catch {
          res.writeHead(404);
          res.end('Not Found');
        }
      }
    });

    server.listen(port, () => {
      console.log(`  Static server on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function prerender() {
  const PORT = 4173;

  // Verify dist exists
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('Error: dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }

  console.log('\nPre-rendering routes...\n');

  const server = await startServer(PORT);
  const browser = await chromium.launch({ headless: true });

  let successCount = 0;
  let failCount = 0;

  for (const route of ROUTES) {
    try {
      const context = await browser.newContext({
        // Mobile viewport forces ExperienceDefault to render 2D (SEO-visible)
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        isMobile: true,
      });

      const page = await context.newPage();

      // Suppress console noise from the app
      page.on('pageerror', () => {});

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // Wait for React to render and effects (usePageMeta) to fire
      await page.waitForTimeout(3000);

      // Get the full rendered HTML
      const html = await page.content();

      // Determine output path
      let outPath;
      if (route === '/') {
        outPath = join(DIST, 'index.html');
      } else {
        const dir = join(DIST, route.slice(1));
        mkdirSync(dir, { recursive: true });
        outPath = join(dir, 'index.html');
      }

      writeFileSync(outPath, html, 'utf-8');

      // Validate meta tags were populated
      const hasTitle = html.includes('<title>') && !html.includes('<title></title>');
      const hasDesc = html.includes('name="description" content="') &&
                      !html.includes('content=""');
      const status = hasTitle && hasDesc ? '  OK' : '  WARN (missing meta)';
      console.log(`  ${status}  ${route}`);

      successCount++;
      await context.close();
    } catch (err) {
      console.error(`  FAIL  ${route}: ${err.message}`);
      failCount++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPre-rendered ${successCount}/${ROUTES.length} routes.`);
  if (failCount > 0) {
    console.error(`${failCount} route(s) failed.`);
    process.exit(1);
  }
}

prerender().catch((err) => {
  console.error('Pre-render failed:', err);
  process.exit(1);
});
