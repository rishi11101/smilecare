/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:        '#1C3557',
        'navy-deep': '#142640',
        'navy-mid':  '#254878',
        steel:       '#2E6DA4',
        'steel-light': '#4A8EC2',
        'steel-pale':  '#E8F2FB',
        gold:        '#E8A135',
        'gold-light':'#F5C068',
        page:        '#F5F7FA',
        'page-2':    '#EDF0F5',
        card:        '#FFFFFF',
        slate:       '#1A2535',
        'slate-mid': '#4A5568',
        'slate-light':'#718096',
        'slate-muted':'#A0AEC0',
        border:      '#E2E8F0',
        'border-2':  '#CBD5E0',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
