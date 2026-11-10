#!/usr/bin/env python3
"""Generate the Check Specs favicon family (real files, no emoji/data-URI).

Design: navy rounded square with the site's diagonal gradient
(#0b1e3f -> #1677ff), a bold white smartphone outline and a bold white
check tick inside it — "Check" + phone, legible down to 16px.

Outputs (into docs/ root):
  favicon.ico          multi-size ICO (16/32/48)
  favicon-48.png       48x48   (Google search-result favicon size)
  favicon-192.png      192x192
  apple-touch-icon.png 180x180 (full-bleed square; iOS rounds it itself)
Also keeps the 512px master at harvest/favicon-master.png.

Run: python3 harvest/make_favicon.py
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")

NAVY = (0x0B, 0x1E, 0x3F)
BLUE = (0x16, 0x77, 0xFF)
WHITE = (255, 255, 255)

SS = 2048          # supersample canvas
MASTER = 512       # master size everything is derived from


def gradient(size):
    """Diagonal linear gradient NAVY (top-left) -> BLUE (bottom-right)."""
    import numpy as np
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    t = (x + y) / (2.0 * (size - 1))
    t = t[..., None]
    a = np.array(NAVY, dtype=np.float32)
    b = np.array(BLUE, dtype=np.float32)
    rgb = (a * (1 - t) + b * t).astype("uint8")
    alpha = np.full((size, size, 1), 255, dtype=np.uint8)
    return Image.fromarray(np.concatenate([rgb, alpha], axis=2), "RGBA")


def draw_icon(radius_frac=0.225):
    """Draw the icon at supersample size; returns an RGBA image."""
    S = SS
    base = gradient(S)

    # clip gradient to a rounded square
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    r = int(S * radius_frac)
    md.rounded_rectangle([0, 0, S - 1, S - 1], radius=r, fill=255)
    out = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask)

    d = ImageDraw.Draw(out)

    # --- smartphone outline (white, thick) ---
    px0, py0 = 0.285 * S, 0.165 * S
    px1, py1 = 0.715 * S, 0.835 * S
    pr = 0.085 * S                       # phone corner radius
    pw = int(0.060 * S)                  # outline stroke width
    d.rounded_rectangle([px0, py0, px1, py1], radius=pr, outline=WHITE, width=pw)

    # home indicator dot
    dot_r = 0.020 * S
    cx, cy = 0.5 * S, 0.765 * S
    d.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=WHITE)

    # --- bold check tick inside the phone ---
    cw = int(0.078 * S)                  # tick stroke width
    pts = [(0.392 * S, 0.505 * S), (0.472 * S, 0.590 * S), (0.622 * S, 0.405 * S)]
    d.line(pts, fill=WHITE, width=cw, joint="curve")
    for (x, y) in (pts[0], pts[-1]):     # round caps
        d.ellipse([x - cw / 2, y - cw / 2, x + cw / 2, y + cw / 2], fill=WHITE)

    return out


def main():
    master = draw_icon().resize((MASTER, MASTER), Image.LANCZOS)
    master.save(os.path.join(ROOT, "harvest", "favicon-master.png"))

    master.resize((48, 48), Image.LANCZOS).save(os.path.join(DOCS, "favicon-48.png"))
    master.resize((192, 192), Image.LANCZOS).save(os.path.join(DOCS, "favicon-192.png"))
    master.save(os.path.join(DOCS, "favicon.ico"),
                sizes=[(16, 16), (32, 32), (48, 48)])

    # Apple touch icon: full-bleed (no transparent corners — iOS fills them black)
    apple = draw_icon(radius_frac=0.0).resize((180, 180), Image.LANCZOS)
    apple.convert("RGB").save(os.path.join(DOCS, "apple-touch-icon.png"))

    for f in ("favicon.ico", "favicon-48.png", "favicon-192.png", "apple-touch-icon.png"):
        p = os.path.join(DOCS, f)
        print(f, os.path.getsize(p), "bytes")


if __name__ == "__main__":
    main()
