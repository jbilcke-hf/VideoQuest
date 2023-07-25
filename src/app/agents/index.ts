import { Agent, AgentType } from "./types"

import { agent as ant } from "./ant"
import { agent as fish } from "./fish"
import { agent as fox } from "./fox"

export const agents = { ant, fish, fox }

export const defaultAgent: AgentType = "fox"

export const getAgent = (type?: AgentType) => agents[type || defaultAgent] || agents[defaultAgent]