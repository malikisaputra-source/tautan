/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Absensi Karyawan — web app absensi untuk UMKM & kantor kecil. HTML/CSS/JS murni, data di localStorage, selfie di IndexedDB.
   Dibuat oleh Maliki Studio — malikisaputra.biz.id (MIT). Peta kode: lihat .claude/skills/ubah-absensi-karyawan/SKILL.md */
/* KONFIG gambar — ganti logo/foto cukup timpa berkas di img/ atau ubah path di sini. */
var KONFIG = {
  logo: 'img/logo.svg',          // logo usaha: sidebar, header HP, kiosk ('' = pakai inisial)
  fotoKaryawanBawaan: '',        // mis. 'img/karyawan.svg' untuk karyawan tanpa foto ('' = inisial berwarna)
  fotoMaksPx: 400                // foto karyawan yang diunggah diperkecil ke sisi terpanjang ini
};
(function () {
  'use strict';
  var KUNCI = 'absensiKaryawan.v1';
  var KUNCI_PERANGKAT = 'absensiKaryawan.perangkat';
  var VERSI = 1;
  var NAMA_TEMA = (window.TEMA && window.TEMA.nama) || 'Kantor Saya';
  var DEMO = /[?&]demo\b/.test(location.search);

  // ---------- Utilitas ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function rp(n) { n = Math.round(n || 0); return (n < 0 ? '−' : '') + 'Rp' + Math.abs(n).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function dua(n) { return (n < 10 ? '0' : '') + n; }
  function kunciTgl(d) { return d.getFullYear() + '-' + dua(d.getMonth() + 1) + '-' + dua(d.getDate()); }
  function dariKunci(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function tambahHari(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function jamDari(iso) { if (!iso) return '--:--'; var d = new Date(iso); return dua(d.getHours()) + ':' + dua(d.getMinutes()); }
  function keMenit(hhmm) { var p = String(hhmm || '00:00').split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function durasi(m) { m = Math.max(0, Math.round(m)); return Math.floor(m / 60) + 'j ' + (m % 60) + 'm'; }
  function angka(v) { return Math.max(0, parseInt(String(v || '').replace(/\D/g, ''), 10) || 0); }
  var HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  var HARI_P = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var BULAN_P = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var WARNA_AVATAR = ['#4f46e5', '#0e7490', '#be185d', '#15803d', '#c2410c', '#7c3aed', '#0f766e', '#a21caf', '#2563eb', '#b45309'];
  var kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tglPanjang(d) { return HARI_P[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN_P[d.getMonth()] + ' ' + d.getFullYear(); }
  function tglPendek(k) { var d = dariKunci(k); return d.getDate() + ' ' + BULAN_P[d.getMonth()].slice(0, 3); }
  function inisial(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (s) { return s[0]; }).join('').toUpperCase(); }

  // ---------- Data ----------
  // Skema: lihat SKILL.md. absen: [{id,kid,tgl,masuk,pulang,telat,lembur,jadwal:{masuk,pulang},lokasi:{lat,lng,jarak}|null,foto:boolean,sumber}]
  function dataKosong() {
    return {
      versi: VERSI, contoh: false,
      kantor: { lat: null, lng: null, radius: 100, pakai: false, wajib: false },
      selfie: { pakai: false, wajib: false },
      pinAdmin: '',
      uang: { makan: 25000, lembur: 20000, potTelat: 10000, potAlpa: 75000, minLembur: 30 },
      shift: [
        { id: 'pagi', nama: 'Pagi', masuk: '08:00', pulang: '16:00', toleransi: 10, ikon: 'pagi' },
        { id: 'siang', nama: 'Siang', masuk: '13:00', pulang: '21:00', toleransi: 10, ikon: 'siang' },
        { id: 'malam', nama: 'Malam', masuk: '21:00', pulang: '05:00', toleransi: 15, ikon: 'malam' }
      ],
      karyawan: [], absen: [], izin: []
    };
  }
  function semai(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function dataContoh() {
    var d = dataKosong(), acak = semai(20261107), kini = new Date();
    d.contoh = true; d.pinAdmin = '1234';
    d.kantor = { lat: -6.9175, lng: 107.6191, radius: 150, pakai: true, wajib: false };
    var orang = [
      ['Rina Wulandari', 'Kasir', 'pagi', '1111'], ['Dimas Pratama', 'Barista', 'pagi', '2222'], ['Siti Nurhaliza', 'Admin Gudang', 'pagi', '3333'],
      ['Agus Setiawan', 'Kurir', 'pagi', '4444'], ['Putri Maharani', 'Kasir', 'siang', '5555'], ['Fajar Nugroho', 'Barista', 'siang', '6666'],
      ['Wahyu Hidayat', 'Satpam', 'malam', '7777'], ['Laras Ayuningtyas', 'Keuangan', 'pagi', '8888'], ['Bayu Saputra', 'Staf Toko', 'siang', '9999']
    ];
    var mulai = new Date(kini.getFullYear(), kini.getMonth() - 1, 1);
    d.karyawan = orang.map(function (o, i) {
      return { id: 'k' + (i + 1), nama: o[0], jabatan: o[1], shift: o[2], pin: o[3], hariKerja: o[2] === 'malam' ? [0, 1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6], aktif: true, warna: WARNA_AVATAR[i % WARNA_AVATAR.length], mulai: kunciTgl(mulai) };
    });
    var hariIni = kunciTgl(kini), menitKini = kini.getHours() * 60 + kini.getMinutes();
    d.karyawan.forEach(function (k, ki) {
      var sh = d.shift.filter(function (s) { return s.id === k.shift; })[0];
      for (var t = new Date(mulai); kunciTgl(t) <= hariIni; t = tambahHari(t, 1)) {
        var kt = kunciTgl(t);
        if (k.hariKerja.indexOf(t.getDay()) < 0) continue;
        var r = acak(), hari0 = kt === hariIni;
        if (hari0 && keMenit(sh.masuk) - 25 > menitKini) continue;      // shift belum mulai
        if (hari0 && ki === 3) continue;                                  // satu orang belum datang
        if (!hari0 && r < 0.035) continue;                                // alpa
        if (!hari0 && r < 0.09) {                                         // izin/sakit/cuti
          var jenis = r < 0.055 ? 'sakit' : r < 0.075 ? 'izin' : 'cuti';
          d.izin.push({ id: uid(), kid: k.id, jenis: jenis, dari: kt, sampai: kt, alasan: jenis === 'sakit' ? 'Demam, ada surat dokter' : jenis === 'izin' ? 'Urusan keluarga' : 'Cuti tahunan', status: 'disetujui', t: tambahHari(t, -2).toISOString() });
          continue;
        }
        var telat = acak() < 0.16;
        var geser = telat ? sh.toleransi + 2 + Math.floor(acak() * 30) : -Math.floor(acak() * 22);
        var masuk = new Date(t); masuk.setHours(0, keMenit(sh.masuk) + geser, Math.floor(acak() * 59), 0);
        if (hari0 && masuk > kini) masuk = new Date(kini.getTime() - 60e3 * (5 + ki));
        var rec = { id: uid() + ki, kid: k.id, tgl: kt, masuk: masuk.toISOString(), pulang: null, telat: 0, lembur: 0, jadwal: { masuk: sh.masuk, pulang: sh.pulang }, lokasi: { lat: d.kantor.lat + (acak() - .5) * .0012, lng: d.kantor.lng + (acak() - .5) * .0012, jarak: Math.round(10 + acak() * 70) }, foto: false, sumber: acak() < .6 ? 'kiosk' : 'hp' };
        var tl = Math.round((masuk - jadwalMasuk(kt, sh)) / 60e3); rec.telat = tl > sh.toleransi ? tl : 0;
        var pul = jadwalPulang(kt, sh), ext = acak() < 0.2 ? 35 + Math.floor(acak() * 110) : Math.floor(acak() * 14) - 4;
        var p = new Date(pul.getTime() + ext * 60e3);
        if (p < kini) { rec.pulang = p.toISOString(); rec.lembur = hitungLembur(rec, d.uang.minLembur); }
        d.absen.push(rec);
      }
    });
    // pengajuan menunggu & ditolak
    var bsk = function (n) { return kunciTgl(tambahHari(kini, n)); };
    d.izin.push({ id: uid(), kid: 'k5', jenis: 'cuti', dari: bsk(3), sampai: bsk(5), alasan: 'Pulang kampung, nikahan kakak', status: 'menunggu', t: tambahHari(kini, -1).toISOString() });
    d.izin.push({ id: uid(), kid: 'k2', jenis: 'izin', dari: bsk(1), sampai: bsk(1), alasan: 'Antar ibu kontrol ke rumah sakit', status: 'menunggu', t: new Date(kini.getTime() - 3 * 3600e3).toISOString() });
    d.izin.push({ id: uid(), kid: 'k7', jenis: 'sakit', dari: bsk(0), sampai: bsk(1), alasan: 'Tipes, istirahat 2 hari', status: 'menunggu', t: new Date(kini.getTime() - 5 * 3600e3).toISOString() });
    d.izin.push({ id: uid(), kid: 'k9', jenis: 'cuti', dari: bsk(-6), sampai: bsk(-5), alasan: 'Liburan keluarga', status: 'ditolak', t: tambahHari(kini, -10).toISOString() });
    return d;
  }
  function jadwalMasuk(tgl, sh) { var d = dariKunci(tgl); d.setMinutes(keMenit(sh.masuk)); return d; }
  function jadwalPulang(tgl, sh) { var d = dariKunci(tgl), m = keMenit(sh.pulang); if (m <= keMenit(sh.masuk)) m += 1440; d.setMinutes(m); return d; }
  function hitungLembur(rec, minL) {
    if (!rec.pulang) return 0;
    var lebih = Math.round((new Date(rec.pulang) - jadwalPulang(rec.tgl, rec.jadwal)) / 60e3);
    return lebih >= (minL || 0) ? lebih : 0;
  }

  var D;
  function muat() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') { D = dataContoh(); simpan(); return; }
    var k = dataKosong();
    Object.keys(k).forEach(function (x) { if (s[x] === undefined) s[x] = k[x]; });
    ['kantor', 'selfie', 'uang'].forEach(function (x) { Object.keys(k[x]).forEach(function (y) { if (s[x][y] === undefined) s[x][y] = k[x][y]; }); });
    // migrasi versi berikutnya taruh di sini: if (s.versi < 2) { ...; s.versi = 2; }
    D = s;
  }
  function simpan() {
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); }
    catch (e) { toast('Penyimpanan penuh — backup lalu hapus data lama'); }
  }
  function perangkat() { try { return localStorage.getItem(KUNCI_PERANGKAT); } catch (e) { return null; } }
  function setPerangkat(id) { try { localStorage.setItem(KUNCI_PERANGKAT, id); } catch (e) { } }

  // ---------- Foto selfie (IndexedDB, kecil ±10 KB) ----------
  var idb = null;
  function bukaIdb() {
    if (idb) return idb;
    idb = new Promise(function (ok, gagal) {
      if (!window.indexedDB) return gagal(new Error('IndexedDB tidak ada'));
      var r = indexedDB.open('absensiKaryawanFoto', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('foto'); };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { gagal(r.error); };
    });
    return idb;
  }
  function fotoSimpan(id, data) { return bukaIdb().then(function (db) { return new Promise(function (ok, g) { var tx = db.transaction('foto', 'readwrite'); tx.objectStore('foto').put(data, id); tx.oncomplete = ok; tx.onerror = function () { g(tx.error); }; }); }); }
  function fotoAmbil(id) { return bukaIdb().then(function (db) { return new Promise(function (ok) { var q = db.transaction('foto').objectStore('foto').get(id); q.onsuccess = function () { ok(q.result || null); }; q.onerror = function () { ok(null); }; }); }).catch(function () { return null; }); }
  function fotoSemua() { return bukaIdb().then(function (db) { return new Promise(function (ok) { var hasil = {}, q = db.transaction('foto').objectStore('foto').openCursor(); q.onsuccess = function () { var c = q.result; if (c) { hasil[c.key] = c.value; c.continue(); } else ok(hasil); }; q.onerror = function () { ok(hasil); }; }); }).catch(function () { return {}; }); }
  function fotoBersihkan() { return bukaIdb().then(function (db) { return new Promise(function (ok) { var tx = db.transaction('foto', 'readwrite'); tx.objectStore('foto').clear(); tx.oncomplete = ok; tx.onerror = ok; }); }).catch(function () { }); }

  // ---------- Hitungan ----------
  function karyawan(id) { return D.karyawan.filter(function (k) { return k.id === id; })[0]; }
  function aktif() { return D.karyawan.filter(function (k) { return k.aktif !== false; }); }
  function shiftDari(k) { return D.shift.filter(function (s) { return s.id === (k && k.shift); })[0] || D.shift[0]; }
  function absenTgl(kid, tgl) { return D.absen.filter(function (a) { return a.kid === kid && a.tgl === tgl; })[0]; }
  function absenTerbuka(kid) {
    var kini = Date.now();
    return D.absen.filter(function (a) { return a.kid === kid && !a.pulang && kini - new Date(a.masuk) < 20 * 3600e3; })[0];
  }
  function izinPada(kid, tgl, semua) {
    return D.izin.filter(function (z) { return z.kid === kid && (semua || z.status === 'disetujui') && z.dari <= tgl && z.sampai >= tgl; })[0];
  }
  // status: hadir | telat | izin | sakit | cuti | alpa | libur | belum | nanti | '' (sebelum mulai kerja)
  function statusHari(k, tgl) {
    var a = absenTgl(k.id, tgl);
    if (a) return a.telat > 0 ? 'telat' : 'hadir';
    var z = izinPada(k.id, tgl);
    if (z) return z.jenis;
    var hariIni = kunciTgl(new Date());
    if (k.mulai && tgl < k.mulai) return '';
    if (tgl > hariIni) return 'nanti';
    if ((k.hariKerja || [1, 2, 3, 4, 5, 6]).indexOf(dariKunci(tgl).getDay()) < 0) return 'libur';
    if (tgl === hariIni) return 'belum';
    return 'alpa';
  }
  var LABEL = { hadir: 'Hadir', telat: 'Telat', izin: 'Izin', sakit: 'Sakit', cuti: 'Cuti', alpa: 'Alpa', libur: 'Libur', belum: 'Belum absen', nanti: '' };
  function rekapBulan(k, th, bl) {
    var r = { hadir: 0, telat: 0, izin: 0, sakit: 0, cuti: 0, alpa: 0, libur: 0, lembur: 0, telatMnt: 0, kerja: 0 };
    var akhir = new Date(th, bl + 1, 0).getDate();
    for (var i = 1; i <= akhir; i++) {
      var tgl = th + '-' + dua(bl + 1) + '-' + dua(i), s = statusHari(k, tgl);
      if (s === 'hadir' || s === 'telat') { r.hadir++; var a = absenTgl(k.id, tgl); r.lembur += a.lembur || 0; if (s === 'telat') { r.telat++; r.telatMnt += a.telat; } }
      else if (r[s] !== undefined) r[s]++;
      if (s && s !== 'libur' && s !== 'nanti') r.kerja++;
    }
    var u = D.uang;
    r.tunjangan = r.hadir * u.makan + Math.round(r.lembur / 60 * u.lembur);
    r.potongan = r.telat * u.potTelat + r.alpa * u.potAlpa;
    r.bersih = r.tunjangan - r.potongan;
    return r;
  }
  function jarakMeter(a, b) {
    var R = 6371000, rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  }

  // ---------- Komponen kecil ----------
  function avatar(k, cls) { var f = k.foto || KONFIG.fotoKaryawanBawaan; return '<span class="avatar ' + (cls || '') + '" data-bagian="aksen" style="background:' + esc(k.warna || WARNA_AVATAR[0]) + '" aria-hidden="true">' + esc(inisial(k.nama)) + (f ? '<img src="' + esc(f) + '" alt="" onerror="this.style.display=\'none\'">' : '') + '</span>'; }
  // Logo usaha dari KONFIG.logo; gagal dimuat -> inisial nama usaha
  function pasangLogo() {
    if (!KONFIG.logo) return;
    $$('.sidebar .logo, .atas-hp .logo, .kiosk .merek .logo').forEach(function (el) {
      el.innerHTML = '<img src="' + esc(KONFIG.logo) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">';
      el.style.overflow = 'hidden';
      el.querySelector('img').onerror = function () { el.innerHTML = '<b style="font-size:14px">' + esc(inisial(NAMA_TEMA)) + '</b>'; };
    });
  }
  // Foto karyawan diunggah -> diperkecil lewat canvas jadi dataURL (<= KONFIG.fotoMaksPx)
  function kecilkanFoto(file) {
    return new Promise(function (ok, gagal) {
      var r = new FileReader();
      r.onload = function () { var im = new Image(); im.onload = function () {
        var sk = Math.min(1, KONFIG.fotoMaksPx / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * sk); c.height = Math.round(im.height * sk); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/jpeg', .8)); }; im.onerror = gagal; im.src = r.result; };
      r.onerror = gagal; r.readAsDataURL(file);
    });
  }
  function chip(s) { return s ? '<span class="status st-' + s + '">' + esc(LABEL[s] || s) + '</span>' : ''; }
  var tToast;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('tampil'); clearTimeout(tToast); tToast = setTimeout(function () { el.classList.remove('tampil'); }, 2800); }
  var WARNA_ST = { hadir: 'var(--s-hadir)', telat: 'var(--s-telat)', izin: 'var(--s-izin)', sakit: 'var(--s-sakit)', cuti: 'var(--s-cuti)', alpa: 'var(--s-alpa)', belum: 'color-mix(in srgb, var(--teks) 22%, var(--kartu))', libur: 'var(--s-libur)' };
  function donat(svg, bagian, total, angkaTeks, ket) {
    var C = 2 * Math.PI * 48, off = 0, html = '<circle class="dasar" cx="60" cy="60" r="48"/>';
    bagian.forEach(function (b) {
      if (!b.n || !total) return;
      var pj = b.n / total * C, celah = bagian.filter(function (x) { return x.n; }).length > 1 ? 2.5 : 0;
      html += '<circle class="seg-d" cx="60" cy="60" r="48" stroke="' + b.warna + '" stroke-dasharray="' + (kurangGerak ? Math.max(0, pj - celah) : 0) + ' ' + C + '" data-pj="' + Math.max(0, pj - celah) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 60 60)"/>';
      off += pj;
    });
    html += '<text class="angka" x="60" y="64">' + esc(angkaTeks) + '</text><text class="ket" x="60" y="80">' + esc(ket) + '</text>';
    svg.innerHTML = html;
    if (!kurangGerak) requestAnimationFrame(function () { requestAnimationFrame(function () { $$('.seg-d', svg).forEach(function (c) { c.setAttribute('stroke-dasharray', c.getAttribute('data-pj') + ' ' + C); }); }); });
  }
  function legenda(ul, bagian, total) {
    ul.innerHTML = bagian.map(function (b) {
      var pct = total ? Math.round(b.n / total * 100) : 0;
      return '<li><i class="titik" style="background:' + b.warna + '"></i><span>' + esc(b.label) + '</span><b>' + b.n + '</b><span class="batang"><i style="width:' + pct + '%;background:' + b.warna + '"></i></span></li>';
    }).join('');
  }

  // ---------- Dialog (promise) ----------
  var dlg = $('#dlg'), dlgSelesai = null;
  function dialog(judul, html, aksi, saatBuka) {
    return new Promise(function (ok) {
      if (dlg.open) tutupDialog(null, true);
      $('#dlgJudul').textContent = judul;
      $('#dlgBadan').innerHTML = html;
      $('#dlgAksi').innerHTML = (aksi || []).map(function (a, i) { return '<button type="' + (a.submit ? 'submit' : 'button') + '" class="btn ' + (a.kelas || '') + '" data-i="' + i + '">' + a.label + '</button>'; }).join('');
      dlgSelesai = ok;
      $$('#dlgAksi button').forEach(function (b) {
        b.onclick = function (e) {
          e.preventDefault();
          var a = aksi[+b.getAttribute('data-i')];
          if (a.cek && a.cek() === false) return;
          tutupDialog(a.nilai === undefined ? true : (typeof a.nilai === 'function' ? a.nilai() : a.nilai));
        };
      });
      dlg.classList.remove('tutup');
      dlg.showModal();
      if (saatBuka) saatBuka($('#dlgBadan'));
      var f = $('#dlgBadan input:not([type=hidden]):not([type=checkbox]), #dlgBadan select, #dlgBadan textarea');
      if (f && !kurangGerak) setTimeout(function () { f.focus(); }, 60); else if (f) f.focus();
    });
  }
  var saatTutup = null;
  function tutupDialog(nilai, langsung) {
    var ok = dlgSelesai; dlgSelesai = null;
    if (saatTutup) { saatTutup(); saatTutup = null; }
    var akhiri = function () { dlg.classList.remove('tutup'); if (dlg.open) dlg.close(); };
    if (langsung || kurangGerak) akhiri(); else { dlg.classList.add('tutup'); setTimeout(akhiri, 190); }
    if (ok) ok(nilai);
  }
  $('#dlgTutup').onclick = function () { tutupDialog(null); };
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); tutupDialog(null); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) tutupDialog(null); });
  $('#dlgForm').addEventListener('submit', function (e) { e.preventDefault(); var b = $('#dlgAksi .utama, #dlgAksi .hijau'); if (b) b.click(); });

  // ---------- PIN ----------
  function pinPad(judul, k, pinBenar, petunjuk) {
    var isi = '';
    var html = '<div class="pin-orang">' + (k ? avatar(k) + '<b>' + esc(k.nama) + '</b><small class="redup">' + esc(k.jabatan || '') + '</small>' : '<span class="logo"><svg><use href="#i-gembok"/></svg></span><b>Masukkan PIN admin</b>') + '</div>' +
      '<div class="pin-titik" id="pinTitik" aria-hidden="true">' + new Array(pinBenar.length + 1).join('<i></i>') + '</div>' +
      '<p class="sr" id="pinSr" aria-live="polite">0 dari ' + pinBenar.length + ' angka</p>' +
      '<p class="pin-pesan" id="pinPesan">' + (petunjuk ? '<span class="redup">' + esc(petunjuk) + '</span>' : '') + '</p>' +
      '<div class="pin-pad" id="pinPad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" data-n="' + n + '">' + n + '</button>'; }).join('') +
      '<button type="button" class="kosong" tabindex="-1" aria-hidden="true"></button><button type="button" data-n="0">0</button><button type="button" data-n="del" aria-label="Hapus angka"><svg><use href="#i-hapus-angka"/></svg></button></div>';
    return dialog(judul, html, [], function (badan) {
      function gambar() {
        $$('#pinTitik i', badan).forEach(function (t, i) { t.classList.toggle('isi', i < isi.length); });
        $('#pinSr', badan).textContent = isi.length + ' dari ' + pinBenar.length + ' angka';
      }
      function tekan(n) {
        if (n === 'del') { isi = isi.slice(0, -1); gambar(); return; }
        if (isi.length >= pinBenar.length) return;
        isi += n; gambar();
        if (isi.length === pinBenar.length) {
          if (isi === pinBenar) setTimeout(function () { tutupDialog(true); }, 140);
          else {
            var t = $('#pinTitik', badan); t.classList.add('salah'); $('#pinPesan', badan).textContent = 'PIN salah, coba lagi';
            setTimeout(function () { t.classList.remove('salah'); isi = ''; gambar(); }, 420);
          }
        }
      }
      $$('#pinPad button[data-n]', badan).forEach(function (b) { b.onclick = function () { tekan(b.getAttribute('data-n')); }; });
      var kb = function (e) { if (!dlg.open || modePilih) return; if (/^\d$/.test(e.key)) { tekan(e.key); e.preventDefault(); } else if (e.key === 'Backspace') { tekan('del'); e.preventDefault(); } };
      document.addEventListener('keydown', kb); saatTutup = function () { document.removeEventListener('keydown', kb); };
      setTimeout(function () { var b = $('#pinPad button[data-n="1"]', badan); if (b) b.focus(); }, 80);
    });
  }
  var sesiAdmin = DEMO;
  function perluAdmin() {
    if (!D.pinAdmin || sesiAdmin) return Promise.resolve(true);
    return pinPad('Khusus admin', null, D.pinAdmin, D.contoh ? 'PIN demo: 1234' : '').then(function (ok) { if (ok) sesiAdmin = true; return !!ok; });
  }

  // ---------- Lokasi & selfie ----------
  function ambilLokasi() {
    return new Promise(function (ok) {
      if (!navigator.geolocation) return ok({ galat: 'Browser ini tidak mendukung lokasi' });
      navigator.geolocation.getCurrentPosition(function (p) { ok({ lat: p.coords.latitude, lng: p.coords.longitude, akurasi: Math.round(p.coords.accuracy) }); },
        function (e) { ok({ galat: e.code === 1 ? 'Izin lokasi ditolak' : 'Lokasi tidak ditemukan' }); }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 });
    });
  }
  function ambilSelfie(wajib) {
    var stream = null;
    var html = '<div class="selfie" id="selfieBox"><p>Menyalakan kamera…</p></div><p class="bantuan">Foto disimpan kecil (±10 KB) di perangkat ini saja.</p>';
    var aksi = [{ label: '<svg><use href="#i-kamera"/></svg>Ambil foto', kelas: 'utama', nilai: function () {
      var v = $('#selfieBox video'); if (!v || !v.videoWidth) return null;
      var c = document.createElement('canvas'), w = 180, h = Math.round(180 * 4 / 3); c.width = w; c.height = h;
      var x = c.getContext('2d'), sk = Math.max(w / v.videoWidth, h / v.videoHeight);
      x.translate(w, 0); x.scale(-1, 1);
      x.drawImage(v, (w - v.videoWidth * sk) / 2, (h - v.videoHeight * sk) / 2, v.videoWidth * sk, v.videoHeight * sk);
      return c.toDataURL('image/jpeg', 0.62);
    }, cek: function () { var v = $('#selfieBox video'); if (!v || !v.videoWidth) { toast('Kamera belum siap'); return false; } } }];
    if (!wajib) aksi.unshift({ label: 'Lewati', nilai: 'lewati' });
    var p = dialog('Selfie absen', html, aksi, function () {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $('#selfieBox').innerHTML = '<p>Kamera tidak tersedia di browser ini. ' + (wajib ? 'Hubungi admin.' : 'Kamu bisa lewati.') + '</p>'; return; }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 480 } }, audio: false }).then(function (s) {
        stream = s;
        if (!dlg.open) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        $('#selfieBox').innerHTML = '<video autoplay playsinline muted></video><span class="bingkai"></span>';
        $('#selfieBox video').srcObject = s;
      }).catch(function () { $('#selfieBox').innerHTML = '<p>Kamera tidak bisa dibuka (izin ditolak atau dipakai aplikasi lain). ' + (wajib ? 'Izinkan kamera lalu coba lagi.' : 'Kamu bisa lewati.') + '</p>'; });
      saatTutup = function () { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); };
    });
    return p;
  }

  // ---------- Alur absen ----------
  function prosesAbsen(kid, sumber) {
    var k = karyawan(kid); if (!k) { toast('Pilih karyawan dulu'); return Promise.resolve(); }
    var hariIni = kunciTgl(new Date()), terbuka = absenTerbuka(kid), sudah = absenTgl(kid, hariIni);
    if (!terbuka && sudah && sudah.pulang) { toast(k.nama.split(' ')[0] + ' sudah absen pulang hari ini'); return Promise.resolve(); }
    var pulang = !!terbuka, lokasi = null;
    var langkah = k.pin ? pinPad(pulang ? 'Check-out' : 'Check-in', k, String(k.pin)) : Promise.resolve(true);
    return langkah.then(function (ok) {
      if (!ok) return null;
      if (!D.kantor.pakai) return true;
      toast('Mengambil lokasi…');
      return ambilLokasi().then(function (g) {
        if (g.galat) {
          if (D.kantor.wajib) { dialog('Lokasi diperlukan', '<p>' + esc(g.galat) + '. Absen ditolak karena kantor mewajibkan lokasi. Izinkan lokasi di pengaturan browser, lalu coba lagi.</p>', [{ label: 'Mengerti', kelas: 'utama' }]); return null; }
          return true;
        }
        lokasi = { lat: +g.lat.toFixed(6), lng: +g.lng.toFixed(6), jarak: null };
        if (D.kantor.lat != null && D.kantor.lng != null) {
          lokasi.jarak = jarakMeter(lokasi, { lat: D.kantor.lat, lng: D.kantor.lng });
          if (D.kantor.wajib && lokasi.jarak > D.kantor.radius) {
            dialog('Di luar area kantor', '<p>Kamu berada <b>' + lokasi.jarak.toLocaleString('id-ID') + ' m</b> dari kantor, batasnya ' + D.kantor.radius + ' m. Datang ke kantor dulu, ya.</p>', [{ label: 'Mengerti', kelas: 'utama' }]);
            return null;
          }
        }
        return true;
      });
    }).then(function (ok) {
      if (!ok) return null;
      if (!D.selfie.pakai) return '';
      return ambilSelfie(D.selfie.wajib).then(function (f) { if (f === null) return null; return f === 'lewati' ? '' : f; });
    }).then(function (foto) {
      if (foto === null || foto === undefined) return;
      var kini = new Date(), rec;
      if (pulang) {
        rec = terbuka; rec.pulang = kini.toISOString(); rec.lembur = hitungLembur(rec, D.uang.minLembur);
        if (lokasi) rec.lokasiPulang = lokasi;
      } else {
        var sh = shiftDari(k), tgl = hariIni;
        // shift malam: absen lewat tengah malam sebelum jam pulang dihitung untuk tanggal kemarin
        var mM = keMenit(sh.masuk), mP = keMenit(sh.pulang), mK = kini.getHours() * 60 + kini.getMinutes();
        if (mP < mM && mK < mP) tgl = kunciTgl(tambahHari(kini, -1));
        if (absenTgl(kid, tgl)) { toast('Sudah check-in untuk ' + tglPendek(tgl)); return; }
        var tel = Math.round((kini - jadwalMasuk(tgl, sh)) / 60e3);
        rec = { id: uid(), kid: kid, tgl: tgl, masuk: kini.toISOString(), pulang: null, telat: tel > sh.toleransi ? tel : 0, lembur: 0, jadwal: { masuk: sh.masuk, pulang: sh.pulang }, lokasi: lokasi, foto: false, sumber: sumber };
        D.absen.push(rec);
      }
      var simpanFoto = foto ? fotoSimpan(rec.id + (pulang ? '-p' : ''), foto).then(function () { if (!pulang) rec.foto = true; else rec.fotoPulang = true; }).catch(function () { toast('Foto gagal disimpan'); }) : Promise.resolve();
      return simpanFoto.then(function () {
        simpan(); renderSemua();
        var telat = !pulang && rec.telat > 0;
        var sub = pulang ? 'Durasi kerja ' + durasi((new Date(rec.pulang) - new Date(rec.masuk)) / 60e3) + (rec.lembur ? ' · lembur ' + durasi(rec.lembur) : '') : telat ? 'Telat ' + rec.telat + ' menit dari jadwal ' + rec.jadwal.masuk : 'Tepat waktu. Semangat kerjanya!';
        var html = '<div class="hasil"><span class="centang' + (telat ? ' telat' : '') + '"><svg><use href="#i-cek"/></svg></span><p class="waktu">' + jamDari(pulang ? rec.pulang : rec.masuk) + '</p><b>' + (pulang ? 'Sampai jumpa besok, ' : 'Selamat bekerja, ') + esc(k.nama.split(' ')[0]) + '</b><p class="redup">' + esc(sub) + '</p>' +
          (lokasi && lokasi.jarak != null ? '<span class="status st-hadir">' + lokasi.jarak + ' m dari kantor</span>' : '') + '</div>';
        var p = dialog(pulang ? 'Check-out tercatat' : 'Check-in tercatat', html, [{ label: 'Selesai', kelas: 'utama' }]);
        if (sumber === 'kiosk') { var t = setTimeout(function () { if (dlg.open) tutupDialog(true); }, 4000); p.then(function () { clearTimeout(t); }); }
        return p;
      });
    });
  }

  // ---------- Navigasi ----------
  var HAL_ADMIN = ['rekap', 'karyawan', 'atur'];
  var halAktif = 'absen';
  function buka(h, lewatiKunci) {
    if (HAL_ADMIN.indexOf(h) >= 0 && !lewatiKunci && D.pinAdmin && !sesiAdmin) { perluAdmin().then(function (ok) { if (ok) buka(h, true); }); return; }
    halAktif = h;
    $$('.hal').forEach(function (s) { s.hidden = s.id !== 'hal-' + h; });
    $$('.nav[data-hal]').forEach(function (b) { var on = b.getAttribute('data-hal') === h; b.classList.toggle('aktif', on); if (on) { b.setAttribute('aria-current', 'page'); b.setAttribute('data-bagian', 'utama'); } else { b.removeAttribute('aria-current'); b.removeAttribute('data-bagian'); } });
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search + '#' + h);
    render(h);
    window.scrollTo(0, 0);
  }
  $$('.nav[data-hal]').forEach(function (b) { b.onclick = function () { buka(b.getAttribute('data-hal')); }; });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-buka]'); if (b) buka(b.getAttribute('data-buka')); });
  function render(h) { ({ absen: renderAbsen, kalender: renderKalender, rekap: renderRekap, izin: renderIzin, karyawan: renderKaryawan, atur: renderAtur })[h](); renderLencana(); }
  function renderSemua() { render(halAktif); if (!$('#kiosk').hidden) renderKiosk(); }
  function renderLencana() {
    var n = D.izin.filter(function (z) { return z.status === 'menunggu'; }).length;
    ['#lencanaIzin', '#lencanaIzin2'].forEach(function (s) { var el = $(s); el.hidden = !n; el.textContent = n; el.setAttribute('aria-label', n + ' pengajuan menunggu'); });
  }

  // ---------- ABSEN ----------
  function sapaan() { var j = new Date().getHours(); return j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam'; }
  function kidAbsen() { var p = perangkat(); if (p && karyawan(p) && karyawan(p).aktif !== false) return p; var a = aktif()[0]; return a ? a.id : null; }
  $('#pilihOrang').onchange = function () { setPerangkat(this.value); renderAbsen(); };
  function renderAbsen() {
    var kid = kidAbsen(), k = karyawan(kid), sel = $('#pilihOrang');
    sel.innerHTML = aktif().map(function (x) { return '<option value="' + x.id + '"' + (x.id === kid ? ' selected' : '') + '>' + esc(x.nama) + '</option>'; }).join('') || '<option>Belum ada karyawan</option>';
    $('#sapa').textContent = sapaan() + (k ? ', ' + k.nama.split(' ')[0] : '');
    var sh = shiftDari(k);
    $('#shiftChip').innerHTML = '<svg><use href="#i-' + (sh.ikon === 'malam' ? 'bulan' : 'matahari') + '"/></svg>Shift ' + esc(sh.nama) + ' · ' + esc(sh.masuk) + '–' + esc(sh.pulang) + ' · toleransi ' + sh.toleransi + ' mnt';
    var syarat = [];
    if (D.kantor.pakai) syarat.push('<span class="' + (D.kantor.wajib ? 'peringatan' : 'ok') + '"><svg><use href="#i-pin"/></svg>' + (D.kantor.wajib ? 'Wajib dalam ' + D.kantor.radius + ' m' : 'Lokasi dicatat') + '</span>');
    if (D.selfie.pakai) syarat.push('<span class="' + (D.selfie.wajib ? 'peringatan' : 'ok') + '"><svg><use href="#i-kamera"/></svg>' + (D.selfie.wajib ? 'Selfie wajib' : 'Selfie') + '</span>');
    if (k && k.pin) syarat.push('<span><svg><use href="#i-gembok"/></svg>PIN pribadi</span>');
    $('#syarat').innerHTML = syarat.join('');
    renderTombol();
    renderTim();
  }
  function renderTombol() {
    var kid = kidAbsen(), k = karyawan(kid), b = $('#tombolAbsen');
    var terbuka = kid && absenTerbuka(kid), hariIni = kunciTgl(new Date()), rec = terbuka || (kid && absenTgl(kid, hariIni));
    b.classList.remove('pulang', 'selesai');
    if (!k) { $('#labelAbsen').textContent = 'Check-in'; $('#subAbsen').textContent = 'Tambah karyawan dulu'; }
    else if (terbuka) { b.classList.add('pulang'); $('#labelAbsen').textContent = 'Check-out'; $('#subAbsen').textContent = 'Masuk ' + jamDari(terbuka.masuk); }
    else if (rec && rec.pulang) { b.classList.add('selesai'); $('#labelAbsen').textContent = 'Selesai'; $('#subAbsen').textContent = 'Sampai jumpa besok'; }
    else { $('#labelAbsen').textContent = 'Check-in'; $('#subAbsen').textContent = 'Tap untuk masuk'; }
    b.setAttribute('aria-label', $('#labelAbsen').textContent + (k ? ' sebagai ' + k.nama : '') + '. ' + $('#subAbsen').textContent);
    $('#vMasuk').textContent = rec ? jamDari(rec.masuk) : '--:--';
    $('#vMasuk').className = rec && rec.telat ? 'telat' : '';
    $('#vMasuk').title = rec && rec.telat ? 'Telat ' + rec.telat + ' menit' : '';
    $('#vPulang').textContent = rec && rec.pulang ? jamDari(rec.pulang) : '--:--';
    var mnt = rec ? ((rec.pulang ? new Date(rec.pulang) : new Date()) - new Date(rec.masuk)) / 60e3 : 0;
    $('#vDurasi').textContent = durasi(mnt);
    var target = rec ? (jadwalPulang(rec.tgl, rec.jadwal) - jadwalMasuk(rec.tgl, rec.jadwal)) / 60e3 : 1;
    $('#cincinIsi').style.strokeDashoffset = 641 * (1 - Math.min(1, rec ? mnt / target : 0));
  }
  $('#tombolAbsen').onclick = function () { prosesAbsen(kidAbsen(), 'hp'); };
  function hitungHari() {
    var hariIni = kunciTgl(new Date()), c = { hadir: 0, telat: 0, izin: 0, belum: 0, libur: 0 };
    var baris = aktif().map(function (k) {
      var s = statusHari(k, hariIni);
      var g = s === 'sakit' || s === 'cuti' ? 'izin' : s === 'alpa' ? 'belum' : s;
      if (c[g] !== undefined) c[g]++;
      return { k: k, s: s, a: absenTgl(k.id, hariIni) || absenTerbuka(k.id) };
    });
    return { c: c, baris: baris };
  }
  function renderTim() {
    var h = hitungHari(), c = h.c, total = c.hadir + c.telat + c.izin + c.belum;
    var bag = [{ label: 'Tepat waktu', n: c.hadir, warna: 'var(--s-hadir)' }, { label: 'Telat', n: c.telat, warna: 'var(--s-telat)' }, { label: 'Izin/sakit/cuti', n: c.izin, warna: 'var(--s-izin)' }, { label: 'Belum absen', n: c.belum, warna: WARNA_ST.belum }];
    donat($('#donatHari'), bag, total, (c.hadir + c.telat) + '/' + total, 'hadir');
    $('#donatHari').setAttribute('aria-label', (c.hadir + c.telat) + ' dari ' + total + ' karyawan hadir hari ini');
    legenda($('#legendaHari'), bag, total);
    var urut = { telat: 1, hadir: 2, belum: 0, izin: 3, sakit: 3, cuti: 3, libur: 4 };
    h.baris.sort(function (a, b) { return (urut[a.s] || 0) - (urut[b.s] || 0); });
    $('#daftarTim').innerHTML = h.baris.map(function (r, i) {
      var sh = shiftDari(r.k), ket = r.a ? 'Masuk ' + jamDari(r.a.masuk) + (r.a.pulang ? ' · pulang ' + jamDari(r.a.pulang) : '') : 'Shift ' + sh.nama + ' ' + sh.masuk;
      var c = chip(r.s);
      if (r.s === 'belum' && keMenit(sh.masuk) > new Date().getHours() * 60 + new Date().getMinutes() && keMenit(sh.pulang) > keMenit(sh.masuk)) c = '<span class="status st-libur">Mulai ' + esc(sh.masuk) + '</span>';
      else if (r.s === 'belum' && keMenit(sh.masuk) + sh.toleransi < new Date().getHours() * 60 + new Date().getMinutes()) c = '<span class="status st-alpa">Belum absen</span>';
      return '<li style="--i:' + i + '">' + avatar(r.k) + '<span class="nm"><b>' + esc(r.k.nama) + '</b><small>' + esc(ket) + '</small></span>' + c + '</li>';
    }).join('') || '<li class="redup">Belum ada karyawan.</li>';
  }
  $('#ajukanIzin').onclick = function () { formIzin(kidAbsen()); };

  // ---------- Jam hidup ----------
  var menitTerakhir = -1;
  function detik() {
    var d = new Date(), j = dua(d.getHours()) + ':' + dua(d.getMinutes());
    $('#jamHidup').innerHTML = j + '<small>:' + dua(d.getSeconds()) + '</small>';
    $('#tglHari').textContent = tglPanjang(d);
    $('#pilJamKini').textContent = j;
    if (!$('#kiosk').hidden) { $('#kioskJam').textContent = j; $('#kioskTgl').textContent = tglPanjang(d); }
    if (d.getMinutes() !== menitTerakhir) { menitTerakhir = d.getMinutes(); if (halAktif === 'absen') { renderTombol(); renderTim(); } }
  }
  setInterval(detik, 1000);

  // ---------- KALENDER ----------
  var kalK = null, kalBulan = new Date(); kalBulan.setDate(1);
  var tglDipilih = null;
  $('#kalSebelum').onclick = function () { kalBulan.setMonth(kalBulan.getMonth() - 1); tglDipilih = null; renderKalender(); };
  $('#kalSesudah').onclick = function () { kalBulan.setMonth(kalBulan.getMonth() + 1); tglDipilih = null; renderKalender(); };
  function renderKalender() {
    var daftar = aktif();
    if (!kalK || !karyawan(kalK)) kalK = kidAbsen();
    $('#chipOrang').innerHTML = daftar.map(function (k) { return '<button class="chip" role="tab" aria-selected="' + (k.id === kalK) + '" data-k="' + k.id + '">' + avatar(k) + esc(k.nama.split(' ')[0]) + '</button>'; }).join('');
    $$('#chipOrang .chip').forEach(function (b) { b.onclick = function () { kalK = b.getAttribute('data-k'); tglDipilih = null; renderKalender(); }; });
    var k = karyawan(kalK), th = kalBulan.getFullYear(), bl = kalBulan.getMonth();
    $('#kalBulan').textContent = BULAN_P[bl] + ' ' + th;
    if (!k) { $('#kalGrid').innerHTML = '<p class="redup">Belum ada karyawan.</p>'; return; }
    var r = rekapBulan(k, th, bl);
    $('#kalStat').innerHTML = [['Hadir', r.hadir, 1], ['Telat', r.telat], ['Izin', r.izin + r.sakit + r.cuti], ['Alpa', r.alpa], ['Lembur', Math.floor(r.lembur / 60) + 'j']].map(function (s) { return '<div' + (s[2] ? ' class="sorot" data-bagian="aksen"' : '') + '><b>' + s[1] + '</b><small>' + s[0] + '</small></div>'; }).join('');
    var awal = new Date(th, bl, 1).getDay(), awalSen = (awal + 6) % 7, akhir = new Date(th, bl + 1, 0).getDate(), hariIni = kunciTgl(new Date());
    var html = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(function (h) { return '<span class="hd" role="columnheader">' + h + '</span>'; }).join('');
    for (var i = 0; i < awalSen; i++) html += '<span class="hari kosong" aria-hidden="true"></span>';
    for (var t = 1; t <= akhir; t++) {
      var tgl = th + '-' + dua(bl + 1) + '-' + dua(t), s = statusHari(k, tgl), a = absenTgl(k.id, tgl);
      var lbl = t + ' ' + BULAN_P[bl] + ': ' + (LABEL[s] || 'tidak ada data') + (a ? ', masuk ' + jamDari(a.masuk) : '');
      html += '<button class="hari ' + (s || 'nanti') + (tgl === hariIni ? ' kini' : '') + (tgl === tglDipilih ? ' dipilih' : '') + '" style="--i:' + t + '" data-t="' + tgl + '" aria-label="' + esc(lbl) + '">' + t + (a ? '<small>' + jamDari(a.masuk) + '</small>' : '') + '</button>';
    }
    $('#kalGrid').innerHTML = html;
    $$('#kalGrid .hari[data-t]').forEach(function (b) { b.onclick = function () { tglDipilih = b.getAttribute('data-t'); $$('#kalGrid .dipilih').forEach(function (x) { x.classList.remove('dipilih'); }); b.classList.add('dipilih'); detailHari(k, tglDipilih); }; });
    $('#legendaKal').innerHTML = ['hadir', 'telat', 'izin', 'sakit', 'cuti', 'alpa', 'libur'].map(function (s) { return '<li><i style="background:' + WARNA_ST[s] + '"></i>' + LABEL[s] + '</li>'; }).join('');
    var bag = [{ label: 'Tepat waktu', n: r.hadir - r.telat, warna: 'var(--s-hadir)' }, { label: 'Telat', n: r.telat, warna: 'var(--s-telat)' }, { label: 'Izin/sakit/cuti', n: r.izin + r.sakit + r.cuti, warna: 'var(--s-izin)' }, { label: 'Alpa', n: r.alpa, warna: 'var(--s-alpa)' }];
    var tot = r.hadir + r.izin + r.sakit + r.cuti + r.alpa;
    donat($('#donatKal'), bag, tot, r.hadir + '/' + tot, 'hari hadir');
    $('#donatKal').setAttribute('aria-label', r.hadir + ' dari ' + tot + ' hari kerja hadir');
    legenda($('#legendaKal2'), bag, tot);
    if (tglDipilih) detailHari(k, tglDipilih); else $('#detailHari').innerHTML = '<p class="redup">Pilih tanggal untuk lihat jam masuk, pulang, dan lokasi.</p>';
  }
  function detailHari(k, tgl) {
    var a = absenTgl(k.id, tgl), s = statusHari(k, tgl), z = izinPada(k.id, tgl), d = dariKunci(tgl);
    var html = '<h3>' + tglPanjang(d) + ' ' + chip(s) + '</h3>';
    if (a) {
      html += '<dl><dt>Masuk</dt><dd>' + jamDari(a.masuk) + (a.telat ? ' <span class="status st-telat">+' + a.telat + ' mnt</span>' : '') + '</dd><dt>Pulang</dt><dd>' + jamDari(a.pulang) + '</dd>' +
        '<dt>Jadwal</dt><dd>' + esc(a.jadwal.masuk) + '–' + esc(a.jadwal.pulang) + '</dd><dt>Lembur</dt><dd>' + (a.lembur ? durasi(a.lembur) : '—') + '</dd>' +
        '<dt>Lokasi</dt><dd>' + (a.lokasi ? (a.lokasi.jarak != null ? a.lokasi.jarak + ' m dari kantor' : a.lokasi.lat + ', ' + a.lokasi.lng) : '—') + '</dd><dt>Lewat</dt><dd>' + (a.sumber === 'kiosk' ? 'Kiosk' : 'HP pribadi') + '</dd></dl><div id="fotoDetail"></div>';
    } else if (z) html += '<p><b>' + LABEL[z.jenis] + ':</b> ' + esc(z.alasan) + '</p>';
    else html += '<p class="redup">' + (s === 'libur' ? 'Hari libur karyawan ini.' : s === 'alpa' ? 'Tidak ada absen dan tidak ada izin.' : 'Belum ada data.') + '</p>';
    $('#detailHari').innerHTML = html;
    if (a && a.foto) fotoAmbil(a.id).then(function (f) { if (f && $('#fotoDetail')) $('#fotoDetail').innerHTML = '<img class="foto-kecil" alt="Selfie masuk ' + esc(k.nama) + '" src="' + f + '">'; });
  }

  // ---------- REKAP ----------
  var rekBulan = new Date(); rekBulan.setDate(1);
  $('#rekSebelum').onclick = function () { rekBulan.setMonth(rekBulan.getMonth() - 1); renderRekap(); };
  $('#rekSesudah').onclick = function () { rekBulan.setMonth(rekBulan.getMonth() + 1); renderRekap(); };
  function dataRekap() {
    var th = rekBulan.getFullYear(), bl = rekBulan.getMonth();
    return D.karyawan.map(function (k) { return { k: k, r: rekapBulan(k, th, bl) }; }).filter(function (x) { return x.k.aktif !== false || x.r.hadir; });
  }
  function renderRekap() {
    $('#rekBulan').textContent = BULAN_P[rekBulan.getMonth()] + ' ' + rekBulan.getFullYear();
    var data = dataRekap(), t = { hadir: 0, kerja: 0, telat: 0, lembur: 0, bersih: 0, alpa: 0 };
    data.forEach(function (x) { t.hadir += x.r.hadir; t.kerja += x.r.kerja; t.telat += x.r.telat; t.lembur += x.r.lembur; t.bersih += x.r.bersih; t.alpa += x.r.alpa; });
    var pct = t.kerja ? Math.round(t.hadir / t.kerja * 100) : 0;
    $('#ringkasRekap').innerHTML = [['Tingkat kehadiran', pct + '%', 1], ['Total telat', t.telat + '×'], ['Total lembur', durasi(t.lembur)], ['Perkiraan tunjangan bersih', rp(t.bersih)]]
      .map(function (s, i) { return '<div class="mini' + (s[2] ? ' sorot" data-bagian="utama' : '') + '" style="--i:' + i + '"><small>' + s[0] + '</small><b>' + s[1] + '</b></div>'; }).join('');
    $('#tabelRekap tbody').innerHTML = data.map(function (x, i) {
      var r = x.r;
      return '<tr style="--i:' + i + '"><td><span class="orang">' + avatar(x.k) + '<span><b>' + esc(x.k.nama) + '</b><small>' + esc(x.k.jabatan || '') + '</small></span></span></td><td>' + r.hadir + '<span class="redup">/' + r.kerja + '</span></td><td>' + (r.telat ? '<span class="status st-telat">' + r.telat + '</span>' : '0') + '</td><td>' + (r.izin + r.sakit + r.cuti) + '</td><td>' + (r.alpa ? '<span class="status st-alpa">' + r.alpa + '</span>' : '0') + '</td><td>' + (r.lembur ? durasi(r.lembur) : '—') + '</td><td class="plus">' + rp(r.tunjangan) + '</td><td class="min">' + (r.potongan ? '−' + rp(r.potongan) : rp(0)) + '</td><td class="bersih">' + rp(r.bersih) + '</td></tr>';
    }).join('') || '<tr><td colspan="9" class="redup">Belum ada karyawan.</td></tr>';
  }
  function unduh(nama, isi, tipe) {
    var b = new Blob([isi], { type: tipe }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = nama; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  function csv(baris) { return '﻿' + baris.map(function (r) { return r.map(function (c) { c = String(c == null ? '' : c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n'); }
  $('#eksporRekap').onclick = function () {
    var b = [['Nama', 'Jabatan', 'Hari kerja', 'Hadir', 'Telat', 'Telat (menit)', 'Izin', 'Sakit', 'Cuti', 'Alpa', 'Lembur (menit)', 'Tunjangan', 'Potongan', 'Bersih']];
    dataRekap().forEach(function (x) { var r = x.r; b.push([x.k.nama, x.k.jabatan, r.kerja, r.hadir, r.telat, r.telatMnt, r.izin, r.sakit, r.cuti, r.alpa, r.lembur, r.tunjangan, r.potongan, r.bersih]); });
    unduh('rekap-absensi-' + rekBulan.getFullYear() + '-' + dua(rekBulan.getMonth() + 1) + '.csv', csv(b), 'text/csv;charset=utf-8'); toast('Rekap CSV diunduh');
  };

  // ---------- IZIN ----------
  var saringIzin = 'menunggu';
  $$('.seg[data-saring]').forEach(function (b) { b.onclick = function () { saringIzin = b.getAttribute('data-saring'); $$('.seg[data-saring]').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); renderIzin(); }; });
  function renderIzin() {
    var daftar = D.izin.filter(function (z) { return z.status === saringIzin; }).sort(function (a, b) { return saringIzin === 'menunggu' ? a.dari.localeCompare(b.dari) : b.dari.localeCompare(a.dari); }).slice(0, 60);
    $('#daftarIzin').innerHTML = daftar.map(function (z, i) {
      var k = karyawan(z.kid) || { nama: 'Karyawan dihapus', warna: '#888' }, hari = Math.round((dariKunci(z.sampai) - dariKunci(z.dari)) / 864e5) + 1;
      return '<li class="kartu izin" data-bagian="panel" style="--i:' + i + '"><div class="atas">' + avatar(k) + '<div><b>' + esc(k.nama) + '</b><small>Diajukan ' + tglPendek(kunciTgl(new Date(z.t))) + '</small></div>' + chip(z.jenis) + '</div>' +
        '<p class="tanggal"><svg><use href="#i-kal"/></svg>' + tglPendek(z.dari) + (z.sampai !== z.dari ? ' – ' + tglPendek(z.sampai) : '') + ' · ' + hari + ' hari</p><q>' + esc(z.alasan) + '</q>' +
        (z.status === 'menunggu' ? '<div class="aksi"><button class="btn bahaya" data-tolak="' + z.id + '"><svg><use href="#i-x"/></svg>Tolak</button><button class="btn hijau" data-setuju="' + z.id + '"><svg><use href="#i-cek"/></svg>Setujui</button></div>' : '<div class="aksi">' + chip(z.status) + '</div>') + '</li>';
    }).join('') || '<li class="kosong-state"><svg><use href="#i-izin"/></svg><b>' + (saringIzin === 'menunggu' ? 'Tidak ada pengajuan menunggu' : 'Belum ada data') + '</b>' + (saringIzin === 'menunggu' ? 'Semua pengajuan sudah diproses.' : '') + '</li>';
    $$('[data-setuju],[data-tolak]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-setuju') || b.getAttribute('data-tolak'), setuju = b.hasAttribute('data-setuju');
        perluAdmin().then(function (ok) {
          if (!ok) return;
          var z = D.izin.filter(function (x) { return x.id === id; })[0]; if (!z) return;
          z.status = setuju ? 'disetujui' : 'ditolak'; z.diproses = new Date().toISOString(); simpan();
          var li = b.closest('.izin');
          var lanjut = function () { renderIzin(); renderLencana(); toast(setuju ? 'Pengajuan disetujui' : 'Pengajuan ditolak'); };
          if (li && !kurangGerak) { li.style.transition = 'opacity .25s, transform .25s'; li.style.opacity = '0'; li.style.transform = 'scale(.96)'; setTimeout(lanjut, 240); } else lanjut();
        });
      };
    });
  }
  $('#izinBaru').onclick = function () { formIzin(kidAbsen()); };
  function formIzin(kid) {
    var hariIni = kunciTgl(new Date());
    var html = '<label class="label" for="izK">Karyawan</label><select id="izK">' + aktif().map(function (k) { return '<option value="' + k.id + '"' + (k.id === kid ? ' selected' : '') + '>' + esc(k.nama) + '</option>'; }).join('') + '</select>' +
      '<span class="label" id="izJenisL">Jenis</span><div class="tab-seg" role="radiogroup" aria-labelledby="izJenisL">' + ['izin', 'sakit', 'cuti'].map(function (j, i) { return '<button type="button" class="seg" role="radio" data-j="' + j + '" aria-checked="' + (i === 0) + '" aria-selected="' + (i === 0) + '">' + LABEL[j] + '</button>'; }).join('') + '</div>' +
      '<div class="dua"><div><label class="label" for="izDari">Dari</label><input type="date" id="izDari" value="' + hariIni + '"></div><div><label class="label" for="izSampai">Sampai</label><input type="date" id="izSampai" value="' + hariIni + '"></div></div>' +
      '<label class="label" for="izAlasan">Alasan</label><textarea id="izAlasan" placeholder="mis. Demam, ada surat dokter" maxlength="200"></textarea>';
    var jenis = 'izin';
    dialog('Ajukan izin / sakit / cuti', html, [{ label: 'Batal', nilai: null }, { label: 'Kirim pengajuan', kelas: 'utama', submit: true, cek: function () {
      var dari = $('#izDari').value, sampai = $('#izSampai').value, al = $('#izAlasan').value.trim();
      $('#izSampai').removeAttribute('aria-invalid'); $('#izAlasan').removeAttribute('aria-invalid');
      if (!dari || !sampai || sampai < dari) { $('#izSampai').setAttribute('aria-invalid', 'true'); toast('Tanggal "sampai" tidak boleh sebelum "dari"'); return false; }
      if (al.length < 3) { $('#izAlasan').setAttribute('aria-invalid', 'true'); $('#izAlasan').focus(); toast('Tulis alasan singkat dulu'); return false; }
    }, nilai: function () { return { kid: $('#izK').value, jenis: jenis, dari: $('#izDari').value, sampai: $('#izSampai').value, alasan: $('#izAlasan').value.trim() }; } }], function (badan) {
      $$('.seg[data-j]', badan).forEach(function (b) { b.onclick = function () { jenis = b.getAttribute('data-j'); $$('.seg[data-j]', badan).forEach(function (x) { x.setAttribute('aria-checked', x === b); x.setAttribute('aria-selected', x === b); }); }; });
    }).then(function (v) {
      if (!v || !v.kid) return;
      D.izin.push({ id: uid(), kid: v.kid, jenis: v.jenis, dari: v.dari, sampai: v.sampai, alasan: v.alasan, status: 'menunggu', t: new Date().toISOString() });
      simpan(); renderSemua(); toast('Pengajuan terkirim, menunggu persetujuan admin');
    });
  }

  // ---------- KARYAWAN & SHIFT ----------
  function renderKaryawan() {
    $('#gridKary').innerHTML = D.karyawan.map(function (k, i) {
      var sh = shiftDari(k), kerja = (k.hariKerja || []).slice().sort(function (a, b) { return ((a + 6) % 7) - ((b + 6) % 7); }).map(function (h) { return HARI[h]; }).join(' ');
      return '<article class="kartu kary' + (k.aktif === false ? ' nonaktif' : '') + '" data-bagian="panel" style="--i:' + i + '"><div class="atas">' + avatar(k) + '<div><b>' + esc(k.nama) + '</b><small>' + esc(k.jabatan || '—') + '</small></div>' + (k.aktif === false ? '<span class="status st-libur">Nonaktif</span>' : '') + '</div>' +
        '<div class="info"><span class="tag"><svg><use href="#i-' + (sh.ikon === 'malam' ? 'bulan' : 'matahari') + '"/></svg>' + esc(sh.nama) + ' ' + esc(sh.masuk) + '</span><span class="tag"><svg><use href="#i-gembok"/></svg>' + (k.pin ? 'PIN ' + String(k.pin).length + ' digit' : 'Tanpa PIN') + '</span><span class="tag">' + esc(kerja) + '</span></div>' +
        '<div class="aksi"><button class="btn" data-ubah="' + k.id + '"><svg><use href="#i-pensil"/></svg>Ubah</button><button class="btn" data-kal="' + k.id + '"><svg><use href="#i-kal"/></svg>Kalender</button></div></article>';
    }).join('') || '<div class="kosong-state"><svg><use href="#i-orang"/></svg><b>Belum ada karyawan</b>Tambah karyawan pertama untuk mulai absen.</div>';
    $$('[data-ubah]').forEach(function (b) { b.onclick = function () { formKaryawan(karyawan(b.getAttribute('data-ubah'))); }; });
    $$('[data-kal]').forEach(function (b) { b.onclick = function () { kalK = b.getAttribute('data-kal'); tglDipilih = null; buka('kalender'); }; });
    $('#gridShift').innerHTML = D.shift.map(function (s) {
      var n = D.karyawan.filter(function (k) { return k.shift === s.id && k.aktif !== false; }).length;
      return '<button class="kartu shift" data-bagian="panel" data-shift="' + s.id + '"><span class="ikon-shift" data-bagian="aksen"><svg><use href="#i-' + (s.ikon === 'malam' ? 'bulan' : 'matahari') + '"/></svg></span><span><b>Shift ' + esc(s.nama) + '</b><small>' + esc(s.masuk) + '–' + esc(s.pulang) + ' · toleransi ' + s.toleransi + ' mnt · ' + n + ' orang</small></span></button>';
    }).join('');
    $$('[data-shift]').forEach(function (b) { b.onclick = function () { formShift(D.shift.filter(function (s) { return s.id === b.getAttribute('data-shift'); })[0]); }; });
  }
  $('#karyBaru').onclick = function () { formKaryawan(null); };
  $('#shiftBaru').onclick = function () { formShift(null); };
  function formKaryawan(k) {
    var baru = !k; k = k || { nama: '', jabatan: '', shift: D.shift[0] && D.shift[0].id, pin: '', hariKerja: [1, 2, 3, 4, 5, 6], aktif: true };
    var html = '<label class="label" for="fkNama">Nama lengkap</label><input id="fkNama" value="' + esc(k.nama) + '" maxlength="60" autocomplete="off" required>' +
      '<div class="dua"><div><label class="label" for="fkJab">Jabatan</label><input id="fkJab" value="' + esc(k.jabatan) + '" maxlength="40"></div><div><label class="label" for="fkShift">Shift</label><select id="fkShift">' + D.shift.map(function (s) { return '<option value="' + s.id + '"' + (s.id === k.shift ? ' selected' : '') + '>' + esc(s.nama) + ' (' + s.masuk + ')</option>'; }).join('') + '</select></div></div>' +
      '<label class="label" for="fkPin">PIN pribadi (4–6 angka, kosongkan = tanpa PIN)</label><input id="fkPin" value="' + esc(k.pin) + '" inputmode="numeric" maxlength="6" autocomplete="off">' +
      '<span class="label" id="fkHariL">Hari kerja</span><div class="hari-kerja" role="group" aria-labelledby="fkHariL">' + [1, 2, 3, 4, 5, 6, 0].map(function (h) { return '<label><input type="checkbox" value="' + h + '"' + (k.hariKerja.indexOf(h) >= 0 ? ' checked' : '') + '><span>' + HARI[h] + '</span></label>'; }).join('') + '</div>' +
      '<label class="label" for="fkFoto">Foto karyawan (opsional, diperkecil otomatis)</label><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span id="fkPrev">' + avatar(k) + '</span><input type="file" id="fkFoto" accept="image/*" style="flex:1;min-width:0"><button type="button" class="btn" id="fkFotoHapus">Hapus foto</button></div>' +
      '<label class="saklar"><input type="checkbox" id="fkAktif"' + (k.aktif !== false ? ' checked' : '') + '><span>Aktif (muncul di absen & kiosk)</span></label>';
    var aksi = [{ label: 'Batal', nilai: null }, { label: baru ? 'Tambah' : 'Simpan', kelas: 'utama', submit: true, cek: function () {
      var nm = $('#fkNama'), pin = $('#fkPin').value.trim();
      nm.removeAttribute('aria-invalid'); $('#fkPin').removeAttribute('aria-invalid');
      if (nm.value.trim().length < 2) { nm.setAttribute('aria-invalid', 'true'); nm.focus(); toast('Isi nama karyawan'); return false; }
      if (pin && !/^\d{4,6}$/.test(pin)) { $('#fkPin').setAttribute('aria-invalid', 'true'); $('#fkPin').focus(); toast('PIN harus 4–6 angka'); return false; }
    }, nilai: function () { return 'simpan'; } }];
    if (!baru) aksi.unshift({ label: '<svg><use href="#i-hapus"/></svg>', kelas: 'bahaya', nilai: 'hapus' });
    dialog(baru ? 'Tambah karyawan' : 'Ubah karyawan', html, aksi, function () { var h = $('#dlgAksi .bahaya'); if (h) { h.setAttribute('aria-label', 'Hapus karyawan'); h.style.flex = '0 0 52px'; } }).then(function (v) {
      if (v === 'hapus') return hapusKaryawan(k);
      if (v !== 'simpan') return;
    });
    // nilai dibaca sebelum dialog ditutup lewat cek di atas; simpan memakai nilai di DOM saat tombol ditekan
    var fotoBaru = k.foto || '';
    $('#fkFoto').onchange = function () { var f = this.files[0]; if (!f) return; kecilkanFoto(f).then(function (d) { fotoBaru = d; $('#fkPrev').innerHTML = avatar({ nama: $('#fkNama').value || k.nama, warna: k.warna, foto: d }); }).catch(function () { toast('Gambar tidak bisa dibaca'); }); };
    $('#fkFotoHapus').onclick = function () { fotoBaru = ''; $('#fkFoto').value = ''; $('#fkPrev').innerHTML = avatar({ nama: k.nama, warna: k.warna }); };
    var tSimpan = $('#dlgAksi .utama');
    var asli = tSimpan.onclick;
    tSimpan.onclick = function (e) {
      e.preventDefault();
      if (aksi[aksi.length - 1].cek() === false) return;
      k.nama = $('#fkNama').value.trim(); k.jabatan = $('#fkJab').value.trim(); k.shift = $('#fkShift').value; k.pin = $('#fkPin').value.trim();
      k.hariKerja = $$('.hari-kerja input:checked').map(function (c) { return +c.value; }); k.aktif = $('#fkAktif').checked;
      if (fotoBaru) k.foto = fotoBaru; else delete k.foto;
      if (baru) { k.id = 'k' + uid(); k.warna = WARNA_AVATAR[D.karyawan.length % WARNA_AVATAR.length]; k.mulai = kunciTgl(new Date()); D.karyawan.push(k); }
      simpan(); tutupDialog('simpan'); renderSemua(); toast(baru ? k.nama + ' ditambahkan' : 'Data karyawan disimpan');
      void asli;
    };
  }
  function hapusKaryawan(k) {
    var n = D.absen.filter(function (a) { return a.kid === k.id; }).length;
    dialog('Hapus ' + k.nama + '?', '<p>' + n + ' catatan absen dan semua pengajuan izinnya ikut terhapus. Kalau cuma berhenti kerja, lebih aman matikan saklar <b>Aktif</b> saja. Ketik <b>HAPUS</b> untuk lanjut.</p><label class="label" for="konf">Konfirmasi</label><input id="konf" autocomplete="off">',
      [{ label: 'Batal', nilai: null }, { label: 'Hapus', kelas: 'bahaya', nilai: function () { return $('#konf').value.trim().toUpperCase() === 'HAPUS'; } }]).then(function (ok) {
      if (!ok) { if (ok === false) toast('Dibatalkan — ketik HAPUS untuk konfirmasi'); return; }
      D.karyawan = D.karyawan.filter(function (x) { return x.id !== k.id; });
      D.absen = D.absen.filter(function (a) { return a.kid !== k.id; });
      D.izin = D.izin.filter(function (z) { return z.kid !== k.id; });
      simpan(); renderSemua(); toast(k.nama + ' dihapus');
    });
  }
  function formShift(s) {
    var baru = !s; s = s || { nama: '', masuk: '08:00', pulang: '17:00', toleransi: 10, ikon: 'pagi' };
    var html = '<label class="label" for="fsNama">Nama shift</label><input id="fsNama" value="' + esc(s.nama) + '" maxlength="20" placeholder="mis. Pagi">' +
      '<div class="dua"><div><label class="label" for="fsMasuk">Jam masuk</label><input type="time" id="fsMasuk" value="' + esc(s.masuk) + '"></div><div><label class="label" for="fsPulang">Jam pulang</label><input type="time" id="fsPulang" value="' + esc(s.pulang) + '"></div></div>' +
      '<div class="dua"><div><label class="label" for="fsTol">Toleransi telat (menit)</label><input type="number" id="fsTol" min="0" max="120" value="' + s.toleransi + '"></div><div><label class="label" for="fsIkon">Ikon</label><select id="fsIkon"><option value="pagi"' + (s.ikon !== 'malam' ? ' selected' : '') + '>Matahari</option><option value="malam"' + (s.ikon === 'malam' ? ' selected' : '') + '>Bulan</option></select></div></div>' +
      '<p class="bantuan">Jam pulang lebih kecil dari jam masuk = shift lewat tengah malam (mis. 21:00–05:00).</p>';
    var aksi = [{ label: 'Batal', nilai: null }, { label: baru ? 'Tambah' : 'Simpan', kelas: 'utama', submit: true, cek: function () { if (!$('#fsNama').value.trim()) { $('#fsNama').setAttribute('aria-invalid', 'true'); toast('Isi nama shift'); return false; } },
      nilai: function () { return { nama: $('#fsNama').value.trim(), masuk: $('#fsMasuk').value || '08:00', pulang: $('#fsPulang').value || '17:00', toleransi: Math.min(120, angka($('#fsTol').value)), ikon: $('#fsIkon').value }; } }];
    if (!baru && D.shift.length > 1) aksi.unshift({ label: '<svg><use href="#i-hapus"/></svg>', kelas: 'bahaya', nilai: 'hapus' });
    dialog(baru ? 'Shift baru' : 'Ubah shift ' + s.nama, html, aksi, function () { var h = $('#dlgAksi .bahaya'); if (h) { h.setAttribute('aria-label', 'Hapus shift'); h.style.flex = '0 0 52px'; } }).then(function (v) {
      if (!v) return;
      if (v === 'hapus') {
        var pakai = D.karyawan.filter(function (k) { return k.shift === s.id; }).length;
        if (pakai) { toast('Masih dipakai ' + pakai + ' karyawan — pindahkan dulu'); return; }
        D.shift = D.shift.filter(function (x) { return x.id !== s.id; }); simpan(); renderSemua(); toast('Shift dihapus'); return;
      }
      Object.keys(v).forEach(function (x) { s[x] = v[x]; });
      if (baru) { s.id = 's' + uid(); D.shift.push(s); }
      simpan(); renderSemua(); toast('Shift disimpan');
    });
  }

  // ---------- ATUR ----------
  function renderAtur() {
    $('#pakaiLokasi').checked = D.kantor.pakai; $('#wajibRadius').checked = D.kantor.wajib;
    $('#inLat').value = D.kantor.lat == null ? '' : D.kantor.lat; $('#inLng').value = D.kantor.lng == null ? '' : D.kantor.lng; $('#inRadius').value = D.kantor.radius;
    $('#pakaiSelfie').checked = D.selfie.pakai; $('#wajibSelfie').checked = D.selfie.wajib; $('#inPinAdmin').value = D.pinAdmin;
    $('#inMakan').value = D.uang.makan.toLocaleString('id-ID'); $('#inLembur').value = D.uang.lembur.toLocaleString('id-ID');
    $('#inPotTelat').value = D.uang.potTelat.toLocaleString('id-ID'); $('#inPotAlpa').value = D.uang.potAlpa.toLocaleString('id-ID'); $('#inMinLembur').value = D.uang.minLembur;
  }
  $$('#formUang input[inputmode="numeric"]').forEach(function (i) { i.addEventListener('input', function () { var n = angka(i.value); i.value = n ? n.toLocaleString('id-ID') : ''; }); });
  $('#formLokasi').onsubmit = function (e) {
    e.preventDefault();
    var lat = $('#inLat').value.trim(), lng = $('#inLng').value.trim(), la = parseFloat(lat), ln = parseFloat(lng);
    $('#inLat').removeAttribute('aria-invalid'); $('#inLng').removeAttribute('aria-invalid');
    if (lat && (isNaN(la) || la < -90 || la > 90)) { $('#inLat').setAttribute('aria-invalid', 'true'); toast('Lintang harus antara -90 dan 90'); return; }
    if (lng && (isNaN(ln) || ln < -180 || ln > 180)) { $('#inLng').setAttribute('aria-invalid', 'true'); toast('Bujur harus antara -180 dan 180'); return; }
    if ($('#wajibRadius').checked && (!lat || !lng)) { toast('Isi koordinat kantor dulu untuk mewajibkan radius'); return; }
    D.kantor = { lat: lat ? la : null, lng: lng ? ln : null, radius: Math.max(20, Math.min(5000, angka($('#inRadius').value) || 100)), pakai: $('#pakaiLokasi').checked || $('#wajibRadius').checked, wajib: $('#wajibRadius').checked };
    simpan(); renderAtur(); toast('Lokasi kantor disimpan');
  };
  $('#lokasiSini').onclick = function () {
    var b = this; b.disabled = true; $('#lokasiInfo').textContent = 'Mengambil lokasi…';
    ambilLokasi().then(function (g) {
      b.disabled = false;
      if (g.galat) { $('#lokasiInfo').textContent = g.galat + '. Lokasi butuh izin browser dan halaman https (atau localhost).'; return; }
      $('#inLat').value = g.lat.toFixed(6); $('#inLng').value = g.lng.toFixed(6);
      $('#lokasiInfo').textContent = 'Lokasi didapat (akurasi ±' + g.akurasi + ' m). Tekan Simpan.';
    });
  };
  $('#formSelfie').onsubmit = function (e) {
    e.preventDefault();
    var pin = $('#inPinAdmin').value.trim();
    if (pin && !/^\d{4,6}$/.test(pin)) { $('#inPinAdmin').setAttribute('aria-invalid', 'true'); toast('PIN admin harus 4–6 angka'); return; }
    $('#inPinAdmin').removeAttribute('aria-invalid');
    D.selfie = { pakai: $('#pakaiSelfie').checked || $('#wajibSelfie').checked, wajib: $('#wajibSelfie').checked };
    D.pinAdmin = pin; if (pin) sesiAdmin = true; D.contoh = D.contoh && pin === '1234';
    simpan(); renderAtur(); toast('Pengaturan disimpan');
  };
  $('#formUang').onsubmit = function (e) {
    e.preventDefault();
    D.uang = { makan: angka($('#inMakan').value), lembur: angka($('#inLembur').value), potTelat: angka($('#inPotTelat').value), potAlpa: angka($('#inPotAlpa').value), minLembur: Math.min(240, angka($('#inMinLembur').value)) };
    D.absen.forEach(function (a) { a.lembur = hitungLembur(a, D.uang.minLembur); });
    simpan(); renderAtur(); toast('Tunjangan & potongan disimpan');
  };
  $('#eksporAbsen').onclick = function () {
    var b = [['Tanggal', 'Nama', 'Jabatan', 'Jadwal', 'Masuk', 'Pulang', 'Telat (menit)', 'Lembur (menit)', 'Status', 'Lintang', 'Bujur', 'Jarak kantor (m)', 'Lewat']];
    D.absen.slice().sort(function (a, c) { return a.tgl.localeCompare(c.tgl) || a.masuk.localeCompare(c.masuk); }).forEach(function (a) {
      var k = karyawan(a.kid) || {};
      b.push([a.tgl, k.nama, k.jabatan, a.jadwal.masuk + '-' + a.jadwal.pulang, jamDari(a.masuk), a.pulang ? jamDari(a.pulang) : '', a.telat, a.lembur, a.telat ? 'Telat' : 'Hadir', a.lokasi ? a.lokasi.lat : '', a.lokasi ? a.lokasi.lng : '', a.lokasi && a.lokasi.jarak != null ? a.lokasi.jarak : '', a.sumber]);
    });
    D.izin.filter(function (z) { return z.status === 'disetujui'; }).forEach(function (z) { var k = karyawan(z.kid) || {}; b.push([z.dari + (z.sampai !== z.dari ? ' s/d ' + z.sampai : ''), k.nama, k.jabatan, '', '', '', '', '', LABEL[z.jenis], '', '', '', z.alasan]); });
    unduh('absensi-' + kunciTgl(new Date()) + '.csv', csv(b), 'text/csv;charset=utf-8'); toast('CSV absen diunduh');
  };
  $('#backup').onclick = function () {
    fotoSemua().then(function (foto) {
      unduh('backup-absensi-' + kunciTgl(new Date()) + '.json', JSON.stringify({ aplikasi: 'absensi-karyawan', dibuat: new Date().toISOString(), data: D, foto: foto }), 'application/json');
      toast('Backup JSON diunduh');
    });
  };
  $('#pulihkan').onchange = function () {
    var f = this.files[0]; this.value = ''; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var j; try { j = JSON.parse(r.result); } catch (e) { toast('Berkas bukan JSON yang valid'); return; }
      var d = j && j.data ? j.data : j;
      if (!d || !Array.isArray(d.karyawan) || !Array.isArray(d.absen)) { toast('Ini bukan backup Absensi Karyawan'); return; }
      dialog('Pulihkan backup?', '<p>Data sekarang (' + D.karyawan.length + ' karyawan, ' + D.absen.length + ' absen) akan <b>diganti</b> dengan isi backup (' + d.karyawan.length + ' karyawan, ' + d.absen.length + ' absen).</p>', [{ label: 'Batal', nilai: null }, { label: 'Pulihkan', kelas: 'utama' }]).then(function (ok) {
        if (!ok) return;
        localStorage.setItem(KUNCI, JSON.stringify(d)); muat();
        var fotos = j.foto || {};
        fotoBersihkan().then(function () { return Promise.all(Object.keys(fotos).map(function (id) { return fotoSimpan(id, fotos[id]).catch(function () { }); })); }).then(function () { renderSemua(); toast('Backup dipulihkan'); });
      });
    };
    r.readAsText(f);
  };
  $('#isiContoh').onclick = function () {
    dialog('Isi data contoh?', '<p>Semua data sekarang diganti dengan 9 karyawan fiktif dan absen ±5 minggu. Backup dulu kalau sudah ada data asli.</p>', [{ label: 'Batal', nilai: null }, { label: 'Isi contoh', kelas: 'utama' }]).then(function (ok) {
      if (!ok) return; D = dataContoh(); simpan(); fotoBersihkan(); renderSemua(); toast('Data contoh dimuat');
    });
  };
  $('#hapusSemua').onclick = function () {
    dialog('Hapus semua data?', '<p>Semua karyawan, absen, izin, dan foto selfie dihapus dari perangkat ini. Pengaturan shift & tunjangan tetap. Ketik <b>HAPUS</b> untuk lanjut.</p><label class="label" for="konf">Konfirmasi</label><input id="konf" autocomplete="off">',
      [{ label: 'Batal', nilai: null }, { label: 'Hapus semua', kelas: 'bahaya', nilai: function () { return $('#konf').value.trim().toUpperCase() === 'HAPUS'; } }]).then(function (ok) {
      if (!ok) { if (ok === false) toast('Dibatalkan — ketik HAPUS untuk konfirmasi'); return; }
      var b = dataKosong(); b.shift = D.shift; b.uang = D.uang; b.kantor = D.kantor; b.selfie = D.selfie; b.pinAdmin = D.pinAdmin;
      D = b; simpan(); fotoBersihkan(); renderSemua(); toast('Data dikosongkan. Tambah karyawan di menu Karyawan.');
    });
  };

  // ---------- KIOSK ----------
  function renderKiosk() {
    var hariIni = kunciTgl(new Date());
    $('#kioskGrid').innerHTML = aktif().map(function (k, i) {
      var buka = absenTerbuka(k.id), rec = absenTgl(k.id, hariIni), ket = buka ? 'Masuk ' + jamDari(buka.masuk) : rec && rec.pulang ? 'Selesai' : 'Belum absen';
      return '<button class="kiosk-orang" data-kk="' + k.id + '" style="--i:' + i + '" aria-label="' + esc(k.nama + ', ' + ket) + '">' + avatar(k) + '<b>' + esc(k.nama) + '</b><small class="' + (buka ? 'masuk' : '') + '">' + ket + '</small></button>';
    }).join('');
    $$('[data-kk]').forEach(function (b) { b.onclick = function () { prosesAbsen(b.getAttribute('data-kk'), 'kiosk'); }; });
  }
  function bukaKiosk() {
    $('#kiosk').hidden = false; document.body.style.overflow = 'hidden'; renderKiosk(); detik();
    if (document.documentElement.requestFullscreen && !DEMO) document.documentElement.requestFullscreen().catch(function () { });
    setTimeout(function () { var b = $('#kioskGrid button'); if (b) b.focus(); }, 50);
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search + '#kiosk');
  }
  function tutupKiosk() {
    perluAdmin().then(function (ok) {
      if (!ok) return;
      $('#kiosk').hidden = true; document.body.style.overflow = '';
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () { });
      buka(halAktif);
    });
  }
  $('#bukaKiosk').onclick = bukaKiosk; $('#bukaKiosk2').onclick = bukaKiosk; $('#tutupKiosk').onclick = tutupKiosk;

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
    if (t.nama) { NAMA_TEMA = t.nama; $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; }); }
    setTimeout(hitungTeksBagian, 0);
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (warna per bagian, sorot, tap-untuk-pilih) ----------
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  var PETA_TAMBAHAN = { aksen: '.lencana, .shift-chip svg, .ikon-judul', teks: 'h1, .jam', utama: '.btn.utama, .seg[aria-selected="true"]' };
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
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4 ? '#14152a' : '#ffffff';
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
  ['click', 'pointerdown', 'mousedown', 'touchstart', 'submit', 'keydown', 'change'].forEach(function (tipe) {
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

  // ---------- PWA ----------
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); });
  }

  // ---------- Mulai ----------
  muat();
  $$('[data-tema-nama]').forEach(function (e) { e.textContent = NAMA_TEMA; });
  pasangLogo();
  detik();
  var awalHal = (location.hash || '').slice(1);
  if (awalHal === 'kiosk') { buka('absen'); bukaKiosk(); }
  else buka(['absen', 'kalender', 'rekap', 'izin', 'karyawan', 'atur'].indexOf(awalHal) >= 0 ? awalHal : 'absen');
  tandaiBagian(); hitungTeksBagian();
})();
