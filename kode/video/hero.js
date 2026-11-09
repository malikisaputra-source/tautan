/* Hero Video: "Render Rally" — balap kart orisinal di lintasan timeline video */
(function () {
  var wadah = document.getElementById('hero-khusus');
  if (!wadah || document.body.dataset.laman !== 'video') return;
  var hero = wadah.closest('.k-hero');
  var diam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KUNCI = 'hk-render-rally-best';
  function bacaBest() { try { return +localStorage.getItem(KUNCI) || 0; } catch (e) { return 0; } }
  function simpanBest(v) { try { localStorage.setItem(KUNCI, String(v)); } catch (e) {} }

  wadah.innerHTML = '<canvas aria-hidden="true"></canvas><div class="hk-kabut"></div>';
  var cv = wadah.querySelector('canvas'), cx = cv.getContext('2d');
  var panel = document.createElement('div'); panel.className = 'hk-panel';
  panel.innerHTML = '<button type="button" class="hk-tombol" data-main aria-label="Main game balap timeline">▶ Main <kbd>Spasi</kbd></button><span class="hk-info">Best: <b data-best>0</b> klip</span>';
  var hud = document.createElement('div'); hud.className = 'hk-hud'; hud.setAttribute('aria-live', 'off');
  hud.innerHTML = '<span>Klip <b data-skor>0</b></span><span>Waktu <b data-waktu>0.0</b>s</span><span>Render <b class="o" data-prog>0</b>%</span>';
  var pesan = document.createElement('div'); pesan.className = 'hk-pesan'; pesan.setAttribute('role', 'status');
  hero.appendChild(panel); hero.appendChild(hud); hero.appendChild(pesan);
  var btn = panel.querySelector('[data-main]'), elBest = panel.querySelector('[data-best]');
  var elSkor = hud.querySelector('[data-skor]'), elWaktu = hud.querySelector('[data-waktu]'), elProg = hud.querySelector('[data-prog]');
  elBest.textContent = bacaBest();

  // ---- lintasan ----
  var SEG = 200, JUMLAH = 1400, LEBAR = 2000, TAMPAK = 110, segs = [];
  function bangunTrek() {
    segs = [];
    for (var i = 0; i < JUMLAH; i++) {
      var c = Math.sin(i / 70) * 2.2 + Math.sin(i / 23) * 1.1;
      if (i < 30 || i > JUMLAH - 40) c = 0;
      segs.push({ c: c, h: Math.sin(i / 45) * 900, obj: null });
    }
    for (var j = 60; j < JUMLAH - 50; j += 9 + (j % 7)) {
      var r = (j * 9301 + 49297) % 233280 / 233280;
      var jenis = r < 0.62 ? (r < 0.2 ? 'klapper' : r < 0.4 ? 'bintang' : 'klip') : (r < 0.82 ? 'buffer' : 'glitch');
      segs[j].obj = { t: jenis, x: [-0.6, 0, 0.6][Math.floor(r * 97) % 3], ambil: false };
    }
  }
  bangunTrek();

  // ---- status ----
  var VH = 0, W = 0, H = 0, dpr = 1, main = false, selesai = false, pos = 0, spd = 0, px = 0, steer = 0,
      skor = 0, waktu = 0, kunci = { k: 0, n: 0 }, sentuh = 0, guncang = 0, kilat = [], terlihat = true, jalan = false, tAkhir = 0;
  var MAX = SEG * 60;
  function ukur() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var r = wadah.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    VH = Math.min(H, window.innerHeight); panel.style.top = (VH - 70) + "px";
    if (!jalan) gambar();
  }

  // ---- AI demo ----
  function aiSteer() {
    var b = Math.floor(pos / SEG), target = 0;
    for (var i = 2; i < 30; i++) {
      var o = segs[(b + i) % JUMLAH].obj; if (!o || o.ambil) continue;
      if (o.t === 'buffer' || o.t === 'glitch') { if (Math.abs(o.x - px) < 0.4) { target = o.x > 0 ? -0.6 : 0.6; break; } }
      else { target = o.x; break; }
    }
    return Math.max(-1, Math.min(1, (target - px) * 3));
  }

  function update(dt) {
    var b = Math.floor(pos / SEG);
    var s = main ? (kunci.k ? -1 : 0) + (kunci.n ? 1 : 0) + sentuh : aiSteer();
    steer += (s - steer) * Math.min(1, dt * 10);
    if (!selesai) spd += (MAX - spd) * dt * 0.8; else spd *= 1 - dt * 2.5;
    var rasio = spd / MAX;
    px += steer * dt * 2.2 * rasio;
    px -= segs[b % JUMLAH].c * rasio * rasio * dt * 0.55;
    if (Math.abs(px) > 1.05) { spd *= 1 - dt * 2.5; px = Math.max(-1.3, Math.min(1.3, px)); }
    pos += spd * dt; guncang = Math.max(0, guncang - dt * 3);
    if (main && !selesai) waktu += dt;
    for (var i = 0; i < 2; i++) {
      var o = segs[(b + i) % JUMLAH].obj;
      if (o && !o.ambil && Math.abs(o.x - px) < 0.28) {
        o.ambil = true;
        if (o.t === 'buffer' || o.t === 'glitch') { spd *= 0.35; guncang = 1; }
        else { if (main) skor++; kilat.push({ t: 0, x: o.x }); }
      }
    }
    kilat = kilat.filter(function (k) { k.t += dt; return k.t < 0.5; });
    if (pos >= (JUMLAH - 20) * SEG) {
      if (main && !selesai) { selesai = true; tAkhir = 0; akhiri(); }
      else if (!main) { pos = 0; segs.forEach(function (s) { if (s.obj) s.obj.ambil = false; }); }
    }
    if (selesai) { tAkhir += dt; }
    if (main) { elSkor.textContent = skor; elWaktu.textContent = waktu.toFixed(1); elProg.textContent = Math.min(100, Math.floor(pos / ((JUMLAH - 20) * SEG) * 100)); }
  }

  // ---- gambar ----
  function poly(x1, y1, w1, x2, y2, w2, warna) { cx.fillStyle = warna; cx.beginPath(); cx.moveTo(x1 - w1, y1); cx.lineTo(x2 - w2, y2); cx.lineTo(x2 + w2, y2); cx.lineTo(x1 + w1, y1); cx.fill(); }
  function langit(off) {
    var hz = H * 0.5, g = cx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, '#05070f'); g.addColorStop(1, '#1a1035'); cx.fillStyle = g; cx.fillRect(0, 0, W, hz + 2);
    // matahari render: lingkaran bergaris
    var r = Math.min(W, H) * 0.16, sx = W / 2 - off * 0.05 % W, sy = hz - r * 0.35;
    var gs = cx.createLinearGradient(0, sy - r, 0, sy + r); gs.addColorStop(0, '#fb923c'); gs.addColorStop(1, '#a855f7');
    cx.save(); cx.beginPath(); cx.arc(sx, sy, r, 0, 7); cx.clip(); cx.fillStyle = gs; cx.fillRect(sx - r, sy - r, 2 * r, 2 * r);
    cx.fillStyle = '#1a1035'; for (var i = 0; i < 6; i++) cx.fillRect(sx - r, sy + i * r * 0.17, 2 * r, 2 + i * 1.6); cx.restore();
    // siluet gunung blok (seperti waveform audio)
    cx.fillStyle = '#0d1430';
    for (var x = -40; x < W + 40; x += 14) { var k = x + off * 0.12, hh = (Math.abs(Math.sin(k * 0.013) * 60) + Math.abs(Math.sin(k * 0.041)) * 26) * (H / 800); cx.fillRect(x - (off * 0.12 % 14), hz - hh, 10, hh); }
    var gb = cx.createLinearGradient(0, hz, 0, H); gb.addColorStop(0, '#120b2a'); gb.addColorStop(1, '#05070f'); cx.fillStyle = gb; cx.fillRect(0, hz, W, H - hz);
  }
  function ikon(t, x, y, s) {
    cx.save(); cx.translate(x, y); cx.lineWidth = Math.max(1, s * 0.08);
    if (t === 'klip') { cx.fillStyle = '#22d3ee'; cx.fillRect(-s * .6, -s * .4, s * 1.2, s * .8); cx.fillStyle = '#05070f'; cx.beginPath(); cx.moveTo(-s * .15, -s * .22); cx.lineTo(s * .25, 0); cx.lineTo(-s * .15, s * .22); cx.fill(); }
    else if (t === 'klapper') { cx.fillStyle = '#e6f6ff'; cx.fillRect(-s * .55, -s * .15, s * 1.1, s * .6); cx.fillStyle = '#a855f7'; cx.save(); cx.rotate(-0.3); cx.fillRect(-s * .55, -s * .45, s * 1.1, s * .22); cx.restore(); cx.fillStyle = '#05070f'; for (var i = 0; i < 3; i++) cx.fillRect(-s * .4 + i * s * .32, -s * .05, s * .14, s * .1); }
    else if (t === 'bintang') { cx.fillStyle = '#fb923c'; cx.beginPath(); for (var j = 0; j < 10; j++) { var a = j * Math.PI / 5 - Math.PI / 2, rr = j % 2 ? s * .25 : s * .6; cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } cx.fill(); }
    else if (t === 'buffer') { cx.strokeStyle = '#f43f5e'; cx.lineWidth = s * .14; for (var k = 0; k < 8; k++) { cx.globalAlpha = (k + 2) / 10; var an = k * Math.PI / 4 + performance.now() / 300; cx.beginPath(); cx.arc(0, 0, s * .45, an, an + .4); cx.stroke(); } }
    else { for (var m = 0; m < 5; m++) { cx.fillStyle = ['#f43f5e', '#22d3ee', '#a855f7'][m % 3]; cx.fillRect(-s * .55 + ((m * 37 + (performance.now() / 60 | 0)) % 7) * s * .04, -s * .5 + m * s * .2, s * 1.1, s * .16); } }
    cx.restore();
  }
  function kart(x, y, s, mir) {
    cx.save(); cx.translate(x, y); cx.rotate(mir * 0.08);
    cx.fillStyle = 'rgba(0,0,0,.45)'; cx.beginPath(); cx.ellipse(0, s * .05, s * .75, s * .14, 0, 0, 7); cx.fill();
    cx.fillStyle = '#111827'; cx.fillRect(-s * .72, -s * .28, s * .26, s * .32); cx.fillRect(s * .46, -s * .28, s * .26, s * .32);
    cx.fillStyle = '#22d3ee'; cx.beginPath(); cx.moveTo(-s * .5, 0); cx.lineTo(-s * .42, -s * .42); cx.lineTo(s * .42, -s * .42); cx.lineTo(s * .5, 0); cx.fill();
    cx.fillStyle = '#a855f7'; cx.fillRect(-s * .55, -s * .62, s * 1.1, s * .1); cx.fillRect(-s * .06, -s * .62, s * .12, s * .22);
    cx.fillStyle = '#e6f6ff'; cx.beginPath(); cx.arc(0, -s * .62, s * .2, Math.PI, 0); cx.fill();
    cx.fillStyle = '#05070f'; cx.fillRect(-s * .16, -s * .7, s * .32, s * .07);
    cx.fillStyle = '#fb923c'; cx.fillRect(-s * .38, -s * .14, s * .16, s * .08); cx.fillRect(s * .22, -s * .14, s * .16, s * .08);
    cx.restore();
  }
  function gambar() {
    cx.clearRect(0, 0, W, H);
    var b = Math.floor(pos / SEG), frac = (pos % SEG) / SEG, base = segs[b % JUMLAH];
    var camH = 1100 + base.h, dx = -base.c * frac, x = 0, maxY = H, D = 0.84, hz = H * 0.5;
    langit(pos * 0.002 + b * 0.0);
    var titik = [];
    for (var n = 0; n < TAMPAK; n++) {
      var i = (b + n) % JUMLAH, sg = segs[i];
      var z1 = n * SEG - frac * SEG + 1, z2 = z1 + SEG;
      var s1 = D / z1 * H, s2 = D / z2 * H;
      var y1 = hz + (camH - sg.h) * s1 * 0.6 / 1, y2 = hz + (camH - segs[(i + 1) % JUMLAH].h) * s2 * 0.6;
      var cx1 = W / 2 + (-px * LEBAR + x) * s1 * 0.6, cx2 = W / 2 + (-px * LEBAR + x + dx) * s2 * 0.6;
      var w1 = LEBAR * s1 * 0.6, w2 = LEBAR * s2 * 0.6;
      x += dx; dx += sg.c;
      titik.push({ i: i, y: y1, cx: cx1, w: w1, s: s1 });
      if (y2 >= maxY || y2 >= y1) continue;
      var gelap = (i >> 1) % 2;
      poly(cx1, y1, w1 * 1.32, cx2, y2, w2 * 1.32, gelap ? '#0b0f1f' : '#0f1428');
      poly(cx1, y1, w1 * 1.14, cx2, y2, w2 * 1.14, '#05070f'); // tepi pita film
      if (i % 2 === 0) { // lubang sprocket
        poly(cx1 - w1 * 1.07, y1, w1 * 0.035, cx2 - w2 * 1.07, y2, w2 * 0.035, '#cbd5e1');
        poly(cx1 + w1 * 1.07, y1, w1 * 0.035, cx2 + w2 * 1.07, y2, w2 * 0.035, '#cbd5e1');
      }
      poly(cx1, y1, w1, cx2, y2, w2, gelap ? '#161b33' : '#1b2140');
      if (i % 12 === 0) poly(cx1, y1, w1, cx2, y2, w2, i % 24 ? 'rgba(34,211,238,.55)' : 'rgba(168,85,247,.6)'); // penanda frame
      if (gelap) { poly(cx1 - w1 / 3, y1, w1 * .012, cx2 - w2 / 3, y2, w2 * .012, 'rgba(230,246,255,.25)'); poly(cx1 + w1 / 3, y1, w1 * .012, cx2 + w2 / 3, y2, w2 * .012, 'rgba(230,246,255,.25)'); }
      if (i >= JUMLAH - 22 && i <= JUMLAH - 20) poly(cx1, y1, w1, cx2, y2, w2, i % 2 ? '#e6f6ff' : '#22d3ee');
      maxY = y2;
    }
    // objek (jauh ke dekat)
    for (var t = titik.length - 1; t > 0; t--) {
      var p = titik[t], o = segs[p.i].obj;
      if (p.i === JUMLAH - 20 && p.w > 4) { cx.fillStyle = '#22d3ee'; cx.font = '700 ' + Math.max(8, p.w * .16) + 'px "Space Grotesk",sans-serif'; cx.textAlign = 'center'; cx.fillText('RENDER SELESAI', p.cx, p.y - p.w * .5); cx.fillRect(p.cx - p.w * 1.1, p.y - p.w * .45, p.w * 2.2, Math.max(1, p.w * .03)); }
      if (!o || o.ambil || p.w < 3) continue;
      ikon(o.t, p.cx + o.x * p.w, p.y - p.w * .14, p.w * .2);
    }
    var ks = Math.min(W, H * 1.2) * 0.11, ky = VH - 96 + (guncang ? Math.sin(performance.now() / 30) * 4 * guncang : 0);
    kilat.forEach(function (k) { cx.strokeStyle = 'rgba(34,211,238,' + (1 - k.t * 2) + ')'; cx.lineWidth = 3; cx.beginPath(); cx.arc(W / 2, ky - ks * .4, ks * (0.6 + k.t * 2), 0, 7); cx.stroke(); });
    kart(W / 2, ky, ks, steer);
  }

  // ---- loop ----
  var tPrev = 0;
  function loop(t) {
    if (!jalan) return;
    var dt = Math.min(0.05, (t - (tPrev || t)) / 1000); tPrev = t;
    update(dt); gambar(); requestAnimationFrame(loop);
  }
  function mulaiLoop() { if (jalan || (diam && !main)) return; if (!terlihat || document.hidden) return; jalan = true; tPrev = 0; requestAnimationFrame(loop); }
  function stopLoop() { jalan = false; }

  // ---- mode main ----
  function reset() { pos = 0; spd = 0; px = 0; skor = 0; waktu = 0; selesai = false; segs.forEach(function (s) { if (s.obj) s.obj.ambil = false; }); }
  function masuk() {
    if (main) return; main = true; reset(); pesan.classList.remove('on');
    hero.classList.add('hk-main'); btn.innerHTML = '✕ Keluar <kbd>Esc</kbd>'; btn.setAttribute('aria-label', 'Keluar dari game');
    if (window.__lenis && window.__lenis.stop) window.__lenis.stop();
    var top = hero.getBoundingClientRect().top; if (Math.abs(top) > 4) window.scrollBy({ top: top, behavior: diam ? 'auto' : 'smooth' });
    btn.focus({ preventScroll: true }); stopLoop(); terlihat = true; mulaiLoop();
  }
  function keluar() {
    if (!main) return; main = false; kunci.k = kunci.n = 0; sentuh = 0; pesan.classList.remove('on');
    hero.classList.remove('hk-main'); btn.innerHTML = '▶ Main <kbd>Spasi</kbd>'; btn.setAttribute('aria-label', 'Main game balap timeline');
    if (window.__lenis && window.__lenis.start) window.__lenis.start();
    reset(); if (diam) { stopLoop(); gambar(); }
  }
  function akhiri() {
    var best = bacaBest(), baru = skor > best; if (baru) { simpanBest(skor); elBest.textContent = skor; }
    pesan.innerHTML = 'Render selesai ✓<small>' + skor + ' klip · ' + waktu.toFixed(1) + ' dtk' + (baru ? ' · rekor baru!' : ' · best ' + best) + '<br>Spasi = main lagi · Esc = keluar</small>';
    pesan.classList.add('on');
  }
  btn.addEventListener('click', function () { main ? keluar() : masuk(); });

  function diKetik(e) { var t = e.target; return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  window.addEventListener('keydown', function (e) {
    if (diKetik(e)) return;
    var k = e.key;
    if (!main) {
      if ((k === ' ' || k === 'Spacebar') && hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < window.innerHeight * 0.5 && (e.target === document.body || e.target === btn)) { e.preventDefault(); masuk(); }
      return;
    }
    if (k === 'Escape') { e.preventDefault(); keluar(); btn.focus(); return; }
    if (k === ' ' && selesai) { e.preventDefault(); reset(); pesan.classList.remove('on'); return; }
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { kunci.k = 1; e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { kunci.n = 1; e.preventDefault(); }
    else if (k === 'ArrowUp' || k === 'ArrowDown' || k === ' ' || k === 'PageDown' || k === 'PageUp') e.preventDefault();
  });
  window.addEventListener('keyup', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') kunci.k = 0;
    if (k === 'ArrowRight' || k === 'd' || k === 'D') kunci.n = 0;
  });
  // sentuh: tahan/geser kiri-kanan
  var awalX = null;
  cv.addEventListener('pointerdown', function (e) { if (!main) return; awalX = e.clientX; sentuh = e.clientX < W / 2 ? -1 : 1; if (selesai) { reset(); pesan.classList.remove('on'); } });
  cv.addEventListener('pointermove', function (e) { if (!main || awalX === null) return; var d = e.clientX - awalX; if (Math.abs(d) > 12) sentuh = Math.max(-1, Math.min(1, d / 60)); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { cv.addEventListener(n, function () { awalX = null; sentuh = 0; }); });

  // ---- visibilitas ----
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { terlihat = en[0].isIntersecting; terlihat ? mulaiLoop() : stopLoop(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { document.hidden ? stopLoop() : mulaiLoop(); });
  window.addEventListener('resize', ukur);
  ukur();
  if (diam) { pos = SEG * 40; spd = 0; gambar(); } else mulaiLoop();
})();
