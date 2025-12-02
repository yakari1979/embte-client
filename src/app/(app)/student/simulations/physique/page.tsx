"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket, Magnet, PlayCircle, ArrowRightLeft, Zap, Waves, Sun, Activity, Atom, Settings2, Radio, FlaskConical, Flame, BatteryCharging, Shapes } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PCSimulationsPage() {
  const router = useRouter();

  const simulations = [
    {
      id: 'projectile',
      title: "Cinématique : Tir de Projectile",
      description: "Étudiez le mouvement parabolique, la portée et la flèche en modifiant l'angle et la vitesse initiale.",
      icon: <Rocket size={40} className="text-blue-500" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/projectile",
      active: true
    },
    {
      id: 'lorentz',
      title: "Force de Lorentz",
      description: "Visualisez la trajectoire d'une particule chargée (proton/électron) dans un champ magnétique uniforme.",
      icon: <Magnet size={40} className="text-emerald-500" />,
      color: "hover:border-emerald-300 hover:shadow-emerald-500/20",
      link: "/student/simulations/lorentz",
      active: true
    },
    {
      id: 'induction',
      title: "Induction Magnétique",
      description: "Expérience Aimant-Bobine : Loi de Faraday et Lenz. Produisez de l'électricité par le mouvement.",
      icon: <ArrowRightLeft size={40} className="text-amber-500" />,
      color: "hover:border-amber-300 hover:shadow-amber-500/20",
      link: "/student/simulations/induction",
      active: true
    },
    {
      id: 'rc-circuit',
      title: "Circuit RC (Condensateur)",
      description: "Charge et décharge d'un condensateur. Visualisez la constante de temps τ et le flux d'électrons.",
      icon: <Zap size={40} className="text-yellow-500" />,
      color: "hover:border-yellow-300 hover:shadow-yellow-500/20",
      link: "/student/simulations/rc-circuit",
      active: true
    },
    {
      id: 'interference',
      title: "Interférences (Young)",
      description: "Observez les franges d'interférence créées par un laser passant par deux fentes.",
      icon: <Waves size={40} className="text-violet-500" />, // Import Waves from lucide-react
      color: "hover:border-violet-300 hover:shadow-violet-500/20",
      link: "/student/simulations/interference",
      active: true
    },
    {
      id: 'photoelectric',
      title: "Effet Photoélectrique",
      description: "Comprenez la quantification de l'énergie et l'extraction des électrons d'un métal.",
      icon: <Sun size={40} className="text-yellow-500" />, // Import Sun
      color: "hover:border-yellow-300 hover:shadow-yellow-500/20",
      link: "/student/simulations/photoelectric",
      active: true
    },
    {
      id: 'rl-circuit',
      title: "Dipôle RL (Bobine)",
      description: "Auto-induction : visualisez le retard à l'établissement du courant et l'énergie magnétique.",
      icon: <Activity size={40} className="text-amber-600" />,
      color: "hover:border-amber-500 hover:shadow-amber-500/20",
      link: "/student/simulations/rl-circuit",
      active: true
    },
    {
      id: 'bohr',
      title: "Atome de Bohr",
      description: "Mécanique Quantique : Sauts électroniques, niveaux d'énergie et spectres d'émission.",
      icon: <Atom size={40} className="text-purple-500" />,
      color: "hover:border-purple-300 hover:shadow-purple-500/20",
      link: "/student/simulations/bohr",
      active: true
    },
    {
      id: 'transformer',
      title: "Le Transformateur",
      description: "Étudiez le rapport de transformation et la relation entre nombre de spires et tension.",
      icon: <Settings2 size={40} className="text-blue-500" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/transformer",
      active: true
    },
    {
      id: 'rlc-forced',
      title: "Circuit RLC Forcé",
      description: "Phénomène de Résonance : Faites varier la fréquence pour maximiser l'intensité.",
      icon: <Radio size={40} className="text-orange-500" />,
      color: "hover:border-orange-300 hover:shadow-orange-500/20",
      link: "/student/simulations/rlc-forced",
      active: true
    },
    {
      id: 'titration',
      title: "Titrage pH-métrique",
      description: "Doser un acide fort par une base forte. Suivez l'évolution du pH et l'équivalence.",
      icon: <FlaskConical size={40} className="text-teal-500" />,
      color: "hover:border-teal-300 hover:shadow-teal-500/20",
      link: "/student/simulations/titration",
      active: true
    },
    {
      id: 'kinetics',
      title: "Cinétique Chimique",
      description: "Théorie des chocs : Comment la température et la concentration accélèrent une réaction.",
      icon: <Flame size={40} className="text-red-500" />,
      color: "hover:border-red-300 hover:shadow-red-500/20",
      link: "/student/simulations/kinetics",
      active: true
    },
    {
      id: 'atom-config',
      title: "Structure de l'Atome",
      description: "Couches électroniques et configuration (K, L, M).",
      icon: <Atom size={40} className="text-blue-500" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/atom-config"
    },
    {
      id: 'vsepr',
      title: "Géométrie VSEPR",
      description: "Visualisez la forme des molécules en 3D (AX2, AX3, AX4...).",
      icon: <Shapes size={40} className="text-teal-500" />,
      color: "hover:border-teal-300 hover:shadow-teal-500/20",
      link: "/student/simulations/vsepr"
    },
    {
      id: 'isomerism',
      title: "Isomérie Z/E",
      description: "Chimie Organique : Stéréoisomérie et rotation autour de la double liaison.",
      icon: <FlaskConical size={40} className="text-pink-500" />,
      color: "hover:border-pink-300 hover:shadow-pink-500/20",
      link: "/student/simulations/isomerism"
    },
    {
      id: 'redox',
      title: "Pile Daniell (Redox)",
      description: "Fonctionnement d'une pile électrochimique : Anode, Cathode et Pont Salin.",
      icon: <BatteryCharging size={40} className="text-yellow-500" />,
      color: "hover:border-yellow-300 hover:shadow-yellow-500/20",
      link: "/student/simulations/redox"
    },
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
               
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {sim.title}
               </h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  {sim.description}
               </p>
               
               <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-purple-600 dark:group-hover:bg-purple-500 dark:group-hover:text-white transition-all">
                  <PlayCircle size={20}/> Lancer
               </button>
            </Link>
         ))}
      </div>
    </div>
  );
}