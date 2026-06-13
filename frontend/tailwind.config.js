/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:      '#1B4F8A',
        'navy-dark': '#143d6e',
        'navy-light': '#2563B0',
        sky:       '#E8F2FF',
        'sky-dark': '#D0E5FF',
        gold:      '#F59E0B',
        'gold-light': '#FCD34D',
        slate:     '#1a1a2e',
        'slate-mid': '#4a5568',
        'slate-light': '#718096',
        offwhite:  '#F7F9FC',
        white:     '#FFFFFF',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
