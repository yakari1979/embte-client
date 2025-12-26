// 'use client';

// import { ArrowRight } from 'lucide-react';
// import Image from 'next/image';

// const partners = [
//     {
//       id: 1,
//       name: "Maire de Rufisque Nord",
//       logo: "https://i.postimg.cc/Mppd8QLt/mrn.webp",
//       category: "Administration",
//       description: "Partenaire institutionnel pour le développement local à Rufisque Nord.",
//       url: "#"
//     },
//     {
//       id: 2,
//       name: "Cabinet EPSO",
//       logo: "https://i.postimg.cc/Bn3JF9pn/epso.jpg",
//       category: "Orientation",
//       description: "Expert en accompagnement pour l'orientation post-bac et les bourses d'études.",
//       url: "#"
//     },
//     {
//       id: 3,
//       name: "Maire de Rufisque Est",
//       logo: "https://i.postimg.cc/rFn5xYhs/mr.webp",
//       category: "Administration",
//       description: "Partenaire institutionnel pour le développement local à Rufisque Est.",
//       url: "#"
//     },
//   ];
  

// export default function PartnersSection() {
//   // On duplique la liste pour créer l'effet de boucle infinie sans coupure
//   const infinitePartners = [...partners, ...partners];

//   return (
//     <section className="py-24 bg-nexus-black border-t border-nexus-gray overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
//         <h2 className="text-3xl sm:text-4xl font-black text-nexus-text">
//          Ils nous ont fait confiance <span className="text-nexus-orange">confiance</span>
//         </h2>
//       </div>

//       {/* Container du défilement */}
//       <div className="relative w-full">
        
//         {/* Dégradés latéraux ADAPTATIFS (Le secret pour que ça marche en Dark & Light) */}
//         {/* 'from-nexus-black' prendra la couleur du fond définie dans globals.css */}
//         <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-nexus-black to-transparent z-10"></div>
//         <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-nexus-black to-transparent z-10"></div>

//         {/* Piste d'animation */}
//         <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
//           {infinitePartners.map((partner, index) => (
//             <div 
//               key={`${partner.id}-${index}`} 
//               className="mx-4 w-[320px] flex-shrink-0"
//             >
//               <a 
//                 href={partner.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 // Carte avec fond adaptatif (nexus-dark) et bordure
//                 className="group block h-full bg-nexus-dark border border-nexus-gray rounded-2xl p-6 hover:border-nexus-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//               >
//                 {/* En-tête carte */}
//                 <div className="flex justify-between items-start mb-4">
//                   {/* Fond blanc forcé pour le logo pour garantir la lisibilité */}
//                   <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-xl p-2 border border-gray-100 shadow-sm">
//                      <Image
//                       src={partner.logo} 
//                       alt={`Logo ${partner.name}`}
//                       width={80}
//                       height={80}
//                       className="object-contain w-full h-full"
//                     />
//                   </div>
//                   <span className="text-[10px] uppercase tracking-wider font-bold text-nexus-concrete bg-nexus-black border border-nexus-gray px-2 py-1 rounded-md">
//                     {partner.category}
//                   </span>
//                 </div>

//                 {/* Contenu */}
//                 <div>
//                   <h3 className="text-lg font-bold text-nexus-text mb-2 group-hover:text-nexus-orange transition-colors">
//                     {partner.name}
//                   </h3>
//                   <p className="text-nexus-concrete text-sm leading-relaxed line-clamp-3">
//                     {partner.description}
//                   </p>
//                 </div>
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Styles CSS pour l'animation */}
//       <style jsx>{`
//         @keyframes scroll {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll {
//           animation: scroll 40s linear infinite;
//         }
//       `}</style>
//     </section>
//   );
// }



'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const partners = [
  {
    id: 1,
    name: "Maire de Rufisque Nord",
    logo: "https://i.postimg.cc/Mppd8QLt/mrn.webp",
    category: "Administration",
    description: "Partenaire institutionnel pour le développement local à Rufisque Nord.",
    url: "#"
  },
  {
    id: 2,
    name: "Cabinet EPSO",
    logo: "https://i.postimg.cc/Bn3JF9pn/epso.jpg",
    category: "Orientation",
    description: "Expert en accompagnement pour l'orientation post-bac et les bourses d'études.",
    url: "#"
  },
  {
    id: 3,
    name: "Maire de Rufisque Est",
    logo: "https://i.postimg.cc/rFn5xYhs/mr.webp",
    category: "Administration",
    description: "Partenaire institutionnel pour le développement local à Rufisque Est.",
    url: "#"
  },
];

export default function PartnersSection() {
  const infinitePartners = [...partners, ...partners];

  return (
    <section className="py-24 bg-nexus-black border-t border-nexus-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-nexus-text">
          Ils nous ont fait confiance
        </h2>
      </div>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-24  from-nexus-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 from-nexus-black to-transparent z-10"></div>

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {infinitePartners.map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="mx-4 w-[320px] flex-shrink-0"
            >
              <a 
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full  rounded-2xl p-6 hover:border-nexus-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                {/* CONTENU */}
                <div className="flex flex-col items-center justify-center text-center gap-4">

                  {/* IMAGE AGRANDIE */}
                  <div className="relative w-32 h-32  shadow-md">
                    <Image
                      src={partner.logo}
                      alt={`Logo ${partner.name}`}
                      fill
                      className="object-contain"
                    />
                  </div>

                </div>

              </a>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
