/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173F35', // Deep forest green
          dark: '#102F29',    // Institutional dark green
          muted: '#315F50',   // Muted forest green
          light: '#3D7462',
        },
        sage: {
          DEFAULT: '#DCE8DF', // Sage green
          light: '#F1F5F0',   // Pale sage background
          border: '#C5D6C9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          page: '#F5F5F0',    // Main page background
          card: '#FFFFFF',    // Primary card background
          subtle: '#F8F8F4',  // Secondary surface
          border: '#E0E4DD',  // Borders and dividers
        },
        ink: {
          DEFAULT: '#202C28',
          primary: '#202C28', // Primary text
          secondary: '#68736D', // Secondary text
          muted: '#849087',   // Muted labels
        },
        bronze: {
          DEFAULT: '#A88955', // Muted antique bronze
          soft: '#F2EBDD',    // Soft bronze background
          border: '#D8C7A5',
        },
        status: {
          positive: '#287653',
          positiveBg: '#EDF5F0',
          warning: '#B17B35',
          warningBg: '#FAF4EB',
          negative: '#B64D49',
          negativeBg: '#FAF0F0',
        },
        primary: {
          DEFAULT: '#173F35',
          hover: '#102F29',
          light: '#F1F5F0',
        },
        risk: {
          good: '#287653',
          goodBg: '#EDF5F0',
          goodBorder: '#DCE8DF',
          bad: '#B64D49',
          badBg: '#FAF0F0',
          badBorder: '#F2D3D1',
          warning: '#B17B35',
          warningBg: '#FAF4EB',
          warningBorder: '#F2EBDD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'institutional': '0 1px 3px 0 rgba(32, 44, 40, 0.04), 0 1px 2px -1px rgba(32, 44, 40, 0.04)',
        'institutional-hover': '0 4px 6px -1px rgba(32, 44, 40, 0.06), 0 2px 4px -2px rgba(32, 44, 40, 0.04)',
      }
    },
  },
  plugins: [],
}
