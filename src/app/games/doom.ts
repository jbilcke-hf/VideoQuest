import { orbitron } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

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

const inventory: InventoryItem[] = [
  {
    name: "box",
    title: "Box",
    caption: "",
    description: "A strange metal box."
  },
  {
    name: "first-aid",
    title: "First-aid kit",
    caption: "",
    description: "Might come in handy!"
  },
  {
    name: "laser-gun",
    title: "Laser gun",
    caption: "",
    description: "Bzing bzing!"
  },
]

export const game: Game = {
  title: "Doom",
  type: "doom",
  engine: "cartesian_image",
  className: orbitron.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `Screenshot from Doom`,
    `first person`,
    `shooter game`,
    `science fiction`,
    `unreal engine`,
    situation || initialSituation,
  ]
}

