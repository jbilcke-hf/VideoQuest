import { macondo } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `beautiful view of an art deco building in new york`,
  `looking up`,
  `entrance desk`,
  `pigeon character`,
  `day of the dead makeup`,
  `artdeco bridge`,
].join(", ")

const initialActionnables = [
  "sun",
  "face",
  "person",
  "building",
  "light",
  "decoration",
  "box",
  "desk",
  "gate",
  "door"
]

export const game: Game = {
  title: "Sad Flamenco",
  type: "flamenco",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `photo of an artdeco scene`,
    `grimfandango screenshot`,
    `unreal engine`,
    `1920 mexico`,
    situation || initialSituation,
  ]
}

