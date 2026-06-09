// Downloads the Spline scene file from Spline's CDN into /public so it can be
// served from Vercel's edge network (with automatic brotli compression and
// long-lived cache headers configured in vercel.json).
//
// Runs automatically as a `prebuild` step on Vercel and locally. Skips the
// download if a fresh copy already exists on disk.
//
// To force a re-download (e.g. after updating the scene in Spline), delete
// public/scene.splinecode and run `npm run build` — or run this script directly:
//   node scripts/fetch-spline-scene.mjs
import { writeFile, stat, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCENE_URL = 'https://prod.spline.design/PWw4ZCT9Of0-KIiv/scene.splinecode';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'scene.splinecode');

async function main() {
  // Skip if file already exists (local dev convenience — avoids re-downloading
  // 35MB on every `npm run build`). CI builds start clean so this always runs.
  try {
    const existing = await stat(OUTPUT_PATH);
    if (existing.size > 1_000_000) {
      console.log(`[spline] scene already present (${(existing.size / 1024 / 1024).toFixed(1)}MB), skipping download`);
      return;
    }
  } catch {
    // File doesn't exist — proceed with download
  }

  console.log(`[spline] fetching scene from ${SCENE_URL}`);
  const started = Date.now();

  const response = await fetch(SCENE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Spline scene: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, buffer);

  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`[spline] saved ${sizeMB}MB to public/scene.splinecode in ${elapsed}s`);
}

main().catch((err) => {
  console.error('[spline] download failed:', err);
  process.exit(1);
});
