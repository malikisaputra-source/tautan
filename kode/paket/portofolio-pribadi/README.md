# Portofolio Pribadi
Website portofolio satu halaman bergaya editorial: tipografi raksasa, potret melengkung, animasi GSAP halus, karya pilihan dengan filter & detail. Semua isi dari satu berkas `data.js`.

Request dari TikTok @anggrek.hitam.22 — terima kasih!

## Fitur
- Hero tipografi raksasa + potret (ilustrasi SVG, ganti dengan foto Anda)
- Animasi GSAP: tirai pembuka, teks naik per baris, parallax, angka berhitung, bar keahlian, kursor "Lihat", tombol magnetik
- Tentang, keahlian (bar + chip alat), pengalaman/timeline
- Karya pilihan: grid besar asimetris, filter kategori otomatis, detail di modal (bisa dibagikan: `#karya-2`)
- Testimoni geser otomatis, layanan + harga
- Kontak: tombol WhatsApp, email, salin email, form mailto dengan validasi
- Unduh CV (cv.html otomatis dari data → simpan PDF, atau PDF sendiri)
- Mode terang/gelap (tersimpan), responsif HP–desktop, reduced-motion, aksesibel (fokus, label, keyboard di modal)

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser (tanpa server, tanpa instal).
3. Ubah isi di `data.js` — panduan lengkap untuk pemula: **PANDUAN.md** (termasuk online gratis di GitHub Pages/Netlify).

## Struktur
```
index.html   kerangka halaman
data.js      SEMUA isi (nama peran, karya, pengalaman, kontak, ...)
app.js       render + animasi + modal + form
style.css    gaya
tema.css/js  token warna/font/radius & nama + mode
cv.html      CV cetak otomatis dari data.js
img/         potret.svg (ganti fotomu)
```

## Ubah brand/warna
Edit `tema.css`: `--tema-utama` (tombol, aksen judul), `--tema-aksen`, `--tema-radius`, `--tema-font`, dan `--tema-latar/panel/nav/teks`. Teks di atas warna utama otomatis putih/gelap sesuai kecerahan. Detail token: `DESIGN.md`.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini, skill di `.claude/skills/ubah-portofolio-pribadi` terbaca otomatis. Minta saja, mis. "tambah bagian sertifikat".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT © 2026 Maliki Saputra — lihat `LICENSE`. GSAP dimuat dari cdnjs (lisensi standar GreenSock, gratis).

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
