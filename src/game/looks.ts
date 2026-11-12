/**
 * Customer sprites, cut out of the mockup by art-src/extract_chars.py.
 * `top` is where the sprite's top edge sits in design px, `anchor` is the
 * x of the body's centre inside the sprite (lined up with SLOTS_X).
 */
export interface Look {
  name: string;
  src: string;
  w: number;
  h: number;
  top: number;
  anchor: number;
}

export const LOOKS: Look[] = [
  { name: "Ren", src: "/art/char1.webp", w: 227, h: 243, top: 69, anchor: 114 },
  { name: "Sakura", src: "/art/char2.webp", w: 150, h: 218, top: 94, anchor: 74 },
  { name: "Kaito", src: "/art/char3.webp", w: 199, h: 243, top: 69, anchor: 98 },
];
