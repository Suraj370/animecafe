"use client";

import { useEffect, useState } from "react";
import { ENTRY_X, EXIT_X, SLOTS_X } from "@/game/config";
import { LOOKS } from "@/game/looks";
import type { Customer } from "@/game/types";
import { Character, type Expression } from "./Character";
import { ItemThumb } from "./Food";

function expressionOf(c: Customer): Expression {
  if (c.outcome === "served") return "delight";
  if (c.rejectFlash > 0) return "angry";
  return c.mood;
}

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

  const slotX = SLOTS_X[c.slot];
  const x = c.phase === "leaving" ? EXIT_X : arrived ? slotX : ENTRY_X;
  const walking = c.phase !== "waiting";
  const look = LOOKS[c.look];
  const waiting = c.phase === "waiting";

  return (
    <>
      <div
        className="absolute left-0 top-[52px]"
        style={{
          transform: `translateX(${x - 100}px)`,
          transition: `transform ${c.walkDur}s linear`,
          zIndex: c.phase === "leaving" ? 1 : 2,
        }}
      >
        <button
          type="button"
          disabled={!waiting}
          onClick={() => onServe(c.id)}
          aria-label={`Serve ${look.name}`}
          className={`block cursor-pointer disabled:cursor-default ${walking ? "walk" : "breathe"} ${
            c.rejectFlash > 0 ? "shake" : ""
          } ${holding && waiting ? "serve-glow" : ""}`}
        >
          <Character look={look} expression={expressionOf(c)} />
        </button>
        {c.outcome === "served" && <div className="reaction text-[34px]">💖</div>}
        {c.outcome === "angry" && <div className="reaction text-[34px]">💢</div>}
      </div>
      {waiting && <OrderBubble c={c} onServe={onServe} />}
    </>
  );
}

function OrderBubble({ c, onServe }: { c: Customer; onServe: (id: number) => void }) {
  const ratio = Math.max(0, c.patience / c.maxPatience);
  const x = SLOTS_X[c.slot] + 66;
  return (
    <button
      type="button"
      onClick={() => onServe(c.id)}
      className="bubble-in absolute top-[78px] z-[3] flex cursor-pointer items-stretch gap-2 rounded-[18px] border-[3px] border-white bg-white/95 p-2 pl-2 shadow-[0_8px_18px_rgba(90,40,70,.25)]"
      style={{ left: x }}
      aria-label={`${LOOKS[c.look].name}'s order`}
    >
      <span className="absolute left-[-11px] top-[56px] h-0 w-0 border-y-[9px] border-r-[12px] border-y-transparent border-r-white" />
      {/* patience meter */}
      <span className="relative w-[12px] overflow-hidden rounded-full bg-gradient-to-b from-[#7BD67B] via-[#FFD54F] to-[#FF6B6B] shadow-inner">
        <span
          className="absolute left-0 right-0 top-0 bg-[#5b4560]/80 transition-[height] duration-100"
          style={{ height: `${(1 - ratio) * 100}%` }}
        />
      </span>
      <span className="flex flex-col items-center justify-center gap-1">
        {c.order.map((line, i) => (
          <span
            key={i}
            className={`relative flex h-[66px] w-[86px] items-center justify-center rounded-xl ${
              line.done ? "opacity-40" : ""
            } ${i > 0 ? "border-t border-dashed border-[#E8D3E0]" : ""}`}
          >
            <ItemThumb item={line.item} size={84} />
            {line.done && (
              <span className="absolute inset-0 flex items-center justify-center text-[30px] font-bold text-[#39B54A]">
                ✓
              </span>
            )}
          </span>
        ))}
      </span>
    </button>
  );
}
