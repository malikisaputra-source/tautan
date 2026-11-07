# Manajemen Klien — CRM Freelancer & Agensi

CRM ringan tanpa server untuk freelancer dan agensi kreatif. Cukup buka `index.html`: klien, pipeline prospek, proyek, invoice & penawaran, pengingat follow-up, dan laporan pendapatan — semua tersimpan di browser (localStorage).

## Fitur
- **Dashboard**: pendapatan bulan ini, invoice belum dibayar (dan yang telat), proyek aktif, follow-up hari ini.
- **Klien**: profil, kontak, sumber, tag, catatan, riwayat interaksi (timeline), tombol WA & email.
- **Pipeline** kanban Lead → Penawaran → Negosiasi → Deal/Batal: seret-lepas, tombol panah, atau panah keyboard.
- **Proyek**: status, tenggat, progres %, checklist tugas.
- **Invoice & penawaran**: nomor otomatis, item, PPN, diskon, DP, status Draft/Terkirim/Lunas/Telat, cetak A4/PDF, kirim WhatsApp atau email.
- **Follow-up**: kalender + daftar, pesan wa.me siap kirim.
- **Laporan**: grafik pendapatan per bulan, per klien, sumber klien.
- **Pencarian global** Ctrl/⌘ + K, ekspor CSV, backup & pulihkan JSON, PIN lokal (bawaan `1234`).
- Mode terang/gelap, responsif HP, animasi halus (mati otomatis bila "kurangi gerakan" aktif).

## Cara menjalankan
1. Unduh/ekstrak folder ini.
2. Klik dua kali `index.html` (Chrome/Edge/Firefox). Tidak perlu internet kecuali untuk font.
3. Masukkan PIN `1234`. Data contoh agensi fiktif langsung tampil.
4. Buka **Pengaturan** → ganti PIN, alamat, rekening, lalu "Kosongkan semua data" kalau mau mulai dari nol.
5. Mau online? Unggah folder ke GitHub Pages / Netlify. Tambahkan `?demo` di URL untuk mode demo (data contoh, tanpa PIN).

> Data hanya ada di browser yang dipakai. Rajin **Backup JSON** di Pengaturan.

## Struktur folder
```
index.html   kerangka aplikasi + ikon SVG
tema.css     warna, radius, font (token tema)
tema.js      nama usaha & mode bawaan
style.css    seluruh tampilan + animasi + cetak A4
app.js       logika, data contoh, penyimpanan
ikon.svg     favicon
DESIGN.md    sistem desain (token, komponen, motion)
AGENTS.md    ringkasan untuk AI coding agent
.claude/skills/ubah-manajemen-klien/SKILL.md   skill Claude
```

## Ubah brand/warna
- Nama usaha: `tema.js` → `nama`. Mode: `"terang"`, `"gelap"`, atau `"auto"`.
- Warna, sudut, font: `tema.css` (`--tema-utama`, `--tema-aksen`, `--tema-radius`, `--tema-font`, plus warna bagian `--tema-latar/panel/nav/teks`). Warna lain otomatis diturunkan.
- Teks di atas warna utama berwarna putih secara bawaan; bila kamu memilih warna utama yang sangat terang (kuning/hijau muda), lewat customizer teksnya otomatis berubah gelap. Kalau mengedit manual, pilih warna utama yang cukup gelap (kontras ≥ 4,5:1 dengan putih) atau set `--tema-utama-teks: #0f172a` di `tema.css`.

## Ubah pakai Claude
- **Claude Code / Claude Desktop**: buka folder paket ini; skill di `.claude/skills/ubah-manajemen-klien` terbaca otomatis. Minta saja, mis. "tambah kolom NPWP di data klien".
- **claude.ai**: unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai buka Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).
- Cursor/Copilot/Codex: baca `AGENTS.md`.

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code sebelum mengubah tampilan:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT — lihat `LICENSE`.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
