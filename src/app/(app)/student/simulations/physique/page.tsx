"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Atom, Zap, Lock, Orbit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PCSimulationsPage() {
  const router = useRouter();

  const simulations = [
    {
      id: 'atom',
      title: "Structure de l'Atome",
      description: "Noyau, électrons et orbitales. Visualise le modèle de Bohr et quantique.",
      icon: <Atom size={40} className="text-purple-500" />,
      link: "#", // Lien vide pour l'instant
      active: false
    },
    {
      id: 'circuit',
      title: "Circuit RLC",
      description: "Oscillations électriques, résonance et échanges d'énergie en temps réel.",
      icon: <Zap size={40} className="text-yellow-500" />,
      link: "#",
      active: false
    },
     {
      id: 'gravity',
      title: "Mécanique Céleste",
      description: "Simule la gravité et les orbites des planètes du système solaire.",
      icon: <Orbit size={40} className="text-blue-500" />,
      link: "#",
      active: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface p-6 md:p-12">
      
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
         <ArrowLeft size={20}/> Retour au Labo
      </button>

      <header className="mb-12">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
           <span className="text-purple-600">Physique-Chimie</span> • Simulations
         </h1>
         <p className="text-gray-500 dark:text-gray-400">
            Ces modules sont en cours de développement par nos ingénieurs.
         </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {simulations.map((sim) => (
            <div 
              key={sim.id} 
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden ${!sim.active ? 'opacity-70 grayscale-[0.5]' : ''}`}
            >
               <div className="mb-6 bg-gray-50 dark:bg-gray-900 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner">
                  {sim.icon}
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {sim.title}
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  {sim.description}
               </p>
               
               {sim.active ? (
                   <Link href={sim.link} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
                      <Zap size={20}/> Lancer
                   </Link>
               ) : (
                   <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock size={18}/> Bientôt disponible
                   </button>
               )}
            </div>
         ))}
      </div>
    </div>
  );
}