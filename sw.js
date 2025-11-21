// SELF-DESTRUCT SERVICE WORKER
// This replaces the old worker and ensures no caching happens.

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (e) => {
  // Tell the active service worker to take control of the page immediately.
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => client.navigate(client.url)); // Force reload
    });
});

self.addEventListener('fetch', (e) => {
  // Do not cache anything. Pass through to network.
  e.respondWith(fetch(e.request));
});