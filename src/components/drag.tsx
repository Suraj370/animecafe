"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { W } from "@/game/config";
import { canDrop, type Action } from "@/game/logic";
import type { DragSource, GameState } from "@/game/types";
import { DrinkCup, GriddleCake, ItemThumb, PancakeStack } from "./Food";

type Drag = { source: DragSource; x: number; y: number; over: string | null };

type Ctx = {
  drag: Drag | null;
  /** spread onto an element to make it draggable */
  draggable: (source: DragSource | null) => {
    onPointerDown?: (e: ReactPointerEvent) => void;
    "data-draggable"?: true;
  };
  /** class for a drop zone: glows when the current drag can land there */
  dropClass: (target: string) => string;
  isDragging: (match: (src: DragSource) => boolean) => boolean;
};

const DragCtx = createContext<Ctx | null>(null);

export function useDrag() {
  const ctx = useContext(DragCtx);
  if (!ctx) throw new Error("useDrag must be used inside DragProvider");
  return ctx;
}

const THRESHOLD = 6; // px of movement before a press becomes a drag

function rootRect() {
  const root = document.querySelector<HTMLElement>(".game-root");
  if (!root) return null;
  const r = root.getBoundingClientRect();
  return { left: r.left, top: r.top, k: r.width / W };
}

function dropTargetAt(clientX: number, clientY: number): string | null {
  for (const el of document.elementsFromPoint(clientX, clientY)) {
    const zone = el.closest<HTMLElement>("[data-drop]");
    if (zone) return zone.dataset.drop ?? null;
  }
  return null;
}

export function DragProvider({
  s,
  dispatch,
  children,
}: {
  s: GameState;
  dispatch: Dispatch<Action>;
  children: ReactNode;
}) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const suppressClickUntil = useRef(0);

  // A finished drag must not also count as a click on whatever is under the pointer.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (performance.now() < suppressClickUntil.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  // Cancel any drag when the round stops (pause, end of stage…).
  const playing = s.phase === "playing";
  const cancelRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!playing) cancelRef.current?.();
  }, [playing]);

  const begin = useCallback(
    (e: ReactPointerEvent, source: DragSource) => {
      if (e.button !== 0) return;
      // Only one drag at a time: drop any half-finished one (e.g. released outside the window).
      cancelRef.current?.();
      const pointerId = e.pointerId;
      const startX = e.clientX;
      const startY = e.clientY;
      let started = false;
      let over: string | null = null;

      const toDesign = (cx: number, cy: number) => {
        const r = rootRect();
        return r ? { x: (cx - r.left) / r.k, y: (cy - r.top) / r.k } : { x: 0, y: 0 };
      };

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        // Mouse button was released somewhere we never heard about — abandon the drag.
        if (ev.pointerType === "mouse" && ev.buttons === 0) return cleanup();
        if (!started) {
          if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < THRESHOLD) return;
          started = true;
        }
        ev.preventDefault();
        over = dropTargetAt(ev.clientX, ev.clientY);
        setDrag({ source, over, ...toDesign(ev.clientX, ev.clientY) });
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", cancel);
        window.removeEventListener("blur", cancel);
        cancelRef.current = null;
        setDrag(null);
      };

      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        // Fast flicks (and some touch screens) can skip pointermove entirely —
        // a release far from the press still counts as a drag.
        if (!started && Math.hypot(ev.clientX - startX, ev.clientY - startY) >= THRESHOLD) started = true;
        if (started) {
          suppressClickUntil.current = performance.now() + 80;
          const target = dropTargetAt(ev.clientX, ev.clientY);
          if (target) dispatch({ type: "drop", source, target });
        }
        cleanup();
      };

      const cancel = () => cleanup();

      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", cancel);
      window.addEventListener("blur", cancel);
      cancelRef.current = cleanup;
    },
    [dispatch],
  );

  const value = useMemo<Ctx>(
    () => ({
      drag,
      draggable: (source) =>
        source && playing ? { onPointerDown: (e) => begin(e, source), "data-draggable": true } : {},
      dropClass: (target) => {
        if (!drag || !canDrop(s, drag.source, target)) return "";
        return drag.over === target ? "drop-over" : "drop-ok";
      },
      isDragging: (match) => !!drag && match(drag.source),
    }),
    [drag, playing, begin, s],
  );

  return (
    <DragCtx.Provider value={value}>
      {children}
      {drag && <DragGhost drag={drag} s={s} />}
    </DragCtx.Provider>
  );
}

function DragGhost({ drag, s }: { drag: Drag; s: GameState }) {
  const src = drag.source;
  let body: ReactNode = null;
  if (src.kind === "ingredient") {
    body = (
      <span
        className="block h-[84px] w-[76px] rounded-[12px] border-2 border-white shadow-lg"
        style={{ backgroundImage: `url(/art/ing-${src.ing}.webp)`, backgroundSize: "100% 100%" }}
      />
    );
  } else if (src.kind === "batter") {
    body = (
      <svg viewBox="0 0 80 60" width={80} height={60} aria-hidden>
        <ellipse cx={40} cy={34} rx={34} ry={20} fill="url(#fd-batter)" stroke="#D9AE58" strokeWidth={2} />
        <path d="M16 34 Q40 24 64 34" stroke="#E6BC66" strokeWidth={1.4} fill="none" />
        <ellipse cx={32} cy={27} rx={13} ry={3.5} fill="#FFFBE6" opacity={0.8} />
      </svg>
    );
  } else if (src.kind === "griddle") {
    const g = s.griddle[src.index];
    body = g && g.state !== "empty" && g.state !== "cooking" ? <GriddleCake state={g.state} progress={1} /> : null;
  } else if (src.kind === "plate") {
    body = s.plate ? <PancakeStack count={s.plate.count} toppings={s.plate.toppings} width={120} /> : null;
  } else if (src.kind === "cup") {
    body = s.cup ? <DrinkCup drink={s.cup} width={62} /> : null;
  } else {
    const item = s.slate[src.index];
    body = item ? <ItemThumb item={item} size={96} /> : null;
  }
  if (!body) return null;
  return (
    <div
      className="drag-ghost pointer-events-none absolute z-[60]"
      style={{ left: drag.x, top: drag.y }}
    >
      {body}
    </div>
  );
}
