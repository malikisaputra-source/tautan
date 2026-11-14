# Kalender Kerja Harian

Aplikasi jadwal kerja harian yang mengingatkan lewat HP dan laptop. Garis waktu berjam dengan blok warna per kategori, tampilan minggu, seret-lepas, pengingat notifikasi, dan ekspor ke Google/Apple Calendar. Tanpa server, tanpa login: data tersimpan di browser.

## Fitur
- Garis waktu harian per jam, garis merah jam sekarang, klik jam kosong untuk menambah
- Blok berwarna per kategori (Kerja, Rapat, Pribadi, Istirahat) dan filter kategori
- Tampilan minggu dan strip tanggal untuk pindah hari (geser kiri/kanan di HP)
- Seret blok untuk pindah jam/hari, tarik tepi bawah untuk ubah lama, ada tombol Urungkan
- Kartu **Sekarang & Berikutnya**: progres, hitung mundur, x/y selesai
- Pengingat 5/10/30/60 menit sebelumnya lewat notifikasi browser (service worker bila tersedia), cadangan kotak pengingat di layar
- Jadwal berulang: setiap hari, hari kerja (Sen–Jum), setiap minggu
- **+ Google Calendar** dan **.ics** (Apple Calendar, Outlook) per acara atau semua sekaligus, lengkap dengan pengingat dan aturan ulang
- Ekspor CSV (Excel/Google Sheets), backup & pulihkan JSON
- PWA: bisa dipasang di layar utama dan jalan offline; mode gelap; pintasan keyboard

## Cara menjalankan
1. Ekstrak ZIP, lalu klik dua kali `index.html`. Aplikasi langsung jalan dengan contoh jadwal.
2. Buka **Pengaturan & data** › **Hapus jadwal contoh** bila ingin mulai bersih.
3. Klik **Tambah jadwal** (atau tekan `N`), isi nama, jam, lama, kategori, dan pengingat.
4. Klik **Izinkan notifikasi** di bagian Pengingat.
5. Agar bisa dipasang di HP dan notifikasi lebih andal, unggah folder ke GitHub Pages/Netlify (gratis), buka alamatnya di Chrome HP, lalu menu ⋮ › **Tambahkan ke layar utama**. Di iPhone: Safari › Bagikan › **Tambah ke Layar Utama**.

> Catatan pengingat: tanpa server push, notifikasi muncul selama browser masih berjalan (tab boleh di belakang). Saat dibuka dari berkas lokal (`file://`), service worker tidak aktif, jadi notifikasi memakai `new Notification` biasa. Untuk pengingat yang pasti berbunyi walau HP terkunci, ekspor ke Google Calendar/.ics.

Pintasan: `N` tambah · `T` hari ini · `H` hari · `M` minggu · `←/→` pindah · pada blok: `Enter` ubah, `Alt+↑/↓` geser 15 menit, `Alt+Shift+↑/↓` ubah lama, `Delete` hapus.

`index.html?demo` = mode pratinjau: jam dibekukan ke 10.20 dan data tidak disimpan.

## Struktur folder
```
kalender-kerja/
├─ index.html            kerangka halaman & dialog
├─ style.css             tampilan (token di DESIGN.md)
├─ app.js                logika: data, jadwal berulang, seret, pengingat, ekspor
├─ tema.css / tema.js    warna, sudut, font, nama usaha, mode
├─ sw.js                 service worker (offline + klik notifikasi)
├─ manifest.webmanifest  PWA
├─ ikon.svg              ikon aplikasi
├─ DESIGN.md · AGENTS.md · .claude/skills/ubah-kalender-kerja/SKILL.md
└─ README.md · LICENSE · meta.json · ss.png
```

## Ubah brand & warna
- Nama usaha dan mode bawaan: `tema.js` (`nama`, `mode: "terang" | "gelap" | "auto"`).
- Warna, sudut, font: `tema.css`. Semua warna lain diturunkan otomatis. Teks di atas warna utama dipilih putih/gelap otomatis agar tetap terbaca; bila memilih warna utama sangat terang, cek tombol tetap jelas.
- Kategori & warnanya: array `KAT` di `app.js` dan variabel `--k-…` di `style.css`.

## Ubah pakai Claude
- **Claude Code / Claude Desktop**: buka folder ini. Skill di `.claude/skills/ubah-kalender-kerja` terbaca otomatis; cukup minta, misalnya "tambah kategori Kuliah warna biru".
- **claude.ai**: unduh ZIP skill (tombol **Unduh Skill** di malikisaputra.biz.id/kode), lalu di claude.ai buka Customize › Skills › tombol **+** › Create skill › **Upload a skill**, pilih ZIP-nya (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain berikut di Claude Code sebelum meminta perubahan tampilan:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh **Maliki Studio** — malikisaputra.biz.id · follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto
- Semua path gambar ada di `window.KONFIG` di baris atas `app.js` (`logo`, `profil`).
- Cara termudah: timpa `img/logo.svg` (persegi, mis. 256×256, boleh PNG/JPG asal path diubah) dan `img/profil.svg` (foto profil bawaan, persegi).
- Bila logo gagal dimuat, header otomatis menampilkan inisial nama usaha.
- Pengguna bisa mengunggah foto profil sendiri di **Pengaturan & data › Foto profil**; foto diperkecil ≤400px dan disimpan di browser (localStorage). "Pakai bawaan" mengembalikannya.

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
- "Tambahkan kolom [nama kolom] di formulir dan tampilkan di daftar."
- "Ubah semua data contoh jadi data usahaku: [tempel datanya]."
- "Tambahkan halaman/menu baru untuk [kebutuhan], gaya desainnya sama dengan yang sudah ada."
- "Jelaskan dulu cara kerja aplikasi ini dengan bahasa sederhana, baru ubah [bagian]."

### Tips biar hasilnya bagus
- Satu permintaan = satu perubahan. Cek dulu hasilnya, baru minta yang berikutnya.
- Simpan salinan folder asli sebelum mengubah, jadi bisa balik kalau ada yang rusak.
- Kalau ada error, salin pesan errornya (klik kanan > Inspect > Console) lalu tempel ke AI.
- Data aplikasi tersimpan di browser (localStorage). Backup dulu sebelum ganti versi.
- Jangan hapus kredit "Template oleh @malikisaputra", dan template ini **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya (@malikisaputra).

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
