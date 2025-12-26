import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', 
  content: [
    // IL FAUT AJOUTER "src/" DEVANT LES CHEMINS !
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Au cas où tu aurais encore des fichiers à la racine (sécurité)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          black: "var(--nexus-black)",      
          dark: "var(--nexus-dark)",       
          gray: "var(--nexus-gray)",       
          orange: "var(--nexus-orange)",     
          concrete: "var(--nexus-concrete)",
          text: "var(--nexus-text)",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;