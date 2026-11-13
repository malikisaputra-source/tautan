# Panduan pemula — Direktori Rumah Ibadah & website masjid

Panduan ini untuk kamu yang belum pernah ngoding. Cukup laptop, browser (Chrome/Edge), dan aplikasi teks (Notepad / TextEdit / VS Code gratis).

## 1. Coba dulu di laptop
1. Unduh ZIP paket, klik kanan › **Extract All** (Windows) atau klik dua kali (Mac).
2. Buka folder hasil ekstrak, klik dua kali `index.html`. Direktori terbuka di browser (perlu internet untuk peta & font).
3. Klik salah satu tempat di daftar › **Jadikan website**. Muncul halaman website tempat itu.
4. Contoh website masjid langsung: tambahkan `?tempat=thoriqussalam` di ujung alamat, mis. `.../index.html?tempat=thoriqussalam`.

## 2. Masuk sebagai pengurus
1. Di halaman direktori klik **Masuk** (kanan atas). Nama **Pengurus Kota**, PIN **1234**.
2. Buka lagi website tempatnya. Sekarang ada tombol emas **Edit profil**.
3. Ganti PIN contoh: buat akun baru tidak bisa jadi pengurus otomatis, jadi untuk pemakaian sungguhan ubah nama/PIN pengurus di `app.js` fungsi `dataKosong()` (cari `'1234'`).

> PIN hanya penanda di perangkat itu, bukan keamanan sungguhan. Lihat README "Banyak member" bila ingin login asli.

## 3. Menjadikan website masjidmu sendiri
1. **Data › Kosongkan data** (ketik HAPUS) — atau biarkan dan tambah tempat baru.
2. **Ajukan** › isi nama masjid, alamat, lalu ketuk peta kecil tepat di titik masjid (penting: jadwal sholat dihitung dari titik ini). Kirim, lalu setujui di **Moderasi**.
3. Buka detail masjid › **Jadikan website** › **Edit profil**. Isi:
   - Slogan & sambutan.
   - Pengumuman: satu baris satu pengumuman, format `Judul | isi`.
   - Kegiatan: `Senin | Ba'da Maghrib | Tahsin | Ust. Nama`.
   - Kas: saldo awal, lalu transaksi `2026-11-08 | Infak Jumat | 1500000 | 0` (kolom ke-3 masuk, ke-4 keluar). Transaksi harian lebih mudah lewat form **Catat transaksi** di bagian Infak.
   - Rekening: `Nama bank | nomor | atas nama`.
   - Jadwal sholat: pilih zona (WIB/WITA/WIT). Kalau beda 1–2 menit dengan jadwal resmi Kemenag di daerahmu, isi koreksi menit (boleh minus).
4. Simpan. Salin tautan website dengan tombol rantai di kanan atas.
5. **QRIS asli**: simpan gambar QRIS resmi rekening masjid sebagai `qris.png` di folder paket, lalu minta Claude (lihat README "Ubah pakai Claude"): "pakai qris.png sebagai QRIS di website". Jangan sebar QRIS contoh — itu tidak bisa dipindai.
6. **Logo & foto asli**: di **Edit profil › Logo & foto** unggah logo, foto utama, dan foto galeri (lihat "Ganti logo & foto" di bawah).
7. Nama di header & warna: ubah `tema.js` (nama) dan `tema.css` (warna).

## 4. Penting: data tersimpan di browser
Isi website tersimpan di **localStorage browser perangkat yang dipakai mengedit**. Pengunjung di HP lain akan melihat **data contoh**, bukan isianmu. Supaya isianmu ikut online, pilih salah satu:
- **Cara mudah (tanpa server):** setelah selesai mengisi, **Data › Unduh JSON**. Minta Claude: "jadikan isi JSON ini data bawaan di dataContoh()". Ulangi setiap ada perubahan besar.
- **Cara lanjut:** sambungkan ke Google Sheets/Supabase (README bagian "Banyak member") supaya pengurus bisa memperbarui dari HP kapan saja.

## 5. Online gratis
**Pilihan A — Netlify Drop (paling cepat, tanpa akun GitHub)**
1. Buka app.netlify.com/drop, daftar gratis.
2. Seret seluruh folder paket ke kotak di halaman itu. Tunggu selesai, kamu dapat alamat `https://nama-acak.netlify.app`.
3. Website masjid: `https://nama-acak.netlify.app/?tempat=thoriqussalam` (ganti dengan id tempatmu — lihat di alamat saat membuka website-nya).
4. Ganti nama situs di Site settings › Change site name.

**Pilihan B — GitHub Pages**
1. Daftar di github.com › **New repository** (Public), mis. `masjid-kami`.
2. **Add file › Upload files**, seret semua isi folder paket (termasuk folder `.claude` boleh dilewati), **Commit changes**.
3. **Settings › Pages** › Source: *Deploy from a branch*, branch `main`, folder `/ (root)` › Save.
4. 1–2 menit kemudian situs ada di `https://namakamu.github.io/masjid-kami/?tempat=<id>`.

**Domain sendiri (opsional, berbayar)** mis. `masjidkami.id`: beli di registrar Indonesia, lalu ikuti petunjuk "custom domain" Netlify/GitHub Pages. Supaya alamat utama langsung ke website masjid, minta Claude: "buka website tempat <id> otomatis saat index.html dibuka tanpa parameter".

## 6. Rawat rutin
- Setiap Jumat: catat infak, perbarui pengumuman.
- Setiap bulan: **Data › Unduh JSON** sebagai cadangan.
- Bandingkan jadwal sholat dengan jadwal resmi sekali sebulan; sesuaikan koreksi bila perlu.

## Ganti logo & foto

Semua aturan gambar ada di satu tempat: objek `GAMBAR` di awal bagian "Logo & foto profil" pada `profil.js` (`maks: 400` px, `mutu`, `galeriMaks: 6`). Gambar disimpan sebagai dataURL di data tempat (ikut ekspor/impor JSON), tanpa server.

| Slot | Cara mengganti | Rasio | Bila kosong |
|---|---|---|---|
| Foto tiap tempat (kartu daftar & detail) | **Ajukan / Ubah data › Pilih foto** | 4:3 | ikon jenis rumah ibadah |
| Logo di header website tempat | **Jadikan website › Edit profil › Logo & foto › Logo** | 1:1 | ikon jenis; gagal dimuat = inisial nama |
| Foto hero website | **Edit profil › Foto utama / hero** | 4:3 | ilustrasi SVG bawaan |
| Galeri (maks. 6) | **Edit profil › Foto galeri** (pilih beberapa sekaligus, urut sesuai judul galeri) | bebas, dipotong rapi | ilustrasi SVG bawaan |
| Logo aplikasi & favicon | timpa `ikon.svg`; logo header ada di `index.html` (`svg.logo`) | 1:1 | – |

Unggahan pengurus otomatis diperkecil ke 400 px. Tombol **Hapus** mengembalikan slot ke ilustrasi. Penyimpanan browser terbatas (±5 MB), jadi rutin **Data › Unduh JSON**.

---
<!-- kredit-maliki -->
Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer wajib dipertahankan (lihat LICENSE).

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
