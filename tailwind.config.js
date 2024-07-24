/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.html",
    "./assets/javascripts/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'Tournedos-Regular': ['"Tournedos-Regular"']
      }
    },
  },
  plugins: [],
}