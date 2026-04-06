importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
// KUNCI UPDATE: Ganti angka ini setiap kali Anda mengubah kode di GitHub (misal: v1.1, v1.2)
const CACHE_VERSION = 'v1.1';
const CACHE_NAME = 'tpq-cache-' + CACHE_VERSION;

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './Logo%20192.png',
  './Logo%20512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan cache versi:', CACHE_VERSION);
      return cache.addAll(urlsToCache);
    })
  );
  // Kita sengaja TIDAK pakai self.skipWaiting() otomatis di sini,
  // agar kita bisa memunculkan tombol "Update" di layar HP pengguna.
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
      return new Response('Aplikasi TPQ membutuhkan koneksi internet untuk memuat data baru.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Menerima perintah "Perbarui" dari tombol di layar HP pengguna
self.addEventListener('message', (event) => {
  // KODE YANG DIPERBAIKI:
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
