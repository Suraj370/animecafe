import * as C from "./config";
import { LOOKS } from "./looks";
import { TUTORIAL, TUTORIAL_GUEST, TUTORIAL_LAST } from "./tutorial";
import type {
  Customer,
  DragSource,
  DrinkItem,
  Fruit,
  GameState,
  Held,
  Ingredient,
  Item,
  OrderLine,
  PancakeItem,
  Progress,
  Topping,
} from "./types";

export type Action =
  | { type: "load"; progress: Partial<Progress> }
  | { type: "start" }
  | { type: "retry" }
  | { type: "next" }
  | { type: "menu" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "resetProgress" }
  | { type: "upgrades"; open: boolean }
  | { type: "upgrade"; what: "mixer" | "griddle" | "slate" }
  | { type: "tick"; dt: number }
  | { type: "ingredient"; ing: Ingredient }
  | { type: "bowl" }
  | { type: "griddle"; index: number }
  | { type: "plate" }
  | { type: "cup" }
  | { type: "blend" }
  | { type: "slate"; index: number }
  | { type: "customer"; id: number }
  | { type: "trash" }
  | { type: "drop"; source: DragSource; target: string }
  | { type: "tutorial" }
  | { type: "tutorialNext" }
  | { type: "tutorialSkip" };

const GAMEPLAY: Action["type"][] = [
  "ingredient",
  "bowl",
  "griddle",
  "plate",
  "cup",
  "blend",
  "slate",
  "customer",
  "trash",
  "drop",
];

let uid = 1;
const nextId = () => uid++;
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const sortToppings = (t: Topping[]) =>
  C.TOPPING_ORDER.filter((x) => t.includes(x));

export function itemsEqual(a: Item, b: Item) {
  if (a.kind === "pancake" && b.kind === "pancake")
    return (
      a.count === b.count &&
      a.toppings.length === b.toppings.length &&
      a.toppings.every((t) => b.toppings.includes(t))
    );
  if (a.kind === "drink" && b.kind === "drink")
    return a.fruit === b.fruit && a.ice === b.ice && a.cream === b.cream;
  return false;
}

export function randomOrder(stage: number): OrderLine[] {
  const both = Math.random() < Math.min(0.8, 0.35 + stage * 0.08);
  const pancakeOnly = Math.random() < 0.6;
  const lines: OrderLine[] = [];
  if (both || pancakeOnly) {
    const pool: Topping[] = ["strawberry", "blueberry", "banana", "syrup", "cream"];
    if (stage >= C.CHOCOLATE_STAGE) pool.push("chocolate");
    const maxTops = Math.min(3, 1 + Math.floor(stage / 2));
    const n = Math.floor(Math.random() * (maxTops + 1));
    const counts = stage === 1 ? [1, 2] : [1, 2, 3];
    lines.push({
      done: false,
      item: {
        kind: "pancake",
        count: pick(counts),
        toppings: sortToppings(shuffle(pool).slice(0, n)),
      },
    });
  }
  if (both || !pancakeOnly) {
    lines.push({
      done: false,
      item: {
        kind: "drink",
        fruit: pick(C.FRUITS),
        ice: stage >= 2 && Math.random() < 0.45,
        cream: stage >= 3 && Math.random() < 0.35,
      },
    });
  }
  return lines;
}

export const defaultProgress = (): Progress => ({
  stage: 1,
  coins: 1000,
  gems: 20,
  mixerLv: 1,
  griddleLv: 1,
  slateUnlocked: 4,
  best: {},
  tutorialDone: false,
});

function sanitize(p: Partial<Progress>): Progress {
  const d = defaultProgress();
  const num = (v: unknown, fallback: number, min: number, max: number) =>
    typeof v === "number" && Number.isFinite(v)
      ? Math.min(max, Math.max(min, Math.floor(v)))
      : fallback;
  return {
    stage: num(p.stage, d.stage, 1, 999),
    coins: num(p.coins, d.coins, 0, 1e9),
    gems: num(p.gems, d.gems, 0, 1e9),
    mixerLv: num(p.mixerLv, d.mixerLv, 1, C.MAX_LV),
    griddleLv: num(p.griddleLv, d.griddleLv, 1, C.MAX_LV),
    slateUnlocked: num(p.slateUnlocked, d.slateUnlocked, 4, C.SLATE_SIZE),
    best: p.best && typeof p.best === "object" ? p.best : {},
    tutorialDone: p.tutorialDone === true,
  };
}

function tutorialRound(state: GameState): GameState {
  return { ...freshRound(state.progress, 1), phase: "playing", loaded: state.loaded, tutorial: 0 };
}

function spawnTutorialGuest(s: GameState) {
  const slot = TUTORIAL_GUEST.slot;
  const walk = (C.ENTRY_X - C.SLOTS_X[slot]) / C.WALK_SPEED;
  s.customers = [
    {
      id: nextId(),
      look: TUTORIAL_GUEST.look,
      slot,
      phase: "entering",
      timer: walk,
      walkDur: walk,
      patience: 60,
      maxPatience: 60,
      order: [
        { done: false, item: { kind: "pancake", count: 1, toppings: ["strawberry"] } },
        { done: false, item: { kind: "drink", fruit: "strawberry", ice: false, cream: false } },
      ],
      mood: "happy",
      rejectFlash: 0,
    },
  ];
}

function advanceTutorial(s: GameState) {
  while (s.tutorial !== null && s.tutorial < TUTORIAL_LAST) {
    const step = TUTORIAL[s.tutorial];
    if (!step.done?.(s)) break;
    s.tutorial += 1;
  }
}

function finishTutorial(state: GameState): GameState {
  const progress = { ...state.progress, tutorialDone: true };
  return { ...freshRound(progress, progress.stage), phase: "playing", loaded: state.loaded };
}

function freshRound(
  progress: Progress,
  stage: number,
): Omit<GameState, "phase" | "loaded"> {
  return {
    autoPaused: false,
    progress,
    stage,
    score: 0,
    timeLeft: C.STAGE_TIME,
    served: 0,
    lost: 0,
    earnedCoins: 0,
    customers: [],
    spawnTimer: 1,
    bowl: { flour: false, eggs: false, milk: false, whisk: 0, batter: 0 },
    griddle: Array.from({ length: C.griddleSlots(progress.griddleLv) }, () => ({
      state: "empty" as const,
    })),
    plate: null,
    blender: { milk: false, fruit: null, ice: false, blend: 0, ready: null },
    cup: null,
    slate: Array(C.SLATE_SIZE).fill(null),
    held: null,
    popups: [],
    toast: null,
    showUpgrades: false,
    result: null,
    tutorial: null,
  };
}

export function initialState(): GameState {
  const progress = defaultProgress();
  return { ...freshRound(progress, progress.stage), phase: "menu", loaded: false };
}

// ---------- helpers that mutate a cloned draft ----------

function toast(s: GameState, text: string) {
  s.toast = { id: nextId(), text, t: 2 };
}

function popup(s: GameState, x: number, y: number, text: string, color: string) {
  s.popups.push({ id: nextId(), x, y, text, color, t: 1.3 });
}

function itemAt(s: GameState, h: NonNullable<Held>): Item | null {
  if (h.from === "plate") return s.plate;
  if (h.from === "cup") return s.cup;
  return s.slate[h.index] ?? null;
}

function take(s: GameState, h: NonNullable<Held>) {
  if (h.from === "plate") s.plate = null;
  else if (h.from === "cup") s.cup = null;
  else s.slate[h.index] = null;
  s.held = null;
}

function startLeaving(c: Customer, outcome: "served" | "angry") {
  c.phase = "leaving";
  c.outcome = outcome;
  c.mood = outcome === "served" ? "happy" : "angry";
  c.walkDur = (C.SLOTS_X[c.slot] - C.EXIT_X) / C.WALK_SPEED;
  c.timer = c.walkDur;
}

function serve(s: GameState, c: Customer, item: Item, src: NonNullable<Held>) {
  const line = c.order.find((l) => !l.done && itemsEqual(l.item, item));
  if (!line) return false;
  line.done = true;
  take(s, src);
  const x = C.SLOTS_X[c.slot];
  const pts = C.itemPoints(item);
  s.score += pts;
  popup(s, x, 150, `+${pts}`, "#FFD34D");
  if (c.order.every((l) => l.done)) {
    const total = c.order.reduce((sum, l) => sum + C.itemPoints(l.item), 0);
    const tip = Math.round(total * 0.5 * (c.patience / c.maxPatience));
    const coins = Math.round(total * 0.25 + tip * 0.5);
    s.score += tip;
    s.progress.coins += coins;
    s.earnedCoins += coins;
    s.served += 1;
    if (tip > 0) popup(s, x + 40, 110, `Tip +${tip}`, "#FF9EC4");
    popup(s, x - 40, 200, `+${coins} coins`, "#FFC93C");
    startLeaving(c, "served");
  }
  return true;
}

function addTopping(s: GameState, t: Topping) {
  if (!s.plate) return toast(s, "Put a pancake on the plate first!");
  if (s.plate.toppings.includes(t))
    return toast(s, `Already has ${C.TOPPING_LABEL[t]}`);
  s.plate.toppings = sortToppings([...s.plate.toppings, t]);
}

function addToBowl(s: GameState, ing: "flour" | "eggs" | "milk") {
  if (s.bowl.whisk > 0) return toast(s, "The mixer is busy whisking…");
  if (s.bowl.batter > 0)
    return toast(s, "Use up the batter first — tap the griddle!");
  if (s.bowl[ing]) return toast(s, `Bowl already has ${ing}`);
  s.bowl[ing] = true;
  if (s.bowl.flour && s.bowl.eggs && s.bowl.milk)
    s.bowl.whisk = C.whiskTime(s.progress.mixerLv);
}

function blenderBusy(s: GameState) {
  if (s.blender.blend > 0 || s.blender.ready) {
    toast(s, "Blender is busy — free up the cup first");
    return true;
  }
  return false;
}

export type Dest = "bowl" | "blender" | "plate" | "cup";
const DESTS: string[] = ["bowl", "blender", "plate", "cup"];
const TOPPINGS: Ingredient[] = ["strawberry", "blueberry", "banana", "syrup", "cream", "chocolate"];
const isFruit = (i: Ingredient): i is Fruit => (C.FRUITS as string[]).includes(i);
const label = (i: Ingredient) => C.INGREDIENTS.find((x) => x.id === i)?.label ?? i;

/**
 * Where a tapped ingredient goes. Picked from what's already on the counter,
 * so there's no Pancake/Drink mode to switch. Dragging always goes exactly
 * where the player drops it.
 */
export function autoRoute(s: GameState, ing: Ingredient): Dest {
  const bowlFree = s.bowl.whisk <= 0 && s.bowl.batter <= 0;
  const blenderFree = s.blender.blend <= 0 && !s.blender.ready;
  const drinkStarted = blenderFree && (!!s.blender.fruit || s.blender.ice);
  switch (ing) {
    case "flour":
    case "eggs":
      return "bowl";
    case "milk":
      if (drinkStarted && !s.blender.milk) return "blender";
      if (bowlFree && !s.bowl.milk) return "bowl";
      return "blender";
    case "strawberry":
    case "blueberry":
    case "banana":
      if (s.plate && !s.plate.toppings.includes(ing)) return "plate";
      if (blenderFree && !s.blender.fruit) return "blender";
      return "plate";
    case "ice":
      return "blender";
    case "cream":
      if (s.plate && !s.plate.toppings.includes("cream")) return "plate";
      if (s.cup && !s.cup.cream) return "cup";
      return "plate";
    default:
      return "plate";
  }
}

function ingredientInto(s: GameState, ing: Ingredient, dest: Dest) {
  switch (dest) {
    case "bowl":
      if (ing === "flour" || ing === "eggs" || ing === "milk") return addToBowl(s, ing);
      return toast(s, `${label(ing)} doesn't go in the bowl`);
    case "blender":
      if (ing !== "milk" && ing !== "ice" && !isFruit(ing))
        return toast(s, `${label(ing)} doesn't go in the blender`);
      if (blenderBusy(s)) return;
      if (ing === "milk") {
        if (s.blender.milk) return toast(s, "Blender already has milk");
        s.blender.milk = true;
      } else if (ing === "ice") {
        if (s.blender.ice) return toast(s, "Blender already has ice");
        s.blender.ice = true;
      } else {
        if (s.blender.fruit) return toast(s, "One fruit per smoothie!");
        s.blender.fruit = ing;
      }
      return;
    case "plate":
      if (ing === "chocolate" && s.stage < C.CHOCOLATE_STAGE)
        return toast(s, `Chocolate unlocks at stage ${C.stageLabel(C.CHOCOLATE_STAGE)}`);
      if (!TOPPINGS.includes(ing)) return toast(s, `${label(ing)} isn't a pancake topping`);
      return addTopping(s, ing as Topping);
    case "cup":
      if (ing !== "cream") return toast(s, "Only whipped cream goes on top of drinks");
      if (!s.cup) return toast(s, "Blend a drink first!");
      if (s.cup.cream) return toast(s, "Drink already has cream");
      s.cup.cream = true;
      return;
  }
}

function plateFromGriddle(s: GameState, index: number) {
  if (s.plate && s.plate.toppings.length)
    return toast(s, "Plate is already topped — serve or trash it");
  if (s.plate && s.plate.count >= C.MAX_STACK) return toast(s, `Max ${C.MAX_STACK} pancakes per plate`);
  const plate: PancakeItem = s.plate ?? { kind: "pancake", count: 0, toppings: [] };
  plate.count += 1;
  s.plate = plate;
  s.griddle[index] = { state: "empty" };
}

function reject(s: GameState, c: Customer) {
  c.rejectFlash = 0.6;
  c.patience = Math.max(0.5, c.patience - 3);
  toast(s, `${LOOKS[c.look].name} didn't order that!`);
}

const splitTarget = (t: string): [string, number] => {
  const i = t.indexOf("-");
  return i < 0 ? [t, NaN] : [t.slice(0, i), Number(t.slice(i + 1))];
};

/** Whether `src` can be dropped on `target` right now — used to light up drop zones. */
export function canDrop(s: GameState, src: DragSource, target: string): boolean {
  const [kind, n] = splitTarget(target);
  switch (src.kind) {
    case "ingredient": {
      const i = src.ing;
      if (target === "bowl")
        return (i === "flour" || i === "eggs" || i === "milk") && s.bowl.whisk <= 0 && s.bowl.batter <= 0 && !s.bowl[i];
      if (target === "blender") return (i === "milk" || i === "ice" || isFruit(i)) && s.blender.blend <= 0 && !s.blender.ready;
      if (target === "plate")
        return TOPPINGS.includes(i) && !!s.plate && (i !== "chocolate" || s.stage >= C.CHOCOLATE_STAGE);
      if (target === "cup") return i === "cream" && !!s.cup && !s.cup.cream;
      return false;
    }
    case "batter":
      return kind === "griddle" && s.griddle[n]?.state === "empty";
    case "griddle": {
      const g = s.griddle[src.index];
      if (target === "trash") return g?.state === "cooked" || g?.state === "burnt";
      return target === "plate" && g?.state === "cooked";
    }
    default: {
      if (target === "trash") return true;
      if (kind === "customer") return s.customers.some((c) => c.id === n && c.phase === "waiting");
      if (kind === "slate")
        return n < s.progress.slateUnlocked && !s.slate[n] && !(src.kind === "slate" && src.index === n);
      return false;
    }
  }
}

function handleDrop(s: GameState, src: DragSource, target: string) {
  const [kind, n] = splitTarget(target);
  if (src.kind === "ingredient") {
    if (DESTS.includes(target)) ingredientInto(s, src.ing, target as Dest);
    else if (target !== "trash") toast(s, "Ingredients go in the bowl, blender, plate or cup");
    return;
  }
  if (src.kind === "batter") {
    if (kind !== "griddle") return toast(s, "Drop the batter onto the griddle");
    if (s.griddle[n]?.state !== "empty") return toast(s, "That spot is taken");
    return pourBatter(s, n);
  }
  if (src.kind === "griddle") {
    const g = s.griddle[src.index];
    if (!g || g.state === "empty") return;
    if (g.state === "cooking") return toast(s, "Still cooking…");
    if (target === "trash") {
      s.griddle[src.index] = { state: "empty" };
      return toast(s, g.state === "burnt" ? "Burnt pancake tossed 💨" : "Tossed in the trash");
    }
    if (target !== "plate") return toast(s, "Drop the pancake onto the plate");
    if (g.state === "burnt") return toast(s, "That one's burnt — drag it to the trash");
    return plateFromGriddle(s, src.index);
  }
  const from: NonNullable<Held> = src.kind === "slate" ? { from: "slate", index: src.index } : { from: src.kind };
  const item = itemAt(s, from);
  if (!item) return;
  if (kind === "customer") {
    const c = s.customers.find((x) => x.id === n && x.phase === "waiting");
    if (c && !serve(s, c, item, from)) reject(s, c);
  } else if (kind === "slate") {
    if (n >= s.progress.slateUnlocked) toast(s, "Unlock this slot first");
    else if (s.slate[n]) toast(s, "That slot is already full");
    else {
      take(s, from);
      s.slate[n] = item;
    }
  } else if (target === "trash") {
    take(s, from);
    toast(s, "Tossed in the trash");
  } else if (target !== src.kind) {
    toast(s, "Drag it onto a customer, the slate or the trash");
  }
}

function pourBatter(s: GameState, index: number) {
  if (s.bowl.batter <= 0) {
    toast(s, "Make batter: Flour + Eggs + Milk");
    return;
  }
  s.griddle[index] = { state: "cooking", t: 0 };
  s.bowl.batter -= 1;
}

function endRound(s: GameState) {
  s.timeLeft = 0;
  s.phase = "ended";
  s.held = null;
  s.showUpgrades = false;
  const target = C.targetFor(s.stage);
  const cleared = s.score >= target;
  const stars = !cleared ? 0 : C.starsFor(s.score, s.stage);
  const gems = stars === 3 ? 5 : stars === 2 ? 2 : 0;
  s.progress.gems += gems;
  s.progress.best = {
    ...s.progress.best,
    [s.stage]: Math.max(s.progress.best[s.stage] ?? 0, s.score),
  };
  if (cleared) s.progress.stage = Math.max(s.progress.stage, s.stage + 1);
  s.result = { stage: s.stage, cleared, stars, gems };
}

function tick(s: GameState, dt: number) {
  const p = s.progress;
  const tut = s.tutorial !== null; // the tutorial has no clock, burning or impatience
  if (!tut) s.timeLeft -= dt;

  // bowl
  if (s.bowl.whisk > 0) {
    s.bowl.whisk -= dt;
    if (s.bowl.whisk <= 0) {
      s.bowl = { flour: false, eggs: false, milk: false, whisk: 0, batter: C.BATTER_PORTIONS };
    }
  }

  // griddle
  s.griddle = s.griddle.map((g) => {
    if (g.state === "cooking") {
      const t = g.t + dt;
      return t >= C.cookTime(p.griddleLv) ? { state: "cooked", t: 0 } : { state: "cooking", t };
    }
    if (g.state === "cooked") {
      if (tut) return g;
      const t = g.t + dt;
      return t >= C.burnTime(p.griddleLv) ? { state: "burnt" } : { state: "cooked", t };
    }
    return g;
  });

  // blender
  const b = s.blender;
  if (b.blend > 0) {
    b.blend -= dt;
    if (b.blend <= 0 && b.fruit) {
      const drink: DrinkItem = { kind: "drink", fruit: b.fruit, ice: b.ice, cream: false };
      s.blender = { milk: false, fruit: null, ice: false, blend: 0, ready: drink };
    }
  }
  if (s.blender.ready && !s.cup) {
    s.cup = s.blender.ready;
    s.blender.ready = null;
  }

  // customers
  for (const c of s.customers) {
    c.rejectFlash = Math.max(0, c.rejectFlash - dt);
    if (c.phase === "entering") {
      c.timer -= dt;
      if (c.timer <= 0) c.phase = "waiting";
    } else if (c.phase === "waiting") {
      if (tut) continue;
      c.patience -= dt;
      const r = c.patience / c.maxPatience;
      c.mood = r > 0.55 ? "happy" : r > 0.25 ? "neutral" : "angry";
      if (c.patience <= 0) {
        c.patience = 0;
        s.lost += 1;
        popup(s, C.SLOTS_X[c.slot], 120, "Too slow!", "#FF6B81");
        startLeaving(c, "angry");
      }
    } else {
      c.timer -= dt;
    }
  }
  s.customers = s.customers.filter((c) => !(c.phase === "leaving" && c.timer <= 0));

  // spawn customers one by one
  if (!tut) s.spawnTimer -= dt;
  if (!tut && s.spawnTimer <= 0) {
    const occupied = new Set(
      s.customers.filter((c) => c.phase !== "leaving").map((c) => c.slot),
    );
    const free = [0, 1, 2].filter((i) => !occupied.has(i));
    const someoneWalkingIn = s.customers.some((c) => c.phase === "entering");
    if (free.length && !someoneWalkingIn && s.timeLeft > 12) {
      const slot = pick(free);
      // Never two of the same character at the counter. Prefer one that isn't even walking out.
      const atCounter = new Set(s.customers.filter((c) => c.phase !== "leaving").map((c) => c.look));
      const onScreen = new Set(s.customers.map((c) => c.look));
      const freeLooks = LOOKS.map((_, i) => i).filter((i) => !atCounter.has(i));
      const fresh = freeLooks.filter((i) => !onScreen.has(i));
      const looks = fresh.length ? fresh : freeLooks;
      const patience = C.patienceFor(s.stage);
      const walk = (C.ENTRY_X - C.SLOTS_X[slot]) / C.WALK_SPEED;
      s.customers.push({
        id: nextId(),
        look: pick(looks.length ? looks : LOOKS.map((_, i) => i)),
        slot,
        phase: "entering",
        timer: walk,
        walkDur: walk,
        patience,
        maxPatience: patience,
        order: randomOrder(s.stage),
        mood: "happy",
        rejectFlash: 0,
      });
      s.spawnTimer = C.spawnGap(s.stage);
    } else {
      s.spawnTimer = 1.2;
    }
  }

  // fx
  s.popups = s.popups
    .map((pp) => ({ ...pp, t: pp.t - dt }))
    .filter((pp) => pp.t > 0);
  if (s.toast) {
    s.toast.t -= dt;
    if (s.toast.t <= 0) s.toast = null;
  }

  if (!tut && s.timeLeft <= 0) endRound(s);
}

function upgrade(s: GameState, what: "mixer" | "griddle" | "slate") {
  const p = s.progress;
  if (what === "slate") {
    if (p.slateUnlocked >= C.SLATE_SIZE) return toast(s, "All slate slots unlocked");
    const cost = C.slateCost(p.slateUnlocked);
    if (p.coins < cost) return toast(s, `Need ${cost} coins`);
    p.coins -= cost;
    p.slateUnlocked += 1;
    return toast(s, "New slate slot unlocked!");
  }
  const lvKey = what === "mixer" ? "mixerLv" : "griddleLv";
  const lv = p[lvKey];
  if (lv >= C.MAX_LV) return toast(s, `${what === "mixer" ? "Mixer" : "Griddle"} is max level`);
  const cost = what === "mixer" ? C.mixerCost(lv) : C.griddleCost(lv);
  if (p.coins < cost) return toast(s, `Need ${cost} coins`);
  p.coins -= cost;
  p[lvKey] = lv + 1;
  if (what === "griddle") {
    while (s.griddle.length < C.griddleSlots(p.griddleLv)) s.griddle.push({ state: "empty" });
  }
  toast(s, `${what === "mixer" ? "Mixer" : "Griddle"} upgraded to Lv.${lv + 1}!`);
}

export function canAffordUpgrade(p: Progress) {
  return (
    (p.mixerLv < C.MAX_LV && p.coins >= C.mixerCost(p.mixerLv)) ||
    (p.griddleLv < C.MAX_LV && p.coins >= C.griddleCost(p.griddleLv)) ||
    (p.slateUnlocked < C.SLATE_SIZE && p.coins >= C.slateCost(p.slateUnlocked))
  );
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "load": {
      const progress = sanitize(action.progress);
      return { ...freshRound(progress, progress.stage), phase: "menu", loaded: true };
    }
    case "resetProgress": {
      const progress = defaultProgress();
      return { ...freshRound(progress, 1), phase: "menu", loaded: state.loaded };
    }
    case "start":
      if (!state.progress.tutorialDone) return tutorialRound(state);
      return { ...freshRound(state.progress, state.progress.stage), phase: "playing", loaded: state.loaded };
    case "tutorial":
      return tutorialRound(state);
    case "tutorialSkip":
      return state.tutorial === null ? state : finishTutorial(state);
    case "tutorialNext": {
      if (state.tutorial === null || state.phase !== "playing") return state;
      if (!TUTORIAL[state.tutorial].next) return state;
      if (state.tutorial >= TUTORIAL_LAST) return finishTutorial(state);
      const s = structuredClone(state);
      s.tutorial = state.tutorial + 1;
      if (state.tutorial === 0) spawnTutorialGuest(s);
      advanceTutorial(s);
      return s;
    }
    case "retry":
      return { ...freshRound(state.progress, state.stage), phase: "playing", loaded: state.loaded };
    case "next":
      return {
        ...freshRound(state.progress, state.result?.cleared ? state.stage + 1 : state.stage),
        phase: "playing",
        loaded: state.loaded,
      };
    case "menu":
      return { ...freshRound(state.progress, state.progress.stage), phase: "menu", loaded: state.loaded };
    case "pause":
      return state.phase === "playing" ? { ...state, phase: "paused", autoPaused: false } : state;
    case "resume":
      return state.phase === "paused" ? { ...state, phase: "playing", showUpgrades: false } : state;
    case "upgrades": {
      if (action.open) {
        const pausing = state.phase === "playing";
        return {
          ...state,
          showUpgrades: true,
          phase: pausing ? "paused" : state.phase,
          autoPaused: pausing || state.autoPaused,
        };
      }
      const resume = state.phase === "paused" && state.autoPaused;
      return { ...state, showUpgrades: false, autoPaused: false, phase: resume ? "playing" : state.phase };
    }
    case "upgrade": {
      const s = structuredClone(state);
      upgrade(s, action.what);
      return s;
    }
  }

  if (state.phase !== "playing") return state;
  // A tapped ingredient is the same as dragging it to the station it fits right now.
  if (action.type === "ingredient")
    action = { type: "drop", source: { kind: "ingredient", ing: action.ing }, target: autoRoute(state, action.ing) };
  if (state.tutorial !== null && GAMEPLAY.includes(action.type)) {
    const allow = TUTORIAL[state.tutorial].allow;
    if (!allow?.(action)) {
      const s = structuredClone(state);
      toast(s, "Follow the highlighted step 👆");
      return s;
    }
  }
  const s = structuredClone(state);

  switch (action.type) {
    case "tick":
      tick(s, action.dt);
      break;
    case "drop":
      handleDrop(s, action.source, action.target);
      break;
    case "bowl": {
      if (s.bowl.batter > 0) {
        const i = s.griddle.findIndex((g) => g.state === "empty");
        if (i < 0) toast(s, "Griddle is full!");
        else pourBatter(s, i);
      } else if (s.bowl.whisk <= 0) {
        const missing = (["flour", "eggs", "milk"] as const).filter((k) => !s.bowl[k]);
        toast(s, `Drag into the bowl: ${missing.join(", ")}`);
      }
      break;
    }
    case "griddle": {
      const g = s.griddle[action.index];
      if (!g) break;
      if (g.state === "empty") pourBatter(s, action.index);
      else if (g.state === "cooking") toast(s, "Still cooking…");
      else if (g.state === "burnt") {
        s.griddle[action.index] = { state: "empty" };
        toast(s, "Burnt pancake tossed 💨");
      } else {
        plateFromGriddle(s, action.index);
      }
      break;
    }
    case "plate":
      if (!s.plate) toast(s, "Cook a pancake, then tap it to plate it");
      else s.held = s.held?.from === "plate" ? null : { from: "plate" };
      break;
    case "cup":
      if (!s.cup) toast(s, "Blend a drink to fill the cup");
      else s.held = s.held?.from === "cup" ? null : { from: "cup" };
      break;
    case "blend": {
      const b = s.blender;
      if (b.blend > 0) break;
      if (b.ready) toast(s, "Serve or store the drink in the cup first");
      else if (!b.milk || !b.fruit)
        toast(s, "Drag Milk + a Fruit into the blender (Ice optional), then blend");
      else b.blend = C.blendTime(s.progress.mixerLv);
      break;
    }
    case "slate": {
      const i = action.index;
      if (i >= s.progress.slateUnlocked) {
        if (i === s.progress.slateUnlocked) upgrade(s, "slate");
        else toast(s, "Unlock the previous slot first");
        break;
      }
      const there = s.slate[i];
      if (s.held) {
        if (s.held.from === "slate" && s.held.index === i) {
          s.held = null;
        } else if (!there) {
          const item = itemAt(s, s.held);
          if (item) {
            take(s, s.held);
            s.slate[i] = item;
          }
        } else {
          s.held = { from: "slate", index: i };
        }
      } else if (there) {
        s.held = { from: "slate", index: i };
      } else {
        toast(s, "Select a plate or cup, then tap here to store it");
      }
      break;
    }
    case "customer": {
      const c = s.customers.find((x) => x.id === action.id);
      if (!c || c.phase !== "waiting") break;
      if (s.held) {
        const item = itemAt(s, s.held);
        if (item && serve(s, c, item, s.held)) break;
        reject(s, c);
        break;
      }
      const sources: NonNullable<Held>[] = [
        { from: "plate" },
        { from: "cup" },
        ...s.slate.map((_, index) => ({ from: "slate" as const, index })),
      ];
      const served = sources.some((src) => {
        const item = itemAt(s, src);
        return item ? serve(s, c, item, src) : false;
      });
      if (!served) toast(s, "Nothing ready matches this order yet");
      break;
    }
    case "trash":
      if (s.held) {
        take(s, s.held);
        toast(s, "Tossed in the trash");
      } else if (s.plate) {
        s.plate = null;
        toast(s, "Plate cleared");
      } else if (s.blender.milk || s.blender.fruit || s.blender.ice) {
        if (s.blender.blend <= 0) {
          s.blender = { ...s.blender, milk: false, fruit: null, ice: false };
          toast(s, "Blender emptied");
        }
      } else toast(s, "Select an item, then tap the trash");
      break;
  }
  advanceTutorial(s);
  return s;
}
