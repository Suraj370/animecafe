"use client";

import { useCallback, useSyncExternalStore } from "react";
import { H, W } from "@/game/config";
import { useGame } from "@/game/useGame";
import { BottomBar } from "./BottomBar";
import { Counter } from "./Counter";
import { CustomerView } from "./Customers";
import { Hud } from "./Hud";
import { EndOverlay, MenuOverlay, PauseOverlay, UpgradesOverlay } from "./Overlays";
import { CounterBack, SceneBack } from "./Scene";

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
const getScale = () => Math.min(window.innerWidth / W, window.innerHeight / H);
const getServerScale = () => 1;

export default function Game() {
  const [s, dispatch] = useGame();
  const scale = useSyncExternalStore(subscribe, getScale, getServerScale);
  const serve = useCallback((id: number) => dispatch({ type: "customer", id }), [dispatch]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#2a1b2e]">
      <div style={{ width: W * scale, height: H * scale }} className="relative">
        <div
          className="game-root absolute left-0 top-0 select-none overflow-hidden"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <SceneBack served={s.served} lost={s.lost} />

          {/* customers stand behind the counter */}
          {s.customers.map((c) => (
            <CustomerView key={c.id} c={c} holding={!!s.held} onServe={serve} />
          ))}

          <CounterBack />
          <Counter s={s} dispatch={dispatch} />
          <BottomBar s={s} dispatch={dispatch} />
          <Hud s={s} dispatch={dispatch} />

          {/* floating score popups */}
          {s.popups.map((p) => (
            <div
              key={p.id}
              className="score-pop pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap text-[26px] font-bold"
              style={{ left: p.x, top: p.y, color: p.color }}
            >
              {p.text}
            </div>
          ))}

          {s.toast && (
            <div key={s.toast.id} className="toast pointer-events-none absolute left-1/2 top-[290px] z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#3E2A47]/90 px-5 py-2 text-[17px] font-semibold text-white shadow-lg">
              {s.toast.text}
            </div>
          )}

          {s.phase === "menu" && !s.showUpgrades && <MenuOverlay s={s} dispatch={dispatch} />}
          {s.phase === "paused" && !s.showUpgrades && <PauseOverlay s={s} dispatch={dispatch} />}
          {s.phase === "ended" && !s.showUpgrades && <EndOverlay s={s} dispatch={dispatch} />}
          {s.showUpgrades && <UpgradesOverlay s={s} dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
}
