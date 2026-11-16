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
