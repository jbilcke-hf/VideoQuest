import { orbitron } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `looking at building on Mars, with multiple moons in the sky`,
].join(", ")

const initialActionnables = [
  "gun",
  "person",
  "door",
  "laser",
  "window",
  "box"
]

export const game: Game = {
  title: "Doom",
  type: "doom",
  className: orbitron.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `Screenshot from Doom`,
    `first person`,
    `shooter game`,
    `science fiction`,
    `unreal engine`,
    situation || initialSituation,
  ]
}

