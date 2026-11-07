"""Kumpulkan semua prompt yang sudah tayang jadi web/studio/data/prompt.js (dipakai halaman studio).
Sumber: hasil/unggah/<slug>/komentar-disematkan.txt + caption.txt, dan halaman lama prompt/<id>.html.
Pakai: python3 web/studio/buat_data.py [folder hasil/unggah] [folder prompt lama]"""
import re, sys, json, html, pathlib
akar = pathlib.Path(__file__).parent
unggah = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path.home() / "Developer/maliki-motion/hasil/unggah")
lama = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else akar / "prompt"

SERI = [  # awalan slug → (id seri, nama, warna)
    ("kelas-umkm", "umkm", "Kelas AI UMKM"), ("kelas-p", "umkm", "Kelas AI UMKM"),
    ("kelas-24jam", "24jam", "Usaha Jalan 24 Jam"), ("kelas-agentic", "agentic", "Kelas Agentic AI"),
    ("agentic", "agentic", "Kelas Agentic AI"), ("kelas-kerja", "kerja", "Cari Kerja Pakai AI"),
    ("balas", "balas", "Balas Komentar"), ("tutor", "tutor", "Tutor AI Praktis"),
]

def seri(slug):
    for awal, sid, nama in SERI:
        if slug.startswith(awal): return sid, nama
    return "tutor", "Tutor AI Praktis"

def bersih_judul(t):
    t = re.sub(r"\s*(Step by step|step by step).*$", "", t)
    return re.sub(r"[\s👇🎁⚡💬📄🎤😴🛠️🤯💻➡️📱�]+$", "", t).strip()

hasil, sudah = [], set()
for d in sorted(unggah.iterdir()):
    k = d / "komentar-disematkan.txt"
    if not k.is_file(): continue
    dasar = d.name.removesuffix("-lengkap")
    if dasar in sudah: continue
    if (unggah / f"{dasar}-lengkap" / k.name).is_file(): d, k = unggah / f"{dasar}-lengkap", unggah / f"{dasar}-lengkap" / k.name
    sudah.add(dasar)
    teks = k.read_text().strip()
    baris = teks.splitlines()
    label = re.sub(r"^📌\s*", "", baris[0]).strip()
    isi = "\n".join(baris[1:]).strip()
    cap = (d / "caption.txt").read_text().strip().splitlines() if (d / "caption.txt").is_file() else [label]
    tentang = [b for b in cap[1:] if b.strip() and not b.startswith("#") and "Narasi" not in b and not b.startswith("@")][:3]
    sid, nama = seri(dasar)
    hasil.append({"id": dasar, "seri": sid, "namaSeri": nama, "judul": bersih_judul(cap[0]), "label": label,
                  "prompt": isi, "tentang": tentang, "lengkap": d.name.endswith("-lengkap")})

if lama.is_dir():
    for f in sorted(lama.glob("*.html")):
        if f.name == "index.html": continue
        s = f.read_text()
        h2 = re.findall(r"<h2[^>]*>(.*?)</h2>", s, re.S)
        pre = re.findall(r"<pre[^>]*>(.*?)</pre>", s, re.S)
        if not (h2 and pre): continue
        bersih = lambda x: html.unescape(re.sub(r"<[^>]+>", "", x)).strip()
        hasil.append({"id": f.stem, "seri": "tutor", "namaSeri": "Tutor AI Praktis", "judul": bersih(h2[0]),
                      "label": "Prompt lengkap", "prompt": bersih(pre[0]), "tentang": [], "halaman": f"prompt/{f.name}"})

(akar / "data" / "prompt.js").write_text("window.PROMPT = " + json.dumps(hasil, ensure_ascii=False, indent=1) + ";\n")
print(len(hasil), "prompt →", akar / "data/prompt.js")
