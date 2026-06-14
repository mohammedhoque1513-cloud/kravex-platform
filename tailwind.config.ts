import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        kravex: {
          black: "#0a0a0a", dark: "#111111", card: "#1a1a1a", gold: "#c9a84c", lightGold: "#e8c97a", mutedGold: "#a08030", offWhite: "#f5f5f0", text: "#ffffff", secondary: "#a0a0a0", muted: "#606060", border: "#2a2a2a", success: "#22c55e", warning: "#f59e0b", error: "#ef4444",
        },
      },
      boxShadow: { gold: "0 0 60px rgba(201,168,76,.18)" },
    },
  },
  plugins: [],
};
export default config;
