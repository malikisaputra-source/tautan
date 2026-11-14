# Helpdesk Tiket IT

Aplikasi tiket IT support untuk kantor/sekolah/UMKM: karyawan melapor masalah, tim IT menangani sesuai **prioritas** (Rendah/Sedang/Tinggi/Kritis) dan **level eskalasi** (L1/L2/L3) dengan **SLA + hitung mundur**, lalu semua pihak dikabari lewat **WhatsApp**. Jalan di browser HP/laptop, tanpa server, tanpa daftar akun.

## Fitur
- Form buat tiket: pelapor, No. WA, divisi, kategori, judul, deskripsi, lampiran gambar (diperkecil otomatis, disimpan lokal)
- Prioritas Rendah/Sedang/Tinggi/Kritis + level L1 (Helpdesk), L2 (Teknisi senior), L3 (Spesialis)
- Target SLA per prioritas (bisa diatur), hitung mundur langsung, tanda "Lewat SLA" + saran eskalasi
- Papan Kanban (seret-lepas antar status Baru/Dikerjakan/Menunggu/Selesai) dan tampilan Daftar dengan cari & saring
- Detail tiket: utas percakapan, riwayat peristiwa, ganti status, penugasan teknisi (otomatis ke teknisi paling longgar), eskalasi dengan alasan
- Notifikasi WhatsApp: tombol `wa.me` berisi pesan rapi ke teknisi/koordinator/pelapor saat tiket dibuat, dieskalasi, dan selesai
- Notifikasi browser untuk tiket Kritis dan tiket Tinggi/Kritis yang lewat SLA
- Dasbor: tiket terbuka, lewat SLA, rata-rata waktu selesai, kepatuhan SLA, kartu tiket mendesak, grafik 14 hari, beban teknisi, aktivitas
- Laporan 7/30 hari/semua: per kategori, per prioritas (+% tepat SLA), kinerja teknisi
- Ekspor CSV, backup & pulihkan JSON
- PIN lokal: admin `1234`, teknisi `1111` (ganti di Atur). Karyawan bisa "Lapor masalah tanpa masuk"
- Mode terang/gelap, rapi di HP & laptop, bisa dipakai dengan keyboard

## Cara menjalankan
1. Unduh ZIP, ekstrak.
2. Klik dua kali `index.html`. Masuk sebagai Admin dengan PIN `1234` (atau buka `index.html?demo` untuk langsung masuk).
3. Ada data contoh 18 tiket. Buka **Atur**: isi teknisi asli + No. WA, nomor koordinator IT, target SLA, ganti PIN.
4. Mau mulai bersih: **Atur › Kosongkan tiket**.
5. Mau dipakai bersama di HP? Unggah folder ke GitHub Pages/Netlify, buka link-nya, "Tambahkan ke layar utama".
6. Penting: data tersimpan di browser perangkat itu saja (localStorage). Rajin **Backup JSON** di menu Laporan.

## Struktur folder
```
index.html   kerangka: gerbang PIN, sidebar/nav bawah, 5 halaman, laci detail, dialog
style.css    gaya (token turunan, komponen, responsif, animasi)
app.js       logika & data (lihat komentar per bagian)
tema.css     warna, radius, font, warna per bagian (token tema)
tema.js      nama tim IT & mode terang/gelap
ikon.svg     ikon aplikasi
DESIGN.md    sistem desain
AGENTS.md, .claude/skills/ubah-helpdesk-tiket/SKILL.md   panduan untuk AI
```

## Ubah brand/warna
- Nama tim/perusahaan & mode: `tema.js` → `nama`, `mode` ("terang" | "gelap" | "auto").
- Warna/radius/font/latar/panel/nav/teks: `tema.css`. Semua warna lain turunan dari situ. Teks di atas tombol utama dan nav dihitung otomatis putih/gelap.
- Warna prioritas (abu, biru, kuning, merah) dan hijau "selesai" sengaja tetap supaya maknanya jelas.

## Kirim WA otomatis (opsional, untuk yang paham sedikit kode)
Bawaannya aplikasi memakai tombol `wa.me`: WhatsApp terbuka dengan pesan terisi, tinggal tekan kirim. Gratis dan tanpa server. Kalau mau **terkirim otomatis** tanpa klik, butuh *gateway* WA berbayar/resmi dan sebuah **perantara** (token gateway TIDAK boleh ditaruh di `app.js`, karena siapa pun bisa melihatnya).

Alurnya: `app.js` → POST JSON ke URL perantara → perantara memanggil API gateway.
Isi JSON yang dikirim: `{ "jenis": "dibuat|eskalasi|selesai", "tiket": "TK-1059", "prioritas": "kritis", "level": "L2", "target": "6281234...", "pesan": "..." }`.

**Langkah 1 — perantara Google Apps Script + Fonnte** (script.google.com › Proyek baru, tempel, lalu Deploy › Aplikasi web, akses "Siapa saja"):
```js
// Simpan token di Project Settings › Script properties: FONNTE_TOKEN
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var token = PropertiesService.getScriptProperties().getProperty('FONNTE_TOKEN');
  UrlFetchApp.fetch('https://api.fonnte.com/send', {
    method: 'post',
    headers: { Authorization: token },
    payload: { target: d.target, message: d.pesan }
  });
  return ContentService.createTextOutput('ok');
}
```

**Alternatif — WhatsApp Cloud API (Meta)**, mis. di Cloudflare Worker:
```js
export default {
  async fetch(req, env) {
    const d = await req.json();
    await fetch(`https://graph.facebook.com/v21.0/${env.PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.WA_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to: d.target, type: 'text', text: { body: d.pesan } })
    });
    return new Response('ok');
  }
};
```
Catatan Cloud API: pesan teks bebas hanya bisa dikirim dalam 24 jam setelah penerima mengirim pesan ke nomor bisnismu; di luar itu wajib pakai *message template* yang sudah disetujui Meta.

**Langkah 2** — isi URL perantara di `app.js`: `var WEBHOOK_WA = 'https://script.google.com/macros/s/xxx/exec';`. Tombol `wa.me` tetap ada sebagai cadangan.

Status cek (7 Nov 2026): 🟡 endpoint & parameter di atas mengikuti dokumentasi umum gateway; selalu cocokkan dengan dokumentasi resmi terbaru sebelum dipakai — docs.fonnte.com dan developers.facebook.com/docs/whatsapp/cloud-api (versi Graph API bisa berubah). Biaya & aturan pemakaian mengikuti tiap penyedia.

## Ubah pakai Claude
**(a) Claude Code / Claude Desktop:** buka folder paket ini, skill di `.claude/skills/ubah-helpdesk-tiket` terbaca otomatis. Minta saja, mis. "tambah kategori Laptop Pinjaman" atau "tambah kolom nomor aset".

**(b) claude.ai:** unduh ZIP skill (tombol "Unduh Skill" di malikisaputra.biz.id/kode), lalu di claude.ai: Customize › Skills › tombol "+" › Create skill › Upload a skill, pilih ZIP (folder skill sebagai akar ZIP). Syarat: "Code execution and file creation" aktif di Settings › Capabilities (paket Free/Pro/Max); di Team/Enterprise diatur Owner. Sumber: support.claude.com/en/articles/12512180 (dicek 6 Nov 2026).

## Mau hasil lebih maksimal?
Pasang skill desain ini di Claude Code:
- impeccable — https://github.com/pbakaus/impeccable (Apache-2.0, dicek 6 Nov 2026)
- ui-ux-pro-max — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT menurut GitHub API, dicek 6 Nov 2026)

## Lisensi
Lisensi Nonkomersial Maliki Studio (lihat `LICENSE`): gratis dipakai untuk usaha/organisasi sendiri dan boleh diubah, **wajib mencantumkan kreator** (Template oleh Maliki Saputra, @malikisaputra), dan **tidak boleh diperjualbelikan** tanpa izin. Mau menjual atau kerja sama? Diskusikan dulu dengan kreatornya.

Dibuat oleh Maliki Studio — malikisaputra.biz.id, follow TikTok/IG @malikisaputra

---

<!-- kredit-maliki -->
**Kredit:** Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Kredit di footer & kepala berkas wajib dipertahankan (lihat LICENSE).

## Ganti logo & foto

Semua path gambar ada di satu tempat: objek `KONFIG` di bagian atas `app.js`.

| Slot | Berkas bawaan | Rasio | Tampil di |
|---|---|---|---|
| Logo | `img/logo.svg` | persegi (mis. 256×256) | layar masuk, sidebar, header HP |
| Foto agen/teknisi | `img/avatar-agen.svg` | persegi (mis. 96×96) | Kanban, utas, dasbor, daftar teknisi |
| Foto pelapor (opsional) | `img/avatar-pelapor.svg` | persegi | utas & aktivitas |

- Cara cepat: timpa berkas di `img/` dengan nama yang sama (boleh .png/.jpg, lalu ubah ekstensinya di `KONFIG`).
- Foto per orang: tambahkan `'Nama Persis': 'img/budi.jpg'` di `KONFIG.avatar`.
- Foto default semua pelapor: isi `KONFIG.avatarPelapor`.
- Bila gambar gagal dimuat, otomatis kembali ke ikon tiket / inisial nama.

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
