/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05070F',
          900: '#070B18',
          800: '#0B1120',
          700: '#111827',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(120deg, #2563EB 0%, #4F46E5 45%, #7C3AED 100%)',
        'accent-gradient-soft':
          'linear-gradient(120deg, rgba(37,99,235,0.16) 0%, rgba(79,70,229,0.16) 50%, rgba(124,58,237,0.16) 100%)',
        'grid-dark':
          'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
        'grid-light':
          'linear-gradient(to right, rgba(15,23,42,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.07) 1px, transparent 1px)',
      },
      boxShadow: {
        glow: '0 20px 60px -20px rgba(79,70,229,0.55)',
        card: '0 1px 2px rgba(15,23,42,0.06), 0 12px 32px -18px rgba(15,23,42,0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 8s linear infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
