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
        paper: "#fdf5e6",
        ink: "#2c1810",
        'vtg-primary': "#c5a059",
        'vtg-accent-red': "#b91c1c",
        'vtg-accent-blue': "#1e3a8a",
        'vtg-accent-green': "#15803d",
        'vtg-sepia-light': "#f4ecd8",
        'vtg-sepia-dark': "#e8dec0",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        terminal: ['"VT323"', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        masthead: ["Cinzel", "serif"],
        headline: ["Playfair Display", "serif"],
        body: ["Newsreader", "serif"],
        display: ["Newsreader", "serif"],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')",
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
