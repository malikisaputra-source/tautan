/* Studio kustom (gaya konfigurator): pratinjau langsung di kiri, tab Warna/Bentuk/Teks di kanan,
   tap bagian di pratinjau untuk memilih warnanya, unduh ZIP dengan tema tertanam.
   Kontrak paket: kode/TEMA.md (tema.css, tema.js, postMessage tema/sorot/mode-pilih/bagian-dipilih). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const kurang = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FONT = ["Plus Jakarta Sans", "Inter", "Poppins", "DM Sans", "Space Grotesk", "Nunito"];
  const BAGIAN = [
    { id: "utama", nama: "Tombol & sorotan" },
    { id: "aksen", nama: "Aksen & badge" },
    { id: "nav", nama: "Menu / sidebar" },
    { id: "latar", nama: "Latar halaman" },
    { id: "panel", nama: "Kartu & panel" },
    { id: "teks", nama: "Teks utama" },
  ];
  const SWATCH = {
    utama: ["#0f766e", "#2563eb", "#7c3aed", "#dc2626", "#15803d", "#db2777", "#92400e", "#1f2937"],
    aksen: ["#f59e0b", "#f97316", "#06b6d4", "#facc15", "#10b981", "#8b5cf6", "#ef4444", "#0d9488"],
    nav: ["#0f172a", "#1e293b", "#111827", "#ffffff", "#f8fafc", "#0b3b36", "#1e1b4b", "#3f1d0b"],
    latar: ["#f6f7f9", "#ffffff", "#fafaf7", "#fdf6ec", "#eef6f4", "#0b0f17", "#111827", "#18181b"],
    panel: ["#ffffff", "#f8fafc", "#fffdf8", "#f1f5f9", "#1e293b", "#1f2937", "#27272a", "#0f172a"],
    teks: ["#0f172a", "#1f2937", "#334155", "#3f3f46", "#f8fafc", "#e5e7eb", "#fafaf9", "#e2e8f0"],
  };
  const PRESET = [
    { nama: "Teal", utama: "#0f766e", aksen: "#f59e0b" }, { nama: "Biru", utama: "#2563eb", aksen: "#f97316" },
    { nama: "Ungu", utama: "#7c3aed", aksen: "#06b6d4" }, { nama: "Merah", utama: "#dc2626", aksen: "#facc15" },
    { nama: "Hijau", utama: "#15803d", aksen: "#eab308" }, { nama: "Arang", utama: "#1f2937", aksen: "#10b981" },
    { nama: "Pink", utama: "#db2777", aksen: "#8b5cf6" }, { nama: "Cokelat", utama: "#92400e", aksen: "#0d9488" },
  ];
  const studio = $("#k-studio"), frame = $("#ks-frame");
  let paket = null, bawaan = null, tema = null, siap = false, asal = null, aktif = "utama", pilihMode = false, lihatBagian = false;

  // ---------- baca/tulis berkas tema ----------
  const ambil = async (u) => { const r = await fetch(u, { cache: "no-cache" }); if (!r.ok) throw new Error(u); return r.text(); };
  function bacaCss(css) {
    const v = (n) => ((css.match(new RegExp(`--tema-${n}\\s*:\\s*([^;]+);`)) || [])[1] || "").trim();
    return {
      utama: v("utama") || "#0f766e", aksen: v("aksen") || "#f59e0b", radius: parseInt(v("radius"), 10) || 0,
      font: (v("font") || "Plus Jakarta Sans").split(",")[0].replace(/["']/g, "").trim(),
      bagian: { latar: hex(v("latar")), panel: hex(v("panel")), nav: hex(v("nav")), teks: hex(v("teks")) },
    };
  }
  const hex = (x) => (/^#[0-9a-f]{6}$/i.test(x) ? x.toLowerCase() : null);
  function bacaJs(js) {
    return { nama: (js.match(/nama\s*:\s*["'`]([^"'`]*)["'`]/) || [])[1] || "Nama Usaha", mode: (js.match(/mode\s*:\s*["'`](terang|gelap|auto)["'`]/) || [])[1] || "terang" };
  }
  function tulisCss(t) {
    const b = t.bagian, baris = (n, k) => (b[n] ? `\n  --tema-${n}: ${b[n]};   /* ${k} */` : "");
    return `/* TEMA — diubah otomatis oleh customizer Maliki Studio (malikisaputra.biz.id/kode) */
:root {
  --tema-utama: ${t.utama};    /* warna brand utama (tombol, tautan, sorotan) */
  --tema-aksen: ${t.aksen};    /* warna aksen kedua (badge, grafik, highlight) */
  --tema-radius: ${t.radius}px;      /* sudut kartu/tombol */
  --tema-font: "${t.font}", system-ui, sans-serif;${baris("latar", "latar halaman")}${baris("panel", "kartu/panel/form")}${baris("nav", "sidebar/header/nav bawah")}${baris("teks", "teks utama")}
}
`;
  }
  const tulisJs = (t) => `/* TEMA — diubah otomatis oleh customizer Maliki Studio */
window.TEMA = { nama: ${JSON.stringify(t.nama)}, mode: "${t.mode}" }; // mode: "terang" | "gelap" | "auto"
`;

  // ---------- warna ----------
  function lum(h) {
    const n = parseInt(h.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map((x) => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; });
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  }
  const rasio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const nilai = (id) => (id === "utama" || id === "aksen" ? tema[id] : tema.bagian[id] || terbaca[id] || null);
  let terbaca = {}; // warna bagian yang sedang tampil di pratinjau (untuk titik warna bila belum diubah)
  function bacaDariFrame() {
    try {
      const cs = getComputedStyle(frame.contentDocument.documentElement);
      ["latar", "panel", "nav", "teks"].forEach((n) => { const v = rgbKeHex(cs.getPropertyValue(`--tema-${n}`).trim()); if (v) terbaca[n] = v; });
    } catch (_) {}
  }
  function rgbKeHex(v) {
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(v)) return "#" + v.slice(1).split("").map((c) => c + c).join("").toLowerCase();
    const m = v.match(/rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)/); if (!m) return null;
    return "#" + m.slice(1, 4).map((x) => (+x).toString(16).padStart(2, "0")).join("");
  }

  // ---------- kirim ke pratinjau ----------
  const pesan = (d) => { try { frame.contentWindow && frame.contentWindow.postMessage(d, "*"); } catch (_) {} };
  let raf = 0;
  function kirim() {
    if (!siap) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      pesan({ tipe: "tema", utama: tema.utama, aksen: tema.aksen, radius: tema.radius + "px", font: tema.font, mode: tema.mode, nama: tema.nama, bagian: { ...tema.bagian } });
      setTimeout(() => { bacaDariFrame(); segarkanDaftar(); }, 420);
    });
  }

  // ---------- UI ----------
  function segarkanDaftar() {
    $("#ks-daftar").innerHTML = "";
    BAGIAN.forEach((b) => {
      const v = nilai(b.id), li = document.createElement("li"), btn = document.createElement("button");
      btn.type = "button"; btn.className = "ks-item"; btn.setAttribute("aria-pressed", String(b.id === aktif));
      btn.innerHTML = `<i style="--c:${v || "transparent"}"></i><span>${b.nama}</span><code>${v ? v.toUpperCase() : "bawaan"}</code><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c3 0 5.6-2.5 5.6-5.6C23 5.4 18 2 12 2z"/></svg>`;
      btn.addEventListener("click", () => pilihBagian(b.id));
      btn.addEventListener("mouseenter", () => lihatBagian || pesan({ tipe: "sorot", bagian: b.id }));
      btn.addEventListener("mouseleave", () => lihatBagian || pesan({ tipe: "sorot", bagian: null }));
      li.append(btn); $("#ks-daftar").append(li);
    });
    $("#ks-bagian").value = aktif;
    const v = nilai(aktif) || "#888888";
    $("#ks-warna-in").value = v; $("#ks-warna-k").textContent = v.toUpperCase();
    $$(".ks-sw1").forEach((s) => s.setAttribute("aria-pressed", String(s.dataset.c === v)));
    const r = rasio(tema.utama, "#ffffff");
    $("#ks-kontras").textContent = aktif === "utama" && r < 3 ? `Kurang kontras dengan teks putih (${r.toFixed(1)}:1). Tombol tetap dibuat terbaca, tapi warna lebih gelap lebih aman.` : "";
  }
  function segarkanSwatch() {
    const w = $("#ks-swatch"); w.innerHTML = "";
    SWATCH[aktif].forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ks-sw1"; b.dataset.c = c; b.style.setProperty("--c", c);
      b.setAttribute("aria-label", `${BAGIAN.find((x) => x.id === aktif).nama}: ${c}`);
      b.addEventListener("click", () => setWarna(c));
      w.append(b);
    });
    if (!kurang && window.gsap) gsap.from(w.children, { scale: .6, opacity: 0, duration: .3, stagger: .025, ease: "back.out(2)" });
  }
  function segarkanUI() {
    $("#ks-nama").value = tema.nama;
    $$('input[name="ks-mode"]').forEach((r) => (r.checked = r.value === tema.mode));
    $$(".ks-f").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.f === tema.font)));
    $("#ks-radius").value = tema.radius; $("#ks-radius-o").textContent = tema.radius + "px";
    $(".ks-sudut").style.setProperty("--r", tema.radius + "px");
    $$(".ks-sw").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.u === tema.utama && b.dataset.a === tema.aksen)));
    studio.style.setProperty("--ks-utama", tema.utama); studio.style.setProperty("--ks-aksen", tema.aksen);
    segarkanDaftar();
  }
  function pilihBagian(id) {
    if (aktif === id) { segarkanDaftar(); return; }
    aktif = id; segarkanSwatch(); segarkanDaftar();
    pesan({ tipe: "sorot", bagian: id }); clearTimeout(pilihBagian.t);
    if (!lihatBagian) pilihBagian.t = setTimeout(() => pesan({ tipe: "sorot", bagian: null }), 1200);
  }
  function setWarna(c) {
    if (aktif === "utama" || aktif === "aksen") tema[aktif] = c; else tema.bagian = { ...tema.bagian, [aktif]: c };
    ubah({});
  }
  let tSimpan = 0;
  function ubah(p) {
    tema = { ...tema, ...p }; segarkanUI(); kirim();
    const s = $("#ks-simpan"); s.textContent = "Menyimpan…"; clearTimeout(tSimpan);
    tSimpan = setTimeout(() => { try { localStorage.setItem("ks-" + paket.slug, JSON.stringify(tema)); } catch (_) {} s.textContent = "Tersimpan otomatis"; }, 400);
  }

  // ---------- bangun kontrol sekali ----------
  BAGIAN.forEach((b) => { const o = document.createElement("option"); o.value = b.id; o.textContent = b.nama; $("#ks-bagian").append(o); });
  $("#ks-jml").textContent = `${BAGIAN.length} bagian`;
  $("#ks-bagian").addEventListener("change", (e) => pilihBagian(e.target.value));
  $("#ks-warna-in").addEventListener("input", (e) => setWarna(e.target.value));
  PRESET.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "ks-sw"; b.dataset.u = p.utama; b.dataset.a = p.aksen;
    b.style.setProperty("--u", p.utama); b.style.setProperty("--a", p.aksen);
    b.setAttribute("aria-label", `Tema ${p.nama}`); b.title = p.nama;
    b.addEventListener("click", () => ubah({ utama: p.utama, aksen: p.aksen }));
    $("#ks-preset").append(b);
  });
  FONT.forEach((f) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "ks-f"; b.dataset.f = f; b.setAttribute("role", "radio");
    b.innerHTML = `<span style="font-family:'${f}',system-ui">Aa</span><small>${f}</small>`;
    b.addEventListener("click", () => ubah({ font: f }));
    $("#ks-font").append(b);
  });
  // muat font pilihan untuk kartu pratinjau huruf
  const lf = document.createElement("link"); lf.rel = "stylesheet";
  lf.href = "https://fonts.googleapis.com/css2?" + FONT.map((f) => "family=" + f.replace(/ /g, "+") + ":wght@600").join("&") + "&display=swap&text=Aa";
  document.head.append(lf);
  $("#ks-nama").addEventListener("input", (e) => ubah({ nama: e.target.value || "Nama Usaha" }));
  $$('input[name="ks-mode"]').forEach((r) => r.addEventListener("change", () => { terbaca = {}; ubah({ mode: r.value }); }));
  $("#ks-radius").addEventListener("input", (e) => ubah({ radius: +e.target.value }));
  $("#ks-reset").addEventListener("click", () => { terbaca = {}; ubah(JSON.parse(JSON.stringify(bawaan))); });

  // tab
  const tabs = $$(".ks-tab [role=tab]");
  function bukaTab(t) {
    tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; $("#" + x.getAttribute("aria-controls")).hidden = !on; });
    const p = $("#" + t.getAttribute("aria-controls"));
    if (!kurang && window.gsap) gsap.fromTo(p.children, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .3, stagger: .03, ease: "power2.out" });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => bukaTab(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); bukaTab(n); }
    });
  });
  // alat & lihat bagian & tap
  $$(".ks-alat-b").forEach((b) => b.addEventListener("click", () => {
    $$(".ks-alat-b").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#ks-panggung").dataset.alat = b.dataset.alat;
  }));
  $$("[data-lihat]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-lihat]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    lihatBagian = b.dataset.lihat === "bagian";
    pesan({ tipe: "sorot", bagian: lihatBagian ? aktif : null });
  }));
  function setPilih(on) {
    pilihMode = on; $("#ks-tap").setAttribute("aria-pressed", String(on));
    $("#ks-tap").textContent = on ? "Mode pilih aktif · tap bagian" : "Tap bagian untuk pilih warna";
    pesan({ tipe: "mode-pilih", aktif: on });
  }
  $("#ks-tap").addEventListener("click", () => setPilih(!pilihMode));
  window.addEventListener("message", (e) => {
    if (e.source !== frame.contentWindow || !e.data || e.data.tipe !== "bagian-dipilih") return;
    if (!BAGIAN.some((b) => b.id === e.data.bagian)) return;
    bukaTab($("#t-warna")); pilihBagian(e.data.bagian);
    const it = $(`.ks-item[aria-pressed="true"]`); if (it && !kurang && window.gsap) gsap.fromTo(it, { scale: .96 }, { scale: 1, duration: .4, ease: "back.out(3)" });
  });
  frame.addEventListener("load", () => {
    if (frame.src === "about:blank" || !paket) return;
    siap = true; kirim(); if (pilihMode) pesan({ tipe: "mode-pilih", aktif: true });
    setTimeout(() => $("#ks-muat").classList.add("hilang"), kurang ? 0 : 250);
  });

  // ---------- buka / tutup ----------
  window.bukaStudio = async (d) => {
    paket = d; asal = document.activeElement; siap = false; terbaca = {}; aktif = "utama";
    $("#ks-judul").textContent = d.judul;
    $("#ks-url").textContent = `${d.slug}/${(d.pratinjau || "index.html").split("?")[0]}`;
    $("#ks-status").textContent = ""; $("#ks-muat").classList.remove("hilang");
    try {
      const [css, js] = await Promise.all([ambil(d.dasar + "tema.css"), ambil(d.dasar + "tema.js")]);
      bawaan = { ...bacaCss(css), ...bacaJs(js) };
    } catch (_) { bawaan = { utama: "#0f766e", aksen: "#f59e0b", radius: 12, font: "Plus Jakarta Sans", nama: "Nama Usaha", mode: "terang", bagian: {} }; }
    let tersimpan = null; try { tersimpan = JSON.parse(localStorage.getItem("ks-" + d.slug)); } catch (_) {}
    tema = tersimpan ? { ...bawaan, ...tersimpan, bagian: { ...bawaan.bagian, ...(tersimpan.bagian || {}) } } : JSON.parse(JSON.stringify(bawaan));
    segarkanSwatch(); segarkanUI(); bukaTab($("#t-warna")); setPilih(false);
    const pr = d.pratinjau || "index.html";
    frame.src = d.dasar + pr + (pr.includes("?") ? "&" : "?") + "pratinjau=1";
    studio.hidden = false; document.body.style.overflow = "hidden";
    if (window.gsap && !kurang) {
      gsap.fromTo(studio, { opacity: 0 }, { opacity: 1, duration: .25 });
      gsap.fromTo(".ks-bingkai", { y: 30, scale: .97, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .6, ease: "power3.out", delay: .05 });
      gsap.fromTo(".ks-kontrol > *", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .45, stagger: .05, ease: "power2.out", delay: .1 });
    }
    $(".ks-kembali").focus();
  };
  function tutup() {
    studio.hidden = true; siap = false; frame.src = "about:blank";
    document.body.style.overflow = $("#k-detail").hidden ? "" : "hidden";
    if (asal && asal.focus) asal.focus();
  }
  studio.addEventListener("click", (e) => { if (e.target.closest("[data-tutup-studio]")) tutup(); });
  document.addEventListener("keydown", (e) => {
    if (studio.hidden) return;
    if (e.key === "Escape") { e.stopImmediatePropagation(); if (pilihMode) setPilih(false); else tutup(); }
    if (e.key === "Tab") {
      const f = $$("button,input,select,iframe", studio).filter((x) => x.offsetParent && !x.disabled && x.tabIndex !== -1);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  }, true);

  // ---------- unduh skill saja (folder skill = akar ZIP, untuk claude.ai) ----------
  async function buatZip(isi, nama) {
    const blob = await isi.generateAsync({ type: "blob", compression: "DEFLATE" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nama;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  window.unduhSkill = async (d, btn) => {
    if (!window.JSZip) return;
    const label = btn.textContent; btn.disabled = true; btn.textContent = "Menyiapkan…";
    try {
      const zip = new JSZip();
      const sk = (d.berkas || []).filter((b) => b.startsWith(".claude/skills/"));
      await Promise.all(sk.map(async (b) => {
        const r = await fetch(d.dasar + b); if (!r.ok) throw new Error(b);
        zip.file(b.replace(/^\.claude\/skills\//, ""), await r.arrayBuffer());
      }));
      await buatZip(zip, `skill-ubah-${d.slug}.zip`);
      btn.textContent = "Skill terunduh";
    } catch (_) { btn.textContent = "Gagal, coba lagi"; }
    setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 2500);
  };

  // ---------- unduh paket dengan tema tertanam ----------
  $("#ks-unduh").addEventListener("click", async () => {
    const st = $("#ks-status"), btn = $("#ks-unduh");
    if (!window.JSZip) { st.textContent = "Pembuat ZIP belum termuat, coba lagi sebentar."; return; }
    btn.disabled = true; st.textContent = "Menyiapkan berkas…";
    try {
      const zip = new JSZip(), akar = zip.folder(paket.slug);
      const pakaiSkill = $("#ks-skill").checked;
      const daftar = (paket.berkas || []).filter((b) => pakaiSkill || !(b.startsWith(".claude/") || b === "AGENTS.md"));
      let n = 0;
      await Promise.all(daftar.map(async (b) => {
        let isi;
        if (b === "tema.css") isi = tulisCss(tema);
        else if (b === "tema.js") isi = tulisJs(tema);
        else { const r = await fetch(paket.dasar + b); if (!r.ok) throw new Error(b); isi = await r.arrayBuffer(); }
        akar.file(b, isi); n++; st.textContent = `Mengemas ${n}/${daftar.length} berkas…`;
      }));
      await buatZip(zip, `${paket.slug}-${tema.utama.slice(1)}.zip`);
      st.textContent = "Selesai. Ekstrak lalu buka index.html. Jangan lupa follow & share ya!";
      if (!kurang && window.gsap) gsap.fromTo(btn, { scale: .96 }, { scale: 1, duration: .5, ease: "elastic.out(1,.4)" });
    } catch (e) { st.textContent = "Gagal mengemas (" + e.message + "). Coba unduh dari GitHub."; }
    btn.disabled = false;
  });
})();
