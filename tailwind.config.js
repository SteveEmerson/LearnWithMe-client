module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({

        'splash-back': "url('/src/assets/hummingbird-hawkmoth-4811285_1920.jpg')",

       })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
