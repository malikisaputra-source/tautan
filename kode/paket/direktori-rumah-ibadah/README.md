# Direktori Rumah Ibadah

Web app direktori rumah ibadah semua umat — masjid, musala, gereja, pura, vihara, dan klenteng — yang datanya diisi dan diperbarui oleh member, lalu dicek pengurus sebelum tampil. Ada peta OpenStreetMap, cari terdekat, dan petunjuk arah ke Google Maps.

Dibuat dari permintaan TikTok @tsyamha90, ditambah **halaman website per tempat** atas permintaan @taniaflorist7 (contoh: Masjid Thoriqussalam — nama dari request, alamat & angka fiktif). Data contoh memakai kota fiktif "Kota Lembah Sari" (nama tempat, alamat, dan nomor kontak semuanya rekaan; titiknya diletakkan di peta sungguhan hanya untuk demo).

## Fitur
- Daftar + peta (Leaflet 1.9.4 + OpenStreetMap, tanpa API key)
- Filter per jenis (warna & ikon sejajar untuk semua agama) dan pencarian nama/jalan/kegiatan
- "Terdekat dari saya" pakai lokasi HP, urut jarak
- Halaman detail: foto (opsional), alamat, jam ibadah & kegiatan, fasilitas (parkir, akses kursi roda, toilet, tempat wudu untuk masjid/musala), kontak, tombol petunjuk arah Google Maps
- Member mengajukan tempat baru atau usulan perubahan → antrean moderasi
- Pengurus menyetujui/menolak (dengan alasan), semua tercatat di riwayat perubahan
- Akun member lokal sederhana (nama + PIN 4–6 angka)
- Ekspor/impor JSON (cadangan lengkap) & CSV (Excel/Google Sheets)
- **Jadikan website**: tiap tempat punya halaman profil sendiri — buka `index.html?tempat=<id>` atau tombol "Jadikan website" di detail. Isi: hero ilustrasi SVG (kubah untuk masjid/musala, siluet bangunan netral untuk jenis lain), jadwal sholat 5 waktu + imsak/terbit dan hitung mundur (dihitung lokal dari koordinat, kriteria Kemenag Subuh 20°/Isya 18°, ihtiyat 2 menit, tanpa API), pengumuman, kajian/kegiatan pekanan, laporan infak/kas + grafik, rekening & QRIS (placeholder), galeri SVG, kontak, WhatsApp & peta. Pengurus bisa mengedit semuanya lewat **Edit profil** dan mencatat transaksi kas.
- Mode gelap, rapi di HP & laptop, animasi halus (mati otomatis bila "kurangi gerakan" aktif)

## Cara menjalankan (pemula)
1. Unduh ZIP, ekstrak foldernya.
2. Klik dua kali `index.html` — terbuka di browser. Perlu internet untuk peta & font.
3. Klik **Masuk**: pengurus contoh **Pengurus Kota**, PIN **1234** (member contoh: Rina Wulandari, PIN 1111). Nama baru otomatis jadi akun member.
4. Coba menu **Ajukan**, lalu buka **Moderasi** sebagai pengurus untuk menyetujui.
5. Siap pakai sungguhan: **Data › Kosongkan data**, lalu isi kotamu. Di `app.js` ubah `PUSAT` (titik tengah peta) dan `KOTA`.
6. Ekspor JSON rutin supaya data aman.

Contoh website masjid: `index.html?tempat=thoriqussalam`. Panduan langkah demi langkah sampai online gratis: **PANDUAN.md**.

Tip: tambahkan `?demo` di alamat untuk langsung masuk sebagai pengurus (dipakai untuk pratinjau).

## Struktur folder
```
index.html   kerangka halaman & ikon SVG
style.css    gaya, mode gelap, responsif
app.js       logika: data, peta, form, moderasi, ekspor/impor
profil.js    halaman website satu tempat: jadwal sholat, kegiatan, kas, editor
profil.css   gaya halaman website
PANDUAN.md   panduan pemula
tema.css     warna/radius/font (customizer)
tema.js      nama direktori & mode terang/gelap
ikon.svg     ikon aplikasi
DESIGN.md    sistem desain
AGENTS.md, .claude/skills/ubah-direktori-rumah-ibadah/SKILL.md   panduan untuk AI
```

## Ubah brand/warna
- Nama & mode: `tema.js` → `nama`, `mode` ("terang" | "gelap" | "auto").
- Warna/radius/font: `tema.css`. Semua warna lain turunan dari situ; teks di atas tombol utama otomatis putih/gelap.
- Warna tiap jenis rumah ibadah ada di `style.css` (`--j-masjid`, `--j-gereja`, …) dan sengaja dibuat setara supaya tidak ada yang lebih menonjol.

## Banyak member (opsional, butuh sedikit ngoding)
Versi ini menyimpan data di browser masing-masing (localStorage), jadi cocok untuk satu perangkat pengurus atau demo. Supaya banyak member mengisi bersama:

**Opsi A — Google Sheets + Apps Script (gratis, paling mudah)**
1. Buat Google Sheet dengan tab `tempat` dan `antrean`; baris pertama = kolom yang sama dengan hasil **Unduh CSV**.
2. Extensions › Apps Script: buat `doGet` (kembalikan isi sheet sebagai JSON) dan `doPost` (tambah baris ke tab `antrean`).
3. Deploy › New deployment › Web app, akses "Anyone". Salin URL-nya.
4. Di `app.js`: pada `muat()` ambil data dengan `fetch(URL)`, dan pada submit form kirim `fetch(URL, {method:'POST', body: JSON.stringify(usulan)})`. Moderasi bisa langsung di Sheet atau lewat halaman Moderasi.

**Opsi B — Supabase (database + login sungguhan)**
1. Buat proyek di supabase.com, tabel `tempat` dan `antrean` (kolom seperti JSON cadangan).
2. Aktifkan Row Level Security: semua orang boleh membaca `tempat`, member login boleh menambah ke `antrean`, hanya peran pengurus yang boleh mengubah `tempat`.
3. Muat `@supabase/supabase-js` dari CDN versi pasti, ganti `muat()/simpan()` dengan query, dan ganti akun PIN dengan Supabase Auth (email/OTP).

Catatan keamanan: PIN di versi lokal hanya penanda sederhana, **bukan** sistem keamanan. Untuk data publik, pakai login sungguhan (Opsi B).

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini, skill di `.claude/skills/ubah-direktori-rumah-ibadah` terbaca otomatis. Minta saja, mis. "tambah fasilitas ramah anak".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Kredit peta
Peta © kontributor OpenStreetMap (ODbL), pustaka Leaflet (BSD-2). Patuhi kebijakan pemakaian ubin OSM; untuk trafik besar pakai penyedia ubin sendiri.

## Lisensi
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
