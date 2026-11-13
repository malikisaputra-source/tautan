/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Kas Warung — buku kas harian untuk warung. HTML/CSS/JS murni, data di localStorage.
   Dibuat oleh Maliki Studio — malikisaputra.biz.id (MIT). Peta kode: lihat .claude/skills/ubah-kas-warung/SKILL.md */
// KONFIG gambar — ganti logo/foto cukup timpa berkas di img/ atau ubah path di sini.
var KONFIG = {
  logo: 'img/logo.svg',
  fotoBarang: { 'Mi instan': 'img/produk.svg', 'Kopi sachet': 'img/produk.svg' } // nama barang → path foto (kosong = inisial)
};
(function () {
  'use strict';
  var KUNCI = 'kasWarung.v1';
  var VERSI = 1;
  var NAMA_TEMA = (window.TEMA && window.TEMA.nama) || 'Warung Saya';

  // ---------- Utilitas ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function rp(n) { n = Math.round(n || 0); return (n < 0 ? '−' : '') + 'Rp' + Math.abs(n).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function dua(n) { return (n < 10 ? '0' : '') + n; }
  function kunciTgl(d) { return d.getFullYear() + '-' + dua(d.getMonth() + 1) + '-' + dua(d.getDate()); }
  function dariKunci(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function tambahHari(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  var HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  var BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var BULAN_P = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Data ----------
  // Skema: { versi, kasAwal:{'YYYY-MM-DD':n}, tutup:{'YYYY-MM-DD':nFisik}, catatan:[{id,t,jenis:'masuk'|'keluar',jumlah,barang}],
  //          utang:[{id,nama,hp,riwayat:[{t,jenis:'utang'|'bayar',jumlah,ket}]}], fav:{masuk:[..],keluar:[..]} }
  function dataKosong() {
    return { versi: VERSI, kasAwal: {}, tutup: {}, catatan: [], utang: [],
      fav: { masuk: ['Mi instan', 'Kopi sachet', 'Rokok', 'Gas 3kg', 'Telur', 'Minyak goreng', 'Es teh', 'Gula'], keluar: ['Belanja stok', 'Gas LPG', 'Listrik', 'Plastik', 'Es batu'] } };
  }
  function semai(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function dataContoh() {
    var d = dataKosong(), acak = semai(20261107), kini = new Date();
    var jual = [['Mi instan', 3500, 9], ['Kopi sachet', 2500, 8], ['Rokok', 28000, 5], ['Gas 3kg', 22000, 2], ['Telur', 28000, 2], ['Minyak goreng', 19000, 2], ['Es teh', 4000, 6], ['Gula', 17000, 2], ['Beras 5kg', 72000, 1], ['Sabun cuci', 5000, 2]];
    for (var h = 34; h >= 0; h--) {
      var tgl = tambahHari(kini, -h); tgl.setHours(6, 30, 0, 0);
      var k = kunciTgl(tgl); d.kasAwal[k] = 200000;
      var jamMaks = h === 0 ? Math.max(7, kini.getHours()) : 21;
      jual.forEach(function (j) {
        var n = Math.round(j[2] * (0.4 + acak() * 1.2));
        for (var i = 0; i < n; i++) {
          var t = new Date(tgl); t.setHours(6 + Math.floor(acak() * (jamMaks - 6)), Math.floor(acak() * 60));
          if (t > kini) continue;
          var q = j[1] < 6000 ? 1 + Math.floor(acak() * 3) : 1;
          d.catatan.push({ id: uid() + i + h, t: t.toISOString(), jenis: 'masuk', jumlah: j[1] * q, barang: j[0] });
        }
      });
      // belanja stok: tiap 3 hari besar, kadang kecil (bikin beberapa hari rugi)
      if (h % 3 === 1) d.catatan.push({ id: uid() + 'b' + h, t: new Date(tgl.getTime() + 3600e3).toISOString(), jenis: 'keluar', jumlah: Math.round((520 + acak() * 380)) * 1000, barang: 'Belanja stok' });
      if (acak() > .55) d.catatan.push({ id: uid() + 'g' + h, t: new Date(tgl.getTime() + 7200e3).toISOString(), jenis: 'keluar', jumlah: 22000, barang: 'Gas LPG' });
      if (acak() > .7) d.catatan.push({ id: uid() + 'e' + h, t: new Date(tgl.getTime() + 9000e3).toISOString(), jenis: 'keluar', jumlah: 10000, barang: 'Es batu' });
      if (h > 0) {
        var m = 0, kl = 0; d.catatan.forEach(function (c) { if (kunciTgl(new Date(c.t)) === k) { if (c.jenis === 'masuk') m += c.jumlah; else kl += c.jumlah; } });
        d.tutup[k] = 200000 + m - kl - (acak() > .8 ? 5000 : 0);
      }
    }
    var hr = function (n, jam) { var t = tambahHari(kini, -n); t.setHours(jam || 10, 0, 0, 0); return t.toISOString(); };
    d.utang = [
      { id: uid() + 'u1', nama: 'Pak Darto', hp: '', riwayat: [{ t: hr(9), jenis: 'utang', jumlah: 85000, ket: 'Beras + minyak' }, { t: hr(4), jenis: 'bayar', jumlah: 50000, ket: 'Cicil' }, { t: hr(1), jenis: 'utang', jumlah: 28000, ket: 'Rokok' }] },
      { id: uid() + 'u2', nama: 'Mbak Rini', hp: '', riwayat: [{ t: hr(6), jenis: 'utang', jumlah: 44000, ket: 'Gas 3kg + telur' }] },
      { id: uid() + 'u3', nama: 'Kang Ujang', hp: '', riwayat: [{ t: hr(12), jenis: 'utang', jumlah: 60000, ket: 'Kopi 1 renteng' }, { t: hr(2), jenis: 'bayar', jumlah: 60000, ket: 'Lunas' }] },
      { id: uid() + 'u4', nama: 'Bu Endang', hp: '', riwayat: [{ t: hr(3), jenis: 'utang', jumlah: 125000, ket: 'Sembako' }, { t: hr(0, 8), jenis: 'utang', jumlah: 17000, ket: 'Gula' }] }
    ];
    d.contoh = true;
    return d;
  }
  var D;
  function muat() {
    try { D = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { D = null; }
    if (!D || !Array.isArray(D.catatan)) D = dataContoh();
    // Migrasi: lengkapi field yang belum ada di data lama (jangan hapus data pengguna)
    var k = dataKosong();
    Object.keys(k).forEach(function (f) { if (D[f] === undefined) D[f] = k[f]; });
    if (!D.fav.masuk) D.fav.masuk = k.fav.masuk; if (!D.fav.keluar) D.fav.keluar = k.fav.keluar;
    if (!D.foto) D.foto = {};
    D.versi = VERSI;
    simpan();
  }
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori penuh'); } }

  // ---------- Hitungan ----------
  function catatanTgl(k) { return D.catatan.filter(function (c) { return kunciTgl(new Date(c.t)) === k; }); }
  function ringkasTgl(k) {
    var m = 0, kl = 0; catatanTgl(k).forEach(function (c) { if (c.jenis === 'masuk') m += c.jumlah; else kl += c.jumlah; });
    return { masuk: m, keluar: kl, untung: m - kl };
  }
  function sisaUtang(u) { return u.riwayat.reduce(function (s, r) { return s + (r.jenis === 'utang' ? r.jumlah : -r.jumlah); }, 0); }

  // ---------- Animasi angka ----------
  function hitungKe(el, nilai) {
    var awal = +(el.dataset.nilai || 0); el.dataset.nilai = nilai;
    if (kurangGerak || awal === nilai) { el.textContent = rp(nilai); return; }
    var t0 = performance.now(), dur = 650;
    (function langkah(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = rp(awal + (nilai - awal) * e);
      if (p < 1) requestAnimationFrame(langkah);
    })(t0);
  }

  // ---------- Toast ----------
  var tmToast;
  function toast(pesan, aksi) {
    var t = $('#toast'); t.innerHTML = '<span>' + esc(pesan) + '</span>';
    if (aksi) { var b = document.createElement('button'); b.textContent = aksi.label; b.onclick = function () { aksi.fn(); t.classList.remove('tampil'); }; t.appendChild(b); }
    t.classList.add('tampil'); clearTimeout(tmToast); tmToast = setTimeout(function () { t.classList.remove('tampil'); }, aksi ? 5000 : 2600);
  }

  // ---------- Navigasi ----------
  var halAktif = 'hari';
  function buka(hal) {
    halAktif = hal;
    $$('.hal').forEach(function (s) { s.hidden = s.id !== 'hal-' + hal; });
    $$('.nav').forEach(function (b) { var a = b.dataset.hal === hal; b.classList.toggle('aktif', a); if (a) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $('#fab').hidden = hal !== 'hari';
    if (hal === 'hari') renderHari(); else if (hal === 'utang') renderUtang(); else if (hal === 'laporan') renderLaporan(); else renderAtur();
    try { history.replaceState(null, '', '#' + hal); } catch (e) {}
    window.scrollTo(0, 0);
  }
  $$('.nav').forEach(function (b) { b.addEventListener('click', function () { buka(b.dataset.hal); }); });

  // ---------- HARI INI ----------
  var tglAktif = kunciTgl(new Date()), saring = 'semua', idBaru = null;
  function labelTanggal(k) {
    var hariIni = kunciTgl(new Date()), kemarin = kunciTgl(tambahHari(new Date(), -1)), d = dariKunci(k);
    var dasar = HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()];
    return k === hariIni ? 'Hari ini · ' + d.getDate() + ' ' + BULAN[d.getMonth()] : k === kemarin ? 'Kemarin · ' + d.getDate() + ' ' + BULAN[d.getMonth()] : dasar;
  }
  function sapaan() { var j = new Date().getHours(); return j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam'; }

  // ---------- Logo & foto ----------
  function fotoDari(nama) { return (D.foto && D.foto[nama]) || KONFIG.fotoBarang[nama] || ''; }
  function inisial(t) { return esc((t || '?').trim().charAt(0).toUpperCase() || '?'); }
  function htmlFoto(nama, kls) {
    var f = fotoDari(nama);
    return f ? '<img class="' + kls + '" src="' + esc(f) + '" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;' + kls + ' inisial&quot;>' + inisial(nama) + '</span>\'">' : '';
  }
  function kecilkan(file, maks, cb) {
    var r = new FileReader();
    r.onload = function () { var im = new Image(); im.onload = function () {
      var k = Math.min(1, maks / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', .82));
    }; im.onerror = function () { toast('Berkas bukan gambar'); }; im.src = r.result; };
    r.readAsDataURL(file);
  }
  function pasangLogo() {
    var img = $('#logoUsaha'); if (!img) return;
    img.onerror = function () { var s = document.createElement('span'); s.className = 'logo-inisial'; s.id = 'logoUsaha'; s.textContent = ((window.TEMA && TEMA.nama) || 'W').charAt(0).toUpperCase(); img.replaceWith(s); };
    img.src = D.logo || KONFIG.logo;
  }
  function renderHari() {
    var hariIni = kunciTgl(new Date());
    $('#sapa').textContent = sapaan() + ', ' + NAMA_TEMA;
    $('#jHari').textContent = tglAktif === hariIni ? 'Kas hari ini' : 'Kas ' + labelTanggal(tglAktif);
    $('#labelTgl').textContent = labelTanggal(tglAktif);
    $('#hariMaju').disabled = tglAktif >= hariIni;
    var r = ringkasTgl(tglAktif);
    var kartu = $('.untung'); kartu.classList.toggle('rugi', r.untung < 0);
    $('.untung-atas .label').textContent = tglAktif === hariIni ? 'Untung hari ini' : 'Untung ' + labelTanggal(tglAktif).toLowerCase();
    $('#statusUntung').textContent = r.untung < 0 ? 'Rugi' : r.untung === 0 ? 'Impas' : 'Untung';
    hitungKe($('#angkaUntung'), r.untung); hitungKe($('#totMasuk'), r.masuk); hitungKe($('#totKeluar'), r.keluar);
    var tot = r.masuk + r.keluar; $('#barMasuk').style.width = (tot ? r.masuk / tot * 100 : 50) + '%';
    var awal = D.kasAwal[tglAktif] || 0;
    $('#kasAwal').textContent = rp(awal);
    $('#kasAkhir').textContent = rp(awal + r.untung);
    var sel = $('#kasSelisih');
    if (D.tutup[tglAktif] != null) {
      var s = D.tutup[tglAktif] - (awal + r.untung); sel.hidden = false; sel.classList.toggle('minus', s < 0);
      sel.textContent = 'Laci dihitung ' + rp(D.tutup[tglAktif]) + (s === 0 ? ' — pas, tidak ada selisih.' : s < 0 ? ' — kurang ' + rp(-s) + ' dari seharusnya.' : ' — lebih ' + rp(s) + '.');
    } else sel.hidden = true;
    var semua = catatanTgl(tglAktif).sort(function (a, b) { return b.t < a.t ? -1 : 1; });
    $('#jmlCatat').textContent = semua.length;
    var daftar = semua.filter(function (c) { return saring === 'semua' || c.jenis === saring; });
    var ul = $('#daftarCatat');
    if (!daftar.length) {
      ul.innerHTML = '<li class="kosong" style="display:block;border:0"><svg><use href="#i-kosong"/></svg><b>Belum ada catatan</b>Tekan angka di papan, pilih barang, lalu “Catat”.</li>';
    } else {
      ul.innerHTML = daftar.slice(0, 60).map(function (c, i) {
        var t = new Date(c.t);
        return '<li style="--i:' + Math.min(i, 12) + '" data-id="' + c.id + '"' + (c.id === idBaru ? ' class="baru"' : '') + '>' +
          (fotoDari(c.barang) ? htmlFoto(c.barang, 'foto-catat') : '<span class="ikon-jenis ' + c.jenis + '"><svg><use href="#i-' + (c.jenis === 'masuk' ? 'naik' : 'turun') + '"/></svg></span>') +
          '<div><b>' + esc(c.barang || (c.jenis === 'masuk' ? 'Penjualan' : 'Pengeluaran')) + '</b><small>' + dua(t.getHours()) + '.' + dua(t.getMinutes()) + ' · ' + (c.jenis === 'masuk' ? 'Uang masuk' : 'Uang keluar') + '</small></div>' +
          '<span class="nilai ' + c.jenis + '">' + (c.jenis === 'masuk' ? '+' : '−') + rp(c.jumlah) + '</span>' +
          '<button class="hapus-btn" data-hapus="' + c.id + '" aria-label="Hapus catatan ' + esc(c.barang || '') + ' ' + rp(c.jumlah) + '"><svg><use href="#i-hapus"/></svg></button></li>';
      }).join('');
    }
    idBaru = null;
  }
  $('#hariMundur').onclick = function () { tglAktif = kunciTgl(tambahHari(dariKunci(tglAktif), -1)); renderHari(); };
  $('#hariMaju').onclick = function () { var n = kunciTgl(tambahHari(dariKunci(tglAktif), 1)); if (n <= kunciTgl(new Date())) { tglAktif = n; renderHari(); } };
  $$('[data-saring]').forEach(function (b) { b.onclick = function () { saring = b.dataset.saring; $$('[data-saring]').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); renderHari(); }; });
  $('#daftarCatat').addEventListener('click', function (e) {
    var b = e.target.closest('[data-hapus]'); if (!b) return;
    var id = b.dataset.hapus, idx = D.catatan.findIndex(function (c) { return c.id === id; }); if (idx < 0) return;
    var lama = D.catatan[idx], li = b.closest('li');
    var jalan = function () { D.catatan.splice(D.catatan.indexOf(lama), 1); simpan(); renderHari(); toast('Catatan dihapus', { label: 'Urungkan', fn: function () { D.catatan.push(lama); simpan(); renderHari(); } }); };
    if (kurangGerak) jalan(); else { li.classList.add('pergi'); setTimeout(jalan, 260); }
  });
  $('#ubahKasAwal').onclick = function () {
    tanyaAngka('Kas awal', 'Uang di laci saat warung buka (' + labelTanggal(tglAktif) + ').', D.kasAwal[tglAktif] || 0, function (n) { D.kasAwal[tglAktif] = n; simpan(); renderHari(); toast('Kas awal disimpan'); });
  };
  $('#tutupKas').onclick = function () {
    var r = ringkasTgl(tglAktif), harus = (D.kasAwal[tglAktif] || 0) + r.untung;
    tanyaAngka('Tutup kas', 'Hitung uang di laci sekarang. Seharusnya ' + rp(harus) + '.', D.tutup[tglAktif] != null ? D.tutup[tglAktif] : harus, function (n) {
      D.tutup[tglAktif] = n; var besok = kunciTgl(tambahHari(dariKunci(tglAktif), 1));
      if (D.kasAwal[besok] == null) D.kasAwal[besok] = n;
      simpan(); renderHari(); toast(n === harus ? 'Kas pas. Mantap!' : 'Kas ditutup, selisih ' + rp(n - harus));
    });
  };

  // ---------- Panel catat (numpad) ----------
  var jenis = 'masuk', nominal = 0, barangPilih = '';
  var panel = $('#panelCatat'), layar = $('#layarAngka'), inBarang = $('#inBarang');
  function renderNominal(denyut) {
    layar.textContent = rp(nominal);
    if (denyut && !kurangGerak) { layar.classList.remove('denyut'); void layar.offsetWidth; layar.classList.add('denyut'); }
  }
  function setJenis(j) {
    jenis = j; panel.dataset.jenis = j;
    $$('.jenis-btn').forEach(function (b) { b.setAttribute('aria-checked', b.dataset.jenis === j); });
    $('#layarLabel').textContent = j === 'masuk' ? 'Penjualan / uang masuk' : 'Modal / belanja / uang keluar';
    $('#btnCatat span').textContent = j === 'masuk' ? 'Catat uang masuk' : 'Catat uang keluar';
    barangPilih = ''; inBarang.value = ''; renderChip();
  }
  function renderChip() {
    var fav = D.fav[jenis] || [];
    $('#chipBarang').innerHTML = fav.map(function (f) { return '<button type="button" aria-pressed="' + (f === barangPilih) + '">' + htmlFoto(f, 'foto-chip') + '<span>' + esc(f) + '</span></button>'; }).join('');
    var semua = {}; D.catatan.forEach(function (c) { if (c.jenis === jenis && c.barang) semua[c.barang] = 1; });
    $('#dlBarang').innerHTML = Object.keys(semua).slice(0, 50).map(function (b) { return '<option value="' + esc(b) + '">'; }).join('');
  }
  $$('.jenis-btn').forEach(function (b) { b.onclick = function () { setJenis(b.dataset.jenis); }; });
  $('.jenis').addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var j = jenis === 'masuk' ? 'keluar' : 'masuk'; setJenis(j); $('[data-jenis="' + j + '"]').focus(); e.preventDefault(); } });
  $('#chipBarang').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var nm = b.querySelector('span:not(.inisial)'); nm = nm ? nm.textContent : b.textContent; barangPilih = barangPilih === nm ? '' : nm; inBarang.value = barangPilih; renderChip();
  });
  inBarang.addEventListener('input', function () { barangPilih = inBarang.value.trim(); renderChip(); });
  function tekan(n) {
    if (n === 'del') nominal = Math.floor(nominal / 10);
    else { var s = String(nominal === 0 ? '' : nominal) + n; if (s.length > 10) return; nominal = +s; }
    renderNominal(true);
  }
  $('.numpad').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) tekan(b.dataset.n); });
  $('.cepat').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; nominal = Math.min(9999999999, nominal + +b.dataset.tambah); renderNominal(true); });
  function catat() {
    if (!nominal) { var bt = $('#btnCatat'); bt.classList.remove('btnCatat-goyang'); void bt.offsetWidth; bt.classList.add('btnCatat-goyang'); toast('Masukkan jumlah uang dulu'); return; }
    var t = new Date(); var hariIni = kunciTgl(t);
    if (tglAktif !== hariIni) { var d = dariKunci(tglAktif); d.setHours(20, 0, 0, 0); t = d; }
    var c = { id: uid(), t: t.toISOString(), jenis: jenis, jumlah: nominal, barang: inBarang.value.trim().slice(0, 40) };
    D.catatan.push(c); idBaru = c.id;
    if (c.barang && D.fav[jenis].indexOf(c.barang) < 0 && D.fav[jenis].length < 14) D.fav[jenis].push(c.barang);
    simpan(); nominal = 0; barangPilih = ''; inBarang.value = ''; renderNominal(); renderChip();
    if (saring !== 'semua' && saring !== jenis) { saring = 'semua'; $$('[data-saring]').forEach(function (x) { x.setAttribute('aria-selected', x.dataset.saring === 'semua'); }); }
    renderHari(); tutupLembar();
    toast((jenis === 'masuk' ? 'Uang masuk ' : 'Uang keluar ') + rp(c.jumlah) + ' dicatat', { label: 'Urungkan', fn: function () { D.catatan = D.catatan.filter(function (x) { return x.id !== c.id; }); simpan(); renderHari(); } });
  }
  $('#btnCatat').onclick = catat;
  // keyboard laptop: angka, Backspace, Enter
  document.addEventListener('keydown', function (e) {
    if (halAktif !== 'hari' || $('#dlg').open) return;
    var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea') { if (e.key === 'Enter' && e.target === inBarang) { e.preventDefault(); catat(); } return; }
    if (/^[0-9]$/.test(e.key)) { tekan(e.key); e.preventDefault(); }
    else if (e.key === 'Backspace') { tekan('del'); e.preventDefault(); }
    else if (e.key === 'Enter' && e.target === document.body) { catat(); e.preventDefault(); }
  });
  // lembar bawah (HP)
  var fokusSebelum;
  function bukaLembar() { fokusSebelum = document.activeElement; panel.classList.add('buka'); $('#selubung').hidden = false; setTimeout(function () { $('.jenis-btn[aria-checked="true"]').focus(); }, 50); }
  function tutupLembar() { if (!panel.classList.contains('buka')) return; panel.classList.remove('buka'); $('#selubung').hidden = true; if (fokusSebelum && fokusSebelum.focus) fokusSebelum.focus(); }
  $('#fab').onclick = bukaLembar; $('#tutupLembar').onclick = tutupLembar; $('#selubung').onclick = tutupLembar;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') tutupLembar(); });

  // ---------- Dialog ----------
  function dialog(judul, isiHtml, okLabel, onOk) {
    var dlg = $('#dlg'); $('#dlgJudul').textContent = judul; $('#dlgIsi').innerHTML = isiHtml; $('#dlgOk').textContent = okLabel || 'Simpan';
    dlg.onclose = function () { if (dlg.returnValue === 'ok') onOk(dlg); };
    dlg.returnValue = ''; dlg.showModal();
    var f = $('input', dlg); if (f) setTimeout(function () { f.focus(); f.select && f.select(); }, 30);
  }
  function angkaDari(v) { return +(String(v).replace(/[^\d]/g, '')) || 0; }
  function tanyaAngka(judul, ket, awal, fn) {
    dialog(judul, '<p>' + esc(ket) + '</p><label class="label" for="dlgAngka">Jumlah (Rp)</label><input id="dlgAngka" inputmode="numeric" value="' + (awal ? awal.toLocaleString('id-ID') : '') + '">', 'Simpan', function () { fn(angkaDari($('#dlgAngka').value)); });
    pasangFormatRp($('#dlgAngka'));
  }
  function pasangFormatRp(inp) { inp.addEventListener('input', function () { var n = angkaDari(inp.value); inp.value = n ? n.toLocaleString('id-ID') : ''; }); }

  // ---------- KASBON ----------
  function renderUtang() {
    var aktif = D.utang.map(function (u) { return { u: u, sisa: sisaUtang(u) }; }).sort(function (a, b) { return b.sisa - a.sisa; });
    var tot = aktif.reduce(function (s, x) { return s + Math.max(0, x.sisa); }, 0);
    hitungKe($('#totUtang'), tot); $('#jmlUtang').textContent = aktif.filter(function (x) { return x.sisa > 0; }).length + ' orang';
    var ul = $('#daftarUtang');
    if (!aktif.length) { ul.innerHTML = '<li class="panel kosong"><svg><use href="#i-utang"/></svg><b>Belum ada kasbon</b>Catat pelanggan yang ambil barang dulu, bayar belakangan.</li>'; return; }
    ul.innerHTML = aktif.map(function (x, i) {
      var u = x.u, ini = u.nama.split(/\s+/).map(function (s) { return s[0]; }).join('').slice(0, 2).toUpperCase();
      var rw = u.riwayat.slice().sort(function (a, b) { return b.t < a.t ? -1 : 1; }).slice(0, 3).map(function (r) {
        var d = new Date(r.t); return '<li><span>' + d.getDate() + ' ' + BULAN[d.getMonth()] + ' · ' + (r.jenis === 'utang' ? 'Ambil' : 'Bayar') + (r.ket ? ' — ' + esc(r.ket) : '') + '</span><span>' + (r.jenis === 'utang' ? '+' : '−') + rp(r.jumlah) + '</span></li>';
      }).join('');
      return '<li class="panel" data-bagian="panel" style="--i:' + i + '"><div class="utang-atas"><span class="avatar" aria-hidden="true">' + esc(ini) + '</span><div><b>' + esc(u.nama) + '</b><small>' + u.riwayat.length + ' catatan</small></div>' +
        '<span class="utang-sisa' + (x.sisa <= 0 ? ' lunas' : '') + '">' + (x.sisa <= 0 ? 'Lunas' : rp(x.sisa)) + '</span></div><ul class="riwayat">' + rw + '</ul>' +
        '<div class="baris-tombol"><button class="tombol kecil garis" data-ambil="' + u.id + '"><svg><use href="#i-plus"/></svg>Tambah utang</button>' +
        (x.sisa > 0 ? '<button class="tombol kecil utama" data-bayar="' + u.id + '"><svg><use href="#i-dompet"/></svg>Bayar</button>' : '<button class="tombol kecil garis" data-hapus-utang="' + u.id + '" aria-label="Hapus ' + esc(u.nama) + '"><svg><use href="#i-hapus"/></svg>Hapus</button>') + '</div></li>';
    }).join('');
  }
  function formUtang(judul, denganNama, okLabel, fn, ketAwal) {
    dialog(judul, (denganNama ? '<label class="label" for="uNama">Nama pelanggan</label><input id="uNama" required maxlength="40" autocomplete="off">' : '') +
      '<label class="label" for="uJml">Jumlah (Rp)</label><input id="uJml" inputmode="numeric" required>' +
      '<label class="label" for="uKet">Keterangan</label><input id="uKet" maxlength="60" value="' + esc(ketAwal || '') + '" placeholder="mis. Beras 5kg">', okLabel, function () {
      var n = angkaDari($('#uJml').value); if (!n) { toast('Jumlah belum diisi'); return; }
      fn(n, $('#uKet').value.trim(), denganNama ? $('#uNama').value.trim() : '');
    });
    pasangFormatRp($('#uJml'));
  }
  $('#tambahUtang').onclick = function () {
    formUtang('Kasbon baru', true, 'Simpan kasbon', function (n, ket, nama) {
      if (!nama) { toast('Nama belum diisi'); return; }
      var ada = D.utang.find(function (u) { return u.nama.toLowerCase() === nama.toLowerCase(); });
      var r = { t: new Date().toISOString(), jenis: 'utang', jumlah: n, ket: ket };
      if (ada) ada.riwayat.push(r); else D.utang.push({ id: uid(), nama: nama, hp: '', riwayat: [r] });
      simpan(); renderUtang(); toast('Kasbon ' + nama + ' dicatat');
    });
  };
  $('#daftarUtang').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var id = b.dataset.ambil || b.dataset.bayar || b.dataset.hapusUtang, u = D.utang.find(function (x) { return x.id === id; }); if (!u) return;
    if (b.dataset.ambil) formUtang('Tambah utang · ' + u.nama, false, 'Tambah', function (n, ket) { u.riwayat.push({ t: new Date().toISOString(), jenis: 'utang', jumlah: n, ket: ket }); simpan(); renderUtang(); toast('Utang ditambah'); });
    else if (b.dataset.bayar) {
      formUtang('Bayar · ' + u.nama + ' (sisa ' + rp(sisaUtang(u)) + ')', false, 'Terima bayaran', function (n, ket) {
        u.riwayat.push({ t: new Date().toISOString(), jenis: 'bayar', jumlah: n, ket: ket || 'Bayar' });
        D.catatan.push({ id: uid(), t: new Date().toISOString(), jenis: 'masuk', jumlah: n, barang: 'Bayar kasbon ' + u.nama });
        simpan(); renderUtang(); toast(sisaUtang(u) <= 0 ? u.nama + ' lunas!' : 'Pembayaran dicatat & masuk kas');
      }, 'Bayar');
      setTimeout(function () { var j = $('#uJml'); j.value = sisaUtang(u).toLocaleString('id-ID'); j.select(); }, 40);
    } else {
      dialog('Hapus ' + u.nama + '?', '<p>Riwayat kasbon pelanggan ini akan dihapus. Catatan kas tidak berubah.</p>', 'Hapus', function () { D.utang = D.utang.filter(function (x) { return x !== u; }); simpan(); renderUtang(); toast('Pelanggan dihapus'); });
    }
  });

  // ---------- LAPORAN ----------
  var rentang = 'minggu', geser = 0;
  function periode() {
    var kini = new Date(); kini.setHours(0, 0, 0, 0);
    if (rentang === 'minggu') {
      var senin = tambahHari(kini, -((kini.getDay() + 6) % 7) + geser * 7), hari = [];
      for (var i = 0; i < 7; i++) hari.push(tambahHari(senin, i));
      var a = hari[0], b = hari[6];
      return { hari: hari, label: a.getDate() + ' ' + BULAN[a.getMonth()] + ' – ' + b.getDate() + ' ' + BULAN[b.getMonth()] + ' ' + b.getFullYear() };
    }
    var awal = new Date(kini.getFullYear(), kini.getMonth() + geser, 1), hs = [];
    for (var d = new Date(awal); d.getMonth() === awal.getMonth(); d = tambahHari(d, 1)) hs.push(d);
    return { hari: hs, label: BULAN_P[awal.getMonth()] + ' ' + awal.getFullYear() };
  }
  function renderLaporan() {
    var p = periode(), hariIni = kunciTgl(new Date());
    $('#lapLabel').textContent = p.label; $('#lapMaju').disabled = geser >= 0;
    var set = {}; p.hari.forEach(function (h) { set[kunciTgl(h)] = 1; });
    var tM = 0, tK = 0, laris = {}, aktif = 0;
    var data = p.hari.map(function (h) { var k = kunciTgl(h), r = ringkasTgl(k); tM += r.masuk; tK += r.keluar; if (r.masuk || r.keluar) aktif++; return { h: h, k: k, r: r, nanti: k > hariIni }; });
    D.catatan.forEach(function (c) { if (c.jenis === 'masuk' && c.barang && set[kunciTgl(new Date(c.t))] && !/^Bayar kasbon/.test(c.barang)) { var x = laris[c.barang] || (laris[c.barang] = { n: 0, rp: 0 }); x.n++; x.rp += c.jumlah; } });
    hitungKe($('#lapMasuk'), tM); hitungKe($('#lapKeluar'), tK); hitungKe($('#lapUntung'), tM - tK); hitungKe($('#lapRata'), aktif ? (tM - tK) / aktif : 0);
    grafik(data);
    var top = Object.keys(laris).map(function (k) { return { nm: k, n: laris[k].n, rp: laris[k].rp }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 6);
    var maks = top.length ? top[0].n : 1;
    $('#terlaris').innerHTML = top.length ? top.map(function (t, i) {
      return '<li style="--i:' + i + '"><span class="nm">' + esc(t.nm) + '</span><span class="jml">' + t.n + '× · ' + rp(t.rp) + '</span><span class="bar"><i style="width:' + (t.n / maks * 100) + '%"></i></span></li>';
    }).join('') : '<li class="kosong" style="display:block">Belum ada penjualan dengan nama barang di periode ini.</li>';
  }
  function grafik(data) {
    var el = $('#grafik'), W = Math.max(280, el.clientWidth || 640), H = Math.max(220, el.clientHeight || 250), pad = { k: 52, a: 10, b: 26 }, n = data.length;
    var maxP = Math.max(0, Math.max.apply(null, data.map(function (d) { return d.r.untung; })));
    var maxN = Math.max(0, Math.max.apply(null, data.map(function (d) { return -d.r.untung; })));
    var skala = Math.max(maxP, maxN, 1); // skala SAMA untuk positif & negatif
    var tinggi = H - pad.a - pad.b, unit = tinggi / ((maxP + maxN) || 1), y0 = (maxP + maxN) ? pad.a + maxP * unit : pad.a + tinggi;
    var lebar = (W - pad.k) / n, bw = Math.max(4, Math.min(42, lebar * .62));
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '"  aria-hidden="true">';
    [skala, skala / 2].forEach(function (v) { if (v <= maxP) { var y = y0 - v * unit; s += '<line class="bantu" x1="' + pad.k + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text x="0" y="' + (y + 4) + '">' + singkat(v) + '</text>'; } });
    if (maxN) { var yn = y0 + maxN * unit; s += '<line class="bantu" x1="' + pad.k + '" x2="' + W + '" y1="' + yn + '" y2="' + yn + '"/><text x="0" y="' + (yn + 4) + '">' + singkat(-maxN) + '</text>'; }
    s += '<line class="nol" x1="' + pad.k + '" x2="' + W + '" y1="' + y0 + '" y2="' + y0 + '"/>';
    data.forEach(function (d, i) {
      var x = pad.k + i * lebar + (lebar - bw) / 2, v = d.r.untung, h = Math.abs(v) * unit;
      if (h && h < 2) h = 2;
      var y = v >= 0 ? y0 - h : y0;
      s += '<rect class="batang' + (v < 0 ? ' neg' : '') + '" style="--i:' + i + '" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="' + Math.min(6, bw / 3) + '" fill="' + (v < 0 ? 'var(--rugi)' : 'var(--naik)') + '"' + (d.nanti ? ' opacity=".25"' : '') + '><title>' + HARI[d.h.getDay()] + ' ' + d.h.getDate() + ' ' + BULAN[d.h.getMonth()] + ': ' + rp(v) + '</title></rect>';
      if (n <= 7 || i % (W < 500 ? 5 : 3) === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + (n <= 7 ? (W < 500 ? HARI[d.h.getDay()] : HARI[d.h.getDay()] + ' ' + d.h.getDate()) : d.h.getDate()) + '</text>';
    });
    el.innerHTML = s + '</svg>';
    el.setAttribute('aria-label', 'Grafik untung per hari: ' + data.filter(function (d) { return !d.nanti; }).map(function (d) { return HARI[d.h.getDay()] + ' ' + d.h.getDate() + ' ' + rp(d.r.untung); }).join(', '));
  }
  function singkat(v) { var a = Math.abs(v), t = a >= 1e6 ? (a / 1e6).toFixed(1).replace('.0', '') + 'jt' : a >= 1e3 ? Math.round(a / 1e3) + 'rb' : String(Math.round(a)); return (v < 0 ? '−' : '') + t; }
  $$('[data-rentang]').forEach(function (b) { b.onclick = function () { rentang = b.dataset.rentang; geser = 0; $$('[data-rentang]').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); renderLaporan(); }; });
  var tmR; window.addEventListener('resize', function () { clearTimeout(tmR); tmR = setTimeout(function () { if (halAktif === 'laporan') renderLaporan(); }, 200); });
  $('#lapMundur').onclick = function () { geser--; renderLaporan(); };
  $('#lapMaju').onclick = function () { if (geser < 0) { geser++; renderLaporan(); } };

  // ---------- DATA: ekspor, backup ----------
  function baris() {
    return D.catatan.slice().sort(function (a, b) { return a.t < b.t ? -1 : 1; }).map(function (c) {
      var d = new Date(c.t); return [kunciTgl(d), dua(d.getHours()) + ':' + dua(d.getMinutes()), c.jenis === 'masuk' ? 'Masuk' : 'Keluar', c.barang || '', c.jumlah];
    });
  }
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $('#eksCsv').onclick = function () {
    var q = function (v) { v = String(v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var csv = [['Tanggal', 'Jam', 'Jenis', 'Barang', 'Jumlah']].concat(baris()).map(function (r) { return r.map(q).join(','); }).join('\n');
    unduh('kas-warung-' + kunciTgl(new Date()) + '.csv', '﻿' + csv, 'text/csv'); toast('CSV diunduh');
  };
  $('#salinSheets').onclick = function () {
    var tsv = [['Tanggal', 'Jam', 'Jenis', 'Barang', 'Jumlah']].concat(baris()).map(function (r) { return r.join('\t'); }).join('\n');
    var ok = function () { toast('Tersalin. Tempel (Ctrl+V) di Google Sheets'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tsv).then(ok, cadang); else cadang();
    function cadang() { var t = document.createElement('textarea'); t.value = tsv; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Gagal menyalin'); } t.remove(); }
  };
  $('#backup').onclick = function () { unduh('backup-kas-warung-' + kunciTgl(new Date()) + '.json', JSON.stringify(D, null, 1), 'application/json'); toast('Backup diunduh'); };
  $('#pulih').onchange = function (e) {
    var f = e.target.files[0]; if (!f) return; var r = new FileReader();
    r.onload = function () {
      try {
        var x = JSON.parse(r.result); if (!x || !Array.isArray(x.catatan)) throw 0;
        dialog('Pulihkan backup?', '<p>Data sekarang diganti dengan isi berkas (' + x.catatan.length + ' catatan, ' + (x.utang || []).length + ' kasbon).</p>', 'Pulihkan', function () { D = x; muat2(); toast('Backup dipulihkan'); });
      } catch (er) { toast('Berkas bukan backup Kas Warung'); }
      e.target.value = '';
    };
    r.readAsText(f);
  };
  function muat2() { localStorage.setItem(KUNCI, JSON.stringify(D)); muat(); renderChip(); buka(halAktif); }
  function renderAtur() {
    var sel = $('#pilihBarangFoto'); if (sel) sel.innerHTML = D.fav.masuk.concat(D.fav.keluar).map(function (f) { return '<option>' + esc(f) + '</option>'; }).join('');
 $('#inFavMasuk').value = D.fav.masuk.join(', '); $('#inFavKeluar').value = D.fav.keluar.join(', '); }
  $('#simpanFav').onclick = function () {
    var p = function (v) { return v.split(',').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 14); };
    D.fav.masuk = p($('#inFavMasuk').value); D.fav.keluar = p($('#inFavKeluar').value); simpan(); renderChip(); toast('Tombol barang disimpan');
  };
  $('#hapusSemua').onclick = function () {
    dialog('Hapus semua data?', '<p>Semua catatan kas, kas awal, dan kasbon akan dihapus dari perangkat ini. Backup dulu kalau ragu. Ketik <b>HAPUS</b> untuk lanjut.</p><label class="label" for="konf">Konfirmasi</label><input id="konf" autocomplete="off">', 'Hapus semua', function () {
      if ($('#konf').value.trim().toUpperCase() !== 'HAPUS') { toast('Dibatalkan — ketik HAPUS untuk konfirmasi'); return; }
      var fav = D.fav; D = dataKosong(); D.fav = fav; simpan(); renderChip(); toast('Data dikosongkan. Selamat mulai!');
    });
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
    if (t.nama) { NAMA_TEMA = t.nama; $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; }); if (halAktif === 'hari') $('#sapa').textContent = sapaan() + ', ' + NAMA_TEMA; }
    setTimeout(hitungTeksBagian, 0);
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (warna per bagian, sorot, tap-untuk-pilih) ----------
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  var PETA_TAMBAHAN = { aksen: '.cepat button, .pil-status, .avatar, .terlaris .bar i, .ikon-judul', teks: 'h1, h2, .angka-besar', utama: '.nav.aktif' };
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
    if (dom) { tandaiBagian(); if (sorotAktif) sorot(sorotAktif); } if (mode) hitungTeksBagian();
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-mode'] });

  // ---------- Mulai ----------
  muat();
  pasangLogo();
  $('#inLogo').addEventListener('change', function (e) { var f = e.target.files[0]; if (!f) return; kecilkan(f, 400, function (u) { D.logo = u; simpan(); location.reload(); }); e.target.value = ''; });
  $('#inFoto').addEventListener('change', function (e) { var f = e.target.files[0], nm = $('#pilihBarangFoto').value; if (!f || !nm) return; kecilkan(f, 400, function (u) { D.foto[nm] = u; simpan(); renderChip(); toast('Foto ' + nm + ' disimpan'); }); e.target.value = ''; });
  $$('[data-tema-nama]').forEach(function (e) { e.textContent = NAMA_TEMA; });
  setJenis('masuk'); renderNominal();
  var awalHal = (location.hash || '').slice(1);
  buka(['hari', 'utang', 'laporan', 'atur'].indexOf(awalHal) >= 0 ? awalHal : 'hari');
  tandaiBagian(); hitungTeksBagian();
})();
