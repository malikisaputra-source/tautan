# Panduan Pemula — Bengkel Las + Hitung HPP

Panduan ini untuk pemilik bengkel las yang belum pernah pakai aplikasi. Ikuti urut dari langkah 1.

## Apa itu HPP?
**HPP (Harga Pokok Produksi)** = semua uang yang keluar untuk menyelesaikan satu pekerjaan, *sebelum* untung.

```
HPP = Bahan + Ongkos tukang + Overhead
Harga jual = HPP × (1 + markup%)      → dibulatkan ke atas per Rp1.000
Laba = Harga jual − HPP
DP = Harga jual × DP%
```
Kalau harga jual di bawah HPP, bengkel rugi walaupun pekerjaan terlihat ramai.

## Langkah 1 — Buka aplikasi
1. Ekstrak ZIP, buka `index.html` dengan Chrome/Edge (HP atau laptop).
2. Pertama kali dibuka, aplikasi berisi **data contoh**. Coba-coba dulu, nanti bisa dihapus/diganti.
3. Mau sekadar lihat tanpa mengubah data? Buka `index.html?demo`.

## Langkah 2 — Isi harga bahan (Master bahan)
1. Menu **Master bahan** → klik baris bahan (ikon pensil) → ganti harga sesuai nota toko besi langganan.
2. Satuan **batang** isi panjangnya (umumnya 6 m). Satuan kg/m²/kaleng/pcs isi panjang 0.
3. Bahan baru: tombol **+ Bahan**. Bahan yang sudah dipakai order tidak bisa dihapus (supaya HPP lama tidak rusak).

## Langkah 3 — Atur tarif bawaan (Pengaturan)
Isi alamat & WA bengkel (muncul di RAB), upah tukang per hari, markup, DP, listrik mesin las per hari, transport, tebal potong gerinda (kerf), daya sebar cat, dan kebutuhan kawat las per m². Klik **Simpan pengaturan**.

## Langkah 4 — Hitung bahan dari ukuran (Kalkulator)
Contoh: **pagar panjang 8 m, tinggi 1,6 m**, jarak tiang 2 m, jarak jeruji 12 cm, tiang ditanam 0,3 m.

Aplikasi menghitung:
| Bagian | Hitungan | Hasil |
|---|---|---|
| Tiang hollow 40×40 | 8 m ÷ 2 m + 1 = 5 tiang × (1,6 + 0,3) m = 9,5 m | **2 batang** (sisa 2,49 m) |
| Rangka hollow 20×40 | tinggi > 1,5 m → 3 rel × 4 segmen = 12 potong ± 1,96 m | **4 batang** |
| Jeruji hollow 20×20 | 15 jeruji per segmen × 4 = 60 potong × 1,48 m. Satu batang 6 m muat 4 potong (4 × 1,48 = 5,92 m + bekas gerinda) | 60 ÷ 4 = **15 batang** |
| Cat | bidang 8 × 1,6 × 2 sisi = 25,6 m² ÷ 6 m²/kg | **5 kaleng** |
| Kawat las | 12,8 m² × 0,25 kg | **4 kg** |
| Thinner, dynabolt, batu gerinda | perkiraan otomatis | 3 L, 20 pcs, 7 pcs |

**Total bahan = Rp1.803.500** (dengan harga contoh). Kotak "Rencana potong batang" menggambar tiap batang: bagian biru = potongan, arsir = sisa. Sisa ≥ 1 m simpan untuk order lain.

> Kenapa tidak cukup "total meter ÷ 6"? Jeruji 60 × 1,48 m = 88,8 m → 88,8 ÷ 6 = 14,8 → 15 batang. Di sini kebetulan sama, tapi kalau potongannya 1,6 m, satu batang hanya muat 3 potong (sisa 1,2 m terbuang) — hitungan meter saja akan kurang beli.

## Langkah 5 — Masukkan ongkos tukang & overhead
Di kalkulator isi **2 tukang × 4 hari**. Dengan upah Rp150.000:
```
Ongkos tukang = 2 × 4 × Rp150.000           = Rp1.200.000
Overhead      = listrik Rp25.000 × 4 hari     = Rp100.000
              + transport                      = Rp150.000   → Rp250.000
```
Overhead lain yang sering lupa: gas/oksigen, sewa steger/bor beton, parkir & makan tukang di lokasi.

## Langkah 6 — HPP, harga jual, DP
```
HPP          = 1.803.500 + 1.200.000 + 250.000 = Rp3.253.500
HPP per m²   = 3.253.500 ÷ 12,8 m²             = Rp254.180 / m²
Harga jual   = 3.253.500 × 1,30 = 4.229.550     → Rp4.230.000
Laba         = 4.230.000 − 3.253.500           = Rp976.500 (23% dari harga jual)
DP 50%       = Rp2.115.000
```
Catatan: **markup 30% ≠ laba 30%**. Markup dihitung dari HPP; persen laba dihitung dari harga jual (976.500 ÷ 4.230.000 = 23%). Kalau ingin laba bersih 30% dari harga jual, pakai markup ± 43%.

Klik **Jadikan order** → isi nama pelanggan, HP, alamat → **Simpan order**.

## Langkah 7 — Kirim penawaran / RAB
Buka order (klik kartunya) → **RAB** → **Cetak / simpan PDF** (pilih "Simpan sebagai PDF" di dialog cetak). Harga per bahan di RAB sudah termasuk markup; selisihnya masuk baris "Jasa fabrikasi & pemasangan", jadi total RAB = harga jual. Tombol **WA** mengirim ringkasan harga & DP ke WhatsApp pelanggan.

## Langkah 8 — Jalankan status pekerjaan
`Survei → Produksi → Pasang → Lunas`. Pakai tombol **Maju ke …** di detail order. **Catat bayar** untuk DP/cicilan; bila total bayar = harga jual, order otomatis Lunas.

## Langkah 9 — Lihat laba & ekspor
- **Laporan**: omzet, HPP, laba per bulan (dihitung dari tanggal lunas), grafik 6 bulan.
- **Ekspor CSV** (Order/Laporan/Master bahan) bisa dibuka di Excel/Google Sheets (pemisah titik koma).
- **Pengaturan → Cadangan JSON** rutin tiap minggu. Data hanya ada di browser ini; ganti HP/laptop → pulihkan dari cadangan.

## Tips harga
- Update harga besi tiap belanja; HPP semua order ikut terhitung ulang dari harga terbaru.
- Bandingkan **HPP per m²** di Dasbor tiap jenis pekerjaan; itu patokan cepat saat pelanggan tanya "per meter berapa?".
- Tambahkan cadangan 5–10% bahan untuk pekerjaan rumit (lengkung, motif).

---
Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id
