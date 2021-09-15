module.exports = {
  // mode: 'jit',
  purge: {
    content: [
      './app/**/*.tsx',
      './app/**/*.jsx',
      './app/**/*.js',
      './app/**/*.ts',
    ],
    safelist: [
      'col-span-1',
      'col-span-2',
      'col-span-3',
      'row-span-1',
      'row-span-2',
      'row-span-3',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    // listStyleType: {
    //   disc: 'disclosure-open',
    //   decimal: 'decimal-leading-zero',
    // },
    // Some useful comment
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
      gridTemplateColumns: {
        layout: '200px auto',
        masonry: 'repeat(auto-fill, minmax(180px, 1fr))',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
