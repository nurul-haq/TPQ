const CACHE_NAME = 'tpq-cache-v2';

// 1. Daftar file cangkang yang akan disimpan permanen di HP (Cache)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './Logo%20192.png',
  './Logo%20512.png'
];

// 2. Saat pertama kali diinstal, simpan file-file di atas ke memori HP
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Membuka cache dan menyimpan file cangkang...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. Saat aplikasi dibuka, tampilkan cangkang dari memori HP agar super cepat
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file ada di memori HP, langsung tampilkan (cepat & bisa offline)
      // Jika tidak ada (seperti request ke Google Script), ambil dari internet
      return response || fetch(event.request);
    }).catch(() => {
      // Jika tidak ada internet sama sekali dan file tidak ada di cache
      return new Response('Aplikasi TPQ membutuhkan koneksi internet untuk memuat data.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
