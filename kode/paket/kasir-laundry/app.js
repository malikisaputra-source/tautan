/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Kasir Laundry — Maliki Studio (turunan Kasir Fotocopy/Kasir UMKM). Offline-first, sinkron Google Sheets opsional. Lisensi MIT. */
(function () {
  'use strict';

  // ---------- Penyimpanan (localStorage, offline) ----------
  var KUNCI = 'kasir-laundry-v1';
  var NAMA_TEMA = (window.TEMA && TEMA.nama) || 'Laundry Bersih Wangi';
  var DEMO = /[?&]demo\b/.test(location.search); // mode demo: data contoh di memori, tidak menyimpan apa pun
  var STATUS = [
    { id: 'diterima', nama: 'Diterima' },
    { id: 'dicuci', nama: 'Dicuci' },
    { id: 'disetrika', nama: 'Disetrika' },
    { id: 'siap', nama: 'Siap ambil' },
    { id: 'diambil', nama: 'Diambil' }
  ];
  var SATUAN = { kg: 'kg', pcs: 'pcs', m2: 'm²' };
  var D, pengguna = null;

  function layananBawaan() {
    return [
      { id: 'l1', nama: 'Cuci Setrika', tipe: 'kg', harga: 7000, ilus: 'mesin' },
      { id: 'l2', nama: 'Cuci Kering (lipat)', tipe: 'kg', harga: 5000, ilus: 'keranjang' },
      { id: 'l3', nama: 'Setrika Saja', tipe: 'kg', harga: 4500, ilus: 'setrika' },
      { id: 'l4', nama: 'Bed Cover', tipe: 'pcs', harga: 25000, ilus: 'selimut' },
      { id: 'l5', nama: 'Jas / Blazer', tipe: 'pcs', harga: 20000, ilus: 'jas' },
      { id: 'l6', nama: 'Sepatu', tipe: 'pcs', harga: 30000, ilus: 'sepatu' },
      { id: 'l7', nama: 'Karpet', tipe: 'm2', harga: 15000, ilus: 'karpet' },
      { id: 'l8', nama: 'Boneka', tipe: 'pcs', harga: 15000, ilus: 'keranjang' }
    ];
  }
  function paketBawaan() {
    return [
      { id: 'reguler', nama: 'Reguler', persen: 0, jam: 72 },
      { id: 'kilat', nama: 'Kilat', persen: 50, jam: 24 },
      { id: 'express', nama: 'Express', persen: 100, jam: 6 }
    ];
  }
  function dataKosong() {
    return {
      versi: 1,
      toko: { nama: NAMA_TEMA, namaDariTema: true, alamat: 'Jl. Melati No. 8', telp: '0812-0000-1111', footer: 'Cucian tidak diambil 30 hari di luar tanggung jawab kami.' },
      layanan: layananBawaan(), paket: paketBawaan(),
      parfum: ['Lavender', 'Sakura', 'Ocean Fresh', 'Tanpa parfum'],
      pelanggan: [], order: [],
      kasir: [{ id: 'k1', nama: 'Admin', pin: '1234', peran: 'admin' }, { id: 'k2', nama: 'Rina', pin: '1111', peran: 'kasir' }],
      nomor: 0,
      sinkron: { url: '', kunci: '', otomatis: true, antrian: [], terakhir: null, galat: '' }
    };
  }
  function semai(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function dataContoh() {
    var d = dataKosong(), acak = semai(7), now = new Date();
    var nama = [['Bu Sari', '081234560001'], ['Pak Joko', '081234560002'], ['Mbak Dewi', '081234560003'], ['Kos Putri Mawar', '081234560004'], ['Mas Andi', '081234560005'], ['Bu Lina', '081234560006'], ['Pak Harun', '081234560007'], ['Rizky', '081234560008'], ['Bu Tari', '081234560009'], ['Okta', '081234560010']];
    d.pelanggan = nama.map(function (n, i) { return { id: 'c' + (i + 1), nama: n[0], wa: n[1] }; });
    for (var hari = 13; hari >= 0; hari--) {
      var nOrder = 2 + Math.floor(acak() * 4);
      for (var j = 0; j < nOrder; j++) {
        var t = new Date(now); t.setDate(t.getDate() - hari); t.setHours(8 + Math.floor(acak() * 11), Math.floor(acak() * 60), 0, 0);
        if (t > now) t = new Date(now.getTime() - (j + 1) * 600000);
        var c = d.pelanggan[Math.floor(acak() * d.pelanggan.length)];
        var items = [{ lid: 'l1', qty: Math.round((2 + acak() * 6) * 10) / 10 }];
        if (acak() < 0.25) items.push({ lid: ['l4', 'l5', 'l6', 'l7'][Math.floor(acak() * 4)], qty: 1 + Math.floor(acak() * 2) });
        if (acak() < 0.2) items[0].lid = 'l2';
        var pk = acak() < 0.65 ? 'reguler' : (acak() < 0.6 ? 'kilat' : 'express');
        var o = buatOrder(d, { pelangganId: c.id, nama: c.nama, wa: c.wa, items: items, paket: pk, parfum: d.parfum[Math.floor(acak() * 3)], pisah: acak() < 0.3, catatan: acak() < 0.2 ? 'Jangan pakai pemutih' : '', tgl: t, kasir: acak() < 0.5 ? 'Admin' : 'Rina' });
        var umur = hari * 24 + (now - t) / 36e5 % 24;
        var tahap = hari >= 4 ? 4 : hari === 3 ? 3 + Math.floor(acak() * 2) : hari === 2 ? 2 + Math.floor(acak() * 2) : hari === 1 ? 1 + Math.floor(acak() * 2) : Math.floor(acak() * 2);
        for (var s = 1; s <= tahap; s++) o.riwayat.push({ s: STATUS[s].id, t: new Date(t.getTime() + s * 6 * 36e5).toISOString(), oleh: o.kasir });
        o.status = STATUS[tahap].id;
        var bayar = tahap === 4 ? o.total : (acak() < 0.45 ? o.total : (acak() < 0.5 ? Math.round(o.total / 2 / 1000) * 1000 : 0));
        if (bayar) o.bayar.push({ t: t.toISOString(), jml: bayar, metode: acak() < 0.6 ? 'tunai' : 'qris' });
        if (tahap === 4 && umur > 0 && o.bayar.length === 0) o.bayar.push({ t: t.toISOString(), jml: o.total, metode: 'tunai' });
        d.order.push(o);
      }
    }
    return d;
  }

  function muat() {
    if (DEMO) { D = dataContoh(); return; }
    try { D = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { D = null; }
    if (!D || !D.order) { D = dataKosong(); simpan(); }
    // Migrasi ringan: lengkapi field yang belum ada tanpa menghapus data pengguna.
    var k = dataKosong();
    ['layanan', 'paket', 'parfum', 'pelanggan', 'order', 'kasir', 'sinkron'].forEach(function (f) { if (!D[f]) D[f] = k[f]; });
    Object.keys(k.sinkron).forEach(function (f) { if (D.sinkron[f] === undefined) D.sinkron[f] = k.sinkron[f]; });
    if (D.toko.namaDariTema) D.toko.nama = NAMA_TEMA;
  }
  function simpan() {
    if (DEMO) return;
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori penuh'); }
  }

  // ---------- Tema (customizer Maliki Studio, lihat tema.css & tema.js) ----------
  var FONT_OK = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  function terapkanTema(t) {
    var r = document.documentElement, st = r.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama);
    if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) st.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var f = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      st.setProperty('--tema-font', '"' + f + '", system-ui, sans-serif');
      var l = document.getElementById('fontTema');
      if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap';
    }
    if (t.mode) { var m = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode; r.setAttribute('data-mode', m); }
    if (t.bagian) terapkanBagian(t.bagian);
    setTimeout(hitungTeksBagian, 0);
    if (t.nama) {
      NAMA_TEMA = t.nama;
      if (D && D.toko.namaDariTema) { D.toko.nama = t.nama; $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; }); }
    }
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (customizer: warna per bagian, sorot, tap-untuk-pilih) ----------
  var PETA_BAGIAN = {
    nav: '.samping, .bawah, .masuk-merek',
    latar: 'main, .masuk-form, .hal',
    panel: '.panel, .kolom, .kartu-order, .pelanggan, .angka:not(.sorot), dialog, .masuk-kartu, .tabel-bungkus',
    utama: '.tombol.utama, .nav.aktif, .chip.aktif, .angka.sorot, .pilih-kasir .aktif, .maju',
    aksen: '.thumb, .lencana, .grafik .batang, .masuk-ilus, .tag-paket',
    teks: 'h1, h2, h3, .merek span, .total-besar'
  };
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  function tandaiBagian() {
    var baru = 0;
    Object.keys(PETA_BAGIAN).forEach(function (b) {
      Array.prototype.forEach.call(document.querySelectorAll(PETA_BAGIAN[b]), function (el) { if (!el.hasAttribute('data-bagian')) { el.setAttribute('data-bagian', b); baru++; } });
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
    return L > 0.4 ? '#10191c' : '#ffffff';
  }
  function hitungTeksBagian() {
    if (!document.body) return;
    var st = document.documentElement.style;
    st.setProperty('--tema-nav-teks', teksUntuk('--nav'));
    st.setProperty('--tema-utama-teks', teksUntuk('--utama'));
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
    Array.prototype.forEach.call(document.querySelectorAll('[data-sorot]'), function (e) { e.removeAttribute('data-sorot'); });
    Array.prototype.forEach.call(document.querySelectorAll('.label-sorot'), function (e) { e.remove(); });
    if (!b) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-bagian="' + b + '"]'), function (e) {
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
  ['click', 'pointerdown', 'mousedown', 'touchstart', 'submit', 'keydown'].forEach(function (tipe) {
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
    var d = e.data; if (!d) return;
    if (d.tipe === 'sorot') sorot(d.bagian || null);
    else if (d.tipe === 'mode-pilih') setPilih(d.aktif);
  });
  new MutationObserver(function (ms) {
    var mode = ms.some(function (m) { return m.type === 'attributes'; });
    var dom = ms.some(function (m) { return m.type === 'childList' && Array.prototype.some.call(m.addedNodes, function (n) { return n.nodeType === 1 && n.className !== 'label-sorot'; }); });
    if (dom) tandaiBagian(); if (mode) hitungTeksBagian();
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-mode'] });

  // ---------- Util ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function rp(n) { return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
  function angka(n) { return (Math.round((n || 0) * 10) / 10).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid(p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function dua(n) { return (n < 10 ? '0' : '') + n; }
  function tglKey(d) { d = new Date(d); return d.getFullYear() + '-' + dua(d.getMonth() + 1) + '-' + dua(d.getDate()); }
  function inputDT(d) { d = new Date(d); return tglKey(d) + 'T' + dua(d.getHours()) + ':' + dua(d.getMinutes()); }
  function fmtWaktu(iso) { var d = new Date(iso); return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + dua(d.getHours()) + ':' + dua(d.getMinutes()); }
  function fmtTglPanjang(iso) { var d = new Date(iso); return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + dua(d.getHours()) + ':' + dua(d.getMinutes()); }
  function inisial(s) { return String(s || '?').split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ''; }).join('').toUpperCase(); }
  function waNomor(s) { s = String(s || '').replace(/\D/g, ''); if (s.indexOf('0') === 0) s = '62' + s.slice(1); else if (s.indexOf('8') === 0) s = '62' + s; return s; }
  var tTimer;
  function toast(msg) { var t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('tampil'); clearTimeout(tTimer); tTimer = setTimeout(function () { t.classList.remove('tampil'); }, 2400); }
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe }));
    a.download = nama; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csvSel(v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function isAdmin() { return pengguna && pengguna.peran === 'admin'; }

  // ---------- Ilustrasi SVG buatan sendiri ----------
  var ILUS = {
    mesin: '<rect x="26" y="14" width="68" height="84" rx="10" fill="#fff" stroke="{c}" stroke-width="3"/><rect x="26" y="14" width="68" height="18" rx="9" fill="{m}"/><circle cx="38" cy="23" r="3.5" fill="{c}"/><rect x="62" y="20" width="22" height="6" rx="3" fill="#fff"/><circle cx="60" cy="64" r="23" fill="{c}"/><circle cx="60" cy="64" r="17" fill="{a}"/><path class="air" d="M44 66c5-4 9 3 16 0s11-4 16 0v4a17 17 0 0 1-32 0z" fill="#fff" opacity=".7"/>',
    keranjang: '<path d="M30 52h60l-7 42H37z" fill="{c}"/><path d="M36 58h48M38 68h44M40 78h40M42 88h36" stroke="#fff" stroke-width="2.5" opacity=".35"/><path d="M38 52c2-12 10-18 18-14s10-8 18-6 14 10 14 20" fill="{a}"/><path d="M46 46c4-6 10-6 14-2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><rect x="26" y="48" width="68" height="8" rx="4" fill="{c}" stroke="#fff" stroke-width="2" opacity=".95"/>',
    setrika: '<path d="M24 82c4-20 18-34 44-34h18c4 0 6 3 6 6v28z" fill="{c}"/><path d="M24 82h68v6H24z" fill="{m}"/><path d="M50 48c2-12 10-16 22-16h10" stroke="{c}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="62" cy="66" r="5" fill="{a}"/><path class="uap" d="M34 40c-4-5 4-8 0-13M44 36c-4-5 4-8 0-13" stroke="{a}" stroke-width="3" fill="none" stroke-linecap="round"/>',
    selimut: '<rect x="20" y="40" width="80" height="48" rx="8" fill="{c}"/><path d="M20 56h80M20 72h80M46 40v48M74 40v48" stroke="#fff" stroke-width="2" opacity=".3"/><rect x="26" y="28" width="30" height="16" rx="6" fill="{a}"/><rect x="62" y="28" width="30" height="16" rx="6" fill="{a}"/>',
    jas: '<path d="M44 22l16 10 16-10 18 10 6 60H20l6-60z" fill="{c}"/><path d="M60 32l-10 22 10 40 10-40z" fill="#fff"/><path d="M60 40l-4 8 4 6 4-6z" fill="{a}"/><path d="M44 22l6 30M76 22l-6 30" stroke="#fff" stroke-width="2" opacity=".5"/><circle cx="66" cy="70" r="2" fill="{c}"/>',
    sepatu: '<path d="M18 80c0-8 2-26 10-30l12 8c8 6 22 8 36 10 14 2 26 6 26 14v8z" fill="{c}"/><path d="M18 80h84v8H18z" fill="#fff" stroke="{c}" stroke-width="2.5"/><path d="M40 58l6-8M48 62l6-8M56 64l6-8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M30 52c4 6 8 8 10 8" stroke="{a}" stroke-width="4" fill="none" stroke-linecap="round"/>',
    karpet: '<path d="M20 40h70v46H20z" fill="{c}"/><path d="M26 46h58v34H26z" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/><path d="M55 50l10 13-10 13-10-13z" fill="{a}"/><rect x="88" y="34" width="14" height="58" rx="7" fill="{m}" stroke="{c}" stroke-width="2.5"/><path d="M20 44h-5M20 52h-5M20 60h-5M20 68h-5M20 76h-5M20 84h-5" stroke="{c}" stroke-width="2" stroke-linecap="round"/>'
  };
  function ilustrasi(nama, kecil) {
    var s = (ILUS[nama] || ILUS.keranjang).replace(/\{c\}/g, 'var(--utama)').replace(/\{a\}/g, 'var(--aksen)').replace(/\{m\}/g, 'var(--utama-muda)');
    return '<svg class="ilus' + (kecil ? ' kecil' : '') + '" viewBox="0 0 120 110" aria-hidden="true">' + s + '</svg>';
  }

  // ---------- Hitung order ----------
  function cariLayanan(id, d) { return (d || D).layanan.filter(function (l) { return l.id === id; })[0]; }
  function cariPaket(id, d) { return (d || D).paket.filter(function (p) { return p.id === id; })[0] || (d || D).paket[0]; }
  function hitungOrder(items, paketId, d) {
    d = d || D;
    var sub = 0, kg = 0;
    var baris = items.map(function (it) {
      var l = cariLayanan(it.lid, d) || { nama: it.nama || '?', tipe: it.tipe || 'pcs', harga: it.harga || 0 };
      var harga = it.harga != null ? it.harga : l.harga;
      var qty = Math.max(0, Number(it.qty) || 0);
      var jml = Math.round(harga * qty);
      sub += jml; if (l.tipe === 'kg') kg += qty;
      return { lid: it.lid, nama: l.nama, tipe: l.tipe, harga: harga, qty: qty, jml: jml };
    });
    var pk = cariPaket(paketId, d), tambahan = Math.round(sub * pk.persen / 100 / 100) * 100;
    return { baris: baris, sub: sub, tambahan: tambahan, total: sub + tambahan, kg: Math.round(kg * 10) / 10, paket: pk };
  }
  function nomorNota(d, n, t) { t = new Date(t); return 'LDR' + String(t.getFullYear()).slice(2) + dua(t.getMonth() + 1) + dua(t.getDate()) + '-' + String(n).padStart(4, '0'); }
  function buatOrder(d, o) {
    var t = o.tgl ? new Date(o.tgl) : new Date(), h = hitungOrder(o.items, o.paket, d);
    d.nomor = (d.nomor || 0) + 1;
    return {
      id: uid('o'), no: nomorNota(d, d.nomor, t), tgl: t.toISOString(),
      pelangganId: o.pelangganId, nama: o.nama, wa: o.wa || '',
      items: h.baris, paket: h.paket.id, paketNama: h.paket.nama, sub: h.sub, tambahan: h.tambahan, total: h.total, kg: h.kg,
      estimasi: o.estimasi ? new Date(o.estimasi).toISOString() : new Date(t.getTime() + h.paket.jam * 36e5).toISOString(),
      parfum: o.parfum || '', pisah: !!o.pisah, catatan: o.catatan || '',
      status: 'diterima', riwayat: [{ s: 'diterima', t: t.toISOString(), oleh: o.kasir || '' }],
      bayar: [], kasir: o.kasir || '', diubah: t.toISOString()
    };
  }
  function dibayar(o) { return o.bayar.reduce(function (s, b) { return s + b.jml; }, 0); }
  function sisa(o) { return Math.max(0, o.total - dibayar(o)); }
  function idxStatus(s) { for (var i = 0; i < STATUS.length; i++) if (STATUS[i].id === s) return i; return 0; }
  function namaStatus(s) { return STATUS[idxStatus(s)].nama; }
  function majuStatus(o) {
    var i = idxStatus(o.status); if (i >= STATUS.length - 1) return false;
    o.status = STATUS[i + 1].id; o.riwayat.push({ s: o.status, t: new Date().toISOString(), oleh: pengguna ? pengguna.nama : '' });
    o.diubah = new Date().toISOString(); antri(o.id); simpan(); return true;
  }
  function ringkasan(d, dari, sampai) {
    // dari/sampai: Date. Omzet = total order dibuat di periode; uangMasuk = pembayaran diterima di periode.
    d = d || D;
    var r = { order: 0, omzet: 0, uangMasuk: 0, kg: 0, perHari: {}, belum: [], piutang: [], totalPiutang: 0 };
    d.order.forEach(function (o) {
      var t = new Date(o.tgl);
      if (t >= dari && t < sampai) {
        r.order++; r.omzet += o.total; r.kg += o.kg;
        var k = tglKey(t); r.perHari[k] = r.perHari[k] || { kg: 0, omzet: 0 }; r.perHari[k].kg += o.kg; r.perHari[k].omzet += o.total;
      }
      o.bayar.forEach(function (b) { var tb = new Date(b.t); if (tb >= dari && tb < sampai) r.uangMasuk += b.jml; });
      if (o.status !== 'diambil') r.belum.push(o);
      var s = sisa(o); if (s > 0) { r.piutang.push(o); r.totalPiutang += s; }
    });
    r.kg = Math.round(r.kg * 10) / 10;
    return r;
  }

  // ---------- Masuk (PIN) ----------
  var kasirDipilih = null, pinBuffer = '';
  function tampilMasuk() {
    $('#aplikasi').hidden = true; $('#layarMasuk').hidden = false;
    $('#masukIlus').innerHTML = ['mesin', 'keranjang', 'setrika', 'selimut', 'jas', 'sepatu'].map(function (n, i) { return '<span class="thumb" style="--i:' + i + '">' + ilustrasi(n) + '</span>'; }).join('');
    $('#daftarKasir').innerHTML = D.kasir.map(function (k) { return '<button type="button" data-id="' + k.id + '">' + esc(k.nama) + '</button>'; }).join('');
    $$('#daftarKasir button').forEach(function (b, i) {
      b.onclick = function () { kasirDipilih = D.kasir.filter(function (k) { return k.id === b.dataset.id; })[0]; pinBuffer = ''; titikPin(); $$('#daftarKasir button').forEach(function (x) { x.classList.toggle('aktif', x === b); }); };
      if (i === 0) b.click();
    });
    $('#padPin').innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (k) { return k ? '<button type="button" data-k="' + k + '" aria-label="' + (k === '⌫' ? 'Hapus' : k) + '">' + k + '</button>' : '<span></span>'; }).join('');
    $$('#padPin button').forEach(function (b) { b.onclick = function () { ketikPin(b.dataset.k); }; });
  }
  function titikPin() { $$('#pinTitik i').forEach(function (i, n) { i.classList.toggle('isi', n < pinBuffer.length); }); }
  function ketikPin(k) {
    if (!kasirDipilih) return;
    if (k === '⌫') pinBuffer = pinBuffer.slice(0, -1); else if (pinBuffer.length < 4) pinBuffer += k;
    titikPin();
    if (pinBuffer.length === 4) {
      if (pinBuffer === kasirDipilih.pin) masuk(kasirDipilih);
      else { var t = $('#pinTitik'); t.classList.add('salah'); setTimeout(function () { t.classList.remove('salah'); pinBuffer = ''; titikPin(); }, 380); }
    }
  }
  function masuk(k) {
    pengguna = k; try { sessionStorage.setItem(KUNCI + '-sesi', k.id); } catch (e) {}
    $('#layarMasuk').hidden = true; $('#aplikasi').hidden = false;
    $('#namaKasir').textContent = k.nama; $('#avatarKasir').textContent = inisial(k.nama);
    $$('[data-hal="atur"]').forEach(function (b) { b.hidden = !isAdmin(); });
    $$('[data-tema-nama]').forEach(function (e) { e.textContent = D.toko.nama; });
    navBawah(); buka('papan'); statusSinkron();
  }
  function keluar() { pengguna = null; try { sessionStorage.removeItem(KUNCI + '-sesi'); } catch (e) {} tampilMasuk(); }

  // ---------- Navigasi ----------
  var halAktif = 'papan';
  function navBawah() { $('#navBawah').innerHTML = $$('.samping .nav').filter(function (b) { return !b.hidden; }).map(function (b) { return b.outerHTML; }).join(''); $$('#navBawah .nav').forEach(function (b) { b.onclick = function () { buka(b.dataset.hal); }; }); }
  function buka(hal) {
    if (hal === 'atur' && !isAdmin()) return;
    halAktif = hal;
    $$('.hal').forEach(function (s) { s.classList.toggle('aktif', s.id === 'hal-' + hal); });
    $$('.nav').forEach(function (b) { b.classList.toggle('aktif', b.dataset.hal === hal); if (b.dataset.hal === hal) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    ({ order: renderOrder, papan: renderPapan, pelanggan: renderPelanggan, laporan: renderLaporan, atur: renderAtur })[hal]();
    window.scrollTo(0, 0);
  }

  // ---------- Order baru ----------
  var draf = null;
  function drafBaru() { draf = { items: [], paket: D.paket[0].id, dp: 0, metode: 'tunai', estimasiManual: false }; }
  function renderOrder() {
    if (!draf) drafBaru();
    var f = $('#formOrder');
    $('#noBerikut').textContent = 'Nota berikutnya ' + nomorNota(D, (D.nomor || 0) + 1, new Date());
    $('#dlPelanggan').innerHTML = D.pelanggan.map(function (c) { return '<option value="' + esc(c.nama) + '">' + esc(c.wa) + '</option>'; }).join('');
    $('#pilihLayanan').innerHTML = D.layanan.map(function (l) {
      return '<button type="button" class="kartu-layanan" data-lid="' + l.id + '" aria-label="Tambah ' + esc(l.nama) + ', ' + rp(l.harga) + ' per ' + SATUAN[l.tipe] + '"><span class="thumb">' + ilustrasi(l.ilus) + '</span><b>' + esc(l.nama) + '</b><small>' + rp(l.harga) + ' / ' + SATUAN[l.tipe] + '</small></button>';
    }).join('');
    $('#segPaket').innerHTML = D.paket.map(function (p) {
      return '<label><input type="radio" name="paket" value="' + p.id + '"' + (p.id === draf.paket ? ' checked' : '') + '><span><b>' + esc(p.nama) + '</b><small>' + (p.persen ? '+' + p.persen + '% · ' : '') + labelJam(p.jam) + '</small></span></label>';
    }).join('');
    $('#selParfum').innerHTML = D.parfum.map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('');
    if (!draf.estimasiManual) f.estimasi.value = inputDT(Date.now() + cariPaket(draf.paket).jam * 36e5);
    renderItemOrder();
  }
  function labelJam(j) { return j < 24 ? j + ' jam' : Math.round(j / 24) + ' hari'; }
  function renderItemOrder() {
    $('#itemOrder').innerHTML = draf.items.length ? draf.items.map(function (it, i) {
      var l = cariLayanan(it.lid) || {}; var langkah = l.tipe === 'pcs' ? 1 : 0.1;
      return '<li><span class="thumb kecil">' + ilustrasi(l.ilus, true) + '</span><span class="it-nama"><b>' + esc(l.nama) + '</b><small>' + rp(l.harga) + ' / ' + SATUAN[l.tipe] + '</small></span>' +
        '<label class="it-qty"><span class="sr">' + (l.tipe === 'kg' ? 'Berat (kg)' : l.tipe === 'm2' ? 'Luas (m²)' : 'Jumlah') + '</span><input type="text" inputmode="decimal" autocomplete="off" pattern="[0-9]*[.,]?[0-9]*" value="' + String(it.qty).replace(".", ",") + '" data-i="' + i + '"><em>' + SATUAN[l.tipe] + '</em></label>' +
        '<b class="it-jml">' + rp(Math.round(l.harga * (Number(it.qty) || 0))) + '</b><button type="button" class="ikon-btn" data-hapus="' + i + '" aria-label="Hapus ' + esc(l.nama) + '"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></li>';
    }).join('') : '<li class="kosong">Ketuk layanan di atas. Berat bisa desimal, mis. 3,4 kg.</li>';
    renderRingkasOrder();
  }
  function renderRingkasOrder() {
    var h = hitungOrder(draf.items, draf.paket), dp = Math.min(draf.dp, h.total);
    $('#ringkasOrder').innerHTML = '<h3>Ringkasan</h3>' +
      '<div class="baris"><span>Subtotal' + (h.kg ? ' · ' + angka(h.kg) + ' kg' : '') + '</span><b>' + rp(h.sub) + '</b></div>' +
      '<div class="baris"><span>Paket ' + esc(h.paket.nama) + (h.paket.persen ? ' (+' + h.paket.persen + '%)' : '') + '</span><b>' + rp(h.tambahan) + '</b></div>' +
      '<div class="baris total"><span>Total</span><b class="total-besar">' + rp(h.total) + '</b></div>' +
      '<label>Bayar sekarang (DP)<input type="number" inputmode="numeric" min="0" step="1000" id="inDP" value="' + (draf.dp || '') + '" placeholder="0"></label>' +
      '<div class="aksi-dp"><button type="button" class="tombol kecil" id="btnLunas">Lunas</button><button type="button" class="tombol kecil" id="btnDP0">Bayar nanti</button>' +
      '<select id="selMetode" aria-label="Metode bayar"><option value="tunai">Tunai</option><option value="qris">QRIS</option><option value="transfer">Transfer</option></select></div>' +
      '<div class="baris"><span>Sisa / piutang</span><b class="' + (h.total - dp > 0 ? 'teks-bahaya' : 'teks-ok') + '">' + rp(h.total - dp) + '</b></div>' +
      '<button type="submit" class="tombol utama besar"' + (draf.items.length ? '' : ' disabled') + '>Simpan &amp; buat nota</button>';
    $('#selMetode').value = draf.metode;
  }
  function tambahItem(lid) {
    var l = cariLayanan(lid); if (!l) return;
    var ada = draf.items.filter(function (i) { return i.lid === lid; })[0];
    if (ada) { if (l.tipe === 'pcs') ada.qty = Number(ada.qty) + 1; }
    else draf.items.push({ lid: lid, qty: l.tipe === 'kg' ? '' : 1 });
    renderItemOrder();
    var inp = $$('#itemOrder input[data-i]'); var idx = draf.items.indexOf(ada || draf.items[draf.items.length - 1]);
    if (inp[idx]) { inp[idx].focus(); inp[idx].select && inp[idx].select(); }
  }
  function simpanOrder() {
    var f = $('#formOrder'), nama = f.nama.value.trim(), wa = f.wa.value.trim();
    if (!nama) { f.nama.focus(); toast('Isi nama pelanggan'); return; }
    var items = draf.items.filter(function (i) { return Number(i.qty) > 0; });
    if (!items.length) { toast('Isi berat / jumlah layanan'); return; }
    var c = D.pelanggan.filter(function (x) { return x.nama.toLowerCase() === nama.toLowerCase() && (!wa || waNomor(x.wa) === waNomor(wa) || !x.wa); })[0];
    if (!c) { c = { id: uid('c'), nama: nama, wa: wa }; D.pelanggan.push(c); } else if (wa && !c.wa) c.wa = wa;
    var o = buatOrder(D, { pelangganId: c.id, nama: c.nama, wa: wa || c.wa, items: items, paket: draf.paket, estimasi: f.estimasi.value || null, parfum: f.parfum.value, pisah: f.pisah.checked, catatan: f.catatan.value.trim(), kasir: pengguna ? pengguna.nama : '' });
    var dp = Math.min(Number(draf.dp) || 0, o.total);
    if (dp > 0) o.bayar.push({ t: o.tgl, jml: dp, metode: draf.metode });
    D.order.push(o); antri(o.id); simpan();
    f.reset(); drafBaru(); renderOrder();
    toast('Order ' + o.no + ' tersimpan');
    lihatOrder(o.id);
  }

  // ---------- Papan status ----------
  var filterStatus = 'aktif';
  function renderPapan() {
    var q = ($('#cariOrder').value || '').toLowerCase().trim();
    var list = D.order.filter(function (o) { return !q || (o.nama + ' ' + o.no + ' ' + o.wa).toLowerCase().indexOf(q) > -1; });
    var hitungS = {}; STATUS.forEach(function (s) { hitungS[s.id] = 0; }); list.forEach(function (o) { hitungS[o.status]++; });
    var opsi = [{ id: 'aktif', nama: 'Semua aktif', n: list.length - hitungS.diambil }].concat(STATUS.map(function (s) { return { id: s.id, nama: s.nama, n: hitungS[s.id] }; }));
    $('#filterStatus').innerHTML = opsi.map(function (s) { return '<button type="button" class="chip' + (s.id === filterStatus ? ' aktif' : '') + '" data-f="' + s.id + '" aria-pressed="' + (s.id === filterStatus) + '">' + s.nama + ' <span>' + s.n + '</span></button>'; }).join('');
    var tampil = filterStatus === 'aktif' ? STATUS.filter(function (s) { return s.id !== 'diambil'; }) : STATUS.filter(function (s) { return s.id === filterStatus; });
    var telat = list.filter(function (o) { return o.status !== 'diambil' && o.status !== 'siap' && new Date(o.estimasi) < new Date(); }).length;
    $('#papanInfo').textContent = (list.length - hitungS.diambil) + ' cucian aktif · ' + hitungS.siap + ' siap ambil' + (telat ? ' · ' + telat + ' lewat estimasi' : '');
    $('#papan').className = 'papan' + (tampil.length === 1 ? ' satu' : '');
    $('#papan').innerHTML = tampil.map(function (s) {
      var isi = list.filter(function (o) { return o.status === s.id; }).sort(function (a, b) { return s.id === 'diambil' ? (b.diubah < a.diubah ? -1 : 1) : (a.estimasi < b.estimasi ? -1 : 1); });
      if (s.id === 'diambil') isi = isi.slice(0, 60);
      return '<section class="kolom" data-s="' + s.id + '"><header><span class="titik-s"></span><h3>' + s.nama + '</h3><span class="lencana">' + isi.length + '</span></header><div class="kolom-isi">' +
        (isi.length ? isi.map(kartuOrder).join('') : '<p class="kosong">Belum ada cucian di sini.</p>') + '</div></section>';
    }).join('');
  }
  function kartuOrder(o, n) {
    var i = idxStatus(o.status), s = sisa(o), lewat = o.status !== 'diambil' && o.status !== 'siap' && new Date(o.estimasi) < new Date();
    var isiItem = o.items.map(function (it) { return angka(it.qty) + ' ' + SATUAN[it.tipe] + ' ' + it.nama; }).join(', ');
    var berikut = STATUS[i + 1];
    return '<article class="kartu-order" style="--i:' + Math.min(n, 12) + '"><button type="button" class="ko-buka" data-buka="' + o.id + '" aria-label="Detail ' + esc(o.no) + ' ' + esc(o.nama) + '">' +
      '<span class="ko-atas"><b>' + esc(o.nama) + '</b>' + (o.paket !== 'reguler' ? '<span class="tag-paket">' + esc(o.paketNama) + '</span>' : '') + '</span>' +
      '<span class="ko-item">' + esc(isiItem) + '</span>' +
      '<span class="ko-bawah"><span class="redup">' + esc(o.no.slice(-4)) + ' · ' + (o.status === 'diambil' ? 'diambil ' + fmtWaktu(o.diubah) : '<span class="' + (lewat ? 'teks-bahaya' : '') + '">selesai ' + fmtWaktu(o.estimasi) + '</span>') + '</span>' +
      '<b class="' + (s ? 'teks-bahaya' : 'teks-ok') + '">' + (s ? 'Sisa ' + rp(s) : 'Lunas') + '</b></span></button>' +
      (berikut ? '<button type="button" class="maju" data-maju="' + o.id + '" aria-label="Pindahkan ' + esc(o.nama) + ' ke ' + berikut.nama + '">' + berikut.nama + ' <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' : '') + '</article>';
  }

  // ---------- Detail order, nota, WA ----------
  function dialog(html, siap) {
    var d = $('#dlg'), f = $('#dlgIsi'); f.innerHTML = html;
    if (siap) siap(f);
    if (!d.open) d.showModal();
  }
  function tutupDialog() { var d = $('#dlg'); if (d.open) d.close(); }
  function cariOrder(id) { return D.order.filter(function (o) { return o.id === id; })[0]; }
  function lihatOrder(id) {
    var o = cariOrder(id); if (!o) return;
    var i = idxStatus(o.status), s = sisa(o), berikut = STATUS[i + 1];
    dialog('<div class="dlg-kepala"><div><h3>' + esc(o.nama) + '</h3><span class="redup kecil">' + esc(o.no) + ' · ' + fmtTglPanjang(o.tgl) + '</span></div><button class="ikon-btn" value="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<ol class="alur">' + STATUS.map(function (st, k) { var r = o.riwayat.filter(function (x) { return x.s === st.id; })[0]; return '<li class="' + (k < i ? 'lewat' : k === i ? 'kini' : '') + '"><span></span><b>' + st.nama + '</b><small>' + (r ? fmtWaktu(r.t) : '') + '</small></li>'; }).join('') + '</ol>' +
      '<ul class="rincian">' + o.items.map(function (it) { return '<li><span>' + esc(it.nama) + ' <small>' + angka(it.qty) + ' ' + SATUAN[it.tipe] + ' × ' + rp(it.harga) + '</small></span><b>' + rp(it.jml) + '</b></li>'; }).join('') +
      (o.tambahan ? '<li><span>Paket ' + esc(o.paketNama) + '</span><b>' + rp(o.tambahan) + '</b></li>' : '') +
      '<li class="total"><span>Total</span><b>' + rp(o.total) + '</b></li><li><span>Dibayar</span><b>' + rp(dibayar(o)) + '</b></li><li><span>Sisa</span><b class="' + (s ? 'teks-bahaya' : 'teks-ok') + '">' + (s ? rp(s) : 'Lunas') + '</b></li></ul>' +
      '<p class="catatan-o"><b>Estimasi:</b> ' + fmtTglPanjang(o.estimasi) + ' · <b>Paket:</b> ' + esc(o.paketNama) + '<br><b>Parfum:</b> ' + esc(o.parfum || '-') + (o.pisah ? ' · <b>Pisah warna</b>' : '') + (o.catatan ? '<br><b>Catatan:</b> ' + esc(o.catatan) : '') + (o.wa ? '<br><b>WA:</b> ' + esc(o.wa) : '') + '</p>' +
      '<div class="dlg-aksi wrap">' +
      (berikut ? '<button type="button" class="tombol utama" id="dMaju">Maju ke ' + berikut.nama + '</button>' : '') +
      (s ? '<button type="button" class="tombol" id="dLunas">Terima pelunasan ' + rp(s) + '</button>' : '') +
      '<button type="button" class="tombol" id="dCetak">Cetak nota 58mm</button>' +
      (o.wa ? '<a class="tombol wa" target="_blank" rel="noopener" href="' + linkWA(o, 'nota') + '">WA nota</a>' : '') +
      (o.wa && (o.status === 'siap' || o.status === 'disetrika') ? '<a class="tombol wa" target="_blank" rel="noopener" href="' + linkWA(o, 'siap') + '">WA siap ambil</a>' : '') +
      (isAdmin() ? '<button type="button" class="tombol bahaya" id="dHapus">Hapus</button>' : '') + '</div>', function (f) {
      var m = $('#dMaju', f); if (m) m.onclick = function () { majuStatus(o); render(); lihatOrder(o.id); toast(o.nama + ' → ' + namaStatus(o.status)); };
      var l = $('#dLunas', f); if (l) l.onclick = function () { o.bayar.push({ t: new Date().toISOString(), jml: sisa(o), metode: 'tunai' }); o.diubah = new Date().toISOString(); antri(o.id); simpan(); render(); lihatOrder(o.id); toast('Lunas'); };
      $('#dCetak', f).onclick = function () { cetak(o); };
      var h = $('#dHapus', f); if (h) h.onclick = function () { if (!confirm('Hapus order ' + o.no + '? Tidak bisa dibatalkan.')) return; D.order = D.order.filter(function (x) { return x !== o; }); simpan(); tutupDialog(); render(); toast('Order dihapus (hapus juga barisnya di Sheet bila perlu)'); };
    });
  }
  function teksNota(o) {
    var s = sisa(o), L = [];
    L.push('*' + D.toko.nama + '*'); L.push('Nota ' + o.no); L.push('Halo ' + o.nama + ', terima kasih sudah laundry di tempat kami.'); L.push('');
    o.items.forEach(function (it) { L.push('- ' + it.nama + ' ' + angka(it.qty) + ' ' + SATUAN[it.tipe] + ' = ' + rp(it.jml)); });
    if (o.tambahan) L.push('- Paket ' + o.paketNama + ' = ' + rp(o.tambahan));
    L.push('Total: *' + rp(o.total) + '*'); L.push('Dibayar: ' + rp(dibayar(o)) + (s ? ' | Sisa: ' + rp(s) : ' (LUNAS)'));
    L.push('Estimasi selesai: ' + fmtTglPanjang(o.estimasi));
    if (D.toko.alamat) L.push(D.toko.alamat);
    return L.join('\n');
  }
  function teksSiap(o) {
    var s = sisa(o);
    return 'Halo ' + o.nama + ', cucian Anda (nota ' + o.no + ') sudah *siap diambil* di ' + D.toko.nama + '.' + (s ? '\nSisa pembayaran: ' + rp(s) + '.' : '\nPembayaran sudah lunas.') + (D.toko.alamat ? '\nAlamat: ' + D.toko.alamat : '') + '\nTerima kasih!';
  }
  function linkWA(o, jenis) { return 'https://wa.me/' + waNomor(o.wa) + '?text=' + encodeURIComponent(jenis === 'siap' ? teksSiap(o) : teksNota(o)); }
  function cetak(o) {
    var s = sisa(o), br = function (a, b) { return '<div class="br"><span>' + a + '</span><span>' + b + '</span></div>'; };
    $('#struk').innerHTML = '<div class="tengah"><h4>' + esc(D.toko.nama) + '</h4>' + esc(D.toko.alamat || '') + '<br>' + esc(D.toko.telp || '') + '</div><div class="gr"></div>' +
      br('Nota', esc(o.no)) + br('Masuk', fmtWaktu(o.tgl)) + br('Selesai', fmtWaktu(o.estimasi)) + br('Pelanggan', esc(o.nama)) + '<div class="gr"></div>' +
      o.items.map(function (it) { return esc(it.nama) + br(angka(it.qty) + ' ' + SATUAN[it.tipe] + ' x ' + rp(it.harga), rp(it.jml)); }).join('') +
      (o.tambahan ? br('Paket ' + esc(o.paketNama), rp(o.tambahan)) : '') + '<div class="gr"></div>' +
      br('<b>TOTAL</b>', '<b>' + rp(o.total) + '</b>') + br('Dibayar', rp(dibayar(o))) + br(s ? 'SISA' : 'Status', s ? rp(s) : 'LUNAS') + '<div class="gr"></div>' +
      (o.parfum ? 'Parfum: ' + esc(o.parfum) + '<br>' : '') + (o.pisah ? 'Pisah warna<br>' : '') + (o.catatan ? 'Catatan: ' + esc(o.catatan) + '<br>' : '') +
      '<div class="gr"></div><div class="tengah">' + esc(D.toko.footer || '') + '</div>';
    window.print();
  }

  // ---------- Pelanggan ----------
  function renderPelanggan() {
    var q = ($('#cariPelanggan').value || '').toLowerCase().trim();
    var data = D.pelanggan.map(function (c) {
      var os = D.order.filter(function (o) { return o.pelangganId === c.id; });
      return { c: c, n: os.length, total: os.reduce(function (s, o) { return s + o.total; }, 0), piutang: os.reduce(function (s, o) { return s + sisa(o); }, 0), akhir: os.reduce(function (m, o) { return o.tgl > m ? o.tgl : m; }, '') };
    }).filter(function (x) { return !q || (x.c.nama + ' ' + x.c.wa).toLowerCase().indexOf(q) > -1; }).sort(function (a, b) { return b.akhir < a.akhir ? -1 : 1; });
    $('#daftarPelanggan').innerHTML = data.length ? data.map(function (x, n) {
      return '<button type="button" class="pelanggan" data-c="' + x.c.id + '" style="--i:' + Math.min(n, 12) + '"><span class="avatar">' + esc(inisial(x.c.nama)) + '</span><span class="pl-info"><b>' + esc(x.c.nama) + '</b><small>' + esc(x.c.wa || 'tanpa WA') + ' · ' + x.n + ' order' + (x.akhir ? ' · terakhir ' + fmtWaktu(x.akhir) : '') + '</small></span><span class="pl-angka"><b>' + rp(x.total) + '</b>' + (x.piutang ? '<small class="teks-bahaya">piutang ' + rp(x.piutang) + '</small>' : '') + '</span></button>';
    }).join('') : '<p class="kosong panel">Belum ada pelanggan. Pelanggan otomatis tercatat saat order baru disimpan.</p>';
  }
  function lihatPelanggan(id) {
    var c = D.pelanggan.filter(function (x) { return x.id === id; })[0]; if (!c) return;
    var os = D.order.filter(function (o) { return o.pelangganId === id; }).sort(function (a, b) { return b.tgl < a.tgl ? -1 : 1; });
    dialog('<div class="dlg-kepala"><div><h3>' + esc(c.nama) + '</h3><span class="redup kecil">' + os.length + ' order · ' + rp(os.reduce(function (s, o) { return s + o.total; }, 0)) + '</span></div><button class="ikon-btn" value="tutup" aria-label="Tutup"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="form"><label>Nama<input id="pNama" value="' + esc(c.nama) + '"></label><label>No. WhatsApp<input id="pWa" inputmode="tel" value="' + esc(c.wa) + '"></label></div>' +
      '<h4>Riwayat</h4><ul class="daftar-mini">' + (os.map(function (o) { return '<li><button type="button" data-o="' + o.id + '"><span>' + fmtWaktu(o.tgl) + ' · ' + angka(o.kg) + ' kg · ' + namaStatus(o.status) + '</span><b>' + rp(o.total) + '</b></button></li>'; }).join('') || '<li class="kosong">Belum ada order.</li>') + '</ul>' +
      '<div class="dlg-aksi"><button class="tombol" value="tutup">Tutup</button><button type="button" class="tombol utama" id="pSimpan">Simpan</button></div>', function (f) {
      $('#pSimpan', f).onclick = function () { c.nama = $('#pNama', f).value.trim() || c.nama; c.wa = $('#pWa', f).value.trim(); D.order.forEach(function (o) { if (o.pelangganId === c.id) { o.nama = c.nama; o.wa = c.wa; } }); simpan(); tutupDialog(); renderPelanggan(); toast('Pelanggan disimpan'); };
    });
  }

  // ---------- Laporan ----------
  function renderLaporan() {
    var inp = $('#blnLaporan'); if (!inp.value) inp.value = tglKey(new Date()).slice(0, 7);
    var p = inp.value.split('-'), dari = new Date(+p[0], +p[1] - 1, 1), sampai = new Date(+p[0], +p[1], 1);
    var r = ringkasan(D, dari, sampai), hariIni = new Date(); hariIni.setHours(0, 0, 0, 0);
    var rh = ringkasan(D, hariIni, new Date(hariIni.getTime() + 864e5));
    $('#kartuAngka').innerHTML = [
      ['Omzet bulan ini', rp(r.omzet), r.order + ' order', true],
      ['Uang masuk', rp(r.uangMasuk), 'DP + pelunasan'],
      ['Kg bulan ini', angka(r.kg) + ' kg', 'hari ini ' + angka(rh.kg) + ' kg'],
      ['Belum diambil', r.belum.length, r.belum.filter(function (o) { return o.status === 'siap'; }).length + ' sudah siap'],
      ['Piutang', rp(r.totalPiutang), r.piutang.length + ' nota belum lunas']
    ].map(function (k, n) { return '<div class="angka' + (k[3] ? ' sorot' : '') + '" style="--i:' + n + '"><small>' + k[0] + '</small><b>' + k[1] + '</b><span>' + k[2] + '</span></div>'; }).join('');
    var hari = []; for (var d = new Date(dari); d < sampai; d.setDate(d.getDate() + 1)) hari.push(tglKey(d));
    grafik('#grafikKg', hari, function (k) { return (r.perHari[k] || {}).kg || 0; }, function (v) { return angka(v) + ' kg'; });
    grafik('#grafikOmzet', hari, function (k) { return (r.perHari[k] || {}).omzet || 0; }, rp);
    $('#lapBelum').innerHTML = r.belum.sort(function (a, b) { return a.tgl < b.tgl ? -1 : 1; }).slice(0, 30).map(function (o) { return '<li><button type="button" data-o="' + o.id + '"><span>' + esc(o.nama) + ' <small class="redup">' + namaStatus(o.status) + ' · masuk ' + fmtWaktu(o.tgl) + '</small></span><b>' + rp(o.total) + '</b></button></li>'; }).join('') || '<li class="kosong">Semua cucian sudah diambil.</li>';
    $('#lapPiutang').innerHTML = r.piutang.slice(0, 30).map(function (o) { return '<li><button type="button" data-o="' + o.id + '"><span>' + esc(o.nama) + ' <small class="redup">' + esc(o.no) + '</small></span><b class="teks-bahaya">' + rp(sisa(o)) + '</b></button></li>'; }).join('') || '<li class="kosong">Tidak ada piutang.</li>';
  }
  function grafik(sel, kunci, ambil, fmt) {
    var nilai = kunci.map(ambil), maks = Math.max.apply(null, nilai.concat([1])), hariIni = tglKey(new Date());
    $(sel).innerHTML = '<div class="batang-bungkus">' + kunci.map(function (k, i) {
      return '<div class="kol' + (k === hariIni ? ' kini' : '') + '" title="' + k.slice(8) + ': ' + fmt(nilai[i]) + '"><span class="batang" style="height:' + Math.round(nilai[i] / maks * 100) + '%;--i:' + i + '"></span><small>' + (+k.slice(8) % 5 === 1 || k === hariIni ? +k.slice(8) : '') + '</small></div>';
    }).join('') + '</div><p class="redup kecil">Tertinggi ' + fmt(maks === 1 && !nilai.some(Boolean) ? 0 : maks) + '</p>';
  }
  function eksporCSV() {
    var kolom = ['no', 'tanggal', 'pelanggan', 'wa', 'item', 'kg', 'paket', 'total', 'dibayar', 'sisa', 'status', 'estimasi', 'parfum', 'pisah_warna', 'catatan', 'kasir'];
    var baris = D.order.map(function (o) { return [o.no, fmtWaktu(o.tgl), o.nama, o.wa, o.items.map(function (i) { return i.nama + ' ' + i.qty + ' ' + SATUAN[i.tipe]; }).join(' | '), o.kg, o.paketNama, o.total, dibayar(o), sisa(o), namaStatus(o.status), fmtWaktu(o.estimasi), o.parfum, o.pisah ? 'ya' : '', o.catatan, o.kasir].map(csvSel).join(','); });
    unduh('order-laundry-' + tglKey(new Date()) + '.csv', '﻿' + kolom.join(',') + '\n' + baris.join('\n'), 'text/csv');
  }

  // ---------- Sinkron Google Sheets (opsional) ----------
  // Antrian lokal berisi id order yang berubah. Dikirim ke Web App Apps Script (doPost) saat online.
  var tKirim = null, sedangKirim = false;
  function antri(id) {
    if (D.sinkron.antrian.indexOf(id) < 0) D.sinkron.antrian.push(id);
    if (D.sinkron.url && D.sinkron.otomatis) { clearTimeout(tKirim); tKirim = setTimeout(function () { kirim(false); }, 1500); }
    statusSinkron();
  }
  function ringkasOrder(o) {
    return { id: o.id, no: o.no, tanggal: o.tgl, pelanggan: o.nama, wa: o.wa, item: o.items.map(function (i) { return i.nama + ' ' + i.qty + ' ' + SATUAN[i.tipe]; }).join(' | '), kg: o.kg, paket: o.paketNama, total: o.total, dibayar: dibayar(o), sisa: sisa(o), status: o.status, estimasi: o.estimasi, diambil: o.status === 'diambil' ? o.diubah : '', kasir: o.kasir, catatan: [o.parfum, o.pisah ? 'pisah warna' : '', o.catatan].filter(Boolean).join('; '), diperbarui: o.diubah, json: JSON.stringify(o) };
  }
  function kirim(manual) {
    var s = D.sinkron;
    if (!s.url) { if (manual) toast('Isi URL Web App dulu'); return Promise.resolve(false); }
    if (DEMO) { if (manual) toast('Mode demo: tidak mengirim data'); return Promise.resolve(false); }
    if (!navigator.onLine) { if (manual) toast('Sedang offline. Order tetap di antrian.'); statusSinkron(); return Promise.resolve(false); }
    if (sedangKirim) return Promise.resolve(false);
    var ids = s.antrian.slice(0, 200), data = ids.map(cariOrder).filter(Boolean).map(ringkasOrder);
    if (!ids.length) { if (manual) toast('Tidak ada yang perlu dikirim'); return Promise.resolve(true); }
    sedangKirim = true; statusSinkron('Mengirim ' + ids.length + ' order…');
    return fetch(s.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ aksi: 'simpan', kunci: s.kunci, toko: D.toko.nama, order: data }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.pesan) || 'Balasan tidak dikenal');
        s.antrian = s.antrian.filter(function (id) { return ids.indexOf(id) < 0; });
        s.terakhir = new Date().toISOString(); s.galat = ''; simpan();
        if (manual) toast('Terkirim ' + ids.length + ' order ke Google Sheets');
        return true;
      })
      .catch(function (e) { s.galat = String(e.message || e); simpan(); if (manual) toast('Gagal kirim: ' + s.galat); return false; })
      .then(function (ok) { sedangKirim = false; statusSinkron(); if (ok && s.antrian.length) setTimeout(function () { kirim(false); }, 500); return ok; });
  }
  function statusSinkron(pesan) {
    var s = D && D.sinkron; if (!s) return;
    var teks, kelas;
    if (!s.url) { teks = 'Offline saja'; kelas = 'mati'; }
    else if (pesan) { teks = pesan; kelas = 'jalan'; }
    else if (!navigator.onLine) { teks = 'Offline · antri ' + s.antrian.length; kelas = 'antri'; }
    else if (s.galat) { teks = 'Gagal sinkron · antri ' + s.antrian.length; kelas = 'galat'; }
    else if (s.antrian.length) { teks = 'Antri ' + s.antrian.length; kelas = 'antri'; }
    else { teks = 'Tersinkron' + (s.terakhir ? ' ' + fmtWaktu(s.terakhir) : ''); kelas = 'ok'; }
    var c = $('#chipSinkron'); if (c) { c.textContent = teks; c.className = 'sinkron-chip ' + kelas; }
    var st = $('#statusSinkron'); if (st) st.innerHTML = '<span class="sinkron-chip ' + kelas + '">' + esc(teks) + '</span>' + (s.galat ? '<small class="teks-bahaya">' + esc(s.galat) + '</small>' : '');
  }
  window.addEventListener('online', function () { statusSinkron(); if (D && D.sinkron.otomatis) kirim(false); });
  window.addEventListener('offline', function () { statusSinkron(); });

  // ---------- Atur ----------
  function renderAtur() {
    var ft = $('#formToko'); ['nama', 'alamat', 'telp', 'footer'].forEach(function (k) { ft[k].value = D.toko[k] || ''; });
    var fs = $('#formSinkron'); fs.url.value = D.sinkron.url; fs.kunci.value = D.sinkron.kunci; fs.otomatis.checked = D.sinkron.otomatis;
    $('#tabelLayanan').innerHTML = '<thead><tr><th>Nama layanan</th><th>Satuan</th><th>Harga (Rp)</th><th>Gambar</th><th><span class="sr">Hapus</span></th></tr></thead><tbody>' + D.layanan.map(function (l, i) {
      return '<tr data-i="' + i + '"><td><input data-k="nama" value="' + esc(l.nama) + '" aria-label="Nama layanan"></td><td><select data-k="tipe" aria-label="Satuan">' + Object.keys(SATUAN).map(function (t) { return '<option value="' + t + '"' + (t === l.tipe ? ' selected' : '') + '>per ' + SATUAN[t] + '</option>'; }).join('') + '</select></td><td><input data-k="harga" type="number" min="0" step="500" value="' + l.harga + '" aria-label="Harga"></td><td><select data-k="ilus" aria-label="Gambar">' + Object.keys(ILUS).map(function (n) { return '<option' + (n === l.ilus ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></td><td><button type="button" class="ikon-btn" data-hapus-l="' + i + '" aria-label="Hapus ' + esc(l.nama) + '"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></td></tr>';
    }).join('') + '</tbody>';
    $('#tabelPaket').innerHTML = '<thead><tr><th>Paket</th><th>Tambahan (%)</th><th>Lama (jam)</th></tr></thead><tbody>' + D.paket.map(function (p, i) {
      return '<tr data-p="' + i + '"><td><input data-k="nama" value="' + esc(p.nama) + '" aria-label="Nama paket"></td><td><input data-k="persen" type="number" min="0" value="' + p.persen + '" aria-label="Tambahan persen"></td><td><input data-k="jam" type="number" min="1" value="' + p.jam + '" aria-label="Lama jam"></td></tr>';
    }).join('') + '</tbody>';
    $('#daftarKasirAtur').innerHTML = D.kasir.map(function (k) { return '<li><span class="avatar">' + esc(inisial(k.nama)) + '</span><span>' + esc(k.nama) + ' <small class="redup">' + k.peran + '</small></span>' + (D.kasir.length > 1 && k.id !== (pengguna && pengguna.id) ? '<button type="button" class="ikon-btn" data-hapus-k="' + k.id + '" aria-label="Hapus ' + esc(k.nama) + '"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' : '') + '</li>'; }).join('');
    statusSinkron();
  }
  function bacaHarga() {
    $$('#tabelLayanan tr[data-i]').forEach(function (tr) { var l = D.layanan[+tr.dataset.i]; $$('[data-k]', tr).forEach(function (el) { l[el.dataset.k] = el.dataset.k === 'harga' ? Math.max(0, Number(el.value) || 0) : el.value; }); });
    $$('#tabelPaket tr[data-p]').forEach(function (tr) { var p = D.paket[+tr.dataset.p]; $$('[data-k]', tr).forEach(function (el) { p[el.dataset.k] = el.dataset.k === 'nama' ? el.value : Math.max(el.dataset.k === 'jam' ? 1 : 0, Number(el.value) || 0); }); });
  }

  // ---------- Render umum & event ----------
  function render() { if (pengguna) buka(halAktif); }
  function ikatEvent() {
    $('#btnKeluar').onclick = keluar;
    $$('.samping .nav').forEach(function (b) { b.onclick = function () { buka(b.dataset.hal); }; });
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      var x;
      if ((x = t.closest('[data-ke]'))) buka(x.dataset.ke);
      else if ((x = t.closest('[data-maju]'))) { var o = cariOrder(x.dataset.maju); if (o && majuStatus(o)) { renderPapan(); toast(o.nama + ' → ' + namaStatus(o.status)); if (o.status === 'siap' && o.wa) toast(o.nama + ' siap ambil. Buka kartu untuk kirim WA.'); } }
      else if ((x = t.closest('[data-buka]'))) lihatOrder(x.dataset.buka);
      else if ((x = t.closest('[data-o]'))) lihatOrder(x.dataset.o);
      else if ((x = t.closest('[data-c]'))) lihatPelanggan(x.dataset.c);
      else if ((x = t.closest('[data-f]'))) { filterStatus = x.dataset.f; renderPapan(); }
      else if ((x = t.closest('[data-lid]'))) tambahItem(x.dataset.lid);
      else if ((x = t.closest('[data-hapus]'))) { draf.items.splice(+x.dataset.hapus, 1); renderItemOrder(); }
      else if ((x = t.closest('[data-hapus-l]'))) { bacaHarga(); D.layanan.splice(+x.dataset.hapusL, 1); simpan(); renderAtur(); }
      else if ((x = t.closest('[data-hapus-k]'))) { D.kasir = D.kasir.filter(function (k) { return k.id !== x.dataset.hapusK; }); simpan(); renderAtur(); }
      else if (t.id === 'btnLunas') { draf.dp = hitungOrder(draf.items, draf.paket).total; renderRingkasOrder(); }
      else if (t.id === 'btnDP0') { draf.dp = 0; renderRingkasOrder(); }
    });
    $('#cariOrder').oninput = renderPapan;
    $('#cariPelanggan').oninput = renderPelanggan;
    var fo = $('#formOrder');
    fo.addEventListener('input', function (e) {
      var t = e.target;
      if (t.dataset.i != null && draf.items[+t.dataset.i]) {
        draf.items[+t.dataset.i].qty = t.value.replace(',', '.');
        var li = t.closest('li'), l = cariLayanan(draf.items[+t.dataset.i].lid);
        $('.it-jml', li).textContent = rp(Math.round(l.harga * (Number(draf.items[+t.dataset.i].qty) || 0)));
        renderRingkasOrder();
      } else if (t.id === 'inDP') { draf.dp = Math.max(0, Number(t.value) || 0); var h = hitungOrder(draf.items, draf.paket); var b = $$('#ringkasOrder .baris b'); b[b.length - 1].textContent = rp(Math.max(0, h.total - Math.min(draf.dp, h.total))); }
      else if (t.name === 'wa' || t.name === 'nama') {
        if (t.name === 'nama') { var c = D.pelanggan.filter(function (x) { return x.nama.toLowerCase() === t.value.trim().toLowerCase(); })[0]; if (c && !fo.wa.value) fo.wa.value = c.wa; }
      }
    });
    fo.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'paket') { draf.paket = t.value; if (!draf.estimasiManual) fo.estimasi.value = inputDT(Date.now() + cariPaket(t.value).jam * 36e5); renderRingkasOrder(); }
      else if (t.name === 'estimasi') draf.estimasiManual = true;
      else if (t.id === 'selMetode') draf.metode = t.value;
    });
    fo.addEventListener('submit', function (e) { e.preventDefault(); simpanOrder(); });
    $('#blnLaporan').onchange = renderLaporan;
    $('#btnEksporCSV').onclick = eksporCSV;
    $('#formToko').onsubmit = function (e) { e.preventDefault(); var f = e.target; ['nama', 'alamat', 'telp', 'footer'].forEach(function (k) { D.toko[k] = f[k].value.trim(); }); D.toko.namaDariTema = false; simpan(); $$('[data-tema-nama]').forEach(function (x) { x.textContent = D.toko.nama; }); toast('Profil disimpan'); };
    $('#formSinkron').onsubmit = function (e) { e.preventDefault(); var f = e.target; D.sinkron.url = f.url.value.trim(); D.sinkron.kunci = f.kunci.value.trim(); D.sinkron.otomatis = f.otomatis.checked; D.sinkron.galat = ''; simpan(); statusSinkron(); toast(D.sinkron.url ? 'URL disimpan' : 'Sinkron dimatikan, data tetap offline'); };
    $('#btnKirimSekarang').onclick = function () { kirim(true); };
    $('#btnKirimSemua').onclick = function () { D.order.forEach(function (o) { if (D.sinkron.antrian.indexOf(o.id) < 0) D.sinkron.antrian.push(o.id); }); simpan(); statusSinkron(); toast(D.sinkron.antrian.length + ' order masuk antrian'); };
    $('#formHarga').onsubmit = function (e) { e.preventDefault(); bacaHarga(); simpan(); toast('Harga disimpan'); };
    $('#btnTambahLayanan').onclick = function () { bacaHarga(); D.layanan.push({ id: uid('l'), nama: 'Layanan baru', tipe: 'pcs', harga: 10000, ilus: 'keranjang' }); simpan(); renderAtur(); };
    $('#formKasir').onsubmit = function (e) { e.preventDefault(); var f = e.target; if (!/^\d{4}$/.test(f.pin.value)) { toast('PIN harus 4 angka'); return; } D.kasir.push({ id: uid('k'), nama: f.nama.value.trim(), pin: f.pin.value, peran: f.peran.value }); simpan(); f.reset(); renderAtur(); toast('Kasir ditambah'); };
    $('#btnBackup').onclick = function () { unduh('backup-kasir-laundry-' + tglKey(new Date()) + '.json', JSON.stringify(D, null, 1), 'application/json'); };
    $('#fileBackup').onchange = function (e) {
      var file = e.target.files[0]; if (!file) return; var r = new FileReader();
      r.onload = function () { try { var x = JSON.parse(r.result); if (!x.order || !x.kasir) throw 0; if (!confirm('Timpa semua data di perangkat ini dengan backup?')) return; D = x; muatUlang(); toast('Backup dipulihkan'); } catch (er) { toast('Berkas backup tidak valid'); } };
      r.readAsText(file); e.target.value = '';
    };
    $('#btnContoh').onclick = function () { if (!confirm('Ganti semua data dengan data contoh?')) return; D = dataContoh(); muatUlang(); toast('Data contoh dimuat'); };
    $('#btnReset').onclick = function () { if (!confirm('Hapus SEMUA data di perangkat ini? Backup dulu bila perlu.')) return; D = dataKosong(); muatUlang(); toast('Data dihapus'); };
    $('#dlg').addEventListener('click', function (e) { if (e.target === $('#dlg')) tutupDialog(); });
  }
  function muatUlang() { simpan(); muat(); pengguna = D.kasir.filter(function (k) { return k.peran === 'admin'; })[0] || D.kasir[0]; masuk(pengguna); buka('atur'); }

  // ---------- Mulai ----------
  muat();
  ikatEvent();
  tandaiBagian(); hitungTeksBagian();
  var sesi = null; try { sesi = sessionStorage.getItem(KUNCI + '-sesi'); } catch (e) {}
  var k = D.kasir.filter(function (x) { return x.id === sesi; })[0];
  if (DEMO) { masuk(D.kasir[0]); var hq = /[?&]hal=(\w+)/.exec(location.search); if (hq) buka(hq[1]); }
  else if (k) masuk(k);
  else tampilMasuk();
  if (D.sinkron.url && D.sinkron.otomatis && D.sinkron.antrian.length) setTimeout(function () { kirim(false); }, 2000);
  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !DEMO) navigator.serviceWorker.register('sw.js').catch(function () {});

  // Kait pengujian
  window.__kasir = { data: function () { return D; }, hitungOrder: hitungOrder, buatOrder: buatOrder, ringkasan: ringkasan, majuStatus: majuStatus, sisa: sisa, linkWA: linkWA, teksNota: teksNota, waNomor: waNomor, ringkasOrder: ringkasOrder, kirim: kirim, tema: terapkanTema, buka: buka, demo: DEMO };
})();
