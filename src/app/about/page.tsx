'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Quote, Target, Eye, ShieldCheck, 
  ArrowDown, HardHat, Ruler, Hammer, Building, ArrowRight, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

// --- DONNÉES HERO (Slider) ---
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

export default function AboutPage() {
  const container = useRef(null);

  // --- GSAP : Texte par slide ---
  const slidesRefs = useRef<HTMLDivElement[]>([]);
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !slidesRefs.current.includes(el)) {
      slidesRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // === ANIMATIONS HERO SLIDER ===
      slidesRefs.current.forEach((slide) => {
        gsap.set(slide.children, { opacity: 0, y: 50 });
      });

      const swiperEl = document.querySelector('.swiper') as any;

      // Premier slide
      gsap.to(slidesRefs.current[0].children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
      });

      swiperEl.swiper.on('slideChangeTransitionStart', () => {
        slidesRefs.current.forEach((slide) => {
          gsap.set(slide.children, { opacity: 0, y: 50 });
        });

        const currentIndex = swiperEl.swiper.realIndex;
        const currentSlide = slidesRefs.current[currentIndex];

        gsap.to(currentSlide.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.2,
        });
      });

      // === ANIMATIONS PILIERS (STACKING CARDS) ===
      const cards = gsap.utils.toArray(".value-card");
      cards.forEach((card: any, index) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card, start: "top top", end: "bottom top",
            scrub: true, pin: true, pinSpacing: false,
          },
          scale: 1 - (cards.length - index) * 0.05,
          opacity: 1 - (cards.length - index) * 0.1,
        });
      });

      // === CEO ===
      gsap.from(".ceo-image-container", {
        scrollTrigger: { trigger: "#ceo-section", start: "top 70%" },
        scale: 1.2, duration: 1.5, ease: "power2.out"
      });
      gsap.from(".ceo-text p", {
        scrollTrigger: { trigger: "#ceo-section", start: "top 60%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
      });

      // === TEAM ===
      gsap.fromTo(".team-member", 
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1,
          stagger: 0.1, duration: 0.8, ease: "back.out(1.7)",
          scrollTrigger: { trigger: "#team-section", start: "top 80%" }
        }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-nexus-black min-h-screen text-nexus-text overflow-x-hidden">

      {/* ------------------------------------------------------- */}
      {/* 1. HERO SECTION (SLIDER) */}
      <section className="relative h-screen w-full">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          speed={1500}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) =>
              '<span class="' + className + ' bg-nexus-orange"></span>'
          }}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full bg-black">
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear scale-100 hover:scale-110"
                style={{ backgroundImage: `url(${slide.img})` }}
              />
              <div className="absolute inset-0 bg-black/70"></div>

              {/* Texte */}
              <div ref={addToRefs} className="absolute inset-0 flex items-center px-6 md:px-20 z-10">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-[2px] w-12 bg-nexus-orange"></div>
                    <p className="text-nexus-orange font-bold uppercase tracking-[0.3em] text-sm md:text-base">{slide.subtitle}</p>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">{slide.title}</h1>
                  <p className="text-gray-200 text-lg md:text-2xl font-light border-l-4 border-nexus-orange pl-6 leading-relaxed max-w-2xl">{slide.desc}</p>
                </div>
              </div>

              <div className="absolute top-10 right-10 text-9xl font-black text-white/5 select-none pointer-events-none">0{index + 1}</div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs uppercase tracking-widest text-white/70">Scroller</span>
          <ArrowDown className="text-nexus-orange" size={24}/>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* 2. PILIERS (MISSION, VISION, ENGAGEMENT) */}
      <div className="py-20 bg-nexus-black">
        {/* CARTE 1 */}
        <section className="value-card h-screen sticky top-0 flex items-center justify-center bg-nexus-dark border-t border-nexus-gray/30 shadow-2xl">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 items-center">
            <div className="order-2 md:order-1">
              <Target size={64} className="text-nexus-orange mb-6"/>
              <h2 className="text-5xl md:text-7xl font-black mb-6 text-nexus-text">Notre <br/>Mission</h2>
              <div className="h-1 w-20 bg-nexus-orange mb-8"></div>
              <p className="text-xl md:text-2xl text-nexus-concrete leading-relaxed">
                Fournir des constructions de qualité – maisons, immeubles et cités – qui répondent aux besoins de nos clients, dans le respect des normes de sécurité, de durabilité et de performance.
              </p>
            </div>
            <div className="order-1 md:order-2 h-[300px] md:h-[400px] bg-[url('https://res.cloudinary.com/da72jlau6/image/upload/v1766775840/img9_yq6qi6.png')] bg-cover bg-center rounded-3xl opacity-90 transition-all duration-700"></div>
          </div>
        </section>

        {/* CARTE 2 */}
        <section className="value-card h-screen sticky top-0 flex items-center justify-center bg-nexus-black border-t border-nexus-gray/30 shadow-2xl">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 items-center">
            <div className="order-2 md:order-1">
              <Eye size={64} className="text-blue-500 mb-6"/>
              <h2 className="text-5xl md:text-7xl font-black mb-6 text-nexus-text">Notre <br/>Vision</h2>
              <div className="h-1 w-20 bg-blue-500 mb-8"></div>
              <p className="text-xl md:text-2xl text-nexus-concrete leading-relaxed">
                Devenir une référence nationale dans le secteur du BTP, reconnue pour la qualité, la fiabilité et l’innovation dans la construction de bâtiments durables et modernes.
              </p>
            </div>
            <div className="order-1 md:order-2 h-[300px] md:h-[400px] bg-[url('https://res.cloudinary.com/da72jlau6/image/upload/v1766767894/img6_wmp3to.jpg')] bg-cover bg-center rounded-3xl opacity-90 transition-all duration-700"></div>
          </div>
        </section>

        {/* CARTE 3 */}
        <section className="value-card h-screen sticky top-0 flex items-center justify-center bg-nexus-dark border-t border-nexus-gray/30 shadow-2xl">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 items-center">
            <div className="order-2 md:order-1">
              <ShieldCheck size={64} className="text-green-500 mb-6"/>
              <h2 className="text-5xl md:text-7xl font-black mb-6 text-nexus-text">Notre <br/>Engagement</h2>
              <div className="h-1 w-20 bg-green-500 mb-8"></div>
              <ul className="space-y-6 text-xl text-nexus-concrete">
                <li className="flex gap-4"><div className="w-2 h-2 mt-3 bg-green-500 rounded-full"/> Respecter scrupuleusement délais et budgets.</li>
                <li className="flex gap-4"><div className="w-2 h-2 mt-3 bg-green-500 rounded-full"/> Garantir la sécurité et la solidité des ouvrages.</li>
                <li className="flex gap-4"><div className="w-2 h-2 mt-3 bg-green-500 rounded-full"/> Intégrer des solutions écologiques.</li>
                <li className="flex gap-4"><div className="w-2 h-2 mt-3 bg-green-500 rounded-full"/> Maintenir un suivi client humain et pro.</li>
              </ul>
            </div>
            <div className="order-1 md:order-2 h-[300px] md:h-[400px] bg-[url('https://res.cloudinary.com/da72jlau6/image/upload/v1766768200/grp_zqtlq4.jpg')] bg-cover bg-center rounded-3xl opacity-90 transition-all duration-700"></div>
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 3. CEO */}
      <section id="ceo-section" className="py-32 px-4 bg-nexus-black relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] lg:text-[20rem] font-black text-nexus-text opacity-5 pointer-events-none leading-none -translate-y-1/2 translate-x-1/4 select-none">
          CEO
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative group">
              <div className="ceo-image-container relative h-[500px] md:h-[700px] w-full rounded-2xl overflow-hidden border border-nexus-gray/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img 
                  src="https://res.cloudinary.com/da72jlau6/image/upload/v1766767049/ime3_vqgfxo.jpg" 
                  alt="Mamadou Kone PDG" 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <p className="text-nexus-orange font-bold uppercase tracking-widest text-sm mb-1">Directeur Général</p>
                  <h3 className="text-4xl font-black text-white">Mamadou Kone</h3>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 ceo-text space-y-8 relative">
              <Quote className="text-nexus-orange w-16 h-16 absolute -top-12 -left-8 opacity-20" />
              <div>
                <h2 className="text-4xl font-bold text-nexus-text mb-2">Le mot du Président</h2>
                <p className="text-nexus-concrete italic">Vision, Rigueur et Engagement.</p>
              </div>

              <div className="space-y-6 text-lg text-nexus-text leading-relaxed font-light text-justify">
                <p>
                  <span className="text-4xl float-left mr-2 mt-[-10px] font-serif text-nexus-orange">C</span>
                  hers partenaires, chers clients, notre entreprise évolue dans le secteur du Bâtiment et des Travaux Publics avec une ambition claire : proposer des réalisations <strong>solides, durables et conformes</strong> aux normes internationales.
                </p>
                <p>
                  Depuis sa création, notre entreprise accompagne ses clients en mettant un accent particulier sur le respect des délais, la maîtrise des coûts et la satisfaction totale. Chaque chantier que nous menons est guidé par un sens profond de la responsabilité.
                </p>
                <p>
                  Notre force repose sur une équipe qualifiée, capable de répondre aux exigences techniques les plus complexes. Conscients des enjeux écologiques, nous intégrons désormais des <strong>solutions durables</strong> dans chaque bâtiment.
                </p>
                <p className="font-medium text-nexus-text border-l-4 border-nexus-orange pl-6 py-2 bg-nexus-dark/50 rounded-r-xl">
                  "Ensemble, nous continuerons à bâtir des ouvrages de qualité et à contribuer activement au développement de nos territoires."
                </p>
              </div>

              <div className="pt-8 flex items-center justify-end gap-4">
                <div className="text-right">
                  <p className="font-script text-4xl text-nexus-orange rotate-[-5deg] opacity-90">Mamadou Kone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* ------------------------------------------------------- */}
      {/* 4. NOTRE ÉQUIPE */}
      {/* ------------------------------------------------------- */}
      <section id="team-section" className="py-32 px-4 bg-nexus-dark border-t border-nexus-gray">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-nexus-text mb-4">L'Équipe d'Excellence</h2>
            <p className="text-nexus-concrete text-xl">Les talents qui font sortir vos projets de terre.</p>
        </div>

        <div className="max-w-7xl mx-auto h-auto md:h-[500px] flex flex-col md:flex-row gap-2">
            {[
                { name: "Saliou Diop", role: "Chef de Chantier", img: "https://res.cloudinary.com/da72jlau6/image/upload/v1766768346/equip1_bovszs.jpg", icon: HardHat },
                { name: "Fatou Ndiaye", role: "Architecte Senior", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800", icon: Ruler },
                { name: "Jean Gomis", role: "Chef de Chantier", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800", icon: Hammer },
                { name: "Aminata Sow", role: "Responsable QSE", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800", icon: ShieldCheck },
                { name: "Ibrahima Fall", role: "Ingénieur Structure", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800", icon: Building },
            ].map((member, idx) => (
                <div 
                    key={idx} 
                    className="team-member opacity-0 relative h-[400px] md:h-auto flex-1 hover:flex-[3] transition-all duration-700 ease-out rounded-2xl overflow-hidden cursor-pointer group"
                >
                    <img src={member.img} alt={member.name} className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                    
                    {/* Overlay Dégradé pour lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:opacity-60 transition-opacity"></div>

                    <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end items-start transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10">
                        <div className="bg-nexus-orange text-black p-3 rounded-xl mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <member.icon size={24}/>
                        </div>
                        <h3 className="text-2xl font-bold text-white whitespace-nowrap opacity-100 group-hover:scale-110 origin-left transition-transform">
                            {member.name}
                        </h3>
                        <p className="text-nexus-orange font-bold uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                            {member.role}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* 5. NOTRE Animation 3D */}
      {/* ------------------------------------------------------- */}
      

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
