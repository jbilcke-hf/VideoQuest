import { macondo } from "@/lib/fonts"
import { Game } from "./types"

const initialSituation = [
  `first-person view of a futuristic street`,
  `looking at a flying chinese Junk ship powered by rockets`,
  `huge led screen advertising on the skyscrappers`,
  `heavy rain, soft haze, holograms`
].join(", ")

const initialActionnables = [
  "car",
  "face",
  "person",
  "building",
  "sidewalk",
  "spaceship",
  "object",
  "window",
  "floor",
  "door"
]

export const game: Game = {
  title: "Nexus",
  type: "nexus",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `high-res photo from Blade Runner`,
    `cyberpunk, tokyo, futuristic clothes`,
    `at night, neon lights, rain and flying cars seen from afar`,
    situation || initialSituation,
  ]
}

