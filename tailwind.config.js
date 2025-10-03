/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6366f1",  // Indigo-500 - Modern, Professional
          dark: "#4f46e5",     // Indigo-600
          light: "#818cf8",    // Indigo-400
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom SIH Colors - Modern Professional Palette
        success: {
          DEFAULT: "#10b981",  // Emerald-500
          dark: "#059669",     // Emerald-600
          light: "#34d399",    // Emerald-400
        },
        warning: {
          DEFAULT: "#f59e0b",  // Amber-500
          dark: "#d97706",     // Amber-600
          light: "#fbbf24",    // Amber-400
        },
        error: {
          DEFAULT: "#ef4444",  // Red-500
          dark: "#dc2626",     // Red-600
          light: "#f87171",    // Red-400
        },
        info: {
          DEFAULT: "#3b82f6",  // Blue-500
          dark: "#2563eb",     // Blue-600
          light: "#60a5fa",    // Blue-400
        },
        // DSI Score Zones
        dsi: {
          critical: "#ef4444",    // Red-500 <70
          warning: "#f59e0b",     // Amber-500 70-89
          good: "#10b981",        // Emerald-500 90-95
          excellent: "#6366f1",   // Indigo-500 >95
        },
        // Document Status Colors
        status: {
          verified: "#10b981",    // Emerald-500
          pending: "#f59e0b",     // Amber-500
          missing: "#ef4444",     // Red-500
          flagged: "#f97316",     // Orange-500
        },
        // Neutral Gray Scale
        neutral: {
          bg: "#f8fafc",
          surface: "#ffffff",
          border: "#e2e8f0",
          "text-primary": "#0f172a",
          "text-secondary": "#64748b",
          "text-muted": "#94a3b8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "count-up": "count-up 0.5s ease-out",
      },
      transitionDuration: {
        '200': '200ms',
      },
      transitionTimingFunction: {
        'in-out': 'ease-in-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
