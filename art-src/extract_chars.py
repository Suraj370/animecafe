"""Cut the three customers out of the mockup with GrabCut.

Each character's right shoulder is hidden behind its order bubble, so that
part is rebuilt by mirroring the visible left side across the body's axis.
"""
import sys
import cv2
import numpy as np

src, out_dir = sys.argv[1], sys.argv[2]
img = cv2.imread(src)  # BGR
H, W = img.shape[:2]
COUNTER_Y = 312

CHARS = [
    # name, grabcut rect, body axis x, bubble rect, sure-fg boxes, sure-bg boxes
    ("char1", (146, 64, 392, COUNTER_Y), 268, (318, 80, 460, 248),
     [(225, 95, 300, 160), (180, 180, 300, 300)],
     [(146, 58, 216, 158), (300, 58, 400, 80), (146, 150, 214, 176), (214, 124, 235, 166), (293, 124, 310, 152), (168, 170, 205, 200)]),
    ("char2", (468, 86, 662, COUNTER_Y), 563, (617, 80, 760, 248),
     [(530, 110, 595, 175), (510, 200, 610, 300)],
     [(466, 84, 505, 215), (466, 84, 515, 140), (606, 84, 662, 140)]),
    ("char3", (802, 58, 1026, COUNTER_Y), 905, (955, 80, 1100, 248),
     [(870, 80, 935, 160), (840, 190, 950, 300)],
     [(800, 56, 850, 165), (800, 56, 866, 92), (950, 56, 1030, 82), (800, 140, 845, 182), (858, 138, 875, 170)]),
]
TAIL_PAD = 18  # the bubble's pointer sticks out to the left of the bubble
TAIL_Y = (180, 254)

results = []
for name, (x0, y0, x1, y1), axis, (bx0, by0, bx1, by1), sure, sure_bg in CHARS:
    mask = np.full((H, W), cv2.GC_BGD, np.uint8)
    mask[y0:y1, x0:x1] = cv2.GC_PR_FGD
    for sx0, sy0, sx1, sy1 in sure:
        mask[sy0:sy1, sx0:sx1] = cv2.GC_FGD
    for sx0, sy0, sx1, sy1 in sure_bg:
        mask[sy0:sy1, sx0:sx1] = cv2.GC_BGD
    # the bubble (and its tail) is definitely not the character
    hidden = np.zeros((H, W), bool)
    hidden[by0:by1 + 4, bx0:bx1] = True
    hidden[TAIL_Y[0]:TAIL_Y[1], bx0 - TAIL_PAD:bx0] = True
    mask[hidden] = cv2.GC_BGD
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

    # keep only the largest connected blob (drops stray background specks)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(fg)
    if n > 1:
        biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fg = np.where(labels == biggest, 255, 0).astype(np.uint8)
    # fill small holes
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))

    rgba = np.dstack([img, fg])

    # mirror-fill the part hidden behind the bubble
    zx0 = bx0 - TAIL_PAD
    for y in range(by0, by1 + 6):
        for x in range(zx0, x1):
            if not hidden[y, x]:
                continue
            mx = 2 * axis - x
            if 0 <= mx < W and fg[y, x] == 0:
                if fg[y, mx] > 0:
                    rgba[y, x] = np.append(img[y, mx], 255)
                else:
                    rgba[y, x, 3] = 0

    # soften the edge a touch
    alpha = rgba[:, :, 3].astype(np.float32)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    rgba[:, :, 3] = alpha.astype(np.uint8)

    # crop to bounding box
    ys, xs = np.where(rgba[:, :, 3] > 10)
    cx0, cx1, cy0, cy1 = xs.min(), xs.max() + 1, ys.min(), COUNTER_Y
    crop = rgba[cy0:cy1, cx0:cx1]
    cv2.imwrite(f"{out_dir}/{name}.png", crop)
    results.append((name, int(cx0), int(cy0), int(cx1 - cx0), int(cy1 - cy0), axis))

    # union mask (for background inpainting) — dilated so no halo remains
    full = np.zeros((H, W), np.uint8)
    full[cy0:cy1, cx0:cx1] = (crop[:, :, 3] > 10).astype(np.uint8) * 255
    cv2.imwrite(f"{out_dir}/{name}_mask.png", cv2.dilate(full, np.ones((9, 9), np.uint8)))

# preview on a flat colour
prev = np.full((340, 900, 3), (90, 60, 70), np.uint8)
ox = 10
for name, *_ in results:
    c = cv2.imread(f"{out_dir}/{name}.png", cv2.IMREAD_UNCHANGED)
    h, w = c.shape[:2]
    a = c[:, :, 3:4].astype(np.float32) / 255
    region = prev[10:10 + h, ox:ox + w]
    prev[10:10 + h, ox:ox + w] = (c[:, :, :3] * a + region * (1 - a)).astype(np.uint8)
    ox += w + 20
cv2.imwrite(f"{out_dir}/chars_preview.png", prev)
for r in results:
    print(r)
