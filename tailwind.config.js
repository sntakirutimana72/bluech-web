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
        light: '#f5f6fa',
      },
      animation: {
        toggled: 'toggled 350ms ease-in-out',
        'load-ball-1': 'load-bounce 1s alternate infinite ease-in-out, load-flash 3s alternate infinite ease-in-out',
        'load-ball-2': 'load-bounce 1s .333s alternate infinite ease-in-out, load-flash 3s 1s alternate infinite ease-in-out',
        'load-ball-3': 'load-bounce 1s .666s alternate infinite ease-in-out, load-flash 3s 2s alternate infinite ease-in-out',
      },
      keyframes: {
        toggled: {
          '0%': {
            opacity: '0',
            display: 'none',
            transform: 'translateX(100%)',
          },
          '1%': {
            opacity: '1',
            display: 'block',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'load-bounce': {
          from: {
            position: 'relative',
            top: '-10%',
          },
          to: {
            position: 'relative',
            top: '10%',
          },
        },
        'load-flash': {
          from: {
            background: '#a065ff',
          },
          to: {
            background: '#e040ff',
          },
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
