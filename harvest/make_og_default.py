#!/usr/bin/env python3
"""Branded default social-share image (audit fix batch 2026-11-10): a neutral,
device-free og:image for pages that have no photo of their own, replacing the
old hard-coded iPhone fallback in build.py head(). 1200x630, navy Check Specs
branding. Output: docs/img/og-default.jpg (static asset, survives builds —
build.py never wipes docs/img)."""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
TOP = (8, 18, 48)        # #081230
BOT = (11, 30, 63)       # #0b1e3f
ACCENT = (22, 119, 255)  # #1677ff

def font(size, bold=True):
    names = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for n in names:
        if os.path.exists(n):
            return ImageFont.truetype(n, size)
    return ImageFont.load_default()

img = Image.new("RGB", (W, H))
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(int(TOP[i] + (BOT[i] - TOP[i]) * t) for i in range(3)))
# accent rule
d.rectangle([0, H - 10, W, H], fill=ACCENT)
# phone glyph block (simple rounded-rect outline, no device photo)
d.rounded_rectangle([90, 150, 210, 390], radius=22, outline=ACCENT, width=7)
d.ellipse([140, 350, 160, 370], outline=ACCENT, width=5)

def text_center(y, s, fnt, fill):
    w = d.textlength(s, font=fnt)
    d.text(((W - w) / 2 + 60, y), s, font=fnt, fill=fill)

text_center(215, "Check Specs", font(110), (255, 255, 255))
text_center(355, "Mobile Specs, Prices & Comparisons in Pakistan", font(40, bold=False), (190, 208, 235))
text_center(440, "checkspecs.info", font(38), ACCENT)

out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "img", "og-default.jpg")
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out, "JPEG", quality=82)
print("wrote", out, os.path.getsize(out) // 1024, "KB")
