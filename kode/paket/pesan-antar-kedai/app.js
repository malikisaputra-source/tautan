/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* Pesan Antar Kedai — Maliki Studio. Lisensi Nonkomersial Maliki Studio.
   Satu app statis, tiga sudut: Pembeli, Kedai, Kurir.
   Data di localStorage; antartab disinkronkan lewat BroadcastChannel (demo satu perangkat).
   Untuk multi-perangkat sungguhan lihat README (Supabase/Firebase). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  // ================= KONFIG gambar (ganti di sini) =================
  // logo: tampil di header. fotoMenu: foto bawaan per id menu (16:10). Kosong = pakai ilustrasi.
  // Foto yang diunggah di Kedai › Menu disimpan di field "foto" tiap menu (dataURL ≤400px).
  var KONFIG = {
    logo: 'img/logo.svg',
    fotoMenu: { m1: 'img/foto-menu.svg' } // contoh; timpa img/foto-menu.svg atau tambah { m2: 'img/nasgor.jpg' }
  };
  var GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ================= Utilitas =================
  function rp(n) { return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid(p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function jam(t) { var d = new Date(t); return String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0'); }
  function relatif(t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'baru saja'; if (m < 60) return m + ' mnt lalu';
    var h = Math.round(m / 60); if (h < 24) return h + ' jam lalu';
    return Math.round(h / 24) + ' hari lalu';
  }
  function tglKunci(t) { var d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function ikon(n, k) { return '<svg' + (k ? ' class="' + k + '"' : '') + ' aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function jarakKm(a, b) {
    var R = 6371, r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h)) * 1.3; // ×1.3 kira-kira jarak jalan
  }
  function noWA(hp) { var d = String(hp || '').replace(/\D/g, ''); if (d.indexOf('0') === 0) d = '62' + d.slice(1); return d; }
  function linkWA(hp, teks) { return 'https://wa.me/' + noWA(hp) + '?text=' + encodeURIComponent(teks); }
  function linkRute(a, b) { return 'https://www.google.com/maps/dir/?api=1&origin=' + a[0] + ',' + a[1] + '&destination=' + b[0] + ',' + b[1] + '&travelmode=driving'; }

  // ================= Data =================
  var KUNCI = 'pesan-antar-kedai-v1', VERSI = 1;
  var K_PEMBELI = 'pesan-antar-kedai-pembeli', K_KERANJANG = 'pesan-antar-kedai-keranjang', K_KURIR = 'pesan-antar-kedai-saya-kurir';
  var STATUS = {
    baru: 'Menunggu kedai', diterima: 'Diterima', dimasak: 'Sedang dimasak', siap: 'Siap diambil kurir',
    diantar: 'Sedang diantar', selesai: 'Selesai', ditolak: 'Ditolak'
  };
  var ALUR = ['baru', 'diterima', 'dimasak', 'siap', 'diantar', 'selesai'];
  var GAMBAR = ['geprek', 'nasgor', 'mie', 'sate', 'soto', 'martabak', 'pisang', 'esteh', 'kopi'];

  function dataContoh() {
    var now = Date.now(), M = 60000;
    var kedai = { alamat: 'Jl. Sukajadi No. 45, Bandung', wa: '081234567890', lat: -6.8962, lng: 107.5968, ongkirDasar: 5000, perKm: 2500, ongkirMin: 6000, buka: '10.00', tutup: '21.00' };
    var menu = [
      { id: 'm1', nama: 'Nasi Ayam Geprek', kat: 'Makanan', harga: 18000, stok: 14, gambar: 'geprek', ket: 'Sambal bawang level 1–5, lalapan', aktif: true },
      { id: 'm2', nama: 'Nasi Goreng Kampung', kat: 'Makanan', harga: 20000, stok: 9, gambar: 'nasgor', ket: 'Telur ceplok, kerupuk, acar', aktif: true },
      { id: 'm3', nama: 'Mie Ayam Bakso', kat: 'Makanan', harga: 17000, stok: 4, gambar: 'mie', ket: 'Mie buatan sendiri, 2 bakso urat', aktif: true },
      { id: 'm4', nama: 'Sate Ayam 10 Tusuk', kat: 'Makanan', harga: 25000, stok: 7, gambar: 'sate', ket: 'Bumbu kacang, lontong', aktif: true },
      { id: 'm5', nama: 'Soto Bandung', kat: 'Makanan', harga: 22000, stok: 0, gambar: 'soto', ket: 'Lobak, kacang kedelai goreng', aktif: true },
      { id: 'm6', nama: 'Martabak Telur Mini', kat: 'Camilan', harga: 15000, stok: 10, gambar: 'martabak', ket: 'Isi daun bawang, cuko', aktif: true },
      { id: 'm7', nama: 'Pisang Goreng Keju', kat: 'Camilan', harga: 12000, stok: 12, gambar: 'pisang', ket: '5 potong, keju parut & susu', aktif: true },
      { id: 'm8', nama: 'Es Teh Manis', kat: 'Minuman', harga: 5000, stok: 40, gambar: 'esteh', ket: 'Teh melati, gula batu', aktif: true },
      { id: 'm9', nama: 'Es Kopi Susu Aren', kat: 'Minuman', harga: 15000, stok: 18, gambar: 'kopi', ket: 'Robusta Pangalengan', aktif: true }
    ];
    var kurir = [
      { id: 'k1', nama: 'Dedi Kurniawan', hp: '081298765432', kendaraan: 'Honda Beat · D 4512 ABK' },
      { id: 'k2', nama: 'Rizal Maulana', hp: '085722113344', kendaraan: 'Yamaha Mio · D 3307 RZL' }
    ];
    function it(id, j) { var m = menu.filter(function (x) { return x.id === id; })[0]; return { menu: id, nama: m.nama, harga: m.harga, jml: j }; }
    function ps(o) {
      o.subtotal = o.item.reduce(function (s, x) { return s + x.harga * x.jml; }, 0);
      o.id = o.id || uid('p'); o.chat = o.chat || []; o.log = o.log || [{ s: 'baru', t: o.waktu }];
      return o;
    }
    var pes = [
      ps({ kode: 'P-0418', waktu: now - 4 * M, status: 'baru', bayar: 'COD', kurir: null,
        pembeli: { nama: 'Andi Pratama', hp: '081377889900', alamat: 'Jl. Setrasari Kulon III No. 8', catatan: 'Pagar hitam, sebelah warung', lat: -6.8845, lng: 107.5869 },
        item: [it('m1', 2), it('m8', 2)], ongkir: { saran: 10000, usul: 7000, oleh: 'pembeli', sepakat: false },
        chat: [
          { dari: 'pembeli', tipe: 'tawar', nominal: 7000, waktu: now - 4 * M },
          { dari: 'pembeli', teks: 'Bu, ongkirnya 7 ribu boleh? Deket kok, cuma belakang Setrasari Mall.', waktu: now - 4 * M + 8000 }
        ] }),
      ps({ kode: 'P-0417', waktu: now - 18 * M, status: 'diantar', bayar: 'COD', kurir: 'k1', waktuAntar: now - 5 * M,
        pembeli: { nama: 'Rina Wulandari', hp: '081311112222', alamat: 'Jl. Cihampelas Gg. Mawar No. 12', catatan: 'Rumah cat hijau, ada pohon mangga', lat: -6.8935, lng: 107.6047 },
        item: [it('m4', 1), it('m3', 1), it('m9', 2)], ongkir: { saran: 10000, usul: 9000, oleh: 'pembeli', sepakat: true, final: 9000 },
        chat: [
          { dari: 'pembeli', tipe: 'tawar', nominal: 7000, waktu: now - 18 * M },
          { dari: 'kedai', tipe: 'tawar', nominal: 10000, waktu: now - 17 * M },
          { dari: 'kedai', teks: 'Maaf kak, 7 ribu belum nutup bensin kurir. 10 ribu ya?', waktu: now - 17 * M + 5000 },
          { dari: 'pembeli', tipe: 'tawar', nominal: 9000, waktu: now - 16 * M },
          { dari: 'kedai', tipe: 'setuju', nominal: 9000, waktu: now - 15 * M },
          { dari: 'sistem', teks: 'Ongkir disepakati Rp9.000. Pesanan diterima kedai.', waktu: now - 15 * M },
          { dari: 'kedai', teks: 'Siap kak, sudah dibawa Kang Dedi ya. Ditunggu.', waktu: now - 5 * M }
        ],
        log: [{ s: 'baru', t: now - 18 * M }, { s: 'diterima', t: now - 15 * M }, { s: 'dimasak', t: now - 14 * M }, { s: 'siap', t: now - 6 * M }, { s: 'diantar', t: now - 5 * M }] }),
      ps({ kode: 'P-0416', waktu: now - 26 * M, status: 'dimasak', bayar: 'Transfer', kurir: null,
        pembeli: { nama: 'Siti Rahmawati', hp: '082155667788', alamat: 'Jl. Sukawangi No. 3, Sukajadi', catatan: '', lat: -6.8899, lng: 107.5991 },
        item: [it('m2', 1), it('m6', 2), it('m8', 1)], ongkir: { saran: 8000, usul: 8000, oleh: 'pembeli', sepakat: true, final: 8000 },
        chat: [{ dari: 'pembeli', tipe: 'tawar', nominal: 8000, waktu: now - 26 * M }, { dari: 'kedai', tipe: 'setuju', nominal: 8000, waktu: now - 25 * M }, { dari: 'sistem', teks: 'Ongkir disepakati Rp8.000.', waktu: now - 25 * M }],
        log: [{ s: 'baru', t: now - 26 * M }, { s: 'diterima', t: now - 25 * M }, { s: 'dimasak', t: now - 20 * M }] })
    ];
    // riwayat 7 hari untuk laporan
    var nama = ['Budi Santoso', 'Dewi Lestari', 'Fajar Nugraha', 'Maya Anggraini', 'Yoga Prasetyo', 'Nur Aisyah', 'Hendra Gunawan', 'Lina Marlina'];
    var n = 400;
    for (var h = 6; h >= 0; h--) {
      var jml = [3, 5, 4, 6, 4, 7, 2][6 - h];
      for (var j = 0; j < jml; j++) {
        var w = now - h * 86400000 - (3 + j * 1.3) * 3600000 - 40 * M;
        var a = menu[(j * 3 + h) % menu.length], b = menu[(j + h + 4) % menu.length];
        var usul = 6000 + ((j + h) % 3) * 1000, fin = usul + ((j + h) % 2) * 2000;
        var kr = (j % 2) ? 'k2' : 'k1';
        pes.push(ps({ kode: 'P-0' + (n++), waktu: w, status: 'selesai', bayar: j % 3 ? 'COD' : 'Transfer', kurir: kr,
          pembeli: { nama: nama[(j + h) % nama.length], hp: '0812' + (30000000 + j * 1111 + h * 7), alamat: 'Bandung', catatan: '', lat: -6.89 + j * 0.002, lng: 107.6 - h * 0.002 },
          item: [it(a.id, 1 + (j % 2)), it(b.id, 1)], ongkir: { saran: fin + 1000, usul: fin, oleh: 'kedai', sepakat: true, final: fin, awal: usul },
          setor: h > 0, log: [{ s: 'baru', t: w }, { s: 'selesai', t: w + 35 * M }] }));
        var o = pes[pes.length - 1];
        if (o.bayar === 'COD') o.cod = { terima: o.subtotal + fin, t: w + 35 * M };
      }
    }
    return { versi: VERSI, kedai: kedai, menu: menu, kurir: kurir, pesanan: pes, nomor: 419 };
  }
  function muat() {
    try { var s = JSON.parse(localStorage.getItem(KUNCI)); if (s && s.versi) return migrasi(s); } catch (e) {}
    var d = dataContoh(); try { localStorage.setItem(KUNCI, JSON.stringify(d)); } catch (e) {} return d;
  }
  function migrasi(d) {
    // Tambahkan langkah migrasi di sini bila skema berubah (naikkan VERSI). Jangan hapus data pengguna.
    d.menu = d.menu || []; d.kurir = d.kurir || []; d.pesanan = d.pesanan || [];
    d.versi = VERSI; return d;
  }
  var D = muat();
  var kanal = ('BroadcastChannel' in window) ? new BroadcastChannel('pesan-antar-kedai') : null;
  function simpan(info) {
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori browser penuh.'); }
    if (kanal) kanal.postMessage(info || { tipe: 'ubah' });
    render();
  }
  function terimaUbah(info) {
    var lama = D.pesanan.length; D = muat();
    if (info && info.tipe === 'baru' && UI.peran === 'kedai') toast('Pesanan baru masuk: ' + info.kode);
    else if (info && info.tipe === 'chat' && info.untuk === UI.peran) toast('Pesan baru di ' + info.kode);
    else if (info && info.tipe === 'tugas' && UI.peran === 'kurir' && info.kurir === UI.sayaKurir) toast('Antaran baru: ' + info.kode);
    void lama; render();
  }
  if (kanal) kanal.onmessage = function (e) { terimaUbah(e.data); };
  window.addEventListener('storage', function (e) { if (e.key === KUNCI && !kanal) terimaUbah(null); });

  function bacaLokal(k, b) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? b : v; } catch (e) { return b; } }
  function tulisLokal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var PEMBELI = bacaLokal(K_PEMBELI, { nama: 'Rina Wulandari', hp: '081311112222', alamat: 'Jl. Cihampelas Gg. Mawar No. 12', catatan: 'Rumah cat hijau, ada pohon mangga', lat: -6.8935, lng: 107.6047 });
  var KERANJANG = bacaLokal(K_KERANJANG, {});

  function menuById(id) { return D.menu.filter(function (m) { return m.id === id; })[0]; }
  function kurirById(id) { return D.kurir.filter(function (k) { return k.id === id; })[0]; }
  function pesById(id) { return D.pesanan.filter(function (p) { return p.id === id; })[0]; }
  function posKedai() { return [D.kedai.lat, D.kedai.lng]; }
  function posPembeli(p) { return [p.pembeli.lat, p.pembeli.lng]; }
  function saranOngkir(km) { return Math.max(D.kedai.ongkirMin, Math.ceil((D.kedai.ongkirDasar + km * D.kedai.perKm) / 1000) * 1000); }
  function ongkirNilai(p) { return p.ongkir.sepakat ? p.ongkir.final : p.ongkir.usul; }
  function total(p) { return p.subtotal + ongkirNilai(p); }
  function setStatus(p, s) { UI.pertahankan = true; p.status = s; p.log.push({ s: s, t: Date.now() }); }
  function aktif(p) { return ['selesai', 'ditolak'].indexOf(p.status) < 0; }
  function urutBaru(a, b) { return b.waktu - a.waktu; }
  function pesananSaya() { return D.pesanan.filter(function (p) { return noWA(p.pembeli.hp) === noWA(PEMBELI.hp); }).sort(urutBaru); }
  function progresKurir(p) {
    if (p.status === 'selesai') return 1; if (p.status !== 'diantar' || !p.waktuAntar) return 0;
    var est = Math.max(6, jarakKm(posKedai(), posPembeli(p)) * 4) * 60000;
    return Math.min(0.96, (Date.now() - p.waktuAntar) / est);
  }
  function posKurir(p) { var t = progresKurir(p), a = posKedai(), b = posPembeli(p); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function etaMenit(p) { var km = jarakKm(posKedai(), posPembeli(p)); return Math.max(1, Math.round(Math.max(6, km * 4) * (1 - progresKurir(p)))); }

  // ================= Ilustrasi SVG menu (buatan sendiri) =================
  var PIRING = '<ellipse cx="60" cy="56" rx="44" ry="20" fill="#fff" stroke="#e7e2d6" stroke-width="2"/><ellipse cx="60" cy="54" rx="33" ry="13" fill="#f6f2ea"/>';
  var MANGKOK = '<path d="M18 44h84c0 18-18 30-42 30S18 62 18 44Z" fill="#fff" stroke="#e2dccf" stroke-width="2"/><path d="M40 74h40" stroke="#d6cfbf" stroke-width="3" stroke-linecap="round"/>';
  var GBR = {
    geprek: PIRING + '<ellipse cx="46" cy="50" rx="17" ry="9" fill="#fffdf6" stroke="#ece6d8"/><path d="M58 38c8-6 22-4 25 5 3 8-4 15-14 15-11 0-18-11-11-20Z" fill="#d9822b"/><path d="M63 42l3 2M71 40l2 3M74 47l3 1M66 50l2 2" stroke="#a35a17" stroke-width="2" stroke-linecap="round"/><circle cx="73" cy="44" r="6" fill="#c8361f" opacity=".85"/><ellipse cx="35" cy="60" rx="6" ry="3" fill="#7fb35a"/><ellipse cx="44" cy="63" rx="6" ry="3" fill="#97c56f"/>',
    nasgor: PIRING + '<path d="M30 54c2-14 18-20 30-20s28 6 30 20Z" fill="#c97a3a"/><g fill="#a95f24"><circle cx="45" cy="45" r="2"/><circle cx="58" cy="40" r="2"/><circle cx="72" cy="46" r="2"/></g><path d="M62 33c6-7 18-6 20 1 2 6-5 9-11 9-7 0-12-4-9-10Z" fill="#fffef8"/><circle cx="71" cy="37" r="4.5" fill="#f2b31b"/><path d="M28 60l10-8 6 9Z" fill="#f4dfa6"/><circle cx="90" cy="58" r="3" fill="#e05a3b"/>',
    mie: MANGKOK + '<ellipse cx="60" cy="44" rx="41" ry="10" fill="#e9b949"/><path d="M28 44c6-4 10 4 16 0s10 4 16 0 10 4 16 0 10 4 16 0" stroke="#d29b2a" stroke-width="2" fill="none"/><circle cx="48" cy="40" r="6" fill="#8b5a3c"/><circle cx="62" cy="38" r="6" fill="#9a6748"/><path d="M72 42h14" stroke="#4f9a3c" stroke-width="4" stroke-linecap="round"/><path d="M34 41h8" stroke="#6bb153" stroke-width="3" stroke-linecap="round"/><path d="M84 12l-14 30M92 16 76 42" stroke="#b68b5a" stroke-width="2.4" stroke-linecap="round"/>',
    sate: PIRING + '<path d="M38 64c0-6 10-10 22-10" fill="none"/><ellipse cx="40" cy="59" rx="12" ry="6" fill="#9a5b22"/><g stroke="#c9a57a" stroke-width="2" stroke-linecap="round"><path d="M50 62 92 34"/><path d="M48 54 88 26"/><path d="M54 68 96 42"/></g><g fill="#8a4a1a"><rect x="60" y="48" width="9" height="7" rx="3" transform="rotate(-34 64 51)"/><rect x="71" y="41" width="9" height="7" rx="3" transform="rotate(-34 75 44)"/><rect x="58" y="40" width="9" height="7" rx="3" transform="rotate(-34 62 43)"/><rect x="69" y="33" width="9" height="7" rx="3" transform="rotate(-34 73 36)"/><rect x="64" y="56" width="9" height="7" rx="3" transform="rotate(-34 68 59)"/><rect x="75" y="49" width="9" height="7" rx="3" transform="rotate(-34 79 52)"/></g><rect x="74" y="58" width="16" height="10" rx="3" fill="#e9f0d6" stroke="#cbd8aa"/>',
    soto: MANGKOK + '<ellipse cx="60" cy="44" rx="41" ry="10" fill="#f2d27a"/><ellipse cx="60" cy="44" rx="34" ry="7" fill="#f7df98"/><g fill="#fff8e4" stroke="#e7cf8c"><ellipse cx="44" cy="42" rx="7" ry="3.5"/><ellipse cx="66" cy="46" rx="7" ry="3.5"/></g><g fill="#a86c32"><circle cx="54" cy="40" r="2.4"/><circle cx="58" cy="47" r="2.4"/><circle cx="76" cy="41" r="2.4"/></g><path d="M78 46h8" stroke="#4f9a3c" stroke-width="3" stroke-linecap="round"/><path d="M48 24c-3-5 3-7 0-12M60 22c-3-5 3-7 0-12M72 24c-3-5 3-7 0-12" stroke="#cfc8b8" stroke-width="2" fill="none" stroke-linecap="round"/>',
    martabak: PIRING + '<g stroke="#c58a2e" stroke-width="1.5"><rect x="34" y="36" width="17" height="14" rx="3" fill="#e9b34f"/><rect x="53" y="34" width="17" height="14" rx="3" fill="#efbd5c"/><rect x="72" y="37" width="17" height="14" rx="3" fill="#e5ac45"/><rect x="42" y="50" width="17" height="13" rx="3" fill="#efbd5c"/><rect x="61" y="50" width="17" height="13" rx="3" fill="#e9b34f"/></g><g stroke="#5f9e43" stroke-width="2" stroke-linecap="round"><path d="M38 42h5M58 40h5M77 44h5M47 56h5M66 56h5"/></g><circle cx="90" cy="60" r="6" fill="#7a3b14" opacity=".8"/>',
    pisang: PIRING + '<g fill="#e6a93b" stroke="#c78624" stroke-width="1.4"><path d="M30 52c6-10 22-12 28-4-7 5-20 8-28 4Z"/><path d="M46 60c6-10 22-12 28-4-7 5-20 8-28 4Z"/><path d="M58 46c6-10 22-12 28-4-7 5-20 8-28 4Z"/><path d="M66 58c6-10 22-12 28-4-7 5-20 8-28 4Z"/></g><g stroke="#fff3a6" stroke-width="2.4" stroke-linecap="round"><path d="M40 47l4 1M52 55l4 1M70 42l4 1M78 53l4 1M62 52l3 1"/></g><path d="M36 56c10 4 30 6 52-2" stroke="#fffaf0" stroke-width="2" fill="none" opacity=".9"/>',
    esteh: '<ellipse cx="60" cy="80" rx="26" ry="5" fill="#000" opacity=".08"/><path d="M38 18h44l-6 60H44Z" fill="#fff" fill-opacity=".55" stroke="#d8d2c4" stroke-width="2"/><path d="M41 32h38l-4.5 44h-29Z" fill="#c4711f"/><rect x="47" y="36" width="11" height="10" rx="2" fill="#fff" opacity=".7" transform="rotate(-10 52 41)"/><rect x="61" y="44" width="11" height="10" rx="2" fill="#fff" opacity=".6" transform="rotate(12 66 49)"/><path d="M68 6 62 60" stroke="#2f8f5b" stroke-width="4" stroke-linecap="round"/><path d="M84 30c8-2 10 4 4 7" fill="none" stroke="#7fb35a" stroke-width="3" stroke-linecap="round"/>',
    kopi: '<ellipse cx="60" cy="80" rx="26" ry="5" fill="#000" opacity=".08"/><path d="M38 18h44l-6 60H44Z" fill="#fff" fill-opacity=".55" stroke="#d8d2c4" stroke-width="2"/><path d="M41 32h38l-1.6 16h-34.8Z" fill="#f2e6cf"/><path d="M42.6 48h34.8l-2.9 28h-29Z" fill="#7a4a2a"/><path d="M42.6 48c10 4 24-4 34.8 0" fill="none" stroke="#b07a4c" stroke-width="3"/><rect x="50" y="34" width="10" height="9" rx="2" fill="#fff" opacity=".75"/><path d="M68 6 62 60" stroke="#17673f" stroke-width="4" stroke-linecap="round"/>'
  };
  function fotoMenu(m, kls) {
    var src = m.foto || KONFIG.fotoMenu[m.id];
    var cad = gambar(m.gambar, kls);
    if (!src) return cad;
    return '<img class="foto-menu ' + (kls || 'gbr') + '" src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">' + cad;
  }
  function kecilkanFoto(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var sk = Math.min(1, 400 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * sk); c.height = Math.round(im.height * sk);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.78));
      };
      im.onerror = function () { cb(''); }; im.src = r.result;
    };
    r.readAsDataURL(file);
  }
  function pasangLogo() {
    var el = $('.merek .logo-img'); if (!el || !KONFIG.logo) return;
    el.onerror = function () { el.hidden = true; };
    el.onload = function () { el.hidden = false; var s = $('.merek .logo'); if (s) s.style.display = 'none'; };
    el.src = KONFIG.logo;
  }
  function gambar(j, kls) { return '<svg class="' + (kls || 'gbr') + '" viewBox="0 0 120 86" aria-hidden="true">' + (GBR[j] || GBR.geprek) + '</svg>'; }

  var ILUS_KURIR = '<svg class="ilus" viewBox="0 0 260 170" aria-hidden="true">' +
    '<circle cx="190" cy="40" r="22" fill="var(--aksen)" opacity=".9"/>' +
    '<g fill="var(--hero-teks)" opacity=".12"><rect x="12" y="62" width="34" height="70" rx="4"/><rect x="50" y="44" width="28" height="88" rx="4"/><rect x="200" y="74" width="40" height="58" rx="4"/></g>' +
    '<path d="M0 138h260" stroke="var(--hero-teks)" stroke-opacity=".3" stroke-width="2" stroke-dasharray="10 9"/>' +
    '<g class="ilus-motor">' +
    '<path d="M40 104h20M30 114h22M46 94h12" stroke="var(--hero-teks)" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="96" cy="128" r="14" fill="#1d2a22"/><circle cx="96" cy="128" r="6" fill="#d9d4c7"/>' +
    '<circle cx="182" cy="128" r="14" fill="#1d2a22"/><circle cx="182" cy="128" r="6" fill="#d9d4c7"/>' +
    '<path d="M86 114h52l16-22h18l14 22v8H90Z" fill="var(--aksen)"/>' +
    '<path d="M150 92l8-20h10" stroke="#1d2a22" stroke-width="5" stroke-linecap="round" fill="none"/>' +
    '<rect x="70" y="70" width="44" height="40" rx="6" fill="#fff"/><rect x="70" y="70" width="44" height="12" rx="6" fill="#f3efe6"/>' +
    '<path d="M84 90c4-8 12-8 16 0" stroke="var(--utama)" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M80 96h24" stroke="var(--utama)" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M122 112l10-30h18l-6 30Z" fill="#2b6cb0"/><path d="M128 82c0-14 22-16 24-2l-2 6h-20Z" fill="#f0c9a0"/>' +
    '<path d="M124 76c0-14 30-18 32 0Z" fill="var(--aksen)"/><path d="M122 77h36" stroke="#1d2a22" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M140 92l18 4" stroke="#2b6cb0" stroke-width="7" stroke-linecap="round"/>' +
    '</g></svg>';

  // ================= Tema (customizer, lihat tema.css & tema.js) =================
  var NAMA = (window.TEMA && TEMA.nama) || 'Kedai Bu Sari';
  var FONT_OK = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  function terapkanTema(t) {
    var r = document.documentElement, st = r.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama);
    if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) st.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var f = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      st.setProperty('--tema-font', '"' + f + '", system-ui, sans-serif');
      var l = $('#fontTema');
      if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap';
    }
    if (t.mode) { var m = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode; r.setAttribute('data-mode', m); ikonMode(); }
    if (t.bagian) terapkanBagian(t.bagian);
    setTimeout(hitungTeksBagian, 0);
    if (t.nama) { NAMA = t.nama; isiNama(); }
  }
  function isiNama() { $$('[data-tema-nama]').forEach(function (e) { e.textContent = NAMA; }); }

  var PETA_BAGIAN = {
    nav: '.atas, .sub',
    latar: 'body, main',
    panel: '.panel, .kartu-menu, dialog, .chat',
    utama: '.tombol.utama, .hero, .chip[aria-pressed="true"], .peran [aria-selected="true"]',
    aksen: '.lencana, .harga-pita, .langkah.kini .titik, .batang i',
    teks: 'h1, h2, h3, .angka-besar'
  };
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  function tandaiBagian() {
    var baru = 0;
    Object.keys(PETA_BAGIAN).forEach(function (b) {
      $$(PETA_BAGIAN[b]).forEach(function (el) { if (!el.hasAttribute('data-bagian')) { el.setAttribute('data-bagian', b); baru++; } });
    });
    if (baru && sorotAktif) sorot(sorotAktif);
  }
  function warnaNyata(v) {
    var p = document.createElement('i'); p.style.cssText = 'position:absolute;width:0;height:0;background:var(' + v + ')';
    document.body.appendChild(p); var c = getComputedStyle(p).backgroundColor; p.remove();
    var m = c.match(/[\d.]+/g) || [255, 255, 255];
    if (/^color\(srgb/.test(c)) m = m.map(function (x) { return x * 255; });
    return m.slice(0, 3).map(Number);
  }
  function teksUntuk(v) {
    var l = warnaNyata(v).map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    var L = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
    // pilih teks dengan kontras tertinggi: putih vs hijau sangat gelap (#13201a, luminansi ±0,013)
    return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.063) ? '#ffffff' : '#13201a';
  }
  function hitungTeksBagian() {
    if (!document.body) return;
    var st = document.documentElement.style;
    st.setProperty('--tema-nav-teks', teksUntuk('--nav'));
    st.setProperty('--tema-utama-teks', teksUntuk('--utama'));
    st.setProperty('--tema-aksen-teks', teksUntuk('--aksen'));
  }
  function terapkanBagian(bg) {
    var st = document.documentElement.style;
    Object.keys(VAR_BAGIAN).forEach(function (k) {
      if (bg[k] === undefined) return;
      if (bg[k]) { st.setProperty('--tema-' + k, bg[k]); st.setProperty(VAR_BAGIAN[k], bg[k]); }
      else { st.removeProperty('--tema-' + k); st.removeProperty(VAR_BAGIAN[k]); }
    });
  }
  var sorotAktif = null;
  function sorot(b) {
    sorotAktif = b;
    $$('[data-sorot]').forEach(function (e) { e.removeAttribute('data-sorot'); });
    $$('.label-sorot').forEach(function (e) { e.remove(); });
    if (!b) return;
    $$('[data-bagian="' + b + '"]').forEach(function (e) {
      e.setAttribute('data-sorot', '');
      var r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
      var lb = document.createElement('span'); lb.className = 'label-sorot'; lb.textContent = NAMA_BAGIAN[b] || b;
      lb.style.left = Math.max(2, r.left + 4) + 'px'; lb.style.top = Math.max(2, r.top + 4) + 'px';
      document.body.appendChild(lb);
    });
  }
  var modePilih = false, hoverEl = null;
  function bagianDari(t) { return t && t.closest ? t.closest('[data-bagian]') : null; }
  function setPilih(on) {
    modePilih = !!on; document.documentElement.classList.toggle('mode-pilih', modePilih);
    if (!modePilih && hoverEl) { hoverEl.removeAttribute('data-pilih-hover'); hoverEl = null; }
  }
  ['click', 'pointerdown', 'mousedown', 'touchstart', 'submit', 'keydown', 'change'].forEach(function (tipe) {
    document.addEventListener(tipe, function (e) {
      if (!modePilih) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (tipe === 'click') { var el = bagianDari(e.target); if (el) parent.postMessage({ tipe: 'bagian-dipilih', bagian: el.getAttribute('data-bagian') }, '*'); }
    }, { capture: true, passive: false });
  });
  document.addEventListener('mouseover', function (e) {
    if (!modePilih) return; var el = bagianDari(e.target);
    if (hoverEl && hoverEl !== el) hoverEl.removeAttribute('data-pilih-hover');
    hoverEl = el; if (el) el.setAttribute('data-pilih-hover', '');
  }, true);
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || typeof d !== 'object') return;
    if (d.tipe === 'tema') terapkanTema(d);
    else if (d.tipe === 'sorot') sorot(d.bagian || null);
    else if (d.tipe === 'mode-pilih') setPilih(d.aktif);
  });
  new MutationObserver(function (ms) {
    var mode = ms.some(function (m) { return m.type === 'attributes'; });
    var dom = ms.some(function (m) { return m.type === 'childList' && Array.prototype.some.call(m.addedNodes, function (n) { return n.nodeType === 1 && n.className !== 'label-sorot'; }); });
    if (dom) tandaiBagian(); if (mode) hitungTeksBagian();
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-mode'] });
  function ikonMode() {
    var g = document.documentElement.getAttribute('data-mode') === 'gelap', b = $('#tombolMode');
    if (!b) return; b.innerHTML = ikon(g ? 'matahari' : 'bulan'); b.setAttribute('aria-label', g ? 'Ganti mode terang' : 'Ganti mode gelap');
  }

  // ================= Toast =================
  function toast(pesan) {
    var w = $('#toast'), el = document.createElement('div');
    el.className = 'toast'; el.innerHTML = ikon('cek') + '<span>' + esc(pesan) + '</span>';
    w.appendChild(el);
    setTimeout(function () { el.classList.add('keluar'); setTimeout(function () { el.remove(); }, GERAK ? 300 : 0); }, 3200);
  }

  // ================= Peta (Leaflet + OpenStreetMap; cadangan SVG bila offline) =================
  var petaAktif = [];
  function bersihPeta() { petaAktif.forEach(function (m) { try { m.remove(); } catch (e) {} }); petaAktif = []; }
  function pinHTML(jenis) {
    var ik = jenis === 'kedai' ? 'toko' : jenis === 'kurir' ? 'motor' : 'pin';
    return '<span class="pin pin-' + jenis + '">' + ikon(ik) + '</span>';
  }
  function petaStatis(el, titik) {
    var lat = titik.map(function (t) { return t.pos[0]; }), lng = titik.map(function (t) { return t.pos[1]; });
    var a = Math.min.apply(0, lat), b = Math.max.apply(0, lat), c = Math.min.apply(0, lng), d = Math.max.apply(0, lng);
    var h = '<div class="peta-statis" role="img" aria-label="Peta sederhana (peta online tidak termuat)">';
    titik.forEach(function (t) {
      var x = d - c ? 12 + (t.pos[1] - c) / (d - c) * 76 : 50, y = b - a ? 12 + (b - t.pos[0]) / (b - a) * 70 : 50;
      h += '<span class="titik-statis" style="left:' + x + '%;top:' + y + '%">' + pinHTML(t.jenis) + '</span>';
    });
    el.innerHTML = h + '<small>Mode tanpa internet: posisi perkiraan</small></div>';
    return null;
  }
  function buatPeta(el, titik, opsi) {
    opsi = opsi || {};
    if (!window.L) return petaStatis(el, titik);
    var m = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(m);
    var mk = {};
    titik.forEach(function (t) {
      mk[t.jenis] = L.marker(t.pos, { icon: L.divIcon({ className: 'pin-wadah', html: pinHTML(t.jenis), iconSize: [40, 48], iconAnchor: [20, 46] }), draggable: !!t.geser, keyboard: !!t.geser, title: t.judul || '' }).addTo(m);
    });
    if (opsi.garis && titik.length > 1) L.polyline([titik[0].pos, titik[titik.length - 1].pos], { color: getComputedStyle(document.documentElement).getPropertyValue('--utama-tulis') || '#17673f', weight: 4, dashArray: '2 9', lineCap: 'round' }).addTo(m);
    if (titik.length > 1) m.fitBounds(titik.map(function (t) { return t.pos; }), { padding: [36, 36], maxZoom: 16 });
    else m.setView(titik[0].pos, 16);
    setTimeout(function () { m.invalidateSize(); }, 60);
    petaAktif.push(m);
    return { peta: m, penanda: mk };
  }

  // ================= Status UI =================
  var q = new URLSearchParams(location.search);
  var UI = {
    peran: q.get('peran') || sessionStorage.getItem('pak-peran') || 'pembeli',
    sub: { pembeli: 'menu', kedai: 'masuk', kurir: 'antaran' },
    kat: 'Semua', cari: '',
    pilihPembeli: null, pilihKedai: null, filterKedai: 'aktif',
    sayaKurir: bacaLokal(K_KURIR, 'k1'), periode: 7,
    halLama: '', tawarBuka: false
  };
  if (['pembeli', 'kedai', 'kurir'].indexOf(UI.peran) < 0) UI.peran = 'pembeli';
  var SUB = {
    pembeli: [['menu', 'Menu', 'menu'], ['pesanan', 'Pesananku', 'struk']],
    kedai: [['masuk', 'Pesanan', 'struk'], ['stok', 'Menu & stok', 'kotak'], ['laporan', 'Laporan', 'grafik'], ['atur', 'Atur', 'toko']],
    kurir: [['antaran', 'Antaran', 'motor'], ['setoran', 'Uang COD', 'uang']]
  };
  function lencana(peran, s) {
    if (peran === 'pembeli' && s === 'pesanan') return pesananSaya().filter(aktif).length;
    if (peran === 'pembeli' && s === 'menu') return jmlKeranjang();
    if (peran === 'kedai' && s === 'masuk') return D.pesanan.filter(function (p) { return p.status === 'baru'; }).length;
    if (peran === 'kurir' && s === 'antaran') return D.pesanan.filter(function (p) { return p.kurir === UI.sayaKurir && (p.status === 'siap' || p.status === 'diantar'); }).length;
    return 0;
  }

  // ================= Render =================
  function render() {
    var a = document.activeElement, fokus = a && a.id ? { id: a.id, v: a.value, s: a.selectionStart } : null;
    var sc = {}; $$('[data-gulir]').forEach(function (e) { sc[e.getAttribute('data-gulir')] = { t: e.scrollTop, bawah: e.scrollHeight - e.scrollTop - e.clientHeight < 40 }; });
    $$('.peran [data-peran]').forEach(function (b) { var on = b.getAttribute('data-peran') === UI.peran; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; b.removeAttribute('data-bagian'); });
    document.body.setAttribute('data-peran', UI.peran);
    var sub = UI.sub[UI.peran];
    $('#sub').innerHTML = '<div class="sub-isi">' + SUB[UI.peran].map(function (s) {
      var n = lencana(UI.peran, s[0]);
      return '<button class="sub-tab" data-sub="' + s[0] + '"' + (s[0] === sub ? ' aria-current="page"' : '') + '>' + ikon(s[2]) + '<span>' + s[1] + '</span>' + (n ? '<b class="lencana" aria-label="' + n + ' item">' + n + '</b>' : '') + '</button>';
    }).join('') + '</div>';
    bersihPeta();
    var kunci = UI.peran + '/' + sub, hal = $('#hal');
    hal.innerHTML = HAL[UI.peran][sub]();
    if (kunci !== UI.halLama && GERAK) { hal.classList.remove('masuk'); void hal.offsetWidth; hal.classList.add('masuk'); }
    UI.halLama = kunci;
    (SETELAH[kunci] || function () {})();
    $$('[data-gulir]').forEach(function (e) { var k = sc[e.getAttribute('data-gulir')]; e.scrollTop = (!k || k.bawah) ? e.scrollHeight : k.t; });
    if (fokus) { var f = document.getElementById(fokus.id); if (f) { f.focus({ preventScroll: true }); if (f.value !== undefined && fokus.v !== undefined) { f.value = fokus.v; try { f.setSelectionRange(fokus.s, fokus.s); } catch (e) {} } } }
    isiNama(); tandaiBagian();
  }

  // ---------- Komponen bersama ----------
  function pilStatus(p) { return '<span class="status s-' + p.status + '">' + esc(STATUS[p.status]) + '</span>'; }
  function langkah(p) {
    if (p.status === 'ditolak') return '<div class="ditolak-info">' + ikon('tutup') + '<div><b>Pesanan ditolak kedai</b><p>' + esc(p.alasan || 'Maaf, pesanan belum bisa dibuat.') + '</p></div></div>';
    var label = { baru: 'Dipesan', diterima: 'Diterima', dimasak: 'Dimasak', siap: 'Siap', diantar: 'Diantar', selesai: 'Sampai' };
    var idx = ALUR.indexOf(p.status);
    return '<ol class="langkah-langkah" aria-label="Status pesanan">' + ALUR.map(function (s, i) {
      var log = p.log.filter(function (l) { return l.s === s; })[0];
      var k = i < idx ? 'lewat' : i === idx ? 'kini' : '';
      return '<li class="langkah ' + k + '"' + (i === idx ? ' aria-current="step"' : '') + '><span class="titik">' + (i < idx || p.status === 'selesai' ? ikon('cek') : '') + '</span><b>' + label[s] + '</b><small>' + (log ? jam(log.t) : '–') + '</small></li>';
    }).join('') + '</ol>';
  }
  function rincian(p) {
    return '<ul class="rincian">' + p.item.map(function (x) { return '<li><span><b>' + x.jml + '×</b> ' + esc(x.nama) + '</span><span class="angka">' + rp(x.harga * x.jml) + '</span></li>'; }).join('') +
      '<li class="garis-atas"><span>Subtotal</span><span class="angka">' + rp(p.subtotal) + '</span></li>' +
      '<li><span>Ongkir ' + (p.ongkir.sepakat ? '<em class="ok">disepakati</em>' : '<em class="tunda">masih ditawar</em>') + '</span><span class="angka">' + rp(ongkirNilai(p)) + '</span></li>' +
      '<li class="jumlah"><span>Total · ' + esc(p.bayar) + '</span><span class="angka">' + rp(total(p)) + '</span></li></ul>';
  }
  function waPesanan(p) {
    var t = '*Pesanan ' + p.kode + ' — ' + NAMA + '*\n' +
      'Nama: ' + p.pembeli.nama + '\nHP: ' + p.pembeli.hp + '\nAlamat: ' + p.pembeli.alamat +
      (p.pembeli.catatan ? '\nPatokan: ' + p.pembeli.catatan : '') +
      '\nPin peta: https://maps.google.com/?q=' + p.pembeli.lat.toFixed(5) + ',' + p.pembeli.lng.toFixed(5) + '\n\n' +
      p.item.map(function (x) { return '• ' + x.jml + 'x ' + x.nama + ' = ' + rp(x.harga * x.jml); }).join('\n') +
      '\n\nSubtotal: ' + rp(p.subtotal) + '\nOngkir ' + (p.ongkir.sepakat ? 'disepakati' : 'yang saya tawar') + ': ' + rp(ongkirNilai(p)) +
      '\n*Total: ' + rp(total(p)) + '*\nBayar: ' + p.bayar;
    return t;
  }

  // ---------- Chat & tawar ongkir ----------
  function bubble(m, saya) {
    if (m.dari === 'sistem') return '<li class="sistem"><span>' + esc(m.teks) + '</span></li>';
    var kls = m.dari === saya ? 'saya' : 'lawan', siapa = m.dari === 'kedai' ? NAMA : m.dari === 'kurir' ? 'Kurir' : 'Pembeli';
    var isi;
    if (m.tipe === 'tawar') isi = '<span class="tawar-kartu">' + ikon('tawar') + '<span><small>' + (m.dari === saya ? 'Kamu menawar ongkir' : siapa + ' menawar ongkir') + '</small><b class="angka">' + rp(m.nominal) + '</b></span></span>';
    else if (m.tipe === 'setuju') isi = '<span class="tawar-kartu setuju">' + ikon('cek') + '<span><small>' + (m.dari === saya ? 'Kamu setuju' : siapa + ' setuju') + '</small><b class="angka">' + rp(m.nominal) + '</b></span></span>';
    else isi = '<span class="teks">' + esc(m.teks) + '</span>';
    return '<li class="' + kls + '">' + isi + '<time>' + jam(m.waktu) + '</time></li>';
  }
  function panelChat(p, saya) {
    var o = p.ongkir, giliran = !o.sepakat && o.oleh !== saya && aktif(p);
    var h = '<section class="panel chat" aria-label="Chat dengan ' + (saya === 'kedai' ? esc(p.pembeli.nama) : 'kedai') + '">' +
      '<header class="chat-kepala"><div class="avatar">' + (saya === 'kedai' ? esc(p.pembeli.nama.charAt(0)) : ikon('toko')) + '</div><div><b>' + (saya === 'kedai' ? esc(p.pembeli.nama) : esc(NAMA)) + '</b><small>' + (o.sepakat ? 'Ongkir disepakati ' + rp(o.final) : 'Tawar ongkir: ' + rp(o.usul) + ' · saran ' + rp(o.saran)) + '</small></div>' +
      '<a class="ikon-tombol" href="' + linkWA(saya === 'kedai' ? p.pembeli.hp : D.kedai.wa, saya === 'kedai' ? 'Halo kak ' + p.pembeli.nama + ', soal pesanan ' + p.kode + ' di ' + NAMA + ':' : waPesanan(p)) + '" target="_blank" rel="noopener" aria-label="Lanjut di WhatsApp">' + ikon('wa') + '</a></header>' +
      '<ol class="pesan-list" role="log" aria-live="polite" data-gulir="chat-' + p.id + '">' + p.chat.map(function (m) { return bubble(m, saya); }).join('') + '</ol>';
    if (giliran) {
      var saranBalik = saya === 'kedai' ? Math.max(o.usul + 1000, o.saran) : Math.max(D.kedai.ongkirMin, Math.round((o.usul - 1000) / 1000) * 1000);
      h += '<div class="tawar-aksi" role="group" aria-label="Tanggapi tawaran ongkir">' +
        '<p>' + (saya === 'kedai' ? esc(p.pembeli.nama.split(' ')[0]) : esc(NAMA)) + ' menawar <b class="angka">' + rp(o.usul) + '</b></p>' +
        '<div class="baris-tombol"><button class="tombol utama kecil" data-aksi="setuju" data-id="' + p.id + '">' + ikon('cek') + 'Setuju ' + rp(o.usul) + '</button>' +
        (saranBalik !== o.usul ? '<button class="tombol garis kecil" data-aksi="tawar-cepat" data-id="' + p.id + '" data-n="' + saranBalik + '">Tawar balik ' + rp(saranBalik) + '</button>' : '') +
        '<button class="tombol hantu kecil" data-aksi="tawar-buka" data-id="' + p.id + '">Nominal lain…</button></div></div>';
    } else if (!o.sepakat && aktif(p)) {
      h += '<div class="tawar-aksi menunggu"><p>' + ikon('jam') + 'Menunggu ' + (saya === 'kedai' ? 'pembeli' : 'kedai') + ' menanggapi tawaran <b class="angka">' + rp(o.usul) + '</b></p></div>';
    }
    if (UI.tawarBuka === p.id) {
      h += '<form class="tawar-form" data-form="tawar" data-id="' + p.id + '"><label for="nomTawar">Tawar ongkir (Rp)</label><div class="baris-input"><input id="nomTawar" name="n" inputmode="numeric" pattern="[0-9]*" required placeholder="mis. 8000" value="' + o.usul + '"><button class="tombol utama kecil" type="submit">Kirim tawaran</button><button class="tombol hantu kecil" type="button" data-aksi="tawar-tutup">Batal</button></div></form>';
    }
    if (saya === 'kedai' && aktif(p)) {
      h += '<div class="balas-cepat" aria-label="Balasan cepat">' + ['Siap kak, segera dibuat', 'Mohon ditunggu ya kak', 'Kurir sudah jalan', 'Maaf, stok habis'].map(function (t) { return '<button class="chip" data-aksi="balas" data-id="' + p.id + '" data-teks="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    }
    h += '<form class="tulis" data-form="chat" data-id="' + p.id + '"><label class="sr" for="chat-' + saya + '">Tulis pesan</label><input id="chat-' + saya + '" name="t" autocomplete="off" placeholder="Tulis pesan…" maxlength="400"><button class="tombol utama ikon-saja" type="submit" aria-label="Kirim pesan">' + ikon('kirim') + '</button></form></section>';
    return h;
  }
  function kirimTawar(p, oleh, n) {
    n = Math.round(n / 500) * 500;
    p.ongkir.usul = n; p.ongkir.oleh = oleh; p.ongkir.sepakat = false;
    p.chat.push({ dari: oleh, tipe: 'tawar', nominal: n, waktu: Date.now() });
    UI.tawarBuka = false;
    simpan({ tipe: 'chat', kode: p.kode, untuk: oleh === 'kedai' ? 'pembeli' : 'kedai' });
  }
  function setuju(p, oleh) {
    p.ongkir.sepakat = true; p.ongkir.final = p.ongkir.usul;
    p.chat.push({ dari: oleh, tipe: 'setuju', nominal: p.ongkir.final, waktu: Date.now() });
    p.chat.push({ dari: 'sistem', teks: 'Ongkir disepakati ' + rp(p.ongkir.final) + '.', waktu: Date.now() });
    simpan({ tipe: 'chat', kode: p.kode, untuk: oleh === 'kedai' ? 'pembeli' : 'kedai' });
  }

  // ================= PEMBELI =================
  function jmlKeranjang() { return Object.keys(KERANJANG).reduce(function (s, k) { return s + (menuById(k) ? KERANJANG[k] : 0); }, 0); }
  function subKeranjang() { return Object.keys(KERANJANG).reduce(function (s, k) { var m = menuById(k); return s + (m ? m.harga * KERANJANG[k] : 0); }, 0); }
  function stepper(m, n) {
    if (!n) return '<button class="tombol utama tambah" data-aksi="tambah" data-id="' + m.id + '"' + (m.stok < 1 ? ' disabled' : '') + ' aria-label="Tambah ' + esc(m.nama) + '">' + ikon('tambah') + '<span>' + (m.stok < 1 ? 'Habis' : 'Tambah') + '</span></button>';
    return '<div class="stepper" role="group" aria-label="Jumlah ' + esc(m.nama) + '"><button data-aksi="kurang" data-id="' + m.id + '" aria-label="Kurangi">' + ikon('kurang') + '</button><output class="angka" aria-live="polite">' + n + '</output><button data-aksi="tambah" data-id="' + m.id + '" aria-label="Tambah"' + (n >= m.stok ? ' disabled' : '') + '>' + ikon('tambah') + '</button></div>';
  }
  function panelKeranjang() {
    var ks = Object.keys(KERANJANG).filter(function (k) { return menuById(k); });
    var h = '<aside class="panel keranjang" aria-label="Keranjang"><header class="keranjang-kepala"><h2>Keranjang</h2><span class="redup kecil">' + jmlKeranjang() + ' item</span></header>';
    if (!ks.length) return h + '<div class="kosong kecil-kosong">' + gambar('esteh', 'gbr-kosong') + '<p><b>Keranjang masih kosong</b><br>Pilih menu di kiri, ongkirnya nanti bisa kamu tawar.</p></div></aside>';
    h += '<ul class="krj-list">' + ks.map(function (k) {
      var m = menuById(k); return '<li>' + fotoMenu(m, 'gbr-mini') + '<div><b>' + esc(m.nama) + '</b><span class="angka redup">' + rp(m.harga * KERANJANG[k]) + '</span></div>' + stepper(m, KERANJANG[k]) + '</li>';
    }).join('') + '</ul>';
    var km = jarakKm(posKedai(), [PEMBELI.lat, PEMBELI.lng]);
    h += '<dl class="krj-total"><div><dt>Subtotal</dt><dd class="angka">' + rp(subKeranjang()) + '</dd></div><div><dt>Saran ongkir (' + km.toFixed(1).replace('.', ',') + ' km)</dt><dd class="angka">' + rp(saranOngkir(km)) + '</dd></div></dl>' +
      '<p class="catatan-tawar">' + ikon('tawar') + 'Ongkir diantar kurir kedai sendiri dan <b>bisa kamu tawar</b> lewat chat.</p>' +
      '<button class="tombol utama lebar" data-aksi="checkout">Lanjut: alamat & ongkir ' + ikon('kanan') + '</button></aside>';
    return h;
  }
  var HAL = { pembeli: {}, kedai: {}, kurir: {} };
  HAL.pembeli.menu = function () {
    var aktifP = pesananSaya().filter(aktif)[0];
    var kats = ['Semua'].concat(D.menu.map(function (m) { return m.kat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var daftar = D.menu.filter(function (m) { return m.aktif && (UI.kat === 'Semua' || m.kat === UI.kat) && (!UI.cari || m.nama.toLowerCase().indexOf(UI.cari.toLowerCase()) >= 0); });
    var jamNow = new Date().getHours(), sapa = jamNow < 11 ? 'Pagi' : jamNow < 15 ? 'Siang' : jamNow < 18 ? 'Sore' : 'Malam';
    var h = '<div class="tata-menu"><div class="kolom-menu">' +
      '<section class="hero" aria-labelledby="judulHero"><div class="hero-teks"><p class="sapa">Selamat ' + sapa.toLowerCase() + ', ' + esc(PEMBELI.nama.split(' ')[0]) + '</p><h1 id="judulHero">Lapar? Kurir <span data-tema-nama>' + esc(NAMA) + '</span> yang antar.</h1>' +
      '<p class="hero-sub">' + ikon('jam') + 'Buka ' + esc(D.kedai.buka) + '–' + esc(D.kedai.tutup) + ' · ongkir bisa ditawar lewat chat</p></div>' + ILUS_KURIR + '</section>';
    if (aktifP) h += '<button class="lacak-banner" data-aksi="buka-pesanan" data-id="' + aktifP.id + '">' + ikon(aktifP.status === 'diantar' ? 'motor' : 'struk') + '<span><b>' + esc(aktifP.kode) + ' · ' + esc(STATUS[aktifP.status]) + '</b><small>' + (aktifP.status === 'diantar' ? 'Tiba ± ' + etaMenit(aktifP) + ' menit lagi' : aktifP.ongkir.sepakat ? 'Ongkir sudah disepakati' : 'Ongkir masih ditawar') + '</small></span><span class="lacak-cta">Lacak ' + ikon('kanan') + '</span></button>';
    h += '<div class="saring"><label class="cari">' + ikon('cari') + '<span class="sr">Cari menu</span><input id="cariMenu" type="search" placeholder="Cari geprek, kopi…" value="' + esc(UI.cari) + '"></label>' +
      '<div class="chips" role="group" aria-label="Kategori">' + kats.map(function (k) { return '<button class="chip" data-aksi="kat" data-kat="' + esc(k) + '" aria-pressed="' + (UI.kat === k) + '">' + esc(k) + '</button>'; }).join('') + '</div></div>';
    if (!daftar.length) h += '<div class="kosong">' + gambar('soto', 'gbr-kosong') + '<p><b>Menu tidak ditemukan</b><br>Coba kata lain atau pilih kategori Semua.</p></div>';
    h += '<ul class="grid-menu">' + daftar.map(function (m, i) {
      var n = KERANJANG[m.id] || 0;
      return '<li class="kartu-menu' + (m.stok < 1 ? ' habis' : '') + '" style="--i:' + i + '"><div class="kartu-gbr k-' + m.kat.toLowerCase() + '">' + fotoMenu(m) +
        (m.stok < 1 ? '<span class="pita-habis">Habis</span>' : m.stok <= 5 ? '<span class="pita-sisa">Sisa ' + m.stok + '</span>' : '') + '</div>' +
        '<div class="kartu-isi"><h3>' + esc(m.nama) + '</h3><p>' + esc(m.ket) + '</p><div class="kartu-bawah"><b class="harga angka">' + rp(m.harga) + '</b>' + stepper(m, n) + '</div></div></li>';
    }).join('') + '</ul></div>' + panelKeranjang() + '</div>';
    var j = jmlKeranjang();
    if (j) h += '<button class="bar-keranjang" data-aksi="checkout"><span class="lencana">' + j + '</span><span>Lanjut ke alamat & ongkir</span><b class="angka">' + rp(subKeranjang()) + '</b></button>';
    return h;
  };
  HAL.pembeli.pesanan = function () {
    var ps = pesananSaya();
    if (!ps.length) return '<div class="kosong besar">' + ILUS_KURIR + '<p><b>Belum ada pesanan</b><br>Pesan dari menu, lalu lacak kurirnya di sini.</p><button class="tombol utama" data-sub="menu">Lihat menu</button></div>';
    if (!UI.pilihPembeli || !pesById(UI.pilihPembeli)) UI.pilihPembeli = (ps.filter(aktif)[0] || ps[0]).id;
    var p = pesById(UI.pilihPembeli);
    return '<div class="tata-dua' + (UI.lihatDetail ? ' lihat-detail' : '') + '"><aside class="daftar-samping" aria-label="Riwayat pesanan"><h2 class="judul-kolom">Pesananku</h2>' + daftarPesanan(ps, UI.pilihPembeli, 'pembeli') + '</aside>' +
      '<section class="detail" aria-label="Detail pesanan ' + esc(p.kode) + '">' + detailPembeli(p) + '</section></div>';
  };
  function daftarPesanan(ps, pilih, peran) {
    return '<ul class="list-pesanan">' + ps.map(function (p, i) {
      var tunda = !p.ongkir.sepakat && aktif(p);
      return '<li style="--i:' + i + '"><button class="item-pesanan' + (p.id === pilih ? ' dipilih' : '') + '" data-aksi="pilih" data-peran-pilih="' + peran + '" data-id="' + p.id + '"' + (p.id === pilih ? ' aria-current="true"' : '') + '>' +
        '<span class="ip-atas"><b>' + esc(peran === 'kedai' ? p.pembeli.nama : p.kode) + '</b><time>' + relatif(p.waktu) + '</time></span>' +
        '<span class="ip-tengah">' + esc(p.item.map(function (x) { return x.jml + '× ' + x.nama; }).join(', ')) + '</span>' +
        '<span class="ip-bawah">' + pilStatus(p) + (tunda ? '<span class="status s-tawar">' + ikon('tawar') + 'Tawar ' + rp(p.ongkir.usul) + '</span>' : '') + '<b class="angka">' + rp(total(p)) + '</b></span></button></li>';
    }).join('') + '</ul>';
  }
  function kartuKurir(p, peran) {
    var k = kurirById(p.kurir); if (!k) return '';
    return '<div class="kurir-kartu"><div class="avatar besar">' + ikon('motor') + '</div><div><small>Kurir ' + esc(NAMA) + '</small><b>' + esc(k.nama) + '</b><span class="redup kecil">' + esc(k.kendaraan) + '</span></div>' +
      '<div class="baris-tombol"><a class="ikon-tombol garis" href="tel:' + esc(k.hp) + '" aria-label="Telepon ' + esc(k.nama) + '">' + ikon('telp') + '</a><a class="ikon-tombol garis" target="_blank" rel="noopener" href="' + linkWA(k.hp, 'Halo Kang ' + k.nama.split(' ')[0] + ', saya ' + p.pembeli.nama + ' (pesanan ' + p.kode + ').') + '" aria-label="WhatsApp ' + esc(k.nama) + '">' + ikon('wa') + '</a></div></div>';
  }
  function detailPembeli(p) {
    var h = '<div class="detail-kepala"><button class="tombol hantu kembali" data-aksi="kembali">' + ikon('kanan', 'balik') + 'Semua pesanan</button><div><h1>' + esc(p.kode) + '</h1><p class="redup">' + new Date(p.waktu).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</p></div>' + pilStatus(p) + '</div>';
    h += '<div class="detail-grid"><div class="detail-utama">';
    h += '<section class="panel">' + langkah(p) + '</section>';
    if (p.status !== 'ditolak') {
      h += '<section class="panel peta-panel"><div class="peta" id="petaLacak" aria-label="Peta pelacakan"></div><div class="peta-info">' +
        (p.status === 'diantar' ? '<p class="eta"><b class="angka-besar">' + etaMenit(p) + '</b><span>menit lagi<br><small>perkiraan tiba</small></span></p>' : p.status === 'selesai' ? '<p class="eta"><b>Pesanan sampai</b></p>' : '<p class="eta"><span>Kurir berangkat setelah makanan siap.</span></p>') +
        '<div class="progres" role="progressbar" aria-label="Perjalanan kurir" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(progresKurir(p) * 100) + '"><i style="width:' + Math.round(progresKurir(p) * 100) + '%"></i></div></div>' + kartuKurir(p, 'pembeli') + '</section>';
    }
    h += '<section class="panel"><h2 class="judul-panel">Rincian</h2>' + rincian(p) + '<p class="alamat-kecil">' + ikon('pin') + esc(p.pembeli.alamat) + '</p></section>';
    h += '</div>' + panelChat(p, 'pembeli') + '</div>';
    return h;
  }

  function dlgCheckout() {
    if (!jmlKeranjang()) return;
    var pos = [PEMBELI.lat, PEMBELI.lng];
    var isi = '<div class="form-grid">' +
      '<div class="medan"><label for="cNama">Nama penerima</label><input id="cNama" name="nama" required autocomplete="name" value="' + esc(PEMBELI.nama) + '"></div>' +
      '<div class="medan"><label for="cHp">Nomor WhatsApp</label><input id="cHp" name="hp" required inputmode="tel" autocomplete="tel" value="' + esc(PEMBELI.hp) + '"></div>' +
      '<div class="medan lebar"><label for="cAlamat">Alamat lengkap</label><textarea id="cAlamat" name="alamat" required rows="2" autocomplete="street-address">' + esc(PEMBELI.alamat) + '</textarea></div>' +
      '<div class="medan lebar"><div class="label-baris"><span class="label">Pin lokasi antar</span><button type="button" class="tombol hantu kecil" data-aksi="lokasiku">' + ikon('lokasi') + 'Pakai lokasiku</button></div><div class="peta peta-pilih" id="petaPilih" aria-label="Geser pin ke rumahmu"></div><p class="bantu" id="infoJarak">Geser pin atau ketuk peta.</p></div>' +
      '<div class="medan lebar"><label for="cPatokan">Patokan / catatan untuk kurir</label><input id="cPatokan" name="catatan" value="' + esc(PEMBELI.catatan || '') + '" placeholder="mis. pagar hitam, sebelah warung"></div>' +
      '<fieldset class="medan lebar tawar-medan"><legend>Ongkir yang kamu tawarkan</legend><div class="baris-input"><span class="awalan">Rp</span><input id="cOngkir" name="ongkir" inputmode="numeric" required aria-describedby="infoOngkir"></div><div class="chips" id="chipOngkir"></div><p class="bantu" id="infoOngkir"></p></fieldset>' +
      '<fieldset class="medan lebar"><legend>Pembayaran</legend><div class="pilihan"><label class="opsi"><input type="radio" name="bayar" value="COD" checked><span>' + ikon('uang') + 'Tunai ke kurir (COD)</span></label><label class="opsi"><input type="radio" name="bayar" value="Transfer"><span>' + ikon('struk') + 'Transfer / QRIS</span></label></div></fieldset>' +
      '<label class="cek lebar"><input type="checkbox" name="wa" checked><span>Kirim juga ringkasan pesanan ke WhatsApp kedai (cadangan)</span></label>' +
      '</div><p class="galat" id="galatCheckout" role="alert"></p>';
    var kaki = '<div class="ringkas-kaki"><small>Subtotal ' + rp(subKeranjang()) + ' + ongkir</small><b class="angka" id="totalCheckout"></b></div><button class="tombol utama" type="submit">' + ikon('kirim') + 'Kirim pesanan</button>';
    bukaDialog('Alamat & tawar ongkir', isi, kaki, kirimPesanan, function () {
      var f = $('#dlgForm');
      function hitung() {
        var km = jarakKm(posKedai(), pos), s = saranOngkir(km);
        $('#infoJarak').textContent = 'Jarak dari kedai ± ' + km.toFixed(1).replace('.', ',') + ' km.';
        $('#infoOngkir').innerHTML = 'Saran kedai <b>' + rp(s) + '</b>. Tawar lebih rendah boleh, kedai akan menjawab di chat.';
        $('#chipOngkir').innerHTML = [s, s - 2000, s - 3000].filter(function (v, i, a) { return v >= 3000 && a.indexOf(v) === i; }).map(function (v, i) { return '<button type="button" class="chip" data-isi-ongkir="' + v + '">' + (i ? '' : 'Saran ') + rp(v) + '</button>'; }).join('');
        if (!f.ongkir.dataset.ubah) f.ongkir.value = s;
        f.dataset.saran = s; f.dataset.lat = pos[0]; f.dataset.lng = pos[1];
        tot();
      }
      function tot() { $('#totalCheckout').textContent = rp(subKeranjang() + (parseInt(String(f.ongkir.value).replace(/\D/g, ''), 10) || 0)); }
      f.ongkir.addEventListener('input', function () { f.ongkir.dataset.ubah = 1; tot(); });
      $('#chipOngkir').addEventListener('click', function (e) { var b = e.target.closest('[data-isi-ongkir]'); if (b) { f.ongkir.value = b.getAttribute('data-isi-ongkir'); f.ongkir.dataset.ubah = 1; tot(); } });
      var pk = buatPeta($('#petaPilih'), [{ pos: posKedai(), jenis: 'kedai', judul: 'Kedai' }, { pos: pos, jenis: 'tujuan', geser: true, judul: 'Lokasi antar (bisa digeser)' }]);
      function setPos(ll) { pos = [ll.lat, ll.lng]; if (pk) pk.penanda.tujuan.setLatLng(ll); hitung(); }
      if (pk) {
        pk.penanda.tujuan.on('dragend', function (e) { setPos(e.target.getLatLng()); });
        pk.peta.on('click', function (e) { setPos(e.latlng); });
      }
      $('[data-aksi="lokasiku"]').addEventListener('click', function () {
        if (!navigator.geolocation) { toast('Browser tidak mendukung lokasi.'); return; }
        navigator.geolocation.getCurrentPosition(function (g) { var ll = { lat: g.coords.latitude, lng: g.coords.longitude }; setPos(ll); if (pk) pk.peta.setView(ll, 16); },
          function () { toast('Izin lokasi ditolak. Geser pin secara manual.'); }, { enableHighAccuracy: true, timeout: 8000 });
      });
      hitung();
    });
  }
  function kirimPesanan(f) {
    var g = $('#galatCheckout'), ong = parseInt(String(f.ongkir.value).replace(/\D/g, ''), 10);
    $$('[aria-invalid]', f).forEach(function (e) { e.removeAttribute('aria-invalid'); });
    var salah = ['nama', 'hp', 'alamat'].filter(function (n) { return !f[n].value.trim(); });
    if (String(f.hp.value).replace(/\D/g, '').length < 9) salah.push('hp');
    if (!ong || ong < 1000) salah.push('ongkir');
    if (salah.length) {
      salah.forEach(function (n) { f[n].setAttribute('aria-invalid', 'true'); });
      g.textContent = salah.indexOf('ongkir') >= 0 ? 'Isi tawaran ongkir minimal Rp1.000.' : salah.indexOf('hp') >= 0 ? 'Nomor WhatsApp belum benar (minimal 9 angka).' : 'Lengkapi nama dan alamat dulu ya.';
      f[salah[0]].focus(); return false;
    }
    var ks = Object.keys(KERANJANG).filter(function (k) { var m = menuById(k); return m && m.stok > 0; });
    var item = ks.map(function (k) { var m = menuById(k), j = Math.min(KERANJANG[k], m.stok); m.stok -= j; return { menu: k, nama: m.nama, harga: m.harga, jml: j }; });
    PEMBELI = { nama: f.nama.value.trim(), hp: f.hp.value.trim(), alamat: f.alamat.value.trim(), catatan: f.catatan.value.trim(), lat: +f.dataset.lat, lng: +f.dataset.lng };
    tulisLokal(K_PEMBELI, PEMBELI);
    var now = Date.now(), p = {
      id: uid('p'), kode: 'P-0' + (D.nomor++), waktu: now, status: 'baru', bayar: f.bayar.value, kurir: null,
      pembeli: PEMBELI, item: item, subtotal: item.reduce(function (s, x) { return s + x.harga * x.jml; }, 0),
      ongkir: { saran: +f.dataset.saran, usul: ong, oleh: 'pembeli', sepakat: false },
      chat: [{ dari: 'pembeli', tipe: 'tawar', nominal: ong, waktu: now }], log: [{ s: 'baru', t: now }]
    };
    if (PEMBELI.catatan) p.chat.push({ dari: 'pembeli', teks: 'Patokan: ' + PEMBELI.catatan, waktu: now + 1 });
    D.pesanan.push(p); KERANJANG = {}; tulisLokal(K_KERANJANG, KERANJANG);
    if (f.wa.checked) window.open(linkWA(D.kedai.wa, waPesanan(p)), '_blank', 'noopener');
    UI.sub.pembeli = 'pesanan'; UI.pilihPembeli = p.id; UI.lihatDetail = true;
    simpan({ tipe: 'baru', kode: p.kode });
    toast('Pesanan ' + p.kode + ' terkirim. Tunggu kedai menjawab tawaran ongkir.');
    return true;
  }

  // ================= KEDAI =================
  HAL.kedai.masuk = function () {
    var f = UI.filterKedai, semua = D.pesanan.slice().sort(urutBaru);
    var saring = { aktif: semua.filter(aktif), baru: semua.filter(function (p) { return p.status === 'baru'; }), antar: semua.filter(function (p) { return p.status === 'siap' || p.status === 'diantar'; }), selesai: semua.filter(function (p) { return !aktif(p); }).slice(0, 30) };
    var ps = saring[f], dipilih = pesById(UI.pilihKedai);
    // pesanan yang sedang dibuka tetap terlihat walau statusnya berpindah saringan
    if (dipilih && ps.indexOf(dipilih) < 0 && UI.pertahankan) { f = UI.filterKedai = aktif(dipilih) ? 'aktif' : 'selesai'; ps = saring[f]; }
    UI.pertahankan = false;
    var hari = semua.filter(function (p) { return p.status === 'selesai' && tglKunci(p.waktu) === tglKunci(Date.now()); });
    var h = '<div class="kepala-hal"><div><p class="sapa">Dapur ' + esc(NAMA) + '</p><h1>Pesanan masuk</h1></div><div class="statistik-mini">' +
      '<span><b class="angka">' + saring.baru.length + '</b>baru</span><span><b class="angka">' + semua.filter(function (p) { return p.status === 'dimasak' || p.status === 'diterima'; }).length + '</b>di dapur</span><span><b class="angka">' + saring.antar.length + '</b>di jalan</span><span><b class="angka">' + rp(hari.reduce(function (s, p) { return s + p.subtotal; }, 0)) + '</b>omzet hari ini</span></div></div>';
    h += '<div class="tata-dua kedai' + (UI.lihatDetail ? ' lihat-detail' : '') + '"><aside class="daftar-samping" aria-label="Daftar pesanan"><div class="chips" role="group" aria-label="Saring pesanan">' +
      [['aktif', 'Aktif'], ['baru', 'Baru'], ['antar', 'Diantar'], ['selesai', 'Riwayat']].map(function (x) { return '<button class="chip" data-aksi="filter" data-f="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + ' <span class="angka">' + saring[x[0]].length + '</span></button>'; }).join('') + '</div>';
    if (!ps.length) { h += '<div class="kosong kecil-kosong"><p><b>Tidak ada pesanan di sini</b><br>Pesanan baru dari pembeli muncul otomatis.</p></div></aside><section class="detail kosong-detail"><div class="kosong">' + ILUS_KURIR + '<p>Pilih pesanan untuk melihat detail dan chat.</p></div></section></div>'; return h; }
    if (!UI.pilihKedai || ps.map(function (p) { return p.id; }).indexOf(UI.pilihKedai) < 0) UI.pilihKedai = ps[0].id;
    var p = pesById(UI.pilihKedai);
    h += daftarPesanan(ps, p.id, 'kedai') + '</aside><section class="detail" aria-label="Detail pesanan ' + esc(p.kode) + '">' + detailKedai(p) + '</section></div>';
    return h;
  };
  function aksiKedai(p) {
    var s = p.status, h = '<div class="aksi-status">';
    if (s === 'baru') {
      h += '<button class="tombol utama" data-aksi="terima" data-id="' + p.id + '"' + (p.ongkir.sepakat ? '' : ' disabled aria-describedby="hintTerima"') + '>' + ikon('cek') + 'Terima pesanan</button><button class="tombol garis bahaya" data-aksi="tolak" data-id="' + p.id + '">Tolak</button>';
      if (!p.ongkir.sepakat) h += '<p class="bantu" id="hintTerima">' + ikon('tawar') + 'Sepakati ongkir dulu di chat, lalu terima.</p>';
    } else if (s === 'diterima') h += '<button class="tombol utama" data-aksi="masak" data-id="' + p.id + '">' + ikon('menu') + 'Mulai masak</button>';
    else if (s === 'dimasak' || s === 'siap') {
      h += '<div class="tugaskan"><label for="pilihKurir">' + (s === 'siap' ? 'Kurir ditugaskan' : 'Tugaskan kurir') + '</label><select id="pilihKurir">' + D.kurir.map(function (k) {
        var sibuk = D.pesanan.filter(function (x) { return x.kurir === k.id && (x.status === 'siap' || x.status === 'diantar'); }).length;
        return '<option value="' + k.id + '"' + (p.kurir === k.id ? ' selected' : '') + '>' + esc(k.nama) + (sibuk ? ' · ' + sibuk + ' antaran' : ' · kosong') + '</option>';
      }).join('') + '</select><button class="tombol utama" data-aksi="tugaskan" data-id="' + p.id + '">' + ikon('motor') + (s === 'siap' ? 'Ganti kurir' : 'Makanan siap, panggil kurir') + '</button></div>';
      if (s === 'siap') h += '<p class="bantu">' + ikon('jam') + 'Menunggu ' + esc((kurirById(p.kurir) || {}).nama || 'kurir') + ' mengambil pesanan.</p>';
    } else if (s === 'diantar') h += '<p class="bantu">' + ikon('motor') + 'Sedang diantar, tiba ± ' + etaMenit(p) + ' menit.</p>';
    else if (s === 'selesai') h += '<p class="bantu ok">' + ikon('cek') + 'Selesai ' + jam(p.log[p.log.length - 1].t) + (p.cod ? ' · COD diterima ' + rp(p.cod.terima) + (p.setor ? ', sudah disetor' : ', belum disetor kurir') : '') + '</p>';
    h += '<a class="tombol garis" target="_blank" rel="noopener" href="' + linkWA(p.pembeli.hp, 'Halo kak ' + p.pembeli.nama + ', pesanan ' + p.kode + ' di ' + NAMA + ' statusnya: ' + STATUS[p.status] + '. Total ' + rp(total(p)) + ' (' + p.bayar + '). Terima kasih!') + '">' + ikon('wa') + 'Kabari via WA</a>';
    return h + '</div>';
  }
  function detailKedai(p) {
    var km = jarakKm(posKedai(), posPembeli(p));
    var h = '<div class="detail-kepala"><button class="tombol hantu kembali" data-aksi="kembali">' + ikon('kanan', 'balik') + 'Semua pesanan</button><div><h1>' + esc(p.kode) + ' · ' + esc(p.pembeli.nama) + '</h1><p class="redup">' + relatif(p.waktu) + ' · ' + km.toFixed(1).replace('.', ',') + ' km · ' + esc(p.bayar) + '</p></div>' + pilStatus(p) + '</div>';
    h += '<div class="detail-grid"><div class="detail-utama"><section class="panel">' + langkah(p) + aksiKedai(p) + '</section>' +
      '<section class="panel"><h2 class="judul-panel">Pesanan</h2>' + rincian(p) + '</section>' +
      '<section class="panel peta-panel"><div class="peta peta-kecil" id="petaKedai"></div><p class="alamat-kecil">' + ikon('pin') + esc(p.pembeli.alamat) + (p.pembeli.catatan ? ' · <i>' + esc(p.pembeli.catatan) + '</i>' : '') + '</p></section></div>' +
      panelChat(p, 'kedai') + '</div>';
    return h;
  }
  HAL.kedai.stok = function () {
    var h = '<div class="kepala-hal"><div><p class="sapa">Atur yang tampil di pembeli</p><h1>Menu & stok</h1></div><button class="tombol utama" data-aksi="menu-baru">' + ikon('tambah') + 'Tambah menu</button></div>';
    h += '<ul class="list-stok">' + D.menu.map(function (m, i) {
      return '<li class="panel baris-stok' + (m.aktif ? '' : ' nonaktif') + '" style="--i:' + i + '"><div class="kartu-gbr kecil k-' + m.kat.toLowerCase() + '">' + fotoMenu(m) + '</div>' +
        '<div class="stok-info"><b>' + esc(m.nama) + '</b><span class="redup kecil">' + esc(m.kat) + ' · <span class="angka">' + rp(m.harga) + '</span></span></div>' +
        '<div class="stok-ubah" role="group" aria-label="Stok ' + esc(m.nama) + '"><span class="label-kecil">Stok</span><div class="stepper"><button data-aksi="stok" data-id="' + m.id + '" data-n="-1" aria-label="Kurangi stok">' + ikon('kurang') + '</button><output class="angka' + (m.stok < 1 ? ' nol' : m.stok <= 5 ? ' tipis' : '') + '">' + m.stok + '</output><button data-aksi="stok" data-id="' + m.id + '" data-n="1" aria-label="Tambah stok">' + ikon('tambah') + '</button></div></div>' +
        '<label class="sakelar"><input type="checkbox" data-aksi="menu-aktif" data-id="' + m.id + '"' + (m.aktif ? ' checked' : '') + '><span aria-hidden="true"></span><b>Tampil</b></label>' +
        '<div class="baris-tombol"><button class="ikon-tombol garis" data-aksi="menu-ubah" data-id="' + m.id + '" aria-label="Ubah ' + esc(m.nama) + '">' + ikon('ubah') + '</button><button class="ikon-tombol garis" data-aksi="menu-hapus" data-id="' + m.id + '" aria-label="Hapus ' + esc(m.nama) + '">' + ikon('hapus') + '</button></div></li>';
    }).join('') + '</ul>';
    return h;
  };
  function dlgMenu(m) {
    var baru = !m; m = m || { nama: '', kat: 'Makanan', harga: '', stok: 10, gambar: 'geprek', ket: '', aktif: true };
    var isi = '<div class="form-grid"><div class="medan lebar"><label for="mNama">Nama menu</label><input id="mNama" name="nama" required value="' + esc(m.nama) + '"></div>' +
      '<div class="medan"><label for="mHarga">Harga (Rp)</label><input id="mHarga" name="harga" inputmode="numeric" required value="' + esc(m.harga) + '"></div>' +
      '<div class="medan"><label for="mStok">Stok hari ini</label><input id="mStok" name="stok" type="number" min="0" required value="' + esc(m.stok) + '"></div>' +
      '<div class="medan"><label for="mKat">Kategori</label><select id="mKat" name="kat">' + ['Makanan', 'Minuman', 'Camilan'].map(function (k) { return '<option' + (k === m.kat ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></div>' +
      '<div class="medan"><label for="mKet">Keterangan singkat</label><input id="mKet" name="ket" value="' + esc(m.ket) + '"></div>' +
      '<fieldset class="medan lebar"><legend>Gambar</legend><div class="pilih-gbr">' + GAMBAR.map(function (g) { return '<label><input type="radio" name="gambar" value="' + g + '"' + (g === m.gambar ? ' checked' : '') + '><span>' + gambar(g) + '<span class="sr">' + g + '</span></span></label>'; }).join('') + '</div></fieldset>' +
      '<div class="medan lebar"><label for="mFoto">Foto menu (opsional, menggantikan gambar)</label><input id="mFoto" type="file" accept="image/*"><input type="hidden" name="foto" value="' + esc(m.foto || '') + '"><p class="bantu" id="infoFoto">' + (m.foto ? 'Foto tersimpan. Pilih berkas lain untuk mengganti.' : 'Diperkecil otomatis ke 400px.') + '</p>' + (m.foto ? '<button type="button" class="tombol hantu kecil" data-aksi="hapus-foto">Hapus foto</button>' : '') + '</div></div><p class="galat" role="alert" id="galatMenu"></p>';
    bukaDialog(baru ? 'Tambah menu' : 'Ubah menu', isi, '<button class="tombol utama" type="submit">' + ikon('cek') + 'Simpan</button>', function (f) {
      var harga = parseInt(String(f.harga.value).replace(/\D/g, ''), 10), stok = parseInt(f.stok.value, 10);
      if (!f.nama.value.trim() || !harga || isNaN(stok) || stok < 0) { $('#galatMenu').textContent = 'Isi nama, harga, dan stok (angka 0 atau lebih).'; return false; }
      var o = { nama: f.nama.value.trim(), harga: harga, stok: stok, kat: f.kat.value, ket: f.ket.value.trim(), gambar: f.gambar.value, foto: f.foto.value };
      if (baru) { o.id = uid('m'); o.aktif = true; D.menu.push(o); } else Object.assign(m, o);
      simpan(); toast(baru ? 'Menu ditambahkan.' : 'Menu diperbarui.'); return true;
    });
  }
  HAL.kedai.laporan = function () {
    var hari = UI.periode, batas = new Date(); batas.setHours(0, 0, 0, 0); batas = batas.getTime() - (hari - 1) * 86400000;
    var sel = D.pesanan.filter(function (p) { return p.status === 'selesai' && p.waktu >= batas; });
    var omzet = sel.reduce(function (s, p) { return s + p.subtotal; }, 0), ong = sel.reduce(function (s, p) { return s + (p.ongkir.final || 0); }, 0);
    var turun = sel.filter(function (p) { return p.ongkir.saran; }).reduce(function (s, p) { return s + (p.ongkir.saran - p.ongkir.final); }, 0);
    var perHari = []; for (var i = hari - 1; i >= 0; i--) { var t = Date.now() - i * 86400000, k = tglKunci(t); perHari.push({ t: t, n: sel.filter(function (p) { return tglKunci(p.waktu) === k; }).reduce(function (s, p) { return s + p.subtotal; }, 0) }); }
    var maks = Math.max.apply(0, perHari.map(function (x) { return x.n; }).concat([1]));
    var laris = {}; sel.forEach(function (p) { p.item.forEach(function (x) { laris[x.nama] = (laris[x.nama] || 0) + x.jml; }); });
    var top = Object.keys(laris).sort(function (a, b) { return laris[b] - laris[a]; }).slice(0, 5), topMaks = top.length ? laris[top[0]] : 1;
    var h = '<div class="kepala-hal"><div><p class="sapa">Rekap penjualan antar</p><h1>Laporan</h1></div><div class="chips" role="group" aria-label="Periode">' + [[1, 'Hari ini'], [7, '7 hari']].map(function (x) { return '<button class="chip" data-aksi="periode" data-n="' + x[0] + '" aria-pressed="' + (hari === x[0]) + '">' + x[1] + '</button>'; }).join('') + '<button class="chip" data-aksi="csv">' + ikon('unduh') + 'CSV</button></div></div>';
    h += '<div class="lap-grid"><section class="panel lap-utama"><p class="label-kecil">Omzet menu</p><p class="angka-besar">' + rp(omzet) + '</p><p class="redup">' + sel.length + ' pesanan selesai · ongkir terkumpul ' + rp(ong) + '</p>' +
      (hari > 1 ? '<div class="batang" role="img" aria-label="Omzet per hari">' + perHari.map(function (x) { return '<div class="kol"><i style="height:' + Math.max(3, x.n / maks * 100) + '%" title="' + rp(x.n) + '"></i><small>' + new Date(x.t).toLocaleDateString('id-ID', { weekday: 'short' }) + '</small></div>'; }).join('') + '</div>' : '') + '</section>';
    h += '<section class="panel"><h2 class="judul-panel">Hasil tawar ongkir</h2><p class="angka-sedang">' + rp(sel.length ? Math.round(ong / sel.length / 100) * 100 : 0) + '</p><p class="redup kecil">rata-rata ongkir disepakati per antaran</p><p class="insight">' + ikon('tawar') + (turun > 0 ? 'Total diskon ongkir dari tawar-menawar: <b>' + rp(turun) + '</b>. Bila terlalu besar, naikkan ongkir minimal di Atur.' : 'Pembeli umumnya setuju dengan saran ongkir.') + '</p></section>';
    h += '<section class="panel"><h2 class="judul-panel">Menu terlaris</h2>' + (top.length ? '<ol class="laris">' + top.map(function (n) { return '<li><span>' + esc(n) + '</span><span class="laris-batang"><i style="width:' + (laris[n] / topMaks * 100) + '%"></i></span><b class="angka">' + laris[n] + '</b></li>'; }).join('') + '</ol>' : '<p class="redup">Belum ada penjualan di periode ini.</p>') + '</section>';
    h += '<section class="panel"><h2 class="judul-panel">Kurir & setoran COD</h2><ul class="list-kurir">' + D.kurir.map(function (k) {
      var mine = sel.filter(function (p) { return p.kurir === k.id; }), blm = D.pesanan.filter(function (p) { return p.kurir === k.id && p.cod && !p.setor; }).reduce(function (s, p) { return s + p.cod.terima; }, 0);
      return '<li><div class="avatar">' + ikon('motor') + '</div><div><b>' + esc(k.nama) + '</b><span class="redup kecil">' + mine.length + ' antaran · belum setor <span class="angka">' + rp(blm) + '</span></span></div>' + (blm ? '<button class="tombol garis kecil" data-aksi="setor" data-id="' + k.id + '">Tandai disetor</button>' : '<span class="status s-selesai">Lunas</span>') + '</li>';
    }).join('') + '</ul></section></div>';
    return h;
  };
  HAL.kedai.atur = function () {
    var k = D.kedai;
    return '<div class="kepala-hal"><div><p class="sapa">Profil kedai & tarif</p><h1>Atur</h1></div></div><div class="atur-grid">' +
      '<form class="panel" data-form="atur"><h2 class="judul-panel">Kedai & ongkir</h2><div class="form-grid">' +
      '<div class="medan lebar"><label for="aAlamat">Alamat kedai</label><input id="aAlamat" name="alamat" value="' + esc(k.alamat) + '"></div>' +
      '<div class="medan"><label for="aWa">WhatsApp kedai</label><input id="aWa" name="wa" inputmode="tel" value="' + esc(k.wa) + '"></div>' +
      '<div class="medan"><label for="aBuka">Jam buka–tutup</label><div class="baris-input"><input id="aBuka" name="buka" value="' + esc(k.buka) + '" aria-label="Jam buka"><span>–</span><input name="tutup" value="' + esc(k.tutup) + '" aria-label="Jam tutup"></div></div>' +
      '<div class="medan"><label for="aDasar">Ongkir dasar (Rp)</label><input id="aDasar" name="ongkirDasar" inputmode="numeric" value="' + k.ongkirDasar + '"></div>' +
      '<div class="medan"><label for="aKm">Per km (Rp)</label><input id="aKm" name="perKm" inputmode="numeric" value="' + k.perKm + '"></div>' +
      '<div class="medan"><label for="aMin">Ongkir minimal (Rp)</label><input id="aMin" name="ongkirMin" inputmode="numeric" value="' + k.ongkirMin + '"></div>' +
      '<div class="medan"><label for="aLat">Titik kedai (lat, lng)</label><input id="aLat" name="latlng" value="' + k.lat + ', ' + k.lng + '"></div>' +
      '</div><p class="bantu">Rumus saran: dasar + jarak × per km, dibulatkan ke ribuan. Contoh 2 km = <b>' + rp(saranOngkir(2)) + '</b>.</p><button class="tombol utama" type="submit">' + ikon('cek') + 'Simpan</button></form>' +
      '<section class="panel"><h2 class="judul-panel">Kurir kedai</h2><ul class="list-kurir">' + D.kurir.map(function (x) { return '<li><div class="avatar">' + ikon('motor') + '</div><div><b>' + esc(x.nama) + '</b><span class="redup kecil">' + esc(x.hp) + ' · ' + esc(x.kendaraan) + '</span></div><button class="ikon-tombol garis" data-aksi="kurir-hapus" data-id="' + x.id + '" aria-label="Hapus ' + esc(x.nama) + '">' + ikon('hapus') + '</button></li>'; }).join('') + '</ul>' +
      '<form class="form-grid tambah-kurir" data-form="kurir"><div class="medan"><label for="kNama">Nama kurir</label><input id="kNama" name="nama" required></div><div class="medan"><label for="kHp">No. HP</label><input id="kHp" name="hp" inputmode="tel" required></div><div class="medan lebar"><label for="kKend">Kendaraan & plat</label><input id="kKend" name="kendaraan" placeholder="mis. Honda Vario · D 1234 AB"></div><button class="tombol garis" type="submit">' + ikon('tambah') + 'Tambah kurir</button></form></section>' +
      '<section class="panel"><h2 class="judul-panel">Data</h2><p class="redup kecil">Data tersimpan di browser perangkat ini. Unduh CSV untuk arsip, atau kembalikan ke data contoh.</p><div class="baris-tombol"><button class="tombol garis" data-aksi="csv">' + ikon('unduh') + 'Unduh CSV pesanan</button><button class="tombol garis bahaya" data-aksi="reset">Kembalikan data contoh</button></div></section></div>';
  };

  // ================= KURIR =================
  HAL.kurir.antaran = function () {
    var saya = kurirById(UI.sayaKurir) || D.kurir[0];
    if (!saya) return '<div class="kosong besar"><p><b>Belum ada kurir</b><br>Tambahkan kurir di sudut Kedai › Atur.</p></div>';
    UI.sayaKurir = saya.id;
    var mine = D.pesanan.filter(function (p) { return p.kurir === saya.id; }).sort(urutBaru);
    var jalan = mine.filter(function (p) { return p.status === 'diantar'; }), tugas = mine.filter(function (p) { return p.status === 'siap'; });
    var hariIni = mine.filter(function (p) { return p.status === 'selesai' && tglKunci(p.log[p.log.length - 1].t) === tglKunci(Date.now()); });
    var h = '<div class="kepala-hal"><div><p class="sapa">Siap jalan, ' + esc(saya.nama.split(' ')[0]) + '?</p><h1>Antaran saya</h1></div><label class="pilih-saya"><span>Masuk sebagai</span><select id="sayaKurir">' + D.kurir.map(function (k) { return '<option value="' + k.id + '"' + (k.id === saya.id ? ' selected' : '') + '>' + esc(k.nama) + '</option>'; }).join('') + '</select></label></div>';
    var semua = jalan.concat(tugas);
    if (!semua.length) h += '<div class="kosong besar">' + ILUS_KURIR + '<p><b>Belum ada antaran</b><br>Antaran muncul di sini begitu kedai menugaskanmu.</p></div>';
    h += '<ul class="list-antaran">' + semua.map(function (p, i) {
      var km = jarakKm(posKedai(), posPembeli(p)), tag = p.bayar === 'COD' ? total(p) : 0;
      return '<li class="panel antaran" style="--i:' + i + '"><div class="antaran-kepala"><div><b>' + esc(p.kode) + ' · ' + esc(p.pembeli.nama) + '</b><span class="redup kecil">' + km.toFixed(1).replace('.', ',') + ' km · ' + p.item.reduce(function (s, x) { return s + x.jml; }, 0) + ' item</span></div>' + pilStatus(p) + '</div>' +
        '<div class="antaran-isi"><div class="peta peta-antar" id="petaAntar-' + p.id + '"></div><div class="antaran-info"><p class="alamat-kecil">' + ikon('pin') + '<span>' + esc(p.pembeli.alamat) + (p.pembeli.catatan ? '<br><i>' + esc(p.pembeli.catatan) + '</i>' : '') + '</span></p>' +
        '<div class="tagih' + (tag ? '' : ' lunas') + '"><small>' + (tag ? 'Tagih tunai (COD)' : 'Sudah dibayar transfer') + '</small><b class="angka-sedang">' + rp(tag || total(p)) + '</b></div>' +
        '<div class="baris-tombol"><a class="tombol garis" target="_blank" rel="noopener" href="' + linkRute(posKedai(), posPembeli(p)) + '">' + ikon('rute') + 'Rute Google Maps</a><a class="ikon-tombol garis" href="tel:' + esc(p.pembeli.hp) + '" aria-label="Telepon pembeli">' + ikon('telp') + '</a><a class="ikon-tombol garis" target="_blank" rel="noopener" href="' + linkWA(p.pembeli.hp, 'Halo kak ' + p.pembeli.nama + ', saya ' + saya.nama + ' kurir ' + NAMA + '. Pesanan ' + p.kode + (p.status === 'diantar' ? ' sedang menuju lokasi kakak.' : ' segera saya ambil.') + (tag ? ' Tagihan COD ' + rp(tag) + '.' : '')) + '" aria-label="WhatsApp pembeli">' + ikon('wa') + '</a></div>' +
        (p.status === 'siap' ? '<button class="tombol utama lebar" data-aksi="ambil" data-id="' + p.id + '">' + ikon('motor') + 'Ambil & mulai antar</button>' : '<button class="tombol utama lebar" data-aksi="sampai" data-id="' + p.id + '">' + ikon('cek') + 'Sudah sampai' + (tag ? ', terima COD' : '') + '</button>') +
        '</div></div></li>';
    }).join('') + '</ul>';
    if (hariIni.length) h += '<section class="panel selesai-hari"><h2 class="judul-panel">Selesai hari ini · ' + hariIni.length + '</h2><ul class="rincian">' + hariIni.map(function (p) { return '<li><span>' + esc(p.kode) + ' · ' + esc(p.pembeli.nama) + '</span><span class="angka">' + (p.cod ? 'COD ' + rp(p.cod.terima) : 'Transfer') + '</span></li>'; }).join('') + '</ul></section>';
    return h;
  };
  HAL.kurir.setoran = function () {
    var saya = kurirById(UI.sayaKurir) || D.kurir[0]; if (!saya) return '';
    var blm = D.pesanan.filter(function (p) { return p.kurir === saya.id && p.cod && !p.setor; }).sort(urutBaru);
    var n = blm.reduce(function (s, p) { return s + p.cod.terima; }, 0);
    return '<div class="kepala-hal"><div><p class="sapa">' + esc(saya.nama) + '</p><h1>Uang COD dipegang</h1></div></div><section class="panel setor-panel"><p class="label-kecil">Wajib disetor ke kedai</p><p class="angka-besar">' + rp(n) + '</p><p class="redup">' + blm.length + ' antaran COD belum disetor. Kedai menandai lunas di Laporan.</p>' +
      (blm.length ? '<ul class="rincian">' + blm.map(function (p) { return '<li><span>' + esc(p.kode) + ' · ' + esc(p.pembeli.nama) + '<br><small class="redup">' + relatif(p.cod.t) + '</small></span><span class="angka">' + rp(p.cod.terima) + '</span></li>'; }).join('') + '</ul>' : '<p class="bantu ok">' + ikon('cek') + 'Semua uang COD sudah disetor.</p>') +
      '<a class="tombol garis" target="_blank" rel="noopener" href="' + linkWA(D.kedai.wa, 'Setoran COD ' + saya.nama + ': ' + rp(n) + ' dari ' + blm.length + ' antaran (' + blm.map(function (p) { return p.kode; }).join(', ') + ').') + '">' + ikon('wa') + 'Lapor setoran ke kedai</a></section>';
  };
  function dlgSampai(p) {
    var tag = p.bayar === 'COD' ? total(p) : 0;
    var isi = tag ? '<p class="angka-sedang">Tagihan ' + rp(tag) + '</p><div class="medan"><label for="uangDiterima">Uang diterima dari pembeli (Rp)</label><input id="uangDiterima" name="uang" inputmode="numeric" required value="' + tag + '"></div><div class="chips" id="chipUang">' + [tag, Math.ceil(tag / 50000) * 50000, Math.ceil(tag / 100000) * 100000].filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (v) { return '<button type="button" class="chip" data-uang="' + v + '">' + rp(v) + '</button>'; }).join('') + '</div><p class="kembalian" id="kembalian" aria-live="polite"></p><p class="galat" role="alert" id="galatSampai"></p>'
      : '<p>Pesanan sudah dibayar transfer. Pastikan diterima langsung oleh <b>' + esc(p.pembeli.nama) + '</b>.</p>';
    bukaDialog('Selesaikan ' + p.kode, isi, '<button class="tombol utama" type="submit">' + ikon('cek') + 'Selesai</button>', function (f) {
      if (tag) {
        var u = parseInt(String(f.uang.value).replace(/\D/g, ''), 10) || 0;
        if (u < tag) { $('#galatSampai').textContent = 'Uang kurang ' + rp(tag - u) + '.'; f.uang.setAttribute('aria-invalid', 'true'); return false; }
        p.cod = { terima: tag, t: Date.now() }; p.setor = false;
      }
      setStatus(p, 'selesai'); p.chat.push({ dari: 'sistem', teks: 'Pesanan sampai. Terima kasih sudah pesan di ' + NAMA + '!', waktu: Date.now() });
      simpan({ tipe: 'chat', kode: p.kode, untuk: 'pembeli' }); toast(p.kode + ' selesai.'); return true;
    }, function () {
      if (!tag) return;
      function hit() { var u = parseInt(String($('#uangDiterima').value).replace(/\D/g, ''), 10) || 0; $('#kembalian').innerHTML = u >= tag ? 'Kembalian <b class="angka">' + rp(u - tag) + '</b>' : 'Kurang <b class="angka">' + rp(tag - u) + '</b>'; }
      $('#uangDiterima').addEventListener('input', hit);
      $('#chipUang').addEventListener('click', function (e) { var b = e.target.closest('[data-uang]'); if (b) { $('#uangDiterima').value = b.getAttribute('data-uang'); hit(); } });
      hit();
    });
  }

  // ================= Peta setelah render =================
  var timerLacak = null;
  var SETELAH = {
    'pembeli/pesanan': function () {
      var p = pesById(UI.pilihPembeli), el = $('#petaLacak'); if (!p || !el) return;
      var t = [{ pos: posKedai(), jenis: 'kedai' }, { pos: posPembeli(p), jenis: 'tujuan' }];
      if (p.status === 'diantar') t.splice(1, 0, { pos: posKurir(p), jenis: 'kurir' });
      var pk = buatPeta(el, t, { garis: true });
      clearInterval(timerLacak);
      if (p.status === 'diantar') timerLacak = setInterval(function () {
        if (!document.body.contains(el)) { clearInterval(timerLacak); return; }
        if (pk && pk.penanda.kurir) pk.penanda.kurir.setLatLng(posKurir(p));
        var bar = $('.progres i'); if (bar) { bar.style.width = Math.round(progresKurir(p) * 100) + '%'; bar.parentNode.setAttribute('aria-valuenow', Math.round(progresKurir(p) * 100)); }
        var e = $('.eta .angka-besar'); if (e) e.textContent = etaMenit(p);
      }, 4000);
    },
    'kedai/masuk': function () {
      var p = pesById(UI.pilihKedai), el = $('#petaKedai'); if (!p || !el) return;
      var t = [{ pos: posKedai(), jenis: 'kedai' }, { pos: posPembeli(p), jenis: 'tujuan' }];
      if (p.status === 'diantar') t.splice(1, 0, { pos: posKurir(p), jenis: 'kurir' });
      buatPeta(el, t, { garis: true });
    },
    'kurir/antaran': function () {
      $$('[id^="petaAntar-"]').forEach(function (el) {
        var p = pesById(el.id.replace('petaAntar-', '')); if (!p) return;
        buatPeta(el, [{ pos: posKedai(), jenis: 'kedai' }, { pos: posPembeli(p), jenis: 'tujuan' }], { garis: true });
      });
    }
  };

  // ================= Dialog =================
  var dlgSubmit = null;
  function bukaDialog(judul, isi, kaki, onSubmit, setelah) {
    var d = $('#dlg');
    $('#dlgJudul').textContent = judul; $('#dlgIsi').innerHTML = isi; $('#dlgKaki').innerHTML = kaki;
    dlgSubmit = onSubmit; d.classList.remove('keluar');
    if (!d.open) d.showModal();
    if (setelah) setelah();
    var f = $('input:not([type=radio]):not([type=checkbox]), textarea', d); if (f && matchMedia('(min-width: 760px)').matches) f.focus();
  }
  function tutupDialog() {
    var d = $('#dlg'); if (!d.open) return;
    if (!GERAK) { d.close(); return; }
    d.classList.add('keluar'); setTimeout(function () { d.close(); d.classList.remove('keluar'); }, 220);
  }
  $('#dlg').addEventListener('close', function () { $$('.leaflet-container', $('#dlg')).forEach(function () {}); });
  $('#dlgForm').addEventListener('submit', function (e) { e.preventDefault(); if (dlgSubmit && dlgSubmit(e.target) !== false) tutupDialog(); });
  $('#dlg').addEventListener('click', function (e) { if (e.target.closest('[data-tutup]') || e.target === e.currentTarget) tutupDialog(); });
  $('#dlg').addEventListener('cancel', function (e) { e.preventDefault(); tutupDialog(); });
  function konfirmasi(judul, teks, label, cb) {
    bukaDialog(judul, '<p>' + teks + '</p>', '<button class="tombol hantu" type="button" data-tutup>Batal</button><button class="tombol utama bahaya-isi" type="submit">' + label + '</button>', function () { cb(); return true; });
  }

  // ================= CSV =================
  function csv() {
    var baris = [['kode', 'waktu', 'pembeli', 'hp', 'alamat', 'item', 'subtotal', 'ongkir_saran', 'ongkir_final', 'bayar', 'status', 'kurir']];
    D.pesanan.slice().sort(urutBaru).forEach(function (p) {
      baris.push([p.kode, new Date(p.waktu).toISOString(), p.pembeli.nama, p.pembeli.hp, p.pembeli.alamat, p.item.map(function (x) { return x.jml + 'x ' + x.nama; }).join('; '), p.subtotal, p.ongkir.saran || '', ongkirNilai(p), p.bayar, p.status, (kurirById(p.kurir) || {}).nama || '']);
    });
    var teks = baris.map(function (r) { return r.map(function (v) { v = String(v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + teks], { type: 'text/csv' }));
    a.download = 'pesanan-' + tglKunci(Date.now()) + '.csv'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // ================= Aksi =================
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-peran],[data-sub],[data-aksi]'); if (!t || t.closest('#dlg') && !t.hasAttribute('data-aksi')) return;
    if (t.hasAttribute('data-peran') && t.closest('.peran')) { gantiPeran(t.getAttribute('data-peran')); return; }
    if (t.hasAttribute('data-sub')) { UI.sub[UI.peran] = t.getAttribute('data-sub'); UI.lihatDetail = false; render(); window.scrollTo(0, 0); return; }
    var a = t.getAttribute('data-aksi'), id = t.getAttribute('data-id'), p = id ? pesById(id) : null, m = id ? menuById(id) : null;
    if (t.tagName === 'INPUT') return; // checkbox ditangani 'change'
    switch (a) {
      case 'mode': {
        var g = document.documentElement.getAttribute('data-mode') === 'gelap' ? 'terang' : 'gelap';
        document.documentElement.setAttribute('data-mode', g); try { localStorage.setItem('pesan-antar-kedai-mode', g); } catch (x) {}
        ikonMode(); render(); break;
      }
      case 'tab-baru': {
        var lain = UI.peran === 'pembeli' ? 'kedai' : UI.peran === 'kedai' ? 'kurir' : 'pembeli';
        window.open(location.pathname + '?peran=' + lain, '_blank'); toast('Sudut ' + lain + ' dibuka di tab baru. Perubahan tersinkron otomatis.'); break;
      }
      case 'tambah': if (m && (KERANJANG[m.id] || 0) < m.stok) { KERANJANG[m.id] = (KERANJANG[m.id] || 0) + 1; tulisLokal(K_KERANJANG, KERANJANG); render(); } break;
      case 'kurang': if (m) { KERANJANG[m.id] = (KERANJANG[m.id] || 0) - 1; if (KERANJANG[m.id] <= 0) delete KERANJANG[m.id]; tulisLokal(K_KERANJANG, KERANJANG); render(); } break;
      case 'kat': UI.kat = t.getAttribute('data-kat'); render(); break;
      case 'checkout': dlgCheckout(); break;
      case 'hapus-foto': { var fm = t.form || t.closest('form'); fm.foto.value = ''; $('#infoFoto').textContent = 'Foto dihapus saat disimpan.'; t.remove(); break; }
      case 'buka-pesanan': UI.sub.pembeli = 'pesanan'; UI.pilihPembeli = id; UI.lihatDetail = true; render(); window.scrollTo(0, 0); break;
      case 'pilih': if (UI.peran === 'kedai') UI.pilihKedai = id; else UI.pilihPembeli = id; UI.tawarBuka = false; UI.lihatDetail = true; render(); if (matchMedia('(max-width: 899px)').matches) window.scrollTo(0, 0); break;
      case 'kembali': UI.lihatDetail = false; render(); break;
      case 'setuju': if (p) setuju(p, UI.peran); break;
      case 'tawar-cepat': if (p) kirimTawar(p, UI.peran, +t.getAttribute('data-n')); break;
      case 'tawar-buka': UI.tawarBuka = id; render(); var n = $('#nomTawar'); if (n) { n.focus(); n.select(); } break;
      case 'tawar-tutup': UI.tawarBuka = false; render(); break;
      case 'balas': if (p) { p.chat.push({ dari: 'kedai', teks: t.getAttribute('data-teks'), waktu: Date.now() }); simpan({ tipe: 'chat', kode: p.kode, untuk: 'pembeli' }); } break;
      case 'terima': if (p && p.ongkir.sepakat) { setStatus(p, 'diterima'); p.chat.push({ dari: 'sistem', teks: 'Pesanan diterima kedai.', waktu: Date.now() }); simpan({ tipe: 'chat', kode: p.kode, untuk: 'pembeli' }); toast(p.kode + ' diterima.'); } break;
      case 'tolak': if (p) dlgTolak(p); break;
      case 'masak': if (p) { setStatus(p, 'dimasak'); simpan({ tipe: 'chat', kode: p.kode, untuk: 'pembeli' }); } break;
      case 'tugaskan': if (p) {
        var kid = $('#pilihKurir').value; p.kurir = kid; if (p.status !== 'siap') setStatus(p, 'siap');
        p.chat.push({ dari: 'sistem', teks: 'Kurir ' + kurirById(kid).nama + ' ditugaskan mengantar.', waktu: Date.now() });
        simpan({ tipe: 'tugas', kode: p.kode, kurir: kid }); toast('Ditugaskan ke ' + kurirById(kid).nama + '.');
      } break;
      case 'filter': UI.filterKedai = t.getAttribute('data-f'); UI.pilihKedai = null; render(); break;
      case 'stok': if (m) { m.stok = Math.max(0, m.stok + (+t.getAttribute('data-n'))); simpan(); } break;
      case 'menu-baru': dlgMenu(null); break;
      case 'menu-ubah': if (m) dlgMenu(m); break;
      case 'menu-hapus': if (m) konfirmasi('Hapus menu?', '<b>' + esc(m.nama) + '</b> akan hilang dari daftar pembeli. Riwayat pesanan tetap aman.', 'Hapus', function () { D.menu = D.menu.filter(function (x) { return x !== m; }); delete KERANJANG[m.id]; simpan(); toast('Menu dihapus.'); }); break;
      case 'periode': UI.periode = +t.getAttribute('data-n'); render(); break;
      case 'csv': csv(); toast('CSV pesanan diunduh.'); break;
      case 'setor': D.pesanan.forEach(function (x) { if (x.kurir === id && x.cod) x.setor = true; }); simpan(); toast('Setoran COD ' + kurirById(id).nama + ' ditandai lunas.'); break;
      case 'kurir-hapus': { var k = kurirById(id); if (k) konfirmasi('Hapus kurir?', 'Hapus <b>' + esc(k.nama) + '</b> dari daftar kurir? Riwayat antaran tetap tersimpan.', 'Hapus', function () { D.kurir = D.kurir.filter(function (x) { return x !== k; }); simpan(); }); break; }
      case 'reset': konfirmasi('Kembalikan data contoh?', 'Semua pesanan, menu, dan kurir di perangkat ini diganti data contoh. Unduh CSV dulu bila perlu.', 'Kembalikan', function () { D = dataContoh(); KERANJANG = {}; tulisLokal(K_KERANJANG, {}); simpan(); toast('Data contoh dipulihkan.'); }); break;
      case 'ambil': if (p) { setStatus(p, 'diantar'); p.waktuAntar = Date.now(); p.chat.push({ dari: 'sistem', teks: (kurirById(p.kurir) || {}).nama + ' mengambil pesanan dan sedang menuju lokasimu.', waktu: Date.now() }); simpan({ tipe: 'chat', kode: p.kode, untuk: 'pembeli' }); toast('Selamat jalan! Buka rute bila perlu.'); } break;
      case 'sampai': if (p) dlgSampai(p); break;
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'mFoto' && e.target.files[0]) {
      var hid = e.target.form.foto; $('#infoFoto').textContent = 'Memproses foto…';
      kecilkanFoto(e.target.files[0], function (d) { hid.value = d; $('#infoFoto').textContent = d ? 'Foto siap disimpan.' : 'Berkas bukan gambar.'; });
      return;
    }
    var t = e.target;
    if (t.matches('[data-aksi="menu-aktif"]')) { var m = menuById(t.getAttribute('data-id')); if (m) { m.aktif = t.checked; simpan(); toast(m.nama + (m.aktif ? ' tampil di menu.' : ' disembunyikan.')); } }
    if (t.id === 'sayaKurir') { UI.sayaKurir = t.value; tulisLokal(K_KURIR, t.value); render(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'cariMenu') { UI.cari = e.target.value; render(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, jenis = f.getAttribute('data-form'); if (!jenis) return;
    e.preventDefault();
    var p = pesById(f.getAttribute('data-id'));
    if (jenis === 'chat' && p) {
      var v = f.t.value.trim(); if (!v) return; f.t.value = '';
      p.chat.push({ dari: UI.peran, teks: v, waktu: Date.now() });
      simpan({ tipe: 'chat', kode: p.kode, untuk: UI.peran === 'kedai' ? 'pembeli' : 'kedai' });
      var inp = document.getElementById('chat-' + UI.peran); if (inp) { inp.value = ''; inp.focus(); }
    } else if (jenis === 'tawar' && p) {
      var n = parseInt(String(f.n.value).replace(/\D/g, ''), 10);
      if (!n || n < 1000) { f.n.setAttribute('aria-invalid', 'true'); toast('Isi nominal ongkir minimal Rp1.000.'); return; }
      kirimTawar(p, UI.peran, n);
    } else if (jenis === 'atur') {
      var k = D.kedai, ll = String(f.latlng.value).split(',').map(function (x) { return parseFloat(x); });
      k.alamat = f.alamat.value.trim(); k.wa = f.wa.value.trim(); k.buka = f.buka.value.trim(); k.tutup = f.tutup.value.trim();
      ['ongkirDasar', 'perKm', 'ongkirMin'].forEach(function (n) { var v = parseInt(String(f[n].value).replace(/\D/g, ''), 10); if (!isNaN(v)) k[n] = v; });
      if (ll.length === 2 && !isNaN(ll[0]) && !isNaN(ll[1])) { k.lat = ll[0]; k.lng = ll[1]; }
      simpan(); toast('Pengaturan kedai disimpan.');
    } else if (jenis === 'kurir') {
      if (!f.nama.value.trim() || !f.hp.value.trim()) return;
      D.kurir.push({ id: uid('k'), nama: f.nama.value.trim(), hp: f.hp.value.trim(), kendaraan: f.kendaraan.value.trim() || 'Motor' });
      simpan(); toast('Kurir ditambahkan.');
    }
  });
  function dlgTolak(p) {
    var alasan = ['Stok bahan habis', 'Di luar jangkauan antar', 'Kedai sudah tutup', 'Kurir sedang penuh'];
    bukaDialog('Tolak ' + p.kode + '?', '<fieldset class="medan"><legend>Alasan (dikirim ke pembeli)</legend><div class="pilihan kolom">' + alasan.map(function (a, i) { return '<label class="opsi"><input type="radio" name="alasan" value="' + a + '"' + (i ? '' : ' checked') + '><span>' + a + '</span></label>'; }).join('') + '</div></fieldset>',
      '<button class="tombol hantu" type="button" data-tutup>Batal</button><button class="tombol utama bahaya-isi" type="submit">Tolak pesanan</button>', function (f) {
        p.alasan = f.alasan.value; setStatus(p, 'ditolak');
        p.item.forEach(function (x) { var m = menuById(x.menu); if (m) m.stok += x.jml; });
        p.chat.push({ dari: 'sistem', teks: 'Pesanan ditolak: ' + p.alasan + '.', waktu: Date.now() });
        simpan({ tipe: 'chat', kode: p.kode, untuk: 'pembeli' }); toast(p.kode + ' ditolak, stok dikembalikan.'); return true;
      });
  }
  function gantiPeran(r) {
    UI.peran = r; UI.lihatDetail = false; sessionStorage.setItem('pak-peran', r);
    var u = new URL(location.href); u.searchParams.set('peran', r); history.replaceState(null, '', u);
    render(); window.scrollTo(0, 0);
  }
  $('.peran').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var r = ['pembeli', 'kedai', 'kurir'], i = r.indexOf(UI.peran) + (e.key === 'ArrowRight' ? 1 : -1);
    gantiPeran(r[(i + 3) % 3]); $('.peran [aria-selected="true"]').focus();
  });

  // segarkan waktu relatif tiap menit (tanpa mengganggu ketikan)
  setInterval(function () { var a = document.activeElement; if (!$('#dlg').open && !(a && /INPUT|TEXTAREA|SELECT/.test(a.tagName))) render(); }, 60000);

  ikonMode();
  pasangLogo();
  render();
})();
