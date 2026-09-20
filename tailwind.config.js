/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050705',
        foreground: '#c8f7d0',
        canvas: '#050807',
        card: {
          DEFAULT: '#080d08',
          hover: '#0e1613',
          foreground: '#c8f7d0',
        },
        matrix: {
          DEFAULT: '#00ff41',
          bright: '#00ff66',
          dim: '#2c7a3a',
          glow: 'rgba(0, 255, 65, 0.55)',
        },
        muted: {
          DEFAULT: '#0c140c',
          foreground: '#6fae78',
        },
        border: {
          DEFAULT: '#123a17',
          subtle: 'rgba(0, 255, 65, 0.18)',
          highlight: 'rgba(0, 255, 65, 0.6)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.98)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        pulseSlow: 'pulseSlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
