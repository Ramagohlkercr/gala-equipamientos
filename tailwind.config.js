/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gala: {
          bg: '#F5EDE3',
          surface: '#FBF8F3',
          black: '#111111',
          white: '#FFFFFF',
          gray: '#77736E',
          'gray-light': '#A6A29D',
          border: '#E8DED3',
          'border-dark': '#D9CCBD',
          accent: '#DCC6AC',
          'accent-light': '#F3ECE3',
          'accent-dark': '#B89C7A',
          green: '#648A6B',
          'green-light': '#EBF2EC',
          'green-dark': '#48684D',
          red: '#B65D54',
          'red-light': '#F9ECEB',
          'red-dark': '#8E433C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(17, 17, 17, 0.04), 0 1px 2px 0 rgba(17, 17, 17, 0.02)',
        'card': '0 4px 16px -2px rgba(17, 17, 17, 0.05), 0 2px 6px -1px rgba(17, 17, 17, 0.03)',
        'float': '0 12px 32px -4px rgba(17, 17, 17, 0.08), 0 4px 12px -2px rgba(17, 17, 17, 0.04)',
      }
    },
  },
  plugins: [],
}

