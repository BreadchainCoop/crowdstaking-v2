import type { Config } from "tailwindcss";

import { breadTheme } from "./bread.theme";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...breadTheme,
      gridTemplateRows: {
        "governance-rows": "repeat(5, minmax(1fr, auto))",
      },
      gridTemplateCols: {
        "project-row-cols": "repeat(24, minmax(1fr, auto))",
      },
      gridColumn: {
        "project-row-span-23": "span 23 / span 23",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
export default config;
