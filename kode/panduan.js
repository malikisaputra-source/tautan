/* Panduan penggunaan: panel layar penuh ala help center (riset panduan #2/#36, #20/#80, #27/#41).
   Markdown → topik (##) di daftar isi, satu topik tampil sekaligus, sub-bagian (###/####) buka-tutup,
   cara pakai AI jadi tab per alat, tombol salin, pencarian, lisensi selalu terlihat. */
(() => {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const IKON = {
    mulai: '<path d="M5 12h14M13 6l6 6-6 6"/>', fitur: '<path d="M4 12l5 5L20 6"/>', ai: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    lisensi: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>', ubah: '<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/>',
    folder: '<path d="M3 7h6l2 2h10v10H3z"/>', catatan: '<path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7"/>', umum: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5M12 16h.01"/>',
  };
  const ikonUntuk = (j) => {
    const t = j.toLowerCase();
    if (/\bai\b|claude|gpt|codex|gemini|antigravity/.test(t)) return "ai";
    if (/lisensi|kredit|license/.test(t)) return "lisensi";
    if (/fitur/.test(t)) return "fitur";
    if (/cara|mulai|menjalankan|langkah|pasang|online|jalan/.test(t)) return "mulai";
    if (/ubah|ganti|brand|warna|kustom/.test(t)) return "ubah";
    if (/struktur|folder|berkas/.test(t)) return "folder";
    if (/catatan|penting|faq|tanya|tips/.test(t)) return "catatan";
    return "umum";
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IKON[k] || IKON.umum}</svg>`;

  // markdown → { judul, intro, bagian:[{judul, intro, sub:[{judul, md}]}] }
  function urai(md) {
    const baris = md.replace(/\r/g, "").replace(/<!--[\s\S]*?-->/g, "").split("\n");
    const hasil = { judul: "", intro: [], bagian: [] }; let b = null, s = null, kode = false;
    for (const l of baris) {
      if (/^```/.test(l)) kode = !kode;
      const m = !kode && l.match(/^(#{1,4})\s+(.*)/);
      if (m && m[1].length === 1 && !hasil.judul) { hasil.judul = m[2]; continue; }
      if (m && m[1].length <= 2) { b = { judul: m[2], intro: [], sub: [] }; hasil.bagian.push(b); s = null; continue; }
      if (m && b) { s = { judul: m[2], md: [] }; b.sub.push(s); continue; }
      if (m && !b) { b = { judul: m[2], intro: [], sub: [] }; hasil.bagian.push(b); s = null; continue; }
      (s ? s.md : b ? b.intro : hasil.intro).push(l);
    }
    // gabung bagian kosong (judul kelompok) ke bagian berikutnya
    hasil.bagian = hasil.bagian.filter((x) => x.intro.join("").trim() || x.sub.length);
    return hasil;
  }

  let el, data, html, aktif = 0, asal = null, judulPaket = "";
  function pasang() {
    el = document.createElement("div");
    el.className = "pd"; el.hidden = true; el.setAttribute("data-lenis-prevent", "");
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "pd-judul");
    el.innerHTML = `<div class="pd-latar" data-tutup></div>
      <div class="pd-kotak">
        <header class="pd-atas">
          <div class="pd-judul-w"><p class="pd-kecil">Panduan penggunaan</p><h2 id="pd-judul"></h2></div>
          <label class="pd-cari"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
            <span class="sr">Cari di panduan</span><input type="search" placeholder="Cari: Claude Code, warna, backup…" autocomplete="off"></label>
          <button class="pd-tutup" type="button" data-tutup aria-label="Tutup panduan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </header>
        <div class="pd-lisensi"></div>
        <div class="pd-badan">
          <nav class="pd-nav" aria-label="Daftar isi panduan"></nav>
          <main class="pd-isi" tabindex="-1"></main>
        </div>
      </div>`;
    document.body.append(el);
    el.addEventListener("click", (e) => { if (e.target.closest("[data-tutup]")) tutup(); });
    el.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); tutup(); } });
    el.querySelector(".pd-cari input").addEventListener("input", (e) => cari(e.target.value.trim()));
  }

  function nav() {
    el.querySelector(".pd-nav").innerHTML = `<ol>${data.bagian.map((b, i) =>
      `<li><button type="button" data-i="${i}" ${i === aktif ? 'aria-current="true"' : ""}>${svg(ikonUntuk(b.judul))}<span>${esc(b.judul)}</span></button></li>`).join("")}</ol>`;
    el.querySelectorAll(".pd-nav button").forEach((b) => b.onclick = () => buka(+b.dataset.i));
  }

  const blok = (arr) => html(arr.join("\n"));
  function salinan(akar) {
    akar.querySelectorAll("pre").forEach((p) => tombolSalin(p, p.innerText.trim()));
    akar.querySelectorAll("li").forEach((li) => { const m = li.textContent.trim().match(/^["“](.+)["”]$/); if (m) { li.classList.add("pd-prompt"); tombolSalin(li, m[1]); } });
    akar.querySelectorAll("p code, li code").forEach((c) => { if (/^(claude|codex|gemini|agy|npm (install|run \w+)|git clone .+)$/.test(c.textContent.trim())) c.classList.add("pd-perintah"); });
  }
  function tombolSalin(wadah, teks) {
    const b = document.createElement("button"); b.type = "button"; b.className = "pd-salin"; b.textContent = "Salin";
    b.setAttribute("aria-label", "Salin teks ini");
    b.onclick = async () => { try { await navigator.clipboard.writeText(teks); b.textContent = "Tersalin"; } catch (_) { b.textContent = "Gagal"; } setTimeout(() => (b.textContent = "Salin"), 1600); };
    wadah.classList.add("pd-bisa-salin"); wadah.append(b);
  }

  function buka(i, subKe) {
    aktif = Math.max(0, Math.min(i, data.bagian.length - 1));
    const b = data.bagian[aktif], isi = el.querySelector(".pd-isi");
    el.querySelector(".pd-cari input").value = "";
    const tabAI = b.sub.filter((s) => /^cara\s*\d/i.test(s.judul)).length >= 2;
    let h = `<p class="pd-langkah">Topik ${aktif + 1} dari ${data.bagian.length}</p><h3 class="pd-h">${svg(ikonUntuk(b.judul))}${esc(b.judul)}</h3>`;
    if (b.intro.join("").trim()) h += `<div class="pd-intro">${blok(b.intro)}</div>`;
    if (aktif === 0 && data.bagian.length > 1) {
      h += `<p class="pd-pilih">Mau ngapain? Langsung pilih:</p><div class="pd-kartu">${data.bagian.slice(1).map((x, j) => {
        const ai = /pakai ai/i.test(x.judul);
        return `<button type="button" data-ke="${j + 1}" class="${ai ? "ai" : ""}">${svg(ikonUntuk(x.judul))}<b>${esc(ai ? "Ubah sendiri pakai AI" : x.judul)}</b>${ai ? "<small>ChatGPT · Claude · Claude Code · Codex · Antigravity · Gemini</small>" : ""}</button>`;
      }).join("")}</div>`;
    }
    if (tabAI) {
      const cara = b.sub.filter((s) => /^cara\s*\d/i.test(s.judul)), lain = b.sub.filter((s) => !/^cara\s*\d/i.test(s.judul));
      h += `<p class="pd-pilih">Pilih alat yang kamu pakai:</p><div class="pd-tab" role="tablist">${cara.map((s, k) => {
        const [, nama, ket] = s.judul.match(/^cara\s*\d+\s*:\s*([^(]+)\s*(?:\((.*)\))?/i) || [, s.judul, ""];
        return `<button role="tab" type="button" id="pd-t${k}" aria-controls="pd-p${k}" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}"><b>${esc(nama.trim())}</b>${ket ? `<small>${esc(ket)}</small>` : ""}</button>`;
      }).join("")}</div>${cara.map((s, k) => `<div class="pd-panel" role="tabpanel" id="pd-p${k}" aria-labelledby="pd-t${k}" ${k ? "hidden" : ""}>${blok(s.md)}</div>`).join("")}`;
      h += lain.map((s) => `<details class="pd-sub"><summary>${esc(s.judul)}</summary><div>${blok(s.md)}</div></details>`).join("");
    } else {
      h += b.sub.map((s, k) => `<details class="pd-sub${/lisensi|kredit/i.test(s.judul) ? " sorot" : ""}" ${k === (subKe ?? 0) || /lisensi|kredit/i.test(s.judul) ? "open" : ""}><summary>${esc(s.judul)}</summary><div>${blok(s.md)}</div></details>`).join("");
    }
    const sbl = data.bagian[aktif - 1], brk = data.bagian[aktif + 1];
    h += `<div class="pd-maju">${sbl ? `<button type="button" data-ke="${aktif - 1}"><small>Sebelumnya</small>${esc(sbl.judul)}</button>` : "<span></span>"}${brk ? `<button type="button" class="kanan" data-ke="${aktif + 1}"><small>Berikutnya</small>${esc(brk.judul)}</button>` : ""}</div>`;
    isi.innerHTML = h;
    // tandai bagian lisensi
    if (/lisensi|kredit/i.test(b.judul)) isi.querySelector(".pd-intro")?.classList.add("sorot");
    isi.querySelectorAll("ol").forEach((o) => o.classList.add("pd-ol"));
    salinan(isi);
    isi.querySelectorAll("[data-ke]").forEach((x) => x.onclick = () => { buka(+x.dataset.ke); isi.focus(); });
    const tabs = [...isi.querySelectorAll('[role="tab"]')];
    tabs.forEach((t, k) => {
      t.onclick = () => pilihTab(tabs, k);
      t.onkeydown = (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = (k + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; pilihTab(tabs, n); tabs[n].focus(); } };
    });
    isi.scrollTop = 0; nav();
    el.querySelector(`.pd-nav [data-i="${aktif}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function pilihTab(tabs, k) {
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === k); t.tabIndex = j === k ? 0 : -1; el.querySelector("#" + t.getAttribute("aria-controls")).hidden = j !== k; });
  }

  function cari(q) {
    if (!q) return buka(aktif);
    const isi = el.querySelector(".pd-isi"), kecil = q.toLowerCase(), hasil = [];
    data.bagian.forEach((b, i) => {
      const cek = (judul, teks, k) => { const t = (judul + " " + teks).toLowerCase(), p = t.indexOf(kecil); if (p >= 0) hasil.push({ i, k, judul, cuplik: (judul + " " + teks).replace(/[#*`>|]/g, "").slice(Math.max(0, p - 50), p + 110) }); };
      cek(b.judul, b.intro.join(" "), undefined);
      b.sub.forEach((s, k) => cek(b.judul + " › " + s.judul, s.md.join(" "), k));
    });
    const tanda = (t) => esc(t).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), (m) => `<mark>${m}</mark>`);
    isi.innerHTML = `<p class="pd-langkah">${hasil.length} hasil untuk “${esc(q)}”</p>` + (hasil.length ? `<ul class="pd-hasil">${hasil.slice(0, 30).map((h) =>
      `<li><button type="button" data-i="${h.i}" data-k="${h.k ?? ""}"><b>${tanda(h.judul)}</b><span>…${tanda(h.cuplik)}…</span></button></li>`).join("")}</ul>` : `<p class="pd-kosong">Tidak ketemu. Coba kata lain, atau tanya di komentar TikTok @malikisaputra.</p>`);
    isi.querySelectorAll(".pd-hasil button").forEach((b) => b.onclick = () => buka(+b.dataset.i, b.dataset.k === "" ? undefined : +b.dataset.k));
  }

  function tutup() {
    el.hidden = true; document.documentElement.classList.remove("pd-terbuka");
    asal && asal.focus();
  }

  window.bukaPanduan = (d, md, kredit, render) => {
    if (!el) pasang();
    html = render; asal = document.activeElement; judulPaket = d.judul;
    data = urai(md || (d.cara || []).map((c, i) => `${i + 1}. ${c}`).join("\n"));
    if (!data.bagian.length) data.bagian = [{ judul: "Cara pakai", intro: data.intro, sub: [] }], data.intro = [];
    else if (data.intro.join("").trim()) data.bagian.unshift({ judul: "Tentang", intro: data.intro, sub: [] });
    // topik AI dipindah ke urutan kedua biar cepat ketemu; lisensi selalu di akhir
    // topik lama "Ubah pakai Claude" / "Mau hasil lebih maksimal?" digabung ke topik AI biar tidak dobel
    const ai = data.bagian.find((b) => /pakai ai/i.test(b.judul));
    if (ai) {
      ai.judul = "Ubah pakai AI (ChatGPT, Claude, Codex, Antigravity)";
      data.bagian = data.bagian.filter((b) => {
        if (b !== ai && /ubah pakai claude|lebih maksimal/i.test(b.judul)) {
          ai.sub.push({ judul: /claude/i.test(b.judul) ? "Pakai skill Claude bawaan paket" : b.judul, md: b.intro.concat(...b.sub.map((s) => ["", "**" + s.judul + "**", ...s.md])) });
          return false;
        }
        return true;
      });
    }
    const iAI = data.bagian.findIndex((b) => /pakai ai/i.test(b.judul));
    if (iAI > 1) data.bagian.splice(1, 0, data.bagian.splice(iAI, 1)[0]);
    const iL = data.bagian.findIndex((b) => /^lisensi/i.test(b.judul));
    if (iL >= 0) data.bagian.push(data.bagian.splice(iL, 1)[0]);
    el.querySelector("#pd-judul").textContent = judulPaket;
    const lis = el.querySelector(".pd-lisensi"); lis.innerHTML = kredit;
    const kk = lis.querySelector(".kd-kredit");
    if (kk) { kk.setAttribute("role", "button"); kk.tabIndex = 0; kk.setAttribute("aria-expanded", "false");
      const bal = () => kk.setAttribute("aria-expanded", kk.classList.toggle("buka"));
      kk.onclick = bal; kk.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bal(); } }; }
    el.hidden = false; document.documentElement.classList.add("pd-terbuka");
    buka(0);
    el.querySelector(".pd-tutup").focus();
  };
})();
