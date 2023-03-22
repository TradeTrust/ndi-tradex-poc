/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: (theme) => ({
      center: true,
      padding: theme("spacing.4"),
    }),
    extend: {
      fontFamily: {
        "gilroy-light": ["Gilroy-Light", "sans-serif"],
        "gilroy-medium": ["Gilroy-Medium", "sans-serif"],
        "gilroy-bold": ["Gilroy-Bold", "sans-serif"],
        "gilroy-extrabold": ["Gilroy-ExtraBold", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      colors: {
        cerulean: {
          50: "#F7F8FC",
          300: "#4DA6E8",
          500: "#2D5FAA",
        },
        cloud: {
          800: "#454B50",
        },
      },
    },
  },
  plugins: [],
};
