/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Landing Kelas Virtual — merender isi dari konten.js. Tidak ada pembayaran di sini: semua tombol .beli → KONTEN.linkBeli. */
(function () {
  'use strict';
  var K = window.KONTEN || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rp(n) { return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
  function ambil(path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, K); }
  document.documentElement.classList.add('js');

  // ---------- Render ----------
  function render() {
    if (K.judulHalaman) document.title = K.judulHalaman;
    if (K.deskripsi) { var md = $('meta[name="description"]'); if (md) md.content = K.deskripsi; }
    if (!K.merek && window.TEMA) K.merek = TEMA.nama;
    $$('[data-k]').forEach(function (el) { var v = ambil(el.getAttribute('data-k')); if (v != null) el.textContent = v; });

    var h = K.hero || {}, j = esc(h.judul || '');
    if (h.sorot) j = j.replace(esc(h.sorot), '<em>' + esc(h.sorot) + '</em>');
    $('#heroJudul').innerHTML = j;
    $('#statistik').innerHTML = (h.statistik || []).map(function (s) { return '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></li>'; }).join('');

    var hg = K.harga || {};
    ['', '2', '3'].forEach(function (n) {
      var c = $('#hargaCoret' + n), jl = $('#hargaJual' + n);
      if (c) { c.textContent = hg.coret ? rp(hg.coret) : ''; if (hg.coret) c.setAttribute('aria-label', 'Harga normal ' + rp(hg.coret)); }
      if (jl) jl.textContent = rp(hg.jual);
    });
    var hm = $('#hemat');
    if (hg.coret > hg.jual) hm.textContent = 'Hemat ' + Math.round((1 - hg.jual / hg.coret) * 100) + '%'; else hm.remove();

    var u = K.untukSiapa || {};
    $('#cocok').innerHTML = (u.cocok || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    $('#tidakCocok').innerHTML = (u.tidak || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');

    var panah = '<svg class="ak-panah" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    $('#modul').innerHTML = ((K.kurikulum || {}).modul || []).map(function (m, i) {
      return '<div class="ak-item muncul' + (i === 0 ? ' buka' : '') + '"><button class="ak-tombol" aria-expanded="' + (i === 0) + '" aria-controls="m' + i + '" id="mt' + i + '">' +
        '<span class="ak-no">' + (i + 1) + '</span><span class="ak-judul">' + esc(m.judul) + '</span><span class="ak-durasi">' + esc(m.durasi || '') + '</span>' + panah + '</button>' +
        '<div class="ak-isi" id="m' + i + '" role="region" aria-labelledby="mt' + i + '"><div><ul>' + (m.materi || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div></div>';
    }).join('');
    $('#faqDaftar').innerHTML = (K.faq || []).map(function (f, i) {
      return '<div class="ak-item muncul"><button class="ak-tombol" aria-expanded="false" aria-controls="f' + i + '" id="ft' + i + '"><span class="ak-judul">' + esc(f.t) + '</span>' + panah + '</button>' +
        '<div class="ak-isi" id="f' + i + '" role="region" aria-labelledby="ft' + i + '"><div><p>' + esc(f.j) + '</p></div></div></div>';
    }).join('');

    var ikon = [
      '<path d="M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z"/>',
      '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
      '<path d="M4 6h12v9H9l-5 4zM18 9h2v9l-3-3h-6"/>'
    ];
    var b = K.bonus || {}, tot = 0;
    $('#bonusGrid').innerHTML = (b.item || []).map(function (x, i) {
      tot += x.nilai || 0;
      return '<article class="bonus muncul" data-bagian="panel"><div class="bonus-ikon"><svg viewBox="0 0 24 24" aria-hidden="true">' + ikon[i % ikon.length] + '</svg></div>' +
        (x.nilai ? '<span class="bonus-nilai">Senilai <s>' + rp(x.nilai) + '</s></span>' : '') + '<h3>' + esc(x.judul) + '</h3><p>' + esc(x.isi) + '</p></article>';
    }).join('');
    $('#bonusTotal').innerHTML = tot ? 'Total nilai bonus <b>' + rp(tot) + '</b>, semuanya gratis saat kamu membeli kelas.' : '';

    $('#mentorPoin').innerHTML = ((K.mentor || {}).poin || []).map(function (s) { return '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></li>'; }).join('');

    $('#testiGrid').innerHTML = ((K.testimoni || {}).item || []).map(function (t) {
      return '<figure class="testi muncul" data-bagian="panel"><span class="tanda-contoh">Contoh</span><blockquote>' + esc(t.isi) + '</blockquote>' +
        '<figcaption class="testi-orang"><span class="avatar" aria-hidden="true">' + esc((t.nama || '?').charAt(0)) + '</span><span><b>' + esc(t.nama) + '</b><small>' + esc(t.usaha) + '</small></span></figcaption></figure>';
    }).join('');

    // Link: semua tombol beli ke satu URL Lynk
    $$('.beli').forEach(function (a) { a.href = K.linkBeli || '#'; a.target = '_blank'; a.rel = 'noopener'; });
    var wa = $('#tombolWa');
    if (K.waNomor) wa.href = 'https://wa.me/' + String(K.waNomor).replace(/\D/g, '') + '?text=' + encodeURIComponent(K.waPesan || ''); else wa.remove();
    $('#tahun').textContent = new Date().getFullYear();
  }

  // ---------- Akordion ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.ak-tombol'); if (!t) return;
    var item = t.parentNode, buka = !item.classList.contains('buka');
    item.classList.toggle('buka', buka); t.setAttribute('aria-expanded', buka);
  });

  // ---------- Countdown promo ----------
  function hitungMundur() {
    var p = K.promo; if (!p || !p.selesai) return;
    var akhir;
    if (p.selesai === 'otomatis-3hari') {
      try { akhir = +localStorage.getItem('lkv-promo'); } catch (e) { akhir = 0; }
      if (!akhir || akhir < Date.now()) { akhir = Date.now() + 3 * 864e5; try { localStorage.setItem('lkv-promo', akhir); } catch (e) {} }
    } else akhir = new Date(p.selesai).getTime();
    if (!akhir || isNaN(akhir)) return;
    var box = $('#hitung'), el = $('#hitungAngka');
    function d2(n) { return (n < 10 ? '0' : '') + n; }
    function tik() {
      var s = Math.max(0, Math.floor((akhir - Date.now()) / 1000));
      if (s <= 0) { box.hidden = true; return false; }
      var v = [[Math.floor(s / 86400), 'hari'], [Math.floor(s % 86400 / 3600), 'jam'], [Math.floor(s % 3600 / 60), 'mnt'], [s % 60, 'dtk']];
      el.innerHTML = v.map(function (x) { return '<span>' + d2(x[0]) + '<small>' + x[1] + '</small></span>'; }).join('');
      el.setAttribute('aria-label', v[0][0] + ' hari ' + v[1][0] + ' jam ' + v[2][0] + ' menit lagi');
      return true;
    }
    if (tik()) { box.hidden = false; var iv = setInterval(function () { if (!tik()) clearInterval(iv); }, 1000); }
  }

  // ---------- Animasi masuk & tombol melayang ----------
  function animasi() {
    var el = $$('.muncul');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.forEach(function (x) { x.classList.add('terlihat'); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sib = en.target.parentNode ? $$(':scope > .muncul', en.target.parentNode) : [];
        en.target.style.transitionDelay = Math.min(sib.indexOf(en.target), 5) * 70 + 'ms';
        en.target.classList.add('terlihat'); io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    el.forEach(function (x) { io.observe(x); });
  }
  function melayang() {
    var bar = $('#melayangBeli'), kotak = $('.harga-kotak'), penutup = $('.penutup');
    if (!('IntersectionObserver' in window)) { bar.classList.add('tampil'); return; }
    var lewatHero = false, diPenutup = false;
    function ubah() { bar.classList.toggle('tampil', lewatHero && !diPenutup); }
    new IntersectionObserver(function (e) { lewatHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; ubah(); }).observe(kotak);
    new IntersectionObserver(function (e) { diPenutup = e[0].isIntersecting; ubah(); }).observe(penutup);
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
      var l = document.getElementById('fontTema');
      if (l && FONT_OK.indexOf(f) >= 0) l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap';
    }
    if (t.mode) { var m = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode; r.setAttribute('data-mode', m); }
    if (t.bagian) terapkanBagian(t.bagian);
    setTimeout(hitungTeksBagian, 0);
    if (t.nama) $$('[data-tema-nama]').forEach(function (e) { e.textContent = t.nama; });
  }
  window.addEventListener('message', function (e) { if (e.data && e.data.tipe === 'tema') terapkanTema(e.data); });

  // ---------- Bagian (customizer: warna per bagian, sorot, tap-untuk-pilih) ----------
  var NAMA_BAGIAN = { nav: 'Navigasi', latar: 'Latar', panel: 'Panel', utama: 'Warna utama', aksen: 'Aksen', teks: 'Teks' };
  var VAR_BAGIAN = { latar: '--latar', panel: '--kartu', nav: '--nav', teks: '--teks' };
  function warnaNyata(v) {
    var p = document.createElement('i'); p.style.cssText = 'position:absolute;width:0;height:0;background:var(' + v + ')';
    document.body.appendChild(p); var c = getComputedStyle(p).backgroundColor; p.remove();
    var m = c.match(/[\d.]+/g) || [255, 255, 255];
    if (/^color\(srgb/.test(c)) m = m.map(function (x) { return x * 255; });
    return m.slice(0, 3).map(Number);
  }
  function teksUntuk(v) {
    var l = warnaNyata(v).map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return (0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]) > 0.4 ? '#14171a' : '#ffffff';
  }
  function hitungTeksBagian() {
    if (!document.body) return;
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
  function sorot(b) {
    $$('[data-sorot]').forEach(function (e) { e.removeAttribute('data-sorot'); });
    $$('.label-sorot').forEach(function (e) { e.remove(); });
    if (!b) return;
    $$('[data-bagian="' + b + '"]').forEach(function (e) {
      if (e === document.body) return;
      e.setAttribute('data-sorot', '');
      var r = e.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) return;
      var lb = document.createElement('span'); lb.className = 'label-sorot'; lb.textContent = NAMA_BAGIAN[b] || b;
      lb.style.left = Math.max(2, r.left + 4) + 'px'; lb.style.top = Math.max(2, r.top + 4) + 'px';
      document.body.appendChild(lb);
    });
  }
  var modePilih = false, hoverEl = null;
  function bagianDari(t) { return t && t.closest ? t.closest('[data-bagian]') : null; }
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
    else if (d.tipe === 'mode-pilih') {
      modePilih = !!d.aktif; document.documentElement.classList.toggle('mode-pilih', modePilih);
      if (!modePilih && hoverEl) { hoverEl.removeAttribute('data-pilih-hover'); hoverEl = null; }
    }
  });
  new MutationObserver(hitungTeksBagian).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

  // ---------- Mulai ----------
  if (K.warna) terapkanTema({ utama: K.warna.utama, aksen: K.warna.aksen });
  render();
  hitungTeksBagian();
  hitungMundur();
  animasi();
  melayang();
  window.__landing = { terapkanTema: terapkanTema, konten: K };
})();
