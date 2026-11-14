<!-- kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). -->
# Manajemen Gym

Aplikasi untuk mengelola gym kecil-menengah: data member, paket, pembayaran, check-in, dan pengingat perpanjangan lewat WhatsApp. Jalan di browser laptop atau HP, bisa di-install (PWA), dan tetap jalan tanpa internet. Data tersimpan di perangkat itu sendiri.

Request dari penonton: @mastewe21.

## Fitur
- **Member**: nama, nomor WA, foto (opsional, otomatis dikecilkan), tanggal gabung, catatan. Kode member otomatis (`GYM-0001`).
- **Paket**: harian, bulanan, 3 bulan, tahunan, dan personal trainer (jumlah sesi). Durasi & harga bisa diubah.
- **Pembayaran & perpanjangan**: kalau member masih aktif, paket baru otomatis disambung setelah tanggal berakhir.
- **Check-in cepat**: ketik nama/kode lalu Enter. Scanner QR/barcode USB juga bisa (scanner "mengetik" kode lalu Enter).
- **Kartu member ber-QR** (qrcodejs dari cdnjs), bisa dicetak.
- **Jatuh tempo**: daftar yang habis ≤7 hari dan yang sudah lewat, tombol **WA** membuka pesan pengingat siap kirim (wa.me).
- **Laporan**: member aktif, check-in 14 hari, jam ramai, pendapatan 6 bulan, pembayaran terbaru.
- **Multi-admin PIN**: Pemilik (akses penuh) dan Staf (tanpa menu Atur).
- **Backup/pulihkan JSON**, **ekspor CSV** member, pembayaran, check-in.
- Mode demo: buka `index.html?demo` (data contoh fiktif, tidak disimpan).

## Cara menjalankan
1. Ekstrak ZIP. Untuk coba cepat, klik dua kali `index.html` (QR butuh internet sekali untuk memuat pustaka).
2. Supaya bisa di-install & offline, unggah folder ke hosting HTTPS gratis (GitHub Pages atau Netlify Drop).
3. Buka alamatnya di HP/laptop, lalu pilih **Install** / **Tambah ke layar utama**.
4. Masuk sebagai **Pemilik** dengan PIN **1234**, lalu ganti PIN di **Atur › Admin & PIN**.
5. Isi nama gym, WA, harga paket, dan templat pesan di menu **Atur**.
6. Tambah member di **Member baru**, catat pembayaran pertamanya, dan mulai check-in.

## Struktur folder
```
index.html            kerangka halaman
style.css             tampilan (warna turunan tema)
app.js                semua logika
tema.css / tema.js    warna, font, nama gym, mode terang/gelap
sw.js                 cache offline
manifest.webmanifest  data PWA
ikon.svg              ikon aplikasi
AGENTS.md, DESIGN.md, .claude/skills/ubah-manajemen-gym/SKILL.md   panduan untuk AI
```

## Ubah brand/warna
- Nama gym & mode: `tema.js` (`nama`, `mode: "terang" | "gelap" | "auto"`).
- Warna, sudut, font: `tema.css` (`--tema-utama`, `--tema-aksen`, `--tema-radius`, `--tema-font`). Teks di atas warna utama otomatis gelap/putih sesuai terangnya.
- Atau pakai customizer di malikisaputra.biz.id/kode.

## Ubah pakai Claude
- **Claude Code / Claude Desktop**: buka folder paket ini; skill `.claude/skills/ubah-manajemen-gym` terbaca otomatis.
- **claude.ai**: unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (kredit wajib, dilarang dijual) (lihat `LICENSE`). Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra.

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
