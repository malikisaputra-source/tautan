/* Live count: kunjungan situs & total unduhan (Supabase RPC yang sama dengan /kode).
   Kunjungan dicatat sekali per sesi sebagai catat('_situs','lihat'); angka diperbarui tiap 20 detik. */
(() => {
  const SB = "https://qsoejsauqlfkchxtnumm.supabase.co", KEY = "sb_publishable_vYBTYgHNwLIC1Q-4hHzeMA_OGQdPnWW";
  // titik awal: klik link bio Instagram 1 Jan–10 Nov 2026 (Meta Business Suite) — sebelum penghitung situs ada
  const AWAL = 444;
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
      const rows = await r.json(); let k, u = 0;
      k = AWAL; rows.forEach((x) => { if (x.slug === "_situs") k += +x.lihat; else u += (+x.zip) + (+x.skill); });
      wadah.forEach((w) => { w.hidden = false;
        hitungKe(w.querySelector("[data-live-k]"), nilai.kunjungan, k); hitungKe(w.querySelector("[data-live-u]"), nilai.unduhan, u); });
      nilai.kunjungan = k; nilai.unduhan = u;
    } catch (_) {}
  }
  muat();
  let iv = setInterval(muat, 20000);
  document.addEventListener("visibilitychange", () => { clearInterval(iv); if (!document.hidden) { muat(); iv = setInterval(muat, 20000); } });
})();

/* Pengumuman fitur baru: kartu kecil kanan bawah, bisa ditutup (diingat per browser). */
(() => {
  const ID = "ms-umum-prd-1";
  if (/\/prd\//.test(location.pathname)) return;
  try { if (localStorage.getItem(ID)) return; } catch (_) {}
  const s = document.querySelector('script[src*="live.js"]'); if (!s) return;
  const akar = s.getAttribute("src").replace(/live\.js.*$/, "");
  const a = document.createElement("aside");
  a.className = "umum"; a.setAttribute("aria-label", "Fitur baru");
  a.innerHTML = `<span class="umum-tag">BARU · GRATIS</span><b>Pembuat PRD</b><p>Isi form singkat, dapat PRD + daftar task siap tempel ke ChatGPT, Claude, GLM, atau DeepSeek. Hasil AI gratis jadi rapi & tidak mengarang.</p><div class="umum-aksi"><a class="tombol kecil" href="${akar}prd/">Coba sekarang →</a><button type="button" class="umum-tutup" aria-label="Tutup pengumuman">×</button></div>`;
  const tutup = () => { a.classList.remove("tampil"); try { localStorage.setItem(ID, "1"); } catch (_) {} setTimeout(() => a.remove(), 400); };
  a.querySelector(".umum-tutup").addEventListener("click", tutup);
  a.querySelector("a").addEventListener("click", () => { try { localStorage.setItem(ID, "1"); } catch (_) {} });
  document.body.append(a);
  setTimeout(() => a.classList.add("tampil"), 1800);
})();

/* Tab bar bawah di HP: menu atas menyembunyikan tautan di layar kecil, jadi navigasi utama pindah ke sini. */
(() => {
  const s = document.querySelector('script[src*="live.js"]'); if (!s) return;
  const akar = s.getAttribute("src").replace(/live\.js.*$/, "");
  const p = location.pathname;
  const T = [
    ["kode/", "Source Code", '<path d="M8 6 2 12l6 6M16 6l6 6-6 6"/>', /\/kode\//],
    ["#perpustakaan", "Prompt", '<path d="M4 17l6-5-6-5M12 19h8"/>', null],
    ["skill/", "Skill", '<path d="M12 3l2.6 5.4 5.9.9-4.3 4.1 1 5.9L12 16.6 6.8 19.3l1-5.9L3.5 9.3l5.9-.9z"/>', /\/skill\//],
    ["prd/", "PRD", '<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>', /\/prd\//],
  ];
  const nav = document.createElement("nav");
  nav.className = "tab-bawah"; nav.setAttribute("aria-label", "Navigasi utama (HP)");
  const diBeranda = !/\/(kode|skill|prd)\//.test(p);
  nav.innerHTML = T.map(([h, l, ik, re]) => {
    const href = h.startsWith("#") ? (diBeranda ? h : akar + h) : akar + h;
    const aktif = re ? re.test(p) : false;
    return `<a href="${href}"${aktif ? ' aria-current="page"' : ""}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ik}</svg><span>${l}</span></a>`;
  }).join("");
  document.body.append(nav);
  document.documentElement.classList.add("ada-tab-bawah");
  /* pil LIVE di HP: tampil hanya di dekat puncak laman supaya tidak menutupi isi */
  const pil = document.querySelector(".live-melayang");
  if (pil) { const f = () => pil.classList.toggle("sembunyi-hp", scrollY > 240); addEventListener("scroll", f, { passive: true }); f(); }
})();
