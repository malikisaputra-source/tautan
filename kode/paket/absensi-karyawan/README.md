# Absensi Karyawan

Web app absensi untuk UMKM dan kantor kecil. Karyawan cukup tap tombol besar untuk check-in/out. Admin bisa lihat siapa yang telat, menyetujui izin, dan menghitung rekap bulanan sampai perkiraan tunjangan. Semuanya jalan di browser tanpa server dan tanpa daftar akun. Bisa dipasang di layar utama HP (PWA).

> Beda dengan paket **Presensi GPS (Google Apps Script)**: paket ini web statis lengkap. Data tersimpan di perangkat, tidak di Google Sheets, dan ada mode kiosk untuk satu tablet yang dipakai bersama.

## Fitur
- Check-in/out dengan tombol bundar besar, jam hidup, dan cincin progres shift
- Lokasi opsional: catat jarak ke kantor, atau tolak absen di luar radius
- Selfie opsional atau wajib, disimpan kecil (±10 KB) di IndexedDB perangkat
- Shift pagi/siang/malam (boleh lewat tengah malam) dengan toleransi telat
- Izin, sakit, dan cuti yang disetujui atau ditolak admin
- Kalender kehadiran berwarna per karyawan, detail jam dan lokasi per tanggal
- Rekap bulanan berisi hadir, telat, izin, alpa, lembur, plus perkiraan tunjangan (uang makan, lembur) dan potongan (telat, alpa)
- Mode kiosk: tablet di pintu, karyawan ketuk nama lalu masukkan PIN pribadi
- PIN admin untuk Rekap, Karyawan, Atur, dan keluar kiosk
- Ekspor CSV, backup dan pulihkan JSON (foto ikut), mode gelap, rapi di HP dan laptop

## Cara menjalankan
1. Unduh ZIP, lalu ekstrak.
2. Klik dua kali `index.html` untuk membukanya di browser. Ada data contoh berisi 9 karyawan. **PIN admin demo: 1234**, dan PIN karyawan contoh adalah angka yang sama 4 kali (Rina 1111, Dimas 2222, dst.).
3. Mulai bersih lewat **Atur › Hapus semua data** (ketik HAPUS). Setelah itu ganti PIN admin.
4. Tambah karyawan dan atur shift di menu **Karyawan**.
5. Lokasi, kamera, dan PWA hanya aktif lewat **https**. Unggah folder ke GitHub Pages atau Netlify, buka link-nya di HP, lalu pilih "Tambahkan ke Layar Utama". Setelah itu isi **Atur › Lokasi kantor › Pakai lokasi saya** dari kantor.
6. Data tersimpan di browser perangkat itu saja, jadi rajin **Backup JSON**.

## Struktur folder
```
index.html      kerangka, halaman, kiosk, dialog
style.css       gaya
app.js          logika & data
tema.css        warna, radius, font (token tema)
tema.js         nama usaha & mode terang/gelap
manifest.json   PWA
sw.js           service worker (offline)
ikon.svg        ikon aplikasi
DESIGN.md       sistem desain
AGENTS.md, .claude/skills/ubah-absensi-karyawan/SKILL.md   panduan untuk AI
```

## Ubah brand/warna
- Nama usaha dan mode: ubah `nama` dan `mode` ("terang" | "gelap" | "auto") di `tema.js`.
- Warna, radius, dan font ada di `tema.css`, dan semua warna lain diturunkan dari situ. Warna teks di atas tombol utama dipilih otomatis (putih atau gelap).
- Warna status (hadir hijau, telat oranye, izin biru, sakit ungu, cuti tosca, alpa merah) sengaja tetap supaya maknanya jelas.

## Catatan keamanan
Aplikasi ini untuk tim kecil yang saling percaya. Data dan PIN tersimpan di browser tanpa server, jadi orang yang paham teknis bisa mengubahnya. Kalau butuh absensi yang tidak bisa diakali, pakai server/database.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini. Skill di `.claude/skills/ubah-absensi-karyawan` terbaca otomatis, jadi tinggal minta, misalnya "tambah kolom NIK".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai buka Customize › Skills › tombol "+" › Create skill › Upload a skill dan pilih ZIP-nya (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

## Ganti logo & foto

Semua path gambar ada di objek `KONFIG` paling atas `app.js`.

- **Logo usaha** (sidebar, header HP, layar kiosk): timpa `img/logo.svg` dengan logo kamu (persegi, mis. 200×200). Pakai PNG/JPG? Simpan di `img/` lalu ubah `KONFIG.logo`. Kalau gagal dimuat atau dikosongkan, otomatis tampil inisial nama usaha.
- **Foto karyawan**: menu Karyawan › ubah › *Foto karyawan* → pilih gambar. Foto diperkecil otomatis (≤400 px, atur `KONFIG.fotoMaksPx`) dan disimpan di perangkat (ikut backup JSON). Tanpa foto = inisial berwarna. Mau foto bawaan? Isi `KONFIG.fotoKaryawanBawaan: 'img/karyawan.svg'` (placeholder sudah ada).
- **Selfie check-in** tetap lewat fitur kamera yang sudah ada (Atur › Selfie).
- Setelah mengganti berkas, naikkan `VERSI` di `sw.js` supaya PWA memuat gambar baru.

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
