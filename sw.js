// SELF-DESTRUCT SERVICE WORKER
// This ensures no old files are served from cache.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Unregister this worker immediately after activation
  self.registration.unregister()
    .then(() => {
      return self.clients.matchAll();
    })
    .then((clients) => {
      clients.forEach((client) => {
        // Force refresh the page to get network content
        client.navigate(client.url);
      });
    });
});

self.addEventListener('fetch', (event) => {
  // Pass everything to network, no caching
  event.respondWith(fetch(event.request));
});