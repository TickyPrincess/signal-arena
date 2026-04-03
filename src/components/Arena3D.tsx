'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls, Grid } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useArenaStore } from '@/lib/store'
import { SignalMesh } from './SignalMesh'
import { ConnectionLines } from './ConnectionLines'

function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    // Very subtle mouse parallax
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.mouse.x * 0.5, 0.02)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.mouse.y * 0.3, 0.02)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x, 0.02)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.5 + mouse.current.y, 0.02)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function ArenaGrid() {
  return (
    <Grid
      position={[0, -6.5, 0]}
      args={[40, 40]}
      cellSize={1.5}
      cellThickness={0.3}
      cellColor={new THREE.Color('#0a0a1a')}
      sectionSize={6}
      sectionThickness={0.5}
      sectionColor={new THREE.Color('#16162a')}
      fadeDistance={25}
      fadeStrength={2}
      infiniteGrid
    />
  )
}

function SceneContent() {
  const signals = useArenaStore(s => s.signals)
  const selectedSignalId = useArenaStore(s => s.selectedSignalId)
  const selectSignal = useArenaStore(s => s.selectSignal)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <>
      <CameraRig />

      {/* Ambient */}
      <ambientLight intensity={0.04} />
      <directionalLight position={[5, 5, 5]} intensity={0.1} color="#ffffff" />

      {/* Stars */}
      <Stars radius={80} depth={60} count={4000} factor={3} saturation={0} fade speed={0.5} />

      {/* Arena floor grid */}
      <ArenaGrid />

      {/* Signals */}
      {signals
        .filter(s => s.state !== 'absorbed')
        .map(signal => (
          <SignalMesh
            key={signal.id}
            signal={signal}
            isSelected={selectedSignalId === signal.id}
            onClick={() => selectSignal(signal.id === selectedSignalId ? null : signal.id)}
            onHover={setHoveredId}
          />
        ))
      }

      {/* Connection lines */}
      <ConnectionLines signals={signals} />

      {/* Post processing */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          height={512}
          intensity={1.8}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0004, 0.0004)}
          radialModulation={false}
          modulationOffset={0.5}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
}

export function Arena3D() {
  return (
    <Canvas
      camera={{ position: [0, 1, 20], fov: 55, near: 0.1, far: 200 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
      style={{ background: '#050508' }}
    >
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 25, 60]} />

      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={8}
        maxDistance={32}
        autoRotate
        autoRotateSpeed={0.15}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.25}
        makeDefault
      />
    </Canvas>
  )
}
