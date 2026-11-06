/* Manajemen Bengkel — Maliki Studio (malikisaputra.biz.id). Tanpa server: semua data di localStorage. */
(function () {
  'use strict';
  var KUNCI = 'bengkel-data-v1';
  var VERSI = 1;
  var STATUS = [
    { id: 'menunggu', nama: 'Menunggu', warna: 'var(--tema-aksen)' },
    { id: 'dikerjakan', nama: 'Dikerjakan', warna: 'var(--utama-teks)' },
    { id: 'selesai', nama: 'Selesai', warna: '#16a34a' },
    { id: 'diambil', nama: 'Diambil', warna: '#94a3b8' }
  ];
  var MENU = [
    { id: 'dashboard', nama: 'Dashboard', ikon: 'dash', hp: 1 },
    { id: 'antrean', nama: 'Antrean', ikon: 'papan', hp: 1 },
    { id: 'wo', nama: 'Work Order', ikon: 'dok', hp: 1 },
    { id: 'stok', nama: 'Sparepart & Stok', ikon: 'kotak', hp: 1 },
    { id: 'kendaraan', nama: 'Riwayat Kendaraan', ikon: 'mobil' },
    { id: 'data', nama: 'Pelanggan & Mekanik', ikon: 'orang' },
    { id: 'laporan', nama: 'Laporan', ikon: 'grafik', hp: 1, admin: 1 },
    { id: 'pengaturan', nama: 'Pengaturan', ikon: 'gerigi', admin: 1 }
  ];

  /* ---------- Util ---------- */
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rp(n) { return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
  function ribu(n) { n = Math.round(n || 0); return n >= 1e6 ? (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'jt' : n >= 1e3 ? Math.round(n / 1e3) + 'rb' : String(n); }
  function idBaru() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function ikon(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function hariIni(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function tgl(t, jam) { var d = new Date(t); var o = { day: 'numeric', month: 'short', year: 'numeric' }; if (jam) { o.hour = '2-digit'; o.minute = '2-digit'; } return d.toLocaleString('id-ID', o); }
  function jamSaja(t) { return new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); }
  function normPlat(p) { return String(p || '').toUpperCase().replace(/\s+/g, ' ').trim(); }
  function hpKe62(h) { h = String(h || '').replace(/\D/g, ''); if (h.indexOf('0') === 0) h = '62' + h.slice(1); return h; }
  function inisial(n) { if (!n || n === 'Belum ditentukan') return '?'; return String(n || '?').split(' ').map(function (x) { return x[0]; }).join('').slice(0, 2).toUpperCase(); }
  var kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data ---------- */
  var D;
  function simpan() { D.versi = VERSI; try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Penyimpanan penuh / diblokir', 1); } }
  function muat() {
    try { D = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { D = null; }
    if (!D || !D.wo) { D = contoh(); simpan(); }
    migrasi();
  }
  function migrasi() {
    // Tempat menambah migrasi data lama: if (D.versi < 2) { ...; D.versi = 2; }
    D.pengaturan = Object.assign({ alamat: '', hp: '', catatan: '', intervalHari: 60, intervalKm: 2000, pinAdmin: '1234', pinKasir: '1111' }, D.pengaturan || {});
    D.mutasi = D.mutasi || [];
  }
  function cariPelanggan(id) { return D.pelanggan.find(function (p) { return p.id === id; }) || { nama: '-', hp: '' }; }
  function cariMekanik(id) { return D.mekanik.find(function (m) { return m.id === id; }) || { nama: 'Belum ditentukan' }; }
  function cariPart(id) { return D.part.find(function (p) { return p.id === id; }); }
  function cariKendaraan(plat) { return D.kendaraan.find(function (k) { return k.plat === normPlat(plat); }); }
  function totalJasa(w) { return w.jasa.reduce(function (s, j) { return s + (+j.harga || 0); }, 0); }
  function totalPart(w) { return w.part.reduce(function (s, p) { return s + (+p.harga || 0) * (+p.qty || 0); }, 0); }
  function totalWo(w) { return Math.max(0, totalJasa(w) + totalPart(w) - (+w.diskon || 0)); }
  function modalPart(w) { return w.part.reduce(function (s, p) { var x = cariPart(p.partId); return s + (x ? x.beli : 0) * p.qty; }, 0); }
  function noWoBaru() { var d = new Date(); var pre = 'WO' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0'); var n = D.wo.filter(function (w) { return w.no.indexOf(pre) === 0; }).length + 1; return pre + '-' + String(n).padStart(3, '0'); }

  function contoh() {
    var now = Date.now(), H = 864e5;
    var pel = [
      ['Budi Santoso', '081234567801'], ['Siti Rahmawati', '081298765402'], ['Andi Pratama', '085712340003'],
      ['Dewi Lestari', '081377788804'], ['Rizky Firmansyah', '082112345605'], ['Agus Wijaya', '087812345606'],
      ['Nur Aisyah', '081511122207'], ['Hendra Gunawan', '081399911108']
    ].map(function (x, i) { return { id: 'p' + i, nama: x[0], hp: x[1], alamat: ['Bekasi', 'Depok', 'Jakarta Timur', 'Bogor', 'Tangerang'][i % 5] }; });
    var ken = [
      ['B 1234 XYZ', 'motor', 'Honda', 'Beat', 2021, 0], ['B 4521 KJT', 'motor', 'Yamaha', 'NMAX', 2022, 1],
      ['F 3310 AB', 'motor', 'Honda', 'Vario 125', 2019, 2], ['B 1789 SIA', 'mobil', 'Toyota', 'Avanza', 2018, 3],
      ['B 6672 TRF', 'motor', 'Suzuki', 'Satria F150', 2020, 4], ['B 2290 UZD', 'mobil', 'Daihatsu', 'Xenia', 2017, 5],
      ['B 3401 NAS', 'motor', 'Honda', 'Scoopy', 2023, 6], ['B 1122 HGN', 'mobil', 'Honda', 'Brio', 2020, 7],
      ['B 5588 BSD', 'motor', 'Yamaha', 'Aerox', 2021, 0], ['B 7788 KLM', 'motor', 'Honda', 'PCX 160', 2022, 2],
      ['D 4410 RTA', 'mobil', 'Mitsubishi', 'Xpander', 2021, 7]
    ].map(function (x) { return { plat: x[0], jenis: x[1], merk: x[2], model: x[3], tahun: x[4], pelangganId: 'p' + x[5] }; });
    var mek = [['Joko', '081200000001'], ['Bayu', '081200000002'], ['Slamet', '081200000003'], ['Dimas', '081200000004']]
      .map(function (x, i) { return { id: 'm' + i, nama: x[0], hp: x[1], aktif: true }; });
    var part = [
      ['OLI-MPX2', 'Oli Federal Matic 0.8L', 'Oli', 38000, 52000, 24, 10, 'botol'],
      ['OLI-YML', 'Oli Yamalube Power Matic', 'Oli', 40000, 55000, 6, 8, 'botol'],
      ['OLI-SHL4', 'Oli Mesin Mobil 4L 10W-40', 'Oli', 210000, 285000, 9, 4, 'galon'],
      ['KMP-BT', 'Kampas Rem Depan Beat', 'Rem', 32000, 48000, 14, 6, 'set'],
      ['KMP-AVZ', 'Kampas Rem Avanza Depan', 'Rem', 145000, 195000, 3, 4, 'set'],
      ['BUSI-ND', 'Busi NGK CPR9EA', 'Kelistrikan', 18000, 28000, 30, 10, 'pcs'],
      ['VBELT-BT', 'V-Belt Honda Beat', 'CVT', 85000, 120000, 5, 3, 'pcs'],
      ['ROLLER-BT', 'Roller CVT 13gr', 'CVT', 35000, 55000, 2, 4, 'set'],
      ['FLT-UDR', 'Filter Udara Vario', 'Filter', 42000, 65000, 8, 4, 'pcs'],
      ['FLT-OLI', 'Filter Oli Avanza', 'Filter', 28000, 45000, 11, 5, 'pcs'],
      ['AKI-GTZ5', 'Aki GTZ5S Kering', 'Kelistrikan', 185000, 245000, 4, 2, 'pcs'],
      ['BAN-8090', 'Ban Luar 80/90-14', 'Ban', 165000, 215000, 7, 4, 'pcs'],
      ['MNY-REM', 'Minyak Rem DOT 3', 'Cairan', 15000, 25000, 18, 6, 'botol'],
      ['COOL-1L', 'Coolant Radiator 1L', 'Cairan', 22000, 35000, 1, 5, 'botol']
    ].map(function (x, i) { return { id: 's' + i, kode: x[0], nama: x[1], kategori: x[2], beli: x[3], jual: x[4], stok: x[5], min: x[6], satuan: x[7] }; });
    var paket = [
      { jasa: [['Servis Ringan + Ganti Oli', 45000]], part: [[0, 1]], kel: 'Servis rutin, ganti oli' },
      { jasa: [['Ganti Kampas Rem Depan', 25000]], part: [[3, 1], [12, 1]], kel: 'Rem depan bunyi & kurang pakem' },
      { jasa: [['Servis CVT', 60000]], part: [[6, 1], [7, 1]], kel: 'Tarikan berat, ada getaran saat jalan' },
      { jasa: [['Tune Up Mobil', 250000]], part: [[2, 1], [9, 1]], kel: 'Tune up + ganti oli mesin' },
      { jasa: [['Servis Besar Motor', 120000]], part: [[0, 1], [5, 1], [8, 1]], kel: 'Mesin brebet, servis besar' },
      { jasa: [['Ganti Ban Belakang', 15000]], part: [[11, 1]], kel: 'Ban belakang gundul' },
      { jasa: [['Cek Kelistrikan', 35000]], part: [[10, 1]], kel: 'Susah starter pagi hari' }
    ];
    var wo = [], nomor = 0;
    function buat(hariLalu, kIdx, pIdx, status, mIdx, jamMasuk) {
      var k = ken[kIdx], p = paket[pIdx];
      var t = hariIni(now - hariLalu * H) + (jamMasuk || 8 + (nomor % 8)) * 36e5 + (nomor * 7 % 50) * 6e4;
      nomor++;
      var w = {
        id: 'w' + nomor, no: 'WO' + new Date(t).toISOString().slice(2, 4) + new Date(t).toISOString().slice(5, 7) + '-' + String(nomor).padStart(3, '0'),
        t: t, plat: k.plat, pelangganId: k.pelangganId, km: 8000 + kIdx * 4100 + (30 - hariLalu) * 60, keluhan: p.kel,
        jasa: p.jasa.map(function (j) { return { nama: j[0], harga: k.jenis === 'mobil' && pIdx !== 3 ? j[1] * 2 : j[1] }; }),
        part: p.part.map(function (x) { var s = part[x[0]]; return { partId: s.id, nama: s.nama, qty: x[1], harga: s.jual }; }),
        mekanikId: mIdx == null ? '' : 'm' + mIdx, estimasi: k.jenis === 'mobil' ? '2 jam' : '45 menit', diskon: 0,
        status: status, tSelesai: status === 'selesai' || status === 'diambil' ? t + 75 * 6e4 : null, tAmbil: status === 'diambil' ? t + 120 * 6e4 : null,
        bayar: 'Tunai', catatan: ''
      };
      if (status === 'diambil') w.servisBerikut = { tgl: t + (k.jenis === 'mobil' ? 60 : 30) * H, km: w.km + 2000 };
      wo.push(w);
    }
    // 30 hari riwayat
    for (var d = 29; d >= 1; d--) {
      var n = 2 + (d * 7) % 4;
      for (var i = 0; i < n; i++) buat(d, (d + i * 3) % 9, (d + i) % paket.length, 'diambil', (d + i) % 4);
    }
    // Hari ini
    buat(0, 0, 0, 'diambil', 0, 8); buat(0, 3, 3, 'diambil', 2, 8); buat(0, 2, 2, 'selesai', 1, 9);
    buat(0, 4, 4, 'selesai', 3, 9); buat(0, 1, 1, 'dikerjakan', 0, 10); buat(0, 7, 6, 'dikerjakan', 2, 10);
    buat(0, 5, 3, 'menunggu', null, 11); buat(0, 6, 0, 'menunggu', null, 11); buat(0, 8, 5, 'menunggu', null, 12);
    // Pengingat jatuh tempo: B 7788 KLM lewat jadwal, D 4410 RTA jatuh tempo 3 hari lagi
    var lama = { id: 'wlama', no: 'WO-LAMA-01', t: now - 62 * H, plat: 'B 7788 KLM', pelangganId: 'p2', km: 15200, keluhan: 'Ganti oli + cek rem', jasa: [{ nama: 'Servis Ringan + Ganti Oli', harga: 45000 }], part: [{ partId: 's0', nama: part[0].nama, qty: 1, harga: 52000 }], mekanikId: 'm2', estimasi: '1 jam', diskon: 0, status: 'diambil', tSelesai: now - 62 * H, tAmbil: now - 62 * H, bayar: 'Transfer', catatan: '', servisBerikut: { tgl: now - 2 * H, km: 17200 } };
    wo.unshift(lama);
    wo.unshift({ id: 'wlama2', no: 'WO-LAMA-02', t: now - 57 * H, plat: 'D 4410 RTA', pelangganId: 'p7', km: 31800, keluhan: 'Servis berkala 30.000 km', jasa: [{ nama: 'Servis Berkala Mobil', harga: 350000 }], part: [{ partId: 's2', nama: part[2].nama, qty: 1, harga: 285000 }, { partId: 's9', nama: part[9].nama, qty: 1, harga: 45000 }], mekanikId: 'm1', estimasi: '2 jam', diskon: 0, status: 'diambil', tSelesai: now - 57 * H, tAmbil: now - 57 * H, bayar: 'QRIS', catatan: '', servisBerikut: { tgl: now + 3 * H, km: 36800 } });
    return { versi: VERSI, pelanggan: pel, kendaraan: ken, mekanik: mek, part: part, wo: wo, mutasi: [], pengaturan: { alamat: 'Jl. Raya Kalimalang No. 88, Bekasi', hp: '081234567890', catatan: 'Garansi jasa 7 hari. Terima kasih sudah servis di sini!', intervalHari: 60, intervalKm: 2000, pinAdmin: '1234', pinKasir: '1111' } };
  }

  /* Mutasi stok: selisih antara item lama & baru */
  function terapkanStok(lama, baru, w) {
    var peta = {};
    (lama || []).forEach(function (p) { peta[p.partId] = (peta[p.partId] || 0) + (+p.qty || 0); });
    (baru || []).forEach(function (p) { peta[p.partId] = (peta[p.partId] || 0) - (+p.qty || 0); });
    Object.keys(peta).forEach(function (id) {
      var d = peta[id]; var s = cariPart(id); if (!d || !s) return;
      s.stok += d;
      D.mutasi.unshift({ id: idBaru(), t: Date.now(), partId: id, qty: d, ket: (d < 0 ? 'Keluar ' : 'Kembali ') + w.no, woId: w.id });
    });
  }

  /* ---------- Tema (kontrak customizer) ---------- */
  var FONT_URL = { 'Plus Jakarta Sans': 'Plus+Jakarta+Sans', 'Inter': 'Inter', 'Poppins': 'Poppins', 'DM Sans': 'DM+Sans', 'Space Grotesk': 'Space+Grotesk', 'Nunito': 'Nunito' };
  function setMode(m, simpanPilihan) {
    if (m === 'auto') m = matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang';
    if (m !== 'gelap') m = 'terang';
    halus(); document.documentElement.dataset.mode = m; if (typeof teksAtas === 'function' && document.body) teksAtas();
    if (simpanPilihan) try { localStorage.setItem('bengkel-mode', m); } catch (e) {}
  }
  function halus() { if (kurangGerak) return; document.body.classList.add('halus'); clearTimeout(halus.t); halus.t = setTimeout(function () { document.body.classList.remove('halus'); }, 400); }
  function namaUsaha() { return (window.TEMA && TEMA.nama) || 'Bengkel'; }
  function isiNama() { $$('[data-tema-nama]').forEach(function (el) { el.textContent = namaUsaha(); }); document.title = namaUsaha() + ' · Manajemen Bengkel'; }
  function terapkan(t) {
    var s = document.documentElement.style; halus();
    if (t.utama) s.setProperty('--tema-utama', t.utama);
    if (t.aksen) s.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) s.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var nama = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      s.setProperty('--tema-font', '"' + nama + '", system-ui, sans-serif');
      if (FONT_URL[nama]) { var l = $('#fontTema'); var href = 'https://fonts.googleapis.com/css2?family=' + FONT_URL[nama] + ':wght@400;500;600;700&display=swap'; if (l.href !== href) l.href = href; }
    }
    if (t.mode) setMode(t.mode);
    if (t.nama) { window.TEMA = window.TEMA || {}; TEMA.nama = t.nama; isiNama(); }
  }
  function terangkah(hex) {
    var m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(String(hex || '').trim()); if (!m) return null;
    var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    var l = [0, 2, 4].map(function (i) { var c = parseInt(h.substr(i, 2), 16) / 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); });
    return .2126 * l[0] + .7152 * l[1] + .0722 * l[2] > .4;
  }
  function teksAtas() {
    var cs = getComputedStyle(document.documentElement), s = document.documentElement.style;
    [['--tema-nav', '--tema-nav-teks'], ['--tema-utama', '--tema-utama-teks'], ['--tema-aksen', '--tema-aksen-teks']].forEach(function (x) {
      var nilai = (s.getPropertyValue(x[0]) || cs.getPropertyValue(x[0])).trim(), t = terangkah(nilai);
      if (x[0] === '--tema-nav' && document.documentElement.dataset.mode === 'gelap' && !bagianKustom.nav) t = false;
      if (t !== null) s.setProperty(x[1], t ? '#0f172a' : '#ffffff');
    });
  }
  var bagianKustom = {};
  var PETA_BAGIAN = { latar: '--latar', panel: '--permukaan', nav: '--nav', teks: '--teks' };
  function terapkanBagian(b) {
    var s = document.documentElement.style;
    Object.keys(PETA_BAGIAN).forEach(function (k) {
      if (!(k in b)) return;
      if (b[k]) { bagianKustom[k] = b[k]; s.setProperty('--tema-' + (k === 'panel' ? 'panel' : k), b[k]); s.setProperty(PETA_BAGIAN[k], b[k]); }
      else { delete bagianKustom[k]; s.removeProperty(PETA_BAGIAN[k]); }
    });
  }
  function sorot(bagian) {
    $$('.sorot-bagian').forEach(function (el) { el.classList.remove('sorot-bagian'); });
    if (bagian) $$('[data-bagian="' + bagian + '"]').forEach(function (el) { if (el.offsetParent || el === document.body) el.classList.add('sorot-bagian'); });
  }
  var modePilih = false, hoverEl = null;
  function bagianDari(t) { var el = t && t.closest ? t.closest('[data-bagian]') : null; return el; }
  ['click', 'pointerdown', 'mousedown', 'touchstart', 'dragstart', 'submit'].forEach(function (tipe) {
    document.addEventListener(tipe, function (e) {
      if (!modePilih) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (tipe === 'click') { var el = bagianDari(e.target) || document.body; try { parent.postMessage({ tipe: 'bagian-dipilih', bagian: el.dataset.bagian || 'latar' }, '*'); } catch (x) {} }
    }, { capture: true, passive: false });
  });
  document.addEventListener('mouseover', function (e) {
    if (!modePilih) return; var el = bagianDari(e.target);
    if (hoverEl) hoverEl.classList.remove('pilih-hover'); hoverEl = el; if (el && el !== document.body) el.classList.add('pilih-hover');
  }, true);
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || typeof d !== 'object') return;
    if (d.tipe === 'tema') { terapkan(d); if (d.bagian) terapkanBagian(d.bagian); teksAtas(); }
    if (d.tipe === 'sorot') sorot(d.bagian || null);
    if (d.tipe === 'mode-pilih') { modePilih = !!d.aktif; document.documentElement.classList.toggle('mode-pilih', modePilih); if (!modePilih && hoverEl) { hoverEl.classList.remove('pilih-hover'); hoverEl = null; } }
  });

  /* ---------- Toast & modal ---------- */
  function toast(pesan, galat) {
    var el = document.createElement('div'); el.className = 'toast' + (galat ? ' galat' : '');
    el.innerHTML = ikon(galat ? 'peringatan' : 'cek') + '<span>' + esc(pesan) + '</span>';
    $('#toast').appendChild(el);
    setTimeout(function () { el.classList.add('keluar'); setTimeout(function () { el.remove(); }, 260); }, 2600);
  }
  var fokusSebelum = null;
  function bukaModal(judul, html, kecil) {
    fokusSebelum = document.activeElement;
    $('#modalJudul').textContent = judul; $('#modalIsi').innerHTML = html;
    $('.modal').classList.toggle('kecil', !!kecil);
    var m = $('#modal'); m.hidden = false; m.classList.remove('keluar');
    setTimeout(function () { var f = $('#modalIsi input, #modalIsi select, #modalIsi textarea, #modalIsi button'); (f || $('[data-tutup]')).focus(); }, 30);
    return $('#modalIsi');
  }
  function tutupModal() {
    var m = $('#modal'); if (m.hidden) return;
    m.classList.add('keluar');
    setTimeout(function () { m.hidden = true; m.classList.remove('keluar'); $('#modalIsi').innerHTML = ''; if (fokusSebelum) fokusSebelum.focus(); }, kurangGerak ? 0 : 200);
  }
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal' || e.target.closest('[data-tutup]')) tutupModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!$('#tv').hidden) tutupTv(); else tutupModal(); tutupMenu(); }
    if (e.key === 'Tab' && !$('#modal').hidden) {
      var f = $$('#modal button, #modal input, #modal select, #modal textarea, #modal a[href]').filter(function (x) { return !x.disabled && x.offsetParent; });
      if (!f.length) return; var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  function konfirmasi(pesan, ok) {
    var el = bukaModal('Konfirmasi', '<p>' + esc(pesan) + '</p><div class="aksi-bawah"><button class="tombol" data-tutup>Batal</button><button data-bagian="utama" class="tombol utama" id="yaKonf">Ya, lanjutkan</button></div>', true);
    $('#yaKonf', el).onclick = function () { tutupModal(); ok(); };
  }

  /* ---------- PIN ---------- */
  var pengguna = null, pin = '';
  function gambarPin() { $$('#pinTitik i').forEach(function (t, i) { t.classList.toggle('isi', i < pin.length); }); }
  function cobaPin() {
    var p = D.pengaturan;
    if (pin === p.pinAdmin) masuk('admin'); else if (pin === p.pinKasir) masuk('kasir');
    else { $('#pinGalat').textContent = 'PIN salah, coba lagi'; var t = $('#pinTitik'); t.classList.remove('goyang'); void t.offsetWidth; t.classList.add('goyang'); pin = ''; gambarPin(); }
  }
  function tekanPin(k) {
    $('#pinGalat').textContent = '';
    if (k === 'hapus') pin = pin.slice(0, -1); else if (k === 'ok') return cobaPin(); else if (pin.length < 4) pin += k;
    gambarPin(); if (pin.length === 4) setTimeout(cobaPin, 120);
  }
  $('#pinPad').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) tekanPin(b.dataset.aksi || b.textContent); });
  document.addEventListener('keydown', function (e) { if ($('#layarPin').hidden) return; if (/^\d$/.test(e.key)) tekanPin(e.key); else if (e.key === 'Backspace') tekanPin('hapus'); else if (e.key === 'Enter') tekanPin('ok'); });
  function masuk(peran) {
    pengguna = peran; pin = ''; gambarPin();
    try { sessionStorage.setItem('bengkel-sesi', peran); } catch (e) {}
    $('#layarPin').hidden = true; $('#aplikasi').hidden = false;
    $('#infoPengguna').textContent = peran === 'admin' ? 'Admin' : 'Kasir';
    bangunNav(); buka(location.hash.slice(1) || 'dashboard');
  }
  function keluar() { pengguna = null; try { sessionStorage.removeItem('bengkel-sesi'); } catch (e) {} $('#aplikasi').hidden = true; $('#layarPin').hidden = false; }

  /* ---------- Navigasi ---------- */
  var halaman = 'dashboard';
  function bolehMenu(m) { return !m.admin || pengguna === 'admin'; }
  function bangunNav() {
    var stokMenipis = D.part.filter(function (p) { return p.stok <= p.min; }).length;
    var aktif = D.wo.filter(function (w) { return w.status === 'menunggu' || w.status === 'dikerjakan'; }).length;
    $('#nav').innerHTML = MENU.filter(bolehMenu).map(function (m) {
      var b = m.id === 'stok' && stokMenipis ? '<span class="lencana merah" aria-label="' + stokMenipis + ' stok menipis">' + stokMenipis + '</span>' : m.id === 'antrean' && aktif ? '<span class="lencana dikerjakan">' + aktif + '</span>' : '';
      return '<a href="#' + m.id + '" data-hal="' + m.id + '">' + ikon(m.ikon) + '<span>' + m.nama + '</span>' + b + '</a>';
    }).join('');
    $('#tabBawah').innerHTML = MENU.filter(function (m) { return m.hp && bolehMenu(m); }).concat(pengguna === 'admin' ? [] : [MENU[4]]).map(function (m) {
      return '<a href="#' + m.id + '" data-hal="' + m.id + '">' + ikon(m.ikon) + '<span>' + m.nama.split(' ')[0] + '</span></a>';
    }).join('');
    tandaiNav();
  }
  function tandaiNav() { $$('[data-hal]').forEach(function (a) { if (a.dataset.hal === halaman) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function buka(id, arg) {
    var m = MENU.find(function (x) { return x.id === id; });
    if (!m || !bolehMenu(m)) { id = 'dashboard'; m = MENU[0]; }
    halaman = id; $('#judulHalaman').textContent = m.nama; tandaiNav(); tutupMenu();
    var isi = $('#isi'); isi.classList.remove('masuk'); void isi.offsetWidth;
    RENDER[id](isi, arg); isi.classList.add('masuk');
    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
  }
  function segarkan() { bangunNav(); var y = scrollY; RENDER[halaman]($('#isi')); scrollTo(0, y); siarTv(); }
  window.addEventListener('hashchange', function () { if (pengguna) buka(location.hash.slice(1)); });
  function bukaMenu() { $('#samping').classList.add('buka'); $('#tirai').hidden = false; $('#btnMenu').setAttribute('aria-expanded', 'true'); }
  function tutupMenu() { $('#samping').classList.remove('buka'); $('#tirai').hidden = true; $('#btnMenu').setAttribute('aria-expanded', 'false'); }

  /* ---------- Halaman ---------- */
  var RENDER = {};

  function pendapatanRentang(a, b) {
    var j = 0, p = 0, n = 0, laba = 0;
    D.wo.forEach(function (w) { if (w.status === 'diambil' && w.tAmbil >= a && w.tAmbil < b) { var dj = totalJasa(w) - (+w.diskon || 0); j += dj; p += totalPart(w); laba += dj + totalPart(w) - modalPart(w); n++; } });
    return { jasa: j, part: p, total: j + p, n: n, laba: laba };
  }
  function pengingat() {
    var now = Date.now(), terakhir = {};
    D.wo.forEach(function (w) { if (w.servisBerikut && (!terakhir[w.plat] || w.t > terakhir[w.plat].t)) terakhir[w.plat] = w; });
    return Object.keys(terakhir).map(function (k) { return terakhir[k]; })
      .filter(function (w) { return w.servisBerikut.tgl - now < 7 * 864e5; })
      .sort(function (a, b) { return a.servisBerikut.tgl - b.servisBerikut.tgl; });
  }

  RENDER.dashboard = function (el) {
    var h0 = hariIni(Date.now()), r = pendapatanRentang(h0, h0 + 864e5);
    var menunggu = D.wo.filter(function (w) { return w.status === 'menunggu'; }), dikerjakan = D.wo.filter(function (w) { return w.status === 'dikerjakan'; });
    var selesaiHari = D.wo.filter(function (w) { return w.tSelesai && w.tSelesai >= h0; }).length;
    var menipis = D.part.filter(function (p) { return p.stok <= p.min; });
    var hari = [], mx = 1;
    for (var i = 6; i >= 0; i--) { var a = h0 - i * 864e5, x = pendapatanRentang(a, a + 864e5); x.lbl = new Date(a).toLocaleDateString('id-ID', { weekday: 'short' }); hari.push(x); mx = Math.max(mx, x.total); }
    var ing = pengingat();
    el.innerHTML =
      '<div class="grid grid-4">' +
      stat('jam', 'aksen', menunggu.length + dikerjakan.length, 'Antrean aktif', menunggu.length + ' menunggu · ' + dikerjakan.length + ' dikerjakan') +
      stat('uang', '', rp(r.total), 'Pendapatan hari ini', r.n + ' nota dibayar') +
      stat('cek', 'hijau', selesaiHari, 'Servis selesai hari ini', 'Siap/sudah diambil') +
      stat('peringatan', menipis.length ? 'merah' : 'hijau', menipis.length, 'Stok menipis', menipis.length ? 'Segera belanja' : 'Semua aman') +
      '</div>' +
      '<div class="grid grid-3-1" style="margin-top:16px">' +
      '<section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Pendapatan 7 hari</h3><div class="legenda"><span><i style="background:var(--grafik-1)"></i>Jasa</span><span><i style="background:var(--tema-aksen)"></i>Sparepart</span></div></div>' +
      '<div class="batang" data-bagian="aksen" role="img" aria-label="Grafik pendapatan 7 hari terakhir">' + hari.map(function (x, i) {
        return '<div class="bt" title="' + x.lbl + ': ' + rp(x.total) + '"><small class="angka">' + ribu(x.total) + '</small><div class="tumpuk-bt" style="height:' + Math.max(2, x.total / mx * 100) + '%;animation-delay:' + i * .05 + 's"><span class="jasa" style="flex:' + x.jasa + '"></span><span class="part" style="flex:' + x.part + '"></span></div><small>' + x.lbl + '</small></div>';
      }).join('') + '</div></section>' +
      '<section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Sedang dikerjakan</h3><a href="#antrean" class="kecil">Lihat papan</a></div>' +
      (dikerjakan.length ? '<ul class="daftar muncul">' + dikerjakan.map(function (w) { var m = cariMekanik(w.mekanikId); return '<li><span class="avatar">' + inisial(m.nama) + '</span><div class="tumbuh"><b>' + esc(kendaraanLabel(w.plat)) + '</b><span class="kecil redup">' + esc(m.nama) + ' · est. ' + esc(w.estimasi) + '</span></div><span class="plat">' + esc(w.plat) + '</span></li>'; }).join('') + '</ul>' : kosong('papan', 'Belum ada yang dikerjakan')) +
      '</section></div>' +
      '<div class="grid grid-2 tetap-1" style="margin-top:16px">' +
      '<section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Stok perlu dibeli</h3><a href="#stok" class="kecil">Kelola stok</a></div>' +
      (menipis.length ? '<ul class="daftar muncul">' + menipis.map(function (p) { return '<li><span class="statistik"><span class="ikon merah">' + ikon('kotak') + '</span></span><div class="tumbuh"><b>' + esc(p.nama) + '</b><span class="kecil redup">' + esc(p.kode) + ' · min. ' + p.min + ' ' + esc(p.satuan) + '</span></div><span class="lencana merah">sisa ' + p.stok + '</span></li>'; }).join('') + '</ul>' : kosong('cek', 'Stok aman semua')) +
      '</section>' +
      '<section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Pengingat servis berikutnya</h3><span class="lencana">' + ing.length + '</span></div>' +
      (ing.length ? '<ul class="daftar muncul">' + ing.map(function (w) { var lewat = w.servisBerikut.tgl < Date.now(); return '<li><span class="statistik"><span class="ikon aksen">' + ikon('lonceng') + '</span></span><div class="tumbuh"><b>' + esc(cariPelanggan(w.pelangganId).nama) + ' · ' + esc(w.plat) + '</b><span class="kecil ' + (lewat ? '' : 'redup') + '">' + (lewat ? 'Lewat jadwal ' : 'Jadwal ') + tgl(w.servisBerikut.tgl) + ' / ' + w.servisBerikut.km.toLocaleString('id-ID') + ' km</span></div><button class="tombol wa kecil" data-ingat="' + esc(w.id) + '">' + ikon('wa') + 'Ingatkan</button></li>'; }).join('') + '</ul>' : kosong('lonceng', 'Belum ada yang jatuh tempo')) +
      '</section></div>';
    $$('[data-ingat]', el).forEach(function (b) { b.onclick = function () { kirimPengingat(D.wo.find(function (w) { return w.id === b.dataset.ingat; })); }; });
  };
  function stat(ik, warna, nilai, label, sub) { return '<section data-bagian="panel" class="kartu statistik"><span class="ikon ' + warna + '">' + ikon(ik) + '</span><span class="nilai">' + nilai + '</span><span class="label">' + label + '</span><span class="kecil redup">' + sub + '</span></section>'; }
  function kosong(ik, t) { return '<div class="kosong">' + ikon(ik) + '<p>' + t + '</p></div>'; }
  function kendaraanLabel(plat) { var k = cariKendaraan(plat); return k ? k.merk + ' ' + k.model : plat; }

  /* Antrean kanban */
  RENDER.antrean = function (el) {
    var h0 = hariIni(Date.now());
    el.innerHTML = '<div class="alat"><p class="redup kecil" style="flex:1">Seret kartu antar kolom, atau pakai tombol panah di kartu. Kolom <b>Diambil</b> hanya menampilkan hari ini.</p><button class="tombol" id="tvBuka">' + ikon('tv') + 'Mode TV</button></div>' +
      '<div class="kanban">' + STATUS.map(function (s) {
        var items = D.wo.filter(function (w) { return w.status === s.id && (s.id !== 'diambil' || w.tAmbil >= h0); }).sort(function (a, b) { return a.t - b.t; });
        return '<section class="kolom" data-status="' + s.id + '" aria-label="' + s.nama + '"><header class="kolom-kepala"><span class="titik" style="background:' + s.warna + '"></span>' + s.nama + '<span class="lencana">' + items.length + '</span></header><div class="kolom-isi">' +
          (items.length ? items.map(tiket).join('') : '<p class="kosong kecil">Kosong</p>') + '</div></section>';
      }).join('') + '</div>';
    $('#tvBuka', el).onclick = bukaTv;
    $$('.tiket', el).forEach(function (t) {
      t.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', t.dataset.id); e.dataTransfer.effectAllowed = 'move'; t.classList.add('diseret'); });
      t.addEventListener('dragend', function () { t.classList.remove('diseret'); });
      t.addEventListener('click', function (e) {
        var b = e.target.closest('button'); var w = D.wo.find(function (x) { return x.id === t.dataset.id; });
        if (!b) return formWo(w);
        if (b.dataset.geser) pindahStatus(w, +b.dataset.geser);
        if (b.dataset.nota) bukaNota(w);
      });
      t.addEventListener('keydown', function (e) { if (e.target === t && e.key === 'Enter') formWo(D.wo.find(function (x) { return x.id === t.dataset.id; })); });
    });
    $$('.kolom', el).forEach(function (k) {
      k.addEventListener('dragover', function (e) { e.preventDefault(); k.classList.add('seret-atas'); });
      k.addEventListener('dragleave', function (e) { if (!k.contains(e.relatedTarget)) k.classList.remove('seret-atas'); });
      k.addEventListener('drop', function (e) {
        e.preventDefault(); k.classList.remove('seret-atas');
        var w = D.wo.find(function (x) { return x.id === e.dataTransfer.getData('text/plain'); });
        if (w) setStatus(w, k.dataset.status);
      });
    });
  };
  function tiket(w) {
    var i = STATUS.findIndex(function (s) { return s.id === w.status; }), m = cariMekanik(w.mekanikId);
    return '<article class="tiket" draggable="true" tabindex="0" data-id="' + w.id + '" aria-label="' + esc(w.plat + ', ' + kendaraanLabel(w.plat) + ', status ' + STATUS[i].nama) + '">' +
      '<div class="tiket-atas"><span class="plat">' + esc(w.plat) + '</span><span class="kecil redup angka">' + jamSaja(w.t) + '</span></div>' +
      '<h4>' + esc(kendaraanLabel(w.plat)) + ' · ' + esc(cariPelanggan(w.pelangganId).nama) + '</h4><p>' + esc(w.keluhan) + '</p>' +
      '<div class="tiket-bawah"><span class="isi-kiri"><span class="avatar" aria-hidden="true">' + inisial(m.nama) + '</span><span>' + esc(m.nama) + '</span></span>' +
      (w.status === 'selesai' || w.status === 'diambil' ? '<button class="ikon-btn kecil" data-nota="1" aria-label="Nota ' + esc(w.no) + '">' + ikon('cetak') + '</button>' : '') +
      (i > 0 ? '<button class="ikon-btn kecil" data-geser="-1" aria-label="Pindah ke ' + STATUS[i - 1].nama + '">' + ikon('kiri') + '</button>' : '') +
      (i < 3 ? '<button class="ikon-btn kecil" data-geser="1" aria-label="Pindah ke ' + STATUS[i + 1].nama + '">' + ikon('kanan') + '</button>' : '') +
      '</div></article>';
  }
  function pindahStatus(w, arah) { var i = STATUS.findIndex(function (s) { return s.id === w.status; }) + arah; if (STATUS[i]) setStatus(w, STATUS[i].id); }
  function setStatus(w, s) {
    if (w.status === s) return;
    if (s === 'dikerjakan' && !w.mekanikId) { var m = D.mekanik.filter(function (x) { return x.aktif; })[0]; if (m) w.mekanikId = m.id; }
    w.status = s;
    if (s === 'selesai' || s === 'diambil') w.tSelesai = w.tSelesai || Date.now(); else w.tSelesai = null;
    if (s === 'diambil') { w.tAmbil = Date.now(); w.servisBerikut = w.servisBerikut || { tgl: Date.now() + D.pengaturan.intervalHari * 864e5, km: (+w.km || 0) + (+D.pengaturan.intervalKm) }; } else w.tAmbil = null;
    simpan(); segarkan();
    var t = $('.tiket[data-id="' + w.id + '"]'); if (t) { t.classList.add('baru-pindah'); t.focus({ preventScroll: true }); }
    toast(w.plat + ' → ' + STATUS.find(function (x) { return x.id === s; }).nama);
    if (s === 'selesai') setTimeout(function () { toast('Kirim kabar ke pelanggan lewat tombol nota'); }, 600);
  }

  /* TV mode */
  var tvJamT = null, saluran = null;
  try { saluran = new BroadcastChannel('bengkel-tv'); saluran.onmessage = function () { muat(); if (!$('#tv').hidden) gambarTv(); }; } catch (e) {}
  function siarTv() { if (saluran) try { saluran.postMessage(1); } catch (e) {} if (!$('#tv').hidden) gambarTv(); }
  window.addEventListener('storage', function (e) { if (e.key === KUNCI) { muat(); if (!$('#tv').hidden) gambarTv(); else if (pengguna) segarkan(); } });
  function gambarTv() {
    var h0 = hariIni(Date.now());
    $('#tvKolom').innerHTML = STATUS.slice(0, 3).map(function (s) {
      var items = D.wo.filter(function (w) { return w.status === s.id; }).sort(function (a, b) { return a.t - b.t; });
      var judul = s.id === 'selesai' ? 'Siap Diambil' : s.nama;
      return '<section class="tv-k" style="--w:' + s.warna + '"><h3>' + judul + '<span>' + items.length + '</span></h3>' + items.slice(0, 6).map(function (w, i) {
        return '<div class="tv-item" style="animation-delay:' + i * .06 + 's"><span class="plat">' + esc(w.plat) + '</span><div><b>' + esc(kendaraanLabel(w.plat)) + '</b><small>' + (s.id === 'dikerjakan' ? 'Mekanik ' + esc(cariMekanik(w.mekanikId).nama) + ' · est. ' + esc(w.estimasi) : s.id === 'selesai' ? 'Silakan ke kasir' : 'Masuk ' + jamSaja(w.t)) + '</small></div></div>';
      }).join('') + '</section>';
    }).join('');
    var n = D.wo.filter(function (w) { return w.tSelesai >= h0; }).length;
    $('#tvKaki').innerHTML = '<span>' + esc(namaUsaha()) + ' · ' + esc(D.pengaturan.alamat) + ' · ' + n + ' kendaraan selesai diservis hari ini · Terima kasih sudah menunggu, mekanik kami bekerja secepat dan seteliti mungkin.</span>';
  }
  function bukaTv() {
    $('#tv').hidden = false; gambarTv();
    var j = function () { $('#tvJam').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); };
    j(); clearInterval(tvJamT); tvJamT = setInterval(function () { j(); }, 15000);
    if (document.documentElement.requestFullscreen && !/[?&]demo/.test(location.search)) document.documentElement.requestFullscreen().catch(function () {});
    $('#tvTutup').focus();
  }
  function tutupTv() { $('#tv').hidden = true; clearInterval(tvJamT); if (document.fullscreenElement) document.exitFullscreen().catch(function () {}); }

  /* Work order */
  var filterWo = 'aktif';
  RENDER.wo = function (el) {
    el.innerHTML = '<div class="alat"><label class="cari">' + ikon('cari') + '<span class="sr">Cari work order</span><input type="search" id="cariWo" placeholder="Cari plat, nama, no. WO…"></label>' +
      '<div class="segmen" role="group" aria-label="Saring status">' + [['aktif', 'Aktif'], ['semua', 'Semua']].concat(STATUS.map(function (s) { return [s.id, s.nama]; })).map(function (x) { return '<button type="button" data-f="' + x[0] + '" aria-pressed="' + (filterWo === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<button class="tombol" id="csvWo">' + ikon('unduh') + 'CSV</button></div><section data-bagian="panel" class="kartu"><div class="tabel-wadah"><table><thead><tr><th>No. WO</th><th>Kendaraan</th><th class="sembunyi-hp">Pelanggan</th><th class="sembunyi-hp">Mekanik</th><th>Status</th><th class="kanan">Total</th></tr></thead><tbody id="tbWo"></tbody></table></div></section>';
    function isi() {
      var q = $('#cariWo').value.toLowerCase();
      var rows = D.wo.filter(function (w) {
        if (filterWo === 'aktif' && w.status === 'diambil') return false;
        if (filterWo !== 'aktif' && filterWo !== 'semua' && w.status !== filterWo) return false;
        return !q || (w.no + ' ' + w.plat + ' ' + cariPelanggan(w.pelangganId).nama + ' ' + kendaraanLabel(w.plat)).toLowerCase().indexOf(q) > -1;
      }).sort(function (a, b) { return b.t - a.t; }).slice(0, 150);
      $('#tbWo').className = 'muncul';
      $('#tbWo').innerHTML = rows.length ? rows.map(function (w) {
        return '<tr data-id="' + w.id + '" style="cursor:pointer" tabindex="0"><td><b class="angka">' + esc(w.no) + '</b><div class="kecil redup">' + tgl(w.t, 1) + '</div></td><td><span class="plat">' + esc(w.plat) + '</span><div class="kecil redup">' + esc(kendaraanLabel(w.plat)) + '</div></td><td class="sembunyi-hp">' + esc(cariPelanggan(w.pelangganId).nama) + '</td><td class="sembunyi-hp">' + esc(cariMekanik(w.mekanikId).nama) + '</td><td><span class="lencana ' + w.status + '">' + STATUS.find(function (s) { return s.id === w.status; }).nama + '</span></td><td class="kanan angka"><b>' + rp(totalWo(w)) + '</b></td></tr>';
      }).join('') : '<tr><td colspan="6">' + kosong('dok', 'Tidak ada work order') + '</td></tr>';
    }
    isi();
    $('#cariWo').oninput = isi;
    $$('.segmen button', el).forEach(function (b) { b.onclick = function () { filterWo = b.dataset.f; $$('.segmen button', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); isi(); }; });
    $('#tbWo').addEventListener('click', function (e) { var tr = e.target.closest('tr[data-id]'); if (tr) formWo(D.wo.find(function (w) { return w.id === tr.dataset.id; })); });
    $('#tbWo').addEventListener('keydown', function (e) { var tr = e.target.closest('tr[data-id]'); if (tr && e.key === 'Enter') tr.click(); });
    $('#csvWo').onclick = eksporWo;
  };

  function formWo(w, platAwal) {
    var baru = !w;
    var data = w ? JSON.parse(JSON.stringify(w)) : { id: idBaru(), no: noWoBaru(), t: Date.now(), plat: platAwal || '', pelangganId: '', km: '', keluhan: '', jasa: [{ nama: '', harga: '' }], part: [], mekanikId: '', estimasi: '1 jam', diskon: 0, status: 'menunggu', bayar: 'Tunai', catatan: '' };
    var k = cariKendaraan(data.plat) || {}, pel = data.pelangganId ? cariPelanggan(data.pelangganId) : {};
    var el = bukaModal((baru ? 'Work order baru · ' : 'Work order ') + data.no,
      '<form id="fWo" novalidate><div class="form-grid">' +
      '<label class="isian"><span>Plat nomor *</span><input name="plat" required list="dlPlat" value="' + esc(data.plat) + '" placeholder="B 1234 XYZ" autocomplete="off" style="text-transform:uppercase"></label>' +
      '<label class="isian"><span>Kilometer</span><input name="km" type="number" inputmode="numeric" min="0" value="' + esc(data.km) + '" placeholder="12500"></label>' +
      '<p class="saran penuh" id="infoPlat" aria-live="polite"></p>' +
      '<label class="isian"><span>Jenis</span><select name="jenis"><option value="motor">Motor</option><option value="mobil"' + (k.jenis === 'mobil' ? ' selected' : '') + '>Mobil</option></select></label>' +
      '<label class="isian"><span>Merk & model</span><input name="merk" value="' + esc(k.merk ? k.merk + ' ' + k.model : '') + '" placeholder="Honda Beat"></label>' +
      '<label class="isian"><span>Nama pelanggan *</span><input name="nama" required value="' + esc(pel.nama || '') + '" placeholder="Budi Santoso"></label>' +
      '<label class="isian"><span>No. WhatsApp</span><input name="hp" type="tel" inputmode="tel" value="' + esc(pel.hp || '') + '" placeholder="0812…"></label>' +
      '<label class="isian penuh"><span>Keluhan / permintaan</span><textarea name="keluhan" placeholder="Rem bunyi, ganti oli…">' + esc(data.keluhan) + '</textarea></label>' +
      '<label class="isian"><span>Mekanik</span><select name="mekanikId"><option value="">— Belum ditentukan —</option>' + D.mekanik.filter(function (m) { return m.aktif || m.id === data.mekanikId; }).map(function (m) { return '<option value="' + m.id + '"' + (m.id === data.mekanikId ? ' selected' : '') + '>' + esc(m.nama) + '</option>'; }).join('') + '</select></label>' +
      '<label class="isian"><span>Estimasi selesai</span><input name="estimasi" value="' + esc(data.estimasi) + '" placeholder="1 jam"></label>' +
      '</div>' +
      '<div class="bagian" style="margin-top:14px"><h4>Jasa <button type="button" class="tombol kecil" id="tJasa">' + ikon('plus') + 'Jasa</button></h4><div id="dJasa"></div></div>' +
      '<div class="bagian"><h4>Sparepart <button type="button" class="tombol kecil" id="tPart">' + ikon('plus') + 'Sparepart</button></h4><div id="dPart"></div><p class="saran">Stok berkurang otomatis saat work order disimpan, dan kembali bila item dihapus.</p></div>' +
      '<div class="bagian form-grid"><label class="isian"><span>Diskon (Rp)</span><input name="diskon" type="number" min="0" value="' + esc(data.diskon || 0) + '"></label>' +
      '<label class="isian"><span>Pembayaran</span><select name="bayar">' + ['Tunai', 'QRIS', 'Transfer', 'Debit'].map(function (b) { return '<option' + (b === data.bayar ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select></label>' +
      '<div class="ringkasan penuh" id="ringWo"></div></div>' +
      '<datalist id="dlPlat">' + D.kendaraan.map(function (k) { return '<option value="' + esc(k.plat) + '">' + esc(k.merk + ' ' + k.model) + '</option>'; }).join('') + '</datalist>' +
      '<datalist id="dlJasa">' + ['Servis Ringan + Ganti Oli', 'Servis Besar Motor', 'Servis CVT', 'Ganti Kampas Rem Depan', 'Tune Up Mobil', 'Spooring & Balancing', 'Cek Kelistrikan', 'Ganti Ban'].map(function (j) { return '<option value="' + j + '">'; }).join('') + '</datalist>' +
      '<div class="aksi-bawah">' + (baru ? '' : '<button type="button" class="tombol bahaya" id="hapusWo">' + ikon('sampah') + 'Hapus</button><button type="button" class="tombol" id="notaWo">' + ikon('cetak') + 'Nota</button>') +
      '<button type="button" class="tombol" data-tutup>Batal</button><button type="submit" data-bagian="utama" class="tombol utama">' + ikon('cek') + 'Simpan</button></div></form>');
    var f = $('#fWo', el);
    function gambarItem() {
      $('#dJasa').innerHTML = data.jasa.map(function (j, i) { return '<div class="baris-item jasa"><input aria-label="Nama jasa ' + (i + 1) + '" list="dlJasa" data-j="nama" data-i="' + i + '" value="' + esc(j.nama) + '" placeholder="Nama jasa"><input aria-label="Harga jasa ' + (i + 1) + '" type="number" min="0" data-j="harga" data-i="' + i + '" value="' + esc(j.harga) + '" placeholder="Harga"><button type="button" class="ikon-btn kecil" data-hj="' + i + '" aria-label="Hapus jasa">' + ikon('x') + '</button></div>'; }).join('') || '<p class="saran">Belum ada jasa.</p>';
      $('#dPart').innerHTML = data.part.map(function (p, i) { var s = cariPart(p.partId); return '<div class="baris-item"><select aria-label="Sparepart ' + (i + 1) + '" data-p="partId" data-i="' + i + '">' + D.part.map(function (x) { return '<option value="' + x.id + '"' + (x.id === p.partId ? ' selected' : '') + '>' + esc(x.nama) + ' (stok ' + x.stok + ')</option>'; }).join('') + '</select><input aria-label="Jumlah" type="number" min="1" data-p="qty" data-i="' + i + '" value="' + p.qty + '"><input aria-label="Harga satuan" type="number" min="0" data-p="harga" data-i="' + i + '" value="' + p.harga + '"><button type="button" class="ikon-btn kecil" data-hp="' + i + '" aria-label="Hapus sparepart">' + ikon('x') + '</button></div>' + (s && s.stok < p.qty && !(w && w.part.some(function (o) { return o.partId === p.partId; })) ? '<p class="saran" style="color:var(--merah-teks)">Stok ' + esc(s.nama) + ' kurang (sisa ' + s.stok + ')</p>' : ''); }).join('') || '<p class="saran">Belum ada sparepart.</p>';
      ringkas();
    }
    function ringkas() {
      data.diskon = +f.diskon.value || 0;
      $('#ringWo').innerHTML = '<div><span>Jasa</span><span>' + rp(totalJasa(data)) + '</span></div><div><span>Sparepart</span><span>' + rp(totalPart(data)) + '</span></div>' + (data.diskon ? '<div><span>Diskon</span><span>−' + rp(data.diskon) + '</span></div>' : '') + '<div class="total"><span>Total</span><span>' + rp(totalWo(data)) + '</span></div>';
    }
    function cekPlat() {
      var p = normPlat(f.plat.value), kk = cariKendaraan(p), info = $('#infoPlat');
      if (kk) {
        var pp = cariPelanggan(kk.pelangganId), n = D.wo.filter(function (x) { return x.plat === p && x.id !== data.id; }).length;
        info.className = 'saran info penuh'; info.textContent = 'Kendaraan terdaftar: ' + kk.merk + ' ' + kk.model + ' milik ' + pp.nama + ' · ' + n + ' servis sebelumnya';
        if (!f.nama.value) f.nama.value = pp.nama; if (!f.hp.value) f.hp.value = pp.hp; if (!f.merk.value) f.merk.value = kk.merk + ' ' + kk.model; f.jenis.value = kk.jenis;
      } else { info.className = 'saran penuh'; info.textContent = p ? 'Plat baru — kendaraan & pelanggan akan dibuat otomatis.' : ''; }
    }
    gambarItem(); cekPlat();
    f.plat.addEventListener('change', cekPlat); f.diskon.addEventListener('input', ringkas);
    $('#tJasa').onclick = function () { data.jasa.push({ nama: '', harga: '' }); gambarItem(); $$('#dJasa input[data-j="nama"]').pop().focus(); };
    $('#tPart').onclick = function () { var s = D.part[0]; data.part.push({ partId: s.id, nama: s.nama, qty: 1, harga: s.jual }); gambarItem(); $$('#dPart select').pop().focus(); };
    f.addEventListener('input', function (e) {
      var t = e.target, i = +t.dataset.i;
      if (t.dataset.j) { data.jasa[i][t.dataset.j] = t.dataset.j === 'harga' ? +t.value : t.value; ringkas(); }
      if (t.dataset.p && t.dataset.p !== 'partId') { data.part[i][t.dataset.p] = Math.max(0, +t.value); ringkas(); }
    });
    f.addEventListener('change', function (e) { var t = e.target; if (t.dataset.p === 'partId') { var s = cariPart(t.value); data.part[+t.dataset.i] = { partId: s.id, nama: s.nama, qty: data.part[+t.dataset.i].qty, harga: s.jual }; gambarItem(); } });
    f.addEventListener('click', function (e) {
      var b = e.target.closest('[data-hj],[data-hp]'); if (!b) return;
      if (b.dataset.hj != null) data.jasa.splice(+b.dataset.hj, 1); else data.part.splice(+b.dataset.hp, 1);
      gambarItem();
    });
    if (!baru) {
      $('#hapusWo').onclick = function () { konfirmasi('Hapus ' + data.no + '? Stok sparepart dikembalikan.', function () { terapkanStok(w.part, [], w); D.wo = D.wo.filter(function (x) { return x.id !== w.id; }); simpan(); segarkan(); toast('Work order dihapus'); }); };
      $('#notaWo').onclick = function () { tutupModal(); setTimeout(function () { bukaNota(w); }, 220); };
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var plat = normPlat(f.plat.value), nama = f.nama.value.trim();
      if (!plat || !nama) { (plat ? f.nama : f.plat).focus(); toast('Plat nomor & nama pelanggan wajib diisi', 1); (plat ? f.nama : f.plat).setAttribute('aria-invalid', 'true'); return; }
      var hp = f.hp.value.trim();
      var pp = D.pelanggan.find(function (p) { return (hp && p.hp === hp) || p.nama.toLowerCase() === nama.toLowerCase(); });
      if (!pp) { pp = { id: idBaru(), nama: nama, hp: hp, alamat: '' }; D.pelanggan.push(pp); } else { pp.nama = nama; if (hp) pp.hp = hp; }
      var kk = cariKendaraan(plat), mm = f.merk.value.trim().split(' ');
      if (!kk) { kk = { plat: plat, jenis: f.jenis.value, merk: mm[0] || '-', model: mm.slice(1).join(' '), tahun: '', pelangganId: pp.id }; D.kendaraan.push(kk); }
      else { kk.jenis = f.jenis.value; if (mm[0]) { kk.merk = mm[0]; kk.model = mm.slice(1).join(' '); } kk.pelangganId = pp.id; }
      data.plat = plat; data.pelangganId = pp.id; data.km = +f.km.value || ''; data.keluhan = f.keluhan.value.trim(); data.mekanikId = f.mekanikId.value; data.estimasi = f.estimasi.value.trim(); data.bayar = f.bayar.value;
      data.jasa = data.jasa.filter(function (j) { return j.nama || j.harga; }); data.part = data.part.filter(function (p) { return p.qty > 0; });
      terapkanStok(w ? w.part : [], data.part, data);
      if (baru) D.wo.push(data); else D.wo[D.wo.findIndex(function (x) { return x.id === w.id; })] = data;
      simpan(); tutupModal(); segarkan(); toast(baru ? 'Work order ' + data.no + ' masuk antrean' : 'Perubahan disimpan');
      var rendah = data.part.map(function (p) { return cariPart(p.partId); }).filter(function (s) { return s && s.stok <= s.min; });
      if (rendah.length) setTimeout(function () { toast('Stok menipis: ' + rendah.map(function (s) { return s.nama; }).join(', '), 1); }, 700);
    });
  }

  /* Nota */
  function htmlNota(w, ukuran) {
    var p = cariPelanggan(w.pelangganId), set = D.pengaturan, k = cariKendaraan(w.plat) || {};
    if (ukuran === 't58') {
      var br = function (a, b) { return '<div class="br"><span>' + a + '</span><span>' + b + '</span></div>'; };
      return '<div class="nota t58"><div class="tengah"><b>' + esc(namaUsaha()) + '</b><br>' + esc(set.alamat) + '<br>' + esc(set.hp) + '</div><hr>' +
        br(esc(w.no), tgl(w.t)) + br('Plat', esc(w.plat)) + br('Kend.', esc(k.merk + ' ' + (k.model || ''))) + br('KM', (w.km || '-').toLocaleString('id-ID')) + br('Plgn', esc(p.nama)) + br('Mekanik', esc(cariMekanik(w.mekanikId).nama)) + '<hr>' +
        w.jasa.map(function (j) { return '<div>' + esc(j.nama) + '</div>' + br('', rp(j.harga)); }).join('') +
        w.part.map(function (x) { return '<div>' + esc(x.nama) + '</div>' + br(x.qty + ' x ' + rp(x.harga), rp(x.qty * x.harga)); }).join('') + '<hr>' +
        (w.diskon ? br('Diskon', '-' + rp(w.diskon)) : '') + br('<b>TOTAL</b>', '<b>' + rp(totalWo(w)) + '</b>') + br('Bayar', esc(w.bayar)) + '<hr>' +
        (w.servisBerikut ? '<div class="tengah">Servis berikutnya:<br>' + tgl(w.servisBerikut.tgl) + ' / ' + w.servisBerikut.km.toLocaleString('id-ID') + ' km</div><hr>' : '') +
        '<div class="tengah">' + esc(set.catatan) + '</div></div>';
    }
    return '<div class="nota a5"><div class="kop"><div><h1>' + esc(namaUsaha()) + '</h1><div>' + esc(set.alamat) + '</div><div>WA ' + esc(set.hp) + '</div></div><div style="text-align:right"><b>NOTA SERVIS</b><div>' + esc(w.no) + '</div><div>' + tgl(w.t, 1) + '</div></div></div>' +
      '<table style="width:100%;margin-bottom:8px"><tr><td>Pelanggan</td><td><b>' + esc(p.nama) + '</b> ' + esc(p.hp) + '</td><td>Plat</td><td><b>' + esc(w.plat) + '</b></td></tr><tr><td>Kendaraan</td><td>' + esc((k.merk || '') + ' ' + (k.model || '')) + '</td><td>KM</td><td>' + (w.km || '-').toLocaleString('id-ID') + '</td></tr><tr><td>Keluhan</td><td colspan="3">' + esc(w.keluhan) + '</td></tr></table>' +
      '<table style="width:100%"><thead><tr><th>Uraian</th><th style="text-align:right">Qty</th><th style="text-align:right">Harga</th><th style="text-align:right">Jumlah</th></tr></thead><tbody>' +
      w.jasa.map(function (j) { return '<tr><td>Jasa: ' + esc(j.nama) + '</td><td style="text-align:right">1</td><td style="text-align:right">' + rp(j.harga) + '</td><td style="text-align:right">' + rp(j.harga) + '</td></tr>'; }).join('') +
      w.part.map(function (x) { return '<tr><td>' + esc(x.nama) + '</td><td style="text-align:right">' + x.qty + '</td><td style="text-align:right">' + rp(x.harga) + '</td><td style="text-align:right">' + rp(x.qty * x.harga) + '</td></tr>'; }).join('') +
      (w.diskon ? '<tr><td colspan="3" style="text-align:right">Diskon</td><td style="text-align:right">-' + rp(w.diskon) + '</td></tr>' : '') +
      '<tr><td colspan="3" style="text-align:right"><b>TOTAL</b></td><td style="text-align:right"><b>' + rp(totalWo(w)) + '</b></td></tr></tbody></table>' +
      '<p style="margin-top:8px">Mekanik: ' + esc(cariMekanik(w.mekanikId).nama) + ' · Pembayaran: ' + esc(w.bayar) + (w.servisBerikut ? ' · Servis berikutnya: ' + tgl(w.servisBerikut.tgl) + ' / ' + w.servisBerikut.km.toLocaleString('id-ID') + ' km' : '') + '</p><p style="margin-top:6px;font-style:italic">' + esc(set.catatan) + '</p></div>';
  }
  function teksWa(w) {
    var p = cariPelanggan(w.pelangganId);
    var baris = ['Halo ' + p.nama + ', kendaraan *' + w.plat + '* (' + kendaraanLabel(w.plat) + ') ' + (w.status === 'diambil' ? 'sudah selesai & diambil.' : 'sudah selesai diservis dan siap diambil.'), '', 'Nota ' + w.no + ':'];
    w.jasa.forEach(function (j) { baris.push('• ' + j.nama + ': ' + rp(j.harga)); });
    w.part.forEach(function (x) { baris.push('• ' + x.nama + ' x' + x.qty + ': ' + rp(x.qty * x.harga)); });
    if (w.diskon) baris.push('• Diskon: -' + rp(w.diskon));
    baris.push('*Total: ' + rp(totalWo(w)) + '*', '', 'Terima kasih — ' + namaUsaha());
    return baris.join('\n');
  }
  function bukaNota(w) {
    var ukuran = 'a5';
    var el = bukaModal('Nota ' + w.no, '<div class="alat"><div class="segmen" role="group" aria-label="Ukuran nota"><button type="button" data-u="a5" aria-pressed="true">A5</button><button type="button" data-u="t58" aria-pressed="false">Thermal 58mm</button></div></div><div class="pratinjau-nota" id="pratNota"></div>' +
      '<div class="aksi-bawah"><button class="tombol wa" id="waNota">' + ikon('wa') + 'Kirim WA</button><button data-bagian="utama" class="tombol utama" id="cetakNota">' + ikon('cetak') + 'Cetak</button></div>');
    function g() { $('#pratNota').innerHTML = htmlNota(w, ukuran); }
    g();
    $$('[data-u]', el).forEach(function (b) { b.onclick = function () { ukuran = b.dataset.u; $$('[data-u]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); g(); }; });
    $('#cetakNota').onclick = function () {
      var c = $('#cetak'); c.innerHTML = '<style>@page{size:' + (ukuran === 'a5' ? 'A5 portrait' : '58mm auto') + ';margin:' + (ukuran === 'a5' ? '6mm' : '2mm') + '}</style>' + htmlNota(w, ukuran);
      window.print();
    };
    $('#waNota').onclick = function () { var hp = hpKe62(cariPelanggan(w.pelangganId).hp); window.open('https://wa.me/' + hp + '?text=' + encodeURIComponent(teksWa(w)), '_blank', 'noopener'); };
  }
  function kirimPengingat(w) {
    var p = cariPelanggan(w.pelangganId);
    var t = 'Halo ' + p.nama + ', ini pengingat dari ' + namaUsaha() + '\nKendaraan *' + w.plat + '* (' + kendaraanLabel(w.plat) + ') sudah waktunya servis berkala (jadwal ' + tgl(w.servisBerikut.tgl) + ' / ' + w.servisBerikut.km.toLocaleString('id-ID') + ' km).\nBalas pesan ini untuk booking antrean ya. Terima kasih!';
    window.open('https://wa.me/' + hpKe62(p.hp) + '?text=' + encodeURIComponent(t), '_blank', 'noopener');
  }

  /* Sparepart & stok */
  var filterStok = 'semua';
  RENDER.stok = function (el) {
    var nilai = D.part.reduce(function (s, p) { return s + p.stok * p.beli; }, 0), menipis = D.part.filter(function (p) { return p.stok <= p.min; }).length;
    el.innerHTML = '<div class="grid grid-4" style="margin-bottom:16px">' + stat('kotak', '', D.part.length, 'Jenis sparepart', 'Terdaftar') + stat('uang', 'aksen', rp(nilai), 'Nilai stok', 'Harga beli') + stat('peringatan', menipis ? 'merah' : 'hijau', menipis, 'Di bawah minimum', 'Perlu restock') + stat('grafik', 'hijau', D.mutasi.length, 'Mutasi tercatat', 'Masuk & keluar') + '</div>' +
      '<div class="alat"><label class="cari">' + ikon('cari') + '<span class="sr">Cari sparepart</span><input type="search" id="cariPart" placeholder="Cari nama atau kode…"></label><div class="segmen" role="group" aria-label="Saring stok"><button type="button" data-f="semua" aria-pressed="' + (filterStok === 'semua') + '">Semua</button><button type="button" data-f="menipis" aria-pressed="' + (filterStok === 'menipis') + '">Menipis</button></div>' +
      '<button class="tombol" id="csvPart">' + ikon('unduh') + 'CSV</button>' + (pengguna === 'admin' ? '<button data-bagian="utama" class="tombol utama" id="tambahPart">' + ikon('plus') + 'Sparepart</button>' : '') + '</div>' +
      '<section data-bagian="panel" class="kartu"><div class="tabel-wadah"><table><thead><tr><th>Sparepart</th><th class="sembunyi-hp">Kategori</th><th class="kanan sembunyi-hp">Beli</th><th class="kanan">Jual</th><th class="kanan">Stok</th><th class="kanan">Aksi</th></tr></thead><tbody id="tbPart"></tbody></table></div></section>' +
      '<section data-bagian="panel" class="kartu" style="margin-top:16px"><div class="kartu-kepala"><h3>Mutasi stok terakhir</h3></div>' + (D.mutasi.length ? '<ul class="daftar">' + D.mutasi.slice(0, 12).map(function (m) { var s = cariPart(m.partId) || { nama: '?' }; return '<li><span class="lencana ' + (m.qty < 0 ? 'merah' : 'selesai') + ' angka">' + (m.qty > 0 ? '+' : '') + m.qty + '</span><div class="tumbuh"><b>' + esc(s.nama) + '</b><span class="kecil redup">' + esc(m.ket) + '</span></div><span class="kecil redup">' + tgl(m.t, 1) + '</span></li>'; }).join('') + '</ul>' : kosong('kotak', 'Mutasi muncul otomatis saat work order disimpan atau stok ditambah')) + '</section>';
    function isi() {
      var q = $('#cariPart').value.toLowerCase();
      var rows = D.part.filter(function (p) { return (filterStok === 'semua' || p.stok <= p.min) && (!q || (p.nama + ' ' + p.kode).toLowerCase().indexOf(q) > -1); });
      $('#tbPart').className = 'muncul';
      $('#tbPart').innerHTML = rows.length ? rows.map(function (p) {
        var rendah = p.stok <= p.min;
        return '<tr><td><b>' + esc(p.nama) + '</b><div class="kecil redup">' + esc(p.kode) + '</div></td><td class="sembunyi-hp">' + esc(p.kategori) + '</td><td class="kanan angka sembunyi-hp">' + rp(p.beli) + '</td><td class="kanan angka">' + rp(p.jual) + '</td><td class="kanan"><span class="lencana ' + (rendah ? 'merah' : 'selesai') + ' angka">' + (rendah ? ikon('peringatan').replace('<svg', '<svg style="width:12px;height:12px"') : '') + p.stok + ' ' + esc(p.satuan) + '</span><div class="kecil redup">min ' + p.min + '</div></td><td class="kanan" style="white-space:nowrap"><button class="tombol kecil" data-masuk="' + p.id + '">' + ikon('plus') + '<span class="sembunyi-hp">Stok</span></button>' + (pengguna === 'admin' ? ' <button class="ikon-btn kecil" data-edit="' + p.id + '" aria-label="Ubah ' + esc(p.nama) + '">' + ikon('pensil') + '</button>' : '') + '</td></tr>';
      }).join('') : '<tr><td colspan="6">' + kosong('kotak', 'Tidak ada sparepart') + '</td></tr>';
    }
    isi();
    $('#cariPart').oninput = isi;
    $$('.segmen button', el).forEach(function (b) { b.onclick = function () { filterStok = b.dataset.f; $$('.segmen button', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); isi(); }; });
    $('#tbPart').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.masuk) stokMasuk(cariPart(b.dataset.masuk)); if (b.dataset.edit) formPart(cariPart(b.dataset.edit)); });
    if ($('#tambahPart')) $('#tambahPart').onclick = function () { formPart(); };
    $('#csvPart').onclick = function () { unduhCsv('sparepart', [['Kode', 'Nama', 'Kategori', 'Harga beli', 'Harga jual', 'Stok', 'Minimum', 'Satuan']].concat(D.part.map(function (p) { return [p.kode, p.nama, p.kategori, p.beli, p.jual, p.stok, p.min, p.satuan]; }))); };
  };
  function stokMasuk(p) {
    var el = bukaModal('Stok masuk · ' + p.nama, '<form id="fMasuk" class="tumpuk"><p class="redup">Stok sekarang: <b>' + p.stok + ' ' + esc(p.satuan) + '</b></p><label class="isian"><span>Jumlah masuk</span><input name="qty" type="number" min="1" value="10" required></label><label class="isian"><span>Keterangan</span><input name="ket" value="Belanja supplier"></label><div class="aksi-bawah"><button type="button" class="tombol" data-tutup>Batal</button><button data-bagian="utama" class="tombol utama">Tambah stok</button></div></form>', true);
    $('#fMasuk', el).onsubmit = function (e) { e.preventDefault(); var q = +this.qty.value; if (!(q > 0)) return this.qty.focus(); p.stok += q; D.mutasi.unshift({ id: idBaru(), t: Date.now(), partId: p.id, qty: q, ket: this.ket.value || 'Stok masuk' }); simpan(); tutupModal(); segarkan(); toast('Stok ' + p.nama + ' +' + q); };
  }
  function formPart(p) {
    var baru = !p; p = p || { id: idBaru(), kode: '', nama: '', kategori: 'Oli', beli: '', jual: '', stok: 0, min: 2, satuan: 'pcs' };
    var el = bukaModal(baru ? 'Sparepart baru' : 'Ubah sparepart', '<form id="fPart"><div class="form-grid">' +
      [['nama', 'Nama sparepart *', 'text', 'penuh'], ['kode', 'Kode', 'text'], ['kategori', 'Kategori', 'text'], ['beli', 'Harga beli', 'number'], ['jual', 'Harga jual *', 'number'], ['stok', 'Stok awal', 'number'], ['min', 'Stok minimum', 'number'], ['satuan', 'Satuan', 'text']].map(function (x) {
        if (x[0] === 'stok' && !baru) return '';
        return '<label class="isian ' + (x[3] || '') + '"><span>' + x[1] + '</span><input name="' + x[0] + '" type="' + x[2] + '"' + (x[2] === 'number' ? ' min="0"' : '') + ' value="' + esc(p[x[0]]) + '"></label>';
      }).join('') + '<p class="saran penuh" id="margin"></p></div><div class="aksi-bawah">' + (baru ? '' : '<button type="button" class="tombol bahaya" id="hapusPart">' + ikon('sampah') + 'Hapus</button>') + '<button type="button" class="tombol" data-tutup>Batal</button><button data-bagian="utama" class="tombol utama">Simpan</button></div></form>');
    var f = $('#fPart', el);
    function mg() { var b = +f.beli.value, j = +f.jual.value; $('#margin').textContent = j && b ? 'Margin ' + rp(j - b) + ' (' + Math.round((j - b) / j * 100) + '%)' : ''; }
    f.oninput = mg; mg();
    if (!baru) $('#hapusPart').onclick = function () { konfirmasi('Hapus ' + p.nama + '? Riwayat WO tetap tersimpan.', function () { D.part = D.part.filter(function (x) { return x.id !== p.id; }); simpan(); segarkan(); toast('Sparepart dihapus'); }); };
    f.onsubmit = function (e) {
      e.preventDefault(); if (!f.nama.value.trim() || !(+f.jual.value > 0)) { toast('Nama & harga jual wajib diisi', 1); return (f.nama.value.trim() ? f.jual : f.nama).focus(); }
      ['nama', 'kode', 'kategori', 'satuan'].forEach(function (k) { p[k] = f[k].value.trim(); }); ['beli', 'jual', 'min'].forEach(function (k) { p[k] = +f[k].value || 0; });
      if (baru) { p.stok = +f.stok.value || 0; D.part.push(p); if (p.stok) D.mutasi.unshift({ id: idBaru(), t: Date.now(), partId: p.id, qty: p.stok, ket: 'Stok awal' }); }
      simpan(); tutupModal(); segarkan(); toast('Sparepart disimpan');
    };
  }

  /* Riwayat kendaraan */
  RENDER.kendaraan = function (el, platAwal) {
    el.innerHTML = '<div class="alat"><label class="cari">' + ikon('cari') + '<span class="sr">Cari plat nomor</span><input type="search" id="cariPlat" list="dlPlat2" placeholder="Ketik plat nomor, mis. B 1234 XYZ"></label><datalist id="dlPlat2">' + D.kendaraan.map(function (k) { return '<option value="' + esc(k.plat) + '">'; }).join('') + '</datalist></div><div id="hasilPlat"></div>';
    function isi() {
      var q = normPlat($('#cariPlat').value), h = $('#hasilPlat');
      var k = cariKendaraan(q);
      if (!k) {
        var cocok = D.kendaraan.filter(function (x) { return !q || (x.plat + ' ' + x.merk + ' ' + x.model).toUpperCase().indexOf(q) > -1; });
        h.innerHTML = '<section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Kendaraan terdaftar</h3><span class="lencana">' + cocok.length + '</span></div><ul class="daftar muncul">' + cocok.map(function (x) { var n = D.wo.filter(function (w) { return w.plat === x.plat; }).length; return '<li style="cursor:pointer" data-plat="' + esc(x.plat) + '" tabindex="0" role="button"><span class="plat">' + esc(x.plat) + '</span><div class="tumbuh"><b>' + esc(x.merk + ' ' + x.model) + '</b><span class="kecil redup">' + esc(cariPelanggan(x.pelangganId).nama) + ' · ' + (x.jenis === 'mobil' ? 'Mobil' : 'Motor') + '</span></div><span class="lencana">' + n + ' servis</span></li>'; }).join('') + '</ul></section>';
        $$('[data-plat]', h).forEach(function (li) { li.onclick = function () { $('#cariPlat').value = li.dataset.plat; isi(); }; li.onkeydown = function (e) { if (e.key === 'Enter') li.click(); }; });
        return;
      }
      var p = cariPelanggan(k.pelangganId), daftar = D.wo.filter(function (w) { return w.plat === k.plat; }).sort(function (a, b) { return b.t - a.t; });
      var total = daftar.reduce(function (s, w) { return s + totalWo(w); }, 0), akhir = daftar.find(function (w) { return w.servisBerikut; });
      h.innerHTML = '<div class="grid grid-3-1"><section data-bagian="panel" class="kartu"><div class="kartu-kepala"><div><span class="plat" style="font-size:18px">' + esc(k.plat) + '</span><h3 style="margin-top:8px">' + esc(k.merk + ' ' + k.model) + ' ' + esc(k.tahun || '') + '</h3><p class="redup kecil">' + esc(p.nama) + ' · ' + esc(p.hp) + '</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="tombol" id="kembaliPlat">' + ikon('kiri') + 'Semua</button><button data-bagian="utama" class="tombol utama" id="woPlat">' + ikon('plus') + 'Servis baru</button></div></div>' +
        '<h4 style="margin:6px 0 10px">Riwayat servis (' + daftar.length + ')</h4><ul class="daftar muncul">' + daftar.map(function (w) { return '<li style="cursor:pointer" data-wo="' + w.id + '" tabindex="0" role="button"><span class="lencana ' + w.status + '">' + STATUS.find(function (s) { return s.id === w.status; }).nama + '</span><div class="tumbuh"><b>' + esc(w.jasa.map(function (j) { return j.nama; }).join(', ') || w.keluhan) + '</b><span class="kecil redup">' + tgl(w.t) + ' · ' + (w.km ? w.km.toLocaleString('id-ID') + ' km · ' : '') + esc(cariMekanik(w.mekanikId).nama) + (w.part.length ? ' · ' + esc(w.part.map(function (x) { return x.nama; }).join(', ')) : '') + '</span></div><b class="angka">' + rp(totalWo(w)) + '</b></li>'; }).join('') + '</ul></section>' +
        '<div class="tumpuk"><section data-bagian="panel" class="kartu statistik"><span class="ikon">' + ikon('uang') + '</span><span class="nilai">' + rp(total) + '</span><span class="label">Total belanja servis</span></section>' +
        '<section data-bagian="panel" class="kartu"><h3 style="margin-bottom:10px">Servis berikutnya</h3>' + (akhir ? '<p><b>' + tgl(akhir.servisBerikut.tgl) + '</b> atau <b>' + akhir.servisBerikut.km.toLocaleString('id-ID') + ' km</b></p><p class="kecil ' + (akhir.servisBerikut.tgl < Date.now() ? '' : 'redup') + '" style="margin:4px 0 12px">' + (akhir.servisBerikut.tgl < Date.now() ? 'Sudah lewat jadwal' : 'Sesuai interval ' + D.pengaturan.intervalHari + ' hari / ' + D.pengaturan.intervalKm + ' km') + '</p><button class="tombol wa blok" id="ingatPlat">' + ikon('wa') + 'Kirim pengingat WA</button>' : '<p class="redup">Belum ada servis selesai.</p>') + '</section></div></div>';
      $('#kembaliPlat').onclick = function () { $('#cariPlat').value = ''; isi(); };
      $('#woPlat').onclick = function () { formWo(null, k.plat); };
      if ($('#ingatPlat')) $('#ingatPlat').onclick = function () { kirimPengingat(akhir); };
      $$('[data-wo]', h).forEach(function (li) { li.onclick = function () { formWo(D.wo.find(function (w) { return w.id === li.dataset.wo; })); }; li.onkeydown = function (e) { if (e.key === 'Enter') li.click(); }; });
    }
    if (platAwal) $('#cariPlat').value = platAwal;
    isi(); $('#cariPlat').oninput = isi;
  };

  /* Pelanggan & mekanik */
  var tabData = 'pelanggan';
  RENDER.data = function (el) {
    el.innerHTML = '<div class="alat"><div class="segmen" role="group" aria-label="Pilih data"><button type="button" data-t="pelanggan" aria-pressed="' + (tabData === 'pelanggan') + '">Pelanggan (' + D.pelanggan.length + ')</button><button type="button" data-t="mekanik" aria-pressed="' + (tabData === 'mekanik') + '">Mekanik (' + D.mekanik.length + ')</button></div><span style="flex:1"></span><button class="tombol" id="csvData">' + ikon('unduh') + 'CSV</button><button data-bagian="utama" class="tombol utama" id="tambahData">' + ikon('plus') + 'Tambah</button></div><section data-bagian="panel" class="kartu"><div class="tabel-wadah"><table id="tbData"></table></div></section>';
    var h30 = Date.now() - 30 * 864e5;
    if (tabData === 'pelanggan') {
      $('#tbData').innerHTML = '<thead><tr><th>Nama</th><th>WhatsApp</th><th class="sembunyi-hp">Kendaraan</th><th class="kanan">Servis</th><th class="kanan">Aksi</th></tr></thead><tbody class="muncul">' + D.pelanggan.map(function (p) {
        var ks = D.kendaraan.filter(function (k) { return k.pelangganId === p.id; }), n = D.wo.filter(function (w) { return w.pelangganId === p.id; }).length;
        return '<tr><td><b>' + esc(p.nama) + '</b><div class="kecil redup">' + esc(p.alamat || '') + '</div></td><td class="angka">' + esc(p.hp) + '</td><td class="sembunyi-hp">' + ks.map(function (k) { return '<span class="plat">' + esc(k.plat) + '</span>'; }).join(' ') + '</td><td class="kanan">' + n + '</td><td class="kanan" style="white-space:nowrap">' + (p.hp ? '<a class="ikon-btn kecil" href="https://wa.me/' + hpKe62(p.hp) + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + esc(p.nama) + '">' + ikon('wa') + '</a>' : '') + '<button class="ikon-btn kecil" data-ep="' + p.id + '" aria-label="Ubah ' + esc(p.nama) + '">' + ikon('pensil') + '</button></td></tr>';
      }).join('') + '</tbody>';
    } else {
      $('#tbData').innerHTML = '<thead><tr><th>Mekanik</th><th>HP</th><th class="kanan">WO 30 hari</th><th>Status</th><th class="kanan">Aksi</th></tr></thead><tbody class="muncul">' + D.mekanik.map(function (m) {
        var n = D.wo.filter(function (w) { return w.mekanikId === m.id && w.t >= h30 && w.tSelesai; }).length;
        return '<tr><td><span class="avatar">' + inisial(m.nama) + '</span> <b>' + esc(m.nama) + '</b></td><td class="angka">' + esc(m.hp) + '</td><td class="kanan">' + n + '</td><td><span class="lencana ' + (m.aktif ? 'selesai' : '') + '">' + (m.aktif ? 'Aktif' : 'Nonaktif') + '</span></td><td class="kanan"><button class="ikon-btn kecil" data-em="' + m.id + '" aria-label="Ubah ' + esc(m.nama) + '">' + ikon('pensil') + '</button></td></tr>';
      }).join('') + '</tbody>';
    }
    $$('.segmen button', el).forEach(function (b) { b.onclick = function () { tabData = b.dataset.t; RENDER.data(el); }; });
    $('#tbData').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.ep) formOrang('pelanggan', D.pelanggan.find(function (x) { return x.id === b.dataset.ep; })); if (b.dataset.em) formOrang('mekanik', D.mekanik.find(function (x) { return x.id === b.dataset.em; })); };
    $('#tambahData').onclick = function () { formOrang(tabData); };
    $('#csvData').onclick = function () {
      if (tabData === 'pelanggan') unduhCsv('pelanggan', [['Nama', 'WhatsApp', 'Alamat', 'Kendaraan']].concat(D.pelanggan.map(function (p) { return [p.nama, p.hp, p.alamat, D.kendaraan.filter(function (k) { return k.pelangganId === p.id; }).map(function (k) { return k.plat; }).join(' / ')]; })));
      else unduhCsv('mekanik', [['Nama', 'HP', 'Aktif']].concat(D.mekanik.map(function (m) { return [m.nama, m.hp, m.aktif ? 'Ya' : 'Tidak']; })));
    };
  };
  function formOrang(jenis, o) {
    var baru = !o; o = o || { id: idBaru(), nama: '', hp: '', alamat: '', aktif: true };
    var el = bukaModal((baru ? 'Tambah ' : 'Ubah ') + jenis, '<form id="fOrang" class="tumpuk"><label class="isian"><span>Nama *</span><input name="nama" required value="' + esc(o.nama) + '"></label><label class="isian"><span>No. HP / WhatsApp</span><input name="hp" type="tel" value="' + esc(o.hp) + '"></label>' +
      (jenis === 'pelanggan' ? '<label class="isian"><span>Alamat</span><input name="alamat" value="' + esc(o.alamat || '') + '"></label>' : '<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="aktif"' + (o.aktif ? ' checked' : '') + '> Mekanik aktif (muncul di pilihan WO)</label>') +
      '<div class="aksi-bawah"><button type="button" class="tombol" data-tutup>Batal</button><button data-bagian="utama" class="tombol utama">Simpan</button></div></form>', true);
    $('#fOrang', el).onsubmit = function (e) {
      e.preventDefault(); if (!this.nama.value.trim()) return this.nama.focus();
      o.nama = this.nama.value.trim(); o.hp = this.hp.value.trim();
      if (jenis === 'pelanggan') o.alamat = this.alamat.value.trim(); else o.aktif = this.aktif.checked;
      if (baru) D[jenis].push(o); simpan(); tutupModal(); segarkan(); toast('Data ' + jenis + ' disimpan');
    };
  }

  /* Laporan */
  var periode = 'bulan';
  RENDER.laporan = function (el) {
    var now = Date.now(), h0 = hariIni(now), d = new Date(h0);
    var awal = periode === 'hari' ? h0 : periode === 'minggu' ? h0 - 6 * 864e5 : periode === 'bulan' ? new Date(d.getFullYear(), d.getMonth(), 1).getTime() : 0;
    var r = pendapatanRentang(awal, h0 + 864e5);
    var mek = D.mekanik.map(function (m) {
      var ws = D.wo.filter(function (w) { return w.mekanikId === m.id && w.status === 'diambil' && w.tAmbil >= awal; });
      return { m: m, n: ws.length, jasa: ws.reduce(function (s, w) { return s + totalJasa(w); }, 0) };
    }).sort(function (a, b) { return b.n - a.n || b.jasa - a.jasa; });
    var mxm = Math.max(1, mek[0] ? mek[0].n : 1);
    var laris = {}; D.wo.forEach(function (w) { if (w.status === 'diambil' && w.tAmbil >= awal) w.part.forEach(function (p) { laris[p.nama] = (laris[p.nama] || 0) + p.qty; }); });
    var larisArr = Object.keys(laris).map(function (k) { return [k, laris[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 6), mxl = larisArr[0] ? larisArr[0][1] : 1;
    var pj = r.total ? Math.round(r.jasa / r.total * 100) : 0;
    el.innerHTML = '<div class="alat"><div class="segmen" role="group" aria-label="Periode">' + [['hari', 'Hari ini'], ['minggu', '7 hari'], ['bulan', 'Bulan ini'], ['semua', 'Semua']].map(function (x) { return '<button type="button" data-p="' + x[0] + '" aria-pressed="' + (periode === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div><span style="flex:1"></span><button class="tombol" id="csvLap">' + ikon('unduh') + 'Ekspor CSV</button></div>' +
      '<div class="grid grid-4">' + stat('uang', '', rp(r.total), 'Pendapatan', r.n + ' nota') + stat('kunci-inggris', '', rp(r.jasa), 'Jasa', pj + '% dari total') + stat('kotak', 'aksen', rp(r.part), 'Sparepart', (100 - pj) + '% dari total') + stat('grafik', 'hijau', rp(r.laba), 'Laba kotor', 'Jasa + margin sparepart') + '</div>' +
      '<div class="grid grid-2 tetap-1" style="margin-top:16px"><section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Jasa vs sparepart</h3></div><div class="donat" data-bagian="aksen" role="img" aria-label="Jasa ' + pj + ' persen, sparepart ' + (100 - pj) + ' persen" style="background:conic-gradient(var(--grafik-1) 0 ' + pj + '%, var(--tema-aksen) ' + pj + '% 100%)"><div><span><b>' + pj + '%</b>jasa</span></div></div><div class="legenda" style="justify-content:center;margin-top:14px"><span><i style="background:var(--grafik-1)"></i>Jasa ' + rp(r.jasa) + '</span><span><i style="background:var(--tema-aksen)"></i>Sparepart ' + rp(r.part) + '</span></div></section>' +
      '<section data-bagian="panel" class="kartu"><div class="kartu-kepala"><h3>Mekanik terproduktif</h3></div><ul class="daftar">' + mek.map(function (x, i) { return '<li><span class="avatar">' + inisial(x.m.nama) + '</span><div class="tumbuh"><b>' + (i === 0 && x.n ? '<span class="lencana menunggu">Teratas</span> ' : '') + esc(x.m.nama) + '</b><div class="bar-h" style="margin-top:6px"><span style="width:' + (x.n / mxm * 100) + '%;animation-delay:' + i * .08 + 's"></span></div></div><div style="text-align:right"><b class="angka">' + x.n + ' WO</b><div class="kecil redup angka">' + rp(x.jasa) + '</div></div></li>'; }).join('') + '</ul></section></div>' +
      '<section data-bagian="panel" class="kartu" style="margin-top:16px"><div class="kartu-kepala"><h3>Sparepart terlaris</h3></div>' + (larisArr.length ? '<ul class="daftar">' + larisArr.map(function (x, i) { return '<li><div class="tumbuh"><b>' + esc(x[0]) + '</b><div class="bar-h" style="margin-top:6px"><span style="width:' + (x[1] / mxl * 100) + '%;animation-delay:' + i * .06 + 's"></span></div></div><b class="angka">' + x[1] + '</b></li>'; }).join('') + '</ul>' : kosong('kotak', 'Belum ada penjualan di periode ini')) + '</section>';
    $$('[data-p]', el).forEach(function (b) { b.onclick = function () { periode = b.dataset.p; RENDER.laporan(el); }; });
    $('#csvLap').onclick = function () { eksporWo(awal); };
  };
  function eksporWo(awal) {
    awal = typeof awal === 'number' ? awal : 0;
    unduhCsv('work-order', [['No WO', 'Tanggal', 'Plat', 'Kendaraan', 'Pelanggan', 'KM', 'Mekanik', 'Status', 'Jasa', 'Sparepart', 'Diskon', 'Total', 'Bayar']].concat(D.wo.filter(function (w) { return w.t >= awal; }).map(function (w) { return [w.no, tgl(w.t, 1), w.plat, kendaraanLabel(w.plat), cariPelanggan(w.pelangganId).nama, w.km, cariMekanik(w.mekanikId).nama, w.status, totalJasa(w), totalPart(w), w.diskon || 0, totalWo(w), w.bayar]; })));
  }
  function unduhCsv(nama, rows) {
    var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { c = String(c == null ? '' : c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n');
    unduh(nama + '-' + new Date().toISOString().slice(0, 10) + '.csv', csv, 'text/csv'); toast('CSV ' + nama + ' diunduh');
  }
  function unduh(nama, isi, tipe) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  /* Pengaturan */
  RENDER.pengaturan = function (el) {
    var s = D.pengaturan, mode = document.documentElement.dataset.mode;
    el.innerHTML = '<div class="pengaturan-grid">' +
      '<section data-bagian="panel" class="kartu"><h3 style="margin-bottom:14px">Profil bengkel</h3><form id="fProfil" class="tumpuk"><p class="kecil redup">Nama usaha diatur di <code>tema.js</code>: <b>' + esc(namaUsaha()) + '</b></p><label class="isian"><span>Alamat</span><input name="alamat" value="' + esc(s.alamat) + '"></label><label class="isian"><span>No. WhatsApp bengkel</span><input name="hp" value="' + esc(s.hp) + '"></label><label class="isian"><span>Catatan di nota</span><textarea name="catatan">' + esc(s.catatan) + '</textarea></label><div class="form-grid"><label class="isian"><span>Interval servis (hari)</span><input name="intervalHari" type="number" min="1" value="' + s.intervalHari + '"></label><label class="isian"><span>Interval servis (km)</span><input name="intervalKm" type="number" min="100" value="' + s.intervalKm + '"></label></div><button data-bagian="utama" class="tombol utama">Simpan profil</button></form></section>' +
      '<section data-bagian="panel" class="kartu"><h3 style="margin-bottom:14px">Tampilan & keamanan</h3><div class="tumpuk"><div><p class="kecil redup" style="margin-bottom:6px">Mode tampilan</p><div class="segmen" role="group" aria-label="Mode tampilan"><button type="button" data-m="terang" aria-pressed="' + (mode === 'terang') + '">Terang</button><button type="button" data-m="gelap" aria-pressed="' + (mode === 'gelap') + '">Gelap</button></div></div>' +
      '<form id="fPin" class="form-grid"><label class="isian"><span>PIN admin (4 angka)</span><input name="pinAdmin" inputmode="numeric" pattern="\\d{4}" maxlength="4" value="' + esc(s.pinAdmin) + '"></label><label class="isian"><span>PIN kasir (4 angka)</span><input name="pinKasir" inputmode="numeric" pattern="\\d{4}" maxlength="4" value="' + esc(s.pinKasir) + '"></label><button class="tombol penuh">Simpan PIN</button></form><p class="saran">PIN hanya pengaman ringan di perangkat ini (data tetap di localStorage browser).</p></div></section>' +
      '<section data-bagian="panel" class="kartu"><h3 style="margin-bottom:14px">Backup & data</h3><div class="tumpuk"><button class="tombol" id="bkUnduh">' + ikon('unduh') + 'Unduh backup JSON</button><label class="tombol" style="cursor:pointer">' + ikon('dok') + 'Pulihkan dari JSON<input type="file" id="bkPulih" accept="application/json,.json" class="sr"></label><button class="tombol" id="bkCsv">' + ikon('unduh') + 'Ekspor semua WO (CSV)</button><button class="tombol bahaya" id="bkContoh">' + ikon('sampah') + 'Reset ke data contoh</button><button class="tombol bahaya" id="bkKosong">' + ikon('sampah') + 'Kosongkan semua data</button><p class="saran">Backup rutin seminggu sekali. Data tersimpan hanya di browser ini.</p></div></section></div>';
    $('#fProfil').onsubmit = function (e) { e.preventDefault(); var f = this; s.alamat = f.alamat.value.trim(); s.hp = f.hp.value.trim(); s.catatan = f.catatan.value.trim(); s.intervalHari = +f.intervalHari.value || 60; s.intervalKm = +f.intervalKm.value || 2000; simpan(); toast('Profil disimpan'); };
    $('#fPin').onsubmit = function (e) { e.preventDefault(); var a = this.pinAdmin.value, k = this.pinKasir.value; if (!/^\d{4}$/.test(a) || !/^\d{4}$/.test(k) || a === k) return toast('PIN harus 4 angka & berbeda', 1); s.pinAdmin = a; s.pinKasir = k; simpan(); toast('PIN diperbarui'); };
    $$('[data-m]', el).forEach(function (b) { b.onclick = function () { setMode(b.dataset.m, 1); $$('[data-m]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    $('#bkUnduh').onclick = function () { unduh('backup-bengkel-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(D, null, 1), 'application/json'); toast('Backup diunduh'); };
    $('#bkCsv').onclick = function () { eksporWo(0); };
    $('#bkPulih').onchange = function () {
      var file = this.files[0]; if (!file) return; var rd = new FileReader();
      rd.onload = function () { try { var x = JSON.parse(rd.result); if (!x.wo || !x.part) throw 0; konfirmasi('Ganti semua data dengan isi backup ini?', function () { D = x; migrasi(); simpan(); segarkan(); toast('Data dipulihkan'); }); } catch (e) { toast('Berkas backup tidak valid', 1); } };
      rd.readAsText(file);
    };
    $('#bkContoh').onclick = function () { konfirmasi('Semua data diganti data contoh. Lanjut?', function () { D = contoh(); simpan(); segarkan(); toast('Data contoh dimuat'); }); };
    $('#bkKosong').onclick = function () { konfirmasi('Hapus semua WO, pelanggan, kendaraan & sparepart? Unduh backup dulu!', function () { var p = D.pengaturan; D = { versi: VERSI, pelanggan: [], kendaraan: [], mekanik: [], part: [], wo: [], mutasi: [], pengaturan: p }; simpan(); segarkan(); toast('Data dikosongkan'); }); };
  };

  /* ---------- Mulai ---------- */
  muat(); isiNama(); teksAtas();
  $('#tanggalHari').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#btnMode').onclick = function () { setMode(document.documentElement.dataset.mode === 'gelap' ? 'terang' : 'gelap', 1); if (halaman === 'pengaturan') RENDER.pengaturan($('#isi')); };
  $('#btnWoBaru').onclick = function () { formWo(); };
  $('#btnTv').onclick = bukaTv; $('#tvTutup').onclick = tutupTv;
  $('#btnKeluar').onclick = keluar;
  $('#btnMenu').onclick = bukaMenu; $('#tirai').onclick = tutupMenu;
  var q = location.search, sesi = null;
  try { sesi = sessionStorage.getItem('bengkel-sesi'); } catch (e) {}
  if (/[?&]demo/.test(q)) { if (!sesi) { D = contoh(); simpan(); } masuk('admin'); }
  else if (sesi) masuk(sesi);
  if (/[?&]tv/.test(q)) { if (!pengguna) { $('#layarPin').hidden = true; } bukaTv(); }
})();
