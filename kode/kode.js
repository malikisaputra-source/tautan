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

  // unggulan: premium dulu
  DATA.sort((a, b) => (a.tier === "premium" ? 0 : 1) - (b.tier === "premium" ? 0 : 1));

  function lencana(d) {
    return d.tier === "premium"
      ? `<span class="k-lencana premium"><s>Premium</s>Gratis</span>`
      : `<span class="k-lencana gratis">Gratis</span>`;
  }
  function kartu(d) {
    const b = el("button", "k-kartu");
    b.type = "button";
    b.setAttribute("aria-label", `${d.judul}, ${d.tier === "premium" ? "premium, gratis" : "gratis"}. Lihat detail`);
    b.innerHTML = `${lencana(d)}
      <div class="k-sampul ${d.gambar ? "" : "kosong"}">${d.gambar ? `<img src="${esc(d.gambar)}" alt="" loading="lazy" width="1280" height="800">` : esc(d.kategori)}</div>
      <div class="k-badan"><h3>${esc(d.judul)}</h3><p>${esc(d.ringkas)}</p>
      <div class="k-tag">${(d.teknologi || []).slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`;
    b.addEventListener("click", () => buka(d, b));
    return b;
  }

  // hero
  $("#a-total").textContent = DATA.length;
  $("#a-premium").textContent = DATA.filter((d) => d.tier === "premium").length;
  $("#k-jumlah-pil").textContent = `${DATA.length} source code`;
  const ung = $("#k-unggulan");
  DATA.slice(0, 3).forEach((d) => ung.append(kartu(d)));
  const pop = $("#k-populer");
  ["kasir", "presensi", "sekolah", "WhatsApp", "video"].forEach((t) => {
    const b = el("button", null, esc(t)); b.type = "button";
    b.addEventListener("click", () => { $("#k-q").value = t; state.q = t; render(); $("#katalog").scrollIntoView({ behavior: "smooth" }); });
    pop.append(b);
  });

  // kategori
  const katWrap = $("#k-kategori");
  Object.entries(KAT).forEach(([nama, k]) => {
    const n = DATA.filter((d) => d.kategori === nama).length;
    const b = el("button", "k-kat", `<span class="k-kat-kotak" aria-hidden="true">${esc(k.kode)}</span><b>${esc(nama)}</b><span>${n} source code</span>`);
    b.type = "button"; b.style.setProperty("--warna", k.warna); b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      state.kat = state.kat === nama ? "" : nama;
      katWrap.querySelectorAll(".k-kat").forEach((x) => x.setAttribute("aria-pressed", String(x === b && !!state.kat)));
      render(); $("#katalog").scrollIntoView({ behavior: "smooth" });
    });
    katWrap.append(b);
  });

  // tab
  document.querySelectorAll(".k-tab button").forEach((t) => t.addEventListener("click", () => {
    state.tier = t.dataset.tier;
    document.querySelectorAll(".k-tab button").forEach((x) => x.setAttribute("aria-selected", String(x === t)));
    render();
  }));

  // cari
  const q = $("#k-q");
  q.addEventListener("input", () => { state.q = q.value.trim(); render(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== q && $("#k-detail").hidden) { e.preventDefault(); q.focus(); }
  });

  function cocok(d) {
    if (state.tier && d.tier !== state.tier) return false;
    if (state.kat && d.kategori !== state.kat) return false;
    if (!state.q) return true;
    const hay = [d.judul, d.ringkas, d.kategori, ...(d.teknologi || []), ...(d.fitur || [])].join(" ").toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }
  function render() {
    const grid = $("#k-grid"); grid.innerHTML = "";
    const hasil = DATA.filter(cocok);
    hasil.forEach((d) => grid.append(kartu(d)));
    if (!hasil.length) grid.append(el("p", "k-kosong", "Belum ada yang cocok. Coba kata lain, atau request di komentar TikTok ya."));
    const bagian = [state.kat, state.tier && (state.tier === "premium" ? "premium" : "gratis"), state.q && `“${esc(state.q)}”`].filter(Boolean);
    $("#k-info").innerHTML = `${hasil.length} source code${bagian.length ? " · " + bagian.join(" · ") : ""}`;
    if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.from(grid.children, { y: 16, opacity: 0, duration: .4, stagger: .04, ease: "power2.out", clearProps: "all" });
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
    panel.hidden = false; document.body.style.overflow = "hidden";
    history.replaceState(null, "", `#k/${d.slug}`);
    $(".k-detail-isi").scrollTop = 0; $(".k-tutup").focus();
  }
  function tutup() {
    panel.hidden = true; document.body.style.overflow = "";
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
  render();
  if (m) { const d = DATA.find((x) => x.slug === decodeURIComponent(m[1])); if (d) buka(d); }

  // gerak
  if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".k-judul .baris", { yPercent: 40, opacity: 0, duration: .8, stagger: .1, ease: "power3.out" });
    gsap.from(".k-hero-kanan .k-kartu", { y: 40, opacity: 0, duration: .8, stagger: .12, delay: .25, ease: "power3.out" });
    gsap.utils.toArray(".k-dukung, .k-kat, .k-jaminan div, .k-usul").forEach((x) =>
      gsap.from(x, { y: 24, opacity: 0, duration: .6, ease: "power2.out", scrollTrigger: { trigger: x, start: "top 88%" } }));
  }
  window.addEventListener("scroll", () => $(".atas").classList.toggle("tergulir", scrollY > 10), { passive: true });
})();
