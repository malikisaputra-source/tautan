# Catatan Ojol

Aplikasi web kecil untuk driver ojol: catat order (Gojek, Grab, Maxim), tip, jarak, dan pengeluaran, lalu lihat **untung bersih** per hari, per minggu, dan **per kilometer**. Tanpa server, tanpa login. Data tersimpan di HP sendiri.

## Fitur
- Tombol besar **Order selesai** (tarif, km, tip, jam) dan **Pengeluaran** (bensin, parkir, makan, servis, cicilan HP, lainnya)
- Order cepat sekali tap (12rb/18rb/25rb/35rb, bisa diubah)
- Potongan aplikasi per platform (bawaan Gojek 20%, Grab 20%, Maxim 15%). Contoh: order Rp20.000 potongan 20% = bersih Rp16.000
- Kartu bersih hari ini + cincin progres target harian
- Untung bersih per km (7 hari) dan kotor per km tiap aplikasi
- Grafik mingguan dengan garis target + rincian (tarif, potongan, tip, tiap pengeluaran)
- Jam paling cuan (rata-rata 4 minggu) + peta panas hari × jam
- Riwayat per hari, hapus dengan tombol urungkan
- Ekspor CSV (buka di Excel/Sheets), backup & pulihkan JSON
- Mode gelap pekat (bawaan) dan terang

## Cara menjalankan (pemula)
1. Unduh ZIP paket ini lalu ekstrak.
2. Klik dua kali `index.html`, langsung terbuka di browser.
3. Mau dipakai di HP? Unggah folder ke GitHub Pages / Netlify Drop, buka link-nya di Chrome HP, lalu menu ⋮ › **Tambahkan ke layar utama**.
4. Awalnya berisi data contoh 3 minggu. Tekan **Mulai dari nol** di banner atas untuk mulai catatan sendiri.
5. Buka menu **Atur** untuk mengisi target harian dan potongan tiap aplikasi.

## Struktur folder
```
catatan-ojol/
├─ index.html      kerangka halaman + ikon SVG
├─ style.css       tampilan (turunan dari tema.css)
├─ app.js          logika, data, grafik
├─ tema.css        warna, sudut, font (diubah customizer)
├─ tema.js         nama aplikasi & mode terang/gelap
├─ ikon.svg        ikon tab
├─ DESIGN.md       token & aturan desain
├─ AGENTS.md       ringkasan untuk Cursor/Copilot/Codex
└─ .claude/skills/ubah-catatan-ojol/SKILL.md
```

## Ubah brand/warna
- Warna utama, aksen, sudut, font: `tema.css`. Pilih warna utama yang cukup gelap agar teks putih di tombol tetap terbaca (teks tombol otomatis berubah gelap bila warnanya terlalu terang).
- Nama aplikasi & mode: `tema.js` (`nama`, `mode: "gelap" | "terang" | "auto"`).
- Atau pakai customizer di malikisaputra.biz.id/kode.

## Ubah pakai Claude
**a. Claude Code / Claude Desktop:** buka folder paket ini. Skill di `.claude/skills/ubah-catatan-ojol` terbaca otomatis. Minta saja, mis. "tambah kategori pengeluaran cuci motor".

**b. claude.ai:** unggah ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode) lewat Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code sebelum minta perubahan tampilan:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

---
Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto
- **Logo** (menu samping desktop): timpa `img/logo.svg` (persegi 1:1, mis. 256×256). Mau PNG/JPG? Ubah path di `KONFIG` paling atas `app.js`. Bila gagal dimuat, tampil inisial nama usaha.
- **Avatar bawaan** (pojok kanan atas halaman Hari ini): timpa `img/avatar.svg` atau ubah `KONFIG.avatar`.
- **Foto profil sendiri**: menu **Atur › Foto profil › Unggah foto**. Foto dikecilkan otomatis (≤400 px) dan disimpan di HP (localStorage); tombol **Hapus** kembali ke avatar bawaan.

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
