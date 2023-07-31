import { amatic } from "@/lib/fonts"
import { Game, Scene } from "./types"

const actions = [
  "not moving",
  "walking in",
  "looking up",
  "looking down",
  "looking left",
  "looking right",
  "looking around"
]

const positions = [
  "corridor with a beautiful wooden door at the end, wooden floor and stone walls",
  "a beautiful wooden door",
  "beautiful room with stone walls and wooden floor",
  "large ball room with stone pillars, stone floor and red carpet",
  "a cosy room with a fireplace, stone walls and wooden floor",
  "a fireplace with stone walls",
  "a cold dungeon with stone walls",
  "a damp medieval jail cell with stone walls and wooden floor"
]

const lights = [
  "lit through windows",
  "lit through wall-mounted torches"
  // "poorly lit"
]

const initialSituation = [
  `inside a beautiful room with stone walls and wooden floor`,
  `a fireplace on the wall and a metal chest in the center with a large lock`,
].join(", ")

const initialActionnables = [
 //  "floor",
  // "fireplace",
  "door",
 // "window",
  "chair",
  "chest",
  "key",
  "table",
  // torch"
]

export const game: Game = {
  title: "Dungeon",
  type: "dungeon",
  className: amatic.className,
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `screenshot from an adventure videogame`,
    // `first-person footage`,
    situation || initialSituation,
    `medieval`,
    `unreal engine`,
  ]
}