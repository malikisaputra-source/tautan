# Absensi Kelas Guru (offline)

Aplikasi absen siswa untuk guru. Satu ketukan per siswa, rekap bulanan otomatis, ekspor Excel, dan cetak A4. Jalan di browser HP atau laptop, bisa di-install (PWA), dan tetap jalan tanpa internet.

Dibuat dari request penonton **@bang_yos15**. Turunan dari paket Absensi Karyawan.

## Fitur
- Banyak kelas, tiap kelas bisa beberapa mapel (mis. VII-A: Matematika, IPA).
- Daftar siswa per kelas: tambah manual, **impor CSV**, atau **tempel langsung dari Excel/Google Sheets**.
- Absen harian: tombol **H / S / I / A** per siswa, bawaan hadir, tombol **Semua hadir**, simpan otomatis.
- Pilih tanggal (panah hari sebelum/sesudah) untuk mengisi atau mengoreksi absen lama.
- Catatan per pertemuan: materi, PR, kejadian.
- Rekap bulanan per siswa (persentase hadir, jumlah S/I/A) dan per kelas, tanda siswa dengan kehadiran < 80%.
- Ekspor **Excel (.xlsx)** lewat SheetJS (dimuat dari cdnjs saat tombol diklik). Kalau gagal/offline, otomatis jadi **CSV**.
- **Cetak rekap A4** lengkap dengan baris jumlah dan kolom tanda tangan guru.
- Backup & pulihkan JSON. Mode gelap. Coba data contoh: buka `index.html?demo`.

## Data pribadi siswa
Nama, NIS, dan absen siswa adalah **data pribadi**. Aplikasi ini **tidak mengirim data ke server mana pun**: semuanya tersimpan di browser perangkat yang dipakai (localStorage, kunci `absensi-kelas-guru-v1`). Konsekuensinya:
- Data tidak otomatis pindah ke HP/laptop lain. Pakai **Atur → Unduh backup JSON** lalu **Pulihkan** di perangkat baru.
- Menghapus data browser/cache situs = data absen ikut hilang. Backup rutin, misalnya tiap akhir bulan.
- Simpan berkas backup & ekspor Excel di tempat aman, jangan disebar di grup publik.
- Data contoh di `?demo` seluruhnya fiktif dan tidak disimpan.

## Cara menjalankan (pemula)
1. Unduh ZIP paket ini, lalu ekstrak.
2. Coba dulu: klik dua kali `index.html` (atau `index.html?demo` untuk data contoh). Fitur offline/install butuh langkah 3.
3. Unggah folder ke hosting HTTPS gratis, misalnya GitHub Pages atau Netlify (seret folder ke app.netlify.com/drop).
4. Buka alamatnya di HP, lalu menu browser → **Tambahkan ke layar utama / Install**.
5. Menu **Kelas & Siswa** → **Kelas baru** → isi nama kelas dan mapel (pisahkan koma).
6. **Tempel dari Excel**: blok kolom NIS, Nama, L/P di Excel → salin → tempel. Baris judul dilewati otomatis.
7. Tiap pertemuan buka **Absen**, pilih kelas & mapel, ketuk S/I/A untuk yang tidak hadir. Selesai.
8. Akhir bulan buka **Rekap** → **Excel** atau **Cetak A4**.

### Format CSV siswa
```
NIS,Nama,L/P
2501,Adit Pratama,L
2502,"Lestari, Bunga",P
```
Pemisah koma, titik koma, atau tab. Kolom NIS dan L/P boleh kosong.

## Struktur folder
```
absensi-kelas-guru/
├── index.html              kerangka halaman
├── style.css               tampilan (turunan token tema) + cetak A4
├── app.js                  logika: data, absen, siswa, rekap, ekspor
├── tema.css / tema.js      token tema (warna, radius, font, nama sekolah)
├── sw.js                   service worker (offline)
├── manifest.webmanifest    PWA
├── ikon.svg, img/papan.svg ikon & ilustrasi (SVG buatan sendiri)
├── AGENTS.md, DESIGN.md    panduan untuk AI & desain
└── .claude/skills/ubah-absensi-kelas-guru/SKILL.md
```

## Ubah brand/warna
- Nama sekolah bawaan: `tema.js` → `nama`. Bisa juga di menu **Atur**.
- Warna: `tema.css` → `--tema-utama` (hijau papan tulis) dan `--tema-aksen` (kuning kapur). Warna lain menyesuaikan otomatis; teks di atas tombol dihitung terang/gelap otomatis. Pilih warna utama yang cukup gelap supaya teks putih terbaca.
- Mode: `tema.js` → `mode: "terang" | "gelap" | "auto"`.
- Warna status H/S/I/A sengaja tetap (hijau/biru/kuning/merah) supaya mudah dibaca.
- Setelah mengubah berkas, naikkan `CACHE` di `sw.js` agar HP mengambil versi baru.

## Ubah pakai Claude
(a) **Claude Code / Claude Desktop**: buka folder paket ini; skill di `.claude/skills/ubah-absensi-kelas-guru` terbaca otomatis.
(b) **claude.ai**: unggah ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode) lewat Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT + syarat atribusi & tidak untuk diperjualbelikan (lihat `LICENSE`). SheetJS Community Edition (Apache-2.0) dimuat dari CDN, tidak disertakan di paket.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra.

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
