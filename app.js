// Maliki Motion Studio: data prompt (data/prompt.js) → kartu seri, perpustakaan, panel detail; animasi GSAP.
const DATA = window.PROMPT || [];
const SERI = {
  umkm:    { nama: "Kelas AI UMKM",        kode: "kelas/umkm",    warna: "#f59e0b", isi: "Admin WA, stok, kasbon, nota, laporan. Buat warung & usaha kecil." },
  agentic: { nama: "Kelas Agentic AI",     kode: "kelas/agentic", warna: "#a855f7", isi: "Dari chatbot ke agent yang kerja sendiri: file, tim agent, jadwal." },
  "24jam": { nama: "Usaha Jalan 24 Jam",   kode: "kelas/24jam",   warna: "#10b981", isi: "Laptop ditutup, usaha tetap jalan: tugas terjadwal & bot chat." },
  kerja:   { nama: "Cari Kerja Pakai AI",  kode: "kelas/kerja",   warna: "#3b82f6", isi: "CV lolos ATS, latihan wawancara, asisten loker tiap pagi." },
  tutor:   { nama: "Tutor AI Praktis",     kode: "tutor",         warna: "#ef4444", isi: "Satu video satu alat jadi: kas warung, kalender, reels otomatis." },
  balas:   { nama: "Balas Komentar",       kode: "balas",         warna: "#94a3b8", isi: "Pertanyaan kalian di komentar, aku jawab jadi video." },
};
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const gerakOk = !matchMedia("(prefers-reduced-motion: reduce)").matches && window.gsap;
let lenis = null;
function geserKe(sel) { const el = $(sel); if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -70 }); else el.scrollIntoView({ behavior: gerakOk ? "smooth" : "auto" }); }

/* ---------- kartu seri ---------- */
const jumlahPer = DATA.reduce((a, p) => ((a[p.seri] = (a[p.seri] || 0) + 1), a), {});
const urutanSeri = Object.keys(SERI).filter((k) => jumlahPer[k]);
$("#kartu-seri").innerHTML = urutanSeri.map((k, i) => `
  <li><button class="seri-baris" type="button" data-seri="${k}" style="--w:${SERI[k].warna}">
    <span class="no" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
    <span class="isi"><span class="kode">./${SERI[k].kode}</span><span class="nama">${SERI[k].nama}</span><span class="ket">${SERI[k].isi}</span></span>
    <span class="hitung">${jumlahPer[k]} prompt <span aria-hidden="true">→</span></span>
  </button></li>`).join("");
$("#kartu-seri").addEventListener("click", (e) => {
  const b = e.target.closest("[data-seri]"); if (!b) return;
  pilihSeri(b.dataset.seri); geserKe("#perpustakaan");
});

/* ---------- perpustakaan ---------- */
let seriAktif = "semua", kataCari = "", semuaTampil = false;
$("#chip").innerHTML = [`<button type="button" data-seri="semua" aria-pressed="true" style="--w:var(--aksen)"><i aria-hidden="true"></i><span>semua</span><small>${DATA.length}</small></button>`]
  .concat(urutanSeri.map((k) => `<button type="button" data-seri="${k}" aria-pressed="false" style="--w:${SERI[k].warna}"><i aria-hidden="true"></i><span>${SERI[k].nama}</span><small>${jumlahPer[k]}</small></button>`)).join("");
$("#chip").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pilihSeri(b.dataset.seri); });
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (!$("#detail").hidden) return; geserKe("#perpustakaan"); setTimeout(() => $("#cari").focus({ preventScroll: true }), 350); }
  else if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && $("#detail").hidden) { e.preventDefault(); $("#cari").focus(); }
});
$("#cari").addEventListener("input", (e) => { kataCari = e.target.value.trim().toLowerCase(); tampilkan(); });

function pilihSeri(k) {
  seriAktif = k;
  document.querySelectorAll("#chip button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.seri === k)));
  $("#perintah-seri").textContent = k === "semua" ? "--semua" : `--seri ${SERI[k].kode.replace("kelas/", "")}`;
  tampilkan();
}
function tampilkan() {
  const hasil = DATA.filter((p) => (seriAktif === "semua" || p.seri === seriAktif) &&
    (!kataCari || (p.judul + " " + p.label + " " + p.prompt + " " + p.namaSeri).toLowerCase().includes(kataCari)));
  const batas = !semuaTampil && innerWidth < 861 && hasil.length > 8 ? 8 : hasil.length;
  $("#daftar-prompt").innerHTML = hasil.slice(0, batas).map((p) => `
    <li><button type="button" data-id="${p.id}" style="--w:${SERI[p.seri].warna}">
      <span class="tag">${esc(p.id)}</span>
      <span class="judul">${esc(p.judul)}<small>${esc(p.label)}</small></span>
      <span class="buka" aria-hidden="true">buka →</span>
      <span class="pratinjau" aria-hidden="true">${p.prompt.split("\n").filter((b) => b.trim()).slice(0, 2).map((b, i) => `<span><i>${i + 1}</i>${esc(b.slice(0, 90))}</span>`).join("")}</span>
    </button></li>`).join("") + (batas < hasil.length ? `<li class="b-lagi"><button type="button" data-lagi>Tampilkan ${hasil.length - batas} prompt lagi ↓</button></li>` : "");
  $("#kosong").hidden = hasil.length > 0;
  $("#jumlah").textContent = hasil.length;
  if (gerakOk && hasil.length) gsap.from("#daftar-prompt li", { opacity: 0, x: -12, duration: .35, stagger: .025, ease: "power2.out", overwrite: true });
}
$("#daftar-prompt").addEventListener("click", (e) => { if (e.target.closest("[data-lagi]")) { semuaTampil = true; const n = $("#daftar-prompt").children.length - 1; tampilkan(); $("#daftar-prompt").children[n]?.querySelector("button")?.focus(); return; } const b = e.target.closest("[data-id]"); if (b) location.hash = "p/" + b.dataset.id; });
tampilkan();

/* ---------- panel detail ---------- */
const CARA = {
  umkm:    ["Buka claude.ai (gratis cukup) dan mulai chat atau Project baru.", "Salin prompt di atas, ganti semua yang ditandai oranye dengan data usahamu.", "Tempel, kirim, lalu cek hasilnya. Yang ditandai [CEK] wajib kamu periksa sendiri."],
  agentic: ["Pakai Claude desktop (Cowork) supaya agent bisa membuka folder di laptopmu, dengan izinmu.", "Siapkan folder datanya dulu (nota, catatan WA, Excel).", "Salin prompt, ganti nama folder/usaha, jalankan. Setujui tiap langkah yang dia minta."],
  "24jam": ["Siapkan dulu alatnya seperti di video (tugas terjadwal Claude atau Make).", "Salin prompt, ganti nama folder, menu, dan jam sesuai usahamu.", "Uji sekali secara manual sebelum dibiarkan jalan sendiri."],
  kerja:   ["Siapkan CV (PDF/Word) dan 1 lowongan yang kamu incar.", "Buka claude.ai, lampirkan berkasnya, lalu tempel prompt.", "Isi CV tetap jujur: tambahkan hanya yang benar-benar pernah kamu kerjakan."],
  tutor:   ["Buka claude.ai dan mulai chat baru.", "Salin prompt, ganti bagian yang ditandai oranye.", "Kalau hasilnya berupa aplikasi/artifact, langsung coba dan minta revisi dengan bahasa biasa."],
  balas:   ["Salin teksnya, sesuaikan contoh dengan usahamu.", "Tempel di AI yang kamu pakai.", "Masih bingung? Balas di komentar video, nanti bisa jadi episode berikutnya."],
};
function warnai(teks, isi = []) { // nomori baris, sorot [placeholder] / {{PLACEHOLDER}} / <tag>
  return teks.split("\n").map((b) => {
    let h = esc(b)
      .replace(/\{\{[^}]+\}\}|\[[^\]\n]{2,40}\]/g, (m) => `<mark>${m}</mark>`)
      .replace(/&lt;\/?[a-z_]+&gt;/g, (m) => `<span class="tg">${m}</span>`);
    isi.forEach((v) => { const ev = esc(v); if (ev.length > 1) h = h.split(ev).join(`<ins>${ev}</ins>`); });
    return `<span class="b">${h || " "}</span>`;
  }).join("");
}
function placeholder(teks) {
  return [...new Set((teks.match(/\{\{[^}]+\}\}|\[[^\]\n]{2,40}\]/g) || []).filter((m) => !/^\[(CEK|CEK MANUAL)\]$/.test(m)))].slice(0, 12);
}
let fokusSebelum = null, isian = {};
function terisi(t) { for (const [k, v] of Object.entries(isian)) if (v) t = t.split(k).join(v); return t; }
$("#detail-ganti").addEventListener("input", (e) => {
  const inp = e.target.closest("input[data-ph]"); if (!inp) return;
  isian[inp.dataset.ph] = inp.value.trim();
  const p = DATA.find((x) => "#p/" + x.id === location.hash); if (!p) return;
  $("#detail-prompt").innerHTML = warnai(terisi(p.prompt), Object.values(isian).filter(Boolean));
  $("#salin").textContent = "Salin prompt"; $("#salin").classList.remove("ok");
});
function bukaDetail(id) {
  const p = DATA.find((x) => x.id === id); if (!p) return;
  const s = SERI[p.seri];
  const d = $("#detail");
  d.style.setProperty("--w", s.warna);
  $("#detail-seri").textContent = "./" + s.kode;
  $("#detail-judul").textContent = p.judul;
  $("#detail-label").textContent = "📌 " + p.label;
  $("#detail-file").textContent = p.id + ".txt";
  $("#detail-prompt").innerHTML = warnai(p.prompt);
  const ph = placeholder(p.prompt);
  $("#detail-ganti-blok").hidden = !ph.length;
  isian = {};
  $("#detail-ganti").innerHTML = ph.map((m, i) => `<li><label for="isi-${i}"><code>${esc(m)}</code></label><input id="isi-${i}" type="text" data-ph="${esc(m)}" placeholder="isi dengan datamu sendiri" autocomplete="off"></li>`).join("");
  $("#detail-cara").innerHTML = CARA[p.seri].map((c) => `<li>${esc(c)}</li>`).join("");
  const tentang = p.tentang || [];
  $("#detail-tentang-blok").hidden = !tentang.length && !p.halaman;
  $("#detail-tentang").innerHTML = tentang.map((t) => `<p>${esc(t)}</p>`).join("") +
    (p.halaman ? `<p><a class="tautan-garis" href="${p.halaman}">Buka halaman prompt versi lengkap ↗</a></p>` : "");
  $("#salin").textContent = "Salin prompt"; $("#salin").classList.remove("ok");
  fokusSebelum = document.activeElement;
  $("#lapis").hidden = false; d.hidden = false; d.scrollTop = 0;
  document.body.style.overflow = "hidden";
  if (gerakOk) {
    gsap.fromTo("#lapis", { opacity: 0 }, { opacity: 1, duration: .3 });
    gsap.fromTo(d, { xPercent: 100 }, { xPercent: 0, duration: .55, ease: "expo.out" });
    gsap.from("#detail .editor pre .b", { opacity: 0, x: 10, duration: .3, stagger: .015, delay: .2, ease: "power2.out" });
  }
  $("#tutup").focus();
}
function tutupDetail() {
  const d = $("#detail"); if (d.hidden) return;
  const selesai = () => { d.hidden = true; $("#lapis").hidden = true; document.body.style.overflow = ""; fokusSebelum?.focus?.(); };
  if (gerakOk) { gsap.to("#lapis", { opacity: 0, duration: .25 }); gsap.to(d, { xPercent: 100, duration: .35, ease: "power3.in", onComplete: selesai }); }
  else selesai();
}
function dariHash() {
  const m = location.hash.match(/^#p\/(.+)$/);
  if (m) bukaDetail(decodeURIComponent(m[1])); else tutupDetail();
}
addEventListener("hashchange", dariHash);
const keluar = () => { if (location.hash.startsWith("#p/")) history.pushState("", "", location.pathname + "#perpustakaan"); tutupDetail(); };
$("#tutup").addEventListener("click", keluar);
$("#lapis").addEventListener("click", keluar);
addEventListener("keydown", (e) => {
  if ($("#detail").hidden) return;
  if (e.key === "Escape") keluar();
  if (e.key === "Tab") { // jebak fokus di panel
    const f = [...$("#detail").querySelectorAll("button, a[href]")].filter((x) => x.offsetParent);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  }
});
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("tampil"); clearTimeout(toast.w); toast.w = setTimeout(() => el.classList.remove("tampil"), 1800); }
async function salinTeks(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch { const a = document.createElement("textarea"); a.value = t; document.body.append(a); a.select(); const ok = document.execCommand("copy"); a.remove(); return ok; }
}
$("#salin").addEventListener("click", async () => {
  const p = DATA.find((x) => "#p/" + x.id === location.hash); if (!p) return;
  if (await salinTeks(terisi(p.prompt))) { $("#salin").textContent = "Tersalin ✓"; $("#salin").classList.add("ok"); toast("Prompt tersalin. Tinggal tempel di Claude."); }
});
$("#bagikan").addEventListener("click", async () => {
  const url = location.href;
  if (navigator.share) { try { await navigator.share({ title: $("#detail-judul").textContent, url }); } catch {} }
  else if (await salinTeks(url)) toast("Link tersalin.");
});

/* ---------- angka ---------- */
document.querySelectorAll("[data-hitung]").forEach((el) => {
  const k = el.dataset.hitung;
  el.dataset.akhir = k === "prompt" ? DATA.length : k === "seri" ? urutanSeri.length : k === "kode" ? ((window.RINGKAS || {}).terbuka || el.textContent) : k;
  if (!gerakOk) el.textContent = el.dataset.akhir;
});

/* ---------- pintu: gambar template bergantian ---------- */
(() => {
  const img = document.querySelector("[data-pintu-gambar]"), g = ((window.RINGKAS || {}).gambar || []).map((x) => "kode/" + x);
  if (!img || !g.length) return; let i = 0; img.src = g[0];
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && g.length > 1)
    setInterval(() => { if (document.hidden) return; img.classList.add("ganti"); setTimeout(() => { i = (i + 1) % g.length; img.src = g[i]; img.onload = () => img.classList.remove("ganti"); }, 300); }, 2600);
})();

/* ---------- header ---------- */
addEventListener("scroll", () => $(".atas").classList.toggle("tergulir", scrollY > 20), { passive: true });

/* ---------- animasi ---------- */
function ketik(el) {
  const t = el.dataset.teks; let i = 0;
  if (!gerakOk) { el.textContent = t; return; }
  const jalan = () => { el.textContent = t.slice(0, ++i); if (i < t.length) setTimeout(jalan, 28); };
  setTimeout(jalan, 500);
}
ketik($(".ketik"));

/* judul bagian dipecah per kata (aria-label menjaga teks utuh untuk pembaca layar) */
document.querySelectorAll("[data-pecah]").forEach((h) => {
  h.setAttribute("aria-label", h.textContent.trim().replace(/\s+/g, " "));
  const pecah = (node, kelas) => node.textContent.trim().split(/\s+/).map((w) => `<span class="kp" aria-hidden="true"><span${kelas ? ` class="${kelas}"` : ""}>${esc(w)}</span></span>`).join(" ");
  h.innerHTML = [...h.childNodes].map((n) => n.nodeType === 3 ? (n.textContent.trim() ? pecah(n) : "") : pecah(n, n.className)).join(" ");
});

if (gerakOk && window.Lenis) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(2, -10 * t) });
  lenis.on("scroll", () => window.ScrollTrigger && ScrollTrigger.update());
  gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  new MutationObserver(() => ($("#detail").hidden ? lenis.start() : lenis.stop())).observe($("#detail"), { attributes: true, attributeFilter: ["hidden"] });
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const h = a.getAttribute("href"); if (h.length < 2 || h.startsWith("#p/")) { if (h === "#") { e.preventDefault(); lenis.scrollTo(0); } return; }
    if ($(h)) { e.preventDefault(); geserKe(h); history.replaceState(null, "", h); }
  }));
}
if (gerakOk && matchMedia("(pointer: fine)").matches) {
  // tombol magnet
  document.querySelectorAll(".magnet").forEach((b) => {
    b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: "power3.out" }); });
    b.addEventListener("pointerleave", () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: "elastic.out(1, .4)" }));
  });
  // kursor bercahaya
  const k = $(".b-kursor"); k.classList.add("aktif");
  const kx = gsap.quickTo(k, "x", { duration: .6, ease: "power3" }), ky = gsap.quickTo(k, "y", { duration: .6, ease: "power3" });
  addEventListener("pointermove", (e) => { kx(e.clientX); ky(e.clientY); }, { passive: true });
}

/* latar hero: hujan kode prompt ala terminal (ciri khas beranda, beda dari /kode) */
(() => {
  const cv = $("#b-langit"); if (!cv) return;
  const ctx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 1.5);
  const BARIS = [
    "peran: kamu adalah asisten admin UMKM", "tugas: rapikan pesanan WA jadi tabel", "konteks: toko kue, 30 pesanan/hari",
    "format: tabel | nama | menu | total", "batasan: jangan ubah nominal", "/laporan --mingguan", "skill: ubah-kasir-umkm",
    "[CEK] stok minimum < 5", "excel: =SUMIF(B:B;\"lunas\";C:C)", "agent.jalankan(\"balas_komentar\")", "caption: hook 1 kalimat + CTA",
    "jadwal: 07.00 kirim rekap ke WA", "prompt.isi({nama_toko})", "peran: guru ngaji yang sabar", "konteks: {{DATA_WARGA}}",
    "> claude --skill kas-warung", "tugas: cari lowongan sesuai CV", "format: poin singkat, bahasa santai",
  ];
  let W = 0, H = 0, kolom = [], jalan = true, mx = 0, my = 0, ukuranHuruf = 13;
  function ukur() {
    const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ukuranHuruf = W < 700 ? 11 : 13;
    const lebarKol = W < 700 ? 190 : 260, n = Math.max(2, Math.floor(W / lebarKol));
    kolom = Array.from({ length: n }, (_, i) => ({
      x: i * (W / n) + 12 + Math.random() * 30, y: Math.random() * H, v: .18 + Math.random() * .35, z: .35 + Math.random() * .65,
      teks: BARIS[(Math.random() * BARIS.length) | 0], ketik: 0, jeda: Math.random() * 120,
    }));
  }
  function gambar() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = `${ukuranHuruf}px "JetBrains Mono", ui-monospace, monospace`;
    const tinggiBaris = ukuranHuruf * 1.9;
    for (const k of kolom) {
      if (gerakOk) { k.y += k.v; if (k.jeda > 0) k.jeda--; else if (k.ketik < k.teks.length) k.ketik += .45; }
      if (k.y > H + 40) { k.y = -tinggiBaris * 6; k.teks = BARIS[(Math.random() * BARIS.length) | 0]; k.ketik = 0; k.jeda = 30 + Math.random() * 90; }
      const ox = -mx * 18 * k.z, oy = -my * 12 * k.z;
      // 5 baris "jejak" redup di atas baris yang sedang diketik
      for (let i = 5; i >= 1; i--) {
        const y = k.y - i * tinggiBaris + oy; if (y < -20 || y > H) continue;
        const t = BARIS[(BARIS.indexOf(k.teks) + i * 3) % BARIS.length];
        ctx.globalAlpha = (.09 + .05 * (5 - i)) * k.z * pudar(y);
        ctx.fillStyle = "#8590aa"; ctx.fillText(t, k.x + ox, y);
      }
      const y = k.y + oy, tampil = k.teks.slice(0, Math.floor(gerakOk ? k.ketik : k.teks.length));
      const titik = tampil.indexOf(":");
      ctx.globalAlpha = .75 * k.z * pudar(y);
      if (titik > 0) {
        ctx.fillStyle = "#22d3ee"; ctx.fillText(tampil.slice(0, titik + 1), k.x + ox, y);
        ctx.fillStyle = "#cbd5e1"; ctx.fillText(tampil.slice(titik + 1), k.x + ox + ctx.measureText(tampil.slice(0, titik + 1)).width, y);
      } else { ctx.fillStyle = "#cbd5e1"; ctx.fillText(tampil, k.x + ox, y); }
      if (gerakOk && Math.floor(performance.now() / 500) % 2 === 0) {
        ctx.fillStyle = "#22d3ee"; ctx.globalAlpha = .7 * k.z * pudar(y);
        ctx.fillRect(k.x + ox + ctx.measureText(tampil).width + 3, y - ukuranHuruf + 2, ukuranHuruf * .55, ukuranHuruf);
      }
    }
    ctx.globalAlpha = 1;
    if (gerakOk && jalan) requestAnimationFrame(gambar);
  }
  const pudar = (y) => Math.max(0, Math.min(1, y / 80, (H - y) / 160));
  ukur(); let lebarLama = innerWidth; addEventListener("resize", () => { if (innerWidth !== lebarLama) { lebarLama = innerWidth; ukur(); } });
  if (document.fonts) document.fonts.ready.then(() => requestAnimationFrame(gambar));
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  if ("IntersectionObserver" in window && gerakOk) new IntersectionObserver(([en]) => { const lama = jalan; jalan = en.isIntersecting; if (jalan && !lama) requestAnimationFrame(gambar); }).observe(cv);
  requestAnimationFrame(gambar);
})();

if (gerakOk) {
  gsap.registerPlugin(ScrollTrigger);

  // hero: kata naik dari bawah garis
  $(".judul-besar").classList.add("klip");
  gsap.from(".judul-besar .kata", { yPercent: 110, rotate: 4, duration: 1, ease: "expo.out", stagger: .06, delay: .15, onComplete: () => $(".judul-besar").classList.remove("klip") });
  gsap.from(".b-hero .sub, .b-hero .aksi", { opacity: 0, y: 24, duration: .9, ease: "power3.out", stagger: .12, delay: .8 });

  // kata melayang: posisi acak, mengapung, dan menjauh dari kursor
  const melayang = [...document.querySelectorAll(".kata-melayang span")];
  const posisi = [[8,22],[78,18],[88,46],[4,62],[70,72],[30,84],[58,10],[20,40],[92,82],[46,90],[64,34],[12,88]];
  melayang.forEach((el, i) => {
    const [x, y] = posisi[i % posisi.length];
    gsap.set(el, { left: x + "%", top: y + "%" });
    gsap.to(el, { opacity: .9, duration: 1.2, delay: 1 + i * .08 });
    gsap.to(el, { y: "random(-24, 24)", x: "random(-18, 18)", duration: "random(3, 6)", repeat: -1, yoyo: true, ease: "sine.inOut" });
  });
  $(".b-hero").addEventListener("pointermove", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - .5, my = (e.clientY - r.top) / r.height - .5;
    gsap.to(".kata-melayang", { x: mx * -40, y: my * -30, duration: 1, ease: "power3.out" });
  });
  gsap.to(".b-hero-teks", { y: -60, ease: "none", scrollTrigger: { trigger: ".b-hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".b-potret-bingkai img", { yPercent: 8, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".b-hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.from(".b-potret", { opacity: 0, duration: 1.4, ease: "power2.out", delay: .3 });
  gsap.from(".b-potret-warna", { opacity: 0, duration: 2, ease: "power2.out", delay: .6 });

  // pernyataan: huruf teracak lalu terbuka saat digulir
  const dek = $(".dekripsi"), asli = dek.dataset.teks, ACAK = "!<>-_\\/[]{}=+*^?#01";
  dek.textContent = "";
  const huruf = [...asli].map((c) => { const s = document.createElement("span"); s.className = "h"; s.dataset.c = c; s.textContent = c === " " ? " " : ACAK[Math.random() * ACAK.length | 0]; if (c !== " ") s.classList.add("acak"); dek.append(s); return s; });
  const persen = $(".status-dekripsi b");
  ScrollTrigger.create({
    trigger: ".pernyataan", start: "top 70%", end: "center 45%", scrub: true,
    onUpdate: (st) => {
      const n = Math.round(st.progress * huruf.length);
      huruf.forEach((s, i) => {
        if (s.dataset.c === " ") return;
        if (i < n) { s.textContent = s.dataset.c; s.classList.remove("acak"); }
        else { s.classList.add("acak"); if (Math.random() < .3) s.textContent = ACAK[Math.random() * ACAK.length | 0]; }
      });
      persen.textContent = Math.round(st.progress * 100) + "%";
    },
  });

  // angka hitung naik
  document.querySelectorAll("[data-hitung]").forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.akhir, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => (el.textContent = Math.round(o.v)) });
  });

  // judul bagian & kartu
  document.querySelectorAll(".judul-bagian:not([data-pecah])").forEach((h) => gsap.from(h, { opacity: 0, y: 50, duration: 1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } }));
  document.querySelectorAll("[data-pecah]").forEach((h) => gsap.from(h.querySelectorAll(".kp > span"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: h, start: "top 85%" } }));
  document.querySelectorAll(".eyebrow").forEach((h) => gsap.from(h, { opacity: 0, x: -16, duration: .6, scrollTrigger: { trigger: h, start: "top 90%" } }));
  gsap.from(".seri-baris", { opacity: 0, y: 40, duration: .9, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: "#kartu-seri", start: "top 82%" } });
  gsap.from(".terminal", { opacity: 0, y: 80, scale: .96, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".terminal", start: "top 85%" } });
  gsap.from(".karya", { opacity: 0, y: 50, duration: .9, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".galeri", start: "top 85%" } });
  gsap.from(".b-bento .b-sel", { opacity: 0, y: 40, duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".b-bento", start: "top 82%" } });
  gsap.from(".daftar-tautan a", { opacity: 0, y: 20, duration: .5, stagger: .04, scrollTrigger: { trigger: ".daftar-tautan", start: "top 90%" } });

  // langkah: garis oranye terisi berurutan
  document.querySelectorAll(".langkah li").forEach((li, i) => {
    gsap.fromTo(li, { "--isi": "0%" }, { "--isi": "100%", duration: .8, delay: i * .25, ease: "power2.inOut", scrollTrigger: { trigger: ".langkah", start: "top 80%" } });
    gsap.from(li.children, { opacity: 0, y: 20, duration: .6, delay: i * .25 + .2, stagger: .06, scrollTrigger: { trigger: ".langkah", start: "top 80%" } });
  });
  gsap.from(".ajakan-besar", { opacity: 0, y: 60, scale: .95, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".kaki", start: "top bottom-=40", once: true } });

  // kartu seri ikut miring mengikuti kursor
  document.querySelectorAll(".karya").forEach((k) => {
    k.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = k.getBoundingClientRect();
      gsap.to(k, { rotateY: ((e.clientX - r.left) / r.width - .5) * 8, rotateX: -((e.clientY - r.top) / r.height - .5) * 8, transformPerspective: 800, duration: .4 });
    });
    k.addEventListener("pointerleave", () => gsap.to(k, { rotateX: 0, rotateY: 0, duration: .6, ease: "power3.out" }));
  });
} else {
  $(".status-dekripsi b").textContent = "100%";
}
dariHash();
