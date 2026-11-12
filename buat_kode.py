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
import subprocess as _sp
_sp.run(["python3", str(AKAR / "buat_profil.py")], check=True, stdout=_sp.DEVNULL)
_pt = (SINI / "data" / "prd-profil.js").read_text()
_prof = json.loads(_pt[_pt.index("{"):_pt.rindex("}") + 1])
for d in daftar:
    if d["slug"] in _prof and not d.get("kunci"): d["prd"] = True
(SINI / "data" / "kode.js").write_text("window.KODE = " + json.dumps(daftar, ensure_ascii=False, indent=1) + ";\n")
_buka = [d for d in daftar if not d.get("kunci")]
(SINI / "data" / "ringkas.js").write_text("window.RINGKAS = " + json.dumps({
    "kode": len(daftar), "terbuka": len(_buka),
    "gambar": [d["gambar"] for d in _buka if d.get("gambar")][:8],
    "unggulan": [{"slug": d["slug"], "judul": d["judul"], "gambar": d.get("gambar"), "kategori": d.get("kategori")} for d in sorted(_buka, key=lambda d: (d.get("tier") != "premium", d["slug"])) if d.get("gambar")][:3]}, ensure_ascii=False) + ";\n")
print(len(daftar), "paket")
import subprocess; subprocess.run(["python3", str(SINI / "buat_laman.py")], check=True)
subprocess.run(["python3", str(AKAR / "buat_skill.py")], check=False, stdout=subprocess.DEVNULL)
