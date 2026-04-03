'use client'

import { motion } from 'framer-motion'
import { Arena3D } from './Arena3D'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { ActivityFeed } from './ActivityFeed'
import { DeployPanel } from './DeployPanel'
import { SignalDetail } from './SignalDetail'
import { SimulationRunner } from './SimulationRunner'
import { useArenaStore } from '@/lib/store'

function HeroOverlay() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.2, duration: 1.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, #050508 60%, transparent)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center"
      >
        <div className="text-[10px] font-mono tracking-[0.5em] text-arena-idea/60 mb-3 uppercase">
          — ENTERING —
        </div>
        <h1
          className="text-5xl font-bold tracking-tight mb-3 glitch-text"
          data-text="SIGNAL ARENA"
          style={{
            background: 'linear-gradient(135deg, #E8E8F0, #00D9FF, #7B2FBE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SIGNAL ARENA
        </h1>
        <div className="text-base font-mono text-arena-muted tracking-[0.15em]">
          Play ideas. Win influence.
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 w-40 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00D9FF, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-4 text-[10px] font-mono text-arena-muted/40 tracking-widest"
      >
        ARENA INITIALIZING
      </motion.div>
    </motion.div>
  )
}

function DeployFAB() {
  const setDeployOpen = useArenaStore(s => s.setDeployOpen)
  const isDeployOpen = useArenaStore(s => s.isDeployOpen)

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,217,255,0.3)' }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setDeployOpen(!isDeployOpen)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-full font-mono text-xs font-semibold tracking-widest uppercase"
      style={{
        background: 'rgba(0, 217, 255, 0.08)',
        border: '1px solid rgba(0, 217, 255, 0.25)',
        color: '#00D9FF',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 20px rgba(0,217,255,0.1), 0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      ▲ DEPLOY SIGNAL
    </motion.button>
  )
}

export default function ArenaApp() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-arena-bg">
      {/* Simulation logic */}
      <SimulationRunner />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Arena3D />
      </div>

      {/* Grain + scanlines */}
      <div className="grain-overlay" />
      <div className="scanlines" />

      {/* Top bar */}
      <div className="relative z-20">
        <TopBar />
      </div>

      {/* Sidebar left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed top-12 left-0 bottom-0 z-10 w-64"
      >
        <Sidebar />
      </motion.div>

      {/* Activity feed right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed top-12 right-0 bottom-0 z-10 w-64"
      >
        <ActivityFeed />
      </motion.div>

      {/* Signal detail (bottom center) */}
      <div className="fixed bottom-16 left-64 right-64 z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <SignalDetail />
        </div>
      </div>

      {/* Deploy FAB */}
      <DeployFAB />

      {/* Deploy panel */}
      <DeployPanel />

      {/* Hero intro overlay */}
      <HeroOverlay />
    </div>
  )
}
