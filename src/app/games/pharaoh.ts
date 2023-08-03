import { macondo } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `looking at a beautiful pyramid, ancient egypt, during golden hour, surrounded by sand dunes, near the Nile`,
].join(", ")

const initialActionnables = [
  "pyramid",
  "person",
  "rocks",
  "dune",
  "sceptre",
  "tree",
  "river",
  "boat",
  "sun"
]

export const game: Game = {
  title: "Pharaoh",
  type: "pharaoh",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `unreal engine`,
    `ancient egypt`, 
    `first person`,
    situation || initialSituation,
  ]
}

