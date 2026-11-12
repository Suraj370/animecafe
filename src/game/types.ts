export type Fruit = "strawberry" | "blueberry" | "banana";
export type Topping = Fruit | "syrup" | "cream" | "chocolate";
export type Ingredient =
  | "flour"
  | "eggs"
  | "milk"
  | "strawberry"
  | "blueberry"
  | "banana"
  | "ice"
  | "syrup"
  | "cream"
  | "chocolate";

export interface PancakeItem {
  kind: "pancake";
  count: number;
  toppings: Topping[];
}
export interface DrinkItem {
  kind: "drink";
  fruit: Fruit;
  ice: boolean;
  cream: boolean;
}
export type Item = PancakeItem | DrinkItem;

export interface OrderLine {
  item: Item;
  done: boolean;
}

export type Mood = "happy" | "neutral" | "angry";

export interface Customer {
  id: number;
  look: number;
  slot: number;
  phase: "entering" | "waiting" | "leaving";
  /** seconds left in the current walk */
  timer: number;
  /** duration of the current walk, used for the CSS transition */
  walkDur: number;
  patience: number;
  maxPatience: number;
  order: OrderLine[];
  mood: Mood;
  outcome?: "served" | "angry";
  rejectFlash: number;
}

export type GriddleSlot =
  | { state: "empty" }
  | { state: "cooking"; t: number }
  | { state: "cooked"; t: number }
  | { state: "burnt" };

export interface Bowl {
  flour: boolean;
  eggs: boolean;
  milk: boolean;
  /** seconds of whisking left, 0 when idle */
  whisk: number;
  batter: number;
}

export interface Blender {
  milk: boolean;
  fruit: Fruit | null;
  ice: boolean;
  /** seconds of blending left, 0 when idle */
  blend: number;
  ready: DrinkItem | null;
}

export type Held =
  | { from: "plate" }
  | { from: "cup" }
  | { from: "slate"; index: number }
  | null;

export interface Popup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  t: number;
}

export interface Progress {
  stage: number;
  coins: number;
  gems: number;
  mixerLv: number;
  griddleLv: number;
  slateUnlocked: number;
  best: Record<number, number>;
  tutorialDone: boolean;
}

export interface RoundResult {
  stage: number;
  cleared: boolean;
  stars: number;
  gems: number;
}

export type Phase = "menu" | "playing" | "paused" | "ended";

export interface GameState {
  loaded: boolean;
  phase: Phase;
  autoPaused: boolean;
  progress: Progress;
  stage: number;
  score: number;
  timeLeft: number;
  served: number;
  lost: number;
  earnedCoins: number;
  customers: Customer[];
  spawnTimer: number;
  bowl: Bowl;
  griddle: GriddleSlot[];
  plate: PancakeItem | null;
  blender: Blender;
  cup: DrinkItem | null;
  slate: (Item | null)[];
  held: Held;
  popups: Popup[];
  toast: { id: number; text: string; t: number } | null;
  showUpgrades: boolean;
  result: RoundResult | null;
  /** current tutorial step, or null outside the tutorial */
  tutorial: number | null;
}

/** Something the player is dragging. */
export type DragSource =
  | { kind: "ingredient"; ing: Ingredient }
  | { kind: "batter" }
  | { kind: "griddle"; index: number }
  | { kind: "plate" }
  | { kind: "cup" }
  | { kind: "slate"; index: number };
