# DESIGN.md — Manajemen Klien (CRM)

Arah desain dari ui-ux-pro-max ("freelancer client CRM invoice dashboard", motion 6, density 7): **Flat/SaaS dashboard**, biru profesional + hijau "deal", kepadatan standar, motion "stagger list".

## Token
| Token | Bawaan | Fungsi |
|---|---|---|
| `--tema-utama` | `#2563eb` | tombol primer, tab/nav aktif, tautan, batang grafik |
| `--tema-aksen` | `#059669` | badge, bulan berjalan di grafik, tag |
| `--tema-radius` | `14px` | sudut kartu (`--r`), kontrol pakai `--r-kecil` = 0,6× |
| `--tema-font` | Plus Jakarta Sans | seluruh UI |
| `--tema-latar / --tema-panel / --tema-nav / --tema-teks` | `#f5f7fb / #fff / #fff / #0f172a` | warna per bagian (terang). Mode gelap memakai palet gelap paket kecuali customizer mengirim nilai bagian. |

Turunan (style.css): `--utama-tua`, `--utama-teks` (teks berwarna brand, AA di kedua mode), `--utama-muda` (latar lembut), `--aksen-muda/-teks`, `--utama-on` & `--nav-teks` (putih/gelap otomatis dari luminansi di app.js). Status: `--hijau --merah --kuning --biru` + varian `-muda`, masing-masing disetel ulang untuk mode gelap.

## Tipografi
Judul halaman 28/800 (HP 23), judul kartu 16/700, isi 15/400, label 13/600, angka `tabular-nums`. Letter-spacing judul −0,02em.

## Komponen
Sidebar (nav) + header lengket dengan pemicu pencarian ⌘K · kartu statistik (satu "sorot" bergradasi utama) · daftar dengan avatar inisial · chip status (Draft abu, Terkirim biru, Lunas hijau, Telat merah) · tabel responsif (kolom `.sembunyi-hp`) · segmen filter (`aria-pressed`) · kanban 5 kolom (seret-lepas + tombol panah + tombol keyboard ←/→) · kartu proyek dengan bar progres & checklist · modal (lembar bawah di HP) · command palette (combobox + listbox) · toast · layar PIN · dokumen cetak A4 (`.dok`).

## Motion
- Halaman masuk 450ms naik 10px; daftar/kartu muncul bertahap 50ms/item.
- Modal & palet: skala .96→1 dengan easing pegas `cubic-bezier(.34,1.56,.64,1)`; keluar 200ms.
- Batang grafik tumbuh 900ms bertahap; bar progres beranimasi lebar 800ms; centang tugas "pop".
- Ganti tema/mode: transisi warna .35s (kelas `.halus`).
- `prefers-reduced-motion: reduce` mematikan semua animasi & transisi.

## Aksesibilitas
Kontras teks AA di terang & gelap; fokus terlihat (`:focus-visible` cincin utama); jebakan fokus di modal; Esc menutup; label `for` otomatis pada semua isian; tombol ikon ber-`aria-label`; tautan "Lewati ke konten".
