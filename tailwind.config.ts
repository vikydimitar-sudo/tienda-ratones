import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        base: "#05070f",
        panel: "#0b1020",
        accent: {
          DEFAULT: "#22d3ee",
          soft: "#38bdf8",
          deep: "#0891b2",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 8px 40px -12px rgba(34,211,238,0.35)",
        soft: "0 10px 40px -20px rgba(0,0,0,0.8)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(4%,6%) scale(1.15)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.25s ease-out",
        aurora: "aurora 18s ease-in-out infinite",
        fadein: "fadein 0.4s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
