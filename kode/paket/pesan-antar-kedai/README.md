# Pesan Antar Kedai

Aplikasi pesan antar ala GoFood untuk kedai yang punya **kurir sendiri**. Pembeli memilih menu, menandai rumah di peta, lalu **menawar ongkir lewat chat**. Kedai menjawab dengan satu ketukan ("Setuju Rp…" / "Tawar balik"), menugaskan kurir, dan kurir mengantar sambil menerima uang COD.

Satu app statis berisi tiga sudut: **Pembeli**, **Kedai**, dan **Kurir**. Tanpa server, tanpa build.

## Fitur
- **Pembeli**: menu bergambar (SVG buatan sendiri), cari & kategori, stok "sisa 4"/"habis", keranjang, alamat + **pin peta** (Leaflet + OpenStreetMap) dengan jarak & saran ongkir, tawar ongkir, chat dengan kedai, status bertahap, peta pelacakan kurir + perkiraan tiba.
- **Kedai/Admin**: pesanan masuk (saring aktif/baru/diantar/riwayat), terima/tolak dengan alasan, balas tawaran ongkir dengan tombol cepat, balasan chat cepat, mulai masak, tugaskan kurir, kelola menu & stok, laporan omzet 7 hari, menu terlaris, hasil tawar ongkir, setoran COD per kurir, pengaturan tarif ongkir & kurir, unduh CSV.
- **Kurir**: daftar antaran, ambil & mulai antar, **buka rute di Google Maps**, telepon/WA pembeli, selesai + terima COD dengan hitung kembalian, rekap uang COD yang harus disetor.
- **WhatsApp cadangan**: ringkasan pesanan berformat dikirim lewat `wa.me` (pembeli → kedai, kedai → pembeli, kurir → pembeli/kedai).
- Mode terang/gelap, rapi di HP & laptop, animasi halus (mati otomatis bila perangkat minta gerak dikurangi).

## Cara menjalankan (pemula)
1. Unduh ZIP, ekstrak.
2. Klik dua kali `index.html` (Chrome/Edge/Firefox). Peta butuh internet; tanpa internet muncul peta sederhana.
3. Di bagian atas pilih **Pembeli**, **Kedai**, atau **Kurir**.
4. Coba alurnya: tekan ikon "buka di tab baru" (kanan atas) untuk membuka sudut lain. Pesan dari tab Pembeli langsung muncul di tab Kedai, dan seterusnya (sinkron lewat `BroadcastChannel`).
5. Ganti nomor WA kedai, alamat, tarif ongkir, dan daftar kurir di **Kedai › Atur**.
6. Tautan langsung per sudut: `index.html?peran=pembeli`, `?peran=kedai`, `?peran=kurir`.

> Penting: versi ini menyimpan data di **browser satu perangkat** (localStorage). Tab-tab di laptop yang sama saling sinkron, tapi HP pembeli dan HP kurir **tidak** terhubung. Untuk dipakai sungguhan di banyak HP, lihat bagian berikut.

## Jadikan multi-perangkat sungguhan (Supabase atau Firebase)
Semua baca/tulis data lewat dua fungsi di `app.js`: `muat()` dan `simpan(info)`, plus pendengar `kanal.onmessage`. Ganti tiga titik itu dengan database realtime.

### Opsi A — Supabase (Postgres + Realtime, ada paket gratis)
1. Buat proyek di supabase.com, buka **SQL Editor**, jalankan skema contoh:
```sql
create table menu (
  id text primary key, nama text not null, kat text, harga int not null,
  stok int default 0, gambar text, ket text, aktif boolean default true
);
create table kurir (id text primary key, nama text, hp text, kendaraan text, user_id uuid);
create table pesanan (
  id text primary key, kode text unique, waktu timestamptz default now(),
  status text default 'baru',              -- baru|diterima|dimasak|siap|diantar|selesai|ditolak
  bayar text, kurir_id text references kurir(id),
  pembeli jsonb,                           -- {nama,hp,alamat,catatan,lat,lng}
  item jsonb, subtotal int,
  ongkir jsonb,                            -- {saran,usul,oleh,sepakat,final}
  cod jsonb, setor boolean default false, waktu_antar timestamptz, alasan text
);
create table chat (
  id bigserial primary key, pesanan_id text references pesanan(id) on delete cascade,
  dari text, tipe text, teks text, nominal int, waktu timestamptz default now()
);
alter publication supabase_realtime add table pesanan, chat, menu;
```
2. Aktifkan **Row Level Security** dan buat aturan: pembeli hanya membaca pesanan miliknya (mis. lewat `auth.uid()` atau token rahasia per pesanan), kurir hanya pesanan yang `kurir_id`-nya dia, admin kedai semua. Jangan biarkan tabel terbuka untuk publik.
3. Tambahkan di `index.html` sebelum `app.js`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
```
4. Di `app.js`, ganti sinkron lokal:
```js
const sb = supabase.createClient('https://PROYEKMU.supabase.co', 'ANON_KEY_PUBLIK');
async function muatServer() {
  const [m, k, p, c] = await Promise.all([
    sb.from('menu').select('*'), sb.from('kurir').select('*'),
    sb.from('pesanan').select('*').order('waktu', { ascending: false }).limit(200),
    sb.from('chat').select('*').order('waktu')
  ]);
  // susun ulang ke bentuk D (lihat dataContoh) lalu render()
}
sb.channel('kedai').on('postgres_changes', { event: '*', schema: 'public' }, muatServer).subscribe();
// simpan(): ganti localStorage dengan sb.from('pesanan').upsert(...) / sb.from('chat').insert(...)
```
5. Pisahkan sudut ke tiga alamat (mis. `?peran=kedai` hanya untuk admin yang login lewat Supabase Auth).

### Opsi B — Firebase (Firestore)
Koleksi yang setara: `menu/{id}`, `kurir/{id}`, `pesanan/{id}` (field sama seperti di atas) dan subkoleksi `pesanan/{id}/chat/{auto}`. Dengarkan perubahan dengan `onSnapshot(collection(db,'pesanan'), …)` lalu `render()`. Lindungi dengan **Security Rules** (pembeli hanya dokumen miliknya, kurir hanya yang ditugaskan).

Tips: stok sebaiknya dikurangi di server (fungsi Postgres/Cloud Function) supaya dua pembeli tidak membeli porsi terakhir yang sama.

## Struktur folder
```
pesan-antar-kedai/
├─ index.html     kerangka, ikon SVG, pemilih sudut, dialog
├─ style.css      tampilan (warna diturunkan dari tema.css)
├─ app.js         data, sinkron antartab, peta, chat & tawar ongkir, 3 sudut
├─ tema.css       warna dasar + warna bagian (diubah customizer)
├─ tema.js        nama kedai & mode terang/gelap
├─ ikon.svg       ikon tab
├─ DESIGN.md      token, komponen, aturan motion
├─ AGENTS.md      ringkasan untuk AI coding agent
└─ .claude/skills/ubah-pesan-antar-kedai/SKILL.md
```

## Ubah brand & warna
- Nama kedai: `tema.js` → `nama: "Kedai Bu Sari"`; mode: `"terang"`, `"gelap"`, atau `"auto"`.
- Warna: `tema.css` → `--tema-utama` (tombol, langkah status, gelembung chat), `--tema-aksen` (sudut aktif, tawaran ongkir, lencana), `--tema-radius`, `--tema-font`, plus `--tema-latar/panel/nav/teks`. Teks di atas warna utama, aksen, dan nav dihitung otomatis putih/gelap sesuai kontras; tetap pilih warna utama yang cukup gelap supaya tombol mudah dibaca.
- Warna status (selesai hijau, ditolak merah, diproses biru) sengaja tetap supaya artinya jelas; ubah di `style.css`.
- Menu & gambar: lewat **Kedai › Menu & stok** (9 ilustrasi bawaan), atau ubah `dataContoh()` di `app.js`.
- Atau pakai customizer di [malikisaputra.biz.id/kode](https://malikisaputra.biz.id/kode).

## Ubah pakai Claude
Paket ini membawa Agent Skill di `.claude/skills/ubah-pesan-antar-kedai/SKILL.md` (peta berkas, letak tema, cara menambah fitur, aturan aman), `AGENTS.md` untuk Cursor/Copilot/Codex, dan `DESIGN.md`.

- **Claude Code / Claude Desktop**: buka folder paket ini; skill di `.claude/skills` terbaca otomatis. Tinggal minta, misal "tambah pilihan bayar QRIS dengan gambar kode QR kedai".
- **claude.ai**: unduh ZIP skill (tombol **Unduh Skill** di [malikisaputra.biz.id/kode](https://malikisaputra.biz.id/kode)), lalu di claude.ai buka **Customize › Skills › tombol "+" › Create skill › Upload a skill** dan pilih ZIP itu (folder skill sebagai akar ZIP). Syarat: **Code execution and file creation** aktif di **Settings › Capabilities** (paket Free/Pro/Max); di Team/Enterprise diatur oleh Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code sebelum minta perubahan tampilan besar:
- **impeccable** — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- **ui-ux-pro-max** — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Catatan
- Peta: © kontributor OpenStreetMap, dirender dengan Leaflet 1.9.4 (BSD-2) dari CDN cdnjs. Untuk lalu lintas besar, pakai penyedia ubin berlisensi (MapTiler, Stadia, dll.) sesuai kebijakan OSM.
- Data contoh (nama, nomor, alamat di Bandung) fiktif.
- Menghapus data situs/browser = data hilang. Unduh CSV pesanan secara rutin di Kedai › Atur.

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

---
Dibuat oleh **Maliki Studio** — [malikisaputra.biz.id](https://malikisaputra.biz.id), follow TikTok/IG **@malikisaputra**

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto
Semua path gambar diatur di objek `KONFIG` di bagian atas `app.js`.
- **Logo** — timpa `img/logo.svg` (persegi, mis. 200×200; boleh PNG/JPG asal path di `KONFIG.logo` diubah). Bila gagal dimuat, logo ikon bawaan dipakai.
- **Foto menu** — paling mudah lewat Kedai › Menu › Ubah › *Foto menu*: foto diperkecil otomatis ke 400px dan disimpan di browser. Untuk foto bawaan, taruh berkas di `img/` lalu isi `KONFIG.fotoMenu` per id menu (contoh: `{ m2: 'img/nasgor.jpg' }`), rasio 16:10. Menu tanpa foto memakai ilustrasi bawaan.
- `img/foto-menu.svg` hanyalah placeholder contoh untuk menu `m1`; timpa dengan foto aslimu atau hapus barisnya dari `KONFIG`.

<!-- panduan-ai-maliki -->
## Ubah sendiri sesuai kebutuhanmu pakai AI

Kamu tidak perlu jago coding. Template ini sudah disiapkan supaya mudah diubah AI: ada **AGENTS.md** (aturan proyek untuk AI), **DESIGN.md** (gaya desain), dan skill Claude di folder `.claude/skills/`. Pilih salah satu cara di bawah.

### Cara 1: ChatGPT, Claude, atau Gemini di browser (paling gampang, gratis)
1. Unduh ZIP template ini, lalu ekstrak.
2. Buka chatgpt.com, claude.ai, atau gemini.google.com.
3. Unggah berkas yang mau diubah (biasanya `index.html`, `style.css`, `app.js`, atau berkas data). Unggah juga `AGENTS.md` dan `DESIGN.md` (kalau ada) biar AI paham aturannya. ChatGPT juga bisa menerima ZIP utuh.
4. Tulis permintaanmu (contoh di bawah), lalu minta: "Kirim ulang berkas yang diubah secara utuh."
5. Ganti berkas lama dengan hasil dari AI, lalu buka `index.html` di browser untuk cek.

### Cara 2: Claude Code (paling rapi untuk perubahan besar)
1. Pasang Claude Code (lihat claude.com/claude-code), atau pakai aplikasi Claude Desktop tab Code.
2. Buka folder template ini, lalu jalankan `claude` di terminal folder itu.
3. Tulis permintaanmu. Kalau ada folder `.claude/skills/ubah-…`, Claude Code otomatis memakainya, jadi hasilnya tetap mengikuti desain aslinya.

### Cara 3: Codex (OpenAI)
1. Pasang Codex CLI atau pakai Codex di aplikasi ChatGPT.
2. Buka folder template, jalankan `codex`. Codex otomatis membaca `AGENTS.md`.
3. Tulis permintaanmu, cek perubahannya, lalu setujui.

### Cara 4: Google Antigravity atau Gemini CLI (gratis)
1. Antigravity: buka aplikasinya, pilih **Open Folder** ke folder template ini, lalu tulis permintaan di panel agen.
2. Gemini CLI: jalankan `gemini` di folder template.
3. Di awal, tulis: "Baca AGENTS.md dan DESIGN.md dulu sebelum mengubah apa pun."

### Contoh permintaan yang bisa langsung kamu pakai
- "Ganti nama, logo teks, dan warna utama jadi hijau tua sesuai usahaku: [nama usaha]."
- "Tambahkan kolom [nama kolom] di formulir dan tampilkan di daftar."
- "Ubah semua data contoh jadi data usahaku: [tempel datanya]."
- "Tambahkan halaman/menu baru untuk [kebutuhan], gaya desainnya sama dengan yang sudah ada."
- "Jelaskan dulu cara kerja aplikasi ini dengan bahasa sederhana, baru ubah [bagian]."

### Tips biar hasilnya bagus
- Satu permintaan = satu perubahan. Cek dulu hasilnya, baru minta yang berikutnya.
- Simpan salinan folder asli sebelum mengubah, jadi bisa balik kalau ada yang rusak.
- Kalau ada error, salin pesan errornya (klik kanan > Inspect > Console) lalu tempel ke AI.
- Data aplikasi tersimpan di browser (localStorage). Backup dulu sebelum ganti versi.
- Jangan hapus kredit "Template oleh @malikisaputra", dan template ini **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya (@malikisaputra).

Masih bingung? Komen di TikTok/IG **@malikisaputra**, nanti aku bantu.
