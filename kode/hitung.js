/* Penghitung unduhan & kunjungan (Supabase RPC). Isi URL & anon key setelah proyek dibuat. */
(() => {
  const SB_URL = "https://qsoejsauqlfkchxtnumm.supabase.co";  // proyek Supabase maliki-studio (akun Leads)
  const SB_ANON = "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW"; // kunci publishable (aman di browser; tabel dikunci, hanya RPC)
  const aktif = SB_URL && SB_ANON;
  const kepala = { apikey: SB_ANON, "Content-Type": "application/json" };
  const sudah = new Set(); // cegah hitung "lihat" ganda per kunjungan
  window.catatHitung = (slug, jenis) => {
    if (!aktif || !slug) return;
    if (jenis === "lihat") { if (sudah.has(slug)) return; sudah.add(slug); }
    try { fetch(SB_URL + "/rest/v1/rpc/catat", { method: "POST", headers: kepala, body: JSON.stringify({ p_slug: slug, p_jenis: jenis }), keepalive: true }); } catch (_) {}
    const H = window.HITUNG; const a = H[slug] || (H[slug] = { zip: 0, skill: 0, lihat: 0 }); a[jenis] = (a[jenis] || 0) + 1; window.segarkanHitung && window.segarkanHitung();
  };
  window.HITUNG = {};
  window.muatHitung = async () => {
    if (!aktif) return;
    try {
      const r = await fetch(SB_URL + "/rest/v1/rpc/ringkasan", { method: "POST", headers: kepala, body: "{}" });
      if (!r.ok) return;
      (await r.json()).forEach((x) => (window.HITUNG[x.slug] = { zip: +x.zip, skill: +x.skill, lihat: +x.lihat }));
      window.segarkanHitung && window.segarkanHitung();
    } catch (_) {}
  };
})();
