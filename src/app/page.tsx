'use client';

import React, { useRef, useLayoutEffect, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, Ruler, Truck, ShieldCheck, MapPin, 
  Handshake, Building2, Hammer, HardHat, Briefcase,Phone, Mail, Facebook, Linkedin, Twitter, Instagram, 
} from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { motion } from "framer-motion";
import PartnersSection from '@/components/PartnersSection';
import TestimonialsSection from '@/components/TestimonialsSection';


gsap.registerPlugin(ScrollTrigger);

// --- DONNÉES PARTENAIRES ---
const partners = [
  { name: "Ciment du Sahel", icon: Building2 },
  { name: "Senelec", icon: Handshake },
  { name: "État du Sénégal", icon: ShieldCheck },
  { name: "Orabank", icon: Briefcase },
  { name: "Sococim", icon: Hammer },
  { name: "Orange Business", icon: MapPin },
];

export default function LandingPage() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. HERO
      gsap.fromTo(".hero-text", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );

      // 2. SERVICES
      const cards = gsap.utils.toArray(".service-card");
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, 
          scrollTrigger: { trigger: "#services", start: "top 90%" }
        }
      );

      // 3. PROJETS
      const projects = gsap.utils.toArray(".project-card");
      gsap.fromTo(projects,
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, opacity: 1, duration: 0.8, stagger: 0.2,
          scrollTrigger: { trigger: "#projets", start: "top 85%" }
        }
      );

      // 4. PARTENAIRES (MARQUEE INFINI GAUCHE -> DROITE)
      // On déplace le track de -50% (moitié) vers 0% en boucle
      gsap.fromTo(".partner-track", 
        { xPercent: -50 },
        { 
          xPercent: 0, 
          repeat: -1, 
          duration: 30, // Vitesse (plus c'est haut, plus c'est lent)
          ease: "linear" 
        }
      );

    }, mainRef);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <main ref={mainRef} className="bg-nexus-black min-h-screen text-nexus-text overflow-x-hidden selection:bg-nexus-orange selection:text-black transition-colors duration-300">
      
      {/* --- SECTION 1: HERO --- */}
<section className="relative h-screen flex flex-col lg:flex-row items-center pt-20 overflow-hidden">

{/* 🖼️ IMAGE DE FOND */}
{/* 🖼️ IMAGE DE FOND */}
<Image
    src="https://res.cloudinary.com/da72jlau6/image/upload/v1766767530/imgA_x4ttah.jpg"
    alt="Chantier moderne"
    fill
    priority
    className="object-cover"
  />

{/* 🌑 OVERLAY sombre */}
<div className="absolute inset-0 bg-black/60" />

{/* ✨ LUMIÈRE / GLOW */}
<div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-nexus-orange/20 rounded-full blur-[160px]" />

{/* --- IMAGE 3D DROITE --- */}
<div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full z-10 flex items-center justify-center order-2 [perspective:1200px]">
  <motion.div
    initial={{ scale: 0.6, rotateX: 35, rotateY: -25, z: -300, opacity: 0 }}
    animate={{ scale: 0.85, rotateX: 0, rotateY: 0, z: 0, opacity: 1 }}
    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    className="relative max-w-[520px]"
    style={{ transformStyle: "preserve-3d" }}
  >
    <Image
      src="/images/img2.jpg"
      alt="Interface de la plateforme"
      width={720}
      height={480}
      priority
      className="rounded-2xl object-cover shadow-2xl shadow-black/40 border border-nexus-gray/50"
    />
  </motion.div>
</div>

{/* --- CONTENU GAUCHE --- */}
<div className="relative w-full lg:w-1/2 px-8 lg:pl-24 z-10 flex flex-col justify-center h-full  lg:order-1">
  
  <div className="hero-text opacity-0 mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-nexus-orange/30 bg-nexus-orange/10 w-fit">
    <span className="w-2 h-2 rounded-full bg-nexus-orange animate-pulse"/>
    <span className="text-xs font-bold text-nexus-orange uppercase tracking-wider">
      Innovation BTP
    </span>
  </div>

  <h1 className="hero-text opacity-0 text-5xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
    Construisons <br/>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-orange to-yellow-500">
      L'Impossible
    </span>
  </h1>

  <p className="hero-text opacity-0 text-lg text-nexus-concrete max-w-lg mb-8 leading-relaxed">
    Avec l'entreprise moderne de bâtiments et travaux d'étude.
    La plateforme qui connecte vos chantiers.
  </p>

  <div className="hero-text opacity-0 flex gap-4">
    <Link
      href="/auth/register"
      className="bg-nexus-orange text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-nexus-orange/30"
    >
      Commencer <ArrowRight size={20}/>
    </Link>

    <Link
      href="#projets"
      className="px-8 py-4 rounded-xl font-bold text-lg border border-white/30 hover:bg-white/10 transition-colors text-white"
    >
      Nos Projets
    </Link>
  </div>
</div>

</section>



      {/* --- SECTION 2: CHIFFRES CLÉS --- */}
      <section id="stats" className="py-20 border-y border-nexus-gray bg-nexus-dark/30">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <AnimatedStat value="15" suffix="+" label="Années d'expérience" />
            <AnimatedStat value="320" suffix="" label="Projets Livrés" />
            <AnimatedStat value="50" suffix="+" label="Partenaires" />
            <AnimatedStat value="100" suffix="%" label="Satisfaction" />
        </div>
      </section>


      {/* --- SECTION 3: SERVICES --- */}
      <section id="services" className="py-24 px-6 bg-nexus-black relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-nexus-orange font-bold uppercase tracking-widest text-sm">Ce que nous faisons</span>
            <h2 className="text-3xl lg:text-5xl font-bold mt-2 mb-4 text-nexus-text">Une expertise complète</h2>
            <p className="text-nexus-concrete max-w-2xl mx-auto">De la conception 3D à la remise des clés, nous digitalisons chaque étape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Ruler className="text-nexus-orange"/>} 
              title="Architecture & BIM" 
              desc="Conception assistée par ordinateur et modélisation 3D pour des plans sans erreur." 
            />
            <ServiceCard 
              icon={<Truck className="text-blue-500"/>} 
              title="Logistique Chantier" 
              desc="Suivi GPS des matériaux, gestion des stocks et optimisation des approvisionnements." 
            />
            <ServiceCard 
              icon={<ShieldCheck className="text-green-500"/>} 
              title="Contrôle Qualité" 
              desc="Rapports journaliers automatisés et conformité aux normes internationales." 
            />
          </div>
        </div>
      </section>


      {/* --- SECTION 4: RÉALISATIONS --- */}
      <section id="projets" className="py-24 px-6 bg-nexus-dark border-t border-nexus-gray">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
             <div>
                <h2 className="text-3xl lg:text-5xl font-bold mb-2 text-nexus-text">Nos Réalisations</h2>
                <p className="text-nexus-concrete">Découvrez nos derniers chantiers livrés.</p>
             </div>
             <button className="text-nexus-orange font-bold hover:underline flex items-center gap-2">
                Voir tout le portfolio <ArrowRight size={18}/>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <ProjectCard 
                title="Tour Horizon" 
                location="Dakar, Sénégal" 
                category="Résidentiel"
                img="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800"
             />
             <ProjectCard 
                title="Bâtiment de l'Avenir" 
                location="Rufisque, Sénégal" 
                category="Infrastructures"
                img="https://res.cloudinary.com/da72jlau6/image/upload/v1766767530/imgA_x4ttah.jpg"
             />
             <ProjectCard 
                title="Bâtiment Terminé" 
                location="Rufisque, Sénégal" 
                category="Industriel"
                img="https://res.cloudinary.com/da72jlau6/image/upload/v1766767575/img5_h5tl3o.png"
             />
          </div>
        </div>
      </section>

      {/* --- SECTION 5: PARTENAIRES --- */}
      <PartnersSection />

      {/* --- SECTION 6: TÉMOIGNAGES (NOUVEAU) --- */}
      <TestimonialsSection />


      {/* --- SECTION 7: CTA --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-nexus-orange/5"></div>
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-nexus-text">Prêt à démarrer ?</h2>
            <p className="text-xl text-nexus-concrete mb-10">
                Rejoignez les leaders du BTP qui utilisent Nexus pour livrer leurs chantiers dans les temps.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register" className="inline-flex items-center justify-center gap-3 bg-nexus-text text-nexus-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
                    Créer un compte Client
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 border border-nexus-gray text-nexus-text px-8 py-4 rounded-xl font-bold text-lg hover:bg-nexus-gray/50 transition-colors">
                    Demander un devis
                </Link>
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
    </main>
  );
}

// --- SOUS-COMPOSANTS ---

function AnimatedStat({ value, suffix, label }: { value: string, suffix: string, label: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const targetValue = parseInt(value, 10);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.fromTo(el, 
                    { innerText: 0 }, 
                    { innerText: targetValue, duration: 2, snap: { innerText: 1 }, ease: "power2.out" }
                );
            }
        });
    }, [targetValue]);

    return (
        <div className="stat-item">
            <div className="text-4xl lg:text-5xl font-black text-nexus-text mb-2 flex justify-center items-baseline">
                <span ref={ref}>0</span>
                <span>{suffix}</span>
            </div>
            <p className="text-nexus-concrete text-sm uppercase tracking-wider font-semibold">{label}</p>
        </div>
    );
}

function ServiceCard({ icon, title, desc }: any) {
  return (
    <div className="service-card opacity-0 p-8 rounded-2xl bg-nexus-dark border border-nexus-gray hover:border-nexus-orange/50 transition-all hover:-translate-y-2 group cursor-default">
      <div className="mb-6 p-4 bg-nexus-black rounded-xl w-fit group-hover:scale-110 transition-transform shadow-lg">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-xl font-bold mb-3 text-nexus-text">{title}</h3>
      <p className="text-nexus-concrete leading-relaxed">
        {desc}
      </p>
    </div>
  )
}

function ProjectCard({ title, location, category, img }: any) {
    return (
        <div className="project-card opacity-0 group relative h-80 rounded-2xl overflow-hidden bg-gray-800 cursor-pointer border border-nexus-gray">
            <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110`} style={{ backgroundImage: `url(${img})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute bottom-6 left-6 z-10">
                <span className="text-nexus-orange text-xs font-bold uppercase mb-1 block tracking-wider">{category}</span>
                <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                <p className="text-gray-300 text-sm flex items-center gap-1"><MapPin size={12}/> {location}</p>
            </div>
        </div>
    )
}