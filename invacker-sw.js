const cacheName = 'investment-tracker-v1';

// Install event (activated when the service worker is registered)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return fetch('/manifest.json') // Assuming manifest.json is at the root
          .then(response => response.json())
          .then(manifest => {
            const iconUrls = manifest.icons.map(icon => icon.src);
            return cache.addAll([...iconUrls, '/', '/index.html', '/style.css', '/main.js', '/script.js', '/manifest.json']);
          });
      })
  );
});

// Fetch event (triggered for any network request)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If found in cache, return cached response
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not cached, fetch from network and cache the response
        return fetch(event.request)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, response.clone());
                return response;
              });
          })
          .catch(error => {
            // Handle network errors (show offline UI or retry logic)
            console.error('Error fetching resource:', error);
            // You can return a fallback here (e.g., a static error page)
          });
      })
  );
});
