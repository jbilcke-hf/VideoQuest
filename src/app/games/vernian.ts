import { imfell } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `inside a secret workshop inspired by Jules Verne`,
  `with mysterious machines, keys, boxes, blueprints, gears`
].join(", ")

const initialActionnables = [
  "key",
  "box",
  "door",
  "table",
  "chair",
  "sun",
  "gear",
  "machine",
  "window",
  "ground"
]

const inventory: InventoryItem[] = [
  {
    name: "apparatus",
    title: "Apparatus",
    caption: "",
    description: "What is this strange device?"
  },
  {
    name: "book",
    title: "Book",
    caption: "",
    description: "It is talking about a mysterious island, I think.."
  },
  {
    name: "cog",
    title: "Cog",
    caption: "",
    description: "From some kind of mysterious machine."
  },
  {
    name: "coil",
    title: "Coil",
    caption: "",
    description: "Nice, but where does it fit?"
  },
  {
    name: "copper-wire",
    title: "Copper wire",
    caption: "",
    description: "Mmh, copper. I wonder how I could use that."
  },
  {
    name: "pocket-watch",
    title: "Pocket watch",
    caption: "",
    description: "My my.. time passes quickly."
  },
  {
    name: "top-hat",
    title: "Top Hat",
    caption: "",
    description: "For a gentleman or magician. The craft is exquisite."
  },
]

export const game: Game = {
  title: "Vernian",
  type: "vernian",
  engine: "spherical_image",
  className: imfell.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `Screenshot from a videogame`,
    `steam punk decor`,
    `jules verne architecture and design`,
    `mysterious machines and mechanisms`,
    `first person`,
    situation || initialSituation,
    `unreal engine`,
  ]
}

