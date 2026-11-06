# AGENTS.md — Katalog Toko + Checkout WhatsApp
Panduan lengkap: `.claude/skills/ubah-katalog-toko-wa/SKILL.md` (baca dulu sebelum mengubah apa pun).

- Statis: `index.html`, `style.css`, `produk.js` (pengaturan toko & produk), `app.js` (logika murni + UI), tanpa build tool.
- Tema: `tema.css` (`--tema-utama`, `--tema-aksen`, `--tema-radius`, `--tema-font`) & `tema.js` (`TEMA.nama` = nama toko, `TEMA.mode`). Warna lain diturunkan via `color-mix`; mode gelap `[data-mode=gelap]`; tombol bulan menyimpan pilihan di localStorage `katalog-tema`.
- Keranjang: localStorage `katalog-keranjang`; field baru harus punya nilai bawaan agar data lama tetap terbaca.
- Pesan WA: `buatPesan` di app.js. Google Sheet: `produkDariCSV`.
- Uji: `node -e "require('./app.js')"` untuk logika murni; browser HP & desktop, terang & gelap, konsol bersih; jaga label, kontras, fokus, `prefers-reduced-motion`.
