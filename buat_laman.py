#!/usr/bin/env python3
"""Buat laman /kode/agent/ dan /kode/video/ dari kode/index.html (satu sumber, beda isi hero & saringan)."""
import pathlib, re
SINI = pathlib.Path(__file__).resolve().parent
import time
VER = time.strftime("%Y%m%d%H%M")
sumber = (SINI / "kode" / "index.html").read_text()
LAMAN = {
  "agent": dict(title="AI Agent Gratis · Maliki Studio",
    desc="Paket AI agent siap pakai dari Maliki Studio: kantor AI 3D, agent untuk UMKM, jalan gratis di Antigravity CLI.",
    h1="AI agent yang siap kerja untuk usahamu.",
    sub="Paket agent siap pakai, lengkap dengan kantor AI 3D dan panduan pasang. Jalan gratis, tinggal sesuaikan dengan usahamu."),
  "video": dict(title="Template Video Gratis · Maliki Studio",
    desc="Template video berbasis kode dari Maliki Studio: reels tutorial 9:16 dengan Remotion. Gratis.",
    h1="Template video yang siap kamu render.",
    sub="Template video berbasis kode untuk reels dan tutorial. Ganti teks di satu berkas, render, langsung posting."),
}
def geser(m):
  attr, u = m.group(1), m.group(2)
  if re.match(r"^(#|https?:|/|mailto:|data:|javascript:)", u): return m.group(0)
  if u in ("./", ""): u = ""
  return f'{attr}="../{u}"'
for nama, v in LAMAN.items():
  t = re.sub(r'\b(href|src)="([^"]*)"', geser, sumber)
  t = t.replace('<body data-laman="web"', f'<body data-laman="{nama}" data-akar="../"', 1)
  t = re.sub(r"<title>.*?</title>", f"<title>{v['title']}</title>", t, 1)
  t = re.sub(r'(<meta name="description" content=")[^"]*', r"\g<1>" + v["desc"], t, 1)
  t = re.sub(r'(<meta property="og:title" content=")[^"]*', r"\g<1>" + v["title"], t, 1)
  t = re.sub(r'(<meta property="og:description" content=")[^"]*', r"\g<1>" + v["desc"], t, 1)
  t = re.sub(r'(<h1 id="k-judul"[^>]*>).*?(</h1>)', r"\g<1>" + v["h1"] + r"\g<2>", t, 1)
  t = re.sub(r'(<p class="sub">).*?(</p>)', r"\g<1>" + v["sub"] + r"\g<2>", t, 1)
  # hero khusus per laman: kode/<laman>/hero.css + hero.js mengisi #hero-khusus
  t = t.replace('<section class="k-hero" aria-labelledby="k-judul">', '<section class="k-hero" aria-labelledby="k-judul">\n  <div class="hero-khusus" id="hero-khusus"></div>', 1)
  t = t.replace("</head>", '<link rel="stylesheet" href="hero.css?v=' + VER + '">\n</head>', 1)
  t = t.replace("</body>", '<script src="hero.js?v=' + VER + '" defer></script>\n</body>', 1)
  (SINI / "kode" / nama).mkdir(exist_ok=True)
  (SINI / "kode" / nama / "index.html").write_text(t)
print("laman:", ", ".join(LAMAN))
