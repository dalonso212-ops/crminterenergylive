/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal NIBA — azul navy eléctrico
        brand: {
          950: '#040D1A',
          900: '#0B1F3A',   // navbar, fondos oscuros
          800: '#0F2D55',
          700: '#1A407A',
          600: '#1D5BB5',
          500: '#2563EB',   // botones primarios, CTA
          400: '#3B82F6',   // hover
          300: '#60A5FA',   // accents
          200: '#BFDBFE',
          100: '#DBEAFE',
          50:  '#EFF6FF',   // fondos suaves
        },
        // Navy puro para textos y sidebar
        navy: {
          900: '#040D1A',
          800: '#0B1F3A',
          700: '#1A3560',
          600: '#1E4080',
          500: '#2D5FA0',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(11,31,58,0.08), 0 1px 2px -1px rgba(11,31,58,0.06)',
        'card-hover': '0 4px 12px 0 rgba(11,31,58,0.12), 0 2px 4px -1px rgba(11,31,58,0.08)',
        'modal': '0 20px 60px -10px rgba(11,31,58,0.3)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #040D1A 0%, #0B1F3A 50%, #1A407A 100%)',
        'gradient-blue': 'linear-gradient(135deg, #1D5BB5 0%, #2563EB 50%, #3B82F6 100%)',
        'gradient-hero': 'linear-gradient(160deg, #040D1A 0%, #0B1F3A 40%, #1A3560 70%, #1D5BB5 100%)',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },               to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
