'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowLeft, FileText, Download, Printer, 
  Scale, ShieldCheck, Banknote, HardHat, AlertTriangle 
} from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const cgvArticles = [
  {
    icon: <FileText size={24} className="text-blue-500"/>,
    title: "Article 1 : Objet et Champ d'application",
    content: "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société EMBTE (le Prestataire) et son client (le Maître d'Ouvrage). Elles s'appliquent à tous les travaux de construction, rénovation et études techniques réalisés au Sénégal. Toute commande implique l'acceptation sans réserve des présentes conditions."
  },
  {
    icon: <Banknote size={24} className="text-green-500"/>,
    title: "Article 2 : Devis et Validité",
    content: "Les travaux sont chiffrés sur la base d'un devis détaillé valable pour une durée de 30 jours. Passé ce délai, EMBTE se réserve le droit de réviser les prix unitaires, notamment en cas de fluctuation du cours des matériaux (ciment, fer à béton). La commande n'est définitive qu'après signature du devis et versement de l'acompte prévu."
  },
  {
    icon: <Scale size={24} className="text-purple-500"/>,
    title: "Article 3 : Modalités de Paiement",
    content: (
      <ul className="list-disc list-inside space-y-2 mt-2">
        <li><strong>Acompte au démarrage :</strong> 40% du montant total TTC.</li>
        <li><strong>En cours de travaux :</strong> 30% sur situations de travaux validées.</li>
        <li><strong>À l'achèvement :</strong> 25% à la fin du gros œuvre / finitions.</li>
        <li><strong>Retenue de garantie :</strong> 5% payables à la réception définitive (ou levée des réserves).</li>
      </ul>
    )
  },
  {
    icon: <HardHat size={24} className="text-nexus-orange"/>,
    title: "Article 4 : Délais et Exécution",
    content: "EMBTE s'engage à respecter les délais convenus au planning, sauf cas de force majeure (intempéries graves, grèves nationales, pénurie de matériaux sur le marché national). Tout retard du fait du client (retard de paiement, modification de plans) entraînera une prolongation automatique du délai de livraison."
  },
  {
    icon: <ShieldCheck size={24} className="text-yellow-500"/>,
    title: "Article 5 : Garanties et Responsabilités",
    content: "Conformément à la législation en vigueur au Sénégal, EMBTE couvre ses ouvrages par une garantie décennale (10 ans) pour le gros œuvre et une garantie de bon fonctionnement (2 ans) pour les équipements. Cette garantie ne couvre pas l'usure normale ou les défauts d'entretien."
  },
  {
    id: "litiges",
    icon: <AlertTriangle size={24} className="text-red-500"/>,
    title: "Article 6 : Droit applicable et Litiges",
    content: "Le présent contrat est soumis au droit sénégalais. En cas de différend, une solution amiable sera recherchée en priorité. À défaut d'accord sous 30 jours, le litige sera porté devant le Tribunal de Commerce de Dakar."
  }
];

export default function CGVPage() {
  const container = useRef(null);
  const progressBarRef = useRef(null);

  // Animation de la barre de progression de lecture
  useEffect(() => {
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, { width: `${progress}%`, duration: 0.1, ease: "none" });
      }
    };
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Animation d'entrée
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header qui tombe
      gsap.from(".cgv-header", { y: -50, opacity: 0, duration: 1, ease: "power3.out" });
      
      // Le "Papier" qui monte
      gsap.from(".cgv-document", { y: 100, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });

      // Les articles un par un
      gsap.from(".cgv-article", {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "power2.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="bg-nexus-black min-h-screen relative">
      
      {/* BARRE DE PROGRESSION DE LECTURE (Fixe en haut) */}
      <div className="fixed top-0 left-0 h-1.5 bg-nexus-gray w-full z-[100]">
        <div ref={progressBarRef} className="h-full bg-nexus-orange w-0"></div>
      </div>

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="cgv-header flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
                <Link href="/" className="inline-flex items-center gap-2 text-nexus-concrete hover:text-nexus-orange mb-4 transition-colors">
                    <ArrowLeft size={18}/> Retour
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-nexus-text">
                    Conditions Générales <br/><span className="text-nexus-orange">de Vente</span>
                </h1>
            </div>
            
            {/* Boutons d'action (Print/Download) */}
            <div className="flex gap-3">
                <button 
                    onClick={() => window.print()}
                    className="p-3 rounded-xl border border-nexus-gray text-nexus-concrete hover:text-nexus-text hover:bg-nexus-dark transition-colors" 
                    title="Imprimer"
                >
                    <Printer size={20}/>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-nexus-text text-nexus-black font-bold hover:bg-nexus-orange transition-colors">
                    <Download size={20}/> Télécharger PDF
                </button>
            </div>
        </div>

        {/* DOCUMENT CENTRAL (Style Papier) */}
        <div className="cgv-document bg-nexus-dark border border-nexus-gray rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Filigrane décoratif en arrière-plan */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-white/[0.02] pointer-events-none select-none rotate-45">
                EMBTE
            </div>

            <div className="space-y-12 relative z-10">
                
                {/* Intro */}
                <div className="text-center border-b border-nexus-gray/50 pb-8 mb-8">
                    <p className="text-nexus-concrete text-sm uppercase tracking-widest mb-2">Document Référentiel</p>
                    <p className="text-nexus-text font-bold">Mise à jour : Janvier 2025</p>
                </div>

                {/* Articles */}
                {cgvArticles.map((article, index) => (
                    <article key={index} className="cgv-article">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-nexus-black rounded-xl border border-nexus-gray/50 shadow-sm">
                                {article.icon}
                            </div>
                            <h2 className="text-xl font-bold text-nexus-text">{article.title}</h2>
                        </div>
                        <div className="text-nexus-concrete leading-relaxed pl-2 md:pl-[4.5rem] text-lg">
                            {article.content}
                        </div>
                    </article>
                ))}

                {/* Signature Block (Fake) */}
                <div className="mt-16 pt-12 border-t-2 border-dashed border-nexus-gray/30 flex justify-between items-end">
                    <div className="text-nexus-concrete text-sm">
                        <p>Approuvé par la Direction Juridique</p>
                        <p>Groupe EMBTE S.A.R.L - Dakar</p>
                    </div>
                    {/* Simulation signature */}
                    <div className="font-script text-3xl text-nexus-orange opacity-80 -rotate-6">
                        EMBTE
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}