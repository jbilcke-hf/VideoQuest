import { macondo } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

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
  "object",
  "window",
  "light",
  "floor",
  "door"
]

const inventory: InventoryItem[] = [
  {
    name: "box",
    title: "Box",
    caption: "",
    description: "I wonder what this box contains?"
  },
  {
    name: "disk",
    title: "Disk",
    caption: "",
    description: "Now I need to find a computer.."
  },
  {
    name: "eyeball",
    title: "Eyeball",
    caption: "",
    description: "Looks like it belonged to a cyborg."
  },
  {
    name: "parasite",
    title: "Parasite",
    caption: "",
    description: "Don't eat this!"
  },
  /*
  {
    name: "robot-arm",
    title: "Robot arm",
    caption: "",
    description: ""
  },
  */
  {
    name: "robot-hand",
    title: "Robot hand",
    caption: "",
    description: ""
  },
]

export const game: Game = {
  title: "Nexus",
  type: "nexus",
  description: [
    "The game is a role playing adventure set in a futuristic city, with cyberpunk influence.",
    "The player is a detective whose role is to detect robots trying to pass as humans.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_image_turbo",
    "cartesian_video",
    "spherical_image",
  ],
  className: macondo.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `high-res photo from Blade Runner`,
    `cyberpunk, tokyo, futuristic clothes`,
    `at night, neon lights, rain and flying cars seen from afar`,
    situation || initialSituation,
  ]
}

