/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./app/**/*.tsx', './app/**/*.ts'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      colors: {
        primary: '#383835',
        secondary: '#6c6c67',
      },
      textColor: {
        primary: '#52524e',
      },
      backgroundColor: {
        primary: '#ebece5',
        secondary: '#d4d6c8',
      },
    },
  },
  variants: {},
  // plugins: [require('@tailwindcss/typography')],
};
