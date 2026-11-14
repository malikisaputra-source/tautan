/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* Iuran & Kas RT — logika aplikasi (tanpa build, tanpa library).
   Peta: 1. util · 2. data & simpan · 3. tema/customizer · 4. render · 5. aksi · 6. ekspor */
/* KONFIG gambar: ganti logo cukup timpa img/logo-rt.svg (atau ubah path ke .png/.jpg). */
var KONFIG = {
  logo: 'img/logo-rt.svg',             // logo RT: header + laporan cetak
  contohBukti: 'img/contoh-bukti.svg', // contoh rasio foto bukti bayar (3:4)
  maksFoto: 400                        // sisi terpanjang foto bukti (px) sebelum disimpan
};
(function () {
  'use strict';
  /* ========== 1. Util ========== */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KUNCI = 'iuran-kas-rt-data', KUNCI_MODE = 'iuran-kas-rt-mode';
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rp(n) { return 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function ribu(n) { return Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function hariIni() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function kunciBulan(y, m) { return y + '-' + pad(m + 1); }
  function namaBulan(k) { var p = k.split('-'); return BULAN[+p[1] - 1] + ' ' + p[0]; }
  function tglPendek(t) { var p = t.split('-'); return +p[2] + ' ' + BULAN[+p[1] - 1].slice(0, 3); }
  function idBaru(a) { return a + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function inisial(n) { return n.split(/\s+/).filter(Boolean).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase(); }
  function rumah(w) { return w.blok + '-' + w.no; }
  function noWA(hp) { var d = String(hp || '').replace(/\D/g, ''); if (!d) return ''; if (d[0] === '0') d = '62' + d.slice(1); else if (d.slice(0, 2) !== '62') d = '62' + d; return d; }
  var IK = {
    cek: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/></svg>',
    naik: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>',
    turun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6"/></svg>',
    hapus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
    ubah: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
    foto: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/></svg>',
    kosong: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/></svg>'
  };

  /* ========== 2. Data & simpan ========== */
  var D;
  function muat() {
    try { D = JSON.parse(localStorage.getItem(KUNCI) || 'null'); } catch (e) { D = null; }
    if (!D || !Array.isArray(D.warga)) D = window.DATA_CONTOH();
    migrasi(D);
  }
  // Tambah field baru di sini supaya data lama tetap terbaca.
  function migrasi(d) {
    d.versi = d.versi || 1;
    d.pengaturan = Object.assign({ iuran: 50000, batas: 10, bendahara: 'Bendahara RT', bayarKe: '' }, d.pengaturan || {});
    d.bayar = d.bayar || {}; d.bukti = d.bukti || {}; d.kas = d.kas || [];
    d.warga.forEach(function (w) { w.blok = w.blok || 'A'; w.no = w.no || ''; w.hp = w.hp || ''; });
  }
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { toast('Gagal menyimpan: penyimpanan browser penuh atau diblokir'); } }
  var kini = new Date();
  var S = { tahun: kini.getFullYear(), bulan: kini.getMonth(), saring: 'semua', cari: '', tab: 'ingat' };
  function bk() { return kunciBulan(S.tahun, S.bulan); }
  function lunasDi(b, id) { return !!(D.bayar[b] && D.bayar[b][id]); }
  function saldo(sampaiTgl) { return D.kas.reduce(function (s, x) { return (!sampaiTgl || x.tgl <= sampaiTgl) ? s + (x.jenis === 'masuk' ? 1 : -1) * x.jumlah : s; }, 0); }
  function kasBulan(b) { var m = 0, k = 0, iu = 0; D.kas.forEach(function (x) { if (x.tgl.slice(0, 7) === b) { if (x.jenis === 'masuk') { m += x.jumlah; if (x.ref) iu += x.jumlah; } else k += x.jumlah; } }); return { masuk: m, keluar: k, iuran: iu }; }
  function rekap(b) {
    var lunas = D.warga.filter(function (w) { return lunasDi(b, w.id); });
    var belum = D.warga.filter(function (w) { return !lunasDi(b, w.id); });
    return { lunas: lunas, belum: belum, total: D.warga.length, kurang: belum.length * D.pengaturan.iuran, terkumpul: kasBulan(b).iuran };
  }
  function setLunas(w, b, lunas, tgl) {
    var ref = b + ':' + w.id;
    D.kas = D.kas.filter(function (x) { return x.ref !== ref; });
    D.bayar[b] = D.bayar[b] || {};
    if (lunas) {
      var t = tgl || (b === hariIni().slice(0, 7) ? hariIni() : b + '-01');
      D.bayar[b][w.id] = t;
      D.kas.push({ id: idBaru('k'), tgl: t, jenis: 'masuk', ket: 'Iuran ' + w.nama, jumlah: Number(D.pengaturan.iuran) || 0, ref: ref });
    } else delete D.bayar[b][w.id];
    simpan();
  }

  /* ========== 3. Tema (kontrak customizer Maliki Studio) ========== */
  var FONT = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  function modeAktif(m) { if (m === 'auto' || !m) return matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang'; return m; }
  function muatFont(nama) {
    if (FONT.indexOf(nama) < 0) return;
    var href = 'https://fonts.googleapis.com/css2?family=' + nama.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap';
    var l = $('#fontTema'); if (l && l.getAttribute('href') !== href) l.setAttribute('href', href);
  }
  function terapkan(t) {
    t = t || {}; var r = document.documentElement.style;
    if (t.utama) r.setProperty('--tema-utama', t.utama);
    if (t.aksen) r.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null && t.radius !== '') r.setProperty('--tema-radius', /px$/.test(String(t.radius)) ? t.radius : t.radius + 'px');
    if (t.font) { var nm = String(t.font).split(',')[0].replace(/["']/g, '').trim(); r.setProperty('--tema-font', '"' + nm + '", system-ui, sans-serif'); muatFont(nm); }
    if (t.mode) document.documentElement.setAttribute('data-mode', modeAktif(t.mode));
    if (t.nama) { window.TEMA.nama = t.nama; $$('[data-tema-nama]').forEach(function (el) { el.textContent = t.nama; }); perbaruiTeks(); }
    if (t.bagian) {
      var peta = { latar: ['--latar', '--tema-latar'], panel: ['--permukaan', '--tema-panel'], nav: ['--nav', '--tema-nav'], teks: ['--teks', '--tema-teks'] };
      Object.keys(peta).forEach(function (k) { var v = t.bagian[k]; if (v) { r.setProperty(peta[k][0], v); r.setProperty(peta[k][1], v); } else if (v === null) { r.removeProperty(peta[k][0]); r.removeProperty(peta[k][1]); } });
    }
    hitungKontras();
  }
  function hex(c) {
    c = String(c).trim();
    if (/^#[0-9a-f]{3}$/i.test(c)) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    if (/^#[0-9a-f]{6}$/i.test(c)) return c;
    var m = c.match(/\d+(\.\d+)?/g); if (!m) return '#000000';
    return '#' + m.slice(0, 3).map(function (v) { return pad(Math.round(+v).toString(16)); }).join('');
  }
  function luminansi(c) { var x = hex(c); return [1, 3, 5].map(function (i) { var n = parseInt(x.substr(i, 2), 16) / 255; return n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4); }).reduce(function (s, v, i) { return s + v * [.2126, .7152, .0722][i]; }, 0); }
  function teksUntuk(c) { var L = luminansi(c); return (1.05 / (L + .05)) >= ((L + .05) / .05) ? '#ffffff' : '#111111'; }
  function warnaJadi(v) { var el = document.createElement('i'); el.style.color = v; document.body.appendChild(el); var c = getComputedStyle(el).color; el.remove(); return c; }
  function hitungKontras() {
    var r = document.documentElement.style, cs = getComputedStyle(document.documentElement);
    r.setProperty('--tema-utama-teks', teksUntuk(warnaJadi(cs.getPropertyValue('--tema-utama').trim())));
    r.setProperty('--tema-nav-teks', teksUntuk(warnaJadi(cs.getPropertyValue('--nav').trim())));
    var meta = $('meta[name="theme-color"]'); if (meta) meta.content = hex(warnaJadi(cs.getPropertyValue('--nav').trim()));
  }
  function tandaiBagian() {
    $$('.kartu,.modal,.pesan').forEach(function (el) { el.setAttribute('data-bagian', 'panel'); });
    $$('.btn:not(.btn-garis):not(.btn-wa):not(.btn-bahaya),.chip[aria-pressed="true"] i,.seg-penanda,.lunas .avatar').forEach(function (el) { el.setAttribute('data-bagian', 'utama'); });
    $$('.cincin-wadah,.merek-logo,.bln .titik').forEach(function (el) { el.setAttribute('data-bagian', 'aksen'); });
    $$('h2,h3,.nama').forEach(function (el) { el.setAttribute('data-bagian', 'teks'); });
  }
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var bagianSorot = null;
  function sorot(b) {
    bagianSorot = b || null;
    $$('[data-sorot]').forEach(function (el) { el.removeAttribute('data-sorot'); });
    $$('.label-sorot').forEach(function (el) { el.remove(); });
    if (!b) return;
    $$('[data-bagian="' + b + '"]').forEach(function (el, i) {
      el.setAttribute('data-sorot', '');
      if (i > 5) return;
      var k = el.getBoundingClientRect(); if (!k.width) return;
      var l = document.createElement('div'); l.className = 'label-sorot'; l.textContent = NAMA_BAGIAN[b] || b;
      l.style.left = (k.left + scrollX + 4) + 'px'; l.style.top = (k.top + scrollY + 4) + 'px'; document.body.appendChild(l);
    });
  }
  var modePilih = false, hoverEl = null;
  ['click', 'pointerdown', 'mousedown', 'submit', 'touchstart', 'keydown'].forEach(function (t) {
    document.addEventListener(t, function (ev) {
      if (!modePilih) return;
      ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
      if (t === 'click') { var x = ev.target.closest && ev.target.closest('[data-bagian]'); if (x && window.parent !== window) window.parent.postMessage({ tipe: 'bagian-dipilih', bagian: x.getAttribute('data-bagian') }, '*'); }
    }, { capture: true, passive: false });
  });
  document.addEventListener('mouseover', function (ev) {
    if (!modePilih) return; var x = ev.target.closest('[data-bagian]');
    if (hoverEl && hoverEl !== x) hoverEl.removeAttribute('data-pilih-hover');
    hoverEl = x; if (x) x.setAttribute('data-pilih-hover', '');
  }, true);
  window.addEventListener('message', function (ev) {
    var d = ev.data; if (!d || typeof d !== 'object') return;
    if (d.tipe === 'tema') terapkan(d);
    if (d.tipe === 'sorot') sorot(d.bagian);
    if (d.tipe === 'mode-pilih') { modePilih = !!d.aktif; document.documentElement.classList.toggle('mode-pilih', modePilih); if (!modePilih && hoverEl) { hoverEl.removeAttribute('data-pilih-hover'); hoverEl = null; } }
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    var m; try { m = localStorage.getItem(KUNCI_MODE); } catch (e) {}
    if (!m && (TEMA.mode || 'auto') === 'auto') { terapkan({ mode: 'auto' }); }
  });

  /* ========== 4. Render ========== */
  var saldoTampil = 0;
  var tokenHitung = 0;
  function hitungNaik(el, dari, ke) {
    var token = ++tokenHitung; // animasi baru membatalkan yang lama
    if (!GERAK || dari === ke) { el.textContent = ribu(ke); return; }
    var mulai = performance.now(), lama = 700;
    (function langkah(t) {
      if (token !== tokenHitung) return;
      var p = Math.min(1, Math.max(0, (t - mulai) / lama)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = ribu(dari + (ke - dari) * e);
      if (p < 1) requestAnimationFrame(langkah);
    })(mulai);
  }
  function renderPahlawan() {
    var b = bk(), r = rekap(b), kb = kasBulan(b);
    var akhirBulan = b + '-31';
    var s = saldo(akhirBulan < hariIni() ? akhirBulan : null);
    var el = $('#angkaSaldo'), dari = angka(el.textContent); hitungNaik(el, dari, s); saldoTampil = s;
    $('#judulSaldo').textContent = akhirBulan < hariIni() ? 'Saldo kas akhir ' + namaBulan(b) : 'Saldo kas sekarang';
    var bersih = kb.masuk - kb.keluar;
    $('#saldoUbah').innerHTML = (bersih >= 0 ? IK.naik : IK.turun) + '<span>' + (bersih >= 0 ? '+' : '−') + rp(Math.abs(bersih)) + ' bersih ' + BULAN[S.bulan].slice(0, 3) + '</span>';
    $('#angkaLunas').textContent = r.lunas.length + '/' + r.total;
    var p = r.total ? r.lunas.length / r.total : 0;
    $('#cincinIsi').style.strokeDashoffset = String(314.16 * (1 - p));
    $('.cincin-wadah').setAttribute('aria-label', r.lunas.length + ' dari ' + r.total + ' KK lunas');
    $('#stTerkumpul').textContent = rp(r.terkumpul);
    $('#stKurang').textContent = rp(r.kurang);
    $('#stKeluar').textContent = rp(kb.keluar);
  }
  function renderBulan() {
    $('#tahun').textContent = S.tahun;
    var html = '';
    for (var m = 0; m < 12; m++) {
      var k = kunciBulan(S.tahun, m), ada = D.bayar[k] && Object.keys(D.bayar[k]).length, aktif = m === S.bulan;
      var penuh = ada && D.warga.every(function (w) { return lunasDi(k, w.id); });
      html += '<button class="bln" role="tab" type="button" data-bln="' + m + '" aria-selected="' + aktif + '" tabindex="' + (aktif ? 0 : -1) + '" aria-label="' + BULAN[m] + ' ' + S.tahun + (ada ? (penuh ? ', semua lunas' : ', ada yang belum bayar') : '') + '">' + (ada ? '<span class="titik' + (penuh ? '' : ' kurang') + '"></span>' : '') + BULAN[m].slice(0, 3) + '</button>';
    }
    var wadah = $('#bulanTab'); wadah.innerHTML = html;
    var a = $('.bln[aria-selected="true"]', wadah);
    if (a) wadah.scrollLeft = a.offsetLeft - wadah.clientWidth / 2 + a.clientWidth / 2;
  }
  function wargaTersaring() {
    var b = bk(), q = S.cari.toLowerCase();
    return D.warga.filter(function (w) {
      var l = lunasDi(b, w.id);
      if (S.saring === 'lunas' && !l) return false;
      if (S.saring === 'belum' && l) return false;
      return !q || (w.nama + ' ' + rumah(w)).toLowerCase().indexOf(q) >= 0;
    }).sort(function (x, y) { return rumah(x).localeCompare(rumah(y), 'id', { numeric: true }); });
  }
  function barisHTML(w, i) {
    var b = bk(), l = lunasDi(b, w.id), t = l ? D.bayar[b][w.id] : '';
    return '<li class="baris muncul' + (l ? ' lunas' : '') + '" style="--i:' + Math.min(i, 14) + '" data-id="' + w.id + '">' +
      '<button class="ketuk" type="button" aria-pressed="' + l + '" aria-label="' + esc(w.nama) + ', rumah ' + rumah(w) + ', ' + (l ? 'lunas. Ketuk untuk batalkan' : 'belum bayar. Ketuk untuk tandai lunas') + '">' +
      '<span class="avatar" aria-hidden="true">' + esc(inisial(w.nama)) + IK.cek + '</span>' +
      '<span class="info"><span class="nama">' + esc(w.nama) + '</span><span class="ket">Rumah ' + esc(rumah(w)) + (l ? ' · bayar ' + tglPendek(t) : ' · ' + rp(D.pengaturan.iuran)) + '</span></span>' +
      '<span class="status">' + (l ? 'Lunas' : 'Belum') + '</span></button>' +
      (l ? buktiBtn(b, w) : '<button class="wa-btn" type="button" data-wa="' + w.id + '" aria-label="Pesan pengingat untuk ' + esc(w.nama) + '">' + IK.wa + '</button>') + '</li>';
  }
  function buktiBtn(b, w) {
    var f = D.bukti[b] && D.bukti[b][w.id];
    return '<button class="wa-btn bukti-btn" type="button" data-bukti="' + w.id + '" aria-label="' + (f ? 'Lihat' : 'Tambah') + ' foto bukti bayar ' + esc(w.nama) + '">' + (f ? '<img src="' + f + '" alt="">' : IK.foto) + '</button>';
  }
  function renderDaftar() {
    var b = bk(), r = rekap(b), list = wargaTersaring();
    $('#nSemua').textContent = r.total; $('#nBelum').textContent = r.belum.length; $('#nLunas').textContent = r.lunas.length;
    $('#judulDaftar').textContent = 'Iuran ' + namaBulan(b);
    $('#subDaftar').textContent = rp(D.pengaturan.iuran) + '/KK · batas tgl ' + D.pengaturan.batas + ' · ketuk nama untuk lunas';
    var ul = $('#listWarga');
    if (!D.warga.length) { ul.innerHTML = '<li class="kosong">' + IK.kosong + '<b>Belum ada warga</b>Klik tombol "+ Warga" untuk menambah KK pertama.</li>'; return; }
    if (!list.length) {
      var semua = S.saring === 'belum' && !S.cari;
      ul.innerHTML = '<li class="kosong">' + IK.kosong + '<b>' + (semua ? 'Semua warga sudah lunas' : 'Tidak ada yang cocok') + '</b>' + (semua ? 'Terima kasih, bulan ' + BULAN[S.bulan] + ' beres.' : 'Coba kata kunci atau saringan lain.') + '</li>';
      return;
    }
    var html = '', blok = '', i = 0;
    list.forEach(function (w) {
      if (w.blok !== blok) { blok = w.blok; html += '<li class="blok-judul" aria-hidden="true">Blok ' + esc(blok) + '</li>'; }
      html += barisHTML(w, i++);
    });
    ul.innerHTML = html;
  }
  function pesanPengingat(w) {
    var p = D.pengaturan, b = bk();
    return 'Assalamualaikum / Salam sejahtera, Bapak/Ibu ' + w.nama + ' (rumah ' + rumah(w) + ').\n\n' +
      'Mohon maaf mengganggu. Sekadar mengingatkan iuran warga ' + (window.TEMA.nama || '') + ' bulan ' + namaBulan(b) + ' sebesar ' + rp(p.iuran) + ', batas tanggal ' + p.batas + '.' +
      (p.bayarKe ? '\nPembayaran: ' + p.bayarKe + '.' : '') + '\n\nKalau sudah bayar, abaikan pesan ini ya. Terima kasih banyak.\n— ' + p.bendahara;
  }
  function pesanGrup() {
    var b = bk(), r = rekap(b), p = D.pengaturan;
    var t = '*Rekap Iuran ' + namaBulan(b) + '*\n' + (window.TEMA.nama || '') + '\n\n' +
      'Sudah lunas: ' + r.lunas.length + ' dari ' + r.total + ' KK\nTerkumpul: ' + rp(r.terkumpul) + '\n';
    if (r.belum.length) {
      t += '\nBelum bayar (' + r.belum.length + ' KK):\n' + r.belum.map(function (w, i) { return (i + 1) + '. ' + rumah(w) + ' — ' + w.nama; }).join('\n') +
        '\n\nIuran ' + rp(p.iuran) + '/KK, batas tanggal ' + p.batas + '.' + (p.bayarKe ? '\nBayar: ' + p.bayarKe + '.' : '');
    } else t += '\nAlhamdulillah, semua warga sudah lunas. Terima kasih!';
    return t + '\n\nTerima kasih,\n' + p.bendahara;
  }
  function pesanLaporan() {
    var b = bk(), r = rekap(b), kb = kasBulan(b);
    var awal = saldo(b + '-00'), akhir = awal + kb.masuk - kb.keluar;
    var tr = D.kas.filter(function (x) { return x.tgl.slice(0, 7) === b; }).sort(function (x, y) { return x.tgl < y.tgl ? -1 : 1; });
    var lain = tr.filter(function (x) { return x.jenis === 'masuk' && !x.ref; }), kel = tr.filter(function (x) { return x.jenis === 'keluar'; });
    var t = '*LAPORAN KAS ' + namaBulan(b).toUpperCase() + '*\n' + (window.TEMA.nama || '') + '\n\n' +
      'Saldo awal: ' + rp(awal) + '\n\n*Pemasukan*\n• Iuran warga (' + r.lunas.length + '/' + r.total + ' KK): ' + rp(kb.iuran) + '\n' +
      lain.map(function (x) { return '• ' + x.ket + ': ' + rp(x.jumlah); }).join('\n') + (lain.length ? '\n' : '') +
      'Total masuk: ' + rp(kb.masuk) + '\n\n*Pengeluaran*\n' +
      (kel.length ? kel.map(function (x) { return '• ' + tglPendek(x.tgl) + ' ' + x.ket + ': ' + rp(x.jumlah); }).join('\n') : '• (tidak ada)') +
      '\nTotal keluar: ' + rp(kb.keluar) + '\n\n*Saldo akhir: ' + rp(akhir) + '*';
    if (r.belum.length) t += '\n\nBelum bayar: ' + r.belum.map(rumah).join(', ');
    return { teks: t + '\n\n' + D.pengaturan.bendahara, awal: awal, akhir: akhir, kb: kb };
  }
  function renderSisi() {
    var g = pesanGrup();
    $('#pesanGrup').textContent = g;
    $('#waGrup').href = 'https://wa.me/?text=' + encodeURIComponent(g);
    var b = bk();
    var tr = D.kas.filter(function (x) { return x.tgl.slice(0, 7) === b; }).sort(function (x, y) { return x.tgl < y.tgl ? 1 : -1; });
    $('#listKas').innerHTML = tr.length ? tr.map(function (x, i) {
      return '<li class="' + x.jenis + ' muncul" style="--i:' + Math.min(i, 12) + '"><span class="t-ikon">' + (x.jenis === 'masuk' ? IK.naik : IK.turun) + '</span><span class="t-isi"><b>' + esc(x.ket) + '</b><small>' + tglPendek(x.tgl) + (x.ref ? ' · otomatis dari iuran' : '') + '</small></span><span class="jml">' + (x.jenis === 'masuk' ? '+' : '−') + rp(x.jumlah) + '</span>' +
        (x.ref ? '' : '<button class="hapus-t" type="button" data-hapus-kas="' + x.id + '" aria-label="Hapus transaksi ' + esc(x.ket) + '">' + IK.hapus + '</button>') + '</li>';
    }).join('') : '<li class="kosong">' + IK.kosong + '<b>Belum ada transaksi</b>Catat pemasukan atau pengeluaran di atas.</li>';
    var L = pesanLaporan();
    $('#lapRingkas').innerHTML = '<div><small>Saldo awal</small><b>' + rp(L.awal) + '</b></div><div><small>Masuk</small><b>' + rp(L.kb.masuk) + '</b></div><div><small>Keluar</small><b>' + rp(L.kb.keluar) + '</b></div><div class="sorot-akhir"><small>Saldo akhir</small><b>' + rp(L.akhir) + '</b></div>';
    $('#pesanLap').textContent = L.teks;
    var f = $('#formKas'); if (!f.tgl.value || f.tgl.value.slice(0, 7) !== b) f.tgl.value = b === hariIni().slice(0, 7) ? hariIni() : b + '-01';
  }
  function perbaruiTeks() { renderSisi(); }
  function render() {
    renderPahlawan(); renderBulan(); renderDaftar(); renderSisi(); tandaiBagian();
    $('#subBendahara').textContent = D.pengaturan.bendahara;
    if (bagianSorot) sorot(bagianSorot);
  }

  /* ========== 5. Aksi ========== */
  var tToast;
  function toast(teks, aksi) {
    var t = $('#toast'); clearTimeout(tToast);
    t.innerHTML = '<span>' + esc(teks) + '</span>' + (aksi ? '<button type="button">' + esc(aksi.label) + '</button>' : '');
    if (aksi) $('button', t).onclick = function () { aksi.fn(); t.classList.remove('tampil'); };
    requestAnimationFrame(function () { t.classList.add('tampil'); });
    tToast = setTimeout(function () { t.classList.remove('tampil'); }, aksi ? 5000 : 2600);
  }
  function salin(teks, label) {
    function cadangan() { var a = document.createElement('textarea'); a.value = teks; a.setAttribute('readonly', ''); a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); }
    (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(teks).catch(cadangan) : Promise.resolve(cadangan())).then(function () { toast(label + ' tersalin, tinggal tempel di WhatsApp'); });
  }
  // Logo RT dari KONFIG; gagal dimuat -> inisial nama RT.
  function pasangLogo() {
    $$('[data-logo]').forEach(function (im) {
      im.onerror = function () { var s = document.createElement('span'); s.className = 'logo-inisial'; s.textContent = inisial(($('[data-tema-nama]') || {}).textContent || 'RT') || 'RT'; im.replaceWith(s); };
      im.src = KONFIG.logo;
    });
  }
  // Foto bukti bayar opsional: diperkecil via canvas (<= KONFIG.maksFoto px), disimpan sebagai dataURL.
  function kecilkan(file, cb) {
    var r = new FileReader();
    r.onload = function () { var im = new Image(); im.onload = function () { var k = Math.min(1, KONFIG.maksFoto / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.75)); }; im.onerror = function () { toast('Berkas bukan gambar'); }; im.src = r.result; };
    r.readAsDataURL(file);
  }
  function pilihFoto(w, b) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function () { if (!inp.files[0]) return; kecilkan(inp.files[0], function (u) { D.bukti[b] = D.bukti[b] || {}; D.bukti[b][w.id] = u; simpan(); renderDaftar(); toast('Foto bukti ' + w.nama + ' tersimpan'); }); };
    inp.click();
  }
  function kelolaBukti(w) {
    var b = bk(), f = D.bukti[b] && D.bukti[b][w.id];
    if (!f) { pilihFoto(w, b); return; }
    var lp = document.createElement('div'); lp.className = 'bukti-lihat'; lp.setAttribute('role', 'dialog'); lp.setAttribute('aria-label', 'Foto bukti ' + w.nama);
    lp.innerHTML = '<figure><img src="' + f + '" alt="Foto bukti bayar ' + esc(w.nama) + '"><figcaption>' + esc(w.nama) + ' · ' + namaBulan(b) + '</figcaption><div class="baris-aksi"><button class="btn" type="button" data-a="ganti">Ganti</button><button class="btn btn-garis" type="button" data-a="hapus">Hapus</button><button class="btn btn-garis" type="button" data-a="tutup">Tutup</button></div></figure>';
    lp.onclick = function (e) { var a = e.target.closest('[data-a]'); if (!a && e.target !== lp) return; lp.remove(); if (!a) return; a = a.dataset.a; if (a === 'ganti') pilihFoto(w, b); if (a === 'hapus') { delete D.bukti[b][w.id]; simpan(); renderDaftar(); } };
    document.body.appendChild(lp); lp.querySelector('[data-a="tutup"]').focus();
  }
  pasangLogo();
  // Ketuk baris = lunas / batal, dengan Urungkan.
  $('#listWarga').addEventListener('click', function (e) {
    var wa = e.target.closest('[data-wa]');
    if (wa) { bukaPengingat(cariWarga(wa.getAttribute('data-wa'))); return; }
    var bt = e.target.closest('[data-bukti]');
    if (bt) { kelolaBukti(cariWarga(bt.getAttribute('data-bukti'))); return; }
    var k = e.target.closest('.ketuk'); if (!k) return;
    var li = k.closest('.baris'), w = cariWarga(li.dataset.id), b = bk(), l = lunasDi(b, w.id), tglLama = l ? D.bayar[b][w.id] : null;
    setLunas(w, b, !l);
    li.classList.toggle('lunas', !l); li.classList.remove('denyut'); void li.offsetWidth; li.classList.add('denyut');
    k.setAttribute('aria-pressed', String(!l));
    setTimeout(function () { renderDaftar(); fokusBaris(w.id); }, S.saring === 'semua' && !S.cari ? 0 : 380);
    renderPahlawan(); renderBulan(); renderSisi();
    toast(w.nama + (l ? ' dibatalkan' : ' lunas ' + rp(D.pengaturan.iuran)), { label: 'Urungkan', fn: function () { setLunas(w, b, l, tglLama); render(); fokusBaris(w.id); } });
  });
  function fokusBaris(id) { var el = $('.baris[data-id="' + id + '"] .ketuk'); if (el && document.activeElement && document.activeElement.closest && !document.activeElement.closest('.baris[data-id="' + id + '"]')) { if (document.activeElement === document.body || document.activeElement.closest('.daftar')) el.focus({ preventScroll: true }); } }
  function cariWarga(id) { return D.warga.filter(function (w) { return w.id === id; })[0]; }
  $('#cari').addEventListener('input', function () { S.cari = this.value.trim(); renderDaftar(); });
  $$('.chip').forEach(function (c) { c.addEventListener('click', function () { S.saring = c.dataset.saring; $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); }); renderDaftar(); tandaiBagian(); }); });
  $('#bulanTab').addEventListener('click', function (e) { var t = e.target.closest('.bln'); if (!t) return; S.bulan = +t.dataset.bln; render(); $('.bln[aria-selected="true"]').focus({ preventScroll: true }); });
  $('#bulanTab').addEventListener('keydown', function (e) {
    var d = { ArrowRight: 1, ArrowLeft: -1, Home: -99, End: 99 }[e.key]; if (d == null) return; e.preventDefault();
    S.bulan = Math.max(0, Math.min(11, S.bulan + d)); render(); $('.bln[aria-selected="true"]').focus();
  });
  $('#tahunMundur').onclick = function () { S.tahun--; render(); };
  $('#tahunMaju').onclick = function () { S.tahun++; render(); };
  // Tab samping dengan penanda geser.
  function pilihTab(id, fokus) {
    S.tab = id; var tabs = $$('.seg [role="tab"]');
    tabs.forEach(function (t, i) { var on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !on; if (on) { $('.seg-penanda').style.transform = 'translateX(' + (i * 100) + '%)'; if (fokus) t.focus(); } });
  }
  $('.seg').addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) pilihTab(t.dataset.tab); });
  $('.seg').addEventListener('keydown', function (e) {
    var ids = ['ingat', 'kas', 'lap'], i = ids.indexOf(S.tab), d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
    e.preventDefault(); pilihTab(ids[(i + d + 3) % 3], true);
  });
  $('#salinGrup').onclick = function () { salin(pesanGrup(), 'Rekap grup'); };
  $('#salinLap').onclick = function () { salin(pesanLaporan().teks, 'Laporan'); };
  $('#bagiLap').onclick = function () {
    var t = pesanLaporan().teks;
    if (navigator.share) navigator.share({ title: 'Laporan kas ' + namaBulan(bk()), text: t }).catch(function () {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
  };
  $('#cetakLap').onclick = function () { window.print(); };
  // Form kas
  function angka(v) { return Number(String(v).replace(/\D/g, '')) || 0; }
  $('#formKas').jumlah.addEventListener('input', function () { var n = angka(this.value); this.value = n ? ribu(n) : ''; });
  $('#formKas').addEventListener('submit', function (e) {
    e.preventDefault(); var f = this, g = $('#galatKas'), n = angka(f.jumlah.value), ket = f.ket.value.trim();
    [f.ket, f.jumlah, f.tgl].forEach(function (x) { x.removeAttribute('aria-invalid'); });
    var salah = !ket ? f.ket : !n ? f.jumlah : !f.tgl.value ? f.tgl : null;
    if (salah) { salah.setAttribute('aria-invalid', 'true'); g.textContent = !ket ? 'Isi keterangan transaksi.' : !n ? 'Jumlah harus lebih dari 0.' : 'Pilih tanggal.'; salah.focus(); return; }
    g.textContent = '';
    var x = { id: idBaru('k'), tgl: f.tgl.value, jenis: f.jenis.value, ket: ket, jumlah: n };
    D.kas.push(x); simpan();
    f.ket.value = ''; f.jumlah.value = '';
    if (x.tgl.slice(0, 7) !== bk()) { var p = x.tgl.split('-'); S.tahun = +p[0]; S.bulan = +p[1] - 1; }
    render(); toast((x.jenis === 'masuk' ? 'Pemasukan ' : 'Pengeluaran ') + rp(n) + ' dicatat');
  });
  $('#listKas').addEventListener('click', function (e) {
    var h = e.target.closest('[data-hapus-kas]'); if (!h) return;
    var id = h.getAttribute('data-hapus-kas'), idx = -1, x;
    D.kas.forEach(function (k, i) { if (k.id === id) { idx = i; x = k; } });
    if (!x) return; D.kas.splice(idx, 1); simpan(); render();
    toast('Transaksi dihapus', { label: 'Urungkan', fn: function () { D.kas.splice(idx, 0, x); simpan(); render(); } });
  });
  // Mode terang/gelap
  $('#btnMode').onclick = function () {
    var m = document.documentElement.getAttribute('data-mode') === 'gelap' ? 'terang' : 'gelap';
    try { localStorage.setItem(KUNCI_MODE, m); } catch (e) {}
    terapkan({ mode: m });
  };

  /* Modal */
  var pemicu = null;
  function bukaModal(judul, html, siap) {
    pemicu = document.activeElement;
    $('#modalJudul').textContent = judul; $('#modalIsi').innerHTML = html;
    var m = $('#modal'); m.hidden = false; m.classList.remove('keluar');
    tandaiBagian();
    var f = $('input,textarea,button:not([data-tutup])', m); if (f) f.focus();
    if (siap) siap($('#modalIsi'));
  }
  function tutupModal() {
    var m = $('#modal'); if (m.hidden) return;
    m.classList.add('keluar');
    setTimeout(function () { m.hidden = true; m.classList.remove('keluar'); if (pemicu && pemicu.focus) pemicu.focus(); }, GERAK ? 200 : 0);
  }
  $('#modal').addEventListener('click', function (e) { if (e.target === this || e.target.closest('[data-tutup]')) tutupModal(); });
  document.addEventListener('keydown', function (e) {
    var m = $('#modal'); if (m.hidden) return;
    if (e.key === 'Escape') tutupModal();
    if (e.key === 'Tab') { var f = $$('button,a[href],input,textarea,select', m).filter(function (x) { return !x.disabled && x.offsetParent; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  function bukaPengingat(w) {
    var t = pesanPengingat(w), n = noWA(w.hp);
    bukaModal('Pengingat untuk ' + w.nama,
      '<p class="sub">Rumah ' + esc(rumah(w)) + (w.hp ? ' · ' + esc(w.hp) : ' · nomor WA belum diisi') + '</p>' +
      '<label class="field"><span>Pesan (boleh diubah)</span><textarea id="tPesan" rows="9">' + esc(t) + '</textarea></label>' +
      '<div class="baris-aksi"><a class="btn btn-wa" id="bWa" target="_blank" rel="noopener">' + IK.wa + '<span>Buka di WhatsApp</span></a><button class="btn btn-garis" type="button" id="bSalin">Salin pesan</button>' +
      '<button class="btn btn-garis" type="button" id="bUbahW">' + IK.ubah + '<span>Ubah data</span></button></div>',
      function (r) {
        function link() { $('#bWa', r).href = 'https://wa.me/' + n + '?text=' + encodeURIComponent($('#tPesan', r).value); }
        link(); $('#tPesan', r).addEventListener('input', link);
        $('#bSalin', r).onclick = function () { salin($('#tPesan', r).value, 'Pesan'); };
        $('#bUbahW', r).onclick = function () { formWarga(w); };
      });
  }
  function formWarga(w) {
    var baru = !w; w = w || { nama: '', blok: 'A', no: '', hp: '' };
    bukaModal(baru ? 'Tambah warga / KK' : 'Ubah data warga',
      '<form id="fW" novalidate class="form-kas">' +
      '<label class="field"><span>Nama kepala keluarga</span><input name="nama" required maxlength="60" value="' + esc(w.nama) + '" autocomplete="off"></label>' +
      '<div class="dua"><label class="field"><span>Blok</span><input name="blok" required maxlength="6" value="' + esc(w.blok) + '"></label><label class="field"><span>No. rumah</span><input name="no" required maxlength="6" value="' + esc(w.no) + '"></label></div>' +
      '<label class="field"><span>No. WhatsApp (opsional)</span><input name="hp" type="tel" inputmode="tel" maxlength="16" placeholder="08xxxxxxxxxx" value="' + esc(w.hp) + '"></label>' +
      '<p class="galat" id="gW" role="alert"></p>' +
      '<div class="baris-aksi"><button class="btn" type="submit">Simpan</button>' + (baru ? '' : '<button class="btn btn-bahaya" type="button" id="hapusW">' + IK.hapus + '<span>Hapus warga</span></button>') + '</div></form>',
      function (r) {
        $('#fW', r).addEventListener('submit', function (e) {
          e.preventDefault(); var f = this, nama = f.nama.value.trim(), blok = f.blok.value.trim().toUpperCase(), no = f.no.value.trim();
          [f.nama, f.blok, f.no].forEach(function (x) { x.removeAttribute('aria-invalid'); });
          var salah = !nama ? f.nama : !blok ? f.blok : !no ? f.no : null;
          if (salah) { salah.setAttribute('aria-invalid', 'true'); $('#gW', r).textContent = 'Nama, blok, dan nomor rumah wajib diisi.'; salah.focus(); return; }
          if (baru) { w = { id: idBaru('w') }; D.warga.push(w); }
          w.nama = nama; w.blok = blok; w.no = no; w.hp = f.hp.value.trim();
          simpan(); tutupModal(); render(); toast(baru ? nama + ' ditambahkan' : 'Data ' + nama + ' disimpan');
        });
        var h = $('#hapusW', r);
        if (h) h.onclick = function () {
          if (!confirm('Hapus ' + w.nama + ' dari daftar? Riwayat iuran yang sudah masuk kas tetap tercatat.')) return;
          D.warga = D.warga.filter(function (x) { return x.id !== w.id; }); simpan(); tutupModal(); render(); toast(w.nama + ' dihapus');
        };
      });
  }
  $('#btnTambahWarga').onclick = function () { formWarga(); };
  $('#btnAtur').onclick = function () {
    var p = D.pengaturan;
    bukaModal('Pengaturan & data',
      '<form id="fA" novalidate class="form-kas">' +
      '<div class="dua"><label class="field"><span>Iuran per KK (Rp)</span><input name="iuran" inputmode="numeric" value="' + ribu(p.iuran) + '"></label><label class="field"><span>Batas bayar (tanggal)</span><input name="batas" type="number" min="1" max="31" value="' + p.batas + '"></label></div>' +
      '<label class="field"><span>Nama bendahara (penutup pesan)</span><input name="bendahara" maxlength="60" value="' + esc(p.bendahara) + '"></label>' +
      '<label class="field"><span>Cara bayar (muncul di pesan)</span><textarea name="bayarKe" rows="2" maxlength="160">' + esc(p.bayarKe) + '</textarea></label>' +
      '<p class="galat" id="gA" role="alert"></p><button class="btn lebar" type="submit">Simpan pengaturan</button></form>' +
      '<p class="sub">Nama RT & warna diatur di <b>tema.js</b> / <b>tema.css</b>. Ubah nominal iuran tidak mengubah pembayaran yang sudah tercatat.</p>' +
      '<div class="baris-aksi"><button class="btn btn-garis" type="button" id="isiContoh">Isi data contoh</button><button class="btn btn-bahaya" type="button" id="kosongkan">' + IK.hapus + '<span>Kosongkan semua</span></button></div>',
      function (r) {
        var f = $('#fA', r);
        f.iuran.addEventListener('input', function () { var n = angka(this.value); this.value = n ? ribu(n) : ''; });
        f.addEventListener('submit', function (e) {
          e.preventDefault(); var n = angka(f.iuran.value), bt = +f.batas.value;
          if (!n || bt < 1 || bt > 31) { $('#gA', r).textContent = !n ? 'Iuran harus lebih dari 0.' : 'Tanggal batas 1–31.'; (n ? f.batas : f.iuran).setAttribute('aria-invalid', 'true'); return; }
          Object.assign(D.pengaturan, { iuran: n, batas: bt, bendahara: f.bendahara.value.trim() || 'Bendahara RT', bayarKe: f.bayarKe.value.trim() });
          simpan(); tutupModal(); render(); toast('Pengaturan disimpan');
        });
        $('#isiContoh', r).onclick = function () { if (!confirm('Ganti semua data dengan data contoh? Buat Backup JSON dulu bila perlu.')) return; D = window.DATA_CONTOH(); migrasi(D); simpan(); tutupModal(); render(); toast('Data contoh dimuat'); };
        $('#kosongkan', r).onclick = function () {
          if (!confirm('Hapus SEMUA warga, iuran, dan kas di perangkat ini? Tidak bisa dibatalkan kecuali kamu punya Backup JSON.')) return;
          D = { versi: 1, pengaturan: D.pengaturan, warga: [], bayar: {}, kas: [] }; simpan(); tutupModal(); render(); toast('Semua data dikosongkan');
        };
      });
  };

  /* ========== 6. Ekspor & cadangan ========== */
  function unduh(nama, isi, tipe) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([isi], { type: tipe })); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function sel(v) { v = String(v == null ? '' : v); if (/^[=+\-@]/.test(v)) v = "'" + v; return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  $('#eksCsv').onclick = function () {
    var b = bk(), baris = [['Bagian', 'Tanggal', 'Rumah', 'Nama / Keterangan', 'Status / Jenis', 'Jumlah']];
    D.warga.slice().sort(function (x, y) { return rumah(x).localeCompare(rumah(y), 'id', { numeric: true }); }).forEach(function (w) {
      var l = lunasDi(b, w.id); baris.push(['Iuran ' + namaBulan(b), l ? D.bayar[b][w.id] : '', rumah(w), w.nama, l ? 'Lunas' : 'Belum', l ? D.pengaturan.iuran : 0]);
    });
    D.kas.slice().sort(function (x, y) { return x.tgl < y.tgl ? -1 : 1; }).forEach(function (x) { baris.push(['Kas', x.tgl, '', x.ket, x.jenis, (x.jenis === 'masuk' ? 1 : -1) * x.jumlah]); });
    unduh('iuran-kas-' + b + '.csv', '﻿' + baris.map(function (r) { return r.map(sel).join(','); }).join('\r\n'), 'text/csv;charset=utf-8');
    toast('CSV diunduh: iuran ' + namaBulan(b) + ' + semua kas');
  };
  $('#eksJson').onclick = function () { unduh('backup-iuran-kas-' + hariIni() + '.json', JSON.stringify(D, null, 2), 'application/json'); toast('Backup JSON diunduh'); };
  $('#impJson').onclick = function () { $('#berkasJson').click(); };
  $('#berkasJson').onchange = function () {
    var f = this.files[0]; if (!f) return; var self = this;
    f.text().then(function (t) {
      var d = JSON.parse(t);
      if (!d || !Array.isArray(d.warga) || !Array.isArray(d.kas)) throw new Error('format');
      if (!confirm('Pulihkan dari ' + f.name + '? Data sekarang akan diganti (' + d.warga.length + ' warga, ' + d.kas.length + ' transaksi).')) return;
      migrasi(d); D = d; simpan(); render(); toast('Data dipulihkan dari backup');
    }).catch(function () { toast('Berkas bukan backup Iuran & Kas RT yang valid'); }).then(function () { self.value = ''; });
  };

  /* Mulai */
  muat();
  try { if (!localStorage.getItem(KUNCI)) simpan(); } catch (e) {}
  if (window.TEMA && TEMA.nama) $$('[data-tema-nama]').forEach(function (el) { el.textContent = TEMA.nama; });
  hitungKontras();
  render();
  pilihTab('ingat');
})();
