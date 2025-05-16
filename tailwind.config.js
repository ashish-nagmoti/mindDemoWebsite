/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        dark: "#1F2937",
        light: "#F9FAFB",
        "fish-white": "#F8FAFC",
        "mindful-yellow": "#FEF3C7",
        "calm-blue": "#EFF6FF",
        "serene-green": "#ECFDF5",
        "warm-amber": "#FEF3C7",
        "soft-rose": "#FEE2E2"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}