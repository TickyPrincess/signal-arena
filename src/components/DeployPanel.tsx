'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useArenaStore } from '@/lib/store'
import { SIGNAL_COLORS, SIGNAL_NAMES } from '@/lib/constants'
import type { SignalType } from '@/types'

const TYPE_DESCRIPTIONS = {
  meme: 'Spreads fast, high virality. Mutates unpredictably.',
  idea: 'Builds connections. Gains strength over time.',
  trend: 'Volatile. Peaks quickly. Burns out or dominates.',
}

export function DeployPanel() {
  const isOpen = useArenaStore(s => s.isDeployOpen)
  const setDeployOpen = useArenaStore(s => s.setDeployOpen)
  const deploySignal = useArenaStore(s => s.deploySignal)

  const [name, setName] = useState('')
  const [type, setType] = useState<SignalType>('meme')

  const handleDeploy = () => {
    if (!name.trim()) return
    deploySignal(name.trim(), type)
    setName('')
  }

  const fillRandom = () => {
    setName(SIGNAL_NAMES[type][Math.floor(Math.random() * SIGNAL_NAMES[type].length)])
  }

  const typeColor = SIGNAL_COLORS[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeployOpen(false)}
            className="fixed inset-0 z-30 bg-black/40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[440px] panel-glass rounded-2xl p-6 border border-arena-border"
            style={{ boxShadow: `0 0 40px ${typeColor}20, 0 20px 60px rgba(0,0,0,0.6)` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-semibold text-arena-text text-sm tracking-wide">DEPLOY SIGNAL</div>
                <div className="text-xs font-mono text-arena-muted mt-0.5">Release an idea into the arena</div>
              </div>
              <button
                onClick={() => setDeployOpen(false)}
                className="w-7 h-7 rounded-lg border border-arena-border flex items-center justify-center text-arena-muted hover:text-arena-text hover:border-arena-dim transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Type selector */}
            <div className="mb-4">
              <div className="text-[10px] font-mono text-arena-muted mb-2 tracking-widest">SIGNAL TYPE</div>
              <div className="grid grid-cols-3 gap-2">
                {(['meme', 'idea', 'trend'] as SignalType[]).map(t => {
                  const color = SIGNAL_COLORS[t]
                  const selected = type === t
                  return (
                    <motion.button
                      key={t}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setType(t); setName('') }}
                      className="py-2.5 rounded-xl text-xs font-mono font-semibold uppercase transition-all duration-200"
                      style={{
                        background: selected ? `${color}20` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selected ? color + '50' : 'rgba(255,255,255,0.06)'}`,
                        color: selected ? color : 'rgba(255,255,255,0.4)',
                        boxShadow: selected ? `0 0 16px ${color}20` : 'none',
                      }}
                    >
                      {t.toUpperCase()}
                    </motion.button>
                  )
                })}
              </div>
              <p className="text-[10px] font-mono text-arena-muted/70 mt-2 leading-relaxed">
                {TYPE_DESCRIPTIONS[type]}
              </p>
            </div>

            {/* Name input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono text-arena-muted tracking-widest">SIGNAL NAME</div>
                <button
                  onClick={fillRandom}
                  className="text-[10px] font-mono text-arena-muted hover:text-arena-idea transition-colors"
                >
                  RANDOM ↺
                </button>
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDeploy()}
                placeholder="Name your signal..."
                maxLength={32}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-mono"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${name ? typeColor + '30' : 'rgba(255,255,255,0.07)'}`,
                  color: '#E8E8F0',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            {/* Virality preview */}
            <div className="mb-5 p-3 rounded-xl border border-arena-border bg-white/[0.01]">
              <div className="flex items-center justify-between text-[10px] font-mono text-arena-muted mb-1.5">
                <span>INITIAL STRENGTH</span>
                <span style={{ color: typeColor }}>~50</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mt-2">
                <div>
                  <div className="text-xs font-bold text-arena-text">50</div>
                  <div className="text-[9px] font-mono text-arena-muted">STRENGTH</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-arena-text">~35</div>
                  <div className="text-[9px] font-mono text-arena-muted">VIRALITY</div>
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: typeColor }}>{type.toUpperCase()}</div>
                  <div className="text-[9px] font-mono text-arena-muted">CLASS</div>
                </div>
              </div>
            </div>

            {/* Deploy button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDeploy}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl text-sm font-mono font-semibold tracking-widest uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: name ? `linear-gradient(135deg, ${typeColor}25, ${typeColor}15)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${name ? typeColor + '40' : 'rgba(255,255,255,0.06)'}`,
                color: name ? typeColor : '#5a5a7a',
                boxShadow: name ? `0 0 24px ${typeColor}25` : 'none',
              }}
            >
              ▲ DEPLOY INTO ARENA
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
