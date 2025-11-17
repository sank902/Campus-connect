/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Use "Inter" as the default font
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // New color palette
      colors: {
        'brand-dark': '#111827', // gray-900
        'brand-light': '#f9fafb', // gray-50
        'brand-accent': {
          'light': '#a5f3fc', // cyan-200
          DEFAULT: '#06b6d4', // cyan-500
          'dark': '#0e7490'  // cyan-700
        },
        'brand-alert': {
          DEFAULT: '#f43f5e', // rose-500
          'light': '#ffe4e6'  // rose-100
        }
      },
      // Animation for the gradient backgrounds
      animation: {
        'gradient-bg': 'gradient-bg 15s ease infinite',
      },
      keyframes: {
        'gradient-bg': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}