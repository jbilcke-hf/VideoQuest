import { GameType } from "./types"

import { game as pirates } from "./pirates"
import { game as city } from "./city"
import { game as dungeon } from "./dungeon"

export const games = { pirates, city, dungeon }

export const defaultGame: GameType = "pirates"

export const getGame = (type?: GameType) => games[type || defaultGame] || games[defaultGame]