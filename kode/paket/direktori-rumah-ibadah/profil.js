/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Halaman profil rumah ibadah ("Jadikan website"): satu tempat jadi website sendiri.
   Buka lewat index.html?tempat=<id> atau tombol "Jadikan website" di detail.
   Dimuat SEBELUM app.js; app.js mengisi window.DIR (data & utilitas) lalu memanggil PROFIL.buka(). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var rp = function (n) { return 'Rp' + Math.round(+n || 0).toLocaleString('id-ID'); };
  var kurangGerak = function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; };

  // ================= Jadwal sholat (hitung lokal, tanpa API) =================
  // Rumus posisi matahari sederhana (algoritma umum ala praytimes.org), parameter Kemenag RI:
  // Subuh −20°, Isya −18°, Asar mazhab Syafi'i (bayangan 1×), Maghrib saat matahari terbenam (−0,833°),
  // ihtiyat +2 menit (Terbit −2), Imsak = Subuh − 10 menit. Selisih dengan jadwal resmi biasanya ≤ 2 menit;
  // pengurus bisa menambah koreksi menit per waktu di "Edit profil".
  var RAD = Math.PI / 180;
  var sin = function (d) { return Math.sin(d * RAD); }, cos = function (d) { return Math.cos(d * RAD); }, tan = function (d) { return Math.tan(d * RAD); };
  var asin = function (x) { return Math.asin(x) / RAD; }, acos = function (x) { return Math.acos(Math.max(-1, Math.min(1, x))) / RAD; };
  var atan2 = function (y, x) { return Math.atan2(y, x) / RAD; }, acot = function (x) { return Math.atan(1 / x) / RAD; };
  var fix = function (a, b) { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function posMatahari(jd) {
    var D = jd - 2451545.0, g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360), e = 23.439 - 0.00000036 * D;
    var RA = atan2(cos(e) * sin(L), cos(L)) / 15;
    return { dek: asin(sin(e) * sin(L)), eqt: q / 15 - fix(RA, 24) };
  }
  var URUT_WAKTU = ['imsak', 'subuh', 'terbit', 'dzuhur', 'asar', 'maghrib', 'isya'];
  var NAMA_WAKTU = { imsak: 'Imsak', subuh: 'Subuh', terbit: 'Terbit', dzuhur: 'Dzuhur', asar: 'Asar', maghrib: 'Maghrib', isya: 'Isya' };
  var WAJIB = ['subuh', 'dzuhur', 'asar', 'maghrib', 'isya'];
  /** @returns {object} menit sejak tengah malam (waktu setempat zona) untuk tiap waktu */
  function hitungJadwal(y, m, d, lat, lng, zona, koreksi) {
    var jd = julian(y, m, d) - lng / (15 * 24);
    var tengah = function (t) { return fix(12 - posMatahari(jd + t).eqt, 24); };
    var sudut = function (a, t, pagi) {
      var dk = posMatahari(jd + t).dek, n = tengah(t);
      var T = acos((-sin(a) - sin(dk) * sin(lat)) / (cos(dk) * cos(lat))) / 15;
      return n + (pagi ? -T : T);
    };
    var asar = function (t) { var dk = posMatahari(jd + t).dek; return sudut(-acot(1 + tan(Math.abs(lat - dk))), t); };
    var j = { subuh: sudut(20, 5 / 24, true), terbit: sudut(0.833, 6 / 24, true), dzuhur: tengah(12 / 24), asar: asar(13 / 24), maghrib: sudut(0.833, 18 / 24), isya: sudut(18, 18 / 24) };
    // putaran kedua memakai tebakan putaran pertama supaya lebih teliti
    j = { subuh: sudut(20, j.subuh / 24, true), terbit: sudut(0.833, j.terbit / 24, true), dzuhur: tengah(j.dzuhur / 24), asar: asar(j.asar / 24), maghrib: sudut(0.833, j.maghrib / 24), isya: sudut(18, j.isya / 24) };
    var ih = { subuh: 2, terbit: -2, dzuhur: 2, asar: 2, maghrib: 2, isya: 2 }, h = {};
    Object.keys(j).forEach(function (k) { h[k] = Math.round((j[k] + zona - lng / 15) * 60) + ih[k] + ((koreksi && +koreksi[k]) || 0); });
    h.imsak = h.subuh - 10 + ((koreksi && +koreksi.imsak) || 0);
    return h;
  }
  var jamMenit = function (mnt) { mnt = fix(Math.round(mnt), 1440); return String(Math.floor(mnt / 60)).padStart(2, '0') + ':' + String(mnt % 60).padStart(2, '0'); };
  var zonaDari = function (lng) { return lng >= 127.5 ? 9 : lng >= 114.5 ? 8 : 7; }; // perkiraan WIB/WITA/WIT dari bujur
  var NAMA_ZONA = { 7: 'WIB', 8: 'WITA', 9: 'WIT' };
  /** "Sekarang" di zona tempat: objek Date yang nilai UTC-nya = jam dinding setempat */
  var kiniZona = function (zona) { return new Date(Date.now() + zona * 36e5); };
  window.JADWAL_SHOLAT = { hitung: hitungJadwal, jamMenit: jamMenit }; // bisa dipakai/diuji dari konsol

  // ================= Data profil =================
  function profilKosong(p) {
    var masjid = p.jenis === 'masjid' || p.jenis === 'musala';
    return {
      tagline: masjid ? 'Rumah ibadah, rumah belajar, rumah bersama' : 'Terbuka untuk umat dan warga sekitar',
      sambutan: '', pengumuman: [], kegiatan: [], kas: { saldoAwal: 0, transaksi: [] },
      rekening: [], qris: true, galeri: ['Tampak depan', 'Ruang utama', 'Serambi', 'Halaman', 'Kegiatan umat', 'Senja di sini'],
      koreksi: {}, zona: zonaDari(p.lng), email: '', diperbarui: Date.now(),
      logo: '', fotoHero: '', fotoGaleri: [] // unggahan pengurus: dataURL ≤400px (lihat GAMBAR di bawah)
    };
  }
  function normalProfil(p) {
    var k = profilKosong(p);
    if (!p.profil || typeof p.profil !== 'object') p.profil = k;
    Object.keys(k).forEach(function (x) { if (p.profil[x] === undefined) p.profil[x] = k[x]; });
    if (!p.profil.kas || !Array.isArray(p.profil.kas.transaksi)) p.profil.kas = k.kas;
    ['pengumuman', 'kegiatan', 'rekening', 'galeri', 'fotoGaleri'].forEach(function (x) { if (!Array.isArray(p.profil[x])) p.profil[x] = k[x]; });
    return p.profil;
  }
  /** Profil contoh Masjid Thoriqussalam (dipanggil dataContoh() di app.js). Semua nama, nomor & angka fiktif. */
  function contoh(p) {
    var hari = function (n) { var d = new Date(Date.now() - n * 864e5); return d.toISOString().slice(0, 10); };
    var pr = profilKosong(p);
    pr.tagline = 'Memakmurkan masjid, menguatkan jamaah';
    pr.sambutan = 'Assalamu\'alaikum warahmatullah. Selamat datang di website Masjid Thoriqussalam. Di sini jamaah bisa melihat jadwal sholat, kajian pekan ini, pengumuman, dan laporan infak yang kami perbarui tiap pekan secara terbuka.';
    pr.pengumuman = [
      { judul: 'Kerja bakti bersih masjid', isi: 'Ahad pagi pukul 07.00. Bawa sapu dan lap, sarapan disediakan remaja masjid.', t: Date.now() - 864e5 },
      { judul: 'Pendaftaran TPA gelombang 2', isi: 'Untuk anak usia 5–12 tahun, gratis. Daftar ke sekretariat setelah Asar.', t: Date.now() - 864e5 * 3 },
      { judul: 'Renovasi tempat wudu putri', isi: 'Selama pekerjaan, wudu putri sementara di sisi utara. Mohon maaf atas ketidaknyamanannya.', t: Date.now() - 864e5 * 6 }
    ];
    pr.kegiatan = [
      { hari: 'Senin', jam: 'Ba\'da Maghrib', judul: 'Tahsin Al-Qur\'an dewasa', pemateri: 'Ust. Hanif Ramadhan' },
      { hari: 'Rabu', jam: 'Ba\'da Isya', judul: 'Kajian fikih ibadah sehari-hari', pemateri: 'Ust. Fajar Hidayat' },
      { hari: 'Jumat', jam: '11.45', judul: 'Khutbah & sholat Jumat', pemateri: 'Khatib bergilir' },
      { hari: 'Sabtu', jam: '16.00', judul: 'TPA anak & hafalan juz 30', pemateri: 'Tim pengajar TPA' },
      { hari: 'Ahad', jam: 'Ba\'da Subuh', judul: 'Kajian tafsir pekanan', pemateri: 'Ust. Abdul Karim' }
    ];
    pr.kas = { saldoAwal: 18450000, transaksi: [
      { tgl: hari(2), ket: 'Infak kotak Jumat', masuk: 3275000, keluar: 0 },
      { tgl: hari(4), ket: 'Listrik & air bulan ini', masuk: 0, keluar: 1180000 },
      { tgl: hari(6), ket: 'Transfer donatur (hamba Allah)', masuk: 2000000, keluar: 0 },
      { tgl: hari(9), ket: 'Infak kotak Jumat', masuk: 2940000, keluar: 0 },
      { tgl: hari(11), ket: 'Honor guru TPA', masuk: 0, keluar: 1500000 },
      { tgl: hari(16), ket: 'Infak kotak Jumat', masuk: 3110000, keluar: 0 },
      { tgl: hari(20), ket: 'Material renovasi wudu putri', masuk: 0, keluar: 4250000 },
      { tgl: hari(34), ket: 'Infak bulanan jamaah', masuk: 5600000, keluar: 0 },
      { tgl: hari(40), ket: 'Kebersihan & perawatan', masuk: 0, keluar: 950000 },
      { tgl: hari(63), ket: 'Infak bulanan jamaah', masuk: 5120000, keluar: 0 },
      { tgl: hari(70), ket: 'Konsumsi kajian', masuk: 0, keluar: 780000 }
    ] };
    pr.rekening = [{ bank: 'Bank Syariah Contoh', no: '7123 4567 89', an: 'DKM Masjid Thoriqussalam' }];
    pr.galeri = ['Tampak depan', 'Ruang sholat utama', 'Serambi timur', 'Halaman & taman', 'Kajian Ahad pagi', 'Senja di menara'];
    pr.email = 'dkm.thoriqussalam@contoh.id';
    return pr;
  }

  // ================= Ilustrasi SVG =================
  function heroSVG(j) {
    var bintang = [[60, 50, 1.6], [130, 90, 1.2], [210, 40, 1.8], [420, 34, 1.3], [560, 110, 1.5], [470, 140, 1], [30, 150, 1.1], [340, 24, 1]]
      .map(function (b, i) { return '<circle class="bintang" style="--d:' + (i * 0.37).toFixed(2) + 's" cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '"/>'; }).join('');
    var bulan = '<path class="bulan" d="M512 52a26 26 0 1 0 22 40 22 22 0 1 1-22-40z"/>';
    var tanah = '<path class="bukit-b" d="M0 330c90-26 170-30 260-16s170 14 340-14v80H0z"/><path class="bukit-d" d="M0 352c120-18 230-16 330-6s180 6 270-6v40H0z"/>';
    if (j === 'masjid' || j === 'musala') {
      var menara = function (x) {
        return '<g class="menara"><rect x="' + x + '" y="150" width="26" height="182" rx="2"/><rect class="sabuk" x="' + (x - 6) + '" y="148" width="38" height="8" rx="2"/><rect class="sabuk" x="' + (x - 3) + '" y="232" width="32" height="6" rx="2"/>' +
          '<path d="M' + x + ' 148c0-20 13-28 13-44 0 16 13 24 13 44z"/><path class="jendela" d="M' + (x + 8) + ' 200v-12a5 5 0 0 1 10 0v12zM' + (x + 8) + ' 280v-12a5 5 0 0 1 10 0v12z"/><line class="ujung" x1="' + (x + 13) + '" y1="104" x2="' + (x + 13) + '" y2="90"/></g>';
      };
      return '<svg class="hero-ilu" viewBox="0 0 600 380" aria-hidden="true" preserveAspectRatio="xMidYMax meet">' + bintang + bulan +
        '<circle class="pendar" cx="300" cy="170" r="150"/>' + tanah + menara(104) + menara(470) +
        '<g class="bangunan-m"><rect x="160" y="236" width="280" height="98" rx="3"/>' +
        '<path class="kubah-kecil" d="M168 236c0-24 14-36 32-44 18 8 32 20 32 44zM368 236c0-24 14-36 32-44 18 8 32 20 32 44z"/>' +
        '<rect class="drum" x="222" y="204" width="156" height="34" rx="3"/>' +
        '<path class="kubah" d="M222 206c0-70 44-104 78-128 34 24 78 58 78 128z"/>' +
        '<path class="garis-kubah" d="M300 80c-18 30-24 80-22 124M300 80c18 30 24 80 22 124"/>' +
        '<line class="ujung" x1="300" y1="78" x2="300" y2="50"/><circle class="ujung-b" cx="300" cy="46" r="4.5"/>' +
        '<path class="jendela" d="M240 230v-12a6 6 0 0 1 12 0v12zM268 230v-12a6 6 0 0 1 12 0v12zM320 230v-12a6 6 0 0 1 12 0v12zM348 230v-12a6 6 0 0 1 12 0v12z"/>' +
        '<path class="pintu" d="M184 334v-46a18 18 0 0 1 36 0v46zM272 334v-58a28 28 0 0 1 56 0v58zM380 334v-46a18 18 0 0 1 36 0v46z"/></g>' +
        '<rect class="lantai" x="70" y="330" width="460" height="10" rx="3"/></svg>';
    }
    // jenis lain: bingkai lengkung netral + siluet bangunan jenis itu (tanpa simbol keagamaan)
    return '<svg class="hero-ilu" viewBox="0 0 600 380" aria-hidden="true" preserveAspectRatio="xMidYMax meet">' + bintang +
      '<circle class="pendar" cx="300" cy="190" r="150"/>' + tanah +
      '<path class="bingkai" d="M170 334V170a130 130 0 0 1 260 0v164"/><path class="bingkai tipis" d="M190 334V174a110 110 0 0 1 220 0v160"/>' +
      '<use href="#j-' + j + '" x="200" y="134" width="200" height="200" class="siluet-b"/>' +
      '<rect class="lantai" x="70" y="330" width="460" height="10" rx="3"/></svg>';
  }
  var GAYA_GALERI = ['depan', 'dalam', 'serambi', 'taman', 'umat', 'senja'];
  function galeriSVG(gaya, j) {
    var m = j === 'masjid' || j === 'musala', s = '<svg viewBox="0 0 320 220" aria-hidden="true" preserveAspectRatio="xMidYMid slice">';
    if (gaya === 'depan') s += '<rect class="g-langit" width="320" height="220"/><path class="g-tanah" d="M0 190h320v30H0z"/>' + (m ? '<path class="g-utama" d="M100 190v-60h120v60zM118 132c0-34 20-52 42-62 22 10 42 28 42 62z"/><rect class="g-utama" x="62" y="80" width="14" height="110"/><rect class="g-utama" x="244" y="80" width="14" height="110"/>' : '<use href="#j-' + j + '" x="90" y="50" width="140" height="140" class="g-utama-use"/>') + '<path class="g-emas" d="M146 190v-26a14 14 0 0 1 28 0v26z"/>';
    else if (gaya === 'dalam') s += '<rect class="g-gelap" width="320" height="220"/>' + [40, 120, 200, 280].map(function (x) { return '<rect class="g-tiang" x="' + (x - 6) + '" y="40" width="12" height="160"/><path class="g-emas-garis" d="M' + (x - 34) + ' 40a34 34 0 0 1 68 0"/>'; }).join('') + '<path class="g-karpet" d="M0 200h320v20H0z"/>' + [80, 160, 240].map(function (x) { return '<line class="g-emas-garis" x1="' + x + '" y1="0" x2="' + x + '" y2="26"/><circle class="g-lampu" cx="' + x + '" cy="32" r="7"/>'; }).join('');
    else if (gaya === 'serambi') s += '<rect class="g-langit" width="320" height="220"/>' + [0, 1, 2, 3].map(function (i) { var x = 12 + i * 78; return '<path class="g-bayang" d="M' + x + ' 220V90a35 35 0 0 1 70 0v130z"/>'; }).join('') + '<path class="g-utama" d="M0 0h320v40H0zM0 210h320v10H0z"/>' + [0, 1, 2, 3, 4].map(function (i) { return '<rect class="g-utama" x="' + (4 + i * 78) + '" y="40" width="10" height="180"/>'; }).join('');
    else if (gaya === 'taman') s += '<rect class="g-langit" width="320" height="220"/><path class="g-tanah" d="M0 170c80-20 160-20 320 0v50H0z"/>' + [[50, 120, 34], [130, 105, 42], [250, 118, 36]].map(function (t) { return '<rect class="g-batang" x="' + (t[0] - 3) + '" y="' + t[1] + '" width="6" height="' + (175 - t[1]) + '"/><circle class="g-daun" cx="' + t[0] + '" cy="' + t[1] + '" r="' + t[2] + '"/>'; }).join('') + '<path class="g-emas" d="M180 190c20-8 50-8 80 0v6h-80z"/>';
    else if (gaya === 'umat') s += '<rect class="g-lembut" width="320" height="220"/><path class="g-karpet" d="M0 168h320v52H0z"/>' + [50, 100, 150, 200, 250].map(function (x, i) { var y = 110 + (i % 2) * 6; return '<circle class="g-orang" cx="' + x + '" cy="' + y + '" r="14"/><path class="g-orang" d="M' + (x - 22) + ' 172c0-26 10-40 22-40s22 14 22 40z"/>'; }).join('') + '<rect class="g-utama" x="120" y="40" width="80" height="10" rx="5"/>';
    else s += '<rect class="g-senja" width="320" height="220"/><circle class="g-matahari" cx="210" cy="150" r="42"/><path class="g-siluet" d="M0 220v-40h320v40z"/>' + (m ? '<path class="g-siluet" d="M70 180v-50h70v50zM78 132c0-20 12-32 27-38 15 6 27 18 27 38z"/><rect class="g-siluet" x="160" y="60" width="12" height="120"/><path class="g-siluet" d="M160 60c0-12 6-16 6-26 0 10 6 14 6 26z"/>' : '<use href="#j-' + j + '" x="60" y="80" width="110" height="110" class="g-siluet-use"/>');
    return s + '</svg>';
  }
  function qrisSVG(seed) { // pola acak berbiji — HANYA placeholder, bukan QR yang bisa dipindai
    var h = 0; String(seed).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; });
    var acak = function () { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 16) / 65536; }, n = 25, k = '';
    var mata = function (x, y) { return x < 7 && y < 7 || x > n - 8 && y < 7 || x < 7 && y > n - 8; };
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (!mata(x, y) && acak() > .52) k += 'M' + x + ' ' + y + 'h1v1h-1z';
    var sudut = function (x, y) { return '<path d="M' + x + ' ' + y + 'h7v7h-7zM' + (x + 1) + ' ' + (y + 1) + 'v5h5v-5z" fill-rule="evenodd"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3"/>'; };
    return '<svg class="qris" viewBox="-2 -2 29 29" role="img" aria-label="Contoh QRIS (placeholder, belum bisa dipindai)"><rect x="-2" y="-2" width="29" height="29" fill="#fff"/><g fill="#111">' + sudut(0, 0) + sudut(n - 7, 0) + sudut(0, n - 7) + '<path d="' + k + '"/></g></svg>';
  }

  // ================= Render =================
  var aktifId = null, detikT = null, petaS = null, fokusSebelum = null;
  // ================= Logo & foto profil =================
  // SATU tempat pengaturan gambar website per tempat. Unggahan pengurus disimpan sebagai dataURL (localStorage),
  // diperkecil ke sisi terpanjang GAMBAR.maks px. Slot kosong = ilustrasi SVG bawaan (heroSVG/galeriSVG).
  var GAMBAR = { maks: 400, mutu: 0.75, galeriMaks: 6 };
  function kecilkan(file, png, cb) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var s = Math.min(1, GAMBAR.maks / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); cb(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', GAMBAR.mutu));
    };
    img.onerror = function () { URL.revokeObjectURL(url); D().toast('Gambar tidak bisa dibaca'); };
    img.src = url;
  }
  var inisial = function (s) { return String(s || '?').replace(/^(masjid|musala|gereja|pura|vihara|klenteng)\s+/i, '').split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); };
  var amanGambar = function (s) { return /^data:image\/(png|jpe?g|webp|gif);base64,/.test(s || '') || /^(img\/|https?:\/\/)/.test(s || ''); };
  window.addEventListener('error', function (e) { // gambar logo gagal dimuat → inisial
    var t = e.target; if (t && t.tagName === 'IMG' && t.dataset.inisial) { var s = document.createElement('b'); s.className = 's-logo-ini'; s.textContent = t.dataset.inisial; t.replaceWith(s); }
    else if (t && t.tagName === 'IMG' && t.dataset.cadangan === 'sembunyi') t.remove();
  }, true);

  var D = function () { return window.DIR; };
  var tempat = function () { return D().cariTempat(aktifId); };
  var isMasjid = function (p) { return p.jenis === 'masjid' || p.jenis === 'musala'; };
  var waDari = function (k) { var d = String(k || '').replace(/\D/g, ''); return d.indexOf('0') === 0 ? '62' + d.slice(1) : d; };
  var tglPanjang = function (t) { return new Date(t).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
  function hijriah(dUtc) {
    try { return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(dUtc).replace(/ H$/, '') + ' H'; } catch (e) { return ''; }
  }

  function buka(id, opsi) {
    var p = D().cariTempat(id); if (!p) return false;
    normalProfil(p);
    aktifId = id; fokusSebelum = document.activeElement;
    document.body.classList.add('mode-situs');
    $('#situs').hidden = false;
    var url = location.pathname + '?tempat=' + encodeURIComponent(id);
    if (!(opsi && opsi.awal)) history.pushState({ situs: id }, '', url); else history.replaceState({ situs: id }, '', url);
    render();
    window.scrollTo(0, 0);
    var h = $('#sNama'); if (h) h.focus({ preventScroll: true });
    return true;
  }
  function tutup(dariHistory) {
    if (!aktifId) return;
    aktifId = null; clearInterval(detikT); detikT = null;
    if (petaS) { petaS.remove(); petaS = null; }
    document.body.classList.remove('mode-situs'); $('#situs').hidden = true; $('#situs').innerHTML = '';
    document.title = 'Direktori Rumah Ibadah';
    if (!dariHistory) history.replaceState(null, '', location.pathname + '#jelajah');
    if (D().segarJelajah) D().segarJelajah();
  }
  window.addEventListener('popstate', function () { if (aktifId && !/[?&]tempat=/.test(location.search)) tutup(true); });

  function render() {
    var p = tempat(); if (!p) return tutup();
    var pr = p.profil, j = p.jenis, adm = D().isAdmin(), JN = D().JENIS[j].nama, m = isMasjid(p);
    document.title = p.nama + ' — ' + JN;
    var menu = [['sJadwal', m ? 'Jadwal sholat' : 'Jadwal ibadah'], ['sKegiatan', 'Kegiatan'], ['sInfak', m ? 'Infak' : 'Kas & donasi'], ['sGaleri', 'Galeri'], ['sKontak', 'Kontak']];
    var html =
      '<header class="s-nav" data-bagian="nav"><div class="s-lebar s-nav-isi">' +
      '<button class="s-kembali" type="button" data-s="kembali" aria-label="Kembali ke direktori"><svg><use href="#i-kiri"/></svg><span>Direktori</span></button>' +
      '<a class="s-merek" href="#sAtas"><span class="s-logo' + (amanGambar(pr.logo) ? ' s-logo-foto' : '') + '" aria-hidden="true">' + (amanGambar(pr.logo) ? '<img src="' + esc(pr.logo) + '" alt="" data-inisial="' + esc(inisial(p.nama)) + '">' : '<svg><use href="#' + D().JENIS[j].ikon + '"/></svg>') + '</span><b>' + esc(p.nama) + '</b></a>' +
      '<nav class="s-menu" aria-label="Bagian halaman">' + menu.map(function (x) { return '<a href="#' + x[0] + '">' + x[1] + '</a>'; }).join('') + '</nav>' +
      '<div class="s-aksi-nav">' + (adm ? '<button class="tbl tbl-emas kecil" type="button" data-s="edit"><svg><use href="#i-edit"/></svg><span>Edit profil</span></button>' : '') +
      '<button class="tbl s-ikon-tbl" type="button" data-s="bagikan" aria-label="Salin tautan website"><svg><use href="#i-bagikan"/></svg></button></div>' +
      '</div></header>' +

      // HERO
      '<section class="s-hero" id="sAtas" data-bagian="aksen"><div class="s-lebar s-hero-isi">' +
      '<div class="s-hero-teks"><span class="s-label"><i></i>' + JN + ' · ' + esc(p.alamat.split(',').slice(-1)[0].trim()) + '</span>' +
      '<h1 id="sNama" tabindex="-1" data-bagian="teks">' + esc(p.nama) + '</h1><p class="s-tagline">' + esc(pr.tagline) + '</p>' +
      '<div class="s-hero-tbl"><a class="tbl tbl-emas" href="#sJadwal"><svg><use href="#i-jam"/></svg>' + (m ? 'Lihat jadwal sholat' : 'Lihat jadwal ibadah') + '</a>' +
      '<a class="tbl s-tbl-kaca" href="#sInfak"><svg><use href="#i-hati"/></svg>' + (m ? 'Infak sekarang' : 'Dukung kami') + '</a></div></div>' +
      '<div class="s-hero-gambar">' + (amanGambar(pr.fotoHero) ? '<img class="s-hero-foto" src="' + esc(pr.fotoHero) + '" alt="Foto ' + esc(p.nama) + '" data-cadangan="sembunyi">' : heroSVG(j)) + '</div></div>' +
      (m ? '<div class="s-lebar"><div class="s-hitung" id="sHitung" aria-live="off"></div></div>' : '') + '</section>' +

      // SAMBUTAN + PENGUMUMAN
      '<section class="s-blok s-lebar s-dua" aria-labelledby="sjPeng">' +
      '<div class="s-sambutan">' + (pr.sambutan ? '<h2 class="s-judul-kecil">Sambutan pengurus</h2><p>' + esc(pr.sambutan) + '</p>' : '<h2 class="s-judul-kecil">Tentang kami</h2><p class="s-redup">' + esc(p.kegiatan || 'Pengurus belum menulis sambutan.') + '</p>') +
      '<ul class="s-fakta">' + D().fasRelevan(j).filter(function (k) { return p.fasilitas[k]; }).map(function (k) { return '<li><svg aria-hidden="true"><use href="#' + D().FAS[k][1] + '"/></svg>' + D().FAS[k][0] + '</li>'; }).join('') + '</ul></div>' +
      '<div><h2 id="sjPeng" class="s-judul">Pengumuman</h2>' + (pr.pengumuman.length ? '<ul class="s-peng">' + pr.pengumuman.map(function (a, i) {
        return '<li class="s-kartu" style="--i:' + i + '"><time>' + new Date(a.t || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + '</time><div><b>' + esc(a.judul) + '</b><p>' + esc(a.isi) + '</p></div></li>';
      }).join('') + '</ul>' : kosong('Belum ada pengumuman', adm ? 'Tambahkan lewat tombol Edit profil.' : 'Nantikan kabar dari pengurus.')) + '</div></section>' +

      // JADWAL
      '<section class="s-blok s-jadwal-wrap" id="sJadwal" aria-labelledby="sjJadwal"><div class="s-lebar">' +
      '<div class="s-kepala"><h2 id="sjJadwal" class="s-judul">' + (m ? 'Jadwal sholat hari ini' : 'Jadwal ibadah') + '</h2>' +
      (m ? '<p class="s-redup" id="sTanggal"></p>' : '') + '</div>' +
      (m ? '<ol class="s-waktu" id="sWaktu"></ol><p class="s-catatan">Dihitung otomatis dari titik lokasi (' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) + ') dengan kriteria Kemenag: Subuh 20°, Isya 18°, Asar Syafi\'i, ihtiyat 2 menit, zona ' + NAMA_ZONA[pr.zona] + '. Bisa berbeda ±2 menit dari jadwal resmi; pengurus dapat menambah koreksi.</p>' : '') +
      (p.jam.length ? '<div class="s-jadwal-lain">' + (m ? '<h3 class="s-judul-kecil">Jadwal lain</h3>' : '') + '<ul>' + p.jam.map(function (x) { return '<li><svg aria-hidden="true"><use href="#i-jam"/></svg>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : (m ? '' : kosong('Jadwal belum diisi', 'Pengurus bisa menambahkannya lewat Edit profil.'))) +
      '</div></section>' +

      // KEGIATAN
      '<section class="s-blok s-lebar" id="sKegiatan" aria-labelledby="sjKeg"><div class="s-kepala"><h2 id="sjKeg" class="s-judul">' + (m ? 'Kajian & kegiatan pekanan' : 'Kegiatan pekanan') + '</h2></div>' +
      (pr.kegiatan.length ? '<ul class="s-keg">' + pr.kegiatan.map(function (k, i) {
        return '<li class="s-kartu" style="--i:' + i + '"><span class="s-hari">' + esc(k.hari) + '</span><b>' + esc(k.judul) + '</b><span class="s-redup"><svg aria-hidden="true"><use href="#i-jam"/></svg>' + esc(k.jam) + '</span>' + (k.pemateri ? '<span class="s-redup"><svg aria-hidden="true"><use href="#i-orang"/></svg>' + esc(k.pemateri) + '</span>' : '') + '</li>';
      }).join('') + '</ul>' : kosong('Belum ada kegiatan', adm ? 'Tambahkan lewat Edit profil, satu baris satu kegiatan.' : 'Nantikan jadwal kegiatan berikutnya.')) + '</section>' +

      // INFAK & KAS
      '<section class="s-blok s-infak-wrap" id="sInfak" aria-labelledby="sjInfak"><div class="s-lebar">' +
      '<div class="s-kepala"><h2 id="sjInfak" class="s-judul">' + (m ? 'Laporan infak & kas' : 'Laporan kas') + '</h2><p class="s-redup">Transparan untuk jamaah. Diperbarui pengurus.</p></div>' +
      '<div class="s-infak">' + kasHTML(pr, adm) + donasiHTML(p, pr) + '</div></div></section>' +

      // GALERI
      '<section class="s-blok s-lebar" id="sGaleri" aria-labelledby="sjGal"><div class="s-kepala"><h2 id="sjGal" class="s-judul">Galeri</h2><p class="s-redup">' + (pr.fotoGaleri.some(amanGambar) ? 'Dokumentasi ' + esc(p.nama) + '.' : 'Ilustrasi contoh — pengurus bisa mengunggah foto asli lewat Edit profil.') + '</p></div>' +
      '<ul class="s-galeri">' + pr.galeri.slice(0, 6).map(function (g, i) { return '<li class="s-gal" style="--i:' + i + '">' + (amanGambar(pr.fotoGaleri[i]) ? '<img src="' + esc(pr.fotoGaleri[i]) + '" alt="' + esc(g) + '" loading="lazy" data-cadangan="sembunyi">' : galeriSVG(GAYA_GALERI[i % 6], j)) + '<span>' + esc(g) + '</span></li>'; }).join('') + '</ul></section>' +

      // KONTAK
      '<section class="s-blok s-lebar" id="sKontak" aria-labelledby="sjKontak"><div class="s-kepala"><h2 id="sjKontak" class="s-judul">Kontak & lokasi</h2></div>' +
      '<div class="s-kontak"><div class="s-kartu s-kontak-isi" data-bagian="panel">' +
      '<p><svg aria-hidden="true"><use href="#i-pin"/></svg><span>' + esc(p.alamat) + '</span></p>' +
      (p.kontak ? '<p><svg aria-hidden="true"><use href="#i-telp"/></svg><a href="tel:' + esc(p.kontak.replace(/[^\d+]/g, '')) + '">' + esc(p.kontak) + '</a></p>' : '') +
      (pr.email ? '<p><svg aria-hidden="true"><use href="#i-surat"/></svg><a href="mailto:' + esc(pr.email) + '">' + esc(pr.email) + '</a></p>' : '') +
      '<div class="deret">' + '<a class="tbl tbl-utama" data-bagian="utama" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '" target="_blank" rel="noopener"><svg><use href="#i-arah"/></svg>Petunjuk arah</a>' +
      (p.kontak ? '<a class="tbl tbl-garis" href="https://wa.me/' + waDari(p.kontak) + '" target="_blank" rel="noopener"><svg><use href="#i-pesan"/></svg>WhatsApp</a>' : '') + '</div></div>' +
      '<div class="s-peta" id="sPeta" role="region" aria-label="Peta lokasi ' + esc(p.nama) + '"></div></div></section>' +

      '<footer class="s-kaki"><div class="s-lebar"><b>' + esc(p.nama) + '</b><span>' + esc(p.alamat) + '</span><span class="s-redup">Profil diperbarui ' + new Date(pr.diperbarui).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · bagian dari <a href="' + location.pathname + '#jelajah" data-s="kembali">' + esc((window.TEMA && TEMA.nama) || 'Direktori Rumah Ibadah') + '</a></span></div></footer>';
    $('#situs').innerHTML = html;
    $('#situs').style.setProperty('--pw', 'var(--j-' + j + ')');
    if (m) { detik(); clearInterval(detikT); detikT = setInterval(detik, 1000); }
    pasangPeta(p);
  }
  function kosong(j, t) { return '<div class="s-kosong"><b>' + j + '</b><span>' + t + '</span></div>'; }

  function kasHTML(pr, adm) {
    var tr = pr.kas.transaksi.slice().sort(function (a, b) { return a.tgl < b.tgl ? 1 : -1; });
    var masuk = 0, keluar = 0; tr.forEach(function (x) { masuk += +x.masuk || 0; keluar += +x.keluar || 0; });
    var saldo = (+pr.kas.saldoAwal || 0) + masuk - keluar;
    var kini = new Date(), bln = [];
    for (var i = 3; i >= 0; i--) { var d = new Date(kini.getFullYear(), kini.getMonth() - i, 1); bln.push({ k: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), n: d.toLocaleDateString('id-ID', { month: 'short' }), m: 0, o: 0 }); }
    tr.forEach(function (x) { var b = bln.filter(function (y) { return String(x.tgl).slice(0, 7) === y.k; })[0]; if (b) { b.m += +x.masuk || 0; b.o += +x.keluar || 0; } });
    var maks = Math.max.apply(null, bln.map(function (b) { return Math.max(b.m, b.o); }).concat([1]));
    var ini = bln[3];
    return '<div class="s-kas s-kartu" data-bagian="panel">' +
      '<div class="s-saldo"><span>Saldo kas saat ini</span><b>' + rp(saldo) + '</b></div>' +
      '<div class="s-ringkas"><div><span>Masuk bulan ini</span><b class="naik">+' + rp(ini.m) + '</b></div><div><span>Keluar bulan ini</span><b class="turun">−' + rp(ini.o) + '</b></div></div>' +
      '<div class="s-grafik" role="img" aria-label="Grafik pemasukan dan pengeluaran 4 bulan terakhir">' + bln.map(function (b) {
        return '<div class="s-bulan"><div class="s-batang"><i class="m" style="--h:' + (b.m / maks * 100).toFixed(1) + '%" title="Masuk ' + rp(b.m) + '"></i><i class="o" style="--h:' + (b.o / maks * 100).toFixed(1) + '%" title="Keluar ' + rp(b.o) + '"></i></div><span>' + b.n + '</span></div>';
      }).join('') + '</div><p class="s-legenda"><i class="m"></i>Masuk <i class="o"></i>Keluar</p>' +
      '<h3 class="s-judul-kecil">Transaksi terakhir</h3>' +
      (tr.length ? '<ul class="s-trans">' + tr.slice(0, 6).map(function (x) {
        var isMasuk = (+x.masuk || 0) > 0;
        return '<li><span><b>' + esc(x.ket) + '</b><small>' + new Date(x.tgl + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + '</small></span><b class="' + (isMasuk ? 'naik' : 'turun') + '">' + (isMasuk ? '+' + rp(x.masuk) : '−' + rp(x.keluar)) + '</b></li>';
      }).join('') + '</ul>' : '<p class="s-redup">Belum ada transaksi.</p>') +
      (adm ? '<form class="s-catat" id="sCatat" novalidate><h3 class="s-judul-kecil">Catat transaksi <small>(pengurus)</small></h3>' +
        '<div class="s-catat-grid"><div class="ruas"><label for="cTgl">Tanggal</label><input id="cTgl" type="date" value="' + new Date().toISOString().slice(0, 10) + '" required></div>' +
        '<div class="ruas"><label for="cJenis">Jenis</label><select id="cJenis"><option value="masuk">Masuk</option><option value="keluar">Keluar</option></select></div>' +
        '<div class="ruas s-lebar-penuh"><label for="cKet">Keterangan</label><input id="cKet" maxlength="80" placeholder="mis. Infak kotak Jumat" required></div>' +
        '<div class="ruas s-lebar-penuh"><label for="cNom">Nominal (Rp)</label><input id="cNom" inputmode="numeric" placeholder="mis. 250000" required></div></div>' +
        '<small class="galat" id="cGalat" role="alert"></small><button class="tbl tbl-utama" type="submit" data-bagian="utama"><svg><use href="#i-plus"/></svg>Simpan transaksi</button></form>' : '') +
      '</div>';
  }
  function donasiHTML(p, pr) {
    return '<div class="s-donasi s-kartu" data-bagian="panel"><h3 class="s-judul-kecil">' + (isMasjid(p) ? 'Salurkan infak' : 'Salurkan donasi') + '</h3>' +
      (pr.qris ? '<div class="s-qris">' + qrisSVG(p.id) + '<span class="s-contoh">CONTOH</span></div><p class="s-redup s-kecil">QRIS di atas hanya placeholder. Ganti dengan gambar QRIS resmi milik rekening ' + (isMasjid(p) ? 'masjid' : 'lembaga') + ' (lihat PANDUAN.md).</p>' : '') +
      (pr.rekening.length ? '<ul class="s-rek">' + pr.rekening.map(function (r) {
        return '<li><span><small>' + esc(r.bank) + '</small><b class="s-norek">' + esc(r.no) + '</b><small>a.n. ' + esc(r.an) + '</small></span><button class="tbl tbl-garis kecil" type="button" data-salin="' + esc(String(r.no).replace(/\s/g, '')) + '" aria-label="Salin nomor rekening ' + esc(r.bank) + '"><svg><use href="#i-salin"/></svg>Salin</button></li>';
      }).join('') + '</ul>' : '<p class="s-redup">Nomor rekening belum diisi pengurus.</p>') +
      (p.kontak ? '<a class="tbl tbl-garis" href="https://wa.me/' + waDari(p.kontak) + '?text=' + encodeURIComponent('Assalamu\'alaikum, saya sudah transfer infak untuk ' + p.nama + '. Mohon dicek.') + '" target="_blank" rel="noopener"><svg><use href="#i-pesan"/></svg>Konfirmasi lewat WhatsApp</a>' : '') + '</div>';
  }

  function detik() {
    var p = tempat(); if (!p || !$('#sHitung')) return;
    var pr = p.profil, z = +pr.zona || 7, kini = kiniZona(z);
    var y = kini.getUTCFullYear(), mo = kini.getUTCMonth() + 1, d = kini.getUTCDate();
    var key = y + '-' + mo + '-' + d;
    if (detik._key !== key + aktifId + JSON.stringify(pr.koreksi) + z) {
      detik._key = key + aktifId + JSON.stringify(pr.koreksi) + z;
      detik._h = hitungJadwal(y, mo, d, p.lat, p.lng, z, pr.koreksi);
      var b = new Date(Date.UTC(y, mo - 1, d + 1)); detik._besok = hitungJadwal(b.getUTCFullYear(), b.getUTCMonth() + 1, b.getUTCDate(), p.lat, p.lng, z, pr.koreksi);
      var tg = $('#sTanggal'); if (tg) tg.textContent = new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) + (hijriah(new Date(Date.UTC(y, mo - 1, d))) ? ' · ' + hijriah(new Date(Date.UTC(y, mo - 1, d))) : '');
      detik._render = true;
    }
    var h = detik._h, dtk = kini.getUTCHours() * 3600 + kini.getUTCMinutes() * 60 + kini.getUTCSeconds();
    var berikut = null, sisa = 0;
    for (var i = 0; i < WAJIB.length; i++) { if (h[WAJIB[i]] * 60 > dtk) { berikut = WAJIB[i]; sisa = h[berikut] * 60 - dtk; break; } }
    var besok = !berikut; if (besok) { berikut = 'subuh'; sisa = 86400 - dtk + detik._besok.subuh * 60; }
    var hh = Math.floor(sisa / 3600), mm = Math.floor(sisa % 3600 / 60), ss = sisa % 60, dua = function (n) { return String(n).padStart(2, '0'); };
    var el = $('#sHitung');
    if (detik._render || el.dataset.berikut !== berikut) {
      el.dataset.berikut = berikut;
      el.innerHTML = '<div class="s-hitung-kiri"><span class="s-label-kecil">Menuju ' + NAMA_WAKTU[berikut] + (besok ? ' (besok)' : '') + '</span><b class="s-angka" aria-hidden="true"><span data-h></span><i>:</i><span data-m></span><i>:</i><span data-s></span></b><span class="sr" data-sr></span></div>' +
        '<div class="s-hitung-kanan"><span class="s-label-kecil">' + NAMA_WAKTU[berikut] + ' pukul</span><b>' + jamMenit((besok ? detik._besok : h)[berikut]) + ' <small>' + NAMA_ZONA[z] + '</small></b></div>';
      var ol = $('#sWaktu');
      if (ol) ol.innerHTML = URUT_WAKTU.map(function (k, i) {
        var lewat = !besok && h[k] * 60 <= dtk && k !== berikut;
        return '<li class="s-w' + (k === berikut && !besok ? ' aktif' : '') + (WAJIB.indexOf(k) < 0 ? ' kecil' : '') + (lewat ? ' lewat' : '') + '" style="--i:' + i + '"' + (k === berikut && !besok ? ' aria-current="time"' : '') + '><span>' + NAMA_WAKTU[k] + '</span><b>' + jamMenit(h[k]) + '</b>' + (k === berikut && !besok ? '<em>berikutnya</em>' : '') + '</li>';
      }).join('');
      detik._render = false;
    }
    $('[data-h]', el).textContent = dua(hh); $('[data-m]', el).textContent = dua(mm); $('[data-s]', el).textContent = dua(ss);
    if (ss === 0 || !$('[data-sr]', el).textContent) $('[data-sr]', el).textContent = NAMA_WAKTU[berikut] + ' dalam ' + hh + ' jam ' + mm + ' menit';
  }

  function pasangPeta(p) {
    var w = $('#sPeta'); if (!w) return;
    if (typeof L === 'undefined') { w.innerHTML = '<div class="s-kosong"><b>Peta belum bisa dimuat</b><span>Periksa koneksi internet.</span></div>'; return; }
    if (petaS) { petaS.remove(); petaS = null; }
    petaS = L.map(w, { scrollWheelZoom: false }).setView([p.lat, p.lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(petaS);
    L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: '<div class="pin" style="--warna:var(--j-' + p.jenis + ')"><svg><use href="#' + D().JENIS[p.jenis].ikon + '"/></svg></div>', iconSize: [40, 48], iconAnchor: [20, 46] }), title: p.nama, alt: p.nama }).addTo(petaS);
    setTimeout(function () { if (petaS) petaS.invalidateSize(); }, 60);
  }

  // ================= Aksi =================
  document.addEventListener('click', function (e) {
    if (!aktifId) return;
    var s = e.target.closest('[data-s]');
    if (s) {
      e.preventDefault();
      if (s.dataset.s === 'kembali') { tutup(); if (D().buka) D().buka('jelajah'); }
      else if (s.dataset.s === 'edit') bukaEditor();
      else if (s.dataset.s === 'bagikan') salin(location.href, 'Tautan website disalin');
      return;
    }
    var c = e.target.closest('[data-salin]'); if (c) salin(c.dataset.salin, 'Nomor rekening disalin');
    var a = e.target.closest('#situs a[href^="#s"]');
    if (a) { e.preventDefault(); var t = $(a.getAttribute('href')); if (t) t.scrollIntoView({ behavior: kurangGerak() ? 'auto' : 'smooth', block: 'start' }); }
  });
  function salin(teks, pesan) {
    var ok = function () { D().toast(pesan); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(teks).then(ok, function () { D().toast('Salin manual: ' + teks); });
    else D().toast('Salin manual: ' + teks);
  }
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'sCatat') return;
    e.preventDefault();
    if (!D().isAdmin()) return;
    var p = tempat(), g = $('#cGalat'), tgl = $('#cTgl').value, ket = $('#cKet').value.trim(), nom = parseInt($('#cNom').value.replace(/\D/g, ''), 10);
    $$('#sCatat [aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) { g.textContent = 'Pilih tanggal.'; $('#cTgl').setAttribute('aria-invalid', 'true'); $('#cTgl').focus(); return; }
    if (ket.length < 3) { g.textContent = 'Tulis keterangan minimal 3 huruf.'; $('#cKet').setAttribute('aria-invalid', 'true'); $('#cKet').focus(); return; }
    if (!nom || nom <= 0) { g.textContent = 'Nominal harus angka lebih dari 0.'; $('#cNom').setAttribute('aria-invalid', 'true'); $('#cNom').focus(); return; }
    var masuk = $('#cJenis').value === 'masuk';
    p.profil.kas.transaksi.push({ tgl: tgl, ket: ket, masuk: masuk ? nom : 0, keluar: masuk ? 0 : nom });
    simpanProfil(p, 'Catat kas: ' + ket + ' ' + (masuk ? '+' : '−') + rp(nom));
    D().toast('Transaksi tersimpan'); render();
    var t = $('#sInfak'); if (t) t.scrollIntoView({ block: 'start' });
  });
  function simpanProfil(p, ket) {
    p.profil.diperbarui = Date.now(); p.diperbarui = Date.now();
    p.riwayat.push({ t: Date.now(), oleh: D().saya() ? D().saya().nama : 'Pengurus', aksi: 'Profil diperbarui', ket: ket });
    D().simpan();
  }

  // ---------- Editor profil (khusus pengurus) ----------
  var baris = function (teks) { return String(teks || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean); };
  var pecah = function (s) { return s.split('|').map(function (x) { return x.trim(); }); };
  function bukaEditor() {
    if (!D().isAdmin()) { D().toast('Khusus pengurus — masuk dulu'); return; }
    var p = tempat(), pr = p.profil, m = isMasjid(p);
    var isi = function (arr, f) { return esc(arr.map(f).join('\n')); };
    var ed = $('#situsEdit');
    ed.innerHTML = '<form class="s-editor" id="sEditor" novalidate><div class="s-editor-kepala"><h2 id="seJudul">Edit profil</h2><button class="tutup-detail" type="button" data-e="tutup" aria-label="Tutup editor"><svg><use href="#i-x"/></svg></button></div>' +
      '<div class="s-editor-badan">' +
      '<p class="s-redup">Format daftar: satu baris satu item, pisahkan kolom dengan tanda <code>|</code>. Perubahan langsung tampil dan tercatat di riwayat.</p>' +
      ruas('eTagline', 'Slogan singkat', '<input id="eTagline" maxlength="90" value="' + esc(pr.tagline) + '">') +
      ruas('eSambutan', 'Sambutan / tentang kami', '<textarea id="eSambutan" rows="4" maxlength="600">' + esc(pr.sambutan) + '</textarea>') +
      ruas('ePeng', 'Pengumuman <small>Judul | isi</small>', '<textarea id="ePeng" rows="4">' + isi(pr.pengumuman, function (a) { return a.judul + ' | ' + a.isi; }) + '</textarea>') +
      ruas('eKeg', 'Kegiatan <small>Hari | jam | judul | pemateri</small>', '<textarea id="eKeg" rows="5">' + isi(pr.kegiatan, function (k) { return [k.hari, k.jam, k.judul, k.pemateri].join(' | '); }) + '</textarea>') +
      ruas('eJam', (m ? 'Jadwal lain' : 'Jadwal ibadah') + ' <small>satu baris satu jadwal</small>', '<textarea id="eJam" rows="3">' + esc(p.jam.join('\n')) + '</textarea>') +
      ruas('eSaldo', 'Saldo awal kas (Rp)', '<input id="eSaldo" inputmode="numeric" value="' + (+pr.kas.saldoAwal || 0) + '">') +
      ruas('eKas', 'Transaksi kas <small>YYYY-MM-DD | keterangan | masuk | keluar</small>', '<textarea id="eKas" rows="5">' + isi(pr.kas.transaksi, function (x) { return [x.tgl, x.ket, x.masuk || 0, x.keluar || 0].join(' | '); }) + '</textarea>') +
      ruas('eRek', 'Rekening donasi <small>Bank | nomor | atas nama</small>', '<textarea id="eRek" rows="2">' + isi(pr.rekening, function (r) { return [r.bank, r.no, r.an].join(' | '); }) + '</textarea>') +
      '<label class="cek"><input type="checkbox" id="eQris"' + (pr.qris ? ' checked' : '') + '>Tampilkan kotak QRIS (placeholder)</label>' +
      '<fieldset><legend>Logo &amp; foto</legend><p class="s-redup s-kecil">Diperkecil otomatis ke ' + GAMBAR.maks + ' px dan disimpan di browser ini. Kosong = ilustrasi bawaan.</p>' +
        ruasGambar('eLogo', 'Logo (persegi 1:1)', pr.logo, false) + ruasGambar('eHero', 'Foto utama / hero (4:3)', pr.fotoHero, false) +
        ruasGambar('eFGal', 'Foto galeri (maks. 6, urut sesuai judul)', pr.fotoGaleri.filter(Boolean)[0] || '', true) + '</fieldset>' +
      ruas('eGal', 'Judul galeri <small>maks. 6 baris</small>', '<textarea id="eGal" rows="3">' + esc(pr.galeri.join('\n')) + '</textarea>') +
      ruas('eKontak', 'Telepon / WhatsApp', '<input id="eKontak" inputmode="tel" maxlength="60" value="' + esc(p.kontak) + '">') +
      ruas('eEmail', 'Email', '<input id="eEmail" type="email" maxlength="80" value="' + esc(pr.email) + '">') +
      (m ? '<fieldset><legend>Jadwal sholat</legend><div class="ruas"><label for="eZona">Zona waktu</label><select id="eZona">' + [7, 8, 9].map(function (z) { return '<option value="' + z + '"' + (+pr.zona === z ? ' selected' : '') + '>' + NAMA_ZONA[z] + ' (UTC+' + z + ')</option>'; }).join('') + '</select></div>' +
        '<p class="s-redup s-kecil">Koreksi menit (boleh minus) supaya sama persis dengan jadwal resmi Kemenag/ormas setempat.</p><div class="s-koreksi">' +
        ['imsak', 'subuh', 'dzuhur', 'asar', 'maghrib', 'isya'].map(function (k) { return '<div class="ruas"><label for="k_' + k + '">' + NAMA_WAKTU[k] + '</label><input id="k_' + k + '" type="number" min="-30" max="30" step="1" value="' + (+pr.koreksi[k] || 0) + '"></div>'; }).join('') + '</div></fieldset>' : '') +
      '<small class="galat" id="eGalat" role="alert"></small></div>' +
      '<div class="s-editor-kaki aksi-form"><button class="tbl tbl-teks" type="button" data-e="tutup">Batal</button><button class="tbl tbl-utama" type="submit" data-bagian="utama"><svg><use href="#i-cek"/></svg>Simpan profil</button></div></form>';
    ubahGambar = { logo: pr.logo, fotoHero: pr.fotoHero, fotoGaleri: pr.fotoGaleri.slice() };
    ed.hidden = false; $('#situsSelubung').hidden = false; ed.classList.add('tutup');
    requestAnimationFrame(function () { requestAnimationFrame(function () { ed.classList.remove('tutup'); }); });
    setTimeout(function () { $('#eTagline').focus(); }, 60);
  }
  var ubahGambar = null;
  function ruasGambar(id, label, src, banyak) {
    return '<div class="ruas s-ruas-gambar"><span class="s-gbr-label">' + label + '</span><div class="s-gbr-baris"><span class="s-gbr-prev" id="' + id + 'Prev">' + (amanGambar(src) ? '<img src="' + esc(src) + '" alt="">' : '') + '</span>' +
      '<label class="tbl tbl-garis kecil" for="' + id + '"><svg><use href="#i-unggah"/></svg>Pilih</label><input id="' + id + '" type="file" accept="image/*" class="sr"' + (banyak ? ' multiple' : '') + '>' +
      '<button class="tbl tbl-teks kecil" type="button" data-hapus-gbr="' + id + '">Hapus</button></div></div>';
  }
  var KUNCI_GBR = { eLogo: 'logo', eHero: 'fotoHero', eFGal: 'fotoGaleri' };
  function pratinjauGbr(id) {
    var v = ubahGambar[KUNCI_GBR[id]], src = Array.isArray(v) ? v.filter(Boolean)[0] : v, el = $('#' + id + 'Prev');
    if (el) el.innerHTML = src ? '<img src="' + esc(src) + '" alt="">' + (Array.isArray(v) && v.length > 1 ? '<small>+' + (v.length - 1) + '</small>' : '') : '';
  }
  document.addEventListener('change', function (e) {
    var id = e.target && e.target.id; if (!ubahGambar || !KUNCI_GBR[id]) return;
    var files = Array.prototype.slice.call(e.target.files || []).filter(function (f) { return /^image\//.test(f.type); });
    if (!files.length) return;
    if (id === 'eFGal') {
      var hasil = [], sisa = Math.min(files.length, GAMBAR.galeriMaks);
      files.slice(0, sisa).forEach(function (f, i) { kecilkan(f, false, function (d) { hasil[i] = d; if (!--sisa) { ubahGambar.fotoGaleri = hasil; pratinjauGbr(id); } }); });
    } else kecilkan(files[0], id === 'eLogo', function (d) { ubahGambar[KUNCI_GBR[id]] = d; pratinjauGbr(id); });
    e.target.value = '';
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-hapus-gbr]'); if (!b || !ubahGambar) return;
    var k = KUNCI_GBR[b.dataset.hapusGbr]; ubahGambar[k] = k === 'fotoGaleri' ? [] : ''; pratinjauGbr(b.dataset.hapusGbr);
  });
  function ruas(id, label, kontrol) { return '<div class="ruas"><label for="' + id + '">' + label + '</label>' + kontrol + '</div>'; }
  function tutupEditor() {
    var ed = $('#situsEdit'); if (ed.hidden) return;
    ed.classList.add('tutup'); $('#situsSelubung').hidden = true;
    setTimeout(function () { ed.hidden = true; ed.innerHTML = ''; }, kurangGerak() ? 0 : 380);
    var b = $('[data-s="edit"]'); if (b) b.focus();
  }
  document.addEventListener('click', function (e) { if (e.target.closest('[data-e="tutup"]') || e.target.id === 'situsSelubung') tutupEditor(); });
  document.addEventListener('keydown', function (e) {
    if (!aktifId) return;
    var ed = $('#situsEdit');
    if (e.key === 'Escape' && !ed.hidden) { e.stopPropagation(); tutupEditor(); }
    if (e.key === 'Tab' && !ed.hidden) {
      var f = $$('a[href], button:not([disabled]), input, textarea, select', ed).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return; var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  }, true);
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'sEditor') return;
    e.preventDefault();
    if (!D().isAdmin()) return;
    var p = tempat(), pr = p.profil, g = $('#eGalat'), salah = null;
    var tandai = function (id, pesan) { if (!salah) { salah = id; g.textContent = pesan; $('#' + id).setAttribute('aria-invalid', 'true'); $('#' + id).focus(); } };
    $$('#sEditor [aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); }); g.textContent = '';
    var trans = baris($('#eKas').value).map(function (l, i) {
      var c = pecah(l), masuk = parseInt((c[2] || '0').replace(/\D/g, ''), 10) || 0, keluar = parseInt((c[3] || '0').replace(/\D/g, ''), 10) || 0;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(c[0] || '') || !c[1]) tandai('eKas', 'Transaksi baris ' + (i + 1) + ' belum sesuai format: 2026-11-08 | keterangan | masuk | keluar');
      return { tgl: c[0], ket: c[1] || '', masuk: masuk, keluar: keluar };
    });
    var saldo = parseInt($('#eSaldo').value.replace(/\D/g, ''), 10);
    if (isNaN(saldo)) tandai('eSaldo', 'Saldo awal harus angka (boleh 0).');
    var email = $('#eEmail').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) tandai('eEmail', 'Format email belum benar.');
    if (salah) return;
    pr.tagline = $('#eTagline').value.trim() || profilKosong(p).tagline;
    pr.sambutan = $('#eSambutan').value.trim();
    var lamaPeng = {}; pr.pengumuman.forEach(function (a) { lamaPeng[a.judul] = a.t; });
    pr.pengumuman = baris($('#ePeng').value).map(function (l) { var c = pecah(l); return { judul: c[0], isi: c.slice(1).join(' | '), t: lamaPeng[c[0]] || Date.now() }; });
    pr.kegiatan = baris($('#eKeg').value).map(function (l) { var c = pecah(l); return c.length < 3 ? { hari: '', jam: '', judul: c.join(' '), pemateri: '' } : { hari: c[0], jam: c[1], judul: c[2], pemateri: c[3] || '' }; });
    p.jam = baris($('#eJam').value);
    pr.kas = { saldoAwal: saldo, transaksi: trans };
    pr.rekening = baris($('#eRek').value).map(function (l) { var c = pecah(l); return { bank: c[0], no: c[1] || '', an: c[2] || '' }; });
    pr.qris = $('#eQris').checked;
    var gal = baris($('#eGal').value).slice(0, 6); pr.galeri = gal.length ? gal : profilKosong(p).galeri;
    p.kontak = $('#eKontak').value.trim(); pr.email = email;
    if (ubahGambar) { pr.logo = ubahGambar.logo || ''; pr.fotoHero = ubahGambar.fotoHero || ''; pr.fotoGaleri = (ubahGambar.fotoGaleri || []).slice(0, GAMBAR.galeriMaks); }
    if ($('#eZona')) {
      pr.zona = +$('#eZona').value;
      pr.koreksi = {}; ['imsak', 'subuh', 'dzuhur', 'asar', 'maghrib', 'isya'].forEach(function (k) { var v = parseInt($('#k_' + k).value, 10); if (v) pr.koreksi[k] = Math.max(-30, Math.min(30, v)); });
    }
    simpanProfil(p, 'Isi website diperbarui');
    tutupEditor(); render(); D().toast('Profil tersimpan dan langsung tampil');
  });

  window.PROFIL = { buka: buka, tutup: tutup, contoh: contoh, normal: normalProfil, aktif: function () { return aktifId; }, render: function () { if (aktifId) render(); } };
})();
