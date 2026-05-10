// tailwind.config.ts
// Y2K Snap — Design Tokens
// 把這個檔案的 theme.extend 內容合併到你的 tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {

      // ── Colors ──────────────────────────────────────────
      colors: {
        // Primitive — Green Yellow
        'gy': {
          50:  '#FDFFFA',
          100: '#EEFFD4',
          200: '#E0FFAE',
          300: '#D2FF88',
          400: '#C5FF62',
          500: '#B8FF3C',
          600: '#A3FC11',
          700: '#87DA05',
          800: '#68AB06',
          900: '#4B7E06',
          950: '#305105',
        },
        // Primitive — Electric Violet
        'ev': {
          50:  '#E9DBFF',
          100: '#D6BBFF',
          200: '#C29CFF',
          300: '#AF7CFF',
          400: '#9B5DFF',
          500: '#8639FD',
          600: '#7215FA',
          700: '#6207E3',
          800: '#5408BC',
          900: '#460895',
          950: '#360770',
        },
        // Semantic — use these in components
        brand: {
          DEFAULT:  '#B8FF3C', // primary
          hover:    '#A3FC11',
          active:   '#87DA05',
        },
        accent: {
          DEFAULT:  '#9B5DFF',
          hover:    '#8639FD',
          active:   '#7215FA',
        },
        bg: {
          base:     '#F0F0F0',
          surface:  '#FFFFFF',
        },
        content: {
          primary:   '#0A0A0A',
          secondary: '#4A4A4A',
          disabled:  '#858585',
          'on-brand': '#0A0A0A',
          'on-accent': '#FFFFFF',
        },
        border: {
          DEFAULT:  '#C2C2C2',
          strong:   '#858585',
          brand:    '#B8FF3C',
          accent:   '#9B5DFF',
        },
        feedback: {
          success: '#A3FC11',
          error:   '#FF3C6B',
          warning: '#FFD600',
        },
      },

      // ── Typography ───────────────────────────────────────
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },

      fontSize: {
        'display-hero': ['89.76px', { lineHeight: '1.05', letterSpacing: '0.02em' }],
        'display-xl':   ['67.34px', { lineHeight: '1.05', letterSpacing: '0.02em' }],
        'heading-lg':   ['50.52px', { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'heading-md':   ['37.9px',  { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'heading-sm':   ['28.43px', { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'label-lg':     ['21.33px', { lineHeight: '1.5',  letterSpacing: '0em'    }],
        'body-md':      ['16px',    { lineHeight: '1.5',  letterSpacing: '0em'    }],
        'body-sm':      ['12px',    { lineHeight: '1.5',  letterSpacing: '0em'    }],
        'caption':      ['9px',     { lineHeight: '1.4',  letterSpacing: '0.04em' }],
      },

    },
  },
  plugins: [],
}

export default config
