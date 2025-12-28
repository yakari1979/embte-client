import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Ton import CSS correct
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import UserTracker from "@/components/UserTracker"; // <-- IMPORT

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "EMBTE BTP",
  description: "Gestion de chantier en temps reel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* 
         IMPORTANT : J'ai ajouté les classes Tailwind ici 
         bg-nexus-black = couleur de fond
         text-nexus-text = couleur du texte
      */}
      <body className={`${inter.className} bg-nexus-black text-nexus-text min-h-screen`}>
        <ThemeProvider>
        <UserTracker /> {/* <-- AJOUT ICI, invisible mais présent */}
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}