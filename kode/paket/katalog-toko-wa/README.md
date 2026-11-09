# Katalog Toko + Checkout WhatsApp

Website katalog toko yang ringan dan statis. Pembeli memilih barang, mengisi keranjang, lalu menekan **Pesan via WhatsApp**. Pesanan terkirim ke nomor admin dalam format yang rapi (daftar barang, varian, subtotal, ongkir, total, nama, alamat).

Tanpa backend, tanpa database, gratis di-hosting di GitHub Pages atau Vercel.

## Fitur
- Semua data toko & produk di **satu berkas `produk.js`**.
- **Opsional**: ambil produk dari **Google Sheet** yang dipublikasikan sebagai CSV, jadi admin cukup edit spreadsheet.
- **Cari**, filter **kategori**, dan **urutkan** (harga terendah/tertinggi, nama).
- **Detail produk**: galeri beberapa gambar, pilihan varian (ukuran, warna, dll) dengan tambahan harga per opsi, jumlah, info stok.
- **Keranjang** tersimpan di browser (tidak hilang saat halaman ditutup).
- **Ongkir per kota** sederhana + **gratis ongkir** di atas nominal tertentu. Opsi "kota lain" akan meminta admin mengecek ongkir.
- **Mode gelap** mengikuti pengaturan HP, bisa diganti manual.
- **Gambar ilustrasi SVG** bawaan, jadi katalog langsung rapi sebelum punya foto. Bisa diganti foto asli kapan saja.
- Responsif HP, cepat (tanpa library).

## Cara menjalankan (pemula)
1. Unduh folder ini.
2. Klik ganda `index.html` untuk melihat di browser. (Fitur Google Sheet butuh dijalankan lewat server/hosting, misal `python3 -m http.server`.)
3. Buka `produk.js` dengan editor teks (VS Code/Notepad), lalu ubah:
   - `nama`, `slogan`
   - `wa`: nomor WhatsApp admin dengan format `628xxxxxxxxxx` (tanpa `+`, spasi, atau tanda hubung)
   - `ongkir`: daftar kota dan biayanya; `gratisOngkirMin` (isi `0` untuk mematikan)
4. Ganti isi `PRODUK`. Tiap produk punya `id` unik, `nama`, `kategori`, `harga`, `hargaCoret` (opsional), `label` (opsional, misal "Baru"), `stok` (`0` = habis), `deskripsi`, `varian`, `gambar`.
5. Simpan, muat ulang browser.

### Pakai foto asli
Buat folder `img/`, taruh fotonya, lalu tulis `gambar: ['img/kaos-hitam.jpg', 'img/kaos-krem.jpg']`. Foto persegi (1:1) ±800 px hasilnya paling rapi. Kalau ada varian `Warna`, urutan gambar mengikuti urutan opsi warna sehingga gambar ikut berganti saat warna dipilih.

### Pakai Google Sheet (opsional)
1. Buat sheet dengan kolom: `id,nama,kategori,harga,hargaCoret,deskripsi,varian,gambar,stok,label`.
   - `varian` contoh: `Ukuran:S,M,L;Warna:Hitam,Putih`
   - `gambar` contoh: `https://.../a.jpg|https://.../b.jpg` (kosongkan untuk ilustrasi otomatis)
2. **File → Bagikan → Publikasikan ke web** → pilih sheet → format **CSV** → Publikasikan. Salin link-nya.
3. Tempel di `produk.js` pada `sheetCSV: '...'`. Jika sheet gagal dimuat, katalog otomatis memakai data lokal.

## Deploy
**GitHub Pages**
1. Buat repository baru, unggah semua berkas (Add file → Upload files).
2. **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save.
3. Tunggu 1–2 menit, situs tampil di `https://namakamu.github.io/nama-repo/`.

**Vercel**
1. Masuk ke vercel.com → **Add New → Project** → impor repo tadi (atau drag & drop folder).
2. Framework: **Other**, tanpa build command. Klik **Deploy**.

## Struktur folder
```
katalog-toko-wa/
├── index.html   # kerangka halaman
├── style.css    # tampilan, mode gelap, responsif
├── produk.js    # PENGATURAN TOKO & DATA PRODUK (ubah di sini)
├── app.js       # logika katalog, keranjang, pesan WA, gambar ilustrasi
├── tema.css, tema.js  # warna, sudut, huruf, nama toko, mode
├── AGENTS.md, .claude/ # panduan untuk AI (Claude, Cursor, Copilot)
├── meta.json, LICENSE, README.md, ss.png
```

## Ganti warna & nama
Semua warna, sudut, huruf, dan nama usaha diatur di dua berkas kecil (juga yang diubah otomatis oleh customizer di malikisaputra.biz.id/kode):
- `tema.css`: `--tema-utama` (tombol, sorotan), `--tema-aksen` (label produk & angka keranjang), `--tema-radius` (sudut), `--tema-font` (huruf Google Fonts: Plus Jakarta Sans, Inter, Poppins, DM Sans, Space Grotesk, Nunito — ganti juga `href` pada `<link id="fontTema">` di `index.html`).
- `tema.js`: `nama` (nama usaha di layar, pesan WhatsApp, dan kaki halaman) dan `mode`: `"terang"`, `"gelap"`, atau `"auto"` (ikut setelan HP).

Warna lain (versi muda/tua, latar, garis, mode gelap) diturunkan otomatis dengan `color-mix()` di `style.css`. Teks di atas warna utama selalu putih, jadi pilih warna utama yang cukup gelap (setara teal-700 / ungu-600) agar tetap terbaca.

Tombol bulan di pojok kanan atas tetap bisa dipakai pengunjung; pilihannya disimpan di browser dan menimpa `mode` dari `tema.js`. Hijau tombol WhatsApp sengaja tidak ikut tema (warna resmi WA).

Warna per bagian: `tema.css` juga punya `--tema-latar` (latar halaman), `--tema-panel` (kartu/panel/form), `--tema-nav` (sidebar/header/nav bawah), `--tema-teks` (teks utama). Mode gelap memakai palet gelap paket kecuali customizer mengirim nilai bagian. Warna teks di atas nav & tombol utama dihitung otomatis (terang/gelap) dari luminansi.

## Ubah brand lainnya
- Semua teks memakai `--tema-font` (bawaan DM Sans). Tombol memakai `--tema-utama` (bawaan hitam) dan otomatis dibalik terang di mode gelap. Arah desain lengkap ada di `DESIGN.md`.
- Teks pembuka ("Belanja santai…") ada di `index.html`.
- Format pesan WhatsApp bisa diubah di fungsi `buatPesan` dalam `app.js`.

## Ubah pakai Claude
Paket ini membawa Agent Skill di `.claude/skills/ubah-katalog-toko-wa/SKILL.md` (peta berkas, letak tema, cara menambah fitur, aturan aman) dan `AGENTS.md` untuk Cursor/Copilot/Codex.

- **Claude Code / Claude Desktop**: buka folder paket ini; skill di `.claude/skills` terbaca otomatis. Tinggal minta, misal "tambah filter rentang harga".
- **claude.ai**: unduh ZIP skill (tombol **Unduh Skill** di [malikisaputra.biz.id/kode](https://malikisaputra.biz.id/kode)), lalu di claude.ai buka **Customize › Skills › tombol "+" › Create skill › Upload a skill** dan pilih ZIP itu (folder skill sebagai akar ZIP). Syarat: **Code execution and file creation** aktif di **Settings › Capabilities** (paket Free/Pro/Max); di Team/Enterprise diatur oleh Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).


## Mau hasil lebih maksimal?
Pasang skill desain berikut di Claude Code sebelum minta perubahan tampilan:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

---
Dibuat oleh **Maliki Studio** — [malikisaputra.biz.id](https://malikisaputra.biz.id), follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto
- Semua path gambar diatur di `produk.js` (objek `TOKO`): `logo` dan `fotoKosong`.
- Logo: timpa `img/logo.svg` (atau ubah `logo: 'img/logo.png'`). Rasio 1:1, tampil bulat di header. Kosongkan `''` atau bila gagal dimuat → otomatis inisial nama toko.
- Foto produk: isi `gambar: ['img/kaos-1.jpg', ...]` per produk (rasio 1:1, ±800×800 px, kompres ≤200 KB). Produk tanpa gambar atau foto yang gagal dimuat memakai `img/foto-produk.svg`; ganti berkas itu untuk placeholder sendiri.

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
