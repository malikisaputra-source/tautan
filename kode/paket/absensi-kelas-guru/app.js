/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* Absensi Kelas Guru — Maliki Studio (turunan Absensi Karyawan). Data di localStorage, tanpa server. */
(function () {
  'use strict';
  var KUNCI = 'absensi-kelas-guru-v1';
  var DEMO = /[?&]demo\b/.test(location.search);
  var XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  var STATUS = ['H', 'S', 'I', 'A'];
  var NAMA_ST = { H: 'Hadir', S: 'Sakit', I: 'Izin', A: 'Alpa' };
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoTgl(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dariIso(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function teksTgl(s) { var d = dariIso(s); return HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
  function teksBulan(s) { var p = s.split('-'); return BULAN[+p[1] - 1] + ' ' + p[0]; }

  // ---------- Data ----------
  function dataKosong() {
    return { versi: 1, guru: { nama: '', sekolah: '', tahun: '' }, kelas: [], pertemuan: [] };
  }
  function dataContoh() {
    // Semua nama FIKTIF.
    var nama7 = ['Adit Pratama', 'Bunga Lestari', 'Cahya Ramadhan', 'Dewi Anggraini', 'Eko Saputro', 'Fajar Nugroho', 'Gita Permata', 'Hana Salsabila', 'Ilham Maulana', 'Jihan Aulia', 'Kevin Wijaya', 'Laras Ayu', 'Muhammad Rizki', 'Nadia Putri', 'Oki Firmansyah', 'Putri Maharani', 'Raka Aditya', 'Salma Nabila', 'Tegar Prakoso', 'Umi Kalsum', 'Vino Hidayat', 'Wulan Sari', 'Yoga Pamungkas', 'Zahra Amelia'];
    var nama8 = ['Arif Hakim', 'Bella Safitri', 'Candra Kusuma', 'Dinda Rahmawati', 'Erlangga Putra', 'Farah Diba', 'Galih Saputra', 'Indah Purnama', 'Joko Susilo', 'Kirana Dewi', 'Lukman Hakim', 'Mega Utami', 'Nanda Pratiwi', 'Rizal Fahmi', 'Sinta Maharani', 'Taufik Ismail', 'Vania Oktavia', 'Wahyu Setiawan', 'Yulia Rahma', 'Zaki Ramadhan'];
    function siswa(arr, awal) { return arr.map(function (n, i) { return { id: uid() + i, nis: String(awal + i), nama: n, jk: /a$|i$|Putri|Dewi|Sari|Ayu|Umi|Indah|Farah|Mega|Vania|Yulia|Dinda|Kirana|Sinta|Bella|Laras|Salma|Zahra|Wulan|Jihan|Nadia|Gita|Hana|Bunga/.test(n.split(' ')[0]) || /Putri|Dewi|Sari|Ayu|Lestari|Anggraini|Permata|Salsabila|Aulia|Maharani|Nabila|Kalsum|Amelia|Safitri|Rahmawati|Diba|Purnama|Utami|Pratiwi|Oktavia|Rahma/.test(n) ? 'P' : 'L' }; }); }
    var k1 = { id: 'k7a', nama: 'VII-A', mapel: ['Matematika', 'IPA'], siswa: siswa(nama7, 2501) };
    var k2 = { id: 'k8b', nama: 'VIII-B', mapel: ['Matematika'], siswa: siswa(nama8, 2401) };
    var d = dataKosong();
    d.guru = { nama: 'Ibu Rina Kartika, S.Pd.', sekolah: (window.TEMA && TEMA.nama) || 'SMP Harapan Bangsa', tahun: '2026/2027' };
    d.kelas = [k1, k2];
    var hari = new Date(), seed = 7;
    function acak() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var catatan = ['Bab 3 Pecahan: penjumlahan', 'Latihan soal pecahan campuran', 'Ulangan harian bab 3', 'Pembahasan ulangan, remedial', 'Bab 4 Perbandingan', 'Kerja kelompok, PR hal. 52', 'Praktikum sederhana: massa jenis', ''];
    for (var m = 0; m < 45; m++) {
      var t = new Date(hari.getFullYear(), hari.getMonth(), hari.getDate() - m);
      if (t.getDay() === 0 || t.getDay() === 6) continue;
      [[k1, 'Matematika', [1, 3, 5]], [k1, 'IPA', [2, 4]], [k2, 'Matematika', [1, 2, 4]]].forEach(function (j) {
        if (j[2].indexOf(t.getDay()) < 0 || m === 0) return;
        var st = {};
        j[0].siswa.forEach(function (s, idx) {
          var r = acak(); var lemah = idx % 7 === 3 ? 0.08 : 0;
          st[s.id] = r < 0.88 - lemah ? 'H' : r < 0.93 ? 'S' : r < 0.97 ? 'I' : 'A';
        });
        d.pertemuan.push({ id: uid(), kelasId: j[0].id, mapel: j[1], tanggal: isoTgl(t), status: st, catatan: catatan[Math.floor(acak() * catatan.length)] });
      });
    }
    return d;
  }
  var D;
  function muat() {
    if (DEMO) return dataContoh();
    try {
      var raw = localStorage.getItem(KUNCI);
      if (!raw) return dataKosong();
      var d = JSON.parse(raw);
      // migrasi ringan: lengkapi field yang belum ada
      var k = dataKosong();
      d.guru = Object.assign(k.guru, d.guru || {});
      d.kelas = Array.isArray(d.kelas) ? d.kelas : [];
      d.pertemuan = Array.isArray(d.pertemuan) ? d.pertemuan : [];
      d.kelas.forEach(function (x) { x.mapel = x.mapel && x.mapel.length ? x.mapel : ['Umum']; x.siswa = x.siswa || []; });
      d.versi = 1;
      return d;
    } catch (e) { return dataKosong(); }
  }
  function simpan() {
    if (DEMO) return;
    try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: memori browser penuh?'); }
  }
  D = muat();

  // ---------- UI umum ----------
  var tTimer;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('tampil'); clearTimeout(tTimer); tTimer = setTimeout(function () { t.classList.remove('tampil'); }, 2400); }
  function kelasById(id) { return D.kelas.filter(function (k) { return k.id === id; })[0]; }
  function isiSelect(sel, opsi, nilai) {
    sel.innerHTML = opsi.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join('');
    if (nilai != null && opsi.some(function (o) { return o[0] === nilai; })) sel.value = nilai;
  }
  function dialog(html, onSubmit) {
    var dlg = $('#dlg'), f = $('#dlgForm');
    f.innerHTML = html;
    f.onsubmit = function (e) {
      var tombol = e.submitter;
      if (tombol && tombol.value === 'batal') return;
      e.preventDefault();
      if (onSubmit(f, tombol) !== false) dlg.close();
    };
    dlg.showModal();
    var p = f.querySelector('input,textarea,select'); if (p) p.focus();
  }
  function konfirmasi(judul, teks, label) {
    return new Promise(function (ok) {
      dialog('<h2>' + esc(judul) + '</h2><p class="redup" style="margin:0">' + esc(teks) + '</p><div class="dlg-aksi"><button class="btn" value="batal">Batal</button><button class="btn utama" value="ya">' + esc(label || 'Ya') + '</button></div>', function () { ok(true); });
      $('#dlg').addEventListener('close', function h() { $('#dlg').removeEventListener('close', h); ok(false); });
    });
  }

  // ---------- Navigasi ----------
  var halAktif = 'absen';
  function buka(h) {
    halAktif = h;
    $$('.hal').forEach(function (s) { s.hidden = s.id !== 'hal-' + h; });
    $$('.nav').forEach(function (b) { if (b.dataset.hal === h) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    ({ absen: renderAbsen, siswa: renderSiswa, rekap: renderRekap, atur: renderAtur })[h]();
    window.scrollTo(0, 0);
  }
  $$('.nav').forEach(function (b) { b.onclick = function () { buka(b.dataset.hal); }; });
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-ke]'); if (b) buka(b.dataset.ke); });

  // ---------- Absen ----------
  var A = { kelas: null, mapel: null, tgl: isoTgl(new Date()) };
  function cariPertemuan(buat) {
    var p = D.pertemuan.filter(function (x) { return x.kelasId === A.kelas && x.mapel === A.mapel && x.tanggal === A.tgl; })[0];
    if (!p && buat) { p = { id: uid(), kelasId: A.kelas, mapel: A.mapel, tanggal: A.tgl, status: {}, catatan: '' }; D.pertemuan.push(p); }
    return p;
  }
  function renderAbsen() {
    var ada = D.kelas.length > 0;
    $('#absenKosong').hidden = ada; $('#absenIsi').hidden = !ada;
    $('#absenTanggalTeks').textContent = teksTgl(A.tgl);
    if (!ada) return;
    if (!kelasById(A.kelas)) A.kelas = D.kelas[0].id;
    var k = kelasById(A.kelas);
    if (k.mapel.indexOf(A.mapel) < 0) A.mapel = k.mapel[0];
    isiSelect($('#aKelas'), D.kelas.map(function (x) { return [x.id, x.nama + ' (' + x.siswa.length + ')']; }), A.kelas);
    isiSelect($('#aMapel'), k.mapel.map(function (m) { return [m, m]; }), A.mapel);
    $('#aTanggal').value = A.tgl;
    var p = cariPertemuan(false);
    $('#aCatatan').value = p ? p.catatan : '';
    var ol = $('#daftarAbsen');
    if (!k.siswa.length) {
      ol.innerHTML = '<li class="kosong"><h2>Kelas ini belum punya siswa</h2><p>Tambah manual, impor CSV, atau tempel dari Excel.</p><button class="btn utama" data-ke="siswa">Tambah siswa</button></li>';
    } else {
      ol.innerHTML = k.siswa.map(function (s, i) {
        var st = (p && p.status[s.id]) || 'H';
        return '<li class="siswa" data-id="' + s.id + '" data-st="' + st + '" style="--i:' + i + '"><span class="no">' + (i + 1) + '</span><div class="nm"><b>' + esc(s.nama) + '</b><small>' + esc(s.nis || '') + (s.jk ? ' · ' + s.jk : '') + '</small></div>' +
          '<div class="seg" role="group" aria-label="Status ' + esc(s.nama) + '">' + STATUS.map(function (x) { return '<button type="button" class="b-' + x + '" data-st="' + x + '" aria-pressed="' + (x === st) + '" aria-label="' + NAMA_ST[x] + '" title="' + NAMA_ST[x] + '">' + x + '</button>'; }).join('') + '</div></li>';
      }).join('');
    }
    ringkasAbsen();
  }
  function ringkasAbsen() {
    var k = kelasById(A.kelas), p = cariPertemuan(false), n = { H: 0, S: 0, I: 0, A: 0 };
    k.siswa.forEach(function (s) { n[(p && p.status[s.id]) || 'H']++; });
    $('#aRingkas').innerHTML = STATUS.map(function (x) { return '<div class="st-' + x + '"' + (x === 'H' ? ' data-bagian="aksen"' : '') + '><b>' + n[x] + '</b><small>' + NAMA_ST[x] + '</small></div>'; }).join('');
  }
  $('#daftarAbsen').addEventListener('click', function (e) {
    var b = e.target.closest('.seg button'); if (!b) return;
    var li = b.closest('.siswa'), st = b.dataset.st, p = cariPertemuan(true);
    p.status[li.dataset.id] = st; li.dataset.st = st;
    $$('button', li).forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.st === st)); });
    simpan(); ringkasAbsen();
  });
  $('#semuaHadir').onclick = function () {
    var k = kelasById(A.kelas); if (!k || !k.siswa.length) return;
    var p = cariPertemuan(true); k.siswa.forEach(function (s) { p.status[s.id] = 'H'; });
    simpan(); renderAbsen(); toast('Semua ' + k.siswa.length + ' siswa ditandai hadir');
  };
  $('#aKelas').onchange = function () { A.kelas = this.value; renderAbsen(); };
  $('#aMapel').onchange = function () { A.mapel = this.value; renderAbsen(); };
  $('#aTanggal').onchange = function () { if (this.value) { A.tgl = this.value; renderAbsen(); } };
  function geserTgl(n) { var d = dariIso(A.tgl); d.setDate(d.getDate() + n); A.tgl = isoTgl(d); renderAbsen(); }
  $('#tglMundur').onclick = function () { geserTgl(-1); };
  $('#tglMaju').onclick = function () { geserTgl(1); };
  var cTimer;
  $('#aCatatan').addEventListener('input', function () {
    var v = this.value; clearTimeout(cTimer);
    cTimer = setTimeout(function () { var p = cariPertemuan(true); p.catatan = v; simpan(); }, 400);
  });

  // ---------- Kelas & siswa ----------
  var kelasPilih = null;
  function renderSiswa() {
    if (!kelasById(kelasPilih)) kelasPilih = D.kelas[0] ? D.kelas[0].id : null;
    $('#chipKelas').innerHTML = D.kelas.map(function (k) { return '<button class="chip" role="tab" data-k="' + k.id + '" aria-selected="' + (k.id === kelasPilih) + '">' + esc(k.nama) + '<small>' + k.siswa.length + '</small></button>'; }).join('');
    var box = $('#kelasDetail');
    if (!kelasPilih) { box.innerHTML = '<div class="kosong"><img src="img/papan.svg" alt="" width="240" height="150"><h2>Belum ada kelas</h2><p>Klik "Kelas baru", isi nama kelas (mis. VII-A) dan mapel yang kamu ajar.</p></div>'; return; }
    var k = kelasById(kelasPilih);
    box.innerHTML = '<div class="kelas-kepala"><div><h2 style="margin:0">Kelas ' + esc(k.nama) + ' · ' + k.siswa.length + ' siswa</h2><div class="mapel-list">' + k.mapel.map(function (m) { return '<span class="lencana" data-bagian="aksen">' + esc(m) + '</span>'; }).join('') + '</div></div>' +
      '<div class="baris-btn" style="margin:0"><button class="btn kecil" id="ubahKelas"><svg><use href="#i-edit"/></svg>Ubah kelas</button><button class="btn kecil bahaya" id="hapusKelas"><svg><use href="#i-hapus"/></svg>Hapus</button></div></div>' +
      '<div class="baris-btn" style="margin:0 0 12px"><button class="btn utama" id="tambahSiswa" data-bagian="utama"><svg><use href="#i-plus"/></svg>Tambah siswa</button><button class="btn" id="tempelSiswa"><svg><use href="#i-tempel"/></svg>Tempel dari Excel</button><label class="btn" for="imporCsv"><svg><use href="#i-unduh"/></svg>Impor CSV</label><input type="file" id="imporCsv" accept=".csv,text/csv,.txt" class="sembunyi"></div>' +
      (k.siswa.length ? '<div class="tabel-wrap" data-bagian="panel"><table><thead><tr><th class="angka">No</th><th>NIS</th><th>Nama</th><th class="angka">L/P</th><th><span class="sembunyi">Aksi</span></th></tr></thead><tbody>' +
        k.siswa.map(function (s, i) { return '<tr><td class="angka">' + (i + 1) + '</td><td>' + esc(s.nis) + '</td><td><b>' + esc(s.nama) + '</b></td><td class="angka">' + esc(s.jk || '-') + '</td><td><div class="aksi"><button class="btn ikon" data-ubah="' + s.id + '" aria-label="Ubah ' + esc(s.nama) + '"><svg><use href="#i-edit"/></svg></button><button class="btn ikon bahaya" data-hapus="' + s.id + '" aria-label="Hapus ' + esc(s.nama) + '"><svg><use href="#i-hapus"/></svg></button></div></td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="redup">Belum ada siswa. Format CSV/tempel: <code>NIS, Nama, L/P</code> (kolom NIS & L/P boleh kosong).</p>');
    $('#ubahKelas').onclick = function () { formKelas(k); };
    $('#hapusKelas').onclick = function () {
      konfirmasi('Hapus kelas ' + k.nama + '?', 'Semua siswa dan riwayat absen kelas ini ikut terhapus. Backup dulu bila ragu.', 'Hapus').then(function (ok) {
        if (!ok) return; D.kelas = D.kelas.filter(function (x) { return x !== k; }); D.pertemuan = D.pertemuan.filter(function (p) { return p.kelasId !== k.id; }); simpan(); renderSiswa(); toast('Kelas dihapus');
      });
    };
    $('#tambahSiswa').onclick = function () { formSiswa(k, null); };
    $('#tempelSiswa').onclick = function () { formTempel(k); };
    $('#imporCsv').onchange = function () {
      var f = this.files[0]; if (!f) return; var r = new FileReader();
      r.onload = function () { var n = tambahDariTeks(k, String(r.result)); simpan(); renderSiswa(); toast(n + ' siswa diimpor'); };
      r.readAsText(f); this.value = '';
    };
  }
  $('#chipKelas').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (c) { kelasPilih = c.dataset.k; renderSiswa(); } });
  $('#kelasDetail').addEventListener('click', function (e) {
    var k = kelasById(kelasPilih); if (!k) return;
    var u = e.target.closest('[data-ubah]'), h = e.target.closest('[data-hapus]');
    if (u) formSiswa(k, k.siswa.filter(function (s) { return s.id === u.dataset.ubah; })[0]);
    if (h) {
      var s = k.siswa.filter(function (x) { return x.id === h.dataset.hapus; })[0];
      konfirmasi('Hapus ' + s.nama + '?', 'Siswa dihapus dari kelas. Riwayat absennya tidak ikut dihitung lagi.', 'Hapus').then(function (ok) {
        if (!ok) return; k.siswa = k.siswa.filter(function (x) { return x !== s; }); simpan(); renderSiswa(); toast('Siswa dihapus');
      });
    }
  });
  $('#tambahKelas').onclick = function () { formKelas(null); };
  function formKelas(k) {
    dialog('<h2>' + (k ? 'Ubah kelas' : 'Kelas baru') + '</h2>' +
      '<label class="fld"><span>Nama kelas</span><input name="nama" required maxlength="30" placeholder="VII-A" value="' + esc(k ? k.nama : '') + '"></label>' +
      '<label class="fld"><span>Mapel (pisahkan dengan koma)</span><input name="mapel" required placeholder="Matematika, IPA" value="' + esc(k ? k.mapel.join(', ') : '') + '"></label>' +
      '<div class="dlg-aksi"><button class="btn" value="batal" formnovalidate>Batal</button><button class="btn utama" value="ok">Simpan</button></div>', function (f) {
      var nama = f.nama.value.trim(), mapel = f.mapel.value.split(',').map(function (m) { return m.trim(); }).filter(Boolean);
      if (!nama || !mapel.length) return false;
      if (k) {
        k.mapel.forEach(function (lama, i) { if (mapel.indexOf(lama) < 0 && mapel.length === k.mapel.length) { D.pertemuan.forEach(function (p) { if (p.kelasId === k.id && p.mapel === lama) p.mapel = mapel[i]; }); } });
        k.nama = nama; k.mapel = mapel;
      } else { k = { id: uid(), nama: nama, mapel: mapel, siswa: [] }; D.kelas.push(k); }
      kelasPilih = k.id; simpan(); renderSiswa(); toast('Kelas disimpan');
    });
  }
  function formSiswa(k, s) {
    dialog('<h2>' + (s ? 'Ubah siswa' : 'Tambah siswa ke ' + esc(k.nama)) + '</h2>' +
      '<label class="fld"><span>Nama lengkap</span><input name="nama" required maxlength="80" value="' + esc(s ? s.nama : '') + '"></label>' +
      '<label class="fld"><span>NIS / NISN (opsional)</span><input name="nis" inputmode="numeric" maxlength="20" value="' + esc(s ? s.nis : '') + '"></label>' +
      '<label class="fld"><span>Jenis kelamin</span><select name="jk"><option value="">-</option><option value="L"' + (s && s.jk === 'L' ? ' selected' : '') + '>Laki-laki</option><option value="P"' + (s && s.jk === 'P' ? ' selected' : '') + '>Perempuan</option></select></label>' +
      '<div class="dlg-aksi"><button class="btn" value="batal" formnovalidate>Batal</button>' + (s ? '' : '<button class="btn" value="lagi">Simpan &amp; tambah lagi</button>') + '<button class="btn utama" value="ok">Simpan</button></div>', function (f, tombol) {
      var data = { nama: f.nama.value.trim(), nis: f.nis.value.trim(), jk: f.jk.value };
      if (!data.nama) return false;
      if (s) Object.assign(s, data); else k.siswa.push(Object.assign({ id: uid() }, data));
      simpan(); renderSiswa(); toast('Siswa disimpan');
      if (tombol && tombol.value === 'lagi') { f.nama.value = ''; f.nis.value = ''; f.nama.focus(); return false; }
    });
  }
  function formTempel(k) {
    dialog('<h2>Tempel dari Excel / Google Sheets</h2><p class="redup" style="margin:0">Blok kolom di Excel (NIS, Nama, L/P atau cukup Nama), salin, lalu tempel di sini. Satu baris = satu siswa. Baris judul otomatis dilewati.</p>' +
      '<label class="fld"><span>Data siswa</span><textarea name="teks" rows="8" required placeholder="2501&#9;Adit Pratama&#9;L&#10;2502&#9;Bunga Lestari&#9;P"></textarea></label>' +
      '<div class="dlg-aksi"><button class="btn" value="batal" formnovalidate>Batal</button><button class="btn utama" value="ok">Tambahkan</button></div>', function (f) {
      var n = tambahDariTeks(k, f.teks.value); if (!n) { toast('Tidak ada baris yang terbaca'); return false; }
      simpan(); renderSiswa(); toast(n + ' siswa ditambahkan');
    });
  }
  function pecahBaris(baris) {
    if (baris.indexOf('\t') >= 0) return baris.split('\t');
    var sep = baris.indexOf(';') >= 0 && baris.indexOf(',') < 0 ? ';' : ',';
    var out = [], cur = '', q = false;
    for (var i = 0; i < baris.length; i++) {
      var c = baris[i];
      if (c === '"') { if (q && baris[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
      else if (c === sep && !q) { out.push(cur); cur = ''; } else cur += c;
    }
    out.push(cur); return out;
  }
  function tambahDariTeks(k, teks) {
    var n = 0;
    teks.replace(/^﻿/, '').split(/\r?\n/).forEach(function (b) {
      if (!b.trim()) return;
      var kol = pecahBaris(b).map(function (x) { return x.trim(); }).filter(function (x, i, a) { return x || i < a.length - 1; });
      var nis = '', nama = '', jk = '';
      kol.forEach(function (x) {
        if (/^\d{3,}$/.test(x) && !nis) nis = x;
        else if (/^(l|p|laki-laki|perempuan)$/i.test(x) && !jk) jk = x[0].toUpperCase();
        else if (x && !nama && !/^\d+$/.test(x)) nama = x;
      });
      if (!nama || /^(nama|name|nama siswa|nama lengkap)$/i.test(nama)) return;
      k.siswa.push({ id: uid(), nis: nis, nama: nama, jk: jk }); n++;
    });
    return n;
  }

  // ---------- Rekap ----------
  var R = { kelas: null, mapel: '*', bulan: isoTgl(new Date()).slice(0, 7) };
  function hitungRekap() {
    var k = kelasById(R.kelas); if (!k) return null;
    var ps = D.pertemuan.filter(function (p) { return p.kelasId === k.id && p.tanggal.slice(0, 7) === R.bulan && (R.mapel === '*' || p.mapel === R.mapel); })
      .sort(function (a, b) { return a.tanggal < b.tanggal ? -1 : a.tanggal > b.tanggal ? 1 : a.mapel < b.mapel ? -1 : 1; });
    var tot = { H: 0, S: 0, I: 0, A: 0 };
    var baris = k.siswa.map(function (s, i) {
      var n = { H: 0, S: 0, I: 0, A: 0 };
      ps.forEach(function (p) { n[p.status[s.id] || 'H']++; });
      STATUS.forEach(function (x) { tot[x] += n[x]; });
      var pct = ps.length ? Math.round(n.H / ps.length * 1000) / 10 : 0;
      return { no: i + 1, s: s, n: n, pct: pct };
    });
    var jml = ps.length * k.siswa.length;
    return { k: k, ps: ps, baris: baris, tot: tot, pctKelas: jml ? Math.round(tot.H / jml * 1000) / 10 : 0 };
  }
  function renderRekap() {
    var box = $('#rekapIsi');
    if (!D.kelas.length) { box.innerHTML = '<div class="kosong"><img src="img/papan.svg" alt="" width="240" height="150"><h2>Belum ada data</h2><p>Rekap muncul setelah kamu membuat kelas dan mulai absen.</p><button class="btn utama" data-ke="siswa">Buat kelas</button></div>'; return; }
    if (!kelasById(R.kelas)) R.kelas = A.kelas && kelasById(A.kelas) ? A.kelas : D.kelas[0].id;
    var k = kelasById(R.kelas);
    if (R.mapel !== '*' && k.mapel.indexOf(R.mapel) < 0) R.mapel = '*';
    isiSelect($('#rKelas'), D.kelas.map(function (x) { return [x.id, x.nama]; }), R.kelas);
    isiSelect($('#rMapel'), [['*', 'Semua mapel']].concat(k.mapel.map(function (m) { return [m, m]; })), R.mapel);
    $('#rBulan').value = R.bulan;
    var r = hitungRekap();
    var tingkat = function (p) { return p < 75 ? 'rendah' : p < 90 ? 'sedang' : ''; };
    var perhatian = r.baris.filter(function (b) { return r.ps.length && b.pct < 80; }).length;
    box.innerHTML = '<div class="statgrid">' +
      '<div class="panel stat sorot" data-bagian="utama"><small>Kehadiran kelas</small><b>' + r.pctKelas.toString().replace('.', ',') + '%</b></div>' +
      '<div class="panel stat"><small>Pertemuan</small><b>' + r.ps.length + '</b></div>' +
      '<div class="panel stat"><small>Total S / I / A</small><b><span style="color:var(--S)">' + r.tot.S + '</span> / <span style="color:var(--I)">' + r.tot.I + '</span> / <span style="color:var(--A)">' + r.tot.A + '</span></b></div>' +
      '<div class="panel stat"><small>Kehadiran &lt; 80%</small><b>' + perhatian + ' siswa</b></div></div>' +
      (r.ps.length ? '' : '<p class="redup">Belum ada pertemuan di ' + teksBulan(R.bulan) + ' untuk pilihan ini.</p>') +
      '<div class="tabel-wrap" data-bagian="panel"><table><thead><tr><th class="angka">No</th><th>Nama</th><th class="angka">H</th><th class="angka">S</th><th class="angka">I</th><th class="angka">A</th><th>Kehadiran</th></tr></thead><tbody>' +
      r.baris.map(function (b) { return '<tr><td class="angka">' + b.no + '</td><td><b>' + esc(b.s.nama) + '</b></td><td class="angka">' + b.n.H + '</td><td class="angka">' + (b.n.S || '-') + '</td><td class="angka">' + (b.n.I || '-') + '</td><td class="angka"' + (b.n.A ? ' style="color:var(--A);font-weight:800"' : '') + '>' + (b.n.A || '-') + '</td><td><div class="pct"><b>' + (r.ps.length ? b.pct.toString().replace('.', ',') + '%' : '-') + '</b><div class="bar"><i class="' + tingkat(b.pct) + '" style="width:' + (r.ps.length ? b.pct : 0) + '%"></i></div></div></td></tr>'; }).join('') +
      '</tbody></table></div>' +
      (r.ps.length ? '<div class="panel pertemuan-list"><h2>Catatan pertemuan</h2><ol>' + r.ps.slice().reverse().map(function (p) { var a = 0; r.k.siswa.forEach(function (s) { if ((p.status[s.id] || 'H') !== 'H') a++; }); return '<li><b>' + teksTgl(p.tanggal) + '</b> · ' + esc(p.mapel) + ' · ' + a + ' tidak hadir' + (p.catatan ? '<br><span class="redup">' + esc(p.catatan) + '</span>' : ''); }).join('') + '</ol></div>' : '');
  }
  $('#rKelas').onchange = function () { R.kelas = this.value; renderRekap(); };
  $('#rMapel').onchange = function () { R.mapel = this.value; renderRekap(); };
  $('#rBulan').onchange = function () { if (this.value) { R.bulan = this.value; renderRekap(); } };

  function tabelRekap(r) {
    var kepala = ['No', 'NIS', 'Nama', 'L/P'].concat(r.ps.map(function (p) { return dariIso(p.tanggal).getDate() + (R.mapel === '*' ? ' ' + p.mapel.slice(0, 3) : ''); }), ['H', 'S', 'I', 'A', '% Hadir']);
    var isi = r.baris.map(function (b) { return [b.no, b.s.nis, b.s.nama, b.s.jk].concat(r.ps.map(function (p) { return p.status[b.s.id] || 'H'; }), [b.n.H, b.n.S, b.n.I, b.n.A, b.pct]); });
    return [kepala].concat(isi);
  }
  function namaBerkas(ext) { var r = hitungRekap(); return 'rekap-absen-' + r.k.nama.replace(/[^\w-]+/g, '') + '-' + (R.mapel === '*' ? 'semua' : R.mapel.replace(/[^\w-]+/g, '')) + '-' + R.bulan + '.' + ext; }
  function unduhBlob(isi, nama, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function eksporCSV() {
    var r = hitungRekap();
    var csv = tabelRekap(r).map(function (row) { return row.map(function (v) { v = String(v == null ? '' : v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\r\n');
    unduhBlob('﻿' + csv, namaBerkas('csv'), 'text/csv;charset=utf-8'); toast('CSV diunduh (Excel gagal dimuat)');
  }
  function muatXLSX() {
    return new Promise(function (ok, gagal) {
      if (window.XLSX) return ok(window.XLSX);
      var s = document.createElement('script'); s.src = XLSX_URL; s.async = true;
      var t = setTimeout(function () { gagal(new Error('waktu habis')); }, 8000);
      s.onload = function () { clearTimeout(t); window.XLSX ? ok(window.XLSX) : gagal(new Error('kosong')); };
      s.onerror = function () { clearTimeout(t); gagal(new Error('gagal')); };
      document.head.appendChild(s);
    });
  }
  $('#eksporXlsx').onclick = function () {
    if (!hitungRekap()) return toast('Belum ada kelas');
    var btn = this; btn.disabled = true;
    muatXLSX().then(function (X) {
      var r = hitungRekap(), wb = X.utils.book_new();
      var info = [['Rekap Kehadiran ' + r.k.nama + ' — ' + (R.mapel === '*' ? 'Semua mapel' : R.mapel)], [teksBulan(R.bulan) + ' · ' + (D.guru.sekolah || '') + ' · Guru: ' + (D.guru.nama || '-')], ['Kehadiran kelas: ' + r.pctKelas + '% · Pertemuan: ' + r.ps.length], []];
      var ws = X.utils.aoa_to_sheet(info.concat(tabelRekap(r)));
      ws['!cols'] = [{ wch: 4 }, { wch: 9 }, { wch: 26 }, { wch: 4 }].concat(r.ps.map(function () { return { wch: 6 }; }), [{ wch: 4 }, { wch: 4 }, { wch: 4 }, { wch: 4 }, { wch: 8 }]);
      X.utils.book_append_sheet(wb, ws, 'Rekap');
      var cat = [['Tanggal', 'Mapel', 'Tidak hadir', 'Catatan']].concat(r.ps.map(function (p) { var a = 0; r.k.siswa.forEach(function (s) { if ((p.status[s.id] || 'H') !== 'H') a++; }); return [p.tanggal, p.mapel, a, p.catatan || '']; }));
      X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(cat), 'Catatan');
      X.writeFile(wb, namaBerkas('xlsx')); toast('Excel diunduh');
    }).catch(eksporCSV).then(function () { btn.disabled = false; });
  };
  $('#cetakRekap').onclick = function () {
    var r = hitungRekap(); if (!r) return toast('Belum ada kelas');
    $('#cetakArea').innerHTML = '<h1>Rekap Kehadiran Siswa — Kelas ' + esc(r.k.nama) + '</h1><p>' + esc(D.guru.sekolah || '') + (D.guru.tahun ? ' · Tahun ajaran ' + esc(D.guru.tahun) : '') + '</p><p>Mapel: ' + esc(R.mapel === '*' ? 'Semua mapel' : R.mapel) + ' · Bulan: ' + teksBulan(R.bulan) + ' · Pertemuan: ' + r.ps.length + ' · Kehadiran kelas: ' + String(r.pctKelas).replace('.', ',') + '%</p>' +
      '<table><thead><tr><th>No</th><th>NIS</th><th>Nama</th><th>L/P</th><th>H</th><th>S</th><th>I</th><th>A</th><th>% Hadir</th></tr></thead><tbody>' +
      r.baris.map(function (b) { return '<tr><td>' + b.no + '</td><td>' + esc(b.s.nis) + '</td><td>' + esc(b.s.nama) + '</td><td>' + esc(b.s.jk) + '</td><td>' + b.n.H + '</td><td>' + b.n.S + '</td><td>' + b.n.I + '</td><td>' + b.n.A + '</td><td>' + String(b.pct).replace('.', ',') + '%</td></tr>'; }).join('') +
      '<tr><td colspan="4"><b>Jumlah</b></td><td>' + r.tot.H + '</td><td>' + r.tot.S + '</td><td>' + r.tot.I + '</td><td>' + r.tot.A + '</td><td>' + String(r.pctKelas).replace('.', ',') + '%</td></tr></tbody></table>' +
      '<div class="ttd"><div>' + teksTgl(isoTgl(new Date())).replace(/^\w+, /, '') + '<br>Guru Mata Pelajaran<div class="garis-ttd"></div>' + esc(D.guru.nama || '') + '</div></div>';
    window.print();
  };

  // ---------- Atur ----------
  function renderAtur() { $('#gNama').value = D.guru.nama; $('#gSekolah').value = D.guru.sekolah || NAMA_TEMA; $('#gTahun').value = D.guru.tahun; }
  $('#formGuru').onsubmit = function (e) { e.preventDefault(); D.guru.nama = $('#gNama').value.trim(); D.guru.sekolah = $('#gSekolah').value.trim(); D.guru.tahun = $('#gTahun').value.trim(); simpan(); toast('Tersimpan'); };
  $('#backup').onclick = function () { unduhBlob(JSON.stringify(D, null, 1), 'backup-absensi-kelas-' + isoTgl(new Date()) + '.json', 'application/json'); toast('Backup diunduh'); };
  $('#pulihkan').onchange = function () {
    var f = this.files[0]; if (!f) return; var inp = this, rd = new FileReader();
    rd.onload = function () {
      try {
        var d = JSON.parse(rd.result); if (!d || !Array.isArray(d.kelas)) throw 0;
        konfirmasi('Pulihkan backup?', 'Data sekarang diganti isi berkas ' + f.name + ' (' + d.kelas.length + ' kelas).', 'Pulihkan').then(function (ok) {
          if (!ok) return; localStorage.setItem(KUNCI, JSON.stringify(d)); D = muat(); buka('absen'); toast('Data dipulihkan');
        });
      } catch (e) { toast('Berkas bukan backup yang valid'); }
      inp.value = '';
    };
    rd.readAsText(f);
  };
  $('#resetData').onclick = function () {
    konfirmasi('Hapus semua data?', 'Semua kelas, siswa, dan riwayat absen di perangkat ini hilang permanen. Unduh backup dulu.', 'Hapus semua').then(function (ok) {
      if (!ok) return; D = dataKosong(); simpan(); buka('absen'); toast('Semua data dihapus');
    });
  };

  // ---------- Tema (customizer Maliki Studio, lihat tema.css & tema.js) ----------
  var NAMA_TEMA = (window.TEMA && TEMA.nama) || 'Sekolah';
  var FONT_OK = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  $$('[data-tema-nama]').forEach(function (e) { e.textContent = D.guru.sekolah || NAMA_TEMA; });
  function terapkanTema(t) {
    var r = document.documentElement, st = r.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama);
    if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) st.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var f = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      st.setProperty('--tema-font', '"' + f + '", system-ui, sans-serif');
      var l = $('#fontTema'); if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;600;700;800;900&display=swap';
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
  var PETA_TAMBAHAN = { teks: 'h1', utama: '.btn.utama, .chip[aria-selected="true"]', panel: '.panel' };
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
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4 ? '#14201a' : '#ffffff';
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

  // ---------- Mulai ----------
  buka('absen'); tandaiBagian(); hitungTeksBagian();
  if (DEMO) setTimeout(function () { toast('Mode demo: data contoh fiktif, tidak disimpan'); }, 400);
  window.__absenKelas = { data: function () { return D; }, buka: buka, hitungRekap: hitungRekap, tambahDariTeks: tambahDariTeks };

  // ---------- PWA ----------
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); });
  }
})();
