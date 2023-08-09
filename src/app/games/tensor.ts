import { macondo } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `in Martin Place, Sydney`,
  `side walk, few pedestrians`,
  `a person in leather coat and with sunglasses`,
  `business city district and buildings`,
].join(", ")

const initialActionnables = [
  "car",
  "face",
  "person",
  "building",
  "sidewalk",
  "sun",
  "object",
  "window",
  "floor",
  "door"
]

const inventory: InventoryItem[] = [
  {
    name: "blue-pill",
    title: "blue pill",
    caption: "",
    description: "My therapist said I had to eat one every day."
  },
  {
    name: "flash-light",
    title: "Flashlight",
    caption: "",
    description: "In case I need to go to the bathroom during the night."
  },
  {
    name: "laptop",
    title: "Laptop",
    caption: "",
    description: "My work laptop, with work stuff on it."
  },
  {
    name: "matchbox",
    title: "Matchbox",
    caption: "",
    description: "I used this to light fireworks."
  },
  {
    name: "watch",
    title: "Watch",
    caption: "",
    description: "Belonged to my grandpa, but I think it's a fake."
  },
]

export const game: Game = {
  title: "The Tensor",
  type: "tensor",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `first person photo`,
    `cold design, modern architecture, business district, impersonal`,
    situation || initialSituation,
  ]
}

