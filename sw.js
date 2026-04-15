// Versi dinaikkan menjadi v5.1 untuk memicu update PWA
const CACHE_VERSION = 'v5.2'; 
const CACHE_NAME = 'musholla-cache-' + CACHE_VERSION;

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'  // <--- Logo lokal dimasukkan kembali ke memori
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan cache versi:', CACHE_VERSION);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && (cacheName.startsWith('musholla-cache-') || cacheName.startsWith('tpq-cache-'))) {
            console.log('Menghapus memori aplikasi versi lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return new Response('Aplikasi Musholla Nurul Haq membutuhkan koneksi internet untuk memuat data dari server.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
