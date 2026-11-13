# Kasir Laundry (offline + sinkron Google Sheets opsional)

Aplikasi kasir untuk usaha laundry kiloan & satuan. Jalan di browser HP, tablet, atau laptop, bisa di-install (PWA), dan tetap jalan tanpa internet. Kalau mau, order bisa dikirim ke Google Sheets lewat Google Apps Script supaya owner bisa cek dari luar kota lewat `owner.html`.

Dibuat atas request penonton **@okfian_ari**. Turunan dari Kasir Fotocopy / Kasir UMKM.

> **Jujur dulu:** tanpa URL Web App, semua data tetap **offline** di browser perangkat kasir (localStorage). Owner baru bisa memantau dari jauh setelah kamu memasang `apps-script/Code.gs` dan mengisi URL-nya di menu **Atur**. Ini bukan aplikasi multi-perangkat penuh: tiap HP kasir punya datanya sendiri, Google Sheets hanya menjadi salinan untuk dipantau.

## Fitur
- **Layanan kiloan** (per kg, berat desimal seperti `3,4`) dan **satuan** (bed cover, jas, sepatu, boneka) serta **karpet per m²**. Harga bisa diubah di menu Atur.
- **Paket waktu**: Reguler, Kilat (+50%), Express (+100%). Persen tambahan & lama pengerjaan bisa diubah; estimasi selesai terisi otomatis.
- **Order**: nama & no. WA pelanggan (otomatis tersimpan), item, berat, estimasi selesai, DP atau lunas, metode bayar, parfum, pisah warna, catatan.
- **Papan status** per kolom: Diterima → Dicuci → Disetrika → Siap ambil → Diambil. Tombol maju status di tiap kartu, filter per status, pencarian, tanda "lewat estimasi".
- **Nota**: struk 58mm siap cetak, tombol **WA nota** dan **WA siap ambil** (link `wa.me` + teks ter-encode).
- **Laporan** per bulan: omzet, uang masuk, kg per hari (grafik), omzet per hari, order belum diambil, piutang.
- **Pelanggan & riwayat**: total belanja, piutang, riwayat order, ubah nama/WA.
- Multi-kasir dengan PIN (Admin & Kasir), backup/pulihkan JSON, ekspor CSV.
- **Sinkron Google Sheets (opsional)**: kirim otomatis saat online, antrian lokal saat offline, tombol "Kirim sekarang".
- **owner.html**: dasbor read-only untuk owner (omzet hari ini & bulan ini, kg, status cucian, piutang, daftar belum diambil).

## Cara menjalankan (pemula)
1. Ekstrak ZIP. Coba dulu: buka `index.html` di Chrome (dobel klik). Untuk demo tanpa login: `index.html?demo` (data contoh, tidak disimpan).
2. Supaya bisa di-install dan jalan offline, unggah folder ke hosting HTTPS gratis (GitHub Pages / Netlify Drop).
3. Buka alamatnya di HP kasir → menu browser → **Install aplikasi / Tambahkan ke layar utama**.
4. Masuk sebagai **Admin (PIN 1234)**. Di menu **Atur**: ganti nama laundry, alamat, harga layanan, paket, lalu tambah kasir dan ganti PIN contoh.
5. Mulai terima cucian dari menu **Order**.

## Sinkron ke Google Sheets + dasbor owner (opsional)
1. Buka [sheets.new](https://sheets.new) (Google Sheet baru), beri nama mis. "Laundry – Order".
2. Menu **Ekstensi → Apps Script**. Hapus isi `Code.gs` bawaan, tempel isi `apps-script/Code.gs` dari paket ini.
3. Ganti baris `var KUNCI = 'ganti-kunci-rahasia';` dengan kata rahasia sendiri (mis. `laundry-wangi-2026`). Simpan.
4. (Opsional) pilih fungsi `setup` lalu **Jalankan**, beri izin akses ke Sheet. Sheet "Order" akan dibuat.
5. Klik **Terapkan (Deploy) → Deployment baru** → ikon roda → **Aplikasi web**.
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
   Klik **Terapkan**, izinkan, lalu salin **URL aplikasi web** (berakhiran `/exec`).
6. Di aplikasi kasir: **Atur → Sinkron Google Sheets** → tempel URL, isi kunci yang sama, centang "Kirim otomatis saat online", **Simpan**. Untuk order lama tekan **Antrikan semua order** lalu **Kirim sekarang**.
7. Owner membuka `owner.html` (di hosting yang sama atau file lokal), isi URL & kunci yang sama, klik **Muat ringkasan**.
8. Kalau `Code.gs` diubah, deploy ulang lewat **Kelola deployment → Edit → Versi baru** supaya URL tetap sama.

Catatan sinkron:
- Order dikirim sebagai teks JSON (`Content-Type: text/plain`) supaya tidak diblok CORS. Tiap order disimpan satu baris (kolom `id` dipakai untuk memperbarui baris yang sama saat status/pembayaran berubah). Kolom `json` berisi data lengkap.
- Saat offline, order masuk antrian lokal dan terkirim otomatis saat sinyal kembali (selama aplikasi terbuka).
- Hapus order di aplikasi **tidak** menghapus barisnya di Sheet. Hapus manual bila perlu.
- Kunci dikirim di URL saat owner memuat ringkasan; jangan bagikan link owner beserta kuncinya ke orang lain. Ini pengaman sederhana, bukan login.
- Kuota Apps Script akun Google gratis cukup untuk laundry kecil-menengah, tapi tetap ada batas harian dari Google.

## Struktur folder
```
kasir-laundry/
├─ index.html            kerangka aplikasi kasir
├─ style.css             tampilan (token turunan tema, responsif, cetak 58mm)
├─ app.js                semua logika (satu IIFE)
├─ owner.html            dasbor owner read-only (ambil ringkasan dari Web App)
├─ apps-script/Code.gs   doPost simpan order, doGet ringkasan
├─ tema.css / tema.js    warna, font, nama usaha (customizer Maliki Studio)
├─ sw.js                 cache offline (PWA)
├─ manifest.webmanifest, ikon.svg
├─ AGENTS.md, DESIGN.md, .claude/skills/ubah-kasir-laundry/SKILL.md
└─ LICENSE, README.md
```

## Ubah brand & warna
- Nama usaha: `tema.js` → `window.TEMA = { nama: "...", mode: "terang" }` (atau menu Atur → Profil usaha).
- Warna: `tema.css` → `--tema-utama` (tombol, kolom Siap ambil) dan `--tema-aksen` (grafik, badge). Warna lain diturunkan otomatis. Pilih warna utama yang cukup gelap supaya teks putih terbaca.
- Font: `--tema-font` + link Google Fonts di `index.html`.

## Ubah pakai Claude
- **Claude Code / Claude Desktop**: buka folder paket ini, skill `.claude/skills/ubah-kasir-laundry` terbaca otomatis.
- **claude.ai**: unggah ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode) lewat Customize › Skills › tombol "+" › Create skill › Upload a skill (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
- **impeccable** — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- **ui-ux-pro-max** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi & kredit
MIT + wajib atribusi (lihat `LICENSE`). Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra.

<!-- panduan-ai-maliki -->
## Ubah sendiri sesuai kebutuhanmu pakai AI

Kamu tidak perlu jago coding. Template ini sudah disiapkan supaya mudah diubah AI: ada **AGENTS.md** (aturan proyek untuk AI), **DESIGN.md** (gaya desain), dan skill Claude di folder `.claude/skills/`. Pilih salah satu cara di bawah.

### Cara 1: ChatGPT, Claude, atau Gemini di browser (paling gampang, gratis)
1. Unduh ZIP template ini, lalu ekstrak.
2. Buka chatgpt.com, claude.ai, atau gemini.google.com.
3. Unggah berkas yang mau diubah (biasanya `index.html`, `style.css`, `app.js`, atau berkas data). Unggah juga `AGENTS.md` dan `DESIGN.md` (kalau ada) biar AI paham aturannya. ChatGPT juga bisa menerima ZIP utuh.
4. Tulis permintaanmu (contoh di bawah), lalu minta: "Kirim ulang berkas yang diubah secara utuh."
5. Ganti berkas lama dengan hasil dari AI, lalu buka `index.html` di browser untuk cek.

### Cara 2: Claude Code (paling rapi untuk perubahan besar)
1. Pasang Claude Code (lihat claude.com/claude-code), atau pakai aplikasi Claude Desktop tab Code.
2. Buka folder template ini, lalu jalankan `claude` di terminal folder itu.
3. Tulis permintaanmu. Kalau ada folder `.claude/skills/ubah-…`, Claude Code otomatis memakainya, jadi hasilnya tetap mengikuti desain aslinya.

### Cara 3: Codex (OpenAI)
1. Pasang Codex CLI atau pakai Codex di aplikasi ChatGPT.
2. Buka folder template, jalankan `codex`. Codex otomatis membaca `AGENTS.md`.
3. Tulis permintaanmu, cek perubahannya, lalu setujui.

### Cara 4: Google Antigravity atau Gemini CLI (gratis)
1. Antigravity: buka aplikasinya, pilih **Open Folder** ke folder template ini, lalu tulis permintaan di panel agen.
2. Gemini CLI: jalankan `gemini` di folder template.
3. Di awal, tulis: "Baca AGENTS.md dan DESIGN.md dulu sebelum mengubah apa pun."

### Contoh permintaan yang bisa langsung kamu pakai
- "Ganti nama, logo teks, dan warna utama jadi hijau tua sesuai usahaku: [nama usaha]."
- "Tambahkan layanan Cuci Helm per pcs Rp25.000."
- "Tambahkan kolom alamat antar-jemput di order dan tampilkan di nota."
- "Ubah teks pesan WhatsApp siap ambil jadi lebih santai."
- "Jelaskan dulu cara kerja sinkron Google Sheets dengan bahasa sederhana, baru ubah [bagian]."

### Tips biar hasilnya bagus
- Satu permintaan = satu perubahan. Cek dulu hasilnya, baru minta yang berikutnya.
- Simpan salinan folder asli sebelum mengubah, jadi bisa balik kalau ada yang rusak.
- Kalau ada error, salin pesan errornya (klik kanan > Inspect > Console) lalu tempel ke AI.
- Data aplikasi tersimpan di browser (localStorage). Backup dulu sebelum ganti versi.
- Jangan hapus kredit "Template oleh @malikisaputra", dan template ini **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya (@malikisaputra).

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
