/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ey-yellow': 'var(--ey-yellow)',
        'ey-yellow-soft': 'var(--ey-yellow-soft)',
        'signal-cyan': 'var(--signal-cyan)',
        ink: {
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
        },
        mist: {
          100: 'var(--mist-100)',
          200: 'var(--mist-200)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}
