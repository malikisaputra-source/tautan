# Perpustakaan Digital Rumah Sakit (offline)

Aplikasi perpustakaan kecil untuk staf rumah sakit: katalog buku & jurnal, anggota (staf), pinjam-kembali dengan jatuh tempo, denda opsional, label barcode, laporan, dan halaman katalog publik. Jalan di browser laptop/HP, bisa di-install (PWA), tetap jalan tanpa internet. Request dari penonton @krniawaiz.

## Fitur
- **Katalog**: judul, penulis, penerbit, tahun, ISBN/ISSN, kategori (Keperawatan, Kedokteran, Farmasi, Manajemen RS, …), jenis Buku/Jurnal, rak/lokasi, jumlah eksemplar, tautan e-book/PDF opsional.
- **Pencarian & filter**: cari judul/penulis/ISBN/rak/kode, filter kategori, jenis, tersedia/habis/ada PDF, chip kategori cepat.
- **Impor CSV** (koma atau titik koma; contoh di `contoh-katalog.csv`) dan **ekspor CSV**. ISBN yang sama diperbarui, bukan diduplikasi.
- **Anggota staf**: nama, unit/instalasi, NIP, no. HP.
- **Pinjam & kembali**: jatuh tempo otomatis (lama pinjam bisa diatur), batas jumlah pinjaman per anggota, perpanjang, riwayat lengkap + ekspor CSV.
- **Keterlambatan & denda**: denda per hari bisa diatur atau **dimatikan**; status lunas/belum lunas.
- **Label buku** dengan barcode Code 39 (SVG buatan sendiri), cetak per koleksi atau semua.
- **Laporan**: koleksi terpopuler, pinjaman aktif, terlambat, peminjaman per kategori, total denda; bisa dicetak.
- **Katalog publik** `katalog.html`: read-only untuk staf, membaca `katalog.json` (tanpa data anggota).
- PWA offline, PIN admin, backup & pulihkan JSON, mode terang/gelap.

## Cara menjalankan (pemula)
1. Ekstrak ZIP. Untuk mencoba, klik dua kali `index.html` (atau buka `index.html?demo` untuk data contoh tanpa menyimpan).
2. Masuk dengan PIN **1234**, lalu segera ganti di menu **Atur**.
3. Hapus data contoh lewat **Atur → Kosongkan semua data**, lalu isi koleksi (manual atau **Katalog → Impor CSV**).
4. Supaya bisa di-install & offline, unggah folder ke hosting HTTPS gratis (GitHub Pages / Netlify), buka di HP/laptop, lalu **Install / Tambah ke layar utama**.
5. Katalog publik: di **Atur**, klik **Unduh katalog.json**, unggah berkas itu ke folder hosting (menimpa yang lama). Bagikan tautan `…/katalog.html` ke staf. Ulangi tiap ada perubahan koleksi.

## Format CSV katalog
```
judul,penulis,penerbit,tahun,isbn,kategori,jenis,rak,eksemplar,tautan
Asuhan Keperawatan Pasien Rawat Inap,Ns. Rina Kartikasari,Penerbit Embun Medika,2022,999-602-0001-01-1,Keperawatan,Buku,A1-01,4,
```
Semua data contoh (judul, penulis, penerbit, ISBN berawalan 999) **fiktif**.

## Struktur folder
```
index.html            aplikasi admin (PIN)
katalog.html/.js      katalog publik read-only
katalog.json          data katalog publik (hasil ekspor)
app.js                logika aplikasi
data-contoh.js        data contoh fiktif
contoh-katalog.csv    contoh impor
style.css             tampilan
tema.css / tema.js    warna, font, nama (customizer)
sw.js, manifest.webmanifest, ikon.svg, img/logo.svg   PWA
AGENTS.md, DESIGN.md, .claude/skills/…               panduan AI
```

## Ubah brand/warna
Edit `tema.css` (`--tema-utama`, `--tema-aksen`, `--tema-radius`, `--tema-font`, warna bagian) dan nama di `tema.js`. Warna lain otomatis menyesuaikan. Pilih warna utama yang cukup gelap agar teks putih di tombol tetap terbaca.

## Keterbatasan (jujur)
- Data tersimpan di **browser satu perangkat** (localStorage). Laptop meja perpustakaan dan HP petugas **tidak otomatis sinkron**. Backup JSON rutin.
- Belum multi-user/multi-perangkat. Pengembangan lanjut: sinkron ke **Google Sheets** lewat Google Apps Script (butuh penanganan konflik & login).
- PIN admin hanya kunci sederhana di perangkat, bukan keamanan server. Jangan simpan data pasien di aplikasi ini.
- Katalog publik tidak real-time: ketersediaan sesuai `katalog.json` terakhir yang diunggah.
- Barcode memakai Code 39 (bisa dibaca kebanyakan scanner USB). Belum ada QR dan belum ada pemindaian kamera.

## Ubah pakai Claude
(a) **Claude Code / Claude Desktop**: buka folder paket ini; skill di `.claude/skills/ubah-perpustakaan-digital` terbaca otomatis.
(b) **claude.ai**: unggah ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode) lewat Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

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

## Lisensi
Lisensi Nonkomersial Maliki Studio (kredit wajib, dilarang dijual) (lihat `LICENSE`). Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra.
