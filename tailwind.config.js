/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: { max: "480px" },
      tb: { min: "480px", max: "768px" },
      md: { min: "768px", max: "976px" },
      lg: { min: "976px", max: "1440px" },
      xl: { min: "1440px" },
    },
    extend: {
      colors: {
        text: "rgb(1, 7, 29)",
        background: "rgb(236, 241, 254)",
        primary: "rgb(22, 76, 249)",
        secondary: "rgb(251, 122, 189)",
        accent: "rgb(250, 71, 73)",
      },

      fontFamily: {
        TC: ["Noto Serif TC", "serif"],
        Poetsen: ["Poetsen One", "sans-serif"],
      },
    },
  },
  plugins: [],
};
