/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif-kr)", "'KOPUB Batang'", "system-ui", "serif"],
      },
    },
  },
  plugins: [],
};
