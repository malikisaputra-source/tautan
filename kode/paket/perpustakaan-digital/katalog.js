/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi MIT + wajib atribusi (lihat LICENSE). */
/* Katalog publik read-only: membaca katalog.json (hasil "Unduh katalog.json" di menu Atur). Tanpa data anggota. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var data = { nama: '', buku: [] }, kat = [];

  function terapkan(d) {
    data = d && Array.isArray(d.buku) ? d : { buku: [] };
    if (data.nama) { document.querySelectorAll('[data-tema-nama]').forEach(function (e) { e.textContent = data.nama; }); document.title = 'Katalog ' + data.nama; }
    kat = []; data.buku.forEach(function (b) { if (b.kategori && kat.indexOf(b.kategori) < 0) kat.push(b.kategori); });
    $('#kategori').innerHTML = '<option value="">Semua kategori</option>' + kat.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
    render();
  }
  function sampul(b) {
    var n = Math.max(0, kat.indexOf(b.kategori)) % 4, jurnal = b.jenis === 'Jurnal';
    var awal = esc((b.judul || '?').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase());
    return '<div class="sampul nada' + n + '" aria-hidden="true"><svg viewBox="0 0 60 80"><rect class="punggung" x="0" y="0" width="8" height="80"/>' +
      (jurnal ? '<path d="M16 14h34M16 20h26" class="garis-s"/><rect x="16" y="52" width="34" height="14" rx="2" class="blok-s"/>' : '<path d="M16 58h34M16 64h22" class="garis-s"/><circle cx="33" cy="28" r="11" class="blok-s"/>') +
      '<text x="33" y="' + (jurnal ? 42 : 32) + '" text-anchor="middle">' + awal + '</text></svg></div>';
  }
  function render() {
    var q = $('#cari').value.trim().toLowerCase(), k = $('#kategori').value, s = $('#status').value;
    var h = data.buku.filter(function (b) {
      if (k && b.kategori !== k) return false;
      if (s === 'ada' && !b.tersedia) return false;
      if (s === 'ebook' && !b.tautan) return false;
      return !q || [b.judul, b.penulis, b.penerbit, b.isbn, b.rak, b.kode].join(' ').toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return String(a.judul).localeCompare(b.judul, 'id'); });
    $('#info').textContent = h.length + ' dari ' + data.buku.length + ' koleksi' + (data.diperbarui ? ' · data per ' + data.diperbarui : '');
    $('#daftar').innerHTML = h.length ? h.map(function (b, i) {
      var link = /^https?:\/\//i.test(b.tautan || '') ? b.tautan : '';
      return '<article class="kartu-buku" data-bagian="panel" style="--i:' + Math.min(i, 14) + '">' + sampul(b) + '<div class="info-buku"><p class="meta-atas"><span class="lencana">' + esc(b.kategori) + '</span>' + (b.jenis === 'Jurnal' ? '<span class="lencana netral">Jurnal</span>' : '') + '</p>' +
        '<h3>' + esc(b.judul) + '</h3><p class="redup">' + esc(b.penulis) + (b.penerbit ? ' · ' + esc(b.penerbit) : '') + (b.tahun ? ', ' + esc(b.tahun) : '') + '</p>' +
        '<dl class="detail"><div><dt>Rak</dt><dd>' + esc(b.rak || '-') + '</dd></div><div><dt>Kode</dt><dd>' + esc(b.kode || '-') + '</dd></div><div><dt>ISBN</dt><dd>' + esc(b.isbn || '-') + '</dd></div></dl>' +
        '<p class="stok ' + (b.tersedia ? 'ada' : 'habis') + '"><span aria-hidden="true"></span>' + (b.tersedia ? b.tersedia + ' dari ' + b.eksemplar + ' tersedia' : 'Sedang dipinjam semua') + '</p>' +
        (link ? '<div class="aksi-kartu"><a class="tombol kecil" href="' + esc(link) + '" target="_blank" rel="noopener">Baca PDF</a></div>' : '') + '</div></article>';
    }).join('') : '<div class="kosong-besar"><p>' + (data.buku.length ? 'Tidak ada koleksi yang cocok.' : 'Katalog belum tersedia.') + '</p></div>';
  }
  ['#cari', '#kategori', '#status'].forEach(function (s) { $(s).addEventListener('input', render); });
  $('#berkas').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return; var r = new FileReader();
    r.onload = function () { try { terapkan(JSON.parse(r.result)); } catch (er) { $('#info').textContent = 'Berkas tidak valid.'; } };
    r.readAsText(f);
  });
  fetch('katalog.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(terapkan).catch(function () {
    $('#info').textContent = 'katalog.json belum bisa dimuat (buka lewat hosting, atau pilih berkasnya).';
    $('#pilihBerkas').hidden = false;
  });
  // tema dari customizer
  window.addEventListener('message', function (e) {
    var t = e.data; if (!t || t.tipe !== 'tema') return; var st = document.documentElement.style;
    if (t.utama) st.setProperty('--tema-utama', t.utama); if (t.aksen) st.setProperty('--tema-aksen', t.aksen);
    if (t.mode) document.documentElement.setAttribute('data-mode', t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang') : t.mode);
  });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(function () {});
})();
