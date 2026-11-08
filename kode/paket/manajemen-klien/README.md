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
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

<!-- panduan-ai-maliki -->
## Ubah sendiri sesuai kebutuhanmu pakai AI

Kamu tidak perlu jago coding. Template ini sudah disiapkan supaya mudah diubah AI: ada **AGENTS.md** (aturan proyek untuk AI), **DESIGN.md** (gaya desain), dan skill Claude di folder `.claude/skills/`. Pilih salah satu cara di bawah.

### Cara 1: ChatGPT, Claude, atau Gemini di browser (paling gampang, gratis)
1. Unduh ZIP template ini, lalu ekstrak.
2. Buka chatgpt.com, claude.ai, atau gemini.google.com.
3. Unggah berkas yang mau diubah (biasanya `index.html`, `style.css`, `app.js`, atau berkas data). Unggah juga `AGENTS.md` dan `DESIGN.md` (kalau ada) biar AI paham aturannya. ChatGPT juga bisa menerima ZIP utuh.
4. Tulis permintaanmu (contoh di bawah), lalu minta: "Kirim ulang berkas yang diubah secara utuh."
5. Ganti berkas lama dengan hasil dari AI, lalu buka `index.html` di browser untuk cek.

### Cara 2: Claude Code (paling rapi untuk perubahan besar)
1. Pasang Claude Code (lihat claude.com/claude-code), atau pakai aplikasi Claude Desktop tab Code.
2. Buka folder template ini, lalu jalankan `claude` di terminal folder itu.
3. Tulis permintaanmu. Kalau ada folder `.claude/skills/ubah-…`, Claude Code otomatis memakainya, jadi hasilnya tetap mengikuti desain aslinya.

### Cara 3: Codex (OpenAI)
1. Pasang Codex CLI atau pakai Codex di aplikasi ChatGPT.
2. Buka folder template, jalankan `codex`. Codex otomatis membaca `AGENTS.md`.
3. Tulis permintaanmu, cek perubahannya, lalu setujui.

### Cara 4: Google Antigravity atau Gemini CLI (gratis)
1. Antigravity: buka aplikasinya, pilih **Open Folder** ke folder template ini, lalu tulis permintaan di panel agen.
2. Gemini CLI: jalankan `gemini` di folder template.
3. Di awal, tulis: "Baca AGENTS.md dan DESIGN.md dulu sebelum mengubah apa pun."

### Contoh permintaan yang bisa langsung kamu pakai
- "Ganti nama, logo teks, dan warna utama jadi hijau tua sesuai usahaku: [nama usaha]."
- "Tambahkan kolom [nama kolom] di formulir dan tampilkan di daftar."
- "Ubah semua data contoh jadi data usahaku: [tempel datanya]."
- "Tambahkan halaman/menu baru untuk [kebutuhan], gaya desainnya sama dengan yang sudah ada."
- "Jelaskan dulu cara kerja aplikasi ini dengan bahasa sederhana, baru ubah [bagian]."

### Tips biar hasilnya bagus
- Satu permintaan = satu perubahan. Cek dulu hasilnya, baru minta yang berikutnya.
- Simpan salinan folder asli sebelum mengubah, jadi bisa balik kalau ada yang rusak.
- Kalau ada error, salin pesan errornya (klik kanan > Inspect > Console) lalu tempel ke AI.
- Data aplikasi tersimpan di browser (localStorage). Backup dulu sebelum ganti versi.
- Jangan hapus kredit "Template oleh @malikisaputra", dan template ini **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya (@malikisaputra).

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
