import { macondo } from "@/lib/fonts"
import { Game } from "./types"
import { InventoryItem } from "../../types"

const initialSituation = [
  `beautiful view of an art deco building in new york`,
  `looking up`,
  `entrance desk`,
  `pigeon character`,
  `day of the dead makeup`,
  `artdeco bridge`,
].join(", ")

const initialActionnables = [
  "sun",
  "face",
  "person",
  "building",
  "light",
  "decoration",
  "box",
  "desk",
  "gate",
  "door"
]

const inventory: InventoryItem[] = [
  {
    name: "burger",
    title: "Burger",
    caption: "",
    description: "I forgot to eat it."
  },
  {
    name: "chicken",
    title: "Chicken",
    caption: "",
    description: "Well it does eggs, so yes it is useful!"
  },
  {
    name: "fishbone",
    title: "Fishbone",
    caption: "",
    description: "Maybe I could pick some locks with it?"
  },
  {
    name: "tentacle",
    title: "Tentacle",
    caption: "",
    description: "I found this strange tentacle.. this is evidence!"
  },
]

export const game: Game = {
  title: "Sad Flamenco",
  type: "flamenco",
  engine: "spherical_image",
  className: macondo.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `photo of an artdeco scene`,
    `grimfandango screenshot`,
    `unreal engine`,
    `1920 mexico`,
    situation || initialSituation,
  ]
}

