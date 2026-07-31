const CACHE_NAME = 'rana-bike-care-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx'
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

// Activate Event - Clean up old cache storage
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

// Fetch Event - Smart offline caching strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ignore non-GET requests or chrome extension schemes
  if (req.method !== 'GET' || !req.url.startsWith('http')) {
    return;
  }

  // Strategy 1: HTML / Navigation Requests -> Network First, fallback to Cache
  if (req.mode === 'navigate' || (req.headers.get('accept') && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
          }
          return response;
        })
        .catch(async () => {
          console.log('[SW] Network unreachable, serving cached HTML:', req.url);
          const cachedResponse = await caches.match(req);
          if (cachedResponse) return cachedResponse;
          const rootCached = await caches.match('/index.html');
          if (rootCached) return rootCached;
          const fallbackCached = await caches.match('/');
          return fallbackCached || Response.error();
        })
    );
    return;
  }

  // Strategy 2: Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate / Cache First
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
          console.log('[SW] Asset fetch failed, using cache if available for:', req.url);
        });

      // Return cached version immediately if available, otherwise wait for network fetch
      return cachedResponse || fetchPromise;
    })
  );
});
