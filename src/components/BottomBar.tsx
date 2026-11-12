"use client";

import type { Dispatch } from "react";
import * as C from "@/game/config";
import { canAffordUpgrade, type Action } from "@/game/logic";
import type { GameState } from "@/game/types";
import { Coin } from "./Counter";
import { useDrag } from "./drag";

/* Painted in the background; these are hit areas + live labels (mockup px). */

// Ingredient tiles as painted: left x of each, all 84 × 140 from y 520.
const TILE_X = [233, 321, 409, 494, 582, 669, 757, 846, 934, 1024];

function UpgradeCard({
  left,
  lv,
  cost,
  coins,
  onClick,
  label,
}: {
  left: number;
  lv: number;
  cost: number;
  coins: number;
  onClick: () => void;
  label: string;
}) {
  const max = lv >= C.MAX_LV;
  const afford = !max && coins >= cost;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Upgrade ${label}`}
      className="absolute top-[562px] h-[106px] rounded-[14px] transition-transform active:scale-[.97]"
      style={{ left, width: left === 0 ? 103 : 117 }}
    >
      <span
        className="absolute text-center text-[15px] font-semibold text-[#4A3040]"
        style={{ left: left === 0 ? 50 : 64, top: 33, width: 48 }}
      >
        Lv.{lv}
      </span>
      <span
        className={`absolute flex items-center justify-center gap-[3px] text-[16px] font-bold ${afford ? "text-white" : "text-white/70"}`}
        style={{ left: left === 0 ? 36 : 50, top: 69, width: 60, textShadow: "0 1px 0 rgba(30,60,30,.6)" }}
      >
        {max ? (
          "MAX"
        ) : (
          <>
            <Coin size={15} />
            {cost}
          </>
        )}
      </span>
    </button>
  );
}

export function BottomBar({ s, dispatch }: { s: GameState; dispatch: Dispatch<Action> }) {
  const p = s.progress;
  const chocLocked = s.stage < C.CHOCOLATE_STAGE;
  const holding = !!s.held;
  const { draggable, dropClass, isDragging } = useDrag();
  return (
    <>
      {/* upgrades */}
      <button
        type="button"
        onClick={() => dispatch({ type: "upgrades", open: true })}
        aria-label="Upgrades"
        className="absolute left-0 top-[496px] h-[54px] w-[162px] rounded-[14px] transition-transform active:scale-[.97]"
      >
        {canAffordUpgrade(p) && (
          <span className="absolute right-[-6px] top-[-8px] flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-white bg-[#E8383D] text-[14px] font-bold text-white shadow">
            !
          </span>
        )}
      </button>
      <UpgradeCard left={0} label="Mixer" lv={p.mixerLv} cost={C.mixerCost(p.mixerLv)} coins={p.coins} onClick={() => dispatch({ type: "upgrade", what: "mixer" })} />
      <UpgradeCard left={106} label="Griddle" lv={p.griddleLv} cost={C.griddleCost(p.griddleLv)} coins={p.coins} onClick={() => dispatch({ type: "upgrade", what: "griddle" })} />

      {/* ingredients */}
      {C.INGREDIENTS.map((ing, i) => {
        const locked = ing.id === "chocolate" && chocLocked;
        return (
          <button
            key={ing.id}
            type="button"
            onClick={() => dispatch({ type: "ingredient", ing: ing.id })}
            data-tut={`ing-${ing.id}`}
            {...draggable(locked ? null : { kind: "ingredient", ing: ing.id })}
            aria-label={ing.label}
            className={`absolute top-[520px] h-[140px] w-[84px] rounded-[14px] transition hover:-translate-y-[3px] active:translate-y-[1px] ${
              locked ? "" : "cursor-grab"
            } ${isDragging((d) => d.kind === "ingredient" && d.ing === ing.id) ? "ring-4 ring-[#FFC93C]" : ""}`}
            style={{ left: TILE_X[i] }}
          >
            {/* once chocolate unlocks, cover the painted padlock */}
            {ing.id === "chocolate" && !locked && (
              <span className="absolute left-[6px] top-[8px] flex h-[86px] w-[72px] items-center justify-center rounded-[10px] bg-[#F7EEF3]">
                <svg viewBox="0 0 60 50" width={58} height={48} aria-hidden>
                  <rect x={6} y={8} width={48} height={34} rx={4} fill="#5B3420" stroke="#3A1E10" strokeWidth={2} />
                  {[0, 1, 2].map((c) =>
                    [0, 1].map((r) => (
                      <rect key={`${c}${r}`} x={10 + c * 15} y={12 + r * 15} width={12} height={12} rx={2} fill="#7A4A2E" stroke="#4A2614" />
                    )),
                  )}
                </svg>
              </span>
            )}
          </button>
        );
      })}

      {/* trash */}
      <button
        type="button"
        onClick={() => dispatch({ type: "trash" })}
        aria-label="Trash"
        data-drop="trash"
        className={`absolute left-[1122px] top-[520px] h-[148px] w-[91px] rounded-[16px] transition ${
          holding ? "shadow-[0_0_0_4px_#FF8FAB]" : ""
        } ${dropClass("trash")}`}
      />
    </>
  );
}
