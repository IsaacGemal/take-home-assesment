import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "Outfit Placeholder", "sans-serif"],
        inter: ["var(--font-inter)", "Inter Placeholder", "sans-serif"],
      },
      colors: {
        "primary-green": "#003E39",
        secondary: "#F7F2E9",
      },
    },
  },
  darkMode: "media",
};

export default config;
