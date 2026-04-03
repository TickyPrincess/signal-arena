import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signal Arena — Play ideas. Win influence.',
  description: 'A competitive environment where signals, memes, and ideas fight for dominance in real time.',
  openGraph: {
    title: 'Signal Arena',
    description: 'Play ideas. Win influence.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
