# DESIGN.md — Manajemen Bengkel

Arah desain: dashboard bengkel yang tegas dan mudah dibaca dari jarak dekat maupun layar TV. Sumber awal: ui-ux-pro-max ("automotive workshop service management", motion 6, density 7) → slate gelap + merah aksi, lalu disesuaikan ke daftar font customizer.

## Token tema (tema.css)
| Variabel | Bawaan | Dipakai untuk |
|---|---|---|
| `--tema-utama` | `#1e293b` slate | tombol primer, lencana "Dikerjakan", grafik jasa |
| `--tema-aksen` | `#dc2626` merah | logo, garis menu aktif, lencana "Menunggu", grafik sparepart, sorotan |
| `--tema-radius` | `12px` | kartu & tombol (`--r`), elemen kecil `--r-kecil = r × .6` |
| `--tema-font` | `"Space Grotesk"` | seluruh UI; plat & nota thermal pakai monospace sistem |
| `--tema-latar` / `--tema-panel` / `--tema-nav` / `--tema-teks` | `#f6f7f9` / `#fff` / `#0f172a` / `#0f172a` | bagian halaman (mode terang; mode gelap pakai palet sendiri kecuali customizer mengirim nilai bagian) |

Turunan (style.css): `--latar`, `--permukaan`, `--nav`, `--teks` per mode; `--permukaan-2`, `--garis`, `--teks-redup`, `--nav-redup`, `--nav-garis` dihitung dengan `color-mix()` dari panel+teks sehingga ikut berubah bila warna bagian diganti. `--utama-tombol` = utama digelapkan 12% (teks putih tetap ≥ 4.5:1). `--tema-nav-teks`, `--tema-utama-teks`, `--tema-aksen-teks` dihitung JS (luminansi) → putih atau `#0f172a`.

Warna status tetap: Menunggu = aksen, Dikerjakan = utama, Selesai = hijau `#15803d/#166534`, Diambil = netral. Merah peringatan `#991b1b` (terang) / `#fca5a5` (gelap).

## Tipografi
- Judul halaman 20px/700, judul kartu 16px/700, angka statistik 26px/800 `tabular-nums`, isi 15px, keterangan 13px.
- Plat nomor: monospace, latar hitam, garis tepi abu — meniru plat asli.

## Komponen
Kartu (`.kartu`), statistik, lencana status, plat, tiket kanban, tabel responsif (kolom kurang penting `.sembunyi-hp`), segmen (filter), modal (bottom-sheet di HP), toast, papan TV, nota A5 & thermal 58mm, keypad PIN.

## Motion
- Durasi: `--cepat .18s` (hover/tekan), `--sedang .32s` (kartu, sidebar), masuk halaman `.42s` dengan stagger 40ms; easing `cubic-bezier(.2,.8,.2,1)`.
- Masuk halaman & daftar bertahap (`.muncul`), modal skala+geser, toast naik, batang grafik tumbuh, donat berputar, kartu yang dipindah berdenyut (`sorot`), PIN salah bergoyang, teks berjalan di TV.
- Ganti tema/mode: transisi warna .35s (`.halus`).
- `prefers-reduced-motion: reduce` → semua animasi/transisi ~0 dan teks berjalan dimatikan.

## Aksesibilitas & responsif
Kontras AA kedua mode, fokus terlihat (outline 3px), skip link, modal dengan focus trap & Esc, tombol panah di kartu kanban sebagai alternatif seret-lepas, label pada semua input. Breakpoint 1100 / 860 (sidebar jadi laci + tab bawah) / 560px (form 1 kolom, modal bottom-sheet).
