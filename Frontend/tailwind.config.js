/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage-green' : '#9CAD8A',
        'pastel-green': '#60774C', 
        'bg-gray' : '#E4E7EB',
        'dark-green': '#CCE2CB',
      },
    },
  },
  plugins: [],
}
