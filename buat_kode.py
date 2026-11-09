#!/usr/bin/env python3
"""Kumpulkan kode/*/meta.json dari repo jadi data/kode.js + salin ss.png ke kode/img/."""
import json, pathlib, shutil
SINI = pathlib.Path(__file__).resolve().parent
AKAR = SINI.parent.parent / "kode"
GH = "https://github.com/malikisaputra-source/"
ANTRE = json.loads((AKAR / "antrean.json").read_text()) if (AKAR / "antrean.json").exists() else {}
import datetime
def _tanggal(jd, n=80):
    if not jd: return []
    t0 = datetime.date.fromisoformat(jd["mulai"]); hari = set(jd.get("hari", [0, 3])); out = []; t = t0
    while len(out) < n:
        if t.weekday() in hari: out.append(t.isoformat())
        t += datetime.timedelta(days=1)
    return out
TANGGAL = _tanggal(ANTRE.get("jadwal"))
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
    grp = next((g for g, l in ANTRE.get("antrean", {}).items() if slug in l), None)
    if grp:
        i = ANTRE["antrean"][grp].index(slug); jd = ANTRE.get("jadwal", {})
        tgl = TANGGAL[i] if i < len(TANGGAL) else None
        if tgl: d["kunci"] = tgl
    rg = d.pop("repo_github", None) or slug
    d["repo"] = GH + rg
    d["zip"] = GH + rg + "/archive/refs/heads/main.zip"
    daftar.append(d)
(SINI / "data" / "kode.js").write_text("window.KODE = " + json.dumps(daftar, ensure_ascii=False, indent=1) + ";\n")
print(len(daftar), "paket")
import subprocess; subprocess.run(["python3", str(SINI / "buat_laman.py")], check=True)
