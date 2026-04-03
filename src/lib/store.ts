import { create } from 'zustand'
import type { Signal, Player, ActivityEvent, SignalType } from '@/types'
import {
  SIGNAL_COLORS, ARENA_BOUNDS, ARENA_Z_BOUNDS, TICK_RATE,
  CLASH_RADIUS, ABSORPTION_THRESHOLD, MAX_EVENTS,
  MIN_SIGNALS, SIGNAL_NAMES, PLAYER_NAMES, PLAYER_COLORS,
  MAX_CONNECTIONS_PER_SIGNAL,
} from './constants'

const genId = () => Math.random().toString(36).slice(2, 10)

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createSignal(
  name: string,
  type: SignalType,
  ownerId: string,
  strength = Math.round(randomBetween(40, 80)),
): Signal {
  return {
    id: genId(),
    name,
    type,
    state: 'active',
    position: [
      randomBetween(-ARENA_BOUNDS * 0.85, ARENA_BOUNDS * 0.85),
      randomBetween(-ARENA_BOUNDS * 0.7, ARENA_BOUNDS * 0.7),
      randomBetween(-ARENA_Z_BOUNDS, ARENA_Z_BOUNDS),
    ],
    velocity: [
      randomBetween(-0.035, 0.035),
      randomBetween(-0.035, 0.035),
      randomBetween(-0.008, 0.008),
    ],
    strength,
    virality: randomBetween(20, 65),
    age: 0,
    ownerId,
    connections: [],
    mutations: 0,
    color: SIGNAL_COLORS[type],
    scale: 0.28 + strength / 180,
  }
}

function createPlayers(): Player[] {
  return PLAYER_NAMES.slice(0, 7).map((name, i) => ({
    id: genId(),
    name,
    influence: Math.round(randomBetween(100, 800)),
    dominance: Math.round(randomBetween(10, 60)),
    activeSignals: [],
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    isCurrentPlayer: i === 0,
  }))
}

function seedSignals(players: Player[]): Signal[] {
  const types: SignalType[] = ['meme', 'idea', 'trend']
  const signals: Signal[] = []
  const usedNames: Set<string> = new Set()

  for (let i = 0; i < 15; i++) {
    const type = types[i % 3]
    const owner = players[i % players.length]
    let name = pickRandom(SIGNAL_NAMES[type])
    while (usedNames.has(name)) name = pickRandom(SIGNAL_NAMES[type])
    usedNames.add(name)
    signals.push(createSignal(name, type, owner.id))
  }
  return signals
}

interface ArenaStore {
  signals: Signal[]
  players: Player[]
  events: ActivityEvent[]
  currentPlayerId: string
  selectedSignalId: string | null
  isDeployOpen: boolean
  tick: number
  _intervalId: ReturnType<typeof setInterval> | null

  // Actions
  init: () => void
  startSimulation: () => void
  stopSimulation: () => void
  tickSimulation: () => void
  deploySignal: (name: string, type: SignalType) => void
  selectSignal: (id: string | null) => void
  setDeployOpen: (open: boolean) => void
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void
  getSelectedSignal: () => Signal | undefined
  getCurrentPlayer: () => Player | undefined
  getLeaderboard: () => Player[]
  getTrendingSignals: () => Signal[]
}

export const useArenaStore = create<ArenaStore>((set, get) => ({
  signals: [],
  players: [],
  events: [],
  currentPlayerId: '',
  selectedSignalId: null,
  isDeployOpen: false,
  tick: 0,
  _intervalId: null,

  init: () => {
    const players = createPlayers()
    const currentPlayer = players[0]
    const signals = seedSignals(players)

    // Give some signals to current player
    signals.slice(0, 3).forEach(s => { s.ownerId = currentPlayer.id })

    set({
      players,
      signals,
      currentPlayerId: currentPlayer.id,
      events: [
        {
          id: genId(),
          timestamp: Date.now(),
          message: 'Arena initialized. Signals deploying.',
          type: 'deploy',
        },
        {
          id: genId(),
          timestamp: Date.now() - 1000,
          message: 'Welcome to Signal Arena.',
          type: 'evolution',
        },
      ],
    })
  },

  startSimulation: () => {
    const existing = get()._intervalId
    if (existing) clearInterval(existing)
    const id = setInterval(() => get().tickSimulation(), TICK_RATE)
    set({ _intervalId: id })
  },

  stopSimulation: () => {
    const id = get()._intervalId
    if (id) clearInterval(id)
    set({ _intervalId: null })
  },

  tickSimulation: () => {
    const { signals, players, events, tick, currentPlayerId } = get()
    const newTick = tick + 1
    const newEvents: ActivityEvent[] = []

    // Deep copy signals for mutation
    const updated: Signal[] = signals.map(s => ({ ...s, connections: [...s.connections] }))

    // Move signals
    for (const s of updated) {
      if (s.state === 'absorbed') continue

      let [x, y, z] = s.position
      let [vx, vy, vz] = s.velocity

      x += vx; y += vy; z += vz

      // Bounce walls
      if (Math.abs(x) > ARENA_BOUNDS) { vx *= -0.92; x = Math.sign(x) * ARENA_BOUNDS }
      if (Math.abs(y) > ARENA_BOUNDS * 0.78) { vy *= -0.92; y = Math.sign(y) * ARENA_BOUNDS * 0.78 }
      if (Math.abs(z) > ARENA_Z_BOUNDS) { vz *= -0.92; z = Math.sign(z) * ARENA_Z_BOUNDS }

      s.position = [x, y, z]
      s.velocity = [vx, vy, vz]
      s.age++

      // Slow decay
      if (s.age > 60 && Math.random() < 0.06) s.strength = Math.max(1, s.strength - 1)

      // Evolution every 10 ticks
      if (s.age % 10 === 0 && s.state !== 'dying') {
        s.virality = Math.min(100, s.virality + randomBetween(0.5, 2.5))
      }

      // Mutation
      if (s.age % 25 === 0 && Math.random() < 0.25) {
        s.mutations++
        if (Math.random() < 0.4) {
          newEvents.push({ id: genId(), timestamp: Date.now(), message: `${s.name} mutated`, type: 'mutation', signalIds: [s.id] })
        }
      }

      // Update state
      if (s.strength < 8) s.state = 'dying'
      else if (s.virality > 82 && s.strength > 65) s.state = 'dominant'
      else if (s.state !== 'dying') s.state = 'active'

      s.scale = 0.25 + s.strength / 160
    }

    // Clash detection
    const active = updated.filter(s => s.state !== 'absorbed')
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i]
        const b = active[j]

        const dx = a.position[0] - b.position[0]
        const dy = a.position[1] - b.position[1]
        const dz = a.position[2] - b.position[2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < CLASH_RADIUS) {
          const diff = a.strength - b.strength

          if (Math.abs(diff) > ABSORPTION_THRESHOLD) {
            const winner = diff > 0 ? a : b
            const loser = diff > 0 ? b : a
            loser.state = 'absorbed'
            winner.strength = Math.min(100, winner.strength + 12)
            winner.virality = Math.min(100, winner.virality + 5)
            newEvents.push({
              id: genId(), timestamp: Date.now(),
              message: `${winner.name} absorbed ${loser.name}`,
              type: 'absorb', signalIds: [winner.id, loser.id],
            })
          } else {
            // Bounce
            a.strength = Math.max(1, a.strength - 2)
            b.strength = Math.max(1, b.strength - 2)

            // Slight velocity repulsion
            a.velocity = [a.velocity[0] + dx * 0.01, a.velocity[1] + dy * 0.01, a.velocity[2]]
            b.velocity = [b.velocity[0] - dx * 0.01, b.velocity[1] - dy * 0.01, b.velocity[2]]

            // Connect them
            if (!a.connections.includes(b.id) && a.connections.length < MAX_CONNECTIONS_PER_SIGNAL) {
              a.connections.push(b.id)
            }
            if (!b.connections.includes(a.id) && b.connections.length < MAX_CONNECTIONS_PER_SIGNAL) {
              b.connections.push(a.id)
            }

            if (Math.random() < 0.28) {
              newEvents.push({
                id: genId(), timestamp: Date.now(),
                message: `${a.name} clashed with ${b.name}`,
                type: 'clash', signalIds: [a.id, b.id],
              })
            }
          }
        }
      }
    }

    // Dominant event
    const dominant = updated.find(s => s.state === 'dominant')
    if (dominant && newTick % 20 === 0) {
      newEvents.push({
        id: genId(), timestamp: Date.now(),
        message: `${dominant.name} is dominating the arena`,
        type: 'dominant', signalIds: [dominant.id],
      })
    }

    // Respawn if too few signals
    const aliveCount = updated.filter(s => s.state !== 'absorbed').length
    if (aliveCount < MIN_SIGNALS) {
      const types: SignalType[] = ['meme', 'idea', 'trend']
      const type = pickRandom(types)
      const name = pickRandom(SIGNAL_NAMES[type])
      const owners = players.filter(p => !p.isCurrentPlayer)
      const owner = pickRandom(owners)
      const newSig = createSignal(name, type, owner.id)
      updated.push(newSig)
      newEvents.push({
        id: genId(), timestamp: Date.now(),
        message: `New ${type} deployed: ${name}`,
        type: 'deploy', signalIds: [newSig.id],
      })
    }

    // Update players
    const updatedPlayers = players.map(p => {
      const mine = updated.filter(s => s.ownerId === p.id && s.state !== 'absorbed')
      const totalInf = mine.reduce((sum, s) => sum + (s.virality * s.strength) / 100, 0)
      return {
        ...p,
        influence: Math.round(p.influence + totalInf * 0.01),
        dominance: Math.min(100, Math.round(totalInf / 4)),
        activeSignals: mine.map(s => s.id),
      }
    })

    const allEvents = [...newEvents, ...events].slice(0, MAX_EVENTS)

    set({ signals: updated, players: updatedPlayers, events: allEvents, tick: newTick })
  },

  deploySignal: (name: string, type: SignalType) => {
    const { players, signals, currentPlayerId } = get()
    const player = players.find(p => p.id === currentPlayerId)
    if (!player) return

    const sig = createSignal(name, type, currentPlayerId, 50)
    // Spawn near center
    sig.position = [randomBetween(-2, 2), randomBetween(-2, 2), randomBetween(-1, 1)]

    const newEvent: ActivityEvent = {
      id: genId(), timestamp: Date.now(),
      message: `You deployed: ${name} [${type.toUpperCase()}]`,
      type: 'deploy', signalIds: [sig.id],
    }

    set({
      signals: [...signals, sig],
      events: [newEvent, ...get().events].slice(0, MAX_EVENTS),
      isDeployOpen: false,
    })
  },

  selectSignal: (id) => set({ selectedSignalId: id }),
  setDeployOpen: (open) => set({ isDeployOpen: open }),

  addEvent: (event) => {
    const full: ActivityEvent = { ...event, id: genId(), timestamp: Date.now() }
    set({ events: [full, ...get().events].slice(0, MAX_EVENTS) })
  },

  getSelectedSignal: () => {
    const { signals, selectedSignalId } = get()
    return signals.find(s => s.id === selectedSignalId)
  },

  getCurrentPlayer: () => {
    const { players, currentPlayerId } = get()
    return players.find(p => p.id === currentPlayerId)
  },

  getLeaderboard: () => {
    return [...get().players].sort((a, b) => b.influence - a.influence).slice(0, 5)
  },

  getTrendingSignals: () => {
    return [...get().signals]
      .filter(s => s.state !== 'absorbed')
      .sort((a, b) => b.virality - a.virality)
      .slice(0, 3)
  },
}))
