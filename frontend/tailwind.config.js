/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf4f4',
          100: '#f8e8e9',
          200: '#f0c5c8',
          300: '#e59ea2',
          400: '#d76f75',
          500: '#c2272d', // Base Red
          600: '#a31f24',
          700: '#82181d',
          800: '#631316',
          900: '#460e10',
        },
        secondary: {
          50: '#fffdf4',
          100: '#fffbe8',
          200: '#fef3c5',
          300: '#fdeba2',
          400: '#fce179',
          500: '#fad64a', // Base Gold
          600: '#e3be37',
          700: '#b8992a',
          800: '#8c741e',
          900: '#615013',
        },
        navy: '#2D2D2D', // Using Dark Gray for navy to maintain compatibility
        gold: '#FAD64A',
        lightbg: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-image': "url('/bg-hero.jpg')",
        'hero-gradient': 'linear-gradient(135deg, #460e10 0%, #82181d 50%, #c2272d 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(194, 39, 45, 0.05) 0%, rgba(194, 39, 45, 0) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fad64a 0%, #fdeba2 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(194, 39, 45, 0.1), 0 2px 4px -1px rgba(194, 39, 45, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(194, 39, 45, 0.1), 0 10px 10px -5px rgba(194, 39, 45, 0.04)',
        'nav': '0 2px 15px rgba(45, 45, 45, 0.08)',
        'glow': '0 0 20px rgba(194, 39, 45, 0.3)',
      },
    },
  },
  plugins: [],
}
