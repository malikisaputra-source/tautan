/* kredit-maliki: Pembuat PRD oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id
   Aturan isi PRD dari riset: ISO/IEC/IEEE 29148, EARS (Mavin 2009), Lucassen 2016, Femmer 2017,
   FollowBench (ACL 2024), CodeHalu (AAAI 2025). Alur form: Peytchev 2006, Seckler CHI 2014. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const SIMPAN = "ms-prd-v1";
  const SB = "https://qsoejsauqlfkchxtnumm.supabase.co", KEY = "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW";

  const JENIS = {
    website: { nama: "Website", ik: "</>", ket: "Landing page, company profile, portofolio, toko sederhana.",
      label: "Bagian halaman", kolom: ["Bagian", "Isi wajib"], ph: ["Hero", "Judul, sub-judul, tombol WhatsApp"],
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
      label: "Slide", kolom: ["Slide", "Isi pokok"], ph: ["Masalah", "3 poin masalah pelanggan, satu kalimat per poin"],
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
      label: "Fitur / layar", kolom: ["Fitur", "Yang bisa dilakukan pengguna"], ph: ["Buat invoice", "Isi nama klien, item, harga; total terhitung otomatis"],
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

  const LANGKAH = [
    { id: "jenis", l: "Jenis proyek" },
    { id: "tujuan", l: "Ringkasan & tujuan" },
    { id: "pengguna", l: "Pengguna" },
    { id: "struktur", l: "Struktur" },
    { id: "lingkup", l: "Lingkup & teknis" },
    { id: "larangan", l: "Fakta & larangan" },
  ];

  const kosong = () => ({ jenis: "", nama: "", ringkas: "", tujuan: "", ukuran: "", pengguna: "", baris: [], masuk: "", keluar: "", teknis: "", gaya: "", fakta: "", larangan: [...BAWAAN_LAR], larLain: "" });
  let S = kosong(), aktif = 0;
  try { const t = JSON.parse(localStorage.getItem(SIMPAN)); if (t && typeof t === "object") { S = { ...S, ...t.s }; aktif = Math.min(t.a | 0, LANGKAH.length - 1); } } catch (_) {}
  const simpan = () => { try { localStorage.setItem(SIMPAN, JSON.stringify({ s: S, a: aktif })); } catch (_) {} };

  const CONTOH = {
    website: { nama: "Kilau Kreatif", ringkas: "Website satu halaman untuk agensi kreatif di Bogor. Calon klien paham layanan dalam 30 detik, lalu menghubungi lewat WhatsApp.",
      tujuan: "Pengunjung paham apa yang dijual\nPengunjung bisa menghubungi\nRapi di HP & laptop",
      ukuran: "Hero menyebut 3 layanan dalam satu kalimat; tiap layanan punya kartu\nTombol WhatsApp ada di hero, kontak, dan tombol mengambang di HP\nTidak ada scroll ke samping di lebar 375 px",
      pengguna: "Staf humas instansi: butuh dokumentasi acara, buka dari HP saat rapat\nHR perusahaan: butuh video profil, buka dari laptop kantor\nPemilik UMKM: butuh foto produk, buka dari HP",
      baris: [["Header lengket", "Nama \"Kilau Kreatif\", menu Layanan · Cara Kerja · Kontak, tombol Chat WhatsApp"], ["Hero", "Judul \"Cerita brand kamu, dibuat terlihat.\", tombol Chat WhatsApp"], ["Layanan", "3 kartu: Produksi Video, Desain Visual, Fotografi"], ["Cara kerja", "4 langkah bernomor: brief, penawaran, produksi & revisi, file final"], ["Kontak", "WhatsApp, email, Instagram, alamat Bogor"]],
      masuk: "Satu halaman index.html + style.css + script.js\nBahasa Indonesia", keluar: "Login, blog, formulir yang menyimpan data, multi-bahasa",
      teknis: "HTML/CSS/JS biasa tanpa framework, bisa dibuka dengan klik dua kali\nKontras teks minimal 4.5:1, satu <h1>\nTotal file di bawah 200 KB tanpa font",
      gaya: "Latar krem, aksen oranye bata, font Plus Jakarta Sans untuk judul",
      fakta: "WhatsApp: 0812-0000-0000 (Raka)\nEmail: halo@kilaukreatif.test\nInstagram: @kilaukreatif\nAlamat: Bogor, Jawa Barat",
      larangan: ["angka", "harga", "testi", "janji", "stok", "lingkup"], larLain: "Jangan membuat formulir yang mengirim data ke server." },
    reels: { nama: "Kantor AI (30 detik)", ringkas: "Reels 30 detik yang memperkenalkan 6 agen AI yang bekerja seperti karyawan, ditutup ajakan mengambil template gratis.",
      tujuan: "Penonton paham ada 6 agen dan tugasnya\nPenonton tahu template-nya gratis", ukuran: "Keenam nama agen dan tugasnya muncul di layar\nKalimat penutup \"Link di bio\" tampil minimal 2 detik",
      pengguna: "Penonton TikTok/IG pemilik usaha kecil yang penasaran dengan AI, menonton dari HP tanpa suara",
      baris: [["0–3 dtk", "Hook besar di tengah", "\"6 karyawan. Semuanya AI.\""], ["3–15 dtk", "Enam kartu agen bergantian, 2 detik per agen", "Raka · cari tender, Sekar · cari klien, Gilang · riset pasar, Riska · keuangan, Esok · konsep acara, Lita · desain"], ["15–27 dtk", "Satu hari kerja: pagi, sore, malam", "\"Pagi · radar tender\", \"Sore · menulis laporan\", \"Malam · belajar\""], ["27–30 dtk", "Penutup", "\"Template kantornya gratis. Link di bio.\""]],
      masuk: "Video 30 detik tanpa audio wajib", keluar: "Musik, voice over, subtitle otomatis",
      teknis: "Remotion, komposisi KantorAI 1080×1920, 30 fps, 900 frame\nPerintah: npm run still lalu npm run render",
      gaya: "Latar gelap, teks putih besar, satu warna aksen per agen; teks penting di x 100–980",
      fakta: "", larangan: ["angka", "janji", "nama", "lingkup"], larLain: "" },
    deck: { nama: "Pitch Kopi Lereng", ringkas: "Deck 8 slide untuk mengajukan kerja sama pasokan kopi ke 3 kafe di Malang.",
      tujuan: "Pemilik kafe paham keunggulan kopi\nPemilik kafe mau jadwalkan cicip", ukuran: "Slide keunggulan memuat 3 poin dari bagian Fakta\nSlide terakhir berisi satu ajakan dan kontak",
      pengguna: "Pemilik kafe: sibuk, membaca di HP atau laptop dalam 3 menit",
      baris: [["Judul", "Nama brand + satu kalimat janji rasa"], ["Masalah", "Kafe sulit dapat biji kopi segar dengan pasokan tetap"], ["Solusi", "Pasokan mingguan dari kebun sendiri"], ["Keunggulan", "3 poin dari bagian Fakta"], ["Ajakan", "Jadwalkan sesi cicip gratis, kontak WhatsApp"]],
      masuk: "8 slide, bahasa Indonesia", keluar: "Grafik penjualan, perbandingan dengan merek lain",
      teknis: "16:9, Google Slides, font maksimal 2 jenis", gaya: "Warna cokelat tua dan krem, foto diganti tanda tempat [GAMBAR: …]",
      fakta: "Kebun di lereng Arjuno, ketinggian 1.200 mdpl\nSangrai setiap Senin\nWhatsApp 0812-0000-0000", larangan: ["angka", "harga", "testi", "janji", "lingkup"], larLain: "" },
    app: { nama: "Invoice Warung", ringkas: "Aplikasi web satu file untuk membuat dan mencetak invoice sederhana, dipakai pemilik usaha kecil dari HP.",
      tujuan: "Membuat invoice kurang dari 1 menit\nInvoice bisa dicetak atau disimpan PDF", ukuran: "Invoice berisi 3 item bisa dibuat dalam 60 detik\nTombol cetak menghasilkan satu halaman A4 rapi",
      pengguna: "Pemilik warung/UMKM: memakai HP, tidak paham teknis, sering offline",
      baris: [["Buat invoice", "Isi nama klien, tanggal, item, jumlah, harga; total terhitung otomatis"], ["Daftar invoice", "Melihat, mencari, dan menghapus invoice lama"], ["Cetak", "Mencetak atau menyimpan PDF lewat dialog cetak browser"], ["Pengaturan", "Mengisi nama usaha, alamat, dan logo teks"]],
      masuk: "Satu file index.html, data di localStorage", keluar: "Login, sinkron awan, pajak otomatis, pembayaran online",
      teknis: "HTML/CSS/JS tanpa library, bekerja offline\nFormat rupiah Indonesia (Rp 12.500)", gaya: "Putih bersih, aksen hijau, tombol besar minimal 44 px",
      fakta: "", larangan: ["angka", "harga", "nama", "lingkup"], larLain: "Jangan mengirim data ke server mana pun." },
  };

  /* ---------- tampilan langkah ---------- */
  const panel = $("#p-panel"), stepper = $("#p-stepper");
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const J = () => JENIS[S.jenis] || JENIS.website;

  function isian(key, label, { wajib, cth, ph, area } = {}) {
    const tag = wajib ? '<span class="tag wajib">wajib</span>' : '<span class="tag">opsional</span>';
    const el = area ? `<textarea id="f-${key}" data-k="${key}" placeholder="${esc(ph || "")}">${esc(S[key])}</textarea>`
      : `<input type="text" id="f-${key}" data-k="${key}" value="${esc(S[key])}" placeholder="${esc(ph || "")}">`;
    return `<div class="p-isian" data-isian="${key}"><label for="f-${key}">${label}${tag}</label>${el}${cth ? `<p class="cth">${cth}</p>` : ""}<p class="samar" hidden></p><p class="salah" hidden></p></div>`;
  }

  function render() {
    stepper.innerHTML = LANGKAH.map((l, i) => `<li class="${i === aktif ? "aktif" : ""} ${i < aktif && lengkap(i) ? "selesai" : ""}"><button type="button" data-ke="${i}" ${i === aktif ? 'aria-current="step"' : ""}><span class="n">${i < aktif && lengkap(i) ? "✓" : i + 1}</span><span class="l">${l.l}</span></button></li>`).join("");
    const j = J(); let h = "";
    switch (LANGKAH[aktif].id) {
      case "jenis":
        h = `<h2>Mau bikin apa?</h2><p class="bantu">Pertanyaan berikutnya menyesuaikan jenis proyek.</p><div class="p-jenis" role="radiogroup" aria-label="Jenis proyek">` +
          Object.entries(JENIS).map(([k, v]) => `<label><input type="radio" name="jenis" value="${k}" ${S.jenis === k ? "checked" : ""}><span class="ik">${esc(v.ik)}</span><b>${v.nama}</b><small>${v.ket}</small></label>`).join("") + `</div>`;
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
        const r = S.jenis === "reels" ? " reels" : "";
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
          isian("gaya", "Gaya tampilan", { area: 1, ph: "Latar gelap, aksen biru, font Space Grotesk", cth: "Sebut warna, font, atau acuan, bukan \"modern\" atau \"elegan\"." });
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
    const j = J(), r = S.jenis === "reels" ? " reels" : "";
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
    o.push(`# PRD · ${j.nama} "${S.nama.trim() || ISI("nama proyek")}"`, "");
    o.push(`Versi 1 · ${tgl} · Dibuat dengan Pembuat PRD (malikisaputra.biz.id/prd)`, "");
    o.push("## 1. Ringkasan", S.ringkas.trim() || ISI("1–2 kalimat: apa yang dibuat, untuk siapa, hasil yang diharapkan"), "");
    const tj = baris_(S.tujuan), uk = baris_(S.ukuran);
    o.push("## 2. Tujuan & ukuran berhasil", "| # | Tujuan | Ukuran berhasil (bisa dicek) |", "|---|---|---|");
    if (!tj.length) o.push(`| 1 | ${ISI("tujuan")} | ${ISI("cara mengecek")} |`);
    tj.forEach((t, i) => o.push(`| T${i + 1} | ${sel(t)} | ${uk[i] ? sel(uk[i]) : ISI("cara mengecek")} |`));
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
    bs.forEach((b, i) => o.push(`| ${i + 1} | ${j.kolom.map((_, k) => (b[k] && b[k].trim()) ? sel(b[k]) : ISI(j.kolom[k].toLowerCase())).join(" | ")} |`));
    o.push("");
    o.push("## 6. Persyaratan");
    const tk = baris_(S.teknis);
    (tk.length ? tk : [ISI(j.teknisPh)]).forEach((x, i) => o.push(`- R${i + 1}. ${x}`));
    const gy = baris_(S.gaya);
    if (gy.length) gy.forEach((x, i) => o.push(`- G${i + 1}. ${x}`));
    o.push("");
    o.push("## 7. Fakta yang boleh dipakai");
    const fk = baris_(S.fakta);
    if (fk.length) { fk.forEach((x) => o.push(`- ${x}`)); o.push("", "Hanya fakta di atas yang boleh muncul. Selain itu tulis tanda [ISI: …]."); }
    else o.push("Belum ada. Bila butuh kontak, harga, atau angka, tulis tanda [ISI: …] dan jangan mengarang.");
    o.push("");
    o.push("## 8. Larangan (penting)");
    LARANGAN.filter(([k]) => S.larangan.includes(k)).forEach(([, t]) => o.push(`- ${t}`));
    baris_(S.larLain).forEach((x) => o.push(`- ${x}`));
    o.push("");
    o.push("## 9. Kriteria selesai");
    let n = 1;
    tj.forEach((t, i) => { if (uk[i]) o.push(`${n++}. Ketika hasil dicek untuk tujuan T${i + 1}, maka ${uk[i].replace(/^./, (c) => c.toLowerCase())}.`); });
    j.kriteria.forEach((k) => o.push(`${n++}. ${k}`));
    o.push(`${n++}. Ketika seluruh hasil dibaca, maka tidak ada yang melanggar bagian 8 (Larangan).`);
    o.push("");
    o.push("## 10. Langkah kerja (ikuti berurutan, jangan berhenti di tengah)");
    j.langkah.forEach((l, i) => o.push(`${i + 1}. ${l}`));
    o.push("");
    return o.join("\n");
  }

  const PERINTAH = "Kamu akan mengerjakan proyek sesuai PRD di bawah.\n" +
    "- Baca PRD sampai habis sebelum mulai.\n- Ikuti PRD persis. Jangan menambah apa pun di luar PRD.\n" +
    "- Bila ada tanda [ISI: …] atau bagian yang tidak jelas, tanyakan dulu ke saya dalam satu daftar pertanyaan.\n" +
    "- Setelah selesai, cek bagian 9 (Kriteria selesai) satu per satu dan laporkan hasilnya.\n\n---\n\n";

  function sorot(md) {
    return md.split("\n").map((l) => {
      let e = esc(l).replace(/\[ISI: [^\]]*\]/g, (m) => `<span class="isi">${m}</span>`);
      if (/^# /.test(l)) return `<span class="h1">${e}</span>`;
      if (/^## /.test(l)) return `<span class="h">${e}</span>`;
      if (/^\|/.test(l)) return `<span class="t">${e}</span>`;
      return e;
    }).join("\n");
  }

  let mdLama = "";
  function perbarui() {
    const md = buatMD(); const pre = $("#p-md");
    if (md !== mdLama) {
      const lama = mdLama.split("\n"); const baru = md.split("\n");
      pre.innerHTML = sorot(md).split("\n").map((h, i) => mdLama && baru[i] !== lama[i] ? `<span class="baru">${h || " "}</span>` : h).join("\n");
      mdLama = md;
    }
    const sisa = (md.match(/\[ISI: /g) || []).length;
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
    if (t.name === "jenis") { S.jenis = t.value; perbarui(); setTimeout(() => ke(1), 260); }
    if (t.hasAttribute("data-lar")) { S.larangan = [...panel.querySelectorAll("[data-lar]:checked")].map((x) => x.value); perbarui(); }
  });
  panel.addEventListener("click", (e) => {
    if (e.target.id === "p-tambah") { if (!S.baris.length) S.baris.push([]); S.baris.push([]); render(); const ins = panel.querySelectorAll(".p-baris input"); ins[ins.length - J().kolom.length]?.focus(); }
    const h = e.target.closest(".p-hapus"); if (h) { const i = +h.closest(".p-baris").dataset.i; S.baris.splice(i, 1); render(); }
  });
  stepper.addEventListener("click", (e) => { const b = e.target.closest("[data-ke]"); if (b) ke(+b.dataset.ke); });
  $("#p-maju").addEventListener("click", () => { if (!validasi()) return; if (aktif < LANGKAH.length - 1) ke(aktif + 1); else { $("#p-hasil").scrollIntoView({ behavior: "smooth", block: "start" }); toast("PRD siap. Salin atau unduh di panel kanan."); } });
  $("#p-mundur").addEventListener("click", () => ke(aktif - 1));
  $("#p-contoh").addEventListener("click", () => {
    const j = S.jenis || "website"; S = { ...kosong(), ...JSON.parse(JSON.stringify(CONTOH[j])), jenis: j }; mdLama = ""; ke(1); toast(`Contoh ${JENIS[j].nama} dimuat.`);
  });
  $("#p-reset").addEventListener("click", () => { if (!confirm("Hapus semua isian dan mulai ulang?")) return; S = kosong(); mdLama = ""; ke(0); });

  function toast(t) { const el = $("#toast"); if (!el) return; el.textContent = t; el.classList.add("tampil"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("tampil"), 2400); }
  function catat() { try { fetch(SB + "/rest/v1/rpc/catat", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: "prd", p_jenis: "zip" }), keepalive: true }); } catch (_) {} }
  async function salin(t, pesan) {
    try { await navigator.clipboard.writeText(t); } catch (_) { const a = document.createElement("textarea"); a.value = t; document.body.append(a); a.select(); document.execCommand("copy"); a.remove(); }
    toast(pesan); catat();
  }
  $("#p-salin").addEventListener("click", () => salin(buatMD(), "PRD disalin."));
  $("#p-salin-perintah").addEventListener("click", () => salin(PERINTAH + buatMD(), "PRD + perintah disalin. Tempel ke ChatGPT, Claude, GLM, atau DeepSeek."));
  $("#p-unduh").addEventListener("click", () => {
    const b = new Blob([buatMD()], { type: "text/markdown;charset=utf-8" }); const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "PRD.md"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast("PRD.md diunduh."); catat();
  });

  render();
})();
