# Iuran & Kas RT (ringkas, untuk bendahara)

Satu layar untuk bendahara RT: pilih bulan, ketuk nama warga yang sudah bayar, saldo kas langsung terhitung. Pesan WhatsApp pengingat dan rekap grup tersusun sendiri, laporan bulanan tinggal salin.

Beda dengan paket **Website RT/RW** (lengkap: data jiwa, surat, pengumuman, PIN): paket ini sengaja ringkas dan cepat, khusus urusan iuran dan kas. Murni HTML, CSS, dan JavaScript, tanpa server dan tanpa login. Data tersimpan di browser perangkat yang dipakai.

## Fitur
- **Tab bulan** Jan–Des + pindah tahun. Titik hijau = semua lunas, jingga = masih ada yang belum.
- **Daftar KK per blok**: ketuk nama untuk lunas (otomatis masuk kas), ketuk lagi untuk batal, tombol **Urungkan** di notifikasi. Cari nama/rumah, saring Semua/Belum/Lunas.
- **Saldo kas besar**, perubahan bersih bulan itu, cincin progres KK lunas, total terkumpul / masih kurang / keluar.
- **Pengingat WA per warga**: pesan sopan bisa diedit, tombol *Buka di WhatsApp* (wa.me) dan *Salin pesan*.
- **Rekap grup**: daftar yang belum bayar, siap salin atau kirim ke WA.
- **Kas**: catat pemasukan & pengeluaran, hapus dengan urungkan.
- **Laporan bulanan**: saldo awal, rincian masuk/keluar, saldo akhir. Salin, bagikan, atau cetak.
- **Ekspor CSV** (Excel/Google Sheets), **Backup JSON**, **Pulihkan**.
- Mode terang/gelap, animasi halus (mati otomatis bila perangkat minta gerak dikurangi), rapi di HP.

## Cara menjalankan (pemula)
1. Unduh folder ini, klik ganda `index.html`. Data contoh langsung tampil.
2. Klik ikon pengaturan (kanan atas): isi besaran iuran, tanggal batas, nama bendahara, dan cara bayar.
3. Di pengaturan klik **Kosongkan semua**, lalu tambah warga lewat tombol **+ Warga**.
4. Tiap ada yang bayar, ketuk namanya. Akhir bulan buka tab **Laporan** lalu **Salin laporan** ke grup.
5. Supaya bisa dibuka di HP kapan saja, unggah folder ke hosting statis gratis (GitHub Pages: Settings → Pages → Deploy from branch → main / root), lalu buka alamatnya di HP dan pilih **Tambahkan ke layar utama**.
6. Rutin klik **Backup JSON**. Data hanya ada di perangkat itu.

## Struktur folder
```
iuran-kas-rt/
├── index.html   kerangka satu layar
├── tema.css     token warna/huruf/sudut (diubah customizer)
├── tema.js      nama RT & mode bawaan
├── style.css    tampilan, animasi, gaya cetak
├── data.js      data contoh (fiktif)
├── app.js       semua logika
├── ikon.svg     ikon tab
├── DESIGN.md    aturan desain
├── AGENTS.md    ringkasan untuk agen AI
└── .claude/skills/ubah-iuran-kas-rt/SKILL.md
```

## Ubah nama, brand & warna
- Nama RT: `tema.js` → `nama: "Kas RT 05 / RW 02"`. Mode: `"terang"`, `"gelap"`, atau `"auto"`.
- Warna, sudut, huruf: `tema.css`. Semua warna lain diturunkan otomatis. Teks di atas tombol & header otomatis putih/hitam sesuai terang-gelap warnanya, tapi pilih warna utama yang cukup gelap agar tetap nyaman dibaca.
- Atau pakai customizer di malikisaputra.biz.id/kode.

## Ubah pakai Claude
- **Claude Code / Claude Desktop**: buka folder paket ini, skill di `.claude/skills/ubah-iuran-kas-rt` terbaca otomatis. Minta saja, misalnya "tambah kolom NIK di data warga".
- **claude.ai**: unduh ZIP skill (tombol **Unduh Skill** di malikisaputra.biz.id/kode), lalu di claude.ai buka Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP-nya (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain berikut di Claude Code sebelum minta perubahan tampilan:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto
- **Logo RT** tampil di header dan di laporan cetak. Cukup timpa `img/logo-rt.svg` (persegi 1:1, mis. 200x200), atau ubah path di objek `KONFIG` paling atas `app.js` (boleh `.png`/`.jpg`). Bila gagal dimuat, otomatis diganti inisial nama RT.
- **Foto bukti bayar (opsional):** setelah warga ditandai lunas, ketuk ikon kamera di barisnya untuk mengunggah foto struk/transfer. Foto diperkecil ke maks. 400 px (`KONFIG.maksFoto`) dan disimpan di browser (ikut Backup JSON). Ketuk lagi untuk lihat, ganti, atau hapus. `img/contoh-bukti.svg` hanya contoh rasio 3:4.

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
