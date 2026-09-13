/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Permacultura Alentejo": tons de terra, verde-oliva, bege e areia
        bege: "#F5F5DC",
        oliva: {
          DEFAULT: "#556B2F",
          light: "#6B8E42",
          dark: "#3E4F22",
        },
        terra: {
          DEFAULT: "#8B4513",
          light: "#A9612B",
          dark: "#6B3410",
        },
        areia: "#E6DFD5",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(85, 107, 47, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
