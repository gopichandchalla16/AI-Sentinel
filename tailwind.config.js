/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
        danger: '#EF4444',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'count-up': 'countUp 2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
