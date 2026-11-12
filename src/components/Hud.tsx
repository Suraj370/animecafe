"use client";

import type { Dispatch } from "react";
import * as C from "@/game/config";
import type { Action } from "@/game/logic";
import type { GameState } from "@/game/types";

const fmt = (n: number) => n.toLocaleString("en-US");

/* The HUD pills are painted in the background; this writes the live values into them (mockup px). */
export function Hud({ s, dispatch }: { s: GameState; dispatch: Dispatch<Action> }) {
  const secs = Math.ceil(s.timeLeft);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const lowTime = secs <= 15 && s.phase === "playing";
  const target = C.targetFor(s.stage);
  const pause = () => dispatch({ type: s.phase === "paused" ? "resume" : "pause" });
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <button type="button" onClick={pause} aria-label="Pause" className="pointer-events-auto absolute left-[2px] top-[2px] h-[44px] w-[44px] rounded-full" />

      <span className="hud-text absolute left-[116px] top-[7px] flex h-[32px] w-[98px] items-center justify-center text-[21px] font-semibold text-[#3B2320]">
        {s.tutorial !== null ? "Tutorial" : `Stage ${C.stageLabel(s.stage)}`}
      </span>

      <span className="hud-num absolute left-[282px] top-[17px] w-[76px] text-center text-[23px] font-semibold italic leading-none text-[#FFEFA8]">
        {fmt(target)}
      </span>
      <span
        className={`hud-num absolute left-[404px] top-[17px] w-[90px] text-center text-[23px] font-semibold leading-none ${
          s.score >= target ? "text-[#A8F0A0]" : "text-[#FFF6E6]"
        }`}
      >
        {fmt(s.score)}
      </span>

      <span
        className={`hud-num absolute left-[612px] top-[3px] w-[100px] text-center text-[25px] font-semibold tabular-nums leading-[28px] ${
          lowTime ? "timer-blink text-[#FF9AA8]" : "text-white"
        }`}
      >
        {mm}:{ss}
      </span>
      <span className="absolute left-[590px] top-[33px] h-[10px] w-[158px] overflow-hidden rounded-full bg-[#6B4A62]">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-[#FFE07A] to-[#F5B82E]"
          style={{ width: `${(s.timeLeft / C.STAGE_TIME) * 100}%` }}
        />
      </span>

      <span className="hud-num absolute left-[876px] top-[6px] w-[84px] text-center text-[22px] font-semibold tabular-nums leading-[28px] text-[#FFF1D0]">
        {fmt(s.progress.coins)}
      </span>
      <span className="hud-num absolute left-[1046px] top-[6px] w-[62px] text-center text-[22px] font-semibold tabular-nums leading-[28px] text-[#FFF6FC]">
        {fmt(s.progress.gems)}
      </span>

      <button type="button" onClick={pause} aria-label="Settings" className="pointer-events-auto absolute left-[1170px] top-0 h-[44px] w-[43px] rounded-full" />
    </div>
  );
}
