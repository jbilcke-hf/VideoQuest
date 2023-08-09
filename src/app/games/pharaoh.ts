import { macondo } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `looking at a beautiful pyramid, ancient egypt, during golden hour, surrounded by sand dunes, near the Nile`,
].join(", ")

const initialActionnables = [
  "pyramid",
  "person",
  "rocks",
  "dune",
  "sceptre",
  "tree",
  "river",
  "boat",
  "sun"
]

const inventory: InventoryItem[] = [
  {
    name: "bowl",
    title: "Bowl",
    caption: "",
    description: "A bowl. To eat things."
  },
  {
    name: "box",
    title: "Box",
    caption: "",
    description: "Full of mysteries."
  },
  {
    name: "golden-beetle",
    title: "Beetle pendant",
    caption: "",
    description: "This pendant has a mysterious aura.."
  },
  {
    name: "staff",
    title: "Staff",
    caption: "",
    description: "This used to belong to a magician."
  },
]

export const game: Game = {
  title: "Pharaoh",
  type: "pharaoh",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `unreal engine`,
    `ancient egypt`, 
    `first person`,
    situation || initialSituation,
  ]
}

