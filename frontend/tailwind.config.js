const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Adjust this to your project structure
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url('https://cdn.wallpapersafari.com/59/23/HcVWIk.jpg')",
      },
    },
  },
  plugins: [],
});
