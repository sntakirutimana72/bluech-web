/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blueish: '#7182ff',
        darkish: '#1f1f1f',
        'darkish-2x': '#2f2f2f',
        reddish: '#ee4f51',
      },
    },
  },
  plugins: [],
}
