window.KODE = [
 {
  "slug": "kasir-umkm",
  "judul": "Kasir UMKM Offline",
  "ringkas": "Aplikasi kasir PWA untuk warung & kafe: stok, varian harga, diskon, QRIS, struk 58mm, laporan. Jalan tanpa internet.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "PWA",
   "Service Worker",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html?demo",
  "gambar": "img/kasir-umkm.png",
  "repo": "https://github.com/malikisaputra-source/kasir-umkm",
  "zip": "https://github.com/malikisaputra-source/kasir-umkm/archive/refs/heads/main.zip"
 },
 {
  "slug": "katalog-toko-wa",
  "judul": "Katalog Toko + Checkout WhatsApp",
  "ringkas": "Katalog toko online statis: cari, filter, varian, keranjang, ongkir per kota, pesanan rapi langsung ke WhatsApp.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "WhatsApp wa.me",
   "Google Sheets CSV (opsional)"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
   "Ubah nama toko, nomor WA, ongkir di produk.js",
   "Ganti daftar produk dan gambarnya",
   "Buka index.html untuk mencoba",
   "Unggah ke GitHub Pages atau Vercel"
  ],
  "demo": "index.html",
  "gambar": "img/katalog-toko-wa.png",
  "repo": "https://github.com/malikisaputra-source/katalog-toko-wa",
  "zip": "https://github.com/malikisaputra-source/katalog-toko-wa/archive/refs/heads/main.zip"
 },
 {
  "slug": "presensi-gps-gas",
  "judul": "Presensi GPS + Selfie (Google Apps Script)",
  "ringkas": "Absensi karyawan pakai GPS geofence dan selfie. Data masuk Google Sheets, foto ke Drive. Gratis tanpa server.",
  "teknologi": [
   "Google Apps Script",
   "Google Sheets",
   "Google Drive",
   "HTML",
   "JavaScript",
   "Leaflet"
  ],
  "kategori": "Google Apps Script",
  "tier": "gratis",
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
  "demo": "demo.html",
  "gambar": "img/presensi-gps-gas.png",
  "repo": "https://github.com/malikisaputra-source/presensi-gps-gas",
  "zip": "https://github.com/malikisaputra-source/presensi-gps-gas/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-agrowisata",
  "judul": "Template Agrowisata & Komunitas Tani",
  "ringkas": "Template website premium untuk agrowisata, kebun, dan komunitas tani: gaya bento, dua bahasa EN/ID, akordion program, animasi GSAP.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "GSAP"
  ],
  "kategori": "Template Website",
  "tier": "premium",
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
  "demo": "index.html",
  "gambar": "img/template-agrowisata.png",
  "repo": "https://github.com/malikisaputra-source/template-agrowisata",
  "zip": "https://github.com/malikisaputra-source/template-agrowisata/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-montessori-anak",
  "judul": "Template Preschool Montessori",
  "ringkas": "Template website premium Astro untuk preschool/daycare Montessori: 5 halaman, dua bahasa, kuis program, form daftar ke WhatsApp.",
  "teknologi": [
   "Astro 5",
   "GSAP",
   "Lenis",
   "JavaScript",
   "CSS"
  ],
  "kategori": "Template Website",
  "tier": "premium",
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
  "demo": null,
  "gambar": "img/template-montessori-anak.png",
  "repo": "https://github.com/malikisaputra-source/template-montessori-anak",
  "zip": "https://github.com/malikisaputra-source/template-montessori-anak/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-sekolah-yayasan",
  "judul": "Template Sekolah & Yayasan Qur'ani",
  "ringkas": "Template website premium untuk yayasan, TK Qur'an, madrasah, dan SD Islam: kubah animasi GSAP, jadwal salat otomatis, satu config.js.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "GSAP"
  ],
  "kategori": "Template Website",
  "tier": "premium",
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
  "demo": "index.html",
  "gambar": "img/template-sekolah-yayasan.png",
  "repo": "https://github.com/malikisaputra-source/template-sekolah-yayasan",
  "zip": "https://github.com/malikisaputra-source/template-sekolah-yayasan/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-video-tutor-remotion",
  "judul": "Template Video Tutor Reels (Remotion)",
  "ringkas": "Template video tutorial 9:16 berbasis kode: hook, 3 langkah, prompt diketik, hasil, dan ajakan. Ganti teks di satu berkas.",
  "teknologi": [
   "Remotion 4",
   "React 19",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
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
  "demo": null,
  "gambar": "img/template-video-tutor-remotion.png",
  "repo": "https://github.com/malikisaputra-source/template-video-tutor-remotion",
  "zip": "https://github.com/malikisaputra-source/template-video-tutor-remotion/archive/refs/heads/main.zip"
 }
];
