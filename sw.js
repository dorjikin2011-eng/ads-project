const CACHE_NAME = 'ads-v13-fix';
// Only cache critical external assets and the entry point.
// Do NOT cache .tsx files or index.html aggressively.
const urlsToCache = [
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://rsms.me/inter/inter.css',
  'https://picsum.photos/100',
  'https://www.acc.org.bt/wp-content/uploads/2021/08/ACC-Location.png',
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Network First strategy for HTML to avoid getting stuck with bad versions
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});