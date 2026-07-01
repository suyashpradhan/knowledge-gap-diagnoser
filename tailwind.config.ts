import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Diagnostic canvas   cool, calm, clinical
        canvas: "#F5F6F8",
        surface: "#FFFFFF",
        ink: "#181B22",
        subtle: "#5A6472",
        faint: "#8B95A3",
        hairline: "#E4E7EC",
        // Four verdict semantics: each has a strong accent + soft tint + edge
        known: { DEFAULT: "#0E9D6B", tint: "#E6F5EF", edge: "#B7E4D2" },
        stale: { DEFAULT: "#B9770B", tint: "#FAF0DA", edge: "#EBD08C" },
        never: { DEFAULT: "#D23E57", tint: "#FBE6EA", edge: "#F1B9C3" },
        contextfit: { DEFAULT: "#6D53F2", tint: "#ECE8FE", edge: "#CFC4FB" },
        unknown: { DEFAULT: "#586173", tint: "#EEF0F3", edge: "#D3D8E0" },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        panel:
          "0 1px 2px rgba(24,27,34,0.04), 0 8px 24px -12px rgba(24,27,34,0.12)",
        lift: "0 2px 4px rgba(24,27,34,0.06), 0 18px 40px -16px rgba(24,27,34,0.20)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
