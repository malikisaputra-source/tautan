# Panduan Pemula — Portofolio Pribadi
Tidak perlu bisa coding. Cukup ikuti langkah ini pelan-pelan.

## 1. Buka dulu
1. Ekstrak ZIP, buka foldernya.
2. Klik dua kali `index.html` — portofolio contoh tampil di browser.

## 2. Ganti isi (semua di `data.js`)
1. Klik kanan `data.js` › Open with › Notepad (Windows) / TextEdit (Mac). Lebih nyaman: VS Code (gratis).
2. Ganti teks di antara tanda kutip `"..."`. Contoh: `peran: "Fotografer Pernikahan"`.
3. **Jangan hapus** tanda kutip, koma di akhir baris, atau kurung `{ } [ ]`.
4. Simpan, lalu refresh browser (F5). Kalau halaman kosong, kemungkinan ada koma/kutip yang terhapus — cek baris terakhir yang diubah.

Yang bisa diganti:
- **Nama** → di `tema.js` (`nama: "..."`), juga mode bawaan `"terang"`/`"gelap"`/`"auto"`.
- **Judul besar** → `judulBesar` (tiap baris satu teks; baris ke-3 otomatis miring berwarna).
- **WhatsApp** → `wa: "62812..."` (awali 62, tanpa + dan spasi). **Email** → `email`.
- **Keahlian, alat, pengalaman, testimoni, layanan** → tinggal tambah/hapus blok `{ ... },`.
- **Karya** → tiap karya satu blok. `kategori` bebas (tombol filter dibuat otomatis). `bentuk`: "hp", "web", "logo", "ilus" untuk ilustrasi sampul otomatis.
- Cocok untuk desainer, developer, fotografer, mahasiswa — ganti saja kategorinya (mis. "Wedding", "Produk", "Skripsi").

## 3. Ganti foto
1. Siapkan foto potret (portrait, idealnya 800×1000 px, < 300 KB — kecilkan di squoosh.app).
2. Taruh di folder `img/`, misalnya `img/foto-saya.jpg`.
3. Di `data.js` ubah `foto: "img/foto-saya.jpg"`.
4. Foto karya: taruh di `img/`, lalu di blok karya tambahkan `gambar: "img/karya-1.jpg",` (rasio 4:3).

## 4. CV
- Bawaan: tombol "Unduh CV" membuka `cv.html` yang dibuat otomatis dari data.js — klik "Simpan sebagai PDF".
- Punya CV PDF sendiri? Taruh di folder, lalu `cv: "cv-saya.pdf"`.

## 5. Online gratis — GitHub Pages
1. Daftar di github.com (gratis).
2. Klik **+** (kanan atas) › **New repository**. Nama: `namakamu.github.io` (ganti `namakamu` dengan username GitHub). Pilih **Public** › **Create repository**.
3. Klik **uploading an existing file**. Seret SEMUA isi folder (bukan foldernya) — index.html harus di paling luar. Klik **Commit changes**.
4. Buka **Settings** › **Pages** › Source: **Deploy from a branch**, Branch: **main** / **(root)** › **Save**.
5. Tunggu 1–2 menit, buka `https://namakamu.github.io`. Selesai!
6. Ubah isi nanti: buka `data.js` di GitHub › ikon pensil › edit › **Commit changes**.

## 6. Atau Netlify (paling cepat, tanpa akun Git)
1. Buka app.netlify.com/drop dan daftar/masuk (gratis).
2. Seret folder portofolio ke kotak "Drag and drop".
3. Dapat alamat `xxx.netlify.app`. Ganti nama: **Site configuration** › **Change site name**.
4. Update: seret ulang folder di tab **Deploys**.

## 7. Form kontak
Form memakai `mailto:` — saat dikirim, aplikasi email pengunjung terbuka dengan pesan terisi. Tanpa server, gratis selamanya.

## Butuh bantuan?
Lihat README bagian "Ubah pakai Claude" — tinggal minta "ganti warna jadi hijau" atau "tambah karya baru".

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
