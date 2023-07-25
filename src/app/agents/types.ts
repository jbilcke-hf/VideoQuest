export type AgentType = 'ant' | 'fish' | 'fox'

export interface Scene {
  action: string
  position: string
  prompt: string
}

export interface Agent {
  title: string
  type: AgentType
  simulate: () => Scene
}
