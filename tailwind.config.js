/** @type {import('tailwindcjs').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '0rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
      spacing: {
        DEFAULT: '1rem',
        'xs': '0.5rem',
        'sm': '0.75rem',
        'md': '1.25rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: [
          "SF Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
      },
      backgroundImage: {
        'card-light': 'linear-gradient(135deg, var(--base-100), var(--base-200))',
        'card-dark': 'linear-gradient(135deg, var(--base-200), var(--base-300))',
        'nav-light': 'linear-gradient(90deg, var(--base-100), var(--base-200))',
        'nav-dark': 'linear-gradient(90deg, var(--base-100), var(--base-200))',
        'button-light': 'linear-gradient(135deg, var(--primary), var(--secondary))',
        'button-dark': 'linear-gradient(135deg, var(--neutral), var(--base-300))',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "night",
    themes: [
      {
        day: {
          // Base colors
          primary: "#111",
          "primary-focus": "#000000",
          "primary-content": "#ffffff",

          secondary: "#00C2E0",
          "secondary-focus": "#00a5c0",
          "secondary-content": "#ffffff",

          accent: "#FFCA28",
          "accent-focus": "#ffb300",
          "accent-content": "#000000",

          neutral: "#303841",
          "neutral-focus": "#1a1e23",
          "neutral-content": "#ffffff",

          info: "#00B8D4",
          "info-content": "#ffffff",

          success: "#18DB93",
          "success-content": "#ffffff",

          warning: "#FFB024",
          "warning-content": "#000000",

          error: "#ED4A31",
          "error-content": "#ffffff",

          "base-100": "#FFFFFF",
          "base-200": "#F7FAFC",
          "base-300": "#EDF2F7",
          "base-content": "#1f2937",

          // Component styles
          ".btn": {
            "font-weight": "600",
            "transition": "all 0.3s ease",
            "&:hover": {
              "transform": "translateY(-2px)",
              "box-shadow": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
          },
          ".card": {
            "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "background": "var(--bg-card-light)",
          },
          ".input": {
            "transition": "border-color 0.2s ease-in-out",
            "&:focus": {
              "border-color": "var(--primary)",
              "box-shadow": "0 0 0 2px rgba(var(--primary), 0.1)",
            },
          },
          ".navbar": {
            "background": "var(--bg-nav-light)",
            "box-shadow": "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },

          "--rounded-box": "0rem",
          "--rounded-btn": "0.15rem",
          "--rounded-badge": "0rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.2s",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0rem",
        },

        night: {
          primary: "#A3A3A3",
          "primary-focus": "#8A8A8A",
          "primary-content": "#000000",

          secondary: "#B8B8B8",
          "secondary-focus": "#9F9F9F",
          "secondary-content": "#000000",

          accent: "#D4D4D4",
          "accent-focus": "#BBBBBB",
          "accent-content": "#000000",

          neutral: "#4B4B4B",
          "neutral-focus": "#323232",
          "neutral-content": "#ffffff",

          info: "#8C8C8C",
          "info-content": "#ffffff",

          success: "#18DB93",
          "success-content": "#111",

          warning: "#787878",
          "warning-content": "#ffffff",

          error: "#ED4A31",
          "error-content": "#ffffff",

          "base-100": "#1C1C1B",
          "base-200": "#1C1C1C",
          "base-300": "#2E2E2E",
          "base-content": "#ffffff",

          // Component styles
          ".btn": {
            "font-weight": "500",
            "transition": "all 0.3s ease",
            "&:hover": {
              "transform": "translateY(-2px)",
              "box-shadow": "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            },
          },
          ".card": {
            "background": "var(--bg-card-dark)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "box-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
          ".input": {
            "background": "var(--base-200)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "&:focus": {
              "border-color": "var(--primary)",
              "box-shadow": "0 0 0 2px rgba(255, 255, 255, 0.1)",
            },
          },
          ".navbar": {
            "background": "var(--bg-nav-dark)",
            "border-bottom": "1px solid rgba(255,255,255,0.1)",
          },

          "--rounded-box": "0rem",
          "--rounded-btn": "0.15rem",
          "--rounded-badge": "0rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.2s",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0rem",
        }
      }
    ]
  },
}
