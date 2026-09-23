/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'earth-green': '#2d5016',
        'earth-blue': '#1e40af',
        'earth-orange': '#ea580c',
      },
    },
  },
  plugins: [],
}
