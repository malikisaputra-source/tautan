window.KODE = [
 {
  "slug": "absensi-karyawan",
  "judul": "Absensi Karyawan",
  "ringkas": "Absensi UMKM & kantor kecil: check-in tombol besar, lokasi & selfie opsional, shift, izin, kalender warna, rekap gaji, mode kiosk.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage",
   "IndexedDB",
   "PWA"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-12-17",
  "gambar": "img/absensi-karyawan.webp",
  "repo": "https://github.com/malikisaputra-source/absensi-karyawan",
  "zip": "https://github.com/malikisaputra-source/absensi-karyawan/archive/refs/heads/main.zip"
 },
 {
  "slug": "absensi-kelas-guru",
  "judul": "Absensi Kelas Guru",
  "ringkas": "Absen siswa satu ketukan per anak (H/S/I/A), banyak kelas & mapel, rekap bulanan, ekspor Excel, cetak A4. Offline di HP guru.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "PWA",
   "Service Worker",
   "localStorage",
   "SheetJS"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "req": [
   "bang_yos15"
  ],
  "kunci": "2027-01-04",
  "gambar": "img/absensi-kelas-guru.webp",
  "repo": "https://github.com/malikisaputra-source/absensi-kelas-guru",
  "zip": "https://github.com/malikisaputra-source/absensi-kelas-guru/archive/refs/heads/main.zip"
 },
 {
  "slug": "belanja-keluarga",
  "judul": "Anggaran Belanja Keluarga",
  "ringkas": "Atur uang bulanan keluarga pakai amplop per kategori, catat belanja cepat, peringatan amplop hampir habis, dan target tabungan.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-11-23",
  "gambar": "img/belanja-keluarga.webp",
  "repo": "https://github.com/malikisaputra-source/belanja-keluarga",
  "zip": "https://github.com/malikisaputra-source/belanja-keluarga/archive/refs/heads/main.zip"
 },
 {
  "slug": "bengkel-las-hpp",
  "judul": "Bengkel Las + Hitung HPP",
  "ringkas": "Aplikasi bengkel las tanpa server: order pagar/kanopi/teralis, kalkulator bahan & sisa potong, HPP otomatis, RAB siap cetak, laporan laba.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
  "req": [
   "fahwiproject"
  ],
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "kunci": "2026-11-26",
  "gambar": "img/bengkel-las-hpp.webp",
  "repo": "https://github.com/malikisaputra-source/bengkel-las-hpp",
  "zip": "https://github.com/malikisaputra-source/bengkel-las-hpp/archive/refs/heads/main.zip"
 },
 {
  "slug": "catatan-ojol",
  "judul": "Catatan Ojol",
  "ringkas": "Catat order Gojek/Grab/Maxim & pengeluaran, lihat untung bersih harian, mingguan, per km, dan jam paling cuan. Jalan di HP.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "kunci": "2026-11-30",
  "gambar": "img/catatan-ojol.webp",
  "repo": "https://github.com/malikisaputra-source/catatan-ojol",
  "zip": "https://github.com/malikisaputra-source/catatan-ojol/archive/refs/heads/main.zip"
 },
 {
  "slug": "direktori-rumah-ibadah",
  "judul": "Direktori Rumah Ibadah",
  "ringkas": "Direktori rumah ibadah semua umat + halaman website per tempat: jadwal sholat & hitung mundur, kegiatan, kas infak, donasi.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "Leaflet",
   "OpenStreetMap",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "req": [
   "tsyamha90",
   "taniaflorist7"
  ],
  "kunci": "2026-11-19",
  "gambar": "img/direktori-rumah-ibadah.webp",
  "repo": "https://github.com/malikisaputra-source/direktori-rumah-ibadah",
  "zip": "https://github.com/malikisaputra-source/direktori-rumah-ibadah/archive/refs/heads/main.zip"
 },
 {
  "slug": "helpdesk-tiket",
  "judul": "Helpdesk Tiket IT",
  "ringkas": "Tiket IT support dengan prioritas, level eskalasi L1–L3, SLA & hitung mundur, papan Kanban, utas, dan notifikasi WhatsApp.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-12-14",
  "gambar": "img/helpdesk-tiket.webp",
  "repo": "https://github.com/malikisaputra-source/helpdesk-tiket",
  "zip": "https://github.com/malikisaputra-source/helpdesk-tiket/archive/refs/heads/main.zip"
 },
 {
  "slug": "iuran-kas-rt",
  "judul": "Iuran & Kas RT (ringkas, untuk bendahara)",
  "ringkas": "Satu layar untuk bendahara RT: ketuk nama untuk lunas, saldo kas besar, pesan WA pengingat, laporan bulanan, ekspor CSV.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage",
   "WhatsApp wa.me"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-12-10",
  "gambar": "img/iuran-kas-rt.webp",
  "repo": "https://github.com/malikisaputra-source/iuran-kas-rt",
  "zip": "https://github.com/malikisaputra-source/iuran-kas-rt/archive/refs/heads/main.zip"
 },
 {
  "slug": "kalender-kerja",
  "judul": "Kalender Kerja Harian",
  "ringkas": "Jadwal harian berjam dengan blok warna, tampilan minggu, seret-lepas, pengingat notifikasi, ekspor ke Google/Apple Calendar.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage",
   "Notification API",
   "Service Worker",
   "iCalendar (.ics)",
   "PWA"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
  "prompt": "jadwal",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "kunci": "2026-12-07",
  "gambar": "img/kalender-kerja.webp",
  "repo": "https://github.com/malikisaputra-source/kalender-kerja",
  "zip": "https://github.com/malikisaputra-source/kalender-kerja/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-angkringan",
  "judul": "Kantor AI 3D · Angkringan Malam",
  "ringkas": "Kantor AI pedagang kaki lima: gerobak beratap terpal, tikar lesehan, tungku arang, bohlam kuning. Agen AI bekerja di lapak pinggir jalan.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Angkringan Malam: gerobak beratap terpal, tikar lesehan, tungku arang, bohlam kuning",
   "Nuansa pinggir jalan Indonesia",
   "Mission Board berupa papan kapur",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Rekam jadi video reels (npm run rekam -- --gaya angkringan)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=angkringan",
   "Atau set GAYA = 'angkringan' di src/config.ts",
   "Ubah nama lapak, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-31",
  "gambar": "img/kantor-ai-angkringan.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-bakso",
  "judul": "Kantor AI 3D · Gerobak Bakso & Es",
  "ringkas": "Kantor AI pedagang kaki lima: gerobak bakso berkaca, payung warna-warni, pagar sekolah, siang terang. Agen AI bekerja di lapak pinggir jalan.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Gerobak Bakso & Es: gerobak bakso berkaca, payung warna-warni, pagar sekolah, siang terang",
   "Nuansa pinggir jalan Indonesia",
   "Mission Board berupa papan kapur",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Rekam jadi video reels (npm run rekam -- --gaya bakso)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=bakso",
   "Atau set GAYA = 'bakso' di src/config.ts",
   "Ubah nama lapak, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2027-01-07",
  "gambar": "img/kantor-ai-bakso.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-clay",
  "judul": "Kantor AI 3D · Clay",
  "ringkas": "Kantor AI 3D gaya Clay: semua objek dari tanah liat: membulat, bekas jari, warna lembut. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Clay: semua objek dari tanah liat: membulat, bekas jari, warna lembut",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya clay)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=clay",
   "Atau set GAYA = 'clay' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-11-16",
  "gambar": "img/kantor-ai-clay.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-diorama",
  "judul": "Kantor AI 3D · Diorama Miniatur",
  "ringkas": "Kantor AI 3D gaya Diorama Miniatur: seperti maket kecil: detail buku, cangkir, kabel, efek tilt-shift. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Diorama Miniatur: seperti maket kecil: detail buku, cangkir, kabel, efek tilt-shift",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya diorama)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=diorama",
   "Atau set GAYA = 'diorama' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-11-30",
  "gambar": "img/kantor-ai-diorama.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-felt",
  "judul": "Kantor AI 3D · Felt / Wol",
  "ringkas": "Kantor AI 3D gaya Felt / Wol: semua objek dari kain flanel dan wol berbulu halus, ada jahitan. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Felt / Wol: semua objek dari kain flanel dan wol berbulu halus, ada jahitan",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya felt)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=felt",
   "Atau set GAYA = 'felt' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-11-19",
  "gambar": "img/kantor-ai-felt.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-gedung30",
  "judul": "Kantor AI 3D · Gedung 30 Lantai",
  "ringkas": "Kantor AI 3D gaya Gedung 30 Lantai: pencakar langit voxel 30 lantai dengan lantai terbuka. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Gedung 30 Lantai: pencakar langit voxel 30 lantai dengan lantai terbuka",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya gedung30)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=gedung30",
   "Atau set GAYA = 'gedung30' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-24",
  "gambar": "img/kantor-ai-gedung30.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-hologram",
  "judul": "Kantor AI 3D · Hologram Malam",
  "ringkas": "Kantor AI 3D gaya Hologram Malam: grid cyan, dinding kaca, agen bertepi cahaya, board hologram. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Hologram Malam: grid cyan, dinding kaca, agen bertepi cahaya, board hologram",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya hologram)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=hologram",
   "Atau set GAYA = 'hologram' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-28",
  "gambar": "img/kantor-ai-hologram.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-kayu",
  "judul": "Kantor AI 3D · Balok Kayu Mainan",
  "ringkas": "Kantor AI 3D gaya Balok Kayu Mainan: agen boneka pasak kayu, pohon kerucut, serat kayu dicat. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Balok Kayu Mainan: agen boneka pasak kayu, pohon kerucut, serat kayu dicat",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya kayu)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=kayu",
   "Atau set GAYA = 'kayu' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-03",
  "gambar": "img/kantor-ai-kayu.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-menara",
  "judul": "Kantor AI 3D · Menara Neon",
  "ringkas": "Kantor AI 3D gaya Menara Neon: menara kantor bertumpuk dengan tepi neon malam. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Menara Neon: menara kantor bertumpuk dengan tepi neon malam",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya menara)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=menara",
   "Atau set GAYA = 'menara' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-17",
  "gambar": "img/kantor-ai-menara.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-pecellele",
  "judul": "Kantor AI 3D · Warung Tenda Pecel Lele",
  "ringkas": "Kantor AI pedagang kaki lima: tenda terpal dengan spanduk lukis, bangku plastik, lampu neon, kabel semrawut. Agen AI bekerja di lapak pinggir jalan.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Warung Tenda Pecel Lele: tenda terpal dengan spanduk lukis, bangku plastik, lampu neon, kabel semrawut",
   "Nuansa pinggir jalan Indonesia",
   "Mission Board berupa papan kapur",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Rekam jadi video reels (npm run rekam -- --gaya pecellele)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=pecellele",
   "Atau set GAYA = 'pecellele' di src/config.ts",
   "Ubah nama lapak, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2027-01-04",
  "gambar": "img/kantor-ai-pecellele.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-pulau",
  "judul": "Kantor AI 3D · Pulau Melayang",
  "ringkas": "Kantor AI 3D gaya Pulau Melayang: kantor clay di atas pulau tanah yang mengambang di langit. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Pulau Melayang: kantor clay di atas pulau tanah yang mengambang di langit",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya pulau)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=pulau",
   "Atau set GAYA = 'pulau' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-10",
  "gambar": "img/kantor-ai-pulau.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-stickman",
  "judul": "Kantor AI 3D · Stickman 3D",
  "ringkas": "Kantor AI 3D gaya Stickman 3D: semua berupa batang dan bola: agen stickman, perabot rangka garis. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Stickman 3D: semua berupa batang dan bola: agen stickman, perabot rangka garis",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya stickman)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=stickman",
   "Atau set GAYA = 'stickman' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-07",
  "gambar": "img/kantor-ai-stickman.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-taman",
  "judul": "Kantor AI 3D · Paviliun Taman",
  "ringkas": "Kantor AI 3D gaya Paviliun Taman: paviliun kayu low-poly di taman pinus dengan kolam. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Paviliun Taman: paviliun kayu low-poly di taman pinus dengan kolam",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya taman)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=taman",
   "Atau set GAYA = 'taman' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-21",
  "gambar": "img/kantor-ai-taman.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-template",
  "judul": "Kantor AI 3D + Paket 3 Agent",
  "ringkas": "Kantor isometrik 3D untuk agen AI kamu: tiap agen kerja di mejanya, menulis laporan, lalu santai. Plus paket 3 agent (Riset, Penulis, Admin) yang langsung mengisi laporannya.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
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
  "demo": null,
  "unduhan_lain": [
   {
    "label": "Unduh Paket 3 Agent (.zip)",
    "href": "unduh/paket-3-agent.zip"
   }
  ],
  "gambar": "img/kantor-ai-template.webp",
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "kantor-ai-toko",
  "judul": "Kantor AI 3D · Toko di Trotoar",
  "ringkas": "Kantor AI 3D gaya Toko di Trotoar: toko-kantor lukisan tangan dengan jalan, lampu, dan papan nama. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Toko di Trotoar: toko-kantor lukisan tangan dengan jalan, lampu, dan papan nama",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya toko)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=toko",
   "Atau set GAYA = 'toko' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-12-14",
  "gambar": "img/kantor-ai-toko.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-vinyl",
  "judul": "Kantor AI 3D · Mainan Vinyl Chibi",
  "ringkas": "Kantor AI 3D gaya Mainan Vinyl Chibi: agen kepala besar dari plastik mengilap seperti figur koleksi. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Mainan Vinyl Chibi: agen kepala besar dari plastik mengilap seperti figur koleksi",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya vinyl)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=vinyl",
   "Atau set GAYA = 'vinyl' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-11-26",
  "gambar": "img/kantor-ai-vinyl.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kantor-ai-voxel",
  "judul": "Kantor AI 3D · Voxel",
  "ringkas": "Kantor AI 3D gaya Voxel: semua tersusun dari kubus: agen, pohon, tanah, air. Agen bekerja, menulis laporan, lalu santai.",
  "teknologi": [
   "React",
   "Three.js",
   "Vite",
   "TypeScript"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Gaya Voxel: semua tersusun dari kubus: agen, pohon, tanah, air",
   "Agen mengetik, laporan sore, santai & ngopi",
   "Gelembung ringkasan, tanda ! menunggu keputusan",
   "Mission Board & timelapse satu hari kerja",
   "Rekam jadi video reels (npm run rekam -- --gaya voxel)",
   "Bisa ganti ke 16 gaya lain lewat tombol pemilih"
  ],
  "cara": [
   "Install Node.js 20+, lalu npm install dan npm run dev",
   "Buka http://localhost:5173/?gaya=voxel",
   "Atau set GAYA = 'voxel' di src/config.ts",
   "Ubah nama kantor, agen, dan jadwal di src/config.ts"
  ],
  "demo": null,
  "kunci": "2026-11-23",
  "gambar": "img/kantor-ai-voxel.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/kantor-ai-template",
  "zip": "https://github.com/malikisaputra-source/kantor-ai-template/archive/refs/heads/main.zip"
 },
 {
  "slug": "kas-warung",
  "judul": "Kas Warung",
  "ringkas": "Buku kas harian super cepat untuk warung: numpad besar, untung hari ini langsung kelihatan, kasbon pelanggan, laporan + grafik.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-11-16",
  "gambar": "img/kas-warung.webp",
  "repo": "https://github.com/malikisaputra-source/kas-warung",
  "zip": "https://github.com/malikisaputra-source/kas-warung/archive/refs/heads/main.zip"
 },
 {
  "slug": "kasir-fotocopy",
  "judul": "Kasir Fotocopy & Percetakan",
  "ringkas": "Kasir offline untuk fotocopy & print: hitung lembar warna/hitam-putih, bolak-balik, jilid, laminasi, rekap lembar. Jalan di laptop & HP.",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "req": [
   "kmssyafyasin",
   "alfattahprint"
  ],
  "kunci": "2026-12-24",
  "gambar": "img/kasir-fotocopy.webp",
  "repo": "https://github.com/malikisaputra-source/kasir-fotocopy",
  "zip": "https://github.com/malikisaputra-source/kasir-fotocopy/archive/refs/heads/main.zip"
 },
 {
  "slug": "kasir-laundry",
  "judul": "Kasir Laundry Offline + Dasbor Owner",
  "ringkas": "Kasir laundry kiloan & satuan: papan status cucian, nota & WA siap ambil, laporan, offline. Sinkron Google Sheets opsional untuk owner.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "PWA",
   "Service Worker",
   "localStorage",
   "Google Apps Script",
   "Google Sheets"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "req": [
   "okfian_ari"
  ],
  "kunci": "2026-12-28",
  "gambar": "img/kasir-laundry.webp",
  "repo": "https://github.com/malikisaputra-source/kasir-laundry",
  "zip": "https://github.com/malikisaputra-source/kasir-laundry/archive/refs/heads/main.zip"
 },
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
  "kustom": true,
  "berkas": [
   "LICENSE",
   "README.md",
   "AGENTS.md",
   "DESIGN.md",
   ".claude/skills/ubah-kasir-umkm/SKILL.md",
   "index.html",
   "style.css",
   "app.js",
   "tema.css",
   "tema.js",
   "sw.js",
   "manifest.webmanifest",
   "ikon.svg",
   "qris.svg",
   "img/logo.svg",
   "img/produk-contoh.svg"
  ],
  "pratinjau": "index.html?demo",
  "gambar": "img/kasir-umkm.webp",
  "dasar": "paket/kasir-umkm/",
  "repo": "https://github.com/malikisaputra-source/kasir-umkm",
  "zip": "https://github.com/malikisaputra-source/kasir-umkm/archive/refs/heads/main.zip",
  "prd": true
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
   "Ubah nama toko di tema.js; nomor WA & ongkir di produk.js",
   "Ganti daftar produk dan gambarnya",
   "Buka index.html untuk mencoba",
   "Unggah ke GitHub Pages atau Vercel"
  ],
  "demo": "index.html",
  "kustom": true,
  "berkas": [
   "LICENSE",
   "README.md",
   "AGENTS.md",
   "DESIGN.md",
   ".claude/skills/ubah-katalog-toko-wa/SKILL.md",
   "index.html",
   "style.css",
   "app.js",
   "produk.js",
   "tema.css",
   "tema.js",
   "img/logo.svg",
   "img/foto-produk.svg"
  ],
  "pratinjau": "index.html",
  "gambar": "img/katalog-toko-wa.webp",
  "dasar": "paket/katalog-toko-wa/",
  "repo": "https://github.com/malikisaputra-source/katalog-toko-wa",
  "zip": "https://github.com/malikisaputra-source/katalog-toko-wa/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "keuangan-bendahara",
  "judul": "Keuangan Pribadi & Bendahara",
  "ringkas": "Satu aplikasi dua mode: catat keuangan pribadi (anggaran, dompet, tabungan) atau buku kas bendahara masjid/RT dengan laporan siap cetak.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
  "req": [
   "manusiabiasa",
   "nal.ptr",
   "muslim_upskill"
  ],
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-11-12",
  "gambar": "img/keuangan-bendahara.webp",
  "repo": "https://github.com/malikisaputra-source/keuangan-bendahara",
  "zip": "https://github.com/malikisaputra-source/keuangan-bendahara/archive/refs/heads/main.zip"
 },
 {
  "slug": "landing-kelas-virtual",
  "judul": "Landing Kelas Virtual (Lynk)",
  "ringkas": "Landing page 1 halaman untuk jualan kelas online: harga coret, kurikulum, bonus, mentor, FAQ, countdown. Tombol beli ke link Lynk.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "SVG"
  ],
  "kategori": "Template Website",
  "tier": "premium",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "req": [
   "im_jeniuss"
  ],
  "kunci": "2027-01-14",
  "gambar": "img/landing-kelas-virtual.webp",
  "repo": "https://github.com/malikisaputra-source/landing-kelas-virtual",
  "zip": "https://github.com/malikisaputra-source/landing-kelas-virtual/archive/refs/heads/main.zip"
 },
 {
  "slug": "manajemen-bengkel",
  "judul": "Manajemen Bengkel Motor & Mobil",
  "ringkas": "Sistem bengkel tanpa server: antrean kanban + layar TV, work order, stok sparepart, nota A5/58mm, kirim WA, riwayat plat & laporan.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html?demo",
  "kustom": true,
  "pratinjau": "index.html?demo",
  "berkas": [
   "index.html",
   "style.css",
   "app.js",
   "tema.css",
   "tema.js",
   "ikon.svg",
   "README.md",
   "LICENSE",
   "meta.json",
   "ss.png",
   "img/logo.svg",
   "img/kendaraan.svg",
   "DESIGN.md",
   "AGENTS.md",
   ".claude/skills/ubah-manajemen-bengkel/SKILL.md"
  ],
  "gambar": "img/manajemen-bengkel.webp",
  "dasar": "paket/manajemen-bengkel/",
  "repo": "https://github.com/malikisaputra-source/manajemen-bengkel",
  "zip": "https://github.com/malikisaputra-source/manajemen-bengkel/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "manajemen-gym",
  "judul": "Manajemen Gym",
  "ringkas": "Aplikasi gym offline: member & paket, bayar/perpanjang, check-in cepat pakai kartu QR, jatuh tempo + pengingat WA, laporan.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "PWA",
   "Service Worker",
   "localStorage",
   "qrcodejs"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "req": [
   "mastewe21"
  ],
  "kunci": "2026-12-31",
  "gambar": "img/manajemen-gym.webp",
  "repo": "https://github.com/malikisaputra-source/manajemen-gym",
  "zip": "https://github.com/malikisaputra-source/manajemen-gym/archive/refs/heads/main.zip"
 },
 {
  "slug": "manajemen-klien",
  "judul": "Manajemen Klien — CRM Freelancer & Agensi",
  "ringkas": "CRM tanpa server: klien, pipeline kanban, proyek, invoice & penawaran (PDF/WA), follow-up, laporan. Data di browser.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage",
   "WhatsApp wa.me"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html?demo",
  "kustom": true,
  "pratinjau": "index.html?demo",
  "berkas": [
   "index.html",
   "style.css",
   "app.js",
   "tema.css",
   "tema.js",
   "ikon.svg",
   "README.md",
   "LICENSE",
   "meta.json",
   "DESIGN.md",
   "AGENTS.md",
   ".claude/skills/ubah-manajemen-klien/SKILL.md",
   "ss.png",
   "img/logo.svg",
   "img/klien-logo.svg"
  ],
  "gambar": "img/manajemen-klien.webp",
  "dasar": "paket/manajemen-klien/",
  "repo": "https://github.com/malikisaputra-source/manajemen-klien",
  "zip": "https://github.com/malikisaputra-source/manajemen-klien/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "mesin-3d-interaktif",
  "judul": "Mesin 4-Tak 3D Interaktif",
  "ringkas": "Model edukasi Three.js mesin 4-tak: piston, batang, engkol, katup, siklus hisap-kompresi-usaha-buang, slider RPM, transparan & potongan.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "Three.js r160",
   "WebGL"
  ],
  "kategori": "Template Website",
  "tier": "gratis",
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
  "demo": "index.html",
  "pratinjau": "index.html",
  "req": [
   "pratamax165"
  ],
  "kunci": "2027-01-25",
  "prototipe": true,
  "gambar": "img/mesin-3d-interaktif.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/mesin-3d-interaktif",
  "zip": "https://github.com/malikisaputra-source/mesin-3d-interaktif/archive/refs/heads/main.zip"
 },
 {
  "slug": "monitor-subdomain",
  "judul": "Monitor Subdomain (Status Page)",
  "ringkas": "Status page ala Upptime buatan sendiri: GitHub Actions cek URL tiap 10 menit, catat uptime & latensi 90 hari, tampil di GitHub Pages.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "Node.js 20",
   "GitHub Actions",
   "GitHub Pages"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html?demo",
  "pratinjau": "index.html?demo",
  "req": [
   "pakhaji896"
  ],
  "kunci": "2027-01-18",
  "prototipe": true,
  "gambar": "img/monitor-subdomain.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/monitor-subdomain",
  "zip": "https://github.com/malikisaputra-source/monitor-subdomain/archive/refs/heads/main.zip"
 },
 {
  "slug": "paket-10-agent-umkm",
  "judul": "10 AI Agent UMKM + Kantor 3D 2 Lantai",
  "ringkas": "10 AI agent untuk usaha kecil + Kantor AI 3D 2 lantai (contoh toko roti fiktif \"Roti Senja\"). Jalan gratis di Antigravity CLI.",
  "teknologi": [
   "Antigravity CLI",
   "AGENTS.md",
   "React",
   "Three.js",
   "Vite"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Lantai 1: agent kasir, stok, pesanan, CS WhatsApp, keuangan",
   "Lantai 2: agent riset, konten, desain, laporan, manajer",
   "Contoh data harian: penjualan, stok, pesanan, pesan WA",
   "Semua agent menulis laporan ke src/laporan.json",
   "Kantor AI 3D 2 lantai: lihat 10 agent bekerja & laporannya (Vite + Three.js)",
   "Jalan gratis di Antigravity CLI (login Gmail)",
   "Paket gratis punya kuota mingguan, cek /usage"
  ],
  "cara": [
   "Pasang Antigravity CLI dan login dengan Gmail",
   "Ganti isi folder data/ dengan data usahamu",
   "Buka Terminal di folder paket, ketik agy",
   "Minta agent mengerjakan tugasnya, lalu baca setiap izin sebelum setuju",
   "Lihat kantornya: npm install lalu npm run dev"
  ],
  "demo": null,
  "kunci": "2026-11-12",
  "gambar": "img/paket-10-agent-umkm.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/paket-10-agent-umkm",
  "zip": "https://github.com/malikisaputra-source/paket-10-agent-umkm/archive/refs/heads/main.zip"
 },
 {
  "slug": "paket-15-agent-koperasi",
  "judul": "15 AI Agent Koperasi Desa + Kantor 3D 3 Lantai",
  "ringkas": "15 AI agent untuk koperasi desa + Kantor AI 3D merah-putih 3 lantai (contoh fiktif Koperasi Desa Merah Putih Sukamaju). Jalan di Claude Code atau OpenCode gratis.",
  "teknologi": [
   "Claude Code",
   "OpenCode",
   "React",
   "Three.js",
   "Vite"
  ],
  "kategori": "AI Agent",
  "tier": "premium",
  "fitur": [
   "Lantai 1 · Layanan anggota: sembako, stok, gudang, logistik, CS",
   "Lantai 2 · Keuangan & kesehatan: simpan pinjam, anggota, klinik, apotek, pembukuan",
   "Lantai 3 · Pengurus: harga, konten, desain, laporan, ketua",
   "Siap di Claude Code (.claude/agents) dan OpenCode gratis (.opencode/agent)",
   "CLAUDE.md berisi aturan & larangan: tidak menyetujui pinjaman, tidak mendiagnosis, tidak meresepkan obat, tidak mengirim pesan",
   "LANGKAH.md: 4 perintah (lantai 1, 2, 3, rapat) + 13 file data contoh",
   "Contoh hasil uji asli 12 Nov 2026 (Claude Code, 15/15 agent)",
   "Skill kantor-ai-koperasi untuk menyesuaikan dengan data koperasimu",
   "Kantor AI 3D merah-putih 3 lantai: lihat 15 agent bekerja & laporannya"
  ],
  "cara": [
   "Unduh ZIP lalu ekstrak, baca BACA-DULU.txt",
   "Ganti isi folder data/ dengan data koperasimu",
   "Buka folder di Claude Code (claude) atau OpenCode (opencode)",
   "Ikuti LANGKAH.md: lantai 1, lantai 2, lantai 3, lalu rapat; baca setiap izin sebelum setuju",
   "Lihat kantornya: npm install lalu npm run dev"
  ],
  "demo": null,
  "catatan": "Contoh fiktif, bukan logo atau data resmi Koperasi Desa Merah Putih.",
  "gambar": "img/paket-15-agent-koperasi.webp",
  "repo": null,
  "zip": "unduh/paket-15-agent-koperasi.zip"
 },
 {
  "slug": "paket-operator-sekolah",
  "judul": "Paket AI Operator Sekolah",
  "ringkas": "Skill Claude Code/Codex untuk operator sekolah: rapikan data siswa Excel/CSV, buat surat .docx, rekap absensi & nilai. Diproses lokal.",
  "teknologi": [
   "Claude Code",
   "Codex",
   "CLAUDE.md",
   "Agent Skills",
   "Python",
   "python-docx",
   "openpyxl"
  ],
  "kategori": "AI Agent",
  "tier": "gratis",
  "fitur": [
   "Rapikan nama, NISN, tanggal, kelas, nomor HP",
   "Tandai data janggal & duplikat, tidak ditebak",
   "Surat keterangan aktif, izin, undangan ke Word",
   "Template surat JSON mudah ditambah",
   "Rekap absensi H/S/I/A + persen hadir",
   "Rekap nilai: rata-rata, peringkat, di bawah KKM",
   "Contoh data fiktif untuk uji coba",
   "Aturan data pribadi siswa di CLAUDE.md"
  ],
  "cara": [
   "Pasang Python 3 lalu pip install openpyxl python-docx",
   "Isi contoh/sekolah.json dengan identitas sekolah",
   "Buka folder di terminal, jalankan claude atau codex",
   "Minta: rapikan data siswa / buat surat / rekap absensi",
   "Ambil & periksa hasil di folder hasil/"
  ],
  "demo": "index.html",
  "pratinjau": "index.html",
  "req": [
   "ryapio"
  ],
  "kunci": "2027-01-11",
  "prototipe": true,
  "gambar": "img/paket-operator-sekolah.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/paket-operator-sekolah",
  "zip": "https://github.com/malikisaputra-source/paket-operator-sekolah/archive/refs/heads/main.zip"
 },
 {
  "slug": "perpustakaan-digital",
  "judul": "Perpustakaan Digital Rumah Sakit",
  "ringkas": "Perpustakaan staf RS offline: katalog buku & jurnal, anggota, pinjam-kembali, denda opsional, label barcode, laporan, katalog publik.",
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
  "demo": "index.html?demo",
  "kustom": false,
  "pratinjau": "index.html?demo",
  "req": [
   "krniawaiz"
  ],
  "kunci": "2027-01-07",
  "gambar": "img/perpustakaan-digital.webp",
  "repo": "https://github.com/malikisaputra-source/perpustakaan-digital",
  "zip": "https://github.com/malikisaputra-source/perpustakaan-digital/archive/refs/heads/main.zip"
 },
 {
  "slug": "pesan-antar-kedai",
  "judul": "Pesan Antar Kedai",
  "ringkas": "Pesan antar ala GoFood dengan kurir milik kedai sendiri: menu, pin peta, tawar ongkir lewat chat, pelacakan, sudut kedai & kurir.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage",
   "BroadcastChannel",
   "Leaflet + OpenStreetMap"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-12-21",
  "gambar": "img/pesan-antar-kedai.webp",
  "repo": "https://github.com/malikisaputra-source/pesan-antar-kedai",
  "zip": "https://github.com/malikisaputra-source/pesan-antar-kedai/archive/refs/heads/main.zip"
 },
 {
  "slug": "portofolio-pribadi",
  "judul": "Portofolio Pribadi",
  "ringkas": "Portofolio dua halaman bergaya \"Senja Terakota\": krem hangat, terakota & zaitun, judul Fraunces, benda 3D melayang, gerak halus, detail karya per halaman. Isi & gambar cukup di data.js.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript"
  ],
  "kategori": "Template Website",
  "tier": "premium",
  "req": [
   "anggrek.hitam.22"
  ],
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "kunci": "2026-12-03",
  "gambar": "img/portofolio-pribadi.webp",
  "repo": "https://github.com/malikisaputra-source/portofolio-pribadi",
  "zip": "https://github.com/malikisaputra-source/portofolio-pribadi/archive/refs/heads/main.zip"
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
  "gambar": "img/presensi-gps-gas.webp",
  "repo": "https://github.com/malikisaputra-source/presensi-gps-gas",
  "zip": "https://github.com/malikisaputra-source/presensi-gps-gas/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "skill-narasi-laporan-word",
  "judul": "Skill Narasi Laporan Word",
  "ringkas": "Skill agent: baca data CSV/Excel & catatan, tulis narasi laporan per bab, jadikan .docx rapi dengan tabel. Angka dihitung skrip.",
  "teknologi": [
   "Claude Code",
   "Codex",
   "Agent Skills",
   "Python",
   "python-docx",
   "openpyxl"
  ],
  "kategori": "AI Agent",
  "tier": "gratis",
  "fitur": [
   "Skill narasi-laporan-word siap pakai",
   "Ringkas data: total, per kelompok, perubahan %",
   "Angka dari skrip, bukan ditebak AI",
   "Template bab: laporan kegiatan & penelitian sederhana",
   "Narasi JSON → Word: bab, poin, tabel bergaya",
   "Format angka Indonesia",
   "Contoh data fiktif + hasil .docx",
   "Bisa dipakai di Claude Code atau Codex"
  ],
  "cara": [
   "pip install python-docx openpyxl",
   "Taruh data & catatan di folder paket",
   "Jalankan claude (atau codex) di folder itu",
   "Minta: buat laporan dari data X pakai template Y",
   "Periksa hasil/*.docx di Word"
  ],
  "demo": "index.html",
  "pratinjau": "index.html",
  "req": [
   "genk_cebiit"
  ],
  "kunci": "2027-01-14",
  "prototipe": true,
  "gambar": "img/skill-narasi-laporan-word.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/skill-narasi-laporan-word",
  "zip": "https://github.com/malikisaputra-source/skill-narasi-laporan-word/archive/refs/heads/main.zip"
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
  "gambar": "img/template-agrowisata.webp",
  "repo": "https://github.com/malikisaputra-source/template-agrowisata",
  "zip": "https://github.com/malikisaputra-source/template-agrowisata/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "template-carousel-quotes",
  "judul": "Template Carousel Quotes Instagram",
  "ringkas": "Editor carousel quotes IG 1080×1350: 3 gaya (editorial, neon, teduh), sampul–isi–CTA, unduh PNG per slide atau ZIP.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "html-to-image",
   "JSZip",
   "localStorage"
  ],
  "kategori": "Template Website",
  "tier": "gratis",
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
  "demo": "index.html",
  "kustom": false,
  "pratinjau": "index.html",
  "req": [
   "zoealabaster",
   "muslim_upskill"
  ],
  "kunci": "2027-01-11",
  "gambar": "img/template-carousel-quotes.webp",
  "repo": "https://github.com/malikisaputra-source/template-carousel-quotes",
  "zip": "https://github.com/malikisaputra-source/template-carousel-quotes/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-kolase-vox",
  "judul": "Template Video Kolase Gaya Vox (Gedung Sate)",
  "ringkas": "Template reels 9:16 berbasis kode, persis video kolase Gedung Sate: judul serif raksasa, kertas sobek, objek bertepi kertas + halftone, anotasi tangan, plus semua prompt Gemini.",
  "teknologi": [
   "Remotion 4",
   "React 19",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
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
  "demo": null,
  "gambar": "img/template-kolase-vox.webp",
  "repo": "https://github.com/malikisaputra-source/template-kolase-vox",
  "zip": "https://github.com/malikisaputra-source/template-kolase-vox/archive/refs/heads/main.zip",
  "prd": true
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
  "gambar": "img/template-montessori-anak.webp",
  "repo": "https://github.com/malikisaputra-source/template-montessori-anak",
  "zip": "https://github.com/malikisaputra-source/template-montessori-anak/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "template-reels-t01",
  "judul": "T01 Panggung Kutipan Sinematik",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Panggung Kutipan Sinematik.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-11-12",
  "gambar": "img/template-reels-t01.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t01",
  "zip": "https://github.com/malikisaputra-source/template-reels-t01/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t02",
  "judul": "T02 Kata Kunci Minimal",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Kata Kunci Minimal.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-11-16",
  "gambar": "img/template-reels-t02.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t02",
  "zip": "https://github.com/malikisaputra-source/template-reels-t02/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t03",
  "judul": "T03 Kolase Kertas",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Kolase Kertas.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-11-19",
  "gambar": "img/template-reels-t03.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t03",
  "zip": "https://github.com/malikisaputra-source/template-reels-t03/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t04",
  "judul": "T04 Editorial Hangat",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Editorial Hangat.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-11-23",
  "gambar": "img/template-reels-t04.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t04",
  "zip": "https://github.com/malikisaputra-source/template-reels-t04/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t05",
  "judul": "T05 UI Aplikasi Kaca",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya UI Aplikasi Kaca.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-11-26",
  "gambar": "img/template-reels-t05.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t05",
  "zip": "https://github.com/malikisaputra-source/template-reels-t05/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t06",
  "judul": "T06 Bicara + Sisipan",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Bicara + Sisipan.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-11-30",
  "gambar": "img/template-reels-t06.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t06",
  "zip": "https://github.com/malikisaputra-source/template-reels-t06/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t07",
  "judul": "T07 Dokumenter Retro",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Dokumenter Retro.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-12-03",
  "gambar": "img/template-reels-t07.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t07",
  "zip": "https://github.com/malikisaputra-source/template-reels-t07/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t08",
  "judul": "T08 Tekno Gelap Oranye",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Tekno Gelap Oranye.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-12-07",
  "gambar": "img/template-reels-t08.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t08",
  "zip": "https://github.com/malikisaputra-source/template-reels-t08/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t09",
  "judul": "T09 Iklan Jasa Krem",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Iklan Jasa Krem.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-12-10",
  "gambar": "img/template-reels-t09.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t09",
  "zip": "https://github.com/malikisaputra-source/template-reels-t09/archive/refs/heads/main.zip"
 },
 {
  "slug": "template-reels-t10",
  "judul": "T10 Grid Lampu Sorot",
  "ringkas": "Template video reels 9:16 berbasis kode, gaya Grid Lampu Sorot.",
  "teknologi": [
   "Remotion",
   "React",
   "TypeScript"
  ],
  "kategori": "Template Video",
  "tier": "premium",
  "fitur": [],
  "cara": [],
  "demo": null,
  "kunci": "2026-12-14",
  "gambar": "img/template-reels-t10.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/template-reels-t10",
  "zip": "https://github.com/malikisaputra-source/template-reels-t10/archive/refs/heads/main.zip"
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
  "gambar": "img/template-sekolah-yayasan.webp",
  "repo": "https://github.com/malikisaputra-source/template-sekolah-yayasan",
  "zip": "https://github.com/malikisaputra-source/template-sekolah-yayasan/archive/refs/heads/main.zip",
  "prd": true
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
  "gambar": "img/template-video-tutor-remotion.webp",
  "repo": "https://github.com/malikisaputra-source/template-video-tutor-remotion",
  "zip": "https://github.com/malikisaputra-source/template-video-tutor-remotion/archive/refs/heads/main.zip",
  "prd": true
 },
 {
  "slug": "translate-suara",
  "judul": "Terjemah Suara Dua Arah",
  "ringkas": "PWA penerjemah percakapan Indonesia–Inggris: bicara, terjemahan muncul & dibacakan. Suara gratis di Chrome, terjemahan pakai API milikmu.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "Web Speech API",
   "PWA",
   "Service Worker",
   "localStorage"
  ],
  "kategori": "Aplikasi Web",
  "tier": "gratis",
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
  "demo": "index.html?demo",
  "pratinjau": "index.html?demo",
  "req": [
   "pentinguang"
  ],
  "kunci": "2027-01-21",
  "prototipe": true,
  "gambar": "img/translate-suara.webp",
  "kustom": false,
  "repo": "https://github.com/malikisaputra-source/translate-suara",
  "zip": "https://github.com/malikisaputra-source/translate-suara/archive/refs/heads/main.zip"
 },
 {
  "slug": "website-rt",
  "judul": "Website RT/RW: Warga, Iuran, Kas & Surat",
  "ringkas": "Aplikasi RT/RW tanpa server: data warga & KK, iuran + pengingat WA, kas bergrafik, papan pengumuman, surat pengantar A4.",
  "teknologi": [
   "HTML",
   "CSS",
   "JavaScript",
   "localStorage",
   "PWA",
   "WhatsApp wa.me"
  ],
  "kategori": "Aplikasi Web",
  "tier": "premium",
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
  "demo": "index.html",
  "kustom": true,
  "berkas": [
   "index.html",
   "tema.css",
   "tema.js",
   "style.css",
   "data.js",
   "app.js",
   "sw.js",
   "manifest.webmanifest",
   "ikon.svg",
   "img/logo.svg",
   "img/hero-lingkungan.svg",
   "img/pengurus-1.svg",
   "img/pengurus-2.svg",
   "img/pengurus-3.svg",
   "img/pengurus-4.svg",
   "img/galeri-1.svg",
   "img/galeri-2.svg",
   "img/galeri-3.svg",
   "img/galeri-4.svg",
   "README.md",
   "LICENSE",
   "DESIGN.md",
   "AGENTS.md",
   ".claude/skills/ubah-website-rt/SKILL.md",
   "meta.json",
   "ss.png"
  ],
  "pratinjau": "index.html",
  "gambar": "img/website-rt.webp",
  "dasar": "paket/website-rt/",
  "repo": "https://github.com/malikisaputra-source/website-rt",
  "zip": "https://github.com/malikisaputra-source/website-rt/archive/refs/heads/main.zip",
  "prd": true
 }
];
