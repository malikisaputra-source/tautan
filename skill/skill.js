/* Perpustakaan skill · Maliki Studio (@malikisaputra) */
(() => {
  const D = window.SKILL || { skill: [], paket: [], kategori: {} };
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(".", ",") + " jt" : n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".", ",") + "rb" : String(n || 0);
  const tgl = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "–";
  const LABEL = { buatan: "Buatanku", tokoh: "Dipuji tokoh", resmi: "Resmi", populer: "Populer", coba: "Aku pakai" };
  const SB = "https://qsoejsauqlfkchxtnumm.supabase.co", KEY = "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW";
  const catat = (slug) => { try { fetch(SB + "/rest/v1/rpc/catat", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: "skill:" + slug, p_jenis: "skill" }), keepalive: true }); } catch (_) {} };
  const toast = (t) => { const el = $("#toast"); el.textContent = t; el.classList.add("tampil"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("tampil"), 2200); };
  async function salin(t) { try { await navigator.clipboard.writeText(t); } catch (_) { const a = document.createElement("textarea"); a.value = t; document.body.append(a); a.select(); document.execCommand("copy"); a.remove(); } }

  const S = Object.fromEntries(D.skill.map((s) => [s.repo, s]));
  const total = D.skill.reduce((a, s) => a + (s.bintang || 0), 0);
  $("#s-angka").innerHTML = `<div><dt>skill</dt><dd>${D.skill.length}</dd></div><div><dt>total bintang</dt><dd>${fmt(total)}</dd></div><div><dt>teruji pasang</dt><dd>${D.skill.filter((s) => s.teruji).length}</dd></div><div><dt>dicek</dt><dd>${tgl(D.dicek)}</dd></div>`;

  $("#s-paket").innerHTML = D.paket.map((p) => {
    const cmd = p.isi.map((r) => `npx skills add ${r}`).join(" && ");
    return `<article class="s-pkt"><b>${esc(p.judul)}</b><ul>${p.isi.map((r) => `<li><span>${esc(r.split("/")[1] === "skills" ? r : r.split("/")[1])}</span><em>${fmt((S[r] || {}).bintang)}★</em></li>`).join("")}</ul>
      <button type="button" class="tombol kecil" data-salin="${esc(cmd)}" data-slug="paket-${p.id}">Salin perintah paket</button></article>`;
  }).join("");

  let kat = "semua", lab = "", urut = "bintang";
  try { kat = new URLSearchParams(location.search).get("kat") || "semua"; } catch (_) {}
  const kats = [["semua", "Semua"], ...Object.entries(D.kategori)];
  function filter() {
    $("#s-kat").innerHTML = kats.map(([k, v]) => `<button type="button" data-kat="${k}" aria-pressed="${kat === k}">${esc(v)}<small>${k === "semua" ? D.skill.length : D.skill.filter((s) => s.kat === k).length}</small></button>`).join("");
    $("#s-label").innerHTML = Object.entries(LABEL).map(([k, v]) => `<button type="button" data-lab="${k}" aria-pressed="${lab === k}">${esc(v)}</button>`).join("");
  }
  function kartuBuatan(s) {
    const nm = s.repo.split("/")[1];
    return `<article class="s-kartu s-kartu-buatan" data-kat="${s.kat}">
      <div class="s-kartu-atas"><span class="s-kat">${esc(D.kategori[s.kat] || "")}</span><span class="s-lbl l-buatan">Buatanku</span><span class="s-lbl l-coba">Aku pakai</span></div>
      <div class="s-buatan-judul">${s.gambar ? `<img src="${esc(s.gambar)}" alt="" width="64" height="52" loading="lazy">` : ""}<h3><span>malikisaputra/</span>${esc(nm)}</h3></div>
      <p class="s-fungsi">${esc(s.fungsi)}</p>
      <p class="s-alat">Gratis · .zip · ${esc(s.alat || "")}</p>
      <div class="s-pasang"><code>${esc(s.pasang)}</code><button type="button" data-salin="${esc(s.ketik)}" data-slug="${esc(s.repo)}" aria-label="Salin perintah ${esc(nm)}">Salin</button></div>
      <div class="s-buatan-aksi"><a class="tombol kecil" href="${esc(s.unduh)}" ${/^https?:/.test(s.unduh) ? "" : "download"} data-unduh="${esc(nm)}">Unduh skill (.zip)</a><a class="s-gh" href="${esc(s.github)}" ${/^https?:/.test(s.github) ? 'target="_blank" rel="noopener"' : ""}>${/^https?:/.test(s.github) ? "Buka di GitHub ↗" : "Paket 10 agent →"}</a></div>
    </article>`;
  }
  function kartu(s) {
    if (s.buatan) return kartuBuatan(s);
    const lbl = (s.label || []).map((l) => `<span class="s-lbl l-${l}">${esc(LABEL[l] || l)}</span>`).join("");
    const [own, nm] = s.repo.split("/");
    return `<article class="s-kartu" data-kat="${s.kat}">
      <div class="s-kartu-atas"><span class="s-kat">${esc(D.kategori[s.kat] || "")}</span>${lbl}</div>
      <h3><span>${esc(own)}/</span>${esc(nm)}</h3>
      <p class="s-fungsi">${esc(s.fungsi)}</p>
      <dl class="s-stat"><div><dt>bintang</dt><dd>★ ${fmt(s.bintang)}</dd></div><div><dt>fork</dt><dd>${fmt(s.fork)}</dd></div><div><dt>issue</dt><dd>${fmt(s.issue)}</dd></div><div><dt>update</dt><dd>${tgl(s.update)}</dd></div></dl>
      <p class="s-sumber">${s.link_sumber ? `<a href="${esc(s.link_sumber)}" target="_blank" rel="noopener">${esc(s.sumber)} ↗</a>` : esc(s.sumber || "")}${s.lisensi ? ` · lisensi ${esc(s.lisensi)}` : ""}${s.teruji ? ` · <span class="s-uji">✓ teruji pasang (${s.teruji} skill)</span>` : ""}</p>
      ${s.awas ? `<p class="s-awas">${esc(s.awas)}</p>` : ""}
      <div class="s-pasang"><code>${esc(s.pasang)}</code><button type="button" data-salin="${esc(s.pasang)}" data-slug="${esc(s.repo)}" aria-label="Salin perintah pasang ${esc(s.repo)}">Salin</button></div>
      <a class="s-gh" href="https://github.com/${esc(s.repo)}" target="_blank" rel="noopener">Buka di GitHub ↗</a>
    </article>`;
  }
  function tampil() {
    let L = D.skill.filter((s) => (kat === "semua" || s.kat === kat) && (!lab || (s.label || []).includes(lab)));
    L.sort((a, b) => (b.buatan ? 1 : 0) - (a.buatan ? 1 : 0) || (urut === "update" ? String(b.update).localeCompare(String(a.update)) : (b[urut] || 0) - (a[urut] || 0)));
    $("#s-grid").innerHTML = L.map(kartu).join("") || `<p class="s-kosong">Belum ada skill dengan filter ini.</p>`;
    $("#s-jumlah").textContent = `${L.length} skill`;
    filter();
  }
  document.addEventListener("click", (e) => {
    const k = e.target.closest("[data-kat]"); if (k && k.tagName === "BUTTON") { kat = k.dataset.kat; tampil(); }
    const l = e.target.closest("[data-lab]"); if (l) { lab = lab === l.dataset.lab ? "" : l.dataset.lab; tampil(); }
    const u = e.target.closest("[data-unduh]"); if (u) catat(u.dataset.unduh);
    const c = e.target.closest("[data-salin]"); if (c) { salin(c.dataset.salin); catat(c.dataset.slug); const t = c.textContent; c.textContent = "Tersalin ✓"; setTimeout(() => (c.textContent = t), 1600); toast("Perintah disalin. Tempel di terminal folder proyekmu."); }
  });
  $("#s-urut").addEventListener("change", (e) => { urut = e.target.value; tampil(); });
  tampil();

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("muncul"); io.unobserve(x.target); } }), { rootMargin: "0px 0px -8% 0px" });
    const amati = () => document.querySelectorAll(".s-kartu:not(.muncul), .s-pkt:not(.muncul)").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 60 + "ms"; io.observe(el); });
    amati(); new MutationObserver(amati).observe($("#s-grid"), { childList: true });
  } else document.documentElement.classList.add("tanpa-gerak");
})();
