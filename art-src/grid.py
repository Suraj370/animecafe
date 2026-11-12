import sys
from PIL import Image, ImageDraw

src = sys.argv[1]
out = sys.argv[2]
box = tuple(int(v) for v in sys.argv[3].split(",")) if len(sys.argv) > 3 else None
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0

im = Image.open(src).convert("RGB")
if box:
    im = im.crop(box)
ox, oy = (box[0], box[1]) if box else (0, 0)
im = im.resize((int(im.width * scale), int(im.height * scale)), Image.NEAREST)
d = ImageDraw.Draw(im)
step = 10 if scale >= 3 else 25 if scale >= 1.5 else 50
for x in range((ox // step) * step, int(ox + im.width / scale + step), step):
    px = (x - ox) * scale
    if px < 0:
        continue
    major = x % (step * 2) == 0
    d.line([(px, 0), (px, im.height)], fill=(0, 255, 255) if major else (0, 140, 140), width=1)
    if major:
        d.text((px + 2, 2), str(x), fill=(255, 255, 0))
for y in range((oy // step) * step, int(oy + im.height / scale + step), step):
    py = (y - oy) * scale
    if py < 0:
        continue
    major = y % (step * 2) == 0
    d.line([(0, py), (im.width, py)], fill=(255, 0, 255) if major else (140, 0, 140), width=1)
    if major:
        d.text((2, py + 2), str(y), fill=(255, 255, 0))
im.save(out)
print(im.size)
