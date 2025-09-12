// Basic service worker for AI Workshop
const CACHE_NAME = 'aiworkshop-v2';
// Only precache concrete, stable URLs; hashed assets are cached via HTTP headers
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Network-first for HTML, cache-first for others
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  
  // Skip service worker for localhost development
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.port === '5174') {
    return;
  }
  
  // Skip service worker for Vite development server paths
  if (url.pathname.includes('@vite') || url.pathname.includes('@react-refresh') || url.pathname.includes('src/')) {
    return;
  }
  
  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
