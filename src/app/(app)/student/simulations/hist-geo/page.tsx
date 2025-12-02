"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Users, Bone, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistGeoSimulationsPage() {
  const router = useRouter();

  const simulations = [
    {
      id: 'age-pyramid',
      title: "Pyramide des Âges",
      description: "Géographie : Visualisez la transition démographique, l'impact de la natalité et de l'espérance de vie sur la structure de la population.",
      icon: <Users size={40} className="text-blue-500" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/age-pyramid",
      active: true
    },
    {
      id: 'carbon-dating',
      title: "Datation Carbone 14",
      description: "Histoire/Sciences : Utilisez la loi de décroissance radioactive pour dater des vestiges archéologiques anciens.",
      icon: <Bone size={40} className="text-green-500" />,
      color: "hover:border-green-300 hover:shadow-green-500/20",
      link: "/student/simulations/carbon-dating",
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface p-6 md:p-12">
      
      {/* Navigation Retour */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
         <ArrowLeft size={20}/> Retour au Hub
      </button>

      <header className="mb-12">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
           <span className="text-amber-600">Histoire-Géo</span> • Simulations
         </h1>
         <p className="text-gray-500 dark:text-gray-400">
            Des outils interactifs pour comprendre le monde et le temps (Spécial Série L & S).
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
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {sim.title}
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  {sim.description}
               </p>
               
               <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-amber-600 dark:group-hover:bg-amber-500 dark:group-hover:text-white transition-all">
                  <PlayCircle size={20}/> Lancer
               </button>
            </Link>
         ))}
      </div>
    </div>
  );
}