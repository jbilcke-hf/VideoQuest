import { edu } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `a generic guy enjoying his simple life, waving hello at his neighbors on his way to work`,
].join(", ")

const initialActionnables = [
  "door",
  "person",
  "food",
  "car",
  "window",
  "floor",
  "sun",
  "computer",
  "plant",
  "sky"
]

const inventory: InventoryItem[] = [
]

export const game: Game = {
  title: "The Trulad Show",
  type: "trulad",
  description: [
    "The Trulad Show is a reality TV show about a generic guy called Trulad (usually dressed in a yellow shirt) who lives his normal, daily life.",
    "Trulad doesn't know he is filmed as the cameras are hidden.",
    "The player is Director, and can influence the life of Trulad.",
    "The player can click around to move to new scenes, camera orientation, trigger events int he life of Trulad.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_video"
  ],
  className: edu.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `documentary`,
    `generic guy`,
    `yellow shirt`,
    situation || initialSituation,
  ]
}

