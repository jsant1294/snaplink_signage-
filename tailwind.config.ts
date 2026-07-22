import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink:"#0A0A0A", panel:"#141414", gold:"#D4AF37", champagne:"#A8895F", line:"#2A2A2A" },
    fontFamily: { serif:["Cormorant Garamond","Georgia","serif"] },
  }},
  plugins: [],
} satisfies Config;
