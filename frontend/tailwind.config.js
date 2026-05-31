/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e8ecf7',
          200: '#ccd5f0',
          300: '#a3b4e5',
          400: '#738cd7',
          500: '#4f68c4',
          600: '#3d4fa7',
          700: '#323f87',
          800: '#2d3670',
          900: '#28305f',
          950: '#1b1f3f',
        },
        slate: {
          850: '#161e2e',
          900: '#0f172a',
          950: '#070a13',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
