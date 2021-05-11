module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({

        'night-sky-back': "url('/src/assets/night-sky.jpg')",

       })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
