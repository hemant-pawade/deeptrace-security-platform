/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        cyber: {
          dark: '#0B0F17',
          darker: '#06090E',
          card: '#111726',
          border: '#1E293B',
          accent: '#0284C7',
          neon: '#38BDF8',
        },
      },
    },
  },
  plugins: [],
}
