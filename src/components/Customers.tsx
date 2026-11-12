"use client";

import { useEffect, useState } from "react";
import { ENTRY_X, EXIT_X, SLOTS_X } from "@/game/config";
import { LOOKS } from "@/game/looks";
import type { Customer } from "@/game/types";
import { useDrag } from "./drag";
import { ItemThumb } from "./Food";
import { CharSprite } from "./Scene";

export function CustomerView({
  c,
  holding,
  onServe,
}: {
  c: Customer;
  holding: boolean;
  onServe: (id: number) => void;
}) {
  // Mount off-screen, then on the next frames move to the slot so the CSS transition plays.
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setArrived(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  const look = LOOKS[c.look];
  const slotX = SLOTS_X[c.slot];
  const x = c.phase === "leaving" ? EXIT_X : arrived ? slotX : ENTRY_X;
  const walking = c.phase !== "waiting";
  const waiting = c.phase === "waiting";
  const angry = c.rejectFlash > 0 || (waiting && c.mood === "angry");
  const { dropClass } = useDrag();
  const drop = dropClass(`customer-${c.id}`);

  return (
    <div
      className="absolute left-0"
      style={{
        top: look.top,
        transform: `translateX(${x - look.anchor}px)`,
        transition: `transform ${c.walkDur}s linear`,
        zIndex: c.phase === "leaving" ? 1 : 2,
      }}
    >
      <button
        type="button"
        disabled={!waiting}
        onClick={() => onServe(c.id)}
        aria-label={`Serve ${look.name}`}
        data-tut="customer"
        data-drop={`customer-${c.id}`}
        className={`block cursor-pointer disabled:cursor-default ${walking ? "walk" : "breathe"} ${
          c.rejectFlash > 0 ? "shake" : ""
        } ${(holding && waiting) || drop ? "serve-glow" : ""} ${drop === "drop-over" ? "serve-hover" : ""} ${
          angry ? "mood-angry" : ""
        } ${c.outcome === "served" ? "mood-happy" : ""}`}
      >
        <CharSprite look={look} />
      </button>
      {c.outcome === "served" && (
        <div className="reaction emoji text-[34px]" style={{ left: look.anchor + 30, top: 0 }}>
          💖
        </div>
      )}
      {(c.outcome === "angry" || (waiting && c.mood === "angry")) && (
        <div className="anger emoji text-[30px]" style={{ left: look.anchor + 26, top: 4 }}>
          💢
        </div>
      )}
    </div>
  );
}

/** Order bubble, styled after the mockup: cream card, dark outline, patience bar on the left. */
export function OrderBubble({ c, onServe }: { c: Customer; onServe: (id: number) => void }) {
  const ratio = Math.max(0, c.patience / c.maxPatience);
  const { dropClass } = useDrag();
  return (
    <button
      type="button"
      onClick={() => onServe(c.id)}
      data-tut="bubble"
      data-drop={`customer-${c.id}`}
      aria-label={`${LOOKS[c.look].name}'s order`}
      className={`bubble-in absolute z-[3] flex cursor-pointer items-stretch gap-2 rounded-[16px] border-[3px] border-[#3B2A3A] bg-[#FCF4EE] p-[7px] shadow-[0_6px_14px_rgba(60,30,50,.3)] ${dropClass(
        `customer-${c.id}`,
      )}`}
      style={{ left: SLOTS_X[c.slot] + 52, top: 82, width: 146, height: 166 }}
    >
      {/* pointer towards the customer */}
      <span className="absolute left-[-15px] top-[112px] h-0 w-0 border-y-[11px] border-r-[14px] border-y-transparent border-r-[#3B2A3A]" />
      <span className="absolute left-[-10px] top-[115px] h-0 w-0 border-y-[8px] border-r-[10px] border-y-transparent border-r-[#FCF4EE]" />
      {/* patience meter */}
      <span className="relative w-[16px] shrink-0 overflow-hidden rounded-[8px] border-[2.5px] border-[#3B2A3A] bg-gradient-to-b from-[#58C94F] via-[#F2D33C] to-[#EE5A3C]">
        <span
          className="absolute left-0 right-0 top-0 bg-[#4A3550] transition-[height] duration-100"
          style={{ height: `${(1 - ratio) * 100}%` }}
        />
      </span>
      <span className="flex flex-1 flex-col items-center justify-around">
        {c.order.map((line, i) => (
          <span key={i} className={`relative flex h-[70px] w-[104px] items-center justify-center ${line.done ? "opacity-40" : ""}`}>
            <ItemThumb item={line.item} size={line.item.kind === "pancake" ? 106 : 112} />
            {line.done && (
              <span className="absolute inset-0 flex items-center justify-center text-[34px] font-bold text-[#39B54A] drop-shadow">
                ✓
              </span>
            )}
          </span>
        ))}
      </span>
    </button>
  );
}
