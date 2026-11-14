/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* Kalender Kerja Harian — logika aplikasi (tanpa build, tanpa server).
   Peta: util · data & migrasi · jadwal berulang · render (strip, garis waktu, fokus, legenda)
   · seret/ubah ukuran · form · pengingat · ekspor (.ics, Google, CSV, JSON) · tema & customizer · mulai */
/* KONFIG gambar — ganti logo/foto cukup timpa berkas di img/ atau ubah path di sini. */
window.KONFIG = window.KONFIG || { logo: "img/logo.svg", profil: "img/profil.svg" };
(function () {
  "use strict";

  // ================= util =================
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  var HARI_P = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  var BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  var GERAK = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEMO = /[?&]demo\b/.test(location.search);
  var KUNCI = DEMO ? "kk_demo" : "kalender_kerja_v1";
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var uid = function () { return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  function tglStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function keTgl(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function tambahHari(s, n) { var d = keTgl(s); d.setDate(d.getDate() + n); return tglStr(d); }
  function keMenit(hhmm) { var p = String(hhmm).split(":"); return (+p[0]) * 60 + (+p[1] || 0); }
  function keJam(m) { m = ((m % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function jamTampil(m) { return keJam(m).replace(":", "."); }
  function lamaTampil(m) { var j = Math.floor(m / 60), s = m % 60; return (j ? j + " jam" : "") + (j && s ? " " : "") + (s ? s + " mnt" : ""); }
  function awalMinggu(s) { var d = keTgl(s), h = (d.getDay() + 6) % 7; d.setDate(d.getDate() - h); return tglStr(d); }

  // jam: di mode ?demo waktu dibekukan ke 10.20 hari ini agar pratinjau konsisten
  var mulaiMuat = Date.now();
  var dasarDemo = (function () { var d = new Date(); d.setHours(10, 20, 0, 0); return d.getTime(); })();
  function kini() { return DEMO ? new Date(dasarDemo + (Date.now() - mulaiMuat)) : new Date(); }
  function hariIni() { return tglStr(kini()); }
  function menitKini() { var d = kini(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; }

  // ================= kategori =================
  var KAT = [
    { id: "kerja", nama: "Kerja", warna: "var(--k-kerja)" },
    { id: "rapat", nama: "Rapat", warna: "var(--k-rapat)" },
    { id: "pribadi", nama: "Pribadi", warna: "var(--k-pribadi)" },
    { id: "istirahat", nama: "Istirahat", warna: "var(--k-istirahat)" }
  ];
  var katDari = function (id) { for (var i = 0; i < KAT.length; i++) if (KAT[i].id === id) return KAT[i]; return KAT[0]; };
  var ULANG = { tidak: "Sekali", harian: "Setiap hari", kerja: "Hari kerja", mingguan: "Setiap minggu" };

  // ================= data =================
  var D;
  function contoh() {
    var h = hariIni(), b = tambahHari(h, 1), k = tambahHari(h, -1), l = tambahHari(h, 2), l3 = tambahHari(h, 3);
    var t = function (judul, tanggal, mulai, durasi, kategori, o) {
      o = o || {};
      return { id: uid(), judul: judul, tanggal: tanggal, mulai: mulai, durasi: durasi, kategori: kategori, ingat: o.ingat != null ? o.ingat : 10, ulang: o.ulang || "tidak", catatan: o.catatan || "", selesai: o.selesai || {}, contoh: true };
    };
    var s = {}; s[h] = true; s[k] = true;
    return [
      t("Buka toko & cek stok rak", tambahHari(h, -14), "07:00", 45, "kerja", { ulang: "kerja", ingat: 10, selesai: s, catatan: "Cek minyak goreng, gula, beras 5 kg" }),
      t("Briefing tim pagi", tambahHari(h, -14), "08:00", 30, "rapat", { ulang: "kerja", ingat: 5, selesai: (function () { var o = {}; o[h] = true; return o; })() }),
      t("Balas pesanan WhatsApp", h, "08:45", 75, "kerja", { ingat: 0, selesai: (function () { var o = {}; o[h] = true; return o; })() }),
      t("Input faktur pembelian", h, "10:00", 60, "kerja", { ingat: 10, catatan: "Total faktur minggu ini ± Rp4.850.000" }),
      t("Rapat supplier — Pak Hendra", h, "11:00", 60, "rapat", { ingat: 10, catatan: "Bahas harga grosir & jadwal kirim" }),
      t("Makan siang & salat Zuhur", tambahHari(h, -14), "12:00", 60, "istirahat", { ulang: "harian", ingat: -1 }),
      t("Rekap penjualan harian", h, "14:00", 90, "kerja", { ingat: 30, catatan: "Target hari ini Rp6.500.000" }),
      t("Telepon Bu Ratna (pelanggan grosir)", h, "15:30", 30, "rapat", { ingat: 10 }),
      t("Jemput Nadia les", h, "16:30", 30, "pribadi", { ingat: 30 }),
      t("Olahraga sore", tambahHari(h, -14), "17:30", 45, "pribadi", { ulang: "mingguan", ingat: 10 }),
      t("Setor uang ke bank", k, "13:30", 45, "kerja"),
      t("Antar laporan ke kantor pajak", b, "09:30", 90, "kerja", { ingat: 60, catatan: "Bawa NPWP & bukti setor" }),
      t("Evaluasi bulanan dengan pemilik", b, "15:00", 60, "rapat", { ingat: 30 }),
      t("Servis motor di bengkel", l, "16:00", 60, "pribadi", { ingat: 30 }),
      t("Pelatihan kasir karyawan baru", l3, "13:00", 120, "kerja", { ingat: 30 })
    ];
  }
  function bawaan() { return { versi: 1, tugas: contoh(), pengaturan: { jamAwal: 6, jamAkhir: 22, sembunyi: [] }, terkirim: {} }; }
  function migrasi(d) {
    if (!d || typeof d !== "object") return bawaan();
    d.versi = d.versi || 1;
    d.tugas = Array.isArray(d.tugas) ? d.tugas : [];
    d.tugas.forEach(function (t) {
      t.id = t.id || uid(); t.selesai = t.selesai || {}; t.ulang = ULANG[t.ulang] ? t.ulang : "tidak";
      t.durasi = Math.max(5, +t.durasi || 60); t.ingat = t.ingat == null ? 10 : +t.ingat;
      if (!/^\d{4}-\d\d-\d\d$/.test(t.tanggal)) t.tanggal = hariIni();
      if (!/^\d\d:\d\d$/.test(t.mulai)) t.mulai = "09:00";
    });
    d.pengaturan = d.pengaturan || {};
    var p = d.pengaturan;
    p.jamAwal = p.jamAwal == null ? 6 : +p.jamAwal; p.jamAkhir = p.jamAkhir == null ? 22 : +p.jamAkhir;
    if (p.jamAkhir <= p.jamAwal) { p.jamAwal = 6; p.jamAkhir = 22; }
    p.sembunyi = p.sembunyi || [];
    d.terkirim = d.terkirim || {};
    return d;
  }
  function muat() {
    var s = null;
    if (!DEMO) { try { s = JSON.parse(localStorage.getItem(KUNCI)); } catch (e) { s = null; } }
    D = s ? migrasi(s) : bawaan();
    if (!s) simpan();
  }
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast("Gagal menyimpan: memori browser penuh."); } }

  // ================= jadwal berulang =================
  function terjadiPada(t, tgl) {
    if (t.ulang === "tidak") return t.tanggal === tgl;
    if (tgl < t.tanggal) return false;
    var h = keTgl(tgl).getDay();
    if (t.ulang === "harian") return true;
    if (t.ulang === "kerja") return h >= 1 && h <= 5;
    if (t.ulang === "mingguan") return h === keTgl(t.tanggal).getDay();
    return false;
  }
  function instans(tgl, semua) {
    return D.tugas.filter(function (t) { return terjadiPada(t, tgl) && (semua || D.pengaturan.sembunyi.indexOf(t.kategori) < 0); })
      .map(function (t) { var m = keMenit(t.mulai); return { t: t, tgl: tgl, m: m, a: m + t.durasi, selesai: !!t.selesai[tgl] }; })
      .sort(function (x, y) { return x.m - y.m || y.a - x.a; });
  }
  // susun kolom untuk blok yang bertabrakan
  function susun(list) {
    var grup = [], akhir = -1, cur = null;
    list.forEach(function (x) {
      if (!cur || x.m >= akhir) { cur = []; grup.push(cur); akhir = x.a; } else akhir = Math.max(akhir, x.a);
      cur.push(x);
    });
    grup.forEach(function (g) {
      var kol = [];
      g.forEach(function (x) {
        for (var i = 0; i < kol.length; i++) if (kol[i] <= x.m) { x.kol = i; kol[i] = x.a; return; }
        x.kol = kol.length; kol.push(x.a);
      });
      g.forEach(function (x) { x.nKol = kol.length; });
    });
    return list;
  }

  // ================= status tampilan =================
  var S = { tgl: hariIni(), tampil: "hari", arah: 1 };
  try { var tsimpan = localStorage.getItem("kk_tampil"); if (tsimpan === "minggu" || tsimpan === "hari") S.tampil = tsimpan; } catch (e) {}

  // ================= render =================
  function render() {
    renderKepala(); renderStrip(); renderGaris(); renderFokus(); renderLegenda(); renderNotif(); tandaiBagian(document);
  }
  function renderKepala() {
    var d = keTgl(S.tgl), h = hariIni();
    var judul = S.tampil === "minggu" ? "Minggu ini" : HARI[d.getDay()];
    if (S.tampil === "minggu") {
      var a0 = tigaHari() ? S.tgl : awalMinggu(S.tgl), a = keTgl(a0), z = keTgl(tambahHari(a0, tigaHari() ? 2 : 6));
      judul = a.getMonth() === z.getMonth() ? BULAN[a.getMonth()] : BULAN[a.getMonth()].slice(0, 3) + " – " + BULAN[z.getMonth()].slice(0, 3);
      $("#sub-hari").innerHTML = a.getDate() + "–" + z.getDate() + " " + BULAN[z.getMonth()] + " " + z.getFullYear() + " · <b>" + hitungMinggu(a0) + " jadwal</b>";
    } else {
      var l = instans(S.tgl), sel = l.filter(function (x) { return x.selesai; }).length;
      var label = S.tgl === h ? "Hari ini" : S.tgl === tambahHari(h, 1) ? "Besok" : S.tgl === tambahHari(h, -1) ? "Kemarin" : "";
      $("#sub-hari").innerHTML = (label ? "<b>" + label + "</b> · " : "") + d.getDate() + " " + BULAN[d.getMonth()] + " " + d.getFullYear() + " · " + (l.length ? sel + "/" + l.length + " selesai" : "kosong");
    }
    $("#judul-hari").textContent = judul;
    document.title = (S.tampil === "hari" ? HARI[d.getDay()] + ", " + d.getDate() + " " + BULAN[d.getMonth()] : judul) + " — Kalender Kerja";
    $(".kepala").classList.toggle("mode-minggu", S.tampil === "minggu"); ukurKepala();
    $$("[data-tampil]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.tampil === S.tampil)); });
    $("#btn-mundur").setAttribute("aria-label", S.tampil === "minggu" ? "Minggu sebelumnya" : "Hari sebelumnya");
    $("#btn-maju").setAttribute("aria-label", S.tampil === "minggu" ? "Minggu berikutnya" : "Hari berikutnya");
  }
  function hitungMinggu(a) { var n = 0; for (var i = 0; i < (tigaHari() ? 3 : 7); i++) n += instans(tambahHari(a, i)).length; return n; }

  function renderStrip() {
    var a = awalMinggu(S.tgl), h = hariIni(), html = "";
    for (var i = 0; i < 7; i++) {
      var t = tambahHari(a, i), d = keTgl(t), l = instans(t), titik = "";
      var kats = []; l.forEach(function (x) { if (kats.indexOf(x.t.kategori) < 0) kats.push(x.t.kategori); });
      kats.slice(0, 3).forEach(function (k) { titik += '<i style="--c:' + katDari(k).warna + '"></i>'; });
      html += '<button type="button" role="tab" class="hari-btn' + (t === h ? " ini" : "") + '" data-tgl="' + t + '" aria-selected="' + (t === S.tgl && S.tampil === "hari") + '" aria-label="' + HARI[d.getDay()] + " " + d.getDate() + " " + BULAN[d.getMonth()] + ", " + l.length + ' jadwal"><small>' + HARI_P[d.getDay()] + '</small><span class="tgl">' + d.getDate() + '</span><span class="titik">' + titik + "</span></button>";
    }
    $("#strip").innerHTML = html;
  }

  function renderGaris() {
    var p = D.pengaturan, awal = p.jamAwal * 60, akhir = p.jamAkhir * 60, n = p.jamAkhir - p.jamAwal;
    var hari = S.tampil === "minggu" ? (tigaHari() ? [0, 1, 2].map(function (i) { return tambahHari(S.tgl, i); }) : [0, 1, 2, 3, 4, 5, 6].map(function (i) { return tambahHari(awalMinggu(S.tgl), i); })) : [S.tgl];
    var h = hariIni(), mk = menitKini();
    var html = '<div class="tl ' + S.tampil + ' ganti-hari" style="--jam-n:' + n + ";--kol:" + hari.length + ";--arah:" + S.arah + '">';
    if (hari.length > 1) {
      html += '<div class="tl-kepala">';
      hari.forEach(function (t) { var d = keTgl(t); html += '<button type="button" data-buka-hari="' + t + '" class="' + (t === h ? "ini" : "") + '" aria-label="Buka ' + HARI[d.getDay()] + " " + d.getDate() + '"><small>' + HARI_P[d.getDay()] + "</small><b>" + d.getDate() + "</b></button>"; });
      html += "</div>";
    }
    html += '<div class="tl-jam" aria-hidden="true">';
    for (var j = p.jamAwal + 1; j < p.jamAkhir; j++) html += '<span style="top:' + ((j - p.jamAwal) / n * 100) + '%">' + pad(j) + ".00</span>";
    html += '</div><div class="tl-badan">';
    var total = 0, idx = 0;
    hari.forEach(function (t) {
      var list = susun(instans(t)); total += list.length;
      html += '<div class="tl-kol' + (t === h ? " ini" : t < h ? " lalu" : "") + '" data-tgl="' + t + '" aria-label="Jadwal ' + HARI[keTgl(t).getDay()] + '">';
      html += '<div class="bayangan-tambah" hidden></div>';
      list.forEach(function (x) {
        var m = Math.max(x.m, awal), a = Math.min(x.a, akhir);
        if (a <= awal || m >= akhir) return;
        var top = (m - awal) / (akhir - awal) * 100, tinggi = (a - m) / (akhir - awal) * 100;
        var lebar = 100 / x.nKol, kiri = x.kol * lebar, k = katDari(x.t.kategori);
        var aktif = t === h && mk >= x.m && mk < x.a;
        var cls = "blok muncul kat-" + k.id + (x.selesai ? " selesai" : "") + (aktif ? " kini" : "") + (x.t.durasi <= 35 ? " pendek" : "") + (hari.length > 1 || x.nKol > 2 ? " sempit" : "");
        var info = jamTampil(x.m) + "–" + jamTampil(x.a) + (x.t.ulang !== "tidak" ? ' <svg aria-hidden="true"><use href="#i-ulang"/></svg>' : "") + (x.t.ingat >= 0 ? ' <svg aria-hidden="true"><use href="#i-lonceng"/></svg>' : "");
        html += '<div class="' + cls + '" style="top:' + top + "%;height:" + tinggi + "%;left:" + kiri + "%;width:" + lebar + "%;--i:" + (idx++) + '" tabindex="0" role="button" data-id="' + x.t.id + '" data-tgl="' + t + '" aria-label="' + esc(x.t.judul) + ", " + jamTampil(x.m) + " sampai " + jamTampil(x.a) + ", " + k.nama + (x.selesai ? ", selesai" : "") + '. Enter untuk ubah, Alt + panah untuk geser.">' +
          '<div class="blok-kartu">' +
          '<button type="button" class="cek" data-cek aria-pressed="' + x.selesai + '" aria-label="Tandai ' + esc(x.t.judul) + ' selesai"><svg><use href="#i-cek"/></svg></button>' +
          '<div class="blok-isi"><b>' + esc(x.t.judul) + "</b><span>" + info + "</span></div></div>" +
          '<span class="tarik" data-tarik aria-hidden="true"></span></div>';
      });
      if (t === h && mk >= awal && mk <= akhir) html += '<div class="garis-kini" style="top:' + ((mk - awal) / (akhir - awal) * 100) + '%"><span>' + jamTampil(Math.floor(mk)) + "</span></div>";
      html += "</div>";
    });
    html += "</div>";
    if (!total) html += '<div class="kosong muncul"><h3 class="serif">Hari yang lapang</h3><p>Belum ada jadwal' + (S.tampil === "minggu" ? " minggu ini" : "") + '. Ketuk jam kosong di garis waktu atau tombol di bawah.</p><button type="button" class="btn btn-utama" data-tambah-kosong><svg><use href="#i-plus"/></svg>Tambah jadwal</button></div>';
    html += "</div>";
    $("#kanvas").innerHTML = html;
  }

  function renderFokus() {
    var h = hariIni(), mk = menitKini(), l = instans(h, true);
    var sel = l.filter(function (x) { return x.selesai; }).length, n = l.length;
    var kini_ = l.filter(function (x) { return mk >= x.m && mk < x.a; })[0];
    var lanjut = l.filter(function (x) { return x.m > mk && !x.selesai; })[0];
    var keliling = 2 * Math.PI * 27, persen = n ? sel / n : 0;
    var html = '<div class="fokus-atas"><div class="cincin" role="img" aria-label="' + sel + " dari " + n + ' selesai hari ini"><svg viewBox="0 0 64 64"><circle class="jalur" cx="32" cy="32" r="27"/><circle class="isi" cx="32" cy="32" r="27" stroke-dasharray="' + keliling + '" stroke-dashoffset="' + (keliling * (1 - persen)) + '" data-bagian="utama"/></svg><b>' + sel + "/" + n + '</b></div><div><h2 class="serif" id="fokus-judul">Sekarang &amp; berikutnya</h2><p>' + (n ? (sel === n ? "Semua beres hari ini. Mantap!" : (n - sel) + " jadwal lagi hari ini") : "Belum ada jadwal hari ini") + "</p></div></div>";
    html += '<div class="fokus-isi">';
    if (kini_) {
      var pr = Math.min(100, (mk - kini_.m) / (kini_.a - kini_.m) * 100);
      html += '<div class="fokus-item kini" style="--c:' + katDari(kini_.t.kategori).warna + '"><small><span class="denyut"></span>Sedang berjalan</small><b>' + esc(kini_.t.judul) + '</b><span class="waktu">sisa ' + lamaTampil(Math.max(1, Math.ceil(kini_.a - mk))) + " · s.d. " + jamTampil(kini_.a) + '</span><div class="progres"><i style="width:' + pr + '%"></i></div>' +
        (kini_.selesai ? "" : '<button type="button" class="btn btn-garis" data-fokus-selesai="' + kini_.t.id + '"><svg><use href="#i-cek"/></svg>Tandai selesai</button>') + "</div>";
    }
    if (lanjut) {
      var sisa = (lanjut.m - mk) * 60, j = Math.floor(sisa / 3600), mm = Math.floor(sisa % 3600 / 60), dd = Math.floor(sisa % 60);
      html += '<div class="fokus-item lanjut"><small>Berikutnya · ' + jamTampil(lanjut.m) + "</small><b>" + esc(lanjut.t.judul) + '</b><span class="hitung" aria-label="mulai dalam ' + (j ? j + " jam " : "") + mm + ' menit">' + (j ? j + ":" + pad(mm) : mm) + ":" + pad(dd) + '</span><span class="waktu">' + (j ? "jam:menit:detik" : "menit:detik") + " lagi</span></div>";
    }
    if (!kini_ && !lanjut) html += '<p class="fokus-kosong">' + (n ? "Tidak ada jadwal tersisa. Waktunya istirahat." : "Tambahkan jadwal pertama untuk hari ini.") + "</p>";
    html += "</div>";
    var el = $("#fokus"), kunciF = (kini_ ? kini_.t.id : "") + "|" + (lanjut ? lanjut.t.id : "") + "|" + sel + "/" + n;
    if (el.dataset.k === kunciF && el.innerHTML) { // hanya perbarui angka agar tidak berkedip
      var baru = document.createElement("div"); baru.innerHTML = html;
      var a1 = $$(".hitung, .waktu", el), b1 = $$(".hitung, .waktu", baru);
      a1.forEach(function (x, i) { if (b1[i]) { x.textContent = b1[i].textContent; x.setAttribute("aria-label", b1[i].getAttribute("aria-label") || ""); } });
      var p1 = $(".progres i", el), p2 = $(".progres i", baru); if (p1 && p2) p1.style.width = p2.style.width;
      return;
    }
    el.dataset.k = kunciF; el.innerHTML = html; tandaiBagian(el);
  }

  function renderLegenda() {
    var h = hariIni();
    var html = KAT.map(function (k) {
      var n = instans(h, true).filter(function (x) { return x.t.kategori === k.id; }).length;
      return '<button type="button" class="leg" data-kat="' + k.id + '" aria-pressed="' + (D.pengaturan.sembunyi.indexOf(k.id) < 0) + '" style="--c:' + k.warna + '"><i></i><span>' + k.nama + "</span><em>" + n + " hari ini</em></button>";
    }).join("");
    $("#legenda").innerHTML = html; $("#legenda-2").innerHTML = html;
    $("#pilih-kategori").innerHTML = KAT.map(function (k, i) { return '<label class="chip" style="--c:' + k.warna + '"><input type="radio" name="kategori" value="' + k.id + '"' + (i ? "" : " checked") + "><span><i></i>" + k.nama + "</span></label>"; }).join("");
  }

  // ================= pengingat (Notification API + service worker) =================
  var regSW = null;
  function statusNotif() {
    if (!("Notification" in window)) return "tidak";
    return Notification.permission; // granted | denied | default
  }
  function renderNotif() {
    var s = statusNotif(), html;
    if (s === "granted") html = '<div class="notif-baris" style="--c:var(--k-pribadi)"><i></i>Notifikasi aktif</div><p>Muncul sesuai pilihan "Ingatkan". Biarkan browser tetap terbuka (tab boleh di belakang).' + (regSW ? "" : " Untuk notifikasi paling andal, buka lewat http/https (mis. GitHub Pages) agar service worker aktif.") + "</p>";
    else if (s === "denied") html = '<div class="notif-baris" style="--c:var(--bahaya)"><i></i>Notifikasi diblokir</div><p>Izinkan lewat ikon gembok di sebelah alamat situs › Notifikasi › Izinkan. Sementara itu pengingat tampil di layar saat aplikasi terbuka.</p>';
    else if (s === "tidak") html = '<div class="notif-baris" style="--c:var(--k-istirahat)"><i></i>Browser tidak mendukung</div><p>Pengingat tampil sebagai kotak di layar saat aplikasi terbuka. Di iPhone: Bagikan › Tambah ke Layar Utama, lalu buka dari ikon.</p>';
    else html = '<div class="notif-baris" style="--c:var(--k-istirahat)"><i></i>Belum diizinkan</div><p>Izinkan agar HP/laptop berbunyi sebelum jadwal mulai.</p><button type="button" class="btn btn-utama btn-kecil" data-izin-notif data-bagian="utama"><svg><use href="#i-lonceng"/></svg>Izinkan notifikasi</button>';
    $("#notif-status").innerHTML = html; $("#notif-status-2").innerHTML = html;
  }
  function mintaIzin() {
    if (!("Notification" in window)) { toast("Browser ini tidak mendukung notifikasi. Pengingat tampil di layar."); return; }
    var p = Notification.requestPermission(function () { renderNotif(); });
    if (p && p.then) p.then(function (r) { renderNotif(); if (r === "granted") { kirimNotif("Notifikasi aktif", "Kalender Kerja akan mengingatkanmu sebelum jadwal mulai.", "uji"); } });
  }
  function kirimNotif(judul, isi, tag) {
    var opsi = { body: isi, icon: "ikon.svg", badge: "ikon.svg", tag: tag, renotify: true };
    try {
      if (regSW && regSW.showNotification) { regSW.showNotification(judul, opsi); return true; }
      new Notification(judul, opsi); return true;
    } catch (e) { return false; }
  }
  function cekPengingat() {
    var h = hariIni(), mk = menitKini(), ada = false;
    instans(h, true).forEach(function (x) {
      if (x.t.ingat < 0 || x.selesai) return;
      var waktu = x.m - x.t.ingat, kunci = x.t.id + "@" + h;
      if (mk >= waktu && mk < x.m + 1 && !D.terkirim[kunci]) {
        D.terkirim[kunci] = Date.now(); ada = true;
        var isi = (x.t.ingat > 0 ? "Mulai " + x.t.ingat + " menit lagi" : "Mulai sekarang") + " · " + jamTampil(x.m) + "–" + jamTampil(x.a) + (x.t.catatan ? "\n" + x.t.catatan : "");
        if (statusNotif() === "granted") kirimNotif(x.t.judul, isi, kunci);
        toastPengingat(x, isi);
      }
    });
    if (ada) { // buang catatan lama (>3 hari)
      var batas = Date.now() - 3 * 864e5; Object.keys(D.terkirim).forEach(function (k) { if (D.terkirim[k] < batas) delete D.terkirim[k]; });
      simpan();
    }
  }
  function daftarSW() {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    navigator.serviceWorker.register("sw.js").then(function () { return navigator.serviceWorker.ready; }).then(function (r) { regSW = r; renderNotif(); }).catch(function () {});
  }

  // ================= toast =================
  function toast(pesan, aksi, fn, durasi) {
    var el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status");
    el.innerHTML = "<span>" + esc(pesan) + "</span>" + (aksi ? '<button type="button">' + esc(aksi) + "</button>" : "");
    $("#toasts").appendChild(el);
    var tutup = function () { if (!el.parentNode) return; el.classList.add("keluar"); setTimeout(function () { el.remove(); }, GERAK ? 220 : 0); };
    if (aksi) el.querySelector("button").onclick = function () { fn(); tutup(); };
    setTimeout(tutup, durasi || 4200);
  }
  function toastPengingat(x, isi) {
    var el = document.createElement("div"); el.className = "toast pengingat"; el.setAttribute("role", "alert");
    el.innerHTML = '<svg aria-hidden="true"><use href="#i-lonceng"/></svg><span><b>' + esc(x.t.judul) + "</b><br>" + esc(isi.split("\n")[0]) + '</span><button type="button">Oke</button>';
    $("#toasts").appendChild(el);
    el.querySelector("button").onclick = function () { el.classList.add("keluar"); setTimeout(function () { el.remove(); }, 220); };
    setTimeout(function () { if (el.parentNode) { el.classList.add("keluar"); setTimeout(function () { el.remove(); }, 220); } }, 30000);
  }

  // ================= aksi data =================
  function cari(id) { for (var i = 0; i < D.tugas.length; i++) if (D.tugas[i].id === id) return D.tugas[i]; return null; }
  function toggleSelesai(id, tgl) {
    var t = cari(id); if (!t) return;
    if (t.selesai[tgl]) delete t.selesai[tgl]; else t.selesai[tgl] = true;
    simpan(); render();
    if (t.selesai[tgl]) {
      var sisa = instans(hariIni(), true).filter(function (x) { return !x.selesai; }).length;
      if (tgl === hariIni() && !sisa) toast("Semua jadwal hari ini selesai. Kerja bagus!");
    }
  }
  function pindah(id, tgl, mulaiM, durasi, tglAsal) {
    var t = cari(id); if (!t) return;
    var lama = { tanggal: t.tanggal, mulai: t.mulai, durasi: t.durasi };
    t.mulai = keJam(Math.max(0, Math.min(1439, mulaiM))); t.durasi = durasi;
    if (t.ulang === "tidak") t.tanggal = tgl;
    else if (t.ulang === "mingguan" && tgl !== tglAsal) { var g = keTgl(tgl).getDay() - keTgl(t.tanggal).getDay(); t.tanggal = tambahHari(t.tanggal, g); if (t.tanggal > tgl) t.tanggal = tambahHari(t.tanggal, -7); }
    simpan(); render();
    toast((t.ulang !== "tidak" ? "Semua jadwal berulang dipindah ke " : "Dipindah ke ") + jamTampil(keMenit(t.mulai)) + "–" + jamTampil(keMenit(t.mulai) + t.durasi), "Urungkan", function () { t.tanggal = lama.tanggal; t.mulai = lama.mulai; t.durasi = lama.durasi; simpan(); render(); });
  }
  function hapus(id) {
    var i = D.tugas.findIndex(function (t) { return t.id === id; }); if (i < 0) return;
    var t = D.tugas.splice(i, 1)[0]; simpan(); render();
    toast("“" + t.judul + "” dihapus", "Urungkan", function () { D.tugas.splice(i, 0, t); simpan(); render(); }, 6000);
  }

  // ================= seret & ubah ukuran =================
  var seret = null;
  document.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 || modePilih) return;
    var blok = e.target.closest(".blok");
    if (blok && !e.target.closest("[data-cek]")) {
      var kol = blok.parentNode, r = kol.getBoundingClientRect(), t = cari(blok.dataset.id);
      seret = { blok: blok, t: t, tgl: blok.dataset.tgl, tglBaru: blok.dataset.tgl, ubah: !!e.target.closest("[data-tarik]"), y0: e.clientY, x0: e.clientX, mulai: keMenit(t.mulai), durasi: t.durasi, pxMenit: r.height / ((D.pengaturan.jamAkhir - D.pengaturan.jamAwal) * 60), gerak: false, id: e.pointerId, sentuh: e.pointerType !== "mouse", siap: e.pointerType === "mouse" };
      // di layar sentuh: tahan ±0,35 detik dulu baru bisa diseret (agar gulir tetap lancar)
      if (seret.sentuh) { var s0 = seret; s0.timer = setTimeout(function () { if (seret === s0) { s0.siap = true; blok.classList.add("seret"); if (navigator.vibrate) navigator.vibrate(12); } }, 350); }
    }
  });
  function tambahDiKolom(e) {
    var kolom = e.target.closest(".tl-kol");
    if (!kolom || e.target.closest(".blok") || e.target.closest(".kosong")) return false;
    var rk = kolom.getBoundingClientRect(), m = D.pengaturan.jamAwal * 60 + (e.clientY - rk.top) / rk.height * (D.pengaturan.jamAkhir - D.pengaturan.jamAwal) * 60;
    bukaForm(null, { tanggal: kolom.dataset.tgl, mulai: keJam(Math.floor(m / 30) * 30) });
    return true;
  }
  $("#kanvas").addEventListener("touchmove", function (e) { if (seret && seret.siap) e.preventDefault(); }, { passive: false });
  document.addEventListener("pointermove", function (e) {
    var kol = e.target.closest && e.target.closest(".tl-kol");
    if (!seret && kol && !e.target.closest(".blok") && e.pointerType === "mouse") { // pratinjau slot kosong
      var bt = $(".bayangan-tambah", kol), rk = kol.getBoundingClientRect(), n = D.pengaturan.jamAkhir - D.pengaturan.jamAwal;
      var m = Math.floor((e.clientY - rk.top) / rk.height * n * 2) / 2;
      bt.hidden = false; bt.style.top = (m / n * 100) + "%"; bt.style.height = (0.5 / n * 100) + "%"; bt.textContent = "+ " + jamTampil(D.pengaturan.jamAwal * 60 + m * 60);
    }
    if (!seret) return;
    var dy = e.clientY - seret.y0, dx = e.clientX - seret.x0;
    if (!seret.gerak) {
      if (Math.abs(dy) < 5 && Math.abs(dx) < 5) return;
      if (!seret.siap) { clearTimeout(seret.timer); seret = null; return; } // sentuh: dianggap gulir
      seret.gerak = true; seret.blok.classList.add("seret"); seret.blok.classList.remove("muncul");
      try { seret.blok.setPointerCapture(seret.id); } catch (er) {}
      seret.label = document.createElement("span"); seret.label.className = "blok-label-seret"; seret.blok.appendChild(seret.label);
    }
    e.preventDefault();
    var dm = Math.round(dy / seret.pxMenit / 15) * 15, p = D.pengaturan;
    if (seret.ubah) {
      seret.durBaru = Math.max(15, seret.durasi + dm);
      seret.blok.style.height = (seret.durBaru / ((p.jamAkhir - p.jamAwal) * 60) * 100) + "%";
      seret.label.textContent = jamTampil(seret.mulai) + "–" + jamTampil(seret.mulai + seret.durBaru) + " · " + lamaTampil(seret.durBaru);
    } else {
      seret.mBaru = Math.max(p.jamAwal * 60, Math.min(p.jamAkhir * 60 - 15, seret.mulai + dm));
      seret.blok.style.top = ((seret.mBaru - p.jamAwal * 60) / ((p.jamAkhir - p.jamAwal) * 60) * 100) + "%";
      // pindah hari di tampilan minggu
      if (S.tampil === "minggu") {
        var kolomList = $$(".tl-kol"), target = null;
        kolomList.forEach(function (k) { var r = k.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX < r.right) target = k; });
        if (target) {
          seret.tglBaru = target.dataset.tgl;
          var asal = seret.blok.parentNode.getBoundingClientRect(), tr = target.getBoundingClientRect();
          seret.blok.style.transform = "translateX(" + (tr.left - asal.left) + "px)";
        }
      }
      seret.label.textContent = jamTampil(seret.mBaru) + "–" + jamTampil(seret.mBaru + seret.durasi);
    }
  }, { passive: false });
  document.addEventListener("pointerleave", function () { $$(".bayangan-tambah").forEach(function (b) { b.hidden = true; }); });
  document.addEventListener("mouseout", function (e) { if (e.target.classList && e.target.classList.contains("tl-kol") && !e.target.contains(e.relatedTarget)) $(".bayangan-tambah", e.target).hidden = true; });
  function akhiriSeret(batal) {
    if (!seret) return;
    var s = seret; seret = null; clearTimeout(s.timer);
    if (!s.gerak) { if (s.siap && s.sentuh) { s.blok.classList.remove("seret"); } if (!batal) bukaForm(s.t, { tglInstans: s.tgl }); return; }
    if (batal) { render(); return; }
    if (s.ubah) pindah(s.t.id, s.tgl, s.mulai, s.durBaru || s.durasi, s.tgl);
    else pindah(s.t.id, s.tglBaru, s.mBaru != null ? s.mBaru : s.mulai, s.durasi, s.tgl);
  }
  document.addEventListener("pointerup", function () { akhiriSeret(false); });
  document.addEventListener("pointercancel", function () { akhiriSeret(true); });

  // keyboard pada blok
  document.addEventListener("keydown", function (e) {
    var blok = e.target.closest && e.target.closest(".blok");
    if (blok && e.target === blok) {
      var t = cari(blok.dataset.id);
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bukaForm(t, { tglInstans: blok.dataset.tgl }); return; }
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault(); var d = e.key === "ArrowUp" ? -15 : 15;
        if (e.shiftKey) pindah(t.id, blok.dataset.tgl, keMenit(t.mulai), Math.max(15, t.durasi + d), blok.dataset.tgl);
        else pindah(t.id, blok.dataset.tgl, keMenit(t.mulai) + d, t.durasi, blok.dataset.tgl);
        setTimeout(function () { var b = $('.blok[data-id="' + t.id + '"]'); if (b) b.focus(); }, 30);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); hapus(t.id); return; }
    }
    if (e.key === "Escape" && seret) { akhiriSeret(true); return; }
    if (/input|select|textarea/i.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey || $("dialog[open]")) return;
    var k = e.key.toLowerCase();
    if (k === "n") { e.preventDefault(); bukaForm(null, {}); }
    else if (k === "t") keTanggal(hariIni());
    else if (k === "d" || k === "h") setTampil("hari");
    else if (k === "w" || k === "m") setTampil("minggu");
    else if (e.key === "ArrowLeft" && !blok) geser(-1);
    else if (e.key === "ArrowRight" && !blok) geser(1);
  });

  // ================= navigasi =================
  function keTanggal(t) { S.arah = t < S.tgl ? -1 : 1; S.tgl = t; render(); gulirKeKini(); }
  function tigaHari() { return matchMedia("(max-width: 600px)").matches; }
  function geser(n) { keTanggal(tambahHari(S.tgl, n * (S.tampil === "minggu" ? (tigaHari() ? 3 : 7) : 1))); }
  function setTampil(v) { S.tampil = v; try { localStorage.setItem("kk_tampil", v); } catch (e) {} render(); gulirKeKini(); }
  function gulirKeKini() {
    var k = $("#kanvas"); if (k.scrollHeight <= k.clientHeight + 4) return;
    var p = D.pengaturan, m = S.tgl === hariIni() || S.tampil === "minggu" ? menitKini() - 60 : 7 * 60;
    var badan = $(".tl-badan"); if (!badan) return;
    var y = badan.offsetTop + (Math.max(0, m - p.jamAwal * 60) / ((p.jamAkhir - p.jamAwal) * 60)) * badan.offsetHeight - 20;
    var lama = k.style.scrollBehavior; k.style.scrollBehavior = "auto"; k.scrollTop = y; k.style.scrollBehavior = lama;
  }

  document.addEventListener("click", function (e) {
    if (modePilih) return;
    var el;
    if ((el = e.target.closest("[data-cek]"))) { var b = el.closest(".blok"); toggleSelesai(b.dataset.id, b.dataset.tgl); return; }
    if ((el = e.target.closest(".hari-btn"))) { if (S.tampil === "minggu") S.tampil = "hari"; keTanggal(el.dataset.tgl); return; }
    if ((el = e.target.closest("[data-buka-hari]"))) { S.tampil = "hari"; keTanggal(el.dataset.bukaHari); return; }
    if ((el = e.target.closest("[data-tampil]"))) { setTampil(el.dataset.tampil); return; }
    if ((el = e.target.closest("[data-kat]"))) {
      var s = D.pengaturan.sembunyi, i = s.indexOf(el.dataset.kat);
      if (i < 0) s.push(el.dataset.kat); else s.splice(i, 1); simpan(); render(); return;
    }
    if ((el = e.target.closest("[data-fokus-selesai]"))) { toggleSelesai(el.dataset.fokusSelesai, hariIni()); return; }
    if (e.target.closest("[data-izin-notif]")) { mintaIzin(); return; }
    if (e.target.closest("[data-tambah-kosong]")) { bukaForm(null, {}); return; }
    if (tambahDiKolom(e)) return;
    if ((el = e.target.closest("[data-ekspor]"))) { ekspor(el.dataset.ekspor); return; }
  });
  $("#btn-mundur").onclick = function () { geser(-1); };
  $("#btn-maju").onclick = function () { geser(1); };
  $("#btn-hari-ini").onclick = function () { keTanggal(hariIni()); };
  $("#btn-tambah").onclick = $("#fab").onclick = function () { bukaForm(null, {}); };
  $("#btn-atur").onclick = $("#btn-atur-hp").onclick = function () { bukaDialog($("#dlg-atur")); };
  $("#btn-ics-semua").onclick = function () { ekspor("ics"); };

  // geser kiri/kanan di HP untuk ganti hari
  (function () {
    var x0 = null, y0 = 0;
    $("#kanvas").addEventListener("touchstart", function (e) { if (e.target.closest(".blok")) { x0 = null; return; } x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    $("#kanvas").addEventListener("touchend", function (e) {
      if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) geser(dx < 0 ? 1 : -1); x0 = null;
    }, { passive: true });
  })();

  // ================= dialog =================
  function bukaDialog(d) { if (!d.open) { d.classList.remove("tutup"); d.showModal(); } }
  function tutupDialog(d) {
    if (!d.open) return;
    if (!GERAK) { d.close(); return; }
    d.classList.add("tutup"); setTimeout(function () { d.classList.remove("tutup"); d.close(); }, 180);
  }
  $$(".dlg").forEach(function (d) {
    d.addEventListener("cancel", function (e) { e.preventDefault(); tutupDialog(d); });
    d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-tutup]")) tutupDialog(d); });
  });

  // ================= form =================
  var F = $("#form-tugas"), sedang = null, tglInstans = null;
  function bukaForm(t, o) {
    o = o || {}; sedang = t; tglInstans = o.tglInstans || (t ? t.tanggal : null);
    F.reset(); $("#galat-judul").textContent = ""; F.judul.removeAttribute("aria-invalid");
    $("#dlg-judul").textContent = t ? "Ubah jadwal" : "Jadwal baru";
    var durasi = t ? t.durasi : 60;
    F.judul.value = t ? t.judul : "";
    F.tanggal.value = t ? (t.ulang === "tidak" ? t.tanggal : t.tanggal) : (o.tanggal || S.tgl);
    var mDefault = Math.ceil(Math.max(menitKini(), D.pengaturan.jamAwal * 60) / 30) * 30;
    F.mulai.value = t ? t.mulai : (o.mulai || (S.tgl === hariIni() ? keJam(Math.min(mDefault, 23 * 60)) : "09:00"));
    var preset = ["30", "60", "90", "120"].indexOf(String(durasi)) >= 0;
    $$('input[name="durasi"]', F).forEach(function (r) { r.checked = preset ? r.value === String(durasi) : r.value === "lain"; });
    $("#durasi-lain-wrap").hidden = preset; F.durasiLain.value = preset ? "" : durasi;
    var kat = t ? t.kategori : "kerja"; $$('input[name="kategori"]', F).forEach(function (r) { r.checked = r.value === kat; });
    F.ingat.value = String(t ? t.ingat : 10); F.ulang.value = t ? t.ulang : "tidak"; F.catatan.value = t ? t.catatan : "";
    $("#btn-hapus").hidden = !t; $("#info-ulang").hidden = !(t && t.ulang !== "tidak"); $("#ekspor-satu").hidden = !t;
    if (t) $("#link-gcal").href = linkGoogle(t);
    bukaDialog($("#dlg-tugas"));
    setTimeout(function () { if (!t) F.judul.focus(); }, 40);
  }
  $$('input[name="durasi"]', F).forEach(function (r) { r.addEventListener("change", function () { var lain = F.querySelector('input[name="durasi"]:checked').value === "lain"; $("#durasi-lain-wrap").hidden = !lain; if (lain) F.durasiLain.focus(); }); });
  F.judul.addEventListener("input", function () { if (F.judul.value.trim()) { $("#galat-judul").textContent = ""; F.judul.removeAttribute("aria-invalid"); } });
  F.addEventListener("submit", function (e) {
    e.preventDefault();
    var judul = F.judul.value.trim();
    if (!judul) { $("#galat-judul").textContent = "Nama kegiatan wajib diisi."; F.judul.setAttribute("aria-invalid", "true"); F.judul.focus(); return; }
    if (!F.tanggal.value || !F.mulai.value) { toast("Isi tanggal dan jam mulai."); return; }
    var dv = F.querySelector('input[name="durasi"]:checked'); dv = dv ? dv.value : "60";
    var durasi = dv === "lain" ? Math.max(5, Math.min(720, parseInt(F.durasiLain.value, 10) || 60)) : +dv;
    var data = { judul: judul, tanggal: F.tanggal.value, mulai: F.mulai.value.slice(0, 5), durasi: durasi, kategori: (F.querySelector('input[name="kategori"]:checked') || {}).value || "kerja", ingat: +F.ingat.value, ulang: F.ulang.value, catatan: F.catatan.value.trim() };
    if (sedang) { Object.keys(data).forEach(function (k) { sedang[k] = data[k]; }); delete sedang.contoh; }
    else { data.id = uid(); data.selesai = {}; D.tugas.push(data); }
    // pengingat yang sudah terkirim untuk jadwal ini direset agar jam baru tetap diingatkan
    var id = sedang ? sedang.id : data.id; Object.keys(D.terkirim).forEach(function (k) { if (k.indexOf(id + "@") === 0) delete D.terkirim[k]; });
    simpan(); tutupDialog($("#dlg-tugas"));
    if (S.tampil === "hari" && data.ulang === "tidak") S.tgl = data.tanggal;
    render(); toast(sedang ? "Jadwal diperbarui" : "Jadwal ditambahkan" + (data.ingat >= 0 && statusNotif() === "default" ? " · izinkan notifikasi agar diingatkan" : ""));
    if (!sedang && statusNotif() === "default" && data.ingat >= 0) setTimeout(renderNotif, 0);
    cekPengingat();
  });
  $("#btn-hapus").onclick = function () { var t = sedang; tutupDialog($("#dlg-tugas")); if (t) hapus(t.id); };
  $("#btn-ics-satu").onclick = function () { if (sedang) unduh(namaBerkas(sedang.judul) + ".ics", buatIcs([sedang]), "text/calendar"); };

  // ================= ekspor =================
  function jamAkhir(t, tgl) { var d = keTgl(tgl || t.tanggal); d.setMinutes(keMenit(t.mulai) + t.durasi); return d; }
  function fmtIcs(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; }
  function mulaiDate(t, tgl) { var d = keTgl(tgl || t.tanggal); d.setMinutes(keMenit(t.mulai)); return d; }
  function rrule(t) { return t.ulang === "harian" ? "FREQ=DAILY" : t.ulang === "kerja" ? "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" : t.ulang === "mingguan" ? "FREQ=WEEKLY" : ""; }
  function linkGoogle(t) {
    var q = "action=TEMPLATE&text=" + encodeURIComponent(t.judul) + "&dates=" + fmtIcs(mulaiDate(t)) + "/" + fmtIcs(jamAkhir(t)) + "&ctz=Asia/Jakarta";
    if (t.catatan) q += "&details=" + encodeURIComponent(t.catatan);
    if (rrule(t)) q += "&recur=" + encodeURIComponent("RRULE:" + rrule(t));
    return "https://calendar.google.com/calendar/render?" + q;
  }
  function escIcs(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); }
  function lipat(baris) { var out = [], s = baris; while (s.length > 74) { out.push(s.slice(0, 74)); s = " " + s.slice(74); } out.push(s); return out.join("\r\n"); }
  function buatIcs(list) {
    var now = new Date(), stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + "T" + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + "Z";
    var b = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Maliki Studio//Kalender Kerja Harian//ID", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:" + escIcs(window.TEMA.nama + " — Kalender Kerja"), "X-WR-TIMEZONE:Asia/Jakarta",
      "BEGIN:VTIMEZONE", "TZID:Asia/Jakarta", "BEGIN:STANDARD", "DTSTART:19700101T000000", "TZOFFSETFROM:+0700", "TZOFFSETTO:+0700", "TZNAME:WIB", "END:STANDARD", "END:VTIMEZONE"];
    list.forEach(function (t) {
      b.push("BEGIN:VEVENT", "UID:" + t.id + "@kalender-kerja", "DTSTAMP:" + stamp, "DTSTART;TZID=Asia/Jakarta:" + fmtIcs(mulaiDate(t)), "DTEND;TZID=Asia/Jakarta:" + fmtIcs(jamAkhir(t)), "SUMMARY:" + escIcs(t.judul), "CATEGORIES:" + katDari(t.kategori).nama);
      if (t.catatan) b.push("DESCRIPTION:" + escIcs(t.catatan));
      if (rrule(t)) b.push("RRULE:" + rrule(t));
      if (t.ingat >= 0) b.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + escIcs(t.judul), "TRIGGER:-PT" + t.ingat + "M", "END:VALARM");
      b.push("END:VEVENT");
    });
    b.push("END:VCALENDAR");
    return b.map(lipat).join("\r\n") + "\r\n";
  }
  function namaBerkas(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "jadwal"; }
  function unduh(nama, isi, tipe) {
    var url = URL.createObjectURL(new Blob([isi], { type: tipe + ";charset=utf-8" })), a = document.createElement("a");
    a.href = url; a.download = nama; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast("Mengunduh " + nama);
  }
  function csvSel(v) { v = String(v == null ? "" : v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function ekspor(jenis) {
    if (!D.tugas.length) { toast("Belum ada jadwal untuk diekspor."); return; }
    var tgl = hariIni();
    if (jenis === "ics") unduh("kalender-kerja-" + tgl + ".ics", buatIcs(D.tugas), "text/calendar");
    if (jenis === "json") unduh("backup-kalender-kerja-" + tgl + ".json", JSON.stringify({ aplikasi: "kalender-kerja", dibuat: new Date().toISOString(), data: D }, null, 2), "application/json");
    if (jenis === "csv") {
      var rows = [["Judul", "Tanggal mulai", "Jam mulai", "Jam selesai", "Durasi (menit)", "Kategori", "Ingatkan (menit)", "Ulangi", "Selesai hari ini", "Catatan"]];
      D.tugas.slice().sort(function (a, b) { return (a.tanggal + a.mulai).localeCompare(b.tanggal + b.mulai); }).forEach(function (t) {
        rows.push([t.judul, t.tanggal, t.mulai, keJam(keMenit(t.mulai) + t.durasi), t.durasi, katDari(t.kategori).nama, t.ingat < 0 ? "-" : t.ingat, ULANG[t.ulang], t.selesai[tgl] ? "Ya" : "Tidak", t.catatan]);
      });
      unduh("jadwal-" + tgl + ".csv", "\ufeff" + rows.map(function (r) { return r.map(csvSel).join(","); }).join("\r\n"), "text/csv");
    }
  }
  $("#impor-json").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result), d = o && o.data ? o.data : o;
        if (!d || !Array.isArray(d.tugas)) throw new Error("format");
        if (!confirm("Ganti semua jadwal sekarang dengan isi backup (" + d.tugas.length + " jadwal)?")) return;
        D = migrasi(d); simpan(); render(); tutupDialog($("#dlg-atur")); toast("Backup dipulihkan: " + D.tugas.length + " jadwal");
      } catch (er) { toast("Berkas bukan backup Kalender Kerja yang valid."); }
      e.target.value = "";
    };
    r.readAsText(f);
  });
  $("#btn-hapus-contoh").onclick = function () {
    var n = D.tugas.length; D.tugas = D.tugas.filter(function (t) { return !t.contoh; });
    simpan(); render(); toast(n - D.tugas.length ? (n - D.tugas.length) + " jadwal contoh dihapus" : "Tidak ada jadwal contoh tersisa");
  };
  $("#btn-hapus-semua").onclick = function () {
    if (!confirm("Kosongkan SEMUA jadwal? Buat Backup JSON dulu bila ragu.")) return;
    var lama = D.tugas; D.tugas = []; simpan(); render(); tutupDialog($("#dlg-atur"));
    toast("Semua jadwal dikosongkan", "Urungkan", function () { D.tugas = lama; simpan(); render(); }, 8000);
  };
  (function isiJam() {
    var a = "", z = "";
    for (var j = 0; j <= 23; j++) a += '<option value="' + j + '">' + pad(j) + ".00</option>";
    for (var k = 1; k <= 24; k++) z += '<option value="' + k + '">' + pad(k) + ".00</option>";
    $("#atur-awal").innerHTML = a; $("#atur-akhir").innerHTML = z;
  })();
  function aturJam() {
    var a = +$("#atur-awal").value, z = +$("#atur-akhir").value;
    if (z - a < 4) { toast("Rentang minimal 4 jam."); $("#atur-awal").value = D.pengaturan.jamAwal; $("#atur-akhir").value = D.pengaturan.jamAkhir; return; }
    D.pengaturan.jamAwal = a; D.pengaturan.jamAkhir = z; simpan(); render();
  }
  $("#atur-awal").onchange = aturJam; $("#atur-akhir").onchange = aturJam;

  // ================= tema & customizer =================
  var FONT_OK = ["Plus Jakarta Sans", "Inter", "Poppins", "DM Sans", "Space Grotesk", "Nunito"];
  function tampilkanNama() { $$("[data-tema-nama]").forEach(function (el) { el.textContent = window.TEMA.nama; }); }
  function setMode(m, simpanPilihan) {
    if (m === "auto") m = matchMedia("(prefers-color-scheme: dark)").matches ? "gelap" : "terang";
    var r = document.documentElement; r.classList.add("halus"); r.setAttribute("data-mode", m);
    setTimeout(function () { r.classList.remove("halus"); }, 400);
    if (simpanPilihan && !DEMO) try { localStorage.setItem("kk_mode", m); } catch (e) {}
  }
  function gantiMode() { setMode(document.documentElement.getAttribute("data-mode") === "gelap" ? "terang" : "gelap", true); }
  $("#btn-mode").onclick = $("#btn-mode-hp").onclick = gantiMode;
  function muatFont(nama) {
    var fam = String(nama).split(",")[0].replace(/["']/g, "").trim(); if (FONT_OK.indexOf(fam) < 0) return;
    var el = $("#font-link"), href = "https://fonts.googleapis.com/css2?family=" + fam.replace(/ /g, "+") + ":wght@400;500;600;700;800&display=swap";
    if (el.getAttribute("href") !== href) el.setAttribute("href", href);
  }
  function luminansi(hex) {
    var m = String(hex).trim().replace("#", "");
    if (m.length === 3) m = m[0] + m[0] + m[1] + m[1] + m[2] + m[2];
    if (!/^[0-9a-f]{6}$/i.test(m)) return 0.5;
    var w = [0.2126, 0.7152, 0.0722], L = 0;
    for (var i = 0; i < 3; i++) { var c = parseInt(m.substr(i * 2, 2), 16) / 255; L += w[i] * (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)); }
    return L;
  }
  function teksKontras(bg) { var L = luminansi(bg); return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.0675) ? "#ffffff" : "#1c1917"; }
  function terapkan(t) {
    var r = document.documentElement; r.classList.add("halus");
    if (t.utama) { r.style.setProperty("--tema-utama", t.utama); r.style.setProperty("--tema-utama-teks", teksKontras(t.utama)); }
    if (t.aksen) r.style.setProperty("--tema-aksen", t.aksen);
    if (t.radius != null) r.style.setProperty("--tema-radius", /px$/.test(String(t.radius)) ? t.radius : t.radius + "px");
    if (t.font) { var fam = t.font.split(",")[0].replace(/["']/g, "").trim(); r.style.setProperty("--tema-font", '"' + fam + '", system-ui, sans-serif'); muatFont(fam); }
    if (t.mode) setMode(t.mode, false);
    if (t.bagian) {
      var map = { latar: "--latar", panel: "--panel", nav: "--nav", teks: "--teks" };
      Object.keys(map).forEach(function (k) {
        var v = t.bagian[k];
        if (v) { r.style.setProperty(map[k], v); r.style.setProperty("--tema-" + k, v); if (k === "nav") r.style.setProperty("--nav-teks", teksKontras(v)); }
        else { r.style.removeProperty(map[k]); if (k === "nav") r.style.removeProperty("--nav-teks"); }
      });
    }
    if (t.nama) { window.TEMA.nama = t.nama; tampilkanNama(); }
    setTimeout(function () { r.classList.remove("halus"); }, 400);
  }
  window.addEventListener("message", function (e) { if (e.data && e.data.tipe === "tema") terapkan(e.data); });

  // bagian untuk customizer
  function tandaiBagian(w) {
    var peta = [[".fokus, .blok-kartu, .tl-kol, .kosong, .dlg form, .dlg-bungkus", "panel"], [".btn-utama, .segmen [aria-pressed=true], .hari-btn[aria-selected=true] .tgl, .garis-kini", "utama"], [".blok.kat-rapat .blok-kartu, .leg i, .titik", "aksen"], ["h1, h2, .sub-hari", "teks"]];
    peta.forEach(function (p) { $$(p[0], w).forEach(function (el) { if (!el.hasAttribute("data-bagian")) el.setAttribute("data-bagian", p[1]); }); });
    if (sorotBagian) sorot(sorotBagian);
  }
  var NAMA_BAGIAN = { nav: "Navigasi", latar: "Latar", panel: "Panel", utama: "Warna utama", aksen: "Aksen", teks: "Teks" };
  var sorotBagian = null;
  function sorot(b) {
    sorotBagian = b;
    $$("[data-sorot]").forEach(function (el) { el.removeAttribute("data-sorot"); });
    if (b) $$('[data-bagian="' + b + '"]').forEach(function (el) { el.setAttribute("data-sorot", NAMA_BAGIAN[b] || b); });
  }
  var modePilih = false, hoverEl = null;
  function setModePilih(on) {
    modePilih = !!on; document.documentElement.classList.toggle("mode-pilih", modePilih);
    if (!modePilih && hoverEl) { hoverEl.classList.remove("pilih-hover"); hoverEl = null; }
  }
  ["click", "pointerdown", "mousedown", "pointerup", "mouseup", "submit", "dragstart", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (!modePilih) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (ev === "click") { var el = e.target.closest && e.target.closest("[data-bagian]"); if (el && window.parent !== window) window.parent.postMessage({ tipe: "bagian-dipilih", bagian: el.dataset.bagian }, "*"); }
    }, true);
  });
  document.addEventListener("mouseover", function (e) {
    if (!modePilih) return; var el = e.target.closest && e.target.closest("[data-bagian]");
    if (hoverEl && hoverEl !== el) hoverEl.classList.remove("pilih-hover"); hoverEl = el; if (el) el.classList.add("pilih-hover");
  }, true);
  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.tipe === "sorot") sorot(e.data.bagian || null);
    if (e.data.tipe === "mode-pilih") setModePilih(e.data.aktif);
  });

  // ================= mulai =================
  muat();
  tampilkanNama();
  var utamaAwal = getComputedStyle(document.documentElement).getPropertyValue("--tema-utama").trim();
  if (utamaAwal) document.documentElement.style.setProperty("--tema-utama-teks", teksKontras(utamaAwal));
  $("#atur-awal").value = D.pengaturan.jamAwal; $("#atur-akhir").value = D.pengaturan.jamAkhir;
  render();
  requestAnimationFrame(gulirKeKini);
  function ukurKepala() { document.documentElement.style.setProperty("--kepala-h", $(".kepala").offsetHeight + "px"); }
  ukurKepala(); window.addEventListener("resize", ukurKepala);
  var modeTiga = tigaHari();
  window.addEventListener("resize", function () { if (tigaHari() !== modeTiga) { modeTiga = tigaHari(); render(); } });
  window.__kk = { linkGoogle: linkGoogle, buatIcs: buatIcs }; // untuk uji otomatis
  daftarSW();
  // detik: hitung mundur; 30 detik: garis waktu & pengingat
  var menitLalu = Math.floor(menitKini());
  setInterval(function () {
    renderFokus();
    var m = Math.floor(menitKini());
    if (m !== menitLalu) {
      menitLalu = m;
      if (!seret && !$("dialog[open]")) { var g = $(".garis-kini"), p = D.pengaturan; if (g) { g.style.top = ((menitKini() - p.jamAwal * 60) / ((p.jamAkhir - p.jamAwal) * 60) * 100) + "%"; g.querySelector("span").textContent = jamTampil(m); } }
      if (S.tgl !== hariIni() && m === 0 && menitKini() < 1) render();
    }
  }, 1000);
  setInterval(cekPengingat, 20000);
  setTimeout(cekPengingat, 1500);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { cekPengingat(); renderFokus(); } });
})();

/* Logo & foto profil (fallback inisial bila gagal; foto unggahan disimpan dataURL kecil di localStorage) */
(function () {
  var K = window.KONFIG, KUNCI_FOTO = "kk_foto_profil";
  function $(i) { return document.getElementById(i); }
  function inisial() { var n = (window.TEMA && TEMA.nama) || "KK"; return n.split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
  var li = $("logo-img"), lt = $("logo-inisial");
  if (lt) lt.textContent = inisial();
  if (li) { li.onload = function () { li.hidden = false; lt.hidden = true; }; li.onerror = function () { li.hidden = true; lt.hidden = false; }; li.src = K.logo; }
  function foto() { try { return localStorage.getItem(KUNCI_FOTO) || K.profil; } catch (e) { return K.profil; } }
  function pasangFoto() {
    var src = foto();
    [$("avatar-img"), $("avatar-pratinjau")].forEach(function (im) { if (!im) return; im.onload = function () { im.hidden = false; }; im.onerror = function () { im.hidden = true; }; im.src = src; });
  }
  pasangFoto();
  var inp = $("unggah-profil");
  if (inp) inp.addEventListener("change", function () {
    var f = inp.files && inp.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var sk = Math.min(1, 400 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * sk); c.height = Math.round(im.height * sk);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        try { localStorage.setItem(KUNCI_FOTO, c.toDataURL("image/jpeg", 0.8)); } catch (e) { alert("Memori browser penuh, foto tidak tersimpan."); }
        pasangFoto(); inp.value = "";
      };
      im.src = r.result;
    };
    r.readAsDataURL(f);
  });
  var h = $("hapus-profil");
  if (h) h.addEventListener("click", function () { try { localStorage.removeItem(KUNCI_FOTO); } catch (e) {} pasangFoto(); });
  window.addEventListener("message", function (e) { if (e.data && e.data.tipe === "tema" && e.data.nama && lt) lt.textContent = inisial(); });
})();
