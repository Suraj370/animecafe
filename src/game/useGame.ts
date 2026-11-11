"use client";

import { useEffect, useReducer } from "react";
import { initialState, reducer } from "./logic";

const KEY = "animecafe-progress-v1";

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Restore saved progress once on mount.
  useEffect(() => {
    let saved = {};
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* storage unavailable — play with defaults */
    }
    dispatch({ type: "load", progress: saved });
  }, []);

  // Persist progress whenever it changes (only after the initial load).
  const progressJson = JSON.stringify(state.progress);
  useEffect(() => {
    if (!state.loaded) return;
    try {
      localStorage.setItem(KEY, progressJson);
    } catch {
      /* ignore */
    }
  }, [progressJson, state.loaded]);

  // Game clock.
  useEffect(() => {
    if (state.phase !== "playing") return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", dt: Math.min(0.25, (now - last) / 1000) });
      last = now;
    }, 100);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Pause when the tab is hidden, Escape toggles pause.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: state.phase === "paused" ? "resume" : "pause" });
      if (e.key === " " && state.phase === "playing") {
        e.preventDefault();
        dispatch({ type: "mode", mode: state.mode === "pancake" ? "drink" : "pancake" });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("keydown", onKey);
    };
  }, [state.phase, state.mode]);

  return [state, dispatch] as const;
}
