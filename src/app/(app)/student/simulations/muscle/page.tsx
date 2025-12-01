"use client";
import React, { useState } from 'react';
import Muscle3D from '@/components/simulations/Muscle3D';
import { simulateMuscle, MuscleData } from '@/services/api';
import Cookies from 'js-cookie';
import { 
    Dumbbell, 
    Zap, 
    Droplet, 
    Play, 
    RotateCcw, 
    Microscope, 
    CheckCircle2, 
    Lock, 
    Unlock 
} from 'lucide-react';

export default function MusclePage() {
    const [params, setParams] = useState({ atpLevel: 'HIGH', calciumLevel: 'LOW' });
    const [data, setData] = useState<MuscleData>({ state: 'RELAXED', sarcomereLength: 100, message: "Le muscle est au repos." });
    const [loading, setLoading] = useState(false);

    const run = async (newParams: typeof params) => {
        setLoading(true);
        setParams(newParams);
        const token = Cookies.get('token');
        if(!token) return;
        
        try {
            const res = await simulateMuscle(newParams, token);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Détermination de l'étape du cycle pour l'affichage pédagogique
    const getCycleStep = () => {
        if (params.calciumLevel === 'LOW') return 1; // Repos / Masquage
        if (params.calciumLevel === 'HIGH' && params.atpLevel === 'HIGH') return 3; // Contraction
        if (params.calciumLevel === 'HIGH' && params.atpLevel === 'LOW') return 4; // Rigor
        return 1;
    };
    const step = getCycleStep();

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex gap-3 items-center text-gray-900 dark:text-white">
                        <Dumbbell className="text-red-600" size={32} /> 
                        Contraction Musculaire
                    </h1>
                    <p className="text-gray-500 mt-1">Laboratoire de physiologie moléculaire : Sarcomère</p>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm">
                    <Microscope size={16} className="text-blue-500"/>
                    <span className="font-mono text-gray-600 dark:text-gray-300">ZOOM: x100,000</span>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* --- COLONNE GAUCHE : CONTRÔLES (3 cols) --- */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Carte Calcium */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${params.calciumLevel === 'HIGH' ? 'bg-blue-50 border-blue-200 shadow-md shadow-blue-100 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
                                <div className={`p-2 rounded-lg ${params.calciumLevel === 'HIGH' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>
                                    <Droplet size={20}/>
                                </div>
                                Calcium (Ca²⁺)
                            </div>
                            <div className={`w-3 h-3 rounded-full ${params.calciumLevel === 'HIGH' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 h-10">
                            Nécessaire pour démasquer les sites de liaison sur l'actine.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => run({...params, calciumLevel: 'LOW'})}
                                className={`py-2 text-xs font-bold rounded-lg border transition-colors ${params.calciumLevel === 'LOW' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600'}`}
                            >
                                RELÂCHER
                            </button>
                            <button 
                                onClick={() => run({...params, calciumLevel: 'HIGH'})}
                                className={`py-2 text-xs font-bold rounded-lg border transition-colors ${params.calciumLevel === 'HIGH' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600'}`}
                            >
                                INJECTER
                            </button>
                        </div>
                    </div>

                    {/* Carte ATP */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${params.atpLevel === 'HIGH' ? 'bg-yellow-50 border-yellow-200 shadow-md shadow-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
                                <div className={`p-2 rounded-lg ${params.atpLevel === 'HIGH' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>
                                    <Zap size={20}/>
                                </div>
                                ATP (Énergie)
                            </div>
                            <div className={`w-3 h-3 rounded-full ${params.atpLevel === 'HIGH' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 h-10">
                            Indispensable pour le pivotement et le détachement des têtes de myosine.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => run({...params, atpLevel: 'LOW'})}
                                className={`py-2 text-xs font-bold rounded-lg border transition-colors ${params.atpLevel === 'LOW' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600'}`}
                            >
                                ÉPUISER
                            </button>
                            <button 
                                onClick={() => run({...params, atpLevel: 'HIGH'})}
                                className={`py-2 text-xs font-bold rounded-lg border transition-colors ${params.atpLevel === 'HIGH' ? 'bg-yellow-500 text-white border-yellow-500' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600'}`}
                            >
                                FOURNIR
                            </button>
                        </div>
                    </div>

                    {/* État Global */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">État du muscle</div>
                        <div className="text-lg font-black flex items-center gap-2">
                            {data.state === 'RELAXED' && <span className="text-blue-500 flex items-center gap-2"><Unlock size={18}/> RELÂCHÉ</span>}
                            {data.state === 'CONTRACTED' && <span className="text-green-600 flex items-center gap-2"><Play size={18} className="fill-current"/> CONTRACTÉ</span>}
                            {data.state === 'RIGOR' && <span className="text-red-600 flex items-center gap-2"><Lock size={18}/> RIGOR MORTIS</span>}
                        </div>
                    </div>

                </div>

                {/* --- COLONNE CENTRALE : VISUALISATION 3D (6 cols) --- */}
                <div className="lg:col-span-6">
                    <div className="bg-black rounded-2xl overflow-hidden h-[600px] relative border-4 border-gray-800 shadow-2xl">
                        {/* Overlay Informationnel */}
                        <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
                            <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                <div className="w-2 h-2 rounded-full bg-red-600"></div> Myosine (Épais)
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div> Actine (Fin)
                            </div>
                        </div>

                        {/* Scène 3D */}
                        <Muscle3D 
                            sarcomereLength={data.sarcomereLength} 
                            calcium={params.calciumLevel === 'HIGH'}
                            atp={params.atpLevel === 'HIGH'}
                        />
                        
                        {/* Indicateur de longueur */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-mono border border-gray-700">
                            Longueur Sarcomère: {data.sarcomereLength}%
                        </div>
                    </div>
                </div>

                {/* --- COLONNE DROITE : EXPLICATIONS CYCLE (3 cols) --- */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 h-fit">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Cycle Moléculaire</h3>
                    
                    <div className="space-y-4 relative">
                        {/* Ligne verticale de progression */}
                        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

                        {/* Étape 1 : Repos */}
                        <div className={`relative z-10 pl-10 transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold bg-white dark:bg-gray-800 ${step === 1 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-400'}`}>1</div>
                            <h4 className="font-bold text-sm">Repos / Masquage</h4>
                            <p className="text-xs text-gray-500 mt-1">La troponine cache les sites de fixation. Pas de ponts.</p>
                        </div>

                        {/* Étape 2 : Calcium */}
                        <div className={`relative z-10 pl-10 transition-opacity duration-500 ${params.calciumLevel === 'HIGH' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                             <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold bg-white dark:bg-gray-800 ${params.calciumLevel === 'HIGH' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-400'}`}>2</div>
                            <h4 className="font-bold text-sm">Libération Ca²⁺</h4>
                            <p className="text-xs text-gray-500 mt-1">Le Ca²⁺ se fixe à la troponine. Les sites de l'actine sont exposés.</p>
                        </div>

                        {/* Étape 3 : Contraction */}
                        <div className={`relative z-10 pl-10 transition-opacity duration-500 ${step === 3 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                             <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold bg-white dark:bg-gray-800 ${step === 3 ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-400'}`}>3</div>
                            <h4 className="font-bold text-sm">Pivotement (Power Stroke)</h4>
                            <p className="text-xs text-gray-500 mt-1">Les têtes de myosine s'accrochent et tirent l'actine (ADP libéré).</p>
                        </div>

                        {/* Étape 4 : Détachement (Rôle ATP) */}
                        <div className={`relative z-10 pl-10 transition-opacity duration-500 ${step === 4 ? 'opacity-100 text-red-600' : 'opacity-40 grayscale'}`}>
                             <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold bg-white dark:bg-gray-800 ${step === 4 ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-400'}`}>4</div>
                            <h4 className="font-bold text-sm">{step === 4 ? "Manque d'ATP !" : "Rechargement ATP"}</h4>
                            <p className="text-xs mt-1">
                                {step === 4 ? "Sans ATP, les têtes restent accrochées = Rigidité." : "L'ATP permet à la tête de se détacher et se redresser."}
                            </p>
                        </div>

                    </div>
                    
                    <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs italic text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        "{data.message}"
                    </div>
                </div>

            </div>
        </div>
    );
}