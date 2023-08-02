import { EngineType } from "../engines"

export type GameType = "pirates" | "city" | "dungeon" | "doom" | "vernian" | "enchanters" | "pharaoh" | "flamenco"

export interface Scene {
  actionnables: string[]
  prompt: string
}

export interface Game {
  title: string
  type: GameType
  engine: EngineType
  className: string
  initialSituation: string
  initialActionnables: string[]
  getScenePrompt: (situation?: string) => string[]
}
