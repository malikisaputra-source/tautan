/* Katalog Toko WA — Maliki Studio (malikisaputra.biz.id). Lisensi MIT. */
(function (root) {
  'use strict';

  // ================= Logika murni (bisa diuji di Node) =================
  function rupiah(n, mu) { return (mu || 'Rp') + Math.round(n || 0).toLocaleString('id-ID'); }

  /** Harga satu produk sesuai pilihan varian ({Ukuran:'XL'}) */
  function hargaVarian(p, pilihan) {
    var h = p.harga;
    (p.varian || []).forEach(function (v) { var o = pilihan && pilihan[v.nama]; if (o && v.tambah && v.tambah[o]) h += v.tambah[o]; });
    return h;
  }

  function hitungTotal(items, ongkirKota, toko) {
    var subtotal = items.reduce(function (s, i) { return s + i.harga * i.qty; }, 0);
    var gratis = toko.gratisOngkirMin > 0 && subtotal >= toko.gratisOngkirMin;
    var ongkir = ongkirKota ? (gratis ? 0 : ongkirKota.biaya) : 0;
    return { subtotal: subtotal, ongkir: ongkir, gratis: gratis, total: subtotal + ongkir, tanya: !!(ongkirKota && ongkirKota.tanya && !gratis) };
  }

  function buatPesan(items, pembeli, ongkirKota, toko) {
    var t = hitungTotal(items, ongkirKota, toko), mu = toko.mataUang;
    var baris = ['Halo *' + toko.nama + '*, saya mau pesan:', ''];
    items.forEach(function (i, n) {
      baris.push((n + 1) + '. *' + i.nama + '*' + (i.label ? ' (' + i.label + ')' : ''));
      baris.push('   ' + i.qty + ' x ' + rupiah(i.harga, mu) + ' = ' + rupiah(i.qty * i.harga, mu));
    });
    baris.push('', 'Subtotal: ' + rupiah(t.subtotal, mu));
    if (ongkirKota) baris.push('Ongkir (' + ongkirKota.kota + '): ' + (t.gratis ? 'GRATIS' : t.tanya ? 'mohon dicek' : rupiah(t.ongkir, mu)));
    baris.push('*Total: ' + rupiah(t.total, mu) + (t.tanya ? ' + ongkir' : '') + '*', '');
    baris.push('Nama: ' + (pembeli.nama || '-'));
    if (pembeli.alamat) baris.push('Alamat: ' + pembeli.alamat);
    if (pembeli.catatan) baris.push('Catatan: ' + pembeli.catatan);
    baris.push('', 'Terima kasih!');
    return baris.join('\n');
  }

  function linkWA(nomor, pesan) { return 'https://wa.me/' + String(nomor).replace(/\D/g, '') + '?text=' + encodeURIComponent(pesan); }

  function parseCSV(teks) {
    var rows = [], row = [], sel = '', q = false;
    for (var i = 0; i < teks.length; i++) {
      var c = teks[i];
      if (q) { if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; } else if (c === '"') q = false; else sel += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(sel); sel = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && teks[i + 1] === '\n') i++; row.push(sel); rows.push(row); row = []; sel = ''; }
      else sel += c;
    }
    if (sel || row.length) { row.push(sel); rows.push(row); }
    return rows.filter(function (r) { return r.join('').trim(); });
  }

  /** Ubah CSV Google Sheet menjadi array produk. */
  function produkDariCSV(teks) {
    var rows = parseCSV(teks.replace(/^﻿/, '')); if (!rows.length) return [];
    var kepala = rows.shift().map(function (h) { return h.trim(); });
    var warna = ['#7a4b2a', '#3f5b45', '#2f5d7c', '#262626', '#d8c3a0']; // warna ilustrasi produk (bukan warna brand)
    return rows.map(function (r, n) {
      var o = {}; kepala.forEach(function (h, i) { o[h] = (r[i] || '').trim(); });
      return {
        id: o.id || 'p' + n, nama: o.nama, kategori: o.kategori || 'Lainnya', harga: +o.harga || 0, hargaCoret: +o.hargaCoret || 0,
        deskripsi: o.deskripsi || '', label: o.label || '', stok: o.stok === '' ? 99 : +o.stok,
        varian: (o.varian || '').split(';').filter(Boolean).map(function (s) { var a = s.split(':'); return { nama: a[0].trim(), opsi: (a[1] || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean) }; }),
        gambar: o.gambar ? o.gambar.split('|') : [{ bentuk: 'tote', warna: warna[n % warna.length], aksen: '#f2e8d5' }]
      };
    }).filter(function (p) { return p.nama; });
  }

  // ================= Ilustrasi SVG buatan sendiri =================
  function ilustrasi(g, sudut) {
    var w = g.warna || '#b4532a', a = g.aksen || '#f2e8d5', s = '';
    var bentuk = {
      kaos: '<path d="M70 62l28-16h24c2 10 12 16 18 16s16-6 18-16h24l28 16 18 40-30 12-10-16v108H92V98l-10 16-30-12z" fill="' + w + '"/><path d="M122 46c2 10 12 16 18 16s16-6 18-16" stroke="' + a + '" stroke-width="5" fill="none"/><rect x="118" y="112" width="44" height="30" rx="4" fill="' + a + '" opacity=".9"/>',
      tote: '<path d="M106 92c0-34 68-34 68 0" stroke="' + a + '" stroke-width="9" fill="none"/><path d="M76 92h128l-8 128H84z" fill="' + w + '"/><circle cx="140" cy="152" r="22" fill="none" stroke="' + a + '" stroke-width="5"/><path d="M128 152h24" stroke="' + a + '" stroke-width="5"/>',
      mug: '<path d="M184 110h14a22 22 0 0 1 0 44h-14" stroke="' + w + '" stroke-width="12" fill="none"/><rect x="88" y="86" width="100" height="120" rx="14" fill="' + w + '"/><ellipse cx="138" cy="90" rx="50" ry="8" fill="' + a + '" opacity=".5"/><path d="M88 150h100" stroke="' + a + '" stroke-width="4" opacity=".6"/>',
      topi: '<path d="M78 160c0-50 26-76 62-76s62 26 62 76z" fill="' + w + '"/><path d="M140 84v76M108 94c8 20 10 44 10 66M172 94c-8 20-10 44-10 66" stroke="' + a + '" stroke-width="3" opacity=".5"/><path d="M66 160h150c14 0 14 18 0 18H90c-18 0-30-8-24-18z" fill="' + w + '" stroke="' + a + '" stroke-width="3"/><circle cx="140" cy="84" r="6" fill="' + a + '"/>',
      botol: '<rect x="118" y="52" width="44" height="26" rx="6" fill="' + a + '"/><path d="M112 80h56l8 18v118a12 12 0 0 1-12 12h-48a12 12 0 0 1-12-12V98z" fill="' + w + '"/><rect x="104" y="128" width="72" height="44" fill="' + a + '" opacity=".85"/>',
      buku: '<rect x="86" y="62" width="112" height="152" rx="6" fill="' + w + '"/><rect x="86" y="62" width="14" height="152" fill="#000" opacity=".15"/><rect x="118" y="96" width="60" height="28" rx="3" fill="' + a + '"/><path d="M190 62v170l-8-8-8 8V62" fill="' + a + '" opacity=".9"/>',
      lilin: '<path d="M140 60c10 14 12 24 0 34-12-10-10-20 0-34z" fill="#f59e0b"/><path d="M140 94v14" stroke="#222" stroke-width="3"/><rect x="92" y="108" width="96" height="110" rx="14" fill="' + w + '"/><rect x="92" y="148" width="96" height="36" fill="' + a + '" opacity=".85"/>',
      tas: '<path d="M96 70l44 70 44-70" stroke="' + a + '" stroke-width="6" fill="none"/><rect x="88" y="120" width="104" height="96" rx="20" fill="' + w + '"/><path d="M88 156h104" stroke="' + a + '" stroke-width="3" opacity=".6"/><rect x="128" y="148" width="24" height="16" rx="3" fill="' + a + '"/>',
      tatakan: '<ellipse cx="140" cy="150" rx="70" ry="70" fill="' + w + '"/><g fill="none" stroke="' + a + '" stroke-width="4" opacity=".7"><circle cx="140" cy="150" r="54"/><circle cx="140" cy="150" r="38"/><circle cx="140" cy="150" r="22"/></g>'
    }[g.bentuk] || '';
    s += '<rect width="280" height="280" fill="' + (sudut % 2 ? '#e9dfcb' : '#f1e9d8') + '"/>';
    s += '<circle cx="' + (sudut % 2 ? 220 : 60) + '" cy="60" r="90" fill="' + w + '" opacity=".08"/>';
    s += '<ellipse cx="140" cy="236" rx="78" ry="10" fill="#000" opacity=".08"/>';
    s += '<g transform="rotate(' + (sudut ? (sudut % 2 ? -8 : 6) : 0) + ' 140 150)">' + bentuk + '</g>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">' + s + '</svg>');
  }
  function srcGambar(g, i) { return typeof g === 'string' ? g : ilustrasi(g, i || 0); }

  var API = { rupiah: rupiah, hargaVarian: hargaVarian, hitungTotal: hitungTotal, buatPesan: buatPesan, linkWA: linkWA, parseCSV: parseCSV, produkDariCSV: produkDariCSV, ilustrasi: ilustrasi };
  if (typeof module !== 'undefined' && module.exports) { module.exports = API; return; }
  root.__katalog = API;

  // ================= Aplikasi browser =================
  var TOKO = root.TOKO, PRODUK = root.PRODUK || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rp(n) { return rupiah(n, TOKO.mataUang); }
  var simpanan = { get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var tt; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('tampil'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('tampil'); }, 2000); }

  var keranjang = simpanan.get('katalog-keranjang', []);
  var katAktif = 'Semua';

  function cari(id) { return PRODUK.find(function (p) { return p.id === id; }); }

  function renderKategori() {
    var kats = ['Semua'];
    PRODUK.forEach(function (p) { if (kats.indexOf(p.kategori) < 0) kats.push(p.kategori); });
    $('#kategori').innerHTML = kats.map(function (k) { return '<button class="kat' + (k === katAktif ? ' aktif' : '') + '" data-k="' + esc(k) + '">' + esc(k) + '</button>'; }).join('');
  }

  function renderGrid() {
    var q = $('#cari').value.trim().toLowerCase(), u = $('#urut').value;
    var list = PRODUK.filter(function (p) { return (katAktif === 'Semua' || p.kategori === katAktif) && (p.nama + ' ' + p.deskripsi + ' ' + p.kategori).toLowerCase().indexOf(q) > -1; });
    if (u === 'murah') list.sort(function (a, b) { return a.harga - b.harga; });
    if (u === 'mahal') list.sort(function (a, b) { return b.harga - a.harga; });
    if (u === 'nama') list.sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
    $('#grid').innerHTML = list.length ? list.map(function (p) {
      var habis = p.stok === 0;
      return '<button class="kartu" data-id="' + esc(p.id) + '"><div class="kartu-gambar"><img src="' + srcGambar(p.gambar[0]) + '" alt="' + esc(p.nama) + '" loading="lazy">' +
        (habis ? '<span class="label habis">Stok habis</span>' : p.label ? '<span class="label">' + esc(p.label) + '</span>' : '') + '</div>' +
        '<span class="kat-kecil">' + esc(p.kategori) + '</span><h3>' + esc(p.nama) + '</h3><span class="harga">' + rp(p.harga) + (p.hargaCoret ? ' <s>' + rp(p.hargaCoret) + '</s>' : '') + '</span></button>';
    }).join('') : '<p class="kosong">Produk tidak ditemukan. Coba kata lain.</p>';
  }

  // ---------- detail ----------
  function bukaDetail(p) {
    var pilihan = {}, qty = 1, aktifGbr = 0;
    (p.varian || []).forEach(function (v) { pilihan[v.nama] = v.opsi[0]; });
    function render() {
      var habis = p.stok === 0;
      $('#detailIsi').innerHTML = '<button class="ikon-btn tutup-modal" id="tutupDetail" aria-label="Tutup">✕</button><div class="detail">' +
        '<div class="galeri"><div class="galeri-utama"><img src="' + srcGambar(p.gambar[aktifGbr], aktifGbr) + '" alt="' + esc(p.nama) + '"></div>' +
        (p.gambar.length > 1 ? '<div class="galeri-kecil">' + p.gambar.map(function (g, i) { return '<button data-g="' + i + '" class="' + (i === aktifGbr ? 'aktif' : '') + '" aria-label="Gambar ' + (i + 1) + '"><img src="' + srcGambar(g, i) + '" alt=""></button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="info"><span class="kat-kecil redup">' + esc(p.kategori) + '</span><h2>' + esc(p.nama) + '</h2>' +
        '<span class="harga">' + rp(hargaVarian(p, pilihan)) + (p.hargaCoret ? ' <s>' + rp(p.hargaCoret) + '</s>' : '') + '</span><p>' + esc(p.deskripsi) + '</p>' +
        (p.varian || []).map(function (v) {
          return '<div class="varian"><b>' + esc(v.nama) + '</b><div class="opsi">' + v.opsi.map(function (o) { return '<button data-v="' + esc(v.nama) + '" data-o="' + esc(o) + '" class="' + (pilihan[v.nama] === o ? 'aktif' : '') + '">' + esc(o) + (v.tambah && v.tambah[o] ? ' +' + (v.tambah[o] / 1000) + 'rb' : '') + '</button>'; }).join('') + '</div></div>';
        }).join('') +
        '<span class="stok-info">' + (habis ? 'Stok sedang habis, tanya admin untuk pre-order.' : p.stok <= 10 ? 'Sisa ' + p.stok + ' — jangan sampai kehabisan.' : 'Stok tersedia') + '</span>' +
        '<div class="beli"><div class="jumlah"><button data-q="-1" aria-label="Kurangi">−</button><span>' + qty + '</span><button data-q="1" aria-label="Tambah">+</button></div>' +
        '<button class="tombol" id="btnTambah"' + (habis ? ' disabled' : '') + '>Tambah ke keranjang</button></div></div></div>';
    }
    render();
    var d = $('#detail'); if (!d.open) d.showModal();
    $('#detailIsi').onclick = function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.id === 'tutupDetail') return d.close();
      if (t.dataset.g) { aktifGbr = +t.dataset.g; render(); }
      else if (t.dataset.v) {
        pilihan[t.dataset.v] = t.dataset.o;
        var idx = -1; (p.varian || []).forEach(function (v) { if (v.nama === 'Warna') idx = v.opsi.indexOf(pilihan.Warna); });
        if (t.dataset.v === 'Warna' && idx > -1 && p.gambar[idx]) aktifGbr = idx;
        render();
      }
      else if (t.dataset.q) { qty = Math.max(1, Math.min(p.stok || 99, qty + +t.dataset.q)); render(); }
      else if (t.id === 'btnTambah') { tambah(p, pilihan, qty); d.close(); }
    };
  }
  $('#detail').addEventListener('click', function (e) { if (e.target === this) this.close(); });

  // ---------- keranjang ----------
  function labelPilihan(pil) { return Object.keys(pil || {}).map(function (k) { return pil[k]; }).join(', '); }
  function tambah(p, pilihan, qty) {
    var kunci = p.id + '|' + JSON.stringify(pilihan);
    var ada = keranjang.find(function (i) { return i.kunci === kunci; });
    if (ada) ada.qty += qty;
    else keranjang.push({ kunci: kunci, id: p.id, nama: p.nama, label: labelPilihan(pilihan), harga: hargaVarian(p, pilihan), qty: qty, gIdx: 0 });
    simpan(); toast(p.nama + ' masuk keranjang');
    var h = $('#hitungKeranjang'); h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop');
  }
  function simpan() { simpanan.set('katalog-keranjang', keranjang); renderKeranjang(); }
  function kotaTerpilih() { var i = $('#pilihKota').value; return i === '' ? null : TOKO.ongkir[+i]; }

  function renderKeranjang() {
    var n = keranjang.reduce(function (s, i) { return s + i.qty; }, 0);
    $('#hitungKeranjang').hidden = !n; $('#hitungKeranjang').textContent = n;
    $('#laciIsi').innerHTML = keranjang.length ? keranjang.map(function (i, k) {
      var p = cari(i.id), g = p ? p.gambar[0] : { bentuk: 'tote' };
      return '<div class="item"><img src="' + srcGambar(g) + '" alt=""><div><b>' + esc(i.nama) + '</b><small>' + esc(i.label || '') + (i.label ? ' · ' : '') + rp(i.harga) + '</small><br><button class="hapus" data-hapus="' + k + '">Hapus</button></div>' +
        '<div class="jumlah"><button data-k="' + k + '" data-d="-1" aria-label="Kurangi">−</button><span>' + i.qty + '</span><button data-k="' + k + '" data-d="1" aria-label="Tambah">+</button></div></div>';
    }).join('') : '<div class="laci-kosong">Keranjang masih kosong.<br>Yuk pilih barang dulu.</div>';
    var t = hitungTotal(keranjang, kotaTerpilih(), TOKO);
    var sisa = TOKO.gratisOngkirMin - t.subtotal;
    $('#ringkas').innerHTML = '<div><span>Subtotal</span><span>' + rp(t.subtotal) + '</span></div>' +
      '<div><span>Ongkir</span><span>' + (!kotaTerpilih() ? 'pilih kota' : t.gratis ? 'GRATIS' : t.tanya ? 'dicek admin' : rp(t.ongkir)) + '</span></div>' +
      '<div class="total"><span>Total</span><span>' + rp(t.total) + '</span></div>' +
      (TOKO.gratisOngkirMin > 0 && sisa > 0 && keranjang.length ? '<div class="catatan">Tambah ' + rp(sisa) + ' lagi untuk gratis ongkir.</div>' : '');
    $('#btnWa').disabled = !keranjang.length;
  }

  function bukaLaci(buka) {
    $('#laci').classList.toggle('buka', buka); $('#laci').setAttribute('aria-hidden', String(!buka)); $('#tirai').hidden = !buka;
  }

  // ---------- mulai ----------
  function mulai() {
    document.title = TOKO.nama + ' — Katalog';
    $('#namaToko').textContent = TOKO.nama; $('#namaTokoKaki').textContent = TOKO.nama; $('#slogan').textContent = TOKO.slogan;
    $('.merek-ikon').textContent = TOKO.nama.charAt(0); $('#tahun').textContent = new Date().getFullYear();
    $('#pilihKota').innerHTML = '<option value="">— pilih —</option>' + TOKO.ongkir.map(function (o, i) { return '<option value="' + i + '">' + esc(o.kota) + (o.biaya ? ' (' + rp(o.biaya) + ')' : '') + '</option>'; }).join('');
    var pb = simpanan.get('katalog-pembeli', {}); var f = $('#formPesan');
    ['nama', 'alamat', 'catatan', 'kota'].forEach(function (k) { if (pb[k] != null) f.elements[k].value = pb[k]; });
    renderKategori(); renderGrid(); renderKeranjang();
    if (/[?&]keranjang\b/.test(location.search)) { if (!keranjang.length) { tambah(PRODUK[0], { Ukuran: 'M', Warna: 'Hitam' }, 2); tambah(PRODUK[2], { Warna: 'Terakota' }, 1); } bukaLaci(true); }
  }

  $('#kategori').onclick = function (e) { var b = e.target.closest('.kat'); if (b) { katAktif = b.dataset.k; renderKategori(); renderGrid(); } };
  $('#cari').oninput = renderGrid; $('#urut').onchange = renderGrid;
  $('#grid').onclick = function (e) { var k = e.target.closest('.kartu'); if (k) bukaDetail(cari(k.dataset.id)); };
  $('#btnKeranjang').onclick = function () { bukaLaci(true); };
  $('#tutupLaci').onclick = $('#tirai').onclick = function () { bukaLaci(false); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') bukaLaci(false); });
  $('#laciIsi').onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.hapus) keranjang.splice(+b.dataset.hapus, 1);
    else if (b.dataset.k) { var i = keranjang[+b.dataset.k]; i.qty += +b.dataset.d; if (i.qty < 1) keranjang.splice(+b.dataset.k, 1); }
    simpan();
  };
  $('#pilihKota').onchange = renderKeranjang;
  $('#formPesan').addEventListener('invalid', function () { $('#dataPembeli').open = true; }, true);
  $('#formPesan').onsubmit = function (e) {
    e.preventDefault(); var f = e.target;
    if (!keranjang.length) return;
    if (!f.elements.kota.value) { $('#dataPembeli').open = true; f.elements.kota.focus(); return toast('Pilih kota pengiriman dulu'); }
    var pb = { nama: f.elements.nama.value.trim(), alamat: f.elements.alamat.value.trim(), catatan: f.elements.catatan.value.trim(), kota: f.elements.kota.value };
    simpanan.set('katalog-pembeli', pb);
    window.open(linkWA(TOKO.wa, buatPesan(keranjang, pb, kotaTerpilih(), TOKO)), '_blank', 'noopener');
  };
  $('#btnTema').onclick = function () {
    var gelap = document.documentElement.getAttribute('data-mode') !== 'gelap';
    document.documentElement.setAttribute('data-mode', gelap ? 'gelap' : 'terang');
    try { localStorage.setItem('katalog-tema', gelap ? 'gelap' : 'terang'); } catch (er) {}
  };

  if (TOKO.sheetCSV) {
    fetch(TOKO.sheetCSV).then(function (r) { return r.text(); }).then(function (t) { var p = produkDariCSV(t); if (p.length) PRODUK = p; mulai(); })
      .catch(function () { toast('Gagal memuat Google Sheet, pakai data lokal'); mulai(); });
  } else mulai();
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
    if (t.mode) r.setAttribute('data-mode', t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode);
    if (t.bagian) terapkanBagian(t.bagian);
    setTimeout(hitungTeksBagian, 0);
    if (t.nama) {
      TOKO.nama = t.nama;
      Array.prototype.forEach.call(document.querySelectorAll('[data-tema-nama]'), function (e) { e.textContent = t.nama; });
      var ik = document.querySelector('.merek-ikon'); if (ik) ik.textContent = t.nama.charAt(0);
    }
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });
  // ---------- Bagian (customizer: warna per bagian, sorot, tap-untuk-pilih) ----------
  var PETA_BAGIAN = {
    nav: '.kepala',
    latar: 'main, .kaki',
    panel: '.kartu, .kartu-gambar, .modal, .laci, .saring input, .saring select, .ikon-btn',
    utama: '.tombol, .merek-ikon, .pembuka em, .kat.aktif',
    aksen: '.label, .hitung',
    teks: 'h1, h2, h3, .pembuka p, .harga'
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
  // warna teks otomatis (terang/gelap) dari luminansi warna latar sebenarnya
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
    return L > 0.4 ? '#14171a' : '#ffffff';
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
  tandaiBagian(); hitungTeksBagian();

})(typeof window !== 'undefined' ? window : this);
