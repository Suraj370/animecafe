import { useId } from "react";
import type { DrinkItem, Fruit, Item, Topping } from "@/game/types";

/* ------------------------------------------------------------------ */
/*  Shared gradients — rendered once in the game root, referenced by  */
/*  every food SVG via url(#fd-…).                                    */
/* ------------------------------------------------------------------ */

export function FoodDefs() {
  return (
    <svg width={0} height={0} className="absolute" aria-hidden focusable="false">
      <defs>
        {/* plate */}
        <radialGradient id="fd-plate" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F6F1EE" />
          <stop offset="100%" stopColor="#DCD0C9" />
        </radialGradient>
        <radialGradient id="fd-plate-well" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FBF8F6" />
          <stop offset="100%" stopColor="#E6DBD3" />
        </radialGradient>
        <filter id="fd-soft" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        {/* pancake */}
        <linearGradient id="fd-pc-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B4652A" />
          <stop offset="22%" stopColor="#E3B06A" />
          <stop offset="55%" stopColor="#F3D69E" />
          <stop offset="82%" stopColor="#D9A15A" />
          <stop offset="100%" stopColor="#8E4E1C" />
        </linearGradient>
        <radialGradient id="fd-pc-top" cx="48%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#F5C47A" />
          <stop offset="50%" stopColor="#E9A853" />
          <stop offset="82%" stopColor="#CF8136" />
          <stop offset="100%" stopColor="#A85B22" />
        </radialGradient>

        {/* syrup & chocolate */}
        <linearGradient id="fd-syrup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D27E2C" />
          <stop offset="55%" stopColor="#9C4E14" />
          <stop offset="100%" stopColor="#6B2E08" />
        </linearGradient>
        <linearGradient id="fd-choc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A4429" />
          <stop offset="100%" stopColor="#2B1208" />
        </linearGradient>

        {/* fruit */}
        <radialGradient id="fd-straw-skin" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FF7387" />
          <stop offset="50%" stopColor="#E01F3D" />
          <stop offset="100%" stopColor="#9B0F26" />
        </radialGradient>
        <radialGradient id="fd-straw-flesh" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#FFF6F3" />
          <stop offset="40%" stopColor="#FFC6CB" />
          <stop offset="80%" stopColor="#F2687A" />
          <stop offset="100%" stopColor="#D41F3B" />
        </radialGradient>
        <radialGradient id="fd-blue" cx="34%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#7C8BD0" />
          <stop offset="45%" stopColor="#3A4594" />
          <stop offset="100%" stopColor="#181C4D" />
        </radialGradient>
        <radialGradient id="fd-blue-bloom" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#B9C6E8" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#B9C6E8" stopOpacity={0.45} />
        </radialGradient>
        <radialGradient id="fd-banana" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFCEB" />
          <stop offset="60%" stopColor="#FFF0BF" />
          <stop offset="88%" stopColor="#F1D687" />
          <stop offset="100%" stopColor="#D6B25A" />
        </radialGradient>

        {/* cream */}
        <radialGradient id="fd-cream" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FFFBF4" />
          <stop offset="100%" stopColor="#E8DACB" />
        </radialGradient>

        {/* drinks */}
        <linearGradient id="fd-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.6} />
          <stop offset="12%" stopColor="#FFFFFF" stopOpacity={0.18} />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.05} />
          <stop offset="86%" stopColor="#FFFFFF" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.55} />
        </linearGradient>
        <linearGradient id="fd-ice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
          <stop offset="60%" stopColor="#DDF2FC" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#A9D6EE" stopOpacity={0.7} />
        </linearGradient>
        {(
          [
            ["strawberry", "#FFC2D4", "#F27FA4", "#CF4373"],
            ["blueberry", "#D7C2F3", "#A47CDB", "#5F3A9E"],
            ["banana", "#FFF6CF", "#FFE38C", "#EDBF52"],
          ] as const
        ).map(([fruit, a, b, c]) => (
          <linearGradient key={fruit} id={`fd-liq-${fruit}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="35%" stopColor={b} />
            <stop offset="100%" stopColor={c} />
          </linearGradient>
        ))}
        <linearGradient id="fd-liq-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.18} />
          <stop offset="25%" stopColor="#000" stopOpacity={0} />
          <stop offset="75%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.22} />
        </linearGradient>

        {/* batter / burnt */}
        <radialGradient id="fd-batter" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#FFF4CF" />
          <stop offset="65%" stopColor="#F4D688" />
          <stop offset="100%" stopColor="#DDB15A" />
        </radialGradient>
        <radialGradient id="fd-burnt" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3D2416" />
          <stop offset="70%" stopColor="#24130A" />
          <stop offset="100%" stopColor="#120804" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------ fruit ------------------------------ */

function StrawberryHalf({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse cx={0.8} cy={3} rx={8} ry={4} fill="rgba(90,30,20,.25)" filter="url(#fd-soft)" />
      <path d="M0 -9 C7 -9 10 -4 9 1 C8 6 4 10 0 12 C-4 10 -8 6 -9 1 C-10 -4 -7 -9 0 -9Z" fill="url(#fd-straw-skin)" />
      <path d="M0 -7.2 C5 -7.2 7.6 -3 7 1 C6.2 5 3.2 8.4 0 10 C-3.2 8.4 -6.2 5 -7 1 C-7.6 -3 -5 -7.2 0 -7.2Z" fill="url(#fd-straw-flesh)" />
      <path d="M0 -5 C1.4 -1 1.4 4 0 8 M-3.2 -3 C-2.2 1 -1 4 0 7.5 M3.2 -3 C2.2 1 1 4 0 7.5" stroke="#FFFFFF" strokeWidth={0.9} opacity={0.75} fill="none" strokeLinecap="round" />
      <g fill="#FFE9A8">
        <circle cx={-6.6} cy={3} r={0.55} />
        <circle cx={-4.4} cy={7.2} r={0.55} />
        <circle cx={6.6} cy={3} r={0.55} />
        <circle cx={4.4} cy={7.2} r={0.55} />
      </g>
      <path d="M-5.5 -9 Q-2 -12.5 0 -10 Q2 -12.5 5.5 -9 Q2.5 -8 0 -8.6 Q-2.5 -8 -5.5 -9Z" fill="#3F8F38" />
      <ellipse cx={-3.6} cy={-4.2} rx={1.5} ry={2.4} fill="#fff" opacity={0.45} transform="rotate(20 -3.6 -4.2)" />
    </g>
  );
}

function StrawberryWhole({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  const seeds = [
    [-4, -2], [0, -3], [4, -2], [-5, 2], [-1.5, 1.5], [2.5, 1.5], [5, 2.5], [-3, 5.5], [1, 5.5], [0, 9],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 -7 C7 -7 10 -3 9 2 C8 7 4 11 0 13 C-4 11 -8 7 -9 2 C-10 -3 -7 -7 0 -7Z" fill="url(#fd-straw-skin)" />
      {seeds.map(([sx, sy], i) => (
        <ellipse key={i} cx={sx} cy={sy} rx={0.6} ry={0.9} fill="#FFE27A" opacity={0.9} />
      ))}
      <path d="M-7 -6 L-2 -4 L0 -9 L2 -4 L7 -6 L4 -2.5 L0 -3.5 L-4 -2.5Z" fill="#3F8F38" />
      <path d="M0 -8 L0.6 -12" stroke="#2F6E2A" strokeWidth={1.2} strokeLinecap="round" />
      <ellipse cx={-4} cy={-1} rx={1.6} ry={3} fill="#fff" opacity={0.35} transform="rotate(20 -4 -1)" />
    </g>
  );
}

function Blueberry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0.6} cy={3.6} rx={4.6} ry={1.8} fill="rgba(20,20,60,.3)" filter="url(#fd-soft)" />
      <circle r={5} fill="url(#fd-blue)" />
      <circle r={5} fill="url(#fd-blue-bloom)" />
      <path d="M-1.8 -3.6 L0 -2.4 L1.8 -3.6 L1.2 -1.6 L-1.2 -1.6Z" fill="#141737" />
      <ellipse cx={-2} cy={-1.4} rx={1.3} ry={0.9} fill="#fff" opacity={0.55} />
    </g>
  );
}

function BananaSlice({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse cx={0.6} cy={2.6} rx={7} ry={2.4} fill="rgba(110,80,20,.25)" filter="url(#fd-soft)" />
      <ellipse rx={7} ry={5} fill="url(#fd-banana)" stroke="#D2AF5C" strokeWidth={0.8} />
      <ellipse rx={2.8} ry={2} fill="none" stroke="#D7BD72" strokeWidth={0.7} opacity={0.8} />
      <g fill="#7C5A24">
        <ellipse cx={0} cy={-1.2} rx={0.45} ry={0.7} />
        <ellipse cx={1.1} cy={0.7} rx={0.45} ry={0.7} transform="rotate(60 1.1 0.7)" />
        <ellipse cx={-1.1} cy={0.7} rx={0.45} ry={0.7} transform="rotate(-60 -1.1 0.7)" />
      </g>
      <ellipse cx={-2.6} cy={-2} rx={2} ry={0.9} fill="#fff" opacity={0.6} />
    </g>
  );
}

/** Piped whipped-cream rosette. Origin is the bottom centre. */
function CreamDollop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={15} ry={4} fill="rgba(110,70,40,.22)" filter="url(#fd-soft)" />
      <path
        d="M-15 1 Q-17 -5 -10 -6 Q-12 -12 -4 -13 Q-5 -19 1 -20 Q4 -25 2 -29 Q10 -23 7 -16 Q13 -15 11 -9 Q17 -8 15 0 Q0 5 -15 1Z"
        fill="url(#fd-cream)"
        stroke="#E3D3C1"
        strokeWidth={0.7}
      />
      <g stroke="#E2D2C0" strokeWidth={0.9} fill="none" strokeLinecap="round">
        <path d="M-12 -1 Q-6 -3 -2 -9" />
        <path d="M12 -2 Q7 -5 4 -11" />
        <path d="M-8 -6 Q-2 -8 2 -15" />
        <path d="M6 -10 Q3 -14 1 -19" />
      </g>
      <path d="M-10 -4 Q-7 -9 -3 -10 M-3 -14 Q-1 -18 1 -19" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.95} />
    </g>
  );
}

/* ----------------------------- pancakes ---------------------------- */

const PORES: [number, number][] = [
  [-22, 0], [-10, -3], [4, 1], [18, -2], [26, 2], [-28, 3], [10, 4], [-4, -5], [22, -5],
];

function Toppings({ toppings, top, stackH }: { toppings: Topping[]; top: number; stackH: number }) {
  const has = (t: Topping) => toppings.includes(t);
  return (
    <g>
      {has("syrup") && (
        <g>
          <path
            d={`M26 ${top + 1} Q30 ${top - 7} 48 ${top - 8} Q66 ${top - 10} 84 ${top - 5} Q97 ${top - 1} 93 ${top + 4} Q84 ${top + 10} 60 ${top + 10} Q36 ${top + 11} 26 ${top + 1}Z`}
            fill="url(#fd-syrup)"
            opacity={0.93}
          />
          {[
            [30, stackH * 0.7],
            [44, stackH * 0.95],
            [63, stackH * 0.55],
            [79, stackH * 0.85],
            [91, stackH * 0.4],
          ].map(([dx, len], i) => (
            <path
              key={i}
              d={`M${dx - 2.4} ${top + 6} L${dx - 2.4} ${top + 7 + len} a2.6 2.6 0 0 0 5.2 0 L${dx + 2.4} ${top + 6}Z`}
              fill="url(#fd-syrup)"
              opacity={0.92}
            />
          ))}
          <path d={`M40 ${top - 4} Q52 ${top - 7} 66 ${top - 6}`} stroke="#FFE2B0" strokeWidth={1.8} opacity={0.75} fill="none" strokeLinecap="round" />
          <path d={`M43 ${top + 8} L43 ${top + 6 + stackH * 0.8}`} stroke="#FFD9A0" strokeWidth={0.9} opacity={0.6} />
        </g>
      )}
      {has("chocolate") && (
        <g>
          <path
            d={`M28 ${top + 1} L38 ${top - 5} L46 ${top + 5} L56 ${top - 6} L66 ${top + 5} L76 ${top - 6} L86 ${top + 3} L92 ${top - 1}`}
            stroke="url(#fd-choc)"
            strokeWidth={3.6}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={`M30 ${top} L38 ${top - 5.6} M47 ${top + 4} L56 ${top - 6.6} M67 ${top + 4} L76 ${top - 6.6}`}
            stroke="#B9846A"
            strokeWidth={0.9}
            opacity={0.7}
            strokeLinecap="round"
          />
          <g fill="#3A1A0C">
            <path d={`M36 ${top + 3} q3 -3 6 0 q-3 1 -6 0z`} />
            <path d={`M78 ${top - 4} q3 -3 6 0 q-3 1 -6 0z`} />
            <path d={`M58 ${top + 6} q2 -2.5 5 0 q-2.5 1 -5 0z`} />
          </g>
        </g>
      )}
      {has("blueberry") && (
        <g>
          <Blueberry x={33} y={top} />
          <Blueberry x={45} y={top + 5} />
          <Blueberry x={74} y={top + 5} />
          <Blueberry x={87} y={top + 1} />
          <Blueberry x={81} y={top - 4} s={0.9} />
        </g>
      )}
      {has("banana") && (
        <g>
          <BananaSlice x={58} y={top + 5} r={-8} />
          <BananaSlice x={41} y={top - 4} r={12} />
          <BananaSlice x={77} y={top - 3} r={-14} />
        </g>
      )}
      {has("strawberry") && (
        <g>
          <StrawberryHalf x={36} y={top - 5} r={-25} />
          <StrawberryHalf x={84} y={top - 5} r={25} />
          {!has("cream") && <StrawberryHalf x={60} y={top - 8} r={-5} />}
        </g>
      )}
      {has("cream") && (
        <g>
          <CreamDollop x={60} y={top + 2} />
          {has("strawberry") && <StrawberryWhole x={61} y={top - 28} s={0.75} r={8} />}
          {has("blueberry") && !has("strawberry") && <Blueberry x={61} y={top - 28} s={0.9} />}
        </g>
      )}
    </g>
  );
}

/** A plate with a stack of pancakes and toppings. viewBox is 120 × 100. */
export function PancakeStack({
  count,
  toppings,
  width = 120,
  plate = true,
}: {
  count: number;
  toppings: Topping[];
  width?: number;
  plate?: boolean;
}) {
  const layers = Array.from({ length: count }, (_, i) => i);
  const top = 72 - (count - 1) * 11 - 5;
  const stackH = count * 11;
  return (
    <svg viewBox="0 0 120 100" width={width} height={(width * 100) / 120} overflow="visible" aria-hidden>
      {plate && (
        <g>
          <ellipse cx={60} cy={92} rx={54} ry={6} fill="rgba(70,30,50,.22)" filter="url(#fd-soft)" />
          <ellipse cx={60} cy={83} rx={57} ry={15} fill="url(#fd-plate)" stroke="#D8CBC3" strokeWidth={1} />
          <ellipse cx={60} cy={82} rx={42} ry={9.5} fill="url(#fd-plate-well)" />
          <path d="M14 78 Q30 70 54 69" stroke="#fff" strokeWidth={2} fill="none" opacity={0.9} strokeLinecap="round" />
          <ellipse cx={60} cy={83} rx={57} ry={15} fill="none" stroke="#C9B6E4" strokeWidth={1.2} strokeDasharray="1 3" opacity={0.6} />
        </g>
      )}
      {count > 0 && (
        <ellipse cx={60} cy={80} rx={42} ry={8} fill="rgba(90,40,10,.35)" filter="url(#fd-soft)" />
      )}
      {count > 0 && toppings.includes("syrup") && (
        <ellipse cx={58} cy={81} rx={47} ry={8.5} fill="url(#fd-syrup)" opacity={0.85} />
      )}
      {layers.map((i) => {
        const y = 74 - i * 11;
        const dx = i % 2 === 0 ? 0 : 1.4;
        const rx = 40 - (i % 3) * 0.8;
        const isTop = i === count - 1;
        return (
          <g key={i} transform={`translate(${dx} 0)`}>
            <ellipse cx={60} cy={y} rx={rx} ry={11} fill="url(#fd-pc-side)" />
            {/* crumb pores on the side */}
            {[-30, -18, -6, 8, 20, 31].map((px, k) => (
              <ellipse key={k} cx={60 + px} cy={y + 4 + (k % 2)} rx={1.2} ry={0.6} fill="#C88C48" opacity={0.6} />
            ))}
            <ellipse cx={60} cy={y - 4} rx={rx} ry={10} fill="url(#fd-pc-top)" />
            {isTop && (
              <g>
                {PORES.map(([px, py], k) => (
                  <ellipse key={k} cx={60 + px} cy={y - 4 + py} rx={1.1} ry={0.6} fill="#B76D2E" opacity={0.55} />
                ))}
                <ellipse cx={52} cy={y - 7} rx={13} ry={3.2} fill="#FFE2A8" opacity={0.45} />
                <ellipse cx={72} cy={y - 2} rx={7} ry={2} fill="#C97E38" opacity={0.35} />
              </g>
            )}
          </g>
        );
      })}
      {count > 0 && <Toppings toppings={toppings} top={top} stackH={stackH} />}
    </svg>
  );
}

/* ------------------------------ drinks ----------------------------- */

const FLECKS: [number, number][] = [
  [26, 52], [34, 64], [48, 58], [55, 72], [30, 80], [44, 86], [52, 46], [38, 74], [24, 68], [50, 90],
];
const DROPS: [number, number, number][] = [
  [22, 66, 1.4], [25, 84, 1], [57, 58, 1.2], [55, 80, 1.6], [59, 92, 0.9], [29, 92, 1.2], [53, 70, 0.8],
];

/** A tall glass, empty or filled with a smoothie. viewBox is 80 × 110. */
export function DrinkCup({
  drink,
  width = 70,
}: {
  drink: Pick<DrinkItem, "fruit" | "ice" | "cream"> | null;
  width?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clip = `cup${uid}`;
  const fleck = drink?.fruit === "strawberry" ? "#B0193F" : drink?.fruit === "blueberry" ? "#3B1F6E" : "#C99A3A";
  return (
    <svg viewBox="0 0 80 110" width={width} height={(width * 110) / 80} overflow="visible" aria-hidden>
      <defs>
        <clipPath id={clip}>
          <path d="M17 34 L63 34 L58.6 95 Q40 99 21.4 95Z" />
        </clipPath>
      </defs>
      <ellipse cx={40} cy={104} rx={26} ry={4} fill="rgba(70,30,60,.25)" filter="url(#fd-soft)" />

      {/* striped straw (lower part hidden by the smoothie) */}
      {drink && (
        <g>
          <line x1={49} y1={80} x2={62} y2={-6} stroke="#F2577F" strokeWidth={5} strokeLinecap="round" />
          <line x1={49} y1={80} x2={62} y2={-6} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="3 4" strokeLinecap="butt" />
          <line x1={48} y1={80} x2={61} y2={-6} stroke="#fff" strokeWidth={1} opacity={0.5} />
        </g>
      )}

      {drink && (
        <g clipPath={`url(#${clip})`}>
          <rect x={10} y={36} width={60} height={70} fill={`url(#fd-liq-${drink.fruit})`} />
          <rect x={10} y={36} width={60} height={70} fill="url(#fd-liq-shade)" />
          {/* foam layer */}
          <rect x={10} y={34} width={60} height={6} fill="#FFFFFF" opacity={0.42} />
          {[20, 27, 35, 44, 52, 59].map((bx, i) => (
            <circle key={i} cx={bx} cy={37.5 + (i % 2)} r={1 + (i % 3) * 0.4} fill="#fff" opacity={0.7} />
          ))}
          {/* fruit flecks */}
          {FLECKS.map(([fx, fy], i) => (
            <ellipse key={i} cx={fx} cy={fy} rx={0.9} ry={0.6} fill={fleck} opacity={0.55} />
          ))}
        </g>
      )}

      {drink?.ice && (
        <g>
          {[
            [24, 33, -12],
            [41, 36, 16],
            [32, 44, 6],
          ].map(([ix, iy, rot], i) => (
            <g key={i} transform={`rotate(${rot} ${ix + 6} ${iy + 6})`} opacity={0.92}>
              <rect x={ix} y={iy} width={13} height={12} rx={2.2} fill="url(#fd-ice)" stroke="#BFE3F5" strokeWidth={0.8} />
              <path d={`M${ix + 2} ${iy + 3} L${ix + 8} ${iy + 2}`} stroke="#fff" strokeWidth={1.4} strokeLinecap="round" />
              <path d={`M${ix + 11} ${iy + 4} L${ix + 11} ${iy + 9}`} stroke="#fff" strokeWidth={0.8} opacity={0.7} strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}

      {/* glass body */}
      <path d="M14 18 L66 18 L61 100 Q40 106 19 100Z" fill="url(#fd-glass)" stroke="rgba(150,130,190,.75)" strokeWidth={1.4} />
      <path d="M19.6 95 L60.4 95 L60 100.5 Q40 106.5 20 100.5Z" fill="#fff" opacity={0.35} />
      <path d="M18 24 L22.5 92" stroke="#fff" strokeWidth={3} opacity={0.65} strokeLinecap="round" />
      <path d="M61.5 26 L58.5 70" stroke="#fff" strokeWidth={1.2} opacity={0.5} strokeLinecap="round" />
      <ellipse cx={40} cy={18} rx={26} ry={4.5} fill="rgba(255,255,255,.3)" stroke="rgba(150,130,190,.8)" strokeWidth={1.2} />
      <path d="M17 17 Q40 13 63 17" stroke="#fff" strokeWidth={1} opacity={0.8} fill="none" />

      {/* condensation on a cold drink */}
      {drink &&
        DROPS.map(([dx, dy, r], i) => (
          <g key={i}>
            <circle cx={dx} cy={dy} r={r} fill="#fff" opacity={0.45} />
            <circle cx={dx - r * 0.3} cy={dy - r * 0.3} r={r * 0.35} fill="#fff" opacity={0.9} />
          </g>
        ))}

      {drink?.cream && <CreamDollop x={40} y={20} s={1.35} />}
      {drink && <FruitGarnish fruit={drink.fruit} />}
    </svg>
  );
}

function FruitGarnish({ fruit }: { fruit: Fruit }) {
  if (fruit === "strawberry") return <StrawberryHalf x={17} y={16} s={0.95} r={-28} />;
  if (fruit === "blueberry")
    return (
      <g>
        <path d="M10 26 L26 6" stroke="#C99A62" strokeWidth={1.3} strokeLinecap="round" />
        <Blueberry x={15} y={20} s={0.9} />
        <Blueberry x={20} y={13} s={0.9} />
      </g>
    );
  return <BananaSlice x={17} y={17} r={-60} />;
}

/** Order / storage thumbnail for any item. */
export function ItemThumb({ item, size = 80 }: { item: Item; size?: number }) {
  if (item.kind === "pancake")
    return <PancakeStack count={item.count} toppings={item.toppings} width={size} />;
  return <DrinkCup drink={item} width={size * 0.55} />;
}

/* ----------------------------- griddle ----------------------------- */

const BUBBLES: [number, number, number][] = [
  [34, 26, 2.4], [58, 22, 2], [66, 36, 2.6], [42, 38, 2], [52, 30, 1.8], [28, 34, 1.6], [72, 28, 1.8], [46, 20, 1.5],
];

/** Single pancake on the griddle surface (top-down-ish). */
export function GriddleCake({
  state,
  progress,
}: {
  state: "cooking" | "cooked" | "burnt";
  progress: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const grad = `gc${uid}`;
  const p = Math.max(0, Math.min(1, progress));
  // Edges brown first, the centre catches up.
  const centre = state === "cooking" ? mix("#F7E9C0", "#EDBA6A", p) : "#EDB262";
  const mid = state === "cooking" ? mix("#F3E0AE", "#DC9A4C", Math.min(1, p * 1.2)) : "#D98F45";
  const edge = state === "cooking" ? mix("#EAD29A", "#A85D24", Math.min(1, p * 1.5)) : "#9E5520";

  return (
    <svg viewBox="0 0 100 64" width={96} height={62} overflow="visible" aria-hidden>
      <defs>
        <radialGradient id={grad} cx="46%" cy="42%" r="58%">
          <stop offset="0%" stopColor={centre} />
          <stop offset="70%" stopColor={mid} />
          <stop offset="100%" stopColor={edge} />
        </radialGradient>
      </defs>
      {/* sizzling oil ring */}
      <ellipse cx={50} cy={34} rx={47} ry={29} fill="rgba(255,220,150,.08)" stroke="rgba(255,230,170,.25)" strokeWidth={1} />
      <ellipse cx={50} cy={36} rx={43} ry={25} fill="rgba(0,0,0,.45)" filter="url(#fd-soft)" />
      <ellipse
        cx={50}
        cy={32}
        rx={42}
        ry={24}
        fill={state === "burnt" ? "url(#fd-burnt)" : `url(#${grad})`}
        stroke={state === "burnt" ? "#0A0402" : edge}
        strokeWidth={1.5}
      />

      {state === "cooking" && (
        <g>
          {/* wet sheen fades as it sets */}
          <ellipse cx={42} cy={24} rx={22} ry={7} fill="#fff" opacity={(1 - p) * 0.4} />
          {BUBBLES.map(([x, y, r], i) => {
            const popped = p > 0.35 + i * 0.06;
            return popped ? (
              <ellipse key={i} cx={x} cy={y} rx={r * 0.7} ry={r * 0.5} fill="#B9772F" opacity={0.55} />
            ) : (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill="rgba(255,250,230,.35)"
                stroke="rgba(170,120,50,.55)"
                strokeWidth={0.8}
                className="bubble"
                style={{ animationDelay: `${i * 0.27}s` }}
              />
            );
          })}
        </g>
      )}

      {state === "cooked" && (
        <g>
          {BUBBLES.map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r * 0.6} ry={r * 0.4} fill="#A9622A" opacity={0.5} />
          ))}
          <ellipse cx={50} cy={32} rx={38} ry={21} fill="none" stroke="#B8692B" strokeWidth={2} opacity={0.35} />
          <ellipse cx={40} cy={23} rx={16} ry={4.5} fill="#FFF0C8" opacity={0.45} />
        </g>
      )}

      {state === "burnt" && (
        <g>
          <path d="M30 28 L40 32 L37 38 M58 22 L62 30 L70 31 M48 40 L54 36" stroke="#5A3420" strokeWidth={1.2} fill="none" opacity={0.8} />
          <g fill="#6B4A36" opacity={0.6}>
            <circle cx={36} cy={24} r={1.4} />
            <circle cx={62} cy={38} r={1.2} />
            <circle cx={55} cy={26} r={0.9} />
            <circle cx={44} cy={35} r={1} />
          </g>
          <ellipse cx={50} cy={32} rx={42} ry={24} fill="none" stroke="#000" strokeWidth={3} opacity={0.5} />
        </g>
      )}
    </svg>
  );
}

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const k = Math.max(0, Math.min(1, t));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",")})`;
}
