export type GameType = 'pirates' | 'city' | 'dungeon' | 'doom'

export interface Scene {
  actionnables: string[]
  prompt: string
}

export interface Game {
  title: string
  type: GameType
  initialSituation: string
  initialActionnables: string[]
  getScenePrompt: (situation?: string) => string[]
}
