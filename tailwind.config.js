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
        primary: '#52524e',
        secondary: '#ebece5',
      },
    },
  },
  variants: {},
  plugins: []
};
