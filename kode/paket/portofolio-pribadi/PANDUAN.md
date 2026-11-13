# Panduan Pemula — Portofolio Pribadi
Tidak perlu bisa coding. Cukup ikuti langkah ini pelan-pelan.

## 1. Buka dulu
1. Ekstrak ZIP, buka foldernya.
2. Klik dua kali `index.html` — portofolio contoh tampil di browser. Klik salah satu karya untuk melihat halaman detailnya (`karya.html?id=...`).

## 2. Ganti isi (semua di `data.js`)
1. Klik kanan `data.js` › Open with › Notepad (Windows) / TextEdit (Mac). Lebih nyaman: VS Code (gratis).
2. Ganti teks di antara tanda kutip `"..."`. Semua nama, klien, dan angka di sana fiktif.
3. **Jangan hapus** tanda kutip, koma di akhir baris, atau kurung `{ } [ ]`.
4. Teks di dalam kurung kurawal, mis. `"Dari brief {sampai laporan}"`, tampil dengan huruf serif miring.
5. Simpan, lalu refresh browser (F5). Kalau halaman kosong, cek koma/kutip di baris terakhir yang diubah.

Yang bisa diganti: nama (`nama`, juga `nama` di `tema.js` untuk header), sapaan, peran, email, tautan sosial, daftar klien, karya, angka, cara kerja, tentang, riwayat, dan ajakan.
**Karya:** tiap karya satu blok `{ ... },`. `id` harus unik tanpa spasi (dipakai di alamat `karya.html?id=...`). `unggulan: true` = tampil besar di "Karya pilihan" (idealnya 4). `bagian` memakai `p: "sendiri"`, `"pimpin"`, atau `"tim"`.

## 3. Ganti gambar (semua alamatnya ada di `data.js`)
| Slot | Berkas bawaan | Ukuran/rasio | Diubah di data.js |
|---|---|---|---|
| Logo/monogram (header + ikon tab) | `img/logo.svg` | persegi, mis. 256×256 | `logo` |
| Foto profil (hero & Tentang) | `img/foto-profil.svg` | 4:5, mis. 800×1000 (`.jpg` boleh) | `foto`, `fotoAlt` |
| Logo tempat kerja/klien (marquee) | `img/logo-klien/klien-1.svg` … | tinggi 48, lebar bebas, latar transparan | `klien[].logo` |
| Sampul karya | `img/karya/<id>.svg` | 3:2, mis. 900×600 | `karya[].sampul` |
| Benda 3D tiap karya/langkah | `img/objek/*.webp` | PNG/WebP latar transparan | `objek` |
| Gambar pratinjau saat dibagikan (opsional) | `img/og.png` | 1200×630 | `og` |
Caranya: simpan gambar barumu di folder yang sama (mis. `img/foto-profil.jpg`), lalu ubah alamatnya di data.js. Kecilkan dulu di squoosh.app (< 300 KB). Foto profil otomatis tampil hitam-putih seperti desain aslinya. Placeholder bertuliskan "Ganti dengan foto kamu"/"Ganti dengan sampul karyamu" — pastikan semuanya sudah diganti sebelum online.

## 4. Warna & mode
- Warna utama terakota: `tema.css` `--tema-utama`. Mode bawaan: `tema.js` `mode: "terang" | "gelap" | "auto"`. Pengunjung bisa menekan tombol bulan/matahari.

## 5. Online gratis — GitHub Pages
1. Daftar di github.com (gratis).
2. Klik **+** (kanan atas) › **New repository**. Nama: `namakamu.github.io` (ganti `namakamu` dengan username GitHub). Pilih **Public** › **Create repository**.
3. Klik **uploading an existing file**. Seret SEMUA isi folder (bukan foldernya) — index.html harus di paling luar. Klik **Commit changes**.
4. Buka **Settings** › **Pages** › Source: **Deploy from a branch**, Branch: **main** / **(root)** › **Save**.
5. Tunggu 1–2 menit, buka `https://namakamu.github.io`. Selesai!
6. Ubah isi nanti: buka `data.js` di GitHub › ikon pensil › edit › **Commit changes**.

## 6. Atau Netlify (paling cepat, tanpa akun Git)
1. Buka app.netlify.com/drop dan daftar/masuk (gratis).
2. Seret folder portofolio ke kotak "Drag and drop".
3. Dapat alamat `xxx.netlify.app`. Ganti nama: **Site configuration** › **Change site name**.
4. Update: seret ulang folder di tab **Deploys**.
## 7. Kontak
Tombol "Kirim email" membuka aplikasi email pengunjung ke alamat `email` di data.js. Tidak perlu server.

## Butuh bantuan?
Komen di TikTok/IG **@malikisaputra**. Lihat README bagian "Ubah pakai Claude" — tinggal minta "ganti warna jadi hijau" atau "tambah karya baru".

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
