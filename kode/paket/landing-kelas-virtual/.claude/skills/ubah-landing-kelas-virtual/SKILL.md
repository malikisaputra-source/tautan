---
name: ubah-landing-kelas-virtual
description: Pakai saat pengguna ingin mengubah isi, harga, link Lynk/WhatsApp, warna, bagian, atau menambah fitur di template Landing Kelas Virtual (landing page 1 halaman HTML/CSS/JS untuk menjual kelas online lewat Lynk).
---
# Ubah Landing Kelas Virtual
Landing page statis 1 halaman: HTML + CSS + JavaScript murni, tanpa server/build. Pembayaran TIDAK di halaman ini; semua tombol beli menuju `KONTEN.linkBeli` (Lynk).

## Peta berkas
- `konten.js` — `window.KONTEN`: linkBeli, waNomor, waPesan, warna{utama,aksen}, merek, hero, harga, promo, untukSiapa, kurikulum.modul[], bonus.item[], mentor, testimoni.item[], jaminan, faq[], penutup, deskripsi. Ubah isi di sini dulu.
- `index.html` — kerangka bagian; teks statis diisi lewat atribut `data-k="jalur.di.konten"`; wadah daftar (`#modul`, `#faqDaftar`, `#bonusGrid`, `#testiGrid`, …); meta OG (ubah manual); ilustrasi SVG inline.
- `style.css` — variabel turunan di `:root`, `[data-mode="gelap"]`, komponen, responsif (≤960px, ≤760px), reduced-motion.
- `app.js` — `render()` (isi dari KONTEN), akordion (klik `.ak-tombol`), `hitungMundur()` (promo), `animasi()`, `melayang()`, `terapkanTema()` + pesan customizer (`tema`, `sorot`, `mode-pilih`).
- `tema.css` / `tema.js` — token tema; jangan ubah formatnya. `ikon.svg` favicon, `img/og.png` (+ `og.svg` sumbernya) gambar bagikan.

## Token tema
Lihat DESIGN.md. Warna baru WAJIB turunan `--tema-utama`/`--tema-aksen` via `color-mix`, dengan nilai mode gelap. Elemen baru yang mewakili bagian diberi `data-bagian` (nav/latar/panel/utama/aksen/teks).

## Cara menambah
- **Bagian baru**: tambahkan `<section class="bagian">` di index.html, isi teks ke `konten.js`, render di `render()` (selalu lewat `esc()`), beri kelas `muncul` untuk animasi.
- **Modul/FAQ/bonus/testimoni**: cukup tambah objek di array `konten.js`.
- **Countdown**: `promo.selesai` = tanggal ISO (`"2026-12-31T23:59:00+07:00"`), `"otomatis-3hari"`, atau `null` (sembunyi).

## Aturan aman
- Jangan menambah form pembayaran atau mengumpulkan data kartu; transaksi tetap di Lynk.
- Testimoni contoh harus diganti testimoni asli; jangan menulis testimoni palsu sebagai asli.
- Tanpa build tool/framework/npm. Jaga label, `aria-expanded` akordion, fokus terlihat, target ≥44px, kontras AA, `prefers-reduced-motion`.
- Uji di 390px & 1280px, terang & gelap, konsol tanpa error. Berkas baru → `meta.json` `berkas`.

## Contoh permintaan
1. "Ganti link Lynk jadi lynk.id/budi/kelas-excel" → ubah `linkBeli` di konten.js.
2. "Ganti warna jadi hijau tosca" → `--tema-utama` di tema.css (atau `warna.utama` di konten.js), cek kontras tombol.
3. "Ubah harga jadi 99 ribu, coret 199 ribu" → `harga.jual`/`harga.coret`; badge hemat dihitung otomatis.
4. "Tambah modul 7 tentang iklan" → tambah objek di `kurikulum.modul`.
5. "Matikan countdown" → `promo: { selesai: null }`.
6. "Ganti jadi Kelas Excel Kantoran" → ubah semua teks di konten.js + `<title>`/meta OG di index.html + teks di img/og.svg lalu ekspor ulang og.png.
7. "Tambah video YouTube di hero" → iframe `loading="lazy"` di `.hero-visual`, judul `title` wajib.
