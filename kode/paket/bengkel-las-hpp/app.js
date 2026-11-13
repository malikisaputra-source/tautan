/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Bengkel Las + HPP — HTML/CSS/JS murni, data di localStorage. Peta kode: lihat AGENTS.md */
(function () {
  'use strict';
  var KUNCI = 'laship-data-v1';
  var DEMO = /[?&]demo\b/.test(location.search);
  var kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ---------- Logo & foto (SATU tempat pengaturan gambar) ----------
  // Logo bengkel (sidebar + kepala RAB) diunggah di Pengaturan; foto hasil kerja diunggah per order (Detail order).
  // Semua diperkecil ke GAMBAR.maks px lalu disimpan sebagai dataURL di localStorage (ikut Cadangan JSON).
  var GAMBAR = { maks: 400, mutu: 0.75, fotoPerOrder: 4 };
  function kecilkan(file, png, cb) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var s = Math.min(1, GAMBAR.maks / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); cb(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', GAMBAR.mutu));
    };
    img.onerror = function () { URL.revokeObjectURL(url); toast('Gambar tidak bisa dibaca', true); };
    img.src = url;
  }
  function gambarAman(s) { return /^data:image\/(png|jpe?g|webp|gif);base64,/.test(s || ''); }
  function inisial(s) { return String(s || '?').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase() || '?'; }
  window.addEventListener('error', function (e) { // logo gagal dimuat → inisial nama bengkel
    var t = e.target; if (t && t.tagName === 'IMG' && t.dataset.inisial) { var s = document.createElement('b'); s.className = 'ini'; s.textContent = t.dataset.inisial; t.replaceWith(s); }
  }, true);
  function logoHTML(cls) { var L = D && D.atur && D.atur.logo; return gambarAman(L) ? '<img class="' + (cls || '') + '" src="' + L + '" alt="" data-inisial="' + inisial(namaUsaha()).replace(/[^A-Z0-9?]/g, '') + '">' : ''; }
  function isiLogo() { var el = $('.merek .logo'); if (!el) return; var h = logoHTML(); el.classList.toggle('pakai-foto', !!h); el.innerHTML = h || '<svg viewBox="0 0 24 24"><use href="#i-percik"/></svg>'; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ikon(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function rp(n) { return 'Rp ' + Math.round(n || 0).toLocaleString('id-ID'); }
  function rpPendek(n) { n = n || 0; if (Math.abs(n) >= 1e9) return 'Rp ' + (n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' M'; if (Math.abs(n) >= 1e6) return 'Rp ' + (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt'; return rp(n); }
  function ang(n, d) { return (+n || 0).toLocaleString('id-ID', { maximumFractionDigits: d == null ? 2 : d }); }
  function num(v) { var x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : 0; }
  function bulat1000(n) { return Math.ceil(n / 1000) * 1000; }
  function id() { return Math.random().toString(36).slice(2, 9); }
  function hariIni() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function tglIndo(s) { if (!s) return '-'; var p = s.split('-'); return +p[2] + ' ' + BLN[+p[1] - 1] + ' ' + p[0]; }

  var STATUS = [
    { k: 'survei', n: 'Survei' }, { k: 'produksi', n: 'Produksi' }, { k: 'pasang', n: 'Pasang' }, { k: 'lunas', n: 'Lunas' }
  ];
  var JENIS = ['Pagar', 'Kanopi', 'Teralis', 'Tangga', 'Rak', 'Lainnya'];
  var SATUAN = ['batang', 'kg', 'meter', 'm²', 'lembar', 'kaleng', 'liter', 'pcs', 'dus'];
  var KAT = ['Hollow', 'Siku', 'Plat', 'Pipa', 'Atap', 'Cat', 'Las', 'Baut', 'Aksesoris'];

  /* ---------- Data contoh (Indonesia, fiktif) ---------- */
  function contoh() {
    var b = [
      ['h44', 'Hollow 40×40 tebal 1,2 mm', 'Hollow', 'batang', 98000, 6],
      ['h24', 'Hollow 20×40 tebal 1,0 mm', 'Hollow', 'batang', 62000, 6],
      ['h22', 'Hollow 20×20 tebal 0,8 mm', 'Hollow', 'batang', 38000, 6],
      ['h48', 'Hollow 40×80 tebal 1,6 mm', 'Hollow', 'batang', 178000, 6],
      ['siku', 'Besi siku 40×40×4 mm', 'Siku', 'batang', 168000, 6],
      ['plat', 'Plat strip/bordes 2 mm', 'Plat', 'kg', 18500, 0],
      ['pipa', 'Pipa galvanis 1¼ inci', 'Pipa', 'batang', 212000, 6],
      ['atap', 'Atap spandek pasir 0,3 mm', 'Atap', 'm²', 72000, 0],
      ['cat', 'Cat besi anti karat 1 kg', 'Cat', 'kaleng', 78000, 0],
      ['thin', 'Thinner A 1 liter', 'Cat', 'liter', 32000, 0],
      ['kawat', 'Kawat las RB 2,6 mm', 'Las', 'kg', 42000, 0],
      ['baut', 'Baut dynabolt 10 mm', 'Baut', 'pcs', 4500, 0],
      ['batu', 'Batu gerinda potong 4 inci', 'Aksesoris', 'pcs', 6500, 0],
      ['engsel', 'Engsel pintu pagar', 'Aksesoris', 'pcs', 35000, 0]
    ].map(function (x) { return { id: x[0], nama: x[1], kat: x[2], satuan: x[3], harga: x[4], panjang: x[5] }; });
    function o(no, tgl, pel, hp, almt, jenis, judul, p, t, st, item, tk, oh, margin, bayar, tglLunas) {
      return { id: id(), no: no, tgl: tgl, pelanggan: pel, hp: hp, alamat: almt, jenis: jenis, judul: judul, p: p, t: t, status: st,
        item: item.map(function (x) { return { b: x[0], q: x[1] }; }), tukang: { orang: tk[0], hari: tk[1], upah: tk[2] },
        oh: { listrik: oh[0], gas: oh[1], transport: oh[2], sewa: oh[3] }, margin: margin, dp: 50, bayar: bayar, tglLunas: tglLunas || '', catatan: '' };
    }
    var order = [
      o('LAS-2606-01', '2026-06-04', 'Bapak Hendra Wijaya', '081234500111', 'Jl. Melati 12, Bekasi', 'Pagar', 'Pagar depan minimalis', 6, 1.6, 'lunas', [['h44', 3], ['h24', 4], ['h22', 9], ['cat', 3], ['thin', 2], ['kawat', 3], ['baut', 16], ['batu', 6], ['engsel', 3]], [2, 4, 150000], [100000, 60000, 150000, 0], 30, 0, '2026-06-20'),
      o('LAS-2607-01', '2026-07-02', 'Ibu Ratna Sari', '081322200455', 'Perum Griya Asri B4, Depok', 'Kanopi', 'Kanopi carport 2 mobil', 6, 4, 'lunas', [['h48', 5], ['h44', 6], ['h24', 8], ['atap', 26], ['cat', 4], ['thin', 2], ['kawat', 4], ['baut', 24], ['batu', 6]], [3, 5, 150000], [150000, 80000, 200000, 150000], 28, 0, '2026-07-21'),
      o('LAS-2708-01', '2026-08-06', 'CV Sinar Logam', '082110003344', 'Kawasan Industri Jababeka', 'Rak', 'Rak gudang 4 susun (3 unit)', 2, 2.2, 'lunas', [['siku', 14], ['baut', 96], ['cat', 3], ['thin', 2], ['kawat', 1], ['batu', 4]], [2, 3, 150000], [60000, 30000, 250000, 0], 25, 0, '2026-08-22'),
      o('LAS-2609-01', '2026-09-03', 'Bapak Yusuf Hamdani', '085711002233', 'Jl. Kenanga 7, Tambun', 'Teralis', 'Teralis jendela 6 unit', 1.2, 1.4, 'lunas', [['h22', 12], ['h24', 6], ['cat', 2], ['thin', 1], ['kawat', 2], ['baut', 36], ['batu', 4]], [2, 2, 150000], [50000, 40000, 100000, 0], 32, 0, '2026-09-14'),
      o('LAS-2609-02', '2026-09-18', 'Ibu Dewi Lestari', '081398887766', 'Cluster Anggrek 3, Cikarang', 'Tangga', 'Tangga besi bordes ke dak', 1, 3, 'lunas', [['h48', 4], ['siku', 3], ['plat', 42], ['cat', 2], ['thin', 1], ['kawat', 3], ['baut', 12], ['batu', 5]], [2, 4, 160000], [90000, 60000, 150000, 100000], 30, 0, '2026-10-06'),
      o('LAS-2610-01', '2026-10-08', 'Bapak Agus Prasetyo', '081277665544', 'Jl. Flamboyan 21, Bekasi', 'Pagar', 'Pagar + pintu geser', 8, 1.8, 'lunas', [['h44', 5], ['h24', 6], ['h22', 14], ['pipa', 1], ['cat', 4], ['thin', 2], ['kawat', 4], ['baut', 20], ['batu', 8], ['engsel', 0]], [3, 5, 150000], [120000, 80000, 200000, 0], 30, 0, '2026-10-28'),
      o('LAS-2611-01', '2026-11-01', 'Ibu Fitri Handayani', '081244556677', 'Jl. Cempaka 3, Cibitung', 'Kanopi', 'Kanopi teras depan', 5, 2.5, 'pasang', [['h48', 3], ['h44', 4], ['h24', 5], ['atap', 14], ['cat', 3], ['thin', 1], ['kawat', 3], ['baut', 16], ['batu', 4]], [2, 4, 150000], [100000, 60000, 150000, 0], 30, 2000000),
      o('LAS-2611-02', '2026-11-03', 'Bapak Rudi Santoso', '085600112233', 'Perum Villa Mutiara C9', 'Pagar', 'Pagar tralis rumah sudut', 10, 1.5, 'produksi', [['h44', 6], ['h24', 7], ['h22', 15], ['cat', 5], ['thin', 2], ['kawat', 5], ['baut', 24], ['batu', 8], ['engsel', 3]], [3, 6, 150000], [150000, 90000, 200000, 0], 30, 4500000),
      o('LAS-2611-03', '2026-11-05', 'Toko Berkah Jaya', '081388990011', 'Pasar Baru Bekasi Blok A', 'Rak', 'Rak display toko 5 susun', 1.5, 2, 'produksi', [['siku', 8], ['baut', 60], ['cat', 2], ['thin', 1], ['kawat', 1], ['batu', 3]], [1, 3, 150000], [40000, 20000, 100000, 0], 28, 1200000),
      o('LAS-2611-04', '2026-11-07', 'Ibu Sri Wahyuni', '081211223344', 'Jl. Dahlia 5, Tambun Selatan', 'Teralis', 'Teralis pintu & 4 jendela', 1.1, 1.6, 'survei', [['h22', 10], ['h24', 5], ['cat', 2], ['thin', 1], ['kawat', 2], ['baut', 30], ['batu', 3]], [2, 2, 150000], [40000, 30000, 100000, 0], 30, 0),
      o('LAS-2611-05', '2026-11-08', 'Bapak Taufik Rahman', '087788990022', 'Jl. Mawar 18, Setu', 'Kanopi', 'Kanopi samping + talang', 4, 2, 'survei', [['h48', 2], ['h44', 3], ['h24', 4], ['atap', 9], ['cat', 2], ['thin', 1], ['kawat', 2], ['baut', 12], ['batu', 3]], [2, 3, 150000], [60000, 40000, 150000, 0], 30, 0)
    ];
    return {
      versi: 1, bahan: b, order: order,
      atur: { logo: '', alamat: 'Jl. Raya Industri No. 45, Bekasi', hp: '081200001234', upah: 150000, margin: 30, dp: 50, kerf: 3, dayaCat: 6, kawatM2: 0.25, listrikHari: 25000, transport: 150000, berlaku: 14 }
    };
  }
  function migrasi(d) {
    var c = contoh();
    if (!d || typeof d !== 'object') return c;
    d.versi = 1; d.bahan = Array.isArray(d.bahan) ? d.bahan : []; d.order = Array.isArray(d.order) ? d.order : [];
    d.atur = Object.assign({}, c.atur, d.atur || {});
    d.order.forEach(function (o) { o.item = o.item || []; o.tukang = o.tukang || { orang: 1, hari: 1, upah: d.atur.upah }; o.oh = Object.assign({ listrik: 0, gas: 0, transport: 0, sewa: 0 }, o.oh || {}); if (o.margin == null) o.margin = d.atur.margin; if (o.dp == null) o.dp = d.atur.dp; o.bayar = +o.bayar || 0; o.foto = Array.isArray(o.foto) ? o.foto.filter(gambarAman) : []; });
    return d;
  }
  var D;
  function muat() {
    if (DEMO) { D = contoh(); return; }
    try { var s = localStorage.getItem(KUNCI); D = s ? migrasi(JSON.parse(s)) : contoh(); } catch (e) { D = contoh(); }
    simpan(true);
  }
  function simpan(diam) {
    if (DEMO) return;
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { if (!diam) toast('Gagal menyimpan: penyimpanan browser penuh/diblokir', true); }
  }
  function bahanById(i) { return D.bahan.filter(function (b) { return b.id === i; })[0]; }

  /* ---------- Hitung HPP ---------- */
  function hitung(o) {
    var bahan = 0; (o.item || []).forEach(function (x) { var b = bahanById(x.b); if (b) bahan += b.harga * num(x.q); });
    var tk = o.tukang || {}; var tenaga = num(tk.orang) * num(tk.hari) * num(tk.upah);
    var oh = o.oh || {}; var overhead = num(oh.listrik) + num(oh.gas) + num(oh.transport) + num(oh.sewa);
    var hpp = bahan + tenaga + overhead;
    var luas = num(o.p) * num(o.t);
    var jual = bulat1000(hpp * (1 + num(o.margin) / 100));
    var dpNom = bulat1000(jual * num(o.dp) / 100);
    return { bahan: bahan, tenaga: tenaga, overhead: overhead, hpp: hpp, luas: luas, perM2: luas ? hpp / luas : 0, jualM2: luas ? jual / luas : 0, jual: jual, laba: jual - hpp, persenLaba: jual ? (jual - hpp) / jual * 100 : 0, dp: dpNom, sisa: Math.max(0, jual - num(o.bayar)) };
  }

  /* ---------- Kalkulator bahan + optimasi potong ---------- */
  // Potong batang: First-Fit Decreasing. Potongan > panjang batang disambung (sambungan las).
  function potongBatang(potongan, panjang, kerfMm) {
    var k = (kerfMm || 0) / 1000, bar = [], sambung = 0, list = [];
    potongan.forEach(function (p) { var x = p; while (x > panjang + 1e-9) { list.push(panjang); x -= panjang; sambung++; } if (x > 0.001) list.push(x); });
    list.sort(function (a, b) { return b - a; });
    list.forEach(function (p) {
      for (var i = 0; i < bar.length; i++) { var sisa = panjang - bar[i].pakai; if (p <= sisa + 1e-9) { bar[i].ptg.push(p); bar[i].pakai += Math.min(sisa, p + k); return; } }
      bar.push({ ptg: [p], pakai: Math.min(panjang, p + k) });
    });
    var total = list.reduce(function (a, b) { return a + b; }, 0);
    return { batang: bar.length, bar: bar, total: total, sisa: bar.reduce(function (a, b) { return a + (panjang - b.pakai); }, 0), sambung: sambung, jml: list.length };
  }
  var KALK_DEF = {
    pagar: { n: 'Pagar', f: [['p', 'Panjang pagar (m)', 8], ['t', 'Tinggi (m)', 1.6], ['jt', 'Jarak tiang (m)', 2], ['jj', 'Jarak jeruji (cm)', 12], ['tanam', 'Tiang ditanam (m)', 0.3]], b: [['tiang', 'Tiang', 'h44'], ['rangka', 'Rangka horizontal', 'h24'], ['jeruji', 'Jeruji', 'h22']] },
    teralis: { n: 'Teralis', f: [['p', 'Lebar (m)', 1.2], ['t', 'Tinggi (m)', 1.4], ['jj', 'Jarak jeruji (cm)', 12], ['unit', 'Jumlah unit', 4]], b: [['rangka', 'Rangka keliling', 'h24'], ['jeruji', 'Jeruji', 'h22']] },
    kanopi: { n: 'Kanopi', f: [['p', 'Panjang (m)', 6], ['t', 'Tonjolan / lebar (m)', 3], ['tt', 'Tinggi tiang (m)', 2.8], ['jt', 'Jarak tiang (m)', 3], ['jr', 'Jarak usuk (m)', 1]], b: [['tiang', 'Tiang', 'h48'], ['balok', 'Balok depan-belakang', 'h44'], ['usuk', 'Usuk', 'h24'], ['atap', 'Atap (m²)', 'atap']] },
    tangga: { n: 'Tangga', f: [['p', 'Lebar tangga (m)', 1], ['t', 'Tinggi naik (m)', 3], ['optrede', 'Tinggi anak tangga (cm)', 18], ['antrede', 'Lebar injakan (cm)', 25]], b: [['ibu', 'Ibu tangga', 'h48'], ['anak', 'Rangka injakan', 'siku'], ['plat', 'Plat injakan (kg)', 'plat']] },
    rak: { n: 'Rak', f: [['p', 'Panjang (m)', 1.5], ['l', 'Kedalaman (m)', 0.5], ['t', 'Tinggi (m)', 2], ['susun', 'Jumlah susun', 4], ['unit', 'Jumlah unit', 1]], b: [['tiang', 'Tiang & rangka', 'siku']] }
  };
  var kalk = { jenis: 'pagar', v: {}, pilih: {}, orang: 2, hari: 4 };
  function nilaiKalk(k, def) { return kalk.v[k] != null ? kalk.v[k] : def; }
  function hitungKalk() {
    var def = KALK_DEF[kalk.jenis], v = {}, A = D.atur;
    def.f.forEach(function (f) { v[f[0]] = num(nilaiKalk(kalk.jenis + '.' + f[0], f[2])); });
    var pil = {}; def.b.forEach(function (b) { pil[b[0]] = kalk.pilih[kalk.jenis + '.' + b[0]] || b[2]; });
    var grup = {}, ekstra = [], luas = 0, info = [];
    function tambah(peran, panjang, jumlah) { var bid = pil[peran]; if (!grup[bid]) grup[bid] = { peran: [], ptg: [] }; if (grup[bid].peran.indexOf(peran) < 0) grup[bid].peran.push(peran); for (var i = 0; i < jumlah; i++) grup[bid].ptg.push(panjang); }
    function lain(bid, q, ket) { if (q > 0) ekstra.push({ b: bid, q: q, ket: ket }); }
    if (kalk.jenis === 'pagar') {
      var nT = Math.max(2, Math.ceil(v.p / Math.max(.5, v.jt)) + 1), seg = nT - 1, sl = v.p / seg, rel = v.t > 1.5 ? 3 : 2;
      var jPer = Math.max(0, Math.floor(sl * 100 / Math.max(5, v.jj)) - 1);
      tambah('tiang', v.t + v.tanam, nT); tambah('rangka', sl - 0.04, rel * seg); tambah('jeruji', v.t - 0.08 * rel / 2, jPer * seg);
      luas = v.p * v.t; info = [nT + ' tiang', seg + ' segmen × ' + ang(sl) + ' m', rel + ' rel horizontal', jPer * seg + ' jeruji'];
      lain('baut', nT * 4, 'dudukan tiang'); lain('engsel', 0, '');
    } else if (kalk.jenis === 'teralis') {
      var u = Math.max(1, Math.round(v.unit)), jj = Math.max(0, Math.floor(v.p * 100 / Math.max(5, v.jj)) - 1);
      tambah('rangka', v.p, 2 * u); tambah('rangka', v.t, 2 * u); tambah('jeruji', v.t - 0.04, jj * u);
      luas = v.p * v.t * u; info = [u + ' unit', jj + ' jeruji/unit'];
      lain('baut', 6 * u, 'angkur dinding');
    } else if (kalk.jenis === 'kanopi') {
      var nt = Math.max(2, Math.ceil(v.p / Math.max(1, v.jt)) + 1), nu = Math.ceil(v.p / Math.max(.3, v.jr)) + 1;
      tambah('tiang', v.tt + 0.1, nt); tambah('balok', v.p, 2); tambah('usuk', v.t, nu);
      luas = v.p * v.t; info = [nt + ' tiang', nu + ' usuk', 'atap +5% overlap'];
      lain(pil.atap, Math.ceil(luas * 1.05), 'atap'); lain('baut', nt * 4 + 8, 'dynabolt dinding & tiang');
    } else if (kalk.jenis === 'tangga') {
      var nA = Math.max(1, Math.ceil(v.t * 100 / Math.max(10, v.optrede))), dat = nA * v.antrede / 100, ibu = Math.sqrt(v.t * v.t + dat * dat);
      tambah('ibu', ibu, 2); tambah('anak', v.p, nA * 2); tambah('anak', v.antrede / 100, nA * 2);
      luas = v.p * ibu; info = [nA + ' anak tangga', 'ibu tangga ' + ang(ibu) + ' m', 'kemiringan ' + ang(Math.atan(v.t / Math.max(.1, dat)) * 180 / Math.PI, 0) + '°'];
      lain(pil.plat, Math.ceil(nA * v.p * v.antrede / 100 * 15.7), 'plat 2 mm ≈ 15,7 kg/m²'); lain('baut', 8, 'angkur');
    } else if (kalk.jenis === 'rak') {
      var ur = Math.max(1, Math.round(v.unit)), sus = Math.max(1, Math.round(v.susun));
      tambah('tiang', v.t, 4 * ur); tambah('tiang', v.p, 2 * sus * ur); tambah('tiang', v.l, 2 * sus * ur);
      luas = v.p * v.t * ur; info = [ur + ' unit × ' + sus + ' susun'];
      lain('baut', 8 * sus * ur, 'baut susun');
    }
    var baris = [], pot = [];
    Object.keys(grup).forEach(function (bid) {
      var b = bahanById(bid); if (!b) return;
      if (b.satuan === 'batang' && b.panjang > 0) {
        var r = potongBatang(grup[bid].ptg, b.panjang, A.kerf);
        baris.push({ b: bid, q: r.batang, ket: r.jml + ' potong · ' + ang(r.total) + ' m · sisa ' + ang(r.sisa) + ' m' + (r.sambung ? ' · ' + r.sambung + ' sambungan' : '') });
        pot.push({ b: b, r: r });
      } else {
        var tot = grup[bid].ptg.reduce(function (a, c) { return a + c; }, 0);
        baris.push({ b: bid, q: Math.ceil(tot * 10) / 10, ket: ang(tot) + ' ' + b.satuan });
      }
    });
    ekstra.forEach(function (e) { baris.push(e); });
    var luasCat = luas * 2;
    baris.push({ b: 'cat', q: Math.max(1, Math.ceil(luasCat / Math.max(1, A.dayaCat))), ket: 'bidang ' + ang(luasCat) + ' m² (2 sisi) ÷ ' + A.dayaCat + ' m²/kg' });
    baris.push({ b: 'thin', q: Math.max(1, Math.ceil(luasCat / Math.max(1, A.dayaCat) / 2)), ket: 'pengencer ± ½ cat' });
    baris.push({ b: 'kawat', q: Math.max(1, Math.ceil(luas * A.kawatM2)), ket: ang(A.kawatM2) + ' kg per m²' });
    baris.push({ b: 'batu', q: Math.max(2, Math.ceil(baris.reduce(function (a, x) { var bb = bahanById(x.b); return a + (bb && bb.satuan === 'batang' ? x.q : 0); }, 0) / 3)), ket: '± 1 batu per 3 batang' });
    baris = baris.filter(function (x) { return bahanById(x.b) && x.q > 0; });
    return { v: v, baris: baris, pot: pot, luas: luas, info: info };
  }

  /* ---------- Tema (kontrak customizer) ---------- */
  var FONT_URL = { 'Plus Jakarta Sans': 'Plus+Jakarta+Sans', 'Inter': 'Inter', 'Poppins': 'Poppins', 'DM Sans': 'DM+Sans', 'Space Grotesk': 'Space+Grotesk', 'Nunito': 'Nunito' };
  function setMode(m, simpanPilihan) {
    if (m === 'auto') m = matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang';
    if (m !== 'gelap') m = 'terang';
    halus(); document.documentElement.dataset.mode = m; teksAtas(); tombolMode();
    if (simpanPilihan) try { localStorage.setItem('laship-mode', m); } catch (e) {}
  }
  function halus() { if (kurangGerak || !document.body) return; document.body.classList.add('halus'); clearTimeout(halus.t); halus.t = setTimeout(function () { document.body.classList.remove('halus'); }, 400); }
  function namaUsaha() { return (window.TEMA && TEMA.nama) || 'Bengkel Las'; }
  function isiNama() { $$('[data-tema-nama]').forEach(function (el) { el.textContent = namaUsaha(); }); document.title = namaUsaha() + ' · HPP Bengkel Las'; }
  function terapkan(t) {
    var s = document.documentElement.style; halus();
    if (t.utama) s.setProperty('--tema-utama', t.utama);
    if (t.aksen) s.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) s.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var nama = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      s.setProperty('--tema-font', '"' + nama + '", system-ui, sans-serif');
      if (FONT_URL[nama]) { var l = $('#fontTema'), href = 'https://fonts.googleapis.com/css2?family=' + FONT_URL[nama] + ':wght@400;500;600;700&display=swap'; if (l.href !== href) l.href = href; }
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
  var bagianKustom = {};
  function teksAtas() {
    var cs = getComputedStyle(document.documentElement), s = document.documentElement.style;
    [['--tema-nav', '--tema-nav-teks'], ['--tema-utama', '--tema-utama-teks'], ['--tema-aksen', '--tema-aksen-teks']].forEach(function (x) {
      var nilai = (s.getPropertyValue(x[0]) || cs.getPropertyValue(x[0])).trim(), t = terangkah(nilai);
      if (x[0] === '--tema-nav' && document.documentElement.dataset.mode === 'gelap' && !bagianKustom.nav) t = false;
      if (t !== null) s.setProperty(x[1], t ? '#0f172a' : '#ffffff');
    });
  }
  var PETA_BAGIAN = { latar: '--latar', panel: '--permukaan', nav: '--nav', teks: '--teks' };
  function terapkanBagian(b) {
    var s = document.documentElement.style;
    Object.keys(PETA_BAGIAN).forEach(function (k) {
      if (!(k in b)) return;
      if (b[k]) { bagianKustom[k] = b[k]; s.setProperty('--tema-' + k, b[k]); s.setProperty(PETA_BAGIAN[k], b[k]); }
      else { delete bagianKustom[k]; s.removeProperty(PETA_BAGIAN[k]); }
    });
  }
  function sorot(bagian) {
    $$('.sorot-bagian').forEach(function (el) { el.classList.remove('sorot-bagian'); });
    if (bagian) $$('[data-bagian="' + bagian + '"]').forEach(function (el) { if (el.offsetParent || el === document.body) el.classList.add('sorot-bagian'); });
  }
  var modePilih = false, hoverEl = null;
  function bagianDari(t) { return t && t.closest ? t.closest('[data-bagian]') : null; }
  ['click', 'pointerdown', 'mousedown', 'touchstart', 'submit', 'change', 'input'].forEach(function (tipe) {
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
    setTimeout(function () { var f = $('#modalIsi input, #modalIsi select, #modalIsi button'); (f || $('[data-tutup]')).focus(); }, 30);
    return $('#modalIsi');
  }
  function tutupModal() {
    var m = $('#modal'); if (m.hidden) return;
    m.classList.add('keluar');
    setTimeout(function () { m.hidden = true; m.classList.remove('keluar'); if (fokusSebelum && fokusSebelum.focus) fokusSebelum.focus(); }, kurangGerak ? 0 : 190);
  }
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal' || e.target.closest('[data-tutup]')) tutupModal(); });
  document.addEventListener('keydown', function (e) {
    var m = $('#modal'); if (m.hidden) return;
    if (e.key === 'Escape') tutupModal();
    if (e.key === 'Tab') { var f = $$('button, input, select, textarea, a[href]', m).filter(function (x) { return !x.disabled && x.offsetParent; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  /* ---------- Navigasi ---------- */
  var MENU = [
    { k: 'dasbor', n: 'Dasbor', i: 'dasbor' }, { k: 'order', n: 'Order', i: 'order' }, { k: 'kalkulator', n: 'Kalkulator', i: 'kalk' },
    { k: 'bahan', n: 'Master bahan', p: 'Bahan', i: 'bahan' }, { k: 'laporan', n: 'Laporan', i: 'laporan' }, { k: 'pengaturan', n: 'Pengaturan', p: 'Atur', i: 'atur' }
  ];
  var halaman = 'dasbor';
  function bangunMenu() {
    $('#menu').innerHTML = MENU.map(function (m) { return '<button type="button" data-hal="' + m.k + '">' + ikon(m.i) + '<span>' + m.n + '</span></button>'; }).join('');
    $('#navBawah').innerHTML = MENU.filter(function (m) { return m.k !== 'pengaturan'; }).map(function (m) { return '<button type="button" data-hal="' + m.k + '">' + ikon(m.i) + '<span>' + (m.p || m.n) + '</span></button>'; }).join('') + '<button type="button" data-hal="pengaturan">' + ikon('atur') + '<span>Atur</span></button>';
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-hal]'); if (b) buka(b.dataset.hal); });
  function buka(h) {
    if (!RENDER[h]) h = 'dasbor'; halaman = h;
    $$('[data-hal]').forEach(function (b) { if (b.dataset.hal === h) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    var m = MENU.filter(function (x) { return x.k === h; })[0];
    $('#judulHalaman').textContent = m.n;
    $('#kepalaAksi').innerHTML = '';
    var isi = $('#isi'); isi.innerHTML = ''; isi.className = 'isi muncul';
    RENDER[h](isi);
    try { history.replaceState(null, '', location.pathname + location.search + '#' + h); } catch (e) {}
    window.scrollTo(0, 0);
  }
  function aksiKepala(html) { $('#kepalaAksi').innerHTML = html; }

  function pilStatus(s) { var st = STATUS.filter(function (x) { return x.k === s; })[0] || STATUS[0]; return '<span class="pil ' + st.k + '">' + st.n + '</span>'; }
  function bulanKey(t) { return (t || '').slice(0, 7); }
  function bulanSkr() { return hariIni().slice(0, 7); }
  var WARNA = { bahan: 'var(--tema-utama)', tenaga: 'var(--tema-aksen)', overhead: '#94a3b8' };

  var RENDER = {};
  /* Dasbor */
  RENDER.dasbor = function (isi) {
    $('#kepalaSub').textContent = 'Ringkasan · ' + tglIndo(hariIni());
    aksiKepala('<button class="tombol aksen" type="button" data-aksi="order-baru">' + ikon('tambah') + 'Order baru</button>');
    var bln = bulanSkr(), lunasBln = D.order.filter(function (o) { return o.status === 'lunas' && bulanKey(o.tglLunas) === bln; });
    var bulanLalu = (function () { var d = new Date(); d.setMonth(d.getMonth() - 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); })();
    var labaBln = D.order.filter(function (o) { return o.status !== 'survei' && bulanKey(o.tgl) === bln; }).reduce(function (a, o) { return a + hitung(o).laba; }, 0);
    var labaLalu = D.order.filter(function (o) { return o.status === 'lunas' && bulanKey(o.tglLunas) === bulanLalu; }).reduce(function (a, o) { return a + hitung(o).laba; }, 0);
    var aktif = D.order.filter(function (o) { return o.status !== 'lunas'; });
    var nilaiAktif = aktif.reduce(function (a, o) { return a + hitung(o).jual; }, 0);
    var piutang = aktif.filter(function (o) { return o.status !== 'survei'; }).reduce(function (a, o) { return a + hitung(o).sisa; }, 0);
    var sumHpp = D.order.reduce(function (a, o) { var h = hitung(o); a.bahan += h.bahan; a.tenaga += h.tenaga; a.overhead += h.overhead; return a; }, { bahan: 0, tenaga: 0, overhead: 0 });
    var tot = sumHpp.bahan + sumHpp.tenaga + sumHpp.overhead || 1;
    var perJenis = {}; D.order.forEach(function (o) { var h = hitung(o); if (!h.luas) return; var j = perJenis[o.jenis] = perJenis[o.jenis] || { n: 0, hpp: 0, jual: 0 }; j.n++; j.hpp += h.perM2; j.jual += h.jualM2; });
    isi.innerHTML =
      '<section class="grid-kpi">' +
        '<div class="kartu kpi gelap" data-bagian="nav"><p class="label-teknis">Laba kotor order bulan ini</p><span class="nilai angka">' + rp(labaBln) + '</span><span class="ket">Dari order ' + BLN[new Date().getMonth()] + ' yang sudah jalan · bulan lalu ' + rpPendek(labaLalu) + '</span></div>' +
        '<div class="kartu kpi" data-bagian="panel"><p class="label-teknis">Order aktif</p><span class="nilai angka" data-bagian="teks">' + aktif.length + '</span><span class="ket">' + STATUS.slice(0, 3).map(function (s) { return D.order.filter(function (o) { return o.status === s.k; }).length + ' ' + s.n.toLowerCase(); }).join(' · ') + '</span></div>' +
        '<div class="kartu kpi"><p class="label-teknis">Nilai pekerjaan berjalan</p><span class="nilai angka">' + rpPendek(nilaiAktif) + '</span><span class="ket">Harga jual order belum lunas</span></div>' +
        '<div class="kartu kpi"><p class="label-teknis">Sisa tagihan</p><span class="nilai angka" style="color:var(--aksen-teks)" data-bagian="aksen">' + rpPendek(piutang) + '</span><span class="ket">Produksi & pasang, setelah DP</span></div>' +
      '</section>' +
      '<section class="kartu" style="margin-bottom:18px"><div class="kartu-kepala"><h2>Papan pekerjaan</h2><button class="tombol garis kecil" type="button" data-hal="order">Semua order</button></div><div class="papan" id="papanDasbor"></div></section>' +
      '<section class="grid-2">' +
        '<div class="kartu"><div class="kartu-kepala"><h2>HPP rata-rata per m²</h2><span class="label-teknis">per jenis pekerjaan</span></div><div class="tabel-gulir"><table><thead><tr><th>Jenis</th><th class="kanan">Order</th><th class="kanan">HPP/m²</th><th class="kanan">Jual/m²</th></tr></thead><tbody>' +
          Object.keys(perJenis).map(function (k) { var j = perJenis[k]; return '<tr><td><b>' + esc(k) + '</b></td><td class="kanan angka">' + j.n + '</td><td class="kanan angka">' + rp(j.hpp / j.n) + '</td><td class="kanan angka"><b>' + rp(j.jual / j.n) + '</b></td></tr>'; }).join('') +
        '</tbody></table></div></div>' +
        '<div class="kartu"><div class="kartu-kepala"><h2>Komposisi HPP</h2><span class="label-teknis">semua order</span></div>' +
          '<div class="nilai angka" style="font-size:26px;font-weight:700">' + rpPendek(tot) + '</div>' +
          '<div class="batang-komposisi" data-bagian="aksen">' + ['bahan', 'tenaga', 'overhead'].map(function (k) { return '<i style="flex-grow:' + sumHpp[k] + ';background:' + WARNA[k] + '"></i>'; }).join('') + '</div>' +
          '<div class="legenda">' + ['bahan', 'tenaga', 'overhead'].map(function (k) { return '<span style="--w:' + WARNA[k] + '">' + k[0].toUpperCase() + k.slice(1) + ' ' + ang(sumHpp[k] / tot * 100, 0) + '%</span>'; }).join('') + '</div>' +
          '<p class="redup" style="font-size:13px;margin:14px 0 0">Bahan biasanya 55–70% dari HPP pekerjaan las. Kalau tenaga melonjak, cek lagi jumlah hari kerja di order.</p></div>' +
      '</section>';
    gambarPapan($('#papanDasbor'), D.order.slice().sort(function (a, b) { return b.tgl.localeCompare(a.tgl); }), 3);
  };
  function gambarPapan(el, daftar, batas) {
    el.innerHTML = STATUS.map(function (s) {
      var isiK = daftar.filter(function (o) { return o.status === s.k; });
      var tampil = batas ? isiK.slice(0, batas) : isiK;
      return '<div class="kolom"><div class="kolom-kepala">' + pilStatus(s.k) + '<span class="jml">' + isiK.length + '</span></div>' +
        (tampil.length ? tampil.map(kartuOrder).join('') : '<p class="redup" style="font-size:13px;padding:6px">Kosong</p>') +
        (batas && isiK.length > batas ? '<button class="tombol garis kecil" style="width:100%" type="button" data-hal="order">+' + (isiK.length - batas) + ' lagi</button>' : '') + '</div>';
    }).join('');
  }
  function kartuOrder(o) {
    var h = hitung(o), pr = h.jual ? Math.min(100, num(o.bayar) / h.jual * 100) : 0;
    if (o.status === 'lunas') pr = 100;
    return '<button type="button" class="kartu-order" data-st="' + o.status + '" data-buka="' + o.id + '" data-bagian="panel">' +
      '<span class="label-teknis">' + esc(o.no) + ' · ' + esc(o.jenis) + '</span><b>' + esc(o.judul) + '</b>' +
      '<span class="baris"><span>' + esc(o.pelanggan) + '</span><span>' + ang(o.p) + '×' + ang(o.t) + ' m</span></span>' +
      '<span class="baris"><span class="harga angka">' + rp(h.jual) + '</span><span>laba ' + ang(h.persenLaba, 0) + '%</span></span>' +
      '<span class="bilah" aria-label="Terbayar ' + ang(pr, 0) + '%"><i style="width:' + pr + '%"></i></span></button>';
  }

  /* Order */
  var filterOrder = { q: '', st: '' };
  RENDER.order = function (isi) {
    $('#kepalaSub').textContent = D.order.length + ' pekerjaan tercatat';
    aksiKepala('<button class="tombol garis" type="button" data-aksi="csv-order">' + ikon('unduh') + 'CSV</button><button class="tombol aksen" type="button" data-aksi="order-baru">' + ikon('tambah') + 'Order baru</button>');
    isi.innerHTML = '<div class="kartu" style="margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center"><label class="sr" for="cariOrder">Cari order</label><input id="cariOrder" class="cari" type="search" placeholder="Cari pelanggan / no / pekerjaan" value="' + esc(filterOrder.q) + '">' +
      '<label class="sr" for="fJenis">Jenis</label><select id="fJenis" style="max-width:180px"><option value="">Semua jenis</option>' + JENIS.map(function (j) { return '<option' + (filterOrder.st === j ? ' selected' : '') + '>' + j + '</option>'; }).join('') + '</select></div>' +
      '<div class="papan" id="papanOrder"></div>';
    function ulang() {
      var q = filterOrder.q.toLowerCase();
      var d = D.order.filter(function (o) { return (!filterOrder.st || o.jenis === filterOrder.st) && (!q || (o.pelanggan + ' ' + o.no + ' ' + o.judul).toLowerCase().indexOf(q) >= 0); }).sort(function (a, b) { return b.tgl.localeCompare(a.tgl); });
      if (!D.order.length) { $('#papanOrder').outerHTML = '<div class="kartu kosong" id="papanOrder">' + ikon('order') + '<p>Belum ada order. Mulai dari Kalkulator atau tombol Order baru.</p></div>'; return; }
      gambarPapan($('#papanOrder'), d);
    }
    $('#cariOrder').addEventListener('input', function (e) { filterOrder.q = e.target.value; ulang(); });
    $('#fJenis').addEventListener('change', function (e) { filterOrder.st = e.target.value; ulang(); });
    ulang();
  };
  function noBaru() { var d = new Date(), pre = 'LAS-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + '-'; var n = D.order.filter(function (o) { return o.no.indexOf(pre) === 0; }).length + 1; return pre + String(n).padStart(2, '0'); }
  function orderKosong() { var A = D.atur; return { id: id(), no: noBaru(), tgl: hariIni(), pelanggan: '', hp: '', alamat: '', jenis: 'Pagar', judul: '', p: 0, t: 0, status: 'survei', item: [], tukang: { orang: 2, hari: 3, upah: A.upah }, oh: { listrik: A.listrikHari * 3, gas: 0, transport: A.transport, sewa: 0 }, margin: A.margin, dp: A.dp, bayar: 0, tglLunas: '', catatan: '' }; }

  function detailOrder(oid) {
    var o = D.order.filter(function (x) { return x.id === oid; })[0]; if (!o) return;
    if (!Array.isArray(o.foto)) o.foto = [];
    var h = hitung(o), iSt = STATUS.map(function (s) { return s.k; }).indexOf(o.status), lanjut = STATUS[iSt + 1];
    var html = '<div class="grid-2" style="grid-template-columns:1.3fr 1fr;margin:0">' +
      '<div><p class="label-teknis">' + esc(o.no) + ' · ' + tglIndo(o.tgl) + '</p><h3 style="margin:4px 0 6px;font-size:20px">' + esc(o.judul) + '</h3>' +
        '<p style="margin:0 0 10px">' + pilStatus(o.status) + ' <span class="redup">' + esc(o.jenis) + ' · ' + ang(o.p) + ' × ' + ang(o.t) + ' m (' + ang(h.luas) + ' m²)</span></p>' +
        '<p style="margin:0"><b>' + esc(o.pelanggan) + '</b><br><span class="redup">' + esc(o.hp) + ' · ' + esc(o.alamat) + '</span></p>' +
        '<div class="tabel-gulir" style="margin-top:14px"><table><thead><tr><th>Bahan</th><th class="kanan">Qty</th><th class="kanan">Subtotal</th></tr></thead><tbody>' +
        o.item.filter(function (x) { return num(x.q) > 0; }).map(function (x) { var b = bahanById(x.b); return b ? '<tr><td>' + esc(b.nama) + '</td><td class="kanan angka">' + ang(x.q) + ' ' + b.satuan + '</td><td class="kanan angka">' + rp(b.harga * num(x.q)) + '</td></tr>' : ''; }).join('') +
        '<tr><td>Tukang ' + o.tukang.orang + ' org × ' + o.tukang.hari + ' hari × ' + rp(o.tukang.upah) + '</td><td></td><td class="kanan angka">' + rp(h.tenaga) + '</td></tr>' +
        '<tr><td>Overhead (listrik, gas, transport, sewa alat)</td><td></td><td class="kanan angka">' + rp(h.overhead) + '</td></tr>' +
        '</tbody></table></div></div>' +
      '<div>' + ringkasHpp(h, o) + '</div></div>' +
      '<div class="foto-order"><p class="label-teknis">Foto hasil kerja (' + o.foto.length + '/' + GAMBAR.fotoPerOrder + ')</p><div class="foto-order-daftar">' +
        o.foto.map(function (src, i) { return '<figure><img src="' + src + '" alt="Foto hasil kerja ' + esc(o.no) + ' ke-' + (i + 1) + '" loading="lazy"><button type="button" class="foto-hapus" data-aksi="hapus-foto" data-id="' + o.id + '" data-i="' + i + '" aria-label="Hapus foto ke-' + (i + 1) + '">' + ikon('hapus') + '</button></figure>'; }).join('') +
        (o.foto.length < GAMBAR.fotoPerOrder ? '<label class="foto-tambah">' + ikon('tambah') + '<span>Tambah foto</span><input type="file" accept="image/*" multiple data-foto-order="' + o.id + '"></label>' : '') + '</div></div>' +
      '<div class="aksi-form" style="margin-top:16px"><button class="tombol bahaya kecil kiri" type="button" data-aksi="hapus-order" data-id="' + o.id + '">' + ikon('hapus') + 'Hapus</button>' +
      '<button class="tombol garis kecil" type="button" data-aksi="wa-order" data-id="' + o.id + '">' + ikon('wa') + 'WA</button>' +
      '<button class="tombol garis kecil" type="button" data-aksi="bayar-order" data-id="' + o.id + '">Catat bayar</button>' +
      '<button class="tombol garis kecil" type="button" data-aksi="edit-order" data-id="' + o.id + '">' + ikon('edit') + 'Edit</button>' +
      '<button class="tombol garis kecil" type="button" data-aksi="rab" data-id="' + o.id + '">' + ikon('cetak') + 'RAB</button>' +
      (lanjut ? '<button class="tombol kecil" type="button" data-aksi="maju" data-id="' + o.id + '">Maju ke ' + lanjut.n + '</button>' : '') + '</div>';
    var root = bukaModal('Detail order', html), inp = root && $('[data-foto-order]', root);
    if (inp) inp.addEventListener('change', function () {
      var files = Array.prototype.slice.call(inp.files || []).filter(function (f) { return /^image\//.test(f.type); }).slice(0, GAMBAR.fotoPerOrder - o.foto.length), sisa = files.length;
      files.forEach(function (f) { kecilkan(f, false, function (d) { o.foto.push(d); if (!--sisa) { simpan(); toast('Foto hasil kerja disimpan'); detailOrder(o.id); } }); });
    });
  }
  function ringkasHpp(h, o) {
    var tot = h.hpp || 1;
    return '<div class="ringkas-hpp" data-bagian="nav"><p class="label-teknis redup" style="color:inherit;opacity:.7">HPP otomatis</p><div class="rincian">' +
      '<div><span class="redup">Bahan</span><span class="angka">' + rp(h.bahan) + '</span></div>' +
      '<div><span class="redup">Tenaga kerja</span><span class="angka">' + rp(h.tenaga) + '</span></div>' +
      '<div><span class="redup">Overhead</span><span class="angka">' + rp(h.overhead) + '</span></div>' +
      '<div class="garis-atas"><span>HPP</span><span class="angka">' + rp(h.hpp) + '</span></div>' +
      '<div><span class="redup">HPP per m²</span><span class="angka">' + (h.luas ? rp(h.perM2) : '-') + '</span></div>' +
      '<div><span class="redup">Untung ' + ang(o.margin) + '% (markup)</span><span class="angka">+' + rp(h.laba) + '</span></div>' +
      '<div class="garis-atas"><span>Harga jual</span><span class="angka besar sorot">' + rp(h.jual) + '</span></div>' +
      '<div><span class="redup">DP ' + ang(o.dp) + '%</span><span class="angka">' + rp(h.dp) + '</span></div>' +
      '<div><span class="redup">Sudah dibayar</span><span class="angka">' + rp(o.status === 'lunas' ? h.jual : o.bayar) + '</span></div>' +
      '</div><div class="batang-komposisi">' + ['bahan', 'tenaga', 'overhead'].map(function (k) { return '<i style="flex-grow:' + (h[k] / tot) + ';background:' + WARNA[k] + '"></i>'; }).join('') + '</div></div>';
  }

  function formOrder(o, baru) {
    o = JSON.parse(JSON.stringify(o));
    function opsiBahan(sel) { return D.bahan.map(function (b) { return '<option value="' + b.id + '"' + (b.id === sel ? ' selected' : '') + '>' + esc(b.nama) + ' (' + rp(b.harga) + '/' + b.satuan + ')</option>'; }).join(''); }
    function barisItem(x, i) { return '<div class="baris-item" data-i="' + i + '"><label class="sr" for="ib' + i + '">Bahan ' + (i + 1) + '</label><select id="ib' + i + '" data-f="b">' + opsiBahan(x.b) + '</select><label class="sr" for="iq' + i + '">Jumlah</label><input id="iq' + i + '" data-f="q" type="number" min="0" step="0.1" inputmode="decimal" value="' + x.q + '"><span class="sub angka"></span><button class="tombol-ikon" type="button" data-hapus-item aria-label="Hapus baris bahan">' + ikon('hapus') + '</button></div>'; }
    var f = function (k, label, val, tipe, ext) { return '<div class="medan' + (ext && ext.penuh ? ' penuh' : '') + '"><label for="f_' + k + '">' + label + '</label><input id="f_' + k + '" name="' + k + '" type="' + (tipe || 'text') + '" value="' + esc(val) + '"' + (tipe === 'number' ? ' step="any" min="0" inputmode="decimal"' : '') + (ext && ext.wajib ? ' required' : '') + '>' + (ext && ext.ket ? '<small>' + ext.ket + '</small>' : '') + '</div>'; };
    var html = '<form class="form" id="formOrder" novalidate>' +
      '<div class="form-grid">' + f('pelanggan', 'Nama pelanggan', o.pelanggan, 'text', { wajib: 1 }) + f('hp', 'No. HP / WA', o.hp, 'tel') + f('alamat', 'Alamat pemasangan', o.alamat, 'text', { penuh: 1 }) +
        '<div class="medan"><label for="f_jenis">Jenis pekerjaan</label><select id="f_jenis" name="jenis">' + JENIS.map(function (j) { return '<option' + (j === o.jenis ? ' selected' : '') + '>' + j + '</option>'; }).join('') + '</select></div>' +
        f('judul', 'Nama pekerjaan', o.judul, 'text', { wajib: 1 }) + '</div>' +
      '<div class="form-grid tiga">' + f('p', 'Panjang / lebar (m)', o.p, 'number') + f('t', 'Tinggi (m)', o.t, 'number') + f('tgl', 'Tanggal order', o.tgl, 'date') +
        '<div class="medan"><label for="f_status">Status</label><select id="f_status" name="status">' + STATUS.map(function (s) { return '<option value="' + s.k + '"' + (s.k === o.status ? ' selected' : '') + '>' + s.n + '</option>'; }).join('') + '</select></div>' + f('bayar', 'Sudah dibayar (Rp)', o.bayar, 'number') + f('tglLunas', 'Tanggal lunas', o.tglLunas, 'date') + '</div>' +
      '<div class="bagian-form"><h3>' + ikon('bahan') + 'Bahan</h3><div id="daftarItem">' + o.item.map(barisItem).join('') + '</div><button class="tombol garis kecil" type="button" id="tambahItem">' + ikon('tambah') + 'Tambah bahan</button></div>' +
      '<div class="bagian-form"><h3>Ongkos kerja</h3><div class="form-grid tiga">' + f('orang', 'Jumlah tukang', o.tukang.orang, 'number') + f('hari', 'Lama kerja (hari)', o.tukang.hari, 'number') + f('upah', 'Upah / orang / hari', o.tukang.upah, 'number') + '</div></div>' +
      '<div class="bagian-form"><h3>Overhead</h3><div class="form-grid">' + f('listrik', 'Listrik mesin las (Rp)', o.oh.listrik, 'number') + f('gas', 'Gas / oksigen / kawat tambahan (Rp)', o.oh.gas, 'number') + f('transport', 'Transport & angkut (Rp)', o.oh.transport, 'number') + f('sewa', 'Sewa alat / steger (Rp)', o.oh.sewa, 'number') + '</div></div>' +
      '<div class="bagian-form"><div class="form-grid">' + f('margin', 'Untung / markup (%)', o.margin, 'number', { ket: 'Harga jual = HPP × (1 + markup)' }) + f('dp', 'DP (%)', o.dp, 'number') + '</div></div>' +
      '<div id="ringkasForm"></div>' +
      '<div class="medan"><label for="f_catatan">Catatan untuk RAB</label><textarea id="f_catatan" name="catatan">' + esc(o.catatan) + '</textarea></div>' +
      '<p class="pesan-galat" id="galatForm" role="alert"></p>' +
      '<div class="aksi-form"><button class="tombol garis" type="button" data-tutup>Batal</button><button class="tombol" type="submit">' + ikon('cek') + 'Simpan order</button></div></form>';
    var root = bukaModal(baru ? 'Order baru' : 'Edit ' + o.no, html);
    var form = $('#formOrder', root);
    function baca() {
      var g = function (k) { return form.elements[k].value; };
      o.pelanggan = g('pelanggan').trim(); o.hp = g('hp').trim(); o.alamat = g('alamat').trim(); o.jenis = g('jenis'); o.judul = g('judul').trim();
      o.p = num(g('p')); o.t = num(g('t')); o.tgl = g('tgl') || hariIni(); o.status = g('status'); o.bayar = num(g('bayar')); o.tglLunas = g('tglLunas');
      o.tukang = { orang: num(g('orang')), hari: num(g('hari')), upah: num(g('upah')) };
      o.oh = { listrik: num(g('listrik')), gas: num(g('gas')), transport: num(g('transport')), sewa: num(g('sewa')) };
      o.margin = num(g('margin')); o.dp = num(g('dp')); o.catatan = g('catatan');
      o.item = $$('.baris-item', form).map(function (r) { return { b: $('[data-f="b"]', r).value, q: num($('[data-f="q"]', r).value) }; });
    }
    function segar() {
      baca();
      $$('.baris-item', form).forEach(function (r, i) { var b = bahanById(o.item[i].b); $('.sub', r).textContent = b ? rp(b.harga * o.item[i].q) : ''; });
      $('#ringkasForm', form).innerHTML = ringkasHpp(hitung(o), o);
    }
    form.addEventListener('input', segar); form.addEventListener('change', segar);
    $('#tambahItem', form).addEventListener('click', function () { var w = document.createElement('div'); w.innerHTML = barisItem({ b: D.bahan[0] ? D.bahan[0].id : '', q: 1 }, $$('.baris-item', form).length); $('#daftarItem', form).appendChild(w.firstChild); segar(); });
    form.addEventListener('click', function (e) { var b = e.target.closest('[data-hapus-item]'); if (b) { b.parentNode.remove(); segar(); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); baca();
      var salah = []; $$('.galat-medan', form).forEach(function (x) { x.classList.remove('galat-medan'); });
      ['pelanggan', 'judul'].forEach(function (k) { if (!o[k]) { salah.push(k); form.elements[k].classList.add('galat-medan'); } });
      if (salah.length) { $('#galatForm', form).textContent = 'Nama pelanggan dan nama pekerjaan wajib diisi.'; form.elements[salah[0]].focus(); return; }
      if (o.status === 'lunas' && !o.tglLunas) o.tglLunas = hariIni();
      if (o.status === 'lunas') o.bayar = hitung(o).jual;
      if (baru) D.order.push(o); else D.order = D.order.map(function (x) { return x.id === o.id ? o : x; });
      simpan(); tutupModal(); toast(baru ? 'Order ' + o.no + ' dibuat' : 'Order disimpan'); buka(halaman);
    });
    segar();
  }

  /* RAB / penawaran siap cetak */
  function htmlRab(o) {
    var h = hitung(o), k = 1 + num(o.margin) / 100, A = D.atur, baris = [], subBahan = 0;
    o.item.filter(function (x) { return num(x.q) > 0; }).forEach(function (x) { var b = bahanById(x.b); if (!b) return; var hs = Math.round(b.harga * k / 100) * 100, j = hs * num(x.q); subBahan += j; baris.push([b.nama, ang(x.q) + ' ' + b.satuan, rp(hs), rp(j)]); });
    var jasa = h.jual - subBahan;
    baris.push(['Jasa fabrikasi, pengelasan, pengecatan & pemasangan', '1 ls', rp(jasa), rp(jasa)]);
    return '<div class="rab"><div class="rab-kepala"><div class="rab-merek">' + (logoHTML('rab-logo') || '<span class="rab-logo rab-ini">' + esc(inisial(namaUsaha())) + '</span>') + '<div><h1>' + esc(namaUsaha()) + '</h1><p>' + esc(A.alamat) + ' · WA ' + esc(A.hp) + '</p></div></div><div style="text-align:right"><h1 style="font-size:16px">PENAWARAN HARGA / RAB</h1><p>No. ' + esc(o.no) + '</p><p>' + tglIndo(o.tgl) + '</p></div></div>' +
      '<p style="font-size:12px;margin:0 0 4px">Kepada Yth. <b>' + esc(o.pelanggan) + '</b><br>' + esc(o.alamat) + '</p>' +
      '<p style="font-size:12px;margin:8px 0 12px">Pekerjaan: <b>' + esc(o.judul) + '</b> (' + esc(o.jenis) + ', ukuran ' + ang(o.p) + ' × ' + ang(o.t) + ' m = ' + ang(h.luas) + ' m²)</p>' +
      '<table><thead><tr><th>No</th><th>Uraian</th><th class="kanan">Volume</th><th class="kanan">Harga satuan</th><th class="kanan">Jumlah</th></tr></thead><tbody>' +
      baris.map(function (r, i) { return '<tr><td>' + (i + 1) + '</td><td>' + esc(r[0]) + '</td><td class="kanan">' + r[1] + '</td><td class="kanan">' + r[2] + '</td><td class="kanan">' + r[3] + '</td></tr>'; }).join('') +
      '<tr class="total"><td colspan="4">TOTAL</td><td class="kanan">' + rp(h.jual) + '</td></tr>' +
      '<tr><td colspan="4">Uang muka (DP ' + ang(o.dp) + '%)</td><td class="kanan">' + rp(h.dp) + '</td></tr>' +
      '<tr><td colspan="4">Pelunasan setelah terpasang</td><td class="kanan">' + rp(h.jual - h.dp) + '</td></tr></tbody></table>' +
      (h.luas ? '<p style="font-size:12px">Setara ' + rp(h.jualM2) + ' per m².</p>' : '') +
      '<p style="font-size:11px;color:#444">Catatan: ' + esc(o.catatan || 'Harga termasuk bahan, cat dasar + cat akhir, dan pemasangan.') + ' Penawaran berlaku ' + A.berlaku + ' hari. Pengerjaan dimulai setelah DP diterima.</p>' +
      '<div class="ttd"><div>Pemesan<span>' + esc(o.pelanggan) + '</span></div><div>Hormat kami,<span>' + esc(namaUsaha()) + '</span></div></div></div>';
  }

  /* Kalkulator */
  RENDER.kalkulator = function (isi) {
    $('#kepalaSub').textContent = 'Ukuran → bahan → HPP';
    var def = KALK_DEF[kalk.jenis];
    function opsi(peran, sel) { return D.bahan.filter(function (b) { return peran === 'atap' ? b.kat === 'Atap' : peran === 'plat' ? b.kat === 'Plat' : b.satuan === 'batang'; }).map(function (b) { return '<option value="' + b.id + '"' + (b.id === sel ? ' selected' : '') + '>' + esc(b.nama) + '</option>'; }).join(''); }
    isi.innerHTML = '<div class="kalk">' +
      '<form class="kartu form" id="formKalk" data-bagian="panel" onsubmit="return false"><div class="jenis-pilih" role="group" aria-label="Jenis pekerjaan">' + Object.keys(KALK_DEF).map(function (k) { return '<button type="button" data-jenis="' + k + '" aria-pressed="' + (k === kalk.jenis) + '">' + KALK_DEF[k].n + '</button>'; }).join('') + '</div>' +
        '<div class="sketsa" id="sketsa" aria-hidden="true"></div>' +
        '<div class="form-grid">' + def.f.map(function (f) { return '<div class="medan"><label for="k_' + f[0] + '">' + f[1] + '</label><input id="k_' + f[0] + '" data-k="' + f[0] + '" type="number" step="any" min="0" inputmode="decimal" value="' + nilaiKalk(kalk.jenis + '.' + f[0], f[2]) + '"></div>'; }).join('') + '</div>' +
        '<div class="bagian-form"><h3>Pilih bahan</h3><div class="form">' + def.b.map(function (b) { return '<div class="medan"><label for="kb_' + b[0] + '">' + b[1] + '</label><select id="kb_' + b[0] + '" data-pilih="' + b[0] + '">' + opsi(b[0], kalk.pilih[kalk.jenis + '.' + b[0]] || b[2]) + '</select></div>'; }).join('') + '</div></div>' +
        '<div class="bagian-form"><h3>Tukang</h3><div class="form-grid"><div class="medan"><label for="k_orang">Jumlah tukang</label><input id="k_orang" data-tk="orang" type="number" min="1" value="' + kalk.orang + '"></div><div class="medan"><label for="k_hari">Lama kerja (hari)</label><input id="k_hari" data-tk="hari" type="number" min="1" value="' + kalk.hari + '"></div></div></div>' +
      '</form><div id="hasilKalk" style="display:grid;gap:14px"></div></div>';
    var form = $('#formKalk');
    form.addEventListener('click', function (e) { var b = e.target.closest('[data-jenis]'); if (b) { kalk.jenis = b.dataset.jenis; RENDER.kalkulator(isi); } });
    form.addEventListener('input', function (e) {
      var t = e.target; if (t.dataset.k) kalk.v[kalk.jenis + '.' + t.dataset.k] = t.value; if (t.dataset.pilih) kalk.pilih[kalk.jenis + '.' + t.dataset.pilih] = t.value; if (t.dataset.tk) kalk[t.dataset.tk] = num(t.value);
      gambarHasil();
    });
    function gambarHasil() {
      var r = hitungKalk(), A = D.atur;
      var o = { p: r.v.p, t: kalk.jenis === 'kanopi' ? r.v.t : (kalk.jenis === 'tangga' ? r.v.t : r.v.t), item: r.baris.map(function (x) { return { b: x.b, q: x.q }; }), tukang: { orang: kalk.orang, hari: kalk.hari, upah: A.upah }, oh: { listrik: A.listrikHari * kalk.hari, gas: 0, transport: A.transport, sewa: 0 }, margin: A.margin, dp: A.dp, bayar: 0 };
      if (kalk.jenis === 'teralis' || kalk.jenis === 'rak') { o.p = r.v.p * Math.max(1, Math.round(r.v.unit)); }
      if (kalk.jenis === 'tangga') { o.t = r.luas / Math.max(.01, r.v.p); }
      var h = hitung(o); kalk.terakhir = { r: r, o: o };
      $('#sketsa').innerHTML = sketsa(r);
      $('#hasilKalk').innerHTML =
        '<div class="kartu"><div class="kartu-kepala"><h2>Kebutuhan bahan</h2><span class="label-teknis">' + r.info.map(esc).join(' · ') + '</span></div><div class="tabel-gulir"><table><thead><tr><th>Bahan</th><th class="kanan">Beli</th><th>Perhitungan</th><th class="kanan">Subtotal</th></tr></thead><tbody>' +
          r.baris.map(function (x) { var b = bahanById(x.b); return '<tr><td><b>' + esc(b.nama) + '</b></td><td class="kanan angka">' + ang(x.q) + ' ' + b.satuan + '</td><td class="redup" style="font-size:13px">' + esc(x.ket || '') + '</td><td class="kanan angka">' + rp(b.harga * x.q) + '</td></tr>'; }).join('') +
          '<tr class="total"><td colspan="3">Total bahan</td><td class="kanan angka">' + rp(h.bahan) + '</td></tr></tbody></table></div></div>' +
        '<div class="grid-2" style="margin:0"><div class="kartu"><div class="kartu-kepala"><h2>Rencana potong batang</h2><span class="label-teknis">kerf ' + A.kerf + ' mm</span></div>' +
          (r.pot.length ? r.pot.map(function (p) { return '<p style="margin:8px 0 2px;font-size:13px"><b>' + esc(p.b.nama) + '</b> <span class="redup">· ' + p.r.batang + ' batang · sisa ' + ang(p.r.sisa) + ' m</span></p>' + p.r.bar.slice(0, 6).map(function (bar) { return '<div class="potong" title="' + bar.ptg.map(function (x) { return ang(x) + ' m'; }).join(' + ') + '">' + bar.ptg.map(function (x) { return '<i style="width:' + (x / p.b.panjang * 100) + '%"></i>'; }).join('') + '</div>'; }).join('') + (p.r.bar.length > 6 ? '<p class="redup" style="font-size:12px;margin:2px 0">+' + (p.r.bar.length - 6) + ' batang lagi</p>' : ''); }).join('') : '<p class="redup">Tidak ada bahan batang.</p>') +
          '<p class="redup" style="font-size:12px;margin:10px 0 0">Kotak arsir = sisa potong. Sisa ≥ 1 m bisa dipakai order lain.</p></div>' +
          '<div>' + ringkasHpp(h, o) + '<button class="tombol aksen" style="width:100%;margin-top:12px" type="button" id="jadikanOrder">' + ikon('tambah') + 'Jadikan order</button></div></div>';
      $('#jadikanOrder').addEventListener('click', function () {
        var ob = orderKosong(), t = kalk.terakhir.o;
        ob.jenis = KALK_DEF[kalk.jenis].n; ob.judul = KALK_DEF[kalk.jenis].n + ' ' + ang(r.v.p) + ' m'; ob.p = +t.p.toFixed(2); ob.t = +num(t.t).toFixed(2); ob.item = t.item; ob.tukang = t.tukang; ob.oh = t.oh;
        formOrder(ob, true);
      });
    }
    gambarHasil();
  };
  function sketsa(r) {
    var j = kalk.jenis, v = r.v, W = 320, H = 120, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img"><g stroke="currentColor" stroke-width="1.5" fill="none">';
    if (j === 'pagar' || j === 'teralis') {
      var p = v.p || 1, t = v.t || 1, sc = Math.min((W - 40) / p, (H - 30) / t), w = p * sc, hh = t * sc, x0 = (W - w) / 2, y0 = (H - hh) / 2 - 4;
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + hh + '"/>';
      var n = Math.min(80, Math.floor(p * 100 / Math.max(5, v.jj))); for (var i = 1; i < n; i++) { var x = x0 + w * i / n; s += '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + (y0 + hh) + '" opacity=".45"/>'; }
      if (j === 'pagar') { var nt = Math.max(2, Math.ceil(p / Math.max(.5, v.jt)) + 1); for (var k = 0; k < nt; k++) { var xt = x0 + w * k / (nt - 1); s += '<line x1="' + xt + '" y1="' + (y0 - 3) + '" x2="' + xt + '" y2="' + (y0 + hh + 6) + '" stroke="var(--tema-aksen)" stroke-width="3"/>'; } }
      s += '<text x="' + W / 2 + '" y="' + (H - 2) + '" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">' + ang(p) + ' m × ' + ang(t) + ' m</text>';
    } else if (j === 'kanopi') {
      s += '<path d="M40 30 L280 30 L260 50 L60 50 Z" opacity=".7"/><line x1="60" y1="50" x2="60" y2="105" stroke="var(--tema-aksen)" stroke-width="3"/><line x1="260" y1="50" x2="260" y2="105" stroke="var(--tema-aksen)" stroke-width="3"/>';
      for (var u = 0; u < 9; u++) { var xu = 50 + u * 27.5; s += '<line x1="' + xu + '" y1="30" x2="' + (xu + 2) + '" y2="50" opacity=".5"/>'; }
      s += '<text x="160" y="118" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">' + ang(v.p) + ' m × ' + ang(v.t) + ' m · tinggi ' + ang(v.tt) + ' m</text>';
    } else if (j === 'tangga') {
      var nA = Math.max(1, Math.min(24, Math.ceil(v.t * 100 / Math.max(10, v.optrede)))), dx = 220 / nA, dy = 90 / nA, d = 'M50 105';
      for (var a = 0; a < nA; a++) d += ' h' + dx + ' v-' + dy;
      s += '<path d="' + d + '"/><line x1="50" y1="105" x2="' + (50 + dx * nA) + '" y2="' + (105 - dy * nA) + '" stroke="var(--tema-aksen)" stroke-width="3"/>';
    } else {
      var su = Math.max(1, Math.min(8, Math.round(v.susun)));
      s += '<rect x="110" y="10" width="100" height="100"/>'; for (var q = 0; q <= su; q++) { var yq = 10 + 100 * q / su; s += '<line x1="110" y1="' + yq + '" x2="210" y2="' + yq + '" stroke="var(--tema-aksen)" stroke-width="2"/>'; }
    }
    return s + '</g></svg>';
  }

  /* Master bahan */
  RENDER.bahan = function (isi) {
    $('#kepalaSub').textContent = D.bahan.length + ' bahan · harga per satuan';
    aksiKepala('<button class="tombol garis" type="button" data-aksi="csv-bahan">' + ikon('unduh') + 'CSV</button><button class="tombol aksen" type="button" data-aksi="bahan-baru">' + ikon('tambah') + 'Bahan</button>');
    if (!D.bahan.length) { isi.innerHTML = '<div class="kartu kosong">' + ikon('bahan') + '<p>Belum ada bahan. Tambahkan besi hollow, siku, cat, kawat las, dll.</p></div>'; return; }
    isi.innerHTML = '<div class="kartu" data-bagian="panel"><div class="tabel-gulir"><table><thead><tr><th>Bahan</th><th>Kategori</th><th class="kanan">Harga</th><th>Satuan</th><th class="kanan">Panjang</th><th class="kanan">Per meter</th><th><span class="sr">Aksi</span></th></tr></thead><tbody>' +
      KAT.concat(['Lainnya']).map(function (k) { return D.bahan.filter(function (b) { return (KAT.indexOf(b.kat) < 0 ? 'Lainnya' : b.kat) === k; }).map(function (b) {
        return '<tr><td><b>' + esc(b.nama) + '</b></td><td><span class="pil survei" style="font-weight:500">' + esc(b.kat) + '</span></td><td class="kanan angka"><b>' + rp(b.harga) + '</b></td><td>/' + esc(b.satuan) + '</td><td class="kanan angka">' + (b.panjang ? ang(b.panjang) + ' m' : '-') + '</td><td class="kanan angka redup">' + (b.panjang ? rp(b.harga / b.panjang) : '-') + '</td><td class="kanan"><button class="tombol-ikon" type="button" data-aksi="edit-bahan" data-id="' + b.id + '" aria-label="Ubah ' + esc(b.nama) + '">' + ikon('edit') + '</button></td></tr>';
      }).join(''); }).join('') + '</tbody></table></div></div>';
  };
  function formBahan(b) {
    var baru = !b; b = b || { id: id(), nama: '', kat: 'Hollow', satuan: 'batang', harga: 0, panjang: 6 };
    var html = '<form class="form" id="formBahan" novalidate><div class="form-grid"><div class="medan penuh"><label for="b_nama">Nama bahan</label><input id="b_nama" name="nama" required value="' + esc(b.nama) + '" placeholder="mis. Hollow 40×40 tebal 1,2 mm"></div>' +
      '<div class="medan"><label for="b_kat">Kategori</label><select id="b_kat" name="kat">' + KAT.map(function (k) { return '<option' + (k === b.kat ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></div>' +
      '<div class="medan"><label for="b_sat">Satuan beli</label><select id="b_sat" name="satuan">' + SATUAN.map(function (k) { return '<option' + (k === b.satuan ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></div>' +
      '<div class="medan"><label for="b_harga">Harga per satuan (Rp)</label><input id="b_harga" name="harga" type="number" min="0" inputmode="numeric" value="' + b.harga + '"></div>' +
      '<div class="medan"><label for="b_pjg">Panjang per batang (m)</label><input id="b_pjg" name="panjang" type="number" min="0" step="any" value="' + (b.panjang || 0) + '"><small>Untuk satuan batang (umumnya 6 m). Selain batang isi 0.</small></div></div>' +
      '<p class="pesan-galat" id="galatBahan" role="alert"></p><div class="aksi-form">' + (baru ? '' : '<button class="tombol bahaya kiri" type="button" id="hapusBahan">' + ikon('hapus') + 'Hapus</button>') + '<button class="tombol garis" type="button" data-tutup>Batal</button><button class="tombol" type="submit">Simpan</button></div></form>';
    var root = bukaModal(baru ? 'Bahan baru' : 'Ubah bahan', html, true), form = $('#formBahan', root);
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var el = form.elements;
      if (!el.nama.value.trim()) { el.nama.classList.add('galat-medan'); $('#galatBahan').textContent = 'Nama bahan wajib diisi.'; el.nama.focus(); return; }
      if (num(el.harga.value) <= 0) { el.harga.classList.add('galat-medan'); $('#galatBahan').textContent = 'Harga harus lebih dari 0.'; el.harga.focus(); return; }
      b.nama = el.nama.value.trim(); b.kat = el.kat.value; b.satuan = el.satuan.value; b.harga = num(el.harga.value); b.panjang = b.satuan === 'batang' ? (num(el.panjang.value) || 6) : 0;
      if (baru) D.bahan.push(b); simpan(); tutupModal(); toast('Bahan disimpan · HPP order ikut terbarui'); buka('bahan');
    });
    var h = $('#hapusBahan', root); if (h) h.addEventListener('click', function () {
      var dipakai = D.order.filter(function (o) { return o.item.some(function (x) { return x.b === b.id; }); }).length;
      if (dipakai) { $('#galatBahan').textContent = 'Bahan dipakai di ' + dipakai + ' order. Ubah harganya saja, jangan dihapus.'; return; }
      if (!confirm('Hapus ' + b.nama + '?')) return; D.bahan = D.bahan.filter(function (x) { return x.id !== b.id; }); simpan(); tutupModal(); toast('Bahan dihapus'); buka('bahan');
    });
  }

  /* Laporan */
  RENDER.laporan = function (isi) {
    $('#kepalaSub').textContent = 'Laba per bulan (order lunas)';
    aksiKepala('<button class="tombol garis" type="button" data-aksi="csv-order">' + ikon('unduh') + 'Ekspor CSV</button>');
    var bulan = []; var d = new Date(); d.setDate(1);
    for (var i = 5; i >= 0; i--) { var x = new Date(d.getFullYear(), d.getMonth() - i, 1); bulan.push(x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0')); }
    var data = bulan.map(function (b) { var os = D.order.filter(function (o) { return o.status === 'lunas' && bulanKey(o.tglLunas) === b; }); var r = { b: b, n: os.length, omzet: 0, hpp: 0, laba: 0, bahan: 0, tenaga: 0, overhead: 0 }; os.forEach(function (o) { var h = hitung(o); r.omzet += h.jual; r.hpp += h.hpp; r.laba += h.laba; r.bahan += h.bahan; r.tenaga += h.tenaga; r.overhead += h.overhead; }); return r; });
    var maks = Math.max.apply(null, data.map(function (r) { return r.omzet; }).concat([1]));
    var tot = data.reduce(function (a, r) { a.omzet += r.omzet; a.hpp += r.hpp; a.laba += r.laba; a.n += r.n; return a; }, { omzet: 0, hpp: 0, laba: 0, n: 0 });
    isi.innerHTML = '<section class="grid-kpi"><div class="kartu kpi gelap" data-bagian="nav"><p class="label-teknis">Laba kotor 6 bulan</p><span class="nilai angka">' + rp(tot.laba) + '</span><span class="ket">' + tot.n + ' order lunas</span></div>' +
      '<div class="kartu kpi"><p class="label-teknis">Omzet</p><span class="nilai angka">' + rpPendek(tot.omzet) + '</span></div><div class="kartu kpi"><p class="label-teknis">Total HPP</p><span class="nilai angka">' + rpPendek(tot.hpp) + '</span></div><div class="kartu kpi"><p class="label-teknis">Margin rata-rata</p><span class="nilai angka" style="color:var(--aksen-teks)">' + ang(tot.omzet ? tot.laba / tot.omzet * 100 : 0, 1) + '%</span><span class="ket">laba ÷ omzet</span></div></section>' +
      '<section class="kartu" style="margin-bottom:18px"><div class="kartu-kepala"><h2>Omzet = HPP + laba</h2><div class="legenda"><span style="--w:color-mix(in srgb, var(--tema-utama) 55%, #94a3b8)">HPP</span><span style="--w:var(--tema-aksen)">Laba</span></div></div>' +
      '<div class="grafik" role="img" aria-label="Grafik omzet per bulan">' + data.map(function (r) { return '<div class="kol"><small class="angka">' + (r.omzet ? rpPendek(r.omzet).replace('Rp ', '') : '') + '</small><div class="tumpuk" style="height:' + (r.omzet / maks * 170) + 'px"><i style="height:' + (r.omzet ? r.hpp / r.omzet * 100 : 0) + '%;background:color-mix(in srgb, var(--tema-utama) 55%, #94a3b8)"></i><i style="height:' + (r.omzet ? r.laba / r.omzet * 100 : 0) + '%;background:var(--tema-aksen)"></i></div><small>' + BLN[+r.b.slice(5) - 1] + '</small></div>'; }).join('') + '</div></section>' +
      '<section class="kartu"><div class="tabel-gulir"><table><thead><tr><th>Bulan</th><th class="kanan">Order</th><th class="kanan">Omzet</th><th class="kanan">Bahan</th><th class="kanan">Tenaga</th><th class="kanan">Overhead</th><th class="kanan">Laba</th></tr></thead><tbody>' +
      data.slice().reverse().map(function (r) { return '<tr><td><b>' + BLN[+r.b.slice(5) - 1] + ' ' + r.b.slice(0, 4) + '</b></td><td class="kanan angka">' + r.n + '</td><td class="kanan angka">' + rp(r.omzet) + '</td><td class="kanan angka">' + rp(r.bahan) + '</td><td class="kanan angka">' + rp(r.tenaga) + '</td><td class="kanan angka">' + rp(r.overhead) + '</td><td class="kanan angka"><b class="' + (r.laba > 0 ? 'naik' : '') + '">' + rp(r.laba) + '</b></td></tr>'; }).join('') +
      '<tr class="total"><td>Total</td><td class="kanan angka">' + tot.n + '</td><td class="kanan angka">' + rp(tot.omzet) + '</td><td colspan="3" class="kanan angka">HPP ' + rp(tot.hpp) + '</td><td class="kanan angka">' + rp(tot.laba) + '</td></tr></tbody></table></div></section>';
  };

  /* Pengaturan */
  RENDER.pengaturan = function (isi) {
    var A = D.atur; $('#kepalaSub').textContent = 'Tarif bawaan & data';
    var f = function (k, l, ket, tipe) { return '<div class="medan"><label for="a_' + k + '">' + l + '</label><input id="a_' + k + '" name="' + k + '" type="' + (tipe || 'number') + '" step="any" min="0" value="' + esc(A[k]) + '">' + (ket ? '<small>' + ket + '</small>' : '') + '</div>'; };
    isi.innerHTML = '<form class="kartu form" id="formAtur" data-bagian="panel" novalidate><h2>Profil & tarif bawaan</h2>' +
      '<div class="medan logo-medan"><span class="label-logo">Logo bengkel <small class="redup">(sidebar & kepala RAB, persegi)</small></span><div class="logo-baris"><span class="logo-prev">' + (logoHTML() || ikon('percik')) + '</span>' +
      '<label class="tombol garis kecil" style="cursor:pointer">' + ikon('unduh') + 'Pilih logo<input type="file" accept="image/*" id="aLogo" class="sr-file"></label>' + (A.logo ? '<button class="tombol garis kecil" type="button" id="aLogoHapus">Hapus</button>' : '') + '</div><small>Diperkecil otomatis ke ' + GAMBAR.maks + ' px.</small></div><div class="form-grid">' + f('alamat', 'Alamat bengkel', 'Muncul di kepala RAB', 'text') + f('hp', 'No. WA bengkel', '', 'tel') +
      f('upah', 'Upah tukang / hari (Rp)') + f('margin', 'Markup bawaan (%)') + f('dp', 'DP bawaan (%)') + f('berlaku', 'Penawaran berlaku (hari)') +
      f('listrikHari', 'Listrik mesin las / hari (Rp)') + f('transport', 'Transport bawaan (Rp)') + f('kerf', 'Tebal potong gerinda (mm)', 'Dipakai saat menghitung sisa potong') + f('dayaCat', 'Daya sebar cat (m² per kg)', 'Cat besi umumnya 6–8 m²/kg sekali lapis') + f('kawatM2', 'Kawat las (kg per m²)', 'Rata-rata 0,2–0,3 kg/m² untuk pagar hollow') +
      '</div><div class="aksi-form"><button class="tombol" type="submit">' + ikon('cek') + 'Simpan pengaturan</button></div></form>' +
      '<div class="grid-2" style="margin-top:14px"><div class="kartu"><h2>Data & cadangan</h2><p class="redup" style="font-size:14px;margin-top:0">Data tersimpan di browser ini (localStorage). Unduh cadangan rutin.</p><div class="aksi-form" style="justify-content:flex-start"><button class="tombol garis" type="button" data-aksi="backup">' + ikon('unduh') + 'Cadangan JSON</button><label class="tombol garis" for="impor" style="cursor:pointer">Pulihkan JSON</label><input id="impor" type="file" accept="application/json" class="sr"></div></div>' +
      '<div class="kartu"><h2>Tampilan</h2><div class="aksi-form" style="justify-content:flex-start"><button class="tombol garis" type="button" data-aksi="mode">' + ikon('bulan') + 'Ganti mode terang/gelap</button><button class="tombol bahaya" type="button" data-aksi="reset">Isi ulang data contoh</button></div>' + (DEMO ? '<p class="redup" style="font-size:13px">Mode demo: perubahan tidak disimpan.</p>' : '') + '</div></div>';
    $('#formAtur').addEventListener('submit', function (e) { e.preventDefault(); var el = e.target.elements; Object.keys(A).forEach(function (k) { if (!el[k]) return; A[k] = el[k].type === 'number' ? num(el[k].value) : el[k].value.trim(); }); simpan(); toast('Pengaturan disimpan'); });
    $('#aLogo').addEventListener('change', function (e) { var f = e.target.files[0]; e.target.value = ''; if (!f || !/^image\//.test(f.type)) return; kecilkan(f, true, function (d) { A.logo = d; simpan(); isiLogo(); toast('Logo bengkel disimpan'); RENDER.pengaturan(isi); }); });
    if ($('#aLogoHapus')) $('#aLogoHapus').addEventListener('click', function () { A.logo = ''; simpan(); isiLogo(); toast('Logo dihapus'); RENDER.pengaturan(isi); });
    $('#impor').addEventListener('change', function (e) {
      var file = e.target.files[0]; if (!file) return; var rd = new FileReader();
      rd.onload = function () { try { var x = JSON.parse(rd.result); if (!x.order || !x.bahan) throw 0; D = migrasi(x); simpan(); toast('Data dipulihkan'); buka('dasbor'); } catch (er) { toast('Berkas bukan cadangan yang valid', true); } };
      rd.readAsText(file);
    });
  };

  /* ---------- CSV & unduhan ---------- */
  function unduh(nama, isi, tipe) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function csv(rows) { return '﻿' + rows.map(function (r) { return r.map(function (c) { c = String(c == null ? '' : c); return /[";\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(';'); }).join('\n'); }

  /* ---------- Aksi ---------- */
  document.addEventListener('click', function (e) {
    var kartu = e.target.closest('[data-buka]'); if (kartu) { detailOrder(kartu.dataset.buka); return; }
    var b = e.target.closest('[data-aksi]'); if (!b) return;
    var a = b.dataset.aksi, o = b.dataset.id && D.order.filter(function (x) { return x.id === b.dataset.id; })[0];
    if (a === 'hapus-foto' && o) { o.foto.splice(+b.dataset.i, 1); simpan(); toast('Foto dihapus'); detailOrder(o.id); return; }
    if (a === 'order-baru') formOrder(orderKosong(), true);
    else if (a === 'edit-order' && o) formOrder(o, false);
    else if (a === 'maju' && o) { var i = STATUS.map(function (s) { return s.k; }).indexOf(o.status); o.status = STATUS[Math.min(3, i + 1)].k; if (o.status === 'lunas') { o.tglLunas = hariIni(); o.bayar = hitung(o).jual; } simpan(); toast(o.no + ' → ' + STATUS[Math.min(3, i + 1)].n); buka(halaman); detailOrder(o.id); }
    else if (a === 'bayar-order' && o) {
      var h = hitung(o);
      var root = bukaModal('Catat pembayaran', '<form class="form" id="formBayar"><p style="margin:0">' + esc(o.no) + ' · total ' + rp(h.jual) + ' · sisa <b>' + rp(h.sisa) + '</b></p><div class="medan"><label for="nomBayar">Nominal diterima (Rp)</label><input id="nomBayar" type="number" min="0" inputmode="numeric" value="' + (num(o.bayar) ? h.sisa : h.dp) + '"><small>Bawaan: DP ' + ang(o.dp) + '% bila belum ada pembayaran.</small></div><div class="aksi-form"><button class="tombol garis" type="button" data-tutup>Batal</button><button class="tombol" type="submit">Simpan</button></div></form>', true);
      $('#formBayar', root).addEventListener('submit', function (ev) { ev.preventDefault(); var n = num($('#nomBayar').value); if (n <= 0) { $('#nomBayar').classList.add('galat-medan'); return; } o.bayar = num(o.bayar) + n; if (o.bayar >= h.jual) { o.bayar = h.jual; o.status = 'lunas'; o.tglLunas = hariIni(); } simpan(); tutupModal(); toast('Pembayaran ' + rp(n) + ' dicatat'); buka(halaman); });
    }
    else if (a === 'hapus-order' && o) { if (confirm('Hapus order ' + o.no + '? Data tidak bisa dikembalikan.')) { D.order = D.order.filter(function (x) { return x !== o; }); simpan(); tutupModal(); toast('Order dihapus'); buka(halaman); } }
    else if (a === 'wa-order' && o) { var hh = hitung(o), hp = String(o.hp).replace(/\D/g, '').replace(/^0/, '62'); var pesan = 'Halo ' + o.pelanggan + ', berikut penawaran ' + o.judul + ' (' + ang(o.p) + '×' + ang(o.t) + ' m): total ' + rp(hh.jual) + ', DP ' + rp(hh.dp) + '. Terima kasih — ' + namaUsaha(); window.open('https://wa.me/' + hp + '?text=' + encodeURIComponent(pesan), '_blank', 'noopener'); }
    else if (a === 'rab' && o) {
      var root2 = bukaModal('RAB ' + o.no, '<div class="pratinjau-rab">' + htmlRab(o) + '</div><div class="aksi-form" style="margin-top:12px"><button class="tombol garis" type="button" data-tutup>Tutup</button><button class="tombol" type="button" id="cetakRab">' + ikon('cetak') + 'Cetak / simpan PDF</button></div>');
      $('#cetakRab', root2).addEventListener('click', function () { $('#cetak').innerHTML = htmlRab(o); window.print(); });
    }
    else if (a === 'bahan-baru') formBahan(null);
    else if (a === 'edit-bahan') formBahan(bahanById(b.dataset.id));
    else if (a === 'csv-order') {
      var rows = [['No', 'Tanggal', 'Pelanggan', 'HP', 'Jenis', 'Pekerjaan', 'Panjang (m)', 'Tinggi (m)', 'Luas (m2)', 'Status', 'Bahan', 'Tenaga', 'Overhead', 'HPP', 'HPP per m2', 'Markup %', 'Harga jual', 'Laba', 'Dibayar', 'Tanggal lunas']];
      D.order.forEach(function (x) { var h = hitung(x); rows.push([x.no, x.tgl, x.pelanggan, x.hp, x.jenis, x.judul, x.p, x.t, h.luas.toFixed(2), x.status, h.bahan, h.tenaga, h.overhead, h.hpp, Math.round(h.perM2), x.margin, h.jual, h.laba, x.status === 'lunas' ? h.jual : x.bayar, x.tglLunas]); });
      unduh('order-bengkel-las.csv', csv(rows), 'text/csv;charset=utf-8'); toast('CSV order diunduh');
    }
    else if (a === 'csv-bahan') { var r2 = [['Nama', 'Kategori', 'Satuan', 'Harga', 'Panjang (m)']]; D.bahan.forEach(function (x) { r2.push([x.nama, x.kat, x.satuan, x.harga, x.panjang]); }); unduh('master-bahan.csv', csv(r2), 'text/csv;charset=utf-8'); toast('CSV bahan diunduh'); }
    else if (a === 'backup') unduh('cadangan-bengkel-las-' + hariIni() + '.json', JSON.stringify(D, null, 1), 'application/json');
    else if (a === 'mode') setMode(document.documentElement.dataset.mode === 'gelap' ? 'terang' : 'gelap', true);
    else if (a === 'reset') { if (confirm('Ganti semua data dengan data contoh? Data sekarang akan hilang (unduh cadangan dulu).')) { D = contoh(); simpan(); toast('Data contoh dimuat'); buka('dasbor'); } }
  });
  function tombolMode() { var t = $('#tombolMode'); if (!t) return; var g = document.documentElement.dataset.mode === 'gelap'; t.innerHTML = ikon(g ? 'matahari' : 'bulan') + '<span>' + (g ? 'Mode terang' : 'Mode gelap') + '</span>'; }
  $('#tombolMode').addEventListener('click', function () { setMode(document.documentElement.dataset.mode === 'gelap' ? 'terang' : 'gelap', true); });
  window.addEventListener('afterprint', function () { $('#cetak').innerHTML = ''; });

  /* ---------- Mulai ---------- */
  muat(); bangunMenu(); isiNama(); isiLogo(); teksAtas(); tombolMode();
  buka((location.hash || '#dasbor').slice(1));
  window.BengkelLas = { hitung: hitung, potongBatang: potongBatang };
})();
