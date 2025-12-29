'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, Home, Building2, Hammer, Ruler, 
  CheckCircle2, ArrowUpRight, Zap, Shield, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook
} from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const solutionsData = [
  {
    id: 1,
    title: "Résidentiel & Villas",
    subtitle: "L'art de vivre moderne",
    description: "Nous concevons des villas d'exception alliant design contemporain et confort thermique. De la fondation aux finitions, nous réalisons votre rêve familial.",
    tags: ["Clé en main", "Écologique", "Design"],
    image: "https://res.cloudinary.com/da72jlau6/image/upload/v1766767530/imgA_x4ttah.jpg", // Belle villa
    icon: <Home className="w-8 h-8 text-white"/>
  },
  {
    id: 2,
    title: "Immobilier Commercial",
    subtitle: "Bureaux & Immeubles R+X",
    description: "Des structures robustes pour les professionnels. Nous optimisons chaque m² pour garantir rentabilité et durabilité à vos investissements locatifs.",
    tags: ["Béton Armé", "Normes ERP", "Rentabilité"],
    image: "https://res.cloudinary.com/da72jlau6/image/upload/v1766767575/img5_h5tl3o.png", // Immeuble verre
    icon: <Building2 className="w-8 h-8 text-white"/>
  },
  {
    id: 3,
    title: "Rénovation & Extension",
    subtitle: "Transformation intégrale",
    description: "Donnez une seconde vie à l'existant. Surélévation, renforcement structurel ou modernisation complète des intérieurs et façades.",
    tags: ["Surélévation", "Façade", "Interieur"],
    image: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774621/img7_y6jvce.png", // Renovation
    icon: <Hammer className="w-8 h-8 text-white"/>
  },
  {
    id: 4,
    title: "Génie Civil & VRD",
    subtitle: "Infrastructures lourdes",
    description: "Terrassement, voiries et réseaux divers. L'expertise technique pour les projets d'envergure nécessitant une logistique industrielle.",
    tags: ["Infrastructure", "Réseaux", "Assainissement"],
    image: "https://res.cloudinary.com/da72jlau6/image/upload/v1766774806/img8_xsk6pt.jpg", // Chantier gros oeuvre
    icon: <Ruler className="w-8 h-8 text-white"/>
  }
];

export default function SolutionsPage() {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animation Header
      gsap.fromTo(".hero-anim", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );

      // Animation Cartes
      gsap.fromTo(".solution-card", 
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: ".solutions-grid", start: "top 80%" }
        }
      );

      // Animation Process
      gsap.fromTo(".process-step", 
        { x: -50, opacity: 0 },
        { 
          x: 0, opacity: 1, duration: 0.6, stagger: 0.2, 
          scrollTrigger: { trigger: ".process-section", start: "top 70%" }
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-nexus-black min-h-screen text-nexus-text overflow-hidden">
      
      {/* 1. HERO HEADER */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-nexus-orange/5 blur-[120px] pointer-events-none rounded-full transform -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
            <span className="hero-anim inline-block py-1 px-3 rounded-full bg-nexus-orange/10  border-nexus-orange/20 text-nexus-orange text-xs font-bold uppercase tracking-widest mb-6">
                Expertise EMBTE
            </span>
            <h1 className="hero-anim text-5xl md:text-7xl font-black mb-6 leading-tight">
                Nous construisons <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-orange to-yellow-500">l'avenir du Sénégal.</span>
            </h1>
            <p className="hero-anim text-xl text-nexus-concrete max-w-2xl mx-auto leading-relaxed">
                Des solutions techniques de pointe pour chaque étape de votre projet, de l'étude de sol à la livraison clé en main.
            </p>
        </div>
      </section>

      {/* 2. GRILLE DES SOLUTIONS (Cartes Interactives) */}
      <section className="solutions-grid px-4 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutionsData.map((item) => (
                <div key={item.id} className="solution-card group relative h-[550px] w-full rounded-[2.5rem] overflow-hidden cursor-default border border-nexus-gray/30">
                    
                    {/* Image de fond avec Zoom au survol */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                    />
                    
                    {/* Overlay Sombre */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Contenu */}
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                        
                        {/* Header Carte */}
                        <div className="mb-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white">
                                {item.icon}
                            </div>
                        </div>

                        {/* Textes Animés (Effet Vertical) */}
                        <div className="transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <p className="text-nexus-orange font-bold uppercase tracking-wider text-sm mb-2">{item.subtitle}</p>
                            <h3 className="text-4xl font-bold text-white mb-4 leading-none">{item.title}</h3>
                            
                            <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    {item.description}
                                </p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white bg-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Link href="/auth/register" className="inline-flex items-center gap-2 bg-nexus-orange text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors">
                                    Démarrer un projet <ArrowUpRight size={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 3. PROCESSUS (La Méthode) */}
      <section className="process-section py-24 bg-nexus-dark border-t border-nexus-gray">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-nexus-text mb-4">Notre Méthode de Travail</h2>
                <p className="text-nexus-concrete max-w-2xl mx-auto text-lg">
                    La rigueur industrielle appliquée à la construction. Un processus transparent en 4 étapes clés.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Ligne connecteur (Desktop) */}
                <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-nexus-gray to-transparent"></div>

                <ProcessCard 
                    step="01" title="Étude & Devis" icon={<FileTextIcon/>}
                    desc="Analyse technique du terrain et chiffrage précis sous 48h."
                />
                <ProcessCard 
                    step="02" title="Planification" icon={<RulerIcon/>}
                    desc="Plans architecturaux, démarches administratives et planning."
                />
                <ProcessCard 
                    step="03" title="Construction" icon={<HardHatIcon/>}
                    desc="Suivi en temps réel via l'application. Rapports quotidiens."
                />
                <ProcessCard 
                    step="04" title="Livraison" icon={<KeyIcon/>}
                    desc="Contrôle qualité rigoureux et remise des clés."
                />
            </div>
        </div>
      </section>

      {/* 4. CTA FINAL */}
      <section className="py-32 px-4 relative text-center">
        <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-nexus-text mb-8">
                Prêt à bâtir ?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/auth/register" className="bg-nexus-text text-nexus-black px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3">
                    <Zap className="fill-current" /> Commencer maintenant
                </Link>
                <Link href="/contact" className="border border-nexus-gray text-nexus-text px-10 py-5 rounded-full font-bold text-xl hover:bg-nexus-dark transition-colors">
                    Nous contacter
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
                    <li className="flex items-center gap-2"><Phone size={16}/> +221 218 74 64</li>
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

function ProcessCard({ step, title, desc, icon }: any) {
    return (
        <div className="process-step relative flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-nexus-black border-4 border-nexus-dark rounded-full flex items-center justify-center mb-6 z-10 shadow-xl group-hover:border-nexus-orange transition-colors duration-300">
                <span className="text-nexus-orange">{icon}</span>
            </div>
            <h4 className="text-xl font-bold text-nexus-text mb-2">{title}</h4>
            <p className="text-nexus-concrete text-sm leading-relaxed">{desc}</p>
            <span className="absolute top-0 text-8xl font-black text-nexus-black select-none -z-10 opacity-50 transform -translate-y-4">{step}</span>
        </div>
    )
}

// Icons simples
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z"/><line x1="14.5" y1="5.5" x2="18.5" y2="9.5"/><line x1="8.5" y1="11.5" x2="12.5" y2="15.5"/><line x1="5.5" y1="14.5" x2="9.5" y2="18.5"/></svg>;
const HardHatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;