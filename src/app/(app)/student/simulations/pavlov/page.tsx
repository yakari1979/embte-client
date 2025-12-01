"use client";
import React, { useState } from 'react';
import Pavlov3D from '@/components/simulations/Pavlov3D';
import { simulatePavlov, PavlovConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Bell, Bone, BrainCircuit, RotateCcw, Play, CheckCircle2 } from 'lucide-react';

export default function PavlovPage() {
    const [conditioning, setConditioning] = useState(0); // 0 à 10
    const [config, setConfig] = useState<PavlovConfig | null>(null);
    const [lastAction, setLastAction] = useState<string>("");

    const run = async (stimulus: string) => {
        const token = Cookies.get('token');
        if(!token) return;

        if (stimulus === 'BOTH') {
            setConditioning(prev => Math.min(10, prev + 2.5)); // +25% par essai
            setLastAction("Association");
        } else {
            setLastAction(stimulus === 'BELL' ? "Test Cloche" : "Test Viande");
        }

        const res = await simulatePavlov({ stimulus, conditioningLevel: conditioning }, token);
        setConfig(res.data);
    };

    const reset = () => {
        setConditioning(0);
        setConfig(null);
        setLastAction("");
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="mb-8 border-b pb-4 dark:border-gray-700">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-gray-900 dark:text-white">
                    <BrainCircuit className="text-purple-600" size={32} /> 
                    Le Réflexe Conditionnel
                </h1>
                <p className="text-gray-500 mt-2">Comment le cerveau crée de nouvelles connexions par apprentissage (Conditionnement de Pavlov).</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- CONTRÔLES (Gauche - 4 cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Carte Apprentissage */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Niveau d'Apprentissage</h3>
                            <span className="text-2xl font-black text-purple-600">{conditioning * 10}%</span>
                        </div>
                        
                        {/* Barre de progression segmentée */}
                        <div className="flex gap-1 mb-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`h-3 flex-1 rounded-sm transition-all duration-500 ${conditioning >= (i+1)*2.5 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">
                            {conditioning < 5 ? "Connexion faible. Le chien ne réagit pas encore à la cloche." : "Connexion établie ! Le stimulus neutre est devenu efficace."}
                        </p>
                    </div>

                    {/* Carte Actions */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Expérimentation</h3>
                        
                        <button onClick={() => run('MEAT')} className="w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 rounded-xl font-bold flex items-center justify-between group transition-all">
                            <span className="flex items-center gap-2"><Bone size={18}/> Viande Seule</span>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-red-100 group-hover:border-red-300">Réflexe Absolu</span>
                        </button>

                        <button onClick={() => run('BOTH')} className="w-full p-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-between shadow-lg shadow-purple-500/20 transform active:scale-95 transition-all">
                            <span className="flex items-center gap-2"><Play size={18}/> Associer (Cloche + Viande)</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">+25%</span>
                        </button>

                        <button onClick={() => run('BELL')} className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-bold flex items-center justify-between group transition-all">
                            <span className="flex items-center gap-2"><Bell size={18}/> Cloche Seule</span>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100 group-hover:border-blue-300">Test</span>
                        </button>
                    </div>

                    <button onClick={reset} className="w-full py-3 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex justify-center items-center gap-2 transition-colors">
                        <RotateCcw size={14}/> Oublier l'apprentissage (Reset)
                    </button>
                </div>

                {/* --- VISUALISATION (Droite - 8 cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    <Pavlov3D config={config} />

                    {/* Zone de Feedback */}
                    {config ? (
                        <div className={`p-6 rounded-2xl border-l-8 shadow-sm animate-in slide-in-from-bottom-2 ${config.salivation ? 'bg-green-50 border-green-500 dark:bg-green-900/20' : 'bg-gray-100 border-gray-400 dark:bg-gray-800'}`}>
                            <h4 className="font-bold text-lg mb-1 flex items-center gap-2 text-gray-900 dark:text-white">
                                {config.salivation ? <CheckCircle2 className="text-green-600"/> : <div className="w-5 h-5 rounded-full border-2 border-gray-400"/>}
                                {config.salivation ? "RÉPONSE OBSERVÉE" : "PAS DE RÉPONSE"}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {config.message}
                            </p>
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-center text-gray-400">
                            Lancez une expérience pour observer l'activité cérébrale.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}