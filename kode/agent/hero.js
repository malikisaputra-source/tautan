/* Hero AI Agent: kantor AI isometrik gaya hologram/blueprint neon (Three.js r128) */
(function () {
  "use strict";
  var wadah = document.getElementById("hero-khusus");
  if (!wadah || document.body.getAttribute("data-laman") !== "agent") return;
  wadah.setAttribute("aria-hidden", "true");
  var hp = window.matchMedia("(max-width: 767px)").matches;
  var diam = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cadangan() {
    wadah.innerHTML = "";
    var ns = "http://www.w3.org/2000/svg", s = '<svg class="hk-cadangan" viewBox="0 0 1100 360" xmlns="' + ns + '" fill="none" stroke="#22d3ee" stroke-opacity=".5">';
    for (var i = -10; i <= 10; i++) { s += '<path d="M' + (550 + i * 60) + ' 360 L' + (550 + i * 22) + ' 140" stroke-opacity=".18"/>'; }
    for (var j = 0; j < 6; j++) { var y = 150 + j * j * 7 + j * 12; s += '<path d="M0 ' + y + ' H1100" stroke-opacity=".14"/>'; }
    var meja = [[330, 250], [480, 230], [620, 230], [770, 250], [550, 300]];
    meja.forEach(function (m) { s += '<path d="M' + (m[0] - 40) + ' ' + m[1] + ' l40 -18 l40 18 l-40 18z" fill="#071322"/><rect x="' + (m[0] - 14) + '" y="' + (m[1] - 44) + '" width="28" height="18" rx="2" fill="#0e7490" fill-opacity=".5"/>'; });
    s += '<rect x="470" y="120" width="160" height="70" rx="6" stroke="#fbbf24" stroke-opacity=".6" fill="#1c1404" fill-opacity=".4"/></svg>';
    wadah.innerHTML = s;
  }

  function adaWebGL() {
    try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; }
  }
  if (!adaWebGL()) { cadangan(); return; }

  function muat(cb) {
    if (window.THREE) return cb();
    var sc = document.createElement("script");
    sc.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    sc.async = true; sc.crossOrigin = "anonymous";
    sc.onload = function () { window.THREE ? cb() : cadangan(); };
    sc.onerror = cadangan;
    document.head.appendChild(sc);
  }
  muat(function () { try { bangun(); } catch (e) { cadangan(); } });

  function bangun() {
    var T = window.THREE;
    var CYAN = 0x22d3ee, UNGU = 0x818cf8, AMBER = 0xfbbf24, GELAP = 0x07111f;
    var renderer = new T.WebGLRenderer({ antialias: !hp, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    wadah.appendChild(renderer.domElement);
    var lapis = document.createElement("div"); lapis.className = "hk-label-lapis"; wadah.appendChild(lapis);

    var scene = new T.Scene();
    scene.fog = new T.Fog(0x03060d, 26, 60);
    var cam = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    var akar = new T.Group(); scene.add(akar);
    scene.add(new T.AmbientLight(0x6b8cff, 0.55));
    var dl = new T.DirectionalLight(0x9be7ff, 0.7); dl.position.set(6, 12, 4); scene.add(dl);

    var W = hp ? 14 : 22, D = hp ? 12 : 16;
    // lantai grid bercahaya
    var lantai = new T.Mesh(new T.PlaneGeometry(W + 4, D + 4), new T.MeshBasicMaterial({ color: 0x041022, transparent: true, opacity: 0.85 }));
    lantai.rotation.x = -Math.PI / 2; akar.add(lantai);
    var grid = new T.GridHelper(Math.max(W, D) + 4, (Math.max(W, D) + 4), CYAN, CYAN);
    grid.material.transparent = true; grid.material.opacity = 0.16; grid.position.y = 0.01; akar.add(grid);

    function tepi(geo, warna, op) {
      return new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: warna, transparent: true, opacity: op == null ? 0.9 : op }));
    }
    function kotak(w, h, d, warna, tepiWarna, op) {
      var g = new T.BoxGeometry(w, h, d), grp = new T.Group();
      grp.add(new T.Mesh(g, new T.MeshLambertMaterial({ color: warna, transparent: op != null, opacity: op == null ? 1 : op })));
      grp.add(tepi(g, tepiWarna, 0.85)); return grp;
    }
    // dinding kaca belakang + kiri
    var kaca = new T.MeshBasicMaterial({ color: 0x0e7490, transparent: true, opacity: 0.07, side: T.DoubleSide, depthWrite: false });
    [[W, 0, -D / 2, 0], [D, -W / 2, 0, Math.PI / 2]].forEach(function (k) {
      var g = new T.PlaneGeometry(k[0], 3.2), m = new T.Mesh(g, kaca);
      m.position.set(k[1], 1.6, k[2]); m.rotation.y = k[3]; akar.add(m);
      var e = tepi(g, CYAN, 0.35); e.position.copy(m.position); e.rotation.y = k[3]; akar.add(e);
      for (var i = 1; i < 6; i++) { var t = new T.Mesh(new T.PlaneGeometry(0.03, 3.2), new T.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.25 }));
        var off = -k[0] / 2 + (k[0] / 6) * i; t.position.set(k[3] ? k[1] : off, 1.6, k[3] ? off : k[2]); t.rotation.y = k[3]; akar.add(t); }
    });

    // Mission Board hologram
    var papan = new T.Group(); papan.position.set(0, 2.1, -D / 2 + 0.4); akar.add(papan);
    var pg = new T.PlaneGeometry(4.2, 1.9);
    papan.add(new T.Mesh(pg, new T.MeshBasicMaterial({ color: 0x3a2a06, transparent: true, opacity: 0.45, side: T.DoubleSide, depthWrite: false })));
    papan.add(tepi(pg, AMBER, 0.9));
    var barisPapan = [];
    for (var b = 0; b < 4; b++) { var bar = new T.Mesh(new T.PlaneGeometry(3.4, 0.14), new T.MeshBasicMaterial({ color: b % 2 ? CYAN : AMBER, transparent: true, opacity: 0.7 }));
      bar.position.set(0, 0.55 - b * 0.38, 0.01); papan.add(bar); barisPapan.push(bar); }
    var papanTitik = new T.Vector3(0, 2.1, -D / 2 + 0.5);

    // agen & meja
    var peran = hp
      ? [["Kasir", "menghitung"], ["CS", "membalas chat"], ["Stok", "cek gudang"], ["Admin", "laporan harian"], ["Promo", "menulis caption"]]
      : [["Kasir", "menghitung"], ["CS", "membalas chat"], ["Stok", "cek gudang"], ["Admin", "menulis laporan harian"], ["Promo", "menulis caption"], ["Keuangan", "rekap kas"], ["Kurir", "atur pengiriman"], ["Riset", "pantau tren"]];
    var kol = hp ? 3 : 4, agen = [];
    var matTubuh = new T.MeshLambertMaterial({ color: 0x0b1a2e });
    peran.forEach(function (p, i) {
      var r = Math.floor(i / kol), c = i % kol, n = Math.min(kol, peran.length - r * kol);
      var x = (c - (n - 1) / 2) * (hp ? 3.6 : 4.4) + (r % 2 ? 1 : 0), z = -D / 2 + 4.2 + r * 4.2;
      var g = new T.Group(); g.position.set(x, 0, z); akar.add(g);
      var meja = kotak(1.9, 0.08, 1, GELAP, CYAN); meja.position.y = 0.78; g.add(meja);
      [[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]].forEach(function (k) { var l = kotak(0.06, 0.76, 0.06, GELAP, CYAN); l.position.set(k[0], 0.38, k[1]); g.add(l); });
      var monWarna = [CYAN, UNGU, 0x34d399][i % 3];
      var mg = new T.PlaneGeometry(0.9, 0.55), mon = new T.Mesh(mg, new T.MeshBasicMaterial({ color: monWarna, transparent: true, opacity: 0.55, side: T.DoubleSide }));
      mon.position.set(0, 1.18, -0.3); g.add(mon); var me = tepi(mg, monWarna, 1); me.position.copy(mon.position); g.add(me);
      var kursi = kotak(0.55, 0.08, 0.55, GELAP, UNGU); kursi.position.set(0, 0.48, 0.75); g.add(kursi);
      // agen low-poly
      var tub = new T.Group(); tub.position.set(0, 0, 0.75); g.add(tub);
      var bg = new T.CylinderGeometry(0.2, 0.26, 0.6, 6), badan = new T.Mesh(bg, matTubuh); badan.position.y = 0.82; tub.add(badan);
      var be = tepi(bg, CYAN, 0.8); be.position.y = 0.82; tub.add(be);
      var kg = new T.IcosahedronGeometry(0.19, 0), kep = new T.Mesh(kg, matTubuh); kep.position.y = 1.32; tub.add(kep);
      var ke = tepi(kg, CYAN, 0.95); ke.position.y = 1.32; tub.add(ke);
      var mata = new T.Mesh(new T.BoxGeometry(0.2, 0.04, 0.02), new T.MeshBasicMaterial({ color: CYAN })); mata.position.set(0, 1.34, -0.17); tub.add(mata);
      var lab = document.createElement("div"); lab.className = "hk-label"; lab.innerHTML = p[0] + " · <i>" + p[1] + "…</i>"; lapis.appendChild(lab);
      agen.push({ g: g, tub: tub, mon: mon, lab: lab, fase: i * 1.7, mode: i % 4 === 3 ? "jalan" : (i % 4 === 2 ? "berdiri" : "ketik"), monTitik: new T.Vector3(x, 1.2, z - 0.3) });
    });
    var labPapan = document.createElement("div"); labPapan.className = "hk-label papan"; labPapan.textContent = "Mission Board · 12 tugas"; lapis.appendChild(labPapan);

    // aliran data: kurva meja -> papan dengan partikel
    var aliran = [], nPart = hp ? 4 : 6, posPart = [], kurva = [];
    agen.forEach(function (a) {
      var mid = a.monTitik.clone().lerp(papanTitik, 0.5); mid.y += 2.2;
      var cv = new T.QuadraticBezierCurve3(a.monTitik, mid, papanTitik); kurva.push(cv);
      var lg = new T.BufferGeometry().setFromPoints(cv.getPoints(24));
      akar.add(new T.Line(lg, new T.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.18 })));
      for (var k = 0; k < nPart; k++) aliran.push({ c: kurva.length - 1, t: k / nPart });
    });
    var pgeo = new T.BufferGeometry(); posPart = new Float32Array(aliran.length * 3);
    pgeo.setAttribute("position", new T.BufferAttribute(posPart, 3));
    akar.add(new T.Points(pgeo, new T.PointsMaterial({ color: 0xa5f3fc, size: hp ? 0.16 : 0.13, transparent: true, opacity: 0.95, depthWrite: false })));

    // ukuran & kamera
    var batas = 0, isi = wadah.parentNode.querySelector(".k-hero-isi"), lebar = 1, tinggi = 1, zoom = hp ? 9.5 : 10.5;
    function ukur() {
      lebar = wadah.clientWidth || 1; tinggi = wadah.clientHeight || 1;
      renderer.setSize(lebar, tinggi, false);
      batas = isi ? isi.getBoundingClientRect().bottom - wadah.getBoundingClientRect().top + 10 : tinggi * 0.66;
      var asp = lebar / tinggi, h = hp ? zoom * 1.25 : zoom;
      cam.left = -h * asp; cam.right = h * asp; cam.top = h; cam.bottom = -h; cam.updateProjectionMatrix();
    }
    // kantor diletakkan di bawah teks: geser frustum ke atas agar scene muncul di bagian bawah layar
    var sudut = Math.PI / 4, mx = 0, my = 0, tx = 0, ty = 0, v = new T.Vector3();
    function posKamera() {
      var a = sudut + mx * 0.18, r = 30;
      cam.position.set(Math.sin(a) * r, 20 + my * 1.5, Math.cos(a) * r);
      cam.lookAt(0, hp ? 10.5 : 8.6, 0);
    }
    function proyeksi(el, p) {
      v.copy(p).project(cam);
      if (v.z > 1) { el.style.opacity = 0; return; }
      var py = (-v.y * 0.5 + 0.5) * tinggi;
      el.style.opacity = py - 22 < batas ? 0 : "";
      el.style.transform = "translate(" + ((v.x * 0.5 + 0.5) * lebar).toFixed(1) + "px," + py.toFixed(1) + "px) translate(-50%,-100%)";
    }
    var tmp = new T.Vector3();
    function langkah(t) {
      sudut = Math.PI / 4 + Math.sin(t * 0.06) * 0.35;
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      posKamera();
      agen.forEach(function (a, i) {
        var f = t + a.fase;
        if (a.mode === "ketik") { a.tub.position.y = Math.abs(Math.sin(f * 7)) * 0.02; a.tub.rotation.y = Math.sin(f * 0.8) * 0.15; }
        else if (a.mode === "berdiri") { var s = (Math.sin(f * 0.5) + 1) / 2; a.tub.position.y = s * 0.25; a.tub.rotation.y = Math.sin(f * 0.3) * 0.6; }
        else { var w = Math.sin(f * 0.45); a.tub.position.x = w * 1.3; a.tub.position.z = 0.75 + Math.max(0, Math.cos(f * 0.45)) * 0.8; a.tub.rotation.y = Math.cos(f * 0.45) > 0 ? -Math.PI / 2 : Math.PI / 2; a.tub.position.y = Math.abs(Math.sin(f * 6)) * 0.05; }
        a.mon.material.opacity = 0.45 + Math.sin(f * 2.3) * 0.12;
        tmp.set(0, 1.75, 0); a.tub.localToWorld(tmp); proyeksi(a.lab, tmp);
      });
      tmp.copy(papanTitik); tmp.y += 1.15; proyeksi(labPapan, tmp);
      barisPapan.forEach(function (bb, i) { bb.scale.x = 0.35 + ((Math.sin(t * 0.7 + i * 1.3) + 1) / 2) * 0.65; bb.position.x = -1.7 * (1 - bb.scale.x); });
      var q = new T.Vector3();
      aliran.forEach(function (p, i) { var u = (p.t + t * 0.12) % 1; kurva[p.c].getPoint(u, q); posPart[i * 3] = q.x; posPart[i * 3 + 1] = q.y; posPart[i * 3 + 2] = q.z; });
      pgeo.attributes.position.needsUpdate = true;
      renderer.render(scene, cam);
    }

    ukur();
    var jalan = false, terlihat = true, raf = 0, t0 = performance.now();
    function loop(now) { raf = 0; if (!jalan) return; langkah((now - t0) / 1000); raf = requestAnimationFrame(loop); }
    function atur() {
      var harus = !diam && terlihat && !document.hidden;
      if (harus && !jalan) { jalan = true; raf = requestAnimationFrame(loop); }
      else if (!harus && jalan) { jalan = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    }
    langkah(diam ? 4 : 0);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { terlihat = es[0].isIntersecting; atur(); }).observe(wadah);
    document.addEventListener("visibilitychange", atur);
    var rt = 0;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { ukur(); if (!jalan) langkah(diam ? 4 : (performance.now() - t0) / 1000); }, 120); }, { passive: true });
    if (!diam && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", function (e) { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });
    }
    renderer.domElement.addEventListener("webglcontextlost", function (e) { e.preventDefault(); jalan = false; cadangan(); });
    atur();
  }
})();
