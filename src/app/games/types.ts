import { InventoryItem } from "@/types"
import { EngineType } from "@/app/engine/engines"

export type GameType =
  | "pirates"
  | "city"
  | "dungeon"
  | "doom"
  | "vernian"
  | "enchanters"
  | "pharaoh"
  | "flamenco"
  | "tensor"
  | "nexus"
  | "arizona"

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
  inventory: InventoryItem[]
  getScenePrompt: (situation?: string) => string[]
}
