/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a', // Blue 900
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6', // Gray 100
          foreground: '#1f2937', // Gray 800
        },
        accent: {
          DEFAULT: '#3b82f6', // Blue 500
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
