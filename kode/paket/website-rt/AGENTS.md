# AGENTS.md — Website RT/RW

Ringkasan untuk Cursor, Copilot, Codex, dan agen lain. Panduan lengkap: `.claude/skills/ubah-website-rt/SKILL.md`. Aturan visual: `DESIGN.md`.

- Statis murni HTML/CSS/JS, **tanpa build tool/npm/framework**. Data di `localStorage` (`website-rt-data`; mode `?demo` memakai `website-rt-demo`).
- Berkas: `index.html` (kerangka), `tema.css`/`tema.js` (token customizer, jangan diisi hal lain), `style.css` (turunan warna + komponen + animasi + cetak A4), `data.js` (skema & data contoh), `app.js` (router `#/panel/<menu>`, `HAL.<id>` render + `HAL.<id>Pasca` event, `migrasi()`, CSV/JSON).
- Warna baru diturunkan dari token via `color-mix`; jaga kontras AA kedua mode, label & fokus, `prefers-reduced-motion`, layout HP (nav bawah) & desktop (sidebar).
- Field baru: `data.js` → `migrasi()` → form → render → CSV. Jangan pernah menghapus data pengguna; aksi hapus lewat `konfirmasi()`. Escape teks dengan `e()`.
- Uji: buka `index.html` (atau `index.html?demo`) di 1280px & ≤500px, terang & gelap, konsol bersih.
