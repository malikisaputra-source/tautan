/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* GAMBAR — SATU tempat untuk semua logo & foto. Ganti = timpa berkas di img/ (nama sama) atau ubah path di sini.
   Kosongkan ('') untuk menyembunyikan. Bila gagal dimuat, otomatis kembali ke ikon/inisial. */
window.GAMBAR = {
  logo: 'img/logo.svg',                 // header + kop surat (persegi, mis. 256×256)
  hero: '',                             // foto lingkungan di beranda (1600×1000). Contoh: 'img/hero-lingkungan.svg'. Kosong = ilustrasi bawaan
  pengurus: ['img/pengurus-1.svg', 'img/pengurus-2.svg', 'img/pengurus-3.svg', 'img/pengurus-4.svg'], // urut sesuai daftar pengurus (1:1, 400×400)
  galeri: [                             // galeri kegiatan (4:3, 800×600)
    { src: 'img/galeri-1.svg', ket: 'Kerja bakti selokan' },
    { src: 'img/galeri-2.svg', ket: 'Ronda malam' },
    { src: 'img/galeri-3.svg', ket: 'Lomba 17 Agustus' },
    { src: 'img/galeri-4.svg', ket: 'Posyandu balita' }
  ]
};

/* Data contoh RT 05 / RW 02 Kelurahan Contoh.
   Semua nama, NIK, No. KK, dan nomor HP di sini FIKTIF. Dibuat relatif ke bulan berjalan
   supaya iuran & kas selalu terlihat "hidup" saat dicoba. */
window.buatDataContoh = function () {
  var kini = new Date();
  function bk(offset) { var d = new Date(kini.getFullYear(), kini.getMonth() + offset, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function tgl(offsetBulan, hari) { var d = new Date(kini.getFullYear(), kini.getMonth() + offsetBulan, hari); if (d > kini) d = new Date(kini); return d.toISOString().slice(0, 10); }
  function depan(hari) { var d = new Date(kini); d.setDate(d.getDate() + hari); return d.toISOString().slice(0, 10); }
  var seed = 7;
  function acak() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

  var keluarga = [
    ['Budi Santoso', 'L', 'Blok A No. 1', 'tetap', [['Siti Aminah', 'P', 'Istri'], ['Rizky Santoso', 'L', 'Anak'], ['Nabila Santoso', 'P', 'Anak']]],
    ['Agus Pratama', 'L', 'Blok A No. 3', 'tetap', [['Dewi Lestari', 'P', 'Istri'], ['Dimas Pratama', 'L', 'Anak']]],
    ['Rahmat Hidayat', 'L', 'Blok A No. 4', 'tetap', [['Nur Aini', 'P', 'Istri'], ['Fikri Hidayat', 'L', 'Anak'], ['Zahra Hidayat', 'P', 'Anak'], ['Hj. Maemunah', 'P', 'Orang Tua']]],
    ['Hendra Wijaya', 'L', 'Blok A No. 7', 'kontrak', [['Rina Marlina', 'P', 'Istri']]],
    ['Joko Susilo', 'L', 'Blok B No. 2', 'tetap', [['Yuni Kartika', 'P', 'Istri'], ['Bagus Susilo', 'L', 'Anak'], ['Putri Susilo', 'P', 'Anak']]],
    ['Lilis Suryani', 'P', 'Blok B No. 5', 'tetap', [['Fajar Nugroho', 'L', 'Anak']]],
    ['Dedi Kurniawan', 'L', 'Blok B No. 6', 'kontrak', [['Ani Rahayu', 'P', 'Istri'], ['Kevin Kurniawan', 'L', 'Anak']]],
    ['Wahyu Saputro', 'L', 'Blok B No. 9', 'tetap', [['Indah Permata', 'P', 'Istri'], ['Aditya Saputro', 'L', 'Anak'], ['Salsa Saputro', 'P', 'Anak']]],
    ['Taufik Ismail', 'L', 'Blok C No. 1', 'tetap', [['Wulan Sari', 'P', 'Istri']]],
    ['Ratna Dewi', 'P', 'Blok C No. 3', 'kontrak', []],
    ['Eko Prasetyo', 'L', 'Blok C No. 4', 'tetap', [['Maya Anggraini', 'P', 'Istri'], ['Raka Prasetyo', 'L', 'Anak'], ['Kirana Prasetyo', 'P', 'Anak']]],
    ['Slamet Riyadi', 'L', 'Blok C No. 8', 'tetap', [['Sumiati', 'P', 'Istri'], ['Andi Riyadi', 'L', 'Anak']]],
    ['Irfan Maulana', 'L', 'Blok D No. 2', 'kontrak', [['Tiara Ramadhani', 'P', 'Istri'], ['Alif Maulana', 'L', 'Anak']]],
    ['Bambang Sutrisno', 'L', 'Blok D No. 5', 'tetap', [['Endang Wahyuni', 'P', 'Istri'], ['Galih Sutrisno', 'L', 'Anak'], ['Laras Sutrisno', 'P', 'Anak']]],
    ['Yusuf Hakim', 'L', 'Blok D No. 6', 'tetap', [['Fitri Handayani', 'P', 'Istri']]],
    ['Sri Mulyani', 'P', 'Blok D No. 9', 'tetap', [['Bayu Firmansyah', 'L', 'Anak'], ['Citra Firmansyah', 'P', 'Anak']]]
  ];
  var kerja = ['Karyawan Swasta', 'Wiraswasta', 'PNS', 'Guru', 'Pedagang', 'Ojek Online', 'Buruh Harian'];
  var tempat = ['Bandung', 'Jakarta', 'Garut', 'Cimahi', 'Sumedang', 'Tasikmalaya', 'Bogor'];
  function nik(jk, th) { var hari = 1 + Math.floor(acak() * 27); if (jk === 'P') hari += 40; return '3273' + '05' + '02' + String(hari).padStart(2, '0') + String(1 + Math.floor(acak() * 12)).padStart(2, '0') + String(th % 100).padStart(2, '0') + String(1 + Math.floor(acak() * 900)).padStart(4, '0'); }

  var kk = keluarga.map(function (k, i) {
    var thKepala = 1968 + Math.floor(acak() * 22);
    function orang(nama, jk, hub, th) {
      var anak = hub === 'Anak';
      return { nama: nama, nik: nik(jk, th), jk: jk, hubungan: hub, tempatLahir: tempat[Math.floor(acak() * tempat.length)], tglLahir: th + '-' + String(1 + Math.floor(acak() * 12)).padStart(2, '0') + '-' + String(1 + Math.floor(acak() * 27)).padStart(2, '0'), agama: i === 9 ? 'Kristen' : 'Islam', pekerjaan: anak ? (kini.getFullYear() - th > 18 ? 'Mahasiswa' : 'Pelajar') : (hub === 'Istri' ? (acak() > .5 ? 'Ibu Rumah Tangga' : kerja[Math.floor(acak() * kerja.length)]) : hub === 'Orang Tua' ? 'Pensiunan' : kerja[Math.floor(acak() * kerja.length)]), kawin: anak ? 'Belum Kawin' : 'Kawin' };
    }
    var anggota = [orang(k[0], k[1], 'Kepala Keluarga', thKepala)];
    k[4].forEach(function (a) { anggota.push(orang(a[0], a[1], a[2], a[2] === 'Anak' ? thKepala + 24 + Math.floor(acak() * 10) : a[2] === 'Orang Tua' ? thKepala - 27 : thKepala + 2)); });
    if (k[4].length === 0) anggota[0].kawin = 'Belum Kawin';
    if (k[1] === 'P' && k[4].length) anggota[0].kawin = 'Cerai Mati';
    return { id: 'kk' + (i + 1), noKK: '32730502' + String(10 + i).padStart(2, '0') + String(4000 + i * 37).padStart(6, '0'), kepala: k[0], alamat: k[2], status: k[3], wa: '62812000' + String(1100 + i * 7), anggota: anggota, dibuat: tgl(-8, 1) };
  });

  // Iuran 6 bulan terakhir. Beberapa KK sengaja menunggak supaya fitur pengingat terlihat.
  var iuran = {}, nominal = 25000;
  var penunggak = { kk4: 3, kk7: 2, kk10: 1, kk13: 4 };
  for (var o = -5; o <= 0; o++) {
    var b = bk(o); iuran[b] = {};
    kk.forEach(function (x, i) {
      var nunggak = penunggak[x.id] || 0;
      if (o > -nunggak) return;               // bulan-bulan terakhir belum dibayar
      if (o === 0 && i % 3 === 0) return;      // bulan ini: sebagian belum bayar
      iuran[b][x.id] = tgl(o, 2 + ((i * 3) % 20));
    });
  }

  var kas = [], n = 1;
  Object.keys(iuran).forEach(function (b) {
    Object.keys(iuran[b]).forEach(function (id) {
      var x = kk.filter(function (k) { return k.id === id; })[0];
      kas.push({ id: 'ks' + (n++), tgl: iuran[b][id], jenis: 'masuk', kategori: 'Iuran', ket: 'Iuran ' + b + ' — ' + x.kepala, jumlah: nominal, ref: 'iuran:' + b + ':' + id });
    });
  });
  for (var m = -5; m <= 0; m++) {
    kas.push({ id: 'ks' + (n++), tgl: tgl(m, 5), jenis: 'keluar', kategori: 'Kebersihan', ket: 'Honor petugas sampah', jumlah: 150000 });
    kas.push({ id: 'ks' + (n++), tgl: tgl(m, 10), jenis: 'keluar', kategori: 'Keamanan', ket: 'Kopi & senter ronda malam', jumlah: 40000 + (m + 6) * 5000 });
    kas.push({ id: 'ks' + (n++), tgl: tgl(m, 12), jenis: 'keluar', kategori: 'Listrik', ket: 'Token listrik pos ronda', jumlah: 50000 });
  }
  kas.push({ id: 'ks' + (n++), tgl: tgl(-5, 1), jenis: 'masuk', kategori: 'Saldo awal', ket: 'Saldo kas dari pengurus lama', jumlah: 1850000 });
  kas.push({ id: 'ks' + (n++), tgl: tgl(-3, 18), jenis: 'masuk', kategori: 'Donasi', ket: 'Sumbangan warga untuk lampu jalan', jumlah: 500000 });
  kas.push({ id: 'ks' + (n++), tgl: tgl(-3, 20), jenis: 'keluar', kategori: 'Perbaikan', ket: 'Ganti 4 lampu jalan LED Blok B & C', jumlah: 620000 });
  kas.push({ id: 'ks' + (n++), tgl: tgl(-2, 8), jenis: 'keluar', kategori: 'Sosial', ket: 'Santunan duka keluarga Bpk. Slamet', jumlah: 300000 });
  kas.push({ id: 'ks' + (n++), tgl: tgl(-1, 14), jenis: 'keluar', kategori: 'Kegiatan', ket: 'Konsumsi kerja bakti selokan', jumlah: 275000 });

  var info = [
    { id: 'in1', jenis: 'pengumuman', judul: 'Kerja bakti bersihkan selokan sebelum musim hujan', isi: 'Mohon setiap KK mengirim minimal satu orang. Bawa cangkul atau sapu lidi. Konsumsi disediakan pengurus.', tgl: depan(3), jam: '07:00', tempat: 'Kumpul di pos ronda Blok B', sematkan: true },
    { id: 'in2', jenis: 'agenda', judul: 'Posyandu balita & lansia', isi: 'Penimbangan, imunisasi, dan cek tensi gratis. Bawa buku KIA.', tgl: depan(6), jam: '08:00', tempat: 'Balai warga RW 02' },
    { id: 'in3', jenis: 'agenda', judul: 'Rapat pengurus & perwakilan warga', isi: 'Bahas rencana pengecatan gapura dan laporan kas triwulan.', tgl: depan(10), jam: '19:30', tempat: 'Rumah Ketua RT, Blok A No. 1' },
    { id: 'in4', jenis: 'pengumuman', judul: 'Jadwal ronda malam diperbarui', isi: 'Jadwal ronda bulan ini sudah ditempel di pos ronda. Yang berhalangan harap tukar jadwal dengan tetangga dan lapor ke Sie Keamanan.', tgl: tgl(0, 1) },
    { id: 'in5', jenis: 'agenda', judul: 'Pengajian rutin ibu-ibu', isi: 'Pengajian bulanan bergiliran. Tuan rumah: Ibu Dewi, Blok A No. 3.', tgl: depan(13), jam: '16:00', tempat: 'Blok A No. 3' },
    { id: 'in6', jenis: 'pengumuman', judul: 'Iuran bisa via transfer', isi: 'Iuran bulanan Rp25.000 bisa dibayar tunai ke Bendahara atau transfer. Kirim bukti ke WA Bendahara.', tgl: tgl(-1, 25) }
  ];

  return {
    versi: 1,
    pengaturan: {
      rt: '05', rw: '02', kelurahan: 'Contoh', kecamatan: 'Sukamaju', kota: 'Kota Bandung', provinsi: 'Jawa Barat',
      alamat: 'Jl. Melati Raya, Kel. Contoh, Kec. Sukamaju, Kota Bandung 40123',
      iuran: nominal, iuranMulai: bk(-5),
      caraBayar: 'Tunai ke Bendahara atau transfer ke BRI 0000-01-000000-00-0 a.n. Kas RT 05 (contoh)',
      pin: '1234'
    },
    pengurus: [
      { jabatan: 'Ketua RT', nama: 'Budi Santoso', wa: '6281200001100' },
      { jabatan: 'Sekretaris', nama: 'Dewi Lestari', wa: '6281200001107' },
      { jabatan: 'Bendahara', nama: 'Yuni Kartika', wa: '6281200001128' },
      { jabatan: 'Sie Keamanan', nama: 'Eko Prasetyo', wa: '6281200001170' }
    ],
    kk: kk, iuran: iuran, kas: kas, info: info,
    surat: [
      { id: 'sr1', no: '001/RT05/RW02/' + ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][new Date(tgl(-1, 9)).getMonth()] + '/' + tgl(-1, 9).slice(0, 4), tgl: tgl(-1, 9), nama: kk[1].anggota[1].nama, nik: kk[1].anggota[1].nik, jk: 'P', tempatLahir: kk[1].anggota[1].tempatLahir, tglLahir: kk[1].anggota[1].tglLahir, agama: 'Islam', pekerjaan: kk[1].anggota[1].pekerjaan, kawin: 'Kawin', alamat: kk[1].alamat, keperluan: 'Pengurusan SKCK', ket: 'Untuk melamar pekerjaan.' }
    ],
    nomorSurat: { tahun: Number(tgl(-1, 9).slice(0, 4)), urut: 1 }
  };
};
