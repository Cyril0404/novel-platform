import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme
        light: {
          bg: "#FAFAF9",
          text: "#1C1917",
          muted: "#78716C",
        },
        // Dark theme
        dark: {
          bg: "#1C1917",
          text: "#E7E5E4",
          muted: "#A8A29E",
        },
        // Sepia theme
        sepia: {
          bg: "#F5F0E6",
          text: "#44403C",
          muted: "#78716C",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
