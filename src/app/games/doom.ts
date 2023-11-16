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
  description: [
    "The game is a futuristic first-person shooter similar to \"Doom\".",
    "Following a mining accident, the player has been called to Mars to explore the US Martian base, but they encounter aliens.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_image_turbo",
    "cartesian_video",
    "spherical_image",
  ],
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

