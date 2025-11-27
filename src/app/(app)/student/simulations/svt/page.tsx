"use client";

import React from 'react';
import Link from 'next/link';
// N'oublie pas d'importer FileText ici
import { ArrowLeft, Dna, Microscope, PlayCircle, FileText, Sprout, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SVTSimulationsPage() {
  const router = useRouter();

  const simulations = [
    {
      id: 'dna',
      title: "Structure de l'ADN",
      description: "Visualise la double hélice, les bases azotées et simule des mutations génétiques.",
      icon: <Dna size={40} className="text-rose-500" />,
      color: "hover:border-rose-300 hover:shadow-rose-500/20",
      link: "/student/simulations/dna"
    },
    {
      id: 'cell',
      title: "La Cellule Vivante",
      description: "Compare cellules animales et végétales. Observe les mitochondries en activité.",
      icon: <Microscope size={40} className="text-emerald-500" />,
      color: "hover:border-emerald-300 hover:shadow-emerald-500/20",
      link: "/student/simulations/cell"
    },
    // --- NOUVELLE CARTE AJOUTÉE ICI ---
    {
      id: 'transcription',
      title: "Transcription ADN → ARNm",
      description: "Visualisez comment l'information génétique est copiée de l'ADN vers une molécule d'ARN messager.",
      icon: <FileText size={40} className="text-blue-500" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/transcription"
    },
    {
      id: 'mendel',
      title: "Génétique & Lois de Mendel",
      description: "Expérimentez les croisements (Mono, Di, Trishybridisme) et analysez les statistiques F1/F2.",
      icon: <Sprout size={40} className="text-yellow-500" />,
      color: "hover:border-yellow-300 hover:shadow-yellow-500/20",
      link: "/student/simulations/mendel"
    },
    {
      id: 'nervous',
      title: "Le Système Nerveux",
      description: "Simulez la 'Loi du tout ou rien' et visualisez la propagation du message nerveux le long de l'axone.",
      icon: <Activity size={40} className="text-yellow-500" />,
      color: "hover:border-yellow-300 hover:shadow-yellow-500/20",
      link: "/student/simulations/nervous"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface p-6 md:p-12">
      
      {/* Navigation Retour */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
         <ArrowLeft size={20}/> Retour au Labo
      </button>

      <header className="mb-12">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
           <span className="text-green-600">SVT</span> • Simulations Disponibles
         </h1>
         <p className="text-gray-500 dark:text-gray-400">
            Sélectionne un module pour lancer l'expérience interactive.
         </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {simulations.map((sim) => (
            <Link 
              key={sim.id} 
              href={sim.link}
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${sim.color} group`}
            >
               <div className="mb-6 bg-gray-50 dark:bg-gray-900 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner">
                  {sim.icon}
               </div>
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {sim.title}
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  {sim.description}
               </p>
               
               <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 dark:group-hover:text-white transition-all">
                  <PlayCircle size={20}/> Lancer
               </button>
            </Link>
         ))}
      </div>
    </div>
  );
}