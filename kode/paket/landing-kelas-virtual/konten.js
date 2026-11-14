/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/*
  KONTEN — SATU-SATUNYA berkas yang perlu kamu ubah untuk jualan kelasmu.
  Semua teks, harga, link Lynk, link WhatsApp, dan warna ada di sini.
  Tidak ada pembayaran di halaman ini: semua tombol beli menuju linkBeli (halaman Lynk-mu).
  Semua isi di bawah adalah CONTOH FIKTIF.
*/
window.KONTEN = {
  // ===== Link utama =====
  linkBeli: "https://lynk.id/username-kamu/kelas-canva",          // ganti dengan link produk Lynk-mu
  waNomor: "6281200000000",                                         // format 62xxx, tanpa + dan spasi
  waPesan: "Halo kak, saya mau tanya soal Kelas Canva untuk Jualan Online.",

  // ===== Warna (null = pakai tema.css). Contoh: utama: "#0f5e57" =====
  warna: { utama: null, aksen: null },

  // ===== Identitas =====
  merek: "Kelas Rapi",                                              // nama di header (kalau kosong, pakai TEMA.nama)
  judulHalaman: "Kelas Canva untuk Jualan Online",

  // ===== Hero =====
  hero: {
    label: "Kelas virtual · Akses selamanya",
    judul: "Desain konten jualan yang bikin orang berhenti scroll.",
    sorot: "berhenti scroll",                                       // potongan judul yang diberi sorotan
    subjudul: "Kelas Canva untuk Jualan Online: 6 modul video, 40+ template siap pakai, dan grup diskusi. Dari nol sampai feed tokomu kelihatan profesional dalam 14 hari.",
    statistik: [["6", "modul video"], ["4,5 jam", "materi padat"], ["40+", "template Canva"]]
  },

  // ===== Harga =====
  harga: {
    coret: 349000,
    jual: 149000,
    catatan: "Sekali bayar · akses selamanya · update gratis",
    tombol: "Beli kelas sekarang",
    tombolPendek: "Beli sekarang"
  },

  // ===== Countdown promo (opsional). Isi tanggal ISO atau null untuk menyembunyikan =====
  // "otomatis-3hari" = selalu 3 hari dari kunjungan pertama pengunjung (disimpan di browser).
  promo: { selesai: "otomatis-3hari", teks: "Harga promo berakhir dalam" },

  // ===== Untuk siapa =====
  untukSiapa: {
    judul: "Kelas ini cocok untukmu kalau…",
    cocok: [
      "Kamu jualan online (IG, TikTok Shop, Shopee, WA) dan desainmu masih seadanya.",
      "Kamu pakai Canva tapi hasilnya terasa \"template banget\".",
      "Kamu tidak punya budget bayar desainer tiap minggu.",
      "Kamu mau konsisten posting tanpa pusing mikir desain dari nol."
    ],
    tidak: [
      "Kamu mencari kursus desain grafis profesional (Illustrator/Photoshop).",
      "Kamu berharap laris tanpa mau praktik sama sekali."
    ]
  },

  // ===== Kurikulum =====
  kurikulum: {
    judul: "Yang akan kamu pelajari",
    sub: "Urut, praktis, dan bisa langsung dipakai untuk tokomu.",
    modul: [
      { judul: "Fondasi: kenalan dengan Canva yang benar", durasi: "35 menit", materi: ["Atur akun & folder brand", "Ukuran wajib tiap platform", "Shortcut yang hemat waktu 2x"] },
      { judul: "Identitas visual toko dalam 1 jam", durasi: "50 menit", materi: ["Memilih 2 warna & 2 font", "Membuat Brand Kit gratis", "Logo teks sederhana yang rapi"] },
      { judul: "Foto produk pakai HP jadi kinclong", durasi: "45 menit", materi: ["Hapus latar & bayangan alami", "Mockup produk tanpa studio", "Konsistensi gaya foto"] },
      { judul: "Feed & carousel yang menjual", durasi: "55 menit", materi: ["Rumus hierarki teks", "Carousel edukasi → jualan", "Testimoni jadi konten"] },
      { judul: "Video pendek & story promo", durasi: "40 menit", materi: ["Animasi teks yang tidak norak", "Template Reels 15 detik", "Story countdown & polling"] },
      { judul: "Sistem konten 30 hari", durasi: "45 menit", materi: ["Kalender konten siap isi", "Batching 1 hari = 2 minggu konten", "Evaluasi dari insight"] }
    ]
  },

  // ===== Bonus =====
  bonus: {
    judul: "Bonus untuk pembeli",
    item: [
      { judul: "40+ template Canva", nilai: 199000, isi: "Feed, carousel, story, dan katalog. Tinggal ganti foto & teks." },
      { judul: "Kalender konten 30 hari", nilai: 79000, isi: "Ide posting harian untuk toko online, lengkap dengan contoh caption." },
      { judul: "Grup diskusi & review desain", nilai: 149000, isi: "Kirim desainmu, dapat masukan dari mentor tiap minggu." }
    ]
  },

  // ===== Mentor =====
  mentor: {
    nama: "Nadia Pramesti",
    peran: "Desainer konten & pemilik toko online (contoh fiktif)",
    bio: "Sudah 6 tahun mengurus desain untuk brand lokal dan tokonya sendiri. Percaya bahwa desain yang bagus itu bukan soal bakat, tapi soal sistem yang bisa diulang.",
    poin: [["120+", "brand lokal dibantu"], ["6 thn", "pengalaman"], ["2.300+", "alumni kelas"]]
  },

  // ===== Testimoni (CONTOH FIKTIF, ganti dengan testimoni asli pembelimu) =====
  testimoni: {
    judul: "Kata mereka yang sudah ikut",
    item: [
      { nama: "Rina A.", usaha: "Toko hijab, Bandung", isi: "Dulu satu desain bisa sejam. Sekarang 10 menit selesai dan feed-ku kelihatan satu warna." },
      { nama: "Dimas P.", usaha: "Kopi literan, Malang", isi: "Modul carousel paling kepake. Minggu pertama langsung ada yang tanya harga lewat DM." },
      { nama: "Sari W.", usaha: "Skincare reseller, Medan", isi: "Template bonusnya saja sudah sepadan. Penjelasannya pelan dan gampang diikuti." }
    ]
  },

  // ===== Jaminan =====
  jaminan: {
    judul: "Jaminan 7 hari uang kembali",
    isi: "Tonton modulnya, praktikkan. Kalau dalam 7 hari kamu merasa kelas ini tidak membantu, chat kami dan dana kembali penuh. Tanpa drama."
  },

  // ===== FAQ =====
  faq: [
    { t: "Kelasnya live atau rekaman?", j: "Rekaman video yang bisa ditonton kapan saja, ditambah sesi tanya jawab live di grup setiap bulan." },
    { t: "Harus pakai Canva Pro?", j: "Tidak. Semua materi bisa dipraktikkan dengan Canva gratis. Fitur Pro hanya disebut sebagai opsi." },
    { t: "Bisa belajar dari HP?", j: "Bisa. Video bisa ditonton di HP dan semua praktik bisa dilakukan di aplikasi Canva HP." },
    { t: "Bagaimana cara beli dan mengakses kelas?", j: "Klik tombol beli, kamu akan diarahkan ke halaman Lynk. Setelah pembayaran, link akses dikirim otomatis ke email." },
    { t: "Berapa lama aksesnya?", j: "Selamanya, termasuk update materi di masa depan." }
  ],

  // ===== Penutup =====
  penutup: {
    judul: "Mulai rapikan desain tokomu hari ini.",
    isi: "Satu kali bayar, dipakai seterusnya. Kalau masih ragu, tanya dulu lewat WhatsApp."
  },

  // ===== SEO / kartu bagikan (juga ubah meta og di index.html) =====
  deskripsi: "Kelas Canva untuk Jualan Online: 6 modul video, 40+ template, grup diskusi. Desain konten jualan yang rapi dalam 14 hari."
};
