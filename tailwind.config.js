/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444', // red-500
        background: '#f9fafb', // gray-50
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // You can change 'Inter' to your preferred font
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'reverse-spin': 'reverse-spin 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 3s',
        'expand': 'expand 4s ease-in-out infinite',
        'contract': 'contract 4s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'smoke-1': 'smoke 2s ease-out infinite',
        'smoke-2': 'smoke 2s ease-out infinite 0.5s',
        'smoke-3': 'smoke 2s ease-out infinite 1s',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        expand: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        contract: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.8)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
        },
        smoke: {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '0.2'
          },
          '100%': {
            transform: 'translateY(-10px) scale(1.5) translateX(5px)',
            opacity: '0'
          }
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

