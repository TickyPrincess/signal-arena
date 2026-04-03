'use client'

import { motion } from 'framer-motion'
import { useArenaStore } from '@/lib/store'
import { SIGNAL_COLORS, SIGNAL_TYPE_LABELS } from '@/lib/constants'
import type { Signal } from '@/types'

function StatBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-arena-muted">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, value)}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }}
        />
      </div>
    </div>
  )
}

function SignalCard({ signal, isSelected, onClick }: { signal: Signal; isSelected: boolean; onClick: () => void }) {
  const typeColor = SIGNAL_COLORS[signal.type]

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={onClick}
      className="w-full text-left p-2.5 rounded-lg border transition-all duration-200 cursor-pointer"
      style={{
        background: isSelected ? `${typeColor}10` : 'rgba(255,255,255,0.02)',
        borderColor: isSelected ? `${typeColor}40` : 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
            style={{
              background: typeColor,
              boxShadow: `0 0 6px ${typeColor}80`,
              animation: signal.state === 'dominant' ? 'pulse-dot 1s infinite' : 'none',
            }}
          />
          <span className="text-xs font-semibold text-arena-text truncate">{signal.name}</span>
        </div>
        <span
          className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
          style={{
            background: `${typeColor}15`,
            color: typeColor,
            border: `1px solid ${typeColor}30`,
          }}
        >
          {signal.type.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
        <div>
          <div className="text-arena-muted">STR</div>
          <div style={{ color: typeColor }}>{Math.round(signal.strength)}</div>
        </div>
        <div>
          <div className="text-arena-muted">VRL</div>
          <div style={{ color: typeColor }}>{Math.round(signal.virality)}</div>
        </div>
        <div>
          <div className="text-arena-muted">AGE</div>
          <div className="text-arena-muted/70">{signal.age}</div>
        </div>
      </div>

      {signal.state === 'dominant' && (
        <div
          className="mt-2 text-[9px] font-mono tracking-widest text-center py-0.5 rounded"
          style={{ background: `${typeColor}20`, color: typeColor }}
        >
          ◆ DOMINANT
        </div>
      )}
      {signal.state === 'dying' && (
        <div className="mt-2 text-[9px] font-mono tracking-widest text-center py-0.5 rounded bg-red-500/10 text-red-400/70">
          ▼ FADING
        </div>
      )}
    </motion.button>
  )
}

export function Sidebar() {
  const signals = useArenaStore(s => s.signals)
  const players = useArenaStore(s => s.players)
  const currentPlayerId = useArenaStore(s => s.currentPlayerId)
  const selectedSignalId = useArenaStore(s => s.selectedSignalId)
  const selectSignal = useArenaStore(s => s.selectSignal)
  const setDeployOpen = useArenaStore(s => s.setDeployOpen)
  const getCurrentPlayer = useArenaStore(s => s.getCurrentPlayer)

  const currentPlayer = getCurrentPlayer()
  const mySignals = signals.filter(s => s.ownerId === currentPlayerId && s.state !== 'absorbed')
  const totalActiveSignals = signals.filter(s => s.state !== 'absorbed').length

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="h-full w-64 panel-glass border-r border-arena-border flex flex-col py-3 overflow-hidden"
    >
      {/* Player header */}
      <div className="px-3 mb-3">
        <div className="p-3 rounded-xl border border-arena-border bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: currentPlayer?.color + '30', color: currentPlayer?.color }}
            >
              {currentPlayer?.name[0] ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-arena-text truncate">{currentPlayer?.name ?? 'LOADING'}</div>
              <div className="text-[10px] font-mono text-arena-muted">COMMANDER</div>
            </div>
          </div>

          <div className="space-y-2">
            <StatBar
              value={Math.min(100, (currentPlayer?.influence ?? 0) / 20)}
              color="#00D9FF"
              label="INFLUENCE"
            />
            <StatBar
              value={currentPlayer?.dominance ?? 0}
              color="#FFBE0B"
              label="DOMINANCE"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="py-1.5 rounded-lg bg-white/[0.02] border border-arena-border">
              <div className="text-lg font-bold text-arena-idea">{currentPlayer?.influence.toLocaleString() ?? 0}</div>
              <div className="text-[9px] font-mono text-arena-muted">INFLUENCE</div>
            </div>
            <div className="py-1.5 rounded-lg bg-white/[0.02] border border-arena-border">
              <div className="text-lg font-bold text-arena-trend">{mySignals.length}</div>
              <div className="text-[9px] font-mono text-arena-muted">SIGNALS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deploy button */}
      <div className="px-3 mb-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDeployOpen(true)}
          className="w-full py-2.5 rounded-xl text-xs font-mono font-semibold tracking-widest uppercase transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(0,217,255,0.15), rgba(123,47,190,0.15))',
            border: '1px solid rgba(0,217,255,0.25)',
            color: '#00D9FF',
            boxShadow: '0 0 20px rgba(0,217,255,0.1)',
          }}
        >
          + Deploy Signal
        </motion.button>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-arena-muted tracking-widest">MY SIGNALS</span>
          <span className="text-[10px] font-mono text-arena-idea/60">{mySignals.length}/{totalActiveSignals}</span>
        </div>
      </div>

      {/* Signal list */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
        {mySignals.length === 0 ? (
          <div className="text-center py-8 text-arena-muted text-xs font-mono opacity-50">
            No signals deployed
          </div>
        ) : (
          mySignals.map(signal => (
            <SignalCard
              key={signal.id}
              signal={signal}
              isSelected={selectedSignalId === signal.id}
              onClick={() => selectSignal(signal.id === selectedSignalId ? null : signal.id)}
            />
          ))
        )}
      </div>

      {/* Arena status */}
      <div className="px-3 pt-3 border-t border-arena-border mt-2">
        <div className="text-[10px] font-mono text-arena-muted mb-2 tracking-widest">ARENA STATUS</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {(['meme', 'idea', 'trend'] as const).map(type => {
            const count = signals.filter(s => s.type === type && s.state !== 'absorbed').length
            return (
              <div key={type} className="rounded-lg border border-arena-border py-1.5">
                <div
                  className="text-sm font-bold"
                  style={{ color: SIGNAL_COLORS[type] }}
                >
                  {count}
                </div>
                <div className="text-[9px] font-mono text-arena-muted">{type.toUpperCase()}</div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.aside>
  )
}
