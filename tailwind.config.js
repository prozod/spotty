/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        playlist:
          "[index] 32px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)",
        playlistMobile: "[index] 32px [first] 6fr [last] minmax(120px,1fr)",
        appLayout: "[nav] min-content [app] 1fr",
      },
      fontSize: {
        xs: "0.8rem",
        sm: "0.9rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      colors: {
        grack: {
          600: "#3e3e3e",
          700: "#282828",
          800: "#181818",
          900: "#121212",
        },
        spotify: "#1ed760",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translatex(0%)" },
          "50%": { transform: "translatex(-100%)" },
          "100%": { transform: "translatex(0%)" },
        },
      },
    },
  },
  plugins: [],
};
