/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundColor: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      textColor: {
        foreground: 'hsl(var(--foreground))',
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          DEFAULT: '#2563eb',
        },
        success: {
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#052e16'
        },
        warning: {
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          900: '#451a03'
        },
        danger: {
          100: '#fee2e2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          900: '#450a0a'
        },
      },
      fontFamily: {
        'noto-kufi': ['Noto Kufi Arabic', 'sans-serif'],
        'ibm-plex': ['IBM Plex Sans Arabic', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: {
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.5), 0 0 20px rgba(37, 99, 235, 0.3)',
          },
          to: {
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.8), 0 0 30px rgba(37, 99, 235, 0.5)',
          },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}