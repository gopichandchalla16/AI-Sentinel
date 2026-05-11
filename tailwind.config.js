/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'solana-purple': '#9945FF',
        'solana-green': '#14F195',
        'card': '#111118',
        'border-dark': '#1e1e2e',
      },
      animation: {
        'shield-pulse': 'shieldPulse 2s ease-in-out infinite',
        'bar-fill': 'barFill 2s ease-in-out infinite',
      },
      keyframes: {
        shieldPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px #9945FF)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px #14F195)' },
        },
        barFill: {
          '0%': { width: '10%' },
          '50%': { width: '80%' },
          '100%': { width: '95%' },
        },
      },
    },
  },
  plugins: [],
};
