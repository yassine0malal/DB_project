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
          DEFAULT: '#f3f4f6', // Gray 100 (light mode)
          foreground: '#1f2937', // Gray 800
          dark: '#374151', // Gray 700 (dark mode variant)
        },
        accent: {
          DEFAULT: '#3b82f6', // Blue 500
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#10b981', // Green 500
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b', // Amber 500
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#ef4444', // Red 500
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
