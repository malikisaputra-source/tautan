/* Service worker: simpan berkas agar aplikasi tetap jalan tanpa internet. */
var CACHE = 'website-rt-v2';
var BERKAS = ['./', './index.html', './tema.css', './tema.js', './style.css', './data.js', './app.js', './manifest.webmanifest', './ikon.svg', './img/logo.svg', './img/hero-lingkungan.svg', './img/pengurus-1.svg', './img/pengurus-2.svg', './img/pengurus-3.svg', './img/pengurus-4.svg', './img/galeri-1.svg', './img/galeri-2.svg', './img/galeri-3.svg', './img/galeri-4.svg'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BERKAS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    return r || fetch(e.request).then(function (res) {
      var salin = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, salin); });
      return res;
    });
  }).catch(function () { return caches.match('./index.html'); }));
});
