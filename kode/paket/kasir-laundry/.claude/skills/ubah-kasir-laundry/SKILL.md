---
name: ubah-kasir-laundry
description: Pakai saat pengguna ingin mengubah atau menambah fitur, warna, nama usaha, layanan/harga, paket, field order/pelanggan, status cucian, teks WhatsApp, menu/halaman, sinkron Google Sheets (Apps Script) atau dasbor owner di aplikasi Kasir Laundry (PWA HTML/CSS/JS dengan localStorage).
---
# Ubah Kasir Laundry
Aplikasi kasir laundry PWA statis: HTML + CSS + JavaScript murni, data di localStorage, tanpa build. Sinkron ke Google Sheets opsional lewat Google Apps Script. Baca `DESIGN.md` sebelum mengubah tampilan.

## Peta berkas
- `index.html` — kerangka: layar masuk PIN (`#layarMasuk`), rel `.samping` & `#navBawah` (`.nav[data-hal]`), halaman `section.hal#hal-order|papan|pelanggan|laporan|atur`, `<dialog id="dlg">`, area struk `.struk`, kredit header & footer. Memuat `tema.js` → skrip mode → `tema.css` paling awal.
- `tema.css` / `tema.js` — token tema; jangan ubah formatnya.
- `style.css` — `:root` variabel turunan (`--utama`, `--utama-muda`, `--aksen-muda`, `--redup`, `--garis`, warna status `--s-*`), `[data-mode="gelap"]`, komponen, responsif (≤1180, ≤960, ≤760px), `@media print` struk 58mm.
- `app.js` — satu IIFE:
  - `STATUS` (alur status), `SATUAN` (kg/pcs/m²), `layananBawaan()`, `paketBawaan()`, `dataKosong()`, `dataContoh()`.
  - `muat()` / `simpan()` — localStorage `kasir-laundry-v1`; migrasi di `muat()`. `DEMO` (`?demo`) = data contoh di memori, tidak disimpan; `?demo&hal=laporan` membuka halaman tertentu.
  - `hitungOrder()` (subtotal, tambahan paket %, total, kg), `buatOrder()`, `sisa()`, `dibayar()`, `majuStatus()`, `ringkasan()` (laporan).
  - Halaman: `renderOrder` (+ `draf`, `tambahItem`, `simpanOrder`), `renderPapan` + `kartuOrder`, `lihatOrder` (dialog detail), `cetak` (struk), `teksNota` / `teksSiap` / `linkWA` (wa.me + `encodeURIComponent`), `renderPelanggan` / `lihatPelanggan`, `renderLaporan` + `grafik`, `eksporCSV`, `renderAtur` / `bacaHarga`.
  - Sinkron: `antri(id)` (tambah ke `D.sinkron.antrian`, kirim otomatis 1,5 dtk kemudian), `kirim(manual)` (POST text/plain JSON `{aksi, kunci, toko, order:[ringkasOrder]}`), `statusSinkron()`, event `online`.
  - `terapkanTema()` + listener `message` (`tema`, `sorot`, `mode-pilih`) untuk customizer.
  - `ikatEvent()` — delegasi klik (`data-maju`, `data-buka`, `data-o`, `data-c`, `data-f`, `data-lid`, …) dan form.
  - `window.__kasir` — kait pengujian.
- `owner.html` — dasbor read-only; fetch GET `URL?kunci=…`, simpan URL/kunci di localStorage `kasir-laundry-owner`; `?demo` = data contoh.
- `apps-script/Code.gs` — `KUNCI`, `KOLOM`, `doPost` (upsert per `id` ke sheet "Order"), `doGet` (ringkasan: hariIni, bulanIni, perStatus, piutang, belumDiambil, harian 14 hari), `setup()`.
- `sw.js` — cache offline (`BERKAS`, `CACHE`; naikkan versi tiap berkas berubah). Permintaan lintas domain (Apps Script) tidak di-cache.
- `manifest.webmanifest`, `ikon.svg`.

## Token tema
`tema.css`: `--tema-utama`, `--tema-aksen`, `--tema-radius`, `--tema-font`, `--tema-latar/panel/nav/teks`. `tema.js`: `window.TEMA = { nama, mode }`. Nama usaha = `TEMA.nama` selama `D.toko.namaDariTema` true. Semua warna lain diturunkan; jangan menulis hex baru di komponen kecuali netral/status bahaya.

## Cara menambah
- **Menu/halaman**: tombol `.nav[data-hal="x"]` di `.samping` (nav bawah disalin otomatis), `<section class="hal" id="hal-x">`, fungsi `renderX`, daftarkan di peta `buka()`.
- **Field order** (mis. alamat antar): input di `#formOrder` → ambil di `simpanOrder()` → simpan di `buatOrder()` → tampilkan di `lihatOrder()`, `cetak()`, `teksNota()`, `eksporCSV()`, dan bila perlu di `ringkasOrder()` + `KOLOM` Code.gs (urutan bebas, nama kunci harus sama). Order lama tanpa field: beri nilai default di `muat()`.
- **Layanan/satuan**: tambah di `layananBawaan()` (data baru) atau lewat menu Atur. Satuan baru → `SATUAN`. Gambar baru → `ILUS` (SVG 120×110, `{c}` utama, `{a}` aksen, `{m}` utama muda).
- **Status**: ubah `STATUS` (id unik), warna `--s-<id>` & selektor `.kolom[data-s]` di style.css, `NAMA_STATUS` + `perStatus` di Code.gs & owner.html. Order lama dengan id status yang dihapus → migrasi di `muat()`.
- **Teks WhatsApp**: `teksNota()` / `teksSiap()`. Nomor dinormalisasi `waNomor()` (08… → 628…).

## Aturan aman
- Jangan menghapus/mereset data pengguna; tambah migrasi di `muat()`. Ingatkan pengguna backup JSON sebelum ganti versi.
- Jangan pakai build tool/framework. Tetap satu IIFE, ES5-friendly.
- Uji di HP (390px) & desktop (1280px), terang & gelap, konsol bersih, `node --check app.js`. Tidak boleh ada scroll horizontal.
- Jaga label input, `aria-label` tombol ikon, fokus terlihat, target ≥44px, kontras AA, `prefers-reduced-motion`.
- Berkas baru → `sw.js` `BERKAS` + naikkan `CACHE`, dan `meta.json` `berkas`.
- Setelah mengubah `Code.gs`, pengguna wajib deploy ulang (Kelola deployment → Edit → Versi baru).
- Jangan hapus kredit `kredit-maliki`.

## Contoh permintaan
1. **"Ganti warna jadi hijau tosca."** → ubah `--tema-utama` (mis. `#0f766e`) & `--tema-aksen` di `tema.css`; cek teks putih di tombol tetap terbaca; jangan ubah turunan.
2. **"Tambah layanan Cuci Helm Rp25.000 per pcs."** → tambah di menu Atur (pengguna) atau di `layananBawaan()` dengan `tipe:'pcs'`, `ilus:'keranjang'` (atau buat SVG helm di `ILUS`).
3. **"Tambah kolom alamat antar-jemput di order."** → ikuti langkah "Field order" di atas, termasuk nota, CSV, dan `ringkasOrder` + `KOLOM`.
4. **"Tambah status Packing sebelum Siap ambil."** → sisipkan `{id:'packing',nama:'Packing'}` di `STATUS`, tambah `--s-packing` + selektor kolom, ubah grid `.papan` jadi 5 kolom, perbarui Code.gs & owner.html.
5. **"Paket express jadi 4 jam dan +80%."** → menu Atur → Paket waktu, atau `paketBawaan()` untuk data baru.
6. **"Pesan WA siap ambil pakai bahasa Sunda."** → ubah string di `teksSiap()`; tetap lewat `encodeURIComponent` di `linkWA()`.
7. **"Owner mau lihat omzet per kasir."** → tambah agregasi di `doGet` (kolom `kasir`) dan render tabel di `owner.html`; deploy ulang Apps Script.
