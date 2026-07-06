import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        muted: "#64737f",
        paper: "#fbfaf7",
        line: "#d8dee3",
        teal: "#147d75",
        coral: "#d95f45",
        gold: "#c99419"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
