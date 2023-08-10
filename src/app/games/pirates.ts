import { lugrasimo } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

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

const inventory: InventoryItem[] = [
  {
    name: "coconut",
    title: "Coconut",
    caption: "",
    description: "Might be useful for lunch or fighting."
  },
  {
    name: "compass",
    title: "Compass",
    caption: "",
    description: "Never get lost in the Seven Seas!"
  },
  {
    name: "crystal-skull",
    title: "Crystall skull",
    caption: "",
    description: "It says \"Made in Germany\"."
  },
  {
    name: "fishbone",
    title: "Fish bone",
    caption: "",
    description: "I use this to pick my teeth. And locks."
  },
  {
    name: "lizard",
    title: "Lizard",
    caption: "",
    description: "Found this lizard, I call it Lizzie."
  },
  {
    name: "parrot",
    title: "Parrot",
    caption: "",
    description: "Arr!"
  },
  {
    name: "pirate-hat",
    title: "Pirate hat",
    caption: "",
    description: "Can't find the owner.. Now it\'s mine!"
  },
  {
    name: "skunk",
    title: "Skunk",
    caption: "",
    description: "So this is where the smell was coming from!"
  },
]

const initialActionnables = [
  "door",
  "box",
  "sea",
  "chest",
  "key",
  "parrot",
  "lock",
  "barrel",
  "tree",
  "sun"
  // skull
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
  description: [
    "The game is a role playing adventure set in the world of pirates.",
    "The player is Guybroom Threepence, a pirate apprentice who try to find the Crystal Monkey treasure by himself.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_video",
    "spherical_image",
  ],
  className: lugrasimo.className,
  initialSituation,
  initialActionnables,
  inventory,
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