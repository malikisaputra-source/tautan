/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Perpustakaan Digital Rumah Sakit — Maliki Studio (malikisaputra.biz.id). Lisensi MIT + atribusi. */
(function () {
  'use strict';
  var KUNCI = 'perpustakaan-digital-v1';
  var NAMA_TEMA = (window.TEMA && TEMA.nama) || 'Perpustakaan Digital';
  var DEMO = /[?&]demo\b/.test(location.search);

  // ---------- Utilitas ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function isoTgl(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function hariIni() { return isoTgl(new Date()); }
  function tambahHari(iso, n) { var d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return isoTgl(d); }
  function selisih(a, b) { return Math.round((new Date(a + 'T00:00:00') - new Date(b + 'T00:00:00')) / 864e5); } // a - b (hari)
  var BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function tglPendek(iso) { if (!iso) return '-'; var p = iso.split('-'); return +p[2] + ' ' + BULAN[+p[1] - 1] + ' ' + p[0]; }
  function rp(n) { return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('tampil'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('tampil'); }, 2600); }
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe }));
    a.download = nama; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---------- Data ----------
  function aturBawaan() { return { lamaPinjam: 7, maksPinjam: 3, dendaAktif: true, dendaPerHari: 1000 }; }
  function dataKosong() {
    return { versi: 1, nama: NAMA_TEMA, namaDariTema: true, pin: '1234', atur: aturBawaan(), kategori: ['Keperawatan', 'Kedokteran', 'Farmasi', 'Manajemen RS', 'Umum'], buku: [], anggota: [], pinjam: [], nomor: 1 };
  }
  function kodeBuku(n) { return 'PRS-' + ('000' + n).slice(-4); }
  function dataContoh() {
    var C = window.DATA_CONTOH, D = dataKosong(), t = hariIni();
    if (!C) return D;
    D.kategori = C.kategori.slice();
    C.buku.forEach(function (b) {
      D.buku.push({ id: id(), kode: kodeBuku(D.nomor++), judul: b[0], penulis: b[1], penerbit: b[2], tahun: b[3], isbn: b[4], kategori: b[5], jenis: b[6], rak: b[7], eksemplar: b[8], tautan: b[9], dibuat: t });
    });
    C.anggota.forEach(function (a, i) { D.anggota.push({ id: id(), nama: a[0], unit: a[1], nip: a[2], telp: '', kode: 'AGT-' + ('00' + (i + 1)).slice(-3) }); });
    C.pinjam.forEach(function (p) {
      var tp = tambahHari(t, -p[2]), tempo = tambahHari(tp, p[3]), kembali = p[4] == null ? null : tambahHari(t, -p[4]);
      var tel = kembali ? Math.max(0, selisih(kembali, tempo)) : 0;
      D.pinjam.push({ id: id(), bukuId: D.buku[p[0]].id, anggotaId: D.anggota[p[1]].id, tglPinjam: tp, jatuhTempo: tempo, tglKembali: kembali, denda: tel * D.atur.dendaPerHari, lunas: true });
    });
    return D;
  }
  var D;
  function muat() {
    if (DEMO) { D = dataContoh(); return; } // mode demo: data contoh di memori, tidak menyentuh data asli
    try { D = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { D = null; }
    if (!D || !D.buku) { D = dataContoh(); simpan(); }
    // Migrasi: isi field baru dengan nilai bawaan, jangan reset data pengguna.
    if (!D.atur) D.atur = aturBawaan();
    Object.keys(aturBawaan()).forEach(function (k) { if (D.atur[k] === undefined) D.atur[k] = aturBawaan()[k]; });
    if (!D.anggota) D.anggota = []; if (!D.pinjam) D.pinjam = []; if (!D.kategori) D.kategori = [];
    if (!D.nomor) D.nomor = D.buku.length + 1;
    D.buku.forEach(function (b) { if (!b.jenis) b.jenis = 'Buku'; if (b.tautan === undefined) b.tautan = ''; if (!b.kode) b.kode = kodeBuku(D.nomor++); });
    if (D.namaDariTema === undefined) D.namaDariTema = false;
    if (D.namaDariTema) D.nama = NAMA_TEMA;
  }
  function simpan() { if (DEMO) return; try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori browser penuh'); } }

  function bukuDari(i) { return D.buku.find(function (b) { return b.id === i; }); }
  function anggotaDari(i) { return D.anggota.find(function (a) { return a.id === i; }); }
  function aktif() { return D.pinjam.filter(function (p) { return !p.tglKembali; }); }
  function dipinjam(bukuId) { return D.pinjam.filter(function (p) { return !p.tglKembali && p.bukuId === bukuId; }).length; }
  function tersedia(b) { return Math.max(0, (+b.eksemplar || 0) - dipinjam(b.id)); }
  function telatHari(p) { return Math.max(0, selisih(p.tglKembali || hariIni(), p.jatuhTempo)); }
  function dendaBerjalan(p) { return D.atur.dendaAktif ? telatHari(p) * (+D.atur.dendaPerHari || 0) : 0; }

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
    if (t.nama) { NAMA_TEMA = t.nama; if (D && D.namaDariTema) { D.nama = t.nama; tulisNama(); } }
  }
  function tulisNama() { $$('[data-tema-nama]').forEach(function (e) { e.textContent = D.nama; }); document.title = D.nama + ' — Perpustakaan Digital'; }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (customizer: warna per bagian, sorot, tap-untuk-pilih) ----------
  var PETA_BAGIAN = {
    nav: '.samping, .bawah, .pin-merek',
    latar: 'main, .pin-form, .hal',
    panel: '.panel, .kartu-buku, .kartu-anggota, .stat:not(.sorot), dialog, .pin-kartu, .tabel-bungkus',
    utama: '.tombol.utama, .nav.aktif, .chip.aktif, .stat.sorot, .tab-kecil .aktif, .pin-titik',
    aksen: '.lencana, .grafik .batang, .populer .ke, .punggung',
    teks: 'h1, h2, .kartu-buku h3, .merek span'
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
    return L > 0.4 ? '#141a1a' : '#ffffff';
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

  // ---------- PIN admin ----------
  var pinKetik = '';
  function tampilPin() {
    $('#aplikasi').hidden = true; $('#layarPin').hidden = false; pinKetik = ''; gambarTitik();
    var pad = $('#padPin');
    if (!pad.children.length) {
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'hapus'].forEach(function (k) {
        var b = document.createElement('button'); b.type = 'button';
        if (!k) { b.disabled = true; b.className = 'kosong'; b.setAttribute('aria-hidden', 'true'); }
        else if (k === 'hapus') { b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 6h11v12H9l-6-6zM12 10l4 4M16 10l-4 4"/></svg>'; b.setAttribute('aria-label', 'Hapus angka'); b.dataset.k = k; }
        else { b.textContent = k; b.dataset.k = k; }
        pad.appendChild(b);
      });
      pad.addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (b) ketikPin(b.dataset.k); });
      document.addEventListener('keydown', function (e) {
        if ($('#layarPin').hidden) return;
        if (/^[0-9]$/.test(e.key)) ketikPin(e.key); else if (e.key === 'Backspace') ketikPin('hapus');
      });
    }
  }
  function gambarTitik() { $$('#pinTitik i').forEach(function (i, n) { i.classList.toggle('isi', n < pinKetik.length); }); }
  function ketikPin(k) {
    if (k === 'hapus') pinKetik = pinKetik.slice(0, -1); else if (pinKetik.length < 4) pinKetik += k;
    gambarTitik();
    if (pinKetik.length === 4) {
      if (pinKetik === String(D.pin)) { try { sessionStorage.setItem(KUNCI + '-buka', '1'); } catch (e) {} setTimeout(masuk, 120); }
      else { var t = $('#pinTitik'); t.classList.remove('goyang'); void t.offsetWidth; t.classList.add('goyang'); setTimeout(function () { pinKetik = ''; gambarTitik(); }, 380); toast('PIN salah'); }
    }
  }
  function masuk() { $('#layarPin').hidden = true; $('#aplikasi').hidden = false; buka('beranda'); }

  // ---------- Navigasi ----------
  var halAktif = 'beranda';
  function buka(h) {
    halAktif = h;
    $$('.nav[data-hal]').forEach(function (n) { var a = n.dataset.hal === h; n.classList.toggle('aktif', a); if (a) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    $$('.hal').forEach(function (s) { s.classList.toggle('aktif', s.id === 'hal-' + h); });
    ({ beranda: renderBeranda, katalog: renderKatalog, sirkulasi: renderSirkulasi, anggota: renderAnggota, laporan: renderLaporan, atur: renderAtur })[h]();
    window.scrollTo(0, 0);
  }

  // ---------- Ilustrasi punggung buku (SVG) ----------
  var NADA_KAT = {};
  function nadaKategori(k) {
    if (NADA_KAT[k] == null) { var i = D.kategori.indexOf(k); NADA_KAT[k] = (i < 0 ? Object.keys(NADA_KAT).length : i) % 4; }
    return NADA_KAT[k];
  }
  function sampul(b) {
    var n = nadaKategori(b.kategori), jurnal = b.jenis === 'Jurnal';
    var awal = esc((b.judul || '?').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase());
    return '<div class="sampul nada' + n + '" aria-hidden="true"><svg viewBox="0 0 60 80"><rect class="punggung" x="0" y="0" width="8" height="80"/>' +
      (jurnal ? '<path d="M16 14h34M16 20h26" class="garis-s"/><rect x="16" y="52" width="34" height="14" rx="2" class="blok-s"/>' : '<path d="M16 58h34M16 64h22" class="garis-s"/><circle cx="33" cy="28" r="11" class="blok-s"/>') +
      '<text x="33" y="' + (jurnal ? 42 : 32) + '" text-anchor="middle">' + awal + '</text></svg></div>';
  }

  // ---------- Beranda ----------
  function renderBeranda() {
    var t = hariIni(), ak = aktif();
    var telat = ak.filter(function (p) { return p.jatuhTempo < t; });
    var eks = D.buku.reduce(function (s, b) { return s + (+b.eksemplar || 0); }, 0);
    $('#tglHariIni').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('#statBeranda').innerHTML = stat('Judul koleksi', D.buku.length, eks + ' eksemplar', true) + stat('Sedang dipinjam', ak.length, 'dari ' + eks + ' eksemplar') +
      stat('Terlambat', telat.length, telat.length ? 'segera hubungi peminjam' : 'semua tepat waktu', false, telat.length > 0) + stat('Anggota staf', D.anggota.length, 'terdaftar');
    var tagih = ak.filter(function (p) { return selisih(p.jatuhTempo, t) <= 3; }).sort(function (a, b) { return a.jatuhTempo < b.jatuhTempo ? -1 : 1; });
    $('#daftarTagih').innerHTML = tagih.length ? tagih.slice(0, 6).map(barisPinjamRingkas).join('') : kosong('Tidak ada pinjaman yang perlu ditagih.');
    var akt = D.pinjam.slice().sort(function (a, b) { return (b.tglKembali || b.tglPinjam) > (a.tglKembali || a.tglPinjam) ? 1 : -1; }).slice(0, 6);
    $('#daftarAktivitas').innerHTML = akt.length ? akt.map(function (p) {
      var b = bukuDari(p.bukuId) || {}, a = anggotaDari(p.anggotaId) || {};
      return '<li><span class="titik ' + (p.tglKembali ? 'kembali' : 'pinjam') + '" aria-hidden="true"></span><div><b>' + esc(a.nama || 'Anggota terhapus') + '</b> ' + (p.tglKembali ? 'mengembalikan' : 'meminjam') + ' <i>' + esc(b.judul || 'koleksi terhapus') + '</i><small>' + tglPendek(p.tglKembali || p.tglPinjam) + '</small></div></li>';
    }).join('') : kosong('Belum ada aktivitas.');
  }
  function stat(label, angka, ket, sorot, bahaya) {
    return '<div class="stat' + (sorot ? ' sorot' : '') + (bahaya ? ' bahaya' : '') + '"><small>' + label + '</small><b>' + angka + '</b><span>' + esc(ket) + '</span></div>';
  }
  function kosong(t) { return '<li class="kosong-li">' + esc(t) + '</li>'; }
  function barisPinjamRingkas(p) {
    var b = bukuDari(p.bukuId) || {}, a = anggotaDari(p.anggotaId) || {}, s = selisih(p.jatuhTempo, hariIni());
    var lbl = s < 0 ? '<span class="lencana bahaya">Terlambat ' + (-s) + ' hari</span>' : s === 0 ? '<span class="lencana waspada">Jatuh tempo hari ini</span>' : '<span class="lencana">' + s + ' hari lagi</span>';
    return '<li><div><b>' + esc(b.judul || '-') + '</b><small>' + esc(a.nama || '-') + ' · ' + esc(a.unit || '') + '</small></div>' + lbl + '</li>';
  }

  // ---------- Katalog ----------
  function isiKategoriSelect() {
    var s = $('#saringKategori'), v = s.value;
    s.innerHTML = '<option value="">Semua kategori</option>' + D.kategori.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
    s.value = v;
  }
  function renderKatalog() {
    isiKategoriSelect();
    var q = $('#cariBuku').value.trim().toLowerCase(), kat = $('#saringKategori').value, jn = $('#saringJenis').value, st = $('#saringStatus').value;
    $('#chipKategori').innerHTML = ['', ].concat(D.kategori).map(function (k) {
      var n = k ? D.buku.filter(function (b) { return b.kategori === k; }).length : D.buku.length;
      return '<button class="chip' + (kat === k ? ' aktif' : '') + '" data-kat="' + esc(k) + '" aria-pressed="' + (kat === k) + '">' + esc(k || 'Semua') + ' <span>' + n + '</span></button>';
    }).join('');
    var hasil = D.buku.filter(function (b) {
      if (kat && b.kategori !== kat) return false;
      if (jn && b.jenis !== jn) return false;
      if (st === 'ada' && !tersedia(b)) return false;
      if (st === 'habis' && tersedia(b)) return false;
      if (st === 'ebook' && !b.tautan) return false;
      if (q) { var teks = [b.judul, b.penulis, b.penerbit, b.isbn, b.rak, b.kode, b.tahun].join(' ').toLowerCase(); if (teks.indexOf(q) < 0) return false; }
      return true;
    }).sort(function (a, b) { return a.judul.localeCompare(b.judul, 'id'); });
    $('#infoKatalog').textContent = hasil.length + ' dari ' + D.buku.length + ' koleksi';
    $('#daftarBuku').innerHTML = hasil.length ? hasil.map(function (b, i) {
      var t = tersedia(b);
      return '<article class="kartu-buku" style="--i:' + Math.min(i, 14) + '">' + sampul(b) +
        '<div class="info-buku"><p class="meta-atas"><span class="lencana">' + esc(b.kategori) + '</span>' + (b.jenis === 'Jurnal' ? '<span class="lencana netral">Jurnal</span>' : '') + (b.tautan ? '<span class="lencana netral">PDF</span>' : '') + '</p>' +
        '<h3>' + esc(b.judul) + '</h3><p class="redup">' + esc(b.penulis) + ' · ' + esc(b.penerbit) + (b.tahun ? ', ' + esc(b.tahun) : '') + '</p>' +
        '<dl class="detail"><div><dt>Rak</dt><dd>' + esc(b.rak || '-') + '</dd></div><div><dt>Kode</dt><dd>' + esc(b.kode) + '</dd></div><div><dt>ISBN</dt><dd>' + esc(b.isbn || '-') + '</dd></div></dl>' +
        '<p class="stok ' + (t ? 'ada' : 'habis') + '"><span aria-hidden="true"></span>' + (t ? t + ' dari ' + b.eksemplar + ' tersedia' : 'Semua ' + b.eksemplar + ' sedang dipinjam') + '</p>' +
        '<div class="aksi-kartu">' + (t ? '<button class="tombol utama kecil" data-pinjam="' + b.id + '">Pinjamkan</button>' : '') +
        (b.tautan ? '<a class="tombol kecil" href="' + esc(b.tautan) + '" target="_blank" rel="noopener">Buka PDF</a>' : '') +
        '<button class="tombol kecil ikon" data-label="' + b.id + '" aria-label="Cetak label ' + esc(b.judul) + '"><svg viewBox="0 0 24 24"><path d="M4 6v12M7 6v12M10 6v12M14 6v12M16 6v12M20 6v12"/></svg></button>' +
        '<button class="tombol kecil ikon" data-edit="' + b.id + '" aria-label="Ubah ' + esc(b.judul) + '"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg></button></div></div></article>';
    }).join('') : '<div class="kosong-besar"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 14c8-3 15-2 22 3v34c-7-5-14-6-22-3zM54 14c-8-3-15-2-22 3v34c7-5 14-6 22-3z"/></svg><p>' + (D.buku.length ? 'Tidak ada koleksi yang cocok. Coba kata lain atau hapus filter.' : 'Katalog masih kosong. Tambah koleksi atau impor CSV.') + '</p></div>';
  }

  function dialog(html, kelas) {
    var d = $('#dlg'); $('#dlgIsi').innerHTML = html; d.className = kelas || '';
    if (!d.open) d.showModal();
    var f = d.querySelector('input:not([type=hidden]),select,textarea'); if (f) f.focus();
    return d;
  }
  function tutup() { var d = $('#dlg'); if (d.open) { d.classList.add('keluar'); setTimeout(function () { d.close(); d.classList.remove('keluar'); }, 160); } }

  function formBuku(b) {
    var baru = !b; b = b || { judul: '', penulis: '', penerbit: '', tahun: new Date().getFullYear(), isbn: '', kategori: D.kategori[0] || '', jenis: 'Buku', rak: '', eksemplar: 1, tautan: '' };
    dialog('<form id="fBuku" class="form-dlg"><h2 id="dlgJudul">' + (baru ? 'Tambah koleksi' : 'Ubah koleksi') + '</h2>' +
      '<label class="medan">Judul<input name="judul" required maxlength="200" value="' + esc(b.judul) + '"></label>' +
      '<div class="baris-medan"><label class="medan">Penulis<input name="penulis" maxlength="120" value="' + esc(b.penulis) + '"></label><label class="medan">Penerbit<input name="penerbit" maxlength="120" value="' + esc(b.penerbit) + '"></label></div>' +
      '<div class="baris-medan tiga"><label class="medan">Tahun<input name="tahun" type="number" min="1800" max="2100" value="' + esc(b.tahun) + '"></label><label class="medan">ISBN/ISSN<input name="isbn" maxlength="30" value="' + esc(b.isbn) + '"></label><label class="medan">Jenis<select name="jenis"><option' + (b.jenis === 'Buku' ? ' selected' : '') + '>Buku</option><option' + (b.jenis === 'Jurnal' ? ' selected' : '') + '>Jurnal</option></select></label></div>' +
      '<div class="baris-medan tiga"><label class="medan">Kategori<input name="kategori" list="dlKat" required value="' + esc(b.kategori) + '"></label><label class="medan">Rak/lokasi<input name="rak" maxlength="30" value="' + esc(b.rak) + '"></label><label class="medan">Eksemplar<input name="eksemplar" type="number" min="0" max="999" required value="' + esc(b.eksemplar) + '"></label></div>' +
      '<datalist id="dlKat">' + D.kategori.map(function (k) { return '<option value="' + esc(k) + '">'; }).join('') + '</datalist>' +
      '<label class="medan">Tautan e-book/PDF (opsional)<input name="tautan" type="url" placeholder="https://…" value="' + esc(b.tautan) + '"></label>' +
      '<div class="aksi-dlg">' + (baru ? '' : '<button type="button" class="tombol bahaya" id="hapusBuku">Hapus</button>') + '<span class="isi"></span><button type="button" class="tombol" data-tutup>Batal</button><button class="tombol utama">Simpan</button></div></form>');
    $('#fBuku').addEventListener('submit', function (e) {
      e.preventDefault(); var f = new FormData(e.target), o = {};
      ['judul', 'penulis', 'penerbit', 'isbn', 'kategori', 'jenis', 'rak', 'tautan'].forEach(function (k) { o[k] = String(f.get(k) || '').trim(); });
      o.tahun = +f.get('tahun') || ''; o.eksemplar = Math.max(0, +f.get('eksemplar') || 0);
      if (!baru && o.eksemplar < dipinjam(b.id)) { toast('Eksemplar tidak boleh kurang dari yang sedang dipinjam (' + dipinjam(b.id) + ')'); return; }
      if (o.kategori && D.kategori.indexOf(o.kategori) < 0) D.kategori.push(o.kategori);
      if (baru) { o.id = id(); o.kode = kodeBuku(D.nomor++); o.dibuat = hariIni(); D.buku.push(o); } else Object.assign(b, o);
      simpan(); tutup(); renderKatalog(); toast(baru ? 'Koleksi ditambahkan' : 'Perubahan disimpan');
    });
    var h = $('#hapusBuku');
    if (h) h.addEventListener('click', function () {
      if (dipinjam(b.id)) { toast('Masih ada yang meminjam koleksi ini'); return; }
      if (!confirm('Hapus "' + b.judul + '" dari katalog? Riwayat pinjamnya tetap tersimpan.')) return;
      D.buku = D.buku.filter(function (x) { return x !== b; }); simpan(); tutup(); renderKatalog(); toast('Koleksi dihapus');
    });
  }

  // ---------- CSV ----------
  var KOLOM_CSV = ['judul', 'penulis', 'penerbit', 'tahun', 'isbn', 'kategori', 'jenis', 'rak', 'eksemplar', 'tautan'];
  function selCSV(v) { v = String(v == null ? '' : v); if (/^[=+\-@]/.test(v)) v = "'" + v; return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function parseCSV(teks) {
    teks = teks.replace(/^﻿/, '');
    var pemisah = (teks.split('\n')[0].match(/;/g) || []).length > (teks.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
    var baris = [], sel = '', row = [], kutip = false;
    for (var i = 0; i < teks.length; i++) {
      var c = teks[i];
      if (kutip) { if (c === '"') { if (teks[i + 1] === '"') { sel += '"'; i++; } else kutip = false; } else sel += c; }
      else if (c === '"') kutip = true;
      else if (c === pemisah) { row.push(sel); sel = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && teks[i + 1] === '\n') i++; row.push(sel); baris.push(row); row = []; sel = ''; }
      else sel += c;
    }
    if (sel || row.length) { row.push(sel); baris.push(row); }
    return baris.filter(function (r) { return r.some(function (x) { return x.trim(); }); });
  }
  function imporCSV(teks) {
    var b = parseCSV(teks); if (!b.length) return { tambah: 0, ubah: 0 };
    var kepala = b[0].map(function (h) { return h.trim().toLowerCase(); }), mulai = 1;
    if (kepala.indexOf('judul') < 0) { kepala = KOLOM_CSV; mulai = 0; }
    var tambah = 0, ubah = 0;
    b.slice(mulai).forEach(function (r) {
      var o = {}; kepala.forEach(function (k, i) { o[k] = (r[i] || '').trim(); });
      if (!o.judul) return;
      var data = { judul: o.judul, penulis: o.penulis || '', penerbit: o.penerbit || '', tahun: +o.tahun || '', isbn: o.isbn || '', kategori: o.kategori || 'Umum', jenis: /jurnal/i.test(o.jenis) ? 'Jurnal' : 'Buku', rak: o.rak || '', eksemplar: Math.max(0, parseInt(o.eksemplar, 10) || 1), tautan: /^https?:\/\//i.test(o.tautan || '') ? o.tautan : '' };
      if (D.kategori.indexOf(data.kategori) < 0) D.kategori.push(data.kategori);
      var ada = D.buku.find(function (x) { return (data.isbn && x.isbn === data.isbn) || (!data.isbn && x.judul.toLowerCase() === data.judul.toLowerCase()); });
      if (ada) { Object.assign(ada, data); ubah++; } else { data.id = id(); data.kode = kodeBuku(D.nomor++); data.dibuat = hariIni(); D.buku.push(data); tambah++; }
    });
    simpan(); return { tambah: tambah, ubah: ubah };
  }
  function eksporCSV() {
    var isi = [KOLOM_CSV.concat(['kode', 'tersedia']).join(',')].concat(D.buku.map(function (b) {
      return KOLOM_CSV.map(function (k) { return selCSV(b[k]); }).concat([selCSV(b.kode), tersedia(b)]).join(',');
    })).join('\n');
    unduh('katalog-' + hariIni() + '.csv', '﻿' + isi, 'text/csv;charset=utf-8');
  }
  function dataPublik() {
    return { nama: D.nama, diperbarui: hariIni(), buku: D.buku.map(function (b) {
      return { kode: b.kode, judul: b.judul, penulis: b.penulis, penerbit: b.penerbit, tahun: b.tahun, isbn: b.isbn, kategori: b.kategori, jenis: b.jenis, rak: b.rak, eksemplar: +b.eksemplar || 0, tersedia: tersedia(b), tautan: b.tautan || '' };
    }) };
  }
  function eksporPublik() { unduh('katalog.json', JSON.stringify(dataPublik(), null, 1), 'application/json'); toast('katalog.json diunduh. Unggah ke folder katalog.html'); }
  function dialogEkspor() {
    dialog('<div class="form-dlg"><h2 id="dlgJudul">Ekspor katalog</h2><p class="redup">Pilih format sesuai keperluan.</p><div class="pilihan">' +
      '<button class="pilih" data-ekspor="csv"><b>CSV (Excel/Sheets)</b><span>Untuk diolah atau diimpor ulang.</span></button>' +
      '<button class="pilih" data-ekspor="json"><b>katalog.json (katalog publik)</b><span>Unggah ke hosting, dibaca katalog.html (tanpa data anggota).</span></button>' +
      '<button class="pilih" data-ekspor="label"><b>Cetak label semua koleksi</b><span>Kartu punggung dengan barcode Code 39.</span></button>' +
      '</div><div class="aksi-dlg"><span class="isi"></span><button class="tombol" data-tutup>Tutup</button></div></div>');
  }
  function dialogImpor() {
    dialog('<div class="form-dlg"><h2 id="dlgJudul">Impor katalog dari CSV</h2><p class="redup">Kolom (baris pertama): <code>' + KOLOM_CSV.join(',') + '</code>. Pemisah koma atau titik koma. Koleksi dengan ISBN sama (atau judul sama bila tanpa ISBN) akan diperbarui, bukan diduplikasi.</p>' +
      '<div class="aksi-dlg"><a class="tombol" href="contoh-katalog.csv" download>Unduh contoh CSV</a><span class="isi"></span><button class="tombol" data-tutup>Batal</button><button class="tombol utama" id="pilihCSV">Pilih berkas CSV</button></div></div>');
    $('#pilihCSV').addEventListener('click', function () { $('#berkasCSV').click(); });
  }

  // ---------- Label & barcode Code 39 (buatan sendiri) ----------
  var C39 = { '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
    A: 'wnnnnwnnw', B: 'nnwnnwnnw', C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn', F: 'nnwnwwnnn', G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn', K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn',
    N: 'nnnnwnnww', O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn', S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw', W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn', Z: 'nwwnwnnnn',
    '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn' };
  function barcode(teks) {
    var s = '*' + String(teks).toUpperCase().replace(/[^0-9A-Z\-. ]/g, '') + '*', x = 0, bar = '';
    for (var i = 0; i < s.length; i++) {
      var p = C39[s[i]];
      for (var j = 0; j < 9; j++) { var w = p[j] === 'w' ? 3 : 1; if (j % 2 === 0) bar += '<rect x="' + x + '" y="0" width="' + w + '" height="40"/>'; x += w; }
      x += 1;
    }
    return '<svg class="barcode" viewBox="0 0 ' + x + ' 40" preserveAspectRatio="none" role="img" aria-label="Barcode ' + esc(teks) + '">' + bar + '</svg>';
  }
  function kartuLabel(b) {
    return '<div class="label-buku"><div class="label-kepala"><span>' + esc(D.nama) + '</span><b>' + esc(b.rak || '-') + '</b></div>' +
      '<p class="label-judul">' + esc(b.judul) + '</p><p class="label-penulis">' + esc(b.penulis) + (b.tahun ? ' · ' + esc(b.tahun) : '') + '</p>' +
      barcode(b.kode) + '<p class="label-kode">' + esc(b.kode) + ' · ' + esc(b.kategori) + '</p></div>';
  }
  function dialogLabel(b) {
    dialog('<div class="form-dlg"><h2 id="dlgJudul">Label koleksi</h2><div class="pratinjau-label">' + kartuLabel(b) + '</div>' +
      '<label class="medan">Jumlah label (sesuai eksemplar)<input type="number" id="jmlLabel" min="1" max="99" value="' + Math.max(1, +b.eksemplar || 1) + '"></label>' +
      '<div class="aksi-dlg"><span class="isi"></span><button class="tombol" data-tutup>Tutup</button><button class="tombol utama" id="cetakLabel">Cetak</button></div></div>');
    $('#cetakLabel').addEventListener('click', function () { var n = Math.min(99, Math.max(1, +$('#jmlLabel').value || 1)), a = []; for (var i = 0; i < n; i++) a.push(b); cetakLabel(a); });
  }
  function cetakLabel(daftar) {
    $('#areaCetak').innerHTML = '<div class="lembar-label">' + daftar.map(kartuLabel).join('') + '</div>';
    document.body.classList.add('cetak-label'); tutup();
    setTimeout(function () { window.print(); }, 200);
  }
  window.addEventListener('afterprint', function () { document.body.classList.remove('cetak-label'); $('#areaCetak').innerHTML = ''; });

  // ---------- Sirkulasi ----------
  var tabPinjam = 'aktif';
  function labelAnggota(a) { return a.nama + ' — ' + a.unit + ' (' + (a.nip || a.kode) + ')'; }
  function labelBuku(b) { return b.judul + ' [' + b.kode + ']'; }
  function cariDariLabel(arr, v, fn) { v = v.trim(); return arr.find(function (x) { return fn(x) === v; }) || arr.find(function (x) { return v && (x.kode === v.toUpperCase() || x.nip === v); }); }
  function renderSirkulasi() {
    $('#dlAnggota').innerHTML = D.anggota.map(function (a) { return '<option value="' + esc(labelAnggota(a)) + '">'; }).join('');
    $('#dlBuku').innerHTML = D.buku.filter(function (b) { return tersedia(b) > 0; }).map(function (b) { return '<option value="' + esc(labelBuku(b)) + '">'; }).join('');
    if (!$('#pinjamTgl').value) { $('#pinjamTgl').value = hariIni(); $('#pinjamTempo').value = tambahHari(hariIni(), +D.atur.lamaPinjam || 7); }
    renderDaftarPinjam();
  }
  function renderDaftarPinjam() {
    var t = hariIni(), q = $('#cariPinjam').value.trim().toLowerCase(), ak = aktif();
    var telat = ak.filter(function (p) { return p.jatuhTempo < t; });
    $('#jmlAktif').textContent = ak.length; $('#jmlTelat').textContent = telat.length;
    $$('.tab-kecil button').forEach(function (b) { var a = b.dataset.tab === tabPinjam; b.classList.toggle('aktif', a); b.setAttribute('aria-selected', a); });
    var daftar = tabPinjam === 'aktif' ? ak : tabPinjam === 'terlambat' ? telat : D.pinjam.filter(function (p) { return p.tglKembali; });
    daftar = daftar.filter(function (p) {
      if (!q) return true; var b = bukuDari(p.bukuId) || {}, a = anggotaDari(p.anggotaId) || {};
      return [b.judul, b.kode, a.nama, a.unit, a.nip].join(' ').toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return tabPinjam === 'riwayat' ? (a.tglKembali < b.tglKembali ? 1 : -1) : (a.jatuhTempo < b.jatuhTempo ? -1 : 1); });
    $('#daftarPinjam').innerHTML = daftar.length ? daftar.slice(0, 200).map(function (p, i) {
      var b = bukuDari(p.bukuId) || { judul: 'Koleksi terhapus', kode: '-' }, a = anggotaDari(p.anggotaId) || { nama: 'Anggota terhapus', unit: '' };
      var s = selisih(p.jatuhTempo, t), status, aksi = '';
      if (p.tglKembali) {
        var tl = telatHari(p);
        status = '<span class="lencana ' + (tl ? 'waspada' : 'netral') + '">' + (tl ? 'Telat ' + tl + ' hari' : 'Tepat waktu') + '</span>' + (p.denda ? '<span class="lencana ' + (p.lunas ? 'netral' : 'bahaya') + '">' + rp(p.denda) + (p.lunas ? ' lunas' : ' belum lunas') + '</span>' : '');
        if (p.denda && !p.lunas) aksi = '<button class="tombol kecil" data-lunas="' + p.id + '">Tandai lunas</button>';
      } else {
        status = s < 0 ? '<span class="lencana bahaya">Terlambat ' + (-s) + ' hari' + (D.atur.dendaAktif ? ' · ' + rp(dendaBerjalan(p)) : '') + '</span>' : '<span class="lencana' + (s === 0 ? ' waspada' : '') + '">' + (s === 0 ? 'Jatuh tempo hari ini' : s + ' hari lagi') + '</span>';
        aksi = '<button class="tombol kecil" data-panjang="' + p.id + '">Perpanjang</button><button class="tombol utama kecil" data-kembali="' + p.id + '">Kembalikan</button>';
      }
      return '<li style="--i:' + Math.min(i, 14) + '"><div class="pinjam-info"><b>' + esc(b.judul) + '</b><small>' + esc(a.nama) + ' · ' + esc(a.unit) + '</small>' +
        '<small class="tgl">Pinjam ' + tglPendek(p.tglPinjam) + ' · Tempo ' + tglPendek(p.jatuhTempo) + (p.tglKembali ? ' · Kembali ' + tglPendek(p.tglKembali) : '') + '</small><p class="status">' + status + '</p></div>' +
        (aksi ? '<div class="aksi-kartu">' + aksi + '</div>' : '') + '</li>';
    }).join('') : kosong(tabPinjam === 'terlambat' ? 'Tidak ada pinjaman terlambat.' : tabPinjam === 'aktif' ? 'Belum ada pinjaman aktif.' : 'Riwayat masih kosong.');
  }
  function catatPinjam(anggotaId, bukuId, tgl, tempo) {
    var b = bukuDari(bukuId), a = anggotaDari(anggotaId);
    if (!a) return 'Anggota tidak ditemukan. Pilih dari daftar.';
    if (!b) return 'Koleksi tidak ditemukan. Pilih dari daftar.';
    if (!tersedia(b)) return 'Semua eksemplar sedang dipinjam.';
    if (tempo < tgl) return 'Jatuh tempo tidak boleh sebelum tanggal pinjam.';
    var jml = aktif().filter(function (p) { return p.anggotaId === a.id; }).length;
    if (jml >= +D.atur.maksPinjam) return a.nama + ' sudah meminjam ' + jml + ' koleksi (batas ' + D.atur.maksPinjam + ').';
    if (aktif().some(function (p) { return p.anggotaId === a.id && p.bukuId === b.id; })) return a.nama + ' masih meminjam judul ini.';
    D.pinjam.push({ id: id(), bukuId: b.id, anggotaId: a.id, tglPinjam: tgl, jatuhTempo: tempo, tglKembali: null, denda: 0, lunas: true });
    simpan(); return '';
  }
  function kembalikan(pid, tgl) {
    var p = D.pinjam.find(function (x) { return x.id === pid; }); if (!p || p.tglKembali) return null;
    p.tglKembali = tgl || hariIni(); p.denda = dendaBerjalan(p); p.lunas = !p.denda; simpan(); return p;
  }
  function dialogKembali(p) {
    var b = bukuDari(p.bukuId) || {}, a = anggotaDari(p.anggotaId) || {}, tl = telatHari(p), dn = dendaBerjalan(p);
    dialog('<form id="fKembali" class="form-dlg"><h2 id="dlgJudul">Kembalikan koleksi</h2><p><b>' + esc(b.judul) + '</b><br><span class="redup">' + esc(a.nama) + ' · jatuh tempo ' + tglPendek(p.jatuhTempo) + '</span></p>' +
      (tl ? '<div class="kotak-denda"><span>Terlambat ' + tl + ' hari</span><b>' + (D.atur.dendaAktif ? rp(dn) : 'Denda dimatikan') + '</b></div>' + (dn ? '<label class="saklar"><input type="checkbox" name="lunas" checked><span class="saklar-tampil" aria-hidden="true"></span><span>Denda dibayar sekarang</span></label>' : '') : '<p class="lencana netral">Dikembalikan tepat waktu</p>') +
      '<div class="aksi-dlg"><span class="isi"></span><button type="button" class="tombol" data-tutup>Batal</button><button class="tombol utama">Konfirmasi kembali</button></div></form>');
    $('#fKembali').addEventListener('submit', function (e) {
      e.preventDefault(); var lunas = e.target.lunas ? e.target.lunas.checked : true;
      var r = kembalikan(p.id); if (r && r.denda) r.lunas = lunas; simpan();
      tutup(); renderDaftarPinjam(); renderSirkulasi(); toast('Koleksi dikembalikan' + (r && r.denda ? ' · denda ' + rp(r.denda) + (lunas ? ' lunas' : ' dicatat') : ''));
    });
  }
  function eksporPinjamCSV() {
    var isi = ['tanggal_pinjam,jatuh_tempo,tanggal_kembali,kode,judul,anggota,unit,nip,telat_hari,denda,lunas'].concat(D.pinjam.map(function (p) {
      var b = bukuDari(p.bukuId) || {}, a = anggotaDari(p.anggotaId) || {};
      return [p.tglPinjam, p.jatuhTempo, p.tglKembali || '', b.kode, b.judul, a.nama, a.unit, a.nip, p.tglKembali ? telatHari(p) : '', p.denda || 0, p.lunas ? 'ya' : 'tidak'].map(selCSV).join(',');
    })).join('\n');
    unduh('riwayat-pinjam-' + hariIni() + '.csv', '﻿' + isi, 'text/csv;charset=utf-8');
  }

  // ---------- Anggota ----------
  function renderAnggota() {
    var q = $('#cariAnggota').value.trim().toLowerCase();
    var ds = D.anggota.filter(function (a) { return !q || [a.nama, a.unit, a.nip, a.kode].join(' ').toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
    $('#daftarAnggota').innerHTML = ds.length ? ds.map(function (a, i) {
      var ak = aktif().filter(function (p) { return p.anggotaId === a.id; }), tl = ak.filter(function (p) { return p.jatuhTempo < hariIni(); }).length;
      var total = D.pinjam.filter(function (p) { return p.anggotaId === a.id; }).length;
      var inisial = esc(a.nama.replace(/^(dr|ns|apt|bdn)\.?\s+/i, '').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase());
      return '<article class="kartu-anggota" style="--i:' + Math.min(i, 14) + '"><span class="avatar" aria-hidden="true">' + inisial + '</span><div><h3>' + esc(a.nama) + '</h3><p class="redup">' + esc(a.unit) + '</p><p class="kecil">NIP ' + esc(a.nip || '-') + ' · ' + esc(a.kode) + '</p>' +
        '<p class="meta-atas"><span class="lencana netral">' + ak.length + ' dipinjam</span>' + (tl ? '<span class="lencana bahaya">' + tl + ' terlambat</span>' : '') + '<span class="lencana netral">' + total + ' total</span></p></div>' +
        '<button class="tombol kecil ikon" data-edit-agt="' + a.id + '" aria-label="Ubah ' + esc(a.nama) + '"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg></button></article>';
    }).join('') : '<div class="kosong-besar"><p>' + (D.anggota.length ? 'Anggota tidak ditemukan.' : 'Belum ada anggota. Tambahkan staf yang boleh meminjam.') + '</p></div>';
  }
  function formAnggota(a) {
    var baru = !a; a = a || { nama: '', unit: '', nip: '', telp: '' };
    dialog('<form id="fAgt" class="form-dlg"><h2 id="dlgJudul">' + (baru ? 'Tambah anggota' : 'Ubah anggota') + '</h2>' +
      '<label class="medan">Nama lengkap &amp; gelar<input name="nama" required maxlength="100" value="' + esc(a.nama) + '"></label>' +
      '<label class="medan">Unit/instalasi<input name="unit" required maxlength="80" value="' + esc(a.unit) + '" placeholder="mis. Rawat Inap Melati"></label>' +
      '<div class="baris-medan"><label class="medan">NIP/NIK pegawai<input name="nip" inputmode="numeric" maxlength="24" value="' + esc(a.nip) + '"></label><label class="medan">No. HP (opsional)<input name="telp" type="tel" maxlength="20" value="' + esc(a.telp) + '"></label></div>' +
      '<div class="aksi-dlg">' + (baru ? '' : '<button type="button" class="tombol bahaya" id="hapusAgt">Hapus</button>') + '<span class="isi"></span><button type="button" class="tombol" data-tutup>Batal</button><button class="tombol utama">Simpan</button></div></form>');
    $('#fAgt').addEventListener('submit', function (e) {
      e.preventDefault(); var f = new FormData(e.target), o = {};
      ['nama', 'unit', 'nip', 'telp'].forEach(function (k) { o[k] = String(f.get(k) || '').trim(); });
      if (o.nip && D.anggota.some(function (x) { return x !== a && x.nip === o.nip; })) { toast('NIP sudah dipakai anggota lain'); return; }
      if (baru) { o.id = id(); o.kode = 'AGT-' + ('00' + (D.anggota.length + 1)).slice(-3); D.anggota.push(o); } else Object.assign(a, o);
      simpan(); tutup(); renderAnggota(); toast(baru ? 'Anggota ditambahkan' : 'Data anggota disimpan');
    });
    var h = $('#hapusAgt');
    if (h) h.addEventListener('click', function () {
      if (aktif().some(function (p) { return p.anggotaId === a.id; })) { toast('Anggota masih punya pinjaman aktif'); return; }
      if (!confirm('Hapus anggota ' + a.nama + '? Riwayat pinjamnya tetap ada.')) return;
      D.anggota = D.anggota.filter(function (x) { return x !== a; }); simpan(); tutup(); renderAnggota(); toast('Anggota dihapus');
    });
  }

  // ---------- Laporan ----------
  function laporan(hari) {
    var t = hariIni(), batas = hari ? tambahHari(t, -hari) : '0000';
    var ps = D.pinjam.filter(function (p) { return p.tglPinjam >= batas; });
    var hit = {}; ps.forEach(function (p) { hit[p.bukuId] = (hit[p.bukuId] || 0) + 1; });
    var populer = Object.keys(hit).map(function (k) { return { buku: bukuDari(k), n: hit[k] }; }).filter(function (x) { return x.buku; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 8);
    var kat = {}; ps.forEach(function (p) { var b = bukuDari(p.bukuId); var k = b ? b.kategori : 'Lainnya'; kat[k] = (kat[k] || 0) + 1; });
    var telat = aktif().filter(function (p) { return p.jatuhTempo < t; });
    var denda = ps.reduce(function (s, p) { return s + (p.denda || 0); }, 0), belum = D.pinjam.reduce(function (s, p) { return s + (p.denda && !p.lunas ? p.denda : 0); }, 0);
    return { jumlah: ps.length, populer: populer, kategori: kat, aktif: aktif().length, telat: telat, denda: denda, belumLunas: belum, peminjam: Object.keys(ps.reduce(function (o, p) { o[p.anggotaId] = 1; return o; }, {})).length };
  }
  function renderLaporan() {
    var r = laporan(+$('#periodeLaporan').value);
    $('#statLaporan').innerHTML = stat('Peminjaman', r.jumlah, 'dalam periode', true) + stat('Pinjaman aktif', r.aktif, 'saat ini') + stat('Terlambat', r.telat.length, 'belum kembali', false, r.telat.length > 0) +
      (D.atur.dendaAktif ? stat('Denda', rp(r.denda), r.belumLunas ? rp(r.belumLunas) + ' belum lunas' : 'semua lunas') : stat('Staf peminjam', r.peminjam, 'orang berbeda'));
    var maks = r.populer.length ? r.populer[0].n : 1;
    $('#daftarPopuler').innerHTML = r.populer.length ? r.populer.map(function (x, i) {
      return '<li><span class="ke">' + (i + 1) + '</span><div><b>' + esc(x.buku.judul) + '</b><span class="batang-mini"><i style="width:' + Math.round(x.n / maks * 100) + '%"></i></span></div><span class="n">' + x.n + '×</span></li>';
    }).join('') : kosong('Belum ada peminjaman pada periode ini.');
    var ks = Object.keys(r.kategori).sort(function (a, b) { return r.kategori[b] - r.kategori[a]; }), mk = ks.length ? r.kategori[ks[0]] : 1;
    $('#grafikKategori').innerHTML = ks.length ? ks.map(function (k, i) {
      return '<div class="baris-grafik"><span>' + esc(k) + '</span><div class="jalur"><i class="batang" style="--w:' + Math.round(r.kategori[k] / mk * 100) + '%;--i:' + i + '"></i></div><b>' + r.kategori[k] + '</b></div>';
    }).join('') : '<p class="redup">Belum ada data.</p>';
    $('#tabelTelat').innerHTML = '<thead><tr><th>Koleksi</th><th>Peminjam</th><th>Unit</th><th>Jatuh tempo</th><th>Telat</th>' + (D.atur.dendaAktif ? '<th>Denda berjalan</th>' : '') + '</tr></thead><tbody>' +
      (r.telat.length ? r.telat.map(function (p) {
        var b = bukuDari(p.bukuId) || {}, a = anggotaDari(p.anggotaId) || {};
        return '<tr><td>' + esc(b.judul) + '</td><td>' + esc(a.nama) + '</td><td>' + esc(a.unit) + '</td><td>' + tglPendek(p.jatuhTempo) + '</td><td>' + telatHari(p) + ' hari</td>' + (D.atur.dendaAktif ? '<td>' + rp(dendaBerjalan(p)) + '</td>' : '') + '</tr>';
      }).join('') : '<tr><td colspan="6" class="redup">Tidak ada pinjaman terlambat. Mantap.</td></tr>') + '</tbody>';
  }

  // ---------- Atur ----------
  function renderAtur() {
    $('#aturNama').value = D.nama; $('#aturLama').value = D.atur.lamaPinjam; $('#aturMaks').value = D.atur.maksPinjam;
    $('#aturDenda').checked = !!D.atur.dendaAktif; $('#aturDendaHari').value = D.atur.dendaPerHari; $('#medanDenda').hidden = !D.atur.dendaAktif;
  }

  // ---------- Event ----------
  function ikatEvent() {
    $$('.nav[data-hal]').forEach(function (n) { n.addEventListener('click', function () { buka(n.dataset.hal); }); });
    $$('[data-ke]').forEach(function (n) { n.addEventListener('click', function () { buka(n.dataset.ke); }); });
    $('#btnKunci').addEventListener('click', function () { try { sessionStorage.removeItem(KUNCI + '-buka'); } catch (e) {} tampilPin(); });
    $('#dlg').addEventListener('click', function (e) { if (e.target.closest('[data-tutup]') || e.target === e.currentTarget) { e.preventDefault(); tutup(); } });
    $('#dlg').addEventListener('click', function (e) {
      var x = e.target.closest('[data-ekspor]'); if (!x) return;
      if (x.dataset.ekspor === 'csv') { eksporCSV(); tutup(); } else if (x.dataset.ekspor === 'json') { eksporPublik(); tutup(); } else cetakLabel(D.buku);
    });
    // katalog
    ['#cariBuku', '#saringKategori', '#saringJenis', '#saringStatus'].forEach(function (s) { $(s).addEventListener('input', renderKatalog); });
    $('#chipKategori').addEventListener('click', function (e) { var c = e.target.closest('[data-kat]'); if (!c) return; $('#saringKategori').value = c.dataset.kat; renderKatalog(); });
    $('#btnTambahBuku').addEventListener('click', function () { formBuku(null); });
    $('#btnImpor').addEventListener('click', dialogImpor);
    $('#btnEkspor').addEventListener('click', dialogEkspor);
    $('#daftarBuku').addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.dataset.edit) formBuku(bukuDari(t.dataset.edit));
      else if (t.dataset.label) dialogLabel(bukuDari(t.dataset.label));
      else if (t.dataset.pinjam) { var b = bukuDari(t.dataset.pinjam); buka('sirkulasi'); $('#pinjamBuku').value = labelBuku(b); $('#pinjamAnggota').focus(); }
    });
    $('#berkasCSV').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return; var rd = new FileReader();
      rd.onload = function () { var r = imporCSV(String(rd.result)); tutup(); renderKatalog(); toast(r.tambah + ' koleksi baru, ' + r.ubah + ' diperbarui'); e.target.value = ''; };
      rd.readAsText(f);
    });
    // sirkulasi
    $('#pinjamTgl').addEventListener('change', function () { $('#pinjamTempo').value = tambahHari(this.value, +D.atur.lamaPinjam || 7); });
    $('#pinjamAnggota').addEventListener('change', function () {
      var a = cariDariLabel(D.anggota, this.value, labelAnggota);
      $('#infoPinjam').textContent = a ? a.nama + ' sedang meminjam ' + aktif().filter(function (p) { return p.anggotaId === a.id; }).length + ' dari maks. ' + D.atur.maksPinjam + ' koleksi.' : '';
    });
    $('#formPinjam').addEventListener('submit', function (e) {
      e.preventDefault();
      var a = cariDariLabel(D.anggota, $('#pinjamAnggota').value, labelAnggota), b = cariDariLabel(D.buku, $('#pinjamBuku').value, labelBuku);
      var err = catatPinjam(a && a.id, b && b.id, $('#pinjamTgl').value, $('#pinjamTempo').value);
      if (err) { $('#infoPinjam').textContent = err; toast(err); return; }
      toast('Pinjaman dicatat, jatuh tempo ' + tglPendek($('#pinjamTempo').value));
      $('#pinjamBuku').value = ''; $('#pinjamAnggota').value = ''; $('#infoPinjam').textContent = ''; tabPinjam = 'aktif'; renderSirkulasi();
    });
    $$('.tab-kecil button').forEach(function (b) { b.addEventListener('click', function () { tabPinjam = b.dataset.tab; renderDaftarPinjam(); }); });
    $('#cariPinjam').addEventListener('input', renderDaftarPinjam);
    $('#daftarPinjam').addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      var p = D.pinjam.find(function (x) { return x.id === (t.dataset.kembali || t.dataset.panjang || t.dataset.lunas); }); if (!p) return;
      if (t.dataset.kembali) dialogKembali(p);
      else if (t.dataset.panjang) { if (p.jatuhTempo < hariIni()) { toast('Sudah terlambat: kembalikan dulu, lalu pinjam ulang'); return; } p.jatuhTempo = tambahHari(p.jatuhTempo, +D.atur.lamaPinjam || 7); simpan(); renderDaftarPinjam(); toast('Diperpanjang sampai ' + tglPendek(p.jatuhTempo)); }
      else if (t.dataset.lunas) { p.lunas = true; simpan(); renderDaftarPinjam(); toast('Denda ditandai lunas'); }
    });
    $('#btnEksporPinjam').addEventListener('click', eksporPinjamCSV);
    // anggota
    $('#cariAnggota').addEventListener('input', renderAnggota);
    $('#btnTambahAnggota').addEventListener('click', function () { formAnggota(null); });
    $('#daftarAnggota').addEventListener('click', function (e) { var t = e.target.closest('[data-edit-agt]'); if (t) formAnggota(anggotaDari(t.dataset.editAgt)); });
    // laporan
    $('#periodeLaporan').addEventListener('change', renderLaporan);
    $('#btnCetakLaporan').addEventListener('click', function () { window.print(); });
    // atur
    $('#aturDenda').addEventListener('change', function () { $('#medanDenda').hidden = !this.checked; });
    $('#formAtur').addEventListener('submit', function (e) {
      e.preventDefault(); var nm = $('#aturNama').value.trim();
      if (nm !== D.nama) { D.nama = nm; D.namaDariTema = false; }
      D.atur.lamaPinjam = Math.max(1, +$('#aturLama').value || 7); D.atur.maksPinjam = Math.max(1, +$('#aturMaks').value || 3);
      D.atur.dendaAktif = $('#aturDenda').checked; D.atur.dendaPerHari = Math.max(0, +$('#aturDendaHari').value || 0);
      simpan(); tulisNama(); toast('Pengaturan disimpan');
    });
    $('#formPin').addEventListener('submit', function (e) {
      e.preventDefault(); var v = $('#pinBaru').value;
      if (!/^\d{4}$/.test(v)) { toast('PIN harus 4 angka'); return; }
      D.pin = v; simpan(); $('#pinBaru').value = ''; toast('PIN admin diganti');
    });
    $('#btnKatalogPublik').addEventListener('click', eksporPublik);
    $('#btnBackup').addEventListener('click', function () { unduh('backup-perpustakaan-' + hariIni() + '.json', JSON.stringify(D), 'application/json'); toast('Backup diunduh'); });
    $('#btnPulihkan').addEventListener('click', function () { $('#berkasJSON').click(); });
    $('#berkasJSON').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return; var rd = new FileReader();
      rd.onload = function () {
        try { var x = JSON.parse(rd.result); if (!x || !Array.isArray(x.buku)) throw 0;
          if (!confirm('Ganti semua data di perangkat ini dengan backup (' + x.buku.length + ' koleksi)?')) return;
          localStorage.setItem(KUNCI, JSON.stringify(x)); muat(); tulisNama(); buka(halAktif); toast('Data dipulihkan');
        } catch (er) { toast('Berkas bukan backup perpustakaan yang valid'); }
        e.target.value = '';
      };
      rd.readAsText(f);
    });
    $('#btnHapusSemua').addEventListener('click', function () {
      if (!confirm('Kosongkan SEMUA koleksi, anggota, dan riwayat? Unduh backup dulu. Tindakan ini tidak bisa dibatalkan.')) return;
      var pin = D.pin; D = dataKosong(); D.pin = pin; simpan(); tulisNama(); buka('beranda'); toast('Data dikosongkan');
    });
  }

  // ---------- Mulai ----------
  muat(); tulisNama(); ikatEvent(); tandaiBagian(); hitungTeksBagian();
  var terbuka = false; try { terbuka = sessionStorage.getItem(KUNCI + '-buka') === '1'; } catch (e) {}
  if (DEMO || terbuka) masuk(); else tampilPin();
  if (DEMO) document.documentElement.classList.add('demo');
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(function () {});

  // kait untuk pengujian
  window.__perpus = { data: function () { return D; }, catatPinjam: catatPinjam, kembalikan: kembalikan, imporCSV: imporCSV, parseCSV: parseCSV, laporan: laporan, barcode: barcode, dataPublik: dataPublik, tema: terapkanTema, tersedia: tersedia, buka: buka };
})();
