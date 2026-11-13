/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Service worker: simpan semua berkas agar aplikasi jalan tanpa internet. */
var CACHE = 'perpustakaan-digital-v1';
var BERKAS = ['./', './index.html', './katalog.html', './style.css', './app.js', './katalog.js', './data-contoh.js', './katalog.json', './contoh-katalog.csv', './manifest.webmanifest', './ikon.svg', './tema.css', './tema.js', './img/logo.svg'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BERKAS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  // katalog.json: utamakan versi terbaru dari jaringan, cadangan dari cache
  if (url.pathname.slice(-12) === 'katalog.json') {
    e.respondWith(fetch(e.request).then(function (res) { var s = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, s); }); return res; }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    return r || fetch(e.request).then(function (res) {
      var salin = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, salin); });
      return res;
    });
  }).catch(function () { return caches.match('./index.html'); }));
});
