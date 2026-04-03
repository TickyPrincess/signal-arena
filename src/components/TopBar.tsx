'use client'

import { motion } from 'framer-motion'
import { useArenaStore } from '@/lib/store'
import { SIGNAL_COLORS } from '@/lib/constants'

export function TopBar() {
  const tick = useArenaStore(s => s.tick)
  const signals = useArenaStore(s => s.signals)
  const getTrendingSignals = useArenaStore(s => s.getTrendingSignals)
  const getLeaderboard = useArenaStore(s => s.getLeaderboard)

  const activeCount = signals.filter(s => s.state !== 'absorbed').length
  const dominantCount = signals.filter(s => s.state === 'dominant').length
  const trending = getTrendingSignals()
  const topPlayers = getLeaderboard()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-20 h-12 panel-glass border-b border-arena-border flex items-center px-4 gap-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-arena-idea pulse-dot" style={{ background: '#00D9FF' }} />
        <span className="font-mono text-xs font-semibold tracking-[0.25em] text-arena-text uppercase glitch-text" data-text="SIGNAL ARENA">
          SIGNAL ARENA
        </span>
      </div>

      <div className="w-px h-5 bg-arena-border" />

      {/* System status */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-arena-muted">
          <span className="text-arena-text/40">SIGNALS</span>
          <span className="text-arena-idea font-semibold">{activeCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-arena-muted">
          <span className="text-arena-text/40">DOMINANT</span>
          <span className="text-arena-trend font-semibold">{dominantCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-arena-muted">
          <span className="text-arena-text/40">TICK</span>
          <span className="text-arena-muted font-semibold">{tick}</span>
        </div>
      </div>

      <div className="w-px h-5 bg-arena-border" />

      {/* Trending signals */}
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-xs font-mono text-arena-muted shrink-0">TRENDING</span>
        <div className="flex items-center gap-2">
          {trending.map((sig, i) => (
            <div
              key={sig.id}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono"
              style={{
                background: `${SIGNAL_COLORS[sig.type]}15`,
                borderColor: `${SIGNAL_COLORS[sig.type]}30`,
                border: '1px solid',
                color: SIGNAL_COLORS[sig.type],
              }}
            >
              <span className="hidden sm:inline opacity-50">{i + 1}.</span>
              <span className="truncate max-w-[80px]">{sig.name}</span>
              <span className="opacity-60">{Math.round(sig.virality)}v</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* Top players */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-xs font-mono text-arena-muted">TOP</span>
        {topPlayers.slice(0, 3).map((p, i) => (
          <div key={p.id} className="flex items-center gap-1">
            <span className="text-xs font-mono opacity-30">{i + 1}</span>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: p.color }}
            />
            <span className="text-xs font-mono text-arena-text/70 max-w-[70px] truncate">{p.name}</span>
            <span className="text-xs font-mono text-arena-muted">{p.influence.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="w-px h-5 bg-arena-border" />

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9F] pulse-dot" style={{ background: '#00FF9F' }} />
        <span className="font-mono text-xs text-[#00FF9F]/70 tracking-wider">LIVE</span>
      </div>
    </motion.header>
  )
}
