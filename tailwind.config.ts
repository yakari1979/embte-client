// frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // --- AJOUT IMPORTANT ---
  darkMode: "class", // Active la stratégie de mode sombre par classe

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { // Votre configuration de container est parfaite
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        // On utilise des variables CSS pour que le changement soit dynamique
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-subtle': 'hsl(var(--text-subtle))',
        
        // Les couleurs de marque peuvent rester les mêmes ou être adaptées
        'brand-primary': '#10B981',
        'brand-secondary': '#059669',
        'brand-light': 'hsl(var(--brand-light))', // On la rend dynamique aussi
        'destructive': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;