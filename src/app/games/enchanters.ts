import { macondo } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `looking at a beautiful medieval castle on a lake, with a metallic gate, during golden house, surrounded by mountain, with a flying dragon visible afar`,
].join(", ")

const initialActionnables = [
  "trees",
  "dragon",
  "castle",
  "gate",
  "stone wall",
  "lake",
  "roof"
]

export const game: Game = {
  title: "Enchanters",
  type: "enchanters",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `unreal engine`,
    `magical wizard world`, 
    `first person`,
    situation || initialSituation,
  ]
}

