/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Data contoh FIKTIF: judul, penulis, penerbit, dan ISBN dikarang sendiri (awalan 999 bukan ISBN asli).
   Dipakai saat aplikasi pertama dibuka & mode ?demo. Ganti/hapus lewat aplikasi, bukan di sini. */
window.DATA_CONTOH = {
  kategori: ['Keperawatan', 'Kedokteran', 'Farmasi', 'Manajemen RS', 'Gizi', 'Kebidanan', 'Umum'],
  buku: [
    ['Asuhan Keperawatan Pasien Rawat Inap', 'Ns. Rina Kartikasari', 'Penerbit Embun Medika', 2022, '999-602-0001-01-1', 'Keperawatan', 'Buku', 'A1-01', 4, ''],
    ['Pedoman Praktis Perawatan Luka Kronis', 'Ns. Dimas Prasetyo', 'Penerbit Embun Medika', 2021, '999-602-0001-02-8', 'Keperawatan', 'Buku', 'A1-02', 3, ''],
    ['Komunikasi Terapeutik untuk Perawat', 'Laras Widyaningrum', 'Pustaka Lentera Sehat', 2020, '999-602-0001-03-5', 'Keperawatan', 'Buku', 'A1-03', 2, 'https://contoh.local/ebook/komunikasi-terapeutik.pdf'],
    ['Dasar-Dasar Kegawatdaruratan IGD', 'dr. Bayu Aji Nugroho', 'Pustaka Lentera Sehat', 2023, '999-602-0002-01-0', 'Kedokteran', 'Buku', 'B1-01', 5, ''],
    ['Atlas Sederhana Anatomi Klinis', 'dr. Sekar Ayuningtyas', 'Penerbit Cakrawala Klinik', 2019, '999-602-0002-02-7', 'Kedokteran', 'Buku', 'B1-02', 2, ''],
    ['Tatalaksana Penyakit Dalam Sehari-hari', 'dr. Hendra Wiratama, Sp.PD', 'Penerbit Cakrawala Klinik', 2022, '999-602-0002-03-4', 'Kedokteran', 'Buku', 'B1-03', 3, ''],
    ['Jurnal Klinik Nusantara Vol. 12 No. 2', 'Tim Redaksi JKN', 'Asosiasi Klinisi Fiktif', 2024, '', 'Kedokteran', 'Jurnal', 'J1-01', 1, 'https://contoh.local/jurnal/jkn-12-2.pdf'],
    ['Farmakologi Ringkas untuk Tenaga Kesehatan', 'apt. Nadia Puspitasari', 'Pustaka Lentera Sehat', 2021, '999-602-0003-01-9', 'Farmasi', 'Buku', 'C1-01', 4, ''],
    ['Panduan Rekonsiliasi Obat di Bangsal', 'apt. Yoga Pratama', 'Penerbit Embun Medika', 2023, '999-602-0003-02-6', 'Farmasi', 'Buku', 'C1-02', 2, ''],
    ['Buletin Farmasi Rumah Sakit Edisi 7', 'Tim Instalasi Farmasi', 'Asosiasi Klinisi Fiktif', 2024, '', 'Farmasi', 'Jurnal', 'J1-02', 1, ''],
    ['Manajemen Mutu & Keselamatan Pasien', 'Dr. Arif Setiadi, MARS', 'Penerbit Cakrawala Klinik', 2022, '999-602-0004-01-8', 'Manajemen RS', 'Buku', 'D1-01', 3, ''],
    ['Akreditasi Rumah Sakit Tanpa Panik', 'Wulan Sari Dewi, MKM', 'Pustaka Lentera Sehat', 2023, '999-602-0004-02-5', 'Manajemen RS', 'Buku', 'D1-02', 2, 'https://contoh.local/ebook/akreditasi.pdf'],
    ['Rekam Medis Elektronik: Langkah Awal', 'Fajar Kurniawan', 'Penerbit Embun Medika', 2024, '999-602-0004-03-2', 'Manajemen RS', 'Buku', 'D1-03', 2, ''],
    ['Diet Pasien Diabetes di Rumah Sakit', 'Putri Ramadhani, S.Gz', 'Pustaka Lentera Sehat', 2020, '999-602-0005-01-7', 'Gizi', 'Buku', 'E1-01', 2, ''],
    ['Asuhan Kebidanan Persalinan Normal', 'Bdn. Siti Mardiyah', 'Penerbit Cakrawala Klinik', 2021, '999-602-0006-01-6', 'Kebidanan', 'Buku', 'E2-01', 3, ''],
    ['Menulis Laporan Kasus yang Rapi', 'dr. Galih Permana', 'Penerbit Embun Medika', 2022, '999-602-0007-01-5', 'Umum', 'Buku', 'F1-01', 2, '']
  ],
  anggota: [
    ['Ns. Ayu Lestari', 'Rawat Inap Melati', '198903122015032001'],
    ['dr. Rizky Hidayat', 'IGD', '199001052019031002'],
    ['apt. Maya Anggraini', 'Instalasi Farmasi', '199205202020122003'],
    ['Ns. Budi Santoso', 'ICU', '198711302012121001'],
    ['Dewi Kusumawati, S.Gz', 'Instalasi Gizi', '199408142021042002'],
    ['Andi Saputro, SKM', 'Bagian Mutu', '198506222010011003'],
    ['Bdn. Lina Marlina', 'Kamar Bersalin', '199112012018032004']
  ],
  // [indeks buku, indeks anggota, pinjam N hari lalu, lama pinjam, kembali N hari lalu atau null]
  pinjam: [
    [3, 1, 20, 7, 14], [0, 0, 18, 7, 12], [10, 5, 16, 14, 4], [7, 2, 15, 7, 9], [3, 3, 12, 7, 5],
    [0, 3, 11, 7, 3], [11, 5, 10, 7, null], [3, 0, 9, 7, null], [5, 1, 6, 7, null], [7, 4, 5, 7, null],
    [0, 6, 4, 7, null], [14, 6, 3, 7, null], [12, 2, 2, 7, null], [8, 2, 25, 7, 15], [3, 4, 30, 7, 22], [1, 0, 13, 7, 2]
  ]
};
