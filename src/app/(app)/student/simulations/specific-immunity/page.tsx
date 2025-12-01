"use client";
import React, { useState } from 'react';
import SpecificImmunity3D from '@/components/simulations/SpecificImmunity3D';
import { simulateSpecificImmunity, SpecificImmunityConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { ShieldAlert, Crosshair, Droplets, Skull, Play, RefreshCcw } from 'lucide-react';

export default function ImmunityPage() {
    const [mode, setMode] = useState<'HUMORAL' | 'CELLULAR'>('HUMORAL');
    const [step, setStep] = useState(0); // 0: Start, 1: Recognition, 2: Expansion, 3: Action
    const [config, setConfig] = useState<SpecificImmunityConfig>({
        antibodyCount: 0, killerActive: false, targetState: 'ALIVE', message: "Choisissez un mode pour commencer."
    });
    const [loading, setLoading] = useState(false);

    const stages = ['RECOGNITION', 'EXPANSION', 'ACTION'];

    const nextStep = async () => {
        if (step >= 3) return; // Fini
        setLoading(true);
        
        const nextStageIndex = step; // step 0 -> index 0 (RECOGNITION)
        const token = Cookies.get('token');
        if(!token) return;

        const res = await simulateSpecificImmunity({ type: mode, stage: stages[nextStageIndex] }, token);
        setConfig(res.data);
        setStep(step + 1);
        setLoading(false);
    };

    const reset = () => {
        setStep(0);
        setConfig({ antibodyCount: 0, killerActive: false, targetState: 'ALIVE', message: "Prêt." });
    };

    const switchMode = (newMode: 'HUMORAL' | 'CELLULAR') => {
        setMode(newMode);
        reset();
    };

    // On récupère le nom de l'étape actuelle pour piloter l'animation
    const currentStageName = stages[step]; // 'RECOGNITION', 'EXPANSION', ou 'ACTION' (si step < 3)
    // Si step est reset ou fini, on gère les cas limites
    const displayStage = step >= 3 ? 'ACTION' : stages[step];

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-blue-400">
                    <ShieldAlert size={36} /> Réponse Immunitaire Spécifique
                </h1>
                <p className="text-gray-400 mt-2">La 3ème ligne de défense : action ciblée des Lymphocytes B et T.</p>
            </header>

            <div className="grid lg:grid-cols-4 gap-6">
                
                {/* --- CONTRÔLES --- */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Choix du Mode */}
                    <div className="flex bg-gray-800 p-1 rounded-xl">
                        <button 
                            onClick={() => switchMode('HUMORAL')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'HUMORAL' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Droplets size={16} className="inline mr-1"/> Humorale (LB)
                        </button>
                        <button 
                            onClick={() => switchMode('CELLULAR')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'CELLULAR' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Skull size={16} className="inline mr-1"/> Cellulaire (LT)
                        </button>
                    </div>

                    {/* Progression */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 text-gray-200">
                            {mode === 'HUMORAL' ? "Production d'Anticorps" : "Cytotoxicité"}
                        </h3>
                        
                        {/* Steps Indicator */}
                        <div className="flex justify-between mb-6 text-xs text-gray-500 relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -z-10"></div>
                            {['Détection', 'Multiplication', 'Attaque'].map((label, i) => (
                                <div key={i} className={`flex flex-col items-center bg-gray-800 px-1 ${step > i ? 'text-green-400' : step === i+1 ? 'text-white' : ''}`}>
                                    <div className={`w-3 h-3 rounded-full mb-1 ${step > i ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                    {label}
                                </div>
                            ))}
                        </div>

                        {step < 3 ? (
                            <button 
                                onClick={nextStep}
                                disabled={loading}
                                className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold flex justify-center items-center gap-2 transition-all"
                            >
                                {loading ? "..." : <><Play size={18}/> Étape Suivante</>}
                            </button>
                        ) : (
                            <button 
                                onClick={reset}
                                className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all"
                            >
                                <RefreshCcw size={18}/> Recommencer
                            </button>
                        )}
                    </div>

                    {/* Explication */}
                    <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-800/50 text-blue-200 text-sm leading-relaxed">
                        <strong>Microscope :</strong><br/>
                        {config.message}
                    </div>
                </div>

                {/* --- VISUALISATION 3D --- */}
                {/* <div className="lg:col-span-3 bg-black rounded-2xl overflow-hidden h-[600px] relative border border-gray-700 shadow-2xl">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <div className="bg-black/60 p-2 rounded text-xs text-white backdrop-blur border border-white/10">
                            Mode : <span className="font-bold text-yellow-400">{mode}</span>
                        </div>
                    </div>
                    <SpecificImmunity3D type={mode} config={config} />
                </div> */}

                {/* --- VISUALISATION 3D --- */}
                <div className="lg:col-span-3 bg-black rounded-2xl overflow-hidden h-[600px] relative border border-gray-700 shadow-2xl">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <div className="bg-black/60 p-2 rounded text-xs text-white backdrop-blur border border-white/10">
                            Mode : <span className="font-bold text-yellow-400">{mode}</span>
                        </div>
                        {/* Ajout d'un indicateur visuel de l'étape */}
                        <div className="bg-blue-600/80 p-2 rounded text-xs text-white backdrop-blur border border-white/10">
                            Phase : <span className="font-bold">{displayStage}</span>
                        </div>
                    </div>
                    
                    {/* ICI : On passe displayStage comme prop */}
                    <SpecificImmunity3D 
                        type={mode} 
                        config={config} 
                        stageName={displayStage} 
                    />
                </div>

            </div>
        </div>
    );
}