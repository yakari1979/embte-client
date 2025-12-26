'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Données des partenaires
// const partners = [
//   {
//     id: 1,
//     name: "École au Sénégal",
//     logo: "https://i.postimg.cc/L88sJFNJ/img-eas.jpg",
//     category: "Pédagogie",
//     description: "Partenaire de référence pour la diffusion de contenus vidéos conformes au programme.",
//     url: "https://ecolesausenegal.org"
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
//     name: "Alie IA",
//     logo: "https://i.postimg.cc/3xb7c47j/alie.jpg",
//     category: "Technologie",
//     description: "Moteur d'Intelligence Artificielle intégré pour l'assistance pédagogique.",
//     url: "#"
//   },
//   {
//     id: 4,
//     name: "Orange Sénégal",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg",
//     category: "Infrastructure",
//     description: "Partenaire connectivité garantissant l'accessibilité haut débit.",
//     url: "https://www.orange.sn"
//   },
//   {
//     id: 5,
//     name: "AWS",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
//     category: "Cloud",
//     description: "Leader mondial assurant la sécurité et la disponibilité des données.",
//     url: "https://aws.amazon.com"
//   },
//   {
//     id: 6,
//     name: "Microsoft Education",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
//     category: "Outils",
//     description: "Support pour l'intégration des outils de productivité modernes.",
//     url: "https://www.microsoft.com/en-us/education"
//   }
// ];

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
    // {
    //   id: 4,
    //   name: "École au Sénégal",
    //   logo: "https://i.postimg.cc/L88sJFNJ/img-eas.jpg",
    //   category: "Pédagogie",
    //   description: "Partenaire de référence pour la diffusion de contenus vidéos conformes au programme.",
    //   url: "https://ecolesausenegal.org"
    // },
    // {
    //   id: 5,
    //   name: "Orange Sénégal",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg",
    //   category: "Infrastructure",
    //   description: "Partenaire connectivité garantissant l'accessibilité haut débit.",
    //   url: "https://www.orange.sn"
    // },
    // {
    //   id: 6,
    //   name: "AWS",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    //   category: "Cloud",
    //   description: "Leader mondial assurant la sécurité et la disponibilité des données.",
    //   url: "https://aws.amazon.com"
    // }
  ];
  

export default function PartnersSection() {
  // On duplique la liste pour créer l'effet de boucle infinie sans coupure
  const infinitePartners = [...partners, ...partners];

  return (
    <section className="py-24 bg-nexus-black border-t border-nexus-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-nexus-orange/10 border border-nexus-orange/20 text-nexus-orange text-sm font-bold uppercase tracking-widest mb-4">
          Écosystème
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-nexus-text">
         Ils nous ont fait confiance <span className="text-nexus-orange">confiance</span>
        </h2>
      </div>

      {/* Container du défilement */}
      <div className="relative w-full">
        
        {/* Dégradés latéraux ADAPTATIFS (Le secret pour que ça marche en Dark & Light) */}
        {/* 'from-nexus-black' prendra la couleur du fond définie dans globals.css */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-nexus-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-nexus-black to-transparent z-10"></div>

        {/* Piste d'animation */}
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
                // Carte avec fond adaptatif (nexus-dark) et bordure
                className="group block h-full bg-nexus-dark border border-nexus-gray rounded-2xl p-6 hover:border-nexus-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* En-tête carte */}
                <div className="flex justify-between items-start mb-4">
                  {/* Fond blanc forcé pour le logo pour garantir la lisibilité */}
                  <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-xl p-2 border border-gray-100 shadow-sm">
                     <Image
                      src={partner.logo} 
                      alt={`Logo ${partner.name}`}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-nexus-concrete bg-nexus-black border border-nexus-gray px-2 py-1 rounded-md">
                    {partner.category}
                  </span>
                </div>

                {/* Contenu */}
                <div>
                  <h3 className="text-lg font-bold text-nexus-text mb-2 group-hover:text-nexus-orange transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-nexus-concrete text-sm leading-relaxed line-clamp-3">
                    {partner.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Styles CSS pour l'animation */}
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