module.exports = {
  // mode: 'jit',
  purge: {
    content: [
      './app/**/*.tsx',
      './app/**/*.jsx',
      './app/**/*.js',
      './app/**/*.ts',
    ],
  },
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
      gridTemplateColumns: {
        layout: '200px auto',
        masonry: 'repeat(auto-fill, minmax(220px, 1fr))',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
