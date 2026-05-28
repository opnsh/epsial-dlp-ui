/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        epsial: {
          ink: '#08111f',
          navy: '#0d1b33',
          panel: '#111f35',
          line: '#233550',
          mist: '#e8eef7',
          secure: '#17c964',
          cyan: '#38bdf8',
          warning: '#f59e0b',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(23, 201, 100, 0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
