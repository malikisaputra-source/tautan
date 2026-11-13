/* Service worker sederhana: simpan berkas aplikasi supaya bisa dibuka tanpa internet. Naikkan VERSI tiap ubah berkas. */
var VERSI = 'absensi-v2';
var BERKAS = ['./', 'index.html', 'style.css', 'app.js', 'tema.css', 'tema.js', 'ikon.svg', 'manifest.json', 'img/logo.svg', 'img/karyawan.svg'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(BERKAS); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== VERSI; }).map(function (n) { return caches.delete(n); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request).then(function (res) { if (res.ok && new URL(e.request.url).origin === location.origin) { var k = res.clone(); caches.open(VERSI).then(function (c) { c.put(e.request, k); }); } return res; }); }).catch(function () { return caches.match('index.html'); }));
});
