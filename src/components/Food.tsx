import { DRINK_COLOR } from "@/game/config";
import type { DrinkItem, Fruit, Item, Topping } from "@/game/types";

function Strawberry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -7 Q8 -7 7 1 Q5 8 0 10 Q-5 8 -7 1 Q-8 -7 0 -7Z" fill="#E8344E" stroke="#B51F38" strokeWidth={0.8} />
      <path d="M-5 -7 L0 -4 L5 -7 L2 -9 L0 -11 L-2 -9Z" fill="#4CAF50" />
      <g fill="#FFE27A">
        <circle cx={-3} cy={-1} r={0.8} />
        <circle cx={3} cy={0} r={0.8} />
        <circle cx={0} cy={4} r={0.8} />
        <circle cx={-2} cy={6} r={0.7} />
      </g>
      <ellipse cx={-3} cy={-3} rx={1.6} ry={2.4} fill="#fff" opacity={0.35} />
    </g>
  );
}

function Blueberry({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4.6} fill="#3E4FA8" stroke="#2A357A" strokeWidth={0.6} />
      <circle cx={x - 1.4} cy={y - 1.6} r={1.3} fill="#fff" opacity={0.5} />
      <path d={`M${x - 1.2} ${y + 1.6} l1.2 -1 l1.2 1`} stroke="#1E2660" strokeWidth={0.7} fill="none" />
    </g>
  );
}

function BananaSlice({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={6.5} ry={4.6} fill="#FFF3C4" stroke="#E5C463" strokeWidth={1} />
      <circle cx={x} cy={y} r={1.1} fill="#C9A24A" />
    </g>
  );
}

function Toppings({ toppings, top }: { toppings: Topping[]; top: number }) {
  const has = (t: Topping) => toppings.includes(t);
  return (
    <g>
      {has("syrup") && (
        <g fill="#A3531C" opacity={0.92}>
          <ellipse cx={60} cy={top + 1} rx={30} ry={7} />
          <path d={`M32 ${top + 2} q-2 9 1 13 q3 -4 2 -13z`} />
          <path d={`M52 ${top + 6} q-1 9 2 12 q2 -4 1 -12z`} />
          <path d={`M78 ${top + 5} q0 7 2 9 q2 -3 1 -9z`} />
          <path d={`M88 ${top + 2} q1 10 3 13 q2 -5 -1 -13z`} />
          <ellipse cx={52} cy={top - 1} rx={8} ry={2} fill="#E89A55" opacity={0.6} />
        </g>
      )}
      {has("chocolate") && (
        <g>
          <path
            d={`M30 ${top} L40 ${top - 4} L48 ${top + 4} L58 ${top - 4} L68 ${top + 4} L78 ${top - 4} L90 ${top + 1}`}
            stroke="#4A2A18"
            strokeWidth={3.2}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <rect x={36} y={top + 2} width={6} height={5} rx={1} fill="#5B3420" transform={`rotate(-15 39 ${top + 4})`} />
          <rect x={80} y={top - 6} width={6} height={5} rx={1} fill="#5B3420" transform={`rotate(20 83 ${top - 4})`} />
        </g>
      )}
      {has("blueberry") && (
        <g>
          <Blueberry x={44} y={top + 4} />
          <Blueberry x={74} y={top + 5} />
          <Blueberry x={33} y={top - 1} />
          <Blueberry x={86} y={top} />
        </g>
      )}
      {has("banana") && (
        <g>
          <BananaSlice x={58} y={top + 5} />
          <BananaSlice x={42} y={top - 4} />
          <BananaSlice x={78} y={top - 4} />
        </g>
      )}
      {has("strawberry") && (
        <g>
          <Strawberry x={38} y={top - 5} />
          <Strawberry x={82} y={top - 5} />
          {!has("cream") && <Strawberry x={60} y={top - 9} />}
        </g>
      )}
      {has("cream") && (
        <g fill="#FFFDF8" stroke="#EADFD6" strokeWidth={1}>
          <ellipse cx={60} cy={top - 3} rx={15} ry={7} />
          <ellipse cx={60} cy={top - 9} rx={11} ry={6} />
          <ellipse cx={60} cy={top - 14} rx={7} ry={4.5} />
          <path d={`M57 ${top - 17} Q60 ${top - 24} 63 ${top - 17}Z`} />
          {has("strawberry") && <Strawberry x={60} y={top - 22} s={0.8} />}
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
  return (
    <svg viewBox="0 0 120 100" width={width} height={(width * 100) / 120} overflow="visible" aria-hidden>
      {plate && (
        <g>
          <ellipse cx={60} cy={82} rx={57} ry={15} fill="#fff" stroke="#E6D6CF" strokeWidth={1.4} />
          <ellipse cx={60} cy={81} rx={42} ry={9.5} fill="#F6EDE8" />
          <ellipse cx={60} cy={92} rx={50} ry={4} fill="rgba(90,40,60,.10)" />
        </g>
      )}
      {layers.map((i) => {
        const y = 74 - i * 11;
        return (
          <g key={i}>
            <ellipse cx={60} cy={y} rx={40} ry={11} fill="#C47A30" />
            <ellipse cx={60} cy={y - 4} rx={40} ry={10} fill="#EBB25E" />
            <ellipse cx={60} cy={y - 4} rx={30} ry={6.5} fill="#F4C97A" opacity={0.75} />
          </g>
        );
      })}
      {count > 0 && <Toppings toppings={toppings} top={top} />}
    </svg>
  );
}

/** A tall glass, empty or filled with a smoothie. viewBox is 80 × 110. */
export function DrinkCup({
  drink,
  width = 70,
}: {
  drink: Pick<DrinkItem, "fruit" | "ice" | "cream"> | null;
  width?: number;
}) {
  const color = drink ? DRINK_COLOR[drink.fruit] : null;
  return (
    <svg viewBox="0 0 80 110" width={width} height={(width * 110) / 80} overflow="visible" aria-hidden>
      <ellipse cx={40} cy={104} rx={26} ry={4} fill="rgba(90,40,60,.12)" />
      {drink && <line x1={50} y1={34} x2={62} y2={-2} stroke="#F06292" strokeWidth={4.5} strokeLinecap="round" />}
      {color && (
        <g>
          <path d="M17 36 L63 36 L59 98 Q40 103 21 98Z" fill={color} />
          <ellipse cx={40} cy={36} rx={23} ry={4} fill="#fff" opacity={0.35} />
          <path d="M21 40 L25 96" stroke="#fff" strokeWidth={3} opacity={0.3} strokeLinecap="round" />
        </g>
      )}
      {drink?.ice && (
        <g fill="#EAF8FF" stroke="#B6DFF2" strokeWidth={1} opacity={0.9}>
          <rect x={24} y={42} width={13} height={13} rx={2} transform="rotate(-12 30 48)" />
          <rect x={42} y={50} width={13} height={13} rx={2} transform="rotate(14 48 56)" />
          <rect x={30} y={62} width={11} height={11} rx={2} transform="rotate(6 35 67)" />
        </g>
      )}
      <path d="M14 20 L66 20 L60 100 Q40 106 20 100Z" fill="rgba(255,255,255,.28)" stroke="#C9B6D9" strokeWidth={2} />
      <ellipse cx={40} cy={20} rx={26} ry={4.5} fill="rgba(255,255,255,.35)" stroke="#C9B6D9" strokeWidth={1.6} />
      {drink?.cream && (
        <g fill="#FFFDF8" stroke="#EADFD6" strokeWidth={1}>
          <path d="M13 22 Q16 6 40 6 Q64 6 67 22Z" />
          <ellipse cx={40} cy={4} rx={11} ry={6} />
          <path d="M36 0 Q40 -9 44 0Z" />
        </g>
      )}
      {drink && <FruitGarnish fruit={drink.fruit} />}
    </svg>
  );
}

function FruitGarnish({ fruit }: { fruit: Fruit }) {
  if (fruit === "strawberry") return <Strawberry x={18} y={18} s={0.9} />;
  if (fruit === "blueberry")
    return (
      <g>
        <Blueberry x={16} y={18} />
        <Blueberry x={23} y={15} />
      </g>
    );
  return <BananaSlice x={18} y={18} />;
}

/** Order / storage thumbnail for any item. */
export function ItemThumb({ item, size = 80 }: { item: Item; size?: number }) {
  if (item.kind === "pancake")
    return <PancakeStack count={item.count} toppings={item.toppings} width={size} />;
  return <DrinkCup drink={item} width={size * 0.55} />;
}

/** Single pancake on the griddle surface (top-down-ish). */
export function GriddleCake({
  state,
  progress,
}: {
  state: "cooking" | "cooked" | "burnt";
  progress: number;
}) {
  const fill =
    state === "burnt" ? "#4B2E1E" : state === "cooked" ? "#E2A24E" : mix("#F6E7BA", "#E7B866", progress);
  const edge = state === "burnt" ? "#2D1A10" : state === "cooked" ? "#B8722C" : mix("#EBD49A", "#C98A3D", progress);
  return (
    <svg viewBox="0 0 100 64" width={96} height={62} overflow="visible" aria-hidden>
      <ellipse cx={50} cy={34} rx={44} ry={26} fill={edge} />
      <ellipse cx={50} cy={31} rx={42} ry={24} fill={fill} />
      {state === "cooking" &&
        [
          [34, 26],
          [58, 22],
          [66, 36],
          [42, 38],
          [52, 30],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={2.2}
            fill="none"
            stroke="rgba(160,110,40,.55)"
            strokeWidth={1}
            className="bubble"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      {state === "cooked" && <ellipse cx={42} cy={24} rx={16} ry={5} fill="#fff" opacity={0.3} />}
      {state === "burnt" && (
        <g fill="#2a1810" opacity={0.6}>
          <circle cx={36} cy={28} r={4} />
          <circle cx={60} cy={34} r={5} />
          <circle cx={50} cy={22} r={3} />
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
