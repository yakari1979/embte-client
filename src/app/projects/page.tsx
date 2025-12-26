'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Play, Pause, Phone, Mail, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

// DONNÉES PHOTOS (4 Projets Phares)
const projects = [
    {
        id: 1,
        title: "Bâtiment Horizon",
        location: "Rufisque, Sénégal",
        category: "Immeuble R+12",
        desc: "Une prouesse architecturale alliant verre et béton armé, défiant les normes de hauteur.",
        img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766767575/img5_h5tl3o.png"
    },
    {
        id: 2,
        title: "Bâtiment",
        location: "Rufisque, Sénégal",
        category: "Résidentiel Écologique",
        desc: "Autonomie énergétique totale. Intégration paysagère respectueuse de l'environnement côtier.",
        img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774621/img7_y6jvce.png"
    },
    {
        id: 3,
        title: "Bâtiment",
        location: "Rufisque, Sénégal",
        category: "Infrastructure Public",
        desc: "Stade multifonctionnel de 15 000 places avec structure métallique suspendue.",
        img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774806/img8_xsk6pt.jpg"
    },
  {
    id: 2,
    title: "Villa Solaire",
    location: "Saly Portudal",
    category: "Résidentiel Écologique",
    desc: "Autonomie énergétique totale. Intégration paysagère respectueuse de l'environnement côtier.",
    img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774621/img7_y6jvce.png"
  },
  {
    id: 3,
    title: "Complexe Sportif",
    location: "Diamniadio",
    category: "Infrastructure Public",
    desc: "Stade multifonctionnel de 15 000 places avec structure métallique suspendue.",
    img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774806/img8_xsk6pt.jpg"
  },

];

// DONNÉES VIDÉOS (liens Pexels HD stables)
const videos = [
    { 
      id: 1, 
      title: "chantier avec grues et ouvriers", 
      // Vue aérienne d’un chantier en activité
      src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764274/vm6_q7egy9.mp4", 
      size: "large"
    },
    { 
      id: 2, 
      title: "Vue aérienne chantier et grues", 
      // Grues et machines en mouvement
      src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764261/vm3_zzebxi.mp4",
      size: "small"
    },
    { 
      id: 3, 
      title: "Chantier construction bâtiments", 
      // Ouvriers et équipements de construction
      src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764262/vm4_nrqiqd.mp4",
      size: "small"
    },
    { 
      id: 4, 
      title: "Vue aérienne gros chantier urbain", 
      // Vidéo drone d’un grand chantier
      src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764260/vm5_byglew.mp4",
      size: "small"
    },
    { 
      id: 5, 
      title: "Machines de construction en action", 
      // Travaux avec engins et grues
      src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764274/vm2_lgdxxf.mp4",
      size: "small"
    }
  ];
  

export default function ProjectsPage() {
  const container = useRef(null);
  const scrollSection = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. INTRO TEXTE (Lettre par lettre style)
      const tl = gsap.timeline();
      tl.from(".char-anim", {
        y: 100, opacity: 0, rotationX: -90, stagger: 0.05, duration: 1, ease: "power4.out"
      })
      .from(".desc-anim", {
        y: 20, opacity: 0, duration: 1, ease: "power2.out"
      }, "-=0.5");

      // 2. SCROLL HORIZONTAL (LA MAGIE)
      // Sur desktop uniquement
      if (window.innerWidth > 1024) {
          const sections = gsap.utils.toArray(".project-panel");
          gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: scrollSection.current,
              pin: true,
              scrub: 1,
              snap: 1 / (sections.length - 1),
              end: () => "+=" + (document.querySelector(".horizontal-wrap")?.scrollWidth || 0),
            }
          });
      }

      // 3. VIDÉOS REVEAL
      gsap.from(".video-card", {
        scrollTrigger: { trigger: ".video-grid", start: "top 70%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-nexus-black min-h-screen pt-32 text-nexus-text overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="h-[80vh] flex flex-col justify-center px-4 md:px-20 relative overflow-hidden">
        {/* Fond texturé */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nexus-orange/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10">
            <p className="desc-anim text-nexus-orange font-bold tracking-[0.2em] mb-4 uppercase">
                Portfolio 2024-2025
            </p>
            <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.9]">
                {/* Ligne 1 : NOS */}
                <div className="overflow-hidden text-nexus-tex mb-2">
                    <span className="char-anim inline-block">N</span>
                    <span className="char-anim inline-block">o</span>
                    <span className="char-anim inline-block">s</span>
                </div>
                
                {/* Ligne 2 : RÉALISATIONS */}
                {/* CORRECTION : On retire 'text-transparent bg-clip-text...' qui causait le bug.
                    On met une couleur solide stylée (Gris texturé ou Orange). */}
                <div className="overflow-hidden text-nexus-concrete"> 
                    <span className="char-anim inline-block">R</span>
                    <span className="char-anim inline-block">é</span>
                    <span className="char-anim inline-block">a</span>
                    <span className="char-anim inline-block">l</span>
                    <span className="char-anim inline-block">i</span>
                    <span className="char-anim inline-block">s</span>
                    <span className="char-anim inline-block">a</span>
                    <span className="char-anim inline-block">t</span>
                    <span className="char-anim inline-block">i</span>
                    <span className="char-anim inline-block">o</span>
                    <span className="char-anim inline-block">n</span>
                    <span className="char-anim inline-block">s</span>
                </div>
            </h1>
            <p className="desc-anim text-nexus-concrete text-xl md:text-2xl mt-8 max-w-2xl leading-relaxed border-l-4 border-nexus-orange pl-6">
                Chaque projet est une signature. Découvrez comment nous transformons le béton brut en espaces de vie durables et inspirants.
            </p>
        </div>

        {/* Scroll Indicator */}
        <div className="desc-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent"></div>
            <span className="text-xs uppercase tracking-widest">Scroller</span>
        </div>
      </section>


      {/* 2. GALERIE HORIZONTALE (4 PHOTOS) */}
      <section ref={scrollSection} className="horizontal-wrap h-screen bg-nexus-black relative overflow-hidden hidden lg:flex">
         <div className="flex w-[400%] h-full">
            {projects.map((proj, index) => (
                <div key={proj.id} className="project-panel w-screen h-full flex items-center justify-center relative p-10 border-r border-white/5">
                    {/* Background Image Flou */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
                        style={{ backgroundImage: `url(${proj.img})` }}
                    />
                    
                    <div className="relative z-10 w-full max-w-7xl grid grid-cols-2 gap-12 items-center">
                        {/* Image Principale */}
                        <div className="h-[60vh] w-full overflow-hidden rounded-[3rem] shadow-2xl relative group">
                             <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                                style={{ backgroundImage: `url(${proj.img})` }}
                             />
                             <div className="absolute top-6 left-6 bg-nexus-black/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
                                {proj.category}
                             </div>
                        </div>

                        {/* Texte */}
                        <div>
                            <span className="text-9xl font-black text-white/5 absolute -top-20 -left-10 z-0">0{index + 1}</span>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-bold text-white mb-6 leading-tight">{proj.title}</h2>
                                <div className="flex items-center gap-2 text-nexus-orange mb-8 font-mono text-sm uppercase">
                                    <MapPin size={16}/> {proj.location}
                                </div>
                                <p className="text-xl text-nexus-concrete leading-relaxed mb-10 border-l border-white/20 pl-6">
                                    {proj.desc}
                                </p>
                                <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-nexus-orange transition-all hover:scale-105">
                                    Démarrer un projet similaire <ArrowRight size={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </section>

      {/* VERSION MOBILE (Empilée) pour les photos */}
      <section className="lg:hidden px-4 py-20 space-y-20">
         {projects.map((proj, index) => (
             <div key={proj.id} className="space-y-6">
                 <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden relative shadow-xl">
                    <img src={proj.img} alt={proj.title} className="w-full h-full object-cover"/>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-white font-bold border border-white/10">
                        {proj.category}
                    </div>
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{proj.title}</h2>
                    <p className="text-nexus-orange text-sm mb-4 flex items-center gap-1"><MapPin size={14}/> {proj.location}</p>
                    <p className="text-nexus-concrete">{proj.desc}</p>
                 </div>
             </div>
         ))}
      </section>


      {/* 3. GALERIE VIDÉOS (Bento Grid) */}
      <section className="py-32 px-4 md:px-10 bg-nexus-dark relative border-t border-nexus-gray">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Immersion Chantier</h2>
                <p className="text-nexus-concrete text-lg">Plongez au cœur de l'action. Nos équipes en mouvement.</p>
            </div>

            <div className="video-grid grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                {videos.map((video, index) => (
                    <VideoCard 
                        key={video.id} 
                        video={video} 
                        className={index === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"}
                    />
                ))}
            </div>
         </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-20 bg-nexus-orange text-black text-center">
          <h2 className="text-4xl md:text-6xl text-white font-black mb-8">Convaincu ?</h2>
          <Link href="/auth/register" className="inline-block bg-white text-nexus-orange px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
             Lancer mon chantier
          </Link>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-nexus-dark border-t border-nexus-gray pt-16 pb-8 px-6 text-nexus-concrete">
         <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
                <h3 className="text-2xl font-bold text-nexus-text mb-4">EM<span className="text-nexus-orange">BTE</span></h3>
                <p className="text-sm leading-relaxed">
                    La solution n°1 pour la digitalisation des chantiers en Afrique de l'Ouest.
                </p>
            </div>
              {/* dejas fait */}
            <div>
                <h4 className="text-white font-bold mb-4">Liens Rapides</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:text-nexus-orange">À Propos</Link></li>
                    <li><Link href="/solutions" className="hover:text-nexus-orange">Nos Services</Link></li>
                    <li><Link href="/contact" className="hover:text-nexus-orange">Contacter Nous</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Légal</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/legal" className="hover:text-nexus-orange">Mentions Légales</Link></li>
                    <li><Link href="/privacy" className="hover:text-nexus-orange">Politique de Confidentialité</Link></li>
                    <li><Link href="/cgv" className="hover:text-nexus-orange">CGV</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Contact</h4>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><MapPin size={16}/> Dakar, Sénégal</li>
                    <li className="flex items-center gap-2"><Phone size={16}/> +221 33 800 00 00</li>
                    <li className="flex items-center gap-2"><Mail size={16}/> contact@nexusbtp.sn</li>
                </ul>
            </div>
         </div>
          <div className="container mx-auto border-t border-[var(--nexus-gray)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">

            {/* Texte à gauche */}
            <p className="text-[var(--nexus-concrete)] text-center md:text-left flex flex-wrap items-center gap-1">
              © 2025
              <span className="text-[var(--nexus-text)] font-semibold">
                Nexus EMBTE
              </span>.
              Tous droits réservés.
              Code with ❤️ by
              <a
                href="https://ton-lien-epso.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  ml-1 px-3 py-1 rounded-full font-semibold
                  text-white
                  bg-gradient-to-r
                  from-[var(--nexus-orange)]
                  to-blue-600
                  hover:to-blue-700
                  transition-all
                  shadow-md
                "
              >
                EPSO
              </a>
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">

              <a
                href="#"
                aria-label="Facebook"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Linkedin size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Twitter size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Instagram size={18} />
              </a>

              <a
                href="mailto:contact@nexusembte.com"
                aria-label="Gmail"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Mail size={18} />
              </a>

            </div>
          </div>
      </footer>

    </div>
  );
}

// --- COMPOSANT VIDEO CARD ---
function VideoCard({ video, className }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        videoRef.current?.play();
        setIsPlaying(true);
    };

    const handleMouseLeave = () => {
        videoRef.current?.pause();
        setIsPlaying(false);
    };

    return (
        <div 
            className={`video-card relative rounded-3xl overflow-hidden cursor-pointer group border border-white/5 ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video 
                ref={videoRef}
                src={video.src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted
                loop
                playsInline
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>

            {/* Bouton Play Central */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 transition-all duration-300 ${isPlaying ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <Play className="text-white fill-white ml-1" size={24}/>
            </div>

            {/* Infos Bas */}
            <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-bold uppercase bg-nexus-orange text-black px-2 py-0.5 rounded mb-2 inline-block">
                    Vidéo
                </span>
                <h3 className="text-white font-bold text-lg leading-tight">{video.title}</h3>
            </div>
        </div>
    )
}