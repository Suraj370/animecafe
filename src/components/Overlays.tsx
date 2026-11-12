"use client";

import type { Dispatch, ReactNode } from "react";
import * as C from "@/game/config";
import type { Action } from "@/game/logic";
import { LOOKS } from "@/game/looks";
import type { GameState } from "@/game/types";
import { CharSprite } from "./Scene";
import { Coin } from "./Counter";

type Props = { s: GameState; dispatch: Dispatch<Action> };

const btn =
  "whitespace-nowrap rounded-full border-[3px] border-[#F3D9A4] px-6 py-2 text-[20px] font-semibold text-white shadow-[0_4px_10px_rgba(40,20,40,.35)] transition hover:brightness-110 active:scale-95";
const primary = `${btn} bg-gradient-to-b from-[#FF8FB5] to-[#E0588A]`;
const secondary = `${btn} bg-gradient-to-b from-[#5B3D63] to-[#3E2A47]`;

function Modal({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#2a1630]/55 backdrop-blur-[2px]">
      <div
        className={`pop-in relative rounded-[28px] border-[5px] border-white bg-gradient-to-b from-[#FFF7FB] to-[#F6E2EE] p-7 text-[#5B3D63] shadow-[0_20px_50px_rgba(40,10,40,.45)] ${
          wide ? "w-[760px]" : "w-[520px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function MenuOverlay({ s, dispatch }: Props) {
  return (
    <Modal wide>
      <div className="flex gap-6">
        <div className="relative h-[300px] w-[200px] shrink-0 overflow-hidden">
          <div className="breathe absolute bottom-0 left-[4px] origin-bottom-left scale-[1.28]">
            <CharSprite look={LOOKS[1]} />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold uppercase tracking-[.3em] text-[#E0588A]">Sakura Street</div>
          <h1 className="title-font text-[52px] leading-none text-[#5B3D63]">Anime Café</h1>
          <p className="mt-2 text-[15px] text-[#8C6A80]">Customers stroll in one by one. Cook their pancakes & smoothies before their patience runs out!</p>
          <ol className="mt-3 space-y-1 text-[14px]">
            <li>✋ <b>Drag & drop</b> everything — grab an item and drop it where it goes (tapping works too).</li>
            <li>🥞 <b>Pancakes:</b> drag Flour, Eggs, Milk into the bowl → drag batter to the griddle → drag the golden pancake to the plate → drag toppings on.</li>
            <li>🥤 <b>Drinks:</b> drag Milk + one Fruit (+ Ice) into the blender → tap ⏻ → cream optional.</li>
            <li>🙋 <b>Serve:</b> drag the plate or cup onto the customer. Spares go on the Premade Slate.</li>
          </ol>
          <div className="mt-5 flex items-center gap-3">
            <button type="button" className={primary} onClick={() => dispatch({ type: "start" })}>
              {s.progress.tutorialDone ? `▶ Start Stage ${C.stageLabel(s.progress.stage)}` : "▶ Play Tutorial"}
            </button>
            {s.progress.tutorialDone && (
              <button type="button" className={secondary} onClick={() => dispatch({ type: "tutorial" })}>
                📖 Tutorial
              </button>
            )}
            <button type="button" className={secondary} onClick={() => dispatch({ type: "upgrades", open: true })}>
              🔧
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function PauseOverlay({ s, dispatch }: Props) {
  return (
    <Modal>
      <h2 className="title-font text-center text-[40px]">Paused</h2>
      <p className="text-center text-[15px] text-[#8C6A80]">
        {s.tutorial !== null
          ? "Tutorial"
          : `Stage ${C.stageLabel(s.stage)} · ${Math.ceil(s.timeLeft)}s left · Score ${s.score}`}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <button type="button" className={primary} onClick={() => dispatch({ type: "resume" })}>
          ▶ Resume
        </button>
        {s.tutorial === null && (
          <button type="button" className={secondary} onClick={() => dispatch({ type: "retry" })}>
            ↻ Restart stage
          </button>
        )}
        <button type="button" className={secondary} onClick={() => dispatch({ type: "tutorial" })}>
          📖 {s.tutorial === null ? "How to play" : "Restart tutorial"}
        </button>
        <button type="button" className={secondary} onClick={() => dispatch({ type: "menu" })}>
          ⌂ Main menu
        </button>
        <button
          type="button"
          className="mt-2 text-[13px] text-[#B08AA6] underline"
          onClick={() => {
            if (window.confirm("Reset all coins, upgrades and stage progress?")) dispatch({ type: "resetProgress" });
          }}
        >
          Reset progress
        </button>
      </div>
    </Modal>
  );
}

export function EndOverlay({ s, dispatch }: Props) {
  const r = s.result;
  if (!r) return null;
  return (
    <Modal>
      <h2 className="title-font text-center text-[42px]">{r.cleared ? "Stage Clear!" : "Time's Up!"}</h2>
      <div className="my-2 flex justify-center gap-2 text-[52px]">
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= r.stars ? "star-in" : "opacity-25 grayscale"} style={{ animationDelay: `${i * 0.2}s` }}>
            ⭐
          </span>
        ))}
      </div>
      <p className="text-center text-[13px] text-[#8C6A80]">
        {C.starGoals(r.stage).map((g, i) => `${"⭐".repeat(i + 1)} ${g.toLocaleString()}`).join("  ·  ")}
      </p>
      <div className="mx-auto mt-2 grid w-[340px] grid-cols-2 gap-y-1 text-[17px]">
        <span>Score</span>
        <b className="text-right">
          {s.score.toLocaleString()} / {C.targetFor(r.stage).toLocaleString()}
        </b>
        <span>Customers served</span>
        <b className="text-right">{s.served}</b>
        <span>Customers missed</span>
        <b className="text-right">{s.lost}</b>
        <span>Coins earned</span>
        <b className="flex items-center justify-end gap-1">
          <Coin size={16} />
          {s.earnedCoins}
        </b>
        {r.gems > 0 && (
          <>
            <span>Gems</span>
            <b className="text-right">💎 +{r.gems}</b>
          </>
        )}
      </div>
      {!r.cleared && <p className="mt-3 text-center text-[14px] text-[#8C6A80]">Tip: upgrade the Griddle for a third slot and slower burning.</p>}
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" className={secondary} onClick={() => dispatch({ type: "retry" })}>
          ↻ Retry
        </button>
        {r.cleared && (
          <button type="button" className={primary} onClick={() => dispatch({ type: "next" })}>
            Next Stage ▶
          </button>
        )}
        <button type="button" className={secondary} onClick={() => dispatch({ type: "upgrades", open: true })}>
          🔧
        </button>
      </div>
    </Modal>
  );
}

export function UpgradesOverlay({ s, dispatch }: Props) {
  const p = s.progress;
  const rows = [
    {
      id: "mixer" as const,
      icon: "🥣",
      name: "Mixer",
      lv: p.mixerLv,
      max: C.MAX_LV,
      cost: C.mixerCost(p.mixerLv),
      effect: `Whisk ${C.whiskTime(p.mixerLv).toFixed(1)}s · Blend ${C.blendTime(p.mixerLv).toFixed(1)}s`,
    },
    {
      id: "griddle" as const,
      icon: "🍳",
      name: "Griddle",
      lv: p.griddleLv,
      max: C.MAX_LV,
      cost: C.griddleCost(p.griddleLv),
      effect: `Cook ${C.cookTime(p.griddleLv).toFixed(1)}s · Burns after ${C.burnTime(p.griddleLv).toFixed(1)}s · ${C.griddleSlots(p.griddleLv)} slots${p.griddleLv < 3 ? " (3 at Lv.3)" : ""}`,
    },
    {
      id: "slate" as const,
      icon: "🗄️",
      name: "Premade Slate",
      lv: p.slateUnlocked,
      max: C.SLATE_SIZE,
      cost: C.slateCost(p.slateUnlocked),
      effect: `${p.slateUnlocked} of ${C.SLATE_SIZE} storage slots unlocked`,
    },
  ];
  return (
    <Modal>
      <div className="flex items-center justify-between">
        <h2 className="title-font text-[36px]">Upgrades</h2>
        <span className="flex items-center gap-1 rounded-full bg-[#3E2A47] px-3 py-1 text-[17px] font-semibold text-white">
          <Coin size={20} /> {p.coins.toLocaleString()}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => {
          const max = r.lv >= r.max;
          const afford = !max && p.coins >= r.cost;
          return (
            <div key={r.id} className="flex items-center gap-3 rounded-[16px] bg-white/80 p-3">
              <span className="text-[36px]">{r.icon}</span>
              <div className="flex-1">
                <div className="text-[18px] font-semibold">
                  {r.name} <span className="text-[14px] text-[#B08AA6]">{r.id === "slate" ? `${r.lv}/${r.max}` : `Lv.${r.lv}`}</span>
                </div>
                <div className="text-[13px] text-[#8C6A80]">{r.effect}</div>
              </div>
              <button
                type="button"
                disabled={max}
                onClick={() => dispatch({ type: "upgrade", what: r.id })}
                className={`flex min-w-[100px] items-center justify-center gap-1 rounded-full px-3 py-2 text-[16px] font-bold text-white ${
                  max ? "bg-[#D9C2D3]" : afford ? "bg-gradient-to-b from-[#7BD67B] to-[#46A84E]" : "bg-[#C9B7C4]"
                }`}
              >
                {max ? "MAX" : (
                  <>
                    <Coin size={16} /> {r.cost}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <button type="button" className={primary} onClick={() => dispatch({ type: "upgrades", open: false })}>
          Done
        </button>
      </div>
    </Modal>
  );
}
