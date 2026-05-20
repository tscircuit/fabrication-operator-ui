import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#0b76d1",
          strong: "#075fc0",
          soft: "#e8f3ff",
        },
        green: {
          DEFAULT: "#11a86a",
          soft: "#e9f8f1",
        },
        red: {
          DEFAULT: "#e11d2e",
          soft: "#fff0f1",
        },
        ink: "#0a0d14",
        text: "#1b2430",
        muted: "#667085",
        faint: "#98a2b3",
        line: {
          DEFAULT: "#d8dee7",
          soft: "#e8edf3",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f5f7fa",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        mono: ['"SFMono-Regular"', "Consolas", "monospace"],
      },
      boxShadow: {
        shell: "0 18px 55px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config
