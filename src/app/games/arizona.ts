import { imfell } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `looking at an abandonned mining town street`,
  `street level view`,
  `looking at wooden buildings, sheriff sign, horses`,
  `cactus`
].join(", ")

const initialActionnables = [
  "horse",
  "sign",
  "bucket",
  "ground",
  "rope",
  "door",
  "sun",
  "window",
  "cactus",
  "sky"
]

const inventory: InventoryItem[] = [
  {
    name: "pickaxe",
    title: "Pickaxe",
    caption: "",
    description: "A mining pickaxe. For like, mining ore or something."
  },
  {
    name: "matchbox",
    title: "Matchbox",
    caption: "",
    description: "A box of matches, to put some fire in your life."
  }
]

export const game: Game = {
  title: "Arizona",
  type: "arizona",
  description: [
    "The game is a role playing adventure, set in an old mining town in Arizona.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_image_turbo",
    "cartesian_video",
    "spherical_image",
  ],
  className: imfell.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `unreal engine`,
    `old mining town`,
    `in arizona`, 
    `wild west america`,
    `during gold rush era`,
    situation || initialSituation,
  ]
}

