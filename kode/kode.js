/* Laman Source Code: katalog, cari, saring, panel detail, deep link #k/<slug> */
(() => {
  // tiga laman: Website & Webapp (/kode/), AI Agent (/kode/agent/), Video (/kode/video/)
  const LAMAN = document.body.dataset.laman || "web", AKAR = document.body.dataset.akar || "";
  const grup = (d) => d.kategori === "AI Agent" ? "agent" : d.kategori === "Template Video" ? "video" : "web";
  const relatif = (u) => !u || /^(https?:|\/|data:)/.test(u) ? u : AKAR + u;
  const SEMUA = (window.KODE || []).map((d) => AKAR ? { ...d, gambar: relatif(d.gambar), dasar: relatif(d.dasar),
    unduhan_lain: (d.unduhan_lain || []).map((u) => ({ ...u, href: relatif(u.href) })) } : d);
  const DATA = SEMUA.filter((d) => grup(d) === LAMAN);
  const LAMAN_DAF = [
    { id: "web", label: "Website & Webapp", url: "" },
    { id: "agent", label: "AI Agent", url: "agent/" },
    { id: "video", label: "Video", url: "video/" },
  ];
  // deep link ke paket di laman lain → pindah ke laman yang benar
  { const mh = location.hash.match(/^#k\/(.+)$/), s = mh && decodeURIComponent(mh[1]);
    const lain = s && !DATA.some((d) => d.slug === s) && SEMUA.find((d) => d.slug === s);
    if (lain) { const tj = LAMAN_DAF.find((l) => l.id === grup(lain)); location.replace((AKAR || "./") + tj.url + "#k/" + s); } }
  { const nav = document.getElementById("k-laman");
    if (nav) nav.innerHTML = LAMAN_DAF.map((l) => {
      const n = SEMUA.filter((d) => grup(d) === l.id).length;
      return `<a href="${(AKAR || "./") + l.url}" ${l.id === LAMAN ? 'aria-current="page"' : ""}>${l.label}<span>${n}</span></a>`;
    }).join(""); }
  const KAT = {
    "AI Agent": { warna: "#f472b6", kode: "AI" },
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
    const tg = d.tantangan, t = tglKunci(d);
    const namaM = tg ? (tg.metrik || []).map((m) => m.label).join(", ").replace(/, ([^,]*)$/, " & $1") : "";
    const lbl = tg ? (tg.aktif ? `Tantangan aktif · ${tg.target}` : `Giliran #${tg.giliran} · ${tg.target}`) : t === "segera" ? "Segera dibuka" : "Dibuka " + t;
    b.setAttribute("aria-label", `${d.judul}, ${tg ? lbl.toLowerCase() + " " + namaM : lbl.toLowerCase()}`);
    const IK = { like: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', komentar: '<path d="M4 5h16v11H9l-5 4z"/>', simpan: '<path d="M6 3h12v18l-6-4-6 4z"/>' };
    let prog = "";
    if (tg && tg.aktif) {
      prog = `<div class="k-tantangan"><p class="k-tt-judul">Tembus <b>${tg.target}</b> ${esc(namaM)} di postingan showcase</p>` +
        (tg.metrik || []).map((m) => { const p = Math.min(100, Math.round((m.sekarang || 0) / tg.target * 100));
          return `<div class="k-tt-baris"><svg viewBox="0 0 24 24" aria-hidden="true">${IK[m.id] || ""}</svg><span class="k-tt-nama">${esc(m.label)}</span>
            <div class="k-tt-bar" role="progressbar" aria-label="${esc(m.label)}" aria-valuemin="0" aria-valuemax="${tg.target}" aria-valuenow="${m.sekarang || 0}"><span style="width:${p}%"></span></div>
            <span class="k-tt-n"><b>${(m.sekarang || 0).toLocaleString("id-ID")}</b>/${tg.target}</span></div>`; }).join("") +
        `<span class="k-tt-cta">Buka postingan showcase</span></div>`;
      b.disabled = false; b.removeAttribute("aria-disabled"); b.classList.add("aktif");
      b.addEventListener("click", () => window.open(tg.tautan || "https://www.tiktok.com/@malikifsaputra", "_blank", "noopener"));
    } else if (tg) prog = `<p class="k-tt-tunggu">${tg.target} ${esc(namaM)} · dibuka setelah tantangan sebelumnya tercapai.</p>`;
    b.innerHTML = `<div class="k-sampul">${d.gambar ? `<img src="${esc(d.gambar)}" alt="" loading="lazy" width="1280" height="800">` : ""}<span class="k-gembok">${gembok}</span></div>
      <div class="k-badan"><span class="k-lencana kunci">${lbl}</span><h3>${esc(d.judul)}</h3>${prog}</div>`;
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
        ${(d.req || []).length ? `<p class="k-req">req ${d.req.map((r) => "@" + esc(r.replace(/^@/, ""))).join(", ")}</p>` : ""}
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
  const totalBuka = SEMUA.filter((d) => !terkunci(d)).length;
  $("#k-jumlah-pil").textContent = totalBuka > buka_.length ? `${buka_.length} di laman ini · ${totalBuka} siap unduh total` : `${buka_.length} siap unduh · ${kunci.length} segera hadir`;
  $("#k-segera-n").textContent = kunci.length;
  if (!kunci.length) $("#k-segera-blok").hidden = true;
  kunci.sort((a, b) => String(a.kunci).localeCompare(String(b.kunci)));
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
    if (!hasil.length) grid.append(el("p", "k-kosong", buka_.length ? "Belum ada yang cocok. Coba kata lain, atau request di komentar TikTok ya." : "Paket di laman ini segera dibuka. Lihat daftar \"Segera hadir\" di bawah, dan follow TikTok @malikisaputra biar tidak ketinggalan."));
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

  // panduan penggunaan: PANDUAN.md (atau README.md) dirender sederhana
  function mdKeHtml(s) {
    const baris = s.replace(/\r/g, "").split("\n"); let o = "", daftar = null, kode = false;
    const inl = (x) => esc(x).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    const tutup = () => { if (daftar) { o += `</${daftar}>`; daftar = null; } };
    for (const b of baris) {
      if (/^```/.test(b)) { tutup(); o += kode ? "</code></pre>" : "<pre><code>"; kode = !kode; continue; }
      if (kode) { o += esc(b) + "\n"; continue; }
      let m;
      if ((m = b.match(/^(#{1,4})\s+(.*)/))) { tutup(); const n = Math.min(m[1].length + 2, 5); o += `<h${n}>${inl(m[2])}</h${n}>`; }
      else if ((m = b.match(/^\s*[-*]\s+(.*)/))) { if (daftar !== "ul") { tutup(); o += "<ul>"; daftar = "ul"; } o += `<li>${inl(m[1])}</li>`; }
      else if ((m = b.match(/^\s*\d+[.)]\s+(.*)/))) { if (daftar !== "ol") { tutup(); o += "<ol>"; daftar = "ol"; } o += `<li>${inl(m[1])}</li>`; }
      else if (/^\s*(---+|\|)/.test(b) || /^<!--/.test(b)) { if (/^\s*\|/.test(b) && !/^\s*\|[\s:-]+\|/.test(b)) { tutup(); o += `<p class="kd-baris">${inl(b.replace(/^\s*\||\|\s*$/g, "").split("|").map((x) => x.trim()).join(" · "))}</p>`; } }
      else if (b.trim()) { tutup(); o += `<p>${inl(b)}</p>`; } else tutup();
    }
    tutup(); if (kode) o += "</code></pre>"; return o;
  }
  const KREDIT = `<div class="kd-kredit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"/></svg>
    <div><b>Lisensi: wajib cantumkan kreator · tidak untuk diperjualbelikan</b><p>Gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah. Kredit <strong>"Template oleh Maliki Saputra (@malikisaputra)"</strong> di footer, kepala berkas, dan LICENSE tidak boleh dihapus.</p><p><strong>Tidak boleh dijual atau dijual ulang</strong> (sebagai template, paket, atau bahan kursus) tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya lewat TikTok/IG @malikisaputra.</p></div></div>`;
  // ubah tiap judul jadi bagian buka-tutup; bagian lisensi/kredit tetap terbuka & disorot
  function lipat(akar) {
    const anak = [...akar.children]; let det = null, isi = null;
    for (const el of anak) {
      if (/^H[45]$/.test(el.tagName)) {
        const lis = /lisensi|kredit|license/i.test(el.textContent);
        det = document.createElement("details"); det.className = "kd-lipat" + (el.tagName === "H4" ? " utama" : "") + (lis ? " sorot" : "");
        if (lis) det.open = true;
        const sm = document.createElement("summary"); sm.innerHTML = el.innerHTML; det.append(sm);
        isi = document.createElement("div"); isi.className = "kd-lipat-isi"; det.append(isi);
        el.replaceWith(det);
      } else if (det && el.tagName !== "H3" && !el.classList.contains("kd-kredit")) {
        if (/kredit|template oleh|lisensi mit/i.test(el.textContent) && el.tagName === "P") el.classList.add("kd-sorot");
        isi.append(el);
      }
    }
    akar.querySelectorAll("details.kd-lipat").forEach((d) => { if (!d.querySelector(".kd-lipat-isi").children.length) d.classList.add("kosong"); });
  }
  async function muatPanduan(d) {
    const raw = `https://raw.githubusercontent.com/malikisaputra-source/${d.slug}/main/`;
    const calon = [];
    for (const f of ["PANDUAN.md", "README.md"]) {
      if (d.dasar && (d.berkas || []).includes(f)) calon.push(d.dasar + f);
      calon.push(raw + f);
    }
    for (const u of calon) { try { const r = await fetch(u); if (r.ok) return await r.text(); } catch (_) {} }
    return null;
  }

  // detail
  const panel = $("#k-detail"); let asal = null;
  function buka(d, dari) {
    asal = dari || document.activeElement;
    $("#kd-gambar").innerHTML = d.gambar ? `<img src="${esc(d.gambar)}" alt="Tampilan ${esc(d.judul)}">` : "";
    $("#kd-meta").textContent = `${d.kategori} · ${d.tier === "premium" ? "PREMIUM, GRATIS" : "GRATIS"} · TIDAK UNTUK DIJUAL`;
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
    const lain = $("#kd-lain"); lain.hidden = !((d.unduhan_lain || []).length || d.prd);
    lain.innerHTML = (d.unduhan_lain || []).map((u, i) => `<a class="tombol garis" data-i="${i}" href="${esc(u.href)}" download>${esc(u.label)}</a>`).join("") +
      (d.prd ? `<a class="tombol garis k-prd" href="${AKAR || ""}../prd/?template=${encodeURIComponent(d.slug)}" title="Buat PRD khusus template ini, lalu unduh template + PRD sekaligus">Ubah pakai PRD ✦</a>` : "");
    lain.querySelectorAll("a[data-i]").forEach((a) => { a.onclick = (e) => {
      const u = d.unduhan_lain[+a.dataset.i], nama = u.href.split("/").pop().replace(/\.zip$/, "");
      const jalan = () => { window.catatHitung && window.catatHitung(nama, "zip"); location.href = u.href; };
      if (window.gerbangFollow) { e.preventDefault(); window.gerbangFollow(d.slug, jalan); } else jalan();
    }; });
    const req = (d.req || []).filter(Boolean); $("#kd-req").hidden = !req.length;
    $("#kd-req").textContent = req.length ? "Dibuat atas request " + req.map((r) => "@" + r.replace(/^@/, "")).join(", ") : "";
    const pb = $("#kd-panduan");
    pb.onclick = async () => {
      pb.disabled = true; pb.textContent = "Memuat panduan…";
      const s = await muatPanduan(d);
      pb.disabled = false; pb.textContent = "Panduan penggunaan";
      window.bukaPanduan && window.bukaPanduan(d, s, KREDIT, mdKeHtml);
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
    tl.from(".k-hero .k-busur", { opacity: 0, duration: 2.2 })
      .from(".k-hero .k-sinar", { opacity: 0, scale: .7, duration: 2.4 }, 0)
      .from(".k-pil", { y: 12, opacity: 0, duration: .9 }, .3)
      .from(".k-judul .kata > span", { yPercent: 110, rotate: 4, duration: 1.2, stagger: .055 }, .35)
      .from(".k-hero .sub, .k-hero-aksi > *, .k-ringkas", { y: 18, opacity: 0, duration: 1, stagger: .08 }, .9);
    // cahaya bernapas + condong ke kursor
    gsap.to(".k-hero .k-sinar", { opacity: .72, scale: 1.06, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
    const gx = gsap.quickTo(hero, "--gx", { duration: 1.4, ease: "power3.out" });
    if (matchMedia("(pointer: fine)").matches) hero.addEventListener("pointermove", (e) => gx(((e.clientX / innerWidth) - .5) * 30));
    gsap.to(".k-hero .k-busur, .k-hero .k-sinar", { y: -60, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
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

/* Langit hidup: bintang berkelip berlapis + parallax kursor + bintang jatuh; roket meluncur berkala */
(() => {
  const cv = document.getElementById("k-langit"); if (!cv) return;
  const kurang = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = cv.getContext("2d"); let percik = [], W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 1.5), bintang = [], jatuh = [], mx = 0, my = 0, t0 = performance.now();
  function ukur() {
    const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(W * H / (W < 700 ? 2600 : 3200));
    bintang = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * .78, z: Math.random(), r: Math.random() * 1.6 + .45,
      f: Math.random() * 6.28, k: .6 + Math.random() * 2.2, w: Math.random() < .12 }));
  }
  ukur(); let lebarLama = innerWidth, jalan = true;
  addEventListener("resize", () => { if (innerWidth !== lebarLama) { lebarLama = innerWidth; ukur(); } });
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  if ("IntersectionObserver" in window && !kurang) new IntersectionObserver(([en]) => { const lama = jalan; jalan = en.isIntersecting; if (jalan && !lama) requestAnimationFrame(gambar); }).observe(cv);
  function gambar(now) {
    const t = (now - t0) / 1000; ctx.clearRect(0, 0, W, H);
    for (const b of bintang) {
      const tw = kurang ? .85 : .3 + .7 * Math.sin(t * b.k + b.f) ** 2;
      const x = b.x - mx * 30 * (b.z + .2), y = b.y - my * 20 * (b.z + .2) + (kurang ? 0 : (t * 4 * b.z) % H * 0);
      const fadeY = Math.max(0, 1 - y / (H * .78));
      ctx.globalAlpha = Math.min(1, tw * (.5 + b.z * .7) * fadeY);
      ctx.fillStyle = b.w ? "#a5f3fc" : "#ffffff";
      ctx.beginPath(); ctx.arc(x, y, b.r * (b.w ? 1.3 : 1), 0, 6.28); ctx.fill();
      if (b.w && tw > .9) { ctx.globalAlpha *= .5; ctx.fillRect(x - 5, y - .35, 10, .7); ctx.fillRect(x - .35, y - 5, .7, 10); }
    }
    if (!kurang) {
      if (Math.random() < .007 && jatuh.length < 2) { const kanan = Math.random() < .5; jatuh.push({ x: kanan ? W * (.55 + Math.random() * .45) : W * Math.random() * .45, y: Math.random() * H * .35, vx: (kanan ? -1 : 1) * (7 + Math.random() * 6), vy: 3 + Math.random() * 2.5, h: 1 }); }
      for (const j of jatuh) {
        j.x += j.vx; j.y += j.vy; j.h -= .01;
        const g = ctx.createLinearGradient(j.x, j.y, j.x - j.vx * 14, j.y - j.vy * 14);
        g.addColorStop(0, `rgba(224,250,255,${j.h})`); g.addColorStop(1, "rgba(34,211,238,0)");
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(j.x, j.y); ctx.lineTo(j.x - j.vx * 16, j.y - j.vy * 16); ctx.stroke();
        const kp = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, 7); kp.addColorStop(0, `rgba(255,255,255,${j.h})`); kp.addColorStop(1, 'rgba(34,211,238,0)'); ctx.fillStyle = kp; ctx.beginPath(); ctx.arc(j.x, j.y, 7, 0, 6.28); ctx.fill();
      }
      jatuh = jatuh.filter((j) => j.h > 0 && j.x > -80 && j.x < W + 80 && j.y < H);
      // percikan api roket
      for (const p of percik) { p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy *= .97; p.h -= .025; ctx.globalAlpha = Math.max(0, p.h); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); }
      percik = percik.filter((p) => p.h > 0);
    }
    ctx.globalAlpha = 1;
    if (!kurang && jalan) requestAnimationFrame(gambar);
  }
  requestAnimationFrame(gambar);

  const roket = document.getElementById("k-roket");
  if (!roket || kurang || !window.gsap) return;
  const asap = roket.querySelector(".k-asap");
  function luncur() {
    const hero = roket.parentElement.getBoundingClientRect();
    const tl = gsap.timeline();
    const ke = Math.random() < .5 ? -1 : 1;
    tl.set(roket, { x: 0, y: 0, rotate: ke * -8, opacity: 0, scale: .6 })
      .set(asap, { height: 0, opacity: 1 })
      .to(roket, { opacity: 1, scale: 1, duration: .4 })
      .to(roket, { y: -hero.height * .62, x: ke * hero.width * .08, rotate: ke * 6, duration: 1.6, ease: "power2.in" }, "<")
      .to(roket, { y: -hero.height * 1.05, x: ke * hero.width * .32, rotate: ke * 28, duration: 1.4, ease: "power1.in" })
      .to(asap, { height: 340, duration: 3, ease: "power1.in" }, 0)
      .to(roket, { opacity: 0, duration: .4 }, "-=.4")
      .to(asap, { opacity: 0, duration: .6 }, "-=.4");
    const lepas = () => {
      if (+getComputedStyle(roket).opacity < .1) return;
      // nosel mengikuti rotasi roket: pusat elemen + vektor (0, setengah tinggi) yang diputar
      const rr = roket.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const sv = roket.querySelector("svg"), hs = sv.getBoundingClientRect ? sv.clientHeight * (+gsap.getProperty(roket, "scale") || 1) : 60;
      const a = (+gsap.getProperty(roket, "rotation") || 0) * Math.PI / 180;
      const cx = rr.left + rr.width / 2 - cr.left, cy = rr.top + rr.height / 2 - cr.top;
      const ox = -Math.sin(a) * hs * .42, oy = Math.cos(a) * hs * .42; // arah "ke bawah" roket
      for (let i = 0; i < 3; i++) {
        const v = 1.2 + Math.random() * 2, sebar = (Math.random() - .5) * .9;
        percik.push({ x: cx + ox, y: cy + oy, vx: -Math.sin(a) * v + Math.cos(a) * sebar, vy: Math.cos(a) * v + Math.sin(a) * sebar, r: Math.random() * 2 + .6, h: 1, c: Math.random() < .5 ? "#a5f3fc" : "#ffffff" });
      }
    };
    gsap.ticker.add(lepas);
    tl.eventCallback("onComplete", () => { gsap.ticker.remove(lepas); gsap.delayedCall(4 + Math.random() * 3, luncur); });
  }
  gsap.delayedCall(.9, luncur);
})();

/* Posisikan puncak lengkung tepat di bawah baris angka hero (semua ukuran layar) */
(() => {
  const hero = document.querySelector(".k-hero"); if (!hero) return;
  const busur = hero.querySelector(".k-busur"), sinar = hero.querySelector(".k-sinar"), roket = document.getElementById("k-roket");
  const angka = hero.querySelector(".k-ringkas");
  function atur() {
    const ref = angka || hero.querySelector(".k-hero-isi"); if (!ref) return;
    const top = ref.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + (innerWidth < 760 ? 70 : 90);
    [busur, sinar].forEach((e) => e && e.style.setProperty("top", top + "px", "important"));
    if (roket) roket.style.setProperty("top", top + 40 + "px");
  }
  addEventListener("load", atur); addEventListener("resize", atur); document.fonts && document.fonts.ready.then(atur); atur(); setTimeout(atur, 1800);
})();
