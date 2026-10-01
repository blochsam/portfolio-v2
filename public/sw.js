/* Service worker: durably cache the heavy 3D scene asset.
 *
 * The Spline scene (`/scene.splinecode`) is large. The browser's plain HTTP
 * cache evicts big entries over time, which is what made repeat visits slow
 * again. Cache Storage is separate, under our control, and far more durable
 * for large files — so once a visitor has loaded the 3D scene, they keep it.
 *
 * Strategy: cache-first for the scene only. The URL carries a ?v=N version, so
 * a new scene version is a new URL (a natural cache miss that fetches fresh);
 * the CACHE name is bumped alongside it to drop the previous version's copy.
 * Every other request passes straight through to the network untouched.
 */
const CACHE = 'spline-scene-v3';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('spline-scene-') && k !== CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname !== '/scene.splinecode') {
    return; // not the scene — let the network handle it normally
  }
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then((resp) => {
            if (resp && resp.ok) cache.put(event.request, resp.clone());
            return resp;
          })
      )
    )
  );
});
