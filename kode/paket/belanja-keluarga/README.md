# Anggaran Belanja Keluarga

Aplikasi web sederhana untuk mengatur uang bulanan keluarga dengan sistem **amplop**: tiap kategori (dapur, listrik & air, sekolah, transport, jajan, dll.) punya batas sendiri. Catat belanja dalam hitungan detik, lihat sisa uang bulan ini dalam angka besar, dan dapat peringatan saat amplop hampir habis. Tanpa server, tanpa login, data tersimpan di HP/laptop sendiri.

![Tangkapan layar](ss.png)

## Fitur
- **Sisa uang bulan ini** dalam angka besar + berapa yang **aman dipakai per hari** sampai gajian berikutnya.
- **Amplop per kategori** dengan cincin & batang: hijau aman, kuning saat ≥80%, merah saat lewat batas.
- **Spanduk peringatan** yang menyebut amplop mana yang hampir habis / sudah lewat.
- **Catat belanja cepat**: tombol +10rb/+25rb/+50rb/+100rb, pilih amplop, catatan, tanggal. Klik kartu amplop untuk langsung mencatat di amplop itu.
- **Geser sisa** dari satu amplop ke amplop lain (berlaku untuk bulan itu; total pemasukan tidak berubah).
- **Ringkasan** minggu ini / sebulan: total, rata-rata per hari, hari paling boros, grafik per hari, porsi per amplop, perbandingan dengan periode sebelumnya.
- **Riwayat** per hari dengan cari, saring amplop, ubah, dan hapus (bisa diurungkan).
- **Target tabungan** dengan cincin progres, setoran cepat, dan saran sisihan per bulan.
- **Ekspor CSV** (buka di Excel/Google Sheets), **backup & pulihkan JSON**.
- Mode terang/gelap, rapi di HP (nav bawah + tombol +) dan laptop (sidebar), aksesibel, animasi halus (otomatis mati bila perangkat minta gerak dikurangi).

## Cara menjalankan (pemula)
1. Unduh ZIP paket ini, lalu ekstrak.
2. Klik dua kali `index.html` — terbuka di browser. Sudah ada **data contoh** keluarga fiktif.
3. Buka menu **Atur**: isi pemasukan per bulan dan tanggal gajian.
4. Ubah nama & batas tiap amplop (ikon pensil), atau tambah amplop baru.
5. Mau mulai dari nol? **Atur › Hapus semua belanja**.
6. Supaya bisa dibuka di HP kapan saja: unggah folder ke GitHub Pages / Netlify (gratis), buka alamatnya di HP, lalu **Tambah ke layar utama**.

## Struktur folder
```
belanja-keluarga/
├─ index.html     kerangka halaman, ikon SVG, dialog
├─ style.css      tampilan (warna diturunkan dari tema.css)
├─ app.js         data, hitungan anggaran, render halaman, ekspor
├─ tema.css       4 warna dasar + warna bagian (diubah customizer)
├─ tema.js        nama keluarga & mode terang/gelap
├─ ikon.svg       ikon tab
├─ DESIGN.md      token, komponen, aturan motion
├─ AGENTS.md      ringkasan untuk AI coding agent
└─ .claude/skills/ubah-belanja-keluarga/SKILL.md
```

## Ubah brand & warna
- Nama di aplikasi: `tema.js` → `nama: "Keluarga Pratama"`; mode: `"terang"`, `"gelap"`, atau `"auto"`.
- Warna: `tema.css` → `--tema-utama` (tombol, kartu sisa uang), `--tema-aksen` (tombol Catat, sorotan), `--tema-radius`, `--tema-font`, plus `--tema-latar/panel/nav/teks`. Semua warna lain diturunkan otomatis. Teks di atas warna utama & nav dihitung otomatis putih/gelap, tapi pilih warna utama yang cukup gelap agar tombol mudah dibaca.
- Warna status amplop (hijau/kuning/merah) sengaja tetap supaya artinya selalu jelas; ubah di `style.css` (`--aman`, `--waspada`, `--lewat`).
- Atau pakai customizer di [malikisaputra.biz.id/kode](https://malikisaputra.biz.id/kode).

## Ganti logo & foto
- Logo (sidebar): timpa `img/logo.svg` dengan logo kamu (persegi, mis. 200×200), atau ubah path di `KONFIG.logo` paling atas `app.js` (boleh `.png`/`.jpg`). Bila gambar gagal dimuat, tampil inisial nama.
- Foto profil (pojok kanan atas): bawaan `img/avatar.svg` (`KONFIG.avatar`). Pengguna bisa mengunggah fotonya sendiri di menu **Atur › Foto profil**; foto diperkecil ke maks 400px dan disimpan di perangkat (ikut Backup JSON).

## Ubah pakai Claude
Paket ini membawa Agent Skill di `.claude/skills/ubah-belanja-keluarga/SKILL.md` (peta berkas, letak tema, cara menambah fitur, aturan aman), `AGENTS.md` untuk Cursor/Copilot/Codex, dan `DESIGN.md`.

- **Claude Code / Claude Desktop**: buka folder paket ini; skill di `.claude/skills` terbaca otomatis. Tinggal minta, misal "tambah amplop Zakat & sedekah dengan batas 300 ribu".
- **claude.ai**: unduh ZIP skill (tombol **Unduh Skill** di [malikisaputra.biz.id/kode](https://malikisaputra.biz.id/kode)), lalu di claude.ai buka **Customize › Skills › tombol "+" › Create skill › Upload a skill** dan pilih ZIP itu (folder skill sebagai akar ZIP). Syarat: **Code execution and file creation** aktif di **Settings › Capabilities** (paket Free/Pro/Max); di Team/Enterprise diatur oleh Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code sebelum minta perubahan tampilan besar:
- **impeccable** — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- **ui-ux-pro-max** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Catatan penting
- Data tersimpan di browser perangkat (localStorage). Menghapus data situs/browser = data hilang. **Rajin backup JSON** dan simpan di Google Drive.
- Data tidak sinkron otomatis antar-HP; pindahkan lewat Backup JSON › Pulihkan.

## Lisensi
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

---
Dibuat oleh **Maliki Studio** — [malikisaputra.biz.id](https://malikisaputra.biz.id), follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

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
