/* Gedung kantor 3D Rakn Academy — ruang tiap divisi, ruang CEO, gym, kolam renang (three.js r128) */
(() => {
  const wadah = document.getElementById("kantor");
  if (!wadah || !window.THREE) return;
  const diam = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = THREE;

  const RUANG = [
    { nama: "Ruang Strategi", x: -10, z: -7, w: 6, d: 5.5, lantai: 0xffe3d6 },
    { nama: "Ruang Copywriting", x: -4, z: -7, w: 6, d: 5.5, lantai: 0xdaf3e6 },
    { nama: "Ruang CEO", x: 2, z: -7, w: 8, d: 5.5, lantai: 0xe9e2ff },
    { nama: "Studio Motion", x: -10, z: -1.5, w: 6, d: 5.5, lantai: 0xdde3ff },
    { nama: "Ruang Publisher", x: -4, z: -1.5, w: 6, d: 5.5, lantai: 0xffe0ec },
    { nama: "Gym", x: 2, z: -1.5, w: 8, d: 5.5, lantai: 0xe6e8ef },
  ];
  const AGEN = [
    { nama: "Strategi", warna: 0xff6b3d, css: "#FF6B3D", meja: [-7.6, -4.6],
      tugas: ["membaca brief klien", "riset 3 referensi gaya", "menentukan sudut konten", "ide.md → Copywriter"] },
    { nama: "Copywriter", warna: 0x2bb673, css: "#2BB673", meja: [-1.6, -4.6],
      tugas: ["menulis hook 3 detik", "naskah 30 detik", "caption + hashtag", "naskah.md → Studio Motion"] },
    { nama: "Motion Designer", warna: 0x3b4bff, css: "#3B4BFF", meja: [-7.6, 0.9],
      tugas: ["menyusun scene 9:16", "animasi teks & ikon", "render video", "video.mp4 → Publisher"] },
    { nama: "Publisher", warna: 0xe84b8a, css: "#E84B8A", meja: [-1.6, 0.9],
      tugas: ["membuka penjadwal", "pasang caption & sampul", "pilih jam tayang 20.30", "minta persetujuan → CEO"] },
    { nama: "CEO (kamu)", warna: 0xffc24b, css: "#FFC24B", meja: [5.4, -4.6], ceo: true,
      tugas: ["cek video & caption", "✓ disetujui, jadwalkan!"] },
  ];

  const scene = new T.Scene();
  const W = () => wadah.clientWidth, H = () => wadah.clientHeight;
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  wadah.prepend(renderer.domElement);
  const cam = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  const AWAL = new T.Vector3(0, 0, 1.6), pusat = AWAL.clone(), arah = new T.Vector3(14, 16, 15);
  const zoomAwal = () => (W() < 700 ? 2.1 : 1);
  let zoomF = zoomAwal(); if (W() < 700) pusat.set(-3, 0, -1.5);
  const zoomDasar = () => Math.min(W() / 28, H() / 17.5);
  function kamera() {
    cam.position.copy(pusat).add(arah); cam.lookAt(pusat);
    const z = zoomDasar() * zoomF, w = W(), h = H();
    cam.left = -w / z / 2; cam.right = w / z / 2; cam.top = h / z / 2; cam.bottom = -h / z / 2; cam.updateProjectionMatrix();
  }
  function ukur() { renderer.setSize(W(), H()); kamera(); }

  scene.add(new T.HemisphereLight(0xffffff, 0xb9c2ff, 0.78));
  const mat = new T.DirectionalLight(0xffffff, 0.72); mat.position.set(10, 20, 8); mat.castShadow = true;
  mat.shadow.mapSize.set(2048, 2048); Object.assign(mat.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, far: 60 }); scene.add(mat);

  const M = (c, o = {}) => new T.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
  const kotak = (w, h, d, c, x, y, z, bayang = true, induk = scene) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), typeof c === "number" ? M(c) : c); m.position.set(x, y, z); m.castShadow = bayang; m.receiveShadow = true; induk.add(m); return m; };
  const silinder = (r1, r2, h, c, x, y, z, seg = 12) => { const m = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg), typeof c === "number" ? M(c) : c); m.position.set(x, y, z); m.castShadow = true; scene.add(m); return m; };
  const pohon = (x, z, s = 1, c = 0x2bb673) => { silinder(0.12 * s, 0.15 * s, 0.6 * s, 0x8a5a3c, x, 0.3 * s, z, 6); const d = new T.Mesh(new T.IcosahedronGeometry(0.75 * s, 0), M(c)); d.position.set(x, 1.1 * s, z); d.castShadow = true; scene.add(d); };

  /* tanah & gedung */
  kotak(32, 0.3, 26, 0x9fd38a, 0, -0.35, 2, false);
  kotak(20.4, 0.5, 11.4, 0x1c2280, 0, -0.1, -1.5, false);
  RUANG.forEach((r) => { kotak(r.w - 0.12, 0.06, r.d - 0.12, r.lantai, r.x + r.w / 2, 0.18, r.z + r.d / 2, false); r.pusat = [r.x + r.w / 2, r.z + r.d / 2]; });
  kotak(20.2, 2.8, 0.2, 0xd9def7, 0, 1.55, -7.05);
  kotak(0.2, 2.8, 11.2, 0xc9d0f2, -10.05, 1.55, -1.5);
  kotak(20.2, 0.5, 0.15, 0xc9d0f2, 0, 0.4, 4.05);
  kotak(0.15, 0.5, 11.2, 0xc9d0f2, 10.05, 0.4, -1.5);
  // sekat vertikal (x = -4 dan 2), ada pintu di tengah tiap ruangan
  [-4, 2].forEach((x) => [-7, -1.5].forEach((z) => { kotak(0.12, 1.1, 1.85, 0xeef1ff, x, 0.7, z + 0.95); kotak(0.12, 1.1, 1.85, 0xeef1ff, x, 0.7, z + 4.55); }));
  // sekat horizontal (z = -1.5), ada pintu
  [[-10, 6], [-4, 6], [2, 8]].forEach(([x, w]) => { const s = (w - 1.4) / 2; kotak(s, 1.1, 0.12, 0xeef1ff, x + s / 2, 0.7, -1.5); kotak(s, 1.1, 0.12, 0xeef1ff, x + w - s / 2, 0.7, -1.5); });
  for (let i = 0; i < 7; i++) kotak(1.6, 1.1, 0.05, 0x9fc0ff, -8.5 + i * 2.85, 1.9, -6.93, false);
  for (let i = 0; i < 3; i++) kotak(0.05, 1.1, 1.8, 0x9fc0ff, -9.93, 1.9, -5 + i * 3.4, false);
  kotak(3.4, 0.7, 0.08, 0x2b3bf0, 6, 2.55, -6.9, false);

  /* perabot */
  kotak(2.2, 1.1, 0.06, 0xffffff, -7, 1.6, -6.85, false);
  [0xffc24b, 0xff6b9a, 0x5ee7ff, 0x3ddc97].forEach((c, i) => kotak(0.36, 0.3, 0.03, c, -7.7 + i * 0.48, 1.7, -6.8, false));
  silinder(0.6, 0.6, 0.06, 0xffffff, -5.3, 0.72, -2.9); silinder(0.06, 0.06, 0.5, 0x9aa3d1, -5.3, 0.45, -2.9);
  kotak(0.5, 1.8, 2.2, 0x8a5a3c, 1.5, 1.1, -5.6); [0xff6b3d, 0x3b4bff, 0x2bb673, 0xe84b8a].forEach((c, i) => kotak(0.3, 0.32, 1.8, c, 1.45, 0.55 + i * 0.4, -5.6, false));
  kotak(4.2, 0.03, 3, 0x2b3bf0, 6, 0.22, -4.3, false);
  kotak(1.2, 0.5, 2.6, 0x3d2a6a, 8.9, 0.47, -3.9); kotak(0.35, 0.9, 2.6, 0x3d2a6a, 9.4, 0.7, -3.9);
  kotak(0.5, 0.75, 0.5, 0xffffff, 3.2, 0.55, -6.3); silinder(0.18, 0.12, 0.35, 0xffc24b, 3.2, 1.1, -6.3);
  pohon(9.2, -6.4, 0.7);
  kotak(2.6, 1.5, 0.08, 0x0b1033, -7, 1.7, -1.42);
  const layarBesar = kotak(2.4, 1.3, 0.04, M(0x3b4bff, { emissive: 0x3b4bff, emissiveIntensity: 0.5 }), -7, 1.7, -1.36, false);
  silinder(0.04, 0.04, 1.8, 0x14183d, -9.3, 0.9, 3.2); silinder(0.3, 0.15, 0.35, 0xffffff, -9.3, 1.9, 3.2);
  kotak(1.8, 1, 0.06, 0xffffff, -1, 1.5, -1.42, false);
  for (let i = 0; i < 14; i++) kotak(0.2, 0.16, 0.02, i < 9 ? 0xe84b8a : 0xdfe3f5, -1.7 + (i % 7) * 0.24, 1.7 - Math.floor(i / 7) * 0.26, -1.38, false);
  // gym
  const tm = new T.Group(); tm.position.set(3.8, 0.2, 0.6); scene.add(tm);
  kotak(0.9, 0.2, 2, 0x14183d, 0, 0.1, 0, true, tm); kotak(0.08, 1.1, 0.08, 0x9aa3d1, -0.4, 0.65, -0.9, true, tm); kotak(0.08, 1.1, 0.08, 0x9aa3d1, 0.4, 0.65, -0.9, true, tm); kotak(0.9, 0.12, 0.3, 0x3b4bff, 0, 1.2, -0.9, true, tm);
  kotak(1.8, 0.8, 0.5, 0x6b7090, 7.6, 0.6, -0.9); for (let i = 0; i < 5; i++) silinder(0.1, 0.1, 0.4, 0x14183d, 6.9 + i * 0.35, 1.05, -0.9, 8).rotation.x = Math.PI / 2;
  kotak(0.5, 0.35, 1.8, 0x14183d, 6.2, 0.4, 2); kotak(2.2, 0.04, 1.4, 0x5ee7ff, 8.4, 0.23, 2.6, false);
  silinder(0.02, 0.02, 1.6, 0x9aa3d1, 6.2, 1.05, 1.3, 6).rotation.z = Math.PI / 2;
  const pelari = new T.Group(); pelari.position.set(3.8, 0.4, 0.7); pelari.rotation.y = Math.PI / 2; scene.add(pelari);
  const pb = new T.Mesh(new T.CylinderGeometry(0.26, 0.3, 0.7, 14), M(0x2bb673)); pb.position.y = 1.0; pb.castShadow = true; pelari.add(pb);
  const pk = new T.Mesh(new T.SphereGeometry(0.24, 18, 14), M(0xe0ac85)); pk.position.y = 1.58; pk.castShadow = true; pelari.add(pk);
  const prb = new T.Mesh(new T.SphereGeometry(0.25, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2.2), M(0x1b1430)); prb.position.y = 1.6; prb.rotation.z = -0.25; pelari.add(prb);
  const kaki = [-0.12, 0.12].map((s) => { const k = new T.Mesh(new T.BoxGeometry(0.14, 0.62, 0.14), M(0x14183d)); k.geometry.translate(0, -0.31, 0); k.position.set(0, 0.66, s); k.castShadow = true; pelari.add(k); return k; });
  const lengan = [-0.32, 0.32].map((s) => { const l = new T.Mesh(new T.BoxGeometry(0.1, 0.5, 0.1), M(0x2bb673)); l.geometry.translate(0, -0.22, 0); l.position.set(0, 1.28, s); l.castShadow = true; pelari.add(l); return l; });

  /* kolam renang */
  kotak(13, 0.1, 6.4, 0xf4efe4, 0, -0.15, 8.4, false);
  kotak(9, 0.12, 4, 0x2e9be6, 0, -0.08, 8.4, false);
  const air = kotak(8.6, 0.05, 3.6, M(0x5ee7ff, { transparent: true, opacity: 0.85, roughness: 0.15 }), 0, 0.0, 8.4, false);
  [-4.6, 4.6].forEach((x) => kotak(0.2, 0.25, 4.2, 0xffffff, x, 0.0, 8.4, false));
  [-1, 1.4, 3.8].forEach((x) => { kotak(0.8, 0.12, 1.8, 0xffffff, x, 0.08, 11.1); const s = kotak(0.8, 0.5, 0.12, 0xffffff, x, 0.3, 10.25); s.rotation.x = -0.5; });
  silinder(0.03, 0.03, 1.6, 0xffffff, -5.6, 0.75, 10.6, 6); const payung = new T.Mesh(new T.ConeGeometry(1.1, 0.5, 8), M(0xff6b3d)); payung.position.set(-5.6, 1.7, 10.6); payung.castShadow = true; scene.add(payung);
  const pelampung = new T.Mesh(new T.TorusGeometry(0.35, 0.12, 8, 18), M(0xff6b9a)); pelampung.rotation.x = Math.PI / 2; pelampung.position.set(-2, 0.1, 7.8); scene.add(pelampung);
  const perenang = new T.Group(); perenang.position.set(2, 0.05, 8.8); scene.add(perenang);
  const rb_ = new T.Mesh(new T.CylinderGeometry(0.26, 0.3, 0.7, 14), M(0xff6b3d)); rb_.rotation.z = Math.PI / 2; rb_.position.x = -0.2; perenang.add(rb_);
  const rk_ = new T.Mesh(new T.SphereGeometry(0.24, 18, 14), M(0xc98e66)); rk_.position.set(0.36, 0.08, 0); perenang.add(rk_);
  const rr_ = new T.Mesh(new T.SphereGeometry(0.25, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2.2), M(0x1b1430)); rr_.position.set(0.34, 0.1, 0); rr_.rotation.z = -1.3; perenang.add(rr_);
  const kakiR = [-0.12, 0.12].map((s) => { const k = new T.Mesh(new T.BoxGeometry(0.5, 0.13, 0.13), M(0x14183d)); k.geometry.translate(-0.25, 0, 0); k.position.set(-0.55, 0, s); perenang.add(k); return k; });
  const lenganR = [-0.32, 0.32].map((s) => { const l = new T.Mesh(new T.BoxGeometry(0.1, 0.5, 0.1), M(0xff6b3d)); l.geometry.translate(0, 0.22, 0); l.position.set(0.1, 0.05, s); perenang.add(l); return l; });
  [[-7.5, 6.4], [7.6, 6.2], [-12.5, 0], [12.5, -3], [12.4, 3.5], [-12.6, -5.5], [7.5, 10.6]].forEach(([x, z], i) => pohon(x, z, 1 + (i % 3) * 0.2, i % 4 === 3 ? 0xff8fb5 : 0x2bb673));

  /* meja + agent */
  const kulit = [0xf2c19b, 0xc98e66, 0xe0ac85, 0x9c6b4a, 0xd9a27a];
  AGEN.forEach((a, i) => {
    const [x, z] = a.meja, g = new T.Group(); g.position.set(x, 0.2, z); scene.add(g);
    const add = (geo, c, px, py, pz) => { const m = new T.Mesh(geo, typeof c === "number" ? M(c) : c); m.position.set(px, py, pz); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    add(new T.BoxGeometry(a.ceo ? 2.4 : 1.8, 0.08, a.ceo ? 1.3 : 1), a.ceo ? 0x3d2a6a : 0xffffff, 0.6, 0.78, 0);
    [[-0.2, -0.4], [1.4, -0.4], [-0.2, 0.4], [1.4, 0.4]].forEach(([px, pz]) => add(new T.BoxGeometry(0.07, 0.74, 0.07), 0x9aa3d1, px, 0.39, pz));
    add(new T.BoxGeometry(0.06, 0.55, 0.9), 0x14183d, 1.25, 1.12, 0);
    a.layar = add(new T.BoxGeometry(0.02, 0.47, 0.8), M(a.warna, { emissive: a.warna, emissiveIntensity: 0.25 }), 1.21, 1.12, 0);
    add(new T.BoxGeometry(0.3, 0.03, 0.6), 0xd7dbef, 0.75, 0.84, 0);
    add(new T.CylinderGeometry(0.07, 0.07, 0.16, 10), a.warna, 0.25, 0.9, 0.35);
    const kursi = a.ceo ? 0x14183d : 0x2a2f7a;
    add(new T.BoxGeometry(0.62, 0.1, 0.62), kursi, -0.25, 0.5, 0); add(new T.BoxGeometry(0.1, a.ceo ? 0.95 : 0.65, 0.62), kursi, -0.55, a.ceo ? 1 : 0.85, 0);
    const badan = new T.Group(); badan.position.set(-0.2, 0.55, 0); g.add(badan);
    const t = new T.Mesh(new T.CylinderGeometry(0.26, 0.3, 0.7, 14), M(a.warna)); t.position.y = 0.4; t.castShadow = true; badan.add(t);
    const kp = new T.Mesh(new T.SphereGeometry(0.24, 18, 14), M(kulit[i])); kp.position.y = 0.98; kp.castShadow = true; badan.add(kp);
    const rb = new T.Mesh(new T.SphereGeometry(0.25, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2.2), M(0x1b1430)); rb.position.y = 1.0; rb.rotation.z = -0.25; badan.add(rb);
    a.tangan = [-0.16, 0.16].map((s) => { const l = new T.Mesh(new T.BoxGeometry(0.5, 0.1, 0.1), M(a.warna)); l.position.set(0.28, 0.5, s); badan.add(l); return l; });
    a.badan = badan; a.kepala = kp; a.titik = new T.Vector3(x - 0.2, 2.3, z);
  });

  const paket = new T.Mesh(new T.BoxGeometry(0.42, 0.3, 0.55), M(0xffffff, { emissive: 0x5ee7ff, emissiveIntensity: 0.45 }));
  paket.castShadow = true; paket.visible = false; scene.add(paket);
  const jejak = new T.Mesh(new T.RingGeometry(0.3, 0.44, 24), new T.MeshBasicMaterial({ color: 0x3b4bff, transparent: true, opacity: 0.5, side: T.DoubleSide }));
  jejak.rotation.x = -Math.PI / 2; jejak.visible = false; scene.add(jejak);

  /* label HTML */
  const vv = new T.Vector3();
  const labelRuang = RUANG.map((r) => ({ nama: r.nama, p: new T.Vector3(r.x + r.w - 0.4, 0.25, r.z + r.d - 0.45) })).concat([{ nama: "Kolam Renang", p: new T.Vector3(4, 0.1, 10.4) }]).map((r) => {
    const el = document.createElement("div"); el.className = "k-ruang"; el.textContent = r.nama; wadah.appendChild(el); return { el, p: r.p };
  });
  AGEN.forEach((a) => {
    const el = document.createElement("div"); el.className = "k-label" + (a.ceo ? " k-ceo" : "");
    el.innerHTML = `<span class="k-titik" style="background:${a.css}"></span><b>${a.nama}</b><span class="k-tugas"></span>`;
    wadah.appendChild(el); a.el = el; a.elTugas = el.querySelector(".k-tugas");
  });
  const papanEl = document.getElementById("kantor-papan"), jamEl = document.getElementById("kantor-jam"), statEl = document.getElementById("kantor-stat");
  const taruh = (el, p, gy = "-100%", gx = "-50%") => { vv.copy(p).project(cam); el.style.transform = `translate(${gx},${gy}) translate(${(vv.x + 1) / 2 * W()}px,${(1 - vv.y) / 2 * H()}px)`; };
  function posLabel() { AGEN.forEach((a) => taruh(a.el, a.titik)); labelRuang.forEach((l) => taruh(l.el, l.p, "-50%", "-100%")); }

  /* alur kerja */
  let aktif = 0, langkah = 0, tOper = -1, log = [], selesai = 0;
  const catat = (a, teks) => { log.unshift(`<li><b style="color:${a.css}">${a.nama}</b> ${teks}</li>`); log = log.slice(0, 4); if (papanEl) papanEl.innerHTML = log.join(""); };
  function setStatus() {
    AGEN.forEach((a, i) => {
      let s, k;
      if (a.ceo) { if (aktif === 4) { s = a.tugas[langkah]; k = langkah === 1 ? "ok" : "tunggu"; } else { s = "memantau tim"; k = "antri"; } }
      else if (i < aktif) { s = "✓ selesai"; k = "ok"; } else if (i === aktif) { s = a.tugas[langkah]; k = "kerja"; } else { s = "menunggu giliran"; k = "antri"; }
      a.elTugas.textContent = s; a.el.dataset.st = k;
      a.layar.material.emissiveIntensity = i === aktif ? 0.9 : i < aktif ? 0.35 : 0.12;
    });
    if (statEl) statEl.textContent = aktif === 4 && langkah === 1 ? `konten ke-${selesai} terjadwal ✓` : `${Math.min(aktif, 4)} dari 4 agent selesai`;
  }
  function ulang() { aktif = 0; langkah = 0; log = []; catat(AGEN[0], AGEN[0].tugas[0]); setStatus(); setTimeout(maju, 1600); }
  function maju() {
    const a = AGEN[aktif];
    if (a.ceo) { langkah = 1; selesai++; catat(a, a.tugas[1]); setStatus(); return setTimeout(ulang, 4200); }
    if (langkah < 3) { langkah++; catat(a, a.tugas[langkah]); setStatus(); return setTimeout(maju, 1600); }
    tOper = 0; paket.visible = jejak.visible = true;
  }
  catat(AGEN[0], AGEN[0].tugas[0]); setStatus();

  /* geser & zoom */
  let seret = null;
  const kn = new T.Vector3(1, 0, -1).normalize(), dp = new T.Vector3(1, 0, 1).normalize();
  wadah.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; seret = { x: e.clientX, y: e.clientY, p: pusat.clone() }; wadah.classList.add("seret"); });
  addEventListener("pointermove", (e) => {
    if (!seret) return; const z = zoomDasar() * zoomF, dx = (e.clientX - seret.x) / z, dy = (e.clientY - seret.y) / z;
    pusat.copy(seret.p).addScaledVector(kn, -dx).addScaledVector(dp, -dy * 1.6);
    pusat.x = Math.max(-11, Math.min(11, pusat.x)); pusat.z = Math.max(-8, Math.min(11, pusat.z)); kamera();
  });
  addEventListener("pointerup", () => { seret = null; wadah.classList.remove("seret"); });
  document.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
    const v = b.dataset.zoom; if (v === "0") { zoomF = zoomAwal(); if (W() < 700) pusat.set(-3, 0, -1.5); else pusat.copy(AWAL); } else zoomF = Math.max(0.8, Math.min(3, zoomF * (v === "+" ? 1.35 : 1 / 1.35))); kamera();
  }));

  const jam = new T.Clock();
  let hidup = false;
  function loop() {
    requestAnimationFrame(loop);
    if (!hidup) return;
    const t = jam.getElapsedTime();
    AGEN.forEach((a, i) => {
      const kerja = i === aktif;
      a.badan.position.y = 0.55 + (kerja ? Math.abs(Math.sin(t * 9)) * 0.03 : Math.sin(t * 1.5 + i) * 0.01);
      a.badan.rotation.z = kerja ? -0.12 : 0.08;
      a.kepala.rotation.y = kerja ? Math.sin(t * 2) * 0.15 : Math.sin(t * 0.6 + i) * 0.5;
      a.tangan.forEach((l, j) => (l.position.y = 0.5 + (kerja ? Math.sin(t * 22 + j * 3) * 0.035 : 0)));
    });
    kaki[0].rotation.z = Math.sin(t * 10) * 0.6; kaki[1].rotation.z = -Math.sin(t * 10) * 0.6; lengan[0].rotation.z = -Math.sin(t * 10) * 0.7; lengan[1].rotation.z = Math.sin(t * 10) * 0.7; pelari.position.y = 0.4 + Math.abs(Math.sin(t * 10)) * 0.05;
    perenang.position.x = Math.sin(t * 0.5) * 3.2; perenang.position.y = 0.05 + Math.sin(t * 4) * 0.03; perenang.rotation.y = Math.cos(t * 0.5) >= 0 ? 0 : Math.PI; lenganR[0].rotation.z = t * 5; lenganR[1].rotation.z = t * 5 + Math.PI; kakiR[0].rotation.y = Math.sin(t * 12) * 0.25; kakiR[1].rotation.y = -Math.sin(t * 12) * 0.25;
    pelampung.position.y = 0.1 + Math.sin(t * 1.6) * 0.04; pelampung.rotation.z = t * 0.3;
    air.material.opacity = 0.8 + Math.sin(t * 2) * 0.05;
    layarBesar.material.emissiveIntensity = 0.35 + (aktif === 2 ? 0.4 + Math.sin(t * 6) * 0.2 : 0);
    if (tOper >= 0) {
      tOper = Math.min(1, tOper + 0.009);
      const a = AGEN[aktif].meja, b = AGEN[aktif + 1].meja, e = tOper < 0.5 ? 2 * tOper * tOper : 1 - Math.pow(-2 * tOper + 2, 2) / 2;
      paket.position.set(a[0] + 0.6 + (b[0] - a[0]) * e, 1.3 + Math.sin(tOper * Math.PI) * 2.6, a[1] + (b[1] - a[1]) * e);
      paket.rotation.y = tOper * Math.PI * 2; jejak.position.set(paket.position.x, 0.25, paket.position.z);
      if (tOper >= 1) { tOper = -1; paket.visible = jejak.visible = false; aktif++; langkah = 0; catat(AGEN[aktif], AGEN[aktif].tugas[0]); setStatus(); setTimeout(maju, 1600); }
    }
    if (jamEl) jamEl.textContent = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    renderer.render(scene, cam); posLabel();
  }
  ukur(); addEventListener("resize", () => { ukur(); renderer.render(scene, cam); posLabel(); });
  renderer.render(scene, cam); posLabel();
  let mulai = false;
  new IntersectionObserver(([e]) => { hidup = e.isIntersecting; if (hidup && !mulai && !diam) { mulai = true; setTimeout(maju, 1200); } }, { threshold: 0.1 }).observe(wadah);
  if (diam) { aktif = 4; langkah = 1; selesai = 1; setStatus(); }
  loop();
})();
