'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useArenaStore } from '@/lib/store'
import { SIGNAL_COLORS } from '@/lib/constants'

export function SignalDetail() {
  const selectedSignal = useArenaStore(s => s.getSelectedSignal())
  const selectSignal = useArenaStore(s => s.selectSignal)
  const signals = useArenaStore(s => s.signals)
  const players = useArenaStore(s => s.players)

  if (!selectedSignal) return null

  const typeColor = SIGNAL_COLORS[selectedSignal.type]
  const owner = players.find(p => p.id === selectedSignal.ownerId)
  const connectedSignals = selectedSignal.connections
    .map(id => signals.find(s => s.id === id))
    .filter(Boolean)

  return (
    <AnimatePresence>
      <motion.div
        key={selectedSignal.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[520px] panel-glass rounded-2xl p-5 border"
        style={{
          borderColor: `${typeColor}25`,
          boxShadow: `0 0 30px ${typeColor}15, 0 15px 40px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{
                background: `${typeColor}15`,
                border: `1px solid ${typeColor}30`,
                color: typeColor,
                boxShadow: `0 0 16px ${typeColor}25`,
              }}
            >
              {selectedSignal.type === 'meme' ? '◈' : selectedSignal.type === 'idea' ? '◇' : '◉'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-arena-text">{selectedSignal.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}25` }}
                >
                  {selectedSignal.type.toUpperCase()}
                </span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: selectedSignal.state === 'dominant' ? `${typeColor}20` : 'rgba(255,255,255,0.04)',
                    color: selectedSignal.state === 'dominant' ? typeColor : '#5a5a7a',
                    border: `1px solid ${selectedSignal.state === 'dominant' ? typeColor + '30' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {selectedSignal.state.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => selectSignal(null)}
            className="w-7 h-7 rounded-lg border border-arena-border flex items-center justify-center text-arena-muted hover:text-arena-text transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'STRENGTH', value: Math.round(selectedSignal.strength), color: typeColor },
            { label: 'VIRALITY', value: Math.round(selectedSignal.virality), color: '#00D9FF' },
            { label: 'AGE', value: selectedSignal.age, color: '#FFBE0B' },
            { label: 'MUTATIONS', value: selectedSignal.mutations, color: '#00FF9F' },
          ].map(stat => (
            <div
              key={stat.label}
              className="p-2.5 rounded-xl border border-arena-border bg-white/[0.02] text-center"
            >
              <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[9px] font-mono text-arena-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-arena-muted">STRENGTH</span>
              <span style={{ color: typeColor }}>{Math.round(selectedSignal.strength)}%</span>
            </div>
            <div className="progress-bar h-1.5">
              <div
                className="progress-bar-fill h-full rounded"
                style={{ width: `${selectedSignal.strength}%`, background: `linear-gradient(90deg, ${typeColor}50, ${typeColor})` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-arena-muted">VIRALITY</span>
              <span className="text-arena-idea">{Math.round(selectedSignal.virality)}%</span>
            </div>
            <div className="progress-bar h-1.5">
              <div
                className="progress-bar-fill h-full rounded"
                style={{ width: `${selectedSignal.virality}%`, background: 'linear-gradient(90deg, #00D9FF40, #00D9FF)' }}
              />
            </div>
          </div>
        </div>

        {/* Owner + connections */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-arena-muted">OWNER</span>
            {owner && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: owner.color }} />
                <span className="text-[10px] font-mono" style={{ color: owner.color }}>{owner.name}</span>
              </div>
            )}
          </div>

          {connectedSignals.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-arena-muted">LINKED</span>
              <div className="flex gap-1">
                {connectedSignals.slice(0, 3).map(conn => conn && (
                  <span
                    key={conn.id}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: `${SIGNAL_COLORS[conn.type]}12`,
                      color: SIGNAL_COLORS[conn.type],
                      border: `1px solid ${SIGNAL_COLORS[conn.type]}25`,
                    }}
                  >
                    {conn.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
