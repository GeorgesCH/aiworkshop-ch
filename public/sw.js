// Optimized service worker for AI Workshop - LCP optimization
const CACHE_NAME = 'aiworkshop-v3';
const CRITICAL_CACHE = 'aiworkshop-critical-v3';

// Critical resources for LCP optimization
const criticalUrlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/fonts/sigum/Sigum.woff2',
  '/@optimized/AI-Workshop_Logo_light-optimized.webp',
  '/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    Promise.all([
      caches.open(CRITICAL_CACHE).then((cache) => cache.addAll(criticalUrlsToCache)),
      caches.open(CACHE_NAME).then((cache) => cache.addAll(criticalUrlsToCache))
    ])
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

// Optimized fetch strategy for LCP
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
  
  // Critical resources - cache first for LCP optimization
  if (criticalUrlsToCache.some(criticalUrl => url.pathname === criticalUrl)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CRITICAL_CACHE).then((cache) => cache.put(req, copy));
          return res;
        });
      })
    );
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
  
  // Other resources - cache first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
