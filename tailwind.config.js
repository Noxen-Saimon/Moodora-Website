/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F4EDE3',
        walnut: '#2F1D14',
        cedar: '#8A5A44',
        smoke: '#6B5B52',
        ember: '#C77C58'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif']
      },
      boxShadow: {
        aura: '0 20px 60px rgba(66, 34, 20, 0.16)'
      },
      backgroundImage: {
        grain: 'radial-gradient(circle at 20% 20%, rgba(199,124,88,0.18), transparent 42%), radial-gradient(circle at 80% 0%, rgba(138,90,68,0.22), transparent 40%), linear-gradient(180deg, #FFF8F0 0%, #F4EDE3 100%)'
      }
    }
  },
  plugins: []
};
