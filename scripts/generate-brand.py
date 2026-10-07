"""Build Morphe logo variants + icons from the source logo PNG.

usage: python3 scripts/generate-brand.py design/morphe-logo-source.png public
requires: pip install pillow numpy potracer
"""
import json
import sys
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

SRC, PUBLIC = Path(sys.argv[1]), Path(sys.argv[2])
BRAND = PUBLIC / 'brand'
BRAND.mkdir(parents=True, exist_ok=True)

DARK = (5, 5, 5)            # site background #050505
MAGENTA = (208, 46, 185)    # wordmark #d02eb9


def white_to_alpha(rgb):
    """Opaque interior, anti-aliased edges: alpha from distance to white, then un-blend the edge colour."""
    c = rgb.astype(float)
    dist = 765.0 - c.sum(axis=2)                    # 0 = white; every brand colour is > 250
    a = np.clip((dist - 20.0) / 200.0, 0, 1)        # ignores faint off-white noise
    safe = np.where(a > 0, a, 1)[..., None]
    out = np.clip((c - 255.0 * (1 - a[..., None])) / safe, 0, 255)
    rgba = np.dstack([out, a * 255.0])
    return Image.fromarray(rgba.round().astype(np.uint8))


def trim(img, pad=0):
    box = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    img = img.crop(box)
    if pad:
        canvas = Image.new('RGBA', (img.width + pad * 2, img.height + pad * 2))
        canvas.paste(img, (pad, pad))
        img = canvas
    return img


def recolor(img, rgb):
    solid = Image.new('RGBA', img.size, rgb + (255,))
    solid.putalpha(img.getchannel('A'))
    return solid


def fit(img, size):
    """Scale proportionally so the longest side == size."""
    s = size / max(img.size)
    return img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)


def square(img, size, padding=0.0, bg=None):
    inner = round(size * (1 - padding * 2))
    mark = fit(img, inner)
    canvas = Image.new('RGBA', (size, size), (bg + (255,)) if bg else (0, 0, 0, 0))
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return canvas


def save(img, name, webp=True):
    img.save(BRAND / f'{name}.png', optimize=True)
    if webp:
        img.save(BRAND / f'{name}.webp', quality=92, method=6)


def stack(top, bottom, gap_ratio=0.09):
    gap = round(top.height * gap_ratio)
    w = max(top.width, bottom.width)
    canvas = Image.new('RGBA', (w, top.height + gap + bottom.height))
    canvas.alpha_composite(top, ((w - top.width) // 2, 0))
    canvas.alpha_composite(bottom, ((w - bottom.width) // 2, top.height + gap))
    return canvas


def side_by_side(left, right, gap_ratio=0.35):
    right = fit(right, round(right.width * (left.height * 0.42) / right.height)) if right.height else right
    gap = round(left.height * gap_ratio)
    h = left.height
    canvas = Image.new('RGBA', (left.width + gap + right.width, h))
    canvas.alpha_composite(left, (0, 0))
    canvas.alpha_composite(right, (left.width + gap, (h - right.height) // 2))
    return canvas


def trace_svg(img, fill, name):
    """Vectorise a single-colour shape (the wordmark) with potrace."""
    # potracer treats truthy pixels as background, so pass the inverted mask
    alpha = np.asarray(img.getchannel('A')) <= 127
    paths = potrace.Bitmap(alpha).trace(turdsize=4, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curve in paths:
        sx, sy = curve.start_point.x, curve.start_point.y
        seg = [f'M{sx:.1f},{sy:.1f}']
        for s in curve.segments:
            if s.is_corner:
                seg.append(f'L{s.c.x:.1f},{s.c.y:.1f}L{s.end_point.x:.1f},{s.end_point.y:.1f}')
            else:
                seg.append(f'C{s.c1.x:.1f},{s.c1.y:.1f} {s.c2.x:.1f},{s.c2.y:.1f} {s.end_point.x:.1f},{s.end_point.y:.1f}')
        d.append(''.join(seg) + 'Z')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img.width} {img.height}" '
           f'role="img" aria-label="Morphe"><path fill="{fill}" fill-rule="evenodd" d="{"".join(d)}"/></svg>\n')
    (BRAND / f'{name}.svg').write_text(svg)


# --- split source -------------------------------------------------------
src = np.asarray(Image.open(SRC).convert('RGB'))
ink_rows = np.where((765 - src.astype(int).sum(axis=2) > 60).any(axis=1))[0]
gap_rows = [y for y in range(ink_rows.min(), ink_rows.max()) if y not in set(ink_rows)]
split = (gap_rows[0] + gap_rows[-1]) // 2

mark = trim(white_to_alpha(src[:split]))
wordmark = trim(white_to_alpha(src[split:]))
wordmark = recolor(wordmark, MAGENTA)   # flatten JPEG-ish noise to the exact brand colour

# --- logo variants ------------------------------------------------------
variants = {
    'morphe-mark': mark,
    'morphe-mark-white': recolor(mark, (255, 255, 255)),
    'morphe-mark-black': recolor(mark, (0, 0, 0)),
    'morphe-wordmark': wordmark,
    'morphe-wordmark-white': recolor(wordmark, (255, 255, 255)),
    'morphe-wordmark-black': recolor(wordmark, (0, 0, 0)),
    'morphe-logo-stacked': stack(mark, fit(wordmark, round(mark.width * 1.45))),
    'morphe-logo-stacked-white': stack(mark, fit(recolor(wordmark, (255, 255, 255)), round(mark.width * 1.45))),
    'morphe-logo-horizontal': side_by_side(mark, wordmark),
    'morphe-logo-horizontal-white': side_by_side(mark, recolor(wordmark, (255, 255, 255))),
}
for name, img in variants.items():
    save(img, name)

trace_svg(wordmark, '#d02eb9', 'morphe-wordmark')
trace_svg(wordmark, '#ffffff', 'morphe-wordmark-white')
trace_svg(wordmark, '#000000', 'morphe-wordmark-black')

# Mark at fixed sizes (longest side)
for size in (64, 128, 256, 512, 1024):
    save(fit(mark, size), f'morphe-mark-{size}')

# --- app icons ----------------------------------------------------------
icon_mark = square(mark, 1024, padding=0.06)
for size in (16, 32, 48):
    square(mark, size, padding=0.02).save(PUBLIC / f'favicon-{size}x{size}.png', optimize=True)
square(mark, 256, padding=0.02).save(
    PUBLIC / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
square(mark, 180, padding=0.14, bg=DARK).save(PUBLIC / 'apple-touch-icon.png', optimize=True)
square(mark, 192, padding=0.06).save(PUBLIC / 'icon-192.png', optimize=True)
square(mark, 512, padding=0.06).save(PUBLIC / 'icon-512.png', optimize=True)
square(mark, 512, padding=0.2, bg=DARK).save(PUBLIC / 'icon-maskable-512.png', optimize=True)
save(icon_mark, 'morphe-icon-1024')
save(square(mark, 1024, padding=0.18, bg=DARK), 'morphe-icon-1024-dark')

# Social share image
og = Image.new('RGBA', (1200, 630), DARK + (255,))
logo = fit(variants['morphe-logo-stacked'], 400)
og.alpha_composite(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2))
og.convert('RGB').save(PUBLIC / 'og-image.png', optimize=True)

(PUBLIC / 'site.webmanifest').write_text(json.dumps({
    'name': 'Morphe Creatives',
    'short_name': 'Morphe',
    'icons': [
        {'src': '/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
        {'src': '/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
        {'src': '/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
    ],
    'theme_color': '#050505',
    'background_color': '#050505',
    'display': 'standalone',
}, indent=2) + '\n')

print('mark', mark.size, 'wordmark', wordmark.size, 'split', split)
