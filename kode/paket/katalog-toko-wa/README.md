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
MIT — bebas dipakai, diubah, dan dipakai untuk klien, asal menyertakan berkas LICENSE.

---
Dibuat oleh **Maliki Studio** — [malikisaputra.biz.id](https://malikisaputra.biz.id), follow TikTok/IG **@malikisaputra**
