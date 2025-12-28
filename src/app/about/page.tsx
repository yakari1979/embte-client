'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Quote, ArrowDown, HardHat, Ruler, Hammer, Building,
  MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook, ShieldCheck
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// --- DONNÉES HERO ---
const heroSlides = [
  {
    id: 1,
    title: "L'Art de Concevoir",
    subtitle: "Architecture & Vision",
    desc: "Chaque ligne tracée est une promesse de durabilité.",
    img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766767575/img5_h5tl3o.png"
  },
  {
    id: 2,
    title: "La Force de Bâtir",
    subtitle: "Génie Civil & Structure",
    desc: "Des fondations solides pour les générations futures.",
    img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766775840/img9_yq6qi6.png"
  },
  {
    id: 3,
    title: "L'Avenir Durable",
    subtitle: "Innovation & Écologie",
    desc: "Intégrer la nature au cœur de nos constructions.",
    img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766767894/img6_wmp3to.jpg"
  }
];

// --- DONNÉES PILIERS (Images locales) ---
const pillars = [
  { id: 1, img: "/images/p4.jpeg", alt: "Pourquoi Nous Choisir", title: "Valeurs" },
  { id: 2, img: "/images/p1.jpeg", alt: "Notre Mission", title: "Mission" },
  { id: 3, img: "/images/p2.jpeg", alt: "Notre Vision", title: "Vision" },
  { id: 4, img: "/images/p3.jpeg", alt: "Notre Engagement", title: "Engagement" },
  
];

// --- DONNÉES ÉQUIPE ---
const team = [
  { name: "Saliou Diop", role: "Chef de Chantier", img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766768346/equip1_bovszs.jpg", icon: HardHat },
  { name: "Fatou Ndiaye", role: "Architecte Senior", img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766947900/WhatsApp_Image_2025-12-28_at_17.33.21_clbzs9.jpg", icon: Ruler },
  { name: "Jean Gomis", role: "Chef de Projet", img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766948300/WhatsApp_Image_2025-12-28_at_17.33.22_cdlpzl.jpg", icon: Hammer },
  { name: "Aminata Sow", role: "Responsable QSE", img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766948390/WhatsApp_Image_2025-12-28_at_17.33.22_1_s6wma3.jpg", icon: ShieldCheck },
  // { name: "Ibrahima Fall", role: "Ingénieur Structure", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800", icon: Building },
];

export default function AboutPage() {
  const container = useRef(null);
  const slidesRefs = useRef<HTMLDivElement[]>([]);
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !slidesRefs.current.includes(el)) slidesRefs.current.push(el);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ANIMATION HERO
      const swiperEl = document.querySelector('.swiper') as any;
      if(swiperEl && slidesRefs.current.length > 0) {
          gsap.set(slidesRefs.current[0].children, { opacity: 0, y: 50 });
          gsap.to(slidesRefs.current[0].children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 });

          swiperEl.swiper.on('slideChangeTransitionStart', () => {
            slidesRefs.current.forEach((slide) => gsap.set(slide.children, { opacity: 0, y: 50 }));
            const currentSlide = slidesRefs.current[swiperEl.swiper.realIndex];
            if(currentSlide) gsap.to(currentSlide.children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 });
          });
      }

      // PILLARS STACKING
      const cards = gsap.utils.toArray(".pillar-card");
      cards.forEach((card: any, index) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card, start: "top top", end: "bottom top",
            scrub: true, pin: true, pinSpacing: false,
          },
          scale: 1 - (cards.length - index) * 0.02,
          opacity: 1,
        });
      });

      // TEAM REVEAL (Animation plus douce pour éviter les bugs)
      gsap.fromTo(".team-member", 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          scrollTrigger: { 
            trigger: "#team-section", 
            start: "top 85%" 
          } 
        }
      );

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-nexus-black min-h-screen text-nexus-text overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect={'fade'}
          speed={1500}
          loop={true}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full bg-black">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.img})` }} />
              <div className="absolute inset-0 bg-black/60"></div>
              <div ref={addToRefs} className="absolute inset-0 flex items-center px-6 md:px-20 z-10">
                <div className="max-w-4xl">
                  <p className="text-nexus-orange font-bold uppercase tracking-[0.3em] mb-4">{slide.subtitle}</p>
                  <h1 className="text-5xl md:text-8xl font-black text-white mb-6">{slide.title}</h1>
                  <p className="text-gray-200 text-lg md:text-2xl border-l-4 border-nexus-orange pl-6">{slide.desc}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. CEO SECTION */}
      <section id="ceo-section" className="py-32 px-4 bg-nexus-black relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] lg:text-[20rem] font-black text-nexus-text opacity-5 pointer-events-none leading-none -translate-y-1/2 translate-x-1/4 select-none">CEO</div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative group">
              <div className="relative h-[500px] md:h-[700px] w-full rounded-2xl overflow-hidden border border-nexus-gray/50 shadow-2xl">
                <img src="https://res.cloudinary.com/da72jlau6/image/upload/v1766767049/ime3_vqgfxo.jpg" alt="CEO" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute bottom-8 left-8 z-20 text-white">
                  <p className="text-nexus-orange font-bold uppercase text-sm">Directeur Général</p>
                  <h3 className="text-4xl font-black">Mamadou Kone</h3>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
                <Quote className="text-nexus-orange w-16 h-16 opacity-20" />
                <h2 className="text-4xl font-bold">Le mot du Président</h2>
                <p className="text-lg text-justify font-light leading-relaxed">
                   Chers partenaires, EMBTE évolue avec une ambition claire : proposer des réalisations solides et durables. Notre force repose sur une équipe qualifiée capable de répondre aux exigences techniques les plus complexes.
                </p>
                <p className="font-script text-4xl text-nexus-orange">Mamadou Kone</p>
            </div>
        </div>
      </section>

      {/* 3. SECTION PILIERS (SÉPARÉE) */}
      <div className="bg-nexus-black pt-20">
        <div className="text-center mb-10">
            <h2 className="text-nexus-orange font-bold tracking-widest uppercase">Nos Fondements</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mt-2">Les Piliers d'EMBTE</h3>
        </div>
        {pillars.map((pillar, index) => (
            <section key={pillar.id} className="pillar-card h-screen sticky top-0 flex items-center justify-center bg-nexus-black">
                <div className="relative w-full max-w-5xl h-[75vh] mx-4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-nexus-dark">
                    <Image src={pillar.img} alt={pillar.alt} fill className="object-contain md:object-cover" priority />
                    <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-6 py-3 rounded-xl border border-nexus-orange/30">
                        <span className="text-nexus-orange font-bold mr-3">0{index + 1}</span>
                        <span className="text-white font-bold uppercase tracking-widest">{pillar.title}</span>
                    </div>
                </div>
            </section>
        ))}
      </div>

      <div className="h-32 bg-gradient-to-b from-nexus-black to-nexus-dark"></div>

      {/* 4. SECTION ÉQUIPE (CORRIGÉE POUR AFFICHAGE PARTOUT) */}
      <section id="team-section" className="py-24 px-4 bg-nexus-dark relative z-20">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">L'Équipe d'Excellence</h2>
            <p className="text-nexus-concrete text-lg">Des experts passionnés à votre service.</p>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 min-h-[500px]">
            {team.map((member, idx) => (
                <div 
                    key={idx} 
                    className="team-member relative overflow-hidden rounded-2xl group
                               h-[450px] md:h-[600px] flex-1 md:hover:flex-[3] transition-all duration-700 ease-in-out cursor-pointer"
                >
                    {/* UTILISATION DE <img> POUR ÉVITER L'ERREUR FETCH NEXT.JS */}
                    <img 
                        src={member.img} 
                        alt={member.name} 
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="bg-nexus-orange text-black p-2 w-fit rounded-lg mb-3">
                            <member.icon size={20}/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-nexus-orange font-bold uppercase text-xs tracking-widest">
                            {member.role}
                        </p>
                    </div>
                </div>
            ))}
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