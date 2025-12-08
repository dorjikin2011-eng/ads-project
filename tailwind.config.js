/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#f59e0b',
        'primary-dark': '#d97706',
        'primary-darker': '#b45309',
        'secondary': '#ffffff',
        'accent': '#f59e0b',
        'success': '#16a34a',
        'warning': '#f97316',
        'text-main': '#1f2937',
        'text-secondary': '#4b5563',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
