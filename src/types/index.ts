export type SignalType = 'meme' | 'idea' | 'trend'
export type SignalState = 'active' | 'dominant' | 'dying' | 'absorbed'

export interface Signal {
  id: string
  name: string
  type: SignalType
  state: SignalState
  position: [number, number, number]
  velocity: [number, number, number]
  strength: number     // 1–100
  virality: number     // 0–100
  age: number          // simulation ticks alive
  ownerId: string
  connections: string[]
  mutations: number
  color: string
  scale: number
}

export interface Player {
  id: string
  name: string
  influence: number
  dominance: number
  activeSignals: string[]
  color: string
  isCurrentPlayer: boolean
}

export interface ActivityEvent {
  id: string
  timestamp: number
  message: string
  type: 'clash' | 'evolution' | 'deploy' | 'absorb' | 'dominant' | 'mutation' | 'decay'
  signalIds?: string[]
}

export interface DeployFormData {
  name: string
  type: SignalType
}
