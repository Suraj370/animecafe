"use client";

import type { Dispatch, ReactNode } from "react";
import * as C from "@/game/config";
import type { Action } from "@/game/logic";
import type { GameState } from "@/game/types";
import { useDrag } from "./drag";
import { DrinkCup, GriddleCake, ItemThumb, PancakeStack } from "./Food";

type Props = { s: GameState; dispatch: Dispatch<Action> };

/*
 * The stations themselves are painted in the background (public/art/bg.webp).
 * Everything here is a transparent hit area sized to the painted station,
 * plus whatever is live on top of it (batter, pancakes, drinks…).
 * All coordinates are mockup pixels.
 */

const hit = "absolute rounded-[16px] transition-transform active:scale-[.98]";

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-[7px] w-full overflow-hidden rounded-full border border-[#3B2A3A]/60 bg-[#3B2A3A]/50">
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  );
}

function Chip({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-[6px] py-[1px] text-[10px] font-semibold leading-tight shadow-sm ${
        on ? "bg-[#6FC46A] text-white" : "bg-[#FCF4EE]/90 text-[#8C6A80]"
      }`}
    >
      {children}
    </span>
  );
}

/** Covers the mockup's Pancake/Drink tabs — there's no mode to switch any more. */
function DragHint() {
  return (
    <div className="pointer-events-none absolute left-[2px] top-[326px] flex h-[126px] w-[136px] flex-col items-center justify-center gap-[2px] rounded-[16px] border-[3px] border-[#F2D3CF] bg-gradient-to-b from-[#FFF7F3] to-[#F6E2DC] px-2 text-center text-[#6B3A52] shadow-[0_4px_10px_rgba(90,40,60,.25)]">
      <span className="drag-hint-hand emoji text-[30px] leading-none">✋</span>
      <span className="text-[15px] font-semibold leading-tight">Drag &amp; drop</span>
      <span className="text-[10.5px] leading-snug text-[#8C6A80]">
        Drag ingredients onto the stations, then drag food to a customer.
      </span>
    </div>
  );
}

function BowlStation({ s, dispatch }: Props) {
  const b = s.bowl;
  const whisking = b.whisk > 0;
  const hasBatter = b.batter > 0 || whisking;
  const { draggable, dropClass, isDragging } = useDrag();
  const lifting = isDragging((d) => d.kind === "batter");
  return (
    <>
      <button
        type="button"
        data-tut="bowl"
        data-drop="bowl"
        {...draggable(b.batter > 0 ? { kind: "batter" } : null)}
        onClick={() => dispatch({ type: "bowl" })}
        aria-label="Mixing bowl"
        className={`${hit} left-[144px] top-[322px] h-[142px] w-[132px] ${dropClass("bowl")} ${b.batter > 0 ? "cursor-grab" : ""}`}
      >
        {/* The painted bowl is full of batter; when it's empty, paint over it with empty glass. */}
        <svg viewBox="0 0 132 142" width={132} height={142} className={`absolute inset-0 ${lifting ? "opacity-60" : ""}`} aria-hidden>
          {!hasBatter && (
            <g>
              <path d="M6 61 Q8 128 66 134 Q124 128 126 61 Q96 76 66 76 Q36 76 6 61Z" fill="#F3E7EE" opacity={0.97} />
              <ellipse cx={66} cy={61} rx={60} ry={14} fill="#EADDE6" stroke="#FFFFFF" strokeWidth={2.5} />
              <path d="M14 72 Q22 118 60 128" stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" />
              {/* whisk tines back in an empty bowl */}
              <g stroke="#B8BEC8" strokeWidth={2} fill="none">
                <ellipse cx={52} cy={70} rx={8} ry={17} transform="rotate(-28 52 70)" />
                <ellipse cx={52} cy={70} rx={13} ry={17} transform="rotate(-28 52 70)" />
              </g>
              {b.milk && <ellipse cx={66} cy={98} rx={42} ry={10} fill="#FFFFFF" />}
              {b.flour && <path d="M40 104 Q46 82 62 81 Q78 82 84 104Z" fill="#FBF9F4" stroke="#E5DED2" />}
              {b.eggs && (
                <g>
                  <path d="M70 106 Q72 96 86 95 Q100 96 102 104 Q96 112 86 112 Q74 112 70 106Z" fill="#FFFFFF" />
                  <circle cx={87} cy={103} r={5.5} fill="#F7A21B" />
                  <ellipse cx={85.5} cy={101.5} rx={1.8} ry={1.1} fill="#FFE7A8" />
                </g>
              )}
            </g>
          )}
          {whisking && (
            <g className="whisk-spin" style={{ transformOrigin: "66px 80px" }}>
              <path d="M30 82 Q66 64 102 82 M40 96 Q66 82 92 96" stroke="#FFF4C8" strokeWidth={3} fill="none" opacity={0.85} strokeLinecap="round" />
            </g>
          )}
        </svg>
      </button>
      <div className="pointer-events-none absolute left-[150px] top-[465px] flex w-[120px] justify-center gap-1">
        {whisking ? (
          <Bar value={1 - b.whisk / C.whiskTime(s.progress.mixerLv)} color="#F6B93B" />
        ) : b.batter > 0 ? (
          <span className="rounded-full bg-[#FFE7A8] px-2 text-[11px] font-bold text-[#8A5A16] shadow-sm">Batter ×{b.batter}</span>
        ) : (
          (["flour", "eggs", "milk"] as const).map((k) => (
            <Chip key={k} on={b[k]}>
              {k}
            </Chip>
          ))
        )}
      </div>
    </>
  );
}

function GriddleStation({ s, dispatch }: Props) {
  const lv = s.progress.griddleLv;
  const n = s.griddle.length;
  const { draggable, dropClass, isDragging } = useDrag();
  // Pan spots on the painted griddle (centre x), two or three across.
  const xs = n === 3 ? [326, 390, 454] : [348, 434];
  const size = n === 3 ? 0.72 : 0.92;
  return (
    <div data-tut="griddle" className="absolute left-[284px] top-[360px] h-[94px] w-[212px]">
      {s.griddle.map((g, i) => {
        const prog = g.state === "cooking" ? g.t / C.cookTime(lv) : g.state === "cooked" ? g.t / C.burnTime(lv) : 0;
        const grabbable = g.state === "cooked" || g.state === "burnt";
        const lifting = isDragging((d) => d.kind === "griddle" && d.index === i);
        const w = n === 3 ? 66 : 86;
        return (
          <button
            key={i}
            type="button"
            onClick={() => dispatch({ type: "griddle", index: i })}
            data-tut={`griddle-${i}`}
            data-drop={`griddle-${i}`}
            {...draggable(grabbable ? { kind: "griddle", index: i } : null)}
            aria-label={`Griddle spot ${i + 1}: ${g.state}`}
            className={`absolute top-[8px] flex h-[78px] flex-col items-center justify-center rounded-[14px] ${dropClass(`griddle-${i}`)} ${
              grabbable ? "cursor-grab" : ""
            } ${lifting ? "opacity-30" : ""}`}
            style={{ left: xs[i] - 284 - w / 2, width: w }}
          >
            {g.state === "empty" ? (
              s.bowl.batter > 0 && (
                <span className="flex h-[40px] w-[90%] items-center justify-center rounded-[50%] border-2 border-dashed border-white/25 text-[10px] text-white/50">
                  pour
                </span>
              )
            ) : (
              <span className={`relative ${g.state === "cooked" ? "ready-bounce" : ""}`} style={{ transform: `scale(${size})` }}>
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
              <div className="absolute bottom-[-2px] w-[78%]">
                {g.state === "cooking" && <Bar value={prog} color="#7BD67B" />}
                {g.state === "cooked" && <Bar value={1 - prog} color={prog > 0.6 ? "#FF6B6B" : "#FFB347"} />}
                {g.state === "burnt" && <div className="text-center text-[10px] font-bold text-[#FF8A8A]">burnt → trash</div>}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PlateStation({ s, dispatch }: Props) {
  const held = s.held?.from === "plate";
  const { draggable, dropClass, isDragging } = useDrag();
  const lifting = isDragging((d) => d.kind === "plate");
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "plate" })}
      data-tut="plate"
      data-drop="plate"
      {...draggable(s.plate ? { kind: "plate" } : null)}
      aria-label="Plate"
      className={`${hit} left-[505px] top-[318px] h-[160px] w-[180px] ${held ? "lifted" : ""} ${dropClass("plate")} ${s.plate ? "cursor-grab" : ""}`}
    >
      <span className="absolute left-[8px] top-[-9px]">
        <PancakeStack count={s.plate && !lifting ? s.plate.count : 0} toppings={s.plate?.toppings ?? []} width={164} />
      </span>
    </button>
  );
}

function BlenderStation({ s, dispatch }: Props) {
  const b = s.blender;
  const blending = b.blend > 0;
  const level = (b.milk ? 1 : 0) + (b.fruit ? 1 : 0) + (b.ice ? 0.4 : 0);
  const fruit = b.fruit ?? b.ready?.fruit;
  const full = blending || !!b.ready;
  const liquid = full ? `url(#fd-liq-${fruit})` : b.fruit ? C.DRINK_COLOR[b.fruit] : "#FAFAFA";
  const canBlend = b.milk && b.fruit && !blending && !b.ready;
  // jar interior is 62px tall in the painting; fill from the bottom
  const fillTop = full ? 14 : 76 - level * 24;
  const { dropClass } = useDrag();
  return (
    <>
      <button
        type="button"
        data-tut="blender"
        data-drop="blender"
        onClick={() => dispatch({ type: "blend" })}
        aria-label="Blender"
        className={`${hit} left-[690px] top-[274px] h-[190px] w-[140px] ${dropClass("blender")} ${blending ? "blender-shake" : ""}`}
      >
        <svg viewBox="0 0 140 190" width={140} height={190} className="absolute inset-0" aria-hidden>
          <defs>
            <clipPath id="jar-clip">
              <path d="M47 52 L109 52 L101 122 L56 122Z" />
            </clipPath>
          </defs>
          {(level > 0 || full) && (
            <g clipPath="url(#jar-clip)">
              <rect x={40} y={52 + fillTop - 14} width={80} height={120} fill={liquid} />
              {!full && b.milk && b.fruit && <rect x={40} y={52 + fillTop + 10} width={80} height={120} fill="#FDFDFD" opacity={0.85} />}
              {!full && b.ice && (
                <g fill="url(#fd-ice)" stroke="#BFE3F5">
                  <rect x={62} y={52 + fillTop - 10} width={11} height={11} rx={2} transform={`rotate(-10 67 ${52 + fillTop - 5})`} />
                  <rect x={80} y={52 + fillTop - 6} width={11} height={11} rx={2} transform={`rotate(12 85 ${52 + fillTop})`} />
                </g>
              )}
              {blending && <path d="M50 80 Q78 64 106 80 M52 100 Q78 86 104 100" stroke="#fff" strokeWidth={3} opacity={0.55} fill="none" className="swirl" />}
              <path d="M52 56 L58 118" stroke="#fff" strokeWidth={3} opacity={0.4} strokeLinecap="round" />
            </g>
          )}
          {/* glow on the painted power button when it's ready to blend */}
          {(canBlend || blending) && (
            <circle cx={73} cy={166} r={19} fill="none" stroke={blending ? "#7BD67B" : "#FFD34D"} strokeWidth={4} className={canBlend ? "pulse" : ""} />
          )}
        </svg>
      </button>
      <div className="pointer-events-none absolute left-[696px] top-[465px] flex w-[128px] justify-center gap-1">
        {blending ? (
          <Bar value={1 - b.blend / C.blendTime(s.progress.mixerLv)} color="#A77BDB" />
        ) : b.ready ? (
          <span className="rounded-full bg-[#FFE7A8] px-2 text-[10px] font-bold text-[#8A5A16] shadow-sm">ready — cup full</span>
        ) : (
          <>
            <Chip on={b.milk}>milk</Chip>
            <Chip on={!!b.fruit}>{b.fruit ?? "fruit"}</Chip>
            <Chip on={b.ice}>ice</Chip>
          </>
        )}
      </div>
    </>
  );
}

function CupStation({ s, dispatch }: Props) {
  const held = s.held?.from === "cup";
  const { draggable, dropClass, isDragging } = useDrag();
  const lifting = isDragging((d) => d.kind === "cup");
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "cup" })}
      data-tut="cup"
      data-drop="cup"
      {...draggable(s.cup ? { kind: "cup" } : null)}
      aria-label="Cup"
      className={`${hit} left-[830px] top-[318px] h-[160px] w-[156px] ${held ? "lifted" : ""} ${dropClass("cup")} ${s.cup ? "cursor-grab" : ""}`}
    >
      <span className="absolute left-[34px] top-[22px]">
        <DrinkCup drink={lifting ? null : s.cup} width={86} />
      </span>
    </button>
  );
}

// Slate cells as painted (x, y, w, h).
const CELLS: [number, number, number, number][] = [
  [999, 332, 69, 66],
  [1069, 332, 69, 66],
  [1140, 332, 69, 66],
  [1004, 402, 69, 66],
  [1074, 402, 69, 66],
  [1142, 402, 69, 66],
];

function SlateStation({ s, dispatch }: Props) {
  const unlocked = s.progress.slateUnlocked;
  const { draggable, dropClass, isDragging } = useDrag();
  return (
    <>
      {s.slate.map((item, i) => {
        const [x, y, w, h] = CELLS[i];
        const locked = i >= unlocked;
        const selected = s.held?.from === "slate" && s.held.index === i;
        const lifting = isDragging((d) => d.kind === "slate" && d.index === i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => dispatch({ type: "slate", index: i })}
            data-drop={`slate-${i}`}
            {...draggable(item && !locked ? { kind: "slate", index: i } : null)}
            aria-label={locked ? `Unlock slot for ${C.slateCost(unlocked)} coins` : `Slate slot ${i + 1}`}
            className={`absolute flex items-center justify-center rounded-[12px] ${selected ? "lifted" : ""} ${dropClass(`slate-${i}`)} ${
              item ? "cursor-grab" : ""
            } ${lifting ? "opacity-30" : ""}`}
            style={{
              left: x,
              top: y,
              width: w,
              height: h,
              // painted cells 5 and 6 show a lock / plus — cover them with a clean cell once unlocked
              backgroundImage: !locked && i >= 4 ? "url(/art/slate-cell.webp)" : undefined,
              backgroundSize: "100% 100%",
            }}
          >
            {locked && i === unlocked && (
              <span className="absolute bottom-[3px] flex items-center gap-[2px] rounded-full bg-[#3B2A3A]/80 px-[6px] text-[10px] font-bold text-[#FFE9B0]">
                <Coin size={10} /> {C.slateCost(unlocked)}
              </span>
            )}
            {!locked && item && (
              <span className="scale-[.72]">
                <ItemThumb item={item} size={76} />
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}

export function Coin({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden>
      <circle cx={10} cy={10} r={9} fill="#F7B92B" stroke="#C98612" strokeWidth={1.5} />
      <circle cx={10} cy={10} r={5.5} fill="none" stroke="#FFE08A" strokeWidth={1.5} />
      <path d="M10 5.6 L11.3 8.6 L14.4 8.8 L12 10.8 L12.8 13.9 L10 12.2 L7.2 13.9 L8 10.8 L5.6 8.8 L8.7 8.6Z" fill="#E59A12" />
    </svg>
  );
}

export function Counter(props: Props) {
  return (
    <>
      <DragHint />
      <BowlStation {...props} />
      <GriddleStation {...props} />
      <PlateStation {...props} />
      <BlenderStation {...props} />
      <CupStation {...props} />
      <SlateStation {...props} />
    </>
  );
}
