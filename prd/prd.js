/* kredit-maliki: Pembuat PRD oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id
   Aturan isi PRD dari riset: ISO/IEC/IEEE 29148, EARS (Mavin 2009), Lucassen 2016, Femmer 2017,
   FollowBench (ACL 2024), CodeHalu (AAAI 2025). Alur form: Peytchev 2006, Seckler CHI 2014. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const SIMPAN = "ms-prd-v1";
  const SB = "https://qsoejsauqlfkchxtnumm.supabase.co", KEY = "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW";

  const JENIS = {
    website: { nama: "Website", ik: "</>", ket: "Landing page, company profile, portofolio, toko sederhana.",
      label: "Bagian halaman", kolom: ["Bagian", "Isi wajib", "Teks persis"], ph: ["Hero", "Judul, sub-judul, tombol WhatsApp", "\"Cerita brand kamu, dibuat terlihat.\""],
      tata: ["Hero terbelah: teks kiri, visual kanan", "Judul raksasa di tengah, visual di bawah", "Grid bento: kartu berbagai ukuran", "Bagian berselang-seling kiri-kanan"],
      teknisPh: "HTML/CSS/JS biasa tanpa framework, bisa dibuka dengan klik dua kali. Rapi di HP 375 px dan laptop.",
      kriteria: ["Ketika halaman dibuka di HP lebar 375 px, maka tidak ada scroll ke samping dan tidak ada teks terpotong.",
        "Ketika semua bagian di tabel struktur dicek, maka semuanya ada, berurutan, dan isinya sesuai.",
        "Ketika halaman dibuka di browser, maka tidak ada error di Console."],
      langkah: ["Baca seluruh PRD. Bila ada [ISI: …] atau yang tidak jelas, tanyakan dulu ke saya. Jangan menebak.",
        "Tulis rencana singkat: daftar file dan urutan bagian.",
        "Buat halaman per bagian sesuai tabel struktur, dari atas ke bawah.",
        "Cek setiap kriteria selesai satu per satu, perbaiki yang belum lolos.",
        "Kirim semua file secara utuh, lalu daftar kriteria yang sudah lolos."] },
    reels: { nama: "Reels / video", ik: "▶", ket: "Video vertikal 9:16 untuk TikTok, Reels, Shorts.",
      tata: ["Teks raksasa di tengah layar", "Kolase berlapis (objek di depan judul)", "Layar terbelah atas-bawah", "Kartu bergantian dari samping"],
      label: "Adegan", kolom: ["Waktu", "Di layar", "Teks / narasi"], ph: ["0–3 dtk", "Hook besar di tengah", "\"6 karyawan. Semuanya AI.\""],
      teknisPh: "1080×1920, 30 fps, durasi 30 detik. Dibuat dengan Remotion / CapCut / After Effects.",
      kriteria: ["Ketika video diputar, maka setiap adegan muncul di detik yang tertulis di tabel adegan.",
        "Ketika frame mana pun dilihat, maka teks penting berada di area aman (tidak tertutup tombol aplikasi) dan tidak terpotong.",
        "Ketika render selesai, maka file video ada dan durasinya sesuai PRD."],
      langkah: ["Baca seluruh PRD. Bila ada [ISI: …] atau yang tidak jelas, tanyakan dulu ke saya. Jangan menebak.",
        "Buat adegan satu per satu sesuai tabel, dengan waktu yang persis.",
        "Buat satu gambar pratinjau (still) dan cek: tidak ada teks terpotong.",
        "Render video penuh.",
        "Pastikan file video ada, baru katakan selesai. Jangan berhenti di tengah."] },
    deck: { nama: "Deck presentasi", ik: "▤", ket: "Slide pitching, laporan, materi kelas.",
      label: "Slide", kolom: ["Slide", "Isi pokok", "Teks persis"], ph: ["Masalah", "3 poin masalah pelanggan", "\"Kafe sulit dapat biji segar tiap minggu.\""],
      tata: ["Judul besar + satu visual per slide", "Dua kolom: teks kiri, visual kanan", "Satu angka/poin raksasa per slide", "Grid kartu 2×2"],
      teknisPh: "16:9, maksimal 12 slide, satu pesan utama per slide. Format: Google Slides / PowerPoint / HTML.",
      kriteria: ["Ketika deck dibuka, maka jumlah dan urutan slide sama dengan tabel.",
        "Ketika satu slide dibaca, maka ada satu pesan utama dan teks tidak lebih dari 6 baris.",
        "Ketika angka atau data muncul, maka sumbernya ada di bagian Fakta yang boleh dipakai."],
      langkah: ["Baca seluruh PRD. Bila ada [ISI: …] atau yang tidak jelas, tanyakan dulu ke saya. Jangan menebak.",
        "Tulis kerangka judul tiap slide dulu, tunggu persetujuan bila diminta.",
        "Isi slide satu per satu sesuai tabel.",
        "Cek setiap kriteria selesai, perbaiki yang belum lolos.",
        "Kirim hasil lengkap."] },
    app: { nama: "Aplikasi kecil", ik: "⚙", ket: "Kasir, invoice, absensi, catatan keuangan, tracker.",
      label: "Fitur / layar", kolom: ["Fitur", "Yang bisa dilakukan pengguna", "Teks persis"], ph: ["Buat invoice", "Isi nama klien, item, harga; total otomatis", "Tombol: \"Simpan invoice\""],
      tata: ["Satu kolom, tombol besar di bawah (ramah jempol)", "Sidebar kiri + area kerja", "Tab bawah seperti aplikasi HP", "Kartu-kartu di dasbor"],
      teknisPh: "Satu file HTML/CSS/JS tanpa server, data disimpan di localStorage, bisa dipakai offline.",
      kriteria: ["Ketika pengguna menjalankan setiap fitur di tabel, maka fitur itu bekerja tanpa error di Console.",
        "Ketika halaman dimuat ulang, maka data yang sudah dimasukkan tetap ada.",
        "Ketika dibuka di HP lebar 375 px, maka semua tombol bisa ditekan dan tidak ada yang terpotong."],
      langkah: ["Baca seluruh PRD. Bila ada [ISI: …] atau yang tidak jelas, tanyakan dulu ke saya. Jangan menebak.",
        "Tulis rencana singkat: daftar file, struktur data, dan daftar fitur.",
        "Bangun fitur satu per satu sesuai tabel; uji tiap fitur sebelum lanjut.",
        "Cek setiap kriteria selesai, perbaiki yang belum lolos.",
        "Kirim semua file secara utuh dan cara menjalankannya."] },
  };

  const LARANGAN = [
    ["angka", "Jangan menambah angka (jumlah klien, tahun, rating, statistik) yang tidak tertulis di PRD."],
    ["harga", "Jangan menulis harga atau promo yang tidak tertulis di PRD."],
    ["testi", "Jangan membuat testimoni, ulasan, atau logo klien."],
    ["janji", "Jangan menambah janji atau garansi (\"24 jam\", \"pasti laku\")."],
    ["nama", "Jangan mengarang nama orang, alamat, atau kontak."],
    ["stok", "Jangan memakai foto atau gambar dari internet; pakai tanda tempat [GAMBAR: …]."],
    ["lingkup", "Jangan menambah fitur atau bagian di luar lingkup."],
  ];
  const BAWAAN_LAR = ["angka", "harga", "testi", "janji", "lingkup"];

  const SAMAR = ["bagus", "modern", "menarik", "keren", "elegan", "elegant", "profesional", "simpel", "simple", "user friendly", "user-friendly", "cepat", "mudah", "kekinian", "estetik", "aesthetic", "premium", "clean", "minimalis", "intuitif", "responsif", "canggih", "optimal", "maksimal", "dll", "dan lain-lain", "secukupnya", "sebaiknya"];

  const NUANSA = {
    editorial: ["Editorial", "tipografi besar, banyak ruang kosong, garis tipis pemisah, kesan majalah"],
    berani: ["Berani", "kontras tinggi, blok warna penuh, judul sangat besar, sudut tegas"],
    hangat: ["Hangat", "sudut membulat 16–24 px, warna lembut, ikon garis ramah, bayangan halus"],
    teknis: ["Teknis", "grid terlihat, label huruf mono kecil, detail presisi, garis 1 px"],
    mewah: ["Mewah", "palet gelap/netral, judul serif, jarak lega, aksen tipis satu warna"],
  };
  const TIPO = {
    raksasa: ["Judul raksasa", "judul utama minimal 64 px di laptop dan 40 px di HP, tebal, jarak huruf rapat (-0.02em)"],
    serif: ["Serif + sans", "judul pakai font serif, isi pakai sans-serif; maksimal 2 keluarga font"],
    rapi: ["Sedang & rapi", "skala ukuran jelas (48/32/20/16 px), isi 16–18 px, tinggi baris 1.5"],
    mono: ["Label mono", "label kecil, nomor, dan tag pakai font mono huruf kecil"],
  };
  const ANIM = {
    masuk: ["Muncul saat digulir", "elemen muncul (fade + naik 16 px, 400–600 ms) saat masuk layar, pakai IntersectionObserver"],
    stagger: ["Berurutan", "elemen dalam satu grup muncul berurutan dengan jeda 60–100 ms"],
    hover: ["Hover hidup", "kartu & tombol terangkat 2–4 px dengan bayangan saat disentuh kursor (200 ms)"],
    judul: ["Judul per kata", "judul utama muncul per kata saat halaman dibuka"],
    parallax: ["Parallax ringan", "visual latar bergerak lebih lambat dari isi saat digulir (maks. 40 px)"],
  };

  const POLA = {
    pos: { nama: "Kasir / POS", gaya: {
      terang: ["Modern terang", "3 kolom: rel ikon kategori di kiri, grid kartu produk bergambar (radius 16 px, tombol + bulat) di tengah, panel pesanan putih di kanan dengan stepper −/+, sakelar Makan di sini / Bawa pulang, tombol Bayar lebar di bawah; latar abu sangat terang + satu warna aksen"],
      gelap: ["Gelap premium", "latar arang, kartu produk gelap dengan foto besar dan nama tebal, aksen karamel/emas, panel pesanan kanan dengan total besar huruf mono, tombol Bayar penuh warna aksen"],
      hangat: ["Hangat ramah", "kartu krem membulat besar, ikon kategori berwarna pastel, total pesanan di kartu menonjol, tombol besar ramah jempol (min. 48 px)"] } },
    katalog: { nama: "Katalog toko", gaya: {
      terang: ["Modern terang", "banner promo besar di atas, pil kategori yang bisa digeser, grid kartu putih dengan gambar besar di latar tint, harga tebal, tombol + bulat, keranjang di laci dengan stepper −/+; latar netral + satu aksen"],
      gelap: ["Gelap premium", "banner gelap dengan tipografi besar, kartu produk tanpa garis tepi di atas latar gelap, harga warna aksen, tombol hitam/emas membulat"],
      editorial: ["Editorial", "judul serif besar, grid produk asimetris (satu produk besar + dua kecil), banyak ruang kosong, garis tipis pemisah, label kecil huruf mono"] } },
    sekolah: { nama: "Sekolah / yayasan", gaya: {
      terang: ["Ceria terang", "hero terbelah: teks kiri, foto/ilustrasi dalam bentuk bulat atau blob kanan dengan kartu kecil melayang (mis. jadwal), baris statistik dari data asli, kartu program pastel berikon, blok ajakan daftar warna gelap"],
      tenang: ["Tenang religius", "warna hijau tua + krem, ornamen geometris tipis, judul serif, kartu jadwal & kegiatan dengan sudut lembut, banyak ruang kosong"],
      editorial: ["Editorial", "judul raksasa, foto lebar penuh, bagian berselang-seling kiri-kanan, angka & label huruf mono"] } },
    landing: { nama: "Landing jasa/wisata", gaya: {
      terang: ["Modern terang", "hero terbelah dengan foto besar, kartu layanan bervariasi (satu besar, dua kecil), baris langkah bernomor, CTA WhatsApp mengambang"],
      gelap: ["Gelap sinematik", "hero foto penuh layar dengan lapisan gelap, judul raksasa putih, kartu kaca buram, aksen satu warna terang"],
      editorial: ["Editorial", "tipografi besar, grid majalah, garis tipis, foto berbingkai, banyak ruang kosong"] } },
    dashboard: { nama: "Dashboard / manajemen", gaya: {
      terang: ["Modern terang", "sidebar ikon kiri, kartu ringkasan angka di atas (data asli), tabel bersih berbaris lega dengan pil status berwarna, tombol utama satu warna aksen"],
      gelap: ["Gelap premium", "latar navy/arang, kartu panel dengan garis 1 px, angka besar huruf mono, grafik garis tipis, aksen cyan atau hijau"],
      hangat: ["Hangat ramah HP", "tab bawah seperti aplikasi HP, kartu besar membulat, ikon garis, tombol tambah mengambang"] } },
    reels: { nama: "Video reels", gaya: {
      berani: ["Berani neon", "tipografi raksasa, blok warna neon miring di belakang kata kunci, nomor langkah raksasa di latar warna penuh, stiker label, transisi cepat"],
      bersih: ["Bersih premium", "latar gelap gradasi kabur, kartu membulat besar/mockup UI di tengah, teks putih tebal, satu aksen"],
      kolase: ["Kolase kertas", "kertas sobek, objek bertepi putih + halftone, judul serif di belakang objek, anotasi tangan"] } },
    kantor3d: { nama: "Kantor 3D", gaya: {
      kaca: ["Dashboard kaca", "bar atas kaca (logo, jam, LIVE, tombol gaya), panel agen ringkas di kiri yang bisa diciutkan, laci laporan di kanan; panel tidak boleh menutupi lebih dari 25% kantor 3D"],
      lembut: ["Lembut lavender", "palet biru-lavender lembut, label kecil di atas karakter, ikon status berwarna, panel mengambang kecil di sudut"],
      minimal: ["Minimal", "hampir tanpa panel: hanya pil status di bawah dan tombol laporan; kantor 3D jadi pusat perhatian"] } },
    app: { nama: "Aplikasi", gaya: {
      terang: ["Modern terang", "kartu putih radius 16 px di atas latar abu terang, tombol utama satu warna aksen, ikon garis, jarak lega"],
      gelap: ["Gelap premium", "latar arang, panel bergaris 1 px, angka huruf mono, aksen terang tunggal"] } },
    website: { nama: "Website", gaya: {
      terang: ["Modern terang", "hero terbelah, kartu bervariasi, banyak ruang kosong, satu aksen"],
      editorial: ["Editorial", "judul raksasa, grid majalah, garis tipis, label mono"] } },
  };
  const polaAktif = () => POLA[(PRF() && PRF().pola) || (S.jenis === "reels" ? "reels" : S.jenis === "app" ? "app" : "website")] || POLA.website;

  const LANGKAH = [
    { id: "jenis", l: "Jenis proyek" },
    { id: "tujuan", l: "Ringkasan & tujuan" },
    { id: "pengguna", l: "Pengguna" },
    { id: "struktur", l: "Struktur" },
    { id: "desain", l: "Arah desain" },
    { id: "lingkup", l: "Lingkup & teknis" },
    { id: "larangan", l: "Fakta & larangan" },
  ];

  const kosong = () => ({ jenis: "", nama: "", ringkas: "", tujuan: "", ukuran: "", pengguna: "", baris: [], masuk: "", keluar: "", teknis: "", gaya: "", nuansa: "", tata: "", tipo: "", animasi: ["masuk", "hover"], acuan: "", signature: "", pola: "", pertahankan: "", template: "", fakta: "", larangan: [...BAWAAN_LAR], larLain: "" });
  let S = kosong(), aktif = 0;
  try { const t = JSON.parse(localStorage.getItem(SIMPAN)); if (t && typeof t === "object") { S = { ...S, ...t.s }; aktif = Math.min(t.a | 0, LANGKAH.length - 1); } } catch (_) {}
  const simpan = () => { try { localStorage.setItem(SIMPAN, JSON.stringify({ s: S, a: aktif })); } catch (_) {} };

  const CONTOH = {
    website: { nama: "Kilau Kreatif", ringkas: "Website satu halaman untuk agensi kreatif di Bogor. Calon klien paham layanan dalam 30 detik, lalu menghubungi lewat WhatsApp.",
      tujuan: "Pengunjung paham apa yang dijual\nPengunjung bisa menghubungi\nRapi di HP & laptop",
      ukuran: "Hero menyebut 3 layanan dalam satu kalimat; tiap layanan punya kartu\nTombol WhatsApp ada di hero, kontak, dan tombol mengambang di HP\nTidak ada scroll ke samping di lebar 375 px",
      pengguna: "Staf humas instansi: butuh dokumentasi acara, buka dari HP saat rapat\nHR perusahaan: butuh video profil, buka dari laptop kantor\nPemilik UMKM: butuh foto produk, buka dari HP",
      baris: [["Header lengket", "Nama, menu Layanan · Cara Kerja · Kontak, tombol Chat WhatsApp", "Kilau Kreatif"], ["Hero", "Judul, sub-judul yang menyebut 3 layanan, tombol Chat WhatsApp + Lihat layanan", "Cerita brand kamu, dibuat terlihat. / Video, desain visual, dan fotografi untuk instansi, perusahaan, dan UMKM di Bogor."], ["Layanan", "3 kartu dengan contoh pekerjaan tiap layanan", "Produksi Video: video profil, after movie, video pendek · Desain Visual: laporan tahunan, infografis, deck · Fotografi: foto produk, dokumentasi acara, potret tim"], ["Cara kerja", "4 langkah bernomor", "Kirim brief lewat WhatsApp · Kami kirim penawaran · Produksi & revisi · File final dikirim"], ["Kontak", "WhatsApp besar, email, Instagram, alamat", "Ceritakan proyekmu, kami balas di WhatsApp."]],
      nuansa: "editorial", tata: "0", tipo: "raksasa", animasi: ["masuk", "stagger", "hover", "judul"],
      signature: "Judul hero muncul per kata, lalu garis oranye bata tergambar di bawah kata \"terlihat\"", acuan: "Majalah desain editorial, poster Swiss",
      masuk: "Satu halaman index.html + style.css + script.js\nBahasa Indonesia", keluar: "Login, blog, formulir yang menyimpan data, multi-bahasa",
      teknis: "HTML/CSS/JS biasa tanpa framework, bisa dibuka dengan klik dua kali\nKontras teks minimal 4.5:1, satu <h1>\nTotal file di bawah 200 KB tanpa font",
      gaya: "Latar krem #F7F0E3, teks #1F1A17, aksen oranye bata #A4401C\nJudul Plus Jakarta Sans 800, isi font sistem",
      fakta: "WhatsApp: 0812-0000-0000 (Raka)\nEmail: halo@kilaukreatif.test\nInstagram: @kilaukreatif\nAlamat: Bogor, Jawa Barat",
      larangan: ["angka", "harga", "testi", "janji", "stok", "lingkup"], larLain: "Jangan membuat formulir yang mengirim data ke server." },
    reels: { nama: "Kantor AI (30 detik)", ringkas: "Reels 30 detik yang memperkenalkan 6 agen AI yang bekerja seperti karyawan, ditutup ajakan mengambil template gratis.",
      tujuan: "Penonton paham ada 6 agen dan tugasnya\nPenonton tahu template-nya gratis", ukuran: "Keenam nama agen dan tugasnya muncul di layar\nKalimat penutup \"Link di bio\" tampil minimal 2 detik",
      pengguna: "Penonton TikTok/IG pemilik usaha kecil yang penasaran dengan AI, menonton dari HP tanpa suara",
      baris: [["0–3 dtk", "Hook besar di tengah", "\"6 karyawan. Semuanya AI.\""], ["3–15 dtk", "Enam kartu agen bergantian, 2 detik per agen", "Raka · cari tender, Sekar · cari klien, Gilang · riset pasar, Riska · keuangan, Esok · konsep acara, Lita · desain"], ["15–27 dtk", "Satu hari kerja: pagi, sore, malam", "\"Pagi · radar tender\", \"Sore · menulis laporan\", \"Malam · belajar\""], ["27–30 dtk", "Penutup", "\"Template kantornya gratis. Link di bio.\""]],
      nuansa: "berani", tata: "0", tipo: "raksasa", animasi: ["masuk", "stagger", "judul"], signature: "Tiap kartu agen masuk dengan pegas (spring) dan warna aksennya menyapu layar", acuan: "",
      masuk: "Video 30 detik tanpa audio wajib", keluar: "Musik, voice over, subtitle otomatis",
      teknis: "Remotion, komposisi KantorAI 1080×1920, 30 fps, 900 frame\nPerintah: npm run still lalu npm run render",
      gaya: "Latar gelap, teks putih besar, satu warna aksen per agen; teks penting di x 100–980",
      fakta: "", larangan: ["angka", "janji", "nama", "lingkup"], larLain: "" },
    deck: { nama: "Pitch Kopi Lereng", ringkas: "Deck 8 slide untuk mengajukan kerja sama pasokan kopi ke 3 kafe di Malang.",
      tujuan: "Pemilik kafe paham keunggulan kopi\nPemilik kafe mau jadwalkan cicip", ukuran: "Slide keunggulan memuat 3 poin dari bagian Fakta\nSlide terakhir berisi satu ajakan dan kontak",
      pengguna: "Pemilik kafe: sibuk, membaca di HP atau laptop dalam 3 menit",
      baris: [["Judul", "Nama brand + satu kalimat janji rasa"], ["Masalah", "Kafe sulit dapat biji kopi segar dengan pasokan tetap"], ["Solusi", "Pasokan mingguan dari kebun sendiri"], ["Keunggulan", "3 poin dari bagian Fakta"], ["Ajakan", "Jadwalkan sesi cicip gratis, kontak WhatsApp"]],
      nuansa: "hangat", tata: "0", tipo: "serif", animasi: ["masuk"], signature: "Slide judul memakai satu foto biji kopi besar [GAMBAR: biji kopi sangrai] dengan judul serif di atasnya", acuan: "",
      masuk: "8 slide, bahasa Indonesia", keluar: "Grafik penjualan, perbandingan dengan merek lain",
      teknis: "16:9, Google Slides, font maksimal 2 jenis", gaya: "Warna cokelat tua dan krem, foto diganti tanda tempat [GAMBAR: …]",
      fakta: "Kebun di lereng Arjuno, ketinggian 1.200 mdpl\nSangrai setiap Senin\nWhatsApp 0812-0000-0000", larangan: ["angka", "harga", "testi", "janji", "lingkup"], larLain: "" },
    app: { nama: "Invoice Warung", ringkas: "Aplikasi web satu file untuk membuat dan mencetak invoice sederhana, dipakai pemilik usaha kecil dari HP.",
      tujuan: "Membuat invoice kurang dari 1 menit\nInvoice bisa dicetak atau disimpan PDF", ukuran: "Invoice berisi 3 item bisa dibuat dalam 60 detik\nTombol cetak menghasilkan satu halaman A4 rapi",
      pengguna: "Pemilik warung/UMKM: memakai HP, tidak paham teknis, sering offline",
      baris: [["Buat invoice", "Isi nama klien, tanggal, item, jumlah, harga; total terhitung otomatis"], ["Daftar invoice", "Melihat, mencari, dan menghapus invoice lama"], ["Cetak", "Mencetak atau menyimpan PDF lewat dialog cetak browser"], ["Pengaturan", "Mengisi nama usaha, alamat, dan logo teks"]],
      nuansa: "hangat", tata: "0", tipo: "rapi", animasi: ["hover"], signature: "Total invoice berganti dengan animasi angka bergulir saat item ditambah", acuan: "",
      masuk: "Satu file index.html, data di localStorage", keluar: "Login, sinkron awan, pajak otomatis, pembayaran online",
      teknis: "HTML/CSS/JS tanpa library, bekerja offline\nFormat rupiah Indonesia (Rp 12.500)", gaya: "Putih bersih, aksen hijau, tombol besar minimal 44 px",
      fakta: "", larangan: ["angka", "harga", "nama", "lingkup"], larLain: "Jangan mengirim data ke server mana pun." },
  };

  /* ---------- tampilan langkah ---------- */
  const panel = $("#p-panel"), stepper = $("#p-stepper");
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ALIAS = { aplikasi: "app", webapp: "app", "aplikasi web": "app", video: "reels", presentasi: "deck", web: "website" };
  const normJenis = () => { const k = String(S.jenis || "").toLowerCase(); if (!JENIS[k] && ALIAS[k]) S.jenis = ALIAS[k]; };
  const J = () => { normJenis(); return JENIS[S.jenis] || JENIS.website; };
  const PROFIL = window.PRD_PROFIL || {};
  const KODE = Object.fromEntries((window.KODE || []).map((d) => [d.slug, d]));
  const PRF = () => PROFIL[S.template] || null;

  function isian(key, label, { wajib, cth, ph, area } = {}) {
    const tag = wajib ? '<span class="tag wajib">wajib</span>' : '<span class="tag">opsional</span>';
    const el = area ? `<textarea id="f-${key}" data-k="${key}" placeholder="${esc(ph || "")}">${esc(S[key])}</textarea>`
      : `<input type="text" id="f-${key}" data-k="${key}" value="${esc(S[key])}" placeholder="${esc(ph || "")}">`;
    return `<div class="p-isian" data-isian="${key}"><label for="f-${key}">${label}${tag}</label>${el}${cth ? `<p class="cth">${cth}</p>` : ""}<p class="samar" hidden></p><p class="salah" hidden></p></div>`;
  }

  function pilihan(key, label, opsi, multi) {
    const v = S[key];
    return `<div class="p-isian"><span class="lbl">${label}<span class="tag">${multi ? "boleh lebih dari satu" : "pilih satu"}</span></span><div class="p-chip-grup${multi ? "" : " satu"}">` +
      opsi.map(([k, t]) => `<label class="p-chip"><input type="${multi ? "checkbox" : "radio"}" name="pl-${key}" data-pil="${key}" value="${k}" ${multi ? (v.includes(k) ? "checked" : "") : (v === k ? "checked" : "")}>${esc(t)}</label>`).join("") + `</div></div>`;
  }

  function render() {
    stepper.innerHTML = LANGKAH.map((l, i) => `<li class="${i === aktif ? "aktif" : ""} ${i < aktif && lengkap(i) ? "selesai" : ""}"><button type="button" data-ke="${i}" ${i === aktif ? 'aria-current="step"' : ""}><span class="n">${i < aktif && lengkap(i) ? "✓" : i + 1}</span><span class="l">${l.l}</span></button></li>`).join("");
    const j = J(); let h = "";
    switch (LANGKAH[aktif].id) {
      case "jenis":
        h = `<h2>Mau bikin apa?</h2><p class="bantu">Pertanyaan berikutnya menyesuaikan jenis proyek.</p><div class="p-jenis" role="radiogroup" aria-label="Jenis proyek">` +
          Object.entries(JENIS).map(([k, v]) => `<label><input type="radio" name="jenis" value="${k}" ${S.jenis === k && !S.template ? "checked" : ""}><span class="ik">${esc(v.ik)}</span><b>${v.nama}</b><small>${v.ket}</small></label>`).join("") + `</div>` +
          (Object.keys(PROFIL).length ? `<div class="p-tpl"><div class="p-tpl-kepala"><b>Atau mulai dari template /kode</b><span class="tag">PRD terisi otomatis</span></div><p class="cth">Fitur, berkas aman, dan selector yang wajib dipertahankan sudah dipelajari dari kode template. Kamu tinggal isi nama usaha & gaya.</p><div class="p-tpl-grid">` +
            Object.entries(PROFIL).map(([k, v]) => `<label class="p-tpl-item"><input type="radio" name="template" value="${k}" ${S.template === k ? "checked" : ""}><b>${esc(v.judul || k)}</b><small>${esc(v.kategori || "")} · ${(v.selector || []).length ? (v.selector || []).length + " selector dijaga" : "berkas inti dijaga"}</small></label>`).join("") + `</div></div>` : "");
        break;
      case "tujuan":
        h = `<h2>Ringkasan & tujuan</h2><p class="bantu">Satu tujuan per baris. Ukuran berhasil = cara mengecek tujuan itu tercapai.</p>` +
          isian("nama", "Nama proyek", { wajib: 1, ph: j.nama === "Website" ? "Kilau Kreatif" : "Nama proyekmu" }) +
          isian("ringkas", "Ringkasan (1–2 kalimat)", { wajib: 1, area: 1, ph: "Apa yang dibuat, untuk siapa, dan hasil yang diharapkan." }) +
          isian("tujuan", "Tujuan (satu per baris)", { wajib: 1, area: 1, ph: "Pengunjung bisa menghubungi lewat WhatsApp" }) +
          isian("ukuran", "Ukuran berhasil (urut sesuai tujuan)", { area: 1, ph: "Tombol WhatsApp ada di hero dan di bagian kontak", cth: "Tulis yang bisa dicek, bukan \"bagus\" atau \"menarik\"." });
        break;
      case "pengguna":
        h = `<h2>Siapa penggunanya?</h2><p class="bantu">Satu orang per baris: siapa, lalu kebutuhannya dan di mana mereka membuka.</p>` +
          isian("pengguna", "Pengguna", { wajib: 1, area: 1, ph: "Pemilik UMKM: butuh foto produk, buka dari HP", cth: "Format: <b>Siapa</b>: kebutuhan, perangkat/situasi." });
        break;
      case "struktur": {
        const r = j.kolom.length === 3 ? " reels" : "";
        h = `<h2>${j.label}</h2><p class="bantu">Urut dari awal. Makin jelas isinya, makin kecil peluang AI mengarang.</p>` +
          `<div class="p-kepala${r}"><span>#</span>${j.kolom.map((c) => `<span>${c}</span>`).join("")}<span></span></div>` +
          `<div class="p-tabel" id="p-tabel">${(S.baris.length ? S.baris : [[]]).map((b, i) => baris(b, i)).join("")}</div>` +
          `<button type="button" class="p-btn tambah" id="p-tambah">+ Tambah ${j.label.toLowerCase()}</button><p class="samar" id="samar-tabel" hidden></p>`;
        break; }
      case "lingkup":
        h = `<h2>Lingkup & teknis</h2><p class="bantu">Batas yang jelas mencegah AI menambah hal yang tidak diminta.</p>` +
          isian("masuk", "Masuk lingkup", { area: 1, ph: "Satu halaman, bahasa Indonesia" }) +
          isian("keluar", "Tidak masuk lingkup", { area: 1, ph: "Login, blog, multi-bahasa", cth: "Bagian ini sering paling berguna. Sebut yang <b>tidak</b> perlu dibuat." }) +
          isian("teknis", "Persyaratan teknis", { area: 1, ph: j.teknisPh }) +
          isian("pertahankan", "Berkas & selector yang wajib dipertahankan", { area: 1, ph: "app.js tidak diubah\n#grid, #keranjang, [data-id]", cth: "Penting saat mengubah template: id/kelas yang dipakai JavaScript tidak boleh dihapus atau diganti nama." });
        break;
      case "desain":
        h = `<h2>Arah desain</h2><p class="bantu">Tanpa arah desain, AI membuat tampilan "template" yang aman tapi biasa. Pilih yang paling dekat.</p>` +
          pilihan("pola", `Pola gaya ${esc(polaAktif().nama)} (riset Pinterest)`, Object.entries(polaAktif().gaya).map(([k, v]) => [k, v[0]])) +
          (S.pola && polaAktif().gaya[S.pola] ? `<p class="cth p-pola-ket">${esc(polaAktif().gaya[S.pola][1])}</p>` : "") +
          pilihan("nuansa", "Nuansa", Object.entries(NUANSA).map(([k, v]) => [k, v[0]])) +
          pilihan("tata", "Tata letak", j.tata.map((x, i) => [String(i), x.split(":")[0]])) +
          pilihan("tipo", "Tipografi", Object.entries(TIPO).map(([k, v]) => [k, v[0]])) +
          pilihan("animasi", "Animasi", Object.entries(ANIM).map(([k, v]) => [k, v[0]]), true) +
          isian("gaya", "Warna & font", { area: 1, ph: "Latar krem #F7F0E3, aksen oranye bata #A4401C, judul Plus Jakarta Sans", cth: "Tulis kode warna atau nama font bila ada." }) +
          isian("signature", "Satu momen yang diingat", { ph: "Judul hero muncul per kata, garis oranye tergambar di bawahnya", cth: "Satu detail khas yang membuat hasilnya tidak terlihat seperti template." }) +
          isian("acuan", "Acuan gaya (opsional)", { ph: "Gaya majalah desain, poster Swiss", cth: "Sebut gaya, bukan menyalin situs orang." });
        break;
      case "larangan":
        h = `<h2>Fakta & larangan</h2><p class="bantu">AI hanya boleh memakai fakta yang kamu tulis. Larangan dibuat sedikit tapi tegas.</p>` +
          isian("fakta", "Fakta yang boleh dipakai (kontak, harga, angka asli)", { area: 1, ph: "WhatsApp: 0812-0000-0000\nAlamat: Bogor", cth: "Kosongkan bila tidak ada. AI akan menulis tanda [ISI: …], bukan mengarang." }) +
          `<div class="p-isian"><span class="lbl">Larangan<span class="tag">pilih seperlunya</span></span><div class="p-chip-grup">` +
          LARANGAN.map(([k, t]) => `<label class="p-chip"><input type="checkbox" value="${k}" data-lar ${S.larangan.includes(k) ? "checked" : ""}>${esc(t.replace(/^Jangan /, "").replace(/ yang tidak tertulis di PRD\.| di luar lingkup\.|\.$/g, "").replace(/\(.*\)/, "").trim())}</label>`).join("") +
          `</div><p class="cth">Riset menunjukkan kepatuhan model turun bila batasan terlalu banyak. 3–6 larangan sudah cukup.</p></div>` +
          isian("larLain", "Larangan tambahan (satu per baris)", { area: 1, ph: "Jangan membuat formulir yang mengirim data ke server." });
        break;
    }
    panel.innerHTML = h;
    panel.classList.remove("masuk"); void panel.offsetWidth; panel.classList.add("masuk");
    panel.querySelectorAll("[data-k]").forEach((el) => cekSamar(el));
    $("#p-mundur").disabled = aktif === 0;
    $("#p-maju").textContent = aktif === LANGKAH.length - 1 ? "Selesai ✓" : "Lanjut →";
    $("#p-bar").style.width = ((aktif + 1) / LANGKAH.length * 100) + "%";
    perbarui();
  }

  function baris(b, i) {
    const j = J(), r = j.kolom.length === 3 ? " reels" : "";
    return `<div class="p-baris${r}" data-i="${i}"><span class="no">${i + 1}</span><div class="sel">` +
      j.kolom.map((c, k) => `<input type="text" data-kol="${k}" aria-label="${c} ${i + 1}" value="${esc(b[k] || "")}" placeholder="${i === 0 ? esc(j.ph[k]) : esc(c)}">`).join("") + `</div>` +
      `<button type="button" class="p-hapus" aria-label="Hapus baris ${i + 1}">×</button></div>`;
  }

  function lengkap(i) {
    switch (LANGKAH[i].id) {
      case "jenis": return !!S.jenis;
      case "tujuan": return !!(S.nama.trim() && S.ringkas.trim() && S.tujuan.trim());
      case "pengguna": return !!S.pengguna.trim();
      case "struktur": return S.baris.some((b) => (b || []).some((x) => x && x.trim()));
      default: return true;
    }
  }

  function cariSamar(t) {
    const low = " " + String(t).toLowerCase().replace(/[^\p{L}\s-]/gu, " ") + " ";
    return SAMAR.filter((w) => low.includes(" " + w + " "));
  }
  function cekSamar(el) {
    const box = el.closest(".p-isian"); if (!box) return;
    const p = box.querySelector(".samar"); const s = cariSamar(el.value);
    p.hidden = !s.length;
    if (s.length) p.textContent = `Kata samar: "${s.join("\", \"")}". AI sulit mengeceknya. Ganti dengan ciri yang bisa dilihat, misalnya warna, ukuran, atau contoh.`;
  }

  /* ---------- pembuat markdown ---------- */
  const ISI = (t) => `[ISI: ${t}]`;
  const baris_ = (t) => String(t || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const sel = (t) => String(t || "").replace(/\|/g, "\\|").trim();

  function buatMD() {
    const j = J(), tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const o = [];
    const pf = PRF();
    o.push(`# PRD · ${pf ? "Ubah template " + (pf.judul || S.template) : j.nama} "${S.nama.trim() || ISI("nama proyek")}"`, "");
    o.push(`Versi 1 · ${tgl} · Dibuat dengan Pembuat PRD (malikisaputra.biz.id/prd)`, "");
    o.push("## 1. Ringkasan", S.ringkas.trim() || ISI("1–2 kalimat: apa yang dibuat, untuk siapa, hasil yang diharapkan"), "");
    const tj = baris_(S.tujuan), uk = baris_(S.ukuran);
    o.push("## 2. Tujuan & ukuran berhasil", "| # | Tujuan | Ukuran berhasil (bisa dicek) |", "|---|---|---|");
    if (!tj.length) o.push(`| 1 | ${ISI("tujuan")} | ${ISI("cara mengecek")} |`);
    for (let i = 0; i < Math.max(tj.length, uk.length); i++) o.push(`| T${i + 1} | ${tj[i] ? sel(tj[i]) : "(ukuran tambahan)"} | ${uk[i] ? sel(uk[i]) : ISI("cara mengecek")} |`);
    o.push("");
    o.push("## 3. Pengguna");
    const pg = baris_(S.pengguna);
    if (!pg.length) o.push(`1. ${ISI("siapa: kebutuhan, perangkat")}`);
    pg.forEach((p, i) => { const m = p.split(/:\s*/); o.push(`${i + 1}. ${m.length > 1 ? `**${m.shift().trim()}**: ${m.join(": ")}` : p}`); });
    o.push("");
    o.push("## 4. Lingkup", "**Masuk:**");
    (baris_(S.masuk).length ? baris_(S.masuk) : [ISI("yang dibuat")]).forEach((x) => o.push(`- ${x}`));
    o.push("", "**Tidak masuk (jangan dibuat):**");
    (baris_(S.keluar).length ? baris_(S.keluar) : [ISI("yang tidak perlu dibuat")]).forEach((x) => o.push(`- ${x}`));
    o.push("");
    o.push(`## 5. ${j.label} (urut dari awal)`, `| # | ${j.kolom.join(" | ")} |`, `|---|${j.kolom.map(() => "---").join("|")}|`);
    const bs = S.baris.filter((b) => (b || []).some((x) => x && x.trim()));
    if (!bs.length) o.push(`| 1 | ${j.kolom.map((c) => ISI(c.toLowerCase())).join(" | ")} |`);
    bs.forEach((b, i) => o.push(`| ${i + 1} | ${j.kolom.map((_, k) => (b[k] && b[k].trim()) ? sel(b[k]) : (j.kolom[k] === "Teks persis" ? "(tulis singkat, netral, tanpa klaim)" : ISI(j.kolom[k].toLowerCase()))).join(" | ")} |`));
    if (j.kolom.includes("Teks persis") && bs.some((b) => b[2] && b[2].trim())) o.push("", "Teks di kolom **Teks persis** wajib dipakai kata per kata, tanpa diubah.");
    o.push("");
    o.push("## 6. Arah desain");
    const nu = NUANSA[S.nuansa], ta = j.tata[+S.tata], tp = TIPO[S.tipo], pg_ = polaAktif().gaya[S.pola];
    if (pg_) o.push(`- **Pola tata letak (${pg_[0]}):** ${pg_[1]}.`);
    if (nu || !pg_) o.push(`- **Nuansa:** ${nu ? `${nu[0]}: ${nu[1]}.` : ISI("pilih nuansa")}`);
    if ((S.tata !== "" && ta) || !pg_) o.push(`- **Tata letak:** ${S.tata !== "" && ta ? ta + "." : ISI("pilih tata letak")}`);
    const gy = baris_(S.gaya);
    o.push(`- **Warna & font:** ${gy.length ? gy.join("; ") + "." : ISI("kode warna utama, aksen, dan font")}`);
    if (tp) o.push(`- **Tipografi:** ${tp[1]}.`);
    const an = (S.animasi || []).filter((k) => ANIM[k]);
    if (an.length) { o.push("- **Animasi:**"); an.forEach((k) => o.push(`  - ${ANIM[k][1]}.`)); o.push("  - Semua animasi mati bila pengguna memilih `prefers-reduced-motion`."); }
    if (S.signature.trim()) o.push(`- **Momen pembeda (wajib ada):** ${S.signature.trim()}`);
    if (S.acuan.trim()) o.push(`- **Acuan gaya:** ${S.acuan.trim()} (ambil suasananya, jangan menyalin).`);
    o.push("- **Hindari tampilan template:** jangan semua bagian rata tengah; jangan tiga kartu kembar tanpa variasi; jangan gradien ungu-biru acak; jangan emoji sebagai ikon; beri jarak antarbagian yang lega (minimal 96 px di laptop).");
    o.push("");
    o.push("## 7. Persyaratan");
    const tk = baris_(S.teknis);
    (tk.length ? tk : [ISI(j.teknisPh)]).forEach((x, i) => o.push(`- R${i + 1}. ${x}`));
    const ph = baris_(S.pertahankan);
    if (ph.length) { o.push("", "**Wajib dipertahankan (jangan dihapus, diganti nama, atau dipindah ke elemen lain):**"); ph.forEach((x) => o.push(`- ${x}`));
      o.push("- Kelas yang dibuat oleh JavaScript tetap harus punya gaya di CSS."); }
    if (pf && pf.uji) { o.push("", "**Cara uji fitur setelah diubah:**"); pf.uji.forEach((x, i) => o.push(`${i + 1}. ${x}`)); }
    o.push("");
    o.push("## 8. Fakta yang boleh dipakai");
    const fk = baris_(S.fakta);
    if (fk.length) { fk.forEach((x) => o.push(`- ${x}`)); o.push("", "Hanya fakta di atas yang boleh muncul. Selain itu tulis tanda [ISI: …]."); }
    else o.push("Belum ada. Bila butuh kontak, harga, atau angka, tulis tanda [ISI: …] dan jangan mengarang.");
    o.push("");
    o.push("## 9. Larangan (penting)");
    LARANGAN.filter(([k]) => S.larangan.includes(k)).forEach(([, t]) => o.push(`- ${t}`));
    baris_(S.larLain).forEach((x) => o.push(`- ${x}`));
    o.push("");
    o.push("## 10. Kriteria selesai");
    let n = 1;
    tj.forEach((t, i) => { if (uk[i]) o.push(`${n++}. Ketika hasil dicek untuk tujuan T${i + 1}, maka ${uk[i].replace(/^./, (c) => c.toLowerCase())}.`); });
    j.kriteria.forEach((k) => o.push(`${n++}. ${k}`));
    if (S.signature.trim()) o.push(`${n++}. Ketika hasil dibuka, maka momen pembeda di bagian 6 terlihat dan berjalan.`);
    if (nu) o.push(`${n++}. Ketika hasil dilihat sekilas, maka nuansa "${nu[0]}" terasa (sesuai ciri di bagian 6), bukan tampilan template umum.`);
    o.push(`${n++}. Ketika seluruh hasil dibaca, maka tidak ada yang melanggar bagian 9 (Larangan).`);
    o.push("");
    o.push("## 11. Langkah kerja (ikuti berurutan, jangan berhenti di tengah)");
    (PRF() ? ["Baca seluruh PRD dan TASKS. Bila ada [ISI: …] atau yang tidak jelas, tanyakan dulu ke saya. Jangan menebak.",
      "Pelajari template asli dan jalankan cara uji di bagian 7 sebelum mengubah apa pun.",
      "Ubah tampilan per task (TASKS.md), hanya di berkas yang aman; jaga semua selector di bagian 7.",
      "Setelah tiap task, jalankan lagi cara uji fitur. Bila ada yang rusak, kembalikan dulu sebelum lanjut.",
      "Cek kriteria selesai, lalu laporkan berkas yang diubah dan hasil uji."] : j.langkah).forEach((l, i) => o.push(`${i + 1}. ${l}`));
    o.push("");
    return o.join("\n");
  }

  function buatTask() {
    const j = J(), bs = S.baris.filter((b) => (b || []).some((x) => x && x.trim()));
    const o = [`# TASKS · ${PRF() ? "Ubah template " + (PRF().judul || S.template) : j.nama} "${S.nama.trim() || ISI("nama proyek")}"`, "",
      "Kerjakan **satu task per giliran**, berurutan. Setelah tiap task: cek \"Selesai bila\", lalu tulis `✅ T# selesai` dan lanjut ke task berikutnya.", "Acuan lengkap ada di PRD.md. Bila task dan PRD berbeda, ikuti PRD.", ""];
    let n = 0; const T = (judul, isi, cek) => { o.push(`## T${n++} · ${judul}`); isi.forEach((x) => o.push(`- ${x}`)); o.push(`- **Selesai bila:** ${cek}`, ""); };
    const web = S.jenis !== "reels" && S.jenis !== "deck";
    if (PRF()) T("Pelajari template dulu (jangan ubah apa pun)", ["Baca README, AGENTS.md/DESIGN.md (bila ada), lalu berkas yang aman diubah.", "Catat semua selector di bagian 7 \"Wajib dipertahankan\" dan cari di mana dipakai.", "Jalankan cara uji di bagian 7 pada versi asli, catat hasilnya sebagai patokan."], "kamu bisa menyebut berkas mana yang akan diubah dan selector mana yang dijaga.");
    T(PRF() ? "Ganti token desain (warna, font, radius)" : "Siapkan kerangka & token desain", [
      PRF() ? "Ubah hanya berkas yang aman (bagian 4 Lingkup); jangan sentuh berkas terkunci di bagian 7." : web ? "Buat file sesuai bagian 4 (Lingkup) PRD." : S.jenis === "reels" ? "Siapkan proyek/komposisi sesuai bagian 7 (Persyaratan)." : "Siapkan file deck kosong sesuai bagian 7 (Persyaratan).",
      "Simpan warna dan font dari bagian 6 (Arah desain) sebagai variabel/gaya bersama.",
      S.tipo && TIPO[S.tipo] ? `Atur skala tipografi: ${TIPO[S.tipo][1]}.` : "Atur skala tipografi yang konsisten."],
      web ? "file terbuka di browser tanpa error, warna & font sudah sesuai." : "kerangka terbuka/terender tanpa error.");
    (bs.length ? bs : [[ISI(j.kolom[0].toLowerCase()), ISI(j.kolom[1].toLowerCase())]]).forEach((b) => {
      const nm = (b[0] || "").trim() || `${j.label} ${n}`;
      const isi = [`Isi: ${(b[1] || "").trim() || ISI("isi")}`];
      if (b[2] && b[2].trim()) isi.push(S.jenis === "reels" ? `Teks/narasi persis: ${b[2].trim()}` : `Teks persis (jangan diubah): ${b[2].trim()}`);
      const iB = bs.indexOf(b);
      isi.push((/hero|pembuka|judul|hook/i.test(nm) || (iB === 0 && !bs.some((x) => /hero|pembuka|judul|hook/i.test(x[0] || "")))) && S.tata !== "" && j.tata[+S.tata] ? `Tata letak utama: ${j.tata[+S.tata]}.` : "Ikuti nuansa bagian 6; buat tata letaknya berbeda dari bagian sebelumnya (jangan monoton).");
      T(`${S.jenis === "reels" ? "Adegan" : S.jenis === "deck" ? "Slide" : web && S.jenis === "app" ? "Fitur" : "Bagian"} "${nm}"`, isi,
        S.jenis === "reels" ? "adegan muncul di waktu yang tertulis, teks di area aman, tidak terpotong." : "isi lengkap sesuai tabel, rapi di lebar 375 px dan laptop, tidak melanggar Larangan.");
    });
    const an = (S.animasi || []).filter((k) => ANIM[k]);
    if (an.length || S.signature.trim()) T("Animasi & momen pembeda", [...an.map((k) => ANIM[k][1] + "."), ...(S.signature.trim() ? [`Momen pembeda: ${S.signature.trim()}`] : []), "Matikan animasi untuk `prefers-reduced-motion`."],
      "animasi halus (tanpa patah), momen pembeda terlihat jelas.");
    if (PRF()) T("Uji ulang fitur template", [...(PRF().uji || []).map((x) => x), "Bandingkan dengan hasil uji versi asli dari task pertama."], "semua fitur bekerja sama seperti versi asli.");
    T("Pemeriksaan akhir", ["Cek bagian 10 (Kriteria selesai) PRD satu per satu.", "Cari pelanggaran bagian 9 (Larangan): angka, harga, testimoni, janji, nama karangan.", "Perbaiki yang belum lolos, lalu laporkan daftar kriteria + statusnya."],
      "semua kriteria berstatus lolos.");
    return o.join("\n");
  }

  const PERINTAH = "Kamu akan mengerjakan proyek sesuai PRD di bawah.\n" +
    "- Baca PRD sampai habis sebelum mulai.\n- Ikuti PRD persis. Jangan menambah apa pun di luar PRD.\n" +
    "- Bila ada tanda [ISI: …] atau bagian yang tidak jelas, tanyakan dulu ke saya dalam satu daftar pertanyaan.\n" +
    "- Kerjakan berurutan mengikuti TASKS (satu task per giliran) yang ada setelah PRD.\n" +
    "- Setelah selesai, cek bagian 10 (Kriteria selesai) satu per satu dan laporkan hasilnya.\n\n---\n\n";

  function sorot(md) {
    return md.split("\n").map((l) => {
      let e = esc(l).replace(/\[ISI: [^\]]*\]/g, (m) => `<span class="isi">${m}</span>`);
      if (/^# /.test(l)) return `<span class="h1">${e}</span>`;
      if (/^## /.test(l)) return `<span class="h">${e}</span>`;
      if (/^\|/.test(l)) return `<span class="t">${e}</span>`;
      return e;
    }).join("\n");
  }

  let tab = "prd", mode = "dok";
  try { mode = localStorage.getItem("ms-prd-mode") || "dok"; } catch (_) {}
  const isiTab = () => tab === "task" ? buatTask() : buatMD();
  const namaTab = () => tab === "task" ? "TASKS.md" : "PRD.md";

  function inline(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[ISI: [^\]]*\]/g, (m) => `<span class="isi">${m}</span>`);
  }
  function keDok(md) {
    const L = md.split("\n"), o = []; let i = 0;
    while (i < L.length) {
      const l = L[i];
      if (/^# /.test(l)) { o.push(`<h1>${inline(l.slice(2))}</h1>`); i++; continue; }
      if (/^## /.test(l)) { o.push(`<h2>${inline(l.slice(3))}</h2>`); i++; continue; }
      if (/^\|/.test(l)) { const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]);
        const sp = (r) => r.replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
        const head = sp(rows[0]), body = rows.slice(2).map(sp);
        o.push(`<div class="dok-tabel"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); continue; }
      if (/^\s*- /.test(l) || /^\d+\. /.test(l)) { const ol = /^\d+\. /.test(l); const it = [];
        while (i < L.length && (ol ? /^\d+\. /.test(L[i]) : /^\s*- /.test(L[i]))) { const sub = /^\s{2,}- /.test(L[i]); it.push(`<li${sub ? ' class="sub"' : ""}>${inline(L[i].replace(/^\s*(- |\d+\. )/, ""))}</li>`); i++; }
        o.push(ol ? `<ol>${it.join("")}</ol>` : `<ul>${it.join("")}</ul>`); continue; }
      if (/^---/.test(l)) { o.push("<hr>"); i++; continue; }
      if (l.trim()) o.push(`<p>${inline(l)}</p>`);
      i++;
    }
    return o.join("");
  }

  let mdLama = "", kunciLama = "";
  function perbarui() {
    const md = isiTab(); const pre = $("#p-md");
    $("#p-nama-berkas").textContent = namaTab();
    document.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === tab));
    document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
    pre.classList.toggle("dok", mode === "dok");
    const kunci = tab + mode;
    if (kunci !== kunciLama) { mdLama = ""; kunciLama = kunci; }
    if (mode === "dok") { if (md !== mdLama) { pre.innerHTML = keDok(md); mdLama = md; } }
    else if (md !== mdLama) {
      const lama = mdLama.split("\n"); const baru = md.split("\n");
      pre.innerHTML = sorot(md).split("\n").map((h, i) => mdLama && baru[i] !== lama[i] ? `<span class="baru">${h || " "}</span>` : h).join("\n");
      mdLama = md;
    }
    const pk = $("#p-paket"); if (pk) { pk.hidden = !S.template; if (S.template) pk.textContent = `Unduh paket: template + PRD`; }
    const sisa = (buatMD().match(/\[ISI: /g) || []).length;
    const ok = LANGKAH.filter((_, i) => lengkap(i)).length;
    $("#p-skor").innerHTML = `<b>${ok}/${LANGKAH.length}</b> langkah · ${sisa ? sisa + " isian kosong" : "lengkap"}`;
    simpan();
  }

  /* ---------- interaksi ---------- */
  function validasi() {
    let ok = true;
    const wajib = { tujuan: ["nama", "ringkas", "tujuan"], pengguna: ["pengguna"] }[LANGKAH[aktif].id] || [];
    wajib.forEach((k) => { const box = panel.querySelector(`[data-isian="${k}"]`); const kosongkah = !S[k].trim();
      box.classList.toggle("err", kosongkah); const p = box.querySelector(".salah"); p.hidden = !kosongkah; p.textContent = "Bagian ini wajib diisi.";
      if (kosongkah && ok) { box.querySelector("[data-k]").focus(); ok = false; } });
    if (LANGKAH[aktif].id === "jenis" && !S.jenis) { toast("Pilih jenis proyek dulu."); ok = false; }
    return ok;
  }
  function ke(i) { aktif = Math.max(0, Math.min(LANGKAH.length - 1, i)); render(); if (innerWidth < 760) $("#alat").scrollIntoView({ behavior: "smooth" }); }

  panel.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.k) { S[t.dataset.k] = t.value; cekSamar(t); const box = t.closest(".p-isian"); if (box.classList.contains("err") && t.value.trim()) { box.classList.remove("err"); box.querySelector(".salah").hidden = true; } }
    if (t.dataset.kol !== undefined) { const i = +t.closest(".p-baris").dataset.i; S.baris[i] = S.baris[i] || []; S.baris[i][+t.dataset.kol] = t.value;
      const s = cariSamar(S.baris.flat().join(" ")); const p = $("#samar-tabel"); p.hidden = !s.length; if (s.length) p.textContent = `Kata samar: "${s.join("\", \"")}". Ganti dengan isi yang bisa dicek.`; }
    perbarui();
  });
  panel.addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "jenis") { S.jenis = t.value; S.template = ""; S.tata = ""; S.pola = ""; perbarui(); setTimeout(() => ke(1), 260); }
    if (t.name === "template") { pakaiTemplate(t.value); setTimeout(() => ke(1), 260); }
    if (t.dataset.pil) { const k = t.dataset.pil; S[k] = t.type === "checkbox" ? [...panel.querySelectorAll(`[data-pil="${k}"]:checked`)].map((x) => x.value) : t.value; perbarui(); if (k === "pola") { const y = scrollY; render(); scrollTo(0, y); } }
    if (t.hasAttribute("data-lar")) { S.larangan = [...panel.querySelectorAll("[data-lar]:checked")].map((x) => x.value); perbarui(); }
  });
  panel.addEventListener("click", (e) => {
    if (e.target.id === "p-tambah") { if (!S.baris.length) S.baris.push([]); S.baris.push([]); render(); const ins = panel.querySelectorAll(".p-baris input"); ins[ins.length - J().kolom.length]?.focus(); }
    const h = e.target.closest(".p-hapus"); if (h) { const i = +h.closest(".p-baris").dataset.i; S.baris.splice(i, 1); render(); }
  });
  stepper.addEventListener("click", (e) => { const b = e.target.closest("[data-ke]"); if (b) ke(+b.dataset.ke); });
  $("#p-maju").addEventListener("click", () => { if (!validasi()) return; if (aktif < LANGKAH.length - 1) ke(aktif + 1); else { const h = $("#p-hasil"); h.scrollIntoView({ behavior: "smooth", block: "start" }); h.classList.remove("jadi"); void h.offsetWidth; h.classList.add("jadi"); toast("PRD + TASKS siap. Salin atau unduh di panel kanan."); } });
  $("#p-mundur").addEventListener("click", () => ke(aktif - 1));
  $("#p-contoh").addEventListener("click", () => {
    const j = S.jenis || "website"; S = { ...kosong(), ...JSON.parse(JSON.stringify(CONTOH[j])), jenis: j }; mdLama = ""; ke(1); toast(`Contoh ${JENIS[j].nama} dimuat.`);
  });
  $("#p-reset").addEventListener("click", () => { if (!confirm("Hapus semua isian dan mulai ulang?")) return; S = kosong(); mdLama = ""; ke(0); });

  function pakaiTemplate(slug) {
    const p = PROFIL[slug]; if (!p) return;
    const lama = S; S = kosong();
    S.template = slug; S.jenis = p.jenis || "app"; S.larangan = [...BAWAAN_LAR]; S.nama = lama.template === slug ? lama.nama : "";
    S.ringkas = `Ubah tampilan template "${p.judul}" agar sesuai usahaku ${ISI("nama usaha")}, tanpa merusak fitur yang sudah ada.`;
    S.tujuan = "Tampilan baru sesuai gaya usahaku\nSemua fitur lama tetap berfungsi\nRapi di HP & laptop";
    S.ukuran = "Pola tata letak di bagian 6 terlihat jelas\n" + (p.uji || []).slice(0, 2).join("; ") + "\nTidak ada scroll ke samping di lebar 375 px";
    S.pengguna = p.jenis === "reels" ? "Penonton TikTok/IG: menonton dari HP, sering tanpa suara" : "Pelanggan/pengguna usahaku: membuka dari HP";
    S.baris = (p.fitur || []).slice(0, 8).map((f) => p.jenis === "reels" ? ["", f, ""] : [f.split(/[:(]/)[0].trim(), "Tetap berfungsi; tampilannya mengikuti gaya baru", ""]);
    S.masuk = "Mengubah tampilan: " + (p.aman || []).join(", ");
    S.keluar = "Mengubah logika/JavaScript dan format data\nMenambah fitur baru\nMengubah berkas terkunci: " + (p.kunci || []).join(", ");
    S.teknis = (p.cara || []).slice(0, 3).join("\n");
    S.pertahankan = ["Berkas terkunci (logika): " + (p.kunci || []).join(", "), ...((p.data || []).length ? ["Berkas data (isinya boleh diganti, struktur & nama field jangan): " + p.data.join(", ")] : []), ...(p.selector || []).length ? [(p.selector || []).join(" ")] : []].join("\n");
    S.pola = Object.keys((POLA[p.pola] || POLA.website).gaya)[0];
    S.larangan = [...BAWAAN_LAR]; mdLama = ""; perbarui();
    toast(`Profil "${p.judul}" dimuat. Isi nama usaha & pilih gaya.`);
  }

  function toast(t) { const el = $("#toast"); if (!el) return; el.textContent = t; el.classList.add("tampil"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("tampil"), 2400); }
  function catat() { try { fetch(SB + "/rest/v1/rpc/catat", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: "prd", p_jenis: "zip" }), keepalive: true }); } catch (_) {} }
  async function salin(t, pesan) {
    try { await navigator.clipboard.writeText(t); } catch (_) { const a = document.createElement("textarea"); a.value = t; document.body.append(a); a.select(); document.execCommand("copy"); a.remove(); }
    toast(pesan); catat();
  }
  $("#p-salin").addEventListener("click", () => salin(isiTab(), namaTab() + " disalin."));
  $("#p-salin-perintah").addEventListener("click", () => salin(PERINTAH + buatMD() + "\n---\n\n" + buatTask(), "PRD + TASKS + perintah disalin. Tempel ke ChatGPT, Claude, GLM, atau DeepSeek."));
  document.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.tab; perbarui(); }));
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; try { localStorage.setItem("ms-prd-mode", mode); } catch (_) {} perbarui(); }));
  $("#p-unduh").addEventListener("click", () => {
    const b = new Blob([isiTab()], { type: "text/markdown;charset=utf-8" }); const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = namaTab(); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast(namaTab() + " diunduh."); catat();
  });

  /* ---------- unduh paket: PRD-paket.zip (tanpa kompresi) + ZIP template ---------- */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (b) => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  function buatZip(berkas) {
    const enc = new TextEncoder(), lokal = [], pusat = []; let off = 0;
    const u16 = (v) => [v & 255, (v >>> 8) & 255], u32 = (v) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
    for (const [nama, isi] of berkas) {
      const n = enc.encode(nama), d = enc.encode(isi), c = crc32(d);
      const kepala = [...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(c), ...u32(d.length), ...u32(d.length), ...u16(n.length), ...u16(0)];
      lokal.push(new Uint8Array(kepala), n, d);
      pusat.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(c), ...u32(d.length), ...u32(d.length), ...u16(n.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), n);
      off += kepala.length + n.length + d.length;
    }
    const pj = pusat.reduce((a, x) => a + x.length, 0);
    const akhir = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(berkas.length), ...u16(berkas.length), ...u32(pj), ...u32(off), ...u16(0)]);
    return new Blob([...lokal, ...pusat, akhir], { type: "application/zip" });
  }
  function petunjuk() {
    const p = PRF(), d = KODE[S.template] || {};
    return [`# Cara pakai paket PRD · ${p ? p.judul : ""}`, "",
      "1. Ekstrak ZIP template (unduhan kedua) ke satu folder.",
      "2. Salin **PRD.md** dan **TASKS.md** dari ZIP ini ke folder template tersebut.",
      "3. Buka folder itu di Claude Code / Codex / OpenCode / Antigravity, atau unggah berkasnya ke ChatGPT/Claude/GLM/DeepSeek.",
      "4. Tempel perintah di bawah, lalu biarkan AI bekerja per task. Beri waktu 35–40 menit untuk model gratis.",
      "5. Setelah selesai, jalankan \"Cara uji fitur\" di PRD bagian 7 dan cek dengan mata sendiri.", "",
      "## Perintah untuk AI", "```", PERINTAH.replace(/\n\n---\n\n$/, "") + "\n- PRD.md dan TASKS.md ada di folder ini. Mulai dari T0.", "```", "",
      `Template: ${d.repo || ""}`, "Hasil akhir tetap perlu dicek manusia. Untuk template yang sudah rapi, hasilnya \"beda\", belum tentu \"lebih bagus\".", "",
      "Template oleh @malikisaputra (malikisaputra.biz.id). Kredit & lisensi template wajib dipertahankan."].join("\n");
  }
  $("#p-paket").addEventListener("click", () => {
    if (!S.template) return;
    const z = buatZip([["PRD.md", buatMD()], ["TASKS.md", buatTask()], ["PETUNJUK.md", petunjuk()]]);
    const a = document.createElement("a"); a.href = URL.createObjectURL(z); a.download = `PRD-${S.template}.zip`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    const d = KODE[S.template]; if (d && d.zip) setTimeout(() => { const b = document.createElement("a"); b.href = d.zip; b.rel = "noopener"; b.click(); }, 900);
    catat(); try { fetch(SB + "/rest/v1/rpc/catat", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: S.template, p_jenis: "zip" }), keepalive: true }); } catch (_) {}
    toast("Mengunduh PRD + template. Bila template tidak terunduh, izinkan unduhan ganda di browser.");
  });

  /* ?template=<slug> dari kartu /kode */
  try { const q = new URLSearchParams(location.search).get("template"); if (q && PROFIL[q] && S.template !== q) { pakaiTemplate(q); aktif = 1; } } catch (_) {}

  /* demo hero: ide → PRD */
  (function demo() {
    const ketik = $("#p-demo-ketik"), list = $("#p-demo-list"), skor = $("#p-demo-skor"); if (!ketik) return;
    const IDE = ["Website agensi kreatif di Bogor", "Reels 30 detik: kantor AI", "Aplikasi invoice untuk warung"];
    const BAG = [["Ringkasan", "1"], ["Tujuan & ukuran", "2"], ["Pengguna", "3"], ["Struktur", "5 baris"], ["Arah desain", "editorial"], ["Kriteria selesai", "8"], ["Larangan", "5", "lar"], ["Task untuk AI", "T0–T6"]];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { ketik.textContent = IDE[0]; list.innerHTML = BAG.map(([a, b, c]) => `<li class="${c || ""}"><i>${c ? "!" : "✓"}</i>${a}<em>${b}</em></li>`).join(""); skor.textContent = "8/8"; return; }
    let k = 0; const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
    (async function loop() {
      for (;;) {
        const ide = IDE[k++ % IDE.length]; list.innerHTML = ""; skor.textContent = "0/8"; ketik.textContent = "";
        for (const ch of ide) { ketik.textContent += ch; await tidur(45); }
        await tidur(500);
        for (let i = 0; i < BAG.length; i++) { const [a, b, c] = BAG[i]; list.insertAdjacentHTML("beforeend", `<li class="${c || ""}"><i>${c ? "!" : "✓"}</i>${a}<em>${b}</em></li>`); skor.textContent = `${i + 1}/8`; await tidur(260); }
        await tidur(2600);
      }
    })();
  })();

  render();
})();
