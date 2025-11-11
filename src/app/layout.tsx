// src/app/layout.tsx (version mise à jour)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/index.css";
import 'leaflet/dist/leaflet.css';
import { Providers } from "./providers"; // <-- Importer le provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plateforme Édu",
  description: "Votre plateforme d'éducation numérique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers> {/* <-- Entourer children avec le provider */}
          {children}
        </Providers>
      </body>
    </html>
  );
}