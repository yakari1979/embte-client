"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Dna, 
  Microscope, 
  PlayCircle, 
  FileText, 
  Sprout, 
  Activity, 
  Network, 
  ShieldCheck,
  Dumbbell,
  Baby,
  Droplet,
  HeartPulse,
  ShieldAlert,
  BrainCircuit // Pour Pavlov
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SVTSimulationsPage() {
  const router = useRouter();

  const simulations = [
    // --- 1. BIOLOGIE MOLECULAIRE & CELLULAIRE ---
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
    {
      id: 'transcription',
      title: "Transcription ADN → ARNm",
      description: "Visualisez comment l'information génétique est copiée de l'ADN vers une molécule d'ARN messager.",
      icon: <FileText size={40} className="text-blue-500" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/transcription"
    },
    
    // --- 2. GÉNÉTIQUE ---
    {
      id: 'mendel',
      title: "Génétique & Lois de Mendel",
      description: "Expérimentez les croisements (Mono, Di, Trishybridisme) et analysez les statistiques F1/F2.",
      icon: <Sprout size={40} className="text-yellow-500" />,
      color: "hover:border-yellow-300 hover:shadow-yellow-500/20",
      link: "/student/simulations/mendel"
    },
    {
      id: 'heredity',
      title: "Hérédité : Groupes Sanguins",
      description: "Comprenez la transmission des allèles ABO/Rh et la formation des phénotypes (Antigènes).",
      icon: <Droplet size={40} className="text-cyan-600" />,
      color: "hover:border-cyan-300 hover:shadow-cyan-500/20",
      link: "/student/simulations/heredity"
    },

    // --- 3. NEUROPHYSIOLOGIE ---
    {
      id: 'nervous',
      title: "Le Message Nerveux",
      description: "Simulez la 'Loi du tout ou rien' et visualisez la propagation du potentiel d'action le long de l'axone.",
      icon: <Activity size={40} className="text-amber-500" />,
      color: "hover:border-amber-300 hover:shadow-amber-500/20",
      link: "/student/simulations/nervous"
    },
    {
      id: 'synapse',
      title: "Transmission Synaptique",
      description: "Comprenez le rôle des neurotransmetteurs (Acétylcholine, GABA) et le fonctionnement des récepteurs.",
      icon: <Network size={40} className="text-purple-500" />,
      color: "hover:border-purple-300 hover:shadow-purple-500/20",
      link: "/student/simulations/synapse"
    },
    {
      id: 'reflex',
      title: "Réflexe Myotatique",
      description: "Testez l'arc réflexe rotulien et simulez des lésions nerveuses pour comprendre le circuit.",
      icon: <Activity size={40} className="text-indigo-600" />,
      color: "hover:border-indigo-300 hover:shadow-indigo-500/20",
      link: "/student/simulations/reflex"
    },
    {
      id: 'pavlov',
      title: "Réflexe Conditionnel (Pavlov)",
      description: "Créez de nouvelles connexions nerveuses dans le cortex par apprentissage (Cloche + Viande).",
      icon: <BrainCircuit size={40} className="text-violet-600" />,
      color: "hover:border-violet-300 hover:shadow-violet-500/20",
      link: "/student/simulations/pavlov"
    },

    // --- 4. FONCTIONS VITALES ---
    {
      id: 'muscle',
      title: "Contraction Musculaire",
      description: "Découvrez le mécanisme moléculaire du sarcomère, le rôle de l'ATP et du Calcium.",
      icon: <Dumbbell size={40} className="text-red-600" />,
      color: "hover:border-red-300 hover:shadow-red-500/20",
      link: "/student/simulations/muscle"
    },
    {
      id: 'blood-pressure',
      title: "Régulation Pression Artérielle",
      description: "Expérimentez le Baroréflexe : sectionnez les nerfs (Hering, X) et observez la réponse cardiaque.",
      icon: <HeartPulse size={40} className="text-red-500" />,
      color: "hover:border-red-300 hover:shadow-red-500/20",
      link: "/student/simulations/blood-pressure"
    },

    // --- 5. IMMUNITÉ ---
    {
      id: 'phagocytosis',
      title: "Immunité : La Phagocytose",
      description: "Observez les étapes de la réponse immunitaire non spécifique : adhésion, ingestion et digestion.",
      icon: <ShieldCheck size={40} className="text-emerald-600" />,
      color: "hover:border-emerald-300 hover:shadow-emerald-500/20",
      link: "/student/simulations/phagocytosis"
    },
    {
      id: 'specific-immunity',
      title: "Immunité Spécifique (LB & LT)",
      description: "Comparez l'action des Anticorps (Humorale) et des Lymphocytes Tueurs (Cellulaire).",
      icon: <ShieldAlert size={40} className="text-blue-600" />,
      color: "hover:border-blue-300 hover:shadow-blue-500/20",
      link: "/student/simulations/specific-immunity"
    },

    // --- 6. REPRODUCTION ---
    {
      id: 'fertilization',
      title: "Reproduction : La Fécondation",
      description: "Simulez la rencontre des gamètes, l'influence du spermogramme et du cycle ovarien.",
      icon: <Baby size={40} className="text-pink-400" />,
      color: "hover:border-pink-300 hover:shadow-pink-500/20",
      link: "/student/simulations/fertilization"
    },
    {
      id: 'birth',
      title: "L'Accouchement",
      description: "Comprenez la rétroaction positive, le rôle de l'ocytocine et la mécanique de l'expulsion.",
      icon: <Baby size={40} className="text-fuchsia-500" />, // Fuchsia pour différencier de la fécondation
      color: "hover:border-fuchsia-300 hover:shadow-fuchsia-500/20",
      link: "/student/simulations/birth"
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