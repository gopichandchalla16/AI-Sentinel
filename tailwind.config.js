/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: '#111118',
        border: '#1e1e2e',
        purple: '#9945FF',
        green: '#14F195',
        amber: '#F59E0B',
        orange: '#F97316',
        red: '#EF4444',
      },
      animation: {
        'slide-in': 'slideIn 0.35s ease',
        'pulse-glow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
