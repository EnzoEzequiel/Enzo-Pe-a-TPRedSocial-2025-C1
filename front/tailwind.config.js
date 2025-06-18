/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        iguana: {
          DEFAULT: '#2F8A4C',   // tu verde lagartija
          light: '#68B475',   // para hover/segundarios
          dark: '#256E3A',   // para fondo “solid”
        },
      },
      fontFamily: {
        logo: ['Titan One'],
        body: ['Inter', 'sans-serif'],
      }
    },
    plugins: [],
  }
}
