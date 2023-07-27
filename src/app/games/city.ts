import { Game } from "./types"

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
  "house"
]

export const game: Game = {
  title: "City",
  type: "city",
  initialSituation,
  initialActionnables,
  getScenePrompt: (situation?: string) => [
    `isometrical bird view of 3D rendered city`,
    situation || initialSituation,
    `game screenshot`,
    `isometric`,
    `unreal engine`,
    `high res`,
  ]
}