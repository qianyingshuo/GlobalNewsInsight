/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-darker': '#050508',
        'cyber-card': '#111118',
        'cyber-border': '#1e1e2e',
        'neon-cyan': '#00f2fe',
        'neon-blue': '#4facfe',
        'neon-purple': '#a855f7',
        'neon-pink': '#ec4899',
        'neon-green': '#10b981',
        'neon-yellow': '#f59e0b',
        'neon-red': '#ef4444',
        'text-primary': '#f8fafc',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'typing': 'typing 3s steps(40, end)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(0, 242, 254, 0.5), 0 0 10px rgba(0, 242, 254, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.8), 0 0 40px rgba(0, 242, 254, 0.4)',
          },
        },
        'typing': {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
