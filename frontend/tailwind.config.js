/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:          '#1C3557',
        'navy-deep':   '#122640',
        'navy-mid':    '#254878',
        steel:         '#3870A8',
        'steel-light': '#4D8DC4',
        'steel-pale':  '#EAF2FB',
        gold:          '#D4921C',
        'gold-light':  '#E8AC42',
        page:          '#F7F3EC',
        'page-2':      '#EDE8DE',
        card:          '#FEFAF4',
        slate:         '#28201A',
        'slate-mid':   '#5A5248',
        'slate-light': '#887868',
        'slate-muted': '#B0A090',
        border:        '#E2D8CA',
        'border-2':    '#CEC0AE',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'warm':    '0 2px 8px rgba(100,70,30,0.07), 0 8px 28px rgba(100,70,30,0.05)',
        'warm-lg': '0 4px 20px rgba(100,70,30,0.10), 0 16px 48px rgba(100,70,30,0.07)',
      },
    },
  },
  plugins: [],
}
