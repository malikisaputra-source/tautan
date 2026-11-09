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

MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

---

Dibuat oleh **Maliki Studio** — malikisaputra.biz.id, follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto

Semua path gambar ada di **satu tempat**: objek `window.GAMBAR` di bagian atas `data.js`. Cara termudah: timpa berkas di folder `img/` dengan nama yang sama.

| Berkas | Tampil di | Ukuran disarankan |
|---|---|---|
| `img/logo.svg` | header & kop surat pengantar | persegi, 256×256 (PNG/SVG) |
| `img/hero-lingkungan.svg` | foto besar di beranda (aktifkan: isi `hero: 'img/hero-lingkungan.jpg'`) | 1600×1000 |
| `img/pengurus-1..4.svg` | foto di Kontak pengurus (urut sesuai daftar pengurus) | 400×400 (1:1) |
| `img/galeri-1..4.svg` | Galeri kegiatan di beranda (`ket` = keterangan foto) | 800×600 (4:3) |

- Pakai JPG/PNG? Ubah ekstensinya di `window.GAMBAR` (mis. `'img/logo.png'`). Tambah foto galeri = tambah baris `{ src, ket }`.
- Kosongkan path (`''`) untuk menyembunyikan. Bila gambar gagal dimuat, otomatis kembali ke ikon rumah atau inisial nama.
- Setelah mengganti berkas di situs online, naikkan `CACHE` di `sw.js` (mis. `website-rt-v3`) agar HP warga memuat gambar baru.
- Placeholder bawaan hanya bingkai berlabel, bukan foto orang asli.

<!-- panduan-ai-maliki -->
## Ubah sendiri sesuai kebutuhanmu pakai AI

Kamu tidak perlu jago coding. Template ini sudah disiapkan supaya mudah diubah AI: ada **AGENTS.md** (aturan proyek untuk AI), **DESIGN.md** (gaya desain), dan skill Claude di folder `.claude/skills/`. Pilih salah satu cara di bawah.

### Cara 1: ChatGPT, Claude, atau Gemini di browser (paling gampang, gratis)
1. Unduh ZIP template ini, lalu ekstrak.
2. Buka chatgpt.com, claude.ai, atau gemini.google.com.
3. Unggah berkas yang mau diubah (biasanya `index.html`, `style.css`, `app.js`, atau berkas data). Unggah juga `AGENTS.md` dan `DESIGN.md` (kalau ada) biar AI paham aturannya. ChatGPT juga bisa menerima ZIP utuh.
4. Tulis permintaanmu (contoh di bawah), lalu minta: "Kirim ulang berkas yang diubah secara utuh."
5. Ganti berkas lama dengan hasil dari AI, lalu buka `index.html` di browser untuk cek.

### Cara 2: Claude Code (paling rapi untuk perubahan besar)
1. Pasang Claude Code (lihat claude.com/claude-code), atau pakai aplikasi Claude Desktop tab Code.
2. Buka folder template ini, lalu jalankan `claude` di terminal folder itu.
3. Tulis permintaanmu. Kalau ada folder `.claude/skills/ubah-…`, Claude Code otomatis memakainya, jadi hasilnya tetap mengikuti desain aslinya.

### Cara 3: Codex (OpenAI)
1. Pasang Codex CLI atau pakai Codex di aplikasi ChatGPT.
2. Buka folder template, jalankan `codex`. Codex otomatis membaca `AGENTS.md`.
3. Tulis permintaanmu, cek perubahannya, lalu setujui.

### Cara 4: Google Antigravity atau Gemini CLI (gratis)
1. Antigravity: buka aplikasinya, pilih **Open Folder** ke folder template ini, lalu tulis permintaan di panel agen.
2. Gemini CLI: jalankan `gemini` di folder template.
3. Di awal, tulis: "Baca AGENTS.md dan DESIGN.md dulu sebelum mengubah apa pun."

### Contoh permintaan yang bisa langsung kamu pakai
- "Ganti nama, logo teks, dan warna utama jadi hijau tua sesuai usahaku: [nama usaha]."
- "Tambahkan kolom [nama kolom] di formulir dan tampilkan di daftar."
- "Ubah semua data contoh jadi data usahaku: [tempel datanya]."
- "Tambahkan halaman/menu baru untuk [kebutuhan], gaya desainnya sama dengan yang sudah ada."
- "Jelaskan dulu cara kerja aplikasi ini dengan bahasa sederhana, baru ubah [bagian]."

### Tips biar hasilnya bagus
- Satu permintaan = satu perubahan. Cek dulu hasilnya, baru minta yang berikutnya.
- Simpan salinan folder asli sebelum mengubah, jadi bisa balik kalau ada yang rusak.
- Kalau ada error, salin pesan errornya (klik kanan > Inspect > Console) lalu tempel ke AI.
- Data aplikasi tersimpan di browser (localStorage). Backup dulu sebelum ganti versi.
- Jangan hapus kredit "Template oleh @malikisaputra", dan template ini **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya (@malikisaputra).

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
