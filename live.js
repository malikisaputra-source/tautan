/* Live count: kunjungan situs & total unduhan (Supabase RPC yang sama dengan /kode).
   Kunjungan dicatat sekali per sesi sebagai catat('_situs','lihat'); angka diperbarui tiap 20 detik. */
(() => {
  const SB = "https://qsoejsauqlfkchxtnumm.supabase.co", KEY = "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW";
  const H = { apikey: KEY, "Content-Type": "application/json" };
  const wadah = [...document.querySelectorAll("[data-live]")];
  try { if (!sessionStorage.getItem("ms-kunjung")) { sessionStorage.setItem("ms-kunjung", "1");
    fetch(SB + "/rest/v1/rpc/catat", { method: "POST", headers: H, body: JSON.stringify({ p_slug: "_situs", p_jenis: "lihat" }), keepalive: true }); } } catch (_) {}
  if (!wadah.length) return;
  const kurang = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => n.toLocaleString("id-ID");
  const nilai = { kunjungan: 0, unduhan: 0 };
  function hitungKe(el, dari, ke) {
    if (kurang || dari === ke) { el.textContent = fmt(ke); return; }
    const t0 = performance.now(), d = dari === 0 ? 1200 : 600;
    const f = (t) => { const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(dari + (ke - dari) * e)); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
    if (dari) { el.classList.remove("naik"); void el.offsetWidth; el.classList.add("naik"); }
  }
  async function muat() {
    try {
      const r = await fetch(SB + "/rest/v1/rpc/ringkasan", { method: "POST", headers: H, body: "{}" }); if (!r.ok) return;
      const rows = await r.json(); let k = 0, u = 0;
      rows.forEach((x) => { if (x.slug === "_situs") k += +x.lihat; else u += (+x.zip) + (+x.skill); });
      wadah.forEach((w) => { w.hidden = false;
        hitungKe(w.querySelector("[data-live-k]"), nilai.kunjungan, k); hitungKe(w.querySelector("[data-live-u]"), nilai.unduhan, u); });
      nilai.kunjungan = k; nilai.unduhan = u;
    } catch (_) {}
  }
  muat();
  let iv = setInterval(muat, 20000);
  document.addEventListener("visibilitychange", () => { clearInterval(iv); if (!document.hidden) { muat(); iv = setInterval(muat, 20000); } });
})();
