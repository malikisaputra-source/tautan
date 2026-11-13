/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Manajemen Gym — Maliki Studio (malikisaputra.biz.id). Lisensi MIT + atribusi. */
(function () {
  'use strict';

  // ---------- Penyimpanan (localStorage, offline) ----------
  var KUNCI = 'manajemen-gym-v1';
  var KUNCI_SESI = 'manajemen-gym-sesi';
  var DEMO = /[?&]demo\b/.test(location.search);
  var NAMA_TEMA = (window.TEMA && TEMA.nama) || 'Gym Saya';
  var PESAN_BAWAAN = 'Halo {nama}, ini dari {gym}. Paket {paket} kamu {sisa} (berakhir {tanggal}). Yuk perpanjang biar latihan tetap jalan. Kode member: {kode}. Terima kasih!';

  function paketBawaan() {
    return [
      { id: 'pk1', nama: 'Harian', hari: 1, harga: 25000, sesi: 0 },
      { id: 'pk2', nama: 'Bulanan', hari: 30, harga: 175000, sesi: 0 },
      { id: 'pk3', nama: '3 Bulan', hari: 90, harga: 480000, sesi: 0 },
      { id: 'pk4', nama: 'Tahunan', hari: 365, harga: 1650000, sesi: 0 },
      { id: 'pk5', nama: 'Personal Trainer 8 sesi', hari: 30, harga: 950000, sesi: 8 }
    ];
  }
  function dataKosong() {
    return {
      versi: 1,
      gym: { namaDariTema: true, nama: NAMA_TEMA, alamat: '', wa: '', pesan: PESAN_BAWAAN },
      paket: paketBawaan(), member: [], bayar: [], checkin: [],
      admin: [{ id: 'a1', nama: 'Pemilik', pin: '1234', peran: 'pemilik' }],
      nomor: 0
    };
  }

  // Data contoh FIKTIF untuk ?demo (nama & nomor karangan)
  function dataContoh() {
    var d = dataKosong();
    d.gym.alamat = 'Jl. Contoh Raya No. 8, Bandung';
    d.gym.wa = '081200001111';
    d.admin.push({ id: 'a2', nama: 'Resepsionis', pin: '1111', peran: 'staf' });
    var nama = ['Rina Kartika', 'Bima Prakoso', 'Dewi Lestari', 'Andi Saputra', 'Sinta Maharani', 'Yoga Pratama', 'Fajar Nugroho', 'Maya Anggraini', 'Rizky Ramadhan', 'Putri Ayu', 'Hendra Wijaya', 'Laras Setiani', 'Galih Permana', 'Nadia Safitri', 'Arif Hidayat', 'Citra Wulandari', 'Dimas Aditya', 'Tari Puspita', 'Bayu Santoso', 'Indah Permata', 'Eko Prasetyo', 'Wulan Sari', 'Reza Firmansyah', 'Ayu Lestari'];
    var benih = 7;
    function acak(n) { benih = (benih * 9301 + 49297) % 233280; return Math.floor(benih / 233280 * n); }
    var hari = hariIni();
    // sisa hari tiap member: campuran aktif, segera habis, lewat
    var sisa = [40, 3, 120, -4, 18, 6, 250, -12, 25, 1, 60, 9, -2, 14, 0, 33, 75, 5, -30, 22, 200, 11, 2, 48];
    nama.forEach(function (n, i) {
      d.nomor++;
      var pk = sisa[i] > 150 ? d.paket[3] : sisa[i] > 50 ? d.paket[2] : (i % 7 === 3 ? d.paket[4] : d.paket[1]);
      var berakhir = tambahHari(hari, sisa[i]);
      var gabung = tambahHari(hari, -(40 + acak(300)));
      var m = { id: 'm' + i, kode: kodeDari(d.nomor), nama: n, wa: '0812' + String(10000000 + acak(89999999)).slice(0, 8), foto: '', gabung: gabung, berakhir: berakhir, paketId: pk.id, sesiPT: pk.sesi ? 3 + acak(5) : 0, catatan: '' };
      d.member.push(m);
      // riwayat bayar mundur dari tanggal berakhir
      var sampai = berakhir, k = 0;
      while (sampai > gabung && k < 8) {
        var mulai = tambahHari(sampai, -(pk.hari - 1));
        var tgl = mulai < gabung ? gabung : mulai;
        if (tgl <= hari) d.bayar.push({ id: 'b' + i + '_' + k, memberId: m.id, paketId: pk.id, nama: pk.nama, jumlah: pk.harga, tgl: tgl, dari: mulai, sampai: sampai, metode: ['Tunai', 'QRIS', 'Transfer'][acak(3)], admin: 'Pemilik' });
        sampai = tambahHari(mulai, -1); k++;
      }
    });
    // check-in 30 hari terakhir, ramai pagi & sore
    var jamBobot = [6, 6, 7, 7, 7, 8, 9, 10, 12, 16, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 21];
    for (var h = 29; h >= 0; h--) {
      var tglH = tambahHari(hari, -h), jml = 9 + acak(10);
      if (new Date(tglH + 'T00:00').getDay() === 0) jml = Math.round(jml * 0.6);
      for (var j = 0; j < jml; j++) {
        var mem = d.member[acak(d.member.length)];
        var jam = jamBobot[acak(jamBobot.length)];
        if (h === 0 && jam > new Date().getHours()) continue;
        d.checkin.push({ id: 'c' + h + '_' + j, memberId: mem.id, waktu: tglH + 'T' + dua(jam) + ':' + dua(acak(60)) + ':00' });
      }
    }
    d.checkin.sort(function (a, b) { return a.waktu < b.waktu ? -1 : 1; });
    return d;
  }

  function muat() {
    if (DEMO) return dataContoh();
    var d;
    try { d = JSON.parse(localStorage.getItem(KUNCI) || 'null'); } catch (e) { d = null; }
    if (!d || !d.member) return dataKosong();
    // migrasi: lengkapi field yang belum ada di data lama
    var k = dataKosong();
    ['paket', 'member', 'bayar', 'checkin', 'admin'].forEach(function (x) { if (!Array.isArray(d[x])) d[x] = k[x]; });
    d.gym = Object.assign({}, k.gym, d.gym || {});
    d.member.forEach(function (m) { if (m.sesiPT === undefined) m.sesiPT = 0; if (m.foto === undefined) m.foto = ''; });
    d.paket.forEach(function (p) { if (p.sesi === undefined) p.sesi = 0; });
    if (!d.nomor) d.nomor = d.member.length;
    if (d.gym.namaDariTema) d.gym.nama = NAMA_TEMA;
    return d;
  }
  var D;
  function simpan() {
    if (DEMO) return;
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori penuh (coba hapus foto member)'); }
  }

  // ---------- Utilitas ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function rp(n) { return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid(p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function dua(n) { return (n < 10 ? '0' : '') + n; }
  function iso(dt) { return dt.getFullYear() + '-' + dua(dt.getMonth() + 1) + '-' + dua(dt.getDate()); }
  function hariIni() { return iso(new Date()); }
  function tambahHari(t, n) { var x = new Date(t + 'T00:00'); x.setDate(x.getDate() + n); return iso(x); }
  function selisih(a, b) { return Math.round((new Date(b + 'T00:00') - new Date(a + 'T00:00')) / 864e5); }
  var BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function fmtTgl(t) { if (!t) return '-'; var p = t.slice(0, 10).split('-'); return +p[2] + ' ' + BULAN[+p[1] - 1] + ' ' + p[0]; }
  function kodeDari(n) { return 'GYM-' + String(n).padStart(4, '0'); }
  function inisial(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (s) { return s[0]; }).join('').toUpperCase(); }
  function paketDari(id) { return D.paket.find(function (p) { return p.id === id; }); }
  function memberDari(id) { return D.member.find(function (m) { return m.id === id; }); }
  function adminAktif() { return D.admin.find(function (a) { return a.id === sesi; }) || D.admin[0]; }

  function status(m) {
    var s = selisih(hariIni(), m.berakhir);
    if (s < 0) return { k: 'lewat', s: s, teks: 'Lewat ' + (-s) + ' hari' };
    if (s <= 7) return { k: 'segera', s: s, teks: s === 0 ? 'Habis hari ini' : 'Sisa ' + s + ' hari' };
    return { k: 'aktif', s: s, teks: 'Aktif · ' + s + ' hari' };
  }
  function avatar(m, besar) {
    return '<span class="avatar' + (besar ? ' besar' : '') + '" aria-hidden="true">' + (m.foto ? '<img src="' + esc(m.foto) + '" alt="">' : esc(inisial(m.nama))) + '</span>';
  }
  function nomorWA(w) {
    var n = String(w || '').replace(/\D/g, '');
    if (n.indexOf('0') === 0) n = '62' + n.slice(1);
    else if (n.indexOf('8') === 0) n = '62' + n;
    return n;
  }
  function linkWA(m) {
    var st = status(m), pk = paketDari(m.paketId);
    var sisaTeks = st.s < 0 ? 'sudah lewat ' + (-st.s) + ' hari' : st.s === 0 ? 'habis hari ini' : 'tinggal ' + st.s + ' hari lagi';
    var msg = (D.gym.pesan || PESAN_BAWAAN).replace(/\{nama\}/g, m.nama.split(' ')[0]).replace(/\{gym\}/g, D.gym.nama)
      .replace(/\{paket\}/g, pk ? pk.nama : 'member').replace(/\{tanggal\}/g, fmtTgl(m.berakhir)).replace(/\{sisa\}/g, sisaTeks).replace(/\{kode\}/g, m.kode);
    return 'https://wa.me/' + nomorWA(m.wa) + '?text=' + encodeURIComponent(msg);
  }
  var tToast;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('tampil'); clearTimeout(tToast); tToast = setTimeout(function () { el.classList.remove('tampil'); }, 2600); }
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([isi], { type: tipe }));
    a.download = nama; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csv(baris) {
    return '﻿' + baris.map(function (r) { return r.map(function (v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n');
  }
  var ILUS_KOSONG = '<svg viewBox="0 0 88 56" aria-hidden="true"><rect x="6" y="16" width="8" height="24" rx="2" fill="var(--garis-kuat)"/><rect x="14" y="10" width="9" height="36" rx="2" fill="var(--utama)"/><rect x="65" y="10" width="9" height="36" rx="2" fill="var(--utama)"/><rect x="74" y="16" width="8" height="24" rx="2" fill="var(--garis-kuat)"/><rect x="23" y="25" width="42" height="6" rx="3" fill="var(--aksen)"/></svg>';
  function kosong(t) { return '<li class="kosong">' + ILUS_KOSONG + '<span>' + esc(t) + '</span></li>'; }

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
      if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700&display=swap';
    }
    if (t.mode) { var m = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode; r.setAttribute('data-mode', m); }
    if (t.bagian) terapkanBagian(t.bagian);
    setTimeout(hitungTeksBagian, 0);
    if (t.nama) {
      NAMA_TEMA = t.nama;
      if (D && D.gym.namaDariTema) { D.gym.nama = t.nama; isiNama(); }
    }
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (customizer: warna per bagian, sorot, tap-untuk-pilih) ----------
  var PETA_BAGIAN = {
    nav: '.samping, .bawah, .masuk-merek',
    latar: 'main, .masuk-form',
    panel: '.panel, .kartu-member, .angka:not(.sorot), .hasil, dialog, .masuk-kartu',
    utama: '.tombol.utama, .nav.aktif, .chip.aktif, .angka.sorot, .pilih-admin .aktif, .berhasil:not(.peringatan)',
    aksen: '.lencana, .grafik.oranye, .saya i, .demo-pita, .pil.segera',
    teks: 'h1, h2, h3, .merek span'
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
    return L > 0.18 ? '#12150f' : '#ffffff';
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

  // ---------- Masuk (multi-admin PIN) ----------
  var sesi = null, pinMasuk = '', adminPilih = null;
  function isiNama() { $$('[data-tema-nama]').forEach(function (e) { e.textContent = D.gym.nama; }); document.title = D.gym.nama + ' · Manajemen Gym'; }
  function tampilMasuk() {
    $('#aplikasi').hidden = true; $('#layarMasuk').hidden = false;
    adminPilih = D.admin[0].id; pinMasuk = '';
    $('#daftarAdmin').innerHTML = D.admin.map(function (a) { return '<button type="button" data-id="' + a.id + '" aria-pressed="' + (a.id === adminPilih) + '" class="' + (a.id === adminPilih ? 'aktif' : '') + '">' + esc(a.nama) + '</button>'; }).join('');
    $('#padPin').innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (k) {
      return k === '' ? '<span></span>' : '<button type="button" data-k="' + k + '" aria-label="' + (k === '⌫' ? 'Hapus' : k) + '">' + k + '</button>';
    }).join('');
    titikPin();
  }
  function titikPin() { $$('#pinTitik i').forEach(function (t, i) { t.classList.toggle('isi', i < pinMasuk.length); }); }
  function tekanPin(k) {
    if (k === '⌫') pinMasuk = pinMasuk.slice(0, -1);
    else if (pinMasuk.length < 4) pinMasuk += k;
    titikPin();
    if (pinMasuk.length === 4) {
      var a = D.admin.find(function (x) { return x.id === adminPilih; });
      if (a && a.pin === pinMasuk) setTimeout(function () { masuk(a); }, 120);
      else { var p = $('#pinTitik'); p.classList.remove('salah'); void p.offsetWidth; p.classList.add('salah'); setTimeout(function () { pinMasuk = ''; titikPin(); }, 400); }
    }
  }
  function masuk(a) {
    sesi = a.id;
    try { sessionStorage.setItem(KUNCI_SESI, a.id); } catch (e) { /* abaikan */ }
    $('#layarMasuk').hidden = true; $('#aplikasi').hidden = false;
    $('#namaAdmin').textContent = a.nama; $('#inisial').textContent = inisial(a.nama);
    $$('[data-hal="atur"]').forEach(function (b) { b.hidden = a.peran !== 'pemilik'; });
    $('#pitaDemo').hidden = !DEMO;
    buka('beranda');
  }
  function keluar() {
    sesi = null; try { sessionStorage.removeItem(KUNCI_SESI); } catch (e) { /* abaikan */ }
    tampilMasuk();
  }

  // ---------- Navigasi ----------
  var halAktif = 'beranda';
  function buka(h) {
    if (h === 'atur' && adminAktif().peran !== 'pemilik') h = 'beranda';
    halAktif = h;
    $$('.hal').forEach(function (s) { s.classList.toggle('aktif', s.id === 'hal-' + h); });
    $$('.nav[data-hal]').forEach(function (b) { var on = b.getAttribute('data-hal') === h; b.classList.toggle('aktif', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    render();
    window.scrollTo(0, 0);
  }
  function render() {
    isiNama(); lencana();
    if (halAktif === 'beranda') renderBeranda();
    else if (halAktif === 'member') renderMember();
    else if (halAktif === 'tempo') renderTempo();
    else if (halAktif === 'laporan') renderLaporan();
    else if (halAktif === 'atur') renderAtur();
  }
  function lencana() {
    var n = D.member.filter(function (m) { return status(m).k !== 'aktif' && status(m).s >= -30; }).length;
    ['#lencanaTempo', '#lencanaTempo2'].forEach(function (s) { var el = $(s); el.hidden = !n; el.textContent = n; });
  }

  // ---------- Check-in ----------
  function cekHari(t) { return D.checkin.filter(function (c) { return c.waktu.slice(0, 10) === t; }); }
  function cari(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    var digit = q.replace(/\D/g, '');
    return D.member.filter(function (m) {
      return m.nama.toLowerCase().indexOf(q) >= 0 || m.kode.toLowerCase().indexOf(q) >= 0 || (digit.length >= 4 && String(m.wa).replace(/\D/g, '').indexOf(digit) >= 0);
    }).slice(0, 6);
  }
  function renderHasilCek() {
    var q = $('#cariCek').value, h = cari(q), el = $('#hasilCek');
    if (!q.trim()) { el.innerHTML = ''; return; }
    if (!h.length) { el.innerHTML = '<div class="hasil"><div class="info"><b>Tidak ditemukan</b><span class="redup kecil">Cek ejaan atau daftarkan sebagai member baru.</span></div><button class="tombol hantu kecil" data-aksi="member-baru">+ Member</button></div>'; return; }
    el.innerHTML = h.map(function (m) {
      var st = status(m);
      return '<div class="hasil">' + avatar(m) + '<div class="info"><b>' + esc(m.nama) + '</b><span class="kode">' + esc(m.kode) + '</span> <span class="pil ' + st.k + '">' + st.teks + '</span></div>' +
        '<button class="tombol utama kecil" data-cek="' + m.id + '">Check-in</button></div>';
    }).join('');
  }
  function checkIn(id) {
    var m = memberDari(id); if (!m) return;
    var t = hariIni();
    var sudah = D.checkin.some(function (c) { return c.memberId === id && c.waktu.slice(0, 10) === t; });
    var now = new Date();
    D.checkin.push({ id: uid('c'), memberId: id, waktu: t + 'T' + dua(now.getHours()) + ':' + dua(now.getMinutes()) + ':' + dua(now.getSeconds()) });
    simpan();
    var st = status(m), lewat = st.k === 'lewat';
    $('#cariCek').value = '';
    renderBeranda();
    $('#hasilCek').innerHTML = '<div class="berhasil' + (lewat ? ' peringatan' : '') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (lewat ? 'M12 7v6M12 17h.01' : 'M5 12.5l4.5 4.5L19 7') + '"/></svg>' +
      '<div class="info"><b>' + esc(m.nama) + (lewat ? ': masa aktif sudah lewat' : ' berhasil check-in') + '</b><span>' + (lewat ? 'Berakhir ' + fmtTgl(m.berakhir) + '. Tawarkan perpanjangan.' : st.teks + (sudah ? ' · sudah check-in sebelumnya hari ini' : '') + (m.sesiPT ? ' · sesi PT tersisa ' + m.sesiPT : '')) + '</span></div>' +
      (lewat || st.k === 'segera' ? '<button class="tombol ' + (lewat ? 'hantu' : 'aksen') + ' kecil" data-perpanjang="' + m.id + '">Perpanjang</button>' : '') + '</div>';
    $('#cariCek').focus();
  }
  function cekCepat() {
    var q = $('#cariCek').value.trim(); if (!q) { $('#cariCek').focus(); return; }
    var pas = D.member.find(function (m) { return m.kode.toLowerCase() === q.toLowerCase(); });
    var h = cari(q);
    if (pas) checkIn(pas.id);
    else if (h.length === 1) checkIn(h[0].id);
    else { renderHasilCek(); if (h.length) toast('Pilih salah satu member di daftar'); }
  }
  function renderBeranda() {
    var t = hariIni(), ch = cekHari(t);
    $('#tglHariIni').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var aktif = D.member.filter(function (m) { return status(m).k !== 'lewat'; }).length;
    var segera = D.member.filter(function (m) { return status(m).k === 'segera'; }).length;
    var bln = t.slice(0, 7), masuk = D.bayar.filter(function (b) { return b.tgl.slice(0, 7) === bln; }).reduce(function (s, b) { return s + b.jumlah; }, 0);
    $('#statBeranda').innerHTML = kotak('Check-in hari ini', ch.length, 'sorot') + kotak('Member aktif', aktif) + kotak('Habis ≤7 hari', segera, 'oranye') + kotak('Pendapatan bulan ini', rp(masuk));
    $('#jmlCekHari').textContent = ch.length + ' orang';
    $('#daftarCekHari').innerHTML = ch.length ? ch.slice().reverse().slice(0, 8).map(function (c) {
      var m = memberDari(c.memberId); if (!m) return '';
      return '<li><span class="jam">' + c.waktu.slice(11, 16) + '</span>' + avatar(m) + '<div class="info"><b>' + esc(m.nama) + '</b><span class="kode">' + esc(m.kode) + '</span></div><span class="pil ' + status(m).k + '">' + status(m).teks + '</span></li>';
    }).join('') : kosong('Belum ada yang check-in hari ini.');
    var tempo = D.member.filter(function (m) { var s = status(m); return s.k !== 'aktif' && s.s >= -7; }).sort(function (a, b) { return a.berakhir < b.berakhir ? -1 : 1; }).slice(0, 5);
    $('#tempoMini').innerHTML = tempo.length ? tempo.map(barisTempo).join('') : kosong('Aman, tidak ada yang jatuh tempo.');
    renderHasilCek();
  }
  function kotak(lbl, v, kls) { return '<div class="angka ' + (kls || '') + '"><span>' + lbl + '</span><b>' + v + '</b></div>'; }

  // ---------- Member ----------
  var filterM = 'semua';
  function renderMember() {
    var q = $('#cariMember').value.trim().toLowerCase();
    var list = D.member.filter(function (m) {
      var k = status(m).k;
      if (filterM === 'aktif' && k === 'lewat') return false;
      if (filterM === 'segera' && k !== 'segera') return false;
      if (filterM === 'lewat' && k !== 'lewat') return false;
      return !q || (m.nama + ' ' + m.kode + ' ' + m.wa).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
    $('#infoMember').textContent = D.member.length + ' member terdaftar · ' + list.length + ' tampil';
    $('#gridMember').innerHTML = list.length ? list.map(function (m, i) {
      var st = status(m), pk = paketDari(m.paketId);
      return '<button class="kartu-member" data-member="' + m.id + '" style="animation-delay:' + Math.min(i, 12) * 30 + 'ms" aria-label="' + esc(m.nama + ', ' + st.teks) + '">' + avatar(m) +
        '<span class="info"><b>' + esc(m.nama) + '</b><span class="kode">' + esc(m.kode) + ' · ' + esc(pk ? pk.nama : '-') + '</span><br><span class="pil ' + st.k + '">' + st.teks + '</span></span></button>';
    }).join('') : '<ul class="daftar-tempo">' + kosong(D.member.length ? 'Tidak ada member yang cocok.' : 'Belum ada member. Tambahkan member pertama.') + '</ul>';
  }

  // ---------- Dialog ----------
  var dlg;
  function bukaDlg(html) { $('#dlgIsi').innerHTML = html; if (!dlg.open) dlg.showModal(); var f = $('#dlgIsi input:not([type=hidden]):not([type=file]), #dlgIsi select'); if (f) f.focus(); }
  function tutupDlg() { if (dlg.open) dlg.close(); }
  function kepalaDlg(j) { return '<div class="dlg-kepala"><h3 id="dlgJudul">' + j + '</h3><button type="button" class="tutup" data-aksi="tutup" aria-label="Tutup">×</button></div>'; }
  function opsiPaket(sel) { return D.paket.map(function (p) { return '<option value="' + p.id + '"' + (p.id === sel ? ' selected' : '') + '>' + esc(p.nama) + ' · ' + rp(p.harga) + '</option>'; }).join(''); }

  function formMember(m) {
    var baru = !m;
    m = m || { nama: '', wa: '', foto: '', gabung: hariIni(), paketId: (D.paket[1] || D.paket[0] || {}).id, catatan: '' };
    fotoSementara = m.foto || '';
    bukaDlg(kepalaDlg(baru ? 'Member baru' : 'Ubah member') +
      '<form id="fMember" class="form">' +
      '<div class="foto-pilih"><span id="fotoPrev">' + avatar(m, true) + '</span><div><label class="tombol hantu kecil">Pilih foto (opsional)<input type="file" accept="image/*" id="fotoFile" hidden></label>' + (m.foto ? ' <button type="button" class="tautan" data-aksi="hapus-foto">Hapus foto</button>' : '') + '</div></div>' +
      '<label>Nama lengkap<input name="nama" required maxlength="60" value="' + esc(m.nama) + '"></label>' +
      '<div class="grid2"><label>No. WhatsApp<input name="wa" inputmode="tel" maxlength="20" placeholder="08xx" value="' + esc(m.wa) + '"></label>' +
      '<label>Tanggal gabung<input name="gabung" type="date" required value="' + esc(m.gabung) + '"></label></div>' +
      (baru ? '<div class="grid2"><label>Paket pertama<select name="paket">' + opsiPaket(m.paketId) + '</select></label><label>Metode bayar<select name="metode"><option>Tunai</option><option>QRIS</option><option>Transfer</option></select></label></div>' : '') +
      '<label>Catatan<input name="catatan" maxlength="120" value="' + esc(m.catatan) + '" placeholder="mis. cedera lutut, target turun BB"></label>' +
      '<button class="tombol utama besar">' + (baru ? 'Simpan & catat pembayaran' : 'Simpan perubahan') + '</button></form>');
    $('#fMember').onsubmit = function (e) {
      e.preventDefault(); var f = e.target;
      var nama = f.nama.value.trim(); if (!nama) return;
      if (baru) {
        D.nomor++;
        var nm = { id: uid('m'), kode: kodeDari(D.nomor), nama: nama, wa: f.wa.value.trim(), foto: fotoSementara, gabung: f.gabung.value, berakhir: tambahHari(f.gabung.value, -1), paketId: f.paket.value, sesiPT: 0, catatan: f.catatan.value.trim() };
        D.member.push(nm);
        catatBayar(nm, f.paket.value, f.metode.value, f.gabung.value);
        simpan(); toast('Member ' + nama + ' terdaftar · ' + nm.kode); detailMember(nm.id);
      } else {
        m.nama = nama; m.wa = f.wa.value.trim(); m.gabung = f.gabung.value; m.catatan = f.catatan.value.trim(); m.foto = fotoSementara;
        simpan(); toast('Data member disimpan'); detailMember(m.id);
      }
      render();
    };
  }
  var fotoSementara = '';
  function bacaFoto(file) {
    if (!file || !/^image\//.test(file.type)) return;
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = 160, c = document.createElement('canvas'); c.width = c.height = s;
        var k = Math.min(img.width, img.height), x = c.getContext('2d');
        x.drawImage(img, (img.width - k) / 2, (img.height - k) / 2, k, k, 0, 0, s, s);
        fotoSementara = c.toDataURL('image/jpeg', 0.8);
        $('#fotoPrev').innerHTML = avatar({ foto: fotoSementara, nama: '' }, true);
      };
      img.onerror = function () { toast('Foto tidak bisa dibaca'); };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  function catatBayar(m, paketId, metode, tgl) {
    var pk = paketDari(paketId); if (!pk) return;
    var t = tgl || hariIni();
    var mulai = m.berakhir >= t ? tambahHari(m.berakhir, 1) : t;
    var sampai = tambahHari(mulai, pk.hari - 1);
    m.berakhir = sampai; m.paketId = pk.id; m.sesiPT = (m.sesiPT || 0) + (pk.sesi || 0);
    D.bayar.push({ id: uid('b'), memberId: m.id, paketId: pk.id, nama: pk.nama, jumlah: pk.harga, tgl: t, dari: mulai, sampai: sampai, metode: metode, admin: adminAktif().nama });
  }
  function formPerpanjang(id) {
    var m = memberDari(id); if (!m) return;
    bukaDlg(kepalaDlg('Perpanjang · ' + esc(m.nama)) +
      '<form id="fBayar" class="form"><p class="redup kecil">Masa aktif sekarang berakhir ' + fmtTgl(m.berakhir) + '. Kalau masih aktif, paket baru disambung setelahnya.</p>' +
      '<label>Paket<select name="paket">' + opsiPaket(m.paketId) + '</select></label>' +
      '<div class="grid2"><label>Metode bayar<select name="metode"><option>Tunai</option><option>QRIS</option><option>Transfer</option></select></label><label>Tanggal bayar<input type="date" name="tgl" value="' + hariIni() + '" required></label></div>' +
      '<div class="ringkas-baris"><span>Aktif sampai</span><b id="prevSampai"></b></div><div class="ringkas-baris"><span>Total bayar</span><b id="prevHarga"></b></div>' +
      '<button class="tombol utama besar">Catat pembayaran</button></form>');
    var f = $('#fBayar');
    function prev() {
      var pk = paketDari(f.paket.value), t = f.tgl.value || hariIni();
      var mulai = m.berakhir >= t ? tambahHari(m.berakhir, 1) : t;
      $('#prevSampai').textContent = fmtTgl(tambahHari(mulai, pk.hari - 1)); $('#prevHarga').textContent = rp(pk.harga);
    }
    f.onchange = prev; prev();
    f.onsubmit = function (e) { e.preventDefault(); catatBayar(m, f.paket.value, f.metode.value, f.tgl.value); simpan(); toast('Pembayaran tercatat, aktif sampai ' + fmtTgl(m.berakhir)); detailMember(m.id); render(); };
  }

  function detailMember(id) {
    var m = memberDari(id); if (!m) return;
    var st = status(m), pk = paketDari(m.paketId);
    var byr = D.bayar.filter(function (b) { return b.memberId === id; }).sort(function (a, b) { return a.tgl < b.tgl ? 1 : -1; });
    var nCek = D.checkin.filter(function (c) { return c.memberId === id; });
    var akhirCek = nCek.length ? nCek[nCek.length - 1].waktu : '';
    bukaDlg(kepalaDlg('Detail member') +
      '<div class="profil">' + avatar(m, true) + '<div><b style="font-size:20px">' + esc(m.nama) + '</b><br><span class="kode">' + esc(m.kode) + '</span> <span class="pil ' + st.k + '">' + st.teks + '</span></div></div>' +
      '<div class="kartu-qr" id="kartuQR"><div class="qr" id="qrBox" role="img" aria-label="QR kode ' + esc(m.kode) + '"></div><div><span class="gym">' + esc(D.gym.nama) + '</span><b>' + esc(m.nama) + '</b><span class="kode">' + esc(m.kode) + '</span><br><span class="kecil">Berlaku s/d ' + fmtTgl(m.berakhir) + '</span></div></div>' +
      '<div>' +
      '<div class="ringkas-baris"><span>Paket</span><b>' + esc(pk ? pk.nama : '-') + '</b></div>' +
      '<div class="ringkas-baris"><span>Gabung</span><b>' + fmtTgl(m.gabung) + '</b></div>' +
      '<div class="ringkas-baris"><span>WhatsApp</span><b>' + esc(m.wa || '-') + '</b></div>' +
      (m.sesiPT ? '<div class="ringkas-baris"><span>Sesi PT tersisa</span><b>' + m.sesiPT + '</b></div>' : '') +
      '<div class="ringkas-baris"><span>Total check-in</span><b>' + nCek.length + (akhirCek ? ' · terakhir ' + fmtTgl(akhirCek) : '') + '</b></div>' +
      (m.catatan ? '<div class="ringkas-baris"><span>Catatan</span><b>' + esc(m.catatan) + '</b></div>' : '') +
      '</div>' +
      '<div class="baris-tombol"><button class="tombol utama" data-perpanjang="' + m.id + '">Perpanjang</button><button class="tombol hantu" data-cek="' + m.id + '">Check-in</button>' +
      (m.wa ? '<a class="tombol wa" target="_blank" rel="noopener" href="' + esc(linkWA(m)) + '">Ingatkan via WA</a>' : '') +
      (m.sesiPT ? '<button class="tombol hantu" data-sesi="' + m.id + '">Pakai 1 sesi PT</button>' : '') + '</div>' +
      '<div class="baris-tombol"><button class="tombol hantu kecil" data-aksi="cetak-kartu">Cetak kartu</button><button class="tombol hantu kecil" data-ubah="' + m.id + '">Ubah data</button><button class="tombol bahaya kecil" data-hapus="' + m.id + '">Hapus member</button></div>' +
      '<h3>Riwayat pembayaran</h3><ul class="daftar-atur">' + (byr.length ? byr.slice(0, 10).map(function (b) {
        return '<li><div class="info"><b>' + esc(b.nama) + '</b><span class="redup kecil">' + fmtTgl(b.tgl) + ' · ' + esc(b.metode) + ' · aktif ' + fmtTgl(b.dari) + ' – ' + fmtTgl(b.sampai) + '</span></div><span class="harga">' + rp(b.jumlah) + '</span></li>';
      }).join('') : kosong('Belum ada pembayaran.')) + '</ul>');
    buatQR($('#qrBox'), m.kode);
  }
  function buatQR(el, teks) {
    el.innerHTML = '';
    if (window.QRCode) {
      try { new window.QRCode(el, { text: teks, width: 116, height: 116, colorDark: '#000000', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M }); el.removeAttribute('title'); return; } catch (e) { /* jatuh ke teks */ }
    }
    el.textContent = teks;
  }

  // ---------- Jatuh tempo ----------
  function barisTempo(m) {
    var st = status(m);
    return '<li>' + avatar(m) + '<div class="info"><b>' + esc(m.nama) + '</b><span class="pil ' + st.k + '">' + st.teks + '</span> <span class="redup kecil">' + fmtTgl(m.berakhir) + '</span></div><div class="aksi">' +
      (m.wa ? '<a class="tombol wa kecil" target="_blank" rel="noopener" href="' + esc(linkWA(m)) + '" aria-label="Kirim pengingat WhatsApp ke ' + esc(m.nama) + '">WA</a>' : '<span class="redup kecil">tanpa WA</span>') +
      '<button class="tombol hantu kecil" data-perpanjang="' + m.id + '">Perpanjang</button></div></li>';
  }
  function renderTempo() {
    var lewat = D.member.filter(function (m) { return status(m).k === 'lewat'; }).sort(function (a, b) { return a.berakhir < b.berakhir ? 1 : -1; });
    var segera = D.member.filter(function (m) { return status(m).k === 'segera'; }).sort(function (a, b) { return a.berakhir < b.berakhir ? -1 : 1; });
    $('#jmlLewat').textContent = lewat.length; $('#jmlSegera').textContent = segera.length;
    $('#tempoLewat').innerHTML = lewat.length ? lewat.map(barisTempo).join('') : kosong('Tidak ada yang lewat jatuh tempo.');
    $('#tempoSegera').innerHTML = segera.length ? segera.map(barisTempo).join('') : kosong('Tidak ada yang habis minggu ini.');
  }

  // ---------- Laporan ----------
  function grafik(data, fmt) {
    var maks = Math.max.apply(null, data.map(function (d) { return d.v; }).concat([1]));
    return data.map(function (d, i) {
      return '<div class="kol"><span class="nilai">' + (d.v ? fmt(d.v) : '') + '</span><div class="batang" style="height:' + Math.max(1, d.v / maks * 100) + '%;animation-delay:' + i * 25 + 'ms" title="' + esc(d.l + ': ' + fmt(d.v)) + '"></div><span class="lbl">' + d.l + '</span></div>';
    }).join('');
  }
  function renderLaporan() {
    var t = hariIni();
    var aktif = D.member.filter(function (m) { return status(m).k !== 'lewat'; }).length;
    var c30 = D.checkin.filter(function (c) { return selisih(c.waktu.slice(0, 10), t) < 30; });
    var bln = t.slice(0, 7), masuk = D.bayar.filter(function (b) { return b.tgl.slice(0, 7) === bln; }).reduce(function (s, b) { return s + b.jumlah; }, 0);
    var baru = D.member.filter(function (m) { return m.gabung.slice(0, 7) === bln; }).length;
    $('#statLaporan').innerHTML = kotak('Member aktif', aktif + ' <small class="kecil redup">/ ' + D.member.length + '</small>', 'sorot') + kotak('Rata-rata check-in/hari', (c30.length / 30).toFixed(1)) + kotak('Member baru bulan ini', baru, 'oranye') + kotak('Pendapatan bulan ini', rp(masuk));
    var hari = [];
    for (var i = 13; i >= 0; i--) { var d = tambahHari(t, -i); hari.push({ l: +d.slice(8) + '/' + +d.slice(5, 7), v: cekHari(d).length }); }
    $('#grafikHari').innerHTML = grafik(hari, function (v) { return v; });
    var jam = {}; c30.forEach(function (c) { var j = +c.waktu.slice(11, 13); jam[j] = (jam[j] || 0) + 1; });
    var maksJ = Math.max.apply(null, Object.keys(jam).map(function (k) { return jam[k]; }).concat([1]));
    var isiJam = '';
    for (var j = 5; j <= 22; j++) { var k = (jam[j] || 0) / maksJ; isiJam += '<div style="--k:' + k.toFixed(2) + ';animation-delay:' + (j - 5) * 20 + 'ms" class="' + (k >= 0.5 ? 'panas' : '') + '" title="' + (jam[j] || 0) + ' check-in"><b>' + dua(j) + '</b>' + (jam[j] || 0) + '</div>'; }
    $('#grafikJam').innerHTML = isiJam;
    var bulan = [];
    for (var b = 5; b >= 0; b--) { var x = new Date(); x.setDate(1); x.setMonth(x.getMonth() - b); var kb = x.getFullYear() + '-' + dua(x.getMonth() + 1); bulan.push({ l: BULAN[x.getMonth()], v: D.bayar.filter(function (y) { return y.tgl.slice(0, 7) === kb; }).reduce(function (s, y) { return s + y.jumlah; }, 0) }); }
    $('#grafikBulan').innerHTML = grafik(bulan, function (v) { return v >= 1e6 ? (v / 1e6).toFixed(1).replace('.', ',') + 'jt' : Math.round(v / 1e3) + 'rb'; });
    var akhir = D.bayar.slice().sort(function (a, b) { return a.tgl < b.tgl ? 1 : -1; }).slice(0, 10);
    $('#tabelBayar').innerHTML = '<thead><tr><th>Tanggal</th><th>Member</th><th>Paket</th><th>Metode</th><th class="kanan">Jumlah</th></tr></thead><tbody>' +
      (akhir.length ? akhir.map(function (y) { var m = memberDari(y.memberId); return '<tr><td>' + fmtTgl(y.tgl) + '</td><td>' + esc(m ? m.nama : '(dihapus)') + '</td><td>' + esc(y.nama) + '</td><td>' + esc(y.metode) + '</td><td class="kanan">' + rp(y.jumlah) + '</td></tr>'; }).join('') : '<tr><td colspan="5" class="redup">Belum ada pembayaran.</td></tr>') + '</tbody>';
  }
  function eksporCSV(jenis) {
    var t = hariIni();
    if (jenis === 'member') unduh('member-' + t + '.csv', csv([['kode', 'nama', 'wa', 'gabung', 'paket', 'berakhir', 'status', 'sesi_pt', 'catatan']].concat(D.member.map(function (m) { var p = paketDari(m.paketId); return [m.kode, m.nama, m.wa, m.gabung, p ? p.nama : '', m.berakhir, status(m).teks, m.sesiPT, m.catatan]; }))), 'text/csv');
    else if (jenis === 'bayar') unduh('pembayaran-' + t + '.csv', csv([['tanggal', 'kode', 'member', 'paket', 'jumlah', 'metode', 'aktif_dari', 'aktif_sampai', 'admin']].concat(D.bayar.map(function (b) { var m = memberDari(b.memberId); return [b.tgl, m ? m.kode : '', m ? m.nama : '', b.nama, b.jumlah, b.metode, b.dari, b.sampai, b.admin]; }))), 'text/csv');
    else unduh('checkin-' + t + '.csv', csv([['tanggal', 'jam', 'kode', 'member']].concat(D.checkin.map(function (c) { var m = memberDari(c.memberId); return [c.waktu.slice(0, 10), c.waktu.slice(11, 16), m ? m.kode : '', m ? m.nama : '']; }))), 'text/csv');
    toast('CSV diunduh');
  }

  // ---------- Atur ----------
  function renderAtur() {
    var f = $('#formGym');
    f.nama.value = D.gym.nama; f.alamat.value = D.gym.alamat || ''; f.wa.value = D.gym.wa || ''; f.pesan.value = D.gym.pesan || PESAN_BAWAAN;
    $('#daftarPaket').innerHTML = D.paket.length ? D.paket.map(function (p) {
      return '<li><div class="info"><b>' + esc(p.nama) + '</b><span class="redup kecil">' + p.hari + ' hari' + (p.sesi ? ' · ' + p.sesi + ' sesi PT' : '') + '</span></div><span class="harga">' + rp(p.harga) + '</span><button class="tombol hantu kecil" data-paket="' + p.id + '">Ubah</button></li>';
    }).join('') : kosong('Belum ada paket.');
    $('#daftarAdminAtur').innerHTML = D.admin.map(function (a) {
      return '<li><span class="avatar" aria-hidden="true">' + esc(inisial(a.nama)) + '</span><div class="info"><b>' + esc(a.nama) + '</b><span class="redup kecil">' + (a.peran === 'pemilik' ? 'Pemilik (akses penuh)' : 'Staf (tanpa menu Atur)') + '</span></div><button class="tombol hantu kecil" data-admin="' + a.id + '">Ubah</button></li>';
    }).join('');
  }
  function formPaket(id) {
    var p = D.paket.find(function (x) { return x.id === id; }), baru = !p;
    p = p || { nama: '', hari: 30, harga: 0, sesi: 0 };
    bukaDlg(kepalaDlg(baru ? 'Paket baru' : 'Ubah paket') + '<form id="fPaket" class="form">' +
      '<label>Nama paket<input name="nama" required maxlength="40" value="' + esc(p.nama) + '" placeholder="mis. Bulanan Pelajar"></label>' +
      '<div class="grid2"><label>Durasi (hari)<input name="hari" type="number" min="1" max="3660" required value="' + p.hari + '"></label><label>Harga (Rp)<input name="harga" type="number" min="0" step="500" required value="' + p.harga + '"></label></div>' +
      '<label>Sesi personal trainer (0 = tanpa PT)<input name="sesi" type="number" min="0" max="200" value="' + (p.sesi || 0) + '"></label>' +
      '<p class="redup kecil">Contoh durasi: harian 1, bulanan 30, 3 bulan 90, tahunan 365.</p>' +
      '<div class="baris-tombol"><button class="tombol utama">Simpan paket</button>' + (baru ? '' : '<button type="button" class="tombol bahaya" data-hapus-paket="' + p.id + '">Hapus</button>') + '</div></form>');
    $('#fPaket').onsubmit = function (e) {
      e.preventDefault(); var f = e.target;
      var v = { nama: f.nama.value.trim(), hari: Math.max(1, +f.hari.value || 1), harga: Math.max(0, +f.harga.value || 0), sesi: Math.max(0, +f.sesi.value || 0) };
      if (baru) D.paket.push(Object.assign({ id: uid('pk') }, v)); else Object.assign(p, v);
      simpan(); tutupDlg(); render(); toast('Paket disimpan');
    };
  }
  function formAdmin(id) {
    var a = D.admin.find(function (x) { return x.id === id; }), baru = !a;
    a = a || { nama: '', pin: '', peran: 'staf' };
    var satuPemilik = D.admin.filter(function (x) { return x.peran === 'pemilik'; }).length <= 1 && a.peran === 'pemilik';
    bukaDlg(kepalaDlg(baru ? 'Admin baru' : 'Ubah admin') + '<form id="fAdmin" class="form">' +
      '<label>Nama<input name="nama" required maxlength="30" value="' + esc(a.nama) + '"></label>' +
      '<div class="grid2"><label>PIN 4 angka<input name="pin" required inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" value="' + esc(a.pin) + '"></label>' +
      '<label>Peran<select name="peran"' + (satuPemilik ? ' disabled' : '') + '><option value="pemilik"' + (a.peran === 'pemilik' ? ' selected' : '') + '>Pemilik</option><option value="staf"' + (a.peran === 'staf' ? ' selected' : '') + '>Staf</option></select></label></div>' +
      (satuPemilik ? '<p class="redup kecil">Minimal harus ada satu pemilik.</p>' : '') +
      '<div class="baris-tombol"><button class="tombol utama">Simpan admin</button>' + (baru || satuPemilik || a.id === sesi ? '' : '<button type="button" class="tombol bahaya" data-hapus-admin="' + a.id + '">Hapus</button>') + '</div></form>');
    $('#fAdmin').onsubmit = function (e) {
      e.preventDefault(); var f = e.target;
      if (!/^\d{4}$/.test(f.pin.value)) { toast('PIN harus 4 angka'); return; }
      var v = { nama: f.nama.value.trim(), pin: f.pin.value, peran: satuPemilik ? 'pemilik' : f.peran.value };
      if (baru) D.admin.push(Object.assign({ id: uid('a') }, v)); else Object.assign(a, v);
      simpan(); tutupDlg(); render(); toast('Admin disimpan');
      if (a.id === sesi) $('#namaAdmin').textContent = a.nama;
    };
  }
  function konfirmasi(judul, teks, label, lanjut) {
    bukaDlg(kepalaDlg(judul) + '<p>' + teks + '</p><div class="baris-tombol"><button class="tombol bahaya" id="btnYa">' + label + '</button><button class="tombol hantu" data-aksi="tutup">Batal</button></div>');
    $('#btnYa').onclick = function () { lanjut(); };
  }

  function backup() { unduh('backup-manajemen-gym-' + hariIni() + '.json', JSON.stringify(D, null, 1), 'application/json'); toast('Backup diunduh'); }
  function impor(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (!d || !Array.isArray(d.member) || !Array.isArray(d.admin)) throw new Error('format');
        konfirmasi('Pulihkan backup?', 'Data sekarang akan diganti isi berkas (' + d.member.length + ' member). Unduh backup data sekarang dulu bila ragu.', 'Ganti data', function () {
          localStorage.setItem(KUNCI, JSON.stringify(d)); D = muat(); simpan(); tutupDlg(); toast('Data dipulihkan'); keluar();
        });
      } catch (e) { toast('Berkas bukan backup Manajemen Gym'); }
    };
    r.readAsText(file);
  }

  // ---------- Event ----------
  function ikatEvent() {
    dlg = $('#dlg');
    dlg.addEventListener('click', function (e) { if (e.target === dlg) tutupDlg(); });
    $('#daftarAdmin').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      adminPilih = b.getAttribute('data-id'); pinMasuk = ''; titikPin();
      $$('#daftarAdmin button').forEach(function (x) { var on = x === b; x.classList.toggle('aktif', on); x.setAttribute('aria-pressed', on); });
    });
    $('#padPin').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) tekanPin(b.getAttribute('data-k')); });
    document.addEventListener('keydown', function (e) {
      if ($('#layarMasuk').hidden) return;
      if (/^\d$/.test(e.key)) tekanPin(e.key); else if (e.key === 'Backspace') tekanPin('⌫');
    });
    $('#btnKeluar').onclick = keluar;
    $$('.nav[data-hal]').forEach(function (b) { b.addEventListener('click', function () { buka(b.getAttribute('data-hal')); }); });
    $('#cariCek').addEventListener('input', renderHasilCek);
    $('#cariCek').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); cekCepat(); } });
    $('#btnCek').onclick = cekCepat;
    $('#cariMember').addEventListener('input', renderMember);
    $('#filterMember').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return; filterM = b.getAttribute('data-f');
      $$('#filterMember .chip').forEach(function (x) { x.classList.toggle('aktif', x === b); x.setAttribute('aria-pressed', x === b); }); renderMember();
    });
    $('#formGym').onsubmit = function (e) {
      e.preventDefault(); var f = e.target;
      var nama = f.nama.value.trim();
      if (nama !== D.gym.nama) D.gym.namaDariTema = false;
      D.gym.nama = nama; D.gym.alamat = f.alamat.value.trim(); D.gym.wa = f.wa.value.trim(); D.gym.pesan = f.pesan.value.trim() || PESAN_BAWAAN;
      simpan(); isiNama(); toast('Profil gym disimpan');
    };
    $('#fileImpor').addEventListener('change', function (e) { if (e.target.files[0]) impor(e.target.files[0]); e.target.value = ''; });
    document.addEventListener('change', function (e) { if (e.target.id === 'fotoFile') bacaFoto(e.target.files[0]); });
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-aksi],[data-cek],[data-perpanjang],[data-member],[data-ubah],[data-hapus],[data-sesi],[data-paket],[data-admin],[data-hapus-paket],[data-hapus-admin],[data-ke]');
      if (!t) return;
      var g = function (a) { return t.getAttribute(a); };
      if (g('data-ke')) return buka(g('data-ke'));
      if (g('data-cek')) { tutupDlg(); if (halAktif !== 'beranda') buka('beranda'); return checkIn(g('data-cek')); }
      if (g('data-perpanjang')) return formPerpanjang(g('data-perpanjang'));
      if (g('data-member')) return detailMember(g('data-member'));
      if (g('data-ubah')) return formMember(memberDari(g('data-ubah')));
      if (g('data-sesi')) { var ms = memberDari(g('data-sesi')); if (ms && ms.sesiPT > 0) { ms.sesiPT--; simpan(); toast('Sesi PT dipakai, sisa ' + ms.sesiPT); detailMember(ms.id); } return; }
      if (g('data-paket')) return formPaket(g('data-paket'));
      if (g('data-admin')) return formAdmin(g('data-admin'));
      if (g('data-hapus')) {
        var mh = memberDari(g('data-hapus'));
        return konfirmasi('Hapus member?', 'Hapus <b>' + esc(mh.nama) + '</b> beserta riwayat check-in. Riwayat pembayaran tetap ada di laporan.', 'Hapus', function () {
          D.member = D.member.filter(function (m) { return m.id !== mh.id; }); D.checkin = D.checkin.filter(function (c) { return c.memberId !== mh.id; });
          simpan(); tutupDlg(); render(); toast('Member dihapus');
        });
      }
      if (g('data-hapus-paket')) {
        var idp = g('data-hapus-paket');
        if (D.member.some(function (m) { return m.paketId === idp; })) { toast('Paket masih dipakai member, ubah saja harganya'); return; }
        D.paket = D.paket.filter(function (p) { return p.id !== idp; }); simpan(); tutupDlg(); render(); toast('Paket dihapus'); return;
      }
      if (g('data-hapus-admin')) { var ida = g('data-hapus-admin'); D.admin = D.admin.filter(function (a) { return a.id !== ida; }); simpan(); tutupDlg(); render(); toast('Admin dihapus'); return; }
      switch (g('data-aksi')) {
        case 'tutup': tutupDlg(); break;
        case 'member-baru': formMember(null); break;
        case 'hapus-foto': fotoSementara = ''; $('#fotoPrev').innerHTML = avatar({ foto: '', nama: $('#fMember').nama.value }, true); break;
        case 'cetak-kartu': window.print(); break;
        case 'paket-baru': formPaket(null); break;
        case 'admin-baru': formAdmin(null); break;
        case 'csv-member': eksporCSV('member'); break;
        case 'csv-bayar': eksporCSV('bayar'); break;
        case 'csv-cek': eksporCSV('cek'); break;
        case 'backup': backup(); break;
        case 'reset': konfirmasi('Hapus semua data?', 'Semua member, pembayaran, dan check-in di perangkat ini akan hilang dan tidak bisa dikembalikan. Unduh backup dulu.', 'Hapus semua', function () {
          localStorage.removeItem(KUNCI); D = dataKosong(); simpan(); tutupDlg(); keluar(); toast('Data dihapus');
        }); break;
      }
    });
  }

  // ---------- Mulai ----------
  D = muat();
  ikatEvent();
  isiNama();
  tandaiBagian(); hitungTeksBagian();
  var idSesi = null; try { idSesi = sessionStorage.getItem(KUNCI_SESI); } catch (e) { /* abaikan */ }
  var a = D.admin.find(function (x) { return x.id === idSesi; });
  if (DEMO) masuk(D.admin[0]); else if (a) masuk(a); else tampilMasuk();
  // QR lib dimuat defer; render ulang kartu yang sudah terbuka
  window.addEventListener('load', function () { var q = $('#qrBox'); if (q && window.QRCode && !q.querySelector('img,canvas')) buatQR(q, q.textContent); });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(function () {});
  window.__gym = { get D() { return D; }, buka: buka, checkIn: checkIn, detailMember: detailMember };
})();
