#!/bin/bash
# Sementara: pasang cloudflared (resmi Cloudflare) lalu buka quick tunnel SSH. Akan dihapus.
set -u
cd /root
if ! command -v cloudflared >/dev/null 2>&1; then
  echo "== unduh cloudflared (.deb resmi)"
  curl -fL --retry 3 -o cf.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb \
    || curl -fL --retry 3 -o cf.deb https://pkg.cloudflare.com/cloudflared/pool/main/c/cloudflared/cloudflared_2025.11.1_amd64.deb \
    || { echo "== GAGAL unduh. Cek internet VPS:"; curl -sI https://github.com | head -1; curl -sI https://pkg.cloudflare.com | head -1; exit 1; }
  dpkg -i cf.deb || exit 1
fi
cloudflared --version
echo "== tunnel SSH: salin alamat trycloudflare.com di bawah, biarkan jendela ini terbuka"
cloudflared tunnel --no-autoupdate --url ssh://localhost:22
