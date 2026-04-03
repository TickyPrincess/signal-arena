import type { SignalType } from '@/types'

export const SIGNAL_COLORS: Record<SignalType, string> = {
  meme: '#FF006E',
  idea: '#00D9FF',
  trend: '#FFBE0B',
}

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  meme: 'MEME',
  idea: 'IDEA',
  trend: 'TREND',
}

export const ARENA_BOUNDS = 7.5
export const ARENA_Z_BOUNDS = 2.5
export const TICK_RATE = 220
export const CLASH_RADIUS = 1.6
export const ABSORPTION_THRESHOLD = 28
export const MAX_EVENTS = 45
export const MIN_SIGNALS = 10
export const MAX_SIGNALS = 22
export const MAX_CONNECTIONS_PER_SIGNAL = 3

export const SIGNAL_NAMES: Record<SignalType, string[]> = {
  meme: [
    'NPC Awakening', 'Doomer Wave', 'Ratio Lord', 'Crab Rave', 'GigaBrain',
    'Based Energy', 'Touch Grass', 'Clout Seeker', 'Terminal Irony', 'Cope Arc',
    'Sigma Protocol', 'Unhinged Feed', 'Chaos Node', 'Void Stare', 'Echo Loop',
    'Cringe Singularity', 'Pilled Protocol', 'Galaxy Brain', 'Cursed Arc',
  ],
  idea: [
    'Post Scarcity', 'Mind Upload', 'Dark Forest', 'Techno Feudal', 'Liquid Democracy',
    'AGI Transition', 'Bio Punk Rise', 'Memory Debt', 'Trust Collapse', 'Attention War',
    'Signal Culture', 'Neural Stack', 'Infinite Scroll', 'Ghost Economy', 'Sim Divide',
    'Hive Consensus', 'Fracture Point', 'The Long Game', 'Edge Sovereignty',
  ],
  trend: [
    'Micro-Living', 'AI Companion', 'Urban Decay', 'Retro Revival', 'Climate Anxiety',
    'Loneliness Boom', 'Crypto Cycle', 'Creator Burnout', 'Digital Nomad', 'Status Games',
    'Vibe Shift', 'Aesthetic War', 'Parasocial Age', 'Platform Rot', 'New Weird',
    'Quiet Luxury', 'De-growth Arc', 'Attention Debt', 'Signal Fatigue',
  ],
}

export const PLAYER_NAMES = [
  'Nyx_Protocol', 'Void_Runner', 'Signal_Ghost', 'Echo_Mind',
  'DarkMeme_Lord', 'Trend_Breaker', 'Idea_Forge', 'Signal_Prime',
  'Memetic_Entity', 'Arc_Breaker',
]

export const PLAYER_COLORS = [
  '#00D9FF', '#FF006E', '#FFBE0B', '#7B2FBE',
  '#00FF9F', '#FF4D00', '#0055FF',
]
