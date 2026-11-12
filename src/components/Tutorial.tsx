"use client";

import { useEffect, useState, type Dispatch } from "react";
import { COUNTER_Y, H, stageLabel, W } from "@/game/config";
import type { Action } from "@/game/logic";
import { LOOKS } from "@/game/looks";
import { TUTORIAL } from "@/game/tutorial";
import type { GameState } from "@/game/types";
import { CharSprite } from "./Scene";

type Rect = { x: number; y: number; w: number; h: number };

/** Tracks a [data-tut] element's box in design pixels (follows walking customers etc). */
function useTargetRect(target: string | undefined) {
  const [rect, setRect] = useState<Rect | null>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const root = document.querySelector<HTMLElement>(".game-root");
      const el = target ? root?.querySelector<HTMLElement>(`[data-tut="${target}"]`) : null;
      if (root && el) {
        const r = el.getBoundingClientRect();
        const rr = root.getBoundingClientRect();
        const k = rr.width / W;
        const next = {
          x: Math.round((r.left - rr.left) / k),
          y: Math.round((r.top - rr.top) / k),
          w: Math.round(r.width / k),
          h: Math.round(r.height / k),
        };
        setRect((prev) =>
          prev && prev.x === next.x && prev.y === next.y && prev.w === next.w && prev.h === next.h ? prev : next,
        );
      } else {
        setRect(null);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return rect;
}

export function TutorialOverlay({ s, dispatch }: { s: GameState; dispatch: Dispatch<Action> }) {
  const index = s.tutorial ?? 0;
  const step = TUTORIAL[index];
  const target = step.target?.(s);
  const rect = useTargetRect(target);
  const destRect = useTargetRect(step.dest?.(s));
  const last = index === TUTORIAL.length - 1;

  const pad = 8;
  const holes = [rect, destRect].filter((r): r is Rect => !!r);
  // Keep the guide panel away from the targets and from the guest's order bubble.
  const anyLow = holes.some((r) => r.y + r.h / 2 > COUNTER_Y);
  const panelStyle = !holes.length
    ? { top: 200, left: 286, width: 640 }
    : anyLow
      ? { top: 56, left: 790, width: 410 }
      : { top: 330, left: 286, width: 640 };
  const pointsUp = rect ? rect.y < COUNTER_Y : false;
  const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

  return (
    <div className="pointer-events-none absolute inset-0 z-[35]">
      {/* spotlight: dims everything except the grab target and drop target */}
      <svg width={W} height={H} className="absolute inset-0" aria-hidden>
        <defs>
          <mask id="tut-mask">
            <rect width={W} height={H} fill="white" />
            {holes.map((r, i) => (
              <rect key={i} x={r.x - pad} y={r.y - pad} width={r.w + pad * 2} height={r.h + pad * 2} rx={20} fill="black" />
            ))}
          </mask>
        </defs>
        <rect width={W} height={H} fill="rgba(30,15,35,.55)" mask="url(#tut-mask)" />
      </svg>
      {rect && (
        <div className="tut-spot absolute rounded-[20px]" style={{ left: rect.x - pad, top: rect.y - pad, width: rect.w + pad * 2, height: rect.h + pad * 2 }} />
      )}
      {destRect && (
        <div
          className="tut-spot tut-dest absolute rounded-[20px]"
          style={{ left: destRect.x - pad, top: destRect.y - pad, width: destRect.w + pad * 2, height: destRect.h + pad * 2 }}
        />
      )}

      {/* drag hand: slides from the item to where it should be dropped */}
      {rect && destRect && (
        <div
          key={`${target}-${step.dest?.(s)}`}
          className="tut-drag-hand emoji absolute text-[46px]"
          style={
            {
              left: center(rect).x - 16,
              top: center(rect).y - 8,
              "--dx": `${center(destRect).x - center(rect).x}px`,
              "--dy": `${center(destRect).y - center(rect).y}px`,
            } as React.CSSProperties
          }
        >
          👆
        </div>
      )}

      {/* pointing hand */}
      {rect && !destRect && !step.wait && (
        <div
          className={`tut-hand emoji absolute text-[46px] ${pointsUp ? "" : "tut-hand-down"}`}
          style={{
            left: rect.x + rect.w / 2 - 23,
            top: pointsUp ? rect.y + rect.h + 4 : rect.y - 62,
          }}
        >
          {pointsUp ? "👆" : "👇"}
        </div>
      )}

      {/* guide panel */}
      <div
        key={index}
        className="pop-in pointer-events-auto absolute flex items-center gap-4 rounded-[24px] border-[4px] border-white bg-gradient-to-b from-[#FFF7FB] to-[#F6E2EE] p-4 text-[#5B3D63] shadow-[0_14px_36px_rgba(40,10,40,.45)]"
        style={panelStyle}
      >
        <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-full border-[3px] border-[#F6AFC0] bg-[#FDE6EE]">
          <CharSprite look={LOOKS[1]} className="absolute left-[-33px] top-[-10px]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[.2em] text-[#E0588A]">
            <span>Tutorial · Sakura</span>
            <span className="tracking-normal text-[#B08AA6]">
              {index + 1} / {TUTORIAL.length}
            </span>
          </div>
          <p className="mt-1 text-[17px] leading-snug">
            {step.text}
            {step.wait && <span className="tut-dots ml-1" />}
          </p>
          <div className="mt-2 flex items-center justify-end gap-3">
            {!last && (
              <button
                type="button"
                onClick={() => dispatch({ type: "tutorialSkip" })}
                className="text-[13px] text-[#B08AA6] underline"
              >
                Skip tutorial
              </button>
            )}
            {step.next && (
              <button
                type="button"
                onClick={() => dispatch({ type: "tutorialNext" })}
                className="rounded-full border-[3px] border-[#F3D9A4] bg-gradient-to-b from-[#FF8FB5] to-[#E0588A] px-5 py-1 text-[17px] font-semibold text-white shadow-md active:scale-95"
              >
                {last ? `▶ Start Stage ${stageLabel(s.progress.stage)}` : "Next ▶"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
