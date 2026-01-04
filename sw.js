const CACHE_NAME = 'youtube-calendar-v1';
const urlsToCache = [
  '/youtube-calendar-pwa/',  '/index.html',
  '/youtube-calendar-pwa/styles.css',  '/app.js',
  '/youtube-calendar-pwa/app.js',  '/icon-192.png',
  '/youtube-calendar-pwa/manifest.json',];
  '/youtube-calendar-pwa/icon-192.png',
      '/youtube-calendar-pwa/icon-512.png'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
