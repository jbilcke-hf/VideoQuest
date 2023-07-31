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
  "blueprint",
  "gear",
  "machine"
]

export const game: Game = {
  title: "Vernian",
  type: "vernian",
  className: imfell.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `steam punk`,
    `jules verne architecture and design`,
    `mysterious machines and mechanisms`,
    `first person`,
    `unreal engine`,
    situation || initialSituation,
  ]
}

