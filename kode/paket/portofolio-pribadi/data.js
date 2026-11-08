/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/*
  DATA PORTOFOLIO — SATU-SATUNYA berkas yang perlu Anda ubah untuk mengganti isi.
  Aturan: teks di antara tanda kutip "..." boleh diganti bebas. Jangan hapus koma di akhir baris.
  Nama di judul halaman diambil dari tema.js (TEMA.nama).
*/
window.DATA = {
  peran: "Desainer Produk & Ilustrator",
  kota: "Yogyakarta, Indonesia",
  status: "Terbuka untuk proyek Desember 2026",
  judulBesar: ["Merancang", "hal-hal", "yang terasa", "manusiawi."],
  ringkas: "Saya membantu startup dan UMKM membuat produk digital yang jelas, hangat, dan mudah dipakai — dari riset sampai piksel terakhir.",
  foto: "img/potret.svg",           // ganti dengan "img/foto-saya.jpg"
  cv: "cv.html",                     // CV otomatis dari data ini (bisa disimpan PDF). Atau taruh "cv-saya.pdf" di folder ini
  email: "halo@contoh.id",
  wa: "6281234567890",              // format 62..., tanpa + dan spasi
  sosial: [
    { nama: "Instagram", url: "https://instagram.com/" },
    { nama: "LinkedIn", url: "https://linkedin.com/" },
    { nama: "Dribbble", url: "https://dribbble.com/" },
    { nama: "GitHub", url: "https://github.com/" }
  ],
  angka: [
    { nilai: 6, akhiran: "+", label: "tahun berkarya" },
    { nilai: 48, akhiran: "", label: "proyek selesai" },
    { nilai: 31, akhiran: "", label: "klien senang" }
  ],
  tentang: [
    "Saya Nadia, desainer yang tumbuh di antara batik, kopi, dan kode. Lulus DKV tahun 2019, lalu jatuh cinta pada desain produk saat membangun aplikasi kasir untuk warung ibu saya.",
    "Sekarang saya bekerja lepas dengan tim di Jakarta, Bandung, dan Singapura. Saya percaya desain yang baik itu sederhana: orang paham tanpa perlu diajari."
  ],
  keahlian: [
    { nama: "Desain UI/UX", level: 95 },
    { nama: "Riset Pengguna", level: 85 },
    { nama: "Design System", level: 90 },
    { nama: "Ilustrasi", level: 80 },
    { nama: "Prototipe (Figma)", level: 92 },
    { nama: "HTML & CSS", level: 70 }
  ],
  alat: ["Figma", "Framer", "Illustrator", "Procreate", "Notion", "Maze", "VS Code", "Webflow"],
  // kategori bebas; tombol filter dibuat otomatis dari kategori yang ada
  karya: [
    { judul: "Pasarku", kategori: "Aplikasi", tahun: 2026, warna: "#b4441e", bentuk: "hp",
      ringkas: "Aplikasi belanja pasar tradisional dengan ongkir per kelurahan.",
      peran: "Lead Designer", klien: "Pasarku.id", durasi: "4 bulan",
      cerita: "Pedagang pasar sulit masuk ke marketplace besar. Kami merancang alur pesan-antar yang bisa dipakai pedagang lewat WhatsApp, sementara pembeli memesan lewat aplikasi.",
      hasil: ["Pesanan naik 3,2× dalam 3 bulan", "Waktu checkout turun dari 4 menit ke 70 detik", "Rating Play Store 4,8"],
      tautan: "" },
    { judul: "Kopi Lereng", kategori: "Branding", tahun: 2025, warna: "#2f5d4e", bentuk: "logo",
      ringkas: "Identitas visual kedai kopi petani Merapi.",
      peran: "Brand Designer", klien: "Kopi Lereng", durasi: "6 minggu",
      cerita: "Logo, kemasan, dan papan menu yang bercerita tentang petani di lereng gunung. Warna diambil dari tanah vulkanik dan daun kopi.",
      hasil: ["Dipakai di 3 cabang", "Kemasan masuk 2 ritel oleh-oleh"], tautan: "" },
    { judul: "SiswaKu Dashboard", kategori: "Web", tahun: 2025, warna: "#3b4a8c", bentuk: "web",
      ringkas: "Dasbor nilai & presensi untuk 120 sekolah.",
      peran: "Product Designer", klien: "Dinas Pendidikan (fiktif)", durasi: "5 bulan",
      cerita: "Guru menghabiskan banyak waktu merekap nilai. Dasbor ini menyatukan presensi, nilai, dan rapor dalam satu layar yang bisa dicetak.",
      hasil: ["Rekap rapor 80% lebih cepat", "Dipakai 3.400 guru"], tautan: "" },
    { judul: "Seri Ilustrasi Rempah", kategori: "Ilustrasi", tahun: 2024, warna: "#c08a1e", bentuk: "ilus",
      ringkas: "12 ilustrasi rempah Nusantara untuk kalender.",
      peran: "Ilustrator", klien: "Proyek pribadi", durasi: "3 bulan",
      cerita: "Eksplorasi gaya guratan tangan digital: kunyit, cengkih, pala, dan kawan-kawan, lengkap dengan cerita asal-usulnya.",
      hasil: ["Terjual 900 eksemplar kalender", "Pameran di Jogja Art Week"], tautan: "" },
    { judul: "Dompet Santri", kategori: "Aplikasi", tahun: 2024, warna: "#5b3f8c", bentuk: "hp",
      ringkas: "Uang saku santri yang bisa dipantau orang tua.",
      peran: "UX Designer", klien: "Yayasan (fiktif)", durasi: "3 bulan",
      cerita: "Orang tua bisa mengirim uang saku dan melihat jajan anak. Fokus desain: angka besar, bahasa sederhana, aman.",
      hasil: ["1.200 santri aktif", "Keluhan uang hilang turun drastis"], tautan: "" },
    { judul: "Batik Laras", kategori: "Web", tahun: 2023, warna: "#7a3b23", bentuk: "web",
      ringkas: "Toko daring batik tulis dengan cerita pengrajin.",
      peran: "Designer & Front-end", klien: "Batik Laras", durasi: "2 bulan",
      cerita: "Setiap kain punya halaman cerita pengrajinnya. Situs dibuat ringan agar cepat dibuka di HP pembeli daerah.",
      hasil: ["Konversi 2,4%", "Skor Lighthouse 98"], tautan: "" }
  ],
  pengalaman: [
    { tahun: "2023 — sekarang", posisi: "Desainer Produk Lepas", tempat: "Mandiri", ket: "Mendampingi 20+ startup & UMKM dari riset sampai peluncuran." },
    { tahun: "2021 — 2023", posisi: "Senior UI Designer", tempat: "Studio Rakit (fiktif)", ket: "Memimpin design system untuk 4 produk fintech." },
    { tahun: "2019 — 2021", posisi: "UI Designer", tempat: "Agensi Lintas (fiktif)", ket: "Merancang situs & aplikasi untuk klien ritel dan pendidikan." },
    { tahun: "2015 — 2019", posisi: "S1 Desain Komunikasi Visual", tempat: "Universitas di Yogyakarta", ket: "Tugas akhir: aplikasi kasir untuk warung keluarga." }
  ],
  testimoni: [
    { isi: "Nadia mengubah ide kami yang berantakan jadi aplikasi yang langsung dipahami pedagang pasar. Prosesnya rapi dan komunikatif.", nama: "Rizky Pratama", jabatan: "Pendiri Pasarku" },
    { isi: "Identitas Kopi Lereng terasa hangat dan jujur. Pelanggan sering memotret kemasannya.", nama: "Sekar Ayu", jabatan: "Pemilik Kopi Lereng" },
    { isi: "Guru-guru kami yang gaptek pun bisa memakai dasbornya tanpa pelatihan panjang.", nama: "Budi Santoso", jabatan: "Kepala Sekolah" }
  ],
  layanan: [
    { judul: "Desain Aplikasi & Web", ket: "Alur, wireframe, UI final, dan prototipe siap uji.", harga: "mulai Rp7,5 jt" },
    { judul: "Branding & Logo", ket: "Logo, palet, tipografi, dan panduan merek singkat.", harga: "mulai Rp4 jt" },
    { judul: "Design System", ket: "Komponen Figma rapi + dokumentasi untuk tim developer.", harga: "mulai Rp12 jt" },
    { judul: "Ilustrasi Kustom", ket: "Ilustrasi untuk situs, kemasan, atau kampanye.", harga: "mulai Rp750 rb/gambar" }
  ]
};
