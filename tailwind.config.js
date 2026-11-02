/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "rgb(var(--color-black) / <alpha-value>)",
          ink: "rgb(var(--color-ink) / <alpha-value>)",
          graphite: "rgb(var(--color-graphite) / <alpha-value>)",
          line: "rgb(var(--color-line) / <alpha-value>)",
          orange: "rgb(var(--color-orange) / <alpha-value>)",
          white: "rgb(var(--color-white) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "Arial", "sans-serif"]
      },
      boxShadow: {
        orange: "0 18px 70px rgb(var(--color-orange) / 0.18)"
      },
      backgroundImage: {
        "technical-grid":
          "linear-gradient(rgb(var(--color-white) / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-white) / 0.045) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
