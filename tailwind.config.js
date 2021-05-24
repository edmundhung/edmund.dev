module.exports = {
  mode: 'jit',
  purge: [
    "./app/**/*.tsx",
    "./app/**/*.jsx",
    "./app/**/*.js",
    "./app/**/*.ts"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    listStyleType: {
      disc: 'disclosure-open',
      decimal: 'decimal-leading-zero',
    },
    // Some useful comment
    extend: {
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif']
      },
    },
  },
  variants: {},
  plugins: []
};
