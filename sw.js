// UNTUK SEMENTARA, ONESIGNAL KITA MATIKAN DULU AGAR FOKUS KE PWA MURNI
// importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// KUNCI UPDATE: Versi dinaikkan menjadi v5.0 untuk memaksa HP jamaah memuat tampilan Musholla yang baru
const CACHE_VERSION = 'v5.0'; 
const CACHE_NAME = 'musholla-cache-' + CACHE_VERSION;

const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // File logo lokal dihapus dari sini karena kita sudah menggunakan link Google Drive langsung
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan cache versi:', CACHE_VERSION);
      return cache.addAll(urlsToCache);
    })
  );
  // KARENA TIDAK ADA TOMBOL UPDATE LAGI, KITA PAKSA LANGSUNG UPDATE OTOMATIS:
  self.skipWaiting(); 
});

// Membersihkan "sampah" memori dari versi aplikasi yang lama (Termasuk memori TPQ yang lama)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Hapus semua cache lama, baik yang bernama 'tpq-cache' maupun 'musholla-cache' yang angkanya lebih kecil
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
      // Pesan otomatis saat HP jamaah tidak ada kuota/internet
      return new Response('Aplikasi Musholla Nurul Haq membutuhkan koneksi internet untuk memuat data dari server.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
