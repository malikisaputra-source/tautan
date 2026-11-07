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
