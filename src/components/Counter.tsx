"use client";

import type { Dispatch } from "react";
import * as C from "@/game/config";
import type { Action } from "@/game/logic";
import type { GameState } from "@/game/types";
import { DrinkCup, GriddleCake, ItemThumb, PancakeStack } from "./Food";

type Props = { s: GameState; dispatch: Dispatch<Action> };

const station =
  "absolute flex flex-col items-center justify-center rounded-[18px] transition-transform active:scale-[.97]";

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-[8px] w-full overflow-hidden rounded-full bg-black/15">
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  );
}

function ModeTabs({ s, dispatch }: Props) {
  const tab = (mode: "pancake" | "drink", label: string, icon: React.ReactNode) => {
    const active = s.mode === mode;
    return (
      <button
        type="button"
        onClick={() => dispatch({ type: "mode", mode })}
        className={`flex h-[66px] w-[112px] items-center gap-1 rounded-[16px] border-[3px] px-1 text-[15px] font-semibold transition ${
          active
            ? "border-[#E86F9C] bg-white text-[#7B3B5C] shadow-[0_0_0_4px_rgba(255,180,210,.6),0_4px_10px_rgba(120,50,80,.25)]"
            : "border-[#D9C2D3] bg-[#F4E9F1] text-[#8C6A80] opacity-80 hover:opacity-100"
        }`}
      >
        <span className="flex h-[48px] w-[46px] items-center justify-center">{icon}</span>
        {label}
      </button>
    );
  };
  return (
    <div className="absolute left-[10px] top-[368px] flex flex-col gap-3 rounded-[20px] bg-[#EBD6E3] p-2 shadow-inner">
      {tab("pancake", "Pancake", <PancakeStack count={2} toppings={["syrup"]} width={46} />)}
      {tab("drink", "Drink", <DrinkCup drink={{ fruit: "blueberry", ice: false, cream: false }} width={26} />)}
      <div className="text-center text-[10px] text-[#9A7B90]">Space to switch</div>
    </div>
  );
}

function BowlStation({ s, dispatch }: Props) {
  const b = s.bowl;
  const whisking = b.whisk > 0;
  const batter = b.batter > 0 || whisking;
  return (
    <button type="button" onClick={() => dispatch({ type: "bowl" })} className={`${station} left-[136px] top-[364px] h-[180px] w-[140px]`}>
      <svg viewBox="0 0 140 120" width={136} height={116} overflow="visible" aria-hidden>
        <ellipse cx={70} cy={112} rx={56} ry={7} fill="rgba(90,40,60,.15)" />
        <path d="M8 50 Q12 112 70 112 Q128 112 132 50Z" fill="#F7F1EA" stroke="#D9C9BA" strokeWidth={2} />
        <path d="M18 64 Q26 104 70 106" stroke="#fff" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round" />
        <ellipse cx={70} cy={50} rx={62} ry={15} fill="#FFFDFB" stroke="#D9C9BA" strokeWidth={2} />
        <ellipse cx={70} cy={52} rx={54} ry={10} fill={batter ? "#F6D77A" : "#EDE3D8"} />
        {batter && <ellipse cx={58} cy={49} rx={20} ry={3} fill="#FFF0B8" />}
        {!batter && b.flour && <ellipse cx={52} cy={50} rx={16} ry={6} fill="#FFFFFF" stroke="#E8E0D6" />}
        {!batter && b.eggs && (
          <g>
            <ellipse cx={82} cy={52} rx={11} ry={5} fill="#fff" />
            <circle cx={82} cy={51} r={4} fill="#FFC531" />
          </g>
        )}
        {!batter && b.milk && <ellipse cx={70} cy={56} rx={22} ry={4} fill="#FDFDFD" opacity={0.95} />}
        <g className={whisking ? "whisk-spin" : ""} style={{ transformOrigin: "70px 52px" }}>
          <path d="M86 46 L118 0" stroke="#B7895F" strokeWidth={6} strokeLinecap="round" />
          <g stroke="#B8BEC8" strokeWidth={2} fill="none">
            <ellipse cx={80} cy={50} rx={6} ry={14} transform="rotate(35 80 50)" />
            <ellipse cx={80} cy={50} rx={10} ry={14} transform="rotate(35 80 50)" />
          </g>
        </g>
      </svg>
      <div className="mt-1 w-[124px]">
        {whisking ? (
          <Bar value={1 - b.whisk / C.whiskTime(s.progress.mixerLv)} color="#F6B93B" />
        ) : b.batter > 0 ? (
          <div className="rounded-full bg-[#FFE7A8] px-2 py-[1px] text-center text-[12px] font-bold text-[#8A5A16]">
            Batter ×{b.batter}
          </div>
        ) : (
          <div className="flex justify-center gap-1 text-[11px] font-semibold">
            {(["flour", "eggs", "milk"] as const).map((k) => (
              <span key={k} className={`rounded-full px-[6px] py-[1px] ${b[k] ? "bg-[#7BD67B] text-white" : "bg-white/80 text-[#9A7B90]"}`}>
                {k}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function GriddleStation({ s, dispatch }: Props) {
  const lv = s.progress.griddleLv;
  const n = s.griddle.length;
  const anyCooking = s.griddle.some((g) => g.state !== "empty");
  return (
    <div className="absolute left-[284px] top-[376px] h-[160px] w-[256px]">
      <div className="absolute inset-x-0 bottom-0 h-[40px] rounded-[16px] bg-gradient-to-b from-[#A69BD0] to-[#7C6FB0] shadow-[0_6px_12px_rgba(60,40,90,.3)]">
        <div className="absolute bottom-[8px] right-[14px] flex h-[22px] w-[50px] items-center justify-center rounded-md bg-[#2D2840] text-[10px] font-bold tracking-widest text-[#8EF0B0]">
          {anyCooking ? "ON" : "OFF"}
        </div>
        <div className={`absolute bottom-[6px] left-1/2 flex h-[26px] w-[26px] -translate-x-1/2 items-center justify-center rounded-full bg-[#2D2840] text-[13px] ${anyCooking ? "flame" : "opacity-60"}`}>
          🔥
        </div>
      </div>
      <div className="absolute inset-x-[6px] top-[8px] h-[118px] rounded-[16px] border-[5px] border-[#5A5470] bg-gradient-to-b from-[#3B3748] to-[#26232F] shadow-[inset_0_2px_10px_rgba(0,0,0,.5)]">
        <div className="flex h-full items-center justify-around px-1">
          {s.griddle.map((g, i) => {
            const prog =
              g.state === "cooking" ? g.t / C.cookTime(lv) : g.state === "cooked" ? g.t / C.burnTime(lv) : 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => dispatch({ type: "griddle", index: i })}
                aria-label={`Griddle slot ${i + 1}: ${g.state}`}
                className="relative flex h-[100px] flex-col items-center justify-center"
                style={{ width: n === 3 ? 76 : 110 }}
              >
                {g.state === "empty" ? (
                  <span className="flex h-[54px] w-[86%] items-center justify-center rounded-[50%] border-2 border-dashed border-white/20 text-[11px] text-white/40">
                    {s.bowl.batter > 0 ? "pour" : ""}
                  </span>
                ) : (
                  <span className={`relative ${g.state === "cooked" ? "ready-bounce" : ""}`} style={{ transform: n === 3 ? "scale(.78)" : undefined }}>
                    <GriddleCake state={g.state} progress={g.state === "cooking" ? g.t / C.cookTime(lv) : 1} />
                    {(g.state === "cooking" || g.state === "burnt") && (
                      <span className="pointer-events-none absolute left-1/2 top-[-6px] -translate-x-1/2">
                        {[0, 1, 2].map((k) => (
                          <span key={k} className={g.state === "burnt" ? "smoke" : "steam"} style={{ left: (k - 1) * 18, animationDelay: `${k * 0.4}s` }} />
                        ))}
                      </span>
                    )}
                  </span>
                )}
                {g.state !== "empty" && (
                  <div className="absolute bottom-[2px] w-[80%]">
                    {g.state === "cooking" && <Bar value={prog} color="#7BD67B" />}
                    {g.state === "cooked" && <Bar value={1 - prog} color={prog > 0.6 ? "#FF6B6B" : "#FFB347"} />}
                    {g.state === "burnt" && <div className="text-center text-[11px] font-bold text-[#FF8A8A]">burnt! tap</div>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlateStation({ s, dispatch }: Props) {
  const held = s.held?.from === "plate";
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "plate" })}
      aria-label="Plate"
      className={`${station} left-[550px] top-[372px] h-[164px] w-[152px] border-[3px] border-dashed ${
        held ? "lifted border-[#FFC93C] bg-[#FFF6DA]" : "border-[#E2B86A]/70 bg-[#F6E7DC]/70"
      }`}
    >
      <Corners />
      {s.plate ? (
        <PancakeStack count={s.plate.count} toppings={s.plate.toppings} width={136} />
      ) : (
        <PancakeStack count={0} toppings={[]} width={136} />
      )}
      <span className="mt-[-4px] text-[11px] font-semibold text-[#9A7B90]">
        {held ? "tap a customer" : s.plate ? "tap to pick up" : "plate"}
      </span>
    </button>
  );
}

function Corners() {
  return (
    <>
      {["left-1 top-1 border-l-4 border-t-4", "right-1 top-1 border-r-4 border-t-4", "left-1 bottom-1 border-l-4 border-b-4", "right-1 bottom-1 border-r-4 border-b-4"].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-[16px] w-[16px] rounded-[4px] border-[#E7B44C] ${c}`} />
      ))}
    </>
  );
}

function BlenderStation({ s, dispatch }: Props) {
  const b = s.blender;
  const blending = b.blend > 0;
  const level = (b.milk ? 1 : 0) + (b.fruit ? 1 : 0) + (b.ice ? 0.5 : 0);
  const liquid = blending || b.ready ? C.DRINK_COLOR[(b.fruit ?? b.ready?.fruit)!] : b.fruit ? C.DRINK_COLOR[b.fruit] : "#FAFAFA";
  const canBlend = b.milk && b.fruit && !blending && !b.ready;
  const fillTop = blending || b.ready ? 40 : 108 - level * 26;
  return (
    <button type="button" onClick={() => dispatch({ type: "blend" })} aria-label="Blender" className={`${station} left-[714px] top-[340px] h-[204px] w-[124px]`}>
      <svg viewBox="0 0 120 190" width={118} height={188} overflow="visible" aria-hidden className={blending ? "blender-shake" : ""}>
        <ellipse cx={60} cy={186} rx={48} ry={6} fill="rgba(60,40,90,.2)" />
        <defs>
          <clipPath id="jar">
            <path d="M24 22 L96 22 L86 118 L34 118Z" />
          </clipPath>
        </defs>
        {(level > 0 || blending || b.ready) && (
          <g clipPath="url(#jar)">
            <rect x={0} y={fillTop} width={120} height={140} fill={liquid} />
            {!blending && !b.ready && b.milk && b.fruit && <rect x={0} y={fillTop + 26} width={120} height={140} fill="#FDFDFD" opacity={0.85} />}
            {blending && <path d="M30 70 Q60 50 90 70 M34 92 Q60 74 86 92" stroke="#fff" strokeWidth={4} opacity={0.5} fill="none" className="swirl" />}
          </g>
        )}
        {!blending && !b.ready && b.ice && (
          <g fill="#EAF8FF" stroke="#B6DFF2">
            <rect x={44} y={fillTop + 4} width={12} height={12} rx={2} transform={`rotate(-10 50 ${fillTop + 10})`} />
            <rect x={62} y={fillTop + 8} width={12} height={12} rx={2} transform={`rotate(12 68 ${fillTop + 14})`} />
          </g>
        )}
        <path d="M24 22 L96 22 L86 118 L34 118Z" fill="rgba(255,255,255,.25)" stroke="#BFB3DA" strokeWidth={3} />
        <path d="M32 30 L40 110" stroke="#fff" strokeWidth={4} opacity={0.45} strokeLinecap="round" />
        <path d="M96 34 Q112 40 108 60 Q104 80 92 84" stroke="#BFB3DA" strokeWidth={5} fill="none" />
        <rect x={20} y={10} width={80} height={16} rx={6} fill="#6D5FA6" />
        <rect x={50} y={2} width={20} height={10} rx={3} fill="#6D5FA6" />
        <path d="M30 118 L90 118 L98 176 Q60 184 22 176Z" fill="#8E7CC3" />
        <path d="M30 118 L90 118 L92 128 L28 128Z" fill="#6D5FA6" />
        <circle cx={60} cy={152} r={15} fill={canBlend ? "#FFD34D" : blending ? "#7BD67B" : "#5B4C92"} stroke="#fff" strokeWidth={3} className={canBlend ? "pulse" : ""} />
        <path d="M60 143 L60 152 M54 146 A9 9 0 1 0 66 146" stroke={canBlend || blending ? "#5B3A10" : "#C9BFEA"} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-[-2px] w-[110px]">
        {blending ? (
          <Bar value={1 - b.blend / C.blendTime(s.progress.mixerLv)} color="#A77BDB" />
        ) : b.ready ? (
          <div className="rounded-full bg-[#FFE7A8] text-center text-[11px] font-bold text-[#8A5A16]">ready — cup full</div>
        ) : (
          <div className="flex justify-center gap-1 text-[10px] font-semibold">
            <span className={`rounded-full px-[5px] ${b.milk ? "bg-[#7BD67B] text-white" : "bg-white/80 text-[#9A7B90]"}`}>milk</span>
            <span className={`rounded-full px-[5px] ${b.fruit ? "bg-[#7BD67B] text-white" : "bg-white/80 text-[#9A7B90]"}`}>{b.fruit ?? "fruit"}</span>
            <span className={`rounded-full px-[5px] ${b.ice ? "bg-[#7BD67B] text-white" : "bg-white/80 text-[#9A7B90]"}`}>ice</span>
          </div>
        )}
      </div>
    </button>
  );
}

function CupStation({ s, dispatch }: Props) {
  const held = s.held?.from === "cup";
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "cup" })}
      aria-label="Cup"
      className={`${station} left-[850px] top-[372px] h-[164px] w-[122px] border-[3px] border-dashed ${
        held ? "lifted border-[#FFC93C] bg-[#FFF6DA]" : "border-[#E2B86A]/70 bg-[#F6E7DC]/70"
      }`}
    >
      <Corners />
      <div className="relative">
        <div className="absolute bottom-[-4px] left-1/2 h-[14px] w-[86px] -translate-x-1/2 rounded-[50%] bg-[#E9C7A6]" />
        <DrinkCup drink={s.cup} width={70} />
      </div>
      <span className="mt-1 text-[11px] font-semibold text-[#9A7B90]">
        {held ? "tap a customer" : s.cup ? "tap to pick up" : "cup"}
      </span>
    </button>
  );
}

function SlateStation({ s, dispatch }: Props) {
  const unlocked = s.progress.slateUnlocked;
  return (
    <div className="absolute left-[984px] top-[352px] h-[192px] w-[288px] rounded-[18px] border-[4px] border-[#8B5E3C] bg-gradient-to-b from-[#D7B08B] to-[#C39470] p-2 pt-[30px] shadow-[0_6px_14px_rgba(90,50,30,.3)]">
      <div className="absolute left-1/2 top-[-14px] -translate-x-1/2 rounded-full border-[3px] border-[#8B5E3C] bg-[#5E3B2A] px-4 py-[2px] text-[14px] font-semibold whitespace-nowrap text-[#FFE9C9]">
        Premade Slate
      </div>
      <div className="grid grid-cols-3 gap-2">
        {s.slate.map((item, i) => {
          const locked = i >= unlocked;
          const selected = s.held?.from === "slate" && s.held.index === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => dispatch({ type: "slate", index: i })}
              aria-label={locked ? `Unlock slot for ${C.slateCost(unlocked)} coins` : `Slate slot ${i + 1}`}
              className={`relative flex h-[68px] items-center justify-center overflow-visible rounded-[12px] border-2 transition ${
                selected
                  ? "lifted border-[#FFC93C] bg-[#FFF6DA]"
                  : locked
                    ? "border-[#9C7254] bg-[#B88A66]"
                    : "border-[#E9D0B6] bg-[#F7E8D8] hover:bg-[#FFF2E4]"
              }`}
            >
              {locked ? (
                i === unlocked ? (
                  <span className="flex flex-col items-center text-[#5E3B2A]">
                    <span className="text-[20px]">🔒</span>
                    <span className="flex items-center gap-[2px] text-[11px] font-bold">
                      <Coin size={11} /> {C.slateCost(unlocked)}
                    </span>
                  </span>
                ) : (
                  <span className="text-[26px] font-bold text-[#8B5E3C]">+</span>
                )
              ) : item ? (
                <span className="scale-[.82]">
                  <ItemThumb item={item} size={76} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Coin({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden>
      <circle cx={10} cy={10} r={9} fill="#F7B92B" stroke="#C98612" strokeWidth={1.5} />
      <circle cx={10} cy={10} r={5.5} fill="none" stroke="#FFE08A" strokeWidth={1.5} />
      <text x={10} y={13.5} textAnchor="middle" fontSize={9} fontWeight={800} fill="#B07010">
        $
      </text>
    </svg>
  );
}

export function Counter(props: Props) {
  return (
    <>
      <ModeTabs {...props} />
      <BowlStation {...props} />
      <GriddleStation {...props} />
      <PlateStation {...props} />
      <BlenderStation {...props} />
      <CupStation {...props} />
      <SlateStation {...props} />
    </>
  );
}
