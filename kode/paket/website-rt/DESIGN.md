# DESIGN.md — Website RT/RW

Arah: **minimalis ala Swiss** yang ramah warga. Bersih, berbasis grid, kontras tinggi, dan tanpa hiasan yang tidak perlu. Hijau zamrud dipilih karena terasa "lingkungan & guyub", oranye jadi aksen untuk sesuatu yang perlu perhatian (agenda, pengeluaran, tunggakan). Acuan awal: ui-ux-pro-max (palet "location green + action orange", Inter, motion "stagger list"), lalu dipoles dengan alur impeccable.

## Token
Sumber tunggal: `tema.css` (diubah customizer) → diturunkan di `style.css` bagian `:root`.

| Token tema | Bawaan | Dipakai untuk |
|---|---|---|
| `--tema-utama` | `#047857` | tombol primer, tab/nav aktif, logo, batang pemasukan |
| `--tema-aksen` | `#ea580c` | lencana agenda/kontrak, batang pengeluaran, titik hitung mundur |
| `--tema-radius` | `14px` | sudut kartu; `--r-kecil` = 60% untuk tombol & input |
| `--tema-font` | Inter | seluruh UI (surat cetak memakai Times New Roman) |
| `--tema-latar` / `--tema-panel` / `--tema-nav` / `--tema-teks` | `#f3f6f4` / `#fff` / `#fff` / `#13201c` | latar, kartu/modal/tabel, header+sidebar+nav bawah, teks |

Turunan (jangan diisi warna mentah baru, selalu `color-mix` dari token):
- `--utama-teks` (teks berwarna utama: 78% utama + hitam di terang, 50% + putih di gelap), `--utama-latar`, `--utama-garis`, `--utama-tua`.
- `--aksen-teks`, `--aksen-latar`.
- `--redup` = 72% teks di atas panel (lolos AA), `--garis` = 13% teks, `--permukaan-2` = 3% teks.
- `--nav-teks`, `--pada-utama`: dihitung JS (`hitungTeksKontras`) dengan luminansi, hasilnya hitam/putih yang paling kontras.
- Semantik tetap: `--bahaya` (`#b42318` / gelap `#ff9b8f`), hijau WhatsApp `#0b7a3e`.

Mode gelap: palet netral sendiri di `:root[data-mode="gelap"]` (latar `#0c1110`, panel `#141b19`, nav `#111816`, teks `#e7eeeb`). Nilai bagian dari customizer menimpa kedua mode (di-set inline oleh JS).

## Tipografi
- Judul halaman 22–28px/800, judul kartu 16px/700, isi 15px/1.5, keterangan 12–13px.
- Angka: `font-variant-numeric: tabular-nums`. NIK/No. KK/nomor surat: monospace sistem.

## Tata letak
- Desktop ≥861px: header lengket + sidebar 232px + konten maks 1280px.
- HP ≤860px: sidebar hilang, **nav bawah 6 ikon** (Pengaturan lewat ikon gerigi di header). Konten diberi ruang bawah 96px.
- Grid kartu `auto-fit minmax(190px)`, dua kolom `minmax(340px)`. Modal jadi *bottom sheet* di ≤600px.

## Komponen
`.kartu`, `.stat` (+ hitung naik), `.btn` / `.btn-garis` / `.btn-hapus` / `.btn-wa` / `.btn-kecil` / `.btn-ikon`, `.chip[aria-pressed]`, `.lencana(.aksen|.bahaya|.netral)`, `.daftar`, `.avatar`, `.kk-kartu`, `.tabel-wadah`, `.cincin` (progres iuran), `.grafik` (SVG buatan sendiri), `.info-kartu` + `.tgl-blok`, `.pahlawan` (hero publik), `.papan-pin`, `dialog#modal`, `.toast`, `.surat` (A4).

## Motion
- Durasi: cepat .18s (hover/tekan), sedang .35s (warna/tema), masuk halaman .45s, modal .32s, toast .35s. Easing `cubic-bezier(.2,.8,.2,1)`.
- Pola: halaman fade+naik, daftar muncul bertahap (`.stagger`, 45ms per item, maks 14), tombol `scale(.96)` saat ditekan, batang grafik tumbuh, garis saldo tergambar, angka statistik menghitung naik, PIN salah bergoyang, cap "lunas".
- `prefers-reduced-motion: reduce` mematikan semua animasi & transisi; angka langsung tampil final.

## Aksesibilitas
- Kontras AA di kedua mode (teks redup ≥4.5:1). Fokus terlihat (`:focus-visible` 3px). Tautan "Lewati ke konten".
- Semua input punya `<label>`; tombol ikon punya `aria-label`; nav aktif `aria-current="page"`; filter pakai `aria-pressed`; toast `aria-live`.
- Target sentuh ≥36px (umumnya 42–44px).

## Bagian untuk customizer
`data-bagian`: `nav` (header, sidebar, nav bawah), `latar` (body, main), `panel` (kartu, tabel, modal), `utama` (tombol primer, chip aktif, logo, hero), `aksen` (lencana, grafik, tanggal), `teks` (judul & paragraf). Ditandai otomatis oleh `tandaiBagian()` setiap render.
