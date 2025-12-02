"use client";

import React from 'react';
import Link from 'next/link';
import { Microscope, Atom, ArrowRight, Cuboid, Layers, Globe } from 'lucide-react';

export default function SimulationsHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface p-6 md:p-12">
      
      {/* --- HERO SECTION --- */}
      <div className="max-w-5xl mx-auto text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-bold text-sm mb-4 animate-in fade-in zoom-in duration-500">
          <Cuboid size={16} /> Laboratoire Virtuel 3D
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          L'Expérimentation Scientifique <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sans Limites.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Pour réussir le BAC, il ne suffit pas d'apprendre par cœur, il faut <strong>comprendre</strong>.
          Manipule l'ADN, crée des circuits électriques ou analyse la démographie mondiale en 3D.
          Transforme la théorie en pratique, directement depuis ton écran.
        </p>
      </div>

      {/* --- CARTES MATIÈRES (Grille de 3 maintenant) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* CARTE SVT */}
        <Link href="/student/simulations/svt" className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
           <div className="absolute top-0 right-0 p-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all"></div>
           
           <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Microscope size={32} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                SVT
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-grow">
                Explore le vivant : de la cellule microscopique à la génétique mendélienne. Comprends l'immunologie et la physiologie en 3D.
              </p>
              
              <div className="flex items-center gap-2 font-bold text-green-600 dark:text-green-400">
                 Ouvrir le Labo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </Link>

        {/* CARTE PHYSIQUE-CHIMIE */}
        <Link href="/student/simulations/physique" className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
           <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all"></div>
           
           <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Atom size={32} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Physique-Chimie
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-grow">
                Maîtrise la matière et l'énergie : mécanique, électricité, optique et réactions chimiques complexes visualisées.
              </p>
              
              <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
                 Ouvrir le Labo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </Link>

        {/* CARTE HISTOIRE-GÉO (NOUVEAU) */}
        <Link href="/student/simulations/hist-geo" className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
           <div className="absolute top-0 right-0 p-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-all"></div>
           
           <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Globe size={32} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Hist-Géo & Sciences
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-grow">
                Comprends les dynamiques de population et utilise la science (Carbone 14) pour dater l'Histoire. Idéal pour la Série L.
              </p>
              
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                 Ouvrir le Labo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </Link>

      </div>
      
      {/* --- FOOTER INFO --- */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
         <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <Layers size={16}/> Ces simulations sont optimisées pour le programme sénégalais (Séries L, S1, S2).
         </p>
      </div>
    </div>
  );
}