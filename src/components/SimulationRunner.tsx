'use client'

import { useEffect } from 'react'
import { useArenaStore } from '@/lib/store'

export function SimulationRunner() {
  const { init, startSimulation, stopSimulation } = useArenaStore()

  useEffect(() => {
    init()
    const t = setTimeout(() => startSimulation(), 600)
    return () => {
      clearTimeout(t)
      stopSimulation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
