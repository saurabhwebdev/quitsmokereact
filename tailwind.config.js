/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: '#000000',
        background: '#FFFFFF',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        expand: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.25)', opacity: '1' }
        },
        contract: {
          '0%': { transform: 'scale(1.25)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        smoke1: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0' },
          '10%': { opacity: '0.5' },
          '100%': { transform: 'translate(-10px, -20px) scale(2)', opacity: '0' }
        },
        smoke2: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0' },
          '20%': { opacity: '0.5' },
          '100%': { transform: 'translate(-15px, -25px) scale(2)', opacity: '0' }
        },
        smoke3: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0' },
          '30%': { opacity: '0.5' },
          '100%': { transform: 'translate(-5px, -30px) scale(2)', opacity: '0' }
        },
        crossLine1: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        crossLine2: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        expand: 'expand 4s ease-in-out forwards',
        contract: 'contract 8s ease-in-out forwards',
        'smoke-1': 'smoke1 3s ease-out infinite',
        'smoke-2': 'smoke2 3s ease-out infinite 0.5s',
        'smoke-3': 'smoke3 3s ease-out infinite 1s',
        'cross-1': 'crossLine1 1s ease-out forwards',
        'cross-2': 'crossLine2 1.5s ease-out forwards'
      }
    },
  },
  plugins: [],
}

