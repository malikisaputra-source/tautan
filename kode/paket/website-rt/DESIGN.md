# DESIGN.md — Website RT/RW

Arah: **"kampung hangat"** — latar krem, tinta biru tua, kartu pastel, dan ilustrasi lingkungan yang hidup. Dirombak 7 Nov 2026 dari riset Pinterest kategori rt: #19 (ilustrasi rumah-rumah + tetangga menyapa, judul tebal biru tua di latar krem), #51 (kartu pastel kuning/ungu/hijau ala "Good Morning"), #37 (kartu langkah pastel dengan ikon + ajakan). Pola UX dari ui-ux-pro-max: *funnel 3 langkah* (hero → langkah → aksi), motion *stagger list* dengan easing ease-out.

## Token
Sumber tunggal: `tema.css` (diubah customizer) → diturunkan di `style.css` bagian `:root`.

| Token tema | Bawaan | Dipakai untuk |
|---|---|---|
| `--tema-utama` | `#2c6e49` hijau daun | tombol primer, atap rumah tengah, pohon, logo, batang pemasukan |
| `--tema-aksen` | `#e2723b` terakota | atap rumah, tanggal agenda, sorotan kata di hero, titik hitung mundur, batang pengeluaran |
| `--tema-radius` | `18px` | sudut kartu; `--r-kecil` = 60% (input), `--r-besar` = 160% (hero & kartu sapa). Tombol & chip selalu pil |
| `--tema-font` | Nunito | seluruh UI (bobot 800–900 untuk judul); surat cetak memakai Times New Roman |
| `--tema-latar` / `--tema-panel` / `--tema-nav` / `--tema-teks` | `#fbf5ea` / `#fffdf8` / `#fbf5ea` / `#1f2a3a` | latar krem, kartu, header+sidebar+nav bawah, tinta biru tua |

Turunan (jangan isi warna mentah baru, selalu `color-mix` dari token):
- `--utama-teks`, `--utama-latar`, `--utama-garis`, `--utama-tua`, `--aksen-teks`, `--aksen-latar`, `--redup` (70% teks, lolos AA), `--garis` (11% teks), `--permukaan-2`.
- **Pastel** `--p-hijau` (utama 16%), `--p-oranye` (aksen 20%), `--p-kuning` (`#f4c443` 32%), `--p-ungu` (`#8f7ff0` 22%) — dicampur ke `--permukaan`, jadi otomatis gelap di mode gelap. Kelas `.p-hijau/.p-kuning/.p-ungu/.p-oranye`.
- `--nav-teks`, `--pada-utama`: dihitung JS (`hitungTeksKontras`).
- Semantik tetap: `--bahaya`, hijau WhatsApp `#0b7a3e`, umbul-umbul merah `#d6453d`/putih, kulit tokoh `#c98a5e`.

Mode gelap: `:root[data-mode="gelap"]` (latar `#121417`, panel `#1b1e23`, teks `#ecebe6`); di ilustrasi jendela rumah menyala kuning dan matahari jadi bulan.

## Tipografi
- Hero 32–54px/900 (spasi −.03em), sapaan panel 26–38px/900, judul halaman 24–32px/900, judul bagian 20–24px/900, judul kartu 17px/800, isi 15px/1.55, keterangan 12–13px/600–700.
- Angka: `tabular-nums`, 24–32px/900. NIK/No. KK/nomor surat: monospace sistem.

## Tata letak
- Publik: hero 2 kolom (teks | ilustrasi SVG yang menempel ke tepi kanan & bawah) → "Yang bisa Anda lakukan" 4 kartu langkah pastel bernomor (2 kolom ≤980px, 1 kolom ≤460px) → papan pengumuman (1.35fr) + kolom agenda/kontak/statistik (1fr).
- Panel desktop ≥861px: header lengket + sidebar 248px (item pil, aktif = pil tinta gelap + titik aksen). Ringkas dibuka kartu sapa kuning + 4 statistik pastel.
- HP ≤860px: nav bawah melayang (pil 26px, inset 10px), statistik 2 kolom. Modal jadi *bottom sheet* di ≤600px.

## Komponen
`.pahlawan` (+ `.pahlawan-teks`, `.pahlawan-gambar`, `.ilustrasi` dengan `.il-*`), `.langkah` (+ `-no`, `-ikon`, `-cta`), `.sapa-kartu`, `.judul-baris`, `.kartu`, `.stat` (+ pastel), `.btn` (pil) / `.btn-garis` / `.btn-hapus` / `.btn-wa` / `.btn-kecil` / `.btn-ikon`, `.chip[aria-pressed]`, `.lencana`, `.daftar` (avatar berselang hijau/kuning/ungu), `.kk-kartu`, `.tabel-wadah`, `.cincin`, `.grafik`, `.info-kartu` + `.tgl-blok`, `.sematan` (pastel hijau), `.papan-pin` (tombol bulat), `dialog#modal`, `.toast`, `.surat` (A4).

## Motion
- Durasi: cepat .18s, sedang .35s, halaman .45s, modal .32s. Easing `--lentur` cubic-bezier(.2,.8,.2,1) dan `--pegas` cubic-bezier(.22,1,.36,1) (ease-out-quint, tanpa pantul) untuk masuk daftar, kartu langkah, ikon.
- Ilustrasi: rumah tumbuh bergiliran (.1/.22/.34s), dua tetangga melambai, pohon bergoyang, umbul-umbul berkibar bergiliran, awan bergeser, matahari berdenyut.
- UI: daftar muncul bertahap (55ms per item), kartu langkah naik + miring tipis saat hover dan ikonnya berputar, tombol `scale(.96)` saat ditekan, titik hitung mundur berdenyut 3 kali, ikon mode berputar saat ganti, batang/garis grafik tumbuh, angka menghitung naik, PIN salah bergoyang.
- `prefers-reduced-motion: reduce` mematikan semua animasi & transisi.

## Aksesibilitas
- Kontras AA di kedua mode (teks redup ≥4.5:1). Fokus terlihat (`:focus-visible` 3px). Tautan "Lewati ke konten".
- Semua input punya `<label>`; tombol ikon punya `aria-label`; nav aktif `aria-current="page"`; filter pakai `aria-pressed`; toast `aria-live`.
- Target sentuh ≥44px (tombol, chip, nav, ikon).

## Bagian untuk customizer
`data-bagian`: `nav` (header, sidebar, nav bawah), `latar` (body, main), `panel` (kartu, tabel, modal, kartu langkah, kartu sapa), `utama` (tombol primer, chip aktif, logo, hero), `aksen` (lencana, grafik, tanggal, hitung mundur), `teks` (judul & paragraf). Ditandai otomatis oleh `tandaiBagian()` setiap render.
