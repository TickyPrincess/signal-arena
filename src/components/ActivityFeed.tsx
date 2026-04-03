'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useArenaStore } from '@/lib/store'
import { SIGNAL_COLORS } from '@/lib/constants'
import type { ActivityEvent } from '@/types'

const EVENT_COLORS = {
  clash: '#FF006E',
  absorb: '#FFBE0B',
  dominant: '#00D9FF',
  deploy: '#7B2FBE',
  mutation: '#00FF9F',
  evolution: '#00D9FF',
  decay: '#5a5a7a',
}

const EVENT_ICONS = {
  clash: '⚡',
  absorb: '◎',
  dominant: '◆',
  deploy: '▲',
  mutation: '⟳',
  evolution: '↑',
  decay: '↓',
}

function EventItem({ event }: { event: ActivityEvent }) {
  const color = EVENT_COLORS[event.type]
  const icon = EVENT_ICONS[event.type]
  const age = Math.round((Date.now() - event.timestamp) / 1000)
  const ageStr = age < 60 ? `${age}s` : `${Math.round(age / 60)}m`

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`px-2.5 py-2 rounded-lg border-l-2 feed-item-${event.type}`}
      style={{
        background: `${color}08`,
        borderLeftColor: color,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs shrink-0" style={{ color, opacity: 0.8 }}>{icon}</span>
          <span className="text-xs text-arena-text/80 leading-tight">{event.message}</span>
        </div>
        <span className="text-[10px] font-mono text-arena-muted/50 shrink-0">{ageStr}</span>
      </div>
    </motion.div>
  )
}

export function ActivityFeed() {
  const events = useArenaStore(s => s.events)
  const signals = useArenaStore(s => s.signals)
  const getLeaderboard = useArenaStore(s => s.getLeaderboard)

  const leaderboard = getLeaderboard()
  const clashCount = events.filter(e => e.type === 'clash').length
  const absorbCount = events.filter(e => e.type === 'absorb').length

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="h-full w-64 panel-glass border-l border-arena-border flex flex-col py-3 overflow-hidden"
    >
      {/* Leaderboard */}
      <div className="px-3 mb-3">
        <div className="text-[10px] font-mono text-arena-muted tracking-widest mb-2">LEADERBOARD</div>
        <div className="space-y-1">
          {leaderboard.map((player, i) => (
            <div key={player.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.02]">
              <span className="text-[10px] font-mono text-arena-muted/50 w-3">{i + 1}</span>
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: player.color, boxShadow: `0 0 6px ${player.color}60` }}
              />
              <span className="text-xs font-mono text-arena-text/80 flex-1 truncate">{player.name}</span>
              <span
                className="text-xs font-mono font-semibold shrink-0"
                style={{ color: player.color }}
              >
                {player.influence.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="px-3 mb-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border border-arena-border bg-white/[0.02] text-center">
            <div className="text-base font-bold text-arena-meme">{clashCount}</div>
            <div className="text-[9px] font-mono text-arena-muted">CLASHES</div>
          </div>
          <div className="p-2 rounded-lg border border-arena-border bg-white/[0.02] text-center">
            <div className="text-base font-bold text-arena-trend">{absorbCount}</div>
            <div className="text-[9px] font-mono text-arena-muted">ABSORBED</div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-2 border-t border-arena-border pt-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9F] pulse-dot" style={{ background: '#00FF9F' }} />
          <span className="text-[10px] font-mono text-arena-muted tracking-widest">LIVE FEED</span>
        </div>
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {events.map(event => (
            <EventItem key={event.id} event={event} />
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="text-center py-8 text-arena-muted text-xs font-mono opacity-50">
            Awaiting arena events...
          </div>
        )}
      </div>
    </motion.aside>
  )
}
