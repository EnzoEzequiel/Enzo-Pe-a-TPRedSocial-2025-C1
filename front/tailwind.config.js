/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Muy importante para Angular
  ],
  theme: {
    extend: {
      colors: {
        'verde-lagarto': '#28a745', // Usá el color que necesites
      },
    },
  },
  plugins: [],
}
