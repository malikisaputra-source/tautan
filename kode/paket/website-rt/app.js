/* Website RT/RW — aplikasi statis (tanpa server). Data di localStorage perangkat ini.
   Susunan: 1) utilitas  2) data & simpan  3) tema  4) router & kerangka  5) halaman publik
            6) halaman pengurus (ringkas, warga, iuran, kas, info, surat, pengaturan)  7) modal/toast  8) CSV/JSON  9) mulai */
(function () {
  'use strict';

  /* ========== 1. Utilitas ========== */
  var DEMO = /[?&]demo\b/.test(location.search);
  var KUNCI = DEMO ? 'website-rt-demo' : 'website-rt-data';
  var KUNCI_TAMPILAN = 'website-rt-tampilan';
  var VERSI = 1;
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var ROMAWI = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var fmtRp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  function rp(n) { return fmtRp.format(n || 0).replace(/\s/g, ''); }
  function rpPendek(n) { var a = Math.abs(n); return (n < 0 ? '-' : '') + (a >= 1e6 ? (a / 1e6).toFixed(1).replace('.0', '').replace('.', ',') + 'jt' : a >= 1e3 ? Math.round(a / 1e3) + 'rb' : a); }
  function idBaru(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function hariIni() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function bulanKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function geserBulan(k, n) { var p = k.split('-'); return bulanKey(new Date(+p[0], +p[1] - 1 + n, 1)); }
  function namaBulan(k, pendek) { var p = k.split('-'); var b = BULAN[+p[1] - 1]; return (pendek ? b.slice(0, 3) : b) + ' ' + p[0]; }
  function tglPanjang(s) { if (!s) return '-'; var d = new Date(s + 'T00:00'); return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
  function tglHari(s) { var d = new Date(s + 'T00:00'); return HARI[d.getDay()] + ', ' + tglPanjang(s); }
  function inisial(n) { return String(n || '?').replace(/^(hj?\.|bpk\.|ibu)\s*/i, '').split(/\s+/).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase(); }
  function waNomor(n) { n = String(n || '').replace(/\D/g, ''); if (n[0] === '0') n = '62' + n.slice(1); return n; }
  function waLink(nomor, teks) { return 'https://wa.me/' + waNomor(nomor) + '?text=' + encodeURIComponent(teks); }
  function hormat(a) { return (a && a.jk === 'P' ? 'Ibu ' : 'Bapak ') + a.nama; }
  function umur(t) { if (!t) return ''; var d = new Date(t), k = new Date(); var u = k.getFullYear() - d.getFullYear(); if (k < new Date(k.getFullYear(), d.getMonth(), d.getDate())) u--; return u; }

  var IKON = {
    rumah: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    ringkas: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    warga: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    iuran: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M7 15h3"/>',
    kas: '<path d="M4 19V9M10 19V5M16 19v-7M21 19H3"/>',
    info: '<path d="M4 10v4a1 1 0 0 0 1 1h3l6 4V5L8 9H5a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    surat: '<path d="M6 2.5h8l4 4V21.5H6z"/><path d="M14 2.5v4h4M9 12h6M9 16h6"/>',
    atur: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    tambah: '<path d="M12 5v14M5 12h14"/>', cari: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    wa: '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/>',
    kiri: '<path d="m15 18-6-6 6-6"/>', kanan: '<path d="m9 18 6-6-6-6"/>', tutup: '<path d="M18 6 6 18M6 6l12 12"/>',
    cek: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', unduh: '<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>', unggah: '<path d="M12 21V9m-5 5 5-5 5 5M4 4h16"/>',
    kalender: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>', jam: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lokasi: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    cetak: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/>', bagikan: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    keluar: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>', kunci: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
    sunting: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>', pin: '<path d="M9 3h6l-1 6 4 4H6l4-4z"/><path d="M12 13v8"/>', jiwa: '<circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    dompet: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H19v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="16.5" cy="13.5" r="1.3"/>'
  };
  function ik(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IKON[n] || '') + '</svg>'; }

  /* ========== 2. Data & penyimpanan ========== */
  var D;
  function muat() {
    var mentah = null;
    try { mentah = JSON.parse(localStorage.getItem(KUNCI) || 'null'); } catch (x) { mentah = null; }
    if (DEMO || !mentah || !mentah.pengaturan) mentah = window.buatDataContoh();
    return migrasi(mentah);
  }
  // Migrasi: tambahkan bidang baru di sini supaya data lama pengguna tidak rusak.
  function migrasi(d) {
    d.versi = d.versi || 1;
    d.pengurus = d.pengurus || []; d.kk = d.kk || []; d.iuran = d.iuran || {}; d.kas = d.kas || []; d.info = d.info || []; d.surat = d.surat || [];
    d.nomorSurat = d.nomorSurat || { tahun: new Date().getFullYear(), urut: 0 };
    d.pengaturan = Object.assign({ rt: '01', rw: '01', kelurahan: '', kecamatan: '', kota: '', provinsi: '', alamat: '', iuran: 25000, iuranMulai: bulanKey(), caraBayar: '', pin: '1234' }, d.pengaturan);
    d.kk.forEach(function (k) { k.anggota = k.anggota || []; k.status = k.status || 'tetap'; });
    d.versi = VERSI;
    return d;
  }
  function simpan() {
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); }
    catch (x) { toast('Gagal menyimpan: memori browser penuh', 'bahaya'); }
  }
  function cariKK(id) { return D.kk.filter(function (k) { return k.id === id; })[0]; }
  function jiwaTotal() { return D.kk.reduce(function (s, k) { return s + k.anggota.length; }, 0); }
  function sudahBayar(b, id) { return !!(D.iuran[b] && D.iuran[b][id]); }
  function bulanTagihan() { var a = [], b = D.pengaturan.iuranMulai || bulanKey(), kini = bulanKey(); var aman = 0; while (b <= kini && aman++ < 120) { a.push(b); b = geserBulan(b, 1); } return a; }
  function tunggakan(kk) {
    var awal = kk.dibuat ? kk.dibuat.slice(0, 7) : '';
    return bulanTagihan().filter(function (b) { return b >= awal && !sudahBayar(b, kk.id); });
  }
  function setLunas(b, id, lunas) {
    D.iuran[b] = D.iuran[b] || {};
    var ref = 'iuran:' + b + ':' + id, k = cariKK(id);
    D.kas = D.kas.filter(function (x) { return x.ref !== ref; });
    if (lunas) {
      D.iuran[b][id] = hariIni();
      D.kas.push({ id: idBaru('ks'), tgl: hariIni(), jenis: 'masuk', kategori: 'Iuran', ket: 'Iuran ' + b + ' — ' + k.kepala, jumlah: Number(D.pengaturan.iuran) || 0, ref: ref });
    } else delete D.iuran[b][id];
    simpan();
  }
  function saldo(sampai) { return D.kas.reduce(function (s, x) { return (!sampai || x.tgl <= sampai) ? s + (x.jenis === 'masuk' ? 1 : -1) * x.jumlah : s; }, 0); }
  function kasBulan(b) { var m = 0, k = 0; D.kas.forEach(function (x) { if (x.tgl.slice(0, 7) === b) { if (x.jenis === 'masuk') m += x.jumlah; else k += x.jumlah; } }); return { masuk: m, keluar: k }; }
  function namaRT() { var p = D.pengaturan; return 'RT ' + p.rt + ' / RW ' + p.rw; }

  /* ========== 3. Tema (kontrak customizer Maliki Studio) ========== */
  var FONT = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  var tampilan = {};
  try { tampilan = JSON.parse(localStorage.getItem(KUNCI_TAMPILAN) || '{}') || {}; } catch (x) { tampilan = {}; }
  function modeAktif(m) { if (m === 'auto' || !m) return matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang'; return m; }
  function muatFont(f) {
    var nama = String(f || '').split(',')[0].replace(/["']/g, '').trim();
    if (FONT.indexOf(nama) < 0) return;
    var href = 'https://fonts.googleapis.com/css2?family=' + nama.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap';
    var l = $('#fontTema'); if (l && l.getAttribute('href') !== href) l.setAttribute('href', href);
  }
  function terapkan(t) {
    t = t || {}; var r = document.documentElement.style;
    if (t.utama) r.setProperty('--tema-utama', t.utama);
    if (t.aksen) r.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null && t.radius !== '') r.setProperty('--tema-radius', /px$/.test(String(t.radius)) ? t.radius : t.radius + 'px');
    if (t.font) { var nm = String(t.font).split(',')[0].replace(/["']/g, '').trim(); r.setProperty('--tema-font', '"' + nm + '", system-ui, sans-serif'); muatFont(nm); }
    if (t.mode) document.documentElement.setAttribute('data-mode', modeAktif(t.mode));
    if (t.nama) { window.TEMA.nama = t.nama; $$('[data-tema-nama]').forEach(function (el) { el.textContent = t.nama; }); }
    if (t.bagian) {
      var peta = { latar: ['--latar', '--tema-latar'], panel: ['--permukaan', '--tema-panel'], nav: ['--nav', '--tema-nav'], teks: ['--teks', '--tema-teks'] };
      Object.keys(peta).forEach(function (k) { var v = t.bagian[k]; if (v) { r.setProperty(peta[k][0], v); r.setProperty(peta[k][1], v); } else if (v === null) { r.removeProperty(peta[k][0]); r.removeProperty(peta[k][1]); } });
    }
    hitungTeksKontras();
    var meta = $('meta[name="theme-color"]'); if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--tema-utama').trim();
  }
  // Luminansi: pilih teks hitam/putih yang paling kontras di atas nav & tombol utama.
  function luminansi(c) { var x = hex(c); var v = [1, 3, 5].map(function (i) { var n = parseInt(x.substr(i, 2), 16) / 255; return n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4); }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; }
  function teksUntuk(c) { var L = luminansi(c); return (1.05 / (L + .05)) >= ((L + .05) / .05) ? '#ffffff' : '#111111'; }
  function hitungTeksKontras() {
    var r = document.documentElement.style, cs = getComputedStyle(document.documentElement);
    r.setProperty('--tema-utama-teks', teksUntuk(cs.getPropertyValue('--tema-utama').trim()));
    var nav = cs.getPropertyValue('--nav').trim();
    if (nav) r.setProperty('--tema-nav-teks', teksUntuk(nav));
  }
  // Tandai bagian untuk customizer (sorot & tap-untuk-pilih).
  function tandaiBagian(root) {
    root = root || document;
    $$('.kartu,.tabel-wadah,.anggota-baris,.langkah,.sapa-kartu', root).forEach(function (el) { el.setAttribute('data-bagian', 'panel'); });
    $$('.btn:not(.btn-garis):not(.btn-hapus):not(.btn-wa),.chip[aria-pressed="true"],.merek-logo,.pahlawan', root).forEach(function (el) { el.setAttribute('data-bagian', 'utama'); });
    $$('.lencana,.grafik,.tgl-blok,.batang,.cincin,.hitung-mundur', root).forEach(function (el) { el.setAttribute('data-bagian', 'aksen'); });
    $$('h1,h2,h3,p', root).forEach(function (el) { if (!el.closest('.pahlawan')) el.setAttribute('data-bagian', 'teks'); });
  }
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var bagianSorot = null;
  function sorot(b) {
    bagianSorot = b || null;
    $$('[data-sorot]').forEach(function (el) { el.removeAttribute('data-sorot'); });
    $$('.label-sorot').forEach(function (el) { el.parentNode.removeChild(el); });
    if (!b) return;
    $$('[data-bagian="' + b + '"]').forEach(function (el, i) {
      el.setAttribute('data-sorot', '');
      if (i > 5) return;
      var k = el.getBoundingClientRect(); if (!k.width) return;
      var l = document.createElement('div'); l.className = 'label-sorot'; l.textContent = NAMA_BAGIAN[b] || b;
      l.style.left = (k.left + scrollX + 4) + 'px'; l.style.top = (k.top + scrollY + 4) + 'px'; document.body.appendChild(l);
    });
  }
  var modePilih = false, hoverEl = null;
  function bagianDari(el) { return el && el.closest ? el.closest('[data-bagian]') : null; }
  ['click', 'pointerdown', 'mousedown', 'submit', 'touchstart', 'keydown'].forEach(function (t) {
    document.addEventListener(t, function (ev) {
      if (!modePilih) return;
      ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
      if (t === 'click') { var x = bagianDari(ev.target); if (x && window.parent !== window) window.parent.postMessage({ tipe: 'bagian-dipilih', bagian: x.getAttribute('data-bagian') }, '*'); }
    }, { capture: true, passive: false });
  });
  document.addEventListener('mouseover', function (ev) {
    if (!modePilih) return; var x = bagianDari(ev.target);
    if (hoverEl && hoverEl !== x) hoverEl.removeAttribute('data-pilih-hover');
    hoverEl = x; if (x) x.setAttribute('data-pilih-hover', '');
  }, true);
  window.addEventListener('message', function (ev) {
    var d = ev.data; if (!d) return;
    if (d.tipe === 'tema') terapkan(d);
    if (d.tipe === 'sorot') sorot(d.bagian);
    if (d.tipe === 'mode-pilih') { modePilih = !!d.aktif; document.documentElement.classList.toggle('mode-pilih', modePilih); if (!modePilih && hoverEl) { hoverEl.removeAttribute('data-pilih-hover'); hoverEl = null; } }
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if ((tampilan.mode || TEMA.mode) === 'auto') terapkan({ mode: 'auto' }); });
  function namaUsaha() { return tampilan.nama || window.TEMA.nama; }

  /* ========== 4. Router & kerangka ========== */
  var MENU = [
    { id: 'ringkas', label: 'Ringkas', ikon: 'ringkas' },
    { id: 'warga', label: 'Warga', ikon: 'warga' },
    { id: 'iuran', label: 'Iuran', ikon: 'iuran' },
    { id: 'kas', label: 'Kas', ikon: 'kas' },
    { id: 'info', label: 'Info', ikon: 'info' },
    { id: 'surat', label: 'Surat', ikon: 'surat' },
    { id: 'pengaturan', label: 'Pengaturan', ikon: 'atur' }
  ];
  var terbuka = DEMO || sessionStorage.getItem('website-rt-buka') === '1';
  var HAL = {};
  var halSebelum = '';

  function rute() {
    var h = location.hash.replace(/^#\/?/, '');
    var bag = h.split('/');
    if (bag[0] !== 'panel') return { hal: 'publik' };
    var id = bag[1] || 'ringkas';
    if (!MENU.some(function (m) { return m.id === id; })) id = 'ringkas';
    return { hal: id, arg: bag[2] };
  }
  function pergi(h) { if (location.hash === h) render(); else location.hash = h; }

  function render() {
    var r = rute();
    if (r.hal !== 'publik' && !terbuka) { location.replace('#/'); bukaPin(r.hal); return; }
    var panel = r.hal !== 'publik';
    document.body.classList.toggle('panel', panel);
    $('#merekSub').textContent = panel ? 'Panel pengurus' : 'Layanan warga';
    var bp = $('#btnPanel');
    bp.innerHTML = panel ? ik('keluar') + '<span>Keluar</span>' : ik('kunci') + '<span>Pengurus</span>';
    bp.setAttribute('aria-label', panel ? 'Keluar dari panel pengurus' : 'Masuk panel pengurus');
    $('#btnAtur').hidden = !panel; $('#btnAtur').innerHTML = ik('atur');
    if (panel) gambarNav(r.hal);
    var isi = $('#isi');
    isi.innerHTML = '<div class="halaman">' + (panel ? HAL[r.hal](r.arg) : halPublik()) + '</div>';
    stagger(isi);
    tandaiBagian();
    if (bagianSorot) sorot(bagianSorot);
    if (HAL[r.hal + 'Pasca']) HAL[r.hal + 'Pasca'](r.arg);
    hitungNaik(isi);
    if (halSebelum && halSebelum !== r.hal) { window.scrollTo(0, 0); isi.focus({ preventScroll: true }); }
    halSebelum = r.hal;
    document.title = (panel ? MENU.filter(function (m) { return m.id === r.hal; })[0].label + ' · ' : '') + namaUsaha();
  }
  function gambarNav(aktif) {
    var html = MENU.map(function (m) {
      return '<a class="nav-item' + (m.id === 'pengaturan' ? ' nav-pisah pengaturan-nav' : '') + '" href="#/panel/' + m.id + '"' + (m.id === aktif ? ' aria-current="page"' : '') + '>' + ik(m.ikon) + '<span>' + m.label + '</span></a>';
    }).join('');
    $('#navSamping').innerHTML = html;
    $('#navBawah').innerHTML = html;
  }
  function stagger(root) { $$('.stagger', root).forEach(function (g) { Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 14)); }); }); }
  function hitungNaik(root) {
    $$('[data-hitung]', root).forEach(function (el) {
      var target = Number(el.getAttribute('data-hitung')), uang = el.hasAttribute('data-rp');
      var tulis = function (v) { el.textContent = uang ? rp(Math.round(v)) : Math.round(v).toLocaleString('id-ID'); };
      if (RM.matches) { tulis(target); return; }
      var mulai = performance.now(), dur = 900;
      (function langkah(t) { var p = Math.min(1, (t - mulai) / dur); tulis(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(langkah); })(mulai);
    });
  }
  function kepalaHal(judul, sub, aksi) { return '<div class="kepala-hal"><div><h1>' + judul + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (aksi ? '<div class="baris-aksi">' + aksi + '</div>' : '') + '</div>'; }
  function kosong(teks, ikon) { return '<div class="kosong">' + ik(ikon || 'cari') + '<p>' + teks + '</p></div>'; }

  /* ========== 5. Halaman publik ========== */
  function infoDatang() { var h = hariIni(); return D.info.filter(function (i) { return i.jenis === 'agenda' && i.tgl >= h; }).sort(function (a, b) { return (a.tgl + (a.jam || '')).localeCompare(b.tgl + (b.jam || '')); }); }
  function pengumumanUrut() { return D.info.filter(function (i) { return i.jenis === 'pengumuman'; }).sort(function (a, b) { return (b.sematkan ? 1 : 0) - (a.sematkan ? 1 : 0) || b.tgl.localeCompare(a.tgl); }); }
  function kartuInfo(i, aksiPengurus) {
    var d = new Date(i.tgl + 'T00:00');
    return '<article class="kartu info-kartu' + (i.sematkan ? ' sematan' : '') + '">' +
      '<div class="tgl-blok" aria-hidden="true"><b>' + d.getDate() + '</b><small>' + BULAN[d.getMonth()].slice(0, 3) + '</small></div>' +
      '<div style="flex:1;min-width:0"><div class="baris-aksi" style="margin-bottom:4px">' + (i.sematkan ? '<span class="lencana">' + 'Disematkan</span>' : '') + '<span class="lencana ' + (i.jenis === 'agenda' ? 'aksen' : 'netral') + '">' + (i.jenis === 'agenda' ? 'Agenda' : 'Pengumuman') + '</span></div>' +
      '<h3>' + e(i.judul) + '</h3><p>' + e(i.isi) + '</p>' +
      '<div class="info-meta"><span>' + ik('kalender') + tglHari(i.tgl) + '</span>' + (i.jam ? '<span>' + ik('jam') + e(i.jam) + ' WIB</span>' : '') + (i.tempat ? '<span>' + ik('lokasi') + e(i.tempat) + '</span>' : '') + '</div>' +
      '<div class="baris-aksi" style="margin-top:12px"><button class="btn btn-garis btn-kecil" data-bagikan="' + i.id + '">' + ik('bagikan') + 'Bagikan ke WA</button>' +
      (aksiPengurus ? '<button class="btn btn-garis btn-kecil" data-ubah-info="' + i.id + '">' + ik('sunting') + 'Ubah</button><button class="btn btn-hapus btn-kecil" data-hapus-info="' + i.id + '">Hapus</button>' : '') + '</div></div></article>';
  }
  // Ilustrasi lingkungan (SVG orisinal, warna dari token lewat kelas .il-*)
  function ilustrasiKampung() {
    var rumah = function (x, w, h, kelas, atap) {
      var y = 200 - h;
      return '<g class="il-rumah ' + kelas + '"><rect class="dinding" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3"/>' +
        '<path class="atap ' + (atap || '') + '" d="M' + (x - 8) + ' ' + (y + 2) + ' L' + (x + w / 2) + ' ' + (y - w * 0.42) + ' L' + (x + w + 8) + ' ' + (y + 2) + 'Z"/>' +
        '<rect class="pintu" x="' + (x + w / 2 - 9) + '" y="' + (200 - 30) + '" width="18" height="30" rx="9"/>' +
        '<rect class="jendela" x="' + (x + 10) + '" y="' + (y + 14) + '" width="16" height="14" rx="3"/><rect class="jendela" x="' + (x + w - 26) + '" y="' + (y + 14) + '" width="16" height="14" rx="3"/></g>';
    };
    var pohon = function (x, s, d) { return '<g class="il-pohon" style="--d:' + d + 's;transform-origin:' + x + 'px 200px"><rect class="batang-p" x="' + (x - 3) + '" y="' + (200 - 26 * s) + '" width="6" height="' + 26 * s + '" rx="3"/><circle class="daun" cx="' + x + '" cy="' + (200 - 40 * s) + '" r="' + 20 * s + '"/><circle class="daun-2" cx="' + (x + 9 * s) + '" cy="' + (200 - 46 * s) + '" r="' + 11 * s + '"/></g>'; };
    var orang = function (x, kelas, lambai) {
      return '<g class="il-orang ' + kelas + '"><circle class="kepala" cx="' + x + '" cy="160" r="8"/><path class="badan" d="M' + (x - 11) + ' 200 v-20 a11 11 0 0 1 22 0 v20z"/>' +
        (lambai ? '<path class="lengan lambai" style="transform-origin:' + (x + 9) + 'px 178px" d="M' + (x + 9) + ' 178 l12 -16" />' : '<path class="lengan" d="M' + (x - 9) + ' 180 l-6 12"/>') + '</g>';
    };
    var bendera = ''; for (var i = 0; i < 9; i++) { var bx = 30 + i * 46; bendera += '<path class="umbul ' + (i % 2 ? 'putih' : 'merah') + '" style="--i:' + i + '" d="M' + bx + ' ' + (34 + Math.sin(i / 1.4) * 6) + ' l10 16 l10 -16z"/>'; }
    return '<svg class="ilustrasi" viewBox="0 0 440 224" role="img" aria-label="Ilustrasi rumah-rumah warga, pepohonan, dan dua tetangga saling menyapa">' +
      '<circle class="il-matahari" cx="372" cy="58" r="26"/>' +
      '<g class="il-awan"><path d="M70 82a14 14 0 0 1 26-6 11 11 0 0 1 18 9H62a8 8 0 0 1 8-3z"/></g><g class="il-awan dua"><path d="M250 64a12 12 0 0 1 22-5 9 9 0 0 1 15 8h-44a7 7 0 0 1 7-3z"/></g>' +
      '<path class="il-tali" d="M20 30 Q220 70 430 30"/>' + bendera +
      '<path class="il-bukit" d="M0 200 C80 150 160 160 230 176 S380 150 440 168 V224 H0z"/>' +
      pohon(28, 1.1, 0) + rumah(56, 92, 74, 'r1') + rumah(170, 76, 92, 'r2', 'tua') + pohon(268, .9, .6) + rumah(290, 98, 66, 'r3') + pohon(414, 1.2, 1.1) +
      orang(150, 'o1', true) + orang(264, 'o2', true) +
      '<rect class="il-jalan" x="0" y="200" width="440" height="24"/><path class="il-marka" d="M10 213h420"/></svg>';
  }
  function halPublik() {
    var ag = infoDatang(), dekat = ag[0], peng = pengumumanUrut();
    var mundur = '';
    if (dekat) { var sel = Math.round((new Date(dekat.tgl + 'T00:00') - new Date(hariIni() + 'T00:00')) / 864e5); mundur = '<div class="hitung-mundur"><span class="titik"></span><b>' + (sel === 0 ? 'Hari ini' : sel === 1 ? 'Besok' : sel + ' hari lagi') + '</b>' + e(dekat.judul) + '</div>'; }
    var sek = D.pengurus.filter(function (p) { return /sekretaris/i.test(p.jabatan) && p.wa; })[0] || D.pengurus.filter(function (p) { return p.wa; })[0];
    var langkah = [
      { w: 'hijau', ik: 'info', j: 'Baca kabar terbaru', d: peng.length + ' pengumuman di papan warga', a: '#pengumuman', t: 'Buka papan' },
      { w: 'kuning', ik: 'kalender', j: 'Ikut kegiatan', d: ag.length ? ag.length + ' agenda menunggu kehadiran Anda' : 'Belum ada agenda baru', a: '#agenda', t: 'Lihat agenda' },
      { w: 'ungu', ik: 'surat', j: 'Urus surat pengantar', d: 'Kirim nama & keperluan ke Sekretaris', a: sek ? waLink(sek.wa, 'Assalamualaikum ' + sek.jabatan + ' ' + namaRT() + ', saya ingin minta surat pengantar untuk keperluan: ') : '#kontak', t: 'Minta via WA', luar: !!sek },
      { w: 'oranye', ik: 'iuran', j: 'Bayar iuran bulanan', d: rp(D.pengaturan.iuran) + ' per KK tiap bulan, tunai atau transfer', a: '#kontak', t: 'Hubungi Bendahara' }
    ];
    return '<section class="pahlawan">' +
      '<div class="pahlawan-teks"><small>' + e(namaRT()) + ' · Kel. ' + e(D.pengaturan.kelurahan) + '</small>' +
      '<h1>Lingkungan yang guyub dimulai dari <em>satu sapaan.</em></h1>' +
      '<p>Pengumuman, jadwal kegiatan, dan kontak pengurus <span data-tema-nama>' + e(namaUsaha()) + '</span>, semuanya di satu papan.</p>' + mundur +
      '<div class="baris-aksi"><a class="btn" href="#pengumuman">' + ik('info') + 'Lihat pengumuman</a><a class="btn btn-garis" href="#kontak">' + ik('wa') + 'Kontak pengurus</a></div></div>' +
      '<div class="pahlawan-gambar">' + ilustrasiKampung() + '</div></section>' +
      '<section class="langkah-wadah" aria-labelledby="judulLangkah"><div class="judul-baris"><h2 id="judulLangkah">Yang bisa Anda lakukan</h2><span class="judul-sub">4 hal penting untuk warga</span></div>' +
      '<ol class="langkah-grid stagger">' + langkah.map(function (l, i) {
        return '<li class="langkah p-' + l.w + '"><span class="langkah-no">0' + (i + 1) + '</span><span class="langkah-ikon">' + ik(l.ik) + '</span><h3>' + l.j + '</h3><p>' + l.d + '</p>' +
          '<a class="langkah-cta" href="' + l.a + '"' + (l.luar ? ' target="_blank" rel="noopener"' : '') + '>' + l.t + ik('kanan') + '</a></li>';
      }).join('') + '</ol></section>' +
      '<div class="publik-grid">' +
      '<section aria-labelledby="pengumuman"><div class="judul-baris"><h2 id="pengumuman">Papan pengumuman</h2><span class="judul-sub">' + peng.length + ' kabar</span></div><div class="tumpuk stagger">' + (peng.length ? peng.map(function (i) { return kartuInfo(i); }).join('') : kosong('Belum ada pengumuman.', 'info')) + '</div></section>' +
      '<div class="tumpuk"><section aria-labelledby="agenda"><div class="judul-baris"><h2 id="agenda">Agenda terdekat</h2></div><div class="tumpuk stagger">' + (ag.length ? ag.slice(0, 4).map(function (i) { return kartuInfo(i); }).join('') : kosong('Belum ada agenda.', 'kalender')) + '</div></section>' +
      '<section class="kartu" aria-labelledby="kontak"><h2 id="kontak">Kontak pengurus</h2><ul class="daftar stagger">' + D.pengurus.map(function (p) {
        return '<li class="pengurus-kartu"><span class="avatar">' + e(inisial(p.nama)) + '</span><div class="utama-baris"><b>' + e(p.nama) + '</b><small>' + e(p.jabatan) + '</small></div>' + (p.wa ? '<a class="btn btn-wa btn-kecil" target="_blank" rel="noopener" href="' + waLink(p.wa, 'Assalamualaikum ' + p.jabatan + ' ' + namaRT() + ', saya warga ingin bertanya…') + '" aria-label="Chat WhatsApp ' + e(p.nama) + '">' + ik('wa') + 'Chat</a>' : '') + '</li>';
      }).join('') + '</ul><p style="color:var(--redup);font-size:13px;margin:12px 0 0">Sekretariat: ' + e(D.pengaturan.alamat) + '</p></section>' +
      '<section class="kartu warga-kita"><h2>Warga kita</h2><div class="grid" style="grid-template-columns:1fr 1fr"><div class="stat p-hijau"><div class="label">Kepala keluarga</div><div class="nilai" data-hitung="' + D.kk.length + '">0</div></div><div class="stat p-kuning"><div class="label">Jiwa</div><div class="nilai" data-hitung="' + jiwaTotal() + '">0</div></div></div></section>' +
      '</div></div>';
  }

  /* ========== 6. Halaman pengurus ========== */
  // --- Ringkas
  HAL.ringkas = function () {
    var b = bulanKey(), lunas = D.kk.filter(function (k) { return sudahBayar(b, k.id); }).length, pers = D.kk.length ? Math.round(lunas / D.kk.length * 100) : 0;
    var tetap = D.kk.filter(function (k) { return k.status === 'tetap'; }).length;
    var l = 0, p = 0; D.kk.forEach(function (k) { k.anggota.forEach(function (a) { if (a.jk === 'P') p++; else l++; }); });
    var km = kasBulan(b);
    var nunggak = D.kk.map(function (k) { return { k: k, t: tunggakan(k) }; }).filter(function (x) { return x.t.length; }).sort(function (a, c) { return c.t.length - a.t.length; });
    var jam = new Date().getHours(), sapa = jam < 11 ? 'Selamat pagi' : jam < 15 ? 'Selamat siang' : jam < 18 ? 'Selamat sore' : 'Selamat malam';
    var ag = infoDatang().slice(0, 3);
    return '<section class="sapa-kartu"><div><small>' + tglHari(hariIni()) + ' · ' + e(namaRT()) + '</small><h1>' + sapa + ', Pengurus</h1><p>' + (nunggak.length ? nunggak.length + ' KK perlu diingatkan iurannya' : 'Semua iuran lancar') + (ag.length ? ' · agenda berikutnya: ' + e(ag[0].judul) : '') + '.</p></div><div class="baris-aksi"><a class="btn" href="#/panel/warga/baru">' + ik('tambah') + 'Tambah KK</a><a class="btn btn-garis" href="#/panel/info/baru">' + ik('info') + 'Umumkan</a></div></section>' +
      '<div class="grid grid-4 stagger" style="margin-bottom:16px">' +
      '<div class="kartu stat p-hijau"><div class="label"><i>' + ik('warga') + '</i>Kepala keluarga</div><div class="nilai" data-hitung="' + D.kk.length + '">0</div><div class="sub">' + tetap + ' tetap · ' + (D.kk.length - tetap) + ' kontrak</div></div>' +
      '<div class="kartu stat p-kuning"><div class="label"><i>' + ik('jiwa') + '</i>Jumlah jiwa</div><div class="nilai" data-hitung="' + (l + p) + '">0</div><div class="sub">' + l + ' laki-laki · ' + p + ' perempuan</div></div>' +
      '<div class="kartu stat p-oranye"><div class="label"><i class="aksen">' + ik('iuran') + '</i>Iuran ' + BULAN[new Date().getMonth()] + '</div><div class="nilai">' + pers + '%</div><div class="batang" role="progressbar" aria-label="Persentase KK lunas" aria-valuenow="' + pers + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pers + '%"></span></div><div class="sub" style="margin-top:6px">' + lunas + ' dari ' + D.kk.length + ' KK lunas</div></div>' +
      '<div class="kartu stat p-ungu"><div class="label"><i>' + ik('dompet') + '</i>Saldo kas</div><div class="nilai" data-rp data-hitung="' + saldo() + '">0</div><div class="sub"><span class="masuk">+' + rpPendek(km.masuk) + '</span> · <span class="keluar">−' + rpPendek(km.keluar) + '</span> bulan ini</div></div></div>' +
      '<div class="grid grid-2" style="align-items:start">' +
      '<section class="kartu"><h2>Kas 6 bulan terakhir <a class="btn btn-garis btn-kecil" href="#/panel/kas">Detail</a></h2>' + grafikKas(6) + '</section>' +
      '<section class="kartu"><h2>Perlu diingatkan <span class="lencana bahaya">' + nunggak.length + ' KK</span></h2>' + (nunggak.length ? '<ul class="daftar stagger">' + nunggak.slice(0, 5).map(function (x) {
        return '<li><span class="avatar aksen">' + e(inisial(x.k.kepala)) + '</span><div class="utama-baris"><b>' + e(x.k.kepala) + '</b><small>' + x.t.length + ' bulan · ' + rp(x.t.length * D.pengaturan.iuran) + '</small></div><a class="btn btn-wa btn-kecil" target="_blank" rel="noopener" href="' + linkPengingat(x.k) + '" aria-label="Kirim pengingat WA ke ' + e(x.k.kepala) + '">' + ik('wa') + 'Ingatkan</a></li>';
      }).join('') + '</ul>' : kosong('Semua KK lunas. Mantap!', 'cek')) + '</section>' +
      '<section class="kartu"><h2>Agenda terdekat <a class="btn btn-garis btn-kecil" href="#/panel/info">Kelola</a></h2>' + (ag.length ? '<ul class="daftar stagger">' + ag.map(function (i) { var d = new Date(i.tgl + 'T00:00'); return '<li><div class="tgl-blok" aria-hidden="true"><b>' + d.getDate() + '</b><small>' + BULAN[d.getMonth()].slice(0, 3) + '</small></div><div class="utama-baris"><b>' + e(i.judul) + '</b><small>' + HARI[d.getDay()] + (i.jam ? ', ' + e(i.jam) : '') + (i.tempat ? ' · ' + e(i.tempat) : '') + '</small></div></li>'; }).join('') + '</ul>' : kosong('Belum ada agenda.', 'kalender')) + '</section>' +
      '<section class="kartu"><h2>Aksi cepat</h2><div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">' +
      '<a class="btn btn-garis" href="#/panel/iuran">' + ik('iuran') + 'Catat iuran</a><a class="btn btn-garis" href="#/panel/kas/baru">' + ik('kas') + 'Catat kas</a>' +
      '<a class="btn btn-garis" href="#/panel/surat">' + ik('surat') + 'Buat surat</a><a class="btn btn-garis" href="#/panel/info/baru">' + ik('info') + 'Umumkan</a></div></section></div>';
  };
  HAL.ringkasPasca = pasangBagikan;

  function grafikKas(n) {
    var W = 600, H = 230, kiri = 46, bawah = 28, atas = 14, data = [], b = geserBulan(bulanKey(), -(n - 1));
    for (var i = 0; i < n; i++) { var k = kasBulan(b); var akhir = new Date(+b.slice(0, 4), +b.slice(5), 0); data.push({ b: b, m: k.masuk, k: k.keluar, s: saldo(akhir.getFullYear() + '-' + String(akhir.getMonth() + 1).padStart(2, '0') + '-' + String(akhir.getDate()).padStart(2, '0')) }); b = geserBulan(b, 1); }
    var maks = Math.max.apply(null, data.map(function (d) { return Math.max(d.m, d.k, d.s); }).concat([1]));
    var lang = Math.pow(10, Math.floor(Math.log10(maks))); maks = Math.ceil(maks / lang) * lang;
    var lebar = (W - kiri) / n, bw = Math.min(22, lebar / 4), y = function (v) { return atas + (H - atas - bawah) * (1 - v / maks); };
    var s = '<div class="grafik"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Grafik pemasukan, pengeluaran, dan saldo kas ' + n + ' bulan terakhir">';
    for (var g = 0; g <= 4; g++) { var v = maks * g / 4; s += '<line class="grid-garis" x1="' + kiri + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="' + (kiri - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + rpPendek(v) + '</text>'; }
    var titik = [];
    data.forEach(function (d, i) {
      var cx = kiri + lebar * i + lebar / 2;
      s += '<rect class="bar" style="animation-delay:' + i * 70 + 'ms" x="' + (cx - bw - 2) + '" y="' + y(d.m) + '" width="' + bw + '" height="' + (H - bawah - y(d.m)) + '" rx="4" fill="var(--tema-utama)"><title>Masuk ' + namaBulan(d.b) + ': ' + rp(d.m) + '</title></rect>';
      s += '<rect class="bar" style="animation-delay:' + (i * 70 + 35) + 'ms" x="' + (cx + 2) + '" y="' + y(d.k) + '" width="' + bw + '" height="' + (H - bawah - y(d.k)) + '" rx="4" fill="var(--tema-aksen)"><title>Keluar ' + namaBulan(d.b) + ': ' + rp(d.k) + '</title></rect>';
      s += '<text x="' + cx + '" y="' + (H - 8) + '" text-anchor="middle">' + namaBulan(d.b, true).slice(0, 3) + '</text>';
      titik.push(cx + ',' + y(d.s));
    });
    s += '<polyline class="garis-saldo" points="' + titik.join(' ') + '" fill="none" stroke="var(--teks)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    titik.forEach(function (t, i) { var p = t.split(','); s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="var(--permukaan)" stroke="var(--teks)" stroke-width="2"><title>Saldo akhir ' + namaBulan(data[i].b) + ': ' + rp(data[i].s) + '</title></circle>'; });
    return s + '</svg><div class="legenda"><span style="--c:var(--tema-utama)">Pemasukan</span><span style="--c:var(--tema-aksen)">Pengeluaran</span><span style="--c:var(--teks)">Saldo akhir bulan</span></div></div>';
  }

  // --- Warga
  var saringWarga = { q: '', status: 'semua' };
  HAL.warga = function () {
    return kepalaHal('Data warga', D.kk.length + ' KK · ' + jiwaTotal() + ' jiwa', '<button class="btn btn-garis" data-csv="warga">' + ik('unduh') + 'CSV</button><button class="btn" data-kk-baru>' + ik('tambah') + 'Tambah KK</button>') +
      '<div class="alat"><div class="cari">' + ik('cari') + '<label class="sr" for="cariWarga">Cari warga</label><input id="cariWarga" type="search" placeholder="Cari nama, NIK, No. KK, alamat…" value="' + e(saringWarga.q) + '"></div>' +
      '<div class="chip-grup" role="group" aria-label="Saring status">' + ['semua', 'tetap', 'kontrak'].map(function (s) { return '<button class="chip" data-status="' + s + '" aria-pressed="' + (saringWarga.status === s) + '">' + (s === 'semua' ? 'Semua' : s === 'tetap' ? 'Tetap' : 'Kontrak') + '</button>'; }).join('') + '</div></div>' +
      '<div id="daftarWarga"></div>';
  };
  function gambarWarga() {
    var q = saringWarga.q.toLowerCase();
    var hasil = D.kk.filter(function (k) {
      if (saringWarga.status !== 'semua' && k.status !== saringWarga.status) return false;
      if (!q) return true;
      return [k.kepala, k.noKK, k.alamat].concat(k.anggota.map(function (a) { return a.nama + ' ' + a.nik; })).join(' ').toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return a.alamat.localeCompare(b.alamat, 'id', { numeric: true }); });
    $('#daftarWarga').innerHTML = hasil.length ? '<div class="kk-grid stagger">' + hasil.map(function (k) {
      var t = tunggakan(k).length;
      return '<button class="kartu kk-kartu" data-kk="' + k.id + '" aria-label="Detail KK ' + e(k.kepala) + '"><div class="atas-kk"><span class="avatar' + (k.status === 'kontrak' ? ' aksen' : '') + '">' + e(inisial(k.kepala)) + '</span><div class="utama-baris" style="min-width:0;flex:1"><b style="display:block">' + e(k.kepala) + '</b><small class="mono" style="color:var(--redup)">KK ' + e(k.noKK) + '</small></div></div>' +
        '<div class="meta"><span class="lencana ' + (k.status === 'kontrak' ? 'aksen' : '') + '">' + (k.status === 'kontrak' ? 'Kontrak' : 'Tetap') + '</span><span class="lencana netral">' + k.anggota.length + ' jiwa</span>' + (t ? '<span class="lencana bahaya">Nunggak ' + t + ' bln</span>' : '') + '</div><div class="meta">' + ik('lokasi').replace('<svg', '<svg width="14" height="14" style="fill:none;stroke:currentColor;stroke-width:2"') + e(k.alamat) + '</div></button>';
    }).join('') + '</div>' : kosong(q ? 'Tidak ada warga yang cocok dengan "' + e(saringWarga.q) + '".' : 'Belum ada data KK. Klik "Tambah KK" untuk mulai.', 'warga');
    stagger($('#daftarWarga'));
  }
  HAL.wargaPasca = function (arg) {
    gambarWarga();
    $('#cariWarga').addEventListener('input', function () { saringWarga.q = this.value; gambarWarga(); });
    $$('[data-status]').forEach(function (b) { b.addEventListener('click', function () { saringWarga.status = b.dataset.status; $$('[data-status]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); gambarWarga(); }); });
    $('#daftarWarga').addEventListener('click', function (ev) { var b = ev.target.closest('[data-kk]'); if (b) detailKK(b.dataset.kk); });
    $('[data-kk-baru]').addEventListener('click', function () { formKK(); });
    if (arg === 'baru') { history.replaceState(null, '', '#/panel/warga'); formKK(); }
  };
  function detailKK(id) {
    var k = cariKK(id), t = tunggakan(k);
    modal('<div class="modal-kepala"><div><h2 id="modalJudul">' + e(k.kepala) + '</h2><p style="margin:4px 0 0;color:var(--redup)"><span class="mono">KK ' + e(k.noKK) + '</span> · ' + e(k.alamat) + '</p></div><button class="ikon-btn" data-tutup aria-label="Tutup">' + ik('tutup') + '</button></div>' +
      '<div class="baris-aksi" style="margin-bottom:14px"><span class="lencana ' + (k.status === 'kontrak' ? 'aksen' : '') + '">' + (k.status === 'kontrak' ? 'Kontrak' : 'Tetap') + '</span><span class="lencana netral">' + k.anggota.length + ' jiwa</span>' + (t.length ? '<span class="lencana bahaya">Tunggakan ' + t.length + ' bln · ' + rp(t.length * D.pengaturan.iuran) + '</span>' : '<span class="lencana">Iuran lancar</span>') + '</div>' +
      '<div class="tabel-wadah"><table><thead><tr><th>Nama</th><th>Hubungan</th><th>NIK</th><th>L/P</th><th class="angka">Umur</th><th>Pekerjaan</th></tr></thead><tbody>' + k.anggota.map(function (a) { return '<tr><td><b>' + e(a.nama) + '</b></td><td>' + e(a.hubungan) + '</td><td class="mono">' + e(a.nik) + '</td><td>' + e(a.jk) + '</td><td class="angka">' + umur(a.tglLahir) + '</td><td>' + e(a.pekerjaan) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<div class="modal-kaki"><button class="btn btn-hapus kiri" data-hapus>Hapus KK</button>' + (k.wa ? '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + (t.length ? linkPengingat(k) : waLink(k.wa, 'Halo ' + hormat(k.anggota[0]) + ', ')) + '">' + ik('wa') + (t.length ? 'Ingatkan iuran' : 'Chat') + '</a>' : '') + '<button class="btn" data-ubah>' + ik('sunting') + 'Ubah</button></div>', function (m) {
      $('[data-ubah]', m).addEventListener('click', function () { tutupModal(function () { formKK(k); }); });
      $('[data-hapus]', m).addEventListener('click', function () {
        konfirmasi('Hapus KK ' + k.kepala + '?', 'Data anggota dan riwayat iurannya ikut terhapus. Transaksi kas tetap tersimpan.', 'Hapus', function () {
          D.kk = D.kk.filter(function (x) { return x !== k; }); Object.keys(D.iuran).forEach(function (b) { delete D.iuran[b][k.id]; }); simpan(); render(); toast('KK ' + k.kepala + ' dihapus');
        });
      });
    });
  }
  var HUB = ['Kepala Keluarga', 'Istri', 'Suami', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Lainnya'];
  var AGAMA = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
  var KAWIN = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
  function opsi(arr, nilai) { return arr.map(function (x) { return '<option' + (x === nilai ? ' selected' : '') + '>' + e(x) + '</option>'; }).join(''); }
  function barisAnggota(a, i) {
    a = a || { jk: 'L', hubungan: i === 0 ? 'Kepala Keluarga' : 'Anak', agama: 'Islam', kawin: i === 0 ? 'Kawin' : 'Belum Kawin' };
    var p = 'a' + i + '-' + Math.random().toString(36).slice(2, 6);
    return '<div class="anggota-baris" data-anggota><div class="kepala-baris"><span>' + (i === 0 ? 'Kepala keluarga' : 'Anggota') + '</span>' + (i === 0 ? '' : '<button type="button" class="btn btn-hapus btn-kecil" data-hapus-anggota>Hapus</button>') + '</div><div class="form-grid">' +
      bid(p + 'n', 'Nama lengkap', '<input id="' + p + 'n" name="nama" required autocomplete="off" value="' + e(a.nama) + '">') +
      bid(p + 'k', 'NIK', '<input id="' + p + 'k" name="nik" inputmode="numeric" pattern="\\d{16}" maxlength="16" title="NIK 16 angka" value="' + e(a.nik) + '">') +
      bid(p + 'h', 'Hubungan', '<select id="' + p + 'h" name="hubungan">' + opsi(HUB, a.hubungan) + '</select>') +
      bid(p + 'j', 'Jenis kelamin', '<select id="' + p + 'j" name="jk"><option value="L"' + (a.jk === 'L' ? ' selected' : '') + '>Laki-laki</option><option value="P"' + (a.jk === 'P' ? ' selected' : '') + '>Perempuan</option></select>') +
      bid(p + 't', 'Tempat lahir', '<input id="' + p + 't" name="tempatLahir" value="' + e(a.tempatLahir) + '">') +
      bid(p + 'd', 'Tanggal lahir', '<input id="' + p + 'd" name="tglLahir" type="date" value="' + e(a.tglLahir) + '">') +
      bid(p + 'g', 'Agama', '<select id="' + p + 'g" name="agama">' + opsi(AGAMA, a.agama) + '</select>') +
      bid(p + 'w', 'Status kawin', '<select id="' + p + 'w" name="kawin">' + opsi(KAWIN, a.kawin) + '</select>') +
      bid(p + 'p', 'Pekerjaan', '<input id="' + p + 'p" name="pekerjaan" value="' + e(a.pekerjaan) + '">') + '</div></div>';
  }
  function bid(id, label, kontrol, bantuan) { return '<div class="bidang"><label for="' + id + '">' + label + '</label>' + kontrol + (bantuan ? '<small>' + bantuan + '</small>' : '') + '</div>'; }
  function formKK(k) {
    var baru = !k; k = k || { status: 'tetap', anggota: [] };
    var ang = k.anggota.length ? k.anggota : [null];
    modal('<form id="fKK" novalidate><div class="modal-kepala"><h2 id="modalJudul">' + (baru ? 'Tambah KK' : 'Ubah KK') + '</h2><button type="button" class="ikon-btn" data-tutup aria-label="Tutup">' + ik('tutup') + '</button></div>' +
      '<div class="form-grid">' + bid('fNoKK', 'No. KK', '<input id="fNoKK" name="noKK" inputmode="numeric" maxlength="16" value="' + e(k.noKK) + '">', '16 angka sesuai kartu keluarga') +
      bid('fAlamat', 'Alamat / blok', '<input id="fAlamat" name="alamat" required value="' + e(k.alamat) + '" placeholder="Blok A No. 1">') +
      bid('fStatus', 'Status tinggal', '<select id="fStatus" name="status"><option value="tetap"' + (k.status === 'tetap' ? ' selected' : '') + '>Tetap</option><option value="kontrak"' + (k.status === 'kontrak' ? ' selected' : '') + '>Kontrak / kos</option></select>') +
      bid('fWA', 'No. WhatsApp', '<input id="fWA" name="wa" inputmode="tel" value="' + e(k.wa) + '" placeholder="0812…">') + '</div>' +
      '<h3 style="font-size:15px;margin:6px 0 10px">Anggota keluarga</h3><div id="wadahAnggota">' + ang.map(barisAnggota).join('') + '</div>' +
      '<button type="button" class="btn btn-garis btn-kecil" id="tambahAnggota">' + ik('tambah') + 'Tambah anggota</button>' +
      '<p id="galatKK" role="alert" style="color:var(--bahaya);font-weight:600;margin:12px 0 0"></p>' +
      '<div class="modal-kaki"><button type="button" class="btn btn-garis" data-tutup>Batal</button><button class="btn" type="submit">' + ik('cek') + 'Simpan</button></div></form>', function (m) {
      var wadah = $('#wadahAnggota', m);
      $('#tambahAnggota', m).addEventListener('click', function () { wadah.insertAdjacentHTML('beforeend', barisAnggota(null, wadah.children.length)); $('input', wadah.lastElementChild).focus(); });
      wadah.addEventListener('click', function (ev) { if (ev.target.closest('[data-hapus-anggota]')) ev.target.closest('[data-anggota]').remove(); });
      $('#fKK', m).addEventListener('submit', function (ev) {
        ev.preventDefault();
        var f = ev.target, galat = '';
        var anggota = $$('[data-anggota]', f).map(function (b) { var o = {}; $$('input,select', b).forEach(function (x) { o[x.name] = x.value.trim(); }); return o; }).filter(function (a) { return a.nama; });
        if (!f.alamat.value.trim()) galat = 'Alamat wajib diisi.';
        else if (!anggota.length) galat = 'Isi minimal nama kepala keluarga.';
        else if (f.noKK.value && !/^\d{16}$/.test(f.noKK.value)) galat = 'No. KK harus 16 angka.';
        else if (anggota.some(function (a) { return a.nik && !/^\d{16}$/.test(a.nik); })) galat = 'NIK harus 16 angka (atau kosongkan dulu).';
        $('#galatKK', f).textContent = galat;
        if (galat) { var p = $('#galatKK', f); p.classList.remove('cap'); void p.offsetWidth; p.classList.add('cap'); return; }
        var data = { noKK: f.noKK.value.trim(), alamat: f.alamat.value.trim(), status: f.status.value, wa: f.wa.value.trim(), anggota: anggota, kepala: anggota[0].nama };
        if (baru) { data.id = idBaru('kk'); data.dibuat = hariIni(); D.kk.push(data); } else Object.assign(k, data);
        simpan(); tutupModal(); render(); toast(baru ? 'KK ' + data.kepala + ' ditambahkan' : 'Perubahan disimpan');
      });
    });
  }

  // --- Iuran
  var iuranBulan = bulanKey(), iuranSaring = 'semua', iuranTab = 'bulan';
  HAL.iuran = function () {
    return kepalaHal('Iuran bulanan', 'Rp' + Number(D.pengaturan.iuran).toLocaleString('id-ID') + ' per KK per bulan', '<div class="chip-grup" role="tablist" aria-label="Tampilan iuran"><button class="chip" role="tab" data-tab="bulan" aria-selected="' + (iuranTab === 'bulan') + '" aria-pressed="' + (iuranTab === 'bulan') + '">Per bulan</button><button class="chip" role="tab" data-tab="rekap" aria-selected="' + (iuranTab === 'rekap') + '" aria-pressed="' + (iuranTab === 'rekap') + '">Rekap</button></div>') + '<div id="isiIuran"></div>';
  };
  function gambarIuran() {
    var w = $('#isiIuran'); if (!w) return;
    if (iuranTab === 'rekap') return gambarRekap(w);
    var b = iuranBulan, lunas = D.kk.filter(function (k) { return sudahBayar(b, k.id); }), pers = D.kk.length ? Math.round(lunas.length / D.kk.length * 100) : 0;
    var daftar = D.kk.filter(function (k) { var l = sudahBayar(b, k.id); return iuranSaring === 'semua' || (iuranSaring === 'lunas' ? l : !l); }).sort(function (a, c) { return a.alamat.localeCompare(c.alamat, 'id', { numeric: true }); });
    w.innerHTML = '<div class="kartu" style="margin-bottom:16px"><div class="ringkas-iuran"><div class="cincin" style="--p:' + pers + '" data-label="' + pers + '%" role="img" aria-label="' + pers + ' persen lunas"></div><div style="flex:1;min-width:180px">' +
      '<div class="bulan-nav"><button class="btn btn-garis btn-ikon" data-geser="-1" aria-label="Bulan sebelumnya">' + ik('kiri') + '</button><b aria-live="polite">' + namaBulan(b) + '</b><button class="btn btn-garis btn-ikon" data-geser="1" aria-label="Bulan berikutnya"' + (b >= bulanKey() ? ' disabled' : '') + '>' + ik('kanan') + '</button></div>' +
      '<p style="margin:10px 0 0;color:var(--redup)">Terkumpul <b style="color:var(--teks)">' + rp(lunas.length * D.pengaturan.iuran) + '</b> dari ' + rp(D.kk.length * D.pengaturan.iuran) + ' · ' + lunas.length + '/' + D.kk.length + ' KK</p></div>' +
      '<div class="baris-aksi"><button class="btn btn-garis" id="salinRekapWA">' + ik('bagikan') + 'Salin daftar belum bayar</button></div></div></div>' +
      '<div class="alat"><div class="chip-grup" role="group" aria-label="Saring status bayar">' + [['semua', 'Semua'], ['belum', 'Belum bayar'], ['lunas', 'Lunas']].map(function (s) { return '<button class="chip" data-saring="' + s[0] + '" aria-pressed="' + (iuranSaring === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="kartu" style="padding:6px 18px">' + (daftar.length ? '<ul class="daftar stagger">' + daftar.map(function (k) {
        var l = sudahBayar(b, k.id), t = tunggakan(k);
        return '<li><span class="avatar' + (l ? '' : ' aksen') + '">' + e(inisial(k.kepala)) + '</span><div class="utama-baris"><b>' + e(k.kepala) + '</b><small>' + e(k.alamat) + (l ? ' · dibayar ' + tglPanjang(D.iuran[b][k.id]) : t.length > 1 ? ' · <span class="keluar">nunggak ' + t.length + ' bln</span>' : '') + '</small></div>' +
          (!l && k.wa ? '<a class="btn btn-wa btn-kecil btn-ikon" target="_blank" rel="noopener" href="' + linkPengingat(k) + '" aria-label="Kirim pengingat WA ke ' + e(k.kepala) + '" title="Kirim pengingat WA">' + ik('wa') + '</a>' : '') +
          '<button class="btn btn-garis btn-kecil tombol-lunas" data-lunas="' + k.id + '" aria-pressed="' + l + '" aria-label="' + (l ? 'Batalkan lunas ' : 'Tandai lunas ') + e(k.kepala) + '">' + (l ? ik('cek') + 'Lunas' : 'Tandai lunas') + '</button></li>';
      }).join('') + '</ul>' : kosong(iuranSaring === 'belum' ? 'Semua KK sudah bayar bulan ini.' : 'Tidak ada data.', 'cek')) + '</div>';
    stagger(w);
  }
  function gambarRekap(w) {
    var bln = bulanTagihan().slice(-6);
    w.innerHTML = '<div class="alat"><p style="margin:0;color:var(--redup);flex:1">Rekap ' + bln.length + ' bulan terakhir. ✓ = lunas.</p><button class="btn btn-garis" data-csv="iuran">' + ik('unduh') + 'Ekspor CSV</button></div>' +
      '<div class="tabel-wadah"><table><thead><tr><th>Kepala keluarga</th>' + bln.map(function (b) { return '<th class="angka">' + namaBulan(b, true) + '</th>'; }).join('') + '<th class="angka">Tunggakan</th></tr></thead><tbody>' +
      D.kk.map(function (k) { var t = tunggakan(k); return '<tr><td><b>' + e(k.kepala) + '</b><br><small style="color:var(--redup)">' + e(k.alamat) + '</small></td>' + bln.map(function (b) { var l = sudahBayar(b, k.id); return '<td class="' + (l ? 'sel-lunas' : 'sel-belum') + '"><span aria-hidden="true">' + (l ? '✓' : '–') + '</span><span class="sr">' + (l ? 'lunas' : 'belum') + '</span></td>'; }).join('') + '<td class="angka ' + (t.length ? 'keluar' : '') + '">' + (t.length ? rp(t.length * D.pengaturan.iuran) : '–') + '</td></tr>'; }).join('') +
      '</tbody><tfoot><tr><th>Terkumpul</th>' + bln.map(function (b) { return '<th class="angka">' + rpPendek(D.kk.filter(function (k) { return sudahBayar(b, k.id); }).length * D.pengaturan.iuran) + '</th>'; }).join('') + '<th></th></tr></tfoot></table></div>';
  }
  HAL.iuranPasca = function () {
    gambarIuran();
    $$('[data-tab]').forEach(function (t) { t.addEventListener('click', function () { iuranTab = t.dataset.tab; $$('[data-tab]').forEach(function (x) { x.setAttribute('aria-selected', x === t); x.setAttribute('aria-pressed', x === t); }); gambarIuran(); }); });
    $('#isiIuran').addEventListener('click', function (ev) {
      var g = ev.target.closest('[data-geser]'), s = ev.target.closest('[data-saring]'), l = ev.target.closest('[data-lunas]');
      if (g) { iuranBulan = geserBulan(iuranBulan, +g.dataset.geser); gambarIuran(); }
      if (s) { iuranSaring = s.dataset.saring; gambarIuran(); }
      if (ev.target.closest('#salinRekapWA')) salinBelumBayar();
      if (l) {
        var id = l.dataset.lunas, jadi = !sudahBayar(iuranBulan, id), k = cariKK(id);
        setLunas(iuranBulan, id, jadi); gambarIuran();
        var tb = $('[data-lunas="' + id + '"]'); if (tb) { tb.classList.add('cap'); tb.focus(); }
        toast(jadi ? k.kepala + ' lunas ' + namaBulan(iuranBulan) + ' · masuk kas' : 'Status lunas ' + k.kepala + ' dibatalkan');
      }
    });
  };
  function teksPengingat(k) {
    var t = tunggakan(k), kep = k.anggota[0] || { nama: k.kepala };
    return 'Assalamualaikum ' + hormat(kep) + ' 🙏\n\nIzin mengingatkan iuran warga *' + namaRT() + '*:\n' + t.map(function (b) { return '• ' + namaBulan(b) + ' — ' + rp(D.pengaturan.iuran); }).join('\n') +
      '\n\n*Total: ' + rp(t.length * D.pengaturan.iuran) + '*\n\nPembayaran: ' + D.pengaturan.caraBayar + '\n\nAbaikan pesan ini bila sudah membayar. Terima kasih atas partisipasinya.\n— Bendahara ' + namaRT();
  }
  function linkPengingat(k) { return waLink(k.wa, teksPengingat(k)); }
  function salinBelumBayar() {
    var b = iuranBulan, belum = D.kk.filter(function (k) { return !sudahBayar(b, k.id); });
    var teks = '*Iuran ' + namaRT() + ' — ' + namaBulan(b) + '*\nYang belum tercatat bayar (' + belum.length + ' KK):\n' + belum.map(function (k, i) { return (i + 1) + '. ' + k.kepala + ' (' + k.alamat + ')'; }).join('\n') + '\n\nIuran ' + rp(D.pengaturan.iuran) + '. ' + D.pengaturan.caraBayar + '\nTerima kasih 🙏';
    salin(teks, 'Daftar disalin. Tempel di grup WA warga.');
  }

  // --- Kas
  var kasSaring = 'semua';
  HAL.kas = function () {
    var b = bulanKey(), km = kasBulan(b);
    return kepalaHal('Kas RT', 'Saldo per hari ini', '<button class="btn btn-garis" data-csv="kas">' + ik('unduh') + 'CSV</button><button class="btn" data-kas-baru>' + ik('tambah') + 'Catat transaksi</button>') +
      '<div class="grid grid-4 stagger" style="margin-bottom:16px"><div class="kartu stat"><div class="label"><i>' + ik('dompet') + '</i>Saldo</div><div class="nilai" data-rp data-hitung="' + saldo() + '">0</div></div>' +
      '<div class="kartu stat"><div class="label"><i>' + ik('unduh') + '</i>Masuk ' + BULAN[new Date().getMonth()] + '</div><div class="nilai masuk" data-rp data-hitung="' + km.masuk + '">0</div></div>' +
      '<div class="kartu stat"><div class="label"><i class="aksen">' + ik('unggah') + '</i>Keluar ' + BULAN[new Date().getMonth()] + '</div><div class="nilai keluar" data-rp data-hitung="' + km.keluar + '">0</div></div></div>' +
      '<section class="kartu" style="margin-bottom:16px"><h2>Arus kas 6 bulan</h2>' + grafikKas(6) + '</section>' +
      '<div class="alat"><div class="chip-grup" role="group" aria-label="Saring jenis">' + [['semua', 'Semua'], ['masuk', 'Pemasukan'], ['keluar', 'Pengeluaran']].map(function (s) { return '<button class="chip" data-kas-saring="' + s[0] + '" aria-pressed="' + (kasSaring === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div></div><div id="daftarKas"></div>';
  };
  function gambarKas() {
    var d = D.kas.filter(function (x) { return kasSaring === 'semua' || x.jenis === kasSaring; }).sort(function (a, b) { return b.tgl.localeCompare(a.tgl); }).slice(0, 80);
    $('#daftarKas').innerHTML = d.length ? '<div class="tabel-wadah"><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="angka">Jumlah</th><th><span class="sr">Aksi</span></th></tr></thead><tbody>' + d.map(function (x) {
      return '<tr><td>' + tglPanjang(x.tgl) + '</td><td style="white-space:normal;min-width:180px">' + e(x.ket) + '</td><td><span class="lencana ' + (x.jenis === 'masuk' ? '' : 'aksen') + '">' + e(x.kategori) + '</span></td><td class="angka ' + x.jenis + '"><b>' + (x.jenis === 'masuk' ? '+' : '−') + rp(x.jumlah) + '</b></td><td>' + (x.ref ? '<small style="color:var(--redup)">otomatis</small>' : '<button class="btn btn-garis btn-kecil btn-ikon" data-ubah-kas="' + x.id + '" aria-label="Ubah transaksi ' + e(x.ket) + '">' + ik('sunting') + '</button>') + '</td></tr>';
    }).join('') + '</tbody></table></div>' + (D.kas.length > 80 ? '<p style="color:var(--redup);font-size:13px">Menampilkan 80 transaksi terbaru. Ekspor CSV untuk melihat semua.</p>' : '') : kosong('Belum ada transaksi.', 'kas');
  }
  HAL.kasPasca = function (arg) {
    gambarKas();
    $$('[data-kas-saring]').forEach(function (b) { b.addEventListener('click', function () { kasSaring = b.dataset.kasSaring; $$('[data-kas-saring]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); gambarKas(); }); });
    $('[data-kas-baru]').addEventListener('click', function () { formKas(); });
    $('#daftarKas').addEventListener('click', function (ev) { var b = ev.target.closest('[data-ubah-kas]'); if (b) formKas(D.kas.filter(function (x) { return x.id === b.dataset.ubahKas; })[0]); });
    if (arg === 'baru') { history.replaceState(null, '', '#/panel/kas'); formKas(); }
  };
  var KATEGORI = { masuk: ['Iuran', 'Donasi', 'Sewa fasilitas', 'Saldo awal', 'Lainnya'], keluar: ['Kebersihan', 'Keamanan', 'Listrik', 'Perbaikan', 'Sosial', 'Kegiatan', 'Administrasi', 'Lainnya'] };
  function formKas(x) {
    var baru = !x; x = x || { jenis: 'keluar', tgl: hariIni(), kategori: 'Kebersihan' };
    modal('<form id="fKas"><div class="modal-kepala"><h2 id="modalJudul">' + (baru ? 'Catat transaksi' : 'Ubah transaksi') + '</h2><button type="button" class="ikon-btn" data-tutup aria-label="Tutup">' + ik('tutup') + '</button></div>' +
      '<div class="chip-grup" role="radiogroup" aria-label="Jenis transaksi" style="margin-bottom:14px">' + ['masuk', 'keluar'].map(function (j) { return '<button type="button" class="chip" data-jenis="' + j + '" role="radio" aria-checked="' + (x.jenis === j) + '" aria-pressed="' + (x.jenis === j) + '">' + (j === 'masuk' ? 'Pemasukan' : 'Pengeluaran') + '</button>'; }).join('') + '</div>' +
      '<div class="form-grid">' + bid('kJml', 'Jumlah (Rp)', '<input id="kJml" name="jumlah" inputmode="numeric" required value="' + (x.jumlah ? Number(x.jumlah).toLocaleString('id-ID') : '') + '" placeholder="50.000">') +
      bid('kTgl', 'Tanggal', '<input id="kTgl" name="tgl" type="date" required value="' + e(x.tgl) + '">') +
      bid('kKat', 'Kategori', '<select id="kKat" name="kategori"></select>') + '</div>' +
      bid('kKet', 'Keterangan', '<input id="kKet" name="ket" required value="' + e(x.ket) + '" placeholder="mis. Honor petugas sampah">') +
      '<p id="galatKas" role="alert" style="color:var(--bahaya);font-weight:600;margin:0"></p>' +
      '<div class="modal-kaki">' + (baru ? '' : '<button type="button" class="btn btn-hapus kiri" data-hapus>Hapus</button>') + '<button type="button" class="btn btn-garis" data-tutup>Batal</button><button class="btn" type="submit">' + ik('cek') + 'Simpan</button></div></form>', function (m) {
      var jenis = x.jenis, sel = $('#kKat', m);
      function isiKat() { sel.innerHTML = opsi(KATEGORI[jenis], x.kategori); }
      isiKat();
      $$('[data-jenis]', m).forEach(function (b) { b.addEventListener('click', function () { jenis = b.dataset.jenis; $$('[data-jenis]', m).forEach(function (y) { y.setAttribute('aria-checked', y === b); y.setAttribute('aria-pressed', y === b); }); isiKat(); }); });
      var jml = $('#kJml', m);
      jml.addEventListener('input', function () { var v = this.value.replace(/\D/g, ''); this.value = v ? Number(v).toLocaleString('id-ID') : ''; });
      if (!baru) $('[data-hapus]', m).addEventListener('click', function () { D.kas = D.kas.filter(function (y) { return y !== x; }); simpan(); tutupModal(); render(); toast('Transaksi dihapus'); });
      $('#fKas', m).addEventListener('submit', function (ev) {
        ev.preventDefault(); var f = ev.target, n = Number(f.jumlah.value.replace(/\D/g, ''));
        if (!n) { $('#galatKas', m).textContent = 'Jumlah harus lebih dari 0.'; jml.focus(); return; }
        if (!f.ket.value.trim()) { $('#galatKas', m).textContent = 'Keterangan wajib diisi.'; f.ket.focus(); return; }
        var data = { jenis: jenis, jumlah: n, tgl: f.tgl.value || hariIni(), kategori: f.kategori.value, ket: f.ket.value.trim() };
        if (baru) { data.id = idBaru('ks'); D.kas.push(data); } else Object.assign(x, data);
        simpan(); tutupModal(); render(); toast((jenis === 'masuk' ? 'Pemasukan ' : 'Pengeluaran ') + rp(n) + ' dicatat');
      });
    });
  }

  // --- Info (pengumuman & agenda)
  HAL.info = function () {
    var peng = pengumumanUrut(), ag = D.info.filter(function (i) { return i.jenis === 'agenda'; }).sort(function (a, b) { var h = hariIni(), ka = a.tgl + (a.jam || ''), kb = b.tgl + (b.jam || ''), la = a.tgl < h, lb = b.tgl < h; return la !== lb ? (la ? 1 : -1) : la ? kb.localeCompare(ka) : ka.localeCompare(kb); });
    return kepalaHal('Pengumuman & agenda', 'Tampil di halaman publik warga', '<a class="btn btn-garis" href="#/" target="_blank" rel="noopener">Lihat halaman publik</a><button class="btn" data-info-baru>' + ik('tambah') + 'Buat baru</button>') +
      '<div class="grid grid-2" style="align-items:start"><section><h2 style="font-size:18px;margin-bottom:12px">Pengumuman</h2><div class="tumpuk stagger">' + (peng.length ? peng.map(function (i) { return kartuInfo(i, true); }).join('') : kosong('Belum ada pengumuman.', 'info')) + '</div></section>' +
      '<section><h2 style="font-size:18px;margin-bottom:12px">Agenda</h2><div class="tumpuk stagger">' + (ag.length ? ag.map(function (i) { return kartuInfo(i, true); }).join('') : kosong('Belum ada agenda.', 'kalender')) + '</div></section></div>';
  };
  HAL.infoPasca = function (arg) {
    pasangBagikan();
    $('[data-info-baru]').addEventListener('click', function () { formInfo(); });
    $('#isi').addEventListener('click', infoKlik);
    if (arg === 'baru') { history.replaceState(null, '', '#/panel/info'); formInfo(); }
  };
  function infoKlik(ev) {
    var u = ev.target.closest('[data-ubah-info]'), h = ev.target.closest('[data-hapus-info]');
    if (u) formInfo(D.info.filter(function (i) { return i.id === u.dataset.ubahInfo; })[0]);
    if (h) { var i = D.info.filter(function (x) { return x.id === h.dataset.hapusInfo; })[0]; konfirmasi('Hapus "' + i.judul + '"?', 'Informasi ini akan hilang dari halaman publik.', 'Hapus', function () { D.info = D.info.filter(function (x) { return x !== i; }); simpan(); render(); toast('Dihapus'); }); }
  }
  function teksBagikan(i) {
    return '📢 *' + i.judul + '*\n' + namaRT() + ' · Kel. ' + D.pengaturan.kelurahan + '\n\n' + i.isi + '\n\n🗓️ ' + tglHari(i.tgl) + (i.jam ? '\n⏰ ' + i.jam + ' WIB' : '') + (i.tempat ? '\n📍 ' + i.tempat : '') + '\n\nTerima kasih. — Pengurus ' + namaRT();
  }
  function pasangBagikan() {
    $$('[data-bagikan]').forEach(function (b) { b.addEventListener('click', function () { var i = D.info.filter(function (x) { return x.id === b.dataset.bagikan; })[0]; window.open('https://wa.me/?text=' + encodeURIComponent(teksBagikan(i)), '_blank', 'noopener'); }); });
  }
  function formInfo(i) {
    var baru = !i; i = i || { jenis: 'pengumuman', tgl: hariIni() };
    modal('<form id="fInfo"><div class="modal-kepala"><h2 id="modalJudul">' + (baru ? 'Buat pengumuman / agenda' : 'Ubah informasi') + '</h2><button type="button" class="ikon-btn" data-tutup aria-label="Tutup">' + ik('tutup') + '</button></div>' +
      '<div class="form-grid">' + bid('iJenis', 'Jenis', '<select id="iJenis" name="jenis"><option value="pengumuman"' + (i.jenis === 'pengumuman' ? ' selected' : '') + '>Pengumuman</option><option value="agenda"' + (i.jenis === 'agenda' ? ' selected' : '') + '>Agenda / kegiatan</option></select>') +
      bid('iTgl', 'Tanggal', '<input id="iTgl" type="date" name="tgl" required value="' + e(i.tgl) + '">') + '</div>' +
      bid('iJudul', 'Judul', '<input id="iJudul" name="judul" required maxlength="90" value="' + e(i.judul) + '">') +
      bid('iIsi', 'Isi', '<textarea id="iIsi" name="isi" required>' + e(i.isi) + '</textarea>') +
      '<div class="form-grid">' + bid('iJam', 'Jam (opsional)', '<input id="iJam" type="time" name="jam" value="' + e(i.jam) + '">') + bid('iTempat', 'Tempat (opsional)', '<input id="iTempat" name="tempat" value="' + e(i.tempat) + '">') + '</div>' +
      '<label style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" name="sematkan" style="width:20px;min-height:20px"' + (i.sematkan ? ' checked' : '') + '> Sematkan di paling atas</label>' +
      '<div class="modal-kaki"><button type="button" class="btn btn-garis" data-tutup>Batal</button><button class="btn" type="submit">' + ik('cek') + 'Simpan</button></div></form>', function (m) {
      $('#fInfo', m).addEventListener('submit', function (ev) {
        ev.preventDefault(); var f = ev.target;
        if (!f.judul.value.trim() || !f.isi.value.trim()) { (f.judul.value.trim() ? f.isi : f.judul).focus(); toast('Judul dan isi wajib diisi', 'bahaya'); return; }
        var data = { jenis: f.jenis.value, tgl: f.tgl.value || hariIni(), judul: f.judul.value.trim(), isi: f.isi.value.trim(), jam: f.jam.value, tempat: f.tempat.value.trim(), sematkan: f.sematkan.checked };
        if (baru) { data.id = idBaru('in'); D.info.push(data); } else Object.assign(i, data);
        simpan(); tutupModal(); render(); toast('Tersimpan & tampil di halaman publik');
      });
    });
  }

  // --- Surat pengantar
  var KEPERLUAN = ['Pembuatan / perpanjangan KTP', 'Pembuatan / perubahan KK', 'Pengurusan SKCK', 'Surat keterangan domisili', 'Surat keterangan tidak mampu (SKTM)', 'Pengantar nikah', 'Pindah domisili', 'Pengurusan akta kelahiran', 'Lainnya'];
  function semuaOrang() { var o = []; D.kk.forEach(function (k) { k.anggota.forEach(function (a, j) { o.push({ kk: k, a: a, kunci: k.id + ':' + j }); }); }); return o; }
  HAL.surat = function () {
    var org = semuaOrang();
    return kepalaHal('Surat pengantar', 'Nomor otomatis · siap cetak A4 dengan kop RT') +
      '<div class="grid grid-2" style="align-items:start"><form class="kartu" id="fSurat"><h2>Buat surat</h2>' +
      bid('sWarga', 'Pilih warga', '<select id="sWarga"><option value="">— ketik/isi manual —</option>' + org.map(function (o) { return '<option value="' + o.kunci + '">' + e(o.a.nama) + ' · ' + e(o.kk.alamat) + '</option>'; }).join('') + '</select>', 'Data terisi otomatis dari data warga') +
      '<div class="form-grid">' + bid('sNama', 'Nama', '<input id="sNama" name="nama" required>') + bid('sNik', 'NIK', '<input id="sNik" name="nik" inputmode="numeric" maxlength="16">') +
      bid('sTempat', 'Tempat lahir', '<input id="sTempat" name="tempatLahir">') + bid('sTgl', 'Tanggal lahir', '<input id="sTgl" type="date" name="tglLahir">') +
      bid('sJk', 'Jenis kelamin', '<select id="sJk" name="jk"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>') + bid('sAgama', 'Agama', '<select id="sAgama" name="agama">' + opsi(AGAMA, 'Islam') + '</select>') +
      bid('sKawin', 'Status kawin', '<select id="sKawin" name="kawin">' + opsi(KAWIN, 'Kawin') + '</select>') + bid('sKerja', 'Pekerjaan', '<input id="sKerja" name="pekerjaan">') + '</div>' +
      bid('sAlamat', 'Alamat', '<input id="sAlamat" name="alamat">') +
      bid('sPerlu', 'Keperluan', '<select id="sPerlu" name="keperluan">' + opsi(KEPERLUAN) + '</select>') +
      bid('sKet', 'Keterangan tambahan', '<textarea id="sKet" name="ket" placeholder="mis. Untuk melamar pekerjaan"></textarea>') +
      '<p style="color:var(--redup);font-size:13px;margin:0 0 12px">Nomor berikutnya: <b class="mono" style="color:var(--teks)">' + nomorBerikut() + '</b></p>' +
      '<button class="btn" type="submit" style="width:100%">' + ik('surat') + 'Buat & pratinjau surat</button></form>' +
      '<section class="kartu"><h2>Riwayat surat <span class="lencana netral">' + D.surat.length + '</span></h2>' + (D.surat.length ? '<ul class="daftar stagger">' + D.surat.slice().reverse().map(function (s) { return '<li><span class="avatar">' + ik('surat').replace('<svg', '<svg width="20" height="20" style="fill:none;stroke:currentColor;stroke-width:1.9"') + '</span><div class="utama-baris"><b>' + e(s.nama) + '</b><small><span class="mono">' + e(s.no) + '</span> · ' + e(s.keperluan) + '</small></div><button class="btn btn-garis btn-kecil" data-cetak-ulang="' + s.id + '">' + ik('cetak') + 'Buka</button></li>'; }).join('') + '</ul>' : kosong('Belum ada surat dibuat.', 'surat')) + '</section></div>';
  };
  function nomorBerikut() { var th = new Date().getFullYear(), u = D.nomorSurat.tahun === th ? D.nomorSurat.urut + 1 : 1; return String(u).padStart(3, '0') + '/RT' + D.pengaturan.rt + '/RW' + D.pengaturan.rw + '/' + ROMAWI[new Date().getMonth()] + '/' + th; }
  HAL.suratPasca = function () {
    var f = $('#fSurat'), org = semuaOrang();
    $('#sWarga').addEventListener('change', function () {
      var o = org.filter(function (x) { return x.kunci === this.value; }, this)[0]; if (!o) return;
      ['nama', 'nik', 'tempatLahir', 'tglLahir', 'jk', 'agama', 'kawin', 'pekerjaan'].forEach(function (k) { if (f[k]) f[k].value = o.a[k] || ''; });
      f.alamat.value = o.kk.alamat + ', ' + namaRT() + ', Kel. ' + D.pengaturan.kelurahan + ', Kec. ' + D.pengaturan.kecamatan + ', ' + D.pengaturan.kota;
      $$('input,select', f).forEach(function (x) { if (x.value && x.id !== 'sWarga') { x.classList.remove('cap'); void x.offsetWidth; x.classList.add('cap'); } });
    });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!f.nama.value.trim()) { f.nama.focus(); toast('Nama wajib diisi', 'bahaya'); return; }
      var th = new Date().getFullYear();
      if (D.nomorSurat.tahun !== th) D.nomorSurat = { tahun: th, urut: 0 };
      var s = { id: idBaru('sr'), no: nomorBerikut(), tgl: hariIni() };
      ['nama', 'nik', 'tempatLahir', 'tglLahir', 'jk', 'agama', 'kawin', 'pekerjaan', 'alamat', 'keperluan', 'ket'].forEach(function (k) { s[k] = f[k].value.trim(); });
      D.nomorSurat.urut++; D.surat.push(s); simpan(); render(); pratinjauSurat(s); toast('Surat ' + s.no + ' dibuat');
    });
    $('#isi').addEventListener('click', function (ev) { var b = ev.target.closest('[data-cetak-ulang]'); if (b) pratinjauSurat(D.surat.filter(function (s) { return s.id === b.dataset.cetakUlang; })[0]); });
  };
  function htmlSurat(s) {
    var p = D.pengaturan, ketua = D.pengurus.filter(function (x) { return /ketua/i.test(x.jabatan); })[0] || { nama: '……………………' };
    var baris = [['Nama', s.nama], ['NIK', s.nik], ['Tempat/Tgl. Lahir', (s.tempatLahir || '-') + ', ' + tglPanjang(s.tglLahir)], ['Jenis Kelamin', s.jk === 'P' ? 'Perempuan' : 'Laki-laki'], ['Agama', s.agama], ['Status Perkawinan', s.kawin], ['Pekerjaan', s.pekerjaan], ['Alamat', s.alamat]];
    return '<div class="surat"><div class="kop"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="none" stroke="#000" stroke-width="2"/><path d="M14 32 32 17l18 15v17H14z" fill="#000"/><rect x="28" y="37" width="8" height="12" fill="#fff"/></svg><div class="kop-teks"><div class="k1">PENGURUS RUKUN TETANGGA ' + e(p.rt) + ' / RUKUN WARGA ' + e(p.rw) + '</div><div class="k2">' + e(namaUsaha()) + '</div><div class="k3">Kecamatan ' + e(p.kecamatan) + ' · ' + e(p.kota) + (p.provinsi ? ' · ' + e(p.provinsi) : '') + '<br>Sekretariat: ' + e(p.alamat) + '</div></div><div style="width:70px"></div></div>' +
      '<h3>SURAT PENGANTAR</h3><div class="nomor">Nomor: ' + e(s.no) + '</div>' +
      '<p>Yang bertanda tangan di bawah ini, Ketua Rukun Tetangga ' + e(p.rt) + ' Rukun Warga ' + e(p.rw) + ' Kelurahan ' + e(p.kelurahan) + ', Kecamatan ' + e(p.kecamatan) + ', ' + e(p.kota) + ', dengan ini menerangkan bahwa:</p>' +
      '<table>' + baris.map(function (b) { return '<tr><td style="width:150px">' + b[0] + '</td><td>:</td><td>' + e(b[1] || '-') + '</td></tr>'; }).join('') + '</table>' +
      '<p>Orang tersebut benar adalah warga kami yang berdomisili di wilayah RT ' + e(p.rt) + ' / RW ' + e(p.rw) + ' dan berkelakuan baik. Surat pengantar ini diberikan untuk keperluan:</p><p style="text-align:center;font-weight:bold">' + e(s.keperluan) + '</p>' + (s.ket ? '<p>Keterangan: ' + e(s.ket) + '</p>' : '') +
      '<p>Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>' +
      '<div class="ttd"><div><br>Mengetahui,<br>Ketua RW ' + e(p.rw) + '<div class="ruang"></div><b>(………………………………)</b></div><div>' + e(p.kota.replace(/^Kota |^Kabupaten /, '')) + ', ' + tglPanjang(s.tgl) + '<br>Ketua RT ' + e(p.rt) + '<div class="ruang"></div><b><u>' + e(ketua.nama) + '</u></b></div></div></div>';
  }
  function pratinjauSurat(s) {
    modal('<div class="modal-kepala"><div><h2 id="modalJudul">Surat pengantar</h2><p class="mono" style="margin:4px 0 0;color:var(--redup)">' + e(s.no) + '</p></div><button class="ikon-btn" data-tutup aria-label="Tutup">' + ik('tutup') + '</button></div><div class="pratinjau-surat">' + htmlSurat(s) + '</div>' +
      '<div class="modal-kaki"><button class="btn btn-garis" data-tutup>Tutup</button><button class="btn" data-cetak>' + ik('cetak') + 'Cetak / simpan PDF</button></div>', function (m) {
      $('[data-cetak]', m).addEventListener('click', function () { $('#cetak').innerHTML = htmlSurat(s); window.print(); });
    });
  }

  // --- Pengaturan
  HAL.pengaturan = function () {
    var p = D.pengaturan, t = Object.assign({ utama: css('--tema-utama'), aksen: css('--tema-aksen'), radius: parseInt(css('--tema-radius'), 10), font: css('--tema-font').split(',')[0].replace(/"/g, '').trim(), mode: TEMA.mode, nama: TEMA.nama }, tampilan);
    return kepalaHal('Pengaturan', 'Identitas RT, tampilan, PIN, dan data') +
      '<div class="grid grid-2" style="align-items:start"><div class="tumpuk">' +
      '<form class="kartu" id="fIdentitas"><h2>Identitas RT</h2><div class="form-grid">' +
      bid('pRt', 'Nomor RT', '<input id="pRt" name="rt" value="' + e(p.rt) + '" maxlength="3">') + bid('pRw', 'Nomor RW', '<input id="pRw" name="rw" value="' + e(p.rw) + '" maxlength="3">') +
      bid('pKel', 'Kelurahan / desa', '<input id="pKel" name="kelurahan" value="' + e(p.kelurahan) + '">') + bid('pKec', 'Kecamatan', '<input id="pKec" name="kecamatan" value="' + e(p.kecamatan) + '">') +
      bid('pKota', 'Kota / kabupaten', '<input id="pKota" name="kota" value="' + e(p.kota) + '">') + bid('pProv', 'Provinsi', '<input id="pProv" name="provinsi" value="' + e(p.provinsi) + '">') + '</div>' +
      bid('pAlamat', 'Alamat sekretariat', '<input id="pAlamat" name="alamat" value="' + e(p.alamat) + '">') +
      '<div class="form-grid">' + bid('pIuran', 'Iuran per bulan (Rp)', '<input id="pIuran" name="iuran" inputmode="numeric" value="' + e(p.iuran) + '">') + bid('pMulai', 'Iuran dihitung sejak', '<input id="pMulai" name="iuranMulai" type="month" value="' + e(p.iuranMulai) + '">') + '</div>' +
      bid('pBayar', 'Cara bayar (muncul di pesan pengingat)', '<textarea id="pBayar" name="caraBayar">' + e(p.caraBayar) + '</textarea>') +
      '<button class="btn" type="submit">' + ik('cek') + 'Simpan identitas</button></form>' +
      '<section class="kartu"><h2>Pengurus <button class="btn btn-garis btn-kecil" id="tambahPengurus">' + ik('tambah') + 'Tambah</button></h2><div id="daftarPengurus"></div><button class="btn" id="simpanPengurus" style="margin-top:12px">' + ik('cek') + 'Simpan pengurus</button></section>' +
      '</div><div class="tumpuk">' +
      '<form class="kartu" id="fTampilan"><h2>Tampilan</h2>' + bid('tNama', 'Nama di kop & judul', '<input id="tNama" name="nama" value="' + e(t.nama) + '">') +
      '<div class="form-grid">' + bid('tUtama', 'Warna utama', '<input id="tUtama" name="utama" type="color" value="' + hex(t.utama) + '">', 'Pilih warna cukup gelap agar teks putih terbaca') + bid('tAksen', 'Warna aksen', '<input id="tAksen" name="aksen" type="color" value="' + hex(t.aksen) + '">') +
      bid('tFont', 'Huruf', '<select id="tFont" name="font">' + opsi(FONT, t.font) + '</select>') + bid('tMode', 'Mode', '<select id="tMode" name="mode"><option value="auto"' + (t.mode === 'auto' ? ' selected' : '') + '>Ikuti perangkat</option><option value="terang"' + (t.mode === 'terang' ? ' selected' : '') + '>Terang</option><option value="gelap"' + (t.mode === 'gelap' ? ' selected' : '') + '>Gelap</option></select>') + '</div>' +
      bid('tRadius', 'Sudut membulat: <output id="oRadius">' + t.radius + 'px</output>', '<input id="tRadius" name="radius" type="range" min="0" max="24" value="' + t.radius + '" style="padding:0">') +
      '<div class="baris-aksi"><button class="btn" type="submit">' + ik('cek') + 'Simpan tampilan</button><button class="btn btn-garis" type="button" id="resetTampilan">Kembalikan bawaan</button></div></form>' +
      '<form class="kartu" id="fPin"><h2>PIN panel pengurus</h2><div class="form-grid">' + bid('pinLama', 'PIN lama', '<input id="pinLama" type="password" inputmode="numeric" maxlength="6" autocomplete="current-password">') + bid('pinBaru', 'PIN baru (4–6 angka)', '<input id="pinBaru" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password">') + '</div><button class="btn" type="submit">' + ik('kunci') + 'Ganti PIN</button><p style="color:var(--redup);font-size:13px;margin:10px 0 0">PIN hanya mengunci tampilan di perangkat ini, bukan pengamanan server.</p></form>' +
      '<section class="kartu"><h2>Data & cadangan</h2><p style="color:var(--redup);margin:0 0 12px;font-size:14px">Data tersimpan di browser perangkat ini. Rutin unduh cadangan JSON supaya aman.</p><div class="baris-aksi" style="margin-bottom:10px">' +
      '<button class="btn" id="cadangan">' + ik('unduh') + 'Unduh cadangan JSON</button><label class="btn btn-garis" for="impJson" style="margin:0">' + ik('unggah') + 'Pulihkan JSON</label><input type="file" id="impJson" accept=".json,application/json" class="sr"></div>' +
      '<div class="baris-aksi" style="margin-bottom:10px"><button class="btn btn-garis btn-kecil" data-csv="warga">CSV warga</button><button class="btn btn-garis btn-kecil" data-csv="kas">CSV kas</button><button class="btn btn-garis btn-kecil" data-csv="iuran">CSV iuran</button>' +
      '<label class="btn btn-garis btn-kecil" for="impWarga" style="margin:0">Impor CSV warga</label><input type="file" id="impWarga" accept=".csv,text/csv" class="sr"><label class="btn btn-garis btn-kecil" for="impKas" style="margin:0">Impor CSV kas</label><input type="file" id="impKas" accept=".csv,text/csv" class="sr"></div>' +
      '<div class="baris-aksi"><button class="btn btn-garis btn-kecil" id="isiContoh">Muat data contoh</button><button class="btn btn-hapus btn-kecil" id="kosongkan">Kosongkan semua data</button></div></section></div></div>';
  };
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  function hex(c) { if (/^#[0-9a-f]{6}$/i.test(c)) return c; var x = document.createElement('canvas').getContext('2d'); x.fillStyle = c; return x.fillStyle; }
  function gambarPengurus() {
    $('#daftarPengurus').innerHTML = D.pengurus.map(function (p, i) {
      return '<div class="anggota-baris" data-pengurus><div class="kepala-baris"><span>' + e(p.jabatan || 'Pengurus') + '</span><button type="button" class="btn btn-hapus btn-kecil" data-hapus-pengurus="' + i + '">Hapus</button></div><div class="form-grid">' +
        bid('pj' + i, 'Jabatan', '<input id="pj' + i + '" name="jabatan" value="' + e(p.jabatan) + '">') + bid('pn' + i, 'Nama', '<input id="pn' + i + '" name="nama" value="' + e(p.nama) + '">') + bid('pw' + i, 'WhatsApp', '<input id="pw' + i + '" name="wa" inputmode="tel" value="' + e(p.wa) + '">') + '</div></div>';
    }).join('') || kosong('Belum ada pengurus.', 'warga');
  }
  function bacaPengurus() { return $$('[data-pengurus]').map(function (b) { return { jabatan: $('[name=jabatan]', b).value.trim(), nama: $('[name=nama]', b).value.trim(), wa: waNomor($('[name=wa]', b).value) }; }); }
  HAL.pengaturanPasca = function () {
    gambarPengurus();
    $('#fIdentitas').addEventListener('submit', function (ev) {
      ev.preventDefault(); var f = ev.target;
      ['rt', 'rw', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'alamat', 'iuranMulai', 'caraBayar'].forEach(function (k) { D.pengaturan[k] = f[k].value.trim(); });
      D.pengaturan.iuran = Number(String(f.iuran.value).replace(/\D/g, '')) || 0;
      simpan(); toast('Identitas RT disimpan'); render();
    });
    $('#tambahPengurus').addEventListener('click', function () { D.pengurus = bacaPengurus(); D.pengurus.push({ jabatan: '', nama: '', wa: '' }); gambarPengurus(); $('#daftarPengurus [data-pengurus]:last-child input').focus(); });
    $('#daftarPengurus').addEventListener('click', function (ev) { var b = ev.target.closest('[data-hapus-pengurus]'); if (b) { D.pengurus = bacaPengurus(); D.pengurus.splice(+b.dataset.hapusPengurus, 1); gambarPengurus(); } });
    $('#simpanPengurus').addEventListener('click', function () { D.pengurus = bacaPengurus().filter(function (p) { return p.nama; }); simpan(); gambarPengurus(); toast('Pengurus disimpan'); });

    var fT = $('#fTampilan');
    function bacaT() { return { nama: fT.nama.value.trim() || TEMA.nama, utama: fT.utama.value, aksen: fT.aksen.value, font: fT.font.value, mode: fT.mode.value, radius: fT.radius.value }; }
    fT.addEventListener('input', function () { $('#oRadius').textContent = fT.radius.value + 'px'; terapkan(bacaT()); });
    fT.addEventListener('submit', function (ev) { ev.preventDefault(); tampilan = bacaT(); try { localStorage.setItem(KUNCI_TAMPILAN, JSON.stringify(tampilan)); } catch (x) {} toast('Tampilan disimpan'); });
    $('#resetTampilan').addEventListener('click', function () { try { localStorage.removeItem(KUNCI_TAMPILAN); } catch (x) {} tampilan = {}; document.documentElement.removeAttribute('style'); terapkan({ mode: TEMA.mode, nama: TEMA.nama, font: 'Nunito' }); render(); toast('Tampilan kembali ke bawaan'); });

    $('#fPin').addEventListener('submit', function (ev) {
      ev.preventDefault(); var l = $('#pinLama').value, b = $('#pinBaru').value;
      if (l !== String(D.pengaturan.pin)) { toast('PIN lama salah', 'bahaya'); $('#pinLama').focus(); return; }
      if (!/^\d{4,6}$/.test(b)) { toast('PIN baru harus 4–6 angka', 'bahaya'); $('#pinBaru').focus(); return; }
      D.pengaturan.pin = b; simpan(); ev.target.reset(); toast('PIN diganti');
    });
    $('#cadangan').addEventListener('click', function () { unduh('cadangan-rt-' + hariIni() + '.json', JSON.stringify(D, null, 2), 'application/json'); toast('Cadangan diunduh'); });
    $('#impJson').addEventListener('change', function () {
      bacaBerkas(this, function (teks) {
        var d; try { d = JSON.parse(teks); } catch (x) { toast('Berkas JSON tidak valid', 'bahaya'); return; }
        if (!d || !d.pengaturan || !Array.isArray(d.kk)) { toast('Ini bukan cadangan Website RT', 'bahaya'); return; }
        konfirmasi('Pulihkan cadangan?', 'Data sekarang (' + D.kk.length + ' KK) akan diganti dengan isi cadangan (' + d.kk.length + ' KK).', 'Pulihkan', function () { D = migrasi(d); simpan(); render(); toast('Cadangan dipulihkan'); }, true);
      });
    });
    $('#impWarga').addEventListener('change', function () { bacaBerkas(this, imporWarga); });
    $('#impKas').addEventListener('change', function () { bacaBerkas(this, imporKas); });
    $('#isiContoh').addEventListener('click', function () { konfirmasi('Muat data contoh?', 'Semua data sekarang diganti data contoh RT 05/RW 02. Unduh cadangan dulu kalau perlu.', 'Muat contoh', function () { var pin = D.pengaturan.pin; D = migrasi(window.buatDataContoh()); D.pengaturan.pin = pin; simpan(); render(); toast('Data contoh dimuat'); }); });
    $('#kosongkan').addEventListener('click', function () {
      konfirmasi('Kosongkan semua data?', 'Data warga, iuran, kas, info, dan surat dihapus dari perangkat ini. Identitas RT & PIN tetap. Tindakan ini tidak bisa dibatalkan.', 'Kosongkan', function () {
        D = migrasi({ pengaturan: D.pengaturan, pengurus: D.pengurus }); simpan(); render(); toast('Semua data dikosongkan');
      });
    });
  };

  /* ========== 7. Modal, konfirmasi, toast, PIN ========== */
  var modalEl = $('#modal'), fokusSebelum = null;
  function modal(html, pasang) {
    var buka = function () {
      fokusSebelum = document.activeElement;
      $('#modalIsi').innerHTML = html;
      modalEl.classList.remove('tutup');
      if (!modalEl.open) modalEl.showModal();
      $$('[data-tutup]', modalEl).forEach(function (b) { b.addEventListener('click', function () { tutupModal(); }); });
      if (pasang) pasang(modalEl);
      tandaiBagian(modalEl);
      var f = $('input:not([type=hidden]):not(.sr),select,textarea', modalEl) || $('.btn,[data-tutup]', modalEl); if (f) f.focus();
    };
    if (modalEl.open) tutupModal(buka); else buka();
  }
  function tutupModal(lalu) {
    if (!modalEl.open) { if (lalu) lalu(); return; }
    var selesai = function () { modalEl.classList.remove('tutup'); modalEl.close(); if (fokusSebelum && document.contains(fokusSebelum) && !lalu) fokusSebelum.focus(); if (lalu) lalu(); };
    if (RM.matches) return selesai();
    modalEl.classList.add('tutup'); setTimeout(selesai, 200);
  }
  modalEl.addEventListener('cancel', function (ev) { ev.preventDefault(); tutupModal(); });
  modalEl.addEventListener('click', function (ev) { if (ev.target === modalEl) tutupModal(); });
  function konfirmasi(judul, isi, tombol, ok, bukanBahaya) {
    modal('<div class="modal-kepala"><h2 id="modalJudul">' + e(judul) + '</h2></div><p style="margin:0;color:var(--redup)">' + e(isi) + '</p><div class="modal-kaki"><button class="btn btn-garis" data-tutup>Batal</button><button class="btn ' + (bukanBahaya ? '' : 'btn-hapus') + '" data-ya>' + e(tombol) + '</button></div>', function (m) {
      $('[data-ya]', m).addEventListener('click', function () { tutupModal(ok); });
    });
  }
  function toast(teks, jenis) {
    var t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = ik(jenis === 'bahaya' ? 'tutup' : 'cek') + '<span>' + e(teks) + '</span>';
    if (jenis === 'bahaya') t.style.background = 'var(--bahaya)';
    $('#toast').appendChild(t);
    setTimeout(function () { t.classList.add('pergi'); setTimeout(function () { t.remove(); }, RM.matches ? 0 : 260); }, 2800);
  }
  function salin(teks, pesan) {
    var jadi = function () { toast(pesan); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(teks).then(jadi, cadangan); else cadangan();
    function cadangan() { var a = document.createElement('textarea'); a.value = teks; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); jadi(); } catch (x) { toast('Gagal menyalin', 'bahaya'); } a.remove(); }
  }
  function bukaPin(tujuan) {
    var isian = '';
    modal('<div style="text-align:center"><span class="avatar" style="margin:0 auto 12px;width:56px;height:56px">' + ik('kunci').replace('<svg', '<svg width="26" height="26" style="fill:none;stroke:currentColor;stroke-width:2"') + '</span><h2 id="modalJudul" style="font-size:20px">Masuk panel pengurus</h2><p style="color:var(--redup);margin:6px 0 0">Masukkan PIN. Contoh: <b>1234</b></p>' +
      '<div class="pin-titik" id="pinTitik" aria-hidden="true"><span></span><span></span><span></span><span></span></div><label class="sr" for="pinInput">PIN</label><input id="pinInput" class="sr" type="password" inputmode="numeric" autocomplete="off" maxlength="6">' +
      '<div class="papan-pin">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 'hapus', 0, 'tutup'].map(function (n) { return n === 'hapus' ? '<button class="btn btn-garis" data-hapus-pin aria-label="Hapus angka">⌫</button>' : n === 'tutup' ? '<button class="btn btn-garis" data-tutup aria-label="Batal">' + ik('tutup') + '</button>' : '<button class="btn btn-garis" data-angka="' + n + '">' + n + '</button>'; }).join('') + '</div></div>', function (m) {
      var inp = $('#pinInput', m), titik = $('#pinTitik', m), panjang = String(D.pengaturan.pin).length;
      titik.innerHTML = new Array(panjang + 1).join('<span></span>');
      function gambar() { $$('span', titik).forEach(function (s, i) { s.classList.toggle('isi', i < isian.length); }); }
      function cek() {
        gambar();
        if (isian.length < panjang) return;
        if (isian === String(D.pengaturan.pin)) { terbuka = true; sessionStorage.setItem('website-rt-buka', '1'); tutupModal(function () { location.hash = '#/panel/' + (tujuan && tujuan !== 'publik' ? tujuan : 'ringkas'); toast('Selamat datang, pengurus'); }); }
        else { titik.classList.remove('salah'); void titik.offsetWidth; titik.classList.add('salah'); isian = ''; inp.value = ''; setTimeout(gambar, 350); if (navigator.vibrate) navigator.vibrate(120); }
      }
      m.addEventListener('click', function (ev) { var a = ev.target.closest('[data-angka]'); if (a) { isian += a.dataset.angka; cek(); } if (ev.target.closest('[data-hapus-pin]')) { isian = isian.slice(0, -1); gambar(); } });
      inp.addEventListener('input', function () { isian = inp.value.replace(/\D/g, '').slice(0, panjang); inp.value = isian; cek(); });
      setTimeout(function () { inp.focus(); }, 30);
      m.addEventListener('keydown', function (ev) { if (/^\d$/.test(ev.key) && document.activeElement !== inp) { isian += ev.key; cek(); } });
    });
  }

  /* ========== 8. CSV & berkas ========== */
  function csvSel(v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function keCSV(baris) { return '﻿' + baris.map(function (r) { return r.map(csvSel).join(','); }).join('\r\n'); }
  function bacaCSV(teks) {
    teks = teks.replace(/^﻿/, ''); var pemisah = (teks.split('\n')[0].match(/;/g) || []).length > (teks.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
    var hasil = [], baris = [], sel = '', kutip = false;
    for (var i = 0; i < teks.length; i++) {
      var c = teks[i];
      if (kutip) { if (c === '"') { if (teks[i + 1] === '"') { sel += '"'; i++; } else kutip = false; } else sel += c; }
      else if (c === '"') kutip = true; else if (c === pemisah) { baris.push(sel); sel = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && teks[i + 1] === '\n') i++; baris.push(sel); hasil.push(baris); baris = []; sel = ''; }
      else sel += c;
    }
    if (sel || baris.length) { baris.push(sel); hasil.push(baris); }
    return hasil.filter(function (r) { return r.some(function (x) { return x.trim(); }); });
  }
  function unduh(nama, isi, tipe) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function bacaBerkas(input, lalu) { var f = input.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { lalu(String(r.result)); input.value = ''; }; r.readAsText(f); }
  var KOLOM_WARGA = ['no_kk', 'alamat', 'status', 'wa', 'nama', 'nik', 'hubungan', 'jk', 'tempat_lahir', 'tgl_lahir', 'agama', 'status_kawin', 'pekerjaan'];
  function eksporCSV(jenis) {
    var b = [];
    if (jenis === 'warga') { b.push(KOLOM_WARGA); D.kk.forEach(function (k) { k.anggota.forEach(function (a) { b.push([k.noKK, k.alamat, k.status, k.wa, a.nama, a.nik, a.hubungan, a.jk, a.tempatLahir, a.tglLahir, a.agama, a.kawin, a.pekerjaan]); }); }); }
    if (jenis === 'kas') { b.push(['tanggal', 'jenis', 'kategori', 'keterangan', 'jumlah']); D.kas.slice().sort(function (x, y) { return x.tgl.localeCompare(y.tgl); }).forEach(function (x) { b.push([x.tgl, x.jenis, x.kategori, x.ket, x.jumlah]); }); }
    if (jenis === 'iuran') { var bln = bulanTagihan(); b.push(['kepala_keluarga', 'alamat'].concat(bln).concat(['tunggakan_bulan', 'tunggakan_rp'])); D.kk.forEach(function (k) { var t = tunggakan(k); b.push([k.kepala, k.alamat].concat(bln.map(function (x) { return D.iuran[x] && D.iuran[x][k.id] ? 'lunas ' + D.iuran[x][k.id] : ''; })).concat([t.length, t.length * D.pengaturan.iuran])); }); }
    unduh(jenis + '-rt-' + hariIni() + '.csv', keCSV(b), 'text/csv;charset=utf-8'); toast('CSV ' + jenis + ' diunduh');
  }
  document.addEventListener('click', function (ev) { var c = ev.target.closest('[data-csv]'); if (c) eksporCSV(c.dataset.csv); });
  function imporWarga(teks) {
    var r = bacaCSV(teks); if (r.length < 2) { toast('CSV kosong', 'bahaya'); return; }
    var kepala = r[0].map(function (h) { return h.trim().toLowerCase(); }), idx = function (n) { return kepala.indexOf(n); };
    if (idx('nama') < 0) { toast('Kolom "nama" tidak ditemukan. Pakai format CSV ekspor.', 'bahaya'); return; }
    var peta = {}, baru = 0;
    r.slice(1).forEach(function (s) {
      var g = function (n) { var i = idx(n); return i < 0 ? '' : (s[i] || '').trim(); };
      if (!g('nama')) return;
      var kunci = g('no_kk') || g('alamat') || g('nama');
      var k = peta[kunci] || D.kk.filter(function (x) { return (g('no_kk') && x.noKK === g('no_kk')); })[0];
      if (!k) { k = { id: idBaru('kk'), noKK: g('no_kk'), alamat: g('alamat') || '-', status: g('status') === 'kontrak' ? 'kontrak' : 'tetap', wa: g('wa'), anggota: [], kepala: g('nama'), dibuat: hariIni() }; D.kk.push(k); baru++; }
      else if (!peta[kunci]) k.anggota = [];
      peta[kunci] = k;
      k.anggota.push({ nama: g('nama'), nik: g('nik'), hubungan: g('hubungan') || (k.anggota.length ? 'Lainnya' : 'Kepala Keluarga'), jk: g('jk') === 'P' ? 'P' : 'L', tempatLahir: g('tempat_lahir'), tglLahir: g('tgl_lahir'), agama: g('agama') || 'Islam', kawin: g('status_kawin'), pekerjaan: g('pekerjaan') });
      k.kepala = k.anggota[0].nama;
    });
    simpan(); render(); toast(Object.keys(peta).length + ' KK diimpor (' + baru + ' baru)');
  }
  function imporKas(teks) {
    var r = bacaCSV(teks), kepala = (r[0] || []).map(function (h) { return h.trim().toLowerCase(); }), n = 0;
    var i = function (k) { return kepala.indexOf(k); };
    if (i('jumlah') < 0 || i('tanggal') < 0) { toast('Butuh kolom tanggal & jumlah', 'bahaya'); return; }
    r.slice(1).forEach(function (s) {
      var jml = Number(String(s[i('jumlah')] || '').replace(/[^\d]/g, '')); if (!jml) return;
      D.kas.push({ id: idBaru('ks'), tgl: (s[i('tanggal')] || hariIni()).trim(), jenis: /keluar/i.test(s[i('jenis')] || '') ? 'keluar' : 'masuk', kategori: (s[i('kategori')] || 'Lainnya').trim(), ket: (s[i('keterangan')] || '-').trim(), jumlah: jml }); n++;
    });
    simpan(); render(); toast(n + ' transaksi kas diimpor');
  }

  /* ========== 9. Mulai ========== */
  D = muat();
  if (!DEMO) simpan();
  terapkan(Object.assign({ nama: TEMA.nama }, tampilan));
  $('#btnMode').addEventListener('click', function () {
    var jadi = document.documentElement.getAttribute('data-mode') === 'gelap' ? 'terang' : 'gelap';
    terapkan({ mode: jadi }); tampilan.mode = jadi; try { localStorage.setItem(KUNCI_TAMPILAN, JSON.stringify(tampilan)); } catch (x) {}
  });
  $('#btnPanel').addEventListener('click', function () {
    if (document.body.classList.contains('panel')) { if (!DEMO) { terbuka = false; sessionStorage.removeItem('website-rt-buka'); } location.hash = '#/'; toast('Anda keluar dari panel'); }
    else if (terbuka) location.hash = '#/panel/ringkas'; else bukaPin('ringkas');
  });
  window.addEventListener('hashchange', function () { if (modalEl.open) tutupModal(); render(); });
  window.addEventListener('afterprint', function () { $('#cetak').innerHTML = ''; });
  if (DEMO && !location.hash) history.replaceState(null, '', '#/panel/ringkas');
  render();
  if (/^https?:/.test(location.protocol)) { var mf = document.createElement('link'); mf.rel = 'manifest'; mf.href = 'manifest.webmanifest'; document.head.appendChild(mf); }
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol) && !DEMO) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
