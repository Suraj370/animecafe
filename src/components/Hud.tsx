"use client";

import type { Dispatch } from "react";
import * as C from "@/game/config";
import type { Action } from "@/game/logic";
import type { GameState } from "@/game/types";
import { Coin } from "./Counter";

const pill =
  "flex items-center rounded-full border-[3px] border-[#F3D9A4] bg-gradient-to-b from-[#5B3D63] to-[#3E2A47] text-white shadow-[0_4px_10px_rgba(40,20,40,.35)]";

const fmt = (n: number) => n.toLocaleString("en-US");

export function Hud({ s, dispatch }: { s: GameState; dispatch: Dispatch<Action> }) {
  const secs = Math.ceil(s.timeLeft);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const lowTime = secs <= 15 && s.phase === "playing";
  const target = C.targetFor(s.stage);
  return (
    <div className="absolute left-0 right-0 top-[8px] z-20 flex items-center gap-3 px-3">
      <button
        type="button"
        onClick={() => dispatch({ type: s.phase === "paused" ? "resume" : "pause" })}
        aria-label="Pause"
        className={`${pill} h-[46px] w-[46px] justify-center`}
      >
        <span className="flex gap-[5px]">
          <span className="h-[16px] w-[5px] rounded bg-white" />
          <span className="h-[16px] w-[5px] rounded bg-white" />
        </span>
      </button>
      <div className={`${pill} h-[46px] gap-2 pl-1 pr-4`}>
        <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-[20px]">🧁</span>
        <span className="text-[20px] font-semibold">Stage {C.stageLabel(s.stage)}</span>
      </div>
      <div className={`${pill} h-[46px] gap-3 pl-1 pr-4`}>
        <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFD34D] text-[20px]">⭐</span>
        <span className="flex flex-col leading-none">
          <span className="text-[11px] text-white/70">Target Score</span>
          <span className="text-[19px] font-semibold">{fmt(target)}</span>
        </span>
        <span className="h-[28px] w-[2px] bg-white/25" />
        <span className="flex flex-col leading-none">
          <span className="text-[11px] text-white/70">Score</span>
          <span className={`text-[19px] font-semibold ${s.score >= target ? "text-[#9EF0A8]" : ""}`}>{fmt(s.score)}</span>
        </span>
      </div>
      <div className={`${pill} relative h-[46px] w-[200px] gap-2 pl-2 pr-3 ${lowTime ? "timer-warn" : ""}`}>
        <span className="text-[22px]">⏱️</span>
        <span className="flex flex-1 flex-col gap-[3px]">
          <span className={`text-[20px] font-semibold leading-none tabular-nums ${lowTime ? "text-[#FF9AA8]" : ""}`}>
            {mm}:{ss}
          </span>
          <span className="h-[6px] overflow-hidden rounded-full bg-black/40">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#FFD34D] to-[#FFB13B]"
              style={{ width: `${(s.timeLeft / C.STAGE_TIME) * 100}%` }}
            />
          </span>
        </span>
      </div>
      <div className="flex-1" />
      <div className={`${pill} h-[42px] gap-2 pl-1 pr-4`}>
        <Coin size={32} />
        <span className="text-[19px] font-semibold tabular-nums">{fmt(s.progress.coins)}</span>
      </div>
      <div className={`${pill} h-[42px] gap-2 pl-2 pr-1`}>
        <span className="text-[22px]">💎</span>
        <span className="text-[19px] font-semibold tabular-nums">{fmt(s.progress.gems)}</span>
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#5BC864] text-[20px] font-bold leading-none">+</span>
      </div>
      <button
        type="button"
        aria-label="Settings"
        onClick={() => dispatch({ type: "pause" })}
        className={`${pill} h-[46px] w-[46px] justify-center text-[24px]`}
      >
        ⚙️
      </button>
    </div>
  );
}
