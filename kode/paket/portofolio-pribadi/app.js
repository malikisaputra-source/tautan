/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
(function () {
  'use strict';
  var D = window.DATA || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = window.gsap && GERAK ? window.gsap : null;
  if (G && window.ScrollTrigger) G.registerPlugin(window.ScrollTrigger);
  var NAMA = (window.TEMA && TEMA.nama) || 'Portofolio';
  var IKON_CEK = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';

  // ---------- Toast ----------
  var tt;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('tampil'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('tampil'); }, 2600); }

  // ---------- Sampul karya (ilustrasi SVG otomatis, ganti dengan gambar lewat field "gambar") ----------
  function sampul(k, i) {
    if (k.gambar) return '<div class="sampul" style="--c:' + esc(k.warna) + '"><img src="' + esc(k.gambar) + '" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy"><span class="no">0' + (i + 1) + '</span></div>';
    var w = esc(k.warna || '#444'), isi;
    var t = 'rgb(255 255 255 / .92)', t2 = 'rgb(255 255 255 / .35)';
    if (k.bentuk === 'hp') isi = '<rect x="230" y="40" width="140" height="270" rx="22" fill="' + t + '"/><rect x="246" y="70" width="108" height="56" rx="10" fill="' + w + '" opacity=".85"/><rect x="246" y="138" width="70" height="10" rx="5" fill="' + w + '" opacity=".4"/><rect x="246" y="158" width="108" height="34" rx="8" fill="' + w + '" opacity=".2"/><rect x="246" y="200" width="108" height="34" rx="8" fill="' + w + '" opacity=".2"/><rect x="246" y="264" width="108" height="28" rx="14" fill="' + w + '"/><rect x="390" y="90" width="110" height="200" rx="18" fill="' + t2 + '"/><rect x="100" y="110" width="110" height="200" rx="18" fill="' + t2 + '"/>';
    else if (k.bentuk === 'web') isi = '<rect x="70" y="50" width="460" height="260" rx="14" fill="' + t + '"/><circle cx="92" cy="70" r="5" fill="' + w + '" opacity=".5"/><circle cx="108" cy="70" r="5" fill="' + w + '" opacity=".35"/><rect x="92" y="98" width="200" height="22" rx="6" fill="' + w + '"/><rect x="92" y="130" width="150" height="10" rx="5" fill="' + w + '" opacity=".35"/><rect x="92" y="170" width="130" height="110" rx="10" fill="' + w + '" opacity=".2"/><rect x="236" y="170" width="130" height="110" rx="10" fill="' + w + '" opacity=".35"/><rect x="380" y="98" width="130" height="182" rx="10" fill="' + w + '" opacity=".75"/>';
    else if (k.bentuk === 'logo') isi = '<circle cx="300" cy="180" r="110" fill="' + t + '"/><path d="M240 210 Q300 90 360 210" stroke="' + w + '" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="300" cy="150" r="16" fill="' + w + '"/><rect x="60" y="290" width="90" height="28" rx="14" fill="' + t2 + '"/><rect x="460" y="40" width="80" height="80" rx="40" fill="' + t2 + '"/>';
    else isi = '<path d="M80 300 Q160 80 300 160 T520 90" stroke="' + t + '" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="190" cy="140" r="54" fill="' + t + '"/><circle cx="190" cy="140" r="22" fill="' + w + '"/><path d="M380 230 l40 -70 l40 70z" fill="' + t2 + '"/><circle cx="460" cy="250" r="30" fill="' + t + '"/>';
    return '<div class="sampul" style="--c:' + w + '"><svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + isi + '</svg><span class="no">0' + (i + 1) + '</span></div>';
  }

  // ---------- Render ----------
  function render() {
    document.title = NAMA + ' — ' + (D.peran || 'Portofolio');
    $$('[data-tema-nama]').forEach(function (e) { e.textContent = NAMA; });
    $('#status').textContent = D.status || '';
    $('#judulBesar').innerHTML = (D.judulBesar || [NAMA]).map(function (b) { return '<span class="baris"><span>' + esc(b) + '</span></span>'; }).join('');
    var f = $('#foto'); f.src = D.foto || 'img/potret.svg'; f.alt = 'Potret ' + NAMA;
    $('#peran').textContent = D.peran || '';
    $('#ringkas').textContent = D.ringkas || '';
    var cv = $('#unduhCV'); cv.href = D.cv || 'cv.html'; if (/\.html?$/i.test(cv.href)) { cv.removeAttribute('download'); cv.target = '_blank'; }
    $('#angka').innerHTML = (D.angka || []).map(function (a) { return '<div><dt><span class="hitung" data-n="' + Number(a.nilai) + '">' + Number(a.nilai) + '</span>' + esc(a.akhiran) + '</dt><dd>' + esc(a.label) + '</dd></div>'; }).join('');
    var pita = (D.keahlian || []).map(function (k) { return '<span>' + esc(k.nama) + '</span>'; }).join('');
    $('#pita').innerHTML = pita + pita;
    $('#tentangTeks').innerHTML = (D.tentang || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('#keahlianList').innerHTML = (D.keahlian || []).map(function (k) { return '<li><div class="atas">' + esc(k.nama) + '<b>' + Number(k.level) + '%</b></div><div class="bar" role="presentation"><i style="--w:' + Number(k.level) + '%"></i></div></li>'; }).join('');
    $('#alatList').innerHTML = (D.alat || []).map(function (a) { return '<li data-bagian="aksen">' + esc(a) + '</li>'; }).join('');
    renderFilter(); renderKarya('Semua', true);
    $('#timeline').innerHTML = (D.pengalaman || []).map(function (p) { return '<li><div class="th">' + esc(p.tahun) + '</div><div><h3>' + esc(p.posisi) + '</h3><p class="tmp">' + esc(p.tempat) + '</p></div><p class="ket">' + esc(p.ket) + '</p></li>'; }).join('');
    $('#layananList').innerHTML = (D.layanan || []).map(function (l, i) { return '<li><span class="n">0' + (i + 1) + '</span><div><h3>' + esc(l.judul) + '</h3><p>' + esc(l.ket) + '</p>' + (l.harga ? '<span class="harga" data-bagian="aksen">' + esc(l.harga) + '</span>' : '') + '</div></li>'; }).join('');
    $('#fJenis').innerHTML = (D.layanan || []).map(function (l) { return '<option>' + esc(l.judul) + '</option>'; }).join('') + '<option>Lainnya</option>';
    var wa = String(D.wa || '').replace(/\D/g, '');
    $('#tombolWA').href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Halo ' + NAMA + ', saya lihat portofolio Anda dan ingin diskusi proyek.');
    $('#tombolEmail').href = 'mailto:' + (D.email || '');
    $('#teksEmail').textContent = D.email || '';
    $('#sosial').innerHTML = (D.sosial || []).map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.nama) + ' ↗</a></li>'; }).join('');
    $('#tahun').textContent = new Date().getFullYear();
    $('#kotaKaki').textContent = D.kota || '';
    renderTesti(0);
  }

  // ---------- Karya + filter ----------
  var karya = D.karya || [], aktifKat = 'Semua', daftarTampil = [];
  function renderFilter() {
    var kat = ['Semua'];
    karya.forEach(function (k) { if (kat.indexOf(k.kategori) < 0) kat.push(k.kategori); });
    $('#filter').innerHTML = kat.map(function (k) {
      var n = k === 'Semua' ? karya.length : karya.filter(function (x) { return x.kategori === k; }).length;
      return '<button type="button" aria-pressed="' + (k === 'Semua') + '" data-kat="' + esc(k) + '">' + esc(k) + '<sup>' + n + '</sup></button>';
    }).join('');
  }
  function renderKarya(kat, awal) {
    aktifKat = kat;
    daftarTampil = karya.map(function (k, i) { return { k: k, i: i }; }).filter(function (x) { return kat === 'Semua' || x.k.kategori === kat; });
    var g = $('#gridKarya');
    var isi = function () {
      g.innerHTML = daftarTampil.length ? daftarTampil.map(function (x, j) {
        var lebar = daftarTampil.length % 2 === 1 && j === daftarTampil.length - 1 && daftarTampil.length > 1 ? ' lebar-penuh' : '';
        return '<button type="button" class="karya' + lebar + '" data-i="' + x.i + '" aria-label="Lihat detail ' + esc(x.k.judul) + '">' + sampul(x.k, x.i) +
          '<div class="karya-info"><div><h3>' + esc(x.k.judul) + '</h3><p>' + esc(x.k.ringkas) + '</p></div><span class="meta"><b data-bagian="aksen">' + esc(x.k.kategori) + '</b>' + esc(x.k.tahun) + '</span></div></button>';
      }).join('') : '<p class="kosong">Belum ada karya di kategori ini.</p>';
      if (G && !awal) G.fromTo(g.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .07, ease: 'power3.out' });
      if (window.ScrollTrigger && G) ScrollTrigger.refresh();
    };
    if (G && !awal && g.children.length) G.to(g.children, { y: -20, opacity: 0, duration: .25, stagger: .03, onComplete: isi }); else isi();
  }
  $('#filter').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.dataset.kat === aktifKat) return;
    $$('#filter button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    renderKarya(b.dataset.kat);
  });
  $('#gridKarya').addEventListener('click', function (e) { var b = e.target.closest('.karya'); if (b) bukaModal(+b.dataset.i, b); });

  // ---------- Modal detail ----------
  var modal = $('#modal'), asalFokus = null, modalI = -1;
  function isiModal(i) {
    var k = karya[i]; modalI = i;
    var urut = daftarTampil.map(function (x) { return x.i; }), p = urut.indexOf(i);
    var sebelum = urut[(p - 1 + urut.length) % urut.length], sesudah = urut[(p + 1) % urut.length];
    $('#modalKonten').innerHTML = '<p class="label-bagian"><span>0' + (i + 1) + '</span> ' + esc(k.kategori) + ' · ' + esc(k.tahun) + '</p><h2 id="modalJudul">' + esc(k.judul) + '</h2><p class="lead">' + esc(k.ringkas) + '</p>' + sampul(k, i) +
      '<div class="detail-grid"><dl><div><dt>Peran</dt><dd>' + esc(k.peran) + '</dd></div><div><dt>Klien</dt><dd>' + esc(k.klien) + '</dd></div><div><dt>Durasi</dt><dd>' + esc(k.durasi) + '</dd></div></dl>' +
      '<div><p>' + esc(k.cerita) + '</p><ul class="hasil">' + (k.hasil || []).map(function (h) { return '<li>' + IKON_CEK + '<span>' + esc(h) + '</span></li>'; }).join('') + '</ul>' +
      (k.tautan ? '<p style="margin-top:20px"><a class="tombol garis" href="' + esc(k.tautan) + '" target="_blank" rel="noopener">Kunjungi proyek ↗</a></p>' : '') + '</div></div>' +
      (urut.length > 1 ? '<div class="modal-nav"><button class="tombol garis" data-ke="' + sebelum + '">← ' + esc(karya[sebelum].judul) + '</button><button class="tombol garis" data-ke="' + sesudah + '">' + esc(karya[sesudah].judul) + ' →</button></div>' : '');
    $('.modal-isi').scrollTop = 0;
  }
  function bukaModal(i, asal) {
    asalFokus = asal || document.activeElement; isiModal(i);
    modal.hidden = false; modal.classList.remove('keluar'); document.body.style.overflow = 'hidden';
    $('.tutup', modal).focus();
    history.replaceState(null, '', '#karya-' + (i + 1));
  }
  function tutupModal() {
    if (modal.hidden) return;
    modal.classList.add('keluar');
    setTimeout(function () { modal.hidden = true; document.body.style.overflow = ''; if (asalFokus) asalFokus.focus(); }, GERAK ? 330 : 0);
    history.replaceState(null, '', '#karya');
  }
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-tutup]')) tutupModal();
    var ke = e.target.closest('[data-ke]'); if (ke) isiModal(+ke.dataset.ke);
  });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') tutupModal();
    if (e.key === 'Tab') {
      var f = $$('button, a[href], input, select, textarea', modal).filter(function (x) { return x.offsetParent; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ---------- Testimoni ----------
  var ti = 0, tAuto;
  function renderTesti(i, arah) {
    var T = D.testimoni || []; if (!T.length) { $('#testimoni').hidden = true; return; }
    ti = (i + T.length) % T.length; var t = T[ti];
    var inisial = t.nama.split(' ').map(function (s) { return s[0]; }).slice(0, 2).join('');
    var isi = function () {
      $('#testiIsi').innerHTML = '<figure style="margin:0"><blockquote>“' + esc(t.isi) + '”</blockquote><figcaption><span class="inisial" data-bagian="aksen">' + esc(inisial) + '</span><span><b>' + esc(t.nama) + '</b><small>' + esc(t.jabatan) + '</small></span></figcaption></figure>';
      if (G && arah) G.from('#testiIsi figure', { x: 40 * arah, opacity: 0, duration: .55, ease: 'power3.out' });
    };
    if (G && arah) G.to('#testiIsi figure', { x: -40 * arah, opacity: 0, duration: .25, onComplete: isi }); else isi();
    $('#testiTitik').innerHTML = T.map(function (_, j) { return '<button type="button" aria-label="Testimoni ' + (j + 1) + '"' + (j === ti ? ' aria-current="true"' : '') + ' data-j="' + j + '"></button>'; }).join('');
  }
  function auto() { clearInterval(tAuto); if (GERAK) tAuto = setInterval(function () { renderTesti(ti + 1, 1); }, 7000); }
  $('#testiKiri').onclick = function () { renderTesti(ti - 1, -1); auto(); };
  $('#testiKanan').onclick = function () { renderTesti(ti + 1, 1); auto(); };
  $('#testiTitik').onclick = function (e) { var b = e.target.closest('button'); if (b) { var j = +b.dataset.j; renderTesti(j, j > ti ? 1 : -1); auto(); } };

  // ---------- Form mailto ----------
  $('#formKontak').addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = $('#fNama'), em = $('#fEmail'), ps = $('#fPesan'), salah = null;
    [nama, em, ps].forEach(function (x) { x.removeAttribute('aria-invalid'); });
    if (!nama.value.trim()) salah = [nama, 'Nama belum diisi.'];
    else if (!/^\S+@\S+\.\S+$/.test(em.value.trim())) salah = [em, 'Format email belum benar.'];
    else if (ps.value.trim().length < 10) salah = [ps, 'Pesan minimal 10 karakter, ya.'];
    if (salah) { salah[0].setAttribute('aria-invalid', 'true'); salah[0].focus(); $('#galat').textContent = salah[1]; return; }
    $('#galat').textContent = '';
    var subjek = '[' + $('#fJenis').value + '] dari ' + nama.value.trim();
    var badan = ps.value.trim() + '\n\n— ' + nama.value.trim() + ' (' + em.value.trim() + ')';
    location.href = 'mailto:' + D.email + '?subject=' + encodeURIComponent(subjek) + '&body=' + encodeURIComponent(badan);
    toast('Membuka aplikasi email…');
  });
  $('#salinEmail').onclick = function () {
    var ok = function () { toast('Email disalin: ' + D.email); };
    if (navigator.clipboard) navigator.clipboard.writeText(D.email).then(ok, function () { toast(D.email); }); else toast(D.email);
  };

  // ---------- Mode terang/gelap ----------
  $('#gantiMode').onclick = function () {
    var r = document.documentElement, m = r.getAttribute('data-mode') === 'gelap' ? 'terang' : 'gelap';
    r.setAttribute('data-mode', m); try { localStorage.setItem('portofolio.mode', m); } catch (e) {}
    toast(m === 'gelap' ? 'Mode gelap' : 'Mode terang');
  };

  // ---------- Header & menu HP ----------
  var kepala = $('.kepala'), yLama = 0;
  addEventListener('scroll', function () {
    var y = scrollY; kepala.classList.toggle('gulir', y > 20);
    kepala.classList.toggle('sembunyi', y > 400 && y > yLama && $('#menuHp').hidden);
    yLama = y;
  }, { passive: true });
  var burger = $('#burger'), menuHp = $('#menuHp');
  burger.onclick = function () { var b = menuHp.hidden; menuHp.hidden = !b; burger.setAttribute('aria-expanded', b); burger.setAttribute('aria-label', b ? 'Tutup menu' : 'Buka menu'); };
  menuHp.onclick = function (e) { if (e.target.closest('a')) { menuHp.hidden = true; burger.setAttribute('aria-expanded', 'false'); } };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) $$('.menu a').forEach(function (a) { a.classList.toggle('aktif', a.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { io.observe(s); });
  }

  // ---------- Animasi (GSAP) ----------
  function animasi() {
    var tirai = $('.tirai');
    if (!G) { tirai.classList.add('selesai'); return; }
    var tl = G.timeline({ defaults: { ease: 'expo.out' } });
    setTimeout(function () { if (!tirai.classList.contains('selesai')) tl.progress(1); }, 4000); // pengaman bila tab di latar
    tl.to('.tirai span', { yPercent: -120, opacity: 0, duration: .5, delay: .35, ease: 'power2.in' })
      .to(tirai, { yPercent: -100, duration: .9, ease: 'expo.inOut', onComplete: function () { tirai.classList.add('selesai'); } }, '-=.1')
      .from('.judul-raksasa .baris > span', { yPercent: 110, duration: 1.2, stagger: .09 }, '-=.45')
      .from('.potret', { clipPath: 'inset(100% 0 0 0)', duration: 1.2 }, '-=1')
      .from('.potret img', { scale: 1.3, duration: 1.6 }, '<')
      .from('.hero-atas, .lead, .baris-tombol > *, .angka > div, .kepala', { y: 24, opacity: 0, duration: .9, stagger: .06 }, '-=1.1');
    $$('.hitung').forEach(function (el) {
      var o = { v: 0 }; G.to(o, { v: +el.dataset.n, duration: 1.8, ease: 'power2.out', delay: 1.4, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
    if (!window.ScrollTrigger) return;
    G.to('.potret img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.judul-raksasa:not(.kecil)', { xPercent: -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.judul-bagian, .judul-raksasa.kecil').forEach(function (h) { G.from(h, { y: 60, opacity: 0, duration: 1.1, scrollTrigger: { trigger: h, start: 'top 85%' } }); });
    $$('.label-bagian').forEach(function (h) { G.from(h, { opacity: 0, x: -20, duration: .8, scrollTrigger: { trigger: h, start: 'top 90%' } }); });
    G.from('.tentang-teks p', { y: 30, opacity: 0, stagger: .12, duration: .9, scrollTrigger: { trigger: '.tentang-teks', start: 'top 85%' } });
    G.from('.daftar-keahlian .bar i', { scaleX: 0, duration: 1.4, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.daftar-keahlian', start: 'top 80%' } });
    G.from('.chip-list li', { scale: .6, opacity: 0, stagger: .04, duration: .5, ease: 'back.out(2)', scrollTrigger: { trigger: '.alat', start: 'top 85%' } });
    $$('.karya').forEach(function (k) { G.from(k, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: k, start: 'top 92%' } }); });
    $$('.timeline li').forEach(function (li) {
      G.from(li, { y: 30, opacity: 0, duration: .8, scrollTrigger: { trigger: li, start: 'top 88%' } });
      G.fromTo(li, { '--isi': '0%' }, { '--isi': '100%', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 80%' } });
    });
    G.from('.layanan li', { y: 40, opacity: 0, stagger: .1, duration: .9, scrollTrigger: { trigger: '.layanan', start: 'top 85%' } });
    G.from('.testi', { scale: .94, opacity: 0, duration: 1, scrollTrigger: { trigger: '.testi', start: 'top 85%' } });
    G.from('.kontak-aksi > *, .form', { y: 30, opacity: 0, stagger: .07, duration: .8, scrollTrigger: { trigger: '.kontak-grid', start: 'top 85%' } });
    // kursor "Lihat" di atas karya (desktop)
    var ks = $('.kursor');
    if (matchMedia('(hover: hover)').matches) {
      var gx = G.quickTo(ks, 'x', { duration: .45, ease: 'power3' }), gy = G.quickTo(ks, 'y', { duration: .45, ease: 'power3' });
      addEventListener('pointermove', function (e) { gx(e.clientX); gy(e.clientY); });
      $('#gridKarya').addEventListener('pointerover', function (e) { G.to(ks, { scale: e.target.closest('.karya') ? 1 : 0, opacity: e.target.closest('.karya') ? 1 : 0, duration: .3 }); });
      $('#gridKarya').addEventListener('pointerleave', function () { G.to(ks, { scale: 0, opacity: 0, duration: .3 }); });
      // tombol magnetik
      $$('.tombol.utama, .tombol-ikon').forEach(function (b) {
        b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); G.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4 }); });
        b.addEventListener('pointerleave', function () { G.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, .4)' }); });
      });
    }
  }

  // ---------- Tema (customizer Maliki Studio, lihat tema.css & tema.js) ----------
  var FONT_OK = ['Plus Jakarta Sans', 'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'Nunito'];
  function terapkanTema(t) {
    var r = document.documentElement, st = r.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama);
    if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.radius != null) st.setProperty('--tema-radius', typeof t.radius === 'number' ? t.radius + 'px' : t.radius);
    if (t.font) {
      var f = String(t.font).split(',')[0].replace(/["']/g, '').trim();
      st.setProperty('--tema-font', '"' + f + '", system-ui, sans-serif');
      var l = $('#fontTema'); if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700&display=swap';
    }
    if (t.mode) r.setAttribute('data-mode', t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode);
    if (t.bagian) terapkanBagian(t.bagian);
    if (t.nama) { NAMA = t.nama; $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; }); document.title = NAMA + ' — ' + (D.peran || ''); }
    setTimeout(hitungTeksBagian, 0);
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (warna per bagian, sorot, tap-untuk-pilih) ----------
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  function warnaNyata(v) {
    var p = document.createElement('i'); p.style.cssText = 'position:absolute;width:0;height:0;background:var(' + v + ')';
    document.body.appendChild(p); var c = getComputedStyle(p).backgroundColor; p.remove();
    var m = (c.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
    if (/^color\(srgb/.test(c)) m = m.map(function (x) { return x * 255; });
    return m.slice(0, 3);
  }
  function teksUntuk(v) {
    var l = warnaNyata(v).map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4 ? '#14171a' : '#ffffff';
  }
  function hitungTeksBagian() {
    var st = document.documentElement.style;
    st.setProperty('--tema-nav-teks', teksUntuk('--nav'));
    st.setProperty('--tema-utama-teks', teksUntuk('--utama'));
  }
  function terapkanBagian(bg) {
    var st = document.documentElement.style;
    Object.keys(VAR_BAGIAN).forEach(function (k) {
      if (bg[k] === undefined) return;
      if (bg[k]) { st.setProperty('--tema-' + k, bg[k]); st.setProperty(VAR_BAGIAN[k], bg[k]); }
      else { st.removeProperty('--tema-' + k); st.removeProperty(VAR_BAGIAN[k]); }
    });
  }
  var sorotAktif = null;
  function sorot(b) {
    sorotAktif = b;
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
    modePilih = !!on; document.documentElement.classList.toggle('mode-pilih', modePilih);
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
  new MutationObserver(function () { hitungTeksBagian(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

  // ---------- Mulai ----------
  render(); hitungTeksBagian(); animasi(); auto();
  var m = /^#karya-(\d+)$/.exec(location.hash); if (m && karya[m[1] - 1]) bukaModal(m[1] - 1);
})();
