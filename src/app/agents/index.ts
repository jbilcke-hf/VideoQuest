import { Agent, AgentType } from "./types"

import { agent as pirates } from "./pirates"
import { agent as city } from "./city"
import { agent as dungeon } from "./dungeon"

export const agents = { pirates, city, dungeon }

export const defaultAgent: AgentType = "pirates"

export const getAgent = (type?: AgentType) => agents[type || defaultAgent] || agents[defaultAgent]