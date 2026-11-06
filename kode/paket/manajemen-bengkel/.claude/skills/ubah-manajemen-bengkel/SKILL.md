---
name: ubah-manajemen-bengkel
description: Pakai saat pengguna ingin mengubah, menambah fitur, mengganti warna/font, menambah field data, menu/halaman, laporan, atau format nota di aplikasi Manajemen Bengkel (antrean servis, work order, stok sparepart, nota, riwayat kendaraan).
---

# Mengubah aplikasi Manajemen Bengkel

Baca `DESIGN.md` di akar paket dulu. Token, kontras AA, fokus terlihat, responsif HP/desktop, dan `prefers-reduced-motion` WAJIB tetap terjaga.

## Peta file
| Berkas | Fungsi |
|---|---|
| `tema.js` | `window.TEMA = { nama, mode }` — nama bengkel & mode bawaan |
| `tema.css` | 4 token dasar (`--tema-utama/aksen/radius/font`) + 4 warna bagian (`--tema-latar/panel/nav/teks`) |
| `style.css` | turunan warna per mode (`[data-mode=terang/gelap]`), komponen, animasi, responsif, cetak |
| `index.html` | kerangka: layar PIN, sidebar `#nav`, header, `#isi`, modal, layar TV, ikon `<symbol id="i-...">` |
| `app.js` | seluruh logika (lihat di bawah) |
| `ikon.svg` | favicon |
| `DESIGN.md`, `AGENTS.md` | aturan desain & ringkasan untuk agen lain |

Di `app.js`:
- `contoh()` — skema & data contoh (pelanggan, kendaraan, mekanik, part, wo, mutasi, pengaturan).
- `migrasi()` — tempat menambah nilai bawaan field baru untuk data lama di localStorage (naikkan `VERSI`).
- `MENU` + `RENDER.<id>` — menu dan render halaman. `bangunNav()` membuat sidebar & tab bawah.
- `formWo`, `formPart`, `formOrang` — form; `terapkanStok()` mutasi stok otomatis.
- `htmlNota()` — nota A5 & thermal; `teksWa()`, `kirimPengingat()` — pesan wa.me.
- `eksporWo()`, `unduhCsv()` — CSV; backup/pulihkan di `RENDER.pengaturan`.
- `terapkan()`, `terapkanBagian()`, `teksAtas()`, `sorot()` — kontrak customizer.

## Cara menambah
- **Menu/halaman**: tambah `{ id, nama, ikon, hp?, admin? }` ke `MENU`, buat `RENDER.id = function (el) { el.innerHTML = ... }`, ikon baru sebagai `<symbol id="i-nama">` di index.html. Bungkus konten dengan `<section data-bagian="panel" class="kartu">`.
- **Field data**: tambah di `contoh()`, beri nilai bawaan di `migrasi()`, tampilkan di form (+ simpan di handler submit), tabel/render, dan kolom CSV.
- **Fitur**: pakai util yang ada (`bukaModal`, `toast`, `konfirmasi`, `simpan`, `segarkan`). Selalu `esc()` untuk teks pengguna.

## Aturan aman
- Jangan pernah menghapus/menimpa data pengguna; perubahan struktur lewat `migrasi()`.
- Tanpa build tool/framework; CDN hanya dengan versi pasti.
- Setiap input punya label, tombol ikon punya `aria-label`, warna baru diturunkan dari token, cek kontras kedua mode.
- Animasi baru harus ikut mati di `prefers-reduced-motion`.
- Uji di browser HP (≤500px) & desktop, mode terang & gelap, konsol tanpa error.

## Contoh permintaan
1. **"Ganti warna jadi hijau tosca"** → ubah `--tema-utama` di `tema.css` ke `#0f766e`; cek tombol tetap terbaca (teks dihitung otomatis).
2. **"Tambah kolom nomor rangka di kendaraan"** → field `rangka` di `contoh()` (kendaraan) + `migrasi()` (`k.rangka = k.rangka || ''`), input di `formWo`, tampilkan di `RENDER.kendaraan` dan nota.
3. **"Tambah menu Booking servis"** → entri `MENU` baru + `RENDER.booking` + koleksi `D.booking` (default `[]` di `migrasi()`).
4. **"Nota thermal 80mm"** → tambah opsi segmen di `bukaNota`, kelas `.nota.t80` (lebar 72mm) di style.css, cabang di `htmlNota` dan `@page size`.
5. **"Pengingat servis tiap 3 bulan"** → ubah `intervalHari` bawaan di `migrasi()`/`contoh()` (atau lewat halaman Pengaturan).
6. **"Tambah PPN 11% di nota"** → field `ppn` di pengaturan + `migrasi()`, hitung di `totalWo()`, tampilkan di form ringkasan, nota, dan CSV.
