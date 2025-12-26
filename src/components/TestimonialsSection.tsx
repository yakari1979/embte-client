'use client';

import { Quote, Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Moussa Diop",
    role: "Propriétaire Villa R+1",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    text: "Une équipe incroyablement professionnelle. Le suivi via l'application m'a permis de voir l'avancement de ma villa à Saly depuis Paris sans aucun stress.",
    rating: 5
  },
  {
    id: 2,
    name: "Aïssatou Fall",
    role: "Directrice SCI Immo",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop",
    text: "Nous avons confié la construction de notre immeuble de bureaux à Nexus. Délais respectés à la lettre et une qualité de finition rare au Sénégal.",
    rating: 5
  },
  {
    id: 3,
    name: "Jean-Marc Leblanc",
    role: "Investisseur",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
    text: "La transparence des coûts et la gestion logistique sont impressionnantes. Je recommande vivement pour tout projet d'envergure.",
    rating: 4
  },
  {
    id: 4,
    name: "Fatima Sylla",
    role: "Architecte",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop",
    text: "En tant qu'architecte, c'est un plaisir de travailler avec une entreprise qui respecte scrupuleusement les plans techniques et les normes.",
    rating: 5
  },
  {
    id: 5,
    name: "Omar Cissé",
    role: "Promoteur Immobilier",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
    text: "Le dashboard client change la vie. Plus besoin d'appeler 10 fois par jour, je vois les photos et les rapports en temps réel.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  // On double la liste pour l'effet infini
  const infiniteTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-nexus-black border-t border-nexus-gray overflow-hidden">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <h2 className="text-3xl sm:text-5xl font-black text-nexus-text">
            Témoignages <br/>
          <span className="text-nexus-concrete text-2xl sm:text-3xl font-normal mt-2 block">
            Voici ce que nos clients disent de nous.
          </span>
        </h2>
      </div>

      {/* Container Défilement */}
      <div className="relative w-full">
        
        {/* Dégradés latéraux (Adaptatifs Dark/Light) */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-nexus-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-nexus-black to-transparent z-10 pointer-events-none"></div>

        {/* Piste d'animation INVERSE */}
        <div className="flex w-max animate-scroll-reverse hover:[animation-play-state:paused]">
          {infiniteTestimonials.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="mx-4 w-[400px] flex-shrink-0"
            >
              <div className="h-full bg-nexus-dark border border-nexus-gray p-8 rounded-3xl relative group hover:border-nexus-orange/50 transition-colors duration-300">
                
                {/* Icône Citation décorative */}
                <Quote className="absolute top-6 right-6 text-nexus-concrete/10 w-12 h-12 transform group-hover:rotate-12 transition-transform duration-500" />

                {/* Header User */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-nexus-gray group-hover:border-nexus-orange transition-colors">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-nexus-text">{item.name}</h3>
                    <p className="text-sm text-nexus-orange font-medium">{item.role}</p>
                    {/* Étoiles */}
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-nexus-gray"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="text-nexus-concrete text-lg leading-relaxed italic">
                  "{item.text}"
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation CSS Inverse */}
      <style jsx>{`
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 60s linear infinite;
        }
      `}</style>
    </section>
  );
}