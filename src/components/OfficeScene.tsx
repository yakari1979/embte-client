'use client';

import { useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OfficeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  // ID de ta vidéo YouTube (Change le si besoin)
  // const videoId = "M7lc1UVf-VE";
  const videoId = "-YPmIa0n8Tw";
 

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Titre
      gsap.fromTo(".hero-text-anim", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );

      // 2. Carte Contact (Arrivée par la droite cette fois, plus naturel)
      gsap.fromTo(".contact-card-anim",
        { x: 50, opacity: 0 },
        { 
          x: 0, opacity: 1, 
          duration: 1, delay: 0.5, ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    // CORRECTION HAUTEUR : min-h pour s'adapter au contenu mobile
    <section ref={containerRef} className="relative w-full min-h-[700px] lg:h-[85vh] overflow-hidden rounded-none md:rounded-3xl shadow-2xl border-y border-nexus-gray/50 md:border-0 md:mx-4 md:w-auto mt-20">

      {/* --- 1. FOND VIDÉO YOUTUBE (Technique Cover) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* 
            L'iframe est agrandie pour cacher les bords noirs et les contrôles.
            pointer-events-none empêche de cliquer sur pause/titre.
        */}
        <iframe
            className="absolute top-1/2 left-1/2 w-[300%] h-[150%] min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2 lg:w-[120%] lg:h-[120%]"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1`}
            allow="autoplay; fullscreen"
            title="Background Video"
            style={{ filter: 'brightness(0.6)' }} // Assombrir pour lisibilité texte
        />
      </div>

      {/* 🌑 OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      {/* --- 2. CONTENU (Flexbox Responsive) --- */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12">

        {/* GAUCHE : TEXTE */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0 lg:mb-20">
            <div className="hero-text-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nexus-orange/20 border border-nexus-orange/50 text-nexus-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-nexus-orange animate-pulse"></span>
                Immersion 3D
            </div>

            <h1 className="hero-text-anim text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                EMBTE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-orange to-yellow-500">
                    L'Excellence BTP
                </span>
            </h1>

            <p className="hero-text-anim text-gray-300 text-lg lg:text-xl font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                Nos équipes connectées et nos bureaux d'études travaillent en synergie pour garantir la réussite de vos projets, du plan à la réalité.
            </p>
        </div>

        {/* DROITE : CARTE CONTACT (Ne sera plus coupée) */}
        <div className="contact-card-anim w-full max-w-md lg:w-auto lg:mb-10">
            <div className="bg-nexus-dark/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                
                {/* Effet Glossy */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h3 className="text-white font-bold text-xl">Contact Rapide</h3>
                        <p className="text-nexus-concrete text-xs">Disponible 24/7 pour vos urgences</p>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded-full animate-pulse">
                        <Phone className="text-green-500" size={20}/>
                    </div>
                </div>

                <div className="space-y-5 relative z-10">
                    <ContactRow icon={Phone} text="+221 77 218 74 64" />
                    <ContactRow icon={Phone} text="+221 77 300 20 94" />
                    <ContactRow icon={Mail} text="mou.kone@yahoo.com" />
                    <ContactRow icon={MapPin} text="Rufisque / Dakar" />
                </div>

                <a
                    href="https://wa.me/221772187464"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 relative z-10"
                >
                    <FaWhatsapp size={24} />
                    <span className="font-bold tracking-wide">WhatsApp Direct</span>
                </a>
            </div>
        </div>

      </div>
    </section>
  );
}

// Sous-composant
function ContactRow({ icon: Icon, text }: any) {
    return (
        <div className="flex items-center gap-4 text-gray-200 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 cursor-default">
            <div className="p-2 bg-nexus-orange/20 rounded-lg text-nexus-orange">
                <Icon size={18} />
            </div>
            <span className="font-medium text-sm tracking-wide">{text}</span>
        </div>
    );
}