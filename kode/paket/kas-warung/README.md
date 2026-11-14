# Kas Warung

Buku kas harian super cepat untuk warung. Bukan aplikasi kasir lengkap — cukup catat uang masuk & keluar pakai numpad besar, lalu lihat **untung hari ini** langsung. Jalan di browser HP/laptop, tanpa server, tanpa daftar akun.

## Fitur
- Catat penjualan (uang masuk) dan modal/belanja stok (uang keluar) dengan numpad besar + tombol cepat +2rb/+5rb/+10rb/+50rb
- Tombol barang yang sering dicatat (bisa diatur)
- Kartu "Untung hari ini": hijau kalau untung, merah kalau rugi
- Kas awal, kas akhir seharusnya, dan "Tutup kas" untuk cek selisih laci
- Kasbon/utang pelanggan: tambah utang, terima cicilan (otomatis masuk kas)
- Laporan mingguan & bulanan: total, rata-rata, grafik untung-rugi per hari, barang terlaris
- Ekspor CSV, salin ke Google Sheets, backup & pulihkan JSON
- Mode gelap, rapi di HP & laptop, bisa pakai keyboard (angka, Backspace, Enter)

## Cara menjalankan
1. Unduh ZIP, ekstrak.
2. Klik dua kali `index.html` — terbuka di browser. Selesai.
3. Ada data contoh 5 minggu. Untuk mulai bersih: menu **Data › Hapus semua data** (ketik HAPUS).
4. Isi kas awal (klik angka kas awal), lalu catat tiap transaksi.
5. Mau dipakai di HP? Unggah folder ke GitHub Pages/Netlify, buka link-nya di HP, lalu "Tambahkan ke layar utama".
6. Data tersimpan di browser perangkat itu. Rajin **Backup JSON**.

## Struktur folder
```
index.html   kerangka & halaman
style.css    gaya
app.js       logika & data
tema.css     warna, radius, font (token tema)
tema.js      nama usaha & mode terang/gelap
ikon.svg     ikon aplikasi
DESIGN.md    sistem desain
AGENTS.md, .claude/skills/ubah-kas-warung/SKILL.md   panduan untuk AI
```

## Ubah brand/warna
- Nama warung & mode: `tema.js` → `nama`, `mode` ("terang" | "gelap" | "auto").
- Warna/radius/font: `tema.css`. Semua warna lain turunan dari situ. Teks di atas tombol utama otomatis putih/gelap; pilih warna utama yang cukup gelap supaya tombol tetap terbaca.
- Warna untung (hijau) & rugi (merah) sengaja tetap supaya maknanya jelas.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini, skill di `.claude/skills/ubah-kas-warung` terbaca otomatis. Minta saja, mis. "tambah kolom metode bayar".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto
- Logo: timpa `img/logo.svg` (persegi, mis. 200×200) atau ubah `KONFIG.logo` di atas `app.js`. Bisa juga dari menu Data › Ganti logo (tersimpan di HP). Bila gagal dimuat, tampil inisial nama usaha.
- Foto barang: menu Data › Logo & foto barang › pilih barang › Unggah foto (diperkecil ≤400px, disimpan di localStorage). Bawaan per nama barang ada di `KONFIG.fotoBarang`; contoh `img/produk.svg` (persegi 1:1). Barang tanpa foto tetap pakai ikon.

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
