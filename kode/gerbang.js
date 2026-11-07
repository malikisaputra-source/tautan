/* Gerbang follow (berbasis kepercayaan): sebelum unduh, minta follow TikTok & Instagram.
   Tidak bisa memverifikasi follow sungguhan; status diingat di browser pengunjung. */
(() => {
  const KUNCI = "ms-sudah-follow";
  const AKUN = {
    tt: { url: "https://www.tiktok.com/@malikifsaputra", nama: "TikTok", label: "@malikifsaputra" },
    ig: { url: "https://www.instagram.com/malikisaputra", nama: "Instagram", label: "@malikisaputra" },
  };
  const kurang = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sudah = () => { try { return localStorage.getItem(KUNCI) === "1"; } catch (_) { return false; } };
  let lanjut = null, slug = null, asal = null, diklik = { tt: false, ig: false };

  const el = document.createElement("div");
  el.className = "g-latar"; el.hidden = true;
  el.innerHTML = `
  <div class="g-kotak" role="dialog" aria-modal="true" aria-labelledby="g-judul" aria-describedby="g-ket">
    <button class="g-tutup" type="button" aria-label="Tutup">✕</button>
    <p class="g-eyebrow">Satu langkah lagi</p>
    <h2 id="g-judul">Follow dulu ya, habis itu langsung unduh</h2>
    <p id="g-ket" class="g-ket">Source code ini gratis. Bayarnya cukup follow, biar kamu juga dapat kabar tiap ada paket baru.</p>
    <div class="g-daftar">
      ${Object.entries(AKUN).map(([k, a]) => `
      <a class="g-akun" data-akun="${k}" href="${a.url}" target="_blank" rel="noopener">
        <span class="g-ikon g-${k}" aria-hidden="true">${k === "tt" ? "TT" : "IG"}</span>
        <span class="g-teks"><b>Follow ${a.nama}</b><small>${a.label}</small></span>
        <span class="g-status" aria-live="polite">Buka</span>
      </a>`).join("")}
    </div>
    <button class="tombol g-unduh" type="button" disabled>Follow dua-duanya dulu</button>
    <p class="g-kecil">Sudah follow dari dulu? Klik saja dua tombol di atas untuk membuka profilnya.</p>
  </div>`;
  document.body.append(el);
  const $ = (s) => el.querySelector(s);

  function segarkan() {
    el.querySelectorAll(".g-akun").forEach((a) => {
      const ok = diklik[a.dataset.akun];
      a.classList.toggle("ok", ok);
      a.querySelector(".g-status").textContent = ok ? "Sudah ✓" : "Buka";
    });
    const siap = diklik.tt && diklik.ig, b = $(".g-unduh");
    b.disabled = !siap; b.textContent = siap ? "Unduh sekarang" : diklik.tt || diklik.ig ? "Tinggal satu lagi" : "Follow dua-duanya dulu";
    if (siap && !kurang && window.gsap) gsap.fromTo(b, { scale: .94 }, { scale: 1, duration: .5, ease: "elastic.out(1,.45)" });
  }
  el.querySelectorAll(".g-akun").forEach((a) => a.addEventListener("click", () => {
    const k = a.dataset.akun;
    if (!diklik[k]) window.catatHitung && window.catatHitung(slug || "-", k === "tt" ? "follow_tt" : "follow_ig");
    diklik[k] = true; setTimeout(segarkan, 600);
  }));
  $(".g-unduh").addEventListener("click", () => {
    try { localStorage.setItem(KUNCI, "1"); } catch (_) {}
    const f = lanjut; tutup(); f && f();
  });
  function tutup() {
    el.hidden = true; lanjut = null;
    if (asal && asal.focus) asal.focus();
  }
  $(".g-tutup").addEventListener("click", tutup);
  el.addEventListener("click", (e) => { if (e.target === el) tutup(); });
  document.addEventListener("keydown", (e) => {
    if (el.hidden) return;
    if (e.key === "Escape") { e.stopImmediatePropagation(); tutup(); }
    if (e.key === "Tab") {
      const f = [...el.querySelectorAll("a,button:not([disabled])")];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  }, true);

  /* Panggil sebelum aksi unduh. Bila sudah follow, aksi langsung jalan. */
  window.gerbangFollow = (s, aksi) => {
    if (sudah()) { aksi(); return; }
    slug = s; lanjut = aksi; asal = document.activeElement; diklik = { tt: false, ig: false };
    segarkan(); el.hidden = false; $(".g-tutup").focus();
    if (!kurang && window.gsap) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: .25 });
      gsap.fromTo(".g-kotak", { y: 30, scale: .96 }, { y: 0, scale: 1, duration: .5, ease: "power3.out" });
      gsap.fromTo(".g-akun", { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: .4, stagger: .08, delay: .12, ease: "power2.out" });
    }
  };
})();
