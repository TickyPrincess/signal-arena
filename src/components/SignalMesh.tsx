'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import type { Signal } from '@/types'

interface SignalMeshProps {
  signal: Signal
  isSelected: boolean
  onClick: () => void
  onHover: (id: string | null) => void
}

export function SignalMesh({ signal, isSelected, onClick, onHover }: SignalMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const targetPos = useRef(new THREE.Vector3(...signal.position))

  const color = useMemo(() => new THREE.Color(signal.color), [signal.color])

  useFrame((state, delta) => {
    if (!groupRef.current || !materialRef.current) return

    // Update target position from signal data
    targetPos.current.set(...signal.position)

    // Smooth lerp to target
    groupRef.current.position.lerp(targetPos.current, 0.08)

    const t = state.clock.elapsedTime
    const seedOffset = parseInt(signal.id.slice(0, 4), 36) * 0.001

    // Gentle float
    groupRef.current.position.y += Math.sin(t * 0.7 + seedOffset) * 0.003

    // Sphere rotation
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (0.2 + signal.virality * 0.004)
      meshRef.current.rotation.y += delta * (0.3 + signal.virality * 0.005)
    }

    // Emissive pulse based on virality
    const pulse = Math.sin(t * 2.5 + seedOffset) * 0.3 + 0.7
    const baseEmissive = (signal.virality / 100) * 1.8 * pulse
    materialRef.current.emissiveIntensity = isSelected ? baseEmissive * 1.8 : baseEmissive

    // Scale pulsing
    const scaleTarget = signal.scale * (1 + Math.sin(t * 1.8 + seedOffset) * 0.06)
    const stateScale = signal.state === 'dominant' ? 1.3 : signal.state === 'dying' ? 0.6 : 1.0
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scaleTarget * stateScale, 0.06)
    )

    // Dominant ring rotation
    if (torusRef.current && signal.state === 'dominant') {
      torusRef.current.rotation.z += delta * 1.2
      torusRef.current.rotation.x = Math.sin(t * 0.5) * 0.3
    }

    // Opacity for dying signals
    if (signal.state === 'dying' || signal.state === 'absorbed') {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0.1, 0.04)
    }
  })

  if (signal.state === 'absorbed') return null

  return (
    <group ref={groupRef} position={signal.position}>
      {/* Core sphere */}
      <Sphere
        ref={meshRef}
        args={[0.55, 32, 32]}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(signal.id); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { onHover(null); document.body.style.cursor = 'default' }}
      >
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={signal.virality / 100 * 1.5}
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.92}
        />
      </Sphere>

      {/* Inner core glow */}
      <Sphere args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          transparent
          opacity={0.4}
        />
      </Sphere>

      {/* Selected ring */}
      {isSelected && (
        <Torus args={[0.85, 0.02, 8, 64]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={4}
            transparent
            opacity={0.9}
          />
        </Torus>
      )}

      {/* Dominant ring */}
      {signal.state === 'dominant' && (
        <Torus ref={torusRef} args={[1.1, 0.025, 8, 64]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={5}
            transparent
            opacity={0.8}
          />
        </Torus>
      )}

      {/* Particle sparkles for high virality */}
      {signal.virality > 65 && (
        <Sparkles
          count={signal.state === 'dominant' ? 24 : 12}
          scale={signal.scale * 3.5}
          size={signal.state === 'dominant' ? 2.5 : 1.5}
          speed={0.4}
          color={signal.color}
          opacity={0.7}
        />
      )}

      {/* Point light */}
      <pointLight
        color={signal.color}
        intensity={signal.virality / 100 * (signal.state === 'dominant' ? 4 : 2)}
        distance={4.5}
        decay={2}
      />
    </group>
  )
}
