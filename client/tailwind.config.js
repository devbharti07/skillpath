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
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5', // Deep indigo primary
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#4F46E5'
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED', // Violet secondary
          700: '#6D28D9',
          DEFAULT: '#7C3AED'
        },
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6', // Teal accent
          600: '#0D9488',
          DEFAULT: '#14B8A6'
        },
        background: {
          light: '#F7F8FC',
          dark: '#0F172A'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B'
        },
        surfaceAlt: {
          light: '#F1F4F9',
          dark: '#334155'
        },
        textMain: {
          light: '#172033',
          dark: '#F8FAFC'
        },
        textMuted: {
          light: '#667085',
          dark: '#94A3B8'
        },
        borderBase: {
          light: '#E6E8EF',
          dark: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'glow-primary': '0 0 25px -5px rgba(79, 70, 229, 0.3)',
        'glow-accent': '0 0 25px -5px rgba(20, 184, 166, 0.3)'
      }
    },
  },
  plugins: [],
}
