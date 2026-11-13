# DESIGN — Landing Kelas Virtual

Arah: editorial premium. Judul serif Fraunces besar dengan sorotan stabilo aksen, isi sans (`--tema-font`), ungu tinta + kuning kuningan. Banyak ruang kosong, kartu bergaris tipis, satu blok gelap penutup. Ilustrasi SVG buatan sendiri (layar template melayang, potret mentor ilustrasi, segel jaminan).

## Token (tema.css)
| Token | Bawaan | Dipakai untuk |
|---|---|---|
| `--tema-utama` | `#3a2a78` | tombol beli, nomor modul, avatar, layar ilustrasi |
| `--tema-aksen` | `#e9a23b` | sorotan judul, tombol header & penutup, segel, bonus, fokus |
| `--tema-radius` | `14px` | tombol/akordion; kartu besar = +10px (`--r-besar`) |
| `--tema-font` | Plus Jakarta Sans | teks isi; judul & harga tetap Fraunces (`--serif`) |
| `--tema-latar/panel/nav/teks` | `#f6f4fa / #fff / #1c1538 / #1a1730` | bagian customizer |

Turunan (`style.css :root`): `--utama-tua`, `--utama-muda`, `--aksen-muda`, `--redup`, `--garis`, `--bayang`. Teks di atas utama/nav dihitung JS (`--tema-utama-teks`, `--tema-nav-teks`). Teks di atas aksen selalu `#1a1406` (aksen harus terang-sedang).

## Komponen
Header lengket gelap · hero 2 kolom (teks + kotak harga dengan harga coret, badge hemat, tombol 58px, countdown) · daftar cocok/tidak cocok · akordion kurikulum bernomor · 3 kartu bonus dengan nilai coret · mentor + potret ilustrasi · testimoni bertanda "Contoh" · kartu jaminan bersegel · FAQ akordion · penutup gelap + tombol WA · bar beli melayang (≤760px, muncul setelah melewati kotak harga, sembunyi di penutup).

## Motion
Elemen `.muncul` naik 22px + fade, bertahap 70ms (IntersectionObserver); ilustrasi melayang; kilau berkedip; segel berputar pelan; akordion membuka via grid-rows; bar melayang meluncur. Semua mati di `prefers-reduced-motion`.
