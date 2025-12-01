"use client";
import React, { useState } from 'react';
import Phagocytosis3D from '@/components/simulations/Phagocytosis3D';
import { simulatePhagocytosis, PhagocytosisConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { 
    ShieldCheck, 
    Play, 
    Microscope, 
    ScanEye, 
    Grab, 
    Bomb, 
    Trash2,
    Info
} from 'lucide-react';

export default function PhagocytosisPage() {
    const [config, setConfig] = useState<PhagocytosisConfig | null>({
        macrophageColor: "#ffecb3",
        bacteriaVisible: true,
        bacteriaPos: { x: 5, y: 0, z: 0 },
        message: "En attente d'un antigène..."
    });
    
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    const steps = [
        { id: 'ADHESION', label: 'Adhésion', icon: <ScanEye size={18}/>, desc: "Reconnaissance et fixation" },
        { id: 'INGESTION', label: 'Ingestion', icon: <Grab size={18}/>, desc: "Formation du phagosome" },
        { id: 'DIGESTION', label: 'Digestion', icon: <Bomb size={18}/>, desc: "Fusion avec lysosomes" },
        { id: 'REJET', label: 'Rejet', icon: <Trash2 size={18}/>, desc: "Exocytose des déchets" }
    ];

    const runStep = async (stepIndex: number) => {
        setLoading(true);
        setCurrentStepIndex(stepIndex);
        const token = Cookies.get('token');
        if(!token) return;

        try {
            const res = await simulatePhagocytosis(steps[stepIndex].id, token);
            setConfig(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex gap-2 items-center text-gray-800 dark:text-white">
                        <ShieldCheck className="text-green-600" size={32} /> 
                        Immunité : La Phagocytose
                    </h1>
                    <p className="text-gray-500">Observation microscopique de la réponse immunitaire non spécifique.</p>
                </div>
                <div className="hidden md:flex bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Système Immunitaire : ACTIF</span>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* --- COLONNE GAUCHE : CONTRÔLES (3 cols) --- */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Microscope size={18}/> Séquence
                        </h3>
                        
                        <div className="space-y-3 relative">
                            {/* Ligne de connexion */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

                            {steps.map((step, idx) => {
                                const isActive = idx === currentStepIndex;
                                const isPast = idx < currentStepIndex;

                                return (
                                    <button 
                                        key={step.id} 
                                        onClick={() => runStep(idx)}
                                        className={`relative z-10 w-full p-3 text-left rounded-xl border transition-all duration-300 group ${isActive 
                                            ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-200' 
                                            : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${isActive 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : isPast ? 'bg-green-100 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'
                                            }`}>
                                                {step.icon}
                                            </div>
                                            <div>
                                                <div className={`font-bold text-sm ${isActive ? 'text-blue-800' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {step.label}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {step.desc}
                                                </div>
                                            </div>
                                            {isActive && <Play size={16} className="ml-auto text-blue-500 animate-pulse"/>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Légende */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                         <h4 className="font-bold text-gray-600 dark:text-gray-400 uppercase text-[10px] tracking-wider">Légende</h4>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-400"></div> Macrophage (Cellule)</div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Lysosome (Enzymes)</div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-400"></div> Noyau</div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Bactérie (Antigène)</div>
                    </div>
                </div>

                {/* --- COLONNE CENTRALE : VISUALISATION 3D (9 cols) --- */}
                <div className="lg:col-span-9 space-y-4">
                    <div className="bg-black rounded-2xl overflow-hidden h-[550px] border-4 border-gray-800 relative shadow-2xl">
                        
                        {/* Overlay info étape */}
                        <div className="absolute top-6 left-6 z-10 max-w-sm">
                            <div className="bg-black/60 backdrop-blur-md text-white p-4 rounded-xl border border-white/10 shadow-lg">
                                <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
                                    <Info size={18} className="text-blue-400"/> Observation
                                </h2>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {config?.message || "Le macrophage est en patrouille dans les tissus, à la recherche d'intrus..."}
                                </p>
                            </div>
                        </div>

                        <Phagocytosis3D config={config} />

                    </div>

                    {/* Explication Théorique Dynamique */}
                    {currentStepIndex !== -1 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800 animate-in slide-in-from-bottom-2">
                            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                                Ce qu'il faut retenir : {steps[currentStepIndex].label}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {currentStepIndex === 0 && "Les récepteurs membranaires du phagocyte reconnaissent les motifs étrangers de la bactérie. La membrane commence à se déformer pour l'entourer (pseudopodes)."}
                                {currentStepIndex === 1 && "La bactérie est totalement enfermée dans une vésicule appelée 'phagosome'. Elle est maintenant à l'intérieur du cytoplasme mais isolée."}
                                {currentStepIndex === 2 && "Les lysosomes (sacs d'enzymes digestives) fusionnent avec le phagosome pour former un phagolysosome. Les enzymes détruisent la paroi bactérienne."}
                                {currentStepIndex === 3 && "Les résidus de la digestion, inoffensifs, sont rejetés hors de la cellule par fusion de la vésicule avec la membrane plasmique."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}