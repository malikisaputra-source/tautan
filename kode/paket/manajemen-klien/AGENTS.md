# AGENTS.md — Manajemen Klien

CRM statis (HTML/CSS/JS murni, data di localStorage `crm_data`). Panduan lengkap: `.claude/skills/ubah-manajemen-klien/SKILL.md`; sistem desain: `DESIGN.md` (WAJIB dijaga: token tema, aksesibilitas AA, fokus, reduced-motion, responsif 500px).

- `tema.css`/`tema.js`: token & nama usaha (warna lain diturunkan di `style.css`).
- `app.js`: `dataContoh()` skema → `migrasi()` → `HALAMAN.x` render + `PASANG.x` event → form `formKlien/formDeal/formProyek/formDok/formPengingat` → CSV/JSON → palet ⌘K → tema postMessage → PIN.
- Field baru: data contoh + migrasi + form + render + CSV. Jangan hapus data pengguna. Tanpa build tool.
