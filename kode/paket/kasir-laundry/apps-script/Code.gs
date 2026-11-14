/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/**
 * Kasir Laundry — penerima sinkron Google Sheets (Google Apps Script).
 *
 * Cara pakai singkat (lengkapnya di README.md):
 * 1. Buat Google Sheet baru → Ekstensi → Apps Script → tempel berkas ini.
 * 2. Ganti KUNCI di bawah dengan kata rahasia sendiri.
 * 3. Deploy → Deployment baru → Jenis: Aplikasi web → Jalankan sebagai: Saya → Akses: Siapa saja.
 * 4. Salin URL /exec ke menu Atur di aplikasi kasir dan di owner.html.
 *
 * doPost  : menyimpan/memperbarui order (JSON dari aplikasi kasir) ke sheet "Order".
 * doGet   : mengembalikan ringkasan (omzet, kg, belum diambil, piutang) untuk owner.html.
 */
var KUNCI = 'ganti-kunci-rahasia'; // WAJIB diganti. Samakan dengan isian "Kunci rahasia" di aplikasi & owner.html.
var NAMA_SHEET = 'Order';
var KOLOM = ['id', 'no', 'tanggal', 'pelanggan', 'wa', 'item', 'kg', 'paket', 'total', 'dibayar', 'sisa', 'status', 'estimasi', 'diambil', 'kasir', 'catatan', 'diperbarui', 'json'];
var NAMA_STATUS = { diterima: 'Diterima', dicuci: 'Dicuci', disetrika: 'Disetrika', siap: 'Siap ambil', diambil: 'Diambil' };

function balas_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ambilSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(NAMA_SHEET);
  if (!sh) {
    sh = ss.insertSheet(NAMA_SHEET);
    sh.getRange(1, 1, 1, KOLOM.length).setValues([KOLOM]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), KOLOM.length).setNumberFormat('@'); // simpan sebagai teks: tanggal ISO tidak diubah otomatis
  }
  return sh;
}

/** Jalankan sekali dari editor (opsional) untuk membuat sheet & memberi izin. */
function setup() {
  ambilSheet_();
}

function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (er) { return balas_({ ok: false, pesan: 'JSON tidak valid' }); }
  if (!data || data.kunci !== KUNCI) return balas_({ ok: false, pesan: 'Kunci salah' });
  var daftar = data.order || [];
  if (!daftar.length) return balas_({ ok: true, jumlah: 0 });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = ambilSheet_();
    var n = sh.getLastRow();
    var ids = n > 1 ? sh.getRange(2, 1, n - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
    var peta = {};
    ids.forEach(function (id, i) { peta[id] = i + 2; });
    var baru = [];
    daftar.forEach(function (o) {
      var baris = KOLOM.map(function (k) { var v = o[k]; return v == null ? '' : String(v); });
      if (peta[o.id]) sh.getRange(peta[o.id], 1, 1, KOLOM.length).setValues([baris]);
      else { baru.push(baris); peta[o.id] = -1; }
    });
    if (baru.length) sh.getRange(sh.getLastRow() + 1, 1, baru.length, KOLOM.length).setNumberFormat('@').setValues(baru);
    return balas_({ ok: true, jumlah: daftar.length, toko: data.toko || '' });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.kunci !== KUNCI) return balas_({ ok: false, pesan: 'Kunci salah' });
  var sh = ambilSheet_();
  var n = sh.getLastRow();
  var rows = n > 1 ? sh.getRange(2, 1, n - 1, KOLOM.length).getValues() : [];
  var tz = Session.getScriptTimeZone();
  var hariIni = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var bulanIni = hariIni.slice(0, 7);
  var r = {
    ok: true, dibuat: new Date().toISOString(), jumlahOrder: rows.length,
    hariIni: { order: 0, omzet: 0, kg: 0 }, bulanIni: { order: 0, omzet: 0, kg: 0 },
    perStatus: { diterima: 0, dicuci: 0, disetrika: 0, siap: 0, diambil: 0 },
    piutang: 0, belumDiambil: [], harian: []
  };
  var harian = {};
  for (var i = 13; i >= 0; i--) {
    var d = new Date(); d.setDate(d.getDate() - i);
    harian[Utilities.formatDate(d, tz, 'yyyy-MM-dd')] = { tanggal: Utilities.formatDate(d, tz, 'yyyy-MM-dd'), omzet: 0, kg: 0, order: 0 };
  }
  rows.forEach(function (row) {
    var o = {}; KOLOM.forEach(function (k, j) { o[k] = row[j]; });
    var tgl = o.tanggal ? Utilities.formatDate(new Date(o.tanggal), tz, 'yyyy-MM-dd') : '';
    var total = Number(o.total) || 0, kg = Number(o.kg) || 0, sisa = Number(o.sisa) || 0;
    if (tgl === hariIni) { r.hariIni.order++; r.hariIni.omzet += total; r.hariIni.kg += kg; }
    if (tgl.slice(0, 7) === bulanIni) { r.bulanIni.order++; r.bulanIni.omzet += total; r.bulanIni.kg += kg; }
    if (harian[tgl]) { harian[tgl].omzet += total; harian[tgl].kg += kg; harian[tgl].order++; }
    if (r.perStatus[o.status] != null) r.perStatus[o.status]++;
    r.piutang += sisa;
    if (o.status !== 'diambil') r.belumDiambil.push({ no: o.no, pelanggan: o.pelanggan, status: NAMA_STATUS[o.status] || o.status, tanggal: o.tanggal, estimasi: o.estimasi, total: total, sisa: sisa, kg: kg });
  });
  r.hariIni.kg = Math.round(r.hariIni.kg * 10) / 10;
  r.bulanIni.kg = Math.round(r.bulanIni.kg * 10) / 10;
  r.belumDiambil.sort(function (a, b) { return String(a.tanggal) < String(b.tanggal) ? -1 : 1; });
  r.belumDiambil = r.belumDiambil.slice(0, 100);
  r.harian = Object.keys(harian).map(function (k) { harian[k].kg = Math.round(harian[k].kg * 10) / 10; return harian[k]; });
  return balas_(r);
}
