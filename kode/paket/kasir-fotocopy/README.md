# Kasir Fotocopy & Percetakan (offline)

Aplikasi kasir untuk usaha fotocopy, print, dan percetakan kecil. Jalan di browser laptop, tablet, atau HP, bisa di-install (PWA), dan tetap jalan tanpa internet. Data tersimpan di perangkat itu sendiri.

Turunan dari Kasir UMKM Offline, ditambah fitur khusus fotocopy.

## Fitur
- **Hitung cepat**: isi jumlah halaman, halaman berwarna, rangkap, A4/F4, 1 sisi atau bolak-balik, jilid, dan laminasi. Lembar dan harga dihitung otomatis lalu masuk ke pesanan.
- Harga per lembar hitam-putih vs warna, per sisi, tambahan F4; daftar jilid (staples, lakban, mika, spiral, hardcover) dan laminasi. Semua bisa diubah di menu **Atur → Tarif**.
- Jumlah di keranjang bisa diketik langsung (klik angkanya), cocok untuk 250 lembar.
- Rekap **lembar hitam-putih vs warna** di keranjang, struk, dan laporan harian/bulanan (untuk cek toner & kertas).
- Layanan jasa tanpa stok (stok `-1`), barang ATK (map, amplop, materai) dengan stok.
- Bayar tunai/QRIS/transfer, struk 58mm, riwayat, ekspor CSV, backup JSON, multi-kasir dengan PIN.

## Cara pakai
1. Unggah folder ke hosting HTTPS (GitHub Pages/Netlify) atau buka `index.html` langsung.
2. Buka di HP/laptop, lalu Install / Tambah ke layar utama.
3. Masuk sebagai Admin (PIN 1234), ganti PIN.
4. Atur nama usaha, tarif per lembar, dan daftar layanan.
5. Ganti `qris.svg` dengan QRIS-mu.

## Format CSV layanan
```
nama,kategori,stok,varian
Fotocopy A4,Fotocopy,-1,BW 1 sisi:300|BW 2 sisi:500|Warna 1 sisi:1500
```
Catatan: impor CSV tidak membawa jenis lembar (bw/warna); atur lewat form layanan atau AI agent.

## Ubah pakai AI
Paket ini membawa Agent Skill `.claude/skills/ubah-kasir-fotocopy/SKILL.md` dan `AGENTS.md`. Kalau berkas diubah, naikkan versi `CACHE` di `sw.js`.

Template oleh Maliki Saputra (@malikisaputra), Lisensi Nonkomersial Maliki Studio.
