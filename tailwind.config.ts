import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#050508',
          panel: '#080810',
          border: '#16162a',
          meme: '#FF006E',
          idea: '#00D9FF',
          trend: '#FFBE0B',
          accent: '#7B2FBE',
          text: '#E8E8F0',
          muted: '#5a5a7a',
          dim: '#2a2a40',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        glitch: {
          '0%, 100%': { transform: 'translateX(0)', filter: 'none' },
          '20%': { transform: 'translateX(-2px)', filter: 'hue-rotate(90deg)' },
          '40%': { transform: 'translateX(2px)', filter: 'hue-rotate(-90deg)' },
          '60%': { transform: 'translateX(0)', filter: 'brightness(1.5)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'bar-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-left': 'slide-left 0.5s ease-out forwards',
        'slide-right': 'slide-right 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        glitch: 'glitch 0.4s ease-in-out',
        float: 'float 5s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
        'bar-fill': 'bar-fill 1s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
