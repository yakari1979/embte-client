'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, MapPin, Play, Phone, Mail, Instagram, Twitter, Linkedin, Facebook,
  Cpu, Leaf, ShieldCheck, Layers, Ruler 
} from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

import Spline from '@splinetool/react-spline'
import ConstructionAnimation from '@/components/ConstructionAnimation'; 


gsap.registerPlugin(ScrollTrigger);

// DONNÉES PHOTOS
const projects = [
    {
        id: 1,
        title: "Bâtiment Horizon",
        location: "Rufisque, Sénégal",
        category: "Immeuble",
        desc: "Une prouesse architecturale alliant verre et béton armé, défiant les normes de hauteur.",
        img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766767575/img5_h5tl3o.png"
    },
    {
        id: 2,
        title: "Bâtiment",
        location: "Rufisque, Sénégal",
        category: "Immeuble",
        desc: "Autonomie énergétique totale. Intégration paysagère respectueuse de l'environnement côtier.",
        img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774621/img7_y6jvce.png"
    },
    {
        id: 3,
        title: "Bâtiment",
        location: "Rufisque, Sénégal",
        category: "Immeuble",
        desc: "Stade multifonctionnel de 15 000 places avec structure métallique suspendue.",
        img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774806/img8_xsk6pt.jpg"
    },
];

// DONNÉES VIDÉOS
const videos = [
    { id: 1, title: "Chantier avec grues", src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766949019/v12_rg1hpo.mp4", size: "large" },
    { id: 2, title: "Vue aérienne", src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766949175/v13_iuujs7.mp4", size: "small" },
    { id: 3, title: "Construction", src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766949246/v14_wr5ssg.mp4", size: "small" },
    { id: 4, title: "Gros chantier", src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764260/vm5_byglew.mp4", size: "small" },
    { id: 5, title: "Machines action", src: "https://res.cloudinary.com/da72jlau6/video/upload/v1766764274/vm2_lgdxxf.mp4", size: "small" }
];

export default function ProjectsPage() {
  const container = useRef(null);
  const scrollSection = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. INTRO
      const tl = gsap.timeline();
      tl.from(".char-anim", {
        y: 100, opacity: 0, rotationX: -90, stagger: 0.05, duration: 1, ease: "power4.out"
      })
      .from(".desc-anim", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.5");

      // 2. SCROLL HORIZONTAL (Desktop)
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

      // 3. NOUVELLE SECTION 3D (Innovation)
      gsap.from(".innovation-text", {
        scrollTrigger: { trigger: "#innovation-section", start: "top 70%" },
        x: -50, opacity: 0, duration: 1, ease: "power3.out"
      });

      // 4. VIDÉOS REVEAL
      gsap.from(".video-card", {
        scrollTrigger: { trigger: ".video-grid", start: "top 70%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
      });

      // 5. NOUVELLE SECTION STANDARDS (Parallaxe)
      gsap.utils.toArray(".standard-card").forEach((card: any, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top 85%" },
            y: 100, opacity: 0, duration: 0.8, delay: i * 0.2, ease: "back.out(1.5)"
        });
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-nexus-black min-h-screen pt-32 text-nexus-text overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="h-[80vh] flex flex-col justify-center px-4 md:px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nexus-orange/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10">
            <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.9]">
                <div className="overflow-hidden text-nexus-text mb-2">
                    <span className="char-anim inline-block">N</span>
                    <span className="char-anim inline-block">o</span>
                    <span className="char-anim inline-block">s</span>
                </div>
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
        <div className="desc-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent"></div>
            <span className="text-xs uppercase tracking-widest">Scroller</span>
        </div>
      </section>

      {/* 2. GALERIE HORIZONTALE (PROJETS) */}
      <section ref={scrollSection} className="horizontal-wrap h-screen bg-nexus-black relative overflow-hidden hidden lg:flex">
         <div className="flex w-[300%] h-full"> 
            {projects.map((proj, index) => (
                <div key={proj.id} className="project-panel w-screen h-full flex items-center justify-center relative p-10 border-r border-white/5">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
                        style={{ backgroundImage: `url(${proj.img})` }}
                    />
                    <div className="relative z-10 w-full max-w-7xl grid grid-cols-2 gap-12 items-center">
                        <div className="h-[60vh] w-full overflow-hidden rounded-[3rem] shadow-2xl relative group">
                             <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                                style={{ backgroundImage: `url(${proj.img})` }}
                             />
                             <div className="absolute top-6 left-6 bg-nexus-black/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
                                {proj.category}
                             </div>
                        </div>
                        <div>
                            {/* <span className="text-9xl font-black text-nexus-text/5 absolute -top-20 -left-10 z-0">0{index + 1}</span> */}
                            <div className="relative z-10">
                                <h2 className="text-5xl font-bold text-nexus-text mb-6 leading-tight">{proj.title}</h2>
                                <div className="flex items-center gap-2 text-nexus-orange mb-8 font-mono text-sm uppercase">
                                    <MapPin size={16}/> {proj.location}
                                </div>
                                <p className="text-xl text-nexus-concrete leading-relaxed mb-10 border-l border-nexus-gray pl-6">
                                    {proj.desc}
                                </p>
                                <Link href="/contact" className="inline-flex items-center gap-3 bg-nexus-text text-nexus-black px-8 py-4 rounded-full font-bold hover:bg-nexus-orange transition-all hover:scale-105">
                                    Démarrer un projet similaire <ArrowRight size={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </section>

      {/* VERSION MOBILE PROJETS */}
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
                    <h2 className="text-3xl font-bold text-nexus-text mb-2">{proj.title}</h2>
                    <p className="text-nexus-orange text-sm mb-4 flex items-center gap-1"><MapPin size={14}/> {proj.location}</p>
                    <p className="text-nexus-concrete">{proj.desc}</p>
                 </div>
             </div>
         ))}
      </section>


      {/* --- NOUVEAU 1: SECTION INNOVATION & BIM (3D Interactive) --- */}
      <section id="innovation-section" className="py-32 px-4 bg-nexus-dark relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            
            {/* Texte Gauche */}
            <div className="lg:w-1/2 innovation-text z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                   Bureau d'Études 4.0
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-nexus-text mb-6">
                   Conception <br/>
                   <span className="text-nexus-orange">Intelligente</span>
                </h2>
                <p className="text-nexus-concrete text-lg leading-relaxed mb-8">
                   Nous ne laissons rien au hasard. Grâce à la modélisation BIM (Building Information Modeling), nous visualisons chaque détail de votre structure avant même la première pierre.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-nexus-black/50 border border-nexus-gray rounded-xl">
                        <Cpu className="text-blue-500 mb-2"/>
                        <h4 className="font-bold text-nexus-text">Précision Numérique</h4>
                        <p className="text-xs text-nexus-concrete">Zéro erreur structurelle</p>
                    </div>
                    <div className="p-4 bg-nexus-black/50 border border-nexus-gray rounded-xl">
                        <Layers className="text-nexus-orange mb-2"/>
                        <h4 className="font-bold text-nexus-text">Optimisation</h4>
                        <p className="text-xs text-nexus-concrete">Gestion des coûts & matériaux</p>
                    </div>
                </div>
            </div>

            {/* Objet 3D Droite (Spline) */}
            {/* Objet 3D Droite (REMPLACEMENT IMAGE SI BUG) */}
            {/* <div className="lg:w-1/2 h-[500px] w-full relative rounded-3xl overflow-hidden border border-nexus-gray/50 shadow-2xl">
                <Image 
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000"
                    alt="BIM Modeling"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
            </div> */}
            <div className="lg:w-1/2 h-[500px] w-full rounded-3xl overflow-hidden border border-nexus-gray/50 shadow-2xl bg-black">
              <ConstructionAnimation />
            </div>

         </div>
      </section>


      {/* 4. GALERIE VIDÉOS */}
      <section className="py-32 px-4 md:px-10 bg-nexus-black relative border-t border-nexus-gray">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-nexus-text mb-4">Immersion Chantier</h2>
                <p className="text-nexus-concrete text-lg">Plongez au cœur de l'action.</p>
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


      {/* --- NOUVEAU 2: STANDARDS DE QUALITÉ (Cartes Parallaxe) --- */}
      <section className="py-32 px-4 bg-nexus-dark relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-nexus-text">Nos Piliers de Qualité</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StandardCard 
                    icon={ShieldCheck} 
                    title="Sécurité Maximale" 
                    desc="Respect strict des normes QHSE sur tous nos chantiers. Zéro accident est notre objectif quotidien."
                    color="text-green-500"
                />
                <StandardCard 
                    icon={Leaf} 
                    title="Construction Durable" 
                    desc="Utilisation de matériaux éco-responsables et conception bioclimatique adaptée au Sénégal."
                    color="text-green-400"
                />
                <StandardCard 
                    icon={Ruler} 
                    title="Rigueur Technique" 
                    desc="Contrôle qualité à chaque étape : fondation, élévation, finitions. Rien n'est laissé au hasard."
                    color="text-blue-500"
                />
            </div>
         </div>
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

// --- SOUS COMPOSANTS ---

function VideoCard({ video, className }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => { videoRef.current?.play(); setIsPlaying(true); };
    const handleMouseLeave = () => { videoRef.current?.pause(); setIsPlaying(false); };

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
                muted loop playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 transition-all duration-300 ${isPlaying ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <Play className="text-white fill-white ml-1" size={24}/>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-bold uppercase bg-nexus-orange text-white px-2 py-0.5 rounded mb-2 inline-block">Vidéo</span>
                <h3 className="text-white font-bold text-lg leading-tight">{video.title}</h3>
            </div>
        </div>
    )
}

function StandardCard({ icon: Icon, title, desc, color }: any) {
    return (
        <div className="standard-card bg-nexus-black border border-nexus-gray p-8 rounded-3xl hover:border-nexus-orange/50 transition-colors group cursor-default shadow-lg">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-nexus-dark border border-nexus-gray group-hover:bg-nexus-orange group-hover:text-black transition-colors ${color}`}>
                <Icon size={28}/>
            </div>
            <h3 className="text-2xl font-bold text-nexus-text mb-4">{title}</h3>
            <p className="text-nexus-concrete leading-relaxed">
                {desc}
            </p>
        </div>
    );
}