// 'use client';

// import { ArrowRight } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// const partners = [
//   {
//     id: 1,
//     name: "Maire de Rufisque Nord",
//     logo: "https://i.postimg.cc/Mppd8QLt/mrn.webp",
//     category: "Administration",
//     description: "Partenaire institutionnel pour le développement local à Rufisque Nord.",
//     url: "#"
//   },
//   {
//     id: 2,
//     name: "Cabinet EPSO",
//     logo: "https://i.postimg.cc/Bn3JF9pn/epso.jpg",
//     category: "Orientation",
//     description: "Expert en accompagnement pour l'orientation post-bac et les bourses d'études.",
//     url: "#"
//   },
//   {
//     id: 3,
//     name: "Maire de Rufisque Est",
//     logo: "https://i.postimg.cc/rFn5xYhs/mr.webp",
//     category: "Administration",
//     description: "Partenaire institutionnel pour le développement local à Rufisque Est.",
//     url: "#"
//   },
// ];

// export default function PartnersSection() {
//   const infinitePartners = [...partners, ...partners];

//   return (
//     <section className="py-24 bg-nexus-black border-t border-nexus-gray overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
//         <h2 className="text-3xl sm:text-4xl font-black text-nexus-text">
//           Ils nous ont fait confiance
//         </h2>
//       </div>

//       <div className="relative w-full">
//         <div className="absolute left-0 top-0 bottom-0 w-24  from-nexus-black to-transparent z-10"></div>
//         <div className="absolute right-0 top-0 bottom-0 w-24 from-nexus-black to-transparent z-10"></div>

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
//                 className="group block h-full  rounded-2xl p-6 hover:border-nexus-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//               >

//                 {/* CONTENU */}
//                 <div className="flex flex-col items-center justify-center text-center gap-4">

//                   {/* IMAGE AGRANDIE */}
//                   <div className="relative w-32 h-32  shadow-md">
//                     <Image
//                       src={partner.logo}
//                       alt={`Logo ${partner.name}`}
//                       fill
//                       className="object-contain"
//                     />
//                   </div>

//                 </div>

//               </a>
//             </div>
//           ))}
//         </div>
//       </div>

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

import Image from 'next/image';

const partners = [
  {
    id: 1,
    name: "Maire de Rufisque Nord",
    logo: "https://i.postimg.cc/Mppd8QLt/mrn.webp",
    url: "#",
  },
  {
    id: 2,
    name: "Cabinet EPSO",
    logo: "https://i.postimg.cc/Bn3JF9pn/epso.jpg",
    url: "#",
  },
  {
    id: 3,
    name: "Maire de Rufisque Est",
    logo: "https://i.postimg.cc/rFn5xYhs/mr.webp",
    url: "#",
  },
];

export default function PartnersSection() {
  const infinitePartners = [...partners, ...partners];

  return (
    <section className="py-24 bg-nexus-black border-t border-nexus-gray overflow-hidden">
      
      {/* TITRE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-nexus-text">
          Ils nous ont fait confiance
        </h2>
      </div>

      {/* SLIDER */}
      <div className="relative w-full">
        
        {/* Fade gauche / droite */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-nexus-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-nexus-black to-transparent z-10" />

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {infinitePartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="mx-6 w-[260px] flex-shrink-0"
            >
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center
                           h-[200px] w-full
                           rounded-3xl
                           bg-nexus-dark/60 backdrop-blur-md
                           border border-white/15
                           hover:border-nexus-orange/60
                           transition-all duration-300
                           hover:-translate-y-1
                           hover:shadow-2xl"
              >
                {/* IMAGE */}
                <div className="relative w-40 h-40">
                  <Image
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    fill
                    className="object-contain
                               transition-transform duration-300
                               group-hover:scale-105"
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
