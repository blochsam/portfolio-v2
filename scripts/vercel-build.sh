#!/bin/bash
# Vercel build: site build + static prerender for SEO.
# The build image is Amazon Linux and lacks Chromium's shared libraries,
# so install them before Playwright launches its headless shell.
set -euo pipefail

node scripts/fetch-spline-scene.mjs
vite build

if [ -n "${VERCEL:-}" ]; then
  echo "Installing Chromium system libraries..."
  (dnf install -y nss nspr atk at-spi2-atk cups-libs libdrm libXcomposite \
      libXdamage libXrandr libXfixes libxkbcommon mesa-libgbm alsa-lib pango \
    || yum install -y nss nspr atk at-spi2-atk cups-libs libdrm libXcomposite \
      libXdamage libXrandr libXfixes libxkbcommon mesa-libgbm alsa-lib pango)
fi

npx playwright install chromium
node scripts/prerender.mjs
