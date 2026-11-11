"use client";

import type { Dispatch } from "react";
import * as C from "@/game/config";
import { canAffordUpgrade, type Action } from "@/game/logic";
import type { GameState, Ingredient } from "@/game/types";
import { Coin } from "./Counter";

function routeFor(ing: Ingredient, mode: GameState["mode"]) {
  const drink = mode === "drink";
  switch (ing) {
    case "flour":
    case "eggs":
      return "bowl";
    case "milk":
      return drink ? "blender" : "bowl";
    case "strawberry":
    case "blueberry":
    case "banana":
      return drink ? "blender" : "plate";
    case "ice":
      return "blender";
    case "cream":
      return drink ? "cup" : "plate";
    default:
      return "plate";
  }
}

function UpgradeCard({
  label,
  lv,
  cost,
  icon,
  coins,
  onClick,
}: {
  label: string;
  lv: number;
  cost: number;
  icon: string;
  coins: number;
  onClick: () => void;
}) {
  const max = lv >= C.MAX_LV;
  const afford = !max && coins >= cost;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[96px] w-[116px] flex-col items-center justify-between rounded-[14px] border-[3px] border-white bg-gradient-to-b from-[#FFF8FC] to-[#F2E1EE] p-1 shadow-[0_3px_8px_rgba(90,40,70,.2)]"
    >
      <span className="flex items-center gap-1">
        <span className="text-[28px]">{icon}</span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[14px] font-semibold text-[#5B3D63]">{label}</span>
          <span className="text-[12px] text-[#9A7B90]">Lv.{lv}</span>
        </span>
      </span>
      <span
        className={`flex w-full items-center justify-center gap-1 rounded-full py-[3px] text-[14px] font-bold ${
          max ? "bg-[#D9C2D3] text-white" : afford ? "bg-gradient-to-b from-[#7BD67B] to-[#46A84E] text-white" : "bg-[#C9B7C4] text-white/90"
        }`}
      >
        {max ? (
          "MAX"
        ) : (
          <>
            <span>⬆</span>
            <Coin size={14} />
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
  return (
    <div className="absolute bottom-0 left-0 h-[170px] w-[1280px] border-t-[4px] border-[#C9A7C0] bg-gradient-to-b from-[#EEDFEE] to-[#DCC6DC]">
      {/* upgrades */}
      <div className="absolute left-[10px] top-[8px] w-[250px]">
        <button
          type="button"
          onClick={() => dispatch({ type: "upgrades", open: true })}
          className="relative flex h-[42px] w-full items-center justify-center gap-2 rounded-full border-[3px] border-[#F3D9A4] bg-gradient-to-b from-[#5B3D63] to-[#3E2A47] text-[19px] font-semibold text-white shadow-[0_3px_8px_rgba(40,20,40,.3)]"
        >
          🔧 Upgrades
          {canAffordUpgrade(p) && (
            <span className="absolute right-[-4px] top-[-8px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#FF4D6A] text-[14px] font-bold">
              !
            </span>
          )}
        </button>
        <div className="mt-[6px] flex justify-between">
          <UpgradeCard label="Mixer" icon="🥣" lv={p.mixerLv} cost={C.mixerCost(p.mixerLv)} coins={p.coins} onClick={() => dispatch({ type: "upgrade", what: "mixer" })} />
          <UpgradeCard label="Griddle" icon="🍳" lv={p.griddleLv} cost={C.griddleCost(p.griddleLv)} coins={p.coins} onClick={() => dispatch({ type: "upgrade", what: "griddle" })} />
        </div>
      </div>

      {/* ingredients */}
      <div className="absolute left-[272px] top-[14px] flex gap-[6px]">
        {C.INGREDIENTS.map((ing) => {
          const locked = ing.id === "chocolate" && chocLocked;
          const route = routeFor(ing.id, s.mode);
          return (
            <button
              key={ing.id}
              type="button"
              onClick={() => dispatch({ type: "ingredient", ing: ing.id })}
              className="group relative flex h-[140px] w-[81px] flex-col items-center rounded-[14px] border-[3px] border-white bg-gradient-to-b from-[#FFF6FA] to-[#F5DDEA] pt-2 shadow-[0_3px_8px_rgba(90,40,70,.2)] transition hover:-translate-y-[3px] active:translate-y-[1px]"
            >
              <span className="flex h-[70px] w-[68px] items-center justify-center rounded-[12px] bg-white/80 text-[44px] emoji transition group-active:scale-90">
                {ing.emoji}
              </span>
              <span className="mt-2 flex h-[34px] w-[74px] items-center justify-center rounded-[8px] bg-white px-1 text-center text-[12px] font-semibold leading-tight text-[#5B3D63] shadow-sm">
                {ing.label}
              </span>
              {!locked && (
                <span className="absolute bottom-[3px] text-[9px] font-semibold uppercase tracking-wide text-[#B08AA6]">→ {route}</span>
              )}
              {locked && (
                <span className="absolute inset-0 flex flex-col items-center justify-center rounded-[11px] bg-[#3E2A47]/70 text-white">
                  <span className="text-[26px]">🔒</span>
                  <span className="text-[13px] font-bold">Lv. {C.CHOCOLATE_STAGE}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* trash */}
      <button
        type="button"
        onClick={() => dispatch({ type: "trash" })}
        aria-label="Trash"
        className={`absolute right-[12px] top-[18px] flex h-[130px] w-[110px] items-center justify-center rounded-[18px] transition ${
          holding ? "bg-[#FFD6E0] shadow-[0_0_0_4px_#FF8FAB]" : ""
        }`}
      >
        <svg viewBox="0 0 100 120" width={88} height={106} aria-hidden>
          <rect x={14} y={14} width={72} height={14} rx={6} fill="#E86F9C" />
          <rect x={38} y={4} width={24} height={12} rx={4} fill="#E86F9C" />
          <path d="M20 32 L80 32 L74 112 Q50 118 26 112Z" fill="#F7A8C2" />
          <g stroke="#E86F9C" strokeWidth={6} strokeLinecap="round">
            <line x1={38} y1={46} x2={40} y2={100} />
            <line x1={50} y1={46} x2={50} y2={100} />
            <line x1={62} y1={46} x2={60} y2={100} />
          </g>
        </svg>
      </button>
    </div>
  );
}
