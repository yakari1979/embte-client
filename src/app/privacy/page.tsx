'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Shield, Lock, Eye, Server, FileText, 
  MapPin, UserCheck, ArrowLeft, Check, Scale // J'ai ajouté Scale ici si tu veux utiliser celui de Lucide
} from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

// --- CORRECTION : On définit l'icône ICI (avant de l'utiliser) simple  ---
const ScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nexus-orange"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
);
// ------------------------------------------------------------------

const policySections = [
  {
    id: "collect",
    title: "1. Données Collectées",
    icon: <FileText className="text-nexus-orange" size={24} />,
    content: (
      <>
        <p className="mb-4">
          Dans le cadre de la gestion de vos chantiers, Nexus BTP collecte uniquement les données strictement nécessaires au bon déroulement des opérations :
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <Check size={18} className="text-nexus-orange mt-1 shrink-0"/>
            <span><strong>Identité :</strong> Nom, Prénom, Email, Téléphone, CNI (pour les contrats).</span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={18} className="text-nexus-orange mt-1 shrink-0"/>
            <span><strong>Données Techniques :</strong> Géolocalisation GPS du terrain, plans architecturaux, titres de propriété.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={18} className="text-nexus-orange mt-1 shrink-0"/>
            <span><strong>Données de Connexion :</strong> Logs d'accès, adresse IP, type d'appareil (pour la sécurité).</span>
          </li>
        </ul>
      </>
    )
  },
  {
    id: "usage",
    title: "2. Utilisation des Données",
    icon: <UserCheck className="text-blue-500" size={24} />,
    content: (
      <>
        <p className="mb-4">
          Vos informations ne sont jamais vendues. Elles sont utilisées exclusivement pour :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-nexus-black p-4 rounded-xl border border-nexus-gray">
                <h4 className="font-bold text-white mb-2">Opérationnel</h4>
                <p className="text-sm text-nexus-concrete">Coordination des équipes sur le terrain et livraison des matériaux au bon endroit.</p>
            </div>
            <div className="bg-nexus-black p-4 rounded-xl border border-nexus-gray">
                <h4 className="font-bold text-white mb-2">Administratif</h4>
                <p className="text-sm text-nexus-concrete">Édition des devis, factures et contrats conformes à la législation sénégalaise.</p>
            </div>
        </div>
      </>
    )
  },
  {
    id: "security",
    title: "3. Sécurité & Stockage",
    icon: <Lock className="text-green-500" size={24} />,
    content: (
      <>
        <p className="mb-4">
          La sécurité est notre priorité absolue. Nous appliquons des mesures de protection bancaires.
        </p>
        <ul className="space-y-3 text-nexus-concrete">
            <li>• Toutes les données sont <strong>cryptées</strong> (SSL/TLS) lors des transferts.</li>
            <li>• Les mots de passe sont <strong>hachés</strong> (Bcrypt) et illisibles par notre équipe.</li>
            <li>• Les serveurs sont situés dans des datacenters certifiés <strong>ISO 27001</strong>.</li>
            <li>• Des sauvegardes quotidiennes garantissent l'intégrité de votre dossier chantier.</li>
        </ul>
      </>
    )
  },
  {
    id: "geo",
    title: "4. Géolocalisation",
    icon: <MapPin className="text-purple-500" size={24} />,
    content: (
      <>
        <p>
          L'utilisation du GPS est requise pour deux fonctionnalités clés :
        </p>
        <div className="mt-4 space-y-4">
            <div className="flex gap-4">
                <span className="font-bold text-white min-w-[100px]">Clients :</span>
                <span className="text-nexus-concrete">Pour localiser précisément le terrain lors de la commande.</span>
            </div>
            <div className="flex gap-4">
                <span className="font-bold text-white min-w-[100px]">Ouvriers :</span>
                <span className="text-nexus-concrete">Pour valider la présence sur chantier (Pointage) uniquement pendant les heures de travail.</span>
            </div>
        </div>
      </>
    )
  },
  {
    id: "rights",
    title: "5. Vos Droits (CDP)",
    icon: <ScaleIcon />, // Maintenant ça marche car ScaleIcon est défini au-dessus !
    content: (
      <div className="bg-nexus-orange/10 border border-nexus-orange/30 p-6 rounded-2xl">
        <p className="mb-4 text-nexus-text">
            Conformément à la loi sénégalaise sur la protection des données personnelles, vous disposez des droits suivants :
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-nexus-concrete">
            <li>✅ Droit d'accès</li>
            <li>✅ Droit de rectification</li>
            <li>✅ Droit à l'oubli</li>
            <li>✅ Droit d'opposition</li>
        </ul>
        <p className="mt-4 text-sm">
            Pour exercer ces droits, contactez notre DPO : <strong>privacy@nexusbtp.sn</strong>
        </p>
      </div>
    )
  }
];

export default function PrivacyPage() {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.from(".privacy-header", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });
      
      // Sidebar
      gsap.from(".privacy-nav", { x: -30, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

      // Sections
      gsap.utils.toArray(".policy-section").forEach((section: any) => {
        gsap.from(section, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });

    }, container);
    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div ref={container} className="bg-nexus-black min-h-screen pt-32 pb-20 px-4">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-16 privacy-header">
        <Link href="/" className="inline-flex items-center gap-2 text-nexus-concrete hover:text-nexus-orange mb-6 transition-colors">
            <ArrowLeft size={18}/> Retour à l'accueil
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-nexus-text mb-4">
                    Politique de <span className="text-nexus-orange">Confidentialité</span>
                </h1>
                <p className="text-nexus-concrete text-lg max-w-2xl">
                    Transparence totale sur la gestion de vos données. Nous construisons des bâtiments, pas des bases de données publicitaires.
                </p>
            </div>
            <Shield className="text-nexus-dark w-24 h-24 opacity-50 hidden md:block"/>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:w-1/4 privacy-nav hidden lg:block">
            <div className="sticky top-32 space-y-1">
                <p className="text-xs font-bold text-nexus-concrete uppercase tracking-widest mb-4 pl-4">Sommaire</p>
                {policySections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-nexus-text hover:bg-nexus-dark hover:text-nexus-orange transition-colors flex items-center justify-between group"
                    >
                        {section.title.split('. ')[1]}
                        <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition-opacity rotate-180 -translate-x-2 group-hover:translate-x-0"/>
                    </button>
                ))}
            </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <div className="lg:w-3/4 space-y-16">
            {policySections.map((section) => (
                <section key={section.id} id={section.id} className="policy-section scroll-mt-32">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-nexus-gray">
                        <div className="p-3 bg-nexus-dark rounded-xl border border-nexus-gray/50">
                            {section.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-nexus-text">{section.title}</h2>
                    </div>
                    <div className="text-nexus-concrete leading-relaxed text-lg pl-2 md:pl-4">
                        {section.content}
                    </div>
                </section>
            ))}

            {/* Note de bas de page */}
            <div className="policy-section mt-20 p-8 bg-nexus-dark border border-nexus-gray rounded-3xl text-center">
                <Server className="w-10 h-10 text-nexus-concrete mx-auto mb-4"/>
                <h3 className="text-white font-bold mb-2">Une question sur vos données ?</h3>
                <p className="text-nexus-concrete mb-6">Notre équipe technique est disponible pour vous répondre.</p>
                <Link href="/contact" className="inline-block bg-nexus-text text-nexus-black px-8 py-3 rounded-xl font-bold hover:bg-nexus-orange transition-colors">
                    Contacter le support
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}