/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // soft indigo
        secondary: "#A855F7", // purple accent
        accent: "#10B981", // mint green
        soft: "#F0F9FF", // light blueish bg
        lightCard: "#FFFFFF",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(99,102,241,0.1)",
      },
    },
  },
  plugins: [],
}
