from PIL import Image, ImageDraw, ImageFont

S = r"C:/Users/suraj/AppData/Local/Temp/claude/a18f9539355c08f8/9f1c20c3-c55e-4055-ae8b-ddf853a610b4/scratchpad/out"
P = r"C:/Users/suraj/Desktop/projects/animecafe"
W, H = 1200, 630

bg = Image.open(f"{S}/bg.png").convert("RGB")
for name, x, y in (("char1", 154, 69), ("char2", 489, 94), ("char3", 807, 69)):
    c = Image.open(f"{S}/{name}.png").convert("RGBA")
    bg.paste(c, (x, y), c)

# scene strip: window + customers + counter edge
cx0, cx1, cy0, cy1 = 140, 1020, 50, 276
scene = bg.crop((cx0, cy0, cx1, cy1))
k = W / scene.width
scene = scene.resize((W, round(scene.height * k)), Image.LANCZOS)  # 1200 x ~351
og = Image.new("RGB", (W, H))
# lower area: vertical gradient in the café's counter colours
top, bot = (176, 120, 112), (66, 38, 66)
d = ImageDraw.Draw(og)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
og.paste(scene, (0, 0))
d.rectangle([0, scene.height - 4, W, scene.height + 3], fill=(224, 170, 140))  # counter lip

# title block
f_big = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 84)
f_sub = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 30)
title, sub = "Anime Café", "Serve pancakes & smoothies before customers lose patience"
ty = scene.height + 26
tw = d.textlength(title, font=f_big)
d.text(((W - tw) / 2 + 3, ty + 3), title, font=f_big, fill=(52, 24, 52))
d.text(((W - tw) / 2, ty), title, font=f_big, fill=(255, 246, 238))
sw = d.textlength(sub, font=f_sub)
d.text(((W - sw) / 2, ty + 100), sub, font=f_sub, fill=(255, 226, 214))

# ingredient strip
names = ["flour", "eggs", "milk", "strawberry", "blueberry", "banana", "ice", "syrup", "cream"]
tiles = [Image.open(f"{P}/public/art/ing-{n}.webp").convert("RGB") for n in names]
th = 78
tiles = [t.resize((round(t.width * th / t.height), th), Image.LANCZOS) for t in tiles]
gap = 14
total = sum(t.width for t in tiles) + gap * (len(tiles) - 1)
x = (W - total) // 2
y = H - th - 18
for t in tiles:
    d.rounded_rectangle([x - 3, y - 3, x + t.width + 3, y + th + 3], radius=12, fill=(250, 238, 232))
    og.paste(t, (x, y))
    x += t.width + gap

og.save(f"{P}/src/app/opengraph-image.png", optimize=True)
print(scene.size)
