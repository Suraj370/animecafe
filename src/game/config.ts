import type { Fruit, Ingredient, Item, Topping } from "./types";

/**
 * Design resolution — matches the mockup the art was extracted from
 * (art-src/mockup.webp), so every overlay lines up pixel for pixel.
 */
export const W = 1213;
export const H = 672;
/** Customers are drawn behind the counter: everything below this y is counter. */
export const COUNTER_Y = 312;

export const STAGE_TIME = 300; // 5 minutes
/** Seconds before the first customer walks in. */
export const FIRST_CUSTOMER_DELAY = 10;
export const MAX_LV = 5;
export const SLATE_SIZE = 6;
export const BATTER_PORTIONS = 4;
export const CHOCOLATE_STAGE = 6;
export const MAX_STACK = 3;

/** Customer standing positions (body centre x, design px) — where they stand in the mockup. */
export const SLOTS_X = [268, 563, 905];
export const ENTRY_X = 1380;
export const EXIT_X = -150;
export const WALK_SPEED = 400; // px per second

export const FRUITS: Fruit[] = ["strawberry", "blueberry", "banana"];
export const TOPPING_ORDER: Topping[] = [
  "syrup",
  "chocolate",
  "strawberry",
  "blueberry",
  "banana",
  "cream",
];

export const stageLabel = (stage: number) =>
  `${Math.floor((stage - 1) / 5) + 1}-${((stage - 1) % 5) + 1}`;
export const targetFor = (stage: number) => 3000 + (stage - 1) * 750; // scaled up for the longer 5-minute stage
/** Score needed for 1, 2 and 3 stars. */
export const starGoals = (stage: number) => [1, 1.3, 1.6].map((k) => Math.round(targetFor(stage) * k));
export const starsFor = (score: number, stage: number) => starGoals(stage).filter((g) => score >= g).length;
export const patienceFor = (stage: number) => Math.max(45, 90 - stage * 3); // seconds a customer waits
export const spawnGap = (stage: number) =>
  Math.max(1.5, 5.5 - stage * 0.35) + Math.random() * 3;

export const whiskTime = (lv: number) => Math.max(0.8, 2.6 - 0.45 * (lv - 1));
export const blendTime = (lv: number) => Math.max(0.8, 2.8 - 0.45 * (lv - 1));
export const cookTime = (lv: number) => Math.max(1.8, 5 - 0.75 * (lv - 1));
export const burnTime = (lv: number) => 5 + 1.25 * (lv - 1);
export const griddleSlots = (lv: number) => (lv >= 3 ? 3 : 2);

export const mixerCost = (lv: number) => 500 * lv;
export const griddleCost = (lv: number) => 700 * lv;
export const slateCost = (unlocked: number) => 400 + (unlocked - 4) * 400;

export function itemPoints(item: Item) {
  if (item.kind === "pancake")
    return 60 + item.count * 30 + item.toppings.length * 30;
  return 110 + (item.ice ? 20 : 0) + (item.cream ? 25 : 0);
}

export const INGREDIENTS: {
  id: Ingredient;
  label: string;
  emoji: string;
}[] = [
  { id: "flour", label: "Flour", emoji: "🌾" },
  { id: "eggs", label: "Eggs", emoji: "🥚" },
  { id: "milk", label: "Milk", emoji: "🥛" },
  { id: "strawberry", label: "Strawberries", emoji: "🍓" },
  { id: "blueberry", label: "Blueberries", emoji: "🫐" },
  { id: "banana", label: "Banana", emoji: "🍌" },
  { id: "ice", label: "Ice", emoji: "🧊" },
  { id: "syrup", label: "Syrup", emoji: "🍯" },
  { id: "cream", label: "Whipped Cream", emoji: "🍦" },
  { id: "chocolate", label: "Chocolate", emoji: "🍫" },
];

export const TOPPING_LABEL: Record<Topping, string> = {
  strawberry: "strawberries",
  blueberry: "blueberries",
  banana: "banana",
  syrup: "syrup",
  cream: "whipped cream",
  chocolate: "chocolate",
};

export const DRINK_COLOR: Record<Fruit, string> = {
  strawberry: "#F78FB3",
  blueberry: "#A77BDB",
  banana: "#FFE08A",
};
