"""Build a clean background plate from the mockup: erase everything the game draws live.

Erased areas are filled row by row with a linear blend between the pixels just
left and right of each erased run. That keeps flat UI surfaces flat (no
inpainting smears) and keeps horizontal structure in the window scene.
"""
import sys
import cv2
import numpy as np

src, out_dir = sys.argv[1], sys.argv[2]
img = cv2.imread(src).astype(np.float32)
H, W = img.shape[:2]

big = np.zeros((H, W), np.uint8)    # behind customers: window scene
small = np.zeros((H, W), np.uint8)  # flat UI surfaces


def rect(m, x0, y0, x1, y1):
    m[y0:y1, x0:x1] = 255


for name in ("char1", "char2", "char3"):
    big |= cv2.imread(f"{out_dir}/{name}_mask.png", cv2.IMREAD_GRAYSCALE)
for bx0 in (318, 617, 955):
    rect(big, bx0 - 20, 78, bx0 + 146, 252)
rect(big, 157, 160, 394, 312)   # whole character boxes, so no scraps survive
rect(big, 214, 64, 394, 160)    # (left part stops short of the lantern)
rect(big, 478, 86, 664, 312)
rect(big, 800, 58, 1026, 312)
big = cv2.dilate(big, np.ones((5, 5), np.uint8))
big[312:, :] = 0

# HUD values (labels stay)
rect(small, 116, 8, 214, 40)
rect(small, 286, 18, 352, 44)
rect(small, 422, 18, 474, 44)
rect(small, 618, 4, 706, 31)
rect(small, 588, 31, 750, 46)
rect(small, 878, 6, 956, 34)
rect(small, 1052, 6, 1104, 34)
# food on the counter (kept inside each surface so frames/corners survive)
rect(small, 300, 376, 480, 434)   # griddle pancakes
rect(small, 336, 326, 460, 378)   # steam
rect(small, 532, 326, 658, 452)   # plate + stack (inside the golden corners)
rect(small, 736, 324, 798, 406)   # blender jar contents
rect(small, 864, 316, 942, 456)   # cup drink
rect(small, 136, 486, 166, 514)   # "!" badge
rect(small, 52, 594, 96, 618)
rect(small, 172, 594, 214, 618)
rect(small, 38, 630, 94, 657)
rect(small, 156, 630, 212, 657)


def row_fill_any(src_img, mask):
    out = src_img.copy()
    h, w = mask.shape
    for y in range(h):
        row = mask[y] > 0
        if not row.any():
            continue
        x = 0
        while x < w:
            if not row[x]:
                x += 1
                continue
            x0 = x
            while x < w and row[x]:
                x += 1
            x1 = x  # run is [x0, x1)
            left = src_img[y, x0 - 1] if x0 > 0 else None
            right = src_img[y, x1] if x1 < w else None
            if left is None:
                left = right
            if right is None:
                right = left
            t = np.linspace(0, 1, x1 - x0 + 2)[1:-1, None]
            out[y, x0:x1] = left * (1 - t) + right * t
    return out


def row_fill(src_img, mask):
    return row_fill_any(src_img, mask)


def dist_to_edge(mask):
    # per-pixel distance to the run boundary along rows (dx) and along columns (dy)
    m = mask > 0
    h, w = m.shape
    dx = np.zeros((h, w), np.float32)
    dy = np.zeros((h, w), np.float32)
    for y in range(h):
        row = m[y]
        x = 0
        while x < w:
            if not row[x]:
                x += 1
                continue
            x0 = x
            while x < w and row[x]:
                x += 1
            n = x - x0
            i = np.arange(n, dtype=np.float32)
            dx[y, x0:x] = np.minimum(i + 1, n - i)
    for xx in range(w):
        col = m[:, xx]
        y = 0
        while y < h:
            if not col[y]:
                y += 1
                continue
            y0 = y
            while y < h and col[y]:
                y += 1
            n = y - y0
            i = np.arange(n, dtype=np.float32)
            dy[y0:y, xx] = np.minimum(i + 1, n - i)
    return dx, dy


def blend_fill(src_img, mask):
    rows = row_fill_any(src_img, mask)
    cols = row_fill_any(src_img.transpose(1, 0, 2), mask.T).transpose(1, 0, 2)
    dx, dy = dist_to_edge(mask)
    wr = (1 / np.maximum(dx, 1))[:, :, None]
    wc = (1 / np.maximum(dy, 1))[:, :, None]
    blended = (rows * wr + cols * wc) / (wr + wc)
    return np.where((mask > 0)[:, :, None], blended, src_img)


def soften(filled, mask, sigma_y, sigma_x):
    blurred = cv2.GaussianBlur(filled, (0, 0), sigmaX=sigma_x, sigmaY=sigma_y)
    a = cv2.GaussianBlur((mask > 0).astype(np.float32), (0, 0), 1.5)[:, :, None]
    a = np.maximum(a, (mask > 0)[:, :, None].astype(np.float32))
    return filled * (1 - a) + blurred * a


out = blend_fill(img, big)
out = soften(out, big, 6, 6)
noise = np.random.default_rng(1).normal(0, 2.0, out.shape).astype(np.float32)
out = np.where(big[:, :, None] > 0, out + noise, out)

out = row_fill(out, small)
out = soften(out, small, 2.5, 1)

# slate cells: make one clean cell from the lock cell (lock erased), paste it over cells 1-4
cell = out[402:468, 1074:1143].copy()
icon = np.zeros(cell.shape[:2], np.uint8)
icon[10:56, 16:54] = 255
cell = row_fill_any(cell, icon)
cell = soften(cell, icon, 2.5, 1)
ch, cw = cell.shape[:2]
cv2.imwrite(f"{out_dir}/slate_cell.png", np.clip(cell, 0, 255).astype(np.uint8))
for x0, y0 in ((999, 332), (1069, 332), (1140, 332), (1004, 402)):
    out[y0:y0 + ch, x0:x0 + cw] = cell
# straw/cream tips poking above the cells
strip = np.zeros((H, W), np.uint8)
rect(strip, 1078, 316, 1124, 334)
rect(strip, 1049, 392, 1063, 405)
out = row_fill(out, strip)

cv2.imwrite(f"{out_dir}/bg.png", np.clip(out, 0, 255).astype(np.uint8))
print("ok")
