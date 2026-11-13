# Landing Kelas Virtual (jualan lewat Lynk)

Landing page 1 halaman yang elegan untuk menjual kelas online. Semua tombol beli menuju satu link produk Lynk-mu; tidak ada pembayaran di halaman. Isi contoh: "Kelas Canva untuk Jualan Online" (fiktif).

## Fitur
- Hero: judul kelas, subjudul, harga coret + harga promo, badge hemat otomatis, tombol beli
- Countdown promo opsional (tanggal pasti atau otomatis 3 hari per pengunjung)
- Untuk siapa (cocok / belum cocok), kurikulum per modul (akordion), bonus + total nilai
- Profil mentor, testimoni (ditandai contoh), jaminan, FAQ, penutup + tombol WhatsApp
- Tombol beli melayang di HP
- Semua teks, harga, link Lynk, WA, warna di satu berkas `konten.js`
- Meta OG, favicon, animasi masuk halus (mati di reduced-motion), mode gelap, ilustrasi SVG buatan sendiri

## Cara menjalankan
1. Ekstrak ZIP, buka `index.html` di browser.
2. Buka `konten.js` dengan Notepad/VS Code, ganti `linkBeli` dengan link produk Lynk-mu, `waNomor` dengan nomor WA (62xxx).
3. Ganti teks, harga, modul, bonus, mentor, FAQ. Ganti testimoni contoh dengan testimoni asli.
4. Ubah `<title>` dan meta `og:` di `index.html`, serta gambar `img/og.png`.
5. Unggah folder ke GitHub Pages / Netlify, lalu taruh link-nya di bio.

## Struktur folder
```
index.html   kerangka halaman + meta OG
konten.js    SEMUA isi (teks, harga, link, warna)
style.css    gaya
app.js       render, akordion, countdown, animasi
tema.css     token warna/font/radius
tema.js      nama & mode (terang/gelap/auto)
ikon.svg     favicon
img/og.png   gambar bagikan (sumber: img/og.svg)
```

## Ubah brand/warna
Ganti `--tema-utama` dan `--tema-aksen` di `tema.css` (atau `warna` di `konten.js`). Pakai warna utama yang cukup gelap agar teks putih di tombol terbaca, dan aksen yang terang-sedang (teks di atasnya gelap). Mode gelap: `mode: "gelap"` di `tema.js`.

## Ubah pakai Claude
- **Claude Code / Claude Desktop**: buka folder ini; skill di `.claude/skills/ubah-landing-kelas-virtual` terbaca otomatis.
- **claude.ai**: unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu Customize › Skills › "+" › Create skill › Upload a skill. Syarat: "Code execution and file creation" aktif di Settings › Capabilities. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT)

## Lisensi
MIT + syarat atribusi & tidak untuk diperjualbelikan (lihat LICENSE).

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

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
