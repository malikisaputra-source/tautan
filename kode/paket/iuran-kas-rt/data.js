/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Data contoh (fiktif). Dipakai saat aplikasi pertama kali dibuka atau setelah "Isi data contoh".
   Bulan dihitung relatif ke hari ini supaya contoh selalu terasa "bulan berjalan". */
window.DATA_CONTOH = function () {
  var kini = new Date();
  function bln(geser) { var d = new Date(kini.getFullYear(), kini.getMonth() + geser, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function tgl(b, h) { return b + '-' + String(h).padStart(2, '0'); }
  var nama = [
    ['Budi Santoso', 'A', '01', '081234567801'], ['Siti Rahmawati', 'A', '02', '081234567802'],
    ['Agus Wibowo', 'A', '03', '081234567803'], ['Dewi Lestari', 'A', '04', '081234567804'],
    ['Hendra Gunawan', 'A', '05', '081234567805'], ['Rina Marlina', 'A', '06', '081234567806'],
    ['Yusuf Hidayat', 'A', '07', '081234567807'], ['Fitri Handayani', 'A', '08', '081234567808'],
    ['Joko Prasetyo', 'A', '09', ''], ['Nur Aisyah', 'B', '01', '081234567810'],
    ['Teguh Saputra', 'B', '02', '081234567811'], ['Wulan Sari', 'B', '03', '081234567812'],
    ['Bambang Irawan', 'B', '04', '081234567813'], ['Maya Puspita', 'B', '05', '081234567814'],
    ['Dodi Kurniawan', 'B', '06', '081234567815'], ['Lilis Suryani', 'B', '07', '081234567816'],
    ['Rudi Hartono', 'B', '08', '081234567817'], ['Ani Wijayanti', 'B', '09', '081234567818']
  ];
  var warga = nama.map(function (n, i) { return { id: 'w' + (i + 1), nama: n[0], blok: n[1], no: n[2], hp: n[3] }; });
  var iuran = 50000;
  var b2 = bln(-2), b1 = bln(-1), b0 = bln(0);
  var bayar = {}; bayar[b2] = {}; bayar[b1] = {}; bayar[b0] = {};
  var kas = [], n = 0;
  function masuk(b, w, h) { bayar[b][w.id] = tgl(b, h); kas.push({ id: 'k' + (++n), tgl: tgl(b, h), jenis: 'masuk', ket: 'Iuran ' + w.nama, jumlah: iuran, ref: b + ':' + w.id }); }
  warga.forEach(function (w, i) {
    masuk(b2, w, 2 + (i % 8));
    if (i !== 8 && i !== 14) masuk(b1, w, 1 + (i % 9));
    if ([0, 1, 3, 4, 6, 9, 10, 12, 13, 16, 17].indexOf(i) >= 0) masuk(b0, w, 1 + (i % 6));
  });
  kas.unshift({ id: 'k0', tgl: tgl(b2, 1), jenis: 'masuk', ket: 'Saldo awal dari pengurus lama', jumlah: 1250000 });
  kas.push(
    { id: 'kx1', tgl: tgl(b2, 12), jenis: 'keluar', ket: 'Honor petugas sampah', jumlah: 300000 },
    { id: 'kx2', tgl: tgl(b2, 20), jenis: 'keluar', ket: 'Lampu jalan blok B (2 buah)', jumlah: 170000 },
    { id: 'kx3', tgl: tgl(b1, 12), jenis: 'keluar', ket: 'Honor petugas sampah', jumlah: 300000 },
    { id: 'kx4', tgl: tgl(b1, 17), jenis: 'masuk', ket: 'Sumbangan acara 17-an (sisa)', jumlah: 215000 },
    { id: 'kx5', tgl: tgl(b1, 25), jenis: 'keluar', ket: 'Kerja bakti: konsumsi', jumlah: 185000 },
    { id: 'kx6', tgl: tgl(b0, 5), jenis: 'keluar', ket: 'Honor petugas sampah', jumlah: 300000 },
    { id: 'kx7', tgl: tgl(b0, 6), jenis: 'keluar', ket: 'Cat pos ronda', jumlah: 142000 }
  );
  return {
    versi: 1,
    pengaturan: { iuran: iuran, batas: 10, bendahara: 'Bu Wulan (Bendahara)', bayarKe: 'tunai ke Bu Wulan (B-03) atau transfer, lalu kirim bukti ke WA ini' },
    warga: warga, bayar: bayar, kas: kas
  };
};
