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

/* ---------- kartu seri ---------- */
const jumlahPer = DATA.reduce((a, p) => ((a[p.seri] = (a[p.seri] || 0) + 1), a), {});
const urutanSeri = Object.keys(SERI).filter((k) => jumlahPer[k]);
$("#kartu-seri").innerHTML = urutanSeri.map((k) => `
  <button class="seri-kartu" type="button" data-seri="${k}" style="--w:${SERI[k].warna}">
    <span class="kode">./${SERI[k].kode}</span>
    <h3>${SERI[k].nama}</h3>
    <p>${SERI[k].isi}</p>
    <span class="hitung"><span>${jumlahPer[k]} prompt</span><span aria-hidden="true">→</span></span>
  </button>`).join("");
$("#kartu-seri").addEventListener("click", (e) => {
  const b = e.target.closest("[data-seri]"); if (!b) return;
  pilihSeri(b.dataset.seri); $("#perpustakaan").scrollIntoView({ behavior: gerakOk ? "smooth" : "auto" });
});

/* ---------- perpustakaan ---------- */
let seriAktif = "semua", kataCari = "";
$("#chip").innerHTML = [`<button type="button" data-seri="semua" aria-pressed="true">semua</button>`]
  .concat(urutanSeri.map((k) => `<button type="button" data-seri="${k}" aria-pressed="false">${SERI[k].kode.replace("kelas/", "")}</button>`)).join("");
$("#chip").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pilihSeri(b.dataset.seri); });
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
  $("#daftar-prompt").innerHTML = hasil.map((p) => `
    <li><button type="button" data-id="${p.id}" style="--w:${SERI[p.seri].warna}">
      <span class="tag">${esc(p.id)}</span>
      <span class="judul">${esc(p.judul)}<small>${esc(p.label)}</small></span>
      <span class="buka" aria-hidden="true">buka →</span>
    </button></li>`).join("");
  $("#kosong").hidden = hasil.length > 0;
  $("#jumlah").textContent = hasil.length;
  if (gerakOk) gsap.from("#daftar-prompt li", { opacity: 0, x: -12, duration: .35, stagger: .025, ease: "power2.out", overwrite: true });
}
$("#daftar-prompt").addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) location.hash = "p/" + b.dataset.id; });
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
function warnai(teks) { // nomori baris, sorot [placeholder] / {{PLACEHOLDER}} / <tag>
  return teks.split("\n").map((b) => {
    let h = esc(b)
      .replace(/\{\{[^}]+\}\}|\[[^\]\n]{2,40}\]/g, (m) => `<mark>${m}</mark>`)
      .replace(/&lt;\/?[a-z_]+&gt;/g, (m) => `<span class="tg">${m}</span>`);
    return `<span class="b">${h || " "}</span>`;
  }).join("");
}
function placeholder(teks) {
  return [...new Set((teks.match(/\{\{[^}]+\}\}|\[[^\]\n]{2,40}\]/g) || []).filter((m) => !/^\[(CEK|CEK MANUAL)\]$/.test(m)))].slice(0, 12);
}
let fokusSebelum = null;
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
  $("#detail-ganti").innerHTML = ph.map((m) => `<li><code>${esc(m)}</code> → isi dengan datamu sendiri</li>`).join("");
  $("#detail-cara").innerHTML = CARA[p.seri].map((c) => `<li>${esc(c)}</li>`).join("");
  $("#detail-tentang-blok").hidden = !p.tentang.length && !p.halaman;
  $("#detail-tentang").innerHTML = p.tentang.map((t) => `<p>${esc(t)}</p>`).join("") +
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
  if (await salinTeks(p.prompt)) { $("#salin").textContent = "Tersalin ✓"; $("#salin").classList.add("ok"); toast("Prompt tersalin. Tinggal tempel di Claude."); }
});
$("#bagikan").addEventListener("click", async () => {
  const url = location.href;
  if (navigator.share) { try { await navigator.share({ title: $("#detail-judul").textContent, url }); } catch {} }
  else if (await salinTeks(url)) toast("Link tersalin.");
});

/* ---------- angka ---------- */
document.querySelectorAll("[data-hitung]").forEach((el) => {
  const k = el.dataset.hitung;
  el.dataset.akhir = k === "prompt" ? DATA.length : k === "seri" ? urutanSeri.length : k;
  if (!gerakOk) el.textContent = el.dataset.akhir;
});

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

if (gerakOk) {
  gsap.registerPlugin(ScrollTrigger);

  // hero: kata naik dari bawah garis
  $(".judul-besar").classList.add("klip");
  gsap.from(".judul-besar .kata", { yPercent: 110, rotate: 4, duration: 1, ease: "expo.out", stagger: .06, delay: .15, onComplete: () => $(".judul-besar").classList.remove("klip") });
  gsap.from(".hero .sub, .hero .aksi", { opacity: 0, y: 24, duration: .9, ease: "power3.out", stagger: .12, delay: .8 });

  // kata melayang: posisi acak, mengapung, dan menjauh dari kursor
  const melayang = [...document.querySelectorAll(".kata-melayang span")];
  const posisi = [[8,22],[78,18],[88,46],[4,62],[70,72],[30,84],[58,10],[20,40],[92,82],[46,90],[64,34],[12,88]];
  melayang.forEach((el, i) => {
    const [x, y] = posisi[i % posisi.length];
    gsap.set(el, { left: x + "%", top: y + "%" });
    gsap.to(el, { opacity: .9, duration: 1.2, delay: 1 + i * .08 });
    gsap.to(el, { y: "random(-24, 24)", x: "random(-18, 18)", duration: "random(3, 6)", repeat: -1, yoyo: true, ease: "sine.inOut" });
  });
  $(".hero").addEventListener("pointermove", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - .5, my = (e.clientY - r.top) / r.height - .5;
    gsap.to(".kata-melayang", { x: mx * -40, y: my * -30, duration: 1, ease: "power3.out" });
  });
  gsap.to(".hero-isi", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

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
    gsap.to(o, { v: +el.dataset.akhir, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".angka", start: "top 80%" }, onUpdate: () => (el.textContent = Math.round(o.v)) });
  });
  gsap.from(".angka .sel", { opacity: 0, y: 30, duration: .7, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".angka", start: "top 85%" } });

  // judul bagian & kartu
  document.querySelectorAll(".judul-bagian").forEach((h) => gsap.from(h, { opacity: 0, y: 50, duration: 1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } }));
  document.querySelectorAll(".eyebrow").forEach((h) => gsap.from(h, { opacity: 0, x: -16, duration: .6, scrollTrigger: { trigger: h, start: "top 90%" } }));
  gsap.from(".seri-kartu", { opacity: 0, y: 60, rotateX: -12, transformOrigin: "top", duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: "#kartu-seri", start: "top 80%" } });
  gsap.from(".terminal", { opacity: 0, y: 80, scale: .96, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".terminal", start: "top 85%" } });
  gsap.from(".karya", { opacity: 0, y: 50, duration: .9, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".galeri", start: "top 85%" } });
  gsap.from(".tentang img", { opacity: 0, scale: .8, rotate: -6, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: ".tentang", start: "top 80%" } });
  gsap.from(".daftar-tautan a", { opacity: 0, y: 20, duration: .5, stagger: .04, scrollTrigger: { trigger: ".daftar-tautan", start: "top 90%" } });

  // langkah: garis oranye terisi berurutan
  document.querySelectorAll(".langkah li").forEach((li, i) => {
    gsap.fromTo(li, { "--isi": "0%" }, { "--isi": "100%", duration: .8, delay: i * .25, ease: "power2.inOut", scrollTrigger: { trigger: ".langkah", start: "top 80%" } });
    gsap.from(li.children, { opacity: 0, y: 20, duration: .6, delay: i * .25 + .2, stagger: .06, scrollTrigger: { trigger: ".langkah", start: "top 80%" } });
  });
  gsap.from(".ajakan-besar", { opacity: 0, y: 60, scale: .95, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".kaki", start: "top 85%" } });

  // kartu seri ikut miring mengikuti kursor
  document.querySelectorAll(".seri-kartu, .karya").forEach((k) => {
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
