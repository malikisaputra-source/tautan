/* Laman Source Code: katalog, cari, saring, panel detail, deep link #k/<slug> */
(() => {
  const DATA = (window.KODE || []).slice();
  const KAT = {
    "Template Website": { warna: "#22d3ee", kode: "</>" },
    "Aplikasi Web": { warna: "#818cf8", kode: "APP" },
    "Google Apps Script": { warna: "#10b981", kode: "GAS" },
    "Template Video": { warna: "#f59e0b", kode: "MP4" },
  };
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const state = { q: "", tier: "", kat: "" };
  let aktifSlug = null;
  const rb = (n) => n >= 1000 ? (n / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " rb" : String(n);
  function teksHitung(h) { return h ? `${rb(h.zip || 0)} diunduh · ${rb(h.lihat || 0)} dilihat${h.skill ? ` · ${rb(h.skill)} skill` : ""}` : ""; }
  function segarkanHitung() {
    const H = window.HITUNG || {};
    document.querySelectorAll("[data-angka]").forEach((e) => { const h = H[e.dataset.angka]; e.hidden = !h; e.textContent = teksHitung(h); });
    const k = $("#kd-angka"); if (k) { const h = aktifSlug && H[aktifSlug]; k.hidden = !h; k.textContent = teksHitung(h); }
    const tot = Object.values(H).reduce((a, h) => a + (h.zip || 0), 0);
    const el = document.getElementById("a-unduh"); if (el && tot) { el.textContent = rb(tot); el.closest("[data-wadah]").hidden = false; }
  }
  window.segarkanHitung = segarkanHitung;

  // premium dulu
  DATA.sort((a, b) => (a.tier === "premium" ? 0 : 1) - (b.tier === "premium" ? 0 : 1));

  function lencana(d) {
    return d.tier === "premium"
      ? `<span class="k-lencana premium"><s>Premium</s> Gratis</span>`
      : `<span class="k-lencana gratis">Gratis</span>`;
  }
  const terkunci = (d) => !!d.kunci; // dibuka manual: hapus "kunci" di meta.json lalu deploy
  const tglKunci = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d.kunci) ? new Date(d.kunci + "T00:00:00+07:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "segera";
  const gembok = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  const panah = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
  function kartuKunci(d) {
    const b = el("button", "k-kartu terkunci");
    b.type = "button"; b.disabled = true; b.setAttribute("aria-disabled", "true");
    const t = tglKunci(d), lbl = t === "segera" ? "Segera dibuka" : "Dibuka " + t;
    b.setAttribute("aria-label", `${d.judul}, ${lbl.toLowerCase()}`);
    b.innerHTML = `<div class="k-sampul">${d.gambar ? `<img src="${esc(d.gambar)}" alt="" loading="lazy" width="1280" height="800">` : ""}<span class="k-gembok">${gembok}</span></div>
      <div class="k-badan"><span class="k-lencana kunci">${lbl}</span><h3>${esc(d.judul)}</h3></div>`;
    return b;
  }
  function kartu(d, i) {
    const b = el("button", "k-kartu " + (UKURAN[i % UKURAN.length]));
    b.type = "button";
    b.setAttribute("aria-label", `${d.judul}, ${d.tier === "premium" ? "premium, gratis" : "gratis"}. Lihat detail`);
    b.innerHTML = `<div class="k-sampul">${d.gambar ? `<img src="${esc(d.gambar)}" alt="" loading="lazy" width="1280" height="800">` : `<span class="k-sampul-kosong">${esc(d.kategori)}</span>`}</div>
      <span class="k-kilau" aria-hidden="true"></span>
      <div class="k-badan">
        <div class="k-label">${lencana(d)}${d.kustom ? `<span class="k-lencana kustom">Bisa dikustom</span>` : ""}</div>
        <h3>${esc(d.judul)}</h3><p>${esc(d.ringkas)}</p>
        <p class="k-angka-k" data-angka="${esc(d.slug)}" hidden></p>
        <span class="k-kaki"><span class="k-kat-n">${esc(d.kategori)} · ${(d.teknologi || []).slice(0, 3).map(esc).join(" · ")}</span><span class="k-buka">${panah}</span></span>
      </div>`;
    b.addEventListener("click", () => buka(d, b));
    return b;
  }
  // ritme bento: besar, tinggi, kecil, lebar…
  const UKURAN = ["besar", "kecil", "kecil", "lebar", "lebar", "kecil", "tinggi", "kecil", "kecil", "kecil"];

  const buka_ = DATA.filter((d) => !terkunci(d)), kunci = DATA.filter(terkunci);
  $("#a-total").textContent = buka_.length;
  $("#a-premium").textContent = buka_.filter((d) => d.tier === "premium").length;
  $("#k-jumlah-pil").textContent = `${buka_.length} siap unduh · ${kunci.length} segera hadir`;
  $("#k-segera-n").textContent = kunci.length;
  if (!kunci.length) $("#k-segera-blok").hidden = true;
  kunci.forEach((d) => $("#k-segera").append(kartuKunci(d)));

  // kategori: segmen
  const katWrap = $("#k-kategori");
  const segKat = (nama, label) => {
    const n = nama ? buka_.filter((d) => d.kategori === nama).length : buka_.length;
    const b = el("button", "k-kat", `${esc(label)}<span>${n}</span>`);
    b.type = "button"; b.dataset.kat = nama; b.setAttribute("aria-pressed", String(!nama));
    b.addEventListener("click", () => {
      state.kat = nama;
      katWrap.querySelectorAll(".k-kat").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
    katWrap.append(b);
  };
  segKat("", "Semua");
  Object.keys(KAT).forEach((nama) => { if (buka_.some((d) => d.kategori === nama)) segKat(nama, nama.replace("Google Apps Script", "Apps Script")); });

  // tab
  document.querySelectorAll(".k-tab button").forEach((t) => t.addEventListener("click", () => {
    state.tier = t.dataset.tier;
    document.querySelectorAll(".k-tab button").forEach((x) => x.setAttribute("aria-selected", String(x === t)));
    render();
  }));

  // cari: "/" atau ⌘K / Ctrl+K
  const q = $("#k-q");
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) $("#k-kbd").textContent = "Ctrl K";
  q.addEventListener("input", () => { state.q = q.value.trim(); render(); });
  document.addEventListener("keydown", (e) => {
    if (!$("#k-detail").hidden || !$("#k-studio").hidden) return;
    const k = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
    if (k || (e.key === "/" && document.activeElement !== q && !/INPUT|TEXTAREA/.test(document.activeElement.tagName))) {
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo("#katalog", { offset: -70, duration: .8 }); else $("#katalog").scrollIntoView();
      q.focus({ preventScroll: true });
    }
  });

  const gerakOK = () => window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  function cocok(d) {
    if (terkunci(d)) return false;
    if (state.tier && d.tier !== state.tier) return false;
    if (state.kat && d.kategori !== state.kat) return false;
    if (!state.q) return true;
    const hay = [d.judul, d.ringkas, d.kategori, ...(d.teknologi || []), ...(d.fitur || [])].join(" ").toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }
  let pertama = true;
  function render() {
    const grid = $("#k-grid"); grid.innerHTML = "";
    const hasil = DATA.filter(cocok);
    hasil.forEach((d, i) => grid.append(kartu(d, i)));
    grid.classList.toggle("sedikit", hasil.length < 4);
    if (!hasil.length) grid.append(el("p", "k-kosong", "Belum ada yang cocok. Coba kata lain, atau request di komentar TikTok ya."));
    const bagian = [state.kat, state.tier && (state.tier === "premium" ? "premium" : "gratis"), state.q && `“${esc(state.q)}”`].filter(Boolean);
    $("#k-info").innerHTML = `${hasil.length} source code${bagian.length ? " · " + bagian.join(" · ") : ""}`;
    segarkanHitung();
    pasangKartu(grid);
    if (gerakOK() && !pertama) gsap.fromTo(grid.children, { y: 24, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .6, stagger: .05, ease: "expo.out", clearProps: "filter,transform,opacity" });
    pertama = false;
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  // hover: gambar bergeser mengikuti kursor + kilau
  function pasangKartu(root) {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    root.querySelectorAll(".k-kartu:not(.terkunci)").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(3));
        c.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
      c.addEventListener("pointerleave", () => { c.style.setProperty("--mx", 0); c.style.setProperty("--my", 0); });
    });
  }

  // detail
  const panel = $("#k-detail"); let asal = null;
  function buka(d, dari) {
    asal = dari || document.activeElement;
    $("#kd-gambar").innerHTML = d.gambar ? `<img src="${esc(d.gambar)}" alt="Tampilan ${esc(d.judul)}">` : "";
    $("#kd-meta").textContent = `${d.kategori} · ${d.tier === "premium" ? "PREMIUM, GRATIS" : "GRATIS"} · MIT`;
    $("#kd-judul").textContent = d.judul;
    $("#kd-ringkas").textContent = d.ringkas;
    $("#kd-unduh").href = d.zip; $("#kd-repo").href = d.repo;
    $("#kd-fitur").innerHTML = (d.fitur || []).map((f) => `<li>${esc(f)}</li>`).join("");
    $("#kd-cara").innerHTML = (d.cara || []).map((f) => `<li>${esc(f)}</li>`).join("");
    $("#kd-bagi").onclick = async () => {
      const url = `${location.origin}${location.pathname}#k/${d.slug}`;
      try { if (navigator.share) await navigator.share({ title: d.judul, url }); else { await navigator.clipboard.writeText(url); $("#kd-bagi").textContent = "Tautan tersalin"; } } catch (_) {}
    };
    $("#kd-bagi").textContent = "Bagikan";
    aktifSlug = d.slug; window.catatHitung && window.catatHitung(d.slug, "lihat"); segarkanHitung();
    $("#kd-unduh").onclick = (e) => {
      const jalan = () => { window.catatHitung && window.catatHitung(d.slug, "zip"); location.href = d.zip; };
      if (window.gerbangFollow) { e.preventDefault(); window.gerbangFollow(d.slug, jalan); }
      else window.catatHitung && window.catatHitung(d.slug, "zip");
    };
    const kb = $("#kd-kustom"); kb.hidden = !d.kustom;
    kb.onclick = () => window.bukaStudio && window.bukaStudio(d);
    const ada = (d.berkas || []).some((b) => b.startsWith(".claude/skills/"));
    $("#kd-skill").hidden = !ada; $("#kd-skill-info").hidden = !ada;
    $("#kd-skill").onclick = () => { const f = () => window.unduhSkill && window.unduhSkill(d, $("#kd-skill")); window.gerbangFollow ? window.gerbangFollow(d.slug, f) : f(); };
    panel.hidden = false; document.body.style.overflow = "hidden"; window.__lenis && window.__lenis.stop();
    history.replaceState(null, "", `#k/${d.slug}`);
    $(".k-detail-isi").scrollTop = 0; $(".k-tutup").focus();
  }
  function tutup() {
    panel.hidden = true; document.body.style.overflow = ""; if (window.__lenis && $("#k-studio").hidden) window.__lenis.start();
    history.replaceState(null, "", location.pathname);
    if (asal && asal.focus) asal.focus();
  }
  panel.addEventListener("click", (e) => { if (e.target.closest("[data-tutup]")) tutup(); });
  document.addEventListener("keydown", (e) => {
    if (panel.hidden) return;
    if (e.key === "Escape") tutup();
    if (e.key === "Tab") { // jebakan fokus
      const f = [...panel.querySelectorAll("a[href],button")].filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  const m = location.hash.match(/^#k\/(.+)$/);
  render(); window.muatHitung && window.muatHitung();
  if (m) { const d = DATA.find((x) => x.slug === decodeURIComponent(m[1])); if (d && !terkunci(d)) buka(d); }

  // gerak
  // kata judul dipecah untuk reveal per kata (teks tetap utuh untuk pembaca layar)
  document.querySelectorAll("[data-pecah]").forEach((h) => {
    const t = h.textContent.trim(); h.setAttribute("aria-label", t);
    h.innerHTML = t.split(" ").map((w, i) => `<span class="kata" aria-hidden="true"><span${i >= 4 ? ' class="redup-j"' : ""}>${esc(w)}</span></span>`).join(" ");
  });
  const hero = $(".k-hero");
  if (gerakOK()) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(2, -10 * t) });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      document.querySelectorAll(".k-detail-isi, .k-studio, .g-latar").forEach((x) => x.setAttribute("data-lenis-prevent", ""));
      new MutationObserver(() => { const buka = !$("#k-detail").hidden || !$("#k-studio").hidden; buka ? lenis.stop() : lenis.start(); })
        .observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
      document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
        const t = a.getAttribute("href"); if (t.length < 2 || !document.querySelector(t)) return;
        e.preventDefault(); lenis.scrollTo(t, { offset: -70 });
      }));
    }
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".k-hero .k-busur", { yPercent: 18, opacity: 0, duration: 2.2 })
      .from(".k-hero .k-sinar", { opacity: 0, scale: .7, duration: 2.4 }, 0)
      .from(".k-pil", { y: 12, opacity: 0, duration: .9 }, .3)
      .from(".k-judul .kata > span", { yPercent: 110, rotate: 4, duration: 1.2, stagger: .055 }, .35)
      .from(".k-hero .sub, .k-hero-aksi > *, .k-ringkas", { y: 18, opacity: 0, duration: 1, stagger: .08 }, .9);
    // cahaya bernapas + condong ke kursor
    gsap.to(".k-hero .k-sinar", { opacity: .72, scale: 1.06, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
    const gx = gsap.quickTo(hero, "--gx", { duration: 1.4, ease: "power3.out" });
    if (matchMedia("(pointer: fine)").matches) hero.addEventListener("pointermove", (e) => gx(((e.clientX / innerWidth) - .5) * 30));
    gsap.to(".k-hero .k-busur, .k-hero .k-sinar", { yPercent: 14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".k-hero-isi", { y: -60, opacity: .2, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    // bento masuk berirama
    ScrollTrigger.batch(".k-bento .k-kartu", {
      start: "top 92%", once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0, clipPath: "inset(12% 0 0 0 round 22px)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0 round 22px)", duration: 1.1, stagger: .09, ease: "expo.out", clearProps: "clipPath,transform" }),
    });
    gsap.set(".k-bento .k-kartu", { opacity: 0 });
    gsap.utils.toArray(".k-bento .k-sampul img").forEach((im) =>
      gsap.fromTo(im, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: im.closest(".k-kartu"), start: "top bottom", end: "bottom top", scrub: true } }));
    gsap.from(".k-segera-kepala > *, .k-segera .k-kartu", { y: 40, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".k-segera", start: "top 80%" } });
    gsap.from(".k-cara-judul span", { yPercent: 60, opacity: 0, duration: 1.1, stagger: .14, ease: "expo.out", scrollTrigger: { trigger: ".k-cara", start: "top 78%" } });
    gsap.from(".k-jaminan > div", { y: 24, opacity: 0, duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".k-jaminan", start: "top 85%" } });
    gsap.from(".k-final .k-busur, .k-final .k-sinar", { yPercent: 30, opacity: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".k-final", start: "top 75%" } });
    gsap.from(".k-final > h2, .k-final > p, .k-final .k-hero-aksi", { y: 30, opacity: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".k-final", start: "top 70%" } });
    // tombol magnet + kursor bercahaya (hanya pointer halus)
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll(".magnet").forEach((m) => {
        const x = gsap.quickTo(m, "x", { duration: .5, ease: "power3.out" }), y = gsap.quickTo(m, "y", { duration: .5, ease: "power3.out" });
        m.addEventListener("pointermove", (e) => { const r = m.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .35); });
        m.addEventListener("pointerleave", () => { x(0); y(0); });
      });
      const k = $(".k-kursor"); k.classList.add("aktif");
      const kx = gsap.quickTo(k, "x", { duration: .7, ease: "power3.out" }), ky = gsap.quickTo(k, "y", { duration: .7, ease: "power3.out" });
      addEventListener("pointermove", (e) => { kx(e.clientX); ky(e.clientY); }, { passive: true });
    }
  }
  window.addEventListener("scroll", () => $(".atas").classList.toggle("tergulir", scrollY > 10), { passive: true });
})();
