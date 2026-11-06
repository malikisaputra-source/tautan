# AGENTS.md — Manajemen Bengkel

Aplikasi statis (HTML/CSS/JS murni, tanpa build tool, data di localStorage `bengkel-data-v1`). Panduan lengkap: `.claude/skills/ubah-manajemen-bengkel/SKILL.md`. Aturan visual: `DESIGN.md` — WAJIB dijaga.

- `tema.js` / `tema.css`: nama usaha, mode, token warna/radius/font + warna bagian. Semua warna lain diturunkan di `style.css`.
- `index.html`: kerangka (PIN, sidebar, header, modal, layar TV, ikon SVG `<symbol>`).
- `app.js`: data contoh `contoh()`, `migrasi()`, `MENU`, objek `RENDER.<halaman>`, form (`formWo`, `formPart`, `formOrang`), nota, CSV, backup, kontrak tema (`terapkan`, pesan `tema`/`sorot`/`mode-pilih`).

Aturan: jangan hapus/rusak data pengguna — tambah field lewat `migrasi()` dengan nilai bawaan; jangan pakai framework/build tool; jaga token, kontras AA, label & fokus, `data-bagian`, reduced-motion; uji di HP (≤500px) dan desktop, kedua mode, konsol tanpa error.
