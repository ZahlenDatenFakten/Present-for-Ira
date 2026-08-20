import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#000000',
        'carbon': '#060606',
        'graphite': '#252525',
        'onyx': '#1f1f1f',
        'iron': '#313131',
        'slate': '#3d3d3d',
        'fog': '#525252',
        'ash': '#7a7a7a',
        'smoke': '#8a8a8a',
        'pearl': '#c5c5c5',
        'bone': '#e5e5e5',
        'chalk': '#ffffff',
        'signal-lime': '#c5ff4a',
        'olive-depth': '#597321',
        'moss-shadow': '#314013',
      },
      fontFamily: {
        serif: ['var(--font-pt-serif)'],
        sans: ['var(--font-inter-tight)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
      boxShadow: {
        'sm-glow': '0px 0px 8px 0px rgba(197, 255, 74, 0.45)',
      }
    },
  },
  plugins: [],
};
export default config;
