/* Hero Video: "Render Rally" — balap kart orisinal di lintasan timeline video.
   Misi: isi bar RENDER sampai 100% sebelum deadline. */
(function () {
  var wadah = document.getElementById('hero-khusus');
  if (!wadah || document.body.dataset.laman !== 'video') return;
  var hero = wadah.closest('.k-hero');
  var diam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KUNCI = 'hk-render-rally-best2';
  function bacaBest() { try { return +localStorage.getItem(KUNCI) || 0; } catch (e) { return 0; } }
  function simpanBest(v) { try { localStorage.setItem(KUNCI, String(v)); } catch (e) {} }

  // ---- aturan ----
  var DURASI = 45, RENDER_KLIP = 1.6, TAMBAH_KLAPPER = 2, KURANG_RINTANG = 3, NITRO_DTK = 3.5;
  var MEDALI = [{ n: 'Perunggu', s: 0, c: '#d6925a' }, { n: 'Perak', s: 9000, c: '#cbd5e1' }, { n: 'Emas', s: 18000, c: '#facc15' }];
  var TANTANGAN = [
    { id: 'klapper', teks: 'Kumpulkan 5 klapper', cek: function (st) { return st.klapper >= 5; }, prog: function (st) { return Math.min(5, st.klapper) + '/5'; } },
    { id: 'combo', teks: 'Capai combo x5', cek: function (st) { return st.maxMult >= 5; }, prog: function (st) { return 'x' + st.maxMult; } },
    { id: 'nitro', teks: 'Nyalakan nitro 2 kali', cek: function (st) { return st.nitro >= 2; }, prog: function (st) { return Math.min(2, st.nitro) + '/2'; } },
    { id: 'bersih', teks: 'Render tanpa tabrakan', cek: function (st) { return st.menang && st.tabrak === 0; }, prog: function (st) { return st.tabrak + ' tabrakan'; } },
    { id: 'cepat', teks: 'Selesai dengan sisa 10 dtk', cek: function (st) { return st.menang && st.sisa >= 10; }, prog: function (st) { return 'sisa ' + Math.max(0, st.sisa).toFixed(0) + ' dtk'; } }
  ];

  wadah.innerHTML = '<canvas aria-hidden="true"></canvas><div class="hk-kabut"></div>';
  var cv = wadah.querySelector('canvas'), cx = cv.getContext('2d');
  var panel = document.createElement('div'); panel.className = 'hk-panel';
  panel.innerHTML = '<button type="button" class="hk-tombol" data-main aria-label="Main game Render Rally">▶ Main <kbd>Spasi</kbd></button><span class="hk-info">Rekor: <b data-best>0</b></span>';
  var hud = document.createElement('div'); hud.className = 'hk-hud'; hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML =
    '<div class="hk-baris"><span class="hk-skor"><small>Skor</small><b data-skor>0</b></span>' +
    '<span class="hk-waktu"><small>Deadline</small><b data-waktu>45.0</b></span>' +
    '<span class="hk-lv"><small>Level</small><b data-lv>1</b></span></div>' +
    '<div class="hk-render"><span>RENDER</span><i><em data-bar></em></i><b data-prog>0%</b></div>' +
    '<div class="hk-baris kecil"><span class="hk-combo" data-combo>x1</span><span class="hk-bintang" data-bintang>☆☆☆</span><span class="hk-misi" data-misi></span></div>';
  var pesan = document.createElement('div'); pesan.className = 'hk-pesan'; pesan.setAttribute('role', 'status');
  hero.appendChild(panel); hero.appendChild(hud); hero.appendChild(pesan);
  var btn = panel.querySelector('[data-main]'), elBest = panel.querySelector('[data-best]');
  var q = function (s) { return hud.querySelector(s); };
  var elSkor = q('[data-skor]'), elWaktu = q('[data-waktu]'), elLv = q('[data-lv]'), elBar = q('[data-bar]'), elProg = q('[data-prog]'),
      elCombo = q('[data-combo]'), elBintang = q('[data-bintang]'), elMisi = q('[data-misi]');
  elBest.textContent = bacaBest();

  // ---- lintasan (berulang mulus) ----
  var SEG = 200, JUMLAH = 1320, LEBAR = 2000, TAMPAK = 110, segs = [], TAU = Math.PI * 2;
  for (var i0 = 0; i0 < JUMLAH; i0++) segs.push({ c: Math.sin(i0 * TAU / 440) * 2.2 + Math.sin(i0 * TAU / 110) * 1.0, h: Math.sin(i0 * TAU / 330) * 900 });
  var objs = {}, nextSpawn = 30;
  function spawnSampai(nAbs) {
    var cfg = [null, { g: 8, r: .22 }, { g: 6, r: .3 }, { g: 5, r: .36 }][level];
    while (nextSpawn < nAbs) {
      var arr = [], jalur = [-0.6, 0, 0.6], a = Math.floor(Math.random() * 3), r = Math.random();
      var t = r < cfg.r ? (Math.random() < .55 ? 'buffer' : 'glitch') : (r < cfg.r + .14 ? 'klapper' : r < cfg.r + .26 ? 'bintang' : 'klip');
      arr.push({ t: t, x: jalur[a] });
      if (level >= 2 && Math.random() < .35) { var b2 = (a + 1 + Math.floor(Math.random() * 2)) % 3; arr.push({ t: t === 'klip' ? (Math.random() < cfg.r * 1.6 ? 'buffer' : 'klip') : 'klip', x: jalur[b2] }); }
      objs[nextSpawn] = arr;
      nextSpawn += cfg.g + Math.floor(Math.random() * 3);
    }
  }

  // ---- status ----
  var VH = 0, W = 0, H = 0, dpr = 1, fase = 'demo', pos = 0, spd = 0, px = 0, steer = 0, level = 1,
      skor = 0, skorTampil = 0, waktu = DURASI, render = 0, combo = 0, mult = 1, bintang = 0, nitro = 0, kebal = 0, tMain = 0,
      kunci = { k: 0, n: 0 }, sentuh = 0, guncang = 0, kilat = [], teks = [], percik = [], terlihat = true, jalan = false,
      st = null, tantangan = TANTANGAN[0], jedaAkhir = 0;
  var MAX = SEG * 60;
  function main() { return fase !== 'demo'; }
  function ukur() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var r = wadah.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    VH = Math.min(H, window.innerHeight); panel.style.top = (VH - 70) + 'px';
    pesan.style.top = (VH * 0.46) + 'px';
    if (!jalan) gambar();
  }
  function multDari(c) { return c >= 14 ? 5 : c >= 8 ? 3 : c >= 3 ? 2 : 1; }
  function terbang(txt, warna, besar, x, y) { teks.push({ s: txt, c: warna, b: besar || 18, x: x == null ? W / 2 : x, y: y == null ? VH * 0.62 : y, t: 0 }); }
  function cipratan(warna, x, y) { for (var k = 0; k < 12; k++) { var a = Math.random() * TAU, v = 80 + Math.random() * 180; percik.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, t: 0, c: warna }); } }

  // ---- AI demo ----
  function aiSteer() {
    var b = Math.floor(pos / SEG), target = 0;
    for (var i = 2; i < 30; i++) {
      var arr = objs[b + i]; if (!arr) continue;
      var bahaya = arr.filter(function (o) { return !o.ambil && (o.t === 'buffer' || o.t === 'glitch'); });
      var bagus = arr.filter(function (o) { return !o.ambil && !(o.t === 'buffer' || o.t === 'glitch'); });
      if (bahaya.some(function (o) { return Math.abs(o.x - px) < 0.4; })) { var aman = [-0.6, 0, 0.6].filter(function (x) { return !bahaya.some(function (o) { return Math.abs(o.x - x) < .3; }); }); target = aman.sort(function (a, c) { return Math.abs(a - px) - Math.abs(c - px); })[0] || 0; break; }
      if (bagus.length) { target = bagus[0].x; break; }
    }
    return Math.max(-1, Math.min(1, (target - px) * 3));
  }

  function ambil(o, kx, ky) {
    o.ambil = true;
    var buruk = o.t === 'buffer' || o.t === 'glitch';
    if (buruk) {
      if (kebal > 0) { terbang('KEBAL!', '#a855f7', 18, kx, ky - 30); cipratan('#a855f7', kx, ky - 20); return; }
      spd *= 0.45; guncang = 1;
      if (fase !== 'main') return;
      st.tabrak++; waktu = Math.max(0, waktu - KURANG_RINTANG);
      terbang((o.t === 'buffer' ? 'Buffering!' : 'Glitch!') + ' −' + KURANG_RINTANG + ' dtk', '#f43f5e', 20, kx, ky - 30);
      if (combo >= 3) terbang('Combo putus', '#9fb0cc', 14, kx, ky - 4);
      combo = 0; mult = 1; return;
    }
    // item bagus: tidak pernah memperlambat, malah dorongan kecil
    spd = Math.min(MAX * kecepatanLevel() * (nitro > 0 ? 1.45 : 1.08), spd + MAX * 0.05);
    kilat.push({ t: 0 });
    var warna = o.t === 'klip' ? '#22d3ee' : o.t === 'klapper' ? '#e6f6ff' : '#fb923c';
    cipratan(warna, kx, ky - 20);
    if (fase !== 'main') return;
    combo++; var mBaru = multDari(combo);
    if (mBaru > mult) { terbang('COMBO x' + mBaru + '!', '#facc15', 30, W / 2, VH * 0.36); }
    mult = mBaru; st.maxMult = Math.max(st.maxMult, mult);
    if (o.t === 'klip') { render = Math.min(100, render + RENDER_KLIP); skor += 100 * mult; terbang('+1 klip  +' + 100 * mult, warna, 18, kx, ky - 30); }
    else if (o.t === 'klapper') { st.klapper++; waktu += TAMBAH_KLAPPER; skor += 50 * mult; terbang('+' + TAMBAH_KLAPPER + ' dtk', warna, 20, kx, ky - 30); }
    else {
      bintang++; skor += 75 * mult;
      if (bintang >= 3) { bintang = 0; nitro = NITRO_DTK; kebal = NITRO_DTK + 0.5; st.nitro++; terbang('NITRO RENDER!', '#fb923c', 32, W / 2, VH * 0.3); }
      else terbang('★ ' + bintang + '/3', warna, 18, kx, ky - 30);
    }
  }
  function kecepatanLevel() { return [0, 1, 1.15, 1.3][level]; }

  function update(dt) {
    var b = Math.floor(pos / SEG);
    var s = fase === 'main' ? (kunci.k ? -1 : 0) + (kunci.n ? 1 : 0) + sentuh : fase === 'demo' ? aiSteer() : 0;
    s = Math.max(-1, Math.min(1, s));
    steer += (s - steer) * Math.min(1, dt * 12);
    var target = fase === 'kartu' ? MAX * 0.35 : fase === 'hasil' ? MAX * 0.25 : MAX * kecepatanLevel() * (nitro > 0 ? 1.45 : 1);
    spd += (target - spd) * dt * (spd < target ? 0.9 : 2);
    var rasio = Math.min(1.4, spd / MAX);
    px += steer * dt * 2.4 * Math.max(0.5, Math.min(1, rasio));
    px -= segs[b % JUMLAH].c * rasio * rasio * dt * 0.22; // sentrifugal ringan
    px = Math.max(-0.9, Math.min(0.9, px));                // tak pernah keluar jalur
    pos += spd * dt; guncang = Math.max(0, guncang - dt * 3);
    nitro = Math.max(0, nitro - dt); kebal = Math.max(0, kebal - dt);
    spawnSampai(b + TAMPAK);
    var kx = posKartX(), ky = VH - 96;
    for (var i = 0; i < 2; i++) {
      var arr = objs[b + i]; if (!arr) continue;
      arr.forEach(function (o) { if (!o.ambil && Math.abs(o.x - px) < 0.26) ambil(o, kx, ky); });
    }
    for (var d in objs) if (+d < b - 2) delete objs[d];
    kilat = kilat.filter(function (k) { k.t += dt; return k.t < 0.5; });
    teks = teks.filter(function (t) { t.t += dt; return t.t < 1.1; });
    percik = percik.filter(function (p) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; return p.t < 0.6; });
    if (fase === 'main') {
      tMain += dt; waktu -= dt;
      var lvBaru = tMain >= 30 ? 3 : tMain >= 15 ? 2 : 1;
      if (lvBaru > level) { level = lvBaru; terbang('LEVEL UP! ' + level, '#a855f7', 34, W / 2, VH * 0.28); }
      if (render >= 100) akhiri(true); else if (waktu <= 0) { waktu = 0; akhiri(false); }
    }
    skorTampil += (skor - skorTampil) * Math.min(1, dt * 8); if (Math.abs(skor - skorTampil) < 1) skorTampil = skor;
    if (main()) perbaruiHud();
  }
  function perbaruiHud() {
    elSkor.textContent = Math.round(skorTampil).toLocaleString('id-ID');
    elWaktu.textContent = waktu.toFixed(1); elWaktu.classList.toggle('genting', waktu < 10);
    elLv.textContent = level; elBar.style.width = render + '%'; elProg.textContent = Math.floor(render) + '%';
    elCombo.textContent = 'Combo x' + mult + (combo ? ' · ' + combo : ''); elCombo.classList.toggle('on', mult > 1);
    elBintang.textContent = nitro > 0 ? 'NITRO ' + nitro.toFixed(1) : '★★★'.slice(0, bintang) + '☆☆☆'.slice(bintang);
    elBintang.classList.toggle('on', nitro > 0);
    if (st) elMisi.textContent = (tantangan.cek(st) ? '✓ ' : '◎ ') + tantangan.teks + ' (' + tantangan.prog(st) + ')';
  }

  // ---- gambar ----
  var camX = 0, lebarKart = 100, pusatKart = 0;
  // x layar kart = proyeksi jalan yang sama di baris ky (pusat jalan + px * setengah lebar)
  function posKartX() { return (pusatKart || W / 2) + px * lebarKart; }
  function poly(x1, y1, w1, x2, y2, w2, warna) { cx.fillStyle = warna; cx.beginPath(); cx.moveTo(x1 - w1, y1); cx.lineTo(x2 - w2, y2); cx.lineTo(x2 + w2, y2); cx.lineTo(x1 + w1, y1); cx.fill(); }
  function langit(off) {
    var hz = H * 0.5, g = cx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, '#05070f'); g.addColorStop(1, '#1a1035'); cx.fillStyle = g; cx.fillRect(0, 0, W, hz + 2);
    var r = Math.min(W, H) * 0.16, sx = W / 2, sy = hz - r * 0.35;
    var gs = cx.createLinearGradient(0, sy - r, 0, sy + r); gs.addColorStop(0, '#fb923c'); gs.addColorStop(1, '#a855f7');
    cx.save(); cx.beginPath(); cx.arc(sx, sy, r, 0, 7); cx.clip(); cx.fillStyle = gs; cx.fillRect(sx - r, sy - r, 2 * r, 2 * r);
    cx.fillStyle = '#1a1035'; for (var i = 0; i < 6; i++) cx.fillRect(sx - r, sy + i * r * 0.17, 2 * r, 2 + i * 1.6); cx.restore();
    cx.fillStyle = '#0d1430';
    for (var x = -40; x < W + 40; x += 14) { var k = x + off * 0.12, hh = (Math.abs(Math.sin(k * 0.013) * 60) + Math.abs(Math.sin(k * 0.041)) * 26) * (H / 800); cx.fillRect(x - (off * 0.12 % 14), hz - hh, 10, hh); }
    var gb = cx.createLinearGradient(0, hz, 0, H); gb.addColorStop(0, '#120b2a'); gb.addColorStop(1, '#05070f'); cx.fillStyle = gb; cx.fillRect(0, hz, W, H - hz);
  }
  function ikon(t, x, y, s) {
    cx.save(); cx.translate(x, y); cx.lineWidth = Math.max(1, s * 0.08);
    var bagus = !(t === 'buffer' || t === 'glitch');
    if (bagus) { cx.fillStyle = 'rgba(34,211,238,.12)'; cx.beginPath(); cx.arc(0, 0, s * .85, 0, 7); cx.fill(); }
    if (t === 'klip') { cx.fillStyle = '#22d3ee'; cx.fillRect(-s * .6, -s * .4, s * 1.2, s * .8); cx.fillStyle = '#05070f'; cx.beginPath(); cx.moveTo(-s * .15, -s * .22); cx.lineTo(s * .25, 0); cx.lineTo(-s * .15, s * .22); cx.fill(); }
    else if (t === 'klapper') { cx.fillStyle = '#e6f6ff'; cx.fillRect(-s * .55, -s * .15, s * 1.1, s * .6); cx.fillStyle = '#a855f7'; cx.save(); cx.rotate(-0.3); cx.fillRect(-s * .55, -s * .45, s * 1.1, s * .22); cx.restore(); cx.fillStyle = '#05070f'; for (var i = 0; i < 3; i++) cx.fillRect(-s * .4 + i * s * .32, -s * .05, s * .14, s * .1); }
    else if (t === 'bintang') { cx.fillStyle = '#fb923c'; cx.beginPath(); for (var j = 0; j < 10; j++) { var a = j * Math.PI / 5 - Math.PI / 2, rr = j % 2 ? s * .25 : s * .6; cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } cx.fill(); }
    else if (t === 'buffer') { cx.strokeStyle = '#f43f5e'; cx.lineWidth = s * .14; for (var k = 0; k < 8; k++) { cx.globalAlpha = (k + 2) / 10; var an = k * Math.PI / 4 + performance.now() / 300; cx.beginPath(); cx.arc(0, 0, s * .45, an, an + .4); cx.stroke(); } }
    else { for (var m = 0; m < 5; m++) { cx.fillStyle = ['#f43f5e', '#22d3ee', '#a855f7'][m % 3]; cx.fillRect(-s * .55 + ((m * 37 + (performance.now() / 60 | 0)) % 7) * s * .04, -s * .5 + m * s * .2, s * 1.1, s * .16); } }
    cx.restore();
  }
  function kart(x, y, s, mir) {
    cx.save(); cx.translate(x, y); cx.rotate(mir * 0.16);
    if (kebal > 0) { cx.fillStyle = 'rgba(168,85,247,' + (0.18 + Math.sin(performance.now() / 70) * 0.08) + ')'; cx.beginPath(); cx.ellipse(0, -s * .3, s * 1, s * .7, 0, 0, 7); cx.fill(); }
    if (nitro > 0) { cx.fillStyle = 'rgba(251,146,60,.85)'; for (var f = -1; f <= 1; f += 2) { cx.beginPath(); cx.moveTo(f * s * .3 - s * .08, 0); cx.lineTo(f * s * .3, s * (.3 + Math.random() * .3)); cx.lineTo(f * s * .3 + s * .08, 0); cx.fill(); } }
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
    var gx = guncang ? Math.sin(performance.now() / 25) * 6 * guncang : 0;
    cx.save(); cx.translate(gx, 0);
    var b = Math.floor(pos / SEG), frac = (pos % SEG) / SEG, base = segs[b % JUMLAH];
    // kamera: geser jalan (bukan kart) supaya kart selalu di layar, juga di tikungan & jalan yang lebih lebar dari layar
    var lk = lebarKart || W * 0.4, lengkung = pusatKart ? pusatKart - W / 2 + camX * lk : 0,
        batas = W * (W < 640 ? 0.28 : 0.3), mau = lengkung + px * lk * 0.5;
    mau = Math.max(-batas, Math.min(batas, mau));
    camX = px - (mau - lengkung) / lk;
    var camH = 1100 + base.h, dx = -base.c * frac, x = 0, maxY = H, D = 0.84, hz = H * 0.5, ky = VH - 96;
    langit(pos * 0.002);
    var titik = []; lebarKart = 0;
    for (var n = 0; n < TAMPAK; n++) {
      var i = (b + n) % JUMLAH, sg = segs[i];
      var z1 = n * SEG - frac * SEG + 1, z2 = z1 + SEG;
      var s1 = D / z1 * H, s2 = D / z2 * H;
      var y1 = hz + (camH - sg.h) * s1 * 0.6, y2 = hz + (camH - segs[(i + 1) % JUMLAH].h) * s2 * 0.6;
      var cx1 = W / 2 + (-camX * LEBAR + x) * s1 * 0.6, cx2 = W / 2 + (-camX * LEBAR + x + dx) * s2 * 0.6;
      var w1 = LEBAR * s1 * 0.6, w2 = LEBAR * s2 * 0.6;
      x += dx; dx += sg.c;
      titik.push({ n: b + n, i: i, y: y1, cx: cx1, w: w1 });
      if (!lebarKart && n > 0 && y1 <= ky && titik[n - 1].y >= ky) {
        var pa = titik[n - 1], f = (pa.y - ky) / Math.max(1e-6, pa.y - y1);
        lebarKart = pa.w + (w1 - pa.w) * f; pusatKart = pa.cx + (cx1 - pa.cx) * f;
      }
      if (y2 >= maxY || y2 >= y1) continue;
      var gelap = (i >> 1) % 2;
      poly(cx1, y1, w1 * 1.32, cx2, y2, w2 * 1.32, gelap ? '#0b0f1f' : '#0f1428');
      poly(cx1, y1, w1 * 1.14, cx2, y2, w2 * 1.14, '#05070f');
      if (i % 2 === 0) {
        poly(cx1 - w1 * 1.07, y1, w1 * 0.035, cx2 - w2 * 1.07, y2, w2 * 0.035, '#cbd5e1');
        poly(cx1 + w1 * 1.07, y1, w1 * 0.035, cx2 + w2 * 1.07, y2, w2 * 0.035, '#cbd5e1');
      }
      poly(cx1, y1, w1, cx2, y2, w2, gelap ? '#161b33' : '#1b2140');
      if (i % 12 === 0) poly(cx1, y1, w1, cx2, y2, w2, i % 24 ? 'rgba(34,211,238,.55)' : 'rgba(168,85,247,.6)');
      if (gelap) { poly(cx1 - w1 / 3, y1, w1 * .012, cx2 - w2 / 3, y2, w2 * .012, 'rgba(230,246,255,.25)'); poly(cx1 + w1 / 3, y1, w1 * .012, cx2 + w2 / 3, y2, w2 * .012, 'rgba(230,246,255,.25)'); }
      maxY = y2;
    }
    if (!lebarKart) { lebarKart = W * 0.4; pusatKart = W / 2; }
    for (var t = titik.length - 1; t > 0; t--) {
      var p = titik[t], arr = objs[p.n];
      if (!arr || p.w < 3) continue;
      for (var a = 0; a < arr.length; a++) if (!arr[a].ambil) ikon(arr[a].t, p.cx + arr[a].x * p.w, p.y - p.w * .14, p.w * .2);
    }
    // garis kecepatan saat nitro
    if (nitro > 0) {
      cx.strokeStyle = 'rgba(230,246,255,.35)'; cx.lineWidth = 2;
      for (var L = 0; L < 26; L++) { var an = Math.random() * TAU, r0 = Math.min(W, H) * (0.25 + Math.random() * 0.2), r1 = r0 + 60 + Math.random() * 120; cx.beginPath(); cx.moveTo(W / 2 + Math.cos(an) * r0, hz + Math.sin(an) * r0 * 0.7); cx.lineTo(W / 2 + Math.cos(an) * r1, hz + Math.sin(an) * r1 * 0.7); cx.stroke(); }
    }
    var ks = Math.max(18, Math.min(lebarKart * 0.2, Math.min(W, H * 1.2) * 0.13)), kx = posKartX();
    kilat.forEach(function (k) { cx.strokeStyle = 'rgba(34,211,238,' + (1 - k.t * 2) + ')'; cx.lineWidth = 3; cx.beginPath(); cx.arc(kx, ky - ks * .4, ks * (0.6 + k.t * 2), 0, 7); cx.stroke(); });
    kart(kx, ky, ks, steer);
    percik.forEach(function (p) { cx.globalAlpha = 1 - p.t / 0.6; cx.fillStyle = p.c; cx.fillRect(p.x - 2, p.y - 2, 4, 4); });
    cx.globalAlpha = 1;
    cx.textAlign = 'center';
    teks.forEach(function (tt) {
      var a = tt.t < 0.15 ? tt.t / 0.15 : 1 - Math.max(0, tt.t - 0.6) / 0.5, sk = tt.t < 0.15 ? 0.6 + tt.t / 0.15 * 0.4 : 1;
      cx.globalAlpha = Math.max(0, a); cx.fillStyle = tt.c;
      cx.font = '700 ' + Math.round(tt.b * sk * (W < 640 ? 0.85 : 1)) + 'px "Space Grotesk",sans-serif';
      cx.shadowColor = 'rgba(0,0,0,.8)'; cx.shadowBlur = 8;
      cx.fillText(tt.s, Math.max(80, Math.min(W - 80, tt.x)), tt.y - tt.t * 50);
      cx.shadowBlur = 0;
    });
    cx.globalAlpha = 1; cx.restore();
  }

  // ---- loop ----
  var tPrev = 0;
  function loop(t) {
    if (!jalan) return;
    var dt = Math.min(0.05, (t - (tPrev || t)) / 1000); tPrev = t;
    update(dt); gambar(); requestAnimationFrame(loop);
  }
  function mulaiLoop() { if (jalan || (diam && !main())) return; if (!terlihat || document.hidden) return; jalan = true; tPrev = 0; requestAnimationFrame(loop); }
  function stopLoop() { jalan = false; }

  // ---- alur ronde ----
  function resetRonde() {
    skor = 0; skorTampil = 0; waktu = DURASI; render = 0; combo = 0; mult = 1; bintang = 0; nitro = 0; kebal = 0; tMain = 0; level = 1;
    st = { klapper: 0, maxMult: 1, nitro: 0, tabrak: 0, menang: false, sisa: 0 };
    teks = []; percik = []; objs = {}; nextSpawn = Math.floor(pos / SEG) + 12;
  }
  function kartuMisi() {
    fase = 'kartu'; resetRonde(); kunci.k = kunci.n = 0; sentuh = 0;
    tantangan = TANTANGAN[Math.floor(Math.random() * TANTANGAN.length)];
    pesan.innerHTML = '<div class="hk-kartu"><p class="hk-label">Misi</p><h2>Render video sebelum deadline</h2>' +
      '<ul><li><i class="c">▶</i> Ambil <b>klip</b>: isi bar RENDER sampai 100% dalam ' + DURASI + ' dtk</li>' +
      '<li><i class="w">▤</i> <b>Klapper</b> = +' + TAMBAH_KLAPPER + ' dtk · <i class="o">★</i> 3 <b>bintang</b> = NITRO (kebal)</li>' +
      '<li><i class="r">◌</i> Hindari <b>buffering</b> &amp; <b>glitch</b>: melambat, −' + KURANG_RINTANG + ' dtk, combo putus</li></ul>' +
      '<p class="hk-tantangan">Tantangan ronde ini: <b>' + tantangan.teks + '</b></p>' +
      '<p class="hk-kendali">← → / A D untuk setir · di HP ketuk atau geser kiri/kanan</p>' +
      '<button type="button" class="hk-besar" data-mulai>Mulai balapan <kbd>Spasi</kbd></button></div>';
    pesan.classList.add('on');
    var b = pesan.querySelector('[data-mulai]'); b.addEventListener('click', mulaiRonde); b.focus({ preventScroll: true });
    perbaruiHud();
  }
  function mulaiRonde() {
    if (fase !== 'kartu' && fase !== 'hasil') return;
    if (fase === 'hasil') resetRonde();
    pesan.classList.remove('on'); pesan.innerHTML = ''; fase = 'main'; btn.focus({ preventScroll: true });
    terbang('GO!', '#22d3ee', 40, W / 2, VH * 0.4);
  }
  function akhiri(menang) {
    fase = 'hasil'; kunci.k = kunci.n = 0; sentuh = 0;
    st.menang = menang; st.sisa = waktu;
    var bonusWaktu = menang ? Math.round(waktu * 50) : 0, okT = tantangan.cek(st), bonusT = okT ? 1000 : 0;
    skor += bonusWaktu + bonusT; skorTampil = skor;
    var med = null; if (menang) MEDALI.forEach(function (m) { if (skor >= m.s) med = m; });
    var idx = med ? MEDALI.indexOf(med) : -1, berikut = MEDALI[idx + 1];
    var best = bacaBest(), baru = skor > best; if (baru) { simpanBest(skor); elBest.textContent = skor; }
    var lagi = !menang ? 'Render belum selesai: kurang ' + Math.ceil(100 - render) + '%. Selesaikan render untuk medali Perunggu.'
      : berikut ? 'Kurang ' + (berikut.s - skor).toLocaleString('id-ID') + ' poin lagi untuk ' + berikut.n + '.' : 'Medali tertinggi. Kejar rekormu!';
    pesan.innerHTML = '<div class="hk-kartu hasil"><p class="hk-label">' + (menang ? 'Render selesai ✓' : 'Deadline lewat ✕') + '</p>' +
      '<div class="hk-medali" style="--m:' + (med ? med.c : '#475569') + '">' + (med ? med.n : 'Tanpa medali') + '</div>' +
      '<p class="hk-total">' + skor.toLocaleString('id-ID') + '<small>poin' + (baru ? ' · REKOR BARU!' : ' · rekor ' + Math.max(best, skor).toLocaleString('id-ID')) + '</small></p>' +
      '<p class="hk-rinci">Render ' + Math.floor(render) + '% · combo maks x' + st.maxMult + ' · bonus waktu +' + bonusWaktu + '</p>' +
      '<p class="hk-tantangan">' + (okT ? '✓' : '✕') + ' Tantangan: ' + tantangan.teks + (okT ? ' (+1.000)' : ' (' + tantangan.prog(st) + ')') + '</p>' +
      '<p class="hk-lagi">' + lagi + '<br>Ambang: Perak ' + MEDALI[1].s.toLocaleString('id-ID') + ' · Emas ' + MEDALI[2].s.toLocaleString('id-ID') + '</p>' +
      '<button type="button" class="hk-besar" data-lagi>↻ Main lagi <kbd>Spasi</kbd></button></div>';
    pesan.classList.add('on');
    var b = pesan.querySelector('[data-lagi]'); b.addEventListener('click', function () { kartuUlang(); }); b.focus({ preventScroll: true });
    perbaruiHud();
  }
  function kartuUlang() { tantangan = TANTANGAN[Math.floor(Math.random() * TANTANGAN.length)]; mulaiRonde(); }

  function masuk() {
    if (main()) return;
    hero.classList.add('hk-main'); btn.innerHTML = '✕ Keluar <kbd>Esc</kbd>'; btn.setAttribute('aria-label', 'Keluar dari game');
    if (window.__lenis && window.__lenis.stop) window.__lenis.stop();
    var top = hero.getBoundingClientRect().top; if (Math.abs(top) > 4) window.scrollBy({ top: top, behavior: diam ? 'auto' : 'smooth' });
    kartuMisi(); stopLoop(); terlihat = true; mulaiLoop();
  }
  function keluar() {
    if (!main()) return; fase = 'demo'; kunci.k = kunci.n = 0; sentuh = 0; pesan.classList.remove('on'); pesan.innerHTML = '';
    hero.classList.remove('hk-main'); btn.innerHTML = '▶ Main <kbd>Spasi</kbd>'; btn.setAttribute('aria-label', 'Main game Render Rally');
    if (window.__lenis && window.__lenis.start) window.__lenis.start();
    resetRonde(); teks = []; if (diam) { stopLoop(); gambar(); }
  }
  btn.addEventListener('click', function () { main() ? keluar() : masuk(); });

  function diKetik(e) { var t = e.target; return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  window.addEventListener('keydown', function (e) {
    if (diKetik(e)) return;
    var k = e.key, r;
    if (!main()) {
      if ((k === ' ' || k === 'Spacebar') && (r = hero.getBoundingClientRect()).bottom > 0 && r.top < window.innerHeight * 0.5 && (e.target === document.body || e.target === btn)) { e.preventDefault(); masuk(); }
      return;
    }
    if (k === 'Escape') { e.preventDefault(); keluar(); btn.focus(); return; }
    if ((k === ' ' || k === 'Enter') && (fase === 'kartu' || fase === 'hasil')) { e.preventDefault(); fase === 'hasil' ? kartuUlang() : mulaiRonde(); return; }
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { kunci.k = 1; e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { kunci.n = 1; e.preventDefault(); }
    else if (k === 'ArrowUp' || k === 'ArrowDown' || k === ' ' || k === 'PageDown' || k === 'PageUp') e.preventDefault();
  });
  window.addEventListener('keyup', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') kunci.k = 0;
    if (k === 'ArrowRight' || k === 'd' || k === 'D') kunci.n = 0;
  });
  // sentuh: ketuk sisi kiri/kanan = setir; geser = setir proporsional
  var awalX = null, awalPx = 0;
  cv.addEventListener('pointerdown', function (e) {
    if (fase !== 'main') { if (fase === 'kartu') mulaiRonde(); return; }
    var r = cv.getBoundingClientRect(); awalX = e.clientX; awalPx = px; sentuh = (e.clientX - r.left) < W / 2 ? -1 : 1;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  });
  cv.addEventListener('pointermove', function (e) {
    if (fase !== 'main' || awalX === null) return;
    var d = e.clientX - awalX; if (Math.abs(d) > 10) sentuh = Math.max(-1, Math.min(1, d / 50));
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) { cv.addEventListener(n, function () { awalX = null; sentuh = 0; }); });

  // ---- visibilitas ----
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { terlihat = en[0].isIntersecting; terlihat ? mulaiLoop() : stopLoop(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { document.hidden ? stopLoop() : mulaiLoop(); });
  window.addEventListener('resize', ukur);
  resetRonde();
  ukur();
  if (diam) { pos = SEG * 40; spd = 0; spawnSampai(40 + TAMPAK); gambar(); } else mulaiLoop();
  // pengait uji
})();
