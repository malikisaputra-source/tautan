# Website RT/RW: Warga, Iuran, Kas & Surat

Aplikasi web untuk pengurus RT/RW. Ada halaman publik untuk warga (pengumuman, agenda, kontak pengurus) dan panel pengurus berkunci PIN untuk mengelola data warga, iuran, kas, dan surat pengantar.

Semuanya murni HTML, CSS, dan JavaScript. Tidak perlu server, database, atau langganan. Data tersimpan di browser perangkat yang dipakai.

## Fitur

- **Halaman publik warga**: hero dengan hitung mundur agenda terdekat, papan pengumuman (bisa disematkan), agenda, kontak pengurus dengan tombol chat WhatsApp.
- **Panel pengurus** dikunci PIN lokal (contoh: **1234**).
- **Ringkas**: jumlah KK (tetap/kontrak), jumlah jiwa (L/P), persentase iuran bulan ini, saldo kas, grafik kas 6 bulan, daftar warga yang perlu diingatkan, aksi cepat.
- **Data warga & KK**: tambah/ubah/hapus, anggota keluarga lengkap (NIK, TTL, agama, pekerjaan, status kawin), cari nama/NIK/No. KK/alamat, saring tetap/kontrak.
- **Iuran bulanan per KK**: tandai lunas sekali ketuk (otomatis masuk kas), hitung tunggakan, rekap 6 bulan, pengingat WhatsApp berformat rapi per KK, salin daftar belum bayar untuk grup WA.
- **Kas RT**: pemasukan/pengeluaran per kategori, saldo, grafik SVG buatan sendiri (tanpa library).
- **Pengumuman & agenda**: tampil di halaman publik, bisa dibagikan ke WhatsApp.
- **Surat pengantar**: isi otomatis dari data warga, nomor surat otomatis (`001/RT05/RW02/XI/2026`), kop RT, siap cetak A4 atau simpan PDF.
- **Ekspor/impor**: CSV warga, kas, iuran (bisa dibuka di Excel/Google Sheets), cadangan & pulihkan JSON.
- **Tampilan**: mode terang/gelap, warna utama/aksen, huruf, dan sudut bisa diatur dari Pengaturan. Animasi halus dan otomatis mati kalau perangkat meminta gerak dikurangi.
- **PWA**: bisa di-install di HP dan jalan tanpa internet (lewat https/localhost).
- **Responsif**: sidebar di laptop, nav bawah di HP. Label, fokus keyboard, dan kontras memenuhi WCAG AA.

## Cara menjalankan (pemula)

### Coba cepat
1. Unduh folder ini lalu klik ganda `index.html`. Halaman publik langsung tampil dengan data contoh.
2. Klik **Pengurus** di kanan atas, masukkan PIN **1234**.
3. Mau langsung masuk panel tanpa PIN (untuk demo)? Buka `index.html?demo`. Mode demo tidak mengubah data aslimu.

### Pakai beneran
1. Unggah semua berkas ke hosting statis gratis yang HTTPS: GitHub Pages, Netlify, Vercel, atau Cloudflare Pages.
   - GitHub Pages: buat repo, unggah berkas, buka **Settings → Pages → Deploy from branch → main / root**.
2. Buka alamatnya di HP pengurus, lalu menu ⋮ → **Install aplikasi**.
3. Masuk panel, buka **Pengaturan** (ikon gerigi di HP):
   - isi Identitas RT, besaran iuran, cara bayar, dan daftar pengurus,
   - ganti PIN,
   - klik **Kosongkan semua data**, lalu mulai isi data warga (atau impor CSV).
4. Rutin klik **Unduh cadangan JSON**. Data hanya ada di perangkat itu, jadi cadangan adalah penyelamat kalau HP ganti atau browser dibersihkan.

> Catatan: halaman publik menampilkan data dari perangkat yang membukanya. Untuk papan pengumuman yang dibaca warga dari HP masing-masing, bagikan pengumuman lewat tombol **Bagikan ke WA**, atau pasang aplikasi di satu perangkat bersama (misal tablet di pos ronda).
> PIN hanya kunci tampilan di perangkat itu, bukan pengamanan server. Jangan pakai di komputer umum.

## Struktur folder

```
website-rt/
├── index.html            kerangka halaman
├── tema.css              token warna/huruf/sudut (diubah customizer)
├── tema.js               nama RT & mode bawaan
├── style.css             tampilan, animasi, gaya cetak A4
├── data.js               data contoh RT 05/RW 02 (fiktif)
├── app.js                semua logika aplikasi
├── sw.js                 service worker (offline)
├── manifest.webmanifest  info PWA
├── ikon.svg              ikon aplikasi
├── DESIGN.md             aturan desain (token, komponen, motion)
├── AGENTS.md             ringkasan untuk agen AI
└── .claude/skills/ubah-website-rt/SKILL.md   skill Claude untuk mengubah aplikasi
```

## Ubah brand & warna

- **Nama RT di judul & kop surat**: ubah `nama` di `tema.js`, atau lewat Pengaturan › Tampilan.
- **Warna, huruf, sudut**: ubah `tema.css`. Seluruh warna lain diturunkan otomatis dari `--tema-utama` dan `--tema-aksen`.
- **Warna per bagian**: `--tema-latar`, `--tema-panel`, `--tema-nav`, `--tema-teks`.
- **Kontras**: teks di atas warna utama dihitung otomatis hitam atau putih. Tetap pilih warna utama yang cukup gelap (misal hijau tua, biru tua, ungu) supaya tombol enak dibaca. Warna terlalu terang seperti kuning muda akan membuat teks berubah hitam.
- Pengguna juga bisa mengatur tampilan langsung dari **Pengaturan › Tampilan** tanpa menyentuh kode.

## Ubah pakai Claude

Paket ini sudah membawa skill `ubah-website-rt` supaya Claude paham struktur aplikasinya.

- **Claude Code / Claude Desktop**: buka folder paket ini. Skill di `.claude/skills/` terbaca otomatis. Coba minta: "tambah kolom golongan darah di data warga" atau "ganti warna jadi hijau tosca".
- **claude.ai**: unduh ZIP skill (tombol **Unduh Skill** di malikisaputra.biz.id/kode), lalu di claude.ai buka **Customize › Skills › tombol "+" › Create skill › Upload a skill** dan pilih ZIP tersebut (folder skill sebagai akar ZIP). Syarat: **Code execution and file creation** aktif di **Settings › Capabilities** (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).
- Agen lain (Cursor, Copilot, Codex) bisa membaca `AGENTS.md`.

## Mau hasil lebih maksimal?

Pasang dua skill desain ini di Claude agar perubahan tampilan tetap rapi:

- **impeccable**: https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- **ui-ux-pro-max**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

Lalu minta Claude mengikuti `DESIGN.md` saat mengubah tampilan.

## Lisensi

MIT. Lihat `LICENSE`. Bebas dipakai, diubah, dan dijual ulang dengan tetap mencantumkan lisensi.

---

Dibuat oleh **Maliki Studio** — malikisaputra.biz.id, follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
