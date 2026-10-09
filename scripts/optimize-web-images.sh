#!/usr/bin/env bash
# Rebuild the checked-in delivery variants from the original artwork.
# cwebp is a local asset-preparation tool, not a production dependency.
# Override its executable with CWEBP=/absolute/path/to/cwebp if needed.
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
asset_dir="$repo_dir/public/assets"

if [[ -n "${CWEBP:-}" ]]; then
  webp_encoder="$CWEBP"
elif command -v cwebp >/dev/null 2>&1; then
  webp_encoder="$(command -v cwebp)"
elif [[ -x /opt/homebrew/bin/cwebp ]]; then
  webp_encoder=/opt/homebrew/bin/cwebp
else
  printf '%s\n' 'cwebp is required to regenerate assets; install the WebP tools or set CWEBP.' >&2
  exit 1
fi

if [[ ! -x "$webp_encoder" ]]; then
  printf 'cwebp executable is unavailable: %s\n' "$webp_encoder" >&2
  exit 1
fi

# Full-size previews retain text and line work with lossless encoding.
# The smaller delivery variant keeps the full page ratio and uses sharp YUV
# conversion to preserve fine lettering while reducing its transfer size.
for slug in prediction-cards team-vote name-race bingo word-scramble old-wives-tales; do
  preview="$asset_dir/games-$slug-preview"
  "$webp_encoder" -lossless -q 100 -m 6 -metadata icc -quiet \
    "$preview.png" -o "$preview.webp"
  "$webp_encoder" -q 86 -m 6 -sharp_yuv -metadata icc -resize 320 0 -quiet \
    "$preview.png" -o "$preview-320.webp"
done

# Match the existing square dial's 43% horizontal object position in the
# 1100 x 733 source: (1100 - 733) * 0.43 rounds to a 158 px left crop.
"$webp_encoder" -q 90 -m 6 -sharp_yuv -metadata icc \
  -crop 158 0 733 733 -resize 420 420 -quiet \
  "$asset_dir/moon-mobile.jpg" -o "$asset_dir/moon-dial-420.webp"

# The age tool uses the complete artwork at its original 3:2 proportion.
"$webp_encoder" -q 90 -m 6 -sharp_yuv -metadata icc \
  -resize 660 440 -quiet \
  "$asset_dir/moon-mobile.jpg" -o "$asset_dir/moon-mobile-660.webp"

printf '%s\n' 'Generated 12 printable WebP previews and 2 moon delivery variants.'
