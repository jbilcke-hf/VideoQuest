import { lugrasimo } from "@/lib/fonts"
import { Game } from "./types"

const actions = [
  "idling",
  "making bubbles",
  "making circles",
  "opening and closing its mouth",
  // "with an octopus",
  "playing with another fish",
  "eating fishfood",
  "eating a crab",
  "attacked by a jellyfish"
]

const positions = [
  "at the top of the coral",
  "at the bottom of the coral",
  "centered in the middle",
  "burrowing in the sand",
  "hiding in the coral"
]

const lights = [
  "during the day",
]

const initialActionnables = [
  "chest",
  "box",
  // "door",
  // "window",
  // "sail",
  // "capstan",
  // "ship's wheel",
  // "hat",
  // "barrel",
  // "cannon",
  // "rope",
  // "bucket",
 // "skull",
  "parrot",
  "lock",
  // "ship",
  // "wooden leg"
]

const initialSituation = [
  `inside the hold of a pirate ship`,
  `a pirate chest in the center with a large lock`,
  `a parrot on top of it`,
  `at sunset`,
].join(", ")

export const game: Game = {
  title: "Pirates",
  type: "pirates",
  engine: "cartesian_image",
  className: lugrasimo.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    // this prompt is beautiful:
    // screenshot from an adventure videogame, inside the hold of a pirate ship, with a pirate chest in the center, at sunset, beautiful, award winning, unreal engine, intricate details
      `screenshot from an adventure videogame`,
      `pirate themed`,
      `unreal engine`,
      `pixar style`,
      `goofy and comedical`,
      situation || initialSituation,
    ],
}