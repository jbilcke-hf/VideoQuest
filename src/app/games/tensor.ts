import { edu } from "@/lib/fonts"
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
  description: [
    "The game is a role playing adventure set in the world that may be a simulation.",
    "The player is Nua. They are a developer in a software development company in a bland city. By night they are a hacker. They have been contacted by a mysterious online entity called Mad Hatter, who believes the world is a simulation.",
    "The player can click around to move to new scenes, find or activate artifacts.",
    "They can also use objects from their inventory.",
  ],
  engines: [
    "cartesian_image",
    "cartesian_image_turbo",
    "cartesian_video",
    "spherical_image",
  ],
  className: edu.className,
  initialSituation,
  initialActionnables,
  inventory,
  getScenePrompt: (situation?: string) => [
    `first person photo`,
    `cold design, modern architecture, business district, impersonal`,
    situation || initialSituation,
  ]
}

