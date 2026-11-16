/* Beranda: tombol unduh Studio Maliki & Maliki Agent → gerbang follow + penghitung (Supabase). */
(() => {
  document.querySelectorAll(".unduh-studio").forEach((kotak) => {
    const slug = kotak.dataset.slug; if (!slug) return;
    // hitung "dilihat" sekali saat kotak terlihat
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { window.catatHitung && window.catatHitung(slug, "lihat"); io.disconnect(); } }, { threshold: .4 });
      io.observe(kotak);
    }
    kotak.querySelectorAll(".unduh-btn").forEach((a) => {
      a.addEventListener("click", (e) => {
        const jalan = () => { window.catatHitung && window.catatHitung(slug, "zip"); location.href = a.href; };
        e.preventDefault();
        if (window.gerbangFollow) window.gerbangFollow(slug, jalan); else jalan();
      });
    });
  });
})();

/* Tampilkan "N diunduh · M dilihat" di tiap kotak unduh beranda (data Supabase, sama dengan /kode). */
(async () => {
  const kotak = [...document.querySelectorAll(".unduh-studio[data-slug]")]; if (!kotak.length) return;
  const slugs = kotak.map((k) => k.dataset.slug).filter((s) => /^[a-z0-9-]+$/.test(s));
  const rb = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".", ",") + "rb" : String(n);
  try {
    const r = await fetch("https://qsoejsauqlfkchxtnumm.supabase.co/rest/v1/rpc/ringkasan?slug=in.(" + slugs.join(",") + ")",
      { method: "POST", headers: { apikey: "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW", "Content-Type": "application/json" }, body: "{}" });
    if (!r.ok) return;
    const H = {}; (await r.json()).forEach((x) => (H[x.slug] = x));
    kotak.forEach((k) => {
      const h = H[k.dataset.slug]; if (!h || !(+h.zip || +h.lihat)) return;
      const p = document.createElement("p"); p.className = "unduh-hitung";
      p.innerHTML = `<b>${rb(+h.zip)}</b> diunduh · <b>${rb(+h.lihat)}</b> dilihat`;
      (k.querySelector(".unduh-kepala") || k).append(p);
    });
  } catch (_) {}
})();
