window.PRD_PROFIL = {
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
