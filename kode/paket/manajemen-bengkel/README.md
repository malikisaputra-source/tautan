# Manajemen Bengkel (Motor & Mobil)

Sistem manajemen bengkel tanpa server: antrean servis model kanban, work order, stok sparepart, nota siap cetak, riwayat kendaraan per plat, pengingat servis via WhatsApp, dan laporan. Cukup HTML/CSS/JavaScript murni — data tersimpan di browser (localStorage).

## Fitur
- **Dashboard hari ini**: antrean aktif, pendapatan, servis selesai, stok menipis, grafik 7 hari, pengingat servis jatuh tempo.
- **Antrean servis kanban**: Menunggu → Dikerjakan → Selesai → Diambil. Seret-lepas atau tombol panah (ramah keyboard & HP).
- **Layar antrean TV**: mode layar penuh untuk ruang tunggu, otomatis ikut berubah saat antrean digeser di tab lain.
- **Work order**: pelanggan, kendaraan (plat/merk/km), keluhan, jasa + sparepart, mekanik, estimasi, diskon, metode bayar. Plat yang sudah terdaftar terisi otomatis.
- **Sparepart & stok**: harga beli/jual, margin, stok minimum + peringatan, mutasi stok otomatis saat WO disimpan/diubah/dihapus, stok masuk.
- **Nota**: A5 atau thermal 58mm, siap cetak, plus kirim rincian lewat WhatsApp (wa.me).
- **Riwayat kendaraan** per plat nomor + pengingat servis berikutnya via WhatsApp.
- **Data pelanggan & mekanik**, **laporan** (jasa vs sparepart, laba kotor, mekanik terproduktif, sparepart terlaris).
- **Ekspor CSV** (WO, sparepart, pelanggan, mekanik) & **backup/pulihkan JSON**.
- **PIN lokal**: Admin `1234` (semua menu), Kasir `1111` (tanpa laporan & pengaturan). Ganti di Pengaturan.
- Mode terang/gelap, responsif HP, animasi halus (otomatis mati bila "kurangi gerakan" aktif), aksesibel.

## Cara menjalankan
1. Unduh/ekstrak folder ini.
2. Klik dua kali `index.html` — langsung jalan di Chrome/Edge/Firefox, tanpa instal apa pun.
3. Masukkan PIN `1234`. Data contoh sudah terisi supaya bisa langsung dicoba.
4. Mau demo cepat tanpa PIN? Buka `index.html?demo` (data contoh di-reset & masuk sebagai admin).
5. Layar TV ruang tunggu: buka `index.html?tv` di komputer yang tersambung ke TV (di browser yang sama dengan kasir agar datanya sama).
6. Mau online? Unggah folder ke GitHub Pages / Netlify / hosting biasa.

> Data hanya ada di browser & perangkat itu. Rutin **Unduh backup JSON** di menu Pengaturan.

## Struktur folder
```
manajemen-bengkel/
├─ index.html      kerangka halaman + ikon SVG
├─ tema.js         nama bengkel & mode bawaan
├─ tema.css        warna, radius, font (diubah customizer)
├─ style.css       tampilan, animasi, responsif, cetak
├─ app.js          seluruh logika & data contoh
├─ ikon.svg        favicon
├─ DESIGN.md       aturan desain (token, komponen, motion)
├─ AGENTS.md       ringkasan untuk AI coding agent
├─ .claude/skills/ubah-manajemen-bengkel/SKILL.md
├─ meta.json, ss.png, LICENSE, README.md
```

## Ubah brand & warna
- Nama bengkel & mode: edit `tema.js` → `nama: "Bengkel Kamu"`, `mode: "terang" | "gelap" | "auto"`.
- Warna, sudut, font: edit `tema.css` (`--tema-utama`, `--tema-aksen`, `--tema-radius`, `--tema-font`) dan warna bagian (`--tema-latar`, `--tema-panel`, `--tema-nav`, `--tema-teks`). Semua warna lain menyesuaikan otomatis.
- Teks di atas tombol & sidebar dihitung otomatis (putih/gelap) supaya tetap terbaca. Untuk warna utama, pilih yang gelap-sedang agar kontras tombol maksimal.
- Alamat, WA bengkel, catatan nota, interval servis: menu **Pengaturan**.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop** — buka folder paket ini; skill di `.claude/skills/ubah-manajemen-bengkel` terbaca otomatis. Minta saja, misalnya "tambah kolom nomor rangka di kendaraan".

**(b) claude.ai** — unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai buka **Customize › Skills › tombol "+" › Create skill › Upload a skill**, pilih ZIP-nya (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di **Settings › Capabilities** (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

Agen lain (Cursor, Copilot, Codex) membaca `AGENTS.md`.

## Mau hasil lebih maksimal?
Pasang skill desain berikut di Claude Code sebelum mengubah tampilan:
- **impeccable** — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- **ui-ux-pro-max** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT — © 2026 Maliki Saputra. Lihat `LICENSE`.

---
Dibuat oleh **Maliki Studio** — malikisaputra.biz.id, follow TikTok/IG **@malikisaputra**

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
- Jangan hapus kredit "Template oleh @malikisaputra". Itu syarat lisensinya.

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
