import { FontName } from "@/lib/fonts"

export type GameType = 'pirates' | 'city' | 'dungeon' | 'doom'

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
