import { orbitron } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `looking at building on Mars, with multiple moons in the sky`,
].join(", ")

const initialActionnables = [
  "sun",
  "dune",
  "building",
  "gun",
  "person",
  "door",
  "laser",
  "window",
  "box",
  "rocks"
]

export const game: Game = {
  title: "Doom",
  type: "doom",
  engine: "cartesian_image",
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

