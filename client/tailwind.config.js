/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50:  '#faf7f2',
          100: '#f5f0e8',
          200: '#ede8e0',
          300: '#e0dbd4',
          400: '#c4bdb4',
          500: '#9b9590',
          600: '#6b6560',
          700: '#4a4540',
          800: '#2c2825',
          900: '#1a1814',
        },
        ink: {
          50:  '#f5f0e8',
          500: '#8b7355',
          600: '#6b5840',
          700: '#4a3d2c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
