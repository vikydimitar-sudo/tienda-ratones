import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        accent: "#6366f1",
      },
    },
  },
  plugins: [],
} satisfies Config;
