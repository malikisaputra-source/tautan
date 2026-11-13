/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Direktori Rumah Ibadah — logika aplikasi (HTML/CSS/JS murni, data di localStorage). Lihat SKILL.md untuk peta kode. */
(function () {
  'use strict';
  // ---------- Utilitas ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  var tglFmt = function (t) { return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); };
  var jamFmt = function (t) { return new Date(t).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); };
  function hashPin(nama, pin) { // penanda sederhana, BUKAN kriptografi
    var s = nama.toLowerCase().trim() + ':' + pin, h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  var toastT;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('tampil'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('tampil'); }, 2800); }
  function jarakKm(a, b) {
    var R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  var jarakFmt = function (km) { return km < 1 ? Math.round(km * 1000 / 10) * 10 + ' m' : km.toFixed(1).replace('.', ',') + ' km'; };

  // ---------- Jenis & fasilitas ----------
  var JENIS = {
    masjid: { nama: 'Masjid', ikon: 'j-masjid', wudu: true },
    musala: { nama: 'Musala', ikon: 'j-musala', wudu: true },
    gereja: { nama: 'Gereja', ikon: 'j-gereja' },
    pura: { nama: 'Pura', ikon: 'j-pura' },
    vihara: { nama: 'Vihara', ikon: 'j-vihara' },
    klenteng: { nama: 'Klenteng', ikon: 'j-klenteng' }
  };
  var URUT_JENIS = Object.keys(JENIS);
  var FAS = { parkir: ['Parkir', 'f-parkir'], kursiRoda: ['Akses kursi roda', 'f-kursi'], toilet: ['Toilet', 'f-toilet'], wudu: ['Tempat wudu', 'f-wudu'] };
  var warna = function (j) { return 'var(--j-' + j + ')'; };
  var ikonJ = function (j, kelas) { return '<span class="' + (kelas || 'ikon-j') + '" style="--warna:' + warna(j) + '"><svg aria-hidden="true"><use href="#' + JENIS[j].ikon + '"/></svg></span>'; };
  var fasRelevan = function (j) { return Object.keys(FAS).filter(function (k) { return k !== 'wudu' || JENIS[j].wudu; }); };

  // ---------- Data ----------
  var KUNCI = 'direktoriIbadah.v1', VERSI = 2, PUSAT = { lat: -6.9825, lng: 107.7485 }, KOTA = 'Kota Lembah Sari';
  function dataKosong() { return { versi: VERSI, tempat: [], antrean: [], member: [{ id: 'adm', nama: 'Pengurus Kota', pin: hashPin('Pengurus Kota', '1234'), peran: 'admin' }], sesi: null }; }
  function t(nama, jenis, alamat, lat, lng, jam, kegiatan, fas, kontak, hariLalu) {
    var w = Date.now() - hariLalu * 864e5;
    return { id: uid(), nama: nama, jenis: jenis, alamat: alamat, lat: lat, lng: lng, jam: jam, kegiatan: kegiatan, fasilitas: fas, kontak: kontak, foto: '', diperbarui: w,
      riwayat: [{ t: w, oleh: 'Pengurus Kota', aksi: 'Ditambahkan', ket: 'Data awal direktori' }] };
  }
  function dataContoh() {
    var D = dataKosong();
    var f = function (p, k, tl, w) { return { parkir: !!p, kursiRoda: !!k, toilet: !!tl, wudu: !!w }; };
    D.tempat = [
      t('Masjid Raya Al-Hikmah', 'masjid', 'Jl. Alun-Alun Timur No. 1, Lembah Sari Tengah', -6.9812, 107.7479, ['Salat lima waktu berjamaah', 'Jumat 11.45 — salat Jumat', 'Ahad 05.30 — kajian subuh'], 'Kajian Kamis malam, TPA anak sore hari', f(1, 1, 1, 1), '0812-3301-4410', 3),
      t('Musala Nurul Iman', 'musala', 'Kios Blok C, Pasar Baru Lembah Sari', -6.9851, 107.7512, ['Salat lima waktu', 'Buka mengikuti jam pasar 05.00–17.00'], '', f(0, 0, 1, 1), '', 12),
      t('Gereja Kristen Bukit Harapan', 'gereja', 'Jl. Cempaka Putih No. 18, Bukit Asri', -6.9771, 107.7531, ['Minggu 07.00 — ibadah umum', 'Minggu 17.00 — ibadah sore', 'Rabu 18.30 — persekutuan doa'], 'Paduan suara, sekolah Minggu', f(1, 1, 1), '0813-2255-7801', 6),
      t('Gereja Katolik Santa Maria', 'gereja', 'Jl. Merdeka No. 40, Lembah Sari Tengah', -6.9843, 107.7442, ['Sabtu 18.00 — misa', 'Minggu 06.30 & 09.00 — misa', 'Senin–Jumat 05.30 — misa harian'], 'Koor, kelompok kategorial', f(1, 1, 1), '022-8765-1203', 20),
      t('Pura Giri Kencana', 'pura', 'Jl. Bukit Sari No. 7, Giri Mulya', -6.9739, 107.7468, ['Setiap hari 06.00–18.00', 'Purnama & tilem — persembahyangan bersama'], 'Latihan tari & tabuh Minggu sore', f(1, 0, 1), '0857-1022-3348', 9),
      t('Vihara Dharma Sejati', 'vihara', 'Jl. Teratai No. 12, Sukarame', -6.9877, 107.7556, ['Minggu 09.00 — puja bakti', 'Uposatha — meditasi bersama 19.00'], 'Kelas meditasi pemula, sekolah Minggu Buddhis', f(1, 1, 1), '0821-4410-9091', 4),
      t('Klenteng Hok Tek Lembah Sari', 'klenteng', 'Jl. Pecinan No. 3, Pasar Lama', -6.9861, 107.7463, ['Buka setiap hari 06.00–20.00', 'Ce It & Cap Go — sembahyang bersama'], 'Barongsai, perayaan Imlek & Cap Go Meh', f(0, 1, 1), '', 15),
      t('Masjid Al-Falah Cempaka', 'masjid', 'Jl. Cempaka Raya No. 55, Bukit Asri', -6.9758, 107.7502, ['Salat lima waktu berjamaah', 'Jumat 11.50 — salat Jumat'], 'Pengajian ibu-ibu Selasa pagi', f(1, 0, 1, 1), '0819-3320-1144', 30),
      t('Gereja Pantekosta Kasih Karunia', 'gereja', 'Jl. Melati No. 21, Sukarame', -6.9899, 107.7497, ['Minggu 08.00 & 10.30 — ibadah raya', 'Jumat 19.00 — ibadah pemuda'], '', f(0, 1, 1), '0838-7741-0021', 11),
      t('Musala Al-Ikhlas Terminal', 'musala', 'Terminal Lembah Sari, sisi timur', -6.9795, 107.7578, ['Salat lima waktu', 'Buka 24 jam'], '', f(1, 1, 1, 1), '', 7),
      t('Masjid Thoriqussalam', 'masjid', 'Jl. Damai Sejahtera No. 27, Sukarame', -6.9832, 107.7525, ['Jumat 11.45 — khutbah & sholat Jumat', 'Ahad ba\'da Subuh — kajian tafsir'], 'Kajian pekanan, TPA anak, tahsin dewasa', f(1, 1, 1, 1), '0812-7700-2741', 2)
    ];
    // Profil website contoh (permintaan TikTok @taniaflorist7). id tetap supaya bisa dibuka lewat index.html?tempat=thoriqussalam
    var thq = D.tempat[D.tempat.length - 1]; thq.id = 'thoriqussalam';
    if (window.PROFIL) thq.profil = window.PROFIL.contoh(thq);
    D.member.push({ id: 'm1', nama: 'Rina Wulandari', pin: hashPin('Rina Wulandari', '1111'), peran: 'member' });
    var gk = D.tempat[3];
    D.antrean = [
      { id: uid(), tipe: 'baru', tempatId: null, oleh: 'Rina Wulandari', t: Date.now() - 36e5 * 5, status: 'menunggu',
        data: { nama: 'Vihara Metta Karuna', jenis: 'vihara', alamat: 'Jl. Kenanga No. 9, Giri Mulya', lat: -6.9726, lng: 107.7524, jam: ['Minggu 08.00 — puja bakti'], kegiatan: 'Dana makanan Jumat', fasilitas: f(1, 0, 1), kontak: '', foto: '' }, ket: 'Tempat baru, belum ada di peta' },
      { id: uid(), tipe: 'ubah', tempatId: gk.id, oleh: 'Rina Wulandari', t: Date.now() - 36e5 * 20, status: 'menunggu',
        data: Object.assign({}, gk, { jam: ['Sabtu 17.30 — misa', 'Minggu 06.30 & 09.00 — misa', 'Senin–Jumat 05.30 — misa harian'] }), ket: 'Misa Sabtu maju ke 17.30 mulai bulan ini' },
      { id: uid(), tipe: 'ubah', tempatId: D.tempat[0].id, oleh: 'Rina Wulandari', t: Date.now() - 864e5 * 3, status: 'disetujui', diputus: Date.now() - 864e5 * 3 + 36e5, oleh2: 'Pengurus Kota',
        data: {}, ket: 'Tambah fasilitas akses kursi roda' }
    ];
    D.tempat[0].riwayat.push({ t: Date.now() - 864e5 * 3 + 36e5, oleh: 'Rina Wulandari', aksi: 'Diperbarui', ket: 'Tambah fasilitas akses kursi roda (disetujui Pengurus Kota)' });
    return D;
  }
  var D;
  function muat() {
    try { D = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { D = null; }
    if (!D || !Array.isArray(D.tempat)) { D = dataContoh(); simpan(); return; }
    // Migrasi: lengkapi field yang belum ada (jangan hapus data pengguna)
    var k = dataKosong();
    Object.keys(k).forEach(function (x) { if (D[x] === undefined) D[x] = k[x]; });
    D.tempat.forEach(normalTempat);
    if (!D.member.some(function (m) { return m.peran === 'admin'; })) D.member.unshift(k.member[0]);
    // v1 → v2: data contoh lama mendapat Masjid Thoriqussalam (contoh website). Data buatan pengguna tidak disentuh.
    if ((D.versi || 1) < 2 && !cariTempat('thoriqussalam') && D.tempat.some(function (p) { return p.nama === 'Masjid Raya Al-Hikmah'; })) {
      var c = dataContoh().tempat.filter(function (p) { return p.id === 'thoriqussalam'; })[0]; if (c) D.tempat.push(c);
    }
    D.versi = VERSI; simpan();
  }
  function normalTempat(p) {
    if (!p.id) p.id = uid();
    if (!JENIS[p.jenis]) p.jenis = 'masjid';
    if (typeof p.jam === 'string') p.jam = p.jam.split(/\n|;/).map(function (s) { return s.trim(); }).filter(Boolean);
    p.jam = p.jam || []; p.fasilitas = p.fasilitas || {}; p.riwayat = p.riwayat || [];
    p.lat = +p.lat; p.lng = +p.lng; p.diperbarui = p.diperbarui || Date.now();
    ['kegiatan', 'kontak', 'foto', 'alamat'].forEach(function (f) { if (p[f] == null) p[f] = ''; });
    if (p.profil === undefined) p.profil = null; // isi website (profil.js) — dibuat saat pertama dibuka
    return p;
  }
  function simpan() {
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); }
    catch (e) { toast('Penyimpanan penuh — coba hapus beberapa foto atau ekspor data'); }
  }
  var saya = function () { return D.member.filter(function (m) { return m.id === D.sesi; })[0] || null; };
  var isAdmin = function () { var m = saya(); return !!(m && m.peran === 'admin'); };
  var cariTempat = function (id) { return D.tempat.filter(function (p) { return p.id === id; })[0]; };

  // ---------- Navigasi ----------
  var halAktif = 'jelajah';
  function buka(h, opsi) {
    if (['jelajah', 'ajukan', 'moderasi', 'data'].indexOf(h) < 0) h = 'jelajah';
    halAktif = h;
    $$('.hal').forEach(function (s) { s.hidden = s.id !== 'hal-' + h; });
    $$('.nav').forEach(function (b) { var a = b.dataset.hal === h; b.classList.toggle('aktif', a); if (a) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h);
    if (h === 'jelajah') { renderJelajah(); setTimeout(function () { if (peta) peta.invalidateSize(); }, 30); }
    if (h === 'ajukan') siapkanForm(opsi && opsi.ubah);
    if (h === 'moderasi') renderModerasi();
    if (h === 'data') renderData();
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var n = e.target.closest('.nav'); if (n) { buka(n.dataset.hal); return; }
    var a = e.target.closest('[data-aksi="masuk"]'); if (a) bukaMasuk();
  });
  $('.merek').addEventListener('click', function (e) { e.preventDefault(); buka('jelajah'); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (h !== halAktif) buka(h); });

  // ---------- Akun ----------
  function renderAkun() {
    var m = saya();
    $('#namaAkun').textContent = m ? m.nama : 'Masuk';
    $('#avatar').innerHTML = m ? esc(m.nama.split(' ').map(function (s) { return s[0]; }).join('').slice(0, 2).toUpperCase()) : '<svg><use href="#i-orang"/></svg>';
    $('#tAkun').setAttribute('aria-label', m ? 'Akun: ' + m.nama + '. Ketuk untuk keluar' : 'Masuk atau daftar member');
    var n = D.antrean.filter(function (u) { return u.status === 'menunggu'; }).length;
    $$('[data-antre]').forEach(function (e) { e.textContent = n; e.hidden = !n; });
    var tb = $('[data-antre-tab]'); if (tb) tb.textContent = n ? '(' + n + ')' : '';
  }
  $('#tAkun').onclick = function () {
    var m = saya();
    if (!m) return bukaMasuk();
    modal('Keluar dari akun?', '<p>Kamu masuk sebagai <b>' + esc(m.nama) + '</b> (' + (m.peran === 'admin' ? 'pengurus' : 'member') + ').</p>', 'Keluar', function () { D.sesi = null; simpan(); renderAkun(); segarkan(); toast('Sudah keluar'); });
  };
  function bukaMasuk(lanjut) {
    modal('Masuk sebagai member', '<p>Belum punya akun? Isi nama baru dan buat PIN — akun langsung dibuat.</p>' +
      '<div class="ruas"><label for="mNama">Nama</label><input id="mNama" autocomplete="name" maxlength="40"></div>' +
      '<div class="ruas"><label for="mPin">PIN (4–6 angka)</label><input id="mPin" inputmode="numeric" type="password" maxlength="6" autocomplete="off"></div>' +
      '<small class="galat" id="mGalat" role="alert"></small>', 'Masuk', function () {
        var nama = $('#mNama').value.trim().replace(/\s+/g, ' '), pin = $('#mPin').value.trim(), g = $('#mGalat');
        if (nama.length < 3) { g.textContent = 'Nama minimal 3 huruf.'; $('#mNama').focus(); return false; }
        if (!/^\d{4,6}$/.test(pin)) { g.textContent = 'PIN harus 4–6 angka.'; $('#mPin').focus(); return false; }
        var ada = D.member.filter(function (x) { return x.nama.toLowerCase() === nama.toLowerCase(); })[0];
        if (ada && ada.pin !== hashPin(nama, pin)) { g.textContent = 'PIN tidak cocok untuk nama ini.'; $('#mPin').value = ''; $('#mPin').focus(); return false; }
        if (!ada) { ada = { id: uid(), nama: nama, pin: hashPin(nama, pin), peran: 'member' }; D.member.push(ada); toast('Akun dibuat. Selamat datang, ' + nama.split(' ')[0] + '!'); }
        else toast('Selamat datang kembali, ' + ada.nama.split(' ')[0]);
        D.sesi = ada.id; simpan(); renderAkun(); segarkan(); if (lanjut) lanjut();
      });
    setTimeout(function () { $('#mNama').focus(); }, 60);
  }
  function segarkan() { if (window.PROFIL && PROFIL.aktif()) { PROFIL.render(); return; } if (halAktif === 'ajukan') siapkanForm(formUbahId ? cariTempat(formUbahId) : null); else buka(halAktif); }

  // ---------- Modal umum ----------
  var modalOk = null, fokusModal = null;
  function modal(judul, html, tombol, ok, gaya) {
    fokusModal = document.activeElement;
    $('#mJudul').textContent = judul; $('#mIsi').innerHTML = html; $('#mOk').textContent = tombol || 'OK';
    $('#mOk').className = 'tbl ' + (gaya || 'tbl-utama'); modalOk = ok; $('#modal').hidden = false;
    setTimeout(function () { var f = $('#mIsi input'); (f || $('#mOk')).focus(); }, 40);
  }
  function tutupModal() { $('#modal').hidden = true; modalOk = null; if (fokusModal && fokusModal.focus) fokusModal.focus(); }
  $('#mBatal').onclick = tutupModal;
  $('#mOk').onclick = function () { var f = modalOk; if (f && f() === false) return; tutupModal(); };
  $('#modal').addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); $('#mOk').click(); } });
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') tutupModal(); });

  // ---------- JELAJAH ----------
  var filterJ = 'semua', kataCari = '', lokasiSaya = null, peta = null, lapisPin = null, pinSaya = null, penanda = {};
  function tersaring() {
    var q = kataCari.toLowerCase();
    var l = D.tempat.filter(function (p) {
      if (filterJ !== 'semua' && p.jenis !== filterJ) return false;
      if (!q) return true;
      return (p.nama + ' ' + p.alamat + ' ' + p.kegiatan + ' ' + p.jam.join(' ') + ' ' + JENIS[p.jenis].nama).toLowerCase().indexOf(q) >= 0;
    });
    if (lokasiSaya) { l.forEach(function (p) { p._km = jarakKm(lokasiSaya, p); }); l.sort(function (a, b) { return a._km - b._km; }); }
    else l.sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
    return l;
  }
  function renderFilter() {
    var hit = {}; D.tempat.forEach(function (p) { hit[p.jenis] = (hit[p.jenis] || 0) + 1; });
    $('#filter').innerHTML = '<button type="button" class="chip semua" data-j="semua" aria-pressed="' + (filterJ === 'semua') + '">Semua <span class="n">' + D.tempat.length + '</span></button>' +
      URUT_JENIS.map(function (j) { return '<button type="button" class="chip" style="--warna:' + warna(j) + '" data-j="' + j + '" aria-pressed="' + (filterJ === j) + '">' + ikonJ(j) + JENIS[j].nama + ' <span class="n">' + (hit[j] || 0) + '</span></button>'; }).join('');
  }
  $('#filter').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; filterJ = b.dataset.j; renderJelajah(); });
  var cariT; $('#inCari').addEventListener('input', function (e) { clearTimeout(cariT); cariT = setTimeout(function () { kataCari = e.target.value.trim(); renderDaftar(); renderPin(); }, 120); });
  function kartuHTML(p, i) {
    var fs = fasRelevan(p.jenis).filter(function (k) { return p.fasilitas[k]; });
    return '<li><button type="button" class="kartu-tempat" style="--warna:' + warna(p.jenis) + ';--i:' + Math.min(i, 12) + '" data-id="' + p.id + '">' +
      '<span class="thumb">' + (p.foto ? '<img src="' + esc(p.foto) + '" alt="">' : '<svg aria-hidden="true"><use href="#' + JENIS[p.jenis].ikon + '"/></svg>') + '</span>' +
      '<span class="info"><span class="label-jenis"><i></i>' + JENIS[p.jenis].nama + '</span><b>' + esc(p.nama) + '</b><span class="alamat">' + esc(p.alamat) + '</span>' +
      (fs.length ? '<span class="fas-mini">' + fs.map(function (k) { return '<svg role="img" aria-label="' + FAS[k][0] + '"><use href="#' + FAS[k][1] + '"/></svg>'; }).join('') + '</span>' : '') + '</span>' +
      (lokasiSaya ? '<span class="jarak">' + jarakFmt(p._km) + '</span>' : '') + '</button></li>';
  }
  function renderDaftar() {
    var l = tersaring();
    $('#jumlah').textContent = l.length + ' tempat' + (lokasiSaya ? ' · urut terdekat' : '');
    $('#daftar').innerHTML = l.length ? l.map(kartuHTML).join('') :
      '<li class="kosong"><svg><use href="#i-kosong"/></svg><b>' + (D.tempat.length ? 'Tidak ada yang cocok' : 'Direktori masih kosong') + '</b>' +
      (D.tempat.length ? 'Coba kata lain atau pilih "Semua".' : 'Jadilah yang pertama mengajukan rumah ibadah di kotamu.') +
      '<div class="deret" style="justify-content:center"><button class="tbl tbl-garis kecil" type="button" data-ke="ajukan"><svg><use href="#i-plus"/></svg>Ajukan tempat</button></div></li>';
  }
  $('#daftar').addEventListener('click', function (e) {
    var k = e.target.closest('.kartu-tempat'); if (k) { bukaDetail(k.dataset.id); return; }
    if (e.target.closest('[data-ke="ajukan"]')) buka('ajukan');
  });
  $('#daftar').addEventListener('mouseover', function (e) { var k = e.target.closest('.kartu-tempat'); $$('.pin.aktif').forEach(function (x) { x.classList.remove('aktif'); }); if (k && penanda[k.dataset.id]) { var el = penanda[k.dataset.id].getElement(); if (el) el.querySelector('.pin').classList.add('aktif'); } });
  function renderJelajah() { renderFilter(); renderDaftar(); renderPin(); }

  function pinIkon(j) { return L.divIcon({ className: '', html: '<div class="pin" style="--warna:' + warna(j) + '"><svg><use href="#' + JENIS[j].ikon + '"/></svg></div>', iconSize: [40, 48], iconAnchor: [20, 46] }); }
  function lapisanUbin() {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' });
  }
  function siapkanPeta() {
    if (typeof L === 'undefined') { $('#petaGagal').hidden = false; return; }
    peta = L.map('peta', { zoomControl: true, scrollWheelZoom: true }).setView([PUSAT.lat, PUSAT.lng], 15);
    lapisanUbin().addTo(peta);
    lapisPin = L.layerGroup().addTo(peta);
  }
  function renderPin() {
    if (!peta) return;
    lapisPin.clearLayers(); penanda = {};
    var l = tersaring(), b = [];
    l.forEach(function (p) {
      if (isNaN(p.lat) || isNaN(p.lng)) return;
      var m = L.marker([p.lat, p.lng], { icon: pinIkon(p.jenis), title: p.nama, alt: JENIS[p.jenis].nama + ': ' + p.nama, keyboard: true }).addTo(lapisPin);
      m.on('click', function () { bukaDetail(p.id); });
      m.on('mouseover', function () { var k = $('.kartu-tempat[data-id="' + p.id + '"]'); if (k) k.classList.add('sorot-peta'); });
      m.on('mouseout', function () { $$('.sorot-peta').forEach(function (x) { x.classList.remove('sorot-peta'); }); });
      penanda[p.id] = m; b.push([p.lat, p.lng]);
    });
    if (lokasiSaya) b.push([lokasiSaya.lat, lokasiSaya.lng]);
    if (b.length > 1) peta.fitBounds(b, { padding: [50, 50], maxZoom: 16, animate: !kurangGerak() });
    else if (b.length === 1) peta.setView(b[0], 16);
  }
  var kurangGerak = function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; };

  $('#tDekat').onclick = function () {
    var tb = this;
    if (lokasiSaya) { lokasiSaya = null; tb.setAttribute('aria-pressed', 'false'); if (pinSaya) { pinSaya.remove(); pinSaya = null; } renderDaftar(); renderPin(); return; }
    var pakai = function (pos, contoh) {
      lokasiSaya = pos; tb.setAttribute('aria-pressed', 'true');
      if (peta) { if (pinSaya) pinSaya.remove(); pinSaya = L.marker([pos.lat, pos.lng], { icon: L.divIcon({ className: '', html: '<div class="pin-saya"></div>', iconSize: [20, 20], iconAnchor: [10, 10] }), title: 'Lokasi saya', interactive: false }).addTo(peta); }
      renderDaftar(); renderPin();
      toast(contoh ? 'Lokasi asli tidak tersedia — memakai titik pusat kota contoh' : 'Diurutkan dari yang terdekat');
    };
    if (!navigator.geolocation) { pakai(PUSAT, true); return; }
    tb.disabled = true; $('span', tb).textContent = 'Mencari lokasi…';
    navigator.geolocation.getCurrentPosition(function (p) {
      tb.disabled = false; $('span', tb).textContent = 'Terdekat dari saya';
      var pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      // Data contoh ada di kota fiktif: kalau kamu jauh (>50 km), pakai pusat kota contoh supaya demo tetap masuk akal
      if (D.tempat.length && Math.min.apply(null, D.tempat.map(function (x) { return jarakKm(pos, x); })) > 50) { pakai({ lat: PUSAT.lat - 0.002, lng: PUSAT.lng + 0.003 }, true); return; }
      pakai(pos);
    }, function () { tb.disabled = false; $('span', tb).textContent = 'Terdekat dari saya'; pakai({ lat: PUSAT.lat - 0.002, lng: PUSAT.lng + 0.003 }, true); }, { timeout: 8000, maximumAge: 60000 });
  };
  $$('.tukar button').forEach(function (b) {
    b.onclick = function () {
      $('.jelajah').dataset.tampil = b.dataset.tampil;
      $$('.tukar button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (peta) setTimeout(function () { peta.invalidateSize(); renderPin(); }, 30);
    };
  });

  // ---------- Detail ----------
  var fokusDetail = null, detailId = null;
  function bukaDetail(id) {
    var p = cariTempat(id); if (!p) return;
    detailId = id; fokusDetail = document.activeElement;
    var fs = fasRelevan(p.jenis);
    var arah = 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng;
    var tel = p.kontak ? p.kontak.replace(/[^\d+]/g, '') : '';
    $('#detailIsi').innerHTML =
      '<div class="hero-detail" style="--warna:' + warna(p.jenis) + '">' +
      '<button class="tutup-detail" type="button" id="tTutupDetail" aria-label="Tutup detail"><svg><use href="#i-kiri"/></svg></button>' +
      (p.foto ? '<img src="' + esc(p.foto) + '" alt="Foto ' + esc(p.nama) + '">' : '<svg class="bukit" viewBox="0 0 460 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40c80-30 160-30 240-10s150 10 220-14v44H0z"/></svg><svg class="siluet" aria-hidden="true"><use href="#' + JENIS[p.jenis].ikon + '"/></svg>') +
      '</div><div class="detail-badan">' +
      '<div><span class="label-jenis" style="--warna:' + warna(p.jenis) + '"><i></i>' + JENIS[p.jenis].nama + '</span><h2 id="dNama">' + esc(p.nama) + '</h2>' +
      '<p class="sub" style="margin-top:6px">' + esc(p.alamat) + '</p>' + (lokasiSaya ? '<p class="jarak" style="margin-top:4px">' + jarakFmt(jarakKm(lokasiSaya, p)) + ' dari kamu</p>' : '') + '</div>' +
      '<div class="aksi-detail"><a class="tbl tbl-utama" data-bagian="utama" href="' + arah + '" target="_blank" rel="noopener"><svg><use href="#i-arah"/></svg>Petunjuk arah (Google Maps)</a>' +
      (tel ? '<a class="tbl tbl-garis" href="tel:' + esc(tel) + '"><svg><use href="#i-telp"/></svg>Telepon</a>' : '<span></span>') +
      '<button class="tbl tbl-garis" type="button" id="tUsul"' + (tel ? '' : ' style="grid-column:1/-1"') + '><svg><use href="#i-edit"/></svg>Usulkan perubahan</button>' +
      '<button class="tbl tbl-website" type="button" id="tSitus"><svg><use href="#i-web"/></svg>Jadikan website<small>halaman profil + jadwal, kegiatan, infak</small></button></div>' +
      '<div class="blok"><h3><svg><use href="#i-jam"/></svg>Jam ibadah &amp; kegiatan</h3>' +
      (p.jam.length ? '<ul class="jadwal">' + p.jam.map(function (j) { return '<li>' + esc(j) + '</li>'; }).join('') + '</ul>' : '<p class="sub">Belum ada jadwal. Bantu lengkapi lewat "Usulkan perubahan".</p>') +
      (p.kegiatan ? '<p class="sub">' + esc(p.kegiatan) + '</p>' : '') + '</div>' +
      '<div class="blok"><h3>Fasilitas</h3><div class="fasilitas">' + fs.map(function (k) {
        var ada = !!p.fasilitas[k];
        return '<div class="fas' + (ada ? '' : ' tidak') + '"><svg aria-hidden="true"><use href="#' + FAS[k][1] + '"/></svg>' + FAS[k][0] + '<span class="sr">' + (ada ? ' tersedia' : ' tidak tersedia') + '</span></div>';
      }).join('') + '</div></div>' +
      (p.kontak ? '<div class="blok"><h3><svg><use href="#i-telp"/></svg>Kontak pengurus</h3><p>' + esc(p.kontak) + '</p></div>' : '') +
      '<div class="blok"><h3><svg><use href="#i-riwayat"/></svg>Riwayat perubahan</h3><ul class="riwayat">' +
      p.riwayat.slice().reverse().map(function (r) { return '<li><b>' + esc(r.aksi) + '</b> oleh ' + esc(r.oleh) + ' · ' + tglFmt(r.t) + (r.ket ? '<br>' + esc(r.ket) : '') + '</li>'; }).join('') + '</ul></div>' +
      '</div>';
    var d = $('#detail'); d.hidden = false; $('#selubung').hidden = false; d.classList.add('tutup');
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.remove('tutup'); }); });
    d.scrollTop = 0; $('#tTutupDetail').focus();
    $('#tTutupDetail').onclick = tutupDetail;
    $('#tUsul').onclick = function () { var x = p; tutupDetail(true); buka('ajukan', { ubah: x }); };
    $('#tSitus').onclick = function () { tutupDetail(true); if (window.PROFIL) PROFIL.buka(p.id); };
    if (peta && penanda[id]) peta.panTo([p.lat, p.lng], { animate: !kurangGerak() });
  }
  function tutupDetail(cepat) {
    var d = $('#detail'); if (d.hidden) return;
    d.classList.add('tutup'); $('#selubung').hidden = true; detailId = null;
    setTimeout(function () { d.hidden = true; }, cepat === true || kurangGerak() ? 0 : 420);
    if (cepat !== true && fokusDetail && fokusDetail.focus && document.contains(fokusDetail)) fokusDetail.focus();
  }
  $('#selubung').onclick = tutupDetail;
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('#modal').hidden) tutupModal(); else tutupDetail();
  });
  // jebakan fokus sederhana di detail & modal
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var wadah = !$('#modal').hidden ? $('#modal') : (!$('#detail').hidden ? $('#detail') : null); if (!wadah) return;
    var f = $$('a[href], button:not([disabled]), input, textarea, select', wadah).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return; var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });

  // ---------- AJUKAN (form tempat baru / usulan ubah) ----------
  var formUbahId = null, fotoData = '', petaKecil = null, pinKecil = null;
  function renderPilihJenis(j) {
    $('#pilihJenis').innerHTML = URUT_JENIS.map(function (k) {
      return '<label class="opsi-jenis" style="--warna:' + warna(k) + '"><input type="radio" name="jenis" value="' + k + '"' + (k === j ? ' checked' : '') + '><span>' + ikonJ(k) + JENIS[k].nama + '</span></label>';
    }).join('');
  }
  function renderCekFas(j, isi) {
    $('#cekFas').innerHTML = fasRelevan(j).map(function (k) {
      return '<label class="cek"><input type="checkbox" name="fas" value="' + k + '"' + (isi && isi[k] ? ' checked' : '') + '><svg aria-hidden="true"><use href="#' + FAS[k][1] + '"/></svg>' + FAS[k][0] + '</label>';
    }).join('');
  }
  $('#pilihJenis').addEventListener('change', function () {
    var isi = {}; $$('#cekFas input').forEach(function (c) { isi[c.value] = c.checked; });
    renderCekFas(jenisDipilih(), isi);
  });
  var jenisDipilih = function () { var r = $('#pilihJenis input:checked'); return r ? r.value : 'masjid'; };
  function setTitik(lat, lng, geser) {
    $('#fLat').value = (+lat).toFixed(6); $('#fLng').value = (+lng).toFixed(6);
    if (petaKecil) { if (pinKecil) pinKecil.setLatLng([lat, lng]); else pinKecil = L.marker([lat, lng], { icon: pinIkon(jenisDipilih()), draggable: true }).addTo(petaKecil).on('dragend', function (e) { var g = e.target.getLatLng(); setTitik(g.lat, g.lng); }); if (geser) petaKecil.setView([lat, lng], 16); }
  }
  function siapkanForm(ubah) {
    var masuk = !!saya();
    $('#perluMasuk').hidden = masuk;
    $('#formTempat').hidden = !masuk;
    formUbahId = ubah ? ubah.id : null;
    $('#jdlAjukan').textContent = ubah ? 'Usulkan perubahan' : 'Ajukan tempat baru';
    $('#subAjukan').textContent = ubah ? 'Perbarui data ' + ubah.nama + '. Perubahan tampil setelah disetujui pengurus.' : 'Tambahkan rumah ibadah yang belum ada. Pengurus akan mengecek sebelum tampil di direktori.';
    $('#ruasAlasan').hidden = !ubah;
    if (!masuk) return;
    var p = ubah || { jenis: 'masjid', nama: '', alamat: '', lat: PUSAT.lat, lng: PUSAT.lng, jam: [], kegiatan: '', fasilitas: {}, kontak: '', foto: '' };
    renderPilihJenis(p.jenis); renderCekFas(p.jenis, p.fasilitas);
    $('#fNama').value = p.nama; $('#fAlamat').value = p.alamat; $('#fJam').value = p.jam.join('\n'); $('#fKegiatan').value = p.kegiatan; $('#fKontak').value = p.kontak; $('#fAlasan').value = '';
    fotoData = p.foto || ''; tampilFoto();
    $$('.galat').forEach(function (g) { g.textContent = ''; }); $$('[aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); });
    if (typeof L !== 'undefined') {
      if (!petaKecil) {
        petaKecil = L.map('petaKecil', { scrollWheelZoom: false }).setView([p.lat, p.lng], 15); lapisanUbin().addTo(petaKecil);
        petaKecil.on('click', function (e) { setTitik(e.latlng.lat, e.latlng.lng); });
      }
      setTimeout(function () { petaKecil.invalidateSize(); setTitik(p.lat, p.lng, true); }, 40);
    } else { $('#petaKecil').hidden = true; setTitik(p.lat, p.lng); }
  }
  $('#fLat').addEventListener('change', function () { var a = parseFloat($('#fLat').value.replace(',', '.')), b = parseFloat($('#fLng').value.replace(',', '.')); if (!isNaN(a) && !isNaN(b)) setTitik(a, b, true); });
  $('#fLng').addEventListener('change', function () { $('#fLat').dispatchEvent(new Event('change')); });
  $('#tLokasiSaya').onclick = function () {
    if (!navigator.geolocation) { toast('Browser tidak mendukung lokasi'); return; }
    var b = this; b.disabled = true;
    navigator.geolocation.getCurrentPosition(function (p) { b.disabled = false; setTitik(p.coords.latitude, p.coords.longitude, true); toast('Titik dipindah ke lokasimu'); },
      function () { b.disabled = false; toast('Izin lokasi ditolak — ketuk peta untuk memilih titik'); }, { timeout: 8000 });
  };
  function tampilFoto() {
    $('#fotoPrev').innerHTML = fotoData ? '<img src="' + fotoData + '" alt="Pratinjau foto">' : '<svg><use href="#i-foto"/></svg>';
    $('#tHapusFoto').hidden = !fotoData;
  }
  $('#tHapusFoto').onclick = function () { fotoData = ''; tampilFoto(); };
  $('#fFoto').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    if (!/^image\//.test(f.type)) { toast('Pilih berkas gambar'); return; }
    var img = new Image(), url = URL.createObjectURL(f);
    img.onload = function () {
      var s = Math.min(1, 720 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      fotoData = c.toDataURL('image/jpeg', 0.72); URL.revokeObjectURL(url); tampilFoto();
    };
    img.onerror = function () { toast('Gambar tidak bisa dibaca'); };
    img.src = url;
  });
  $('#tBatalForm').onclick = function () { buka('jelajah'); };
  function galat(id, m) { var i = $('#' + id); i.setAttribute('aria-invalid', 'true'); $('[data-galat="' + id + '"]').textContent = m; return i; }
  $('#formTempat').addEventListener('submit', function (e) {
    e.preventDefault();
    $$('.galat').forEach(function (g) { g.textContent = ''; }); $$('[aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); });
    var nama = $('#fNama').value.trim(), alamat = $('#fAlamat').value.trim();
    var lat = parseFloat($('#fLat').value.replace(',', '.')), lng = parseFloat($('#fLng').value.replace(',', '.')), salah = [];
    if (nama.length < 3) salah.push(galat('fNama', 'Nama tempat minimal 3 huruf.'));
    if (alamat.length < 5) salah.push(galat('fAlamat', 'Tulis alamat supaya orang bisa menemukan.'));
    if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) salah.push(galat('fLat', 'Titik lokasi belum benar — ketuk peta kecil.'));
    if (salah.length) { salah[0].focus(); toast('Ada isian yang perlu dibetulkan'); return; }
    var j = jenisDipilih(), fas = {};
    $$('#cekFas input').forEach(function (c) { fas[c.value] = c.checked; });
    var data = { nama: nama, jenis: j, alamat: alamat, lat: lat, lng: lng, jam: $('#fJam').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
      kegiatan: $('#fKegiatan').value.trim(), fasilitas: fas, kontak: $('#fKontak').value.trim(), foto: fotoData };
    if (formUbahId) {
      var lama = cariTempat(formUbahId);
      if (!daftarBeda(lama, data).length) { toast('Belum ada yang diubah'); return; }
    }
    D.antrean.unshift({ id: uid(), tipe: formUbahId ? 'ubah' : 'baru', tempatId: formUbahId, oleh: saya().nama, t: Date.now(), status: 'menunggu', data: data, ket: $('#fAlasan').value.trim() });
    simpan(); renderAkun();
    toast(formUbahId ? 'Usulan perubahan terkirim ke pengurus' : 'Terima kasih! Tempat baru menunggu dicek pengurus');
    buka(isAdmin() ? 'moderasi' : 'jelajah');
  });

  // ---------- MODERASI ----------
  var tabMod = 'menunggu';
  var LABEL_F = { nama: 'Nama', jenis: 'Jenis', alamat: 'Alamat', lat: 'Lintang', lng: 'Bujur', jam: 'Jadwal', kegiatan: 'Kegiatan', fasilitas: 'Fasilitas', kontak: 'Kontak', foto: 'Foto' };
  function nilaiTeks(k, v, j) {
    if (k === 'jenis') return JENIS[v] ? JENIS[v].nama : v;
    if (k === 'jam') return (v || []).join('; ') || '—';
    if (k === 'fasilitas') return fasRelevan(j || 'masjid').filter(function (x) { return v && v[x]; }).map(function (x) { return FAS[x][0]; }).join(', ') || 'tidak ada';
    if (k === 'foto') return v ? 'ada foto' : 'tanpa foto';
    if (k === 'lat' || k === 'lng') return (+v).toFixed(5);
    return v || '—';
  }
  function daftarBeda(lama, baru) {
    return Object.keys(LABEL_F).filter(function (k) { return nilaiTeks(k, lama[k], lama.jenis) !== nilaiTeks(k, baru[k], baru.jenis); });
  }
  function renderModerasi() {
    var adm = isAdmin();
    $('#perluAdmin').hidden = adm; $('#isiModerasi').hidden = !adm;
    renderAkun();
    if (!adm) return;
    $$('.tab-kecil button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === tabMod)); });
    var l = D.antrean.filter(function (u) { return tabMod === 'menunggu' ? u.status === 'menunggu' : u.status !== 'menunggu'; });
    if (tabMod === 'riwayat') l.sort(function (a, b) { return (b.diputus || b.t) - (a.diputus || a.t); });
    $('#antrean').innerHTML = l.length ? l.map(function (u, i) {
      var p = u.tempatId ? cariTempat(u.tempatId) : null, d = u.data || {}, j = d.jenis || (p && p.jenis) || 'masjid';
      var isi = '';
      if (u.tipe === 'baru' && d.nama) isi = '<dl class="beda">' + ['alamat', 'jam', 'fasilitas', 'kontak'].map(function (k) { return '<div><dt>' + LABEL_F[k] + '</dt><dd style="margin:0">' + esc(nilaiTeks(k, d[k], j)) + '</dd></div>'; }).join('') + '</dl>';
      else if (u.tipe === 'ubah' && p && d.nama) {
        var bd = daftarBeda(p, d);
        isi = bd.length ? '<dl class="beda">' + bd.map(function (k) { return '<div><dt>' + LABEL_F[k] + '</dt><dd style="margin:0"><del>' + esc(nilaiTeks(k, p[k], p.jenis)) + '</del><br><ins>' + esc(nilaiTeks(k, d[k], j)) + '</ins></dd></div>'; }).join('') + '</dl>' : (u.status === 'menunggu' ? '<p class="catatan">Data sudah sama dengan yang tampil sekarang.</p>' : '');
      }
      var stat = u.status === 'menunggu' ? '<span class="status ' + u.tipe + '">' + (u.tipe === 'baru' ? 'Tempat baru' : 'Perubahan') + '</span>' : '<span class="status ' + u.status + '">' + (u.status === 'disetujui' ? 'Disetujui' : 'Ditolak') + '</span>';
      return '<li class="usulan panel" style="--i:' + i + '" data-id="' + u.id + '"><div class="usulan-atas">' + ikonJ(j) + '<div><b>' + esc(d.nama || (p && p.nama) || 'Tempat') + '</b>' +
        '<span class="meta">Diajukan ' + esc(u.oleh) + ' · ' + jamFmt(u.t) + (u.diputus ? ' · diputus ' + esc(u.oleh2 || '') + ' ' + jamFmt(u.diputus) : '') + '</span></div>' + stat + '</div>' +
        (u.ket ? '<p class="catatan">“' + esc(u.ket) + '”</p>' : '') + isi + (u.alasanTolak ? '<p class="catatan">Alasan ditolak: ' + esc(u.alasanTolak) + '</p>' : '') +
        (u.status === 'menunggu' ? '<div class="aksi-form"><button class="tbl tbl-bahaya kecil" type="button" data-putus="tolak"><svg><use href="#i-x"/></svg>Tolak</button><button class="tbl tbl-oke kecil" type="button" data-putus="setuju"><svg><use href="#i-cek"/></svg>Setujui</button></div>' : '') + '</li>';
    }).join('') : '<li class="kosong"><svg><use href="#i-perisai"/></svg><b>' + (tabMod === 'menunggu' ? 'Antrean bersih' : 'Belum ada keputusan') + '</b>' + (tabMod === 'menunggu' ? 'Semua usulan sudah dicek. Terima kasih sudah menjaga data tetap rapi.' : 'Keputusan setujui/tolak akan tercatat di sini.') + '</li>';
  }
  $('.tab-kecil').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (!b) return; tabMod = b.dataset.tab; renderModerasi(); });
  $('.tab-kecil').addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { tabMod = tabMod === 'menunggu' ? 'riwayat' : 'menunggu'; renderModerasi(); $('[data-tab="' + tabMod + '"]').focus(); } });
  $('#antrean').addEventListener('click', function (e) {
    var b = e.target.closest('[data-putus]'); if (!b || !isAdmin()) return;
    var li = b.closest('.usulan'), u = D.antrean.filter(function (x) { return x.id === li.dataset.id; })[0]; if (!u) return;
    var selesai = function () { li.classList.add('keluar'); setTimeout(function () { simpan(); renderModerasi(); }, kurangGerak() ? 0 : 340); };
    if (b.dataset.putus === 'setuju') {
      var oleh = saya().nama, ket = (u.ket ? u.ket + ' ' : '') + '(disetujui ' + oleh + ')';
      if (u.tipe === 'baru') {
        var p = normalTempat(Object.assign({ id: uid() }, u.data)); p.diperbarui = Date.now();
        p.riwayat = [{ t: Date.now(), oleh: u.oleh, aksi: 'Ditambahkan', ket: ket }]; D.tempat.push(p); u.tempatId = p.id;
      } else {
        var lama = cariTempat(u.tempatId);
        if (!lama) { toast('Tempat aslinya sudah tidak ada'); return; }
        var bd = daftarBeda(lama, u.data).map(function (k) { return LABEL_F[k]; });
        ['nama', 'jenis', 'alamat', 'lat', 'lng', 'jam', 'kegiatan', 'fasilitas', 'kontak', 'foto'].forEach(function (k) { if (u.data[k] !== undefined) lama[k] = u.data[k]; });
        lama.diperbarui = Date.now(); lama.riwayat.push({ t: Date.now(), oleh: u.oleh, aksi: 'Diperbarui', ket: (bd.length ? bd.join(', ') + ' — ' : '') + ket });
      }
      u.status = 'disetujui'; u.diputus = Date.now(); u.oleh2 = oleh; toast('Disetujui dan langsung tampil di direktori'); selesai();
    } else {
      modal('Tolak usulan?', '<p>Tulis alasan singkat supaya pengusul paham.</p><div class="ruas"><label for="mAlasan">Alasan</label><input id="mAlasan" maxlength="140" placeholder="mis. Tempat sudah ada di direktori"></div>', 'Tolak usulan', function () {
        u.status = 'ditolak'; u.diputus = Date.now(); u.oleh2 = saya().nama; u.alasanTolak = $('#mAlasan').value.trim() || 'Tanpa alasan';
        toast('Usulan ditolak dan dicatat di riwayat'); selesai();
      }, 'tbl-bahaya');
    }
    renderAkun();
  });

  // ---------- DATA (ekspor/impor) ----------
  function renderData() {
    $('#daftarMember').innerHTML = D.member.map(function (m) {
      return '<li><span class="avatar">' + esc(m.nama.split(' ').map(function (s) { return s[0]; }).join('').slice(0, 2).toUpperCase()) + '</span>' + esc(m.nama) + (m.id === D.sesi ? ' <small class="meta">(kamu)</small>' : '') + '<span class="peran">' + (m.peran === 'admin' ? 'Pengurus' : 'Member') + '</span></li>';
    }).join('');
  }
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  var tglFile = function () { return new Date().toISOString().slice(0, 10); };
  var KOLOM = ['id', 'nama', 'jenis', 'alamat', 'lat', 'lng', 'jam', 'kegiatan', 'parkir', 'kursi_roda', 'toilet', 'wudu', 'kontak', 'diperbarui'];
  var csvSel = function (v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  $('#tEksJson').onclick = function () { var c = JSON.parse(JSON.stringify(D)); c.sesi = null; unduh('direktori-ibadah-' + tglFile() + '.json', JSON.stringify(c, null, 2), 'application/json'); toast('Cadangan JSON diunduh'); };
  $('#tEksCsv').onclick = function () {
    var rows = [KOLOM.join(',')].concat(D.tempat.map(function (p) {
      return [p.id, p.nama, p.jenis, p.alamat, p.lat, p.lng, p.jam.join(' | '), p.kegiatan, p.fasilitas.parkir ? 1 : 0, p.fasilitas.kursiRoda ? 1 : 0, p.fasilitas.toilet ? 1 : 0, p.fasilitas.wudu ? 1 : 0, p.kontak, new Date(p.diperbarui).toISOString()].map(csvSel).join(',');
    }));
    unduh('direktori-ibadah-' + tglFile() + '.csv', '﻿' + rows.join('\n'), 'text/csv'); toast('CSV diunduh — buka di Excel/Sheets');
  };
  function parseCSV(teks) {
    var baris = [], sel = '', row = [], q = false;
    teks = teks.replace(/^﻿/, '');
    for (var i = 0; i < teks.length; i++) {
      var c = teks[i];
      if (q) { if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; } else if (c === '"') q = false; else sel += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(sel); sel = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && teks[i + 1] === '\n') i++; row.push(sel); baris.push(row); row = []; sel = ''; }
      else sel += c;
    }
    if (sel || row.length) { row.push(sel); baris.push(row); }
    return baris.filter(function (r) { return r.some(function (x) { return x.trim(); }); });
  }
  $('#fImpor').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        if (/\.json$/i.test(f.name) || /^\s*\{/.test(r.result)) {
          var x = JSON.parse(r.result); if (!x || !Array.isArray(x.tempat)) throw new Error('bentuk');
          modal('Ganti semua data?', '<p>Berkas berisi <b>' + x.tempat.length + ' tempat</b>. Data di perangkat ini akan diganti. Ekspor dulu kalau ragu.</p>', 'Ganti data', function () {
            var sesi = D.sesi; localStorage.setItem(KUNCI, JSON.stringify(x)); muat(); D.sesi = D.member.some(function (m) { return m.id === sesi; }) ? sesi : null; simpan(); renderAkun(); renderData(); toast('Data dipulihkan dari JSON');
          }, 'tbl-bahaya');
        } else {
          var b = parseCSV(r.result), kep = b.shift().map(function (h) { return h.trim().toLowerCase(); }), baru = 0, ubah = 0;
          if (kep.indexOf('nama') < 0 || kep.indexOf('lat') < 0) throw new Error('kolom');
          b.forEach(function (row) {
            var o = {}; kep.forEach(function (k, i) { o[k] = (row[i] || '').trim(); });
            if (!o.nama || isNaN(parseFloat(o.lat))) return;
            var p = normalTempat({ id: o.id || uid(), nama: o.nama, jenis: (o.jenis || '').toLowerCase(), alamat: o.alamat, lat: parseFloat(o.lat), lng: parseFloat(o.lng),
              jam: (o.jam || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean), kegiatan: o.kegiatan, kontak: o.kontak,
              fasilitas: { parkir: o.parkir === '1', kursiRoda: o.kursi_roda === '1', toilet: o.toilet === '1', wudu: o.wudu === '1' } });
            var lama = cariTempat(p.id);
            if (lama) { ['nama', 'jenis', 'alamat', 'lat', 'lng', 'jam', 'kegiatan', 'kontak', 'fasilitas'].forEach(function (k) { lama[k] = p[k]; }); lama.diperbarui = Date.now(); lama.riwayat.push({ t: Date.now(), oleh: saya() ? saya().nama : 'Impor', aksi: 'Diperbarui', ket: 'Impor CSV' }); ubah++; }
            else { p.foto = ''; p.riwayat = [{ t: Date.now(), oleh: saya() ? saya().nama : 'Impor', aksi: 'Ditambahkan', ket: 'Impor CSV' }]; D.tempat.push(p); baru++; }
          });
          simpan(); toast('Impor CSV: ' + baru + ' baru, ' + ubah + ' diperbarui');
        }
      } catch (err) { toast('Berkas tidak bisa dibaca — pastikan JSON cadangan atau CSV dengan kolom nama, lat, lng'); }
    };
    r.readAsText(f);
  });
  $('#tContoh').onclick = function () {
    modal('Pakai data contoh?', '<p>Semua tempat, antrean, dan akun diganti dengan data contoh <b>' + KOTA + '</b> (kota fiktif).</p>', 'Pakai contoh', function () { D = dataContoh(); simpan(); renderAkun(); renderData(); toast('Data contoh dipasang'); }, 'tbl-bahaya');
  };
  $('#tKosongkan').onclick = function () {
    modal('Kosongkan data?', '<p>Semua tempat dan antrean dihapus dari perangkat ini. Akun pengurus tetap ada. Ketik <b>HAPUS</b> untuk lanjut.</p><div class="ruas"><label for="mKonf">Konfirmasi</label><input id="mKonf" autocomplete="off"></div>', 'Kosongkan', function () {
      if ($('#mKonf').value.trim().toUpperCase() !== 'HAPUS') { toast('Dibatalkan — ketik HAPUS untuk konfirmasi'); return; }
      D.tempat = []; D.antrean = []; simpan(); renderAkun(); toast('Data dikosongkan. Mulai isi kotamu!');
    }, 'tbl-bahaya');
  };

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
      var l = $('#fontTema'); if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap';
    }
    if (t.mode) r.setAttribute('data-mode', t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode);
    if (t.bagian) terapkanBagian(t.bagian);
    if (t.nama) $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; });
    setTimeout(hitungTeksBagian, 0);
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (warna per bagian, sorot, tap-untuk-pilih) ----------
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  var PETA_TAMBAHAN = { aksen: '.lencana, .status.baru, .kota .pin-kota', teks: 'h1, h2', utama: '.nav.aktif, .tab-kecil [aria-selected="true"]', panel: '.panel, .kartu-tempat' };
  function tandaiBagian() {
    Object.keys(PETA_TAMBAHAN).forEach(function (b) { $$(PETA_TAMBAHAN[b]).forEach(function (el) { if (!el.hasAttribute('data-bagian')) el.setAttribute('data-bagian', b); }); });
  }
  function warnaNyata(v) {
    var p = document.createElement('i'); p.style.cssText = 'position:absolute;width:0;height:0;background:var(' + v + ')';
    document.body.appendChild(p); var c = getComputedStyle(p).backgroundColor; p.remove();
    var m = (c.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
    if (/^color\(srgb/.test(c)) m = m.map(function (x) { return x * 255; });
    return m.slice(0, 3);
  }
  function teksUntuk(v) {
    var l = warnaNyata(v).map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4 ? '#14171a' : '#ffffff';
  }
  function hitungTeksBagian() {
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
    window.addEventListener(tipe, function (e) {
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
    if (dom) { tandaiBagian(); if (sorotAktif) sorot(sorotAktif); } if (mode) hitungTeksBagian();
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-mode'] });

  // ---------- Jembatan untuk profil.js (halaman website satu tempat) ----------
  window.DIR = { cariTempat: function (id) { return cariTempat(id); }, simpan: function () { simpan(); }, isAdmin: isAdmin, saya: saya, toast: toast,
    JENIS: JENIS, FAS: FAS, fasRelevan: fasRelevan, buka: function (h) { buka(h); }, segarJelajah: function () { buka(halAktif); } };

  // ---------- Mulai ----------
  muat();
  if (/[?&]demo\b/.test(location.search)) { D.sesi = 'adm'; simpan(); }
  $$('[data-tema-nama]').forEach(function (e) { if (window.TEMA && TEMA.nama) e.textContent = TEMA.nama; });
  siapkanPeta();
  renderAkun();
  buka((location.hash || '').slice(1) || 'jelajah');
  var bukaId = (location.search.match(/[?&]tempat=([^&]+)/) || [])[1];
  if (bukaId === 'pertama' && D.tempat[0]) bukaDetail(D.tempat[0].id);
  else if (bukaId && window.PROFIL && cariTempat(decodeURIComponent(bukaId))) PROFIL.buka(decodeURIComponent(bukaId), { awal: true });
  window.addEventListener('popstate', function () { var m = location.search.match(/[?&]tempat=([^&]+)/); if (m && window.PROFIL && !PROFIL.aktif() && cariTempat(decodeURIComponent(m[1]))) PROFIL.buka(decodeURIComponent(m[1]), { awal: true }); });
  tandaiBagian(); hitungTeksBagian();
})();
