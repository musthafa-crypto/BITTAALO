/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF8F1',
          100: '#F5EEDC',
          200: '#EBDCB9',
          300: '#DEC48F',
          400: '#D4AF37', // Gold Accent
          500: '#B89324',
          600: '#947217',
          700: '#705411',
          800: '#4D380C',
          900: '#2A1E06',
        },
        dark: {
          bg: '#0A0A0B',
          surface: '#121214',
          card: '#18181B',
          border: '#27272A',
          muted: '#71717A',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.3em',
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
