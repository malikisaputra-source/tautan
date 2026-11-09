#!/usr/bin/env python3
"""Kumpulkan kode/*/meta.json dari repo jadi data/kode.js + salin ss.png ke kode/img/."""
import json, pathlib, shutil
SINI = pathlib.Path(__file__).resolve().parent
AKAR = SINI.parent.parent / "kode"
GH = "https://github.com/malikisaputra-source/"
daftar = []
for m in sorted(AKAR.glob("*/meta.json")):
    d = json.loads(m.read_text())
    slug = d.get("slug") or m.parent.name
    d["slug"] = slug
    ss = m.parent / "ss.png"
    if ss.exists():
        from PIL import Image
        im = Image.open(ss).convert("RGB"); im.thumbnail((960, 1600))
        im.save(SINI / "kode" / "img" / f"{slug}.webp", "WEBP", quality=78, method=6); d["gambar"] = f"img/{slug}.webp"
    if d.get("kunci"):
        d.pop("berkas", None); d.pop("unduhan_lain", None); d["kustom"] = False
        lama = SINI / "kode" / "paket" / slug
        if lama.exists(): shutil.rmtree(lama)
    if d.get("kustom"):
        tujuan = SINI / "kode" / "paket" / slug
        if tujuan.exists(): shutil.rmtree(tujuan)
        for b in d.get("berkas", []):
            src = m.parent / b
            if src.is_file():
                (tujuan / b).parent.mkdir(parents=True, exist_ok=True); shutil.copy(src, tujuan / b)
        d["dasar"] = f"paket/{slug}/"
    d["repo"] = GH + slug
    d["zip"] = GH + slug + "/archive/refs/heads/main.zip"
    daftar.append(d)
(SINI / "data" / "kode.js").write_text("window.KODE = " + json.dumps(daftar, ensure_ascii=False, indent=1) + ";\n")
print(len(daftar), "paket")
import subprocess; subprocess.run(["python3", str(SINI / "buat_laman.py")], check=True)
