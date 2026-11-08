---
name: ubah-keuangan-bendahara
description: Pakai saat pengguna ingin mengubah, menambah fitur, warna, field data, kategori, pos, menu, laporan/cetakan, atau tampilan di aplikasi Keuangan Pribadi & Bendahara (catatan keuangan pribadi + buku kas bendahara berbasis HTML/CSS/JS + localStorage).
---
# Ubah Keuangan Pribadi & Bendahara

Baca `DESIGN.md` dulu dan jaga token, aksesibilitas (label, fokus, kontras AA, target ≥44px), responsif HP/desktop, dan gaya cetak.

## Peta file
- `index.html` — kerangka: sidebar (`#menu`), nav bawah (`#bawah`), FAB, wadah halaman `#hal`, layar pilih mode `#sambut`, `<dialog id="dlg">`, toast, wadah cetak `#cetak`, ikon `<symbol id="i-…">`.
- `style.css` — alias token di `:root`, palet gelap `html[data-mode="gelap"]`, komponen, responsif (`1100px`, `900px`, `560px`), `@media print`, sorot customizer, reduced-motion.
- `app.js` — bagian: Utilitas, Data (`dataKosong`, `dataContoh`, `muat` + migrasi, `simpan`), Hitungan (`saldoDompet`, `sumBulan`, `bukuKas`), Navigasi (`MENU`, `renderMenu`, `buka`), PRIBADI (`RENDER.beranda/transaksi/anggaran/tabungan/laporan`), BENDAHARA (`RENDER.ringkas/bku/laporan-kas/pos`, `hitungPeriode`, `rekapPos`, `lembarLaporan`), ATUR, Dialog & form (`formTx`, `formPindah`, `formKas`, `formKategori`, `formAnggaran`, `formDompet`, `formTarget`, `formSetor`, `formPos`), Ekspor/cetak/cadangan (`csvPribadi`, `csvKas`, `cetak`, `backup`, `pulihkan`), Peristiwa (klik terdelegasi lewat `data-*`), Tema & Bagian.
- `tema.css` / `tema.js` — token (utama, aksen, radius, font, latar/panel/nav/teks), nama aplikasi & mode.
- `PANDUAN.md` (panduan pengguna — perbarui bila alur berubah), `DESIGN.md`, `AGENTS.md`, `README.md`.

## Token tema
`tema.css` hanya berisi `--tema-*`. `style.css` memetakan ke `--utama --aksen --latar --kartu --nav --teks` dan menurunkan varian dengan `color-mix()`. Teks di atas warna: `--isi-utama`, `--isi-nav`, `--isi-aksen` (dari `hitungTeksBagian()`).

## Data (localStorage `keuanganBendahara.v1`)
```
{ versi, mode:'pribadi'|'bendahara',
  pribadi:{ dompet:[{id,nama,jenis:'tunai'|'bank'|'ewallet',saldoAwal}],
            kategori:[{id,nama,ikon,warna,jenis:'masuk'|'keluar',anggaran}],
            transaksi:[{id,t:'YYYY-MM-DD',jenis:'masuk'|'keluar'|'pindah',jumlah,kat,dompet,ke?,ket}],
            target:[{id,nama,target,terkumpul,ikon}] },
  bendahara:{ org,alamat,kota,bendahara,ketua,saldoAwal,tglAwal,
              pos:[{id,nama,jenis,ikon}], kas:[{id,t,jenis,jumlah,pos,ket,bukti}] } }
```
- Field baru: tambahkan di `dataKosong()`; `muat()` melengkapi field yang hilang di data lama. Bila bentuk berubah, naikkan `VERSI` dan tulis migrasi di `muat()` — JANGAN hapus data pengguna.
- Tampilkan di fungsi `RENDER.*`, isi di `form*()`, ekspor di `csvPribadi()`/`csvKas()`, cetak di `lembarLaporan()`.
- `?demo` / `?demo=bendahara` memuat `dataContoh()` tanpa menyimpan.

## Menambah halaman/menu
1. Tambah entri `[id, label, ikon]` di `MENU.pribadi` atau `MENU.bendahara`.
2. Tulis `RENDER[id] = function () { return kepala(...) + ... }` (pakai `data-bagian` untuk panel/teks/utama).
3. Pasang event di `pasangHal()` atau tambahkan `data-aksi` + cabang `switch` di pendengar klik.

## Aturan aman
- Tanpa build tool/framework. Uji di HP (390px) & desktop, terang & gelap, dan pratinjau cetak (Ctrl+P) di mode Bendahara.
- Warna baru diturunkan dari token lewat `color-mix`; makna masuk/keluar tetap `--naik`/`--turun`.
- Animasi baru wajib mati di `prefers-reduced-motion`. Elemen baru diberi `data-bagian` bila relevan untuk customizer.
- Jangan hapus kredit `kredit-maliki`.

## Contoh permintaan
1. **"Ganti warna jadi biru dongker"** → ubah `--tema-utama` di `tema.css` (mis. #1e3a5f); cek kontras kartu saldo & tombol.
2. **"Tambah kolom metode bayar (tunai/transfer) di buku kas"** → tambah field `metode` di objek kas (`formKas` select), kolom di `RENDER.bku`, `lembarLaporan` dan `csvKas`; data lama tanpa `metode` tampil "—".
3. **"Tambah kategori bawaan Cicilan"** → tambah ke `dataKosong().pribadi.kategori`; untuk pengguna lama tambahkan migrasi di `muat()` yang menambah bila id belum ada.
4. **"Laporan bendahara pakai logo masjid sendiri"** → ganti isi `.kop-logo` di `lembarLaporan()` dengan `<img src="logo.png" alt="">`, tambah `logo.png` ke folder & `meta.json`.
5. **"Tambah tanda tangan sekretaris"** → tambah field `sekretaris` di `bendahara` + input di `RENDER.atur` + kolom ketiga di `.ttd` (ubah grid jadi 3 kolom).
6. **"Ingatkan kalau anggaran lewat"** → di `formTx` setelah simpan, hitung `sumBulan()` kategori vs `anggaran`, panggil `toast('Anggaran … terlewati')`.
7. **"Nama aplikasi jadi Dompet Keluarga"** → ubah `nama` di `tema.js`.
