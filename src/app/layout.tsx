// // src/app/layout.tsx (version mise à jour)
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "../styles/index.css";
// import 'leaflet/dist/leaflet.css';
// import { Providers } from "./providers"; // <-- Importer le provider

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Plateforme Édu",
//   description: "Votre plateforme d'éducation numérique.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="fr" suppressHydrationWarning>
//       <body className={inter.className}>
//         <Providers> {/* <-- Entourer children avec le provider */}
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }



// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/index.css";
import 'leaflet/dist/leaflet.css';
import { Providers } from "./providers";
// --- IMPORT DU CHAT ---
// Assure-toi que le chemin correspond bien à l'endroit où tu as créé le fichier
// Si ton fichier est dans src/components/, c'est bien ça :
import CoachingChat from "@/components/CoachingChat"; 

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
        <Providers>
          {children}
          
          {/* --- LE CHATBOT FLOTTANT --- */}
          {/* Il se superpose à toutes les pages grâce à sa position "fixed" */}
          <CoachingChat />
          
        </Providers>
      </body>
    </html>
  );
}