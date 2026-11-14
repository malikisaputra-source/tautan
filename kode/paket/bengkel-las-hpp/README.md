# Bengkel Las + Hitung HPP

Aplikasi web untuk bengkel las (pagar, kanopi, teralis, tangga, rak): catat order, hitung kebutuhan bahan dari ukuran, HPP otomatis, harga jual & DP, RAB siap cetak, dan laporan laba. Tanpa server, tanpa instal — cukup buka di browser. Dibuat atas request TikTok **@fahwiproject**.

## Fitur
- **Order/pekerjaan**: pelanggan, ukuran, status Survei → Produksi → Pasang → Lunas (papan kanban), catat DP & pelunasan.
- **Master bahan**: besi hollow, siku, plat, pipa, atap, cat, thinner, kawat las, baut — harga per batang/kg/meter/m²/pcs.
- **Kalkulator bahan**: pagar, teralis, kanopi, tangga, rak. Dari ukuran → jumlah batang dengan **rencana potong & sisa** (algoritma first-fit decreasing + tebal gerinda), cat, kawat las, baut.
- **Ongkos kerja** (tukang × hari × upah) dan **overhead** (listrik, gas, transport, sewa alat).
- **HPP otomatis** per order & per m², markup → harga jual (dibulatkan Rp1.000) & DP.
- **Penawaran/RAB A4** siap cetak/PDF + ringkasan via WhatsApp.
- **Laporan laba per bulan** + grafik omzet = HPP + laba.
- **Ekspor CSV** (order & bahan), cadangan/pulihkan JSON, mode gelap, responsif HP.
- Data contoh Indonesia; `index.html?demo` untuk mencoba tanpa menyimpan.

## Cara menjalankan (pemula)
1. Unduh & ekstrak ZIP.
2. Klik dua kali `index.html` (Chrome/Edge/Firefox). Selesai — tidak perlu internet kecuali untuk font.
3. Ganti harga di **Master bahan**, atur upah & markup di **Pengaturan**.
4. Hitung di **Kalkulator** → **Jadikan order** → cetak **RAB**.
5. Panduan lengkap + contoh hitung HPP: **`PANDUAN.md`**.

Online: unggah folder ke GitHub Pages/Netlify (gratis). Data tetap tersimpan per browser (localStorage).

## Struktur folder
```
index.html   kerangka halaman, ikon SVG
style.css    tampilan (token turunan, komponen, print, responsif)
app.js       data, rumus HPP, kalkulator, halaman, RAB, CSV
tema.css     warna/radius/font (diubah customizer)
tema.js      nama usaha & mode terang/gelap
PANDUAN.md   panduan pemula langkah demi langkah
DESIGN.md    aturan desain · AGENTS.md ringkasan untuk AI
.claude/skills/ubah-bengkel-las-hpp/SKILL.md   skill Claude
```

## Ubah brand/warna
- Nama bengkel: `tema.js` → `nama`. Mode: `"terang"`, `"gelap"`, atau `"auto"`.
- Warna: `tema.css` → `--tema-utama` (tombol), `--tema-aksen` (oranye las), `--tema-radius`, `--tema-font` (Plus Jakarta Sans, Inter, Poppins, DM Sans, Space Grotesk, Nunito), plus `--tema-latar/panel/nav/teks`. Warna lain otomatis turunan; teks di atas tombol/nav otomatis putih/gelap. Untuk tombol, pilih warna utama gelap-sedang agar teks putih terbaca.
- Atau pakai customizer di malikisaputra.biz.id/kode.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop** — buka folder paket ini; skill di `.claude/skills/ubah-bengkel-las-hpp` terbaca otomatis. Contoh: "tambah PPN 11% di RAB", "tambah jenis pintu besi di kalkulator".

**(b) claude.ai** — unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai buka **Customize › Skills › tombol "+" › Create skill › Upload a skill**, pilih ZIP-nya (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di **Settings › Capabilities** (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

Agen lain (Cursor, Copilot, Codex) membaca `AGENTS.md`.

## Mau hasil lebih maksimal?
Pasang skill desain berikut di Claude Code sebelum mengubah tampilan:
- **impeccable** — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- **ui-ux-pro-max** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

---
Dibuat oleh **Maliki Studio** — malikisaputra.biz.id, follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
