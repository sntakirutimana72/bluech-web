/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        blueish: '#a065ff',
        darkish: '#1f1f1f',
        'darkish-2x': '#4f4f4f',
        'darkish-2.5x': '#6f6f6f',
        'darkish-3x': '#9f9f9f',
        reddish: '#ee4f51',
        light: '#f0f0f0',
        'light-2x': '#afafaf',
      },
      animation: {
        toggled: 'toggled 350ms ease-in-out',
        'rolex-1': 'rolexer .8s infinite ease-in-out',
        'rolex-2': 'rolexer .8s .25s infinite ease-in-out',
        'rolex-3': 'rolexer .8s .5s infinite ease-in-out',
        'wait-bouncer-1': 'bouncer 1s alternate infinite ease-in-out, flouncer 3s alternate infinite ease-in-out',
        'wait-bouncer-2': 'bouncer 1s .333s alternate infinite ease-in-out, flouncer 3s 1s alternate infinite ease-in-out',
        'wait-bouncer-3': 'bouncer 1s .666s alternate infinite ease-in-out, flouncer 3s 2s alternate infinite ease-in-out',
      },
      keyframes: {
        toggled: {
          '0%': {
            opacity: '0',
            display: 'none',
            transform: 'translateX(-100%)',
          },
          '1%': {
            opacity: '1',
            display: 'block',
          },
          '100%': { transform: 'translateX(0)' },
        },
        bouncer: {
          '0%': { top: '-10%' },
          '100%': { top: '10%' },
        },
        flouncer: {
          '0%': { background: '#a065ff' },
          '100%': { background: '#e040ff' },
        },
        rolexer: {
          '0%': { height: '15px' },
          '100%': { height: '30px' },
        },
      },
      transitionProperty: {
        custom: 'display, width, height, right, top, bottom, left, transform',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
