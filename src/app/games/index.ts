import { GameType } from "./types"

import { game as pirates } from "./pirates"
import { game as city } from "./city"
import { game as dungeon } from "./dungeon"
import { game as doom } from "./doom"
import { game as vernian } from "./vernian"
import { game as enchanters } from "./enchanters"
import { game as flamenco } from "./flamenco"
import { game as pharaoh } from "./pharaoh"

export const games = { pirates, city, dungeon, doom, vernian, enchanters, flamenco, pharaoh}

export const defaultGame: GameType = "enchanters"

export const getGame = (type?: GameType) => games[type || defaultGame] || games[defaultGame]