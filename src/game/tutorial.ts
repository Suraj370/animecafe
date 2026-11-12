import type { Action } from "./logic";
import type { Customer, DragSource, GameState } from "./types";

export interface TutStep {
  text: string;
  /** data-tut id of the element to spotlight (the thing to grab) */
  target?: (s: GameState) => string | undefined;
  /** data-tut id of where to drop it — shows an animated drag hand */
  dest?: (s: GameState) => string | undefined;
  /** info step — shows a Next button */
  next?: boolean;
  /** waiting on the game (whisk, cook, blend) — no input needed */
  wait?: boolean;
  /** which player actions are allowed during this step */
  allow?: (a: Action) => boolean;
  /** advance automatically when this becomes true */
  done?: (s: GameState) => boolean;
}

const guest = (s: GameState): Customer | undefined => s.customers[0];
const at = (id: string) => () => id;
const is = (type: Action["type"]) => (a: Action) => a.type === type;
const any =
  (...fs: ((a: Action) => boolean)[]) =>
  (a: Action) =>
    fs.some((f) => f(a));
const drop =
  (src: (d: DragSource) => boolean, target: (t: string) => boolean) =>
  (a: Action) =>
    a.type === "drop" && src(a.source) && target(a.target);
/** Ingredient dragged (or tapped, which becomes a drop) into a given station. */
const ingTo = (ing: string, dest: string) =>
  drop((d) => d.kind === "ingredient" && d.ing === ing, (t) => t === dest);
const toCustomer = (t: string) => t.startsWith("customer-");
const cookedIndex = (s: GameState) => Math.max(0, s.griddle.findIndex((g) => g.state === "cooked"));

export const TUTORIAL_GUEST = {
  look: 0,
  slot: 1,
};

export const TUTORIAL: TutStep[] = [
  {
    text: "Welcome to Anime Café! ☕ Customers walk in one by one and you cook what they order. Everything works by drag & drop — grab an item and drop it where it belongs. Let's serve your first guest!",
    next: true,
  },
  {
    text: "Here comes Ren! Customers walk up to the counter…",
    target: at("customer"),
    wait: true,
    done: (s) => guest(s)?.phase === "waiting",
  },
  {
    text: "This bubble is Ren's order: 1 pancake with strawberries and a strawberry smoothie. The bar on the left is their patience — serve before it runs out!",
    target: at("bubble"),
    next: true,
  },
  {
    text: "Pancakes start with batter. Drag the Flour into the mixing bowl.",
    target: at("ing-flour"),
    dest: at("bowl"),
    allow: ingTo("flour", "bowl"),
    done: (s) => s.bowl.flour,
  },
  {
    text: "Now drag the Eggs into the bowl.",
    target: at("ing-eggs"),
    dest: at("bowl"),
    allow: ingTo("eggs", "bowl"),
    done: (s) => s.bowl.eggs,
  },
  {
    text: "And drag the Milk into the bowl.",
    target: at("ing-milk"),
    dest: at("bowl"),
    allow: ingTo("milk", "bowl"),
    done: (s) => s.bowl.whisk > 0 || s.bowl.batter > 0,
  },
  {
    text: "The mixer whisks everything into batter automatically…",
    target: at("bowl"),
    wait: true,
    done: (s) => s.bowl.batter > 0,
  },
  {
    text: "Batter's ready! Drag the bowl onto the griddle to pour a pancake.",
    target: at("bowl"),
    dest: at("griddle-0"),
    allow: any(is("griddle"), is("bowl"), drop((d) => d.kind === "batter", (t) => t.startsWith("griddle-"))),
    done: (s) => s.griddle.some((g) => g.state === "cooking" || g.state === "cooked"),
  },
  {
    text: "Cooking… In a real round, don't leave it too long or it burns! 🔥",
    target: at("griddle"),
    wait: true,
    done: (s) => s.griddle.some((g) => g.state === "cooked"),
  },
  {
    text: "Golden and glowing — it's done! Drag the pancake onto the plate.",
    target: (s) => `griddle-${cookedIndex(s)}`,
    dest: at("plate"),
    allow: any(is("griddle"), drop((d) => d.kind === "griddle", (t) => t === "plate")),
    done: (s) => (s.plate?.count ?? 0) >= 1,
  },
  {
    text: "Ren wants strawberries on top. Drag the Strawberries onto the pancake.",
    target: at("ing-strawberry"),
    dest: at("plate"),
    allow: ingTo("strawberry", "plate"),
    done: (s) => !!s.plate?.toppings.includes("strawberry"),
  },
  {
    text: "Looks delicious! Drag the plate onto Ren to serve it.",
    target: (s) => (s.held?.from === "plate" ? "customer" : "plate"),
    dest: (s) => (s.held?.from === "plate" ? undefined : "customer"),
    allow: any(is("plate"), is("customer"), drop((d) => d.kind === "plate", toCustomer)),
    done: (s) => !!guest(s)?.order[0]?.done,
  },
  {
    text: "One down! Smoothie time — drag the Milk into the blender.",
    target: at("ing-milk"),
    dest: at("blender"),
    allow: ingTo("milk", "blender"),
    done: (s) => s.blender.milk,
  },
  {
    text: "Now drag the Strawberries into the blender. (Add Ice too when an order shows ice cubes.)",
    target: at("ing-strawberry"),
    dest: at("blender"),
    allow: ingTo("strawberry", "blender"),
    done: (s) => s.blender.fruit === "strawberry",
  },
  {
    text: "Tap the blender's power button to blend.",
    target: at("blender"),
    allow: is("blend"),
    done: (s) => s.blender.blend > 0 || !!s.cup,
  },
  {
    text: "Bzzzz… the smoothie pours into the cup when it's done.",
    target: at("blender"),
    wait: true,
    done: (s) => !!s.cup,
  },
  {
    text: "Drag the cup onto Ren to finish the order.",
    target: (s) => (s.held?.from === "cup" ? "customer" : "cup"),
    dest: (s) => (s.held?.from === "cup" ? undefined : "customer"),
    allow: any(is("cup"), is("customer"), drop((d) => d.kind === "cup", toCustomer)),
    done: (s) => !guest(s) || guest(s)!.order.every((l) => l.done),
  },
  {
    text: "Perfect service! 💖 Happy guests pay coins, and faster service earns bigger tips. Drag spare food onto the Premade Slate to save it, and burnt or wrong food into the trash. Ready?",
    next: true,
  },
];

export const TUTORIAL_LAST = TUTORIAL.length - 1;
