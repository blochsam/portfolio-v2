#!/usr/bin/env node
/**
 * Generates og-image.png: B&W headshot with Sam Bloch logo overlay.
 * Run: node scripts/generate-og-image.mjs
 */

import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const headshotPath = join(root, 'headshot.jpg');
const outputPath = join(root, 'public', 'og-image.png');

const TEAL = '#24A2A7';
const WIDTH = 1200;
const HEIGHT = 630;

// Logo SVG: SAM (white) BLOCH (teal), positioned bottom-left
const logoSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="transparent"/>
      <stop offset="0.5" stop-color="rgba(0,0,0,0.3)"/>
      <stop offset="1" stop-color="rgba(0,0,0,0.7)"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>
  <text x="60" y="560" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="72" letter-spacing="-2" fill="white">SAM</text>
  <text x="220" y="560" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="72" letter-spacing="-2" fill="${TEAL}">BLOCH</text>
</svg>
`;

async function generate() {
  if (!existsSync(headshotPath)) {
    console.error('headshot.jpg not found in project root');
    process.exit(1);
  }

  const headshot = await sharp(headshotPath)
    .grayscale()
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .toBuffer();

  const logo = Buffer.from(logoSvg.trim());

  await sharp(headshot)
    .composite([{ input: logo, top: 0, left: 0 }])
    .png()
    .toFile(outputPath);

  console.log('Generated:', outputPath);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
