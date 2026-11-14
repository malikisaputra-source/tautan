/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* Catatan Ojol — HTML/CSS/JS murni, data di localStorage. Peta file: lihat AGENTS.md */
// KONFIG gambar: ganti logo/avatar bawaan cukup timpa berkas di img/ atau ubah path di sini.
var KONFIG = { logo: 'img/logo.svg', avatar: 'img/avatar.svg' };
(function () {
  'use strict';
  var KUNCI = 'catatan-ojol-v1';
  var KUNCI_MODE = 'catatan-ojol-mode';
  var APP = ['Gojek', 'Grab', 'Maxim'];
  var WARNA_APP = { Gojek: '#22c55e', Grab: '#14b8a6', Maxim: '#f5b301' };
  var LAYANAN = ['Antar orang', 'Antar makanan', 'Kirim barang'];
  var KATEGORI = [
    { id: 'bensin', nama: 'Bensin', ikon: 'i-bensin', cepat: [20000, 30000, 40000] },
    { id: 'parkir', nama: 'Parkir', ikon: 'i-parkir', cepat: [2000, 3000, 5000] },
    { id: 'makan', nama: 'Makan', ikon: 'i-makan', cepat: [12000, 18000, 25000] },
    { id: 'servis', nama: 'Servis', ikon: 'i-servis', cepat: [50000, 85000, 150000] },
    { id: 'cicilan', nama: 'Cicilan HP', ikon: 'i-hp', cepat: [150000, 250000, 350000] },
    { id: 'lain', nama: 'Lainnya', ikon: 'i-lain', cepat: [5000, 10000, 20000] }
  ];
  var KAT = {}; KATEGORI.forEach(function (k) { KAT[k.id] = k; });
  var HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  var HARI_P = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var BULAN_P = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function rp(n) { n = Math.round(n || 0); return (n < 0 ? '−Rp' : 'Rp') + Math.abs(n).toLocaleString('id-ID'); }
  function rpPendek(n) { var a = Math.abs(n), s = n < 0 ? '−' : ''; return a >= 1e6 ? s + (a / 1e6).toFixed(1).replace('.', ',') + 'jt' : a >= 1000 ? s + Math.round(a / 1000) + 'rb' : s + a; }
  function angka(s) { return parseInt(String(s || '').replace(/[^\d]/g, ''), 10) || 0; }
  function desimal(s) { var v = parseFloat(String(s || '').replace(',', '.')); return isFinite(v) && v > 0 ? v : 0; }
  function km(n) { return (Math.round(n * 10) / 10).toLocaleString('id-ID') + ' km'; }
  function kunciTgl(d) { d = new Date(d); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function awalHari(d) { d = new Date(d); d.setHours(0, 0, 0, 0); return d; }
  function tambahHari(d, n) { d = new Date(d); d.setDate(d.getDate() + n); return d; }
  function senin(d) { d = awalHari(d); var g = (d.getDay() + 6) % 7; return tambahHari(d, -g); }
  function jamMenit(d) { d = new Date(d); return String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0'); }
  function untukInput(d) { d = new Date(d); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function ikon(n) { return '<svg aria-hidden="true"><use href="#' + n + '"/></svg>'; }

  // ---------- Data ----------
  function dataKosong() {
    return { versi: 1, demo: false, atur: { target: 250000, potongan: { Gojek: 20, Grab: 20, Maxim: 15 }, cepat: [12000, 18000, 25000, 35000], appCepat: 'Gojek' }, order: [], keluar: [] };
  }
  function acak(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function dataContoh() {
    var d = dataKosong(); d.demo = true;
    var r = acak(20261107), kini = new Date(), hariIni = awalHari(kini);
    var bobotJam = [0, 0, 0, 0, 0, 0, 2, 7, 8, 4, 3, 6, 8, 6, 3, 3, 5, 9, 10, 8, 5, 3, 1, 0];
    function pilihJam() { var t = 0, i, tot = bobotJam.reduce(function (a, b) { return a + b; }, 0) * r(); for (i = 0; i < 24; i++) { t += bobotJam[i]; if (t >= tot) return i; } return 18; }
    for (var h = 20; h >= 0; h--) {
      var tgl = tambahHari(hariIni, -h), dow = tgl.getDay();
      if (h > 0 && dow === 0 && r() < .6) continue; // libur sebagian Minggu
      var batasJam = h === 0 ? Math.max(kini.getHours(), 14) : 23;
      var n = h === 0 ? 11 : 9 + Math.floor(r() * 9);
      for (var i = 0; i < n; i++) {
        var jam = pilihJam(); if (jam > batasJam) jam = 7 + Math.floor(r() * (batasJam - 6));
        var w = new Date(tgl); w.setHours(jam, Math.floor(r() * 60));
        var x = r(), app = x < .48 ? 'Gojek' : x < .82 ? 'Grab' : 'Maxim';
        var lay = r() < .5 ? 0 : r() < .75 ? 1 : 2;
        var tarif = Math.round((9000 + r() * (lay === 2 ? 30000 : 21000)) / 500) * 500;
        if (jam >= 17 && jam <= 19) tarif = Math.round(tarif * 1.25 / 500) * 500;
        d.order.push({ id: id() + i + h, waktu: w.toISOString(), app: app, layanan: LAYANAN[lay], tarif: tarif, potongan: d.atur.potongan[app], tip: r() < .18 ? [2000, 3000, 5000, 10000][Math.floor(r() * 4)] : 0, km: Math.round((tarif / 2600 + r() * 2) * 10) / 10 });
      }
      function keluar(kat, j, jam, cat) { var w = new Date(tgl); w.setHours(jam, Math.floor(r() * 60)); d.keluar.push({ id: id() + kat + h, waktu: w.toISOString(), kategori: kat, jumlah: j, catatan: cat || '' }); }
      keluar('bensin', [20000, 25000, 30000][Math.floor(r() * 3)], 6, 'Pertalite');
      if (r() < .45) keluar('bensin', 20000, 15, 'Pertalite');
      keluar('makan', [13000, 15000, 18000, 22000][Math.floor(r() * 4)], 12, 'Makan siang');
      if (r() < .6) keluar('parkir', [2000, 3000][Math.floor(r() * 2)], 13);
      if (dow === 1) keluar('cicilan', 150000, 9, 'Cicilan HP mingguan');
      if (h === 9) keluar('servis', 85000, 16, 'Ganti oli + kampas rem');
    }
    return d;
  }
  var D;
  function muat() {
    var s = null; try { s = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) {}
    if (!s || !Array.isArray(s.order)) return dataContoh();
    // migrasi ringan: lengkapi field yang belum ada tanpa menghapus data lama
    var k = dataKosong();
    s.atur = Object.assign({}, k.atur, s.atur || {});
    s.atur.potongan = Object.assign({}, k.atur.potongan, s.atur.potongan || {});
    if (!Array.isArray(s.keluar)) s.keluar = [];
    s.versi = 1;
    return s;
  }
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori HP penuh'); } }

  // ---------- Hitungan ----------
  function masukOrder(o) { return o.tarif * (1 - (o.potongan || 0) / 100) + (o.tip || 0); }
  function ringkas(dari, sampai) {
    var r = { order: 0, tarif: 0, potongan: 0, tip: 0, masuk: 0, keluar: 0, km: 0, perKat: {}, perApp: {} };
    D.order.forEach(function (o) {
      var t = new Date(o.waktu); if (t < dari || t >= sampai) return;
      var m = masukOrder(o);
      r.order++; r.tarif += o.tarif; r.potongan += o.tarif * (o.potongan || 0) / 100; r.tip += o.tip || 0; r.masuk += m; r.km += o.km || 0;
      var a = r.perApp[o.app] || (r.perApp[o.app] = { masuk: 0, km: 0, order: 0 }); a.masuk += m; a.km += o.km || 0; a.order++;
    });
    D.keluar.forEach(function (k) {
      var t = new Date(k.waktu); if (t < dari || t >= sampai) return;
      r.keluar += k.jumlah; r.perKat[k.kategori] = (r.perKat[k.kategori] || 0) + k.jumlah;
    });
    r.bersih = r.masuk - r.keluar;
    r.perKm = r.km ? r.bersih / r.km : 0;
    return r;
  }

  // ---------- Animasi angka ----------
  function hitungNaik(el, nilai, fmt) {
    fmt = fmt || rp;
    var awal = parseFloat(el.dataset.v || '0'); el.dataset.v = nilai;
    if (!GERAK || awal === nilai) { el.textContent = fmt(nilai); return; }
    var t0 = performance.now(), dur = 700;
    (function langkah(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(awal + (nilai - awal) * e);
      if (p < 1) requestAnimationFrame(langkah);
    })(t0);
  }

  // ---------- Halaman: Hari ini ----------
  function renderHari() {
    var kini = new Date(), a = awalHari(kini), r = ringkas(a, tambahHari(a, 1)), tgt = D.atur.target || 1;
    $('#tglHari').textContent = HARI_P[kini.getDay()] + ', ' + kini.getDate() + ' ' + BULAN_P[kini.getMonth()];
    var j = kini.getHours();
    $('#judulHari').firstChild.textContent = (j < 11 ? 'Pagi, ' : j < 15 ? 'Siang, ' : j < 18 ? 'Sore, ' : 'Malam, ');
    hitungNaik($('#bersihHari'), r.bersih);
    $('#rincianHari').textContent = r.order + ' order · ' + km(r.km);
    hitungNaik($('#perKmHari'), r.perKm);
    hitungNaik($('#kotorHari'), r.masuk);
    hitungNaik($('#keluarHari'), r.keluar);
    var kurang = Math.max(0, tgt - r.bersih);
    $('#kurangTarget').textContent = kurang ? rp(kurang) : 'Tercapai';
    var p = Math.max(0, Math.min(1, r.bersih / tgt));
    var cin = $('#cincinTarget'); cin.classList.toggle('capai', r.bersih >= tgt);
    cin.setAttribute('aria-label', 'Progres target ' + Math.round(r.bersih / tgt * 100) + ' persen dari ' + rp(tgt));
    requestAnimationFrame(function () { $('.cincin-isi', cin).style.strokeDashoffset = 100 - p * 100; });
    hitungNaik($('#persenTarget'), Math.max(0, Math.round(r.bersih / tgt * 100)), function (v) { return Math.round(v) + '%'; });
    $('#bannerDemo').hidden = !D.demo;

    // order cepat
    $('#appCepatNama').textContent = D.atur.appCepat;
    segApp($('#appCepat'), D.atur.appCepat, function (v) { D.atur.appCepat = v; simpan(); $('#appCepatNama').textContent = v; });
    $('#chipCepat').innerHTML = D.atur.cepat.map(function (n) { return '<button class="chip" data-cepat="' + n + '">+' + rpPendek(n) + '</button>'; }).join('');

    // per km 7 hari
    var w = ringkas(tambahHari(a, -6), tambahHari(a, 1));
    hitungNaik($('#perKmMinggu'), w.perKm);
    $('#perKmKet').textContent = 'bersih ' + rp(w.bersih) + ' dari ' + km(w.km) + ' · ' + w.order + ' order';
    var maks = Math.max.apply(null, APP.map(function (x) { var q = w.perApp[x]; return q && q.km ? q.masuk / q.km : 0; }).concat([1]));
    $('#batangApp').innerHTML = '<p class="label">Kotor per km tiap aplikasi</p>' + APP.map(function (x) {
      var q = w.perApp[x] || { masuk: 0, km: 0 }, v = q.km ? q.masuk / q.km : 0;
      return '<div class="baris-app"><span><i class="titik-app" style="background:' + WARNA_APP[x] + '"></i> ' + x + '</span><div class="rel"><div class="isi-rel" style="width:' + (v / maks * 100) + '%;background:' + WARNA_APP[x] + '"></div></div><b>' + rp(v) + '</b></div>';
    }).join('');

    // log
    var item = semuaItem().filter(function (x) { return new Date(x.waktu) >= a; });
    $('#jumlahLog').textContent = item.length ? item.length + ' catatan' : '';
    $('#logHari').innerHTML = item.length ? item.map(htmlItem).join('') :
      '<li class="kosong" style="display:block">' + ikon('i-motor') + '<br>Belum ada catatan hari ini.<br>Tekan <b>Order selesai</b> setelah antar penumpang pertama.</li>';
  }
  function semuaItem() {
    return D.order.map(function (o) { return { jenis: 'order', d: o, waktu: o.waktu }; })
      .concat(D.keluar.map(function (k) { return { jenis: 'keluar', d: k, waktu: k.waktu }; }))
      .sort(function (x, y) { return new Date(y.waktu) - new Date(x.waktu); });
  }
  function htmlItem(x, i) {
    var d = x.d;
    if (x.jenis === 'order') {
      return '<li style="--i:' + Math.min(i, 12) + '" data-id="' + d.id + '"><span class="ikon-bulat order">' + ikon('i-motor') + '</span><span class="log-teks"><b><i class="titik-app" style="background:' + WARNA_APP[d.app] + '"></i> ' + esc(d.app) + ' · ' + esc(d.layanan || 'Order') + '</b><small>' + jamMenit(d.waktu) + ' · ' + km(d.km || 0) + (d.tip ? ' · tip ' + rp(d.tip) : '') + ' · tarif ' + rp(d.tarif) + '</small></span><span class="nominal plus">+' + rp(masukOrder(d)) + '</span><button class="hapus-btn" data-hapus="order" aria-label="Hapus order ' + jamMenit(d.waktu) + '">' + ikon('i-hapus') + '</button></li>';
    }
    var k = KAT[d.kategori] || KAT.lain;
    return '<li style="--i:' + Math.min(i, 12) + '" data-id="' + d.id + '"><span class="ikon-bulat keluar">' + ikon(k.ikon) + '</span><span class="log-teks"><b>' + k.nama + '</b><small>' + jamMenit(d.waktu) + (d.catatan ? ' · ' + esc(d.catatan) : '') + '</small></span><span class="nominal minus">' + rp(-d.jumlah) + '</span><button class="hapus-btn" data-hapus="keluar" aria-label="Hapus pengeluaran ' + k.nama + '">' + ikon('i-hapus') + '</button></li>';
  }

  // ---------- Halaman: Minggu ----------
  var geserMinggu = 0, hariDipilih = null;
  function renderMinggu() {
    var mulai = tambahHari(senin(new Date()), geserMinggu * 7), akhir = tambahHari(mulai, 7), r = ringkas(mulai, akhir), tgt = D.atur.target;
    var akh = tambahHari(akhir, -1);
    $('#judulMinggu').textContent = geserMinggu === 0 ? 'Minggu ini' : geserMinggu === -1 ? 'Minggu lalu' : 'Minggu ' + mulai.getDate() + ' ' + BULAN[mulai.getMonth()];
    $('#rentangMinggu').textContent = mulai.getDate() + ' ' + BULAN[mulai.getMonth()] + ' – ' + akh.getDate() + ' ' + BULAN[akh.getMonth()];
    $('[data-aksi="minggu-depan"]').disabled = geserMinggu >= 0;
    hitungNaik($('#bersihMinggu'), r.bersih);
    var hari = [], capai = 0, kiniK = kunciTgl(new Date());
    for (var i = 0; i < 7; i++) { var t = tambahHari(mulai, i), q = ringkas(t, tambahHari(t, 1)); q.tgl = t; hari.push(q); if (q.bersih >= tgt) capai++; }
    var aktif = hari.filter(function (h) { return h.order; }).length;
    $('#ketMinggu').textContent = aktif ? 'Rata-rata ' + rp(r.bersih / aktif) + ' per hari narik (' + aktif + ' hari)' : 'Belum ada order minggu ini.';
    var maks = Math.max(tgt * 1.15, Math.max.apply(null, hari.map(function (h) { return h.bersih; })), 1);
    var g = $('#grafikMinggu'); g.style.setProperty('--maks', maks);
    g.innerHTML = hari.map(function (h, i) {
      var cls = 'kolom' + (h.bersih >= tgt ? ' capai' : '') + (h.bersih < 0 ? ' minus' : '') + (kunciTgl(h.tgl) === kiniK ? ' hariini' : '');
      var tinggi = Math.max(0, h.bersih) / maks * 100;
      return '<button class="' + cls + '" style="--i:' + i + '" data-hari="' + i + '" aria-pressed="' + (hariDipilih === i) + '" aria-label="' + HARI_P[h.tgl.getDay()] + ' bersih ' + rp(h.bersih) + '">' +
        (h.order ? '<span class="nilai">' + rpPendek(h.bersih) + '</span>' : '') + '<span class="batang" style="height:' + tinggi + '%"></span><span class="hari">' + HARI[h.tgl.getDay()] + '</span></button>';
    }).join('') + '<div class="garis-tgt" style="bottom:calc(26px + (100% - 26px) * ' + (tgt / maks) + ')"><span>' + rpPendek(tgt) + '</span></div>';
    var lama = $('.tooltip-hari'); if (lama) lama.remove();
    if (hariDipilih != null) {
      var h = hari[hariDipilih];
      g.insertAdjacentHTML('afterend', '<p class="tooltip-hari"><b>' + HARI_P[h.tgl.getDay()] + ', ' + h.tgl.getDate() + ' ' + BULAN[h.tgl.getMonth()] + '</b> · ' + h.order + ' order · ' + km(h.km) + ' · masuk ' + rp(h.masuk) + ' · keluar ' + rp(h.keluar) + ' · <b>bersih ' + rp(h.bersih) + '</b></p>');
    }
    var baris = [['Tarif kotor (' + r.order + ' order)', rp(r.tarif)], ['Potongan aplikasi', rp(-r.potongan)], ['Tip pelanggan', '+' + rp(r.tip)]];
    KATEGORI.forEach(function (k) { if (r.perKat[k.id]) baris.push([k.nama, rp(-r.perKat[k.id])]); });
    $('#rincianMinggu').innerHTML = baris.map(function (b, i) { return '<div style="--i:' + i + '"><dt>' + b[0] + '</dt><dd>' + b[1] + '</dd></div>'; }).join('') +
      '<div class="total" style="--i:' + baris.length + '"><dt>Untung bersih</dt><dd>' + rp(r.bersih) + '</dd></div>';
    $('#mOrder').textContent = r.order; $('#mKm').textContent = km(r.km); $('#mPerKm').textContent = rp(r.perKm); $('#mTarget').textContent = capai + '/7';
  }

  // ---------- Halaman: Jam cuan ----------
  var JAM_AWAL = 5, JAM_N = 18;
  function renderJam() {
    var akhir = tambahHari(awalHari(new Date()), 1), mulai = tambahHari(akhir, -28);
    var perJam = new Array(24).fill(0), hariNarik = {}, peta = [];
    for (var d = 0; d < 7; d++) peta.push(new Array(24).fill(0));
    var hitDow = [0, 0, 0, 0, 0, 0, 0];
    D.order.forEach(function (o) {
      var t = new Date(o.waktu); if (t < mulai || t >= akhir) return;
      var m = masukOrder(o); perJam[t.getHours()] += m; peta[t.getDay()][t.getHours()] += m;
      var k = kunciTgl(t); if (!hariNarik[k]) { hariNarik[k] = 1; hitDow[t.getDay()]++; }
    });
    var nHari = Object.keys(hariNarik).length || 1;
    var rata = perJam.map(function (v) { return v / nHari; });
    var urut = rata.map(function (v, j) { return [v, j]; }).filter(function (x) { return x[0] > 0; }).sort(function (a, b) { return b[0] - a[0]; });
    var top = urut.slice(0, 3).map(function (x) { return x[1]; });
    var jj = $('#juaraJam');
    if (!urut.length) {
      jj.innerHTML = '<p class="label">Jam paling cuan</p><p class="juara-jam">—</p><p class="kecil">Catat beberapa order dulu, nanti kelihatan jam mana yang paling menghasilkan.</p>';
    } else {
      var b = top[0];
      jj.innerHTML = '<p class="label">Jam paling cuan</p><p class="juara-jam">' + String(b).padStart(2, '0') + '.00–' + String(b + 1).padStart(2, '0') + '.00</p><p class="kecil">Rata-rata ' + rp(rata[b]) + ' masuk di jam ini setiap hari narik (' + nHari + ' hari).</p>' +
        '<div class="juara-list">' + top.map(function (j, i) { return '<div style="--i:' + i + '"><span class="label">' + ikon('i-api') + ' #' + (i + 1) + '</span><b>' + String(j).padStart(2, '0') + '.00</b><span class="kecil">' + rpPendek(rata[j]) + '/hari</span></div>'; }).join('') + '</div>';
    }
    var maks = Math.max.apply(null, rata.concat([1]));
    var h = '';
    for (var j = JAM_AWAL; j < JAM_AWAL + JAM_N; j++) {
      h += '<div class="kol' + (top.indexOf(j) > -1 ? ' top' : '') + '" style="--i:' + (j - JAM_AWAL) + '" title="' + String(j).padStart(2, '0') + '.00 · ' + rp(rata[j]) + '"><span class="bt" style="height:' + (rata[j] / maks * 100) + '%"></span>' + (j % 3 === 0 ? '<span class="jm">' + j + '</span>' : '') + '</div>';
    }
    $('#grafikJam').innerHTML = h;
    $('#grafikJam').setAttribute('aria-label', 'Grafik pendapatan per jam. Terbaik: ' + top.map(function (j) { return j + '.00'; }).join(', '));
    var mp = 1; peta.forEach(function (r, d) { r.forEach(function (v) { mp = Math.max(mp, v / (hitDow[d] || 1)); }); });
    var p = '<span></span>';
    for (j = JAM_AWAL; j < JAM_AWAL + JAM_N; j++) p += '<span class="lbl-jam">' + (j % 2 === 1 ? j : '') + '</span>';
    var n = 0;
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      p += '<span class="lbl">' + HARI[d] + '</span>';
      for (var j = JAM_AWAL; j < JAM_AWAL + JAM_N; j++) {
        var v = peta[d][j] / (hitDow[d] || 1) / mp;
        p += '<span class="sel" style="--v:' + v.toFixed(3) + ';--i:' + (n++) + '" title="' + HARI_P[d] + ' ' + j + '.00 · ' + rp(peta[d][j] / (hitDow[d] || 1)) + '"></span>';
      }
    });
    $('#petaPanas').innerHTML = p;
  }

  // ---------- Halaman: Riwayat ----------
  var filterR = 'semua', batasR = 10;
  function renderRiwayat() {
    var item = semuaItem().filter(function (x) { return filterR === 'semua' || x.jenis === filterR; });
    var grup = {}, urutan = [];
    item.forEach(function (x) { var k = kunciTgl(x.waktu); if (!grup[k]) { grup[k] = []; urutan.push(k); } grup[k].push(x); });
    var tampil = urutan.slice(0, batasR);
    var el = $('#daftarRiwayat');
    if (!tampil.length) { el.innerHTML = '<div class="kartu kosong">' + ikon('i-daftar') + '<br>Belum ada catatan.</div>'; return; }
    el.innerHTML = tampil.map(function (k, gi) {
      var t = new Date(k + 'T00:00'), r = ringkas(t, tambahHari(t, 1));
      return '<section class="grup" style="--i:' + Math.min(gi, 8) + '"><div class="grup-kepala"><span>' + HARI_P[t.getDay()] + ', ' + t.getDate() + ' ' + BULAN[t.getMonth()] + '</span><span class="' + (r.bersih < 0 ? 'minus' : '') + '">' + rp(r.bersih) + '</span></div><ul>' + grup[k].map(htmlItem).join('') + '</ul></section>';
    }).join('') + (urutan.length > batasR ? '<button class="tombol lagi" data-aksi="lagi">Tampilkan hari sebelumnya</button>' : '');
  }

  // ---------- Halaman: Atur ----------
  function renderAtur() {
    $('#aTarget').value = D.atur.target.toLocaleString('id-ID');
    APP.forEach(function (a) { $('#p' + a).value = D.atur.potongan[a]; });
    $('#aCepat').value = D.atur.cepat.join(', ');
  }

  // ---------- Navigasi ----------
  var halAktif = 'hari';
  var RENDER = { hari: renderHari, minggu: renderMinggu, jam: renderJam, riwayat: renderRiwayat, atur: renderAtur };
  function buka(h, dariRiwayat) {
    if (!RENDER[h]) h = 'hari';
    halAktif = h;
    $$('.hal').forEach(function (s) { var on = s.id === 'hal-' + h; s.hidden = !on; s.classList.toggle('aktif', on); });
    $$('.menu-btn').forEach(function (b) { var on = b.dataset.hal === h; b.classList.toggle('aktif', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    RENDER[h]();
    if (!dariRiwayat) { try { history.replaceState(null, '', location.pathname + location.search + '#' + h); } catch (e) {} }
    window.scrollTo(0, 0);
  }
  function renderUlang() { RENDER[halAktif](); }

  // ---------- Logo & foto profil (path di KONFIG) ----------
  var KUNCI_FOTO = 'catatan-ojol-foto';
  function inisial() { var n = (window.TEMA && TEMA.nama) || 'Catatan Ojol'; return n.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
  function gantiInisial(img) {
    var s = document.createElement('span'); s.className = img.className + ' inisial'; s.textContent = inisial(); s.setAttribute('aria-hidden', 'true');
    if (img.hasAttribute('data-avatar')) s.setAttribute('data-avatar', '');
    img.replaceWith(s);
  }
  function pasangGambar() {
    var foto = null; try { foto = localStorage.getItem(KUNCI_FOTO); } catch (e) {}
    $$('img[data-logo]').forEach(function (i) { i.onerror = function () { gantiInisial(i); }; i.src = KONFIG.logo; });
    $$('img[data-avatar]').forEach(function (i) { i.onerror = function () { gantiInisial(i); }; i.src = foto || KONFIG.avatar; });
  }
  function kecilkan(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var k = Math.min(1, 400 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.82));
      };
      im.onerror = function () { toast('Berkas bukan gambar'); };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  }
  document.addEventListener('change', function (e) {
    if (e.target.id !== 'aFoto' || !e.target.files[0]) return;
    kecilkan(e.target.files[0], function (u) {
      try { localStorage.setItem(KUNCI_FOTO, u); toast('Foto profil disimpan'); } catch (er) { toast('Gagal menyimpan foto'); }
      pasangGambar();
    });
    e.target.value = '';
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('#hapusFoto')) return;
    try { localStorage.setItem(KUNCI_FOTO, ''); } catch (er) {}
    toast('Foto profil dihapus'); pasangGambar();
  });
  pasangGambar();

  // ---------- Komponen kecil ----------
  function segApp(el, nilai, ubah) {
    el.innerHTML = APP.map(function (a) { return '<button type="button" role="radio" aria-checked="' + (a === nilai) + '" data-v="' + a + '"><i class="titik-app" style="background:' + WARNA_APP[a] + '"></i>' + a + '</button>'; }).join('');
    el.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(function (x) { x.setAttribute('aria-checked', x === b); }); ubah(b.dataset.v); };
  }
  function segTeks(el, opsi, nilai, ubah) {
    el.innerHTML = opsi.map(function (a) { return '<button type="button" role="radio" aria-checked="' + (a === nilai) + '" data-v="' + a + '">' + a + '</button>'; }).join('');
    el.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(function (x) { x.setAttribute('aria-checked', x === b); }); ubah(b.dataset.v); };
  }
  var tToast;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('tampil'); clearTimeout(tToast); tToast = setTimeout(function () { el.classList.remove('tampil'); }, 2400); }
  function formatRpInput(inp) {
    inp.addEventListener('input', function () { var v = angka(inp.value); inp.value = v ? v.toLocaleString('id-ID') : ''; inp.removeAttribute('aria-invalid'); });
  }
  function bukaDlg(d) { d.classList.remove('tutup'); d.showModal(); }
  function tutupDlg(d) {
    if (!d.open) return;
    if (!GERAK) { d.close(); return; }
    d.classList.add('tutup');
    setTimeout(function () { d.classList.remove('tutup'); d.close(); }, 260);
  }
  $$('dialog').forEach(function (d) {
    d.addEventListener('cancel', function (e) { e.preventDefault(); tutupDlg(d); });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-tutup]')) tutupDlg(d); });
  });
  function yakin(teks, lanjut) {
    var d = $('#dlgYakin'); $('#yakinTeks').textContent = teks; d.returnValue = '';
    d.onclose = function () { if (d.returnValue === 'ya') lanjut(); };
    d.showModal();
  }

  // ---------- Form order ----------
  var fo = { app: 'Gojek', layanan: LAYANAN[0] };
  function bukaOrder(tarifAwal) {
    fo.app = D.atur.appCepat; fo.layanan = LAYANAN[0];
    segApp($('#oApp'), fo.app, function (v) { fo.app = v; pratinjauOrder(); });
    segTeks($('#oLayanan'), LAYANAN, fo.layanan, function (v) { fo.layanan = v; });
    $('#oTarif').value = tarifAwal ? tarifAwal.toLocaleString('id-ID') : '';
    $('#oKm').value = ''; $('#oTip').value = ''; $('#oGalat').textContent = '';
    $('#oWaktu').value = untukInput(new Date());
    $('#oChip').innerHTML = D.atur.cepat.map(function (n) { return '<button type="button" class="chip" data-isi="' + n + '">' + rpPendek(n) + '</button>'; }).join('');
    pratinjauOrder(); bukaDlg($('#dlgOrder'));
    setTimeout(function () { $('#oTarif').focus(); }, 60);
  }
  function pratinjauOrder() {
    var t = angka($('#oTarif').value), pot = D.atur.potongan[fo.app] || 0, tip = angka($('#oTip').value);
    $('#oPratinjau').textContent = rp(t * (1 - pot / 100) + tip);
    $('#oPotKet').textContent = 'Tarif ' + rp(t) + ' − potongan ' + fo.app + ' ' + pot + '%' + (tip ? ' + tip ' + rp(tip) : '');
    $$('#oChip .chip').forEach(function (c) { c.classList.toggle('dipilih', +c.dataset.isi === t); });
  }
  formatRpInput($('#oTarif')); formatRpInput($('#oTip'));
  ['#oTarif', '#oTip'].forEach(function (s) { $(s).addEventListener('input', pratinjauOrder); });
  $('#oChip').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; $('#oTarif').value = (+c.dataset.isi).toLocaleString('id-ID'); $('#oTarif').removeAttribute('aria-invalid'); pratinjauOrder(); });
  $('#formOrder').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = angka($('#oTarif').value);
    if (!t) { $('#oGalat').textContent = 'Isi tarif dulu ya, minimal Rp1.000.'; $('#oTarif').setAttribute('aria-invalid', 'true'); $('#oTarif').focus(); return; }
    if (t > 5000000) { $('#oGalat').textContent = 'Tarif kebesaran, cek lagi angkanya.'; $('#oTarif').setAttribute('aria-invalid', 'true'); return; }
    var w = $('#oWaktu').value ? new Date($('#oWaktu').value) : new Date();
    var o = { id: id(), waktu: (isNaN(w) ? new Date() : w).toISOString(), app: fo.app, layanan: fo.layanan, tarif: t, potongan: D.atur.potongan[fo.app] || 0, tip: angka($('#oTip').value), km: desimal($('#oKm').value) };
    D.order.push(o); simpan(); tutupDlg($('#dlgOrder'));
    toast('Order tercatat: +' + rp(masukOrder(o)));
    renderUlang();
  });

  // ---------- Form pengeluaran ----------
  var fk = 'bensin';
  function bukaKeluar() {
    fk = 'bensin';
    $('#kKategori').innerHTML = KATEGORI.map(function (k) { return '<button type="button" role="radio" aria-checked="' + (k.id === fk) + '" data-k="' + k.id + '">' + ikon(k.ikon) + k.nama + '</button>'; }).join('');
    $('#kJumlah').value = ''; $('#kCatatan').value = ''; $('#kGalat').textContent = ''; $('#kWaktu').value = untukInput(new Date());
    chipKeluar(); bukaDlg($('#dlgKeluar'));
  }
  function chipKeluar() { $('#kChip').innerHTML = KAT[fk].cepat.map(function (n) { return '<button type="button" class="chip" data-isi="' + n + '">' + rpPendek(n) + '</button>'; }).join(''); }
  formatRpInput($('#kJumlah'));
  $('#kKategori').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; fk = b.dataset.k; $$('#kKategori button').forEach(function (x) { x.setAttribute('aria-checked', x === b); }); chipKeluar(); });
  $('#kChip').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; $('#kJumlah').value = (+c.dataset.isi).toLocaleString('id-ID'); $('#kJumlah').removeAttribute('aria-invalid'); });
  $('#formKeluar').addEventListener('submit', function (e) {
    e.preventDefault();
    var j = angka($('#kJumlah').value);
    if (!j) { $('#kGalat').textContent = 'Isi jumlah pengeluarannya dulu.'; $('#kJumlah').setAttribute('aria-invalid', 'true'); $('#kJumlah').focus(); return; }
    var w = $('#kWaktu').value ? new Date($('#kWaktu').value) : new Date();
    D.keluar.push({ id: id(), waktu: (isNaN(w) ? new Date() : w).toISOString(), kategori: fk, jumlah: j, catatan: $('#kCatatan').value.trim().slice(0, 60) });
    simpan(); tutupDlg($('#dlgKeluar')); toast(KAT[fk].nama + ' tercatat: ' + rp(-j)); renderUlang();
  });

  // ---------- Ekspor / backup ----------
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csv() {
    var q = function (v) { v = String(v == null ? '' : v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var b = [['tanggal', 'jam', 'jenis', 'aplikasi/kategori', 'layanan/catatan', 'tarif', 'potongan_persen', 'tip', 'km', 'masuk_bersih', 'keluar'].join(';')];
    semuaItem().reverse().forEach(function (x) {
      var d = x.d, t = new Date(x.waktu);
      if (x.jenis === 'order') b.push([kunciTgl(t), jamMenit(t), 'order', d.app, d.layanan, d.tarif, d.potongan, d.tip || 0, String(d.km || 0).replace('.', ','), Math.round(masukOrder(d)), 0].map(q).join(';'));
      else b.push([kunciTgl(t), jamMenit(t), 'pengeluaran', (KAT[d.kategori] || KAT.lain).nama, d.catatan, '', '', '', '', 0, d.jumlah].map(q).join(';'));
    });
    unduh('catatan-ojol-' + kunciTgl(new Date()) + '.csv', '﻿' + b.join('\n'), 'text/csv;charset=utf-8');
    toast('CSV diunduh, buka pakai Excel/Sheets');
  }
  $('#filePulih').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var s = JSON.parse(r.result);
        if (!s || !Array.isArray(s.order) || !Array.isArray(s.keluar)) throw 0;
        yakin('Data sekarang akan diganti isi backup (' + s.order.length + ' order, ' + s.keluar.length + ' pengeluaran).', function () {
          localStorage.setItem(KUNCI, JSON.stringify(s)); D = muat(); D.demo = false; simpan(); toast('Backup dipulihkan'); buka('hari');
        });
        $('#yakinYa').textContent = 'Ya, pulihkan';
      } catch (e) { toast('Berkas bukan backup Catatan Ojol'); }
    };
    r.readAsText(f); this.value = '';
  });
  $('#labelPulih').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#filePulih').click(); } });

  // ---------- Pengaturan ----------
  formatRpInput($('#aTarget'));
  $('#formAtur').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = angka($('#aTarget').value);
    if (t < 10000) { $('#aTarget').setAttribute('aria-invalid', 'true'); toast('Target minimal Rp10.000'); return; }
    D.atur.target = t;
    APP.forEach(function (a) { var v = parseFloat($('#p' + a).value); D.atur.potongan[a] = isFinite(v) ? Math.min(50, Math.max(0, v)) : D.atur.potongan[a]; });
    var c = $('#aCepat').value.split(/[,;\s]+/).map(angka).filter(function (n) { return n >= 1000; }).slice(0, 6);
    if (c.length) D.atur.cepat = c;
    simpan(); renderAtur(); toast('Pengaturan disimpan');
  });

  // ---------- Mode terang/gelap ----------
  function setMode(m, simpanPilihan) {
    document.documentElement.setAttribute('data-mode', m);
    hitungTeksBagian();
    if (simpanPilihan) { try { localStorage.setItem(KUNCI_MODE, m); } catch (e) {} }
    var ke = m === 'gelap' ? 'terang' : 'gelap';
    $$('#gantiMode, #gantiModeHp').forEach(function (b) { b.querySelector('use').setAttribute('href', ke === 'terang' ? '#i-matahari' : '#i-bulan'); b.setAttribute('aria-label', 'Ganti ke mode ' + ke); });
    $('#gantiMode span').textContent = 'Mode ' + ke;
    var mt = $('meta[name="theme-color"]'); if (mt) mt.content = m === 'gelap' ? '#0e100f' : '#ffffff';
  }
  $$('#gantiMode, #gantiModeHp').forEach(function (b) { b.addEventListener('click', function () { setMode(document.documentElement.getAttribute('data-mode') === 'gelap' ? 'terang' : 'gelap', true); }); });

  // ---------- Klik global ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-hal],[data-aksi],[data-cepat],[data-hapus],[data-hari],#filterRiwayat button');
    if (!t) return;
    if (t.dataset.hal) return buka(t.dataset.hal);
    if (t.dataset.cepat) {
      var n = +t.dataset.cepat, app = D.atur.appCepat;
      var o = { id: id(), waktu: new Date().toISOString(), app: app, layanan: LAYANAN[0], tarif: n, potongan: D.atur.potongan[app] || 0, tip: 0, km: Math.round(n / 2600 * 10) / 10 };
      D.order.push(o); simpan();
      t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
      toast(app + ' +' + rp(masukOrder(o)) + ' (km perkiraan, ubah di Riwayat bila perlu)');
      return renderHari();
    }
    if (t.dataset.hapus) {
      var li = t.closest('li'), daftar = t.dataset.hapus === 'order' ? D.order : D.keluar, idx = daftar.findIndex(function (x) { return x.id === li.dataset.id; });
      if (idx < 0) return;
      var buang = daftar.splice(idx, 1)[0]; simpan();
      li.classList.add('li-keluar');
      setTimeout(renderUlang, GERAK ? 280 : 0);
      toastUrung(t.dataset.hapus, buang);
      return;
    }
    if (t.dataset.hari != null) { var i = +t.dataset.hari; hariDipilih = hariDipilih === i ? null : i; return renderMinggu(); }
    if (t.dataset.f) {
      filterR = t.dataset.f; batasR = 10;
      $$('#filterRiwayat button').forEach(function (b) { b.setAttribute('aria-checked', b === t); });
      return renderRiwayat();
    }
    switch (t.dataset.aksi) {
      case 'order': return bukaOrder();
      case 'keluar': return bukaKeluar();
      case 'minggu-lalu': geserMinggu--; hariDipilih = null; return renderMinggu();
      case 'minggu-depan': if (geserMinggu < 0) geserMinggu++; hariDipilih = null; return renderMinggu();
      case 'lagi': batasR += 10; return renderRiwayat();
      case 'csv': return csv();
      case 'backup': unduh('backup-catatan-ojol-' + kunciTgl(new Date()) + '.json', JSON.stringify(D, null, 1), 'application/json'); return toast('Backup diunduh. Simpan baik-baik');
      case 'isi-demo':
        $('#yakinYa').textContent = 'Ya, ganti';
        return yakin('Data sekarang diganti data contoh 3 minggu.', function () { D = dataContoh(); simpan(); toast('Data contoh dimuat'); buka('hari'); });
      case 'hapus-demo':
        $('#yakinYa').textContent = 'Ya, kosongkan';
        return yakin('Data contoh dihapus dan catatan dimulai dari nol. Pengaturan tetap.', function () { var a = D.atur; D = dataKosong(); D.atur = a; simpan(); renderUlang(); toast('Siap! Catatan mulai dari nol'); });
      case 'hapus-semua':
        $('#yakinYa').textContent = 'Ya, hapus';
        return yakin('Semua order dan pengeluaran dihapus permanen dari HP ini. Backup dulu kalau ragu.', function () { D = dataKosong(); simpan(); toast('Semua data dihapus'); buka('hari'); });
    }
  });
  var urung = null;
  function toastUrung(jenis, item) {
    urung = { jenis: jenis, item: item };
    var el = $('#toast'); el.innerHTML = 'Catatan dihapus. ';
    var b = document.createElement('button'); b.textContent = 'Urungkan'; b.className = 'tautan'; b.style.cssText = 'color:inherit;min-height:32px';
    el.appendChild(b); el.style.pointerEvents = 'auto'; el.classList.add('tampil');
    b.onclick = function () { if (!urung) return; (urung.jenis === 'order' ? D.order : D.keluar).push(urung.item); urung = null; simpan(); renderUlang(); toast('Dikembalikan'); el.style.pointerEvents = ''; };
    clearTimeout(tToast); tToast = setTimeout(function () { el.classList.remove('tampil'); el.style.pointerEvents = ''; urung = null; }, 4500);
  }

  // ---------- Tema (customizer Maliki Studio) ----------
  var FONT_OK = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  function terapkanTema(t) {
    var st = document.documentElement.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama);
    if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null && t.radius !== '') st.setProperty('--tema-radius', /px$/.test(t.radius) ? t.radius : t.radius + 'px');
    if (t.font && FONT_OK.indexOf(t.font) > -1) {
      st.setProperty('--tema-font', '"' + t.font + '", system-ui, sans-serif');
      $('#fontTema').href = 'https://fonts.googleapis.com/css2?family=' + t.font.replace(/ /g, '+') + ':wght@400;500;600;700&display=swap';
    }
    if (t.mode) { var m = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode; setMode(m, false); }
    if (t.bagian) terapkanBagian(t.bagian);
    if (t.nama) $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; });
    setTimeout(hitungTeksBagian, 30);
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  var PETA_BAGIAN = {
    nav: '.nav',
    latar: 'body, .isi',
    panel: '.kartu:not(.kartu-hero):not(.kartu-juara), .lembar, .konfirmasi, .riwayat .grup',
    utama: '.tombol-besar.utama, .tombol.utama, .menu-btn.aktif, .angka-raksasa',
    aksen: '.cincin, .grafik .garis-tgt, .grafik-jam .kol.top, .peta, .banner',
    teks: 'h1, h2, .angka-besar'
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
    return L > 0.4 ? '#121712' : '#ffffff';
  }
  function hitungTeksBagian() {
    var st = document.documentElement.style;
    st.setProperty('--tema-nav-teks', teksUntuk('--nav'));
    st.setProperty('--utama-teks', teksUntuk('--utama'));
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

  // ---------- Mulai ----------
  D = muat();
  if (/[?&]demo\b/.test(location.search) && !D.order.length) D = dataContoh();
  if (window.TEMA && TEMA.nama) $$('[data-tema-nama]').forEach(function (e) { e.textContent = TEMA.nama; });
  setMode(document.documentElement.getAttribute('data-mode'), false);
  var awal = (location.hash || '').slice(1);
  buka(RENDER[awal] ? awal : 'hari', true);
  tandaiBagian(); hitungTeksBagian();
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (RENDER[h] && h !== halAktif) buka(h, true); });
  // ganti hari otomatis lewat tengah malam
  var hariTerakhir = kunciTgl(new Date());
  setInterval(function () { var k = kunciTgl(new Date()); if (k !== hariTerakhir) { hariTerakhir = k; renderUlang(); } }, 60000);
})();
