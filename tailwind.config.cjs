/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'scale-on-load': "scaleup 180ms ease-out 1"
      },
      keyframes: {
        scaleup: {
          "0%": { transform: "scale(0.7)" },
          "100%": { transform: "scale(1)" }
        }
      }
    }
  },
  plugins: []
};
