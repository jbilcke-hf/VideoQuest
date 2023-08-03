import { macondo } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `in Martin Place, Sydney`,
  `side walk, few pedestrians`,
  `a person in leather coat and with sunglasses`,
  `business city district and buildings`,
].join(", ")

const initialActionnables = [
  "car",
  "face",
  "person",
  "building",
  "sidewalk",
  "trash bin",
  "object",
  "window",
  "floor",
  "door"
]

export const game: Game = {
  title: "The Tensor",
  type: "tensor",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `first person photo`,
    `cold design, modern architecture, business district, impersonal`,
    situation || initialSituation,
  ]
}

