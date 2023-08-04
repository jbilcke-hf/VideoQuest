import { amatic } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../types"

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
  "door",
  "box",
  "stone wall",
  "torch",
  "window",
  "chest",
  "key",
  "machine",
  "table",
  "fireplace"
]

const inventory: InventoryItem[] = [
  {
    name: "axe",
    title: "Axe",
    caption: "",
    description: "A good dwarf is nothing without his axe!"
  },
  {
    name: "box",
    title: "Box",
    caption: "",
    description: "Hmm, a mysterious box.."
  },
  {
    name: "candlestick",
    title: "Candlestick",
    caption: "",
    description: "This candlestick looks strange.."
  },
  {
    name: "rabbit-foot",
    title: "Rabbit foot",
    caption: "",
    description: "I hope it will bring me luck!"
  },
  {
    name: "skull",
    title: "Skull",
    caption: "",
    description: "The skull of some poor fellow."
  },
]

export const game: Game = {
  title: "Dungeon",
  type: "dungeon",
  engine: "cartesian_image",
  className: amatic.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `screenshot from adventure videogame`,
    // `first-person footage`,
    `medieval dungeon`,
    `adventure`,
    `unreal engine`,
    situation || initialSituation,
  ]
}