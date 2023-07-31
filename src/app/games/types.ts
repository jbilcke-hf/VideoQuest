
export type GameType = "pirates" | "city" | "dungeon" | "doom" | "vernian" | "enchanters"

export interface Scene {
  actionnables: string[]
  prompt: string
}

export interface Game {
  title: string
  type: GameType
  className: string
  initialSituation: string
  initialActionnables: string[]
  getScenePrompt: (situation?: string) => string[]
}
