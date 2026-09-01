/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        paper: {
          950: '#080a0f',
          900: '#0c0f17',
          850: '#111522',
          800: '#171c2d',
          750: '#1e2438',
          700: '#272f47',
        },
        editorial: {
          crimson: '#dc2626',
          amber: '#d97706',
          emerald: '#059669',
          blue: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
