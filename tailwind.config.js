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
      'md:col-span-1',
      'md:col-span-2',
      'md:col-span-3',
      'md:row-span-1',
      'md:row-span-2',
      'md:row-span-3',
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
        masonry: 'repeat(auto-fill, minmax(180px, 1fr))',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
