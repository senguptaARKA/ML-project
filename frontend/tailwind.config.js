/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0A0F1D',
        },
        primary: {
          DEFAULT: '#1E3A8A', // Classic Banking Deep Blue
          hover: '#172554',
          light: '#EFF6FF',
        },
        risk: {
          good: '#16A34A',      // Subtle green for positive / low risk
          goodBg: '#F0FDF4',
          goodBorder: '#BBF7D0',
          bad: '#DC2626',       // Subtle red for high risk
          badBg: '#FEF2F2',
          badBorder: '#FECACA',
          warning: '#D97706',   // Warning / review amber
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
