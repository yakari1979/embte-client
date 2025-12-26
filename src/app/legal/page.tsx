'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Scale, Building2, Server, ShieldCheck, Cookie, 
  Copyright, FileText, ChevronDown, ChevronUp, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

// DONNÉES JURIDIQUES (Adaptées au contexte Sénégalais)
const legalSections = [
  {
    id: 'editor',
    title: "Éditeur du Site",
    icon: <Building2 className="w-6 h-6"/>,
    content: (
      <div className="space-y-2">
        <p>Le site <strong>EMBTE</strong> est édité par la société <strong>l'Entreprise Moderne de Bâtiments et Travaux d'Etude GROUPE EMBTE S.A.R.L</strong>.</p>
        <ul className="list-disc list-inside text-nexus-concrete space-y-1 ml-2">
            <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (S.A.R.L)</li>
            <li><strong>Capital social :</strong> 10.000.000 FCFA</li>
            <li><strong>Siège social :</strong> Route de Rufisque, KM 18, Dakar, Sénégal</li>
            <li><strong>NINEA :</strong> 000000000 (Numéro d'Identification Nationale)</li>
            <li><strong>RCCM :</strong> SN.DKR.2024.B.0000 (Registre du Commerce)</li>
            <li><strong>Directeur de la publication :</strong> M. Saliou Diop</li>
        </ul>
      </div>
    )
  },
  {
    id: 'host',
    title: "Hébergement",
    icon: <Server className="w-6 h-6"/>,
    content: (
      <div>
        <p>Le site est hébergé par la société <strong>Vercel Inc.</strong></p>
        <p className="text-nexus-concrete mt-2">
          Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, USA.<br/>
          Le stockage des données est sécurisé et conforme aux normes internationales.
        </p>
      </div>
    )
  },
  {
    id: 'intellectual',
    title: "Propriété Intellectuelle",
    icon: <Copyright className="w-6 h-6"/>,
    content: (
      <div>
        <p>
          L'ensemble de ce site (structure, textes, logos, images, vidéos, animations 3D) relève de la législation sénégalaise et internationale sur le droit d'auteur et la propriété intellectuelle.
        </p>
        <p className="text-nexus-concrete mt-2">
          Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de EMBTE.
        </p>
      </div>
    )
  },
  {
    id: 'privacy',
    title: "Données Personnelles (CDP)",
    icon: <ShieldCheck className="w-6 h-6"/>,
    content: (
      <div>
        <p>
          Conformément à la loi n° 2008-12 du 25 janvier 2008 portant sur la protection des données à caractère personnel au Sénégal, EMBTE s'engage à protéger la confidentialité des informations fournies en ligne.
        </p>
        <ul className="list-disc list-inside text-nexus-concrete mt-3 space-y-1">
            <li>Les données collectées (Formulaire de contact, Commande) sont utilisées uniquement pour la gestion de votre projet.</li>
            <li>Aucune information n'est vendue à des tiers.</li>
            <li>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à <strong>legal@nexusbtp.sn</strong>.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'cookies',
    title: "Gestion des Cookies",
    icon: <Cookie className="w-6 h-6"/>,
    content: (
      <div>
        <p>
          Pour le bon fonctionnement du tableau de bord (connexion, préférences), ce site utilise des cookies techniques essentiels.
        </p>
        <p className="text-nexus-concrete mt-2">
          Aucun cookie publicitaire tiers n'est utilisé sans votre consentement explicite.
        </p>
      </div>
    )
  },
  {
    id: 'liability',
    title: "Responsabilité",
    icon: <Scale className="w-6 h-6"/>,
    content: (
      <div>
        <p>
          EMBTE s'efforce de fournir des informations aussi précises que possible. Toutefois, les photos et modèles 3D présentés sont non contractuels et donnés à titre indicatif.
        </p>
        <p className="text-nexus-concrete mt-2">
          La responsabilité de EMBTE ne pourra être engagée en cas de force majeure ou de faits indépendants de sa volonté.
        </p>
      </div>
    )
  }
];

export default function LegalPage() {
  const container = useRef(null);
  // État pour savoir quelle section est ouverte (null = aucune)
  const [openSection, setOpenSection] = useState<string | null>('editor');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".legal-header", 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(".legal-item", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div ref={container} className="bg-nexus-black min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
        
      {/* Fond décoratif */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nexus-orange/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="legal-header mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-nexus-concrete hover:text-nexus-orange mb-6 transition-colors">
                <ArrowLeft size={18}/> Retour à l'accueil
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-nexus-text mb-4">
                Mentions <span className="text-nexus-orange">Légales</span>
            </h1>
            <p className="text-nexus-concrete text-lg border-l-4 border-nexus-orange pl-6">
                La confiance se bâtit sur la transparence. Retrouvez ici toutes les informations juridiques concernant l'utilisation de la plateforme EMBTE.
            </p>
        </div>

        {/* LISTE ACCORDÉON */}
        <div className="space-y-4">
            {legalSections.map((item) => {
                const isOpen = openSection === item.id;
                
                return (
                    <div 
                        key={item.id} 
                        onClick={() => toggleSection(item.id)}
                        className={`legal-item rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                            isOpen 
                            ? 'bg-nexus-dark border-nexus-orange shadow-[0_0_20px_rgba(255,107,0,0.1)]' 
                            : 'bg-nexus-black border-nexus-gray hover:border-nexus-concrete'
                        }`}
                    >
                        {/* Titre de la section */}
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${isOpen ? 'bg-nexus-orange text-black' : 'bg-nexus-dark text-nexus-concrete'}`}>
                                    {item.icon}
                                </div>
                                <h3 className={`text-xl font-bold ${isOpen ? 'text-nexus-text' : 'text-nexus-concrete group-hover:text-nexus-text'}`}>
                                    {item.title}
                                </h3>
                            </div>
                            <div className={`text-nexus-concrete transition-transform duration-300 ${isOpen ? 'rotate-180 text-nexus-orange' : ''}`}>
                                <ChevronDown size={24} />
                            </div>
                        </div>

                        {/* Contenu Déroulant */}
                        <div 
                            className={`transition-all duration-500 ease-in-out px-6 ${
                                isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="pt-4 border-t border-nexus-gray/30 text-nexus-text leading-relaxed">
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* FOOTER LÉGAL */}
        <div className="legal-item mt-16 text-center">
            <p className="text-nexus-concrete text-sm">
                Dernière mise à jour : <span className="text-nexus-text font-bold">21 Décembre 2025</span>
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-nexus-concrete">
                <Link href="/contact" className="hover:text-nexus-orange hover:underline">Nous contacter</Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-nexus-orange hover:underline">Politique de confidentialité</Link>
            </div>
        </div>

      </div>
    </div>
  );
}