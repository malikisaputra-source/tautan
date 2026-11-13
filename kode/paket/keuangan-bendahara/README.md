# Keuangan Pribadi & Bendahara

Satu aplikasi web, dua mode. **Pribadi** untuk mencatat uang sendiri: pemasukan, pengeluaran, anggaran, dompet, dan target tabungan. **Bendahara** untuk masjid, RT, atau komunitas: buku kas umum bernomor dan laporan periode yang siap dicetak lengkap dengan tanda tangan. Tanpa server, tanpa daftar akun, data tersimpan di browser.

Dibuat dari request TikTok: @manusiabiasa, @nal.ptr, @muslim_upskill.

## Fitur
**Mode Pribadi**
- Catat cepat: jumlah besar, tombol +10rb/+25rb/+50rb/+100rb, kategori berikon
- Anggaran per kategori dengan cincin progres (aman / hampir habis / lewat)
- Saldo per dompet: tunai, bank, e-wallet, plus pindah saldo antar dompet
- Laporan: grafik 6 bulan, donat pengeluaran per kategori, rasio tabungan
- Target tabungan dengan progres dan tombol setor
- Ekspor CSV per bulan

**Mode Bendahara**
- Buku Kas Umum bernomor, saldo berjalan, no. bukti otomatis (BKM/BKK)
- Saldo awal + tanggal mulai, identitas organisasi, nama bendahara & ketua
- Laporan periode (bulan ini / bulan lalu / tahun ini / bebas): saldo awal, pemasukan, pengeluaran, saldo akhir
- Rekap per pos, rincian transaksi, kolom tanda tangan, siap **Cetak / Simpan PDF**
- Ekspor CSV untuk Excel / Google Sheets

**Umum:** cadangan & pulihkan JSON (pindah HP), mode gelap, rapi di HP & laptop, animasi halus (mati otomatis bila perangkat minta gerak dikurangi).

## Cara menjalankan (pemula)
1. Unduh ZIP, klik kanan › Ekstrak.
2. Buka folder, klik dua kali `index.html` (terbuka di Chrome/Edge/Safari).
3. Pilih mode **Pribadi** atau **Bendahara**. Isinya data contoh dulu.
4. Kalau sudah paham, buka **Atur › Kosongkan data mode ini**, lalu mulai isi datamu.
5. Mau lihat demo tanpa menyentuh data: buka `index.html?demo` atau `index.html?demo=bendahara`.

Panduan lengkap langkah demi langkah ada di **`PANDUAN.md`**.

Mau online? Unggah folder ini ke GitHub Pages / Netlify (seret folder ke app.netlify.com/drop). Data tetap tersimpan di browser masing-masing pengguna.

## Struktur folder
```
index.html   kerangka, ikon SVG, layar pilih mode, dialog
style.css    semua gaya (turunan token tema) + gaya cetak laporan
app.js       logika: data, render halaman, form, laporan, CSV, cadangan, customizer
tema.css     token warna/radius/font (diubah customizer)
tema.js      nama aplikasi + mode terang/gelap
ikon.svg     ikon tab browser
PANDUAN.md   panduan pemakaian untuk pemula
DESIGN.md    sistem desain
AGENTS.md    ringkasan untuk AI coding agent
.claude/skills/ubah-keuangan-bendahara/SKILL.md   skill Claude
```

## Ubah brand & warna
- Nama di sidebar: ubah `nama` di `tema.js`. Mode `"terang"`, `"gelap"`, atau `"auto"`.
- Warna: ubah `--tema-utama` (hijau tua) dan `--tema-aksen` (hijau limau) di `tema.css`. Warna lain ikut otomatis.
- Teks di atas tombol/nav dihitung otomatis hitam/putih. Kartu saldo selalu teks putih di atas warna utama yang digelapkan, jadi pilih warna utama yang sedang–gelap.
- Nama organisasi, alamat, bendahara, ketua: isi di aplikasi, menu **Atur** (mode Bendahara).

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini, skill di `.claude/skills/ubah-keuangan-bendahara` terbaca otomatis. Minta saja, mis. "tambah kolom metode bayar di buku kas".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
MIT + syarat tambahan (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).
