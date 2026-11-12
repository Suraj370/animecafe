import type { CSSProperties } from "react";
import { COUNTER_Y, H, W } from "@/game/config";
import type { Look } from "@/game/looks";

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: 150 + ((i * 167) % 960),
  delay: (i * 1.37) % 9,
  dur: 7 + ((i * 2.3) % 5),
  size: 7 + ((i * 5) % 6),
}));

/** The café — the mockup with everything live erased (art-src/make_bg.py). */
export function Background() {
  return (
    <>
      <div
        className="absolute left-0 top-0 bg-cover"
        style={{ width: W, height: H, backgroundImage: "url(/art/bg.webp)" }}
        aria-hidden
      />
      {/* petals drifting past the windows */}
      <div className="pointer-events-none absolute left-0 top-0 overflow-hidden" style={{ width: W, height: COUNTER_Y }}>
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size * 0.75,
              animationDelay: `-${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}

/** A customer sprite cut from the mockup. */
export function CharSprite({ look, className = "", style }: { look: Look; className?: string; style?: CSSProperties }) {
  return (
    <div
      role="img"
      aria-label={look.name}
      className={className}
      style={{
        width: look.w,
        height: look.h,
        backgroundImage: `url(${look.src})`,
        backgroundSize: "100% 100%",
        ...style,
      }}
    />
  );
}
