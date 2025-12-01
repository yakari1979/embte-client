"use client";
import React, { useState } from 'react';
import Childbirth3D from '@/components/simulations/Childbirth3D';
import { simulateBirth, BirthConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Baby, Activity, ArrowDown, Timer, Syringe } from 'lucide-react';

export default function BirthPage() {
    const [oxytocin, setOxytocin] = useState('LOW');
    const [data, setData] = useState<BirthConfig | null>(null);
    const [activeStep, setActiveStep] = useState<string>("");

    const run = async (stage: string) => {
        setActiveStep(stage);
        const token = Cookies.get('token');
        if(!token) return;
        const res = await simulateBirth({ oxytocinLevel: oxytocin, stage }, token);
        setData(res.data);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-pink-600">
                    <Baby size={36} /> La Parturition (Accouchement)
                </h1>
                <p className="text-gray-500 mt-2">Comprendre la boucle de rétroaction positive et le rôle de l'ocytocine.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- CONTRÔLES (Gauche - 4 cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Carte Hormonale */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-pink-600"><Syringe size={18}/> Taux d'Ocytocine</h3>
                        <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                            <button 
                                onClick={() => setOxytocin('LOW')} 
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${oxytocin==='LOW'?'bg-white shadow text-gray-800':'text-gray-400 hover:text-gray-600'}`}
                            >
                                Faible (Début)
                            </button>
                            <button 
                                onClick={() => setOxytocin('HIGH')} 
                                className={`py-2 rounded-lg text-sm font-bold transition-all ${oxytocin==='HIGH'?'bg-pink-500 shadow text-white':'text-gray-400 hover:text-gray-600'}`}
                            >
                                Élevé (Pic)
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 italic">
                            L'ocytocine est l'hormone qui stimule les contractions utérines.
                        </p>
                    </div>

                    {/* Séquence Chronologique */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white"><Timer size={18}/> Déroulement</h3>
                        <div className="space-y-3 relative">
                            {/* Ligne */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

                            {[
                                { id: 'START', label: '1. Début du Travail', desc: 'Contractions irrégulières' },
                                { id: 'DILATION', label: '2. Dilatation du Col', desc: 'Effacement progressif' },
                                { id: 'EXPULSION', label: '3. Expulsion', desc: 'Naissance' }
                            ].map((step) => (
                                <button 
                                    key={step.id}
                                    onClick={() => run(step.id)}
                                    className={`relative z-10 w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${activeStep === step.id ? 'bg-pink-50 border-pink-500 shadow-md ring-1 ring-pink-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${activeStep === step.id ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {step.id === 'DILATION' && oxytocin === 'HIGH' ? <Activity size={18} className="animate-pulse"/> : step.label[0]}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${activeStep === step.id ? 'text-pink-800' : 'text-gray-700'}`}>{step.label}</div>
                                        <div className="text-xs text-gray-500">{step.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* --- VISUALISATION (Droite - 8 cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Le composant 3D existant */}
                    <Childbirth3D config={data} />
                    
                    {/* Explication Scientifique */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-start gap-4">
                            <div className="bg-pink-100 p-3 rounded-xl">
                                <ArrowDown size={24} className="text-pink-600"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Mécanisme Physiologique</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {data ? data.message : "Sélectionnez une étape pour commencer l'observation."}
                                </p>
                                {activeStep === 'DILATION' && oxytocin === 'HIGH' && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 font-medium">
                                        ♻️ <strong>Réflexe de Ferguson (Rétroaction Positive) :</strong><br/>
                                        Pression du bébé sur le col ➔ Stimulation nerveuse ➔ Hypophyse libère Ocytocine ➔ Contractions plus fortes ➔ Pression augmente...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}