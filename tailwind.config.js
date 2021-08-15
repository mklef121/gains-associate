const colors = {
  'gray-fade': '#FAFAFF',
  primary: '#867AE9',
  'faint-primary': '#c7c0ff',
  notice: '#FF8080',
  'pretty-dark': '#3E3E3E',
  success: '#4CD24E',
  grey: '#808080',
  'light-blue': '#aaa654',
}

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ...colors,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
