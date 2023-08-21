/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.html",
    "./assets/javascripts/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'WildWords': ['"WildWords"']
      }
    },
  },
  plugins: [],
}