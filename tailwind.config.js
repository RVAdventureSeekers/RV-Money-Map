/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FBFAF7",
          100: "#F5F2EA",
          200: "#EAE4D4",
        },
        ink: {
          700: "#3A3B35",
          900: "#20211D",
        },
        route: {
          50: "#E9F3EF",
          100: "#C7E4D9",
          400: "#3E9178",
          600: "#1F6E56",
          700: "#175340",
        },
        rust: {
          500: "#B5502F",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
