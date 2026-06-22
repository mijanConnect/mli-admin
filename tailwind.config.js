/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3FAE6A",
        secondary: "#181818",
        baseBg: "#fff",
      },
    },
  },
  plugins: [],
};
