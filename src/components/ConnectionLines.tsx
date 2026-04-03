'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Signal } from '@/types'

interface ConnectionLinesProps {
  signals: Signal[]
}

export function ConnectionLines({ signals: allSignals }: ConnectionLinesProps) {
  const lineRefs = useRef<Map<string, THREE.Line>>(new Map())
  const signals = allSignals.filter(s => s.state !== 'absorbed')

  const connections = useMemo(() => {
    const seen = new Set<string>()
    const result: { key: string; from: Signal; to: Signal }[] = []

    for (const sig of signals) {
      for (const connId of sig.connections) {
        const target = signals.find(s => s.id === connId)
        if (!target) continue
        const key = [sig.id, connId].sort().join('--')
        if (seen.has(key)) continue
        seen.add(key)
        result.push({ key, from: sig, to: target })
      }
    }
    return result
  }, [signals])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    lineRefs.current.forEach((line) => {
      if (line.material instanceof THREE.LineBasicMaterial) {
        line.material.opacity = 0.12 + Math.sin(t * 1.5) * 0.06
      }
    })
  })

  return (
    <>
      {connections.map(({ key, from, to }) => {
        const points = [
          new THREE.Vector3(...from.position),
          new THREE.Vector3(...to.position),
        ]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const color = new THREE.Color(from.color)

        return (
          <line
            key={key}
            ref={(el) => {
              if (el) lineRefs.current.set(key, el as unknown as THREE.Line)
              else lineRefs.current.delete(key)
            }}
          >
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial
              attach="material"
              color={color}
              transparent
              opacity={0.18}
              linewidth={1}
            />
          </line>
        )
      })}
    </>
  )
}
