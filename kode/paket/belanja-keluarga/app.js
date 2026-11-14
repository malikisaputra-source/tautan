/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* Anggaran Belanja Keluarga — Maliki Studio (malikisaputra.biz.id). Lisensi Nonkomersial Maliki Studio. */
/* KONFIG — ganti logo & foto di sini (atau timpa berkas di img/). */
var KONFIG = { logo: 'img/logo.svg', avatar: 'img/avatar.svg' };
(function () {
  'use strict';

  // ================= Utilitas =================
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function rp(n) { var s = Math.round(Math.abs(n || 0)).toLocaleString('id-ID'); return (n < 0 ? '-Rp' : 'Rp') + s; }
  function rpPendek(n) {
    var a = Math.abs(n), t = n < 0 ? '-' : '';
    if (a >= 1e6) return t + (a / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
    if (a >= 1e3) return t + Math.round(a / 1e3) + ' rb';
    return t + a;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function dua(n) { return (n < 10 ? '0' : '') + n; }
  function tglKey(d) { return d.getFullYear() + '-' + dua(d.getMonth() + 1) + '-' + dua(d.getDate()); }
  function blnKey(d) { return d.getFullYear() + '-' + dua(d.getMonth() + 1); }
  function dariKey(k) { var p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2] || 1); }
  function angka(s) { return Number(String(s || '').replace(/[^\d]/g, '')) || 0; }
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  function labelBulan(k) { var d = dariKey(k); return BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
  function labelTgl(k) { var d = dariKey(k); return HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()].slice(0, 3); }
  var GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IKON = { dapur: 'Belanja dapur', listrik: 'Listrik', transport: 'Transport', sekolah: 'Sekolah', jajan: 'Jajan', sehat: 'Kesehatan', sosial: 'Sosial', rumah: 'Rumah', pulsa: 'Pulsa', anak: 'Anak', hadiah: 'Hadiah', lain: 'Lainnya' };
  function ikon(n, kelas) { return '<svg' + (kelas ? ' class="' + kelas + '"' : '') + ' aria-hidden="true"><use href="#' + n + '"/></svg>'; }

  // ================= Data (localStorage) =================
  var KUNCI = 'belanja-keluarga-v1';
  var VERSI = 1;
  function dataKosong() {
    return { versi: VERSI, profil: { pemasukan: 6000000, gajian: 25, namaDariTema: true }, amplop: [], belanja: [], geser: [], target: [] };
  }
  function semai(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function dataContoh() {
    var d = dataKosong();
    d.amplop = [
      ['dapur', 'Dapur & pasar', 'dapur', 2000000], ['listrik', 'Listrik & air', 'listrik', 600000],
      ['transport', 'Transport', 'transport', 700000], ['sekolah', 'Sekolah anak', 'sekolah', 900000],
      ['jajan', 'Jajan & hiburan', 'jajan', 400000], ['sehat', 'Kesehatan', 'sehat', 300000],
      ['sosial', 'Arisan & sosial', 'sosial', 250000], ['pulsa', 'Pulsa & internet', 'pulsa', 350000]
    ].map(function (a) { return { id: a[0], nama: a[1], ikon: a[2], batas: a[3] }; });
    var kini = new Date(), hariIni = kini.getDate();
    // bulan ini: dibuat agar ada amplop aman, hampir habis (≥80%) dan lewat batas
    var contoh = [
      [1, 'listrik', 500000, 'Token listrik PLN'], [1, 'pulsa', 330000, 'Wifi rumah bulanan'], [1, 'sekolah', 450000, 'SPP Raka'],
      [1, 'dapur', 385000, 'Belanja bulanan di pasar'], [2, 'transport', 120000, 'Bensin motor'], [2, 'jajan', 85000, 'Martabak manis'],
      [3, 'dapur', 64000, 'Sayur & tempe'], [3, 'sosial', 100000, 'Arisan RT'], [4, 'listrik', 150000, 'PDAM'],
      [4, 'jajan', 120000, 'Nonton bioskop berdua'], [5, 'sekolah', 95000, 'Buku tulis & LKS'], [5, 'dapur', 152000, 'Beras 10 kg'],
      [6, 'transport', 45000, 'Ojol ke kantor'], [6, 'jajan', 140000, 'Makan bakso sekeluarga'], [7, 'dapur', 58000, 'Telur & minyak'],
      [7, 'sehat', 42000, 'Vitamin anak'], [8, 'transport', 100000, 'Bensin motor'], [9, 'dapur', 210000, 'Belanja mingguan'],
      [10, 'jajan', 35000, 'Es krim'], [11, 'sekolah', 60000, 'Iuran kegiatan'], [12, 'dapur', 73000, 'Ikan & ayam']
    ];
    var n = 0;
    contoh.forEach(function (c) {
      var hari = c[0];
      if (hariIni < 7) hari = Math.min(hari, hariIni); else if (hari > hariIni) return;
      var t = new Date(kini.getFullYear(), kini.getMonth(), hari, 8 + (n++ % 11), (n * 13) % 60);
      d.belanja.push({ id: 'c' + n, waktu: t.toISOString(), tgl: tglKey(t), amplop: c[1], nominal: c[2], catatan: c[3] });
    });
    // bulan lalu: acak tapi wajar
    var acak = semai(11), lalu = new Date(kini.getFullYear(), kini.getMonth() - 1, 1);
    var hariLalu = new Date(lalu.getFullYear(), lalu.getMonth() + 1, 0).getDate();
    var catatan = { dapur: ['Belanja pasar', 'Sayur & lauk', 'Beras', 'Gas elpiji 3 kg'], listrik: ['Token listrik', 'PDAM'], transport: ['Bensin', 'Ojol', 'Parkir'], sekolah: ['SPP', 'Seragam', 'Buku'], jajan: ['Kopi susu', 'Bakso', 'Martabak'], sehat: ['Obat batuk', 'Vitamin'], sosial: ['Arisan', 'Kondangan'], pulsa: ['Wifi', 'Paket data'] };
    d.amplop.forEach(function (a) {
      var target = a.batas * (0.7 + acak() * 0.35), total = 0;
      while (total < target) {
        var nom = Math.round((a.batas * (0.06 + acak() * 0.22)) / 1000) * 1000;
        var t = new Date(lalu.getFullYear(), lalu.getMonth(), 1 + Math.floor(acak() * hariLalu), 7 + Math.floor(acak() * 13), Math.floor(acak() * 60));
        var cs = catatan[a.id];
        d.belanja.push({ id: 'l' + (n++), waktu: t.toISOString(), tgl: tglKey(t), amplop: a.id, nominal: nom, catatan: cs[Math.floor(acak() * cs.length)] });
        total += nom;
      }
    });
    d.geser.push({ id: 'g1', bulan: blnKey(kini), dari: 'sosial', ke: 'jajan', nominal: 50000, waktu: new Date(kini.getFullYear(), kini.getMonth(), 1).toISOString() });
    d.target = [
      { id: 't1', nama: 'Dana darurat', target: 18000000, terkumpul: 7400000, tenggat: (kini.getFullYear() + 1) + '-06' },
      { id: 't2', nama: 'Mudik Lebaran', target: 4500000, terkumpul: 2850000, tenggat: (kini.getFullYear() + 1) + '-03' },
      { id: 't3', nama: 'Laptop sekolah Raka', target: 6000000, terkumpul: 1200000, tenggat: (kini.getFullYear() + 1) + '-07' }
    ];
    return d;
  }

  var D;
  function muat() {
    var mentah = null;
    try { mentah = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { mentah = null; }
    D = mentah && mentah.amplop ? migrasi(mentah) : dataContoh();
    simpan();
  }
  // Tambahkan langkah migrasi di sini bila struktur data berubah (naikkan VERSI).
  function migrasi(d) {
    if (!d.versi) d.versi = 1;
    d.profil = d.profil || dataKosong().profil;
    d.geser = d.geser || []; d.target = d.target || []; d.belanja = d.belanja || [];
    d.versi = VERSI;
    return d;
  }
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori browser penuh'); } }

  // ================= Hitungan anggaran =================
  function amplopById(id) { return D.amplop.filter(function (a) { return a.id === id; })[0]; }
  function belanjaBulan(bk) { return D.belanja.filter(function (b) { return b.tgl.slice(0, 7) === bk; }); }
  function batasBulan(a, bk) {
    return D.geser.reduce(function (s, g) {
      if (g.bulan !== bk) return s;
      if (g.ke === a.id) s += g.nominal; if (g.dari === a.id) s -= g.nominal; return s;
    }, a.batas);
  }
  function status(p) { return p > 1 ? 'lewat' : p >= 0.8 ? 'waspada' : 'aman'; }
  function hitungAmplop(bk) {
    var bl = belanjaBulan(bk);
    return D.amplop.map(function (a) {
      var pakai = bl.reduce(function (s, b) { return b.amplop === a.id ? s + b.nominal : s; }, 0);
      var batas = batasBulan(a, bk), p = batas > 0 ? pakai / batas : (pakai > 0 ? 2 : 0);
      return { a: a, batas: batas, pakai: pakai, sisa: batas - pakai, p: p, st: status(p) };
    });
  }
  function gajianBerikut(dariTgl) {
    var g = Math.min(28, Math.max(1, D.profil.gajian || 25));
    var t = new Date(dariTgl.getFullYear(), dariTgl.getMonth(), g);
    if (t <= dariTgl) t = new Date(dariTgl.getFullYear(), dariTgl.getMonth() + 1, g);
    return t;
  }
  function ringkasBulan(bk) {
    var am = hitungAmplop(bk);
    var pakai = belanjaBulan(bk).reduce(function (s, b) { return s + b.nominal; }, 0);
    var alokasi = D.amplop.reduce(function (s, a) { return s + a.batas; }, 0);
    return { am: am, pakai: pakai, alokasi: alokasi, sisa: D.profil.pemasukan - pakai, sisaAmplop: am.reduce(function (s, x) { return s + Math.max(0, x.sisa); }, 0) };
  }

  // ================= Tema (customizer, lihat tema.css & tema.js) =================
  var NAMA = (window.TEMA && TEMA.nama) || 'Keluarga Pratama';
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
    if (t.mode) { var m = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode; r.setAttribute('data-mode', m); }
    if (t.bagian) terapkanBagian(t.bagian);
    setTimeout(hitungTeksBagian, 0);
    if (t.nama) { NAMA = t.nama; isiNama(); }
  }
  function inisial() { return (NAMA || 'K').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }
  function pasangGambar(img, src) {
    if (!img) return;
    img.onerror = function () { var s = document.createElement('span'); s.className = img.className + ' inisial'; s.id = img.id; s.textContent = inisial(); s.setAttribute('aria-hidden', 'true'); img.replaceWith(s); };
    img.src = src;
  }
  function isiGambar() {
    pasangGambar($('#logoApp'), KONFIG.logo);
    var a = $('#avatarApp'); if (!a) return;
    var im = a.querySelector('img');
    if (!im) { a.textContent = ''; im = document.createElement('img'); im.alt = ''; a.appendChild(im); }
    pasangGambar(im, (D.profil && D.profil.foto) || KONFIG.avatar);
  }
  function kecilkanFoto(file, cb) {
    var r = new FileReader();
    r.onload = function () { var g = new Image(); g.onload = function () {
      var k = Math.min(1, 400 / Math.max(g.width, g.height)), c = document.createElement('canvas');
      c.width = Math.round(g.width * k); c.height = Math.round(g.height * k);
      c.getContext('2d').drawImage(g, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.82));
    }; g.onerror = function () { toast('Berkas bukan gambar'); }; g.src = r.result; };
    r.readAsDataURL(file);
  }
  function isiNama() { $$('[data-tema-nama]').forEach(function (e) { e.textContent = NAMA; }); }

  // ---- Bagian: warna per bagian, sorot, tap-untuk-pilih ----
  var PETA_BAGIAN = {
    nav: '.samping',
    latar: 'body, main',
    panel: '.panel, .amplop:not(.amplop-baru), dialog, .pilih-bulan',
    utama: '.tombol.utama, .hero, .chip[aria-pressed="true"], .tautan',
    aksen: '.catat-samping, .fab, .hero-batang i, .grafik .kol.ini i, .target .cincin',
    teks: 'h1, h2, h3, .trx-nominal'
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
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4 ? '#14201a' : '#ffffff';
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

  // ================= Toast =================
  function toast(pesan, aksi) {
    var w = $('#toast'), el = document.createElement('div');
    el.className = 'toast'; el.innerHTML = '<span>' + esc(pesan) + '</span>';
    if (aksi) { var b = document.createElement('button'); b.type = 'button'; b.textContent = aksi.label; b.onclick = function () { aksi.fn(); tutupToast(el); }; el.appendChild(b); }
    w.appendChild(el);
    setTimeout(function () { tutupToast(el); }, aksi ? 5200 : 2800);
  }
  function tutupToast(el) { if (!el.isConnected) return; el.classList.add('pergi'); setTimeout(function () { el.remove(); }, GERAK ? 250 : 0); }

  // ================= Navigasi & bulan =================
  var HAL = { beranda: 'Beranda', amplop: 'Amplop anggaran', riwayat: 'Riwayat belanja', ringkasan: 'Ringkasan', tabungan: 'Target tabungan', atur: 'Pengaturan' };
  var kini = new Date();
  var S = { hal: 'beranda', bulan: blnKey(kini), periode: 'bulan', cari: '', saring: '', pilihAmplop: null };
  function ke(h) {
    if (!HAL[h]) h = 'beranda';
    S.hal = h;
    try { history.replaceState(null, '', '#' + h); } catch (e) {}
    render(true);
    $('#isi').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: GERAK ? 'smooth' : 'auto' });
  }
  function geserBulan(n) {
    var d = dariKey(S.bulan); d.setMonth(d.getMonth() + n);
    if (blnKey(d) > blnKey(new Date())) return;
    S.bulan = blnKey(d); render(true);
  }

  // ================= Render =================
  function render(animasi) {
    if (!render.g) { render.g = 1; isiGambar(); }
    $$('.nav').forEach(function (b) { var on = b.dataset.hal === S.hal; b.classList.toggle('aktif', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $('#judulHal').textContent = HAL[S.hal];
    document.title = HAL[S.hal] + ' · Anggaran ' + NAMA;
    var j = new Date().getHours();
    $('#sapa').textContent = (j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam') + ', ' + NAMA;
    $('#labelBulan').textContent = labelBulan(S.bulan);
    $('#bulanMaju').disabled = S.bulan >= blnKey(new Date());
    $('.pilih-bulan').hidden = (S.hal === 'tabungan' || S.hal === 'atur');
    var h = $('#hal');
    h.innerHTML = ({ beranda: hBeranda, amplop: hAmplop, riwayat: hRiwayat, ringkasan: hRingkasan, tabungan: hTabungan, atur: hAtur })[S.hal]();
    if (animasi) { h.classList.remove('masuk-hal'); void h.offsetWidth; h.classList.add('masuk-hal'); }
    $$('.bertahap', h).forEach(function (w) { Array.prototype.forEach.call(w.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 14)); }); });
    if (S.hal === 'beranda') { pasangFormCatat($('.form-catat', h)); hitungNaik($('.hero-angka b', h)); }
  }
  function hitungNaik(el) {
    if (!el || !GERAK) return;
    var akhir = Number(el.dataset.nilai), mulai = performance.now(), dur = 900;
    (function f(t) {
      var p = Math.min(1, (t - mulai) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(akhir * e).toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(f);
    })(mulai);
  }
  function cincin(p, st, ikonNama) {
    var keliling = 2 * Math.PI * 22, pj = Math.min(1, p) * keliling;
    return '<div class="cincin st-' + st + '"><svg viewBox="0 0 54 54"><circle class="jalur" cx="27" cy="27" r="22"/><circle class="isi" cx="27" cy="27" r="22" style="--pj:' + pj.toFixed(1) + '"/></svg><span>' + ikon('k-' + ikonNama) + '</span></div>';
  }
  var LABEL_ST = { aman: 'Aman', waspada: 'Hampir habis', lewat: 'Lewat batas' };
  function kartuAmplop(x) {
    var w = Math.min(100, x.p * 100);
    return '<button type="button" class="amplop st-' + x.st + '" data-amplop="' + x.a.id + '" aria-label="' + esc(x.a.nama) + ': sisa ' + rp(x.sisa) + ' dari ' + rp(x.batas) + ', ' + LABEL_ST[x.st] + '">' +
      '<div class="amplop-atas">' + cincin(x.p, x.st, x.a.ikon) + '<div><h3>' + esc(x.a.nama) + '</h3><span class="persen">' + Math.round(x.p * 100) + '% terpakai</span></div></div>' +
      (x.st !== 'aman' ? '<span class="lencana ' + x.st + '">' + LABEL_ST[x.st] + '</span>' : '') +
      '<div class="amplop-angka"><b class="angka-tab">' + rp(x.sisa) + '</b><small>dari ' + rpPendek(x.batas) + '</small></div>' +
      '<div class="batang"><i style="--w:' + w.toFixed(1) + '%"></i></div></button>';
  }
  function spanduk(am) {
    var lewat = am.filter(function (x) { return x.st === 'lewat'; }), was = am.filter(function (x) { return x.st === 'waspada'; });
    var out = '';
    if (lewat.length) out += '<div class="spanduk lewat" role="alert">' + ikon('i-awas') + '<p><b class="judul">' + lewat.length + ' amplop sudah lewat batas</b>' + lewat.map(function (x) { return esc(x.a.nama) + ' (lebih ' + rp(-x.sisa) + ')'; }).join(', ') + '</p><button type="button" class="tautan" data-aksi="geser" data-ke="' + lewat[0].a.id + '">Geser sisa</button></div>';
    if (was.length) out += '<div class="spanduk waspada" role="status">' + ikon('i-awas') + '<p><b class="judul">Hampir habis (≥80%)</b>' + was.map(function (x) { return esc(x.a.nama) + ' tinggal ' + rp(x.sisa); }).join(', ') + '</p></div>';
    return out;
  }
  function itemTrx(b, hapus) {
    var a = amplopById(b.amplop) || { nama: 'Amplop terhapus', ikon: 'lain' };
    var jam = new Date(b.waktu);
    return '<li class="trx"><span class="trx-ikon">' + ikon('k-' + a.ikon) + '</span><div class="trx-teks"><b>' + esc(b.catatan || a.nama) + '</b><small>' + esc(a.nama) + ' · ' + (hapus ? dua(jam.getHours()) + '.' + dua(jam.getMinutes()) : labelTgl(b.tgl)) + '</small></div><span class="trx-nominal angka-tab">-' + rp(b.nominal) + '</span>' +
      (hapus ? '<button type="button" class="ikon-tombol" data-aksi="ubah-belanja" data-id="' + b.id + '" aria-label="Ubah ' + esc(b.catatan || a.nama) + '">' + ikon('i-ubah') + '</button>' : '') + '</li>';
  }
  function urutBaru(a, b) { return a.waktu < b.waktu ? 1 : -1; }

  function hBeranda() {
    var r = ringkasBulan(S.bulan), bulanIni = S.bulan === blnKey(new Date());
    var hariIni = new Date(), gaj = gajianBerikut(hariIni);
    var sisaHari = Math.max(1, Math.ceil((gaj - new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())) / 864e5));
    var amanPerHari = Math.max(0, r.sisaAmplop) / sisaHari;
    var persen = D.profil.pemasukan ? Math.min(100, r.pakai / D.profil.pemasukan * 100) : 0;
    var terbaru = belanjaBulan(S.bulan).sort(urutBaru).slice(0, 5);
    var urutAm = r.am.slice().sort(function (a, b) { return b.p - a.p; });
    return '<div class="grid-beranda">' +
      '<section class="hero" aria-label="Sisa uang bulan ini">' +
        '<span class="hero-label">' + ikon('i-amplop') + (bulanIni ? 'Sisa uang bulan ini' : 'Sisa uang ' + labelBulan(S.bulan)) + '</span>' +
        '<p class="hero-angka angka-tab"><small>Rp</small><b data-nilai="' + Math.max(0, r.sisa) + '">' + Math.round(Math.max(0, r.sisa)).toLocaleString('id-ID') + '</b></p>' +
        '<p class="hero-sub">Terpakai ' + rp(r.pakai) + ' dari pemasukan ' + rp(D.profil.pemasukan) + (r.sisa < 0 ? ' · minus ' + rp(-r.sisa) : '') + '</p>' +
        '<div class="hero-batang" role="progressbar" aria-label="Pemasukan terpakai" aria-valuenow="' + Math.round(persen) + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + persen.toFixed(1) + '%"></i></div>' +
        '<div class="hero-bawah"><div><small>Aman per hari</small><b class="angka-tab">' + (bulanIni ? rp(amanPerHari) : '—') + '</b></div><div><small>Gajian lagi</small><b>' + (bulanIni ? sisaHari + ' hari' : '—') + '</b></div><div><small>Sisa di amplop</small><b class="angka-tab">' + rp(r.sisaAmplop) + '</b></div></div>' +
      '</section>' +
      '<section class="panel catat-cepat" aria-labelledby="jCatat"><div class="panel-kepala"><h2 id="jCatat">Catat belanja cepat</h2></div>' + formCatat({}) + '</section>' +
      (spanduk(r.am) ? '<div class="lebar tumpuk-spanduk">' + spanduk(r.am) + '</div>' : '') +
      '<section class="lebar"><div class="panel-kepala"><h2>Amplop paling terpakai</h2><button type="button" class="tautan" data-hal-ke="amplop">Lihat semua</button></div><div class="grid-amplop bertahap">' + urutAm.slice(0, 4).map(kartuAmplop).join('') + '</div></section>' +
      '<section class="panel lebar"><div class="panel-kepala"><h2>Belanja terakhir</h2><button type="button" class="tautan" data-hal-ke="riwayat">Riwayat</button></div>' +
        (terbaru.length ? '<ul class="daftar bertahap">' + terbaru.map(function (b) { return itemTrx(b, false); }).join('') + '</ul>' : kosong('Belum ada belanja di bulan ini.')) + '</section>' +
    '</div>';
  }
  function kosong(t) { return '<div class="kosong">' + ikon('i-amplop') + '<p>' + esc(t) + '</p></div>'; }

  // ---- Form catat (dipakai di beranda & dialog) ----
  function formCatat(b) {
    var pilih = b.amplop || S.pilihAmplop || (D.amplop[0] && D.amplop[0].id);
    var tgl = b.tgl || tglKey(new Date());
    return '<div class="form-catat" data-id="' + (b.id || '') + '">' +
      '<label for="nom' + (b.id || 'x') + '">Nominal</label>' +
      '<div class="nominal"><span>Rp</span><input id="nom' + (b.id || 'x') + '" name="nominal" inputmode="numeric" autocomplete="off" placeholder="0" value="' + (b.nominal ? b.nominal.toLocaleString('id-ID') : '') + '" aria-describedby="salahNom' + (b.id || 'x') + '"></div>' +
      '<p class="isian"><span class="salah" id="salahNom' + (b.id || 'x') + '" aria-live="polite"></span></p>' +
      '<div class="cepat-baris" role="group" aria-label="Tambah nominal cepat">' + [10000, 25000, 50000, 100000].map(function (n) { return '<button type="button" class="cepat" data-tambah="' + n + '">+' + (n / 1000) + 'rb</button>'; }).join('') + '</div>' +
      '<label id="lblAm' + (b.id || 'x') + '">Amplop</label>' +
      '<div class="chip-baris" role="group" aria-labelledby="lblAm' + (b.id || 'x') + '">' + D.amplop.map(function (a) { return '<button type="button" class="chip" data-pilih="' + a.id + '" aria-pressed="' + (a.id === pilih) + '">' + ikon('k-' + a.ikon) + esc(a.nama) + '</button>'; }).join('') + '</div>' +
      '<div class="dua"><div class="isian"><label for="cat' + (b.id || 'x') + '">Catatan (opsional)</label><input id="cat' + (b.id || 'x') + '" name="catatan" maxlength="60" placeholder="mis. sayur & tempe" value="' + esc(b.catatan || '') + '"></div>' +
      '<div class="isian"><label for="tgl' + (b.id || 'x') + '">Tanggal</label><input id="tgl' + (b.id || 'x') + '" name="tgl" type="date" max="' + tglKey(new Date()) + '" value="' + tgl + '"></div></div>' +
      (b.inDialog ? '' : '<button type="button" class="tombol utama penuh" data-aksi="simpan-catat">' + ikon('i-cek') + 'Simpan belanja</button>') +
    '</div>';
  }
  function pasangFormCatat(f) {
    if (!f) return;
    var inp = $('[name=nominal]', f);
    inp.addEventListener('input', function () {
      var n = angka(inp.value); inp.value = n ? n.toLocaleString('id-ID') : '';
      $('.salah', f).textContent = '';
    });
    f.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.dataset.tambah) { var n = angka(inp.value) + Number(t.dataset.tambah); inp.value = n.toLocaleString('id-ID'); inp.focus(); }
      if (t.dataset.pilih) { $$('.chip', f).forEach(function (c) { c.setAttribute('aria-pressed', String(c === t)); }); S.pilihAmplop = t.dataset.pilih; }
      if (t.dataset.aksi === 'simpan-catat') simpanCatat(f);
    });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); simpanCatat(f); } });
  }
  function simpanCatat(f) {
    var nom = angka($('[name=nominal]', f).value), ch = $('.chip[aria-pressed="true"]', f), tgl = $('[name=tgl]', f).value || tglKey(new Date());
    var salah = $('.salah', f);
    if (!nom) { salah.textContent = 'Isi nominal dulu, ya.'; goyang($('.nominal', f)); $('[name=nominal]', f).focus(); return false; }
    if (nom > 1e10) { salah.textContent = 'Nominal terlalu besar.'; return false; }
    if (!ch) { salah.textContent = 'Pilih amplopnya dulu.'; return false; }
    if (tgl > tglKey(new Date())) tgl = tglKey(new Date());
    var id = f.dataset.id, cat = $('[name=catatan]', f).value.trim();
    var sebelum = hitungAmplop(tgl.slice(0, 7)).filter(function (x) { return x.a.id === ch.dataset.pilih; })[0];
    if (id) {
      var b = D.belanja.filter(function (x) { return x.id === id; })[0];
      b.nominal = nom; b.amplop = ch.dataset.pilih; b.catatan = cat; if (b.tgl !== tgl) { b.tgl = tgl; b.waktu = gabungWaktu(tgl); }
    } else {
      D.belanja.push({ id: uid(), waktu: gabungWaktu(tgl), tgl: tgl, amplop: ch.dataset.pilih, nominal: nom, catatan: cat });
    }
    simpan();
    var sesudah = hitungAmplop(tgl.slice(0, 7)).filter(function (x) { return x.a.id === ch.dataset.pilih; })[0];
    var pesan = (id ? 'Belanja diperbarui' : rp(nom) + ' dicatat di ' + sesudah.a.nama);
    if (!id && sesudah.st !== sebelum.st && sesudah.st !== 'aman') pesan += sesudah.st === 'lewat' ? ' · amplop lewat batas!' : ' · amplop hampir habis';
    S.bulan = tgl.slice(0, 7);
    tutupDialog(); render(false); toast(pesan);
    return true;
  }
  function gabungWaktu(tgl) {
    var n = new Date(), d = dariKey(tgl);
    if (tgl === tglKey(n)) return n.toISOString();
    d.setHours(12, 0, 0, 0); return d.toISOString();
  }
  function goyang(el) { if (!GERAK || !el) return; el.classList.remove('goyang'); void el.offsetWidth; el.classList.add('goyang'); }

  function hAmplop() {
    var r = ringkasBulan(S.bulan), belum = D.profil.pemasukan - r.alokasi;
    return '<div class="alok panel"><p><b>' + rp(r.alokasi) + '</b> dialokasikan dari pemasukan ' + rp(D.profil.pemasukan) + '. ' +
      (belum >= 0 ? '<span class="lencana aman">Belum dialokasikan ' + rp(belum) + '</span>' : '<span class="lencana lewat">Alokasi lebih ' + rp(-belum) + '</span>') + '</p>' +
      '<div class="tombol-baris"><button type="button" class="tombol" data-aksi="geser">' + ikon('i-geser') + 'Geser sisa</button><button type="button" class="tombol utama" data-aksi="amplop-baru">' + ikon('i-tambah') + 'Amplop baru</button></div></div>' +
      (spanduk(r.am) ? '<div style="display:grid;gap:10px;margin-bottom:16px">' + spanduk(r.am) + '</div>' : '') +
      '<div class="grid-amplop bertahap">' + r.am.map(kartuAmplop).join('') +
      '<button type="button" class="amplop amplop-baru" data-aksi="amplop-baru">' + ikon('i-tambah') + 'Tambah amplop</button></div>';
  }

  function hRiwayat() {
    var q = S.cari.toLowerCase();
    var bl = belanjaBulan(S.bulan).filter(function (b) {
      if (S.saring && b.amplop !== S.saring) return false;
      if (!q) return true;
      var a = amplopById(b.amplop); return (b.catatan + ' ' + (a ? a.nama : '')).toLowerCase().indexOf(q) >= 0;
    }).sort(urutBaru);
    var per = {}; bl.forEach(function (b) { (per[b.tgl] = per[b.tgl] || []).push(b); });
    var total = bl.reduce(function (s, b) { return s + b.nominal; }, 0);
    return '<div class="saring"><div class="cari">' + ikon('i-cari') + '<label class="lewati" for="cariIn">Cari belanja</label><input id="cariIn" class="input" type="search" placeholder="Cari catatan atau amplop…" value="' + esc(S.cari) + '"></div>' +
      '<label class="lewati" for="saringIn">Saring amplop</label><select id="saringIn" class="input"><option value="">Semua amplop</option>' + D.amplop.map(function (a) { return '<option value="' + a.id + '"' + (S.saring === a.id ? ' selected' : '') + '>' + esc(a.nama) + '</option>'; }).join('') + '</select></div>' +
      '<section class="panel"><div class="panel-kepala"><h2>' + bl.length + ' belanja · ' + rp(total) + '</h2><button type="button" class="tombol" data-aksi="csv">' + ikon('i-unduh') + 'CSV</button></div><div id="daftarRiwayat">' +
      (bl.length ? Object.keys(per).map(function (k) {
        var tot = per[k].reduce(function (s, b) { return s + b.nominal; }, 0);
        return '<div class="hari-judul"><span>' + labelTgl(k) + '</span><span class="angka-tab">' + rp(tot) + '</span></div><ul class="daftar bertahap">' + per[k].map(function (b) { return itemTrx(b, true); }).join('') + '</ul>';
      }).join('') : kosong(q || S.saring ? 'Tidak ada belanja yang cocok.' : 'Belum ada belanja di bulan ini.')) + '</div></section>';
  }

  function hRingkasan() {
    var mingguan = S.periode === 'minggu', hariIni = new Date();
    var akhir = S.bulan === blnKey(hariIni) ? hariIni : new Date(dariKey(S.bulan).getFullYear(), dariKey(S.bulan).getMonth() + 1, 0);
    var mulai, kolom = [];
    if (mingguan) {
      mulai = new Date(akhir); mulai.setDate(akhir.getDate() - ((akhir.getDay() + 6) % 7));
      for (var i = 0; i < 7; i++) { var d = new Date(mulai); d.setDate(mulai.getDate() + i); kolom.push({ k: tglKey(d), lbl: HARI[d.getDay()].slice(0, 3) }); }
    } else {
      mulai = dariKey(S.bulan);
      var n = new Date(mulai.getFullYear(), mulai.getMonth() + 1, 0).getDate();
      for (var j = 1; j <= n; j++) kolom.push({ k: S.bulan + '-' + dua(j), lbl: (j === 1 || j % 5 === 0) ? String(j) : '' });
    }
    var kunci = {}; kolom.forEach(function (c) { kunci[c.k] = 0; });
    var bl = D.belanja.filter(function (b) { return b.tgl in kunci; });
    bl.forEach(function (b) { kunci[b.tgl] += b.nominal; });
    var total = bl.reduce(function (s, b) { return s + b.nominal; }, 0), maks = Math.max.apply(null, kolom.map(function (c) { return kunci[c.k]; }).concat([1]));
    var hariBerjalan = kolom.filter(function (c) { return c.k <= tglKey(hariIni); }).length || 1;
    // pembanding: periode sebelumnya
    var banding = 0;
    if (mingguan) { var m0 = new Date(mulai); m0.setDate(m0.getDate() - 7); var m1 = new Date(mulai); D.belanja.forEach(function (b) { if (b.tgl >= tglKey(m0) && b.tgl < tglKey(m1)) banding += b.nominal; }); }
    else { var p = dariKey(S.bulan); p.setMonth(p.getMonth() - 1); var batasHari = S.bulan === blnKey(hariIni) ? hariIni.getDate() : 31; banding = belanjaBulan(blnKey(p)).reduce(function (s, b) { return Number(b.tgl.slice(8)) <= batasHari ? s + b.nominal : s; }, 0); }
    var selisih = banding ? (total - banding) / banding * 100 : 0;
    var perAm = D.amplop.map(function (a) { return { a: a, t: bl.reduce(function (s, b) { return b.amplop === a.id ? s + b.nominal : s; }, 0) }; }).filter(function (x) { return x.t; }).sort(function (a, b) { return b.t - a.t; });
    var hariTerboros = kolom.reduce(function (m, c) { return kunci[c.k] > kunci[m.k] ? c : m; }, kolom[0]);
    return '<div class="segmen" role="group" aria-label="Periode"><button type="button" data-periode="minggu" aria-pressed="' + mingguan + '">Minggu ini</button><button type="button" data-periode="bulan" aria-pressed="' + !mingguan + '">Sebulan</button></div>' +
      '<div class="grid-ringkas bertahap">' +
        '<div class="panel stat"><small>Total belanja</small><b class="angka-tab">' + rp(total) + '</b><br><em style="color:var(--' + (selisih > 0 ? 'lewat' : 'aman') + '-tulis)">' + (banding ? (selisih > 0 ? '▲ ' : '▼ ') + Math.abs(selisih).toFixed(0) + '% dari ' + (mingguan ? 'minggu lalu' : 'periode sama bulan lalu') : 'Belum ada pembanding') + '</em></div>' +
        '<div class="panel stat"><small>Rata-rata per hari</small><b class="angka-tab">' + rp(total / hariBerjalan) + '</b><br><em class="redup">' + hariBerjalan + ' hari dihitung</em></div>' +
        '<div class="panel stat"><small>Hari paling boros</small><b>' + (kunci[hariTerboros.k] ? labelTgl(hariTerboros.k) : '—') + '</b><br><em class="redup angka-tab">' + rp(kunci[hariTerboros.k]) + '</em></div>' +
      '</div>' +
      '<section class="panel" style="margin-bottom:16px"><div class="panel-kepala"><h2>Belanja per hari</h2><span class="redup kecil">' + (mingguan ? 'Senin–Minggu' : labelBulan(S.bulan)) + '</span></div>' +
        '<div class="grafik" role="img" aria-label="Grafik belanja per hari, tertinggi ' + rp(maks) + '">' + kolom.map(function (c, i) {
          var v = kunci[c.k]; return '<div class="kol' + (c.k === tglKey(hariIni) ? ' ini' : c.k > tglKey(hariIni) ? ' nanti' : '') + '" title="' + labelTgl(c.k) + ': ' + rp(v) + '" style="--i:' + i + '"><i style="height:calc((100% - 22px) * ' + (v / maks).toFixed(3) + ')"></i><small>' + c.lbl + '</small></div>';
        }).join('') + '</div></section>' +
      '<section class="panel"><div class="panel-kepala"><h2>Per amplop</h2></div>' +
        (perAm.length ? '<div class="porsi bertahap">' + perAm.map(function (x) {
          var w = x.t / total * 100;
          return '<div class="porsi-baris"><span>' + ikon('k-' + x.a.ikon) + esc(x.a.nama) + '</span><div class="batang" style="--st:var(--utama-tulis)"><i style="--w:' + w.toFixed(1) + '%"></i></div><b class="angka-tab">' + rp(x.t) + ' · ' + w.toFixed(0) + '%</b></div>';
        }).join('') + '</div>' : kosong('Belum ada belanja di periode ini.')) + '</section>';
  }

  function hTabungan() {
    var total = D.target.reduce(function (s, t) { return s + t.terkumpul; }, 0);
    return '<div class="alok panel"><p>Total tabungan terkumpul <b>' + rp(total) + '</b> di ' + D.target.length + ' target.</p><button type="button" class="tombol utama" data-aksi="target-baru">' + ikon('i-tambah') + 'Target baru</button></div>' +
      (D.target.length ? '<div class="grid-target bertahap">' + D.target.map(function (t) {
        var p = t.target ? t.terkumpul / t.target : 0, kel = 2 * Math.PI * 22;
        var bulanLagi = 0;
        if (t.tenggat) { var tg = dariKey(t.tenggat), n = new Date(); bulanLagi = Math.max(1, (tg.getFullYear() - n.getFullYear()) * 12 + tg.getMonth() - n.getMonth()); }
        var perBulan = Math.max(0, t.target - t.terkumpul) / (bulanLagi || 1);
        return '<section class="panel target"><div class="cincin"><svg viewBox="0 0 54 54"><circle class="jalur" cx="27" cy="27" r="22"/><circle class="isi" cx="27" cy="27" r="22" style="--pj:' + (Math.min(1, p) * kel).toFixed(1) + '"/></svg><span>' + Math.round(p * 100) + '%</span></div>' +
          '<h3>' + esc(t.nama) + '</h3><p class="angka-tab" style="margin:0"><b>' + rp(t.terkumpul) + '</b> <span class="redup">dari ' + rp(t.target) + '</span></p>' +
          (p >= 1 ? '<span class="lencana aman">' + ikon('i-cek') + 'Tercapai</span>' : '<p class="redup kecil" style="margin:0">' + (t.tenggat ? 'Sisihkan ' + rp(perBulan) + '/bulan sampai ' + labelBulan(t.tenggat) : 'Tanpa tenggat') + '</p>') +
          '<div class="aksi"><button type="button" class="tombol utama" data-aksi="setor" data-id="' + t.id + '">' + ikon('i-tambah') + 'Setor</button><button type="button" class="tombol" data-aksi="ubah-target" data-id="' + t.id + '" aria-label="Ubah target ' + esc(t.nama) + '">' + ikon('i-ubah') + '</button></div></section>';
      }).join('') + '</div>' : kosong('Belum ada target. Mulai dari dana darurat, yuk.'));
  }

  function hAtur() {
    return '<div class="grid-atur bertahap">' +
      '<section class="panel"><div class="panel-kepala"><h2>Pemasukan & gajian</h2></div>' +
        '<div class="isian"><label for="inPemasukan">Pemasukan per bulan</label><div class="nominal"><span>Rp</span><input id="inPemasukan" inputmode="numeric" value="' + D.profil.pemasukan.toLocaleString('id-ID') + '"></div></div>' +
        '<div class="isian"><label for="inGajian">Tanggal gajian (1–28)</label><input id="inGajian" type="number" min="1" max="28" value="' + D.profil.gajian + '"></div>' +
        '<button type="button" class="tombol utama" data-aksi="simpan-profil">' + ikon('i-cek') + 'Simpan</button></section>' +
      '<section class="panel"><div class="panel-kepala"><h2>Foto profil</h2></div><div class="baris-foto"><img class="foto-atur" alt="Foto profil" src="' + esc((D.profil && D.profil.foto) || KONFIG.avatar) + '">' +
        '<div class="tombol-baris"><label class="tombol" for="inFoto">' + ikon('i-unggah') + 'Unggah foto</label><input id="inFoto" type="file" accept="image/*" hidden>' + (D.profil.foto ? '<button type="button" class="tombol" data-aksi="hapus-foto">' + ikon('i-hapus') + 'Hapus</button>' : '') + '</div></div><p class="redup kecil">Diperkecil otomatis (maks 400px) dan disimpan di perangkat ini.</p></section>' +
      '<section class="panel"><div class="panel-kepala"><h2>Amplop</h2><button type="button" class="tautan" data-aksi="amplop-baru">+ Tambah</button></div>' +
        D.amplop.map(function (a) { return '<div class="baris-amplop"><span class="trx-ikon">' + ikon('k-' + a.ikon) + '</span><div><b>' + esc(a.nama) + '</b><br><small class="redup angka-tab">Batas ' + rp(a.batas) + '/bulan</small></div><button type="button" class="ikon-tombol" data-aksi="ubah-amplop" data-id="' + a.id + '" aria-label="Ubah amplop ' + esc(a.nama) + '">' + ikon('i-ubah') + '</button></div>'; }).join('') + '</section>' +
      '<section class="panel"><div class="panel-kepala"><h2>Cadangan data</h2></div><p class="redup kecil" style="margin-top:0">Data hanya ada di browser ini. Unduh backup secara rutin, lalu pulihkan di HP/laptop lain.</p>' +
        '<div class="tombol-baris"><button type="button" class="tombol" data-aksi="csv">' + ikon('i-unduh') + 'Ekspor CSV</button><button type="button" class="tombol" data-aksi="backup">' + ikon('i-unduh') + 'Backup JSON</button><button type="button" class="tombol" data-aksi="pulihkan">' + ikon('i-unggah') + 'Pulihkan</button></div></section>' +
      '<section class="panel"><div class="panel-kepala"><h2>Mulai ulang</h2></div><p class="redup kecil" style="margin-top:0">Pakai data contoh untuk mencoba, atau kosongkan semua untuk mulai mencatat sendiri.</p>' +
        '<div class="tombol-baris"><button type="button" class="tombol" data-aksi="contoh">Isi data contoh</button><button type="button" class="tombol bahaya" data-aksi="kosongkan">' + ikon('i-hapus') + 'Hapus semua belanja</button></div></section>' +
    '</div>';
  }

  // ================= Dialog =================
  var dlg = $('#dlg'), kirimDlg = null;
  function bukaDialog(judul, isi, kaki, kirim) {
    $('#dlgJudul').textContent = judul; $('#dlgIsi').innerHTML = isi; $('#dlgKaki').innerHTML = kaki || ''; kirimDlg = kirim;
    dlg.classList.remove('keluar');
    if (!dlg.open) dlg.showModal();
    var f = $('#dlgIsi input:not([type=hidden]), #dlgIsi select'); if (f) setTimeout(function () { f.focus(); }, 30);
  }
  function tutupDialog() {
    if (!dlg.open) return;
    if (!GERAK) { dlg.close(); return; }
    dlg.classList.add('keluar');
    setTimeout(function () { dlg.classList.remove('keluar'); dlg.close(); }, 190);
  }
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) tutupDialog();
    if (e.target.closest('[data-tutup]')) tutupDialog();
  });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); tutupDialog(); });
  $('#dlgForm').addEventListener('submit', function (e) { e.preventDefault(); if (kirimDlg) kirimDlg(); });
  var BTN_BATAL = '<button type="button" class="tombol" data-tutup>Batal</button>';

  function dlgCatat(b) {
    b = b || {};
    var edit = !!b.id;
    bukaDialog(edit ? 'Ubah belanja' : 'Catat belanja', formCatat(Object.assign({}, b, { inDialog: true })),
      (edit ? '<button type="button" class="tombol bahaya" data-aksi="hapus-belanja" data-id="' + b.id + '" style="margin-right:auto">' + ikon('i-hapus') + 'Hapus</button>' : '') + BTN_BATAL + '<button type="submit" class="tombol utama">' + ikon('i-cek') + 'Simpan</button>',
      function () { simpanCatat($('#dlgIsi .form-catat')); });
    pasangFormCatat($('#dlgIsi .form-catat'));
  }

  function opsiAmplop(sel, kecuali) {
    return D.amplop.filter(function (a) { return a.id !== kecuali; }).map(function (a) { return '<option value="' + a.id + '"' + (a.id === sel ? ' selected' : '') + '>' + esc(a.nama) + '</option>'; }).join('');
  }
  function dlgGeser(keId) {
    var am = hitungAmplop(S.bulan);
    var sumber = am.filter(function (x) { return x.sisa > 0 && x.a.id !== keId; }).sort(function (a, b) { return b.sisa - a.sisa; })[0];
    var info = function () {
      var d = $('#gDari').value, x = am.filter(function (y) { return y.a.id === d; })[0];
      $('#gInfo').textContent = x ? 'Sisa di ' + x.a.nama + ': ' + rp(x.sisa) : '';
    };
    bukaDialog('Geser sisa antar amplop',
      '<p class="redup kecil" style="margin-top:0">Pindahkan sisa batas di ' + labelBulan(S.bulan) + '. Total pemasukan tidak berubah.</p>' +
      '<div class="dua"><div class="isian"><label for="gDari">Dari amplop</label><select id="gDari">' + opsiAmplop(sumber && sumber.a.id) + '</select></div>' +
      '<div class="isian"><label for="gKe">Ke amplop</label><select id="gKe">' + opsiAmplop(keId || (am[1] && am[1].a.id)) + '</select></div></div>' +
      '<p class="redup kecil" id="gInfo" aria-live="polite"></p>' +
      '<div class="isian"><label for="gNom">Nominal</label><div class="nominal"><span>Rp</span><input id="gNom" inputmode="numeric" placeholder="0"></div><p class="salah" id="gSalah" aria-live="polite"></p></div>',
      BTN_BATAL + '<button type="submit" class="tombol utama">' + ikon('i-geser') + 'Geser</button>',
      function () {
        var dari = $('#gDari').value, keA = $('#gKe').value, nom = angka($('#gNom').value);
        var x = am.filter(function (y) { return y.a.id === dari; })[0];
        if (dari === keA) { $('#gSalah').textContent = 'Pilih dua amplop yang berbeda.'; return; }
        if (!nom) { $('#gSalah').textContent = 'Isi nominal yang mau digeser.'; goyang($('#gNom').parentNode); return; }
        if (nom > Math.max(0, x.sisa)) { $('#gSalah').textContent = 'Maksimal ' + rp(Math.max(0, x.sisa)) + ' (sisa amplop asal).'; goyang($('#gNom').parentNode); return; }
        D.geser.push({ id: uid(), bulan: S.bulan, dari: dari, ke: keA, nominal: nom, waktu: new Date().toISOString() });
        simpan(); tutupDialog(); render(false);
        toast(rp(nom) + ' digeser ke ' + amplopById(keA).nama);
      });
    $('#gDari').addEventListener('change', info); info();
    var gn = $('#gNom'); gn.addEventListener('input', function () { var n = angka(gn.value); gn.value = n ? n.toLocaleString('id-ID') : ''; });
  }

  function dlgAmplop(a) {
    var edit = !!a; a = a || { nama: '', ikon: 'lain', batas: 0 };
    bukaDialog(edit ? 'Ubah amplop' : 'Amplop baru',
      '<div class="isian"><label for="aNama">Nama amplop</label><input id="aNama" maxlength="30" value="' + esc(a.nama) + '" placeholder="mis. Uang saku anak"></div>' +
      '<div class="isian"><label for="aBatas">Batas per bulan</label><div class="nominal"><span>Rp</span><input id="aBatas" inputmode="numeric" value="' + (a.batas ? a.batas.toLocaleString('id-ID') : '') + '" placeholder="0"></div></div>' +
      '<label id="lblIkon" style="display:block;font-size:13px;font-weight:700;margin-bottom:6px;color:var(--redup)">Ikon</label><div class="chip-baris" role="group" aria-labelledby="lblIkon">' + Object.keys(IKON).map(function (k) { return '<button type="button" class="chip" data-ikon="' + k + '" aria-pressed="' + (k === a.ikon) + '" aria-label="' + IKON[k] + '">' + ikon('k-' + k) + '</button>'; }).join('') + '</div>' +
      '<p class="salah" id="aSalah" aria-live="polite"></p>',
      (edit ? '<button type="button" class="tombol bahaya" data-aksi="hapus-amplop" data-id="' + a.id + '" style="margin-right:auto">' + ikon('i-hapus') + 'Hapus</button>' : '') + BTN_BATAL + '<button type="submit" class="tombol utama">' + ikon('i-cek') + 'Simpan</button>',
      function () {
        var nama = $('#aNama').value.trim(), batas = angka($('#aBatas').value), ik = $('#dlgIsi [data-ikon][aria-pressed="true"]');
        if (!nama) { $('#aSalah').textContent = 'Nama amplop wajib diisi.'; $('#aNama').focus(); return; }
        if (edit) { a.nama = nama; a.batas = batas; a.ikon = ik ? ik.dataset.ikon : a.ikon; }
        else D.amplop.push({ id: uid(), nama: nama, batas: batas, ikon: ik ? ik.dataset.ikon : 'lain' });
        simpan(); tutupDialog(); render(false); toast(edit ? 'Amplop diperbarui' : 'Amplop "' + nama + '" ditambahkan');
      });
    var ba = $('#aBatas'); ba.addEventListener('input', function () { var n = angka(ba.value); ba.value = n ? n.toLocaleString('id-ID') : ''; });
    $('#dlgIsi .chip-baris').addEventListener('click', function (e) { var t = e.target.closest('[data-ikon]'); if (!t) return; $$('#dlgIsi [data-ikon]').forEach(function (c) { c.setAttribute('aria-pressed', String(c === t)); }); });
  }

  function dlgTarget(t) {
    var edit = !!t; t = t || { nama: '', target: 0, terkumpul: 0, tenggat: '' };
    bukaDialog(edit ? 'Ubah target' : 'Target tabungan baru',
      '<div class="isian"><label for="tNama">Nama target</label><input id="tNama" maxlength="40" value="' + esc(t.nama) + '" placeholder="mis. Dana darurat"></div>' +
      '<div class="dua"><div class="isian"><label for="tTarget">Target</label><div class="nominal"><span>Rp</span><input id="tTarget" inputmode="numeric" value="' + (t.target ? t.target.toLocaleString('id-ID') : '') + '"></div></div>' +
      '<div class="isian"><label for="tKumpul">Sudah terkumpul</label><div class="nominal"><span>Rp</span><input id="tKumpul" inputmode="numeric" value="' + (t.terkumpul ? t.terkumpul.toLocaleString('id-ID') : '') + '"></div></div></div>' +
      '<div class="isian"><label for="tTenggat">Target tercapai bulan</label><input id="tTenggat" type="month" value="' + esc(t.tenggat) + '"></div><p class="salah" id="tSalah" aria-live="polite"></p>',
      (edit ? '<button type="button" class="tombol bahaya" data-aksi="hapus-target" data-id="' + t.id + '" style="margin-right:auto">' + ikon('i-hapus') + 'Hapus</button>' : '') + BTN_BATAL + '<button type="submit" class="tombol utama">' + ikon('i-cek') + 'Simpan</button>',
      function () {
        var nama = $('#tNama').value.trim(), tg = angka($('#tTarget').value);
        if (!nama || !tg) { $('#tSalah').textContent = 'Isi nama dan nominal target.'; return; }
        t.nama = nama; t.target = tg; t.terkumpul = angka($('#tKumpul').value); t.tenggat = $('#tTenggat').value;
        if (!edit) { t.id = uid(); D.target.push(t); }
        simpan(); tutupDialog(); render(false); toast(edit ? 'Target diperbarui' : 'Target "' + nama + '" dibuat');
      });
    ['#tTarget', '#tKumpul'].forEach(function (s) { var i = $(s); i.addEventListener('input', function () { var n = angka(i.value); i.value = n ? n.toLocaleString('id-ID') : ''; }); });
  }
  function dlgSetor(t) {
    bukaDialog('Setor ke ' + t.nama,
      '<div class="isian"><label for="sNom">Nominal setoran</label><div class="nominal"><span>Rp</span><input id="sNom" inputmode="numeric" placeholder="0"></div><p class="salah" id="sSalah" aria-live="polite"></p></div>' +
      '<div class="cepat-baris">' + [50000, 100000, 250000, 500000].map(function (n) { return '<button type="button" class="cepat" data-set="' + n + '">' + rpPendek(n) + '</button>'; }).join('') + '</div>',
      BTN_BATAL + '<button type="submit" class="tombol utama">' + ikon('i-cek') + 'Setor</button>',
      function () {
        var n = angka($('#sNom').value);
        if (!n) { $('#sSalah').textContent = 'Isi nominal setoran.'; goyang($('#sNom').parentNode); return; }
        var sebelum = t.terkumpul; t.terkumpul += n; simpan(); tutupDialog(); render(false);
        toast(t.terkumpul >= t.target && sebelum < t.target ? 'Target "' + t.nama + '" tercapai!' : rp(n) + ' masuk ke ' + t.nama);
      });
    var s = $('#sNom'); s.addEventListener('input', function () { var n = angka(s.value); s.value = n ? n.toLocaleString('id-ID') : ''; });
    $('#dlgIsi .cepat-baris').addEventListener('click', function (e) { var b = e.target.closest('[data-set]'); if (b) { s.value = Number(b.dataset.set).toLocaleString('id-ID'); s.focus(); } });
  }
  function konfirmasi(judul, pesan, label, fn) {
    bukaDialog(judul, '<p style="margin-top:0">' + esc(pesan) + '</p>', BTN_BATAL + '<button type="submit" class="tombol utama">' + esc(label) + '</button>', function () { tutupDialog(); fn(); });
  }

  // ================= Ekspor / backup =================
  function unduh(nama, isi, tipe) {
    var url = URL.createObjectURL(new Blob([isi], { type: tipe })), a = document.createElement('a');
    a.href = url; a.download = nama; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function csv() {
    var q = function (v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var baris = [['tanggal', 'amplop', 'catatan', 'nominal']].concat(D.belanja.slice().sort(urutBaru).map(function (b) { var a = amplopById(b.amplop); return [b.tgl, a ? a.nama : b.amplop, b.catatan, b.nominal]; }));
    unduh('belanja-keluarga-' + tglKey(new Date()) + '.csv', '﻿' + baris.map(function (r) { return r.map(q).join(','); }).join('\n'), 'text/csv;charset=utf-8');
    toast('CSV diunduh (' + D.belanja.length + ' baris)');
  }
  function backup() { unduh('backup-belanja-keluarga-' + tglKey(new Date()) + '.json', JSON.stringify(D, null, 2), 'application/json'); toast('Backup JSON diunduh'); }
  $('#berkasImpor').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (!d || !Array.isArray(d.amplop) || !Array.isArray(d.belanja)) throw new Error('format');
        konfirmasi('Pulihkan backup?', 'Data sekarang akan diganti dengan isi berkas "' + f.name + '" (' + d.belanja.length + ' belanja).', 'Pulihkan', function () { D = migrasi(d); simpan(); render(true); toast('Backup dipulihkan'); });
      } catch (e) { toast('Berkas bukan backup yang valid'); }
    };
    r.readAsText(f); this.value = '';
  });

  // ================= Aksi global =================
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-hal], [data-hal-ke], [data-aksi], [data-amplop], [data-periode]'); if (!t) return;
    if (t.dataset.hal) return ke(t.dataset.hal);
    if (t.dataset.halKe) return ke(t.dataset.halKe);
    if (t.dataset.periode) { S.periode = t.dataset.periode; return render(false); }
    if (t.dataset.amplop) { S.pilihAmplop = t.dataset.amplop; return dlgCatat({ amplop: t.dataset.amplop }); }
    var id = t.dataset.id, a = t.dataset.aksi;
    if (a === 'catat') dlgCatat();
    else if (a === 'geser') dlgGeser(t.dataset.ke);
    else if (a === 'amplop-baru') dlgAmplop();
    else if (a === 'ubah-amplop') dlgAmplop(amplopById(id));
    else if (a === 'ubah-belanja') dlgCatat(D.belanja.filter(function (b) { return b.id === id; })[0]);
    else if (a === 'hapus-belanja') {
      var idx = D.belanja.findIndex(function (b) { return b.id === id; }), lama = D.belanja[idx];
      D.belanja.splice(idx, 1); simpan(); tutupDialog(); render(false);
      toast('Belanja dihapus', { label: 'Urungkan', fn: function () { D.belanja.push(lama); simpan(); render(false); } });
    }
    else if (a === 'hapus-amplop') {
      var am = amplopById(id), jml = D.belanja.filter(function (b) { return b.amplop === id; }).length;
      konfirmasi('Hapus amplop "' + am.nama + '"?', jml ? jml + ' belanja di amplop ini akan dipindah ke amplop "Lainnya".' : 'Amplop ini belum punya belanja.', 'Hapus amplop', function () {
        if (jml) {
          var lain = D.amplop.filter(function (x) { return x.id === 'lain'; })[0];
          if (!lain) { lain = { id: 'lain', nama: 'Lainnya', ikon: 'lain', batas: 0 }; D.amplop.push(lain); }
          if (lain.id !== id) D.belanja.forEach(function (b) { if (b.amplop === id) b.amplop = 'lain'; });
        }
        D.amplop = D.amplop.filter(function (x) { return x.id !== id; });
        D.geser = D.geser.filter(function (g) { return g.dari !== id && g.ke !== id; });
        simpan(); render(false); toast('Amplop dihapus');
      });
    }
    else if (a === 'target-baru') dlgTarget();
    else if (a === 'ubah-target') dlgTarget(D.target.filter(function (x) { return x.id === id; })[0]);
    else if (a === 'hapus-target') { D.target = D.target.filter(function (x) { return x.id !== id; }); simpan(); tutupDialog(); render(false); toast('Target dihapus'); }
    else if (a === 'setor') dlgSetor(D.target.filter(function (x) { return x.id === id; })[0]);
    else if (a === 'simpan-profil') {
      var p = angka($('#inPemasukan').value), g = Math.min(28, Math.max(1, Number($('#inGajian').value) || 25));
      if (!p) { toast('Isi pemasukan per bulan'); return; }
      D.profil.pemasukan = p; D.profil.gajian = g; simpan(); render(false); toast('Pengaturan disimpan');
    }
    else if (a === 'hapus-foto') { delete D.profil.foto; simpan(); isiGambar(); render(false); toast('Foto profil dihapus'); }
    else if (a === 'csv') csv();
    else if (a === 'backup') backup();
    else if (a === 'pulihkan') $('#berkasImpor').click();
    else if (a === 'contoh') konfirmasi('Isi data contoh?', 'Semua data sekarang diganti data contoh. Unduh backup dulu bila perlu.', 'Ganti dengan contoh', function () { D = dataContoh(); simpan(); render(true); toast('Data contoh dimuat'); });
    else if (a === 'kosongkan') konfirmasi('Hapus semua belanja?', 'Semua catatan belanja dan geseran dihapus. Amplop & target tetap. Tindakan ini tidak bisa diurungkan.', 'Hapus semua', function () { D.belanja = []; D.geser = []; simpan(); render(true); toast('Semua belanja dihapus'); });
  });
  document.addEventListener('change', function (e) {
    if (e.target.id !== 'inFoto' || !e.target.files[0]) return;
    kecilkanFoto(e.target.files[0], function (u) { D.profil.foto = u; simpan(); isiGambar(); render(false); toast('Foto profil disimpan'); });
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'cariIn') { S.cari = e.target.value; var pos = e.target.selectionStart; render(false); var c = $('#cariIn'); c.focus(); c.setSelectionRange(pos, pos); }
    if (e.target.id === 'inPemasukan') { var n = angka(e.target.value); e.target.value = n ? n.toLocaleString('id-ID') : ''; }
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'saringIn') { S.saring = e.target.value; render(false); } });
  $('#bulanMundur').addEventListener('click', function () { geserBulan(-1); });
  $('#bulanMaju').addEventListener('click', function () { geserBulan(1); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (h !== S.hal && HAL[h]) ke(h); });

  // ================= Mulai =================
  muat();
  isiNama();
  var awal = location.hash.slice(1); if (HAL[awal]) S.hal = awal;
  render(true);
  tandaiBagian(); hitungTeksBagian();
})();
