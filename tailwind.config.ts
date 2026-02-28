import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#0a0a1a',
          card: '#141428',
          primary: '#00ff88',
          accent: '#ff6b35',
          gold: '#ffd700',
          alert: '#ff2d55',
          text: '#e0e0e0',
          muted: '#4a4a6a',
          border: '#1e1e3a',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        terminal: ['"VT323"', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px #00ff88, 0 0 20px #00ff88',
        'neon-sm': '0 0 5px #00ff88',
        'neon-danger': '0 0 10px #ff2d55',
        'neon-gold': '0 0 10px rgba(255, 215, 0, 0.3)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
