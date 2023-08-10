import { edu } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const actions = [
  "busy pedestrians",
  "busy traffic",
  "typical street life",
  "skyscrapper being constructed",
  "a building is on fire",
]

const positions = [
  "city center with skyscrappers",
  "city center with a hospital",
  "market area",
  "residential area with small houses",
  "residential area and houses with pools",
  "industrial area with a smoking factory",
  "beachfront area with villas",
  "theme park with one big rollercoaster"
]

const lights = [
  "during the day",
  // "during the night",
]

const initialSituation = [
  `over the city town center`,
  `at noon`,
].join(", ")

const initialActionnables = [
  "building",
  "road",
  "car",
  "tower",
  "tree",
  "river",
  "sea",
  "house",
  "window",
  "roof"
]

const inventory: InventoryItem[] = [
  // {
  //   name: "pickaxe",
  //   title: "Pickaxe",
  //   caption: "",
  //   description: ""
  // },
]

export const game: Game = {
  title: "City",
  type: "city",
  description: [
    "The game is a city simulator and management game.",
    "The player is the mayor and they can see the city from above, and manage it",
    "The player can click around to activate things related to buildings and city management.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_video",
    // "spherical_image",
  ],
  className:  edu.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `isometrical bird view of 3D rendered city`,
    `game screenshot`,
    `strategy game`,
    `simulator`,
    `isometric`,
    `unreal engine`,
    `high res`,
    situation || initialSituation,
  ]
}