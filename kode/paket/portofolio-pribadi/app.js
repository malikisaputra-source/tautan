/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Render beranda (index.html) & detail karya (karya.html?id=...) dari window.DATA, lalu gerak & tema. */
(function () {
  'use strict';
  var D = window.DATA || {}, T = window.TEMA || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var REDUKSI = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NAMA = T.nama || D.nama || 'Portofolio';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // "Teks biasa {miring}" -> teks biasa + <span class="serif">miring</span>
  function miring(s) { return esc(s).replace(/\{([^}]*)\}/g, '<span class="serif">$1</span>'); }
  function tebal(s) { return esc(s).replace(/\{([^}]*)\}/g, '<b>$1</b>'); }
  function polos(s) { return String(s || '').replace(/[{}]/g, ''); }

  var IK = {
    email: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    bintang: '<path d="M12 3v18"/><path d="M3 12h18"/><path d="m5.6 5.6 12.8 12.8"/><path d="m18.4 5.6-12.8 12.8"/>',
    megafon: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    tim: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    labu: '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
    grafik: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    dokumen: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    panah: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'
  };
  function ikon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IK[n] || IK.bintang) + '</svg>'; }
  function obj(src, cls, uk) { return src ? '<span class="obj ' + (cls || '') + '" aria-hidden="true"><img src="' + esc(src) + '" alt="" sizes="' + (uk || '200px') + '" loading="lazy" decoding="async"></span>' : ''; }
  function sampul(k) { return '<div class="cover gambar"><img src="' + esc(k.sampul) + '" alt="Sampul karya: ' + esc(polos(k.judul)) + '" width="900" height="600" loading="lazy"></div>'; }
  function urlKarya(k) { return 'karya.html?id=' + encodeURIComponent(k.id); }
  var karya = D.karya || [];
  var unggulan = karya.filter(function (k) { return k.unggulan; });
  var emailUrl = 'mailto:' + (D.email || '');

  // ---------- Beranda ----------
  function beranda() {
    var sos = D.sosial || [];
    var linkedin = sos.filter(function (s) { return s.ikon === 'linkedin'; })[0];
    var klien = (D.klien || []).map(function (c) { return '<img src="' + esc(c.logo) + '" alt="" height="48"><span class="nama-klien">' + esc(c.nama) + '</span>' + ikon('bintang'); });
    var p = D.pernyataan || {};
    var chip = function (c) { return '<li class="chip" data-bagian="panel"><i>' + ikon(c.ikon) + '</i>' + esc(c.teks) + '</li>'; };
    var langkah = D.cara || [];
    var angka = D.angka || [];
    var bulan = function (x) { return x.selesai ? esc(x.mulai) + ikon('panah') + esc(x.selesai) : esc(x.mulai); };

    $('#main').innerHTML =
      '<section class="hero" aria-labelledby="hero-h"><div class="wrap">' +
        (D.lencana ? '<p class="badge rise">' + obj(D.lencana.objek, '', '42px').replace('loading="lazy"', 'loading="eager"') + esc(D.lencana.teks) + '</p>' : '') +
        '<h1 id="hero-h" data-bagian="teks"><span class="h-sans rise" style="--d:.05s">' + esc(D.sapaan) + '</span><span class="h-serif serif rise" style="--d:.12s">' + esc(polos(D.peran)) + '</span></h1>' +
        '<div class="stage"><div class="stage-side">' +
          (D.pil || []).map(function (t, i) { return '<p class="pill rise" style="--d:' + (.35 + i * .05) + 's" data-bagian="panel"><span class="dot' + (i ? ' ink' : '') + '" aria-hidden="true"></span>' + esc(t) + '</p>'; }).join('') +
          '<p class="trained rise" style="--d:.45s">' + tebal(D.latar) + '</p></div>' +
          '<div class="portrait-wrap">' + obj((karya[0] || {}).objek, 'float o-flask', '144px') + '<figure class="portrait rise" style="--d:.2s"><img src="' + esc(D.foto) + '" alt="' + esc(D.fotoAlt || D.nama) + '" width="512" height="640" fetchpriority="high"></figure></div>' +
          '<div class="stage-side right"><p class="lead rise" style="--d:.4s">' + esc(D.lead) + '</p><div class="hero-cta rise" style="--d:.5s"><a class="btn" href="' + esc(emailUrl) + '" data-bagian="utama">' + ikon('email') + 'Kirim email</a>' +
          (linkedin ? '<a class="btn ghost" href="' + esc(linkedin.url) + '" rel="me noopener" target="_blank">' + ikon('linkedin') + 'LinkedIn</a>' : '') + '</div></div>' +
        '</div></div>' +
        (klien.length ? '<div class="marquee" aria-labelledby="mq-h"><p class="marquee-title" id="mq-h">' + esc(D.judulKlien) + '</p><ul class="marquee-track">' +
          klien.map(function (k) { return '<li>' + k + '</li>'; }).join('') + klien.map(function (k) { return '<li aria-hidden="true">' + k + '</li>'; }).join('') + '</ul></div>' : '') +
      '</section>' +

      '<section class="section statement" aria-labelledby="focus-h"><div class="wrap"><p class="hallo">' + esc(p.sapa) + '</p><div class="statement-grid">' +
        '<ul class="chips l">' + (p.kiri || []).map(chip).join('') + '</ul>' +
        '<h2 id="focus-h" class="big" data-words data-bagian="teks">' + esc(p.teks) + '</h2>' +
        '<ul class="chips r">' + (p.kanan || []).map(chip).join('') + '</ul></div></div></section>' +

      '<section class="section tight-top" id="karya" aria-labelledby="work-h"><div class="wrap"><p class="label">/ Karya pilihan</p><h2 id="work-h" class="h2">' + miring((D.judulKarya || '').replace('{n}', unggulan.length)) + '</h2><div class="works">' +
        unggulan.map(function (k) {
          return '<a class="work" href="' + urlKarya(k) + '"><div class="work-media" data-bagian="panel">' + sampul(k) + obj(k.objek, 'float', '210px') + '</div>' +
            '<div class="work-meta"><h3>' + esc(polos(k.judul)) + '</h3><p>' + esc(k.klien) + ' · ' + esc(k.tahun) + '</p><div class="tags">' + (k.tag || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div></div></a>';
        }).join('') + '</div></div></section>' +

      (angka.length ? '<section class="section" aria-labelledby="num-h"><div class="wrap numbers"><div class="numbers-head"><h2 id="num-h" class="h2 left">' + miring(D.judulAngka) + '</h2><p>' + esc(D.ketAngka) + '</p></div><div class="numbers-list">' +
        angka.map(function (a) { return '<figure class="num"><p class="val">' + esc(a.nilai) + ' <span class="serif">' + esc(a.satuan) + '</span></p><p>' + esc(a.ket) + '</p><figcaption class="src"><i data-bagian="aksen">' + ikon('dokumen') + '</i><span><b>' + esc(a.sumber) + '</b><span>' + esc(a.sumberKet) + '</span></span></figcaption></figure>'; }).join('') +
        '</div></div></section>' : '') +

      (langkah.length ? '<section class="section process tight-top" aria-labelledby="how-h"><div class="wrap"><p class="label">/ Cara saya bekerja</p><h2 id="how-h" class="h2">' + miring(D.judulCara) + '</h2><div class="steps">' +
        '<svg class="squiggle s1" viewBox="0 0 140 70" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="60" r="5"/><path d="M10 55C20 20 60 8 110 10"/><circle cx="118" cy="10" r="5"/></svg>' +
        '<svg class="squiggle s2" viewBox="0 0 140 70" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="30" r="5"/><path d="M13 30c30 0 40-10 60-14 18-4 22 14 10 18-14 4-8-24 4-20 10 4 16 26 24 40"/><circle cx="114" cy="58" r="5"/></svg>' +
        langkah.map(function (s, i) { return '<article class="step" data-bagian="panel"><div class="step-top"><p class="n">0' + (i + 1) + '</p>' + obj(s.objek, 'float', '120px') + '</div><div><h3>' + esc(s.judul) + '</h3><p>' + esc(s.ket) + '</p></div></article>'; }).join('') +
        '</div></div></section>' : '') +

      '<section class="section tight-top" aria-labelledby="shelf-h"><div class="wrap"><div class="shelf di-utama" data-bagian="utama"><div class="shelf-head"><h2 id="shelf-h">' + esc(polos((D.judulRak || '').replace('{n}', karya.length))) + '</h2><p>' + esc(D.ketRak) + '</p></div><ul class="shelf-grid">' +
        karya.map(function (k) { return '<li style="display:contents"><a class="thing" href="' + urlKarya(k) + '" aria-label="' + esc(k.label + ': ' + polos(k.judul)) + '">' + obj(k.objek, '', '152px').replace('class="obj "', 'class="obj"') + '<span class="thing-label" aria-hidden="true">' + esc(k.label) + '</span></a></li>'; }).join('') +
        '</ul></div></div></section>' +

      '<section class="section roomy-top" id="tentang" aria-labelledby="who-h"><div class="wrap about-grid"><div><figure class="about-photo"><img src="' + esc(D.foto) + '" alt="" width="512" height="640" loading="lazy"></figure>' +
        '<div class="about-foot"><div class="socials">' + sos.map(function (s) { return '<a href="' + esc(s.url) + '" aria-label="' + esc(s.nama) + '"' + (/^http/.test(s.url) ? ' target="_blank" rel="me noopener"' : '') + '>' + ikon(s.ikon) + '</a>'; }).join('') + '</div><p class="who">' + esc(D.nama) + '<span>' + esc(D.kota) + '</span></p></div></div>' +
        '<div><p class="label left">/ Tentang saya</p><h2 id="who-h" class="h2 left">' + miring(D.judulTentang) + '</h2>' +
        (D.tentang || []).map(function (t, i) { return '<p class="about-text"' + (i ? '' : ' style="margin-top:1.5rem"') + '>' + esc(t) + '</p>'; }).join('') +
        '<ul class="xp">' + (D.pengalaman || []).map(function (x) { return '<li><span class="role">' + esc(x.peran) + '</span><span class="org">' + esc(x.tempat) + '</span><span class="yrs">' + bulan(x) + '</span></li>'; }).join('') + '</ul></div></div></section>';
  }

  // ---------- Detail karya ----------
  var PORSI = { sendiri: ['own', 'Sendiri'], pimpin: ['led', 'Memimpin'], tim: ['team', 'Tim'] };
  function detail() {
    var id = new URLSearchParams(location.search).get('id');
    var i = -1; karya.forEach(function (k, j) { if (k.id === id) i = j; });
    if (i < 0) { if (karya.length) { i = 0; } else { $('#main').innerHTML = '<p class="kosong">Belum ada karya di data.js.</p>'; return; } }
    var k = karya[i], lanjut = karya[(i + 1) % karya.length];
    document.title = polos(k.judul) + ' — ' + NAMA;
    var fakta = [k.klien, k.peran, k.tahun].filter(Boolean);
    var as = k.angkaSamping || [];
    var fig = function (a) { return a ? '<p class="margin-fig"><b>' + esc(a.b) + '</b><span>' + esc(a.t) + '</span></p>' : ''; };
    var blok = [];
    if (k.tantangan) blok.push(['tantangan', 'Tantangannya', '<p class="text">' + esc(k.tantangan) + '</p>', '']);
    if (k.dilakukan) blok.push(['dilakukan', 'Yang saya lakukan', '<p class="text">' + esc(k.dilakukan) + '</p>', '']);
    if ((k.hasil || []).length || (k.statistik || []).length) blok.push(['hasil', 'Hasilnya', '<div class="prose" style="margin-top:.8rem">' + (k.hasil || []).map(function (h) { return '<p>' + esc(h) + '</p>'; }).join('') + '</div>' +
      ((k.statistik || []).length ? '<ul class="stats">' + k.statistik.map(function (s) { return '<li class="stat" data-bagian="panel"><b>' + esc(s.b) + '</b><span>' + esc(s.t) + '</span></li>'; }).join('') + '</ul>' : ''), ' full']);
    if ((k.bagian || []).length) blok.push(['bagian', 'Bagian saya', '<ul class="scope" style="margin-top:1.2rem">' + k.bagian.map(function (b) { var p = PORSI[b.p] || PORSI.tim; return '<li><span>' + esc(b.t) + '</span><span class="portion" data-p="' + p[0] + '">' + p[1] + '</span></li>'; }).join('') + '</ul>', ' full']);
    if (k.pelajaran) blok.push(['pelajaran', 'Yang saya pelajari', '<p class="lesson" data-words>' + esc(k.pelajaran) + '</p>', ' full']);

    $('#main').innerHTML =
      '<section class="case-hero"><div class="wrap"><a class="back rise" href="index.html#karya">' + ikon('panah') + '<span>Semua karya</span></a>' +
        '<h1 class="rise" style="--d:.05s" data-bagian="teks">' + miring(k.judul) + '</h1>' +
        '<ul class="case-meta rise" style="--d:.12s" aria-label="Fakta proyek">' + fakta.map(function (f) { return '<li class="pill" data-bagian="panel">' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<p class="case-summary rise" style="--d:.18s">' + esc(k.ringkas) + '</p>' +
        '<div class="case-cover rise di-utama" style="--d:.24s" data-bagian="utama">' + obj(lanjut && lanjut !== k ? lanjut.objek : '', 'float side', '160px') + sampul(k).replace('loading="lazy"', 'loading="eager"') + obj(k.objek, 'float main', '256px') + '</div>' +
      '</div></section>' +
      '<div class="wrap case-body"><aside class="case-nav" aria-label="Di halaman ini">' + blok.slice(0, 4).map(function (b) { return '<a href="#' + b[0] + '">' + b[1] + '</a>'; }).join('') +
        '<dl><div><dt>Klien / organisasi</dt><dd>' + esc(k.klien) + '</dd></div><div><dt>Peran</dt><dd>' + esc(k.peran) + '</dd></div><div><dt>Waktu</dt><dd>' + esc(k.tahun) + '</dd></div></dl></aside>' +
        '<article class="case-article">' + blok.map(function (b, j) { return '<section class="block' + b[3] + '" aria-labelledby="' + b[0] + '"><h2 id="' + b[0] + '">' + b[1] + '</h2>' + b[2] + '</section>' + (j < 2 ? fig(as[j]) : ''); }).join('') + '</article></div>' +
      (lanjut && lanjut !== k ? '<div class="wrap" style="padding-bottom:var(--sp-tight)"><a class="next-case" href="' + urlKarya(lanjut) + '"><small>Karya berikutnya</small><span>' + esc(polos(lanjut.judul)) + ikon('panah') + '</span></a></div>' : '');
  }

  // ---------- Ajakan + footer (kedua halaman) ----------
  function akhir() {
    var sos = D.sosial || [];
    $('#akhir').outerHTML =
      '<section class="cta" id="kontak" aria-labelledby="cta-h"><div class="wrap cta-inner">' + obj('img/objek/envelope.webp', 'float o-envelope', '136px') + obj('img/objek/paperplane.webp', 'float o-plane', '168px') +
        '<h2 id="cta-h" data-bagian="teks">' + miring(D.judulAjak) + '</h2><p>' + esc(D.ketAjak) + '</p><a class="btn" href="' + esc(emailUrl) + '" data-bagian="utama">' + ikon('email') + esc(D.tombolAjak || 'Hubungi saya') + '</a></div></section>' +
      '<footer class="foot" data-bagian="nav"><div class="wrap"><div class="foot-row"><ul><li><a href="index.html">Beranda</a></li><li><a href="index.html#karya">Karya</a></li><li><a href="index.html#tentang">Tentang</a></li><li><a href="index.html#kontak">Kontak</a></li>' +
        sos.filter(function (s) { return /^http/.test(s.url); }).map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.nama) + '</a></li>'; }).join('') +
        '</ul><small>© ' + new Date().getFullYear() + ' <span data-tema-nama>' + esc(NAMA) + '</span></small></div>' +
        '<p class="kredit">Template oleh <a href="https://malikisaputra.biz.id" target="_blank" rel="noopener">@malikisaputra</a> · Maliki Saputra</p></div>' +
        '<p class="giant" aria-hidden="true">' + esc(D.namaRaksasa || '') + '</p></footer>';
  }

  // ---------- Gerak ----------
  function gerak() {
    var mo = html.classList.contains('mo');
    var antre = '.shelf-head,.shelf-grid .thing,.statement-grid .chip,.steps .step,.numbers-head,.numbers-list .num,.works .work,.about-grid > *,.xp li,.case-body .block,.case-nav,.stats .stat,.scope li,.next-case'.split(',');
    var judul = ['main .h2', '.cta h2', '.num .val', '.margin-fig b', '.lesson', '.hallo', '.label:not(.rise)'];
    var benda = ['.section .obj.float', '.cta .obj.float'];
    if (mo) {
      // judul hero muncul per kata (stagger)
      var nk = 0;
      $$('.hero h1 .rise').forEach(function (sp) {
        var ws = sp.textContent.split(/(\s+)/); sp.textContent = '';
        ws.forEach(function (w) { if (!w) return; if (/^\s+$/.test(w)) { sp.append(w); return; } var k = document.createElement('span'); k.className = 'kt'; k.textContent = w; k.style.setProperty('--kd', (nk++ * .07).toFixed(2) + 's'); sp.append(k); });
      });
      var io = new IntersectionObserver(function (es) {
        es.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; })
          .sort(function (a, b) { var r = a.getBoundingClientRect(), s = b.getBoundingClientRect(); return r.top - s.top || r.left - s.left; })
          .forEach(function (t, n) { t.style.setProperty('--rv-d', Math.min(n, 8) * .06 + 's'); t.classList.add('in'); io.unobserve(t); });
      }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
      $$('.rise').forEach(function (t) { io.observe(t); });
      $$(antre.concat(benda).join(',')).forEach(function (t) { io.observe(t); });
      var grup = new Map();
      $$(judul.join(',')).forEach(function (e) { var p = e.parentElement || e; grup.set(p, (grup.get(p) || []).concat(e)); });
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (r) { if (!r.isIntersecting) return; (grup.get(r.target) || []).forEach(function (e, n) { e.style.setProperty('--rv-d', n * .08 + 's'); e.classList.add('in'); }); io2.unobserve(r.target); });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
      grup.forEach(function (_, p) { io2.observe(p); });
    }
    // kata menyala satu per satu saat digulir
    var kata = $$('[data-words]').map(function (el) {
      var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
      while (tw.nextNode()) nodes.push(tw.currentNode);
      nodes.forEach(function (n) {
        var f = document.createDocumentFragment();
        (n.textContent || '').split(/(\s+)/).forEach(function (w) { if (!w) return; if (/^\s+$/.test(w)) f.append(w); else { var s = document.createElement('span'); s.className = 'w'; s.textContent = w; f.append(s); } });
        n.replaceWith(f);
      });
      el.classList.add('words'); return { el: el, w: $$('.w', el), lit: -1 };
    });
    var top = $('.top'), y0 = scrollY, tunggu = false;
    function gulir() {
      if (tunggu) return; tunggu = true;
      requestAnimationFrame(function () {
        tunggu = false; var h = innerHeight;
        kata.forEach(function (k) {
          var r = k.el.getBoundingClientRect(), p = Math.min(1, Math.max(0, (h * .85 - r.top) / (r.height + h * .4))), n = REDUKSI ? k.w.length : Math.round(p * k.w.length);
          if (n !== k.lit) { k.w.forEach(function (e, i) { e.classList.toggle('on', i < n); }); k.lit = n; }
        });
        if (top) { var y = scrollY, lewat = y > 160; top.classList.toggle('pinned', lewat); top.classList.toggle('away', lewat && y > y0 + 2 && !top.contains(document.activeElement)); if (y < y0 - 2 || !lewat) top.classList.remove('away'); y0 = y; }
      });
    }
    addEventListener('scroll', gulir, { passive: true }); addEventListener('resize', gulir, { passive: true }); gulir();
    // benda 3D bergeser mengikuti kursor (desktop)
    if (!REDUKSI && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.hero, .case-hero').forEach(function (z) {
        var os = $$('.obj', z).map(function (e, i) { return { el: e, k: (i % 2 ? -1 : 1) * (10 + i % 3 * 6) }; });
        if (!os.length) return;
        var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
        function langkah() { x += (tx - x) * .08; y += (ty - y) * .08; os.forEach(function (o) { o.el.style.translate = (x * o.k).toFixed(2) + 'px ' + (y * o.k).toFixed(2) + 'px'; }); raf = Math.abs(tx - x) + Math.abs(ty - y) > .001 ? requestAnimationFrame(langkah) : 0; }
        z.addEventListener('pointermove', function (e) { var r = z.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; raf = raf || requestAnimationFrame(langkah); });
        z.addEventListener('pointerleave', function () { tx = 0; ty = 0; raf = raf || requestAnimationFrame(langkah); });
      });
    }
    html.classList.add('mo-ready');
  }

  // ---------- Mode terang/gelap ----------
  function pasangMode() {
    var b = $('#gantiMode'); if (!b) return;
    b.addEventListener('click', function () {
      var m = html.getAttribute('data-mode') === 'gelap' ? 'terang' : 'gelap';
      html.setAttribute('data-mode', m); try { localStorage.setItem('portofolio.mode', m); } catch (e) {}
    });
  }

  // ---------- Tema (customizer Maliki Studio, lihat tema.css & tema.js & kode/TEMA.md) ----------
  var FONT_OK = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  function terapkanTema(t) {
    var st = html.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama);
    if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) st.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var f = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      st.setProperty('--tema-font', '"' + f + '", system-ui, sans-serif');
      var l = $('#fontTema'); if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@300;400;500;600;700&display=swap';
    }
    if (t.mode) html.setAttribute('data-mode', t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode);
    if (t.bagian) terapkanBagian(t.bagian);
    if (t.nama) { NAMA = t.nama; isiNama(); }
    setTimeout(hitungTeksBagian, 0);
  }
  function isiNama() { $$('[data-tema-nama]').forEach(function (e) { e.textContent = NAMA; }); if (!/karya\.html/.test(location.pathname)) document.title = NAMA + ' — ' + polos(D.peran); }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var BAGIAN = ['latar', 'panel', 'nav', 'teks'];
  function warnaNyata(v) {
    var p = document.createElement('i'); p.style.cssText = 'position:absolute;width:0;height:0;background:var(' + v + ')';
    document.body.appendChild(p); var c = getComputedStyle(p).backgroundColor; p.remove();
    var m = (c.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
    if (/^color\(srgb/.test(c)) m = m.map(function (x) { return x * 255; });
    return m.slice(0, 3);
  }
  function terang(v) {
    var l = warnaNyata(v).map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4;
  }
  function hitungTeksBagian() {
    var st = html.style, u = terang('--tema-utama');
    st.setProperty('--tema-nav-teks', terang('--tema-nav') ? '#141712' : '#ffffff');
    st.setProperty('--tema-utama-teks', u ? '#141712' : '#ffffff');
    st.setProperty('--tema-utama-lawan', u ? '#fafbf8' : '#141712');
  }
  function terapkanBagian(bg) {
    var st = html.style;
    BAGIAN.forEach(function (k) { if (bg[k] === undefined) return; if (bg[k]) st.setProperty('--tema-' + k, bg[k]); else st.removeProperty('--tema-' + k); });
  }
  function sorot(b) {
    $$('[data-sorot]').forEach(function (e) { e.removeAttribute('data-sorot'); });
    $$('.label-sorot').forEach(function (e) { e.remove(); });
    if (!b) return;
    $$('[data-bagian="' + b + '"]').forEach(function (e) {
      e.setAttribute('data-sorot', '');
      var r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
      var lb = document.createElement('span'); lb.className = 'label-sorot'; lb.textContent = NAMA_BAGIAN[b] || b;
      lb.style.left = Math.max(2, r.left + 4) + 'px'; lb.style.top = Math.max(2, r.top + 4) + 'px';
      document.body.appendChild(lb);
    });
  }
  var modePilih = false, hoverEl = null;
  function bagianDari(t) { return t && t.closest ? t.closest('[data-bagian]') : null; }
  function setPilih(on) {
    modePilih = !!on; html.classList.toggle('mode-pilih', modePilih);
    if (!modePilih && hoverEl) { hoverEl.removeAttribute('data-pilih-hover'); hoverEl = null; }
  }
  ['click', 'pointerdown', 'mousedown', 'touchstart', 'submit', 'keydown'].forEach(function (tipe) {
    document.addEventListener(tipe, function (e) {
      if (!modePilih) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (tipe === 'click') { var el = bagianDari(e.target); if (el) parent.postMessage({ tipe: 'bagian-dipilih', bagian: el.getAttribute('data-bagian') }, '*'); }
    }, { capture: true, passive: false });
  });
  document.addEventListener('mouseover', function (e) {
    if (!modePilih) return; var el = bagianDari(e.target);
    if (hoverEl && hoverEl !== el) hoverEl.removeAttribute('data-pilih-hover');
    hoverEl = el; if (el) el.setAttribute('data-pilih-hover', '');
  }, true);
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d) return;
    if (d.tipe === 'sorot') sorot(d.bagian || null);
    else if (d.tipe === 'mode-pilih') setPilih(d.aktif);
  });
  new MutationObserver(hitungTeksBagian).observe(html, { attributes: true, attributeFilter: ['data-mode'] });

  // ---------- Mulai ----------
  var ikonFav = document.querySelector('link[rel=icon]'); if (ikonFav && D.logo) ikonFav.href = D.logo;
  if ($('#logo') && D.logo) $('#logo').src = D.logo;
  if (D.og) { var og = document.createElement('meta'); og.setAttribute('property', 'og:image'); og.content = D.og; document.head.appendChild(og); }
  if ($('#akhir')) akhir();
  if (/karya\.html/.test(location.pathname)) detail(); else beranda();
  isiNama(); hitungTeksBagian(); pasangMode(); gerak();
  if (location.hash && $(location.hash)) $(location.hash).scrollIntoView();
})();
