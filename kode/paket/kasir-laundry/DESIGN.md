# DESIGN — Kasir Laundry

Arah: "papan cucian bersih". Latar biru-aqua sangat muda, rel navigasi teal tua, kartu putih bersudut lembut. Pusat aplikasi adalah papan status bergaya kanban: tiap kolom punya titik warna dan garis kiri kartu sesuai tahap, sehingga kasir langsung tahu cucian ada di mana. Ilustrasi SVG buatan sendiri (mesin cuci, keranjang baju, setrika, bed cover, jas, sepatu, karpet) memakai warna tema.

## Token (tema.css)
| Token | Bawaan | Dipakai untuk |
|---|---|---|
| `--tema-utama` | `#0b6e80` | tombol utama, nav aktif, chip filter aktif, kolom "Siap ambil", kartu angka sorot, batang hari ini |
| `--tema-aksen` | `#3cc6d6` | kolom "Dicuci", batang grafik, badge paket, avatar, ilustrasi |
| `--tema-radius` | `14px` | kartu & tombol (`--r-besar` = +6px, `--r-kecil` = ×0.7) |
| `--tema-font` | Nunito | semua teks, angka tabular |
| `--tema-latar/panel/nav/teks` | `#eef6f8 / #fff / #0c3a45 / #0f2a32` | bagian customizer |

Turunan di `style.css`: `--utama-tua`, `--utama-muda`, `--utama-teks`, `--aksen-tua`, `--aksen-muda`, `--redup`, `--garis`, `--garis-kuat`, warna status `--s-diterima … --s-diambil` (semua dari tema), `--bahaya`, `--ok`. Mode gelap mengganti latar/panel/teks/nav. Teks di atas utama & nav dihitung JS (`--tema-utama-teks`, `--tema-nav-teks`). Kontras bawaan: putih di atas `#0b6e80` ≈ 5,9:1 (AA).

## Tipografi
Judul halaman 26px/800 (22px di HP). Total order 30px/800. Angka laporan 24px/800. Nama kartu 15px/700, label 13–13.5px/700.

## Komponen
- **Rel navigasi** 104px (HP: nav bawah 5 ikon). Chip status sinkron (Offline saja / Antri n / Tersinkron / Gagal) di bawah menu.
- **Papan status**: chip filter + jumlah, 4 kolom aktif (2 kolom di ≤1180px, 1 di HP), kartu order: nama, badge paket, isi item, estimasi (merah bila lewat), Sisa/Lunas, tombol "maju" 44px di bawah kartu.
- **Order baru**: kartu layanan bergambar → baris item dengan input berat desimal (`inputmode=decimal`, koma diterima), segmen paket, ringkasan lengket di kanan (subtotal, paket, total, DP, Lunas/Bayar nanti, metode, sisa).
- **Dialog detail**: alur 5 titik, rincian, catatan, aksi (maju, pelunasan, cetak, WA nota, WA siap ambil, hapus admin).
- **Laporan**: 5 kartu angka, grafik batang kg & omzet per hari, daftar belum diambil & piutang.
- **owner.html**: kartu sumber data, kartu angka, status cucian, grafik 14 hari, tabel belum diambil.

## Motion
Halaman naik 10px saat ganti tab; kartu muncul bertahap 35ms (`munculPop`, pegas `cubic-bezier(.34,1.4,.64,1)`); kartu terangkat saat hover; panah "maju" bergeser; air di mesin cuci bergoyang, uap setrika naik; dialog naik dengan pegas + backdrop blur; batang grafik tumbuh; PIN salah bergoyang. Semua mati di `prefers-reduced-motion`.

## Aksesibilitas
Target ≥44px (PIN 60px, nav 56–60px), fokus terlihat 2.5px utama, semua input berlabel, tombol ikon ber-`aria-label`, `aria-current` di nav, `aria-pressed` di chip filter, ringkasan order `aria-live`. Tidak ada scroll horizontal di 390px (tabel harga menggulung di dalam bingkainya).

<!-- kredit-maliki -->
## Kredit (jangan dihapus)

Jangan menghapus atau menyembunyikan kredit `kredit-maliki` (header & footer "Template oleh @malikisaputra", komentar kepala berkas, LICENSE). Itu syarat lisensi.
