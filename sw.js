// UNTUK SEMENTARA, ONESIGNAL KITA MATIKAN DULU AGAR FOKUS KE PWA MURNI
// importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// KUNCI UPDATE: Ganti angka ini setiap kali mengubah file (misal: v1.2, v1.3)
const CACHE_VERSION = 'v4.3'; 
const CACHE_NAME = 'tpq-cache-' + CACHE_VERSION;

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo-192.png',
  './logo-512.png'
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

// Membersihkan "sampah" memori dari versi aplikasi yang lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('tpq-cache-')) {
            console.log('Menghapus versi aplikasi lama:', cacheName);
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
      return new Response('Aplikasi TPQ membutuhkan koneksi internet untuk memuat data.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Kode addEventListener('message') DIHAPUS karena PWA sekarang update otomatis
