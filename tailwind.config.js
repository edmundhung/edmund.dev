module.exports = {
  // mode: 'jit',
  purge: [
    "./app/**/*.tsx",
    "./app/**/*.jsx",
    "./app/**/*.js",
    "./app/**/*.ts"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // listStyleType: {
    //   disc: 'disclosure-open',
    //   decimal: 'decimal-leading-zero',
    // },
    // Some useful comment
    extend: {
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif']
      },
      colors: {
        primary: '#383835',
        secondary: '#6c6c67',
      },
      textColor: {
        primary: '#52524e',
        // secondary: '#d4d6c8',
      },
      backgroundColor: {
        primary: '#ebece5',
      },
    },
  },
  variants: {},
  plugins: []
};
