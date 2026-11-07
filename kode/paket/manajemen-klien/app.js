/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Manajemen Klien — CRM freelancer & agensi tanpa server.
   Semua data disimpan di localStorage (kunci "crm_data"). Dibuat oleh Maliki Studio. */
(function () {
  "use strict";

  // ================= util =================
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var KUNCI = "crm_data";
  var VERSI = 2;
  var DEMO = /[?&]demo\b/.test(location.search);
  var rp = function (n) { return "Rp" + Math.round(n || 0).toLocaleString("id-ID"); };
  var rpPendek = function (n) {
    n = n || 0;
    if (n >= 1e9) return "Rp" + (n / 1e9).toFixed(1).replace(".", ",") + " M";
    if (n >= 1e6) return "Rp" + (n / 1e6).toFixed(1).replace(".", ",").replace(",0", "") + " jt";
    if (n >= 1e3) return "Rp" + Math.round(n / 1e3) + " rb";
    return rp(n);
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var uid = function () { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3); };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var iso = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var HARI_INI = iso(new Date());
  var geser = function (hari) { var d = new Date(); d.setDate(d.getDate() + hari); return iso(d); };
  var BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  var BULAN_P = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  var tgl = function (s) { if (!s) return "-"; var p = s.split("-"); return +p[2] + " " + BULAN[+p[1] - 1] + " " + p[0]; };
  var selisihHari = function (s) { return Math.round((new Date(s + "T00:00") - new Date(HARI_INI + "T00:00")) / 864e5); };
  var relatif = function (s) {
    var h = selisihHari(s);
    if (h === 0) return "hari ini"; if (h === 1) return "besok"; if (h === -1) return "kemarin";
    return h > 0 ? h + " hari lagi" : -h + " hari lalu";
  };
  var WARNA_AV = ["#4f46e5", "#0f766e", "#b45309", "#be185d", "#1d4ed8", "#7c3aed", "#15803d", "#c2410c"];
  var warnaAv = function (s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return WARNA_AV[h % WARNA_AV.length]; };
  var inisial = function (s) { return (s || "?").split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); };
  var avatar = function (nama, besar) { return '<span class="avatar' + (besar ? " besar" : "") + '" style="--av:' + warnaAv(nama || "") + '" aria-hidden="true">' + esc(inisial(nama)) + "</span>"; };
  var ikon = function (n) { return '<svg aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var waNomor = function (no) { no = String(no || "").replace(/\D/g, ""); if (no[0] === "0") no = "62" + no.slice(1); return no; };
  var waLink = function (no, teks) { return "https://wa.me/" + waNomor(no) + "?text=" + encodeURIComponent(teks); };

  // ================= data contoh =================
  function dataContoh() {
    var K = [
      ["Kopi Senja Bandung", "Rina Marlina", "rina@kopisenja.id", "081234567801", "Instagram", ["F&B", "Retainer"], "Kedai kopi 3 cabang. Suka konsep visual hangat, keputusan cepat."],
      ["Batik Lestari Pekalongan", "Hj. Siti Aminah", "admin@batiklestari.co.id", "081234567802", "Referensi", ["Fashion", "Prioritas"], "Butuh katalog online & foto produk tiap musim."],
      ["Bengkel Jaya Motor", "Pak Darto", "jayamotor.smg@gmail.com", "081234567803", "Google", ["Otomotif"], "Lebih nyaman dihubungi lewat WA sore hari."],
      ["Klinik Gigi Senyum", "drg. Ayu Pratiwi", "halo@senyumdental.id", "081234567804", "Website", ["Kesehatan", "Retainer"], "Kontrak konten bulanan, approval via dr. Ayu."],
      ["Rumah Makan Padang Sederhana Jaya", "Uda Rizal", "rmsederhanajaya@gmail.com", "081234567805", "Pameran", ["F&B"], "Rencana buka cabang ke-4 tahun depan."],
      ["Toko Kue Bu Endang", "Endang Susilowati", "kuebuendang@gmail.com", "081234567806", "Instagram", ["F&B", "UMKM"], "Fokus pesanan hampers Lebaran & Natal."],
      ["CV Mitra Tani Nusantara", "Agus Setiawan", "agus@mitratani.co.id", "081234567807", "LinkedIn", ["Agrikultur"], "Perlu company profile + landing page distributor."],
      ["Laundry Kilat Bersih", "Mbak Yuni", "kilatbersih.laundry@gmail.com", "081234567808", "Referensi", ["Jasa", "UMKM"], "Anggaran terbatas, suka paket hemat."]
    ];
    var klien = K.map(function (k, i) {
      return { id: "k" + (i + 1), nama: k[0], kontak: k[1], email: k[2], wa: k[3], sumber: k[4], tag: k[5], catatan: k[6], alamat: "", dibuat: geser(-200 + i * 18), timeline: [] };
    });
    var tl = [
      ["k1", -60, "rapat", "Kickoff rebranding", "Sepakat palet terakota + krem."], ["k1", -21, "wa", "Kirim draf logo v2", "Rina minta opsi font lebih tebal."], ["k1", -3, "email", "Invoice retainer November terkirim", ""],
      ["k2", -40, "telepon", "Diskusi katalog musim hujan", "Butuh 120 foto produk."], ["k2", -9, "rapat", "Presentasi penawaran katalog", "Minta revisi harga paket foto."],
      ["k3", -15, "wa", "Tanya harga video promosi", "Lead dari Google Maps."], ["k4", -30, "rapat", "Review konten Oktober", "Engagement naik 34%."], ["k4", -2, "catatan", "Approval kalender konten Desember", ""],
      ["k5", -12, "telepon", "Minta penawaran menu board digital", ""], ["k6", -5, "wa", "Konsultasi desain kemasan hampers", "Deadline cetak 1 Desember."],
      ["k7", -25, "email", "Brief company profile diterima", ""], ["k8", -7, "wa", "Follow-up penawaran paket hemat", "Masih pikir-pikir."]
    ];
    tl.forEach(function (t) { var k = klien.find(function (x) { return x.id === t[0]; }); k.timeline.push({ id: uid(), tgl: geser(t[1]), jenis: t[2], judul: t[3], teks: t[4] }); });

    var deal = [
      ["Video promosi bengkel", "k3", 4500000, "lead", -14], ["Landing page distributor", "k7", 12000000, "lead", -6], ["Menu board digital 4 layar", "k5", 8500000, "penawaran", -10],
      ["Desain kemasan hampers", "k6", 3200000, "penawaran", -4], ["Katalog foto musim hujan", "k2", 18500000, "negosiasi", -9], ["Paket konten hemat 3 bulan", "k8", 4800000, "negosiasi", -7],
      ["Retainer konten 2027", "k4", 54000000, "deal", -3], ["Rebranding Kopi Senja", "k1", 27500000, "deal", -62], ["Website toko online", "k5", 15000000, "batal", -45]
    ].map(function (d, i) { return { id: "d" + (i + 1), judul: d[0], klienId: d[1], nilai: d[2], tahap: d[3], tgl: geser(d[4]), catatan: "" }; });

    var T = function (arr, n) { return arr.map(function (t, i) { return { id: uid(), teks: t, ok: i < n }; }); };
    var proyek = [
      { id: "p1", nama: "Rebranding Kopi Senja", klienId: "k1", status: "berjalan", mulai: geser(-58), tenggat: geser(9), nilai: 27500000, tugas: T(["Riset & moodboard", "Logo final", "Panduan brand (PDF)", "Desain kemasan cup", "Signage 3 cabang", "Serah terima file"], 3) },
      { id: "p2", nama: "Konten Instagram Klinik — Nov", klienId: "k4", status: "berjalan", mulai: geser(-6), tenggat: geser(24), nilai: 4500000, tugas: T(["Kalender konten", "12 desain feed", "4 reels edukasi", "Laporan insight"], 1) },
      { id: "p3", nama: "Katalog Batik Musim Kemarau", klienId: "k2", status: "review", mulai: geser(-45), tenggat: geser(2), nilai: 14000000, tugas: T(["Foto 100 produk", "Retouch", "Layout katalog", "Revisi klien"], 3) },
      { id: "p4", nama: "Desain Menu Rumah Makan", klienId: "k5", status: "selesai", mulai: geser(-90), tenggat: geser(-40), nilai: 3500000, tugas: T(["Foto menu", "Layout menu", "Cetak"], 3) },
      { id: "p5", nama: "Logo Laundry Kilat", klienId: "k8", status: "tertunda", mulai: geser(-20), tenggat: geser(-1), nilai: 1500000, tugas: T(["3 opsi logo", "Revisi", "File final"], 1) }
    ];

    var dok = [];
    var nomor = { invoice: 0, penawaran: 0 };
    function buat(jenis, klienId, hariTgl, item, opsi) {
      var d = new Date(); d.setDate(d.getDate() + hariTgl);
      nomor[jenis]++;
      var o = Object.assign({ id: uid(), jenis: jenis, nomor: (jenis === "invoice" ? "INV" : "PNW") + "/" + d.getFullYear() + "/" + pad(d.getMonth() + 1) + "/" + String(nomor[jenis]).padStart(3, "0"),
        klienId: klienId, tgl: iso(d), jatuhTempo: (function () { var x = new Date(d); x.setDate(x.getDate() + 14); return iso(x); })(),
        item: item.map(function (it) { return { nama: it[0], qty: it[1], harga: it[2] }; }), pajak: 11, diskon: 0, dp: 0, status: "terkirim", tglLunas: null, catatan: "" }, opsi || {});
      dok.push(o); return o;
    }
    // riwayat pembayaran 6 bulan untuk grafik
    var riwayat = [
      ["k1", -170, [["Desain feed bulanan", 1, 6500000]]], ["k4", -160, [["Retainer konten", 1, 4500000]]], ["k5", -150, [["Foto menu & layout", 1, 3500000]]],
      ["k4", -130, [["Retainer konten", 1, 4500000]]], ["k2", -125, [["Foto produk", 60, 85000]]], ["k6", -110, [["Desain label", 1, 2200000]]],
      ["k4", -100, [["Retainer konten", 1, 4500000]]], ["k7", -95, [["Konsultasi brand", 2, 1500000]]], ["k1", -75, [["Rebranding — DP 50%", 1, 13750000]]],
      ["k4", -70, [["Retainer konten", 1, 4500000]]], ["k2", -55, [["Katalog — termin 1", 1, 7000000]]], ["k4", -40, [["Retainer konten", 1, 4500000]]],
      ["k5", -38, [["Menu board cetak", 1, 3500000]]], ["k6", -30, [["Desain kemasan", 1, 2800000]]], ["k4", -8, [["Retainer konten November", 1, 4500000]]],
      ["k2", -6, [["Katalog — termin 2", 1, 7000000]]]
    ];
    riwayat.forEach(function (r) { var o = buat("invoice", r[0], r[1], r[2], { status: "lunas" }); o.tglLunas = geser(r[1] + 5 > 0 ? 0 : r[1] + 5); });
    buat("invoice", "k1", -3, [["Rebranding — pelunasan", 1, 13750000]], { status: "terkirim" });
    buat("invoice", "k8", -24, [["Logo Laundry — DP", 1, 750000]], { status: "terkirim", pajak: 0 });
    buat("invoice", "k3", -30, [["Foto produk sparepart", 40, 50000], ["Editing", 1, 500000]], { status: "terkirim" });
    buat("invoice", "k6", -1, [["Desain kemasan hampers", 1, 3200000], ["Mockup 3D", 3, 250000]], { status: "draft", diskon: 200000 });
    buat("penawaran", "k2", -9, [["Foto produk katalog", 120, 95000], ["Retouch & layout", 1, 4500000], ["Cetak 200 eksemplar", 200, 35000]], { status: "terkirim", diskon: 500000 });
    buat("penawaran", "k5", -10, [["Menu board digital (desain)", 4, 1500000], ["Animasi menu", 4, 500000], ["Instalasi", 1, 500000]], { status: "terkirim", pajak: 0 });

    var pengingat = [
      { id: uid(), klienId: "k2", tgl: HARI_INI, teks: "Tanyakan keputusan revisi harga katalog", selesai: false },
      { id: uid(), klienId: "k8", tgl: HARI_INI, teks: "Follow-up paket konten hemat", selesai: false },
      { id: uid(), klienId: "k1", tgl: geser(-1), teks: "Ingatkan pelunasan invoice rebranding", selesai: false },
      { id: uid(), klienId: "k3", tgl: geser(2), teks: "Kirim contoh video bengkel lain", selesai: false },
      { id: uid(), klienId: "k7", tgl: geser(5), teks: "Jadwalkan presentasi landing page", selesai: false },
      { id: uid(), klienId: "k6", tgl: geser(8), teks: "Konfirmasi jumlah cetak hampers", selesai: false },
      { id: uid(), klienId: "k4", tgl: geser(-4), teks: "Kirim laporan insight Oktober", selesai: true }
    ];
    return {
      versi: VERSI, klien: klien, deal: deal, proyek: proyek, dok: dok, pengingat: pengingat,
      pengaturan: { pin: "1234", alamat: "Jl. Braga No. 21, Bandung 40111", email: "halo@rakitkreatif.id", wa: "081200001111", rekening: "BCA 123-456-7890 a.n. Studio Rakit Kreatif", pajak: 11, catatanInvoice: "Pembayaran via transfer. Terima kasih atas kepercayaannya!" }
    };
  }

  // ================= penyimpanan =================
  var D;
  function muat() {
    var raw = null;
    try { raw = localStorage.getItem(KUNCI); } catch (e) {}
    if (DEMO || !raw) { D = dataContoh(); simpan(); return; }
    try { D = JSON.parse(raw); } catch (e) { D = dataContoh(); }
    migrasi();
  }
  function migrasi() {
    // tambah field baru di sini bila skema berubah, jangan hapus data lama
    var c = dataContoh();
    ["klien", "deal", "proyek", "dok", "pengingat"].forEach(function (k) { if (!Array.isArray(D[k])) D[k] = []; });
    D.pengaturan = Object.assign({}, c.pengaturan, D.pengaturan || {});
    D.klien.forEach(function (k) { if (!k.timeline) k.timeline = []; if (!k.tag) k.tag = []; });
    D.versi = VERSI; simpan();
  }
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) {} }

  var klienById = function (id) { return D.klien.find(function (k) { return k.id === id; }) || { nama: "(klien terhapus)", kontak: "", wa: "", email: "" }; };
  function hitung(d) {
    var sub = d.item.reduce(function (s, it) { return s + (+it.qty || 0) * (+it.harga || 0); }, 0);
    var setelahDiskon = Math.max(0, sub - (+d.diskon || 0));
    var pajak = Math.round(setelahDiskon * (+d.pajak || 0) / 100);
    var total = setelahDiskon + pajak;
    return { sub: sub, diskon: +d.diskon || 0, pajak: pajak, total: total, dp: +d.dp || 0, sisa: Math.max(0, total - (+d.dp || 0)) };
  }
  function statusDok(d) {
    if (d.jenis === "invoice" && d.status === "terkirim" && d.jatuhTempo < HARI_INI) return "telat";
    return d.status;
  }
  var STATUS = { draft: ["Draft", "abu"], terkirim: ["Terkirim", "biru"], lunas: ["Lunas", "hijau"], telat: ["Telat", "merah"], diterima: ["Diterima", "hijau"], ditolak: ["Ditolak", "merah"] };
  var chipStatus = function (s) { var x = STATUS[s] || [s, "abu"]; return '<span class="chip ' + x[1] + '">' + x[0] + "</span>"; };
  var TAHAP = [
    { id: "lead", nama: "Lead", warna: "#64748b" }, { id: "penawaran", nama: "Penawaran", warna: "#2563eb" },
    { id: "negosiasi", nama: "Negosiasi", warna: "#d97706" }, { id: "deal", nama: "Deal", warna: "#16a34a" }, { id: "batal", nama: "Batal", warna: "#dc2626" }
  ];
  var PSTATUS = { berjalan: ["Berjalan", "biru"], review: ["Review", "kuning"], selesai: ["Selesai", "hijau"], tertunda: ["Tertunda", "abu"] };
  var JENIS_TL = { rapat: ["Rapat", "#4f46e5"], wa: ["WhatsApp", "#16a34a"], telepon: ["Telepon", "#d97706"], email: ["Email", "#2563eb"], catatan: ["Catatan", "#64748b"] };
  var progres = function (p) { return p.tugas.length ? Math.round(p.tugas.filter(function (t) { return t.ok; }).length / p.tugas.length * 100) : (p.status === "selesai" ? 100 : 0); };
  var bulanKey = function (s) { return s ? s.slice(0, 7) : ""; };
  var pendapatanBulan = function (key) { return D.dok.filter(function (d) { return d.jenis === "invoice" && d.status === "lunas" && bulanKey(d.tglLunas) === key; }).reduce(function (s, d) { return s + hitung(d).total; }, 0); };

  // ================= toast =================
  function toast(pesan) {
    var t = document.createElement("div"); t.className = "toast"; t.innerHTML = ikon("check") + "<span>" + esc(pesan) + "</span>";
    $("#toasts").appendChild(t);
    setTimeout(function () { t.classList.add("pergi"); setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  // ================= modal =================
  var fokusSebelum = null;
  function bukaModal(judul, html, lebar) {
    fokusSebelum = document.activeElement;
    $("#modal-judul").textContent = judul;
    $("#modal-isi").innerHTML = html;
    var m = $("#modal"); m.hidden = false; m.classList.remove("keluar");
    $(".modal", m).classList.toggle("lebar", !!lebar);
    setTimeout(function () { var f = $("input, select, textarea, button:not([data-tutup])", $("#modal-isi")); if (f) f.focus(); }, 60);
  }
  function tutupLapis(el, cb) {
    if (el.hidden) return;
    el.classList.add("keluar");
    setTimeout(function () { el.hidden = true; el.classList.remove("keluar"); if (cb) cb(); if (fokusSebelum && fokusSebelum.focus) fokusSebelum.focus(); }, 190);
  }
  var tutupModal = function () { tutupLapis($("#modal")); };
  $("#modal").addEventListener("click", function (e) { if (e.target.id === "modal" || e.target.closest("[data-tutup]")) tutupModal(); });
  function jebakFokus(e, wadah) {
    if (e.key !== "Tab") return;
    var f = $$("a[href], button:not([disabled]), input, select, textarea", wadah).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  $("#modal").addEventListener("keydown", function (e) { jebakFokus(e, $("#modal")); });
  function konfirmasi(pesan, ya) {
    bukaModal("Yakin?", '<p>' + esc(pesan) + '</p><div class="form-aksi"><button class="btn-garis" data-tutup>Batal</button><button class="btn-bahaya" id="ya">Ya, hapus</button></div>');
    $("#ya").onclick = function () { tutupModal(); ya(); };
  }
  var opsi = function (arr, pilih) { return arr.map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '"' + (String(v) === String(pilih) ? " selected" : "") + ">" + esc(l) + "</option>"; }).join(""); };
  var opsiKlien = function (pilih) { return opsi(D.klien.map(function (k) { return [k.id, k.nama]; }), pilih); };
  var isian = function (label, input, lebar) { return '<div class="isian' + (lebar ? " lebar" : "") + '"><label>' + label + "</label>" + input + "</div>"; };
  // pasang label for otomatis
  function rapikanLabel(wadah) { $$(".isian", wadah).forEach(function (s, i) { var l = $("label", s), inp = $("input, select, textarea", s); if (l && inp) { if (!inp.id) inp.id = "f" + i + uid(); l.htmlFor = inp.id; } }); }

  // ================= routing =================
  var HALAMAN = {};
  var rute = { nama: "dashboard", arg: null };
  function bacaHash() {
    var h = (location.hash || "#dashboard").slice(1).split("/");
    rute = { nama: HALAMAN[h[0]] ? h[0] : "dashboard", arg: h[1] || null };
  }
  function render(tanpaAnimasi) {
    bacaHash();
    var u = $("#utama");
    u.innerHTML = '<div class="hal">' + HALAMAN[rute.nama](rute.arg) + "</div>";
    if (tanpaAnimasi) $(".hal", u).style.animation = "none";
    $$("[data-nav]").forEach(function (a) { var on = a.dataset.nav === rute.nama; a.classList.toggle("aktif", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var fu = D.pengingat.filter(function (p) { return !p.selesai && p.tgl <= HARI_INI; }).length;
    var b = $("#badge-fu"); b.hidden = !fu; b.textContent = fu;
    rapikanLabel(u);
    if (PASANG[rute.nama]) PASANG[rute.nama](rute.arg);
    tandaiBagian(u);
    requestAnimationFrame(function () { $$(".bar > i[data-w]", u).forEach(function (i) { i.style.width = i.dataset.w + "%"; }); });
    tampilkanNama();
  }
  var PASANG = {};
  window.addEventListener("hashchange", function () { render(); $("#utama").focus({ preventScroll: true }); window.scrollTo(0, 0); tutupMenuHP(); });

  // ================= DASHBOARD =================
  HALAMAN.dashboard = function () {
    var now = new Date(), key = HARI_INI.slice(0, 7);
    var lalu = new Date(now.getFullYear(), now.getMonth() - 1, 1), keyLalu = iso(lalu).slice(0, 7);
    var pend = pendapatanBulan(key), pendLalu = pendapatanBulan(keyLalu);
    var naik = pendLalu ? Math.round((pend - pendLalu) / pendLalu * 100) : 0;
    var belum = D.dok.filter(function (d) { return d.jenis === "invoice" && (d.status === "terkirim"); });
    var totBelum = belum.reduce(function (s, d) { return s + hitung(d).sisa; }, 0);
    var telat = belum.filter(function (d) { return statusDok(d) === "telat"; }).length;
    var aktif = D.proyek.filter(function (p) { return p.status === "berjalan" || p.status === "review"; });
    var fu = D.pengingat.filter(function (p) { return !p.selesai && p.tgl <= HARI_INI; }).sort(function (a, b) { return a.tgl < b.tgl ? -1 : 1; });
    var pipa = D.deal.filter(function (d) { return ["lead", "penawaran", "negosiasi"].indexOf(d.tahap) >= 0; }).reduce(function (s, d) { return s + d.nilai; }, 0);
    var jam = now.getHours(), sapa = jam < 11 ? "Selamat pagi" : jam < 15 ? "Selamat siang" : jam < 18 ? "Selamat sore" : "Selamat malam";
    return '<div class="hal-kepala"><div><span class="sapa-tgl"><i></i>' + now.getDate() + " " + BULAN_P[now.getMonth()] + " " + now.getFullYear() + '</span><h1>' + sapa + ', <b data-tema-nama></b></h1><p>' + (fu.length ? fu.length + " follow-up menunggu hari ini" : "Tidak ada follow-up tertunda") + (telat ? " · " + telat + " invoice lewat jatuh tempo" : "") + '</p></div>' +
      '<div class="aksi"><a class="btn-garis" href="#laporan">' + ikon("chart") + 'Laporan</a><button class="btn" data-baru="invoice">' + ikon("plus") + 'Invoice baru</button></div></div>' +
      '<div class="stat-grid bertahap">' +
      '<div class="kartu stat sorot"><div class="label"><i>' + ikon("chart") + '</i>Pendapatan bulan ini</div><div class="nilai angka">' + rp(pend) + '</div><div class="ket">' + (pendLalu ? (naik >= 0 ? "▲ " : "▼ ") + Math.abs(naik) + "% dari bulan lalu" : "bulan lalu belum ada data") + "</div></div>" +
      '<a class="kartu stat" href="#invoice" style="text-decoration:none;color:inherit"><div class="label"><i>' + ikon("doc") + '</i>Belum dibayar</div><div class="nilai angka">' + rpPendek(totBelum) + '</div><div class="ket">' + belum.length + " invoice" + (telat ? ' · <b style="color:var(--merah)">' + telat + " telat</b>" : "") + "</div></a>" +
      '<a class="kartu stat" href="#proyek" style="text-decoration:none;color:inherit"><div class="label"><i>' + ikon("folder") + '</i>Proyek aktif</div><div class="nilai angka">' + aktif.length + '</div><div class="ket">pipeline terbuka ' + rpPendek(pipa) + "</div></a>" +
      '<a class="kartu stat" href="#pengingat" style="text-decoration:none;color:inherit"><div class="label"><i>' + ikon("bell") + '</i>Follow-up hari ini</div><div class="nilai angka">' + fu.length + '</div><div class="ket">' + (fu.length ? "termasuk yang terlewat" : "semua beres, mantap!") + "</div></a></div>" +
      '<div class="grid-2 bertahap"><section class="kartu"><h2>Follow-up perlu dikerjakan <a href="#pengingat">Lihat semua</a></h2>' + daftarFU(fu.slice(0, 5)) + "</section>" +
      '<section class="kartu"><h2>Pendapatan 6 bulan <a href="#laporan">Detail</a></h2><div class="grafik">' + grafikBatang(6) + "</div></section></div>" +
      '<div class="grid-2 bertahap"><section class="kartu"><h2>Proyek berjalan <a href="#proyek">Semua proyek</a></h2><ul class="daftar">' +
      (aktif.length ? aktif.map(function (p) { var pr = progres(p); return '<li><div class="isi"><b>' + esc(p.nama) + "</b><small>" + esc(klienById(p.klienId).nama) + " · tenggat " + relatif(p.tenggat) + '</small><div class="bar" style="margin-top:8px"><i data-w="' + pr + '"></i></div></div><b class="angka">' + pr + "%</b></li>"; }).join("") : '<li class="kosong">Belum ada proyek aktif</li>') +
      '</ul></section><section class="kartu"><h2>Invoice belum dibayar <a href="#invoice">Semua invoice</a></h2><ul class="daftar">' +
      (belum.length ? belum.map(function (d) { return '<li><div class="isi"><b>' + esc(klienById(d.klienId).nama) + "</b><small>" + esc(d.nomor) + " · jatuh tempo " + tgl(d.jatuhTempo) + "</small></div>" + chipStatus(statusDok(d)) + '<b class="angka">' + rpPendek(hitung(d).sisa) + "</b></li>"; }).join("") : '<li class="kosong">Semua invoice lunas</li>') + "</ul></section></div>";
  };
  function daftarFU(list) {
    if (!list.length) return '<div class="kosong">' + ikon("check") + "<p>Tidak ada follow-up tertunda.</p></div>";
    return '<ul class="daftar">' + list.map(function (p) {
      var k = klienById(p.klienId);
      return '<li>' + avatar(k.nama) + '<div class="isi"><b>' + esc(p.teks) + "</b><small>" + esc(k.nama) + " · " + (p.tgl < HARI_INI ? '<span style="color:var(--merah);font-weight:700">terlewat ' + relatif(p.tgl) + "</span>" : relatif(p.tgl)) + "</small></div>" +
        '<a class="ikon-btn kecil" style="color:var(--hijau)" target="_blank" rel="noopener" href="' + esc(waLink(k.wa, "Halo " + (k.kontak || k.nama) + ", saya dari " + window.TEMA.nama + ". " + p.teks + ". Terima kasih 🙏")) + '" aria-label="Kirim WhatsApp ke ' + esc(k.nama) + '">' + ikon("wa") + "</a>" +
        '<button class="ikon-btn kecil" data-fu-selesai="' + p.id + '" aria-label="Tandai selesai: ' + esc(p.teks) + '">' + ikon("check") + "</button></li>";
    }).join("") + "</ul>";
  }
  function grafikBatang(n) {
    var data = [], now = new Date();
    for (var i = n - 1; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth() - i, 1); var k = iso(d).slice(0, 7); data.push({ label: BULAN[d.getMonth()], nilai: pendapatanBulan(k), kini: i === 0 }); }
    var max = Math.max.apply(null, data.map(function (x) { return x.nilai; }).concat([1])) * 1.15;
    var W = 600, H = 240, kiri = 8, bawah = 26, lebarB = (W - kiri) / n;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Grafik pendapatan ' + n + ' bulan terakhir">';
    for (var g = 1; g <= 3; g++) { var y = (H - bawah) - (H - bawah - 20) * g / 3; s += '<line class="garis-bantu" x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>'; }
    data.forEach(function (x, i) {
      var h = (H - bawah - 20) * x.nilai / max, bx = kiri + i * lebarB + lebarB * .2, bw = lebarB * .6;
      s += '<rect class="batang' + (x.kini ? " kini" : "") + '" style="animation-delay:' + (i * 0.07) + 's" x="' + bx + '" y="' + (H - bawah - h) + '" width="' + bw + '" height="' + Math.max(h, 2) + '" rx="6"><title>' + x.label + ": " + rp(x.nilai) + "</title></rect>";
      s += '<text x="' + (bx + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + x.label + "</text>";
      if (x.nilai) s += '<text x="' + (bx + bw / 2) + '" y="' + (H - bawah - h - 6) + '" text-anchor="middle" style="font-weight:700;fill:var(--teks)">' + rpPendek(x.nilai).replace("Rp", "") + "</text>";
    });
    return s + "</svg>";
  }

  // ================= KLIEN =================
  var saringKlien = { q: "", tag: "" };
  HALAMAN.klien = function (id) {
    if (id) return detailKlien(id);
    var tags = []; D.klien.forEach(function (k) { k.tag.forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });
    return '<div class="hal-kepala"><div><h1>Klien</h1><p>' + D.klien.length + ' klien tersimpan</p></div><div class="aksi"><button class="btn-garis" id="ekspor-klien">' + ikon("down") + 'CSV</button><button class="btn" data-baru="klien">' + ikon("plus") + "Klien baru</button></div></div>" +
      '<div class="saring"><input class="input" id="cari-klien" style="max-width:300px" placeholder="Cari nama, kontak, email…" aria-label="Cari klien" value="' + esc(saringKlien.q) + '">' +
      '<div class="segmen" role="group" aria-label="Saring tag"><button data-tag="" aria-pressed="' + (!saringKlien.tag) + '">Semua</button>' + tags.map(function (t) { return '<button data-tag="' + esc(t) + '" aria-pressed="' + (saringKlien.tag === t) + '">' + esc(t) + "</button>"; }).join("") + "</div></div>" +
      '<div class="kartu" style="padding:6px 8px"><div class="tabel-wrap"><table class="tabel"><thead><tr><th>Klien</th><th class="sembunyi-hp">Sumber</th><th class="sembunyi-hp">Tag</th><th class="kanan-teks">Nilai lunas</th><th><span class="sr">Aksi</span></th></tr></thead><tbody id="tb-klien"></tbody></table></div></div>';
  };
  function isiTabelKlien() {
    var q = saringKlien.q.toLowerCase();
    var rows = D.klien.filter(function (k) { return (!saringKlien.tag || k.tag.indexOf(saringKlien.tag) >= 0) && (!q || (k.nama + " " + k.kontak + " " + k.email).toLowerCase().indexOf(q) >= 0); });
    $("#tb-klien").innerHTML = rows.length ? rows.map(function (k, i) {
      var nilai = D.dok.filter(function (d) { return d.klienId === k.id && d.jenis === "invoice" && d.status === "lunas"; }).reduce(function (s, d) { return s + hitung(d).total; }, 0);
      return '<tr class="klik" data-buka="#klien/' + k.id + '" style="animation:naik .4s ' + (i * .03) + 's both"><td><div style="display:flex;gap:12px;align-items:center">' + avatar(k.nama) + '<div><a href="#klien/' + k.id + '" style="font-weight:700;color:var(--teks);text-decoration:none">' + esc(k.nama) + '</a><div class="kecil redup">' + esc(k.kontak) + " · " + esc(k.wa) + '</div></div></div></td><td class="sembunyi-hp">' + esc(k.sumber) + '</td><td class="sembunyi-hp">' + k.tag.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + '</td><td class="kanan-teks angka"><b>' + rp(nilai) + '</b></td><td class="kanan-teks"><a class="ikon-btn kecil" style="color:var(--hijau)" target="_blank" rel="noopener" href="' + esc(waLink(k.wa, "Halo " + k.kontak + ", ")) + '" aria-label="WhatsApp ' + esc(k.nama) + '">' + ikon("wa") + "</a></td></tr>";
    }).join("") : '<tr><td colspan="5" class="kosong">Tidak ada klien yang cocok.</td></tr>';
  }
  PASANG.klien = function (id) {
    if (id) return pasangDetailKlien(id);
    isiTabelKlien();
    $("#cari-klien").addEventListener("input", function (e) { saringKlien.q = e.target.value; isiTabelKlien(); });
    $$("[data-tag]").forEach(function (b) { b.onclick = function () { saringKlien.tag = b.dataset.tag; $$("[data-tag]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); isiTabelKlien(); }; });
    $("#ekspor-klien").onclick = function () { unduhCSV("klien.csv", [["Nama", "Kontak", "Email", "WhatsApp", "Sumber", "Tag", "Catatan", "Dibuat"]].concat(D.klien.map(function (k) { return [k.nama, k.kontak, k.email, k.wa, k.sumber, k.tag.join("; "), k.catatan, k.dibuat]; }))); };
  };
  function detailKlien(id) {
    var k = D.klien.find(function (x) { return x.id === id; });
    if (!k) return '<div class="kosong"><p>Klien tidak ditemukan.</p><a href="#klien">Kembali</a></div>';
    var dok = D.dok.filter(function (d) { return d.klienId === id; });
    var proy = D.proyek.filter(function (p) { return p.klienId === id; });
    var deals = D.deal.filter(function (d) { return d.klienId === id; });
    var lunas = dok.filter(function (d) { return d.jenis === "invoice" && d.status === "lunas"; }).reduce(function (s, d) { return s + hitung(d).total; }, 0);
    var tl = k.timeline.slice().sort(function (a, b) { return a.tgl < b.tgl ? 1 : -1; });
    return '<a href="#klien" class="btn-hantu" style="margin:-8px 0 10px -12px">' + ikon("left") + "Semua klien</a>" +
      '<div class="hal-kepala"><div class="profil-kepala">' + avatar(k.nama, true) + '<div><h1>' + esc(k.nama) + '</h1><p>' + esc(k.kontak) + " · klien sejak " + tgl(k.dibuat) + '</p><div style="margin-top:6px">' + k.tag.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></div></div>" +
      '<div class="aksi"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + esc(waLink(k.wa, "Halo " + k.kontak + ", ")) + '">' + ikon("wa") + 'WhatsApp</a><a class="btn-garis" href="mailto:' + esc(k.email) + '">' + ikon("mail") + 'Email</a><button class="btn-garis" id="edit-klien">' + ikon("edit") + 'Ubah</button><button class="ikon-btn" id="hapus-klien" aria-label="Hapus klien">' + ikon("trash") + "</button></div></div>" +
      '<div class="dua-kolom bertahap"><div style="display:grid;gap:18px"><section class="kartu"><h2>Profil</h2><dl class="info-list"><dt>Kontak</dt><dd>' + esc(k.kontak) + "</dd><dt>WhatsApp</dt><dd>" + esc(k.wa) + "</dd><dt>Email</dt><dd>" + esc(k.email) + "</dd><dt>Sumber</dt><dd>" + esc(k.sumber) + "</dd>" + (k.alamat ? "<dt>Alamat</dt><dd>" + esc(k.alamat) + "</dd>" : "") + '<dt>Total lunas</dt><dd class="angka"><b>' + rp(lunas) + '</b></dd></dl>' + (k.catatan ? '<p class="peringatan" style="margin:14px 0 0;background:var(--utama-muda);color:var(--utama-teks)">' + esc(k.catatan) + "</p>" : "") + "</section>" +
      '<section class="kartu"><h2>Proyek & deal</h2><ul class="daftar">' + proy.map(function (p) { return '<li><div class="isi"><b>' + esc(p.nama) + "</b><small>" + progres(p) + "% · " + tgl(p.tenggat) + "</small></div>" + chipStatus2(PSTATUS[p.status]) + "</li>"; }).join("") +
      deals.map(function (d) { var t = TAHAP.find(function (x) { return x.id === d.tahap; }); return '<li><div class="isi"><b>' + esc(d.judul) + "</b><small>" + rp(d.nilai) + '</small></div><span class="chip abu">' + t.nama + "</span></li>"; }).join("") + (proy.length + deals.length ? "" : '<li class="kosong">Belum ada.</li>') + "</ul></section>" +
      '<section class="kartu"><h2>Dokumen</h2><ul class="daftar">' + (dok.length ? dok.map(function (d) { return '<li><div class="isi"><b>' + esc(d.nomor) + "</b><small>" + (d.jenis === "invoice" ? "Invoice" : "Penawaran") + " · " + tgl(d.tgl) + "</small></div>" + chipStatus(statusDok(d)) + '<button class="ikon-btn kecil" data-edit-dok="' + d.id + '" aria-label="Buka ' + esc(d.nomor) + '">' + ikon("right") + "</button></li>"; }).join("") : '<li class="kosong">Belum ada.</li>') + "</ul></section></div>" +
      '<section class="kartu"><h2>Riwayat interaksi</h2><form id="form-tl" class="form-grid" style="margin-bottom:22px">' +
      isian("Jenis", '<select class="input" name="jenis">' + opsi(Object.keys(JENIS_TL).map(function (j) { return [j, JENIS_TL[j][0]]; })) + "</select>") + isian("Tanggal", '<input class="input" type="date" name="tgl" value="' + HARI_INI + '" required>') +
      isian("Ringkasan", '<input class="input" name="judul" required placeholder="mis. Telepon bahas revisi logo">', true) + isian("Catatan (opsional)", '<input class="input" name="teks">', true) +
      '<div class="lebar" style="display:flex;justify-content:flex-end;gap:8px"><button class="btn-garis" type="button" data-baru="pengingat" data-klien="' + k.id + '">' + ikon("bell") + 'Pengingat</button><button class="btn" type="submit">' + ikon("plus") + "Catat interaksi</button></div></form>" +
      (tl.length ? '<ol class="timeline">' + tl.map(function (t, i) { var j = JENIS_TL[t.jenis] || JENIS_TL.catatan; return '<li style="--warna:' + j[1] + ";animation-delay:" + (i * .05) + 's"><b>' + esc(t.judul) + "</b><small>" + j[0] + " · " + tgl(t.tgl) + " (" + relatif(t.tgl) + ")</small>" + (t.teks ? "<p>" + esc(t.teks) + "</p>" : "") + "</li>"; }).join("") + "</ol>" : '<p class="kosong">Belum ada interaksi tercatat.</p>') + "</section></div>";
  }
  var chipStatus2 = function (x) { return '<span class="chip ' + x[1] + '">' + x[0] + "</span>"; };
  function pasangDetailKlien(id) {
    var k = D.klien.find(function (x) { return x.id === id; }); if (!k) return;
    $("#edit-klien").onclick = function () { formKlien(k); };
    $("#hapus-klien").onclick = function () { konfirmasi("Hapus klien " + k.nama + "? Dokumen & proyeknya tetap tersimpan.", function () { D.klien = D.klien.filter(function (x) { return x !== k; }); simpan(); toast("Klien dihapus"); location.hash = "#klien"; }); };
    $("#form-tl").onsubmit = function (e) {
      e.preventDefault(); var f = new FormData(e.target);
      k.timeline.push({ id: uid(), jenis: f.get("jenis"), tgl: f.get("tgl"), judul: f.get("judul"), teks: f.get("teks") });
      simpan(); toast("Interaksi dicatat"); render(true);
    };
  }
  function formKlien(k) {
    var baru = !k; k = k || { nama: "", kontak: "", email: "", wa: "", sumber: "Instagram", tag: [], catatan: "", alamat: "" };
    bukaModal(baru ? "Klien baru" : "Ubah klien", '<form id="f-klien" class="form-grid">' +
      isian("Nama usaha / klien", '<input class="input" name="nama" required value="' + esc(k.nama) + '">', true) +
      isian("Nama kontak", '<input class="input" name="kontak" value="' + esc(k.kontak) + '">') + isian("WhatsApp", '<input class="input" name="wa" inputmode="tel" placeholder="08…" value="' + esc(k.wa) + '">') +
      isian("Email", '<input class="input" type="email" name="email" value="' + esc(k.email) + '">') + isian("Sumber", '<select class="input" name="sumber">' + opsi(["Instagram", "TikTok", "Referensi", "Google", "Website", "LinkedIn", "Pameran", "Lainnya"], k.sumber) + "</select>") +
      isian("Tag (pisahkan koma)", '<input class="input" name="tag" value="' + esc(k.tag.join(", ")) + '">', true) + isian("Alamat", '<input class="input" name="alamat" value="' + esc(k.alamat || "") + '">', true) +
      isian("Catatan", '<textarea class="input" name="catatan">' + esc(k.catatan) + "</textarea>", true) +
      '<div class="form-aksi lebar"><button type="button" class="btn-garis" data-tutup>Batal</button><button class="btn" type="submit">Simpan</button></div></form>');
    rapikanLabel($("#modal-isi"));
    $("#f-klien").onsubmit = function (e) {
      e.preventDefault(); var f = new FormData(e.target);
      ["nama", "kontak", "email", "wa", "sumber", "alamat", "catatan"].forEach(function (x) { k[x] = (f.get(x) || "").trim(); });
      k.tag = f.get("tag").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
      if (baru) { k.id = uid(); k.dibuat = HARI_INI; k.timeline = [{ id: uid(), tgl: HARI_INI, jenis: "catatan", judul: "Klien ditambahkan", teks: "" }]; D.klien.unshift(k); }
      simpan(); tutupModal(); toast(baru ? "Klien ditambahkan" : "Klien diperbarui");
      if (baru) location.hash = "#klien/" + k.id; else render(true);
    };
  }

  // ================= PIPELINE =================
  HALAMAN.pipeline = function () {
    var terbuka = D.deal.filter(function (d) { return ["lead", "penawaran", "negosiasi"].indexOf(d.tahap) >= 0; });
    var menang = D.deal.filter(function (d) { return d.tahap === "deal"; }).length, kalah = D.deal.filter(function (d) { return d.tahap === "batal"; }).length;
    return '<div class="hal-kepala"><div><h1>Pipeline prospek</h1><p>Terbuka ' + rp(terbuka.reduce(function (s, d) { return s + d.nilai; }, 0)) + " · rasio menang " + (menang + kalah ? Math.round(menang / (menang + kalah) * 100) : 0) + '% · seret kartu atau pakai tombol panah</p></div><div class="aksi"><button class="btn" data-baru="deal">' + ikon("plus") + "Prospek baru</button></div></div>" +
      '<div class="kanban">' + TAHAP.map(function (t, ti) {
        var list = D.deal.filter(function (d) { return d.tahap === t.id; });
        return '<section class="kolom" data-tahap="' + t.id + '" style="--warna:' + t.warna + '" aria-label="Kolom ' + t.nama + '"><div class="kolom-kepala"><h3><i></i>' + t.nama + "</h3><span>" + list.length + '</span></div><div class="kolom-total angka">' + rp(list.reduce(function (s, d) { return s + d.nilai; }, 0)) + "</div>" +
          list.map(function (d, i) {
            return '<article class="deal" draggable="true" data-deal="' + d.id + '" tabindex="0" style="animation-delay:' + (ti * .05 + i * .04) + 's" aria-label="' + esc(d.judul) + ", " + rp(d.nilai) + ", tahap " + t.nama + '"><b>' + esc(d.judul) + "</b><small>" + esc(klienById(d.klienId).nama) + " · " + relatif(d.tgl) + '</small><div class="harga angka">' + rp(d.nilai) + '</div><div class="deal-aksi">' +
              (ti > 0 ? '<button class="ikon-btn kecil" data-pindah="' + d.id + '" data-arah="-1" aria-label="Pindah ke ' + TAHAP[ti - 1].nama + '">' + ikon("left") + "</button>" : "") +
              '<button class="ikon-btn kecil" data-ubah-deal="' + d.id + '" aria-label="Ubah ' + esc(d.judul) + '">' + ikon("edit") + "</button>" +
              (ti < TAHAP.length - 1 ? '<button class="ikon-btn kecil" data-pindah="' + d.id + '" data-arah="1" aria-label="Pindah ke ' + TAHAP[ti + 1].nama + '">' + ikon("right") + "</button>" : "") + "</div></article>";
          }).join("") + "</section>";
      }).join("") + "</div>";
  };
  function pindahDeal(id, tahap) {
    var d = D.deal.find(function (x) { return x.id === id; }); if (!d || d.tahap === tahap) return;
    d.tahap = tahap; d.tgl = HARI_INI;
    var t = TAHAP.find(function (x) { return x.id === tahap; });
    var k = D.klien.find(function (x) { return x.id === d.klienId; });
    if (k) k.timeline.push({ id: uid(), tgl: HARI_INI, jenis: "catatan", judul: "Deal “" + d.judul + "” pindah ke " + t.nama, teks: "" });
    simpan(); render(true); toast("Dipindah ke " + t.nama);
    var el = $('[data-deal="' + id + '"]'); if (el) el.focus();
  }
  PASANG.pipeline = function () {
    var seret = null;
    $$(".deal").forEach(function (el) {
      el.addEventListener("dragstart", function (e) { seret = el.dataset.deal; el.classList.add("diseret"); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", seret); } catch (x) {} });
      el.addEventListener("dragend", function () { el.classList.remove("diseret"); $$(".kolom").forEach(function (k) { k.classList.remove("sasaran"); }); });
      el.addEventListener("keydown", function (e) {
        var i = TAHAP.findIndex(function (t) { return t.id === el.closest(".kolom").dataset.tahap; });
        if (e.key === "ArrowRight" && i < TAHAP.length - 1) { e.preventDefault(); pindahDeal(el.dataset.deal, TAHAP[i + 1].id); }
        if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); pindahDeal(el.dataset.deal, TAHAP[i - 1].id); }
        if (e.key === "Enter" && e.target === el) formDeal(D.deal.find(function (x) { return x.id === el.dataset.deal; }));
      });
    });
    $$(".kolom").forEach(function (k) {
      k.addEventListener("dragover", function (e) { e.preventDefault(); k.classList.add("sasaran"); });
      k.addEventListener("dragleave", function (e) { if (!k.contains(e.relatedTarget)) k.classList.remove("sasaran"); });
      k.addEventListener("drop", function (e) { e.preventDefault(); k.classList.remove("sasaran"); if (seret) pindahDeal(seret, k.dataset.tahap); seret = null; });
    });
    $$("[data-pindah]").forEach(function (b) { b.onclick = function () { var d = D.deal.find(function (x) { return x.id === b.dataset.pindah; }); var i = TAHAP.findIndex(function (t) { return t.id === d.tahap; }); pindahDeal(d.id, TAHAP[i + +b.dataset.arah].id); }; });
    $$("[data-ubah-deal]").forEach(function (b) { b.onclick = function () { formDeal(D.deal.find(function (x) { return x.id === b.dataset.ubahDeal; })); }; });
  };
  function formDeal(d) {
    var baru = !d; d = d || { judul: "", klienId: (D.klien[0] || {}).id, nilai: 0, tahap: "lead", catatan: "" };
    bukaModal(baru ? "Prospek baru" : "Ubah prospek", '<form id="f-deal" class="form-grid">' + isian("Judul peluang", '<input class="input" name="judul" required value="' + esc(d.judul) + '">', true) +
      isian("Klien", '<select class="input" name="klienId">' + opsiKlien(d.klienId) + "</select>") + isian("Nilai (Rp)", '<input class="input" type="number" min="0" step="50000" name="nilai" value="' + d.nilai + '">') +
      isian("Tahap", '<select class="input" name="tahap">' + opsi(TAHAP.map(function (t) { return [t.id, t.nama]; }), d.tahap) + "</select>") + isian("Catatan", '<input class="input" name="catatan" value="' + esc(d.catatan || "") + '">') +
      '<div class="form-aksi lebar">' + (baru ? "" : '<button type="button" class="btn-bahaya kiri" id="hapus-deal">' + ikon("trash") + "Hapus</button>" + (d.tahap === "deal" ? '<button type="button" class="btn-garis" id="jadi-proyek">Jadikan proyek</button>' : "")) +
      '<button type="button" class="btn-garis" data-tutup>Batal</button><button class="btn" type="submit">Simpan</button></div></form>');
    rapikanLabel($("#modal-isi"));
    $("#f-deal").onsubmit = function (e) {
      e.preventDefault(); var f = new FormData(e.target);
      d.judul = f.get("judul"); d.klienId = f.get("klienId"); d.nilai = +f.get("nilai") || 0; d.tahap = f.get("tahap"); d.catatan = f.get("catatan"); d.tgl = d.tgl || HARI_INI;
      if (baru) { d.id = uid(); D.deal.push(d); }
      simpan(); tutupModal(); toast("Prospek disimpan"); if (rute.nama === "pipeline") render(true); else location.hash = "#pipeline";
    };
    if (!baru) {
      $("#hapus-deal").onclick = function () { D.deal = D.deal.filter(function (x) { return x !== d; }); simpan(); tutupModal(); toast("Prospek dihapus"); render(true); };
      var jp = $("#jadi-proyek"); if (jp) jp.onclick = function () { tutupModal(); setTimeout(function () { formProyek(null, { nama: d.judul, klienId: d.klienId, nilai: d.nilai }); }, 220); };
    }
  }

  // ================= PROYEK =================
  var saringProyek = "aktif";
  HALAMAN.proyek = function () {
    var list = D.proyek.filter(function (p) { return saringProyek === "semua" || (saringProyek === "aktif" ? p.status !== "selesai" : p.status === saringProyek); })
      .sort(function (a, b) { return a.tenggat < b.tenggat ? -1 : 1; });
    return '<div class="hal-kepala"><div><h1>Proyek</h1><p>' + D.proyek.filter(function (p) { return p.status !== "selesai"; }).length + ' proyek belum selesai</p></div><div class="aksi"><button class="btn" data-baru="proyek">' + ikon("plus") + "Proyek baru</button></div></div>" +
      '<div class="saring"><div class="segmen" role="group" aria-label="Saring status">' + [["aktif", "Aktif"], ["berjalan", "Berjalan"], ["review", "Review"], ["tertunda", "Tertunda"], ["selesai", "Selesai"], ["semua", "Semua"]].map(function (s) { return '<button data-sp="' + s[0] + '" aria-pressed="' + (saringProyek === s[0]) + '">' + s[1] + "</button>"; }).join("") + "</div></div>" +
      (list.length ? '<div class="proyek-grid bertahap">' + list.map(function (p) {
        var pr = progres(p), h = selisihHari(p.tenggat), telat = h < 0 && p.status !== "selesai";
        return '<article class="kartu proyek"><div class="meta-baris">' + chipStatus2(PSTATUS[p.status]) + '<span style="' + (telat ? "color:var(--merah);font-weight:700" : "") + '">' + ikon("cal").replace("<svg", '<svg style="width:15px;height:15px;vertical-align:-3px"') + " " + (p.status === "selesai" ? tgl(p.tenggat) : relatif(p.tenggat)) + "</span></div>" +
          "<div><h3>" + esc(p.nama) + '</h3><div class="kecil redup">' + esc(klienById(p.klienId).nama) + " · " + rp(p.nilai) + '</div></div><div><div class="meta-baris" style="margin-bottom:6px"><span>Progres</span><b class="angka">' + pr + '%</b></div><div class="bar"><i data-w="' + pr + '"></i></div></div>' +
          '<ul class="tugas">' + p.tugas.map(function (t) { return '<li><label><input type="checkbox" data-tugas="' + p.id + "|" + t.id + '"' + (t.ok ? " checked" : "") + "><span>" + esc(t.teks) + "</span></label></li>"; }).join("") + "</ul>" +
          '<form class="tambah-tugas" data-p="' + p.id + '" style="display:flex;gap:6px"><input class="input" name="t" placeholder="Tambah tugas…" aria-label="Tambah tugas untuk ' + esc(p.nama) + '" style="min-height:36px"><button class="ikon-btn" aria-label="Tambah tugas">' + ikon("plus") + "</button></form>" +
          '<div class="baris-aksi"><button class="btn-garis" data-ubah-proyek="' + p.id + '">' + ikon("edit") + 'Ubah</button><button class="btn-hantu" data-invoice-proyek="' + p.id + '">' + ikon("doc") + "Buat invoice</button></div></article>";
      }).join("") + "</div>" : '<div class="kartu kosong">' + ikon("folder") + "<p>Tidak ada proyek di filter ini.</p></div>");
  };
  PASANG.proyek = function () {
    $$("[data-sp]").forEach(function (b) { b.onclick = function () { saringProyek = b.dataset.sp; render(true); }; });
    $$("[data-tugas]").forEach(function (c) {
      c.onchange = function () {
        var a = c.dataset.tugas.split("|"), p = D.proyek.find(function (x) { return x.id === a[0]; }), t = p.tugas.find(function (x) { return x.id === a[1]; });
        t.ok = c.checked; simpan();
        var kartu = c.closest(".proyek"), pr = progres(p); $(".bar > i", kartu).style.width = pr + "%"; $(".meta-baris b", kartu).textContent = pr + "%";
        if (pr === 100 && c.checked) toast("Semua tugas beres! Tandai proyek selesai?");
      };
    });
    $$(".tambah-tugas").forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); var v = f.t.value.trim(); if (!v) return; D.proyek.find(function (x) { return x.id === f.dataset.p; }).tugas.push({ id: uid(), teks: v, ok: false }); simpan(); render(true); var nf = $('.tambah-tugas[data-p="' + f.dataset.p + '"] input'); if (nf) nf.focus(); }; });
    $$("[data-ubah-proyek]").forEach(function (b) { b.onclick = function () { formProyek(D.proyek.find(function (x) { return x.id === b.dataset.ubahProyek; })); }; });
    $$("[data-invoice-proyek]").forEach(function (b) { b.onclick = function () { var p = D.proyek.find(function (x) { return x.id === b.dataset.invoiceProyek; }); formDok(null, "invoice", { klienId: p.klienId, item: [{ nama: p.nama, qty: 1, harga: p.nilai }] }); }; });
  };
  function formProyek(p, awal) {
    var baru = !p; p = p || Object.assign({ nama: "", klienId: (D.klien[0] || {}).id, status: "berjalan", mulai: HARI_INI, tenggat: geser(30), nilai: 0, tugas: [] }, awal || {});
    bukaModal(baru ? "Proyek baru" : "Ubah proyek", '<form id="f-proyek" class="form-grid">' + isian("Nama proyek", '<input class="input" name="nama" required value="' + esc(p.nama) + '">', true) +
      isian("Klien", '<select class="input" name="klienId">' + opsiKlien(p.klienId) + "</select>") + isian("Status", '<select class="input" name="status">' + opsi(Object.keys(PSTATUS).map(function (s) { return [s, PSTATUS[s][0]]; }), p.status) + "</select>") +
      isian("Mulai", '<input class="input" type="date" name="mulai" value="' + p.mulai + '">') + isian("Tenggat", '<input class="input" type="date" name="tenggat" required value="' + p.tenggat + '">') +
      isian("Nilai proyek (Rp)", '<input class="input" type="number" min="0" step="50000" name="nilai" value="' + p.nilai + '">', true) +
      (baru ? isian("Tugas awal (satu per baris)", '<textarea class="input" name="tugas" placeholder="Brief&#10;Desain&#10;Revisi&#10;Serah terima"></textarea>', true) : "") +
      '<div class="form-aksi lebar">' + (baru ? "" : '<button type="button" class="btn-bahaya kiri" id="hapus-proyek">' + ikon("trash") + "Hapus</button>") + '<button type="button" class="btn-garis" data-tutup>Batal</button><button class="btn" type="submit">Simpan</button></div></form>');
    rapikanLabel($("#modal-isi"));
    $("#f-proyek").onsubmit = function (e) {
      e.preventDefault(); var f = new FormData(e.target);
      ["nama", "klienId", "status", "mulai", "tenggat"].forEach(function (x) { p[x] = f.get(x); }); p.nilai = +f.get("nilai") || 0;
      if (baru) { p.id = uid(); p.tugas = (f.get("tugas") || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) { return { id: uid(), teks: s, ok: false }; }); D.proyek.push(p); }
      simpan(); tutupModal(); toast("Proyek disimpan"); if (rute.nama === "proyek") render(true); else location.hash = "#proyek";
    };
    if (!baru) $("#hapus-proyek").onclick = function () { D.proyek = D.proyek.filter(function (x) { return x !== p; }); simpan(); tutupModal(); toast("Proyek dihapus"); render(true); };
  }

  // ================= INVOICE & PENAWARAN =================
  var saringDok = { jenis: "invoice", status: "semua" };
  HALAMAN.invoice = function () {
    var list = D.dok.filter(function (d) { return d.jenis === saringDok.jenis && (saringDok.status === "semua" || statusDok(d) === saringDok.status); })
      .sort(function (a, b) { return a.tgl < b.tgl ? 1 : -1; });
    var stat = saringDok.jenis === "invoice" ? ["semua", "draft", "terkirim", "telat", "lunas"] : ["semua", "draft", "terkirim", "diterima", "ditolak"];
    return '<div class="hal-kepala"><div><h1>Invoice & penawaran</h1><p>Nomor otomatis, pajak, diskon, DP, cetak A4 & kirim WA</p></div><div class="aksi"><button class="btn-garis" id="ekspor-dok">' + ikon("down") + 'CSV</button><button class="btn" data-baru="' + saringDok.jenis + '">' + ikon("plus") + (saringDok.jenis === "invoice" ? "Invoice" : "Penawaran") + " baru</button></div></div>" +
      '<div class="saring"><div class="segmen" role="group" aria-label="Jenis dokumen"><button data-jenis="invoice" aria-pressed="' + (saringDok.jenis === "invoice") + '">Invoice</button><button data-jenis="penawaran" aria-pressed="' + (saringDok.jenis === "penawaran") + '">Penawaran</button></div>' +
      '<div class="segmen" role="group" aria-label="Status">' + stat.map(function (s) { return '<button data-sd="' + s + '" aria-pressed="' + (saringDok.status === s) + '">' + (s === "semua" ? "Semua" : STATUS[s][0]) + "</button>"; }).join("") + "</div></div>" +
      '<div class="kartu" style="padding:6px 8px"><div class="tabel-wrap"><table class="tabel"><thead><tr><th>Nomor</th><th>Klien</th><th class="sembunyi-hp">Tanggal</th><th class="sembunyi-hp">Jatuh tempo</th><th>Status</th><th class="kanan-teks">Total</th></tr></thead><tbody>' +
      (list.length ? list.map(function (d, i) { var h = hitung(d); return '<tr class="klik" data-edit-dok="' + d.id + '" style="animation:naik .4s ' + (i * .03) + 's both"><td><button class="btn-hantu" style="padding:0;min-height:0;font-weight:700;color:var(--teks)" data-edit-dok="' + d.id + '">' + esc(d.nomor) + "</button></td><td>" + esc(klienById(d.klienId).nama) + '</td><td class="sembunyi-hp">' + tgl(d.tgl) + '</td><td class="sembunyi-hp">' + tgl(d.jatuhTempo) + "</td><td>" + chipStatus(statusDok(d)) + '</td><td class="kanan-teks angka"><b>' + rp(h.total) + "</b>" + (h.dp && d.status !== "lunas" ? '<div class="kecil redup">sisa ' + rp(h.sisa) + "</div>" : "") + "</td></tr>"; }).join("") : '<tr><td colspan="6" class="kosong">Belum ada dokumen.</td></tr>') +
      "</tbody></table></div></div>";
  };
  PASANG.invoice = function () {
    $$("[data-jenis]").forEach(function (b) { b.onclick = function () { saringDok.jenis = b.dataset.jenis; saringDok.status = "semua"; render(true); }; });
    $$("[data-sd]").forEach(function (b) { b.onclick = function () { saringDok.status = b.dataset.sd; render(true); }; });
    $("#ekspor-dok").onclick = function () {
      unduhCSV(saringDok.jenis + ".csv", [["Nomor", "Jenis", "Klien", "Tanggal", "Jatuh tempo", "Status", "Subtotal", "Diskon", "Pajak", "Total", "DP", "Sisa", "Tanggal lunas"]].concat(D.dok.filter(function (d) { return d.jenis === saringDok.jenis; }).map(function (d) { var h = hitung(d); return [d.nomor, d.jenis, klienById(d.klienId).nama, d.tgl, d.jatuhTempo, statusDok(d), h.sub, h.diskon, h.pajak, h.total, h.dp, h.sisa, d.tglLunas || ""]; })));
    };
  };
  function nomorBaru(jenis, tanggal) {
    var pre = (jenis === "invoice" ? "INV" : "PNW") + "/" + tanggal.slice(0, 4) + "/" + tanggal.slice(5, 7) + "/";
    var max = 0; D.dok.forEach(function (d) { if (d.jenis === jenis && d.nomor.indexOf(tanggal.slice(0, 4)) >= 0) { var n = parseInt(d.nomor.split("/").pop(), 10); if (n > max) max = n; } });
    return pre + String(max + 1).padStart(3, "0");
  }
  function formDok(d, jenis, awal) {
    var baru = !d;
    if (baru) { jenis = jenis || "invoice"; d = Object.assign({ jenis: jenis, klienId: (D.klien[0] || {}).id, tgl: HARI_INI, jatuhTempo: geser(14), item: [{ nama: "", qty: 1, harga: 0 }], pajak: D.pengaturan.pajak, diskon: 0, dp: 0, status: "draft", catatan: D.pengaturan.catatanInvoice }, awal || {}); d.nomor = nomorBaru(d.jenis, d.tgl); }
    var kerja = JSON.parse(JSON.stringify(d));
    var opsiStatus = kerja.jenis === "invoice" ? [["draft", "Draft"], ["terkirim", "Terkirim"], ["lunas", "Lunas"]] : [["draft", "Draft"], ["terkirim", "Terkirim"], ["diterima", "Diterima"], ["ditolak", "Ditolak"]];
    bukaModal((baru ? (kerja.jenis === "invoice" ? "Invoice baru" : "Penawaran baru") : kerja.nomor), '<form id="f-dok"><div class="form-grid">' +
      isian("Nomor", '<input class="input" name="nomor" required value="' + esc(kerja.nomor) + '">') + isian("Klien", '<select class="input" name="klienId">' + opsiKlien(kerja.klienId) + "</select>") +
      isian("Tanggal", '<input class="input" type="date" name="tgl" value="' + kerja.tgl + '">') + isian(kerja.jenis === "invoice" ? "Jatuh tempo" : "Berlaku sampai", '<input class="input" type="date" name="jatuhTempo" value="' + kerja.jatuhTempo + '">') +
      '</div><h3 style="font-size:14px;margin:22px 0 10px">Item</h3><div id="item-wadah"></div><button type="button" class="btn-hantu" id="tambah-item">' + ikon("plus") + "Tambah item</button>" +
      '<div class="form-grid" style="margin-top:14px;grid-template-columns:repeat(3,1fr)">' + isian("Pajak/PPN (%)", '<input class="input" type="number" min="0" max="100" step="0.5" name="pajak" value="' + kerja.pajak + '">') +
      isian("Diskon (Rp)", '<input class="input" type="number" min="0" step="10000" name="diskon" value="' + kerja.diskon + '">') + isian("DP dibayar (Rp)", '<input class="input" type="number" min="0" step="10000" name="dp" value="' + kerja.dp + '">') + "</div>" +
      '<div class="ringkas-total angka" id="ringkas"></div>' +
      '<div class="form-grid" style="margin-top:14px">' + isian("Status", '<select class="input" name="status">' + opsi(opsiStatus, kerja.status) + "</select>") + isian("Catatan di dokumen", '<input class="input" name="catatan" value="' + esc(kerja.catatan || "") + '">') + "</div>" +
      '<div class="form-aksi">' + (baru ? "" : '<button type="button" class="btn-bahaya kiri" id="hapus-dok" aria-label="Hapus dokumen">' + ikon("trash") + "</button>") +
      '<button type="button" class="btn-garis" id="cetak-dok">' + ikon("print") + 'Cetak / PDF</button><button type="button" class="btn-garis" id="email-dok">' + ikon("mail") + 'Email</button><button type="button" class="btn btn-wa" id="wa-dok">' + ikon("wa") + "WA</button>" +
      (kerja.jenis === "penawaran" && !baru ? '<button type="button" class="btn-garis" id="jadi-invoice">Jadikan invoice</button>' : "") +
      '<button class="btn" type="submit">Simpan</button></div></form>', true);
    rapikanLabel($("#modal-isi"));
    var form = $("#f-dok");
    function gambarItem() {
      $("#item-wadah").innerHTML = kerja.item.map(function (it, i) {
        return '<div class="item-baris"><input class="input" data-i="' + i + '" data-k="nama" placeholder="Deskripsi pekerjaan" aria-label="Deskripsi item ' + (i + 1) + '" value="' + esc(it.nama) + '"><input class="input" type="number" min="0" data-i="' + i + '" data-k="qty" aria-label="Jumlah item ' + (i + 1) + '" value="' + it.qty + '"><input class="input" type="number" min="0" step="1000" data-i="' + i + '" data-k="harga" aria-label="Harga satuan item ' + (i + 1) + '" value="' + it.harga + '"><b class="angka item-sub kanan-teks">' + rp(it.qty * it.harga) + '</b><button type="button" class="ikon-btn kecil" data-hapus-item="' + i + '" aria-label="Hapus item ' + (i + 1) + '">' + ikon("x") + "</button></div>";
      }).join("");
    }
    function bacaForm() { var f = new FormData(form); ["nomor", "klienId", "tgl", "jatuhTempo", "status", "catatan"].forEach(function (x) { kerja[x] = f.get(x); }); ["pajak", "diskon", "dp"].forEach(function (x) { kerja[x] = +f.get(x) || 0; }); }
    function ringkas() {
      bacaForm(); var h = hitung(kerja);
      $("#ringkas").innerHTML = "<span>Subtotal</span><span>" + rp(h.sub) + "</span>" + (h.diskon ? "<span>Diskon</span><span>−" + rp(h.diskon) + "</span>" : "") + "<span>PPN " + kerja.pajak + "%</span><span>" + rp(h.pajak) + '</span><span class="besar">Total</span><span class="besar">' + rp(h.total) + "</span>" + (h.dp ? "<span>DP</span><span>−" + rp(h.dp) + '</span><span><b>Sisa tagihan</b></span><span><b>' + rp(h.sisa) + "</b></span>" : "");
    }
    gambarItem(); ringkas();
    form.addEventListener("input", function (e) {
      var t = e.target; if (t.dataset.i != null) { var it = kerja.item[+t.dataset.i]; it[t.dataset.k] = t.dataset.k === "nama" ? t.value : +t.value || 0; t.parentNode.querySelector(".item-sub").textContent = rp(it.qty * it.harga); }
      ringkas();
    });
    form.addEventListener("click", function (e) { var b = e.target.closest("[data-hapus-item]"); if (b) { kerja.item.splice(+b.dataset.hapusItem, 1); if (!kerja.item.length) kerja.item.push({ nama: "", qty: 1, harga: 0 }); gambarItem(); ringkas(); } });
    $("#tambah-item").onclick = function () { kerja.item.push({ nama: "", qty: 1, harga: 0 }); gambarItem(); var x = $$('#item-wadah [data-k="nama"]'); x[x.length - 1].focus(); };
    function simpanDok(diam) {
      bacaForm(); kerja.item = kerja.item.filter(function (it) { return it.nama || it.harga; }); if (!kerja.item.length) kerja.item.push({ nama: "", qty: 1, harga: 0 });
      if (kerja.status === "lunas" && !kerja.tglLunas) kerja.tglLunas = HARI_INI;
      if (kerja.status !== "lunas") kerja.tglLunas = null;
      Object.assign(d, kerja);
      if (baru) { d.id = uid(); D.dok.push(d); baru = false; var k = D.klien.find(function (x) { return x.id === d.klienId; }); if (k) k.timeline.push({ id: uid(), tgl: HARI_INI, jenis: "catatan", judul: (d.jenis === "invoice" ? "Invoice " : "Penawaran ") + d.nomor + " dibuat", teks: rp(hitung(d).total) }); }
      simpan(); if (!diam) toast("Dokumen disimpan");
    }
    form.onsubmit = function (e) { e.preventDefault(); simpanDok(); tutupModal(); saringDok.jenis = d.jenis; if (rute.nama === "invoice") render(true); else location.hash = "#invoice"; };
    $("#cetak-dok").onclick = function () { simpanDok(true); cetak(d); };
    $("#wa-dok").onclick = function () {
      simpanDok(true); var k = klienById(d.klienId), h = hitung(d);
      var teks = "Halo " + (k.kontak || k.nama) + ",\n\nBerikut " + (d.jenis === "invoice" ? "invoice" : "penawaran") + " dari *" + window.TEMA.nama + "*:\n\n*No:* " + d.nomor + "\n" + d.item.map(function (it) { return "• " + it.nama + " (" + it.qty + " × " + rp(it.harga) + ")"; }).join("\n") +
        "\n\n*Total: " + rp(h.total) + "*" + (h.dp ? "\nDP: " + rp(h.dp) + "\n*Sisa: " + rp(h.sisa) + "*" : "") + (d.jenis === "invoice" ? "\nJatuh tempo: " + tgl(d.jatuhTempo) + "\n\nTransfer ke: " + D.pengaturan.rekening : "\nBerlaku sampai: " + tgl(d.jatuhTempo)) + "\n\nTerima kasih 🙏";
      if (d.status === "draft") { d.status = "terkirim"; simpan(); }
      window.open(waLink(k.wa, teks), "_blank", "noopener");
    };
    $("#email-dok").onclick = function () {
      simpanDok(true); var k = klienById(d.klienId), h = hitung(d);
      var subj = (d.jenis === "invoice" ? "Invoice " : "Penawaran ") + d.nomor + " — " + window.TEMA.nama;
      var body = "Halo " + (k.kontak || k.nama) + ",\n\nTerlampir " + (d.jenis === "invoice" ? "invoice" : "penawaran") + " " + d.nomor + " senilai " + rp(h.total) + ".\n" + (d.jenis === "invoice" ? "Jatuh tempo: " + tgl(d.jatuhTempo) + "\nPembayaran: " + D.pengaturan.rekening + "\n" : "") + "\nSalam,\n" + window.TEMA.nama;
      location.href = "mailto:" + encodeURIComponent(k.email || "") + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
    };
    var jd = $("#jadi-invoice"); if (jd) jd.onclick = function () { simpanDok(true); d.status = "diterima"; simpan(); tutupModal(); setTimeout(function () { formDok(null, "invoice", { klienId: d.klienId, item: JSON.parse(JSON.stringify(d.item)), diskon: d.diskon, pajak: d.pajak }); }, 220); };
    var hd = $("#hapus-dok"); if (hd) hd.onclick = function () { konfirmasi("Hapus " + d.nomor + "?", function () { D.dok = D.dok.filter(function (x) { return x !== d; }); simpan(); toast("Dokumen dihapus"); render(true); }); };
  }
  function cetak(d) {
    var k = klienById(d.klienId), h = hitung(d), P = D.pengaturan, inv = d.jenis === "invoice";
    $("#cetak").innerHTML = '<div class="dok"><div class="dok-kepala"><div><h2 style="font-size:20px">' + esc(window.TEMA.nama) + "</h2><div>" + esc(P.alamat) + "<br>" + esc(P.email) + " · " + esc(P.wa) + '</div></div><div style="text-align:right"><h1>' + (inv ? "INVOICE" : "PENAWARAN") + "</h1><div><b>" + esc(d.nomor) + "</b></div><div>Tanggal: " + tgl(d.tgl) + "</div><div>" + (inv ? "Jatuh tempo: " : "Berlaku s.d.: ") + tgl(d.jatuhTempo) + "</div></div></div>" +
      "<div><small>Kepada</small><br><b>" + esc(k.nama) + "</b><br>" + esc(k.kontak) + "<br>" + esc(k.email) + " · " + esc(k.wa) + "</div>" +
      '<table><thead><tr><th>Deskripsi</th><th style="text-align:right">Qty</th><th style="text-align:right">Harga</th><th style="text-align:right">Jumlah</th></tr></thead><tbody>' + d.item.map(function (it) { return "<tr><td>" + esc(it.nama) + '</td><td style="text-align:right">' + it.qty + '</td><td style="text-align:right">' + rp(it.harga) + '</td><td style="text-align:right">' + rp(it.qty * it.harga) + "</td></tr>"; }).join("") + "</tbody></table>" +
      '<div class="tot"><div><span>Subtotal</span><span>' + rp(h.sub) + "</span></div>" + (h.diskon ? "<div><span>Diskon</span><span>−" + rp(h.diskon) + "</span></div>" : "") + "<div><span>PPN " + d.pajak + "%</span><span>" + rp(h.pajak) + '</span></div><div class="akhir"><span>Total</span><span>' + rp(h.total) + "</span></div>" + (h.dp ? "<div><span>DP</span><span>−" + rp(h.dp) + '</span></div><div class="akhir"><span>Sisa</span><span>' + rp(h.sisa) + "</span></div>" : "") + "</div>" +
      (d.status === "lunas" ? '<p style="margin-top:20px"><span class="cap">LUNAS</span></p>' : "") +
      '<div style="margin-top:28px">' + (inv ? "<b>Pembayaran:</b> " + esc(P.rekening) + "<br>" : "") + esc(d.catatan || "") + '</div><div style="margin-top:50px;text-align:right">Hormat kami,<br><br><br><b>' + esc(window.TEMA.nama) + "</b></div></div>";
    var judulLama = document.title; document.title = d.nomor.replace(/\//g, "-");
    setTimeout(function () { window.print(); document.title = judulLama; }, 50);
  }

  // ================= PENGINGAT =================
  var kalBulan = new Date(); kalBulan.setDate(1);
  var tglPilih = null;
  HALAMAN.pengingat = function () {
    var y = kalBulan.getFullYear(), m = kalBulan.getMonth();
    var awal = new Date(y, m, 1), mulai = (awal.getDay() + 6) % 7;
    var sel = "";
    for (var i = 0; i < 42; i++) {
      var d = new Date(y, m, 1 - mulai + i), s = iso(d), ada = D.pengingat.filter(function (p) { return p.tgl === s && !p.selesai; }).length;
      sel += '<button data-kal="' + s + '" class="' + (d.getMonth() !== m ? "luar " : "") + (s === HARI_INI ? "ini " : "") + (s === tglPilih ? "pilih" : "") + '" aria-label="' + d.getDate() + " " + BULAN_P[d.getMonth()] + (ada ? ", " + ada + " pengingat" : "") + '" aria-pressed="' + (s === tglPilih) + '">' + d.getDate() + '<span class="titik">' + new Array(Math.min(ada, 3) + 1).join("<i></i>") + "</span></button>";
    }
    var list = D.pengingat.filter(function (p) { return tglPilih ? p.tgl === tglPilih : true; }).sort(function (a, b) { return a.selesai - b.selesai || (a.tgl < b.tgl ? -1 : 1); });
    var lewat = list.filter(function (p) { return !p.selesai && p.tgl < HARI_INI; }), hari = list.filter(function (p) { return !p.selesai && p.tgl === HARI_INI; }), depan = list.filter(function (p) { return !p.selesai && p.tgl > HARI_INI; }), beres = list.filter(function (p) { return p.selesai; });
    var grup = function (judul, arr) { return arr.length ? '<h3 class="kecil redup" style="text-transform:uppercase;letter-spacing:.06em;margin:16px 0 4px">' + judul + " · " + arr.length + "</h3>" + daftarPengingat(arr) : ""; };
    return '<div class="hal-kepala"><div><h1>Follow-up</h1><p>Jangan sampai klien menunggu. Klik ikon WA untuk pesan siap kirim.</p></div><div class="aksi"><button class="btn" data-baru="pengingat">' + ikon("plus") + "Pengingat baru</button></div></div>" +
      '<div class="dua-kolom bertahap"><section class="kartu"><div class="kal-kepala"><button class="ikon-btn" id="kal-mundur" aria-label="Bulan sebelumnya">' + ikon("left") + '</button><h2 style="margin:0" aria-live="polite">' + BULAN_P[m] + " " + y + '</h2><button class="ikon-btn" id="kal-maju" aria-label="Bulan berikutnya">' + ikon("right") + '</button></div><div class="kal">' + ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(function (h) { return '<span class="hari">' + h + "</span>"; }).join("") + sel + "</div>" +
      (tglPilih ? '<button class="btn-hantu penuh" id="kal-semua" style="margin-top:10px">Tampilkan semua tanggal</button>' : "") + "</section>" +
      '<section class="kartu"><h2>' + (tglPilih ? "Pengingat " + tgl(tglPilih) : "Semua pengingat") + "</h2>" + (list.length ? grup("Terlewat", lewat) + grup("Hari ini", hari) + grup("Akan datang", depan) + grup("Selesai", beres) : '<div class="kosong">' + ikon("bell") + "<p>Tidak ada pengingat.</p></div>") + "</section></div>";
  };
  function daftarPengingat(arr) {
    return '<ul class="daftar">' + arr.map(function (p) {
      var k = klienById(p.klienId);
      return '<li style="' + (p.selesai ? "opacity:.6" : "") + '">' + avatar(k.nama) + '<div class="isi"><b style="' + (p.selesai ? "text-decoration:line-through" : "") + '">' + esc(p.teks) + "</b><small>" + esc(k.nama) + " · " + tgl(p.tgl) + " (" + relatif(p.tgl) + ")</small></div>" +
        '<a class="ikon-btn kecil" style="color:var(--hijau)" target="_blank" rel="noopener" href="' + esc(waLink(k.wa, "Halo " + (k.kontak || k.nama) + ", saya dari " + window.TEMA.nama + ". " + p.teks + ". Terima kasih 🙏")) + '" aria-label="WhatsApp ' + esc(k.nama) + '">' + ikon("wa") + "</a>" +
        '<button class="ikon-btn kecil" data-fu-selesai="' + p.id + '" aria-label="' + (p.selesai ? "Batalkan selesai" : "Tandai selesai") + '">' + ikon(p.selesai ? "x" : "check") + '</button><button class="ikon-btn kecil" data-fu-hapus="' + p.id + '" aria-label="Hapus pengingat">' + ikon("trash") + "</button></li>";
    }).join("") + "</ul>";
  }
  PASANG.pengingat = function () {
    $("#kal-mundur").onclick = function () { kalBulan.setMonth(kalBulan.getMonth() - 1); render(true); };
    $("#kal-maju").onclick = function () { kalBulan.setMonth(kalBulan.getMonth() + 1); render(true); };
    var ks = $("#kal-semua"); if (ks) ks.onclick = function () { tglPilih = null; render(true); };
    $$("[data-kal]").forEach(function (b) { b.onclick = function () { tglPilih = tglPilih === b.dataset.kal ? null : b.dataset.kal; render(true); var x = $('[data-kal="' + b.dataset.kal + '"]'); if (x) x.focus(); }; });
    $$("[data-fu-hapus]").forEach(function (b) { b.onclick = function () { D.pengingat = D.pengingat.filter(function (p) { return p.id !== b.dataset.fuHapus; }); simpan(); toast("Pengingat dihapus"); render(true); }; });
  };
  function formPengingat(klienId) {
    bukaModal("Pengingat follow-up", '<form id="f-fu" class="form-grid">' + isian("Klien", '<select class="input" name="klienId">' + opsiKlien(klienId) + "</select>") + isian("Tanggal", '<input class="input" type="date" name="tgl" required value="' + (tglPilih || geser(1)) + '">') +
      isian("Apa yang perlu di-follow-up?", '<input class="input" name="teks" required placeholder="mis. Tanyakan keputusan penawaran">', true) +
      '<div class="form-aksi lebar"><button type="button" class="btn-garis" data-tutup>Batal</button><button class="btn" type="submit">Simpan</button></div></form>');
    rapikanLabel($("#modal-isi"));
    $("#f-fu").onsubmit = function (e) { e.preventDefault(); var f = new FormData(e.target); D.pengingat.push({ id: uid(), klienId: f.get("klienId"), tgl: f.get("tgl"), teks: f.get("teks"), selesai: false }); simpan(); tutupModal(); toast("Pengingat disimpan"); render(true); };
  }

  // ================= LAPORAN =================
  var periode = 12;
  HALAMAN.laporan = function () {
    var now = new Date(), batas = iso(new Date(now.getFullYear(), now.getMonth() - periode + 1, 1));
    var lunas = D.dok.filter(function (d) { return d.jenis === "invoice" && d.status === "lunas" && d.tglLunas >= batas; });
    var total = lunas.reduce(function (s, d) { return s + hitung(d).total; }, 0);
    var perK = {}; lunas.forEach(function (d) { perK[d.klienId] = (perK[d.klienId] || 0) + hitung(d).total; });
    var rank = Object.keys(perK).map(function (id) { return { k: klienById(id), v: perK[id] }; }).sort(function (a, b) { return b.v - a.v; });
    var max = rank.length ? rank[0].v : 1;
    var perS = {}; D.klien.forEach(function (k) { perS[k.sumber] = (perS[k.sumber] || 0) + 1; });
    var menang = D.deal.filter(function (d) { return d.tahap === "deal"; }), kalah = D.deal.filter(function (d) { return d.tahap === "batal"; });
    return '<div class="hal-kepala"><div><h1>Laporan</h1><p>Pendapatan dihitung dari invoice berstatus Lunas</p></div><div class="aksi"><div class="segmen" role="group" aria-label="Periode">' + [[6, "6 bulan"], [12, "12 bulan"]].map(function (p) { return '<button data-periode="' + p[0] + '" aria-pressed="' + (periode === p[0]) + '">' + p[1] + "</button>"; }).join("") + '</div><button class="btn-garis" id="ekspor-lap">' + ikon("down") + "CSV</button></div></div>" +
      '<div class="stat-grid bertahap"><div class="kartu stat sorot"><div class="label"><i>' + ikon("chart") + '</i>Total ' + periode + ' bulan</div><div class="nilai angka">' + rpPendek(total) + '</div><div class="ket">' + lunas.length + ' invoice lunas</div></div>' +
      '<div class="kartu stat"><div class="label"><i>' + ikon("chart") + '</i>Rata-rata / bulan</div><div class="nilai angka">' + rpPendek(total / periode) + '</div></div>' +
      '<div class="kartu stat"><div class="label"><i>' + ikon("users") + '</i>Klien membayar</div><div class="nilai angka">' + rank.length + '</div><div class="ket">dari ' + D.klien.length + ' klien</div></div>' +
      '<div class="kartu stat"><div class="label"><i>' + ikon("kanban") + '</i>Deal menang</div><div class="nilai angka">' + menang.length + " / " + (menang.length + kalah.length) + '</div><div class="ket">' + rpPendek(menang.reduce(function (s, d) { return s + d.nilai; }, 0)) + "</div></div></div>" +
      '<section class="kartu" style="margin-bottom:18px"><h2>Pendapatan per bulan</h2><div class="grafik">' + grafikBatang(periode) + "</div></section>" +
      '<div class="grid-2 bertahap"><section class="kartu"><h2>Pendapatan per klien</h2><ul class="daftar peringkat">' + (rank.length ? rank.map(function (r) { return '<li><span><a href="#klien/' + r.k.id + '" style="color:var(--teks);font-weight:600;text-decoration:none">' + esc(r.k.nama) + '</a></span><b class="angka">' + rp(r.v) + '</b><div class="bar"><i data-w="' + Math.round(r.v / max * 100) + '"></i></div></li>'; }).join("") : '<li class="kosong">Belum ada data.</li>') + "</ul></section>" +
      '<section class="kartu"><h2>Sumber klien</h2><ul class="daftar peringkat">' + Object.keys(perS).sort(function (a, b) { return perS[b] - perS[a]; }).map(function (s) { return "<li><span>" + esc(s) + '</span><b class="angka">' + perS[s] + ' klien</b><div class="bar"><i data-w="' + Math.round(perS[s] / D.klien.length * 100) + '"></i></div></li>'; }).join("") + "</ul></section></div>";
  };
  PASANG.laporan = function () {
    $$("[data-periode]").forEach(function (b) { b.onclick = function () { periode = +b.dataset.periode; render(true); }; });
    $("#ekspor-lap").onclick = function () {
      var rows = [["Bulan", "Pendapatan"]], now = new Date();
      for (var i = periode - 1; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth() - i, 1); rows.push([BULAN_P[d.getMonth()] + " " + d.getFullYear(), pendapatanBulan(iso(d).slice(0, 7))]); }
      unduhCSV("laporan-pendapatan.csv", rows);
    };
  };

  // ================= PENGATURAN =================
  HALAMAN.pengaturan = function () {
    var P = D.pengaturan;
    return '<div class="hal-kepala"><div><h1>Pengaturan</h1><p>Profil usaha, PIN, cadangan data</p></div></div><div class="grid-2 bertahap"><section class="kartu"><h2>Profil usaha (tampil di invoice)</h2><form id="f-set" class="form-grid">' +
      isian("Alamat", '<input class="input" name="alamat" value="' + esc(P.alamat) + '">', true) + isian("Email", '<input class="input" type="email" name="email" value="' + esc(P.email) + '">') + isian("WhatsApp", '<input class="input" name="wa" value="' + esc(P.wa) + '">') +
      isian("Rekening pembayaran", '<input class="input" name="rekening" value="' + esc(P.rekening) + '">', true) + isian("PPN bawaan (%)", '<input class="input" type="number" min="0" name="pajak" value="' + P.pajak + '">') + isian("PIN baru (4 digit)", '<input class="input" name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="••••">') +
      isian("Catatan bawaan invoice", '<input class="input" name="catatanInvoice" value="' + esc(P.catatanInvoice) + '">', true) +
      '<p class="kecil redup lebar" style="margin:0">Nama usaha, warna & font diatur di <code>tema.js</code> dan <code>tema.css</code>.</p><div class="form-aksi lebar" style="margin-top:4px"><button class="btn" type="submit">Simpan pengaturan</button></div></form></section>' +
      '<section class="kartu"><h2>Data & cadangan</h2><p class="redup" style="margin-top:0">Data tersimpan di browser ini saja. Rutin unduh backup JSON supaya aman.</p><div class="baris-aksi">' +
      '<button class="btn" id="backup">' + ikon("down") + 'Backup JSON</button><label class="btn-garis" for="impor" style="cursor:pointer">Pulihkan dari JSON</label><input type="file" id="impor" accept="application/json,.json" class="sr"></div>' +
      '<h3 style="font-size:14px;margin:22px 0 8px">Ekspor CSV</h3><div class="baris-aksi"><button class="btn-garis" data-csv="klien">Klien</button><button class="btn-garis" data-csv="dok">Invoice & penawaran</button><button class="btn-garis" data-csv="proyek">Proyek</button><button class="btn-garis" data-csv="deal">Pipeline</button></div>' +
      '<h3 style="font-size:14px;margin:22px 0 8px">Zona bahaya</h3><div class="baris-aksi"><button class="btn-garis" id="isi-contoh">Muat ulang data contoh</button><button class="btn-bahaya" id="kosongkan">' + ikon("trash") + "Kosongkan semua data</button></div></section></div>";
  };
  PASANG.pengaturan = function () {
    $("#f-set").onsubmit = function (e) {
      e.preventDefault(); var f = new FormData(e.target), P = D.pengaturan;
      ["alamat", "email", "wa", "rekening", "catatanInvoice"].forEach(function (x) { P[x] = f.get(x); }); P.pajak = +f.get("pajak") || 0;
      var pin = (f.get("pin") || "").trim(); if (pin) { if (!/^\d{4}$/.test(pin)) { toast("PIN harus 4 angka"); return; } P.pin = pin; }
      simpan(); toast("Pengaturan disimpan");
    };
    $("#backup").onclick = function () { unduh("backup-crm-" + HARI_INI + ".json", JSON.stringify(D, null, 2), "application/json"); toast("Backup diunduh"); };
    $("#impor").onchange = function (e) {
      var file = e.target.files[0]; if (!file) return; var r = new FileReader();
      r.onload = function () { try { var x = JSON.parse(r.result); if (!x.klien) throw 0; D = x; migrasi(); toast("Data dipulihkan"); render(); } catch (err) { toast("Berkas tidak valid"); } };
      r.readAsText(file);
    };
    $$("[data-csv]").forEach(function (b) {
      b.onclick = function () {
        var j = b.dataset.csv;
        if (j === "klien") unduhCSV("klien.csv", [["Nama", "Kontak", "Email", "WhatsApp", "Sumber", "Tag"]].concat(D.klien.map(function (k) { return [k.nama, k.kontak, k.email, k.wa, k.sumber, k.tag.join("; ")]; })));
        if (j === "dok") unduhCSV("dokumen.csv", [["Nomor", "Jenis", "Klien", "Tanggal", "Status", "Total"]].concat(D.dok.map(function (d) { return [d.nomor, d.jenis, klienById(d.klienId).nama, d.tgl, statusDok(d), hitung(d).total]; })));
        if (j === "proyek") unduhCSV("proyek.csv", [["Proyek", "Klien", "Status", "Tenggat", "Progres %", "Nilai"]].concat(D.proyek.map(function (p) { return [p.nama, klienById(p.klienId).nama, p.status, p.tenggat, progres(p), p.nilai]; })));
        if (j === "deal") unduhCSV("pipeline.csv", [["Judul", "Klien", "Tahap", "Nilai", "Tanggal"]].concat(D.deal.map(function (d) { return [d.judul, klienById(d.klienId).nama, d.tahap, d.nilai, d.tgl]; })));
      };
    });
    $("#isi-contoh").onclick = function () { konfirmasi("Ganti semua data dengan data contoh?", function () { var pin = D.pengaturan.pin; D = dataContoh(); D.pengaturan.pin = pin; simpan(); toast("Data contoh dimuat"); render(); }); };
    $("#kosongkan").onclick = function () { konfirmasi("Semua klien, proyek, invoice akan dihapus permanen dari browser ini. Sudah backup?", function () { var P = D.pengaturan; D = { versi: VERSI, klien: [], deal: [], proyek: [], dok: [], pengingat: [], pengaturan: P }; simpan(); toast("Data dikosongkan"); render(); }); };
  };

  // ================= ekspor =================
  function unduh(nama, isi, tipe) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function unduhCSV(nama, rows) {
    var csv = rows.map(function (r) { return r.map(function (c) { c = String(c == null ? "" : c); return /[",\n;]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(","); }).join("\n");
    unduh(nama, "﻿" + csv, "text/csv;charset=utf-8"); toast(nama + " diunduh");
  }

  // ================= palet perintah =================
  var paletItem = [], paletIdx = 0;
  function bukaPalet() {
    fokusSebelum = document.activeElement;
    var p = $("#palet"); p.hidden = false; $("#palet-input").value = ""; isiPalet(""); setTimeout(function () { $("#palet-input").focus(); }, 30);
  }
  function isiPalet(q) {
    q = q.toLowerCase().trim();
    var cocok = function (s) { return !q || s.toLowerCase().indexOf(q) >= 0; };
    var grup = [];
    var perintah = [["Buka Dashboard", "#dashboard", "home"], ["Buka Klien", "#klien", "users"], ["Buka Pipeline", "#pipeline", "kanban"], ["Buka Proyek", "#proyek", "folder"], ["Buka Invoice", "#invoice", "doc"], ["Buka Follow-up", "#pengingat", "bell"], ["Buka Laporan", "#laporan", "chart"], ["Buka Pengaturan", "#pengaturan", "gear"],
      ["Buat klien baru", "baru:klien", "plus"], ["Buat invoice baru", "baru:invoice", "plus"], ["Buat penawaran baru", "baru:penawaran", "plus"], ["Buat proyek baru", "baru:proyek", "plus"], ["Buat pengingat", "baru:pengingat", "plus"], ["Ganti mode terang/gelap", "mode", "moon"]];
    grup.push(["Klien", D.klien.filter(function (k) { return cocok(k.nama + " " + k.kontak + " " + k.email + " " + k.tag.join(" ")); }).slice(0, 6).map(function (k) { return { t: k.nama, s: k.kontak, i: "users", a: "#klien/" + k.id }; })]);
    grup.push(["Proyek", D.proyek.filter(function (p) { return cocok(p.nama + " " + klienById(p.klienId).nama); }).slice(0, 5).map(function (p) { return { t: p.nama, s: progres(p) + "%", i: "folder", a: "#proyek" }; })]);
    grup.push(["Invoice & penawaran", D.dok.filter(function (d) { return cocok(d.nomor + " " + klienById(d.klienId).nama); }).slice(0, 6).map(function (d) { return { t: d.nomor + " — " + klienById(d.klienId).nama, s: rpPendek(hitung(d).total), i: "doc", a: "dok:" + d.id }; })]);
    grup.push(["Prospek", D.deal.filter(function (d) { return cocok(d.judul + " " + klienById(d.klienId).nama); }).slice(0, 4).map(function (d) { return { t: d.judul, s: rpPendek(d.nilai), i: "kanban", a: "deal:" + d.id }; })]);
    grup.push(["Perintah", perintah.filter(function (p) { return cocok(p[0]); }).map(function (p) { return { t: p[0], s: "", i: p[2], a: p[1] }; })]);
    if (!q) grup = [grup[4], grup[0]];
    paletItem = []; paletIdx = 0;
    var html = "";
    grup.forEach(function (g) { if (!g[1].length) return; html += '<li class="grup" role="presentation">' + g[0] + "</li>"; g[1].forEach(function (it) { var n = paletItem.length; paletItem.push(it); html += '<li role="option" id="po' + n + '" data-po="' + n + '" aria-selected="' + (n === 0) + '">' + ikon(it.i) + "<span>" + esc(it.t) + "</span><small>" + esc(it.s) + "</small></li>"; }); });
    $("#palet-hasil").innerHTML = html || '<li class="kosong" role="presentation">Tidak ada hasil untuk “' + esc(q) + "”</li>";
    $("#palet-input").setAttribute("aria-activedescendant", paletItem.length ? "po0" : "");
  }
  function pilihPalet(n) {
    paletIdx = n;
    $$("[data-po]").forEach(function (li) { var on = +li.dataset.po === n; li.setAttribute("aria-selected", on); if (on) li.scrollIntoView({ block: "nearest" }); });
    $("#palet-input").setAttribute("aria-activedescendant", "po" + n);
  }
  function jalankan(it) {
    var a = it.a;
    tutupLapis($("#palet"), function () {
      if (a[0] === "#") location.hash = a;
      else if (a.indexOf("baru:") === 0) baru(a.slice(5));
      else if (a === "mode") gantiMode();
      else if (a.indexOf("dok:") === 0) formDok(D.dok.find(function (d) { return d.id === a.slice(4); }));
      else if (a.indexOf("deal:") === 0) formDeal(D.deal.find(function (d) { return d.id === a.slice(5); }));
    });
  }
  $("#palet-input").addEventListener("input", function (e) { isiPalet(e.target.value); });
  $("#palet").addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (paletItem.length) pilihPalet((paletIdx + 1) % paletItem.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (paletItem.length) pilihPalet((paletIdx - 1 + paletItem.length) % paletItem.length); }
    else if (e.key === "Enter") { e.preventDefault(); if (paletItem[paletIdx]) jalankan(paletItem[paletIdx]); }
  });
  $("#palet").addEventListener("click", function (e) { var li = e.target.closest("[data-po]"); if (li) jalankan(paletItem[+li.dataset.po]); else if (e.target.id === "palet") tutupLapis($("#palet")); });
  $("#palet-hasil").addEventListener("mousemove", function (e) { var li = e.target.closest("[data-po]"); if (li && +li.dataset.po !== paletIdx) pilihPalet(+li.dataset.po); });

  // ================= aksi global =================
  function baru(j, data) {
    if (j === "klien") formKlien();
    else if (j === "deal") formDeal();
    else if (j === "proyek") formProyek();
    else if (j === "invoice" || j === "penawaran") formDok(null, j);
    else if (j === "pengingat") formPengingat(data);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-baru]");
    if (b) { e.preventDefault(); tutupMenuTambah(); baru(b.dataset.baru, b.dataset.klien); return; }
    var fu = e.target.closest("[data-fu-selesai]");
    if (fu) { var p = D.pengingat.find(function (x) { return x.id === fu.dataset.fuSelesai; }); p.selesai = !p.selesai; if (p.selesai) { var k = D.klien.find(function (x) { return x.id === p.klienId; }); if (k) k.timeline.push({ id: uid(), tgl: HARI_INI, jenis: "catatan", judul: "Follow-up: " + p.teks, teks: "Selesai" }); } simpan(); toast(p.selesai ? "Follow-up selesai ✓" : "Dibuka lagi"); render(true); return; }
    var ed = e.target.closest("[data-edit-dok]");
    if (ed) { e.preventDefault(); formDok(D.dok.find(function (x) { return x.id === ed.dataset.editDok; })); return; }
    var tr = e.target.closest("tr[data-buka]");
    if (tr && !e.target.closest("a,button")) location.hash = tr.dataset.buka;
    if (!e.target.closest(".tambah-wrap")) tutupMenuTambah();
  });
  function tutupMenuTambah() { $("#menu-tambah").hidden = true; $("#btn-tambah").setAttribute("aria-expanded", "false"); }
  $("#btn-tambah").onclick = function (e) { e.stopPropagation(); var m = $("#menu-tambah"); m.hidden = !m.hidden; this.setAttribute("aria-expanded", !m.hidden); if (!m.hidden) $("button", m).focus(); };
  $("#menu-tambah").addEventListener("keydown", function (e) {
    var it = $$("button", this), i = it.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); it[(i + 1) % it.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
    if (e.key === "Escape") { tutupMenuTambah(); $("#btn-tambah").focus(); }
  });
  $("#btn-cari").onclick = bukaPalet;
  function tutupMenuHP() { $("#samping").classList.remove("buka"); $("#tirai").hidden = true; $("#btn-menu").setAttribute("aria-expanded", "false"); }
  $("#btn-menu").onclick = function () { $("#samping").classList.add("buka"); $("#tirai").hidden = false; this.setAttribute("aria-expanded", "true"); $("#samping nav a").focus(); };
  $("#tirai").onclick = tutupMenuHP;
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if ($("#app").hidden) return; if ($("#palet").hidden) bukaPalet(); else tutupLapis($("#palet")); }
    if (e.key === "Escape") { if (!$("#palet").hidden) tutupLapis($("#palet")); else if (!$("#modal").hidden) tutupModal(); else tutupMenuHP(); }
  });

  // ================= tema =================
  var FONT_OK = ["Plus Jakarta Sans", "Inter", "Poppins", "DM Sans", "Space Grotesk", "Nunito"];
  function tampilkanNama() { $$("[data-tema-nama]").forEach(function (el) { el.textContent = window.TEMA.nama; }); }
  function setMode(m, simpanPilihan) {
    if (m === "auto") m = matchMedia("(prefers-color-scheme: dark)").matches ? "gelap" : "terang";
    var r = document.documentElement; r.classList.add("halus"); r.setAttribute("data-mode", m);
    setTimeout(function () { r.classList.remove("halus"); }, 400);
    if (simpanPilihan) try { localStorage.setItem("crm_mode", m); } catch (e) {}
  }
  function gantiMode() { setMode(document.documentElement.getAttribute("data-mode") === "gelap" ? "terang" : "gelap", true); }
  $("#btn-mode").onclick = gantiMode;
  function muatFont(nama) {
    var el = $("#font-link"), fam = nama.split(",")[0].replace(/["']/g, "").trim();
    if (FONT_OK.indexOf(fam) < 0) return;
    var href = "https://fonts.googleapis.com/css2?family=" + fam.replace(/ /g, "+") + ":wght@400;500;600;700;800&display=swap";
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
  // pilih teks putih atau gelap, mana yang kontrasnya lebih tinggi
  function teksKontras(bg) { var L = luminansi(bg); return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.0675) ? "#ffffff" : "#0f172a"; }
  function terapkan(t) {
    var r = document.documentElement;
    r.classList.add("halus");
    if (t.utama) r.style.setProperty("--tema-utama", t.utama);
    if (t.aksen) r.style.setProperty("--tema-aksen", t.aksen);
    if (t.radius != null) r.style.setProperty("--tema-radius", /px$/.test(String(t.radius)) ? t.radius : t.radius + "px");
    if (t.font) { var fam = t.font.split(",")[0].replace(/["']/g, "").trim(); r.style.setProperty("--tema-font", '"' + fam + '", system-ui, sans-serif'); muatFont(fam); }
    if (t.mode) setMode(t.mode, false);
    if (t.utama) r.style.setProperty("--tema-utama-teks", teksKontras(t.utama));
    if (t.aksen) r.style.setProperty("--aksen-on", teksKontras(t.aksen));
    if (t.bagian) {
      var map = { latar: "--latar", panel: "--permukaan", nav: "--nav", teks: "--teks" };
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
  muatFont(getComputedStyle(document.documentElement).getPropertyValue("--tema-font") || "Plus Jakarta Sans");

  // ================= PIN =================
  var pinIsi = "";
  function gambarPin() { $$(".pin-titik i").forEach(function (t, i) { t.classList.toggle("isi", i < pinIsi.length); }); }
  function tekanPin(x) {
    if (x === "del") pinIsi = pinIsi.slice(0, -1); else if (pinIsi.length < 4) pinIsi += x;
    gambarPin();
    if (pinIsi.length === 4) {
      if (pinIsi === D.pengaturan.pin) { try { sessionStorage.setItem("crm_buka", "1"); } catch (e) {} setTimeout(bukaApp, 150); }
      else { var t = $(".pin-titik"); t.classList.add("salah"); $("#pin-pesan").textContent = "PIN salah, coba lagi"; setTimeout(function () { t.classList.remove("salah"); pinIsi = ""; gambarPin(); }, 420); }
    }
  }
  $$("[data-pin]").forEach(function (b) { b.onclick = function () { tekanPin(b.dataset.pin); }; });
  $("#kunci").addEventListener("keydown", function (e) { if (/^\d$/.test(e.key)) tekanPin(e.key); if (e.key === "Backspace") tekanPin("del"); });
  function kunciApp() { try { sessionStorage.removeItem("crm_buka"); } catch (e) {} pinIsi = ""; gambarPin(); $("#app").hidden = true; $("#kunci").hidden = false; $("#pin-pesan").textContent = "PIN bawaan: 1234 (ganti di Pengaturan)"; setTimeout(function () { $('[data-pin="1"]').focus(); }, 50); }
  function bukaApp() { $("#kunci").hidden = true; $("#app").hidden = false; render(); }
  $("#btn-kunci").onclick = kunciApp;

  // ================= bagian (customizer) =================
  function tandaiBagian(w) {
    var peta = [[".stat.sorot", "utama"], [".kartu, .tabel-wrap, .kolom", "panel"], ["h1, h2, .hal-kepala p", "teks"], [".btn:not(.btn-wa), .segmen [aria-pressed=true]", "utama"], [".chip, .tag, .grafik, .bar", "aksen"]];
    peta.forEach(function (p) { $$(p[0], w).forEach(function (el) { if (!el.hasAttribute("data-bagian")) el.setAttribute("data-bagian", p[1]); }); });
  }
  var NAMA_BAGIAN = { nav: "Navigasi", latar: "Latar", panel: "Panel", utama: "Warna utama", aksen: "Aksen", teks: "Teks" };
  function sorot(b) {
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
  var terbuka = false; try { terbuka = sessionStorage.getItem("crm_buka") === "1"; } catch (e) {}
  if (DEMO || terbuka) bukaApp(); else kunciApp();
})();
