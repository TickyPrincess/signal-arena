import dynamic from 'next/dynamic'

const ArenaApp = dynamic(() => import('@/components/ArenaApp'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#050508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: '#00D9FF',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        SIGNAL ARENA
      </div>
      <div className="loading-bar" />
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#5a5a7a',
        }}
      >
        INITIALIZING ARENA...
      </div>
    </div>
  ),
})

export default function Home() {
  return <ArenaApp />
}
