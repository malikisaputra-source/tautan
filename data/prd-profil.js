window.PRD_PROFIL = {
 "absensi-karyawan": {
  "judul": "Absensi Karyawan",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Check-in/out tombol besar dengan jam hidup",
   "Lokasi opsional: radius kantor bisa diwajibkan",
   "Selfie opsional (kamera HP/laptop), disimpan kecil",
   "Shift pagi/siang/malam + toleransi telat",
   "Izin, sakit, cuti dengan persetujuan admin",
   "Kalender kehadiran berwarna per karyawan",
   "Rekap bulanan: hadir, telat, izin, alpa, lembur + perkiraan tunjangan/potongan",
   "Mode kiosk: satu perangkat bersama, pilih nama + PIN pribadi",
   "Ekspor CSV, backup & pulihkan JSON",
   "PWA: pasang di layar utama, jalan offline"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html (PIN admin demo: 1234)",
   "Atur › Hapus semua data, lalu isi karyawan & shift",
   "Isi lokasi kantor bila mau pakai radius",
   "Unggah ke GitHub Pages/Netlify supaya lokasi, kamera & PWA aktif",
   "Backup JSON rutin"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#ajukanIzin",
   "#backup",
   "#bukaKiosk",
   "#bukaKiosk2",
   "#chipOrang",
   "#cincinIsi",
   "#daftarIzin",
   "#daftarTim",
   "#detailHari",
   "#dlg",
   "#dlgAksi",
   "#dlgBadan",
   "#dlgForm",
   "#dlgJudul",
   "#dlgTutup",
   "#donatHari",
   "#donatKal",
   "#eksporAbsen",
   "#eksporRekap",
   "#fontTema",
   "#formLokasi",
   "#formSelfie",
   "#formUang",
   "#gridKary",
   "#gridShift",
   "#hapusSemua",
   "#i-cek",
   "#i-gembok",
   "#i-hapus",
   "#i-hapus-angka",
   "#i-izin",
   "#i-kal",
   "#i-kamera",
   "#i-orang",
   "#i-pensil",
   "#i-pin",
   "#i-x",
   "#inLat",
   "#inLembur",
   "#inLng",
   "#inMakan",
   "#inMinLembur",
   "#inPinAdmin",
   "#inPotAlpa",
   "#inPotTelat",
   "#inRadius",
   "#isiContoh",
   "#izinBaru",
   "#jamHidup",
   "#kalBulan",
   "#kalGrid",
   "#kalSebelum",
   "#kalSesudah",
   "#kalStat",
   "#karyBaru",
   "#kiosk",
   "#kioskGrid",
   "#kioskJam",
   "#kioskTgl",
   "#labelAbsen",
   "#legendaHari",
   "#legendaKal",
   "#legendaKal2",
   "#lencanaIzin",
   "#lencanaIzin2",
   "#lokasiInfo",
   "#lokasiSini",
   "#pakaiLokasi",
   "#pakaiSelfie",
   "#pilJamKini",
   "#pilihOrang",
   "#pulihkan",
   "#rekBulan",
   "#rekSebelum",
   "#rekSesudah",
   "#ringkasRekap",
   "#sapa",
   "#shiftBaru",
   "#shiftChip",
   "#subAbsen",
   "#syarat",
   "#tglHari",
   "#toast",
   "#tombolAbsen",
   "#tutupKiosk",
   "#vDurasi",
   "#vMasuk",
   "#vPulang",
   "#wajibRadius",
   "#wajibSelfie",
   "[data-bagian]",
   "[data-buka]",
   "[data-hal]",
   "[data-saring]",
   "[data-t]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "absensi-kelas-guru": {
  "judul": "Absensi Kelas Guru",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Banyak kelas, tiap kelas bisa beberapa mapel",
   "Daftar siswa: tambah manual, impor CSV, tempel dari Excel",
   "Absen satu ketukan: Hadir/Sakit/Izin/Alpa, bawaan hadir",
   "Tombol \"Semua hadir\" & simpan otomatis",
   "Catatan per pertemuan (materi, PR, kejadian)",
   "Rekap bulanan per siswa: % hadir, jumlah S/I/A",
   "Ringkasan per kelas + tanda siswa kehadiran < 80%",
   "Ekspor Excel (.xlsx) atau CSV, cetak rekap A4 + tanda tangan",
   "Backup/pulihkan JSON, data tetap di perangkat",
   "Bisa di-install & jalan offline (PWA)"
  ],
  "cara": [
   "Unggah folder ke hosting HTTPS (GitHub Pages/Netlify) atau buka index.html",
   "Buka di HP, lalu Install / Tambah ke layar utama",
   "Buat kelas & mapel di menu Kelas & Siswa",
   "Tempel daftar siswa dari Excel",
   "Tiap pertemuan buka Absen, ketuk S/I/A untuk yang tidak hadir",
   "Akhir bulan buka Rekap, unduh Excel atau cetak A4"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aCatatan",
   "#aKelas",
   "#aMapel",
   "#aRingkas",
   "#aTanggal",
   "#absenIsi",
   "#absenKosong",
   "#absenTanggalTeks",
   "#backup",
   "#cetakArea",
   "#cetakRekap",
   "#chipKelas",
   "#daftarAbsen",
   "#dlg",
   "#dlgForm",
   "#eksporXlsx",
   "#fontTema",
   "#formGuru",
   "#gNama",
   "#gSekolah",
   "#gTahun",
   "#i-edit",
   "#i-hapus",
   "#i-plus",
   "#i-tempel",
   "#i-unduh",
   "#kelasDetail",
   "#pulihkan",
   "#rBulan",
   "#rKelas",
   "#rMapel",
   "#rekapIsi",
   "#resetData",
   "#semuaHadir",
   "#tambahKelas",
   "#tglMaju",
   "#tglMundur",
   "#toast",
   "[data-bagian]",
   "[data-hal]",
   "[data-k]",
   "[data-ke]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "belanja-keluarga": {
  "judul": "Anggaran Belanja Keluarga",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Kartu sisa uang bulan ini + aman dipakai per hari sampai gajian",
   "Amplop per kategori dengan cincin & batang progres",
   "Peringatan amplop hampir habis (≥80%) dan lewat batas",
   "Catat belanja cepat: tombol 10rb/25rb/50rb/100rb",
   "Geser sisa batas antar amplop tanpa mengubah pemasukan",
   "Ringkasan mingguan & bulanan dengan grafik per hari",
   "Riwayat dengan cari, saring, ubah & urungkan hapus",
   "Target tabungan dengan setoran & saran per bulan",
   "Ekspor CSV, backup & pulihkan JSON",
   "Mode terang/gelap, rapi di HP dan laptop"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html di browser HP atau laptop",
   "Buka menu Atur: isi pemasukan & tanggal gajian",
   "Sesuaikan amplop dan batasnya, atau hapus data contoh",
   "Catat tiap belanja, unduh backup JSON secara rutin"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#avatarApp",
   "#berkasImpor",
   "#bulanMaju",
   "#bulanMundur",
   "#dlg",
   "#dlgForm",
   "#dlgIsi",
   "#dlgJudul",
   "#dlgKaki",
   "#fontTema",
   "#hal",
   "#isi",
   "#judulHal",
   "#labelBulan",
   "#logoApp",
   "#sapa",
   "#toast",
   "[data-aksi]",
   "[data-bagian]",
   "[data-hal]",
   "[data-hal-ke]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "bengkel-las-hpp": {
  "judul": "Bengkel Las + Hitung HPP",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Order pekerjaan: survei → produksi → pasang → lunas",
   "Master bahan: hollow, siku, plat, pipa, cat, kawat las, baut",
   "Kalkulator bahan dari ukuran + rencana potong & sisa batang",
   "Ongkos tukang per hari & overhead (listrik, gas, transport, sewa alat)",
   "HPP otomatis per order & per m², markup → harga jual & DP",
   "Penawaran / RAB A4 siap cetak + kirim ringkasan via WhatsApp",
   "Laporan laba per bulan + grafik omzet",
   "Ekspor CSV & cadangan JSON, mode gelap, responsif HP"
  ],
  "cara": [
   "Ekstrak folder lalu buka index.html di browser",
   "Isi harga bahan di Master bahan sesuai toko besi langganan",
   "Atur upah tukang & markup di Pengaturan",
   "Hitung ukuran di Kalkulator, lalu klik Jadikan order",
   "Cetak RAB untuk pelanggan, catat DP & pelunasan"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#cetak",
   "#fontTema",
   "#i-percik",
   "#isi",
   "#judulHalaman",
   "#kepalaAksi",
   "#kepalaSub",
   "#menu",
   "#modal",
   "#modalIsi",
   "#modalJudul",
   "#navBawah",
   "#toast",
   "#tombolMode",
   "[data-bagian]",
   "[data-mode]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "catatan-ojol": {
  "judul": "Catatan Ojol",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Catat order: aplikasi, tarif, potongan %, tip, km",
   "Tombol order cepat sekali tap",
   "Pengeluaran: bensin, parkir, makan, servis, cicilan HP",
   "Untung bersih hari ini + cincin progres target",
   "Untung bersih per kilometer, per aplikasi",
   "Grafik mingguan + rincian ala slip gaji",
   "Jam paling cuan + peta panas hari × jam",
   "Ekspor CSV (Excel) & backup/pulihkan JSON",
   "Mode gelap pekat, nyaman dilihat di jalan"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak",
   "Buka index.html di browser HP/laptop (atau unggah ke GitHub Pages)",
   "Atur target harian & potongan tiap aplikasi di menu Atur",
   "Tekan \"Mulai dari nol\" untuk menghapus data contoh",
   "Tekan Order selesai tiap habis antar, backup tiap minggu"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aCepat",
   "#aTarget",
   "#appCepat",
   "#appCepatNama",
   "#bannerDemo",
   "#batangApp",
   "#bersihHari",
   "#bersihMinggu",
   "#chipCepat",
   "#cincinTarget",
   "#daftarRiwayat",
   "#dlgKeluar",
   "#dlgOrder",
   "#dlgYakin",
   "#filePulih",
   "#fontTema",
   "#formAtur",
   "#formKeluar",
   "#formOrder",
   "#grafikJam",
   "#grafikMinggu",
   "#hapusFoto",
   "#i-bulan",
   "#i-matahari",
   "#juaraJam",
   "#judulHari",
   "#judulMinggu",
   "#jumlahLog",
   "#kCatatan",
   "#kChip",
   "#kGalat",
   "#kJumlah",
   "#kKategori",
   "#kWaktu",
   "#keluarHari",
   "#ketMinggu",
   "#kotorHari",
   "#kurangTarget",
   "#labelPulih",
   "#logHari",
   "#mKm",
   "#mOrder",
   "#mPerKm",
   "#mTarget",
   "#oApp",
   "#oChip",
   "#oGalat",
   "#oKm",
   "#oLayanan",
   "#oPotKet",
   "#oPratinjau",
   "#oTarif",
   "#oTip",
   "#oWaktu",
   "#perKmHari",
   "#perKmKet",
   "#perKmMinggu",
   "#persenTarget",
   "#petaPanas",
   "#rentangMinggu",
   "#rincianHari",
   "#rincianMinggu",
   "#tglHari",
   "#toast",
   "#yakinTeks",
   "#yakinYa",
   "[data-aksi]",
   "[data-avatar]",
   "[data-f]",
   "[data-hal]",
   "[data-logo]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "direktori-rumah-ibadah": {
  "judul": "Direktori Rumah Ibadah",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Daftar + peta OpenStreetMap, tanpa API key",
   "Filter 6 jenis (warna & ikon sejajar) + cari terdekat",
   "Member mengusulkan data, pengurus memoderasi + riwayat",
   "Jadikan website: halaman profil satu tempat (?tempat=id)",
   "Jadwal sholat 5 waktu dihitung lokal (Kemenag 20°/18°) + hitung mundur",
   "Pengumuman, kajian & kegiatan pekanan",
   "Laporan infak/kas + grafik 4 bulan, catat transaksi",
   "Rekening & QRIS donasi (placeholder), galeri SVG, kontak & peta",
   "Pengurus mengedit isi website langsung",
   "Ekspor/impor JSON & CSV, mode gelap, rapi di HP"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html di browser (butuh internet untuk peta)",
   "Buka index.html?tempat=thoriqussalam untuk contoh website masjid",
   "Masuk sebagai Pengurus Kota, PIN 1234, lalu klik Edit profil",
   "Ikuti PANDUAN.md untuk online gratis di GitHub Pages/Netlify"
  ],
  "aman": [
   "index.html",
   "profil.css",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "profil.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#antrean",
   "#avatar",
   "#cekFas",
   "#daftar",
   "#daftarMember",
   "#detail",
   "#detailIsi",
   "#fAlamat",
   "#fAlasan",
   "#fFoto",
   "#fImpor",
   "#fJam",
   "#fKegiatan",
   "#fKontak",
   "#fLat",
   "#fLng",
   "#fNama",
   "#filter",
   "#fontTema",
   "#formTempat",
   "#fotoPrev",
   "#i-arah",
   "#i-bagikan",
   "#i-cek",
   "#i-edit",
   "#i-foto",
   "#i-hati",
   "#i-jam",
   "#i-kiri",
   "#i-kosong",
   "#i-orang",
   "#i-perisai",
   "#i-pesan",
   "#i-pin",
   "#i-plus",
   "#i-riwayat",
   "#i-salin",
   "#i-surat",
   "#i-telp",
   "#i-unggah",
   "#i-web",
   "#i-x",
   "#inCari",
   "#isiModerasi",
   "#jdlAjukan",
   "#jumlah",
   "#mBatal",
   "#mIsi",
   "#mJudul",
   "#mOk",
   "#modal",
   "#namaAkun",
   "#perluAdmin",
   "#perluMasuk",
   "#petaGagal",
   "#petaKecil",
   "#pilihJenis",
   "#ruasAlasan",
   "#selubung",
   "#situs",
   "#situsEdit",
   "#situsSelubung",
   "#subAjukan",
   "#tAkun",
   "#tBatalForm",
   "#tContoh",
   "#tDekat",
   "#tEksCsv",
   "#tEksJson",
   "#tHapusFoto",
   "#tKosongkan",
   "#tLokasiSaya",
   "#toast",
   "[data-aksi]",
   "[data-antre]",
   "[data-antre-tab]",
   "[data-bagian]",
   "[data-galat]",
   "[data-h]",
   "[data-hal]",
   "[data-m]",
   "[data-tab]",
   "[data-tampil]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "helpdesk-tiket": {
  "judul": "Helpdesk Tiket IT",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Form tiket: pelapor, divisi, kategori, deskripsi, lampiran gambar",
   "Prioritas Rendah/Sedang/Tinggi/Kritis + level L1/L2/L3",
   "Target SLA per prioritas dengan hitung mundur & tanda lewat SLA",
   "Papan Kanban seret-lepas + daftar dengan cari & saring",
   "Utas percakapan, riwayat, penugasan & eskalasi teknisi",
   "Notifikasi WhatsApp wa.me saat dibuat/eskalasi/selesai + panduan gateway",
   "Notifikasi browser untuk tiket Kritis & lewat SLA",
   "Dasbor & laporan: terbuka, lewat SLA, rata-rata selesai, kinerja teknisi",
   "Ekspor CSV, backup & pulihkan JSON",
   "PIN lokal admin/teknisi, mode terang/gelap, rapi di HP"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html, masuk admin dengan PIN 1234",
   "Atur teknisi + No. WA, nomor koordinator, dan target SLA",
   "Kosongkan tiket contoh lalu bagikan link untuk lapor masalah",
   "Unduh backup JSON secara rutin"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aktivitas",
   "#app",
   "#avaSaya",
   "#backupJson",
   "#beban",
   "#bidangSiapa",
   "#cari",
   "#daftar",
   "#daftarTeknisi",
   "#dialog",
   "#dialogIsi",
   "#eksporCsv",
   "#fPrioritas",
   "#fSaya",
   "#fTeknisi",
   "#fileLampiran",
   "#fontTema",
   "#formPin",
   "#formTiket",
   "#gerbang",
   "#grafikHarian",
   "#grafikRingkas",
   "#hitungTerbuka",
   "#hpAdmin",
   "#inputPin",
   "#izinNotif",
   "#keluar",
   "#keluarHp",
   "#kosongkan",
   "#laci",
   "#laciIsi",
   "#laciLatar",
   "#lapor-tamu",
   "#laporanSub",
   "#lightbox",
   "#lightboxGambar",
   "#muatContoh",
   "#namaSaya",
   "#papan",
   "#perKategori",
   "#perPrioritas",
   "#perTeknisi",
   "#peranSaya",
   "#pilihLevel",
   "#pilihPrioritas",
   "#pilihTeknisi",
   "#pinAdmin",
   "#pinPesan",
   "#pinTeknisi",
   "#pratinjauLampiran",
   "#pulihkan",
   "#sapa",
   "#sapaSub",
   "#simpanPin",
   "#slaAtur",
   "#slaInfo",
   "#sorotan",
   "#statLaporan",
   "#statistik",
   "#statusNotif",
   "#tambahTeknisi",
   "#tiketSub",
   "#toast",
   "#tutupLightbox",
   "#zonaUnggah",
   "[data-bagian]",
   "[data-buka]",
   "[data-hal]",
   "[data-peran]",
   "[data-periode]",
   "[data-tampil]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "iuran-kas-rt": {
  "judul": "Iuran & Kas RT (ringkas, untuk bendahara)",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Tab bulan + pindah tahun, titik status tiap bulan",
   "Daftar KK per blok: ketuk untuk lunas, bisa diurungkan",
   "Saldo kas besar + cincin progres KK lunas",
   "Pesan WA pengingat per warga (bisa diedit)",
   "Rekap belum bayar untuk grup WA, sekali salin",
   "Catat pemasukan & pengeluaran kas",
   "Laporan bulanan siap salin, bagikan, atau cetak",
   "Ekspor CSV, backup & pulihkan JSON",
   "Mode gelap, animasi halus, rapi di HP"
  ],
  "cara": [
   "Buka index.html di browser HP atau laptop",
   "Klik ikon pengaturan: isi iuran, batas, cara bayar",
   "Kosongkan data contoh, tambah warga lewat + Warga",
   "Ketuk nama warga yang sudah bayar",
   "Salin rekap ke grup WA, rutin Backup JSON"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "data.js",
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#angkaLunas",
   "#angkaSaldo",
   "#bagiLap",
   "#berkasJson",
   "#btnAtur",
   "#btnMode",
   "#btnTambahWarga",
   "#bulanTab",
   "#cari",
   "#cetakLap",
   "#cincinIsi",
   "#eksCsv",
   "#eksJson",
   "#fontTema",
   "#formKas",
   "#galatKas",
   "#impJson",
   "#judulDaftar",
   "#judulSaldo",
   "#lapRingkas",
   "#listKas",
   "#listWarga",
   "#modal",
   "#modalIsi",
   "#modalJudul",
   "#nBelum",
   "#nLunas",
   "#nSemua",
   "#pesanGrup",
   "#pesanLap",
   "#saldoUbah",
   "#salinGrup",
   "#salinLap",
   "#stKeluar",
   "#stKurang",
   "#stTerkumpul",
   "#subBendahara",
   "#subDaftar",
   "#tahun",
   "#tahunMaju",
   "#tahunMundur",
   "#toast",
   "#waGrup",
   "[data-a]",
   "[data-bagian]",
   "[data-logo]",
   "[data-saring]",
   "[data-tab]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "kalender-kerja": {
  "judul": "Kalender Kerja Harian",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Garis waktu harian per jam + garis merah jam sekarang",
   "Blok berwarna per kategori: Kerja, Rapat, Pribadi, Istirahat",
   "Tampilan minggu, pindah hari dengan strip tanggal",
   "Seret untuk pindah jam/hari, tarik bawah untuk ubah lama",
   "Kartu Sekarang & Berikutnya dengan hitung mundur",
   "Pengingat notifikasi browser (service worker) + cadangan di layar",
   "Tugas berulang: harian, hari kerja, mingguan",
   "+ Google Calendar & unduh .ics per acara atau semua",
   "Ekspor CSV & backup/pulihkan JSON",
   "PWA offline, mode gelap, rapi di HP"
  ],
  "cara": [
   "Ekstrak folder lalu buka index.html",
   "Hapus jadwal contoh di Pengaturan & data",
   "Tambah jadwal, pilih jam, lama, kategori, ingatkan",
   "Klik Izinkan notifikasi agar diingatkan",
   "Unggah ke GitHub Pages agar bisa dipasang di HP"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#atur-akhir",
   "#atur-awal",
   "#btn-atur",
   "#btn-atur-hp",
   "#btn-hapus",
   "#btn-hapus-contoh",
   "#btn-hapus-semua",
   "#btn-hari-ini",
   "#btn-ics-satu",
   "#btn-ics-semua",
   "#btn-maju",
   "#btn-mode",
   "#btn-mode-hp",
   "#btn-mundur",
   "#btn-tambah",
   "#dlg-atur",
   "#dlg-judul",
   "#dlg-tugas",
   "#durasi-lain-wrap",
   "#ekspor-satu",
   "#fab",
   "#fokus",
   "#font-link",
   "#form-tugas",
   "#galat-judul",
   "#i-cek",
   "#i-lonceng",
   "#i-plus",
   "#i-ulang",
   "#impor-json",
   "#info-ulang",
   "#judul-hari",
   "#kanvas",
   "#legenda",
   "#legenda-2",
   "#link-gcal",
   "#notif-status",
   "#notif-status-2",
   "#pilih-kategori",
   "#strip",
   "#sub-hari",
   "#toasts",
   "[data-bagian]",
   "[data-ekspor]",
   "[data-tampil]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "kantor-ai-template": {
  "judul": "Kantor AI 3D + Paket 3 Agent",
  "kategori": "AI Agent",
  "fitur": [
   "Kantor 3D isometrik, ringan di HP (tanpa model 3D)",
   "Agen mengetik saat jam tugas, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan, meja berkedip mendesak",
   "Timelapse satu hari kerja dalam 30 detik",
   "Rekam jadi video reels 1080×1920 (npm run rekam)",
   "Laporan agen dibaca dari src/laporan.json",
   "Paket 3 agent terpisah: Riset, Penulis, Admin (Antigravity CLI gratis)"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173 (coba /?timelapse=1)",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts",
   "Unduh Paket 3 Agent, ekstrak ke folder template ini",
   "Jalankan agent lewat Antigravity CLI (agy); laporannya muncul di kantor"
  ],
  "jenis": "app",
  "pola": "kantor3d",
  "aman": [
   "src/styles.css",
   "markup & className di src/App.tsx"
  ],
  "kunci": [
   "src/office.ts",
   "src/config.ts",
   "src/OfficeScene.tsx",
   "src/gaya/*",
   "src/laporan.json (format)"
  ],
  "selector": [
   "semua state/prop/handler di App.tsx",
   ".ko-stage",
   ".ko-layer",
   "ref ke OfficeScene"
  ],
  "uji": [
   "npm install",
   "npm run build lolos",
   "npm test lulus",
   "npm run dev: kantor 3D tampil, ganti gaya jalan, panel tidak menutupi kantor"
  ]
 },
 "kas-warung": {
  "judul": "Kas Warung",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Catat uang masuk/keluar pakai numpad besar",
   "Tombol cepat +2rb, +5rb, +10rb, +50rb",
   "Untung hari ini besar: hijau untung, merah rugi",
   "Kas awal, kas akhir & tutup kas hitung laci",
   "Kasbon pelanggan: tambah utang & cicilan",
   "Laporan mingguan/bulanan + grafik untung-rugi",
   "Barang terlaris otomatis",
   "Ekspor CSV, salin ke Google Sheets, backup JSON",
   "Mode gelap, rapi di HP & laptop"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html di browser HP atau laptop",
   "Lihat data contoh, lalu Data › Hapus semua data",
   "Isi kas awal dan mulai catat penjualan",
   "Backup JSON rutin supaya data aman"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#angkaUntung",
   "#backup",
   "#barMasuk",
   "#btnCatat",
   "#chipBarang",
   "#daftarCatat",
   "#daftarUtang",
   "#dlBarang",
   "#dlg",
   "#dlgIsi",
   "#dlgJudul",
   "#dlgOk",
   "#eksCsv",
   "#fab",
   "#fontTema",
   "#grafik",
   "#hapusSemua",
   "#hariMaju",
   "#hariMundur",
   "#i-dompet",
   "#i-hapus",
   "#i-kosong",
   "#i-plus",
   "#i-utang",
   "#inBarang",
   "#inFavKeluar",
   "#inFavMasuk",
   "#inFoto",
   "#inLogo",
   "#jHari",
   "#jmlCatat",
   "#jmlUtang",
   "#kasAkhir",
   "#kasAwal",
   "#kasSelisih",
   "#labelTgl",
   "#lapKeluar",
   "#lapLabel",
   "#lapMaju",
   "#lapMasuk",
   "#lapMundur",
   "#lapRata",
   "#lapUntung",
   "#layarAngka",
   "#layarLabel",
   "#logoUsaha",
   "#panelCatat",
   "#pilihBarangFoto",
   "#pulih",
   "#salinSheets",
   "#sapa",
   "#selubung",
   "#simpanFav",
   "#statusUntung",
   "#tambahUtang",
   "#terlaris",
   "#toast",
   "#totKeluar",
   "#totMasuk",
   "#totUtang",
   "#tutupKas",
   "#tutupLembar",
   "#ubahKasAwal",
   "[data-bagian]",
   "[data-hal]",
   "[data-jenis]",
   "[data-n]",
   "[data-rentang]",
   "[data-saring]",
   "[data-tambah]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "kasir-fotocopy": {
  "judul": "Kasir Fotocopy & Percetakan",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Hitung cepat: halaman → lembar, warna/BW, A4/F4, bolak-balik",
   "Jilid (staples s/d hardcover) & laminasi per rangkap",
   "Tarif per lembar bisa diubah di menu Atur",
   "Jumlah lembar bisa diketik langsung di keranjang",
   "Rekap lembar hitam-putih vs warna di struk & laporan",
   "Jasa tanpa stok + barang ATK dengan stok",
   "Bayar tunai/QRIS/transfer, struk 58mm",
   "Laporan harian/bulanan, ekspor CSV, backup JSON",
   "Bisa di-install & jalan offline (PWA)"
  ],
  "cara": [
   "Unggah folder ke hosting HTTPS (GitHub Pages/Netlify)",
   "Buka di HP/laptop, lalu Install / Tambah ke layar utama",
   "Masuk sebagai Admin (PIN 1234) dan ganti PIN",
   "Atur tarif per lembar & jilid di menu Atur",
   "Klik Hitung cepat, isi jumlah halaman, lalu bayar"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aplikasi",
   "#avatarKasir",
   "#btnBackup",
   "#btnBayar",
   "#btnContoh",
   "#btnEksporProduk",
   "#btnEksporTrx",
   "#btnHitung",
   "#btnKategori",
   "#btnKeluar",
   "#btnKosongkan",
   "#btnReset",
   "#btnTambahProduk",
   "#cariKelola",
   "#cariProduk",
   "#chipKategori",
   "#daftarKasir",
   "#daftarKasirAtur",
   "#daftarTrx",
   "#dlg",
   "#dlgIsi",
   "#fabJumlah",
   "#fabKeranjang",
   "#fabTotal",
   "#fileBackup",
   "#fileCsv",
   "#filterTanggal",
   "#fontTema",
   "#formKasir",
   "#formTarif",
   "#formToko",
   "#grafik",
   "#gridProduk",
   "#inDiskon",
   "#judulGrafik",
   "#kDiskonBaris",
   "#kSubtotal",
   "#kTotal",
   "#kartuAngka",
   "#kerDaftar",
   "#kerJumlah",
   "#kerLembar",
   "#kerNomor",
   "#layarMasuk",
   "#masukIlus",
   "#masukToko",
   "#metodeRingkas",
   "#namaKasir",
   "#namaTokoNav",
   "#navBawah",
   "#padPin",
   "#panelKeranjang",
   "#pinTitik",
   "#rekapLembar",
   "#segLaporan",
   "#struk",
   "#tabelProduk",
   "#tarifIsi",
   "#terlaris",
   "#tglHariIni",
   "#tglLaporan",
   "#tipeDiskon",
   "#toast",
   "[data-h]",
   "[data-hal]",
   "[data-mode]",
   "[data-t]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "kasir-laundry": {
  "judul": "Kasir Laundry Offline + Dasbor Owner",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Kiloan (berat desimal), satuan, karpet per m²",
   "Paket Reguler/Kilat/Express dengan tambahan harga",
   "Order: pelanggan + WA, DP/lunas, parfum, pisah warna",
   "Papan status Diterima → Diambil, tombol maju & filter",
   "Struk 58mm + WA nota & WA siap ambil (wa.me)",
   "Laporan omzet, kg per hari, belum diambil, piutang",
   "Data pelanggan & riwayat order",
   "Sinkron Google Sheets opsional + antrian offline",
   "owner.html: dasbor owner dari luar kota",
   "PWA offline, multi-kasir PIN, backup JSON, CSV"
  ],
  "cara": [
   "Unggah folder ke hosting HTTPS (GitHub Pages/Netlify)",
   "Buka di HP kasir, lalu Install / Tambah ke layar utama",
   "Masuk Admin (PIN 1234), atur harga & ganti PIN",
   "Opsional: pasang apps-script/Code.gs sebagai Web App",
   "Isi URL Web App di menu Atur, owner buka owner.html"
  ],
  "aman": [
   "index.html",
   "owner.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aplikasi",
   "#avatarKasir",
   "#blnLaporan",
   "#btnBackup",
   "#btnContoh",
   "#btnEksporCSV",
   "#btnKeluar",
   "#btnKirimSekarang",
   "#btnKirimSemua",
   "#btnReset",
   "#btnTambahLayanan",
   "#cariOrder",
   "#cariPelanggan",
   "#chipSinkron",
   "#daftarKasir",
   "#daftarKasirAtur",
   "#daftarPelanggan",
   "#dlPelanggan",
   "#dlg",
   "#dlgIsi",
   "#fileBackup",
   "#filterStatus",
   "#fontTema",
   "#formHarga",
   "#formKasir",
   "#formOrder",
   "#formSinkron",
   "#formToko",
   "#grafikKg",
   "#grafikOmzet",
   "#itemOrder",
   "#kartuAngka",
   "#lapBelum",
   "#lapPiutang",
   "#layarMasuk",
   "#masukIlus",
   "#namaKasir",
   "#navBawah",
   "#noBerikut",
   "#padPin",
   "#papan",
   "#papanInfo",
   "#pilihLayanan",
   "#pinTitik",
   "#ringkasOrder",
   "#segPaket",
   "#selParfum",
   "#statusSinkron",
   "#struk",
   "#tabelLayanan",
   "#tabelPaket",
   "#toast",
   "[data-hal]",
   "[data-k]",
   "[data-ke]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "kasir-umkm": {
  "judul": "Kasir UMKM Offline",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Produk, kategori, stok & varian harga",
   "Keranjang, diskon Rp/% & kembalian otomatis",
   "Bayar tunai, QRIS, atau transfer",
   "Struk siap cetak printer thermal 58mm",
   "Riwayat transaksi + pembatalan kembalikan stok",
   "Laporan harian/bulanan & produk terlaris",
   "Ekspor/impor CSV dan backup JSON",
   "Multi-kasir dengan PIN lokal",
   "Bisa di-install & jalan offline (PWA)"
  ],
  "cara": [
   "Unggah folder ke hosting HTTPS (GitHub Pages/Netlify)",
   "Buka di HP/laptop, lalu Install / Tambah ke layar utama",
   "Masuk sebagai Admin (PIN 1234) dan ganti PIN",
   "Isi profil toko, ganti qris.svg dengan QRIS tokomu",
   "Tambah produk atau impor CSV, lalu mulai jualan"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aplikasi",
   "#avatarKasir",
   "#btnBackup",
   "#btnBayar",
   "#btnContoh",
   "#btnEksporProduk",
   "#btnEksporTrx",
   "#btnKategori",
   "#btnKeluar",
   "#btnKosongkan",
   "#btnReset",
   "#btnTambahProduk",
   "#cariKelola",
   "#cariProduk",
   "#chipKategori",
   "#daftarKasir",
   "#daftarKasirAtur",
   "#daftarTrx",
   "#dlg",
   "#dlgIsi",
   "#fabJumlah",
   "#fabKeranjang",
   "#fabTotal",
   "#fileBackup",
   "#fileCsv",
   "#filterTanggal",
   "#fontTema",
   "#formKasir",
   "#formToko",
   "#grafik",
   "#gridProduk",
   "#inDiskon",
   "#judulGrafik",
   "#kDiskonBaris",
   "#kSubtotal",
   "#kTotal",
   "#kartuAngka",
   "#kerDaftar",
   "#kerJumlah",
   "#kerNomor",
   "#layarMasuk",
   "#masukIlus",
   "#masukToko",
   "#metodeRingkas",
   "#namaKasir",
   "#namaTokoNav",
   "#navBawah",
   "#padPin",
   "#panelKeranjang",
   "#pinTitik",
   "#segLaporan",
   "#struk",
   "#tabelProduk",
   "#terlaris",
   "#tglHariIni",
   "#tglLaporan",
   "#tipeDiskon",
   "#toast",
   "[data-h]",
   "[data-hal]",
   "[data-mode]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "pos",
  "uji": [
   "Login PIN Admin",
   "Tambah 3 menu → total benar",
   "Bayar tunai/QRIS → struk muncul",
   "Tab Laporan terbuka",
   "Muat ulang → data tetap ada"
  ]
 },
 "katalog-toko-wa": {
  "judul": "Katalog Toko + Checkout WhatsApp",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Data produk cukup di satu berkas produk.js",
   "Opsional ambil produk dari Google Sheet",
   "Cari, filter kategori, urutkan harga",
   "Detail produk dengan galeri & varian",
   "Keranjang tersimpan walau halaman ditutup",
   "Ongkir per kota + batas gratis ongkir",
   "Pesan WhatsApp terformat rapi",
   "Mode gelap otomatis & manual",
   "Siap deploy GitHub Pages / Vercel"
  ],
  "cara": [
   "Ubah nama toko di tema.js; nomor WA & ongkir di produk.js",
   "Ganti daftar produk dan gambarnya",
   "Buka index.html untuk mencoba",
   "Unggah ke GitHub Pages atau Vercel"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "produk.js",
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#btnKeranjang",
   "#btnTema",
   "#btnWa",
   "#cari",
   "#dataPembeli",
   "#detail",
   "#detailIsi",
   "#fontTema",
   "#formPesan",
   "#grid",
   "#hitungKeranjang",
   "#jumlahHasil",
   "#jumlahProduk",
   "#kategori",
   "#laci",
   "#laciIsi",
   "#laciJumlah",
   "#namaToko",
   "#namaTokoKaki",
   "#pilihKota",
   "#ringkas",
   "#slogan",
   "#sorotan",
   "#tahun",
   "#tirai",
   "#toast",
   "#tutupLaci",
   "#urut",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "katalog",
  "uji": [
   "Cari \"kaos\" → 1 hasil",
   "Klik kategori → produk tersaring",
   "Buka detail, pilih varian, Tambah → badge 1",
   "Buka laci, pilih kota, Pesan → link wa.me berisi pesan",
   "Mode gelap jalan"
  ]
 },
 "keuangan-bendahara": {
  "judul": "Keuangan Pribadi & Bendahara",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Pilih mode di awal: Pribadi atau Bendahara",
   "Catat pemasukan/pengeluaran cepat dengan kategori + ikon",
   "Anggaran per kategori dengan cincin progres",
   "Saldo per dompet (tunai, bank, e-wallet) + pindah saldo",
   "Grafik 6 bulan, donat pengeluaran & target tabungan",
   "Buku kas umum bernomor, saldo awal, no. bukti BKM/BKK",
   "Laporan periode siap cetak/PDF + tanda tangan bendahara & ketua",
   "Rekap per pos, ekspor CSV untuk Excel/Sheets",
   "Cadangan JSON untuk pindah HP, mode gelap"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html di browser HP atau laptop",
   "Pilih mode Pribadi atau Bendahara",
   "Lihat data contoh, lalu Atur › Kosongkan data",
   "Baca PANDUAN.md bila bingung, backup JSON rutin"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#bawah",
   "#cetak",
   "#dlg",
   "#dlgForm",
   "#dlgHapus",
   "#dlgIsi",
   "#dlgJudul",
   "#dlgOk",
   "#fab",
   "#fontTema",
   "#gantiMode",
   "#hal",
   "#i-cari",
   "#i-cek",
   "#i-cetak",
   "#i-hapus",
   "#i-kanan",
   "#i-kiri",
   "#i-kosong",
   "#i-masjid",
   "#i-naik",
   "#i-orang",
   "#i-plus",
   "#i-titik",
   "#i-tukar",
   "#i-turun",
   "#i-unduh",
   "#i-unggah",
   "#labelMode",
   "#menu",
   "#pitaDemo",
   "#sambut",
   "#toast",
   "[data-bagian]",
   "[data-pilih]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "landing-kelas-virtual": {
  "judul": "Landing Kelas Virtual (Lynk)",
  "kategori": "Template Website",
  "fitur": [
   "Hero dengan harga coret, badge hemat & tombol beli",
   "Semua tombol beli ke satu link Lynk",
   "Kurikulum per modul (akordion) & FAQ",
   "Bonus dengan total nilai otomatis",
   "Profil mentor, testimoni contoh, jaminan",
   "Countdown promo opsional",
   "Tombol beli melayang di HP + tombol WhatsApp",
   "Semua isi di satu berkas konten.js",
   "Meta OG, favicon, animasi halus, mode gelap"
  ],
  "cara": [
   "Buka konten.js, isi link Lynk & nomor WA",
   "Ganti teks, harga, modul, bonus, FAQ",
   "Ganti testimoni contoh dengan yang asli",
   "Ubah title & meta OG di index.html",
   "Unggah ke GitHub Pages/Netlify, pasang di bio"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "konten.js",
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#bonusGrid",
   "#bonusTotal",
   "#cocok",
   "#faqDaftar",
   "#fontTema",
   "#hargaCoret",
   "#hargaJual",
   "#hemat",
   "#heroJudul",
   "#hitung",
   "#hitungAngka",
   "#melayangBeli",
   "#mentorPoin",
   "#modul",
   "#statistik",
   "#tahun",
   "#testiGrid",
   "#tidakCocok",
   "#tombolWa",
   "[data-bagian]",
   "[data-k]",
   "[data-tema-nama]"
  ],
  "jenis": "website",
  "pola": "website",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "manajemen-bengkel": {
  "judul": "Manajemen Bengkel Motor & Mobil",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Dashboard hari ini: antrean, pendapatan, servis selesai",
   "Papan antrean kanban seret-lepas + layar TV",
   "Work order: kendaraan, keluhan, jasa, sparepart, mekanik",
   "Stok sparepart, stok minimum & mutasi otomatis",
   "Nota A5 / thermal 58mm + kirim WhatsApp",
   "Riwayat per plat & pengingat servis via wa.me",
   "Laporan jasa vs sparepart & mekanik terproduktif",
   "Ekspor CSV & backup JSON",
   "PIN admin/kasir, mode gelap, responsif HP"
  ],
  "cara": [
   "Ekstrak folder lalu buka index.html di browser",
   "Masuk dengan PIN admin 1234 (kasir 1111)",
   "Isi alamat & WA bengkel di Pengaturan, ganti PIN",
   "Tambah sparepart & mekanik, lalu buat work order",
   "Buka index.html?tv di layar ruang tunggu"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aplikasi",
   "#btnKeluar",
   "#btnMenu",
   "#btnMode",
   "#btnTv",
   "#btnWoBaru",
   "#cetak",
   "#fontTema",
   "#infoPengguna",
   "#isi",
   "#judulHalaman",
   "#layarPin",
   "#modal",
   "#modalIsi",
   "#modalJudul",
   "#nav",
   "#pinGalat",
   "#pinGambar",
   "#pinPad",
   "#pinTanggal",
   "#pinTitik",
   "#samping",
   "#tabBawah",
   "#tanggalHari",
   "#tirai",
   "#toast",
   "#tv",
   "#tvJam",
   "#tvKaki",
   "#tvKolom",
   "#tvTutup",
   "[data-aksi]",
   "[data-bagian]",
   "[data-logo]",
   "[data-m]",
   "[data-mode]",
   "[data-t]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "dashboard",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "manajemen-gym": {
  "judul": "Manajemen Gym",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Data member: nama, WA, foto opsional, tanggal gabung, catatan",
   "Paket harian/bulanan/3 bulan/tahunan + personal trainer (sesi)",
   "Pembayaran & perpanjangan otomatis menyambung masa aktif",
   "Check-in cepat: cari nama/kode, Enter, atau scan kartu QR",
   "Kartu member ber-QR, bisa dicetak",
   "Daftar jatuh tempo (≤7 hari & lewat) + pengingat wa.me siap kirim",
   "Laporan: member aktif, check-in per hari, jam ramai, pendapatan per bulan",
   "Multi-admin PIN (pemilik & staf)",
   "Backup/pulihkan JSON, ekspor CSV member/pembayaran/check-in",
   "Bisa di-install & jalan offline (PWA)"
  ],
  "cara": [
   "Unggah folder ke hosting HTTPS (GitHub Pages/Netlify)",
   "Buka di HP/laptop, lalu Install / Tambah ke layar utama",
   "Masuk sebagai Pemilik (PIN 1234) dan ganti PIN di menu Atur",
   "Atur nama gym, harga paket, dan templat pesan WA",
   "Tambah member, lalu check-in lewat nama/kode/QR"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aplikasi",
   "#btnCek",
   "#btnKeluar",
   "#cariCek",
   "#cariMember",
   "#daftarAdmin",
   "#daftarAdminAtur",
   "#daftarCekHari",
   "#daftarPaket",
   "#dlg",
   "#dlgIsi",
   "#fileImpor",
   "#filterMember",
   "#fontTema",
   "#formGym",
   "#grafikBulan",
   "#grafikHari",
   "#grafikJam",
   "#gridMember",
   "#hasilCek",
   "#infoMember",
   "#inisial",
   "#jmlCekHari",
   "#jmlLewat",
   "#jmlSegera",
   "#layarMasuk",
   "#lencanaTempo",
   "#lencanaTempo2",
   "#namaAdmin",
   "#padPin",
   "#pinTitik",
   "#pitaDemo",
   "#statBeranda",
   "#statLaporan",
   "#tabelBayar",
   "#tempoLewat",
   "#tempoMini",
   "#tempoSegera",
   "#tglHariIni",
   "#toast",
   "[data-aksi]",
   "[data-hal]",
   "[data-ke]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "manajemen-klien": {
  "judul": "Manajemen Klien — CRM Freelancer & Agensi",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Dashboard pendapatan, tagihan, proyek & follow-up",
   "Profil klien + timeline interaksi",
   "Pipeline kanban seret-lepas & keyboard",
   "Proyek dengan progres & checklist tugas",
   "Invoice & penawaran: PPN, diskon, DP, nomor otomatis",
   "Cetak A4/PDF, kirim WhatsApp & email",
   "Kalender pengingat follow-up",
   "Laporan grafik per bulan & per klien",
   "Pencarian Ctrl/⌘+K, CSV & backup JSON",
   "PIN lokal, mode gelap, responsif HP"
  ],
  "cara": [
   "Ekstrak folder lalu buka index.html",
   "Masuk dengan PIN 1234",
   "Isi Pengaturan: alamat, rekening, ganti PIN",
   "Ubah nama & warna di tema.js / tema.css",
   "Unggah ke GitHub Pages/Netlify bila ingin online"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#app",
   "#badge-fu",
   "#btn-cari",
   "#btn-kunci",
   "#btn-menu",
   "#btn-mode",
   "#btn-tambah",
   "#cetak",
   "#font-link",
   "#kunci",
   "#menu-tambah",
   "#modal",
   "#modal-isi",
   "#modal-judul",
   "#palet",
   "#palet-hasil",
   "#palet-input",
   "#pin-pesan",
   "#samping",
   "#tirai",
   "#toasts",
   "#utama",
   "[data-bagian]",
   "[data-baru]",
   "[data-nav]",
   "[data-p]",
   "[data-pin]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "dashboard",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "mesin-3d-interaktif": {
  "judul": "Mesin 4-Tak 3D Interaktif",
  "kategori": "Template Website",
  "fitur": [
   "Piston, batang piston, poros engkol, katup, busi dari primitif",
   "Kinematika engkol–piston sungguhan",
   "Siklus 720° dengan warna per langkah",
   "Katup buka-tutup & busi berkedip",
   "Slider RPM, Jeda, Langkah +45°",
   "Mode transparan & potongan",
   "Label bagian mengikuti model",
   "Putar & zoom, responsif HP"
  ],
  "cara": [
   "Unggah ke GitHub Pages/Netlify (atau python3 -m http.server)",
   "Buka di browser yang mendukung WebGL",
   "Seret untuk memutar, atur RPM",
   "Pakai Jeda + Langkah + saat menjelaskan"
  ],
  "aman": [
   "index.html",
   "style.css"
  ],
  "data": [],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#kanvas",
   "#label",
   "#langkah",
   "#sudut",
   "[data-l]"
  ],
  "jenis": "website",
  "pola": "website",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "monitor-subdomain": {
  "judul": "Monitor Subdomain (Status Page)",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Daftar situs cukup di sites.json",
   "Cek otomatis tiap ±10 menit lewat GitHub Actions",
   "Catat status, kode HTTP, latensi",
   "Riwayat 90 hari + uptime %",
   "Bar harian hijau/kuning/merah",
   "Grafik latensi 24 jam (SVG)",
   "Tanpa server & dependensi, gratis di repo publik",
   "Jujur: bukan real-time, tidak bisa cek dari browser (CORS)"
  ],
  "cara": [
   "Buat repo GitHub publik, unggah isi folder",
   "Isi sites.json dengan URL subdomainmu",
   "Settings › Actions: izinkan Read and write",
   "Jalankan workflow 'Cek status situs' sekali",
   "Aktifkan GitHub Pages dari branch main"
  ],
  "aman": [
   "index.html"
  ],
  "data": [],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#daftar",
   "#diperbarui",
   "#ringkas"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "perpustakaan-digital": {
  "judul": "Perpustakaan Digital Rumah Sakit",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Katalog buku & jurnal: ISBN, kategori, rak, eksemplar, tautan PDF",
   "Cari & filter: kategori, jenis, tersedia, ada e-book",
   "Impor CSV (ada contoh) & ekspor CSV",
   "Anggota staf: nama, unit, NIP",
   "Pinjam/kembali dengan jatuh tempo, perpanjang, riwayat",
   "Denda keterlambatan opsional (bisa dimatikan)",
   "Label buku dengan barcode Code 39",
   "Laporan: terpopuler, aktif, terlambat, per kategori",
   "Katalog publik read-only dari katalog.json",
   "PIN admin, backup JSON, jalan offline (PWA)"
  ],
  "cara": [
   "Unggah folder ke hosting HTTPS (GitHub Pages/Netlify)",
   "Buka di laptop/HP, lalu Install / Tambah ke layar utama",
   "Masuk dengan PIN 1234 dan ganti PIN di menu Atur",
   "Impor katalog dari CSV atau tambah koleksi satu per satu",
   "Unduh katalog.json di Atur, unggah agar katalog.html terisi"
  ],
  "aman": [
   "index.html",
   "katalog.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "data-contoh.js",
   "katalog.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#aplikasi",
   "#areaCetak",
   "#aturDenda",
   "#aturDendaHari",
   "#aturLama",
   "#aturMaks",
   "#aturNama",
   "#berkas",
   "#berkasCSV",
   "#berkasJSON",
   "#btnBackup",
   "#btnCetakLaporan",
   "#btnEkspor",
   "#btnEksporPinjam",
   "#btnHapusSemua",
   "#btnImpor",
   "#btnKatalogPublik",
   "#btnKunci",
   "#btnPulihkan",
   "#btnTambahAnggota",
   "#btnTambahBuku",
   "#cari",
   "#cariAnggota",
   "#cariBuku",
   "#cariPinjam",
   "#chipKategori",
   "#daftar",
   "#daftarAktivitas",
   "#daftarAnggota",
   "#daftarBuku",
   "#daftarPinjam",
   "#daftarPopuler",
   "#daftarTagih",
   "#dlAnggota",
   "#dlBuku",
   "#dlg",
   "#dlgIsi",
   "#fontTema",
   "#formAtur",
   "#formPin",
   "#formPinjam",
   "#grafikKategori",
   "#info",
   "#infoKatalog",
   "#infoPinjam",
   "#jmlAktif",
   "#jmlTelat",
   "#kategori",
   "#layarPin",
   "#medanDenda",
   "#padPin",
   "#periodeLaporan",
   "#pilihBerkas",
   "#pinBaru",
   "#pinTitik",
   "#pinjamAnggota",
   "#pinjamBuku",
   "#pinjamTempo",
   "#pinjamTgl",
   "#saringJenis",
   "#saringKategori",
   "#saringStatus",
   "#statBeranda",
   "#statLaporan",
   "#status",
   "#tabelTelat",
   "#tglHariIni",
   "#toast",
   "[data-bagian]",
   "[data-hal]",
   "[data-k]",
   "[data-ke]",
   "[data-tab]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "pesan-antar-kedai": {
  "judul": "Pesan Antar Kedai",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Tiga sudut dalam satu app: Pembeli, Kedai, Kurir",
   "Menu bergambar, stok, keranjang & cari kategori",
   "Alamat + pin peta Leaflet/OSM, jarak & saran ongkir otomatis",
   "Tawar ongkir lewat chat: tombol cepat setuju / tawar balik",
   "Status pesanan bertahap & pelacakan kurir di peta",
   "Kedai: terima/tolak, tugaskan kurir, kelola menu & stok",
   "Kurir: daftar antaran, rute Google Maps, terima COD + kembalian",
   "Laporan omzet 7 hari, menu terlaris, setoran COD kurir",
   "Ringkasan pesanan ke WhatsApp (wa.me) sebagai cadangan",
   "Sinkron antartab untuk demo, panduan Supabase/Firebase"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak foldernya",
   "Buka index.html di browser (perlu internet untuk peta)",
   "Pilih sudut Pembeli, Kedai, atau Kurir di atas",
   "Buka sudut lain di tab baru untuk mencoba alurnya",
   "Atur nomor WA, tarif ongkir & kurir di Kedai › Atur",
   "Untuk banyak HP sekaligus, ikuti panduan Supabase di README"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#dlg",
   "#dlgForm",
   "#dlgIsi",
   "#dlgJudul",
   "#dlgKaki",
   "#fontTema",
   "#hal",
   "#sub",
   "#toast",
   "#tombolMode",
   "[data-aksi]",
   "[data-bagian]",
   "[data-peran]",
   "[data-tema-nama]",
   "[data-tutup]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "portofolio-pribadi": {
  "judul": "Portofolio Pribadi",
  "kategori": "Template Website",
  "fitur": [
   "Hero sapaan dengan judul muncul per kata, potret bingkai kertas, benda 3D melayang",
   "Marquee logo tempat kerja/klien",
   "Kata menyala saat digulir, kartu muncul bertahap, efek kursor",
   "Karya pilihan, angka bersumber, cara kerja 3 langkah, rak semua karya",
   "Halaman detail karya (karya.html?id=...) dengan statistik & peran",
   "Semua isi dan slot gambar dari satu berkas data.js",
   "Mode terang/gelap, responsif HP–desktop, reduced-motion",
   "Panduan online gratis GitHub Pages/Netlify"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak",
   "Buka index.html di browser",
   "Ganti isi di data.js dan gambar di img/ (logo, foto profil, logo klien, sampul karya)",
   "Ikuti PANDUAN.md untuk online gratis"
  ],
  "aman": [
   "index.html",
   "karya.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "data.js",
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#akhir",
   "#fontTema",
   "#gantiMode",
   "#logo",
   "#main",
   "[data-bagian]",
   "[data-tema-nama]"
  ],
  "jenis": "website",
  "pola": "website",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "presensi-gps-gas": {
  "judul": "Presensi GPS + Selfie (Google Apps Script)",
  "kategori": "Google Apps Script",
  "fitur": [
   "Absen masuk & pulang dari HP",
   "Validasi radius kantor (haversine) di server",
   "Selfie dari kamera, disimpan ke Google Drive",
   "Cegah absen ganda di hari yang sama",
   "Status tepat waktu, telat (menit), pulang cepat",
   "Peta lokasi tanpa API key (Leaflet + OSM)",
   "Halaman admin: rekap harian & bulanan",
   "Ekspor CSV dan cetak rekap",
   "Setup sheet otomatis sekali klik"
  ],
  "cara": [
   "Buat Google Sheet baru, buka Ekstensi → Apps Script",
   "Tempel Code.gs, index.html, admin.html",
   "Jalankan fungsi setup() dan beri izin",
   "Isi sheet Pengaturan (titik kantor, jam) & Karyawan",
   "Deploy → Web app → akses: Siapa saja, bagikan link"
  ],
  "jenis": "app",
  "pola": "dashboard",
  "aman": [
   "bagian <style> di index.html, admin.html",
   "teks tampilan"
  ],
  "kunci": [
   "Code.gs",
   "pemanggilan google.script.run",
   "nama field formulir"
  ],
  "selector": [],
  "uji": [
   "deploy ulang Apps Script",
   "presensi masuk/keluar tersimpan di Sheet",
   "admin bisa melihat rekap"
  ]
 },
 "template-agrowisata": {
  "judul": "Template Agrowisata & Komunitas Tani",
  "kategori": "Template Website",
  "fitur": [
   "Gaya agri bento modern",
   "Dua bahasa EN/ID satu klik",
   "Hero kapsul dengan chip angka",
   "Akordion program ganti gambar",
   "Linimasa perjalanan geser",
   "Bagian SDGs & ESG",
   "Galeri + pita mitra berjalan",
   "Ilustrasi SVG buatan sendiri",
   "Aman tanpa JS & reduced-motion"
  ],
  "cara": [
   "Unduh/clone folder ini",
   "Ganti teks di index.html (EN) dan objek ID di app.js",
   "Ganti warna di style.css (:root)",
   "Ganti img/*.svg dengan foto Anda (nama sama)",
   "Buka index.html lalu unggah ke hosting statis"
  ],
  "aman": [
   "index.html",
   "style.css"
  ],
  "data": [],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#laci",
   "#nav",
   "#p-foto",
   "#rel",
   "[data-count]",
   "[data-dec]",
   "[data-i18n]",
   "[data-img]",
   "[data-lang]"
  ],
  "jenis": "website",
  "pola": "landing",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "template-carousel-quotes": {
  "judul": "Template Carousel Quotes Instagram",
  "kategori": "Template Website",
  "fitur": [
   "3 gaya tetap: Editorial serif krem, Bold Neon gelap, Teduh geometris",
   "Slide sampul, slide isi (kutipan + sumber), dan penutup CTA",
   "Tambah, hapus, dan urutkan slide isi",
   "Nama, handle, dan foto/logo opsional",
   "Pratinjau 1080×1350 langsung saat mengetik",
   "Unduh PNG per slide atau semua sekaligus (.zip)",
   "Draft tersimpan otomatis di browser",
   "Impor/ekspor konten JSON, bisa diisi AI lewat skill"
  ],
  "cara": [
   "Buka index.html di browser (perlu internet untuk font)",
   "Pilih gaya, isi judul seri, nama, dan handle",
   "Tulis kutipan di slide isi, atur urutannya",
   "Klik Unduh semua (.zip) lalu unggah ke Instagram"
  ],
  "aman": [
   "index.html",
   "style.css"
  ],
  "data": [],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#fontLink",
   "[data-gaya]"
  ],
  "jenis": "website",
  "pola": "website",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "template-kolase-vox": {
  "judul": "Template Video Kolase Gaya Vox (Gedung Sate)",
  "kategori": "Template Video",
  "fitur": [
   "Format reels 1080x1920 30fps, ±56 detik",
   "9 adegan kolase siap pakai",
   "Judul serif raksasa di belakang objek",
   "Objek bertepi kertas putih + halftone",
   "Grafik 15 fps & latar kertas 'mendidih'",
   "Anotasi tangan: panah, lingkaran, stabilo, label",
   "2.5D parallax & angka menghitung",
   "Semua prompt Gemini (PROMPT.md) + alat potong latar"
  ],
  "cara": [
   "Install Node.js 18+",
   "Jalankan npm install",
   "Pratinjau dengan npm run studio",
   "Ganti gambar & adegan (lihat README)",
   "Render dengan npm run render"
  ],
  "jenis": "reels",
  "pola": "reels",
  "aman": [
   "komponen tampilan adegan (src/*)",
   "warna & font"
  ],
  "kunci": [
   "daftar adegan & durasi",
   "id komposisi",
   "aset gambar milik pengguna"
  ],
  "selector": [
   "id komposisi 1080×1920 30 fps",
   "urutan & durasi 9 adegan",
   "teks penting di x 100–980"
  ],
  "uji": [
   "npm install",
   "npm run studio tampil",
   "render still tiap adegan tanpa error"
  ]
 },
 "template-montessori-anak": {
  "judul": "Template Preschool Montessori",
  "kategori": "Template Website",
  "fitur": [
   "5 halaman: beranda, program, tentang, galeri, daftar",
   "Dua bahasa ID/EN",
   "Data konten & kontak di src/scripts/data.js",
   "Kuis pencari program",
   "Jadwal mingguan interaktif",
   "Form daftar 4 langkah ke WhatsApp",
   "Galeri dengan lightbox",
   "Smooth scroll Lenis + animasi GSAP",
   "Transisi halaman Astro"
  ],
  "cara": [
   "Pasang Node.js 18+",
   "npm install",
   "npm run dev lalu buka localhost:4321",
   "Ganti data di src/scripts/data.js",
   "npm run build, unggah folder dist/"
  ],
  "jenis": "website",
  "pola": "sekolah",
  "aman": [
   "src/styles/*",
   "src/components/* (markup & kelas)",
   "src/pages/index.astro (tampilan)"
  ],
  "kunci": [
   "astro.config.mjs",
   "data/konten di src (isi)",
   "package.json"
  ],
  "selector": [
   "struktur halaman Astro & props komponen",
   "tautan dan id anchor menu"
  ],
  "uji": [
   "npm install",
   "npm run build lolos",
   "npm run dev: semua bagian tampil, HP 375 px tanpa scroll samping"
  ]
 },
 "template-sekolah-yayasan": {
  "judul": "Template Sekolah & Yayasan Qur'ani",
  "kategori": "Template Website",
  "fitur": [
   "Hero kubah beranimasi GSAP",
   "Semua brand & kontak di config.js",
   "Jadwal salat otomatis sesuai kota",
   "Angka statistik berhitung saat digulir",
   "Kartu program bingkai mihrab",
   "Linimasa kisah lembaga",
   "Tombol WhatsApp PPDB",
   "Responsif + menu HP",
   "Ilustrasi SVG tanpa foto"
  ],
  "cara": [
   "Unduh/clone folder ini",
   "Buka config.js, ganti nama, kontak, kota, angka",
   "Ganti warna di style.css (:root)",
   "Buka index.html di browser",
   "Unggah ke GitHub Pages/Netlify/Vercel"
  ],
  "aman": [
   "index.html",
   "style.css"
  ],
  "data": [
   "config.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#guru",
   "#menu",
   "[data-cfg]",
   "[data-cfg-href]",
   "[data-cfg-ig]",
   "[data-count]",
   "[data-count-cfg]",
   "[data-foto]",
   "[data-galeri]",
   "[data-guru]",
   "[data-logo]",
   "[data-next-in]",
   "[data-next-name]",
   "[data-pray-date]",
   "[data-times]"
  ],
  "jenis": "website",
  "pola": "sekolah",
  "uji": [
   "Buka file: jadwal salat terisi",
   "Gulir → angka berhitung (tanpa NaN)",
   "Menu HP buka-tutup",
   "HP 375 px tanpa scroll samping, Console bersih"
  ]
 },
 "template-video-tutor-remotion": {
  "judul": "Template Video Tutor Reels (Remotion)",
  "kategori": "Template Video",
  "fitur": [
   "Format reels 1080x1920 30fps",
   "7 adegan siap pakai",
   "Latar grid gelap/terang bergantian",
   "Header meta monospace",
   "Kartu langkah dengan penanda progres",
   "Blok prompt efek mengetik",
   "Semua teks di src/konten.ts",
   "Slot musik opsional"
  ],
  "cara": [
   "Install Node.js 18+",
   "Jalankan npm install",
   "Ubah teks di src/konten.ts",
   "Pratinjau dengan npm run studio",
   "Render dengan npm run render"
  ],
  "jenis": "reels",
  "pola": "reels",
  "aman": [
   "src/gaya.tsx",
   "src/adegan/*.tsx",
   "src/Video.tsx (tampilan saja)"
  ],
  "kunci": [
   "src/konten.ts (isi & nama field)",
   "remotion.config.ts"
  ],
  "selector": [
   "id komposisi TutorReels 1080×1920 30 fps",
   "ekspor Video & durasiTotal",
   "semua field konten.ts",
   "komponen Gambar dengan cadangan",
   "teks penting di x 100–980"
  ],
  "uji": [
   "npm install",
   "npm run cek lolos",
   "npm run still lolos untuk tiap adegan",
   "teks konten.ts tidak berubah"
  ]
 },
 "translate-suara": {
  "judul": "Terjemah Suara Dua Arah",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Dua tombol mik: Indonesia (id-ID) & English (en-US)",
   "Gelembung percakapan dua arah",
   "Hasil dibacakan otomatis (speechSynthesis)",
   "Penyedia: API kompatibel OpenAI atau Gemini (kunci sendiri)",
   "Mode gratis: salin ke Google Translate",
   "Ketik manual bila mik tidak tersedia",
   "Bisa di-install (PWA), mode gelap otomatis",
   "Banner jujur soal dukungan browser & API"
  ],
  "cara": [
   "Unggah ke hosting HTTPS (GitHub Pages/Netlify)",
   "Buka di Chrome dan izinkan mikrofon",
   "Klik ⚙ lalu pilih penyedia & isi kunci API",
   "Tekan tombol bahasa pembicara, lalu bicara"
  ],
  "aman": [
   "index.html",
   "style.css"
  ],
  "data": [],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#arahManual",
   "#btnAtur",
   "#dlgAtur",
   "#formAtur",
   "#formKetik",
   "#grupGemini",
   "#grupOpenai",
   "#kosong",
   "#labelPenyedia",
   "#log",
   "#peringatan",
   "#teksManual",
   "#toast",
   "[data-bahasa]"
  ],
  "jenis": "app",
  "pola": "app",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 },
 "website-rt": {
  "judul": "Website RT/RW: Warga, Iuran, Kas & Surat",
  "kategori": "Aplikasi Web",
  "fitur": [
   "Halaman publik: pengumuman, agenda, kontak pengurus",
   "Panel pengurus berkunci PIN (contoh 1234)",
   "Data warga & KK: cari, status tetap/kontrak, jumlah jiwa",
   "Iuran per KK: tandai lunas, tunggakan, rekap bulanan",
   "Pengingat iuran via WhatsApp berformat rapi",
   "Kas RT: pemasukan, pengeluaran, saldo, grafik SVG",
   "Surat pengantar A4 dengan kop & nomor otomatis",
   "Ekspor/impor CSV + cadangan JSON",
   "Mode gelap, warna & huruf bisa diatur, animasi halus",
   "Jalan offline (PWA), responsif HP dengan nav bawah"
  ],
  "cara": [
   "Buka index.html di browser",
   "Klik Pengurus, masukkan PIN 1234",
   "Ubah identitas RT & PIN di Pengaturan",
   "Kosongkan data contoh, lalu isi data warga",
   "Unggah ke GitHub Pages/Netlify agar bisa dipakai di HP"
  ],
  "aman": [
   "index.html",
   "style.css",
   "tema.css"
  ],
  "data": [
   "data.js",
   "tema.js"
  ],
  "kunci": [
   "app.js",
   "format data & kunci localStorage"
  ],
  "selector": [
   "#btnAtur",
   "#btnMode",
   "#btnPanel",
   "#cetak",
   "#fontTema",
   "#isi",
   "#merekSub",
   "#modal",
   "#modalIsi",
   "#navBawah",
   "#navSamping",
   "#toast",
   "[data-bagian]",
   "[data-tema-nama]"
  ],
  "jenis": "app",
  "pola": "dashboard",
  "uji": [
   "Buka index.html: tampil tanpa error di Console",
   "Semua fitur di daftar fitur dicoba satu per satu",
   "HP 375 px tanpa scroll samping"
  ]
 }
};
