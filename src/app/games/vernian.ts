import { imfell } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `inside a secret workshop inspired by Jules Verne`,
  `with mysterious machines, keys, boxes, blueprints, gears`
].join(", ")

const initialActionnables = [
  "key",
  "box",
  "door",
  "table",
  "chair",
  "sun",
  "gear",
  "machine",
  "window",
  "ground"
]

export const game: Game = {
  title: "Vernian",
  type: "vernian",
  engine: "spherical_image",
  className: imfell.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `steam punk decor`,
    `jules verne architecture and design`,
    `mysterious machines and mechanisms`,
    `first person`,
    situation || initialSituation,
    `unreal engine`,
  ]
}

