# Portofolio Pribadi
Template portofolio dua halaman (beranda + detail karya) bergaya "Senja Terakota": krem hangat bertekstur, terakota & hijau zaitun, judul serif Fraunces, gradasi senja di hero, benda 3D melayang, dan gerak halus. Semua isi (contoh fiktif: "Nadia Larasati") ada di satu berkas `data.js`.

Request dari TikTok @anggrek.hitam.22 — terima kasih!

## Fitur
- Hero: lencana, sapaan + peran serif miring, potret lengkung, pil status, tombol email & LinkedIn
- Marquee logo tempat kerja/klien
- Pernyataan dengan kata yang menyala saat digulir, chip keahlian kiri/kanan
- Karya pilihan (sampul + benda 3D), angka bersumber, 3 langkah cara kerja, rak semua karya
- Tentang + riwayat, ajakan kontak, footer dengan nama raksasa
- Halaman detail karya `karya.html?id=...`: tantangan, yang dilakukan, hasil, statistik, peran, pelajaran, karya berikutnya
- Mode terang/gelap, responsif HP–desktop, prefers-reduced-motion, tanpa library dan tanpa build

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser.
3. Ubah isi di `data.js` dan gambar di `img/`. Panduan pemula: **PANDUAN.md**.

## Struktur
```
index.html     beranda
karya.html     detail karya (karya.html?id=<id>)
data.js        SEMUA isi + alamat gambar
app.js         render + gerak + mode + tema
style.css      gaya
tema.css/js    token warna/font/radius & nama + mode
img/           logo.svg, foto-profil.svg, logo-klien/, karya/, objek/ (benda 3D)
```

## Ubah brand/warna
Edit `tema.css`: `--tema-utama` (terakota bawaan), `--tema-aksen`, `--tema-radius`, `--tema-font`, dan `--tema-latar/panel/nav/teks`. Teks di atas warna utama otomatis gelap/terang sesuai kecerahan. Detail: `DESIGN.md`.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini, skill di `.claude/skills/ubah-portofolio-pribadi` terbaca otomatis. Minta saja, mis. "tambah bagian testimoni".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.
Font Fraunces & Inter Tight (Google Fonts): SIL Open Font License.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
