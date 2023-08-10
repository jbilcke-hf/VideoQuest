import { macondo } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `looking at a beautiful medieval castle on a lake, with a metallic gate, during golden hour, surrounded by mountain, with a flying dragon visible afar`,
].join(", ")

const initialActionnables = [
  "trees",
  "dragon",
  "castle",
  "gate",
  "rocks",
  "lake",
  "sun",
  "boat",
  "mountain",
  "sky"
]

const inventory: InventoryItem[] = [
  {
    name: "garden-gnome",
    title: "Garden gnome",
    caption: "",
    description: "Found in a mystical garden."
  },
  {
    name: "key",
    title: "Key",
    caption: "",
    description: "Ha-ah! I wonder what it opens?"
  },
  {
    name: "old-book",
    title: "Old book",
    caption: "",
    description: "Written in an ancient elfic language"
  },
  {
    name: "pixie-dust",
    title: "Pixie dust",
    caption: "",
    description: "Well, it is magical for sure."
  },
]

export const game: Game = {
  title: "Enchanters",
  type: "enchanters",
  description: [
    "The game is a role playing adventure set during middle ages.",
    "The player is an elfic wizard, and they explore a mysterious castle.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_video",
    "spherical_image",
  ],
  className: macondo.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `unreal engine`,
    `magical wizard world`, 
    `first person`,
    situation || initialSituation,
  ]
}

