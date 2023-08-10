import { edu } from "@/lib/fonts"
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
  description: [
    "The game is a role playing adventure set in 1920 mexico, inspired by the Grim Fandango game, with mexican, art deco and aztec influences.",
    "The player is Lenny, a travel agent from the world of the dead, who try to find customers to escort safely to heaven.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_video",
    "spherical_image",
  ],
  className: edu.className,
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

