/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        black: "#333333",
        "dark-orange": "#FD5200",
      },
      fontFamily: {
        sans: ["Clash Display", "sans-serif"],
      },
    },
  },
  plugins: [],
}
