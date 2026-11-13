/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/*
  DATA PORTOFOLIO — SATU-SATUNYA berkas yang perlu kamu ubah untuk mengganti isi.
  Semua nama, klien, dan angka di bawah ini FIKTIF (contoh). Ganti dengan datamu sendiri.
  Aturan: teks di antara tanda kutip "..." boleh diganti bebas. Jangan hapus koma, kutip, atau kurung.
  Teks bertanda {miring} akan tampil dengan huruf serif miring, mis. "Peneliti & {desainer}".
  Gambar: semua alamat gambar ada di sini (lihat PANDUAN.md bagian "Ganti gambar").
*/
window.DATA = {
  // ---------- Identitas ----------
  nama: "Nadia Larasati",              // nama lengkap (judul halaman, bagian Tentang, footer)
  namaPanggilan: "Nadia",              // dipakai di sapaan hero
  namaRaksasa: "Larasati",             // teks raksasa di bawah footer
  kota: "Yogyakarta, Indonesia",
  logo: "img/logo.svg",                // logo/monogram di header + favicon
  foto: "img/foto-profil.svg",         // potret hero & bagian Tentang (rasio 4:5)
  fotoAlt: "Potret Nadia Larasati",
  og: "img/og.png",                    // gambar pratinjau saat link dibagikan (opsional, 1200x630)

  // ---------- Hero ----------
  sapaan: "Halo, saya Nadia",
  peran: "Peneliti pangan & {desainer komunikasi}",
  lencana: { objek: "img/objek/medal.webp", teks: "Juara 2 lomba karya ilmiah tingkat nasional (contoh)" },
  pil: ["Kepala Tim Kreatif, Studio Larik", "Pendiri, Rumah Cerita Data"],
  latar: "Pernah magang riset di {Lembaga Riset Nusa} (2022–2024) dan {Universitas Selatan} (2024). S1 Teknologi Pangan, {Universitas Contoh}.",
  lead: "Saya menguji formula pangan di laboratorium. Kini saya menjalankan kampanye untuk klien, dan setiap pekerjaan saya laporkan terhadap targetnya.",
  email: "halo@contoh.id",             // ganti dengan email kamu
  sosial: [
    { nama: "LinkedIn", url: "https://www.linkedin.com/", ikon: "linkedin" },
    { nama: "Instagram", url: "https://www.instagram.com/", ikon: "instagram" },
    { nama: "Email", url: "mailto:halo@contoh.id", ikon: "email" }
  ],

  // ---------- Marquee "tempat kerja/klien" ----------
  judulKlien: "Tempat saya bekerja dan belajar",
  klien: [
    { nama: "Lembaga Riset Nusa", logo: "img/logo-klien/klien-1.svg" },
    { nama: "Universitas Selatan", logo: "img/logo-klien/klien-2.svg" },
    { nama: "Universitas Contoh", logo: "img/logo-klien/klien-3.svg" },
    { nama: "Dinas Kota Lestari", logo: "img/logo-klien/klien-4.svg" },
    { nama: "Studio Larik", logo: "img/logo-klien/klien-5.svg" },
    { nama: "Kopi Senja", logo: "img/logo-klien/klien-6.svg" }
  ],

  // ---------- Pernyataan ----------
  pernyataan: {
    sapa: "Kenapa dua-duanya?",
    teks: "Saya pernah menguji sampel di laboratorium dan menjalankan kampanye untuk pemerintah kota. Caranya sama: tetapkan target, ukur, laporkan dengan jujur.",
    kiri: [{ ikon: "megafon", teks: "Strategi konten" }, { ikon: "tim", teks: "Produksi video" }, { ikon: "tim", teks: "Kerja sama kreator" }],
    kanan: [{ ikon: "labu", teks: "Uji laboratorium" }, { ikon: "labu", teks: "Keamanan pangan" }, { ikon: "grafik", teks: "Laporan berbasis target" }]
  },

  // ---------- Karya ----------
  judulKarya: "{n} karya, {dari lab ke klien}",   // {n} diganti jumlah karya unggulan
  judulRak: "Semua {n} karya",
  ketRak: "Satu benda untuk tiap karya, dari laboratorium sampai klien.",
  // unggulan: true = tampil besar di bagian "Karya pilihan". Halaman detail: karya.html?id=<id>
  karya: [
    {
      id: "uji-formula", unggulan: true,
      label: "Uji formula pangan", objek: "img/objek/flask.webp",
      judul: "Dari bahan lokal ke {uji laboratorium}",
      sampul: "img/karya/uji-formula.svg",
      klien: "Lembaga Riset Nusa", peran: "Asisten peneliti", tahun: "2022–2024",
      tag: ["Ekstraksi", "Uji sensori", "Analisis data"],
      ringkas: "Tiga tahun menguji formula minuman fungsional dari bahan lokal, dari ekstraksi sampai laporan akhir.",
      angkaSamping: [{ b: "48", t: "sampel diuji" }, { b: "3", t: "formula lolos tahap akhir" }],
      tantangan: "Tim butuh formula minuman yang stabil disimpan tiga bulan tanpa pengawet buatan, dengan bahan yang mudah didapat petani setempat.",
      dilakukan: "Saya menyiapkan ekstrak, menjalankan uji stabilitas mingguan, dan merapikan data ke format yang bisa dibaca tim non-peneliti.",
      hasil: ["Tiga formula lolos uji stabilitas 12 minggu.", "Data uji dipakai sebagai dasar laporan akhir tim."],
      statistik: [{ b: "12", t: "minggu uji stabilitas" }, { b: "48", t: "sampel dicatat" }, { b: "3", t: "formula lolos" }],
      bagian: [{ t: "Persiapan ekstrak", p: "sendiri" }, { t: "Uji stabilitas mingguan", p: "pimpin" }, { t: "Penulisan laporan", p: "tim" }],
      pelajaran: "Data yang rapi lebih meyakinkan daripada data yang banyak."
    },
    {
      id: "kampanye-kota", unggulan: true,
      label: "Kampanye kota", objek: "img/objek/camera.webp",
      judul: "Kampanye kota, {dari negosiasi sampai serah terima}",
      sampul: "img/karya/kampanye-kota.svg",
      klien: "Studio Larik × Dinas Kota Lestari", peran: "Manajer akun", tahun: "2026",
      tag: ["Negosiasi klien", "Manajemen akun", "Klien pemerintah"],
      ringkas: "Satu akun pemerintah kota yang saya pegang dari negosiasi pertama sampai serah terima: 2 paket, 6+ video, 25+ unggahan dalam sebulan.",
      angkaSamping: [{ b: "2", t: "paket kerja dalam satu kontrak" }, { b: "6+", t: "video dalam 1 bulan" }],
      tantangan: "Dinas butuh video edukasi dan publikasi media sosial untuk program kebersihan kota, dengan waktu satu bulan.",
      dilakukan: "Saya memegang akun dari negosiasi sampai serah terima, berhubungan langsung dengan klien, dan mengatur jadwal produksi tim.",
      hasil: ["Dalam satu bulan: 6+ video, 25+ unggahan, dan 5+ liputan media lokal.", "Kedua paket diserahkan tepat waktu."],
      statistik: [{ b: "25+", t: "unggahan media sosial" }, { b: "5+", t: "liputan media lokal" }, { b: "± 500", t: "peserta acara peluncuran" }],
      bagian: [{ t: "Negosiasi dan ruang lingkup", p: "sendiri" }, { t: "Komunikasi klien sampai serah terima", p: "sendiri" }, { t: "Manajemen produksi", p: "pimpin" }, { t: "Produksi video dan konten", p: "tim" }],
      pelajaran: "Dengan klien pemerintah, ketepatan janji adalah promosi terbaik."
    },
    {
      id: "funnel-kreator", unggulan: true,
      label: "Kerja sama kreator", objek: "img/objek/funnel.webp",
      judul: "Mencari kebocoran di {corong 400 kreator}",
      sampul: "img/karya/funnel-kreator.svg",
      klien: "Studio Larik × Kopi Senja", peran: "Analis kampanye", tahun: "2026",
      tag: ["Kerja sama kreator", "Analisis corong", "Manajemen pipeline"],
      ringkas: "Menelusuri di tahap mana kreator berhenti membalas, lalu memperbaiki naskah pesan pertama.",
      angkaSamping: [{ b: "400", t: "kreator dihubungi" }, { b: "2×", t: "balasan setelah naskah baru" }],
      tantangan: "Ratusan kreator sudah dihubungi, tetapi hanya sedikit yang sampai tahap kesepakatan.",
      dilakukan: "Saya memetakan corong per tahap, menemukan titik putus terbesar di percakapan pertama, lalu menguji dua versi naskah pesan.",
      hasil: ["Naskah baru menggandakan tingkat balasan di tahap percakapan."],
      statistik: [{ b: "650", t: "kreator di basis data" }, { b: "400", t: "dihubungi" }, { b: "2×", t: "tingkat balasan" }],
      bagian: [{ t: "Pemetaan corong", p: "sendiri" }, { t: "Uji naskah pesan", p: "pimpin" }, { t: "Penghubungan kreator", p: "tim" }],
      pelajaran: "Masalah terbesar biasanya ada di kalimat pertama."
    },
    {
      id: "tim-kreatif", unggulan: true,
      label: "Target tim kreatif", objek: "img/objek/barchart.webp",
      judul: "Memimpin tim kreatif {dengan target bulanan}",
      sampul: "img/karya/tim-kreatif.svg",
      klien: "Studio Larik", peran: "Kepala tim kreatif", tahun: "2026–kini",
      tag: ["Kepemimpinan tim", "Laporan KPI", "Dokumentasi acara"],
      ringkas: "Menjalankan tim kreatif lima orang dengan laporan mingguan terhadap target, termasuk target yang meleset.",
      angkaSamping: [{ b: "5", t: "anggota tim" }, { b: "12", t: "reels per bulan" }],
      tantangan: "Tim belum punya target tertulis, jadi sulit menilai apakah sebulan kerja berhasil.",
      dilakukan: "Saya menyusun target bulanan bersama tim, membuat laporan mingguan sederhana, dan meninjau hasil tiap akhir bulan.",
      hasil: ["Sebagian target tercapai di bulan pertama; yang meleset jadi fokus bulan berikutnya."],
      statistik: [{ b: "12", t: "reels per bulan" }, { b: "4,1%", t: "tingkat interaksi" }, { b: "5", t: "anggota tim" }],
      bagian: [{ t: "Penyusunan target", p: "sendiri" }, { t: "Laporan mingguan", p: "pimpin" }, { t: "Produksi konten", p: "tim" }],
      pelajaran: "Target yang meleset tetap berguna kalau dilaporkan dengan jujur."
    },
    {
      id: "aplikasi-laporan", label: "Aplikasi persetujuan", objek: "img/objek/laptop.webp",
      judul: "Persetujuan dengan {jejak yang jelas}", sampul: "img/karya/aplikasi-laporan.svg",
      klien: "Studio Larik", peran: "Perancang alur", tahun: "2026", tag: ["Alur kerja", "Desain antarmuka"],
      ringkas: "Aplikasi internal sederhana agar setiap pengajuan punya jejak persetujuan.",
      tantangan: "Pengajuan dana tercecer di grup chat.", dilakukan: "Saya merancang alur pengajuan tiga langkah dan menguji dengan tim.",
      hasil: ["Semua pengajuan kini tercatat di satu tempat."], statistik: [{ b: "3", t: "langkah persetujuan" }],
      bagian: [{ t: "Rancangan alur", p: "sendiri" }, { t: "Pengembangan", p: "tim" }], pelajaran: "Alur yang sederhana lebih mungkin dipakai."
    },
    {
      id: "sistem-info", label: "Sistem info mahasiswa baru", objek: "img/objek/gradcap.webp",
      judul: "Satu sistem informasi untuk {3.000 mahasiswa baru}", sampul: "img/karya/sistem-info.svg",
      klien: "Universitas Contoh", peran: "Koordinator", tahun: "2023", tag: ["Koordinasi", "Situs web"],
      ringkas: "Situs, chatbot, dan kelas daring untuk masa orientasi kampus.",
      tantangan: "Informasi orientasi tersebar di banyak kanal.", dilakukan: "Saya mengoordinasi tim pembuat situs, chatbot, dan kelas daring.",
      hasil: ["Satu pintu informasi untuk seluruh mahasiswa baru."], statistik: [{ b: "3.000+", t: "mahasiswa baru" }, { b: "60", t: "pendamping" }],
      bagian: [{ t: "Koordinasi tim", p: "pimpin" }], pelajaran: "Satu pintu informasi mengurangi pertanyaan berulang."
    },
    {
      id: "genomik", label: "Magang riset", objek: "img/objek/dna.webp",
      judul: "Satu musim {magang riset}", sampul: "img/karya/genomik.svg",
      klien: "Universitas Selatan", peran: "Peserta magang", tahun: "2024", tag: ["Riset", "Analisis data"],
      ringkas: "Program magang riset musim panas di universitas mitra.",
      tantangan: "Mempelajari metode baru dalam waktu singkat.", dilakukan: "Saya membantu analisis data dan menyusun ringkasan mingguan.",
      hasil: ["Ringkasan akhir dipresentasikan ke tim."], statistik: [{ b: "8", t: "minggu program" }],
      bagian: [{ t: "Analisis data", p: "tim" }], pelajaran: "Bertanya lebih awal menghemat waktu."
    },
    {
      id: "video-edukasi", label: "Video edukasi", objek: "img/objek/clapperboard.webp",
      judul: "Studio kecil, {empat klien, empat brief}", sampul: "img/karya/video-edukasi.svg",
      klien: "Rumah Cerita Data", peran: "Pendiri", tahun: "2025–kini", tag: ["Produksi video", "Manajemen klien"],
      ringkas: "Studio kecil yang membuat video edukasi untuk empat klien berbeda.",
      tantangan: "Setiap klien punya kebutuhan dan gaya berbeda.", dilakukan: "Saya menyusun brief tetap dan jadwal produksi per klien.",
      hasil: ["Empat proyek selesai tanpa revisi besar."], statistik: [{ b: "4", t: "klien" }],
      bagian: [{ t: "Brief dan jadwal", p: "sendiri" }, { t: "Produksi", p: "tim" }], pelajaran: "Brief yang jelas memangkas revisi."
    }
  ],

  // ---------- Angka ----------
  judulAngka: "Angka yang {bisa dibuktikan}",
  ketAngka: "Setiap angka bisa ditelusuri ke kontrak, laporan, atau unggahan publik. Silakan tanyakan.",
  angka: [
    { nilai: "Rp150 jt+", satuan: "kontrak", ket: "Nilai kontrak klien sejak 2025 (contoh): pemerintah kota, program CSR, dan klien swasta.", sumber: "Kontrak tersimpan", sumberKet: "2025–2026" },
    { nilai: "3.000+", satuan: "mahasiswa", ket: "Mahasiswa baru yang dilayani sistem informasi orientasi yang saya koordinasi.", sumber: "Orientasi kampus 2023", sumberKet: "Koordinator sistem informasi" }
  ],

  // ---------- Cara kerja ----------
  judulCara: "Dari brief {sampai laporan}",
  cara: [
    { judul: "Ukur", ket: "Tetapkan target dulu: target bulanan, pipeline kreator, atau hasil uji laboratorium.", objek: "img/objek/cylinder.webp" },
    { judul: "Buat", ket: "Video, desain, kampanye, dan alat internal, dibuat bersama tim dan dicek terhadap brief.", objek: "img/objek/swatches.webp" },
    { judul: "Laporkan", ket: "Laporan mingguan dan bulanan terhadap target, termasuk yang meleset, beserta target bulan depan.", objek: "img/objek/report.webp" }
  ],

  // ---------- Tentang ----------
  judulTentang: "Dari laboratorium {ke pekerjaan klien}",
  tentang: [
    "Saya belajar teknologi pangan di Universitas Contoh. Pada 2022–2024 saya magang riset di Lembaga Riset Nusa, lalu satu musim di Universitas Selatan.",
    "Sejak 2025 saya membangun Rumah Cerita Data, studio video edukasi kecil. Sejak 2026 saya juga memimpin tim kreatif di Studio Larik."
  ],
  pengalaman: [
    { peran: "Kepala Tim Kreatif", tempat: "Studio Larik", mulai: "2026", selesai: "Kini" },
    { peran: "Pendiri", tempat: "Rumah Cerita Data", mulai: "2025", selesai: "Kini" },
    { peran: "Peserta Magang Riset", tempat: "Universitas Selatan", mulai: "2024", selesai: "" },
    { peran: "Asisten Peneliti", tempat: "Lembaga Riset Nusa", mulai: "2022", selesai: "2024" }
  ],

  // ---------- Ajakan ----------
  judulAjak: "Punya ide? {Yuk ngobrol!}",
  ketAjak: "Email paling cepat sampai ke saya. LinkedIn juga boleh.",
  tombolAjak: "Hubungi saya"
};
