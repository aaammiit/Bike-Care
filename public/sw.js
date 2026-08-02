const CACHE_NAME = 'rana-bike-care-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event - Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old cache storage immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Smart Network-First strategy to ensure codebase updates reflect immediately
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ignore non-GET requests, non-http, or chrome extension requests
  if (req.method !== 'GET' || !req.url.startsWith('http')) {
    return;
  }

  // Network-First Strategy for Code, HTML, JS, CSS, and API/JSON requests
  // This guarantees that any changes to your code base are fetched immediately from network
  const url = new URL(req.url);
  const isCodeOrDoc = 
    req.mode === 'navigate' ||
    req.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json') ||
    url.pathname.includes('/src/') ||
    url.pathname.includes('@vite') ||
    url.pathname.includes('@id');

  if (isCodeOrDoc) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[SW] Network offline, falling back to cached code:', req.url);
          const cachedResponse = await caches.match(req);
          if (cachedResponse) return cachedResponse;
          const rootCached = await caches.match('/index.html');
          return rootCached || caches.match('/') || Response.error();
        })
    );
    return;
  }

  // Stale-While-Revalidate / Cache-First for static media assets (images, fonts, sounds)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[SW] Asset fetch failed, using cache for:', req.url);
        });

      return cachedResponse || fetchPromise;
    })
  );
});
