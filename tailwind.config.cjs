/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: { 7: 'repeat(7, minmax(0, 1fr))' },
      keyframes: {
        'hero-text-1': {
          '0%': { background: 'bg-gradient' },
          '25%': {
            background: 'black',
          },
          '100%': {
            background: 'black',
          },
        },
      },
    },
  },
  plugins: [],
}
